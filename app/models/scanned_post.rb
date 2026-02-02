class ScannedPost < ApplicationRecord
  belongs_to :source, polymorphic: true
  belongs_to :product

  validates :post_url, presence: true
  validates :shortcode, presence: true
  validates :first_scanned_at, presence: true
  validates :shortcode, uniqueness: { scope: [:source_type, :source_id] }

  # Check if a post has already been scanned for a given source
  def self.already_scanned?(source:, shortcode:)
    exists?(source: source, shortcode: shortcode)
  end

  # Record a scanned post
  def self.record_scan!(source:, product:, post_url:, shortcode:)
    create!(
      source: source,
      product: product,
      post_url: post_url,
      shortcode: shortcode,
      first_scanned_at: Time.current
    )
  rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid => e
    # Already exists (either from DB constraint or model validation), ignore
    Rails.logger.debug "ScannedPost already exists for #{source.class}##{source.id} shortcode #{shortcode}: #{e.message}"
    nil
  end

  # Extract shortcode from an Instagram post URL
  def self.extract_shortcode(url)
    return nil unless url.present?

    # Match /p/SHORTCODE/ or /reel/SHORTCODE/
    if url =~ %r{instagram\.com/(?:p|reel)/([^/?]+)}
      $1
    else
      nil
    end
  end
end
