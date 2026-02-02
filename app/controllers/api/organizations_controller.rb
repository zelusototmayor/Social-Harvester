module Api
  class OrganizationsController < BaseController
    before_action :set_organization, only: [:show, :update]

    # GET /api/organizations
    def index
      @organizations = current_user.organizations.order(:name)
      render json: {
        organizations: @organizations.map { |org| serialize_organization(org) },
        current_organization_id: current_organization&.id
      }
    end

    # GET /api/organizations/:id
    def show
      render json: serialize_organization(@organization)
    end

    # POST /api/organizations
    def create
      @organization = Organization.new(organization_params)

      ActiveRecord::Base.transaction do
        @organization.save!
        @organization.organization_memberships.create!(
          user: current_user,
          role: 'owner'
        )
        # Set as current if user has no current organization
        current_user.update!(current_organization: @organization) if current_user.current_organization.nil?
      end

      render json: serialize_organization(@organization), status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end

    # PATCH /api/organizations/:id
    def update
      if @organization.update(organization_params)
        render json: serialize_organization(@organization)
      else
        render json: { errors: @organization.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # POST /api/organizations/:id/switch
    def switch
      organization = current_user.organizations.find(params[:id])

      if current_user.switch_organization(organization)
        render json: {
          message: 'Switched successfully',
          organization: serialize_organization(organization)
        }
      else
        render json: { error: 'Unable to switch organization' }, status: :unprocessable_entity
      end
    end

    private

    def set_organization
      @organization = current_user.organizations.find(params[:id])
    end

    def organization_params
      params.require(:organization).permit(:name)
    end

    def serialize_organization(org)
      {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: current_user.organization_memberships.find_by(organization: org)&.role,
        products_count: org.products.count,
        members_count: org.users.count,
        created_at: org.created_at
      }
    end
  end
end
