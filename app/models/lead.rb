class Lead < ApplicationRecord
  # New organization-based ownership through product
  belongs_to :product, optional: true  # Will become required after migration

  # Legacy campaign association (to be removed after migration)
  belongs_to :campaign, optional: true

  # Polymorphic source (Influencer or Hashtag)
  belongs_to :source, polymorphic: true, optional: true

  has_many :engagement_logs, dependent: :destroy

  enum :status, { new_lead: 0, reviewed: 1, engaged: 2, dismissed: 3 }
  enum :intent_category, {
    no_intent: 0,
    question: 1,
    complaint: 2,
    recommendation_request: 3,
    competitor_mention: 4
  }

  # Relevancy threshold for leads
  RELEVANCY_THRESHOLD = 0.60

  validates :external_comment_id, uniqueness: true, allow_nil: true
  validates :commenter_username, presence: true
  validates :comment_text, presence: true

  # Track usage when lead is created
  after_create :increment_usage_count

  scope :high_intent, -> { where('intent_score >= ?', 0.5) }
  scope :relevant, -> { where('intent_score >= ?', RELEVANCY_THRESHOLD) }
  scope :pending_review, -> { where(status: :new_lead) }
  scope :by_intent_score, -> { order(intent_score: :desc) }
  scope :from_influencer, -> { where(source_type: 'Influencer') }
  scope :from_hashtag, -> { where(source_type: 'Hashtag') }

  def relevant?
    intent_score.present? && intent_score >= RELEVANCY_THRESHOLD
  end

  def source_display
    case source_type
    when 'Influencer'
      "@#{source&.handle}"
    when 'Hashtag'
      "##{source&.tag}"
    else
      source_username.present? ? "@#{source_username}" : 'Unknown'
    end
  end

  def instagram_profile_url
    "https://instagram.com/#{commenter_username}"
  end

  def instagram_post_url
    source_post_url
  end

  def instagram_comment_url
    return source_post_url unless external_comment_id.present?

    # Extract post shortcode from URL (e.g., https://www.instagram.com/p/DRz6cLnjU7U/)
    if source_post_url =~ %r{instagram\.com/p/([^/]+)}
      shortcode = $1
      "https://www.instagram.com/p/#{shortcode}/c/#{external_comment_id}/"
    else
      source_post_url
    end
  end

  private

  def increment_usage_count
    return unless product&.organization

    UsageRecord.current_for(product.organization).increment_leads!
  rescue StandardError => e
    Rails.logger.error "Failed to increment lead usage: #{e.message}"
    # Don't prevent lead creation if usage tracking fails
  end
end
