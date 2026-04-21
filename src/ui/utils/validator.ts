// 输入验证工具

/**
 * 验证字符串是否为空
 */
export function isEmptyString(value: string): boolean {
  return !value || value.trim().length === 0
}

/**
 * 验证字符串长度
 */
export function validateStringLength(
  value: string,
  min: number = 0,
  max: number = Infinity
): { valid: boolean; error?: string } {
  const length = value.length

  if (length < min) {
    return { valid: false, error: `最少需要 ${min} 个字符` }
  }

  if (length > max) {
    return { valid: false, error: `最多允许 ${max} 个字符` }
  }

  return { valid: true }
}

/**
 * 验证数字范围
 */
export function validateNumberRange(
  value: number,
  min: number = -Infinity,
  max: number = Infinity
): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: '请输入有效的数字' }
  }

  if (value < min) {
    return { valid: false, error: `数值不能小于 ${min}` }
  }

  if (value > max) {
    return { valid: false, error: `数值不能大于 ${max}` }
  }

  return { valid: true }
}

/**
 * 验证 URL
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, error: '请输入有效的 URL' }
  }
}

/**
 * 验证 API Key
 */
export function validateAPIKey(key: string): { valid: boolean; error?: string } {
  if (isEmptyString(key)) {
    return { valid: false, error: 'API Key 不能为空' }
  }

  if (key.length < 10) {
    return { valid: false, error: 'API Key 格式不正确' }
  }

  return { valid: true }
}

/**
 * 验证 JSON 字符串
 */
export function validateJSON(json: string): { valid: boolean; error?: string; data?: any } {
  try {
    const data = JSON.parse(json)
    return { valid: true, data }
  } catch (error) {
    return { valid: false, error: 'JSON 格式不正确' }
  }
}

/**
 * 清理 HTML 标签
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * 验证文件大小
 */
export function validateFileSize(
  size: number,
  maxSize: number = 10 * 1024 * 1024 // 默认 10MB
): { valid: boolean; error?: string } {
  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return { valid: false, error: `文件大小不能超过 ${maxSizeMB}MB` }
  }

  return { valid: true }
}

/**
 * 验证文件类型
 */
export function validateFileType(
  fileName: string,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (!extension || !allowedTypes.includes(extension)) {
    return {
      valid: false,
      error: `只允许上传 ${allowedTypes.join(', ')} 格式的文件`,
    }
  }

  return { valid: true }
}

/**
 * 防止 XSS 攻击
 */
export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * 验证颜色值
 */
export function validateColor(color: string): { valid: boolean; error?: string } {
  // 支持 hex, rgb, rgba, hsl, hsla
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/
  const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/
  const hslaRegex = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/

  const isValid =
    hexRegex.test(color) ||
    rgbRegex.test(color) ||
    rgbaRegex.test(color) ||
    hslRegex.test(color) ||
    hslaRegex.test(color)

  if (!isValid) {
    return { valid: false, error: '请输入有效的颜色值' }
  }

  return { valid: true }
}
