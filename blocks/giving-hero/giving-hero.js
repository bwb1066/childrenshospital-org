export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');

  // Heading
  const h1 = cell?.querySelector('h1');
  const headingEl = document.createElement('h2');
  headingEl.className = 'giving-hero-heading';
  if (h1) {
    const strong = h1.querySelector('strong');
    headingEl.textContent = (strong ?? h1).textContent.trim();
  }

  // Cards from nested giving-cards table
  const table = cell?.querySelector('table');
  const tableRows = table ? [...table.querySelectorAll('tr')] : [];
  // Skip the header row (contains block name "giving-cards")
  const dataRows = tableRows.filter((tr) => {
    const firstCell = tr.querySelector('td');
    return firstCell && firstCell.getAttribute('colspan') !== '2';
  });

  const cards = dataRows.map((tr) => {
    const tds = tr.querySelectorAll('td');
    const picture = tds[0]?.querySelector('picture');
    const contentCell = tds[1];

    const headlineEl = contentCell?.querySelector('strong');
    const ctaLink = contentCell?.querySelector('a');
    const bodyPs = [...(contentCell?.querySelectorAll('p') ?? [])].filter(
      (p) => !p.querySelector('strong') && !p.querySelector('a'),
    );

    const card = document.createElement('div');
    card.className = 'giving-hero-card';

    if (picture) {
      picture.querySelector('img')?.setAttribute('loading', 'lazy');
      const imageDiv = document.createElement('div');
      imageDiv.className = 'giving-hero-card-image';
      imageDiv.append(picture);
      card.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'giving-hero-card-body';

    if (headlineEl) {
      const h = document.createElement('h3');
      h.className = 'giving-hero-card-headline';
      h.textContent = headlineEl.textContent.trim();
      body.append(h);
    }

    bodyPs.forEach((p) => {
      p.className = 'giving-hero-card-text';
      body.append(p);
    });

    if (ctaLink) {
      const cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.className = 'giving-hero-card-cta';
      cta.textContent = ctaLink.textContent.trim();
      body.append(cta);
    }

    card.append(body);
    return card;
  });

  const grid = document.createElement('div');
  grid.className = 'giving-hero-grid';
  cards.forEach((c) => grid.append(c));

  block.innerHTML = '';
  block.append(headingEl, grid);
}
