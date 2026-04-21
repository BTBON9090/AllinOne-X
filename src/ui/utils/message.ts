// 消息通信工具

import type { PluginMessage } from '@shared/types'

/**
 * 发送消息到插件后端
 */
export function postMessage(type: string, data: Record<string, any> = {}) {
  parent.postMessage(
    {
      pluginMessage: {
        type,
        ...data,
      },
    },
    '*'
  )
}

/**
 * 监听来自插件后端的消息
 */
export function onMessage(
  handler: (message: PluginMessage) => void
): () => void {
  const listener = (event: MessageEvent) => {
    const message = event.data.pluginMessage
    if (message) {
      handler(message)
    }
  }

  window.addEventListener('message', listener)

  // 返回清理函数
  return () => {
    window.removeEventListener('message', listener)
  }
}

/**
 * 发送消息并等待响应
 */
export function sendMessageWithResponse<T = any>(
  type: string,
  data: Record<string, any> = {},
  timeout: number = 10000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const requestId = `${type}_${Date.now()}_${Math.random()}`

    const cleanup = onMessage((message) => {
      if (message.requestId === requestId) {
        cleanup()
        clearTimeout(timer)

        if (message.error) {
          reject(new Error(message.error))
        } else {
          resolve(message.data)
        }
      }
    })

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(`Request timeout: ${type}`))
    }, timeout)

    postMessage(type, { ...data, requestId })
  })
}

/**
 * 批量发送消息
 */
export function postMessageBatch(messages: Array<{ type: string; data?: Record<string, any> }>) {
  messages.forEach(({ type, data }) => {
    postMessage(type, data)
  })
}
