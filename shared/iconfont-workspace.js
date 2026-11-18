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
      <p class="layer-help" id="iconfontStatus" role="status" tabindex="-1"></p>
      <div id="iconfontIssues" hidden>
        <h4 class="iconfont-scope" id="iconfontIssueTitle"></h4>
        <p class="layer-help" id="iconfontIssueHelp"></p>
        <div class="iconfont-issue-tools">
          <label><input type="checkbox" id="iconfontIssueAll"><span></span></label>
          <button type="button" class="secondary-btn" id="iconfontRetry"></button>
        </div>
        <ul class="iconfont-results" id="iconfontResults" aria-labelledby="iconfontIssueTitle"></ul>
        <div id="iconfontIssuePages" hidden>
          <button type="button" class="secondary-btn" id="iconfontIssuePrev">‹</button>
          <span id="iconfontIssuePage"></span>
          <button type="button" class="secondary-btn" id="iconfontIssueNext">›</button>
        </div>
      </div>
      <p class="layer-help" id="iconfontLocateStatus" role="status" hidden></p>
      <div id="iconfontExports" hidden>
        <button type="button" class="secondary-btn" id="iconfontZip"></button>
        <details id="iconfontIndividual">
          <summary></summary>
          <div>
            <select id="iconfontFile"></select>
            <button type="button" class="secondary-btn" id="iconfontDownload"></button>
          </div>
        </details>
      </div>
      <p class="layer-help" id="iconfontDownloadError" role="alert" hidden></p>
    </section>`;
  $('contentScroll').append(panel);

  const mode = $('iconfontMode'), allTargets = $('iconfontAll'), zipButton = $('iconfontZip');
  const buttons = { inplace:$('iconfontInplace'), copy:$('iconfontRun') };
  const allIssues = $('iconfontIssueAll'), retryButton = $('iconfontRetry'), fileSelect = $('iconfontFile');
  const excluded = { selection:new Set(), children:new Set() };
  const batches = { inplace:null, copy:null };
  const pageSize = 40;
  let selection = null, pageIndex = 0, serial = 0, pending = null, displayed = 'copy';
  let packing = false, downloadError = false;
  let locateRequest = null;
  const sourceMode = () => mode.querySelector('input:checked').value;
  const targets = () => selection?.targets?.[sourceMode()] || [];
  const exportable = item => item.status === 'fixed' && typeof item.svg === 'string' && item.svg.length > 0;

  function assignFileNames(rows) {
    const used = new Set(rows.filter(item => item.filename).map(item => item.filename.toLowerCase()));
    for (const item of rows) {
      if (!exportable(item) || item.filename) continue;
      let base = String(item.name || '').normalize('NFC').replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g, '-')
        .replace(/\.svg$/i, '').trim().replace(/^[. ]+|[. ]+$/g, '').slice(0, 72) || 'icon';
      if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(base)) base = '_' + base;
      let name = base + '.svg';
      for (let suffix = 2; used.has(name.toLowerCase()); suffix++) name = base + '-' + suffix + '.svg';
      used.add(name.toLowerCase());
      item.filename = name;
    }
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
    buttons.inplace.textContent = pending?.action === 'inplace' && !pending.retry ? l('正在修复原图层…', 'Repairing originals…') : l('仅修复', 'Repair in place');
    buttons.copy.textContent = pending?.action === 'copy' && !pending.retry ? l('正在修复副本…', 'Repairing copies…') : l('创建副本后修复', 'Create and repair copies');
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
    $('iconfontExports').hidden = !ready;
    zipButton.disabled = packing || pending?.action === 'copy';
    $('iconfontDownload').disabled = pending?.action === 'copy';
    zipButton.textContent = packing ? l('正在打包…', 'Preparing ZIP…') : l(`下载 ZIP（${ready} 个 SVG）`, `Download ZIP (${ready} SVG${ready === 1 ? '' : 's'})`);
    $('iconfontDownloadError').hidden = inplace || !downloadError;
    $('iconfontDownloadError').textContent = l('打包失败，请重试或逐个下载。', 'Could not create the ZIP. Retry or download files individually.');
    let status;
    if (pending?.action === displayed) {
      status = pending.retry ? l('正在重试异常图标', 'Retrying icons') : inplace ? l('正在修复原图层', 'Repairing originals') : l('正在创建并修复副本', 'Creating and repairing copies');
      status += ` · ${pending.done} / ${pending.total}`;
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

  function updateIssueSelection(batch) {
    const count = batch.checked.size, total = batch.issues.length;
    allIssues.checked = total > 0 && count === total;
    allIssues.indeterminate = count > 0 && count < total;
    allIssues.disabled = Boolean(pending);
    retryButton.textContent = count ? l(`重试所选（${count}）`, `Retry selected (${count})`) : l('重试所选', 'Retry selected');
    retryButton.disabled = !count || Boolean(pending) || packing;
  }

  function renderIssues(batch) {
    const rows = batch.issues;
    $('iconfontIssues').hidden = !rows.length;
    $('iconfontIssueTitle').textContent = l(`异常图标（${rows.length}）`, `Icons needing attention (${rows.length})`);
    updateIssueSelection(batch);
    const pageCount = Math.ceil(rows.length / pageSize);
    batch.page = Math.max(0, Math.min(batch.page, pageCount - 1));
    const fragment = document.createDocumentFragment();
    const pageRows = rows.slice(batch.page * pageSize, (batch.page + 1) * pageSize);
    for (const [index, item] of pageRows.entries()) {
      const row = document.createElement('li');
      const check = document.createElement('input'), name = document.createElement('button');
      const label = item.name || l('未命名图标', 'Unnamed icon');
      row.dataset.sourceId = item.sourceId;
      check.type = 'checkbox';
      check.value = item.sourceId;
      check.checked = batch.checked.has(item.sourceId);
      check.disabled = Boolean(pending);
      check.setAttribute('aria-label', l('勾选 ', 'Select ') + label);
      const checkArea = document.createElement('label');
      checkArea.className = 'iconfont-issue-check';
      checkArea.append(check);
      name.type = 'button';
      name.dataset.sourceId = item.sourceId;
      name.dataset.userContent = '';
      name.textContent = label;
      name.title = l('在画布中定位 ', 'Locate on canvas: ') + label;
      name.setAttribute('aria-label', name.title);
      name.disabled = Boolean(pending);
      const info = document.createElement('div'), note = document.createElement('small');
      note.id = 'iconfontIssueNote-' + index;
      note.dataset.userContent = '';
      name.setAttribute('aria-describedby', note.id);
      const state = item.status === 'skipped' ? l('已跳过', 'Skipped') : l('失败', 'Failed');
      note.textContent = item.reason ? state + ' · ' + item.reason : state;
      info.append(name, note);
      row.append(checkArea, info);
      fragment.append(row);
    }
    $('iconfontResults').replaceChildren(fragment);
    $('iconfontIssuePages').hidden = pageCount <= 1;
    $('iconfontIssuePage').textContent = (batch.page + 1) + ' / ' + pageCount;
    $('iconfontIssuePrev').disabled = batch.page === 0;
    $('iconfontIssueNext').disabled = batch.page + 1 >= pageCount;
  }

  function renderItems() {
    updateReport();
    const batch = batches[displayed];
    if (!batch) return;
    renderIssues(batch);
    const note = $('iconfontLocateStatus');
    note.hidden = !batch.locateError;
    note.textContent = batch.locateError;
    if (displayed !== 'copy') return;
    const files = batch.items.filter(exportable);
    const fragment = document.createDocumentFragment();
    for (const item of files) {
      const option = new Option(item.filename, item.sourceId);
      option.dataset.userContent = '';
      fragment.append(option);
    }
    fileSelect.replaceChildren(fragment);
    if (batch.fileId) fileSelect.value = batch.fileId;
    batch.fileId = fileSelect.value;
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
    allIssues.nextElementSibling.textContent = l('全选异常', 'Select all issues');
    $('iconfontIssueHelp').textContent = l('点击名称定位到画布，调整后勾选重试。', 'Click a name to locate the layer on the canvas. After editing, check it and retry.');
    $('iconfontIssuePrev').setAttribute('aria-label', l('上一页异常', 'Previous page of issues'));
    $('iconfontIssueNext').setAttribute('aria-label', l('下一页异常', 'Next page of issues'));
    $('iconfontIndividual').querySelector('summary').textContent = l('下载单个 SVG', 'Download an individual SVG');
    fileSelect.setAttribute('aria-label', l('选择 SVG 文件', 'Choose an SVG file'));
    $('iconfontDownload').textContent = l('下载 SVG', 'Download SVG');
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
  function requestId() {
    return 'iconfont-' + Date.now() + '-' + (++serial);
  }

  function run(action, retry) {
    if (pending || packing) return;
    const mode = sourceMode();
    const ids = retry ? batches[action].issues.filter(item => batches[action].checked.has(item.sourceId)).map(item => item.sourceId)
      : targets().map(target => target.id).filter(id => !excluded[mode].has(id));
    if (!ids.length) return;
    const id = requestId();
    const previous = batches[action];
    const previousExport = action === 'copy' && { open:$('iconfontIndividual').open, error:downloadError };
    if (!retry) {
      batches[action] = { reportId:id, items:[], issues:[], checked:new Set(), page:0, error:'', locateError:'', fileId:'' };
      if (action === 'copy') { downloadError = false; $('iconfontIndividual').open = false; }
    }
    const batch = batches[action];
    displayed = action;
    locateRequest = null;
    batch.locateError = '';
    pending = { action, retry, id, ids:new Set(ids), done:0, total:ids.length, previous, previousExport };
    updateSelection();
    renderItems();
    postMsg('iconfont-repair-run', { requestId:id, action, targetIds:ids, ...(retry ? { retryOf:batch.reportId } : { mode }) });
  }
  for (const action of actions) buttons[action].onclick = () => run(action, false);
  retryButton.onclick = () => run(displayed, true);
  allIssues.onchange = () => {
    const batch = batches[displayed];
    batch.checked = new Set(allIssues.checked ? batch.issues.map(item => item.sourceId) : []);
    renderIssues(batch);
  };
  $('iconfontResults').onchange = event => {
    if (event.target.type !== 'checkbox') return;
    const batch = batches[displayed], input = event.target;
    if (input.checked) batch.checked.add(input.value);
    else batch.checked.delete(input.value);
    updateIssueSelection(batch);
  };
  $('iconfontResults').onclick = event => {
    if (event.target.closest('label') || pending) return;
    const row = event.target.closest('li');
    if (!row) return;
    const sourceId = row.dataset.sourceId, id = requestId(), batch = batches[displayed];
    locateRequest = { id, sourceId, batch };
    batch.locateError = '';
    $('iconfontLocateStatus').hidden = true;
    postMsg('iconfont-locate-source', { requestId:id, sourceId });
  };
  $('iconfontIssuePrev').onclick = () => { const batch = batches[displayed]; batch.page--; renderIssues(batch); };
  $('iconfontIssueNext').onclick = () => { const batch = batches[displayed]; batch.page++; renderIssues(batch); };
  fileSelect.onchange = () => { batches.copy.fileId = fileSelect.value; };
  $('iconfontDownload').onclick = () => {
    const item = batches.copy?.items.find(item => item.sourceId === fileSelect.value && exportable(item));
    if (item) save(new Blob([item.svg], { type:'image/svg+xml' }), item.filename);
  };
  panel.querySelectorAll('[data-report]').forEach(button => {
    button.onclick = () => { displayed = button.dataset.report; renderItems(); };
  });
  zipButton.onclick = async () => {
    const items = batches.copy?.items || [];
    if (displayed !== 'copy' || zipButton.disabled || !items.some(exportable)) return;
    packing = true; downloadError = false;
    updateReport(); updateSelection(); updateIssueSelection(batches.copy);
    try {
      const zip = new JSZip();
      for (const item of items) if (exportable(item)) zip.file(item.filename, item.svg);
      save(await zip.generateAsync({ type:'blob' }), 'iconfont-svg.zip');
    } catch (_) { downloadError = true; }
    finally { packing = false; updateReport(); updateSelection(); updateIssueSelection(batches[displayed]); }
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
    if (message.type === 'iconfont-locate-result') {
      if (!locateRequest || message.requestId !== locateRequest.id || message.sourceId !== locateRequest.sourceId) return;
      const batch = locateRequest.batch;
      locateRequest = null;
      batch.locateError = message.ok ? '' : message.error || l('无法定位原图层。', 'Could not locate the original layer.');
      if (batch === batches[displayed]) {
        $('iconfontLocateStatus').textContent = batch.locateError;
        $('iconfontLocateStatus').hidden = !batch.locateError;
      }
      return;
    }
    if (!pending || message.requestId !== pending.id) return;
    if (message.type === 'iconfont-repair-progress') {
      pending.done = message.done;
      pending.total = message.total;
      updateReport();
    } else if (message.type === 'iconfont-repair-result') {
      const { action, retry, ids, previous, previousExport } = pending;
      let batch = batches[action];
      const returned = new Map((message.items || []).filter(item => ids.has(item.sourceId)).map(item => [item.sourceId, item]));
      if (!retry && message.error && !returned.size && previous?.items.length) {
        batches[action] = batch = previous;
        if (previousExport) {
          $('iconfontIndividual').open = previousExport.open;
          downloadError = previousExport.error;
        }
      } else if (retry) {
        batch.items = batch.items.map(item => returned.get(item.sourceId) || item);
      } else {
        batch.reportId = message.reportId || pending.id;
        batch.items = [...returned.values()];
      }
      batch.issues = batch.items.filter(item => item.status !== 'fixed');
      batch.checked = new Set(batch.issues.filter(item => batch.checked.has(item.sourceId)).map(item => item.sourceId));
      if (action === 'copy') assignFileNames(batch.items);
      batch.error = message.error || '';
      pending = null;
      renderItems();
      updateSelection();
      if (displayed === action && retry && !batch.issues.length && panel.getClientRects().length && document.activeElement === document.body) $('iconfontStatus').focus();
    }
  });
  window.IconfontWorkspace = { refresh, inspect:() => postMsg('get-iconfont-selection') };
})();
