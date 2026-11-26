# 插件发布

在仓库根目录运行 `npm run build:export`，然后在对应的桌面客户端选择清单。首次构建先运行 `npm run install:all`。

| 平台 | 选择的文件 | 社区插件 ID |
| --- | --- | --- |
| Figma | `release/figma/manifest.json` | `1579115225697225019` |
| MasterGo | `release/mastergo/manifest.json` | `202453773340163` |

每个平台的清单、主线程脚本和 `ui.html` 必须放在同一目录。复制发布包时，把对应平台的整个目录一起复制。

更新市场时，在客户端选择原插件条目。Figma 从作者社区主页的 **Publish → 插件 → AllinOne** 进入。MasterGo 从 **插件 → 插件管理 → 开发与发布 → All in One for MasterGo** 进入。提交前核对原有简介、图标、封面和标签。

发布目录中的运行文件由构建生成。源码位于仓库根目录下的 `figma/`、`mastergo/` 和 `shared/`。
