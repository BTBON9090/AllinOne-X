// Image bytes and native shadow samples are read only on an explicit UI request.
let mediaWatching = false;

function mediaImageFills(node) {
  if (!Array.isArray(node.fills)) return [];
  return node.fills.flatMap((paint, index) =>
    paint.type === 'IMAGE' && (layerPlatform === 'figma' ? paint.imageHash : paint.imageRef) ? [{ index, name: paint.name || '' }] : []);
}

function sendMediaSelection() {
  if (!mediaWatching) return;
  const items = Array.from(layerPage().selection, node => ({
    id: node.id, name: node.name, renderable: typeof node.exportAsync === 'function',
    imageFills: mediaImageFills(node), hasChildren: 'children' in node && node.children.length > 0, shadowable: 'effects' in node
  }));
  layerSend({ type: 'media-selection', items });
}

function mediaImageTarget(id, en) {
  const node = layerPage().selection.find(item => !item.removed && item.id === id);
  if (!node) throw new Error(en ? 'Select the layer again.' : '请重新选择该图层。');
  return node;
}

async function mediaImageSources(msg, en) {
  const root=mediaImageTarget(msg.nodeId,en), imageFills=mediaImageFills(root);
  const pending=Array.from(root.children||[]).reverse();
  let visited=0;
  while(pending.length) {
    if(++visited%256===0){await new Promise(resolve=>setTimeout(resolve,0));mediaImageTarget(msg.nodeId,en);}
    const child=pending.pop();
    if(child.removed || child.visible===false || child.isVisible===false || child.opacity===0)continue;
    for(const fill of mediaImageFills(child)) {
      const path=[];
      for(let node=child;node&&node.id!==root.id;node=node.parent)path.unshift(node.name);
      const paint=child.fills[fill.index];
      if(paint.visible===false || paint.isVisible===false)continue;
      imageFills.push({...fill,sourceNodeId:child.id,name:[path.join(' / '),fill.name].filter(Boolean).join(' · ')});
    }
    if(child.children)for(let i=child.children.length-1;i>=0;i--)pending.push(child.children[i]);
  }
  return {nodeId:root.id,imageFills};
}

async function mediaReadImage(msg, en) {
  const node=mediaImageTarget(msg.nodeId,en);
  let bytes;
  if (msg.source === 'fill') {
    const owner=msg.sourceNodeId && msg.sourceNodeId!==node.id ? await layerGet(msg.sourceNodeId) : node;
    let parent=owner;
    while(parent && !parent.removed && parent.id!==node.id && parent.visible!==false && parent.isVisible!==false && parent.opacity!==0)parent=parent.parent;
    if(!parent || parent.removed || parent.id!==node.id)throw new Error(en ? 'The image source moved or was hidden. Refresh the layer.' : '原图所在图层已移动或隐藏，请刷新。');
    mediaImageTarget(msg.nodeId,en);
    const paint = owner && Array.isArray(owner.fills) && owner.fills[msg.fillIndex];
    if (!paint || paint.type !== 'IMAGE') throw new Error(en ? 'The image fill has changed.' : '图片填充已发生变化。');
    const image = layerPlatform === 'figma' ? layerHost.getImageByHash(paint.imageHash) : layerHost.getImageByHref(paint.imageRef);
    if (!image) throw new Error(en ? 'The image fill is unavailable.' : '暂时无法读取原始图片。');
    bytes = await image.getBytesAsync();
  } else if (msg.source === 'render' && typeof node.exportAsync === 'function') {
    bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1 } });
  } else {
    throw new Error(en ? 'This layer cannot be exported.' : '此图层无法导出。');
  }
  if (typeof bytes === 'string') {
    if (!bytes.length) throw new Error(en ? 'The image is empty.' : '导出的图片为空。');
    return { dataUrl: bytes.startsWith('data:image/') ? bytes : 'data:image/png;base64,' + bytes };
  }
  if (!bytes || !bytes.length) throw new Error(en ? 'The image is empty.' : '导出的图片为空。');
  return { bytes };
}

const mediaShadowKinds = ['DROP_SHADOW', 'INNER_SHADOW'];

function mediaShadowBudget(en) {
  return en ? 'Use up to 8 drop shadows and 8 inner shadows per layer.' : '每个图层最多支持 8 层外阴影和 8 层内阴影。';
}

function mediaShadowVisible(effect) {
  return layerPlatform === 'figma' ? effect.visible !== false : effect.isVisible !== false;
}

