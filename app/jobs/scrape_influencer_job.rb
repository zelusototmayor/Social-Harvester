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

    apify_service = ApifyService.new

    # Check if scan was cancelled before starting
    return if scan_id && progress&.cancelled?(scan_id)

    # Step 1: Fetch post metadata from Instagram
    progress&.update_source(scan_id, source_name, "scraping", "Fetching posts from @#{influencer.handle}...")
    all_posts = apify_service.fetch_post_urls(influencer.handle, limit: ApifyService::POSTS_PER_HANDLE)
    Rails.logger.info "Found #{all_posts.count} posts from @#{influencer.handle}"

    if all_posts.empty?
      progress&.complete_source(scan_id, source_name)
      influencer.mark_scraped!
      return
    end

    # Step 2: Filter posts - skip already scanned posts
    posts_to_process = filter_posts(all_posts, influencer)
    Rails.logger.info "#{posts_to_process.count} new posts to process"

    if posts_to_process.empty?
      progress&.complete_source(scan_id, source_name)
      influencer.mark_scraped!
      return
    end

    # Check if scan was cancelled
    return if scan_id && progress&.cancelled?(scan_id)

    # Step 3: Scrape comments from filtered posts
    progress&.update_source(scan_id, source_name, "scraping", "Fetching comments from #{posts_to_process.count} posts...")
    comments = apify_service.scrape_instagram_handle(influencer.handle, posts_to_process: posts_to_process)

    Rails.logger.info "Found #{comments.count} comments from @#{influencer.handle}"

    # Step 4: Record scanned posts
    record_scanned_posts(posts_to_process, influencer, product)

    if comments.empty?
      progress&.complete_source(scan_id, source_name)
      influencer.mark_scraped!
      return
    end

    # Step 5: Filter out comments we already have
    progress&.update_source(scan_id, source_name, "filtering", "Filtering #{comments.count} comments...")
    new_comments = comments.reject do |comment|
      Lead.exists?(external_comment_id: comment[:external_comment_id])
    end

    Rails.logger.info "#{new_comments.count} new comments to analyze"

    # Check if scan was cancelled
    return if scan_id && progress&.cancelled?(scan_id)

    if new_comments.any?
      # Step 6: Analyze with AI
      progress&.update_source(scan_id, source_name, "analyzing", "Analyzing #{new_comments.count} new comments with AI...")
      analyzer = OpenaiIntentAnalyzer.new
      ai_results = analyzer.analyze_batch(comments: new_comments, product: product)

      Rails.logger.info "AI identified #{ai_results.count} potential leads"

      # Create lookup for AI results by external_comment_id
      ai_lookup = ai_results.index_by { |r| r[:external_comment_id] }

      # Step 7: Create leads
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

  private

  # Filter posts - skip already scanned posts
  def filter_posts(posts, source)
    posts.select do |post|
      shortcode = post[:shortcode]
      next false unless shortcode

      # Skip already scanned posts
      !ScannedPost.already_scanned?(source: source, shortcode: shortcode)
    end
  end

  # Record posts as scanned
  def record_scanned_posts(posts, source, product)
    posts.each do |post|
      ScannedPost.record_scan!(
        source: source,
        product: product,
        post_url: post[:url],
        shortcode: post[:shortcode]
      )
    end
  end
end
