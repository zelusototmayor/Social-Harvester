import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ExamplesCarousel } from './components/ExamplesCarousel';
import { CompetitorAd } from './components/CompetitorAd';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { WaitlistForm } from './components/WaitlistForm';

const SEOComparisonFAQ: React.FC = () => (
  <section className="py-20 bg-slate-50 border-y border-slate-200" aria-labelledby="comparison-faq-heading">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 id="comparison-faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Signal Harvester vs Manual Instagram Lead Generation
      </h2>
      <p className="text-slate-600 text-lg mb-10">
        Most teams lose revenue because comment sections move faster than humans can monitor. This workflow helps sales teams capture
        warm leads in minutes instead of hours.
      </p>

      <div className="space-y-6">
        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Can Signal Harvester replace manual comment prospecting workflows?</h3>
          <p className="text-slate-700 leading-relaxed">
            Yes. Teams use it to detect buying intent, prioritize hot conversations, and reduce manual scanning time from hours to minutes.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">What makes Signal Harvester a strong Instagram comment lead generation tool?</h3>
          <p className="text-slate-700 leading-relaxed">
            It turns noisy comment feeds into a prioritized pipeline. Instead of manually reading hundreds of comments, your team gets
            high-intent prospects surfaced first, with suggested replies tailored to each buyer signal.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">How is this different from social media scheduling tools?</h3>
          <p className="text-slate-700 leading-relaxed">
            Scheduling tools focus on publishing. Signal Harvester focuses on demand capture — scanning comments for buying intent,
            prioritizing high-intent conversations, and suggesting responses your team can send immediately.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Can agencies use Signal Harvester for multiple clients?</h3>
          <p className="text-slate-700 leading-relaxed">
            Yes. Agencies can monitor multiple niches, identify prospect intent patterns, and hand off conversation-ready leads to each
            client account manager with less manual triage.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Do I need technical skills to get started?</h3>
          <p className="text-slate-700 leading-relaxed">
            No. Most teams connect their first workflow in about 5 minutes and can export qualified leads to CSV immediately.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Can Signal Harvester help qualify leads before they hit the CRM?</h3>
          <p className="text-slate-700 leading-relaxed">
            Yes. Teams can score comment intent first, route only qualified conversations to sales, and avoid cluttering the CRM with low-intent noise.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">What is a good first use case?</h3>
          <p className="text-slate-700 leading-relaxed">
            Start with one product launch campaign. Track phrases like "price?", "link?", "where to buy?", and "is this available in [country]?"
            Then compare lead volume and reply speed against your manual process for one week.
          </p>
        </article>
      </div>
    </div>
  </section>
);

const CommunityProofSection: React.FC = () => (
  <section className="py-16 bg-emerald-50/40 border-y border-emerald-100" aria-labelledby="community-proof-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="community-proof-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Turn Instagram comments into sales leads in minutes
      </h2>
      <p className="text-slate-700 text-lg mb-8">
        Signal Harvester finds high-intent comments like “where can I buy?”, “price?”, and “link?” so your team can respond
        while buyer intent is still hot.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="bg-white border border-emerald-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Capture warm intent in minutes</h3>
          <p className="text-slate-700 leading-relaxed">
            Detect comments with buying language like "price?", "link?", and "where can I buy" before competitors reply.
          </p>
        </article>

        <article className="bg-white border border-emerald-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Reply with credibility, not hype</h3>
          <p className="text-slate-700 leading-relaxed">
            Generate context-aware reply drafts your team can personalize quickly, so conversations feel helpful instead of scripted.
          </p>
        </article>

        <article className="bg-white border border-emerald-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Run exception-only workflows</h3>
          <p className="text-slate-700 leading-relaxed">
            Automate routine scanning and triage, then alert humans only when a high-value lead needs a real response.
          </p>
        </article>
      </div>
    </div>
  </section>
);

