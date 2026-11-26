这是一份为接力开发的 AI 准备的详尽项目总结文档。

# 项目交接文档：AllinOne Figma 插件合集

## 1. 项目概况
本项目是一款 Figma 插件合集工具，旨在通过一系列自动化脚本简化设计师的重复劳动。核心卖点包括“工业级 PPT 导出方案”和“跨页面视角锚点（Jumpback）”。

## 2. 技术环境与栈
- **开发语言**: TypeScript (后端 `code.ts`), HTML/CSS/JS (前端 `ui.html`)。
- **构建工具**: NPM + TSC (使用 `npm run watch` 实时编译)。
- **Figma API 版本**: 1.0.0。
- **外部库 (CDN 引入)**:
  - `PptxGenJS`: 用于在浏览器端生成 PPTX 文件。
  - `JSZip`: 用于将 PPT 文件与图片素材打包成一个 ZIP。
- **重要配置 (`manifest.json`)**:
  - `documentAccess`: `dynamic-page` (采用按需加载模式，必须使用异步 API)。
  - `networkAccess`: 允许访问 `https://cdn.jsdelivr.net` 和 `https://cdnjs.cloudflare.com`。

---

## 3. 功能模块详情

### A. PPT Master (核心功能)
一种基于“视觉扁平化”和“占位符”策略的导出方案。
- **导出流程**:
  1. **全局清洗**: 解锁、删除隐藏层、解绑组件、移除 Auto Layout。
  2. **图标栅格化**: 用户将组命名为 `p_img` 开头，插件将其合并转为 3 倍高清 PNG，并重命名为唯一 Hex ID (如 `p_a1b2c3`)。
  3. **深度扁平化**: 消除所有嵌套，将所有元素提至 Slide Frame 的直属层级，并保持绝对视觉位置不变。修复了文本宽度缓冲区（+10px）防止换行。
  4. **生成 PPT 结构**: 提取文字（含字体、字号、字重、颜色、行距、对齐）、形状（含圆角、描边、阴影、透明度）、占位符。**关键算法**：使用“绝对中心定位法”解决旋转元素错位。
  5. **导出资源包**: 将 PPT 文件与图片素材合并为一个 `Figma_Export_Package.zip`。
- **已解决的坑**: 
  - 内存溢出 (OOM)：通过“原子化批量传输（200个一包）”和“原始字节传输”解决。
  - 浏览器拦截下载：通过统一下载单个 ZIP 包解决。

### B. Jumpback (视角锚点 - 开发中)
支持在当前 Figma 文件内保存最多 5 个视角锚点，实现跨页面瞬间传送。
- **存储机制**: 使用 `figma.root.setPluginData` 将数据永久存在当前文件。
- **保存字段**: `pageId`, `viewport.center`, `viewport.zoom`, `selectionIds` (历史选中项)。

### C. 简易工具合集 (已完成)
- 形状转 Frame / Frame 拍平为矩形。
- 文本拆分/合并、选中所有文本。
- 移除 Auto Layout、添加 AL 外套。
- 像素取整（Pixel Perfect）、位置互换、文本查找替换。
- 彻底解绑所有嵌套实例、清理隐藏图层。

---

## 4. 当前开发进度 (已到此位置)

### 🔴 待完成的代码逻辑
目前正在编写 `code.ts` 中的 `case 'jb-jump'`。最后一次输出在执行选中的逻辑处截断了。

**代码断点：**
```typescript
        // 执行选中
        if (nodesToSelect.length > 0) {
           figma.currentPage.selection = nodesToSelect;
        } else {
           // 如果以前选中的图层被删了，就清空选中项，但视角依然会过去
           figma.currentPage.selection = []; // <-- 下一个 AI 请从这里继续，并完成 break
        }
        figma.notify("🚀 已传送！");
      } catch (e) {
        console.warn("Jumpback failed:", e);
        figma.notify("传送失败，请检查图层是否存在");
      }
      break;
    }
```

