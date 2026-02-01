class StripeWebhookEvent < ApplicationRecord
  validates :event_id, presence: true, uniqueness: true
  validates :event_type, presence: true

  # Check if an event has already been processed
  def self.processed?(event_id)
    exists?(event_id: event_id)
  end

  # Record a processed event
  def self.record!(event_id, event_type)
    create!(
      event_id: event_id,
      event_type: event_type,
      processed_at: Time.current
    )
  rescue ActiveRecord::RecordNotUnique
    # Already processed by another worker (race condition)
    true
  end
end
