import React from 'react';
import { Users, MessageCircle, TrendingUp, Zap } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    icon: <Users className="w-5 h-5 text-emerald-500" />,
    value: "500+",
    label: "Brands using Signal Harvester",
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-emerald-500" />,
    value: "2M+",
    label: "Instagram comments scanned",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    value: "3–5×",
    label: "Faster lead response time",
  },
  {
    icon: <Zap className="w-5 h-5 text-emerald-500" />,
    value: "~40%",
    label: "More leads per post on average",
  },
];

export const TrustBar: React.FC = () => {
  // Schema.org SiteNavigationElement / Dataset-style structured data for stats
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Signal Harvester Key Stats",
    "description": "Usage statistics for Signal Harvester, an Instagram lead generation tool.",
    "itemListElement": stats.map((stat, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": stat.label,
      "description": stat.value,
    })),
  };

  return (
    <section
      aria-label="Signal Harvester social proof stats"
      className="bg-slate-50 border-y border-slate-100 py-8"
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 font-medium leading-tight max-w-[120px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
