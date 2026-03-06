// 星空アニメーション - stars.js

/* =========================================
   流星クラス
========================================= */
class ShootingStar {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.spawn();
  }

  spawn() {
    // 斜め方向: 画面の上端または右上から発生
    const fromRight = Math.random() > 0.45;

    if (fromRight) {
      // 右上寄りから左下へ
      this.x = this.w * 0.4 + Math.random() * this.w * 0.6;
      this.y = Math.random() * this.h * 0.35;
      const angleDeg = Math.random() * 20 + 20; // 20-40°
      const speed = Math.random() * 9 + 9;
      const rad = (angleDeg * Math.PI) / 180;
      this.vx = -Math.cos(rad) * speed;
      this.vy = Math.sin(rad) * speed;
    } else {
      // 左上寄りから右下へ
      this.x = Math.random() * this.w * 0.6;
      this.y = Math.random() * this.h * 0.35;
      const angleDeg = Math.random() * 20 + 20;
      const speed = Math.random() * 9 + 9;
      const rad = (angleDeg * Math.PI) / 180;
      this.vx = Math.cos(rad) * speed;
      this.vy = Math.sin(rad) * speed;
    }

    this.trailLength = Math.random() * 110 + 90;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.55 + 0.35;
    this.phase = 'fadein';
    this.holdFrames = Math.floor(Math.random() * 18 + 12);
    this.timer = 0;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.timer++;

    if (this.phase === 'fadein') {
      this.opacity += 0.12;
      if (this.opacity >= this.maxOpacity) {
        this.opacity = this.maxOpacity;
        this.phase = 'hold';
        this.timer = 0;
      }
    } else if (this.phase === 'hold') {
      if (this.timer >= this.holdFrames) this.phase = 'fadeout';
    } else {
      this.opacity -= 0.065;
      if (this.opacity <= 0) this.dead = true;
    }

    if (
      this.y > this.h + 60 ||
      this.x < -200 ||
      this.x > this.w + 200 ||
      this.y < -60
    ) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.opacity <= 0 || this.dead) return;

    const mag = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const nx = -this.vx / mag;
    const ny = -this.vy / mag;
    const tailX = this.x + nx * this.trailLength;
    const tailY = this.y + ny * this.trailLength;

    const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.55, `rgba(200,220,255,${this.opacity * 0.45})`);
    grad.addColorStop(1, `rgba(255,255,255,${this.opacity})`);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // 先端の輝点
    const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 5);
    glow.addColorStop(0, `rgba(255,255,255,${this.opacity * 0.9})`);
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/* =========================================
   StarField クラス
========================================= */
class StarField {
  constructor() {
    this.canvas = document.getElementById('starfield');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.maxStars = 350;
    this.scrollY = 0;
    this.animationId = null;
    this.lastTime = 0;
    this.frameInterval = 1000 / 30; // 30fps
    this.frameCount = 0;
    this.nextShootingStarAt = this.randomDelay();
    this.init();
  }

  randomDelay() {
    return Math.floor(Math.random() * 160 + 90); // 3〜8秒 @30fps
  }

  init() {
    this.resizeCanvas();
    this.createStars();
    this.bindEvents();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.maxStars; i++) {
      const r = Math.random();
      // 星の色: 白・青白・淡オレンジ
      const color = r < 0.65 ? '#ffffff' : r < 0.82 ? '#b8d4ff' : '#ffd4a0';
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        originalY: 0,
        radius: Math.random() * 1.3 + 0.25,
        alpha: Math.random() * 0.7 + 0.2,
        drift: (Math.random() - 0.5) * 0.015,
        speed: Math.random() * 0.18 + 0.04,
        color,
      });
    }
    this.stars.forEach(s => { s.originalY = s.y; });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createStars();
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.scrollY = window.pageYOffset;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateStars() {
    this.stars.forEach(s => {
      s.alpha += s.drift;
      if (s.alpha > 0.92 || s.alpha < 0.1) s.drift *= -1;
      s.alpha = Math.max(0.1, Math.min(0.92, s.alpha));

      s.x += s.speed * 0.07;
      if (s.x > this.canvas.width + 5) s.x = -5;

      s.y = s.originalY + this.scrollY * 0.07 * s.speed;
      if (s.y > this.canvas.height + 30) {
        s.y = -30;
        s.originalY = s.y - this.scrollY * 0.07 * s.speed;
      }
    });
  }

  updateShootingStars() {
    this.frameCount++;
    if (this.frameCount >= this.nextShootingStarAt) {
      this.shootingStars.push(new ShootingStar(this.canvas.width, this.canvas.height));
      this.frameCount = 0;
      this.nextShootingStarAt = this.randomDelay();
    }
    this.shootingStars = this.shootingStars.filter(s => !s.dead);
    this.shootingStars.forEach(s => s.update());
  }

  drawStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach(s => {
      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // 明るい星だけ光彩
      if (s.alpha > 0.6 && s.radius > 0.8) {
        this.ctx.globalAlpha = s.alpha * 0.22;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    });
  }

  drawShootingStars() {
    this.shootingStars.forEach(s => s.draw(this.ctx));
  }

  animate(currentTime = 0) {
    if (currentTime - this.lastTime >= this.frameInterval) {
      this.updateStars();
      this.updateShootingStars();
      this.drawStars();
      this.drawShootingStars();
      this.lastTime = currentTime;
    }
    this.animationId = requestAnimationFrame(t => this.animate(t));
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  start() {
    if (!this.animationId) this.animate();
  }
}

/* =========================================
   初期化
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('starfield')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.appendChild(canvas);
  }

  const starField = new StarField();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) starField.stop();
    else starField.start();
  });
});
