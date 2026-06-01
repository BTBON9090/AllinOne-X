var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var layerSortDirection = 'asc'; // 用于图层排序切换，默认从上到下
var trySet = function (dst, propName, value) {
    try {
        dst[propName] = value;
    }
    catch (e) { }
};
function copyNodeStyles(src, dst) {
    dst.opacity = src.opacity;
    trySet(dst, 'blendMode', src.blendMode);
    dst.visible = src.visible;
    trySet(dst, 'locked', src.locked);
    trySet(dst, 'rotation', src.rotation);
    trySet(dst, 'constraints', src.constraints);
    if ('fills' in src && src.fills !== figma.mixed && Array.isArray(src.fills)) {
        trySet(dst, 'fills', JSON.parse(JSON.stringify(src.fills)));
    }
    if ('fillStyleId' in src && typeof src.fillStyleId === 'string') {
        trySet(dst, 'fillStyleId', src.fillStyleId);
    }
    if ('strokes' in src && src.strokes !== figma.mixed && Array.isArray(src.strokes)) {
        trySet(dst, 'strokes', JSON.parse(JSON.stringify(src.strokes)));
    }
    if ('strokeStyleId' in src && typeof src.strokeStyleId === 'string') {
        trySet(dst, 'strokeStyleId', src.strokeStyleId);
    }
    if ('strokeWeight' in src && typeof src.strokeWeight === 'number') {
        trySet(dst, 'strokeWeight', src.strokeWeight);
    }
    trySet(dst, 'strokeAlign', src.strokeAlign);
    if ('dashPattern' in src && Array.isArray(src.dashPattern)) {
        trySet(dst, 'dashPattern', __spreadArray([], src.dashPattern, true));
    }
    trySet(dst, 'strokeJoin', src.strokeJoin);
    trySet(dst, 'strokeCap', src.strokeCap);
    trySet(dst, 'strokeMiterLimit', src.strokeMiterLimit);
    if ('effects' in src && src.effects !== figma.mixed && Array.isArray(src.effects)) {
        trySet(dst, 'effects', JSON.parse(JSON.stringify(src.effects)));
    }
    if ('effectStyleId' in src && typeof src.effectStyleId === 'string') {
        trySet(dst, 'effectStyleId', src.effectStyleId);
    }
    trySet(dst, 'clipsContent', src.clipsContent);
    trySet(dst, 'constrainProportions', src.constrainProportions);
    if ('cornerRadius' in src) {
        if (src.cornerRadius !== figma.mixed) {
            trySet(dst, 'cornerRadius', src.cornerRadius);
        }
        else {
            try {
                dst.topLeftRadius = src.topLeftRadius;
                dst.topRightRadius = src.topRightRadius;
                dst.bottomLeftRadius = src.bottomLeftRadius;
                dst.bottomRightRadius = src.bottomRightRadius;
            }
            catch (e) { }
        }
    }
    if ('cornerSmoothing' in src && src.cornerSmoothing !== figma.mixed) {
        trySet(dst, 'cornerSmoothing', src.cornerSmoothing);
    }
    if ('individualStrokeWeights' in src) {
        try {
            dst.individualStrokeWeights = {
                top: src.individualStrokeWeights.top,
                right: src.individualStrokeWeights.right,
                bottom: src.individualStrokeWeights.bottom,
                left: src.individualStrokeWeights.left
            };
        }
        catch (e) { }
    }
    if (src.type === 'FRAME' && dst.type !== 'RECTANGLE') {
        trySet(dst, 'overflowDirection', src.overflowDirection);
        trySet(dst, 'primaryAxisSizingMode', src.primaryAxisSizingMode);
        trySet(dst, 'counterAxisSizingMode', src.counterAxisSizingMode);
        trySet(dst, 'layoutMode', src.layoutMode);
        if (src.layoutMode !== 'NONE') {
            trySet(dst, 'primaryAxisAlignItems', src.primaryAxisAlignItems);
            trySet(dst, 'counterAxisAlignItems', src.counterAxisAlignItems);
            trySet(dst, 'paddingLeft', src.paddingLeft);
            trySet(dst, 'paddingRight', src.paddingRight);
            trySet(dst, 'paddingTop', src.paddingTop);
            trySet(dst, 'paddingBottom', src.paddingBottom);
            trySet(dst, 'itemSpacing', src.itemSpacing);
            trySet(dst, 'layoutWrap', src.layoutWrap);
        }
    }
    if ('layoutGrids' in src && Array.isArray(src.layoutGrids)) {
        trySet(dst, 'layoutGrids', JSON.parse(JSON.stringify(src.layoutGrids)));
    }
    if ('gridStyleId' in src && typeof src.gridStyleId === 'string') {
        trySet(dst, 'gridStyleId', src.gridStyleId);
    }
}
figma.ui.onmessage = function (msg) { return __awaiter(_this, void 0, void 0, function () {
    function rm(n) {
        if (n.layoutMode && n.layoutMode !== 'NONE') {
            n.layoutMode = 'NONE';
            count_1++;
        }
        if (n.children)
            n.children.forEach(rm);
    }
    function collect(n) {
        if (n.type === 'GROUP')
            groups_2.push(n);
        if ('children' in n)
            for (var _i = 0, _a = n.children; _i < _a.length; _i++) {
                var child = _a[_i];
                collect(child);
            }
    }
    function ul(n) {
        if ('locked' in n && n.locked) {
            n.locked = false;
            count_2++;
        }
        if ('children' in n)
            n.children.forEach(ul);
    }
    function findText(nodes) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, nodes_1, node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, nodes_1 = nodes;
                        _a.label = 1;
                    case 1:
                        if (!(_i < nodes_1.length)) return [3 /*break*/, 5];
                        node = nodes_1[_i];
                        if (!(node.type === 'TEXT')) return [3 /*break*/, 2];
                        textNodes_3.push(node);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!('children' in node)) return [3 /*break*/, 4];
                        return [4 /*yield*/, findText(node.children)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    var res, json, e_1, selection, _a, textNodes_4, traverse_1, scope, dataList, mode, distribution, textNodes_5, traverse_2, changeCount, i, node, textToFill, e_2, value, aiConfig, newSelection, selCopy, _i, selCopy_1, node, parent_1, idx, frame, _b, _c, child, newSelection, selCopy, _d, selCopy_2, node, parent_2, _e, _f, child, idx, rect, count, _g, selection_1, node, temp, _h, selection_2, node, img, asyncImg, size, count_1, newSelection, _j, selection_3, node, frame, parent_3, index, newSel, _k, selection_4, node, lines, font, e_3, cy, _l, lines_1, l, t, tNodes, font, e_4, txt, nt, newSel, _m, selection_5, node, grandParent, absX, absY, gpAbsX, gpAbsY, relX, relY, page, newSel, _o, selection_6, node, absX, absY, sel, targets_3, scan_1, _p, targets_1, node, h, pool, _q, pool_1, n, count_3, p_1, isReverse_1, count, groups_2, _r, selection_7, node, _s, groups_1, g, count_2, count, _t, selection_8, node, newX, newY, newW, newH, n1, n2, x1, y1, createdCount, conflicts, errors, localPaints, localTexts, localEffects, _loop_1, _u, selection_9, node, e_5, parts, sel, countFill_1, countStroke_1, countText_1, countEffect_1, paints, texts, effects, paintMap_1, effectMap_1, textMap_1, traverse_3, _v, sel_1, node, e_6, total, sel, f, sel_5, searchTargets, _w, sel_2, node, children, _x, sel_3, node, siblings, allPageNodes, _y, sel_4, node, children, allPageNodes, uniqueMap_1, finalPool, results, _z, finalPool_1, node, match, n, q, t, ts, isType, isState, s, _0, _1, p, val, v, tgt, runFocus, findText_1, replaceText, scope, count, textNodes_6, collect_1, _2, textNodes_1, node, font, e_7, pageName, slides, slides, slides, slides, slides, cfg_1, targets_4, targetTypes_1, scopeNodes, collectTargets_1, findRegex_1, escape_1, pat, results_1, checkString_1, _loop_2, _3, targets_2, node, items, count, _4, items_1, item, node, err_1, scope, findText_2, results_2, searchPool, traverse_4, node, cacheKey, font, cachedData, currentFills, highlightPaint, e_8, tasks, replaceText, successCount, processedIds, groups_3, _5, _6, _7, _8, nodeId, node, groupTasks, _9, groupTasks_1, task, currentStr, err_2, count, _10, _11, _12, _13, key, _14, nodeId, indexStr, index, data, node, font, e_9, ids, findText_3, replaceText, count, _15, ids_1, id, node, regex, err_3, dataStr, spots, dataStr, spots, currentSelection, defaultName, newSpot, dataStr, spots, spot, targetPage, nodesToSelect, _16, _17, id, node, e_10, dataStr, spots, dataStr, spots, index, selection_11, r, sx, sy, cosR, sinR, tanX, tanY, m00, m01, m10, m11, _18, selection_10, node, tx, ty, newTransform, data, e_11, e_12, hasSelection, scope, extractTarget, collectionName, nodesToScan, textNodes_3, allCollections, collectionNames, targetColName_1, i18nCollection, modes_1, existingVarMap, origModeId_1, localVars, _19, localVars_1, v, origVal, boundCount, mixedFonts, autoBindMap, newTextMap, _20, textNodes_2, node, text, newPayload, autoBindPayload, isCreate, collectionName_1, collections, collection, origModeId, allTargetLangs_1, modeIdMap_1, _21, _22, lang, newModeId, localVars, varMap, _23, localVars_2, v, baseVal, _24, newPayload_1, item, variable, safeName, varName, _25, _26, _27, langName, translatedText, targetModeId, _28, _29, nodeId, node, e_13, payload, successCount, _30, payload_1, item, targetText, _31, _32, nodeId, node, e_14, e_15, dx, dy, newW, newH;
    var _this = this;
    return __generator(this, function (_33) {
        switch (_33.label) {
            case 0:
                if (!msg || !msg.type)
                    return [2 /*return*/];
                if (!(msg.type === 'do-fetch')) return [3 /*break*/, 6];
                _33.label = 1;
            case 1:
                _33.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(msg.url, msg.options)];
            case 2:
                res = _33.sent();
                return [4 /*yield*/, res.json()];
            case 3:
                json = _33.sent();
                figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, data: json });
                return [3 /*break*/, 5];
            case 4:
                e_1 = _33.sent();
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
                    case 'req-ai-config': return [3 /*break*/, 19];
                    case 'to-frame': return [3 /*break*/, 21];
                    case 'to-rect': return [3 /*break*/, 22];
                    case 'swap-fs': return [3 /*break*/, 23];
                    case 'reset-image': return [3 /*break*/, 24];
                    case 'remove-al': return [3 /*break*/, 29];
                    case 'add-al-wrapper': return [3 /*break*/, 30];
                    case 'split-text': return [3 /*break*/, 31];
                    case 'join-text': return [3 /*break*/, 39];
                    case 'up-one': return [3 /*break*/, 44];
                    case 'up-all': return [3 /*break*/, 45];
                    case 'rename-content': return [3 /*break*/, 46];
                    case 'detach-all': return [3 /*break*/, 47];
                    case 'remove-hidden': return [3 /*break*/, 48];
                    case 'sort-layers': return [3 /*break*/, 49];
                    case 'ungroup-all': return [3 /*break*/, 50];
                    case 'unlock-all': return [3 /*break*/, 51];
                    case 'pixel-perfect': return [3 /*break*/, 52];
                    case 'swap-positions': return [3 /*break*/, 53];
                    case 'create-styles': return [3 /*break*/, 54];
                    case 'match-styles': return [3 /*break*/, 65];
                    case 'fetch-selection-name': return [3 /*break*/, 76];
                    case 'find-and-select': return [3 /*break*/, 77];
                    case 'focus-layers': return [3 /*break*/, 78];
                    case 'find-replace': return [3 /*break*/, 79];
                    case 'ppt-step-1': return [3 /*break*/, 89];
                    case 'ppt-step-2': return [3 /*break*/, 91];
                    case 'ppt-step-3': return [3 /*break*/, 93];
                    case 'ppt-step-4': return [3 /*break*/, 95];
                    case 'ppt-step-5': return [3 /*break*/, 97];
                    case 'lint-variants': return [3 /*break*/, 99];
                    case 'fix-variants': return [3 /*break*/, 100];
                    case 'text-find-matches': return [3 /*break*/, 107];
                    case 'locate-node': return [3 /*break*/, 108];
                    case 'text-replace-batch': return [3 /*break*/, 116];
                    case 'clear-all-highlights': return [3 /*break*/, 124];
                    case 'text-replace-batch': return [3 /*break*/, 133];
                    case 'jb-init': return [3 /*break*/, 141];
                    case 'jb-save': return [3 /*break*/, 142];
                    case 'jb-jump': return [3 /*break*/, 143];
                    case 'jb-delete': return [3 /*break*/, 155];
                    case 'jb-rename': return [3 /*break*/, 156];
                    case 'skew-apply': return [3 /*break*/, 157];
                    case 'req-skew-presets': return [3 /*break*/, 158];
                    case 'save-skew-presets': return [3 /*break*/, 162];
                    case 'i18n-check-selection': return [3 /*break*/, 166];
                    case 'i18n-detect': return [3 /*break*/, 167];
                    case 'i18n-bind-variables': return [3 /*break*/, 172];
                    case 'i18n-replace-text': return [3 /*break*/, 185];
                    case 'resize-start': return [3 /*break*/, 199];
                    case 'resize-move': return [3 /*break*/, 200];
                    case 'resize-end': return [3 /*break*/, 201];
                    case 'resize-drag': return [3 /*break*/, 202];
                    case 'resize-window': return [3 /*break*/, 202];
                }
                return [3 /*break*/, 203];
            case 7:
                {
                    textNodes_4 = [];
                    traverse_1 = function (n) {
                        if (n.type === 'TEXT' && !n.removed && n.visible)
                            textNodes_4.push(n);
                        if ('children' in n)
                            n.children.forEach(traverse_1);
                    };
                    scope = figma.currentPage.selection.length > 0 ? figma.currentPage.selection : [figma.currentPage];
                    scope.forEach(traverse_1);
                    figma.ui.postMessage({ type: 'selection-count-res', count: textNodes_4.length });
                    return [3 /*break*/, 203];
                }
                _33.label = 8;
            case 8:
                dataList = msg.dataList, mode = msg.mode, distribution = msg.distribution;
                textNodes_5 = [];
                traverse_2 = function (n) {
                    if (n.type === 'TEXT' && !n.removed && n.visible)
                        textNodes_5.push(n);
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
                if (textNodes_5.length === 0) {
                    figma.notify("未找到文本图层");
                    return [2 /*return*/];
                }
                // 视觉排序 (从左到右，从上到下)
                textNodes_5.sort(function (a, b) {
                    var aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
                    var bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
                    if (Math.abs(aAbs.y - bAbs.y) > 10)
                        return aAbs.y - bAbs.y;
                    return aAbs.x - bAbs.x;
                });
                changeCount = 0;
                i = 0;
                _33.label = 9;
            case 9:
                if (!(i < textNodes_5.length)) return [3 /*break*/, 14];
                node = textNodes_5[i];
                _33.label = 10;
            case 10:
                _33.trys.push([10, 12, , 13]);
                // 加载字体
                return [4 /*yield*/, figma.loadFontAsync(node.fontName)];
            case 11:
                // 加载字体
                _33.sent(); // 简单处理，假设非混合字体
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
                e_2 = _33.sent();
                console.error("Fill error", e_2);
                return [3 /*break*/, 13];
            case 13:
                i++;
                return [3 /*break*/, 9];
            case 14:
                figma.notify("\u5DF2\u586B\u5145 ".concat(changeCount, " \u4E2A\u6587\u672C"));
                return [3 /*break*/, 203];
            case 15: return [4 /*yield*/, figma.clientStorage.setAsync(msg.key, msg.value)];
            case 16:
                _33.sent();
                if (msg.notify)
                    figma.notify("配置已保存");
                figma.ui.postMessage({ type: 'storage-saved', key: msg.key, value: msg.value });
                return [3 /*break*/, 203];
            case 17: return [4 /*yield*/, figma.clientStorage.getAsync(msg.key)];
            case 18:
                value = _33.sent();
                figma.ui.postMessage({ type: 'storage-loaded', key: msg.key, value: value });
                return [3 /*break*/, 203];
            case 19: return [4 /*yield*/, figma.clientStorage.getAsync('smart_ai_config')];
            case 20:
                aiConfig = _33.sent();
                figma.ui.postMessage({ type: 'init-ai-config', data: aiConfig || {} });
                return [3 /*break*/, 203];
            case 21:
                {
                    if (selection.length === 0) {
                        figma.notify("请选择形状");
                        return [2 /*return*/];
                    }
                    newSelection = [];
                    selCopy = __spreadArray([], selection, true);
                    for (_i = 0, selCopy_1 = selCopy; _i < selCopy_1.length; _i++) {
                        node = selCopy_1[_i];
                        if (node.removed)
                            continue;
                        parent_1 = node.parent;
                        if (!parent_1)
                            continue;
                        idx = parent_1.children.indexOf(node);
                        frame = figma.createFrame();
                        frame.resize(node.width, node.height);
                        frame.name = node.name;
                        frame.x = node.x;
                        frame.y = node.y;
                        parent_1.insertChild(idx, frame);
                        copyNodeStyles(node, frame);
                        if ('children' in node) {
                            for (_b = 0, _c = __spreadArray([], node.children, true); _b < _c.length; _b++) {
                                child = _c[_b];
                                if (!child.removed)
                                    frame.appendChild(child);
                            }
                        }
                        try {
                            node.remove();
                        }
                        catch (e) { }
                        newSelection.push(frame);
                    }
                    if (newSelection.length > 0)
                        figma.currentPage.selection = newSelection;
                    figma.notify("已转换为 Frame");
                    return [3 /*break*/, 203];
                }
                _33.label = 22;
            case 22:
                {
                    if (selection.length === 0) {
                        figma.notify("请选择图层");
                        return [2 /*return*/];
                    }
                    newSelection = [];
                    selCopy = __spreadArray([], selection, true);
                    for (_d = 0, selCopy_2 = selCopy; _d < selCopy_2.length; _d++) {
                        node = selCopy_2[_d];
                        if (node.removed)
                            continue;
                        if (node.type !== 'FRAME' && node.type !== 'GROUP' && node.type !== 'SECTION')
                            continue;
                        parent_2 = node.parent;
                        if (!parent_2)
                            continue;
                        if ('children' in node) {
                            for (_e = 0, _f = __spreadArray([], node.children, true); _e < _f.length; _e++) {
                                child = _f[_e];
                                if (!child.removed) {
                                    parent_2.insertChild(parent_2.children.indexOf(node), child);
                                }
                            }
                        }
                        idx = parent_2.children.indexOf(node);
                        rect = figma.createRectangle();
                        rect.resize(node.width, node.height);
                        rect.name = node.name;
                        rect.x = node.x;
                        rect.y = node.y;
                        parent_2.insertChild(idx, rect);
                        copyNodeStyles(node, rect);
                        try {
                            node.remove();
                        }
                        catch (e) { }
                        newSelection.push(rect);
                    }
                    if (newSelection.length > 0)
                        figma.currentPage.selection = newSelection;
                    return [3 /*break*/, 203];
                }
                _33.label = 23;
            case 23:
                {
                    count = 0;
                    for (_g = 0, selection_1 = selection; _g < selection_1.length; _g++) {
                        node = selection_1[_g];
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
                    return [3 /*break*/, 203];
                }
                _33.label = 24;
            case 24:
                _h = 0, selection_2 = selection;
                _33.label = 25;
            case 25:
                if (!(_h < selection_2.length)) return [3 /*break*/, 28];
                node = selection_2[_h];
                if (!('fills' in node && Array.isArray(node.fills))) return [3 /*break*/, 27];
                img = node.fills.find(function (f) { return f.type === 'IMAGE'; });
                if (!(img && img.imageHash)) return [3 /*break*/, 27];
                asyncImg = figma.getImageByHash(img.imageHash);
                return [4 /*yield*/, asyncImg.getSizeAsync()];
            case 26:
                size = _33.sent();
                if (size && size.width)
                    node.resize(node.width, node.width * (size.height / size.width));
                _33.label = 27;
            case 27:
                _h++;
                return [3 /*break*/, 25];
            case 28: return [3 /*break*/, 203];
            case 29:
                {
                    count_1 = 0;
                    selection.forEach(rm);
                    figma.notify("\u79FB\u9664 ".concat(count_1, " \u4E2A\u81EA\u52A8\u5E03\u5C40"));
                    return [3 /*break*/, 203];
                }
                _33.label = 30;
            case 30:
                {
                    newSelection = [];
                    if (selection.length === 0) {
                        figma.notify("请选择图层");
                        return [2 /*return*/];
                    }
                    for (_j = 0, selection_3 = selection; _j < selection_3.length; _j++) {
                        node = selection_3[_j];
                        if (node.removed || !node.parent)
                            continue;
                        frame = figma.createFrame();
                        frame.name = "Auto Layout Wrapper";
                        frame.layoutMode = "VERTICAL";
                        frame.itemSpacing = 10;
                        frame.paddingLeft = 0;
                        frame.paddingRight = 0;
                        frame.paddingTop = 0;
                        frame.paddingBottom = 0;
                        frame.primaryAxisSizingMode = "AUTO";
                        frame.counterAxisSizingMode = "AUTO";
                        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
                        frame.strokes = [];
                        frame.x = node.x;
                        frame.y = node.y;
                        parent_3 = node.parent;
                        index = parent_3.children.indexOf(node);
                        parent_3.insertChild(index, frame);
                        frame.appendChild(node);
                        newSelection.push(frame);
                    }
                    if (newSelection.length > 0) {
                        figma.currentPage.selection = newSelection;
                        figma.notify("已添加自动布局外套");
                    }
                    return [3 /*break*/, 203];
                }
                _33.label = 31;
            case 31:
                newSel = [];
                _k = 0, selection_4 = selection;
                _33.label = 32;
            case 32:
                if (!(_k < selection_4.length)) return [3 /*break*/, 38];
                node = selection_4[_k];
                if (node.type !== "TEXT")
                    return [3 /*break*/, 37];
                lines = node.characters.split(/\r\n|\r|\n/);
                if (lines.length <= 1)
                    return [3 /*break*/, 37];
                font = node.fontName;
                if (font === figma.mixed)
                    font = node.getRangeFontName(0, 1);
                _33.label = 33;
            case 33:
                _33.trys.push([33, 35, , 36]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 34:
                _33.sent();
                return [3 /*break*/, 36];
            case 35:
                e_3 = _33.sent();
                figma.notify("字体加载失败");
                return [3 /*break*/, 37];
            case 36:
                cy = node.y;
                for (_l = 0, lines_1 = lines; _l < lines_1.length; _l++) {
                    l = lines_1[_l];
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
                _33.label = 37;
            case 37:
                _k++;
                return [3 /*break*/, 32];
            case 38:
                if (newSel.length > 0)
                    figma.currentPage.selection = newSel;
                return [3 /*break*/, 203];
            case 39:
                tNodes = selection.filter(function (n) { return n.type === 'TEXT'; }).sort(function (a, b) { return Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x; });
                if (tNodes.length < 2) {
                    figma.notify("请选2个以上文本");
                    return [2 /*return*/];
                }
                font = tNodes[0].fontName;
                if (font === figma.mixed)
                    font = tNodes[0].getRangeFontName(0, 1);
                _33.label = 40;
            case 40:
                _33.trys.push([40, 42, , 43]);
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 41:
                _33.sent();
                return [3 /*break*/, 43];
            case 42:
                e_4 = _33.sent();
                figma.notify("字体加载失败");
                return [2 /*return*/];
            case 43:
                txt = tNodes.map(function (n) { return n.characters; }).join('\n');
                nt = tNodes[0].clone();
                nt.characters = txt;
                nt.textAutoResize = 'HEIGHT';
                tNodes.forEach(function (n) { return n.remove(); });
                figma.currentPage.selection = [nt];
                return [3 /*break*/, 203];
            case 44:
                {
                    newSel = [];
                    for (_m = 0, selection_5 = selection; _m < selection_5.length; _m++) {
                        node = selection_5[_m];
                        if (node.parent && node.parent.parent && node.parent.type !== 'PAGE') {
                            grandParent = node.parent.parent;
                            absX = node.absoluteTransform[0][2];
                            absY = node.absoluteTransform[1][2];
                            gpAbsX = grandParent.absoluteTransform[0][2];
                            gpAbsY = grandParent.absoluteTransform[1][2];
                            relX = absX - gpAbsX;
                            relY = absY - gpAbsY;
                            grandParent.appendChild(node);
                            if ('layoutMode' in grandParent && grandParent.layoutMode !== 'NONE') {
                                try {
                                    node.layoutPositioning = 'ABSOLUTE';
                                }
                                catch (e) { }
                            }
                            node.x = relX;
                            node.y = relY;
                            newSel.push(node);
                        }
                    }
                    if (newSel.length)
                        figma.currentPage.selection = newSel;
                    return [3 /*break*/, 203];
                }
                _33.label = 45;
            case 45:
                {
                    page = figma.currentPage;
                    newSel = [];
                    for (_o = 0, selection_6 = selection; _o < selection_6.length; _o++) {
                        node = selection_6[_o];
                        absX = node.absoluteTransform[0][2];
                        absY = node.absoluteTransform[1][2];
                        page.appendChild(node);
                        node.x = absX;
                        node.y = absY;
                        newSel.push(node);
                    }
                    figma.currentPage.selection = newSel;
                    return [3 /*break*/, 203];
                }
                _33.label = 46;
            case 46:
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
                    return [3 /*break*/, 203];
                }
                _33.label = 47;
            case 47:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length === 0) {
                        figma.notify("请先选中图层");
                        return [2 /*return*/];
                    }
                    targets_3 = [];
                    scan_1 = function (n) {
                        if ('children' in n) {
                            for (var _i = 0, _a = n.children; _i < _a.length; _i++) {
                                var child = _a[_i];
                                scan_1(child);
                            }
                        }
                        if (n.type === 'INSTANCE')
                            targets_3.push(n);
                    };
                    sel.forEach(scan_1);
                    if (targets_3.length === 0) {
                        figma.notify("未找到可解绑的实例");
                        return [2 /*return*/];
                    }
                    for (_p = 0, targets_1 = targets_3; _p < targets_1.length; _p++) {
                        node = targets_1[_p];
                        if (!node.removed) {
                            try {
                                node.detachInstance();
                            }
                            catch (e) { }
                        }
                    }
                    figma.notify("\u5DF2\u89E3\u7ED1 ".concat(targets_3.length, " \u4E2A\u7EC4\u4EF6"));
                    return [3 /*break*/, 203];
                }
                _33.label = 48;
            case 48:
                {
                    h = [];
                    pool = selection.length > 0 ? selection : [figma.currentPage];
                    for (_q = 0, pool_1 = pool; _q < pool_1.length; _q++) {
                        n = pool_1[_q];
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
                    return [3 /*break*/, 203];
                }
                _33.label = 49;
            case 49:
                {
                    if (selection.length > 1) {
                        p_1 = selection[0].parent;
                        if (selection.every(function (n) { return n.parent === p_1; })) {
                            isReverse_1 = (layerSortDirection === 'desc');
                            __spreadArray([], selection, true).sort(function (a, b) {
                                var diffY = a.y - b.y;
                                var diffX = a.x - b.x;
                                var result = Math.abs(diffY) > 2 ? diffY : diffX;
                                return isReverse_1 ? -result : result;
                            }).forEach(function (n) { return p_1.appendChild(n); });
                            figma.notify(isReverse_1 ? "已反转排列（从下到上）" : "已排列（从上到下）");
                            layerSortDirection = isReverse_1 ? 'asc' : 'desc';
                        }
                    }
                    else {
                        figma.notify("请至少选择两个同级图层");
                    }
                    return [3 /*break*/, 203];
                }
                _33.label = 50;
            case 50:
                {
                    count = 0;
                    groups_2 = [];
                    for (_r = 0, selection_7 = selection; _r < selection_7.length; _r++) {
                        node = selection_7[_r];
                        collect(node);
                    }
                    // 解组（从内向外解组可能更安全，但 ungroup 后子节点会保留）
                    for (_s = 0, groups_1 = groups_2; _s < groups_1.length; _s++) {
                        g = groups_1[_s];
                        if (!g.removed) {
                            figma.ungroup(g);
                            count++;
                        }
                    }
                    figma.notify("\u5DF2\u89E3\u6563 ".concat(count, " \u4E2A\u7EC4"));
                    return [3 /*break*/, 203];
                }
                _33.label = 51;
            case 51:
                {
                    count_2 = 0;
                    selection.forEach(ul);
                    figma.notify("\u5DF2\u89E3\u9501 ".concat(count_2, " \u4E2A\u56FE\u5C42"));
                    return [3 /*break*/, 203];
                }
                _33.label = 52;
            case 52:
                {
                    if (selection.length === 0) {
                        figma.notify("请选择图层");
                        return [2 /*return*/];
                    }
                    count = 0;
                    for (_t = 0, selection_8 = selection; _t < selection_8.length; _t++) {
                        node = selection_8[_t];
                        if (!node.removed) {
                            newX = Math.round(node.x);
                            newY = Math.round(node.y);
                            newW = Math.round(node.width);
                            newH = Math.round(node.height);
                            if (node.x !== newX || node.y !== newY) {
                                node.x = newX;
                                node.y = newY;
                            }
                            if (node.width !== newW || node.height !== newH)
                                node.resize(newW, newH);
                            count++;
                        }
                    }
                    figma.notify("\u5DF2\u5BF9\u9F50 ".concat(count, " \u4E2A\u56FE\u5C42"));
                    return [3 /*break*/, 203];
                }
                _33.label = 53;
            case 53:
                {
                    if (selection.length !== 2) {
                        figma.notify("请严格选择 2 个图层进行交换");
                        return [2 /*return*/];
                    }
                    n1 = selection[0];
                    n2 = selection[1];
                    x1 = n1.x, y1 = n1.y;
                    n1.x = n2.x;
                    n1.y = n2.y;
                    n2.x = x1;
                    n2.y = y1;
                    figma.notify("位置已互换");
                    return [3 /*break*/, 203];
                }
                _33.label = 54;
            case 54:
                console.log("=== 开始执行创建样式 ===");
                if (selection.length === 0) {
                    figma.notify("请选择图层");
                    return [2 /*return*/];
                }
                createdCount = 0;
                conflicts = [];
                errors = [];
                _33.label = 55;
            case 55:
                _33.trys.push([55, 63, , 64]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 56:
                localPaints = _33.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 57:
                localTexts = _33.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 58:
                localEffects = _33.sent();
                _loop_1 = function (node) {
                    var name_1, exist, style, exist, style, font, err_4, exist, style;
                    return __generator(this, function (_34) {
                        switch (_34.label) {
                            case 0:
                                if (node.removed)
                                    return [2 /*return*/, "continue"];
                                name_1 = node.name;
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
                                                createdCount++;
                                                style.name = name_1;
                                                style.paints = JSON.parse(JSON.stringify(node.fills));
                                                try {
                                                    node.fillStyleId = style.id;
                                                }
                                                catch (e) { }
                                            }
                                            catch (err) {
                                                errors.push(name_1);
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
                                _34.trys.push([1, 4, , 5]);
                                style = figma.createTextStyle();
                                createdCount++;
                                style.name = name_1;
                                font = node.fontName;
                                if (!(font !== figma.mixed)) return [3 /*break*/, 3];
                                return [4 /*yield*/, figma.loadFontAsync(font)];
                            case 2:
                                _34.sent();
                                style.fontName = font;
                                style.fontSize = node.fontSize !== figma.mixed ? node.fontSize : 12;
                                if (node.letterSpacing !== figma.mixed)
                                    style.letterSpacing = node.letterSpacing;
                                if (node.lineHeight !== figma.mixed)
                                    style.lineHeight = node.lineHeight;
                                if (node.textDecoration !== figma.mixed)
                                    style.textDecoration = node.textDecoration;
                                try {
                                    node.textStyleId = style.id;
                                }
                                catch (e) { }
                                _34.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                err_4 = _34.sent();
                                errors.push(name_1);
                                return [3 /*break*/, 5];
                            case 5:
                                if ('effects' in node && node.effects !== figma.mixed && Array.isArray(node.effects) && node.effects.length > 0) {
                                    exist = localEffects.find(function (s) { return s.name === name_1; });
                                    if (exist) {
                                        if (!conflicts.includes(name_1))
                                            conflicts.push(name_1 + " (效果)");
                                    }
                                    else {
                                        try {
                                            style = figma.createEffectStyle();
                                            createdCount++;
                                            style.name = name_1;
                                            style.effects = JSON.parse(JSON.stringify(node.effects));
                                            try {
                                                node.effectStyleId = style.id;
                                            }
                                            catch (e) { }
                                        }
                                        catch (err) {
                                            errors.push(name_1);
                                        }
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                _u = 0, selection_9 = selection;
                _33.label = 59;
            case 59:
                if (!(_u < selection_9.length)) return [3 /*break*/, 62];
                node = selection_9[_u];
                return [5 /*yield**/, _loop_1(node)];
            case 60:
                _33.sent();
                _33.label = 61;
            case 61:
                _u++;
                return [3 /*break*/, 59];
            case 62: return [3 /*break*/, 64];
            case 63:
                e_5 = _33.sent();
                console.error("全局错误:", e_5);
                figma.notify("样式创建失败: " + String(e_5).slice(0, 50));
                return [2 /*return*/];
            case 64:
                parts = [];
                if (createdCount > 0)
                    parts.push("\u65B0\u5EFA ".concat(createdCount, " \u4E2A"));
                if (conflicts.length > 0)
                    parts.push("\u8DF3\u8FC7\u91CD\u590D ".concat(conflicts.length, " \u4E2A"));
                if (errors.length > 0)
                    parts.push("\u5931\u8D25 ".concat(errors.length, " \u4E2A"));
                if (parts.length > 0)
                    figma.notify(parts.join('，'));
                else
                    figma.notify("未发现可创建的样式（选中的图层可能没有填充/文本/效果属性）");
                return [3 /*break*/, 203];
            case 65:
                console.log("=== 开始匹配样式 ===");
                sel = figma.currentPage.selection;
                if (sel.length === 0) {
                    figma.notify("请先选择范围");
                    return [2 /*return*/];
                }
                countFill_1 = 0, countStroke_1 = 0, countText_1 = 0, countEffect_1 = 0;
                _33.label = 66;
            case 66:
                _33.trys.push([66, 74, , 75]);
                return [4 /*yield*/, figma.getLocalPaintStylesAsync()];
            case 67:
                paints = _33.sent();
                return [4 /*yield*/, figma.getLocalTextStylesAsync()];
            case 68:
                texts = _33.sent();
                return [4 /*yield*/, figma.getLocalEffectStylesAsync()];
            case 69:
                effects = _33.sent();
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
                    var key, e_16, key, e_17, key, e_18, key, e_19, _i, _a, child;
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
                                return [4 /*yield*/, node.setFillStyleIdAsync(paintMap_1.get(key))];
                            case 2:
                                _b.sent();
                                countFill_1++;
                                return [3 /*break*/, 4];
                            case 3:
                                e_16 = _b.sent();
                                return [3 /*break*/, 4];
                            case 4:
                                if (!('strokes' in node && node.strokes !== figma.mixed && node.strokes.length > 0 && node.strokeStyleId === '')) return [3 /*break*/, 8];
                                key = JSON.stringify(node.strokes);
                                if (!paintMap_1.has(key)) return [3 /*break*/, 8];
                                _b.label = 5;
                            case 5:
                                _b.trys.push([5, 7, , 8]);
                                return [4 /*yield*/, node.setStrokeStyleIdAsync(paintMap_1.get(key))];
                            case 6:
                                _b.sent();
                                countStroke_1++;
                                return [3 /*break*/, 8];
                            case 7:
                                e_17 = _b.sent();
                                return [3 /*break*/, 8];
                            case 8:
                                if (!('effects' in node && node.effects !== figma.mixed && node.effects.length > 0 && node.effectStyleId === '')) return [3 /*break*/, 12];
                                key = JSON.stringify(node.effects);
                                if (!effectMap_1.has(key)) return [3 /*break*/, 12];
                                _b.label = 9;
                            case 9:
                                _b.trys.push([9, 11, , 12]);
                                return [4 /*yield*/, node.setEffectStyleIdAsync(effectMap_1.get(key))];
                            case 10:
                                _b.sent();
                                countEffect_1++;
                                return [3 /*break*/, 12];
                            case 11:
                                e_18 = _b.sent();
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
                                return [4 /*yield*/, node.setTextStyleIdAsync(textMap_1.get(key))];
                            case 14:
                                _b.sent();
                                countText_1++;
                                return [3 /*break*/, 16];
                            case 15:
                                e_19 = _b.sent();
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
                _v = 0, sel_1 = sel;
                _33.label = 70;
            case 70:
                if (!(_v < sel_1.length)) return [3 /*break*/, 73];
                node = sel_1[_v];
                return [4 /*yield*/, traverse_3(node)];
            case 71:
                _33.sent();
                _33.label = 72;
            case 72:
                _v++;
                return [3 /*break*/, 70];
            case 73: return [3 /*break*/, 75];
            case 74:
                e_6 = _33.sent();
                console.error(e_6);
                figma.notify("匹配出错");
                return [2 /*return*/];
            case 75:
                total = countFill_1 + countStroke_1 + countText_1 + countEffect_1;
                if (total > 0)
                    figma.notify("\u5339\u914D\u6210\u529F: \u586B\u5145".concat(countFill_1, " / \u63CF\u8FB9").concat(countStroke_1, " / \u6587\u672C").concat(countText_1, " / \u6548\u679C").concat(countEffect_1));
                else
                    figma.notify("未发现可匹配的样式");
                return [3 /*break*/, 203];
            case 76:
                {
                    sel = figma.currentPage.selection;
                    if (sel.length > 0) {
                        figma.ui.postMessage({ type: 'update-name-input', name: sel[0].name });
                    }
                    else {
                        figma.notify("请先选择一个图层以获取名称");
                    }
                    return [3 /*break*/, 203];
                }
                _33.label = 77;
            case 77:
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
                        for (_w = 0, sel_2 = sel_5; _w < sel_2.length; _w++) {
                            node = sel_2[_w];
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
                        for (_x = 0, sel_3 = sel_5; _x < sel_3.length; _x++) {
                            node = sel_3[_x];
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
                    else if (f.scope === 'page') {
                        // 模式：全页 - 直接查找当前页面所有图层，忽略选中状态
                        console.log(">> 策略: 全页面查找");
                        allPageNodes = figma.currentPage.findAll(function () { return true; });
                        searchTargets.push.apply(searchTargets, allPageNodes);
                    }
                    else {
                        // 模式：子孙元素 (descendants) - 默认模式
                        // 逻辑：如果选了图层，查“选中项+选中项内部”；如果没选，查“全页”
                        if (sel_5.length > 0) {
                            console.log(">> 策略: 查找选中项及其后代");
                            // 1. 先把【选中项本身】加进去
                            // (使用 for 循环最稳妥)
                            for (_y = 0, sel_4 = sel_5; _y < sel_4.length; _y++) {
                                node = sel_4[_y];
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
                    for (_z = 0, finalPool_1 = finalPool; _z < finalPool_1.length; _z++) {
                        node = finalPool_1[_z];
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
                            for (_0 = 0, _1 = f.props; _0 < _1.length; _0++) {
                                p = _1[_0];
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
                    return [3 /*break*/, 203];
                }
                _33.label = 78;
            case 78:
                {
                    runFocus = function () { return __awaiter(_this, void 0, void 0, function () {
                        var ids, nodes, targets, selection_12, currentPageId, _i, nodes_2, node, p, isCurrent, e_20;
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
                                    selection_12 = [];
                                    currentPageId = figma.currentPage.id;
                                    // 2. 快速筛选
                                    for (_i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
                                        node = nodes_2[_i];
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
                                                selection_12.push(node);
                                            }
                                        }
                                    }
                                    if (targets.length > 0) {
                                        // A. 尝试选中 (如果全是锁定的，这里就是空数组，会清空选择，是正确的表现)
                                        figma.currentPage.selection = selection_12;
                                        // B. 视图定位 (这是你要的核心功能)
                                        figma.viewport.scrollAndZoomIntoView(targets);
                                        // C. 只有多选时才提示，单选静默，体验最好
                                        if (targets.length > 1) {
                                            figma.notify("\u5DF2\u5B9A\u4F4D ".concat(targets.length, " \u9879"));
                                        }
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_20 = _a.sent();
                                    console.log("定位错误 (已忽略):", e_20);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    runFocus();
                    return [3 /*break*/, 203];
                }
                _33.label = 79;
            case 79:
                findText_1 = msg.findText, replaceText = msg.replaceText;
                if (!findText_1) {
                    figma.notify("请输入查找内容，注意区分大小写");
                    return [2 /*return*/];
                }
                scope = selection.length > 0 ? selection : [figma.currentPage];
                count = 0;
                textNodes_6 = [];
                collect_1 = function (n) {
                    if (n.type === 'TEXT')
                        textNodes_6.push(n);
                    if ('children' in n)
                        n.children.forEach(collect_1);
                };
                scope.forEach(collect_1);
                if (textNodes_6.length === 0) {
                    figma.notify("范围内没有文本");
                    return [2 /*return*/];
                }
                _2 = 0, textNodes_1 = textNodes_6;
                _33.label = 80;
            case 80:
                if (!(_2 < textNodes_1.length)) return [3 /*break*/, 88];
                node = textNodes_1[_2];
                if (!node.characters.includes(findText_1)) return [3 /*break*/, 87];
                _33.label = 81;
            case 81:
                _33.trys.push([81, 86, , 87]);
                font = node.fontName;
                if (!(font === figma.mixed)) return [3 /*break*/, 83];
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                return [4 /*yield*/, figma.loadFontAsync(node.getRangeFontName(0, 1))];
            case 82:
                // 简化处理：如果是混合字体，尝试加载第一段的字体（复杂情况可能报错，暂跳过）
                _33.sent();
                return [3 /*break*/, 85];
            case 83: return [4 /*yield*/, figma.loadFontAsync(font)];
            case 84:
                _33.sent();
                _33.label = 85;
            case 85:
                // 执行替换
                node.characters = node.characters.split(findText_1).join(replaceText);
                count++;
                return [3 /*break*/, 87];
            case 86:
                e_7 = _33.sent();
                console.error("字体加载失败或替换出错", e_7);
                return [3 /*break*/, 87];
            case 87:
                _2++;
                return [3 /*break*/, 80];
            case 88:
                if (count > 0)
                    figma.notify("\u5DF2\u66FF\u6362 ".concat(count, " \u5904\u6587\u672C"));
                else
                    figma.notify("未找到匹配内容");
                return [3 /*break*/, 203];
            case 89:
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
            case 90:
                // 执行 Step 1 函数
                _33.sent();
                return [3 /*break*/, 203];
            case 91:
                slides = getSlides();
                return [4 /*yield*/, pptStep2_Rasterize(slides)];
            case 92:
                _33.sent();
                return [3 /*break*/, 203];
            case 93:
                slides = getSlides();
                return [4 /*yield*/, pptStep3_Flatten(slides)];
            case 94:
                _33.sent();
                return [3 /*break*/, 203];
            case 95:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 ===
                slides = sortNodesByVisualPosition(slides);
                // 函数内部会发送 step-done，这里不需要再发了
                return [4 /*yield*/, pptStep4_Extract(slides)];
            case 96:
                // 函数内部会发送 step-done，这里不需要再发了
                _33.sent();
                return [3 /*break*/, 203];
            case 97:
                slides = getSlides();
                // === 修复：使用绝对坐标排序 (保持顺序一致) ===
                slides = sortNodesByVisualPosition(slides);
                // 同上，内部已发消息
                return [4 /*yield*/, pptStep5_ExportImages(slides)];
            case 98:
                // 同上，内部已发消息
                _33.sent();
                return [3 /*break*/, 203];
            case 99:
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
                        for (var _i = 0, nodes_3 = nodes; _i < nodes_3.length; _i++) {
                            var node = nodes_3[_i];
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
                    for (_3 = 0, targets_2 = targets_4; _3 < targets_2.length; _3++) {
                        node = targets_2[_3];
                        _loop_2(node);
                    }
                    figma.ui.postMessage({ type: 'lint-results', data: results_1 });
                    return [3 /*break*/, 203];
                }
                _33.label = 100;
            case 100:
                items = msg.items;
                count = 0;
                _4 = 0, items_1 = items;
                _33.label = 101;
            case 101:
                if (!(_4 < items_1.length)) return [3 /*break*/, 106];
                item = items_1[_4];
                _33.label = 102;
            case 102:
                _33.trys.push([102, 104, , 105]);
                return [4 /*yield*/, figma.getNodeByIdAsync(item.id)];
            case 103:
                node = _33.sent();
                if (node) {
                    node.name = item.fullResult || item.newVal;
                    count++;
                }
                return [3 /*break*/, 105];
            case 104:
                err_1 = _33.sent();
                return [3 /*break*/, 105];
            case 105:
                _4++;
                return [3 /*break*/, 101];
            case 106:
                figma.notify("\u2728 \u5DF2\u6210\u529F\u4FEE\u590D ".concat(count, " \u9879\u547D\u540D"));
                return [3 /*break*/, 203];
            case 107:
                {
                    scope = msg.scope, findText_2 = msg.findText;
                    console.log("【后端】收到文本查找请求:", scope, findText_2); // 调试日志
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
                            var escapedFindText = findText_2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
                    return [3 /*break*/, 203];
                }
                _33.label = 108;
            case 108:
                _33.trys.push([108, 114, , 115]);
                return [4 /*yield*/, figma.getNodeByIdAsync(msg.id)];
            case 109:
                node = _33.sent();
                if (!node) return [3 /*break*/, 112];
                // === 第一步：通用操作 (先选中并聚焦) ===
                // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                figma.currentPage.selection = [node];
                figma.viewport.scrollAndZoomIntoView([node]);
                if (!(node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number')) return [3 /*break*/, 111];
                cacheKey = "".concat(msg.id, "_").concat(msg.index);
                font = node.fontName === figma.mixed
                    ? node.getRangeFontName(0, 1)
                    : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 110:
                _33.sent();
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
                _33.label = 111;
            case 111: return [3 /*break*/, 113];
            case 112:
                figma.notify("图层不存在 (可能已被删除)");
                _33.label = 113;
            case 113: return [3 /*break*/, 115];
            case 114:
                e_8 = _33.sent();
                console.error("定位失败:", e_8);
                return [3 /*break*/, 115];
            case 115: return [3 /*break*/, 203];
            case 116:
                tasks = msg.tasks, replaceText = msg.replaceText;
                successCount = 0;
                processedIds = new Set();
                groups_3 = {};
                tasks.forEach(function (task) {
                    if (!groups_3[task.id])
                        groups_3[task.id] = [];
                    groups_3[task.id].push(task);
                });
                _5 = groups_3;
                _6 = [];
                for (_7 in _5)
                    _6.push(_7);
                _8 = 0;
                _33.label = 117;
            case 117:
                if (!(_8 < _6.length)) return [3 /*break*/, 123];
                _7 = _6[_8];
                if (!(_7 in _5)) return [3 /*break*/, 122];
                nodeId = _7;
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 118:
                node = _33.sent();
                if (!node || node.type !== 'TEXT')
                    return [3 /*break*/, 122];
                groupTasks = groups_3[nodeId];
                // 🌟 倒序排序
                groupTasks.sort(function (a, b) { return b.index - a.index; });
                _33.label = 119;
            case 119:
                _33.trys.push([119, 121, , 122]);
                // 加载字体
                return [4 /*yield*/, figma.loadFontAsync(node.fontName === figma.mixed
                        ? node.getRangeFontName(0, 1)
                        : node.fontName)];
            case 120:
                // 加载字体
                _33.sent();
                // 执行替换
                for (_9 = 0, groupTasks_1 = groupTasks; _9 < groupTasks_1.length; _9++) {
                    task = groupTasks_1[_9];
                    currentStr = node.characters.substring(task.index, task.index + task.length);
                    // 简单的校验，略过严格校验以允许大小写差异
                    node.deleteCharacters(task.index, task.index + task.length);
                    node.insertCharacters(task.index, replaceText);
                    successCount++;
                    // 记录前端传来的唯一标识 (uid)，以便前端禁用
                    if (task.uid)
                        processedIds.add(task.uid);
                }
                return [3 /*break*/, 122];
            case 121:
                err_2 = _33.sent();
                console.error("\u66FF\u6362\u5931\u8D25 ".concat(nodeId, ":"), err_2);
                return [3 /*break*/, 122];
            case 122:
                _8++;
                return [3 /*break*/, 117];
            case 123:
                // 通知前端哪些任务完成了
                figma.ui.postMessage({
                    type: 'text-replace-success',
                    count: successCount,
                    processedUids: Array.from(processedIds)
                });
                figma.notify("\u5DF2\u66FF\u6362 ".concat(successCount, " \u5904\u6587\u672C"));
                return [3 /*break*/, 203];
            case 124:
                count = 0;
                _10 = highlightCache;
                _11 = [];
                for (_12 in _10)
                    _11.push(_12);
                _13 = 0;
                _33.label = 125;
            case 125:
                if (!(_13 < _11.length)) return [3 /*break*/, 132];
                _12 = _11[_13];
                if (!(_12 in _10)) return [3 /*break*/, 131];
                key = _12;
                _14 = key.split('_'), nodeId = _14[0], indexStr = _14[1];
                index = parseInt(indexStr);
                data = highlightCache[key];
                _33.label = 126;
            case 126:
                _33.trys.push([126, 130, , 131]);
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 127:
                node = _33.sent();
                if (!(node && node.type === 'TEXT')) return [3 /*break*/, 129];
                font = node.fontName === figma.mixed ? node.getRangeFontName(0, 1) : node.fontName;
                return [4 /*yield*/, figma.loadFontAsync(font)];
            case 128:
                _33.sent();
                node.setRangeFills(index, index + data.length, data.fills);
                count++;
                _33.label = 129;
            case 129: return [3 /*break*/, 131];
            case 130:
                e_9 = _33.sent();
                console.log("还原失败", e_9);
                return [3 /*break*/, 131];
            case 131:
                _13++;
                return [3 /*break*/, 125];
            case 132:
                highlightCache = {}; // 清空池子
                figma.notify("\u5DF2\u8FD8\u539F ".concat(count, " \u5904\u9AD8\u4EAE"));
                // 通知前端清除所有高亮样式
                figma.ui.postMessage({ type: 'clear-all-highlights-ui' });
                return [3 /*break*/, 203];
            case 133:
                ids = msg.ids, findText_3 = msg.findText, replaceText = msg.replaceText;
                count = 0;
                _15 = 0, ids_1 = ids;
                _33.label = 134;
            case 134:
                if (!(_15 < ids_1.length)) return [3 /*break*/, 140];
                id = ids_1[_15];
                return [4 /*yield*/, figma.getNodeByIdAsync(id)];
            case 135:
                node = _33.sent();
                if (!(node && node.type === 'TEXT')) return [3 /*break*/, 139];
                _33.label = 136;
            case 136:
                _33.trys.push([136, 138, , 139]);
                // 加载字体 (必要步骤)
                return [4 /*yield*/, figma.loadFontAsync(node.fontName === figma.mixed
                        ? node.getRangeFontName(0, 1)
                        : node.fontName)];
            case 137:
                // 加载字体 (必要步骤)
                _33.sent();
                regex = new RegExp(findText_3.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                if (regex.test(node.characters)) {
                    node.characters = node.characters.replace(regex, replaceText);
                    count++;
                }
                return [3 /*break*/, 139];
            case 138:
                err_3 = _33.sent();
                console.error("\u66FF\u6362\u6587\u672C\u5931\u8D25 (ID: ".concat(id, "):"), err_3);
                return [3 /*break*/, 139];
            case 139:
                _15++;
                return [3 /*break*/, 134];
            case 140:
                figma.notify("\u5DF2\u66FF\u6362 ".concat(count, " \u4E2A\u6587\u672C\u56FE\u5C42"));
                return [3 /*break*/, 203];
            case 141:
                {
                    dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                    spots = dataStr ? JSON.parse(dataStr) : [];
                    figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                    return [3 /*break*/, 203];
                }
                _33.label = 142;
            case 142:
                {
                    dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                    spots = dataStr ? JSON.parse(dataStr) : [];
                    if (spots.length >= 5) {
                        figma.notify("最多只能保存 5 个锚点！");
                        return [2 /*return*/];
                    }
                    currentSelection = figma.currentPage.selection;
                    defaultName = currentSelection.length > 0 ? currentSelection[0].name.substring(0, 15) : "Spot ".concat(spots.length + 1);
                    newSpot = {
                        id: 'spot_' + Date.now(),
                        name: defaultName,
                        pageId: figma.currentPage.id,
                        pageName: figma.currentPage.name,
                        zoom: figma.viewport.zoom,
                        centerX: figma.viewport.center.x,
                        centerY: figma.viewport.center.y,
                        // 保存选中的图层 ID 数组
                        selectionIds: currentSelection.map(function (n) { return n.id; })
                    };
                    spots.push(newSpot);
                    figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                    figma.notify("📍 位置已保存");
                    figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                    return [3 /*break*/, 203];
                }
                _33.label = 143;
            case 143:
                dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                if (!dataStr)
                    return [2 /*return*/];
                spots = JSON.parse(dataStr);
                spot = spots.find(function (s) { return s.id === msg.id; });
                if (!spot)
                    return [2 /*return*/];
                _33.label = 144;
            case 144:
                _33.trys.push([144, 153, , 154]);
                if (!(figma.currentPage.id !== spot.pageId)) return [3 /*break*/, 148];
                return [4 /*yield*/, figma.getNodeByIdAsync(spot.pageId)];
            case 145:
                targetPage = _33.sent();
                if (!(targetPage && targetPage.type === 'PAGE')) return [3 /*break*/, 147];
                // === 修复点 2：在 dynamic-page 模式下，必须用 setCurrentPageAsync 切换页面 ===
                return [4 /*yield*/, figma.setCurrentPageAsync(targetPage)];
            case 146:
                // === 修复点 2：在 dynamic-page 模式下，必须用 setCurrentPageAsync 切换页面 ===
                _33.sent();
                return [3 /*break*/, 148];
            case 147:
                figma.notify("⚠️ 该位置所在的页面已被删除！");
                return [2 /*return*/];
            case 148:
                // 2. 恢复视角坐标和缩放
                figma.viewport.center = { x: spot.centerX, y: spot.centerY };
                figma.viewport.zoom = spot.zoom;
                nodesToSelect = [];
                if (!(spot.selectionIds && Array.isArray(spot.selectionIds))) return [3 /*break*/, 152];
                _16 = 0, _17 = spot.selectionIds;
                _33.label = 149;
            case 149:
                if (!(_16 < _17.length)) return [3 /*break*/, 152];
                id = _17[_16];
                return [4 /*yield*/, figma.getNodeByIdAsync(id)];
            case 150:
                node = _33.sent();
                // 确保节点还存在，且不是页面本身 (防止意外)
                if (node && !node.removed && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
                    nodesToSelect.push(node);
                }
                _33.label = 151;
            case 151:
                _16++;
                return [3 /*break*/, 149];
            case 152:
                // 4. 执行选中
                if (nodesToSelect.length > 0) {
                    figma.currentPage.selection = nodesToSelect;
                }
                else {
                    // 如果图层被删了，清空当前选中项，视角依然过去 (补全了这里)
                    figma.currentPage.selection = [];
                }
                figma.notify("🚀 已传送！");
                return [3 /*break*/, 154];
            case 153:
                e_10 = _33.sent();
                console.warn("Jumpback failed:", e_10);
                figma.notify("传送失败，可能是图层结构已发生巨大改变");
                return [3 /*break*/, 154];
            case 154: return [3 /*break*/, 203];
            case 155:
                {
                    dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                    if (!dataStr)
                        return [2 /*return*/];
                    spots = JSON.parse(dataStr);
                    // 过滤掉要删除的 ID
                    spots = spots.filter(function (s) { return s.id !== msg.id; });
                    // 更新保存
                    figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                    // 重新渲染 UI
                    figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                    figma.notify("🗑️ 锚点已删除");
                    return [3 /*break*/, 203];
                }
                _33.label = 156;
            case 156:
                {
                    dataStr = figma.root.getPluginData('JUMPBACK_SPOTS');
                    if (!dataStr)
                        return [2 /*return*/];
                    spots = JSON.parse(dataStr);
                    index = spots.findIndex(function (s) { return s.id === msg.id; });
                    if (index > -1 && msg.newName.trim() !== '') {
                        spots[index].name = msg.newName.substring(0, 20); // 限制长度
                        figma.root.setPluginData('JUMPBACK_SPOTS', JSON.stringify(spots));
                        figma.notify("已重命名");
                    }
                    else {
                        // 如果名字为空，发回原数据恢复 UI
                        figma.ui.postMessage({ type: 'jb-render-spots', data: spots });
                    }
                    return [3 /*break*/, 203];
                }
                _33.label = 157;
            case 157:
                {
                    selection_11 = figma.currentPage.selection;
                    if (selection_11.length === 0)
                        return [2 /*return*/]; // 拖动滑块时高频触发，没选中就静默退出
                    r = (msg.rot * Math.PI) / 180;
                    sx = (msg.angleX * Math.PI) / 180;
                    sy = (msg.angleY * Math.PI) / 180;
                    cosR = Math.cos(r);
                    sinR = Math.sin(r);
                    tanX = Math.tan(sx);
                    tanY = Math.tan(sy);
                    m00 = cosR - sinR * tanY;
                    m01 = cosR * tanX - sinR;
                    m10 = sinR + cosR * tanY;
                    m11 = sinR * tanX + cosR;
                    try {
                        for (_18 = 0, selection_10 = selection_11; _18 < selection_10.length; _18++) {
                            node = selection_10[_18];
                            if ('relativeTransform' in node) {
                                tx = node.relativeTransform[0][2];
                                ty = node.relativeTransform[1][2];
                                newTransform = [
                                    [m00, m01, tx],
                                    [m10, m11, ty]
                                ];
                                node.relativeTransform = newTransform;
                            }
                        }
                    }
                    catch (error) {
                        console.error("Transform Engine failed:", error);
                    }
                    return [3 /*break*/, 203];
                }
                _33.label = 158;
            case 158:
                _33.trys.push([158, 160, , 161]);
                return [4 /*yield*/, figma.clientStorage.getAsync('MY_SKEW_PRESETS')];
            case 159:
                data = _33.sent();
                // 发送回前端渲染
                figma.ui.postMessage({ type: 'init-skew-presets', data: data || [] });
                return [3 /*break*/, 161];
            case 160:
                e_11 = _33.sent();
                console.warn("读取 Skew 预设失败", e_11);
                return [3 /*break*/, 161];
            case 161: return [3 /*break*/, 203];
            case 162:
                _33.trys.push([162, 164, , 165]);
                // 覆盖保存到用户的 Figma 账号下
                return [4 /*yield*/, figma.clientStorage.setAsync('MY_SKEW_PRESETS', msg.data)];
            case 163:
                // 覆盖保存到用户的 Figma 账号下
                _33.sent();
                return [3 /*break*/, 165];
            case 164:
                e_12 = _33.sent();
                console.warn("保存 Skew 预设失败", e_12);
                return [3 /*break*/, 165];
            case 165: return [3 /*break*/, 203];
            case 166:
                {
                    hasSelection = figma.currentPage.selection.length > 0;
                    figma.ui.postMessage({ type: 'i18n-check-selection-result', hasSelection: hasSelection });
                    return [3 /*break*/, 203];
                }
                _33.label = 167;
            case 167:
                scope = msg.scope, extractTarget = msg.extractTarget, collectionName = msg.collectionName;
                nodesToScan = scope === 'selection' ? __spreadArray([], figma.currentPage.selection, true) : __spreadArray([], figma.currentPage.children, true);
                textNodes_3 = [];
                return [4 /*yield*/, findText(nodesToScan)];
            case 168:
                _33.sent();
                return [4 /*yield*/, figma.variables.getLocalVariableCollectionsAsync()];
            case 169:
                allCollections = _33.sent();
                collectionNames = allCollections
                    .map(function (c) { return c.name; })
                    .sort(function (a, b) {
                    var aMatch = a.toLowerCase().includes('i18n') ? -1 : 1;
                    var bMatch = b.toLowerCase().includes('i18n') ? -1 : 1;
                    return aMatch - bMatch;
                });
                targetColName_1 = collectionName || "i18n Dictionary";
                i18nCollection = allCollections.find(function (c) { return c.name === targetColName_1; })
                    || allCollections.find(function (c) { return c.name.includes("i18n") || c.name.includes("Dictionary"); });
                modes_1 = [];
                existingVarMap = new Map();
                if (!i18nCollection) return [3 /*break*/, 171];
                origModeId_1 = i18nCollection.modes[0].modeId;
                i18nCollection.modes.forEach(function (m) {
                    if (m.modeId !== origModeId_1)
                        modes_1.push(m.name);
                });
                return [4 /*yield*/, figma.variables.getLocalVariablesAsync('STRING')];
            case 170:
                localVars = _33.sent();
                for (_19 = 0, localVars_1 = localVars; _19 < localVars_1.length; _19++) {
                    v = localVars_1[_19];
                    if (v.variableCollectionId === i18nCollection.id) {
                        origVal = v.valuesByMode[origModeId_1];
                        if (origVal)
                            existingVarMap.set(origVal, v);
                    }
                }
                _33.label = 171;
            case 171:
                boundCount = 0;
                mixedFonts = 0;
                autoBindMap = new Map();
                newTextMap = new Map();
                for (_20 = 0, textNodes_2 = textNodes_3; _20 < textNodes_2.length; _20++) {
                    node = textNodes_2[_20];
                    if (node.hasMissingFont)
                        continue;
                    if (node.fontName === figma.mixed) {
                        mixedFonts++;
                        continue;
                    }
                    if (extractTarget === 'unbound' && node.boundVariables && node.boundVariables['characters']) {
                        boundCount++;
                        continue;
                    }
                    text = node.characters.trim();
                    if (!text)
                        continue;
                    if (existingVarMap.has(text)) {
                        if (!autoBindMap.has(text))
                            autoBindMap.set(text, { variableId: existingVarMap.get(text).id, nodeIds: [] });
                        autoBindMap.get(text).nodeIds.push(node.id);
                    }
                    else {
                        if (!newTextMap.has(text))
                            newTextMap.set(text, { nodeIds: [] });
                        newTextMap.get(text).nodeIds.push(node.id);
                    }
                }
                figma.ui.postMessage({
                    type: 'i18n-detect-result',
                    data: {
                        totalNodes: textNodes_3.length,
                        boundCount: boundCount,
                        collections: collectionNames,
                        autoBindList: Array.from(autoBindMap.entries()).map(function (_a) {
                            var orig = _a[0], d = _a[1];
                            return (__assign({ original: orig }, d));
                        }),
                        newTextList: Array.from(newTextMap.entries()).map(function (_a) {
                            var orig = _a[0], d = _a[1];
                            return (__assign({ original: orig }, d));
                        }),
                        modes: modes_1
                    }
                });
                return [3 /*break*/, 203];
            case 172:
                newPayload = msg.newPayload, autoBindPayload = msg.autoBindPayload, isCreate = msg.isCreate, collectionName_1 = msg.collectionName;
                _33.label = 173;
            case 173:
                _33.trys.push([173, 183, , 184]);
                return [4 /*yield*/, figma.variables.getLocalVariableCollectionsAsync()];
            case 174:
                collections = _33.sent();
                collection = collections.find(function (c) { return c.name === collectionName_1; });
                // 1. 确保 Collection 存在
                if (!collection) {
                    collection = figma.variables.createVariableCollection(collectionName_1);
                    collection.renameMode(collection.modes[0].modeId, 'Original');
                }
                origModeId = collection.modes[0].modeId;
                allTargetLangs_1 = new Set();
                newPayload.forEach(function (item) { return Object.keys(item.translations).forEach(function (l) { return allTargetLangs_1.add(l); }); });
                modeIdMap_1 = {};
                collection.modes.forEach(function (m) { return modeIdMap_1[m.name] = m.modeId; });
                for (_21 = 0, _22 = Array.from(allTargetLangs_1); _21 < _22.length; _21++) {
                    lang = _22[_21];
                    if (!modeIdMap_1[lang]) {
                        try {
                            newModeId = collection.addMode(lang);
                            modeIdMap_1[lang] = newModeId;
                        }
                        catch (e) {
                            // 弹出明确的 Plan 限制提示
                            figma.ui.postMessage({
                                type: 'i18n-bind-error',
                                error: "\u65E0\u6CD5\u521B\u5EFA \"".concat(lang, "\" \u5217\u3002\n\u539F\u56E0\uFF1AFigma \u514D\u8D39\u7248\u9650\u5236\u6BCF\u4E2A\u5408\u96C6\u53EA\u80FD\u6709 1 \u4E2A Mode\uFF08\u5F53\u524D\u5DF2\u6709 \"Original\"\uFF09\u3002\n\n\u5EFA\u8BAE\uFF1A\n1. \u5347\u7EA7 Figma \u56E2\u961F\u7248\n2. \u6216\u4F7F\u7528\u63D2\u4EF6\u7684 \"\u26A1 \u76F4\u63A5\u66FF\u6362\" \u6A21\u5F0F\u3002")
                            });
                            return [2 /*return*/]; // 终止执行
                        }
                    }
                }
                return [4 /*yield*/, figma.variables.getLocalVariablesAsync('STRING')];
            case 175:
                localVars = _33.sent();
                varMap = new Map();
                for (_23 = 0, localVars_2 = localVars; _23 < localVars_2.length; _23++) {
                    v = localVars_2[_23];
                    if (v.variableCollectionId === collection.id) {
                        baseVal = v.valuesByMode[origModeId];
                        if (baseVal)
                            varMap.set(baseVal, v);
                    }
                }
                _24 = 0, newPayload_1 = newPayload;
                _33.label = 176;
            case 176:
                if (!(_24 < newPayload_1.length)) return [3 /*break*/, 182];
                item = newPayload_1[_24];
                variable = varMap.get(item.original);
                // 如果不存在则创建
                if (!variable) {
                    safeName = item.original.slice(0, 15).replace(/[.*{}\/\\\r\n\t]/g, '_').trim() || 'text';
                    varName = "i18n/".concat(safeName, "_").concat(Math.random().toString(36).substring(2, 6));
                    variable = figma.variables.createVariable(varName, collection, 'STRING');
                    variable.setValueForMode(origModeId, item.original);
                }
                // 【核心修复】：为该变量在所有目标 Mode 中设置翻译值
                for (_25 = 0, _26 = Object.entries(item.translations); _25 < _26.length; _25++) {
                    _27 = _26[_25], langName = _27[0], translatedText = _27[1];
                    targetModeId = modeIdMap_1[langName];
                    if (targetModeId) {
                        variable.setValueForMode(targetModeId, translatedText);
                    }
                }
                _28 = 0, _29 = item.nodeIds;
                _33.label = 177;
            case 177:
                if (!(_28 < _29.length)) return [3 /*break*/, 181];
                nodeId = _29[_28];
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 178:
                node = _33.sent();
                if (!(node && node.type === 'TEXT' && node.fontName !== figma.mixed)) return [3 /*break*/, 180];
                return [4 /*yield*/, figma.loadFontAsync(node.fontName)];
            case 179:
                _33.sent();
                node.setBoundVariable('characters', variable);
                _33.label = 180;
            case 180:
                _28++;
                return [3 /*break*/, 177];
            case 181:
                _24++;
                return [3 /*break*/, 176];
            case 182:
                figma.ui.postMessage({ type: 'i18n-bind-success', message: '🎉 多语言 Mode 已同步更新！' });
                return [3 /*break*/, 184];
            case 183:
                e_13 = _33.sent();
                figma.ui.postMessage({ type: 'i18n-bind-error', error: e_13.message });
                return [3 /*break*/, 184];
            case 184: return [3 /*break*/, 203];
            case 185:
                payload = msg.payload;
                successCount = 0;
                _33.label = 186;
            case 186:
                _33.trys.push([186, 197, , 198]);
                _30 = 0, payload_1 = payload;
                _33.label = 187;
            case 187:
                if (!(_30 < payload_1.length)) return [3 /*break*/, 196];
                item = payload_1[_30];
                targetText = Object.values(item.translations)[0];
                _31 = 0, _32 = item.nodeIds;
                _33.label = 188;
            case 188:
                if (!(_31 < _32.length)) return [3 /*break*/, 195];
                nodeId = _32[_31];
                _33.label = 189;
            case 189:
                _33.trys.push([189, 193, , 194]);
                return [4 /*yield*/, figma.getNodeByIdAsync(nodeId)];
            case 190:
                node = _33.sent();
                if (!(node && node.type === 'TEXT' && node.fontName !== figma.mixed)) return [3 /*break*/, 192];
                return [4 /*yield*/, figma.loadFontAsync(node.fontName)];
            case 191:
                _33.sent();
                // 【核心修复】：直接替换前，必须解除已有的变量绑定，否则必定被 Figma API 拦截失败！
                node.setBoundVariable('characters', null);
                node.characters = targetText;
                successCount++;
                _33.label = 192;
            case 192: return [3 /*break*/, 194];
            case 193:
                e_14 = _33.sent();
                console.warn("\u8282\u70B9\u66FF\u6362\u5931\u8D25", e_14);
                return [3 /*break*/, 194];
            case 194:
                _31++;
                return [3 /*break*/, 188];
            case 195:
                _30++;
                return [3 /*break*/, 187];
            case 196:
                figma.ui.postMessage({ type: 'i18n-bind-success', message: "\uD83C\uDF89 \u6210\u529F\u66FF\u6362\u4E86 ".concat(successCount, " \u4E2A\u6587\u672C\u8282\u70B9\uFF01") });
                return [3 /*break*/, 198];
            case 197:
                e_15 = _33.sent();
                figma.ui.postMessage({ type: 'i18n-bind-error', error: e_15.message });
                return [3 /*break*/, 198];
            case 198: return [3 /*break*/, 203];
            case 199: 
            // 记录开始拖拽时的状态
            return [3 /*break*/, 203];
            case 200:
                {
                    dx = msg.clientX - msg.startX;
                    dy = msg.clientY - msg.startY;
                    newW = Math.max(170, msg.startW + dx);
                    newH = Math.max(200, msg.startH + dy);
                    figma.ui.resize(newW, newH);
                    return [3 /*break*/, 203];
                }
                _33.label = 201;
            case 201: 
            // 结束拖拽
            return [3 /*break*/, 203];
            case 202:
                figma.ui.resize(msg.width, msg.height);
                return [3 /*break*/, 203];
            case 203: return [2 /*return*/];
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
    for (var _i = 0, selection_13 = selection; _i < selection_13.length; _i++) {
        var node = selection_13[_i];
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
                        var name, isUserTarget, isTechTarget, bytes, image, rect, e_21, children, _i, children_1, child;
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
                                    e_21 = _b.sent();
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!('children' in node)) return [3 /*break*/, 8];
                                    children = __spreadArray([], node.children, true);
                                    _i = 0, children_1 = children;
                                    _b.label = 5;
                                case 5:
                                    if (!(_i < children_1.length)) return [3 /*break*/, 8];
                                    child = children_1[_i];
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
        var _i, slides_3, slide, hasNested, loopCount, children, i, node, rect, _a, _b, node, font, e_22;
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
                    e_22 = _c.sent();
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
        var imgCount, i, slide, children, j, node, isTarget, bytes, fileName, e_23;
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
                    e_23 = _a.sent();
                    console.error(e_23);
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
