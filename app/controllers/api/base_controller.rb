module Api
  class BaseController < ApplicationController
    before_action :authenticate_user!

    rescue_from ActiveRecord::RecordNotFound, with: :not_found
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

    private

    def not_found
      render json: { error: 'Record not found' }, status: :not_found
    end

    def unprocessable_entity(exception)
      render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
    end

    # Get the current user's active organization
    def current_organization
      @current_organization ||= current_user&.ensure_current_organization
    end

    # Require an organization to be present
    def require_organization!
      unless current_organization
        render json: { error: 'No organization selected. Please create or join an organization.' }, status: :forbidden
      end
    end

    # Helper to scope queries to current organization
    def organization_products
      current_organization&.products || Product.none
    end
  end
end
