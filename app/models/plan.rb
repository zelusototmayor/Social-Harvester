class Plan < ApplicationRecord
  has_many :subscriptions

  validates :name, presence: true, uniqueness: true
  validates :price_cents, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :interval, presence: true, inclusion: { in: %w[month year] }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(sort_order: :asc) }
  scope :paid, -> { where('price_cents > 0') }

  # Plan definitions matching our pricing
  PLANS = {
    free: {
      name: 'Free',
      price_cents: 0,
      products_limit: 1,
      sources_per_product_limit: 3,
      scans_per_month_limit: 5,
      leads_per_month_limit: 50,
      sort_order: 0
    },
    starter: {
      name: 'Starter',
      price_cents: 2999,
      products_limit: 3,
      sources_per_product_limit: 10,
      scans_per_month_limit: 30,
      leads_per_month_limit: 500,
      sort_order: 1
    },
    growth: {
      name: 'Growth',
      price_cents: 7999,
      products_limit: 10,
      sources_per_product_limit: 25,
      scans_per_month_limit: 100,
      leads_per_month_limit: 2000,
      sort_order: 2
    },
    pro: {
      name: 'Pro',
      price_cents: 24999,
      products_limit: nil, # unlimited
      sources_per_product_limit: 50,
      scans_per_month_limit: 300,
      leads_per_month_limit: nil, # unlimited
      sort_order: 3
    }
  }.freeze

  def self.free_plan
    find_by(name: 'Free')
  end

  def free?
    price_cents == 0
  end

  def price_dollars
    price_cents / 100.0
  end

  def formatted_price
    return 'Free' if free?
    "$#{format('%.2f', price_dollars)}/mo"
  end

  def unlimited_products?
    products_limit.nil?
  end

  def unlimited_leads?
    leads_per_month_limit.nil?
  end
end
