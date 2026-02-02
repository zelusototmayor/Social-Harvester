class Subscription < ApplicationRecord
  belongs_to :organization
  belongs_to :plan

  validates :status, presence: true

  # Stripe subscription statuses
  STATUSES = %w[
    active
    past_due
    unpaid
    canceled
    incomplete
    incomplete_expired
    trialing
    paused
  ].freeze

  validates :status, inclusion: { in: STATUSES }

  scope :active, -> { where(status: %w[active trialing]) }
  scope :with_access, -> { where(status: %w[active trialing past_due]) }

  def active?
    %w[active trialing].include?(status)
  end

  def has_access?
    %w[active trialing past_due].include?(status)
  end

  def canceled?
    status == 'canceled'
  end

  def will_cancel?
    cancel_at.present? && cancel_at > Time.current
  end

  def days_until_renewal
    return nil unless current_period_end
    ((current_period_end - Time.current) / 1.day).ceil
  end
end
