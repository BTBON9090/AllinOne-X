# 英文界面校对与设计理论改版

日期：2026-10-08。分支：`codex/ui-layout-redesign`。

## 文案范围

核对原有 568 项中英文词条，增加 142 项英文校对覆盖和 443 条补充界面词语、
提示或说明。共享词库也覆盖含数量、尺寸等参数的运行提示。全部 18 个理论主题、
58 个分项均有完整的英文标题、解释、案例和价值说明。

重点修正术语与不自然缩写，例如：

| 原显示 | 校对后 |
| --- | --- |
| Comp...Refiner | Component Cleanup |
| Ex-PPT | PPT Export |
| i18n Converter | Language Switch |
| Restore source | Rebuild main component |
| Sort by visibility | Sort by position |
| ComponSet | Component Set |
| API Address | API Base URL |

覆盖主面板、设置、隐藏字段、工具提示、可访问名称、下拉选项、
高级属性、数字与时间序列设置、尺寸分类、导入导出、弹窗和宿主通知。
前端固定文案通过可恢复绑定切换语言，动态文案由共享词库处理。

输入框的值、图层名、组件属性与合集名、自定义列表内容、AI 返回内容、
已填充的姓名与日期等数据保持原文。日期格式标签译为 Chinese date，
实际格式值仍为 `YYYY年MM月DD日`。修复时间设置编辑时省略已保存秒数的问题。

## 理论正文校对

英文正文与中文正文共用相同主题 ID 与分项顺序。对不准确的绝对措辞进行了同步修正：
启发式规则没有“消除 80% 错误”的保证，记忆分块不能直接用作所有菜单的数量上限，
400ms 不是所有任务的统一硬性期限，费茨模型也不是简单的距离正比。
微软指南的“支持高效纠正”名称与内容已统一。

术语核对参考：

- 尼尔森启发式原则：[Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)。
- WCAG 的四项原则：[W3C WCAG at a Glance](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)。
- 人与 AI 的能力说明、纠正和学习：[Microsoft Human–AI Interaction Guidelines](https://www.microsoft.com/en-us/research/?p=564561)。
- 原子设计的组成与非线性关系：[Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/)。

这些参考用于术语与相关概念核对；案例是插件内的简化应用说明。

## 阅读与输入布局

详情页采用单列阅读结构：小图标与标题、简介、章节导航、分项说明。
取消大图标、超大数字和多层卡片，每个分项按“核心释义 / 应用案例 / 理论价值”
阅读；核心观点用浅底区域标出。内容区独立滚动，侧栏与底部输入保持稳定。

首页、详情和对话共用紧凑输入区，发送按钮为 28px 图标控件。输入会按内容增高，
支持 Enter 发送、Shift+Enter 换行，并避免输入法确认时误发。
空输入与等待回答时禁用发送；等待期间输入的后续草稿不会丢失。

从详情页提问会携带该理论的上下文，返回后继续阅读原主题。
请求超时或关闭对话时清理监听器；过期回答不写入新对话。

预览：

- [中文详情](ui-redesign-theory-zh.png)
- [英文详情](ui-redesign-theory-en.png)
- [英文对话与输入区](ui-redesign-theory-chat.png)
- [精简深色界面](ui-redesign-theory-compact.png)

## 验证

- `npm run verify`：构建、语法、双端功能等价、填充与数列、姓名库和纯翻译检查。
- `npm run check:localization-ui`：真实浏览器逐页扫描英文残留，覆盖全部理论详情、
  高级属性、尺寸分类、数字/日期/时间设置；验证语言往返、数据保留、输入法、
  键盘、上下文提问、章节跳转和普通/精简布局。
- `npm run check:workspace-ui`：回归原有 14 个功能入口与相关交互。

浏览器中使用模拟宿主数据和模拟 AI 响应。真实设计文件操作与真实 AI 服务响应
尚未在本轮进行端到端验收。
