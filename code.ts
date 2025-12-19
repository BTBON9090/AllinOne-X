// @ts-nocheck
declare const __html__: string;

figma.showUI(__html__, { width: 460, height: 640, themeColors: true });

figma.ui.onmessage = async (msg) => {
  const selection = figma.currentPage.selection;
  
  // 核心路由
  switch (msg.type) {
    // === PPT 工具相关 ===
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

    case 'add-al-wrapper': {
      const newSelection = [];
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      
      for (const node of selection) {
        if (node.removed || !node.parent) continue;
        
        // 创建 Frame
        const frame = figma.createFrame();
        frame.name = "Auto Layout Wrapper";
        
        // 设置自动布局属性
        frame.layoutMode = "VERTICAL";
        frame.itemSpacing = 10;
        frame.paddingLeft = 0; frame.paddingRight = 0;
        frame.paddingTop = 0; frame.paddingBottom = 0;
        frame.primaryAxisSizingMode = "AUTO"; // Hug
        frame.counterAxisSizingMode = "AUTO"; // Hug
        
        // 设置样式：红底、无描边
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
        frame.strokes = []; 
        
        // 保持位置并包裹
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
        figma.notify(msg.successMsg || "已添加自动布局外套");
      }
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
      const sel = figma.currentPage.selection;
      if (sel.length === 0) { figma.notify("请先选中图层"); return; }
      
      const targets: InstanceNode[] = [];
      
      // 定义：后序遍历函数 (先找子孙，最后找自己)
      // 这样生成的数组顺序天然就是：[最深层组件, ..., 次深层组件, 最外层组件]
      const scan = (n: any) => {
        // 1. 先递归找子级
        if ('children' in n) {
          // 复制一份 children 避免遍历时索引问题
          const children = n.children; 
          for (const child of children) {
            scan(child);
          }
        }
        // 2. 子级找完了，再看自己是不是组件实例
        if (n.type === 'INSTANCE') {
          targets.push(n);
        }
      };

      // 开始扫描
      sel.forEach(scan);

      if (targets.length === 0) {
         figma.notify("未找到可解绑的实例"); 
         return; 
      }

      let count = 0;
      // 按顺序解绑 (因为已经是“从内到外”的顺序，所以直接执行即可)
      for (const node of targets) {
        // 再次检查节点是否还存在（防止父级解绑导致子级引用变化，虽然此算法能最大程度避免）
        if (!node.removed) {
          try {
            node.detachInstance();
            count++;
          } catch (e) {
            console.error("解绑出错:", e);
          }
        }
      }
      
      figma.notify(`已彻底解绑 ${count} 个组件`);
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
    // === 获取选中图层名称 ===
    case 'fetch-selection-name': {
      const sel = figma.currentPage.selection;
      if (sel.length > 0) {
        //以此发回给 UI，取第一个选中项的名称
        figma.ui.postMessage({ type: 'update-name-input', name: sel[0].name });
      } else {
        figma.notify("请先选择一个图层以获取名称");
      }
      break;
    }
    
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

    // ===========================
    // C. 样式工具
    // ===========================
    case 'create-styles': {
      console.log("=== 开始执行创建样式 (Async模式) ===");
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      
      let createdCount = 0;
      const conflicts: string[] = [];
      const errors: string[] = [];
      
      try {
        // === 核心修复：改为异步获取 (Async) ===
        // 因为 manifest 设置了 dynamic-page，必须等待异步结果
        const localPaints = await figma.getLocalPaintStylesAsync();
        const localTexts = await figma.getLocalTextStylesAsync();
        const localEffects = await figma.getLocalEffectStylesAsync();

        for (const node of selection) {
          if (node.removed) continue;
          const name = node.name;
          console.log(`处理图层: ${name}`);

          // --- 1. 处理颜色样式 (Fills) ---
          if ('fills' in node && node.type !== 'GROUP' && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
            if (node.fills[0].type !== 'IMAGE') {
              const exist = localPaints.find(s => s.name === name);
              if (exist) {
                if (!conflicts.includes(name)) conflicts.push(name + " (颜色)");
              } else {
                try {
                  const style = figma.createPaintStyle();
                  style.name = name;
                  style.paints = JSON.parse(JSON.stringify(node.fills)); // 克隆防报错
                  node.fillStyleId = style.id;
                  createdCount++;
                } catch (err) {
                  errors.push(name);
                  console.error("颜色创建失败:", err);
                }
              }
            }
          }

          // --- 2. 处理文本样式 (Text) ---
          if (node.type === 'TEXT') {
            const exist = localTexts.find(s => s.name === name);
            if (exist) {
              if (!conflicts.includes(name)) conflicts.push(name + " (文本)");
            } else {
              try {
                const style = figma.createTextStyle();
                style.name = name;
                const font = node.fontName;
                if (font !== figma.mixed) {
                  await figma.loadFontAsync(font);
                  style.fontName = font;
                  style.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 12;
                  if(node.letterSpacing !== figma.mixed) style.letterSpacing = node.letterSpacing;
                  if(node.lineHeight !== figma.mixed) style.lineHeight = node.lineHeight;
                  if(node.textDecoration !== figma.mixed) style.textDecoration = node.textDecoration;
                  
                  node.textStyleId = style.id;
                  createdCount++;
                }
              } catch (err) {
                 errors.push(name);
                 console.error("文本创建失败:", err);
              }
            }
          }

          // --- 3. 处理效果样式 (Effects) ---
          if ('effects' in node && node.effects !== figma.mixed && Array.isArray(node.effects) && node.effects.length > 0) {
            const exist = localEffects.find(s => s.name === name);
            if (exist) {
               if (!conflicts.includes(name)) conflicts.push(name + " (效果)");
            } else {
               try {
                 const style = figma.createEffectStyle();
                 style.name = name;
                 style.effects = JSON.parse(JSON.stringify(node.effects));
                 node.effectStyleId = style.id;
                 createdCount++;
               } catch (err) {
                 errors.push(name);
                 console.error("效果创建失败:", err);
               }
            }
          }
        }
      } catch (e) {
        console.error("全局错误:", e);
        figma.notify("发生错误，请查看控制台");
      }

      // --- 结果汇总 ---
      const parts = [];
      if (createdCount > 0) parts.push(`新建 ${createdCount} 个`);
      if (conflicts.length > 0) parts.push(`跳过重复 ${conflicts.length} 个`);
      
      if (parts.length > 0) {
        figma.notify(parts.join('，'));
      } else {
        figma.notify("未执行操作 (可能是无样式属性或已重复)");
      }
      console.log("=== 结束 ===");
      break;
    }
    case 'match-styles': {
      console.log("=== 开始匹配样式 (Async修复版) ===");
      const sel = figma.currentPage.selection;
      if (sel.length === 0) { figma.notify("请先选择范围 (支持包含子图层)"); return; }

      let countFill = 0, countStroke = 0, countText = 0, countEffect = 0;

      try {
        // 1. 获取所有本地样式 (Async)
        const paints = await figma.getLocalPaintStylesAsync();
        const texts = await figma.getLocalTextStylesAsync();
        const effects = await figma.getLocalEffectStylesAsync();

        // 2. 建立“指纹”查找表
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

        // 3. 定义异步递归遍历函数
        // 关键修复：改为 async 函数，以便内部可以使用 await
        const traverse = async (node: any) => {
          if (node.removed) return;

          // --- A. 匹配填充 (Fills) ---
          if ('fills' in node && node.fills !== figma.mixed && node.fills.length > 0 && node.fillStyleId === '') {
            const key = JSON.stringify(node.fills);
            if (paintMap.has(key)) {
              try {
                // 修复点：使用 setFillStyleIdAsync
                await node.setFillStyleIdAsync(paintMap.get(key));
                countFill++;
              } catch(e) {}
            }
          }

          // --- B. 匹配描边 (Strokes) ---
          if ('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeStyleId === '') {
            const key = JSON.stringify(node.strokes);
            if (paintMap.has(key)) {
              try {
                // 修复点：使用 setStrokeStyleIdAsync
                await node.setStrokeStyleIdAsync(paintMap.get(key));
                countStroke++;
              } catch(e) {}
            }
          }

          // --- C. 匹配效果 (Effects) ---
          if ('effects' in node && node.effects !== figma.mixed && node.effects.length > 0 && node.effectStyleId === '') {
            const key = JSON.stringify(node.effects);
            if (effectMap.has(key)) {
              try {
                // 修复点：使用 setEffectStyleIdAsync
                await node.setEffectStyleIdAsync(effectMap.get(key));
                countEffect++;
              } catch(e) {}
            }
          }

          // --- D. 匹配文本 (Text) ---
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
            if (textMap.has(key)) {
              try {
                // 修复点：使用 setTextStyleIdAsync
                await node.setTextStyleIdAsync(textMap.get(key));
                countText++;
              } catch(e) {}
            }
          }

          // --- 递归子节点 ---
          if ('children' in node) {
            // 使用 for...of 循环来保证 await 生效
            for (const child of node.children) {
              await traverse(child);
            }
          }
        };

        // 4. 执行扫描
        for (const node of sel) {
          await traverse(node);
        }

      } catch (e) {
        console.error("匹配过程出错:", e);
        figma.notify("匹配出错，请检查控制台");
        return;
      }

      // 5. 结果汇报
      const total = countFill + countStroke + countText + countEffect;
      if (total > 0) {
        figma.notify(`匹配成功: 填充${countFill} / 描边${countStroke} / 文本${countText} / 效果${countEffect}`);
      } else {
        figma.notify("未发现可匹配的样式");
      }
      break;
    }
    // === 1. 像素对齐 (Pixel Perfect) ===
    case 'pixel-perfect': {
      if (selection.length === 0) { figma.notify("请选择图层"); return; }
      let count = 0;
      for (const node of selection) {
        if(!node.removed) {
          // 四舍五入坐标和尺寸
          const newX = Math.round(node.x);
          const newY = Math.round(node.y);
          const newW = Math.round(node.width);
          const newH = Math.round(node.height);
          
          // 只有发生变化时才操作
          if(node.x !== newX || node.y !== newY) node.x = newX, node.y = newY;
          if(node.width !== newW || node.height !== newH) node.resize(newW, newH);
          count++;
        }
      }
      figma.notify(`已对齐 ${count} 个图层`);
      break;
    }

    // === 2. 位置互换 (Swap Positions) ===
    case 'swap-positions': {
      if (selection.length !== 2) { figma.notify("请严格选择 2 个图层进行交换"); return; }
      const n1 = selection[0];
      const n2 = selection[1];
      
      const x1 = n1.x, y1 = n1.y;
      const x2 = n2.x, y2 = n2.y;
      
      n1.x = x2; n1.y = y2;
      n2.x = x1; n2.y = y1;
      
      figma.notify("位置已互换");
      break;
    }

    // === 3. 文本查找与替换 (Find & Replace) ===
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

    // --- UI Resize ---
    case 'resize-drag':
    case 'resize-window':
      figma.ui.resize(msg.width, msg.height);
      break;
  }
};

