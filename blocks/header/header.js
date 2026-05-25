import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes the I Want To dropdown
 * @param {Element} btn The dropdown toggle button
 * @param {Element} dropdown The dropdown menu element
 */
function closeDropdown(btn, dropdown) {
  btn.setAttribute('aria-expanded', 'false');
  dropdown.style.display = 'none';
}

/**
 * Opens the I Want To dropdown
 * @param {Element} btn The dropdown toggle button
 * @param {Element} dropdown The dropdown menu element
 */
function openDropdown(btn, dropdown) {
  btn.setAttribute('aria-expanded', 'true');
  dropdown.style.display = 'block';
}

/**
 * Builds the util bar from the first nav section (section 0)
 * @param {Element} section The first section div from the /nav fragment
 * @returns {Element} The util bar element
 */
function buildUtilBar(section) {
  const utilBar = document.createElement('div');
  utilBar.className = 'nav-util-bar';

  const inner = document.createElement('div');
  inner.className = 'nav-util-inner';

  // Logo
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'nav-util-logo';
  logoLink.setAttribute('aria-label', "Boston Children's Hospital home");
  const logoImg = document.createElement('img');
  logoImg.src = '/icons/bch-logo-white.svg';
  logoImg.alt = "Boston Children's Hospital";
  logoImg.width = 180;
  logoImg.height = 60;
  logoLink.append(logoImg);

  // Actions wrapper
  const actions = document.createElement('div');
  actions.className = 'nav-util-actions';

  // Globe SVG for external/international links
  const globeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  // Caret SVG for dropdown
  const caretSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

  // Parse util items from UL
  const ul = section.querySelector('ul');
  if (ul) {
    [...ul.children].forEach((li) => {
      const link = li.querySelector('a');
      const subUl = li.querySelector('ul');

      if (subUl) {
        // "I Want To..." dropdown
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-util-dropdown-wrapper';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-util-pill nav-util-dropdown-btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-haspopup', 'true');

        // Text node: strip sub-elements for the label
        const labelText = [...li.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join('');
        btn.innerHTML = `<span>${labelText || 'I Want To...'}</span>${caretSvg}`;

        const dropdown = document.createElement('ul');
        dropdown.className = 'nav-util-dropdown';
        dropdown.style.display = 'none';
        dropdown.setAttribute('role', 'menu');

        [...subUl.children].forEach((subLi) => {
          const subLink = subLi.querySelector('a');
          if (subLink) {
            const item = document.createElement('li');
            item.setAttribute('role', 'none');
            const a = document.createElement('a');
            a.href = subLink.href;
            a.textContent = subLink.textContent;
            a.setAttribute('role', 'menuitem');
            if (subLink.target) a.target = subLink.target;
            item.append(a);
            dropdown.append(item);
          }
        });

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            closeDropdown(btn, dropdown);
          } else {
            openDropdown(btn, dropdown);
          }
        });

        wrapper.append(btn, dropdown);
        actions.append(wrapper);
      } else if (link) {
        const text = link.textContent.trim();
        const { href } = link;
        const target = link.getAttribute('target');

        // Donate gets different treatment
        if (text === 'Donate') {
          const donateLink = document.createElement('a');
          donateLink.href = href;
          donateLink.className = 'nav-util-donate';
          donateLink.textContent = text;
          if (target) donateLink.target = target;
          actions.append(donateLink);
        } else {
          // Regular pill with globe icon
          const pillLink = document.createElement('a');
          pillLink.href = href;
          pillLink.className = 'nav-util-pill';
          pillLink.innerHTML = `<span>${text}</span>${globeSvg}`;
          if (target) pillLink.target = target;
          actions.append(pillLink);
        }
      }
    });
  }

  inner.append(logoLink, actions);
  utilBar.append(inner);
  return utilBar;
}

/**
 * Builds the main nav bar from the second nav section (section 1)
 * @param {Element} section The second section div from the /nav fragment
 * @returns {Element} The main nav bar element
 */
function buildMainBar(section) {
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';

  const inner = document.createElement('div');
  inner.className = 'nav-main-inner';

  const navList = document.createElement('ul');
  navList.className = 'nav-list';

  const ul = section.querySelector('ul');
  if (ul) {
    [...ul.children].forEach((li) => {
      const link = li.querySelector('a');
      if (link) {
        const item = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        if (link.target) a.target = link.target;
        item.append(a);
        navList.append(item);
      }
    });
  }

  // Search button
  const searchBtn = document.createElement('button');
  searchBtn.type = 'button';
  searchBtn.className = 'nav-search';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = '<img src="/icons/search.svg" alt="" width="20" height="20" aria-hidden="true">';

  inner.append(navList, searchBtn);
  mainBar.append(inner);
  return mainBar;
}

/**
 * Builds and attaches the hamburger button to the nav
 * @param {Element} nav The nav element
 * @param {Element} navList The nav-list element (main links)
 * @returns {Element} The hamburger button element
 */
function buildHamburger(nav, navList) {
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'nav-list');
  hamburger.innerHTML = '<span class="nav-hamburger-icon" aria-hidden="true"></span>';

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded ? '' : 'hidden';
    navList.hidden = expanded;
  });

  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      nav.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation');
      document.body.style.overflowY = '';
      navList.hidden = false;
    } else {
      navList.hidden = true;
    }
  });

  return hamburger;
}

/**
 * Loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';

  const sections = fragment ? [...fragment.children] : [];
  const utilSection = sections[0];
  const mainSection = sections[1];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('aria-expanded', 'false');

  const utilBar = utilSection ? buildUtilBar(utilSection) : document.createElement('div');
  const mainBar = mainSection ? buildMainBar(mainSection) : document.createElement('div');

  // Get nav-list for hamburger control
  const navList = mainBar.querySelector('.nav-list');

  // Build hamburger and place it inside the main bar's inner div
  const hamburger = buildHamburger(nav, navList);
  const mainInner = mainBar.querySelector('.nav-main-inner');
  mainInner.prepend(hamburger);

  // On mobile, hide navList by default
  if (!isDesktop.matches && navList) navList.hidden = true;

  nav.append(utilBar, mainBar);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Close I Want To dropdown on Escape or outside click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openBtn = block.querySelector('.nav-util-dropdown-btn[aria-expanded="true"]');
      if (openBtn) {
        const openDropdownEl = openBtn.nextElementSibling;
        closeDropdown(openBtn, openDropdownEl);
        openBtn.focus();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-util-dropdown-wrapper')) {
      const openBtn = block.querySelector('.nav-util-dropdown-btn[aria-expanded="true"]');
      if (openBtn) {
        const openDropdownEl = openBtn.nextElementSibling;
        closeDropdown(openBtn, openDropdownEl);
      }
    }
  });
}
