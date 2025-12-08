// --- 类型定义 ---  
interface FilterProperty {
  key: string;
  val: string;
  op?: string;
}

type FilterRange = 'selection' | 'page' | 'single' | 'multi';
type FilterTypeLogic = 'include' | 'exclude';

export interface FindAndSelectFilters {
  range: FilterRange;
  name?: string;
  caseSensitive?: boolean;
  types?: string[];
  typeLogic?: FilterTypeLogic;
  states?: string[];
  props?: FilterProperty[];
}

// --- 核心功能 ---  
export async function handleFindAndSelect(selection: readonly SceneNode[], filters: FindAndSelectFilters) {
    let allNodes: SceneNode[] = [];

    // 范围筛选
    if (filters.range === 'selection') {
        allNodes = [...selection];
    } else {
        if (filters.range === 'page') {
            allNodes = figma.currentPage.findAll() as SceneNode[];
        } else if (filters.range === 'single') {
            const active = selection[0];
            if (active && 'children' in active && active.children) allNodes = [...active.children];
        } else if (filters.range === 'multi') {
            selection.forEach(n => {
                if ('children' in n && n.children) allNodes.push(...n.children);
            });
        }
    }

    // 名称筛选
    if (filters.name && filters.name.trim()) {
        const re = new RegExp(filters.name, filters.caseSensitive ? '' : 'i');
        allNodes = allNodes.filter(n => re.test(n.name));
    }

    // 类型筛选
    if (filters.types && filters.types.length > 0) {
        const ts = new Set(filters.types);
        if (filters.typeLogic === 'include') {
            allNodes = allNodes.filter(n => ts.has(n.type));
        } else {
            allNodes = allNodes.filter(n => !ts.has(n.type));
        }
    }

    // 状态筛选
    if (filters.states && filters.states.length > 0) {
        const ss = new Set(filters.states);
        allNodes = allNodes.filter(n => {
            let match = false;
            if (ss.has('hidden') && 'visible' in n && !n.visible) match = true;
            if (ss.has('locked') && 'locked' in n && n.locked) match = true;
            if (ss.has('no-fill') && 'fills' in n && Array.isArray(n.fills) && n.fills.length === 0) match = true;
            if (ss.has('no-stroke') && 'strokes' in n && Array.isArray(n.strokes) && n.strokes.length === 0) match = true;
            if (ss.has('clip') && 'clipsContent' in n && n.clipsContent) match = true;
            if (ss.has('no-children') && 'children' in n && n.children.length === 0) match = true;
            if (ss.has('export') && 'exportSettings' in n && n.exportSettings.length > 0) match = true;
            return match;
        });
    }

    // 属性筛选
    if (filters.props && filters.props.length > 0) {
        allNodes = allNodes.filter(n => {
            return filters.props!.every((p: FilterProperty) => {
                if (!p.key || p.val === undefined) return true;
                const v = p.val.trim();
                if (!v) return true;

                let actual: string | number | boolean | undefined;

                // 图层属性
                if (p.key === 'name') actual = n.name;
                if (p.key === 'opacity' && 'opacity' in n) actual = n.opacity;
                if (p.key === 'visible' && 'visible' in n) actual = n.visible;
                if (p.key === 'rotation' && 'rotation' in n) actual = n.rotation;

                // 位置与尺寸
                if (p.key === 'width') actual = n.width;
                if (p.key === 'height') actual = n.height;
                if (p.key === 'x') actual = n.x;
                if (p.key === 'y') actual = n.y;

                // 填充
                if (p.key === 'fillCount') actual = ('fills' in n && Array.isArray(n.fills)) ? n.fills.length : 0;
                if (p.key === 'fillOpacity') {
                    if ('fills' in n && Array.isArray(n.fills) && n.fills.length > 0 && 'opacity' in n.fills[0]) {
                        actual = n.fills[0].opacity;
                    } else {
                        actual = 0;
                    }
                }

                // 描边
                if (p.key === 'strokeCount') actual = ('strokes' in n) ? n.strokes.length : 0;
                if (p.key === 'strokeWeight') actual = ('strokeWeight' in n && typeof n.strokeWeight === 'number') ? n.strokeWeight : 0;
                if (p.key === 'strokeAlign') actual = ('strokeAlign' in n) ? n.strokeAlign : 0;

                // 文本
                if (p.key === 'characters') actual = (n.type === 'TEXT') ? n.characters : undefined;
                if (p.key === 'fontSize') actual = (n.type === 'TEXT' && 'fontSize' in n && typeof n.fontSize === 'number') ? n.fontSize : undefined;
                if (p.key === 'letterSpacing') actual = (n.type === 'TEXT' && 'letterSpacing' in n && typeof n.letterSpacing === 'number') ? n.letterSpacing : undefined;
                if (p.key === 'lineHeight') actual = (n.type === 'TEXT' && 'lineHeight' in n && n.lineHeight) ? (typeof n.lineHeight === 'number' ? n.lineHeight : undefined) : undefined;

                // AutoLayout
                if (p.key === 'itemSpacing') actual = ('itemSpacing' in n) ? n.itemSpacing : undefined;
                if (p.key === 'paddingLeft') actual = ('paddingLeft' in n) ? n.paddingLeft : undefined;
                if (p.key === 'paddingRight') actual = ('paddingRight' in n) ? n.paddingRight : undefined;
                if (p.key === 'paddingTop') actual = ('paddingTop' in n) ? n.paddingTop : undefined;
                if (p.key === 'paddingBottom') actual = ('paddingBottom' in n) ? n.paddingBottom : undefined;

                // 组件
                if (p.key === 'description') actual = ('description' in n) ? n.description : undefined;

                // 圆角
                if (p.key === 'cornerRadius') actual = ('cornerRadius' in n && typeof n.cornerRadius === 'number') ? n.cornerRadius : undefined;

                if (actual === undefined) return false;

                // 比对逻辑
                if (p.op === 'has') {
                    return String(actual).toLowerCase().includes(v.toLowerCase());
                } else {
                    const num = parseFloat(v);
                    if (isNaN(num)) return String(actual).toLowerCase() === v.toLowerCase();
                    if (typeof actual === 'number') {
                        switch (p.op) {
                            case '=': return actual === num;
                            case '!=': return actual !== num;
                            case '>': return actual > num;
                            case '<': return actual < num;
                            default: return String(actual) === v;
                        }
                    }
                    return String(actual) === v;
                }
            });
        });
    }

    if (allNodes.length > 0) {
        figma.currentPage.selection = allNodes;
        figma.notify(`Found ${allNodes.length} layers`);
    } else {
        figma.notify("No layers match the criteria");
    }
}