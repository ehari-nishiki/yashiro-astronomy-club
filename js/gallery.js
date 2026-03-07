/**
 * gallery.js — data/archive.json を読み込んでギャラリーを描画
 * archive.html の <div id="gallery-mount"> に年度ごとのカードを挿入する
 */
(async () => {
  const mount = document.getElementById('gallery-mount');
  if (!mount) return;

  let data;
  try {
    const res = await fetch('data/archive.json');
    if (!res.ok) throw new Error('fetch failed');
    data = await res.json();
  } catch (e) {
    // データ読み込み失敗時は静かに終了（ページ表示には影響なし）
    return;
  }

  const years = (data.years || []).sort((a, b) => Number(b.year) - Number(a.year));

  for (const entry of years) {
    const photos = (entry.photos || []);
    if (photos.length === 0) continue;

    const photosHtml = photos.map(p => {
      const wideAttr = p.wide ? ' style="grid-row:span 2"' : '';
      return `<figure${wideAttr}>
        <img src="${p.src}" alt="${p.alt}"
          onerror="this.parentElement.style.background='var(--glass-bg)';this.style.display='none';" />
        <figcaption>
          <strong>${p.title}</strong><br />${p.caption}
        </figcaption>
      </figure>`;
    }).join('\n');

    const summaryHtml = entry.summary
      ? `<p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.2rem">${entry.summary}</p>`
      : '';

    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `
      <h2>${entry.year}年度の活動</h2>
      ${summaryHtml}
      <div class="gallery">${photosHtml}</div>
    `;
    mount.appendChild(card);
  }
})();
