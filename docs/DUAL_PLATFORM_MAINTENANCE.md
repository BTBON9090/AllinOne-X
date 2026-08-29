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
