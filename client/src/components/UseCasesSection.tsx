import React from 'react';
import { ShoppingBag, Users, Briefcase, ArrowRight } from 'lucide-react';

interface UseCase {
  icon: React.ReactNode;
  persona: string;
  headline: string;
  pain: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  keywords: string; // hidden for SEO context
}

const useCases: UseCase[] = [
  {
    icon: <ShoppingBag className="w-7 h-7" />,
    persona: 'DTC & E-commerce Brands',
    headline: 'Stop losing buyers to faster competitors.',
    pain:
      'Your product is mentioned in comment sections daily — by people actively looking to buy. You never see them. Your competitor does.',
    outcome:
      'Signal Harvester monitors the influencers and hashtags your buyers follow. When someone says "where can I get this?" you get the lead before anyone else replies.',
    metric: '~40%',
    metricLabel: 'more leads captured per post vs manual monitoring',
    keywords: 'instagram lead generation for ecommerce, buying intent instagram, dtc instagram leads',
  },
  {
    icon: <Users className="w-7 h-7" />,
    persona: 'Coaches & Consultants',
    headline: 'Find people who are already looking for your help.',
    pain:
      'Cold outreach is slow and the reply rates are brutal. But people in your niche are posting every day: "I need help with X," "Does anyone know a good Y coach?"',
    outcome:
      'Set Signal Harvester on 5–10 influencers in your niche. Get a live feed of prospects expressing a pain you solve — before they find someone else. Reply while the intent is hot.',
    metric: '3–5×',
    metricLabel: 'faster response time to high-intent prospects',
    keywords: 'instagram lead generation for coaches, find coaching clients instagram, social selling for consultants',
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    persona: 'Social Media Agencies',
    headline: 'Scale client acquisition without hiring.',
    pain:
      "Your team already manages multiple clients' Instagram presence. Manually scanning comment threads for leads is a time sink no headcount can fix.",
    outcome:
      'One Signal Harvester workspace. Multiple client trackers. Your team gets a prioritized queue of high-intent leads across all accounts — sorted by purchase likelihood, ready to action.',
    metric: '10+ hrs/week',
    metricLabel: 'of manual comment scanning eliminated per client',
    keywords: 'social selling tool for agencies, instagram lead gen tool agency, social media agency lead generation',
  },
];

export const UseCasesSection: React.FC = () => {
  // Hidden schema for use-case keyword targeting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Signal Harvester Use Cases',
    description:
      'How DTC brands, coaches, consultants, and social media agencies use Signal Harvester to find high-intent Instagram leads.',
    itemListElement: useCases.map((uc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: uc.persona,
      description: `${uc.pain} ${uc.outcome}`,
    })),
  };

  return (
    <section id="use-cases" className="py-24 bg-white relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Who It's For
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Built for teams who sell on Instagram
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Whether you're running a brand, a coaching practice, or a client portfolio — your buyers are already talking on Instagram. Signal Harvester makes sure you hear them first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {useCases.map((uc, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Icon + Persona */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  {uc.icon}
                </div>
                <span className="font-bold text-slate-800 text-sm leading-snug">{uc.persona}</span>
              </div>

              {/* Headline */}
              <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight">{uc.headline}</h3>

              {/* Pain */}
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{uc.pain}</p>

              {/* Outcome */}
              <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1">{uc.outcome}</p>

              {/* Metric */}
              <div className="mt-auto pt-5 border-t border-slate-200 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600">{uc.metric}</span>
                <span className="text-slate-500 text-xs leading-snug">{uc.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-base transition-colors shadow-lg shadow-emerald-500/20"
          >
            Start finding high-intent leads
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-slate-400 text-sm mt-3">Free to start · No Instagram login required</p>
        </div>
      </div>
    </section>
  );
};
