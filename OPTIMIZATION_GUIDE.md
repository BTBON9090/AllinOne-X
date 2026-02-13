# AllinOne 插件优化开发指南

> 本文档基于项目现状，对优化需求进行难易程度分析和优先级排序，指导后续开发工作。
> 
> **最后更新：2024-02-13**

---

## 📋 优化项目总览

| 序号 | 优化项目 | 难度 | 预计工时 | 优先级 | 状态 | 依赖关系 |
|:----:|----------|:----:|:--------:|:------:|:----:|----------|
| 1 | 减少 DOM 节点数量 | ⭐ | 2-4h | P0 | ✅ 已完成 | 无 |
| 2 | 缓存常用数据 | ⭐ | 2-4h | P0 | ✅ 已完成 | 无 |
| 3 | 添加全局错误捕获 | ⭐⭐ | 4-6h | P1 | ✅ 已完成 | 无 |
| 4 | 友好的错误提示界面 | ⭐⭐ | 4-6h | P1 | ✅ 已完成 | 无 |
| 5 | 日期、数字格式本地化 | ⭐⭐ | 4-6h | P1 | ✅ 已完成 | 无 |
| 6 | 支持更多一键填充类型 | ⭐⭐⭐ | 8-12h | P1 | 待开始 | 无 |
| 7 | 提取可复用的 UI 组件 | ⭐⭐⭐ | 12-16h | P2 | 待开始 | 无 |
| 8 | 添加类型定义 | ⭐⭐⭐ | 16-24h | P2 | 待开始 | 无 |
| 9 | 将各功能模块拆分为独立文件 | ⭐⭐⭐⭐ | 16-24h | P2 | 待开始 | 依赖 #7, #8 |
| 10 | 按需加载，减少初始加载时间 | ⭐⭐⭐⭐ | 12-16h | P2 | 待开始 | 依赖 #9 |
| 11 | 使用现代前端框架 | ⭐⭐⭐⭐⭐ | 40-60h | P3 | 待开始 | 依赖 #7, #8, #9 |
| 12 | 为核心功能添加单元测试 | ⭐⭐⭐⭐ | 16-24h | P3 | 待开始 | 依赖 #8 |
| 13 | 错误日志上报 | ⭐⭐ | 4-8h | P4 | 待开始 | 依赖 #3 |

---

## 🎯 优先级说明

### P0 - 立即执行（低难度，高收益）✅ 已完成

这些项目难度低、收益明显，已于 2024-02-13 完成实施。

#### 1. 减少 DOM 节点数量 ✅

**难度：** ⭐ (简单)  
**工时：** 已完成  
**收益：** 提升渲染性能，减少内存占用

**已完成的优化：**
- [x] 移除 20 个无用的 `.card-desc` 空元素
- [x] 删除对应的 CSS 样式定义
- [x] 清理冗余注释

**效果：** DOM 节点减少约 20 个，CSS 代码减少约 6 行

---

#### 2. 缓存常用数据 ✅

**难度：** ⭐ (简单)  
**工时：** 已完成  
**收益：** 减少重复计算，提升响应速度

**已实现的缓存系统：**

1. **MemoryCache（内存缓存）**
   - 用于临时数据存储
   - 页面刷新后清空

2. **PersistentCache（持久化缓存）**
   - 基于 localStorage 实现
   - 自动添加前缀避免冲突
   - 支持错误处理

**已应用的缓存场景：**
- [x] 用户语言设置 (`user_lang`)
- [x] 用户主题设置 (`user_theme`)
- [x] 查找历史记录 (`find_history`)

**代码示例：**
```javascript
// 获取缓存值
const lang = PersistentCache.get('user_lang') || 'zh';

// 设置缓存值
PersistentCache.set('user_theme', 'dark');

// 获取查找历史
const history = getFindHistory(); // 返回最近 10 条记录
```
- [ ] 合并重复的样式容器
- [ ] 使用 CSS 变量减少内联样式

**验收标准：**
- DOM 节点数量减少 20% 以上
- 页面渲染时间缩短
- 所有功能正常运行

---

#### 2. 缓存常用数据

**难度：** ⭐ (简单)  
**工时：** 2-4 小时  
**收益：** 减少重复计算，提升响应速度

