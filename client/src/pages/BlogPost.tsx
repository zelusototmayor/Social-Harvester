import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogPost, blogPosts } from '../data/blogPosts';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Dynamically import markdown files by slug
async function loadMarkdown(slug: string): Promise<string> {
  const modules: Record<string, () => Promise<any>> = {
    'icp-scoring-qualify-leads-before-cold-outreach': () =>
      import('../../../blog/2026-02-26-icp-scoring-qualify-leads-before-cold-outreach.md?raw'),
    'how-to-find-warm-leads-instagram-comments': () =>
      import('../../../blog/2026-02-26-how-to-find-warm-leads-instagram-comments.md?raw'),
    'buying-signals-vs-intent-data': () =>
      import('../../../blog/2026-02-16-buying-signals-vs-intent-data.md?raw'),
  };

  const loader = modules[slug];
  if (!loader) throw new Error('Post not found');
  const mod = await loader();
  const raw: string = mod.default ?? mod;
  // Strip YAML frontmatter
  return raw.replace(/^---[\s\S]*?---\n/, '').trim();
}

// Custom components for ReactMarkdown to apply styles
const mdComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 mt-10 mb-4 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-3 leading-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold text-slate-800 mt-8 mb-2 leading-tight">{children}</h3>,
  p: ({ children }) => <p className="text-slate-600 leading-relaxed mb-5">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-5 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-5 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="text-slate-600 leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-emerald-400 pl-4 py-1 my-5 text-slate-500 italic bg-emerald-50 rounded-r-md">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border border-slate-200 rounded-lg text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="text-left px-4 py-3 text-slate-700 font-semibold text-xs uppercase tracking-wide">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3 text-slate-600">{children}</td>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <pre className="bg-slate-900 text-emerald-300 rounded-lg p-4 overflow-x-auto mb-5 text-sm leading-relaxed">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const post = slug ? getBlogPost(slug) : undefined;

  useEffect(() => {
    if (!slug) return;
    setContent(null);
    setError(false);
    loadMarkdown(slug)
      .then(setContent)
      .catch(() => setError(true));
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;
  if (error) return <Navigate to="/blog" replace />;

  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((p) => p.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

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
            <Link to="/blog" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm">
              Blog
            </Link>
            <Link to="/pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm">
              Pricing
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
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-600 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All posts
          </Link>

          {/* Post header */}
          <header className="mb-10">
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTimeMinutes} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>
            <p className="text-lg text-slate-500 leading-relaxed border-b border-slate-100 pb-8">{post.description}</p>
          </header>

          {/* Post content */}
          {content === null ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : (
            <div>
              <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
            </div>
          )}

          {/* Pagination */}
          {(prev || next) && (
            <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-6">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className="group">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </p>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors leading-snug">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link to={`/blog/${next.slug}`} className="group text-right">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1 justify-end">
                    Next <ArrowRight className="w-3 h-3" />
                  </p>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors leading-snug">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-emerald-50 border-t border-emerald-100 py-16">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Find leads already signaling they need you</h2>
          <p className="text-slate-600 mb-6">
            Signal Harvester monitors Reddit, Instagram, LinkedIn, and X for real-time buying signals — surfacing
            warm prospects so your outreach lands at exactly the right moment.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start free trial <ArrowRight className="w-4 h-4" />
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
