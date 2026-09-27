# 尺寸助手预设维护说明

尺寸助手的设备库最近核对日期为 **2026-09-28**。设备的“原生分辨率”来自厂商规格页；“设计视口”是插件根据像素密度、常用设计宽度和实际工作流给出的推荐值，并非厂商声明的 CSS viewport。

## 官方规格来源

- [Apple iPhone 17 Pro 技术规格](https://support.apple.com/en-nz/125090)
- [Apple iPad Pro 13 英寸（M5）技术规格](https://support.apple.com/en-au/125407)
- [Samsung Galaxy S26 Ultra 技术规格](https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/specs/)
- [Google Pixel 10 Pro 技术规格](https://store.google.com/es/product/pixel_10_pro_specs?hl=es)
- [Xiaomi 17 Ultra 技术规格](https://www.mi.com/global/product/xiaomi-17-ultra/specs/)
- [HUAWEI Mate X7 技术规格](https://consumer.huawei.com/cn/phones/mate-x7/specs/)
- [Microsoft Surface Pro 技术规格](https://www.microsoft.com/en-us/surface/devices/surface-pro-11th-edition?activetab=pivot%3Atechspecstab)

## 使用原则

- UI 设计优先选择“设计视口”，展示稿、视频画布和物理像素核对使用“原生分辨率”。
- 设备规格会随新品发布变化；新增或替换预设时，应先核对厂商官网，再同步修改 Figma 与 MasterGo 的 `SIZE_ASSISTANT_PRESETS`。
- 比例预设只用于构图和快速换算，不能替代真实设备、安全区、系统栏与响应式断点测试。
