function parseColumn(imgCell, contentCell) {
  const picture = imgCell?.querySelector('picture');
  const allEls = [...(contentCell?.querySelectorAll('h4, p') ?? [])];

  // All paragraphs that contain a link (title or CTA)
  const linkPs = allEls.filter((el) => el.querySelector('a'));
  const titleEl = linkPs.length > 1 ? linkPs[0] : null;
  const ctaEl = linkPs[linkPs.length - 1] ?? null;

  const titleIdx = titleEl ? allEls.indexOf(titleEl) : allEls.indexOf(ctaEl);

  // Column header: h4, or first <p><strong> without a link, before the title
  let header = null;
  const h4 = contentCell?.querySelector('h4');
  if (h4) {
    header = h4.textContent.trim();
  } else {
    const headerEl = allEls.find(
      (el, i) => i < titleIdx && el.tagName === 'P' && el.querySelector('strong') && !el.querySelector('a'),
    );
    if (headerEl) header = headerEl.querySelector('strong').textContent.trim();
  }

  // Plain paragraphs before title → tag (first) and date (second)
  const plainBeforeTitle = allEls.filter(
    (el, i) => i < titleIdx && el.tagName === 'P' && !el.querySelector('strong') && !el.querySelector('a') && !el.querySelector('em'),
  );
  const tag = plainBeforeTitle[0]?.textContent.trim() ?? null;
  const date = plainBeforeTitle[1]?.textContent.trim() ?? null;

  // Title link
  const titleLink = titleEl?.querySelector('a') ?? null;

  // Subtitle: <p><strong> without link, AFTER title
  const subtitleEl = allEls.find(
    (el, i) => i > titleIdx && el.tagName === 'P' && el.querySelector('strong') && !el.querySelector('a'),
  );
  const subtitle = subtitleEl?.textContent.trim() ?? null;

  // Body: plain <p> after title, before CTA
  const ctaIdx = ctaEl ? allEls.indexOf(ctaEl) : allEls.length;
  const bodyEl = allEls.find(
    (el, i) => i > titleIdx && i < ctaIdx && el.tagName === 'P' && !el.querySelector('strong') && !el.querySelector('a') && !el.querySelector('em'),
  );
  const body = bodyEl?.textContent.trim() ?? null;

  // Attribution: <p><em>
  const attribution = contentCell?.querySelector('p > em')?.textContent.trim() ?? null;

  // CTA link
  const ctaLink = ctaEl?.querySelector('a') ?? null;

  return { picture, header, tag, date, titleLink, subtitle, body, attribution, ctaLink };
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'latest-cards-grid';

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    const { picture, header, tag, date, titleLink, subtitle, body, attribution, ctaLink } = parseColumn(cells[0], cells[1]);

    const col = document.createElement('div');
    col.className = 'latest-card-col';

    if (header) {
      const h = document.createElement('h3');
      h.className = 'latest-card-header';
      h.textContent = header;
      col.append(h);
    }

    const card = document.createElement('div');
    card.className = 'latest-card';

    if (picture) {
      picture.querySelector('img')?.setAttribute('loading', 'lazy');
      const imageDiv = document.createElement('div');
      imageDiv.className = 'latest-card-image';
      imageDiv.append(picture);
      card.append(imageDiv);
    }

    const content = document.createElement('div');
    content.className = 'latest-card-content';

    if (tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'latest-card-tag';
      tagEl.textContent = tag;
      content.append(tagEl);
    }

    if (date) {
      const dateEl = document.createElement('p');
      dateEl.className = 'latest-card-date';
      dateEl.textContent = date;
      content.append(dateEl);
    }

    if (titleLink) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.className = 'latest-card-title';
      a.textContent = titleLink.textContent.trim();
      content.append(a);
    }

    if (subtitle) {
      const sub = document.createElement('p');
      sub.className = 'latest-card-subtitle';
      sub.textContent = subtitle;
      content.append(sub);
    }

    if (body) {
      const bodyEl = document.createElement('p');
      bodyEl.className = 'latest-card-body';
      bodyEl.textContent = body;
      content.append(bodyEl);
    }

    if (attribution) {
      const attr = document.createElement('p');
      attr.className = 'latest-card-attribution';
      attr.textContent = attribution;
      content.append(attr);
    }

    card.append(content);
    col.append(card);

    if (ctaLink) {
      const cta = document.createElement('a');
      cta.href = ctaLink.href;
      cta.className = 'latest-card-cta';
      cta.textContent = ctaLink.textContent.trim();
      col.append(cta);
    }

    grid.append(col);
  });

  block.innerHTML = '';
  block.append(grid);
}
