class Product < ApplicationRecord
  # New organization-based ownership
  belongs_to :organization, optional: true  # Will become required after migration

  # Legacy user ownership (to be removed after migration)
  belongs_to :user, optional: true

  # New monitoring associations
  has_many :influencers, dependent: :destroy
  has_many :hashtags, dependent: :destroy
  has_many :leads, dependent: :destroy

  # Legacy campaign association (to be removed after migration)
  has_many :campaigns, dependent: :nullify

  enum :status, { draft: 0, active: 1, archived: 2 }, default: :draft

  # Relevancy threshold for leads
  RELEVANCY_THRESHOLD = 0.60

  validates :name, presence: true
  validates :website_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true }

  scope :active, -> { where(status: :active) }

  # Get leads that meet the relevancy threshold (≥60%)
  def relevant_leads
    leads.where('intent_score >= ?', RELEVANCY_THRESHOLD)
         .order(created_at: :desc)
  end

  def active_influencers
    influencers.active
  end

  def active_hashtags
    hashtags.active
  end

  def all_sources_count
    influencers.count + hashtags.count
  end

  def active_sources_count
    active_influencers.count + active_hashtags.count
  end

  # Stats for dashboard
  def dashboard_stats
    engaged_count = leads.engaged.count
    dismissed_count = leads.dismissed.count
    actioned_count = engaged_count + dismissed_count

    {
      total_influencers: influencers.count,
      active_influencers: active_influencers.count,
      total_hashtags: hashtags.count,
      active_hashtags: active_hashtags.count,
      total_leads: leads.count,
      relevant_leads: relevant_leads.count,
      new_leads_today: leads.where('created_at >= ?', Time.current.beginning_of_day).count,
      engaged_leads: engaged_count,
      dismissed_leads: dismissed_count,
      reply_rate: actioned_count > 0 ? ((engaged_count.to_f / actioned_count) * 100).round(1) : nil
    }
  end

  def context_for_ai
    <<~CONTEXT
      Product: #{name}
      Description: #{description}
      Target Audience: #{target_audience}
      Pain Points Solved: #{pain_points}
      Key Features: #{key_features}
    CONTEXT
  end
end