**实施步骤：**
```
1. 识别需要缓存的数据类型
2. 设计缓存策略（内存缓存 / localStorage）
3. 实现缓存读写逻辑
4. 添加缓存失效机制
5. 测试缓存效果
```

**需要缓存的数据：**

| 数据类型 | 缓存位置 | 失效条件 |
|----------|----------|----------|
| 设计理论内容 | 内存 | 切换语言时 |
| 用户配置 | localStorage | 用户修改时 |
| 本地样式列表 | 内存 | 刷新页面时 |
| i18n 翻译文件 | 内存 | 切换语言时 |
| 查找替换历史 | localStorage | 手动清除 |

**代码示例：**
```javascript
// 简单内存缓存
const cache = {
  designTheory: null,
  localStyles: null,
  
  get(key) {
    return this[key];
  },
  
  set(key, value) {
    this[key] = value;
  },
  
  clear(key) {
    this[key] = null;
  }
};

// localStorage 持久化缓存
const persistentCache = {
  get(key) {
    const data = localStorage.getItem(`cache_${key}`);
    return data ? JSON.parse(data) : null;
  },
  
  set(key, value) {
    localStorage.setItem(`cache_${key}`, JSON.stringify(value));
  }
};
```

**验收标准：**
- 重复访问相同数据时无需重新获取
- 页面刷新后持久化数据仍然存在
- 缓存数据与实际数据一致性

---

### P1 - 短期执行（中等难度，明显收益）✅ 已完成

这些项目有一定难度，但收益明显，已于 2024-02-13 完成实施。

#### 3. 添加全局错误捕获 ✅

**难度：** ⭐⭐ (中等)  
**工时：** 已完成  
**收益：** 提升稳定性，便于问题排查

**已实现功能：**

```javascript
const ErrorHandler = {
  errors: [],           // 错误记录数组
  maxErrors: 50,        // 最大记录数
  
  init() {
    // 捕获同步错误
    window.onerror = (msg, url, line, col, error) => {...};
    
    // 捕获 Promise 未处理拒绝
    window.addEventListener('unhandledrejection', ...);
    
    // 捕获资源加载错误
    window.addEventListener('error', ..., true);
  },
  
  handleError(error) {...},
  getErrors() {...},
  clearErrors() {...}
};
```

**效果：**
- 自动捕获所有 JavaScript 错误
- 记录错误详情（类型、消息、位置、堆栈）
- 最多保留 50 条错误记录

---

#### 4. 友好的错误提示界面 ✅

**难度：** ⭐⭐ (中等)  
**工时：** 已完成  
**收益：** 提升用户体验，避免用户困惑

**已实现功能：**

1. **Error Toast 组件**
   - 底部居中显示
   - 红色背景 + 白色文字
   - 自动 4 秒后消失
   - 支持手动关闭

2. **CSS 样式**
   - 滑入动画效果
   - 响应式最大宽度
   - 高层级 z-index (10000)

3. **JavaScript 函数**
   - `showErrorToast(message, duration)` - 显示错误
   - `hideErrorToast()` - 隐藏错误

**效果：**
- 错误发生时用户能立即看到提示
- 不影响正常操作流程

---

#### 5. 日期、数字格式本地化 ✅

**难度：** ⭐⭐ (中等)  
**工时：** 已完成  
**收益：** 支持国际化，提升用户体验

**已添加的英文日期格式：**

| 显示示例 | 格式代码 | 说明 |
|----------|----------|------|
| Oct 1, 2023 | MMM D, YYYY | 美式短月份 |
| October 1, 2023 | MMMM D, YYYY | 美式全月份 |
| 1 Oct 2023 | D MMM YYYY | 英式短月份 |
| 01/10/2023 | DD/MM/YYYY | 欧式日期 |
| 10/01/2023 | MM/DD/YYYY | 美式日期 |

**格式化逻辑更新：**
```javascript
const monthNames = ['January','February',...];
const monthShort = ['Jan','Feb',...];

// 支持的占位符：
// YYYY - 四位年份
// MM   - 两位月份
// DD   - 两位日期
// D    - 不补零日期
// MMM  - 短月份名
// MMMM - 全月份名
```

---

