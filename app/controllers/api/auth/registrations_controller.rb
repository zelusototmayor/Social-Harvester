module Api
  module Auth
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      # Override create to prevent session sign-in (API mode doesn't have sessions)
      def create
        build_resource(sign_up_params)

        resource.save
        yield resource if block_given?

        if resource.persisted?
          # Don't call sign_up which tries to use sessions
          # JWT token will be added by warden-jwt_auth middleware
          respond_with resource, location: after_sign_up_path_for(resource)
        else
          clean_up_passwords resource
          set_minimum_password_length
          respond_with resource
        end
      end

      private

      def sign_up_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end

      def respond_with(resource, _opts = {})
        if resource.persisted?
          render json: {
            message: 'Signed up successfully',
            user: {
              id: resource.id,
              email: resource.email
            }
          }, status: :created
        else
          render json: {
            message: 'Sign up failed',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end
