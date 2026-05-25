import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function buildNavSection(section) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-nav-section';

  const inner = document.createElement('div');
  inner.className = 'footer-nav-inner';

  const awards = document.createElement('div');
  awards.className = 'footer-awards';
  inner.append(awards);

  const cells = section.querySelectorAll('.columns > div > div');
  cells.forEach((cell, idx) => {
    if (idx === 0) {
      cell.querySelectorAll('picture').forEach((pic) => {
        pic.querySelector('img')?.setAttribute('loading', 'lazy');
        awards.append(pic);
      });
      return;
    }

    const col = document.createElement('div');
    col.className = 'footer-nav-col';

    const groupLi = cell.querySelector('li');
    if (!groupLi) return;

    const titleEl = groupLi.querySelector(':scope > p');
    if (titleEl) {
      const title = document.createElement('p');
      title.className = 'footer-nav-col-title';
      title.textContent = titleEl.textContent.trim();
      col.append(title);
    }

    const linksUl = groupLi.querySelector(':scope > ul');
    if (linksUl) {
      const list = document.createElement('ul');
      list.className = 'footer-nav-col-list';
      linksUl.querySelectorAll('a').forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        if (link.target) {
          a.target = link.target;
          a.rel = 'noopener noreferrer';
        }
        li.append(a);
        list.append(li);
      });
      col.append(list);
    }

    inner.append(col);
  });

  wrapper.append(inner);
  return wrapper;
}

function buildLegalBar() {
  const legal = document.createElement('div');
  legal.className = 'footer-legal';

  const inner = document.createElement('div');
  inner.className = 'footer-legal-inner';

  const copy = document.createElement('p');
  copy.textContent = `© 2005 - ${new Date().getFullYear()} Boston Children's Hospital. All rights reserved.`;
  inner.append(copy);

  const also = document.createElement('p');
  also.innerHTML = '<strong>Also of Interest</strong>&nbsp;&nbsp;'
    + '<a href="https://www.childrenshospital.org/find-a-doctor">Find a Doctor</a>&nbsp;&nbsp;'
    + '<a href="https://www.childrenshospital.org/video-library">Video Library</a>&nbsp;&nbsp;'
    + '<a href="https://www.childrenshospital.org/patients-families/about-boston-childrens/second-opinion-program">Online Second Opinions</a>';
  inner.append(also);

  const version = document.querySelector('meta[name="version"]')?.content
    ?? document.querySelector('meta[name="build"]')?.content ?? null;
  if (version) {
    const versionP = document.createElement('p');
    versionP.className = 'footer-legal-version';
    versionP.innerHTML = `<strong>Version:</strong> ${version}`;
    inner.append(versionP);
  }

  legal.append(inner);
  return legal;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const sections = fragment ? [...fragment.children] : [];
  if (sections[0]) block.append(buildNavSection(sections[0]));

  block.append(buildLegalBar());
}