// --- PPT 工具辅助函数 ---

// 获取用户选中的 Frame，如果没选则获取当前页所有的 Frame
// 获取用户选中的 Frame (智能过滤嵌套)
// 获取用户选中的 Frame (防弹版：支持 Section，自动去重，过滤嵌套)
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

// Step 2: 栅格化图标 (Vectors -> Images)
// Step 2: 智能栅格化 (黑盒机制 + 自动兜底)
// Step 2: 智能栅格化 (生成唯一 Hex ID 命名)
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

// Step 3: 深度扁平化 (Flatten) - 核心难点
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


// Step 4: 提取结构 (修复重名 Bug)
// Step 4: 提取结构 (修复填充判断逻辑：只取可见填充)
// Step 4: 提取结构 (修复透明度丢失：计算综合不透明度)
// Step 4: 提取结构 (修复旋转错位 + 支持直线 + 绝对中心定位)
// Step 4: 提取结构 (直接使用 Figma 图层名作为占位符ID)
// Step 4: 提取结构 (性能优化: Batch 200 + Hex ID + Line Fix)
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

        // A. 直线
        if (node.type === 'LINE') {
          el.type = 'line';
          if ('dashPattern' in node && node.dashPattern.length > 0 && node.dashPattern[0] > 0) {
             el.dashPattern = node.dashPattern; 
          }
          if (node.lineEndCap === 'ARROW_LINES' || node.lineEndCap === 'ARROW_EQUILATERAL') el.tailArrow = 'arrow';
          if (node.lineStartCap === 'ARROW_LINES' || node.lineStartCap === 'ARROW_EQUILATERAL') el.headArrow = 'arrow';
          
          if (!el.strokeColor) continue; // 无色直线跳过
          chunkBuffer.push(el);
        }
        // B. 文本
        else if (node.type === 'TEXT') {
          el.type = 'text';
          el.text = node.characters.substring(0, 2000); // 稍微放宽限制
          if (node.fontName !== figma.mixed) {
             el.fontFace = node.fontName.family;
             const style = node.fontName.style.toLowerCase();
             if (/bold|heavy|black|strong/.test(style)) el.isBold = true;
          }
          if (node.fontSize !== figma.mixed) el.fontSize = node.fontSize;
          if (node.lineHeight !== figma.mixed && node.lineHeight.unit === 'PIXELS' && node.fontSize !== figma.mixed) {
             el.lineSpacing = node.lineHeight.value / node.fontSize;
          }
          // 高度判定多行
          let isMultiLine = node.characters.includes('\n');
          if (!isMultiLine && node.fontSize !== figma.mixed) {
             if (node.height > node.fontSize * 1.5) isMultiLine = true;
          }
          el.valign = isMultiLine ? 'top' : 'middle';
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
        // D. 形状 (包含所有矢量)
        else if (
          node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || 
          node.type === 'VECTOR' || node.type === 'STAR' || 
          node.type === 'POLYGON' || node.type === 'BOOLEAN_OPERATION'
        ) {
          el.type = 'rect';
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

// Step 5: 专门导出图片资源 (打包下载)
// Step 5: 导出资源 (匹配 Step 4 的文件名)
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