### P1 - 待执行项目
```
1. 实现 window.onerror 全局捕获
2. 实现 unhandledrejection 捕获 Promise 错误
3. 实现 try-catch 包装关键函数
4. 设计错误信息格式
5. 添加开发环境调试信息
```

**代码框架：**
```javascript
// 全局错误处理器
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // 捕获同步错误
    window.onerror = (msg, url, line, col, error) => {
      this.handleError({
        type: 'sync',
        message: msg,
        source: url,
        line,
        col,
        stack: error?.stack
      });
      return true; // 阻止默认错误提示
    };
    
    // 捕获 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
      });
    });
  }
  
  handleError(error) {
    console.error('[Error]', error);
    // 显示友好错误提示
    this.showErrorToast(error.message);
    // 可选：上报错误日志
    // this.reportError(error);
  }
  
  showErrorToast(message) {
    // 显示错误提示 UI
  }
}

new ErrorHandler();
```

**验收标准：**
- 所有未捕获错误都能被记录
- 用户看到友好的错误提示
- 控制台输出详细错误信息

---

#### 4. 友好的错误提示界面

**难度：** ⭐⭐ (中等)  
**工时：** 4-6 小时  
**收益：** 提升用户体验

**UI 设计：**
```
┌─────────────────────────────────────┐
│  ⚠️ 操作失败                         │
│                                     │
│  抱歉，操作遇到了一些问题。          │
│  请稍后重试或联系支持团队。          │
│                                     │
│  [重试]  [查看详情]  [关闭]          │
└─────────────────────────────────────┘
```

**实施步骤：**
```
1. 设计错误提示组件样式
2. 实现错误提示显示/隐藏逻辑
3. 添加错误类型分类（网络错误、参数错误等）
4. 实现错误详情展开功能
5. 添加重试机制
```

**验收标准：**
- 错误提示样式与整体 UI 一致
- 支持中英文错误信息
- 提供可操作的解决方案

---

#### 5. 日期、数字格式本地化

**难度：** ⭐⭐ (中等)  
**工时：** 4-6 小时  
**收益：** 提升国际化体验

**实施步骤：**
```
1. 使用 Intl API 实现格式化
2. 创建格式化工具函数
3. 替换现有硬编码格式
4. 添加语言切换自动更新
5. 测试各语言显示效果
```

**代码示例：**
```javascript
// 日期格式化
function formatDate(date, locale = 'zh') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// 示例输出
formatDate(new Date(), 'zh'); // 2024年2月13日
formatDate(new Date(), 'en'); // February 13, 2024

// 数字格式化
function formatNumber(num, locale = 'zh') {
  return new Intl.NumberFormat(locale).format(num);
}

// 示例输出
formatNumber(1234567, 'zh'); // 1,234,567
formatNumber(1234567, 'en'); // 1,234,567

// 货币格式化
function formatCurrency(amount, locale = 'zh', currency = 'CNY') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// 示例输出
formatCurrency(99.99, 'zh'); // ¥99.99
formatCurrency(99.99, 'en', 'USD'); // $99.99
```

**验收标准：**
- 日期格式根据语言自动调整
- 数字格式符合本地习惯
- 货币符号正确显示

---

#### 6. 支持更多一键填充类型

**难度：** ⭐⭐⭐ (中等偏高)  
**工时：** 8-12 小时  
**收益：** 大幅提升设计效率

**功能规划：**

```
┌─────────────────────────────────────┐
│  智能填充                            │
├─────────────────────────────────────┤
│  填充类型：                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 纯色 │ │ 渐变 │ │ 图片 │ │ 图案 │   │
│  └──✓──┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ────────────────────────────────   │
│  【纯色填充】                        │
│  颜色：[#6366F1        ] [取色器]   │
│  透明度：[100%         ]            │
│                                     │
│  【渐变填充】（点击渐变卡片后显示）   │
│  类型：○ 线性  ○ 径向  ○ 角度       │
│  角度：[  45°  ]                     │
│  色标：                              │
│    ●────────────●────────────●      │
│   #FF0000       #00FF00     #0000FF │
│  [+ 添加色标]                        │
│                                     │
│  【图片填充】                        │
│  来源：○ 上传图片  ○ 网络图片       │
│  [选择文件...]                       │
│  适配：○ 填充  ○ 适应  ○ 平铺       │
│                                     │
│  【图案填充】                        │
│  预设图案：                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │网格│ │圆点│ │斜线│ │波浪│       │
│  └────┘ └────┘ └────┘ └────┘       │
│  大小：[  20px  ]                   │
│  间距：[  10px  ]                   │
│                                     │
│  [应用到选中图层]                    │
└─────────────────────────────────────┘
```

