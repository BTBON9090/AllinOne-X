import { h, FunctionalComponent } from 'preact';
import { useState, useCallback } from 'preact/hooks';

export interface ButtonProps {
  children?: any;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  className?: string;
}

export const Button: FunctionalComponent<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  block = false,
  className = ''
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const blockClass = block ? 'btn-block' : '';
  
  const classes = [baseClass, variantClass, sizeClass, blockClass, className]
    .filter(Boolean)
    .join(' ');
  
  return (
    <button
      class={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span class="btn-loading">⏳</span> : null}
      {children}
    </button>
  );
};

export interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: FunctionalComponent<IconButtonProps> = ({
  icon,
  onClick,
  title,
  active = false,
  size = 'md'
}) => {
  return (
    <button
      class={`icon-btn ${active ? 'active' : ''} icon-btn-${size}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
};

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle: FunctionalComponent<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);
  
  return (
    <label class={`toggle ${disabled ? 'disabled' : ''}`}>
      <span class="toggle-label">{label}</span>
      <span 
        class={`toggle-switch ${checked ? 'checked' : ''}`}
        onClick={handleClick}
      >
        <span class="toggle-thumb" />
      </span>
    </label>
  );
};
