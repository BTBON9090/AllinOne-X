// 主题管理 Composable

import { ref, computed, watch, onMounted } from 'vue'
import { generateCSSVariables, designTokens } from '@/styles/tokens'
import { persistentCache } from '@/utils/cache'
import type { Theme } from '@shared/types'

const currentTheme = ref<Theme>('system')
const isDark = ref(false)

export function useTheme() {
  /**
   * 应用主题
   */
  const applyTheme = (theme: Theme) => {
    let actualTheme: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      // 检测系统主题
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      actualTheme = theme
    }

    isDark.value = actualTheme === 'dark'

    // 设置 data-theme 属性
    document.documentElement.setAttribute('data-theme', actualTheme)

    // 生成并应用 CSS 变量
    const cssVars = generateCSSVariables(actualTheme)
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }

  /**
   * 切换主题
   */
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyTheme(theme)
    persistentCache.set('theme', theme)
  }

  /**
   * 切换暗色模式
   */
  const toggleDark = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  /**
   * 监听系统主题变化
   */
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = (e: MediaQueryListEvent) => {
      if (currentTheme.value === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handler)

    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }

  /**
   * 初始化主题
   */
  const initTheme = () => {
    // 从缓存读取主题
    const savedTheme = persistentCache.get<Theme>('theme')
    if (savedTheme) {
      currentTheme.value = savedTheme
    }

    applyTheme(currentTheme.value)
    watchSystemTheme()
  }

  // 计算属性
  const themeIcon = computed(() => {
    if (currentTheme.value === 'system') {
      return '🖥️'
    }
    return isDark.value ? '🌙' : '☀️'
  })

  const themeLabel = computed(() => {
    if (currentTheme.value === 'system') {
      return '跟随系统'
    }
    return isDark.value ? '暗色模式' : '亮色模式'
  })

  return {
    currentTheme,
    isDark,
    themeIcon,
    themeLabel,
    setTheme,
    toggleDark,
    initTheme,
  }
}