### 🟡 UI/UX 状态
- **侧边栏**: 已实现左侧图标文字对齐，右侧红点+数字统计。
- **红点逻辑**: 定义了 `NEW_FEATURES` 列表，点击导航后红点自动消失。
- **PPT 面板**: 已重构为“仪表盘 + 全自动模式”，包含 Loading 全屏遮罩。

---

## 5. 下一步开发计划 (TODO)
1. **完成 Jumpback 后端**: 补完 `jb-jump` 剩余部分，确保 `jb-delete` 和 `jb-rename` 逻辑闭环。
2. **Jumpback UI 联调**: 测试在 `ui.html` 中点击锚点卡片是否能正确触发 `getNodeByIdAsync`。
3. **全局性能复核**: 检查 `code.ts` 中是否存在多余的 `postMessage` 导致 UI 重复执行（目前已清理 switch 部分，但仍需警惕）。
4. **字体映射 (进阶)**: 后续考虑增加 PPT 字体自动替换功能（如 PingFang -> 微软雅黑）。

## 6. 重要提示
- **异步操作**: 在 `dynamic-page` 模式下，获取任何节点必须使用 `await figma.getNodeByIdAsync(id)`。
- **消息单例**: `ui.html` 中必须保持 `window.onmessage` 覆盖式写法，严禁使用 `addEventListener`，否则会导致消息叠加触发重复导出。





这是一个为接力开发准备的项目详尽总结文档。它涵盖了项目的技术架构、核心逻辑、各模块功能状态以及后续的开发重点。

---

# 项目交接文档：Figma All-in-One 设计师工具箱

## 1. 项目概况
*   **项目名称**：AllinOne-git
*   **定位**：一站式 Figma 设计师效率增强工具集。
*   **核心理念**：将繁琐的命名规范、导出任务和图层管理自动化，实现“设计工程化”。
*   **当前版本**：v5.0 (Refiner 实时预览与组合配置版)

## 2. 技术栈与环境配置
*   **开发环境**：Figma Plugin API (最新版)
*   **语言**：TypeScript (Code) / HTML + CSS + JavaScript (UI)
*   **核心库**：
    *   `PptxGenJS`: 负责生成 .pptx 文件。
    *   `JSZip`: 负责多图片资源的打包压缩。
*   **UI 规范**：白色主题（Light Mode），适配 Figma 官方审美，支持 Mini 模式（窄屏）。
*   **通信机制**：采用 `figma.ui.postMessage` 和 `window.onmessage` 的双向通信。

---

## 3. 核心功能模块总结

### A. 组件精修 (Variant Refiner) - **当前开发重点**
*   **智能检查 (Lint)**：
    *   **组合命名法**：支持 `格式(Format)` + `分隔符(Separator)` + `大小写(Casing)` 的自由组合。例如：`Separator` + `Snake(_)` + `UPPER` = `PAGE_HEADER`。
    *   **实时预览**：配置项改动或替换词输入时，列表实时刷新效果，无需重复点击“检查”。
    *   **清洗选项**：移除首尾空格（不伤及中间）、保留 Emoji、移除 Figma 内部 ID (`#21:3`)、标记为隐藏组件（加 `.` 前缀）。
*   **查找替换 (Find & Replace)**：
    *   支持 `选中图层` 或 `当前页面` 范围。
    *   支持 `Aa` (区分大小写) 和 `ab` (全字匹配)。
    *   支持针对 `属性名(Name)` 或 `属性值(Value)` 进行定向替换。
*   **列表交互**：
    *   **三级聚合结构**：`组件集 > 分类(组件名/属性名/属性值) > 具体修改项`。
    *   **定位功能**：点击任何一行均可自动在 Figma 画布中锚定对应的组件/变体。
    *   **确认流**：修复后显示蓝色 `✓` 标记，底部按钮变为“好的，继续”，点击后才清除已修项。