const SpeedToLeadSection: React.FC = () => (
  <section className="py-20 bg-white border-y border-slate-200" aria-labelledby="speed-to-lead-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="speed-to-lead-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Instagram comment lead generation software built for speed-to-reply
      </h2>
      <p className="text-slate-600 text-lg mb-10">
        Most teams lose high-intent buyers because replies happen hours later. Signal Harvester helps you detect and respond while intent is still fresh.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Find buyer intent instantly</h3>
          <p className="text-slate-700 leading-relaxed">
            Automatically flag comments like “price?”, “link?”, “how to order?”, and “available in my country?” the moment they appear.
          </p>
        </article>

        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Prioritize high-value threads</h3>
          <p className="text-slate-700 leading-relaxed">
            Sort conversations by purchase intent so your team works the hottest opportunities first instead of scanning every comment manually.
          </p>
        </article>

        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Reply faster with better context</h3>
          <p className="text-slate-700 leading-relaxed">
            Use AI-assisted response drafts your team can personalize quickly to boost reply speed without sounding robotic.
          </p>
        </article>
      </div>
    </div>
  </section>
);

const GEOUseCaseSection: React.FC = () => (
  <section className="py-20 bg-white" aria-labelledby="geo-use-cases-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="geo-use-cases-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        AI lead generation use cases for agencies and social sales teams
      </h2>
      <p className="text-slate-600 text-lg mb-10">
        Use Signal Harvester to capture high-intent demand from Instagram comment sections before competitors respond.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Instagram lead generation for agencies</h3>
          <p className="text-slate-700 leading-relaxed">
            Track buying-intent phrases across client campaigns and hand sales-ready leads to account managers faster.
          </p>
        </article>

        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Comment intent monitoring for ecommerce</h3>
          <p className="text-slate-700 leading-relaxed">
            Identify "price?", "where to buy?", and "is this available?" signals to increase conversion from social conversations.
          </p>
        </article>

        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Social selling workflows for founders</h3>
          <p className="text-slate-700 leading-relaxed">
            Prioritize warm comment threads daily and reply with high-context message suggestions in minutes, not hours.
          </p>
        </article>
      </div>
    </div>
  </section>
);

const GEODefinitiveSection: React.FC = () => (
  <section className="py-20 bg-white border-y border-slate-200" aria-labelledby="geo-definitive-heading">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 id="geo-definitive-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        What is Instagram comment lead generation?
      </h2>
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="text-slate-700 leading-relaxed mb-6">
          Instagram comment lead generation is the process of identifying potential buyers by analyzing comment sections on Instagram posts for buying intent signals — phrases like "price?", "where can I buy this?", "link please", and "is this available in [country]?". These comments represent warm demand: real people actively seeking a product or service.
        </p>
        <p className="text-slate-700 leading-relaxed mb-6">
          Unlike cold outbound or paid ads, comment-based lead generation captures existing intent. The buyer has already discovered the product and is asking questions. The only variable is response speed — teams that reply within minutes convert at 3–5x the rate of teams that reply hours later.
        </p>
        <p className="text-slate-700 leading-relaxed mb-6">
          Manual comment monitoring doesn't scale. A single viral post can generate hundreds of comments in hours. AI-powered tools like Signal Harvester automate intent detection, scoring each comment by purchase likelihood and surfacing only the highest-value conversations for human follow-up.
        </p>
        <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Key metrics for comment lead generation</h3>
        <ul className="text-slate-700 space-y-2 mb-6">
          <li><strong>Intent detection rate:</strong> percentage of buying-intent comments correctly identified</li>
          <li><strong>Speed-to-reply:</strong> average time between comment posted and team response</li>
          <li><strong>Lead-to-conversation rate:</strong> percentage of identified leads that enter a sales conversation</li>
          <li><strong>Comment-to-sale conversion:</strong> percentage of comment leads that result in a purchase</li>
        </ul>
        <p className="text-slate-700 leading-relaxed">
          The best Instagram comment lead generation tools combine AI intent scoring with reply workflow automation, reducing the manual effort from hours of scrolling to minutes of high-value responses.
        </p>
      </div>
    </div>
  </section>
);

