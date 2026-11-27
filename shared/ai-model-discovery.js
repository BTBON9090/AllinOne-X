(() => {
  const $ = id => document.getElementById(id);
  const provider = $('settingsAiProvider'), address = $('settingsAiBaseUrl');
  const key = $('settingsAiKey'), model = $('settingsAiModelName');
  const ui = document.createElement('div');
  ui.style.cssText = 'display:grid;gap:5px;margin-top:6px;min-width:0';
  ui.innerHTML = '<button type="button" id="settingsModelDiscover" class="secondary-btn" style="width:auto;justify-self:start;margin:0"></button>' +
    '<select id="settingsModelResults" class="search-box" data-user-content hidden></select>' +
    '<div id="settingsModelDiscoveryStatus" role="status" aria-live="polite" data-user-content style="font-size:11px;color:var(--text-secondary);overflow-wrap:anywhere" hidden></div>';
  model.closest('.settings-item').append(ui);
  const button = $('settingsModelDiscover'), select = $('settingsModelResults'), status = $('settingsModelDiscoveryStatus');
  const l = (zh, en) => curLang === 'en' ? en : zh;
  let active = null, catalog = [], state = '', lastDraft = null;
  const draft = () => ({ provider:provider.value, base:address.value.trim(), key:key.value.trim() });
  const sameDraft = (a,b) => a && b && a.provider === b.provider && a.base === b.base && a.key === b.key;

  function refresh() {
    button.textContent = active ? l('取消查询','Cancel lookup') : l('查询可用模型','List available models');
    select.setAttribute('aria-label',l('服务商返回的模型','Models reported by the provider'));
    if (catalog.length && select.options.length) select.options[0].textContent = l('选择模型…','Choose a model…');
    const messages = {
      loading: l('正在向当前服务商查询模型…','Requesting models from this provider…'),
      managed: l('内置通道固定使用 glm-4.7-flash。填写自己的 API Key 后可查询其他模型。','The built-in connection uses glm-4.7-flash. Enter your own API key to list other models.'),
      credentials: l('请先填写当前服务商的 API Key。','Enter an API key for this provider.'),
      address: l('请填写有效的 HTTPS 服务地址。','Enter a valid HTTPS service URL.'),
      ready: l(`服务商列出 ${catalog.length} 个模型。对话和识图能力可另外测试。`,`The provider lists ${catalog.length} models. Chat and vision support can be tested separately.`),
      empty: l('服务商返回了空列表。你仍可手动填写模型 ID。','The provider returned an empty list. You can enter a model ID manually.'),
      unauthorized: l('服务商拒绝了列表请求。请检查 API Key 的模型列表权限。','The provider denied the list request. Check the model-list permission for your API key.'),
      unsupported: l('该地址未提供兼容的模型列表。请核对地址，或手动填写模型 ID。','This endpoint did not provide a compatible model list. Check the URL or enter a model ID manually.'),
      limited: l('服务商限制了查询频率，请稍后重试。','The provider rate-limited this request. Try again later.'),
      failed: l('无法获取模型列表。请检查网络和服务地址，再次查询。','Could not retrieve the list. Check your connection and service URL, then try again.'),
      timeout: l('查询超时，请重试。','The model lookup timed out. Try again.'),
      cancelled: l('已取消查询。','Lookup cancelled.')
    };
    status.textContent = messages[state] || '';
    status.hidden = !state;
    select.hidden = !catalog.length;
  }
  function reset(nextState = '') {
    active?.abort(); active = null;
    lastDraft = null; catalog = []; select.replaceChildren(); state = nextState;
    refresh();
  }
  function configurationChanged() {
    if (lastDraft && !sameDraft(lastDraft,draft())) reset();
  }
  for (const el of [provider, address, key]) {
    el.addEventListener('change', configurationChanged);
    el.addEventListener('input', configurationChanged);
  }
  for (const id of ['settingsBaseUrlClearBtn','settingsKeyClearBtn']) $(id)?.addEventListener('click', configurationChanged);
  window.addEventListener('message', event => {
    if (event.data?.pluginMessage?.type === 'init-ai-config') configurationChanged();
  });

  function endpoint(config) {
    let url;
    try { url = new URL(config.base); } catch (_) { throw new Error('address'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('address');
    url.hash = '';
    const path = url.pathname.replace(/\/+$/, '').replace(/\/(chat\/completions|messages|responses|models)$/, '');
    let format = 'compatible';
    let headers = { Authorization:'Bearer ' + config.key };
    if (config.provider === 'gemini' && url.hostname === 'generativelanguage.googleapis.com' && /^\/v1(?:beta|alpha)?(?:\/openai)?$/.test(path)) {
      // The native resource name is models/{id}; the chat API takes {id}.
      format = 'google';
      headers = {'x-goog-api-key':config.key};
      url.pathname = path.replace(/\/openai$/, '') + '/models';
      url.searchParams.set('pageSize','1000');
    } else if (config.provider === 'aliyun' && url.hostname.endsWith('.maas.aliyuncs.com') && ['/compatible-mode/v1','/api/v1'].includes(path)) {
      format = 'dashscope'; url.pathname = '/api/v1/models';
      url.searchParams.set('page_no','1'); url.searchParams.set('page_size','100');
    } else {
      url.pathname = path + '/models';
      if (config.provider === 'anthropic') {
        format = 'anthropic';
        headers = {'x-api-key':config.key, 'anthropic-version':'2023-06-01'};
        if (url.hostname === 'api.anthropic.com') headers['anthropic-dangerous-direct-browser-access'] = 'true';
        url.searchParams.set('limit','1000');
      }
    }
    return {url,headers,format};
  }

  function fetchPage(url, headers, signal) {
    const reqId = 'model-list-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    return new Promise((resolve,reject) => {
      function clean() {
        clearTimeout(timer);
        window.removeEventListener('message', receive);
        signal.removeEventListener('abort', cancel);
      }
      function stop(reason) {
        clean(); postMsg('cancel-fetch', {reqId}); reject(new Error(reason));
      }
      const cancel = () => stop('cancelled');
      function receive(event) {
        const msg = event.data?.pluginMessage;
        if (msg?.type !== 'api-response' || msg.reqId !== reqId) return;
        clean();
        if (msg.error || msg.data?.error) {
          const code = Number(msg.status || msg.data?.error?.status || msg.data?.error?.code);
          const reason = code === 401 || code === 403 ? 'unauthorized' : code === 429 ? 'limited' :
            code === 404 || code === 405 ? 'unsupported' : 'failed';
          reject(new Error(reason));
        } else resolve(msg.data);
      }
      const timer = setTimeout(() => stop('timeout'), 120000);
      if (signal.aborted) { clean(); reject(new Error('cancelled')); return; }
      signal.addEventListener('abort',cancel,{once:true});
      window.addEventListener('message',receive);
      postMsg('do-fetch', {reqId,url:url.href,options:{method:'GET',headers,redirect:'error'}});
    });
  }

  async function discover() {
    if (active) { reset('cancelled'); return; }
    reset();
    const config = draft();
    lastDraft = config;
    if (config.provider === 'glm' && !config.key) { state = 'managed'; refresh(); return; }
    if (!config.key) { state = 'credentials'; refresh(); return; }
    const controller = new AbortController();
    active = controller; state = 'loading'; refresh();
    try {
      const {url,headers,format} = endpoint(config);
      const ids = new Set(), visited = new Set();
      for (;;) {
        if (visited.has(url.href)) throw new Error('unsupported');
        visited.add(url.href);
        const data = await fetchPage(url,headers,controller.signal);
        if (active !== controller || !sameDraft(config,draft())) return;
        const records = format === 'google' ? data?.models || (data && Object.keys(data).length === 0 ? [] : null)
          : format === 'dashscope' ? data?.output?.models : data?.data;
        if (!Array.isArray(records)) throw new Error('unsupported');
        const before = ids.size;
        for (const record of records) {
          const id = format === 'google' ? record?.name?.replace(/^models\//,'') : format === 'dashscope' ? record?.model : record?.id;
          if (typeof id === 'string' && id.trim() && id !== config.key) ids.add(id);
        }
        if (records.length && !ids.size) throw new Error('unsupported');
        if (format === 'anthropic' && data.has_more && typeof data.last_id === 'string' && data.last_id) {
          url.searchParams.set('after_id',data.last_id);
        } else if (format === 'google' && typeof data.nextPageToken === 'string' && data.nextPageToken) {
          url.searchParams.set('pageToken',data.nextPageToken);
        } else if (format === 'dashscope' && Number(data.output.page_no) * Number(data.output.page_size) < Number(data.output.total)) {
          url.searchParams.set('page_no',String(Number(data.output.page_no) + 1));
        } else break;
        if (before === ids.size) throw new Error('unsupported');
      }
      catalog = [...ids];
      state = catalog.length ? 'ready' : 'empty';
      if (catalog.length) {
        select.replaceChildren(new Option('', ''), ...catalog.map(id => new Option(id,id)));
        select.value = catalog.includes(model.value) ? model.value : '';
      }
    } catch (error) {
      if (active === controller) state = ['address','unsupported','unauthorized','limited','timeout','cancelled'].includes(error.message) ? error.message : 'failed';
    } finally {
      if (active === controller) {
        active = null;
        if (!sameDraft(config,draft())) reset();
        else refresh();
      }
    }
  }
  button.onclick = discover;
  select.onchange = () => {
    if (!sameDraft(lastDraft,draft())) { reset(); return; }
    if (model.disabled || !catalog.includes(select.value)) return;
    model.value = select.value;
    model.dispatchEvent(new Event('input',{bubbles:true}));
  };
  model.addEventListener('input', () => {
    if (catalog.length) select.value = catalog.includes(model.value) ? model.value : '';
  });
  window.AiModelDiscovery = {refresh};
  refresh();
})();