**实施步骤：**
```
Phase 1: 纯色填充增强 (2h)
├── 添加透明度控制
├── 添加取色器组件
└── 优化颜色输入体验

Phase 2: 渐变填充 (4h)
├── 设计渐变编辑器 UI
├── 实现色标拖拽功能
├── 支持线性/径向/角度渐变
└── 渐变预览实时更新

Phase 3: 图片填充 (3h)
├── 支持本地上传
├── 支持网络图片 URL
├── 实现填充/适应/平铺模式
└── 图片预览功能

Phase 4: 图案填充 (3h)
├── 设计预设图案库
├── 支持自定义 SVG 图案
├── 大小/间距/颜色调整
└── 图案预览功能
```

**技术要点：**
```javascript
// 渐变填充
figma.createPaint({
  type: 'GRADIENT_LINEAR',
  gradientStops: [
    { position: 0, color: { r: 1, g: 0, b: 0, a: 1 } },
    { position: 1, color: { r: 0, g: 0, b: 1, a: 1 } }
  ],
  gradientHandlePositions: [
    { x: 0, y: 0.5 },
    { x: 1, y: 0.5 }
  ]
});

// 图片填充
const image = figma.createImage(imageData);
figma.createPaint({
  type: 'IMAGE',
  imageHash: image.hash,
  scaleMode: 'FILL' // FILL | FIT | TILE | CROP
});
```

**验收标准：**
- 支持纯色、渐变、图片、图案四种填充类型
- 渐变编辑器可拖拽调整色标
- 图片支持上传和 URL 两种方式
- 图案提供至少 8 种预设

---

### P2 - 中期执行（较高难度，长期收益）

这些项目难度较高，需要较多时间，但能带来长期收益。

#### 7. 提取可复用的 UI 组件

**难度：** ⭐⭐⭐ (中等偏高)  
**工时：** 12-16 小时  
**收益：** 提高代码复用性，便于维护

**组件清单：**

| 组件名 | 功能 | 使用场景 |
|--------|------|----------|
| Button | 按钮 | 确认、取消、操作按钮 |
| Input | 输入框 | 文本输入、搜索框 |
| Card | 卡片 | 功能卡片、信息卡片 |
| Checkbox | 复选框 | 多选、全选 |
| Radio | 单选框 | 单选选项 |
| Select | 下拉选择 | 下拉菜单 |
| Toast | 提示 | 成功/错误提示 |
| Modal | 弹窗 | 确认弹窗、设置弹窗 |
| Tabs | 标签页 | 功能切换 |
| Tooltip | 提示框 | 悬停提示 |

**组件结构示例：**
```javascript
// components/Button.js
function Button({ 
  text, 
  type = 'primary', // primary | secondary | danger
  size = 'medium',  // small | medium | large
  disabled = false,
  loading = false,
  onClick 
}) {
  const button = document.createElement('button');
  button.className = `btn btn-${type} btn-${size}`;
  button.disabled = disabled || loading;
  button.innerHTML = loading 
    ? '<span class="spinner"></span>' + text 
    : text;
  button.onclick = onClick;
  return button;
}

// 使用示例
const submitBtn = Button({
  text: '提交',
  type: 'primary',
  onClick: () => handleSubmit()
});
container.appendChild(submitBtn);
```

**实施步骤：**
```
1. 分析现有 UI，识别可复用组件
2. 设计组件 API（props、events）
3. 实现组件基础功能
4. 添加组件样式
5. 编写组件文档
6. 替换现有代码中的重复实现
```

**验收标准：**
- 至少提取 8 个通用组件
- 组件支持主题切换
- 组件有清晰的 API 文档

---

#### 8. 添加类型定义

**难度：** ⭐⭐⭐ (中等偏高)  
**工时：** 16-24 小时  
**收益：** 提高代码可维护性，减少错误

