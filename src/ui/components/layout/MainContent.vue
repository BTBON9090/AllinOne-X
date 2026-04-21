<template>
  <main class="main-content">
    <div class="content-scroll">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
// 主内容区域组件
</script>

<style scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  background: var(--color-neutral-50);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-6);
}

/* 暗色模式 */
[data-theme='dark'] .main-content {
  background: var(--color-neutral-900);
}
</style>
