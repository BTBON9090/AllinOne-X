<template>
  <div class="smart-fill-panel">
    <Card>
      <h3 class="section-title">数据输入</h3>
      <div class="input-group">
        <textarea
          v-model="dataText"
          class="data-textarea"
          placeholder="每行一条数据，例如：&#10;张三&#10;李四&#10;王五"
          rows="8"
        />
        <div class="data-info">
          <span class="info-label">数据条数：</span>
          <span class="info-value">{{ dataList.length }}</span>
          <span class="info-label ml-4">文本节点：</span>
          <span class="info-value">{{ textNodeCount }}</span>
        </div>
      </div>
    </Card>

    <Card class="mt-4">
      <h3 class="section-title">填充模式</h3>
      <div class="mode-group">
        <label class="radio-label">
          <input type="radio" v-model="mode" value="replace" />
          <span>替换</span>
        </label>
        <label class="radio-label">
          <input type="radio" v-model="mode" value="prefix" />
          <span>前缀</span>
        </label>
        <label class="radio-label">
          <input type="radio" v-model="mode" value="suffix" />
          <span>后缀</span>
        </label>
      </div>
    </Card>

    <Card class="mt-4">
      <h3 class="section-title">分配方式</h3>
      <div class="mode-group">
        <label class="radio-label">
          <input type="radio" v-model="distribution" value="sequential" />
          <span>顺序</span>
        </label>
        <label class="radio-label">
          <input type="radio" v-model="distribution" value="random" />
          <span>随机</span>
        </label>
      </div>
    </Card>

    <div class="action-buttons">
      <Button variant="secondary" @click="refreshCount">
        刷新统计
      </Button>
      <Button variant="primary" @click="executeFill" :disabled="!canExecute">
        开始填充
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'

const { send, listen } = useMessage()
const appStore = useAppStore()

const dataText = ref('')
const mode = ref<'replace' | 'prefix' | 'suffix'>('replace')
const distribution = ref<'sequential' | 'random'>('sequential')
const textNodeCount = ref(0)

const dataList = computed(() => {
  return dataText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
})

const canExecute = computed(() => {
  return dataList.value.length > 0 && textNodeCount.value > 0
})

const refreshCount = async () => {
  send('get-selection-count')
}

const executeFill = async () => {
  if (!canExecute.value) return

  appStore.setLoading(true)

  send('smart-fill-exec', {
    dataList: dataList.value,
    mode: mode.value,
    distribution: distribution.value
  })

  setTimeout(() => {
    appStore.setLoading(false)
    appStore.addNotification({
      type: 'success',
      message: '填充完成'
    })
  }, 1000)
}

onMounted(() => {
  listen('selection-count-res', (data: any) => {
    textNodeCount.value = data.count
  })

  refreshCount()
})
</script>

<style scoped>
.smart-fill-panel {
  padding: var(--spacing-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-3);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.data-textarea {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  resize: vertical;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast);
}

.data-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.data-info {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
}

.info-label {
  color: var(--color-neutral-600);
}

.info-value {
  color: var(--color-primary-500);
  font-weight: var(--font-semibold);
  margin-left: var(--spacing-1);
}

.ml-4 {
  margin-left: var(--spacing-4);
}

.mt-4 {
  margin-top: var(--spacing-4);
}

.mode-group {
  display: flex;
  gap: var(--spacing-4);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--text-base);
  color: var(--color-neutral-700);
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
}

.action-buttons > * {
  flex: 1;
}

[data-theme='dark'] .section-title {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .data-textarea {
  background: var(--color-neutral-900);
  color: var(--color-neutral-100);
  border-color: var(--color-neutral-700);
}

[data-theme='dark'] .radio-label {
  color: var(--color-neutral-300);
}
</style>
