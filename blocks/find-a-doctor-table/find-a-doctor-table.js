const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

export default function decorate(block) {
  // Each row is a field; only the first cell carries the value (second cell may be author notes)
  const rows = [...block.querySelectorAll(':scope > div')];
  const cell = (i) => rows[i]?.querySelector(':scope > div')?.textContent.trim();

  const heading = cell(0) ?? 'Find a Doctor';
  const subtitle = cell(1) ?? '';
  const label = cell(2) ?? 'Search by Name';
  const placeholder = cell(3) ?? 'Enter provider name';
  const btnText = cell(4) ?? 'Find a Doctor';

  const uid = 'find-a-doctor-input';

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'find-a-doctor-inner';

  const h2 = document.createElement('h2');
  h2.className = 'find-a-doctor-title';
  h2.textContent = heading;
  inner.append(h2);

  if (subtitle) {
    const sub = document.createElement('p');
    sub.className = 'find-a-doctor-subtitle';
    sub.textContent = subtitle;
    inner.append(sub);
  }

  const form = document.createElement('form');
  form.className = 'find-a-doctor-form';
  form.action = 'https://www.childrenshospital.org/find-a-doctor';
  form.method = 'get';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = uid;
  labelEl.className = 'find-a-doctor-label';
  labelEl.textContent = label;

  const row = document.createElement('div');
  row.className = 'find-a-doctor-row';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'find-a-doctor-input-wrap';
  inputWrap.innerHTML = SEARCH_ICON;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = uid;
  input.name = 'name';
  input.placeholder = placeholder;
  input.className = 'find-a-doctor-input';
  input.autocomplete = 'off';
  inputWrap.append(input);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'find-a-doctor-btn';
  btn.textContent = btnText;

  row.append(inputWrap, btn);
  form.append(labelEl, row);
  inner.append(form);
  block.append(inner);
}
