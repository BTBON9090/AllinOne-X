<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      @update:collapsed="sidebarCollapsed = $event"
      @select-feature="handleFeatureSelect"
      @open-settings="showSettings = true"
    />

    <!-- 主内容区 -->
    <MainContent>
      <div v-if="currentFeature === 'simple'" class="feature-panel">
        <h2 class="panel-title">简易工具</h2>
        <p class="panel-description">快速执行常用的设计操作</p>
        <SimpleToolsPanel />
      </div>

      <div v-else-if="currentFeature === 'select'" class="feature-panel">
        <h2 class="panel-title">超级选择</h2>
        <p class="panel-description">高级选择和过滤功能</p>
        <SuperSelectPanel />
      </div>

      <div v-else-if="currentFeature === 'smartFill'" class="feature-panel">
        <h2 class="panel-title">智能填充</h2>
        <p class="panel-description">批量填充文本内容</p>
        <SmartFillPanel />
      </div>

      <div v-else-if="currentFeature === 'jumpback'" class="feature-panel">
        <h2 class="panel-title">时空信标</h2>
        <p class="panel-description">保存和跳转到特定视图位置</p>
        <JumpbackPanel />
      </div>

      <div v-else-if="currentFeature === 'skew'" class="feature-panel">
        <h2 class="panel-title">等轴形变</h2>
        <p class="panel-description">旋转和倾斜变形工具</p>
        <SkewPanel />
      </div>

      <div v-else-if="currentFeature === 'replace'" class="feature-panel">
        <h2 class="panel-title">文字替换</h2>
        <p class="panel-description">批量���找和替换文本</p>
        <TextReplacePanel />
      </div>

      <div v-else class="feature-panel">
        <h2 class="panel-title">{{ currentFeature }}</h2>
        <p class="panel-description">功能开发中...</p>
      </div>
    </MainContent>

    <!-- 调整手柄 -->
    <ResizeHandle @start-resize="startResize" />

    <!-- Toast 通知容器 -->
    <div class="toast-container">
      <Toast
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        :message="notification.message"
        :duration="notification.duration"
        @close="removeNotification(notification.id)"
      />
    </div>

    <!-- 全局加载 -->
    <div v-if="isLoading" class="global-loading">
      <Loading type="spinner" text="加载中..." />
    </div>

    <!-- 首次使用引导 -->
    <Onboarding ref="onboardingRef" />

    <!-- 设置面板 -->
    <Settings ref="settingsRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { useTheme } from '@/composables/useTheme'
import { useResize } from '@/composables/useResize'
import { setupGlobalErrorHandler, logger } from '@/utils/logger'

import Sidebar from '@/components/layout/Sidebar.vue'
import MainContent from '@/components/layout/MainContent.vue'
import ResizeHandle from '@/components/layout/ResizeHandle.vue'
import Toast from '@/components/common/Toast.vue'
import Loading from '@/components/common/Loading.vue'
import Onboarding from '@/components/common/Onboarding.vue'
import Settings from '@/components/common/Settings.vue'
import SimpleToolsPanel from '@/components/features/SimpleTools/SimpleToolsPanel.vue'
import JumpbackPanel from '@/components/features/Jumpback/JumpbackPanel.vue'
import SkewPanel from '@/components/features/Skew/SkewPanel.vue'
import SmartFillPanel from '@/components/features/SmartFill/SmartFillPanel.vue'
import SuperSelectPanel from '@/components/features/SuperSelect/SuperSelectPanel.vue'
import TextReplacePanel from '@/components/features/TextReplace/TextReplacePanel.vue'
import AIPanel from '@/components/features/AI/AIPanel.vue'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { initTheme } = useTheme()
const { startResize: handleStartResize } = useResize()

const sidebarCollapsed = ref(false)
const showSettings = ref(false)
const onboardingRef = ref<InstanceType<typeof Onboarding> | null>(null)
const settingsRef = ref<InstanceType<typeof Settings> | null>(null)

const currentFeature = computed(() => appStore.currentFeature)
const isLoading = computed(() => appStore.isLoading)
const notifications = computed(() => appStore.notifications)

const handleFeatureSelect = (featureId: string) => {
  logger.info(`Feature selected: ${featureId}`)

  // 如果选择设置，显示设置面板
  if (featureId === 'settings') {
    settingsRef.value?.show()
  }
}

const removeNotification = (id: string) => {
  appStore.removeNotification(id)
}

const startResize = () => {
  handleStartResize()
}

onMounted(() => {
  // 初始化主题
  initTheme()

  // 加载设置
  settingsStore.loadSettings()
  sidebarCollapsed.value = settingsStore.sidebarCollapsed

  // 设置全局错误处理
  setupGlobalErrorHandler()

  logger.info('App initialized')
})
</script>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.feature-panel {
  animation: fadeIn var(--duration-normal) var(--ease-default);
}

.panel-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-2);
}

.panel-description {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--spacing-6);
}

/* Toast 容器 */
.toast-container {
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

/* 全局加载 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

[data-theme='dark'] .global-loading {
  background: rgba(10, 10, 10, 0.8);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 暗色模式 */
[data-theme='dark'] .panel-title {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .panel-description {
  color: var(--color-neutral-400);
}
</style>
