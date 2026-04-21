# 单文件打包详解

## 🎯 为什么需要单文件打包？

### Figma 插件的限制
Figma 插件有严格的文件结构要求：
- **前端**：必须是单个 HTML 文件（`ui.html`）
- **后端**：必须是单个 JavaScript 文件（`code.js`）
- **配置**：`manifest.json` 指定这两个文件

### 开发 vs 生产的矛盾
- **开发时**：我们希望模块化开发（Vue 组件、TypeScript、多个文件）
- **生产时**：Figma 要求单文件
- **解决方案**：构建时将所有代码打包成单文件

---

## 🏗️ 构建流程详解

### 整体流程图
```
开发代码（模块化）          构建过程              生产代码（单文件）
─────────────────────────────────────────────────────────────
src/ui/                     Vite Build          ui.html
├── components/      ──→   ├── 编译 Vue         (104KB)
├── styles/          ──→   ├── 打包 CSS         ├── HTML
├── stores/          ──→   ├── 打包 JS          ├── <style>
└── main.ts          ──→   └── 内联所有资源     └── <script>

src/plugin/                 TypeScript          code.js
├── utils/           ──→   ├── 编译 TS          (单文件)
└── main.ts          ──→   └── 合并模块         └── CommonJS

                            Post-Build
                            ├── 注入 __html__
                            └── 生成最终文件
```

---

## 📦 前端打包（ui.html）

### Step 1: Vite 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile({  // 关键插件：单文件打包
      useRecommendedBuildConfig: true,
      removeViteModuleLoader: true,
    }),
  ],
  build: {
    target: 'es2020',
    outDir: '../../dist',
    assetsInlineLimit: 100000000,  // 内联所有资源
    cssCodeSplit: false,            // 不分割 CSS
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // 内联动态导入
        manualChunks: undefined,    // 不分割代码块
      },
    },
  },
})
```

### Step 2: 构建过程

```bash
npm run build:ui
```

**发生了什么？**

1. **编译 Vue 组件**
   ```
   Button.vue → JavaScript + CSS
   Input.vue  → JavaScript + CSS
   App.vue    → JavaScript + CSS
   ```

2. **打包 JavaScript**
   ```
   main.ts + 所有组件 → 单个 JS 文件
   ```

3. **打包 CSS**
   ```
   global.css + 组件样式 → 单个 CSS 字符串
   ```

4. **内联到 HTML**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       /* 所有 CSS 都在这里 */
       .btn { ... }
       .input { ... }
     </style>
   </head>
   <body>
     <div id="app"></div>
     <script>
       // 所有 JavaScript 都在这里
       var app = ...
     </script>
   </body>
   </html>
   ```

### Step 3: vite-plugin-singlefile 的作用

这个插件做了以下事情：
1. 读取所有生成的 CSS 文件
2. 读取所有生成的 JS 文件
3. 将它们内联到 HTML 的 `<style>` 和 `<script>` 标签中
4. 删除外部文件引用
5. 生成单个 HTML 文件

**结果**：
```
dist/index.html (104KB)
- 包含所有 HTML
- 包含所有 CSS（内联）
- 包含所有 JavaScript（内联）
- 包含所有图片（base64 编码）
```

---

## 🔧 后端打包（code.js）

### Step 1: TypeScript 编译配置

```json
// tsconfig.plugin.json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "CommonJS",  // 关键：输出 CommonJS
    "outDir": "./dist"
  }
}
```

### Step 2: 编译过程

```bash
npm run build:plugin
```

**发生了什么？**

1. **编译 TypeScript**
   ```
   main.ts → main.js (CommonJS)
   utils/nodeUtils.ts → utils/nodeUtils.js
   utils/errorHandler.ts → utils/errorHandler.js
   ```

2. **保留模块结构**
   ```
   dist/
   ├── plugin/
   │   ├── main.js
   │   └── utils/
   │       ├── nodeUtils.js
   │       ├── errorHandler.js
   │       └── asyncQueue.js
   └── shared/
       ├── constants.js
       └── types.js
   ```

3. **CommonJS 格式**
   ```javascript
   // 输出的代码使用 require/exports
   "use strict";
   Object.defineProperty(exports, "__esModule", { value: true });
   exports.collectTextNodes = collectTextNodes;
   
   function collectTextNodes(root) {
     // ...
   }
   ```

### Step 3: 为什么不需要打包器？

Figma 插件后端运行在 Node.js 环境中，支持 CommonJS 的 `require()`。

但是，我们的代码已经内联了所有函数，不使用 `require()`，所以实际上是一个完全独立的文件。

---

## 🔗 合并过程（Post-Build）

### Step 1: Post-Build 脚本

```javascript
// scripts/post-build.cjs
const fs = require('fs')

// 1. 读取 UI HTML
const uiHtml = fs.readFileSync('dist/index.html', 'utf8')

// 2. 读取插件代码
const pluginCode = fs.readFileSync('dist/plugin/main.js', 'utf8')

// 3. 将 HTML 转为 JavaScript 字符串
const htmlString = JSON.stringify(uiHtml)

// 4. 注入到插件代码前面
const finalCode = `
var __html__ = ${htmlString};