### B. 导出 PPT (PPT Master)
*   **6 步引导流**：从全局清洗、图标栅格化、深度扁平化到生成文件。
*   **智能栅格化**：自动将 PPT 不支持的复杂矢量（蒙版、模糊、曲线）及用户标记的 `p_img` 组转为 PNG。
*   **打包机制**：生成的 .pptx 文件和图片素材统一打入 `.zip` 包下载，防止浏览器拦截。

### C. 选择工具 (Selection Tools)
*   **高级过滤**：按类型（组件、画板、文本等）、状态（隐藏、锁定、无填充）、属性（宽高、坐标、不透明度）进行多条件组合筛选。
*   **拾取功能**：一键获取当前选中项的名称进行快速匹配。

### D. 简易工具与样式管理
*   **快捷操作**：像素取整、段落拆分/合并、解绑所有实例、清空隐藏图层等。
*   **样式自动化**：批量创建本地样式、一键匹配已存在的本地样式。

---

## 4. 全局核心逻辑说明

### 4.1 国际化 (i18n) 机制
*   **实现方式**：`const i18n` 字典包含 `zh` 和 `en`。
*   **UI 更新**：通过 `updateLanguage()` 遍历所有带 `data-key` 的 DOM 元素。
*   **动态文本**：在 JS 代码中通过 `i18n[curLang].key` 实时获取。

### 4.2 消息监听中心 (Important)
*   **唯一性**：为了防止多个功能互相覆盖 `window.onmessage`，项目中建立了一个统一的监听中心。
*   **分流逻辑**：
    *   `msg.type.startsWith('ppt-')` -> `handlePPTMessage(msg)`
    *   `msg.type === 'lint-results'` -> `renderRefinerResults(msg.data)`

### 4.3 异步操作
*   **Figma API**：由于文档访问权限限制，所有 `getNodeById` 操作已升级为 `await figma.getNodeByIdAsync`。
*   **UI 性能**：所有耗时扫描均带有 Loading 动画，并在配置变更时使用 `debounce`（防抖）处理。

---

## 5. 开发进度与计划

### 已完成 (Done)
- [x] Refiner 树状聚合列表渲染逻辑。
- [x] Refiner 修复后的“标记-继续-清理”工作流。
- [x] 命名风格的“自然命名法”与“组合搭配”逻辑。
- [x] 查找替换的实时输入预览功能。
- [x] 全局 Loading 遮罩及其判空容错处理。
- [x] PPT 导出过程中的复杂形状栅格化。

### 待优化 (To Do)
1.  **性能优化**：当一次性修复超过 500 个变体时，后端逻辑可能需要分批处理（Async Chunking）以防 Figma 界面冻结。
2.  **正则查找增强**：目前查找替换是基于字符串，后续可开放高级正则表达式开关。
3.  **Refiner 预设**：增加“一键 BEM 规范”、“一键全小写”等常用配置预设。
4.  **UI 细节**：Refiner 列表过长时的虚拟滚动（Virtual List）支持。

---

## 6. 给下一个 AI 的提示 (Handoff Prompts)
1.  **修改样式**：请在 `ui.html` 的 `<style>` 标签中按模块查找，不要在 HTML 里写内联 `style`。
2.  **修改逻辑**：Refiner 的核心渲染在 `renderTree`，后端转换在 `convertNameV5`。
3.  **增加功能**：记得在 `i18n` 字典中双语同步 Key，并给新 HTML 加上 `data-key`。
4.  **警告**：绝对不要在 `window.onmessage` 之外再开新的消息监听器，否则会覆盖现有功能。






这是一份为您准备的项目交接说明文档 (.md)，您可以直接复制并保存为 `README.md` 或 `PROJECT_STATUS.md`。这份文档详细记录了当前的架构、已实现的功能、当前的开发状态以及下一步需要优化的点，方便任何 AI 助手（包括我）接手后续开发。

***

