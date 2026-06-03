# OpenCrest — Repo Verification (checked live on GitHub, 2026-06-02)

Each component Gemini named, verified against GitHub today. Verdict legend:
**✅ SOLID** (use it) · **⚠️ REAL BUT STALE/MISMATCHED** (use with caution) · **❌ DON'T USE** (wrong or fake).

Two things from your vault that override Gemini's plan before we even start:
- **Chain mismatch:** your token is **OSMO on Solana**. Gemini's entire on-chain layer is **Polygon / Solidity / ERC-1167**. Those are different worlds. Decide the chain before writing any contract.
- **Free-fuel moat:** you already own 150+ models across NIM/Groq/Gemini/Together/Fireworks at ~$0. So "dynamic cost routing" (RouteLLM) solves a problem you mostly don't have. You don't need to *save* on model cost — you need to *route by capability*, which is simpler.

---

## Part A — the repositories

**1. Orchestrator → `pydantic/pydantic-ai` — ✅ SOLID**
Real and thriving: ~16,000+ stars, latest release v1.85.1 (Apr 2026), commits within days. Gemini's "7.5k" was outdated by half. Critically, it natively supports Groq, Together AI, Fireworks AI, Hugging Face, Nebius — **your exact free providers** — and has built-in retries + type-safe validation. **Use this as the spine.** It alone covers the orchestrator AND much of the validator.

**2. Model routing → `lm-sys/RouteLLM` — ⚠️ REAL BUT STALE + MISMATCHED**
Real (~5k stars, Apache-2.0), right concept (up to 85% cost cut). But the core repo looks dormant since ~Aug 2024, and its trained routers are calibrated for a specific GPT-4/Mixtral pair — not your stack. Combined with your free-fuel moat, **you probably don't need it.** Use pydantic-ai's model-switching to route by *task difficulty* (free model for parsing, stronger free model for reasoning) instead of importing a stale cost-router.

**3. Validator → `jxnl/instructor` — ✅ SOLID (but maybe redundant)**
Real, widely-used standard for structured output + auto-retry on validation failure. Good. But pydantic-ai already gives you validation + retries, so **you likely don't need both.** Pick one. (instructor if you want lighter-weight; pydantic-ai if you want the full agent framework.)

**4. GitHub client → `PyGithub/PyGithub` — ✅ SOLID**
Real, standard, handles auth + rate-limit headers natively. Confirms my earlier flag: **code search requires a token** (a free Personal Access Token is enough). Note: the GitHub-scouting feature is a *nice-to-have*, not core to the real-estate product — de-prioritize.

**5. ERC-1167 factory → `OpenZeppelin/openzeppelin-contracts` (`Clones.sol`) — ✅ SOLID pattern, ⚠️ wrong chain**
The gold-standard library (~25k+ stars) and the `initialize()`-after-clone pattern Gemini wrote is **correct** — it fixes the uninitialized-clone bug. BUT this is Solidity/EVM. Your OSMO token is Solana. Only relevant if you spin up a separate Polygon product. Decide first.

**6. PaymentSplitter → ❌ DON'T USE as written**
`contracts/finance/PaymentSplitter.sol` was **removed from OpenZeppelin in v5.0.0** (late 2023). It is not in current OZ. Options: pin to OZ **v4.9.x**, use a community fork, or — simplest — **do the 90/10 split off-chain in your app**, which sidesteps this entirely.

**7. Webhook ingestion → `tiangolo/full-stack-fastapi-template` — ✅ SOLID**
Real, ~30k+ star standard. Good call — this replaces the broken stdlib `http.server` from the draft. Pair with a Pydantic ingestion model.

**8. Queue + DLQ → `rq/rq` (Redis Queue) — ✅ SOLID**
Real, standard, lightweight. Its `FailedJobRegistry` IS your dead-letter queue, no heavy Celery/RabbitMQ needed. Pairs perfectly with Gemini's (correct) "single-box Postgres + Redis" recommendation.

**9. Real-estate data → `greatdecipher/georgia_scraper` — ❌ NOT FOUND (hallucinated)**
No such repo exists. Real alternatives I verified:
- **`masond84/Florida-Foreclosure-Web-Scraper`** — a real wholesaler's daily county foreclosure-auction scraper. Closest to YOUR exact model (just Florida, adapt to GA).
- **`freelawproject/juriscraper`** — ✅ actively maintained, scrapes U.S. court sites + PACER. Robust.
- **`biglocalnews/court-scraper`** — ⚠️ real (Stanford, ISC license) but last release Dec 2022; county court case metadata via Odyssey/OSCN platforms.
- **`biglocalnews/civic-scraper`** — local-government agendas/minutes; useful for catching code-violation hearings.

**Reality on data:** county code-violation/lien data is wildly fragmented — there is no single turnkey feed. These are *starting frameworks*; you'll build per-county adapters. This is the real work of the product, and it's where the moat is.

---

## Part B — Gemini's engineering corrections: all SOUND ✅

- **web3.py fix** (`estimate_gas`, `signed_tx.raw_transaction`, `ExtraDataToPOAMiddleware`) — correct, modern syntax. (Only matters if you go EVM/Polygon — see chain note.)
- **SQLite → single-box Postgres + Redis** — correct. Stop trying to build distributed SQLite failover; one box on your Hostinger VPS is right for a solo founder.
- **Secrets: static key in `chmod 600 .env`** — correct, and it fixes the fatal "new Fernet key every boot" bug.

---

## Part C — Legal (Gemini's framing is reasonable, but this is the danger zone)

Gemini's read is directionally sound: a programmatic 90/10 split on tokenized real-estate assets likely **is a security** under Howey, and the **Series LLC + Reg D 506(c)** structure is a real, standard pattern. The attorney questions are good ones to bring.

**My caveats (I'm not a lawyer — this is a flag, not advice):**
- 506(c) = **accredited investors only**, with verification. That shrinks your buyer pool hard.
- Georgia + tokenized distressed assets is genuinely complex — **do not act on AI legal analysis alone.** This is the one area where you spend money on a real securities attorney before building anything on-chain.
- **The clean move:** ship the revenue product (Part D) that needs NO token and NO securities exposure first. Add the on-chain layer only after you have revenue and real legal cover.

---

## Part D — Fastest first dollar: Gemini nailed this one ✅

The **code-violation → skip-trace → wholesale-assignment** pipeline is the right Phase 1:
1. Scrape new severe code violations (vacancy, unsafe structure, trash liens).
2. Cross-reference tax assessor → find absentee/out-of-state owners (distress signal).
3. Use a free model (pydantic-ai + your NIM/Groq stack) to build the acquisition report.
4. Route the validated lead to local cash buyers as a **wholesale assignment** — you take an assignment fee.

Why this is the move: **zero capital, zero securities exposure, immediate revenue**, and it directly matches your vault's own verdict — *"$0 revenue, the gap is distribution, not infrastructure."* No token. No swarm. No blockchain. One county, one buyer, one assignment fee. That's the first dollar.

---

## Net: what to actually build with

**Stack:** pydantic-ai (spine + validation) → FastAPI (webhooks) → Postgres + Redis/rq (state + queue + DLQ) → your free-fuel models for the AI step → a Georgia code-violation/foreclosure scraper adapted from the real repos above.

**Drop entirely for v1:** RouteLLM (you own free models), the on-chain layer (wrong chain + legal risk), GitHub scouting (not core), distributed SQLite (premature).

**Verified bad/fake:** `greatdecipher/georgia_scraper` (doesn't exist) · `PaymentSplitter.sol` (removed from OZ v5).
