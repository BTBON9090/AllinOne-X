import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { keyframes } from './styles/animations'

// 导入全局样式
import './styles/global.css'

// 创建应用实例
const app = createApp(App)

// 使用 Pinia
const pinia = createPinia()
app.use(pinia)

// 注入动画关键帧到页面
const style = document.createElement('style')
style.textContent = keyframes
document.head.appendChild(style)

// 挂载应用
app.mount('#app')
