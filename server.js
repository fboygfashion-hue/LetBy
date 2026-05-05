"use strict";

const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";
const APP_URL = process.env.APP_URL || `https://your-deployed-url.com`;

// ─── In-Memory Store ─────────────────────────────────────────────────────────
let listings = [
  {
    id: 1,
    title: "iPhone 14 Pro Max – 256GB",
    price: "$850",
    description: "Pristine condition, Deep Purple, with original box & accessories.",
    seller_username: "alex_sells",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Vintage Leather Jacket",
    price: "$120",
    description: "Genuine leather, size M. Minor wear adds character. Great for fall.",
    seller_username: "maria_shop",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Headphones",
    price: "$220",
    description: "Barely used, incredible noise cancellation. Comes with carry case.",
    seller_username: "techdeals_tg",
    created_at: new Date().toISOString(),
  },
];
let nextId = 4;

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// GET /listings
app.get("/listings", async (req, res) => {
  res.json([...listings].reverse());
});

// POST /listings
app.post("/listings", async (req, res) => {
  const { title, price, description, seller_username } = req.body;
  if (!title || !price || !seller_username) {
    return res.status(400).json({ error: "title, price, and seller_username are required." });
  }
  const listing = {
    id: nextId++,
    title: String(title).trim(),
    price: String(price).trim(),
    description: String(description || "").trim(),
    seller_username: String(seller_username).replace(/^@/, "").trim(),
    created_at: new Date().toISOString(),
  };
  listings.push(listing);
  res.status(201).json(listing);
});

