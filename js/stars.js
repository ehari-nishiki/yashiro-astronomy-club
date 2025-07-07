// 星空アニメーション - stars.js
class StarField {
  constructor() {
    this.canvas = document.getElementById('starfield');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.maxStars = 400; // パフォーマンス考慮で500以下
    this.scrollY = 0;
    this.animationId = null;
    this.lastTime = 0;
    this.targetFPS = 30; // 60fps不要、30fpsで十分
    this.frameInterval = 1000 / this.targetFPS;
    
    this.init();
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
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        originalY: 0
      });
    }
    
    // originalYを設定
    this.stars.forEach(star => {
      star.originalY = star.y;
    });
  }
  
  bindEvents() {
    // リサイズイベント
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createStars();
    });
    
    // スクロールイベント（パララックス用）
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
    this.stars.forEach(star => {
      // ゆっくりとした瞬き効果
      star.alpha += (Math.random() - 0.5) * 0.02;
      star.alpha = Math.max(0.1, Math.min(1, star.alpha));
      
      // わずかな移動
      star.x += star.speed * 0.1;
      if (star.x > this.canvas.width + 10) {
        star.x = -10;
      }
      
      // パララックス効果
      star.y = star.originalY + (this.scrollY * 0.1 * star.speed);
      
      // 画面外に出た星を再配置
      if (star.y > this.canvas.height + 50) {
        star.y = -50;
        star.originalY = star.y - (this.scrollY * 0.1 * star.speed);
      }
    });
  }
  
  drawStars() {
    // 背景をクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 星を描画
    this.stars.forEach(star => {
      this.ctx.save();
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // より明るい星には微かな光彩効果
      if (star.alpha > 0.7) {
        this.ctx.globalAlpha = star.alpha * 0.3;
        this.ctx.fillStyle = '#ffd966';
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }
  
  animate(currentTime = 0) {
    // FPS制限
    if (currentTime - this.lastTime >= this.frameInterval) {
      this.updateStars();
      this.drawStars();
      this.lastTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  // アニメーション停止（必要に応じて）
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  // アニメーション再開
  start() {
    if (!this.animationId) {
      this.animate();
    }
  }
}

// ページ読み込み時に星空アニメーションを開始
document.addEventListener('DOMContentLoaded', () => {
  // キャンバス要素を作成
  if (!document.getElementById('starfield')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    document.body.appendChild(canvas);
  }
  
  // 星空アニメーション開始
  const starField = new StarField();
  
  // ページの可視性が変わった時の処理（パフォーマンス最適化）
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      starField.stop();
    } else {
      starField.start();
    }
  });
});