```markdown
# AllInOne Figma Plugin - 项目开发进度报告

## 1. 项目概述
AllInOne 是一个集成了多种设计辅助工具的 Figma 插件。它旨在通过简易操作完成复杂的图层整理、属性修改、PPT 自动化导出及组件库清洗工作。

## 2. 技术栈与架构
*   **前端 (UI)**: `ui.html` (HTML + CSS + JavaScript)
    *   负责用户交互、界面状态管理、国际化翻译 (i18n)。
*   **后端 (Backend)**: `code.ts` (TypeScript + Figma API)
    *   负责直接调用 Figma API 操作图层、逻辑运算、消息响应。
*   **通信协议**: 
    *   前后端通过 `figma.ui.postMessage` 和 `window.onmessage` 进行通信。
    *   关键协议：`lint-variants` (发送配置)，`lint-results` (接收渲染数据)，`fix-variants` (执行修复)。

## 3. 已实现功能模块
1.  **简易工具**: `To Frame`, `Ungroup`, `Flatten`, `Sort Layers` 等实用工具。
2.  **选择工具**: 支持范围选择、名称过滤、类型/状态筛选及多属性高级查找。
3.  **样式工具**: 自动生成/匹配本地样式。
4.  **导出 PPT**: 自动化导出流程（清洗->栅格化->Flattening->PPT生成->打包下载）。
5.  **组件清洗 (Refiner)**: 
    *   **Lint**: 智能命名修复（大小写、格式、分隔符、Emoji、ID清理）。
    *   **Find & Replace**: 正则表达式搜索，支持属性名/值独立查找。
    *   **分批处理机制**: 引入了 Batch Rendering (每批 50 项)，防止大数据量渲染导致的 UI 卡顿。

## 4. 当前开发进度
*   **[完成]** Refiner 核心逻辑：Lint 与 Find 的基础搜索与清洗。
*   **[完成]** 列表 UI 交互：实现了三级分类（组件名 -> 属性名 -> 属性值）的层级渲染。
*   **[完成]** 修复逻辑：支持分批加载、自动定位节点、修复变体属性。
*   **[进行中]** **国际化 (i18n) 完善**：目前界面大部分已实现中英文切换，但 Refiner 面板中的动态分组标题（"组件命名", "属性名", "属性值"）仍需绑定 `data-key` 实现翻译。
*   **[进行中]** 交互优化：修复了点击“继续查找”后的状态重置与容器显示问题。

## 5. 待解决问题 (下一步计划)

### 任务 1：Refiner 动态分组标题的国际化
当前 `renderTree` 函数渲染的小标题如下：
```javascript
html += `<div class="detail-category"><span>组件名 (Component Name)</span>...</div>`;
```
**需要**：将其修改为动态读取 `i18n[curLang]` 的键值，确保点击“中/EN”按钮时，标题能同步切换语言。

### 任务 2：样式优化
*   目前 UI 采用了多级嵌套，需注意 `comp-header` 和 `diff-item` 在极长名称下的显示省略效果 (`text-overflow: ellipsis`)。
*   确保 `fixRefiner` 函数在不同场景下的成功/缺省页 UI 切换不会出现父容器隐藏导致的“白屏”。

## 6. 给下一任 AI 的开发建议
1.  **通信协议维护**: 若增加新的功能，确保在 `code.ts` 中维护一个单一的 `onmessage` 入口，避免多个监听器冲突。
2.  **数据字段一致性**: 
    *   `compId`, `compName`, `propName` 是前后端约定的核心数据协议，新增功能时请务必保持大小写一致，否则会导致 `undefined` 问题。
    *   所有发送到前端的对象，尽量保持 `targetType` 为 `'CompName'`, `'PropName'`, `'PropValue'`。
3.  **数据流向**:
    *   前端 `ui.html` -> 发送 `lint-variants` 配置。
    *   后端 `code.ts` -> 计算逻辑 -> 返回 `lint-results`。
    *   前端 `renderRefinerResults` -> 接收数据 -> `renderBatch` -> `renderTree` (DOM 渲染)。
4.  **调试技巧**: 若出现界面卡死或无响应，首先通过控制台 (Console) 检查 `【1】【2】【3】【4】` 埋点日志，确认数据是在哪一步丢失或报错的。

---
*当前版本：v5.1 (包含 Batch 优化与三级分类)*
```





