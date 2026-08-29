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
        let processedWords: string[] = Array.from(words);

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
mg.showUI(__html__, { width: 460, height: 640 });

// MasterGo 与原插件的 UI 消息封装不同。保持既有 pluginMessage 协议，
// 这样前端功能和事件监听可以逐项等价复用。
const sendToUI = (message: any) => mg.ui.postMessage({ pluginMessage: message });

const toMGColor = (color: any, alpha?: number): RGBA => ({
  r: Number(color?.r ?? 0),
  g: Number(color?.g ?? 0),
  b: Number(color?.b ?? 0),
  a: Number(alpha ?? color?.a ?? color?.opacity ?? 1)
});

const solidPaint = (color: any, alpha = 1): SolidPaint => ({
  type: 'SOLID',
  color: toMGColor(color, alpha)
});
const paintAlpha = (paint: any) => paint?.type === 'SOLID' ? Number(paint?.color?.a ?? 1) : Number(paint?.alpha ?? 1);

const isNodeVisible = (node: any) => node?.isVisible !== false;
const isNodeLocked = (node: any) => node?.isLocked === true;
const setNodeVisible = (node: any, value: boolean) => trySet(node, 'isVisible', value);
const setNodeLocked = (node: any, value: boolean) => trySet(node, 'isLocked', value);

const textSegmentAt = (node: any, index = 0) =>
  node?.textStyles?.find((segment: any) => index >= segment.start && index < segment.end) || node?.textStyles?.[0] || null;
const firstTextSegment = (node: any, index = 0) => textSegmentAt(node, index)?.textStyle || null;
const getTextFontName = (node: any, index = 0): FontName | null => firstTextSegment(node, index)?.fontName || null;
const getTextFontSize = (node: any, index = 0): number => Number(firstTextSegment(node, index)?.fontSize ?? 12);
const getTextLineHeight = (node: any, index = 0): LineHeight => firstTextSegment(node, index)?.lineHeight || { unit: 'AUTO' };
const getTextLetterSpacing = (node: any, index = 0): LetterSpacing => firstTextSegment(node, index)?.letterSpacing || { unit: 'PIXELS', value: 0 };
const getTextDecoration = (node: any, index = 0): TextDecoration => firstTextSegment(node, index)?.textDecoration || 'NONE';
const getTextStyleId = (node: any, index = 0): string => textSegmentAt(node, index)?.textStyleId || '';
const getTextFills = (node: any, index = 0): Paint[] => textSegmentAt(node, index)?.fills || [];
const loadTextFonts = async (node: any) => {
  const fonts = new Map<string, FontName>();
  for (const segment of node?.textStyles || []) {
    const font = segment?.textStyle?.fontName;
    if (font) fonts.set(`${font.family}\u0000${font.style}`, font);
  }
  if (fonts.size === 0) {
    const font = getTextFontName(node);
    if (font) fonts.set(`${font.family}\u0000${font.style}`, font);
  }
  for (const font of fonts.values()) await mg.loadFontAsync(font);
};
const fullTextEnd = (node: any) => Math.max(0, String(node?.characters || '').length);
const setTextFontName = (node: any, value: FontName) => node.setRangeFontName(0, fullTextEnd(node), value);
const setTextFontSize = (node: any, value: number) => node.setRangeFontSize(0, fullTextEnd(node), value);
const setTextLineHeight = (node: any, value: LineHeight) => node.setRangeLineHeight(0, fullTextEnd(node), value);
const setTextLetterSpacing = (node: any, value: LetterSpacing) => node.setRangeLetterSpacing(0, fullTextEnd(node), value);
const setTextDecoration = (node: any, value: TextDecoration) => node.setRangeTextDecoration(0, fullTextEnd(node), value);
const setTextStyleId = (node: any, value: string) => node.setRangeTextStyleId(0, fullTextEnd(node), value);

const alignToMasterGo = (value: any) => ({
  MIN: 'FLEX_START',
  MAX: 'FLEX_END',
  SPACE_BETWEEN: 'SPACING_BETWEEN'
} as Record<string, string>)[value] || value;

const setHorizontalSizing = (node: any, value: 'FIXED' | 'HUG' | 'FILL') => {
  if (node?.flexMode === 'HORIZONTAL' && value !== 'FILL') node.mainAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
  if (node?.flexMode === 'VERTICAL' && value !== 'FILL') node.crossAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
  const parentMode = node?.parent?.flexMode;
  if (parentMode === 'HORIZONTAL') node.flexGrow = value === 'FILL' ? 1 : 0;
  else if (parentMode === 'VERTICAL') node.alignSelf = value === 'FILL' ? 'STRETCH' : 'INHERIT';
};

const setVerticalSizing = (node: any, value: 'FIXED' | 'HUG' | 'FILL') => {
  if (node?.flexMode === 'VERTICAL' && value !== 'FILL') node.mainAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
  if (node?.flexMode === 'HORIZONTAL' && value !== 'FILL') node.crossAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
  const parentMode = node?.parent?.flexMode;
  if (parentMode === 'VERTICAL') node.flexGrow = value === 'FILL' ? 1 : 0;
  else if (parentMode === 'HORIZONTAL') node.alignSelf = value === 'FILL' ? 'STRETCH' : 'INHERIT';
};

const setStrokeDashes = (node: any, value: number[]) => trySet(node, 'strokeDashes', value);

const ungroupNode = (group: any) => {
  if (!group || group.type !== 'GROUP' || !group.parent || !Array.isArray(group.children)) return [];
  const parent: any = group.parent;
  const startIndex = Array.from(parent.children || []).indexOf(group);
  const children = [...group.children];
  children.forEach((child, index) => parent.insertChild(Math.max(0, startIndex) + index, child));
  group.remove();
  return children;
};

const groupInParent = (nodes: SceneNode[], parent?: any) => {
  const group = mg.group(nodes);
  if (parent && group.parent !== parent) parent.appendChild(group);
  return group;
};

const jumpbackStorageKey = () => `JUMPBACK_SPOTS_${mg.documentId}`;
const loadJumpbackSpots = async (): Promise<any[]> => (await mg.clientStorage.getAsync(jumpbackStorageKey())) || [];
const saveJumpbackSpots = async (spots: any[]) => mg.clientStorage.setAsync(jumpbackStorageKey(), spots);

let imageSizeRequestIndex = 0;
const imageSizeWaiters = new Map<string, (size: { width: number; height: number } | null) => void>();
const requestImageSize = (bytes: Uint8Array) => new Promise<{ width: number; height: number } | null>((resolve) => {
  const reqId = `mg-image-size-${Date.now()}-${++imageSizeRequestIndex}`;
  imageSizeWaiters.set(reqId, resolve);
  sendToUI({ type: 'mg-image-size-request', reqId, bytes });
  setTimeout(() => {
    if (!imageSizeWaiters.has(reqId)) return;
    imageSizeWaiters.delete(reqId);
    resolve(null);
  }, 10000);
});

// MasterGo 的 STRING 变量已支持 textContent 作用域，但当前公开文档中的
// 图层绑定参数尚未列出文本内容。这里优先尝试原生 characters 绑定，并在
// API 版本不支持时写入节点插件数据，由下面的轻量同步器保持 Mode 切换能力。
const I18N_BINDING_DATA_KEY = 'allinone-i18n-binding';
const i18nFallbackNodeIds = new Set<string>();
const getSimpleVariableValue = (variable: any, modeId: string): any => {
  const values = variable?.modes?.[modeId];
  if (!Array.isArray(values) || values.length === 0) return undefined;
  const first = values[0];
  return first && typeof first === 'object' && 'value' in first ? first.value : first;
};

