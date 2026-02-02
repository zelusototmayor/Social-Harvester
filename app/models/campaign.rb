class Campaign < ApplicationRecord
  belongs_to :user
  belongs_to :product, optional: true
  has_many :leads, dependent: :destroy

  enum :status, { active: 0, paused: 1 }

  validates :name, presence: true
  validates :target_handles, presence: true

  scope :active_campaigns, -> { where(status: :active) }

  def target_handles
    super || []
  end

  def keywords
    super || []
  end
end
