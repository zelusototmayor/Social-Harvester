import React from 'react';
import { Target, ArrowRight, TrendingUp, DollarSign, X } from 'lucide-react';

export const CompetitorAd: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-sm font-bold mb-6">
              <Target className="w-4 h-4" />
              Strategy Spotlight
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Grow by solving your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">competitors' failures</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Don't just wait for customers to find you. Monitor your competitors' social pages. When their users complain about bugs, pricing, or bad support, <strong>Signal Harvester</strong> alerts you instantly so you can offer a better alternative.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900">Track Negative Sentiment</h4>
                    <p className="text-sm text-slate-500 mt-1">Filter specifically for words like "expensive", "broken", "annoying", or "switch".</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900">Win High-Intent Leads</h4>
                    <p className="text-sm text-slate-500 mt-1">These users are already paying for a solution—they just want a better one. Yours.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="lg:w-1/2 w-full">
            <div className="relative mx-auto max-w-md">
                {/* Background Card (Competitor Post) */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 opacity-60 scale-95 origin-bottom translate-y-4 relative z-0">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                      <div className="w-32 h-3 bg-slate-200 rounded"></div>
                   </div>
                   <div className="space-y-2">
                      <div className="w-full h-32 bg-slate-100 rounded-lg"></div>
                      <div className="w-3/4 h-3 bg-slate-200 rounded"></div>
                   </div>
                </div>

                {/* Main Card (The Interaction) */}
                <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-0 overflow-hidden relative z-10">
                    {/* Header: Competitor Post Context */}
                    <div className="bg-slate-50 p-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
                            Monitoring: @BigCompetitorCo
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">BC</div>
                            <div>
                                <p className="text-sm text-slate-900 font-medium">We're updating our pricing tiers next month! 🚀</p>
                                <p className="text-xs text-slate-500 mt-1">Posted 2h ago</p>
                            </div>
                        </div>
                    </div>

                    {/* The Complaint */}
                    <div className="p-6 bg-red-50/30">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-300">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AngryUser" alt="User" className="w-full h-full rounded-full" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700 mb-1">angry_customer_99</p>
                                <p className="text-sm text-slate-800">
                                    Seriously? Another price hike? 😤 I'm already paying $50/mo for a tool that crashes half the time. Might be time to switch.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Solution (Overlay) */}
                    <div className="p-4 bg-emerald-50/50 border-t border-emerald-100">
                        <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-2">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">OPPORTUNITY DETECTED</span>
                             </div>
                             <span className="text-xs text-emerald-600 font-bold cursor-pointer hover:underline">Edit Reply</span>
                        </div>
                        
                        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm relative">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                <span className="text-emerald-600 font-medium">@angry_customer_99</span> Hate to hear that! If you're looking for stability, we haven't raised prices in 2 years and have 99.9% uptime. 🚀 Check our migration deal!
                            </p>
                            <button className="absolute -bottom-3 -right-3 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition-colors group">
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Connecting Line */}
                <div className="absolute top-1/2 -left-12 hidden lg:flex flex-col items-center gap-2">
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gradient-to-b from-slate-300 to-emerald-400"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};