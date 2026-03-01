import React from 'react';
import { ShoppingBag, Search, Zap, MessageCircle, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    icon: <Search className="w-5 h-5" />,
    title: 'Track the influencers your buyers follow',
    description:
      'Add 5–20 Instagram influencers who post content in your product category. Think fitness influencers for supplement brands, interior designers for home décor, food creators for specialty food. Wherever your buyer scrolls — that\'s where Signal Harvester watches.',
  },
  {
    number: '02',
    icon: <Zap className="w-5 h-5" />,
    title: 'AI surfaces buying-intent comments in real time',
    description:
      'The AI scans every new comment and flags ones that show purchase intent: "where can I buy this?", "what brand is this?", "anyone have a dupe of [product]?", "does anyone know a good X for Y?". These aren\'t cold prospects — they\'re buyers mid-decision.',
  },
  {
    number: '03',
    icon: <Clock className="w-5 h-5" />,
    title: 'Reply within the first hour — before your competitors',
    description:
      'Buying-intent comments are time-sensitive. The window between "I want this" and "I found it somewhere else" is measured in hours. Signal Harvester surfaces these leads the moment they appear so you can be first to respond — which dramatically increases conversion.',
  },
  {
    number: '04',
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Track results, refine your targets, scale',
    description:
      'As you see which influencers and hashtags produce the highest-intent leads, shift more trackers toward them. Most e-commerce brands find 3–5 influencers drive 80%+ of leads. Signal Harvester makes it fast to identify them.',
  },
];

const signals = [
  '"Where can I buy this??"',
  '"What brand is this skirt from?"',
  '"Anyone know a dupe for [product]?"',
  '"Does anyone have a recommendation for X?"',
  '"I need to find a good Y, anyone?"',
  '"How do I get my hands on this??"',
  '"This is exactly what I\'ve been looking for 😍"',
  '"Tag someone who needs this 👇"',
];

// JSON-LD for e-commerce use case — targets "instagram lead generation for ecommerce" keyword cluster
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Instagram Lead Generation for E-commerce: How to Find Buyers in Comment Sections',
  description:
    'A step-by-step workflow for DTC and e-commerce brands to find high-intent buyers inside Instagram comment sections using Signal Harvester.',
  totalTime: 'PT10M',
  supply: [
    { '@type': 'HowToSupply', name: 'Signal Harvester account (free to start)' },
    { '@type': 'HowToSupply', name: 'List of relevant Instagram influencers in your niche' },
  ],
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
};

export const EcommercePlaybook: React.FC = () => {
  return (
    <section
      id="ecommerce-playbook"
      className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-lime-400/8 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase border border-emerald-500/30">
            <ShoppingBag className="w-4 h-4" />
            E-commerce &amp; DTC Playbook
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Instagram lead generation for e-commerce
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
              — find buyers before they find your competitors
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            People buying in your category are already on Instagram, leaving comments that broadcast their intent.
            Most brands never see them. Signal Harvester makes sure yours does.
          </p>
        </div>

        {/* Live signal examples */}
        <div className="mb-16">
          <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-6">
            Real comments Signal Harvester flags as buying intent
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {signals.map((signal, i) => (
              <span
                key={i}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-full font-medium hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-7 hover:border-emerald-500/40 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xs font-bold text-emerald-500 tracking-widest">{step.number}</span>
                    <h3 className="text-base font-bold text-white leading-snug">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Result stat bar */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-emerald-400 mb-1">~40%</div>
            <div className="text-slate-400 text-sm leading-snug">more leads captured per post<br />vs manual comment monitoring</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 mb-1">&lt;1 hr</div>
            <div className="text-slate-400 text-sm leading-snug">average time from buyer comment<br />to you being first to respond</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 mb-1">10 min</div>
            <div className="text-slate-400 text-sm leading-snug">setup time — first buying-intent<br />leads typically visible within the hour</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-10 rounded-2xl text-base transition-colors shadow-xl shadow-emerald-500/25 group"
          >
            <ShoppingBag className="w-5 h-5" />
            Find your first e-commerce lead
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-slate-500 text-sm mt-3">Free to start · No Instagram login required · Results in minutes</p>
        </div>
      </div>
    </section>
  );
};
