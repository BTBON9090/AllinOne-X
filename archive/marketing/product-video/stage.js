(() => {
  const $ = s => document.querySelector(s);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  let started = false;
  function boot() {
    if (started) return; started = true;
    const app = $('.app-container');
    if (!app) return;
    ['#pluginBubble','#resizeHandle','#windowStatus'].forEach(s => { const n=$(s); if(n) n.remove(); });
    document.querySelectorAll('.window-actions').forEach(n => n.remove());
    document.querySelectorAll('[title]').forEach(n => n.removeAttribute('title'));
    try { localStorage.setItem('allinone_user_skin', JSON.stringify('cards')); } catch(e) {}
    try { window.PluginSkins?.apply('cards'); } catch(e) {}
    const stage = document.createElement('div'); stage.id = 'demo-stage';
    stage.innerHTML = `
      <div class="demo-top"><div class="demo-brand"><span class="demo-logo"><i></i><i></i><i></i><i></i></span>All in One</div><div class="demo-meta"><span>PRODUCT DEMO</span><span>22 TOOLS / 2026</span></div></div>
      <div class="demo-head"><div class="demo-kicker" id="demo-kicker">01 / REPEAT</div><div id="demo-title">最烦重复操作</div><div id="demo-sub">选图层、填内容、清组件、导 PPT</div></div>
      <div class="demo-camera" id="demo-camera"><div class="demo-window"><div class="demo-titlebar"><i></i><i></i><i></i><span>AllinOne</span></div></div></div>
      <div id="demo-vignette"></div>
      <div id="demo-flash"></div>
      <div id="demo-results"></div>
      <div id="demo-explode"></div>
      <div id="demo-cursor"><svg viewBox="0 0 26 30" fill="none"><path d="M2 1.5 24 13.8l-10.1 2.1L8.4 27.1 2 1.5Z" fill="#fff" stroke="#16120e" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="click"></span></div>
      <div id="demo-steps"><span id="demo-step">01 / 07</span><div class="demo-progress" id="demo-progress"></div><span>PRODUCT FILM</span></div>
      <div class="demo-end" id="demo-end"><div class="demo-logo" style="transform:scale(1.6);margin-bottom:26px"><i></i><i></i><i></i><i></i></div><h2>22 个工具<br>一个面板</h2><p>Figma / MasterGo · 本地运行</p><div class="contacts"><span>QQ <b>376556413</b></span><span><b>www.btbon.cn</b></span><span>小红书 <b>@All in One</b></span></div></div>`;
    document.body.append(stage);
    $('.demo-camera .demo-window').append(app);
    const cursor = $('#demo-cursor');
    const cam = $('#demo-camera');
    const title = $('#demo-title'), sub = $('#demo-sub'), kicker = $('#demo-kicker');
    const results = $('#demo-results'), explodeLayer = $('#demo-explode'), flash = $('#demo-flash');
    const end = $('#demo-end'), step = $('#demo-step'), progress = $('#demo-progress');
    const chapters = [
      ['01 / REPEAT','最烦重复操作','选图层、填内容、清组件、导 PPT'],
      ['02 / TOOL MAP','22 个工具','3 组入口，一栏直达'],
      ['03 / SMART FILL','表单一键填满','字段识别 → 数据源 → 批量写入'],
      ['04 / SUPER SELECT','三层过滤找图层','名称 + 类型 + 状态'],
      ['05 / COMPONENT CLEAN','组件名一次清完','清洗 → 命名 → 查重 → 翻译'],
      ['06 / DELIVERY','设计完直接交付','尺寸 → PPT → 多语言 → 理论'],
      ['07 / ONE PANEL','一个面板','15 个入口 · 22 个工具']
    ];
    chapters.forEach((_, i) => { const b=document.createElement('i'); b.dataset.i=i; progress.append(b); });
    function chapter(i){ kicker.textContent=chapters[i][0]; title.textContent=chapters[i][1]; sub.textContent=chapters[i][2]; step.textContent=String(i+1).padStart(2,'0')+' / 07'; [...progress.children].forEach((b,j)=>{b.className=j<i?'done':j===i?'active':''}); }
    function camera(scale,x=0,y=0){ cam.style.transform=`translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`; }
    function moveTo(sel, duration=.55){ const el=typeof sel==='string'?$(sel):sel; if(!el) return Promise.resolve(); const r=el.getBoundingClientRect(); cursor.style.transition=`left ${duration}s cubic-bezier(.3,.8,.3,1), top ${duration}s cubic-bezier(.3,.8,.3,1)`; cursor.style.left=(r.left+r.width*.55)+'px'; cursor.style.top=(r.top+r.height*.55)+'px'; return wait(duration*1000); }
    function click(sel){ const el=typeof sel==='string'?$(sel):sel; if(!el) return; cursor.classList.add('clicking'); setTimeout(()=>cursor.classList.remove('clicking'),500); try{el.click();}catch(e){} if(el.classList.contains('nav-item')){ document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('is-active','active')); el.classList.add('is-active'); } }
    function result(text){ const d=document.createElement('div'); d.className='demo-result'; d.textContent=text; results.append(d); requestAnimationFrame(()=>d.classList.add('on')); setTimeout(()=>{d.classList.remove('on'); setTimeout(()=>d.remove(),400);},2600); }
    function flashOn(){ flash.classList.add('on'); setTimeout(()=>flash.classList.remove('on'),220); }
    function explode(sel, labels){ const el=$(sel); if(!el) return; const r=el.getBoundingClientRect(); const w=r.width,h=r.height; el.style.opacity='.18'; const clones=[]; for(let i=0;i<3;i++){ const piece=document.createElement('div'); piece.className='demo-piece'; piece.style.left=r.left+'px'; piece.style.top=r.top+'px'; piece.style.width=w+'px'; piece.style.height=h+'px'; const clip=document.createElement('div'); clip.className='inner'; const node=el.cloneNode(true); node.style.width=w+'px'; node.style.height=h+'px'; node.style.position='absolute'; node.style.left='0'; node.style.top='0'; clip.append(node); piece.append(clip); explodeLayer.append(piece); clones.push(piece); }
        const offsets=[[-w*.95,-h*.15],[0,-h*.85],[w*.95,-h*.15]];
        clones.forEach((p,i)=>{ requestAnimationFrame(()=>{ p.style.transform=`translate(${offsets[i][0]}px,${offsets[i][1]}px) rotate(${i===1?0:i===0?-4:4}deg)`; }); const l=document.createElement('div'); l.className='demo-lbl'; l.textContent=labels[i]; const px=r.left+offsets[i][0]+w*.2, py=r.top+offsets[i][1]-18; l.style.left=Math.max(20,px)+'px'; l.style.top=Math.max(90,py)+'px'; explodeLayer.append(l); requestAnimationFrame(()=>l.classList.add('on')); clones[i].label=l; });
        setTimeout(()=>{ clones.forEach(p=>{p.style.opacity='0'; setTimeout(()=>p.remove(),400);}); document.querySelectorAll('.demo-lbl').forEach(l=>{l.classList.remove('on'); setTimeout(()=>l.remove(),400);}); el.style.opacity=''; },3600);
    }
    function nav(key){ try{ window.PluginWorkspace?.navigate(key); }catch(e){} }
    function settings(){ try{ window.openSettings?.(); }catch(e){} }
    function home(){ try{ window.PluginWorkspace?.navigate('simple'); }catch(e){} }
    const timeline=[];
    const at=(t,fn)=>timeline.push({t,fn,ran:false});
    at(0,()=>{ chapter(0); camera(1.65); cursor.style.left='760px'; cursor.style.top='980px'; });
    at(3.2,()=>{ chapter(1); camera(1.8,0,-30); });
    at(4.4,()=>{ moveTo('.nav-item[data-nav="smartFill"]',.5); });
    at(5.0,()=>{ chapter(2); click('.nav-item[data-nav="smartFill"]'); camera(2.2,-80,40); flashOn(); });
    at(7.2,()=>{ moveTo('.smart-basic-tile',.5); });
    at(7.7,()=>{ click('.smart-basic-tile'); });
    at(8.5,()=>{ explode('.smart-basic-tile',['字段','选项','写入']); });
    at(11.9,()=>{ result('已填充 12 个字段'); });
    at(12.4,()=>{ moveTo('.nav-item[data-nav="select"]',.5); });
    at(13.0,()=>{ chapter(3); click('.nav-item[data-nav="select"]'); camera(2.1,60,30); flashOn(); });
    at(15.1,()=>{ const chip=$('#selectPanel .filter-tag'); if(chip){moveTo(chip,.35); setTimeout(()=>click(chip),420);} });
    at(16.1,()=>{ explode('#selectPanel .filter-group',['名称','类型','状态']); });
    at(18.9,()=>{ result('命中 38 个图层'); });
    at(19.5,()=>{ moveTo('.nav-item[data-nav="refiner"]',.5); });
    at(20.1,()=>{ chapter(4); click('.nav-item[data-nav="refiner"]'); camera(2.1,-40,20); flashOn(); });
    at(22.0,()=>{ const start=$('#refinerPanel .selection-footer .primary-btn, #refinerPanel .primary-btn'); if(start) moveTo(start,.35); });
    at(22.6,()=>{ const start=$('#refinerPanel .selection-footer .primary-btn, #refinerPanel .primary-btn'); if(start) click(start); });
    at(23.3,()=>{ explode('#refinerPanel .config-group',['范围','规则','预览']); });
    at(25.9,()=>{ result('检查完成 · 12 个命名问题'); });
    at(26.5,()=>{ moveTo('.nav-item[data-nav="ppt"]',.5); });
    at(27.1,()=>{ chapter(5); click('.nav-item[data-nav="ppt"]'); camera(2.1,0,20); flashOn(); });
    at(29.2,()=>{ explode('#pptPanel .ppt-step',['清洗','分步','导出']); });
    at(31.8,()=>{ result('8 页画板 · 可编辑 PPT'); });
    at(32.4,()=>{ moveTo('.sidebar-footer .footer-btn',.5); });
    at(33.0,()=>{ chapter(6); click('.sidebar-footer .footer-btn'); settings(); camera(2.1,40,20); flashOn(); });
    at(35.2,()=>{ const about=$('.about-section'); if(about) about.scrollIntoView({block:'center'}); });
    at(37.0,()=>{ result('v4.4.6 · QQ 群 376556413'); });
    at(38.0,()=>{ home(); camera(1.9); flashOn(); });
    at(40.5,()=>{ end.classList.add('on'); });
    at(46.5,()=>{ /* hold */ });
    let start=performance.now();
    function loop(){
      const t=(performance.now()-start)/1000;
      timeline.forEach(e=>{ if(!e.ran && t>=e.t){ e.ran=true; try{e.fn();}catch(err){console.warn(err);} } });
      if(t<48) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  window.addEventListener('load', () => setTimeout(boot, 900));
})();
