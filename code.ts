// @ts-nocheck
declare const __html__: string;
// -------------------------------------------------------------
// 【更新】高级命名转换函数 (支持清除隐藏标记)
// -------------------------------------------------------------
const convertNameAdvanced = (str: string, format: string, sepMode: string, casing: string, keepEmoji: boolean, removeId: boolean, unmarkHidden: boolean) => {
    let s = str;
    
    // 1. 移除 ID
    if (removeId) s = s.replace(/#\d+:\d+$/, '').trim();
    
    // 2. 处理隐藏标记 (. 或 _)
    // 逻辑：先提取出来，如果不清除，最后再加回去
    let hiddenPrefix = "";
    const hiddenMatch = s.match(/^[\._]/);
    if (hiddenMatch) {
        hiddenPrefix = hiddenMatch[0];
        // 暂时去掉以便后续分词处理
        s = s.substring(1);
    }

    // 3. 处理 Emoji
    let emojiPrefix = "";
    if (keepEmoji) {
        const match = s.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u2000-\u3300]|[\uF000-\uF0FF])+\s*/u);
        if (match) { 
            emojiPrefix = match[0].trim(); 
            s = s.replace(match[0], ''); 
        }
    }
    s = s.trim();

    // 4. 分词与重组
    const words = s.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+|[\u4e00-\u9fa5]+/g);
    let newVal = s;
    if (words && words.length > 0) {
        let processedWords = words;
        
        if (format === 'camelCase') {
            processedWords = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            newVal = processedWords.join('');
        } else if (format === 'PascalCase') {
            processedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            newVal = processedWords.join('');
        } else {
            if (casing === 'upper') processedWords = words.map(w => w.toUpperCase());
            else if (casing === 'lower') processedWords = words.map(w => w.toLowerCase());
            
            let separatorChar = ' ';
            if (sepMode === 'snake') separatorChar = '_';
            if (sepMode === 'kebab') separatorChar = '-';
            newVal = processedWords.join(separatorChar);
        }
    }

    // 5. 加回 Emoji
    if (keepEmoji && emojiPrefix) {
        const joiner = (format === 'separator' && sepMode !== 'space') ? (sepMode === 'snake' ? '_' : '-') : ' ';
        newVal = emojiPrefix + joiner + newVal;
    }

    // 6. 加回隐藏标记 (如果未勾选清除)
    if (!unmarkHidden && hiddenPrefix) {
        newVal = hiddenPrefix + newVal;
    }

    return { changed: newVal !== str, val: newVal };
};
figma.showUI(__html__, { width: 460, height: 640, themeColors: true });

// 用于存储高亮前的原始样式： Key = "NodeID_Index", Value = OriginalFills
let highlightCache = {}; 
let layerSortDirection = 'asc'; // 用于图层排序切换，默认从上到下

const trySet = (dst: any, propName: string, value: any) => {
  try { dst[propName] = value; } catch (e) {}
};

function copyNodeStyles(src: SceneNode, dst: SceneNode) {
  dst.opacity = (src as any).opacity;
  trySet(dst, 'blendMode', (src as any).blendMode);
  dst.visible = (src as any).visible;
  trySet(dst, 'locked', (src as any).locked);
  trySet(dst, 'rotation', (src as any).rotation);
  trySet(dst, 'constraints', (src as any).constraints);

  if ('fills' in src && src.fills !== figma.mixed && Array.isArray(src.fills)) {
    trySet(dst, 'fills', JSON.parse(JSON.stringify(src.fills)));
  }
  if ('fillStyleId' in src && typeof (src as any).fillStyleId === 'string') {
    trySet(dst, 'fillStyleId', (src as any).fillStyleId);
  }

  if ('strokes' in src && src.strokes !== figma.mixed && Array.isArray(src.strokes)) {
    trySet(dst, 'strokes', JSON.parse(JSON.stringify(src.strokes)));
  }
  if ('strokeStyleId' in src && typeof (src as any).strokeStyleId === 'string') {
    trySet(dst, 'strokeStyleId', (src as any).strokeStyleId);
  }
  if ('strokeWeight' in src && typeof (src as any).strokeWeight === 'number') {
    trySet(dst, 'strokeWeight', (src as any).strokeWeight);
  }
  trySet(dst, 'strokeAlign', (src as any).strokeAlign);
  if ('dashPattern' in src && Array.isArray((src as any).dashPattern)) {
    trySet(dst, 'dashPattern', [...(src as any).dashPattern]);
  }
  trySet(dst, 'strokeJoin', (src as any).strokeJoin);
  trySet(dst, 'strokeCap', (src as any).strokeCap);
  trySet(dst, 'strokeMiterLimit', (src as any).strokeMiterLimit);

  if ('effects' in src && src.effects !== figma.mixed && Array.isArray(src.effects)) {
    trySet(dst, 'effects', JSON.parse(JSON.stringify(src.effects)));
  }
  if ('effectStyleId' in src && typeof (src as any).effectStyleId === 'string') {
    trySet(dst, 'effectStyleId', (src as any).effectStyleId);
  }

  trySet(dst, 'clipsContent', (src as any).clipsContent);
  trySet(dst, 'constrainProportions', (src as any).constrainProportions);

  if ('cornerRadius' in src) {
    if ((src as any).cornerRadius !== figma.mixed) {
      trySet(dst, 'cornerRadius', (src as any).cornerRadius);
    } else {
      try {
        dst.topLeftRadius = (src as any).topLeftRadius;
        dst.topRightRadius = (src as any).topRightRadius;
        dst.bottomLeftRadius = (src as any).bottomLeftRadius;
        dst.bottomRightRadius = (src as any).bottomRightRadius;
      } catch (e) {}
    }
  }
  if ('cornerSmoothing' in src && (src as any).cornerSmoothing !== figma.mixed) {
    trySet(dst, 'cornerSmoothing', (src as any).cornerSmoothing);
  }

  if ('individualStrokeWeights' in src) {
    try {
      (dst as any).individualStrokeWeights = {
        top: (src as any).individualStrokeWeights.top,
        right: (src as any).individualStrokeWeights.right,
        bottom: (src as any).individualStrokeWeights.bottom,
        left: (src as any).individualStrokeWeights.left
      };
    } catch (e) {}
  }

  if (src.type === 'FRAME' && dst.type !== 'RECTANGLE') {
    trySet(dst, 'overflowDirection', (src as FrameNode).overflowDirection);
    trySet(dst, 'primaryAxisSizingMode', (src as FrameNode).primaryAxisSizingMode);
    trySet(dst, 'counterAxisSizingMode', (src as FrameNode).counterAxisSizingMode);
    trySet(dst, 'layoutMode', (src as FrameNode).layoutMode);
    if ((src as FrameNode).layoutMode !== 'NONE') {
      trySet(dst, 'primaryAxisAlignItems', (src as FrameNode).primaryAxisAlignItems);
      trySet(dst, 'counterAxisAlignItems', (src as FrameNode).counterAxisAlignItems);
      trySet(dst, 'paddingLeft', (src as FrameNode).paddingLeft);
      trySet(dst, 'paddingRight', (src as FrameNode).paddingRight);
      trySet(dst, 'paddingTop', (src as FrameNode).paddingTop);
      trySet(dst, 'paddingBottom', (src as FrameNode).paddingBottom);
      trySet(dst, 'itemSpacing', (src as FrameNode).itemSpacing);
      trySet(dst, 'layoutWrap', (src as FrameNode).layoutWrap);
    }
  }
  if ('layoutGrids' in src && Array.isArray((src as any).layoutGrids)) {
    trySet(dst, 'layoutGrids', JSON.parse(JSON.stringify((src as any).layoutGrids)));
  }
  if ('gridStyleId' in src && typeof (src as any).gridStyleId === 'string') {
    trySet(dst, 'gridStyleId', (src as any).gridStyleId);
  }
}

