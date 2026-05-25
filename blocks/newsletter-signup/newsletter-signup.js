export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 0: [heading cell | body cell]
  const firstRowCells = rows[0]?.querySelectorAll(':scope > div');
  const headingCell = firstRowCells?.[0];
  const bodyCell = firstRowCells?.[1];

  // Middle rows: field labels
  const fieldRows = rows.slice(1, -1);

  // Last row: submit text
  const submitText = rows[rows.length - 1]?.textContent.trim() ?? 'Submit';

  // Content column
  const contentDiv = document.createElement('div');
  contentDiv.className = 'newsletter-signup-content';

  const h2 = headingCell?.querySelector('h2');
  if (h2) {
    const strong = h2.querySelector('strong');
    if (strong) h2.innerHTML = strong.innerHTML;
    h2.className = 'newsletter-signup-heading';
    contentDiv.append(h2);
  }

  const bodyP = bodyCell?.querySelector('p') ?? bodyCell?.firstElementChild;
  if (bodyP) {
    bodyP.className = 'newsletter-signup-body';
    contentDiv.append(bodyP);
  }

  // Form column
  const formDiv = document.createElement('div');
  formDiv.className = 'newsletter-signup-form-col';

  const form = document.createElement('form');
  form.className = 'newsletter-signup-form';
  form.action = '#';
  form.method = 'post';

  fieldRows.forEach((row) => {
    const labelText = row.textContent.trim();
    const required = labelText.includes('*');
    const baseName = labelText.replace(/\s*\*/, '').trim().toLowerCase().replace(/\s+/g, '-');

    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'newsletter-signup-field';

    const label = document.createElement('label');
    label.htmlFor = baseName;
    label.className = 'newsletter-signup-label';
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = baseName === 'email-address' ? 'email' : 'text';
    input.id = baseName;
    input.name = baseName;
    input.className = 'newsletter-signup-input';
    if (required) input.required = true;

    fieldDiv.append(label, input);
    form.append(fieldDiv);
  });

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'newsletter-signup-submit';
  btn.textContent = submitText;
  form.append(btn);

  formDiv.append(form);

  block.innerHTML = '';
  block.append(contentDiv, formDiv);
}
