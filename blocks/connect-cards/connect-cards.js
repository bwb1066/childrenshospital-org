const CARD_COLORS = [
  'var(--bch-secondary)',
  'var(--bch-primary)',
  'var(--bch-pink)',
];

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const cards = rows.map((row, i) => {
    const cell = row.querySelector(':scope > div');
    const picture = cell?.querySelector('picture');
    const link = cell?.querySelector('a');

    const card = document.createElement('a');
    card.href = link?.href ?? '#';
    card.className = 'connect-card';
    card.style.backgroundColor = CARD_COLORS[i % CARD_COLORS.length];
    card.setAttribute('aria-label', link?.textContent.trim() ?? '');

    const iconDiv = document.createElement('div');
    iconDiv.className = 'connect-card-icon';
    if (picture) {
      picture.querySelector('img')?.setAttribute('loading', 'lazy');
      iconDiv.append(picture);
    }

    const label = document.createElement('div');
    label.className = 'connect-card-label';
    label.textContent = link?.textContent.trim() ?? '';

    card.append(iconDiv, label);
    return card;
  });

  const grid = document.createElement('div');
  grid.className = 'connect-cards-grid';
  cards.forEach((c) => grid.append(c));

  block.innerHTML = '';
  block.append(grid);
}
