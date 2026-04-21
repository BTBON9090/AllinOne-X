<template>
  <div class="simple-tools-panel">
    <div class="tools-grid">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="tool-button"
        :class="{ disabled: tool.disabled }"
        @click="executeTool(tool.id)"
        :title="tool.description"
      >
        <span class="tool-icon">{{ tool.icon }}</span>
        <span class="tool-name">{{ tool.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'

const { send } = useMessage()
const appStore = useAppStore()

const tools = ref([
  { id: 'to-frame', name: '转Frame', icon: '⬜', description: '将选中的形状转换为Frame' },
  { id: 'to-rect', name: '转矩形', icon: '▭', description: '将Frame/Group转换为矩形' },
  { id: 'swap-fs', name: '交换填充', icon: '⇄', description: '交换填充和描边' },
  { id: 'reset-image', name: '重置图片', icon: '🖼️', description: '恢复图片原始比例' },
  { id: 'select-text', name: '选文本', icon: 'T', description: '选中所有文本图层' },
  { id: 'remove-al', name: '移除布局', icon: '⊟', description: '移除自动布局' },
  { id: 'add-al-wrapper', name: '添加布局', icon: '⊞', description: '添加自动布局外套' },
  { id: 'split-text', name: '拆分文本', icon: '✂', description: '按行拆分文本' },
  { id: 'join-text', name: '合并文本', icon: '⊕', description: '合并多个文本' },
  { id: 'up-one', name: '上移一层', icon: '↑', description: '移出父级一层' },
  { id: 'up-all', name: '上移顶层', icon: '⇈', description: '移到顶层' },
  { id: 'rename-content', name: '重命名', icon: '✏', description: '用文本内容重命名' },
  { id: 'detach-all', name: '解绑组件', icon: '🔗', description: '解绑所有组件实例' },
  { id: 'remove-hidden', name: '删隐藏', icon: '👁', description: '删除隐藏图层' },
  { id: 'sort-layers', name: '排序图层', icon: '⇅', description: '按位置排序图层' },
  { id: 'ungroup-all', name: '解组', icon: '⊟', description: '解散所有组' },
  { id: 'unlock-all', name: '解锁', icon: '🔓', description: '解锁所有图层' },
  { id: 'pixel-perfect', name: '像素对齐', icon: '⊞', description: '坐标取整' }
])

const executeTool = (toolId: string) => {
  appStore.setLoading(true)
  send(toolId)

  setTimeout(() => {
    appStore.setLoading(false)
  }, 500)
}
</script>

<style scoped>
.simple-tools-panel {
  padding: var(--spacing-4);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2);
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  min-height: 72px;
}

.tool-button:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-500);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.tool-button:active {
  transform: translateY(0);
}

.tool-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-icon {
  font-size: 24px;
  line-height: 1;
}

.tool-name {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.2;
}
</style>
