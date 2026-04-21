<template>
  <div v-if="show" class="onboarding-overlay" @click.self="skip">
    <div class="onboarding-modal">
      <!-- 进度指示器 -->
      <div class="progress-dots">
        <span
          v-for="i in totalSteps"
          :key="i"
          :class="['dot', { active: i === currentStep }]"
        />
      </div>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤 1: 欢迎 -->
        <div v-if="currentStep === 1" class="step">
          <div class="step-icon">🎨</div>
          <h2 class="step-title">欢迎使用 AllinOne-Claude</h2>
          <p class="step-desc">
            一个功能强大的 Figma 设计工具集，帮助你更高效地完成设计工作。
          </p>
          <div class="feature-grid">
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">18个简易工具</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span class="feature-text">超级选择</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✏️</span>
              <span class="feature-text">智能填充</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌍</span>
              <span class="feature-text">多语言支持</span>
            </div>
          </div>
        </div>

        <!-- 步骤 2: 简易工具 -->
        <div v-if="currentStep === 2" class="step">
          <div class="step-icon">🛠️</div>
          <h2 class="step-title">简易工具</h2>
          <p class="step-desc">
            18个常用设计工具，一键完成重复性操作。
          </p>
          <div class="tool-examples">
            <div class="example-item">
              <span class="example-icon">⬜</span>
              <div class="example-text">
                <strong>转Frame/矩形</strong>
                <p>快速转换图层类型</p>
              </div>
            </div>
            <div class="example-item">
              <span class="example-icon">✂</span>
              <div class="example-text">
                <strong>拆分/合并文本</strong>
                <p>批量处理文本图层</p>
              </div>
            </div>
            <div class="example-item">
              <span class="example-icon">⊞</span>
              <div class="example-text">
                <strong>像素对齐</strong>
                <p>坐标自动取整</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤 3: 超级选择 -->
        <div v-if="currentStep === 3" class="step">
          <div class="step-icon">🎯</div>
          <h2 class="step-title">超级选择</h2>
          <p class="step-desc">
            强大的筛选功能，快速找到你需要的图层。
          </p>
          <div class="feature-list">
            <div class="list-item">
              <span class="list-icon">✓</span>
              <span>按名称、类型、状态筛选</span>
            </div>
            <div class="list-item">
              <span class="list-icon">✓</span>
              <span>支持包含/排除逻辑</span>
            </div>
            <div class="list-item">
              <span class="list-icon">✓</span>
              <span>5种查找范围选择</span>
            </div>
            <div class="list-item">
              <span class="list-icon">✓</span>
              <span>实时结果预览</span>
            </div>
          </div>
        </div>

        <!-- 步骤 4: 其他功能 -->
        <div v-if="currentStep === 4" class="step">
          <div class="step-icon">✨</div>
          <h2 class="step-title">更多强大功能</h2>
          <p class="step-desc">
            探索更多实用工具，提升设计效率。
          </p>
          <div class="more-features">
            <div class="more-item">
              <span class="more-icon">📝</span>
              <strong>智能填充</strong>
              <p>批量填充文本数据</p>
            </div>
            <div class="more-item">
              <span class="more-icon">🔄</span>
              <strong>文字替换</strong>
              <p>查找和替换文本</p>
            </div>
            <div class="more-item">
              <span class="more-icon">📍</span>
              <strong>时空信标</strong>
              <p>保存视图位置</p>
            </div>
            <div class="more-item">
              <span class="more-icon">🧠</span>
              <strong>设计理论</strong>
              <p>学习设计原则</p>
            </div>
          </div>
        </div>

        <!-- 步骤 5: 开始使用 -->
        <div v-if="currentStep === 5" class="step">
          <div class="step-icon">🚀</div>
          <h2 class="step-title">准备就绪！</h2>
          <p class="step-desc">
            现在你可以开始使用 AllinOne-Claude 了。
          </p>
          <div class="tips-box">
            <h4 class="tips-title">💡 小提示</h4>
            <ul class="tips-list">
              <li>使用侧边栏快速切换功能模块</li>
              <li>大部分工具支持批量操作</li>
              <li>可以在设置中自定义主题和语言</li>
              <li>遇到问题可以查看文档或反馈</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button v-if="currentStep > 1" class="btn-secondary" @click="prev">
          上一步
        </button>
        <button class="btn-text" @click="skip">
          {{ currentStep === totalSteps ? '关闭' : '跳过' }}
        </button>
        <button v-if="currentStep < totalSteps" class="btn-primary" @click="next">
          下一步
        </button>
        <button v-else class="btn-primary" @click="finish">
          开始使用
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const show = ref(false)
const currentStep = ref(1)
const totalSteps = 5

const next = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prev = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skip = () => {
  show.value = false
  settingsStore.setOnboardingCompleted(true)
}

const finish = () => {
  show.value = false
  settingsStore.setOnboardingCompleted(true)
}

onMounted(() => {
  // 检查是否是首次使用
  if (!settingsStore.onboardingCompleted) {
    setTimeout(() => {
      show.value = true
    }, 500)
  }
})

defineExpose({
  show: () => {
    show.value = true
    currentStep.value = 1
  }
})
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.onboarding-modal {
  width: 90%;
  max-width: 480px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: var(--spacing-6);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neutral-300);
  transition: all var(--duration-normal);
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--color-primary-500);
}

.step-content {
  min-height: 320px;
  margin-bottom: var(--spacing-6);
}

.step {
  animation: fadeIn 0.3s ease-out;
}

.step-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: var(--spacing-4);
}

.step-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  text-align: center;
  margin-bottom: var(--spacing-3);
}

.step-desc {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  text-align: center;
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.feature-icon {
  font-size: 32px;
}

.feature-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
}

.tool-examples {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.example-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.example-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.example-text strong {
  display: block;
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  margin-bottom: 2px;
}

.example-text p {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin: 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  font-size: var(--text-base);
  color: var(--color-neutral-700);
}

.list-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(139, 127, 216, 0.1);
  color: var(--color-primary-500);
  border-radius: 50%;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.more-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.more-item {
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-align: center;
}

.more-icon {
  font-size: 28px;
  display: block;
  margin-bottom: var(--spacing-2);
}

.more-item strong {
  display: block;
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  margin-bottom: 4px;
}

.more-item p {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  margin: 0;
}

.tips-box {
  padding: var(--spacing-4);
  background: rgba(139, 127, 216, 0.08);
  border: 1px solid rgba(139, 127, 216, 0.2);
  border-radius: var(--radius-md);
}

.tips-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-3);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.tips-list li {
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  padding-left: var(--spacing-4);
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary-500);
  font-weight: var(--font-bold);
}

.actions {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.btn-primary,
.btn-secondary,
.btn-text {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  border: none;
}

.btn-primary {
  flex: 1;
  background: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
}

.btn-text {
  background: none;
  color: var(--color-text-secondary);
  padding: var(--spacing-2) var(--spacing-3);
}

.btn-text:hover {
  color: var(--color-text-primary);
}

[data-theme='dark'] .step-title {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .step-desc {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .feature-text,
[data-theme='dark'] .list-item {
  color: var(--color-neutral-300);
}

[data-theme='dark'] .example-text strong,
[data-theme='dark'] .more-item strong,
[data-theme='dark'] .tips-title {
  color: var(--color-neutral-100);
}

[data-theme='dark'] .example-text p,
[data-theme='dark'] .more-item p {
  color: var(--color-neutral-400);
}

[data-theme='dark'] .tips-list li {
  color: var(--color-neutral-300);
}
</style>