const CompetitorComparisonSection: React.FC = () => (
  <section className="py-20 bg-slate-50 border-y border-slate-200" aria-labelledby="competitor-comparison-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="competitor-comparison-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Signal Harvester vs generic social media tools
      </h2>
      <p className="text-slate-600 text-lg mb-8">
        Most social suites optimize publishing. Signal Harvester optimizes revenue capture from high-intent Instagram comments.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm uppercase tracking-wide">
              <th className="p-4">Capability</th>
              <th className="p-4">Signal Harvester</th>
              <th className="p-4">Generic social tools</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="p-4 font-medium text-slate-900">Buying-intent detection</td>
              <td className="p-4 text-slate-700">Real-time comment intent scoring</td>
              <td className="p-4 text-slate-600">Manual filtering only</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="p-4 font-medium text-slate-900">Reply workflow</td>
              <td className="p-4 text-slate-700">Context-aware suggested replies</td>
              <td className="p-4 text-slate-600">No lead-specific response guidance</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="p-4 font-medium text-slate-900">Team handoff</td>
              <td className="p-4 text-slate-700">Priority queue for sales follow-up</td>
              <td className="p-4 text-slate-600">General inbox, limited lead triage</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
);


const SocialListeningComparisonSection: React.FC = () => (
  <section className="py-20 bg-white border-y border-slate-200" aria-labelledby="social-listening-comparison-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="social-listening-comparison-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Signal Harvester vs. Traditional Social Listening
      </h2>
      <p className="text-slate-600 text-lg mb-8">
        Social listening tools tell you <em>what</em> people are saying. Signal Harvester helps you <em>sell</em> to them.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <article className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">👂</span> Social Listening
          </h3>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">✕</span>
              <span>Focuses on brand sentiment and volume trends</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">✕</span>
              <span>Requires manual sifting through thousands of mentions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">✕</span>
              <span>Reports usually delivered weekly or monthly (too late to act)</span>
            </li>
          </ul>
        </article>

        <article className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡️</span> Signal Harvester
          </h3>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Focuses on <strong>commercial intent</strong> (who wants to buy <em>now</em>)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Filters out noise, surfacing only actionable leads</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 mt-1">✓</span>
              <span><strong>Instant alerts</strong> so you can reply while the wallet is out</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
);