figma.ui.onmessage = async (msg) => {
  if (!msg || !msg.type) return; 
  // 新增：专治跨域不服！拦截 'do-fetch' 指令，由后台沙箱代发请求
  // =======================================================
  if (msg.type === 'do-fetch') {
      try {
          const res = await fetch(msg.url, msg.options);
          const json = await res.json();
          figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, data: json });
      } catch (e: any) {
          figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, error: e.message || String(e) });
      }
      return; 
  }

  console.log("【2】后端：收到了消息 ->", msg.type);
  const selection = figma.currentPage.selection;
  
  // 核心路由
  switch (msg.type) {
    
    // ===========================
    // H. 智能填充 (Smart Fill)
    // ===========================

    // 1. 获取选中图层数量 (用于前端生成对应数量的数据)
    case 'get-selection-count': {
      const textNodes = [];
      const traverse = (n: any) => {
        if (n.type === 'TEXT' && !n.removed && n.visible) textNodes.push(n);
        if ('children' in n) n.children.forEach(traverse);
      };
      const scope = figma.currentPage.selection.length > 0 ? figma.currentPage.selection : [figma.currentPage];
      scope.forEach(traverse);
      
      figma.ui.postMessage({ type: 'selection-count-res', count: textNodes.length });
      break;
    }

    // 2. 执行填充
    case 'smart-fill-exec': {
      const { dataList, mode, distribution } = msg; 
      // dataList: string[] - 待填充的内容数组
      // mode: 'replace' | 'prefix' | 'suffix'
      // distribution: 'order' (顺序) | 'random' (随机)

      const textNodes: TextNode[] = [];
      const traverse = (n: any) => {
        if (n.type === 'TEXT' && !n.removed && n.visible) textNodes.push(n);
        if ('children' in n) n.children.forEach(traverse);
      };
      // 优先处理选中项，没选中则不处理（防止误操作全页）
      if (figma.currentPage.selection.length > 0) {
        figma.currentPage.selection.forEach(traverse);
      } else {
        figma.notify("请先选择包含文本的图层");
        return;
      }

      if (textNodes.length === 0) {
        figma.notify("未找到文本图层");
        return;
      }

      // 视觉排序 (从左到右，从上到下)
      textNodes.sort((a, b) => {
         const aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
         const bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
         if (Math.abs(aAbs.y - bAbs.y) > 10) return aAbs.y - bAbs.y;
         return aAbs.x - bAbs.x;
      });

      let changeCount = 0;
      
      for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        try {
          // 加载字体
          await figma.loadFontAsync(node.fontName as FontName); // 简单处理，假设非混合字体
          
          // 获取填充内容
          let textToFill = "";
          if (distribution === 'random') {
            textToFill = dataList[Math.floor(Math.random() * dataList.length)];
          } else {
            // 顺序循环
            textToFill = dataList[i % dataList.length];
          }
          
          // 根据模式应用
          if (mode === 'prefix') {
            node.characters = textToFill + node.characters;
          } else if (mode === 'suffix') {
            node.characters = node.characters + textToFill;
          } else {
            // replace
            node.characters = textToFill;
          }
          changeCount++;
        } catch (e) {
          console.error("Fill error", e);
        }
      }
      
      figma.notify(`已填充 ${changeCount} 个文本`);
      break;
    }

    // 3. 存储/读取配置 (ClientStorage)
    case 'save-storage': {
      await figma.clientStorage.setAsync(msg.key, msg.value);
      if (msg.notify) figma.notify("配置已保存");
      figma.ui.postMessage({ type: 'storage-saved', key: msg.key, value: msg.value });
      break;
    }
    
    case 'load-storage': {
      const value = await figma.clientStorage.getAsync(msg.key);
      figma.ui.postMessage({ type: 'storage-loaded', key: msg.key, value: value });
      break;
    }

    case 'req-ai-config': {
      const aiConfig = await figma.clientStorage.getAsync('smart_ai_config');
      figma.ui.postMessage({ type: 'init-ai-config', data: aiConfig || {} });
      break;
    }

    // ===========================
    // A. 简易工具 (Simple Tools)
    // ===========================

    case 'to-frame': {
      if (selection.length === 0) { figma.notify("请选择形状"); return; }
      const newSelection: FrameNode[] = [];
      const selCopy = [...selection];
      for (const node of selCopy) {
        if (node.removed) continue;
        const parent = node.parent;
        if (!parent) continue;
        const idx = parent.children.indexOf(node);
        
        const frame = figma.createFrame();
        frame.resize(node.width, node.height);
        frame.name = node.name;
        frame.x = node.x;
        frame.y = node.y;
        parent.insertChild(idx, frame);

        copyNodeStyles(node, frame);

        if ('children' in node) {
          for (const child of [...(node as FrameNode | GroupNode).children]) {
            if (!child.removed) frame.appendChild(child);
          }
        }

        try { node.remove(); } catch(e) {}
        newSelection.push(frame);
      }
      if (newSelection.length > 0) figma.currentPage.selection = newSelection;
      figma.notify("已转换为 Frame");
      break;
    }

    case 'to-rect': {
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      const newSelection: RectangleNode[] = [];
      const selCopy = [...selection];
      for (const node of selCopy) {
        if (node.removed) continue;
        if (node.type !== 'FRAME' && node.type !== 'GROUP' && node.type !== 'SECTION') continue;
        const parent = node.parent;
        if (!parent) continue;

        if ('children' in node) {
          for (const child of [...(node as FrameNode | GroupNode).children]) {
            if (!child.removed) {
              parent.insertChild(parent.children.indexOf(node), child);
            }
          }
        }

        const idx = parent.children.indexOf(node);
        const rect = figma.createRectangle();
        rect.resize(node.width, node.height);
        rect.name = node.name;
        rect.x = node.x;
        rect.y = node.y;
        parent.insertChild(idx, rect);

        copyNodeStyles(node, rect);

        try { node.remove(); } catch(e) {}
        newSelection.push(rect);
      }
      if (newSelection.length > 0) figma.currentPage.selection = newSelection;
      break;
    }

    case 'swap-fs': {
      let count = 0;
      for (const node of selection) {
        if ('fills' in node && 'strokes' in node) {
          const temp = node.fills; 
          node.fills = node.strokes; 
          node.strokes = temp;
          if (node.strokes.length > 0 && node.strokeWeight === 0) node.strokeWeight = 1;
          count++;
        }
      }
      if (count > 0) figma.notify("已交换填充/描边");
      break;
    }

    case 'reset-image': {
      for (const node of selection) {
        if ('fills' in node && Array.isArray(node.fills)) {
          const img = (node.fills as Paint[]).find(f => f.type === 'IMAGE');
          if (img && img.imageHash) {
            const asyncImg = figma.getImageByHash(img.imageHash);
            const size = await asyncImg.getSizeAsync();
            if (size && size.width) node.resize(node.width, node.width * (size.height / size.width));
          }
        }
      }
      break;
    }

    case 'remove-al': {
      let count = 0;
      function rm(n: any) {
        if (n.layoutMode && n.layoutMode !== 'NONE') { n.layoutMode = 'NONE'; count++; }
        if (n.children) n.children.forEach(rm);
      }
      selection.forEach(rm);
      figma.notify(`移除 ${count} 个自动布局`);
      break;
    }

    case 'add-al-wrapper': {
      const newSelection = [];
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      for (const node of selection) {
        if (node.removed || !node.parent) continue;
        const frame = figma.createFrame();
        frame.name = "Auto Layout Wrapper";
        frame.layoutMode = "VERTICAL";
        frame.itemSpacing = 10;
        frame.paddingLeft = 0; frame.paddingRight = 0;
        frame.paddingTop = 0; frame.paddingBottom = 0;
        frame.primaryAxisSizingMode = "AUTO";
        frame.counterAxisSizingMode = "AUTO";
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
        frame.strokes = [];
        frame.x = node.x;
        frame.y = node.y;
        const parent = node.parent;
        const index = parent.children.indexOf(node);
        parent.insertChild(index, frame);
        frame.appendChild(node);
        newSelection.push(frame);
      }
      if (newSelection.length > 0) {
        figma.currentPage.selection = newSelection;
        figma.notify("已添加自动布局外套");
      }
      break;
    }

    case 'split-text': {
      const newSel = [];
      for (const node of selection) {
        if (node.type !== "TEXT") continue;
        const lines = node.characters.split(/\r\n|\r|\n/);
        if (lines.length <= 1) continue;
        let font: FontName = node.fontName;
        if (font === figma.mixed) font = node.getRangeFontName(0, 1) as FontName;
        try { await figma.loadFontAsync(font); } catch (e) { figma.notify("字体加载失败"); continue; }
        let cy = node.y;
        for (const l of lines) {
          if (!l.trim()) continue;
          const t = node.clone(); t.characters = l; t.textAutoResize = "WIDTH_AND_HEIGHT"; t.y = cy;
          node.parent!.appendChild(t); newSel.push(t); cy += t.height + 10;
        }
        node.remove();
      }
      if (newSel.length > 0) figma.currentPage.selection = newSel;
      break;
    }

    case 'join-text': {
      const tNodes = selection.filter(n => n.type === 'TEXT').sort((a, b) => Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x);
      if (tNodes.length < 2) { figma.notify("请选2个以上文本"); return; }
      let font: FontName = tNodes[0].fontName;
      if (font === figma.mixed) font = tNodes[0].getRangeFontName(0, 1) as FontName;
      try { await figma.loadFontAsync(font); } catch (e) { figma.notify("字体加载失败"); return; }
      const txt = tNodes.map(n => n.characters).join('\n');
      const nt = tNodes[0].clone(); nt.characters = txt; nt.textAutoResize = 'HEIGHT';
      tNodes.forEach(n => n.remove());
      figma.currentPage.selection = [nt];
      break;
    }

    // up-one
    case 'up-one': {
      const newSel: SceneNode[] = [];
      for (const node of selection) {
        if (node.parent && node.parent.parent && node.parent.type !== 'PAGE') {
          const grandParent = node.parent.parent;
          const absX = node.absoluteTransform[0][2];
          const absY = node.absoluteTransform[1][2];
          const gpAbsX = grandParent.absoluteTransform[0][2];
          const gpAbsY = grandParent.absoluteTransform[1][2];
          const relX = absX - gpAbsX;
          const relY = absY - gpAbsY;
          grandParent.appendChild(node);
          if ('layoutMode' in grandParent && (grandParent as FrameNode).layoutMode !== 'NONE') {
            try { (node as any).layoutPositioning = 'ABSOLUTE'; } catch(e) {}
          }
          node.x = relX;
          node.y = relY;
          newSel.push(node);
        }
      }
      if (newSel.length) figma.currentPage.selection = newSel;
      break;
    }

    // up-all 同理
    case 'up-all': {
      const page = figma.currentPage;
      const newSel: SceneNode[] = [];
      for (const node of selection) {
        const absX = node.absoluteTransform[0][2];
        const absY = node.absoluteTransform[1][2];
        page.appendChild(node);
        node.x = absX;
        node.y = absY;
        newSel.push(node);
      }
      figma.currentPage.selection = newSel;
      break;
    }

    case 'rename-content': {
      selection.forEach(n => {
        let name = "";
        if (n.type === 'TEXT') name = n.characters;
        else if ('findOne' in n) { const t = (n as any).findOne((x:any) => x.type === 'TEXT'); if (t) name = t.characters; }
        if (name) n.name = name.substring(0, 20);
      });
      figma.notify("已重命名");
      break;
    }

    case 'detach-all': {
      const sel = figma.currentPage.selection;
      if (sel.length === 0) { figma.notify("请先选中图层"); return; }
      const targets: InstanceNode[] = [];
      const scan = (n: any) => {
        if ('children' in n) {
          for (const child of (n as FrameNode | GroupNode).children) scan(child);
        }
        if (n.type === 'INSTANCE') targets.push(n);
      };
      sel.forEach(scan);
      if (targets.length === 0) { figma.notify("未找到可解绑的实例"); return; }
      for (const node of targets) {
        if (!node.removed) {
          try { node.detachInstance(); } catch (e) {}
        }
      }
      figma.notify(`已解绑 ${targets.length} 个组件`);
      break;
    }

    case 'remove-hidden': {
      let h: SceneNode[] = [];
      const pool = selection.length > 0 ? selection : [figma.currentPage];
      for (const n of pool) {
        if ('visible' in n && !n.visible) h.push(n);
        if ('findAll' in n) h = h.concat((n as any).findAll((x: any) => !x.visible));
      }
      let count = 0;
      h.reverse().forEach(n => { if (!n.removed) { n.remove(); count++; } });
      figma.notify(`已删除 ${count} 个隐藏图层`);
      break;
    }

    case 'sort-layers': {
      if (selection.length > 1) {
        const p = selection[0].parent;
        if (selection.every(n => n.parent === p)) {
          const isReverse = (layerSortDirection === 'desc');
          [...selection].sort((a, b) => {
            const diffY = a.y - b.y;
            const diffX = a.x - b.x;
            const result = Math.abs(diffY) > 2 ? diffY : diffX;
            return isReverse ? -result : result;
          }).forEach(n => p!.appendChild(n));
          figma.notify(isReverse ? "已反转排列（从下到上）" : "已排列（从上到下）");
          layerSortDirection = isReverse ? 'asc' : 'desc';
        }
      } else {
        figma.notify("请至少选择两个同级图层");
      }
      break;
    }

    case 'ungroup-all': {
      let count = 0;
      // 收集所有 Group: 包含选中的 Group 以及其内部的 Group
      const groups: GroupNode[] = [];
      function collect(n: BaseNode) {
        if (n.type === 'GROUP') groups.push(n);
        if ('children' in n) for (const child of (n as any).children) collect(child);
      }
      for (const node of selection) collect(node);
      // 解组（从内向外解组可能更安全，但 ungroup 后子节点会保留）
      for (const g of groups) {
        if (!g.removed) {
          figma.ungroup(g);
          count++;
        }
      }
      figma.notify(`已解散 ${count} 个组`);
      break;
    }

    case 'unlock-all': {
      let count = 0;
      function ul(n: any) {
        if ('locked' in n && n.locked) { n.locked = false; count++; }
        if ('children' in n) n.children.forEach(ul);
      }
      selection.forEach(ul);
      figma.notify(`已解锁 ${count} 个图层`);
      break;
    }

    case 'pixel-perfect': {
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      let count = 0;
      for (const node of selection) {
        if (!node.removed) {
          const newX = Math.round(node.x);
          const newY = Math.round(node.y);
          const newW = Math.round(node.width);
          const newH = Math.round(node.height);
          if (node.x !== newX || node.y !== newY) { node.x = newX; node.y = newY; }
          if (node.width !== newW || node.height !== newH) node.resize(newW, newH);
          count++;
        }
      }
      figma.notify(`已对齐 ${count} 个图层`);
      break;
    }

    case 'swap-positions': {
      if (selection.length !== 2) { figma.notify("请严格选择 2 个图层进行交换"); return; }
      const n1 = selection[0];
      const n2 = selection[1];
      const x1 = n1.x, y1 = n1.y;
      n1.x = n2.x; n1.y = n2.y;
      n2.x = x1; n2.y = y1;
      figma.notify("位置已互换");
      break;
    }

    case 'create-styles': {
      console.log("=== 开始执行创建样式 ===");
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      let createdCount = 0;
      const conflicts: string[] = [];
      const errors: string[] = [];
      try {
        const localPaints = await figma.getLocalPaintStylesAsync();
        const localTexts = await figma.getLocalTextStylesAsync();
        const localEffects = await figma.getLocalEffectStylesAsync();

        for (const node of selection) {
          if (node.removed) continue;
          const name = node.name;

          if ('fills' in node && node.type !== 'GROUP' && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
            if (node.fills[0].type !== 'IMAGE') {
              const exist = localPaints.find(s => s.name === name);
              if (exist) { if (!conflicts.includes(name)) conflicts.push(name + " (颜色)"); }
              else {
                try {
                  const style = figma.createPaintStyle();
                  createdCount++;
                  style.name = name;
                  style.paints = JSON.parse(JSON.stringify(node.fills));
                  try { node.fillStyleId = style.id; } catch (e) {}
                } catch (err) { errors.push(name); }
              }
            }
          }

          if (node.type === 'TEXT') {
            const exist = localTexts.find(s => s.name === name);
            if (exist) { if (!conflicts.includes(name)) conflicts.push(name + " (文本)"); }
            else {
              try {
                const style = figma.createTextStyle();
                createdCount++;
                style.name = name;
                const font = node.fontName;
                if (font !== figma.mixed) {
                  await figma.loadFontAsync(font);
                  style.fontName = font;
                  style.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 12;
                  if (node.letterSpacing !== figma.mixed) style.letterSpacing = node.letterSpacing;
                  if (node.lineHeight !== figma.mixed) style.lineHeight = node.lineHeight;
                  if (node.textDecoration !== figma.mixed) style.textDecoration = node.textDecoration;
                  try { node.textStyleId = style.id; } catch (e) {}
                }
              } catch (err) { errors.push(name); }
            }
          }

          if ('effects' in node && node.effects !== figma.mixed && Array.isArray(node.effects) && node.effects.length > 0) {
            const exist = localEffects.find(s => s.name === name);
            if (exist) { if (!conflicts.includes(name)) conflicts.push(name + " (效果)"); }
            else {
              try {
                const style = figma.createEffectStyle();
                createdCount++;
                style.name = name;
                style.effects = JSON.parse(JSON.stringify(node.effects));
                try { node.effectStyleId = style.id; } catch (e) {}
              } catch (err) { errors.push(name); }
            }
          }
        }
      } catch (e) { console.error("全局错误:", e); figma.notify("样式创建失败: " + String(e).slice(0, 50)); return; }

      const parts = [];
      if (createdCount > 0) parts.push(`新建 ${createdCount} 个`);
      if (conflicts.length > 0) parts.push(`跳过重复 ${conflicts.length} 个`);
      if (errors.length > 0) parts.push(`失败 ${errors.length} 个`);
      if (parts.length > 0) figma.notify(parts.join('，'));
      else figma.notify("未发现可创建的样式（选中的图层可能没有填充/文本/效果属性）");
      break;
    }

    case 'match-styles': {
      console.log("=== 开始匹配样式 ===");
      const sel = figma.currentPage.selection;
      if (sel.length === 0) { figma.notify("请先选择范围"); return; }
      let countFill = 0, countStroke = 0, countText = 0, countEffect = 0;
      try {
        const paints = await figma.getLocalPaintStylesAsync();
        const texts = await figma.getLocalTextStylesAsync();
        const effects = await figma.getLocalEffectStylesAsync();

        const paintMap = new Map<string, string>();
        paints.forEach(s => paintMap.set(JSON.stringify(s.paints), s.id));
        const effectMap = new Map<string, string>();
        effects.forEach(s => effectMap.set(JSON.stringify(s.effects), s.id));
        const textMap = new Map<string, string>();
        texts.forEach(s => {
          const fingerprint = JSON.stringify({
            family: s.fontName.family,
            style: s.fontName.style,
            size: s.fontSize,
            lh: s.lineHeight,
            ls: s.letterSpacing,
            td: s.textDecoration,
            pi: s.paragraphIndent,
            ps: s.paragraphSpacing
          });
          textMap.set(fingerprint, s.id);
        });

        const traverse = async (node: any) => {
          if (node.removed) return;
          if ('fills' in node && node.fills !== figma.mixed && node.fills.length > 0 && node.fillStyleId === '') {
            const key = JSON.stringify(node.fills);
            if (paintMap.has(key)) { try { await node.setFillStyleIdAsync(paintMap.get(key)!); countFill++; } catch (e) {} }
          }
          if ('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeStyleId === '') {
            const key = JSON.stringify(node.strokes);
            if (paintMap.has(key)) { try { await node.setStrokeStyleIdAsync(paintMap.get(key)!); countStroke++; } catch (e) {} }
          }
          if ('effects' in node && node.effects !== figma.mixed && node.effects.length > 0 && node.effectStyleId === '') {
            const key = JSON.stringify(node.effects);
            if (effectMap.has(key)) { try { await node.setEffectStyleIdAsync(effectMap.get(key)!); countEffect++; } catch (e) {} }
          }
          if (node.type === 'TEXT' && node.textStyleId === '' && node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
            const key = JSON.stringify({
              family: node.fontName.family,
              style: node.fontName.style,
              size: node.fontSize,
              lh: node.lineHeight,
              ls: node.letterSpacing,
              td: node.textDecoration,
              pi: node.paragraphIndent,
              ps: node.paragraphSpacing
            });
            if (textMap.has(key)) { try { await node.setTextStyleIdAsync(textMap.get(key)!); countText++; } catch (e) {} }
          }
          if ('children' in node) {
            for (const child of node.children) await traverse(child);
          }
        };

        for (const node of sel) await traverse(node);
      } catch (e) { console.error(e); figma.notify("匹配出错"); return; }

      const total = countFill + countStroke + countText + countEffect;
      if (total > 0) figma.notify(`匹配成功: 填充${countFill} / 描边${countStroke} / 文本${countText} / 效果${countEffect}`);
      else figma.notify("未发现可匹配的样式");
      break;
    }

    // ===========================
    // B. 高级查找 (Find & Select) - 【已修复】
    // ===========================
    case 'fetch-selection-name': {
      const sel = figma.currentPage.selection;
      if (sel.length > 0) {
        figma.ui.postMessage({ type: 'update-name-input', name: sel[0].name });
      } else {
        figma.notify("请先选择一个图层以获取名称");
      }
      break;
    }
    
    case 'find-and-select': {
        const f = msg.filters;
        const sel = figma.currentPage.selection;
        
        console.log(`=== 开始查找 (v3修复版) ===`);
        console.log(`Scope: ${f.scope} | 选中图层: ${sel.length}`);

        // 🔥 1. 使用全新变量名，防止作用域冲突
        let searchTargets = []; 

        // =========================================================
        // A. 构建查找池 (Pool Construction)
        // =========================================================
        if (f.scope === 'inside') {
            // 模式：内在元素 (不包含选中项本身)
            if (sel.length === 0) {
                figma.notify("⚠️ 请先选择一个容器(Frame/Group)");
                return;
            }
            for (const node of sel) {
                if ('findAll' in node) {
                    // 使用 push(...) 而不是 concat，确保修改的是原数组
                    const children = node.findAll(() => true);
                    searchTargets.push(...children);
                }
            }
        } 
        else if (f.scope === 'children') {
            // 模式：仅直系子级
            if (sel.length === 0) {
                figma.notify("⚠️ 请先选择一个容器(Frame/Group)");
                return;
            }
            for (const node of sel) {
                if ('children' in node) {
                    searchTargets.push(...node.children);
                }
            }
        }
        else if (f.scope === 'sibling') {
            // 模式：同级
            if (sel.length > 0 && sel[0].parent) {
                const siblings = sel[0].parent.children.filter(n => !sel.includes(n));
                searchTargets.push(...siblings);
            } else {
                figma.notify("⚠️ 请先选择一个图层");
                return;
            }
        } 
        else if (f.scope === 'page') {
            // 模式：全页 - 直接查找当前页面所有图层，忽略选中状态
            console.log(">> 策略: 全页面查找");
            const allPageNodes = figma.currentPage.findAll(() => true);
            searchTargets.push(...allPageNodes);
        }
        else {
            // 模式：子孙元素 (descendants) - 默认模式
            // 逻辑：如果选了图层，查“选中项+选中项内部”；如果没选，查“全页”
            
            if (sel.length > 0) {
                console.log(">> 策略: 查找选中项及其后代");
                
                // 1. 先把【选中项本身】加进去
                // (使用 for 循环最稳妥)
                for (const node of sel) {
                    searchTargets.push(node);
                    
                    // 2. 再把【选中项的子孙】加进去
                    if ('findAll' in node) {
                        const children = node.findAll(() => true);
                        searchTargets.push(...children);
                    }
                }
            } else {
                console.log(">> 策略: 全页面查找");
                const allPageNodes = figma.currentPage.findAll(() => true);
                searchTargets.push(...allPageNodes);
            }
        }

        // =========================================================
        // B. 去重 (Deduplication) - 使用 Map ID 去重最稳健
        // =========================================================
        const uniqueMap = new Map();
        searchTargets.forEach(node => uniqueMap.set(node.id, node));
        const finalPool = Array.from(uniqueMap.values());
        
        console.log(`🔍 待筛选池最终大小: ${finalPool.length}`);

        const results = [];

        // =========================================================
        // C. 遍历筛选 (Filtering)
        // =========================================================
        for (const node of finalPool) {
            let match = true;

            // 1. 名称匹配
            if (f.name && f.name.val) {
                let n = node.name; 
                let q = f.name.val;
                if (!f.name.caseSensitive) { 
                    n = n.toLowerCase(); 
                    q = q.toLowerCase(); 
                }
                if (!n.includes(q)) match = false;
            }

            // 2. 类型匹配
            if (match && f.types && f.types.vals.length > 0) {
                const t = node.type;
                const ts = f.types.vals;
                let isType = false;

                if (ts.includes(t)) isType = true;
                if (ts.includes('AUTOLAYOUT') && t === 'FRAME' && node.layoutMode !== 'NONE') isType = true;
                if (ts.includes('IMAGE') && 'fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
                    if (node.fills.some(p => p.type === 'IMAGE' && p.visible !== false)) isType = true;
                }
                if (ts.includes('COMPONENT_SET') && t === 'COMPONENT_SET') isType = true;
                if (ts.includes('SECTION') && t === 'SECTION') isType = true;

                if (f.types.logic === 'include') {
                    if (!isType) match = false;
                } else { 
                    if (isType) match = false;
                }
            }

            // 3. 状态匹配
            if (match && f.states && f.states.vals.length > 0) {
                let isState = false;
                const s = f.states.vals;

                if (s.includes('hidden') && !node.visible) isState = true;
                if (s.includes('locked') && node.locked) isState = true;
                if (s.includes('mask') && node.isMask) isState = true;
                if (s.includes('export') && node.exportSettings && node.exportSettings.length > 0) isState = true;

                if (s.includes('no-fill') && 'fills' in node && node.fills !== figma.mixed) {
                    if (Array.isArray(node.fills) && node.fills.length === 0) isState = true;
                }
                if (s.includes('no-stroke') && 'strokes' in node && node.strokes !== figma.mixed) {
                    if (Array.isArray(node.strokes) && node.strokes.length === 0) isState = true;
                }
                if (s.includes('clip') && 'clipsContent' in node && node.clipsContent) isState = true;
                if (s.includes('no-children') && 'children' in node) {
                    if (node.children.length === 0) isState = true;
                }

                if (f.states.logic === 'include') {
                    if (!isState) match = false;
                } else {
                    if (isState) match = false;
                }
            }

            // 4. 属性匹配 (Props) - 加强容错
            if (match && f.props && f.props.length > 0) {
                for (const p of f.props) {
                    let val = undefined;
                    try {
                        if (p.key === 'name') val = node.name;
                        else if (p.key === 'fillCount' && 'fills' in node && node.fills !== figma.mixed) val = node.fills.length;
                        else if (p.key === 'strokeCount' && 'strokes' in node && node.strokes !== figma.mixed) val = node.strokes.length;
                        else if (p.key in node) {
                            const v = node[p.key];
                            if (v !== figma.mixed) val = v;
                        }
                    } catch(e) {}

                    if (val === undefined) {
                        match = false; break; 
                    }

                    const tgt = p.val; 
                    // 数字比较 vs 字符串比较
                    if (p.op === '=') { if (val != tgt) match = false; } 
                    else if (p.op === '!=') { if (val == tgt) match = false; }
                    else if (p.op === '>') { if (Number(val) <= Number(tgt)) match = false; } 
                    else if (p.op === '<') { if (Number(val) >= Number(tgt)) match = false; } 
                    else if (p.op === 'has') { if (!String(val).toLowerCase().includes(String(tgt).toLowerCase())) match = false; }
                }
            }

            if (match) {
                results.push(node);
            }
        }

        console.log(`✅ 最终匹配: ${results.length}`);
        
        if (results.length > 0) {
            figma.currentPage.selection = results;
            figma.viewport.scrollAndZoomIntoView(results);
            figma.notify(`✅ 已选中 ${results.length} 个图层`);
            
            // 🔥 新增：将结果回传给 UI
            figma.ui.postMessage({
              type: 'found-layers-result',
              count: results.length,
              layers: results.map(n => ({ id: n.id, name: n.name, type: n.type }))
            });

        } else {
            figma.notify("⚠️ 未找到图层，请检查 Console的筛选池大小");
            figma.ui.postMessage({ type: 'found-layers-result', count: 0, layers: [] });
        }
        break;
    }

    // ==========================================
    // 后端逻辑：响应 focus-layers
    // ==========================================
        case 'focus-layers': {
            const runFocus = async () => {
                try {
                    const ids = msg.ids;
                    if (!ids || ids.length === 0) return;

                    // 1. 异步获取图层 (Figma 强制要求)
                    // 使用 Promise.all 确保并发获取，速度极快
                    const nodes = await Promise.all(ids.map(id => figma.getNodeByIdAsync(id)));
                    
                    const targets: SceneNode[] = [];
                    const selection: SceneNode[] = [];
                    const currentPageId = figma.currentPage.id;

                    // 2. 快速筛选
                    for (const node of nodes) {
                        if (!node || node.removed) continue;
                        if (node.type === 'DOCUMENT' || node.type === 'PAGE') continue;
                        
                        // 确保在当前页
                        // 简单的向上查找，确保安全
                        let p = node.parent; 
                        let isCurrent = false;
                        // 大多数情况父级就是 Page，优化判断速度
                        if (p && p.type === 'PAGE') {
                            isCurrent = (p.id === currentPageId);
                        } else {
                            // 深度查找
                            while (p) {
                                if (p.type === 'PAGE') {
                                    isCurrent = (p.id === currentPageId);
                                    break;
                                }
                                p = p.parent;
                            }
                        }

                        if (isCurrent) {
                            // 只要在当前页，就加入“视图定位目标”
                            targets.push(node as SceneNode);
                            
                            // 如果没锁且可见，也加入“选中目标”
                            if (!node.locked && node.visible) {
                                selection.push(node as SceneNode);
                            }
                        }
                    }

                    if (targets.length > 0) {
                        // A. 尝试选中 (如果全是锁定的，这里就是空数组，会清空选择，是正确的表现)
                        figma.currentPage.selection = selection;

                        // B. 视图定位 (这是你要的核心功能)
                        figma.viewport.scrollAndZoomIntoView(targets);
                        
                        // C. 只有多选时才提示，单选静默，体验最好
                        if (targets.length > 1) {
                            figma.notify(`已定位 ${targets.length} 项`);
                        }
                    }

                } catch (e: any) {
                    console.log("定位错误 (已忽略):", e);
                }
            };

            runFocus();
            break;
        }

    // ===========================
    // E. 文本查找与替换
    // ===========================
    case 'find-replace': {
      const { findText, replaceText } = msg;
      if (!findText) { figma.notify("请输入查找内容，注意区分大小写"); return; }
      
      // 确定范围：如果有选区则在选区内查，否则在全页查
      const scope = selection.length > 0 ? selection : [figma.currentPage];
      let count = 0;
      
      // 递归查找文本节点
      const textNodes: TextNode[] = [];
      const collect = (n: any) => {
        if (n.type === 'TEXT') textNodes.push(n);
        if ('children' in n) n.children.forEach(collect);
      };
      scope.forEach(collect);

      if (textNodes.length === 0) { figma.notify("范围内没有文本"); return; }

      // 批量处理
      for (const node of textNodes) {
        if (node.characters.includes(findText)) {
          try {
            // 必须加载字体才能修改内容
            const font = node.fontName;
            if (font === figma.mixed) {
               // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
               await figma.loadFontAsync(node.getRangeFontName(0,1) as FontName);
            } else {
               await figma.loadFontAsync(font);
            }
            
            // 执行替换
            node.characters = node.characters.split(findText).join(replaceText);
            count++;
          } catch (e) {
            console.error("字体加载失败或替换出错", e);
          }
        }
      }
      
      if (count > 0) figma.notify(`已替换 ${count} 处文本`);
      else figma.notify("未找到匹配内容");
      break;
    }

    // ===========================
    // F. PPT 工具
    // ===========================
    case 'ppt-step-1': { // 初始化
      const pageName = figma.currentPage.name.toLowerCase();
      
      // --- 修复点 1：安全检查不通过时，要告诉 UI 重置按钮 ---
      if (!pageName.includes('copy') && !pageName.includes('副本')) {
        figma.notify("⚠️ 请先将 Page 重命名为 'xxx 副本' 以确保安全！", {error: true});
        // 发送一个 'step-error' 消息给 UI，让它停止转圈
        figma.ui.postMessage({ type: 'step-error', step: 1 }); 
        return; 
      }
      
      const slides = getSlides();
      // --- 修复点 2：没选图层时，也要告诉 UI 重置按钮 ---
      if (slides.length === 0) { 
        figma.notify("请至少选择一个 Frame 画板"); 
        figma.ui.postMessage({ type: 'step-error', step: 1 });
        return; 
      }
      
      // 执行 Step 1 函数
      await pptStep1_Init(slides);
      break;
    }

    case 'ppt-step-2': { // 栅格化图标
      const slides = getSlides();
      await pptStep2_Rasterize(slides);
      break;
    }

    case 'ppt-step-3': { // 扁平化
      const slides = getSlides();
      await pptStep3_Flatten(slides);
      break;
    }

    case 'ppt-step-4': { // 提取数据
      let slides = getSlides();
      
      // === 修复：使用绝对坐标排序 ===
      slides = sortNodesByVisualPosition(slides);
      
      // 函数内部会发送 step-done，这里不需要再发了
      await pptStep4_Extract(slides);
      break;
    }

    case 'ppt-step-5': { // 导出资源
      let slides = getSlides();
      
      // === 修复：使用绝对坐标排序 (保持顺序一致) ===
      slides = sortNodesByVisualPosition(slides);
      
      // 同上，内部已发消息
      await pptStep5_ExportImages(slides);
      break;
    }

    // ===========================
    // G. 组件清洗 Refiner (Smart Grouping V2 - Updated)
    // ===========================
    case 'lint-variants': {
        console.log("【3】后端：进入严格分类逻辑...");
        
        const cfg = msg.config || msg;
        const targets: SceneNode[] = [];
        
        const targetTypes = cfg.targetTypes || { compName: true, propName: true, propValue: true };
        
        let scopeNodes: readonly SceneNode[] = [];
        if (cfg.scope === 'page') {
            scopeNodes = figma.currentPage.children;
        } else {
            scopeNodes = figma.currentPage.selection;
        }

        const collectTargets = (nodes: readonly SceneNode[]) => {
            for (const node of nodes) {
                if (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') {
                    targets.push(node);
                }
                if ('children' in node) collectTargets((node as any).children);
            }
        };
        collectTargets(scopeNodes);

        let findRegex: RegExp | null = null;
        if (cfg.mode === 'find' && cfg.findText) {
             try {
                const escape = (s:string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let pat = escape(cfg.findText);
                if (cfg.wholeWord) pat = `\\b${pat}\\b`;
                findRegex = new RegExp(pat, cfg.caseSensitive ? 'g' : 'gi');
            } catch(e) {}
        }

        const results = [];

        const checkString = (text: string) => {
            let res = { changed: false, val: text };
            if (cfg.mode === 'lint') {
                res = convertNameAdvanced(text, cfg.format, cfg.separator, cfg.casing, cfg.emoji, cfg.removeId, cfg.unmarkHidden);
            } else if (findRegex) {
                if (findRegex.test(text)) {
                    res.val = text.replace(findRegex, cfg.replaceText || '');
                    res.changed = true;
                }
                if (res.changed && cfg.markHidden) {
                    if (!res.val.startsWith('.') && !res.val.startsWith('_')) res.val = '.' + res.val;
                }
                if (cfg.unmarkHidden) {
                    if (res.val.startsWith('.') || res.val.startsWith('_')) {
                        res.val = res.val.substring(1);
                        res.changed = true;
                    }
                }
            }
            return res;
        };

        for (const node of targets) {
            try {
                if (node.type === 'COMPONENT_SET') {
                    if (targetTypes.compName) {
                        const res = checkString(node.name);
                        if (res.changed) {
                            results.push({
                                id: node.id, compId: node.id, compName: node.name,
                                type: 'COMPONENT_SET',
                                targetType: 'CompName',
                                propName: 'Name', oldVal: node.name, newVal: res.val
                            });
                        }
                    }
                } 
                
                else if (node.type === 'COMPONENT') {
                    const isVariant = node.parent && node.parent.type === 'COMPONENT_SET';
                    const compId = isVariant ? node.parent!.id : node.id;
                    const CompName = isVariant ? node.parent!.name : node.name;
                    const groupType = isVariant ? 'COMPONENT_SET' : 'COMPONENT';
                    
                    if (!isVariant) {
                        if (targetTypes.compName) {
                            const res = checkString(node.name);
                            if (res.changed) {
                                results.push({
                                    id: node.id, compId: compId, compName: CompName,
                                    type: groupType,
                                    targetType: 'CompName',
                                    propName: 'Name', oldVal: node.name, newVal: res.val
                                });
                            }
                        }
                    } else {
                         const rawProps = node.name.split(',').map(p => p.trim());
                         const newProps: string[] = [];
                         let hasAnyChange = false;

                         rawProps.forEach(pair => {
                             const parts = pair.split('=');
                             if (parts.length < 2) {
                                 newProps.push(pair); 
                                 return;
                             }
                             
                             const key = parts[0].trim();
                             const val = parts[1].trim();
                             
                             if (targetTypes.propName) {
                                 const resKey = checkString(key);
                                 if (resKey.changed) {
                                     results.push({
                                         id: node.id, compId: compId, compName: CompName,
                                         type: groupType,
                                         targetType: 'PropName',
                                         propName: 'Property',
                                         oldVal: key, newVal: resKey.val
                                     });
                                     hasAnyChange = true;
                                 }
                             }

                             if (targetTypes.propValue) {
                                 const resVal = checkString(val);
                                 if (resVal.changed) {
                                     results.push({
                                         id: node.id, compId: compId, compName: CompName,
                                         type: groupType,
                                         targetType: 'PropValue',
                                         propName: key,
                                         oldVal: val, newVal: resVal.val
                                     });
                                     hasAnyChange = true;
                                 }
                             }
                             
                             const finalKey = (targetTypes.propName && checkString(key).changed) ? checkString(key).val : key;
                             const finalVal = (targetTypes.propValue && checkString(val).changed) ? checkString(val).val : val;
                             newProps.push(`${finalKey}=${finalVal}`);
                         });
                         
                         if (hasAnyChange) {
                             const fullNewName = newProps.join(', ');
                             for (let k = results.length - 1; k >= 0; k--) {
                                 if (results[k].id === node.id) {
                                     if(!results[k].fullResult) results[k].fullResult = fullNewName;
                                 } else {
                                     break;
                                 }
                             }
                         }
                    }
                }
            } catch(e) { console.error(e); }
        }

        figma.ui.postMessage({ type: 'lint-results', data: results });
        break;
    }

    case 'fix-variants': {
        const items = msg.items;
        let count = 0;
        for (const item of items) {
            try {
                const node = await figma.getNodeByIdAsync(item.id);
                if (node) {
                    node.name = item.fullResult || item.newVal;
                    count++;
                }
            } catch (err) {}
        }
        figma.notify(`✨ 已成功修复 ${count} 项命名`);
        break;
    }

    // -------------------------------------------------------------
    // 1. 查找功能：改为返回具体的匹配项列表 (后端修复版)
    // -------------------------------------------------------------
    case 'text-find-matches': {
        const { scope, findText } = msg;
        console.log("【后端】收到文本查找请求:", scope, findText); // 调试日志

        const results = [];
        let searchPool = [];

        // 1. 确定搜索范围
        if (scope === 'selection') {
            searchPool = figma.currentPage.selection;
        } else {
            // 搜索整个页面 (包含页面本身)
            searchPool = [figma.currentPage]; 
        }

        if (searchPool.length === 0 && scope === 'selection') {
            figma.notify("请先选择图层");
            // 即使失败，也要发回空结果，以此重置前端按钮状态
            figma.ui.postMessage({ type: 'text-find-results', data: [] });
            return;
        }

        // 2. 递归查找函数
        const traverse = (node) => {
            // 只有可见的文本层才参与查找
            if (node.type === 'TEXT' && node.visible) {
                const fullText = node.characters;
                // 转义正则特殊字符
                const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // 全局、不区分大小写匹配
                const regex = new RegExp(escapedFindText, 'gi');
                
                let match;
                while ((match = regex.exec(fullText)) !== null) {
                    results.push({
                        id: node.id,
                        fullText: fullText,
                        index: match.index,
                        length: match[0].length,
                        matchText: match[0]
                    });
                }
            }
            
            // 递归子级
            if ('children' in node) {
                node.children.forEach(traverse);
            }
        };

        // 3. 执行查找
        searchPool.forEach(traverse);
        
        console.log(`【后端】查找完成，找到 ${results.length} 项`);

        // 4. 发送结果给前端
        figma.ui.postMessage({ type: 'text-find-results', data: results });
        
        if (results.length === 0) {
            figma.notify("未找到匹配文本");
        }
        break;
    }

    // -------------------------------------------------------------
    // 2. 定位功能 (修复版：兼容组件清洗和文字工具)
    // -------------------------------------------------------------
    case 'locate-node': {
        try {
            const node = await figma.getNodeByIdAsync(msg.id);
            
            if (node) {
                // === 第一步：通用操作 (先选中并聚焦) ===
                // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                figma.currentPage.selection = [node];
                figma.viewport.scrollAndZoomIntoView([node]);

                // === 第二步：文字工具特有逻辑 (仅当是文本且包含索引参数时执行) ===
                if (node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number') {
                    
                    const cacheKey = `${msg.id}_${msg.index}`;
                    
                    // 加载字体
                    const font = node.fontName === figma.mixed 
                                 ? node.getRangeFontName(0, 1) 
                                 : node.fontName;
                    await figma.loadFontAsync(font);

                    // A. 还原颜色
                    if (highlightCache[cacheKey]) {
                        const cachedData = highlightCache[cacheKey]; // { fills, length }
                        node.setRangeFills(msg.index, msg.index + cachedData.length, cachedData.fills);
                        
                        delete highlightCache[cacheKey];
                        figma.notify("已还原颜色");
                        figma.ui.postMessage({ type: 'highlight-status', key: cacheKey, status: false });
                    
                    } else {
                        // B. 执行高亮
                        const currentFills = node.getRangeFills(msg.index, msg.index + 1);
                        highlightCache[cacheKey] = { fills: currentFills, length: msg.length };
                        
                        const highlightPaint = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
                        node.setRangeFills(msg.index, msg.index + msg.length, highlightPaint);
                        
                        figma.notify("已标记 (再次点击可还原)");
                        figma.ui.postMessage({ type: 'highlight-status', key: cacheKey, status: true });
                    }
                }
            } else {
                figma.notify("图层不存在 (可能已被删除)");
            }
        } catch (e) {
            console.error("定位失败:", e);
            // 即使报错，通常是因为字体加载或跨页问题，不应该影响基础选中
            // 如果已经在上面被选中了，这里就不报干扰信息了
        }
        break;
    }

    // -------------------------------------------------------------
    // 3. 替换功能：支持点对点替换 (修复Bug 1 & 4)
    // -------------------------------------------------------------
    case 'text-replace-batch': {
        const { tasks, replaceText } = msg; 
        // tasks 是一个数组: [{id, index, length}, ...]
        
        let successCount = 0;
        const processedIds = new Set(); // 用于记录成功的 uniqueId，发回给前端禁用

        // 🌟 关键策略：按 Node ID 分组，组内按 Index 倒序排列
        // 为什么倒序？因为替换前面的文字会改变后面文字的索引。
        // 从后往前替换，坐标永远是准的。
        
        const groups = {};
        tasks.forEach(task => {
            if (!groups[task.id]) groups[task.id] = [];
            groups[task.id].push(task);
        });

        for (const nodeId in groups) {
            const node = await figma.getNodeByIdAsync(nodeId);
            if (!node || node.type !== 'TEXT') continue;

            const groupTasks = groups[nodeId];
            // 🌟 倒序排序
            groupTasks.sort((a, b) => b.index - a.index);

            try {
                // 加载字体
                await figma.loadFontAsync(node.fontName === figma.mixed 
                        ? node.getRangeFontName(0, 1) 
                        : node.fontName);

                // 执行替换
                for (const task of groupTasks) {
                    // 再次检查字符是否匹配（防止并发修改导致的错位）
                    const currentStr = node.characters.substring(task.index, task.index + task.length);
                    // 简单的校验，略过严格校验以允许大小写差异
                    
                    node.deleteCharacters(task.index, task.index + task.length);
                    node.insertCharacters(task.index, replaceText);
                    
                    successCount++;
                    // 记录前端传来的唯一标识 (uid)，以便前端禁用
                    if (task.uid) processedIds.add(task.uid);
                }
            } catch (err) {
                console.error(`替换失败 ${nodeId}:`, err);
            }
        }

        // 通知前端哪些任务完成了
        figma.ui.postMessage({ 
            type: 'text-replace-success', 
            count: successCount,
            processedUids: Array.from(processedIds)
        });
        
        figma.notify(`已替换 ${successCount} 处文本`);
        break;
    }

    // -------------------------------------------------------------
    // [新] 一键清除所有高亮
    // -------------------------------------------------------------
    case 'clear-all-highlights': {
        let count = 0;
        for (const key in highlightCache) {
            const [nodeId, indexStr] = key.split('_');
            const index = parseInt(indexStr);
            const data = highlightCache[key]; // { fills, length }

            try {
                const node = await figma.getNodeByIdAsync(nodeId);
                if (node && node.type === 'TEXT') {
                     const font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
                     await figma.loadFontAsync(font);
                     node.setRangeFills(index, index + data.length, data.fills);
                     count++;
                }
            } catch(e) { console.log("还原失败", e) }
        }
        highlightCache = {}; // 清空池子
        figma.notify(`已还原 ${count} 处高亮`);
        // 通知前端清除所有高亮样式
        figma.ui.postMessage({ type: 'clear-all-highlights-ui' });
        break;
    }
    
    // 另外：在 text-replace-batch 成功后，也要清理对应的缓存，防止还原时报错
    // 在 case 'text-replace-batch' 的循环里，successCount++ 后面加一行：
    // delete highlightCache[`${task.id}_${task.index}`];

    // -------------------------------------------------------------
    // 3. 替换功能：支持点对点替换 (修复Bug 1 & 4)
    // -------------------------------------------------------------
    case 'text-replace-batch': {
        const { ids, findText, replaceText } = msg;
        let count = 0;

        // 批量处理 ID
        for (const id of ids) {
            const node = await figma.getNodeByIdAsync(id);
            if (node && node.type === 'TEXT') {
                try {
                    // 加载字体 (必要步骤)
                    await figma.loadFontAsync(node.fontName === figma.mixed 
                        ? node.getRangeFontName(0, 1) 
                        : node.fontName);
                    
                    // 执行替换 (全局替换该节点内的所有匹配项)
                    // 使用正则进行全局替换 (Global, Case Insensitive)
                    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    
                    if (regex.test(node.characters)) {
                        node.characters = node.characters.replace(regex, replaceText);
                        count++;
                    }
                } catch (err) {
                    console.error(`替换文本失败 (ID: ${id}):`, err);
                }
            }
        }
        figma.notify(`已替换 ${count} 个文本图层`);
        break;
    }

    // ===========================
    // === 锚点工具 (Jumpback) ===
    // ===========================

    case 'jb-init': {
      // 初始化读取
      const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
      const spots = dataStr ? JSON.parse(dataStr) :[];
      figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
      break;
    }

    case 'jb-save': {
      const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
      let spots = dataStr ? JSON.parse(dataStr) :[];
      
      if (spots.length >= 5) {
        figma.notify("最多只能保存 5 个锚点！");
        return;
      }

      // 获取案发现场数据
      const currentSelection = figma.currentPage.selection;
      // 默认名字：如果选中了图层就用图层名，否则叫 Spot
      const defaultName = currentSelection.length > 0 ? currentSelection[0].name.substring(0, 15) : `Spot ${spots.length + 1}`;

      const newSpot = {
        id: 'spot_' + Date.now(),
        name: defaultName,
        pageId: figma.currentPage.id,
        pageName: figma.currentPage.name,
        zoom: figma.viewport.zoom,
        centerX: figma.viewport.center.x,
        centerY: figma.viewport.center.y,
        // 保存选中的图层 ID 数组
        selectionIds: currentSelection.map(n => n.id)
      };

      spots.push(newSpot);
      figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
      
      figma.notify("📍 位置已保存");
      figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
      break;
    }

    case 'jb-jump': {
      const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
      if (!dataStr) return;
      const spots = JSON.parse(dataStr);
      const spot = spots.find((s: any) => s.id === msg.id);
      
      if (!spot) return;

      try {
        // 1. 跨页面跳转 (如果所在的 Page 不一样)
        if (figma.currentPage.id !== spot.pageId) {
          // === 修复点 1：使用 getNodeByIdAsync 异步获取节点 ===
          const targetPage = await figma.getNodeByIdAsync(spot.pageId);
          if (targetPage && targetPage.type === 'PAGE') {
            // === 修复点 2：在 dynamic-page 模式下，必须用 setCurrentPageAsync 切换页面 ===
            await figma.setCurrentPageAsync(targetPage as PageNode);
          } else {
            figma.notify("⚠️ 该位置所在的页面已被删除！");
            return;
          }
        }

        // 2. 恢复视角坐标和缩放
        figma.viewport.center = { x: spot.centerX, y: spot.centerY };
        figma.viewport.zoom = spot.zoom;

        // 3. 尝试恢复离开前选中的图层
        const nodesToSelect: SceneNode[] = [];
        if (spot.selectionIds && Array.isArray(spot.selectionIds)) {
           // 使用 for...of 配合 await 依次获取节点
           for (const id of spot.selectionIds) {
             // === 修复点 3：同样使用 getNodeByIdAsync 获取历史图层 ===
             const node = await figma.getNodeByIdAsync(id);
             
             // 确保节点还存在，且不是页面本身 (防止意外)
             if (node && !node.removed && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
                nodesToSelect.push(node as SceneNode);
             }
           }
        }
        
        // 4. 执行选中
        if (nodesToSelect.length > 0) {
           figma.currentPage.selection = nodesToSelect;
        } else {
           // 如果图层被删了，清空当前选中项，视角依然过去 (补全了这里)
           figma.currentPage.selection = []; 
        }

        figma.notify("🚀 已传送！");
      } catch (e) {
        console.warn("Jumpback failed:", e);
        figma.notify("传送失败，可能是图层结构已发生巨大改变");
      }
      break;
    }

    case 'jb-delete': {
      const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
      if (!dataStr) return;
      let spots = JSON.parse(dataStr);
      
      // 过滤掉要删除的 ID
      spots = spots.filter((s: any) => s.id !== msg.id);
      
      // 更新保存
      figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
      
      // 重新渲染 UI
      figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
      figma.notify("🗑️ 锚点已删除");
      break;
    }

    case 'jb-rename': {
      const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
      if (!dataStr) return;
      let spots = JSON.parse(dataStr);
      
      const index = spots.findIndex((s: any) => s.id === msg.id);
      if (index > -1 && msg.newName.trim() !== '') {
        spots[index].name = msg.newName.substring(0, 20); // 限制长度
        figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
        figma.notify("已重命名");
      } else {
         // 如果名字为空，发回原数据恢复 UI
         figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
      }
      break;
    }

    // ==========================================
    // === 引擎：等轴形变 (Transform & Skew) ===
    // ==========================================

    case 'skew-apply': {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) return; // 拖动滑块时高频触发，没选中就静默退出

      // 1. 将角度转换为弧度
      const r = (msg.rot * Math.PI) / 180;
      const sx = (msg.angleX * Math.PI) / 180;
      const sy = (msg.angleY * Math.PI) / 180;

      // 2. 提前计算三角函数
      const cosR = Math.cos(r);
      const sinR = Math.sin(r);
      const tanX = Math.tan(sx);
      const tanY = Math.tan(sy);

      // 3. 矩阵乘法合并 (Rotate Matrix * Skew Matrix)
      // 这是一道图形学经典公式推导，确保了变形的无损和连贯性
      const m00 = cosR - sinR * tanY;
      const m01 = cosR * tanX - sinR;
      const m10 = sinR + cosR * tanY;
      const m11 = sinR * tanX + cosR;

      try {
        for (const node of selection) {
          if ('relativeTransform' in node) {
            // 获取图层当前在父级中的原点坐标 (X, Y 轴偏移量)
            // 如果不保留这个，每次变形图层都会飞到画布左上角 (0,0)
            const tx = node.relativeTransform[0][2];
            const ty = node.relativeTransform[1][2];

            // 4. 应用最终的 2x3 仿射变换矩阵
            const newTransform: Transform = [
              [m00, m01, tx], 
              [m10, m11, ty]
            ];

            node.relativeTransform = newTransform;
          }
        }
      } catch (error) {
        console.error("Transform Engine failed:", error);
      }
      break;
    }

    // ==========================================
    // === Skew 预设数据存储 (ClientStorage) ===
    // ==========================================

    // 1. UI 请求加载历史预设
    case 'req-skew-presets': {
      try {
        // 读取缓存在用户 Figma 账号下的数据
        const data = await figma.clientStorage.getAsync('MY_SKEW_PRESETS');
        // 发送回前端渲染
        figma.ui.postMessage({ type: 'init-skew-presets', data: data || [] });
      } catch (e) {
        console.warn("读取 Skew 预设失败", e);
      }
      break;
    }

    // 2. UI 请求保存新的预设
    case 'save-skew-presets': {
      try {
        // 覆盖保存到用户的 Figma 账号下
        await figma.clientStorage.setAsync('MY_SKEW_PRESETS', msg.data);
      } catch (e) {
        console.warn("保存 Skew 预设失败", e);
      }
      break;
    }

    // ==================== 语言切换 (i18n) 逻辑 ====================
    case 'i18n-check-selection': {
        const hasSelection = figma.currentPage.selection.length > 0;
        figma.ui.postMessage({ type: 'i18n-check-selection-result', hasSelection: hasSelection });
        break;
    }

    case 'i18n-detect': {
        const { scope, extractTarget, collectionName } = msg; 
        let nodesToScan = scope === 'selection' ? [...figma.currentPage.selection] : [...figma.currentPage.children];
        
        const textNodes = [];
        async function findText(nodes) {
            for (const node of nodes) {
                if (node.type === 'TEXT') textNodes.push(node);
                else if ('children' in node) await findText(node.children);
            }
        }
        await findText(nodesToScan);

        const allCollections = await figma.variables.getLocalVariableCollectionsAsync();
        // 获取所有合集的名字，并把最像 i18n 的排在前面
        const collectionNames = allCollections
            .map(c => c.name)
            .sort((a, b) => {
                const aMatch = a.toLowerCase().includes('i18n') ? -1 : 1;
                const bMatch = b.toLowerCase().includes('i18n') ? -1 : 1;
                return aMatch - bMatch;
            });
        const targetColName = collectionName || "i18n Dictionary";
        const i18nCollection = allCollections.find(c => c.name === targetColName) 
                            || allCollections.find(c => c.name.includes("i18n") || c.name.includes("Dictionary"));

        let modes = [];
        const existingVarMap = new Map();

        if (i18nCollection) {
            const origModeId = i18nCollection.modes[0].modeId;
            i18nCollection.modes.forEach(m => {
                if (m.modeId !== origModeId) modes.push(m.name);
            });
            const localVars = await figma.variables.getLocalVariablesAsync('STRING');
            for (const v of localVars) {
                if (v.variableCollectionId === i18nCollection.id) {
                    const origVal = v.valuesByMode[origModeId];
                    if (origVal) existingVarMap.set(origVal, v); 
                }
            }
        }

        let boundCount = 0;
        let mixedFonts = 0;
        const autoBindMap = new Map(); 
        const newTextMap = new Map();  

        for (const node of textNodes) {
            if (node.hasMissingFont) continue; 
            if (node.fontName === figma.mixed) { mixedFonts++; continue; }
            
            if (extractTarget === 'unbound' && node.boundVariables && node.boundVariables['characters']) {
                boundCount++;
                continue;
            }

            const text = node.characters.trim();
            if (!text) continue;

            if (existingVarMap.has(text)) {
                if (!autoBindMap.has(text)) autoBindMap.set(text, { variableId: existingVarMap.get(text).id, nodeIds: [] });
                autoBindMap.get(text).nodeIds.push(node.id);
            } else {
                if (!newTextMap.has(text)) newTextMap.set(text, { nodeIds: [] });
                newTextMap.get(text).nodeIds.push(node.id);
            }
        }

        figma.ui.postMessage({ 
            type: 'i18n-detect-result', 
            data: {
                totalNodes: textNodes.length,
                boundCount: boundCount,
                collections: collectionNames,
                autoBindList: Array.from(autoBindMap.entries()).map(([orig, d]) => ({ original: orig, ...d })),
                newTextList: Array.from(newTextMap.entries()).map(([orig, d]) => ({ original: orig, ...d })),
                modes: modes
            }
        });
        break;
    }

    case 'i18n-bind-variables': {
        const { newPayload, autoBindPayload, isCreate, collectionName } = msg;
        try {
            let collections = await figma.variables.getLocalVariableCollectionsAsync();
            let collection = collections.find(c => c.name === collectionName);
            
            // 1. 确保 Collection 存在
            if (!collection) {
                collection = figma.variables.createVariableCollection(collectionName);
                collection.renameMode(collection.modes[0].modeId, 'Original'); 
            }

            const origModeId = collection.modes[0].modeId;
            
            // 2. 收集所有需要处理的语种
            const allTargetLangs = new Set<string>();
            newPayload.forEach(item => Object.keys(item.translations).forEach(l => allTargetLangs.add(l)));

            // 3. 核心修复：创建/获取 Mode ID 映射
            const modeIdMap: { [key: string]: string } = {};
            collection.modes.forEach(m => modeIdMap[m.name] = m.modeId);

            for (const lang of Array.from(allTargetLangs)) {
                if (!modeIdMap[lang]) {
                    try {
                        // 如果是免费版，这里会报错
                        const newModeId = collection.addMode(lang);
                        modeIdMap[lang] = newModeId;
                    } catch (e) {
                        // 弹出明确的 Plan 限制提示
                        figma.ui.postMessage({ 
                            type: 'i18n-bind-error', 
                            error: `无法创建 "${lang}" 列。\n原因：Figma 免费版限制每个合集只能有 1 个 Mode（当前已有 "Original"）。\n\n建议：\n1. 升级 Figma 团队版\n2. 或使用插件的 "⚡ 直接替换" 模式。` 
                        });
                        return; // 终止执行
                    }
                }
            }

            // 4. 建立变量索引 (Original Text -> Variable)
            const localVars = await figma.variables.getLocalVariablesAsync('STRING');
            const varMap = new Map<string, Variable>(); 
            for (const v of localVars) {
                if (v.variableCollectionId === collection.id) {
                    const baseVal = v.valuesByMode[origModeId] as string;
                    if (baseVal) varMap.set(baseVal, v);
                }
            }

            // 5. 遍历翻译数据，写入变量并执行绑定
            for (const item of newPayload) {
                let variable = varMap.get(item.original);
                
                // 如果不存在则创建
                if (!variable) {
                    let safeName = item.original.slice(0, 15).replace(/[.*{}\/\\\r\n\t]/g, '_').trim() || 'text';
                    const varName = `i18n/${safeName}_${Math.random().toString(36).substring(2,6)}`;
                    variable = figma.variables.createVariable(varName, collection, 'STRING');
                    variable.setValueForMode(origModeId, item.original);
                }

                // 【核心修复】：为该变量在所有目标 Mode 中设置翻译值
                for (const [langName, translatedText] of Object.entries(item.translations)) {
                    const targetModeId = modeIdMap[langName];
                    if (targetModeId) {
                        variable.setValueForMode(targetModeId, translatedText as string);
                    }
                }

                // 执行画布节点的变量绑定
                for (const nodeId of item.nodeIds) {
                    const node = await figma.getNodeByIdAsync(nodeId);
                    if (node && node.type === 'TEXT' && node.fontName !== figma.mixed) {
                        await figma.loadFontAsync(node.fontName); 
                        node.setBoundVariable('characters', variable);
                    }
                }
            }

            figma.ui.postMessage({ type: 'i18n-bind-success', message: '🎉 多语言 Mode 已同步更新！' });
            
        } catch (e) {
            figma.ui.postMessage({ type: 'i18n-bind-error', error: e.message }); 
        }
        break;
    }

    case 'i18n-replace-text': {
        const { payload } = msg;
        let successCount = 0;
        
        try {
            for (const item of payload) {
                const targetText = Object.values(item.translations)[0]; 
                
                for (const nodeId of item.nodeIds) {
                    try {
                        const node = await figma.getNodeByIdAsync(nodeId);
                        if (node && node.type === 'TEXT' && node.fontName !== figma.mixed) {
                            await figma.loadFontAsync(node.fontName);
                            
                            // 【核心修复】：直接替换前，必须解除已有的变量绑定，否则必定被 Figma API 拦截失败！
                            node.setBoundVariable('characters', null);
                            
                            node.characters = targetText;
                            successCount++;
                        }
                    } catch (e) { 
                        console.warn(`节点替换失败`, e); 
                    }
                }
            }

            figma.ui.postMessage({ type: 'i18n-bind-success', message: `🎉 成功替换了 ${successCount} 个文本节点！` });
            
        } catch (e) {
            figma.ui.postMessage({ type: 'i18n-bind-error', error: e.message });
        }
        break;
    }

    // --- 窗口大小调整 ---
    case 'resize-start':
      // 记录开始拖拽时的状态
      break;
    case 'resize-move': {
      // 计算新尺寸并调整窗口
      const dx = msg.clientX - msg.startX;
      const dy = msg.clientY - msg.startY;
      const newW = Math.max(170, msg.startW + dx);
      const newH = Math.max(200, msg.startH + dy);
      figma.ui.resize(newW, newH);
      break;
    }
    case 'resize-end':
      // 结束拖拽
      break;
    case 'resize-drag':
    case 'resize-window':
      figma.ui.resize(msg.width, msg.height);
      break;

      
  }
};

