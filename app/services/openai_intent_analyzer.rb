class OpenaiIntentAnalyzer
  OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
  MODEL = 'gpt-4o'

  class OpenAIError < StandardError; end

  def initialize
    @api_key = ENV.fetch('OPENAI_API_KEY') { raise OpenAIError, 'OPENAI_API_KEY not configured' }
  end

  # Analyze a batch of comments for a product
  # Returns only the comments worth following up on
  def analyze_batch(comments:, product:)
    return [] if comments.empty?

    prompt = build_batch_prompt(comments, product)

    response = HTTParty.post(
      OPENAI_API_URL,
      headers: auth_headers,
      body: {
        model: MODEL,
        messages: [
          { role: 'system', content: system_prompt(product) },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000
      }.to_json,
      timeout: 60
    )

    handle_response(response)
    parse_batch_results(response, comments)
  end

  # Legacy single comment analysis (kept for backwards compatibility)
  def analyze(comment_text:, source_username:, keywords: [], product_context: nil)
    # Create a minimal product-like object for single analysis
    fake_product = OpenStruct.new(
      name: 'Product',
      description: product_context || '',
      target_audience: '',
      pain_points: '',
      key_features: ''
    )

    comments = [{
      comment_text: comment_text,
      source_username: source_username,
      commenter_username: 'user',
      id: 1
    }]

    results = analyze_batch(comments: comments, product: fake_product)

    if results.any?
      result = results.first
      {
        intent_score: result[:score],
        intent_category: 'recommendation_request',
        reasoning: result[:reason],
        ai_suggested_reply: result[:reply]
      }
    else
      {
        intent_score: 0.0,
        intent_category: 'no_intent',
        reasoning: 'No buying intent detected',
        ai_suggested_reply: nil
      }
    end
  end

  private

  def system_prompt(product)
    <<~PROMPT
      You are analyzing Instagram comments for #{product&.name || 'a product'}.

      #{product_context_section(product)}

      Your job: Find people who might benefit from this product based on what they're saying.
    PROMPT
  end

  def product_context_section(product)
    return '' unless product

    sections = []
    sections << "About the brand: #{product.description}" if product.description.present?
    sections << "Target audience: #{product.target_audience}" if product.target_audience.present?
    sections << "Problems it solves: #{product.pain_points}" if product.pain_points.present?
    sections << "Key features: #{product.key_features}" if product.key_features.present?
    sections.join("\n")
  end

  def build_batch_prompt(comments, product)
    # Build numbered list of comments
    comments_list = comments.each_with_index.map do |comment, idx|
      "#{idx + 1}. @#{comment[:commenter_username]}: \"#{comment[:comment_text]}\""
    end.join("\n")

    <<~PROMPT
      Analyze these comments and identify anyone who might be a potential customer.

      Look for:
      - Questions or frustrations the product could solve
      - People seeking recommendations or advice
      - Expressions of interest in related topics
      - Subtle signals like "I wish I could...", "I struggle with...", "I need help with..."

      Comments:
      #{comments_list}

      Return a JSON object with a "leads" array containing ONLY comments worth following up on.
      Skip generic comments like emojis, "love this", simple praise, etc.

      Format:
      {
        "leads": [
          {
            "index": <1-based comment number>,
            "username": "<username>",
            "score": <0.0-1.0 how likely they need the product>,
            "reason": "<brief explanation>",
            "reply": "<casual, friendly Instagram reply to start a conversation>"
          }
        ]
      }

      If no comments show potential, return: {"leads": []}
    PROMPT
  end

  def auth_headers
    {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{@api_key}"
    }
  end

  def handle_response(response)
    unless response.success?
      error = response.parsed_response&.dig('error', 'message') || response.message
      raise OpenAIError, "OpenAI API error: #{error}"
    end
  end

  def parse_batch_results(response, original_comments)
    content = response.dig('choices', 0, 'message', 'content')
    raise OpenAIError, 'Empty response from OpenAI' unless content

    result = JSON.parse(content)
    leads = result['leads'] || []

    # Map back to original comment data
    leads.map do |lead|
      idx = lead['index'].to_i - 1  # Convert to 0-based
      original = original_comments[idx]

      next unless original  # Skip if index is invalid

      {
        external_comment_id: original[:external_comment_id],
        commenter_username: lead['username'],
        score: lead['score'].to_f.clamp(0.0, 1.0),
        reason: lead['reason'],
        reply: lead['reply']
      }
    end.compact
  rescue JSON::ParserError => e
    raise OpenAIError, "Failed to parse OpenAI response: #{e.message}"
  end
end
