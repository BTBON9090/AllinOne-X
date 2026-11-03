/* =========================================================
   All in One · skin controller
   One layout, six complete skins. Tags the legacy markup with
   semantic UI roles so the skin CSS can cover every region,
   mounts the skin picker in Settings, and persists the choice.
   ========================================================= */
(() => {
  'use strict';

  const SKINS = [
    { id: 'cards', zh: '卡片', en: 'Cards', app: '#F0E9DF', surface: '#FFFDF9', accent: '#B24E2C', nav: '#B24E2C', rail: '#F0E9DF' },
    { id: 'dark-rail', zh: '暗轨', en: 'Dark Rail', app: '#F2F6FA', surface: '#FFFFFF', accent: '#1F6BFF', nav: '#1F6BFF', rail: '#0D141D' },
    { id: 'porcelain', zh: '白瓷', en: 'Porcelain', app: '#FFFFFF', surface: '#FFFFFF', accent: '#111827', nav: '#111827', rail: '#FFFFFF' },
    { id: 'index', zh: '索引', en: 'Index', app: '#EEF0F1', surface: '#F4F5F5', accent: '#D9482F', nav: '#D9482F', rail: '#EEF0F1' },
    { id: 'shade', zh: '石墨', en: 'Shade', app: '#EAE4D9', surface: '#FFFFFF', accent: '#4D5E24', nav: '#D9F27A', rail: '#151515' },
    { id: 'dusk', zh: '暮色', en: 'Dusk', app: '#0B131D', surface: '#162230', accent: '#FF8A5B', nav: '#FF8A5B', rail: '#070B11' }
  ];

  const store = (() => {
    if (typeof PersistentCache !== 'undefined' && PersistentCache && typeof PersistentCache.get === 'function') return PersistentCache;
    return {
      get(key) {
        try { const raw = localStorage.getItem('allinone_' + key); return raw ? JSON.parse(raw) : null; }
        catch (error) { return null; }
      },
      set(key, value) {
        try { localStorage.setItem('allinone_' + key, JSON.stringify(value)); } catch (error) { /* ignore */ }
        return value;
      }
    };
  })();

  let currentSkin = 'cards';

  const isEnglish = () => String(document.documentElement.lang || 'zh').toLowerCase().startsWith('en');
  const byId = id => SKINS.find(skin => skin.id === id) || SKINS[0];

  /* ---------- semantic role tagging ---------- */
  const CARD_RE = /(^|[-_])(card|tile|group|section)([-_]|$)/i;
  const CARD_DENY = /(tool-card|nav-group|theory-group|skin-group|tag-cloud|checkbox|radio-tag-group|icon-suffix-group|input-group-icon|text-input-group|nav-section-label|theory-input-section|theory-chat-input|filter-chips-row|section-header|section-title|settings-section-title|card-title|card-head|card-heading|card-icon|card-desc|card-index|card-label|card-body|card-copy|card-content|card-footer|tile-icon|tile-title|tile-desc|builder-card-head|builder-card-title|builder-card-index|skew-card-header|skew-card-title|comp-header|size-card-title|style-section-title|theory-group-title|result-header|res-header)/i;

  const all = (root, selector) => {
    const nodes = [...root.querySelectorAll(selector)];
    if (root.matches && root.matches(selector)) nodes.unshift(root);
    return nodes;
  };

  const setRole = (el, role) => {
    if (!(el instanceof Element)) return;
    el.dataset.uiRole = role;
  };

  function tagPanels(root) {
    all(root, '#contentScroll > [id$="Panel"], #settingsPanel, #emptyPanel').forEach(el => setRole(el, 'panel'));
  }

  function tagTopbars(root) {
    const topbars = '.sub-header,.text-panel-header,.smart-tabs,.refiner-tabs,.result-header,.res-header,.dup-subheader,.dup-side-header,.jumpback-header,.theory-chat-header,.sel-result-header';
    all(root, topbars).forEach(el => {
      setRole(el, 'topbar');
      if (el.matches('.smart-tabs,.refiner-tabs')) el.dataset.uiTabs = 'true';
    });
  }

  function tagTabs(root) {
    all(root, '.smart-tab-item,.refiner-tab-item,.size-tab').forEach(el => setRole(el, 'tab'));
    all(root, '.size-tabs').forEach(el => setRole(el, 'tabs'));
  }

  function tagSegments(root) {
    all(root, '.segmented-control,.scope-segment,.mode-switch').forEach(el => setRole(el, 'segment-track'));
    all(root, '.seg-btn,.scope-option,.mode-switch .ms-in,.mode-switch .ms-ex').forEach(el => setRole(el, 'segment'));
  }

  function tagChips(root) {
    all(root, '.filter-tag,.all-tag,.tag-btn,.checkbox-chip,.radio-tag,.ppt-status').forEach(el => setRole(el, 'chip'));
  }

  function tagBadges(root) {
    all(root, '.cat-badge,.result-badge,.badge-new,.detail-cat-badge').forEach(el => setRole(el, 'badge'));
  }

  function tagTiles(root) {
    all(root, '.smart-basic-tile,.theory-capsule,.ppt-tips,.builder-selection').forEach(el => setRole(el, 'tile'));
  }

  function tagRows(root) {
    all(root, '.size-preset,.text-result-row,.dup-pair-item,.res-row').forEach(el => setRole(el, 'row'));
  }

  function tagInfoEmpty(root) {
    all(root, '.find-summary-bar,.smart-fill-status,.size-status,.sequence-preview,.compkit-inline-note').forEach(el => setRole(el, 'info'));
    all(root, '.empty-state,.empty-state-refiner,.size-empty,.jumpback-empty,.compkit-empty').forEach(el => setRole(el, 'empty'));
  }

  function tagFooters(root) {
    const footers = '.smart-footer,.smart-affix-bar,.text-fixed-footer,.lint-footer-fixed,.ppt-footer,.res-footer,.sub-footer,.bottom-action,.custom-editor-footer,.dialog-bottom,.size-panel-actions,.theory-input-section,.theory-chat-input';
    all(root, footers).forEach(el => setRole(el, 'footerbar'));
  }

  function tagCards(root) {
    all(root, '[class]').forEach(el => {
      if (el.dataset.uiRole) return;
      if (el.closest('.skin-option,.nav-item,#toolGrid')) return;
      if (el.closest('[data-ui-role="card"]')) return;
      const cls = typeof el.className === 'string' ? el.className : '';
      if (!cls || CARD_DENY.test(cls) || !CARD_RE.test(cls)) return;
      setRole(el, 'card');
    });
    all(root, '.spot-item,.ppt-step,.layer-ai-card,.comp-group,.ai-result-box').forEach(el => {
      if (el.dataset.uiRole) return;
      if (el.parentElement?.closest('[data-ui-role="card"]')) return;
      setRole(el, 'card');
    });
  }

  function tagCardHeaders(root) {
    all(root, '.section-header,.settings-section-title,.builder-card-head,.skew-card-header,.comp-header,.theory-group-title').forEach(el => {
      if (!el.dataset.uiRole) setRole(el, 'card-header');
    });
  }

  function tagTools(root) {
    all(root, '.tool-card').forEach(el => setRole(el, 'tool'));
  }

  function buttonVariant(el) {
    if (el.matches('.footer-btn,#collapseWindow')) return 'nav';
    if (el.matches('.icon-btn,.icon-btn-square,.btn-clear-input,.size-swap,.header-btn,.header-arrow,.dup-header-arrow,.icon-toggle,.smart-setting-btn,.window-move,.toast-close,.btn-spot-del,.prop-del-btn,.custom-editor-fill-button,.theory-send-btn,.bookmark-icon,.bookmark-handle')) return 'icon';
    const text = (el.innerText || '').trim();
    if (!text && !el.matches('.primary-btn,.builder-action')) return 'icon';
    if (el.matches('.btn-danger,.danger')) return 'danger';
    if (el.matches('.primary-btn,.primary,.btn-start-lint,.btn-auto-run,.btn-jumpback-save,.ppt-action-btn,.skew-save-btn,.btn-manual-dl,.btn-row-replace,.btn-locate')) return 'primary';
    if (el.matches('.builder-action:not(.secondary)')) return 'primary';
    if (el.matches('.btn-act.primary')) return 'primary';
    return 'secondary';
  }

  function tagButtons(root) {
    all(root, 'button').forEach(el => {
      // The collapsed edge bubble is a full-window button with its own
      // 40px logo. It must never inherit the 28px icon-button metrics.
      if (el.id === 'pluginBubble') {
        delete el.dataset.uiRole;
        delete el.dataset.uiVariant;
        return;
      }
      if (el.dataset.uiRole) return;
      if (el.id === 'dashGreeting') return;
      if (el.closest('.skin-option,.skin-section')) return;
      if (el.classList.contains('smart-fill-trigger')) return;
      el.dataset.uiRole = 'button';
      el.dataset.uiVariant = buttonVariant(el);
    });
  }

  function tagAll(root = document.body) {
    if (!(root instanceof Element)) return;
    tagPanels(root);
    tagTopbars(root);
    tagTabs(root);
    tagSegments(root);
    tagChips(root);
    tagBadges(root);
    tagTiles(root);
    tagRows(root);
    tagInfoEmpty(root);
    tagFooters(root);
    tagCards(root);
    tagCardHeaders(root);
    tagTools(root);
    tagButtons(root);
  }

  /* ---------- settings picker ---------- */
  function updatePicker() {
    document.querySelectorAll('[data-skin-option]').forEach(button => {
      const active = button.dataset.skinOption === currentSkin;
      button.setAttribute('aria-checked', active ? 'true' : 'false');
      button.classList.toggle('is-active', active);
    });
  }

  function refreshLabels() {
    const english = isEnglish();
    const section = document.querySelector('.skin-section');
    if (section) {
      const title = section.querySelector('.skin-title-text');
      const desc = section.querySelector('.skin-desc');
      const reset = section.querySelector('.skin-reset');
      const grid = section.querySelector('.skin-grid');
      if (title) title.textContent = english ? 'Plugin skin' : '插件皮肤';
      if (desc) desc.textContent = english ? 'Applies instantly. Saved on this device.' : '选择后立即生效，保存在本地。';
      if (reset) reset.textContent = english ? 'Reset to Cards' : '恢复默认（卡片）';
      if (grid) grid.setAttribute('aria-label', english ? 'Plugin skin' : '插件皮肤');
      section.querySelectorAll('[data-skin-option]').forEach(button => {
        const skin = byId(button.dataset.skinOption);
        const name = button.querySelector('b');
        const alt = button.querySelector('small');
        if (name) name.textContent = english ? skin.en : skin.zh;
        if (alt) alt.textContent = english ? skin.zh : skin.en;
      });
    }
  }

  function apply(skin, persist = true) {
    const next = SKINS.some(item => item.id === skin) ? skin : 'cards';
    currentSkin = next;
    document.documentElement.dataset.skin = next;
    if (persist) store.set('user_skin', next);
    updatePicker();
  }

  function mountPicker() {
    const panel = document.getElementById('settingsPanel');
    if (!panel || panel.querySelector('.skin-section')) return;
    const host = panel.querySelector('.settings-section');
    if (!host) return;

    const section = document.createElement('section');
    section.className = 'settings-section skin-section';
    section.dataset.uiRole = 'card';
    section.innerHTML = `
      <div class="settings-section-title skin-title"><span class="skin-title-text">插件皮肤</span></div>
      <p class="skin-desc">选择后立即生效，保存在本地。</p>
      <div class="skin-grid" role="radiogroup" aria-label="插件皮肤"></div>
      <button type="button" class="skin-reset">恢复默认（卡片）</button>
    `;

    const grid = section.querySelector('.skin-grid');
    SKINS.forEach(skin => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'skin-option';
      button.dataset.skinOption = skin.id;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');
      button.style.setProperty('--s1', skin.app);
      button.style.setProperty('--s2', skin.surface);
      button.style.setProperty('--s3', skin.accent);
      button.style.setProperty('--s4', skin.nav);
      button.style.setProperty('--s5', skin.rail);
      button.innerHTML = '<span class="skin-swatch"><i></i><i></i><i></i></span><span class="skin-copy"><b></b><small></small></span>';
      grid.append(button);
    });

    section.addEventListener('click', event => {
      const option = event.target.closest('[data-skin-option]');
      if (option) { apply(option.dataset.skinOption); return; }
      if (event.target.closest('.skin-reset')) apply('cards');
    });

    host.after(section);
    updatePicker();
    refreshLabels();
  }

  function observeLanguage() {
    let last = document.documentElement.lang;
    new MutationObserver(() => {
      if (document.documentElement.lang === last) return;
      last = document.documentElement.lang;
      refreshLabels();
      updatePicker();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function observeContent() {
    let scheduled = false;
    const pending = new Set();
    new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => { if (node instanceof Element) pending.add(node); });
      }
      if (!pending.size || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const nodes = [...pending];
        pending.clear();
        scheduled = false;
        nodes.forEach(node => { if (node.isConnected) tagAll(node); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  const saved = store.get('user_skin');
  apply(SKINS.some(item => item.id === saved) ? saved : 'cards', false);
  mountPicker();
  tagAll(document.body);
  document.documentElement.classList.add('skin-ready');
  refreshLabels();
  observeLanguage();
  observeContent();
  updatePicker();

  window.PluginSkins = {
    apply,
    current: () => currentSkin,
    list: SKINS.map(skin => ({ id: skin.id, zh: skin.zh, en: skin.en })),
    refresh: refreshLabels,
    tag: tagAll
  };
})();
