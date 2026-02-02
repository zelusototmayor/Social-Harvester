import React from 'react';
import { Users, Search, MessageSquarePlus, ArrowRight } from 'lucide-react';

const StepCard: React.FC<{ icon: React.ReactNode; number: string; title: string; desc: string }> = ({ icon, number, title, desc }) => (
  <div className="relative p-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl z-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 hover:bg-white group">
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-emerald-100">
      {icon}
    </div>

    <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10 select-none opacity-50 font-sans group-hover:text-emerald-100 transition-colors duration-500">
      {number}
    </div>

    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors duration-300">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-gradient-to-br from-slate-50/50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_50%,#000_20%,transparent_100%)] opacity-[0.03] pointer-events-none animate-grid-flow"></div>

      {/* Moving gradients */}
      <div className="absolute top-1/4 -right-1/4 w-[700px] h-[700px] bg-emerald-400/8 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-lime-500/6 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[90px] pointer-events-none animate-float" style={{ animationDelay: '4s' }}></div>
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