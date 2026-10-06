# 双平台维护规范

## 单一功能、两套平台实现

每次增加、修改或删除画布功能时，应在同一个提交中同时检查：

1. `figma/code.ts` 与 `mastergo/main.ts` 的消息分支和画布 API 实现。
2. 两端 `ui.html` 的功能入口、元素 ID、事件参数和中英文文案。
3. 两端编译产物 `code.js` / `main.js`。
4. 根目录版本号以及两个子项目的版本号。

## 平台 API 对照

| 能力 | Figma | MasterGo |
| --- | --- | --- |
| 全局对象 | `figma` | `mg` |
| 当前页 | `figma.currentPage` | `mg.document.currentPage` |
| UI 消息 | `figma.ui.postMessage` | `mg.ui.postMessage` |
| 节点读取 | `getNodeByIdAsync` | `getNodeById` |
| Frame 组件化 | `createComponentFromNode` | `createComponent` 后迁移内容 |
| 合并变体 | `combineAsVariants(nodes, parent)` | `combineAsVariants(nodes)` |
| Auto Layout | `layoutMode` 等 | `flexMode` 等 |
| 矢量节点 | `VECTOR` | `PEN` |

## 提交流程

1. 同步修改两端源码和 UI。
2. 运行 `npm run verify`。
3. 人工在 Figma 与 MasterGo 各执行一次涉及画布写入的核心路径。
4. 同一提交包含两端生成产物，避免源码与插件实际加载文件漂移。

跨平台检查会比较主线程消息分支、导航入口、UI ID、国际化键、超级选择器范围读取、自定义随机填充和组件构建器关键能力。平台特有 API 可以不同，但用户可见功能必须保持一致。

## 共享面板结构（4.3.0 起）

- `shared/ui-shell.css`：语义颜色、字号、间距、滚动与通用控件。
- `shared/ui-shell.js`：离线 Tabler 图标和遗留控件的渐进增强。
- `shared/workspace-header.html`、`shared/workspace-home.html`：统一标题、全局查找和工具筛选模板。
- `shared/workspace.js`：路由注册、任务分组、搜索、滚动恢复、主题跟随和数列设置披露。
- `shared/fill-generators.js`：无宿主依赖的数列与时间序列函数。

执行 `npm run sync:ui` 更新两端 HTML 内标记区；不要直接修改生成的标记区。主线程的宿主 API 仍各自维护，避免将平台差异伪装成相同实现。

新增面板时同步更新路由注册、两端静态模板与导航，再运行功能等价和浏览器回归。浏览器测试是模拟宿主消息，不替代真实 Figma / MasterGo 画布验收。
