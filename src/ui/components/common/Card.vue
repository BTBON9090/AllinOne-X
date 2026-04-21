<template>
  <div
    :class="[
      'card',
      `card-${theme}`,
      {
        'card-hoverable': hoverable,
        'card-clickable': clickable,
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  theme?: 'default' | 'orange' | 'blue' | 'purple' | 'green' | 'pink'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'default',
  hoverable: false,
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.card {
  padding: var(--spacing-4);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-default);
}

.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-clickable {
  cursor: pointer;
  user-select: none;
}

.card-clickable:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* 主题色 */
.card-orange {
  background: #FFF7ED;
  border-color: rgba(194, 65, 12, 0.1);
  color: #C2410C;
}

.card-blue {
  background: #EFF6FF;
  border-color: rgba(29, 78, 216, 0.1);
  color: #1D4ED8;
}

.card-purple {
  background: #F5F3FF;
  border-color: rgba(109, 40, 217, 0.1);
  color: #6D28D9;
}

.card-green {
  background: #ECFDF5;
  border-color: rgba(4, 120, 87, 0.1);
  color: #047857;
}

.card-pink {
  background: #FDF2F8;
  border-color: rgba(190, 24, 93, 0.1);
  color: #BE185D;
}

/* 暗色模式 */
[data-theme='dark'] .card {
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-800);
}

[data-theme='dark'] .card-orange {
  background: rgba(194, 65, 12, 0.15);
  border-color: rgba(194, 65, 12, 0.2);
  color: #FB923C;
}

[data-theme='dark'] .card-blue {
  background: rgba(29, 78, 216, 0.15);
  border-color: rgba(29, 78, 216, 0.2);
  color: #60A5FA;
}

[data-theme='dark'] .card-purple {
  background: rgba(109, 40, 217, 0.15);
  border-color: rgba(109, 40, 217, 0.2);
  color: #A78BFA;
}

[data-theme='dark'] .card-green {
  background: rgba(4, 120, 87, 0.15);
  border-color: rgba(4, 120, 87, 0.2);
  color: #34D399;
}

[data-theme='dark'] .card-pink {
  background: rgba(190, 24, 93, 0.15);
  border-color: rgba(190, 24, 93, 0.2);
  color: #F472B6;
}
</style>
