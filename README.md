# AllinoneX

AllinoneX 4.0.0 是同仓库双平台插件项目。Figma 与 MasterGo 版本分别保留独立的主线程源码、清单、构建产物和依赖配置，公共功能通过自动等价检查保持同步。

## 项目结构

```text
AllinoneX/
├── figma/       # Figma 插件：code.ts / code.js / ui.html / manifest.json
├── mastergo/    # MasterGo 插件：main.ts / main.js / ui.html / manifest.json
├── scripts/     # 跨平台功能与版本等价检查
└── docs/        # 双平台维护规范
```

## 本次 4.0.0 更新

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
