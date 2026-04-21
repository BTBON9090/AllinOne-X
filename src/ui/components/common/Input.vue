<template>
  <div class="input-wrapper">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'input',
        {
          'input-error': error,
          'input-disabled': disabled,
        },
      ]"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span v-if="error" class="input-error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'number' | 'password' | 'email' | 'url'
  placeholder?: string
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: []
  blur: []
}>()

const isFocused = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-default);
  outline: none;
}

.input::placeholder {
  color: var(--color-neutral-400);
}

.input:hover:not(:disabled) {
  border-color: var(--color-neutral-400);
}

.input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(139, 127, 216, 0.1);
}

.input-error {
  border-color: var(--color-error);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-neutral-50);
}

.input-error-message {
  font-size: var(--text-sm);
  color: var(--color-error);
}

/* 暗色模式 */
[data-theme='dark'] .input {
  color: var(--color-neutral-100);
  background: var(--color-neutral-900);
  border-color: var(--color-neutral-700);
}

[data-theme='dark'] .input::placeholder {
  color: var(--color-neutral-600);
}

[data-theme='dark'] .input:hover:not(:disabled) {
  border-color: var(--color-neutral-600);
}

[data-theme='dark'] .input-disabled {
  background: var(--color-neutral-800);
}
</style>
