<template>
  <div class="ppt-panel">
    <div class="info-box">
      <p class="info-title">📊 PPT 导出工具</p>
      <p class="info-desc">将 Figma 画板导出为可编辑的 PowerPoint 格式</p>
    </div>

    <div class="steps-guide">
      <div class="step-item">
        <span class="step-number">1</span>
        <div class="step-content">
          <p class="step-title">准备工作</p>
          <p class="step-desc">将 Page 重命名为含"副本"或"copy"的名称以确保安全</p>
        </div>
      </div>
      <div class="step-item">
        <span class="step-number">2</span>
        <div class="step-content">
          <p class="step-title">选择画板</p>
          <p class="step-desc">选中一个或多个 Frame 画板作为幻灯片</p>
        </div>
      </div>
      <div class="step-item">
        <span class="step-number">3</span>
        <div class="step-content">
          <p class="step-title">逐步处理</p>
          <p class="step-desc">按顺序点击下方步骤按钮</p>
        </div>
      </div>
    </div>

    <div class="steps-buttons">
      <div
        v-for="step in steps"
        :key="step.id"
        class="step-btn-wrapper"
      >
        <button
          :class="['step-btn', getStepClass(step)]"
          @click="executeStep(step.id)"
          :disabled="step.loading || isStepDisabled(step)"
        >
          <span class="step-btn-icon">
            <span v-if="step.loading" class="loading-dot">...</span>
            <span v-else-if="step.done">✅</span>
            <span v-else>{{ step.icon }}</span>
          </span>
          <span class="step-btn-label">{{ step.label }}</span>
        </button>
        <span class="step-status" v-if="step.done">完成</span>
      </div>
    </div>

    <div v-if="exportData" class="export-section">
      <h3 class="export-title">导出完成！</h3>
      <p class="export-desc">数据已准备好，点击下载 PPT 文件</p>
      <button class="btn-download" @click="downloadPPT">
        ⬇️ 下载 PPT 文件
      </button>
    </div>

    <div class="warning-box">
      <p>⚠️ 请确保操作前已备份原始文件</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'

const { send, listen } = useMessage()
const appStore = useAppStore()

const steps = ref([
  { id: 1, label: '初始化', icon: '🚀', loading: false, done: false },
  { id: 2, label: '栅格化图标', icon: '🖼️', loading: false, done: false },
  { id: 3, label: '扁平化', icon: '📐', loading: false, done: false },
  { id: 4, label: '提取数据', icon: '📊', loading: false, done: false },
  { id: 5, label: '导出图片', icon: '🎨', loading: false, done: false },
])

const exportData = ref<any>(null)
const totalSlides = ref(0)
const currentSlide = ref(0)

const getStepClass = (step: any) => {
  if (step.done) return 'step-done'
  if (step.loading) return 'step-loading'
  return ''
}

const isStepDisabled = (step: any) => {
  if (step.id === 1) return false
  const prevStep = steps.value[step.id - 2]
  return !prevStep?.done
}

const executeStep = (stepId: number) => {
  const step = steps.value[stepId - 1]
  step.loading = true
  send(`ppt-step-${stepId}`)
}

const downloadPPT = () => {
  appStore.showNotification({
    type: 'info',
    message: 'PPT 生成功能由前端 JS 处理，请查看控制台日志',
  })
}

const resetSteps = () => {
  steps.value.forEach((s) => {
    s.loading = false
    s.done = false
  })
  exportData.value = null
}

onMounted(() => {
  listen((message) => {
    if (message.type === 'step-done') {
      const step = steps.value[message.step - 1]
      if (step) {
        step.loading = false
        step.done = true
      }
    }

    if (message.type === 'step-error') {
      const step = steps.value[message.step - 1]
      if (step) {
        step.loading = false
      }
    }

    if (message.type === 'ppt-init-total') {
      totalSlides.value = message.count
    }

    if (message.type === 'ppt-slide-data') {
      exportData.value = exportData.value || []
      exportData.value.push(message.data)
    }
  })
})
</script>

<style scoped>
.ppt-panel {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.info-box {
  padding: var(--spacing-3);
  background: rgba(139, 127, 216, 0.08);
  border: 1px solid rgba(139, 127, 216, 0.2);
  border-radius: var(--radius-md);
}

.info-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.info-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.steps-guide {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.step-item {
  display: flex;
  gap: var(--spacing-3);
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-500);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.step-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.step-desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.steps-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.step-btn-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.step-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  text-align: left;
}

.step-btn:hover:not(:disabled) {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-sm);
}

.step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.step-btn.step-done {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.4);
}

.step-btn.step-loading {
  background: rgba(139, 127, 216, 0.08);
  border-color: var(--color-primary-500);
}

.step-btn-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.loading-dot {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.step-status {
  font-size: var(--text-sm);
  color: #22c55e;
  white-space: nowrap;
}

.export-section {
  padding: var(--spacing-4);
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-md);
  text-align: center;
}

.export-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.export-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-4);
}

.btn-download {
  padding: var(--spacing-3) var(--spacing-6);
  background: #22c55e;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-download:hover {
  background: #16a34a;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.warning-box {
  padding: var(--spacing-3);
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
</style>
