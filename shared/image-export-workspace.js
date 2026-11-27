(() => {
  const panel = document.createElement('section');
  panel.id = 'imageExportPanel';
  panel.className = 'media-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="media-scroll">
      <div class="media-field"><label for="mediaImageTarget"></label>
        <div class="media-input-row"><select id="mediaImageTarget"></select><button class="secondary-btn" id="mediaImageReload" type="button" data-zh="刷新" data-en="Refresh"></button></div></div>
      <div class="media-field"><label for="mediaImageSource" data-zh="图像来源" data-en="Image source"></label><select id="mediaImageSource"></select>
        <small id="mediaImageSourceHint"></small></div>
      <div class="media-image-preview"><img hidden alt=""><span></span></div>
      <div class="media-image-meta" aria-live="polite"></div>
      <div class="media-field"><label for="mediaImageQuality"><span data-zh="WebP 质量" data-en="WebP quality"></span><output></output></label>
        <input id="mediaImageQuality" type="range" min="1" max="100" step="1" value="82"></div>
      <p class="media-notice" role="status"></p>
      <textarea class="media-base64" hidden readonly aria-label="Base64 data URL"></textarea>
    </div>
    <div class="media-actions"><button type="button" class="primary-btn" data-action="webp"></button>
      <button type="button" class="secondary-btn" data-action="base64"></button>
      <button type="button" class="secondary-btn" data-action="copy" data-zh="复制 Base64" data-en="Copy Base64"></button></div>`;
  document.getElementById('contentScroll').append(panel);
  const $ = selector => panel.querySelector(selector);
  const t = (zh,en) => curLang === 'en' ? en : zh;
  const target = $('#mediaImageTarget'), source = $('#mediaImageSource'), quality = $('#mediaImageQuality');
  const preview = $('.media-image-preview img'), notice = $('.media-notice'), fallback = $('.media-base64');
  const choices = new Map(), fills = new Map(), pending = new Map();
  let items = [], signature = '', awaitingInspect = false, batch = null, request = 0, view = 0, version = 0;
  let bitmap, output, dataUrl, previewUrl, encodeTimer;
  const byId = id => items.find(item=>item.id===id);
  const originals = item => fills.get(item.id) || item.imageFills || [];
  const fillKey = fill => 'fill-'+fill.index+(fill.sourceNodeId ? ':'+fill.sourceNodeId : '');
  function choice(item) {
    const saved=choices.get(item.id);
    if(saved==='render' && item.renderable || originals(item).some(fill=>fillKey(fill)===saved))return saved;
    return item.renderable ? 'render' : originals(item).length ? fillKey(originals(item)[0]) : '';
  }
  const megabytes = size => (size/1000000).toLocaleString(curLang==='en'?'en-US':'zh-CN',{maximumSignificantDigits:3})+' MB';
  function encodeUrl(blob) {
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);
    });
  }
  function rpc(type, payload) {
    const requestId='image-'+(++request);
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{pending.delete(requestId);reject(new Error(t('读取图层超时，请刷新后重试。','The layer timed out. Refresh and try again.')));},45000);
      pending.set(requestId,{resolve,reject,timer});
      postMsg(type,{...payload,requestId,uiLanguage:curLang});
    });
  }
  function updateControls() {
    const multi=items.length>1, busy=!!batch, item=byId(target.value);
    for(const [action,label] of [['webp','WebP'],['base64','Base64']]) {
      const button=$('[data-action="'+action+'"]');
      button.textContent=multi ? t('下载 '+items.length+' 个 '+label+'（ZIP）','Download '+items.length+' '+label+' files (ZIP)') : t('下载 '+label,'Download '+label);
      button.disabled=busy || (multi ? !items.some(n=>choice(n)||n.hasChildren) : !output);
    }
    const copy=$('[data-action="copy"]');
    copy.hidden=multi;copy.style.display=multi?'none':'';
    copy.disabled=busy||!dataUrl||multi;
    target.disabled=busy||items.length<2;
    source.disabled=busy||source.options.length<2;
    quality.disabled=busy;
    $('#mediaImageReload').disabled=busy||!item;
  }
  function clearOutput() {
    clearTimeout(encodeTimer);
    version++;
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl=null;output=null;dataUrl=null;preview.hidden=true;preview.removeAttribute('src');
    fallback.hidden=true;fallback.value='';$('.media-image-meta').textContent='';
    updateControls();
  }
  function previewStatus(text) { $('.media-image-preview span').textContent=text; }
  function metadata() {
    if(output && bitmap) $('.media-image-meta').textContent=bitmap.naturalWidth+' × '+bitmap.naturalHeight+' px  ·  WebP '+megabytes(output.size);
  }
  async function loadBitmap(item, selected) {
    const fill=selected==='render'?null:originals(item).find(f=>fillKey(f)===selected);
    if(!fill && !(selected==='render'&&item.renderable))throw new Error(t('没有可导出的图像来源。','No image source is available.'));
    const message=await rpc('media-image-read',{nodeId:item.id,source:fill?'fill':'render',...(fill?{fillIndex:fill.index,sourceNodeId:fill.sourceNodeId}:{})});
    const image=new Image();let objectUrl;
    try {
      if(message.dataUrl)image.src=message.dataUrl;
      else {
        const bytes=message.bytes instanceof Uint8Array?message.bytes:Uint8Array.from(Object.values(message.bytes||{}));
        objectUrl=URL.createObjectURL(new Blob([bytes]));image.src=objectUrl;
      }
      await image.decode();return image;
    } catch (_) { throw new Error(t('无法解码图像，可切换为图层外观后重试。','Could not decode the image. Try the rendered layer.')); }
    finally {if(objectUrl)URL.revokeObjectURL(objectUrl);}
  }
  async function webp(image, percent) {
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    try {
      const ctx=canvas.getContext('2d');
      if(!canvas.width||!canvas.height||!ctx)throw new Error(t('图层没有可导出的像素。','No exportable pixels.'));
      ctx.drawImage(image,0,0);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',percent/100));
      if(!blob?.size||blob.type!=='image/webp')throw new Error(t('当前编辑器无法编码 WebP。','This editor cannot encode WebP.'));
      return blob;
    } finally {canvas.width=canvas.height=0;}
  }
  function scheduleEncode() {
    clearOutput();$('output').textContent=quality.value+'%';
    if(!bitmap)return;
    const mark=version,image=bitmap,percent=Number(quality.value);
    previewStatus(t('正在压缩…','Encoding…'));
    encodeTimer=setTimeout(async()=>{
      try {
        const blob=await webp(image,percent);
        const url=items.length===1?await encodeUrl(blob):null;
        if(mark!==version)return;
        output=blob;dataUrl=url;previewUrl=URL.createObjectURL(blob);preview.src=previewUrl;preview.hidden=false;
        previewStatus('');metadata();updateControls();
      } catch(error) {if(mark===version){previewStatus('');notice.textContent=String(error.message||error);}}
    },80);
  }
  function populateSources() {
    const item=byId(target.value), options=[];
    if(item?.renderable)options.push(new Option(t('图层外观（含裁剪和效果）','Rendered layer (with crops and effects)'),'render'));
    if(item)for(const [i,fill] of originals(item).entries()) {
      const title=t('原始图片填充','Original image fill')+(fill.name?' · '+fill.name:originals(item).length>1?' '+(i+1):'');
      options.push(new Option(title,fillKey(fill)));
    }
    source.replaceChildren(...options);
    if(item)source.value=choice(item);
    const hint=$('#mediaImageSourceHint');
    hint.textContent=item?.renderable && !originals(item).length && (!item.hasChildren || fills.has(item.id)) ?
      t('此图层没有原始图片填充，可导出图层外观。','This layer has no original image fill. Its rendered appearance is available.'):'';
    hint.hidden=!hint.textContent;updateControls();
  }
  function populateTargets() {
    const old=target.value;
    target.replaceChildren(...items.map(node=>new Option(node.name||t('未命名图层','Unnamed layer'),node.id)));
    if(byId(old))target.value=old;
    if(!items.length)target.append(new Option(t('未选择图层','No layer selected'),''));
    $('label[for="mediaImageTarget"]').textContent=items.length>1?t('预览图层 · 已选 '+items.length+' 个','Preview layer · '+items.length+' selected'):t('选中图层','Selected layer');
    populateSources();
  }
  async function discover(item) {
    if(item.hasChildren && !fills.has(item.id)) {
      const msg=await rpc('media-image-sources',{nodeId:item.id});
      if(byId(item.id)===item)fills.set(item.id,msg.imageFills||[]);
    }
  }
  async function readPreview() {
    const mark=++view,item=byId(target.value);
    bitmap=null;clearOutput();notice.textContent='';
    if(!item){previewStatus(t('请选择要导出的图层。','Select layers to export.'));return;}
    previewStatus(t('正在读取图像…','Reading image…'));
    try {
      await discover(item);
      if(mark!==view)return;
      populateSources();
      const image=await loadBitmap(item,choice(item));
      if(mark!==view)return;
      bitmap=image;scheduleEncode();
    } catch(error) {if(mark===view){previewStatus('');notice.textContent=String(error.message||error);}}
  }
  function download(blob, name) {
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  function filename(name, extension, used) {
    const root=String(name||'image').replace(/[\\/:*?"<>|\x00-\x1f]/g,'-').replace(/\.(jpe?g|png|webp|gif|bmp|avif)$/i,'').trim().replace(/^\.+|[. ]+$/g,'').slice(0,100)||'image';
    const base=/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(root)?'_'+root:root;
    let attempt=1,candidate=base+extension;
    while(used.has(candidate.normalize().toLowerCase()))candidate=base+'-'+(++attempt)+extension;
    used.add(candidate.normalize().toLowerCase());return candidate;
  }
  async function save(format) {
    if(batch||!items.length)return;
    const text=format==='base64',extension=text?'.base64.txt':'.webp',used=new Set();
    if(items.length===1) {
      if(output)download(text?new Blob([dataUrl],{type:'text/plain;charset=utf-8'}):output,filename(items[0].name,extension,used));
      return;
    }
    const run={cancelled:false}, selected=[...items], percent=Number(quality.value), zip=new JSZip(), errors=[];
    let count=0;
    batch=run;updateControls();
    try {
      for(const item of selected) {
        if(run.cancelled)return;
        notice.textContent=t('正在导出 ','Exporting ')+(count+errors.length+1)+' / '+selected.length;
        try {
          // Each layer retains its chosen source. Unpreviewed layers default to
          // their rendered appearance, with the first original fill as fallback.
          if(!choice(item))await discover(item);
          if(run.cancelled)return;
          const blob=item.id===target.value && output ? output : await webp(await loadBitmap(item,choice(item)),percent);
          if(run.cancelled)return;
          const content=text?await encodeUrl(blob):await blob.arrayBuffer();
          zip.file(filename(item.name,extension,used),content);count++;
        } catch(error) {errors.push((item.name||'image')+' · '+String(error.message||error));}
      }
      if(run.cancelled)return;
      if(!count)throw new Error(errors.join(' / '));
      const archive=await zip.generateAsync({type:'blob'});
      if(run.cancelled)return;
      download(archive,text?'base64-images.zip':'webp-images.zip');
      notice.textContent=t('已打包 '+count+' 个文件','Saved '+count+' files')+' · '+megabytes(archive.size)+(errors.length?' · '+errors.join(' / '):'');
    } catch(error) {if(!run.cancelled)notice.textContent=String(error.message||error);}
    finally {if(batch===run){batch=null;updateControls();}}
  }
  function inspect() {awaitingInspect=true;postMsg('media-inspect');}
  function refresh() {
    panel.querySelectorAll('[data-zh]').forEach(el=>{el.textContent=t(el.dataset.zh,el.dataset.en);});
    populateTargets();$('output').textContent=quality.value+'%';metadata();
    if(!items.length)previewStatus(t('请选择要导出的图层。','Select layers to export.'));
  }
  target.onchange=()=>{populateSources();void readPreview();};
  source.onchange=()=>{choices.set(target.value,source.value);void readPreview();};
  $('#mediaImageReload').onclick=()=>{fills.delete(target.value);void readPreview();};
  quality.oninput=scheduleEncode;
  $('[data-action="webp"]').onclick=()=>save('webp');
  $('[data-action="base64"]').onclick=()=>save('base64');
  $('[data-action="copy"]').onclick=async()=>{
    if(!dataUrl||items.length!==1)return;
    let copied=false;
    try {await navigator.clipboard.writeText(dataUrl);copied=true;} catch (_) {
      fallback.value=dataUrl;fallback.hidden=false;fallback.focus();fallback.select();
      try{copied=document.execCommand('copy');}catch(_){}
      if(copied)fallback.hidden=true;
    }
    notice.textContent=copied?t('已复制 WebP 的 Base64 地址。','WebP data URL copied.'):t('已选中 Base64，可使用系统复制快捷键。','The data URL is selected. Use your system copy shortcut.');
  };
  window.addEventListener('message',event=>{
    const msg=event.data?.pluginMessage;
    if(msg?.type==='media-image-result'||msg?.type==='media-image-sources-result') {
      const task=pending.get(msg.requestId);
      if(task){pending.delete(msg.requestId);clearTimeout(task.timer);msg.error?task.reject(new Error(msg.error)):task.resolve(msg);}
      return;
    }
    if(msg?.type!=='media-selection')return;
    const next=msg.items||[],key=JSON.stringify(next);
    if(batch && key!==signature){batch.cancelled=true;batch=null;}
    if(panel.style.display==='none')return;
    if(awaitingInspect || key!==signature) {
      const ids=new Set(next.map(n=>n.id));
      for(const id of choices.keys())if(!ids.has(id))choices.delete(id);
      fills.clear();items=next;signature=key;awaitingInspect=false;
      populateTargets();void readPreview();
    }
  });
  window.ImageExportWorkspace={inspect,refresh};
  refresh();
})();
