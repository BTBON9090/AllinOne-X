/* Each selected icon produces its own SVG. Keep the last batch available while
   the user moves around the canvas or switches panels. */
(() => {
  const actions = ['inplace', 'copy'];
  const $ = id => document.getElementById(id);
  const l = (zh, en) => curLang === 'en' ? en : zh;
  const nav = document.createElement('div');
  nav.className = 'nav-item';
  nav.dataset.nav = 'iconfont';
  nav.setAttribute('onclick', "switchGroup('iconfont', this)");
  nav.innerHTML = '<span class="nav-icon-slot"></span><span class="nav-text"></span><span class="nav-dot"></span>';
  document.querySelector('.nav-scroll').append(nav);

  const panel = document.createElement('section');
  panel.id = 'iconfontPanel';
  panel.className = 'layer-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <section class="layer-ai-card">
      <h2 class="layer-title" id="iconfontTitle"></h2>
      <p class="layer-help" id="iconfontIntro"></p>
      <fieldset id="iconfontMode">
        <legend class="iconfont-scope"></legend>
        <label><input type="radio" name="iconfontSource" value="selection" checked><span></span></label>
        <label><input type="radio" name="iconfontSource" value="children"><span></span></label>
      </fieldset>
      <fieldset id="iconfontTargets">
        <legend class="iconfont-scope"></legend>
        <div class="iconfont-target-head">
          <label><input type="checkbox" id="iconfontAll"><span></span></label>
          <span id="iconfontSelection" class="layer-help" role="status"></span>
        </div>
        <div id="iconfontTargetList"></div>
        <div id="iconfontPages" hidden>
          <button type="button" class="secondary-btn" id="iconfontPrev">‹</button>
          <span id="iconfontPage"></span>
          <button type="button" class="secondary-btn" id="iconfontNext">›</button>
        </div>
      </fieldset>
      <div class="iconfont-actions">
        <button type="button" class="secondary-btn" id="iconfontInplace"></button>
        <button type="button" class="primary-btn" id="iconfontRun"></button>
      </div>
    </section>
    <section class="layer-ai-card" id="iconfontReport" hidden>
      <h3 class="layer-title" id="iconfontResultTitle"></h3>
      <div id="iconfontReports" hidden>
        <button class="secondary-btn" type="button" data-report="inplace"></button>
        <button class="secondary-btn" type="button" data-report="copy"></button>
      </div>
      <p class="layer-help" id="iconfontStatus" role="status"></p>
      <button type="button" class="secondary-btn" id="iconfontZip" hidden></button>
      <p class="layer-help" id="iconfontDownloadError" role="alert" hidden></p>
      <ul class="iconfont-results" id="iconfontResults"></ul>
    </section>`;
  $('contentScroll').append(panel);

  const mode = $('iconfontMode'), allTargets = $('iconfontAll'), zipButton = $('iconfontZip');
  const buttons = { inplace:$('iconfontInplace'), copy:$('iconfontRun') };
  const excluded = { selection:new Set(), children:new Set() };
  const batches = { inplace:null, copy:null };
  const pageSize = 40;
  let selection = null, pageIndex = 0, serial = 0, pending = null, displayed = 'copy';
  let packing = false, downloadError = false;
  const sourceMode = () => mode.querySelector('input:checked').value;
  const targets = () => selection?.targets?.[sourceMode()] || [];
  const exportable = item => item.status === 'fixed' && typeof item.svg === 'string' && item.svg.length > 0;

  function fileNames(rows) {
    const used = new Set();
    return rows.map(item => {
      if (!exportable(item)) return '';
      let base = String(item.name || '').normalize('NFC').replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g, '-')
        .replace(/\.svg$/i, '').trim().replace(/^[. ]+|[. ]+$/g, '').slice(0, 72) || 'icon';
      if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(base)) base = '_' + base;
      let name = base + '.svg';
      for (let suffix = 2; used.has(name.toLowerCase()); suffix++) name = base + '-' + suffix + '.svg';
      used.add(name.toLowerCase());
      return name;
    });
  }

  function save(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    try { link.click(); } finally {
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
  }

  function renderTargets() {
    const rows = targets(), ignored = excluded[sourceMode()];
    const fragment = document.createDocumentFragment();
    const pageCount = Math.ceil(rows.length / pageSize);
    pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
    for (const target of rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)) {
      const label = document.createElement('label'), input = document.createElement('input');
      input.type = 'checkbox';
      input.value = target.id;
      input.checked = !ignored.has(target.id);
      const name = document.createElement('span');
      name.dataset.userContent = '';
      name.textContent = target.name || l('未命名图标', 'Unnamed icon');
      label.append(input, name);
      fragment.append(label);
    }
    $('iconfontTargetList').replaceChildren(fragment);
    $('iconfontTargetList').scrollTop = 0;
    $('iconfontPage').textContent = (pageIndex + 1) + ' / ' + pageCount;
    $('iconfontPages').hidden = pageCount <= 1;
    $('iconfontPrev').disabled = pageIndex === 0;
    $('iconfontNext').disabled = pageIndex + 1 >= pageCount;
    updateSelection();
  }

  function updateSelection() {
    const rows = targets(), ignored = excluded[sourceMode()];
    const count = rows.reduce((total, target) => total + (ignored.has(target.id) ? 0 : 1), 0);
    mode.disabled = Boolean(pending);
    $('iconfontTargets').disabled = Boolean(pending);
    allTargets.parentElement.hidden = !rows.length;
    allTargets.checked = rows.length > 0 && count === rows.length;
    allTargets.indeterminate = count > 0 && count < rows.length;
    $('iconfontSelection').textContent = selection === null ? l('正在读取选区…', 'Reading selection…') :
      rows.length ? l(`已勾选 ${count} / ${rows.length}`, `${count} of ${rows.length} checked`) :
      sourceMode() === 'children' ? l('请选择包含图标的画板或组。', 'Select a frame or group containing icons.') :
        l('请在画布上选中一个或多个图标。', 'Select one or more icons on the canvas.');
    buttons.inplace.textContent = pending === 'inplace' ? l('正在修复原图层…', 'Repairing originals…') : l('仅修复', 'Repair in place');
    buttons.copy.textContent = pending === 'copy' ? l('正在修复副本…', 'Repairing copies…') : l('创建副本后修复', 'Create and repair copies');
    for (const action of actions) buttons[action].disabled = !count || Boolean(pending) || packing;
  }

  function updateReport() {
    const batch = batches[displayed], inplace = displayed === 'inplace';
    $('iconfontReport').hidden = !batch;
    if (!batch) return;
    $('iconfontResultTitle').textContent = inplace ? l('原图层修复结果', 'In-place repair results') : l('副本修复结果', 'Copy repair results');
    $('iconfontReports').hidden = !batches.inplace || !batches.copy;
    panel.querySelectorAll('[data-report]').forEach(button => {
      const original = button.dataset.report === 'inplace';
      button.textContent = original ? l('原图层', 'Originals') : l('副本', 'Copies');
      button.setAttribute('aria-pressed', String(button.dataset.report === displayed));
    });
    const ready = inplace ? 0 : batch.items.filter(exportable).length;
    zipButton.hidden = !ready;
    zipButton.disabled = packing;
    zipButton.textContent = packing ? l('正在打包…', 'Preparing ZIP…') : l(`下载 ZIP（${ready} 个 SVG）`, `Download ZIP (${ready} SVG${ready === 1 ? '' : 's'})`);
    $('iconfontDownloadError').hidden = inplace || !downloadError;
    $('iconfontDownloadError').textContent = l('打包失败，请重试或逐个下载。', 'Could not create the ZIP. Retry or download files individually.');
    let status;
    if (pending === displayed) {
      status = inplace ? l('正在修复原图层', 'Repairing originals') : l('正在创建并修复副本', 'Creating and repairing copies');
      status += ` · ${batch.done} / ${batch.total}`;
    } else if (batch.items.length) {
      const fixed = batch.items.filter(item => item.status === 'fixed').length;
      const skipped = batch.items.filter(item => item.status === 'skipped').length;
      const failed = batch.items.length - fixed - skipped;
      status = inplace ? l(`原图层已修复 ${fixed} 个`, `${fixed} originals repaired`) : l(`已生成 ${fixed} 个副本`, `${fixed} copies created`);
      if (skipped) status += l(` · 跳过 ${skipped} 个`, ` · ${skipped} skipped`);
      if (failed) status += l(` · 失败 ${failed} 个`, ` · ${failed} failed`);
      if (batch.error) status += ' · ' + batch.error;
    } else status = batch.error || l('本批没有可处理的图标。', 'No icons to process in this batch.');
    $('iconfontStatus').textContent = status;
  }

  function renderItems() {
    const items = batches[displayed]?.items || [];
    const isCopy = displayed === 'copy';
    const fragment = document.createDocumentFragment();
    const names = isCopy ? fileNames(items) : [];
    items.forEach((item, index) => {
      const row = document.createElement('li');
      const info = document.createElement('div');
      const title = document.createElement('strong');
      title.dataset.userContent = '';
      title.textContent = item.name || l('未命名图标', 'Unnamed icon');
      const note = document.createElement('small');
      const state = item.status === 'fixed' ? (isCopy ? l('已生成副本', 'Copy ready') : l('已修复原图层', 'Original repaired'))
        : item.status === 'skipped' ? l('已跳过', 'Skipped') : l('失败', 'Failed');
      note.dataset.userContent = '';
      note.textContent = item.reason ? state + ' · ' + item.reason : state;
      info.append(title, note);
      row.append(info);
      if (isCopy && exportable(item)) {
        const thumb = document.createElement('img');
        thumb.alt = '';
        thumb.loading = 'lazy';
        thumb.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(item.svg);
        row.prepend(thumb);
        const download = document.createElement('button');
        download.type = 'button';
        download.className = 'secondary-btn';
        download.textContent = 'SVG ↓';
        download.setAttribute('aria-label', l('下载 ', 'Download ') + names[index]);
        download.onclick = () => save(new Blob([item.svg], { type:'image/svg+xml' }), names[index]);
        row.append(download);
      }
      fragment.append(row);
    });
    $('iconfontResults').replaceChildren(fragment);
    updateReport();
  }

  function refresh() {
    nav.querySelector('.nav-text').textContent = l('图标修复', 'Iconfont');
    $('iconfontTitle').textContent = l('Iconfont 图标修复', 'Iconfont repair');
    $('iconfontIntro').textContent = l('仅修复会更新勾选的原图层。创建副本后修复会生成单色副本，可下载 SVG。', 'Repair in place updates checked layers. Create and repair copies makes monochrome copies with downloadable SVGs.');
    mode.querySelector('legend').textContent = l('图标来源', 'Icon source');
    mode.querySelector('[value="selection"] + span').textContent = l('每个选中图层作为一个图标', 'One icon per selected layer');
    mode.querySelector('[value="children"] + span').textContent = l('每个直接子图层作为一个图标', 'One icon per direct child of a selected container');
    $('iconfontTargets').querySelector('legend').textContent = l('修复目标', 'Repair targets');
    allTargets.nextElementSibling.textContent = l('全选', 'Select all');
    $('iconfontPrev').setAttribute('aria-label', l('上一页目标', 'Previous page of targets'));
    $('iconfontNext').setAttribute('aria-label', l('下一页目标', 'Next page of targets'));
    renderTargets();
    renderItems();
  }

  mode.onchange = () => { pageIndex = 0; renderTargets(); };
  $('iconfontPrev').onclick = () => { pageIndex--; renderTargets(); };
  $('iconfontNext').onclick = () => { pageIndex++; renderTargets(); };
  allTargets.onchange = () => {
    const ignored = excluded[sourceMode()];
    for (const target of targets()) {
      if (allTargets.checked) ignored.delete(target.id);
      else ignored.add(target.id);
    }
    renderTargets();
  };
  $('iconfontTargetList').onchange = event => {
    const input = event.target;
    if (input.type !== 'checkbox') return;
    const ignored = excluded[sourceMode()];
    if (input.checked) ignored.delete(input.value);
    else ignored.add(input.value);
    updateSelection();
  };
  for (const action of actions) {
    buttons[action].onclick = () => {
      if (buttons[action].disabled) return;
      const mode = sourceMode(), ignored = excluded[mode];
      const targetIds = targets().map(target => target.id).filter(id => !ignored.has(id));
      const requestId = 'iconfont-' + Date.now() + '-' + (++serial);
      pending = displayed = action;
      batches[action] = { requestId, items:[], error:'', done:0, total:targetIds.length };
      if (action === 'copy') downloadError = false;
      updateSelection();
      renderItems();
      postMsg('iconfont-repair-run', { requestId, mode, action, targetIds });
    };
  }
  panel.querySelectorAll('[data-report]').forEach(button => {
    button.onclick = () => { displayed = button.dataset.report; renderItems(); };
  });
  zipButton.onclick = async () => {
    const items = batches.copy?.items || [];
    if (displayed !== 'copy' || packing || !items.some(exportable)) return;
    packing = true; downloadError = false;
    updateReport(); updateSelection();
    try {
      const zip = new JSZip(), names = fileNames(items);
      items.forEach((item, index) => { if (names[index]) zip.file(names[index], item.svg); });
      save(await zip.generateAsync({ type:'blob' }), 'iconfont-svg.zip');
    } catch (_) { downloadError = true; }
    finally { packing = false; updateReport(); updateSelection(); }
  };
  window.addEventListener('message', event => {
    const message = event.data?.pluginMessage;
    if (!message) return;
    if (message.type === 'iconfont-selection') {
      const before = targets();
      selection = message;
      const after = targets();
      if (before.length !== after.length || before.some((target, i) => target.id !== after[i].id || target.name !== after[i].name)) renderTargets();
      else updateSelection();
      return;
    }
    const batch = batches[pending];
    if (!batch || message.requestId !== batch.requestId) return;
    if (message.type === 'iconfont-repair-progress') {
      batch.done = message.done;
      batch.total = message.total;
      updateReport();
    } else if (message.type === 'iconfont-repair-result') {
      const finished = pending;
      pending = null;
      batch.items = Array.isArray(message.items) ? message.items : [];
      batch.error = message.error || '';
      if (displayed === finished) renderItems();
      updateSelection();
    }
  });
  window.IconfontWorkspace = { refresh, inspect:() => postMsg('get-iconfont-selection') };
})();
