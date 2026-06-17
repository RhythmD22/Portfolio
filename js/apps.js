function expandCard(el) {
  const cards = document.querySelectorAll('.app-card');
  const wasExpanded = el.classList.contains('expanded');
  const container = document.querySelector('.card-container');
  const isMobile = window.innerWidth <= 768;

  cards.forEach(c => {
    c.classList.remove('expanded');
    c.classList.remove('show-page-2');
    const arrow = c.querySelector('.pixel-arrow');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  });

  if (!wasExpanded) {
    el.classList.add('expanded');
    if (isMobile) {
      container.style.paddingRight = '140px';
      setTimeout(() => {
        const idx = Array.from(cards).indexOf(el);
        const scrollOffset = (idx * 242) + 16;
        container.scrollTo({ left: scrollOffset, behavior: 'smooth' });
      }, 100);
    } else {
      container.style.paddingRight = 'calc(50vw - 300px)';
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
    }
  } else {
    container.style.paddingRight = isMobile ? '20px' : '100px';
  }
}

function toggleArchibaldPage(event, btn) {
  event.stopPropagation();
  const card = btn.closest('.app-card');
  const isPage2Active = card.classList.contains('show-page-2');

  card.classList.toggle('show-page-2', !isPage2Active);

  btn.style.transform = isPage2Active ? 'rotate(0deg)' : 'rotate(180deg)';
}