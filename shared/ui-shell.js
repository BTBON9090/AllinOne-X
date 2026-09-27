/* Tabler Icons (MIT), embedded offline by scripts/sync-ui-shell.mjs. */
(() => {
  const icons = __TABLER_ICONS__;
  const navIcons = { simple:'bolt', select:'search', text:'replace', smartFill:'forms', jumpback:'map-pin', refiner:'diamond', skew:'transform', size:'ruler-measure-2', duplicate:'copy', ppt:'presentation', i18n:'language', componentBuilder:'components', compkit:'palette', theory:'book' };
  const toolIcons = { reverse_component:'components', to_frame:'frame', to_rect:'square', split_text:'scissors', join_text:'link', remove_al:'layout-off', add_al_wrapper:'layout-grid', up_one:'arrow-up', up_all:'arrows-up', ungroup_all:'box', unlock_all:'lock-open', swap_fs:'arrows-exchange', reset_image:'aspect-ratio', sort_layers:'eye', sort_by_name:'sort-ascending-letters', rename_content:'tag', detach_all:'unlink', remove_hidden:'eye-off', pixel_perfect:'focus-2', swap_positions:'arrows-shuffle', create_styles:'sparkles', match_styles:'color-swatch' };
  const glyphIcons = {
    '🔒':'lock','⚠':'alert-circle','⚡':'bolt','🔍':'search','📝':'replace','🧠':'brain','📍':'map-pin',
    '💎':'diamond','🔷':'transform','🧬':'copy','📊':'presentation','🌐':'language','🎨':'palette',
    '📖':'book','⚙':'settings','👋':'hand-stop','🖼':'frame','🧱':'square','✂':'scissors','🔗':'link',
    '⛔':'layout-off','🍱':'layout-grid','📤':'upload','🚀':'arrows-up','💥':'box','🔓':'lock-open',
    '🔄':'refresh','↔':'arrows-left-right','⚖':'aspect-ratio','👁':'eye','🔤':'sort-ascending-letters',
    '🏷':'tag','💔':'unlink','👻':'eye-off','🎯':'focus-2','🔀':'arrows-shuffle','✨':'sparkles',
    '💅':'color-swatch','💠':'components','🌄':'photo','💬':'message-circle','🧩':'components',
    '💮':'diamond','🎞':'presentation','🎭':'palette','⬅':'chevron-left','🖱':'focus-2','💕':'heart',
    '🧹':'checklist','📑':'copy','📦':'box','🎉':'check','🔥':'bolt','✅':'check','💡':'bulb',
    '🗑':'trash','📥':'download','📋':'clipboard','💾':'device-floppy','🤖':'robot','🔑':'key',
    '📐':'ruler-measure-2','🔧':'settings','📚':'book','⬇':'arrow-down','➕':'plus','🔲':'square',
    '😜':'message-circle','✳':'sparkles','⬛':'square','⭕':'circle','✏':'pencil','⭐':'star',
    '🛑':'alert-circle','🌀':'loader','⏳':'loader','❌':'x','🔟':'number-10','♿':'accessible',
    '🎙':'microphone','🥽':'device-vision-pro','❤':'heart','🤔':'help','🏔':'mountain','👀':'eye',
    '🌟':'star','🪝':'link','⚛':'atom','🌰':'box','🛠':'settings','▶':'player-play','👉':'arrow-up',
    '🌙':'moon','💪':'bolt','🌈':'palette','☕':'coffee','◇':'diamond','❖':'components','◆':'diamond',
    '◨':'layout-sidebar-left-collapse','✕':'x','×':'x','⇄':'arrows-exchange','←':'chevron-left'
  };
  const svg = name => '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (icons[name] || icons['circle']) + '</svg>';
  const putIcon = (element, name) => {
    if (!element || (element.dataset.shellIcon === name && element.querySelector('svg'))) return;
    element.innerHTML = svg(name);
    element.dataset.shellIcon = name;
  };
  const controls = '.nav-icon-slot,.tc-icon,.btn-icon,.es-icon,.success-icon,.success-emoji,.section-title,.settings-section-title,.settings-item-label-icon,.builder-mode-symbol,.smart-setting-btn,.jumpback-hero-icon,.btn-clear-input,.btn-back-sub,.sub-header,.card-icon,.theory-icon,.theory-capsule-icon,.size-hero-title,[data-key],button,#dashGreeting,#testConnectionIcon,#errorToast';
  const protectedContent = 'script,style,svg,textarea,input,select,option,pre,code,[contenteditable],#aiResultArea,#i18nTransList,.text-preview-main,.smart-label,.tc-tooltip,.toast-message';
  function decorate(element) {
    if (!(element instanceof Element) || element.closest(protectedContent)) return;
    if (element.matches('.nav-icon-slot')) {
      putIcon(element, navIcons[element.closest('[data-nav]')?.dataset.nav]);
      return;
    }
    if (element.matches('.tc-icon')) {
      putIcon(element, toolIcons[element.closest('[data-key]')?.dataset.key]);
      return;
    }
    // Convert only UI-owned labels. Input values and document/AI content stay literal.
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) {
      const text = walker.currentNode;
      if (!text.parentElement.closest(protectedContent)) texts.push(text);
    }
    for (const text of texts) {
      const value = text.nodeValue;
      const points = Array.from(value);
      if (!points.some(char => glyphIcons[char])) continue;
      // Mathematical multiplication and textual arrows remain text unless this is an icon-only control.
      const iconOnly = value.trim().length <= 2;
      if (iconOnly && element.matches('button,[onclick]') && !element.getAttribute('aria-label')) {
        const name = points.map(char => glyphIcons[char]).find(Boolean);
        const labels = { settings:'设置', trash:'删除', pencil:'编辑', x:'关闭', download:'导出', upload:'导入', 'device-floppy':'保存', 'chevron-left':'返回', refresh:'刷新', plus:'添加' };
        const label = element.getAttribute('title') || (element.matches('.btn-clear-input') ? '清空输入' : labels[name]);
        if (label) { element.setAttribute('aria-label', label); element.title = label; }
      }
      const fragment = document.createDocumentFragment();
      let buffer = '';
      const flush = () => { if (buffer) { fragment.append(document.createTextNode(buffer)); buffer = ''; } };
      for (const char of points) {
        if (char === '\uFE0F') continue;
        const name = glyphIcons[char];
        if (name && (iconOnly || !['×','←','↔'].includes(char))) {
          flush();
          const span = document.createElement('span');
          span.innerHTML = svg(name);
          fragment.append(span.firstChild);
        } else buffer += char;
      }
      flush();
      text.replaceWith(fragment);
    }
  }
  function enhance(root) {
    if (!(root instanceof Element)) return;
    const navParent = root.closest('.nav-item');
    if (navParent) {
      const label = navParent.querySelector('.nav-text')?.textContent.trim() || '';
      navParent.title = label;
      navParent.setAttribute('aria-label', label);
    }
    if (root.matches(controls)) decorate(root);
    root.querySelectorAll(controls).forEach(decorate);
    root.querySelectorAll('.nav-item').forEach(item => {
      item.setAttribute('role', 'button');
      item.tabIndex = 0;
      const label = item.querySelector('.nav-text')?.textContent.trim() || '';
      item.title = label;
      item.setAttribute('aria-label', label);
      item.setAttribute('aria-current', item.classList.contains('active') ? 'page' : 'false');
    });
    root.querySelectorAll('[onclick]:not(button):not(input):not(select):not(textarea):not(a)').forEach(item => {
      if (!item.hasAttribute('tabindex')) item.tabIndex = 0;
      if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    });
  }
  enhance(document.body);
  if (!document.querySelector('.nav-item.active')) {
    const firstNav = document.querySelector('[data-nav="simple"]');
    firstNav?.classList.add('active');
    firstNav?.setAttribute('aria-current', 'page');
  }
  document.querySelectorAll('[data-builder-mode]').forEach(button => {
    putIcon(button.querySelector('.builder-mode-symbol'), { single:'diamond', multiple:'copy', set:'components', language:'language' }[button.dataset.builderMode]);
  });
  document.getElementById('sizeLockRatio')?.addEventListener('change', event => {
    if (event.target.checked) {
      const width = Number(document.getElementById('sizeWidth').value);
      const height = Number(document.getElementById('sizeHeight').value);
      if (width > 0 && height > 0) sizeAssistantState.ratio = width / height;
    }
  });
  const sizeActions = document.querySelector('#sizePanel .size-actions');
  if (sizeActions) {
    sizeActions.classList.add('size-panel-actions');
    document.getElementById('sizePanel').append(sizeActions);
  }
  putIcon(document.querySelector('.size-swap'), 'arrows-exchange');
  document.querySelectorAll('.size-swap').forEach(button => button.setAttribute('aria-label', '横竖切换'));
  document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.setAttribute('aria-current', nav === item ? 'page' : 'false'));
  }));
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (!(target instanceof Element) || target.matches('input,textarea,select,button,a,[contenteditable]')) return;
    if ((event.key === 'Enter' || event.key === ' ') && target.hasAttribute('onclick')) {
      event.preventDefault();
      target.click();
    }
  });
  for (const [id, other] of [['sfPrefix','sfSuffix'], ['sfSuffix','sfPrefix']]) {
    document.getElementById(id)?.addEventListener('change', event => {
      if (event.target.checked) document.getElementById(other).checked = false;
    });
  }
  // Observe just changed subtrees; avoid reprocessing the whole panel while AI streams.
  const pending = new Set();
  let scheduled = false;
  new MutationObserver(records => {
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : record.target.parentElement;
      if (!target || target.closest(protectedContent)) continue;
      const control = target.closest(controls);
      if (control) pending.add(control);
      record.addedNodes.forEach(node => { if (node instanceof Element && !node.matches('svg')) pending.add(node); });
    }
    if (pending.size && !scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        const roots = [...pending]; pending.clear(); scheduled = false;
        roots.forEach(enhance);
      });
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  if (PersistentCache.get('compact_mode') === true) setCompactMode(true);
})();
