"use strict";
// Figma 插件后端主文件
/// <reference types="@figma/plugin-typings" />
// ==================== 工具函数 ====================
// 收集文本节点
function collectTextNodes(root) {
    const nodes = [];
    function traverse(node) {
        if ('type' in node && node.type === 'TEXT') {
            nodes.push(node);
        }
        if ('children' in node) {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
    traverse(root);
    return nodes;
}
// 视觉排序节点
function sortNodesByPosition(nodes) {
    return nodes.sort((a, b) => {
        const aBox = 'absoluteBoundingBox' in a ? a.absoluteBoundingBox : null;
        const bBox = 'absoluteBoundingBox' in b ? b.absoluteBoundingBox : null;
        if (!aBox || !bBox)
            return 0;
        if (Math.abs(aBox.y - bBox.y) > 10) {
            return aBox.y - bBox.y;
        }
        return aBox.x - bBox.x;
    });
}
// 安全加载字体
async function loadFontSafe(fontName) {
    try {
        await figma.loadFontAsync(fontName);
        return true;
    }
    catch (error) {
        console.warn(`Failed to load font: ${fontName.family} ${fontName.style}`, error);
        try {
            await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
// 安全设置文本
async function setTextSafe(node, text) {
    try {
        if (node.hasMissingFont) {
            console.warn(`Node has missing font: ${node.name}`);
            return false;
        }
        const fontName = node.fontName;
        const loaded = await loadFontSafe(fontName);
        if (!loaded) {
            return false;
        }
        node.characters = text;
        return true;
    }
    catch (error) {
        console.error(`Failed to set text: ${node.name}`, error);
        return false;
    }
}
// 批量执行
async function batchExecute(items, executor, batchSize = 50, onProgress) {
    const results = [];
    const total = items.length;
    for (let i = 0; i < total; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((item, batchIndex) => executor(item, i + batchIndex)));
        results.push(...batchResults);
        if (onProgress) {
            const current = Math.min(i + batchSize, total);
            onProgress(current, total);
            figma.ui.postMessage({
                type: 'progress',
                current,
                total,
            });
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return results;
}
// 错误处理
function handleError(error, context) {
    console.error('Plugin error:', error, context);
    figma.ui.postMessage({
        type: 'error',
        message: error.message,
        context,
    });
    figma.notify(`错误: ${error.message}`, { error: true });
}
// 验证选择
function validateSelection(minCount = 1) {
    const selection = figma.currentPage.selection;
    if (selection.length < minCount) {
        figma.notify(`请至少选择 ${minCount} 个图层`);
        return false;
    }
    return true;
}
// 记录操作
function logOperation(operation, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${operation}`, details);
    figma.ui.postMessage({
        type: 'log',
        level: 'info',
        message: operation,
        details,
        timestamp,
    });
}
// ==================== 主程序 ====================
// 显示 UI
figma.showUI(__html__, {
    width: 460,
    height: 640,
    themeColors: true,
});
// 消息处理
figma.ui.onmessage = async (msg) => {
    var _a;
    try {
        if (!msg || !msg.type)
            return;
        console.log('Received message:', msg.type);
        switch (msg.type) {
            // ==================== 存储相关 ====================
            case 'save-storage': {
                await figma.clientStorage.setAsync(msg.key, msg.value);
                figma.ui.postMessage({
                    type: 'storage-saved',
                    key: msg.key,
                    value: msg.value,
                });
                if (msg.notify) {
                    figma.notify('设置已保存');
                }
                break;
            }
            case 'load-storage': {
                const value = await figma.clientStorage.getAsync(msg.key);
                figma.ui.postMessage({
                    type: 'storage-loaded',
                    key: msg.key,
                    value,
                });
                break;
            }
            // ==================== 智能填充 ====================
            case 'get-selection-count': {
                const textNodes = collectTextNodes(figma.currentPage.selection.length > 0
                    ? { children: figma.currentPage.selection }
                    : figma.currentPage);
                figma.ui.postMessage({
                    type: 'selection-count-res',
                    count: textNodes.length,
                });
                break;
            }
            case 'smart-fill-exec': {
                const { dataList, mode, distribution } = msg;
                if (!validateSelection(1))
                    break;
                const textNodes = collectTextNodes({
                    children: figma.currentPage.selection,
                });
                if (textNodes.length === 0) {
                    figma.notify('未找到文本图层');
                    break;
                }
                const sortedNodes = sortNodesByPosition(textNodes);
                let successCount = 0;
                await batchExecute(sortedNodes, async (node, index) => {
                    let textToFill = '';
                    if (distribution === 'random') {
                        textToFill = dataList[Math.floor(Math.random() * dataList.length)];
                    }
                    else {
                        textToFill = dataList[index % dataList.length];
                    }
                    let newText = '';
                    if (mode === 'prefix') {
                        newText = textToFill + node.characters;
                    }
                    else if (mode === 'suffix') {
                        newText = node.characters + textToFill;
                    }
                    else {
                        newText = textToFill;
                    }
                    const success = await setTextSafe(node, newText);
                    if (success)
                        successCount++;
                }, 50, (current, total) => {
                    figma.ui.postMessage({
                        type: 'progress',
                        current,
                        total,
                    });
                });
                figma.notify(`已填充 ${successCount} 个文本`);
                logOperation('smart-fill-exec', { count: successCount });
                break;
            }
            // ==================== 网络请求代理 ====================
            case 'do-fetch': {
                try {
                    const response = await fetch(msg.url, msg.options);
                    const data = await response.json();
                    figma.ui.postMessage({
                        type: 'api-response',
                        requestId: msg.requestId,
                        data,
                    });
                }
                catch (error) {
                    figma.ui.postMessage({
                        type: 'api-response',
                        requestId: msg.requestId,
                        error: error.message,
                    });
                }
                break;
            }
            // ==================== 窗口调整 ====================
            case 'resize': {
                const { width, height } = msg;
                figma.ui.resize(width, height);
                break;
            }
            // ==================== 通知 ====================
            case 'notify': {
                const { message, options } = msg;
                figma.notify(message, options);
                break;
            }
            // ==================== 简易工具 ====================
            case 'to-frame': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const newSelection = [];
                for (const node of selection) {
                    if (node.removed)
                        continue;
                    const frame = figma.createFrame();
                    frame.x = node.x;
                    frame.y = node.y;
                    frame.resize(node.width, node.height);
                    if ('rotation' in node)
                        frame.rotation = node.rotation;
                    frame.name = node.name;
                    if ('fills' in node && Array.isArray(node.fills))
                        frame.fills = node.fills;
                    if ('strokes' in node && Array.isArray(node.strokes)) {
                        frame.strokes = node.strokes;
                        if ('strokeWeight' in node && typeof node.strokeWeight === 'number') {
                            frame.strokeWeight = node.strokeWeight;
                        }
                    }
                    if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
                        frame.cornerRadius = node.cornerRadius;
                    }
                    if (node.parent) {
                        const idx = node.parent.children.indexOf(node);
                        node.parent.insertChild(idx, frame);
                    }
                    if ('children' in node) {
                        const children = [...node.children];
                        for (const child of children) {
                            if (!child.removed)
                                frame.appendChild(child);
                        }
                    }
                    if (!node.removed)
                        node.remove();
                    newSelection.push(frame);
                }
                figma.currentPage.selection = newSelection;
                figma.notify('已转换为 Frame');
                break;
            }
            case 'to-rect': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const newSelection = [];
                for (const node of selection) {
                    if ((node.type === 'FRAME' || node.type === 'GROUP') && !node.removed) {
                        const rect = figma.createRectangle();
                        rect.x = node.x;
                        rect.y = node.y;
                        rect.resize(node.width, node.height);
                        if ('rotation' in node)
                            rect.rotation = node.rotation;
                        rect.name = node.name;
                        if ('fills' in node && Array.isArray(node.fills))
                            rect.fills = node.fills;
                        if ('strokes' in node && Array.isArray(node.strokes)) {
                            rect.strokes = node.strokes;
                            if ('strokeWeight' in node && typeof node.strokeWeight === 'number') {
                                rect.strokeWeight = node.strokeWeight;
                            }
                        }
                        if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
                            rect.cornerRadius = node.cornerRadius;
                        }
                        if (node.parent) {
                            const idx = node.parent.children.indexOf(node);
                            node.parent.insertChild(idx, rect);
                        }
                        node.remove();
                        newSelection.push(rect);
                    }
                }
                if (newSelection.length > 0) {
                    figma.currentPage.selection = newSelection;
                    figma.notify('已转换为矩形');
                }
                break;
            }
            case 'swap-fs': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                let count = 0;
                for (const node of selection) {
                    if ('fills' in node && 'strokes' in node && Array.isArray(node.fills) && Array.isArray(node.strokes)) {
                        const temp = node.fills;
                        node.fills = node.strokes;
                        node.strokes = temp;
                        if (node.strokes.length > 0 && 'strokeWeight' in node && node.strokeWeight === 0) {
                            node.strokeWeight = 1;
                        }
                        count++;
                    }
                }
                if (count > 0)
                    figma.notify('已交换填充/描边');
                break;
            }
            case 'reset-image': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                for (const node of selection) {
                    if ('fills' in node && Array.isArray(node.fills) && 'resize' in node) {
                        const img = node.fills.find((f) => f.type === 'IMAGE');
                        if (img && img.type === 'IMAGE' && img.imageHash) {
                            const asyncImg = figma.getImageByHash(img.imageHash);
                            if (asyncImg) {
                                const size = await asyncImg.getSizeAsync();
                                if (size && size.width) {
                                    node.resize(node.width, node.width * (size.height / size.width));
                                }
                            }
                        }
                    }
                }
                figma.notify('已重置图片比例');
                break;
            }
            case 'select-text': {
                const selection = figma.currentPage.selection;
                const pool = selection.length > 0 ? selection : [figma.currentPage];
                let textNodes = [];
                for (const node of pool) {
                    if (node.type === 'TEXT')
                        textNodes.push(node);
                    if ('findAll' in node) {
                        const found = node.findAll((n) => n.type === 'TEXT');
                        textNodes = textNodes.concat(found);
                    }
                }
                if (textNodes.length > 0) {
                    figma.currentPage.selection = textNodes;
                    figma.notify(`选中 ${textNodes.length} 个文本`);
                }
                else {
                    figma.notify('未找到文本');
                }
                break;
            }
            case 'remove-al': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                let count = 0;
                function removeAutoLayout(node) {
                    if (node.layoutMode && node.layoutMode !== 'NONE') {
                        node.layoutMode = 'NONE';
                        count++;
                    }
                    if (node.children)
                        node.children.forEach(removeAutoLayout);
                }
                selection.forEach(removeAutoLayout);
                figma.notify(`移除 ${count} 个自动布局`);
                break;
            }
            case 'add-al-wrapper': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const newSelection = [];
                for (const node of selection) {
                    if (node.removed || !node.parent)
                        continue;
                    const frame = figma.createFrame();
                    frame.name = 'Auto Layout Wrapper';
                    frame.layoutMode = 'VERTICAL';
                    frame.itemSpacing = 10;
                    frame.paddingLeft = 0;
                    frame.paddingRight = 0;
                    frame.paddingTop = 0;
                    frame.paddingBottom = 0;
                    frame.primaryAxisSizingMode = 'AUTO';
                    frame.counterAxisSizingMode = 'AUTO';
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
                    figma.notify('已添加自动布局外套');
                }
                break;
            }
            case 'split-text': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const newSelection = [];
                for (const node of selection) {
                    if (node.type !== 'TEXT')
                        continue;
                    const lines = node.characters.split(/\r\n|\r|\n/);
                    if (lines.length <= 1)
                        continue;
                    let font = node.fontName;
                    if (font === figma.mixed)
                        font = node.getRangeFontName(0, 1);
                    try {
                        await figma.loadFontAsync(font);
                    }
                    catch (e) {
                        figma.notify('字体加载失败');
                        continue;
                    }
                    let cy = node.y;
                    for (const line of lines) {
                        if (!line.trim())
                            continue;
                        const textNode = node.clone();
                        textNode.characters = line;
                        textNode.textAutoResize = 'WIDTH_AND_HEIGHT';
                        textNode.y = cy;
                        (_a = node.parent) === null || _a === void 0 ? void 0 : _a.appendChild(textNode);
                        newSelection.push(textNode);
                        cy += textNode.height + 10;
                    }
                    node.remove();
                }
                if (newSelection.length > 0) {
                    figma.currentPage.selection = newSelection;
                    figma.notify('已拆分文本');
                }
                break;
            }
            case 'join-text': {
                if (!validateSelection(2))
                    break;
                const selection = figma.currentPage.selection;
                const textNodes = selection.filter((n) => n.type === 'TEXT');
                if (textNodes.length < 2) {
                    figma.notify('请选择2个以上文本');
                    break;
                }
                textNodes.sort((a, b) => {
                    const diffY = a.y - b.y;
                    const diffX = a.x - b.x;
                    return Math.abs(diffY) > 5 ? diffY : diffX;
                });
                let font = textNodes[0].fontName;
                if (font === figma.mixed)
                    font = textNodes[0].getRangeFontName(0, 1);
                try {
                    await figma.loadFontAsync(font);
                }
                catch (e) {
                    figma.notify('字体加载失败');
                    break;
                }
                const text = textNodes.map((n) => n.characters).join('\n');
                const newNode = textNodes[0].clone();
                newNode.characters = text;
                newNode.textAutoResize = 'HEIGHT';
                textNodes.forEach((n) => n.remove());
                figma.currentPage.selection = [newNode];
                figma.notify('已合并文本');
                break;
            }
            case 'up-one': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const moved = [];
                for (const node of selection) {
                    if (node.parent && node.parent.parent && node.parent !== figma.currentPage) {
                        node.parent.parent.appendChild(node);
                        moved.push(node);
                    }
                }
                if (moved.length > 0) {
                    figma.currentPage.selection = moved;
                    figma.notify('已上移一层');
                }
                break;
            }
            case 'up-all': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const moved = [];
                for (const node of selection) {
                    figma.currentPage.appendChild(node);
                    moved.push(node);
                }
                figma.currentPage.selection = moved;
                figma.notify('已移到顶层');
                break;
            }
            case 'rename-content': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                for (const node of selection) {
                    let name = '';
                    if (node.type === 'TEXT') {
                        name = node.characters;
                    }
                    else if ('findOne' in node) {
                        const textNode = node.findOne((n) => n.type === 'TEXT');
                        if (textNode)
                            name = textNode.characters;
                    }
                    if (name)
                        node.name = name.substring(0, 20);
                }
                figma.notify('已重命名');
                break;
            }
            case 'detach-all': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                const targets = [];
                function scan(node) {
                    if ('children' in node) {
                        for (const child of node.children) {
                            scan(child);
                        }
                    }
                    if (node.type === 'INSTANCE') {
                        targets.push(node);
                    }
                }
                selection.forEach(scan);
                if (targets.length === 0) {
                    figma.notify('未找到可解绑的实例');
                    break;
                }
                let count = 0;
                for (const node of targets) {
                    if (!node.removed) {
                        try {
                            node.detachInstance();
                            count++;
                        }
                        catch (e) {
                            console.error('解绑出错:', e);
                        }
                    }
                }
                figma.notify(`已解绑 ${count} 个组件`);
                break;
            }
            case 'remove-hidden': {
                const selection = figma.currentPage.selection;
                const pool = selection.length > 0 ? selection : [figma.currentPage];
                let hiddenNodes = [];
                for (const node of pool) {
                    if ('visible' in node && !node.visible)
                        hiddenNodes.push(node);
                    if ('findAll' in node) {
                        const found = node.findAll((n) => !n.visible);
                        hiddenNodes = hiddenNodes.concat(found);
                    }
                }
                let count = 0;
                hiddenNodes.reverse().forEach((n) => {
                    if (!n.removed) {
                        n.remove();
                        count++;
                    }
                });
                figma.notify(`已删除 ${count} 个隐藏图层`);
                break;
            }
            case 'sort-layers': {
                if (!validateSelection(2))
                    break;
                const selection = figma.currentPage.selection;
                if (selection.length > 1) {
                    const parent = selection[0].parent;
                    if (selection.every((n) => n.parent === parent)) {
                        const sorted = [...selection].sort((a, b) => {
                            const diffY = a.y - b.y;
                            const diffX = a.x - b.x;
                            return Math.abs(diffY) > 2 ? diffY : diffX;
                        });
                        sorted.forEach((n) => parent === null || parent === void 0 ? void 0 : parent.appendChild(n));
                        figma.notify('已排序图层');
                    }
                }
                break;
            }
            case 'ungroup-all': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                let count = 0;
                for (const node of selection) {
                    if ('findAll' in node) {
                        let groups = node.findAll((n) => n.type === 'GROUP');
                        while (groups.length > 0) {
                            groups.forEach((g) => {
                                if (!g.removed) {
                                    figma.ungroup(g);
                                    count++;
                                }
                            });
                            groups = node.findAll((n) => n.type === 'GROUP');
                        }
                    }
                }
                figma.notify(`已解散 ${count} 个组`);
                break;
            }
            case 'unlock-all': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                let count = 0;
                function unlock(node) {
                    if ('locked' in node && node.locked) {
                        node.locked = false;
                        count++;
                    }
                    if ('children' in node)
                        node.children.forEach(unlock);
                }
                selection.forEach(unlock);
                figma.notify(`已解锁 ${count} 个图层`);
                break;
            }
            case 'pixel-perfect': {
                if (!validateSelection(1))
                    break;
                const selection = figma.currentPage.selection;
                let count = 0;
                for (const node of selection) {
                    if (!node.removed && 'resize' in node) {
                        const newX = Math.round(node.x);
                        const newY = Math.round(node.y);
                        const newW = Math.round(node.width);
                        const newH = Math.round(node.height);
                        if (node.x !== newX || node.y !== newY) {
                            node.x = newX;
                            node.y = newY;
                        }
                        if (node.width !== newW || node.height !== newH) {
                            node.resize(newW, newH);
                        }
                        count++;
                    }
                }
                figma.notify(`已对齐 ${count} 个图层`);
                break;
            }
            // ==================== 时空信标 (Jumpback) ====================
            case 'jb-init': {
                const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                const spots = dataStr ? JSON.parse(dataStr) : [];
                figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                break;
            }
            case 'jb-save': {
                const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                let spots = dataStr ? JSON.parse(dataStr) : [];
                if (spots.length >= 5) {
                    figma.notify('最多只能保存 5 个锚点');
                    return;
                }
                const currentSelection = figma.currentPage.selection;
                const defaultName = currentSelection.length > 0
                    ? currentSelection[0].name.substring(0, 15)
                    : `Spot ${spots.length + 1}`;
                const newSpot = {
                    id: 'spot_' + Date.now(),
                    name: defaultName,
                    pageId: figma.currentPage.id,
                    pageName: figma.currentPage.name,
                    zoom: figma.viewport.zoom,
                    centerX: figma.viewport.center.x,
                    centerY: figma.viewport.center.y,
                    selectionIds: currentSelection.map((n) => n.id),
                };
                spots.push(newSpot);
                figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                figma.notify('📍 位置已保存');
                figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                break;
            }
            case 'jb-jump': {
                const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                if (!dataStr)
                    return;
                const spots = JSON.parse(dataStr);
                const spot = spots.find((s) => s.id === msg.id);
                if (!spot)
                    return;
                try {
                    // 跨页面跳转
                    if (figma.currentPage.id !== spot.pageId) {
                        const targetPage = await figma.getNodeByIdAsync(spot.pageId);
                        if (targetPage && targetPage.type === 'PAGE') {
                            await figma.setCurrentPageAsync(targetPage);
                        }
                        else {
                            figma.notify('⚠️ 该位置所在的页面已被删除');
                            return;
                        }
                    }
                    // 恢复视角
                    figma.viewport.center = { x: spot.centerX, y: spot.centerY };
                    figma.viewport.zoom = spot.zoom;
                    // 恢复选中
                    const nodesToSelect = [];
                    if (spot.selectionIds && Array.isArray(spot.selectionIds)) {
                        for (const id of spot.selectionIds) {
                            const node = await figma.getNodeByIdAsync(id);
                            if (node && !node.removed && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
                                nodesToSelect.push(node);
                            }
                        }
                    }
                    if (nodesToSelect.length > 0) {
                        figma.currentPage.selection = nodesToSelect;
                    }
                    else {
                        figma.currentPage.selection = [];
                    }
                    figma.notify('🚀 已传送');
                }
                catch (e) {
                    console.warn('Jumpback failed:', e);
                    figma.notify('传送失败');
                }
                break;
            }
            case 'jb-delete': {
                const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                if (!dataStr)
                    return;
                let spots = JSON.parse(dataStr);
                spots = spots.filter((s) => s.id !== msg.id);
                figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                figma.notify('🗑️ 锚点已删除');
                break;
            }
            case 'jb-rename': {
                const dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                if (!dataStr)
                    return;
                let spots = JSON.parse(dataStr);
                const index = spots.findIndex((s) => s.id === msg.id);
                if (index > -1 && msg.newName.trim() !== '') {
                    spots[index].name = msg.newName.substring(0, 20);
                    figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                    figma.notify('已重命名');
                    figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                }
                else {
                    figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                }
                break;
            }
            // ==================== 等轴形变 (Skew) ====================
            case 'skew-apply': {
                const selection = figma.currentPage.selection;
                if (selection.length === 0)
                    return;
                const r = (msg.rot * Math.PI) / 180;
                const sx = (msg.angleX * Math.PI) / 180;
                const sy = (msg.angleY * Math.PI) / 180;
                const cosR = Math.cos(r);
                const sinR = Math.sin(r);
                const tanX = Math.tan(sx);
                const tanY = Math.tan(sy);
                const m00 = cosR - sinR * tanY;
                const m01 = cosR * tanX - sinR;
                const m10 = sinR + cosR * tanY;
                const m11 = sinR * tanX + cosR;
                try {
                    for (const node of selection) {
                        if ('relativeTransform' in node) {
                            const tx = node.relativeTransform[0][2];
                            const ty = node.relativeTransform[1][2];
                            const newTransform = [
                                [m00, m01, tx],
                                [m10, m11, ty],
                            ];
                            node.relativeTransform = newTransform;
                        }
                    }
                }
                catch (error) {
                    console.error('Transform failed:', error);
                }
                break;
            }
            case 'req-skew-presets': {
                try {
                    const data = await figma.clientStorage.getAsync('MY_SKEW_PRESETS');
                    figma.ui.postMessage({ type: 'init-skew-presets', data: data || [] });
                }
                catch (e) {
                    console.warn('读取 Skew 预设失败', e);
                }
                break;
            }
            case 'save-skew-presets': {
                try {
                    await figma.clientStorage.setAsync('MY_SKEW_PRESETS', msg.data);
                }
                catch (e) {
                    console.warn('保存 Skew 预设失败', e);
                }
                break;
            }
            // ==================== 文字替换 ====================
            case 'text-find-matches': {
                const { scope, findText } = msg;
                let pool = [];
                if (scope === 'page') {
                    pool = figma.currentPage.children;
                }
                else {
                    pool = figma.currentPage.selection;
                }
                const textNodes = [];
                for (const node of pool) {
                    if (node.type === 'TEXT') {
                        textNodes.push(node);
                    }
                    if ('findAll' in node) {
                        const found = node.findAll((n) => n.type === 'TEXT');
                        textNodes.push(...found);
                    }
                }
                const matches = [];
                for (const node of textNodes) {
                    const text = node.characters;
                    let index = 0;
                    while ((index = text.indexOf(findText, index)) !== -1) {
                        matches.push({
                            id: node.id,
                            fullText: text,
                            index,
                            length: findText.length,
                            matchText: findText
                        });
                        index += findText.length;
                    }
                }
                figma.ui.postMessage({
                    type: 'text-find-results',
                    data: matches
                });
                break;
            }
            case 'text-replace-batch': {
                const { tasks, replaceText } = msg;
                let count = 0;
                const processedUids = [];
                for (const task of tasks) {
                    const node = await figma.getNodeByIdAsync(task.id);
                    if (node && node.type === 'TEXT') {
                        try {
                            const fontName = node.fontName;
                            await loadFontSafe(fontName);
                            const before = node.characters.substring(0, task.index);
                            const after = node.characters.substring(task.index + task.length);
                            node.characters = before + replaceText + after;
                            count++;
                            processedUids.push(task.uid);
                        }
                        catch (e) {
                            console.error('Replace failed:', e);
                        }
                    }
                }
                figma.ui.postMessage({
                    type: 'text-replace-success',
                    count,
                    processedUids
                });
                figma.notify(`已替换 ${count} 处`);
                break;
            }
            case 'locate-node': {
                const node = await figma.getNodeByIdAsync(msg.id);
                if (node && node.type === 'TEXT') {
                    figma.currentPage.selection = [node];
                    figma.viewport.scrollAndZoomIntoView([node]);
                }
                break;
            }
            case 'focus-layers': {
                const nodes = [];
                for (const id of msg.ids) {
                    const node = await figma.getNodeByIdAsync(id);
                    if (node && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
                        nodes.push(node);
                    }
                }
                figma.currentPage.selection = nodes;
                break;
            }
            case 'select-node': {
                const node = await figma.getNodeByIdAsync(msg.nodeId);
                if (node && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
                    figma.currentPage.selection = [node];
                    figma.viewport.scrollAndZoomIntoView([node]);
                }
                break;
            }
            // ==================== 超级选择 ====================
            case 'find-and-select': {
                const { filters } = msg;
                let pool = [];
                // 确定搜索范围
                const selection = figma.currentPage.selection;
                if (filters.scope === 'page') {
                    pool = figma.currentPage.children;
                }
                else if (filters.scope === 'descendants' && selection.length > 0) {
                    const allNodes = [];
                    selection.forEach(node => {
                        if ('findAll' in node) {
                            allNodes.push(...node.findAll(() => true));
                        }
                    });
                    pool = allNodes;
                }
                else if (filters.scope === 'inside' && selection.length > 0) {
                    const allNodes = [];
                    selection.forEach(node => {
                        if ('children' in node) {
                            node.children.forEach(child => {
                                allNodes.push(child);
                                if ('findAll' in child) {
                                    allNodes.push(...child.findAll(() => true));
                                }
                            });
                        }
                    });
                    pool = allNodes;
                }
                else if (filters.scope === 'children' && selection.length > 0) {
                    const allNodes = [];
                    selection.forEach(node => {
                        if ('children' in node) {
                            allNodes.push(...node.children);
                        }
                    });
                    pool = allNodes;
                }
                else if (filters.scope === 'sibling' && selection.length > 0) {
                    const allNodes = [];
                    selection.forEach(node => {
                        if (node.parent && 'children' in node.parent) {
                            allNodes.push(...node.parent.children.filter(n => n !== node));
                        }
                    });
                    pool = allNodes;
                }
                else {
                    pool = figma.currentPage.children;
                }
                // 过滤节点
                let results = Array.from(pool);
                // 名称过滤
                if (filters.name && filters.name.val) {
                    const nameVal = filters.name.caseSensitive
                        ? filters.name.val
                        : filters.name.val.toLowerCase();
                    results = results.filter(node => {
                        const nodeName = filters.name.caseSensitive
                            ? node.name
                            : node.name.toLowerCase();
                        return nodeName.includes(nameVal);
                    });
                }
                // 类型过滤
                if (filters.types && filters.types.vals.length > 0) {
                    const typeSet = new Set(filters.types.vals);
                    results = results.filter(node => {
                        let matchType = typeSet.has(node.type);
                        // 特殊类型判断
                        if (typeSet.has('AUTOLAYOUT') && 'layoutMode' in node) {
                            matchType = matchType || (node.layoutMode !== 'NONE');
                        }
                        if (typeSet.has('IMAGE') && 'fills' in node && Array.isArray(node.fills)) {
                            matchType = matchType || node.fills.some(f => f.type === 'IMAGE');
                        }
                        return filters.types.logic === 'include' ? matchType : !matchType;
                    });
                }
                // 状态过滤
                if (filters.states && filters.states.vals.length > 0) {
                    const stateSet = new Set(filters.states.vals);
                    results = results.filter(node => {
                        let matchState = false;
                        if (stateSet.has('hidden'))
                            matchState = matchState || !node.visible;
                        if (stateSet.has('locked'))
                            matchState = matchState || node.locked;
                        if (stateSet.has('mask') && 'isMask' in node)
                            matchState = matchState || node.isMask;
                        if (stateSet.has('export'))
                            matchState = matchState || node.exportSettings.length > 0;
                        if (stateSet.has('clip') && 'clipsContent' in node)
                            matchState = matchState || node.clipsContent;
                        if (stateSet.has('no-children') && 'children' in node) {
                            matchState = matchState || node.children.length === 0;
                        }
                        if (stateSet.has('no-fill') && 'fills' in node && Array.isArray(node.fills)) {
                            matchState = matchState || node.fills.length === 0;
                        }
                        if (stateSet.has('no-stroke') && 'strokes' in node && Array.isArray(node.strokes)) {
                            matchState = matchState || node.strokes.length === 0;
                        }
                        return filters.states.logic === 'include' ? matchState : !matchState;
                    });
                }
                // 选中结果
                figma.currentPage.selection = results;
                // 返回结果
                figma.ui.postMessage({
                    type: 'found-layers-result',
                    count: results.length,
                    layers: results.slice(0, 100).map(n => ({
                        id: n.id,
                        name: n.name,
                        type: n.type
                    }))
                });
                figma.notify(`找到 ${results.length} 个图层`);
                break;
            }
            default:
                console.warn('Unknown message type:', msg.type);
        }
    }
    catch (error) {
        handleError(error, {
            operation: msg.type,
        });
    }
};
// 插件关闭时清理
figma.on('close', () => {
    console.log('Plugin closed');
});