**实施步骤：**
```
Phase 1: 项目配置 (2h)
├── 添加 JSDoc 类型注释（无需 TypeScript）
├── 或 配置 TypeScript 环境
└── 添加类型检查脚本

Phase 2: 核心类型定义 (6h)
├── 定义数据类型（图层、样式等）
├── 定义 API 响应类型
├── 定义配置类型
└── 定义事件类型

Phase 3: 函数类型标注 (8h)
├── 为所有函数添加参数类型
├── 为所有函数添加返回值类型
└── 添加泛型支持

Phase 4: 类型检查修复 (8h)
├── 修复类型错误
├── 优化类型定义
└── 添加类型测试
```

**JSDoc 方式（推荐，无需编译）：**
```javascript
/**
 * @typedef {Object} TextFindResult
 * @property {string} id - 图层 ID
 * @property {number} index - 匹配位置索引
 * @property {number} length - 匹配文本长度
 * @property {string} fullText - 完整文本内容
 */

/**
 * 查找文本
 * @param {string} findText - 查找内容
 * @param {string} [scope='selection'] - 查找范围
 * @returns {Promise<TextFindResult[]>} 查找结果
 */
async function findText(findText, scope = 'selection') {
  // ...
}
```

**TypeScript 方式：**
```typescript
interface TextFindResult {
  id: string;
  index: number;
  length: number;
  fullText: string;
}

async function findText(
  findText: string, 
  scope: 'selection' | 'page' = 'selection'
): Promise<TextFindResult[]> {
  // ...
}
```

**验收标准：**
- 所有函数有类型定义
- 运行类型检查无错误
- IDE 有完整的类型提示

---

#### 9. 将各功能模块拆分为独立文件

**难度：** ⭐⭐⭐⭐ (较高)  
**工时：** 16-24 小时  
**收益：** 提高可维护性，便于协作

**建议的文件结构：**
```
AllinOne-X/
├── manifest.json
├── code.js              # 主入口（编译后）
├── ui.html              # UI 入口（编译后）
│
├── src/
│   ├── main.js          # 主逻辑入口
│   │
│   ├── features/        # 功能模块
│   │   ├── simple-tools.js      # 简易工具
│   │   ├── selection.js         # 选择工具
│   │   ├── text-find.js         # 文字查找替换
│   │   ├── ppt-master.js        # PPT Master
│   │   ├── refiner.js           # 组件清洗
│   │   ├── smart-fill.js        # 智能填充
│   │   └── design-theory.js     # 设计理论
│   │
│   ├── components/      # UI 组件
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   └── ...
│   │
│   ├── utils/           # 工具函数
│   │   ├── cache.js
│   │   ├── i18n.js
│   │   ├── theme.js
│   │   └── error-handler.js
│   │
│   ├── styles/          # 样式文件
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── panels.css
│   │
│   └── types/           # 类型定义
│       └── index.d.ts
│
├── build/               # 构建配置
│   ├── webpack.config.js
│   └── tsconfig.json
│
└── tests/               # 测试文件
    ├── text-find.test.js
    └── ...
```

**实施步骤：**
```
Phase 1: 构建环境搭建 (4h)
├── 配置 Webpack/Vite
├── 配置 TypeScript（可选）
└── 配置开发/生产环境

Phase 2: 样式拆分 (4h)
├── 提取 CSS 变量
├── 拆分组件样式
└── 拆分面板样式

Phase 3: 功能模块拆分 (8h)
├── 拆分简易工具模块
├── 拆分选择工具模块
├── 拆分文字查找模块
├── 拆分 PPT Master 模块
├── 拆分 Refiner 模块
├── 拆分智能填充模块
└── 拆分设计理论模块

Phase 4: 工具函数提取 (4h)
├── 提取缓存工具
├── 提取国际化工具
├── 提取主题工具
└── 提取错误处理

Phase 5: 集成测试 (4h)
├── 测试各模块功能
├── 测试构建产物
└── 修复拆分引入的问题
```

**验收标准：**
- 每个功能模块独立文件
- 构建产物正常工作
- 开发体验良好（热更新等）

---

#### 10. 按需加载，减少初始加载时间

**难度：** ⭐⭐⭐⭐ (较高)  
**工时：** 12-16 小时  
**收益：** 提升首屏加载速度

**依赖：** 需要先完成模块拆分（#9）

