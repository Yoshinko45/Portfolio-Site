// js/works-extra.js
// 作品モーダルの拡張機能。
// index.html にあるモーダル処理（カードをクリックすると中身を差し込む処理）はそのまま使い、
// それより後に実行されて「ギャラリー」と「状態遷移図」を足す。
//   ・ギャラリー … カードの data-gallery（画像パスを | 区切り）と
//                  data-gallery-captions（説明文を | 区切り）から作る
//   ・遷移図     … カードに data-flow 属性があるときだけ #modal-flow を表示する

(function () {
  const overlay   = document.getElementById('modal-overlay');
  const thumbWrap = document.getElementById('modal-thumb-wrap');
  const gallery   = document.getElementById('modal-gallery');
  const flow      = document.getElementById('modal-flow');

  // 必要な要素が無いページでは何もしない
  if (!overlay || !thumbWrap || !gallery || !flow) return;

  let slides  = [];   // { src, caption } の配列
  let current = 0;    // いま表示しているスライド番号

  // 要素を作るヘルパー
  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) Object.keys(attrs).forEach(k => node.setAttribute(k, attrs[k]));
    return node;
  }

  // 指定番号のスライドを表示する（端まで行ったら反対側へループ）
  function show(i) {
    current = (i + slides.length) % slides.length;
    const s = slides[current];

    const img  = gallery.querySelector('.mg-img');
    const link = gallery.querySelector('.mg-frame');
    img.src  = s.src;
    img.alt  = s.caption || ('screenshot ' + (current + 1));
    link.href = s.src;

    gallery.querySelector('.mg-count').textContent =
      String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    gallery.querySelector('.mg-text').textContent = s.caption;

    gallery.querySelectorAll('.mg-thumb').forEach((t, n) => {
      t.classList.toggle('active', n === current);
    });
  }

  // ギャラリー全体を組み立てる
  function build() {
    gallery.textContent = '';

    // 画像エリア（クリックで原寸画像を別タブで開く）
    const stage = el('div', 'mg-stage');
    const link  = el('a', 'mg-frame', { target: '_blank', rel: 'noopener', title: 'クリックで原寸表示' });
    link.appendChild(el('img', 'mg-img'));
    stage.appendChild(link);

    // 前へ／次へ（2枚以上のときだけ）
    if (slides.length > 1) {
      const prev = el('button', 'mg-nav mg-prev', { type: 'button', 'aria-label': '前の画像' });
      const next = el('button', 'mg-nav mg-next', { type: 'button', 'aria-label': '次の画像' });
      prev.textContent = '<';
      next.textContent = '>';
      prev.addEventListener('click', () => show(current - 1));
      next.addEventListener('click', () => show(current + 1));
      stage.append(prev, next);
    }

    // 説明文
    const caption = el('p', 'mg-caption');
    caption.append(el('span', 'mg-count'), el('span', 'mg-text'));

    gallery.append(stage, caption);

    // サムネイル列
    if (slides.length > 1) {
      const thumbs = el('div', 'mg-thumbs');
      slides.forEach((s, n) => {
        const b = el('button', 'mg-thumb', { type: 'button', 'aria-label': (n + 1) + '枚目を表示' });
        const t = el('img');
        t.src = s.src;
        t.alt = '';
        b.appendChild(t);
        b.addEventListener('click', () => show(n));
        thumbs.appendChild(b);
      });
      gallery.appendChild(thumbs);
    }

    gallery.style.display = 'block';
    show(0);
  }

  // ギャラリーを空にして隠す
  function reset() {
    slides = [];
    gallery.textContent = '';
    gallery.style.display = 'none';
  }

  // カードをクリックしたとき（index.html 側の処理が終わったあとに実行される）
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      // 1) ギャラリー
      const srcs = (card.dataset.gallery || '').split('|').map(s => s.trim()).filter(Boolean);
      if (srcs.length) {
        const caps = (card.dataset.galleryCaptions || '').split('|').map(s => s.trim());
        slides = srcs.map((src, n) => ({ src: src, caption: caps[n] || '' }));
        build();
        // YouTube 動画があるカードは動画を優先して残し、無いときはサムネ画像の代わりにギャラリーを出す
        if (!card.dataset.youtube) thumbWrap.innerHTML = '';
      } else {
        reset();
      }

      // 2) 状態遷移図
      flow.style.display = card.hasAttribute('data-flow') ? 'block' : 'none';
    });
  });

  // 左右キーで画像を切り替える（モーダルが開いていて、ギャラリーがあるときだけ）
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open') || slides.length < 2) return;
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft')  show(current - 1);
  });
})();