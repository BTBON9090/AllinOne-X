/* Shared library, reading view and compact contextual question composer. */
(() => {
  const $ = id => document.getElementById(id);
  const l = (zh, en) => curLang === 'en' ? en : zh;
  const icons = { nielsen:'checklist', wcag:'accessible', ai_guide:'robot', vui:'microphone', spatial:'device-vision-pro', fitts:'focus-2', doherty:'bolt', norman:'heart', miller:'brain', hick:'help', peakend:'mountain', gestalt:'eye', vonrestorff:'star', hook:'link', kano:'presentation', atomic:'atom', iso9241:'ruler-measure-2', tesler:'aspect-ratio' };
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  let category = 'all', selectedId = null, returnToDetail = null;
  let history = [], busy = false, requestToken = 0, cancelRequest = null, savedDetailScroll = 0;
  const record = id => TheoryLocale.item(theoryDB.find(item => item.id === id), curLang);
  const displayTitle = title => curLang === 'en' ? title : title.replace(/\s*\([A-Za-z][^)]*\)/g, '');
  function renderLibrary(filter = category) {
    category = filter || 'all';
    const container = $('theoryCapsuleContainer');
    container.replaceChildren();
    for (const [key, labels] of Object.entries(TheoryLocale.categories)) {
      if (category !== 'all' && category !== key) continue;
      const section = node('section', 'theory-group');
      section.append(node('h2', 'theory-group-title', labels[curLang === 'en' ? 1 : 0]));
      const list = node('div', 'theory-capsule-list');
      for (const source of theoryDB.filter(item => item.cat === key)) {
        const item = TheoryLocale.item(source, curLang);
        const button = node('button', 'theory-capsule');
        button.type = 'button'; button.dataset.theoryId = item.id;
        const icon = node('span', 'theory-capsule-icon');
        PluginIcons.put(icon, icons[item.id]);
        button.append(icon, node('span', '', displayTitle(item.title)));
        button.title = item.title;
        button.onclick = () => openDetail(item.id);
        list.append(button);
      }
      section.append(list); container.append(section);
    }
  }
  function renderDetail(resetScroll = false) {
    if (!selectedId) return;
    const item = record(selectedId);
    const scroll = document.querySelector('.theory-article-scroll');
    const top = resetScroll ? 0 : scroll.scrollTop;
    PluginIcons.put($('detailIcon'), icons[item.id]);
    $('detailTitle').textContent = displayTitle(item.title);
    $('detailSubtitle').textContent = item.subtitle;
    $('detailMainDesc').textContent = item.desc;
    $('detailCatBadge').textContent = TheoryLocale.categories[item.cat][curLang === 'en' ? 1 : 0];
    const container = $('theoryDetailDynamicContent'); container.replaceChildren();
    const select = $('theorySectionSelect'); select.replaceChildren();
    const placeholder = node('option','',l('选择章节','Choose a section'));
    placeholder.value = ''; select.append(placeholder);
    $('theoryDetailOutline').hidden = item.subItems.length < 4;
    document.querySelector('.theory-outline-label').textContent = l('章节导航','Jump to a section');
    select.setAttribute('aria-label', l('跳转到章节','Jump to a section'));
    item.subItems.forEach((sub, index) => {
      const title = displayTitle(sub.title.replace(/^\d+\.\s*/, ''));
      const section = node('section', 'theory-principle');
      section.id = 'theory-principle-' + index;
      const heading = node('h2', 'theory-principle-title');
      heading.append(node('span', 'theory-principle-number', String(index + 1).padStart(2,'0')), node('span','',title));
      section.append(heading);
      for (const [key, caption] of [
        ['core', l('核心释义','Key idea')], ['case', l('应用案例','In practice')], ['val', l('理论价值','Why it matters')]
      ]) {
        const block = node('div', 'theory-principle-block theory-principle-' + key);
        block.append(node('h3', 'theory-block-label', caption), node('p', 'theory-block-copy', sub[key]));
        section.append(block);
      }
      container.append(section);
      const option = node('option', '', (index + 1) + ' · ' + title); option.value = String(index); select.append(option);
    });
    scroll.scrollTop = top;
  }
  function show(view) {
    for (const id of ['theoryHomeView','theoryChatView','theoryDetailView']) $(id).style.display = id === view ? 'flex' : 'none';
  }
  function openDetail(id, restore = false) {
    if (!theoryDB.some(item => item.id === id)) return;
    selectedId = id; show('theoryDetailView'); renderDetail(!restore);
    if (restore) document.querySelector('.theory-article-scroll').scrollTop = savedDetailScroll;
  }
  function closeDetail() { show('theoryHomeView'); }
  function filter(cat, element) {
    document.querySelectorAll('.t-tag').forEach(item => item.classList.remove('active'));
    element?.classList.add('active'); renderLibrary(cat);
  }
  function addMessage(role, content) {
    const message = node('div', 'theory-chat-message ' + role, content);
    $('theoryChatMessages').append(message);
    $('theoryChatMessages').scrollTop = $('theoryChatMessages').scrollHeight;
  }
  const composers = [
    ['theoryQuestionInput','theoryQuestionSend', () => sendQuestion()],
    ['theoryChatInput','theoryChatSend', () => sendChat()],
    ['theoryDetailInput','theoryDetailSend', () => sendDetailQuestion()]
  ];
  function updateSendState() {
    for (const [inputId, buttonId] of composers) {
      const button = $(buttonId);
      button.disabled = busy || !$(inputId).value.trim();
      button.setAttribute('aria-busy', String(busy));
      button.dataset.smartIcon = busy ? 'loader' : 'arrow-up';
      PluginIcons.put(button, button.dataset.smartIcon);
      button.title = busy ? l('正在生成回答…','Generating an answer…') : l('发送 · Enter；换行 · Shift+Enter','Send · Enter; new line · Shift+Enter');
      button.setAttribute('aria-label', l('发送问题','Send question'));
    }
  }
  function resizeInput(input) {
    input.style.height = 'auto';
    input.style.height = Math.min(96, Math.max(28, input.scrollHeight)) + 'px';
  }
  function startChat(inputId, detail) {
    const input = $(inputId), question = input.value.trim();
    if (!question || busy) return;
    returnToDetail = detail ? selectedId : null;
    if (detail) savedDetailScroll = document.querySelector('.theory-article-scroll').scrollTop;
    history = []; $('theoryChatMessages').replaceChildren();
    show('theoryChatView');
    input.value = ''; resizeInput(input);
    addMessage('user', question); history.push({ role:'user', content:question });
    updateSendState(); requestAnswer(question);
    $('theoryChatInput').focus();
  }
  function sendQuestion() { startChat('theoryQuestionInput', false); }
  function sendDetailQuestion() { startChat('theoryDetailInput', true); }
  function sendChat() {
    const input = $('theoryChatInput'), question = input.value.trim();
    if (!question || busy) return;
    input.value = ''; resizeInput(input);
    addMessage('user', question); history.push({ role:'user', content:question });
    requestAnswer(question);
  }
  async function requestAnswer() {
    if (busy) return;
    const endpoint = getAiEndpoint();
    if ((!endpoint.key && !endpoint.isProxy) || !endpoint.url) {
      addMessage('ai', l('请先在设置中配置 AI 服务，再发送问题。','Configure an AI service in Settings before asking a question.'));
      return;
    }
    busy = true; updateSendState();
    const token = ++requestToken;
    const context = returnToDetail ? record(returnToDetail) : null;
    const instructions = curLang === 'en'
      ? 'You are a design theory assistant. Reply in English with concise, accurate explanations and practical examples. Distinguish established findings from design guidelines. Do not invent sources.'
      : '你是设计理论助手。用简洁准确的中文解释并给出实际应用案例，区分研究结论与设计建议，不编造来源。';
    try {
      let url = endpoint.url.trim().replace(/\/+$/, '');
      if (!url.includes('/chat/completions')) url += '/chat/completions';
      const options = {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ model:endpoint.model || 'glm-4.7-flash',
          messages:[{ role:'system', content:instructions + (context ? '\nCurrent principle: ' + JSON.stringify(context) : '') }, ...history],
          temperature:.7, stream:false })
      };
      if (endpoint.key) options.headers.Authorization = 'Bearer ' + endpoint.key;
      const reqId = 'theory-' + Date.now() + '-' + token;
      const data = await new Promise((resolve, reject) => {
        const cleanup = () => { clearTimeout(timer); window.removeEventListener('message', receive); cancelRequest = null; };
        const receive = event => {
          const msg = event.data?.pluginMessage || event.data;
          if (msg?.type !== 'api-response' || msg.reqId !== reqId) return;
          cleanup(); msg.error ? reject(new Error(msg.error)) : resolve(msg.data);
        };
        const timer = setTimeout(() => { cleanup(); reject(new Error(l('AI 响应超时','AI response timed out'))); }, 60000);
        cancelRequest = () => { cleanup(); reject(new Error('cancelled')); };
        window.addEventListener('message', receive);
        postMsg('do-fetch', { reqId, url, options });
      });
      if (token !== requestToken) return;
      const answer = data?.choices?.[0]?.message?.content;
      if (typeof answer !== 'string' || !answer.trim()) throw new Error(l('AI 返回了空回答','The AI returned an empty answer'));
      addMessage('ai', answer.trim()); history.push({ role:'assistant', content:answer.trim() });
    } catch (error) {
      if (token === requestToken) addMessage('ai', l('请求失败：','Request failed: ') + PluginLocale.translate(error.message, curLang));
    } finally {
      if (token === requestToken) { busy = false; updateSendState(); }
    }
  }
  function closeChat() {
    ++requestToken; cancelRequest?.(); busy = false; updateSendState();
    const back = returnToDetail; history = []; $('theoryChatMessages').replaceChildren();
    if (back) openDetail(back, true); else show('theoryHomeView');
  }
  function refresh() {
    renderLibrary(category);
    if (selectedId && $('theoryDetailView').style.display === 'flex') renderDetail();
    document.querySelector('#theoryChatView .chat-title').textContent = l('AI 设计理论助手','Design Theory Assistant');
    document.querySelector('#theoryChatView .theory-back-label').textContent = l('返回','Back');
    document.querySelector('#theoryDetailView .theory-back-label').textContent = l('返回列表','Back to library');
    for (const [id, zh, en] of [
      ['theoryQuestionInput','输入设计问题或理论关键词…','Ask a design question or enter a principle…'],
      ['theoryChatInput','继续提问…','Ask a follow-up question…'],
      ['theoryDetailInput','询问这个理论的应用…','Ask how to apply this principle…']
    ]) { $(id).placeholder = l(zh,en); $(id).setAttribute('aria-label', l(zh,en)); }
    updateSendState();
  }
  $('theorySectionSelect').onchange = event => {
    const section = $('theory-principle-' + event.target.value);
    const scroll = document.querySelector('.theory-article-scroll');
    if (section) scroll.scrollTo({ top:scroll.scrollTop + section.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 8, behavior:'auto' });
    event.target.value = '';
  };
  for (const [id, , send] of composers) {
    const input = $(id);
    input.addEventListener('input', () => { resizeInput(input); updateSendState(); });
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault(); send();
      }
    });
  }
  window.addEventListener('resize', () => composers.forEach(([id]) => resizeInput($(id))));
  window.TheoryWorkspace = Object.freeze({ renderLibrary, openDetail, closeDetail, sendQuestion, sendDetailQuestion, sendChat, addMessage, requestAnswer, closeChat, filter, refresh });
  refresh();
})();
