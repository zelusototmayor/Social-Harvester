# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_02_01_163335) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "campaigns", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "target_handles", default: [], array: true
    t.string "keywords", default: [], array: true
    t.integer "status", default: 0, null: false
    t.datetime "last_scraped_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "product_id"
    t.index ["product_id"], name: "index_campaigns_on_product_id"
    t.index ["status"], name: "index_campaigns_on_status"
    t.index ["user_id"], name: "index_campaigns_on_user_id"
  end

  create_table "engagement_logs", force: :cascade do |t|
    t.bigint "lead_id", null: false
    t.bigint "user_id", null: false
    t.integer "engagement_type"
    t.text "notes"
    t.datetime "engaged_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lead_id"], name: "index_engagement_logs_on_lead_id"
    t.index ["user_id"], name: "index_engagement_logs_on_user_id"
  end

  create_table "hashtags", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "tag", null: false
    t.string "platform", default: "instagram", null: false
    t.string "status", default: "active", null: false
    t.datetime "last_scraped_at"
    t.integer "scrape_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "tag", "platform"], name: "index_hashtags_on_product_id_and_tag_and_platform", unique: true
    t.index ["product_id"], name: "index_hashtags_on_product_id"
    t.index ["status"], name: "index_hashtags_on_status"
  end

  create_table "influencers", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "handle", null: false
    t.string "platform", default: "instagram", null: false
    t.string "status", default: "active", null: false
    t.datetime "last_scraped_at"
    t.integer "scrape_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "handle", "platform"], name: "index_influencers_on_product_id_and_handle_and_platform", unique: true
    t.index ["product_id"], name: "index_influencers_on_product_id"
    t.index ["status"], name: "index_influencers_on_status"
  end

  create_table "jwt_denylist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_denylist_on_jti", unique: true
  end

  create_table "leads", force: :cascade do |t|
    t.bigint "campaign_id"
    t.string "source_post_url"
    t.string "source_username"
    t.string "commenter_username"
    t.string "commenter_profile_url"
    t.text "comment_text"
    t.datetime "comment_timestamp"
    t.decimal "intent_score", precision: 3, scale: 2
    t.integer "intent_category", default: 0
    t.text "ai_suggested_reply"
    t.integer "status", default: 0, null: false
    t.string "external_comment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "product_id"
    t.string "source_type"
    t.bigint "source_id"
    t.index ["campaign_id", "status"], name: "index_leads_on_campaign_id_and_status"
    t.index ["campaign_id"], name: "index_leads_on_campaign_id"
    t.index ["external_comment_id"], name: "index_leads_on_external_comment_id", unique: true
    t.index ["intent_score"], name: "index_leads_on_intent_score"
    t.index ["product_id"], name: "index_leads_on_product_id"
    t.index ["source_type", "source_id"], name: "index_leads_on_source_type_and_source_id"
    t.index ["status"], name: "index_leads_on_status"
  end

  create_table "organization_memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "organization_id", null: false
    t.string "role", default: "member", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_organization_memberships_on_organization_id"
    t.index ["user_id", "organization_id"], name: "index_organization_memberships_on_user_id_and_organization_id", unique: true
    t.index ["user_id"], name: "index_organization_memberships_on_user_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_organizations_on_slug", unique: true
  end

  create_table "plans", force: :cascade do |t|
    t.string "name", null: false
    t.string "stripe_product_id"
    t.string "stripe_price_id"
    t.integer "price_cents", default: 0, null: false
    t.string "interval", default: "month", null: false
    t.integer "products_limit"
    t.integer "sources_per_product_limit"
    t.integer "scans_per_month_limit"
    t.integer "leads_per_month_limit"
    t.boolean "active", default: true, null: false
    t.integer "sort_order", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_plans_on_name", unique: true
    t.index ["stripe_price_id"], name: "index_plans_on_stripe_price_id", unique: true
  end

  create_table "products", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.string "website_url"
    t.text "description"
    t.text "target_audience"
    t.text "pain_points"
    t.text "key_features"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "organization_id"
    t.index ["organization_id"], name: "index_products_on_organization_id"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "scanned_posts", force: :cascade do |t|
    t.string "post_url", null: false
    t.string "shortcode", null: false
    t.string "source_type", null: false
    t.bigint "source_id", null: false
    t.bigint "product_id", null: false
    t.datetime "first_scanned_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_scanned_posts_on_product_id"
    t.index ["source_type", "source_id", "shortcode"], name: "index_scanned_posts_on_source_and_shortcode", unique: true
    t.index ["source_type", "source_id"], name: "index_scanned_posts_on_source"
  end

  create_table "stripe_webhook_events", force: :cascade do |t|
    t.string "event_id"
    t.string "event_type"
    t.datetime "processed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_stripe_webhook_events_on_event_id", unique: true
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "organization_id", null: false
    t.bigint "plan_id", null: false
    t.string "stripe_subscription_id"
    t.string "stripe_customer_id"
    t.string "status", default: "active", null: false
    t.datetime "current_period_start"
    t.datetime "current_period_end"
    t.datetime "canceled_at"
    t.datetime "cancel_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_subscriptions_on_organization_id"
    t.index ["plan_id"], name: "index_subscriptions_on_plan_id"
    t.index ["status"], name: "index_subscriptions_on_status"
    t.index ["stripe_customer_id"], name: "index_subscriptions_on_stripe_customer_id"
    t.index ["stripe_subscription_id"], name: "index_subscriptions_on_stripe_subscription_id", unique: true
  end

  create_table "usage_records", force: :cascade do |t|
    t.bigint "organization_id", null: false
    t.date "period_start", null: false
    t.date "period_end", null: false
    t.integer "scans_count", default: 0, null: false
    t.integer "leads_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id", "period_start"], name: "index_usage_records_on_organization_id_and_period_start", unique: true
    t.index ["organization_id"], name: "index_usage_records_on_organization_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", default: "", null: false
    t.bigint "current_organization_id"
    t.string "company_size"
    t.string "employee_count"
    t.string "referral_source"
    t.boolean "onboarding_completed", default: false, null: false
    t.index ["current_organization_id"], name: "index_users_on_current_organization_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "waitlist", force: :cascade do |t|
    t.string "email", null: false
    t.string "platform", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_waitlist_on_created_at"
    t.index ["email"], name: "index_waitlist_on_email", unique: true
  end

  add_foreign_key "campaigns", "products"
  add_foreign_key "campaigns", "users"
  add_foreign_key "engagement_logs", "leads"
  add_foreign_key "engagement_logs", "users"
  add_foreign_key "hashtags", "products"
  add_foreign_key "influencers", "products"
  add_foreign_key "leads", "campaigns"
  add_foreign_key "leads", "products"
  add_foreign_key "organization_memberships", "organizations"
  add_foreign_key "organization_memberships", "users"
  add_foreign_key "products", "organizations"
  add_foreign_key "products", "users"
  add_foreign_key "scanned_posts", "products"
  add_foreign_key "subscriptions", "organizations"
  add_foreign_key "subscriptions", "plans"
  add_foreign_key "usage_records", "organizations"
  add_foreign_key "users", "organizations", column: "current_organization_id"
end
