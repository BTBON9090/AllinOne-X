# 构建流程可视化

## 🎯 完整构建流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                     开发阶段（模块化）                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         npm run build                    │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │  npm run build:ui │       │ npm run build:    │
    │                   │       │     plugin        │
    │  (Vite 构建)      │       │  (TypeScript)     │
    └───────────────────┘       └───────────────────┘
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │  src/ui/          │       │  src/plugin/      │
    │  ├── App.vue      │       │  └── main.ts      │
    │  ├── components/  │       │                   │
    │  ├── stores/      │       │  编译为 CommonJS  │
    │  └── styles/      │       │                   │
    │                   │       │  dist/plugin/     │
    │  编译 + 打包      │       │  └── main.js      │
    │                   │       │                   │
    │  dist/index.html  │       │                   │
    │  (104KB 单文件)   │       │                   │
    └───────────────────┘       └───────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │  npm run post-build     │
                │  (scripts/post-build.cjs)│
                └─────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │   ui.html         │       │   code.js         │
    │   (104KB)         │       │   (~15KB)         │
    │                   │       │                   │
    │   完整的前端界面   │       │   var __html__ =  │
    │   - HTML          │       │   "<!DOCTYPE..."; │
    │   - CSS (内联)    │       │                   │
    │   - JS (内联)     │       │   + 插件逻辑      │
    └───────────────────┘       └───────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │   Figma 插件            │
                │   可以运行！            │
                └─────────────────────────┘
```

---

## 🔄 前端构建详细流程

```
src/ui/main.ts
    │
    ├─ import App from './App.vue'
    ├─ import { createPinia } from 'pinia'
    └─ import './styles/global.css'
    │
    ▼
┌─────────────────────────────────────┐
│         Vite 处理                    │
├─────────────────────────────────────┤
│ 1. 解析 Vue 单文件组件 (.vue)       │
│    App.vue → JavaScript + CSS       │
│                                     │
│ 2. 编译 TypeScript                  │
│    .ts → .js                        │
│                                     │
│ 3. 处理 CSS                         │
│    global.css + 组件样式 → 单个CSS  │
│                                     │
│ 4. 打包所有依赖                     │
│    Vue 3 + Pinia + 应用代码         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│    vite-plugin-singlefile           │
├─────────────────────────────────────┤
│ 1. 读取生成的 JS 文件               │
│ 2. 读取生成的 CSS 文件              │
│ 3. 内联到 HTML                      │
│    <style>CSS 内容</style>          │
│    <script>JS 内容</script>         │
│ 4. 删除外部引用                     │
└─────────────────────────────────────┘
    │
    ▼
dist/index.html (104KB)
```

---

## 🔧 后端构建详细流程

```
src/plugin/main.ts
    │
    ├─ 内联所有工具函数
    ├─ collectTextNodes()
    ├─ sortNodesByPosition()
    └─ setTextSafe()
    │
    ▼
┌─────────────────────────────────────┐
│      TypeScript 编译器 (tsc)        │
├─────────────────────────────────────┤
│ 1. 编译 TypeScript → JavaScript     │
│    target: ES2017                   │
│    module: CommonJS                 │
│                                     │
│ 2. 类型检查                         │
│    检查所有类型错误                 │
│                                     │
│ 3. 输出到 dist/                     │
│    保持目录结构                     │
└─────────────────────────────────────┘
    │
    ▼
dist/plugin/main.js
    │
    ├─ "use strict";
    ├─ function collectTextNodes() {...}
    ├─ function sortNodesByPosition() {...}
    └─ figma.ui.onmessage = async (msg) => {...}
```

---

## 🔗 合并流程详细说明

```
┌─────────────────────────────────────┐
│   dist/index.html (前端)            │
│   <!DOCTYPE html>                   │
│   <html>                            │
│     <style>CSS...</style>           │
│     <script>JS...</script>          │
│   </html>                           │
└─────────────────────────────────────┘
    │
    │ 读取并转为字符串
    ▼
