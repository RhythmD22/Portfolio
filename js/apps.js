function expandCard(el) {
  const cards = document.querySelectorAll('.app-card');
  const wasExpanded = el.classList.contains('expanded');
  const container = document.querySelector('.card-container');
  const isMobile = window.innerWidth <= 768;

  cards.forEach(c => c.classList.remove('expanded'));

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