// 共享类型定义

// 消息类型
export type MessageType =
  // 存储相关
  | 'save-storage'
  | 'load-storage'
  | 'storage-saved'
  | 'storage-loaded'

  // 简易工具
  | 'to-frame'
  | 'to-rect'
  | 'split-text'
  | 'join-text'
  | 'remove-al'
  | 'add-al-wrapper'
  | 'up-one'
  | 'up-all'
  | 'ungroup-all'
  | 'unlock-all'
  | 'swap-fs'
  | 'reset-image'
  | 'sort-layers'
  | 'rename-content'
  | 'detach-all'
  | 'remove-hidden'
  | 'pixel-perfect'
  | 'swap-positions'

  // 智能填充
  | 'get-selection-count'
  | 'selection-count-res'
  | 'smart-fill-exec'

  // 文字替换
  | 'text-find-matches'
  | 'text-replace'

  // 超级选择
  | 'super-select'

  // PPT 导出
  | 'ppt-export'

  // 网络请求
  | 'do-fetch'
  | 'api-response'

  // 窗口调整
  | 'resize'

  // 错误处理
  | 'error'
  | 'notify'

// 消息数据结构
export interface PluginMessage {
  type: MessageType
  [key: string]: any
}

// 存储键
export type StorageKey =
  | 'theme'
  | 'language'
  | 'sidebar-collapsed'
  | 'smart-fill-config'
  | 'ai-config'
  | 'onboarding-completed'

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'zh' | 'en'

// 智能填充模式
export type SmartFillMode = 'replace' | 'prefix' | 'suffix'

// 智能填充分布
export type SmartFillDistribution = 'order' | 'random'

// 智能填充配置
export interface SmartFillConfig {
  mode: SmartFillMode
  distribution: SmartFillDistribution
  dataList: string[]
}

// AI 配置
export interface AIConfig {
  provider: 'openai' | 'deepseek' | 'claude'
  apiKey: string
  model: string
  baseURL?: string
}

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// 通知选项
export interface NotificationOptions {
  type: NotificationType
  message: string
  duration?: number
}

// 错误信息
export interface ErrorInfo {
  message: string
  stack?: string
  context?: Record<string, any>
}

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// 日志条目
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: number
  context?: Record<string, any>
}
