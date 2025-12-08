import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src/ui', // 设置根目录为 ui 文件夹
  build: {
    outDir: '../../dist', // 输出到项目根目录下的 dist
    emptyOutDir: false, // 不要清空 dist，因为 code.js 也在里面
    target: 'es2015',
    minify: false, // 方便调试，不压缩代码
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/ui/index.html'),
      },
      output: {
        entryFileNames: 'ui.js',
        assetFileNames: '[name].[ext]', // 保持文件名简洁
      }
    }
  }
});