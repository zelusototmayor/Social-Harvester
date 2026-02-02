module Api
  class HashtagsController < BaseController
    before_action :require_organization!
    before_action :set_product
    before_action :set_hashtag, only: [:show, :update, :destroy]

    # GET /api/products/:product_id/hashtags
    def index
      @hashtags = @product.hashtags.order(created_at: :desc)
      render json: {
        hashtags: @hashtags.map { |h| serialize_hashtag(h) }
      }
    end

    # GET /api/products/:product_id/hashtags/:id
    def show
      render json: serialize_hashtag(@hashtag)
    end

    # POST /api/products/:product_id/hashtags
    def create
      # Check source limit
      unless current_organization.can_add_source?(@product)
        return render json: {
          error: 'Source limit reached',
          message: 'You have reached the source limit for this product. Upgrade your plan to add more sources.',
          upgrade_required: true
        }, status: :payment_required
      end

      @hashtag = @product.hashtags.build(hashtag_params)

      if @hashtag.save
        render json: serialize_hashtag(@hashtag), status: :created
      else
        render json: { errors: @hashtag.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /api/products/:product_id/hashtags/:id
    def update
      if @hashtag.update(hashtag_params)
        render json: serialize_hashtag(@hashtag)
      else
        render json: { errors: @hashtag.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/products/:product_id/hashtags/:id
    def destroy
      @hashtag.destroy
      head :no_content
    end

    private

    def set_product
      @product = organization_products.find(params[:product_id])
    end

    def set_hashtag
      @hashtag = @product.hashtags.find(params[:id])
    end

    def hashtag_params
      params.require(:hashtag).permit(:tag, :platform, :status)
    end

    def serialize_hashtag(hashtag)
      {
        id: hashtag.id,
        tag: hashtag.tag,
        platform: hashtag.platform,
        status: hashtag.status,
        hashtag_url: hashtag.hashtag_url,
        last_scraped_at: hashtag.last_scraped_at,
        scrape_count: hashtag.scrape_count,
        leads_count: hashtag.leads.count,
        created_at: hashtag.created_at
      }
    end
  end
end
