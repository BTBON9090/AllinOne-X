<template>
  <div class="text-replace-panel">
    <Card>
      <h3 class="section-title">查找内容</h3>
      <Input
        v-model="findText"
        placeholder="输入要查找的文本..."
        :error="findError"
      />
    </Card>

    <Card class="mt-4">
      <h3 class="section-title">替换为</h3>
      <Input
        v-model="replaceText"
        placeholder="输入替换后的文本..."
      />
    </Card>

    <Card class="mt-4">
      <h3 class="section-title">选项</h3>
      <div class="options-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="caseSensitive" />
          <span>区分大小写</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="wholeWord" />
          <span>全字匹配</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useRegex" />
          <span>使用正则表达式</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="inSelection" />
          <span>仅在选中范围</span>
        </label>
      </div>
    </Card>

    <Card v-if="searchResults.length > 0" class="mt-4">
      <div class="results-header">
        <h3 class="section-title">找到 {{ searchResults.length }} 处匹配</h3>
        <button class="btn-clear" @click="clearResults">清除</button>
      </div>
      <div class="results-list">
        <div
          v-for="(result, index) in searchResults.slice(0, 20)"
          :key="index"
          class="result-item"
          @click="selectResult(result)"
        >
          <span class="result-index">{{ index + 1 }}</span>
          <div class="result-content">
            <div class="result-name">{{ result.nodeName }}</div>
            <div class="result-preview">{{ getPreview(result) }}</div>
          </div>
        </div>
        <div v-if="searchResults.length > 20" class="more-hint">
          还有 {{ searchResults.length - 20 }} 处...
        </div>
      </div>
    </Card>

    <div class="action-buttons">
      <Button variant="secondary" @click="findAll" :disabled="!canSearch">
        查找全部
      </Button>
      <Button variant="primary" @click="replaceAll" :disabled="!canReplace">
        全部替换
      </Button>
    </div>

    <div v-if="replaceCount > 0" class="success-message">
      ✓ 已替换 {{ replaceCount }} 处
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'
import Card from '@/components/common/Card.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

const { send, listen } = useMessage()
const appStore = useAppStore()

const findText = ref('')
const replaceText = ref('')
const caseSensitive = ref(false)
const wholeWord = ref(false)
const useRegex = ref(false)
const inSelection = ref(true)
const findError = ref('')
const searchResults = ref<any[]>([])
const replaceCount = ref(0)

const canSearch = computed(() => {
  return findText.value.trim().length > 0
})

const canReplace = computed(() => {
  return canSearch.value && searchResults.length > 0
})

const validateRegex = () => {
  if (!useRegex.value) return true

  try {
    new RegExp(findText.value)
    findError.value = ''
    return true
  } catch (e) {
    findError.value = '正则表达式格式错误'
    return false
  }
}

const findAll = () => {
  if (!canSearch.value) return
  if (!validateRegex()) return

  appStore.setLoading(true)
  replaceCount.value = 0

  send('text-replace-find', {
    findText: findText.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    useRegex: useRegex.value,
    inSelection: inSelection.value
  })
}

const replaceAll = () => {
  if (!canReplace.value) return

  appStore.setLoading(true)

  send('text-replace-exec', {
    findText: findText.value,
    replaceText: replaceText.value,
    caseSensitive: caseSensitive.value,
    wholeWord: wholeWord.value,
    useRegex: useRegex.value,
    inSelection: inSelection.value
  })
}

const clearResults = () => {
  searchResults.value = []
  replaceCount.value = 0
}

const selectResult = (result: any) => {
  send('select-node', { nodeId: result.nodeId })
}

const getPreview = (result: any) => {
  const text = result.text || ''
  const maxLen = 50
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen) + '...'
}

listen('text-replace-found', (data: any) => {
  appStore.setLoading(false)
  searchResults.value = data.results || []

  if (searchResults.value.length === 0) {
    appStore.addNotification({
      type: 'info',
      message: '未找到匹配项'
    })
  }
})

listen('text-replace-done', (data: any) => {
  appStore.setLoading(false)
  replaceCount.value = data.count || 0
  searchResults.value = []

  appStore.addNotification({
    type: 'success',
    message: `已替换 ${replaceCount.value} 处`
  })
})
</script>

<style scoped>
.text-replace-panel {
  padding: var(--spacing-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-3);
}

.mt-4 {
  margin-top: var(--spacing-4);
}

.options-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--text-base);
  color: var(--color-neutral-700);
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.btn-clear {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast);
}

.btn-clear:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.result-item:hover {
  background: var(--color-bg-secondary);
}

.result-item:last-child {
  border-bottom: none;
}

.result-index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-1);
}

.result-preview {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-hint {
  padding: var(--spacing-2);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
}

.action-buttons > * {
  flex: 1;
}

.success-message {
  margin-top: var(--spacing-4);
  padding: var(--spacing-3);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md);
  color: #059669;
  font-size: var(--text-sm);
  text-align: center;
}

[data-theme='dark'] .section-title {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .checkbox-label {
  color: var(--color-neutral-300);
}

[data-theme='dark'] .result-name {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .result-preview {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .results-list {
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .result-item {
  border-color: var(--color-neutral-800);
}
</style>
