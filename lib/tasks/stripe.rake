namespace :stripe do
  desc 'Seed plans and create corresponding Stripe products/prices'
  task setup: :environment do
    puts 'Setting up Stripe products and plans...'

    Plan::PLANS.each do |key, attrs|
      puts "\nProcessing #{attrs[:name]} plan..."

      # Find or create local plan
      plan = Plan.find_or_initialize_by(name: attrs[:name])
      plan.assign_attributes(
        price_cents: attrs[:price_cents],
        products_limit: attrs[:products_limit],
        sources_per_product_limit: attrs[:sources_per_product_limit],
        scans_per_month_limit: attrs[:scans_per_month_limit],
        leads_per_month_limit: attrs[:leads_per_month_limit],
        sort_order: attrs[:sort_order],
        active: true
      )

      # Skip Stripe for free plan
      if attrs[:price_cents] == 0
        plan.save!
        puts "  ✓ #{attrs[:name]} plan saved (no Stripe product needed)"
        next
      end

      # Create or update Stripe product
      if plan.stripe_product_id.present?
        product = Stripe::Product.retrieve(plan.stripe_product_id)
        Stripe::Product.update(product.id, { name: "Signal Harvester #{attrs[:name]}" })
        puts "  ✓ Updated Stripe product: #{product.id}"
      else
        product = Stripe::Product.create({
          name: "Signal Harvester #{attrs[:name]}",
          metadata: { plan_key: key.to_s }
        })
        plan.stripe_product_id = product.id
        puts "  ✓ Created Stripe product: #{product.id}"
      end

      # Create or find Stripe price
      if plan.stripe_price_id.present?
        puts "  ✓ Using existing price: #{plan.stripe_price_id}"
      else
        price = Stripe::Price.create({
          product: product.id,
          unit_amount: attrs[:price_cents],
          currency: 'usd',
          recurring: { interval: 'month' },
          metadata: { plan_key: key.to_s }
        })
        plan.stripe_price_id = price.id
        puts "  ✓ Created Stripe price: #{price.id}"
      end

      plan.save!
      puts "  ✓ #{attrs[:name]} plan saved to database"
    end

    puts "\n✅ All plans setup complete!"
    puts "\nPlan summary:"
    Plan.ordered.each do |plan|
      puts "  - #{plan.name}: #{plan.formatted_price} (Stripe: #{plan.stripe_price_id || 'N/A'})"
    end
  end

  desc 'Create webhook endpoint in Stripe'
  task create_webhook: :environment do
    url = ENV['APP_URL'] || 'https://your-app-url.com'
    webhook_url = "#{url}/api/webhooks/stripe"

    puts "Creating webhook endpoint: #{webhook_url}"

    webhook = Stripe::WebhookEndpoint.create({
      url: webhook_url,
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.paid',
        'invoice.payment_failed'
      ]
    })

    puts "\n✅ Webhook created!"
    puts "Webhook ID: #{webhook.id}"
    puts "Webhook Secret: #{webhook.secret}"
    puts "\n⚠️  Add this to your .env file:"
    puts "STRIPE_WEBHOOK_SECRET=#{webhook.secret}"
  end

  desc 'List all Stripe products and prices'
  task list: :environment do
    puts 'Stripe Products:'
    Stripe::Product.list(limit: 20).each do |product|
      puts "  - #{product.name} (#{product.id})"
    end

    puts "\nStripe Prices:"
    Stripe::Price.list(limit: 20).each do |price|
      amount = price.unit_amount / 100.0
      puts "  - $#{amount}/#{price.recurring&.interval} (#{price.id})"
    end
  end

  desc 'Sync local plans with Stripe'
  task sync: :environment do
    puts 'Syncing plans with Stripe...'

    Plan.where.not(stripe_price_id: nil).each do |plan|
      begin
        price = Stripe::Price.retrieve(plan.stripe_price_id)
        puts "✓ #{plan.name}: Price #{price.id} is valid"
      rescue Stripe::InvalidRequestError => e
        puts "✗ #{plan.name}: #{e.message}"
      end
    end
  end
end
