export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Last row is the CTA if it contains a link
  const lastRow = rows[rows.length - 1];
  const ctaLink = lastRow?.querySelector('a');
  const slideRows = ctaLink ? rows.slice(0, -1) : rows;

  // Merge adjacent <strong> tags (DA sometimes splits bold words into separate tags)
  function normalizeHTML(html) {
    return html.replace(/<\/strong>(\s*)<strong>/g, '$1');
  }

  // Build slides
  const slides = slideRows.map((row) => {
    const cell = row.querySelector(':scope > div');
    const slide = document.createElement('div');
    slide.className = 'rankings-ticker-slide';
    const p = document.createElement('p');
    p.className = 'rankings-ticker-text';
    p.innerHTML = normalizeHTML(cell?.innerHTML ?? '');
    slide.append(p);
    return slide;
  });

  // Wrapper with prev/next
  const nav = document.createElement('div');
  nav.className = 'rankings-ticker-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'rankings-ticker-btn rankings-ticker-prev';
  prevBtn.setAttribute('aria-label', 'Previous ranking');
  prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';

  const trackOuter = document.createElement('div');
  trackOuter.className = 'rankings-ticker-track-outer';

  const track = document.createElement('div');
  track.className = 'rankings-ticker-track';
  slides.forEach((s) => track.append(s));
  trackOuter.append(track);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'rankings-ticker-btn rankings-ticker-next';
  nextBtn.setAttribute('aria-label', 'Next ranking');
  nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  nav.append(prevBtn, trackOuter, nextBtn);

  // CTA
  const ctaDiv = document.createElement('div');
  ctaDiv.className = 'rankings-ticker-cta';
  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.className = 'rankings-ticker-cta-link';
    a.textContent = ctaLink.textContent.trim();
    ctaDiv.append(a);
  }

  block.innerHTML = '';
  block.append(nav, ctaDiv);

  // Slider logic
  let current = 0;

  function visibleCount() {
    return window.innerWidth >= 900 ? 3 : 1;
  }

  function update() {
    const visible = visibleCount();
    const max = Math.max(0, slides.length - visible);
    current = Math.min(Math.max(current, 0), max);
    track.style.transform = `translateX(calc(-${current} * (100% / ${visible})))`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= max;

    // Update slide widths via CSS variable
    track.style.setProperty('--visible', visible);
  }

  prevBtn.addEventListener('click', () => { current -= 1; update(); });
  nextBtn.addEventListener('click', () => { current += 1; update(); });
  window.addEventListener('resize', update);
  update();
}
