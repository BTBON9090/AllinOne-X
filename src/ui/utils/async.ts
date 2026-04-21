// 防抖和节流工具

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      func.apply(this, args)
    }
  }
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 批量执行任务
 * @param tasks 任务数组
 * @param batchSize 每批次大小
 * @param onProgress 进度回调
 */
export async function batchExecute<T, R>(
  tasks: T[],
  executor: (task: T) => Promise<R>,
  batchSize: number = 50,
  onProgress?: (current: number, total: number) => void
): Promise<R[]> {
  const results: R[] = []
  const total = tasks.length

  for (let i = 0; i < total; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(executor))
    results.push(...batchResults)

    if (onProgress) {
      onProgress(Math.min(i + batchSize, total), total)
    }

    // 让出主线程，避免阻塞 UI
    await sleep(0)
  }

  return results
}

/**
 * 重试函数
 * @param func 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 */
export async function retry<T>(
  func: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await func()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        await sleep(delay * (i + 1)) // 指数退避
      }
    }
  }

  throw lastError!
}

/**
 * 超时包装
 * @param promise 要包装的 Promise
 * @param timeout 超时时间（毫秒）
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
