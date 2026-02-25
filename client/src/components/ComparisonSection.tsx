import React from 'react';
import { CheckCircle2, XCircle, Minus } from 'lucide-react';

const Check = () => <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
const Cross = () => <XCircle className="w-5 h-5 text-red-400 mx-auto" />;
const Partial = () => <Minus className="w-5 h-5 text-slate-400 mx-auto" />;

const comparisonRows = [
  { feature: 'AI buying intent detection', sh: <Check />, manychat: <Cross />, phantombuster: <Cross />, brandwatch: <Cross /> },
  { feature: 'Lead scoring by purchase likelihood', sh: <Check />, manychat: <Cross />, phantombuster: <Cross />, brandwatch: <Cross /> },
  { feature: 'AI-generated reply suggestions', sh: <Check />, manychat: <Check />, phantombuster: <Cross />, brandwatch: <Cross /> },
  { feature: 'Real-time comment scanning', sh: <Check />, manychat: <Check />, phantombuster: <Partial />, brandwatch: <Check /> },
  { feature: 'Purpose-built for social selling', sh: <Check />, manychat: <Cross />, phantombuster: <Cross />, brandwatch: <Cross /> },
  { feature: 'No Instagram login required', sh: <Check />, manychat: <Cross />, phantombuster: <Cross />, brandwatch: <Check /> },
  { feature: 'Affordable for small teams', sh: <Check />, manychat: <Check />, phantombuster: <Partial />, brandwatch: <Cross /> },
  { feature: 'TikTok comment coverage', sh: <Check />, manychat: <Partial />, phantombuster: <Cross />, brandwatch: <Partial /> },
];

const roiPoints = [
  {
    metric: '10+ hours/week',
    label: 'Manual scanning eliminated',
    sub: 'Stop checking comment threads by hand'
  },
  {
    metric: '3–5×',
    label: 'Faster response time',
    sub: 'Reply while intent is hot'
  },
  {
    metric: '~40%',
    label: 'More leads captured per post',
    sub: 'AI catches signals humans miss'
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section id="comparison" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Competitor SEO schema - invisible to users */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Signal Harvester vs ManyChat: what's the difference?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ManyChat automates DM sequences triggered by comments. Signal Harvester detects buying intent in comments and scores leads by purchase likelihood BEFORE engagement. They solve different problems — Signal Harvester finds who to talk to, ManyChat automates what to say."
            }
          },
          {
            "@type": "Question",
            "name": "Signal Harvester vs Phantombuster for Instagram lead generation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Phantombuster is a general automation toolkit. Signal Harvester is purpose-built for buying intent detection in Instagram and TikTok comments, with AI lead scoring and reply generation built in."
            }
          },
          {
            "@type": "Question",
            "name": "How much time does Signal Harvester save on lead generation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most teams eliminate 10+ hours per week of manual comment scanning. Signal Harvester's AI surfaces only high-intent comments, so your team only engages with prospects who are actually considering a purchase."
            }
          }
        ]
      })}} />

      <div className="container mx-auto px-6 relative z-10">
        {/* ROI Section */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">Why It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4 tracking-tight">
            The numbers behind the tool
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Speed is the moat in social selling. Buyers who get a reply within minutes convert at 3–5× the rate of those contacted hours later.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20 max-w-4xl mx-auto">
          {roiPoints.map((point, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
              <div className="text-4xl font-extrabold text-emerald-600 mb-1">{point.metric}</div>
              <div className="text-slate-900 font-bold mb-1">{point.label}</div>
              <div className="text-slate-500 text-sm">{point.sub}</div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Signal Harvester vs the alternatives
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Other tools handle DMs, brand monitoring, or general automation. Signal Harvester is the only tool built specifically to find buyers hiding in comment sections.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-4 text-slate-600 font-semibold text-sm w-2/5">Feature</th>
                <th className="px-4 py-4 text-center">
                  <div className="text-emerald-700 font-bold text-sm">Signal Harvester</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="text-slate-500 font-medium text-sm">ManyChat</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="text-slate-500 font-medium text-sm">Phantombuster</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="text-slate-500 font-medium text-sm">Brandwatch</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4 text-slate-700 text-sm font-medium">{row.feature}</td>
                  <td className="px-4 py-4 text-center">{row.sh}</td>
                  <td className="px-4 py-4 text-center">{row.manychat}</td>
                  <td className="px-4 py-4 text-center">{row.phantombuster}</td>
                  <td className="px-4 py-4 text-center">{row.brandwatch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Comparison based on publicly available feature documentation. Some features may vary by pricing tier.
          </p>
        </div>
      </div>
    </section>
  );
};
