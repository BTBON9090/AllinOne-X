<template>
  <div
    class="resize-handle"
    @mousedown="startResize"
    title="拖拽调整窗口大小"
  >
    <div class="resize-icon"></div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'start-resize': []
}>()

const startResize = () => {
  emit('start-resize')
}
</script>

<style scoped>
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 4px;
}

.resize-icon {
  width: 12px;
  height: 12px;
  border-right: 2px solid var(--color-neutral-400);
  border-bottom: 2px solid var(--color-neutral-400);
  border-bottom-right-radius: 2px;
  transition: border-color var(--duration-fast) var(--ease-default);
}

.resize-handle:hover .resize-icon {
  border-color: var(--color-primary-500);
}

.resize-handle:active .resize-icon {
  border-color: var(--color-primary-600);
}

/* 暗色模式 */
[data-theme='dark'] .resize-icon {
  border-color: var(--color-neutral-600);
}

[data-theme='dark'] .resize-handle:hover .resize-icon {
  border-color: var(--color-primary-400);
}
</style>