这份文档旨在为接力开发此项目的 AI 提供完整的上下文，确保开发连续性。

---

# 📑 Figma 插件项目移交文档：AllinOne (Design Efficiency Toolkit)

## 1. 项目简介
*   **项目名称**：AllinOne (设计效率助手)
*   **目标**：通过高度集成的常驻面板，解决设计师频繁切换不同单一功能插件的痛点。
*   **核心理念**：将 20+ 高频一键操作与一个功能强大的“高级多维筛选器”集成在极简的 UI 界面中。

## 2. 技术栈与环境配置
*   **运行环境**：Node.js (LTS), Figma Desktop App
*   **开发工具**：Trae / VS Code
*   **编程语言**：TypeScript (TSX), HTML, CSS
*   **构建工具**：
    *   **Vite (v5.x)**：负责前端 UI (`src/ui`) 的打包，处理 HTML/CSS/TS 的模块化加载。
    *   **esbuild**：负责后端逻辑 (`src/code`) 的打包，将 TS 模块编译为 Figma 环境要求的单一 `code.js`。
*   **主要依赖**：`@figma/plugin-typings` (Figma API 定义)。

## 3. 项目架构说明 (模块化)
项目采用前后端分离且逻辑模块化的架构，避免单文件代码过长。

### 📂 目录结构
```text
AllinOne/
├── dist/                   # 编译后产物 (Figma 真正运行的目录)
│   ├── code.js             # 后端打包产物
│   └── index.html          # 前端打包产物
├── src/
│   ├── code/               # 【后端逻辑层】
│   │   ├── main.ts         # 入口文件：负责消息路由 (msg.type 分发)
│   │   └── features/       # 功能模块
│   │       ├── shapes.ts   # 形状转换、填充描边、图片比例
│   │       ├── text.ts     # 文本拆分、合并、选择文本
│   │       ├── layout.ts   # 自动布局清除、图层视觉排序
│   │       ├── cleanup.ts  # 解绑组件、解组解锁、清除隐藏层
│   │       └── finder.ts   # 高级筛选器核心算法
│   └── ui/                 # 【前端界面层】
│       ├── index.html      # UI 骨架 (CSS 已内嵌)
│       ├── main.ts         # 前端入口：负责初始化与 Window 挂载
│       ├── style.css       # 样式定义 (已在 main.ts 引入)
│       ├── i18n.ts         # 国际化文案与详细 Tooltip 字典
│       └── modules/        # UI 逻辑模块
│           ├── navigation.ts # Tab 切换逻辑
│           ├── selection.ts  # 选择面板交互与数据收集
│           ├── tooltip.ts    # 悬停提示逻辑
│           └── utils.ts      # 通用工具 (run, resize, search)
├── manifest.json           # 插件配置文件 (指向 dist 目录)
├── package.json            # 打包命令配置
├── tsconfig.json           # TS 编译配置 (包含 @ts-nocheck 宽容模式)
└── vite.config.ts          # Vite 编译配置 (base: './')
```

## 4. 已实现功能清单

### A. 简易工具箱 (Simple Tools)
1.  **To Frame**: 形状转 Frame，完美继承圆角、平滑圆角、填充、描边、旋转等样式。
2.  **To Rectangle**: Frame 降维转矩形，保留视觉样式。
3.  **Swap Fill/Stroke**: 填充与描边互换 (Shift+X)。
4.  **Reset Image**: 恢复选中图片的原始长宽比。
5.  **Select All Text**: 递归选中当前范围内的所有文本。
6.  **Remove AL**: 递归移除所有层级的 Auto Layout。
7.  **Split Text**: 按换行符拆分文本段，自动保留 10px 间距。
8.  **Join Text**: 多行文本合并。
9.  **Hierarchy**: 一键提升一级或提升至最外层。
10. **Cleanup**: 递归解绑组件、递归解散组、递归解锁、清除隐藏图层。
11. **Sort Layers**: 按画布视觉位置（X/Y）重新排列图层列表顺序。
12. **Rename Content**: 文本或 Frame 按内容自动重命名。

