/* Shared workspace navigation. Keep tools directly visible; no duplicate shell controls. */
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
  const english = () => curLang === 'en';
  const l = (zh, en) => english() ? en : zh;
  const nav = key => document.querySelector(`.nav-item[data-nav="${key}"]`);
  const label = key => key === 'settings' ? l('设置', 'Settings') : key === 'size' ? l('尺寸助手', 'Size assistant') : nav(key).querySelector('.nav-text').textContent.trim();
  const panelIds = [...Object.values(routes).map(route => route[0]), 'selectionFooter', 'settingsPanel', 'emptyPanel'];
  const cards = [...document.querySelectorAll('#toolGrid .tool-card')];
  const toolNames = {
    reverse_component:['实例逆向','Rebuild main component'], to_frame:['矩形转画板','Rectangle to frame'], to_rect:['画板转矩形','Frame to rectangle'],
    split_text:['拆分文本','Split text'], join_text:['合并文本','Join text'], remove_al:['移除自动布局','Remove auto layout'], add_al_wrapper:['包裹自动布局','Wrap in auto layout'],
    up_one:['上移一层','Move up one level'], up_all:['移至顶层','Move to page root'], ungroup_all:['解散所有编组','Ungroup all'], unlock_all:['解锁所有图层','Unlock layers'],
    swap_fs:['互换填充描边','Swap fill / stroke'], reset_image:['还原图片比例','Reset image ratio'], sort_layers:['按位置排序','Sort by position'], sort_by_name:['名称排序','Sort by name'],
    rename_content:['按文本命名','Name from text'], detach_all:['分离组件实例','Detach instances'], remove_hidden:['删除隐藏图层','Delete hidden layers'], pixel_perfect:['像素对齐','Align to pixels'],
    swap_positions:['交换图层位置','Swap positions'], create_styles:['创建本地样式','Create local styles'], match_styles:['重新关联样式','Match local styles']
  };
  let current = 'simple';
  let previous = 'simple';
  const scrollPositions = new Map();
  const currentPanel = () => $(current === 'settings' ? 'settingsPanel' : routes[current][0]);
  const rememberScroll = () => {
    const panel = currentPanel();
    scrollPositions.set(current, [panel, ...panel.querySelectorAll('*')].filter(el => el.scrollHeight > el.clientHeight && el.clientHeight > 0).map(el => [el, el.scrollTop]));
  };

  function refreshLocation() {
    currentPanel().setAttribute('role', 'region');
    currentPanel().setAttribute('aria-label', label(current));
    Object.entries(routes).forEach(([key, route]) => {
      nav(key).title = label(key) + ' — ' + route[english() ? 3 : 2];
    });
  }

  function navigate(key) {
    if (key !== 'settings' && !routes[key]) return;
    rememberScroll();
    if (key === 'settings' && current !== 'settings') previous = current;
    current = key;
    document.querySelector('.main-content').dataset.route = key;
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
    refreshLocation();
    window.PluginLocalization?.refresh();
    if (key === 'settings') initSettingsPanel();
    if (key === 'componentBuilder') requestComponentBuilderSelection();
    if (key === 'size') { initSizeAssistant(); updateSizeSummary(); postMsg('size-assistant-inspect'); }
    for (const [el, top] of scrollPositions.get(key) || []) if (el.isConnected) el.scrollTop = top;
  }

  // All tools remain directly accessible; headings separate tasks without folding.
  const navScroll = document.querySelector('.nav-scroll');
  navScroll.setAttribute('role', 'navigation');
  navScroll.setAttribute('aria-label', 'All in One');
  navScroll.querySelectorAll('.nav-section-label').forEach(el => el.remove());
  const navGroups = [
    ['效率工具', 'Productivity', ['simple','select','text','smartFill','size','jumpback']],
    ['组件与图层', 'Components & Layers', ['refiner','componentBuilder','duplicate','compkit']],
    ['设计拓展', 'Design Extras', ['i18n','skew','ppt','theory']]
  ].map(([zh, en, keys], index) => {
    const group = document.createElement('section');
    group.className = 'nav-group';
    const heading = document.createElement('div');
    heading.id = `navGroup${index}`;
    heading.className = 'nav-group-label';
    group.setAttribute('aria-labelledby', heading.id);
    group.append(heading, ...keys.map(nav));
    navScroll.append(group);
    return { heading, zh, en };
  });

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
    navGroups.forEach(({ heading, zh, en }) => { heading.textContent = l(zh, en); });
    window.PluginWindow?.refresh();
    window.PluginBookmarks?.refresh();
    document.documentElement.lang = english() ? 'en' : 'zh-CN';
    i18nUpdateModeDesc();
    document.querySelector('#sfPrefix + span').textContent = l('前缀', 'Prefix');
    document.querySelector('#sfSuffix + span').textContent = l('后缀', 'Suffix');
    $('sfAffixText').placeholder = l('自定义字符', 'Characters');
    $('sfAffixText').setAttribute('aria-label', l('自定义前后缀字符，支持空格', 'Custom affix characters, including spaces'));
    $('sfAffixApply').title = l('将字符添加到现有文字的前面或后面', 'Add these characters before or after existing text');
    $('sfAffixApply').setAttribute('aria-label', l('添加自定义字符', 'Add custom characters'));
    for (const [id, title] of [
      ['customEditorOrderFill', l('顺序录入当前内容', 'Fill current content in order')],
      ['customEditorRandomFill', l('随机录入当前内容', 'Fill current content randomly')]
    ]) {
      $(id).title = title;
      $(id).setAttribute('aria-label', title);
    }
    updateGreeting();
    nav('size').querySelector('.nav-text').textContent = l('尺寸助手', 'Size assistant');
    cards.forEach(card => {
      if (toolNames[card.dataset.key]) card.querySelector('.tc-title').textContent = toolNames[card.dataset.key][english() ? 1 : 0];
      const tip = card.querySelector('.tc-tooltip');
      card.title = tip?.textContent || '';
      if (tip) { tip.id = 'tool-help-' + card.dataset.key; card.setAttribute('aria-describedby', tip.id); }
    });
    refreshLocation();
    window.PluginLocalization?.refresh();
    window.TheoryWorkspace?.refresh();
    if (sizeAssistantState.initialized) {
      renderSizePresets();
      const preset = SIZE_ASSISTANT_PRESETS.find(item => item.id === sizeAssistantState.selectedId);
      $('sizeGuidance').textContent = preset ? PluginLocalization.t(preset.note)
        : l('自定义尺寸；勾选锁定宽高比可联动调整。','Custom dimensions. Lock the aspect ratio to resize proportionally.');
    }
  }
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const followSystemTheme = () => { if (PersistentCache.get('user_theme') === 'system') document.documentElement.dataset.theme = scheme.matches ? 'dark' : 'light'; };
  scheme.addEventListener('change', followSystemTheme);
  followSystemTheme();
  window.PluginWorkspace = { navigate, openSettings: () => navigate('settings'), closeSettings: () => navigate(previous), refresh, prepareFillSettings };
  refresh();
  navigate('simple');
})();
