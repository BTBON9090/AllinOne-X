<template>
  <div class="i18n-panel">
    <!-- 配置区 -->
    <div class="config-section">
      <div class="field-group">
        <label class="field-label">合集名称</label>
        <input
          v-model="collectionName"
          type="text"
          placeholder="i18n Dictionary"
          class="text-input"
        />
      </div>

      <div class="field-group">
        <label class="field-label">扫描范围</label>
        <div class="scope-tabs">
          <button :class="['scope-tab', { active: scope === 'selection' }]" @click="scope = 'selection'">当前选区</button>
          <button :class="['scope-tab', { active: scope === 'page' }]" @click="scope = 'page'">全页面</button>
        </div>
      </div>

      <div class="field-group">
        <label class="field-label">提取目标</label>
        <div class="scope-tabs">
          <button :class="['scope-tab', { active: extractTarget === 'all' }]" @click="extractTarget = 'all'">全部文本</button>
          <button :class="['scope-tab', { active: extractTarget === 'unbound' }]" @click="extractTarget = 'unbound'">未绑定变量</button>
        </div>
      </div>
    </div>

    <button class="btn-primary" @click="doDetect" :disabled="isLoading">
      <span v-if="isLoading">分析中...</span>
      <span v-else>🔍 开始分析</span>
    </button>

    <!-- 检测结果 -->
    <div v-if="detectResult" class="result-section">
      <div class="stat-row">
        <span class="stat-label">总文本节点</span>
        <span class="stat-value">{{ detectResult.totalNodes }}</span>
      </div>
      <div class="stat-row" v-if="detectResult.boundCount > 0">
        <span class="stat-label">已绑定变量</span>
        <span class="stat-value">{{ detectResult.boundCount }}</span>
      </div>

      <!-- 可自动绑定的 -->
      <div v-if="detectResult.autoBindList.length > 0" class="list-section">
        <h4 class="list-title">🔗 可自动匹配 ({{ detectResult.autoBindList.length }})</h4>
        <div class="text-list">
          <div v-for="item in detectResult.autoBindList.slice(0, 20)" :key="item.original" class="text-item auto">
            <span class="text-content">{{ item.original }}</span>
            <span class="node-count">{{ item.nodeIds.length }}处</span>
          </div>
          <div v-if="detectResult.autoBindList.length > 20" class="more">还有 {{ detectResult.autoBindList.length - 20 }} 条...</div>
        </div>
      </div>

      <!-- 需要翻译的新文本 -->
      <div v-if="detectResult.newTextList.length > 0" class="list-section">
        <h4 class="list-title">✨ 需新增 ({{ detectResult.newTextList.length }})</h4>

        <!-- 目标语言输入 -->
        <div class="lang-row">
          <input v-model="targetLang" type="text" placeholder="目标语言，如：English" class="text-input-sm" />
        </div>

        <div class="text-list translations-list">
          <div v-for="item in detectResult.newTextList.slice(0, 30)" :key="item.original" class="translation-item">
            <span class="original-text">{{ item.original }}</span>
            <input
              v-model="translations[item.original]"
              type="text"
              :placeholder="`${targetLang || '翻译'}`"
              class="trans-input"
            />
          </div>
          <div v-if="detectResult.newTextList.length > 30" class="more">还有 {{ detectResult.newTextList.length - 30 }} 条...</div>
        </div>
      </div>

      <!-- 操作 -->
      <div class="submit-actions" v-if="detectResult.newTextList.length > 0 || detectResult.autoBindList.length > 0">
        <button class="btn-primary" @click="bindVariables" :disabled="isBinding">
          <span v-if="isBinding">处理中...</span>
          <span v-else>🔗 绑定变量</span>
        </button>
        <button class="btn-secondary" @click="replaceDirectly" :disabled="isBinding">
          ⚡ 直接替换
        </button>
      </div>
    </div>

    <!-- 操作结果 -->
    <div v-if="successMessage" class="success-box">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-box">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'

