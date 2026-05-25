export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');

  const picture = cell?.querySelector('picture');
  const h2 = cell?.querySelector('h2');
  const ctaLink = cell?.querySelector('a');
  const bodyPs = [...(cell?.querySelectorAll('p') ?? [])].filter(
    (p) => !p.querySelector('picture') && !p.querySelector('a'),
  );

  // Content column (left)
  const contentDiv = document.createElement('div');
  contentDiv.className = 'programs-hero-content';

  if (h2) {
    const strong = h2.querySelector('strong');
    if (strong) h2.innerHTML = strong.innerHTML;
    h2.className = 'programs-hero-headline';
    contentDiv.append(h2);
  }

  bodyPs.forEach((p) => {
    p.className = 'programs-hero-body';
    contentDiv.append(p);
  });

  if (ctaLink) {
    const cta = document.createElement('a');
    cta.href = ctaLink.href;
    cta.className = 'programs-hero-cta';
    cta.textContent = ctaLink.textContent.trim();
    contentDiv.append(cta);
  }

  // Image column (right)
  const imageDiv = document.createElement('div');
  imageDiv.className = 'programs-hero-image';
  if (picture) {
    picture.querySelector('img')?.setAttribute('loading', 'lazy');
    imageDiv.append(picture);
  }

  block.innerHTML = '';
  block.append(contentDiv, imageDiv);
}
