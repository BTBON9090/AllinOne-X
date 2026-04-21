// 构建后处理脚本 - 将 UI 和插件代码合并为 Figma 要求的格式

const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '../dist')
const uiHtmlPath = path.join(distDir, 'index.html')
const pluginJsPath = path.join(distDir, 'plugin/plugin/main.js')
const manifestSrcPath = path.join(__dirname, '../manifest.json')
const outputCodePath = path.join(distDir, 'code.js')
const outputUiPath = path.join(distDir, 'ui.html')
const outputManifestPath = path.join(distDir, 'manifest.json')

console.log('📦 Post-build processing...')

// 1. 读取构建后的 UI HTML
if (!fs.existsSync(uiHtmlPath)) {
  console.error('❌ UI HTML not found:', uiHtmlPath)
  process.exit(1)
}

const uiHtml = fs.readFileSync(uiHtmlPath, 'utf8')
console.log('✅ UI HTML loaded')

// 2. 重命名 index.html 为 ui.html
fs.renameSync(uiHtmlPath, outputUiPath)
console.log('✅ UI HTML renamed to ui.html')

// 3. 读取插件代码
if (!fs.existsSync(pluginJsPath)) {
  console.error('❌ Plugin JS not found:', pluginJsPath)
  console.error('   Looking for:', pluginJsPath)
  process.exit(1)
}

let pluginCode = fs.readFileSync(pluginJsPath, 'utf8')
console.log('✅ Plugin code loaded')

// 4. 写入最终的 code.js（不需要内联 HTML，Figma 会自动加载 ui.html）
fs.writeFileSync(outputCodePath, pluginCode)
console.log('✅ Plugin code written to code.js')

// 5. 复制 manifest.json 到 dist 目录
fs.copyFileSync(manifestSrcPath, outputManifestPath)
console.log('✅ manifest.json copied to dist')

// 6. 清理不需要的文件
const pluginDir = path.join(distDir, 'plugin')
if (fs.existsSync(pluginDir)) {
  fs.rmSync(pluginDir, { recursive: true, force: true })
  console.log('✅ Cleaned up plugin directory')
}

console.log('🎉 Build completed successfully!')
console.log('📁 Output files in dist/:')
console.log('  - manifest.json')
console.log('  - code.js')
console.log('  - ui.html')
console.log('')
console.log('💡 To import in Figma:')
console.log('   Plugins → Development → Import plugin from manifest')
console.log('   Select: dist/manifest.json')
