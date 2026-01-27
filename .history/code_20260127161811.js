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
    var selection, _a, newSelection, _i, selection_1, node, frame, idx, children, _b, children_1, child, newSelection, _c, selection_2, node, r, idx, count, _d, selection_3, node, temp, _e, selection_4, node, img, asyncImg, size, t, pool, _f, pool_1, n, count_1, newSelection, _g, selection_5, node, frame, parent_1, index, newSel, _h, selection_6, node, lines, font, e_1, cy, _j, lines_1, l, t, tNodes, font, e_2, txt, nt, i, arr_1, arr_2, sel, targets_4, scan_1, count, _k, targets_1, node, h, pool, _l, pool_2, n, count_3, p_1, count_4, count_2, count, _m, selection_7, node, newX, newY, newW, newH, sel, f, pool, _o, selection_8, node, targets, _p, targets_2, node, _q, selection_9, node, results, _r, pool_3, node, match, n, q, t, ts, isType, isState, s, _s, _t, p, val, tgt, createdCount, conflicts, errors, localPaints, localTexts, localEffects, _loop_1, _u, selection_10, node, e_3, parts, sel, countFill_1, countStroke_1, countText_1, countEffect_1, paints, texts, effects, paintMap_1, effectMap_1, textMap_1, traverse_1, _v, sel_1, node, e_4, total, n1, n2, x1, y1, x2, y2, findText, replaceText, scope, count, textNodes_2, collect_1, _w, textNodes_1, node, font, e_5, pageName, slides, slides, slides, slides, slides, cfg_1, targets_5, scopeNodes, collectTargets_1, findRegex_1, escape_1, pat, results_1, checkString_1, _loop_2, _x, targets_3, node, items, count, _y, items_1, item, node, err_1, scope, findText_1, results_2, searchPool, traverse_2, node, cacheKey, font, cachedData, currentFills, highlightPaint, e_6, restoreCount, _z, _0, _1, _2, key, _3, nodeId, indexStr, index, data, node, font, e_7, tasks, replaceText, successCount, processedIds, groups_1, _4, _5, _6, _7, nodeId, node, groupTasks, _8, groupTasks_1, task, currentStr, err_2;
    var _this = this;
    return __generator(this, function (_9) {
        switch (_9.label) {
            case 0:
                console.log("【2】后端：收到了消息 ->", msg.type);
                selection = figma.currentPage.selection;
                _a = msg.type;
                switch (_a) {
                    case 'to-frame': return [3 /*break*/, 1];
                    case 'to-rect': return [3 /*break*/, 2];
                    case 'swap-fs': return [3 /*break*/, 3];
                    case 'reset-image': return [3 /*break*/, 4];
                    case 'select-text': return [3 /*break*/, 9];
                    case 'remove-al': return [3 /*break*/, 10];
                    case 'add-al-wrapper': return [3 /*break*/, 11];
                    case 'split-text': return [3 /*break*/, 12];
                    case 'join-text': return [3 /*break*/, 20];
                    case 'up-one': return [3 /*break*/, 25];
                    case 'up-all': return [3 /*break*/, 26];
                    case 'rename-content': return [3 /*break*/, 27];
                    case 'detach-all': return [3 /*break*/, 28];
                    case 'remove-hidden': return [3 /*break*/, 29];
                    case 'sort-layers': return [3 /*break*/, 30];
                    case 'ungroup-all': return [3 /*break*/, 31];
                    case 'unlock-all': return [3 /*break*/, 32];
                    case 'pixel-perfect': return [3 /*break*/, 33];
                    case 'fetch-selection-name': return [3 /*break*/, 34];
                    case 'find-and-select': return [3 /*break*/, 35];
                    case 'create-styles': return [3 /*break*/, 36];
                    case 'match-styles': return [3 /*break*/, 47];
                    case 'swap-positions': return [3 /*break*/, 58];
                    case 'find-replace': return [3 /*break*/, 59];
                    case 'ppt-step-1': return [3 /*break*/, 69];
                    case 'ppt-step-2': return [3 /*break*/, 71];
                    case 'ppt-step-3': return [3 /*break*/, 73];
                    case 'ppt-step-4': return [3 /*break*/, 75];
                    case 'ppt-step-5': return [3 /*break*/, 77];
                    case 'lint-variants': return [3 /*break*/, 79];
                    case 'fix-variants': return [3 /*break*/, 80];
                    case 'text-find-matches': return [3 /*break*/, 87];
                    case 'locate-node': return [3 /*break*/, 88];
                    case 'clear-all-highlights': return [3 /*break*/, 96];
                    case 'text-replace-batch': return [3 /*break*/, 105];
                    case 'resize-drag': return [3 /*break*/, 113];
                    case 'resize-window': return [3 /*break*/, 113];
                }
                return [3 /*break*/, 114];
            case 1:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 2;
            case 2:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 3;
            case 3:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 4;
            case 4:
                _e = 0, selection_4 = selection;
                _9.label = 5;
            case 5:
                if (!(_e < selection_4.length)) return [3 /*break*/, 8];
                node = selection_4[_e];
                if (!('fills' in node && Array.isArray(node.fills))) return [3 /*break*/, 7];
                img = node.fills.find(function (f) { return f.type === 'IMAGE'; });
                if (!(img && img.imageHash)) return [3 /*break*/, 7];
                asyncImg = figma.getImageByHash(img.imageHash);
                return [4 /*yield*/, asyncImg.getSizeAsync()];
            case 6:
                size = _9.sent();
                if (size && size.width)
                    node.resize(node.width, node.width * (size.height / size.width));
                _9.label = 7;
            case 7:
                _e++;
                return [3 /*break*/, 5];
            case 8: return [3 /*break*/, 114];
            case 9:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 10;
            case 10:
                {
                    count_1 = 0;
                    selection.forEach(rm);
                    figma.notify("\u79FB\u9664 ".concat(count_1, " \u4E2A\u81EA\u52A8\u5E03\u5C40"));
                    return [3 /*break*/, 114];
                }
                _9.label = 11;
            case 11:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 12;
            case 12:
                newSel = [];
                _h = 0, selection_6 = selection;
                _9.label = 13;
            case 13:
                if (!(_h < selection_6.length)) return [3 /*break*/, 19];
                node = selection_6[_h];
                if (node.type !== "TEXT")
                    return [3 /*break*/, 18];
                lines = node.characters.split(/\r\n|\r|\n/);
                if (lines.length <= 1)
                    return [3 /*break*/, 18];
                font = node.fontName;
                if (font === figma.mixed)
                    font = node.getRangeFontName(0, 1);
                _9.label = 14;
            case 14:
                _9.trys.push([14, 16, , 17]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 15:
                _9.sent();
                return [3 /*break*/, 17];
            case 16:
                e_1 = _9.sent();
                figma.notify("字体加载失败");
                return [3 /*break*/, 18];
            case 17:
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
                _9.label = 18;
            case 18:
                _h++;
                return [3 /*break*/, 13];
            case 19:
                if (newSel.length > 0)
                    figma.currentPage.selection = newSel;
                return [3 /*break*/, 114];
            case 20:
                tNodes = selection.filter(function (n) { return n.type === 'TEXT'; }).sort(function (a, b) { return Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x; });
                if (tNodes.length < 2) {
                    figma.notify("请选2个以上文本");
                    return [2 /*return*/];
                }
                font = tNodes[0].fontName;
                if (font === figma.mixed)
                    font = tNodes[0].getRangeFontName(0, 1);
                _9.label = 21;
            case 21:
                _9.trys.push([21, 23, , 24]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 22:
                _9.sent();
                return [3 /*break*/, 24];
            case 23:
                e_2 = _9.sent();
                figma.notify("字体加载失败");
                return [2 /*return*/];
            case 24:
                txt = tNodes.map(function (n) { return n.characters; }).join('\n');
                nt = tNodes[0].clone();
                nt.characters = txt;
                nt.textAutoResize = 'HEIGHT';
                for (i = 1; i < tNodes.length; i++)
                    tNodes[i].remove();
                figma.currentPage.selection = [nt];
                return [3 /*break*/, 114];
            case 25:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 26;
            case 26:
                {
                    arr_2 = [];
                    selection.forEach(function (n) {
                        figma.currentPage.appendChild(n);
                        arr_2.push(n);
                    });
                    figma.currentPage.selection = arr_2;
                    return [3 /*break*/, 114];
                }
                _9.label = 27;
            case 27:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 28;
            case 28:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length === 0) {
                        figma.notify("请先选中图层");
                        return [2 /*return*/];
                    }
                    targets_4 = [];
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
                            targets_4.push(n);
                        }
                    };
                    // 开始扫描
                    sel.forEach(scan_1);
                    if (targets_4.length === 0) {
                        figma.notify("未找到可解绑的实例");
                        return [2 /*return*/];
                    }
                    count = 0;
                    // 按顺序解绑 (因为已经是“从内到外”的顺序，所以直接执行即可)
                    for (_k = 0, targets_1 = targets_4; _k < targets_1.length; _k++) {
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
                    return [3 /*break*/, 114];
                }
                _9.label = 29;
            case 29:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 30;
            case 30:
                {
                    if (selection.length > 1) {
                        p_1 = selection[0].parent;
                        if (selection.every(function (n) { return n.parent === p_1; })) {
                            __spreadArray([], selection, true).sort(function (a, b) { return Math.abs(a.y - b.y) > 2 ? a.y - b.y : a.x - b.x; }).forEach(function (n) { return p_1.appendChild(n); });
                            figma.notify("图层已排序");
                        }
                    }
                    return [3 /*break*/, 114];
                }
                _9.label = 31;
            case 31:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 32;
            case 32:
                {
                    count_2 = 0;
                    selection.forEach(ul);
                    figma.notify("\u5DF2\u89E3\u9501 ".concat(count_2, " \u4E2A\u56FE\u5C42"));
                    return [3 /*break*/, 114];
                }
                _9.label = 33;
            case 33:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 34;
            case 34:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length > 0) {
                        //以此发回给 UI，取第一个选中项的名称
                        figma.ui.postMessage({ type: 'update-name-input', name: sel[0].name });
                    }
                    else {
                        figma.notify("请先选择一个图层以获取名称");
                    }
                    return [3 /*break*/, 114];
                }
                _9.label = 35;
            case 35:
                {
                    f = msg.filters;
                    pool = [];
                    if (f.scope === 'inside') {
                        if (selection.length === 0) {
                            figma.notify("请先选择一个容器");
                            return [2 /*return*/];
                        }
                        for (_o = 0, selection_8 = selection; _o < selection_8.length; _o++) {
                            node = selection_8[_o];
                            if ('findAll' in node)
                                pool = pool.concat(node.findAll(function (n) { return true; }));
                        }
                    }
                    else if (f.scope === 'descendants') {
                        targets = selection.length > 0 ? selection : [figma.currentPage];
                        for (_p = 0, targets_2 = targets; _p < targets_2.length; _p++) {
                            node = targets_2[_p];
                            if ('findAll' in node)
                                pool = pool.concat(node.findAll(function (n) { return true; }));
                        }
                    }
                    else if (f.scope === 'sibling') {
                        if (selection.length > 0)
                            pool = selection[0].parent.children.filter(function (n) { return !selection.includes(n); });
                    }
                    else if (f.scope === 'children') {
                        for (_q = 0, selection_9 = selection; _q < selection_9.length; _q++) {
                            node = selection_9[_q];
                            if ('children' in node)
                                pool = pool.concat(node.children);
                        }
                    }
                    results = [];
                    for (_r = 0, pool_3 = pool; _r < pool_3.length; _r++) {
                        node = pool_3[_r];
                        match = true;
                        // Name
                        if (f.name.val) {
                            n = node.name;
                            q = f.name.val;
                            if (!f.name.caseSensitive) {
                                n = n.toLowerCase();
                                q = q.toLowerCase();
                            }
                            if (!n.includes(q))
                                match = false;
                        }
                        // Type (扩充版)
                        if (match && f.types.vals.length > 0) {
                            t = node.type;
                            ts = f.types.vals;
                            isType = ts.includes(t); // 默认直接匹配类型字符串
                            
                            // 特殊类型判断
                            if (ts.includes('AUTOLAYOUT') && t === 'FRAME' && node.layoutMode !== 'NONE') isType = true;
                            if (ts.includes('IMAGE') && 'fills' in node && Array.isArray(node.fills) && node.fills.some(f => f.type === 'IMAGE')) isType = true;
                            
                            // 逻辑判断
                            if (f.types.logic === 'include') {
                                if (!isType) match = false;
                            } else {
                                if (isType) match = false;
                            }
                        }

                        // State (扩充版)
                        if (match && f.states.vals.length > 0) {
                            isState = false;
                            s = f.states.vals;
                            
                            if (s.includes('hidden') && !node.visible) isState = true;
                            if (s.includes('locked') && node.locked) isState = true;
                            // 新增：Mask
                            if (s.includes('mask') && node.isMask) isState = true;
                            // 新增：Export (检查 exportSettings 数组是否有内容)
                            if (s.includes('export') && node.exportSettings && node.exportSettings.length > 0) isState = true;
                            
                            if (s.includes('no-fill') && 'fills' in node && node.fills.length === 0) isState = true;
                            if (s.includes('no-stroke') && 'strokes' in node && node.strokes.length === 0) isState = true;
                            if (s.includes('no-children') && 'children' in node && node.children.length === 0) isState = true;
                            if (s.includes('clip') && 'clipsContent' in node && node.clipsContent) isState = true;

                            if (f.states.logic === 'include') {
                                if (!isState) match = false;
                            } else {
                                if (isState) match = false;
                            }
                        }
                        // Props
                        if (match && f.props.length > 0) {
                            for (_s = 0, _t = f.props; _s < _t.length; _s++) {
                                p = _t[_s];
                                val = 0;
                                if (p.key === 'width')
                                    val = node.width;
                                else if (p.key === 'height')
                                    val = node.height;
                                else if (p.key === 'x')
                                    val = node.x;
                                else if (p.key === 'y')
                                    val = node.y;
                                else if (p.key === 'opacity' && 'opacity' in node)
                                    val = node.opacity;
                                tgt = p.val;
                                if (p.op === '=') {
                                    if (Math.abs(val - tgt) > 0.1)
                                        match = false;
                                }
                                else if (p.op === '>') {
                                    if (val <= tgt)
                                        match = false;
                                }
                                else if (p.op === '<') {
                                    if (val >= tgt)
                                        match = false;
                                }
                            }
                        }
                        if (match)
                            results.push(node);
                    }
                    if (results.length > 0) {
                        figma.currentPage.selection = results;
                        figma.notify("\u9009\u4E2D ".concat(results.length, " \u4E2A"));
                    }
                    else {
                        figma.notify("未找到");
                    }
                    return [3 /*break*/, 114];
                }
                _9.label = 36;
            case 36:
                console.log("=== 开始执行创建样式 (Async模式) ===");
                if (selection.length === 0) {
                    figma.notify("请选择图层");
                    return [2 /*return*/];
                }
                createdCount = 0;
                conflicts = [];
                errors = [];
                _9.label = 37;
            case 37:
                _9.trys.push([37, 45, , 46]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 38:
                localPaints = _9.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 39:
                localTexts = _9.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 40:
                localEffects = _9.sent();
                _loop_1 = function (node) {
                    var name_1, exist, style, exist, style, font, err_3, exist, style;
                    return __generator(this, function (_10) {
                        switch (_10.label) {
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
                                _10.trys.push([1, 4, , 5]);
                                style = figma.createTextStyle();
                                style.name = name_1;
                                font = node.fontName;
                                if (!(font !== figma.mixed)) return [3 /*break*/, 3];
                                return [4 /*yield*/, figma.loadFontAsync(font)];
                            case 2:
                                _10.sent();
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
                                _10.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                err_3 = _10.sent();
                                errors.push(name_1);
                                console.error("文本创建失败:", err_3);
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
                _u = 0, selection_10 = selection;
                _9.label = 41;
            case 41:
                if (!(_u < selection_10.length)) return [3 /*break*/, 44];
                node = selection_10[_u];
                return [5 /*yield**/, _loop_1(node)];
            case 42:
                _9.sent();
                _9.label = 43;
            case 43:
                _u++;
                return [3 /*break*/, 41];
            case 44: return [3 /*break*/, 46];
            case 45:
                e_3 = _9.sent();
                console.error("全局错误:", e_3);
                figma.notify("发生错误，请查看控制台");
                return [3 /*break*/, 46];
            case 46:
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
                return [3 /*break*/, 114];
            case 47:
                console.log("=== 开始匹配样式 (Async修复版) ===");
                sel = figma.currentPage.selection;
                if (sel.length === 0) {
                    figma.notify("请先选择范围 (支持包含子图层)");
                    return [2 /*return*/];
                }
                countFill_1 = 0, countStroke_1 = 0, countText_1 = 0, countEffect_1 = 0;
                _9.label = 48;
            case 48:
                _9.trys.push([48, 56, , 57]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 49:
                paints = _9.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 50:
                texts = _9.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 51:
                effects = _9.sent();
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
                traverse_1 = function (node) { return __awaiter(_this, void 0, void 0, function () {
                    var key, e_8, key, e_9, key, e_10, key, e_11, _i, _a, child;
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
                                e_8 = _b.sent();
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
                                e_9 = _b.sent();
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
                                e_10 = _b.sent();
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
                                e_11 = _b.sent();
                                return [3 /*break*/, 16];
                            case 16:
                                if (!('children' in node)) return [3 /*break*/, 20];
                                _i = 0, _a = node.children;
                                _b.label = 17;
                            case 17:
                                if (!(_i < _a.length)) return [3 /*break*/, 20];
                                child = _a[_i];
                                return [4 /*yield*/, traverse_1(child)];
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
                _v = 0, sel_1 = sel;
                _9.label = 52;
            case 52:
                if (!(_v < sel_1.length)) return [3 /*break*/, 55];
                node = sel_1[_v];
                return [4 /*yield*/, traverse_1(node)];
            case 53:
                _9.sent();
                _9.label = 54;
            case 54:
                _v++;
                return [3 /*break*/, 52];
            case 55: return [3 /*break*/, 57];
            case 56:
                e_4 = _9.sent();
                console.error("匹配过程出错:", e_4);
                figma.notify("匹配出错，请检查控制台");
                return [2 /*return*/];
            case 57:
                total = countFill_1 + countStroke_1 + countText_1 + countEffect_1;
                if (total > 0) {
                    figma.notify("\u5339\u914D\u6210\u529F: \u586B\u5145".concat(countFill_1, " / \u63CF\u8FB9").concat(countStroke_1, " / \u6587\u672C").concat(countText_1, " / \u6548\u679C").concat(countEffect_1));
                }
                else {
                    figma.notify("未发现可匹配的样式");
                }
                return [3 /*break*/, 114];
            case 58:
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
                    return [3 /*break*/, 114];
                }
                _9.label = 59;
            case 59:
                findText = msg.findText, replaceText = msg.replaceText;
                if (!findText) {
                    figma.notify("请输入查找内容，注意区分大小写");
                    return [2 /*return*/];
                }
                scope = selection.length > 0 ? selection : [figma.currentPage];
                count = 0;
                textNodes_2 = [];
                collect_1 = function (n) {
                    if (n.type === 'TEXT')
                        textNodes_2.push(n);
                    if ('children' in n)
                        n.children.forEach(collect_1);
                };
                scope.forEach(collect_1);
                if (textNodes_2.length === 0) {
                    figma.notify("范围内没有文本");
                    return [2 /*return*/];
                }
                _w = 0, textNodes_1 = textNodes_2;
                _9.label = 60;
            case 60:
                if (!(_w < textNodes_1.length)) return [3 /*break*/, 68];
                node = textNodes_1[_w];
                if (!node.characters.includes(findText)) return [3 /*break*/, 67];
                _9.label = 61;
            case 61:
                _9.trys.push([61, 66, , 67]);
                font = node.fontName;
                if (!(font === figma.mixed)) return [3 /*break*/, 63];
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                return [4 /*yield*/, figma.loadFontAsync(node.getRangeFontName(0, 1))];
            case 62:
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                _9.sent();
                return [3 /*break*/, 65];
            case 63: return [4 /*yield*/, figma.loadFontAsync(font)];
            case 64:
                _9.sent();
                _9.label = 65;
            case 65:
                // 执行替换
                node.characters = node.characters.split(findText).join(replaceText);
                count++;
                return [3 /*break*/, 67];
            case 66:
                e_5 = _9.sent();
                console.error("字体加载失败或替换出错", e_5);
                return [3 /*break*/, 67];
            case 67:
                _w++;
                return [3 /*break*/, 60];
            case 68:
                if (count > 0)
                    figma.notify("\u5DF2\u66FF\u6362 ".concat(count, " \u5904\u6587\u672C"));
                else
                    figma.notify("未找到匹配内容");
                return [3 /*break*/, 114];
            case 69:
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
            case 70:
                // 执行 Step 1 函数
                _9.sent();
                return [3 /*break*/, 114];
            case 71:
                slides = getSlides();
                return [4 /*yield*/, pptStep2_Rasterize(slides)];
            case 72:
                _9.sent();
                return [3 /*break*/, 114];
            case 73:
                slides = getSlides();
                return [4 /*yield*/, pptStep3_Flatten(slides)];
            case 74:
                _9.sent();
                return [3 /*break*/, 114];
            case 75:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 ===
                slides = sortNodesByVisualPosition(slides);
                // 函数内部会发送 step-done，这里不需要再发了
                return [4 /*yield*/, pptStep4_Extract(slides)];
            case 76:
                // 函数内部会发送 step-done，这里不需要再发了
                _9.sent();
                return [3 /*break*/, 114];
            case 77:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 (保持顺序一致) ===
                slides = sortNodesByVisualPosition(slides);
                // 同上，内部已发消息
                return [4 /*yield*/, pptStep5_ExportImages(slides)];
            case 78:
                // 同上，内部已发消息
                _9.sent();
                return [3 /*break*/, 114];
            case 79:
                {
                    console.log("【3】后端：进入严格分类逻辑...");
                    cfg_1 = msg.config || msg;
                    targets_5 = [];
                    scopeNodes = [];
                    if (cfg_1.scope === 'page') {
                        scopeNodes = figma.currentPage.children;
                    }
                    else {
                        scopeNodes = figma.currentPage.selection;
                    }
                    collectTargets_1 = function (nodes) {
                        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                            var node = nodes_1[_i];
                            if (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') {
                                targets_5.push(node);
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
                            // --- 情况 A: 组件集 (Component Set) ---
                            if (node.type === 'COMPONENT_SET') {
                                var res = checkString_1(node.name);
                                if (res.changed) {
                                    results_1.push({
                                        id: node.id, compId: node.id, compName: node.name,
                                        // 🔥 1. 明确标记类型
                                        type: 'COMPONENT_SET',
                                        targetType: 'CompName', // 🏷️ 组件名
                                        propName: 'Name', oldVal: node.name, newVal: res.val
                                    });
                                }
                            }
                            // --- 情况 B: 组件 (Component) ---
                            else if (node.type === 'COMPONENT') {
                                var isVariant = node.parent && node.parent.type === 'COMPONENT_SET';
                                var compId_1 = isVariant ? node.parent.id : node.id;
                                var CompName_1 = isVariant ? node.parent.name : node.name;
                                // 🔥 2. 动态决定分组的类型图标
                                // 如果是变体，它属于组件集(COMPONENT_SET)；如果是独立组件，它就是 COMPONENT
                                var groupType_1 = isVariant ? 'COMPONENT_SET' : 'COMPONENT';
                                // 🔥 关键分流：如果是变体，走下面的逻辑；如果不是，走上面的逻辑。
                                if (!isVariant) {
                                    // === B1. 独立组件 (非变体) ===
                                    // 只有这里才检查 node.name
                                    var res = checkString_1(node.name);
                                    if (res.changed) {
                                        results_1.push({
                                            id: node.id, compId: compId_1, compName: CompName_1,
                                            // 🔥 1. 明确标记类型
                                            type: groupType_1,
                                            targetType: 'CompName', // 🏷️ 组件名
                                            propName: 'Name', oldVal: node.name, newVal: res.val
                                        });
                                    }
                                }
                                else {
                                    // === B2. 变体 (Variant) ===
                                    // 🔥 绝对不要检查 node.name (因为那是整个属性串)
                                    // 而是拆解后检查 Key 和 Value
                                    var rawProps = node.name.split(',').map(function (p) { return p.trim(); });
                                    var newProps_1 = [];
                                    var hasAnyChange_1 = false;
                                    rawProps.forEach(function (pair) {
                                        var parts = pair.split('=');
                                        // 容错：如果没等号，就不处理
                                        if (parts.length < 2) {
                                            newProps_1.push(pair);
                                            return;
                                        }
                                        var key = parts[0].trim(); // 属性名
                                        var val = parts[1].trim(); // 属性值
                                        // 2.1 检查属性名 (Key)
                                        var resKey = checkString_1(key);
                                        if (resKey.changed) {
                                            results_1.push({
                                                id: node.id, compId: compId_1, compName: CompName_1,
                                                // 🔥 1. 明确标记类型
                                                type: groupType_1,
                                                targetType: 'PropName', // 🏷️ 属性名
                                                propName: 'Property',
                                                oldVal: key, newVal: resKey.val
                                            });
                                            hasAnyChange_1 = true;
                                        }
                                        // 2.2 检查属性值 (Value)
                                        var resVal = checkString_1(val);
                                        if (resVal.changed) {
                                            console.log("【调试】准备推入属性值，key是：", key);
                                            results_1.push({
                                                id: node.id, compId: compId_1, compName: CompName_1,
                                                // 🔥 1. 明确标记类型
                                                type: groupType_1,
                                                targetType: 'PropValue', // 🏷️ 属性值
                                                propName: key,
                                                oldVal: val, newVal: resVal.val
                                            });
                                            hasAnyChange_1 = true;
                                        }
                                        // 拼装修复用的全名
                                        var finalKey = resKey.changed ? resKey.val : key;
                                        var finalVal = resVal.changed ? resVal.val : val;
                                        newProps_1.push("".concat(finalKey, "=").concat(finalVal));
                                    });
                                    // 如果有改动，需要把完整的变体字符串存下来，用于修复
                                    if (hasAnyChange_1) {
                                        var fullNewName = newProps_1.join(', ');
                                        // 倒序查找刚刚 push 进去的记录，给它们补上 fullResult
                                        // 这样前端点修复时，知道怎么改整个节点
                                        for (var k = results_1.length - 1; k >= 0; k--) {
                                            if (results_1[k].id === node.id) {
                                                // 防止覆盖：如果已经有了就不加了（其实都一样）
                                                if (!results_1[k].fullResult)
                                                    results_1[k].fullResult = fullNewName;
                                            }
                                            else {
                                                break; // 已经过了当前节点的记录区域
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
                    // 2. 遍历处理
                    for (_x = 0, targets_3 = targets_5; _x < targets_3.length; _x++) {
                        node = targets_3[_x];
                        _loop_2(node);
                    }
                    figma.ui.postMessage({ type: 'lint-results', data: results_1 });
                    return [3 /*break*/, 114];
                }
                _9.label = 80;
            case 80:
                items = msg.items;
                count = 0;
                _y = 0, items_1 = items;
                _9.label = 81;
            case 81:
                if (!(_y < items_1.length)) return [3 /*break*/, 86];
                item = items_1[_y];
                _9.label = 82;
            case 82:
                _9.trys.push([82, 84, , 85]);
                return [4 /*yield*/, figma.getNodeByIdAsync(item.id)];
            case 83:
                node = _9.sent();
                if (node) {
                    node.name = item.fullResult || item.newVal;
                    count++;
                }
                return [3 /*break*/, 85];
            case 84:
                err_1 = _9.sent();
                return [3 /*break*/, 85];
            case 85:
                _y++;
                return [3 /*break*/, 81];
            case 86:
                figma.notify("\u2728 \u5DF2\u6210\u529F\u4FEE\u590D ".concat(count, " \u9879\u547D\u540D"));
                return [3 /*break*/, 114];
            case 87:
                {
                    scope = msg.scope, findText_1 = msg.findText;
                    results_2 = [];
                    searchPool = [];
                    if (scope === 'selection') {
                        searchPool = figma.currentPage.selection;
                    }
                    else {
                        searchPool = [figma.currentPage];
                    }
                    if (searchPool.length === 0 && scope === 'selection') {
                        figma.notify("请先选择图层");
                        return [2 /*return*/];
                    }
                    traverse_2 = function (node) {
                        if (node.type === 'TEXT') {
                            var fullText = node.characters;
                            // 使用正则全局匹配，获取所有出现的位置
                            // 自动转义正则特殊字符
                            var escapedFindText = findText_1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            var regex = new RegExp(escapedFindText, 'gi');
                            var match = void 0;
                            while ((match = regex.exec(fullText)) !== null) {
                                results_2.push({
                                    id: node.id, // 图层ID
                                    fullText: fullText, // 完整文本（用于预览）
                                    index: match.index, // 🌟 关键：匹配的起始位置
                                    length: match[0].length, // 匹配长度
                                    matchText: match[0] // 实际匹配到的文本（保留原大小写）
                                });
                            }
                        }
                        if ('children' in node) {
                            node.children.forEach(traverse_2);
                        }
                    };
                    searchPool.forEach(traverse_2);
                    figma.ui.postMessage({ type: 'text-find-results', data: results_2 });
                    if (results_2.length === 0) {
                        figma.notify("未找到匹配文本");
                    }
                    return [3 /*break*/, 114];
                }
                _9.label = 88;
            case 88:
                _9.trys.push([88, 94, , 95]);
                return [4 /*yield*/, figma.getNodeByIdAsync(msg.id)];
            case 89:
                node = _9.sent();
                if (!node) return [3 /*break*/, 92];
                // === 第一步：通用操作 (先选中并聚焦) ===
                // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                figma.currentPage.selection = [node];
                figma.viewport.scrollAndZoomIntoView([node]);
                if (!(node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number')) return [3 /*break*/, 91];
                cacheKey = "".concat(msg.id, "_").concat(msg.index);
                font = node.fontName === figma.mixed
                    ? node.getRangeFontName(0, 1)
                    : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 90:
                _9.sent();
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
                _9.label = 91;
            case 91: return [3 /*break*/, 93];
            case 92:
                figma.notify("图层不存在 (可能已被删除)");
                _9.label = 93;
            case 93: return [3 /*break*/, 95];
            case 94:
                e_6 = _9.sent();
                console.error("定位失败:", e_6);
                return [3 /*break*/, 95];
            case 95: return [3 /*break*/, 114];
            case 96:
                restoreCount = 0;
                _z = highlightCache;
                _0 = [];
                for (_1 in _z)
                    _0.push(_1);
                _2 = 0;
                _9.label = 97;
            case 97:
                if (!(_2 < _0.length)) return [3 /*break*/, 104];
                _1 = _0[_2];
                if (!(_1 in _z)) return [3 /*break*/, 103];
                key = _1;
                _3 = key.split('_'), nodeId = _3[0], indexStr = _3[1];
                index = parseInt(indexStr);
                data = highlightCache[key];
                _9.label = 98;
            case 98:
                _9.trys.push([98, 102, , 103]);
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 99:
                node = _9.sent();
                if (!(node && node.type === 'TEXT')) return [3 /*break*/, 101];
                font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 100:
                _9.sent();
                // 这里的长度我们只能估算，或者在存储时也存长度。
                // 为了简便，我们假设还没被替换。如果被替换了，ID可能都变了或内容变了，这里做个容错。
                // 更好的做法是在 Cache 里存 Length。
                // 补救：我们在前端传过来的 locate 里有 length，但在全局清除时拿不到。
                // 修正策略：Cache Value 改存 { fills: [], length: number }
                // 由于上面我们只存了 fills，这里为了稳健，我们简单略过长度问题，
                // 或者：修改上面的 cache 存储结构 (推荐)。
                // 但为了不改动太大，我们只在这里做 best effort 还原，
                // 如果你在 locate-node 里存对象会更好: highlightCache[key] = { fills: currentFills, length: msg.length }
                node.setRangeFills(index, index + data.length, data.fills);
                count++;
                _9.label = 101;
            case 101: return [3 /*break*/, 103];
            case 102:
                e_7 = _9.sent();
                console.log("还原失败", e_7);
                return [3 /*break*/, 103];
            case 103:
                _2++;
                return [3 /*break*/, 97];
            case 104:
                // 由于全局清除比较复杂（涉及重新加载字体），
                // 建议：全局清除只清除缓存变量，并提示用户用 Ctrl+Z，
                // 或者强制重置页面（不推荐）。
                // 🔥 最佳实践：我们刚才修改了 locate-node 为 Toggle 模式，
                // 用户其实可以通过再次点击行来还原。
                // "一键清除" 可以在这里实现，但需要更完善的 Cache 结构。
                // 下面是【修正版】locate-node 存储结构，请务必配合使用：
                highlightCache = {}; // 清空池子
                figma.notify("\u5DF2\u8FD8\u539F ".concat(count, " \u5904\u9AD8\u4EAE"));
                // 通知前端清除所有高亮样式
                figma.ui.postMessage({ type: 'clear-all-highlights-ui' });
                return [3 /*break*/, 114];
            case 105:
                tasks = msg.tasks, replaceText = msg.replaceText;
                successCount = 0;
                processedIds = new Set();
                groups_1 = {};
                tasks.forEach(function (task) {
                    if (!groups_1[task.id])
                        groups_1[task.id] = [];
                    groups_1[task.id].push(task);
                });
                _4 = groups_1;
                _5 = [];
                for (_6 in _4)
                    _5.push(_6);
                _7 = 0;
                _9.label = 106;
            case 106:
                if (!(_7 < _5.length)) return [3 /*break*/, 112];
                _6 = _5[_7];
                if (!(_6 in _4)) return [3 /*break*/, 111];
                nodeId = _6;
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 107:
                node = _9.sent();
                if (!node || node.type !== 'TEXT')
                    return [3 /*break*/, 111];
                groupTasks = groups_1[nodeId];
                // 🌟 倒序排序
                groupTasks.sort(function (a, b) { return b.index - a.index; });
                _9.label = 108;
            case 108:
                _9.trys.push([108, 110, , 111]);
                // 加载字体
                return [4 /*yield*/, figma.loadFontAsync(node.fontName === figma.mixed
                        ? node.getRangeFontName(0, 1)
                        : node.fontName)];
            case 109:
                // 加载字体
                _9.sent();
                // 执行替换
                for (_8 = 0, groupTasks_1 = groupTasks; _8 < groupTasks_1.length; _8++) {
                    task = groupTasks_1[_8];
                    currentStr = node.characters.substring(task.index, task.index + task.length);
                    // 简单的校验，略过严格校验以允许大小写差异
                    node.deleteCharacters(task.index, task.index + task.length);
                    node.insertCharacters(task.index, replaceText);
                    successCount++;
                    // 记录前端传来的唯一标识 (uid)，以便前端禁用
                    if (task.uid)
                        processedIds.add(task.uid);
                }
                return [3 /*break*/, 111];
            case 110:
                err_2 = _9.sent();
                console.error("\u66FF\u6362\u5931\u8D25 ".concat(nodeId, ":"), err_2);
                return [3 /*break*/, 111];
            case 111:
                _7++;
                return [3 /*break*/, 106];
            case 112:
                // 通知前端哪些任务完成了
                figma.ui.postMessage({
                    type: 'text-replace-success',
                    count: successCount,
                    processedUids: Array.from(processedIds)
                });
                figma.notify("\u5DF2\u66FF\u6362 ".concat(successCount, " \u5904\u6587\u672C"));
                return [3 /*break*/, 114];
            case 113:
                figma.ui.resize(msg.width, msg.height);
                return [3 /*break*/, 114];
            case 114: return [2 /*return*/];
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
    for (var _i = 0, selection_11 = selection; _i < selection_11.length; _i++) {
        var node = selection_11[_i];
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
                        var name, isUserTarget, isTechTarget, bytes, image, rect, e_12, children, _i, children_3, child;
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
                                    e_12 = _b.sent();
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
        var _i, slides_3, slide, hasNested, loopCount, children, i, node, rect, _a, _b, node, font, e_13;
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
                    e_13 = _c.sent();
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
        var rgbToHex, i, slide, slideAbs, slideX, slideY, chunkBuffer, children, j, node, nodeAbs, centerX, centerY, el, stroke, shadow, visibleFill, style, isMultiLine, err_4;
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
                    // --- 类型分类 ---
                    // A. 直线
                    if (node.type === 'LINE') {
                        el.type = 'line';
                        if ('dashPattern' in node && node.dashPattern.length > 0 && node.dashPattern[0] > 0) {
                            el.dashPattern = node.dashPattern;
                        }
                        if (node.lineEndCap === 'ARROW_LINES' || node.lineEndCap === 'ARROW_EQUILATERAL')
                            el.tailArrow = 'arrow';
                        if (node.lineStartCap === 'ARROW_LINES' || node.lineStartCap === 'ARROW_EQUILATERAL')
                            el.headArrow = 'arrow';
                        if (!el.strokeColor)
                            return [3 /*break*/, 8]; // 无色直线跳过
                        chunkBuffer.push(el);
                    }
                    // B. 文本
                    else if (node.type === 'TEXT') {
                        el.type = 'text';
                        el.text = node.characters.substring(0, 2000); // 稍微放宽限制
                        if (node.fontName !== figma.mixed) {
                            el.fontFace = node.fontName.family;
                            style = node.fontName.style.toLowerCase();
                            if (/bold|heavy|black|strong/.test(style))
                                el.isBold = true;
                        }
                        if (node.fontSize !== figma.mixed)
                            el.fontSize = node.fontSize;
                        if (node.lineHeight !== figma.mixed && node.lineHeight.unit === 'PIXELS' && node.fontSize !== figma.mixed) {
                            el.lineSpacing = node.lineHeight.value / node.fontSize;
                        }
                        isMultiLine = node.characters.includes('\n');
                        if (!isMultiLine && node.fontSize !== figma.mixed) {
                            if (node.height > node.fontSize * 1.5)
                                isMultiLine = true;
                        }
                        el.valign = isMultiLine ? 'top' : 'middle';
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
                    // D. 形状 (包含所有矢量)
                    else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' ||
                        node.type === 'VECTOR' || node.type === 'STAR' ||
                        node.type === 'POLYGON' || node.type === 'BOOLEAN_OPERATION') {
                        el.type = 'rect';
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
                    err_4 = _a.sent();
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
        var imgCount, i, slide, children, j, node, isTarget, bytes, fileName, e_14;
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
                    e_14 = _a.sent();
                    console.error(e_14);
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
