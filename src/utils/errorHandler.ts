import { ErrorHandlerError } from '../types';

export const ErrorHandler = {
  errors: [] as ErrorHandlerError[],
  maxErrors: 50,
  
  init(): void {
    window.onerror = (msg, url, line, col, error) => {
      this.handleError({
        type: 'sync',
        message: String(msg),
        source: url,
        line,
        col,
        stack: error?.stack,
        time: Date.now()
      });
      return false;
    };
    
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: (event.reason as Error)?.message || String(event.reason),
        stack: (event.reason as Error)?.stack,
        time: Date.now()
      });
    });
    
    window.addEventListener('error', (event) => {
      if (event.error) {
        this.handleError({
          type: 'resource',
          message: event.message,
          source: event.filename,
          line: event.lineno,
          col: event.colno,
          time: Date.now()
        });
      }
    }, true);
  },
  
  handleError(error: ErrorHandlerError): void {
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    console.error('[ErrorHandler]', error);
    
    if (typeof window.showErrorToast === 'function') {
      window.showErrorToast(error.message);
    }
  },
  
  getErrors(): ErrorHandlerError[] {
    return this.errors;
  },
  
  clearErrors(): void {
    this.errors = [];
  }
};

declare global {
  interface Window {
    showErrorToast: (message: string, duration?: number) => void;
  }
}
