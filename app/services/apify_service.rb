class ApifyService
  APIFY_BASE_URL = 'https://api.apify.com/v2'

  # Actor for fetching profile posts and hashtag posts
  INSTAGRAM_SCRAPER_ACTOR = 'apify~instagram-scraper'

  # Dedicated comments actor - pay-per-event pricing ($0.0075/post, 15 FREE)
  # Much cheaper than using the generic scraper for comments
  INSTAGRAM_COMMENTS_ACTOR = 'apidojo~instagram-comments-scraper-api'

  # Configuration
  POSTS_PER_HANDLE = 10      # Number of recent posts to fetch per influencer
  COMMENTS_PER_POST = 100    # Max comments to fetch per post (new actor supports more)

  class ApifyError < StandardError; end

  def initialize
    @api_token = ENV.fetch('APIFY_TOKEN') { raise ApifyError, 'APIFY_TOKEN not configured' }
  end

  # Scrape comments from a single Instagram handle (for Influencer model)
  # Now accepts optional posts_to_process parameter for filtered posts
  def scrape_instagram_handle(handle, posts_to_process: nil)
    all_comments = []
    handle = handle.gsub(/^@/, '') # Remove @ if present

    Rails.logger.info "Scraping posts from @#{handle}..."

    # Step 1: Get recent post metadata (if not already filtered)
    posts = posts_to_process || fetch_post_urls(handle, limit: POSTS_PER_HANDLE)
    Rails.logger.info "Processing #{posts.length} posts from @#{handle}"

    # Step 2: Fetch comments for each post
    posts.each do |post|
      post_url = post.is_a?(Hash) ? post[:url] : post
      begin
        comments = fetch_comments_for_post(post_url, limit: COMMENTS_PER_POST)
        Rails.logger.info "Found #{comments.length} comments on #{post_url}"

        comments.each do |comment|
          # Skip comments from the profile owner
          commenter = comment.dig('user', 'username') || comment['ownerUsername'] || comment['username']
          next if commenter == handle

          all_comments << normalize_comment(comment, handle, post_url)
        end
      rescue ApifyError => e
        Rails.logger.error "Failed to fetch comments for #{post_url}: #{e.message}"
      end
    end

    Rails.logger.info "Total comments collected from @#{handle}: #{all_comments.length}"
    all_comments
  end

  # Scrape posts/comments from a hashtag (for Hashtag model)
  # Now accepts optional posts_to_process parameter for filtered posts
  def scrape_instagram_hashtag(tag, posts_to_process: nil)
    all_comments = []
    tag = tag.gsub(/^#/, '') # Remove # if present

    Rails.logger.info "Scraping posts from ##{tag}..."

    # Step 1: Get recent post metadata (if not already filtered)
    posts = posts_to_process || fetch_hashtag_posts(tag, limit: POSTS_PER_HANDLE)
    Rails.logger.info "Processing #{posts.length} posts with ##{tag}"

    # Step 2: Fetch comments for each post
    posts.each do |post|
      post_url = post.is_a?(Hash) ? post[:url] : post
      begin
        comments = fetch_comments_for_post(post_url, limit: COMMENTS_PER_POST)
        Rails.logger.info "Found #{comments.length} comments on #{post_url}"

        # Extract source username from post URL
        source_username = extract_username_from_post(post_url)

        comments.each do |comment|
          all_comments << normalize_comment(comment, source_username, post_url)
        end
      rescue ApifyError => e
        Rails.logger.error "Failed to fetch comments for #{post_url}: #{e.message}"
      end
    end

    Rails.logger.info "Total comments collected from ##{tag}: #{all_comments.length}"
    all_comments
  end

  # Legacy method for campaign-based scraping (to be removed after migration)
  def scrape_campaign_comments(campaign)
    all_comments = []

    campaign.target_handles.each do |handle|
      begin
        comments = scrape_instagram_handle(handle)
        all_comments.concat(comments)
      rescue ApifyError => e
        Rails.logger.error "Failed to scrape #{handle}: #{e.message}"
      end
    end

    Rails.logger.info "Total comments collected: #{all_comments.length}"
    all_comments
  end

  private

  # Fetch post metadata from a profile
  # Returns: [{url:, shortcode:, is_pinned:, timestamp:}, ...]
  def fetch_post_urls(username, limit: 10)
    profile_url = "https://www.instagram.com/#{username}/"

    response = HTTParty.post(
      "#{APIFY_BASE_URL}/acts/#{INSTAGRAM_SCRAPER_ACTOR}/runs?waitForFinish=300",
      headers: auth_headers,
      body: {
        directUrls: [profile_url],
        resultsType: 'posts',
        resultsLimit: limit
      }.to_json,
      timeout: 320
    )

    handle_response(response)

    run_data = response['data']
    if run_data['status'] == 'SUCCEEDED'
      posts = fetch_results(run_data['id'])
      # Return post metadata for valid posts (containing /p/ or /reel/)
      post_data = posts.filter_map do |post|
        url = post['url']
        next unless url&.include?('/p/') || url&.include?('/reel/')

        {
          url: url,
          shortcode: extract_shortcode(url),
          timestamp: post['timestamp']
        }
      end

      if post_data.empty? && posts.any?
        Rails.logger.warn "No accessible posts found for #{username} - account may be private"
      end

      post_data
    else
      raise ApifyError, "Run failed: #{run_data['status']} - #{run_data['statusMessage']}"
    end
  end

  # Fetch post metadata from a hashtag
  # Returns: [{url:, shortcode:, is_pinned:, timestamp:}, ...]
  # Note: Hashtag posts don't have isPinnedToProfile, so is_pinned is always false
  def fetch_hashtag_posts(tag, limit: 10)
    hashtag_url = "https://www.instagram.com/explore/tags/#{tag}/"

    response = HTTParty.post(
      "#{APIFY_BASE_URL}/acts/#{INSTAGRAM_SCRAPER_ACTOR}/runs?waitForFinish=300",
      headers: auth_headers,
      body: {
        directUrls: [hashtag_url],
        resultsType: 'posts',
        resultsLimit: limit
      }.to_json,
      timeout: 320
    )

    handle_response(response)

    run_data = response['data']
    if run_data['status'] == 'SUCCEEDED'
      posts = fetch_results(run_data['id'])
      posts.filter_map do |post|
        url = post['url']
        next unless url&.include?('/p/') || url&.include?('/reel/')

        {
          url: url,
          shortcode: extract_shortcode(url),
          timestamp: post['timestamp']
        }
      end
    else
      raise ApifyError, "Run failed: #{run_data['status']} - #{run_data['statusMessage']}"
    end
  end

  # Fetch comments for a specific post using the dedicated comments actor
  # Uses apidojo/instagram-comments-scraper-api - pay-per-event at $0.0075/post
  def fetch_comments_for_post(post_url, limit: 100)
    response = HTTParty.post(
      "#{APIFY_BASE_URL}/acts/#{INSTAGRAM_COMMENTS_ACTOR}/runs?waitForFinish=300",
      headers: auth_headers,
      body: {
        startUrls: [post_url]  # Plain URL strings, not objects
      }.to_json,
      timeout: 320
    )

    handle_response(response)

    run_data = response['data']
    if run_data['status'] == 'SUCCEEDED'
      fetch_results(run_data['id'])
    else
      raise ApifyError, "Run failed: #{run_data['status']} - #{run_data['statusMessage']}"
    end
  end

  def fetch_results(run_id)
    response = HTTParty.get(
      "#{APIFY_BASE_URL}/actor-runs/#{run_id}/dataset/items",
      headers: auth_headers
    )

    handle_response(response)
    response.parsed_response
  end

  def normalize_comment(comment, source_username, post_url)
    # Handle different field names from various Apify actors
    # New actor (apidojo): user.username, message, createdAt
    # Old actor (apify): ownerUsername, text, timestamp
    username = comment.dig('user', 'username') ||
               comment['ownerUsername'] ||
               comment['username'] ||
               comment.dig('owner', 'username')

    comment_text = comment['message'] ||  # New actor uses 'message'
                   comment['text'] ||
                   comment['comment'] ||
                   comment['content']

    comment_id = comment['id'] || comment['commentId'] || comment['pk']

    timestamp = comment['createdAt'] ||   # New actor uses 'createdAt'
                comment['timestamp'] ||
                comment['created_at'] ||
                comment.dig('created_at_utc')

    {
      external_comment_id: comment_id,
      source_post_url: post_url,
      source_username: source_username,
      commenter_username: username,
      commenter_profile_url: username ? "https://www.instagram.com/#{username}/" : nil,
      comment_text: comment_text,
      comment_timestamp: parse_timestamp(timestamp)
    }
  end

  def extract_username_from_post(post_url)
    # Try to extract username from post URL if available in metadata
    # For hashtag posts, we may not have the source username
    nil
  end

  # Extract shortcode from an Instagram post URL
  def extract_shortcode(url)
    return nil unless url.present?

    # Match /p/SHORTCODE/ or /reel/SHORTCODE/
    if url =~ %r{instagram\.com/(?:p|reel)/([^/?]+)}
      $1
    else
      nil
    end
  end

  def parse_timestamp(timestamp)
    return Time.current unless timestamp

    if timestamp.is_a?(Integer)
      Time.at(timestamp)
    else
      Time.parse(timestamp.to_s)
    end
  rescue
    Time.current
  end

  def auth_headers
    {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{@api_token}"
    }
  end

  def handle_response(response)
    unless response.success?
      error_message = response['error']&.dig('message') || response.message
      raise ApifyError, "Apify API error: #{error_message}"
    end
  end
end
