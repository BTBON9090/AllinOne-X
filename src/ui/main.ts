import './style.css';

// --- 类型定义 ---  
type I18nKey = 
  | 'nav_simple' | 'nav_select' | 'nav_layout' | 'nav_text' | 'nav_shape' | 'nav_effect' | 'nav_color'
  | 'btn_switch' | 'btn_lang' | 'search_ph' | 'empty_title' | 'empty_desc'
  | 'to_frame' | 'to_rect' | 'split_text' | 'join_text' | 'remove_al' | 'up_one' | 'up_all'
  | 'rename_content' | 'sort_layers' | 'ungroup_all' | 'unlock_all';

type Language = 'zh' | 'en';

type I18nDictionary = {
  [lang in Language]: {
    [key in I18nKey]: string | string[];
  };
};

interface PluginMessage {
  type: string;
  successMsg?: string;
  width?: number;
  height?: number;
}

// --- 国际化数据字典 ---  
const i18n: I18nDictionary = {
  zh: {
    nav_simple: "简易工具", nav_select: "选择工具", nav_layout: "布局工具",
    nav_text: "字体工具", nav_shape: "形状工具", nav_effect: "效果工具", nav_color: "颜色工具",
    btn_switch: "切换",
    btn_lang: "中 / En",
    search_ph: "搜索功能...",
    empty_title: "功能开发中",
    empty_desc: "敬请期待...",
    
    // 格式：key: [标题, 简介, 详细Tooltip, 成功提示]
    to_frame: ["To Frame", "形状转Frame并继承样式", "将选中的矩形/圆形等智能转换为Frame，并保留原有的填充、描边、圆角和旋转角度。", "已转换为 Frame"],
    to_rect: ["To Rectangle", "Frame扁平化为矩形", "将选中的Frame或Group降维成普通矩形，保留视觉样式的同时丢弃容器属性。", "已转换为矩形"],
    split_text: ["Split Text", "按行拆分文本 (10px间距)", "将多行文本段落按换行符拆分为独立的文本层，并自动保持 10px 的垂直间距。", "文本已拆分"],
    join_text: ["Join Text", "多行文本合并为一个", "将选中的多个文本图层按视觉位置排序，合并为一个多行文本框。", "文本已合并"],
    remove_al: ["Remove AL", "移除Auto Layout", "递归移除选中图层及其内部所有子层级的 Auto Layout 属性，恢复为普通 Frame。", "已移除自动布局"],
    up_one: ["Up One Level", "图层向上提一级", "将选中图层从当前父级中移出，放入上一级容器中。", "图层已上移"],
    up_all: ["Up All Level", "图层提至最外层", "将选中图层直接移动到页面的最顶层（Root）。", "已提至最外层"],
    rename_content: ["Rename Content", "按文本内容重命名图层", "自动将文本层或包含文本的 Frame 重命名为其内容，方便图层管理。", "图层已重命名"],
    sort_layers: ["Sort Layers", "按视觉坐标排序图层", "根据画布上的 X/Y 坐标，重新排列图层列表顺序，修复 Auto Layout 顺序错乱问题。", "图层已排序"],
    ungroup_all: ["Ungroup All", "解散内部所有组", "递归查找并解散选中元素内部所有的 Group，只保留 Frame 结构，减少层级嵌套。", "已解散内部组"],
    unlock_all: ["Unlock All", "解锁内部所有图层", "一键解锁选中元素内部所有被锁定的图层，方便批量编辑。", "已全部解锁"]
  },
  en: {
    nav_simple: "Simple", nav_select: "Select", nav_layout: "Layout",
    nav_text: "Text", nav_shape: "Shape", nav_effect: "Effect", nav_color: "Color",
    btn_switch: "Mode",
    btn_lang: "中 / En",
    search_ph: "Search...",
    empty_title: "Coming Soon",
    empty_desc: "Under development...",

    to_frame: ["To Frame", "Convert Shape to Frame", "Convert selected shapes to Frames while preserving fills, strokes, corners and rotation.", "Converted to Frame"],
    to_rect: ["To Rectangle", "Flatten Frame to Rect", "Convert Frames/Groups into simple Rectangles, preserving visual styles but removing container properties.", "Converted to Rect"],
    split_text: ["Split Text", "Split lines (10px gap)", "Split multi-line text into separate text layers per line, arranged with 10px spacing.", "Text Split"],
    join_text: ["Join Text", "Merge text layers", "Merge selected text layers into a single multi-line text box, sorted by visual position.", "Text Joined"],
    remove_al: ["Remove AL", "Remove Auto Layout", "Recursively remove Auto Layout from selected layers and all nested children.", "Auto Layout Removed"],
    up_one: ["Up One Level", "Lift layer up one level", "Move selected layers out of their current parent into the grandparent container.", "Layer Moved Up"],
    up_all: ["Up All Level", "Lift to Top Level", "Move selected layers directly to the Page root level.", "Moved to Top"],
    rename_content: ["Rename Content", "Rename to Content", "Rename layers based on their text content for better organization.", "Layers Renamed"],
    sort_layers: ["Sort Layers", "Sort by Position", "Reorder layers in the sidebar based on their visual X/Y position on the canvas.", "Layers Sorted"],
    ungroup_all: ["Ungroup All", "Ungroup all nested", "Recursively find and ungroup all Groups within selection, keeping Frames intact.", "Groups Ungrouped"],
    unlock_all: ["Unlock All", "Unlock nested layers", "Unlock all locked layers within the selection recursively.", "Unlocked All"]
  }
};

