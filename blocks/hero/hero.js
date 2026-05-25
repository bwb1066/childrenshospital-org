/**
 * Loads and decorates the hero block.
 * Expected block table structure:
 * - Row 0: background image (picture element)
 * - Row 1: content (eyebrow p, h1, button-wrapper p)
 *
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: background picture
  const pictureRow = rows[0];
  const picture = pictureRow ? pictureRow.querySelector('picture') : null;

  // Row 1: overlay content
  const contentRow = rows[1];
  const contentCell = contentRow ? contentRow.querySelector(':scope > div') : null;

  // Clear block
  block.textContent = '';

  // Build background layer
  const heroBg = document.createElement('div');
  heroBg.className = 'hero-bg';
  if (picture) heroBg.append(picture);

  // Build gradient overlay
  const heroOverlay = document.createElement('div');
  heroOverlay.className = 'hero-overlay';

  // Build content layer
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  if (contentCell) {
    [...contentCell.children].forEach((el) => {
      // Detect eyebrow paragraph (class or first plain <p> before h1)
      if (el.tagName === 'P' && el.classList.contains('eyebrow')) {
        el.className = 'hero-eyebrow';
        heroContent.append(el);
      } else if (el.tagName === 'H1') {
        heroContent.append(el);
      } else if (el.tagName === 'P' && el.classList.contains('button-wrapper')) {
        // Style the CTA button
        const ctaLink = el.querySelector('a');
        if (ctaLink) {
          ctaLink.classList.add('bch-cta');
          // Remove boilerplate button class if present, keep bch-cta
          ctaLink.classList.remove('button', 'primary', 'secondary', 'accent');
          ctaLink.classList.add('bch-cta');
        }
        heroContent.append(el);
      } else {
        heroContent.append(el);
      }
    });
  }

  block.append(heroBg, heroOverlay, heroContent);
}
