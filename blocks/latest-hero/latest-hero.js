export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  const strong = cell?.querySelector('strong');

  const heading = document.createElement('h2');
  heading.className = 'latest-hero-heading';
  heading.textContent = (strong ?? cell)?.textContent.trim() ?? '';

  block.innerHTML = '';
  block.append(heading);
}
