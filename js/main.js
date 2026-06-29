// js/main.js

// ==========================================
// GAME LOADING SCREEN
// ==========================================

// グローバル（またはモジュールスコープ）で宣言
let timer;
let progressBar;
let percentText;
let loadingText;
let loadingScreen;

// ローディング終了処理を共通化
function finishLoading() {
  clearInterval(timer);
  loadingText.textContent = "READY";

  setTimeout(() => {
    loadingScreen.classList.add("glitch");

    setTimeout(() => {
      loadingScreen.classList.add("hide");
      document.body.classList.remove("loading");
      sessionStorage.setItem("portfolioLoaded", "true");

      // フェード完了後に display: none
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 800);
    }, 100);
  }, 200);
}

// 同じセッション中は2回目以降スキップ
loadingScreen = document.getElementById("loading-screen");

if (sessionStorage.getItem("portfolioLoaded")) {
  loadingScreen.style.display = "none";
  document.body.classList.remove("loading");
} else {
  document.body.classList.add("loading");

  progressBar = document.getElementById("loading-progress");
  percentText = document.getElementById("loading-percent");
  loadingText = document.getElementById("loading-text");

  const messages = [
    "Initializing...",
    "Loading Assets...",
    "Loading Scripts...",
    "Loading Portfolio...",
    "Preparing UI...",
    "Complete!"
  ];

  let progress = 0;
  let msgIndex = 0;

  timer = setInterval(() => {
    progress++;

    progressBar.style.width = progress + "%";
    percentText.textContent = progress + "%";

    if (
      progress % 20 === 0 &&
      msgIndex < messages.length - 1
    ) {
      msgIndex++;
      loadingText.textContent = messages[msgIndex];
    }

    if (progress >= 100) {
      finishLoading();
    }
  }, 8);
}

// ==========================================
// ヒーローセクションの星をランダムに配置
// ==========================================
const starContainer = document.getElementById('stars');
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.className = 'star';

  s.style.cssText = `
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation-delay: ${Math.random() * 3}s;
    animation-duration: ${1.5 + Math.random() * 2}s;
    width: ${Math.random() > 0.7 ? 6 : 4}px;
    height: ${Math.random() > 0.7 ? 6 : 4}px;
  `;

  starContainer.appendChild(s);
}

// ==========================================
// 作品フィルタ機能
// ==========================================
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

// ==========================================
// スクロールリベール（Intersection Observer）
// ==========================================
const reveals = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

reveals.forEach(r => io.observe(r));