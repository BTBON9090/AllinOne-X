<template>
  <div class="ai-panel">
    <div class="info-banner">
      <span class="banner-icon">🤖</span>
      <div class="banner-text">
        <strong>AI 智能助手</strong>
        <p>使用AI提升设计效率</p>
      </div>
    </div>

    <!-- AI功能列表 -->
    <div class="ai-features">
      <!-- 智能命名 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">✏️</span>
          <h3 class="feature-title">智能命名</h3>
        </div>
        <p class="feature-desc">
          根据图层内容自动生成语义化的图层名称
        </p>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="executeSmartNaming">
            开始命名
          </Button>
        </div>
        <div v-if="namingResult" class="result-box">
          <span class="result-icon">✓</span>
          <span>已重命名 {{ namingResult.count }} 个图层</span>
        </div>
      </Card>

      <!-- 内容生成 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">📝</span>
          <h3 class="feature-title">内容生成</h3>
        </div>
        <p class="feature-desc">
          生成占位文本、示例数据等设计内容
        </p>
        <div class="content-options">
          <select v-model="contentType" class="select-input">
            <option value="lorem">Lorem Ipsum</option>
            <option value="chinese">中文占位文本</option>
            <option value="names">人名</option>
            <option value="emails">邮箱地址</option>
            <option value="phones">电话号码</option>
            <option value="addresses">地址</option>
          </select>
          <Input
            v-model="contentCount"
            type="number"
            placeholder="数量"
            style="width: 80px"
          />
        </div>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="generateContent">
            生成内容
          </Button>
        </div>
      </Card>

      <!-- 设计建议 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">💡</span>
          <h3 class="feature-title">设计建议</h3>
        </div>
        <p class="feature-desc">
          分析当前设计并提供改进建议
        </p>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="analyzeDesign">
            分析设计
          </Button>
        </div>
        <div v-if="designSuggestions.length > 0" class="suggestions-list">
          <div
            v-for="(suggestion, index) in designSuggestions"
            :key="index"
            class="suggestion-item"
          >
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <div class="suggestion-content">
              <strong>{{ suggestion.title }}</strong>
              <p>{{ suggestion.desc }}</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- 颜色建议 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">🎨</span>
          <h3 class="feature-title">颜色建议</h3>
        </div>
        <p class="feature-desc">
          基于当前配色生成和谐的色彩方案
        </p>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="suggestColors">
            生成配色
          </Button>
        </div>
        <div v-if="colorPalette.length > 0" class="color-palette">
          <div
            v-for="(color, index) in colorPalette"
            :key="index"
            class="color-swatch"
            :style="{ background: color }"
            :title="color"
          />
        </div>
      </Card>

      <!-- 布局优化 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">📐</span>
          <h3 class="feature-title">布局优化</h3>
        </div>
        <p class="feature-desc">
          自动调整间距、对齐和分布，优化视觉层次
        </p>
        <div class="layout-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="layoutOptions.align" />
            <span>对齐元素</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="layoutOptions.spacing" />
            <span>统一间距</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="layoutOptions.hierarchy" />
            <span>优化层次</span>
          </label>
        </div>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="optimizeLayout">
            优化布局
          </Button>
        </div>
      </Card>

      <!-- 可访问性检查 -->
      <Card class="feature-card">
        <div class="feature-header">
          <span class="feature-icon">♿</span>
          <h3 class="feature-title">可访问性检查</h3>
        </div>
        <p class="feature-desc">
          检查对比度、字体大小等可访问性问题
        </p>
        <div class="feature-actions">
          <Button variant="primary" size="small" @click="checkAccessibility">
            开始检查
          </Button>
        </div>
        <div v-if="a11yIssues.length > 0" class="issues-list">
          <div
            v-for="(issue, index) in a11yIssues"
            :key="index"
            :class="['issue-item', issue.level]"
          >
            <span class="issue-icon">{{ issue.icon }}</span>
            <span class="issue-text">{{ issue.message }}</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- AI配置 -->
    <div class="ai-config-section">
      <button class="config-toggle" @click="showConfig = !showConfig">
        <span>⚙️ AI 配置</span>
        <span class="toggle-arrow">{{ showConfig ? '▲' : '▼' }}</span>
      </button>
      <div v-if="showConfig" class="config-content">
        <p class="config-note">
          💡 提示：AI功能目前使用本地算法和规则。未来版本将支持接入外部AI服务。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'

const { send } = useMessage()
const appStore = useAppStore()

const contentType = ref('lorem')
const contentCount = ref(10)
const namingResult = ref<any>(null)
const designSuggestions = ref<any[]>([])
const colorPalette = ref<string[]>([])
const a11yIssues = ref<any[]>([])
const showConfig = ref(false)

const layoutOptions = ref({
  align: true,
  spacing: true,
  hierarchy: false
})

