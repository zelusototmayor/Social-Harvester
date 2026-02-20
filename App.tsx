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
        <Features />
        <SEOComparisonFAQ />
        <GEOUseCaseSection />
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