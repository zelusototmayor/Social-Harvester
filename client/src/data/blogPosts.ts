export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  keywords: string[];
  readTimeMinutes: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'icp-scoring-qualify-leads-before-cold-outreach',
    title: 'ICP Scoring: How to Pre-Qualify Leads Before You Send a Single Message',
    description:
      'Most cold outreach fails because teams skip qualification. ICP scoring — rating leads across pain, fit, access, and value before outreach — is the tactic that flips reply rates from 2% to 35%.',
    date: '2026-02-26',
    author: 'Signal Harvester',
    keywords: ['ICP scoring', 'lead qualification', 'cold outreach', 'B2B leads', 'signal-based selling'],
    readTimeMinutes: 8,
  },
  {
    slug: 'how-to-find-warm-leads-instagram-comments',
    title: 'How to Find Warm Leads in Instagram Comments Before Your Competitors Do',
    description:
      'Instagram comments are full of people who are ready to buy — if you know what to look for. Here\'s how to identify buying signals in comments and reach out before your competitors.',
    date: '2026-02-26',
    author: 'Signal Harvester',
    keywords: ['instagram lead generation', 'buying signals', 'warm leads', 'social selling'],
    readTimeMinutes: 10,
  },
  {
    slug: 'buying-signals-vs-intent-data',
    title: 'Buying Signals vs Intent Data: What\'s the Difference and Why It Matters',
    description:
      'Intent data tells you someone is interested. Buying signals tell you they\'re ready to act. Learn how to use both to close deals faster in 2026.',
    date: '2026-02-16',
    author: 'Signal Harvester',
    keywords: ['buying signals', 'intent data', 'sales intelligence', 'B2B sales'],
    readTimeMinutes: 5,
  },
  {
    slug: 'signal-harvester-vs-hootsuite-instagram-lead-generation',
    title: 'Signal Harvester vs Hootsuite: Which Is Better for Instagram Lead Generation?',
    description:
      'Signal Harvester and Hootsuite both touch Instagram — but they solve completely different problems. Here\'s which one to use if you want to generate leads from Instagram comments.',
    date: '2026-02-27',
    author: 'Signal Harvester',
    keywords: ['signal harvester vs hootsuite', 'instagram lead generation', 'hootsuite alternative', 'social selling'],
    readTimeMinutes: 9,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
