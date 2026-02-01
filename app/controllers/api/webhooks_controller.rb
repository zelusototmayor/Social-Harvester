module Api
  class WebhooksController < ActionController::API
    # Skip CSRF and authentication for webhooks
    # Stripe will authenticate via signature

    def stripe
      payload = request.body.read
      sig_header = request.env['HTTP_STRIPE_SIGNATURE']
      endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET']

      begin
        event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
      rescue JSON::ParserError => e
        Rails.logger.error "Stripe webhook JSON parse error: #{e.message}"
        render json: { error: 'Invalid payload' }, status: :bad_request
        return
      rescue Stripe::SignatureVerificationError => e
        Rails.logger.error "Stripe webhook signature error: #{e.message}"
        render json: { error: 'Invalid signature' }, status: :bad_request
        return
      end

      # Log the event for debugging
      Rails.logger.info "Stripe webhook received: #{event.type} (#{event.id})"

      # Idempotency check - skip if already processed
      if StripeWebhookEvent.processed?(event.id)
        Rails.logger.info "Stripe webhook already processed: #{event.id}"
        render json: { received: true, already_processed: true }, status: :ok
        return
      end

      # Handle the event
      case event.type
      when 'checkout.session.completed'
        handle_checkout_completed(event.data.object)
      when 'customer.subscription.created'
        handle_subscription_created(event.data.object)
      when 'customer.subscription.updated'
        handle_subscription_updated(event.data.object)
      when 'customer.subscription.deleted'
        handle_subscription_deleted(event.data.object)
      when 'invoice.paid'
        handle_invoice_paid(event.data.object)
      when 'invoice.payment_failed'
        handle_payment_failed(event.data.object)
      else
        Rails.logger.info "Unhandled Stripe event type: #{event.type}"
      end

      # Record the event as processed (idempotency)
      StripeWebhookEvent.record!(event.id, event.type)

      render json: { received: true }, status: :ok
    end

    private

    def handle_checkout_completed(session)
      Rails.logger.info "Checkout completed: #{session.id}"

      # Get the organization from metadata
      organization_id = session.metadata&.organization_id
      return unless organization_id

      organization = Organization.find_by(id: organization_id)
      return unless organization

      # Update the subscription with customer ID
      if organization.subscription && session.customer
        organization.subscription.update!(stripe_customer_id: session.customer)
      end
    end

    def handle_subscription_created(stripe_subscription)
      Rails.logger.info "Subscription created: #{stripe_subscription.id}"
      sync_subscription(stripe_subscription)
    end

    def handle_subscription_updated(stripe_subscription)
      Rails.logger.info "Subscription updated: #{stripe_subscription.id}"
      sync_subscription(stripe_subscription)
    end

    def handle_subscription_deleted(stripe_subscription)
      Rails.logger.info "Subscription deleted: #{stripe_subscription.id}"

      subscription = Subscription.find_by(stripe_subscription_id: stripe_subscription.id)
      return unless subscription

      # Downgrade to free plan
      free_plan = Plan.free_plan
      subscription.update!(
        plan: free_plan,
        status: 'canceled',
        canceled_at: Time.current,
        stripe_subscription_id: nil
      )
    end

    def handle_invoice_paid(invoice)
      Rails.logger.info "Invoice paid: #{invoice.id}"

      # Find subscription by customer ID
      subscription = Subscription.find_by(stripe_customer_id: invoice.customer)
      return unless subscription

      # Update period dates if this is a subscription invoice
      if invoice.subscription
        stripe_sub = Stripe::Subscription.retrieve(invoice.subscription)
        subscription.update!(
          current_period_start: Time.at(stripe_sub.current_period_start),
          current_period_end: Time.at(stripe_sub.current_period_end),
          status: 'active'
        )
      end
    end

    def handle_payment_failed(invoice)
      Rails.logger.error "Payment failed for invoice: #{invoice.id}"

      subscription = Subscription.find_by(stripe_customer_id: invoice.customer)
      return unless subscription

      subscription.update!(status: 'past_due')

      # Send notification email to organization owner
      organization = subscription.organization
      owner = organization.users.joins(:organization_memberships)
                          .where(organization_memberships: { role: 'owner' })
                          .first

      if owner
        begin
          SubscriptionMailer.payment_failed(owner, organization).deliver_later
          Rails.logger.info "Payment failed notification sent to #{owner.email}"
        rescue => e
          Rails.logger.error "Failed to send payment failed notification: #{e.message}"
        end
      end
    end

    def sync_subscription(stripe_subscription)
      # Find the plan by Stripe price ID
      price_id = stripe_subscription.items.data.first&.price&.id
      plan = Plan.find_by(stripe_price_id: price_id)

      unless plan
        Rails.logger.error "Unknown plan for price: #{price_id}"
        return
      end

      # Find organization by customer metadata or existing subscription
      subscription = Subscription.find_by(stripe_subscription_id: stripe_subscription.id)
      subscription ||= Subscription.find_by(stripe_customer_id: stripe_subscription.customer)

      unless subscription
        # Try to find by metadata
        customer = Stripe::Customer.retrieve(stripe_subscription.customer)
        org_id = customer.metadata&.organization_id
        organization = Organization.find_by(id: org_id)

        if organization
          subscription = organization.subscription
        else
          Rails.logger.error "Cannot find organization for subscription: #{stripe_subscription.id}"
          return
        end
      end

      # Update the subscription
      subscription.update!(
        plan: plan,
        stripe_subscription_id: stripe_subscription.id,
        stripe_customer_id: stripe_subscription.customer,
        status: stripe_subscription.status,
        current_period_start: Time.at(stripe_subscription.current_period_start),
        current_period_end: Time.at(stripe_subscription.current_period_end),
        canceled_at: stripe_subscription.canceled_at ? Time.at(stripe_subscription.canceled_at) : nil,
        cancel_at: stripe_subscription.cancel_at ? Time.at(stripe_subscription.cancel_at) : nil
      )

      Rails.logger.info "Subscription synced: #{subscription.id} -> #{plan.name}"
    end
  end
end
