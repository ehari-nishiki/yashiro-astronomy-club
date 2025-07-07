# 屋代高校 天文班 Official Web

屋代高等学校天文班の公式Webサイトです。GitHub Pages での公開を想定した静的サイトとして構築されています。

## 🌟 特徴

- **レスポンシブ対応**: モバイル・タブレット・PCに対応
- **ダークテーマ**: 星空をイメージした美しいダークデザイン
- **星空アニメーション**: Canvas を使用したリアルタイム星空背景
- **Google Sheets 連携**: ニュース欄の動的更新機能
- **アクセシビリティ対応**: スクリーンリーダー対応、キーボードナビゲーション

## 📁 ディレクトリ構成

```
root/
├── index.html          # トップページ
├── about.html          # 天文班紹介
├── event.html          # 星空観測会案内
├── archive.html        # 過去の記録
├── contact.html        # お問い合わせ
├── css/
│   └── style.css       # 共通スタイルシート
├── js/
│   ├── stars.js        # 星空アニメーション
│   ├── news.js         # Google Sheets ニュース連携
│   └── menu.js         # メニュー制御・UI機能
├── images/
│   ├── logo.png        # ロゴ（要差し替え）
│   ├── hero-bg.jpg     # ヒーロー背景画像（要差し替え）
│   └── archive/        # アーカイブ画像フォルダ
│       ├── sample1.jpg # サンプル画像（要差し替え）
│       ├── sample2.jpg # サンプル画像（要差し替え）
│       └── sample3.jpg # サンプル画像（要差し替え）
└── README.md           # このファイル
```

## 🚀 セットアップ・使用方法

### 1. 基本セットアップ

1. このリポジトリをクローンまたはダウンロード
2. Webサーバーでホスト（ローカル開発時は Live Server 等を使用）
3. ブラウザで `index.html` を開く

### 2. GitHub Pages での公開

1. GitHubリポジトリの Settings → Pages
2. Source を "Deploy from a branch" に設定
3. Branch を "main" / "master" に設定
4. Root フォルダを選択
5. Save をクリック

### 3. カスタマイズ設定

#### 🖼️ 画像の差し替え

以下の画像ファイルを実際の写真に差し替えてください：

- `images/logo.png` - 天文班のロゴ
- `images/hero-bg.jpg` - トップページ背景（夜空の写真推奨）
- `images/archive/sample*.jpg` - 活動記録の写真

#### 📰 Google Sheets ニュース連携

1. Google Sheets でニュース管理用のスプレッドシートを作成
2. カラム構成: A列=日付(yyyy-mm-dd), B列=タイトル, C列=本文
3. ファイル → 共有 → ウェブに公開 → CSV で公開
4. `js/news.js` の `SHEET_ID` を実際のIDに変更

```javascript
const SHEET_CONFIG = {
  SHEET_ID: 'YOUR_ACTUAL_SHEET_ID', // ← ここを変更
  // ...
};
```

#### ✉️ お問い合わせフォーム設定

1. Google Forms でお問い合わせフォームを作成
2. `event.html` と `contact.html` のフォームURLを実際のURLに変更

```html
<a href="https://docs.google.com/forms/YOUR_ACTUAL_FORM_ID" target="_blank">
```

#### 📧 メールアドレス変更

`contact.html` のメールアドレスを実際の連絡先に変更：

```html
<a href="mailto:actual-email@school.jp">
```

## 🎨 デザインカスタマイズ

### カラーテーマ

`css/style.css` の CSS変数で色を調整できます：

```css
:root {
  --bg: #010d1a;        /* 背景色 */
  --card: #0d1b2e;      /* カード背景 */
  --accent: #ffd966;    /* アクセントカラー */
  --text: #ffffff;      /* 文字色 */
  /* ... */
}
```

### 星空アニメーション設定

`js/stars.js` でアニメーションパラメータを調整：

```javascript
this.maxStars = 400;      // 星の数
this.targetFPS = 30;      // フレームレート
// パフォーマンスに応じて調整
```

## 📱 対応ブラウザ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 開発環境

- HTML5
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript ES6+
- No framework/library dependencies

## 📝 ライセンス

© 2025 屋代高校 天文班

## 🆘 サポート・お問い合わせ

技術的な質問や不具合報告は、以下までご連絡ください：
- Webサイト: [contact.html](contact.html)
- Email: astronomy@yashiro-school.jp（仮）

## 🚨 重要な注意事項

### セキュリティ

- 個人情報を含む画像は公開前に確認
- メールアドレスの公開には注意
- フォームのスパム対策を実装

### パフォーマンス

- 画像ファイルは適切に圧縮（推奨: WebP形式）
- JavaScript の実行エラーをモニタリング
- 大きな画像は lazy loading の実装を検討

### アクセシビリティ

- 画像には必ず alt テキストを設定
- カラーコントラストの確認
- キーボードナビゲーションのテスト

---

**🌟 宇宙への扉を開く、屋代高校天文班の公式サイトへようこそ！**