const AgencyLeadGenSection: React.FC = () => (
  <section className="py-20 bg-slate-50 border-y border-slate-200" aria-labelledby="agency-lead-gen-heading">
    <div className="container mx-auto px-6 max-w-5xl">
      <h2 id="agency-lead-gen-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Instagram lead generation for agencies — without hiring more headcount
      </h2>
      <p className="text-slate-600 text-lg mb-10">
        Agencies managing multiple client accounts can't manually scan every comment section. Signal Harvester surfaces only the high-intent conversations across all your clients, so your team spends time on leads — not on triage.
      </p>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Multi-client intent monitoring</h3>
          <p className="text-slate-700 leading-relaxed">
            Track buying signals across all your client Instagram accounts from one dashboard. No more switching between accounts hoping you caught everything.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Sales-ready lead handoffs</h3>
          <p className="text-slate-700 leading-relaxed">
            Export qualified leads to CSV or route them directly to client account managers with enough context to close — not just a raw comment link.
          </p>
        </article>

        <article className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Reply speed as a deliverable</h3>
          <p className="text-slate-700 leading-relaxed">
            Turn comment response time into an agency SLA. Agencies that respond to buying intent within 30 minutes convert at 3–5× the rate of those that reply the next day.
          </p>
        </article>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">How agencies use Signal Harvester</h3>
        <ol className="space-y-4">
          {[
            { step: '1', title: 'Connect client Instagram accounts', desc: 'Link all client accounts and set buying-signal keywords per niche (e.g. "price?", "ship to?", "where to buy?").' },
            { step: '2', title: 'Receive intent alerts in real time', desc: 'Get notified when high-intent comments appear across any client account — no manual scanning required.' },
            { step: '3', title: 'Reply within the response SLA', desc: 'Use context-aware reply suggestions to respond in under 60 seconds, before competitors can react.' },
            { step: '4', title: 'Hand off warm leads to sales', desc: 'Route qualified conversations to the client\'s sales team with full context — no warm-lead drop-off at handoff.' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">{step}</span>
              <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-slate-600 text-sm mt-1">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Signal Harvester",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://signalharvester.com",
  description: "AI-powered Instagram comment intent detection and lead qualification for social sales teams.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can Signal Harvester replace manual Instagram lead tracking?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. It detects high-intent buyer comments and prioritizes follow-up so teams spend less time manually scanning comment threads." }
    },
    {
      "@type": "Question",
      name: "What makes Signal Harvester different from social schedulers?",
      acceptedAnswer: { "@type": "Answer", text: "Schedulers optimize publishing. Signal Harvester optimizes demand capture by identifying buying intent and suggesting fast, context-aware replies." }
    },
    {
      "@type": "Question",
      name: "How is Signal Harvester different from traditional social listening?",
      acceptedAnswer: { "@type": "Answer", text: "Traditional social listening tools focus on brand sentiment and volume over time (reporting). Signal Harvester focuses on commercial intent and immediate action (sales). It's designed to help you sell, not just listen." }
    },
    {
      "@type": "Question",
      name: "Who should use Signal Harvester first?",
      acceptedAnswer: { "@type": "Answer", text: "Agencies, ecommerce teams, and founders running social selling workflows who need to convert comment intent into qualified leads quickly." }
    },
    {
      "@type": "Question",
      name: "Can Signal Harvester qualify leads before CRM handoff?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Signal Harvester can score comment intent before lead routing so sales teams prioritize qualified conversations and reduce CRM noise." }
    },
    {
      "@type": "Question",
      name: "How is Signal Harvester different from social listening tools like Brandwatch or Mention?",
      acceptedAnswer: { "@type": "Answer", text: "Social listening tools track brand mentions and measure sentiment over time — they produce reports. Signal Harvester detects commercial buying intent in Instagram and TikTok comments in real time and helps your team respond while interest is still active. It's a lead generation tool, not a monitoring tool." }
    },
    {
      "@type": "Question",
      name: "Can agencies use Signal Harvester for lead generation across multiple clients?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Signal Harvester is designed for agencies managing multiple client Instagram accounts. It surfaces high-intent comments across all accounts in one place, so your team can triage leads and hand off sales-ready conversations to each client without manual account switching." }
    }
  ]
};

// Declare Mixpanel on window
declare global {
  interface Window {
    mixpanel: any;
  }
}

// Logo component using the uploaded image
const SignalHarvesterLogo = ({ className }: { className?: string }) => (
  <img src="/logo.png" alt="Signal Harvester Logo" className={className} />
);

const App: React.FC = () => {
  // Track page view when app loads
  useEffect(() => {
    if (window.mixpanel) {
      window.mixpanel.track_pageview();
    }
  }, []);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-200 selection:text-emerald-900">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
               <SignalHarvesterLogo className="w-full h-full" />
            </div>
            Signal Harvester
          </div>
          <button 
            onClick={scrollToWaitlist}
            className="hidden md:block bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-slate-200"
          >
            Get Early Access
          </button>
        </div>
      </nav>

      <main>
        <Hero onJoinClick={scrollToWaitlist} />
        <ExamplesCarousel />
        <CompetitorAd />
        <HowItWorks />
        <CommunityProofSection />
        <SpeedToLeadSection />
        <Features />
        <SEOComparisonFAQ />
        <AgencyLeadGenSection />
        <GEOUseCaseSection />
        <SocialListeningComparisonSection />
        <GEODefinitiveSection />
        <CompetitorComparisonSection />
        <WaitlistForm />
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <div className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden">
               <SignalHarvesterLogo className="w-full h-full" />
             </div>
             © 2026 Signal Harvester. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;