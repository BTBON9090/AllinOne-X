import { h, FunctionalComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: any;
  footer?: any;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: FunctionalComponent<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  const handleBackdropClick = useCallback((e: Event) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);
  
  if (!open) return null;
  
  return (
    <div class="modal-backdrop" onClick={handleBackdropClick}>
      <div class={`modal modal-${size}`}>
        {title && (
          <div class="modal-header">
            <h3 class="modal-title">{title}</h3>
            <button class="modal-close" onClick={onClose}>✕</button>
          </div>
        )}
        <div class="modal-body">{children}</div>
        {footer && <div class="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export const ConfirmDialog: FunctionalComponent<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  variant = 'default'
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p class="confirm-message">{message}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" onClick={onClose}>{cancelText}</button>
        <button class={`btn btn-${variant === 'danger' ? 'danger' : 'primary'}`} onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
