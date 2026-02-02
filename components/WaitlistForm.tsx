import React, { useState } from 'react';

export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Track with Mixpanel if available
    if (window.mixpanel) {
      window.mixpanel.track('Waitlist Signup', {
        email,
        platform,
      });
    }
    
    // Simulate API call - replace with actual endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div id="waitlist" className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-8">
            <svg className="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-gray-300">We'll notify you as soon as Signal Harvester is ready.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="waitlist" className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Join the Waitlist
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Be the first to know when Signal Harvester launches. Get early access and exclusive pricing.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full sm:w-80 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="tiktok" className="bg-gray-900">TikTok</option>
            <option value="instagram" className="bg-gray-900">Instagram</option>
            <option value="twitter" className="bg-gray-900">Twitter/X</option>
            <option value="reddit" className="bg-gray-900">Reddit</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              'Get Early Access'
            )}
          </button>
        </form>
        
        <p className="text-gray-400 text-sm mt-4">
          🔒 No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};
