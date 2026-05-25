export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row with no picture and no link is treated as a section heading
  let headingEl = null;
  let cardRows = rows;

  const firstCell = rows[0]?.querySelector(':scope > div');
  if (firstCell && !firstCell.querySelector('picture') && !firstCell.querySelector('a')) {
    const h = firstCell.querySelector('h2, h3') ?? firstCell;
    headingEl = document.createElement('h2');
    headingEl.className = 'giving-cards-heading';
    headingEl.textContent = h.textContent.trim();
    cardRows = rows.slice(1);
  }

  const cards = cardRows.map((row) => {
    const cell = row.querySelector(':scope > div');
    const picture = cell?.querySelector('picture');
    const headline = cell?.querySelector('h2, h3');
    const ctaLink = cell?.querySelector('a');
    const bodyPs = [...(cell?.querySelectorAll('p') ?? [])].filter(
      (p) => !p.querySelector('picture') && !p.querySelector('a'),
    );

    const card = document.createElement('div');
    card.className = 'giving-card';

    if (picture) {
      picture.querySelector('img')?.setAttribute('loading', 'lazy');
      const imageDiv = document.createElement('div');
      imageDiv.className = 'giving-card-image';
      imageDiv.append(picture);
      card.append(imageDiv);
    }

    const body = document.createElement('div');
    body.className = 'giving-card-body';

    if (headline) {
      const h = document.createElement('h3');
      h.className = 'giving-card-headline';
      h.textContent = headline.textContent.trim();
      body.append(h);
    }

    bodyPs.forEach((p) => {
      p.className = 'giving-card-text';
      body.append(p);
    });

    if (ctaLink) {
      const cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.className = 'giving-card-cta';
      cta.textContent = ctaLink.textContent.trim();
      body.append(cta);
    }

    card.append(body);
    return card;
  });

  const grid = document.createElement('div');
  grid.className = 'giving-cards-grid';
  cards.forEach((c) => grid.append(c));

  block.innerHTML = '';
  if (headingEl) block.append(headingEl);
  block.append(grid);
}
