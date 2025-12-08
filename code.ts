// 初始化
figma.showUI(__html__, { width: 460, height: 540, themeColors: true });

figma.ui.onmessage = async (msg) => {
  const selection = figma.currentPage.selection;
  const successMsg = msg.successMsg || "Done"; // 获取UI传来的语言包文字

  // 1. Join Text
  if (msg.type === 'join-text') {
    if (selection.length < 2) { figma.notify("Select at least 2 text layers"); return; }
    const textNodes = selection.filter(n => n.type === "TEXT") as TextNode[];
    if (textNodes.length < 2) { figma.notify("No text layers selected"); return; }
    textNodes.sort((a, b) => (Math.abs(a.y - b.y) > 5) ? a.y - b.y : a.x - b.x);
    let font = textNodes[0].fontName;
    if (font === figma.mixed) font = textNodes[0].getRangeFontName(0, 1) as FontName;
    try { await figma.loadFontAsync(font as FontName); } catch(e) { figma.notify("Load font failed"); return; }
    const combinedText = textNodes.map(n => n.characters).join('\n');
    const newText = textNodes[0].clone();
    newText.characters = combinedText;
    newText.textAutoResize = "HEIGHT";
    for (let i = 1; i < textNodes.length; i++) textNodes[i].remove();
    figma.currentPage.selection = [newText];
    figma.notify(successMsg);
  }

  // 2. Sort Layers
  if (msg.type === 'sort-layers') {
    if (selection.length < 2) return;
    const parent = selection[0].parent;
    if (!parent || !selection.every(n => n.parent === parent)) { figma.notify("Selection must share same parent"); return; }
    const sorted = [...selection].sort((a, b) => (Math.abs(a.y - b.y) > 2) ? a.y - b.y : a.x - b.x);
    for (const node of sorted) parent.appendChild(node);
    figma.notify(successMsg);
  }

  // 3. Rename Content
  if (msg.type === 'rename-content') {
    for (const node of selection) {
      let newName = "";
      if (node.type === "TEXT") {
        newName = (node as TextNode).characters;
      } else if ('findOne' in node) {
        const t = node.findOne(n => n.type === "TEXT") as TextNode | null;
        if (t) newName = t.characters;
      }
      if (newName) {
        if (newName.length > 20) newName = newName.substring(0, 20) + "...";
        node.name = newName;
      }
    }
    figma.notify(successMsg);
  }

  // 4. Split Text
  if (msg.type === 'split-text') {
    if (selection.length === 0) return;
    const newSelection: SceneNode[] = [];
    for (const node of selection) {
        if (node.type !== "TEXT") continue;
        const textNode = node as TextNode;
        const lines = textNode.characters.split(/\r\n|\r|\n/);
        if (lines.length <= 1) continue;
        let font = textNode.fontName;
        if(font === figma.mixed) font = textNode.getRangeFontName(0, 1) as FontName;
        try { await figma.loadFontAsync(font as FontName); } catch(e) { continue; }
        let curY = textNode.y;
        if (!textNode.parent) continue;
        for (const line of lines) {
            if(!line.trim()) continue;
            const t = textNode.clone();
            t.characters = line;
            t.textAutoResize = "WIDTH_AND_HEIGHT";
            t.y = curY;
            textNode.parent.appendChild(t);
            newSelection.push(t);
            curY += t.height + 10;
        }
        textNode.remove();
    }
    if(newSelection.length>0) {
        figma.currentPage.selection = newSelection;
        figma.notify(successMsg);
    }
  }

  // 5. To Frame
  if (msg.type === 'to-frame') {
     const newSelection: SceneNode[] = [];
     if (selection.length === 0) return;
     for (const node of selection) {
         const frame = figma.createFrame();
         frame.x = node.x;
         frame.y = node.y;
         frame.resize(node.width, node.height);
         if ('rotation' in node) frame.rotation = node.rotation;
         frame.name = node.name;
         if('fills' in node) frame.fills = node.fills;
         if('effects' in node) frame.effects = node.effects;
         if('opacity' in node) frame.opacity = node.opacity;
         if('blendMode' in node) frame.blendMode = node.blendMode;
         if('strokes' in node) {
             frame.strokes = node.strokes;
             frame.strokeWeight = node.strokeWeight;
             frame.strokeAlign = node.strokeAlign;
         }
         if('cornerRadius' in node && node.cornerRadius !== figma.mixed && node.cornerRadius !== undefined) {
             frame.cornerRadius = node.cornerRadius;
         }
         if('cornerSmoothing' in node) frame.cornerSmoothing = node.cornerSmoothing;
         if(node.parent) {
             node.parent.appendChild(frame);
             if (frame.parent) {
                 frame.parent.insertChild(frame.parent.children.indexOf(node), frame);
             }
         }
         if('children' in node) {
             for(const c of node.children) frame.appendChild(c);
         }
         node.remove();
         newSelection.push(frame);
     }
     figma.currentPage.selection = newSelection;
     figma.notify(successMsg);
  }

  // 6. To Rect
  if (msg.type === 'to-rect') {
      const newSelection: SceneNode[] = [];
      for(const node of selection) {
          if(node.type === "FRAME" || node.type === "GROUP") {
              const r = figma.createRectangle();
              r.x = node.x;
              r.y = node.y;
              r.resize(node.width, node.height);
              if ('rotation' in node) r.rotation = node.rotation;
              r.name = node.name;
              r.opacity = node.opacity;
              r.blendMode = node.blendMode;
              if('fills' in node && node.fills !== figma.mixed) r.fills = node.fills;
              if('effects' in node) r.effects = node.effects;
              if('strokes' in node) {
                  r.strokes = node.strokes;
                  r.strokeWeight = node.strokeWeight;
                  r.strokeAlign = node.strokeAlign;
              }
              if('cornerRadius' in node && node.cornerRadius !== figma.mixed) r.cornerRadius = node.cornerRadius;
              if('cornerSmoothing' in node) r.cornerSmoothing = node.cornerSmoothing;
              if (node.parent) {
                  node.parent.appendChild(r);
                  if (node.parent) {
                      node.parent.insertChild(node.parent.children.indexOf(node), r);
                  }
              }
              node.remove();
              newSelection.push(r);
          }
      }
      if(newSelection.length>0) {
          figma.currentPage.selection = newSelection;
          figma.notify(successMsg);
      }
  }

  // 7. Remove AL
  if (msg.type === 'remove-al') {
      const rm = (n: SceneNode) => {
          if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') {
              n.layoutMode = 'NONE';
          }
          if ('children' in n && n.children) {
              n.children.forEach(rm);
          }
      };
      selection.forEach(rm);
      figma.notify(successMsg);
  }

  // 8. Hierarchy / Cleanup
  if (msg.type === 'up-one') {
      const arr: SceneNode[] = [];
      selection.forEach(n => {
          if(n.parent && n.parent.parent) {
              n.parent.parent.appendChild(n);
              arr.push(n);
          }
      });
      figma.currentPage.selection = arr;
      if(arr.length>0) figma.notify(successMsg);
  }
  if (msg.type === 'up-all') {
      const arr: SceneNode[] = [];
      selection.forEach(n => {
          figma.currentPage.appendChild(n);
          arr.push(n);
      });
      figma.currentPage.selection = arr;
      figma.notify(successMsg);
  }
  if (msg.type === 'ungroup-all') {
      for(const n of selection) {
          if('findAll' in n) {
              let gs = n.findAll((x: SceneNode) => x.type === 'GROUP');
              while(gs.length>0) {
                  gs.forEach((g: SceneNode) => {
                      if (g.type === 'GROUP' && !('removed' in g && g.removed)) {
                          figma.ungroup(g as GroupNode);
                      }
                  });
                  gs = n.findAll((x: SceneNode) => x.type === 'GROUP');
              }
          }
      }
      figma.notify(successMsg);
  }
  if (msg.type === 'unlock-all') {
      const ul = (n: SceneNode) => {
          if(n.locked) n.locked = false;
          if ('children' in n && n.children) {
              n.children.forEach(ul);
          }
      };
      selection.forEach(ul);
      figma.notify(successMsg);
  }

  // Resize
  if (msg.type.startsWith('resize')) figma.ui.resize(msg.width, msg.height);
};