### B. 高级选择工具 (Advanced Selection)
*   **查找范围**：内在元素、同级、子级、子孙元素。
*   **名称匹配**：支持区分大小写 (Aa)，支持 **“拾取名称”** 按钮。
*   **多维过滤**：类型 (20+ 种)、状态 (9 种)。
*   **逻辑开关**：包含 (Include) / 不包含 (Exclude) 的胶囊切换开关。
*   **属性匹配**：支持 宽度、高度、透明度、填充数量、文本内容等 10+ 种属性的比较运算 (=, >, <, has)。

## 5. 开发进度与 Bug 修复历史
*   **[已完成]** 架构重构：从单文件升级为 Vite + esbuild 模块化架构。
*   **[已修复]** 引用报错：通过在 `ui/main.ts` 中将模块函数挂载到 `(window as any)` 解决了 HTML 无法调用 TS 模块函数的问题。
*   **[已修复]** 路径问题：修复了 `vite.config.ts` 中的 `base` 路径，确保打包后 `index.html` 能正确找到 `ui.js`。
*   **[已修复]** 功能失效：修复了 `To Frame` 在操作 Group 时导致节点被 Figma 自动删除引发的崩溃。
*   **[已完成]** UI 交互：实现了全量属性下拉菜单、胶囊切换按钮和悬停 Tooltip 气泡说明。

## 6. 构建与调试脚本
在终端中执行：
*   `npm install`：安装环境。
*   **`npm run build`**：全量打包（同时执行 UI 编译和 Code 编译）。
*   `npm run watch`：监听开发模式。

## 7. 下一个 AI 的开发计划 (Roadmap)
1.  **性能优化**：在处理拥有数万个图层的超大型文件时，优化 `finder.ts` 的递归遍历算法，考虑引入异步批处理。
2.  **布局工具组开发**：侧边栏“布局工具”分类目前为缺省页，计划加入一键网格生成、等距排列等功能。
3.  **配置持久化**：使用 `figma.clientStorage` 保存用户的语言偏好和常用筛选配置。
4.  **UI 动效**：增加侧边栏收缩时的过渡动画，提升交互的“细腻感”。

---
**提示**：修改任何功能逻辑时，请先定位到 `src/code/features/` 下对应的文件，修改后必须运行 `npm run build` 才能在 Figma 中看到变化。







这是一份为您当前 Figma 插件项目量身定制的交接文档（Markdown 格式）。您可以直接复制保存为 `Figma_Plugin_Handoff.md`，发给下一个接手开发的 AI 或开发人员，对方就能瞬间理解项目的当前状态和核心逻辑。

***