let curLang: Language = 'zh'; // 默认中文

// 初始化语言
function updateLanguage() {
  const t = i18n[curLang];
  
  // 更新导航
  document.querySelectorAll('.nav-item').forEach(el => {
    const k = el.getAttribute('data-key') as I18nKey;
    if(k && t[k] && typeof t[k] === 'string') {
      const navText = el.querySelector('.nav-text') as HTMLElement;
      if(navText) navText.innerText = t[k] as string;
    }
  });

  // 更新按钮和输入框
  const modeBtn = document.getElementById('modeBtn');
  if(modeBtn) modeBtn.innerText = t.btn_switch as string;
  
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  if(searchInput) searchInput.placeholder = t.search_ph as string;
  
  const emptyTitle = document.querySelector('[data-key="empty_title"]') as HTMLElement;
  if(emptyTitle) emptyTitle.innerText = t.empty_title as string;
  
  const emptyDesc = document.querySelector('[data-key="empty_desc"]') as HTMLElement;
  if(emptyDesc) emptyDesc.innerText = t.empty_desc as string;

  // 更新卡片内容 (标题、简介)
  document.querySelectorAll('.card').forEach(el => {
    const k = el.getAttribute('data-key') as I18nKey;
    if(k && t[k] && Array.isArray(t[k])) {
      const cardTitle = el.querySelector('.card-title');
      if(cardTitle && cardTitle.childNodes[0]) {
        cardTitle.childNodes[0].textContent = t[k][0] + " "; // 保留icon
      }
      
      const cardDesc = el.querySelector('.card-desc') as HTMLElement;
      if(cardDesc) cardDesc.innerText = t[k][1] as string;
    }
  });
}

// --- 核心逻辑 ---  
export function run(type: string) {
  // 发送消息时带上当前语言的提示文案，以便 code.ts 直接使用
  const t = i18n[curLang];
  // 找到对应 key
  const card = document.querySelector(`.card[data-key="${type.replace(/-/g, '_')}"]`);
  const key = card?.getAttribute('data-key') as I18nKey | null;
  let msg = "Done";
  
  if (key && t[key] && Array.isArray(t[key])) {
    const successMsg = t[key][3];
    if (typeof successMsg === 'string') {
      msg = successMsg;
    }
  }

  const pluginMessage: PluginMessage = { type, successMsg: msg };
  parent.postMessage({ pluginMessage }, '*'); 
}

export function switchGroup(group: string, el: HTMLElement) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  
  const toolPanel = document.getElementById('toolPanel');
  const emptyPanel = document.getElementById('emptyPanel');
  const searchBox = document.getElementById('searchInput') as HTMLInputElement;
  
  if (toolPanel && emptyPanel && searchBox) {
    const toolPanelEl = toolPanel as HTMLElement;
    const emptyPanelEl = emptyPanel as HTMLElement;
    if (group === 'simple') {
      toolPanelEl.style.display = 'grid'; 
      emptyPanelEl.style.display = 'none';
      searchBox.disabled = false;
    } else {
      toolPanelEl.style.display = 'none'; 
      emptyPanelEl.style.display = 'flex';
      searchBox.disabled = true;
    }
  }
}

