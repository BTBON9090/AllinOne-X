// 应用状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NotificationOptions } from '@shared/types'

export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref(false)
  const currentFeature = ref('simple')
  const notifications = ref<Array<NotificationOptions & { id: string }>>([])

  // 计算属性
  const isLoading = computed(() => loading.value)
  const hasNotifications = computed(() => notifications.value.length > 0)

  // 操作
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setCurrentFeature = (feature: string) => {
    currentFeature.value = feature
  }

  const showNotification = (options: NotificationOptions) => {
    const id = `notification_${Date.now()}_${Math.random()}`
    const notification = { ...options, id }

    notifications.value.push(notification)

    // 自动移除通知
    const duration = options.duration || 3000
    setTimeout(() => {
      removeNotification(id)
    }, duration)

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    // 状态
    loading,
    currentFeature,
    notifications,

    // 计算属性
    isLoading,
    hasNotifications,

    // 操作
    setLoading,
    setCurrentFeature,
    showNotification,
    removeNotification,
    clearNotifications,
  }
})