┌─────────────────────────────────────┐
│   JSON.stringify(html)              │
│   "<!DOCTYPE html>\n<html>..."      │
└─────────────────────────────────────┘
    │
    │ 注入到插件代码
    ▼
┌─────────────────────────────────────┐
│   var __html__ = "<!DOCTYPE...";    │
│                                     │
│   + dist/plugin/main.js             │
│                                     │
│   = code.js                         │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│   最终输出                          │
├─────────────────────────────────────┤
│   ui.html  (104KB)                  │
│   code.js  (~15KB)                  │
└─────────────────────────────────────┘
```

---

## 📦 文件大小分解

```
ui.html (104KB)
├─ HTML 结构          ~2KB   (2%)
├─ CSS 样式          ~20KB  (19%)
│  ├─ 设计令牌        ~3KB
│  ├─ 全局样式        ~5KB
│  ├─ 组件样式       ~10KB
│  └─ 动画定义        ~2KB
└─ JavaScript        ~82KB  (79%)
   ├─ Vue 3 运行时   ~40KB
   ├─ Pinia          ~5KB
   ├─ 应用代码       ~30KB
   └─ 工具函数        ~7KB

code.js (~15KB)
├─ __html__ 变量    ~104KB (字符串)
└─ 插件逻辑          ~15KB
   ├─ 工具函数        ~8KB
   ├─ 消息处理        ~5KB
   └─ 初始化代码      ~2KB

总计: ~119KB (压缩后)
```

---

## 🎨 内联示例

### CSS 内联
```html
<!-- 开发时 -->
<link rel="stylesheet" href="global.css">
<link rel="stylesheet" href="components.css">

<!-- 构建后 -->
<style>
  /* global.css 的内容 */
  :root { --primary: #8B7FD8; }
  body { font-family: sans-serif; }
  
  /* components.css 的内容 */
  .btn { padding: 8px 16px; }
  .input { border: 1px solid #ccc; }
</style>
```

### JavaScript 内联
```html
<!-- 开发时 -->
<script type="module" src="main.js"></script>

<!-- 构建后 -->
<script>
  // Vue 3 运行时
  var Vue = (function() { ... })();
  
  // Pinia
  var Pinia = (function() { ... })();
  
  // 应用代码
  var app = Vue.createApp({ ... });
  app.use(Pinia.createPinia());
  app.mount('#app');
</script>
```

---

## 🚀 性能优化

### 构建时优化
```
1. Tree Shaking
   移除未使用的代码
   Vue 3: 40KB → 实际使用 ~30KB

2. 代码压缩
   Terser 压缩
   原始: 200KB → 压缩后: 104KB

3. CSS 优化
   移除未使用的样式
   合并重复的规则

4. 内联资源
   图片 → Base64
   字体 → Base64 (如果有)
```

### 运行时优化
```
1. 懒加载
   组件按需加载
   
2. 虚拟滚动
   长列表优化
   
3. 缓存策略
   内存缓存 + 持久化
   
4. 防抖节流
   减少不必要的操作
```

---

## 🔍 验证清单

### ✅ 构建成功
```bash
npm run build
# 看到: 🎉 Build completed successfully!
```

### ✅ 文件存在
```bash
ls -lh ui.html code.js
# ui.html  ~104KB
# code.js  ~15KB
```

### ✅ 单文件验证
```bash
# 检查 ui.html 没有外部引用
grep -E '<link|<script src' ui.html
# 应该没有输出

# 检查 code.js 有 __html__
head -5 code.js
# 应该看到: var __html__ = "<!DOCTYPE...
```

### ✅ 在 Figma 中测试
```
1. 导入 manifest.json
2. 运行插件
3. 检查 UI 显示
4. 测试功能
5. 查看控制台无错误
```

---

> 💡 **关键点**：单文件打包通过构建工具将模块化代码合并、压缩、内联，最终生成符合 Figma 规范的单文件输出。
