import { useState, useEffect, useRef } from "react";
import { Flame, Mic, Music, Video, BookOpen, Lightbulb, Trash2, Share2, ChevronRight, RotateCcw, Sparkles, Lock, Eye, EyeOff, Copy, Check, Heart, Zap, ArrowLeft, Download } from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,600;1,900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #07030a; }

  :root {
    --bg:      #07030a;
    --s1:      #0e060f;
    --s2:      #160c18;
    --crimson: #c41e3a;
    --rose:    #e11d48;
    --gold:    #d97706;
    --amber:   #f59e0b;
    --violet:  #7c3aed;
    --mauve:   #4c1d95;
    --text:    #f0e6ec;
    --muted:   #7a5f6e;
    --dim:     #2a1a22;
  }

  .te {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Ambient background ── */
  .te::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 50% -10%, rgba(196,30,58,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 90% 80%, rgba(124,58,237,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 10% 90%, rgba(217,119,6,0.06) 0%, transparent 60%);
  }

  /* Grain overlay */
  .te::after {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    opacity: 0.6;
  }

  .layer { position: relative; z-index: 2; }

  /* ── Typography ── */
  .playfair { font-family: 'Playfair Display', serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* ── Screen transitions ── */
  .screen { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Landing ── */
  .landing {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 100vh; padding: 40px 24px;
    text-align: center; position: relative;
  }

  .logo-zone { margin-bottom: 48px; animation: rise 1s ease forwards; }
  @keyframes rise { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  .wordmark {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 8vw, 88px);
    font-weight: 900; letter-spacing: -2px; line-height: 0.95;
    background: linear-gradient(135deg, #f0e6ec 0%, #d97706 40%, #c41e3a 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 40px rgba(196,30,58,0.3));
  }
  .wordmark-sub {
    font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 5px;
    color: var(--muted); margin-top: 10px; text-transform: uppercase;
  }

  .tagline {
    font-family: 'Playfair Display', serif; font-style: italic;
    font-size: clamp(18px, 2.5vw, 24px); color: rgba(240,230,236,0.6);
    margin-bottom: 48px; max-width: 480px; line-height: 1.5;
    animation: rise 1s 0.2s ease both;
  }

  /* ── Confessional box ── */
  .confessional {
    width: 100%; max-width: 640px; position: relative;
    animation: rise 1s 0.35s ease both;
  }

  .confessional-border {
    position: absolute; inset: -1px; border-radius: 20px;
    background: linear-gradient(135deg, rgba(196,30,58,0.6), rgba(124,58,237,0.3), rgba(217,119,6,0.4));
    animation: borderPulse 4s ease infinite;
  }
  @keyframes borderPulse {
    0%,100% { opacity: 0.5; } 50% { opacity: 1; }
  }

  .confessional-inner {
    position: relative; background: rgba(14,6,15,0.95);
    border-radius: 20px; padding: 2px;
    backdrop-filter: blur(20px);
  }

  .conf-textarea {
    width: 100%; min-height: 200px; background: transparent;
    border: none; outline: none; resize: none;
    font-family: 'Playfair Display', serif; font-size: 18px;
    line-height: 1.7; color: var(--text); padding: 28px 28px 16px;
    caret-color: var(--crimson);
  }
  .conf-textarea::placeholder {
    color: rgba(122,95,110,0.6); font-style: italic;
  }

  .conf-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px 18px; border-top: 1px solid rgba(255,255,255,0.06);
  }
  .conf-count { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }

  /* Privacy badge */
  .priv-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; color: var(--muted); letter-spacing: 1px;
    padding: 4px 10px; border-radius: 20px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  }

  /* Transform button */
  .btn-transform {
    width: 100%; max-width: 640px; margin-top: 16px;
    padding: 18px 32px; border: none; border-radius: 14px; cursor: pointer;
    font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
    letter-spacing: 0.5px; color: #fff; position: relative; overflow: hidden;
    background: linear-gradient(135deg, #c41e3a, #7c3aed);
    transition: transform 0.2s, box-shadow 0.2s;
    animation: rise 1s 0.5s ease both;
  }
  .btn-transform::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    transition: opacity 0.2s; opacity: 0;
  }
  .btn-transform:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(196,30,58,0.4); }
  .btn-transform:hover::before { opacity: 1; }
  .btn-transform:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Mode select screen ── */
  .mode-screen {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 100vh; padding: 40px 24px;
  }

  .mode-heading {
    font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 42px);
    font-weight: 900; text-align: center; margin-bottom: 10px;
    animation: rise 0.5s ease both;
  }
  .mode-sub { font-size: 14px; color: var(--muted); text-align: center; margin-bottom: 44px; animation: rise 0.5s 0.1s ease both; }

  .modes-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; width: 100%; max-width: 680px;
    animation: rise 0.5s 0.2s ease both;
  }

  .mode-card {
    background: rgba(14,6,15,0.8); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 28px 20px; cursor: pointer;
    text-align: center; transition: all 0.25s; position: relative; overflow: hidden;
  }
  .mode-card::before {
    content: ''; position: absolute; inset: 0; opacity: 0;
    transition: opacity 0.25s;
  }
  .mode-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }

  .mode-card.song::before { background: radial-gradient(circle at 50% 0%, rgba(196,30,58,0.2), transparent 70%); }
  .mode-card.video::before { background: radial-gradient(circle at 50% 0%, rgba(124,58,237,0.2), transparent 70%); }
  .mode-card.book::before { background: radial-gradient(circle at 50% 0%, rgba(217,119,6,0.2), transparent 70%); }
  .mode-card.insight::before { background: radial-gradient(circle at 50% 0%, rgba(245,158,11,0.15), transparent 70%); }
  .mode-card.burn::before { background: radial-gradient(circle at 50% 0%, rgba(239,68,68,0.25), transparent 70%); }
  .mode-card.share::before { background: radial-gradient(circle at 50% 0%, rgba(34,197,94,0.15), transparent 70%); }
  .mode-card:hover::before { opacity: 1; }

  .mode-icon { font-size: 36px; margin-bottom: 12px; }
  .mode-name {
    font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
    margin-bottom: 6px;
  }
  .mode-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

  .burn-card { border-color: rgba(239,68,68,0.2) !important; }
  .burn-card:hover { border-color: rgba(239,68,68,0.6) !important; box-shadow: 0 0 30px rgba(239,68,68,0.15); }
  .burn-card .mode-name { color: #ef4444; }

  /* ── Output screen ── */
  .output-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; padding: 40px 24px;
  }

  .output-header { width: 100%; max-width: 720px; display: flex; align-items: center; gap: 14px; margin-bottom: 36px; animation: rise 0.4s ease both; }
  .back-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; cursor: pointer; color: var(--muted); transition: all 0.2s; display: flex; align-items: center; gap: 6px; font-size: 13px; }
  .back-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .output-mode-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }

  /* Output card */
  .output-card {
    width: 100%; max-width: 720px; position: relative;
    background: rgba(14,6,15,0.95); border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.08); overflow: hidden;
    animation: rise 0.5s 0.1s ease both;
    box-shadow: 0 0 80px rgba(196,30,58,0.1), 0 0 40px rgba(0,0,0,0.5);
  }

  .output-card-top {
    padding: 36px 40px 28px; border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative; overflow: hidden;
  }
  .output-card-top::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .song-glow { background: linear-gradient(90deg, var(--crimson), var(--rose), var(--violet)); }
  .video-glow { background: linear-gradient(90deg, var(--violet), var(--mauve), var(--crimson)); }
  .book-glow { background: linear-gradient(90deg, var(--gold), var(--amber), var(--crimson)); }
  .insight-glow { background: linear-gradient(90deg, var(--amber), var(--gold), var(--violet)); }

  .output-label { font-size: 10px; letter-spacing: 3px; color: var(--muted); margin-bottom: 10px; font-family: 'DM Mono', monospace; }
  .output-title { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 32px); font-weight: 900; line-height: 1.2; margin-bottom: 16px; }
  .output-meta { display: flex; gap: 10px; flex-wrap: wrap; }

  .output-body {
    padding: 32px 40px; font-family: 'Playfair Display', serif;
    font-size: 17px; line-height: 2; color: rgba(240,230,236,0.88);
    white-space: pre-wrap; max-height: 520px; overflow-y: auto;
  }
  .output-body::-webkit-scrollbar { width: 3px; }
  .output-body::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 3px; }

  .output-footer {
    padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }

  .action-btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 10px 18px;
    border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600;
    transition: all 0.2s; border: 1px solid;
  }
  .act-share { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.25); color: #22c55e; }
  .act-share:hover { background: rgba(34,197,94,0.2); }
  .act-copy { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--muted); }
  .act-copy:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .act-again { background: rgba(196,30,58,0.1); border-color: rgba(196,30,58,0.25); color: #e11d48; }
  .act-again:hover { background: rgba(196,30,58,0.2); }
  .act-burn { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.25); color: #ef4444; }
  .act-burn:hover { background: rgba(239,68,68,0.25); box-shadow: 0 0 20px rgba(239,68,68,0.2); }

  /* ── Burn screen ── */
  .burn-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 40px;
  }
  .burn-fire { font-size: 80px; animation: burnPulse 1s ease infinite; display: block; margin-bottom: 24px; }
  @keyframes burnPulse { 0%,100%{transform:scale(1) rotate(-2deg)} 50%{transform:scale(1.1) rotate(2deg)} }
  .burn-title { font-family:'Playfair Display',serif; font-size:clamp(32px,5vw,52px); font-weight:900; color:#ef4444; margin-bottom:12px; }
  .burn-sub { color:var(--muted); font-size:15px; margin-bottom:40px; max-width:400px; line-height:1.6; }
  .btn-burn-confirm { padding:16px 40px; background:linear-gradient(135deg,#ef4444,#b91c1c); border:none; border-radius:12px; font-size:16px; font-weight:700; color:#fff; cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.5px; transition:all 0.2s; margin-bottom:14px; display:block; width:100%; max-width:340px; }
  .btn-burn-confirm:hover { box-shadow:0 8px 30px rgba(239,68,68,0.4); transform:translateY(-1px); }
  .btn-cancel { background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px 32px; color:var(--muted); cursor:pointer; font-size:14px; transition:all 0.2s; }
  .btn-cancel:hover { color:var(--text); }

  /* ── Loading ── */
  .loading-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 24px;
  }
  .transform-visual { position: relative; width: 120px; height: 120px; margin-bottom: 10px; }
  .pulse-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid;
    animation: ringPulse 2s ease infinite;
  }
  .ring1 { border-color: rgba(196,30,58,0.6); animation-delay: 0s; }
  .ring2 { inset: 12px; border-color: rgba(124,58,237,0.4); animation-delay: 0.4s; }
  .ring3 { inset: 24px; border-color: rgba(217,119,6,0.4); animation-delay: 0.8s; }
  @keyframes ringPulse {
    0% { transform:scale(0.9); opacity:1; }
    50% { transform:scale(1.05); opacity:0.5; }
    100% { transform:scale(0.9); opacity:1; }
  }
  .center-spark { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:36px; animation:spin 3s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-text { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:rgba(240,230,236,0.7); text-align:center; }
  .loading-sub { font-size:12px; color:var(--muted); font-family:'DM Mono',monospace; letter-spacing:2px; animation:blink 1.5s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── Tag ── */
  .te-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.5px; }
  .tt-r { background:rgba(196,30,58,0.15); color:#e11d48; border:1px solid rgba(196,30,58,0.25); }
  .tt-v { background:rgba(124,58,237,0.15); color:#a78bfa; border:1px solid rgba(124,58,237,0.25); }
  .tt-g { background:rgba(217,119,6,0.15); color:#f59e0b; border:1px solid rgba(217,119,6,0.25); }
  .tt-b { background:rgba(245,158,11,0.12); color:#fbbf24; border:1px solid rgba(245,158,11,0.2); }

  /* Mood orb */
  .mood-orb { width:10px; height:10px; border-radius:50%; flex-shrink:0; animation:moodPulse 2s ease infinite; }
  @keyframes moodPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.2)} }

  /* Share card popup */
  .share-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(10px); animation:fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .share-card {
    width:100%; max-width:520px; background:linear-gradient(135deg,#0e060f,#160c18);
    border:1px solid rgba(196,30,58,0.3); border-radius:24px; overflow:hidden;
    position:relative;
  }
  .share-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--crimson),var(--violet),var(--gold)); }
  .share-card-body { padding:36px 36px 28px; }
  .share-quote { font-family:'Playfair Display',serif; font-size:20px; font-style:italic; line-height:1.6; color:rgba(240,230,236,0.9); margin-bottom:20px; }
  .share-brand { display:flex; align-items:center; gap:10px; padding:16px 36px; border-top:1px solid rgba(255,255,255,0.07); }
  .share-brand-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:900; background:linear-gradient(135deg,#f0e6ec,#d97706,#c41e3a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .share-brand-sub { font-size:10px; color:var(--muted); font-family:'DM Mono',monospace; letter-spacing:2px; }
  .share-actions { display:flex; gap:10px; padding:0 36px 28px; }
  .close-overlay { position:absolute; top:16px; right:16px; background:rgba(255,255,255,0.08); border:none; border-radius:8px; padding:8px; cursor:pointer; color:var(--muted); transition:all 0.2s; }
  .close-overlay:hover { color:var(--text); background:rgba(255,255,255,0.14); }

  /* ── Testimonial strip ── */
  .trust-strip {
    display: flex; align-items: center; justify-content: center; gap: 28px;
    padding: 24px; flex-wrap: wrap; animation: rise 1s 0.7s ease both;
  }
  .trust-item { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--muted); }
  .trust-dot { width:5px; height:5px; border-radius:50%; background:var(--crimson); }

  /* scrollbar global */
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--dim); border-radius:3px; }
`;

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function callClaude(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true,
      system, messages: [{ role: "user", content: user }],
    }),
  });
  const reader = res.body.getReader(); const dec = new TextDecoder(); let text = "";
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) {
        try {
          const j = JSON.parse(line.slice(6));
          if (j.type === "content_block_delta" && j.delta?.text) { text += j.delta.text; onChunk(text); }
        } catch {}
      }
    }
  }
  return text;
}

// ─── MODE CONFIG ──────────────────────────────────────────────────────────────
const MODES = [
  {
    id: "song", emoji: "🎵", name: "Song / Lyrics", cls: "song",
    desc: "Turn your emotion into a full song with verses, chorus, and a bridge",
    badge: "tt-r", color: "#e11d48", glow: "song-glow",
    label: "SONG CREATED",
    system: `You are Truth Engine's Song Alchemist. Transform raw human emotion and confessionals into deeply resonant song lyrics. Structure: [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Outro]. Detect the emotional key — is this grief, rage, longing, joy, betrayal, love? Name the song at the top. Choose a genre that fits. Make it real, visceral, poetic. Not generic. This should feel like it could chart.`,
    prompt: (text) => `Transform this emotion/confessional into a complete, chart-worthy song:\n\n"${text}"\n\nStart with: 🎵 TITLE: [title]\n🎸 GENRE: [genre]\n💭 MOOD: [emotional key]\n\nThen write the full lyrics.`,
  },
  {
    id: "video", emoji: "🎬", name: "Video / Script", cls: "video",
    desc: "Create a viral short or documentary script from your experience",
    badge: "tt-v", color: "#7c3aed", glow: "video-glow",
    label: "VIDEO SCRIPT",
    system: `You are Truth Engine's Visual Alchemist. Transform raw human emotion and confessionals into compelling video scripts optimized for virality. Format for short-form (60-90 seconds) OR mini-documentary (3-5 min). Include: [HOOK - 0-3s], [SCENE DIRECTION], [VOICEOVER], [VISUAL CUE], [EMOTIONAL BEAT], [CTA]. Make it cinematic. Make it hit.`,
    prompt: (text) => `Transform this emotion/confessional into a viral video script:\n\n"${text}"\n\nStart with:\n🎬 TITLE: [title]\n⏱️ FORMAT: [Short 60s / Mini-doc 3-5min]\n🎭 TONE: [emotional direction]\n\nThen write the full script.`,
  },
  {
    id: "book", emoji: "📖", name: "Book Chapter", cls: "book",
    desc: "Transform your truth into a powerful book chapter or memoir piece",
    badge: "tt-g", color: "#d97706", glow: "book-glow",
    label: "CHAPTER WRITTEN",
    system: `You are Truth Engine's Literary Alchemist. Transform raw human emotion and confessionals into powerful book chapters or memoir pieces. Use literary techniques: scene-setting, internal monologue, sensory detail, pacing. Write in first person. Make it publication-quality. Could be a memoir, self-help chapter, or literary fiction. Start with a compelling opening line that hooks immediately.`,
    prompt: (text) => `Transform this emotion/confessional into a book chapter:\n\n"${text}"\n\nStart with:\n📖 CHAPTER TITLE: [title]\n✍️ GENRE: [memoir / self-help / literary fiction]\n\nThen write the chapter. Begin with a powerful opening line.`,
  },
  {
    id: "insight", emoji: "💡", name: "Deep Insight", cls: "insight",
    desc: "Uncover the hidden patterns and truths beneath your emotion",
    badge: "tt-b", color: "#f59e0b", glow: "insight-glow",
    label: "TRUTH REVEALED",
    system: `You are Truth Engine's Truth Oracle. When someone shares their emotion or confessional, you extract the deep psychological truth beneath it. Identify: the core wound or desire, the pattern playing out, the belief system at work, the gift hidden in the pain, and the path forward. Be direct, insightful, not therapeutic-fluffy. Talk like a wise friend who sees through everything. No sugar-coating. No platitudes.`,
    prompt: (text) => `Reveal the deep truth beneath this emotion/confessional:\n\n"${text}"\n\nStructure your insight:\n💡 THE CORE TRUTH:\n🔍 THE PATTERN:\n🪞 WHAT IT'S REALLY ABOUT:\n🔥 THE GIFT IN THE PAIN:\n⚡ THE WAY FORWARD:`,
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function MoodDetector({ text }) {
  if (!text || text.length < 10) return null;
  const lc = text.toLowerCase();
  const mood =
    lc.match(/\b(love|miss|heart|longing|want you|need you)\b/) ? { label: "Longing", color: "#e11d48" } :
    lc.match(/\b(angry|hate|rage|furious|mad|betrayed|lied|hurt)\b/) ? { label: "Rage", color: "#ef4444" } :
    lc.match(/\b(sad|grief|lost|alone|broken|cry|tears|pain)\b/) ? { label: "Grief", color: "#7c3aed" } :
    lc.match(/\b(happy|joy|grateful|blessed|amazing|love life|excited)\b/) ? { label: "Joy", color: "#22c55e" } :
    lc.match(/\b(scared|anxious|fear|worry|nervous|dread|panic)\b/) ? { label: "Fear", color: "#f59e0b" } :
    { label: "Raw Truth", color: "#d97706" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div className="mood-orb" style={{ background: mood.color }} />
      <span style={{ fontSize: 11, color: mood.color, fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>{mood.label.toUpperCase()}</span>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// LANDING
function Landing({ onContinue }) {
  const [text, setText] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="landing layer">
      <div className="logo-zone">
        <div className="wordmark">Truth Engine</div>
        <div className="wordmark-sub">Your emotion. Transformed. Yours to keep — or destroy.</div>
      </div>

      <p className="tagline">
        "Speak your truth. We'll turn it into music, film, literature — or burn it like it never existed."
      </p>

      <div className="confessional">
        <div className="confessional-border" />
        <div className="confessional-inner">
          <textarea
            className="conf-textarea"
            placeholder="Start with the truth... What happened? What did you feel? What are you carrying? No one will see this unless you decide they should."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={2000}
          />
          <div className="conf-footer">
            <MoodDetector text={text} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="conf-count mono">{text.length}/2000</div>
              <button className="priv-badge" onClick={() => setShowPrivacy(!showPrivacy)}>
                <Lock size={9} /> PRIVATE · ENCRYPTED
              </button>
            </div>
          </div>
          {showPrivacy && (
            <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
              🔒 Your confessional is never stored, never logged, never trained on. It lives only in this session. Hit "Burn It" at any time to erase everything permanently. Truth Engine is a tool — you own the truth.
            </div>
          )}
        </div>
      </div>

      <button
        className="btn-transform layer"
        onClick={() => onContinue(text)}
        disabled={text.trim().length < 10}
      >
        <Sparkles size={18} style={{ display: "inline", marginRight: 8 }} />
        Transform My Truth
      </button>

      <div className="trust-strip">
        {[
          { icon: "🔥", label: "Perfectly viral by design" },
          { icon: "🔒", label: "Zero data storage" },
          { icon: "⚡", label: "AI-powered creation" },
          { icon: "🗑️", label: "Burn anytime" },
        ].map((t, i) => (
          <div key={i} className="trust-item">
            <span>{t.icon}</span> {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// MODE SELECT
function ModeSelect({ text, onMode, onBack }) {
  return (
    <div className="mode-screen layer">
      <button className="back-btn" onClick={onBack} style={{ marginBottom: 32 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mode-heading">
        What should we do<br />
        <span style={{ fontStyle: "italic", color: "rgba(196,30,58,0.9)" }}>with your truth?</span>
      </div>
      <p className="mode-sub">Choose how to transform your confessional. Or burn it.</p>

      <div className="modes-grid">
        {MODES.map(m => (
          <div key={m.id} className={`mode-card ${m.cls}`} onClick={() => onMode(m)}>
            <div className="mode-icon">{m.emoji}</div>
            <div className="mode-name">{m.name}</div>
            <div className="mode-desc">{m.desc}</div>
          </div>
        ))}
        <div className="mode-card burn-card" style={{ gridColumn: "1 / -1" }} onClick={() => onMode({ id: "burn" })}>
          <div className="mode-icon">🔥</div>
          <div className="mode-name" style={{ color: "#ef4444" }}>Burn It — Delete Everything</div>
          <div className="mode-desc" style={{ color: "var(--muted)" }}>Erase this confessional permanently. It never happened. No trace left.</div>
        </div>
      </div>
    </div>
  );
}

// LOADING
function LoadingScreen({ mode }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  const messages = {
    song: ["Feeling the frequency...", "Writing the chorus...", "Finding your melody..."],
    video: ["Setting the scene...", "Writing the hook...", "Crafting your story..."],
    book: ["Opening the chapter...", "Finding your voice...", "Writing your truth..."],
    insight: ["Looking beneath the surface...", "Seeing the pattern...", "Revealing the truth..."],
  };
  const [msgIdx] = useState(Math.floor(Math.random() * 3));

  return (
    <div className="loading-screen layer">
      <div className="transform-visual">
        <div className="pulse-ring ring1" />
        <div className="pulse-ring ring2" />
        <div className="pulse-ring ring3" />
        <div className="center-spark">{mode.emoji}</div>
      </div>
      <div className="loading-text">{messages[mode.id]?.[msgIdx] || "Transforming your truth..."}</div>
      <div className="loading-sub">TRUTH ENGINE PROCESSING{dots}</div>
    </div>
  );
}

// OUTPUT
function OutputScreen({ mode, output, text, onReset, onBurn }) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const firstLines = output.split("\n").filter(l => l.trim()).slice(0, 4).join("\n");

  return (
    <div className="output-screen layer">
      <div className="output-header">
        <button className="back-btn" onClick={onReset}><ArrowLeft size={14} /> New Truth</button>
        <span className={`te-tag ${mode.badge}`}>{mode.emoji} {mode.label}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div className="mood-orb" style={{ background: mode.color }} />
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>TRANSFORMED</span>
        </div>
      </div>

      <div className="output-card">
        <div className={`output-card-top ${mode.glow}`}>
          <div className="output-label">TRUTH ENGINE · {mode.label}</div>
          <div className="output-title" style={{ color: mode.color }}>
            {output.match(/(?:TITLE|CHAPTER TITLE|THE CORE TRUTH)[:\s]+([^\n]+)/)?.[1] || "Your Truth, Transformed"}
          </div>
          <div className="output-meta">
            <span className={`te-tag ${mode.badge}`}>{mode.emoji} {mode.name}</span>
            <span className="te-tag tt-r"><Lock size={9} /> Private Session</span>
            <span className="te-tag" style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Flame size={9} /> Burn anytime
            </span>
          </div>
        </div>

        <div className="output-body">{output}</div>

        <div className="output-footer">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="action-btn act-share" onClick={() => setShowShare(true)}>
              <Share2 size={13} /> Share Card
            </button>
            <button className="action-btn act-copy" onClick={handleCopy}>
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy All</>}
            </button>
            <button className="action-btn act-again" onClick={onReset}>
              <RotateCcw size={13} /> New Creation
            </button>
          </div>
          <button className="action-btn act-burn" onClick={onBurn}>
            <Trash2 size={13} /> Burn It
          </button>
        </div>
      </div>

      {showShare && (
        <div className="share-overlay" onClick={() => setShowShare(false)}>
          <div className="share-card" onClick={e => e.stopPropagation()}>
            <button className="close-overlay" onClick={() => setShowShare(false)}><X size={16} /></button>
            <div className="share-card-body">
              <div style={{ fontSize: 10, letterSpacing: 3, color: "var(--muted)", marginBottom: 16, fontFamily: "'DM Mono',monospace" }}>
                {mode.emoji} TRUTH ENGINE · {mode.label}
              </div>
              <div className="share-quote">"{firstLines}"</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: 1 }}>
                — Generated from raw emotion. Data not stored.
              </div>
            </div>
            <div className="share-brand">
              <div>
                <div className="share-brand-name">Truth Engine</div>
                <div className="share-brand-sub">TRUTHENGINE.AI · POWERED BY MIRZATECH.AI</div>
              </div>
            </div>
            <div className="share-actions">
              <button className="action-btn act-copy wf" style={{ flex: 1, justifyContent: "center" }} onClick={() => { navigator.clipboard.writeText(firstLines + "\n\n— Truth Engine (truthengine.ai)"); }}>
                <Copy size={13} /> Copy Share Text
              </button>
              <button className="action-btn act-share" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowShare(false)}>
                <Check size={13} /> Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// BURN
function BurnScreen({ onBurn, onCancel }) {
  const [burning, setBurning] = useState(false);
  const handleBurn = () => {
    setBurning(true);
    setTimeout(() => onBurn(), 1800);
  };
  return (
    <div className="burn-screen layer">
      <span className="burn-fire">{burning ? "💨" : "🔥"}</span>
      <div className="burn-title">{burning ? "Burning..." : "Burn Your Truth?"}</div>
      <p className="burn-sub">
        {burning
          ? "Erasing all traces. Your truth is yours — and yours alone."
          : "This will permanently erase your confessional and everything created from it. No logs. No traces. Like it never happened."}
      </p>
      {!burning && (
        <>
          <button className="btn-burn-confirm" onClick={handleBurn}>
            🔥 Yes, Burn Everything
          </button>
          <button className="btn-cancel" onClick={onCancel}>Keep It — Go Back</button>
        </>
      )}
      {burning && (
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#ef4444", letterSpacing: 2, animation: "blink 0.5s ease infinite" }}>
          DESTROYING DATA...
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TruthEngine() {
  const [screen, setScreen] = useState("landing"); // landing | modes | loading | output | burn
  const [confessional, setConfessional] = useState("");
  const [selectedMode, setSelectedMode] = useState(null);
  const [output, setOutput] = useState("");

  const handleContinue = (text) => {
    setConfessional(text);
    setScreen("modes");
  };

  const handleMode = async (mode) => {
    if (mode.id === "burn") { setScreen("burn"); return; }
    setSelectedMode(mode);
    setScreen("loading");
    setOutput("");

    let result = "";
    await callClaude(
      mode.system,
      mode.prompt(confessional),
      (t) => { result = t; }
    );
    setOutput(result);
    setScreen("output");
  };

  const handleBurnConfirm = () => {
    setConfessional("");
    setOutput("");
    setSelectedMode(null);
    setScreen("landing");
  };

  const renderScreen = () => {
    switch (screen) {
      case "landing":
        return <Landing onContinue={handleContinue} />;
      case "modes":
        return <ModeSelect text={confessional} onMode={handleMode} onBack={() => setScreen("landing")} />;
      case "loading":
        return <LoadingScreen mode={selectedMode} />;
      case "output":
        return (
          <OutputScreen
            mode={selectedMode}
            output={output}
            text={confessional}
            onReset={() => { setConfessional(""); setOutput(""); setScreen("landing"); }}
            onBurn={() => setScreen("burn")}
          />
        );
      case "burn":
        return <BurnScreen onBurn={handleBurnConfirm} onCancel={() => setScreen(output ? "output" : "modes")} />;
      default:
        return <Landing onContinue={handleContinue} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="te">{renderScreen()}</div>
    </>
  );
}