${pluginCode}
`

// 5. 写入最终文件
fs.writeFileSync('code.js', finalCode)
fs.writeFileSync('ui.html', uiHtml)
```

### Step 2: 最终输出

**ui.html**（104KB）
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>AllinOne-CC</title>
  <style>
    /* 所有 CSS（约 20KB） */
    :root { --primary: #8B7FD8; }
    .btn { ... }
    .input { ... }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    /* 所有 JavaScript（约 80KB） */
    /* Vue 3 运行时 */
    /* Pinia */
    /* 所有组件 */
    /* 应用代码 */
  </script>
</body>
</html>
```

**code.js**（约 110KB）
```javascript
// Figma Plugin Code
var __html__ = "<!DOCTYPE html>\n<html>...</html>";

// 插件代码
"use strict";
function collectTextNodes(root) { ... }
function sortNodesByPosition(nodes) { ... }
// ... 所有工具函数

figma.showUI(__html__, {
  width: 460,
  height: 640,
  themeColors: true,
});

figma.ui.onmessage = async (msg) => {
  // ... 消息处理
};
```

---

## 🎨 关键技术点

### 1. CSS 内联
```html
<!-- 开发时 -->
<link rel="stylesheet" href="style.css">

<!-- 构建后 -->
<style>
  /* style.css 的内容直接在这里 */
</style>
```

### 2. JavaScript 内联
```html
<!-- 开发时 -->
<script type="module" src="main.js"></script>

<!-- 构建后 -->
<script>
  /* main.js 和所有依赖的内容 */
</script>
```

### 3. 图片内联（如果有）
```html
<!-- 开发时 -->
<img src="logo.png">

<!-- 构建后 -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANS...">
```

### 4. __html__ 变量
```javascript
// Figma 插件 API 要求
figma.showUI(__html__, options)

// __html__ 是一个包含完整 HTML 的字符串
var __html__ = "<!DOCTYPE html>..."
```

---

## 📊 文件大小分析

### 构建前（开发代码）
```
src/ui/
├── components/     ~50 个文件
├── styles/         ~5 个文件
├── stores/         ~2 个文件
├── utils/          ~5 个文件
└── ...
总计：~100 个文件，~200KB（未压缩）
```

### 构建后（生产代码）
```
ui.html             104KB（单文件）
├── HTML            ~2KB
├── CSS             ~20KB
└── JavaScript      ~82KB
    ├── Vue 3       ~40KB
    ├── Pinia       ~5KB
    └── 应用代码    ~37KB

code.js             ~15KB（单文件）
└── 插件逻辑        ~15KB
```

---

## 🔍 验证单文件打包

### 检查 ui.html
```bash
# 查看文件大小
ls -lh ui.html
# 应该显示约 104KB

# 检查是否是单文件（没有外部引用）
grep -E '<link|<script src' ui.html
# 应该没有输出（或只有内联的 script）

# 查看内容
head -50 ui.html
# 应该看到 <style> 标签包含 CSS
```

### 检查 code.js
```bash
# 查看文件大小
ls -lh code.js
# 应该显示约 15KB

# 检查 __html__ 变量
head -5 code.js
# 应该看到：var __html__ = "<!DOCTYPE html>...

# 检查是否有 require()
grep "require(" code.js
# 应该没有输出（我们内联了所有代码）
```

---

## 🚀 优化技巧

### 1. 减小包体积
```typescript
// vite.config.ts
build: {
  minify: 'terser',  // 使用 Terser 压缩
  terserOptions: {
    compress: {
      drop_console: true,  // 移除 console.log
    },
  },
}
```

### 2. Tree Shaking
```typescript
// 只导入需要的部分
import { ref, computed } from 'vue'  // ✅
// 而不是
import * as Vue from 'vue'  // ❌
```

### 3. 代码分割（不适用于单文件）
单文件打包不能使用代码分割，所以要：
- 避免导入大型库
- 只使用必要的功能
- 考虑使用 CDN（但 Figma 插件不支持）

---

## 🐛 常见问题

### Q1: 为什么不能用 ES 模块？
**答**：Figma 插件后端不支持 ES 模块的 `import/export`，只支持 CommonJS 的 `require/exports`。

### Q2: 可以使用外部 CDN 吗？
**答**：不可以。Figma 插件必须是完全独立的，不能依赖外部资源。

### Q3: 如何减小文件大小？
**答**：
- 使用 Tree Shaking
- 移除未使用的代码
- 压缩代码
- 避免大型依赖

### Q4: 可以分割成多个文件吗？
**答**：不可以。Figma 严格要求单文件。

---

## 📚 相关资源

- [Vite 文档](https://vitejs.dev/)
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Rollup 打包](https://rollupjs.org/)

---

> 💡 **总结**：单文件打包是通过构建工具将所有模块化的开发代码合并、压缩、内联到一个文件中，同时保持功能完整性。
