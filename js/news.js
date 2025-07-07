// ニュース取得・表示機能 - news.js

// Google Sheets設定（後で実際のIDに変更）
const SHEET_CONFIG = {
  SHEET_ID: 'YOUR_SHEET_ID', // 実際のGoogle SheetsのIDに変更
  RANGE: 'od6', // シート1のデフォルトGID
  API_URL: function() {
    return `https://spreadsheets.google.com/feeds/list/${this.SHEET_ID}/${this.RANGE}/public/values?alt=json`;
  }
};

class NewsManager {
  constructor() {
    this.newsContainer = null;
    this.maxItems = 3; // 最新3件を表示
  }
  
  async loadNews() {
    try {
      // ニュースコンテナを取得
      this.newsContainer = document.querySelector('#news-list');
      if (!this.newsContainer) {
        console.warn('ニュースコンテナ (#news-list) が見つかりません');
        return;
      }
      
      // ローディング表示
      this.showLoading();
      
      // Google Sheetsからデータを取得
      const url = SHEET_CONFIG.API_URL();
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // データを整形
      const newsItems = this.parseNewsData(data);
      
      // ニュースを表示
      this.displayNews(newsItems);
      
    } catch (error) {
      console.error('ニュースの読み込みに失敗しました:', error);
      this.showError();
    }
  }
  
  parseNewsData(data) {
    if (!data.feed || !data.feed.entry) {
      throw new Error('データ形式が不正です');
    }
    
    // 最新順に並び替え（日付順）
    const entries = data.feed.entry
      .map(entry => {
        // Google Sheetsのデータ形式に合わせて調整
        // カラム名は「日付」「タイトル」「本文」を想定
        const date = entry.gsx$日付?.$t || entry.gsx$date?.$t || '';
        const title = entry.gsx$タイトル?.$t || entry.gsx$title?.$t || '';
        const body = entry.gsx$本文?.$t || entry.gsx$content?.$t || entry.gsx$body?.$t || '';
        
        return {
          date: date.trim(),
          title: title.trim(),
          body: body.trim()
        };
      })
      .filter(item => item.date && item.title) // 必須項目があるもののみ
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // 新しい順
      .slice(0, this.maxItems); // 最新3件
    
    return entries;
  }
  
  displayNews(newsItems) {
    if (!this.newsContainer) return;
    
    // コンテナをクリア
    this.newsContainer.innerHTML = '';
    
    if (newsItems.length === 0) {
      this.showEmptyState();
      return;
    }
    
    // ニュースアイテムを表示
    newsItems.forEach((item, index) => {
      const listItem = this.createNewsItem(item);
      this.newsContainer.appendChild(listItem);
      
      // アニメーション用にdelay追加
      setTimeout(() => {
        listItem.classList.add('fade-in');
      }, index * 100);
    });
  }
  
  createNewsItem(item) {
    const li = document.createElement('li');
    li.className = 'news-item';
    
    // 日付をフォーマット
    const formattedDate = this.formatDate(item.date);
    
    li.innerHTML = `
      <time datetime="${item.date}">${formattedDate}</time>
      <strong class="news-title">${this.escapeHtml(item.title)}</strong>
      <p class="news-body">${this.escapeHtml(item.body)}</p>
    `;
    
    return li;
  }
  
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // 無効な日付の場合はそのまま返す
      }
      
      // YYYY年MM月DD日形式
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showLoading() {
    if (!this.newsContainer) return;
    this.newsContainer.innerHTML = `
      <li class="loading-state">
        <div class="loading-spinner"></div>
        <p>ニュースを読み込んでいます...</p>
      </li>
    `;
  }
  
  showError() {
    if (!this.newsContainer) return;
    this.newsContainer.innerHTML = `
      <li class="error-state">
        <p>⚠️ ニュースの読み込みに失敗しました</p>
        <button onclick="newsManager.loadNews()" class="btn secondary">再試行</button>
      </li>
    `;
  }
  
  showEmptyState() {
    if (!this.newsContainer) return;
    this.newsContainer.innerHTML = `
      <li class="empty-state">
        <p>現在、表示できるニュースはありません</p>
      </li>
    `;
  }
}

// サンプルデータ（Google Sheetsが設定されていない場合のフォールバック）
const SAMPLE_NEWS = [
  {
    date: '2025-01-15',
    title: '第3回星空観測会を開催しました',
    body: '晴天に恵まれ、多くの方にご参加いただきました。次回は2月を予定しています。'
  },
  {
    date: '2025-01-08',
    title: '新年天文合宿を実施',
    body: '戸隠高原にて新年初の合宿を行い、冬の星座を観測しました。'
  },
  {
    date: '2024-12-25',
    title: '年末天文講座開催のお知らせ',
    body: '12月28日に年末特別講座「2025年の天文現象」を開催します。'
  }
];

// サンプルデータを表示する関数
function displaySampleNews() {
  const newsManager = new NewsManager();
  newsManager.newsContainer = document.querySelector('#news-list');
  if (newsManager.newsContainer) {
    newsManager.displayNews(SAMPLE_NEWS);
  }
}

// グローバルインスタンス
let newsManager;

// ページ読み込み時にニュースを取得
document.addEventListener('DOMContentLoaded', async () => {
  newsManager = new NewsManager();
  
  // Google Sheetsが設定されているかチェック
  if (SHEET_CONFIG.SHEET_ID !== 'YOUR_SHEET_ID') {
    await newsManager.loadNews();
  } else {
    // サンプルデータを表示
    console.log('Google Sheetsが設定されていません。サンプルデータを表示します。');
    displaySampleNews();
  }
});

// デバッグ用：手動でニュースを再読み込み
window.reloadNews = () => {
  if (newsManager) {
    newsManager.loadNews();
  }
};