const getNodeI18nBinding = (node: any): any | null => {
  try {
    const raw = node?.getPluginData?.(I18N_BINDING_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const bindI18nVariableToText = async (node: any, variable: Variable) => {
  await loadTextFonts(node);
  try { await mg.variables.setVariableScopes(variable.id, ['textContent']); } catch (_) {}

  let native = false;
  try {
    await (mg.variables.setVariableReferenceInLayer as any)({
      id: variable.id,
      layerId: node.id,
      textProperty: 'characters'
    });
    native = true;
  } catch (_) {
    // 部分 MasterGo API 版本仅开放字体类 textProperty，交给兼容同步器处理。
  }

  node.setPluginData(I18N_BINDING_DATA_KEY, JSON.stringify({
    variableId: variable.id,
    collectionId: variable.collectionId,
    fallback: !native
  }));
  if (native) i18nFallbackNodeIds.delete(node.id);
  else i18nFallbackNodeIds.add(node.id);
};

const unlinkI18nVariableFromText = async (node: any) => {
  try {
    await (mg.variables.unlinkVariableReferenceInLayer as any)({
      layerId: node.id,
      textProperty: 'characters'
    });
  } catch (_) {}
  try { node.removePluginData(I18N_BINDING_DATA_KEY); } catch (_) {}
  i18nFallbackNodeIds.delete(node.id);
};

const discoverMasterGoI18nFallbackBindings = () => {
  for (const node of mg.document.currentPage.findAll((candidate: any) => candidate.type === 'TEXT') as TextNode[]) {
    if (getNodeI18nBinding(node)?.fallback) i18nFallbackNodeIds.add(node.id);
  }
};

let syncingI18nFallback = false;
const syncMasterGoI18nFallbackBindings = async () => {
  if (syncingI18nFallback) return;
  syncingI18nFallback = true;
  try {
    for (const nodeId of [...i18nFallbackNodeIds]) {
      const node = mg.getNodeById(nodeId);
      if (!node || node.removed || node.type !== 'TEXT') {
        i18nFallbackNodeIds.delete(nodeId);
        continue;
      }
      const binding = getNodeI18nBinding(node);
      if (!binding?.fallback) {
        i18nFallbackNodeIds.delete(nodeId);
        continue;
      }
      const variable = mg.variables.getVariableById(binding.variableId);
      if (!variable) continue;
      const collectionModes = mg.variables.getModes(binding.collectionId);
      const layerModes = mg.variables.getLayerVariableModes(node.id);
      const modeId = layerModes.find(item => item.collectionId === binding.collectionId)?.modeId
        || collectionModes[0]?.id;
      if (!modeId) continue;
      const value = getSimpleVariableValue(variable, modeId);
      if (typeof value !== 'string' || value === node.characters) continue;
      await loadTextFonts(node);
      node.characters = value;
    }
  } catch (error) {
    console.warn('MasterGo i18n fallback sync failed', error);
  } finally {
    syncingI18nFallback = false;
  }
};

setTimeout(() => {
  discoverMasterGoI18nFallbackBindings();
  syncMasterGoI18nFallbackBindings();
}, 0);
setInterval(syncMasterGoI18nFallbackBindings, 1000);
mg.on('currentpagechange', () => {
  i18nFallbackNodeIds.clear();
  discoverMasterGoI18nFallbackBindings();
  syncMasterGoI18nFallbackBindings();
});

// 用于存储高亮前的原始样式： Key = "NodeID_Index", Value = OriginalFills
let highlightCache = {};
let layerSortDirection = 'asc'; // 用于图层排序切换，默认从上到下
let layerNameSortDirection = 'asc'; // 用于按名称排序切换，默认 A→Z

const trySet = (dst: any, propName: string, value: any) => {
  try { dst[propName] = value; } catch (e) {}
};

const trySetDefined = (dst: any, propName: string, value: any) => {
  if (value !== undefined) trySet(dst, propName, value);
};

const safeRead = <T>(reader: () => T, fallback: T): T => {
  try { return reader(); } catch (_) { return fallback; }
};

const safeNodeValue = (node: any, propName: string) =>
  safeRead(() => node[propName], undefined as any);

const isActiveAutoLayoutNode = (node: any) => {
  const flexMode = safeNodeValue(node, 'flexMode');
  return flexMode === 'HORIZONTAL' || flexMode === 'VERTICAL';
};

const isInsideActiveAutoLayout = (node: any) => {
  const parent = safeRead(() => node?.parent, null as any);
  return isActiveAutoLayoutNode(parent);
};

const canSetAutoLayoutBounds = (node: any) =>
  isActiveAutoLayoutNode(node) || isInsideActiveAutoLayout(node);

const tryCopyNodeValue = (src: any, dst: any, propName: string) => {
  const value = safeNodeValue(src, propName);
  if (value !== undefined) trySet(dst, propName, value);
};

const tryCopyNodeJson = (src: any, dst: any, propName: string) => {
  const value = safeNodeValue(src, propName);
  if (value === undefined || value === mg.mixed) return;
  trySet(dst, propName, safeRead(() => JSON.parse(JSON.stringify(value)), value));
};

// FrameNode 上 cornerRadius 是只读的，需要通过四个独立角设置
const safeCornerRadius = (node: any, radius: number) => {
  try { node.cornerRadius = radius; } catch (e) {
    try { node.topLeftRadius = radius; } catch (_) {}
    try { node.topRightRadius = radius; } catch (_) {}
    try { node.bottomLeftRadius = radius; } catch (_) {}
    try { node.bottomRightRadius = radius; } catch (_) {}
  }
};

function copyNodeStyles(src: SceneNode, dst: SceneNode) {
  [
    'opacity', 'blendMode', 'isMask', 'isMaskOutline', 'isMaskVisible',
    'isVisible', 'isLocked', 'rotation', 'constraints',
    'expanded', 'scaleFactor', 'fillStyleId', 'strokeStyleId', 'strokeFillStyleId',
    'strokeWidthStyleId', 'paddingStyleId', 'spacingStyleId', 'cornerRadiusStyleId',
    'strokeWeight', 'strokeAlign', 'strokeJoin', 'strokeCap', 'strokeStyle', 'dashCap',
    'strokeMiterLimit', 'effectStyleId', 'clipsContent', 'constrainProportions',
    'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight',
    'gridStyleId'
  ].forEach(propName => tryCopyNodeValue(src, dst, propName));

  ['exportSettings', 'fills', 'strokes', 'strokeDashes', 'effects', 'layoutGrids']
    .forEach(propName => tryCopyNodeJson(src, dst, propName));

  const cornerRadius = safeNodeValue(src, 'cornerRadius');
  if (cornerRadius !== undefined && cornerRadius !== mg.mixed) {
    trySet(dst, 'cornerRadius', cornerRadius);
  } else if (cornerRadius === mg.mixed) {
    ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
      .forEach(propName => tryCopyNodeValue(src, dst, propName));
  }
  const cornerSmooth = safeNodeValue(src, 'cornerSmooth');
  if (cornerSmooth !== undefined && cornerSmooth !== mg.mixed) {
    trySet(dst, 'cornerSmooth', cornerSmooth);
  }

  const flexMode = safeNodeValue(src, 'flexMode');
  if (flexMode !== undefined && dst.type !== 'RECTANGLE') {
    // 先启用 Auto Layout，再写入仅在 Auto Layout 上合法的尺寸和排列属性。
    tryCopyNodeValue(src, dst, 'flexMode');
    tryCopyNodeValue(src, dst, 'overflowDirection');
    if (flexMode !== 'NONE') {
      [
        'mainAxisSizingMode', 'crossAxisSizingMode',
        'mainAxisAlignItems', 'crossAxisAlignItems', 'crossAxisAlignContent',
        'crossAxisSpacing', 'strokesIncludedInLayout', 'itemReverseZIndex',
        'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing',
        'flexWrap'
      ].forEach(propName => tryCopyNodeValue(src, dst, propName));
    }
  }

  if (canSetAutoLayoutBounds(dst)) {
    ['minWidth', 'maxWidth', 'minHeight', 'maxHeight']
      .forEach(propName => tryCopyNodeValue(src, dst, propName));
  }
  if (isInsideActiveAutoLayout(dst)) {
    ['layoutPositioning', 'alignSelf', 'flexGrow']
      .forEach(propName => tryCopyNodeValue(src, dst, propName));
  }

  // reactions 中可能含已删除节点的 destinationId，必须在节点 ID 映射完成后单独恢复。
}

// -------------------------------------------------------------
// Component Builder：Frame → Component / Component Set，及实例逆向母版
// -------------------------------------------------------------
type BuilderPropertySnapshot = {
  name: string;
  id?: string;
  type: ComponentPropertyType;
  value: string | boolean;
  preferredValues?: InstanceSwapPreferredValue[];
  alias?: string;
  valueAlias?: string;
  variantOptions?: string[];
  variantOptionsAlias?: string[];
  variableId?: string;
  skippedVariableId?: string;
};

type ReverseRecoveryMode = 'native' | 'structure' | 'raster';

type ReverseComponentBuild = {
  component: ComponentNode;
  nodeStates: BuilderNodeStateSnapshot[];
  recoveryMode: ReverseRecoveryMode;
};

type ReversedVariantRecord = ReverseComponentBuild & {
  sourceComponent: ComponentNode;
  references: BuilderReferenceSnapshot[];
};

type BuilderReferenceSnapshot = {
  path: number[];
  nodeName: string;
  nodeType: SceneNode['type'];
  references: { isVisible?: string; characters?: string; mainComponent?: string };
  instanceMainComponentId?: string;
};

type BuilderNodeStateSnapshot = {
  path: number[];
  nodeName: string;
  nodeType: SceneNode['type'];
  isVisible: boolean;
  isLocked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  layoutPositioning?: 'AUTO' | 'ABSOLUTE';
  alignSelf?: 'STRETCH' | 'INHERIT';
  flexGrow?: 0 | 1;
  minWidth?: number | null;
  maxWidth?: number | null;
  minHeight?: number | null;
  maxHeight?: number | null;
};

type BuilderReactionSnapshot = {
  path: number[];
  nodeId: string;
  nodeName: string;
  nodeType: SceneNode['type'];
  reactions: any[];
  clearInvalid?: boolean;
};

type BuilderPlacement = {
  x: number;
  y: number;
};

type BuilderBounds = BuilderPlacement & {
  width: number;
  height: number;
};

const copyPluginData = (src: SceneNode, dst: SceneNode) => {
  const keys = safeRead(() => src.getPluginDataKeys() || [], [] as string[]);
  for (const key of keys) {
    try { dst.setPluginData(key, src.getPluginData(key)); } catch (_) {}
  }
};

const getChildren = (node: any): ReadonlyArray<SceneNode> => {
  try {
    return node?.children ? Array.from(node.children) as SceneNode[] : [];
  } catch (_) {
    return [];
  }
};

const safeMainComponent = (instance: InstanceNode): ComponentNode | null => {
  try { return instance.mainComponent; } catch (_) { return null; }
};

const safeMainComponentId = (instance: InstanceNode) =>
  safeRead(() => safeMainComponent(instance)?.id, undefined as string | undefined);

const safeNodeById = (id: string | boolean | undefined): SceneNode | null => {
  if (typeof id !== 'string' || !id) return null;
  try {
    const node = mg.getNodeById(id);
    return node && !node.removed && 'type' in node ? node as SceneNode : null;
  } catch (_) {
    return null;
  }
};

const safeRemoveNode = (node: any | null | undefined) => {
  if (!node) return;
  try {
    if (!node.removed) node.remove();
  } catch (_) {}
};

const describeReverseFailure = (error: unknown) => {
  const detail = String((error as any)?.message || error);
  const missingNode = detail.match(/The node with id ["']?([^"'\s]+)["']? does not exist/i);
  if (missingNode) {
    return `组件仍包含已删除的节点引用（${missingNode[1]}），且结构复制与视觉快照均无法读取`;
  }
  return detail;
};

const getNodeBounds = (node: SceneNode): BuilderBounds | null => {
  const bounds = safeRead(() => node.absoluteBoundingBox, null as BuilderBounds | null);
  if (!bounds) return null;
  if (![bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite)) return null;
  return bounds;
};

const boundsOverlap = (a: BuilderBounds, b: BuilderBounds) =>
  a.x < b.x + b.width
  && a.x + a.width > b.x
  && a.y < b.y + b.height
  && a.y + a.height > b.y;

const getReversePlacement = (
  source: InstanceNode,
  targetWidth?: number,
  targetHeight?: number,
  excludedTargets: SceneNode[] = []
): BuilderPlacement => {
  const fallbackBounds = {
    x: safeRead(() => source.x, 0),
    y: safeRead(() => source.y, 0),
    width: safeRead(() => source.width, 0),
    height: safeRead(() => source.height, 0)
  };
  const bounds = safeRead(
    () => source.absoluteBoundingBox,
    fallbackBounds
  );
  const placement = {
    x: bounds.x + bounds.width + 48,
    y: bounds.y
  };

  // 连续逆向同一实例时，沿右侧继续排布，避免新母版彼此覆盖。
  // 包含 source 的顶层祖先必须排除，否则候选区域会永远与原画板相交。
  const excludedIds = new Set<string>();
  let ancestor: any = source;
  while (ancestor) {
    excludedIds.add(ancestor.id);
    ancestor = safeRead(() => ancestor?.parent || null, null);
  }
  excludedTargets.forEach(node => excludedIds.add(node.id));
  const blockers = getChildren(mg.document.currentPage)
    .filter(node => !excludedIds.has(node.id))
    .map(getNodeBounds)
    .filter((item): item is BuilderBounds => Boolean(item));
  const candidate: BuilderBounds = {
    ...placement,
    width: Math.max(0.01, targetWidth ?? bounds.width),
    height: Math.max(0.01, targetHeight ?? bounds.height)
  };
  for (let attempt = 0; attempt < 100; attempt++) {
    const collisions = blockers.filter(item => boundsOverlap(candidate, item));
    if (collisions.length === 0) break;
    candidate.x = Math.max(...collisions.map(item => item.x + item.width + 48));
  }
  return { x: candidate.x, y: candidate.y };
};

const placeReverseTarget = (target: SceneNode, placement: BuilderPlacement) => {
  trySet(target, 'x', placement.x);
  trySet(target, 'y', placement.y);
};

const captureReactionSnapshots = (
  root: SceneNode,
  warnings: string[]
): BuilderReactionSnapshot[] => {
  const snapshots: BuilderReactionSnapshot[] = [];
  const visit = (node: SceneNode, path: number[]) => {
    let reactions: any[] = [];
    let clearInvalid = false;
    try {
      const value = (node as any).reactions;
      if (Array.isArray(value) && value.length > 0) {
        reactions = JSON.parse(JSON.stringify(value));
      }
    } catch (error) {
      clearInvalid = true;
      warnings.push(`图层“${safeRead(() => node.name, '未命名')}”包含失效的原型目标，已跳过其交互`);
    }
    snapshots.push({
      path,
      nodeId: node.id,
      nodeName: safeRead(() => node.name, '未命名'),
      nodeType: node.type,
      reactions,
      clearInvalid
    });
    getChildren(node).forEach((child, index) => visit(child, [...path, index]));
  };
  visit(root, []);
  return snapshots;
};

const restoreReactionSnapshots = (
  root: SceneNode,
  snapshots: BuilderReactionSnapshot[],
  warnings: string[]
) => {
  const targets = new Map<BuilderReactionSnapshot, SceneNode>();
  const idMap = new Map<string, string>();
  snapshots.forEach(snapshot => {
    const candidate = snapshot.path.length === 0 ? root : resolveNodePath(root, snapshot.path);
    const target = candidate && safeRead(() => candidate.name, '') === snapshot.nodeName
      ? candidate
      : null;
    if (!target) return;
    targets.set(snapshot, target);
    idMap.set(snapshot.nodeId, target.id);
  });

  snapshots.forEach(snapshot => {
    const target = targets.get(snapshot);
    if (!target) return;
    if (snapshot.reactions.length === 0 && !snapshot.clearInvalid) return;
    const reactions = snapshot.reactions.flatMap(reaction => {
      const cloned = safeRead(() => JSON.parse(JSON.stringify(reaction)), null as any);
      if (!cloned) return [];
      const destinationId = cloned.action?.destinationId;
      if (typeof destinationId === 'string' && destinationId) {
        const mappedId = idMap.get(destinationId) || destinationId;
        cloned.action.destinationId = mappedId;
        if (cloned.action.type === 'NODE' && !safeNodeById(mappedId)) {
          warnings.push(`图层“${snapshot.nodeName}”的原型目标已不存在，已跳过该交互`);
          return [];
        }
      }
      return [cloned];
    });
    try {
      (target as any).reactions = reactions;
    } catch (error) {
      warnings.push(`图层“${snapshot.nodeName}”的原型交互未能恢复`);
    }
  });
};

const captureComponentReferences = (root: SceneNode): BuilderReferenceSnapshot[] => {
  const snapshots: BuilderReferenceSnapshot[] = [];
  const visit = (node: SceneNode, path: number[]) => {
    let refs: BuilderReferenceSnapshot['references'] | null = null;
    try { refs = (node as any).componentPropertyReferences; } catch (_) {}
    if (refs && Object.keys(refs).length > 0) {
      snapshots.push({
        path,
        nodeName: node.name,
        nodeType: node.type,
        references: { ...refs },
        instanceMainComponentId: node.type === 'INSTANCE'
          ? safeMainComponentId(node as InstanceNode)
          : undefined
      });
    }
    // MasterGo 不允许把外层组件属性绑定到实例内部的更深子层。
    if (node.type === 'INSTANCE') return;
    getChildren(node).forEach((child, index) => visit(child, [...path, index]));
  };
  getChildren(root).forEach((child, index) => visit(child, [index]));
  return snapshots;
};

const captureNodeStates = (root: SceneNode): BuilderNodeStateSnapshot[] => {
  const snapshots: BuilderNodeStateSnapshot[] = [];
  const visit = (node: SceneNode, path: number[]) => {
    snapshots.push({
      path,
      nodeName: safeRead(() => node.name, '未命名'),
      nodeType: node.type,
      isVisible: safeRead(() => node.isVisible, true),
      isLocked: safeRead(() => node.isLocked, false),
      x: safeRead(() => node.x, 0),
      y: safeRead(() => node.y, 0),
      width: safeRead(() => node.width, 0.01),
      height: safeRead(() => node.height, 0.01),
      layoutPositioning: safeNodeValue(node, 'layoutPositioning'),
      alignSelf: safeNodeValue(node, 'alignSelf'),
      flexGrow: safeNodeValue(node, 'flexGrow'),
      minWidth: safeNodeValue(node, 'minWidth'),
      maxWidth: safeNodeValue(node, 'maxWidth'),
      minHeight: safeNodeValue(node, 'minHeight'),
      maxHeight: safeNodeValue(node, 'maxHeight')
    });
    getChildren(node).forEach((child, index) => visit(child, [...path, index]));
  };
  getChildren(root).forEach((child, index) => visit(child, [index]));
  return snapshots;
};

const resolveNodePath = (root: SceneNode, path: number[]): SceneNode | null => {
  let current: any = root;
  for (const index of path) {
    const children = getChildren(current);
    if (!children[index]) return null;
    current = children[index];
  }
  return current as SceneNode;
};

const resolveSnapshotNode = (
  root: SceneNode,
  snapshot: Pick<BuilderReferenceSnapshot, 'path' | 'nodeName' | 'nodeType'>
) => {
  const target = resolveNodePath(root, snapshot.path);
  if (!target || target.type !== snapshot.nodeType || target.name !== snapshot.nodeName) return null;
  return target;
};

const restoreNodeStates = (
  root: SceneNode,
  snapshots: BuilderNodeStateSnapshot[],
  restoreLayout: boolean
) => {
  // 先恢复深层节点，再恢复父层；父层最终尺寸变化会让 FILL 子层按正确规则重新计算。
  const layoutOrder = [...snapshots].sort((a, b) => b.path.length - a.path.length);
  layoutOrder.forEach(snapshot => {
    const node = resolveSnapshotNode(root, snapshot);
    if (!node) return;

    // resize/x/y 必须早于 FILL 对应的 alignSelf/flexGrow，否则会把“充满”重新切成固定。
    if (restoreLayout) {
      try { (node as any).resize(Math.max(0.01, snapshot.width), Math.max(0.01, snapshot.height)); } catch (_) {}
      trySet(node, 'x', snapshot.x);
      trySet(node, 'y', snapshot.y);
      if (canSetAutoLayoutBounds(node)) {
        trySetDefined(node, 'minWidth', snapshot.minWidth);
        trySetDefined(node, 'maxWidth', snapshot.maxWidth);
        trySetDefined(node, 'minHeight', snapshot.minHeight);
        trySetDefined(node, 'maxHeight', snapshot.maxHeight);
      }
      if (isInsideActiveAutoLayout(node)) {
        trySetDefined(node, 'layoutPositioning', snapshot.layoutPositioning);
        trySetDefined(node, 'alignSelf', snapshot.alignSelf);
        trySetDefined(node, 'flexGrow', snapshot.flexGrow);
        if (snapshot.layoutPositioning === 'ABSOLUTE') {
          trySet(node, 'x', snapshot.x);
          trySet(node, 'y', snapshot.y);
        }
      }
    }
  });

  snapshots.forEach(snapshot => {
    const node = resolveSnapshotNode(root, snapshot);
    if (!node) return;
    // 属性引用回绑可能立即应用默认值；最后再恢复实例当下真实的显隐状态。
    trySet(node, 'isVisible', snapshot.isVisible);
    trySet(node, 'isLocked', snapshot.isLocked);
  });
};

const restoreTopLevelOrder = (
  root: ComponentNode | FrameNode,
  snapshots: BuilderNodeStateSnapshot[]
) => {
  const groups = new Map<string, BuilderNodeStateSnapshot[]>();
  snapshots.forEach(snapshot => {
    const parentPath = snapshot.path.slice(0, -1);
    const key = parentPath.join('/');
    const group = groups.get(key) || [];
    group.push(snapshot);
    groups.set(key, group);
  });

  // 父层先重排，后续才可以按修复后的路径定位更深的容器。
  [...groups.entries()]
    .sort(([a], [b]) => {
      const depthA = a ? a.split('/').length : 0;
      const depthB = b ? b.split('/').length : 0;
      return depthA - depthB;
    })
    .forEach(([key, desired]) => {
      const parentPath = key ? key.split('/').map(Number) : [];
      const parent: any = parentPath.length === 0 ? root : resolveNodePath(root, parentPath);
      if (!parent || typeof parent.insertChild !== 'function') return;
      const available = [...getChildren(parent)];
      const used = new Set<SceneNode>();
      desired
        .sort((a, b) => a.path[a.path.length - 1] - b.path[b.path.length - 1])
        .forEach((snapshot, index) => {
          const candidates = available.filter(candidate =>
            !used.has(candidate)
            && candidate.type === snapshot.nodeType
            && safeRead(() => candidate.name, '') === snapshot.nodeName
          );
          const node = candidates.sort((a, b) => {
            const score = (candidate: SceneNode) =>
              Math.abs(safeRead(() => candidate.width, snapshot.width) - snapshot.width)
              + Math.abs(safeRead(() => candidate.height, snapshot.height) - snapshot.height)
              + Math.abs(safeRead(() => candidate.x, snapshot.x) - snapshot.x)
              + Math.abs(safeRead(() => candidate.y, snapshot.y) - snapshot.y);
            return score(a) - score(b);
          })[0];
          if (!node) return;
          used.add(node);
          try { parent.insertChild(index, node); } catch (_) {}
        });
    });
};

const instanceHasBrokenReferences = (instance: InstanceNode) => {
  const mainId = safeMainComponentId(instance);
  if (!mainId || !safeNodeById(mainId)) return true;
  let properties: ComponentProperties[] = [];
  try {
    properties = instance.componentProperties || [];
  } catch (_) {
    return true;
  }
  return properties.some(property =>
    property.type === 'INSTANCE_SWAP'
    && typeof property.value === 'string'
    && property.value.length > 0
    && !safeNodeById(property.value)
  );
};

const createReverseLeafPlaceholder = (
  source: SceneNode,
  warnings: string[]
): FrameNode => {
  const frame = mg.createFrame();
  try {
    frame.name = safeRead(() => source.name, '不可读图层');
    frame.resize(
      Math.max(0.01, safeRead(() => source.width, 0.01)),
      Math.max(0.01, safeRead(() => source.height, 0.01))
    );
    trySet(frame, 'flexMode', 'NONE');
    copyNodeStyles(source, frame);
    copyPluginData(source, frame);
    warnings.push(`图层“${frame.name}”无法由 MasterGo 读取内部结构，已保留尺寸和根层样式并降级为 Frame 占位`);
    return frame;
  } catch (error) {
    safeRemoveNode(frame);
    throw error;
  }
};

const cloneSceneNodeForReverse = (
  source: SceneNode,
  warnings: string[],
  depth = 0
): SceneNode => {
  if (depth > 64) throw new Error('图层嵌套超过安全复制上限');
  const cloneMethod = (source as any).clone;
  // 安全复制阶段遇到断链实例时，禁止把坏绑定带进新母版；改为按当前子层重建 Frame。
  const mustMaterialize = source.type === 'INSTANCE'
    && instanceHasBrokenReferences(source as InstanceNode);
  if (!mustMaterialize && typeof cloneMethod === 'function') {
    try { return (source as any).clone() as SceneNode; } catch (_) {}
  }

  const children = [...getChildren(source)];
  if (children.length === 0) {
    return createReverseLeafPlaceholder(source, warnings);
  }

  const frame = mg.createFrame();
  const states = captureNodeStates(source);
  const reactions = captureReactionSnapshots(source, warnings);
  try {
    frame.name = safeRead(() => source.name, 'Recovered Layer');
    frame.resize(
      Math.max(0.01, safeRead(() => source.width, 0.01)),
      Math.max(0.01, safeRead(() => source.height, 0.01))
    );
    trySet(frame, 'flexMode', 'NONE');
    children.forEach((child, index) => {
      const recoveredChild = cloneSceneNodeForReverse(child, warnings, depth + 1);
      try {
        frame.insertChild(index, recoveredChild);
      } catch (error) {
        safeRemoveNode(recoveredChild);
        throw error;
      }
    });
    copyNodeStyles(source, frame);
    restoreTopLevelOrder(frame, states);
    restoreNodeStates(frame, states, true);
    restoreReactionSnapshots(frame, reactions, warnings);
    copyPluginData(source, frame);
    warnings.push(`图层“${frame.name}”包含失效组件引用，已降级为 Frame 保留当前结构与外观`);
    return frame;
  } catch (error) {
    safeRemoveNode(frame);
    throw error;
  }
};

const clearComponentPropertyReferences = (root: ComponentNode, warnings: string[]) => {
  const visit = (node: SceneNode) => {
    const refs = safeRead(() => node.componentPropertyReferences, null);
    if (refs && Object.keys(refs).length > 0) {
      try {
        node.componentPropertyReferences = {};
      } catch (_) {
        warnings.push(`图层“${node.name}”的旧属性引用无法清理`);
      }
    }
    if (node.type === 'INSTANCE') return;
    getChildren(node).forEach(visit);
  };
  getChildren(root).forEach(visit);
};

const materializeSceneNodeAsComponent = (
  source: InstanceNode | ComponentNode,
  name: string,
  placement: BuilderPlacement,
  sourceNodeStates: BuilderNodeStateSnapshot[],
  warnings: string[]
) => {
  const reactionSnapshots = captureReactionSnapshots(source, warnings);
  const sourceChildren = [...getChildren(source)];
  if (source.type === 'INSTANCE' && sourceChildren.length === 0 && !safeMainComponent(source)) {
    warnings.push('实例母版和可见子层均不可读取，已创建保留根层尺寸与样式的空组件占位');
  }
  const createdChildren: SceneNode[] = [];
  const component = mg.createComponent();

  try {
    component.name = name || safeRead(() => source.name, 'Reversed Component');
    component.resize(
      Math.max(0.01, safeRead(() => source.width, 0.01)),
      Math.max(0.01, safeRead(() => source.height, 0.01))
    );
    placeReverseTarget(component, placement);
    trySet(component, 'flexMode', 'NONE');

    sourceChildren.forEach((child, index) => {
      const childClone = cloneSceneNodeForReverse(child, warnings);
      createdChildren.push(childClone);
      component.insertChild(index, childClone);
    });

    copyNodeStyles(source, component);
    restoreTopLevelOrder(component, sourceNodeStates);
    restoreNodeStates(component, sourceNodeStates, true);
    restoreReactionSnapshots(component, reactionSnapshots, warnings);
    copyPluginData(source, component);
    warnings.push(
      source.type === 'INSTANCE'
        ? '实例原生解绑遇到失效节点，已改用安全复制模式完成逆向'
        : `变体“${name}”无法安全实例化，已直接从原组件结构完成逆向`
    );
    return component;
  } catch (error) {
    createdChildren.forEach(safeRemoveNode);
    safeRemoveNode(component);
    throw error;
  }
};

const materializeSceneNodeAsRasterComponent = async (
  source: InstanceNode | ComponentNode,
  name: string,
  placement: BuilderPlacement,
  warnings: string[]
): Promise<ComponentNode> => {
  let exported: Uint8Array | string | null = null;
  try {
    exported = await source.exportAsync({ format: 'PNG' });
  } catch (asyncExportError) {
    warnings.push(`异步视觉快照失败，已尝试同步导出：${String((asyncExportError as any)?.message || asyncExportError)}`);
    exported = safeRead(() => source.export({ format: 'PNG' }), null);
  }
  if (!(exported instanceof Uint8Array) || exported.byteLength === 0) {
    throw new Error('实例 PNG 快照为空');
  }
  const image = await mg.createImage(exported);
  const component = mg.createComponent();
  const rectangle = mg.createRectangle();
  try {
    const width = Math.max(0.01, safeRead(() => source.width, 0.01));
    const height = Math.max(0.01, safeRead(() => source.height, 0.01));
    component.name = name || safeRead(() => source.name, 'Reversed Component');
    component.resize(width, height);
    component.fills = [];
    component.strokes = [];
    trySet(component, 'flexMode', 'NONE');
    placeReverseTarget(component, placement);

    rectangle.name = '视觉快照（原结构含失效引用）';
    rectangle.resize(width, height);
    rectangle.x = 0;
    rectangle.y = 0;
    rectangle.fills = [{
      type: 'IMAGE',
      imageRef: image.href,
      scaleMode: 'FILL'
    }];
    component.appendChild(rectangle);
    rectangle.x = 0;
    rectangle.y = 0;
    warnings.push('原结构包含宿主无法解析的失效节点，已用可编辑组件容器承载视觉快照；内部图层与属性无法完整恢复');
    return component;
  } catch (error) {
    safeRemoveNode(rectangle);
    safeRemoveNode(component);
    throw error;
  }
};

const copyPublishableMetadata = (src: any, dst: ComponentNode | ComponentSetNode) => {
  if (!src) return;
  trySet(dst, 'description', safeRead(() => src.description || '', ''));
  trySet(dst, 'alias', safeRead(() => src.alias || '', ''));
  const links = safeRead(() => src.documentationLinks, [] as any[]);
  if (Array.isArray(links)) {
    trySet(dst, 'documentationLinks', links.map((item: any) => ({ uri: item.uri })));
  }
};

const transferFrameToComponent = (
  frame: FrameNode,
  name = frame.name,
  warnings: string[] = []
): ComponentNode => {
  const parent: any = frame.parent;
  if (!parent || !parent.children || typeof parent.insertChild !== 'function') {
    throw new Error('所选 Frame 没有可写入的父级容器');
  }

  const index = Math.max(0, Array.from(parent.children).indexOf(frame));
  const geometry = { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
  const children = [...getChildren(frame)];
  const nodeStates = captureNodeStates(frame);
  const reactionSnapshots = captureReactionSnapshots(frame, warnings);
  const component = mg.createComponent();

  try {
    parent.insertChild(index, component);
    component.name = name || 'Component';
    component.x = geometry.x;
    component.y = geometry.y;
    component.resize(Math.max(0.01, geometry.width), Math.max(0.01, geometry.height));

    // 先按绝对位置搬运子层，再恢复 Auto Layout，避免搬运过程中发生二次回流。
    trySet(component, 'flexMode', 'NONE');
    children.forEach((child, childIndex) => {
      component.insertChild(childIndex, child);
    });

    copyNodeStyles(frame, component);
    restoreNodeStates(component, nodeStates, true);
    restoreReactionSnapshots(component, reactionSnapshots, warnings);
    copyPluginData(frame, component);
    frame.remove();
    return component;
  } catch (error) {
    if (!frame.removed) {
      children.forEach((child, childIndex) => {
        if (!child.removed && child.parent !== frame) frame.insertChild(childIndex, child);
      });
      restoreNodeStates(frame, nodeStates, true);
    }
    if (!component.removed) component.remove();
    throw error;
  }
};

const uniquePropertyName = (raw: string, fallback: string, used: Set<string>) => {
  const cleaned = String(raw || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 64) || fallback;
  let name = cleaned;
  let suffix = 2;
  while (used.has(name.toLocaleLowerCase())) name = `${cleaned} ${suffix++}`;
  used.add(name.toLocaleLowerCase());
  return name;
};

const exposeBuilderProperties = (
  component: ComponentNode,
  exposeText: boolean,
  exposeInstances: boolean
) => {
  const used = new Set(
    component.componentPropertyValues.map(property => property.name.toLocaleLowerCase())
  );
  let textCount = 0;
  let instanceCount = 0;
  const warnings: string[] = [];

  const visit = (node: SceneNode) => {
    if (node.type === 'INSTANCE') {
      if (exposeInstances) {
        const instance = node as InstanceNode;
        const main = safeMainComponent(instance);
        if (!main) {
          warnings.push(`实例“${node.name}”缺少可访问的主组件，已跳过实例属性`);
        } else {
          try {
            const propertyName = uniquePropertyName(node.name, `Instance ${instanceCount + 1}`, used);
            const preferredValues: InstanceSwapPreferredValue[] = [
              { type: 'COMPONENT', key: main.ukey }
            ];
            if (main.parent?.type === 'COMPONENT_SET') {
              preferredValues.push({ type: 'COMPONENT_SET', key: (main.parent as ComponentSetNode).ukey });
            }
            const propertyId = component.addComponentProperty(
              propertyName,
              'INSTANCE_SWAP',
              main.id,
              { preferredValues }
            );
            node.componentPropertyReferences = {
              ...(node.componentPropertyReferences || {}),
              mainComponent: propertyId
            };
            instanceCount++;
          } catch (error) {
            warnings.push(`实例“${node.name}”属性创建失败：${String((error as any)?.message || error)}`);
          }
        }
      }
      return;
    }

    if (node.type === 'TEXT' && exposeText) {
      const text = node as TextNode;
      try {
        const fallback = `Text ${textCount + 1}`;
        const propertyName = uniquePropertyName(node.name || text.characters, fallback, used);
        const propertyId = component.addComponentProperty(propertyName, 'TEXT', text.characters);
        node.componentPropertyReferences = {
          ...(node.componentPropertyReferences || {}),
          characters: propertyId
        };
        textCount++;
      } catch (error) {
        warnings.push(`文本“${node.name}”属性创建失败：${String((error as any)?.message || error)}`);
      }
    }

    getChildren(node).forEach(visit);
  };

  getChildren(component).forEach(visit);
  return { textCount, instanceCount, warnings };
};

type BuilderSetCandidate = {
  key: string;
  node: TextNode | InstanceNode;
};

const normalizeBuilderLayerName = (value: string) =>
  String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase();

const collectBuilderSetCandidates = (
  component: ComponentNode,
  exposeText: boolean,
  exposeInstances: boolean
) => {
  const candidates: BuilderSetCandidate[] = [];
  const visit = (parent: SceneNode, parentKey: string) => {
    const siblingOccurrences = new Map<string, number>();
    getChildren(parent).forEach(child => {
      const baseKey = `${child.type}:${normalizeBuilderLayerName(child.name)}`;
      const occurrence = (siblingOccurrences.get(baseKey) || 0) + 1;
      siblingOccurrences.set(baseKey, occurrence);
      const key = `${parentKey}/${baseKey}#${occurrence}`;

      if (child.type === 'INSTANCE') {
        if (exposeInstances) candidates.push({ key, node: child as InstanceNode });
        return;
      }
      if (child.type === 'TEXT' && exposeText) {
        candidates.push({ key, node: child as TextNode });
      }
      visit(child, key);
    });
  };
  visit(component, 'root');
  return candidates;
};

const exposeBuilderPropertiesForSet = (
  set: ComponentSetNode,
  exposeText: boolean,
  exposeInstances: boolean
) => {
  const used = new Set(
    set.componentPropertyValues.map(property => property.name.toLocaleLowerCase())
  );
  const groups = new Map<string, Array<TextNode | InstanceNode>>();
  const variants = getChildren(set).filter(node => node.type === 'COMPONENT') as ComponentNode[];
  variants.forEach(component => {
    collectBuilderSetCandidates(component, exposeText, exposeInstances).forEach(candidate => {
      const group = groups.get(candidate.key) || [];
      group.push(candidate.node);
      groups.set(candidate.key, group);
    });
  });

  let textCount = 0;
  let instanceCount = 0;
  const warnings: string[] = [];

  groups.forEach(nodes => {
    const first = nodes[0];
    if (first.type === 'TEXT') {
      try {
        const propertyName = uniquePropertyName(
          first.name || first.characters,
          `Text ${textCount + 1}`,
          used
        );
        const propertyId = set.addComponentProperty(propertyName, 'TEXT', first.characters);
        nodes.forEach(node => {
          if (node.type !== 'TEXT') return;
          try {
            node.componentPropertyReferences = {
              ...(node.componentPropertyReferences || {}),
              characters: propertyId
            };
          } catch (error) {
            warnings.push(`文本“${node.name}”属性绑定失败：${String((error as any)?.message || error)}`);
          }
        });
        textCount++;
      } catch (error) {
        warnings.push(`文本“${first.name}”属性创建失败：${String((error as any)?.message || error)}`);
      }
      return;
    }

    const validInstances = nodes
      .filter(node => node.type === 'INSTANCE')
      .map(node => ({ node: node as InstanceNode, main: safeMainComponent(node as InstanceNode) }))
      .filter(item => Boolean(item.main)) as Array<{ node: InstanceNode; main: ComponentNode }>;
    if (validInstances.length === 0) {
      warnings.push(`实例“${first.name}”缺少可访问的主组件，已跳过实例属性`);
      return;
    }

    try {
      const preferredValueMap = new Map<string, InstanceSwapPreferredValue>();
      validInstances.forEach(({ main }) => {
        if (main.ukey) {
          preferredValueMap.set(`COMPONENT:${main.ukey}`, { type: 'COMPONENT', key: main.ukey });
        }
        if (main.parent?.type === 'COMPONENT_SET') {
          const parentSet = main.parent as ComponentSetNode;
          if (parentSet.ukey) {
            preferredValueMap.set(
              `COMPONENT_SET:${parentSet.ukey}`,
              { type: 'COMPONENT_SET', key: parentSet.ukey }
            );
          }
        }
      });
      const propertyName = uniquePropertyName(first.name, `Instance ${instanceCount + 1}`, used);
      const propertyId = set.addComponentProperty(
        propertyName,
        'INSTANCE_SWAP',
        validInstances[0].main.id,
        { preferredValues: [...preferredValueMap.values()] }
      );
      validInstances.forEach(({ node }) => {
        try {
          node.componentPropertyReferences = {
            ...(node.componentPropertyReferences || {}),
            mainComponent: propertyId
          };
        } catch (error) {
          warnings.push(`实例“${node.name}”属性绑定失败：${String((error as any)?.message || error)}`);
        }
      });
      instanceCount++;
    } catch (error) {
      warnings.push(`实例“${first.name}”属性创建失败：${String((error as any)?.message || error)}`);
    }
  });

  return { textCount, instanceCount, warnings };
};

const restoreReversedProperties = (
  owner: ComponentNode | ComponentSetNode,
  component: ComponentNode,
  properties: BuilderPropertySnapshot[],
  references: BuilderReferenceSnapshot[]
) => {
  const propertyIdMap = new Map<string, string>();
  const warnings: string[] = [];
  let restoredCount = 0;

  for (const property of properties) {
    if (property.type === 'VARIANT') continue;
    try {
      let defaultValue = property.value;
      if (property.type === 'INSTANCE_SWAP' && !safeNodeById(defaultValue)) {
        const reference = references.find(snapshot =>
          snapshot.references.mainComponent === property.id
        );
        const target = reference ? resolveSnapshotNode(component, reference) : null;
        const targetMainId = target?.type === 'INSTANCE'
          ? safeMainComponentId(target as InstanceNode)
          : undefined;
        const fallbackMainId = targetMainId && safeNodeById(targetMainId)
          ? targetMainId
          : (reference?.instanceMainComponentId && safeNodeById(reference.instanceMainComponentId)
            ? reference.instanceMainComponentId
            : undefined);
        if (fallbackMainId) {
          defaultValue = fallbackMainId;
          warnings.push(`属性“${property.name}”的原默认组件已失效，已改用当前子实例母版`);
        } else {
          warnings.push(`属性“${property.name}”引用的组件不存在，已跳过该实例属性`);
          continue;
        }
      }

      const newId = owner.addComponentProperty(
        property.name,
        property.type,
        defaultValue,
        property.type === 'INSTANCE_SWAP'
          ? { preferredValues: property.preferredValues || [] }
          : undefined
      );
      restoredCount++;
      if (property.id) propertyIdMap.set(property.id, newId);
      if (property.alias) {
        try { owner.editComponentProperty(newId, { alias: property.alias }); } catch (_) {}
      }
      if (property.variableId && (property.type === 'TEXT' || property.type === 'BOOLEAN')) {
        try {
          mg.variables.setVariableInComponent({
            id: property.variableId,
            propertyId: newId,
            type: property.type === 'TEXT' ? 'CONTENT' : 'BOOLEAN'
          });
        } catch (error) {
          warnings.push(`属性“${property.name}”的变量绑定恢复失败：${String((error as any)?.message || error)}`);
        }
      } else if (property.skippedVariableId) {
        warnings.push(`属性“${property.name}”存在实例覆盖，已保留当前值并跳过母版变量绑定`);
      }
    } catch (error) {
      warnings.push(`属性“${property.name}”恢复失败：${String((error as any)?.message || error)}`);
    }
  }

  for (const snapshot of references) {
    const target = resolveSnapshotNode(component, snapshot);
    if (!target) {
      warnings.push(`图层“${snapshot.nodeName}”的属性引用路径已变化，为避免误绑已跳过`);
      continue;
    }
    const mapped: { isVisible?: string; characters?: string; mainComponent?: string } = {};
    for (const key of ['isVisible', 'characters', 'mainComponent'] as const) {
      const oldId = snapshot.references[key];
      const newId = oldId ? propertyIdMap.get(oldId) : undefined;
      if (newId) mapped[key] = newId;
    }
    if (Object.keys(mapped).length > 0) {
      try {
        target.componentPropertyReferences = {
          ...(target.componentPropertyReferences || {}),
          ...mapped
        };
      } catch (error) {
        warnings.push(`图层“${target.name}”的属性引用恢复失败：${String((error as any)?.message || error)}`);
      }
    }
  }

  return { warnings, restoredCount };
};

const createBuilderPropertySnapshots = (
  definitions: ComponentPropertyValue[],
  currentProperties: ComponentProperties[]
): BuilderPropertySnapshot[] => {
  const snapshots: BuilderPropertySnapshot[] = [];
  const consumed = new Set<ComponentProperties>();
  definitions.forEach(definition => {
    const current = currentProperties.find(property =>
      (definition.id && property.id === definition.id)
      || (property.name === definition.name && property.type === definition.type)
    );
    if (current) consumed.add(current);
    const value = current?.value ?? definition.defaultValue;
    const canKeepVariableBinding = Boolean(
      definition.variableId
      && (definition.type === 'TEXT' || definition.type === 'BOOLEAN')
      && definition.defaultValue === value
    );
    snapshots.push({
      name: definition.name,
      id: current?.id || definition.id,
      type: definition.type,
      value,
      preferredValues: current?.preferredValues || definition.preferredValues,
      alias: current?.alias || definition.alias,
      valueAlias: current?.valueAlias,
      variantOptions: definition.variantOptions,
      variantOptionsAlias: definition.variantOptionsAlias,
      variableId: canKeepVariableBinding ? definition.variableId : undefined,
      skippedVariableId: definition.variableId && !canKeepVariableBinding
        ? definition.variableId
        : undefined
    });
  });
  currentProperties
    .filter(property => !consumed.has(property))
    .forEach(property => snapshots.push({
      name: property.name,
      id: property.id,
      type: property.type,
      value: property.value,
      preferredValues: property.preferredValues,
      alias: property.alias,
      valueAlias: property.valueAlias
    }));
  return snapshots;
};

const buildReversedComponentFromInstance = async (
  source: InstanceNode,
  name: string,
  placement: BuilderPlacement,
  warnings: string[]
): Promise<ReverseComponentBuild> => {
  const nodeStates = captureNodeStates(source);
  let clone: InstanceNode | null = null;
  let detached: FrameNode | null = null;
  let component: ComponentNode | null = null;
  let detachFailureMessage = '';
  let safeCopyFailureMessage = '';
  let recoveryMode: ReverseRecoveryMode = 'native';
  try {
    try {
      clone = source.clone();
      placeReverseTarget(clone, placement);
      detached = clone.detachInstance();
      clone = null;
    } catch (detachError) {
      safeRemoveNode(clone);
      clone = null;
      detachFailureMessage = String((detachError as any)?.message || detachError);
      warnings.push(`变体“${name}”原生解绑失败：${detachFailureMessage}`);
    }

    if (detached) {
      try {
        component = transferFrameToComponent(detached, name, warnings);
        detached = null;
      } catch (transferError) {
        safeRemoveNode(detached);
        detached = null;
        detachFailureMessage = String((transferError as any)?.message || transferError);
        warnings.push(`变体“${name}”原生转换失败：${detachFailureMessage}`);
      }
    }
    if (!component) {
      try {
        component = materializeSceneNodeAsComponent(source, name, placement, nodeStates, warnings);
        recoveryMode = 'structure';
      } catch (fallbackError) {
        safeCopyFailureMessage = String((fallbackError as any)?.message || fallbackError);
        warnings.push(`变体“${name}”安全结构复制失败：${safeCopyFailureMessage}`);
        component = await materializeSceneNodeAsRasterComponent(source, name, placement, warnings);
        recoveryMode = 'raster';
      }
    }
    component.name = name;
    placeReverseTarget(component, placement);
    if (recoveryMode !== 'raster') {
      restoreTopLevelOrder(component, nodeStates);
      clearComponentPropertyReferences(component, warnings);
    }
    return { component, nodeStates, recoveryMode };
  } catch (error) {
    safeRemoveNode(component);
    safeRemoveNode(detached);
    safeRemoveNode(clone);
    throw new Error(
      `变体“${name}”还原失败：${String((error as any)?.message || error)}`
      + (detachFailureMessage ? `；原生解绑：${detachFailureMessage}` : '')
      + (safeCopyFailureMessage ? `；结构复制：${safeCopyFailureMessage}` : '')
    );
  }
};

const buildReversedComponentFromSourceComponent = async (
  source: ComponentNode,
  name: string,
  placement: BuilderPlacement,
  warnings: string[]
): Promise<ReverseComponentBuild> => {
  const nodeStates = captureNodeStates(source);
  let component: ComponentNode | null = null;
  let structureFailureMessage = '';
  let recoveryMode: ReverseRecoveryMode = 'structure';
  try {
    try {
      component = materializeSceneNodeAsComponent(source, name, placement, nodeStates, warnings);
    } catch (structureError) {
      structureFailureMessage = String((structureError as any)?.message || structureError);
      warnings.push(`变体“${name}”直接结构复制失败：${structureFailureMessage}`);
      component = await materializeSceneNodeAsRasterComponent(source, name, placement, warnings);
      recoveryMode = 'raster';
    }
    component.name = name;
    placeReverseTarget(component, placement);
    if (recoveryMode !== 'raster') {
      restoreTopLevelOrder(component, nodeStates);
      clearComponentPropertyReferences(component, warnings);
    }
    return { component, nodeStates, recoveryMode };
  } catch (error) {
    safeRemoveNode(component);
    throw new Error(
      `变体“${name}”无法从原组件恢复：${String((error as any)?.message || error)}`
      + (structureFailureMessage ? `；结构复制：${structureFailureMessage}` : '')
    );
  }
};

const buildReversedComponentWithMainFallback = async (
  source: InstanceNode,
  main: ComponentNode | null,
  name: string,
  placement: BuilderPlacement,
  warnings: string[]
): Promise<ReverseComponentBuild> => {
  try {
    return await buildReversedComponentFromInstance(source, name, placement, warnings);
  } catch (instanceError) {
    if (!main || safeRead(() => main.removed, true)) throw instanceError;
    warnings.push(
      `当前实例无法直接还原：${String((instanceError as any)?.message || instanceError)}；已改从原组件结构恢复，未映射到组件属性的手工覆盖可能无法保留`
    );
    return buildReversedComponentFromSourceComponent(main, name, placement, warnings);
  }
};

const componentIdentity = (component: ComponentNode | null | undefined) => {
  if (!component) return '';
  return safeRead(() => component.ukey, '')
    || safeRead(() => component.id, '')
    || safeRead(() => component.name, '');
};

const sameComponentIdentity = (
  left: ComponentNode | null | undefined,
  right: ComponentNode | null | undefined
) => Boolean(
  left
  && right
  && (
    componentIdentity(left) === componentIdentity(right)
    || safeRead(() => left.name, '') === safeRead(() => right.name, '')
  )
);

const MAX_REVERSED_VARIANTS = 100;

type SourceVariantDiscovery = {
  variants: ComponentNode[];
  overflowCount: number;
  overflowCountIsMinimum?: boolean;
};

const discoverSourceVariantComponents = async (
  source: InstanceNode,
  main: ComponentNode,
  sourceSet: ComponentSetNode,
  properties: BuilderPropertySnapshot[],
  warnings: string[]
): Promise<SourceVariantDiscovery> => {
  const direct = getChildren(sourceSet)
    .filter(node => node.type === 'COMPONENT' && !safeRead(() => node.removed, true)) as ComponentNode[];
  if (direct.length > 1) {
    if (direct.length > MAX_REVERSED_VARIANTS) {
      return { variants: [main], overflowCount: direct.length };
    }
    return { variants: direct, overflowCount: 0 };
  }

  // 团队库代理可能不开放 set.children，但组件目录会保留 parentId。
  // 只读取 parentId 精确属于当前组件集的条目，不按名称猜测兄弟组件。
  const sourceSetKeys = new Set([
    safeRead(() => sourceSet.id, ''),
    safeRead(() => sourceSet.ukey, '')
  ].filter(Boolean));
  const catalogItems = safeRead(() => mg.getComponentListVal() || [], [] as ComponentItemVal[])
    .filter(item => Boolean(item.parentId && sourceSetKeys.has(item.parentId)));
  if (catalogItems.length > 1) {
    if (catalogItems.length > MAX_REVERSED_VARIANTS) {
      return { variants: [main], overflowCount: catalogItems.length };
    }
    const catalogVariants: ComponentNode[] = [];
    for (const item of catalogItems) {
      const existing = safeNodeById(item.id);
      try {
        const component = existing?.type === 'COMPONENT'
          ? existing as ComponentNode
          : await mg.importComponentByKeyAsync(item.ukey);
        if (!component) throw new Error('组件导入结果为空');
        catalogVariants.push(component);
      } catch (error) {
        throw new Error(`无法读取同组件集变体“${item.name}”：${String((error as any)?.message || error)}`);
      }
    }
    const uniqueCatalog = new Map(catalogVariants.map(component => [componentIdentity(component), component]));
    if (uniqueCatalog.size !== catalogItems.length) {
      throw new Error(`组件目录声明 ${catalogItems.length} 个变体，但只能解析 ${uniqueCatalog.size} 个，已停止以避免不完整还原`);
    }
    return { variants: [...uniqueCatalog.values()], overflowCount: 0 };
  }

  const variantProperties = properties.filter(property =>
    property.type === 'VARIANT' && (property.variantOptions?.length || 0) > 0
  );
  const hasMultipleOptions = variantProperties.some(property => (property.variantOptions?.length || 0) > 1);
  if (!hasMultipleOptions) {
    if (direct.length > 0) return { variants: direct, overflowCount: 0 };
    if (properties.some(property => property.type === 'VARIANT')) {
      throw new Error('宿主未开放原组件集 children、组件目录或变体选项，无法证明其他变体完整性，已停止生成伪组件集');
    }
    return { variants: [main], overflowCount: 0 };
  }

  // 远端团队库代理可能不暴露完整 children。此时从已知真实组件出发，
  // 每次只切换一个已声明值并读取实际 mainComponent，按图搜索真实变体；不做笛卡尔积造型。
  const maxProbes = 8192;
  const found = new Map<string, ComponentNode>();
  const queue: ComponentNode[] = [];
  const add = (component: ComponentNode | null) => {
    if (!component || safeRead(() => component.removed, true)) return;
    const key = componentIdentity(component);
    if (!key || found.has(key)) return;
    found.set(key, component);
    queue.push(component);
  };
  direct.forEach(add);
  add(main);
  let probes = 0;
  let probeFailures = 0;
  while (queue.length > 0) {
    if (found.size > MAX_REVERSED_VARIANTS) {
      return {
        variants: [main],
        overflowCount: found.size,
        overflowCountIsMinimum: true
      };
    }
    if (probes >= maxProbes) {
      throw new Error(`原组件集变体探测达到安全上限 ${maxProbes} 次，已停止以避免不完整还原`);
    }
    const base = queue.shift()!;
    for (const property of variantProperties) {
      for (const option of property.variantOptions || []) {
        if (probes >= maxProbes) {
          throw new Error(`原组件集变体探测达到安全上限 ${maxProbes} 次，已停止以避免不完整还原`);
        }
        probes++;
        let probe: InstanceNode | null = null;
        try {
          probe = base.createInstance();
          probe.setVariantPropertyValues({ [property.name]: option });
          add(safeMainComponent(probe));
        } catch (_) {
          probeFailures++;
        } finally {
          safeRemoveNode(probe);
        }
      }
    }
  }
  if (probeFailures > 0) warnings.push(`${probeFailures} 次远端变体探测不可用，已按实际可访问组件去重`);
  if (found.size > MAX_REVERSED_VARIANTS) {
    return {
      variants: [main],
      overflowCount: found.size,
      overflowCountIsMinimum: true
    };
  }
  if (found.size <= 1) {
    throw new Error('原组件集声明了多个变体值，但宿主未开放其他真实变体，已停止以避免生成只有属性没有组件的伪组件集');
  }
  return { variants: [...found.values()], overflowCount: 0 };
};

type SetPropertyBinding = {
  target: SceneNode;
  key: 'isVisible' | 'characters' | 'mainComponent';
  snapshot: BuilderReferenceSnapshot;
};

const bindingMatchesNode = (binding: SetPropertyBinding) => {
  if (binding.key === 'characters') return binding.target.type === 'TEXT';
  if (binding.key === 'mainComponent') return binding.target.type === 'INSTANCE';
  return true;
};

const restoreReversedSetProperties = (
  set: ComponentSetNode,
  variants: ReversedVariantRecord[],
  properties: BuilderPropertySnapshot[],
  fallbackReferences: BuilderReferenceSnapshot[]
) => {
  const warnings: string[] = [];
  let restoredCount = 0;
  const usedNames = new Set(
    safeRead(() => set.componentPropertyValues || [], [] as ComponentPropertyValue[])
      .map(property => property.name.toLocaleLowerCase())
  );

  properties.filter(property => property.type !== 'VARIANT').forEach(property => {
    if (!property.id) {
      warnings.push(`属性“${property.name}”没有可验证的属性 ID，已跳过`);
      return;
    }
    if (usedNames.has(property.name.toLocaleLowerCase())) {
      warnings.push(`属性“${property.name}”与现有变体属性重名，已跳过以避免冲突`);
      return;
    }
    const bindings: SetPropertyBinding[] = [];
    const seen = new Set<string>();
    variants.forEach(variant => {
      const references = variant.references.length > 0 ? variant.references : fallbackReferences;
      references.forEach(snapshot => {
        const target = resolveSnapshotNode(variant.component, snapshot);
        if (!target) return;
        (['isVisible', 'characters', 'mainComponent'] as const).forEach(key => {
          if (snapshot.references[key] !== property.id) return;
          const binding = { target, key, snapshot };
          if (!bindingMatchesNode(binding)) return;
          const bindingKey = `${target.id}:${key}`;
          if (seen.has(bindingKey)) return;
          seen.add(bindingKey);
          bindings.push(binding);
        });
      });
    });
    if (bindings.length === 0) {
      warnings.push(`属性“${property.name}”在所有还原变体中都没有对应图层，已跳过以避免多余属性`);
      return;
    }

    let defaultValue = property.value;
    if (property.type === 'INSTANCE_SWAP' && !safeNodeById(defaultValue)) {
      const instanceBinding = bindings.find(binding => binding.key === 'mainComponent');
      const fallbackId = instanceBinding?.target.type === 'INSTANCE'
        ? safeMainComponentId(instanceBinding.target as InstanceNode)
        : undefined;
      if (!fallbackId || !safeNodeById(fallbackId)) {
        warnings.push(`属性“${property.name}”没有有效的实例母版，已跳过`);
        return;
      }
      defaultValue = fallbackId;
    }

    let newId = '';
    try {
      newId = set.addComponentProperty(
        property.name,
        property.type as Exclude<ComponentPropertyType, 'VARIANT'>,
        defaultValue,
        property.type === 'INSTANCE_SWAP'
          ? { preferredValues: property.preferredValues || [] }
          : undefined
      );
    } catch (error) {
      warnings.push(`属性“${property.name}”创建失败：${String((error as any)?.message || error)}`);
      return;
    }

    const grouped = new Map<SceneNode, BuilderReferenceSnapshot['references']>();
    bindings.forEach(binding => {
      const refs = grouped.get(binding.target) || {};
      refs[binding.key] = newId;
      grouped.set(binding.target, refs);
    });
    let boundLayerCount = 0;
    grouped.forEach((refs, target) => {
      try {
        target.componentPropertyReferences = {
          ...(safeRead(() => target.componentPropertyReferences, {}) || {}),
          ...refs
        };
        boundLayerCount++;
      } catch (error) {
        warnings.push(`属性“${property.name}”绑定图层“${safeRead(() => target.name, '未命名')}”失败：${String((error as any)?.message || error)}`);
      }
    });
    if (boundLayerCount === 0) {
      try { set.deleteComponentProperty(newId); } catch (_) {}
      warnings.push(`属性“${property.name}”没有成功绑定任何图层，已删除以避免空属性`);
      return;
    }

    usedNames.add(property.name.toLocaleLowerCase());
    restoredCount++;
    if (property.alias) {
      try { set.editComponentProperty(newId, { alias: property.alias }); } catch (_) {}
    }
    if (property.variableId && (property.type === 'TEXT' || property.type === 'BOOLEAN')) {
      try {
        mg.variables.setVariableInComponent({
          id: property.variableId,
          propertyId: newId,
          type: property.type === 'TEXT' ? 'CONTENT' : 'BOOLEAN'
        });
      } catch (error) {
        warnings.push(`属性“${property.name}”的变量绑定恢复失败：${String((error as any)?.message || error)}`);
      }
    } else if (property.skippedVariableId) {
      warnings.push(`属性“${property.name}”存在实例覆盖，已保留当前值并跳过母版变量绑定`);
    }
  });
  return { warnings, restoredCount };
};

const restoreVariantAliases = (
  set: ComponentSetNode,
  properties: BuilderPropertySnapshot[],
  warnings: string[]
) => {
  const actualVariantProperties = safeRead(
    () => set.componentPropertyValues.filter(property => property.type === 'VARIANT'),
    [] as ComponentPropertyValue[]
  );
  const propertyAliases: Record<string, string> = {};
  properties.filter(property => property.type === 'VARIANT').forEach(property => {
    const actual = actualVariantProperties.find(candidate => candidate.name === property.name);
    if (!actual) return;
    if (property.alias) propertyAliases[property.name] = property.alias;
    const actualOptions = new Set(actual.variantOptions || []);
    const aliases = property.variantOptionsAlias || [];
    (property.variantOptions || []).forEach((option, index) => {
      const alias = aliases[index]
        || (String(property.value) === option ? property.valueAlias : undefined);
      if (!alias || !actualOptions.has(option)) return;
      try {
        set.editVariantPropertyValuesAlias({
          [property.name]: { name: option, alias }
        });
      } catch (_) {
        warnings.push(`变体“${property.name}=${option}”的别名未能恢复`);
      }
    });
  });
  if (Object.keys(propertyAliases).length > 0) {
    try { set.editVariantPropertiesAlias(propertyAliases); } catch (_) {
      warnings.push('部分变体属性别名未能恢复');
    }
  }
};

const restoreLimitedVariantSchema = (
  set: ComponentSetNode,
  component: ComponentNode,
  properties: BuilderPropertySnapshot[],
  warnings: string[]
) => {
  const expected = properties.filter(property => property.type === 'VARIANT');
  if (expected.length === 0) {
    return safeRead(
      () => set.componentPropertyValues.filter(property => property.type === 'VARIANT').length,
      0
    );
  }

  const values = Object.fromEntries(
    expected.map(property => [property.name, String(property.value)])
  );
  try {
    // MasterGo 会为不存在的属性维度自动创建变体属性；只有当前真实组件承载当前值，
    // 其他属性组合允许保持为空，不为它们批量制造占位组件。
    component.setVariantPropertyValues(values);
  } catch (error) {
    const actualNames = new Set(
      safeRead(
        () => set.componentPropertyValues.filter(property => property.type === 'VARIANT'),
        [] as ComponentPropertyValue[]
      ).map(property => property.name)
    );
    const missing = expected.map(property => property.name).filter(name => !actualNames.has(name));
    try {
      if (missing.length > 0) set.createVariantProperties(missing);
      component.setVariantPropertyValues(values);
    } catch (retryError) {
      throw new Error(`组件集变体属性恢复失败：${String((retryError as any)?.message || retryError || error)}`);
    }
  }

  const expectedNames = new Set(expected.map(property => property.name));
  let actual = safeRead(
    () => set.componentPropertyValues.filter(property => property.type === 'VARIANT'),
    [] as ComponentPropertyValue[]
  );
  actual
    .filter(property => !expectedNames.has(property.name))
    .forEach(property => {
      if (actual.length <= expected.length) return;
      try {
        set.deleteVariantProperty(property.name);
        actual = actual.filter(candidate => candidate.name !== property.name);
      } catch (_) {
        warnings.push(`自动生成的多余变体属性“${property.name}”未能移除`);
      }
    });

  const finalProperties = safeRead(
    () => set.componentPropertyValues.filter(property => property.type === 'VARIANT'),
    [] as ComponentPropertyValue[]
  );
  const finalNames = new Set(finalProperties.map(property => property.name));
  const missingNames = expected.map(property => property.name).filter(name => !finalNames.has(name));
  const currentValues = new Map(
    safeRead(() => component.variantProperties || [], [] as VariantProperty[])
      .map(property => [property.property, property.value])
  );
  const mismatchedValues = expected.filter(property =>
    currentValues.get(property.name) !== String(property.value)
  );
  if (missingNames.length > 0 || mismatchedValues.length > 0) {
    throw new Error(
      `组件集变体属性完整性校验失败`
      + (missingNames.length > 0 ? `：缺少 ${missingNames.join('、')}` : '')
      + (mismatchedValues.length > 0 ? `：取值不一致 ${mismatchedValues.map(property => property.name).join('、')}` : '')
    );
  }
  return finalProperties.length;
};

type BehaviorNodeSnapshot = {
  path: number[];
  nodeName: string;
  nodeType: SceneNode['type'];
  isVisible: boolean;
  characters?: string;
  instanceMainComponentId?: string;
};

const captureBehaviorNodeSnapshots = (root: SceneNode): BehaviorNodeSnapshot[] => {
  const snapshots: BehaviorNodeSnapshot[] = [];
  const visit = (node: SceneNode, path: number[]) => {
    snapshots.push({
      path,
      nodeName: safeRead(() => node.name, '未命名'),
      nodeType: node.type,
      isVisible: safeRead(() => node.isVisible, true),
      characters: node.type === 'TEXT'
        ? safeRead(() => (node as TextNode).characters, '')
        : undefined,
      instanceMainComponentId: node.type === 'INSTANCE'
        ? safeMainComponentId(node as InstanceNode)
        : undefined
    });
    if (node.type === 'INSTANCE') return;
    getChildren(node).forEach((child, index) => visit(child, [...path, index]));
  };
  getChildren(root).forEach((child, index) => visit(child, [index]));
  return snapshots;
};

const behaviorSnapshotKey = (snapshot: Pick<BehaviorNodeSnapshot, 'path'>) => snapshot.path.join('/');

const mergeReferenceSnapshots = (
  base: BuilderReferenceSnapshot[],
  additions: BuilderReferenceSnapshot[]
) => {
  const merged = new Map<string, BuilderReferenceSnapshot>();
  [...base, ...additions].forEach(snapshot => {
    const key = `${snapshot.path.join('/')}:${snapshot.nodeType}:${snapshot.nodeName}`;
    const existing = merged.get(key);
    if (existing) {
      existing.references = { ...existing.references, ...snapshot.references };
      existing.instanceMainComponentId = existing.instanceMainComponentId
        || snapshot.instanceMainComponentId;
    } else {
      merged.set(key, {
        ...snapshot,
        path: [...snapshot.path],
        references: { ...snapshot.references }
      });
    }
  });
  return [...merged.values()];
};

const discoverComponentReferencesByBehavior = (
  sourceComponent: ComponentNode,
  properties: BuilderPropertySnapshot[],
  knownReferences: BuilderReferenceSnapshot[],
  warnings: string[]
) => {
  const discovered: BuilderReferenceSnapshot[] = [];
  let failedProbes = 0;
  const hasKnownReference = (propertyId: string) => knownReferences.some(snapshot =>
    Object.values(snapshot.references).includes(propertyId)
  );
  properties
    .filter(property => property.type !== 'VARIANT' && property.id && !hasKnownReference(property.id))
    .forEach(property => {
      let probe: InstanceNode | null = null;
      try {
        probe = sourceComponent.createInstance();
        const before = captureBehaviorNodeSnapshots(probe);
        const currentProperty = safeRead(
          () => probe!.componentProperties.find(candidate => candidate.id === property.id),
          undefined
        );
        const changedPaths = new Set<string>();
        let referenceKey: 'isVisible' | 'characters' | 'mainComponent';

        if (property.type === 'TEXT') {
          referenceKey = 'characters';
          const marker = `__AIO_PROP_${String(property.id).replace(/[^a-zA-Z0-9]/g, '_')}__`;
          probe.setProperties({ [property.id!]: marker });
          const after = captureBehaviorNodeSnapshots(probe);
          after.forEach(snapshot => {
            if (snapshot.nodeType === 'TEXT' && snapshot.characters === marker) {
              changedPaths.add(behaviorSnapshotKey(snapshot));
            }
          });
        } else if (property.type === 'BOOLEAN') {
          referenceKey = 'isVisible';
          const currentValue = typeof currentProperty?.value === 'boolean'
            ? currentProperty.value
            : Boolean(property.value);
          probe.setProperties({ [property.id!]: !currentValue });
          const afterMap = new Map(
            captureBehaviorNodeSnapshots(probe).map(snapshot => [behaviorSnapshotKey(snapshot), snapshot])
          );
          before.forEach(snapshot => {
            const after = afterMap.get(behaviorSnapshotKey(snapshot));
            if (after && after.isVisible !== snapshot.isVisible) {
              changedPaths.add(behaviorSnapshotKey(snapshot));
            }
          });
        } else {
          referenceKey = 'mainComponent';
          const currentMainId = typeof currentProperty?.value === 'string'
            ? currentProperty.value
            : String(property.value || '');
          const candidates = before.filter(snapshot =>
            snapshot.nodeType === 'INSTANCE'
            && snapshot.instanceMainComponentId === currentMainId
          );
          if (candidates.length === 1) changedPaths.add(behaviorSnapshotKey(candidates[0]));
        }

        before.forEach(snapshot => {
          if (!changedPaths.has(behaviorSnapshotKey(snapshot))) return;
          discovered.push({
            path: [...snapshot.path],
            nodeName: snapshot.nodeName,
            nodeType: snapshot.nodeType,
            references: { [referenceKey]: property.id },
            instanceMainComponentId: snapshot.instanceMainComponentId
          });
        });
      } catch (_) {
        failedProbes++;
      } finally {
        safeRemoveNode(probe);
      }
    });
  if (failedProbes > 0) {
    warnings.push(`变体“${safeRead(() => sourceComponent.name, '未命名')}”有 ${failedProbes} 个属性无法通过行为探测定位图层`);
  }
  return mergeReferenceSnapshots(knownReferences, discovered);
};

const validateRestoredVariantSet = (
  set: ComponentSetNode,
  records: ReversedVariantRecord[],
  warnings: string[]
) => {
  const actualComponents = getChildren(set).filter(node => node.type === 'COMPONENT') as ComponentNode[];
  if (actualComponents.length !== records.length) {
    throw new Error(`组件集合并不完整：已生成 ${records.length} 个真实变体，合并后保留 ${actualComponents.length} 个`);
  }

  // combineAsVariants 会按组件集规则规范化子组件名称；名称不是稳定身份，不能据此误判丢失。
  // 校验真正参与合并的节点 ID，确保结果仍由刚刚生成的全部组件组成。
  const actualIds = new Set(actualComponents.map(component => component.id));
  const missingRecords = records.filter(record => !actualIds.has(record.component.id));
  if (missingRecords.length > 0) {
    throw new Error(`组件集合并结果异常：${missingRecords.length} 个已生成变体没有进入结果组件集`);
  }

  const normalizedNameCount = records.filter(record =>
    safeRead(() => record.sourceComponent.name, '').trim()
    !== safeRead(() => record.component.name, '').trim()
  ).length;
  if (normalizedNameCount > 0) {
    warnings.push(`MasterGo 合并时规范化了 ${normalizedNameCount} 个变体名称，已按组件节点身份确认全部变体完整`);
  }
};

const reverseFullComponentSet = async (
  source: InstanceNode,
  main: ComponentNode,
  sourceSet: ComponentSetNode,
  sourceVariants: ComponentNode[],
  properties: BuilderPropertySnapshot[],
  fallbackReferences: BuilderReferenceSnapshot[],
  masterName: string,
  placement: BuilderPlacement,
  warnings: string[]
) => {
  const records: ReversedVariantRecord[] = [];
  const temporaryInstances: InstanceNode[] = [];
  let set: ComponentSetNode | null = null;
  let cursorX = placement.x;
  const variantNames = new Set<string>();
  try {
    for (const sourceVariant of sourceVariants) {
      const variantName = safeRead(() => sourceVariant.name, '').trim();
      if (!variantName) throw new Error('原组件集存在无名称变体，无法安全还原属性对应关系');
      if (variantNames.has(variantName)) throw new Error(`原组件集存在重名变体“${variantName}”，已停止以避免错误合并`);
      variantNames.add(variantName);

      const isSelectedVariant = sameComponentIdentity(sourceVariant, main);
      const variantPlacement = { x: cursorX, y: placement.y };
      let built: ReverseComponentBuild;
      if (isSelectedVariant) {
        built = await buildReversedComponentWithMainFallback(
          source,
          sourceVariant,
          variantName,
          variantPlacement,
          warnings
        );
      } else {
        let variantInstance: InstanceNode | null = null;
        try {
          variantInstance = sourceVariant.createInstance();
          temporaryInstances.push(variantInstance);
          built = await buildReversedComponentFromInstance(
            variantInstance,
            variantName,
            variantPlacement,
            warnings
          );
        } catch (instanceError) {
          safeRemoveNode(variantInstance);
          warnings.push(
            `变体“${variantName}”无法创建临时实例：${String((instanceError as any)?.message || instanceError)}；已改从原组件结构恢复`
          );
          built = await buildReversedComponentFromSourceComponent(
            sourceVariant,
            variantName,
            variantPlacement,
            warnings
          );
        } finally {
          safeRemoveNode(variantInstance);
        }
      }
      built.component.name = variantName;
      copyPublishableMetadata(sourceVariant, built.component);
      const knownReferences = captureComponentReferences(sourceVariant)
        .filter(snapshot => Boolean(resolveSnapshotNode(built.component, snapshot)));
      const references = discoverComponentReferencesByBehavior(
        sourceVariant,
        properties,
        knownReferences,
        warnings
      );
      records.push({
        ...built,
        sourceComponent: sourceVariant,
        references
      });
      cursorX += Math.max(1, safeRead(() => built.component.width, 1)) + 48;
    }
    temporaryInstances.forEach(safeRemoveNode);

    if (records.length !== sourceVariants.length || records.length < 2) {
      throw new Error(`完整性校验失败：发现 ${sourceVariants.length} 个真实变体，但只还原 ${records.length} 个`);
    }
    // 合并前先将临时组件收进二维网格；此前单行递增会让结果组件集宽到 4500px 以上。
    const stagingComponents = records.map(record => record.component);
    const stagingColumns = Math.max(1, Math.ceil(Math.sqrt(stagingComponents.length)));
    const stagingMaxWidth = Math.max(...stagingComponents.map(component => Math.max(1, safeRead(() => component.width, 1))));
    const stagingMaxHeight = Math.max(...stagingComponents.map(component => Math.max(1, safeRead(() => component.height, 1))));
    stagingComponents.forEach((component, index) => {
      placeReverseTarget(component, {
        x: placement.x + (index % stagingColumns) * (stagingMaxWidth + 24),
        y: placement.y + Math.floor(index / stagingColumns) * (stagingMaxHeight + 24)
      });
    });

    set = mg.combineAsVariants(stagingComponents);
    set.name = masterName;
    validateRestoredVariantSet(set, records, warnings);
    copyPublishableMetadata(sourceSet, set);
    set.flexMode = 'NONE';
    const compactComponents = getChildren(set).filter(node => node.type === 'COMPONENT') as ComponentNode[];
    const columns = Math.max(1, Math.ceil(Math.sqrt(compactComponents.length)));
    const maxWidth = Math.max(...compactComponents.map(component => Math.max(1, safeRead(() => component.width, 1))));
    const maxHeight = Math.max(...compactComponents.map(component => Math.max(1, safeRead(() => component.height, 1))));
    compactComponents.forEach((component, index) => {
      component.x = 24 + (index % columns) * (maxWidth + 24) + (maxWidth - component.width) / 2;
      component.y = 24 + Math.floor(index / columns) * (maxHeight + 24) + (maxHeight - component.height) / 2;
    });
    const rows = Math.ceil(compactComponents.length / columns);
    set.resize(
      48 + columns * maxWidth + Math.max(0, columns - 1) * 24,
      48 + rows * maxHeight + Math.max(0, rows - 1) * 24
    );
    placeReverseTarget(
      set,
      getReversePlacement(
        source,
        safeRead(() => set!.width, safeRead(() => source.width, 0.01)),
        safeRead(() => set!.height, safeRead(() => source.height, 0.01)),
        [set]
      )
    );

    const restored = restoreReversedSetProperties(set, records, properties, fallbackReferences);
    warnings.push(...restored.warnings);
    restoreVariantAliases(set, properties, warnings);
    const actualVariantProperties = safeRead(
      () => set!.componentPropertyValues.filter(property => property.type === 'VARIANT').length,
      0
    );
    const recoveryMode: ReverseRecoveryMode = records.some(record => record.recoveryMode === 'raster')
      ? 'raster'
      : records.some(record => record.recoveryMode === 'structure') ? 'structure' : 'native';
    return {
      target: set as SceneNode,
      component: records[0].component,
      propertyCount: actualVariantProperties + restored.restoredCount,
      variantCount: records.length,
      overflowVariantCount: 0,
      overflowVariantCountIsMinimum: false,
      warnings,
      recoveryMode
    };
  } catch (error) {
    temporaryInstances.forEach(safeRemoveNode);
    if (set) {
      safeRemoveNode(set);
    } else {
      const partialSets = new Set<ComponentSetNode>();
      records.forEach(record => {
        const parent = safeRead(() => record.component.parent, null);
        if (parent?.type === 'COMPONENT_SET') partialSets.add(parent as ComponentSetNode);
      });
      partialSets.forEach(safeRemoveNode);
      records.forEach(record => safeRemoveNode(record.component));
    }
    throw error;
  }
};

const reverseInstanceToMaster = async (source: InstanceNode) => {
  if (safeRead(() => source.removed, true)) {
    throw new Error('所选实例已失效，请重新选择后再试');
  }
  const main = safeMainComponent(source);
  const mainParent = main ? safeRead(() => main.parent, null) : null;
  const sourceSet = mainParent?.type === 'COMPONENT_SET'
    ? mainParent as ComponentSetNode
    : null;
  const definitions = safeRead(
    () => sourceSet?.componentPropertyValues || main?.componentPropertyValues || [],
    [] as ComponentPropertyValue[]
  );
  const sourceProperties = safeRead(
    () => source.componentProperties || [],
    [] as ComponentProperties[]
  );
  const properties = createBuilderPropertySnapshots(definitions, sourceProperties);
  const referenceRoot = main && !safeRead(() => main.removed, true) ? main : source;
  const referenceSnapshots = captureComponentReferences(referenceRoot);
  const masterName = safeRead(
    () => sourceSet?.name || main?.name || source.name || 'Reversed Component',
    'Reversed Component'
  );
  const placement = getReversePlacement(source);
  const warnings: string[] = [];
  let limitVariantExpansion = false;
  let overflowVariantCount = 0;
  let overflowVariantCountIsMinimum = false;

  if (sourceSet && main) {
    const discovery = await discoverSourceVariantComponents(
      source,
      main,
      sourceSet,
      properties,
      warnings
    );
    if (discovery.overflowCount > 0) {
      limitVariantExpansion = true;
      overflowVariantCount = discovery.overflowCount;
      overflowVariantCountIsMinimum = Boolean(discovery.overflowCountIsMinimum);
      const countText = overflowVariantCountIsMinimum
        ? `至少 ${overflowVariantCount}`
        : String(overflowVariantCount);
      warnings.push(`原组件集包含 ${countText} 个变体，超过完整还原上限 ${MAX_REVERSED_VARIANTS}；已保留组件集结构和原属性，仅生成当前实例对应的一个真实变体`);
    } else if (discovery.variants.length > 1) {
      return reverseFullComponentSet(
        source,
        main,
        sourceSet,
        discovery.variants,
        properties,
        referenceSnapshots,
        masterName,
        placement,
        warnings
      );
    }
  }

  const variantProperties = properties.filter(property => property.type === 'VARIANT');
  let component: ComponentNode | null = null;
  let target: SceneNode | null = null;
  try {
    const componentName = variantProperties.length > 0
      ? safeRead(() => main?.name || '', '')
        || variantProperties.map(property => `${property.name}=${String(property.value)}`).join(', ')
      : masterName;
    const built = await buildReversedComponentWithMainFallback(
      source,
      main,
      componentName,
      placement,
      warnings
    );
    component = built.component;
    copyPublishableMetadata(main, component);
    if (built.recoveryMode === 'raster' && !limitVariantExpansion) {
      return {
        target: component as SceneNode,
        component,
        propertyCount: 0,
        variantCount: 1,
        overflowVariantCount,
        overflowVariantCountIsMinimum,
        warnings,
        recoveryMode: built.recoveryMode
      };
    }

    if (variantProperties.length > 0 || limitVariantExpansion) {
      let set: ComponentSetNode | null = null;
      let setCreationError: unknown = null;
      try {
        set = mg.combineAsVariants([component]);
      } catch (setError) {
        setCreationError = setError;
        if (limitVariantExpansion) {
          const values = Object.fromEntries(
            variantProperties.map(property => [property.name, String(property.value)])
          );
          try {
            component.setVariantPropertyValues(
              Object.keys(values).length > 0 ? values : { Variant: component.name || 'Default' }
            );
            const generatedParent = safeRead(() => component!.parent, null);
            if (generatedParent?.type !== 'COMPONENT_SET') throw setError;
            set = generatedParent as ComponentSetNode;
          } catch (_) {
            throw new Error(`组件集创建失败：${String((setError as any)?.message || setError)}`);
          }
        }
      }
      if (!set) {
        warnings.push(`组件集创建失败，已保留为单个组件母版：${String((setCreationError as any)?.message || setCreationError)}`);
        component.name = masterName;
        placeReverseTarget(component, placement);
        const restored = restoreReversedProperties(component, component, properties, referenceSnapshots);
        warnings.push(...restored.warnings);
        return {
          target: component as SceneNode,
          component,
          propertyCount: restored.restoredCount,
          variantCount: 1,
          overflowVariantCount,
          overflowVariantCountIsMinimum,
          warnings,
          recoveryMode: built.recoveryMode
        };
      }
      set.name = masterName;
      copyPublishableMetadata(sourceSet, set);
      placeReverseTarget(set, getReversePlacement(source, set.width, set.height, [set]));
      target = set as SceneNode;
      const restored = restoreReversedProperties(set, component, properties, referenceSnapshots);
      warnings.push(...restored.warnings);
      const restoredVariantCount = limitVariantExpansion
        ? restoreLimitedVariantSchema(set, component, properties, warnings)
        : safeRead(
          () => set!.componentPropertyValues.filter(property => property.type === 'VARIANT').length,
          variantProperties.length
        );
      restoreVariantAliases(set, properties, warnings);
      return {
        target,
        component,
        propertyCount: restoredVariantCount + restored.restoredCount,
        variantCount: 1,
        overflowVariantCount,
        overflowVariantCountIsMinimum,
        warnings,
        recoveryMode: built.recoveryMode
      };
    }

    const restored = restoreReversedProperties(component, component, properties, referenceSnapshots);
    warnings.push(...restored.warnings);
    placeReverseTarget(component, placement);
    target = component as SceneNode;
    return {
      target,
      component,
      propertyCount: restored.restoredCount,
      variantCount: 1,
      overflowVariantCount,
      overflowVariantCountIsMinimum,
      warnings,
      recoveryMode: built.recoveryMode
    };
  } catch (error) {
    safeRemoveNode(target || component);
    throw error;
  }
};

const commonNamePrefix = (names: string[]) => {
  if (names.length === 0) return 'Component';
  const tokenLists = names.map(name => name.split(/[\/_-]/).map(token => token.trim()).filter(Boolean));
  const first = tokenLists[0];
  const common: string[] = [];
  for (let index = 0; index < first.length; index++) {
    if (tokenLists.every(tokens => tokens[index]?.toLocaleLowerCase() === first[index].toLocaleLowerCase())) {
      common.push(first[index]);
    } else break;
  }
  return common.join('/') || names[0] || 'Component';
};

const safeVariantValue = (value: string, index: number) =>
  String(value || `Variant ${index + 1}`).replace(/[,=]/g, ' ').replace(/\s+/g, ' ').trim();

const wrapFramesAsOneComponent = (frames: FrameNode[], name: string) => {
  const parent: any = frames[0]?.parent;
  if (!parent || frames.some(frame => frame.parent !== parent)) {
    throw new Error('创建单个组件时，所选 Frame 必须位于同一父级');
  }
  const ordered = [...frames].sort((a, b) =>
    Array.from(parent.children).indexOf(a) - Array.from(parent.children).indexOf(b)
  );
  const minX = Math.min(...frames.map(frame => frame.x));
  const minY = Math.min(...frames.map(frame => frame.y));
  const maxX = Math.max(...frames.map(frame => frame.x + frame.width));
  const maxY = Math.max(...frames.map(frame => frame.y + frame.height));
  const firstIndex = Array.from(parent.children).indexOf(ordered[0]);
  const positions = ordered.map(frame => ({
    frame,
    x: frame.x - minX,
    y: frame.y - minY,
    originalX: frame.x,
    originalY: frame.y,
    originalIndex: Array.from(parent.children).indexOf(frame)
  }));
  const component = mg.createComponent();

  try {
    parent.insertChild(Math.max(0, firstIndex), component);
    component.name = name || commonNamePrefix(frames.map(frame => frame.name));
    component.x = minX;
    component.y = minY;
    component.resize(Math.max(0.01, maxX - minX), Math.max(0.01, maxY - minY));
    component.fills = [];
    component.strokes = [];
    positions.forEach(({ frame, x, y }) => {
      component.appendChild(frame);
      frame.x = x;
      frame.y = y;
    });
    return component;
  } catch (error) {
    positions
      .sort((a, b) => a.originalIndex - b.originalIndex)
      .forEach(({ frame, originalX, originalY, originalIndex }) => {
        if (!frame.removed && frame.parent !== parent) {
          parent.insertChild(Math.max(0, originalIndex), frame);
        }
        trySet(frame, 'x', originalX);
        trySet(frame, 'y', originalY);
      });
    if (!component.removed) component.remove();
    throw error;
  }
};

const buildComponentAiContext = (language = 'zh') => {
  const selection = mg.document.currentPage.selection;
  const selectedComponents = selection.filter(node => node.type === 'COMPONENT') as ComponentNode[];
  const selectedSets = selection.filter(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];
  const valid = (selection.length === 1 && selectedSets.length === 1)
    || (selection.length >= 1 && selection.length <= 10 && selectedComponents.length === selection.length);
  if (!valid) throw new Error(language === 'en'
    ? 'Select one component set or 1–10 standalone components.'
    : '请选择 1 个组件集，或 1–10 个独立组件。');

  const owners: Array<ComponentNode | ComponentSetNode> = selectedSets.length ? selectedSets : selectedComponents;
  const issues: Array<{ code: string; severity: 'warning' | 'info'; targetId: string; message: string }> = [];
  const selectedNameCounts = new Map<string, number>();
  owners.forEach(owner => {
    const key = owner.name.trim().toLocaleLowerCase();
    selectedNameCounts.set(key, (selectedNameCounts.get(key) || 0) + 1);
  });

  const targets = owners.map(owner => {
    const variants = owner.type === 'COMPONENT_SET'
      ? getChildren(owner).filter(node => node.type === 'COMPONENT') as ComponentNode[]
      : [];
    const values: Record<string, Set<string>> = {};
    const signatures = new Map<string, string[]>();
    const propertyPresence = new Map<string, number>();
    variants.forEach(variant => {
      const props = parseVariantName(variant.name);
      const keys = Object.keys(props);
      keys.forEach(key => {
        if (!values[key]) values[key] = new Set<string>();
        values[key].add(props[key]);
        propertyPresence.set(key, (propertyPresence.get(key) || 0) + 1);
      });
      const signature = keys.sort().map(key => `${key.toLocaleLowerCase()}=${props[key].toLocaleLowerCase()}`).join('|');
      const names = signatures.get(signature) || [];
      names.push(variant.name);
      signatures.set(signature, names);
    });

    signatures.forEach(names => {
      if (names.length < 2) return;
      issues.push({
        code: 'duplicate-variant', severity: 'warning', targetId: owner.id,
        message: language === 'en'
          ? `${owner.name}: ${names.length} variants use the same property combination.`
          : `${owner.name}：发现 ${names.length} 个属性组合重复的变体。`
      });
    });
    propertyPresence.forEach((count, property) => {
      if (variants.length > 0 && count < variants.length) {
        issues.push({
          code: 'missing-property', severity: 'warning', targetId: owner.id,
          message: language === 'en'
            ? `${owner.name}: “${property}” is missing from ${variants.length - count} variants.`
            : `${owner.name}：属性“${property}”在 ${variants.length - count} 个变体中缺失。`
        });
      }
    });
    if (/^(component|组件|variant|变体)(\s*\d+)?$/i.test(owner.name.trim())) {
      issues.push({
        code: 'generic-name', severity: 'info', targetId: owner.id,
        message: language === 'en' ? `${owner.name}: the name is too generic.` : `${owner.name}：名称过于宽泛。`
      });
    }
    if ((selectedNameCounts.get(owner.name.trim().toLocaleLowerCase()) || 0) > 1) {
      issues.push({
        code: 'duplicate-name', severity: 'warning', targetId: owner.id,
        message: language === 'en' ? `${owner.name}: duplicate selected component name.` : `${owner.name}：所选组件中存在重名。`
      });
    }

    const definitions = safeRead(() => owner.componentPropertyValues || [], [] as ComponentPropertyValue[]);
    const propertyDefinitions = definitions.map(definition => ({
      key: definition.id || definition.name,
      name: definition.name,
      type: definition.type,
      defaultValue: String(definition.defaultValue ?? '')
    }));
    const propertyValues = Object.fromEntries(
      Object.entries(values).map(([key, set]) => [key, Array.from(set).slice(0, 24)])
    );
    return {
      id: owner.id,
      type: owner.type,
      name: owner.name,
      description: safeRead(() => owner.description || '', ''),
      propertyDefinitions,
      propertyValues,
      variantCount: variants.length,
      variantNames: variants.slice(0, 40).map(variant => variant.name),
      variantsTruncated: Math.max(0, variants.length - 40)
    };
  });

  return { platform: 'mastergo', language, selectionIds: owners.map(owner => owner.id), targets, issues };
};

const applyComponentAiPlan = (plan: any) => {
  const selection = mg.document.currentPage.selection;
  const allowedIds = new Set(selection.map(node => node.id));
  const selectedComponents = selection.filter(node => node.type === 'COMPONENT');
  const selectedSets = selection.filter(node => node.type === 'COMPONENT_SET');
  const valid = (selection.length === 1 && selectedSets.length === 1)
    || (selection.length >= 1 && selection.length <= 10 && selectedComponents.length === selection.length);
  if (!valid) throw new Error('当前选择已变化，请重新分析后再应用');

  let changed = 0;
  const warnings: string[] = [];
  const targetPlans = Array.isArray(plan?.targets) ? plan.targets.slice(0, 10) : [];
  const desiredNameCounts = new Map<string, number>();
  targetPlans.forEach((targetPlan: any) => {
    const key = String(targetPlan?.name || '').trim().toLocaleLowerCase();
    if (key) desiredNameCounts.set(key, (desiredNameCounts.get(key) || 0) + 1);
  });
  targetPlans.forEach((targetPlan: any) => {
    const id = String(targetPlan?.id || '');
    if (!allowedIds.has(id)) return;
    const owner = mg.getNodeById(id);
    if (!owner || (owner.type !== 'COMPONENT' && owner.type !== 'COMPONENT_SET')) return;

    const nextName = String(targetPlan.name || '').trim().slice(0, 120);
    const description = String(targetPlan.description || '').trim().slice(0, 1000);
    if (nextName && nextName !== owner.name) {
      if ((desiredNameCounts.get(nextName.toLocaleLowerCase()) || 0) > 1) warnings.push(`方案中的组件名“${nextName}”重复，已跳过`);
      else { owner.name = nextName; changed++; }
    }
    if (description) {
      try { owner.description = description; changed++; } catch (_) { warnings.push(`${owner.name} 的描述无法写入`); }
    }

    if (owner.type === 'COMPONENT_SET') {
      const valueRenames = Array.isArray(targetPlan.valueRenames) ? targetPlan.valueRenames.slice(0, 120) : [];
      for (const rename of valueRenames) {
        const property = String(rename?.property || '').trim();
        const from = String(rename?.from || '').trim();
        const to = String(rename?.to || '').trim().replace(/[,=]/g, ' ').slice(0, 80);
        if (!property || !from || !to || from === to) continue;
        const existingValues = new Set(
          getChildren(owner).filter(node => node.type === 'COMPONENT')
            .map(node => parseVariantName(node.name)[property])
            .filter(Boolean)
        );
        if (existingValues.has(to)) {
          warnings.push(`${owner.name} 的属性“${property}”已存在值“${to}”，为避免重复变体已跳过`);
          continue;
        }
        try { owner.editVariantPropertyValues({ [property]: { oldValue: from, newValue: to } }); changed++; }
        catch (_) { warnings.push(`${owner.name} 的属性值“${property}=${from}”无法重命名`); }
      }
    }

    const propertyRenames = Array.isArray(targetPlan.propertyRenames) ? targetPlan.propertyRenames.slice(0, 40) : [];
    for (const rename of propertyRenames) {
      const from = String(rename?.from || '').trim();
      const to = String(rename?.to || '').trim().replace(/[,=]/g, ' ').slice(0, 80);
      if (!from || !to || from === to) continue;
      const definition = safeRead(
        () => owner.componentPropertyValues.find(property => property.name === from),
        undefined as ComponentPropertyValue | undefined
      );
      if (!definition) { warnings.push(`${owner.name} 中未找到属性“${from}”`); continue; }
      const hasNameCollision = safeRead(
        () => owner.componentPropertyValues.some(property => property.name !== from && property.name.toLocaleLowerCase() === to.toLocaleLowerCase()),
        false
      );
      if (hasNameCollision) { warnings.push(`${owner.name} 中已存在属性“${to}”，已跳过`); continue; }
      try {
        if (owner.type === 'COMPONENT_SET' && definition.type === 'VARIANT') {
          owner.editVariantProperties({ [from]: to });
        } else {
          owner.editComponentProperty(definition.id || definition.name, { name: to });
        }
        changed++;
      } catch (_) { warnings.push(`${owner.name} 的属性“${from}”无法重命名`); }
    }
  });
  return { changed, warnings };
};

const sendComponentBuilderSelection = () => {
  const selection = mg.document.currentPage.selection;
  const frames = selection.filter(node => node.type === 'FRAME');
  const instances = selection.filter(node => node.type === 'INSTANCE');
  const components = selection.filter(node => node.type === 'COMPONENT');
  const componentSets = selection.filter(node => node.type === 'COMPONENT_SET');
  const canOptimize = (selection.length === 1 && componentSets.length === 1)
    || (selection.length >= 1 && selection.length <= 10 && components.length === selection.length);
  sendToUI({
    type: 'component-builder-selection',
    total: selection.length,
    frames: frames.length,
    instances: instances.length,
    components: components.length,
    componentSets: componentSets.length,
    canOptimize,
    canReverse: selection.length === 1 && instances.length === 1,
    canBuild: selection.length > 0 && frames.length === selection.length,
    sameParent: selection.length > 0 && selection.every(node => node.parent === selection[0].parent),
    selectionIds: selection.map(node => node.id),
    names: selection.slice(0, 4).map(node => node.name)
  });
};

mg.on('selectionchange', sendComponentBuilderSelection);
let componentReverseRunning = false;

// 监听选择变化，主动推送 CompKit 属性更新
let lastCompKitTargetId: string | null = null;
mg.on('selectionchange', () => {
  const selection = mg.document.currentPage.selection;
  let targetId: string | null = null;
  let properties: string[] = [];
  let componentName = '';
  let propertyValues: { [key: string]: string[] } = {};
  let variantsCount = 0;

  if (selection.length === 1) {
    if (selection[0].type === 'COMPONENT_SET') {
      targetId = selection[0].id;
      const componentSet = selection[0] as ComponentSetNode;
      componentName = componentSet.name;
      variantsCount = componentSet.children.length;

      if (componentSet.children.length > 0) {
        const sampleName = componentSet.children[0].name;
        properties = sampleName.split(',').map(p => p.split('=')[0].trim());

        // 收集每个属性的所有值
        const variants = componentSet.children as ComponentNode[];
        properties.forEach(prop => {
          const values = new Set<string>();
          variants.forEach(v => {
            const props = v.name.split(',').reduce((acc, pair) => {
              const [key, val] = pair.split('=').map(s => s.trim());
              acc[key] = val;
              return acc;
            }, {} as { [key: string]: string });
            if (props[prop]) values.add(props[prop]);
          });
          propertyValues[prop] = Array.from(values);
        });
      }
    } else if (selection[0].type === 'FRAME' && selection[0].getPluginData('isShowcaseBoard') === 'true') {
      const compSet = selection[0].findOne(n => n.type === 'COMPONENT_SET') as ComponentSetNode | null;
      if (compSet) {
        targetId = compSet.id;
        componentName = compSet.name;
        variantsCount = compSet.children.length;

        if (compSet.children.length > 0) {
          const sampleName = compSet.children[0].name;
          properties = sampleName.split(',').map(p => p.split('=')[0].trim());

          // 收集每个属性的所有值
          const variants = compSet.children as ComponentNode[];
          properties.forEach(prop => {
            const values = new Set<string>();
            variants.forEach(v => {
              const props = v.name.split(',').reduce((acc, pair) => {
                const [key, val] = pair.split('=').map(s => s.trim());
                acc[key] = val;
                return acc;
              }, {} as { [key: string]: string });
              if (props[prop]) values.add(props[prop]);
            });
            propertyValues[prop] = Array.from(values);
          });
        }
      }
    }
  }

  // 只有当目标变化时才推送
  if (targetId !== lastCompKitTargetId) {
    lastCompKitTargetId = targetId;
    sendToUI({
      type: 'compkit-props',
      properties,
      targetId,
      componentName,
      propertyValues,
      variantsCount
    });
  }
});

mg.ui.onmessage = async (rawMessage) => {
  const msg = rawMessage?.pluginMessage || rawMessage;
  if (!msg || !msg.type) return;
  if (msg.type === 'mg-image-size-result') {
    const resolve = imageSizeWaiters.get(msg.reqId);
    if (resolve) {
      imageSizeWaiters.delete(msg.reqId);
      resolve(msg.error ? null : { width: msg.width, height: msg.height });
    }
    return;
  }

  console.log("【2】后端：收到了消息 ->", msg.type);
  const selection = mg.document.currentPage.selection;

  // 核心路由
  switch (msg.type) {

    // ===========================
    // H. 智能填充 (Smart Fill)
    // ===========================

    // 1. 获取选中图层数量 (用于前端生成对应数量的数据)
    case 'get-selection-count': {
      const textNodes = [];
      const traverse = (n: any) => {
        if (n.type === 'TEXT' && !n.removed && n.isVisible) textNodes.push(n);
        if ('children' in n) n.children.forEach(traverse);
      };
      const scope = mg.document.currentPage.selection.length > 0 ? mg.document.currentPage.selection : [mg.document.currentPage];
      scope.forEach(traverse);

      sendToUI({ type: 'selection-count-res', count: textNodes.length });
      break;
    }

    // 2. 执行填充
    case 'smart-fill-exec': {
      const { dataList, mode, distribution } = msg;
      // dataList: string[] - 待填充的内容数组
      // mode: 'replace' | 'prefix' | 'suffix'
      // distribution: 'order' (顺序) | 'random' (随机)

      if (!Array.isArray(dataList) || dataList.length === 0) {
        mg.notify("填充列表为空");
        return;
      }

      const textNodes: TextNode[] = [];
      const traverse = (n: any) => {
        if (n.type === 'TEXT' && !n.removed && n.isVisible) textNodes.push(n);
        if ('children' in n) n.children.forEach(traverse);
      };
      // 优先处理选中项，没选中则不处理（防止误操作全页）
      if (mg.document.currentPage.selection.length > 0) {
        mg.document.currentPage.selection.forEach(traverse);
      } else {
        mg.notify("请先选择包含文本的图层");
        return;
      }

      if (textNodes.length === 0) {
        mg.notify("未找到文本图层");
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
          await loadTextFonts(node);

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

      mg.notify(`已填充 ${changeCount} 个文本`);
      break;
    }

    // 3. 存储/读取配置 (ClientStorage)
    case 'save-storage': {
      await mg.clientStorage.setAsync(msg.key, msg.value);
      if (msg.notify) mg.notify("配置已保存");
      sendToUI({ type: 'storage-saved', key: msg.key, value: msg.value });
      break;
    }

    case 'load-storage': {
      const value = await mg.clientStorage.getAsync(msg.key);
      sendToUI({ type: 'storage-loaded', key: msg.key, value: value });
      break;
    }

    case 'req-ai-config': {
      const aiConfig = await mg.clientStorage.getAsync('smart_ai_config');
      sendToUI({ type: 'init-ai-config', data: aiConfig || {} });
      break;
    }

    // ===========================
    // A. 简易工具 (Simple Tools)
    // ===========================

    case 'to-frame': {
      if (selection.length === 0) { mg.notify("请选择形状"); return; }
      const newSelection: FrameNode[] = [];
      const selCopy = [...selection];
      for (const node of selCopy) {
        if (node.removed) continue;
        const parent = node.parent;
        if (!parent) continue;
        const idx = parent.children.indexOf(node);

        const frame = mg.createFrame();
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
      if (newSelection.length > 0) mg.document.currentPage.selection = newSelection;
      mg.notify("已转换为 Frame");
      break;
    }

    case 'to-rect': {
      if (selection.length === 0) { mg.notify("请选择图层"); return; }
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
        const rect = mg.createRectangle();
        rect.resize(node.width, node.height);
        rect.name = node.name;
        rect.x = node.x;
        rect.y = node.y;
        parent.insertChild(idx, rect);

        copyNodeStyles(node, rect);

        try { node.remove(); } catch(e) {}
        newSelection.push(rect);
      }
      if (newSelection.length > 0) mg.document.currentPage.selection = newSelection;
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
      if (count > 0) mg.notify("已交换填充/描边");
      break;
    }

    case 'reset-image': {
      for (const node of selection) {
        if ('fills' in node && Array.isArray(node.fills)) {
          const img = (node.fills as Paint[]).find(f => f.type === 'IMAGE');
          if (img && img.imageRef) {
            const asyncImg = mg.getImageByHref(img.imageRef);
            const size = await requestImageSize(await asyncImg.getBytesAsync());
            if (size && size.width) node.resize(node.width, node.width * (size.height / size.width));
          }
        }
      }
      break;
    }

    case 'remove-al': {
      let count = 0;
      function rm(n: any) {
        if (n.flexMode && n.flexMode !== 'NONE') { n.flexMode = 'NONE'; count++; }
        if (n.children) n.children.forEach(rm);
      }
      selection.forEach(rm);
      mg.notify(`移除 ${count} 个自动布局`);
      break;
    }

    case 'add-al-wrapper': {
      const newSelection = [];
      if (selection.length === 0) { mg.notify("请选择图层"); return; }
      for (const node of selection) {
        if (node.removed || !node.parent) continue;
        const frame = mg.createFrame();
        frame.name = "Auto Layout Wrapper";
        frame.flexMode = "VERTICAL";
        frame.itemSpacing = 10;
        frame.paddingLeft = 0; frame.paddingRight = 0;
        frame.paddingTop = 0; frame.paddingBottom = 0;
        frame.mainAxisSizingMode = "AUTO";
        frame.crossAxisSizingMode = "AUTO";
        frame.fills = [solidPaint({ r: 1, g: 0, b: 0 })];
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
        mg.document.currentPage.selection = newSelection;
        mg.notify("已添加自动布局外套");
      }
      break;
    }

    case 'split-text': {
      const newSel = [];
      for (const node of selection) {
        if (node.type !== "TEXT") continue;
        const lines = node.characters.split(/\r\n|\r|\n/);
        if (lines.length <= 1) continue;
        try { await loadTextFonts(node); } catch (e) { mg.notify("字体加载失败"); continue; }
        let cy = node.y;
        for (const l of lines) {
          if (!l.trim()) continue;
          const t = node.clone(); t.characters = l; t.textAutoResize = "WIDTH_AND_HEIGHT"; t.y = cy;
          node.parent!.appendChild(t); newSel.push(t); cy += t.height + 10;
        }
        node.remove();
      }
      if (newSel.length > 0) mg.document.currentPage.selection = newSel;
      break;
    }

    case 'join-text': {
      const tNodes = selection.filter(n => n.type === 'TEXT').sort((a, b) => Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x);
      if (tNodes.length < 2) { mg.notify("请选2个以上文本"); return; }
      try { await loadTextFonts(tNodes[0]); } catch (e) { mg.notify("字体加载失败"); return; }
      const txt = tNodes.map(n => n.characters).join('\n');
      const nt = tNodes[0].clone(); nt.characters = txt; nt.textAutoResize = 'HEIGHT';
      tNodes.forEach(n => n.remove());
      mg.document.currentPage.selection = [nt];
      break;
    }

    // up-one
    case 'up-one': {
      const newSel: SceneNode[] = [];
      for (const node of selection) {
        const parent: any = node.parent;
        if (parent && parent.type !== 'PAGE' && parent.parent) {
          const grandParent: any = parent.parent;
          const absX = node.absoluteTransform[0][2];
          const absY = node.absoluteTransform[1][2];
          const gpAbsX = grandParent.type === 'PAGE' ? 0 : grandParent.absoluteTransform[0][2];
          const gpAbsY = grandParent.type === 'PAGE' ? 0 : grandParent.absoluteTransform[1][2];
          const relX = absX - gpAbsX;
          const relY = absY - gpAbsY;
          grandParent.appendChild(node);
          if ('flexMode' in grandParent && (grandParent as FrameNode).flexMode !== 'NONE') {
            try { (node as any).layoutPositioning = 'ABSOLUTE'; } catch(e) {}
          }
          node.x = relX;
          node.y = relY;
          newSel.push(node);
        }
      }
      if (newSel.length) mg.document.currentPage.selection = newSel;
      break;
    }

    // up-all 同理
    case 'up-all': {
      const page = mg.document.currentPage;
      const newSel: SceneNode[] = [];
      for (const node of selection) {
        const absX = node.absoluteTransform[0][2];
        const absY = node.absoluteTransform[1][2];
        page.appendChild(node);
        node.x = absX;
        node.y = absY;
        newSel.push(node);
      }
      mg.document.currentPage.selection = newSel;
      break;
    }

    case 'rename-content': {
      selection.forEach(n => {
        let name = "";
        if (n.type === 'TEXT') name = n.characters;
        else if ('findOne' in n) { const t = (n as any).findOne((x:any) => x.type === 'TEXT'); if (t) name = t.characters; }
        if (name) n.name = name.substring(0, 20);
      });
      mg.notify("已重命名");
      break;
    }

    case 'detach-all': {
      const sel = mg.document.currentPage.selection;
      if (sel.length === 0) { mg.notify("请先选中图层"); return; }
      const targets: InstanceNode[] = [];
      const scan = (n: any) => {
        if ('children' in n) {
          for (const child of (n as FrameNode | GroupNode).children) scan(child);
        }
        if (n.type === 'INSTANCE') targets.push(n);
      };
      sel.forEach(scan);
      if (targets.length === 0) { mg.notify("未找到可解绑的实例"); return; }
      for (const node of targets) {
        if (!node.removed) {
          try { node.detachInstance(); } catch (e) {}
        }
      }
      mg.notify(`已解绑 ${targets.length} 个组件`);
      break;
    }

    case 'remove-hidden': {
      let h: SceneNode[] = [];
      const pool = selection.length > 0 ? selection : [mg.document.currentPage];
      for (const n of pool) {
        if ((n as any).type !== 'PAGE' && (n as any).isVisible === false) h.push(n as SceneNode);
        if ('findAll' in n) h = h.concat((n as any).findAll((x: any) => !x.isVisible));
      }
      let count = 0;
      h.reverse().forEach(n => { if (!n.removed) { n.remove(); count++; } });
      mg.notify(`已删除 ${count} 个隐藏图层`);
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
          mg.notify(isReverse ? "已反转排列（从下到上）" : "已排列（从上到下）");
          layerSortDirection = isReverse ? 'asc' : 'desc';
        }
      } else {
        mg.notify("请至少选择两个同级图层");
      }
      break;
    }

    case 'sort-by-name': {
      // 按图层名称字典序排序：首字母→第二个字母→以此类推
      // 支持两种模式：选中多个同级图层排序；或选中单个容器对其直接子图层排序
      let p: any = null;
      let targets: SceneNode[] = [];
      if (selection.length > 1 && selection.every(n => n.parent === selection[0].parent)) {
        p = selection[0].parent;
        targets = [...selection];
      } else if (selection.length === 1 && 'children' in selection[0]) {
        p = selection[0];
        targets = [...(selection[0] as any).children];
      }
      if (!p || targets.length < 2) {
        mg.notify("请选择至少两个同级图层，或选择一个包含多个子图层的容器");
        return;
      }
      const isReverse = (layerNameSortDirection === 'desc');
      targets.sort((a, b) => {
        const cmp = a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        return isReverse ? -cmp : cmp;
      }).forEach(n => p!.appendChild(n));
      mg.notify(isReverse ? "已按名称倒序排列（Z→A）" : "已按名称排序（A→Z）");
      layerNameSortDirection = isReverse ? 'asc' : 'desc';
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
          ungroupNode(g);
          count++;
        }
      }
      mg.notify(`已解散 ${count} 个组`);
      break;
    }

    case 'unlock-all': {
      let count = 0;
      function ul(n: any) {
        if ('isLocked' in n && n.isLocked) { n.isLocked = false; count++; }
        if ('children' in n) n.children.forEach(ul);
      }
      selection.forEach(ul);
      mg.notify(`已解锁 ${count} 个图层`);
      break;
    }

    case 'pixel-perfect': {
      if (selection.length === 0) { mg.notify("请选择图层"); return; }
      let count = 0;
      for (const node of selection) {
        if (!node.removed) {
          const newX = Math.round(node.x);
          const newY = Math.round(node.y);
          const newW = Math.round(node.width);
          const newH = Math.round(node.height);
          if (node.x !== newX || node.y !== newY) { node.x = newX; node.y = newY; }
          if ((node.width !== newW || node.height !== newH) && 'resize' in node) node.resize(newW, newH);
          count++;
        }
      }
      mg.notify(`已对齐 ${count} 个图层`);
      break;
    }

    case 'swap-positions': {
      if (selection.length !== 2) { mg.notify("请严格选择 2 个图层进行交换"); return; }
      const n1 = selection[0];
      const n2 = selection[1];
      const x1 = n1.x, y1 = n1.y;
      n1.x = n2.x; n1.y = n2.y;
      n2.x = x1; n2.y = y1;
      mg.notify("位置已互换");
      break;
    }

    case 'create-styles': {
      console.log("=== 开始执行创建样式 ===");
      if (selection.length === 0) { mg.notify("请选择图层"); return; }
      let createdCount = 0;
      const conflicts: string[] = [];
      const errors: string[] = [];
      try {
        const localPaints = await mg.getLocalPaintStyles();
        const localTexts = await mg.getLocalTextStyles();
        const localEffects = await mg.getLocalEffectStyles();

        for (const node of selection) {
          if (node.removed) continue;
          const name = node.name;

          if ('fills' in node && node.type !== 'GROUP' && Array.isArray(node.fills) && node.fills.length > 0) {
            if (node.fills[0].type !== 'IMAGE') {
              const exist = localPaints.find(s => s.name === name);
              if (exist) { if (!conflicts.includes(name)) conflicts.push(name + " (颜色)"); }
              else {
                try {
                  const style = mg.createFillStyle({ id: node.id, name });
                  createdCount++;
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
                await loadTextFonts(node);
                const style = mg.createTextStyle({ id: node.id, name });
                createdCount++;
                try { setTextStyleId(node, style.id); } catch (e) {}
              } catch (err) { errors.push(name); }
            }
          }

          if ('effects' in node && Array.isArray(node.effects) && node.effects.length > 0) {
            const exist = localEffects.find(s => s.name === name);
            if (exist) { if (!conflicts.includes(name)) conflicts.push(name + " (效果)"); }
            else {
              try {
                const style = mg.createEffectStyle({ id: node.id, name });
                createdCount++;
                try { node.effectStyleId = style.id; } catch (e) {}
              } catch (err) { errors.push(name); }
            }
          }
        }
      } catch (e) { console.error("全局错误:", e); mg.notify("样式创建失败: " + String(e).slice(0, 50)); return; }

      const parts = [];
      if (createdCount > 0) parts.push(`新建 ${createdCount} 个`);
      if (conflicts.length > 0) parts.push(`跳过重复 ${conflicts.length} 个`);
      if (errors.length > 0) parts.push(`失败 ${errors.length} 个`);
      if (parts.length > 0) mg.notify(parts.join('，'));
      else mg.notify("未发现可创建的样式（选中的图层可能没有填充/文本/效果属性）");
      break;
    }

    case 'match-styles': {
      console.log("=== 开始匹配样式 ===");
      const sel = mg.document.currentPage.selection;
      if (sel.length === 0) { mg.notify("请先选择范围"); return; }
      let countFill = 0, countStroke = 0, countText = 0, countEffect = 0;
      try {
        const paints = await mg.getLocalPaintStyles();
        const texts = await mg.getLocalTextStyles();
        const effects = await mg.getLocalEffectStyles();

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
            td: s.decoration
          });
          textMap.set(fingerprint, s.id);
        });

        const traverse = async (node: any) => {
          if (node.removed) return;
          if ('fills' in node && node.fills !== mg.mixed && node.fills.length > 0 && node.fillStyleId === '') {
            const key = JSON.stringify(node.fills);
            if (paintMap.has(key)) { try { node.fillStyleId = paintMap.get(key)!; countFill++; } catch (e) {} }
          }
          if ('strokes' in node && node.strokes !== mg.mixed && node.strokes.length > 0 && node.strokeFillStyleId === '') {
            const key = JSON.stringify(node.strokes);
            if (paintMap.has(key)) { try { node.strokeFillStyleId = paintMap.get(key)!; countStroke++; } catch (e) {} }
          }
          if ('effects' in node && node.effects !== mg.mixed && node.effects.length > 0 && node.effectStyleId === '') {
            const key = JSON.stringify(node.effects);
            if (effectMap.has(key)) { try { node.effectStyleId = effectMap.get(key)!; countEffect++; } catch (e) {} }
          }
          if (node.type === 'TEXT' && getTextStyleId(node) === '') {
            const font = getTextFontName(node);
            const key = JSON.stringify({
              family: font?.family || '',
              style: font?.style || '',
              size: getTextFontSize(node),
              lh: getTextLineHeight(node),
              ls: getTextLetterSpacing(node),
              td: getTextDecoration(node)
            });
            if (textMap.has(key)) { try { setTextStyleId(node, textMap.get(key)!); countText++; } catch (e) {} }
          }
          if ('children' in node) {
            for (const child of node.children) await traverse(child);
          }
        };

        for (const node of sel) await traverse(node);
      } catch (e) { console.error(e); mg.notify("匹配出错"); return; }

      const total = countFill + countStroke + countText + countEffect;
      if (total > 0) mg.notify(`匹配成功: 填充${countFill} / 描边${countStroke} / 文本${countText} / 效果${countEffect}`);
      else mg.notify("未发现可匹配的样式");
      break;
    }

    // ===========================
    // B. 高级查找 (Find & Select) - 【已修复】
    // ===========================
    case 'fetch-selection-name': {
      const sel = mg.document.currentPage.selection;
      if (sel.length > 0) {
        sendToUI({ type: 'update-name-input', name: sel[0].name });
      } else {
        mg.notify("请先选择一个图层以获取名称");
      }
      break;
    }

    case 'find-and-select': {
        const f = msg.filters;
        const sel = mg.document.currentPage.selection;

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
                mg.notify("⚠️ 请先选择一个容器(Frame/Group)");
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
                mg.notify("⚠️ 请先选择一个容器(Frame/Group)");
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
                mg.notify("⚠️ 请先选择一个图层");
                return;
            }
        }
        else if (f.scope === 'page') {
            // 模式：全页 - 直接查找当前页面所有图层，忽略选中状态
            console.log(">> 策略: 全页面查找");
            const allPageNodes = mg.document.currentPage.findAll(() => true);
            searchTargets.push(...allPageNodes);
        }
        else {
            // 模式：子孙元素 (descendants) - 默认模式
            // 逻辑：如果选了图层，只查其子孙（不包含选中容器本身）；如果没选，查“全页”

            if (sel.length > 0) {
                console.log(">> 策略: 查找选中项及其后代");

                for (const node of sel) {
                    if ('findAll' in node) {
                        const children = node.findAll(() => true);
                        searchTargets.push(...children);
                    }
                }
            } else {
                console.log(">> 策略: 全页面查找");
                const allPageNodes = mg.document.currentPage.findAll(() => true);
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
                const ts = f.types.vals.map((value: string) => value === 'VECTOR' ? 'PEN' : value);
                let isType = false;

                if (ts.includes(t)) isType = true;
                if (ts.includes('AUTOLAYOUT') && t === 'FRAME' && node.flexMode !== 'NONE') isType = true;
                if (ts.includes('IMAGE') && 'fills' in node && node.fills !== mg.mixed && Array.isArray(node.fills)) {
                    if (node.fills.some(p => p.type === 'IMAGE' && p.isVisible !== false)) isType = true;
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

                if (s.includes('hidden') && !node.isVisible) isState = true;
                if (s.includes('locked') && node.isLocked) isState = true;
                if (s.includes('mask') && node.isMask) isState = true;
                if (s.includes('export') && node.exportSettings && node.exportSettings.length > 0) isState = true;

                if (s.includes('no-fill') && 'fills' in node && node.fills !== mg.mixed) {
                    if (Array.isArray(node.fills) && node.fills.length === 0) isState = true;
                }
                if (s.includes('no-stroke') && 'strokes' in node && node.strokes !== mg.mixed) {
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
                        else if (p.key === 'fillCount' && 'fills' in node && node.fills !== mg.mixed) val = node.fills.length;
                        else if (p.key === 'strokeCount' && 'strokes' in node && node.strokes !== mg.mixed) val = node.strokes.length;
                        else if (p.key in node) {
                            const v = node[p.key];
                            if (v !== mg.mixed) val = v;
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
            mg.document.currentPage.selection = results;
            mg.viewport.scrollAndZoomIntoView(results);
            mg.notify(`✅ 已选中 ${results.length} 个图层`);

            // 🔥 新增：将结果回传给 UI
            sendToUI({
              type: 'found-layers-result',
              count: results.length,
              layers: results.map(n => ({ id: n.id, name: n.name, type: n.type }))
            });

        } else {
            mg.notify("⚠️ 未找到图层，请检查 Console的筛选池大小");
            sendToUI({ type: 'found-layers-result', count: 0, layers: [] });
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

                    // 1. 批量获取目标图层
                    const nodes = await Promise.all(ids.map(id => mg.getNodeById(id)));

                    const targets: SceneNode[] = [];
                    const selection: SceneNode[] = [];
                    const currentPageId = mg.document.currentPage.id;

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
                            if (!node.isLocked && node.isVisible) {
                                selection.push(node as SceneNode);
                            }
                        }
                    }

                    if (targets.length > 0) {
                        // A. 尝试选中 (如果全是锁定的，这里就是空数组，会清空选择，是正确的表现)
                        mg.document.currentPage.selection = selection;

                        // B. 视图定位 (这是你要的核心功能)
                        mg.viewport.scrollAndZoomIntoView(targets);

                        // C. 只有多选时才提示，单选静默，体验最好
                        if (targets.length > 1) {
                            mg.notify(`已定位 ${targets.length} 项`);
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
    // D. 跨画板查重 (Duplicate Finder)
    // ===========================
    case 'dup-check': {
      const sel = mg.document.currentPage.selection;
      // 必须恰好选中两个容器 (Frame/Group/Section/Component 等)
      const containers = sel.filter(n => 'children' in n);
      if (sel.length !== 2 || containers.length !== 2) {
        mg.notify("请在画布上选中恰好两个画板/容器");
        return;
      }
      const [cA, cB] = containers;

      // 递归收集两容器内所有图层 (包含自身)
      const collectAll = (root: any): SceneNode[] => {
        const arr = [root];
        if ('findAll' in root) arr.push(...root.findAll(() => true));
        return arr;
      };
      const nodesA = collectAll(cA);
      const nodesB = collectAll(cB);

      // 名称分词：按 - _ 空格 . / 切词，统一小写
      const tokenize = (name: string): string[] => {
        return name.toLowerCase().split(/[-_\s./]+/).filter(t => t.length > 0);
      };

      const mode = msg.mode === 'substring' ? 'substring' : 'segment';
      const excludeNumeric = msg.excludeNumeric !== false;
      const excludeSet = new Set<string>((msg.excludeWords || []).map((w: string) => w.toLowerCase()));

      // 词段过滤：剔除排除词与纯数字编号
      const filterTokens = (tokens: string[]): string[] => {
        return tokens.filter(t => {
          if (excludeSet.has(t)) return false;
          if (excludeNumeric && /^\d+$/.test(t)) return false;
          return true;
        });
      };

      // 两两匹配，公共词段 ≥ 2 字符才计入
      const pairs: any[] = [];
      for (const a of nodesA) {
        const ta = filterTokens(tokenize(a.name));
        if (ta.length === 0) continue;
        for (const b of nodesB) {
          if (b.id === a.id) continue;
          const tb = filterTokens(tokenize(b.name));
          if (tb.length === 0) continue;
          let common: string[] = [];
          if (mode === 'segment') {
            // 分段匹配：词段完全相同才算命中
            common = ta.filter(t => t.length >= 2 && tb.includes(t));
          } else {
            // 子串匹配：词段被对方完整名称包含即命中
            const bFull = b.name.toLowerCase();
            const aFull = a.name.toLowerCase();
            const hitA = ta.filter(t => t.length >= 2 && bFull.includes(t));
            const hitB = tb.filter(t => t.length >= 2 && aFull.includes(t));
            common = Array.from(new Set([...hitA, ...hitB]));
          }
          if (common.length > 0) {
            pairs.push({ aId: a.id, aName: a.name, bId: b.id, bName: b.name, common });
          }
        }
      }

      // 按公共词数量降序
      pairs.sort((x, y) => y.common.length - x.common.length);

      // 防止结果过多导致 UI 卡死，最多返回 500 对
      const MAX_PAIRS = 500;
      const truncated = pairs.length > MAX_PAIRS;

      sendToUI({
        type: 'dup-check-result',
        data: {
          pairs: pairs.slice(0, MAX_PAIRS),
          totalPairs: pairs.length,
          truncated,
          aName: cA.name,
          bName: cB.name,
          aCount: nodesA.length,
          bCount: nodesB.length
        }
      });
      break;
    }

    case 'dup-select-layers': {
      // 勾选模式: add 加入选中 / remove 移出选中 / set 替换选中
      const ids: string[] = msg.ids || [];
      // dynamic-page 模式下必须用异步 API 获取节点
      const found = await Promise.all(ids.map(id => mg.getNodeById(id)));
      const nodes = found
        .filter(n => n && (n as any).type !== 'DOCUMENT' && (n as any).type !== 'PAGE') as SceneNode[];
      const cur = mg.document.currentPage.selection;
      let next: SceneNode[];
      if (msg.mode === 'add') {
        next = Array.from(new Set([...cur, ...nodes]));
      } else if (msg.mode === 'remove') {
        next = cur.filter(n => !ids.includes(n.id));
      } else {
        next = nodes;
      }
      mg.document.currentPage.selection = next;
      mg.notify(`已选中 ${next.length} 个图层`);
      break;
    }

    case 'dup-fill-red': {
      // 自动标记：左(A)侧勾选填红，右(B)侧勾选填绿
      // 可直接改 fills 的节点直接填充；Instance/Component/Group 等无法改 fills 的节点，
      // 在其下方插入同尺寸半透明标记矩形兑底，不改动目标节点本身
      try {
        const aIds: string[] = msg.aIds || [];
        const bIds: string[] = msg.bIds || [];
        console.log('[dup-fill-red] A侧', aIds.length, '个, B侧', bIds.length, '个');

        const runGroup = async (ids: string[], COLOR: RGB, tagName: string): Promise<{ filled: number, marked: number, skipped: number }> => {
          const stat = { filled: 0, marked: 0, skipped: 0 };
          if (ids.length === 0) return stat;
          // dynamic-page 模式下必须用异步 API 获取节点
          const found = await Promise.all(ids.map(id => mg.getNodeById(id)));
          const nodes: any[] = [];
          found.forEach((n, i) => {
            if (n && (n as any).type !== 'DOCUMENT' && (n as any).type !== 'PAGE') {
              nodes.push(n);
            } else {
              console.log('[dup-fill-red] 未找到节点:', ids[i], '->', n ? (n as any).type : null);
            }
          });

          // 直接改 fills（Instance/Component 的 fills 只读，赋值会抛错返回 false）
          const trySetFill = (node: any): boolean => {
            if (typeof node.fills === 'undefined') return false;
            try {
              node.fills = [solidPaint(COLOR, 0.35)];
              return true;
            } catch (e: any) {
              console.log('[dup-fill-red] 直接填充失败:', node.id, node.type, e && e.message);
              return false;
            }
          };

          // 在节点下方插入同尺寸半透明标记矩形
          const addMarkRect = (node: any): boolean => {
            try {
              const abs = node.absoluteBoundingBox;
              const parent: any = node.parent;
              if (!abs || !parent) {
                console.log('[dup-fill-red] 无包围盒或父容器:', node.id, node.type);
                return false;
              }
              const pabs = parent.absoluteBoundingBox;
              const rect = mg.createRectangle();
              rect.name = tagName + ' 查重标记';
              rect.resize(abs.width, abs.height);
              rect.x = abs.x - (pabs ? pabs.x : 0);
              rect.y = abs.y - (pabs ? pabs.y : 0);
              rect.fills = [solidPaint(COLOR, 0.35)];
              rect.opacity = 0.35;
              const idx = parent.children.indexOf(node);
              parent.insertChild(idx < 0 ? parent.children.length : idx, rect);
              return true;
            } catch (e: any) {
              console.log('[dup-fill-red] 矩形标记失败:', node.id, node.type, e && e.message);
              return false;
            }
          };

          for (const n of nodes) {
            if ('isLocked' in n && (n as any).isLocked) { stat.skipped++; continue; }
            if (trySetFill(n)) { stat.filled++; continue; }
            if (addMarkRect(n)) { stat.marked++; }
            else { stat.skipped++; }
          }
          return stat;
        };

        const red = await runGroup(aIds, { r: 1, g: 0, b: 0 }, '🔴');
        const green = await runGroup(bIds, { r: 0.18, g: 0.75, b: 0.33 }, '🟢');
        const redCount = red.filled + red.marked;
        const greenCount = green.filled + green.marked;
        const skipped = red.skipped + green.skipped;
        console.log('[dup-fill-red] 结果: 左红=' + redCount + ' 右绿=' + greenCount + ' 跳过=' + skipped);

        let msgTxt = `已标记 左红 ${redCount} 个 · 右绿 ${greenCount} 个`;
        if (skipped > 0) msgTxt += `（跳过 ${skipped} 个）`;
        mg.notify(msgTxt);
      } catch (e: any) {
        console.error('[dup-fill-red] 异常:', e);
        mg.notify('填充失败：' + (e && e.message ? e.message : String(e)));
      }
      break;
    }

    // ===========================
    // E. 文本查找与替换
    // ===========================
    case 'find-replace': {
      const { findText, replaceText } = msg;
      if (!findText) { mg.notify("请输入查找内容，注意区分大小写"); return; }

      // 确定范围：如果有选区则在选区内查，否则在全页查
      const scope = selection.length > 0 ? selection : [mg.document.currentPage];
      let count = 0;

      // 递归查找文本节点
      const textNodes: TextNode[] = [];
      const collect = (n: any) => {
        if (n.type === 'TEXT') textNodes.push(n);
        if ('children' in n) n.children.forEach(collect);
      };
      scope.forEach(collect);

      if (textNodes.length === 0) { mg.notify("范围内没有文本"); return; }

      // 批量处理
      for (const node of textNodes) {
        if (node.characters.includes(findText)) {
          try {
            await loadTextFonts(node);

            // 执行替换
            node.characters = node.characters.split(findText).join(replaceText);
            count++;
          } catch (e) {
            console.error("字体加载失败或替换出错", e);
          }
        }
      }

      if (count > 0) mg.notify(`已替换 ${count} 处文本`);
      else mg.notify("未找到匹配内容");
      break;
    }

    // ===========================
    // F. PPT 工具
    // ===========================
    case 'ppt-step-1': { // 初始化
      const pageName = mg.document.currentPage.name.toLowerCase();

      // --- 修复点 1：安全检查不通过时，要告诉 UI 重置按钮 ---
      if (!pageName.includes('copy') && !pageName.includes('副本')) {
        mg.notify("⚠️ 请先将 Page 重命名为 'xxx 副本' 以确保安全！", { type: 'error' });
        // 发送一个 'step-error' 消息给 UI，让它停止转圈
        sendToUI({ type: 'step-error', step: 1 });
        return;
      }

      const slides = getSlides();
      // --- 修复点 2：没选图层时，也要告诉 UI 重置按钮 ---
      if (slides.length === 0) {
        mg.notify("请至少选择一个 Frame 画板");
        sendToUI({ type: 'step-error', step: 1 });
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
            scopeNodes = mg.document.currentPage.children;
        } else {
            scopeNodes = mg.document.currentPage.selection;
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

        sendToUI({ type: 'lint-results', data: results });
        break;
    }

    case 'fix-variants': {
        const items = msg.items;
        let count = 0;
        for (const item of items) {
            try {
                const node = await mg.getNodeById(item.id);
                if (node) {
                    node.name = item.fullResult || item.newVal;
                    count++;
                }
            } catch (err) {}
        }
        mg.notify(`✨ 已成功修复 ${count} 项命名`);
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
            searchPool = [...mg.document.currentPage.selection];
        } else {
            // 搜索整个页面 (包含页面本身)
            searchPool = [mg.document.currentPage];
        }

        if (searchPool.length === 0 && scope === 'selection') {
            mg.notify("请先选择图层");
            // 即使失败，也要发回空结果，以此重置前端按钮状态
            sendToUI({ type: 'text-find-results', data: [] });
            return;
        }

        // 2. 递归查找函数
        const traverse = (node) => {
            // 只有可见的文本层才参与查找
            if (node.type === 'TEXT' && node.isVisible) {
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
        sendToUI({ type: 'text-find-results', data: results });

        if (results.length === 0) {
            mg.notify("未找到匹配文本");
        }
        break;
    }

    // -------------------------------------------------------------
    // 2. 定位功能 (修复版：兼容组件清洗和文字工具)
    // -------------------------------------------------------------
    case 'locate-node': {
        try {
            const node = await mg.getNodeById(msg.id);

            if (node) {
                // === 第一步：通用操作 (先选中并聚焦) ===
                // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                mg.document.currentPage.selection = [node];
                mg.viewport.scrollAndZoomIntoView([node]);

                // === 第二步：文字工具特有逻辑 (仅当是文本且包含索引参数时执行) ===
                if (node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number') {

                    const cacheKey = `${msg.id}_${msg.index}`;

                    // 加载字体
                    await loadTextFonts(node);

                    // A. 还原颜色
                    if (highlightCache[cacheKey]) {
                        const cachedData = highlightCache[cacheKey]; // { fills, length }
                        node.setRangeFills(msg.index, msg.index + cachedData.length, cachedData.fills);

                        delete highlightCache[cacheKey];
                        mg.notify("已还原颜色");
                        sendToUI({ type: 'highlight-status', key: cacheKey, status: false });

                    } else {
                        // B. 执行高亮
                        const currentFills = getTextFills(node, msg.index);
                        highlightCache[cacheKey] = { fills: currentFills, length: msg.length };

                        const highlightPaint = [solidPaint({ r: 1, g: 0, b: 0 })];
                        node.setRangeFills(msg.index, msg.index + msg.length, highlightPaint);

                        mg.notify("已标记 (再次点击可还原)");
                        sendToUI({ type: 'highlight-status', key: cacheKey, status: true });
                    }
                }
            } else {
                mg.notify("图层不存在 (可能已被删除)");
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
            const node = await mg.getNodeById(nodeId);
            if (!node || node.type !== 'TEXT') continue;

            const groupTasks = groups[nodeId];
            // 🌟 倒序排序
            groupTasks.sort((a, b) => b.index - a.index);

            try {
                // 加载字体
                await loadTextFonts(node);

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
        sendToUI({
            type: 'text-replace-success',
            count: successCount,
            processedUids: Array.from(processedIds)
        });

        mg.notify(`已替换 ${successCount} 处文本`);
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
                const node = await mg.getNodeById(nodeId);
                if (node && node.type === 'TEXT') {
                     await loadTextFonts(node);
                     node.setRangeFills(index, index + data.length, data.fills);
                     count++;
                }
            } catch(e) { console.log("还原失败", e) }
        }
        highlightCache = {}; // 清空池子
        mg.notify(`已还原 ${count} 处高亮`);
        // 通知前端清除所有高亮样式
        sendToUI({ type: 'clear-all-highlights-ui' });
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
            const node = await mg.getNodeById(id);
            if (node && node.type === 'TEXT') {
                try {
                    // 加载字体 (必要步骤)
                    await loadTextFonts(node);

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
        mg.notify(`已替换 ${count} 个文本图层`);
        break;
    }

    // ===========================
    // === 锚点工具 (Jumpback) ===
    // ===========================

    case 'jb-init': {
      // 初始化读取
      const spots = await loadJumpbackSpots();
      sendToUI({ type: 'jb-render-spots', data: spots });
      break;
    }

    case 'jb-save': {
      const spots = await loadJumpbackSpots();

      if (spots.length >= 5) {
        mg.notify("最多只能保存 5 个锚点！");
        return;
      }

      // 获取案发现场数据
      const currentSelection = mg.document.currentPage.selection;
      // 默认名字：如果选中了图层就用图层名，否则叫 Spot
      const defaultName = currentSelection.length > 0 ? currentSelection[0].name.substring(0, 15) : `Spot ${spots.length + 1}`;

      const newSpot = {
        id: 'spot_' + Date.now(),
        name: defaultName,
        pageId: mg.document.currentPage.id,
        pageName: mg.document.currentPage.name,
        zoom: mg.viewport.zoom,
        centerX: mg.viewport.center.x,
        centerY: mg.viewport.center.y,
        // 保存选中的图层 ID 数组
        selectionIds: currentSelection.map(n => n.id)
      };

      spots.push(newSpot);
      await saveJumpbackSpots(spots);

      mg.notify("📍 位置已保存");
      sendToUI({ type: 'jb-render-spots', data: spots });
      break;
    }

    case 'jb-jump': {
      const spots = await loadJumpbackSpots();
      if (spots.length === 0) return;
      const spot = spots.find((s: any) => s.id === msg.id);

      if (!spot) return;

      try {
        // 1. 跨页面跳转 (如果所在的 Page 不一样)
        if (mg.document.currentPage.id !== spot.pageId) {
          // === 修复点 1：使用 getNodeById 异步获取节点 ===
          const targetPage = mg.document.children.find(page => page.id === spot.pageId);
          if (targetPage) {
            mg.document.currentPage = targetPage;
          } else {
            mg.notify("⚠️ 该位置所在的页面已被删除！");
            return;
          }
        }

        // 2. 恢复视角坐标和缩放
        mg.viewport.center = { x: spot.centerX, y: spot.centerY };
        mg.viewport.zoom = spot.zoom;

        // 3. 尝试恢复离开前选中的图层
        const nodesToSelect: SceneNode[] = [];
        if (spot.selectionIds && Array.isArray(spot.selectionIds)) {
           // 使用 for...of 配合 await 依次获取节点
           for (const id of spot.selectionIds) {
             // === 修复点 3：同样使用 getNodeById 获取历史图层 ===
             const node = mg.getNodeById(id);

             // 确保节点还存在，且不是页面本身 (防止意外)
             if (node && !node.removed) {
                nodesToSelect.push(node);
             }
           }
        }

        // 4. 执行选中
        if (nodesToSelect.length > 0) {
           mg.document.currentPage.selection = nodesToSelect;
        } else {
           // 如果图层被删了，清空当前选中项，视角依然过去 (补全了这里)
           mg.document.currentPage.selection = [];
        }

        mg.notify("🚀 已传送！");
      } catch (e) {
        console.warn("Jumpback failed:", e);
        mg.notify("传送失败，可能是图层结构已发生巨大改变");
      }
      break;
    }

    case 'jb-delete': {
      let spots = await loadJumpbackSpots();
      if (spots.length === 0) return;

      // 过滤掉要删除的 ID
      spots = spots.filter((s: any) => s.id !== msg.id);

      // 更新保存
      await saveJumpbackSpots(spots);

      // 重新渲染 UI
      sendToUI({ type: 'jb-render-spots', data: spots });
      mg.notify("🗑️ 锚点已删除");
      break;
    }

    case 'jb-rename': {
      const spots = await loadJumpbackSpots();
      if (spots.length === 0) return;

      const index = spots.findIndex((s: any) => s.id === msg.id);
      if (index > -1 && msg.newName.trim() !== '') {
        spots[index].name = msg.newName.substring(0, 20); // 限制长度
        await saveJumpbackSpots(spots);
        mg.notify("已重命名");
      } else {
         // 如果名字为空，发回原数据恢复 UI
         sendToUI({ type: 'jb-render-spots', data: spots });
      }
      break;
    }

    // ==========================================
    // === 引擎：等轴形变 (Transform & Skew) ===
    // ==========================================

    case 'skew-apply': {
      const selection = mg.document.currentPage.selection;
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

            (node as any).relativeTransform = newTransform;
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
        // 读取缓存在用户 MasterGo 客户端下的数据
        const data = await mg.clientStorage.getAsync('MY_SKEW_PRESETS');
        // 发送回前端渲染
        sendToUI({ type: 'init-skew-presets', data: data || [] });
      } catch (e) {
        console.warn("读取 Skew 预设失败", e);
      }
      break;
    }

    // 2. UI 请求保存新的预设
    case 'save-skew-presets': {
      try {
        // 覆盖保存到用户 MasterGo 客户端下
        await mg.clientStorage.setAsync('MY_SKEW_PRESETS', msg.data);
      } catch (e) {
        console.warn("保存 Skew 预设失败", e);
      }
      break;
    }

    // ==================== 语言切换 (i18n) 逻辑 ====================
    case 'i18n-check-selection': {
        const hasSelection = mg.document.currentPage.selection.length > 0;
        sendToUI({ type: 'i18n-check-selection-result', hasSelection: hasSelection });
        break;
    }

    case 'i18n-detect': {
        const { scope, extractTarget, collectionName } = msg;
        let nodesToScan = scope === 'selection' ? [...mg.document.currentPage.selection] : [...mg.document.currentPage.children];

        const textNodes = [];
        async function findText(nodes) {
            for (const node of nodes) {
                if (node.type === 'TEXT') textNodes.push(node);
                else if ('children' in node) await findText(node.children);
            }
        }
        await findText(nodesToScan);

        const allCollections = mg.variables.getCollections();
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
            const collectionModes = mg.variables.getModes(i18nCollection.id);
            const origModeId = collectionModes.find(mode => mode.name === 'Original')?.id || collectionModes[0]?.id;
            collectionModes.forEach(m => {
                if (m.id !== origModeId) modes.push(m.name);
            });
            const localVars = mg.variables.getVariables({ collectionId: i18nCollection.id, type: 'STRING' });
            for (const v of localVars) {
                if (v.collectionId === i18nCollection.id && origModeId) {
                    const origVal = getSimpleVariableValue(v, origModeId);
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
            if (!getTextFontName(node) && node.characters.length > 0) { mixedFonts++; continue; }

            const hasContentBinding = Boolean(
              getNodeI18nBinding(node) || node.componentPropertyReferences?.characters
            );
            if (extractTarget === 'unbound' && hasContentBinding) {
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

        sendToUI({
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
            let collections = mg.variables.getCollections();
            let collection = collections.find(c => c.name === collectionName);

            // 1. 确保 Collection 存在
            if (!collection) {
                collection = await mg.variables.createCollection(collectionName);
                if (!collection) throw new Error(`无法创建变量合集“${collectionName}”`);
                const initialMode = mg.variables.getModes(collection.id)[0];
                if (initialMode) mg.variables.renameMode(collection.id, initialMode.id, 'Original');
            }

            const collectionModes = mg.variables.getModes(collection.id);
            const origModeId = collectionModes.find(mode => mode.name === 'Original')?.id || collectionModes[0]?.id;
            if (!origModeId) throw new Error('变量合集中没有可用的 Mode');

            // 2. 收集所有需要处理的语种
            const allTargetLangs = new Set<string>();
            newPayload.forEach(item => Object.keys(item.translations).forEach(l => allTargetLangs.add(l)));

            // 3. 核心修复：创建/获取 Mode ID 映射
            const modeIdMap: { [key: string]: string } = {};
            collectionModes.forEach(m => modeIdMap[m.name] = m.id);

            for (const lang of Array.from(allTargetLangs)) {
                if (!modeIdMap[lang]) {
                    try {
                        const newMode = await mg.variables.addMode(collection.id, lang);
                        if (!newMode) throw new Error('创建 Mode 失败');
                        modeIdMap[lang] = newMode.id;
                    } catch (e) {
                        sendToUI({
                            type: 'i18n-bind-error',
                            error: `无法创建“${lang}”Mode。请检查当前 MasterGo 文件权限或团队套餐限制；也可以使用“⚡ 直接替换”模式。`
                        });
                        return;
                    }
                }
            }

            // 4. 建立变量索引 (Original Text -> Variable)
            const localVars = mg.variables.getVariables({ collectionId: collection.id, type: 'STRING' });
            const varMap = new Map<string, Variable>();
            for (const v of localVars) {
                if (v.collectionId === collection.id) {
                    const baseVal = getSimpleVariableValue(v, origModeId);
                    if (baseVal) varMap.set(baseVal, v);
                }
            }

            // 扫描阶段已匹配到的变量无需重建，但仍需把画布节点补绑定。
            for (const item of autoBindPayload || []) {
                const variable = mg.variables.getVariableById(item.variableId);
                if (!variable) continue;
                for (const nodeId of item.nodeIds || []) {
                    const node = mg.getNodeById(nodeId);
                    if (node?.type === 'TEXT' && !node.hasMissingFont) {
                        await bindI18nVariableToText(node, variable);
                    }
                }
            }

            // 5. 遍历翻译数据，写入变量并执行绑定
            for (const item of newPayload) {
                let variable = varMap.get(item.original);

                // 如果不存在则创建
                if (!variable) {
                    let safeName = item.original.slice(0, 15).replace(/[.*{}\/\\\r\n\t]/g, '_').trim() || 'text';
                    const varName = `i18n/${safeName}_${Math.random().toString(36).substring(2,6)}`;
                    variable = await mg.variables.createVariable({
                      name: varName,
                      type: 'STRING',
                      value: item.original,
                      collectionId: collection.id
                    });
                    if (!variable) throw new Error(`无法为“${item.original}”创建变量`);
                    mg.variables.setVariableValue({ id: variable.id, modeId: origModeId, value: item.original });
                    varMap.set(item.original, variable);
                }

                // 【核心修复】：为该变量在所有目标 Mode 中设置翻译值
                for (const [langName, translatedText] of Object.entries(item.translations)) {
                    const targetModeId = modeIdMap[langName];
                    if (targetModeId) {
                        mg.variables.setVariableValue({
                          id: variable.id,
                          modeId: targetModeId,
                          value: translatedText as string
                        });
                    }
                }

                // 执行画布节点的变量绑定
                for (const nodeId of item.nodeIds) {
                    const node = mg.getNodeById(nodeId);
                    if (node && node.type === 'TEXT' && !node.hasMissingFont) {
                        await bindI18nVariableToText(node, variable);
                    }
                }
            }

            await syncMasterGoI18nFallbackBindings();
            sendToUI({ type: 'i18n-bind-success', message: '🎉 MasterGo 多语言 Mode 已同步更新！' });

        } catch (e) {
            sendToUI({ type: 'i18n-bind-error', error: e instanceof Error ? e.message : String(e) });
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
                        const node = mg.getNodeById(nodeId);
                        if (node && node.type === 'TEXT' && !node.hasMissingFont) {
                            await loadTextFonts(node);
                            await unlinkI18nVariableFromText(node);
                            node.characters = String(targetText ?? '');
                            successCount++;
                        }
                    } catch (e) {
                        console.warn(`节点替换失败`, e);
                    }
                }
            }

            sendToUI({ type: 'i18n-bind-success', message: `🎉 成功替换了 ${successCount} 个文本节点！` });

        } catch (e) {
            sendToUI({ type: 'i18n-bind-error', error: e instanceof Error ? e.message : String(e) });
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
      mg.ui.resize(newW, newH);
      break;
    }
    case 'resize-end':
      // 结束拖拽
      break;
    case 'resize-drag':
    case 'resize-window':
      mg.ui.resize(msg.width, msg.height);
      break;

    // ===========================
    // I. Component Builder - 组件构建器
    // ===========================
    case 'component-builder-inspect': {
      sendComponentBuilderSelection();
      break;
    }

    case 'component-ai-inspect': {
      try {
        sendToUI({ type: 'component-ai-context', context: buildComponentAiContext(msg.language || 'zh') });
      } catch (error) {
        sendToUI({ type: 'component-ai-error', message: String((error as any)?.message || error) });
      }
      break;
    }

    case 'component-ai-apply': {
      try {
        const result = applyComponentAiPlan(msg.plan);
        mg.commitUndo();
        const message = `已应用 ${result.changed} 项组件规范优化${result.warnings.length ? `；${result.warnings.length} 项未能修改` : ''}`;
        mg.notify(message, { type: result.warnings.length ? 'warning' : 'success' });
        sendToUI({ type: 'component-ai-applied', ok: true, message, warnings: result.warnings });
        sendComponentBuilderSelection();
      } catch (error) {
        const message = `应用失败：${String((error as any)?.message || error)}`;
        mg.notify(message, { type: 'error' });
        sendToUI({ type: 'component-ai-applied', ok: false, message });
      }
      break;
    }

    case 'component-builder-reverse': {
      if (selection.length !== 1 || selection[0].type !== 'INSTANCE') {
        const message = '请只选择一个实例（Instance）后再逆向母版';
        mg.notify(message, { type: 'warning' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
        break;
      }

      if (componentReverseRunning) {
        const message = '实例逆向正在处理中，请等待当前操作完成';
        mg.notify(message, { type: 'warning' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
        break;
      }

      componentReverseRunning = true;
      let result: Awaited<ReturnType<typeof reverseInstanceToMaster>> | null = null;
      try {
        result = await reverseInstanceToMaster(selection[0] as InstanceNode);
      } catch (error) {
        const message = `逆向失败：${describeReverseFailure(error)}`;
        mg.notify(message, { type: 'error' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
      } finally {
        componentReverseRunning = false;
      }
      if (!result) break;

      // 生成已完成后，选中、视口定位或撤销栈提交即使被宿主坏引用打断，也不能误报为逆向失败。
      try { mg.commitUndo(); } catch (error) {
        result.warnings.push(`撤销记录提交失败：${String((error as any)?.message || error)}`);
      }
      try { mg.document.currentPage.selection = [result.target]; } catch (error) {
        result.warnings.push(`新母版已创建，但自动选中失败：${String((error as any)?.message || error)}`);
      }
      try { mg.viewport.scrollAndZoomIntoView([result.target]); } catch (error) {
        result.warnings.push(`新母版已创建，但自动定位失败：${String((error as any)?.message || error)}`);
      }

      result.warnings = [...new Set(result.warnings)];
      const warningText = result.warnings.length > 0
        ? `；${result.warnings.length} 项内容已安全降级或跳过`
        : '';
      const modeText = result.recoveryMode === 'raster' ? '（视觉快照兜底）' : '';
      const variantText = result.variantCount > 1
        ? `，完整还原 ${result.variantCount} 个真实变体`
        : '';
      const overflowText = result.overflowVariantCount > 0
        ? `，原组件集${result.overflowVariantCountIsMinimum ? '至少 ' : ' '}${result.overflowVariantCount} 个变体超过上限 ${MAX_REVERSED_VARIANTS}，已保留为单变体组件集及原属性`
        : variantText;
      const message = `已逆向组件母版${modeText}${overflowText}，并保留 ${result.propertyCount} 个有效属性${warningText}`;
      mg.notify(message, { type: result.warnings.length > 0 ? 'warning' : 'success' });
      sendToUI({
        type: 'component-builder-result',
        ok: true,
        message,
        warnings: result.warnings,
        recoveryMode: result.recoveryMode,
        variantCount: result.variantCount,
        overflowVariantCount: result.overflowVariantCount,
        created: 1
      });
      break;
    }

    case 'component-builder-create': {
      const frames = selection.filter(node => node.type === 'FRAME') as FrameNode[];
      if (selection.length === 0 || frames.length !== selection.length) {
        const message = '请选择一个或多个 Frame；当前选择中不能混入其他图层类型';
        mg.notify(message, { type: 'warning' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
        break;
      }

      const connectorFrames = frames.filter(frame => frame.attachedConnectors.length > 0);
      if (connectorFrames.length > 0) {
        const message = `有 ${connectorFrames.length} 个 Frame 连接了原型连线；为避免连接目标丢失，本次未转换`;
        mg.notify(message, { type: 'warning' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
        break;
      }

      const mode = ['single', 'multiple', 'set'].includes(msg.mode) ? msg.mode : 'multiple';
      const exposeText = msg.exposeText === true;
      const exposeInstances = msg.exposeInstances === true;
      const requestedName = String(msg.componentName || '').trim();
      const originalNames = frames.map(frame => frame.name);
      const createdComponents: ComponentNode[] = [];
      const warnings: string[] = [];

      if ((mode === 'single' && frames.length > 1) || mode === 'set') {
        const sameParent = frames.every(frame => frame.parent === frames[0].parent);
        if (!sameParent) {
          const message = mode === 'set'
            ? '创建组件集时，所选 Frame 必须位于同一父级'
            : '合并为单个组件时，所选 Frame 必须位于同一父级';
          mg.notify(message, { type: 'warning' });
          sendToUI({ type: 'component-builder-result', ok: false, message });
          break;
        }
      }

      try {
        let targets: SceneNode[] = [];

        if (mode === 'single') {
          const component = frames.length === 1
            ? transferFrameToComponent(frames[0], requestedName || frames[0].name, warnings)
            : wrapFramesAsOneComponent(frames, requestedName || commonNamePrefix(originalNames));
          createdComponents.push(component);
          const exposed = exposeBuilderProperties(component, exposeText, exposeInstances);
          warnings.push(...exposed.warnings);
          targets = [component];
        } else {
          for (let index = 0; index < frames.length; index++) {
            const frame = frames[index];
            const component = transferFrameToComponent(frame, frame.name, warnings);
            createdComponents.push(component);
            if (mode !== 'set') {
              const exposed = exposeBuilderProperties(component, exposeText, exposeInstances);
              warnings.push(...exposed.warnings);
            }
          }

          if (mode === 'set') {
            const variantProperty = String(msg.variantProperty || 'Variant')
              .replace(/[,=]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim() || 'Variant';
            const usedVariantValues = new Set<string>();
            createdComponents.forEach((component, index) => {
              const baseValue = safeVariantValue(originalNames[index], index);
              let value = baseValue;
              let suffix = 2;
              while (usedVariantValues.has(value.toLocaleLowerCase())) value = `${baseValue} ${suffix++}`;
              usedVariantValues.add(value.toLocaleLowerCase());
              component.name = `${variantProperty}=${value}`;
            });
            const set = mg.combineAsVariants(createdComponents);
            set.name = requestedName || commonNamePrefix(originalNames);
            const exposed = exposeBuilderPropertiesForSet(set, exposeText, exposeInstances);
            warnings.push(...exposed.warnings);
            targets = [set];
          } else {
            if (requestedName) {
              createdComponents.forEach((component, index) => {
                component.name = createdComponents.length === 1
                  ? requestedName
                  : `${requestedName}/${originalNames[index]}`;
              });
            }
            targets = createdComponents;
          }
        }

        mg.document.currentPage.selection = targets;
        mg.viewport.scrollAndZoomIntoView(targets);
        mg.commitUndo();
        const typeLabel = mode === 'set' ? '组件集' : (mode === 'single' ? '单个组件' : '多个组件');
        const exposedLabel = [
          exposeText ? '文字属性' : '',
          exposeInstances ? '实例属性' : ''
        ].filter(Boolean).join('、');
        const message = `已创建${typeLabel}${exposedLabel ? `，并生成${exposedLabel}` : ''}${warnings.length ? `；${warnings.length} 项已跳过` : ''}`;
        mg.notify(message, { type: warnings.length > 0 ? 'warning' : 'success' });
        sendToUI({
          type: 'component-builder-result',
          ok: true,
          message,
          warnings,
          created: targets.length
        });
      } catch (error) {
        const message = `创建失败：${String((error as any)?.message || error)}`;
        mg.notify(message, { type: 'error' });
        sendToUI({ type: 'component-builder-result', ok: false, message });
      }
      break;
    }

    // ===========================
    // J. CompKit - 变体矩阵工具
    // ===========================

    // 初始化：获取组件集属性列表
    case 'init-compkit': {
      const selection = mg.document.currentPage.selection;
      let properties: string[] = [];
      let targetId: string | null = null;
      let componentName = '';
      let propertyValues: { [key: string]: string[] } = {};
      let variantsCount = 0;
      let totalSets = 0;

      // 过滤出所有选中的组件集（支持直接从画板中提取）
      const selectedSets: ComponentSetNode[] = [];
      for (const node of selection) {
        if (node.type === 'COMPONENT_SET') {
          selectedSets.push(node);
        } else if (node.type === 'FRAME' && node.getPluginData('isShowcaseBoard') === 'true') {
          const innerSet = node.findOne(n => n.type === 'COMPONENT_SET') as ComponentSetNode | null;
          if (innerSet) selectedSets.push(innerSet);
        }
      }

      if (selectedSets.length > 0) {
        totalSets = selectedSets.length;

        if (selectedSets.length === 1) {
          // 单选：完整解析，收集所有属性及其值（供"生成说明书"使用）
          const targetNode = selectedSets[0];
          if (targetNode.children.length > 0) {
            componentName = targetNode.name;
            variantsCount = targetNode.children.length;
            targetId = targetNode.id;

            const sampleName = targetNode.children[0].name;
            properties = sampleName.split(',').map(p => p.split('=')[0].trim());

            const variants = targetNode.children as ComponentNode[];
            properties.forEach(prop => {
              const values = new Set<string>();
              variants.forEach(v => {
                const props = v.name.split(',').reduce((acc, pair) => {
                  const [key, val] = pair.split('=').map(s => s.trim());
                  acc[key] = val;
                  return acc;
                }, {} as { [key: string]: string });
                if (props[prop]) values.add(props[prop]);
              });
              propertyValues[prop] = Array.from(values);
            });
          }
        } else {
          // 多选：取所有组件集的公共（交集）属性（供"批量排布"使用）
          const firstSample = selectedSets[0].children[0]?.name || '';
          let common = firstSample.split(',').map(p => p.split('=')[0].trim());

          for (let i = 1; i < selectedSets.length; i++) {
            const sample = selectedSets[i].children[0]?.name || '';
            const props = sample.split(',').map(p => p.split('=')[0].trim());
            common = common.filter(p => props.includes(p));
          }
          properties = common;
        }
      }

      sendToUI({
        type: 'compkit-props',
        properties,
        targetId,
        componentName,
        propertyValues,
        variantsCount,
        totalSets
      });
      break;
    }

    // 矩阵排列（简化版）- 支持单属性（1D）和多属性（2D）
    case 'run-compkit': {
      const { gapX, gapY, padding } = msg;
      const selection = mg.document.currentPage.selection;

      // 1. 检查是否只选中了一个节点，且必须是 Component Set
      if (selection.length !== 1 || selection[0].type !== 'COMPONENT_SET') {
        mg.notify("请选中一个 Component Set (组件集)！", { type: 'error' });
        break;
      }

      const componentSet = selection[0] as ComponentSetNode;
      const variants = componentSet.children as ComponentNode[];
      if (variants.length === 0) {
        mg.notify("组件集为空", { type: 'error' });
        break;
      }

      // 2. 解析变体属性
      const sampleName = variants[0].name;
      const properties = sampleName.split(',').map(p => p.split('=')[0].trim());

      const propX = properties[0];
      const hasY = properties.length >= 2; // 有第二个属性才做二维矩阵
      const propY = hasY ? properties[1] : '';

      // 分组属性：除 X/Y 轴外的其他属性
      const groupProps = hasY ? properties.filter(p => p !== propX && p !== propY) : properties.filter(p => p !== propX);

      // 3. 收集所有的属性值
      const xValues = new Set<string>();
      const yValues = new Set<string>();
      const groupValues = new Set<string>();

      variants.forEach(v => {
        const props = parseVariantName(v.name);
        if (props[propX]) xValues.add(props[propX]);
        if (hasY && props[propY]) yValues.add(props[propY]);
        else if (!hasY) yValues.add('default'); // 1D 时伪造一个 Y 值
        const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ');
        groupValues.add(gSign || 'Default');
      });

      const xArray = Array.from(xValues);
      const yArray = hasY ? Array.from(yValues) : ['default'];
      const groups = Array.from(groupValues);

      // 4. 计算最大宽高
      let maxWidth = 0; let maxHeight = 0;
      variants.forEach(v => { if (v.width > maxWidth) maxWidth = v.width; if (v.height > maxHeight) maxHeight = v.height; });

      // 5. 设定间距和单元格尺寸
      const cellWidth = maxWidth + gapX;
      const cellHeight = hasY ? maxHeight + gapY : 0;
      const singleGroupHeight = hasY
        ? yArray.length * maxHeight + Math.max(0, yArray.length - 1) * gapY
        : maxHeight;

      // 6. 关闭 Component Set 的自动布局
      componentSet.flexMode = "NONE";

      // 7. 开始重排绝对坐标
      variants.forEach(v => {
        const props = parseVariantName(v.name);
        const xVal = props[propX];
        const colIndex = xArray.indexOf(xVal);
        const rowIndex = hasY ? yArray.indexOf(props[propY]) : 0;
        const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ') || 'Default';
        const groupIndex = groups.indexOf(gSign);

        if (colIndex !== -1 && rowIndex !== -1 && groupIndex !== -1) {
          const groupOffsetY = groupIndex * (singleGroupHeight + (hasY ? gapY : 0));
          v.x = padding + colIndex * cellWidth + (maxWidth - v.width) / 2;
          v.y = hasY
            ? padding + groupOffsetY + rowIndex * cellHeight + (maxHeight - v.height) / 2
            : padding + (maxHeight - v.height) / 2; // 1D 垂直居中
        }
      });

      // 8. 重置 Component Set 的总宽高
      const totalWidth = padding * 2 + xArray.length * maxWidth + Math.max(0, xArray.length - 1) * gapX;
      const totalHeight = hasY
        ? padding * 2 + groups.length * singleGroupHeight + Math.max(0, groups.length - 1) * gapY
        : padding * 2 + maxHeight;
      componentSet.resize(totalWidth, totalHeight);

      let resultMsg = hasY
        ? `✨ 矩阵重排完成！${xArray.length} x ${yArray.length}${groups.length > 1 ? `，共 ${groups.length} 个分组` : ''}`
        : `✨ 单维度排列完成！${xArray.length} 个变体水平排列`;
      mg.notify(resultMsg);
      break;
    }

    // 批量排布：多个组件集统一排列
    case 'generate-batch-showcase': {
      const gapX = msg.gapX !== undefined ? msg.gapX : 16;
      const gapY = msg.gapY !== undefined ? msg.gapY : 16;
      const padding = msg.padding !== undefined ? msg.padding : 20;
      const setSpacing = msg.setSpacing !== undefined ? msg.setSpacing : 32;
      const drawLabels = msg.drawLabels !== false;
      const drawGrid = msg.drawGrid !== false;
      const orientation = msg.orientation === 'portrait' ? 'portrait' : 'landscape';
      const theme = msg.theme === 'dark' ? 'dark' : 'light';
      const darkTheme = theme === 'dark';
      const boardFill = darkTheme ? { r: 17/255, g: 24/255, b: 39/255 } : { r: 249/255, g: 250/255, b: 251/255 };
      const titleFill = darkTheme ? { r: 243/255, g: 244/255, b: 246/255 } : { r: 17/255, g: 24/255, b: 39/255 };

      const selection = mg.document.currentPage.selection;
      // 从选中项中提取组件集（支持直接选中 ComponentSet 或已生成的说明书画板）
      const compSets: ComponentSetNode[] = [];
      for (const n of selection) {
        if (n.type === 'COMPONENT_SET') {
          compSets.push(n);
        } else if (n.type === 'FRAME' && (n as FrameNode).getPluginData('isShowcaseBoard') === 'true') {
          const innerSet = (n as FrameNode).findOne(child => child.type === 'COMPONENT_SET') as ComponentSetNode | null;
          if (innerSet) compSets.push(innerSet);
        }
      }
      if (compSets.length === 0) {
        mg.notify("请选中至少一个 Component Set！", { type: 'error' });
        break;
      }

      await mg.loadFontAsync({ family: "Inter", style: "Regular" });
      await mg.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      await mg.loadFontAsync({ family: "Inter", style: "Bold" });

      // 收集所有组件集的中心位置
      let centerX = 0, centerY = 0;
      compSets.forEach(cs => { centerX += cs.x + cs.width / 2; centerY += cs.y + cs.height / 2; });
      centerX /= compSets.length;
      centerY /= compSets.length;

      // 外层容器 Frame
      const container = mg.createFrame();
      container.name = "🧩 Component Specs Catalog";
      container.setPluginData('isShowcaseBoard', 'true');
      container.flexMode = orientation === 'portrait' ? "VERTICAL" : "HORIZONTAL";
      container.mainAxisSizingMode = "AUTO";
      container.crossAxisSizingMode = "AUTO";
      container.itemSpacing = setSpacing;
      container.paddingLeft = 32; container.paddingRight = 32;
      container.paddingTop = 32; container.paddingBottom = 32;
      container.fills = [solidPaint(boardFill)];

      let maxSetWidth = 0;
      const directPlacements: ComponentSetNode[] = [];

      // 处理每个组件集
      for (const componentSet of compSets) {
        const variants = componentSet.children as ComponentNode[];
        if (variants.length === 0) continue;

        // 解耦组件集并自动销毁旧大画板，防止画布残留垃圾图层
        const origX = componentSet.x;
        const origY = componentSet.y;
        let ancestor: BaseNode | null = componentSet.parent;
        let oldBoard: FrameNode | null = null;
        while (ancestor && ancestor.type !== 'DOCUMENT' && ancestor.type !== 'PAGE') {
          if (ancestor.type === 'FRAME' && (ancestor as FrameNode).getPluginData('isShowcaseBoard') === 'true') {
            oldBoard = ancestor as FrameNode;
            break;
          }
          ancestor = ancestor.parent;
        }
        mg.document.currentPage.appendChild(componentSet);
        if (oldBoard) oldBoard.remove();

        // 自动推断属性：第一个属性→X轴，第二个属性（不同）→Y轴
        const sampleName = variants[0].name;
        const properties = sampleName.split(',').map(p => p.split('=')[0].trim());
        const localPropX = properties[0] || '';
        const localPropY = properties.length >= 2 && properties[1] !== localPropX ? properties[1] : '';
        const localHasY = !!localPropY;
        const groupProps = localHasY ? properties.filter(p => p !== localPropX && p !== localPropY) : properties.filter(p => p !== localPropX);

        // 收集属性值
        const xValues = new Set<string>();
        const yValues = new Set<string>();
        const groupValues = new Set<string>();

        variants.forEach(v => {
          const props = parseVariantName(v.name);
          if (props[localPropX]) xValues.add(props[localPropX]);
          if (localHasY && props[localPropY]) yValues.add(props[localPropY]);
          else if (!localHasY) yValues.add('default');
          const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ');
          groupValues.add(gSign || 'Default');
        });

        const xArray = Array.from(xValues);
        const yArray = localHasY ? Array.from(yValues) : ['default'];
        const groups = Array.from(groupValues);

        // 最大尺寸
        let maxW = 0, maxH = 0;
        variants.forEach(v => { if (v.width > maxW) maxW = v.width; if (v.height > maxH) maxH = v.height; });

        const cellW = maxW + gapX;
        const cellH = localHasY ? maxH + gapY : 0;
        const groupH = localHasY
          ? yArray.length * maxH + Math.max(0, yArray.length - 1) * gapY
          : maxH;

        // 排列变体
        componentSet.flexMode = "NONE";
        variants.forEach(v => {
          const props = parseVariantName(v.name);
          const colIndex = xArray.indexOf(props[localPropX]);
          const rowIndex = localHasY ? yArray.indexOf(props[localPropY]) : 0;
          const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ') || 'Default';
          const groupIndex = groups.indexOf(gSign);

          if (colIndex !== -1 && rowIndex !== -1 && groupIndex !== -1) {
            const offY = groupIndex * (groupH + (localHasY ? gapY : 0));
            v.x = padding + colIndex * cellW + (maxW - v.width) / 2;
            v.y = localHasY ? padding + offY + rowIndex * cellH + (maxH - v.height) / 2 : padding + (maxH - v.height) / 2;
          }
        });

        const csWidth = padding * 2 + xArray.length * maxW + Math.max(0, xArray.length - 1) * gapX;
        const csHeight = localHasY ? padding * 2 + groups.length * groupH + Math.max(0, groups.length - 1) * gapY : padding * 2 + maxH;
        componentSet.resize(csWidth, csHeight);

        if (csWidth > maxSetWidth) maxSetWidth = csWidth;

        // 每组创建一个包装容器：标题 + 组件集
        const setGroup = mg.createFrame();
        setGroup.name = componentSet.name;
        setGroup.flexMode = "VERTICAL";
        setGroup.mainAxisSizingMode = "AUTO";
        setGroup.crossAxisSizingMode = "AUTO";
        setGroup.itemSpacing = 12;
        setGroup.fills = [];

        // 组件集标题
        const titleText = mg.createText();
        titleText.characters = componentSet.name;
        setTextFontSize(titleText, 20); setTextFontName(titleText, { family: "Inter", style: "Bold" });
        titleText.fills = [solidPaint(titleFill)];
        setGroup.appendChild(titleText);

        // 内部包装块（组件集 + 标签/网格）
        const innerBlock = mg.createFrame();
        innerBlock.name = `${componentSet.name} Block`;
        innerBlock.flexMode = "NONE";
        innerBlock.fills = [];
        setGroup.appendChild(innerBlock);

        innerBlock.appendChild(componentSet);
        const labelOffset = (localHasY && drawLabels) ? 100 : 0;
        componentSet.x = labelOffset;
        componentSet.y = drawLabels ? 40 : 0;

        // 计算内部区域大小
        const areaW = csWidth + labelOffset;
        const areaH = csHeight + (drawLabels ? 60 : 0);
        innerBlock.resize(areaW, areaH);

        // 轴标签和网格线
        const decorationNodes: SceneNode[] = [];

        if (drawLabels) {
          // X 轴标签
          xArray.forEach((xVal, index) => {
            const label = mg.createText();
            label.characters = `${localPropX}: ${xVal}`.toUpperCase();
            setTextFontSize(label, 12); setTextFontName(label, { family: "Inter", style: "Semi Bold" });
            label.fills = [solidPaint({ r: 107/255, g: 114/255, b: 128/255 })];
            label.x = componentSet.x + padding + index * cellW + maxW / 2 - label.width / 2;
            label.y = componentSet.y - 32;
            innerBlock.appendChild(label); decorationNodes.push(label);
          });
        }

        groups.forEach((gSign, gIndex) => {
          const gAbsY = componentSet.y + padding + gIndex * (groupH + (localHasY ? gapY : 0));

          // Y 轴标签（仅二维）
          if (localHasY && drawLabels) {
            yArray.forEach((yVal, rowIndex) => {
              const label = mg.createText();
              label.characters = `${localPropY}: ${yVal}`.toUpperCase();
              setTextFontSize(label, 12); setTextFontName(label, { family: "Inter", style: "Semi Bold" });
              label.fills = [solidPaint({ r: 156/255, g: 163/255, b: 175/255 })];
              label.x = componentSet.x - label.width - 16;
              label.y = gAbsY + rowIndex * cellH + maxH / 2 - label.height / 2;
              innerBlock.appendChild(label); decorationNodes.push(label);
            });
          }

          // 网格线
          if (drawGrid) {
            if (localHasY) {
              for (let r = 1; r < yArray.length; r++) {
                const line = mg.createLine(); line.resize(xArray.length * cellW, 0);
                line.x = componentSet.x + padding; line.y = gAbsY + r * cellH - gapY / 2;
                line.strokeDashes = [4, 4]; line.strokeWeight = 1;
                line.strokes = [solidPaint({ r: 0.9, g: 0.92, b: 0.94 })];
                innerBlock.appendChild(line); decorationNodes.push(line);
              }
            }
            for (let c = 1; c < xArray.length; c++) {
              const lineH = localHasY ? groupH : csHeight - padding * 2;
              const line = mg.createLine(); line.resize(lineH, 0); line.rotation = -90;
              line.x = componentSet.x + padding + c * cellW - gapX / 2; line.y = gAbsY + (localHasY ? 0 : padding);
              line.strokeDashes = [4, 4]; line.strokeWeight = 1;
              line.strokes = [solidPaint({ r: 0.9, g: 0.92, b: 0.94 })];
              innerBlock.appendChild(line); decorationNodes.push(line);
            }
          }
        });

        if (decorationNodes.length > 0) {
          groupInParent(decorationNodes, innerBlock).name = `${componentSet.name} Decorations`;
        }

        // 恢复原始位置（放在容器中）
        componentSet.x = labelOffset;
        componentSet.y = drawLabels ? 40 : 0;

        container.appendChild(setGroup);
        directPlacements.push(componentSet);
      }

      // 容器定位
      container.x = centerX - 200;
      container.y = centerY - 200;

      // 组件集保持为最外层说明书画板的直接子项，避免库引用路径层层嵌套。
      const containerBounds = container.absoluteBoundingBox;
      if (containerBounds) {
        directPlacements.map(componentSet => ({ componentSet, bounds: componentSet.absoluteBoundingBox })).forEach(({ componentSet, bounds }) => {
          if (!bounds || componentSet.removed) return;
          container.appendChild(componentSet);
          trySet(componentSet, 'layoutPositioning', 'ABSOLUTE');
          componentSet.x = bounds.x - containerBounds.x;
          componentSet.y = bounds.y - containerBounds.y;
        });
      }

      mg.document.currentPage.selection = [container];
      mg.viewport.scrollAndZoomIntoView([container]);

      mg.notify(`✅ 批量排布完成！共 ${compSets.length} 个组件集`);
      break;
    }

    // 生成说明书（完整版）
    case 'generate-showcase': {
      const propX = msg.propX;
      const propY = msg.propY || ''; // propY 可以为空（单属性组件集）
      const padding = msg.padding !== undefined ? msg.padding : 20;
      const gapX = msg.gapX !== undefined ? msg.gapX : 16;
      const gapY = msg.gapY !== undefined ? msg.gapY : 16;
      const groupGap = msg.groupGap !== undefined ? msg.groupGap : 32;
      const compRadius = msg.compRadius !== undefined ? msg.compRadius : 0;
      const compStroke = msg.compStroke !== undefined ? msg.compStroke : 1;
      const compStrokeColor = msg.compStrokeColor || { r: 140/255, g: 91/255, b: 212/255 };
      const gridLineWidth = msg.gridLineWidth !== undefined ? msg.gridLineWidth : 1;
      const gridLineColor = msg.gridLineColor || { r: 0.9, g: 0.92, b: 0.94 };
      const boardRadius = msg.boardRadius !== undefined ? msg.boardRadius : 12;
      const boardPaddingX = msg.boardPaddingX !== undefined ? msg.boardPaddingX : 48;
      const boardPaddingY = msg.boardPaddingY !== undefined ? msg.boardPaddingY : 56;
      const boardBg = msg.boardBg || { r: 249/255, g: 250/255, b: 251/255 };

      const drawGrid = msg.drawGrid !== false;
      const drawLabels = msg.drawLabels !== false;
      const drawProps = msg.drawProps !== false;
      const drawUsage = msg.drawUsage !== false;

      const language = msg.language || 'zh';
      const status = msg.status || 'approved';
      const designer = msg.designer || '';
      const usagePage = msg.usagePage || '';
      const aiGeneratedDescription = msg.aiGeneratedDescription || '';
      const itemSpacing = msg.itemSpacing !== undefined ? msg.itemSpacing : 24;
      const orientation = msg.orientation === 'portrait' ? 'portrait' : 'landscape';
      const isDark = msg.theme === 'dark';
      const themeText: RGB = isDark ? { r: 243/255, g: 244/255, b: 246/255 } : { r: 17/255, g: 24/255, b: 39/255 };
      const themeMuted: RGB = isDark ? { r: 156/255, g: 163/255, b: 175/255 } : { r: 75/255, g: 85/255, b: 99/255 };
      const themeSurface: RGB = isDark ? { r: 31/255, g: 41/255, b: 55/255 } : { r: 1, g: 1, b: 1 };
      const themeBorder: RGB = isDark ? { r: 55/255, g: 65/255, b: 81/255 } : { r: 229/255, g: 231/255, b: 235/255 };

      const selection = mg.document.currentPage.selection;
      let targetNode: ComponentSetNode | null = null;
      if (selection.length === 1) {
        if (selection[0].type === 'COMPONENT_SET') targetNode = selection[0];
        else if (selection[0].type === 'FRAME' && selection[0].getPluginData('isShowcaseBoard') === 'true') {
          targetNode = selection[0].findOne(n => n.type === 'COMPONENT_SET') as ComponentSetNode | null;
        }
      }

      if (!targetNode) {
        mg.notify("请选中一个 Component Set 或已生成的说明书画板！", { type: 'error' });
        break;
      }

      const componentSet = targetNode;
      const variants = componentSet.children as ComponentNode[];
      if (variants.length === 0) break;

      // ====== 【核心修复】二次编辑重写与销毁旧画板的递归追溯算法 ======
      let baseX = componentSet.x;
      let baseY = componentSet.y;
      let isReedit = false;

      let ancestor: BaseNode | null = componentSet.parent;
      let oldBoard: FrameNode | null = null;
      while (ancestor && ancestor.type !== 'DOCUMENT' && ancestor.type !== 'PAGE') {
        if (ancestor.type === 'FRAME' && ancestor.getPluginData('isShowcaseBoard') === 'true') {
          oldBoard = ancestor as FrameNode;
          break;
        }
        ancestor = ancestor.parent;
      }

      if (oldBoard) {
        baseX = oldBoard.x;
        baseY = oldBoard.y;
        isReedit = true;
        mg.document.currentPage.appendChild(componentSet); // 提取组件集到当前页面根目录
        oldBoard.remove(); // 销毁老旧的外层大画板
      }

      const sampleName = variants[0].name;
      const properties = sampleName.split(',').map(p => p.split('=')[0].trim());
      const hasY = !!propY && propY !== propX; // 是否有有效的 Y 轴（二维布局）
      const groupProps = hasY ? properties.filter(p => p !== propX && p !== propY) : properties.filter(p => p !== propX);

      const xValues = new Set<string>(); const yValues = new Set<string>(); const groupValues = new Set<string>();

      variants.forEach(v => {
        const props = parseVariantName(v.name);
        if (props[propX]) xValues.add(props[propX]);
        if (hasY && props[propY]) yValues.add(props[propY]);
        else if (!hasY) yValues.add('default'); // 单维时伪造一个 Y 值
        const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ');
        groupValues.add(gSign || 'Default');
      });

      const xArray = Array.from(xValues); const yArray = hasY ? Array.from(yValues) : ['default']; const groups = Array.from(groupValues);

      await mg.loadFontAsync({ family: "Inter", style: "Regular" });
      await mg.loadFontAsync({ family: "Inter", style: "Medium" });
      await mg.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      await mg.loadFontAsync({ family: "Inter", style: "Bold" });

      let maxWidth = 0, maxHeight = 0;
      variants.forEach(v => {
        if (v.width > maxWidth) maxWidth = v.width;
        if (v.height > maxHeight) maxHeight = v.height;
      });

      const cellWidth = maxWidth + gapX; const cellHeight = hasY ? maxHeight + gapY : 0;
      const singleGroupHeight = hasY
        ? yArray.length * maxHeight + Math.max(0, yArray.length - 1) * gapY
        : maxHeight;

      // 调整内部定位
      componentSet.flexMode = "NONE";
      if (compRadius > 0) safeCornerRadius(componentSet, compRadius);

      // 直接应用描边至组件集本身
      try {
        if (compStroke > 0) {
          componentSet.strokes = [solidPaint(compStrokeColor)];
          componentSet.strokeWeight = compStroke;
          componentSet.strokeDashes = [6, 4];
        } else {
          componentSet.strokes = [];
        }
      } catch (e) {
        console.warn("ComponentSetNode 描边受限，跳过直接修改", e);
      }

      variants.forEach(v => {
        const props = parseVariantName(v.name);
        const colIndex = xArray.indexOf(props[propX]);
        const rowIndex = hasY ? yArray.indexOf(props[propY]) : 0; // 单属性时行索引始终为 0
        const gSign = groupProps.map(p => `${p}=${props[p]}`).join(', ') || 'Default';
        const groupIndex = groups.indexOf(gSign);

        if (colIndex !== -1 && rowIndex !== -1 && groupIndex !== -1) {
          const groupOffsetY = groupIndex * (singleGroupHeight + groupGap);
          v.x = padding + colIndex * cellWidth + (maxWidth - v.width) / 2;
          v.y = hasY
            ? padding + groupOffsetY + rowIndex * cellHeight + (maxHeight - v.height) / 2
            : padding + (maxHeight - v.height) / 2; // 单属性：垂直居中
        }
      });

      const compSetWidth = padding * 2 + xArray.length * maxWidth + Math.max(0, xArray.length - 1) * gapX;
      const compSetHeight = hasY
        ? padding * 2 + groups.length * singleGroupHeight + Math.max(0, groups.length - 1) * groupGap
        : padding * 2 + maxHeight;
      componentSet.resize(compSetWidth, compSetHeight);

      // ================= 视觉绘制层 =================
      // 计算自适应宽度，为两旁留出呼吸空间
      const minimumBoardWidth = orientation === 'portrait' ? 720 : 1120;
      const boardWidth = Math.max(
        compSetWidth + boardPaddingX * 2 + (drawLabels && hasY ? 120 : 0),
        minimumBoardWidth
      );

      const boardFrame = mg.createFrame();
      boardFrame.name = `📚 ${componentSet.name} Specs`;
      boardFrame.setPluginData('isShowcaseBoard', 'true');
      boardFrame.fills = [solidPaint(boardBg)];
      safeCornerRadius(boardFrame, boardRadius);

      // 定位修正：如果是新生成，向左向上抵消偏移，让组件集永远留在用户点击的原位上
      boardFrame.x = isReedit ? baseX : (baseX - boardPaddingX - (drawLabels && hasY ? 120 : 0));
      boardFrame.y = isReedit ? baseY : (baseY - boardPaddingY - 96);

      // 顶级画板：开启自动布局
      boardFrame.flexMode = "VERTICAL";
      setHorizontalSizing(boardFrame, 'FIXED');
      boardFrame.resize(boardWidth, 200); // 仅在横向上固定，高度后续完全交由 HUG 托管自适应
      boardFrame.itemSpacing = itemSpacing;// 画板内部区块间距（可配置）
      boardFrame.paddingLeft = boardPaddingX;
      boardFrame.paddingRight = boardPaddingX;
      boardFrame.paddingTop = boardPaddingY;
      boardFrame.paddingBottom = boardPaddingY;

      const contentWidth = boardWidth - boardPaddingX * 2;

      // 视觉微勋章：顶部极致的高阶色条
      const accentBar = mg.createFrame();
      accentBar.name = "🎨 Accent Bar";
      accentBar.resize(boardWidth, 6);
      accentBar.fills = [solidPaint(compStrokeColor)];
      boardFrame.appendChild(accentBar);
      setHorizontalSizing(accentBar, 'FILL');
      setVerticalSizing(accentBar, 'FIXED');

      // --- Header 区域 ---
      const headerFrame = mg.createFrame();
      headerFrame.name = "Header Row";
      headerFrame.flexMode = "HORIZONTAL";
      headerFrame.fills = [];
      headerFrame.itemSpacing = 16;
      headerFrame.mainAxisAlignItems = "FLEX_START";
      headerFrame.crossAxisAlignItems = "CENTER";
      boardFrame.appendChild(headerFrame);
      setHorizontalSizing(headerFrame, 'FILL');
      setVerticalSizing(headerFrame, 'HUG');

      const formatTitle = (name: string, lang: string): string => {
        let title = name.replace(/^(ic_|icon_|btn_|img_|img-)/i, '');
        title = title.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        title = title.replace(/\s+/g, ' ');
        if (lang === 'en') return title;
        const translations: { [key: string]: string } = {
          'button': '按钮', 'input': '输入框', 'card': '卡片', 'modal': '弹窗', 'dialog': '对话框',
          'checkbox': '复选框', 'radio': '单选框', 'switch': '开关', 'select': '选择器', 'table': '表格',
          'tag': '标签', 'label': '标签', 'badge': '徽章', 'list': '列表', 'avatar': '头像',
        };
        const lowerTitle = title.toLowerCase();
        return translations[lowerTitle] || title;
      };

      const titleText = formatTitle(componentSet.name, language);

      const title = mg.createText();
      title.name = "Component Title";
      title.characters = titleText;
      setTextFontSize(title, 36); setTextFontName(title, { family: "Inter", style: "Bold" });
      title.fills = [solidPaint(themeText)];
      headerFrame.appendChild(title);
      setHorizontalSizing(title, 'FILL');
      setVerticalSizing(title, 'HUG');
      title.textAutoResize = "HEIGHT";

      // 精美自适应状态徽章
      const statusConfig: { [key: string]: { bg: RGB, text: RGB, label: string, labelEn: string } } = {
        'approved': { bg: { r: 220/255, g: 252/255, b: 231/255 }, text: { r: 22/255, g: 101/255, b: 52/255 }, label: '已审核', labelEn: 'APPROVED' },
        'draft': { bg: { r: 254/255, g: 243/255, b: 199/255 }, text: { r: 146/255, g: 113/255, b: 24/255 }, label: '草稿', labelEn: 'DRAFT' },
        'deprecated': { bg: { r: 254/255, g: 226/255, b: 226/255 }, text: { r: 153/255, g: 27/255, b: 27/255 }, label: '已废弃', labelEn: 'DEPRECATED' },
        'review': { bg: { r: 223/255, g: 232/255, b: 255/255 }, text: { r: 67/255, g: 56/255, b: 202/255 }, label: '待审核', labelEn: 'REVIEW' },
      };

      const badge = mg.createFrame();
      badge.name = `Status: ${status.toUpperCase()}`;
      badge.flexMode = "HORIZONTAL";
      badge.paddingLeft = 12; badge.paddingRight = 12; badge.paddingTop = 7; badge.paddingBottom = 7;
      safeCornerRadius(badge, 8);
      const statusInfo = statusConfig[status] || statusConfig['approved'];
      badge.fills = [solidPaint(statusInfo.bg)];

      const badgeText = mg.createText();
      badgeText.name = "Status Text";
      badgeText.characters = language === 'zh' ? statusInfo.label : statusInfo.labelEn;
      setTextFontSize(badgeText, 12); setTextFontName(badgeText, { family: "Inter", style: "Bold" });
      badgeText.fills = [solidPaint(statusInfo.text)];
      badge.appendChild(badgeText);
      headerFrame.appendChild(badge);
      setHorizontalSizing(badge, 'HUG');
      setVerticalSizing(badge, 'HUG');

      // --- Metadata Spec Card (高颜值结构化描述卡片) ---
      const metaCard = mg.createFrame();
      metaCard.name = "Metadata Spec Card";
      metaCard.flexMode = "VERTICAL";
      metaCard.itemSpacing = 8;
      metaCard.paddingLeft = 16; metaCard.paddingRight = 16; metaCard.paddingTop = 14; metaCard.paddingBottom = 14;
      safeCornerRadius(metaCard, 12);
      metaCard.fills = [solidPaint(themeSurface)];
      metaCard.strokes = [solidPaint(themeBorder)];
      boardFrame.appendChild(metaCard);
      setHorizontalSizing(metaCard, 'FILL');
      setVerticalSizing(metaCard, 'HUG');

      let aiDesc: { componentName?: string; usage?: string; properties?: string; propertyDescriptions?: Record<string, string>; do?: string; dont?: string } | null = null;
      if (aiGeneratedDescription) {
        try { aiDesc = JSON.parse(aiGeneratedDescription); } catch (e) { console.error('Failed to parse AI description:', e); }
      }

      const createDescriptionText = (content: string, isHeader: boolean = false) => {
        const textNode = mg.createText();
        textNode.name = isHeader ? "Component Name Line" : "Info Text Paragraph";
        textNode.characters = content;
        setTextFontSize(textNode, isHeader ? 14 : 13);
        setTextFontName(textNode, { family: "Inter", style: isHeader ? "Semi Bold" : "Regular" });
        textNode.fills = [solidPaint(isHeader ? themeText : themeMuted)];
        metaCard.appendChild(textNode);
        setHorizontalSizing(textNode, 'FILL');
        setVerticalSizing(textNode, 'HUG');
        textNode.textAutoResize = "HEIGHT";
      };

      const englishTitle = formatTitle(componentSet.name, 'en');
      const nameVal = aiDesc?.componentName ? aiDesc.componentName : (language === 'zh' ? `${titleText} / ${englishTitle}` : `${englishTitle} / ${titleText}`);
      createDescriptionText(language === 'zh' ? `组件名称：${nameVal}` : `Component: ${nameVal}`, true);

      const usageVal = aiDesc?.usage ? aiDesc.usage : (language === 'zh' ? `该组件适用于需要用户交互的界面场景，如表单提交、对话框确认、导航跳转等。不建议在纯展示型页面中过度使用。` : `This component is suitable for interactive UI scenarios such as form submissions, dialog confirmations, and navigation.`);
      createDescriptionText(language === 'zh' ? `适用场景：${usageVal}` : `Usage: ${usageVal}`);

      const propsVal = aiDesc?.properties ? aiDesc.properties : (language === 'zh' ? `包含 ${properties.length} 个可配置属性（${properties.join('、')}），每个属性控制组件的不同视觉状态或功能变体。` : `Contains ${properties.length} configurable properties (${properties.join(', ')}).`);
      createDescriptionText(language === 'zh' ? `属性说明：${propsVal}` : `Properties: ${propsVal}`);

      // --- Tags 标签行 ---
      const tagsContainer = mg.createFrame();
      tagsContainer.name = "Meta Tags Row";
      tagsContainer.flexMode = "HORIZONTAL";
      tagsContainer.itemSpacing = 8;
      metaCard.appendChild(tagsContainer);
      setHorizontalSizing(tagsContainer, 'FILL');
      setVerticalSizing(tagsContainer, 'HUG');

      const createTag = (label: string, value: string, bgColor: RGB, textColor: RGB) => {
        const tag = mg.createFrame();
        tag.name = `Tag: ${label}`;
        tag.flexMode = "HORIZONTAL";
        tag.paddingLeft = 8; tag.paddingRight = 8; tag.paddingTop = 4; tag.paddingBottom = 4;
        safeCornerRadius(tag, 4);
        tag.fills = [solidPaint(bgColor)];

        const tagText = mg.createText();
        tagText.name = "Tag Label";
        tagText.characters = `${label}: ${value}`;
        setTextFontSize(tagText, 11); setTextFontName(tagText, { family: "Inter", style: "Medium" });
        tagText.fills = [solidPaint(textColor)];
        tag.appendChild(tagText);
        tagsContainer.appendChild(tag);
        setHorizontalSizing(tag, 'HUG');
        setVerticalSizing(tag, 'HUG');
      };

      createTag(language === 'zh' ? '变体数量' : 'Variants', `${variants.length}`, { r: 243/255, g: 244/255, b: 246/255 }, { r: 55/255, g: 65/255, b: 81/255 });
      const now = new Date();
      const dateStr = language === 'zh'
        ? `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
        : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      createTag(language === 'zh' ? '更新日期' : 'Updated', dateStr, { r: 243/255, g: 244/255, b: 246/255 }, { r: 55/255, g: 65/255, b: 81/255 });

      if (designer) createTag(language === 'zh' ? '设计者' : 'Designer', designer, { r: 239/255, g: 246/255, b: 255/255 }, { r: 37/255, g: 99/255, b: 235/255 });
      if (usagePage) createTag(language === 'zh' ? '使用页面' : 'Usage', usagePage, { r: 254/255, g: 243/255, b: 199/255 }, { r: 146/255, g: 113/255, b: 24/255 });

      // --- 分割线 (修复：确保高度在自动布局中固定为 1px，避免被拉高) ---
      const divider = mg.createLine();
      divider.name = "Section Divider Line";
      boardFrame.appendChild(divider);
      setHorizontalSizing(divider, 'FILL');
      setVerticalSizing(divider, 'FIXED');
      divider.strokeWeight = 1;
      divider.strokes = [solidPaint({ r: 27/255, g: 43/255, b: 75/255 }, 0.2)];

      // --- 【视觉重构】变体舞台区 (Matrix Stage) ---
      const matrixStage = mg.createFrame();
      matrixStage.name = "Matrix Stage";
      matrixStage.flexMode = "VERTICAL";
      matrixStage.paddingLeft = 24; matrixStage.paddingRight = 24; matrixStage.paddingTop = 24; matrixStage.paddingBottom = 24;
      safeCornerRadius(matrixStage, 12);
      matrixStage.fills = [solidPaint(themeSurface)];
      matrixStage.strokes = [solidPaint(themeBorder)];
      matrixStage.crossAxisAlignItems = "CENTER";
      boardFrame.appendChild(matrixStage);
      setHorizontalSizing(matrixStage, 'FILL');
      setVerticalSizing(matrixStage, 'HUG');

      // 矩阵绘制区域（绝对定位容器置于舞台中央）
      const componentArea = mg.createFrame();
      componentArea.name = "Component Draw Area";
      componentArea.flexMode = "NONE";
      componentArea.fills = [];
      matrixStage.appendChild(componentArea);

      const areaWidth = compSetWidth + (drawLabels && hasY ? 120 : 0);
      const areaHeight = compSetHeight + (drawLabels ? 60 : 0);
      setHorizontalSizing(componentArea, 'FIXED');
      setVerticalSizing(componentArea, 'FIXED');
      componentArea.resize(areaWidth, areaHeight);

      // 将组件集安置于有偏移的精确定位上，防止裁剪行/列标签
      componentArea.appendChild(componentSet);
      componentSet.x = (drawLabels && hasY) ? 120 : 0;
      componentSet.y = drawLabels ? 40 : 0;

      // 绘制虚线网格和行列标签
      const matrixNodes: SceneNode[] = [];

      if (drawLabels) {
        xArray.forEach((xVal, index) => {
          const label = mg.createText();
          label.name = "X Axis Label";
          label.characters = `${propX}: ${xVal}`.toUpperCase();
          setTextFontSize(label, 12); setTextFontName(label, { family: "Inter", style: "Semi Bold" });
          label.fills = [solidPaint({ r: 107/255, g: 114/255, b: 128/255 })];
          label.x = componentSet.x + padding + index * cellWidth + maxWidth / 2 - label.width / 2;
          label.y = componentSet.y - 32;
          componentArea.appendChild(label); matrixNodes.push(label);
        });
      }

      groups.forEach((gSign, gIndex) => {
        const groupAbsoluteY = componentSet.y + padding + gIndex * (singleGroupHeight + groupGap);

        // 组标题（仅在多属性分组时显示）
        if (hasY && groupProps.length > 0 && drawLabels) {
          const gTitle = mg.createText();
          gTitle.name = "Group Title";
          gTitle.characters = gSign.toUpperCase();
          setTextFontSize(gTitle, 16); setTextFontName(gTitle, { family: "Inter", style: "Bold" });
          gTitle.fills = [solidPaint({ r: 75/255, g: 85/255, b: 99/255 })];
          gTitle.x = componentSet.x - 90; gTitle.y = groupAbsoluteY;
          componentArea.appendChild(gTitle); matrixNodes.push(gTitle);
        }

        // Y 轴标签（仅在二维布局时绘制）
        if (hasY && drawLabels) {
          yArray.forEach((yVal, rowIndex) => {
            const label = mg.createText();
            label.name = "Y Axis Label";
            label.characters = `${propY}: ${yVal}`.toUpperCase();
            setTextFontSize(label, 12); setTextFontName(label, { family: "Inter", style: "Semi Bold" });
            label.fills = [solidPaint({ r: 156/255, g: 163/255, b: 175/255 })];
            label.x = componentSet.x - label.width - 24;
            label.y = groupAbsoluteY + rowIndex * cellHeight + maxHeight / 2 - label.height / 2;
            componentArea.appendChild(label); matrixNodes.push(label);
          });
        }

        if (drawGrid) {
          // 水平网格线（仅在二维布局时绘制）
          if (hasY) {
            for (let r = 1; r < yArray.length; r++) {
              const line = mg.createLine(); line.resize(xArray.length * cellWidth, 0);
              line.x = componentSet.x + padding; line.y = groupAbsoluteY + r * cellHeight - gapY / 2;
              line.strokeDashes = [4, 4]; line.strokeWeight = gridLineWidth; line.strokes = [solidPaint(gridLineColor)];
              componentArea.appendChild(line); matrixNodes.push(line);
            }
          }
          // 垂直网格线
          for (let c = 1; c < xArray.length; c++) {
            const lineHeight = hasY ? singleGroupHeight : compSetHeight - padding * 2;
            const line = mg.createLine(); line.resize(lineHeight, 0); line.rotation = -90;
            line.x = componentSet.x + padding + c * cellWidth - gapX / 2; line.y = groupAbsoluteY + (hasY ? 0 : padding);
            line.strokeDashes = [4, 4]; line.strokeWeight = gridLineWidth; line.strokes = [solidPaint(gridLineColor)];
            componentArea.appendChild(line); matrixNodes.push(line);
          }
        }
      });

      if (matrixNodes.length > 0) {
        const matrixGroup = groupInParent(matrixNodes, componentArea);
        matrixGroup.name = "Matrix Decorations";
      }

      const describeVariantProperty = (prop: string, values: string[]) => {
        const key = prop.toLocaleLowerCase();
        const joined = values.slice(0, 6).join(language === 'zh' ? '、' : ', ');
        const semantic = /size|尺寸|scale/.test(key)
          ? (language === 'zh' ? '控制组件的尺寸层级与使用密度。' : 'Controls component scale and interface density.')
          : /state|status|状态|interaction/.test(key)
            ? (language === 'zh' ? '描述组件在交互流程中的状态。' : 'Describes the component state in an interaction flow.')
            : /theme|mode|主题|模式|appearance/.test(key)
              ? (language === 'zh' ? '切换视觉主题或外观模式。' : 'Switches the visual theme or appearance mode.')
              : /type|kind|variant|style|类型|样式/.test(key)
                ? (language === 'zh' ? '区分组件的语义类型与视觉层级。' : 'Distinguishes semantic variants and visual hierarchy.')
                : /icon|图标/.test(key)
                  ? (language === 'zh' ? '控制图标内容、位置或显隐。' : 'Controls icon content, placement, or visibility.')
                  : /direction|position|placement|align|方向|位置|对齐/.test(key)
                    ? (language === 'zh' ? '控制内容方向、位置或对齐关系。' : 'Controls direction, placement, or alignment.')
                    : (language === 'zh' ? '控制该组件的一组可复用表现。' : 'Controls a reusable aspect of the component.');
        return `${semantic}${joined ? (language === 'zh' ? ` 可选：${joined}。` : ` Options: ${joined}.`) : ''}`;
      };

      // --- Properties 属性汇总面板（自动布局，完美自适应高度）---
      if (drawProps) {
        // 包装容器：标题 + 卡片作为一组
        const propsGroup = mg.createFrame();
        propsGroup.name = "Properties & Tokens Group";
        propsGroup.fills = [];
        propsGroup.flexMode = "VERTICAL";
        propsGroup.itemSpacing = 10;
        boardFrame.appendChild(propsGroup);
        setHorizontalSizing(propsGroup, 'FILL');
        setVerticalSizing(propsGroup, 'HUG');

        // 标题放在卡片外面
        const specTitle = mg.createText();
        specTitle.name = "Properties & Tokens Title";
        specTitle.characters = "Properties & Tokens";
        setTextFontSize(specTitle, 18); setTextFontName(specTitle, { family: "Inter", style: "Bold" });
        specTitle.fills = [solidPaint(themeText)];
        propsGroup.appendChild(specTitle);
        setHorizontalSizing(specTitle, 'FILL');
        setVerticalSizing(specTitle, 'HUG');

        const propsPanel = mg.createFrame();
        propsPanel.name = "Properties & Tokens Panel";
        propsPanel.flexMode = "VERTICAL";
        propsPanel.itemSpacing = 14;
        propsPanel.paddingLeft = 16; propsPanel.paddingRight = 16; propsPanel.paddingTop = 16; propsPanel.paddingBottom = 16;
        safeCornerRadius(propsPanel, 12);
        propsPanel.fills = [solidPaint(themeSurface)];
        propsPanel.strokes = [solidPaint(themeBorder)];
        propsGroup.appendChild(propsPanel);
        setHorizontalSizing(propsPanel, 'FILL');
        setVerticalSizing(propsPanel, 'HUG');

        properties.forEach(prop => {
          const vals = new Set<string>();
          variants.forEach(v => { const p = parseVariantName(v.name); if (p[prop]) vals.add(p[prop]); });

          const propRow = mg.createFrame();
          propRow.name = "Property Row";
          propRow.flexMode = "VERTICAL";
          propRow.itemSpacing = 5;
          propsPanel.appendChild(propRow);
          setHorizontalSizing(propRow, 'FILL');
          setVerticalSizing(propRow, 'HUG');

          const pName = mg.createText();
          pName.name = "Property Name";
          pName.characters = prop; setTextFontSize(pName, 13); setTextFontName(pName, { family: "Inter", style: "Semi Bold" });
          pName.fills = [solidPaint(themeText)];
          propRow.appendChild(pName);
          setHorizontalSizing(pName, 'HUG');
          setVerticalSizing(pName, 'HUG');

          const semanticText = mg.createText();
          semanticText.name = "Property Description";
          semanticText.characters = aiDesc?.propertyDescriptions?.[prop]
            || describeVariantProperty(prop, Array.from(vals));
          setTextFontSize(semanticText, 11);
          setTextFontName(semanticText, { family: "Inter", style: "Regular" });
          semanticText.fills = [solidPaint(themeMuted)];
          propRow.appendChild(semanticText);
          setHorizontalSizing(semanticText, 'FILL');
          setVerticalSizing(semanticText, 'HUG');
          semanticText.textAutoResize = "HEIGHT";

          const valuesRow = mg.createFrame();
          valuesRow.name = "Property Values";
          valuesRow.flexMode = "HORIZONTAL";
          valuesRow.itemSpacing = 6;
          valuesRow.fills = [];
          trySet(valuesRow, 'flexWrap', 'WRAP');
          trySet(valuesRow, 'crossAxisSpacing', 6);
          propRow.appendChild(valuesRow);
          setHorizontalSizing(valuesRow, 'FILL');
          setVerticalSizing(valuesRow, 'HUG');

          Array.from(vals).forEach(val => {
            const pill = mg.createFrame();
            pill.flexMode = "HORIZONTAL";
            safeCornerRadius(pill, 6); pill.fills = [solidPaint(isDark ? { r: 55/255, g: 65/255, b: 81/255 } : { r: 243/255, g: 244/255, b: 246/255 })];
            pill.strokes = [solidPaint(themeBorder)];
            pill.paddingLeft = 8; pill.paddingRight = 8; pill.paddingTop = 4; pill.paddingBottom = 4;

            const pVal = mg.createText(); pVal.characters = val;
            setTextFontSize(pVal, 11); setTextFontName(pVal, { family: "Inter", style: "Regular" });
            pVal.fills = [solidPaint(themeText)];
            pill.appendChild(pVal);
            valuesRow.appendChild(pill);

            setHorizontalSizing(pill, 'HUG');
            setVerticalSizing(pill, 'HUG');
            setHorizontalSizing(pVal, 'HUG');
            setVerticalSizing(pVal, 'HUG');
          });
        });
      }

      // --- Best Practices 使用指南卡片（自动布局，完美自适应）---
      if (drawUsage) {
        const usagePanel = mg.createFrame();
        usagePanel.name = "Best Practices Panel";
        usagePanel.fills = [];
        usagePanel.flexMode = "VERTICAL";
        usagePanel.itemSpacing = 10;
        boardFrame.appendChild(usagePanel);
        setHorizontalSizing(usagePanel, 'FILL');
        setVerticalSizing(usagePanel, 'HUG');

        const usageTitle = mg.createText();
        usageTitle.name = "Best Practices Title";
        usageTitle.characters = "Best Practices";
        setTextFontSize(usageTitle, 18); setTextFontName(usageTitle, { family: "Inter", style: "Bold" });
        usageTitle.fills = [solidPaint(themeText)];
        usagePanel.appendChild(usageTitle);
        setHorizontalSizing(usageTitle, 'FILL');
        setVerticalSizing(usageTitle, 'HUG');

        const doDontContainer = mg.createFrame();
        doDontContainer.name = "Do-Dont Container";
        doDontContainer.fills = [];
        doDontContainer.flexMode = "HORIZONTAL";
        doDontContainer.itemSpacing = 12;
        usagePanel.appendChild(doDontContainer);
        setHorizontalSizing(doDontContainer, 'FILL');
        setVerticalSizing(doDontContainer, 'HUG');

        // Do Card - 完美自适应高度
        const doCard = mg.createFrame();
        doCard.name = "Do Card";
        doCard.flexMode = "VERTICAL";
        doCard.itemSpacing = 0;
        safeCornerRadius(doCard, 12);
        doCard.fills = [solidPaint(themeSurface)];
        doCard.strokes = [solidPaint(themeBorder)];
        doCard.strokeWeight = 1;
        doDontContainer.appendChild(doCard);

        setHorizontalSizing(doCard, 'FILL');
        setVerticalSizing(doCard, 'HUG');

        const doTopBar = mg.createFrame();
        doTopBar.resize(100, 6);
        doTopBar.fills = [solidPaint({ r: 34/255, g: 197/255, b: 94/255 })];
        doCard.appendChild(doTopBar);
        setHorizontalSizing(doTopBar, 'FILL');
        setVerticalSizing(doTopBar, 'FIXED');

        const doContent = mg.createFrame();
        doContent.flexMode = "HORIZONTAL";
        doContent.itemSpacing = 12;
        doContent.paddingLeft = 16; doContent.paddingRight = 16; doContent.paddingTop = 14; doContent.paddingBottom = 16;
        doContent.fills = [];
        doCard.appendChild(doContent);

        setHorizontalSizing(doContent, 'FILL');
        setVerticalSizing(doContent, 'HUG');

        const doIcon = mg.createText();
        doIcon.characters = "✅";
        setTextFontSize(doIcon, 18);
        doContent.appendChild(doIcon);
        setHorizontalSizing(doIcon, 'HUG');
        setVerticalSizing(doIcon, 'HUG');

        const doText = mg.createText();
        doText.characters = aiDesc?.do || (language === 'zh'
          ? `建议：在设计稿中通过 ${properties.slice(0, 2).join('、') || '组件属性'} 切换状态，保持实例与母版同步。`
          : `Do: switch states with ${properties.slice(0, 2).join(', ') || 'component properties'} and keep instances linked to the master.`);
        setTextFontSize(doText, 12); setTextFontName(doText, { family: "Inter", style: "Medium" });
        doText.fills = [solidPaint(themeText)];
        doContent.appendChild(doText);

        setHorizontalSizing(doText, 'FILL');
        setVerticalSizing(doText, 'HUG');
        doText.textAutoResize = "HEIGHT";

        // Don't Card - 完美自适应高度
        const dontCard = mg.createFrame();
        dontCard.name = "Don't Card";
        dontCard.flexMode = "VERTICAL";
        dontCard.itemSpacing = 0;
        safeCornerRadius(dontCard, 12);
        dontCard.fills = [solidPaint(themeSurface)];
        dontCard.strokes = [solidPaint(themeBorder)];
        dontCard.strokeWeight = 1;
        doDontContainer.appendChild(dontCard);

        setHorizontalSizing(dontCard, 'FILL');
        setVerticalSizing(dontCard, 'HUG');

        const dontTopBar = mg.createFrame();
        dontTopBar.resize(100, 6);
        dontTopBar.fills = [solidPaint({ r: 239/255, g: 68/255, b: 68/255 })];
        dontCard.appendChild(dontTopBar);
        setHorizontalSizing(dontTopBar, 'FILL');
        setVerticalSizing(dontTopBar, 'FIXED');

        const dontContent = mg.createFrame();
        dontContent.flexMode = "HORIZONTAL";
        dontContent.itemSpacing = 12;
        dontContent.paddingLeft = 16; dontContent.paddingRight = 16; dontContent.paddingTop = 14; dontContent.paddingBottom = 16;
        dontContent.fills = [];
        dontCard.appendChild(dontContent);

        setHorizontalSizing(dontContent, 'FILL');
        setVerticalSizing(dontContent, 'HUG');

        const dontIcon = mg.createText();
        dontIcon.characters = "🚫";
        setTextFontSize(dontIcon, 18);
        dontContent.appendChild(dontIcon);
        setHorizontalSizing(dontIcon, 'HUG');
        setVerticalSizing(dontIcon, 'HUG');

        const dontText = mg.createText();
        dontText.characters = aiDesc?.dont || (language === 'zh'
          ? '避免解绑实例后手工复制状态，也不要用重复的属性值表达同一种语义。'
          : 'Avoid detaching instances to copy states, and do not use duplicate property values for the same meaning.');
        setTextFontSize(dontText, 12); setTextFontName(dontText, { family: "Inter", style: "Medium" });
        dontText.fills = [solidPaint(themeText)];
        dontContent.appendChild(dontText);

        setHorizontalSizing(dontText, 'FILL');
        setVerticalSizing(dontText, 'HUG');
        dontText.textAutoResize = "HEIGHT";
      }

      // ====== 【核心修复】启用高度自适应 HUG (在此之后严禁再调用 resize(..., height)) ======
      setVerticalSizing(boardFrame, 'HUG');

      // 组件集直接挂在最外层说明书画板下，装饰区保留原尺寸作为布局占位。
      const componentBounds = componentSet.absoluteBoundingBox;
      const boardBounds = boardFrame.absoluteBoundingBox;
      if (componentBounds && boardBounds) {
        boardFrame.appendChild(componentSet);
        trySet(componentSet, 'layoutPositioning', 'ABSOLUTE');
        componentSet.x = componentBounds.x - boardBounds.x;
        componentSet.y = componentBounds.y - boardBounds.y;
      }
      mg.document.currentPage.selection = [boardFrame];
      mg.viewport.scrollAndZoomIntoView([boardFrame]);

      mg.notify("✅ 说明书生成完毕！");
      mg.commitUndo();
      break;
    }


  }
};

// -------------------------------------------------------------
// 【新增】高级命名转换函数 (支持 格式+分隔符+大小写 组合)
// -------------------------------------------------------------


// --- PPT 工具辅助函数 ---

// 获取用户选中的 Frame (ID去重版)
function getSlides() {
  const selection = mg.document.currentPage.selection;
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
    let instances = slide.findAll(n => n.type === 'INSTANCE') as InstanceNode[];

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
      instances = slide.findAll(n => n.type === 'INSTANCE') as InstanceNode[];
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
    if (node.isLocked) {
        node.isLocked = false;
    }

    // 2. 移除隐藏图层
    if (!node.isVisible) {
      node.remove();
      return; // 删了就不用看子级了
    }

    // 3. 移除 AutoLayout
    if (node.type === 'FRAME' && node.flexMode !== 'NONE') {
      node.flexMode = 'NONE';
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
  sendToUI({ type: 'step-done', step: 1 });
}

// Step 2: 智能栅格化 (性能优化 + Hex ID)
async function pptStep2_Rasterize(slides: FrameNode[]) {
  let count = 0;
  // 生成短 ID
  const generateHexId = () => 'p_' + Math.random().toString(16).substring(2, 8);

  const isLineLike = (node: SceneNode) => {
    if (node.type === 'LINE') return true;
    if (node.type === 'PEN') {
      if (node.width < 2 || node.height < 2) return true;
      const ratio = node.width / node.height;
      if (ratio > 50 || ratio < 0.02) return true;
    }
    return false;
  };

  const traverse = async (node: SceneNode) => {
    if (node.removed || !node.isVisible) return;
    const name = node.name.toLowerCase();

    const isUserTarget = name.startsWith('p_img');
    let isTechTarget = false;

    if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.isVisible)) isTechTarget = true;
    else if (node.type === 'BOOLEAN_OPERATION') isTechTarget = true;
    else if (node.type === 'PEN' && !isLineLike(node)) isTechTarget = true;
    else if (node.type === 'ELLIPSE' && 'fills' in node && (node.fills as Paint[]).some(p => p.type === 'IMAGE')) isTechTarget = true;

    if (isUserTarget || isTechTarget) {
      try {
        const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 3 } });
        const image = await mg.createImage(bytes as Uint8Array);

        const rect = mg.createRectangle();
        rect.x = node.x; rect.y = node.y;
        rect.resize(node.width, node.height);

        // === 使用 Hex ID 重命名 ===
        rect.name = generateHexId();

        rect.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageRef: image.href }];
        rect.rotation = Number((node as any).rotation || 0);

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
  sendToUI({ type: 'step-done', step: 2 });
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
          ungroupNode(node);
          hasNested = true;
        }
        // 情况 B: Frame -> 转换为背景矩形(如需要) + 解散
        else if (node.type === 'FRAME') {

          try {
            // 2. === 修改：判断是否生成背景 ===
            // 使用 isNodeInvisible 判断：如果不透明且有填充/描边，才生成背景矩形
            // 如果是透明容器，则跳过此步，直接进入下面的 ungroup
            if (!isNodeInvisible(node)) {
               const rect = mg.createRectangle();
               rect.x = node.x;
               rect.y = node.y;
               rect.resize(node.width, node.height);

               // 复制样式
               rect.fills = node.fills;
               rect.strokes = node.strokes;

               // 安全复制粗细
               rect.strokeWeight = node.strokeWeight;

               // 安全复制圆角
               if (typeof node.cornerRadius === 'number') safeCornerRadius(rect, node.cornerRadius);
               else safeCornerRadius(rect, 0);

               // 复制特效
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
              ungroupNode(node);
              hasNested = true; // 结构变了，标记需要继续循环
            } else {
              node.remove(); // 空 Frame 删掉
            }

          } catch (err) {
            console.error("Layer flatten error:", err);
            // 容错：出错了也尝试解开，防止死循环
            if (node.children.length > 0) {
                ungroupNode(node);
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
      if (node.type === 'TEXT' && node.isVisible) {
        try {
          await loadTextFonts(node);
          node.textAutoResize = "HEIGHT";
          node.resize(node.width + 10, node.height);
        } catch (e) {}
      }
    }
  }

  sendToUI({ type: 'step-done', step: 3 });
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
  sendToUI({ type: 'ppt-init-total', count: slides.length });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    // 强制休息，释放上一页内存
    await new Promise(r => setTimeout(r, 50));

    const slideAbs = slide.absoluteBoundingBox;
    const slideX = slideAbs ? slideAbs.x : slide.x;
    const slideY = slideAbs ? slideAbs.y : slide.y;

    sendToUI({
      type: 'ppt-start-slide', index: i, width: slide.width, height: slide.height
    });

    let chunkBuffer = [];
    const children = slide.children;
    // 已移除 imgCounter，不再需要

    for (let j = 0; j < children.length; j++) {
      const node = children[j];

      // 1. 基础过滤：只过滤不可见图层，保留所有尺寸的元素
      if (!node.isVisible) continue;

      // 2. 获取位置：如果获取失败则跳过
      const nodeAbs = node.absoluteBoundingBox;
      if (!nodeAbs) continue;

      // 3. 计算相对中心点
      const centerX = (nodeAbs.x + nodeAbs.width / 2) - slideX;
      const centerY = (nodeAbs.y + nodeAbs.height / 2) - slideY;

      const el: any = {
        cx: centerX, cy: centerY, w: node.width, h: node.height, rotation: Number((node as any).rotation || 0)
      };

      if ('opacity' in node) el.opacity = node.opacity;
      if ('cornerRadius' in node && node.cornerRadius !== mg.mixed) el.cornerRadius = node.cornerRadius;

      try {
        // --- 样式提取 ---
        if ('strokes' in node && node.strokes.length > 0) {
          const stroke = node.strokes.find((s): s is SolidPaint => s.type === 'SOLID' && s.isVisible !== false && s.color.a > 0);
          if (stroke) {
            el.strokeColor = rgbToHex(stroke.color);
            el.strokeWeight = node.strokeWeight;
            el.strokeAlpha = (el.opacity ?? 1) * stroke.color.a;
          }
        }

        if ('effects' in node && node.effects.length > 0) {
          const shadow = node.effects.find(e => e.type === 'DROP_SHADOW' && e.isVisible) as ShadowEffect | undefined;
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
        if ('fills' in node && node.fills.length > 0) {
          visibleFill = node.fills.find((f): f is SolidPaint => f.type === 'SOLID' && f.isVisible !== false && f.color.a > 0);
        }
        if (visibleFill) {
          el.color = rgbToHex(visibleFill.color);
          el.fillAlpha = (el.opacity ?? 1) * visibleFill.color.a;
        } else {
          el.color = null;
          el.fillAlpha = 0;
        }

        // --- 类型分类 ---

        // A. 直线 & 连接线 (以及看起来像线的 Vector)
        const isLineLike = (node.type === 'LINE' || node.type === 'CONNECTOR');

        if (isLineLike) {
          el.type = 'line';

          if ('strokeDashes' in node && node.strokeDashes.length > 0) el.strokeDashes = node.strokeDashes;

          const arrowCaps = ['LINE_ARROW', 'TRIANGLE_ARROW', 'ROUND_ARROW', 'RING', 'DIAMOND'];
          const startCap = node.type === 'CONNECTOR' ? node.connectorStartStrokeCap : node.leftStrokeCap;
          const endCap = node.type === 'CONNECTOR' ? node.connectorEndStrokeCap : node.rightStrokeCap;
          if (arrowCaps.includes(startCap)) el.headArrow = 'triangle';
          if (arrowCaps.includes(endCap)) el.tailArrow = 'triangle';

          // 必须要有一条可见的描边，否则跳过
          if (!el.strokeColor) continue;

          chunkBuffer.push(el);
        }

        // B. 文本
        else if (node.type === 'TEXT') {
          el.type = 'text';
          el.text = node.characters.substring(0, 2000);

          // --- 1. 强制获取基准字号 ---
          const baseSize = getTextFontSize(node);
          el.fontSize = baseSize;

          // --- 2. 强制获取基准行高 (核心修复) ---
          // 无论是否混合，都尝试获取具体的行高对象
          const lh = getTextLineHeight(node);

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
          const fontName = getTextFontName(node);
          if (fontName) {
             el.fontFace = fontName.family;
             const style = fontName.style.toLowerCase();
             if (/bold|heavy|black|strong/.test(style)) el.isBold = true;
          }

          // 4. 判定多行 (逻辑保持不变，但要存入 el)
          let isMultiLine = node.characters.includes('\n');
          // 如果没有换行符，但高度超过 1.5 倍字号，也视为多行（折行）
          if (!isMultiLine && node.height > baseSize * 1.5) isMultiLine = true;
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
        else if (node.type === 'RECTANGLE' && node.fills.length > 0 && node.fills.some(p => p.type === 'IMAGE' && p.isVisible !== false)) {
          el.type = 'placeholder';
          // 直接使用图层名 (p_xxxxxx)
          el.imageName = node.name;
          el.fillAlpha = el.opacity || 1;
          chunkBuffer.push(el);
        }

        // D. 形状 (矩形、圆、星形、多边形) - 排除 LINE/CONNECTOR
        else if (
          node.type === 'RECTANGLE' || node.type === 'ELLIPSE' ||
          node.type === 'PEN' || node.type === 'STAR' ||
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
          sendToUI({ type: 'ppt-element-batch', data: chunkBuffer });
          chunkBuffer = [];
          // 强制休息 15ms，让 UI 线程有机会渲染 Loading 动画
          await new Promise(r => setTimeout(r, 15));
        }
      } catch (err) {
        // 静默失败，不打印 log
      }
    }

    if (chunkBuffer.length > 0) {
      sendToUI({ type: 'ppt-element-batch', data: chunkBuffer });
    }
    sendToUI({ type: 'ppt-end-slide' });
  }

  sendToUI({ type: 'step-done', step: 4, data: { done: true } });
}

// Step 5: 导出资源 (Hex ID 版)
async function pptStep5_ExportImages(slides: FrameNode[]) {
  sendToUI({ type: 'ppt-asset-start', totalSlides: slides.length });
  let imgCount = 0;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const children = slide.children;

    for (let j = 0; j < children.length; j++) {
       const node = children[j];
       if (!node.isVisible) continue;

       let isTarget = false;
       if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.isVisible)) isTarget = true;
       if (!isTarget && node.type === 'RECTANGLE' && node.fills.some(p => p.type === 'IMAGE')) isTarget = true;

       if (isTarget) {
          await new Promise(r => setTimeout(r, 50));
          try {
            const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1.5 } });
            // 使用 ID 命名
            const fileName = `${node.name}.png`;

            sendToUI({ type: 'ppt-asset-chunk', fileName: fileName, data: bytes });
            imgCount++;
          } catch (e) { console.error(e); }
       }
    }
  }
  sendToUI({ type: 'step-done', step: 5, data: { count: imgCount } });
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
  if (!node.isVisible) return true;
  if ('opacity' in node && node.opacity === 0) return true;

  // 2. 文本特殊处理：无内容即不可见
  if (node.type === 'TEXT' && node.characters.trim().length === 0) return true;

  // 3. 样式检查：针对有 fills/strokes 的节点
  if ('fills' in node && 'strokes' in node) {

    // 有效填充：存在 + 可见 + 不透明
    const hasFill = node.fills.length > 0 &&
                    node.fills.some(p => (p as any).isVisible !== false && paintAlpha(p) > 0);

    // 有效描边：存在 + 粗细>0 + 可见 + 不透明
    const hasStroke = node.strokes.length > 0 &&
                      node.strokeWeight > 0 &&
                      node.strokes.some(p => (p as any).isVisible !== false && paintAlpha(p) > 0);

    // 如果既无有效填充，也无有效描边 -> 视为不可见 (忽略特效)
    if (!hasFill && !hasStroke) return true;
  }

  // 其他情况（如 Group/Frame/Slice）暂时视为可见，交给后续逻辑处理
  return false;
}

// 辅助：按视觉位置排序 (Z字形：先上后下，同行先左后右)
function sortNodesByVisualPosition<T extends SceneNode>(nodes: T[]): T[] {
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

// 辅助函数：将 "Size=Small, State=Hover" 解析为 { Size: 'Small', State: 'Hover' }
function parseVariantName(name: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = name.split(',');
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });
  return result;
}
