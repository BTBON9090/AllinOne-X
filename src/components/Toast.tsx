import { h, FunctionalComponent } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: FunctionalComponent<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);
  
  if (!visible) return null;
  
  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚡',
    info: 'ℹ'
  };
  
  return (
    <div class={`toast toast-${type}`}>
      <span class="toast-icon">{icons[type]}</span>
      <span class="toast-message">{message}</span>
      <button class="toast-close" onClick={handleClose}>✕</button>
    </div>
  );
};

let toastContainer: HTMLDivElement | null = null;

export function showToast(
  message: string, 
  type: ToastProps['type'] = 'info',
  duration = 4000
): void {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">✕</button>
  `;
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn?.addEventListener('click', () => {
    toast.remove();
  });
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showErrorToast(message: string, duration = 4000): void {
  showToast(message, 'error', duration);
}

export function showSuccessToast(message: string, duration = 3000): void {
  showToast(message, 'success', duration);
}
