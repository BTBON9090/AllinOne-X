# AllinoneX

AllinoneX 4.1.0 是同仓库双平台插件项目。Figma 与 MasterGo 版本分别保留独立的主线程源码、清单、构建产物和依赖配置，公共功能通过自动等价检查保持同步。

## 项目结构

```text
AllinoneX/
├── figma/       # Figma 插件：code.ts / code.js / ui.html / manifest.json
├── mastergo/    # MasterGo 插件：main.ts / main.js / ui.html / manifest.json
├── scripts/     # 跨平台功能与版本等价检查
└── docs/        # 双平台维护规范
```

## 本次 4.1.0 更新

- 查重移入“实验室”，结果行可一次定位两侧元素，改为严格左右等分布局，并可恢复最近一次结果。
- CompKit 矩阵严格采用配置的边距与间距；说明书新增紧凑浅色、紧凑深色、横向简洁、竖向完整四套方案。
- 将批量排布合并为说明书的“批量目录”输出范围，组件集保持为最外层画板直接子项。
- 实例逆向改用紧凑二维网格，修复多变体结果宽度异常膨胀。
- 新增 AI 组件规范优化：支持中英文、命名风格、分隔符、组件描述和异常反馈；限制为一个组件集或最多十个组件。

## 4.0.0 更新

- 合并 Figma V2 与 MasterGo 两个独立项目。
- Figma 版补齐 MasterGo 新增的实例逆向母版与组件构建器。
- 修复两个版本超级选择器无法按选中画板的子级/子孙范围查询的问题。
- 智能填充的用户自定义字段新增顺序与随机两种填充方式。
- 新增跨平台消息分支、导航、UI ID、国际化键和关键行为等价检查。

## 开发与验证

```bash
npm run install:all
npm run build
npm run verify
```

分别加载：

- Figma：`figma/manifest.json`
- MasterGo：`mastergo/manifest.json`

双平台同步规则见 [`docs/DUAL_PLATFORM_MAINTENANCE.md`](docs/DUAL_PLATFORM_MAINTENANCE.md)，源版本基线见 [`SOURCE_BASELINES.md`](SOURCE_BASELINES.md)。
