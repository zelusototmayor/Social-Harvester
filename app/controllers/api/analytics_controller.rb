module Api
  class AnalyticsController < BaseController
    def overview
      campaigns = current_user.campaigns
      leads = Lead.joins(:campaign).where(campaigns: { user_id: current_user.id })

      render json: {
        overview: {
          total_campaigns: campaigns.count,
          active_campaigns: campaigns.active_campaigns.count,
          total_leads: leads.count,
          new_leads: leads.new_lead.count,
          high_intent_leads: leads.high_intent.count,
          engaged_leads: leads.engaged.count,
          dismissed_leads: leads.dismissed.count
        },
        leads_by_status: {
          new_lead: leads.new_lead.count,
          reviewed: leads.reviewed.count,
          engaged: leads.engaged.count,
          dismissed: leads.dismissed.count
        },
        leads_by_category: {
          question: leads.question.count,
          complaint: leads.complaint.count,
          recommendation_request: leads.recommendation_request.count,
          competitor_mention: leads.competitor_mention.count,
          none: leads.none.count
        },
        recent_activity: recent_activity,
        campaigns_performance: campaigns_performance(campaigns)
      }
    end

    private

    def recent_activity
      Lead.joins(:campaign)
        .where(campaigns: { user_id: current_user.id })
        .order(created_at: :desc)
        .limit(5)
        .map do |lead|
          {
            id: lead.id,
            type: 'new_lead',
            commenter_username: lead.commenter_username,
            intent_score: lead.intent_score.to_f,
            campaign_name: lead.campaign.name,
            created_at: lead.created_at
          }
        end
    end

    def campaigns_performance(campaigns)
      campaigns.map do |campaign|
        leads = campaign.leads

        {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          total_leads: leads.count,
          high_intent_leads: leads.high_intent.count,
          engagement_rate: calculate_engagement_rate(leads),
          last_scraped_at: campaign.last_scraped_at
        }
      end
    end

    def calculate_engagement_rate(leads)
      return 0 if leads.count.zero?
      ((leads.engaged.count.to_f / leads.count) * 100).round(1)
    end
  end
end
