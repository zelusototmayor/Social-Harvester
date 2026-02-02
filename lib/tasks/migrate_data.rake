namespace :data do
  desc "Migrate existing users to have default organizations"
  task migrate_users_to_organizations: :environment do
    puts "Migrating users to organizations..."

    User.where(current_organization_id: nil).find_each do |user|
      # Skip if user already has organizations
      if user.organizations.any?
        user.update!(current_organization: user.organizations.first)
        puts "  User #{user.email}: Set current org to existing org"
        next
      end

      # Create a default organization for this user
      org_name = "#{user.email.split('@').first.titleize}'s Organization"
      org = Organization.create!(name: org_name)

      OrganizationMembership.create!(
        user: user,
        organization: org,
        role: 'owner'
      )

      user.update!(current_organization: org)
      puts "  User #{user.email}: Created organization '#{org.name}'"
    end

    puts "Done! #{Organization.count} organizations now exist."
  end

  desc "Migrate products to organizations"
  task migrate_products_to_organizations: :environment do
    puts "Migrating products to organizations..."

    Product.where(organization_id: nil).includes(:user).find_each do |product|
      next unless product.user

      # Find user's organization
      org = product.user.current_organization || product.user.organizations.first

      unless org
        puts "  WARNING: Product #{product.id} (#{product.name}) has no organization to migrate to"
        next
      end

      product.update!(organization_id: org.id)
      puts "  Product #{product.id} (#{product.name}) -> Organization '#{org.name}'"
    end

    orphaned = Product.where(organization_id: nil).count
    puts "Done! #{Product.where.not(organization_id: nil).count} products migrated."
    puts "WARNING: #{orphaned} products still have no organization" if orphaned > 0
  end

  desc "Migrate campaigns to influencers/hashtags/leads"
  task migrate_campaigns: :environment do
    puts "Migrating campaigns to new structure..."

    Campaign.includes(:product, :leads).find_each do |campaign|
      puts "\nProcessing campaign #{campaign.id}: #{campaign.name}"

      product = campaign.product
      unless product
        puts "  SKIPPING - No product associated"
        next
      end

      ActiveRecord::Base.transaction do
        # Migrate target_handles to influencers
        if campaign.target_handles.present?
          handles = campaign.target_handles.is_a?(Array) ? campaign.target_handles : campaign.target_handles.split(',')
          handles.each do |handle|
            handle = handle.strip.gsub(/^@/, '')
            next if handle.blank?

            influencer = product.influencers.find_or_create_by!(
              handle: handle,
              platform: 'instagram'
            ) do |i|
              i.status = campaign.active? ? 'active' : 'paused'
              i.last_scraped_at = campaign.last_scraped_at
            end
            puts "    Created/found influencer: @#{influencer.handle}"
          end
        end

        # Migrate keywords to hashtags
        if campaign.keywords.present?
          keywords = campaign.keywords.is_a?(Array) ? campaign.keywords : campaign.keywords.split(',')
          keywords.each do |keyword|
            keyword = keyword.strip.gsub(/^#/, '')
            next if keyword.blank?

            hashtag = product.hashtags.find_or_create_by!(
              tag: keyword,
              platform: 'instagram'
            ) do |h|
              h.status = campaign.active? ? 'active' : 'paused'
              h.last_scraped_at = campaign.last_scraped_at
            end
            puts "    Created/found hashtag: ##{hashtag.tag}"
          end
        end

        # Migrate leads to product
        leads_count = 0
        campaign.leads.each do |lead|
          # Determine source based on source_username
          source = nil
          source_type = nil

          if lead.source_username.present?
            # Try to find matching influencer
            influencer = product.influencers.find_by(handle: lead.source_username.downcase)
            if influencer
              source = influencer
              source_type = 'Influencer'
            end
          end

          lead.update!(
            product_id: product.id,
            source_type: source_type,
            source_id: source&.id
          )
          leads_count += 1
        end
        puts "    Migrated #{leads_count} leads"
      end
    end

    puts "\n=== Migration Summary ==="
    puts "Total influencers: #{Influencer.count}"
    puts "Total hashtags: #{Hashtag.count}"
    puts "Leads with product_id: #{Lead.where.not(product_id: nil).count}"
    puts "Leads without product_id: #{Lead.where(product_id: nil).count}"
  end

  desc "Run all data migrations in order"
  task migrate_all: :environment do
    puts "=" * 50
    puts "STARTING FULL DATA MIGRATION"
    puts "=" * 50

    Rake::Task['data:migrate_users_to_organizations'].invoke
    puts "\n"
    Rake::Task['data:migrate_products_to_organizations'].invoke
    puts "\n"
    Rake::Task['data:migrate_campaigns'].invoke

    puts "\n" + "=" * 50
    puts "MIGRATION COMPLETE"
    puts "=" * 50
  end

  desc "Verify data migration integrity"
  task verify_migration: :environment do
    puts "=== Data Migration Verification ==="

    # Check organizations
    users_without_org = User.left_joins(:organizations).where(organizations: { id: nil }).count
    puts "Users without organization: #{users_without_org}"

    # Check products
    products_without_org = Product.where(organization_id: nil).count
    puts "Products without organization: #{products_without_org}"

    # Check leads
    leads_without_product = Lead.where(product_id: nil).count
    puts "Leads without product: #{leads_without_product}"

    # Summary
    puts "\n=== Summary ==="
    puts "Organizations: #{Organization.count}"
    puts "Users: #{User.count}"
    puts "Products: #{Product.count}"
    puts "Influencers: #{Influencer.count}"
    puts "Hashtags: #{Hashtag.count}"
    puts "Leads: #{Lead.count}"
    puts "Campaigns (legacy): #{Campaign.count}"

    if users_without_org == 0 && products_without_org == 0 && leads_without_product == 0
      puts "\n✅ All data migrated successfully!"
    else
      puts "\n⚠️  Some data still needs migration"
    end
  end
end
