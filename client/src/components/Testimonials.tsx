import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  stars: number;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I used to spend 2 hours a day manually scanning influencer comments looking for leads. Signal Harvester does it automatically and surfaces only the ones worth replying to. Got 3 new clients in my first week.",
    name: "Priya R.",
    handle: "@priya_growthlab",
    role: "Growth Consultant",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4",
    stars: 5,
    result: "3 new clients in week 1",
  },
  {
    quote:
      "We sell a DTC supplement and the comment section of fitness influencers is pure gold. Signal Harvester finds people asking 'what protein do you use?' in real time. Our reply-to-sale rate is around 28%.",
    name: "Marcus T.",
    handle: "@marcust_drcfit",
    role: "DTC Founder, Fitness Supplements",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=ffdfbf",
    stars: 5,
    result: "28% reply-to-sale rate",
  },
  {
    quote:
      "I've tried Phantombuster and ManyChat. Signal Harvester is completely different — those tools automate what you do after you find someone. This tool actually finds the right people to begin with. Game changer for my agency.",
    name: "Sofia K.",
    handle: "@sofiakdesigns",
    role: "Social Media Agency Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=c0aede",
    stars: 5,
    result: "Eliminated 12h/week of manual work",
  },
  {
    quote:
      "My coaching business was flatline for 6 months. A friend told me to try Signal Harvester. I tracked three mindset influencers and found 20 people asking for coaching recommendations in the first 24 hours. Booked 4 discovery calls.",
    name: "James O.",
    handle: "@jamescoaches",
    role: "Executive Coach",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1f4d1",
    stars: 5,
    result: "4 discovery calls, day 1",
  },
  {
    quote:
      "We run ads but the CPL was getting insane. Signal Harvester gave us a free lead channel. People in the comments are already asking about products like ours — we just needed to be the first to show up.",
    name: "Rachel M.",
    handle: "@rachelm_ecomm",
    role: "eCommerce Brand Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel&backgroundColor=ffd5dc",
    stars: 5,
    result: "Cut CPL by 60% vs paid ads",
  },
  {
    quote:
      "I'm an indie hacker and Signal Harvester is the first lead gen tool I've found that actually works for niche SaaS. I track dev communities on Instagram and TikTok. When someone asks 'any good tool for X?', I'm there within minutes.",
    name: "Arjun P.",
    handle: "@arjunbuilds",
    role: "Indie Hacker / SaaS Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=e8f5e9",
    stars: 5,
    result: "First 50 users without ads",
  },
];

const StarRating: React.FC<{ count: number }> = ({ count }) => (
  <div className="flex gap-0.5 mb-3">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative">
    {/* Result badge */}
    <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
      {testimonial.result}
    </div>

    <Quote className="w-6 h-6 text-emerald-200 flex-shrink-0" />

    <StarRating count={testimonial.stars} />

    <p className="text-slate-700 text-sm leading-relaxed flex-1">
      "{testimonial.quote}"
    </p>

    <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"
      />
      <div>
        <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
        <p className="text-xs text-slate-400">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

// JSON-LD structured data for testimonials (AggregateRating + Review)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Signal Harvester",
  "description": "Instagram and TikTok lead generation tool that finds buyers inside comment sections using AI buying intent detection.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": testimonials.length.toString(),
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": testimonials.map((t) => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": t.stars.toString(),
      "bestRating": "5",
    },
    "author": {
      "@type": "Person",
      "name": t.name,
    },
    "reviewBody": t.quote,
  })),
};

export const Testimonials: React.FC = () => {
  return (
    <section
      id="testimonials"
      aria-label="Customer testimonials"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.04),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">
            What customers say
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
            Real results from real comment sections
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Coaches, DTC brands, agencies, and founders use Signal Harvester to find buyers in the
            places their audience already hangs out.
          </p>

          {/* Aggregate star display */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-slate-700 font-semibold text-sm">
              5.0 from {testimonials.length} reviews
            </span>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <p className="text-center text-slate-400 text-sm mt-12">
          Join 500+ brands already using Signal Harvester to generate leads from Instagram comments.
        </p>
      </div>
    </section>
  );
};
