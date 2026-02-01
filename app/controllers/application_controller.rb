class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :configure_permitted_parameters, if: :devise_controller?

  respond_to :json

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end

  # JWT authentication helper - authenticate from Authorization header
  # Properly checks the jwt_denylist to respect token revocation (logout)
  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return render_unauthorized unless token

    begin
      decoded = JWT.decode(token, ENV['JWT_SECRET'], true, algorithm: 'HS256')
      payload = decoded[0]

      # Check if token has been revoked (user logged out)
      jti = payload['jti']
      if jti.present? && JwtDenylist.exists?(jti: jti)
        return render_unauthorized
      end

      # Check token expiration
      exp = payload['exp']
      if exp.present? && Time.at(exp) < Time.current
        return render_unauthorized
      end

      @current_user = User.find(payload['sub'])
    rescue JWT::DecodeError, JWT::ExpiredSignature, ActiveRecord::RecordNotFound
      render_unauthorized
    end
  end

  def current_user
    @current_user
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