// -------------------------------------------------------------
// 【新增】高级命名转换函数 (支持 格式+分隔符+大小写 组合)
// -------------------------------------------------------------


// --- PPT 工具辅助函数 ---

// 获取用户选中的 Frame (ID去重版)
function getSlides() {
  const selection = figma.currentPage.selection;
  const uniqueMap = new Map<string, FrameNode>();

  // 1. 只找选中的 Frame
  for (const node of selection) {
    if (node.type === 'FRAME') {
      uniqueMap.set(node.id, node);
    }
  }

  const frames = Array.from(uniqueMap.values());

  // 2. 简单的嵌套过滤 (防止选了画板又选了里面的按钮)
  // 如果一个 Frame 的父级也在选中列表里，那它就是子元素，删掉
  const finalSlides = frames.filter(node => {
     let parent = node.parent;
     while(parent && parent.type !== 'PAGE' && parent.type !== 'DOCUMENT') {
        if (uniqueMap.has(parent.id)) return false; 
        parent = parent.parent;
     }
     return true;
  });

  return finalSlides;
}

// Step 1: 初始化 (解锁、解组实例、移除隐藏)
// Step 1: 初始化 (防崩溃稳健版)
// 将 "解绑" 和 "清理" 分离，彻底解决 WASM 内存越界问题
async function pptStep1_Init(slides: FrameNode[]) {
  
  // === 阶段一：暴力解绑 (Iterative Detach) ===
  // 只要还有 Instance，就一直循环处理，直到解绑干净
  for (const slide of slides) {
    let loopCount = 0;
    
    // 初次扫描
    let instances = slide.findAll(n => n.type === 'INSTANCE');
    
    while (instances.length > 0) {
      // 安全熔断机制：防止极个别情况下的死循环
      loopCount++;
      if (loopCount > 5000) {
        console.warn("解绑层级过深，强制跳出");
        break;
      }

      // 取出列表里的第一个实例
      const target = instances[0];
      
      try {
        // 执行解绑
        // 注意：解绑后，target 这个变量就“死”了，不能再访问它的属性
        target.detachInstance();
      } catch (e) {
        console.warn("解绑单个节点失败:", e);
      }

      // === 关键点 ===
      // 解绑一个后，整个图层树结构变了，之前的 instances 数组里的引用全都失效了
      // 必须立刻重新扫描，获取最新的列表
      instances = slide.findAll(n => n.type === 'INSTANCE');
    }
  }

  // === 阶段二：常规清洗 (Cleanup) ===
  // 此时图层树里已经没有 Instance 了，结构非常稳定，可以安全递归
  const traverse = (node: SceneNode) => {
    // 防御性检查
    if (node.removed) return;

    // === 新增：黑盒保护 ===
    // 如果名字以 p_img 开头，视为用户指定的整体图标，不清洗内部，直接跳过子级遍历
    if (node.name.toLowerCase().startsWith('p_img')) {
      return; 
    }

    // 1. 解锁
    if ('locked' in node && node.locked) {
        node.locked = false;
    }
    
    // 2. 移除隐藏图层
    if ('visible' in node && !node.visible) {
      node.remove();
      return; // 删了就不用看子级了
    }
    
    // 3. 移除 AutoLayout
    if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
      node.layoutMode = 'NONE';
    }

    // 4. 递归子级
    if ('children' in node) {
      // 浅拷贝 children，避免遍历时的索引干扰
      [...(node as FrameNode).children].forEach(child => traverse(child));
    }
  };

  // 对所有 Slide 执行清洗
  slides.forEach(slide => traverse(slide));
  
  // 通知 UI 完成
  figma.ui.postMessage({ type: 'step-done', step: 1 });
}

