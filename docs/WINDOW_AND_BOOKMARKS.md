# 贴边气泡、锚点排序与导航分组

2026-10-13，双端共用交互，保持原紫色身份与 Tabler 线性图标。按照 btdesign 的直接可达与轻量层级原则，分组不折叠，不增加搜索或多层分类。

## 使用方式

- 左下角「收起」将窗口缩为 70 × 48 px 内容区，吸附到最近的画布视窗左右边缘。圆形入口沿用紫色四格标识；点击展开。
- 拖动气泡调整位置，松开重新贴边；拖动面板底部移动图标，靠近左右边缘 32 px 时收起。精简模式合并入口，直接拖动「收起」圆圈图标移动面板。
- 聚焦移动控件后按方向键，以 16 px 步长移动。拖拽取消时恢复起点。展开恢复收起前尺寸，面板 DOM 不销毁，功能、输入和滚动保留。不会修改画布视角或选区。
- 锚点保留原来的卡片式布局，右上角手柄支持拖拽排序；聚焦后 ↑ / ↓ 调整，Home / End 移到首尾，Esc 取消拖拽。保存失败或列表已变化时恢复宿主数据并提示重试。
- 侧栏按「效率工具」「组件与图层」「设计拓展」分组。14 个入口均保留，普通中文窗口首屏可见；精简模式以短分隔线代替文字组名。

## 平台边界

仅使用公开 API，不注入编辑器页面、不创建画布悬浮元素、不使用私有标题栏隐藏接口。

- [Figma UI API](https://developers.figma.com/docs/plugins/api/figma-ui/) 规定最小宽度为 70 px，`getPosition` / `reposition` 用于读取与移动窗口；坐标按画布缩放换算。
- [MasterGo UI API](https://developers.mastergo.com/apis/ui.html) 提供 `moveTo` 与 `viewport`；`resize` 第三个参数为 true，确保内容高度不被标题栏扣减。坐标依据 [UIViewport](https://developers.mastergo.com/types/uiviewport.html) 使用画布页面视窗像素。
- 两端原生标题栏仍保留，所以不是无边框的系统级悬浮球。旧宿主缺少移动接口时仍可收起/展开，并提示使用原生标题栏移动。原生标题栏的拖拽不触发插件自定义贴边检测。
- 气泡位置不跨会话保存，避免在另一个窗口或屏幕尺寸下恢复到不可见处。锚点沿用现有存储：Figma 写入文件 pluginData；MasterGo 以 documentId 为键保存在本地 clientStorage，不承诺跨设备同步。

## 安全与验证

排序仅接受现有 ID 的完整排列；拒绝缺失、重复和未知 ID。后台只重排原对象，保留页面、选区、缩放等全部元数据。锚点读写串行化，避免重命名/删除/排序并发覆盖。名称通过 textContent/input.value 渲染，不解释 HTML，不改写用户内容中的中文或 emoji。

已实测：双端构建与等价检查；窗口坐标换算、拖拽/取消、贴边、尺寸恢复、旧宿主降级；真实 Chromium 中鼠标/键盘排序、取消、失败恢复、名称安全、中英文切换、气泡点击与拖动区分、页面和输入保留、正常与精简深色布局。浏览器宿主消息为模拟；尚未在真实 Figma / MasterGo 窗口中实测标题栏与实际移动轨迹。

检查命令：`npm run verify`、`npm run check:window-bookmarks-ui`、`npm run check:workspace-ui`、`npm run check:localization-ui`。浏览器检查需要 Playwright（可指定 `PLAYWRIGHT_MODULE_PATH` 与 `PLAYWRIGHT_EXECUTABLE_PATH`）。

截图为 iframe 内容，不包括宿主原生标题栏：`ui-redesign-groups.png`、`ui-redesign-bookmarks.png`、`ui-redesign-bubble.png`、`ui-redesign-groups-compact.png`。
