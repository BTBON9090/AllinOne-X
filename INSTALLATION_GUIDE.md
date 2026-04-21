# AllinOne-Claude 安装和开发指南

## 📦 安装到 Figma

### 方法一：直接安装（推荐）

1. **构建项目**
   ```bash
   cd AllinOne-Claude
   npm install
   npm run build
   ```

2. **在 Figma Desktop 中安装**
   - 打开 Figma Desktop 应用
   - 点击菜单：`Plugins` → `Development` → `Import plugin from manifest...`
   - 选择项目根目录下的 `manifest.json` 文件
   - 插件会自动加载 `ui.html` 和 `code.js`

3. **运行插件**
   - 在 Figma 中右键点击画布
   - 选择 `Plugins` → `Development` → `AllinOne-Claude`
   - 插件界面会弹出

### 方法二：使用 Figma 插件开发工具

如果你想在开发时实时预览：

1. **安装 Figma Desktop**（必须，Web版不支持开发插件）

2. **导入插件**
   ```bash
   # 确保已构建
   npm run build
   ```

3. **在 Figma 中**
   - `Plugins` → `Development` → `Import plugin from manifest...`
   - 选择 `manifest.json`

4. **每次修改代码后**
   ```bash
   npm run build
   ```
   然后在 Figma 中重新运行插件（会自动加载最新版本）

---

## 💻 在 IDE 中开发

### 推荐的 IDE 设置

#### VS Code（推荐）

1. **安装扩展**
   - Vue Language Features (Volar)
   - TypeScript Vue Plugin (Volar)
   - ESLint
   - Prettier

2. **打开项目**
   ```bash
   cd AllinOne-Claude
   code .
   ```

3. **开发流程**
   ```bash
   # 安装依赖
   npm install

   # 开发时（前端预览，不含 Figma API）
   npm run dev

   # 构建完整插件
   npm run build

   # 只构建前端
   npm run build:ui

   # 只构建后端
   npm run build:plugin
   ```

#### WebStorm / IntelliJ IDEA

1. **打开项目**
   - File → Open → 选择 `AllinOne-Claude` 目录

2. **配置 TypeScript**
   - 自动识别 `tsconfig.json`

3. **运行构建**
   - 在 Terminal 中运行 `npm run build`

---

## 🔧 项目结构说明

### 源代码结构
```
src/
├── ui/                    # 前端源码（Vue 3）
│   ├── components/        # 组件
│   ├── composables/       # 组合式函数
│   ├── stores/            # 状态管理
│   ├── styles/            # 样式
│   ├── utils/             # 工具函数
│   └── App.vue            # 根组件
├── plugin/                # 后端源码（Figma API）
│   └── main.ts            # 插件逻辑
└── shared/                # 共享代码
```

### 构建输出
```
AllinOne-Claude/
├── ui.html               # 单文件前端（Vite 构建）
├── code.js               # 单文件后端（TypeScript 编译）
└── manifest.json         # 插件配置
```

**重要**：Figma 只需要这三个文件：
- `manifest.json` - 插件配置
- `ui.html` - 前端界面（单文件，包含所有 CSS/JS）
- `code.js` - 后端逻辑（单文件，编译后的 TypeScript）

---

## 🛠️ 开发工作流

### 1. 修改前端代码

```bash
# 编辑 src/ui/ 下的文件
# 例如：src/ui/components/features/SimpleTools/SimpleToolsPanel.vue

# 构建
npm run build

# 在 Figma 中重新运行插件查看效果
```

### 2. 修改后端代码

```bash
# 编辑 src/plugin/main.ts

# 构建
npm run build

# 在 Figma 中重新运行插件查看效果
```

### 3. 添加新功能模块

1. **创建组件**
   ```bash
   # 在 src/ui/components/features/ 下创建新文件夹
   mkdir src/ui/components/features/NewFeature
   touch src/ui/components/features/NewFeature/NewFeaturePanel.vue
   ```

