// 日志系统

import type { LogLevel, LogEntry } from '@shared/types'

class Logger {
  private logs: LogEntry[] = []
  private maxLogs: number = 1000
  private enabled: boolean = true

  /**
   * 记录调试信息
   */
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  /**
   * 记录普通信息
   */
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  /**
   * 记录警告信息
   */
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }

  /**
   * 记录错误信息
   */
  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context)
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (!this.enabled) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
    }

    this.logs.push(entry)

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 输出到控制台
    const prefix = `[${level.toUpperCase()}] ${new Date(entry.timestamp).toISOString()}`
    const logMessage = `${prefix} ${message}`

    switch (level) {
      case 'debug':
        console.debug(logMessage, context)
        break
      case 'info':
        console.info(logMessage, context)
        break
      case 'warn':
        console.warn(logMessage, context)
        break
      case 'error':
        console.error(logMessage, context)
        break
    }
  }

  /**
   * 获取所有日志
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level)
    }
    return [...this.logs]
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = []
  }

  /**
   * 导出日志
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * 启用/禁用日志
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  /**
   * 设置最大日志数量
   */
  setMaxLogs(max: number) {
    this.maxLogs = max
  }
}

// 导出单例
export const logger = new Logger()

// 全局错误处理
export function setupGlobalErrorHandler() {
  // 捕获未处理的错误
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
    })
  })

  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise,
    })
  })
}
