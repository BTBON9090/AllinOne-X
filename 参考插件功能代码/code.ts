// code.ts
figma.clientStorage.setAsync('my_plugin_name', 'Component Showcase');

async function runOrganizer(propX: string, propY: string, targetId: string) {
  const componentSet = (await figma.getNodeByIdAsync(targetId)) as ComponentSetNode;
  if (!componentSet) {
    figma.notify("找不到对应的 Component Set，请重新选择", { error: true });
    return figma.closePlugin();
  }

  // ====== 1. 二次编辑清理逻辑：如果已经在一个画板里，先拆除旧画板 ======
  let baseX = componentSet.x;
  let baseY = componentSet.y;
  
  if (componentSet.parent && componentSet.parent.type === 'FRAME' && componentSet.parent.getPluginData('isShowcaseBoard') === 'true') {
    const oldBoard = componentSet.parent;
    baseX = oldBoard.x;
    baseY = oldBoard.y;
    // 将组件集移回当前页面，防止被连带删除
    figma.currentPage.appendChild(componentSet);
    oldBoard.remove(); // 销毁旧的生成物
  }

  const variants = componentSet.children as ComponentNode[];
  if (variants.length === 0) return figma.closePlugin();

  // ====== 2. 解析属性，支持多维分组 ======
  const sampleName = variants[0].name; 
  const properties = sampleName.split(',').map(p => p.split('=')[0].trim());

  if (properties.length < 2) {
    figma.notify("组件属性少于2个，无法生成二维说明书", { error: true });
    return figma.closePlugin();
  }

  // 将除了用户选择的 X 和 Y 之外的属性，全部分配给分组
  const groupProps = properties.filter(p => p !== propX && p !== propY);

  const xValues = new Set<string>();
  const yValues = new Set<string>();
  const groupValues = new Set<string>();

  variants.forEach(v => {
    const props = parseVariantName(v.name);
    if (props[propX]) xValues.add(props[propX]);
    if (props[propY]) yValues.add(props[propY]);
    
    // 生成分组签名，例如 "Icon=Left, Theme=Dark"
    const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ');
    groupValues.add(gSign || 'Default');
  });

  const xArray = Array.from(xValues); 
  const yArray = Array.from(yValues); 
  const groups = Array.from(groupValues); // 所有唯一的分组

  // 异步加载所需的字体
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  let maxWidth = 0, maxHeight = 0;
  variants.forEach(v => {
    if (v.width > maxWidth) maxWidth = v.width;
    if (v.height > maxHeight) maxHeight = v.height;
  });

  const gapX = 48, gapY = 48, padding = 32; 
  const groupGap = 120; // 组与组之间的垂直大间距
  const cellWidth = maxWidth + gapX;
  const cellHeight = maxHeight + gapY;
  const singleGroupHeight = yArray.length * cellHeight; // 单个矩阵组的高度

  // ====== 3. 重新排列 Component Set 内部变体 ======
  componentSet.layoutMode = "NONE";
  variants.forEach(v => {
    const props = parseVariantName(v.name);
    const colIndex = xArray.indexOf(props[propX]);
    const rowIndex = yArray.indexOf(props[propY]);
    const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ') || 'Default';
    const groupIndex = groups.indexOf(gSign);

    if (colIndex !== -1 && rowIndex !== -1 && groupIndex !== -1) {
      // Y坐标 = 基础内边距 + 分组累计高度 + 当前行高度
      const groupOffsetY = groupIndex * (singleGroupHeight + groupGap);
      v.x = padding + colIndex * cellWidth + (cellWidth - v.width) / 2;
      v.y = padding + groupOffsetY + rowIndex * cellHeight + (cellHeight - v.height) / 2;
    }
  });

  // 扩展 Component Set 整体高度以容纳所有分组
  const compSetWidth = padding * 2 + xArray.length * cellWidth;
  const compSetHeight = padding * 2 + groups.length * singleGroupHeight + Math.max(0, groups.length - 1) * groupGap;
  componentSet.resize(compSetWidth, compSetHeight);

  // ====== 4. 创建外部画布底板 ======
  const boardFrame = figma.createFrame();
  boardFrame.name = `${componentSet.name} - 说明书`;
  boardFrame.setPluginData('isShowcaseBoard', 'true'); // 打上标记，方便二次编辑识别
  boardFrame.fills = [{ type: 'SOLID', color: { r: 249/255, g: 250/255, b: 251/255 } }];
  boardFrame.cornerRadius = 24;
  boardFrame.x = baseX; 
  boardFrame.y = baseY;

  const boardPaddingX = 140; 
  const boardPaddingY = 160; 
  boardFrame.appendChild(componentSet);
  componentSet.x = boardPaddingX;
  componentSet.y = boardPaddingY;

  // ====== 5. 绘制所有标签、网格与分组标题 ======
  // 绘制 X 轴全局列标签 (只在最顶部画一次)
  xArray.forEach((xVal, index) => {
    const label = figma.createText();
    label.characters = `${propX}: ${xVal}`.toUpperCase();
    label.fontSize = 12; label.fontName = { family: "Inter", style: "Medium" };
    label.fills = [{ type: 'SOLID', color: { r: 107/255, g: 114/255, b: 128/255 } }];
    label.x = componentSet.x + padding + index * cellWidth + cellWidth / 2 - label.width / 2;
    label.y = componentSet.y - 32; 
    boardFrame.appendChild(label);
  });

  groups.forEach((gSign, gIndex) => {
    const groupAbsoluteY = componentSet.y + padding + gIndex * (singleGroupHeight + groupGap);

    // 分组大标题
    if (groupProps.length > 0) {
      const gTitle = figma.createText();
      gTitle.characters = gSign.toUpperCase();
      gTitle.fontSize = 16; gTitle.fontName = { family: "Inter", style: "Bold" };
      gTitle.fills = [{ type: 'SOLID', color: { r: 55/255, g: 65/255, b: 81/255 } }];
      gTitle.x = componentSet.x - boardPaddingX + 64; 
      gTitle.y = groupAbsoluteY;
      boardFrame.appendChild(gTitle);
    }

    // Y 轴行标签
    yArray.forEach((yVal, rowIndex) => {
      const label = figma.createText();
      label.characters = `${propY}: ${yVal}`.toUpperCase();
      label.fontSize = 12; label.fontName = { family: "Inter", style: "Medium" };
      label.fills = [{ type: 'SOLID', color: { r: 107/255, g: 114/255, b: 128/255 } }];
      label.x = componentSet.x - label.width - 32;
      label.y = groupAbsoluteY + rowIndex * cellHeight + cellHeight / 2 - label.height / 2;
      boardFrame.appendChild(label);
    });

    // 画横向虚线
    for (let r = 1; r < yArray.length; r++) {
      const line = figma.createLine();
      line.resize(xArray.length * cellWidth, 0);
      line.x = componentSet.x + padding;
      line.y = groupAbsoluteY + r * cellHeight;
      line.dashPattern = [4, 4];
      line.strokes = [{ type: 'SOLID', color: { r: 229/255, g: 231/255, b: 235/255 } }]; 
      boardFrame.appendChild(line);
    }
    
    // 画纵向虚线 (已修复垂直起点)
    for (let c = 1; c < xArray.length; c++) {
      const line = figma.createLine();
      line.resize(singleGroupHeight, 0);
      line.rotation = -90; 
      line.x = componentSet.x + padding + c * cellWidth;
      line.y = groupAbsoluteY; 
      line.dashPattern = [4, 4];
      line.strokes = [{ type: 'SOLID', color: { r: 229/255, g: 231/255, b: 235/255 } }];
      boardFrame.appendChild(line);
    }
  });

  // ====== 6. 绘制画板大标题、徽章和说明 ======
  const title = figma.createText();
  title.characters = componentSet.name; 
  title.fontSize = 40; title.fontName = { family: "Inter", style: "Bold" };
  title.fills = [{ type: 'SOLID', color: { r: 17/255, g: 24/255, b: 39/255 } }];
  title.x = 64; title.y = 48;
  boardFrame.appendChild(title);

  // 缩小的状态徽章
  const badge = figma.createFrame();
  badge.name = "Status Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisAlignItems = "CENTER";
  badge.counterAxisAlignItems = "CENTER";
  badge.paddingLeft = 8; badge.paddingRight = 8;
  badge.paddingTop = 2; badge.paddingBottom = 2;
  badge.cornerRadius = 6;
  badge.fills = [{ type: 'SOLID', color: { r: 220/255, g: 252/255, b: 231/255 } }]; 
  
  const badgeText = figma.createText();
  badgeText.characters = "APPROVED";
  badgeText.fontSize = 10; badgeText.fontName = { family: "Inter", style: "Bold" };
  badgeText.fills = [{ type: 'SOLID', color: { r: 22/255, g: 101/255, b: 52/255 } }]; 
  
  badge.appendChild(badgeText);
  badge.x = title.x + title.width + 16;
  badge.y = title.y + (title.height - badge.height) / 2; 
  boardFrame.appendChild(badge);

  const desc = figma.createText();
  desc.characters = "此组件说明书由 Component Showcase 自动生成。请确保在设计时遵循相关规范。";
  desc.fontSize = 16; desc.fontName = { family: "Inter", style: "Regular" };
  desc.fills = [{ type: 'SOLID', color: { r: 107/255, g: 114/255, b: 128/255 } }];
  desc.x = 64; desc.y = 100;
  boardFrame.appendChild(desc);

  // ====== 7. 绘制下方属性汇总面板 (纵向布局) ======
  const specTitle = figma.createText();
  specTitle.characters = "Component Properties";
  specTitle.fontSize = 18; specTitle.fontName = { family: "Inter", style: "Bold" };
  specTitle.fills = [{ type: 'SOLID', color: { r: 17/255, g: 24/255, b: 39/255 } }];
  specTitle.x = componentSet.x; 
  specTitle.y = componentSet.y + componentSet.height + 80; 
  boardFrame.appendChild(specTitle);

  let currentPropY = specTitle.y + 40;
  properties.forEach(prop => {
    const vals = new Set<string>();
    variants.forEach(v => {
      const p = parseVariantName(v.name);
      if (p[prop]) vals.add(p[prop]);
    });

    const pName = figma.createText();
    pName.characters = prop;
    pName.fontSize = 14; pName.fontName = { family: "Inter", style: "Bold" };
    pName.fills = [{ type: 'SOLID', color: { r: 75/255, g: 85/255, b: 99/255 } }];
    pName.x = componentSet.x; pName.y = currentPropY;
    boardFrame.appendChild(pName);

    const pVals = figma.createText();
    pVals.characters = Array.from(vals).join(', ');
    pVals.fontSize = 14; pVals.fontName = { family: "Inter", style: "Regular" };
    pVals.fills = [{ type: 'SOLID', color: { r: 107/255, g: 114/255, b: 128/255 } }];
    pVals.x = componentSet.x + 120; pVals.y = currentPropY;
    boardFrame.appendChild(pVals);

    const divider = figma.createLine();
    divider.resize(600, 0); 
    divider.x = componentSet.x; divider.y = currentPropY + 28;
    divider.strokes = [{ type: 'SOLID', color: { r: 243/255, g: 244/255, b: 246/255 } }];
    boardFrame.appendChild(divider);

    currentPropY += 40;
  });

  // ====== 8. 最佳实践占位区 (Dos & Don'ts 纵向布局) ======
  const dosDontsY = currentPropY + 40;
  
  const usageTitle = figma.createText();
  usageTitle.characters = "Usage Guidelines";
  usageTitle.fontSize = 18; usageTitle.fontName = { family: "Inter", style: "Bold" };
  usageTitle.fills = [{ type: 'SOLID', color: { r: 17/255, g: 24/255, b: 39/255 } }];
  usageTitle.x = componentSet.x;
  usageTitle.y = dosDontsY;
  boardFrame.appendChild(usageTitle);

  const doCard = figma.createFrame();
  doCard.name = "Do Example";
  doCard.resize(400, 240);
  doCard.x = componentSet.x;
  doCard.y = dosDontsY + 40;
  doCard.cornerRadius = 12;
  doCard.fills = [{ type: 'SOLID', color: { r: 240/255, g: 253/255, b: 244/255 } }]; 
  doCard.strokes = [{ type: 'SOLID', color: { r: 187/255, g: 247/255, b: 208/255 } }];
  boardFrame.appendChild(doCard);

  const doText = figma.createText();
  doText.characters = "✅ Do: 在这里放置正确的组件用法示例。";
  doText.fontSize = 14; doText.fontName = { family: "Inter", style: "Medium" };
  doText.fills = [{ type: 'SOLID', color: { r: 21/255, g: 128/255, b: 61/255 } }];
  doText.x = 24; doText.y = 24;
  doCard.appendChild(doText);

  const dontCard = figma.createFrame();
  dontCard.name = "Don't Example";
  dontCard.resize(400, 240);
  dontCard.x = componentSet.x + 440; 
  dontCard.y = dosDontsY + 40;
  dontCard.cornerRadius = 12;
  dontCard.fills = [{ type: 'SOLID', color: { r: 254/255, g: 242/255, b: 242/255 } }]; 
  dontCard.strokes = [{ type: 'SOLID', color: { r: 254/255, g: 202/255, b: 202/255 } }];
  boardFrame.appendChild(dontCard);

  const dontText = figma.createText();
  dontText.characters = "❌ Don't: 在这里放置错误的组件用法示例。";
  dontText.fontSize = 14; dontText.fontName = { family: "Inter", style: "Medium" };
  dontText.fills = [{ type: 'SOLID', color: { r: 185/255, g: 28/255, b: 28/255 } }];
  dontText.x = 24; dontText.y = 24;
  dontCard.appendChild(dontText);

  // ====== 9. 重新计算整体画板宽高 (纯纵向排布) ======
  const finalBoardWidth = Math.max(componentSet.width + boardPaddingX * 2, 1100); 
  const finalBoardHeight = dontCard.y + dontCard.height + 100; 
  boardFrame.resize(finalBoardWidth, finalBoardHeight);

  figma.notify("✅ 说明书生成完毕！");
  figma.commitUndo(); 
  figma.closePlugin();
}

