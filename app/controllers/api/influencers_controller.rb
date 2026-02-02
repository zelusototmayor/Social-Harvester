module Api
  class InfluencersController < BaseController
    before_action :require_organization!
    before_action :set_product
    before_action :set_influencer, only: [:show, :update, :destroy]

    # GET /api/products/:product_id/influencers
    def index
      @influencers = @product.influencers.order(created_at: :desc)
      render json: {
        influencers: @influencers.map { |i| serialize_influencer(i) }
      }
    end

    # GET /api/products/:product_id/influencers/:id
    def show
      render json: serialize_influencer(@influencer)
    end

    # POST /api/products/:product_id/influencers
    def create
      # Check source limit
      unless current_organization.can_add_source?(@product)
        return render json: {
          error: 'Source limit reached',
          message: 'You have reached the source limit for this product. Upgrade your plan to add more sources.',
          upgrade_required: true
        }, status: :payment_required
      end

      @influencer = @product.influencers.build(influencer_params)

      if @influencer.save
        render json: serialize_influencer(@influencer), status: :created
      else
        render json: { errors: @influencer.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /api/products/:product_id/influencers/:id
    def update
      if @influencer.update(influencer_params)
        render json: serialize_influencer(@influencer)
      else
        render json: { errors: @influencer.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/products/:product_id/influencers/:id
    def destroy
      @influencer.destroy
      head :no_content
    end

    private

    def set_product
      @product = organization_products.find(params[:product_id])
    end

    def set_influencer
      @influencer = @product.influencers.find(params[:id])
    end

    def influencer_params
      params.require(:influencer).permit(:handle, :platform, :status)
    end

    def serialize_influencer(influencer)
      {
        id: influencer.id,
        handle: influencer.handle,
        platform: influencer.platform,
        status: influencer.status,
        profile_url: influencer.profile_url,
        last_scraped_at: influencer.last_scraped_at,
        scrape_count: influencer.scrape_count,
        leads_count: influencer.leads.count,
        created_at: influencer.created_at
      }
    end
  end
end
