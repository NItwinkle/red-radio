const app = document.querySelector('#app');
const search = document.querySelector('#globalSearch');
const diseases = window.DISEASES || [];
const bookNames = {
  1: '《刮痧疗法》',
  2: '《实用刮痧疗法》',
  3: '《图解刮痧疗法》',
  4: '《循经刮痧疗法》',
  5: '《中医刮痧疗法》'
};
const bookDialog = document.querySelector('#bookDialog');
const bookOptions = document.querySelector('#bookOptions');
const PAGE_SIZE = 60;
const PINYIN_BOUNDARIES = [
  ['A','阿'],['B','八'],['C','擦'],['D','搭'],['E','蛾'],['F','发'],
  ['G','噶'],['H','哈'],['J','击'],['K','喀'],['L','拉'],['M','妈'],
  ['N','拿'],['O','哦'],['P','趴'],['Q','七'],['R','然'],['S','撒'],
  ['T','塌'],['W','挖'],['X','西'],['Y','丫'],['Z','砸']
];
const pinyinCollator = new Intl.Collator('zh-CN-u-co-pinyin');
const initialOverrides = {'咳': 'K'};
const initialCache = new Map();
let activeBook = null;
let activeVariant = 0;
let activeInitial = null;
let visibleCount = PAGE_SIZE;

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));

function fieldOrder(title) {
  const heading = title.trim();
  if (/概述|简介|概况/.test(heading)) return 0;
  if (/症状|辨证分型|辨证论治|证候/.test(heading)) return 1;
  if (/穴位|取穴|腧穴/.test(heading)) return 2;
  if (/注意事项|禁忌|预防|附注|提示/.test(heading)) return 4;
  return 3;
}

function orderedFields(fields) {
  return fields.map((field, index) => ({field, index}))
    .sort((a, b) => fieldOrder(a.field.title) - fieldOrder(b.field.title) || a.index - b.index)
    .map(entry => entry.field);
}

function highlightName(name, query) {
  if (!query) return escapeHtml(name);
  const start = name.toLocaleLowerCase('zh-CN').indexOf(query.toLocaleLowerCase('zh-CN'));
  if (start < 0) return escapeHtml(name);
  return `${escapeHtml(name.slice(0, start))}<mark class="search-hit">${escapeHtml(name.slice(start, start + query.length))}</mark>${escapeHtml(name.slice(start + query.length))}`;
}

function editDistance(left, right) {
  const a = Array.from(left);
  const b = Array.from(right);
  let row = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + Number(a[i - 1] !== b[j - 1]));
    }
    row = next;
  }
  return row[b.length];
}

function similarNames(query, pool = diseases) {
  if (Array.from(query).length < 2) return [];
  const maxDistance = query.length <= 4 ? 1 : 2;
  return [...new Set(pool.map(item => item.name))]
    .map(name => ({name, distance: editDistance(query, name)}))
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.name.length - b.name.length)
    .slice(0, 5);
}

function fieldTone(title) {
  if (/症状|辨证分型|辨证论治|证候/.test(title)) return 'symptoms';
  if (/穴位|取穴|腧穴/.test(title)) return 'points';
  if (/注意事项|禁忌|预防|附注|提示/.test(title)) return 'notes';
  if (/概述|简介|概况/.test(title)) return 'overview';
  if (/方义|原理|解析/.test(title)) return 'rationale';
  if (/^治法$|治疗原则/.test(title)) return 'strategy';
  return 'treatment';
}

function renderBody(body) {
  return escapeHtml(body).replace(/(取穴|选穴|操作方法|刮拭顺序|刮治方法|治法)([：:])/g, '<span class="copy-label">$1$2</span>');
}

function renderBookOptions() {
  bookOptions.innerHTML = `<button type="button" class="book-option${activeBook === null ? ' selected' : ''}" data-book="all" aria-pressed="${activeBook === null}">全部书籍</button>` +
    Object.entries(bookNames).map(([number, name]) => `<button type="button" class="book-option${activeBook === Number(number) ? ' selected' : ''}" data-book="${number}" aria-pressed="${activeBook === Number(number)}">${escapeHtml(name)}</button>`).join('');
}

function pinyinInitial(name) {
  if (initialCache.has(name)) return initialCache.get(name);
  const first = Array.from(name)[0] || '';
  let result = '#';
  if (initialOverrides[first]) result = initialOverrides[first];
  else if (/^[A-Za-z]/.test(first)) result = first.toUpperCase();
  else if (/\p{Script=Han}/u.test(first)) {
    result = 'A';
    for (const [letter, boundary] of PINYIN_BOUNDARIES) {
      if (pinyinCollator.compare(first, boundary) >= 0) result = letter;
      else break;
    }
  }
  initialCache.set(name, result);
  return result;
}

