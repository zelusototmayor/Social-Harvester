module Api
  module Auth
    class SessionsController < Devise::SessionsController
      respond_to :json
      skip_before_action :verify_authenticity_token, raise: false

      def create
        user = User.find_by(email: sign_in_params[:email])

        if user&.valid_password?(sign_in_params[:password])
          # Manually set user for warden-jwt to generate token
          sign_in(user, store: false)

          render json: {
            message: 'Logged in successfully',
            user: {
              id: user.id,
              email: user.email
            }
          }, status: :ok
        else
          render json: {
            message: 'Invalid email or password'
          }, status: :unauthorized
        end
      end

      def destroy
        # JWT revocation is handled by warden-jwt_auth middleware
        render json: { message: 'Logged out successfully' }, status: :ok
      end

      private

      def sign_in_params
        params.require(:user).permit(:email, :password)
      end

      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end
