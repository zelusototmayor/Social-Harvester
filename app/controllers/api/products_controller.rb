module Api
  class ProductsController < BaseController
    before_action :require_organization!
    before_action :set_product, only: [:show, :update, :destroy, :dashboard, :trigger_scan, :stop_scan, :leads, :scan_status]

    # GET /api/products
    def index
      # Preload counts to avoid N+1 queries
      @products = organization_products
        .select('products.*')
        .select('(SELECT COUNT(*) FROM influencers WHERE influencers.product_id = products.id) AS influencers_count_cache')
        .select('(SELECT COUNT(*) FROM hashtags WHERE hashtags.product_id = products.id) AS hashtags_count_cache')
        .select('(SELECT COUNT(*) FROM leads WHERE leads.product_id = products.id) AS leads_count_cache')
        .select('(SELECT COUNT(*) FROM leads WHERE leads.product_id = products.id AND leads.intent_score >= 0.6) AS relevant_leads_count_cache')
        .order(:name)

      render json: {
        products: @products.map { |p| serialize_product(p, use_cached_counts: true) }
      }
    end

    # GET /api/products/:id
    def show
      render json: serialize_product(@product, include_details: true)
    end

    # GET /api/products/:id/dashboard
    # Returns unified dashboard data: product info, influencers, hashtags, and relevant leads
    def dashboard
      # Preload influencers with leads count
      influencers = @product.influencers
        .select('influencers.*')
        .select('(SELECT COUNT(*) FROM leads WHERE leads.source_type = \'Influencer\' AND leads.source_id = influencers.id) AS leads_count_cache')
        .order(created_at: :desc)

      # Preload hashtags with leads count
      hashtags = @product.hashtags
        .select('hashtags.*')
        .select('(SELECT COUNT(*) FROM leads WHERE leads.source_type = \'Hashtag\' AND leads.source_id = hashtags.id) AS leads_count_cache')
        .order(created_at: :desc)

      # Preload leads with source info
      leads = @product.relevant_leads.includes(:source).limit(50)

      render json: {
        product: serialize_product(@product, include_details: true),
        influencers: influencers.map { |i| serialize_influencer(i, use_cached_count: true) },
        hashtags: hashtags.map { |h| serialize_hashtag(h, use_cached_count: true) },
        leads: leads.map { |l| serialize_lead(l) },
        stats: @product.dashboard_stats
      }
    end

    # GET /api/products/:id/leads
    # Returns paginated leads for this product with optional filters
    def leads
      @leads = @product.leads.includes(:source).order(created_at: :desc)

      # Apply filters
      @leads = @leads.relevant if params[:relevant_only] == 'true'
      @leads = @leads.where(status: params[:status]) if params[:status].present?
      @leads = @leads.from_influencer if params[:source_type] == 'influencer'
      @leads = @leads.from_hashtag if params[:source_type] == 'hashtag'

      # Pagination
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 20).to_i.clamp(1, 100)
      total = @leads.count
      @leads = @leads.offset((page - 1) * per_page).limit(per_page)

      render json: {
        leads: @leads.map { |l| serialize_lead(l) },
        meta: {
          page: page,
          per_page: per_page,
          total: total,
          total_pages: (total.to_f / per_page).ceil
        }
      }
    end

    # POST /api/products/:id/trigger_scan
    # Manually trigger scanning for this product's influencers and hashtags
    def trigger_scan
      # Check scan limit
      unless current_organization.can_scan?
        return render json: {
          error: 'Scan limit reached',
          message: 'You have reached your monthly scan limit. Upgrade your plan for more scans.',
          upgrade_required: true
        }, status: :payment_required
      end

      influencers = @product.active_influencers.to_a
      hashtags = @product.active_hashtags.to_a
      total_sources = influencers.size + hashtags.size

      scan_id = SecureRandom.hex(8)
      source_names = influencers.map { |i| "@#{i.handle}" } + hashtags.map { |h| "##{h.tag}" }

      # Initialize scan progress in Redis
      if total_sources > 0
        progress = ScanProgressService.new(@product.id)
        progress.start_scan!(scan_id, total_sources, source_names)

        # Increment scan usage
        current_organization.current_usage.increment_scans!
      end

      # Queue influencer scraping jobs
      influencers.each do |influencer|
        ScrapeInfluencerJob.perform_later(influencer.id, scan_id)
      end

      # Queue hashtag scraping jobs
      hashtags.each do |hashtag|
        ScrapeHashtagJob.perform_later(hashtag.id, scan_id)
      end

      render json: {
        message: 'Scan triggered successfully',
        scan_id: scan_id,
        influencers_queued: influencers.size,
        hashtags_queued: hashtags.size
      }
    end

    # POST /api/products/:id/stop_scan
    def stop_scan
      progress = ScanProgressService.new(@product.id)
      progress.cancel_scan!
      render json: { message: 'Scan stopped' }
    end

    # GET /api/products/:id/scan_status
    def scan_status
      progress = ScanProgressService.new(@product.id)
      render json: progress.current_status
    end

    # POST /api/products
    def create
      # Check product limit
      unless current_organization.can_create_product?
        return render json: {
          error: 'Product limit reached',
          message: 'You have reached your product limit. Upgrade your plan to add more products.',
          upgrade_required: true
        }, status: :payment_required
      end

      @product = current_organization.products.build(product_params)
      @product.user = current_user  # Keep legacy association during migration

      if @product.save
        render json: serialize_product(@product), status: :created
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /api/products/:id
    def update
      if @product.update(product_params)
        render json: serialize_product(@product)
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/products/:id
    def destroy
      @product.destroy
      head :no_content
    end

    # POST /api/products/analyze_url
    def analyze_url
      url = params[:url]

      if url.blank?
        return render json: { error: 'URL is required' }, status: :bad_request
      end

      scraper = WebsiteScraperService.new
      result = scraper.extract_product_info(url)

      render json: {
        name: result['name'],
        description: result['description'],
        target_audience: result['target_audience'],
        pain_points: result['pain_points'],
        key_features: result['key_features'],
        website_url: url
      }
    rescue WebsiteScraperService::ScraperError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    private

    def set_product
      @product = organization_products.find(params[:id])
    end

    def product_params
      params.require(:product).permit(
        :name, :website_url, :description, :target_audience,
        :pain_points, :key_features, :status
      )
    end

    def serialize_product(product, include_details: false, use_cached_counts: false)
      # Use cached counts if available (from index query with subselects)
      if use_cached_counts && product.respond_to?(:influencers_count_cache)
        influencers_count = product.influencers_count_cache.to_i
        hashtags_count = product.hashtags_count_cache.to_i
        leads_count = product.leads_count_cache.to_i
        relevant_leads_count = product.relevant_leads_count_cache.to_i
      else
        influencers_count = product.influencers.count
        hashtags_count = product.hashtags.count
        leads_count = product.leads.count
        relevant_leads_count = product.relevant_leads.count
      end

      data = {
        id: product.id,
        name: product.name,
        website_url: product.website_url,
        status: product.status,
        influencers_count: influencers_count,
        hashtags_count: hashtags_count,
        leads_count: leads_count,
        relevant_leads_count: relevant_leads_count,
        created_at: product.created_at,
        updated_at: product.updated_at
      }

      if include_details
        data.merge!(
          description: product.description,
          target_audience: product.target_audience,
          pain_points: product.pain_points,
          key_features: product.key_features
        )
      end

      data
    end

    def serialize_influencer(influencer, use_cached_count: false)
      leads_count = if use_cached_count && influencer.respond_to?(:leads_count_cache)
        influencer.leads_count_cache.to_i
      else
        influencer.leads.count
      end

      {
        id: influencer.id,
        handle: influencer.handle,
        platform: influencer.platform,
        status: influencer.status,
        profile_url: influencer.profile_url,
        last_scraped_at: influencer.last_scraped_at,
        scrape_count: influencer.scrape_count,
        leads_count: leads_count,
        created_at: influencer.created_at
      }
    end

    def serialize_hashtag(hashtag, use_cached_count: false)
      leads_count = if use_cached_count && hashtag.respond_to?(:leads_count_cache)
        hashtag.leads_count_cache.to_i
      else
        hashtag.leads.count
      end

      {
        id: hashtag.id,
        tag: hashtag.tag,
        platform: hashtag.platform,
        status: hashtag.status,
        hashtag_url: hashtag.hashtag_url,
        last_scraped_at: hashtag.last_scraped_at,
        scrape_count: hashtag.scrape_count,
        leads_count: leads_count,
        created_at: hashtag.created_at
      }
    end

    def serialize_lead(lead)
      {
        id: lead.id,
        commenter_username: lead.commenter_username,
        comment_text: lead.comment_text,
        intent_score: lead.intent_score,
        intent_category: lead.intent_category,
        status: lead.status,
        source_type: lead.source_type,
        source_display: lead.source_display,
        source_post_url: lead.source_post_url,
        source_username: lead.source_username,
        ai_suggested_reply: lead.ai_suggested_reply,
        instagram_profile_url: lead.instagram_profile_url,
        instagram_comment_url: lead.instagram_comment_url,
        created_at: lead.created_at
      }
    end
  end
end
