class SubscriptionMailer < ApplicationMailer
  # Notify user when their payment has failed
  def payment_failed(user, organization)
    @user = user
    @organization = organization
    @billing_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:4000')}/settings/billing"

    mail(
      to: @user.email,
      subject: 'Action Required: Payment Failed for Your Signal Harvester Subscription'
    )
  end

  # Notify user when their subscription is about to be canceled due to failed payment
  def subscription_expiring(user, organization, days_remaining)
    @user = user
    @organization = organization
    @days_remaining = days_remaining
    @billing_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:4000')}/settings/billing"

    mail(
      to: @user.email,
      subject: "Your Signal Harvester subscription expires in #{days_remaining} days"
    )
  end

  # Notify user when subscription was successfully renewed
  def payment_succeeded(user, organization)
    @user = user
    @organization = organization

    mail(
      to: @user.email,
      subject: 'Payment Successful - Signal Harvester Subscription Renewed'
    )
  end
end
