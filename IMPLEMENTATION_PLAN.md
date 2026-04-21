# AllinOne-Claude 极简现代风重构实施计划

> 基于 Figma 插件规范的现代化架构重构方案
> 
> 创建日期：2026-04-17

---

## 目录

1. [技术方案](#1-技术方案)
2. [设计系统](#2-设计系统)
3. [开发计划](#3-开发计划)
4. [实施步骤](#4-实施步骤)

---

## 1. 技术方案

### 1.1 架构设计

#### Figma 插件约束
- ✅ 最终输出：单一 `ui.html` + 单一 `code.js`
- ✅ 开发模式：模块化开发，构建时打包为单文件
- ✅ 兼容性：支持后续功能迭代

#### 技术栈选择

```
开发环境：
├── 前端框架：Vue 3.4 + TypeScript 5.0
├── 构建工具：Vite 5.0
├── 状态管理：Pinia
├── 样式方案：CSS-in-JS (内联到 HTML)
├── 打包策略：vite-plugin-singlefile
└── 类型检查：TypeScript strict mode

生产环境：
├── ui.html (单文件，包含所有 CSS/JS)
└── code.js (单文件，编译后的 TS)
```

### 1.2 构建流程

```
开发阶段                    构建阶段                   输出
─────────────────────────────────────────────────────────────
src/ui/                     Vite Build              ui.html
├── components/      ──→   ├── 编译 Vue SFC         (单文件)
├── styles/          ──→   ├── 提取 CSS             ├── HTML
├── stores/          ──→   ├── 打包 JS              ├── <style>
└── main.ts          ──→   └── 内联所有资源         └── <script>

src/plugin/                 TSC Compile             code.js
├── handlers/        ──→   ├── 编译 TS              (单文件)
├── utils/           ──→   └── 打包为单文件
└── main.ts
```

### 1.3 项目结构

```
AllinOne-Claude/
├── src/
│   ├── ui/                          # 前端源码
│   │   ├── components/              # Vue 组件
│   │   │   ├── common/              # 通用组件
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Input.vue
│   │   │   │   ├── Card.vue
│   │   │   │   ├── Toast.vue
│   │   │   │   └── Loading.vue
│   │   │   ├── layout/              # 布局组件
│   │   │   │   ├── Sidebar.vue
│   │   │   │   ├── MainContent.vue
│   │   │   │   └── ResizeHandle.vue
│   │   │   └── features/            # 功能模块
│   │   │       ├── SmartFill/
│   │   │       │   ├── SmartFillPanel.vue
│   │   │       │   └── SmartFillConfig.vue
│   │   │       ├── TextReplace/
│   │   │       ├── PPTExport/
│   │   │       └── ...
│   │   ├── composables/             # 组合式函数
│   │   │   ├── useTheme.ts          # 主题管理
│   │   │   ├── useMessage.ts        # 消息通信
│   │   │   ├── useI18n.ts           # 国际化
│   │   │   ├── useResize.ts         # 窗口调整
│   │   │   └── useAnimation.ts      # 动画控制
│   │   ├── stores/                  # Pinia 状态
│   │   │   ├── app.ts               # 应用状态
│   │   │   ├── settings.ts          # 设置
│   │   │   └── features.ts          # 功能状态
│   │   ├── styles/                  # 样式
│   │   │   ├── tokens.ts            # 设计令牌
│   │   │   ├── animations.ts        # 动画定义
│   │   │   └── global.css           # 全局样式
│   │   ├── utils/                   # 工具函数
│   │   │   ├── message.ts           # 消息封装
│   │   │   ├── validator.ts         # 输入验证
│   │   │   ├── logger.ts            # 日志系统
│   │   │   └── cache.ts             # 缓存管理
│   │   ├── types/                   # 类型定义
│   │   │   └── index.ts
│   │   ├── App.vue                  # 根组件
│   │   ├── main.ts                  # 入口文件
│   │   └── index.html               # HTML 模板
│   │
│   ├── plugin/                      # 后端源码
│   │   ├── handlers/                # 消息处理器
│   │   │   ├── smartFill.ts
│   │   │   ├── textReplace.ts
│   │   │   ├── selection.ts
│   │   │   └── index.ts
│   │   ├── utils/                   # 工具函数
│   │   │   ├── nodeUtils.ts
│   │   │   ├── asyncQueue.ts        # 异步队列
│   │   │   └── errorHandler.ts      # 错误处理
│   │   ├── types/                   # 类型定义
│   │   │   └── index.ts
│   │   └── main.ts                  # 入口文件
│   │
│   └── shared/                      # 共享代码
│       ├── constants.ts             # 常量
│       ├── types.ts                 # 共享类型
│       └── messages.ts              # 消息类型定义
│
├── dist/                            # 构建输出
│   ├── ui.html                      # 单文件前端
│   └── code.js                      # 单文件后端
│
├── manifest.json                    # 插件配置
├── package.json
├── vite.config.ts                   # Vite 配置
├── tsconfig.json                    # TS 配置
└── README.md
```

---

## 2. 设计系统

### 2.1 设计令牌（Design Tokens）

```typescript
// src/ui/styles/tokens.ts

export const designTokens = {
  // 品牌色：饱和度较低的蓝紫色
  colors: {
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B7FD8',  // 主色
      600: '#7C6FCC',
      700: '#6D5FB8',
      800: '#5E4FA4',
      900: '#4F3F90',
    },
    
    // 中性色
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // 语义色
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  // 间距系统（8px 基准）
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },
  
  // 圆角
  radius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },
  
  // 阴影（极简风格，非常轻微）
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.02)',
    md: '0 2px 4px rgba(0, 0, 0, 0.03)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.04)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.05)',
  },
  
  // 字体
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '13px',
      lg: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // 动画
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // 布局
  layout: {
    sidebarWidth: '140px',
    sidebarWidthCollapsed: '56px',
    minWindowWidth: '400px',
    minWindowHeight: '500px',
  },
}

// 暗色模式令牌
export const darkTokens = {
  colors: {
    primary: {
      // 暗色模式下提高亮度
      500: '#A78BFA',
    },
    neutral: {
      // 反转中性色
      0: '#0A0A0A',
      50: '#171717',
      // ...
    },
  },
}
```

### 2.2 微交互动画

```typescript
// src/ui/styles/animations.ts

export const animations = {
  // 淡入
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  // 滑入
  slideInUp: {
    from: { 
      opacity: 0, 
      transform: 'translateY(8px)' 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0)' 
    },
  },
  
  // 缩放
  scaleIn: {
    from: { 
      opacity: 0, 
      transform: 'scale(0.95)' 
    },
    to: { 
      opacity: 1, 
      transform: 'scale(1)' 
    },
  },
  
  // 按钮悬停
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
  },
  
  // 按钮按下
  buttonActive: {
    transform: 'translateY(0)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  },
  
  // 涟漪效果
  ripple: {
    keyframes: `
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 0.5;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `,
    animation: 'ripple 600ms ease-out',
  },
  
  // 骨架屏脉冲
  pulse: {
    keyframes: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  // 加载旋转
  spin: {
    keyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    animation: 'spin 1s linear infinite',
  },
}
```

### 2.3 响应式布局

```typescript
// src/ui/composables/useResize.ts

export function useResize() {
  const minWidth = 400
  const minHeight = 500
  const sidebarWidth = ref(140)
  const sidebarCollapsed = ref(false)
  
  // 自动折叠侧边栏
  const checkSidebarCollapse = () => {
    if (window.innerWidth < 600) {
      sidebarCollapsed.value = true
    }
  }
  
  // 手动拖拽调整窗口
  const handleResize = (e: MouseEvent) => {
    const newWidth = Math.max(minWidth, e.clientX)
    const newHeight = Math.max(minHeight, e.clientY)
    
    parent.postMessage({
      pluginMessage: {
        type: 'resize',
        width: newWidth,
        height: newHeight,
      }
    }, '*')
  }
  
  return {
    sidebarWidth,
    sidebarCollapsed,
    checkSidebarCollapse,
    handleResize,
  }
}
```

---

## 3. 开发计划

### Phase 1: 基础架构搭建（3-4 天）

#### Day 1: 项目初始化
- [x] 创建新的项目结构
- [ ] 配置 Vite + Vue 3 + TypeScript
- [ ] 配置单文件打包
- [ ] 设置 ESLint + Prettier
- [ ] 配置 Git 工作流

#### Day 2: 设计系统实现
- [ ] 实现设计令牌系统
- [ ] 创建 CSS 变量生成器
- [ ] 实现主题切换逻辑
- [ ] 创建动画系统

#### Day 3: 基础组件开发
- [ ] Button 组件
- [ ] Input 组件
- [ ] Card 组件
- [ ] Toast 通知组件
- [ ] Loading 加载组件

#### Day 4: 布局组件开发
- [ ] Sidebar 侧边栏
- [ ] MainContent 主内容区
- [ ] ResizeHandle 调整手柄
- [ ] 响应式布局实现

### Phase 2: 核心功能迁移（5-7 天）

#### Day 5-6: 消息通信系统
- [ ] 实现 useMessage composable
- [ ] 类型安全的消息定义
- [ ] 错误处理机制
- [ ] 日志系统

#### Day 7-8: 状态管理
- [ ] Pinia store 设置
- [ ] 应用状态管理
- [ ] 设置持久化
- [ ] 缓存策略

#### Day 9-11: 功能模块迁移
- [ ] 简易工具模块
- [ ] 智能填充模块
- [ ] 文字替换模块
- [ ] 超级选择模块
- [ ] PPT 导出模块

### Phase 3: Bug 修复与优化（3-4 天）

#### Day 12: Bug 修复
- [ ] 修复文本拼合问题
- [ ] 修复异步竞态条件
- [ ] 修复字体加载问题
- [ ] 修复内存泄漏

#### Day 13: 性能优化
- [ ] 虚拟滚动实现
- [ ] 防抖节流优化
- [ ] 缓存策略优化
- [ ] 批量操作优化

#### Day 14: 错误处理
- [ ] 全局错误边界
- [ ] 输入验证系统
- [ ] 错误日志记录
- [ ] 降级策略

#### Day 15: 用户体验优化
- [ ] 首次使用引导
- [ ] 功能提示系统
- [ ] 加载状态优化
- [ ] 成功/错误提示

### Phase 4: 测试与发布（2-3 天）

#### Day 16: 测试
- [ ] 功能测试
- [ ] 性能测试
- [ ] 兼容性测试
- [ ] 用户测试

#### Day 17: 文档与发布
- [ ] 更新文档
- [ ] 构建生产版本
- [ ] 发布准备
- [ ] 版本发布

---

## 4. 实施步骤

### Step 1: 项目初始化

现在开始执行第一步：创建新的项目结构并配置构建系统。