// Step 2: 智能栅格化 (性能优化 + Hex ID)
async function pptStep2_Rasterize(slides: FrameNode[]) {
  let count = 0;
  // 生成短 ID
  const generateHexId = () => 'p_' + Math.random().toString(16).substring(2, 8);

  const isLineLike = (node: SceneNode) => {
    if (node.type === 'LINE') return true; 
    if (node.type === 'VECTOR') {
      if (node.width < 2 || node.height < 2) return true;
      const ratio = node.width / node.height;
      if (ratio > 50 || ratio < 0.02) return true;
    }
    return false;
  };

  const traverse = async (node: SceneNode) => {
    if (node.removed || !node.visible) return;
    const name = node.name.toLowerCase();
    
    const isUserTarget = name.startsWith('p_img');
    let isTechTarget = false;
    
    if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.visible)) isTechTarget = true;
    else if (node.type === 'BOOLEAN_OPERATION') isTechTarget = true;
    else if (node.type === 'VECTOR' && !isLineLike(node)) isTechTarget = true;
    else if (node.type === 'ELLIPSE' && 'fills' in node && (node.fills as Paint[]).some(p => p.type === 'IMAGE')) isTechTarget = true;

    if (isUserTarget || isTechTarget) {
      try {
        const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 3 } });
        const image = figma.createImage(bytes);
        
        const rect = figma.createRectangle();
        rect.x = node.x; rect.y = node.y;
        rect.resize(node.width, node.height);
        
        // === 使用 Hex ID 重命名 ===
        rect.name = generateHexId(); 
        
        rect.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageHash: image.hash }];
        rect.rotation = node.rotation;
        
        node.parent?.insertChild(node.parent.children.indexOf(node), rect);
        node.remove();
        count++;
        return; 
      } catch (e) {}
    }

    if ('children' in node) {
      const children = [...node.children];
      for (const child of children) await traverse(child);
    }
  };

  for (const slide of slides) await traverse(slide);
  figma.ui.postMessage({ type: 'step-done', step: 2 });
}

