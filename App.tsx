import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { ExamplesCarousel } from './components/ExamplesCarousel';
import { CompetitorAd } from './components/CompetitorAd';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { WaitlistForm } from './components/WaitlistForm';

// Declare Mixpanel on window
declare global {
  interface Window {
    mixpanel: any;
  }
}

// Logo component using the uploaded image
const SignalHarvesterLogo = ({ className }: { className?: string }) => (
  <img src="/logo.png" alt="Signal Harvester Logo" className={className} />
);

const App: React.FC = () => {
  // Track page view when app loads
  useEffect(() => {
    if (window.mixpanel) {
      window.mixpanel.track_pageview();
    }
  }, []);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
               <SignalHarvesterLogo className="w-full h-full" />
            </div>
            Signal Harvester
          </div>
          <button 
            onClick={scrollToWaitlist}
            className="hidden md:block bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-slate-200"
          >
            Get Early Access
          </button>
        </div>
      </nav>

      <main>
        <Hero onJoinClick={scrollToWaitlist} />
        <ExamplesCarousel />
        <CompetitorAd />
        <HowItWorks />
        <Features />
        <WaitlistForm />
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <div className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden">
               <SignalHarvesterLogo className="w-full h-full" />
             </div>
             © 2026 Signal Harvester. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;