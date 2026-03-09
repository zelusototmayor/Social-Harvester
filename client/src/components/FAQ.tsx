import React from 'react';
import { HelpCircle, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="border-b border-slate-200 py-6">
    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
      <HelpCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      {question}
    </h3>
    <p className="text-slate-600 leading-relaxed text-sm ml-7">
      {answer}
    </p>
  </div>
);

export const FAQ: React.FC = () => {
  const faqData = [
    {
      question: "How does Signal Harvester find buying signals on Instagram?",
      answer: "Our AI agent monitors the comment sections of specific influencers and hashtags you provide. It uses advanced natural language processing to identify intent signals—like people asking for recommendations, complaining about current solutions, or expressing a specific pain point your product solves."
    },
    {
      question: "Is using Signal Harvester safe for my Instagram account?",
      answer: "Yes. Signal Harvester uses read-only scraping methods that don't require your Instagram login credentials to scan for signals. When you're ready to reply, you do so through your own browser or mobile app, keeping your account behavior natural and within Instagram's safety guidelines."
    },
    {
      question: "How many influencers can I track?",
      answer: "Depending on your plan, you can track from 5 up to 50 influencers or hashtags simultaneously. Our AI scans the latest posts from these targets every hour to ensure you're the first to respond to new opportunities."
    },
    {
      question: "Can I use it for any niche?",
      answer: "Absolutely. Whether you're selling SaaS, coaching, agency services, or e-commerce products, Signal Harvester works by identifying the human intent behind comments. If your audience is talking on Instagram, we can find them."
    },
    {
      question: "Can Signal Harvester track competitor hashtags?",
      answer: "Yes, you can track any public hashtag, including those specifically used by your competitors. This allows you to identify users who are engaging with competitor content but might be looking for a better or alternative solution."
    },
    {
      question: "How quickly can I see results after setting up a tracker?",
      answer: "Our AI agent starts scanning as soon as you activate a tracker. Depending on the activity level of your target influencers or hashtags, you could see your first high-intent lead signals within minutes."
    },
    {
      question: "Can coaches and consultants use Signal Harvester to find clients?",
      answer: "Yes — this is one of our most popular use cases. Coaches and consultants monitor influencers and hashtags in their niche (e.g. business coaching, fitness, mindset). When someone comments 'I need help with X' or 'Does anyone recommend a good coach for Y?', Signal Harvester flags it as a high-intent lead instantly. You reply while their intent is hot, before any competitor does."
    },
    {
      question: "Is Signal Harvester useful for e-commerce and DTC brands?",
      answer: "Absolutely. DTC brands use Signal Harvester to monitor influencers and product hashtags relevant to their category. When buyers leave comments like 'where can I buy this?' or 'what brand is this?', the tool surfaces those signals immediately. You capture the sale before they search Google or find a competitor."
    },
    {
      question: "How do agencies manage multiple clients with Signal Harvester?",
      answer: "Signal Harvester supports multiple trackers under one workspace. Agencies assign dedicated trackers per client, giving each team member a prioritized lead queue sorted by purchase likelihood. This eliminates hours of manual comment scanning across accounts and lets your team focus on outreach rather than research."
    },
    {
      question: "Can I use Signal Harvester to find leads for a SaaS product or indie project?",
      answer: "Yes — and this is one of the fastest-growing use cases. SaaS founders and indie hackers use Signal Harvester to monitor influencers and hashtags in their niche, surfacing comments from people experiencing the exact problem their product solves. Instead of cold outreach, you respond to someone already expressing pain or asking for solutions. Conversion rates are dramatically higher because the intent is already there — you're not creating demand, you're showing up for it."
    },
    {
      question: "How is Signal Harvester different from social listening tools like Hootsuite or Brandwatch?",
      answer: "Traditional social listening tools are built for brand monitoring — tracking mentions, sentiment, and share-of-voice. Signal Harvester is built for lead generation. It goes beyond keyword detection to identify purchase intent: someone asking 'what product should I use for X?', complaining about a competitor, or tagging a friend with 'you need this.' The output isn't a dashboard of mentions — it's a ranked queue of people you should message right now, before the moment passes."
    },
    {
      question: "How long does it take to find my first lead after setting up Signal Harvester?",
      answer: "Most users see their first high-intent lead signal within 10 minutes of activating a tracker. There's no waiting period — the moment you add influencers or hashtags to track, the AI starts scanning in real time and surfaces buying-intent comments to your lead queue immediately. How quickly you see results depends on the activity level of the accounts you're tracking, but active influencers typically yield multiple signals within the first hour."
    },
    {
      question: "Does Signal Harvester work for TikTok comments as well as Instagram?",
      answer: "Yes. Signal Harvester monitors both Instagram and TikTok comment sections for buying intent signals. If your audience asks questions, shares frustrations, or looks for product recommendations in TikTok comment threads, Signal Harvester surfaces those leads the same way it does for Instagram. You can track a mix of Instagram and TikTok influencers and hashtags inside a single tracker, with all signals appearing in one prioritised lead queue."
    },
    {
      question: "Is there a free plan? Do I need a credit card to start?",
      answer: "Yes — Signal Harvester has a free plan and no credit card is required to get started. You can set up trackers, see your first buying-intent lead signals, and evaluate whether the tool fits your workflow before upgrading. The free plan is designed to give you enough to see real results — not a watered-down trial that only shows you a demo."
    },
    {
      question: "Can Signal Harvester help me find leads on LinkedIn?",
      answer: "LinkedIn support is on our roadmap. Currently Signal Harvester specialises in Instagram and TikTok comment monitoring, where buying-intent signals are highest-volume and fastest to convert. LinkedIn lead signals — like people asking for tool recommendations in posts or comments — will be available in an upcoming release. Add your email to the waitlist to get early access."
    },
    {
      question: "Can I use Signal Harvester to find leads on Reddit?",
      answer: "While Signal Harvester currently specializes in Instagram and TikTok, we are actively developing our Reddit monitoring module. Reddit is a goldmine for high-intent leads (people asking 'what is the best X?'), and our upcoming update will allow you to track keywords across specific subreddits just like you track hashtags on Instagram. Join our waitlist to get early access to the Reddit lead finder."
    },
    {
      question: "Can Signal Harvester help me craft the reply message once it finds a lead?",
      answer: "Yes. When you open a lead in your queue, Signal Harvester shows you the original comment, the post context, and the influencer's audience profile — so you have everything you need to write a personalised, non-spammy reply. Our Pro plan includes AI-assisted reply suggestions that match the tone of the original comment, helping you respond faster without sounding like a bot. You always review and edit before anything is sent — Signal Harvester surfaces the opportunity and helps you craft the message, but you're the one who sends it."
    },
    {
      question: "Can Signal Harvester help me find leads on LinkedIn?",
      answer: "LinkedIn support is on our roadmap. Currently Signal Harvester specialises in Instagram and TikTok comment monitoring, where buying-intent signals are highest-volume and fastest to convert. LinkedIn lead signals — like people asking for tool recommendations in posts or comments — will be available in an upcoming release. Add your email to the waitlist to get early access."
    },
    {
      question: "What types of buying intent signals does Signal Harvester detect?",
      answer: "Signal Harvester detects five core intent categories: (1) Recommendation requests — 'anyone know a good X?' or 'what do you all use for Y?'; (2) Pain expression — 'I'm so tired of X, nothing works'; (3) Competitor dissatisfaction — 'I used to use [Brand] but it keeps doing Z'; (4) Social proof seeking — 'has anyone actually tried this?'; (5) Direct purchase inquiry — 'where can I get this / how much does it cost?'. Each signal is scored 1–10 for purchase likelihood so you can prioritise the hottest leads first."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about harvesting high-intent leads from Instagram.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
          
          <div className="mt-12 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-emerald-900 font-bold mb-1">Still have questions?</h4>
              <p className="text-emerald-700 text-sm leading-relaxed">
                Contact our support team or check our documentation for more detailed guides on boosting your Instagram outreach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};