2. **在 App.vue 中注册**
   ```vue
   <script setup lang="ts">
   import NewFeaturePanel from '@/components/features/NewFeature/NewFeaturePanel.vue'
   </script>

   <template>
     <div v-else-if="currentFeature === 'newFeature'" class="feature-panel">
       <h2 class="panel-title">新功能</h2>
       <NewFeaturePanel />
     </div>
   </template>
   ```

3. **在 Sidebar.vue 中添加导航**
   ```typescript
   const navItems = [
     // ...
     { id: 'newFeature', label: '新功能', icon: '🆕' },
   ]
   ```

4. **构建并测试**
   ```bash
   npm run build
   ```

---

## 🐛 调试技巧

### 前端调试

1. **在 Figma 中打开开发者工具**
   - Mac: `Cmd + Option + I`
   - Windows: `Ctrl + Shift + I`

2. **查看控制台日志**
   ```typescript
   // 在代码中添加
   console.log('Debug info:', data)
   ```

3. **使用 Vue DevTools**
   - 安装 Vue DevTools 浏览器扩展
   - 在 Figma 开发者工具中查看 Vue 组件状态

### 后端调试

1. **查看 Figma 控制台**
   ```typescript
   // 在 src/plugin/main.ts 中
   console.log('Plugin message:', msg)
   figma.notify('Debug: ' + JSON.stringify(data))
   ```

2. **使用 try-catch**
   ```typescript
   try {
     // 你的代码
   } catch (error) {
     console.error('Error:', error)
     figma.notify('错误: ' + error.message, { error: true })
   }
   ```

---

## 📝 常见问题

### Q1: 修改代码后插件没有更新？

**A**: 需要重新构建并重启插件
```bash
npm run build
# 然后在 Figma 中关闭插件，重新打开
```

### Q2: 构建失败？

**A**: 检查以下几点
```bash
# 1. 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 2. 检查 Node.js 版本（需要 16+）
node --version

# 3. 查看详细错误信息
npm run build
```

### Q3: 插件在 Figma 中无法加载？

**A**: 检查文件路径
- 确保 `manifest.json` 中的路径正确
- 确保 `ui.html` 和 `code.js` 在项目根目录
- 检查文件权限

### Q4: 如何查看构建后的文件大小？

```bash
ls -lh ui.html code.js
```

### Q5: 前端预览（npm run dev）和实际插件有什么区别？

**A**: 
- `npm run dev` - 只预览前端 UI，不包含 Figma API 功能
- 实际插件 - 完整功能，需要在 Figma 中运行

---

## 🚀 发布准备

### 1. 最终构建

```bash
# 清理
rm -rf dist node_modules

# 重新安装
npm install

# 构建
npm run build

# 检查文件
ls -lh ui.html code.js
```

### 2. 测试清单

- [ ] 所有功能模块正常工作
- [ ] 没有控制台错误
- [ ] 性能表现良好
- [ ] 在不同主题下显示正常
- [ ] 首次使用引导正常
- [ ] 设置面板功能正常

### 3. 发布到 Figma 社区

1. 在 Figma 中：`Plugins` → `Development` → `Publish plugin...`
2. 填写插件信息
3. 上传截图和描述
4. 提交审核

---

## 📚 相关资源

- [Figma Plugin API 文档](https://www.figma.com/plugin-docs/)
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)

---

## 💡 开发建议

1. **频繁构建测试**
   - 每次修改后都构建并在 Figma 中测试
   - 不要累积太多修改

2. **使用版本控制**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

3. **保持代码整洁**
   - 遵循现有代码风格
   - 添加必要的注释
   - 使用 TypeScript 类型

4. **性能优化**
   - 避免在循环中进行大量 DOM 操作
   - 使用批量处理
   - 添加防抖节流

---

**祝开发顺利！** 🎉

如有问题，请查看项目文档或提交 Issue。
