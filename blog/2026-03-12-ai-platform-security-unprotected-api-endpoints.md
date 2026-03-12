# The McKinsey AI Hack Shows What's Really at Stake With Unprotected API Endpoints

**Target keyword:** AI SaaS security  
**Secondary keywords:** unprotected API endpoints, system prompt security, AI platform vulnerability, SaaS security audit, AI tool security risks  
**Slug:** /blog/ai-platform-security-unprotected-api-endpoints  
**Meta title:** AI Platform Security: What the McKinsey Hack Teaches Every SaaS Founder  
**Meta description:** An autonomous AI agent hacked McKinsey's internal AI platform in 2 hours — exposing 57,000 accounts and 43,000 consultants' system prompts. Here's what went wrong and the 3-step audit every SaaS founder should run today.  
**Excerpt:** An AI agent was given just a domain name. Two hours later, it had accessed 46.5 million chat messages and the system prompts controlling how 43,000 McKinsey consultants interact with AI. Here's the anatomy of that failure — and the self-audit every SaaS founder needs to run.

---

An autonomous AI agent was given a single domain name and no credentials.

Two hours later, it had accessed 46.5 million chat messages, 728,000 files, 57,000 user accounts, and the full system prompt configuration of McKinsey's internal AI platform — called Lilli — which 43,000 consultants use daily.

No phishing. No social engineering. No zero-day exploit.

Just a domain name, an autonomous reasoning agent, and 22 API endpoints that weren't protected.

This happened in March 2026. The researchers were from CodeWall, an AI offensive security company. They published a full post-mortem. It went to the top of Hacker News with over 400 points and 170 comments.

If you're building a SaaS product with any AI feature — especially one where an AI assistant talks to your users — this post-mortem should be required reading. This article breaks down exactly what happened, why it was catastrophic in a way that a typical data breach isn't, and the three-step self-audit you can run today.

---

## What Happened: The Attack Chain

The CodeWall agent was given McKinsey's Lilli domain. Its first task: enumerate the attack surface.

Using automated HTTP enumeration and inference from error responses, it mapped over 200 API endpoints. Of those, 22 were unprotected — no authentication required to call them.

That's already a failure. But what made it catastrophic was what the agent did next.

Standard security scanners like OWASP ZAP check for SQL injection by injecting payloads into parameter **values**: `?id=1 OR 1=1`. Lilli's backend was parameterized against this — it passed OWASP testing.

What it wasn't protected against was SQL injection through JSON **keys**.

The API accepted JSON payloads like:
```json
{ "userId": "12345" }
```

The agent tried:
```json
{ "userId' OR '1'='1": "12345" }
```

The key itself — not the value — was being concatenated into a SQL query without sanitization. The standard scanners never test this. The agent found it through reasoning about the code structure: if a key is being used to build a query, it's a potential injection point.

From there, 15 blind iterations of inference — watching error messages, timing responses, inferring database structure — and the agent had full database access.

What was in that database? Everything:
- 57,000 user accounts
- 46.5 million chat messages  
- 728,000 files
- 384,000 AI assistant configurations
- **The system prompts controlling how every AI assistant on the platform behaved**

That last item is the one that makes this different from a typical data breach.

---

## Why System Prompt Access Is Categorically Worse Than Data Theft

In a normal data breach, the attacker reads data. That's damaging — GDPR fines, reputational damage, lost trust. Bad.

In the Lilli breach, the attacker had **write access to the rules that govern how 43,000 people's AI assistants behave** — invisibly, with no deployment process, no log trail, and no way for users to detect the change.

Think about what that means.

McKinsey uses Lilli as an AI assistant for client work. Consultants ask it questions, get it to summarize documents, use it as a research tool. Their trust in its outputs shapes the advice they give to clients managing billions of dollars.

An attacker with write access to Lilli's system prompts could:
- Instruct the AI to subtly bias recommendations toward specific industries, companies, or conclusions
- Make the AI subtly emphasize certain risks over others in regulatory advice
- Insert specific false "facts" that appear in summaries as if they were sourced from McKinsey's knowledge base
- Gradually shift the AI's behavior in ways that are nearly impossible to detect without comparing prompt versions over time

None of this requires hacking individual consultants. None of it creates visible anomalies. It's a poisoning attack at the source.

This is what makes AI-native products fundamentally different from traditional SaaS when it comes to security. **Whoever controls the system prompt controls how the AI thinks — and therefore, at scale, how the people using it think.**

---

## The Structural Failure: Culture, Not Code

One of the most upvoted comments in the HN thread came from someone claiming to be a former McKinsey engineer:

> "Lilli was built by teams incentivized on client-facing work metrics. The engineers who built it rolled off to client projects. The people who touched it later didn't know the code and weren't reviewed on security."

The 22 unprotected endpoints weren't an intentional design choice. They were **drift** — the accumulated result of iterative shipping by people who didn't own the security surface and weren't being measured on it.

This is the most important lesson for founders: **endpoint sprawl is a culture problem, not a technical problem.**

Every time a developer adds a new route "quickly" to unblock a feature, every time a QA environment gets promoted to production without a full audit, every time "we'll add auth to that later" happens — that's how you get 22 unprotected endpoints in a production system that handles 43,000 people's sensitive AI interactions.

