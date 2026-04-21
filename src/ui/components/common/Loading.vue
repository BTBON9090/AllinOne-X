<template>
  <div class="loading-container">
    <div v-if="type === 'spinner'" class="loading-spinner"></div>
    <div v-else-if="type === 'skeleton'" class="loading-skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
    </div>
    <div v-else-if="type === 'dots'" class="loading-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'spinner' | 'skeleton' | 'dots'
  text?: string
}

withDefaults(defineProps<Props>(), {
  type: 'spinner',
  text: '',
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
}

/* 旋转加载器 */
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 骨架屏 */
.loading-skeleton {
  width: 100%;
  max-width: 300px;
}

.skeleton-line {
  height: 12px;
  margin-bottom: var(--spacing-2);
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 0%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 点状加载器 */
.loading-dots {
  display: flex;
  gap: var(--spacing-2);
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 加载文本 */
.loading-text {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  text-align: center;
}

/* 暗色模式 */
[data-theme='dark'] .loading-spinner {
  border-color: var(--color-neutral-700);
  border-top-color: var(--color-primary-500);
}

[data-theme='dark'] .skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-neutral-800) 0%,
    var(--color-neutral-700) 50%,
    var(--color-neutral-800) 100%
  );
}

[data-theme='dark'] .loading-text {
  color: var(--color-neutral-400);
}
</style>
