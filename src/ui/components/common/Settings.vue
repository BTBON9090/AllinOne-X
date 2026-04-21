<template>
  <div v-if="show" class="settings-overlay" @click.self="close">
    <div class="settings-panel">
      <!-- 头部 -->
      <div class="settings-header">
        <h2 class="settings-title">设置</h2>
        <button class="btn-close" @click="close">✕</button>
      </div>

      <!-- 内容 -->
      <div class="settings-content">
        <!-- 外观设置 -->
        <div class="settings-section">
          <h3 class="section-title">外观</h3>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">主题</span>
              <span class="label-desc">选择界面主题</span>
            </div>
            <div class="theme-options">
              <button
                v-for="t in themes"
                :key="t.value"
                :class="['theme-btn', { active: theme === t.value }]"
                @click="setTheme(t.value)"
              >
                <span class="theme-icon">{{ t.icon }}</span>
                <span class="theme-name">{{ t.label }}</span>
              </button>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">侧边栏</span>
              <span class="label-desc">默认展开或折叠</span>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="!sidebarCollapsed"
                @change="toggleSidebar"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- 语言设置 -->
        <div class="settings-section">
          <h3 class="section-title">语言</h3>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">界面语言</span>
              <span class="label-desc">选择显示语言</span>
            </div>
            <select
              v-model="language"
              class="select-input"
              @change="setLanguage(language)"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="settings-section">
          <h3 class="section-title">数据管理</h3>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">清除缓存</span>
              <span class="label-desc">清除所有本地缓存数据</span>
            </div>
            <button class="btn-action" @click="clearCache">
              清除
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">重置设置</span>
              <span class="label-desc">恢复所有默认设置</span>
            </div>
            <button class="btn-action btn-danger" @click="resetSettings">
              重置
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-label">
              <span class="label-text">重新显示引导</span>
              <span class="label-desc">再次查看新手引导</span>
            </div>
            <button class="btn-action" @click="showOnboarding">
              显示引导
            </button>
          </div>
        </div>

        <!-- 关于 -->
        <div class="settings-section">
          <h3 class="section-title">关于</h3>

          <div class="about-info">
            <div class="info-row">
              <span class="info-label">插件名称</span>
              <span class="info-value">AllinOne-Claude</span>
            </div>
            <div class="info-row">
              <span class="info-label">版本</span>
              <span class="info-value">2.0.0</span>
            </div>
            <div class="info-row">
              <span class="info-label">更新日期</span>
              <span class="info-value">2026-04-17</span>
            </div>
          </div>

          <div class="about-links">
            <a href="#" class="link-item" @click.prevent="openDocs">
              📚 使用文档
            </a>
            <a href="#" class="link-item" @click.prevent="openFeedback">
              💬 反馈建议
            </a>
            <a href="#" class="link-item" @click.prevent="openGithub">
              🔗 GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="settings-footer">
        <button class="btn-primary" @click="close">
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'

const settingsStore = useSettingsStore()
const appStore = useAppStore()

const show = ref(false)

const theme = computed(() => settingsStore.theme)
const language = computed(() => settingsStore.language)
const sidebarCollapsed = computed(() => settingsStore.sidebarCollapsed)

const themes = [
  { value: 'light', label: '浅色', icon: '☀️' },
  { value: 'dark', label: '深色', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' },
]

const setTheme = (value: any) => {
  settingsStore.setTheme(value)
}

const setLanguage = (value: any) => {
  settingsStore.setLanguage(value)
}

const toggleSidebar = () => {
  settingsStore.setSidebarCollapsed(!sidebarCollapsed.value)
}

const clearCache = () => {
  if (confirm('确定要清除所有缓存数据吗？')) {
    // 清除缓存逻辑
    appStore.addNotification({
      type: 'success',
      message: '缓存已清除'
    })
  }
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？此操作不可恢复。')) {
    settingsStore.resetSettings()
    appStore.addNotification({
      type: 'success',
      message: '设置已重置'
    })
  }
}

const showOnboarding = () => {
  settingsStore.setOnboardingCompleted(false)
  close()
  // 触发显示引导
  setTimeout(() => {
    window.location.reload()
  }, 300)
}

const openDocs = () => {
  appStore.addNotification({
    type: 'info',
    message: '文档功能开发中'
  })
}

const openFeedback = () => {
  appStore.addNotification({
    type: 'info',
    message: '反馈功能开发中'
  })
}

const openGithub = () => {
  appStore.addNotification({
    type: 'info',
    message: 'GitHub链接功能开发中'
  })
}

const close = () => {
  show.value = false
}

defineExpose({
  show: () => {
    show.value = true
  },
  close
})
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-panel {
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-5) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
}

.settings-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  font-size: 20px;
  color: var(--color-neutral-600);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-close:hover {
  background: var(--color-bg-secondary);
  color: var(--color-neutral-900);
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

.settings-section {
  margin-bottom: var(--spacing-6);
}

.settings-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-4);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-text {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.label-desc {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.theme-options {
  display: flex;
  gap: var(--spacing-2);
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.theme-btn:hover {
  border-color: var(--color-primary-500);
}

.theme-btn.active {
  background: rgba(139, 127, 216, 0.1);
  border-color: var(--color-primary-500);
}

.theme-icon {
  font-size: 20px;
}

.theme-name {
  font-size: var(--text-xs);
  color: var(--color-neutral-700);
  white-space: nowrap;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 28px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-neutral-300);
  border-radius: 14px;
  transition: all var(--duration-fast);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background: white;
  border-radius: 50%;
  transition: all var(--duration-fast);
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--color-primary-500);
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.select-input {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
}

.btn-action {
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-action:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-500);
}

.btn-action.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

.about-info {
  padding: var(--spacing-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2) 0;
  font-size: var(--text-sm);
}

.info-row:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.info-label {
  color: var(--color-neutral-600);
}

.info-value {
  color: var(--color-neutral-900);
  font-weight: var(--font-medium);
}

.about-links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.link-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  text-decoration: none;
  transition: all var(--duration-fast);
}

.link-item:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.settings-footer {
  padding: var(--spacing-5) var(--spacing-6);
  border-top: 1px solid var(--color-border);
}

.btn-primary {
  width: 100%;
  padding: var(--spacing-3);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

[data-theme='dark'] .settings-title,
[data-theme='dark'] .section-title,
[data-theme='dark'] .label-text,
[data-theme='dark'] .info-value {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .label-desc,
[data-theme='dark'] .info-label {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .theme-name {
  color: var(--color-neutral-300);
}

[data-theme='dark'] .select-input,
[data-theme='dark'] .btn-action,
[data-theme='dark'] .about-info,
[data-theme='dark'] .link-item {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}
</style>
