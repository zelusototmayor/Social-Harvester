class ScrapeInfluencerJob < ApplicationJob
  queue_as :scraping

  retry_on StandardError, wait: :polynomially_longer, attempts: 3

  def perform(influencer_id, scan_id = nil)
    influencer = Influencer.find_by(id: influencer_id)
    return unless influencer&.status == 'active'

    product = influencer.product
    source_name = "@#{influencer.handle}"
    progress = scan_id ? ScanProgressService.new(product.id) : nil

    Rails.logger.info "Starting scrape for influencer @#{influencer.handle} (Product: #{product.name})"

    # Step 1: Scrape comments from Instagram for this influencer
    progress&.update_source(scan_id, source_name, "scraping", "Fetching posts from @#{influencer.handle}...")
    apify_service = ApifyService.new
    comments = apify_service.scrape_instagram_handle(influencer.handle)

    Rails.logger.info "Found #{comments.count} comments from @#{influencer.handle}"
    if comments.empty?
      progress&.complete_source(scan_id, source_name)
      return
    end

    # Step 2: Filter out comments we already have
    progress&.update_source(scan_id, source_name, "filtering", "Filtering #{comments.count} comments...")
    new_comments = comments.reject do |comment|
      Lead.exists?(external_comment_id: comment[:external_comment_id])
    end

    Rails.logger.info "#{new_comments.count} new comments to analyze"

    if new_comments.any?
      # Step 3: Analyze with AI
      progress&.update_source(scan_id, source_name, "analyzing", "Analyzing #{new_comments.count} new comments with AI...")
      analyzer = OpenaiIntentAnalyzer.new
      ai_results = analyzer.analyze_batch(comments: new_comments, product: product)

      Rails.logger.info "AI identified #{ai_results.count} potential leads"

      # Create lookup for AI results by external_comment_id
      ai_lookup = ai_results.index_by { |r| r[:external_comment_id] }

      # Step 4: Create leads
      progress&.update_source(scan_id, source_name, "saving", "Saving leads from @#{influencer.handle}...")
      new_leads_count = 0
      new_comments.each do |comment|
        ai_result = ai_lookup[comment[:external_comment_id]]

        Lead.create!(
          product: product,
          source: influencer,
          external_comment_id: comment[:external_comment_id],
          source_post_url: comment[:source_post_url],
          source_username: comment[:source_username],
          commenter_username: comment[:commenter_username],
          commenter_profile_url: comment[:commenter_profile_url],
          comment_text: comment[:comment_text],
          comment_timestamp: comment[:comment_timestamp],
          status: :new_lead,
          intent_score: ai_result ? ai_result[:score] : 0.0,
          intent_category: ai_result ? :recommendation_request : :no_intent,
          ai_suggested_reply: ai_result&.dig(:reply)
        )
        new_leads_count += 1
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.warn "Failed to create lead: #{e.message}"
      end

      progress&.increment_leads_found(scan_id, new_leads_count)
      Rails.logger.info "Created #{new_leads_count} new leads from @#{influencer.handle}"
    end

    # Update influencer's last scraped timestamp
    influencer.mark_scraped!
    progress&.complete_source(scan_id, source_name)

  rescue ApifyService::ApifyError => e
    Rails.logger.error "Apify error for influencer #{influencer_id} (@#{influencer&.handle}): #{e.message}"
    influencer&.mark_error!
    progress&.fail_source(scan_id, source_name, e.message) if scan_id
    raise # Re-raise for Sidekiq retry
  rescue OpenaiIntentAnalyzer::OpenAIError => e
    Rails.logger.error "OpenAI error for influencer #{influencer_id}: #{e.message}"
    # Still mark as scraped since we got the comments
    influencer&.mark_scraped!
    progress&.fail_source(scan_id, source_name, e.message) if scan_id
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "Influencer #{influencer_id} not found"
  end
end