const { send, listen } = useMessage()
const appStore = useAppStore()

const collectionName = ref('i18n Dictionary')
const scope = ref<'selection' | 'page'>('page')
const extractTarget = ref<'all' | 'unbound'>('unbound')
const targetLang = ref('English')
const translations = ref<Record<string, string>>({})
const isLoading = ref(false)
const isBinding = ref(false)
const detectResult = ref<any>(null)
const successMessage = ref('')
const errorMessage = ref('')

const doDetect = () => {
  isLoading.value = true
  detectResult.value = null
  successMessage.value = ''
  errorMessage.value = ''
  translations.value = {}
  send('i18n-detect', {
    scope: scope.value,
    extractTarget: extractTarget.value,
    collectionName: collectionName.value,
  })
}

const buildNewPayload = () => {
  return detectResult.value.newTextList.map((item: any) => ({
    original: item.original,
    nodeIds: item.nodeIds,
    translations: targetLang.value
      ? { [targetLang.value]: translations.value[item.original] || item.original }
      : {},
  }))
}

const bindVariables = () => {
  isBinding.value = true
  errorMessage.value = ''
  const newPayload = buildNewPayload()
  send('i18n-bind-variables', {
    collectionName: collectionName.value,
    newPayload,
    autoBindPayload: detectResult.value.autoBindList,
    isCreate: true,
  })
}

const replaceDirectly = () => {
  isBinding.value = true
  errorMessage.value = ''
  const payload = buildNewPayload()
  send('i18n-replace-text', { payload })
}

onMounted(() => {
  listen((message) => {
    if (message.type === 'i18n-detect-result') {
      isLoading.value = false
      detectResult.value = message.data
    }
    if (message.type === 'i18n-bind-success') {
      isBinding.value = false
      successMessage.value = message.message
      appStore.showNotification({ type: 'success', message: message.message })
    }
    if (message.type === 'i18n-bind-error') {
      isBinding.value = false
      errorMessage.value = message.error
      appStore.showNotification({ type: 'error', message: '操作失败，请查看详情' })
    }
  })
})
</script>

<style scoped>
.i18n-panel {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.text-input {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--duration-fast);
}

.text-input:focus { border-color: var(--color-primary-500); }

.scope-tabs { display: flex; gap: var(--spacing-2); }

.scope-tab {
  flex: 1;
  padding: var(--spacing-2);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.scope-tab.active {
  background: rgba(139, 127, 216, 0.1);
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.btn-primary, .btn-secondary {
  padding: var(--spacing-3);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-primary {
  width: 100%;
  background: var(--color-primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) { background: var(--color-primary-600); }
.btn-primary:disabled, .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

.result-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
}

.stat-label { color: var(--color-text-secondary); }
.stat-value { font-weight: var(--font-medium); color: var(--color-text-primary); }

.list-section { display: flex; flex-direction: column; gap: var(--spacing-2); }

.list-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.text-list {
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.text-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}

.text-item:last-child { border-bottom: none; }

.text-content {
  flex: 1;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.node-count {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  padding: 2px 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
}

.more {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-align: center;
}

.lang-row { padding: var(--spacing-2) 0; }

.text-input-sm {
  width: 100%;
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
}

.translation-item {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}

.original-text {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trans-input {
  flex: 1;
  padding: 4px var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  outline: none;
}

.trans-input:focus { border-color: var(--color-primary-500); }

.submit-actions {
  display: flex;
  gap: var(--spacing-2);
}

.submit-actions .btn-primary { width: auto; flex: 1; }

.btn-secondary {
  flex: 1;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) { background: var(--color-bg-tertiary); }

.success-box {
  padding: var(--spacing-3);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: #16a34a;
}

.error-box {
  padding: var(--spacing-3);
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: #dc2626;
  white-space: pre-wrap;
}
</style>
