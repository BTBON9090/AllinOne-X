<template>
  <div class="jumpback-panel">
    <div class="panel-header">
      <p class="description">保存当前视图位置和选中状态，随时跳回</p>
      <button class="btn-save" @click="saveSpot" :disabled="spots.length >= 5">
        <span class="icon">📍</span>
        <span>保存当前位置</span>
      </button>
    </div>

    <div v-if="spots.length === 0" class="empty-state">
      <span class="empty-icon">🔖</span>
      <p>暂无保存的位置</p>
      <p class="hint">最多可保存 5 个锚点</p>
    </div>

    <div v-else class="spots-list">
      <div
        v-for="spot in spots"
        :key="spot.id"
        class="spot-item"
      >
        <div class="spot-info">
          <input
            v-if="editingId === spot.id"
            v-model="editingName"
            class="spot-name-input"
            @blur="finishRename(spot.id)"
            @keyup.enter="finishRename(spot.id)"
            @keyup.esc="cancelRename"
            ref="nameInput"
          />
          <div v-else class="spot-name" @dblclick="startRename(spot)">
            {{ spot.name }}
          </div>
          <div class="spot-meta">
            <span class="page-name">{{ spot.pageName }}</span>
            <span class="zoom">{{ Math.round(spot.zoom * 100) }}%</span>
          </div>
        </div>

        <div class="spot-actions">
          <button class="btn-icon" @click="jumpToSpot(spot.id)" title="跳转">
            🚀
          </button>
          <button class="btn-icon" @click="startRename(spot)" title="重命名">
            ✏️
          </button>
          <button class="btn-icon btn-delete" @click="deleteSpot(spot.id)" title="删除">
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAppStore } from '@/stores/app'

const { send, listen } = useMessage()
const appStore = useAppStore()

interface Spot {
  id: string
  name: string
  pageId: string
  pageName: string
  zoom: number
  centerX: number
  centerY: number
  selectionIds: string[]
}

const spots = ref<Spot[]>([])
const editingId = ref<string | null>(null)
const editingName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

const saveSpot = () => {
  if (spots.value.length >= 5) {
    appStore.showNotification({
      type: 'warning',
      message: '最多只能保存 5 个锚点'
    })
    return
  }

  send('jb-save')
}

const jumpToSpot = (id: string) => {
  send('jb-jump', { id })
}

const deleteSpot = (id: string) => {
  send('jb-delete', { id })
}

const startRename = (spot: Spot) => {
  editingId.value = spot.id
  editingName.value = spot.name
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

const finishRename = (id: string) => {
  if (editingName.value.trim()) {
    send('jb-rename', { id, newName: editingName.value.trim() })
  }
  editingId.value = null
  editingName.value = ''
}

const cancelRename = () => {
  editingId.value = null
  editingName.value = ''
}

onMounted(() => {
  // 初始化加载锚点
  send('jb-init')

  // 监听后端返回的锚点数据
  listen((message) => {
    if (message.type === 'jb-render-spots') {
      spots.value = message.data
    }
  })
})
</script>

<style scoped>
.jumpback-panel {
  padding: var(--spacing-4);
}

.panel-header {
  margin-bottom: var(--spacing-4);
}

.description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-3);
}

.btn-save {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-3);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 18px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-3);
  opacity: 0.5;
}

.hint {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-2);
}

.spots-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.spot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.spot-item:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-sm);
}

.spot-info {
  flex: 1;
  min-width: 0;
}

.spot-name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
  cursor: pointer;
  user-select: none;
}

.spot-name:hover {
  color: var(--color-primary-500);
}

.spot-name-input {
  width: 100%;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border: 1px solid var(--color-primary-500);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  outline: none;
}

.spot-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.page-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zoom {
  padding: 2px 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.spot-actions {
  display: flex;
  gap: var(--spacing-1);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-icon:hover {
  background: var(--color-bg-tertiary);
  transform: scale(1.1);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* 暗色模式 */
[data-theme='dark'] .spot-item {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .spot-name-input {
  background: var(--color-neutral-950);
  border-color: var(--color-primary-400);
}
</style>
