import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const WaitlistForm: React.FC = () => {
  return (
    <section id="waitlist" className="py-24 relative overflow-hidden bg-brand-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-emerald-900/20 -z-10" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-800/50 bg-emerald-900/40 text-center">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Next Customers?</h2>
            <p className="text-emerald-100/80 text-lg max-w-xl mx-auto">
              Start discovering high-intent leads on Instagram today.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-emerald-900/20 transform hover:scale-[1.02] transition-all"
          >
            Start Now for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
