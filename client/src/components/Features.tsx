import React from 'react';
import { Bot, MessageCircle, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: "AI Intent Detection",
    description: "Filters out emojis and generic spam. Only surfaces comments asking for help or showing true interest.",
    icon: <Bot className="w-8 h-8" />,
  },
  {
    title: "One-Click Reply",
    description: "Click reply and you're taken directly to Instagram, ready to respond. No copy-paste needed.",
    icon: <MessageCircle className="w-8 h-8" />,
  },
  {
    title: "Human Syntax",
    description: "Our LLM is trained on casual social media syntax. No robotic 'Dear Sir/Madam' responses.",
    icon: <ShieldCheck className="w-8 h-8" />,
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Turn social listening into a scalable sales channel.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 py-8 ${
                index !== features.length - 1 ? 'border-b border-slate-200' : ''
              }`}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex-shrink-0">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
