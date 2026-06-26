// js/main.js

// Stars
const starContainer = document.getElementById('stars');
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left: ${Math.random()*100}%;
    top: ${Math.random()*100}%;
    animation-delay: ${Math.random()*3}s;
    animation-duration: ${1.5+Math.random()*2}s;
    width: ${Math.random()>0.7?6:4}px;
    height: ${Math.random()>0.7?6:4}px;
  `;
  starContainer.appendChild(s);
}

// Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    workCards.forEach(card => {
      const tags = card.dataset.tags.split(' ');
      card.classList.toggle('hidden', f !== 'all' && !tags.includes(f));
    });
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(r => io.observe(r));