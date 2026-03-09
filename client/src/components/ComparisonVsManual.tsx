import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const rows = [
  {
    feature: 'Time to find leads',
    harvester: 'Seconds — real-time alerts as comments appear',
    manual: 'Hours of scrolling per day',
  },
  {
    feature: 'Lead quality',
    harvester: 'AI-scored by purchase intent (1–10)',
    manual: 'Hit-or-miss, no scoring',
  },
  {
    feature: 'Scale',
    harvester: 'Track 50+ influencers & hashtags simultaneously',
    manual: 'Limited to what you can physically browse',
  },
  {
    feature: 'Cost',
    harvester: 'Starts free — no credit card required',
    manual: 'Hours of founder / team time daily',
  },
  {
    feature: 'Real-time alerts',
    harvester: 'Instant notifications when high-intent comments appear',
    manual: 'None — you miss leads while offline',
  },
];

export const ComparisonVsManual: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Signal Harvester vs Manual Comment Monitoring',
    description:
      'See how Signal Harvester stacks up against manually scanning Instagram and TikTok comments for leads — time, quality, scale, cost, and real-time alerts.',
    mainEntity: {
      '@type': 'Table',
      name: 'Comparison: Signal Harvester vs Manual',
    },
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Why founders switch from manual to Signal Harvester
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Manual comment monitoring burns hours every day and still misses most leads. Signal
            Harvester runs 24/7 so you don't have to.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-6 py-4 text-left font-semibold w-1/4">Feature</th>
                <th className="px-6 py-4 text-left font-semibold w-3/8">
                  <span className="text-emerald-400">Signal Harvester</span>
                </th>
                <th className="px-6 py-4 text-left font-semibold w-3/8">Manual Monitoring</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-6 py-4 font-semibold text-slate-700">{row.feature}</td>
                  <td className="px-6 py-4 text-slate-700">
                    <span className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {row.harvester}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      {row.manual}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://app.signalharvester.com/signup"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-md"
          >
            Start for Free
          </a>
          <p className="text-slate-400 text-sm mt-3">No credit card required.</p>
        </div>
      </div>
    </section>
  );
};
