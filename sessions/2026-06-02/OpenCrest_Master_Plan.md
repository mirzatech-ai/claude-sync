# OpenCrest — Master Context & Build Plan

*Consolidated from the June 1, 2026 planning sessions (Mo + Gemini). Maya's output deliberately excluded — it added noise, timeouts, and no signal. This is the single document to "attack later."*

---

## 0. What this is

A clean, organized capture of the OpenCrest vision and architecture, plus an honest engineering read and a realistic build order. Use it as the master prompt for Claude / the Parliament. Everything Gemini proposed is preserved and organized; nothing real was thrown away. The parts that are hype, mock, or buggy are labeled as such so you don't build on sand.

**Note on track:** OpenCrest is a **Python** project. It is a *separate track* from the iamsuperio / Maya PHP 7.4 empire. The KOVAČ PHP rules do not apply here — Gemini's choice of Python is correct for this kind of agentic/automation engine.

---

## 1. The vision (plain version)

An event-driven, agentic automation engine that competes with Zapier and Make.com by being:

- **Event-driven, not polling** — sits silent at zero idle cost, fires the instant a webhook arrives.
- **Agentic, not dumb pipelines** — an Orchestrator breaks a task down, a Worker executes, a Validator checks before anything goes live.
- **Self-healing** — retries with backoff, never silently drops a task.
- **Stateful** — every step is persisted, so a crash resumes exactly where it left off.
- **Cheap** — routes trivial work to free/local processing and reserves expensive models for hard reasoning.

A second, *optional* layer that Gemini bolted on: an on-chain "asset swarm" on Polygon (ERC-1167 minimal-proxy clones, hardcoded 90/10 revenue split) for a real-estate / tax-lien use case. **Treat this as a separate product decision** (see §2).

---

## 2. Three things to decide before writing more code

These are strategic, not technical. They matter more than any pillar.

**A. One product or two?**
"Disrupt Zapier" = general workflow automation SaaS. "Polygon real-estate asset marketplace with 90/10 splits" = a fintech/proptech marketplace. Different customers, different go-to-market, different regulatory surface. The automation engine could be the *backend plumbing* for the asset swarm — but you cannot launch and sell both as "OpenCrest." **Recommendation: pick the real-estate/tax-lien vertical as the wedge, and build the automation engine as the thing that powers it.** That gives you a paying customer (you / investors using it) instead of competing with Zapier on its own turf.

**B. 260 days, $0 — the bottleneck is shipping, not architecture.**
You already have more architecture designed than most funded startups. The thing standing between you and your first dollar is **one workflow that does one valuable thing for one user, running reliably.** The plan below front-loads that and pushes everything else (multi-node failover, blockchain, dynamic tiering) to *after* there's a working product. This is on purpose.

**C. "Zero cost" is not real past the MVP.**
A Python `http.server` cannot "handle a million hits at zero cost" — it falls over. To actually receive webhooks from the outside world you need an always-on server with a public domain and TLS. Cheapest honest path: your existing Hostinger VPS, or a free-tier always-on host (Fly.io / Render free tiers, or a $4–5/mo VPS). Budget for **one small always-on box**. Everything else can stay genuinely cheap.

---

## 3. The architecture, organized (Gemini's full proposal, de-duplicated)

Gemini described ~12 components across several messages. Organized into tiers:

**Tier 1 — Core (the actual engine):**
- Stateful Orchestrator + `SwarmState` ledger (the router that passes the "hat")
- Zero-Cost Instant Event Listener (webhook gateway)
- Universal Payload Mapper (flattens any incoming JSON to clean fields)
- Self-Healing Request loop (retry with exponential backoff)
- Persistent Memory Ledger (SQLite, ACID, resume-on-crash)

**Tier 2 — Intelligence:**
- Three-Role Agentic Blueprint (Orchestrator → Worker → Validator adversarial loop)
- Dynamic Model Tiering ("Droid Whispering" — cheap models for trivial work, frontier models for hard work)

