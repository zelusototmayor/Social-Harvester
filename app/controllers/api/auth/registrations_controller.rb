module Api
  module Auth
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      # Override create to handle API-only registration with JWT
      def create
        build_resource(sign_up_params)

        resource.save
        yield resource if block_given?

        if resource.persisted?
          # Sign in the user so warden-jwt_auth middleware can dispatch the JWT token
          sign_in(resource, store: false)
          render json: {
            message: 'Signed up successfully',
            user: {
              id: resource.id,
              email: resource.email
            }
          }, status: :created
        else
          clean_up_passwords resource
          set_minimum_password_length
          render json: {
            message: 'Sign up failed',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        render json: {
          message: 'Sign up failed',
          errors: [e.message]
        }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error "Registration error: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace&.first(10)&.join("\n")
        render json: {
          message: 'An unexpected error occurred during registration',
          errors: ['Registration could not be completed. Please try again.']
        }, status: :internal_server_error
      end

      private

      def sign_up_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end
    end
  end
end
