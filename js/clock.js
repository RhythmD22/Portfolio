function updateClock() {
  const el = document.getElementById('footer-clock');
  if (!el) return;

  const now = new Date();
  const isDay = now.getHours() >= 6 && now.getHours() < 18;
  const sun = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; transform: translateY(-1px);"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2m-13.66 5.66-1.41 1.41m12.73-12.73-1.41 1.41"/></svg>`;
  const moon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; transform: translateY(-1px);"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;

  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/New_York' };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
  const find = type => parts.find(p => p.type === type).value;

  el.innerHTML = `${isDay ? sun : moon} ${find('weekday')}, ${find('month')} ${find('day')} ${find('hour')}:${find('minute')}:${find('second')} EST`;
}

setInterval(updateClock, 1000);
updateClock();