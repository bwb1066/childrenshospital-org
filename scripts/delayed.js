const WIDGET_BASE = 'https://bwb1066.github.io/brand-chat-config-ui/widget/';
const SUPABASE_URL = 'https://cyjquwhkmzyedkwuaffc.supabase.co';
// Public anon key — read-only, safe to include client-side
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5anF1d2hrbXp5ZWRrd3VhZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjY4MjcsImV4cCI6MjA5MDY0MjgyN30.GkMBLXBZr9u34m4uI6ZR-2ZniLZD3RkjropjQw058k4';
const SITE_KEY = 'boston-childrens-hospital';

const SPARKLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M12 1.5a.6.6 0 0 0-.594.515L9.93 8.25 3.515 9.406A.6.6 0 0 0 3.515 10.594L9.93 11.75l1.476 6.235A.6.6 0 0 0 12 18.5a.6.6 0 0 0 .594-.515L14.07 11.75l6.415-1.156a.6.6 0 0 0 0-1.188L14.07 8.25 12.594 2.015A.6.6 0 0 0 12 1.5z"/>
  <path d="M5.5 1a.4.4 0 0 0-.39.34L4.53 4.53 1.34 5.11A.4.4 0 0 0 1.34 5.89L4.53 6.47l.58 3.19A.4.4 0 0 0 5.5 10a.4.4 0 0 0 .39-.34L6.47 6.47l3.19-.58a.4.4 0 0 0 0-.78L6.47 4.53l-.58-3.19A.4.4 0 0 0 5.5 1z" opacity=".65"/>
  <path d="M18.5 14a.4.4 0 0 0-.39.34l-.58 3.19-3.19.58a.4.4 0 0 0 0 .78l3.19.58.58 3.19A.4.4 0 0 0 18.5 23a.4.4 0 0 0 .39-.34l.58-3.19 3.19-.58a.4.4 0 0 0 0-.78l-3.19-.58-.58-3.19A.4.4 0 0 0 18.5 14z" opacity=".65"/>
</svg>`;

const TRIGGER_CSS = `
@keyframes bch-chat-ring {
  0% { transform: scale(1); opacity: .7; }
  70% { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
}
@keyframes bch-chat-sparkle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  30% { transform: rotate(-18deg) scale(1.18); }
  70% { transform: rotate(14deg) scale(0.88); }
}
#bch-chat-trigger {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #003087;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  box-shadow: 0 4px 18px rgba(0,48,135,.45);
  transition: background-color .2s, transform .2s, box-shadow .2s;
  padding: 0;
}
#bch-chat-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #003087;
  animation: bch-chat-ring 2.6s ease-out infinite;
  z-index: -1;
}
#bch-chat-trigger:hover {
  background: #027dba;
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(2,125,186,.55);
}
#bch-chat-trigger:hover::before { animation: none; opacity: 0; }
#bch-chat-trigger svg {
  animation: bch-chat-sparkle 3.2s ease-in-out infinite;
  pointer-events: none;
}
#bch-chat-trigger:hover svg { animation: none; }
`;

function injectStyles() {
  if (document.getElementById('bch-chat-styles')) return;
  const style = document.createElement('style');
  style.id = 'bch-chat-styles';
  style.textContent = TRIGGER_CSS;
  document.head.appendChild(style);
}

function buildTrigger(openFn) {
  if (document.getElementById('bch-chat-trigger')) return;
  injectStyles();
  const btn = document.createElement('button');
  btn.id = 'bch-chat-trigger';
  btn.type = 'button';
  btn.setAttribute('aria-label', "Chat with Boston Children's");
  btn.innerHTML = SPARKLE_SVG;
  btn.addEventListener('click', () => openFn());
  document.body.appendChild(btn);
}

async function loadBrandChat() {
  try {
    const { init, default: open } = await import(`${WIDGET_BASE}brand-concierge.js`);
    init({
      supabaseUrl: SUPABASE_URL,
      anonKey: ANON_KEY,
      siteKey: SITE_KEY,
      brandName: "Boston Children's Hospital",
      widgetBase: WIDGET_BASE,
      showTrigger: false,
    });
    buildTrigger(open);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[bch] brand chat failed to load', err);
  }
}

loadBrandChat();
