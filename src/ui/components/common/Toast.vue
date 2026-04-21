<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="['toast', `toast-${type}`]"
      @click="close"
    >
      <div class="toast-icon">{{ icon }}</div>
      <div class="toast-content">
        <div class="toast-message">{{ message }}</div>
      </div>
      <button class="toast-close" @click.stop="close">×</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { NotificationType } from '@shared/types'

interface Props {
  type: NotificationType
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return 'ℹ'
  }
})

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

onMounted(() => {
  visible.value = true

  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 300px;
  max-width: 500px;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-default);
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  line-height: var(--leading-normal);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  font-size: 20px;
  color: var(--color-neutral-500);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--color-neutral-700);
  background: var(--color-neutral-100);
}

/* 类型样式 */
.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-success .toast-icon {
  color: var(--color-success);
  background: var(--color-success-light);
}

.toast-error {
  border-left: 4px solid var(--color-error);
}

.toast-error .toast-icon {
  color: var(--color-error);
  background: var(--color-error-light);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-warning .toast-icon {
  color: var(--color-warning);
  background: var(--color-warning-light);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

.toast-info .toast-icon {
  color: var(--color-info);
  background: var(--color-info-light);
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 暗色模式 */
[data-theme='dark'] .toast {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .toast-message {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .toast-close {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .toast-close:hover {
  color: var(--color-neutral-200);
  background: var(--color-neutral-800);
}
</style>
