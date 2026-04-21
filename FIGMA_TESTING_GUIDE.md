# 在 Figma 中测试插件 - 详细步骤

## 方法 1：Figma Desktop（推荐）

### 步骤 1：安装 Figma Desktop
如果还没有安装：
1. 访问 https://www.figma.com/downloads/
2. 下载并安装 Figma Desktop 应用
3. 登录你的 Figma 账号

### 步骤 2：构建插件
```bash
cd /Users/aiden/Desktop/claudcode/AllinOne-Claude
npm run build
```

确保看到以下输出：
```
✓ built in 550ms
🎉 Build completed successfully!
📁 Output files:
  - ui.html
  - code.js
```

### 步骤 3：导入插件到 Figma

#### 方式 A：通过菜单导入
1. 打开 Figma Desktop
2. 打开任意文件（或创建新文件）
3. 点击顶部菜单：**Plugins** → **Development** → **Import plugin from manifest...**
4. 在弹出的文件选择器中，导航到项目根目录
5. 选择 `manifest.json` 文件
6. 点击"打开"

#### 方式 B：通过快捷键
1. 在 Figma 中按 `Cmd/Ctrl + /`（打开快速操作）
2. 输入 "Import plugin from manifest"
3. 选择 `manifest.json` 文件

### 步骤 4：运行插件

#### 首次运行
1. 点击顶部菜单：**Plugins** → **Development** → **AllinOne-CC**
2. 插件窗口会弹出，显示 UI 界面

#### 后续运行（快捷方式）
1. 按 `Cmd/Ctrl + /` 打开快速操作
2. 输入 "AllinOne" 或 "CC"
3. 选择插件运行

### 步骤 5：测试功能

#### 测试 1：基础 UI
- ✅ 检查插件窗口是否正常显示
- ✅ 检查侧边栏是否显示 10 个功能模块
- ✅ 点击侧边栏项目，检查是否切换面板
- ✅ 点击折叠按钮，检查侧边栏是否折叠

#### 测试 2：主题切换
1. 点击侧边栏底部的"设置"按钮
2. 在主题选项中切换"亮色"/"暗色"/"系统"
3. 检查 UI 是否正确切换主题
4. 关闭插件，重新打开
5. 检查主题设置是否保持

#### 测试 3：智能填充功能
1. 在 Figma 画布上创建几个文本图层：
   - 按 `T` 键创建文本
   - 输入一些占位文字
   - 创建 3-5 个文本图层

2. 选中这些文本图层（按住 Shift 点击）

3. 在插件中点击"智能填充"

4. 输入测试数据（每行一个）：
   ```
   测试文本 1
   测试文本 2
   测试文本 3
   ```

5. 点击"执行填充"

6. 检查文本是否被正确替换

#### 测试 4：窗口调整
1. 将鼠标移到插件窗口右下角
2. 看到调整手柄（小三角图标）
3. 拖拽调整窗口大小
4. 检查窗口是否正确调整
5. 尝试调整到很小，检查是否有最小尺寸限制（400x500px）

#### 测试 5：错误处理
1. 不选择任何图层
2. 点击"智能填充"
3. 尝试执行填充
4. 应该看到错误提示："请至少选择 1 个图层"

### 步骤 6：查看控制台（调试）

如果遇到问题，打开开发者控制台：
1. 在 Figma 中，点击菜单：**Plugins** → **Development** → **Open Console**
2. 控制台会显示所有日志和错误信息
3. 查看是否有红色错误信息

### 步骤 7：重新加载插件（修改代码后）

当你修改代码后，需要重新构建和加载：

```bash
# 1. 重新构建
npm run build

# 2. 在 Figma 中重新运行插件
# 方式 A：关闭插件窗口，重新打开
# 方式 B：在控制台中刷新
```

**注意**：Figma 会缓存插件代码，如果修改没有生效：
1. 完全关闭插件窗口
2. 在 Figma 中按 `Cmd/Ctrl + Option/Alt + P`
3. 右键点击你的插件
4. 选择 "Remove"
5. 重新导入 manifest.json

---

## 方法 2：Figma Web（有限支持）

Figma Web 版本对开发插件的支持有限，建议使用 Desktop 版本。

如果必须使用 Web 版本：
1. 访问 https://www.figma.com/
2. 打开文件
3. 点击 **Plugins** → **Development**
4. 注意：Web 版本可能无法导入本地插件

---

## 常见问题

### Q1: 插件窗口不显示？
**解决方案**：
1. 检查控制台是否有错误
2. 确认 `ui.html` 文件存在且不为空
3. 检查 `manifest.json` 中的 `ui` 字段是否正确

### Q2: 插件显示空白？
**解决方案**：
1. 打开控制台查看 JavaScript 错误
2. 检查 `code.js` 中的 `__html__` 变量是否正确
3. 尝试重新构建：`npm run build`

### Q3: 功能不工作？
**解决方案**：
1. 打开控制台查看错误信息
2. 检查是否选择了正确的图层
3. 检查后端代码是否有错误

### Q4: 修改代码后没有变化？
**解决方案**：
1. 确保运行了 `npm run build`
2. 完全关闭插件窗口
3. 重新打开插件
4. 如果还不行，移除插件后重新导入

### Q5: 控制台显示 "Cannot find module"？
**解决方案**：
1. 检查 `package.json` 中的依赖
2. 运行 `npm install`
3. 重新构建

---

## 调试技巧

### 1. 使用 console.log
在代码中添加日志：
```typescript
console.log('当前状态:', state)
console.log('收到消息:', message)
```

### 2. 使用 logger
```typescript
import { logger } from '@/utils/logger'

logger.debug('调试信息', { data })
logger.info('普通信息')
logger.error('错误信息')
```

### 3. 查看网络请求
在控制台的 Network 标签中查看 API 请求

### 4. 断点调试
1. 在控制台的 Sources 标签中找到代码
2. 点击行号设置断点
3. 重新触发功能
4. 代码会在断点处暂停

---

## 性能监控

### 查看构建时间
```bash
npm run build
# 查看输出中的 "built in XXXms"
```

### 查看包大小
```bash
ls -lh ui.html code.js
# ui.html 应该约 104KB
```

### 查看运行时性能
1. 打开控制台
2. 切换到 Performance 标签
3. 点击录制
4. 执行操作
5. 停止录制
6. 分析性能瓶颈

---

## 发布准备

当插件测试完成，准备发布时：

### 1. 更新版本号
编辑 `manifest.json`：
```json
{
  "version": "2.0.0"
}
```

### 2. 最终构建
```bash
npm run build
```

### 3. 测试所有功能
- [ ] 所有功能正常工作
- [ ] 没有控制台错误
- [ ] UI 显示正确
- [ ] 性能良好

### 4. 准备发布资源
- [ ] 截图（至少 3 张）
- [ ] 插件描述
- [ ] 使用说明
- [ ] 更新日志

### 5. 提交到 Figma Community
1. 在 Figma 中打开插件
2. 点击 "Publish"
3. 填写信息
4. 提交审核

---

> 💡 **提示**：开发时保持控制台打开，可以实时看到日志和错误！
