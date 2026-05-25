export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [contentCol, imageCol] = [...row.children];

  const bg = document.createElement('div');
  bg.className = 'primary-hero-bg';
  const picture = imageCol?.querySelector('picture');
  if (picture) {
    picture.querySelector('img')?.setAttribute('loading', 'eager');
    bg.append(picture);
  }

  const overlay = document.createElement('div');
  overlay.className = 'primary-hero-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'primary-hero-content';

  if (contentCol) {
    const h1s = contentCol.querySelectorAll('h1');
    const badges = [...contentCol.querySelectorAll('picture')];

    if (h1s[0]) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'primary-hero-eyebrow';
      eyebrow.textContent = h1s[0].textContent.trim();
      content.append(eyebrow);
    }

    if (badges.length) {
      const badgeRow = document.createElement('div');
      badgeRow.className = 'primary-hero-badges';
      badges.forEach((pic) => {
        pic.querySelector('img')?.setAttribute('loading', 'eager');
        badgeRow.append(pic);
      });
      content.append(badgeRow);
    }

    if (h1s[1]) {
      const headline = document.createElement('h2');
      headline.className = 'primary-hero-headline';
      headline.textContent = h1s[1].textContent.trim();
      content.append(headline);
    }

    const cta = contentCol.querySelector('a');
    if (cta) {
      const btn = document.createElement('a');
      btn.href = cta.href;
      btn.className = 'primary-hero-cta';
      btn.textContent = cta.textContent.trim();
      content.append(btn);
    }
  }

  block.textContent = '';
  block.append(bg, overlay, content);
  document.body.classList.add('has-primary-hero');
}
