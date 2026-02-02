class ScrapeCommentsJob < ApplicationJob
  queue_as :scraping

  def perform(campaign_id)
    campaign = Campaign.find(campaign_id)
    return unless campaign.active?

    Rails.logger.info "Starting scrape for campaign: #{campaign.name} (ID: #{campaign.id})"

    # Step 1: Scrape comments from Instagram
    apify_service = ApifyService.new
    comments = apify_service.scrape_campaign_comments(campaign)

    Rails.logger.info "Found #{comments.count} comments for campaign #{campaign.id}"
    return if comments.empty?

    # Step 2: Filter out comments we already have
    new_comments = comments.reject do |comment|
      Lead.exists?(external_comment_id: comment[:external_comment_id])
    end

    Rails.logger.info "#{new_comments.count} new comments to analyze"
    return if new_comments.empty?

    # Step 3: Batch analyze with AI (if product is linked)
    product = campaign.product
    leads_to_create = []

    if product
      # Use batch AI analysis
      analyzer = OpenaiIntentAnalyzer.new
      ai_results = analyzer.analyze_batch(comments: new_comments, product: product)

      Rails.logger.info "AI identified #{ai_results.count} potential leads"

      # Create lookup for AI results by external_comment_id
      ai_lookup = ai_results.index_by { |r| r[:external_comment_id] }

      # Prepare leads - all comments get saved, but AI-identified ones get scores
      new_comments.each do |comment|
        ai_result = ai_lookup[comment[:external_comment_id]]

        leads_to_create << {
          comment: comment,
          intent_score: ai_result ? ai_result[:score] : 0.0,
          intent_category: ai_result ? :recommendation_request : :no_intent,
          ai_suggested_reply: ai_result&.dig(:reply),
          reasoning: ai_result&.dig(:reason)
        }
      end
    else
      # No product linked - save comments without AI analysis
      Rails.logger.info "No product linked, skipping AI analysis"
      new_comments.each do |comment|
        leads_to_create << {
          comment: comment,
          intent_score: 0.0,
          intent_category: :no_intent,
          ai_suggested_reply: nil,
          reasoning: nil
        }
      end
    end

    # Step 4: Create leads in database
    new_leads_count = 0
    leads_to_create.each do |lead_data|
      comment = lead_data[:comment]

      campaign.leads.create!(
        external_comment_id: comment[:external_comment_id],
        source_post_url: comment[:source_post_url],
        source_username: comment[:source_username],
        commenter_username: comment[:commenter_username],
        commenter_profile_url: comment[:commenter_profile_url],
        comment_text: comment[:comment_text],
        comment_timestamp: comment[:comment_timestamp],
        status: :new_lead,
        intent_score: lead_data[:intent_score],
        intent_category: lead_data[:intent_category],
        ai_suggested_reply: lead_data[:ai_suggested_reply]
      )
      new_leads_count += 1
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.warn "Failed to create lead: #{e.message}"
    end

    # Update campaign's last scraped timestamp
    campaign.update!(last_scraped_at: Time.current)

    Rails.logger.info "Created #{new_leads_count} new leads for campaign #{campaign.id}"
  rescue ApifyService::ApifyError => e
    Rails.logger.error "Apify error for campaign #{campaign_id}: #{e.message}"
    raise # Re-raise for Sidekiq retry
  rescue OpenaiIntentAnalyzer::OpenAIError => e
    Rails.logger.error "OpenAI error for campaign #{campaign_id}: #{e.message}"
    # Don't re-raise - save comments without AI analysis instead
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "Campaign #{campaign_id} not found"
  end
end
