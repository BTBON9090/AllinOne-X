<template>
  <div class="theory-panel">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索设计原则..."
        class="search-input"
      />
    </div>

    <div class="theory-list">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        :class="['theory-item', { expanded: expandedId === item.id }]"
        @click="toggleItem(item.id)"
      >
        <div class="theory-header">
          <div class="theory-title-row">
            <span class="theory-icon">{{ item.icon }}</span>
            <span class="theory-title">{{ item.title }}</span>
          </div>
          <span class="theory-arrow">{{ expandedId === item.id ? '▲' : '▼' }}</span>
        </div>

        <div v-if="expandedId === item.id" class="theory-body">
          <p class="theory-desc">{{ item.description }}</p>
          <div class="theory-tips" v-if="item.tips">
            <div v-for="tip in item.tips" :key="tip" class="tip-item">
              <span class="tip-dot">•</span>
              <span>{{ tip }}</span>
            </div>
          </div>
          <div v-if="item.example" class="theory-example">
            <span class="example-label">示例：</span>
            <span class="example-text">{{ item.example }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        未找到相关内容
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const expandedId = ref<string | null>(null)

const theories = [
  {
    id: 'gestalt',
    icon: '🧩',
    title: '格式塔原则',
    description: '人类视觉系统倾向于将元素组织成有意义的整体，而非孤立的部分。',
    tips: [
      '相似性：相似的元素被视为一组',
      '接近性：距离近的元素被视为一组',
      '连续性：视线倾向于沿光滑曲线移动',
      '闭合性：大脑补全不完整图形',
    ],
    example: '导航菜单中相同样式的图标会被视为一个功能组',
  },
  {
    id: 'hicks',
    icon: '⚡',
    title: 'Hick\'s 定律',
    description: '做决定所需时间随选项数量增加而增长。选项越少，决策越快。',
    tips: [
      '减少不必要的选项',
      '将复杂选项分步骤呈现',
      '使用默认值降低决策成本',
      '高频操作置于最显眼处',
    ],
    example: '主操作按钮只有一个，次要操作收到下拉菜单',
  },
  {
    id: 'fitts',
    icon: '🎯',
    title: 'Fitts\'s 定律',
    description: '点击目标所需时间取决于目标大小和距离。目标越大越近，操作越快。',
    tips: [
      '重要按钮要足够大（至少 44px）',
      '常用操作放在用户鼠标自然落点',
      '屏幕边缘是无限大的"目标"',
      '��少操作之间的移动距离',
    ],
    example: 'macOS 菜单栏固定在屏幕顶部边缘，点击更快',
  },
  {
    id: '80-20',
    icon: '📊',
    title: '帕累托原则 (80/20)',
    description: '80% 的结果来自 20% 的原因。设计中优先处理最高频的使用场景。',
    tips: [
      '找出用户最常使用的 20% 功能',
      '将核心功能放在最突出位置',
      '其余功能可隐藏或降级展示',
      '数据驱动功能优先级排序',
    ],
    example: '主界面只展示最常用的 3-5 个功能',
  },
  {
    id: 'miller',
    icon: '🧠',
    title: 'Miller\'s 定律',
    description: '人类工作记忆容量约为 7±2 个信息块，超出会增加认知负担。',
    tips: [
      '导航项目不超过 7 个',
      '将复杂信息分组和分块',
      '使用视觉层次帮助记忆',
      '避免在一个界面展示过多信息',
    ],
    example: '表单分多页填写，每页不超过 5-7 个字段',
  },
  {
    id: 'jakob',
    icon: '🔄',
    title: 'Jakob 定律',
    description: '用户将大部分时间花在其他网站上，期望你的网站与其他网站相似。',
    tips: [
      '遵循行业惯例和设计规范',
      '使用用户熟悉的图标和术语',
      '左上角放 Logo，顶部放导航',
      '创新前先确保可用性',
    ],
    example: '购物车图标用购物篮，不用创意图标',
  },
  {
    id: 'tesler',
    icon: '⚖️',
    title: 'Tesler\'s 定律（复杂性守恒）',
    description: '每个系统都有无法被去除的内在复杂度，只能转移给用户或开发者。',
    tips: [
      '复杂度不消失，只是被转移',
      '让开发者承担复杂度，而非用户',
      '使用智能默认值减少用户输入',
      '后台处理复杂逻辑，界面保持简洁',
    ],
    example: '邮件客户端处理 SMTP 协议复杂性，用户只需点击"发送"',
  },
  {
    id: 'doherty',
    icon: '⚡',
    title: 'Doherty 阈值',
    description: '系统响应时间超过 400ms 时用户专注度下降。快速响应提升参与度。',
    tips: [
      '操作响应在 400ms 内',
      '使用骨架屏、Loading 展示进度',
      '乐观更新：先更新 UI，再确认后端',
      '动画时长控制在 100-300ms',
    ],
    example: '点击按钮立即变化状态，请求完成后再同步结果',
  },
  {
    id: 'peak-end',
    icon: '🎭',
    title: '峰终定律',
    description: '人们对体验的记忆主要取决于最高峰和结束时的感受，而非整体平均。',
    tips: [
      '在关键节点（完成任务）增加正向反馈',
      '结束时给出明确成功状态',
      '修复用户最痛苦的体验节点',
      '庆祝用户的重要成就',
    ],
    example: '注册完成后展示欢迎动画和成就解锁效果',
  },
  {
    id: 'zeigarnik',
    icon: '📋',
    title: 'Zeigarnik 效应',
    description: '未完成的任务比已完成的任务更容易被记住，利用进度感提升粘性。',
    tips: [
      '展示进度条和完成百分比',
      '强调"还差几步就完成了"',
      '用徽章和成就系统激励完成',
      '保存用户未完成的草稿',
    ],
    example: 'LinkedIn 个人资料完善度进度条',
  },
]

const filteredItems = computed(() => {
  if (!searchQuery.value) return theories
  const q = searchQuery.value.toLowerCase()
  return theories.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  )
})

const toggleItem = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<style scoped>
.theory-panel {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.search-bar {
  position: sticky;
  top: 0;
  background: var(--color-bg-primary);
  padding-bottom: var(--spacing-2);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--duration-fast);
  box-sizing: border-box;
}

.search-input:focus { border-color: var(--color-primary-500); }

.theory-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.theory-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.theory-item:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-sm);
}

.theory-item.expanded {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(139, 127, 216, 0.1);
}

.theory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  user-select: none;
}

.theory-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.theory-icon { font-size: 20px; }

.theory-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.theory-arrow {
  font-size: 10px;
  color: var(--color-text-secondary);
}

.theory-body {
  padding: var(--spacing-3);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  animation: slideIn 0.15s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.theory-desc {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: var(--spacing-3);
}

.theory-tips {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-3);
}

.tip-item {
  display: flex;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.tip-dot {
  color: var(--color-primary-500);
  flex-shrink: 0;
}

.theory-example {
  padding: var(--spacing-2) var(--spacing-3);
  background: rgba(139, 127, 216, 0.06);
  border-left: 3px solid var(--color-primary-500);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: var(--text-sm);
}

.example-label {
  font-weight: var(--font-medium);
  color: var(--color-primary-500);
  margin-right: var(--spacing-1);
}

.example-text { color: var(--color-text-secondary); }

.empty-state {
  padding: var(--spacing-6);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

[data-theme='dark'] .theory-header,
[data-theme='dark'] .search-input {
  background: var(--color-neutral-900);
}

[data-theme='dark'] .theory-body {
  background: var(--color-neutral-950);
}

[data-theme='dark'] .search-bar {
  background: var(--color-neutral-950);
}
</style>
