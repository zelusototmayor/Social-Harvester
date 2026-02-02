import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { subscriptionsApi } from '../hooks/useApi';
import {
  CreditCard,
  Check,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Crown,
  Zap,
  Package,
  Target,
  Users,
} from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  price_cents: number;
  price_formatted: string;
  interval: string;
  limits: {
    products: number | null;
    sources_per_product: number | null;
    scans_per_month: number | null;
    leads_per_month: number | null;
  };
  unlimited_products: boolean;
  unlimited_leads: boolean;
  free: boolean;
}

interface Subscription {
  id: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at: string | null;
  will_cancel: boolean;
  days_until_renewal: number | null;
}

interface UsageData {
  used: number;
  limit: number | null;
  unlimited: boolean;
}

interface SubscriptionData {
  plan: Plan;
  subscription: Subscription | null;
  usage: {
    products: UsageData;
    scans: UsageData;
    leads: UsageData;
  };
  can_create_product: boolean;
  can_scan: boolean;
}

export default function Billing() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState<number | null>(null);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();

    // Check for success/canceled params from Stripe redirect
    if (searchParams.get('success') === 'true') {
      setMessage({ type: 'success', text: 'Your subscription has been updated successfully!' });
    } else if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled.' });
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      const [currentData, plansData] = await Promise.all([
        subscriptionsApi.current(),
        subscriptionsApi.plans(),
      ]);
      setData(currentData);
      setPlans(plansData.plans);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    setIsUpgrading(planId);
    try {
      const result = await subscriptionsApi.checkout(planId);
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      console.error('Failed to start checkout:', error);
      setMessage({ type: 'error', text: 'Failed to start checkout. Please try again.' });
    } finally {
      setIsUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    setIsOpeningPortal(true);
    try {
      const result = await subscriptionsApi.portal();
      if (result.portal_url) {
        window.location.href = result.portal_url;
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      setMessage({ type: 'error', text: 'Failed to open billing portal. Please try again.' });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const formatLimit = (usage: UsageData) => {
    if (usage.unlimited) return 'Unlimited';
    return `${usage.used} / ${usage.limit}`;
  };

  const getUsagePercentage = (usage: UsageData) => {
    if (usage.unlimited || !usage.limit) return 0;
    return Math.min((usage.used / usage.limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Failed to load billing information.</p>
        </div>
      </DashboardLayout>
    );
  }

  const currentPlan = data.plan;
  const paidPlans = plans.filter((p) => !p.free);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Billing & Usage</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-slate-500">Current Plan</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{currentPlan.name}</h2>
              <p className="text-slate-600 mt-1">
                {currentPlan.free ? (
                  'Free forever'
                ) : (
                  <>
                    {currentPlan.price_formatted}
                    {data.subscription?.will_cancel && (
                      <span className="text-amber-600 ml-2">
                        (Cancels on{' '}
                        {new Date(data.subscription.cancel_at!).toLocaleDateString()})
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
            {!currentPlan.free && data.subscription?.stripe_customer_id && (
              <button
                onClick={handleManageBilling}
                disabled={isOpeningPortal}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                {isOpeningPortal ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Manage Billing
              </button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">This Month's Usage</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Products</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {formatLimit(data.usage.products)}
                </span>
              </div>
              {!data.usage.products.unlimited && (
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(
                      getUsagePercentage(data.usage.products)
                    )} transition-all`}
                    style={{ width: `${getUsagePercentage(data.usage.products)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Scans */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Scans</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {formatLimit(data.usage.scans)}
                </span>
              </div>
              {!data.usage.scans.unlimited && (
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(
                      getUsagePercentage(data.usage.scans)
                    )} transition-all`}
                    style={{ width: `${getUsagePercentage(data.usage.scans)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Leads */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Leads</span>
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {formatLimit(data.usage.leads)}
                </span>
              </div>
              {!data.usage.leads.unlimited && (
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(
                      getUsagePercentage(data.usage.leads)
                    )} transition-all`}
                    style={{ width: `${getUsagePercentage(data.usage.leads)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        {currentPlan.free || currentPlan.name !== 'Pro' ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upgrade Your Plan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {paidPlans.map((plan) => {
                const isCurrent = plan.id === currentPlan.id;
                const isDowngrade = plan.price_cents < currentPlan.price_cents;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-4 ${
                      isCurrent
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                      {isCurrent && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-3">
                      {plan.price_formatted}
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1 mb-4">
                      <li>
                        {plan.unlimited_products
                          ? 'Unlimited products'
                          : `${plan.limits.products} products`}
                      </li>
                      <li>{plan.limits.sources_per_product} sources/product</li>
                      <li>{plan.limits.scans_per_month} scans/month</li>
                      <li>
                        {plan.unlimited_leads
                          ? 'Unlimited leads'
                          : `${plan.limits.leads_per_month} leads/month`}
                      </li>
                    </ul>
                    {!isCurrent && (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isUpgrading === plan.id}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          isDowngrade
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isUpgrading === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {isDowngrade ? 'Downgrade' : 'Upgrade'}
                            <ArrowUpRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white text-center">
            <Zap className="w-10 h-10 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">You're on the Pro plan!</h3>
            <p className="text-emerald-100">
              You have access to all features. Thank you for your support!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