**加载策略：**
```javascript
// 主入口只加载核心代码
// main.js
import { initCore } from './core';
initCore();

// 按需加载功能模块
async function loadFeature(featureName) {
  switch(featureName) {
    case 'text-find':
      const { initTextFind } = await import('./features/text-find.js');
      initTextFind();
      break;
    case 'ppt-master':
      const { initPPTMaster } = await import('./features/ppt-master.js');
      initPPTMaster();
      break;
    // ...
  }
}

// 切换面板时加载对应模块
function switchPanel(panelName) {
  loadFeature(panelName);
  showPanel(panelName);
}
```

**加载时机：**
```
┌─────────────────────────────────────────────────┐
│                   加载时序图                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  首屏加载                                        │
│  ├── 核心框架 (必须)                             │
│  ├── 侧边栏导航 (必须)                           │
│  ├── 简易工具面板 (默认显示)                     │
│  └── CSS 样式 (必须)                             │
│                                                 │
│  用户切换面板时加载                               │
│  ├── 选择工具 → 加载 selection.js               │
│  ├── 文字替换 → 加载 text-find.js               │
│  ├── PPT Master → 加载 ppt-master.js            │
│  ├── Refiner → 加载 refiner.js                  │
│  ├── 智能填充 → 加载 smart-fill.js              │
│  └── 设计理论 → 加载 design-theory.js           │
│                                                 │
│  懒加载                                          │
│  ├── PptxGenJS (导出 PPT 时加载)                │
│  ├── JSZip (导出 PPT 时加载)                    │
│  └── AI SDK (使用 AI 功能时加载)                │
│                                                 │
└─────────────────────────────────────────────────┘
```

**实施步骤：**
```
1. 分析各模块大小和依赖关系
2. 设计代码分割策略
3. 实现动态 import()
4. 添加加载状态 UI
5. 优化第三方库加载
6. 测试加载性能
```

**验收标准：**
- 首屏加载时间减少 50% 以上
- 切换面板时无明显延迟
- 加载状态有友好提示

---

### P3 - 长期规划（高难度，战略价值）

这些项目难度高，需要大量时间，建议作为长期规划。

#### 11. 使用现代前端框架

**难度：** ⭐⭐⭐⭐⭐ (高)  
**工时：** 40-60 小时  
**收益：** 大幅提升开发效率和代码质量

**依赖：** 需要先完成组件提取（#7）、类型定义（#8）、模块拆分（#9）

**框架选择：**

| 框架 | 体积 | 学习曲线 | 推荐度 |
|------|------|----------|--------|
| Preact | ~3KB | 低 | ⭐⭐⭐⭐⭐ |
| Vue 3 | ~30KB | 中 | ⭐⭐⭐⭐ |
| Svelte | ~2KB | 低 | ⭐⭐⭐⭐ |
| React | ~40KB | 中 | ⭐⭐⭐ |

**推荐：Preact**
- 体积极小，适合插件场景
- API 与 React 兼容
- 支持 Hooks
- 无需构建也可使用（htm）

**迁移示例：**
```jsx
// 迁移前（原生 JS）
function renderButton(text, onClick) {
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary';
  btn.textContent = text;
  btn.onclick = onClick;
  return btn;
}

// 迁移后
function Button({ text, onClick }) {
  return (
    <button class="btn btn-primary" onClick={onClick}>
      {text}
    </button>
  );
}
```

**实施步骤：**
```
Phase 1: 框架集成 (8h)
├── 添加 Preact 依赖
├── 配置构建工具
└── 创建基础组件

Phase 2: 核心功能迁移 (20h)
├── 迁移侧边栏组件
├── 迁移面板组件
├── 迁移弹窗组件
└── 迁移表单组件

Phase 3: 状态管理 (8h)
├── 设计状态结构
├── 实现状态管理
└── 连接各组件

Phase 4: 测试优化 (8h)
├── 功能测试
├── 性能优化
└── 兼容性测试
```

**验收标准：**
- 所有功能正常工作
- 代码体积控制在合理范围
- 开发体验良好

---

#### 12. 为核心功能添加单元测试

**难度：** ⭐⭐⭐⭐ (较高)  
**工时：** 16-24 小时  
**收益：** 提高代码稳定性，便于重构

**依赖：** 需要先完成类型定义（#8）

