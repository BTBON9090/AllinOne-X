// 节点操作工具函数
/// <reference types="@figma/plugin-typings" />

/**
 * 异步获取节点
 */
export async function getNodeAsync(id: string): Promise<BaseNode | null> {
  try {
    return await figma.getNodeByIdAsync(id)
  } catch (error) {
    console.error(`Failed to get node: ${id}`, error)
    return null
  }
}

/**
 * 遍历节点树
 */
export function traverseNode(
  node: BaseNode,
  callback: (node: SceneNode) => void | boolean
): void {
  if ('children' in node) {
    for (const child of node.children) {
      const shouldContinue = callback(child as SceneNode)
      if (shouldContinue !== false) {
        traverseNode(child, callback)
      }
    }
  }
}

/**
 * 异步遍历节点树
 */
export async function traverseNodeAsync(
  node: BaseNode,
  callback: (node: SceneNode) => Promise<void | boolean>
): Promise<void> {
  if ('children' in node) {
    for (const child of node.children) {
      const shouldContinue = await callback(child as SceneNode)
      if (shouldContinue !== false) {
        await traverseNodeAsync(child, callback)
      }
    }
  }
}

/**
 * 收集特定类型的节点
 */
export function collectNodesByType<T extends SceneNode>(
  root: BaseNode,
  type: NodeType
): T[] {
  const nodes: T[] = []

  traverseNode(root, (node) => {
    if (node.type === type) {
      nodes.push(node as T)
    }
  })

  return nodes
}

/**
 * 收集文本节点
 */
export function collectTextNodes(root: BaseNode): TextNode[] {
  return collectNodesByType<TextNode>(root, 'TEXT')
}

/**
 * 视觉排序节点（从左到右，从上到下）
 */
export function sortNodesByPosition(nodes: SceneNode[]): SceneNode[] {
  return nodes.sort((a, b) => {
    const aBox = 'absoluteBoundingBox' in a ? a.absoluteBoundingBox : null
    const bBox = 'absoluteBoundingBox' in b ? b.absoluteBoundingBox : null

    if (!aBox || !bBox) return 0

    // 如果 Y 坐标差异大于 10px，按 Y 排序
    if (Math.abs(aBox.y - bBox.y) > 10) {
      return aBox.y - bBox.y
    }

    // 否则按 X 排序
    return aBox.x - bBox.x
  })
}

/**
 * 批量处理节点
 */
export async function batchProcessNodes<T extends SceneNode>(
  nodes: T[],
  processor: (node: T) => Promise<void>,
  batchSize: number = 50,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const total = nodes.length

  for (let i = 0; i < total; i += batchSize) {
    const batch = nodes.slice(i, i + batchSize)

    await Promise.all(batch.map(processor))

    if (onProgress) {
      onProgress(Math.min(i + batchSize, total), total)
    }

    // 让出主线程
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

/**
 * 加载字体（带错误处理）
 */
export async function loadFontSafe(fontName: FontName): Promise<boolean> {
  try {
    await figma.loadFontAsync(fontName)
    return true
  } catch (error) {
    console.warn(`Failed to load font: ${fontName.family} ${fontName.style}`, error)

    // 尝试加载默认字体
    try {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
      return true
    } catch {
      return false
    }
  }
}

/**
 * 安全地设置文本内容
 */
export async function setTextSafe(
  node: TextNode,
  text: string
): Promise<boolean> {
  try {
    // 检查是否有缺失字体
    if (node.hasMissingFont) {
      console.warn(`Node has missing font: ${node.name}`)
      return false
    }

    // 加载字体
    const fontName = node.fontName as FontName
    const loaded = await loadFontSafe(fontName)

    if (!loaded) {
      return false
    }

    // 设置文本
    node.characters = text
    return true
  } catch (error) {
    console.error(`Failed to set text: ${node.name}`, error)
    return false
  }
}

/**
 * 克隆节点
 */
export function cloneNode<T extends SceneNode>(node: T): T | null {
  if ('clone' in node && typeof node.clone === 'function') {
    return node.clone() as T
  }
  return null
}

/**
 * 删除节点
 */
export function removeNode(node: SceneNode): void {
  if (!node.removed) {
    node.remove()
  }
}

/**
 * 检查节点是否可见
 */
export function isNodeVisible(node: SceneNode): boolean {
  if (!node.visible) return false

  let current: BaseNode | null = node.parent
  while (current) {
    if ('visible' in current && !current.visible) {
      return false
    }
    current = current.parent
  }

  return true
}
