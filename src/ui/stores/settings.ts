// 设置状态管理

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { persistentCache } from '@/utils/cache'
import type { Theme, Language, AIConfig } from '@shared/types'
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from '@shared/constants'

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const theme = ref<Theme>(DEFAULT_THEME)
  const language = ref<Language>(DEFAULT_LANGUAGE)
  const sidebarCollapsed = ref(false)
  const onboardingCompleted = ref(false)
  const aiConfig = ref<AIConfig | null>(null)

  // 操作
  const setTheme = (value: Theme) => {
    theme.value = value
    persistentCache.set('theme', value)
  }

  const setLanguage = (value: Language) => {
    language.value = value
    persistentCache.set('language', value)
  }

  const setSidebarCollapsed = (value: boolean) => {
    sidebarCollapsed.value = value
    persistentCache.set('sidebar-collapsed', value)
  }

  const setOnboardingCompleted = (value: boolean) => {
    onboardingCompleted.value = value
    persistentCache.set('onboarding-completed', value)
  }

  const setAIConfig = (config: AIConfig) => {
    aiConfig.value = config
    persistentCache.set('ai-config', config)
  }

  const loadSettings = () => {
    // 从缓存加载设置
    const savedTheme = persistentCache.get<Theme>('theme')
    if (savedTheme) theme.value = savedTheme

    const savedLanguage = persistentCache.get<Language>('language')
    if (savedLanguage) language.value = savedLanguage

    const savedSidebarCollapsed = persistentCache.get<boolean>('sidebar-collapsed')
    if (savedSidebarCollapsed !== null) sidebarCollapsed.value = savedSidebarCollapsed

    const savedOnboarding = persistentCache.get<boolean>('onboarding-completed')
    if (savedOnboarding !== null) onboardingCompleted.value = savedOnboarding

    const savedAIConfig = persistentCache.get<AIConfig>('ai-config')
    if (savedAIConfig) aiConfig.value = savedAIConfig
  }

  const resetSettings = () => {
    theme.value = DEFAULT_THEME
    language.value = DEFAULT_LANGUAGE
    sidebarCollapsed.value = false
    onboardingCompleted.value = false
    aiConfig.value = null

    persistentCache.clear()
  }

  return {
    // 状态
    theme,
    language,
    sidebarCollapsed,
    onboardingCompleted,
    aiConfig,

    // 操作
    setTheme,
    setLanguage,
    setSidebarCollapsed,
    setOnboardingCompleted,
    setAIConfig,
    loadSettings,
    resetSettings,
  }
})
