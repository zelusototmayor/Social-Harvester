class Influencer < ApplicationRecord
  belongs_to :product
  has_many :leads, as: :source, dependent: :nullify
  has_many :scanned_posts, as: :source, dependent: :destroy

  PLATFORMS = %w[instagram twitter].freeze
  STATUSES = %w[active paused error].freeze

  validates :handle, presence: true
  validates :platform, presence: true, inclusion: { in: PLATFORMS }
  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :handle, uniqueness: { scope: [:product_id, :platform], message: 'is already being monitored for this product' }

  before_validation :normalize_handle

  scope :active, -> { where(status: 'active') }
  scope :paused, -> { where(status: 'paused') }
  scope :needs_scraping, -> { active.where('last_scraped_at IS NULL OR last_scraped_at < ?', 6.hours.ago) }

  def mark_scraped!
    update!(last_scraped_at: Time.current, scrape_count: (scrape_count || 0) + 1)
  end

  def mark_error!
    update!(status: 'error')
  end

  def profile_url
    case platform
    when 'instagram'
      "https://instagram.com/#{handle}"
    when 'twitter'
      "https://twitter.com/#{handle}"
    else
      nil
    end
  end

  private

  def normalize_handle
    self.handle = handle&.gsub(/^@/, '')&.strip&.downcase
  end
end
