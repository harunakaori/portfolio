document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. timeline 表示アニメーション
  ===================================================== */
  (() => {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(timeline);
  })();


  /* =====================================================
     2. SVG パス描画アニメーション
  ===================================================== */
  (() => {
    const path = document.querySelector('#drawingPath');
    const section = document.querySelector('#research-section');
    if (!path || !section) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    let target = length;
    let current = length;
    let active = false;

    const observer = new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(section);

    window.addEventListener('scroll', () => {
      if (!active) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const ratio = Math.min(Math.max(visible / rect.height, 0), 1);
      target = length * (1 - ratio);
    });

    const loop = () => {
      if (active) {
        current += (target - current) * 0.1;
        path.style.strokeDashoffset = current;
      }
      requestAnimationFrame(loop);
    };

    loop();
  })();

  /* =====================================================
   パーティクル Canvas（背景固定・レイアウト非干渉版）
===================================================== */
  (() => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    let active = false;

    /* ---------- resize（親要素基準） ---------- */
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      W = parent.clientWidth;
      H = parent.clientHeight;

      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    /* ---------- IntersectionObserver ---------- */
    const observer = new IntersectionObserver(
      entries => {
        active = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    /* ---------- particles ---------- */
    const COUNT = window.innerWidth < 768 ? 40 : 80;
    const MAX_DIST = 120;
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.18;
        this.vy = (Math.random() - 0.5) * 0.18;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;
      }

      draw() {
        ctx.fillStyle = 'rgba(80,120,220,1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) {
      particles.push(new Particle());
    }

    /* ---------- loop ---------- */
    const loop = () => {
      requestAnimationFrame(loop);
      if (!active) return;

      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => p.update());

      // 線
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(80,120,220,${1 - dist / MAX_DIST})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 点
      particles.forEach(p => p.draw());
    };

    loop();
  })();


  /* =====================================================
     4. タブ切り替え
  ===================================================== */
  (() => {
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filter = tab.dataset.filter;

        cards.forEach(card => {
          const show =
            filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  })();

});
