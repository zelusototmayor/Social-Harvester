# Stripe Subscription Implementation Plan

## Overview
Implement a full subscription billing system with 4 tiers: Free, Starter ($29.99), Growth ($79.99), Pro ($249.99)

## Pricing Tiers

| Feature | Free | Starter | Growth | Pro |
|---------|------|---------|--------|-----|
| Price | $0 | $29.99/mo | $79.99/mo | $249.99/mo |
| Products | 1 | 3 | 10 | Unlimited |
| Sources/product | 3 | 10 | 25 | 50 |
| Scans/month | 5 | 30 | 100 | 300 |
| Leads/month | 50 | 500 | 2,000 | Unlimited |

---

## Phase 1: Backend Models & Database

### 1.1 Create Plan Model
- Store plan metadata locally (synced with Stripe)
- Fields: name, stripe_price_id, price_cents, interval, limits (JSON)

### 1.2 Create Subscription Model
- Links Organization to Plan
- Fields: stripe_subscription_id, stripe_customer_id, status, current_period_start, current_period_end

### 1.3 Create UsageRecord Model
- Track monthly usage per organization
- Fields: organization_id, period_start, scans_count, leads_count

### 1.4 Update Organization Model
- Add subscription association
- Add usage limit check methods

---

## Phase 2: Stripe Setup

### 2.1 Add Stripe Gem & Configuration
- Add `stripe` gem to Gemfile
- Configure API keys in credentials/ENV

### 2.2 Create Stripe Products & Prices
- Create rake task to sync plans with Stripe
- Create 3 products (Starter, Growth, Pro) with monthly prices

### 2.3 Webhook Endpoint
- POST /api/webhooks/stripe
- Handle: customer.subscription.created/updated/deleted
- Handle: invoice.paid, invoice.payment_failed

---

## Phase 3: Subscription API

### 3.1 Checkout Session Endpoint
- POST /api/subscriptions/checkout
- Creates Stripe Checkout session, returns URL

### 3.2 Customer Portal Endpoint
- POST /api/subscriptions/portal
- Returns Stripe billing portal URL for managing subscription

### 3.3 Subscription Status Endpoint
- GET /api/subscriptions/current
- Returns current plan, usage, limits

---

## Phase 4: Usage Tracking & Enforcement

### 4.1 Track Scans
- Increment usage on each scan job
- Check limits before allowing scan

### 4.2 Track Leads
- Increment usage when leads are created
- Soft limit (show warning, don't hard block)

### 4.3 Track Products & Sources
- Check limits on create actions
- Return appropriate error messages

---

## Phase 5: Frontend - Pricing Page

### 5.1 Public Pricing Page
- /pricing route
- Display all 4 tiers with features
- CTA buttons: Free → Register, Paid → Checkout

### 5.2 Navigation Update
- Add Pricing link to landing page nav

---

## Phase 6: Frontend - Dashboard Billing

### 6.1 Billing Settings Page
- /settings/billing route
- Show current plan & usage
- Upgrade/downgrade buttons
- Manage billing (portal link)

### 6.2 Usage Warnings
- Show warnings when approaching limits
- Upgrade prompts when at limit

### 6.3 Limit Enforcement UI
- Disable "Add Product" when at limit
- Disable "Add Source" when at limit
- Disable "Scan" when at limit

---

## Verification Checklist

### Backend
- [ ] Migrations run successfully
- [ ] Stripe products created
- [ ] Webhook endpoint responds to test events
- [ ] Usage tracking increments correctly
- [ ] Limit checks work correctly

### Frontend
- [ ] Pricing page displays correctly
- [ ] Checkout redirects to Stripe
- [ ] Portal redirects to Stripe
- [ ] Usage displayed in dashboard
- [ ] Limit warnings appear

### End-to-End
- [ ] New user starts on Free plan
- [ ] Can upgrade to paid plan via Stripe Checkout
- [ ] Webhook updates subscription status
- [ ] Can access portal to manage billing
- [ ] Cancellation revokes access appropriately
- [ ] Usage limits enforced correctly

---

## Files to Create/Modify

### Create
- `db/migrate/XXX_create_plans.rb`
- `db/migrate/XXX_create_subscriptions.rb`
- `db/migrate/XXX_create_usage_records.rb`
- `app/models/plan.rb`
- `app/models/subscription.rb`
- `app/models/usage_record.rb`
- `app/controllers/api/webhooks_controller.rb`
- `app/controllers/api/subscriptions_controller.rb`
- `lib/tasks/stripe.rake`
- `client/src/pages/Pricing.tsx`
- `client/src/pages/Billing.tsx`

### Modify
- `Gemfile` (add stripe gem)
- `config/routes.rb` (add webhook & subscription routes)
- `app/models/organization.rb` (add subscription association)
- `app/jobs/scrape_*.rb` (add usage tracking)
- `app/controllers/api/products_controller.rb` (add limit checks)
- `client/src/App.tsx` (add routes)
- `client/src/components/dashboard/*` (add usage display)
