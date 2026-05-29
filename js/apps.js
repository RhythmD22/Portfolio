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
        const cardIndex = Array.from(cards).indexOf(element);

        // Exact stride calculation for mobile:
        // 200px (flex-basis) + 30px (total padding) + 2px (total border) + 10px (gap) = 242px
        const stride = 242;
        const nudge = 16;

        // Calculate the final scroll position based on the card's index and the calculated stride.
        // This ensures the expanded card is perfectly centered regardless of its index.
        const scrollOffset = (cardIndex * stride) + nudge;

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
