# 组件构建器 × AI：产品研究与路线图

## 结论

最值得优先做的不是“让 AI 直接画组件”，而是让 AI 成为**组件属性架构师**：读取所选 Frame / Instance 的结构摘要，推断哪些差异应成为 `VARIANT`、`TEXT`、`BOOLEAN`、`INSTANCE_SWAP`，先给用户一份可编辑的构建计划，再交给确定性的 MasterGo 插件 API 执行。

这条路线与 MasterGo 官方建议一致：清晰命名、变体管理、自动布局和语义化变量会显著提升 AI 对设计系统的理解与代码映射准确率。组件构建器可以把零散设计稿转成更“AI 友好”的组件资产，而不是只增加一次性的生成能力。

参考：

- [MasterGo `createComponent` / `combineAsVariants` API](https://developers.mastergo.com/apis/mastergo.html)
- [MasterGo 组件属性与属性引用 API](https://developers.mastergo.com/types/componentPropertiesRelated.html)
- [MasterGo 变量与组件属性绑定 API](https://developers.mastergo.com/apis/variables.html)
- [让 AI 更好理解你的设计系统](https://mastergo.com/help/ai-features/ai-design-system-best-practices.html)
- [MasterGo AI 能力总览](https://mastergo.com/help/ai-features/01-what-can-ai-do.html)

## 创造性功能方向

### 1. AI 属性架构师（建议作为 MVP）

选中一组相似 Frame 后，AI 自动识别稳定结构和差异层，给出：

- 推荐的组件名和代码侧名称，例如 `Button` / `ButtonProps`；
- 推荐的变体轴，例如 `Size = S | M | L`、`State = Default | Hover | Disabled`；
- 应暴露的文字、显隐和实例切换属性；
- 可能产生组合爆炸的变体，并建议把部分差异改成布尔或实例属性；
- 不一致结构、缺失 Auto Layout、命名冲突和无法安全绑定的层级。

用户可以在预览表中改名、取消属性或调整类型，确认后再构建。AI 不直接持有画布写权限。

### 2. 相似 Frame 自动聚类与组件去重

扫描一个页面或选区，将视觉结构、图层语义和尺寸相近的 Frame 聚类。AI 解释“为什么它们应属于同一组件”，插件再提供三种处理建议：

- 合并为组件集；
- 保留为独立组件但统一命名；
- 判定为重复设计并链接到已有组件实例。

这可以把“发现重复组件 → 比较差异 → 建立变体”串成一条工作流。

### 3. 缺失状态补全器

根据已有变体、团队 Token 和常见交互语义，提示缺失状态，例如按钮缺少 `Loading` / `Disabled`，输入框缺少 `Error` / `Focus`。AI 先生成状态规格和差异说明；用户确认后，插件复制最近的安全母版并应用受控修改。

关键限制：只使用现有组件库、变量和样式；无法映射的视觉值必须进入人工确认列表。

### 4. 组件健康度与 AI-Ready 评分

为所选组件生成一份可修复报告：

- 图层命名语义化程度；
- 变体轴是否清晰、是否存在重复或组合爆炸；
- Auto Layout 覆盖率和响应式风险；
- 硬编码颜色/间距与 Token 绑定率；
- 文字、布尔、实例属性暴露完整度；
- 设计组件名与前端组件名的一致性。

评分不是终点；每条问题都应对应一个可预览、可撤销的小范围修复动作。

### 5. 自然语言组件构建

支持类似指令：

> 把选中的 12 个按钮做成组件集，以尺寸和状态为变体；文案设为文字属性，左右图标设为实例属性，不暴露角标数字。

AI 将指令解析成结构化计划，复用当前组件构建器执行，不直接生成任意脚本。适合熟悉设计系统、希望减少表单配置的用户。

### 6. 设计—代码契约生成

组件构建完成后，AI 同步生成：

- TypeScript Props / JSON Schema；
- 设计属性与代码 Props 的映射表；
- React / Vue 使用示例；
- Storybook stories 或测试用例清单；
- 组件用途、禁用场景和无障碍注意事项。

例如设计侧 `State=Loading`、`Icon=Search` 可映射为代码侧 `loading`、`icon`，并把映射写入组件说明而非依赖口头约定。

### 7. 实例漂移与升级助手

对比实例当前覆盖、旧母版和最新团队库母版，AI 将差异分成：

- 应保留的业务覆盖；
- 可安全吸收的新母版更新；
- 已失效或冲突的属性；
- 建议逆向成新组件分支的定制实例。

这会把当前“实例逆向母版”升级成组件迁移工具，而不只是格式转换。

## 推荐交互

```text
选择 Frame / Instance
        ↓
本地提取结构摘要与差异
        ↓
AI 输出 ComponentBuildPlan（只读建议）
        ↓
用户预览、改名、勾选与确认
        ↓
确定性 API 执行 + 单步校验
        ↓
生成组件、文档和可撤销报告
```

推荐的计划结构：

```json
{
  "componentName": "Button",
  "mode": "COMPONENT_SET",
  "variantAxes": [
    { "name": "Size", "values": ["S", "M", "L"] },
    { "name": "State", "values": ["Default", "Hover", "Disabled"] }
  ],
  "properties": [
    { "nodePath": [0, 1], "name": "Label", "type": "TEXT" },
    { "nodePath": [0, 0], "name": "Leading Icon", "type": "INSTANCE_SWAP" }
  ],
  "warnings": [
    "2 个 Frame 的子层结构不同，需要确认图标槽位"
  ]
}
```

执行前必须校验节点路径、类型、主组件绑定和属性名唯一性。任何校验失败都回到预览，不让 AI 猜测或绕过组件语义。

## 技术落地建议

### 数据最小化

默认只向模型发送脱敏后的结构摘要：节点类型、层级、尺寸、名称、文本类别、样式/变量引用和差异特征。原始业务文案、图片、组件 ID、文件 ID 不应默认上传；需要视觉分析时单独征得用户同意。

### 两阶段执行

1. **AI 规划阶段**：仅返回 JSON 计划和解释。
2. **插件执行阶段**：使用白名单动作调用 `createComponent`、`combineAsVariants`、`addComponentProperty` 等 API，并在每一步后校验结果。

不要执行模型返回的任意 JavaScript，也不要让模型直接决定解绑、删除或替换实例。

### 模型失败降级

AI 未配置、超时或输出不合法时，保留当前手动组件构建器完整可用。AI 是规划增强层，不应成为基础构建能力的单点依赖。

## 分阶段路线

| 阶段 | 功能 | 目标 |
|---|---|---|
| P0（当前） | 手动逆向、三种构建模式、可选文字/实例属性 | 稳定的确定性执行底座 |
| P1 | AI 属性架构师 + 构建计划预览 | 降低属性设计门槛，避免错误建模 |
| P2 | 相似 Frame 聚类 + 组件健康度 | 从单次构建扩展到设计系统治理 |
| P3 | 缺失状态补全 + 设计—代码契约 | 连接设计、文档和研发交付 |
| P4 | 实例漂移/升级助手 | 支持长期组件库演进与迁移 |

P1 的验收重点应是“建议可解释、计划可编辑、执行可回退”，而不是单纯追求生成速度。
