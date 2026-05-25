export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  const bar = document.createElement('div');
  bar.className = 'csc-bar';

  cells.forEach((cell) => {
    const group = document.createElement('div');
    group.className = 'csc-group';

    const allPs = [...cell.querySelectorAll('p')];
    const isFollowUs = allPs.some(
      (p) => !p.querySelector('picture') && p.textContent.trim().toLowerCase().startsWith('follow'),
    );

    if (isFollowUs) {
      group.classList.add('csc-group--social');

      const labelP = allPs.find((p) => !p.querySelector('picture'));
      const label = document.createElement('span');
      label.className = 'csc-follow-label';
      label.textContent = labelP?.textContent.trim() ?? 'Follow Us';
      group.append(label);

      allPs
        .filter((p) => p.querySelector('picture'))
        .forEach((p) => {
          const pic = p.querySelector('picture');
          if (!pic) return;
          pic.querySelector('img')?.setAttribute('loading', 'lazy');
          group.append(pic);
        });
    } else {
      const iconPic = allPs.find((p) => p.querySelector('picture'))?.querySelector('picture');
      if (iconPic) {
        iconPic.querySelector('img')?.setAttribute('loading', 'lazy');
        const iconDiv = document.createElement('div');
        iconDiv.className = 'csc-icon';
        iconDiv.append(iconPic);
        group.append(iconDiv);
      }

      const textP = allPs.find((p) => !p.querySelector('picture') && p.innerHTML.trim());
      if (textP) {
        const textDiv = document.createElement('div');
        textDiv.className = 'csc-text';
        textDiv.innerHTML = textP.innerHTML;
        group.append(textDiv);
      }
    }

    bar.append(group);
  });

  block.innerHTML = '';
  block.append(bar);
}
