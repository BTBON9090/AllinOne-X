// 设计令牌系统 - 极简现代风
// 品牌色：饱和度较低的蓝紫色

export const designTokens = {
  // 颜色系统
  colors: {
    // 品牌色：饱和度较低的蓝紫色
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

    // 中性色 - 极简风格
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
      successLight: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B',
      warningLight: 'rgba(245, 158, 11, 0.1)',
      error: '#EF4444',
      errorLight: 'rgba(239, 68, 68, 0.1)',
      info: '#3B82F6',
      infoLight: 'rgba(59, 130, 246, 0.1)',
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
      500: '#A78BFA', // 暗色模式下提高亮度
    },
    neutral: {
      0: '#0A0A0A',
      50: '#171717',
      100: '#262626',
      200: '#404040',
      300: '#525252',
      400: '#737373',
      500: '#A3A3A3',
      600: '#D4D4D4',
      700: '#E5E5E5',
      800: '#F5F5F5',
      900: '#FAFAFA',
      950: '#FFFFFF',
    },
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.6)',
  },
}

// 生成 CSS 变量
export function generateCSSVariables(theme: 'light' | 'dark' = 'light') {
  const tokens = theme === 'dark' ? { ...designTokens, ...darkTokens } : designTokens

  const cssVars: Record<string, string> = {}

  // 颜色
  Object.entries(tokens.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value
  })

  Object.entries(tokens.colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value
  })

  Object.entries(tokens.colors.semantic).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value
  })

  // 间距
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })

  // 圆角
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value
  })

  // 阴影
  Object.entries(tokens.shadow).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value
  })

  // 字体
  cssVars['--font-sans'] = tokens.typography.fontFamily.sans
  cssVars['--font-mono'] = tokens.typography.fontFamily.mono

  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--text-${key}`] = value
  })

  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    cssVars[`--font-${key}`] = String(value)
  })

  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    cssVars[`--leading-${key}`] = String(value)
  })

  // 动画
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    cssVars[`--duration-${key}`] = value
  })

  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    cssVars[`--ease-${key}`] = value
  })

  // 布局
  Object.entries(tokens.layout).forEach(([key, value]) => {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    cssVars[`--${kebabKey}`] = value
  })

  return cssVars
}
