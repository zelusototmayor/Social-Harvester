module Api
  class CampaignsController < BaseController
    before_action :set_campaign, only: [:show, :update, :destroy, :scrape]

    def index
      @campaigns = current_user.campaigns.order(created_at: :desc)
      render json: {
        campaigns: @campaigns.map { |c| campaign_json(c) }
      }
    end

    def show
      render json: { campaign: campaign_json(@campaign, include_stats: true) }
    end

    def create
      @campaign = current_user.campaigns.build(campaign_params)

      if @campaign.save
        render json: { campaign: campaign_json(@campaign) }, status: :created
      else
        render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @campaign.update(campaign_params)
        render json: { campaign: campaign_json(@campaign) }
      else
        render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @campaign.destroy
      render json: { message: 'Campaign deleted successfully' }
    end

    def scrape
      ScrapeCommentsJob.perform_later(@campaign.id)
      render json: { message: 'Scrape job queued successfully' }
    end

    private

    def set_campaign
      @campaign = current_user.campaigns.find(params[:id])
    end

    def campaign_params
      params.require(:campaign).permit(:name, :status, :product_id, target_handles: [], keywords: [])
    end

    def campaign_json(campaign, include_stats: false)
      json = {
        id: campaign.id,
        name: campaign.name,
        target_handles: campaign.target_handles,
        keywords: campaign.keywords,
        status: campaign.status,
        product_id: campaign.product_id,
        product: campaign.product ? { id: campaign.product.id, name: campaign.product.name } : nil,
        last_scraped_at: campaign.last_scraped_at,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at
      }

      if include_stats
        json[:stats] = {
          total_leads: campaign.leads.count,
          new_leads: campaign.leads.new_lead.count,
          high_intent_leads: campaign.leads.high_intent.count,
          engaged_leads: campaign.leads.engaged.count
        }
      end

      json
    end
  end
end
