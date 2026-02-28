import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, Zap } from 'lucide-react';

const trustSignals = [
  { icon: <Shield className="w-4 h-4 text-emerald-400" />, text: "No credit card required" },
  { icon: <Clock className="w-4 h-4 text-emerald-400" />, text: "First lead in under 10 min" },
  { icon: <Users className="w-4 h-4 text-emerald-400" />, text: "500+ brands already using it" },
  { icon: <Zap className="w-4 h-4 text-emerald-400" />, text: "Cancel anytime, no lock-in" },
];

// Schema for the final CTA section — includes 2 common signup objection FAQs
const ctaJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to find my first Instagram lead with Signal Harvester?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most users see their first high-intent lead signal within 10 minutes of setup. You add the influencers or hashtags you want to track, the AI starts scanning immediately, and buying-intent comments surface in your lead queue in real time. There's no waiting period — results start as soon as your tracker activates."
      }
    },
    {
      "@type": "Question",
      "name": "Does Signal Harvester work for TikTok comments as well as Instagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Signal Harvester scans both Instagram and TikTok comment sections for buying intent signals. If your audience is active on TikTok — asking questions, sharing frustrations, or seeking recommendations in video comment threads — Signal Harvester surfaces those leads exactly the same way it does for Instagram. You can mix Instagram and TikTok influencers in the same tracker."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free plan for Signal Harvester?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — you can start Signal Harvester for free with no credit card required. The free plan lets you set up trackers, see your first lead signals, and evaluate whether the tool fits your lead generation workflow before committing to a paid plan."
      }
    }
  ]
};

export const WaitlistForm: React.FC = () => {
  return (
    <section id="waitlist" className="py-24 relative overflow-hidden bg-brand-dark">
      <script type="application/ld+json">{JSON.stringify(ctaJsonLd)}</script>

      <div className="absolute inset-0 bg-emerald-900/20 -z-10" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-800/50 bg-emerald-900/40 text-center">
          <div className="mb-8">
            <span className="inline-block text-emerald-400 font-semibold text-sm tracking-wide uppercase mb-3">
              Start for free — no credit card needed
            </span>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Find Your Next Customers<br />Inside Instagram Comments
            </h2>
            <p className="text-emerald-100/80 text-lg max-w-xl mx-auto leading-relaxed">
              Set up your first tracker in 5 minutes. Signal Harvester's AI finds people already asking for exactly what you sell — you just need to be first to reply.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-emerald-900/20 transform hover:scale-[1.02] transition-all mb-8"
          >
            Start Now for Free
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Trust signals row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {trustSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-1.5 text-emerald-100/70 text-xs font-medium"
              >
                {signal.icon}
                <span>{signal.text}</span>
              </div>
            ))}
          </div>

          {/* Micro FAQ — objection handlers */}
          <div className="mt-10 pt-8 border-t border-emerald-800/40 text-left space-y-5">
            <div>
              <p className="text-emerald-200 font-semibold text-sm mb-1">How fast will I see results?</p>
              <p className="text-emerald-100/60 text-sm leading-relaxed">
                Most users see their first buying-intent lead signal within 10 minutes of activating a tracker. No waiting period — the AI starts scanning Instagram and TikTok comment sections immediately.
              </p>
            </div>
            <div>
              <p className="text-emerald-200 font-semibold text-sm mb-1">Does it work for TikTok too?</p>
              <p className="text-emerald-100/60 text-sm leading-relaxed">
                Yes. Signal Harvester covers both Instagram and TikTok comment sections. Mix influencers from both platforms in a single tracker and see all your high-intent leads in one queue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
