class OrganizationMembership < ApplicationRecord
  belongs_to :user
  belongs_to :organization

  ROLES = %w[owner admin member].freeze

  validates :role, presence: true, inclusion: { in: ROLES }
  validates :user_id, uniqueness: { scope: :organization_id, message: 'is already a member of this organization' }

  scope :owners, -> { where(role: 'owner') }
  scope :admins, -> { where(role: %w[owner admin]) }

  def owner?
    role == 'owner'
  end

  def admin?
    role.in?(%w[owner admin])
  end
end
