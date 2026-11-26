# All in One · UI 视觉方向

这里归档两轮视觉方向提案和旧版插件截图。当前实现见[插件面板](../../docs/PLUGIN_PANEL.md)。

## 打开方式

直接双击以下 HTML，离线可看，无外部依赖：

- [index.html](index.html)：完整方案板，包含三个方向的浅色首页、深色首页、智能填充、尺寸助手与视觉参数。
- [compare.html](compare.html)：三个方向的浅色首页并排对比。
- [compare-dark.html](compare-dark.html)：三个方向的深色首页并排对比。
- [panels.html](panels.html)：三个方向的智能填充与尺寸助手并排对比。
- [direction-a.html](direction-a.html)：暗轨单独页。
- [direction-b.html](direction-b.html)：白瓷单独页。
- [direction-c.html](direction-c.html)：索引单独页。

第二轮，按“卡片 / 区块 / 轻拟物 + 胶囊当前项”重做：

- [round2.html](round2.html)：第二轮完整方案板。
- [compare-round2.html](compare-round2.html)：三版浅色首页并排对比。
- [compare-dark-round2.html](compare-dark-round2.html)：三版深色首页并排对比。
- [panels-round2.html](panels-round2.html)：三版智能填充与尺寸助手并排对比。
- [direction-d.html](direction-d.html)：卡片单独页。
- [direction-e.html](direction-e.html)：区块单独页。
- [direction-f.html](direction-f.html)：柔光（轻拟物）单独页。

## 目录

- `screens/`：上述页面在 440 × 600 实尺寸下渲染出的 PNG。
- `build.mjs`：生成器。修改方向数据、文案或样式后运行 `node archive/ui-explorations/build.mjs` 重新生成。

## 边界

- 保留 15 个入口、22 个工具、现有流程、宿主通信和快捷键。
- 默认窗口 440 × 600，精简 360 × 520，回归 340 × 440。
- 浅色与深色主题一起定义；控件状态不只靠颜色。
- 主信号色是方向建议值；实际实现由各皮肤 `--ui-accent` 控制，不依赖旧品牌紫。


## 旧版插件截图

默认「卡片」。六套皮肤：卡片（赤陶）、暗轨（电蓝）、白瓷（墨黑）、索引（朱红，全方角）、石墨（橄榄/柠檬，高对比）、暮色（珊瑚/深蓝，高对比）。原「区块」「柔光」因对比度不足已删除。

当时的版本有 15 个功能入口、22 个简易工具，覆盖超级选择、智能填充、组件清洗、图层命名、图层查重、尺寸助手、导出 PPT、语言切换、设计理论等。

- [skins-overview.png](screens/implemented/skins-overview.png) · [settings-overview.png](screens/implemented/settings-overview.png) · [skins-overview-dark.png](screens/implemented/skins-overview-dark.png)
- [home-cards.png](screens/implemented/home-cards.png) · [home-shade.png](screens/implemented/home-shade.png) · [home-dusk.png](screens/implemented/home-dusk.png)
- [settings-cards.png](screens/implemented/settings-cards.png) · [settings-shade.png](screens/implemented/settings-shade.png) · [settings-dusk.png](screens/implemented/settings-dusk.png)
- [select-cards.png](screens/implemented/select-cards.png) · [smartfill-cards.png](screens/implemented/smartfill-cards.png) · [refiner-cards.png](screens/implemented/refiner-cards.png)
- [layer-cards.png](screens/implemented/layer-cards.png) · [duplicate-cards.png](screens/implemented/duplicate-cards.png) · [size-cards.png](screens/implemented/size-cards.png)
- [ppt-cards.png](screens/implemented/ppt-cards.png) · [i18n-cards.png](screens/implemented/i18n-cards.png) · [theory-cards.png](screens/implemented/theory-cards.png)
- [about-cards.png](screens/implemented/about-cards.png)：设置底部的版本、QQ 群、网站与小红书。
- [skew-porcelain.png](screens/implemented/skew-porcelain.png)：白瓷下的等轴形变预览。
- [narrow-330-cards.png](screens/implemented/narrow-330-cards.png)：330px 窄窗只留图标。
- [fixes-overview.png](screens/implemented/fixes-overview.png)：本轮修复对照。

宣传物料（功能向）：

- [小红书 7 页预览](../marketing/xhs-carousel/index.html) · [发布文案](../marketing/xhs-carousel/post.md)
- [产品演示视频](../marketing/product-video/all-in-one-demo.mp4) · [视频封面](../marketing/product-video/poster-demo.png)