function mediaShadowOrder(samples) {
  // CSS lists the frontmost shadow first. Figma stacks the last native effect
  // in front. MasterGo's CSS importer maps the list directly to node.effects.
  return layerPlatform === 'figma' ? samples.slice().reverse() : samples;
}

function mediaReadShadows(msg, en) {
  const selection = layerPage().selection;
  if (selection.length !== 1) throw new Error(en ? 'Select exactly one layer to pick its shadows.' : '请选择一个图层以拾取阴影。');
  const node = selection[0];
  if (node.removed || (msg.nodeId != null && node.id !== msg.nodeId)) {
    throw new Error(en ? 'The selection changed. Pick the shadows again.' : '选区已变化，请重新拾取阴影。');
  }
  const result = { name: node.name, kinds: [], shadows: [] };
  if (!Array.isArray(node.effects)) {
    return { ...result, error: en ? 'This layer does not support effects.' : '此图层不支持效果。' };
  }
  const visible = node.effects.filter(effect => mediaShadowKinds.includes(effect.type) && mediaShadowVisible(effect));
  result.kinds = mediaShadowKinds.filter(kind => visible.some(effect => effect.type === kind));
  if (!result.kinds.length) {
    return { ...result, error: en ? 'This layer has no visible shadows.' : '此图层没有可见的阴影。' };
  }
  const kind = result.kinds.includes(msg.kind) ? msg.kind : result.kinds[0];
  const matching = visible.filter(effect => effect.type === kind);
  if (matching.length > 8) return { ...result, kind, error: mediaShadowBudget(en) };
  const samples = matching.map(effect => {
    const { r, g, b, a } = effect.color;
    const sample = { x: effect.offset.x, y: effect.offset.y, blur: effect.radius, spread: effect.spread || 0, color: { r, g, b, a } };
    if (effect.blendMode) sample.blendMode = effect.blendMode;
    if (typeof effect.showShadowBehindNode === 'boolean') sample.showShadowBehindNode = effect.showShadowBehindNode;
    if (layerPlatform === 'mastergo' && typeof effect.isEffectShow === 'boolean') sample.isEffectShow = effect.isEffectShow;
    return sample;
  });
  return { ...result, kind, shadows: mediaShadowOrder(samples) };
}

function mediaNativeShadows(kind, samples, en) {
  if (!mediaShadowKinds.includes(kind) || !Array.isArray(samples) || !samples.length) {
    throw new Error(en ? 'Invalid shadow settings.' : '阴影参数无效。');
  }
  if (samples.length > 8) throw new Error(mediaShadowBudget(en));
  return mediaShadowOrder(samples.map(sample => {
    const { x, y, blur, spread, color } = sample;
    if (![x, y, blur, spread].every(Number.isFinite) || blur < 0 ||
        !color || !['r','g','b','a'].every(key => Number.isFinite(color[key]) && color[key] >= 0 && color[key] <= 1)) {
      throw new Error(en ? 'Invalid shadow settings.' : '阴影参数无效。');
    }
    const effect = { type: kind, color: { r:color.r, g:color.g, b:color.b, a:color.a },
      offset: { x, y }, radius: blur, blendMode: sample.blendMode || 'NORMAL' };
    if (layerPlatform === 'mastergo') {
      return { ...effect, spread, isVisible: true, showShadowBehindNode: sample.showShadowBehindNode === true,
        isEffectShow: sample.isEffectShow !== false };
    }
    if (spread !== 0) effect.spread = spread;
    if (kind === 'DROP_SHADOW' && typeof sample.showShadowBehindNode === 'boolean') {
      effect.showShadowBehindNode = sample.showShadowBehindNode;
    }
    return { ...effect, visible: true };
  }));
}

function mediaSameShadow(old, next) {
  const previousColor = old.color;
  return previousColor && old.offset &&
    old.offset.x === next.offset.x && old.offset.y === next.offset.y &&
    old.radius === next.radius && (old.spread || 0) === (next.spread || 0) &&
    ['r','g','b','a'].every(channel => previousColor[channel] === next.color[channel]) &&
    (old.blendMode || 'NORMAL') === next.blendMode &&
    !!old.showShadowBehindNode === !!next.showShadowBehindNode &&
    (layerPlatform !== 'mastergo' || (old.isEffectShow !== false) === next.isEffectShow);
}

