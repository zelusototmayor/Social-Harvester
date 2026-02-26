import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ChevronLeft } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <img src="/logo.png" alt="Signal Harvester" className="w-full h-full" />
            </div>
            Signal Harvester
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm">
              Pricing
            </Link>
            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-3">Blog</p>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Sales Intelligence & Lead Generation</h1>
            <p className="text-lg text-slate-500">
              Tactics, frameworks, and real data on signal-based selling, ICP scoring, and turning social intent into
              pipeline.
            </p>
          </div>

          {/* Post list */}
          <div className="divide-y divide-slate-100">
            {sorted.map((post) => (
              <article key={post.slug} className="py-8 group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.description}</p>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    Read article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* CTA Banner */}
      <section className="bg-emerald-50 border-t border-emerald-100 py-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to find leads who are already looking?</h2>
          <p className="text-slate-600 mb-6">
            Signal Harvester monitors social platforms 24/7 and surfaces the highest-intent prospects — so your
            outreach lands on people already signaling they need what you sell.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <span>© 2026 Signal Harvester. All rights reserved.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
