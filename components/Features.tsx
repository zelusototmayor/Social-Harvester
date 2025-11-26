import React, { useRef, useState } from 'react';
import { Bot, Layers, MessageCircle, Share, ShieldCheck, Zap } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "AI Intent Detection",
    description: "Filters out emojis and generic spam. Only surfaces comments asking for help or showing true interest.",
    icon: <Bot className="w-6 h-6" />
  },
  {
    title: "Engagement Modes",
    description: "Choose between Inbox Mode (approve first) or Full-Auto (for trusted campaigns).",
    icon: <Layers className="w-6 h-6" />
  },
  {
    title: "Comment or DM",
    description: "Reply directly in the thread for visibility, or slide into DMs for a private sales conversation.",
    icon: <MessageCircle className="w-6 h-6" />
  },
  {
    title: "Dual API Support",
    description: "Built natively for TikTok and Instagram. Launch with your existing accounts instantly.",
    icon: <Share className="w-6 h-6" />
  },
  {
    title: "Human Syntax",
    description: "Our LLM is trained on casual social media syntax. No robotic 'Dear Sir/Madam' responses.",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "Real-Time Tracking",
    description: "See exactly which comments convert into clicks and customers with built-in analytics.",
    icon: <Zap className="w-6 h-6" />
  }
];

// Spotlight Card Component
const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Icon with subtle background */}
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-emerald-600 ring-1 ring-slate-100 transition-transform duration-300 group-hover:scale-110">
        {feature.icon}
      </div>

      <h3 className="mb-3 text-lg font-bold tracking-tight text-slate-900">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50/50 border-t border-slate-200 relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Built for Growth</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to turn social listening into a scalable sales channel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};