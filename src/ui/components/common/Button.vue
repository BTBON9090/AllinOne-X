<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-loading': loading,
        'btn-disabled': disabled,
        'btn-block': block,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  user-select: none;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* 尺寸 */
.btn-sm {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-sm);
  height: 28px;
}

.btn-md {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-base);
  height: 36px;
}

.btn-lg {
  padding: var(--spacing-3) var(--spacing-5);
  font-size: var(--text-lg);
  height: 44px;
}

/* 变体 */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-secondary {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
  border: 1px solid var(--color-neutral-200);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-300);
}

.btn-ghost {
  background: transparent;
  color: var(--color-neutral-700);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-neutral-100);
}

.btn-danger {
  background: var(--color-error);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 状态 */
.btn-disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-loading {
  cursor: wait;
}

.btn-block {
  width: 100%;
}

/* 加载动画 */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 暗色模式 */
[data-theme='dark'] .btn-secondary {
  background: var(--color-neutral-800);
  color: var(--color-neutral-100);
  border-color: var(--color-neutral-700);
}

[data-theme='dark'] .btn-secondary:hover:not(:disabled) {
  background: var(--color-neutral-700);
  border-color: var(--color-neutral-600);
}

[data-theme='dark'] .btn-ghost {
  color: var(--color-neutral-300);
}

[data-theme='dark'] .btn-ghost:hover:not(:disabled) {
  background: var(--color-neutral-800);
}
</style>
