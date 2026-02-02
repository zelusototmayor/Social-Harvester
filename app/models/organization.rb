class Organization < ApplicationRecord
  has_many :organization_memberships, dependent: :destroy
  has_many :users, through: :organization_memberships
  has_many :products, dependent: :destroy
  has_one :subscription, dependent: :destroy
  has_many :usage_records, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, on: :create
  after_create :create_free_subscription

  # Subscription & Plan helpers
  def current_plan
    subscription&.plan || Plan.free_plan
  end

  def current_usage
    UsageRecord.current_for(self)
  end

  def stripe_customer_id
    subscription&.stripe_customer_id
  end

  # Limit checking methods
  def can_create_product?
    limit = current_plan&.products_limit
    return true if limit.nil? # unlimited
    products.count < limit
  end

  def can_add_source?(product)
    limit = current_plan&.sources_per_product_limit
    return true if limit.nil? # unlimited
    (product.influencers.count + product.hashtags.count) < limit
  end

  def can_scan?
    limit = current_plan&.scans_per_month_limit
    return true if limit.nil? # unlimited
    current_usage.scans_count < limit
  end

  def can_create_lead?
    limit = current_plan&.leads_per_month_limit
    return true if limit.nil? # unlimited
    current_usage.leads_count < limit
  end

  # Usage stats for display
  def usage_stats
    usage = current_usage
    plan = current_plan

    {
      products: {
        used: products.count,
        limit: plan&.products_limit,
        unlimited: plan&.products_limit.nil?
      },
      scans: {
        used: usage.scans_count,
        limit: plan&.scans_per_month_limit,
        unlimited: plan&.scans_per_month_limit.nil?
      },
      leads: {
        used: usage.leads_count,
        limit: plan&.leads_per_month_limit,
        unlimited: plan&.leads_per_month_limit.nil?
      }
    }
  end

  # Remaining allowances
  def remaining_scans
    limit = current_plan&.scans_per_month_limit
    return Float::INFINITY if limit.nil?
    [limit - current_usage.scans_count, 0].max
  end

  def remaining_leads
    limit = current_plan&.leads_per_month_limit
    return Float::INFINITY if limit.nil?
    [limit - current_usage.leads_count, 0].max
  end

  def remaining_products
    limit = current_plan&.products_limit
    return Float::INFINITY if limit.nil?
    [limit - products.count, 0].max
  end

  private

  def generate_slug
    return if slug.present?

    base_slug = name&.parameterize
    self.slug = base_slug

    # Handle duplicates by appending numbers
    counter = 1
    while Organization.exists?(slug: self.slug)
      self.slug = "#{base_slug}-#{counter}"
      counter += 1
    end
  end

  def create_free_subscription
    free_plan = Plan.free_plan
    return unless free_plan

    create_subscription!(
      plan: free_plan,
      status: 'active',
      current_period_start: Time.current,
      current_period_end: Time.current + 100.years # Free plan never expires
    )
  end
end
