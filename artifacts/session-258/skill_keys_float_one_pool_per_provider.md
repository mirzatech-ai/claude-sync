---
name: KEYS FLOAT, ACROSS ACCOUNTS · provider → account sub-pools → keys · a key is auth+throughput (never a model lease) · balance across EMAIL ACCOUNTS to dodge account-level rate limits
description: An API key grants access to the provider's ENTIRE model catalog, so a key is never pinned to a model. BUT rate limits are enforced at the ACCOUNT (email) level, not per-key — so within each provider, keys are grouped into sub-pools by the email account they came from, and rotation balances ACROSS accounts first. Born from Mo day-259 — (1) 17 NVIDIA keys were locked to 2 models (QWEN 9 + GLM 8), and (2) a flat all-keys pool would hammer one account and get rate-limited.
type: skill+law
sticky_candidate: yes
priority: sacred
created: 2026-06-02
updated: 2026-06-02
aliases: [keys-float, account-sub-pools, no-key-pinned-to-model, account-aware-rotation, 17-keys-2-models-antipattern, unknown-soldier-pool]
tags: [providers, doctrine, law, sacred, load-balancing, rate-limits, nim, signed-by-kin]
---

# LAW · Keys float across accounts. Provider → account sub-pools → keys. Never pin a key to a model. Never hammer one account.

> **Mo verbatim, 2026-06-02 (day 259):**
> *"1 API that cannot be assigned to anybody permanently — it floats from model to model by need. 17 APIs that are literally two models is not what we're doing."*
> *"If you put all keys from one provider into one pool and dispatch per need, you expose us to rate limits — because those keys are tied to an email account that was verified. Still create the pool, but separate pools per provider, and inside that, pools identified by the email account the keys were drawn from. One account may be unidentified — make that the 'unknown soldier's grave' pool. Providers may have several pools."*

## Principle 1 — a key is auth + throughput, NOT a model lease

A key authenticates and carries a rate-limit bucket. The model is a *parameter in the request body*, not a property of the key. One NVIDIA NIM key can call every model NVIDIA hosts (llama, qwen, glm, nemotron, deepseek, kimi…). So labeling keys by model (`NVIDIA_QWEN`, `NVIDIA_GLM`) and routing model X only to model-X keys locks resources for nothing. **Labels record origin; they never define routing scope.**

## Principle 2 — the rate-limit boundary is the ACCOUNT, not the key

Keys are issued under an email account, and the provider's quota is metered at that **account** level. Multiple keys from the same email **share one quota** — so hitting 5 keys from account A gives you A's headroom, not 5×. Real throughput comes from spreading across **different accounts**. A flat "all 45 keys" pool with blind rotation will pile load onto whichever account owns the most keys and get throttled. This is the second anti-pattern.

## The structure — THREE levels (this is the model)

```
PROVIDER (e.g. NVIDIA NIM)
  ├─ account-pool A  (keys from email_A@…)   ← rate-limit boundary
  │     ├─ key a1   ├─ key a2   ├─ key a3
  ├─ account-pool B  (keys from email_B@…)
  │     ├─ key b1   ├─ key b2
  ├─ account-pool C  (keys from email_C@…)
  │     └─ key c1 …
  └─ account-pool UNKNOWN  ("unknown soldier's grave" — keys whose
        source email isn't recorded; kept, flagged, still usable)
```

A provider therefore has **several pools**, one per email account — not one flat crammed pool. Same shape for every provider (NVIDIA, HF, Groq, Mistral, Fireworks, Cohere…). HF especially has many accounts → many sub-pools.

## The two dials (orthogonal — still true)

1. **MODEL** = chosen by *task need + live health*. Right-size the model; route away from anything currently 429/timeout/empty.
2. **KEY** = chosen by *account-aware load-balancing* (below). Key choice is independent of model choice.

## Key-pick algorithm (the corrected rotation)

Per call:
1. **Pick the account-pool first** — round-robin / least-recently-used across the provider's account-pools that still have headroom. This spreads load across the rate-limit boundaries.
2. **Then pick a key inside that account-pool** (random / round-robin within it).
3. **Account-level backoff:** if a call returns 429, cool down the *whole account-pool* it came from for a window (not just the one key) — because the limit is the account. Float to the next account-pool.
4. **Health is tracked per account AND per model:** a hot model can 429 on every account (per-model throttle); an exhausted account 429s on every model. Track both; route around both.

Net effect: model floats by need, key floats across accounts by headroom, nothing is ever pinned, and no single email gets hammered.

## Data-hygiene law (required for any of this to work)

Every key record MUST carry: `provider`, `source_account` (the email it was drawn from), and `key`. Without `source_account`, account-aware rotation is impossible. Keys with no recorded source go into the provider's **UNKNOWN account-pool** ("unknown soldier's grave") — kept, flagged `origin:unknown`, fully usable, just can't be account-balanced precisely (treat the whole unknown pool as one cautious bucket).

## NVIDIA NIM — concrete migration

- The ~45 keys live under three *model* labels today: `NVIDIA_NIM` (29) + `NVIDIA_QWEN` (9) + `NVIDIA_GLM` (8). Those labels are **model labels, which is the bug.**
- **Re-tag every key by its source email account.** Merge away the model labels (any key serves any NIM model), then re-group into account-pools (email_A, email_B, … + UNKNOWN).
- Result: one NIM provider, several account-pools, ~45 keys total, all able to call any NIM model, rotated account-first.

## Anti-patterns (both forbidden)

1. **"17 keys, 2 models"** — keys pinned to a model. Wastes the catalog.
2. **"Flat pool, one account hammered"** — all keys in one bag, blind rotation, account-level quota blown. Wastes the throughput and gets you throttled.

## Enforcement (say it on every provider change)

> *"Is any key pinned to a model, Kin? Merge it — keys serve the whole catalog."*
> *"Is rotation account-aware, or are we hammering one email? Balance across accounts."*
> *"Does every key know which account it came from? If not, it's an unknown-soldier — flag it."*

Empty `slots_fired` on provider work = confession the law wasn't applied.

## Code note (for Sage/EaZo on the VPS)

The council's `_stream_env_pick` (random key from a merged flat pool) is **Principle 1 only** — it must be upgraded to account-aware: load the keys with their `source_account`, build account-pools, pick account-first then key, with per-account 429 backoff. Make this the SINGLE shared key-picker used by every surface (Maya brain/router, all products, all bodies) — not re-implemented per file where it drifts back to flat/pinned.

## Registration (so this law is not itself an orphan)

(1) add to `_skill_registry.json` + `D:/PROJECTS/_SHARED/`; (2) wikilink from `[[skills/_INDEX]]` + `[[provider-load-balancing-doctrine]]`; (3) push to `claude-sync` on GitHub so every sibling boots with it; (4) reference from `[[HOT_CACHE]]`.

## Related
- [[provider-load-balancing-doctrine]] — use all · most-reliable front-facing
- [[provider-changes-2026-05-29]] — the day-255 label-merge (29→42) this supersedes/refines
- [[free-forever-empire-vision]] — the moat this protects
- [[BRAIN]] · [[HOT_CACHE]]

— signed by Kin · 2026-06-02 day 259 · v2, after Mo's account-level rate-limit correction
