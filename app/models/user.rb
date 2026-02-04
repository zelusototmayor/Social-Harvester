class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Onboarding dropdown options
  COMPANY_SIZES = [
    'Solo/Freelancer',
    '2-10',
    '11-50',
    '51-200',
    '201-500',
    '500+'
  ].freeze

  EMPLOYEE_COUNTS = [
    'Just me',
    '2-5',
    '6-20',
    '21-50',
    '50+'
  ].freeze

  REFERRAL_SOURCES = [
    'Google Search',
    'Social Media',
    'Friend/Colleague',
    'Blog/Article',
    'Other'
  ].freeze

  # Organization associations
  has_many :organization_memberships, dependent: :destroy
  has_many :organizations, through: :organization_memberships
  belongs_to :current_organization, class_name: 'Organization', optional: true

  # Legacy associations (to be removed after campaign migration)
  has_many :products, dependent: :destroy
  has_many :campaigns, dependent: :destroy
  has_many :engagement_logs, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false }

  # After registration, ensure user has an organization
  after_create :create_default_organization

  def switch_organization(organization)
    return false unless organizations.include?(organization)
    update(current_organization: organization)
  end

  def ensure_current_organization
    return current_organization if current_organization.present?

    first_org = organizations.first
    update(current_organization: first_org) if first_org
    first_org
  end

  def member_of?(organization)
    organizations.include?(organization)
  end

  def admin_of?(organization)
    organization_memberships.find_by(organization: organization)&.admin?
  end

  def owner_of?(organization)
    organization_memberships.find_by(organization: organization)&.owner?
  end

  def needs_onboarding?
    !onboarding_completed?
  end

  private

  def create_default_organization
    org_name = email.split('@').first.titleize + "'s Organization"
    org = Organization.create!(name: org_name)
    organization_memberships.create!(organization: org, role: 'owner')
    update!(current_organization: org)
  end
end