// Step 3: 深度扁平化 (修复混合属性导致的崩溃)
async function pptStep3_Flatten(slides: FrameNode[]) {
  
  for (const slide of slides) {
    let hasNested = true;
    let loopCount = 0; // 防止死循环保险丝

    while (hasNested) {
      hasNested = false;
      loopCount++;
      
      // 如果层级太深(超过2000次循环)，强制休息一下，防止浏览器卡死
      if (loopCount % 100 === 0) {
        await new Promise(r => setTimeout(r, 20));
      }

      const children = slide.children;
      // 倒序遍历
      // 倒序遍历
      for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i];

        // 1. === 新增：垃圾清理 (针对普通形状) ===
        // 如果不是容器(Group/Frame)，且视觉不可见，直接删除
        if (node.type !== 'GROUP' && node.type !== 'FRAME' && isNodeInvisible(node)) {
          node.remove();
          continue; 
        }

        // 情况 A: Group -> 直接解散
        if (node.type === 'GROUP') {
          figma.ungroup(node);
          hasNested = true;
        } 
        // 情况 B: Frame -> 转换为背景矩形(如需要) + 解散
        else if (node.type === 'FRAME') {
          
          try {
            // 2. === 修改：判断是否生成背景 ===
            // 使用 isNodeInvisible 判断：如果不透明且有填充/描边，才生成背景矩形
            // 如果是透明容器，则跳过此步，直接进入下面的 ungroup
            if (!isNodeInvisible(node)) {
               const rect = figma.createRectangle();
               rect.x = node.x; 
               rect.y = node.y;
               rect.resize(node.width, node.height);
               
               // 复制样式
               if (node.fills !== figma.mixed) rect.fills = node.fills;
               if (node.strokes !== figma.mixed) rect.strokes = node.strokes;
               
               // 安全复制粗细
               if (node.strokeWeight !== figma.mixed) rect.strokeWeight = node.strokeWeight;
               else rect.strokeWeight = 0; 
               
               // 安全复制圆角
               if (node.cornerRadius !== figma.mixed) rect.cornerRadius = node.cornerRadius;
               else rect.cornerRadius = 0; 
               
               // 复制特效
               if (node.effects !== figma.mixed) rect.effects = node.effects;
               
               // 复制透明度
               rect.opacity = node.opacity;

               // === 关键修复：复制旋转角度 ===
               rect.rotation = node.rotation; 

               // 将矩形插入到 Frame 所在位置
               node.parent.insertChild(i, rect); 
            }
            
            // 3. 处理子元素 (核心扁平化逻辑)
            if (node.children.length > 0) {
              figma.ungroup(node);
              hasNested = true; // 结构变了，标记需要继续循环
            } else {
              node.remove(); // 空 Frame 删掉
            }

          } catch (err) {
            console.error("Layer flatten error:", err);
            // 容错：出错了也尝试解开，防止死循环
            if (node.children.length > 0) {
                figma.ungroup(node);
                hasNested = true;
            } else {
                node.remove();
            }
          }
        }
      }
    }

    // 文本宽度修正 (保持原有逻辑)
    for (const node of slide.children) {
      if (node.type === 'TEXT' && node.visible) {
        try {
          const font = node.fontName;
          if (font !== figma.mixed) {
            await figma.loadFontAsync(font);
            node.textAutoResize = "HEIGHT";
            node.resize(node.width + 10, node.height);
          }
        } catch (e) {}
      }
    }
  }
  
  figma.ui.postMessage({ type: 'step-done', step: 3 });
}