// ─── Frontend ────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>LetBy – Marketplace</title>
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #0d0d0f;
    --surface: #16161a;
    --surface2: #1e1e24;
    --border: rgba(255,255,255,0.07);
    --accent: #f7c948;
    --accent2: #ff6b35;
    --text: #f0efe9;
    --muted: #888896;
    --card-radius: 16px;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom, 20px);
    overflow-x: hidden;
  }

  /* ── Header ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13,13,15,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-family: var(--font-head);
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .logo-dot { color: var(--accent); }

  .header-tag {
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ── Hero Strip ── */
  .hero {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 60%);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -40px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(247,201,72,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-title {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }
  .hero-title em {
    font-style: normal;
    color: var(--accent);
  }
  .hero-sub {
    margin-top: 6px;
    color: var(--muted);
    font-size: 13.5px;
    font-weight: 300;
  }

  /* ── Tabs ── */
  .tabs {
    display: flex;
    gap: 4px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 57px;
    z-index: 90;
  }
  .tab {
    flex: 1;
    padding: 9px 0;
    text-align: center;
    border-radius: 10px;
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
  }
  .tab.active {
    background: var(--accent);
    color: #0d0d0f;
  }
  .tab:not(.active) {
    background: var(--surface2);
    color: var(--muted);
  }
  .tab:not(.active):hover { color: var(--text); background: var(--surface); }

  /* ── Section Panels ── */
  .panel { display: none; padding: 20px; }
  .panel.active { display: block; }

  /* ── Listings ── */
  .listings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .listings-count {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
  }
  .refresh-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .refresh-btn:hover { color: var(--text); border-color: var(--accent); }
  .refresh-btn svg { width: 12px; height: 12px; }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    animation: fadeUp 0.35s ease both;
  }
  .card:hover {
    border-color: rgba(247,201,72,0.25);
    transform: translateY(-1px);
  }
  .card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0;
    transition: opacity 0.2s;
  }
  .card:hover::after { opacity: 1; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }
  .card-title {
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    flex: 1;
  }
  .card-price {
    font-family: var(--font-head);
    font-size: 17px;
    font-weight: 800;
    color: var(--accent);
    white-space: nowrap;
  }
  .card-desc {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.55;
    margin-bottom: 14px;
    font-weight: 300;
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .seller-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .seller-avatar {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #0d0d0f;
    flex-shrink: 0;
  }

  .contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent);
    color: #0d0d0f;
    font-family: var(--font-head);
    font-size: 12.5px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .contact-btn:hover {
    background: #ffd55e;
    transform: scale(1.03);
  }
  .contact-btn:active { transform: scale(0.97); }
  .contact-btn svg { width: 13px; height: 13px; flex-shrink: 0; }

  /* ── Skeleton ── */
  .skeleton {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--card-radius);
    padding: 16px;
  }
  .skel-line {
    background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,255,255,0.04) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
    height: 14px;
    margin-bottom: 10px;
  }
  .skel-line.wide { width: 75%; }
  .skel-line.narrow { width: 35%; }
  .skel-line.full { width: 100%; }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Empty State ── */
  .empty {
    text-align: center;
    padding: 50px 20px;
    color: var(--muted);
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title {
    font-family: var(--font-head);
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
  }
  .empty-sub { font-size: 13px; }

  /* ── Add Listing Form ── */
  .form-hero {
    text-align: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .form-hero-title {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 5px;
  }
  .form-hero-sub { color: var(--muted); font-size: 13px; }

  .form-group { margin-bottom: 14px; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 7px;
  }

  input, textarea {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14.5px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  input:focus, textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(247,201,72,0.1);
  }
  input::placeholder, textarea::placeholder { color: rgba(136,136,150,0.6); }
  textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

  .input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: var(--accent);
    color: #0d0d0f;
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 800;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: all 0.2s;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .submit-btn:hover { background: #ffd55e; transform: translateY(-1px); }
  .submit-btn:active { transform: translateY(0) scale(0.98); }
  .submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    color: var(--text);
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 500;
    white-space: nowrap;
    z-index: 9999;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    display: flex; align-items: center; gap: 8px;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .toast.error { border-left-color: #ff5555; }

  /* ── Spinner ── */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(13,13,15,0.3);
    border-top-color: #0d0d0f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: none;
  }
  .submit-btn.loading .spinner { display: block; }
  .submit-btn.loading .btn-text { opacity: 0; position: absolute; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="logo">Let<span class="logo-dot">By</span></div>
  <span class="header-tag">Marketplace</span>
</div>

<!-- Hero -->
<div class="hero">
  <div class="hero-title">Buy &amp; sell<br /><em>everything</em> here.</div>
  <div class="hero-sub">Peer-to-peer marketplace on Telegram</div>
</div>

<!-- Tabs -->
<div class="tabs">
  <button class="tab active" onclick="switchTab('browse')">Browse</button>
  <button class="tab" onclick="switchTab('sell')">+ Sell</button>
</div>

<!-- Browse Panel -->
<div class="panel active" id="panel-browse">
  <div class="listings-header">
    <span class="listings-count" id="count-label">Loading…</span>
    <button class="refresh-btn" onclick="loadListings()">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M13.65 2.35A8 8 0 1 0 15 8" stroke-linecap="round"/>
        <polyline points="15,2 15,6 11,6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Refresh
    </button>
  </div>
  <div class="grid" id="listings-grid">
    <!-- skeletons -->
    ${[1,2,3].map(() => `
    <div class="skeleton">
      <div class="skel-line wide"></div>
      <div class="skel-line narrow"></div>
      <div class="skel-line full"></div>
      <div class="skel-line full" style="width:85%"></div>
    </div>`).join('')}
  </div>
</div>

<!-- Sell Panel -->
<div class="panel" id="panel-sell">
  <div class="form-hero">
    <div class="form-hero-title">List your item</div>
    <div class="form-hero-sub">Fill in the details and go live instantly.</div>
  </div>

  <div class="form-group">
    <label for="f-title">Item title</label>
    <input id="f-title" type="text" placeholder="e.g. iPhone 14 Pro Max 256GB" maxlength="120" />
  </div>

  <div class="input-row">
    <div class="form-group">
      <label for="f-price">Price</label>
      <input id="f-price" type="text" placeholder="e.g. $200" maxlength="40" />
    </div>
    <div class="form-group">
      <label for="f-seller">Your @username</label>
      <input id="f-seller" type="text" placeholder="john_doe" maxlength="60" />
    </div>
  </div>

  <div class="form-group">
    <label for="f-desc">Description</label>
    <textarea id="f-desc" placeholder="Describe your item – condition, colour, specs…" maxlength="400"></textarea>
  </div>

  <button class="submit-btn" id="submit-btn" onclick="submitListing()">
    <div class="spinner"></div>
    <span class="btn-text">Post Listing</span>
  </button>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
const API = window.location.origin;

// ── Telegram WebApp init ──────────────────────────────────────────────────────
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  document.documentElement.style.setProperty('--tg-safe-bottom', tg.viewportStableHeight ? '0px' : '20px');
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && name === 'browse') || (i === 1 && name === 'sell'));
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (name === 'browse') loadListings();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.toggle('error', isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ── Card HTML ─────────────────────────────────────────────────────────────────
function avatarLetter(username) {
  return (username || '?')[0].toUpperCase();
}

function buildCard(item, index) {
  const delay = Math.min(index * 60, 300);
  return \`
  <div class="card" style="animation-delay:\${delay}ms">
    <div class="card-top">
      <div class="card-title">\${escHtml(item.title)}</div>
      <div class="card-price">\${escHtml(item.price)}</div>
    </div>
    \${item.description ? \`<div class="card-desc">\${escHtml(item.description)}</div>\` : ''}
    <div class="card-footer">
      <div class="seller-chip">
        <div class="seller-avatar">\${avatarLetter(item.seller_username)}</div>
        @\${escHtml(item.seller_username)}
      </div>
      <a class="contact-btn"
         href="https://t.me/\${encodeURIComponent(item.seller_username)}"
         target="_blank"
         rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Contact
      </a>
    </div>
  </div>\`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ── Load Listings ─────────────────────────────────────────────────────────────
async function loadListings() {
  const grid = document.getElementById('listings-grid');
  const countLabel = document.getElementById('count-label');
  try {
    const res = await fetch(API + '/listings');
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    countLabel.textContent = data.length === 0 ? 'No listings yet' : \`\${data.length} listing\${data.length === 1 ? '' : 's'}\`;
    if (data.length === 0) {
      grid.innerHTML = \`
        <div class="empty">
          <div class="empty-icon">🛍️</div>
          <div class="empty-title">Nothing listed yet</div>
          <div class="empty-sub">Be the first to post something!</div>
        </div>\`;
    } else {
      grid.innerHTML = data.map((item, i) => buildCard(item, i)).join('');
    }
  } catch (e) {
    countLabel.textContent = 'Failed to load';
    grid.innerHTML = \`
      <div class="empty">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">Couldn't load listings</div>
        <div class="empty-sub">Check your connection and refresh.</div>
      </div>\`;
  }
}

// ── Submit Listing ────────────────────────────────────────────────────────────
async function submitListing() {
  const title    = document.getElementById('f-title').value.trim();
  const price    = document.getElementById('f-price').value.trim();
  const seller   = document.getElementById('f-seller').value.trim().replace(/^@/, '');
  const desc     = document.getElementById('f-desc').value.trim();
  const btn      = document.getElementById('submit-btn');

  if (!title)  { showToast('⚠️ Please enter an item title', true);  return; }
  if (!price)  { showToast('⚠️ Please enter a price', true);        return; }
  if (!seller) { showToast('⚠️ Please enter your @username', true); return; }

  btn.disabled = true;
  btn.classList.add('loading');

  try {
    const res = await fetch(API + '/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, description: desc, seller_username: seller }),
    });
    if (!res.ok) throw new Error('Server error');

    // Clear form
    ['f-title','f-price','f-seller','f-desc'].forEach(id => { document.getElementById(id).value = ''; });

    showToast('✅ Listing posted!');

    // Switch to browse and reload
    setTimeout(() => { switchTab('browse'); }, 500);
  } catch (e) {
    showToast('❌ Failed to post. Try again.', true);
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
loadListings();
</script>
</body>
</html>`);
});

// ─── Telegram Bot ─────────────────────────────────────────────────────────────
if (BOT_TOKEN && BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE") {
  try {
    const bot = new TelegramBot(BOT_TOKEN, { polling: true });

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from.first_name || "there";

      bot.sendMessage(chatId,
        `👋 Hey ${firstName}! Welcome to *LetBy* — the peer-to-peer marketplace on Telegram.\n\n🛍️ Browse listings, contact sellers, or post your own items — all inside the app!`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[
              {
                text: "🛒 Open LetBy",
                web_app: { url: APP_URL }
              }
            ]]
          }
        }
      );
    });

    bot.onText(/\/help/, (msg) => {
      bot.sendMessage(msg.chat.id,
        `*LetBy Commands*\n\n/start — Open the marketplace\n/help — Show this message`,
        { parse_mode: "Markdown" }
      );
    });

    bot.on("polling_error", (err) => {
      console.error("[Bot polling error]", err.code, err.message);
    });

    console.log("✅ Telegram Bot started (polling)");
  } catch (err) {
    console.error("❌ Failed to start bot:", err.message);
  }
} else {
  console.warn("⚠️  BOT_TOKEN not set – Telegram bot disabled. Set the BOT_TOKEN env var to enable it.");
}

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 LetBy running at http://localhost:${PORT}`);
  console.log(`   APP_URL = ${APP_URL}`);
});
