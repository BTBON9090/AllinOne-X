# AllinOne Figma 插件开发指南

> 本文档旨在帮助接手开发的 AI 快速了解项目架构、设计规范和开发流程，以便高效地新增功能模块。

---

## 目录

1. [项目概况](#1-项目概况)
2. [设计系统](#2-设计系统)
3. [技术架构](#3-技术架构)
4. [核心功能模块](#4-核心功能模块)
5. [全局核心逻辑](#5-全局核心逻辑)
6. [当前开发进度](#6-当前开发进度)
7. [新增功能开发指南](#7-新增功能开发指南)
8. [通信协议与数据流](#8-通信协议与数据流)
9. [调试技巧](#9-调试技巧)
10. [重要警告与最佳实践](#10-重要警告与最佳实践)

---

## 1. 项目概况

### 1.1 项目定位

**AllinOne** 是一款面向 Figma 设计师的效率增强工具集，核心理念是"一站式解决设计工程化需求"，将高频操作、批量处理、自动化导出等功能集成在单一常驻面板中。

### 1.2 文件结构

```
AllinOne-X-20251224/
├── manifest.json      # Figma 插件配置文件
├── code.ts            # 后端逻辑 (TypeScript)
├── code.js            # 编译后的后端代码 (自动生成)
├── ui.html            # 前端界面 (单文件架构)
├── package.json       # NPM 配置
├── tsconfig.json      # TypeScript 配置
└── DEVELOPMENT_GUIDE.md  # 本文档
```

### 1.3 核心配置

```json
// manifest.json
{
  "name": "AllinOne",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "documentAccess": "dynamic-page",  // 关键：要求异步 API
  "networkAccess": { "allowedDomains": ["*"] }
}
```

**关键点**：`documentAccess: "dynamic-page"` 要求所有节点操作必须使用异步 API (`getNodeByIdAsync`)。

---

## 2. 设计系统

### 2.1 设计风格

采用**现代极简风格**，支持明暗模式切换，整体风格一致性要求严格。

#### 核心设计原则

1. **极简主义**：减少视觉噪音，突出核心功能
2. **一致性**：所有组件使用统一的设计语言
3. **响应式**：支持精简模式，侧边栏可折叠
4. **可访问性**：支持中英文切换，明暗模式

### 2.2 CSS 变量系统

所有颜色、间距、圆角、阴影均通过 CSS 变量定义，位于 `ui.html` 顶部：

```css
:root {
  /* 主色调 */
  --primary: #6366F1;
  --primary-hover: #818CF8;
  --primary-active: #4F46E5;
  --primary-light: rgba(99, 102, 241, 0.1);
  --primary-lighter: rgba(99, 102, 241, 0.05);
  
  /* 语义色 */
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #3B82F6;
  
  /* 中性色 - 亮色模式 */
  --bg-body: #F8FAFC;
  --bg-white: #FFFFFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --border: #E2E8F0;
  
  /* 布局 */
  --sidebar-w: 140px;
  --sidebar-w-mini: 56px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
}

/* 暗色模式 */
[data-theme="dark"] {
  --bg-body: #0F172A;
  --bg-white: #1E293B;
  --text-primary: #F1F5F9;
  /* ... */
}
```

### 2.3 组件样式规范

| 组件类型 | 圆角 | 内边距 | 字号 |
|---------|------|--------|------|
| 主按钮 | `var(--radius-md)` | `10px 20px` | `13px` |
| 次按钮 | `var(--radius-md)` | `8px 16px` | `12px` |
| 输入框 | `var(--radius-md)` | `10px 14px` | `13px` |
| 卡片 | `var(--radius-lg)` | `16px` | `13px` |
| 标签 | `var(--radius-sm)` | `4px 8px` | `11px` |

### 2.4 卡片主题色系统

```css
.theme-orange { background: var(--card-orange-bg); color: var(--card-orange-text); }
.theme-blue { background: var(--card-blue-bg); color: var(--card-blue-text); }
.theme-purple { background: var(--card-purple-bg); color: var(--card-purple-text); }
.theme-green { background: var(--card-green-bg); color: var(--card-green-text); }
.theme-pink { background: var(--card-pink-bg); color: var(--card-pink-text); }
```

---

## 3. 技术架构

### 3.1 技术栈

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| 后端 | TypeScript + Figma Plugin API | 直接操作 Figma 文档对象 |
| 前端 | HTML + CSS + JavaScript | 单文件架构，无框架依赖 |
| 外部库 | PptxGenJS + JSZip (内联) | PPT 生成与资源打包 |
| 构建 | NPM + TSC | 简单编译，无复杂打包 |

### 3.2 构建命令

```bash
# 编译项目
npm run build

# 实时监听编译
npm run watch
```

### 3.3 构建流程

```javascript
// package.json scripts
"build": "tsc code.ts --outFile code.js && node -e \"const fs=require('fs');const html=fs.readFileSync('ui.html','utf8');const js=fs.readFileSync('code.js','utf8');fs.writeFileSync('code.js',js.replace(/__html__/g,JSON.stringify(html)));\""
```

**流程说明**：
1. TypeScript 编译 `code.ts` → `code.js`
2. 读取 `ui.html` 内容
3. 将 `__html__` 占位符替换为 HTML 内容的 JSON 字符串

---

## 4. 核心功能模块

### 4.1 模块清单

| 模块名称 | 导航标识 | 面板 ID | 功能描述 |
|---------|---------|---------|---------|
| 简易工具 | `simple` | `toolPanel` | 形状转换、文本处理、层级操作等 |
| 超级选择 | `select` | `selectionPanel` | 高级选择、类型过滤、属性匹配 |
| 智能填充 | `smartFill` | `smartFillPanel` | 基础填充、AI 生成、自定义列表 |
| 文字替换 | `text` | `textPanel` | 查找替换、批量处理 |
| PPT Master | `ppt` | `pptPanel` | PPT 导出、资源打包 |
| 组件清洗 | `refiner` | `refinerPanel` | 命名规范检查、变体处理 |
| 时空信标 | `jumpback` | `jumpbackPanel` | 视角锚点、跨页传送 |
| 等轴形变 | `skew` | `skewPanel` | 图形变换、预设管理 |
| 语言切换 | `i18n` | `i18nPanel` | 多语言变量转换、AI 翻译 |
| 设计理论 | `theory` | `theoryPanel` | 设计知识库 |
| 设置 | - | `settingsPanel` | 语言、主题、AI 配置 |

### 4.2 导航映射关系

```javascript
const map = {
  'simple': ['toolPanel'],
  'select': ['selectionPanel', 'selectionFooter'],
  'text': ['textPanel'],
  'ppt': ['pptPanel'],
  'smartFill': ['smartFillPanel'],
  'refiner': ['refinerPanel'],
  'theory': ['theoryPanel'],
  'jumpback': ['jumpbackPanel'],
  'skew': ['skewPanel'],
  'i18n': ['i18nPanel']
};
```

### 4.3 后端消息类型

```typescript
// 存储相关
'save-storage'      // 保存数据到 ClientStorage
'load-storage'      // 从 ClientStorage 加载数据
'req-ai-config'     // 请求 AI 配置

// 简易工具
'to-frame'          // 形状转 Frame
'to-rect'           // Frame 转矩形
'split-text'        // 拆分文本
'join-text'         // 合并文本
'remove-al'         // 移除自动布局
'add-al-wrapper'    // 添加 AL 外套
'up-one'            // 提升一级
'up-all'            // 提升到顶层
'ungroup-all'       // 解组全部
'unlock-all'        // 解锁全部
'swap-fs'           // 互换填充描边
'reset-image'       // 重置图片比例
'sort-layers'       // 视觉排序
'rename-content'    // 重命名为内容
'detach-all'        // 解绑实例
'remove-hidden'     // 清除隐藏
'pixel-perfect'     // 像素对齐
'swap-positions'    // 交换位置

// 智能填充
'get-selection-count'  // 获取选中数量
'smart-fill'           // 执行填充
'ai-generate'          // AI 生成

// 文字替换
'text-find-matches'    // 查找文本
'text-replace'         // 替换文本

// PPT 导出
'ppt-step-*'           // PPT 各步骤

// 组件清洗
'lint-variants'        // 检查命名
'fix-variants'         // 修复命名

// 时空信标
'jb-save'              // 保存锚点
'jb-jump'              // 跳转锚点
'jb-delete'            // 删除锚点
'jb-rename'            // 重命名锚点

// 等轴形变
'req-skew-presets'     // 请求预设
'save-skew-preset'     // 保存预设

// 语言切换 (i18n)
'i18n-detect'          // 检测文本节点
'i18n-bind-variables'  // 绑定翻译变量

// 网络
'do-fetch'             // 代理网络请求
```

---

## 5. 全局核心逻辑

### 5.1 国际化机制 (i18n)

#### 数据结构

```javascript
const i18n = {
  zh: {
    nav_simple: "简易工具",
    nav_select: "超级选择",
    // ... 所有中文文本
  },
  en: {
    nav_simple: "Simple Tools",
    nav_select: "Selection",
    // ... 所有英文文本
  }
};
```

#### 使用方式

**HTML 中使用**：
```html
<span data-key="nav_simple">简易工具</span>
```

**JavaScript 更新**：
```javascript
function updateLanguage() {
  const t = i18n[curLang];
  
  // 通用更新
  document.querySelectorAll('[data-key]').forEach(el => {
    const k = el.getAttribute('data-key');
    if (t[k]) {
      if (el.tagName === 'INPUT') {
        el.placeholder = t[k];
      } else {
        el.innerText = t[k];
      }
    }
  });
  
  // 导航项特殊处理（保留 SVG 图标）
  document.querySelectorAll('.nav-item').forEach(el => {
    const txtSpan = el.querySelector('.nav-text');
    if (txtSpan) txtSpan.innerText = t[k];
  });
}
```

#### 添加新文本

1. 在 `i18n.zh` 中添加中文文本
2. 在 `i18n.en` 中添加对应英文
3. 在 HTML 元素上添加 `data-key="your_key"`

### 5.2 消息通信机制

#### 前端发送消息

```javascript
function postMsg(type, data = {}) {
  parent.postMessage({ pluginMessage: { type, ...data } }, '*');
}

// 使用示例
postMsg('to-frame');
postMsg('save-storage', { key: 'my_data', value: { foo: 'bar' } });
```

#### 后端接收消息

```typescript
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'your-action':
      // 处理逻辑
      figma.ui.postMessage({ type: 'response', data: result });
      break;
  }
};
```

#### 前端接收消息

```javascript
window.addEventListener('message', (event) => {
  const msg = event.data.pluginMessage;
  if (msg && msg.type === 'response') {
    // 处理响应
  }
});
```

### 5.3 缓存系统

#### 内存缓存 (MemoryCache)

```javascript
const MemoryCache = {
  _data: {},
  get(key) { return this._data[key]; },
  set(key, value) { this._data[key] = value; return value; },
  has(key) { return key in this._data; },
  remove(key) { delete this._data[key]; },
  clear() { this._data = {}; }
};
```

#### 持久化缓存 (PersistentCache)

```javascript
const PersistentCache = {
  prefix: 'allinone_',
  get(key) {
    const data = localStorage.getItem(this.prefix + key);
    return data ? JSON.parse(data) : null;
  },
  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
    return value;
  }
};
```

#### 后端存储 (ClientStorage)

```typescript
// 保存
await figma.clientStorage.setAsync('key', value);

// 读取
const value = await figma.clientStorage.getAsync('key');
```

### 5.4 主题切换

```javascript
function changeTheme(theme) {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  PersistentCache.set('user_theme', theme);
}
```

### 5.5 精简模式

```javascript
function toggleMode() {
  document.body.classList.toggle('mini-mode');
  const isMini = document.body.classList.contains('mini-mode');
  // CSS 会自动处理样式变化
}
```

---

## 6. 当前开发进度

### 6.1 已完成功能

| 模块 | 状态 | 备注 |
|-----|------|------|
| 简易工具 | ✅ 完成 | 16+ 工具函数 |
| 超级选择 | ✅ 完成 | 高级过滤、属性匹配 |
| 智能填充 | ✅ 完成 | 基础填充、AI 生成、自定义列表 |
| 文字替换 | ✅ 完成 | 查找替换、高亮预览 |
| PPT Master | ✅ 完成 | 完整导出流程 |
| 组件清洗 | ✅ 完成 | 命名检查、目标类型多选 |
| 时空信标 | ✅ 完成 | 视角锚点、跨页传送 |
| 等轴形变 | ✅ 完成 | 图形变换、预设管理 |
| 语言切换 | ✅ 完成 | 多语言变量转换、AI 翻译 |
| 设计理论 | ✅ 完成 | 知识库展示 |
| 设置面板 | ✅ 完成 | 语言、主题、AI 配置统一管理 |

### 6.2 近期更新

- **语言切换模块**：新增多语言变量转换功能，支持 AI 翻译并自动绑定 Figma 变量
- **设置面板重构**：将语言切换、主题切换、AI 模型配置统一到设置面板
- **智能检查目标类型**：新增组件名、属性名、属性值多选功能
- **文本拼合修复**：修复了合并后遗留原始第一行的问题

### 6.3 语言切换模块 (i18n) 详细说明

#### 功能概述

语言切换模块是一个强大的多语言变量转换工具，支持将 Figma 文档中的文本节点自动提取、翻译并绑定到 Figma 变量系统，实现一键多语言切换。

#### 核心功能

| 功能 | 说明 |
|-----|------|
| 文本检测 | 支持选中节点或当前页面两种检测范围 |
| 文本去重 | 自动聚合相同文本，减少翻译工作量 |
| AI 翻译 | 调用 OpenAI/DeepSeek 等 API 自动翻译 |
| 翻译校验 | 提供校验界面，支持手动修改译文 |
| 变量绑定 | 自动创建 Figma 变量并绑定到文本节点 |
| Mode 管理 | 支持更新已有语言 Mode 或创建新语言 Mode |

#### 工作流程

```
1. 选择检测范围（选中节点 / 当前页面）
      ↓
2. 点击"检测文本"按钮
      ↓
3. 显示检测结果（节点数、词条数）
      ↓
4. 配置翻译选项（操作模式、目标语言、变量合集名）
      ↓
5. 点击"开始提取并翻译"
      ↓
6. AI 翻译完成，进入校验界面
      ↓
7. 手动修改译文（可选）
      ↓
8. 点击"确认并绑定 Figma 变量"
      ↓
9. 自动创建变量并绑定到文本节点
```

#### 前端状态管理

```javascript
let i18nState = {
    scope: 'selection',           // 检测范围: 'selection' | 'page'
    action: 'update',             // 操作模式: 'update' | 'create'
    extractedTexts: [],           // 提取的文本列表
    existingModes: [],            // 已有的语言 Mode 列表
    finalTranslations: []         // 最终翻译结果
};
```

#### 后端消息类型

| 消息类型 | 方向 | 说明 |
|---------|------|------|
| `i18n-detect` | 前端 → 后端 | 检测文本节点 |
| `i18n-detect-result` | 后端 → 前端 | 返回检测结果 |
| `i18n-bind-variables` | 前端 → 后端 | 绑定翻译变量 |
| `i18n-bind-success` | 后端 → 前端 | 绑定完成通知 |

#### Figma 变量系统

语言切换模块使用 Figma 的 Variable Collections 和 Modes 实现多语言：

- **Collection**: 默认名称为 `🌐 i18n Dictionary`
- **Mode**: 每种语言对应一个 Mode（如 `English`、`简体中文`）
- **Variable**: 每个唯一文本对应一个 STRING 类型变量
- **绑定**: 文本节点的 `characters` 属性绑定到对应变量

#### 注意事项

1. **字体加载**: 绑定变量前必须调用 `figma.loadFontAsync()` 加载字体
2. **混合样式**: 具有混合字体样式的文本节点无法绑定变量
3. **缺少字体**: `hasMissingFont` 为 true 的节点会被跳过
4. **AI 配置**: 翻译功能依赖设置面板中的 AI Key 和 Model 配置

---

## 7. 新增功能开发指南

### 7.1 添加新的导航菜单

#### 步骤 1：添加侧边栏导航项

在 `ui.html` 的 `.nav-scroll` 容器中添加：

```html
<div class="nav-item" onclick="switchGroup('yourModule', this)" data-key="nav_your_module">
  <svg class="nav-icon" viewBox="0 0 24 24">
    <!-- 你的 SVG 图标 -->
  </svg>
  <span class="nav-text">你的模块</span>
</div>
```

#### 步骤 2：添加面板 HTML

在 `ui.html` 的 `.content-scroll` 容器中添加：

```html
<div id="yourModulePanel" style="display: none;">
  <!-- 你的面板内容 -->
</div>
```

#### 步骤 3：更新导航映射

在 `switchGroup` 函数中更新：

```javascript
const ids = [
  // ... 现有 ID
  'yourModulePanel'
];

const map = {
  // ... 现有映射
  'yourModule': ['yourModulePanel']
};
```

#### 步骤 4：添加国际化文本

```javascript
// zh
nav_your_module: "你的模块",

// en
nav_your_module: "Your Module",
```

### 7.2 添加新的后端功能

#### 步骤 1：定义消息类型

在 `code.ts` 的 `switch` 语句中添加新的 case：

```typescript
case 'your-action': {
  // 1. 参数验证
  if (selection.length === 0) {
    figma.notify("请选择图层");
    return;
  }
  
  // 2. 核心逻辑
  const result = [];
  for (const node of selection) {
    // 处理每个节点
  }
  
  // 3. 更新选中项（如需要）
  figma.currentPage.selection = newSelection;
  
  // 4. 发送结果到前端
  figma.ui.postMessage({ type: 'your-action-result', data: result });
  
  // 5. 通知用户
  figma.notify("操作完成");
  break;
}
```

#### 步骤 2：前端调用

```javascript
function doYourAction() {
  postMsg('your-action', { param: value });
}

// 监听结果
window.addEventListener('message', (event) => {
  const msg = event.data.pluginMessage;
  if (msg && msg.type === 'your-action-result') {
    // 处理结果
  }
});
```

### 7.3 添加新的设置项

在 `settingsPanel` 中添加新的设置项：

```html
<div class="settings-item">
  <div class="settings-item-label" data-key="settings_your_option">你的选项</div>
  <div class="settings-item-control">
    <select id="settingsYourOption" class="search-box" onchange="changeYourOption(this.value)">
      <option value="a">选项 A</option>
      <option value="b">选项 B</option>
    </select>
  </div>
</div>
```

### 7.4 添加新的卡片工具

在 `toolPanel` 中添加：

```html
<div class="card theme-orange" onclick="run('your-tool')" data-key="your_tool">
  <div class="card-title">🛠️ Your Tool</div>
</div>
```

添加国际化：

```javascript
// zh
your_tool: ["🛠️ 你的工具", "工具描述"],

// en
your_tool: ["🛠️ Your Tool", "Tool description"],
```

---

## 8. 通信协议与数据流

### 8.1 消息格式规范

**前端 → 后端**：
```javascript
{
  pluginMessage: {
    type: 'action-type',      // 必需：消息类型
    // ... 其他参数
  }
}
```

**后端 → 前端**：
```javascript
{
  type: 'response-type',      // 必需：响应类型
  data: { /* 数据 */ }        // 可选：响应数据
}
```

### 8.2 数据字段一致性

| 数据类型 | 前端字段 | 后端字段 | 说明 |
|---------|---------|---------|------|
| 节点 ID | `id` | `node.id` | Figma 节点唯一标识 |
| 节点名称 | `name` | `node.name` | 图层名称 |
| 节点类型 | `type` | `node.type` | FRAME, TEXT, etc. |
| 位置 | `x`, `y` | `node.x`, `node.y` | 绝对坐标 |
| 尺寸 | `width`, `height` | `node.width`, `node.height` | 宽高 |

### 8.3 数据流向图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (ui.html)                        │
├─────────────────────────────────────────────────────────────┤
│  用户交互 → postMsg() → parent.postMessage()                │
│                                                              │
│  window.addEventListener('message') ← 接收响应               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ pluginMessage
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     后端 (code.ts)                           │
├─────────────────────────────────────────────────────────────┤
│  figma.ui.onmessage → switch(msg.type) → 处理逻辑           │
│                                                              │
│  figma.ui.postMessage() → 发送响应                           │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 网络请求代理

由于 Figma 插件前端存在跨域限制，网络请求需要通过后端代理：

```javascript
// 前端发起请求
async function fetchApi(url, options) {
  const reqId = Date.now().toString();
  postMsg('do-fetch', { url, options, reqId });
  
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'api-response' && msg.reqId === reqId) {
        window.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.data);
      }
    };
    window.addEventListener('message', handler);
  });
}

// 后端处理
if (msg.type === 'do-fetch') {
  try {
    const res = await fetch(msg.url, msg.options);
    const json = await res.json();
    figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, data: json });
  } catch (e) {
    figma.ui.postMessage({ type: 'api-response', reqId: msg.reqId, error: e.message });
  }
}
```

---

## 9. 调试技巧

### 9.1 控制台日志

**前端调试**：
```javascript
console.log("【前端】调试信息:", data);
```

**后端调试**：
```typescript
console.log("【后端】收到消息:", msg.type);
```

在 Figma 中打开开发者工具：`Plugins > Development > Open Console`

### 9.2 消息追踪

在关键位置添加日志：

```javascript
// 前端发送
function postMsg(type, data = {}) {
  console.log("【发送】", type, data);
  parent.postMessage({ pluginMessage: { type, ...data } }, '*');
}

// 后端接收
figma.ui.onmessage = async (msg) => {
  console.log("【接收】", msg.type, msg);
  // ...
};
```

### 9.3 异步操作调试

```typescript
case 'async-action': {
  console.log("开始异步操作");
  try {
    const node = await figma.getNodeByIdAsync(id);
    console.log("获取节点成功:", node.name);
  } catch (e) {
    console.error("异步操作失败:", e);
  }
  break;
}
```

### 9.4 UI 状态检查

```javascript
// 检查面板显示状态
console.log("当前面板:", 
  Array.from(document.querySelectorAll('[id$="Panel"]'))
    .filter(el => el.style.display !== 'none')
    .map(el => el.id)
);

// 检查当前语言
console.log("当前语言:", curLang);

// 检查缓存数据
console.log("内存缓存:", MemoryCache._data);
console.log("持久化缓存:", localStorage);
```

### 9.5 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|-----|---------|---------|
| 消息无响应 | 消息类型拼写错误 | 检查 `msg.type` 是否匹配 |
| 节点操作失败 | 未使用异步 API | 改用 `getNodeByIdAsync` |
| UI 不更新 | 语言 key 缺失 | 检查 `data-key` 和 i18n |
| 样式不生效 | CSS 变量未定义 | 检查 `:root` 变量 |
| 数据丢失 | 未正确存储 | 检查 `ClientStorage` |

---

## 10. 重要警告与最佳实践

### 10.1 ⚠️ 关键警告

#### 异步 API 强制要求

```typescript
// ❌ 错误：同步 API 在 dynamic-page 模式下不可用
const node = figma.getNodeById(id);

// ✅ 正确：必须使用异步 API
const node = await figma.getNodeByIdAsync(id);
```

#### 消息监听单例

```javascript
// ❌ 错误：会导致消息重复触发
window.addEventListener('message', handler);

// ✅ 正确：使用覆盖式写法或确保只注册一次
window.onmessage = (event) => { /* ... */ };
```

#### 导航项文本更新

```javascript
// ❌ 错误：会覆盖 SVG 图标
navItem.innerText = newText;

// ✅ 正确：只更新文本 span
navItem.querySelector('.nav-text').innerText = newText;
```

#### 面板显示属性

```javascript
// ❌ 错误：部分面板需要 flex 布局
panel.style.display = 'block';

// ✅ 正确：根据面板类型设置
if (['refinerPanel', 'theoryPanel', 'smartFillPanel', 'textPanel'].includes(id)) {
  panel.style.display = 'flex';
} else {
  panel.style.display = 'grid'; // 或 'block'
}
```

### 10.2 最佳实践

#### 代码组织

1. **前端**：按功能区域组织，使用清晰的注释分隔
2. **后端**：使用 `switch-case` 路由，每个 case 保持简洁
3. **样式**：使用 CSS 变量，避免硬编码颜色值

#### 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 消息类型 | kebab-case | `get-selection-count` |
| 函数名 | camelCase | `switchGroup` |
| CSS 类 | kebab-case | `.nav-item` |
| 变量 | camelCase | `curLang` |
| 常量 | UPPER_SNAKE_CASE | `AI_DEFAULTS` |

#### 性能优化

1. **减少 DOM 操作**：批量更新，使用文档片段
2. **避免重复查询**：缓存查询结果
3. **合理使用缓存**：频繁数据存入 `MemoryCache`
4. **异步处理**：耗时操作使用 `setTimeout` 分片

#### 用户体验

1. **加载状态**：耗时操作显示 loading
2. **错误提示**：使用 `figma.notify()` 提示用户
3. **操作确认**：危险操作需要确认
4. **快捷键支持**：常用功能支持快捷键

### 10.3 代码质量检查清单

- [ ] 所有异步操作使用 `await`
- [ ] 国际化文本完整（中英文）
- [ ] CSS 使用变量而非硬编码
- [ ] 错误处理完善
- [ ] 用户提示友好
- [ ] 无 console 残留（生产环境）
- [ ] 代码注释清晰

---

## 附录：快速参考

### A. 常用函数

```javascript
// 发送消息
postMsg(type, data)

// 切换导航
switchGroup(group, el)

// 更新语言
updateLanguage()

// 切换主题
changeTheme(theme)

// 切换精简模式
toggleMode()

// 打开设置
openSettings()

// 打开子页面
openSubPage(pageId)

// 关闭子页面
closeSubPage(pageId)
```

### B. 常用 CSS 类

```css
.nav-item          /* 导航项 */
.nav-icon          /* 导航图标 */
.nav-text          /* 导航文本 */
.card              /* 工具卡片 */
.primary-btn       /* 主按钮 */
.search-box        /* 输入框 */
.config-label      /* 配置标签 */
.config-group      /* 配置组 */
.sub-page          /* 子页面 */
.sub-header        /* 子页面头部 */
.settings-section  /* 设置区块 */
.settings-item     /* 设置项 */
```

### C. 文件位置快速索引

| 内容 | 文件 | 行号范围 |
|-----|------|---------|
| CSS 变量 | ui.html | 1-200 |
| 侧边栏 | ui.html | 2480-2580 |
| 主内容区 | ui.html | 2580-3630 |
| 设置面板 | ui.html | 3537-3620 |
| 国际化 | ui.html | 3700-4700 |
| 核心函数 | ui.html | 4700-5100 |
| 后端路由 | code.ts | 70-1850 |

---

> 📝 **文档维护**：当添加新功能或修改架构时，请同步更新本文档。
> 
> 🔄 **最后更新**：2026-04-16
