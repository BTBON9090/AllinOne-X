// 窗口调整 Composable

import { ref, onMounted, onUnmounted } from 'vue'
import { postMessage } from '@/utils/message'
import { throttle } from '@/utils/async'
import { WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT } from '@shared/constants'

export function useResize() {
  const sidebarCollapsed = ref(false)
  const isResizing = ref(false)

  /**
   * 调整窗口大小
   */
  const resizeWindow = (width: number, height: number) => {
    const finalWidth = Math.max(width, WINDOW_MIN_WIDTH)
    const finalHeight = Math.max(height, WINDOW_MIN_HEIGHT)

    postMessage('resize', {
      width: finalWidth,
      height: finalHeight,
    })
  }

  /**
   * 处理拖拽调整
   */
  const handleResizeDrag = (e: MouseEvent) => {
    if (!isResizing.value) return

    const width = e.clientX
    const height = e.clientY

    resizeWindow(width, height)
  }

  /**
   * 开始拖拽
   */
  const startResize = () => {
    isResizing.value = true
    document.body.style.cursor = 'nwse-resize'
  }

  /**
   * 停止拖拽
   */
  const stopResize = () => {
    isResizing.value = false
    document.body.style.cursor = ''
  }

  /**
   * 切换侧边栏折叠状态
   */
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 自动折叠侧边栏（窗口过小时）
   */
  const checkAutoCollapse = throttle(() => {
    if (window.innerWidth < 500 && !sidebarCollapsed.value) {
      sidebarCollapsed.value = true
    }
  }, 150)

  // 挂载时设置事件监听
  onMounted(() => {
    window.addEventListener('mousemove', handleResizeDrag)
    window.addEventListener('mouseup', stopResize)
    window.addEventListener('resize', checkAutoCollapse)
  })

  // 卸载时清理事件监听
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleResizeDrag)
    window.removeEventListener('mouseup', stopResize)
    window.removeEventListener('resize', checkAutoCollapse)
  })

  return {
    sidebarCollapsed,
    isResizing,
    resizeWindow,
    startResize,
    stopResize,
    toggleSidebar,
  }
}
