var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
// -------------------------------------------------------------
// 【更新】高级命名转换函数 (支持清除隐藏标记)
// -------------------------------------------------------------
var convertNameAdvanced = function (str, format, sepMode, casing, keepEmoji, removeId, unmarkHidden) {
    var s = str;
    // 1. 移除 ID
    if (removeId)
        s = s.replace(/#\d+:\d+$/, '').trim();
    // 2. 处理隐藏标记 (. 或 _)
    // 逻辑：先提取出来，如果不清除，最后再加回去
    var hiddenPrefix = "";
    var hiddenMatch = s.match(/^[\._]/);
    if (hiddenMatch) {
        hiddenPrefix = hiddenMatch[0];
        // 暂时去掉以便后续分词处理
        s = s.substring(1);
    }
    // 3. 处理 Emoji
    var emojiPrefix = "";
    if (keepEmoji) {
        var match = s.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u2000-\u3300]|[\uF000-\uF0FF])+\s*/u);
        if (match) {
            emojiPrefix = match[0].trim();
            s = s.replace(match[0], '');
        }
    }
    s = s.trim();
    // 4. 分词与重组
    var words = s.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+|[\u4e00-\u9fa5]+/g);
    var newVal = s;
    if (words && words.length > 0) {
        var processedWords = words;
        if (format === 'camelCase') {
            processedWords = words.map(function (w, i) { return i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });
            newVal = processedWords.join('');
        }
        else if (format === 'PascalCase') {
            processedWords = words.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });
            newVal = processedWords.join('');
        }
        else {
            if (casing === 'upper')
                processedWords = words.map(function (w) { return w.toUpperCase(); });
            else if (casing === 'lower')
                processedWords = words.map(function (w) { return w.toLowerCase(); });
            var separatorChar = ' ';
            if (sepMode === 'snake')
                separatorChar = '_';
            if (sepMode === 'kebab')
                separatorChar = '-';
            newVal = processedWords.join(separatorChar);
        }
    }
    // 5. 加回 Emoji
    if (keepEmoji && emojiPrefix) {
        var joiner = (format === 'separator' && sepMode !== 'space') ? (sepMode === 'snake' ? '_' : '-') : ' ';
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
var highlightCache = {};
var layerSortDirection = 'asc'; // 用于图层排序切换
figma.ui.onmessage = function (msg) { return __awaiter(_this, void 0, void 0, function () {
    function rm(n) {
        if (n.layoutMode && n.layoutMode !== 'NONE') {
            n.layoutMode = 'NONE';
            count_1++;
        }
        if (n.children)
            n.children.forEach(rm);
    }
    function ul(n) {
        if ('locked' in n && n.locked) {
            n.locked = false;
            count_2++;
        }
        if ('children' in n)
            n.children.forEach(ul);
    }
    var res, json, e_1, selection, _a, textNodes_2, traverse_1, scope, dataList, mode, distribution, textNodes_3, traverse_2, changeCount, i, node, textToFill, e_2, value, newSelection, _i, selection_1, node, frame, idx, children, _b, children_1, child, newSelection, _c, selection_2, node, r, idx, count, _d, selection_3, node, temp, _e, selection_4, node, img, asyncImg, size, t, pool, _f, pool_1, n, count_1, newSelection, _g, selection_5, node, frame, parent_1, index, newSel, _h, selection_6, node, lines, font, e_3, cy, _j, lines_1, l, t, tNodes, font, e_4, txt, nt, arr_1, arr_2, sel, targets_3, scan_1, count, _k, targets_1, node, h, pool, _l, pool_2, n, count_3, p_1, isReverse_1, count_4, count_2, count, _m, selection_7, node, newX, newY, newW, newH, sel, f, sel_5, searchTargets, _o, sel_1, node, children, _p, sel_2, node, siblings, _q, sel_3, node, children, allPageNodes, uniqueMap_1, finalPool, results, _r, finalPool_1, node, match, n, q, t, ts, isType, isState, s, _s, _t, p, val, v, tgt, runFocus, createdCount, conflicts, errors, localPaints, localTexts, localEffects, _loop_1, _u, selection_8, node, e_5, parts, sel, countFill_1, countStroke_1, countText_1, countEffect_1, paints, texts, effects, paintMap_1, effectMap_1, textMap_1, traverse_3, _v, sel_4, node, e_6, total, n1, n2, x1, y1, x2, y2, findText, replaceText, scope, count, textNodes_4, collect_1, _w, textNodes_1, node, font, e_7, pageName, slides, slides, slides, slides, slides, cfg_1, targets_4, targetTypes_1, scopeNodes, collectTargets_1, findRegex_1, escape_1, pat, results_1, checkString_1, _loop_2, _x, targets_2, node, items, count, _y, items_1, item, node, err_1, scope, findText_1, results_2, searchPool, traverse_4, node, cacheKey, font, cachedData, currentFills, highlightPaint, e_8, tasks, replaceText, successCount, processedIds, groups_1, _z, _0, _1, _2, nodeId, node, groupTasks, _3, groupTasks_1, task, currentStr, err_2, count, _4, _5, _6, _7, key, _8, nodeId, indexStr, index, data, node, font, e_9, ids, findText, replaceText, count, _9, ids_1, id, node, regex, err_3;
    var _this = this;
    return __generator(this, function (_10) {
        switch (_10.label) {
            case 0:
                if (!(msg.type === 'do-fetch')) return [3 /*break*/, 6];
                _10.label = 1;
            case 1:
                _10.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(msg.url, msg.options)];
            case 2:
                res = _10.sent();
                return [4 /*yield*/, res.json()];
            case 3:
                json = _10.sent();
                figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, data: json });
                return [3 /*break*/, 5];
            case 4:
                e_1 = _10.sent();
                figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, error: e_1.message || String(e_1) });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
            case 6:
                console.log("【2】后端：收到了消息 ->", msg.type);
                selection = figma.currentPage.selection;
                _a = msg.type;
                switch (_a) {
                    case 'get-selection-count': return [3 /*break*/, 7];
                    case 'smart-fill-exec': return [3 /*break*/, 8];
                    case 'save-storage': return [3 /*break*/, 15];
                    case 'load-storage': return [3 /*break*/, 17];
                    case 'to-frame': return [3 /*break*/, 19];
                    case 'to-rect': return [3 /*break*/, 20];
                    case 'swap-fs': return [3 /*break*/, 21];
                    case 'reset-image': return [3 /*break*/, 22];
                    case 'select-text': return [3 /*break*/, 27];
                    case 'remove-al': return [3 /*break*/, 28];
                    case 'add-al-wrapper': return [3 /*break*/, 29];
                    case 'split-text': return [3 /*break*/, 30];
                    case 'join-text': return [3 /*break*/, 38];
                    case 'up-one': return [3 /*break*/, 43];
                    case 'up-all': return [3 /*break*/, 44];
                    case 'rename-content': return [3 /*break*/, 45];
                    case 'detach-all': return [3 /*break*/, 46];
                    case 'remove-hidden': return [3 /*break*/, 47];
                    case 'sort-layers': return [3 /*break*/, 48];
                    case 'ungroup-all': return [3 /*break*/, 49];
                    case 'unlock-all': return [3 /*break*/, 50];
                    case 'pixel-perfect': return [3 /*break*/, 51];
                    case 'fetch-selection-name': return [3 /*break*/, 52];
                    case 'find-and-select': return [3 /*break*/, 53];
                    case 'focus-layers': return [3 /*break*/, 54];
                    case 'create-styles': return [3 /*break*/, 55];
                    case 'match-styles': return [3 /*break*/, 66];
                    case 'swap-positions': return [3 /*break*/, 77];
                    case 'find-replace': return [3 /*break*/, 78];
                    case 'ppt-step-1': return [3 /*break*/, 88];
                    case 'ppt-step-2': return [3 /*break*/, 90];
                    case 'ppt-step-3': return [3 /*break*/, 92];
                    case 'ppt-step-4': return [3 /*break*/, 94];
                    case 'ppt-step-5': return [3 /*break*/, 96];
                    case 'lint-variants': return [3 /*break*/, 98];
                    case 'fix-variants': return [3 /*break*/, 99];
                    case 'text-find-matches': return [3 /*break*/, 106];
                    case 'locate-node': return [3 /*break*/, 107];
                    case 'text-replace-batch': return [3 /*break*/, 115];
                    case 'clear-all-highlights': return [3 /*break*/, 123];
                    case 'text-replace-batch': return [3 /*break*/, 132];
                    case 'resize-drag': return [3 /*break*/, 140];
                    case 'resize-window': return [3 /*break*/, 140];
                }
                return [3 /*break*/, 141];
            case 7:
                {
                    textNodes_2 = [];
                    traverse_1 = function (n) {
                        if (n.type === 'TEXT' && !n.removed && n.visible)
                            textNodes_2.push(n);
                        if ('children' in n)
                            n.children.forEach(traverse_1);
                    };
                    scope = figma.currentPage.selection.length > 0 ? figma.currentPage.selection : [figma.currentPage];
                    scope.forEach(traverse_1);
                    figma.ui.postMessage({ type: 'selection-count-res', count: textNodes_2.length });
                    return [3 /*break*/, 141];
                }
                _10.label = 8;
            case 8:
                dataList = msg.dataList, mode = msg.mode, distribution = msg.distribution;
                textNodes_3 = [];
                traverse_2 = function (n) {
                    if (n.type === 'TEXT' && !n.removed && n.visible)
                        textNodes_3.push(n);
                    if ('children' in n)
                        n.children.forEach(traverse_2);
                };
                // 优先处理选中项，没选中则不处理（防止误操作全页）
                if (figma.currentPage.selection.length > 0) {
                    figma.currentPage.selection.forEach(traverse_2);
                }
                else {
                    figma.notify("请先选择包含文本的图层");
                    return [2 /*return*/];
                }
                if (textNodes_3.length === 0) {
                    figma.notify("未找到文本图层");
                    return [2 /*return*/];
                }
                // 视觉排序 (从左到右，从上到下)
                textNodes_3.sort(function (a, b) {
                    var aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
                    var bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
                    if (Math.abs(aAbs.y - bAbs.y) > 10)
                        return aAbs.y - bAbs.y;
                    return aAbs.x - bAbs.x;
                });
                changeCount = 0;
                i = 0;
                _10.label = 9;
            case 9:
                if (!(i < textNodes_3.length)) return [3 /*break*/, 14];
                node = textNodes_3[i];
                _10.label = 10;
            case 10:
                _10.trys.push([10, 12, , 13]);
                // 加载字体
                return [4 /*yield*/, figma.loadFontAsync(node.fontName)];
            case 11:
                // 加载字体
                _10.sent(); // 简单处理，假设非混合字体
                textToFill = "";
                if (distribution === 'random') {
                    textToFill = dataList[Math.floor(Math.random() * dataList.length)];
                }
                else {
                    // 顺序循环
                    textToFill = dataList[i % dataList.length];
                }
                // 根据模式应用
                if (mode === 'prefix') {
                    node.characters = textToFill + node.characters;
                }
                else if (mode === 'suffix') {
                    node.characters = node.characters + textToFill;
                }
                else {
                    // replace
                    node.characters = textToFill;
                }
                changeCount++;
                return [3 /*break*/, 13];
            case 12:
                e_2 = _10.sent();
                console.error("Fill error", e_2);
                return [3 /*break*/, 13];
            case 13:
                i++;
                return [3 /*break*/, 9];
            case 14:
                figma.notify("\u5DF2\u586B\u5145 ".concat(changeCount, " \u4E2A\u6587\u672C"));
                return [3 /*break*/, 141];
            case 15: return [4 /*yield*/, figma.clientStorage.setAsync(msg.key, msg.value)];
            case 16:
                _10.sent();
                if (msg.notify)
                    figma.notify("配置已保存");
                // 回传以确认更新
                figma.ui.postMessage({ type: 'storage-saved', key: msg.key, value: msg.value });
                return [3 /*break*/, 141];
            case 17: return [4 /*yield*/, figma.clientStorage.getAsync(msg.key)];
            case 18:
                value = _10.sent();
                figma.ui.postMessage({ type: 'storage-loaded', key: msg.key, value: value });
                return [3 /*break*/, 141];
            case 19:
                {
                    if (selection.length === 0) {
                        figma.notify("请选择形状");
                        return [2 /*return*/];
                    }
                    newSelection = [];
                    for (_i = 0, selection_1 = selection; _i < selection_1.length; _i++) {
                        node = selection_1[_i];
                        if (node.removed)
                            continue;
                        frame = figma.createFrame();
                        frame.x = node.x;
                        frame.y = node.y;
                        frame.resize(node.width, node.height);
                        frame.rotation = node.rotation;
                        frame.name = node.name;
                        if ('fills' in node)
                            frame.fills = node.fills;
                        if ('strokes' in node) {
                            frame.strokes = node.strokes;
                            frame.strokeWeight = node.strokeWeight;
                        }
                        if ('cornerRadius' in node && node.cornerRadius !== figma.mixed)
                            frame.cornerRadius = node.cornerRadius;
                        if ('cornerSmoothing' in node)
                            frame.cornerSmoothing = node.cornerSmoothing;
                        if (node.parent) {
                            node.parent.appendChild(frame);
                            idx = node.parent.children.indexOf(node);
                            if (idx > -1)
                                frame.parent.insertChild(idx, frame);
                        }
                        if ('children' in node) {
                            children = __spreadArray([], node.children, true);
                            for (_b = 0, children_1 = children; _b < children_1.length; _b++) {
                                child = children_1[_b];
                                if (!child.removed)
                                    frame.appendChild(child);
                            }
                        }
                        if (!node.removed)
                            node.remove();
                        newSelection.push(frame);
                    }
                    figma.currentPage.selection = newSelection;
                    figma.notify("已转换为 Frame");
                    return [3 /*break*/, 141];
                }
                _10.label = 20;
            case 20:
                {
                    newSelection = [];
                    for (_c = 0, selection_2 = selection; _c < selection_2.length; _c++) {
                        node = selection_2[_c];
                        if ((node.type === "FRAME" || node.type === "GROUP") && !node.removed) {
                            r = figma.createRectangle();
                            r.x = node.x;
                            r.y = node.y;
                            r.resize(node.width, node.height);
                            r.rotation = node.rotation;
                            r.name = node.name;
                            if ('fills' in node && node.fills !== figma.mixed)
                                r.fills = node.fills;
                            if ('strokes' in node) {
                                r.strokes = node.strokes;
                                r.strokeWeight = node.strokeWeight;
                            }
                            if ('cornerRadius' in node && node.cornerRadius !== figma.mixed)
                                r.cornerRadius = node.cornerRadius;
                            if ('cornerSmoothing' in node)
                                r.cornerSmoothing = node.cornerSmoothing;
                            if (node.parent) {
                                node.parent.appendChild(r);
                                idx = node.parent.children.indexOf(node);
                                if (idx > -1)
                                    node.parent.insertChild(idx, r);
                            }
                            node.remove();
                            newSelection.push(r);
                        }
                    }
                    if (newSelection.length > 0)
                        figma.currentPage.selection = newSelection;
                    return [3 /*break*/, 141];
                }
                _10.label = 21;
            case 21:
                {
                    count = 0;
                    for (_d = 0, selection_3 = selection; _d < selection_3.length; _d++) {
                        node = selection_3[_d];
                        if ('fills' in node && 'strokes' in node) {
                            temp = node.fills;
                            node.fills = node.strokes;
                            node.strokes = temp;
                            if (node.strokes.length > 0 && node.strokeWeight === 0)
                                node.strokeWeight = 1;
                            count++;
                        }
                    }
                    if (count > 0)
                        figma.notify("已交换填充/描边");
                    return [3 /*break*/, 141];
                }
                _10.label = 22;
            case 22:
                _e = 0, selection_4 = selection;
                _10.label = 23;
            case 23:
                if (!(_e < selection_4.length)) return [3 /*break*/, 26];
                node = selection_4[_e];
                if (!('fills' in node && Array.isArray(node.fills))) return [3 /*break*/, 25];
                img = node.fills.find(function (f) { return f.type === 'IMAGE'; });
                if (!(img && img.imageHash)) return [3 /*break*/, 25];
                asyncImg = figma.getImageByHash(img.imageHash);
                return [4 /*yield*/, asyncImg.getSizeAsync()];
            case 24:
                size = _10.sent();
                if (size && size.width)
                    node.resize(node.width, node.width * (size.height / size.width));
                _10.label = 25;
            case 25:
                _e++;
                return [3 /*break*/, 23];
            case 26: return [3 /*break*/, 141];
            case 27:
                {
                    t = [];
                    pool = selection.length > 0 ? selection : [figma.currentPage];
                    for (_f = 0, pool_1 = pool; _f < pool_1.length; _f++) {
                        n = pool_1[_f];
                        if (n.type === 'TEXT')
                            t.push(n);
                        if ('findAll' in n)
                            t = t.concat(n.findAll(function (x) { return x.type === 'TEXT'; }));
                    }
                    if (t.length > 0) {
                        figma.currentPage.selection = t;
                        figma.notify("\u9009\u4E2D ".concat(t.length, " \u4E2A\u6587\u672C"));
                    }
                    else {
                        figma.notify("未找到文本");
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 28;
            case 28:
                {
                    count_1 = 0;
                    selection.forEach(rm);
                    figma.notify("\u79FB\u9664 ".concat(count_1, " \u4E2A\u81EA\u52A8\u5E03\u5C40"));
                    return [3 /*break*/, 141];
                }
                _10.label = 29;
            case 29:
                {
                    newSelection = [];
                    if (selection.length === 0) {
                        figma.notify("请选择图层");
                        return [2 /*return*/];
                    }
                    for (_g = 0, selection_5 = selection; _g < selection_5.length; _g++) {
                        node = selection_5[_g];
                        if (node.removed || !node.parent)
                            continue;
                        frame = figma.createFrame();
                        frame.name = "Auto Layout Wrapper";
                        // 设置自动布局属性
                        frame.layoutMode = "VERTICAL";
                        frame.itemSpacing = 10;
                        frame.paddingLeft = 0;
                        frame.paddingRight = 0;
                        frame.paddingTop = 0;
                        frame.paddingBottom = 0;
                        frame.primaryAxisSizingMode = "AUTO"; // Hug
                        frame.counterAxisSizingMode = "AUTO"; // Hug
                        // 设置样式：红底、无描边
                        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
                        frame.strokes = [];
                        // 保持位置并包裹
                        frame.x = node.x;
                        frame.y = node.y;
                        parent_1 = node.parent;
                        index = parent_1.children.indexOf(node);
                        parent_1.insertChild(index, frame);
                        frame.appendChild(node);
                        newSelection.push(frame);
                    }
                    if (newSelection.length > 0) {
                        figma.currentPage.selection = newSelection;
                        figma.notify(msg.successMsg || "已添加自动布局外套");
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 30;
            case 30:
                newSel = [];
                _h = 0, selection_6 = selection;
                _10.label = 31;
            case 31:
                if (!(_h < selection_6.length)) return [3 /*break*/, 37];
                node = selection_6[_h];
                if (node.type !== "TEXT")
                    return [3 /*break*/, 36];
                lines = node.characters.split(/\r\n|\r|\n/);
                if (lines.length <= 1)
                    return [3 /*break*/, 36];
                font = node.fontName;
                if (font === figma.mixed)
                    font = node.getRangeFontName(0, 1);
                _10.label = 32;
            case 32:
                _10.trys.push([32, 34, , 35]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 33:
                _10.sent();
                return [3 /*break*/, 35];
            case 34:
                e_3 = _10.sent();
                figma.notify("字体加载失败");
                return [3 /*break*/, 36];
            case 35:
                cy = node.y;
                for (_j = 0, lines_1 = lines; _j < lines_1.length; _j++) {
                    l = lines_1[_j];
                    if (!l.trim())
                        continue;
                    t = node.clone();
                    t.characters = l;
                    t.textAutoResize = "WIDTH_AND_HEIGHT";
                    t.y = cy;
                    node.parent.appendChild(t);
                    newSel.push(t);
                    cy += t.height + 10;
                }
                node.remove();
                _10.label = 36;
            case 36:
                _h++;
                return [3 /*break*/, 31];
            case 37:
                if (newSel.length > 0)
                    figma.currentPage.selection = newSel;
                return [3 /*break*/, 141];
            case 38:
                tNodes = selection.filter(function (n) { return n.type === 'TEXT'; }).sort(function (a, b) { return Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x; });
                if (tNodes.length < 2) {
                    figma.notify("请选2个以上文本");
                    return [2 /*return*/];
                }
                font = tNodes[0].fontName;
                if (font === figma.mixed)
                    font = tNodes[0].getRangeFontName(0, 1);
                _10.label = 39;
            case 39:
                _10.trys.push([39, 41, , 42]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 40:
                _10.sent();
                return [3 /*break*/, 42];
            case 41:
                e_4 = _10.sent();
                figma.notify("字体加载失败");
                return [2 /*return*/];
            case 42:
                txt = tNodes.map(function (n) { return n.characters; }).join('\n');
                nt = tNodes[0].clone();
                nt.characters = txt;
                nt.textAutoResize = 'HEIGHT';
                tNodes.forEach(function (n) { return n.remove(); });
                figma.currentPage.selection = [nt];
                return [3 /*break*/, 141];
            case 43:
                {
                    arr_1 = [];
                    selection.forEach(function (n) {
                        if (n.parent && n.parent.parent && n.parent !== figma.currentPage) {
                            n.parent.parent.appendChild(n);
                            arr_1.push(n);
                        }
                    });
                    if (arr_1.length > 0)
                        figma.currentPage.selection = arr_1;
                    return [3 /*break*/, 141];
                }
                _10.label = 44;
            case 44:
                {
                    arr_2 = [];
                    selection.forEach(function (n) {
                        figma.currentPage.appendChild(n);
                        arr_2.push(n);
                    });
                    figma.currentPage.selection = arr_2;
                    return [3 /*break*/, 141];
                }
                _10.label = 45;
            case 45:
                {
                    selection.forEach(function (n) {
                        var name = "";
                        if (n.type === 'TEXT')
                            name = n.characters;
                        else if ('findOne' in n) {
                            var t = n.findOne(function (x) { return x.type === 'TEXT'; });
                            if (t)
                                name = t.characters;
                        }
                        if (name)
                            n.name = name.substring(0, 20);
                    });
                    figma.notify("已重命名");
                    return [3 /*break*/, 141];
                }
                _10.label = 46;
            case 46:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length === 0) {
                        figma.notify("请先选中图层");
                        return [2 /*return*/];
                    }
                    targets_3 = [];
                    scan_1 = function (n) {
                        // 1. 先递归找子级
                        if ('children' in n) {
                            // 复制一份 children 避免遍历时索引问题
                            var children = n.children;
                            for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                                var child = children_2[_i];
                                scan_1(child);
                            }
                        }
                        // 2. 子级找完了，再看自己是不是组件实例
                        if (n.type === 'INSTANCE') {
                            targets_3.push(n);
                        }
                    };
                    // 开始扫描
                    sel.forEach(scan_1);
                    if (targets_3.length === 0) {
                        figma.notify("未找到可解绑的实例");
                        return [2 /*return*/];
                    }
                    count = 0;
                    // 按顺序解绑 (因为已经是“从内到外”的顺序，所以直接执行即可)
                    for (_k = 0, targets_1 = targets_3; _k < targets_1.length; _k++) {
                        node = targets_1[_k];
                        // 再次检查节点是否还存在（防止父级解绑导致子级引用变化，虽然此算法能最大程度避免）
                        if (!node.removed) {
                            try {
                                node.detachInstance();
                                count++;
                            }
                            catch (e) {
                                console.error("解绑出错:", e);
                            }
                        }
                    }
                    figma.notify("\u5DF2\u5F7B\u5E95\u89E3\u7ED1 ".concat(count, " \u4E2A\u7EC4\u4EF6"));
                    return [3 /*break*/, 141];
                }
                _10.label = 47;
            case 47:
                {
                    h = [];
                    pool = selection.length > 0 ? selection : [figma.currentPage];
                    for (_l = 0, pool_2 = pool; _l < pool_2.length; _l++) {
                        n = pool_2[_l];
                        if ('visible' in n && !n.visible)
                            h.push(n);
                        if ('findAll' in n)
                            h = h.concat(n.findAll(function (x) { return !x.visible; }));
                    }
                    count_3 = 0;
                    h.reverse().forEach(function (n) { if (!n.removed) {
                        n.remove();
                        count_3++;
                    } });
                    figma.notify("\u5DF2\u5220\u9664 ".concat(count_3, " \u4E2A\u9690\u85CF\u56FE\u5C42"));
                    return [3 /*break*/, 141];
                }
                _10.label = 48;
            case 48:
                {
                    if (selection.length > 1) {
                        p_1 = selection[0].parent;
                        if (selection.every(function (n) { return n.parent === p_1; })) {
                            isReverse_1 = layerSortDirection === 'desc';
                            __spreadArray([], selection, true).sort(function (a, b) {
                                var diffY = a.y - b.y;
                                var diffX = a.x - b.x;
                                var result = Math.abs(diffY) > 2 ? diffY : diffX;
                                return isReverse_1 ? -result : result;
                            }).forEach(function (n) { return p_1.appendChild(n); });
                            figma.notify(isReverse_1 ? "已【倒序】排列图层 (Z->A)" : "已【正序】排列图层 (A->Z)");
                            // 切换下次点击的方向
                            layerSortDirection = isReverse_1 ? 'asc' : 'desc';
                        }
                    }
                    else {
                        figma.notify("请至少选择两个同级图层");
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 49;
            case 49:
                {
                    count_4 = 0;
                    selection.forEach(function (n) {
                        if ('findAll' in n) {
                            var gs = n.findAll(function (x) { return x.type === 'GROUP'; });
                            while (gs.length > 0) {
                                gs.forEach(function (x) { if (!x.removed) {
                                    figma.ungroup(x);
                                    count_4++;
                                } });
                                gs = n.findAll(function (x) { return x.type === 'GROUP'; });
                            }
                        }
                    });
                    figma.notify("\u5DF2\u89E3\u6563 ".concat(count_4, " \u4E2A\u7EC4"));
                    return [3 /*break*/, 141];
                }
                _10.label = 50;
            case 50:
                {
                    count_2 = 0;
                    selection.forEach(ul);
                    figma.notify("\u5DF2\u89E3\u9501 ".concat(count_2, " \u4E2A\u56FE\u5C42"));
                    return [3 /*break*/, 141];
                }
                _10.label = 51;
            case 51:
                {
                    if (selection.length === 0) {
                        figma.notify("请选择图层");
                        return [2 /*return*/];
                    }
                    count = 0;
                    for (_m = 0, selection_7 = selection; _m < selection_7.length; _m++) {
                        node = selection_7[_m];
                        if (!node.removed) {
                            newX = Math.round(node.x);
                            newY = Math.round(node.y);
                            newW = Math.round(node.width);
                            newH = Math.round(node.height);
                            // 只有发生变化时才操作
                            if (node.x !== newX || node.y !== newY)
                                node.x = newX, node.y = newY;
                            if (node.width !== newW || node.height !== newH)
                                node.resize(newW, newH);
                            count++;
                        }
                    }
                    figma.notify("\u5DF2\u5BF9\u9F50 ".concat(count, " \u4E2A\u56FE\u5C42"));
                    return [3 /*break*/, 141];
                }
                _10.label = 52;
            case 52:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length > 0) {
                        figma.ui.postMessage({ type: 'update-name-input', name: sel[0].name });
                    }
                    else {
                        figma.notify("请先选择一个图层以获取名称");
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 53;
            case 53:
                {
                    f = msg.filters;
                    sel_5 = figma.currentPage.selection;
                    console.log("=== \u5F00\u59CB\u67E5\u627E (v3\u4FEE\u590D\u7248) ===");
                    console.log("Scope: ".concat(f.scope, " | \u9009\u4E2D\u56FE\u5C42: ").concat(sel_5.length));
                    searchTargets = [];
                    // =========================================================
                    // A. 构建查找池 (Pool Construction)
                    // =========================================================
                    if (f.scope === 'inside') {
                        // 模式：内在元素 (不包含选中项本身)
                        if (sel_5.length === 0) {
                            figma.notify("⚠️ 请先选择一个容器(Frame/Group)");
                            return [2 /*return*/];
                        }
                        for (_o = 0, sel_1 = sel_5; _o < sel_1.length; _o++) {
                            node = sel_1[_o];
                            if ('findAll' in node) {
                                children = node.findAll(function () { return true; });
                                searchTargets.push.apply(searchTargets, children);
                            }
                        }
                    }
                    else if (f.scope === 'children') {
                        // 模式：仅直系子级
                        if (sel_5.length === 0) {
                            figma.notify("⚠️ 请先选择一个容器(Frame/Group)");
                            return [2 /*return*/];
                        }
                        for (_p = 0, sel_2 = sel_5; _p < sel_2.length; _p++) {
                            node = sel_2[_p];
                            if ('children' in node) {
                                searchTargets.push.apply(searchTargets, node.children);
                            }
                        }
                    }
                    else if (f.scope === 'sibling') {
                        // 模式：同级
                        if (sel_5.length > 0 && sel_5[0].parent) {
                            siblings = sel_5[0].parent.children.filter(function (n) { return !sel_5.includes(n); });
                            searchTargets.push.apply(searchTargets, siblings);
                        }
                        else {
                            figma.notify("⚠️ 请先选择一个图层");
                            return [2 /*return*/];
                        }
                    }
                    else {
                        // 模式：子孙元素 (descendants) - 默认模式
                        // 逻辑：如果选了图层，查“选中项+选中项内部”；如果没选，查“全页”
                        if (sel_5.length > 0) {
                            console.log(">> 策略: 查找选中项及其后代");
                            // 1. 先把【选中项本身】加进去
                            // (使用 for 循环最稳妥)
                            for (_q = 0, sel_3 = sel_5; _q < sel_3.length; _q++) {
                                node = sel_3[_q];
                                searchTargets.push(node);
                                // 2. 再把【选中项的子孙】加进去
                                if ('findAll' in node) {
                                    children = node.findAll(function () { return true; });
                                    searchTargets.push.apply(searchTargets, children);
                                }
                            }
                        }
                        else {
                            console.log(">> 策略: 全页面查找");
                            allPageNodes = figma.currentPage.findAll(function () { return true; });
                            searchTargets.push.apply(searchTargets, allPageNodes);
                        }
                    }
                    uniqueMap_1 = new Map();
                    searchTargets.forEach(function (node) { return uniqueMap_1.set(node.id, node); });
                    finalPool = Array.from(uniqueMap_1.values());
                    console.log("\uD83D\uDD0D \u5F85\u7B5B\u9009\u6C60\u6700\u7EC8\u5927\u5C0F: ".concat(finalPool.length));
                    results = [];
                    // =========================================================
                    // C. 遍历筛选 (Filtering)
                    // =========================================================
                    for (_r = 0, finalPool_1 = finalPool; _r < finalPool_1.length; _r++) {
                        node = finalPool_1[_r];
                        match = true;
                        // 1. 名称匹配
                        if (f.name && f.name.val) {
                            n = node.name;
                            q = f.name.val;
                            if (!f.name.caseSensitive) {
                                n = n.toLowerCase();
                                q = q.toLowerCase();
                            }
                            if (!n.includes(q))
                                match = false;
                        }
                        // 2. 类型匹配
                        if (match && f.types && f.types.vals.length > 0) {
                            t = node.type;
                            ts = f.types.vals;
                            isType = false;
                            if (ts.includes(t))
                                isType = true;
                            if (ts.includes('AUTOLAYOUT') && t === 'FRAME' && node.layoutMode !== 'NONE')
                                isType = true;
                            if (ts.includes('IMAGE') && 'fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
                                if (node.fills.some(function (p) { return p.type === 'IMAGE' && p.visible !== false; }))
                                    isType = true;
                            }
                            if (ts.includes('COMPONENT_SET') && t === 'COMPONENT_SET')
                                isType = true;
                            if (ts.includes('SECTION') && t === 'SECTION')
                                isType = true;
                            if (f.types.logic === 'include') {
                                if (!isType)
                                    match = false;
                            }
                            else {
                                if (isType)
                                    match = false;
                            }
                        }
                        // 3. 状态匹配
                        if (match && f.states && f.states.vals.length > 0) {
                            isState = false;
                            s = f.states.vals;
                            if (s.includes('hidden') && !node.visible)
                                isState = true;
                            if (s.includes('locked') && node.locked)
                                isState = true;
                            if (s.includes('mask') && node.isMask)
                                isState = true;
                            if (s.includes('export') && node.exportSettings && node.exportSettings.length > 0)
                                isState = true;
                            if (s.includes('no-fill') && 'fills' in node && node.fills !== figma.mixed) {
                                if (Array.isArray(node.fills) && node.fills.length === 0)
                                    isState = true;
                            }
                            if (s.includes('no-stroke') && 'strokes' in node && node.strokes !== figma.mixed) {
                                if (Array.isArray(node.strokes) && node.strokes.length === 0)
                                    isState = true;
                            }
                            if (s.includes('clip') && 'clipsContent' in node && node.clipsContent)
                                isState = true;
                            if (s.includes('no-children') && 'children' in node) {
                                if (node.children.length === 0)
                                    isState = true;
                            }
                            if (f.states.logic === 'include') {
                                if (!isState)
                                    match = false;
                            }
                            else {
                                if (isState)
                                    match = false;
                            }
                        }
                        // 4. 属性匹配 (Props) - 加强容错
                        if (match && f.props && f.props.length > 0) {
                            for (_s = 0, _t = f.props; _s < _t.length; _s++) {
                                p = _t[_s];
                                val = undefined;
                                try {
                                    if (p.key === 'name')
                                        val = node.name;
                                    else if (p.key === 'fillCount' && 'fills' in node && node.fills !== figma.mixed)
                                        val = node.fills.length;
                                    else if (p.key === 'strokeCount' && 'strokes' in node && node.strokes !== figma.mixed)
                                        val = node.strokes.length;
                                    else if (p.key in node) {
                                        v = node[p.key];
                                        if (v !== figma.mixed)
                                            val = v;
                                    }
                                }
                                catch (e) { }
                                if (val === undefined) {
                                    match = false;
                                    break;
                                }
                                tgt = p.val;
                                // 数字比较 vs 字符串比较
                                if (p.op === '=') {
                                    if (val != tgt)
                                        match = false;
                                }
                                else if (p.op === '!=') {
                                    if (val == tgt)
                                        match = false;
                                }
                                else if (p.op === '>') {
                                    if (Number(val) <= Number(tgt))
                                        match = false;
                                }
                                else if (p.op === '<') {
                                    if (Number(val) >= Number(tgt))
                                        match = false;
                                }
                                else if (p.op === 'has') {
                                    if (!String(val).toLowerCase().includes(String(tgt).toLowerCase()))
                                        match = false;
                                }
                            }
                        }
                        if (match) {
                            results.push(node);
                        }
                    }
                    console.log("\u2705 \u6700\u7EC8\u5339\u914D: ".concat(results.length));
                    if (results.length > 0) {
                        figma.currentPage.selection = results;
                        figma.viewport.scrollAndZoomIntoView(results);
                        figma.notify("\u2705 \u5DF2\u9009\u4E2D ".concat(results.length, " \u4E2A\u56FE\u5C42"));
                        // 🔥 新增：将结果回传给 UI
                        figma.ui.postMessage({
                            type: 'found-layers-result',
                            count: results.length,
                            layers: results.map(function (n) { return ({ id: n.id, name: n.name, type: n.type }); })
                        });
                    }
                    else {
                        figma.notify("⚠️ 未找到图层，请检查 Console的筛选池大小");
                        figma.ui.postMessage({ type: 'found-layers-result', count: 0, layers: [] });
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 54;
            case 54:
                {
                    runFocus = function () { return __awaiter(_this, void 0, void 0, function () {
                        var ids, nodes, targets, selection_9, currentPageId, _i, nodes_1, node, p, isCurrent, e_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    ids = msg.ids;
                                    if (!ids || ids.length === 0)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, Promise.all(ids.map(function (id) { return figma.getNodeByIdAsync(id); }))];
                                case 1:
                                    nodes = _a.sent();
                                    targets = [];
                                    selection_9 = [];
                                    currentPageId = figma.currentPage.id;
                                    // 2. 快速筛选
                                    for (_i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                                        node = nodes_1[_i];
                                        if (!node || node.removed)
                                            continue;
                                        if (node.type === 'DOCUMENT' || node.type === 'PAGE')
                                            continue;
                                        p = node.parent;
                                        isCurrent = false;
                                        // 大多数情况父级就是 Page，优化判断速度
                                        if (p && p.type === 'PAGE') {
                                            isCurrent = (p.id === currentPageId);
                                        }
                                        else {
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
                                            targets.push(node);
                                            // 如果没锁且可见，也加入“选中目标”
                                            if (!node.locked && node.visible) {
                                                selection_9.push(node);
                                            }
                                        }
                                    }
                                    if (targets.length > 0) {
                                        // A. 尝试选中 (如果全是锁定的，这里就是空数组，会清空选择，是正确的表现)
                                        figma.currentPage.selection = selection_9;
                                        // B. 视图定位 (这是你要的核心功能)
                                        figma.viewport.scrollAndZoomIntoView(targets);
                                        // C. 只有多选时才提示，单选静默，体验最好
                                        if (targets.length > 1) {
                                            figma.notify("\u5DF2\u5B9A\u4F4D ".concat(targets.length, " \u9879"));
                                        }
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_10 = _a.sent();
                                    console.log("定位错误 (已忽略):", e_10);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    runFocus();
                    return [3 /*break*/, 141];
                }
                _10.label = 55;
            case 55:
                console.log("=== 开始执行创建样式 (Async模式) ===");
                if (selection.length === 0) {
                    figma.notify("请选择图层");
                    return [2 /*return*/];
                }
                createdCount = 0;
                conflicts = [];
                errors = [];
                _10.label = 56;
            case 56:
                _10.trys.push([56, 64, , 65]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 57:
                localPaints = _10.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 58:
                localTexts = _10.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 59:
                localEffects = _10.sent();
                _loop_1 = function (node) {
                    var name_1, exist, style, exist, style, font, err_4, exist, style;
                    return __generator(this, function (_11) {
                        switch (_11.label) {
                            case 0:
                                if (node.removed)
                                    return [2 /*return*/, "continue"];
                                name_1 = node.name;
                                console.log("\u5904\u7406\u56FE\u5C42: ".concat(name_1));
                                // --- 1. 处理颜色样式 (Fills) ---
                                if ('fills' in node && node.type !== 'GROUP' && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
                                    if (node.fills[0].type !== 'IMAGE') {
                                        exist = localPaints.find(function (s) { return s.name === name_1; });
                                        if (exist) {
                                            if (!conflicts.includes(name_1))
                                                conflicts.push(name_1 + " (颜色)");
                                        }
                                        else {
                                            try {
                                                style = figma.createPaintStyle();
                                                style.name = name_1;
                                                style.paints = JSON.parse(JSON.stringify(node.fills)); // 克隆防报错
                                                node.fillStyleId = style.id;
                                                createdCount++;
                                            }
                                            catch (err) {
                                                errors.push(name_1);
                                                console.error("颜色创建失败:", err);
                                            }
                                        }
                                    }
                                }
                                if (!(node.type === 'TEXT')) return [3 /*break*/, 5];
                                exist = localTexts.find(function (s) { return s.name === name_1; });
                                if (!exist) return [3 /*break*/, 1];
                                if (!conflicts.includes(name_1))
                                    conflicts.push(name_1 + " (文本)");
                                return [3 /*break*/, 5];
                            case 1:
                                _11.trys.push([1, 4, , 5]);
                                style = figma.createTextStyle();
                                style.name = name_1;
                                font = node.fontName;
                                if (!(font !== figma.mixed)) return [3 /*break*/, 3];
                                return [4 /*yield*/, figma.loadFontAsync(font)];
                            case 2:
                                _11.sent();
                                style.fontName = font;
                                style.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 12;
                                if (node.letterSpacing !== figma.mixed)
                                    style.letterSpacing = node.letterSpacing;
                                if (node.lineHeight !== figma.mixed)
                                    style.lineHeight = node.lineHeight;
                                if (node.textDecoration !== figma.mixed)
                                    style.textDecoration = node.textDecoration;
                                node.textStyleId = style.id;
                                createdCount++;
                                _11.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                err_4 = _11.sent();
                                errors.push(name_1);
                                console.error("文本创建失败:", err_4);
                                return [3 /*break*/, 5];
                            case 5:
                                // --- 3. 处理效果样式 (Effects) ---
                                if ('effects' in node && node.effects !== figma.mixed && Array.isArray(node.effects) && node.effects.length > 0) {
                                    exist = localEffects.find(function (s) { return s.name === name_1; });
                                    if (exist) {
                                        if (!conflicts.includes(name_1))
                                            conflicts.push(name_1 + " (效果)");
                                    }
                                    else {
                                        try {
                                            style = figma.createEffectStyle();
                                            style.name = name_1;
                                            style.effects = JSON.parse(JSON.stringify(node.effects));
                                            node.effectStyleId = style.id;
                                            createdCount++;
                                        }
                                        catch (err) {
                                            errors.push(name_1);
                                            console.error("效果创建失败:", err);
                                        }
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _u = 0, selection_8 = selection;
                _10.label = 60;
            case 60:
                if (!(_u < selection_8.length)) return [3 /*break*/, 63];
                node = selection_8[_u];
                return [5 /*yield**/, _loop_1(node)];
            case 61:
                _10.sent();
                _10.label = 62;
            case 62:
                _u++;
                return [3 /*break*/, 60];
            case 63: return [3 /*break*/, 65];
            case 64:
                e_5 = _10.sent();
                console.error("全局错误:", e_5);
                figma.notify("发生错误，请查看控制台");
                return [3 /*break*/, 65];
            case 65:
                parts = [];
                if (createdCount > 0)
                    parts.push("\u65B0\u5EFA ".concat(createdCount, " \u4E2A"));
                if (conflicts.length > 0)
                    parts.push("\u8DF3\u8FC7\u91CD\u590D ".concat(conflicts.length, " \u4E2A"));
                if (parts.length > 0) {
                    figma.notify(parts.join('，'));
                }
                else {
                    figma.notify("未执行操作 (可能是无样式属性或已重复)");
                }
                console.log("=== 结束 ===");
                return [3 /*break*/, 141];
            case 66:
                console.log("=== 开始匹配样式 (Async修复版) ===");
                sel = figma.currentPage.selection;
                if (sel.length === 0) {
                    figma.notify("请先选择范围 (支持包含子图层)");
                    return [2 /*return*/];
                }
                countFill_1 = 0, countStroke_1 = 0, countText_1 = 0, countEffect_1 = 0;
                _10.label = 67;
            case 67:
                _10.trys.push([67, 75, , 76]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 68:
                paints = _10.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 69:
                texts = _10.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 70:
                effects = _10.sent();
                paintMap_1 = new Map();
                paints.forEach(function (s) { return paintMap_1.set(JSON.stringify(s.paints), s.id); });
                effectMap_1 = new Map();
                effects.forEach(function (s) { return effectMap_1.set(JSON.stringify(s.effects), s.id); });
                textMap_1 = new Map();
                texts.forEach(function (s) {
                    var fingerprint = JSON.stringify({
                        family: s.fontName.family,
                        style: s.fontName.style,
                        size: s.fontSize,
                        lh: s.lineHeight,
                        ls: s.letterSpacing,
                        td: s.textDecoration,
                        pi: s.paragraphIndent,
                        ps: s.paragraphSpacing
                    });
                    textMap_1.set(fingerprint, s.id);
                });
                traverse_3 = function (node) { return __awaiter(_this, void 0, void 0, function () {
                    var key, e_11, key, e_12, key, e_13, key, e_14, _i, _a, child;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (node.removed)
                                    return [2 /*return*/];
                                if (!('fills' in node && node.fills !== figma.mixed && node.fills.length > 0 && node.fillStyleId === '')) return [3 /*break*/, 4];
                                key = JSON.stringify(node.fills);
                                if (!paintMap_1.has(key)) return [3 /*break*/, 4];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                // 修复点：使用 setFillStyleIdAsync
                                return [4 /*yield*/, node.setFillStyleIdAsync(paintMap_1.get(key))];
                            case 2:
                                // 修复点：使用 setFillStyleIdAsync
                                _b.sent();
                                countFill_1++;
                                return [3 /*break*/, 4];
                            case 3:
                                e_11 = _b.sent();
                                return [3 /*break*/, 4];
                            case 4:
                                if (!('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeStyleId === '')) return [3 /*break*/, 8];
                                key = JSON.stringify(node.strokes);
                                if (!paintMap_1.has(key)) return [3 /*break*/, 8];
                                _b.label = 5;
                            case 5:
                                _b.trys.push([5, 7, , 8]);
                                // 修复点：使用 setStrokeStyleIdAsync
                                return [4 /*yield*/, node.setStrokeStyleIdAsync(paintMap_1.get(key))];
                            case 6:
                                // 修复点：使用 setStrokeStyleIdAsync
                                _b.sent();
                                countStroke_1++;
                                return [3 /*break*/, 8];
                            case 7:
                                e_12 = _b.sent();
                                return [3 /*break*/, 8];
                            case 8:
                                if (!('effects' in node && node.effects !== figma.mixed && node.effects.length > 0 && node.effectStyleId === '')) return [3 /*break*/, 12];
                                key = JSON.stringify(node.effects);
                                if (!effectMap_1.has(key)) return [3 /*break*/, 12];
                                _b.label = 9;
                            case 9:
                                _b.trys.push([9, 11, , 12]);
                                // 修复点：使用 setEffectStyleIdAsync
                                return [4 /*yield*/, node.setEffectStyleIdAsync(effectMap_1.get(key))];
                            case 10:
                                // 修复点：使用 setEffectStyleIdAsync
                                _b.sent();
                                countEffect_1++;
                                return [3 /*break*/, 12];
                            case 11:
                                e_13 = _b.sent();
                                return [3 /*break*/, 12];
                            case 12:
                                if (!(node.type === 'TEXT' && node.textStyleId === '' && node.fontName !== figma.mixed && node.fontSize !== figma.mixed)) return [3 /*break*/, 16];
                                key = JSON.stringify({
                                    family: node.fontName.family,
                                    style: node.fontName.style,
                                    size: node.fontSize,
                                    lh: node.lineHeight,
                                    ls: node.letterSpacing,
                                    td: node.textDecoration,
                                    pi: node.paragraphIndent,
                                    ps: node.paragraphSpacing
                                });
                                if (!textMap_1.has(key)) return [3 /*break*/, 16];
                                _b.label = 13;
                            case 13:
                                _b.trys.push([13, 15, , 16]);
                                // 修复点：使用 setTextStyleIdAsync
                                return [4 /*yield*/, node.setTextStyleIdAsync(textMap_1.get(key))];
                            case 14:
                                // 修复点：使用 setTextStyleIdAsync
                                _b.sent();
                                countText_1++;
                                return [3 /*break*/, 16];
                            case 15:
                                e_14 = _b.sent();
                                return [3 /*break*/, 16];
                            case 16:
                                if (!('children' in node)) return [3 /*break*/, 20];
                                _i = 0, _a = node.children;
                                _b.label = 17;
                            case 17:
                                if (!(_i < _a.length)) return [3 /*break*/, 20];
                                child = _a[_i];
                                return [4 /*yield*/, traverse_3(child)];
                            case 18:
                                _b.sent();
                                _b.label = 19;
                            case 19:
                                _i++;
                                return [3 /*break*/, 17];
                            case 20: return [2 /*return*/];
                        }
                    });
                }); };
                _v = 0, sel_4 = sel;
                _10.label = 71;
            case 71:
                if (!(_v < sel_4.length)) return [3 /*break*/, 74];
                node = sel_4[_v];
                return [4 /*yield*/, traverse_3(node)];
            case 72:
                _10.sent();
                _10.label = 73;
            case 73:
                _v++;
                return [3 /*break*/, 71];
            case 74: return [3 /*break*/, 76];
            case 75:
                e_6 = _10.sent();
                console.error("匹配过程出错:", e_6);
                figma.notify("匹配出错，请检查控制台");
                return [2 /*return*/];
            case 76:
                total = countFill_1 + countStroke_1 + countText_1 + countEffect_1;
                if (total > 0) {
                    figma.notify("\u5339\u914D\u6210\u529F: \u586B\u5145".concat(countFill_1, " / \u63CF\u8FB9").concat(countStroke_1, " / \u6587\u672C").concat(countText_1, " / \u6548\u679C").concat(countEffect_1));
                }
                else {
                    figma.notify("未发现可匹配的样式");
                }
                return [3 /*break*/, 141];
            case 77:
                {
                    if (selection.length !== 2) {
                        figma.notify("请严格选择 2 个图层进行交换");
                        return [2 /*return*/];
                    }
                    n1 = selection[0];
                    n2 = selection[1];
                    x1 = n1.x, y1 = n1.y;
                    x2 = n2.x, y2 = n2.y;
                    n1.x = x2;
                    n1.y = y2;
                    n2.x = x1;
                    n2.y = y1;
                    figma.notify("位置已互换");
                    return [3 /*break*/, 141];
                }
                _10.label = 78;
            case 78:
                findText = msg.findText, replaceText = msg.replaceText;
                if (!findText) {
                    figma.notify("请输入查找内容，注意区分大小写");
                    return [2 /*return*/];
                }
                scope = selection.length > 0 ? selection : [figma.currentPage];
                count = 0;
                textNodes_4 = [];
                collect_1 = function (n) {
                    if (n.type === 'TEXT')
                        textNodes_4.push(n);
                    if ('children' in n)
                        n.children.forEach(collect_1);
                };
                scope.forEach(collect_1);
                if (textNodes_4.length === 0) {
                    figma.notify("范围内没有文本");
                    return [2 /*return*/];
                }
                _w = 0, textNodes_1 = textNodes_4;
                _10.label = 79;
            case 79:
                if (!(_w < textNodes_1.length)) return [3 /*break*/, 87];
                node = textNodes_1[_w];
                if (!node.characters.includes(findText)) return [3 /*break*/, 86];
                _10.label = 80;
            case 80:
                _10.trys.push([80, 85, , 86]);
                font = node.fontName;
                if (!(font === figma.mixed)) return [3 /*break*/, 82];
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                return [4 /*yield*/, figma.loadFontAsync(node.getRangeFontName(0, 1))];
            case 81:
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                _10.sent();
                return [3 /*break*/, 84];
            case 82: return [4 /*yield*/, figma.loadFontAsync(font)];
            case 83:
                _10.sent();
                _10.label = 84;
            case 84:
                // 执行替换
                node.characters = node.characters.split(findText).join(replaceText);
                count++;
                return [3 /*break*/, 86];
            case 85:
                e_7 = _10.sent();
                console.error("字体加载失败或替换出错", e_7);
                return [3 /*break*/, 86];
            case 86:
                _w++;
                return [3 /*break*/, 79];
            case 87:
                if (count > 0)
                    figma.notify("\u5DF2\u66FF\u6362 ".concat(count, " \u5904\u6587\u672C"));
                else
                    figma.notify("未找到匹配内容");
                return [3 /*break*/, 141];
            case 88:
                pageName = figma.currentPage.name.toLowerCase();
                // --- 修复点 1：安全检查不通过时，要告诉 UI 重置按钮 ---
                if (!pageName.includes('copy') && !pageName.includes('副本')) {
                    figma.notify("⚠️ 请先将 Page 重命名为 'xxx 副本' 以确保安全！", { error: true });
                    // 发送一个 'step-error' 消息给 UI，让它停止转圈
                    figma.ui.postMessage({ type: 'step-error', step: 1 });
                    return [2 /*return*/];
                }
                slides = getSlides();
                // --- 修复点 2：没选图层时，也要告诉 UI 重置按钮 ---
                if (slides.length === 0) {
                    figma.notify("请至少选择一个 Frame 画板");
                    figma.ui.postMessage({ type: 'step-error', step: 1 });
                    return [2 /*return*/];
                }
                // 执行 Step 1 函数
                return [4 /*yield*/, pptStep1_Init(slides)];
            case 89:
                // 执行 Step 1 函数
                _10.sent();
                return [3 /*break*/, 141];
            case 90:
                slides = getSlides();
                return [4 /*yield*/, pptStep2_Rasterize(slides)];
            case 91:
                _10.sent();
                return [3 /*break*/, 141];
            case 92:
                slides = getSlides();
                return [4 /*yield*/, pptStep3_Flatten(slides)];
            case 93:
                _10.sent();
                return [3 /*break*/, 141];
            case 94:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 ===
                slides = sortNodesByVisualPosition(slides);
                // 函数内部会发送 step-done，这里不需要再发了
                return [4 /*yield*/, pptStep4_Extract(slides)];
            case 95:
                // 函数内部会发送 step-done，这里不需要再发了
                _10.sent();
                return [3 /*break*/, 141];
            case 96:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 (保持顺序一致) ===
                slides = sortNodesByVisualPosition(slides);
                // 同上，内部已发消息
                return [4 /*yield*/, pptStep5_ExportImages(slides)];
            case 97:
                // 同上，内部已发消息
                _10.sent();
                return [3 /*break*/, 141];
            case 98:
                {
                    console.log("【3】后端：进入严格分类逻辑...");
                    cfg_1 = msg.config || msg;
                    targets_4 = [];
                    targetTypes_1 = cfg_1.targetTypes || { compName: true, propName: true, propValue: true };
                    scopeNodes = [];
                    if (cfg_1.scope === 'page') {
                        scopeNodes = figma.currentPage.children;
                    }
                    else {
                        scopeNodes = figma.currentPage.selection;
                    }
                    collectTargets_1 = function (nodes) {
                        for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                            var node = nodes_2[_i];
                            if (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') {
                                targets_4.push(node);
                            }
                            if ('children' in node)
                                collectTargets_1(node.children);
                        }
                    };
                    collectTargets_1(scopeNodes);
                    findRegex_1 = null;
                    if (cfg_1.mode === 'find' && cfg_1.findText) {
                        try {
                            escape_1 = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
                            pat = escape_1(cfg_1.findText);
                            if (cfg_1.wholeWord)
                                pat = "\\b".concat(pat, "\\b");
                            findRegex_1 = new RegExp(pat, cfg_1.caseSensitive ? 'g' : 'gi');
                        }
                        catch (e) { }
                    }
                    results_1 = [];
                    checkString_1 = function (text) {
                        var res = { changed: false, val: text };
                        if (cfg_1.mode === 'lint') {
                            res = convertNameAdvanced(text, cfg_1.format, cfg_1.separator, cfg_1.casing, cfg_1.emoji, cfg_1.removeId, cfg_1.unmarkHidden);
                        }
                        else if (findRegex_1) {
                            if (findRegex_1.test(text)) {
                                res.val = text.replace(findRegex_1, cfg_1.replaceText || '');
                                res.changed = true;
                            }
                            if (res.changed && cfg_1.markHidden) {
                                if (!res.val.startsWith('.') && !res.val.startsWith('_'))
                                    res.val = '.' + res.val;
                            }
                            if (cfg_1.unmarkHidden) {
                                if (res.val.startsWith('.') || res.val.startsWith('_')) {
                                    res.val = res.val.substring(1);
                                    res.changed = true;
                                }
                            }
                        }
                        return res;
                    };
                    _loop_2 = function (node) {
                        try {
                            if (node.type === 'COMPONENT_SET') {
                                if (targetTypes_1.compName) {
                                    var res = checkString_1(node.name);
                                    if (res.changed) {
                                        results_1.push({
                                            id: node.id, compId: node.id, compName: node.name,
                                            type: 'COMPONENT_SET',
                                            targetType: 'CompName',
                                            propName: 'Name', oldVal: node.name, newVal: res.val
                                        });
                                    }
                                }
                            }
                            else if (node.type === 'COMPONENT') {
                                var isVariant = node.parent && node.parent.type === 'COMPONENT_SET';
                                var compId_1 = isVariant ? node.parent.id : node.id;
                                var CompName_1 = isVariant ? node.parent.name : node.name;
                                var groupType_1 = isVariant ? 'COMPONENT_SET' : 'COMPONENT';
                                if (!isVariant) {
                                    if (targetTypes_1.compName) {
                                        var res = checkString_1(node.name);
                                        if (res.changed) {
                                            results_1.push({
                                                id: node.id, compId: compId_1, compName: CompName_1,
                                                type: groupType_1,
                                                targetType: 'CompName',
                                                propName: 'Name', oldVal: node.name, newVal: res.val
                                            });
                                        }
                                    }
                                }
                                else {
                                    var rawProps = node.name.split(',').map(function (p) { return p.trim(); });
                                    var newProps_1 = [];
                                    var hasAnyChange_1 = false;
                                    rawProps.forEach(function (pair) {
                                        var parts = pair.split('=');
                                        if (parts.length < 2) {
                                            newProps_1.push(pair);
                                            return;
                                        }
                                        var key = parts[0].trim();
                                        var val = parts[1].trim();
                                        if (targetTypes_1.propName) {
                                            var resKey = checkString_1(key);
                                            if (resKey.changed) {
                                                results_1.push({
                                                    id: node.id, compId: compId_1, compName: CompName_1,
                                                    type: groupType_1,
                                                    targetType: 'PropName',
                                                    propName: 'Property',
                                                    oldVal: key, newVal: resKey.val
                                                });
                                                hasAnyChange_1 = true;
                                            }
                                        }
                                        if (targetTypes_1.propValue) {
                                            var resVal = checkString_1(val);
                                            if (resVal.changed) {
                                                results_1.push({
                                                    id: node.id, compId: compId_1, compName: CompName_1,
                                                    type: groupType_1,
                                                    targetType: 'PropValue',
                                                    propName: key,
                                                    oldVal: val, newVal: resVal.val
                                                });
                                                hasAnyChange_1 = true;
                                            }
                                        }
                                        var finalKey = (targetTypes_1.propName && checkString_1(key).changed) ? checkString_1(key).val : key;
                                        var finalVal = (targetTypes_1.propValue && checkString_1(val).changed) ? checkString_1(val).val : val;
                                        newProps_1.push("".concat(finalKey, "=").concat(finalVal));
                                    });
                                    if (hasAnyChange_1) {
                                        var fullNewName = newProps_1.join(', ');
                                        for (var k = results_1.length - 1; k >= 0; k--) {
                                            if (results_1[k].id === node.id) {
                                                if (!results_1[k].fullResult)
                                                    results_1[k].fullResult = fullNewName;
                                            }
                                            else {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    };
                    for (_x = 0, targets_2 = targets_4; _x < targets_2.length; _x++) {
                        node = targets_2[_x];
                        _loop_2(node);
                    }
                    figma.ui.postMessage({ type: 'lint-results', data: results_1 });
                    return [3 /*break*/, 141];
                }
                _10.label = 99;
            case 99:
                items = msg.items;
                count = 0;
                _y = 0, items_1 = items;
                _10.label = 100;
            case 100:
                if (!(_y < items_1.length)) return [3 /*break*/, 105];
                item = items_1[_y];
                _10.label = 101;
            case 101:
                _10.trys.push([101, 103, , 104]);
                return [4 /*yield*/, figma.getNodeByIdAsync(item.id)];
            case 102:
                node = _10.sent();
                if (node) {
                    node.name = item.fullResult || item.newVal;
                    count++;
                }
                return [3 /*break*/, 104];
            case 103:
                err_1 = _10.sent();
                return [3 /*break*/, 104];
            case 104:
                _y++;
                return [3 /*break*/, 100];
            case 105:
                figma.notify("\u2728 \u5DF2\u6210\u529F\u4FEE\u590D ".concat(count, " \u9879\u547D\u540D"));
                return [3 /*break*/, 141];
            case 106:
                {
                    scope = msg.scope, findText_1 = msg.findText;
                    console.log("【后端】收到文本查找请求:", scope, findText_1); // 调试日志
                    results_2 = [];
                    searchPool = [];
                    // 1. 确定搜索范围
                    if (scope === 'selection') {
                        searchPool = figma.currentPage.selection;
                    }
                    else {
                        // 搜索整个页面 (包含页面本身)
                        searchPool = [figma.currentPage];
                    }
                    if (searchPool.length === 0 && scope === 'selection') {
                        figma.notify("请先选择图层");
                        // 即使失败，也要发回空结果，以此重置前端按钮状态
                        figma.ui.postMessage({ type: 'text-find-results', data: [] });
                        return [2 /*return*/];
                    }
                    traverse_4 = function (node) {
                        // 只有可见的文本层才参与查找
                        if (node.type === 'TEXT' && node.visible) {
                            var fullText = node.characters;
                            // 转义正则特殊字符
                            var escapedFindText = findText_1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            // 全局、不区分大小写匹配
                            var regex = new RegExp(escapedFindText, 'gi');
                            var match = void 0;
                            while ((match = regex.exec(fullText)) !== null) {
                                results_2.push({
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
                            node.children.forEach(traverse_4);
                        }
                    };
                    // 3. 执行查找
                    searchPool.forEach(traverse_4);
                    console.log("\u3010\u540E\u7AEF\u3011\u67E5\u627E\u5B8C\u6210\uFF0C\u627E\u5230 ".concat(results_2.length, " \u9879"));
                    // 4. 发送结果给前端
                    figma.ui.postMessage({ type: 'text-find-results', data: results_2 });
                    if (results_2.length === 0) {
                        figma.notify("未找到匹配文本");
                    }
                    return [3 /*break*/, 141];
                }
                _10.label = 107;
            case 107:
                _10.trys.push([107, 113, , 114]);
                return [4 /*yield*/, figma.getNodeByIdAsync(msg.id)];
            case 108:
                node = _10.sent();
                if (!node) return [3 /*break*/, 111];
                // === 第一步：通用操作 (先选中并聚焦) ===
                // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                figma.currentPage.selection = [node];
                figma.viewport.scrollAndZoomIntoView([node]);
                if (!(node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number')) return [3 /*break*/, 110];
                cacheKey = "".concat(msg.id, "_").concat(msg.index);
                font = node.fontName === figma.mixed
                    ? node.getRangeFontName(0, 1)
                    : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 109:
                _10.sent();
                // A. 还原颜色
                if (highlightCache[cacheKey]) {
                    cachedData = highlightCache[cacheKey];
                    node.setRangeFills(msg.index, msg.index + cachedData.length, cachedData.fills);
                    delete highlightCache[cacheKey];
                    figma.notify("已还原颜色");
                    figma.ui.postMessage({ type: 'highlight-status', key: cacheKey, status: false });
                }
                else {
                    currentFills = node.getRangeFills(msg.index, msg.index + 1);
                    highlightCache[cacheKey] = { fills: currentFills, length: msg.length };
                    highlightPaint = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
                    node.setRangeFills(msg.index, msg.index + msg.length, highlightPaint);
                    figma.notify("已标记 (再次点击可还原)");
                    figma.ui.postMessage({ type: 'highlight-status', key: cacheKey, status: true });
                }
                _10.label = 110;
            case 110: return [3 /*break*/, 112];
            case 111:
                figma.notify("图层不存在 (可能已被删除)");
                _10.label = 112;
            case 112: return [3 /*break*/, 114];
            case 113:
                e_8 = _10.sent();
                console.error("定位失败:", e_8);
                return [3 /*break*/, 114];
            case 114: return [3 /*break*/, 141];
            case 115:
                tasks = msg.tasks, replaceText = msg.replaceText;
                successCount = 0;
                processedIds = new Set();
                groups_1 = {};
                tasks.forEach(function (task) {
                    if (!groups_1[task.id])
                        groups_1[task.id] = [];
                    groups_1[task.id].push(task);
                });
                _z = groups_1;
                _0 = [];
                for (_1 in _z)
                    _0.push(_1);
                _2 = 0;
                _10.label = 116;
            case 116:
                if (!(_2 < _0.length)) return [3 /*break*/, 122];
                _1 = _0[_2];
                if (!(_1 in _z)) return [3 /*break*/, 121];
                nodeId = _1;
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 117:
                node = _10.sent();
                if (!node || node.type !== 'TEXT')
                    return [3 /*break*/, 121];
                groupTasks = groups_1[nodeId];
                // 🌟 倒序排序
                groupTasks.sort(function (a, b) { return b.index - a.index; });
                _10.label = 118;
            case 118:
                _10.trys.push([118, 120, , 121]);
                // 加载字体
                return [4 /*yield*/, figma.loadFontAsync(node.fontName === figma.mixed
                        ? node.getRangeFontName(0, 1)
                        : node.fontName)];
            case 119:
                // 加载字体
                _10.sent();
                // 执行替换
                for (_3 = 0, groupTasks_1 = groupTasks; _3 < groupTasks_1.length; _3++) {
                    task = groupTasks_1[_3];
                    currentStr = node.characters.substring(task.index, task.index + task.length);
                    // 简单的校验，略过严格校验以允许大小写差异
                    node.deleteCharacters(task.index, task.index + task.length);
                    node.insertCharacters(task.index, replaceText);
                    successCount++;
                    // 记录前端传来的唯一标识 (uid)，以便前端禁用
                    if (task.uid)
                        processedIds.add(task.uid);
                }
                return [3 /*break*/, 121];
            case 120:
                err_2 = _10.sent();
                console.error("\u66FF\u6362\u5931\u8D25 ".concat(nodeId, ":"), err_2);
                return [3 /*break*/, 121];
            case 121:
                _2++;
                return [3 /*break*/, 116];
            case 122:
                // 通知前端哪些任务完成了
                figma.ui.postMessage({
                    type: 'text-replace-success',
                    count: successCount,
                    processedUids: Array.from(processedIds)
                });
                figma.notify("\u5DF2\u66FF\u6362 ".concat(successCount, " \u5904\u6587\u672C"));
                return [3 /*break*/, 141];
            case 123:
                count = 0;
                _4 = highlightCache;
                _5 = [];
                for (_6 in _4)
                    _5.push(_6);
                _7 = 0;
                _10.label = 124;
            case 124:
                if (!(_7 < _5.length)) return [3 /*break*/, 131];
                _6 = _5[_7];
                if (!(_6 in _4)) return [3 /*break*/, 130];
                key = _6;
                _8 = key.split('_'), nodeId = _8[0], indexStr = _8[1];
                index = parseInt(indexStr);
                data = highlightCache[key];
                _10.label = 125;
            case 125:
                _10.trys.push([125, 129, , 130]);
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 126:
                node = _10.sent();
                if (!(node && node.type === 'TEXT')) return [3 /*break*/, 128];
                font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 127:
                _10.sent();
                node.setRangeFills(index, index + data.length, data.fills);
                count++;
                _10.label = 128;
            case 128: return [3 /*break*/, 130];
            case 129:
                e_9 = _10.sent();
                console.log("还原失败", e_9);
                return [3 /*break*/, 130];
            case 130:
                _7++;
                return [3 /*break*/, 124];
            case 131:
                highlightCache = {}; // 清空池子
                figma.notify("\u5DF2\u8FD8\u539F ".concat(count, " \u5904\u9AD8\u4EAE"));
                // 通知前端清除所有高亮样式
                figma.ui.postMessage({ type: 'clear-all-highlights-ui' });
                return [3 /*break*/, 141];
            case 132:
                ids = msg.ids, findText = msg.findText, replaceText = msg.replaceText;
                count = 0;
                _9 = 0, ids_1 = ids;
                _10.label = 133;
            case 133:
                if (!(_9 < ids_1.length)) return [3 /*break*/, 139];
                id = ids_1[_9];
                return [4 /*yield*/, figma.getNodeByIdAsync(id)];
            case 134:
                node = _10.sent();
                if (!(node && node.type === 'TEXT')) return [3 /*break*/, 138];
                _10.label = 135;
            case 135:
                _10.trys.push([135, 137, , 138]);
                // 加载字体 (必要步骤)
                return [4 /*yield*/, figma.loadFontAsync(node.fontName === figma.mixed
                        ? node.getRangeFontName(0, 1)
                        : node.fontName)];
            case 136:
                // 加载字体 (必要步骤)
                _10.sent();
                regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (regex.test(node.characters)) {
                    node.characters = node.characters.replace(regex, replaceText);
                    count++;
                }
                return [3 /*break*/, 138];
            case 137:
                err_3 = _10.sent();
                console.error("\u66FF\u6362\u6587\u672C\u5931\u8D25 (ID: ".concat(id, "):"), err_3);
                return [3 /*break*/, 138];
            case 138:
                _9++;
                return [3 /*break*/, 133];
            case 139:
                figma.notify("\u5DF2\u66FF\u6362 ".concat(count, " \u4E2A\u6587\u672C\u56FE\u5C42"));
                return [3 /*break*/, 141];
            case 140:
                figma.ui.resize(msg.width, msg.height);
                return [3 /*break*/, 141];
            case 141: return [2 /*return*/];
        }
    });
}); };
// -------------------------------------------------------------
// 【新增】高级命名转换函数 (支持 格式+分隔符+大小写 组合)
// -------------------------------------------------------------
// --- PPT 工具辅助函数 ---
// 获取用户选中的 Frame (ID去重版)
function getSlides() {
    var selection = figma.currentPage.selection;
    var uniqueMap = new Map();
    // 1. 只找选中的 Frame
    for (var _i = 0, selection_10 = selection; _i < selection_10.length; _i++) {
        var node = selection_10[_i];
        if (node.type === 'FRAME') {
            uniqueMap.set(node.id, node);
        }
    }
    var frames = Array.from(uniqueMap.values());
    // 2. 简单的嵌套过滤 (防止选了画板又选了里面的按钮)
    // 如果一个 Frame 的父级也在选中列表里，那它就是子元素，删掉
    var finalSlides = frames.filter(function (node) {
        var parent = node.parent;
        while (parent && parent.type !== 'PAGE' && parent.type !== 'DOCUMENT') {
            if (uniqueMap.has(parent.id))
                return false;
            parent = parent.parent;
        }
        return true;
    });
    return finalSlides;
}
// Step 1: 初始化 (解锁、解组实例、移除隐藏)
// Step 1: 初始化 (防崩溃稳健版)
// 将 "解绑" 和 "清理" 分离，彻底解决 WASM 内存越界问题
function pptStep1_Init(slides) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, slides_1, slide, loopCount, instances, target, traverse;
        return __generator(this, function (_a) {
            // === 阶段一：暴力解绑 (Iterative Detach) ===
            // 只要还有 Instance，就一直循环处理，直到解绑干净
            for (_i = 0, slides_1 = slides; _i < slides_1.length; _i++) {
                slide = slides_1[_i];
                loopCount = 0;
                instances = slide.findAll(function (n) { return n.type === 'INSTANCE'; });
                while (instances.length > 0) {
                    // 安全熔断机制：防止极个别情况下的死循环
                    loopCount++;
                    if (loopCount > 5000) {
                        console.warn("解绑层级过深，强制跳出");
                        break;
                    }
                    target = instances[0];
                    try {
                        // 执行解绑
                        // 注意：解绑后，target 这个变量就“死”了，不能再访问它的属性
                        target.detachInstance();
                    }
                    catch (e) {
                        console.warn("解绑单个节点失败:", e);
                    }
                    // === 关键点 ===
                    // 解绑一个后，整个图层树结构变了，之前的 instances 数组里的引用全都失效了
                    // 必须立刻重新扫描，获取最新的列表
                    instances = slide.findAll(function (n) { return n.type === 'INSTANCE'; });
                }
            }
            traverse = function (node) {
                // 防御性检查
                if (node.removed)
                    return;
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
                    __spreadArray([], node.children, true).forEach(function (child) { return traverse(child); });
                }
            };
            // 对所有 Slide 执行清洗
            slides.forEach(function (slide) { return traverse(slide); });
            // 通知 UI 完成
            figma.ui.postMessage({ type: 'step-done', step: 1 });
            return [2 /*return*/];
        });
    });
}
// Step 2: 智能栅格化 (性能优化 + Hex ID)
function pptStep2_Rasterize(slides) {
    return __awaiter(this, void 0, void 0, function () {
        var count, generateHexId, isLineLike, traverse, _i, slides_2, slide;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = 0;
                    generateHexId = function () { return 'p_' + Math.random().toString(16).substring(2, 8); };
                    isLineLike = function (node) {
                        if (node.type === 'LINE')
                            return true;
                        if (node.type === 'VECTOR') {
                            if (node.width < 2 || node.height < 2)
                                return true;
                            var ratio = node.width / node.height;
                            if (ratio > 50 || ratio < 0.02)
                                return true;
                        }
                        return false;
                    };
                    traverse = function (node) { return __awaiter(_this, void 0, void 0, function () {
                        var name, isUserTarget, isTechTarget, bytes, image, rect, e_15, children, _i, children_3, child;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (node.removed || !node.visible)
                                        return [2 /*return*/];
                                    name = node.name.toLowerCase();
                                    isUserTarget = name.startsWith('p_img');
                                    isTechTarget = false;
                                    if ('effects' in node && node.effects.some(function (e) { return e.type === 'LAYER_BLUR' && e.visible; }))
                                        isTechTarget = true;
                                    else if (node.type === 'BOOLEAN_OPERATION')
                                        isTechTarget = true;
                                    else if (node.type === 'VECTOR' && !isLineLike(node))
                                        isTechTarget = true;
                                    else if (node.type === 'ELLIPSE' && 'fills' in node && node.fills.some(function (p) { return p.type === 'IMAGE'; }))
                                        isTechTarget = true;
                                    if (!(isUserTarget || isTechTarget)) return [3 /*break*/, 4];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 3 } })];
                                case 2:
                                    bytes = _b.sent();
                                    image = figma.createImage(bytes);
                                    rect = figma.createRectangle();
                                    rect.x = node.x;
                                    rect.y = node.y;
                                    rect.resize(node.width, node.height);
                                    // === 使用 Hex ID 重命名 ===
                                    rect.name = generateHexId();
                                    rect.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageHash: image.hash }];
                                    rect.rotation = node.rotation;
                                    (_a = node.parent) === null || _a === void 0 ? void 0 : _a.insertChild(node.parent.children.indexOf(node), rect);
                                    node.remove();
                                    count++;
                                    return [2 /*return*/];
                                case 3:
                                    e_15 = _b.sent();
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!('children' in node)) return [3 /*break*/, 8];
                                    children = __spreadArray([], node.children, true);
                                    _i = 0, children_3 = children;
                                    _b.label = 5;
                                case 5:
                                    if (!(_i < children_3.length)) return [3 /*break*/, 8];
                                    child = children_3[_i];
                                    return [4 /*yield*/, traverse(child)];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7:
                                    _i++;
                                    return [3 /*break*/, 5];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); };
                    _i = 0, slides_2 = slides;
                    _a.label = 1;
                case 1:
                    if (!(_i < slides_2.length)) return [3 /*break*/, 4];
                    slide = slides_2[_i];
                    return [4 /*yield*/, traverse(slide)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    figma.ui.postMessage({ type: 'step-done', step: 2 });
                    return [2 /*return*/];
            }
        });
    });
}
// Step 3: 深度扁平化 (修复混合属性导致的崩溃)
function pptStep3_Flatten(slides) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, slides_3, slide, hasNested, loopCount, children, i, node, rect, _a, _b, node, font, e_16;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, slides_3 = slides;
                    _c.label = 1;
                case 1:
                    if (!(_i < slides_3.length)) return [3 /*break*/, 13];
                    slide = slides_3[_i];
                    hasNested = true;
                    loopCount = 0;
                    _c.label = 2;
                case 2:
                    if (!hasNested) return [3 /*break*/, 5];
                    hasNested = false;
                    loopCount++;
                    if (!(loopCount % 100 === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 20); })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    children = slide.children;
                    // 倒序遍历
                    // 倒序遍历
                    for (i = children.length - 1; i >= 0; i--) {
                        node = children[i];
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
                                    rect = figma.createRectangle();
                                    rect.x = node.x;
                                    rect.y = node.y;
                                    rect.resize(node.width, node.height);
                                    // 复制样式
                                    if (node.fills !== figma.mixed)
                                        rect.fills = node.fills;
                                    if (node.strokes !== figma.mixed)
                                        rect.strokes = node.strokes;
                                    // 安全复制粗细
                                    if (node.strokeWeight !== figma.mixed)
                                        rect.strokeWeight = node.strokeWeight;
                                    else
                                        rect.strokeWeight = 0;
                                    // 安全复制圆角
                                    if (node.cornerRadius !== figma.mixed)
                                        rect.cornerRadius = node.cornerRadius;
                                    else
                                        rect.cornerRadius = 0;
                                    // 复制特效
                                    if (node.effects !== figma.mixed)
                                        rect.effects = node.effects;
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
                                }
                                else {
                                    node.remove(); // 空 Frame 删掉
                                }
                            }
                            catch (err) {
                                console.error("Layer flatten error:", err);
                                // 容错：出错了也尝试解开，防止死循环
                                if (node.children.length > 0) {
                                    figma.ungroup(node);
                                    hasNested = true;
                                }
                                else {
                                    node.remove();
                                }
                            }
                        }
                    }
                    return [3 /*break*/, 2];
                case 5:
                    _a = 0, _b = slide.children;
                    _c.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3 /*break*/, 12];
                    node = _b[_a];
                    if (!(node.type === 'TEXT' && node.visible)) return [3 /*break*/, 11];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 10, , 11]);
                    font = node.fontName;
                    if (!(font !== figma.mixed)) return [3 /*break*/, 9];
                    return [4 /*yield*/, figma.loadFontAsync(font)];
                case 8:
                    _c.sent();
                    node.textAutoResize = "HEIGHT";
                    node.resize(node.width + 10, node.height);
                    _c.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_16 = _c.sent();
                    return [3 /*break*/, 11];
                case 11:
                    _a++;
                    return [3 /*break*/, 6];
                case 12:
                    _i++;
                    return [3 /*break*/, 1];
                case 13:
                    figma.ui.postMessage({ type: 'step-done', step: 3 });
                    return [2 /*return*/];
            }
        });
    });
}
// Step 4: 提取结构 (高性能优化版：大批次 + 零丢弃)
function pptStep4_Extract(slides) {
    return __awaiter(this, void 0, void 0, function () {
        var rgbToHex, i, slide, slideAbs, slideX, slideY, chunkBuffer, children, j, node, nodeAbs, centerX, centerY, el, stroke, shadow, visibleFill, isLineLike, arrowCaps, baseSize, firstCharFont, lh, finalPx, style, isMultiLine, c, c, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rgbToHex = function (color) {
                        var toHex = function (v) {
                            var hex = Math.round(v * 255).toString(16);
                            return hex.length === 1 ? "0" + hex : hex;
                        };
                        return toHex(color.r) + toHex(color.g) + toHex(color.b);
                    };
                    // 通知前端总数
                    figma.ui.postMessage({ type: 'ppt-init-total', count: slides.length });
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < slides.length)) return [3 /*break*/, 11];
                    slide = slides[i];
                    // 强制休息，释放上一页内存
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                case 2:
                    // 强制休息，释放上一页内存
                    _a.sent();
                    slideAbs = slide.absoluteBoundingBox;
                    slideX = slideAbs ? slideAbs.x : slide.x;
                    slideY = slideAbs ? slideAbs.y : slide.y;
                    figma.ui.postMessage({
                        type: 'ppt-start-slide', index: i, width: slide.width, height: slide.height
                    });
                    chunkBuffer = [];
                    children = slide.children;
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < children.length)) return [3 /*break*/, 9];
                    node = children[j];
                    // 1. 基础过滤：只过滤不可见图层，保留所有尺寸的元素
                    if (!node.visible)
                        return [3 /*break*/, 8];
                    nodeAbs = node.absoluteBoundingBox;
                    if (!nodeAbs)
                        return [3 /*break*/, 8];
                    centerX = (nodeAbs.x + nodeAbs.width / 2) - slideX;
                    centerY = (nodeAbs.y + nodeAbs.height / 2) - slideY;
                    el = {
                        cx: centerX, cy: centerY, w: node.width, h: node.height, rotation: node.rotation
                    };
                    if ('opacity' in node)
                        el.opacity = node.opacity;
                    if ('cornerRadius' in node && node.cornerRadius !== figma.mixed)
                        el.cornerRadius = node.cornerRadius;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 7, , 8]);
                    // --- 样式提取 ---
                    if ('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0) {
                        stroke = node.strokes.find(function (s) { return s.type === 'SOLID' && s.visible !== false && s.opacity > 0; });
                        if (stroke) {
                            el.strokeColor = rgbToHex(stroke.color);
                            el.strokeWeight = node.strokeWeight;
                            el.strokeAlpha = (el.opacity || 1) * stroke.opacity;
                        }
                    }
                    if ('effects' in node && node.effects.length > 0) {
                        shadow = node.effects.find(function (e) { return e.type === 'DROP_SHADOW' && e.visible; });
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
                    visibleFill = null;
                    if ('fills' in node && node.fills !== figma.mixed && node.fills.length > 0) {
                        visibleFill = node.fills.find(function (f) { return f.type === 'SOLID' && f.visible !== false && f.opacity > 0; });
                    }
                    if (visibleFill) {
                        el.color = rgbToHex(visibleFill.color);
                        el.fillAlpha = (el.opacity || 1) * visibleFill.opacity;
                    }
                    else {
                        el.color = null;
                        el.fillAlpha = 0;
                    }
                    isLineLike = (node.type === 'LINE' || node.type === 'CONNECTOR');
                    if (isLineLike) {
                        el.type = 'line';
                        if ('dashPattern' in node && node.dashPattern.length > 0)
                            el.dashPattern = node.dashPattern;
                        arrowCaps = ['ARROW_LINES', 'ARROW_EQUILATERAL', 'TRIANGLE_FILLED', 'TRIANGLE_WIRED', 'DIAMOND_FILLED', 'CIRCLE_FILLED'];
                        if ('lineStartCap' in node && arrowCaps.includes(node.lineStartCap))
                            el.headArrow = 'triangle';
                        if ('lineEndCap' in node && arrowCaps.includes(node.lineEndCap))
                            el.tailArrow = 'triangle';
                        // 必须要有一条可见的描边，否则跳过
                        if (!el.strokeColor)
                            return [3 /*break*/, 8];
                        chunkBuffer.push(el);
                    }
                    // B. 文本
                    else if (node.type === 'TEXT') {
                        el.type = 'text';
                        el.text = node.characters.substring(0, 2000);
                        baseSize = 12;
                        if (node.fontSize !== figma.mixed) {
                            baseSize = node.fontSize;
                        }
                        else {
                            firstCharFont = node.getRangeFontSize(0, 1);
                            if (firstCharFont && firstCharFont !== figma.mixed)
                                baseSize = firstCharFont;
                        }
                        el.fontSize = baseSize;
                        lh = node.lineHeight;
                        if (lh === figma.mixed) {
                            // 如果混合，强制读取第一个字符的行高
                            lh = node.getRangeLineHeight(0, 1);
                        }
                        // 如果还是读不到(极罕见)，造一个默认值
                        if (!lh || lh === figma.mixed) {
                            lh = { unit: 'AUTO' };
                        }
                        finalPx = baseSize * 1.3;
                        if (lh.unit === 'PIXELS') {
                            finalPx = lh.value;
                        }
                        else if (lh.unit === 'PERCENT') {
                            finalPx = baseSize * (lh.value / 100);
                        }
                        // 存入变量
                        el.lineHeightPx = finalPx;
                        // 4. 其他属性
                        if (node.fontName !== figma.mixed) {
                            el.fontFace = node.fontName.family;
                            style = node.fontName.style.toLowerCase();
                            if (/bold|heavy|black|strong/.test(style))
                                el.isBold = true;
                        }
                        isMultiLine = node.characters.includes('\n');
                        // 如果没有换行符，但高度超过 1.5 倍字号，也视为多行（折行）
                        if (!isMultiLine && node.fontSize !== figma.mixed) {
                            if (node.height > node.fontSize * 1.5)
                                isMultiLine = true;
                        }
                        el.isMultiLine = isMultiLine;
                        // 5. 获取水平对齐 (Horizontal Align)
                        if (node.textAlignHorizontal === 'CENTER')
                            el.align = 'center';
                        else if (node.textAlignHorizontal === 'RIGHT')
                            el.align = 'right';
                        else if (node.textAlignHorizontal === 'JUSTIFIED')
                            el.align = 'justify';
                        else
                            el.align = 'left'; // 默认左对齐
                        // 6. (可选) 获取垂直对齐，虽然你的需求是强制覆盖，但获取一下也没坏处
                        if (node.textAlignVertical === 'CENTER')
                            el.vAlignFigma = 'middle';
                        else if (node.textAlignVertical === 'BOTTOM')
                            el.vAlignFigma = 'bottom';
                        else
                            el.vAlignFigma = 'top';
                        if (!visibleFill)
                            el.fillAlpha = el.opacity || 1;
                        chunkBuffer.push(el);
                    }
                    // C. 占位符 (图片)
                    else if (node.type === 'RECTANGLE' && node.fills !== figma.mixed && node.fills.length > 0 && node.fills.some(function (p) { return p.type === 'IMAGE' && p.visible !== false; })) {
                        el.type = 'placeholder';
                        // 直接使用图层名 (p_xxxxxx)
                        el.imageName = node.name;
                        el.fillAlpha = el.opacity || 1;
                        chunkBuffer.push(el);
                    }
                    // D. 形状 (矩形、圆、星形、多边形) - 排除 LINE/CONNECTOR
                    else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' ||
                        node.type === 'VECTOR' || node.type === 'STAR' ||
                        node.type === 'POLYGON' || node.type === 'BOOLEAN_OPERATION') {
                        el.type = 'shape';
                        el.pptShape = 'rect'; // 默认
                        if (node.type === 'ELLIPSE')
                            el.pptShape = 'ellipse';
                        else if (node.type === 'STAR') {
                            c = node.pointCount;
                            if (c >= 4 && c <= 32)
                                el.pptShape = 'star' + c;
                            else
                                el.pptShape = 'star5';
                        }
                        else if (node.type === 'POLYGON') {
                            c = node.pointCount;
                            if (c === 3)
                                el.pptShape = 'triangle';
                            else if (c === 5)
                                el.pptShape = 'pentagon';
                            else if (c === 6)
                                el.pptShape = 'hexagon';
                            else if (c === 8)
                                el.pptShape = 'octagon';
                        }
                        if (!el.color && !el.strokeColor)
                            return [3 /*break*/, 8];
                        chunkBuffer.push(el);
                    }
                    if (!(chunkBuffer.length >= 200)) return [3 /*break*/, 6];
                    figma.ui.postMessage({ type: 'ppt-element-batch', data: chunkBuffer });
                    chunkBuffer = [];
                    // 强制休息 15ms，让 UI 线程有机会渲染 Loading 动画
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 15); })];
                case 5:
                    // 强制休息 15ms，让 UI 线程有机会渲染 Loading 动画
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_5 = _a.sent();
                    return [3 /*break*/, 8];
                case 8:
                    j++;
                    return [3 /*break*/, 3];
                case 9:
                    if (chunkBuffer.length > 0) {
                        figma.ui.postMessage({ type: 'ppt-element-batch', data: chunkBuffer });
                    }
                    figma.ui.postMessage({ type: 'ppt-end-slide' });
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 1];
                case 11:
                    figma.ui.postMessage({ type: 'step-done', step: 4, data: { done: true } });
                    return [2 /*return*/];
            }
        });
    });
}
// Step 5: 导出资源 (Hex ID 版)
function pptStep5_ExportImages(slides) {
    return __awaiter(this, void 0, void 0, function () {
        var imgCount, i, slide, children, j, node, isTarget, bytes, fileName, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    figma.ui.postMessage({ type: 'ppt-asset-start', totalSlides: slides.length });
                    imgCount = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < slides.length)) return [3 /*break*/, 9];
                    slide = slides[i];
                    children = slide.children;
                    j = 0;
                    _a.label = 2;
                case 2:
                    if (!(j < children.length)) return [3 /*break*/, 8];
                    node = children[j];
                    if (!node.visible)
                        return [3 /*break*/, 7];
                    isTarget = false;
                    if ('effects' in node && node.effects.some(function (e) { return e.type === 'LAYER_BLUR' && e.visible; }))
                        isTarget = true;
                    if (!isTarget && node.type === 'RECTANGLE' && node.fills !== figma.mixed && node.fills.some(function (p) { return p.type === 'IMAGE'; }))
                        isTarget = true;
                    if (!isTarget) return [3 /*break*/, 7];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 50); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1.5 } })];
                case 5:
                    bytes = _a.sent();
                    fileName = "".concat(node.name, ".png");
                    figma.ui.postMessage({ type: 'ppt-asset-chunk', fileName: fileName, data: bytes });
                    imgCount++;
                    return [3 /*break*/, 7];
                case 6:
                    e_17 = _a.sent();
                    console.error(e_17);
                    return [3 /*break*/, 7];
                case 7:
                    j++;
                    return [3 /*break*/, 2];
                case 8:
                    i++;
                    return [3 /*break*/, 1];
                case 9:
                    figma.ui.postMessage({ type: 'step-done', step: 5, data: { count: imgCount } });
                    return [2 /*return*/];
            }
        });
    });
}
// 辅助：RGB 转 Hex
function rgbToHex(color) {
    var toHex = function (v) {
        var hex = Math.round(v * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return toHex(color.r) + toHex(color.g) + toHex(color.b);
}
// 判断节点是否“视觉不可见” (无有效填充且无有效描边，或全局隐藏/全透)
function isNodeInvisible(node) {
    // 1. 全局检查：被隐藏 或 透明度为0
    if ('visible' in node && !node.visible)
        return true;
    if ('opacity' in node && node.opacity === 0)
        return true;
    // 2. 文本特殊处理：无内容即不可见
    if (node.type === 'TEXT' && node.characters.trim().length === 0)
        return true;
    // 3. 样式检查：针对有 fills/strokes 的节点
    if ('fills' in node && 'strokes' in node) {
        // 有效填充：存在 + 可见 + 不透明
        var hasFill = node.fills !== figma.mixed &&
            node.fills.length > 0 &&
            node.fills.some(function (p) { return p.visible !== false && p.opacity > 0; });
        // 有效描边：存在 + 粗细>0 + 可见 + 不透明
        var hasStroke = node.strokes !== figma.mixed &&
            node.strokes.length > 0 &&
            node.strokeWeight > 0 &&
            node.strokes.some(function (p) { return p.visible !== false && p.opacity > 0; });
        // 如果既无有效填充，也无有效描边 -> 视为不可见 (忽略特效)
        if (!hasFill && !hasStroke)
            return true;
    }
    // 其他情况（如 Group/Frame/Slice）暂时视为可见，交给后续逻辑处理
    return false;
}
// 辅助：按视觉位置排序 (Z字形：先上后下，同行先左后右)
function sortNodesByVisualPosition(nodes) {
    return nodes.sort(function (a, b) {
        // 获取绝对坐标 (降级处理：如果没有绝对坐标，用相对坐标兜底)
        var aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
        var bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
        // 1. 先判断 Y 轴 (行)
        // 容差设为 50px，只要高度差在 50px 以内，视为同一行
        if (Math.abs(aAbs.y - bAbs.y) > 50) {
            return aAbs.y - bAbs.y; // 谁 y 小谁在上面
        }
        // 2. 同一行，判断 X 轴 (列)
        return aAbs.x - bAbs.x; // 谁 x 小谁在左边
    });
}