**Tier 3 — Resilience & scale:**
- Throttling-Aware Priority Queue
- Centralized Live Telemetry Stream
- HITL (Human-in-the-Loop) Escalation Gateway
- Time-Travel State Rollback & Replay
- Dead-Letter Queue (poison-payload isolation)
- Distributed State Syncing (multi-node failover)
- Secrets Vault (encrypted in-memory key handling)
- Plugin/Adapter architecture (drop-in integrations)

**Tier 4 — On-chain (optional product):**
- ERC-1167 Minimal Proxy Factory (Solidity, 90/10 split)
- Inbound Asset Payload Handler (Pydantic validation for scraped real-estate data)
- Polygon Deployment Runner (Web3.py)

**Tier 5 — UI:**
- "High-Density Sovereign Command Center" — 3-pane dark terminal dashboard (telemetry tree / live pipeline / log stream + HITL overlay).

---

## 4. Honest engineering read (what's real vs. what to fix or cut)

| Component | Reality | Action |
|---|---|---|
| Orchestrator + SwarmState | Real but trivial (a dispatch loop). Fine as a base. | **Keep**, it's the corrected `opencrest_core.py`. |
| Webhook listener | Concept right, code wrong: `HTTPServer` is single-threaded; crashes on missing Content-Length; not production-grade. | **Fixed** in core (ThreadingHTTPServer). For production move to FastAPI/uvicorn. |
| Payload Mapper | Real and useful. Minor cleanup. | **Keep** (in core). |
| Self-Healing retry | Real, correct pattern. | **Keep** (in core). |
| SQLite Ledger | Real for single machine. WAL helps concurrency on *one* box. | **Keep** for MVP. |
| Three-role agentic loop | Sound pattern, but the loop shown always sets `is_valid = True` — the Validator does nothing yet. | **Keep the shape, build a real Validator.** |
| Dynamic Model Tiering | **100% fake.** Costs and outputs are hardcoded strings. This is the actual core value and it does not exist yet. | **Build for real** — this is the highest-value engineering work. |
| GitHub Scout | "No token, totally free" is wrong — GitHub code search now requires auth and is heavily rate-limited. | Needs a free PAT + rate-limit handling. **De-prioritize**; not core to a Zapier-style product. |
| Priority Queue / Telemetry | Reasonable patterns; telemetry "savings vs Zapier" numbers are invented. | **Later.** Don't ship fake savings numbers. |
| HITL / Rollback / DLQ | Good ideas, toy implementations. | **Later** (after MVP earns its keep). |
| Distributed State Syncing | **Architecturally wrong as drawn.** SQLite + WAL does *not* give multi-machine failover. Real distribution needs Postgres or Redis. | **Cut from MVP.** Revisit only if you outgrow one box. |
| Secrets Vault | Generating a new Fernet key each boot means secrets don't survive restart — it's theater as written. | Use real secret storage (env on the VPS, or a managed secret store). **Simplify.** |
| ERC-1167 Factory | `Clones` lib is a legit pattern, BUT clones don't run constructors — `deploySwarmNode` produces **uninitialized** clones. Needs an `initialize()` pattern. `distributeRevenue` has reentrancy surface. | **Only if you commit to the on-chain product.** Get a real audit before mainnet. |
| Polygon Runner | Real bugs: `estimate_transaction` should be `estimate_gas`; `signed_tx.rawTransaction` → `raw_transaction` in recent web3.py; POA middleware import is version-sensitive; zero-key default is a footgun. | **Defer.** Verify against your installed web3.py version when you build it. |
| Pydantic asset handler | Mostly fine (v2 syntax). `datetime.utcnow()` is deprecated in 3.12+. | **Keep** if you do real-estate; small fixes. |
| 3-pane UI | Great vision. Pure design at this stage. | **Build after** there's data to show. |

