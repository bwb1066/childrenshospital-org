const COLOR_PRESETS = {
  red: '#c00',
  orange: '#e87722',
  yellow: '#f5c518',
};

// Yellow is light — use dark text; all others use white
const DARK_BG_COLORS = new Set(['yellow']);

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const data = {};
  rows.forEach((row) => {
    const [keyCell, valCell] = [...row.querySelectorAll(':scope > div')];
    if (keyCell && valCell) {
      data[keyCell.textContent.trim().toLowerCase()] = valCell;
    }
  });

  const rawColor = data.color?.textContent.trim() ?? 'red';
  const bg = COLOR_PRESETS[rawColor.toLowerCase()] ?? rawColor;
  const isDark = DARK_BG_COLORS.has(rawColor.toLowerCase());

  const storageKey = `bch-banner-dismissed-${rawColor}`;
  if (sessionStorage.getItem(storageKey)) {
    block.closest('.section')?.remove();
    return;
  }

  block.textContent = '';
  block.style.setProperty('--banner-bg', bg);
  if (isDark) block.classList.add('dark-text');

  const inner = document.createElement('div');
  inner.className = 'dismissable-banner-inner';

  const contentEl = document.createElement('div');
  contentEl.className = 'dismissable-banner-content';
  if (data.content) contentEl.append(...data.content.cloneNode(true).childNodes);
  inner.append(contentEl);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'dismissable-banner-close';
  closeBtn.setAttribute('aria-label', 'Dismiss banner');
  closeBtn.innerHTML = '&times;';
  inner.append(closeBtn);

  block.append(inner);

  const section = block.closest('.section');
  document.querySelector('header')?.before(section ?? block);

  closeBtn.addEventListener('click', () => {
    sessionStorage.setItem(storageKey, '1');
    const el = block.closest('.section') ?? block;
    el.style.transition = 'opacity .25s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 260);
  });
}