function parseVariantName(name: string): Record<string, string> {
  const result: Record<string, string> = {};
  name.split(',').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) result[key.trim()] = value.trim();
  });
  return result;
}

// ====== 插件入口与 UI 触发逻辑 ======
const selection = figma.currentPage.selection;
let targetNode: ComponentSetNode | null = null;

if (selection.length === 1) {
  if (selection[0].type === 'COMPONENT_SET') {
    targetNode = selection[0];
  } else if (selection[0].type === 'FRAME' && selection[0].getPluginData('isShowcaseBoard') === 'true') {
    // 允许用户选中外层画板进行重新编辑
    targetNode = selection[0].findOne(n => n.type === 'COMPONENT_SET') as ComponentSetNode | null;
  }
}

if (!targetNode || targetNode.children.length === 0) {
  figma.notify("请选中一个 Component Set 或已生成的说明书画板！", { error: true });
  figma.closePlugin();
} else {
  const sampleName = targetNode.children[0].name;
  const properties = sampleName.split(',').map(p => p.split('=')[0].trim());
  
  figma.showUI(__html__, { width: 320, height: 260, themeColors: true });
  figma.ui.postMessage({ type: 'init', properties });

  figma.ui.onmessage = msg => {
    if (msg.type === 'generate') {
      runOrganizer(msg.propX, msg.propY, targetNode!.id);
    }
  };
}