**Bottom line:** the *real, keepable* engine is about 200 lines. The rest is either premature, simulated, or a different product.

---

## 5. The realistic build plan (MVP-first)

**Phase 0 — Decide (you, today/this week):**
Answer §2 A/B/C. Specifically: is OpenCrest a *real-estate automation tool* or a *general Zapier competitor*? Everything downstream depends on this.

**Phase 1 — The thing that runs (1 working week of focused build):**
Deploy `opencrest_core.py` (provided) on one always-on box with a public webhook URL. Wire ONE real trigger → ONE real action end-to-end. Example for the real-estate wedge: *new tax-lien listing scraped → normalize → validate → send you a formatted alert (email/SMS/Telegram).* No blockchain, no swarm, no UI. Just: webhook in, useful thing out, state persisted, never drops.

**Phase 2 — Make it agentic for real:**
Build the actual Dynamic Model Router (a free/local model for parsing+routing, a frontier model only for the hard step) and a real Validator that can reject and re-run. This is where OpenCrest becomes more than a script — and it's the part Gemini faked.

**Phase 3 — Resilience (only what's needed):**
Add the priority queue, DLQ, and HITL gateway *as you hit real failures*, not preemptively.

**Phase 4 — Integrations / adapters:**
The BaseAdapter pattern is good. Add integrations one real customer need at a time. This is the moat, built slowly.

**Phase 5 — On-chain (only if Phase 0 chose the asset product):**
Initialize-pattern clone factory, audited, testnet first.

**Phase 6 — The Command Center UI.**

---

## 6. Questions for the Parliament

Escalate these — they're where I'm genuinely uncertain or where a second/third frontier opinion changes the answer:

1. **Wedge:** Given a solo, broke, 260-day-in founder, is the real-estate/tax-lien automation vertical a better first market than a general Zapier competitor? What's the fastest path to *one paying user*?
2. **Tax-lien / asset tokenization legality:** What are the U.S. (and Georgia-specific) securities/regulatory implications of a 90/10 on-chain revenue split on tokenized real-estate-derived assets? This could be a dealbreaker — needs real legal grounding, not vibes. (Note: I'm not a lawyer; this is a flag, not advice.)
3. **Model router design:** What's the best cheap/local model for the Tier-1 parsing/routing layer in 2026, and what's the actual cost math vs. routing everything to one frontier model?
4. **Hosting:** Cheapest genuinely-reliable always-on webhook host for a solo founder — existing Hostinger VPS vs. a free-tier always-on service?
5. **Validator design:** How do you build a Validator that meaningfully rejects bad agent output without doubling your token cost on every task?

---

## 7. Decisions I need from you, Mo

- [ ] One product or two? (§2A)
- [ ] Which wedge / first use case for Phase 1?
- [ ] Do you want me to write the Phase 1 corrected, *deployable* version next (FastAPI, ready for your VPS), or keep iterating the plan first?
- [ ] On-chain in or out for v1?

---

## Appendix — cleaned session timeline (brief)

- Mo: frustrated Maya can't build / take large prompts; pivots to OpenCrest with Gemini.
- Gemini: framed OpenCrest as an agentic swarm to disrupt Zapier/Make; proposed GitHub-scouting to assemble from open-source parts.
- Gemini: Phase 1 router → Phase 2 GitHub scout → Phase 3 ERC-1167 factory.
- Mo: 260 days, no revenue, no budget, won't sacrifice quality but time matters.
- Gemini: chose Python (correct); drafted orchestrator, webhook engine, SQLite ledger, model tiering, 3-role loop, priority queue, telemetry, HITL, rollback, DLQ, vault, adapters, cluster syncing, Pydantic asset handler, Polygon runner, and a command-center UI spec.
- Mo (to Claude): strip Maya, consolidate everything, make a plan, build what's buildable, send the uncertain parts to the Parliament.

*Maya's contributions to the session: excluded (no usable signal).*
