// 异步队列管理
/// <reference types="@figma/plugin-typings" />

interface QueueTask<T = any> {
  id: string
  execute: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: Error) => void
}

class AsyncQueue {
  private queue: QueueTask[] = []
  private running = false
  private concurrency = 1

  /**
   * 添加任务到队列
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const queueTask: QueueTask<T> = {
        id: `task_${Date.now()}_${Math.random()}`,
        execute: task,
        resolve,
        reject,
      }

      this.queue.push(queueTask)
      this.process()
    })
  }

  /**
   * 处理队列
   */
  private async process() {
    if (this.running || this.queue.length === 0) {
      return
    }

    this.running = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (!task) break

      try {
        const result = await task.execute()
        task.resolve(result)
      } catch (error) {
        task.reject(error as Error)
      }
    }

    this.running = false
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue.forEach((task) => {
      task.reject(new Error('Queue cleared'))
    })
    this.queue = []
  }

  /**
   * 获取队列长度
   */
  size(): number {
    return this.queue.length
  }
}

// 导出单例
export const asyncQueue = new AsyncQueue()

/**
 * 批量执行任务
 */
export async function batchExecute<T, R>(
  items: T[],
  executor: (item: T, index: number) => Promise<R>,
  batchSize: number = 50,
  onProgress?: (current: number, total: number) => void
): Promise<R[]> {
  const results: R[] = []
  const total = items.length

  for (let i = 0; i < total; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((item, batchIndex) => executor(item, i + batchIndex))
    )
    results.push(...batchResults)

    if (onProgress) {
      const current = Math.min(i + batchSize, total)
      onProgress(current, total)

      // 发送进度到 UI
      figma.ui.postMessage({
        type: 'progress',
        current,
        total,
      })
    }

    // 让出主线程
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return results
}

/**
 * 重试执行
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}

/**
 * 超时包装
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), timeout)
    ),
  ])
}
