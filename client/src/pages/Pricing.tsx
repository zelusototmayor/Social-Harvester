import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try it out with limited features',
    features: [
      '1 product',
      '3 sources per product',
      '5 scans per month',
      '50 leads per month',
    ],
    cta: 'Get Started',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$29.99',
    period: '/month',
    description: 'For solo founders and freelancers',
    features: [
      '3 products',
      '10 sources per product',
      '30 scans per month',
      '500 leads per month',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=starter',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$79.99',
    period: '/month',
    description: 'For growing businesses and agencies',
    features: [
      '10 products',
      '25 sources per product',
      '100 scans per month',
      '2,000 leads per month',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=growth',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$249.99',
    period: '/month',
    description: 'For large teams and enterprises',
    features: [
      'Unlimited products',
      '50 sources per product',
      '300 scans per month',
      'Unlimited leads',
      'Priority support',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    href: '/register?plan=pro',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <img src="/logo.png" alt="Signal Harvester" className="w-8 h-8" />
            Signal Harvester
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Start free and scale as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 ${
                plan.highlighted
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-600 ring-offset-2'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={plan.highlighted ? 'text-emerald-100' : 'text-slate-500'}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    plan.highlighted ? 'text-emerald-100' : 'text-slate-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.highlighted ? 'text-emerald-200' : 'text-emerald-600'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-16 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              What counts as a "scan"?
            </h3>
            <p className="text-slate-600">
              A scan is triggered when you click "Scan Now" on a product. It scans all your
              active sources (influencers and hashtags) for that product to find new leads.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              What's a "source"?
            </h3>
            <p className="text-slate-600">
              A source is an Instagram account or hashtag you want to monitor. For example,
              @fitness_guru or #fitnessjourney are both sources.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              Can I upgrade or downgrade anytime?
            </h3>
            <p className="text-slate-600">
              Yes! You can upgrade anytime and get immediate access to the new features.
              When you downgrade, you'll keep your current plan until the end of the billing period.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-slate-600">
              We offer a 14-day money-back guarantee. If you're not satisfied within the first
              14 days, contact us for a full refund.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <Link to="/" className="hover:text-emerald-600">
            &larr; Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