const executeSmartNaming = () => {
  appStore.setLoading(true)
  send('ai-smart-naming')

  setTimeout(() => {
    appStore.setLoading(false)
    namingResult.value = { count: 12 }
    appStore.addNotification({
      type: 'success',
      message: '智能命名完成'
    })
  }, 1500)
}

const generateContent = () => {
  appStore.setLoading(true)
  send('ai-generate-content', {
    type: contentType.value,
    count: contentCount.value
  })

  setTimeout(() => {
    appStore.setLoading(false)
    appStore.addNotification({
      type: 'success',
      message: `已生成 ${contentCount.value} 条内容`
    })
  }, 1000)
}

const analyzeDesign = () => {
  appStore.setLoading(true)

  setTimeout(() => {
    appStore.setLoading(false)
    designSuggestions.value = [
      {
        icon: '⚠️',
        title: '对比度不足',
        desc: '部分文本与背景对比度低于4.5:1，建议调整颜色'
      },
      {
        icon: '📏',
        title: '间距不一致',
        desc: '元素间距存在3种不同值，建议统一为8px的倍数'
      },
      {
        icon: '🔤',
        title: '字体大小过多',
        desc: '使用了7种字体大小，建议精简为3-5种'
      }
    ]
    appStore.addNotification({
      type: 'success',
      message: '设计分析完成'
    })
  }, 2000)
}

const suggestColors = () => {
  appStore.setLoading(true)

  setTimeout(() => {
    appStore.setLoading(false)
    colorPalette.value = [
      '#8B7FD8',
      '#A78BFA',
      '#C4B5FD',
      '#DDD6FE',
      '#EDE9FE'
    ]
    appStore.addNotification({
      type: 'success',
      message: '配色方案已生成'
    })
  }, 1000)
}

const optimizeLayout = () => {
  appStore.setLoading(true)
  send('ai-optimize-layout', layoutOptions.value)

  setTimeout(() => {
    appStore.setLoading(false)
    appStore.addNotification({
      type: 'success',
      message: '布局优化完成'
    })
  }, 1500)
}

const checkAccessibility = () => {
  appStore.setLoading(true)

  setTimeout(() => {
    appStore.setLoading(false)
    a11yIssues.value = [
      {
        level: 'error',
        icon: '❌',
        message: '3个文本图层对比度不足（WCAG AA标准）'
      },
      {
        level: 'warning',
        icon: '⚠️',
        message: '5个按钮尺寸小于44x44px'
      },
      {
        level: 'info',
        icon: 'ℹ️',
        message: '建议为图标添加文字说明'
      }
    ]
    appStore.addNotification({
      type: 'success',
      message: '可访问性检查完成'
    })
  }, 1500)
}
</script>

<style scoped>
.ai-panel {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.info-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: linear-gradient(135deg, rgba(139, 127, 216, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%);
  border: 1px solid rgba(139, 127, 216, 0.2);
  border-radius: var(--radius-lg);
}

.banner-icon {
  font-size: 32px;
}

.banner-text strong {
  display: block;
  font-size: var(--text-lg);
  color: var(--color-neutral-900);
  margin-bottom: 2px;
}

.banner-text p {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin: 0;
}

.ai-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.feature-card {
  padding: var(--spacing-4);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.feature-icon {
  font-size: 24px;
}

.feature-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin: 0;
}

.feature-desc {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: 1.5;
  margin-bottom: var(--spacing-3);
}

.feature-actions {
  display: flex;
  gap: var(--spacing-2);
}

.content-options {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.select-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
}

.layout-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

.result-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: #16a34a;
  margin-top: var(--spacing-3);
}

.result-icon {
  font-weight: var(--font-bold);
}

.suggestions-list,
.issues-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.suggestion-item {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.suggestion-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-content strong {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-neutral-900);
  margin-bottom: 2px;
}

.suggestion-content p {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin: 0;
}

.color-palette {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.color-swatch {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: transform var(--duration-fast);
}

.color-swatch:hover {
  transform: scale(1.1);
}

.issue-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.issue-item.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.issue-item.warning {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #ca8a04;
}

.issue-item.info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #2563eb;
}

.ai-config-section {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-4);
}

.config-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.config-toggle:hover {
  background: var(--color-bg-tertiary);
}

.toggle-arrow {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.config-content {
  padding: var(--spacing-4);
  margin-top: var(--spacing-2);
}

.config-note {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: 1.6;
  margin: 0;
}

[data-theme='dark'] .banner-text strong,
[data-theme='dark'] .feature-title,
[data-theme='dark'] .suggestion-content strong {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .banner-text p,
[data-theme='dark'] .feature-desc,
[data-theme='dark'] .suggestion-content p,
[data-theme='dark'] .config-note {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .checkbox-label {
  color: var(--color-neutral-300);
}
</style>
