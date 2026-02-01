module Api
  class UsersController < BaseController
    # GET /api/me
    # Returns current user info with organization context
    def me
      render json: {
        id: current_user.id,
        email: current_user.email,
        onboarding_completed: current_user.onboarding_completed?,
        current_organization: current_organization ? serialize_organization(current_organization) : nil,
        organizations: current_user.organizations.map { |org| serialize_organization_brief(org) }
      }
    end

    # PATCH /api/me/onboarding
    # Complete the onboarding questionnaire
    def complete_onboarding
      # Extract params - use update_columns to bypass ActiveRecord quirks
      onboarding_data = params[:onboarding] || {}

      current_user.update_columns(
        company_size: onboarding_data[:company_size],
        employee_count: onboarding_data[:employee_count],
        referral_source: onboarding_data[:referral_source],
        onboarding_completed: true,
        updated_at: Time.current
      )

      if current_user.onboarding_completed?
        render json: {
          id: current_user.id,
          email: current_user.email,
          onboarding_completed: true,
          current_organization: current_organization ? serialize_organization(current_organization) : nil,
          organizations: current_user.organizations.map { |org| serialize_organization_brief(org) }
        }
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def onboarding_params
      params.require(:onboarding).permit(:company_size, :employee_count, :referral_source)
    end

    def serialize_organization(org)
      {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: current_user.organization_memberships.find_by(organization: org)&.role,
        products_count: org.products.count
      }
    end

    def serialize_organization_brief(org)
      {
        id: org.id,
        name: org.name,
        slug: org.slug
      }
    end
  end
end
