import React, { useState } from 'react';
import { Check, Mail, Instagram } from 'lucide-react';
import mixpanel from 'mixpanel-browser';
import { Platform } from '../types';

export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.Instagram);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, platform }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      // Track successful waitlist signup
      mixpanel.track('Waitlist Signup', {
        platform: platform,
        email_domain: email.split('@')[1],
      });
      mixpanel.identify(email);
      mixpanel.people.set({
        $email: email,
        platform_preference: platform,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      mixpanel.track('Waitlist Signup Failed', { platform });
      alert('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="py-24 relative overflow-hidden bg-brand-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-emerald-900/20 -z-10" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-800/50 bg-emerald-900/40">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-4">Be First to Get Access</h2>
            <p className="text-emerald-100/80 text-lg">
              We're rolling out access in batches. Tell us where you want to deploy your agent first.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Platform Selection */}
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${platform === Platform.Instagram ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-emerald-950/50 border-emerald-800 hover:border-emerald-600'}`}>
                  <input 
                    type="radio" 
                    name="platform" 
                    value={Platform.Instagram} 
                    checked={platform === Platform.Instagram}
                    onChange={() => setPlatform(Platform.Instagram)}
                    className="hidden" 
                  />
                  <Instagram className={`w-8 h-8 ${platform === Platform.Instagram ? 'text-white' : 'text-emerald-400'}`} />
                  <span className={`font-semibold ${platform === Platform.Instagram ? 'text-white' : 'text-emerald-400'}`}>Instagram</span>
                  {platform === Platform.Instagram && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />}
                </label>

                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${platform === Platform.TikTok ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-emerald-950/50 border-emerald-800 hover:border-emerald-600'}`}>
                  <input 
                    type="radio" 
                    name="platform" 
                    value={Platform.TikTok} 
                    checked={platform === Platform.TikTok}
                    onChange={() => setPlatform(Platform.TikTok)}
                    className="hidden" 
                  />
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${platform === Platform.TikTok ? 'text-white' : 'text-emerald-400'}`}>♪</span>
                  </div>
                  <span className={`font-semibold ${platform === Platform.TikTok ? 'text-white' : 'text-emerald-400'}`}>TikTok</span>
                  {platform === Platform.TikTok && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />}
                </label>
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-300" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="enter@your.email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-emerald-950/50 border border-emerald-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-4 rounded-xl text-lg shadow-lg shadow-emerald-900/20 transform hover:scale-[1.02] transition-all"
              >
                Join the Waitlist
              </button>
            </form>
          ) : (
            <div className="text-center py-12 animate-float">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-emerald-200">We'll notify {email} as soon as we open spot for {platform}.</p>
              <button onClick={() => setSubmitted(false)} className="mt-8 text-emerald-400 hover:text-white underline">
                Add another email
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};