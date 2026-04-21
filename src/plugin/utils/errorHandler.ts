// 错误处理工具
/// <reference types="@figma/plugin-typings" />

interface ErrorContext {
  operation: string
  nodeId?: string
  nodeName?: string
  [key: string]: any
}

/**
 * 错误处理类
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public context?: ErrorContext
  ) {
    super(message)
    this.name = 'PluginError'
  }
}

/**
 * 全局错误处理器
 */
export function handleError(error: Error, context?: ErrorContext): void {
  console.error('Plugin error:', error, context)

  // 发送错误到 UI
  figma.ui.postMessage({
    type: 'error',
    message: error.message,
    context,
  })

  // 显示通知
  figma.notify(`错误: ${error.message}`, { error: true })
}

/**
 * 安全执行函数
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context?: ErrorContext
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    handleError(error as Error, context)
    return null
  }
}

/**
 * 包装异步函数，添加错误处理
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error as Error, context)
      throw error
    }
  }) as T
}

/**
 * 验证选择
 */
export function validateSelection(
  minCount: number = 1,
  maxCount?: number
): boolean {
  const selection = figma.currentPage.selection

  if (selection.length < minCount) {
    figma.notify(`请至少选择 ${minCount} 个图层`)
    return false
  }

  if (maxCount && selection.length > maxCount) {
    figma.notify(`最多只能选择 ${maxCount} 个图层`)
    return false
  }

  return true
}

/**
 * 验证节点类型
 */
export function validateNodeType(
  node: SceneNode,
  allowedTypes: NodeType[]
): boolean {
  return allowedTypes.includes(node.type)
}

/**
 * 记录操作日志
 */
export function logOperation(
  operation: string,
  details?: Record<string, any>
): void {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${operation}`, details)

  // 发送日志到 UI
  figma.ui.postMessage({
    type: 'log',
    level: 'info',
    message: operation,
    details,
    timestamp,
  })
}
