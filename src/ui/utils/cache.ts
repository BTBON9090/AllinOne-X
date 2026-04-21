// 缓存管理工具

import { CACHE_EXPIRY } from '@shared/constants'

interface CacheItem<T> {
  value: T
  expiry: number
}

/**
 * 内存缓存
 */
class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map()

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, ttl: number = CACHE_EXPIRY.MEDIUM): void {
    const expiry = Date.now() + ttl
    this.cache.set(key, { value, expiry })
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }
}

/**
 * 持久化缓存（使用 localStorage）
 */
class PersistentCache {
  private prefix: string = 'allinone_cache_'

  /**
   * 设置缓存
   */
  set<T>(key: string, value: T, ttl: number = CACHE_EXPIRY.LONG): void {
    const expiry = Date.now() + ttl
    const item: CacheItem<T> = { value, expiry }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.error('Failed to set persistent cache:', error)
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.prefix + key)

      if (!data) {
        return null
      }

      const item: CacheItem<T> = JSON.parse(data)

      // 检查是否过期
      if (Date.now() > item.expiry) {
        this.delete(key)
        return null
      }

      return item.value
    } catch (error) {
      console.error('Failed to get persistent cache:', error)
      return null
    }
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    localStorage.removeItem(this.prefix + key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const item: CacheItem<any> = JSON.parse(data)
            if (now > item.expiry) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // 删除损坏的缓存
          localStorage.removeItem(key)
        }
      }
    })
  }
}

// 导出单例
export const memoryCache = new MemoryCache()
export const persistentCache = new PersistentCache()

// 定期清理过期缓存
setInterval(() => {
  memoryCache.cleanup()
  persistentCache.cleanup()
}, 5 * 60 * 1000) // 每 5 分钟清理一次
