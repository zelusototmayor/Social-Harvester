class WebsiteScraperService
  class ScraperError < StandardError; end

  def initialize
    @openai_client = OpenAI::Client.new(access_token: ENV.fetch('OPENAI_API_KEY'))
  end

  def extract_product_info(url)
    html_content = fetch_page(url)
    text_content = extract_text(html_content)

    analyze_with_ai(text_content, url)
  end

  private

  def fetch_page(url)
    uri = URI.parse(url)
    raise ScraperError, "Invalid URL" unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)

    response = HTTParty.get(url, {
      headers: {
        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      follow_redirects: true,
      timeout: 30
    })

    raise ScraperError, "Failed to fetch page: #{response.code}" unless response.success?
    response.body
  rescue HTTParty::Error, SocketError, Timeout::Error => e
    raise ScraperError, "Network error: #{e.message}"
  end

  def extract_text(html)
    doc = Nokogiri::HTML(html)

    # Remove scripts, styles, and other non-content elements
    doc.css('script, style, nav, footer, header, aside, iframe, noscript').remove

    # Get text from important elements
    important_text = []

    # Meta description
    meta_desc = doc.at('meta[name="description"]')&.[]('content')
    important_text << "Meta Description: #{meta_desc}" if meta_desc.present?

    # Page title
    title = doc.at('title')&.text&.strip
    important_text << "Page Title: #{title}" if title.present?

    # H1 headings
    doc.css('h1').each do |h1|
      important_text << "Headline: #{h1.text.strip}" if h1.text.strip.present?
    end

    # H2 headings
    doc.css('h2').each do |h2|
      important_text << "Subheading: #{h2.text.strip}" if h2.text.strip.present?
    end

    # Main content paragraphs
    doc.css('main p, article p, .content p, #content p, p').first(20).each do |p|
      text = p.text.strip
      important_text << text if text.length > 50
    end

    # List items (often features/benefits)
    doc.css('main li, article li, .features li, .benefits li').first(15).each do |li|
      text = li.text.strip
      important_text << "Feature: #{text}" if text.length > 10 && text.length < 200
    end

    important_text.join("\n\n").truncate(8000)
  end

  def analyze_with_ai(content, url)
    prompt = <<~PROMPT
      Analyze this website content and extract product/service information. Return a JSON object with these fields:

      {
        "name": "Product or company name",
        "description": "2-3 sentence description of what they offer",
        "target_audience": "Who is this product for? Be specific about demographics, roles, or situations",
        "pain_points": "What problems does this solve? List 3-5 pain points as bullet points",
        "key_features": "Main features or benefits, list 3-5 as bullet points"
      }

      Website URL: #{url}

      Website Content:
      #{content}

      Return ONLY valid JSON, no other text.
    PROMPT

    response = @openai_client.chat(
      parameters: {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a product analyst. Extract product information from website content and return structured JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }
    )

    result = response.dig('choices', 0, 'message', 'content')
    raise ScraperError, "No response from AI" if result.blank?

    # Parse JSON, handling markdown code blocks
    json_str = result.gsub(/```json\n?/, '').gsub(/```\n?/, '').strip
    JSON.parse(json_str)
  rescue JSON::ParserError => e
    raise ScraperError, "Failed to parse AI response: #{e.message}"
  rescue Faraday::Error => e
    raise ScraperError, "OpenAI API error: #{e.message}"
  end
end
