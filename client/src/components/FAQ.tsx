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