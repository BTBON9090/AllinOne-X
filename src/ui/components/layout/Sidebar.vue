<template>
  <aside :class="['sidebar', { 'sidebar-collapsed': collapsed }]">
    <div class="sidebar-header">
      <h1 v-if="!collapsed" class="sidebar-title">AllinOne</h1>
      <button class="sidebar-toggle" @click="toggleCollapse">
        <span class="toggle-icon">{{ collapsed ? '→' : '←' }}</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.id"
        :class="['nav-item', { active: currentFeature === item.id }]"
        @click="selectFeature(item.id)"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <button class="footer-btn" @click="openSettings">
        <span class="nav-icon">⚙️</span>
        <span v-if="!collapsed" class="nav-text">设置</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'

interface Props {
  collapsed: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'select-feature': [id: string]
  'open-settings': []
}>()

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const currentFeature = computed(() => appStore.currentFeature)

const navItems = [
  { id: 'simple', label: '简易工具', icon: '🛠️' },
  { id: 'select', label: '超级选择', icon: '🎯' },
  { id: 'smartFill', label: '智能填充', icon: '✨' },
  { id: 'replace', label: '文字替换', icon: '📝' },
  { id: 'ai', label: 'AI 助手', icon: '🤖' },
  { id: 'ppt', label: 'PPT导出', icon: '📊' },
  { id: 'refiner', label: '组件清洗', icon: '🧹' },
  { id: 'jumpback', label: '时空信标', icon: '🔖' },
  { id: 'skew', label: '等轴形变', icon: '📐' },
  { id: 'i18n', label: '语言切换', icon: '🌐' },
  { id: 'theory', label: '设计理论', icon: '📚' },
]

const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
  settingsStore.setSidebarCollapsed(!props.collapsed)
}

const selectFeature = (id: string) => {
  emit('select-feature', id)
  appStore.setCurrentFeature(id)
}

const openSettings = () => {
  emit('open-settings')
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-neutral-0);
  border-right: 1px solid var(--color-neutral-200);
  transition: width var(--duration-normal) var(--ease-default);
  flex-shrink: 0;
}

.sidebar-collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-200);
}

.sidebar-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-primary-500);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-neutral-500);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.sidebar-toggle:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
}

.toggle-icon {
  font-size: 14px;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-1);
  border-radius: var(--radius-md);
  color: var(--color-neutral-600);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  user-select: none;
}

.nav-item:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

.nav-item.active {
  background: rgba(139, 127, 216, 0.1);
  color: var(--color-primary-500);
  font-weight: var(--font-medium);
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: var(--text-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  padding: var(--spacing-3);
  border-top: 1px solid var(--color-neutral-200);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3);
  background: none;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  color: var(--color-neutral-600);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.footer-btn:hover {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
  color: var(--color-neutral-900);
}

/* 暗色模式 */
[data-theme='dark'] .sidebar {
  background: var(--color-neutral-950);
  border-right-color: var(--color-neutral-800);
}

[data-theme='dark'] .sidebar-header {
  border-bottom-color: var(--color-neutral-800);
}

[data-theme='dark'] .sidebar-toggle:hover {
  background: var(--color-neutral-800);
  color: var(--color-neutral-300);
}

[data-theme='dark'] .nav-item {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .nav-item:hover {
  background: var(--color-neutral-800);
  color: var(--color-neutral-100);
}

[data-theme='dark'] .nav-item.active {
  background: rgba(139, 127, 216, 0.2);
  color: var(--color-primary-400);
}

[data-theme='dark'] .sidebar-footer {
  border-top-color: var(--color-neutral-800);
}

[data-theme='dark'] .footer-btn {
  border-color: var(--color-neutral-800);
  color: var(--color-neutral-400);
}

[data-theme='dark'] .footer-btn:hover {
  background: var(--color-neutral-800);
  border-color: var(--color-neutral-700);
  color: var(--color-neutral-100);
}
</style>
