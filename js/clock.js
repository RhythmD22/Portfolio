function updateClock() {
  const clockElement = document.getElementById('footer-clock');
  if (!clockElement) return;

  const now = new Date();
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  };

  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
  const formattedTime = `${parts.find(p => p.type === 'weekday').value}, ${parts.find(p => p.type === 'month').value} ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}:${parts.find(p => p.type === 'second').value} EST`;

  clockElement.textContent = formattedTime;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock();
