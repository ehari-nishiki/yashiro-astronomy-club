// メニュー制御 - menu.js

class MenuManager {
  constructor() {
    this.menuToggle = null;
    this.navMenu = null;
    this.menuLinks = [];
    this.currentPage = '';
    
    this.init();
  }
  
  init() {
    // DOMが読み込まれてから実行
    document.addEventListener('DOMContentLoaded', () => {
      this.initElements();
      this.bindEvents();
      this.setActivePage();
    });
  }
  
  initElements() {
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.menuLinks = document.querySelectorAll('.nav-menu a');
    
    // 現在のページを判定
    this.currentPage = this.getCurrentPageName();
  }
  
  bindEvents() {
    // ハンバーガーメニューのトグル
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => {
        this.toggleMenu();
      });
    }
    
    // メニューリンククリック時の処理
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
    
    // 背景クリック時にメニューを閉じる
    document.addEventListener('click', (e) => {
      if (this.navMenu && 
          this.navMenu.classList.contains('active') && 
          !this.navMenu.contains(e.target) && 
          !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu && this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // リサイズ時の処理
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (!this.navMenu) return;
    
    if (this.navMenu.classList.contains('active')) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    if (!this.navMenu) return;
    
    this.navMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // スクロール無効化
    
    // アクセシビリティ
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'true');
    }
  }
  
  closeMenu() {
    if (!this.navMenu) return;
    
    this.navMenu.classList.remove('active');
    document.body.style.overflow = ''; // スクロール復活
    
    // アクセシビリティ
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  
  getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop() || 'index.html';
    return fileName.replace('.html', '') || 'index';
  }
  
  setActivePage() {
    // アクティブページのナビリンクにクラスを追加
    this.menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.replace('.html', '').replace('./', '') || 'index';
        if (linkPage === this.currentPage) {
          link.classList.add('active');
        }
      }
    });
  }
}

// スムーススクロール機能
function enableSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ページトップボタン
function initPageTop() {
  // ページトップボタンを作成
  const pageTopBtn = document.createElement('button');
  pageTopBtn.className = 'page-top-btn';
  pageTopBtn.innerHTML = '↑';
  pageTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--accent);
    color: var(--bg);
    border: none;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(pageTopBtn);
  
  // スクロール位置によって表示/非表示
  let isVisible = false;
  window.addEventListener('scroll', () => {
    const shouldShow = window.pageYOffset > 300;
    
    if (shouldShow && !isVisible) {
      pageTopBtn.style.opacity = '1';
      pageTopBtn.style.visibility = 'visible';
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      pageTopBtn.style.opacity = '0';
      pageTopBtn.style.visibility = 'hidden';
      isVisible = false;
    }
  });
  
  // クリック時の処理
  pageTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// メニューマネージャーのインスタンス化
const menuManager = new MenuManager();

// 追加機能の初期化
document.addEventListener('DOMContentLoaded', () => {
  enableSmoothScroll();
  initPageTop();
});