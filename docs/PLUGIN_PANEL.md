# 插件面板

Figma 与 MasterGo 使用同一套面板。浅色模式采用纯白背景，品牌主色取自原图标的紫色 `#5E00C2`。左上角和收起后的气泡共用[原始 logo](../mastergo/assets/all-in-one-logo.png)。设置中的「主题」提供浅色、深色和跟随系统。

侧栏按任务分组。常规窗口显示图标和名称，精简模式使用图标侧栏。窄窗口可以从页头展开工具目录，通过 Esc 或点击目录外区域返回工具。

简易工具按画板与布局、图层整理、文本与组件、图像与样式分组。批量图标修复按图层勾选，支持原位修复和副本导出。图层查重采用成对比较，尺寸助手先编辑宽高再查找预设，等轴形变在调节参数时保留预览。

## 维护

- 在 [panel-system.css](../shared/panel-system.css) 修改共享颜色、字号和控件。
- 在 [workbench.css](../shared/workbench.css) 和 [workspace.js](../shared/workspace.js) 修改导航、页头与响应式目录。
- 各工具页的布局和交互位于 [tool-layouts.css](../shared/tool-layouts.css) 和 [tool-layouts.js](../shared/tool-layouts.js)。首页命令分组位于 [tool-home.js](../shared/tool-home.js) 和 [tool-home.css](../shared/tool-home.css)。
- 运行 `npm run sync:ui` 将共享实现同步至两端 HTML。运行 `npm run verify` 重建宿主脚本并验证行为。
