import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { subscriptionsApi } from '../hooks/useApi';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  tagline: string;
  features: string[];
  highlighted: boolean;
  icon: React.ReactNode;
  badge?: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying things out',
    tagline: 'Get started with the basics',
    features: [
      '1 product to monitor',
      '3 sources per product',
      '5 scans per month',
      '50 leads per month',
      'AI-powered intent analysis',
      'Community support',
    ],
    highlighted: false,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    name: 'Starter',
    price: '$29.99',
    period: '/month',
    description: 'For solo founders and freelancers',
    tagline: 'Everything you need to grow',
    features: [
      '3 products to monitor',
      '10 sources per product',
      '30 scans per month',
      '500 leads per month',
      'AI-powered intent analysis',
      'Email support',
    ],
    highlighted: false,
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    name: 'Growth',
    price: '$79.99',
    period: '/month',
    description: 'For growing teams and agencies',
    tagline: 'Scale your lead generation',
    features: [
      '10 products to monitor',
      '25 sources per product',
      '100 scans per month',
      '2,000 leads per month',
      'AI-powered intent analysis',
      'Priority email support',
    ],
    highlighted: true,
    icon: <Crown className="w-5 h-5" />,
    badge: 'Most Popular',
  },
  {
    name: 'Pro',
    price: '$249.99',
    period: '/month',
    description: 'For large teams and enterprises',
    tagline: 'Maximum capacity',
    features: [
      'Unlimited products',
      '50 sources per product',
      '300 scans per month',
      'Unlimited leads',
      'AI-powered intent analysis',
      'Priority email support',
    ],
    highlighted: false,
    icon: <Crown className="w-5 h-5" />,
  },
];

interface PlanSelectionModalProps {
  onSelectPlan: (planName: string) => void;
  isLoading?: boolean;
}

export default function PlanSelectionModal({ onSelectPlan, isLoading }: PlanSelectionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSelectPlan = async (planName: string) => {
    if (planName === 'Free') {
      onSelectPlan('free');
      return;
    }

    setSelectedPlan(planName);
    setCheckoutLoading(true);

    try {
      // Get plans from API to find the plan ID
      const plansData = await subscriptionsApi.plans();
      const plan = plansData.plans?.find((p: any) =>
        p.name.toLowerCase() === planName.toLowerCase()
      );

      if (plan) {
        const result = await subscriptionsApi.checkoutOnboarding(plan.id);
        if (result.checkout_url) {
          window.location.href = result.checkout_url;
          return;
        }
      }

      // Fallback to free if something goes wrong
      onSelectPlan('free');
    } catch (error) {
      console.error('Checkout error:', error);
      // Continue with free plan on error
      onSelectPlan('free');
    } finally {
      setCheckoutLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl my-8">
        {/* Modal Content */}
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center pt-10 pb-6 px-6 bg-gradient-to-b from-emerald-50 to-transparent">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/logo.png" alt="Signal Harvester" className="w-10 h-10" />
              <span className="text-xl font-bold text-slate-900">Signal Harvester</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Choose your plan
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Start free and upgrade anytime. All plans include a 14-day money-back guarantee.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="px-6 pb-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl p-5 transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 scale-[1.02] shadow-xl shadow-emerald-600/20'
                      : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium mb-3 ${
                      plan.highlighted
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {plan.icon}
                      {plan.name}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${
                        plan.highlighted ? 'text-white' : 'text-slate-900'
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${
                        plan.highlighted ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        {plan.period}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${
                      plan.highlighted ? 'text-emerald-100' : 'text-slate-500'
                    }`}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-emerald-200' : 'text-emerald-600'
                        }`} />
                        <span className={`text-sm ${
                          plan.highlighted ? 'text-white' : 'text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.name)}
                    disabled={checkoutLoading || isLoading}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all text-sm ${
                      plan.highlighted
                        ? 'bg-white text-emerald-600 hover:bg-emerald-50 disabled:bg-white/70'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400'
                    } disabled:cursor-not-allowed`}
                  >
                    {checkoutLoading && selectedPlan === plan.name ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : plan.name === 'Free' ? (
                      'Continue Free'
                    ) : (
                      'Start Free Trial'
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                No credit card required for free plan. Cancel paid plans anytime.
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  14-day money-back guarantee
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  Upgrade or downgrade anytime
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  Secure payment via Stripe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
