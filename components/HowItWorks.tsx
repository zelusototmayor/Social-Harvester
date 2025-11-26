import React from 'react';
import { Users, Search, MessageSquarePlus, ArrowRight } from 'lucide-react';

const StepCard: React.FC<{ icon: React.ReactNode; number: string; title: string; desc: string }> = ({ icon, number, title, desc }) => (
  <div className="relative p-8 bg-white border border-slate-200 rounded-3xl z-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200 group">
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-emerald-100">
      {icon}
    </div>
    
    <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10 select-none opacity-50 font-sans">
      {number}
    </div>

    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">How It Works</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Stop scrolling for hours. Let our AI agent do the prospecting while you sleep.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-slate-200 z-0"></div>

          <StepCard 
            number="1"
            icon={<Users className="w-7 h-7" />}
            title="Pick Your Niche"
            desc="Enter the usernames of influencers your ideal customers follow. We'll monitor their latest posts 24/7."
          />
          <StepCard 
            number="2"
            icon={<Search className="w-7 h-7" />}
            title="AI Scans for Intent"
            desc="Our agent reads thousands of comments to find questions, complaints, or buying signals relevant to your product."
          />
          <StepCard 
            number="3"
            icon={<MessageSquarePlus className="w-7 h-7" />}
            title="Review & Reply"
            desc="Get a feed of ready-to-send replies. Approve them with one click to send a DM or reply publicly."
          />
        </div>
      </div>
    </section>
  );
};