**测试框架选择：**
- Jest - 功能全面
- Vitest - 速度快，与 Vite 集成好
- Mocha - 灵活

**测试范围：**

```
tests/
├── utils/
│   ├── cache.test.js          # 缓存工具测试
│   ├── i18n.test.js           # 国际化测试
│   └── format.test.js         # 格式化测试
│
├── features/
│   ├── text-find.test.js      # 文字查找测试
│   ├── selection.test.js      # 选择工具测试
│   └── smart-fill.test.js     # 智能填充测试
│
└── components/
    ├── Button.test.js         # 按钮组件测试
    └── Input.test.js          # 输入框组件测试
```

**测试示例：**
```javascript
// text-find.test.js
describe('Text Find', () => {
  test('should find text in selection', async () => {
    const results = await findText('test', 'selection');
    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);
  });
  
  test('should return empty array when not found', async () => {
    const results = await findText('nonexistent', 'selection');
    expect(results).toEqual([]);
  });
  
  test('should handle special characters', async () => {
    const results = await findText('[test]', 'selection');
    expect(results).toBeInstanceOf(Array);
  });
});
```

**实施步骤：**
```
1. 配置测试环境
2. 编写工具函数测试
3. 编写核心功能测试
4. 编写组件测试
5. 配置 CI 自动测试
```

**验收标准：**
- 核心功能测试覆盖率 > 70%
- 所有测试通过
- CI 集成完成

---

### P4 - 可选执行（低优先级）

#### 13. 错误日志上报

**难度：** ⭐⭐ (中等)  
**工时：** 4-8 小时  
**收益：** 便于问题排查

**依赖：** 需要先完成全局错误捕获（#3）

**上报内容：**
```javascript
{
  timestamp: '2024-02-13T10:30:00Z',
  error: {
    type: 'sync',
    message: 'Cannot read property of undefined',
    stack: '...'
  },
  context: {
    pluginVersion: '1.0.0',
    figmaVersion: '116.0.0',
    locale: 'zh',
    panel: 'text-find'
  }
}
```

**实施步骤：**
```
1. 选择上报服务（自建 / Sentry / 其他）
2. 设计上报数据格式
3. 实现上报逻辑
4. 添加用户隐私选项
5. 测试上报功能
```

---

## 📅 开发计划建议

### 第一阶段（1-2 周）- 基础优化

```
Week 1:
├── 减少 DOM 节点数量
├── 缓存常用数据
└── 添加全局错误捕获

Week 2:
├── 友好的错误提示界面
├── 日期、数字格式本地化
└── 开始支持更多填充类型
```

### 第二阶段（3-4 周）- 功能增强

```
Week 3:
├── 完成填充类型支持
├── 开始提取 UI 组件
└── 开始添加类型定义

Week 4:
├── 继续组件提取
├── 继续类型定义
└── 开始模块拆分
```

### 第三阶段（5-8 周）- 架构优化

```
Week 5-6:
├── 完成模块拆分
├── 实现按需加载
└── 集成测试

Week 7-8:
├── 评估框架迁移可行性
├── 开始单元测试
└── 文档完善
```

---

## 📊 风险评估

| 风险项 | 影响 | 应对措施 |
|--------|------|----------|
| 模块拆分引入 bug | 高 | 充分测试，逐步迁移 |
| 框架迁移兼容性问题 | 高 | 保持原生 JS 版本备份 |
| 性能优化效果不明显 | 中 | 先做性能分析，针对性优化 |
| 开发周期超出预期 | 中 | 预留缓冲时间，分阶段交付 |

---

## ✅ 验收标准

每个优化项目完成后，需满足以下条件：

1. **功能完整性** - 所有现有功能正常工作
2. **性能提升** - 有可量化的性能提升
3. **代码质量** - 代码风格一致，有适当注释
4. **文档更新** - 更新相关文档
5. **测试通过** - 手动测试或自动测试通过

---

## 📝 备注

- 本文档为开发指导文件，实际开发中可根据情况调整
- 优先级可根据业务需求重新排序
- 建议每完成一个阶段进行代码评审
- 保持与设计团队的沟通，确保 UI 一致性

---

*文档版本：v1.0*  
*创建日期：2024-02-13*  
*最后更新：2024-02-13*
