class EngagementLog < ApplicationRecord
  belongs_to :lead
  belongs_to :user

  enum :engagement_type, { dm_sent: 0, comment_reply: 1, profile_visit: 2 }

  validates :engagement_type, presence: true
  validates :engaged_at, presence: true

  before_validation :set_engaged_at, on: :create

  private

  def set_engaged_at
    self.engaged_at ||= Time.current
  end
end