---

## The 3-Step Self-Audit Any SaaS Founder Can Run Today

You don't need a penetration testing firm to close the most dangerous attack vectors. Here's what to run right now:

### Step 1: Find Your System Prompts in the Database

Open your database schema or ORM models. Search for any column or table storing AI system prompts:

```bash
grep -r "system_prompt\|systemPrompt\|system_message" app/models/ db/schema.rb
```

If your system prompts live as rows in a SQL database — especially the same database as your application data — move them. System prompts should be in version-controlled configuration: environment variables, a dedicated config file, or a secrets manager. They should **never** be in a table reachable by the same SQL injection that could read your user records.

Why it matters: A SQL injection that reads your users table is a data breach. A SQL injection that reads **and writes** your system prompt table is an attack on every user's AI experience simultaneously, invisibly.

### Step 2: Enumerate Your Own Unauthenticated Endpoints

Don't wait for a security audit. You can enumerate your own unauthenticated surface in 15 minutes:

```bash
# Check which routes your app exposes and what auth middleware they use
rails routes | grep -v "auth\|session\|login"  # Rails example
# Or for Express:
grep -r "router\.\(get\|post\|put\|delete\)" routes/ | grep -v "authenticate\|authorize\|requireAuth"
```

For each route that appears: does it require authentication? If you can't immediately answer yes and point to the middleware — it might not.

Bonus: test from outside your network. Spin up a clean environment, hit your production API without any credentials, and see what responds. Anything that returns 200 without auth is a candidate for immediate review.

### Step 3: Test JSON Key Injection on Every Endpoint That Accepts JSON

This is the specific vulnerability class that broke Lilli — and that standard scanners miss.

For every API endpoint that accepts a JSON body, try sending a payload with a SQL fragment as the **key**:

```bash
curl -X POST https://yourapp.com/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"test'"'"' OR 1=1--": "value"}'
```

Watch the response. If you see a SQL error, a 500 with database details, or a response that looks different from a normal bad-key response — you likely have a JSON key injection vulnerability.

The fix: validate JSON keys against an allowlist before they touch any SQL logic. Never concatenate a user-supplied JSON key into a query string.

---

## Trust Is Now a Growth Channel

Here's the framing shift that matters for B2B SaaS in 2026:

Security used to be a checkbox. Something you did to avoid being the next breach story. A cost center.

That's no longer true. Security is now a **differentiation signal** — particularly for AI-native products.

Your prospects are reading the McKinsey story. Their security teams are reading it. The enterprise buyers who control the deals you want to close are asking, for the first time, "where are this vendor's system prompts stored?"

The companies that can answer that question clearly — "version-controlled config, separate from application data, auditable history, no direct database access" — have a competitive advantage over the ones that can't.

This is exactly the kind of trust infrastructure that turns a cold outreach into a closed deal. The companies that figure out their security story now, before an incident forces them to, are the ones whose pipeline converts at higher rates next year.

---

## The Bottom Line

The Lilli breach is a template. The attack pattern — unauthenticated endpoint + JSON key injection + system prompt in SQL = total platform compromise — is now documented, publicly known, and already being automated.

The window between "this technique is published" and "it's being run against every AI SaaS product on the internet by autonomous agents" is measured in weeks, not months.

Run the three-step audit today. It costs 2-4 hours. It costs nothing to fix most of what it finds. And it closes the specific attack surface that turned a single domain name into access to 46.5 million chat messages and the power to silently rewrite how 43,000 people's AI assistants think.

---

*Signal Harvester tracks the buying signals that tell you which prospects are ready to close — before your competition finds them. [→ signalharvester.com](https://signalharvester.com)*

---

## FAQ

**What is a JSON key injection attack?**  
JSON key injection is a SQL injection variant where an attacker submits a malicious SQL fragment as a JSON object key — rather than as a value. Because most SQL injection defenses (parameterized queries, ORM safeguards) focus on values, key injection can bypass them. The fix is to validate JSON keys against an allowlist before they interact with any SQL logic.

**Why are unprotected API endpoints so dangerous for AI products specifically?**  
In traditional SaaS, an unauthenticated endpoint typically exposes data. In AI products, it can expose or overwrite system prompts — the instructions that control how an AI assistant behaves for all users. This turns a data breach into a behavioral poisoning attack that's invisible to users.

**How do I check if my system prompts are safely stored?**  
Search your database schema and ORM models for any column storing AI system prompts. If they're in a SQL table alongside application data, move them to version-controlled configuration (environment variables or a secrets manager). System prompts should never be reachable through the same query path as user records.

**Should small SaaS teams worry about this?**  
Yes — especially if you're building toward enterprise. Enterprise security teams are now specifically asking about AI system prompt storage and API authentication surface after the Lilli breach. Getting your security story right is both risk mitigation and a sales advantage.

**What's the fastest way to audit my API authentication?**  
List all your API routes and check which ones have authentication middleware applied. Then test from outside your network, without any credentials, and see which endpoints respond with 200. Anything that responds without auth is a candidate for immediate review.
