import { Sparkles } from 'lucide-react';

export default function OfferBanner() {
  return (
    <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-xl bg-white/40 border border-emerald-200/60 shadow-lg shadow-emerald-500/10 animate-fade-in-up hover:shadow-emerald-500/20 transition-all duration-300">
      <div className="relative">
        <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse-slow" />
      </div>
      <p className="text-sm md:text-base font-bold text-emerald-700 tracking-tight">
        Start free — no credit card required
      </p>
    </div>
  );
}