// Step 4: 提取结构 (高性能优化版：大批次 + 零丢弃)
async function pptStep4_Extract(slides: FrameNode[]) {
  // 辅助函数定义
  const rgbToHex = (color: {r: number, g: number, b: number}) => {
    const toHex = (v: number) => {
      const hex = Math.round(v * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return toHex(color.r) + toHex(color.g) + toHex(color.b);
  };

  // 通知前端总数
  figma.ui.postMessage({ type: 'ppt-init-total', count: slides.length });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    
    // 强制休息，释放上一页内存
    await new Promise(r => setTimeout(r, 50));

    const slideAbs = slide.absoluteBoundingBox; 
    const slideX = slideAbs ? slideAbs.x : slide.x;
    const slideY = slideAbs ? slideAbs.y : slide.y;

    figma.ui.postMessage({ 
      type: 'ppt-start-slide', index: i, width: slide.width, height: slide.height 
    });

    let chunkBuffer = [];
    const children = slide.children;
    // 已移除 imgCounter，不再需要
    
    for (let j = 0; j < children.length; j++) {
      const node = children[j];
      
      // 1. 基础过滤：只过滤不可见图层，保留所有尺寸的元素
      if (!node.visible) continue;
      
      // 2. 获取位置：如果获取失败则跳过
      const nodeAbs = node.absoluteBoundingBox;
      if (!nodeAbs) continue;

      // 3. 计算相对中心点
      const centerX = (nodeAbs.x + nodeAbs.width / 2) - slideX;
      const centerY = (nodeAbs.y + nodeAbs.height / 2) - slideY;

      const el: any = { 
        cx: centerX, cy: centerY, w: node.width, h: node.height, rotation: node.rotation 
      };

      if ('opacity' in node) el.opacity = node.opacity;
      if ('cornerRadius' in node && node.cornerRadius !== figma.mixed) el.cornerRadius = node.cornerRadius;

      try {
        // --- 样式提取 ---
        if ('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0) {
          const stroke = node.strokes.find(s => s.type === 'SOLID' && s.visible !== false && s.opacity > 0);
          if (stroke) {
            el.strokeColor = rgbToHex(stroke.color);
            el.strokeWeight = node.strokeWeight;
            el.strokeAlpha = (el.opacity || 1) * stroke.opacity;
          }
        }

        if ('effects' in node && node.effects.length > 0) {
          const shadow = node.effects.find(e => e.type === 'DROP_SHADOW' && e.visible);
          if (shadow) {
            el.shadow = {
              color: rgbToHex(shadow.color),
              opacity: shadow.color.a,
              blur: shadow.radius,
              x: shadow.offset.x,
              y: shadow.offset.y
            };
          }
        }
        
        let visibleFill = null;
        if ('fills' in node && node.fills !== figma.mixed && node.fills.length > 0) {
          visibleFill = node.fills.find(f => f.type === 'SOLID' && f.visible !== false && f.opacity > 0);
        }
        if (visibleFill) {
          el.color = rgbToHex(visibleFill.color);
          el.fillAlpha = (el.opacity || 1) * visibleFill.opacity;
        } else {
          el.color = null;
          el.fillAlpha = 0;
        }

        // --- 类型分类 ---

        // A. 直线 & 连接线 (以及看起来像线的 Vector)
        const isLineLike = (node.type === 'LINE' || node.type === 'CONNECTOR');
        
        if (isLineLike) {
          el.type = 'line';
          
          if ('dashPattern' in node && node.dashPattern.length > 0) el.dashPattern = node.dashPattern;
          
          const arrowCaps = ['ARROW_LINES', 'ARROW_EQUILATERAL', 'TRIANGLE_FILLED', 'TRIANGLE_WIRED', 'DIAMOND_FILLED', 'CIRCLE_FILLED'];
          if ('lineStartCap' in node && arrowCaps.includes(node.lineStartCap)) el.headArrow = 'triangle';
          if ('lineEndCap' in node && arrowCaps.includes(node.lineEndCap)) el.tailArrow = 'triangle';
          
          // 必须要有一条可见的描边，否则跳过
          if (!el.strokeColor) continue;
          
          chunkBuffer.push(el);
        }

        // B. 文本
        else if (node.type === 'TEXT') {
          el.type = 'text';
          el.text = node.characters.substring(0, 2000); 
          
          // --- 1. 强制获取基准字号 ---
          let baseSize = 12;
          if (node.fontSize !== figma.mixed) {
              baseSize = node.fontSize;
          } else {
              const firstCharFont = node.getRangeFontSize(0, 1);
              if (firstCharFont && firstCharFont !== figma.mixed) baseSize = firstCharFont;
          }
          el.fontSize = baseSize;

          // --- 2. 强制获取基准行高 (核心修复) ---
          // 无论是否混合，都尝试获取具体的行高对象
          let lh = node.lineHeight;
          if (lh === figma.mixed) {
              // 如果混合，强制读取第一个字符的行高
              lh = node.getRangeLineHeight(0, 1);
          }
          // 如果还是读不到(极罕见)，造一个默认值
          if (!lh || lh === figma.mixed) {
              lh = { unit: 'AUTO' };
          }

          // --- 3. 计算绝对像素值 ---
          // 默认 Auto = 1.3 倍
          let finalPx = baseSize * 1.3; 

          if (lh.unit === 'PIXELS') {
              finalPx = lh.value;
          } else if (lh.unit === 'PERCENT') {
              finalPx = baseSize * (lh.value / 100);
          }
          
          // 存入变量
          el.lineHeightPx = finalPx;
          
          // 4. 其他属性
          if (node.fontName !== figma.mixed) {
             el.fontFace = node.fontName.family;
             const style = node.fontName.style.toLowerCase();
             if (/bold|heavy|black|strong/.test(style)) el.isBold = true;
          }

          // 4. 判定多行 (逻辑保持不变，但要存入 el)
          let isMultiLine = node.characters.includes('\n');
          // 如果没有换行符，但高度超过 1.5 倍字号，也视为多行（折行）
          if (!isMultiLine && node.fontSize !== figma.mixed) {
             if (node.height > node.fontSize * 1.5) isMultiLine = true;
          }
          el.isMultiLine = isMultiLine;

          // 5. 获取水平对齐 (Horizontal Align)
          if (node.textAlignHorizontal === 'CENTER') el.align = 'center';
          else if (node.textAlignHorizontal === 'RIGHT') el.align = 'right';
          else if (node.textAlignHorizontal === 'JUSTIFIED') el.align = 'justify';
          else el.align = 'left'; // 默认左对齐

          // 6. (可选) 获取垂直对齐，虽然你的需求是强制覆盖，但获取一下也没坏处
          if (node.textAlignVertical === 'CENTER') el.vAlignFigma = 'middle';
          else if (node.textAlignVertical === 'BOTTOM') el.vAlignFigma = 'bottom';
          else el.vAlignFigma = 'top';
          
          if (!visibleFill) el.fillAlpha = el.opacity || 1;
          chunkBuffer.push(el);
        }
        // C. 占位符 (图片)
        else if (node.type === 'RECTANGLE' && node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some(p => p.type === 'IMAGE' && p.visible !== false)) {
          el.type = 'placeholder';
          // 直接使用图层名 (p_xxxxxx)
          el.imageName = node.name; 
          el.fillAlpha = el.opacity || 1;
          chunkBuffer.push(el);
        }

        // D. 形状 (矩形、圆、星形、多边形) - 排除 LINE/CONNECTOR
        else if (
          node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || 
          node.type === 'VECTOR' || node.type === 'STAR' || 
          node.type === 'POLYGON' || node.type === 'BOOLEAN_OPERATION'
        ) {
          el.type = 'shape'; 
          el.pptShape = 'rect'; // 默认

          if (node.type === 'ELLIPSE') el.pptShape = 'ellipse';
          else if (node.type === 'STAR') {
              const c = node.pointCount;
              if(c>=4 && c<=32) el.pptShape = 'star'+c;
              else el.pptShape = 'star5';
          }
          else if (node.type === 'POLYGON') {
              const c = node.pointCount;
              if (c === 3) el.pptShape = 'triangle';
              else if (c === 5) el.pptShape = 'pentagon';
              else if (c === 6) el.pptShape = 'hexagon';
              else if (c === 8) el.pptShape = 'octagon';
          }
          
          if (!el.color && !el.strokeColor) continue;
          chunkBuffer.push(el);
        }

        // === 性能优化：加大批次到 200 ===
        if (chunkBuffer.length >= 200) {
          figma.ui.postMessage({ type: 'ppt-element-batch', data: chunkBuffer });
          chunkBuffer = [];
          // 强制休息 15ms，让 UI 线程有机会渲染 Loading 动画
          await new Promise(r => setTimeout(r, 15));
        }
      } catch (err) {
        // 静默失败，不打印 log
      }
    }

    if (chunkBuffer.length > 0) {
      figma.ui.postMessage({ type: 'ppt-element-batch', data: chunkBuffer });
    }
    figma.ui.postMessage({ type: 'ppt-end-slide' });
  }

  figma.ui.postMessage({ type: 'step-done', step: 4, data: { done: true } });
}

// Step 5: 导出资源 (Hex ID 版)
async function pptStep5_ExportImages(slides: FrameNode[]) {
  figma.ui.postMessage({ type: 'ppt-asset-start', totalSlides: slides.length });
  let imgCount = 0;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const children = slide.children;

    for (let j = 0; j < children.length; j++) {
       const node = children[j];
       if (!node.visible) continue;

       let isTarget = false;
       if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.visible)) isTarget = true;
       if (!isTarget && node.type === 'RECTANGLE' && node.fills !== figma.mixed && node.fills.some(p => p.type === 'IMAGE')) isTarget = true;

       if (isTarget) {
          await new Promise(r => setTimeout(r, 50));
          try {
            const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1.5 } });
            // 使用 ID 命名
            const fileName = `${node.name}.png`;

            figma.ui.postMessage({ type: 'ppt-asset-chunk', fileName: fileName, data: bytes });
            imgCount++;
          } catch (e) { console.error(e); }
       }
    }
  }
  figma.ui.postMessage({ type: 'step-done', step: 5, data: { count: imgCount } });
}

