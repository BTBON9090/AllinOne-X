<template>
  <div class="skew-panel">
    <div class="controls-section">
      <div class="control-group">
        <label class="control-label">
          <span>旋转角度</span>
          <span class="value">{{ rotation }}°</span>
        </label>
        <input
          type="range"
          v-model.number="rotation"
          min="-180"
          max="180"
          step="1"
          class="slider"
          @input="applyTransform"
        />
      </div>

      <div class="control-group">
        <label class="control-label">
          <span>X轴倾斜</span>
          <span class="value">{{ skewX }}°</span>
        </label>
        <input
          type="range"
          v-model.number="skewX"
          min="-45"
          max="45"
          step="1"
          class="slider"
          @input="applyTransform"
        />
      </div>

      <div class="control-group">
        <label class="control-label">
          <span>Y轴倾斜</span>
          <span class="value">{{ skewY }}°</span>
        </label>
        <input
          type="range"
          v-model.number="skewY"
          min="-45"
          max="45"
          step="1"
          class="slider"
          @input="applyTransform"
        />
      </div>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="resetValues">
        重置
      </button>
      <button class="btn-primary" @click="savePreset">
        保存预设
      </button>
    </div>

    <div v-if="presets.length > 0" class="presets-section">
      <h3 class="section-title">预设</h3>
      <div class="presets-grid">
        <div
          v-for="(preset, index) in presets"
          :key="index"
          class="preset-item"
          @click="applyPreset(preset)"
        >
          <div class="preset-name">{{ preset.name }}</div>
          <div class="preset-values">
            R:{{ preset.rot }}° X:{{ preset.angleX }}° Y:{{ preset.angleY }}°
          </div>
          <button
            class="btn-delete-preset"
            @click.stop="deletePreset(index)"
            title="删除"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="info-box">
      <p class="info-text">💡 拖动滑块实时预览变形效果</p>
      <p class="info-text">选中图层后调整参数即可应用</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'

const { send, listen } = useMessage()
const appStore = useAppStore()

interface Preset {
  name: string
  rot: number
  angleX: number
  angleY: number
}

const rotation = ref(0)
const skewX = ref(0)
const skewY = ref(0)
const presets = ref<Preset[]>([])

let applyTimeout: number | null = null

const applyTransform = () => {
  // 防抖：避免滑块拖动时频繁发送消息
  if (applyTimeout) clearTimeout(applyTimeout)

  applyTimeout = window.setTimeout(() => {
    send('skew-apply', {
      rot: rotation.value,
      angleX: skewX.value,
      angleY: skewY.value,
    })
  }, 50)
}

const resetValues = () => {
  rotation.value = 0
  skewX.value = 0
  skewY.value = 0
  applyTransform()
}

const savePreset = () => {
  const name = prompt('预设名称：', `预设 ${presets.value.length + 1}`)
  if (!name) return

  const newPreset: Preset = {
    name: name.trim(),
    rot: rotation.value,
    angleX: skewX.value,
    angleY: skewY.value,
  }

  presets.value.push(newPreset)
  send('save-skew-presets', { data: presets.value })

  appStore.showNotification({
    type: 'success',
    message: '预设已保存',
  })
}

const applyPreset = (preset: Preset) => {
  rotation.value = preset.rot
  skewX.value = preset.angleX
  skewY.value = preset.angleY
  applyTransform()

  appStore.showNotification({
    type: 'success',
    message: `已应用预设：${preset.name}`,
  })
}

const deletePreset = (index: number) => {
  presets.value.splice(index, 1)
  send('save-skew-presets', { data: presets.value })

  appStore.showNotification({
    type: 'success',
    message: '预设已删除',
  })
}

onMounted(() => {
  // 请求加载预设
  send('req-skew-presets')

  // 监听预设数据
  listen((message) => {
    if (message.type === 'init-skew-presets') {
      presets.value = message.data || []
    }
  })
})
</script>

<style scoped>
.skew-panel {
  padding: var(--spacing-4);
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.value {
  font-weight: var(--font-medium);
  color: var(--color-primary-500);
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-neutral-200);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary-500);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(139, 127, 216, 0.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary-500);
  cursor: pointer;
  border: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(139, 127, 216, 0.2);
}

.actions {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: var(--spacing-3);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-primary {
  background: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-neutral-300);
}

.presets-section {
  margin-bottom: var(--spacing-4);
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3);
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

.preset-item {
  position: relative;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.preset-item:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-sm);
}

.preset-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.preset-values {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.btn-delete-preset {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 50%;
  color: #ef4444;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.preset-item:hover .btn-delete-preset {
  opacity: 1;
}

.btn-delete-preset:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.info-box {
  padding: var(--spacing-3);
  background: rgba(139, 127, 216, 0.05);
  border: 1px solid rgba(139, 127, 216, 0.2);
  border-radius: var(--radius-md);
}

.info-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-1);
}

.info-text:last-child {
  margin-bottom: 0;
}

/* 暗色模式 */
[data-theme='dark'] .slider {
  background: var(--color-neutral-800);
}

[data-theme='dark'] .preset-item {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .info-box {
  background: rgba(139, 127, 216, 0.1);
  border-color: rgba(139, 127, 216, 0.3);
}
</style>
