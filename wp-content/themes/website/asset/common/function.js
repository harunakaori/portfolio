const hamburger = document.querySelector('.hamburger');
// クラス名を変えず、既存の .nav-lower を操作する
const nav = document.querySelector('.nav-lower');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('active'); // nav-lowerにactiveクラスをつけ外しする
});



document.addEventListener('DOMContentLoaded', () => {
  // 💡 1. すべての path要素を取得
  const paths = document.querySelectorAll('.society-map path');

  // 💡 2. 修正: すべての「IDを持つ学会情報グループ」の要素を取得
  // IDが"society-item-"で始まるsociety-info直下のすべてのdivを取得します。
  const societyGroups = document.querySelectorAll('.society-info > div[id^="society-item-"]');

  // 💡 3. すべての path要素にイベントリスナーを設定
  paths.forEach(path => {
    path.addEventListener('click', function () {
      // クリックされたpathに対応する society-itemのIDを取得
      const targetId = this.getAttribute('data-target-id');
      if (!targetId) return; // IDがない場合は何もしない

      // --- 全ての状態をリセット（排他的表示のため） ---

      // 修正: 全ての「学会情報グループ」から activeクラスを削除
      societyGroups.forEach(item => {
        item.classList.remove('active');
      });

      // 全ての path要素から activeクラスを削除
      paths.forEach(p => {
        p.classList.remove('active');
      });

      // --- クリックされた要素の表示を切り替え ---

      // 対応する society-item要素（グループ）を取得
      const targetItem = document.getElementById(targetId);

      if (targetItem) {
        // targetItemを表示状態にする
        targetItem.classList.add('active');
        // クリックされた path要素にも activeクラスを付与
        this.classList.add('active');
      }
    });
  });

  // --- (オプション) society-info全体を非表示にしたい場合 ---
  // もし、society-itemが一つも activeでないときに society-info全体を非表示にする
  // などの制御が必要な場合は、別途ロジックを追加してください。
});











const path = document.querySelector('#scrollLine path');
const pathLength = path.getTotalLength();

path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;

let targetOffset = pathLength;
let currentOffset = pathLength;

function update() {
  currentOffset += (targetOffset - currentOffset) * 0.1;
  path.style.strokeDashoffset = currentOffset;
  requestAnimationFrame(update);
}

window.addEventListener('scroll', () => {
  const section = document.querySelector('#research');
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  let visiblePercent = 0;
  if (rect.top < windowHeight && rect.bottom > 0) {
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    visiblePercent = visibleHeight / rect.height;
    visiblePercent = Math.min(Math.max(visiblePercent, 0), 1);
  }

  targetOffset = pathLength * (1 - visiblePercent);
});

update();







(() => {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  let W, H;
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ▼▼▼ 設定変更エリア ▼▼▼ 
     スマホとPCで数と距離を切り替えます
  */
  // 画面幅が768px未満ならスマホと判定
  const isSmall = window.innerWidth < 768;

  // パーティクルの数 (スマホなら35個、PCなら80個)
  const PARTICLE_COUNT = isSmall ? 35 : 80;

  // 線がつながる距離 (スマホなら短く90、PCなら150)
  const CONNECT_DISTANCE = isSmall ? 90 : 150;

  const SPEED = 0.18;
  const PARTICLE_SIZE = 2;
  const BG_FADE = 0.1;
  /* ▲▲▲ 設定変更エリアここまで ▲▲▲ */

  class Particle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      this.vx += (Math.random() - 0.5) * 0.002;
      this.vy += (Math.random() - 0.5) * 0.002;

      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }

    draw() {
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, PARTICLE_SIZE * 2
      );
      grad.addColorStop(0, "rgba(100,150,255,1)");
      grad.addColorStop(1, "rgba(30,80,200,1)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DISTANCE) {
          ctx.strokeStyle = `rgba(50,90,200,${1 - dist / CONNECT_DISTANCE})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.fillStyle = `rgba(255,255,255,${BG_FADE})`;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => p.update());
    drawLines();
    particles.forEach(p => p.draw());

    requestAnimationFrame(loop);
  }
  loop();
})();


const swiper = new Swiper(".society-swiper", {
  loop: false,              // ← 左端に固定したいなら loop はオフ
  speed: 700,
  slidesPerView: 1.2,
  spaceBetween: 40,
  centeredSlides: false,    // ← 必須：左寄せ表示

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    768: {
      slidesPerView: 2.2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});