# 插件面板

Figma 与 MasterGo 使用同一套面板。浅色模式采用纯白背景，品牌主色取自原图标的紫色 `#5E00C2`。左上角和收起后的气泡共用[原始 logo](../mastergo/assets/all-in-one-logo.png)。设置中的「主题」提供浅色、深色和跟随系统。

页标题、分组标题和辅助说明通过字号、字重与留白区分。浅色圆角底用于当前选项和局部提示，输入框与次要按钮保留完整的轻描边。

点击侧栏顶部 AllinOne 品牌区的任意位置，即可将整个插件窗口收起为 70 × 48 px 的标志气泡。点击气泡可恢复原窗口尺寸、当前工具、输入内容和滚动位置。

在窄窗口中，点击页头的工具目录按钮即可查看带名称的导航。选择工具、按 Esc 或点击目录外区域可关闭目录。

简易工具按画板与布局、图层整理、文本与组件、图像与样式分组。批量图标修复按图层勾选，支持原位修复和副本导出。图层查重采用成对比较，尺寸助手先编辑宽高再查找预设，等轴形变在调节参数时保留预览。

## 维护

- 在 [panel-system.css](../shared/panel-system.css) 修改共享颜色、字号和控件。
- 在 [workbench.css](../shared/workbench.css) 和 [workspace.js](../shared/workspace.js) 修改导航、页头与响应式目录。
- 各工具页的布局和交互位于 [tool-layouts.css](../shared/tool-layouts.css) 和 [tool-layouts.js](../shared/tool-layouts.js)。首页命令分组位于 [tool-home.js](../shared/tool-home.js) 和 [tool-home.css](../shared/tool-home.css)。
- 运行 `npm run sync:ui` 将共享实现同步至两端 HTML。运行 `npm run verify` 重建宿主脚本并验证行为。