// 辅助：RGB 转 Hex
function rgbToHex(color: {r: number, g: number, b: number}) {
  const toHex = (v: number) => {
    const hex = Math.round(v * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return toHex(color.r) + toHex(color.g) + toHex(color.b);
}

// 判断节点是否“视觉不可见” (无有效填充且无有效描边，或全局隐藏/全透)
function isNodeInvisible(node: SceneNode): boolean {
  // 1. 全局检查：被隐藏 或 透明度为0
  if ('visible' in node && !node.visible) return true;
  if ('opacity' in node && node.opacity === 0) return true;

  // 2. 文本特殊处理：无内容即不可见
  if (node.type === 'TEXT' && node.characters.trim().length === 0) return true;

  // 3. 样式检查：针对有 fills/strokes 的节点
  if ('fills' in node && 'strokes' in node) {
    
    // 有效填充：存在 + 可见 + 不透明
    const hasFill = node.fills !== figma.mixed && 
                    node.fills.length > 0 && 
                    node.fills.some(p => p.visible !== false && p.opacity > 0);

    // 有效描边：存在 + 粗细>0 + 可见 + 不透明
    const hasStroke = node.strokes !== figma.mixed && 
                      node.strokes.length > 0 && 
                      node.strokeWeight > 0 && 
                      node.strokes.some(p => p.visible !== false && p.opacity > 0);

    // 如果既无有效填充，也无有效描边 -> 视为不可见 (忽略特效)
    if (!hasFill && !hasStroke) return true;
  }

  // 其他情况（如 Group/Frame/Slice）暂时视为可见，交给后续逻辑处理
  return false;
}

// 辅助：按视觉位置排序 (Z字形：先上后下，同行先左后右)
function sortNodesByVisualPosition(nodes: SceneNode[]) {
  return nodes.sort((a, b) => {
    // 获取绝对坐标 (降级处理：如果没有绝对坐标，用相对坐标兜底)
    const aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
    const bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };

    // 1. 先判断 Y 轴 (行)
    // 容差设为 50px，只要高度差在 50px 以内，视为同一行
    if (Math.abs(aAbs.y - bAbs.y) > 50) {
      return aAbs.y - bAbs.y; // 谁 y 小谁在上面
    }

    // 2. 同一行，判断 X 轴 (列)
    return aAbs.x - bAbs.x; // 谁 x 小谁在左边
  });
}