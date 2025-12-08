// @ts-nocheck
declare const __html__: string;

figma.showUI(__html__, { width: 460, height: 640, themeColors: true });

figma.ui.onmessage = async (msg) => {
  const selection = figma.currentPage.selection;
  
  // 核心路由
  switch (msg.type) {

    // ===========================
    // A. 简易工具 (Simple Tools)
    // ===========================

    case 'to-frame': {
      if (selection.length === 0) { figma.notify("请选择形状"); return; }
      const newSelection = [];
      for (const node of selection) {
        if (node.removed) continue;
        const frame = figma.createFrame();
        frame.x = node.x; frame.y = node.y; frame.resize(node.width, node.height);
        frame.rotation = node.rotation; frame.name = node.name;
        if ('fills' in node) frame.fills = node.fills;
        if ('strokes' in node) { frame.strokes = node.strokes; frame.strokeWeight = node.strokeWeight; }
        if ('cornerRadius' in node && node.cornerRadius !== figma.mixed) frame.cornerRadius = node.cornerRadius;
        if ('cornerSmoothing' in node) frame.cornerSmoothing = node.cornerSmoothing;
        if (node.parent) {
          node.parent.appendChild(frame);
          const idx = node.parent.children.indexOf(node);
          if (idx > -1) frame.parent.insertChild(idx, frame);
        }
        if ('children' in node) {
          const children = [...node.children];
          for (const child of children) { if (!child.removed) frame.appendChild(child); }
        }
        if (!node.removed) node.remove();
        newSelection.push(frame);
      }
      figma.currentPage.selection = newSelection;
      figma.notify("已转换为 Frame");
      break;
    }

    case 'to-rect': {
      const newSelection = [];
      for (const node of selection) {
        if ((node.type === "FRAME" || node.type === "GROUP") && !node.removed) {
          const r = figma.createRectangle();
          r.x = node.x; r.y = node.y; r.resize(node.width, node.height);
          r.rotation = node.rotation; r.name = node.name;
          if ('fills' in node && node.fills !== figma.mixed) r.fills = node.fills;
          if ('strokes' in node) { r.strokes = node.strokes; r.strokeWeight = node.strokeWeight; }
          if ('cornerRadius' in node && node.cornerRadius !== figma.mixed) r.cornerRadius = node.cornerRadius;
          if ('cornerSmoothing' in node) r.cornerSmoothing = node.cornerSmoothing;
          if (node.parent) {
            node.parent.appendChild(r);
            const idx = node.parent.children.indexOf(node);
            if (idx > -1) node.parent.insertChild(idx, r);
          }
          node.remove();
          newSelection.push(r);
        }
      }
      if (newSelection.length > 0) figma.currentPage.selection = newSelection;
      break;
    }

    case 'swap-fs': {
      let count = 0;
      for (const node of selection) {
        if ('fills' in node && 'strokes' in node) {
          const temp = node.fills; node.fills = node.strokes; node.strokes = temp;
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
          const img = node.fills.find(f => f.type === 'IMAGE');
          if (img && img.imageHash) {
            const asyncImg = figma.getImageByHash(img.imageHash);
            const size = await asyncImg.getSizeAsync();
            if (size && size.width) node.resize(node.width, node.width * (size.height / size.width));
          }
        }
      }
      break;
    }

    case 'select-text': {
      let t = [];
      const pool = selection.length > 0 ? selection : [figma.currentPage];
      for (const n of pool) {
        if (n.type === 'TEXT') t.push(n);
        if ('findAll' in n) t = t.concat(n.findAll(x => x.type === 'TEXT'));
      }
      if (t.length > 0) {
        figma.currentPage.selection = t;
        figma.notify(`选中 ${t.length} 个文本`);
      } else {
        figma.notify("未找到文本");
      }
      break;
    }

    case 'remove-al': {
      let count = 0;
      function rm(n) {
        if (n.layoutMode && n.layoutMode !== 'NONE') { n.layoutMode = 'NONE'; count++; }
        if (n.children) n.children.forEach(rm);
      }
      selection.forEach(rm);
      figma.notify(`移除 ${count} 个自动布局`);
      break;
    }

    case 'split-text': {
      const newSel = [];
      for (const node of selection) {
        if (node.type !== "TEXT") continue;
        const lines = node.characters.split(/\r\n|\r|\n/);
        if (lines.length <= 1) continue;
        let font = node.fontName; if (font === figma.mixed) font = node.getRangeFontName(0, 1);
        try { await figma.loadFontAsync(font); } catch (e) { figma.notify("字体加载失败"); continue; }
        let cy = node.y;
        for (const l of lines) {
          if (!l.trim()) continue;
          const t = node.clone(); t.characters = l; t.textAutoResize = "WIDTH_AND_HEIGHT"; t.y = cy;
          node.parent.appendChild(t); newSel.push(t); cy += t.height + 10;
        }
        node.remove();
      }
      if (newSel.length > 0) figma.currentPage.selection = newSel;
      break;
    }

    case 'join-text': {
      const tNodes = selection.filter(n => n.type === 'TEXT').sort((a, b) => Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x);
      if (tNodes.length < 2) { figma.notify("请选2个以上文本"); return; }
      let font = tNodes[0].fontName; if (font === figma.mixed) font = tNodes[0].getRangeFontName(0, 1);
      try { await figma.loadFontAsync(font); } catch (e) { figma.notify("字体加载失败"); return; }
      const txt = tNodes.map(n => n.characters).join('\n');
      const nt = tNodes[0].clone(); nt.characters = txt; nt.textAutoResize = 'HEIGHT';
      for (let i = 1; i < tNodes.length; i++) tNodes[i].remove();
      figma.currentPage.selection = [nt];
      break;
    }

    case 'up-one': {
      const arr = [];
      selection.forEach(n => {
        if (n.parent && n.parent.parent && n.parent !== figma.currentPage) {
          n.parent.parent.appendChild(n); arr.push(n);
        }
      });
      if(arr.length>0) figma.currentPage.selection = arr;
      break;
    }

    case 'up-all': {
      const arr = [];
      selection.forEach(n => {
        figma.currentPage.appendChild(n);
        arr.push(n);
      });
      figma.currentPage.selection = arr;
      break;
    }

    case 'rename-content': {
      selection.forEach(n => {
        let name = "";
        if (n.type === 'TEXT') name = n.characters;
        else if ('findOne' in n) { const t = n.findOne(x => x.type === 'TEXT'); if (t) name = t.characters; }
        if (name) n.name = name.substring(0, 20);
      });
      figma.notify("已重命名");
      break;
    }

    case 'detach-all': {
      let insts = [];
      const pool = selection.length > 0 ? selection : figma.currentPage.selection;
      for (const n of pool) {
        if (n.type === 'INSTANCE') insts.push(n);
        if ('findAll' in n) insts = insts.concat(n.findAll(x => x.type === 'INSTANCE'));
      }
      let count = 0;
      [...new Set(insts)].reverse().forEach(n => {
        if (!n.removed) { n.detachInstance(); count++; }
      });
      figma.notify(`已解绑 ${count} 个组件`);
      break;
    }

    case 'remove-hidden': {
      let h = [];
      const pool = selection.length > 0 ? selection : [figma.currentPage];
      for (const n of pool) {
        if ('visible' in n && !n.visible) h.push(n);
        if ('findAll' in n) h = h.concat(n.findAll(x => !x.visible));
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
          [...selection].sort((a, b) => Math.abs(a.y - b.y) > 2 ? a.y - b.y : a.x - b.x).forEach(n => p.appendChild(n));
          figma.notify("图层已排序");
        }
      }
      break;
    }

    case 'ungroup-all': {
      let count = 0;
      selection.forEach(n => {
        if ('findAll' in n) {
          let gs = n.findAll(x => x.type === 'GROUP');
          while (gs.length > 0) {
            gs.forEach(x => { if (!x.removed) { figma.ungroup(x); count++; } });
            gs = n.findAll(x => x.type === 'GROUP');
          }
        }
      });
      figma.notify(`已解散 ${count} 个组`);
      break;
    }

    case 'unlock-all': {
      let count = 0;
      function ul(n) {
        if ('locked' in n && n.locked) { n.locked = false; count++; }
        if ('children' in n) n.children.forEach(ul);
      }
      selection.forEach(ul);
      figma.notify(`已解锁 ${count} 个图层`);
      break;
    }

    // ===========================
    // B. 高级查找 (Find & Select)
    // ===========================
    case 'find-and-select': {
      const f = msg.filters;
      let pool = [];

      if (f.scope === 'inside') {
        if (selection.length === 0) { figma.notify("请先选择一个容器"); return; }
        for (const node of selection) if ('findAll' in node) pool = pool.concat(node.findAll(n => true));
      } else if (f.scope === 'descendants') {
        const targets = selection.length > 0 ? selection : [figma.currentPage];
        for (const node of targets) if ('findAll' in node) pool = pool.concat(node.findAll(n => true));
      } else if (f.scope === 'sibling') {
        if (selection.length > 0) pool = selection[0].parent.children.filter(n => !selection.includes(n));
      } else if (f.scope === 'children') {
        for (const node of selection) if ('children' in node) pool = pool.concat(node.children);
      }

      const results = [];
      
      for (const node of pool) {
        let match = true;
        // Name
        if (f.name.val) {
          let n = node.name; let q = f.name.val;
          if (!f.name.caseSensitive) { n = n.toLowerCase(); q = q.toLowerCase(); }
          if (!n.includes(q)) match = false;
        }
        // Type
        if (match && f.types.vals.length > 0) {
          const t = node.type;
          const ts = f.types.vals;
          let isType = ts.includes(t);
          if (ts.includes('AUTOLAYOUT') && t === 'FRAME' && node.layoutMode !== 'NONE') isType = true;
          if (ts.includes('IMAGE') && 'fills' in node && Array.isArray(node.fills) && node.fills.some(f => f.type === 'IMAGE')) isType = true;
          
          if (f.types.logic === 'include') { if (!isType) match = false; }
          else { if (isType) match = false; }
        }
        // State
        if (match && f.states.vals.length > 0) {
          let isState = false;
          const s = f.states.vals;
          if (s.includes('hidden') && !node.visible) isState = true;
          if (s.includes('locked') && node.locked) isState = true;
          if (s.includes('no-fill') && 'fills' in node && node.fills.length === 0) isState = true;
          if (s.includes('no-stroke') && 'strokes' in node && node.strokes.length === 0) isState = true;
          if (s.includes('no-children') && 'children' in node && node.children.length === 0) isState = true;
          
          if (f.states.logic === 'include') { if (!isState) match = false; }
          else { if (isState) match = false; }
        }
        // Props
        if (match && f.props.length > 0) {
          for (const p of f.props) {
            let val = 0;
            if (p.key === 'width') val = node.width;
            else if (p.key === 'height') val = node.height;
            else if (p.key === 'x') val = node.x;
            else if (p.key === 'y') val = node.y;
            else if (p.key === 'opacity' && 'opacity' in node) val = node.opacity;
            
            const tgt = p.val;
            if (p.op === '=') { if (Math.abs(val - tgt) > 0.1) match = false; }
            else if (p.op === '>') { if (val <= tgt) match = false; }
            else if (p.op === '<') { if (val >= tgt) match = false; }
          }
        }
        if (match) results.push(node);
      }

      if (results.length > 0) {
        figma.currentPage.selection = results;
        figma.notify(`选中 ${results.length} 个`);
      } else {
        figma.notify("未找到");
      }
      break;
    }

    // --- UI Resize ---
    case 'resize-drag':
    case 'resize-window':
      figma.ui.resize(msg.width, msg.height);
      break;
  }
};