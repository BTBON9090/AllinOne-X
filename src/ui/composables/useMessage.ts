// 消息通信 Composable

import { onMounted, onUnmounted } from 'vue'
import { postMessage, onMessage, sendMessageWithResponse } from '@/utils/message'
import { logger } from '@/utils/logger'
import type { PluginMessage } from '@shared/types'

export function useMessage() {
  let cleanup: (() => void) | null = null

  /**
   * 发送消息
   */
  const send = (type: string, data?: Record<string, any>) => {
    logger.debug(`Sending message: ${type}`, data)
    postMessage(type, data)
  }

  /**
   * 发送消息并等待响应
   */
  const sendWithResponse = async <T = any>(
    type: string,
    data?: Record<string, any>,
    timeout?: number
  ): Promise<T> => {
    logger.debug(`Sending message with response: ${type}`, data)
    try {
      const response = await sendMessageWithResponse<T>(type, data, timeout)
      logger.debug(`Received response for: ${type}`, response)
      return response
    } catch (error) {
      logger.error(`Message failed: ${type}`, { error })
      throw error
    }
  }

  /**
   * 监听消息
   */
  const listen = (handler: (message: PluginMessage) => void) => {
    cleanup = onMessage((message) => {
      logger.debug(`Received message: ${message.type}`, message)
      handler(message)
    })
  }

  /**
   * 监听特定类型的消息
   */
  const listenTo = (type: string, handler: (data: any) => void) => {
    cleanup = onMessage((message) => {
      if (message.type === type) {
        logger.debug(`Received message: ${type}`, message)
        handler(message)
      }
    })
  }

  // 组件卸载时清理
  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })

  return {
    send,
    sendWithResponse,
    listen,
    listenTo,
  }
}
