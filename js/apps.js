function expandCard(element) {
  const cards = document.querySelectorAll('.app-card');
  const isExpanded = element.classList.contains('expanded');
  const container = document.querySelector('.card-container');
  const isMobile = window.innerWidth <= 768;

  cards.forEach(card => {
    card.classList.remove('expanded');
  });

  if (!isExpanded) {
    element.classList.add('expanded');

    if (isMobile) {
      // Mobile-specific padding and snapping
      // Increased paddingRight to 100px to ensure the last card has room to snap/nudge
      container.style.paddingRight = '140px';

      setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const cardRect = element.getBoundingClientRect();
        const expandedWidth = window.innerWidth - 40;

        // Mobile-only nudge to prevent right-side cutoff
        const nudge = 16;
        const currentCardLeftRelative = container.scrollLeft + (cardRect.left - containerRect.left);
        const scrollOffset = currentCardLeftRelative - (containerRect.width / 2) + (expandedWidth / 2) + nudge;

        container.scrollTo({
          left: scrollOffset,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // ORIGINAL DESKTOP LOGIC (Unchanged)
      container.style.paddingRight = 'calc(50vw - 300px)';

      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
  } else {
    // Reset padding when collapsing
    container.style.paddingRight = isMobile ? '20px' : '100px';
  }
}