function mediaReplaceShadows(effects, kind, next) {
  // Reuse the visible shadow positions so interleaved blurs and other effects
  // stay in the same compositing order when a picked stack is applied again.
  const result = [];
  let used = 0;
  let insertAt = -1;
  for (const effect of effects) {
    if (effect.type !== kind) {
      result.push(effect);
    } else if (mediaShadowVisible(effect)) {
      if (used < next.length) {
        const replacement = next[used++];
        // Retain native variable bindings and optional fields on an unchanged effect.
        result.push(mediaSameShadow(effect, replacement) ? effect : replacement);
      }
      insertAt = result.length;
    } else if (insertAt < 0) {
      insertAt = result.length;
    }
  }
  const remaining = next.slice(used);
  result.splice(insertAt < 0 ? result.length : insertAt, 0, ...remaining);
  return result;
}

function mediaSelectedEffectNodes(nodeIds, en) {
  const nodes = Array.from(layerPage().selection);
  const ids = new Set(Array.isArray(nodeIds) ? nodeIds : []);
  if (!ids.size || ids.size !== nodes.length || nodeIds.length !== nodes.length ||
      nodes.some(node => node.removed || !ids.has(node.id))) {
    throw new Error(en ? 'The selection changed. Review the layers and try again.' : '选区已变化，请核对图层后重试。');
  }
  return nodes;
}

function mediaEditableEffects(node, en) {
  const effects = node.effects;
  if (!Array.isArray(effects)) throw new Error(en ? 'This layer does not support effects.' : '此图层不支持效果。');
  for (let parent = node; parent && parent.type !== 'PAGE'; parent = parent.parent) {
    if (parent.locked || parent.isLocked) throw new Error(en ? 'The layer is locked.' : '图层已锁定。');
  }
  return effects;
}

function mediaCommitEffects(applied) {
  if (applied && typeof layerHost.commitUndo === 'function') {
    try { layerHost.commitUndo(); } catch (_) { /* The native effects have already been written. */ }
  }
}

function mediaApplyShadows(msg, en) {
  const next = mediaNativeShadows(msg.kind, msg.shadows, en);
  const nodes = mediaSelectedEffectNodes(msg.nodeIds, en);
  const issues = [];
  let applied = 0;
  for (const node of nodes) {
    try {
      node.effects = mediaReplaceShadows(mediaEditableEffects(node, en), msg.kind, next);
      applied++;
    } catch (error) {
      issues.push({ name: node.name, reason: String(error.message || error) });
    }
  }
  mediaCommitEffects(applied);
  return { applied, issues };
}

function mediaClearShadows(msg, en) {
  const nodes = mediaSelectedEffectNodes(msg.nodeIds, en);
  const results = [], issues = [];
  let applied = 0, removed = 0, unchanged = 0;
  for (const node of nodes) {
    const result = {id:node.id, name:node.name, status:'unchanged', removed:0};
    try {
      const effects = mediaEditableEffects(node, en);
      const kept = effects.filter(effect => !mediaShadowKinds.includes(effect.type));
      const count = effects.length - kept.length;
      if (count) {
        node.effects = kept;
        result.status = 'cleared';
        result.removed = count;
        applied++;
        removed += count;
      } else {
        unchanged++;
      }
    } catch (error) {
      result.status = 'skipped';
      result.reason = String(error.message || error);
      issues.push({name:result.name,reason:result.reason});
    }
    results.push(result);
  }
  mediaCommitEffects(applied);
  return {applied,removed,unchanged,issues,results};
}

async function handleMediaMessage(msg) {
  if (msg.type === 'media-inspect') {
    mediaWatching = true;
    sendMediaSelection();
    return true;
  }
  const commands = {
    'media-image-sources': [mediaImageSources, 'media-image-sources-result'],
    'media-image-read': [mediaReadImage, 'media-image-result'],
    'media-shadow-read': [mediaReadShadows, 'media-shadow-read-result'],
    'media-shadow-apply': [mediaApplyShadows, 'media-shadow-result'],
    'media-shadow-clear': [mediaClearShadows, 'media-shadow-clear-result']
  };
  if (!Object.prototype.hasOwnProperty.call(commands, msg.type)) return false;
  const [handler, type] = commands[msg.type];
  const reply = { type, requestId: msg.requestId };
  try {
    const result = await handler(msg, msg.uiLanguage === 'en');
    layerSend({ ...reply, ...result });
  } catch (error) {
    layerSend({ ...reply, error: String(error.message || error) });
  }
  return true;
}
