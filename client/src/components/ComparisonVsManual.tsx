import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const comparisonRows = [
  {
    feature: 'Time to find leads',
    harvester: 'Under 10 minutes',
    manual: 'Hours of scrolling',
    harvesterWins: true,
  },
  {
    feature: 'Lead quality',
    harvester: 'AI-ranked by purchase intent',
    manual: 'Guesswork — no scoring',
    harvesterWins: true,
  },
  {
    feature: 'Scale',
    harvester: 'Track 50+ influencers simultaneously',
    manual: '1–2 accounts at a time',
    harvesterWins: true,
  },
  {
    feature: 'Real-time alerts',
    harvester: 'Instant notifications on new signals',
    manual: 'Only when you remember to check',
    harvesterWins: true,
  },
  {
    feature: 'Cost',
    harvester: 'Free plan available',
    manual: 'Free but costs hours of labour',
    harvesterWins: true,
  },
  {
    feature: 'Consistency',
    harvester: '24/7 automated monitoring',
    manual: 'Stops when you stop',
    harvesterWins: true,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Signal Harvester vs Manual Comment Monitoring',
  description:
    'Compare Signal Harvester AI lead generation against manual Instagram and TikTok comment monitoring. See why founders switch to automated buying-signal detection.',
  mainEntity: {
    '@type': 'Table',
    name: 'Comparison: Signal Harvester vs Manual Comment Monitoring',
    about: 'Lead generation efficiency comparison between AI-powered monitoring and manual comment scanning',
  },
};

export const ComparisonVsManual: React.FC = () => {
  return (
    <section id="comparison-vs-manual" className="py-24 bg-slate-50">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
            Why founders switch
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Signal Harvester vs. Manual Comment Monitoring
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Manual comment scanning works — until it doesn't. The moment you step away, you miss the lead. Signal
            Harvester runs 24/7 so you never do.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-900 text-white text-sm font-semibold">
            <div className="px-6 py-4 text-slate-400">Feature</div>
            <div className="px-6 py-4 text-emerald-400">Signal Harvester</div>
            <div className="px-6 py-4">Manual Monitoring</div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
            >
              <div className="px-6 py-4 font-medium text-slate-700">{row.feature}</div>
              <div className="px-6 py-4 text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {row.harvester}
              </div>
              <div className="px-6 py-4 text-slate-500 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                {row.manual}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://signalharvester.com"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-md"
          >
            Start for Free — No Credit Card Required
          </a>
          <p className="mt-3 text-slate-400 text-sm">Free plan available. Upgrade when you're ready.</p>
        </div>
      </div>
    </section>
  );
};