function syncBookFilterControl() {
  const current = activeBook === null ? '全部书籍' : bookNames[activeBook];
  const trigger = document.querySelector('#openBookFilter');
  const reset = document.querySelector('#resetBookFilter');
  if (trigger) {
    trigger.innerHTML = `${activeBook === null ? '按书籍筛选' : escapeHtml(current)} <span aria-hidden="true">▾</span>`;
    trigger.setAttribute('aria-label', `按书籍筛选，当前：${current}`);
  }
  if (reset) reset.hidden = activeBook === null;
}

function renderHome(query = '') {
  const needle = query.trim().toLocaleLowerCase('zh-CN');
  const pool = activeBook === null ? diseases : diseases.filter(item => item.book === activeBook);
  const nameMatches = pool.filter(item => item.name.toLocaleLowerCase('zh-CN').includes(needle));
  const matches = needle || !activeInitial ? nameMatches : nameMatches.filter(item => pinyinInitial(item.name) === activeInitial);
  const visible = matches.slice(0, visibleCount);
  const suggestions = needle && !nameMatches.length ? similarNames(needle, pool) : [];
  syncBookFilterControl();
  document.title = '痧证汇方';
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy"><h1>痧证汇方</h1><p class="lead">汇诸证刮痧之法，集辨证疗痧之要</p></div>
    </section>
    <section class="directory" aria-live="polite">
      <div class="section-heading"><h2>${needle ? '搜索结果' : '病症索引'}</h2><div class="book-filter-inline"><span class="book-filter-current">${activeBook === null ? '全部书籍' : escapeHtml(bookNames[activeBook])}</span><button type="button" class="book-filter-trigger" id="openBookFilter" aria-haspopup="dialog">按书籍筛选 <span aria-hidden="true">▾</span></button><button type="button" class="book-filter-reset" id="resetBookFilter" ${activeBook === null ? 'hidden' : ''}>查看全部</button></div></div>
      ${!needle ? `<div class="initial-index" aria-label="按拼音首字母定位"><span>拼音首字母</span><button type="button" class="${activeInitial === null ? 'active' : ''}" data-initial="all" aria-pressed="${activeInitial === null}">全部</button>${PINYIN_BOUNDARIES.map(([letter]) => `<button type="button" class="${activeInitial === letter ? 'active' : ''}" data-initial="${letter}" aria-pressed="${activeInitial === letter}">${letter}</button>`).join('')}</div>` : ''}
      ${matches.length ? `<div class="disease-grid">${visible.map(item => `
        <a class="disease-link" href="#/disease/${item.id}">
          <div><strong>${highlightName(item.name, needle)}</strong><p>${escapeHtml(item.summary)}</p></div>
          <small>${item.variants.length > 1 ? `${item.variants.length} 条知识` : '查看知识'} →</small>
        </a>`).join('')}</div>${matches.length > visible.length ? '<button type="button" class="load-more">加载更多</button>' : ''}` : `<div class="empty">${needle ? `没有找到“${escapeHtml(query)}”。请尝试其他疾病名称。` : '这一首字母下暂无疾病。'}</div>`}
    </section>`;
  app.querySelectorAll('[data-initial]').forEach(button => button.addEventListener('click', () => {
    activeInitial = button.dataset.initial === 'all' ? null : button.dataset.initial;
    visibleCount = PAGE_SIZE;
    renderHome(search.value);
  }));
  app.querySelector('.load-more')?.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    renderHome(search.value);
  });
  app.querySelector('#openBookFilter')?.addEventListener('click', () => { renderBookOptions(); bookDialog.showModal(); });
  app.querySelector('#resetBookFilter')?.addEventListener('click', () => {
    activeBook = null;
    activeInitial = null;
    visibleCount = PAGE_SIZE;
    if (location.hash === '#/' || !location.hash) renderHome(search.value);
    else location.hash = '#/';
  });
  if (!matches.length) {
    const empty = app.querySelector('.empty');
    if (suggestions.length) {
      empty.insertAdjacentHTML('beforeend', `<div class="suggestions"><span>你是不是想找：</span>${suggestions.map(item => `<button type="button" data-suggestion="${escapeHtml(item.name)}">${escapeHtml(item.name)}</button>`).join('')}</div>`);
      empty.querySelectorAll('[data-suggestion]').forEach(button => button.addEventListener('click', () => {
        search.value = button.dataset.suggestion;
        renderHome(search.value);
      }));
    }
  }
}

function renderDisease(id) {
  const item = diseases.find(disease => disease.id === id);
  if (!item) { location.hash = '#/'; return; }
  activeVariant = Math.min(activeVariant, item.variants.length - 1);
  const variant = item.variants[activeVariant];
  syncBookFilterControl();
  document.title = `${item.name}｜痧证汇方`;
  const tabs = item.variants.length > 1 ? `<div class="variant-tabs" role="tablist" aria-label="选择分型或知识">${item.variants.map((entry, index) => `<button role="tab" aria-selected="${index === activeVariant}" class="${index === activeVariant ? 'active' : ''}" data-variant="${index}">${escapeHtml(entry.label)}</button>`).join('')}</div>` : '';
  app.innerHTML = `
    <div class="breadcrumb"><a href="${activeBook === null ? '#/' : `#/book/${activeBook}`}">首页</a>　/　${escapeHtml(item.name)}</div>
    <section class="detail-hero"><p class="eyebrow">痧证汇方</p><h1>${escapeHtml(item.name)}</h1></section>
    ${tabs}
    <div class="detail-actions"><button type="button" id="addCurrentToCompare">＋ 加入方案对比</button><a class="compare-view-btn" href="#/compare">查看对比 <span>→</span></a></div>
    <article class="detail-card">${orderedFields(variant.fields).map(field => `<section class="content-section tone-${fieldTone(field.title)}${field.body.length > 120 ? ' long-copy' : ''}"><h2>${escapeHtml(field.title)}</h2><p>${renderBody(field.body)}</p></section>`).join('')}</article>`;
  app.querySelector('#addCurrentToCompare').addEventListener('click', event => {
    const status = window.SITE_FEATURES.addToCompare(id, activeVariant);
    event.currentTarget.textContent = status === 'added' ? '已加入对比' : status === 'exists' ? '已在对比中' : '已选满 3 条';
  });
  document.querySelectorAll('[data-variant]').forEach(button => button.addEventListener('click', () => {
    activeVariant = Number(button.dataset.variant);
    renderDisease(id);
  }));
}

function route() {
  const match = location.hash.match(/^#\/disease\/(.+)$/);
  const bookMatch = location.hash.match(/^#\/book\/([1-5])$/);
  const nextBook = bookMatch ? Number(bookMatch[1]) : null;
  if (!match && nextBook !== activeBook) { activeInitial = null; visibleCount = PAGE_SIZE; }
  if (!match) activeBook = nextBook;
  if (match) renderDisease(match[1]);
  else if (location.hash === '#/atlas') { syncBookFilterControl(); window.SITE_FEATURES.renderAtlas(app); document.title = '穴位图谱｜痧证汇方'; }
  else if (location.hash === '#/glossary') { syncBookFilterControl(); window.SITE_FEATURES.renderGlossary(app); document.title = '刮痧知识词典｜痧证汇方'; }
  else if (location.hash === '#/compare') { syncBookFilterControl(); window.SITE_FEATURES.renderCompare(app); document.title = '方案对比｜痧证汇方'; }
  else renderHome(search.value);
  const section = location.hash === '#/atlas' ? 'atlas' : location.hash === '#/glossary' ? 'glossary' : location.hash === '#/compare' ? 'compare' : 'home';
  document.querySelectorAll('[data-nav]').forEach(link => { link.classList.toggle('active', link.dataset.nav === section); if (link.dataset.nav === section) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
  window.SITE_FEATURES.updateBadge();
  app.focus({preventScroll:true});
}

search.addEventListener('input', () => {
  activeInitial = null;
  visibleCount = PAGE_SIZE;
  if (location.hash.match(/^#\/disease\//) || ['#/atlas','#/glossary','#/compare'].includes(location.hash)) location.hash = activeBook === null ? '#/' : `#/book/${activeBook}`;
  renderHome(search.value);
});
document.querySelector('#closeBookFilter').addEventListener('click', () => bookDialog.close());
bookDialog.addEventListener('click', event => { if (event.target === bookDialog) bookDialog.close(); });
bookOptions.addEventListener('click', event => {
  const option = event.target.closest('[data-book]');
  if (!option) return;
  const next = option.dataset.book === 'all' ? null : Number(option.dataset.book);
  bookDialog.close();
  activeBook = next;
  activeInitial = null;
  visibleCount = PAGE_SIZE;
  const nextHash = next === null ? '#/' : `#/book/${next}`;
  if (location.hash === nextHash) renderHome(search.value);
  else location.hash = nextHash;
});
window.addEventListener('hashchange', () => { activeVariant = 0; route(); });
route();
