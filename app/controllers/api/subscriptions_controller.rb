module Api
  class SubscriptionsController < BaseController
    # GET /api/subscriptions/current
    # Returns current subscription status and usage
    def current
      organization = current_organization
      subscription = organization.subscription
      plan = organization.current_plan
      usage = organization.usage_stats

      render json: {
        plan: serialize_plan(plan),
        subscription: subscription ? serialize_subscription(subscription) : nil,
        usage: usage,
        can_create_product: organization.can_create_product?,
        can_scan: organization.can_scan?
      }
    end

    # GET /api/subscriptions/plans
    # Returns all available plans
    def plans
      plans = Plan.active.ordered

      render json: {
        plans: plans.map { |p| serialize_plan(p) }
      }
    end

    # POST /api/subscriptions/checkout
    # Creates a Stripe Checkout session for upgrading
    def checkout
      plan = Plan.find(params[:plan_id])
      organization = current_organization

      # Don't allow checkout for free plan
      if plan.free?
        render json: { error: 'Cannot checkout free plan' }, status: :unprocessable_entity
        return
      end

      # Create or retrieve Stripe customer
      customer = find_or_create_stripe_customer(organization)

      # Determine return URLs based on context
      if params[:return_to] == 'onboarding'
        success_url = "#{root_url}onboarding?checkout=success"
        cancel_url = "#{root_url}onboarding?checkout=canceled"
      else
        success_url = "#{root_url}settings/billing?success=true"
        cancel_url = "#{root_url}settings/billing?canceled=true"
      end

      # Create checkout session
      session = Stripe::Checkout::Session.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [{
          price: plan.stripe_price_id,
          quantity: 1
        }],
        mode: 'subscription',
        success_url: success_url,
        cancel_url: cancel_url,
        metadata: {
          organization_id: organization.id
        },
        subscription_data: {
          metadata: {
            organization_id: organization.id
          }
        }
      })

      render json: { checkout_url: session.url }
    end

    # POST /api/subscriptions/portal
    # Creates a Stripe Customer Portal session
    def portal
      organization = current_organization
      subscription = organization.subscription

      unless subscription&.stripe_customer_id
        render json: { error: 'No active subscription found' }, status: :unprocessable_entity
        return
      end

      session = Stripe::BillingPortal::Session.create({
        customer: subscription.stripe_customer_id,
        return_url: "#{root_url}settings/billing"
      })

      render json: { portal_url: session.url }
    end

    # POST /api/subscriptions/cancel
    # Cancels subscription at period end
    def cancel
      organization = current_organization
      subscription = organization.subscription

      unless subscription&.stripe_subscription_id
        render json: { error: 'No active subscription to cancel' }, status: :unprocessable_entity
        return
      end

      # Cancel at period end (user keeps access until then)
      Stripe::Subscription.update(
        subscription.stripe_subscription_id,
        { cancel_at_period_end: true }
      )

      subscription.update!(cancel_at: subscription.current_period_end)

      render json: { message: 'Subscription will be canceled at the end of the billing period' }
    end

    private

    def find_or_create_stripe_customer(organization)
      subscription = organization.subscription

      if subscription&.stripe_customer_id
        begin
          return Stripe::Customer.retrieve(subscription.stripe_customer_id)
        rescue Stripe::InvalidRequestError
          # Customer doesn't exist, create new one
        end
      end

      # Find the organization owner's email
      owner = organization.users.joins(:organization_memberships)
                          .where(organization_memberships: { role: 'owner' })
                          .first
      email = owner&.email || organization.users.first&.email

      customer = Stripe::Customer.create({
        email: email,
        name: organization.name,
        metadata: {
          organization_id: organization.id
        }
      })

      # Store customer ID
      subscription&.update!(stripe_customer_id: customer.id)

      customer
    end

    def serialize_plan(plan)
      return nil unless plan

      {
        id: plan.id,
        name: plan.name,
        price_cents: plan.price_cents,
        price_formatted: plan.formatted_price,
        interval: plan.interval,
        limits: {
          products: plan.products_limit,
          sources_per_product: plan.sources_per_product_limit,
          scans_per_month: plan.scans_per_month_limit,
          leads_per_month: plan.leads_per_month_limit
        },
        unlimited_products: plan.unlimited_products?,
        unlimited_leads: plan.unlimited_leads?,
        free: plan.free?
      }
    end

    def serialize_subscription(subscription)
      {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at: subscription.cancel_at,
        will_cancel: subscription.will_cancel?,
        days_until_renewal: subscription.days_until_renewal
      }
    end

    def root_url
      # Use request host for dynamic URL
      "#{request.protocol}#{request.host_with_port}/"
    end
  end
end
