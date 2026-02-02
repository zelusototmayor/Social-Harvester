namespace :subscriptions do
  desc 'Assign free plan to organizations without a subscription'
  task assign_free_plans: :environment do
    free_plan = Plan.free_plan

    unless free_plan
      puts 'Error: Free plan not found. Run `bin/rails stripe:setup` first.'
      exit 1
    end

    count = 0
    Organization.left_joins(:subscription).where(subscriptions: { id: nil }).find_each do |org|
      org.create_subscription!(
        plan: free_plan,
        status: 'active',
        current_period_start: Time.current,
        current_period_end: Time.current + 100.years
      )
      puts "Created subscription for: #{org.name}"
      count += 1
    end

    puts "Done! Created #{count} subscriptions."
  end
end
