class Api::WaitlistController < ApplicationController
  def create
    signup = WaitlistSignup.new(waitlist_params)

    if signup.save
      render json: {
        success: true,
        message: "Successfully added to waitlist",
        data: {
          email: signup.email,
          platform: signup.platform,
          created_at: signup.created_at
        }
      }, status: :created
    else
      render json: { error: signup.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error("Waitlist error: #{e.message}")
    render json: { error: "Failed to add to waitlist. Please try again later." }, status: :internal_server_error
  end

  private

  def waitlist_params
    params.permit(:email, :platform)
  end
end