export function toggleMode() {
  document.body.classList.toggle('mini-mode');
  const isMini = document.body.classList.contains('mini-mode');
  // 迷你模式下文字可能需要简化，这里复用
  
  const pluginMessage: PluginMessage = {
    type: 'resize-window',
    width: isMini ? 170 : 460,
    height: isMini ? 340 : 540
  };
  
  parent.postMessage({ pluginMessage }, '*');
}

function toggleLang() {
  curLang = curLang === 'zh' ? 'en' : 'zh';
  updateLanguage();
}

// --- 初始化函数 --- 
document.addEventListener('DOMContentLoaded', () => {
  // 初始化语言
  updateLanguage();

  // 搜索功能
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const val = target.value.toLowerCase();
      const cards = document.querySelectorAll('.card');
      
      const toolPanel = document.getElementById('toolPanel');
      if(toolPanel && toolPanel.style.display !== 'none') {
        cards.forEach(card => {
          // 搜索匹配中英文标题
          const key = card.getAttribute('data-key') as I18nKey;
          if (key && Array.isArray(i18n.zh[key]) && Array.isArray(i18n.en[key])) {
            const zhTitle = (i18n.zh[key][0] as string).toLowerCase();
            const enTitle = (i18n.en[key][0] as string).toLowerCase();
            const visible = zhTitle.includes(val) || enTitle.includes(val);
            (card as HTMLElement).style.display = visible ? 'flex' : 'none';
          }
        });
      }
    });
  }

  // --- Tooltip 悬停逻辑 --- 
  const tooltip = document.getElementById('tooltip-box');
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      // 迷你模式不显示
      if(document.body.classList.contains('mini-mode') || !tooltip) return;

      const key = card.getAttribute('data-key') as I18nKey;
      if(!key) return;
      
      // 获取详细 Tooltip 内容
      const t = i18n[curLang][key];
      const tooltipEl = tooltip as HTMLElement;
      if (Array.isArray(t) && typeof t[2] === 'string') {
        tooltipEl.innerText = t[2];
        tooltipEl.style.display = 'block';
        
        // 初始位置
        moveTooltip(e as MouseEvent);
      }
    });

    card.addEventListener('mousemove', (e) => {
      if(document.body.classList.contains('mini-mode') || !tooltip) return;
      moveTooltip(e as MouseEvent);
    });

    card.addEventListener('mouseleave', () => {
      if(tooltip) tooltip.style.display = 'none';
    });
  });

  // 绑定按钮事件
  document.querySelectorAll('.card').forEach(card => {
    const key = card.getAttribute('data-key');
    if(key) {
      // 转换key格式从snake_case到kebab-case
      const type = key.replace(/_/g, '-');
      card.addEventListener('click', () => run(type));
    }
  });

  // 绑定导航事件
  document.querySelectorAll('.nav-item').forEach(item => {
    const key = item.getAttribute('data-key');
    if(key) {
      item.addEventListener('click', () => switchGroup(key, item as HTMLElement));
    }
  });

  // 绑定语言切换事件
  const langBtn = document.getElementById('langBtn');
  if(langBtn) {
    langBtn.addEventListener('click', toggleLang);
  }

  // 绑定模式切换事件
  const modeBtn = document.getElementById('modeBtn');
  if(modeBtn) {
    modeBtn.addEventListener('click', toggleMode);
  }

  // Drag
  const handle = document.getElementById('resizeHandle');
  let isDragging = false;
  if(handle) {
    handle.onpointerdown = (e: PointerEvent) => { 
      isDragging = true; 
      handle.setPointerCapture(e.pointerId); 
    };
  }
  
  window.onmousemove = (e) => {
    if (!isDragging) return;
    
    const pluginMessage: PluginMessage = {
      type: 'resize-drag',
      width: Math.max(170, e.clientX+5),
      height: Math.max(200, e.clientY+5)
    };
    
    parent.postMessage({ pluginMessage }, '*');
  };
  
  window.onmouseup = () => { isDragging = false; };
});

function moveTooltip(e: MouseEvent) {
  const tooltip = document.getElementById('tooltip-box');
  if(!tooltip) return;
  
  // 简单的跟随鼠标，稍微偏移
  const x = e.clientX + 15; 
  const y = e.clientY + 15;
  
  // 防止溢出边界处理
  const rect = tooltip.getBoundingClientRect();
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  let finalX = x;
  let finalY = y;

  if (x + rect.width > winW) finalX = e.clientX - rect.width - 10;
  if (y + rect.height > winH) finalY = e.clientY - rect.height - 10;

  tooltip.style.left = finalX + 'px';
  tooltip.style.top = finalY + 'px';
}