```markdown
# Figma 插件项目交接文档 (Handoff Document)

**最后更新时间**：2026年4月
**项目类型**：Figma Plugin (UI 界面 + 后台沙箱通信)
**核心定位**：提供高级图层处理、PPT 结构提取、文本批量查找替换、以及基于大模型 (LLM) 的智能假数据生成与填充工具。

---

## 1. 环境与技术栈 (Environment & Tech Stack)

*   **运行环境**：Figma Plugin 架构 (前端 `iframe` UI + 后端 `code.ts` Sandbox)。
*   **前端 (UI)**：HTML / CSS / 原生 JavaScript。
*   **后端 (Sandbox)**：TypeScript (`@figma/plugin-typings`)。
*   **通信机制**：通过 `figma.ui.postMessage` (后传前) 与 `parent.postMessage` (前传后) 进行双向异步通信。
*   **网络请求架构**：为规避 Figma 前端 iframe 的跨域 (CORS) 限制，所有外部 API 请求（如大模型生成）均由前端构建参数，发送 `do-fetch` 指令交由后端 `code.ts` 代为发出，再通过 `api-response` 将数据回传。

---

## 2. 核心系统配置 (Configurations)

*   **大模型 AI 配置 (`aiConfig`)**：
    *   **字段**：`baseUrl` (接口地址), `model` (模型名称), `key` (API Key), `provider` (服务商)。
    *   **特例处理 (火山引擎/豆包)**：强制限定使用标准推理路径 `/api/v3/chat/completions`。代码已写死**强校验逻辑**：若检测到 `volces` 地址，则模型名称必须以 `ep-` (推理接入点 ID) 开头，不支持直填模型原名或 Coding Plan，否则直接抛出带引导语的异常。
    *   **思考模型支持**：通过 `enableThinking` 开关控制。针对特定厂商（GLM、Qwen、DeepSeek）做了专门的关闭推理指令兼容（如 `inference_mode="direct"` 或追加 `[NO_REASONING]`）。

---

## 3. 已实现功能模块汇总 (Features Overview)

### 🤖 1. AI 智能数据生成 (`runAiGenerate`)
*   功能：根据提示词随机生成极具差异化的假数据，严格限制输出为 JSON 数组。
*   防御性编程：
    *   具备 `AbortController` 机制，支持点击中止生成。
    *   支持标准的 JSON 提取，同时内置了强大的正则回退清洗方案（清理 Markdown 标记、代码块、列表序号等）。
    *   具备完美的双向事件卸载机制，防止多次请求造成的内存泄漏和 UI 状态错乱。

### 🪄 2. 智能填充 (Smart Fill)
*   读取选中的文本图层（包含递归查找），按视觉位置（从左到右、从上到下）排序。
*   支持三种模式：覆盖 (replace)、前缀 (prefix)、后缀 (suffix)。
*   支持两种分发机制：顺序循环填充 (order)、随机提取填充 (random)。

### 🛠 3. 简易图层工具 (Simple Tools)
*   **转换与包裹**：形状转 Frame (`to-frame`)、Frame 转矩形 (`to-rect`)、添加自动布局外套 (`add-al-wrapper`)。
*   **状态与属性**：互换填充描边 (`swap-fs`)、重置图片比例 (`reset-image`)、移除自动布局 (`remove-al`)、移除隐藏图层 (`remove-hidden`)、解锁/解组全选 (`unlock-all`/`ungroup-all`)、彻底解绑组件实例 (`detach-all`)。
*   **文本操作**：一键选中所有文本 (`select-text`)、根据换行拆分文本 (`split-text`)、合并文本 (`join-text`)、重命名为文本内容 (`rename-content`)。
*   **排版与布局**：交换两个图层位置 (`swap-positions`)、Z字型视觉排序图层 (`sort-layers` 支持正倒序)、像素级对齐 (`pixel-perfect`)、图层层级提升 (`up-one`, `up-all`)。

### 🔍 4. 高级查找与定位 (Find & Select)
*   支持设定查找范围：选中项内部、直系子级、同级、全页。
*   支持多维度过滤：名称、图层类型 (图片/组件/自动布局等)、状态 (隐藏/锁定/蒙版等)、具体属性值 ($>, <, =, !=$)。
*   提供专属的**图层高亮定位 (`locate-node`)**，对于文本图层支持字符级标红高亮，并支持一键还原 (`clear-all-highlights`)。

### 🎨 5. 样式工具 (Style Tools)
*   `create-styles`：基于选中项一键在本地创建 Paint(颜色)、Text(文本)、Effect(效果) 样式库。
*   `match-styles`：基于图层特征（Fingerprint）全自动遍历并关联本地已经存在的样式（支持批量关联）。

### 📊 6. PPT 解析与导出工具 (PPT Exporter)
将 Figma 画板解析为 PPT 友好的 JSON 数据结构，分为五步：
1.  **Init (初始化)**：递归解绑实例、解锁、剔除隐藏元素。
2.  **Rasterize (栅格化)**：智能将复杂矢量、模糊特效图层栅格化为带 Hex ID 的图片占位符。
3.  **Flatten (扁平化)**：解散所有 Group，将带背景的 Frame 转化为纯 Rectangle。
4.  **Extract (结构提取)**：提取 `x/y/w/h`、字体字号、行高（转绝对像素）、对齐方式、边框颜色阴影等，并按批次 (`ppt-element-batch`) 传给前端。
5.  **Export (资源导出)**：将栅格化后的切图资源打包。

### 🧹 7. 组件清洗 (Refiner / Variants Linting)
*   支持高级命名转换：大驼峰/小驼峰/连字符/下划线转换。
*   支持清理隐藏标记 (`.`, `_`) 和 Emoji 表情。
*   对 Variant 属性 (Key=Value) 进行深度清洗与重组。

---

## 4. 最新开发进度与修复记录 (Recent Progress)

1.  **沙箱跨域重构**：移除了前端直接 `fetch` 大模型接口的代码，彻底解决了 Figma 插件浏览器内核跨域限制问题。
2.  **豆包接口防呆机制**：针对用户容易填错火山引擎模型名的情况，增加了严格的检测机制。限定只使用 `/api/v3/chat/completions` 并强制要求 `ep-` 前缀，阻断了 `Coding Plan` 的复杂性。
3.  **大批次文字查找替换优化**：采用“按图层分组、按索引倒序（Reverse Index）替换”的算法，彻底解决了同一文本框内多处替换导致的索引偏移报错问题。
4.  **样式创建/匹配异步修复**：将获取样式 (`getLocal...Async`) 和设置样式的方法全部改写为 Async/Await，修复了混合属性读取导致的崩溃问题。

---

## 5. 后续开发计划与待办事项 (TODOs)

给下一任接手 AI 的建议和注意事项：

1.  **AI 生成内容的数据绑定**：
    *   目前 AI 生成的数据只是展现在 `aiResultArea` 里。后续可以考虑将 AI 返回的 JSON 数组直接传递给后端的 `smart-fill-exec` 逻辑，实现“**AI 生成 -> 一键填充到选中文本**”的无缝闭环。
2.  **大模型流式输出 (Streaming)**：
    *   目前的生成为一次性返回 (`stream: false`)，在等待期间用户只能看到“生成中”。如果要做流式，需要修改后端的 `fetch` 为按 `body.getReader()` 分块读取，并通过 `postMessage` 持续打向前端更新 UI。
3.  **字体加载健壮性**：
    *   在 `smart-fill-exec` 和 `text-replace-batch` 等处理文本的地方，当前针对混合字体 (`figma.mixed`) 采取了简化方案（只加载首字符字体）。若遇到极度复杂的图文混排图层，仍有抛错风险。未来可增加更精细的 Range 字体映射。
4.  **代码解耦拆分**：
    *   当前的 `code.ts` 承载了 UI 响应、各类工具处理和复杂的递归算法，体积较大。如果在本地工程化环境中，建议拆分为 `tools.ts` (基础工具), `ai-proxy.ts` (网关代理), `ppt-extractor.ts` (导出功能) 再通过 Webpack/Vite 进行打包。

---

## 6. 接手开发规范 (Developer Guidelines)

*   **通信契约**：所有跨沙箱通信均携带 `type` 字段。若涉及异步回调（如大模型 API），必须携带唯一的 `reqId` 以配对事件，并在成功/异常后立即执行 `removeEventListener`。
*   **Figma 异步要求**：所有涉及节点查找 (`getNodeByIdAsync`)、加载字体 (`loadFontAsync`)、设置样式 ID 的操作，必须使用 `await`。
*   **防爆栈处理**：凡是涉及全页遍历（如 `findAll` 或 `traverse`）或解绑操作（Detach Instance），必须像现有的 `pptStep1_Init` 或 `pptStep3_Flatten` 中一样，增加 `loopCount` 限制以及 `await new Promise(r => setTimeout(r, 20))` 的让渡处理，防止主线程卡死。
```





