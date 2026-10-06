/* Shared workspace navigation and search. No host mutations are issued by search. */
(() => {
  const $ = id => document.getElementById(id);
  const routes = {
    simple: ['toolPanel', 'efficiency', '选中画布图层，再选择要执行的工具。', 'Select canvas layers, then choose a tool.'],
    select: ['selectionPanel', 'efficiency', '先确定查找范围，再组合类型、名称和高级属性筛选。', 'Choose a scope, then combine type, name and property filters.'],
    text: ['textPanel', 'efficiency', '查找后勾选结果再替换。默认仅处理选中图层；替换前可在画布定位。', 'Find text, select matches, then replace. The default scope is the selection.'],
    smartFill: ['smartFillPanel', 'efficiency', '先选择文本或画板，点击字段名称填充。标签和设置只调整规则。', 'Select text or frames, then click a field name to fill. Tags and settings only change the rules.'],
    size: ['sizePanel', 'efficiency', '编辑目标尺寸或选择预设，再应用到选中画板或矩形。设计视口用于界面，原生分辨率用于像素对照。', 'Edit dimensions or pick a preset, then apply to selected frames or rectangles. Design viewport and native resolution serve different purposes.'],
    refiner: ['refinerPanel', 'components', '扫描组件问题，再按需清洗或生成组件说明书。', 'Scan component issues, then clean them or generate a component showcase.'],
    componentBuilder: ['componentBuilderPanel', 'components', '选择 Frame，再选择组件、组件集或语言变体的构建方式。', 'Select frames, then create components, component sets or language variants.'],
    duplicate: ['duplicatePanel', 'components', '选择两个画板，对比重复元素并定位结果。', 'Select two frames to compare repeated elements and locate matches.'],
    compkit: ['compkitPanel', 'components', '读取本地组件库并按需生成预览和布局。', 'Read local components and generate previews and layouts.'],
    i18n: ['i18nPanel', 'extensions', '先确认范围和源语言。直接替换会修改文本；Mode 用于保存可切换的语言版本。', 'Confirm scope and source language. Replace changes text; modes preserve switchable language versions.'],
    skew: ['skewPanel', 'extensions', '预览倾斜与等轴效果，再应用到选中图层。', 'Preview skew and isometric transforms, then apply to selected layers.'],
    ppt: ['pptPanel', 'extensions', '建议先复制页面；按步骤预处理后导出。首次使用请查看面板内的导出说明。', 'Duplicate the page first. Follow the preparation steps and review the export notes.'],
    jumpback: ['jumpbackPanel', 'extensions', '保存当前视角后可一键返回。每个文件最多保存 5 个位置。', 'Save the current viewport to return later. Up to five locations per file.'],
    theory: ['theoryPanel', 'extensions', '按主题浏览设计理论，也可输入具体的设计问题。', 'Browse design principles by topic, or ask a specific design question.']
  };
  const groups = { efficiency: ['效率工具', 'Essentials'], components: ['组件与规范', 'Components'], extensions: ['更多能力', 'More tools'] };
  const categories = { all: ['全部', 'All'], layer: ['图层', 'Layers'], layout: ['布局', 'Layout'], text: ['文字', 'Text'], style: ['样式', 'Styles'], component: ['组件', 'Components'], shape: ['形状', 'Shapes'] };
  const english = () => curLang === 'en';
  const l = (zh, en) => english() ? en : zh;
  const nav = key => document.querySelector(`.nav-item[data-nav="${key}"]`);
  const label = key => key === 'settings' ? l('设置', 'Settings') : key === 'size' ? l('尺寸助手', 'Size assistant') : nav(key).querySelector('.nav-text').textContent.trim();
  const panelIds = [...Object.values(routes).map(route => route[0]), 'selectionFooter', 'settingsPanel', 'emptyPanel'];
  const cards = [...document.querySelectorAll('#toolGrid .tool-card')];
  const toolNames = {
    reverse_component:['实例逆向','Restore source'], to_frame:['矩形转画板','Rectangle to frame'], to_rect:['画板转矩形','Frame to rectangle'],
    split_text:['拆分文本','Split text'], join_text:['合并文本','Join text'], remove_al:['移除自动布局','Remove auto layout'], add_al_wrapper:['包裹自动布局','Wrap in auto layout'],
    up_one:['上移一层','Move up a level'], up_all:['移至顶层','Move to top level'], ungroup_all:['解散所有编组','Ungroup all'], unlock_all:['解锁所有图层','Unlock layers'],
    swap_fs:['互换填充描边','Swap fill / stroke'], reset_image:['还原图片比例','Reset image ratio'], sort_layers:['可见度排序','Sort by visibility'], sort_by_name:['名称排序','Sort by name'],
    rename_content:['按文本命名','Name from text'], detach_all:['分离组件实例','Detach instances'], remove_hidden:['删除隐藏图层','Delete hidden layers'], pixel_perfect:['像素对齐','Align to pixels'],
    swap_positions:['交换图层位置','Swap positions'], create_styles:['创建本地样式','Create local styles'], match_styles:['重新关联样式','Match local styles']
  };
  let current = 'simple';
  let previous = 'simple';
  let category = 'all';
  const scrollPositions = new Map();
  const currentPanel = () => $(current === 'settings' ? 'settingsPanel' : routes[current][0]);
  const rememberScroll = () => {
    const panel = currentPanel();
    scrollPositions.set(current, [panel, ...panel.querySelectorAll('*')].filter(el => el.scrollHeight > el.clientHeight && el.clientHeight > 0).map(el => [el, el.scrollTop]));
  };

  function refreshHeader() {
    $('workspaceTitle').textContent = label(current);
    $('workspaceCategory').textContent = current === 'settings' ? 'All in One' : groups[routes[current][1]][english() ? 1 : 0];
    $('workspaceBack').hidden = current !== 'settings';
    $('workspaceHint').textContent = current === 'settings' ? l('外观与语言仅影响插件界面。AI 配置用于翻译和生成。', 'Appearance and language affect the plugin UI. AI settings are used for translation and generation.') : routes[current][english() ? 3 : 2];
    $('workspaceBack').ariaLabel = l('返回工具', 'Back to tools');
    $('workspaceHelp').ariaLabel = l('使用提示', 'Usage tips');
    $('workspaceHelp').title = l('使用提示', 'Usage tips');
    $('workspaceSearchButton').ariaLabel = l('查找工具', 'Find a tool');
    $('workspaceSearchButton').title = l('查找工具 · ⌘/Ctrl K', 'Find a tool · ⌘/Ctrl K');
  }

  function navigate(key) {
    if (key !== 'settings' && !routes[key]) return;
    rememberScroll();
    if (key === 'settings' && current !== 'settings') previous = current;
    current = key;
    panelIds.forEach(id => { const el = $(id); if (el) el.style.display = 'none'; });
    document.querySelectorAll('.sub-page').forEach(el => { el.classList.remove('open'); el.style.display = 'none'; });
    currentPanel().style.display = 'flex';
    if (key === 'select' && $('selectionFooter')) $('selectionFooter').style.display = 'flex';
    document.querySelectorAll('.nav-item').forEach(el => {
      const active = el.dataset.nav === key;
      el.classList.toggle('active', active);
      el.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (key !== 'settings') nav(key).scrollIntoView({ block:'nearest' });
    document.querySelector('.sidebar-footer button').classList.toggle('active', key === 'settings');
    $('workspaceHint').hidden = true;
    $('workspaceHelp').setAttribute('aria-expanded', 'false');
    refreshHeader();
    if (key === 'settings') initSettingsPanel();
    if (key === 'componentBuilder') requestComponentBuilderSelection();
    if (key === 'size') { initSizeAssistant(); updateSizeSummary(); postMsg('size-assistant-inspect'); }
    for (const [el, top] of scrollPositions.get(key) || []) if (el.isConnected) el.scrollTop = top;
  }

  // Build groups from the existing navigation elements: handlers and translations stay intact.
  const navScroll = document.querySelector('.nav-scroll');
  navScroll.setAttribute('role', 'navigation');
  navScroll.setAttribute('aria-label', 'All in One');
  navScroll.querySelectorAll('.nav-section-label').forEach(el => el.remove());
  for (const group of Object.keys(groups)) {
    const heading = document.createElement('div');
    heading.className = 'nav-section-label';
    heading.dataset.workspaceGroup = group;
    navScroll.append(heading);
    Object.entries(routes).filter(([, route]) => route[1] === group).forEach(([key]) => navScroll.append(nav(key)));
  }
  const brand = document.createElement('div');
  brand.className = 'workspace-brand';
  brand.innerHTML = '<span class="workspace-brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="workspace-brand-name">All in One</span>';
  document.querySelector('.sidebar').prepend(brand);

  function toolText(card, lang) {
    const translation = i18n[lang]?.[card.dataset.key];
    return Array.isArray(translation) ? translation.join(' ') : [card.querySelector('.tc-title').textContent, card.querySelector('.tc-desc').textContent].join(' ');
  }
  const normalize = text => String(text).normalize('NFKC').toLocaleLowerCase().trim();
  function matches(text, query) { return normalize(query).split(/\s+/).every(word => normalize(text).includes(word)); }
  function filterTools() {
    const query = $('toolSearch').value;
    let count = 0;
    for (const card of cards) {
      const show = (category === 'all' || card.dataset.category === category) && matches(toolText(card, 'zh') + ' ' + toolText(card, 'en') + ' ' + toolNames[card.dataset.key]?.join(' '), query);
      card.hidden = !show;
      if (show) count++;
    }
    $('toolResultCount').textContent = l(`${count} 项`, `${count} tools`);
    $('toolResultLabel').textContent = query.trim() ? l('搜索结果', 'Search results') : categories[category][english() ? 1 : 0];
    $('toolEmptyState').hidden = count !== 0;
  }
  function renderFilters() {
    $('toolFilters').replaceChildren();
    for (const [key, names] of Object.entries(categories)) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'tool-filter';
      button.textContent = names[english() ? 1 : 0];
      button.setAttribute('aria-pressed', String(key === category));
      button.onclick = () => { category = key; renderFilters(); filterTools(); };
      $('toolFilters').append(button);
    }
  }
  const empty = document.createElement('div');
  empty.id = 'toolEmptyState'; empty.className = 'workspace-empty'; empty.hidden = true;
  const emptyText = document.createElement('p'); emptyText.id = 'toolEmptyText';
  const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'workspace-reset';
  reset.onclick = () => { $('toolSearch').value = ''; category = 'all'; renderFilters(); filterTools(); $('toolSearch').focus(); };
  empty.append(emptyText, reset); $('toolGrid').after(empty);
  $('toolSearch').addEventListener('input', filterTools);
  $('toolSearch').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); $('toolSearch').value = ''; filterTools(); }
  });

  const dialog = $('workspaceCommands');
  function renderCommands() {
    const query = $('commandQuery').value;
    const entries = Object.keys(routes).map(key => {
      const translationKey = nav(key).querySelector('[data-key]')?.dataset.key;
      return { title: label(key), detail: groups[routes[key][1]][english() ? 1 : 0], search: [label(key), i18n.zh[translationKey], i18n.en[translationKey], routes[key][2], routes[key][3], key === 'size' ? '尺寸 屏幕 size screen ratio' : ''].join(' '), run: () => { navigate(key); nav(key).focus(); } };
    });
    for (const card of cards) entries.push({ title: card.querySelector('.tc-title').textContent, detail: card.querySelector('.tc-desc').textContent, search: toolText(card, 'zh') + ' ' + toolText(card, 'en') + ' ' + toolNames[card.dataset.key]?.join(' '), run: () => { navigate('simple'); category = card.dataset.category; $('toolSearch').value = ''; renderFilters(); filterTools(); card.focus(); card.scrollIntoView({ block:'nearest' }); } });
    const results = entries.filter(entry => matches(entry.search, query));
    // Prefix matches first; stable ordering within each relevance bucket.
    if (query.trim()) results.sort((a, b) => Number(normalize(b.title).startsWith(normalize(query))) - Number(normalize(a.title).startsWith(normalize(query))));
    $('commandResults').replaceChildren();
    for (const entry of results) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'command-result';
      const title = document.createElement('span'); title.textContent = entry.title;
      const detail = document.createElement('small'); detail.textContent = entry.detail;
      button.append(title, detail);
      button.onclick = () => { dialog.close(); entry.run(); };
      $('commandResults').append(button);
    }
    if (!results.length) {
      const message = document.createElement('p'); message.className = 'workspace-empty';
      message.textContent = l('未找到相关工具，试试更短的关键词。', 'No tools found. Try a shorter keyword.');
      $('commandResults').append(message);
    }
  }
  function openCommands() { if (dialog.open) return; $('commandQuery').value = ''; renderCommands(); dialog.showModal(); $('commandQuery').focus(); }
  $('workspaceSearchButton').onclick = openCommands;
  $('commandClose').onclick = () => dialog.close();
  $('commandQuery').oninput = renderCommands;
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('keydown', event => {
    if (event.isComposing) return;
    const buttons = [...$('commandResults').querySelectorAll('button')];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : index - 1;
      (next < 0 ? $('commandQuery') : buttons[next])?.focus();
    } else if (event.key === 'Enter' && event.target === $('commandQuery')) { event.preventDefault(); buttons[0]?.click(); }
  });
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.isComposing) { event.preventDefault(); openCommands(); } });
  $('workspaceHelp').onclick = () => { $('workspaceHint').hidden = !$('workspaceHint').hidden; $('workspaceHelp').setAttribute('aria-expanded', String(!$('workspaceHint').hidden)); };
  $('workspaceBack').onclick = () => navigate(previous);

  // Target dimensions precede the potentially long preset catalogue.
  const sizeCards = document.querySelectorAll('#sizePanel .size-card');
  sizeCards[0]?.before(sizeCards[1]);
  let step = 0;
  document.querySelectorAll('#i18nViewConfig .config-label > span:first-child').forEach(el => {
    if (/^\d+$/.test(el.textContent.trim())) el.textContent = String(++step);
  });
  const summary = document.createElement('div'); summary.className = 'size-target-summary'; summary.id = 'sizeTargetSummary'; summary.setAttribute('aria-live', 'polite');
  document.querySelector('.size-panel-actions').prepend(summary);
  const updateSizeSummary = () => { summary.textContent = `${$('sizeWidth').value || '—'} × ${$('sizeHeight').value || '—'} px`; };
  $('sizePanel').addEventListener('input', updateSizeSummary);
  $('sizePanel').addEventListener('change', updateSizeSummary);
  $('sizePanel').addEventListener('click', () => queueMicrotask(updateSizeSummary));
  updateSizeSummary();
  window.addEventListener('message', event => {
    if (event.data.pluginMessage?.type === 'size-assistant-selection') queueMicrotask(updateSizeSummary);
  });

  function prepareFillSettings() {
    const container = $('settingFormContainer');
    container.oninput = null;
    container.onchange = null;
    const isNumber = Boolean($('numSequenceType'));
    if (!isNumber && !$('timeStepSeconds')) return;
    // Persistent field labels remain visible after typing; irrelevant parameters
    // are disclosed only for the chosen algorithm, not deleted or reset.
    const names = isNumber ? {
      numSeqStart:l('起始值','Start'), numSeqSecond:l('第二项','Second value'), numSeqStep:l('公差','Step'), numSeqRatio:l('公比','Ratio')
    } : {};
    for (const [id, name] of Object.entries(names)) {
      const input = $(id), label = document.createElement('label');
      label.className = 'sequence-field'; label.htmlFor = id;
      const caption = document.createElement('span'); caption.textContent = name;
      input.before(label); label.append(caption, input);
    }
    const preview = document.createElement('output'); preview.className = 'sequence-preview'; preview.id = 'smartSequencePreview'; preview.setAttribute('aria-live','polite');
    const sequenceGroup = (isNumber ? $('numSequenceType') : $('timeStepSeconds')).closest('.config-group');
    sequenceGroup.append(preview);
    const update = () => {
      const name = isNumber ? 'numGeneration' : 'timeGeneration';
      const sequence = container.querySelector(`input[name="${name}"]:checked`)?.value === 'sequence';
      sequenceGroup.hidden = !sequence;
      const sortGroup = container.querySelector(`input[name="${isNumber ? 'numSort' : 'timeSort'}"]`)?.closest('.config-group');
      if (sortGroup) sortGroup.hidden = sequence;
      if (isNumber) {
        $('numMin').closest('.config-group').hidden = sequence;
        const type = $('numSequenceType').value;
        $('numSeqSecond').parentElement.hidden = type !== 'fibonacci';
        $('numSeqStep').parentElement.hidden = type !== 'arithmetic';
        $('numSeqRatio').parentElement.hidden = type !== 'geometric';
      }
      if (!sequence) return;
      try {
        const samples = isNumber ? generateSmartNumberSeries(5, {
          sequenceType:$('numSequenceType').value, start:$('numSeqStart').value, second:$('numSeqSecond').value,
          step:$('numSeqStep').value, ratio:$('numSeqRatio').value, decimals:$('numDec').value, thousands:$('numThous').checked
        }) : generateSmartTimeSeries(5, { start:$('timeStart').value, stepSeconds:$('timeStepSeconds').value, format:container.querySelector('input[name="timeFormat"]:checked')?.value });
        preview.textContent = l('前 5 项：','First 5: ') + samples.join(' · ');
        preview.classList.remove('has-error');
      } catch (error) { preview.textContent = error.message; preview.classList.add('has-error'); }
    };
    container.oninput = update;
    container.onchange = update;
    update();
  }

  function refresh() {
    document.documentElement.lang = english() ? 'en' : 'zh-CN';
    nav('size').querySelector('.nav-text').textContent = l('尺寸助手', 'Size assistant');
    document.querySelectorAll('[data-workspace-group]').forEach(el => { el.textContent = groups[el.dataset.workspaceGroup][english() ? 1 : 0]; });
    $('toolSearch').placeholder = l('搜索工具…', 'Search tools…');
    $('toolSearch').ariaLabel = l('搜索简易工具', 'Search quick tools');
    $('toolFilters').ariaLabel = l('工具分类', 'Tool category');
    $('toolEmptyText').textContent = l('没有匹配的工具', 'No matching tools');
    reset.textContent = l('清除搜索与筛选', 'Clear search and filters');
    $('commandTitle').textContent = l('查找工具', 'Find a tool');
    $('commandQuery').placeholder = l('搜索功能、中英文名称…', 'Search tools by name…');
    $('commandQuery').ariaLabel = l('搜索功能', 'Search all tools');
    $('commandClose').ariaLabel = l('关闭', 'Close');
    $('commandHelp').textContent = l('仅定位工具，不会直接修改画布 · Esc 关闭', 'Locate tools without changing the canvas · Esc to close');
    cards.forEach(card => {
      if (toolNames[card.dataset.key]) card.querySelector('.tc-title').textContent = toolNames[card.dataset.key][english() ? 1 : 0];
      const tip = card.querySelector('.tc-tooltip');
      card.title = tip?.textContent || '';
      if (tip) { tip.id = 'tool-help-' + card.dataset.key; card.setAttribute('aria-describedby', tip.id); }
    });
    renderFilters(); filterTools(); refreshHeader();
    if (dialog.open) renderCommands();
  }
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const followSystemTheme = () => { if (PersistentCache.get('user_theme') === 'system') document.documentElement.dataset.theme = scheme.matches ? 'dark' : 'light'; };
  scheme.addEventListener('change', followSystemTheme);
  followSystemTheme();
  window.PluginWorkspace = { navigate, openSettings: () => navigate('settings'), closeSettings: () => navigate(previous), refresh, prepareFillSettings };
  document.querySelectorAll('[data-ui-icon]').forEach(el => window.PluginIcons.put(el, el.dataset.uiIcon));
  refresh();
  navigate('simple');
})();
