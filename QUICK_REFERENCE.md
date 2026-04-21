# 快速参考

## 🚀 快速开始

```bash
# 1. 构建项目
npm run build

# 2. 在 Figma 中导入
# Plugins → Development → Import plugin from manifest
# 选择 manifest.json

# 3. 运行插件
# Plugins → Development → AllinOne-CC
```

## 📁 关键文件

| 文件 | 说明 |
|------|------|
| `ui.html` | 前端界面（104KB） |
| `code.js` | 后端逻辑 |
| `manifest.json` | 插件配置 |
| `src/ui/` | 前端源码 |
| `src/plugin/` | 后端源码 |

## 🎨 设计令牌

```typescript
// 品牌色
--color-primary-500: #8B7FD8

// 间距（8px 基准）
--spacing-1: 4px
--spacing-2: 8px
--spacing-4: 16px

// 圆角
--radius-md: 6px
--radius-lg: 8px

// 动画
--duration-fast: 150ms
--duration-normal: 200ms
```

## 🧩 组件使用

### Button
```vue
<Button variant="primary" size="md" @click="handleClick">
  点击我
</Button>
```

### Input
```vue
<Input 
  v-model="value" 
  placeholder="请输入" 
  :error="errorMessage"
/>
```

### Toast
```typescript
appStore.showNotification({
  type: 'success',
  message: '操作成功',
  duration: 3000
})
```

## 🔧 Composables

### useTheme
```typescript
const { currentTheme, isDark, setTheme, toggleDark } = useTheme()

setTheme('dark')  // 'light' | 'dark' | 'system'
toggleDark()      // 切换暗色模式
```

### useMessage
```typescript
const { send, sendWithResponse, listen } = useMessage()

// 发送消息
send('save-storage', { key: 'theme', value: 'dark' })

// 发送并等待响应
const result = await sendWithResponse('get-selection-count')

// 监听消息
listen((message) => {
  console.log(message)
})
```

## 📦 状态管理

### appStore
```typescript
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 设置加载状态
appStore.setLoading(true)

// 显示通知
appStore.showNotification({
  type: 'success',
  message: '操作成功'
})

// 切换功能
appStore.setCurrentFeature('smartFill')
```

### settingsStore
```typescript
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

// 设置主题
settingsStore.setTheme('dark')

// 设置语言
settingsStore.setLanguage('zh')

// 加载设置
settingsStore.loadSettings()
```

## 🛠️ 工具函数

### 验证
```typescript
import { validateStringLength, validateURL } from '@/utils/validator'

const result = validateStringLength(value, 1, 100)
if (!result.valid) {
  console.error(result.error)
}
```

### 缓存
```typescript
import { memoryCache, persistentCache } from '@/utils/cache'

// 内存缓存
memoryCache.set('key', value, 5 * 60 * 1000) // 5分钟
const cached = memoryCache.get('key')

// 持久化缓存
persistentCache.set('key', value)
const saved = persistentCache.get('key')
```

### 异步工具
```typescript
import { debounce, throttle, batchExecute } from '@/utils/async'

// 防抖
const debouncedFn = debounce(fn, 300)

// 节流
const throttledFn = throttle(fn, 150)

// 批量执行
await batchExecute(items, async (item) => {
  // 处理每个项目
}, 50)
```

## 🔌 插件 API

### 收集文本节点
```typescript
const textNodes = collectTextNodes(figma.currentPage)
```

### 视觉排序
```typescript
const sorted = sortNodesByPosition(nodes)
```

### 安全设置文本
```typescript
const success = await setTextSafe(textNode, '新文本')
```

### 批量处理
```typescript
await batchExecute(
  nodes,
  async (node, index) => {
    // 处理节点
  },
  50,
  (current, total) => {
    console.log(`进度: ${current}/${total}`)
  }
)
```

## 🎯 常用操作

### 添加新功能模块

1. 创建组件：`src/ui/components/features/YourFeature/`
2. 添加到侧边栏：`src/ui/components/layout/Sidebar.vue`
3. 添加路由：`src/ui/App.vue`
4. 添加后端处理：`src/plugin/main.ts`

### 添加新的设计令牌

1. 更新：`src/ui/styles/tokens.ts`
2. 生成 CSS 变量：`generateCSSVariables()`
3. 在组件中使用：`var(--your-token)`

### 添加新的动画

1. 定义：`src/ui/styles/animations.ts`
2. 添加关键帧
3. 在组件中使用：`animation: yourAnimation`

## 🐛 调试

### 前端调试
```typescript
import { logger } from '@/utils/logger'

logger.debug('调试信息', { data })
logger.info('普通信息')
logger.warn('警告信息')
logger.error('错误信息')
```

### 后端调试
```typescript
console.log('后端日志')
figma.notify('用户提示')
```

### 查看日志
```
Figma Desktop:
Plugins → Development → Open Console
```

## 📊 性能监控

```typescript
// 记录操作
logOperation('operation-name', { details })

// 批量处理进度
await batchExecute(items, processor, 50, (current, total) => {
  console.log(`${current}/${total}`)
})
```

## 🔑 快捷键（计划中）

| 快捷键 | 功能 |
|--------|------|
| `Cmd+K` | 命令面板 |
| `Cmd+,` | 设置 |
| `Cmd+/` | 切换侧边栏 |

## 📝 提交规范

```bash
# 功能
git commit -m "feat: 添加新功能"

# 修复
git commit -m "fix: 修复 bug"

# 文档
git commit -m "docs: 更新文档"

# 样式
git commit -m "style: 更新样式"

# 重构
git commit -m "refactor: 重构代码"

# 性能
git commit -m "perf: 性能优化"

# 测试
git commit -m "test: 添加测试"
```

## 🆘 常见问题

### Q: 构建失败？
```bash
# 清理并重新构建
rm -rf dist node_modules
npm install
npm run build
```

### Q: 插件无法加载？
1. 检查 `manifest.json` 是否正确
2. 检查 `code.js` 和 `ui.html` 是否存在
3. 重新导入插件

### Q: UI 不显示？
1. 打开控制台查看错误
2. 检查 `ui.html` 是否正确生成
3. 检查浏览器兼容性

### Q: 功能不工作？
1. 检查后端日志
2. 检查消息通信
3. 检查节点选择

---

> 💡 **提示**：保存此文件以便快速查阅！
