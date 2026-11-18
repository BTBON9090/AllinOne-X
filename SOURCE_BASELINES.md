# Source baselines

AllinoneX 4.0.0 使用以下权威源重新整合：

| 平台 | 源仓库 / 分支 | 基线提交 | 拉取日期 |
| --- | --- | --- | --- |
| Figma | `BTBON9090/AllinOne-X` / `Allinone-v2` | `61c432a40bfe6f5658b77923a4d9768b4286ad51` | 2026-08-29 |
| MasterGo | `BTBON9090/Allinone-MasterGo` / `main` | `c62f622be9bae3c0a25943ff2555d8eba96d9868` | 2026-08-29 |

后续功能开发以本仓库的 `figma/` 和 `mastergo/` 为主，不再把其中一个平台当作另一个平台的临时副本。若需要再次吸收独立源仓库的提交，先记录新基线，再逐项移植并通过根目录 `npm run verify`。
