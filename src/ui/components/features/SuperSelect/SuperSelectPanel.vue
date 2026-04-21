<template>
  <div class="super-select-panel">
    <!-- 范围选择 -->
    <div class="filter-section">
      <label class="section-label">查找范围</label>
      <div class="scope-tabs">
        <button
          v-for="s in scopes"
          :key="s.value"
          :class="['scope-tab', { active: scope === s.value }]"
          @click="scope = s.value"
        >{{ s.label }}</button>
      </div>
    </div>

    <!-- 名称过滤 -->
    <div class="filter-section">
      <label class="section-label">名称过滤</label>
      <div class="name-filter">
        <input
          v-model="nameVal"
          type="text"
          placeholder="输入图层名称..."
          class="text-input"
        />
        <button
          :class="['toggle-btn', { active: nameCaseSensitive }]"
          @click="nameCaseSensitive = !nameCaseSensitive"
          title="区分大小写"
        >Aa</button>
      </div>
    </div>

    <!-- 类型过滤 -->
    <div class="filter-section">
      <div class="section-header" @click="showTypes = !showTypes">
        <label class="section-label">类型过滤</label>
        <div class="header-right">
          <span v-if="selectedTypes.length > 0" class="badge">{{ selectedTypes.length }}</span>
          <span class="arrow">{{ showTypes ? '▲' : '▼' }}</span>
        </div>
      </div>
      <div v-if="showTypes" class="collapsible-content">
        <div class="logic-toggle">
          <button :class="['logic-btn', { active: typesLogic === 'include' }]" @click="typesLogic = 'include'">包含</button>
          <button :class="['logic-btn', { active: typesLogic === 'exclude' }]" @click="typesLogic = 'exclude'">排除</button>
        </div>
        <div class="checkbox-grid">
          <label v-for="t in nodeTypes" :key="t.value" class="checkbox-item">
            <input type="checkbox" :value="t.value" v-model="selectedTypes" />
            <span>{{ t.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 状态过滤 -->
    <div class="filter-section">
      <div class="section-header" @click="showStates = !showStates">
        <label class="section-label">状态过滤</label>
        <div class="header-right">
          <span v-if="selectedStates.length > 0" class="badge">{{ selectedStates.length }}</span>
          <span class="arrow">{{ showStates ? '▲' : '▼' }}</span>
        </div>
      </div>
      <div v-if="showStates" class="collapsible-content">
        <div class="logic-toggle">
          <button :class="['logic-btn', { active: statesLogic === 'include' }]" @click="statesLogic = 'include'">包含</button>
          <button :class="['logic-btn', { active: statesLogic === 'exclude' }]" @click="statesLogic = 'exclude'">排除</button>
        </div>
        <div class="checkbox-grid">
          <label v-for="st in nodeStates" :key="st.value" class="checkbox-item">
            <input type="checkbox" :value="st.value" v-model="selectedStates" />
            <span>{{ st.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 执行按钮 -->
    <button class="btn-search" @click="executeSearch" :disabled="isSearching">
      <span v-if="isSearching">查找中...</span>
      <span v-else>🔍 执行查找</span>
    </button>

    <!-- 结果 -->
    <div v-if="resultCount !== null" class="result-panel">
      <div class="result-header">
        <span class="result-count">找到 {{ resultCount }} 个图层</span>
        <button v-if="resultCount > 0" class="btn-clear" @click="clearResult">清除</button>
      </div>
      <div v-if="resultLayers.length > 0" class="result-list">
        <div v-for="layer in resultLayers.slice(0, 50)" :key="layer.id" class="result-item">
          <span class="layer-type">{{ getTypeIcon(layer.type) }}</span>
          <span class="layer-name">{{ layer.name }}</span>
        </div>
        <div v-if="resultLayers.length > 50" class="more-hint">还有 {{ resultLayers.length - 50 }} 个...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'

const { send, listen } = useMessage()

const scope = ref('descendants')
const nameVal = ref('')
const nameCaseSensitive = ref(false)
const selectedTypes = ref<string[]>([])
const typesLogic = ref<'include' | 'exclude'>('include')
const selectedStates = ref<string[]>([])
const statesLogic = ref<'include' | 'exclude'>('include')
const showTypes = ref(false)
const showStates = ref(false)
const isSearching = ref(false)
const resultCount = ref<number | null>(null)
const resultLayers = ref<any[]>([])

const scopes = [
  { value: 'descendants', label: '后代' },
  { value: 'page', label: '全页' },
  { value: 'inside', label: '内部' },
  { value: 'children', label: '子级' },
  { value: 'sibling', label: '同级' },
]

const nodeTypes = [
  { value: 'FRAME', label: 'Frame' },
  { value: 'GROUP', label: 'Group' },
  { value: 'COMPONENT', label: '组件' },
  { value: 'INSTANCE', label: '实例' },
  { value: 'TEXT', label: '文本' },
  { value: 'RECTANGLE', label: '矩形' },
  { value: 'ELLIPSE', label: '椭圆' },
  { value: 'LINE', label: '直线' },
  { value: 'VECTOR', label: '矢量' },
  { value: 'AUTOLAYOUT', label: '自动布局' },
  { value: 'IMAGE', label: '图片' },
  { value: 'COMPONENT_SET', label: '变体组' },
  { value: 'SECTION', label: 'Section' },
]

const nodeStates = [
  { value: 'hidden', label: '隐藏' },
  { value: 'locked', label: '锁定' },
  { value: 'mask', label: '蒙版' },
  { value: 'export', label: '导出标记' },
  { value: 'no-fill', label: '无填充' },
  { value: 'no-stroke', label: '无描边' },
  { value: 'clip', label: '裁剪内容' },
  { value: 'no-children', label: '空容器' },
]

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    FRAME: '▭', GROUP: '⬡', COMPONENT: '◈', INSTANCE: '◇',
    TEXT: 'T', RECTANGLE: '▬', ELLIPSE: '○', LINE: '—',
    VECTOR: '✦', SECTION: '⊞',
  }
  return icons[type] || '◻'
}

const executeSearch = () => {
  isSearching.value = true

  const filters: any = {
    scope: scope.value,
    name: nameVal.value ? { val: nameVal.value, caseSensitive: nameCaseSensitive.value } : null,
    types: selectedTypes.value.length > 0 ? { vals: selectedTypes.value, logic: typesLogic.value } : null,
    states: selectedStates.value.length > 0 ? { vals: selectedStates.value, logic: statesLogic.value } : null,
    props: [],
  }

  send('find-and-select', { filters })
}

const clearResult = () => {
  resultCount.value = null
  resultLayers.value = []
}

onMounted(() => {
  listen((message) => {
    if (message.type === 'found-layers-result') {
      isSearching.value = false
      resultCount.value = message.count
      resultLayers.value = message.layers || []
    }
  })
})
</script>

<style scoped>
.super-select-panel {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.section-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  user-select: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: var(--spacing-1) 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--color-primary-500);
  color: white;
  font-size: 11px;
  border-radius: 9px;
}

.arrow {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.scope-tabs {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.scope-tab {
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.scope-tab.active {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: white;
}

.scope-tab:hover:not(.active) {
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.name-filter {
  display: flex;
  gap: var(--spacing-2);
}

.text-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.text-input:focus {
  border-color: var(--color-primary-500);
}

.toggle-btn {
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.toggle-btn.active {
  background: rgba(139, 127, 216, 0.1);
  border-color: var(--color-primary-500);
  color: var(--color-primary-500);
}

.collapsible-content {
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.logic-toggle {
  display: flex;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-3);
}

.logic-btn {
  padding: 3px var(--spacing-3);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.logic-btn.active {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: white;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  accent-color: var(--color-primary-500);
}

.btn-search {
  width: 100%;
  padding: var(--spacing-3);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-search:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-search:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.result-count {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-primary-500);
}

.btn-clear {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-clear:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.result-list {
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--text-sm);
}

.result-item:last-child {
  border-bottom: none;
}

.layer-type {
  font-size: 14px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.layer-name {
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-hint {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

[data-theme='dark'] .text-input,
[data-theme='dark'] .toggle-btn,
[data-theme='dark'] .collapsible-content {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .result-panel {
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .result-header {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}
</style>
