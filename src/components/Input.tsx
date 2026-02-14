import { h, FunctionalComponent } from 'preact';
import { useState, useCallback } from 'preact/hooks';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'password' | 'email';
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Input: FunctionalComponent<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div class={`input-wrapper ${error ? 'has-error' : ''} ${className}`}>
      <input
        type={type}
        value={value}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        disabled={disabled}
        class="input-field"
      />
      {error && <span class="input-error">{error}</span>}
    </div>
  );
};

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: FunctionalComponent<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = ''
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      disabled={disabled}
      class={`select-field ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export const Textarea: FunctionalComponent<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = ''
}) => {
  return (
    <textarea
      value={value}
      onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      class={`textarea-field ${className}`}
    />
  );
};
