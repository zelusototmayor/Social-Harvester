module Api
  class LeadsController < BaseController
    before_action :set_lead, only: [:show, :update, :engage]

    def index
      @leads = current_user_leads
        .includes(:product, :source)
        .order(intent_score: :desc, created_at: :desc)

      # Apply filters
      @leads = @leads.where(status: params[:status]) if params[:status].present?
      @leads = @leads.where(intent_category: params[:intent_category]) if params[:intent_category].present?
      @leads = @leads.where(product_id: params[:product_id]) if params[:product_id].present?
      @leads = @leads.high_intent if params[:high_intent] == 'true'

      # Pagination
      page = (params[:page] || 1).to_i
      per_page = (params[:per_page] || 20).to_i.clamp(1, 100)
      total = @leads.count
      @leads = @leads.offset((page - 1) * per_page).limit(per_page)

      render json: {
        leads: @leads.map { |l| lead_json(l) },
        meta: {
          total: total,
          page: page,
          per_page: per_page,
          total_pages: (total.to_f / per_page).ceil
        }
      }
    end

    def show
      render json: { lead: lead_json(@lead, include_product: true) }
    end

    def update
      if @lead.update(lead_params)
        render json: { lead: lead_json(@lead) }
      else
        render json: { errors: @lead.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def engage
      engagement_log = @lead.engagement_logs.build(
        user: current_user,
        engagement_type: params[:engagement_type],
        notes: params[:notes]
      )

      if engagement_log.save
        @lead.update(status: :engaged) if @lead.new_lead? || @lead.reviewed?
        render json: {
          message: 'Engagement logged successfully',
          lead: lead_json(@lead)
        }
      else
        render json: { errors: engagement_log.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def set_lead
      @lead = current_user_leads.find(params[:id])
    end

    def current_user_leads
      # Organization-based ownership through products
      product_ids = organization_products.pluck(:id)
      Lead.where(product_id: product_ids)
    end

    def lead_params
      params.require(:lead).permit(:status)
    end

    def lead_json(lead, include_product: false)
      json = {
        id: lead.id,
        product_id: lead.product_id,
        source_post_url: lead.source_post_url,
        source_username: lead.source_username,
        commenter_username: lead.commenter_username,
        commenter_profile_url: lead.commenter_profile_url,
        comment_text: lead.comment_text,
        comment_timestamp: lead.comment_timestamp,
        intent_score: lead.intent_score.to_f,
        intent_category: lead.intent_category,
        ai_suggested_reply: lead.ai_suggested_reply,
        status: lead.status,
        instagram_profile_url: lead.instagram_profile_url,
        instagram_post_url: lead.instagram_post_url,
        instagram_comment_url: lead.instagram_comment_url,
        created_at: lead.created_at,
        updated_at: lead.updated_at
      }

      if include_product && lead.product
        json[:product] = {
          id: lead.product.id,
          name: lead.product.name
        }
      end

      json
    end
  end
end
