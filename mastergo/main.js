// shared-host-locale:start
/* UI-owned terminology and messages shared by both hosts. Values and document
   content are never passed through this catalogue by the UI binding layer. */
(() => {
  const phrases = [
    ['请先选择查找范围的起点图层','Select the starting layers for this search scope.'],
    ['未找到符合条件的图层，请调整范围或筛选条件','No layers matched. Adjust the scope or filters.'],
    ['全页','Whole page'], ['选中图层','Selected layers'], ['当前页面','Current page'],
    ['查找配置','Find settings'], ['查找内容','Find text'], ['替换为','Replace with'],
    ['还原','Restore'], ['重置','Reset'], ['开始查找','Find'], ['返回','Back'],
    ['返回列表','Back to library'], ['清空','Clear'], ['删除','Delete'], ['编辑','Edit'],
    ['保存','Save'], ['关闭','Close'], ['设置','Settings'], ['导入 JSON','Import JSON'],
    ['导出 JSON','Export JSON'], ['清空列表','Clear all lists'], ['测试连接','Test connection'],
    ['取消','Cancel'], ['确定','Confirm'], ['无','None'], ['默认','Default'],
    ['自动识别','Auto-detect'], ['中文','Chinese'], ['简体中文','Chinese (Simplified)'],
    ['繁体中文','Chinese (Traditional)'], ['日本語','Japanese'], ['한국어','Korean'],
    ['Français','French'], ['Deutsch','German'], ['Español','Spanish'], ['Italiano','Italian'],
    ['Português','Portuguese'], ['Русский','Russian'], ['العربية','Arabic'],
    ['浅色','Light'], ['深色','Dark'], ['跟随系统','Follow system'],
    ['GLM (免费使用 4.7flash,比较慢)','GLM (free built-in access; slower responses)'],
    ['Anthropic (原生或第三方)','Anthropic (direct or third-party API)'],
    ['通常以 /v1 结尾。如果使用中转或代理，请填写代理地址。','Usually ends in /v1. For a proxy, enter its API base URL.'],
    ['GLM 用户留空即可享受内置免费通道','For GLM, leave this blank to use the built-in free connection.'],
    ['源语言','Source language'], ['直接替换不会创建变量或 Mode。','Direct replacement does not create variables or modes.'],
    ['语言切换','Language variants'], ['语言组件集','Language component set'],
    ['选择多个不同语言的 Frame，选择「语言切换」后构建，自动生成 Language 变体属性。','Select frames in different languages and choose Language variants to create a component set with a Language variant property.'],
    ['建议命名为「Button/zh-CN」、「Button/en-US」，也支持中文、English、日本語等常见语言别名。未识别时会保留 Frame 名作为语言值。','Use names such as Button/zh-CN or Button/en-US. Common language aliases are also supported; unrecognized names are kept as the language value.'],
    ['选择文本或画板，点击字段填充','Select text or frames, then click a field to fill.'],
    ['请先选择可见文本或包含文本的画板','Select visible text or frames containing text first.'],
    ['正在填充…','Filling…'], ['正在录入…','Filling…'], ['请先生成内容','Generate content first.'],
    ['请先输入至少一条录入内容','Enter at least one item to fill.'],
    ['请选择前缀或后缀，并输入要添加的字符','Choose prefix or suffix and enter the characters to add.'],
    ['生成方式','Generation method'], ['随机生成','Random'], ['按序填写','Sequence'],
    ['数列类型','Sequence type'], ['等差数列','Arithmetic progression'],
    ['等比数列','Geometric progression'], ['斐波那契数列','Fibonacci sequence'],
    ['自然数','Natural numbers'], ['奇数数列','Odd numbers'], ['偶数数列','Even numbers'],
    ['质数数列','Prime numbers'], ['平方数列','Square numbers'], ['三角数列','Triangular numbers'],
    ['阶乘数列','Factorials'], ['起始值','Start value'], ['第二项','Second term'],
    ['公差','Common difference'], ['公比','Common ratio'], ['起始时间','Start time'],
    ['递增步长（秒）','Step (seconds)'],
    ['例如 900 秒表示每个图层递增 15 分钟，超过 24 小时后循环。','A 900-second step adds 15 minutes for each layer. Values wrap after 24 hours.'],
    ['步长（秒）','Step (seconds)'], ['步长 (秒)','Step (seconds)'],
    ['斐波那契使用起始值和第二项；等差使用公差；等比使用公比。','Fibonacci uses the start value and second term; arithmetic progressions use a difference, and geometric progressions use a ratio.'],
    ['2023年10月1日','Chinese date'],
    ['请输入标题...','Enter a title…'], ['请输入预设名称...','Enter a preset name…'],
    ['图层 Layer','Layer'], ['图层名称 (Name)','Layer name'], ['图层透明度 (Opacity)','Layer opacity'],
    ['可见性 (Visible)','Visibility'], ['是否锁定 (Locked)','Locked'], ['旋转 (Rotation)','Rotation'],
    ['图层叠加模式','Layer blend mode'], ['元素在父图层中的顺序','Sibling index'],
    ['元素在父图层中的倒序','Reverse sibling index'], ['子元素数量','Child count'],
    ['是否展开','Expanded'], ['多边形边数','Polygon sides'], ['位置与尺寸 Bounds','Position and size'],
    ['宽度 (Width)','Width'], ['高度 (Height)','Height'], ['X 坐标','X position'], ['Y 坐标','Y position'],
    ['绝对宽度','Absolute width'], ['绝对高度','Absolute height'], ['绝对 X','Absolute X'], ['绝对 Y','Absolute Y'],
    ['填充 Fills','Fills'], ['填充数量','Fill count'], ['填充色','Fill color'], ['填充透明度','Fill opacity'],
    ['填充叠加模式','Fill blend mode'], ['填充类型','Fill type'], ['填充可见','Fill visibility'],
    ['填充样式 ID','Fill style ID'], ['圆角 Radius','Corner radius'], ['全部圆角','All corners'],
    ['左上圆角','Top-left corner'], ['右上圆角','Top-right corner'], ['左下圆角','Bottom-left corner'],
    ['右下圆角','Bottom-right corner'], ['转角平滑','Corner smoothing'],
    ['描边 Strokes','Strokes'], ['描边数量','Stroke count'], ['描边颜色','Stroke color'],
    ['描边粗细','Stroke weight'], ['描边透明度','Stroke opacity'], ['描边叠加模式','Stroke blend mode'],
    ['描边种类','Stroke type'], ['描边可见','Stroke visibility'], ['描边对齐','Stroke alignment'],
    ['描边端点','Stroke cap'], ['描边转角','Stroke join'], ['描边斜接限制','Stroke miter limit'],
    ['描边样式 ID','Stroke style ID'], ['效果 Effects','Effects'], ['效果数量','Effect count'],
    ['效果类型','Effect type'], ['效果可见','Effect visibility'], ['效果样式 ID','Effect style ID'],
    ['图层定位','Layout positioning'], ['分布方向','Layout direction'], ['主轴对齐','Primary-axis alignment'],
    ['交叉轴对齐','Cross-axis alignment'], ['子元素间距','Item spacing'], ['上边距','Top padding'],
    ['下边距','Bottom padding'], ['左边距','Left padding'], ['右边距','Right padding'],
    ['图层网格数量','Layout grid count'], ['网格样式 ID','Grid style ID'], ['文本 Text','Text'],
    ['文本内容','Text content'], ['字体','Font family'], ['字重 / 样式','Font weight / style'], ['字号','Font size'],
    ['是否有链接','Has hyperlink'], ['水平对齐','Horizontal alignment'], ['垂直对齐','Vertical alignment'],
    ['字体修饰','Text decoration'], ['字间距','Letter spacing'], ['字间距单位','Letter-spacing unit'],
    ['行高','Line height'], ['行高单位','Line-height unit'], ['丢失字体','Missing fonts'],
    ['段落缩进','Paragraph indent'], ['段落间距','Paragraph spacing'], ['文字样式 ID','Text style ID'],
    ['组件 Component','Component'], ['组件描述','Component description'], ['相同母组件 ID','Main component ID'],
    ['组件属性数量','Component property count'], ['变体属性数量','Variant property count'],
    ['原型 Prototype','Prototype'], ['交互动作数量','Interaction count'],
    ['滚动溢出方向','Overflow scrolling'], ['固定子元素数量','Fixed child count'],
    ['含','Contains'], ['开头是','Starts with'], ['结尾是','Ends with'],
    ['目标尺寸','Target dimensions'], ['宽度 W','Width W'], ['高度 H','Height H'],
    ['比例计算基准','Aspect-ratio anchor'], ['取整方式','Rounding'], ['保持宽度','Keep width'],
    ['保持高度','Keep height'], ['四舍五入','Nearest integer'], ['向上取整','Round up'],
    ['向下取整','Round down'], ['保留小数','Keep decimals'], ['锁定宽高比','Lock aspect ratio'],
    ['保持中心位置','Keep center position'], ['手机','Phones'], ['平板 / 折叠','Tablets / foldables'],
    ['桌面屏幕','Desktop screens'], ['穿戴设备','Wearables'], ['经典比例','Aspect ratios'],
    ['设计视口','Design viewport'], ['原生分辨率','Native resolution'],
    ['物理分辨率','Native resolution'], ['请先选择 Frame 或矩形','Select frames or rectangles first.'],
    ['批量设定所选尺寸','Resize selected layers'], ['正在设定...','Resizing…'],
    ['没有匹配的尺寸预设','No matching size presets.'], ['搜索品牌、设备或比例','Search brands, devices or ratios'],
    ['搜索品牌、设备或比例...','Search brands, devices or ratios…'],
    ['自定义尺寸；勾选锁定宽高比可联动调整。','Custom dimensions. Lock the aspect ratio to resize proportionally.'],
    ['6.3 英寸。460 ppi，三倍像素密度设计视口。','6.3 inches, 460 ppi. Design viewport at 3× pixel density.'],
    ['6.9 英寸 QHD+，适合大屏 Android 界面检查。','6.9-inch QHD+ screen for checking large-screen Android interfaces.'],
    ['6.3 英寸，20:9，使用 Material 布局时可同时验证 360dp。','6.3 inches, 20:9. Also check 360dp when using Material layouts.'],
    ['6.9 英寸，接近 20:9，适合安卓旗舰大屏。','6.9 inches, approximately 20:9, for large Android phone layouts.'],
    ['HUAWEI · Mate X7 外屏','HUAWEI · Mate X7 cover screen'], ['Mate X7 外屏','Mate X7 cover screen'],
    ['6.49 英寸外屏，建议关注窄宽下的文字换行。','6.49-inch cover screen. Check text wrapping at narrow widths.'],
    ['紧凑视口','Compact viewport'], ['主流视口','Standard viewport'],
    ['通用 360dp 基准，用于发现窄屏布局问题。','A 360dp baseline for checking narrow-screen layouts.'],
    ['跨 iOS 与 Android 的常用原型尺寸。','A commonly used prototype size for iOS and Android.'],
    ['桌面设计基准','Desktop design baseline'], ['圆形手表 44mm','Round watch, 44mm'],
    ['常用网页设计宽度，建议主内容再设置最大宽度。','A common web design width. Set a maximum width for the main content.'],
    ['16:9 主流显示器与视频画布。','16:9 display and video canvas.'],
    ['16:9 高分辨率桌面，注意内容不应无限拉宽。','High-resolution 16:9 desktop canvas. Limit the width of text and content.'],
    ['16:9，适合大屏展示和高清导出校验。','16:9 canvas for large displays and high-resolution export checks.'],
    ['21:9 超宽屏，适合时间线、仪表盘和多窗口工作台。','21:9 ultrawide canvas for timelines, dashboards and multi-window workspaces.'],
    ['信息应在短时间内完成读取，避免长文本和密集操作。','Make information quick to read. Avoid long text and dense controls.'],
    ['1:1 画布仅代表外接矩形，关键内容需留在中心安全区。','The 1:1 canvas is the bounding square. Keep key content within the central safe area.'],
    ['1:1 正方形','1:1 Square'], ['4:3 经典画幅','4:3 Classic'], ['3:2 摄影 / 生产力','3:2 Photography / productivity'],
    ['16:10 效率屏','16:10 Productivity'], ['16:9 宽屏','16:9 Widescreen'], ['2:1 超宽','2:1 Wide'],
    ['21:9 电影宽屏','21:9 Cinematic'], ['√2 纸张比例','√2 Paper ratio'], ['√3 几何比例','√3 Geometric ratio'],
    ['φ 黄金比例','φ Golden ratio'], ['1+√2 白银比例','1+√2 Silver ratio'],
    ['头像、图标、商品缩略图与方形社交内容。','Avatars, icons, product thumbnails and square social content.'],
    ['平板、演示和传统摄影常用比例。','A common ratio for tablets, presentations and traditional photography.'],
    ['相机画幅与 Surface 类生产力屏幕。','Camera frames and productivity displays such as Surface devices.'],
    ['笔记本与创作工作台，比 16:9 提供更多垂直空间。','Laptops and creative workspaces, with more vertical room than 16:9.'],
    ['视频、演示、电视与主流显示器。','Video, presentations, television and standard displays.'],
    ['现代手机、横幅 Banner 与全景构图。','Modern phones, banners and panoramic compositions.'],
    ['电影感视频、超宽屏与沉浸式展示。','Cinematic video, ultrawide screens and immersive presentations.'],
    ['A 系列纸张比例，对半裁切后仍保持相同比例。','The A-series paper ratio. Halving the sheet preserves its aspect ratio.'],
    ['适合三角网格、展示画幅与几何构图实验。','For triangular grids, presentation formats and geometric composition studies.'],
    ['约 1:1.618，可用于构图分区，不应取代实际内容验证。','Approximately 1:1.618. Useful for composition studies; validate with real content.'],
    ['约 1:2.414，适合细长编排、建筑感版面与展示实验。','Approximately 1:2.414, for elongated layouts, architectural compositions and presentation studies.'],
    ['AI 设计理论助手','Design Theory Assistant'], ['输入设计问题或理论关键词...','Ask a design question or enter a principle…'],
    ['继续提问...','Ask a follow-up question…'], ['发送','Send'], ['暂无详细拆解','No detailed explanation available.'],
    ['核心释义','Key idea'], ['应用案例','In practice'], ['理论价值','Why it matters'],
    ['交互与可用性','Interaction & usability'], ['心理学','Psychology'], ['视觉感知','Visual perception'],
    ['商业策略','Product strategy'], ['系统思维','Systems thinking'],
    ['暂无设计理论数据','No design principles available.'],
    ['请填写标题和内容','Enter a title and content.'], ['确定删除这个列表吗？','Delete this list?'],
    ['列表已经是空的了','The list is already empty.'], ['没有数据可导出','There is no data to export.'],
    ['⚠️ 确定要清空所有自定义列表吗？此操作不可恢复！','Clear all custom lists? This cannot be undone.'],
    ['确定要重新开始吗？','Restart the export workflow?'], ['没有数据','No data available.'],
    ['配置已保存','Settings saved.'], ['请选择形状','Select shapes first.'], ['请选择图层','Select layers first.'],
    ['请先选中图层','Select layers first.'], ['字体加载失败','Could not load the font.'],
    ['请选2个以上文本','Select at least two text layers.'], ['已重命名','Layers renamed.'],
    ['未找到可解绑的实例','No detachable instances found.'], ['已交换填充/描边','Fill and stroke swapped.'],
    ['已添加自动布局外套','Auto Layout frames added.'], ['已转换为 Frame','Converted to frames.'],
    ['请至少选择两个同级图层','Select at least two sibling layers.'],
    ['请选择至少两个同级图层，或选择一个包含多个子图层的容器','Select at least two sibling layers or a container with multiple children.'],
    ['已反转排列（从下到上）','Layer order reversed, bottom to top.'], ['已排列（从上到下）','Layers sorted, top to bottom.'],
    ['已按名称倒序排列（Z→A）','Layers sorted by name, Z to A.'], ['已按名称排序（A→Z）','Layers sorted by name, A to Z.'],
    ['组件集为空','The component set is empty.'], ['✅ 说明书生成完毕！','Component documentation generated.'],
    ['英文','English'], ['请严格选择 2 个图层进行交换','Select exactly two layers to swap.'],
    ['位置已互换','Layer positions swapped.'], ['请先选择范围','Select a scope first.'],
    ['未发现可创建的样式（选中的图层可能没有填充/文本/效果属性）','No styles can be created from the selection’s fills, text or effects.'],
    ['匹配出错','Style matching failed.'], ['未发现可匹配的样式','No matching styles found.'],
    ['请先选择一个图层以获取名称','Select a layer to read its name.'],
    ['⚠️ 请先选择一个容器(Frame/Group)','Select a frame or group first.'],
    ['⚠️ 请先选择一个图层','Select a layer first.'],
    ['⚠️ 未找到图层，请检查 Console的筛选池大小','No layers found. Check the search scope and filters.'],
    ['请在画布上选中恰好两个画板/容器','Select exactly two frames or containers on the canvas.'],
    ['请输入查找内容，注意区分大小写','Enter text to find. Matching is case-sensitive.'],
    ['范围内没有文本','There is no text in this scope.'], ['未找到匹配内容','No matching content found.'],
    ["⚠️ 请先将 Page 重命名为 'xxx 副本' 以确保安全！",'Duplicate the page and include “copy” in its name before exporting.'],
    ['请至少选择一个 Frame 画板','Select at least one frame.'],
    ['请先选择图层','Select layers first.'], ['未找到匹配文本','No matching text found.'],
    ['已还原颜色','Original colors restored.'], ['已标记 (再次点击可还原)','Highlighted. Click again to restore the original color.'],
    ['图层不存在 (可能已被删除)','The layer no longer exists; it may have been deleted.'],
    ['最多只能保存 5 个锚点！','You can save up to five viewport bookmarks.'],
    ['📍 位置已保存','Viewport bookmark saved.'],
    ['⚠️ 该位置所在的页面已被删除！','The page containing this bookmark has been deleted.'],
    ['🚀 已传送！','Returned to the saved viewport.'],
    ['传送失败，可能是图层结构已发生巨大改变','Could not restore the viewport. The layer structure may have changed.'],
    ['🗑️ 锚点已删除','Viewport bookmark deleted.'],
    ['连接超时(60秒)','Connection timed out after 60 seconds.'],
    ['连接失败','Connection failed.'], ['连接失败：API 返回格式异常','Connection failed: the API returned an unexpected response.'],
    ['连接超时，请检查网络或 Base URL','Connection timed out. Check the network and API base URL.'],
    ['内置通道暂时不可用，请稍后重试或填写自己的 API Key','The built-in connection is unavailable. Try again later or enter your own API key.'],
    ['网络错误，请检查 Base URL 是否正确','Network error. Check the API base URL.'],
    ['测试中...','Testing…'], ['正在测试...','Testing…'],
    ['执行出错，请重试。','The operation failed. Please try again.'],
    ['⚠️ 确定要全自动执行吗？\n请确保当前是【副本】页面，且已选中要导出的画板。','Run all export steps automatically? Make sure you are on a copied page and have selected the frames to export.'],
    ['PPT 生成失败，请重试','PPT generation failed. Please try again.'],
    ['资源包数据为空，请重新运行导出流程。','The asset package is empty. Run the export workflow again.'],
    ['请输入要查找的内容','Enter text to find.'],
    ['请至少选择一个搜索目标 (Prop Name 或 Prop Value)','Select at least one search target: property name or property value.'],
    ['请至少选择一项','Select at least one item.'],
    ['文件格式错误：必须是数组','Invalid file format: expected an array.'],
    ['数据结构不符','The data does not have the expected structure.'],
    ['导入成功！','Imported successfully.'], ['请输入提示词','Enter a prompt.'],
    ['请先配置 API Key','Set up an API key first.'],
    ['请先配置 API 接口地址','Set up the API base URL first.'],
    ['未能获取到生成的文本内容','No generated text was returned.'],
    ['内容为空，无法保存','There is no content to save.'],
    ['没有已有的列表可追加，请先新建。','Create a list before appending content.'],
    ['请输入标题','Enter a title.'], ['已保存为新列表','Saved as a new list.'],
    ['目标列表无效','The selected list is not available.'],
    ['未选中任何画板或节点，请先在画布上框选目标','Select the target frames or layers on the canvas first.'],
    ['AI响应超时','AI response timed out.'],
    ['AI 未返回可用的组件修改方案','The AI did not return a usable component update plan.'],
    ['AI 请求失败','AI request failed.'],
    ['AI 返回内容不是有效 JSON','The AI response is not valid JSON.'],
    ['请先在设置面板配置 AI Key','Set up an AI key in Settings first.'],
    ['用户强制中断','Cancelled by the user.'],
    ['模型未返回有效数据','The model did not return valid data.'],
    ['尚未扫描，请先点击【扫描】提取文本。','Click Scan to collect the text before translating.'],
    ['✅ 当前范围内没有「未绑定」的文本需要处理。\n\n所有文本均已绑定变量。\n\n如需重新翻译，请将「目标文本」切换为【画板全部文本】后再扫描。','All text in this scope is already bound to variables. To translate it again, choose All Text on Frames and scan again.'],
    ['✅ 当前范围内没有需要处理的文本。','There is no text to process in the current scope.'],
    ['本地合集尚未包含任何语言Mode，请先选择「创建Mode」','The local collection has no language modes. Choose Create Mode first.'],
    ['保存为新列表','Save as a new list'],
    ['AI 分析中 0/0','AI analysis: 0/0'], ['已勾选 0 个','0 items selected'],
    ['查找结果','Search results'], ['共 0 项','0 items'], ['全选未替换项','Select all unreplaced items'],
    ['太棒了！未发现需要修复的组件命名','All clear. No component naming issues found.'],
    ['全部修复完成','All issues fixed'], ['命名已更新，界面更加整洁了。','Names have been updated.'],
    ['返回继续检查','Back to review'], ['点击展开配置','Expand settings'],
    ['章节导航','Jump to a section'], ['跳转到章节','Jump to a section'],
    ['免费内置通道','Built-in free connection'],
    ['：当前使用 GLM-4.7-Flash（免费模型），已锁定不可更改。',': The built-in connection uses GLM-4.7-Flash; its model cannot be changed.'],
    ['如需使用其他模型，请填写自己的 API Key。','Enter your own API key to use another model.'],
    ['尺寸助手','Size Assistant'],
    ['为所选 Frame 或矩形批量设定屏幕尺寸。设计视口适合界面设计，原生分辨率适合展示和物理像素对照。设备库更新于 2026-09。','Resize selected frames or rectangles. Use design viewports for interface layouts and native resolution for pixel-level comparisons. Device presets were updated in September 2026.'],
    ['建议：移动端界面优先使用设计视口，同时在多个代表性宽度下检查响应式布局。','For mobile interfaces, start with the design viewport and check responsive layouts at several representative widths.'],
    ['X 轴 (列)','X axis (columns)'], ['Y 轴 (行)','Y axis (rows)'], ['- 可选','— optional'],
    ['无（单维度排列）','None (one-dimensional layout)'], ['快捷设置','Quick settings'],
    ['区块间距','Section spacing'], ['组件集布局','Component set layout'], ['网格线','Grid lines'],
    ['画板样式','Frame style'], ['显示选项','Display options'], ['虚线网格','Dashed grid'],
    ['轴标签','Axis labels'], ['属性面板','Property summary'], ['使用指南','Usage guide'],
    ['组件集内边距','Component set padding'], ['组件集之间间距','Spacing between component sets'],
    ['显示虚线网格','Show dashed grid'], ['发生错误','An error occurred'],
    ['切换精简模式','Toggle compact mode'], ['导入','Import'], ['刷新','Refresh'],
    ['输入查找对象的名称...','Enter a layer name to find…'], ['清空输入','Clear input'],
    ['拾取选中图层名称','Use the selected layer’s name'], ['区分大小写','Match case'],
    ['查找选中元素内部的所有图层','Search all layers inside the selection'],
    ['查找与选中元素同级的所有图层','Search layers sharing the selection’s parent'],
    ['查找选中元素的直接子级图层','Search the selection’s direct children'],
    ['查找选中元素的所有子孙图层','Search all descendants of the selection'],
    ['查找当前 Page 下的所有图层','Search all layers on the current page'],
    ['按连字符切词段，词段完全相同才算命中','Split names at hyphens and match identical segments'],
    ['名称包含对方连续片段即命中，更宽松','Match a contiguous part of the other name; a broader comparison'],
    ['左侧画板','Left frame'], ['右侧画板','Right frame'], ['还原所有标红','Restore all highlighted layers'],
    ['重置所有设置','Reset all settings'], ['输入查找关键词...','Enter text to find…'],
    ["在名称前自动添加 '.'","Add a dot prefix to the name"], ["移除名称开头的 '.' 或 '_'","Remove a leading dot or underscore"],
    ['请先完成扫描','Complete the scan first.'], ['关闭可加快速度。','Turn this off for faster responses.'],
    ['生成结果将显示在这里...','Generated content will appear here…'], ['保存为新的列表','Save as a new list'],
    ['追加到已有列表','Append to an existing list'], ['热门推荐 (推荐)','Popular providers'],
    ['国内其他优秀平台','Other providers in China'], ['国际平台与聚合','International providers and aggregators'],
    ['横竖切换','Swap width and height'], ['输入设计者名称','Enter the designer’s name'],
    ['如：首页、详情页','For example: Home, Details'],
    ['13 英寸，4:3。分栏布局和横竖屏都应检查。','13 inches, 4:3. Check split layouts and both orientations.'],
    ['3:2 触控屏，适合生产力界面和纵向阅读。','3:2 touchscreen for productivity interfaces and portrait reading.'],
    ['3:2，横屏工作台可优先检查 1440 设计宽度。','3:2 screen. Check a design width of 1440 for landscape workspaces.'],
    ['Mate X7 内屏','Mate X7 inner screen'],
    ['8 英寸近方形折叠屏，需避免只沿用手机单栏。','8-inch, nearly square foldable screen. Check layouts beyond a single phone column.'],
    ['通用平板视口','Standard tablet viewport'],
    ['经典 3:4 平板基准，适合响应式断点验证。','A classic 3:4 tablet baseline for testing responsive breakpoints.'],
    ['填充列表为空','The fill list is empty.'],
    ['未找到可填充的可见文本','No visible text layers can be filled.'],
    ['请先选择一个或多个 Frame / 矩形','Select one or more frames or rectangles.'],
    ['请只选择一个实例（Instance）后再逆向母版','Select exactly one instance to rebuild its main component.'],
    ['实例逆向正在处理中，请等待当前操作完成','A component rebuild is in progress. Wait for it to finish.'],
    ['请选择一个或多个 Frame；当前选择中不能混入其他图层类型','Select one or more frames without other layer types.'],
    ['组件集模式至少需要两个 Frame','Component set mode requires at least two frames.'],
    ['语言组件集模式至少需要两个 Frame','Language component set mode requires at least two frames.'],
    ['请选中一个 Component Set (组件集)！','Select one component set.'],
    ['请选中至少一个 Component Set！','Select at least one component set.'],
    ['请选中一个 Component Set 或已生成的说明书画板！','Select a component set or a generated documentation frame.']
  ];
  const exact = new Map(phrases);
  const rules = [
    [/^前 5 项：/, 'First 5: '], [/^已填充 (\d+) 个文本$/, 'Filled $1 text layers.'],
    [/^已填充 (\d+) 个文本[，,]失败 (\d+) 个$/, 'Filled $1 text layers; $2 failed.'],
    [/^移除 (\d+) 个自动布局$/, 'Removed Auto Layout from $1 layers.'],
    [/^已解绑 (\d+) 个组件$/, 'Detached $1 instances.'],
    [/^已删除 (\d+) 个隐藏图层$/, 'Deleted $1 hidden layers.'],
    [/^已解散 (\d+) 个组$/, 'Ungrouped $1 groups.'],
    [/^已解锁 (\d+) 个图层$/, 'Unlocked $1 layers.'],
    [/^已对齐 (\d+) 个图层$/, 'Aligned $1 layers to pixels.'],
    [/^已定位 (\d+) 项$/, 'Located $1 items.'],
    [/^已选中 (\d+) 个图层$/, 'Selected $1 layers.'],
    [/^已替换 (\d+) 处文本$/, 'Replaced $1 text matches.'],
    [/^已成功修复 (\d+) 项命名$/, 'Fixed $1 naming issues.'],
    [/^已还原 (\d+) 处高亮$/, 'Restored $1 highlighted items.'],
    [/^AI 分析中 (\d+)\/(\d+)$/, 'AI analysis: $1/$2'],
    [/^已勾选 (\d+) 个$/, '$1 items selected'], [/^共 (\d+) 项$/, '$1 items'],
    [/^匹配成功: 填充(\d+) \/ 描边(\d+) \/ 文本(\d+) \/ 效果(\d+)$/, 'Styles matched: $1 fills / $2 strokes / $3 text / $4 effects.'],
    [/^✅ 批量排布完成！共 (\d+) 个组件集$/, 'Arranged $1 component sets.'],
    [/^生成填充内容失败：/, 'Could not prepare fill content: '],
    [/^AI调用失败[:：]\s*/, 'AI request failed: '],
    [/^AI 调用失败[:：]\s*/, 'AI request failed: '],
    [/^AI 请求失败[:：]\s*/, 'AI request failed: '],
    [/^连接失败[:：]\s*/, 'Connection failed: '],
    [/^连接成功！模型 (.+) 通过(内置通道|API)响应正常$/, (match,model,connection) => 'Connected. Model ' + model + ' responded through the ' + (connection === 'API' ? 'API.' : 'built-in connection.')],
    [/^生成失败[:：]\s*/, 'Generation failed: '],
    [/^导入失败[:：]\s*/, 'Import failed: '],
    [/^应用失败[:：]\s*/, 'Could not apply changes: '], [/^逆向失败[:：]\s*/, 'Component rebuild failed: '],
    [/^创建失败[:：]\s*/, 'Creation failed: '],
    [/^已将 (\d+) 个图层设为 ([\d.]+) × ([\d.]+)(?:，(\d+) 个图层调整失败)?$/, (match, count, width, height, failed) => 'Resized ' + count + ' layers to ' + width + ' × ' + height + (failed ? '; ' + failed + ' failed.' : '.')],
    [/^已填充 (\d+) 个文本，(\d+) 项失败：(.*)$/s, 'Filled $1 text layers; $2 failed: $3'],
    [/^多语言 Mode 已同步更新！$/, 'Language modes updated.'],
    [/^成功替换了 (\d+) 个文本节点！$/, 'Replaced $1 text layers.'],
    [/^已逆向组件母版/, 'Main component rebuilt'],
    [/（视觉快照兜底）/, ' (visual snapshot fallback)'],
    [/，完整还原 (\d+) 个真实变体/, '; restored all $1 actual variants'],
    [/，原组件集 (\d+) 个变体超过上限 (\d+)，已保留当前真实变体/, '; the source has $1 variants, exceeding the $2 limit; kept the current actual variant'],
    [/，并保留 (\d+) 个有效属性/, '; preserved $1 valid properties'],
    [/；(\d+) 项内容已安全降级或跳过/, '; $1 items used a safe fallback or were skipped'],
    [/^已创建(语言组件集|组件集|单个组件|多个组件)/, (match, type) => ({ '语言组件集':'Created a language component set', '组件集':'Created a component set', '单个组件':'Created one component', '多个组件':'Created separate components' })[type]],
    [/，并生成文字属性、实例属性/, '; exposed text and instance swap properties'],
    [/，并生成文字属性/, '; exposed text properties'],
    [/，并生成实例属性/, '; exposed instance swap properties'],
    [/；(\d+) 项已跳过/, '; $1 items skipped'],
    [/^有 (\d+) 个 Frame 连接了原型连线；为避免连接目标丢失，本次未转换$/, '$1 frames have prototype connections. They were not converted to preserve connection targets.'],
    [/^已应用 (\d+) 项组件规范优化(?:；(\d+) 项未能修改)?$/, (match, done, failed) => 'Applied ' + done + ' component updates' + (failed ? '; ' + failed + ' could not be changed.' : '.')],
    [/^无法创建 "([^"]+)" 语言模式。当前合集可能已达到模式数量限制。可改用「直接替换」，或检查当前方案支持的模式数量。$/, 'Could not create the "$1" language mode. The collection may have reached its mode limit. Use Direct Replace or check the mode capacity supported by your plan.'],
    [/^请求失败[:：]\s*/, 'Request failed: '], [/^错误[:：]\s*/, 'Error: '],
    [/^已找到 (\d+) 个图层$/, 'Found $1 layers.'],
    [/^已选择 (\d+) 个图层$/, 'Selected $1 layers.'],
    [/^已就绪：/, 'Ready: '], [/^(\d+) 个 Frame$/, '$1 frames'],
    [/^(\d+) 个组件$/, '$1 components'], [/^(\d+) 个画板$/, '$1 frames']
  ];
  function translate(value, language) {
    if (value === null || value === undefined) return '';
    const text = String(value);
    if (language !== 'en') return text;
    const source = text.trim();
    let result = exact.get(source);
    if (result === undefined) {
      result = source;
      for (const [pattern, replacement] of rules) if (pattern.test(result)) result = result.replace(pattern, replacement);
      if (result === source) {
        const plain = source.replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, '');
        let localized = exact.get(plain) ?? plain;
        for (const [pattern, replacement] of rules) if (pattern.test(localized)) localized = localized.replace(pattern, replacement);
        if (localized !== plain) result = source.slice(0, source.length - plain.length) + localized;
      }
    }
    return text.slice(0, text.indexOf(source)) + result + text.slice(text.indexOf(source) + source.length);
  }
  function addPairs(pairs) {
    for (const [zh, en] of pairs) if (typeof zh === 'string' && typeof en === 'string' && !exact.has(zh.trim())) exact.set(zh.trim(), en.trim());
  }
  globalThis.PluginLocale = Object.freeze({ translate, addPairs });
})();

/* Prepended to the compiled host script; source algorithms call this adapter. */
let pluginUiLanguage = 'zh';
function notifyInUiLanguage(message, options) {
  return mg.notify(PluginLocale.translate(message, pluginUiLanguage), options);
}

/* Window geometry is in canvas-viewport pixels. Platform adapters perform the
   coordinate conversion; moving the plugin never moves the document viewport. */
function createPluginWindowController(adapter) {
  let collapsed = false;
  let fullSize = { width:440, height:600 };
  let size = { ...fullSize };
  let drag = null;
  let edge = 'right';
  const bubble = { width:70, height:48 };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(Math.max(lo, hi), n));
  const dimensions = msg => ({
    width:clamp(Number(msg.width) || fullSize.width, 170, 1600),
    height:clamp(Number(msg.height) || fullSize.height, 400, 1600)
  });
  function metrics() {
    const m = adapter.metrics();
    if (![m.x,m.y,m.width,m.height,m.header].every(Number.isFinite) || m.width <= 0 || m.height <= 0) throw new Error('Window geometry unavailable');
    return m;
  }
  function keepVisible(x, y, m) {
    return { x:clamp(x, 8, m.width - size.width - 8), y:clamp(y, 8, m.height - size.height - m.header - 8) };
  }
  function position(x, y, m) {
    const next = keepVisible(x, y, m);
    adapter.move(next.x, next.y);
    return next;
  }
  function snap(m, y) {
    position(edge === 'left' ? 8 : m.width - size.width - 8, y, m);
  }
  function state(error = false) {
    adapter.send({ type:'window-state', collapsed, edge, canMove:adapter.canMove(), error });
  }
  function collapse(msg) {
    if (collapsed) return;
    fullSize = dimensions(msg);
    let m;
    try { m = metrics(); } catch (_) { /* Old hosts still support compact resize. */ }
    if (m) edge = m.x + size.width / 2 < m.width / 2 ? 'left' : 'right';
    adapter.resize(bubble.width, bubble.height);
    size = { ...bubble };
    collapsed = true;
    if (m && adapter.canMove()) snap(m, m.y);
    state();
  }
  function expand() {
    if (!collapsed) return;
    let m;
    try { m = metrics(); } catch (_) {}
    adapter.resize(fullSize.width, fullSize.height);
    size = { ...fullSize };
    collapsed = false;
    if (m && adapter.canMove()) snap(m, m.y);
    state();
  }
  function handle(msg) {
    if (msg.type === 'resize-window' || msg.type === 'resize-drag') {
      if (collapsed) return true; // Never replace the saved dimensions with bubble dimensions.
      const next=dimensions(msg);
      if(next.width===size.width&&next.height===size.height)return true;
      size = next;msg.width=next.width;msg.height=next.height;
      fullSize = { ...size };
      return false; // Keep existing resize/cache behavior.
    }
    if (!['window-init','window-collapse','window-expand','window-drag-start','window-drag-move','window-drag-end','window-drag-cancel','window-nudge'].includes(msg.type)) return false;
    try {
      if (msg.type === 'window-init') state();
      if (msg.type === 'window-collapse') collapse(msg);
      if (msg.type === 'window-expand') expand();
      if (msg.type === 'window-drag-start') {
        if (!adapter.canMove()) { state(true); return true; }
        if (!collapsed) { fullSize = dimensions(msg); size = { ...fullSize }; }
        const m = metrics();
        drag = { x:m.x, y:m.y };
      }
      if ((msg.type === 'window-drag-move' || msg.type === 'window-drag-end') && drag) {
        const m = metrics();
        const dx = Number(msg.dx), dy = Number(msg.dy);
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) return true;
        const next = position(drag.x + dx, drag.y + dy, m);
        if (msg.type === 'window-drag-end') {
          drag = null;
          edge = next.x + size.width / 2 < m.width / 2 ? 'left' : 'right';
          if (collapsed) { snap(m, next.y); state(); }
          else if (next.x <= 32 || next.x + size.width >= m.width - 32) collapse({ ...fullSize });
          else state();
        }
      }
      if (msg.type === 'window-drag-cancel' && drag) {
        position(drag.x, drag.y, metrics());
        drag = null;
      }
      if (msg.type === 'window-nudge' && adapter.canMove()) {
        const m = metrics();
        const dx = clamp(Number(msg.dx) || 0, -48, 48), dy = clamp(Number(msg.dy) || 0, -48, 48);
        position(m.x + dx, m.y + dy, m);
      }
    } catch (error) {
      drag = null;
      state(true);
      console.warn('Plugin window operation failed:', error);
    }
    return true;
  }
  return handle;
}

function reorderPluginBookmarks(spots, ids) {
  if (!Array.isArray(spots) || !Array.isArray(ids) || ids.length !== spots.length || new Set(ids).size !== ids.length) return null;
  const byId = new Map(spots.map(spot => [spot.id, spot]));
  if (ids.some(id => typeof id !== 'string' || !byId.has(id))) return null;
  return ids.map(id => byId.get(id)); // Retain all metadata, never trust UI-supplied objects.
}

function installPluginBookmarkQueue(ui) {
  const dispatch = ui.onmessage;
  let queue = Promise.resolve();
  ui.onmessage = message => {
    const msg = message?.pluginMessage || message;
    if (!String(msg?.type || '').startsWith('jb-')) return dispatch(message);
    const pending = queue.then(() => dispatch(message));
    queue = pending.catch(error => console.warn('Bookmark operation failed:', error));
    return pending;
  };
}

// Public host APIs only. Native title bars are intentionally retained.
const handlePluginWindowMessage = createPluginWindowController("mastergo" === 'figma' ? {
  canMove:() => typeof figma.ui.getPosition === 'function' && typeof figma.ui.reposition === 'function',
  metrics:() => {
    const b = figma.viewport.bounds, z = figma.viewport.zoom;
    const p = figma.ui.getPosition().canvasSpace;
    return { x:(p.x - b.x) * z, y:(p.y - b.y) * z, width:b.width * z, height:b.height * z, header:40 };
  },
  move:(x,y) => {
    const b = figma.viewport.bounds, z = figma.viewport.zoom;
    figma.ui.reposition(b.x + x / z, b.y + y / z);
  },
  resize:(w,h) => figma.ui.resize(w,h),
  send:msg => figma.ui.postMessage(msg)
} : {
  canMove:() => typeof mg.ui.moveTo === 'function' && Boolean(mg.ui.viewport),
  metrics:() => {
    const p = mg.ui.viewport, b = mg.viewport.bound, z = mg.viewport.zoom;
    return { x:p.x, y:p.y, width:b.width * z, height:b.height * z, header:p.headerHeight || 40 };
  },
  move:(x,y) => mg.ui.moveTo(x,y),
  resize:(w,h) => mg.ui.resize(w,h),
  send:msg => mg.ui.postMessage(msg)
});

// Clipper 6.4.2 by Angus Johnson, JavaScript translation by Timo
//
// Boost Software License - Version 1.0 - August 17th, 2003
//
// Permission is hereby granted, free of charge, to any person or organization
// obtaining a copy of the software and accompanying documentation covered by
// this license (the "Software") to use, reproduce, display, distribute,
// execute, and transmit the Software, and to prepare derivative works of the
// Software, and to permit third-parties to whom the Software is furnished to
// do so, all subject to the following:
//
// The copyright notices in the Software and this entire statement, including
// the above license grant, this restriction and the following disclaimer,
// must be included in all copies of the Software, in whole or in part, and
// all derivative works of the Software, unless such copies or derivative
// works are solely in the form of machine-executable object code generated by
// a source language processor.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT
// SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE
// FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
//
// JSBN by Tom Wu
//
// Licensing
// ---------
//
// This software is covered under the following copyright:
//
// /*
//  * Copyright (c) 2003-2005  Tom Wu
//  * All Rights Reserved.
//  *
//  * Permission is hereby granted, free of charge, to any person obtaining
//  * a copy of this software and associated documentation files (the
//  * "Software"), to deal in the Software without restriction, including
//  * without limitation the rights to use, copy, modify, merge, publish,
//  * distribute, sublicense, and/or sell copies of the Software, and to
//  * permit persons to whom the Software is furnished to do so, subject to
//  * the following conditions:
//  *
//  * The above copyright notice and this permission notice shall be
//  * included in all copies or substantial portions of the Software.
//  *
//  * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
//  * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
//  * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
//  *
//  * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
//  * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
//  * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
//  * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
//  * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//  *
//  * In addition, the following condition applies:
//  *
//  * All redistributions must retain an intact copy of this copyright notice
//  * and disclaimer.
//  */
//
// Address all questions regarding this license to:
//
//   Tom Wu
//   tjw@cs.Stanford.EDU
//
const iconfontClipper = (() => {
const module = { exports: {} };
const Number = { toInteger: null };
/*******************************************************************************
 *                                                                              *
 * Author    :  Angus Johnson                                                   *
 * Version   :  6.4.2                                                           *
 * Date      :  27 February 2017                                                *
 * Website   :  http://www.angusj.com                                           *
 * Copyright :  Angus Johnson 2010-2017                                         *
 *                                                                              *
 * License:                                                                     *
 * Use, modification & distribution is subject to Boost Software License Ver 1. *
 * http://www.boost.org/LICENSE_1_0.txt                                         *
 *                                                                              *
 * Attributions:                                                                *
 * The code in this library is an extension of Bala Vatti's clipping algorithm: *
 * "A generic solution to polygon clipping"                                     *
 * Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
 * http://portal.acm.org/citation.cfm?id=129906                                 *
 *                                                                              *
 * Computer graphics and geometric modeling: implementation and algorithms      *
 * By Max K. Agoston                                                            *
 * Springer; 1 edition (January 4, 2005)                                        *
 * http://books.google.com/books?q=vatti+clipping+agoston                       *
 *                                                                              *
 * See also:                                                                    *
 * "Polygon Offsetting by Computing Winding Numbers"                            *
 * Paper no. DETC2005-85513 pp. 565-575                                         *
 * ASME 2005 International Design Engineering Technical Conferences             *
 * and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
 * September 24-28, 2005 , Long Beach, California, USA                          *
 * http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Author    :  Timo                                                            *
 * Version   :  6.4.2.2                                                         *
 * Date      :  8 September 2017                                                 *
 *                                                                              *
 * This is a translation of the C# Clipper library to Javascript.               *
 * Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
 * Because Javascript lacks support for 64-bit integers, the space              *
 * is a little more restricted than in C# version.                              *
 *                                                                              *
 * C# version has support for coordinate space:                                 *
 * +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
 * while Javascript version has support for space:                              *
 * +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
 *                                                                              *
 * Tom Wu's JSBN proved to be the fastest big integer library:                  *
 * http://jsperf.com/big-integer-library-test                                   *
 *                                                                              *
 * This class can be made simpler when (if ever) 64-bit integer support comes   *
 * or floating point Clipper is released.                                       *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Basic JavaScript BN library - subset useful for RSA encryption.              *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
 * Copyright (c) 2005  Tom Wu                                                   *
 * All Rights Reserved.                                                         *
 * See "LICENSE" for details:                                                   *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
 *                                                                              *
 *******************************************************************************/
(function ()
{
	"use strict";
	var ClipperLib = {};
	ClipperLib.version = '6.4.2.2';

	//UseLines: Enables open path clipping. Adds a very minor cost to performance.
	ClipperLib.use_lines = true;

	//ClipperLib.use_xyz: adds a Z member to IntPoint. Adds a minor cost to performance.
	ClipperLib.use_xyz = false;

	var isNode = false;
	if (typeof module !== 'undefined' && module.exports)
	{
		module.exports = ClipperLib;
		isNode = true;
	}
	else
	{
		if (typeof define === 'function' && define.amd) {
			define(ClipperLib);
		}
		if (typeof (document) !== "undefined") window.ClipperLib = ClipperLib;
		else self['ClipperLib'] = ClipperLib;
	}
	var navigator_appName;
	if (!isNode)
	{
		var nav = navigator.userAgent.toString().toLowerCase();
		navigator_appName = navigator.appName;
	}
	else
	{
		var nav = "chrome"; // Node.js uses Chrome's V8 engine
		navigator_appName = "Netscape"; // Firefox, Chrome and Safari returns "Netscape", so Node.js should also
	}
	// Browser test to speedup performance critical functions
	var browser = {};

	if (nav.indexOf("chrome") != -1 && nav.indexOf("chromium") == -1) browser.chrome = 1;
	else browser.chrome = 0;
	if (nav.indexOf("chromium") != -1) browser.chromium = 1;
	else browser.chromium = 0;
	if (nav.indexOf("safari") != -1 && nav.indexOf("chrome") == -1 && nav.indexOf("chromium") == -1) browser.safari = 1;
	else browser.safari = 0;
	if (nav.indexOf("firefox") != -1) browser.firefox = 1;
	else browser.firefox = 0;
	if (nav.indexOf("firefox/17") != -1) browser.firefox17 = 1;
	else browser.firefox17 = 0;
	if (nav.indexOf("firefox/15") != -1) browser.firefox15 = 1;
	else browser.firefox15 = 0;
	if (nav.indexOf("firefox/3") != -1) browser.firefox3 = 1;
	else browser.firefox3 = 0;
	if (nav.indexOf("opera") != -1) browser.opera = 1;
	else browser.opera = 0;
	if (nav.indexOf("msie 10") != -1) browser.msie10 = 1;
	else browser.msie10 = 0;
	if (nav.indexOf("msie 9") != -1) browser.msie9 = 1;
	else browser.msie9 = 0;
	if (nav.indexOf("msie 8") != -1) browser.msie8 = 1;
	else browser.msie8 = 0;
	if (nav.indexOf("msie 7") != -1) browser.msie7 = 1;
	else browser.msie7 = 0;
	if (nav.indexOf("msie ") != -1) browser.msie = 1;
	else browser.msie = 0;
	ClipperLib.biginteger_used = null;

	// Copyright (c) 2005  Tom Wu
	// All Rights Reserved.
	// See "LICENSE" for details.
	// Basic JavaScript BN library - subset useful for RSA encryption.
	// Bits per digit
	var dbits;
	// JavaScript engine analysis
	var canary = 0xdeadbeefcafe;
	var j_lm = ((canary & 0xffffff) == 0xefcafe);
	// (public) Constructor
	/**
	* @constructor
	*/
	function BigInteger(a, b, c)
	{
		// This test variable can be removed,
		// but at least for performance tests it is useful piece of knowledge
		// This is the only ClipperLib related variable in BigInteger library
		ClipperLib.biginteger_used = 1;
		if (a != null)
			if ("number" == typeof a && "undefined" == typeof (b)) this.fromInt(a); // faster conversion
			else if ("number" == typeof a) this.fromNumber(a, b, c);
		else if (b == null && "string" != typeof a) this.fromString(a, 256);
		else this.fromString(a, b);
	}
	// return new, unset BigInteger
	function nbi()
	{
		return new BigInteger(null, undefined, undefined);
	}
	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	// We need to select the fastest one that works in this environment.
	// am1: use a single mult and divide to get the high bits,
	// max digit bits should be 26 because
	// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	function am1(i, x, w, j, c, n)
	{
		while (--n >= 0)
		{
			var v = x * this[i++] + w[j] + c;
			c = Math.floor(v / 0x4000000);
			w[j++] = v & 0x3ffffff;
		}
		return c;
	}
	// am2 avoids a big mult-and-extract completely.
	// Max digit bits should be <= 30 because we do bitwise ops
	// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	function am2(i, x, w, j, c, n)
	{
		var xl = x & 0x7fff,
			xh = x >> 15;
		while (--n >= 0)
		{
			var l = this[i] & 0x7fff;
			var h = this[i++] >> 15;
			var m = xh * l + h * xl;
			l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
			c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
			w[j++] = l & 0x3fffffff;
		}
		return c;
	}
	// Alternately, set max digit bits to 28 since some
	// browsers slow down when dealing with 32-bit numbers.
	function am3(i, x, w, j, c, n)
	{
		var xl = x & 0x3fff,
			xh = x >> 14;
		while (--n >= 0)
		{
			var l = this[i] & 0x3fff;
			var h = this[i++] >> 14;
			var m = xh * l + h * xl;
			l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
			c = (l >> 28) + (m >> 14) + xh * h;
			w[j++] = l & 0xfffffff;
		}
		return c;
	}
	if (j_lm && (navigator_appName == "Microsoft Internet Explorer"))
	{
		BigInteger.prototype.am = am2;
		dbits = 30;
	}
	else if (j_lm && (navigator_appName != "Netscape"))
	{
		BigInteger.prototype.am = am1;
		dbits = 26;
	}
	else
	{ // Mozilla/Netscape seems to prefer am3
		BigInteger.prototype.am = am3;
		dbits = 28;
	}
	BigInteger.prototype.DB = dbits;
	BigInteger.prototype.DM = ((1 << dbits) - 1);
	BigInteger.prototype.DV = (1 << dbits);
	var BI_FP = 52;
	BigInteger.prototype.FV = Math.pow(2, BI_FP);
	BigInteger.prototype.F1 = BI_FP - dbits;
	BigInteger.prototype.F2 = 2 * dbits - BI_FP;
	// Digit conversions
	var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	var BI_RC = new Array();
	var rr, vv;
	rr = "0".charCodeAt(0);
	for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
	rr = "a".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	rr = "A".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

	function int2char(n)
	{
		return BI_RM.charAt(n);
	}

	function intAt(s, i)
	{
		var c = BI_RC[s.charCodeAt(i)];
		return (c == null) ? -1 : c;
	}
	// (protected) copy this to r
	function bnpCopyTo(r)
	{
		for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
		r.t = this.t;
		r.s = this.s;
	}
	// (protected) set from integer value x, -DV <= x < DV
	function bnpFromInt(x)
	{
		this.t = 1;
		this.s = (x < 0) ? -1 : 0;
		if (x > 0) this[0] = x;
		else if (x < -1) this[0] = x + this.DV;
		else this.t = 0;
	}
	// return bigint initialized to value
	function nbv(i)
	{
		var r = nbi();
		r.fromInt(i);
		return r;
	}
	// (protected) set from string and radix
	function bnpFromString(s, b)
	{
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 256) k = 8; // byte array
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else
		{
			this.fromRadix(s, b);
			return;
		}
		this.t = 0;
		this.s = 0;
		var i = s.length,
			mi = false,
			sh = 0;
		while (--i >= 0)
		{
			var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
			if (x < 0)
			{
				if (s.charAt(i) == "-") mi = true;
				continue;
			}
			mi = false;
			if (sh == 0)
				this[this.t++] = x;
			else if (sh + k > this.DB)
			{
				this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
				this[this.t++] = (x >> (this.DB - sh));
			}
			else
				this[this.t - 1] |= x << sh;
			sh += k;
			if (sh >= this.DB) sh -= this.DB;
		}
		if (k == 8 && (s[0] & 0x80) != 0)
		{
			this.s = -1;
			if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
		}
		this.clamp();
		if (mi) BigInteger.ZERO.subTo(this, this);
	}
	// (protected) clamp off excess high words
	function bnpClamp()
	{
		var c = this.s & this.DM;
		while (this.t > 0 && this[this.t - 1] == c) --this.t;
	}
	// (public) return string representation in given radix
	function bnToString(b)
	{
		if (this.s < 0) return "-" + this.negate().toString(b);
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else return this.toRadix(b);
		var km = (1 << k) - 1,
			d, m = false,
			r = "",
			i = this.t;
		var p = this.DB - (i * this.DB) % k;
		if (i-- > 0)
		{
			if (p < this.DB && (d = this[i] >> p) > 0)
			{
				m = true;
				r = int2char(d);
			}
			while (i >= 0)
			{
				if (p < k)
				{
					d = (this[i] & ((1 << p) - 1)) << (k - p);
					d |= this[--i] >> (p += this.DB - k);
				}
				else
				{
					d = (this[i] >> (p -= k)) & km;
					if (p <= 0)
					{
						p += this.DB;
						--i;
					}
				}
				if (d > 0) m = true;
				if (m) r += int2char(d);
			}
		}
		return m ? r : "0";
	}
	// (public) -this
	function bnNegate()
	{
		var r = nbi();
		BigInteger.ZERO.subTo(this, r);
		return r;
	}
	// (public) |this|
	function bnAbs()
	{
		return (this.s < 0) ? this.negate() : this;
	}
	// (public) return + if this > a, - if this < a, 0 if equal
	function bnCompareTo(a)
	{
		var r = this.s - a.s;
		if (r != 0) return r;
		var i = this.t;
		r = i - a.t;
		if (r != 0) return (this.s < 0) ? -r : r;
		while (--i >= 0)
			if ((r = this[i] - a[i]) != 0) return r;
		return 0;
	}
	// returns bit length of the integer x
	function nbits(x)
	{
		var r = 1,
			t;
		if ((t = x >>> 16) != 0)
		{
			x = t;
			r += 16;
		}
		if ((t = x >> 8) != 0)
		{
			x = t;
			r += 8;
		}
		if ((t = x >> 4) != 0)
		{
			x = t;
			r += 4;
		}
		if ((t = x >> 2) != 0)
		{
			x = t;
			r += 2;
		}
		if ((t = x >> 1) != 0)
		{
			x = t;
			r += 1;
		}
		return r;
	}
	// (public) return the number of bits in "this"
	function bnBitLength()
	{
		if (this.t <= 0) return 0;
		return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
	}
	// (protected) r = this << n*DB
	function bnpDLShiftTo(n, r)
	{
		var i;
		for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
		for (i = n - 1; i >= 0; --i) r[i] = 0;
		r.t = this.t + n;
		r.s = this.s;
	}
	// (protected) r = this >> n*DB
	function bnpDRShiftTo(n, r)
	{
		for (var i = n; i < this.t; ++i) r[i - n] = this[i];
		r.t = Math.max(this.t - n, 0);
		r.s = this.s;
	}
	// (protected) r = this << n
	function bnpLShiftTo(n, r)
	{
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << cbs) - 1;
		var ds = Math.floor(n / this.DB),
			c = (this.s << bs) & this.DM,
			i;
		for (i = this.t - 1; i >= 0; --i)
		{
			r[i + ds + 1] = (this[i] >> cbs) | c;
			c = (this[i] & bm) << bs;
		}
		for (i = ds - 1; i >= 0; --i) r[i] = 0;
		r[ds] = c;
		r.t = this.t + ds + 1;
		r.s = this.s;
		r.clamp();
	}
	// (protected) r = this >> n
	function bnpRShiftTo(n, r)
	{
		r.s = this.s;
		var ds = Math.floor(n / this.DB);
		if (ds >= this.t)
		{
			r.t = 0;
			return;
		}
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << bs) - 1;
		r[0] = this[ds] >> bs;
		for (var i = ds + 1; i < this.t; ++i)
		{
			r[i - ds - 1] |= (this[i] & bm) << cbs;
			r[i - ds] = this[i] >> bs;
		}
		if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
		r.t = this.t - ds;
		r.clamp();
	}
	// (protected) r = this - a
	function bnpSubTo(a, r)
	{
		var i = 0,
			c = 0,
			m = Math.min(a.t, this.t);
		while (i < m)
		{
			c += this[i] - a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t)
		{
			c -= a.s;
			while (i < this.t)
			{
				c += this[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		}
		else
		{
			c += this.s;
			while (i < a.t)
			{
				c -= a[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c -= a.s;
		}
		r.s = (c < 0) ? -1 : 0;
		if (c < -1) r[i++] = this.DV + c;
		else if (c > 0) r[i++] = c;
		r.t = i;
		r.clamp();
	}
	// (protected) r = this * a, r != this,a (HAC 14.12)
	// "this" should be the larger one if appropriate.
	function bnpMultiplyTo(a, r)
	{
		var x = this.abs(),
			y = a.abs();
		var i = x.t;
		r.t = i + y.t;
		while (--i >= 0) r[i] = 0;
		for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
		r.s = 0;
		r.clamp();
		if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
	}
	// (protected) r = this^2, r != this (HAC 14.16)
	function bnpSquareTo(r)
	{
		var x = this.abs();
		var i = r.t = 2 * x.t;
		while (--i >= 0) r[i] = 0;
		for (i = 0; i < x.t - 1; ++i)
		{
			var c = x.am(i, x[i], r, 2 * i, 0, 1);
			if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV)
			{
				r[i + x.t] -= x.DV;
				r[i + x.t + 1] = 1;
			}
		}
		if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
		r.s = 0;
		r.clamp();
	}
	// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	// r != q, this != m.  q or r may be null.
	function bnpDivRemTo(m, q, r)
	{
		var pm = m.abs();
		if (pm.t <= 0) return;
		var pt = this.abs();
		if (pt.t < pm.t)
		{
			if (q != null) q.fromInt(0);
			if (r != null) this.copyTo(r);
			return;
		}
		if (r == null) r = nbi();
		var y = nbi(),
			ts = this.s,
			ms = m.s;
		var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
		if (nsh > 0)
		{
			pm.lShiftTo(nsh, y);
			pt.lShiftTo(nsh, r);
		}
		else
		{
			pm.copyTo(y);
			pt.copyTo(r);
		}
		var ys = y.t;
		var y0 = y[ys - 1];
		if (y0 == 0) return;
		var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
		var d1 = this.FV / yt,
			d2 = (1 << this.F1) / yt,
			e = 1 << this.F2;
		var i = r.t,
			j = i - ys,
			t = (q == null) ? nbi() : q;
		y.dlShiftTo(j, t);
		if (r.compareTo(t) >= 0)
		{
			r[r.t++] = 1;
			r.subTo(t, r);
		}
		BigInteger.ONE.dlShiftTo(ys, t);
		t.subTo(y, y); // "negative" y so we can replace sub with am later
		while (y.t < ys) y[y.t++] = 0;
		while (--j >= 0)
		{
			// Estimate quotient digit
			var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
			if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd)
			{ // Try it out
				y.dlShiftTo(j, t);
				r.subTo(t, r);
				while (r[i] < --qd) r.subTo(t, r);
			}
		}
		if (q != null)
		{
			r.drShiftTo(ys, q);
			if (ts != ms) BigInteger.ZERO.subTo(q, q);
		}
		r.t = ys;
		r.clamp();
		if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
		if (ts < 0) BigInteger.ZERO.subTo(r, r);
	}
	// (public) this mod a
	function bnMod(a)
	{
		var r = nbi();
		this.abs().divRemTo(a, null, r);
		if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
		return r;
	}
	// Modular reduction using "classic" algorithm
	/**
	* @constructor
	*/
	function Classic(m)
	{
		this.m = m;
	}

	function cConvert(x)
	{
		if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
		else return x;
	}

	function cRevert(x)
	{
		return x;
	}

	function cReduce(x)
	{
		x.divRemTo(this.m, null, x);
	}

	function cMulTo(x, y, r)
	{
		x.multiplyTo(y, r);
		this.reduce(r);
	}

	function cSqrTo(x, r)
	{
		x.squareTo(r);
		this.reduce(r);
	}
	Classic.prototype.convert = cConvert;
	Classic.prototype.revert = cRevert;
	Classic.prototype.reduce = cReduce;
	Classic.prototype.mulTo = cMulTo;
	Classic.prototype.sqrTo = cSqrTo;
	// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	// justification:
	//         xy == 1 (mod m)
	//         xy =  1+km
	//   xy(2-xy) = (1+km)(1-km)
	// x[y(2-xy)] = 1-k^2m^2
	// x[y(2-xy)] == 1 (mod m^2)
	// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	// JS multiply "overflows" differently from C/C++, so care is needed here.
	function bnpInvDigit()
	{
		if (this.t < 1) return 0;
		var x = this[0];
		if ((x & 1) == 0) return 0;
		var y = x & 3; // y == 1/x mod 2^2
		y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
		y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
		y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
		// last step - calculate inverse mod DV directly;
		// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
		y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
		// we really want the negative inverse, and -DV < y < DV
		return (y > 0) ? this.DV - y : -y;
	}
	// Montgomery reduction
	/**
	* @constructor
	*/
	function Montgomery(m)
	{
		this.m = m;
		this.mp = m.invDigit();
		this.mpl = this.mp & 0x7fff;
		this.mph = this.mp >> 15;
		this.um = (1 << (m.DB - 15)) - 1;
		this.mt2 = 2 * m.t;
	}
	// xR mod m
	function montConvert(x)
	{
		var r = nbi();
		x.abs().dlShiftTo(this.m.t, r);
		r.divRemTo(this.m, null, r);
		if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
		return r;
	}
	// x/R mod m
	function montRevert(x)
	{
		var r = nbi();
		x.copyTo(r);
		this.reduce(r);
		return r;
	}
	// x = x/R mod m (HAC 14.32)
	function montReduce(x)
	{
		while (x.t <= this.mt2) // pad x so am has enough room later
			x[x.t++] = 0;
		for (var i = 0; i < this.m.t; ++i)
		{
			// faster way of calculating u0 = x[i]*mp mod DV
			var j = x[i] & 0x7fff;
			var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
			// use am to combine the multiply-shift-add into one call
			j = i + this.m.t;
			x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
			// propagate carry
			while (x[j] >= x.DV)
			{
				x[j] -= x.DV;
				x[++j]++;
			}
		}
		x.clamp();
		x.drShiftTo(this.m.t, x);
		if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}
	// r = "x^2/R mod m"; x != r
	function montSqrTo(x, r)
	{
		x.squareTo(r);
		this.reduce(r);
	}
	// r = "xy/R mod m"; x,y != r
	function montMulTo(x, y, r)
	{
		x.multiplyTo(y, r);
		this.reduce(r);
	}
	Montgomery.prototype.convert = montConvert;
	Montgomery.prototype.revert = montRevert;
	Montgomery.prototype.reduce = montReduce;
	Montgomery.prototype.mulTo = montMulTo;
	Montgomery.prototype.sqrTo = montSqrTo;
	// (protected) true iff this is even
	function bnpIsEven()
	{
		return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
	}
	// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	function bnpExp(e, z)
	{
		if (e > 0xffffffff || e < 1) return BigInteger.ONE;
		var r = nbi(),
			r2 = nbi(),
			g = z.convert(this),
			i = nbits(e) - 1;
		g.copyTo(r);
		while (--i >= 0)
		{
			z.sqrTo(r, r2);
			if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
			else
			{
				var t = r;
				r = r2;
				r2 = t;
			}
		}
		return z.revert(r);
	}
	// (public) this^e % m, 0 <= e < 2^32
	function bnModPowInt(e, m)
	{
		var z;
		if (e < 256 || m.isEven()) z = new Classic(m);
		else z = new Montgomery(m);
		return this.exp(e, z);
	}
	// protected
	BigInteger.prototype.copyTo = bnpCopyTo;
	BigInteger.prototype.fromInt = bnpFromInt;
	BigInteger.prototype.fromString = bnpFromString;
	BigInteger.prototype.clamp = bnpClamp;
	BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	BigInteger.prototype.lShiftTo = bnpLShiftTo;
	BigInteger.prototype.rShiftTo = bnpRShiftTo;
	BigInteger.prototype.subTo = bnpSubTo;
	BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	BigInteger.prototype.squareTo = bnpSquareTo;
	BigInteger.prototype.divRemTo = bnpDivRemTo;
	BigInteger.prototype.invDigit = bnpInvDigit;
	BigInteger.prototype.isEven = bnpIsEven;
	BigInteger.prototype.exp = bnpExp;
	// public
	BigInteger.prototype.toString = bnToString;
	BigInteger.prototype.negate = bnNegate;
	BigInteger.prototype.abs = bnAbs;
	BigInteger.prototype.compareTo = bnCompareTo;
	BigInteger.prototype.bitLength = bnBitLength;
	BigInteger.prototype.mod = bnMod;
	BigInteger.prototype.modPowInt = bnModPowInt;
	// "constants"
	BigInteger.ZERO = nbv(0);
	BigInteger.ONE = nbv(1);
	// Copyright (c) 2005-2009  Tom Wu
	// All Rights Reserved.
	// See "LICENSE" for details.
	// Extended JavaScript BN functions, required for RSA private ops.
	// Version 1.1: new BigInteger("0", 10) returns "proper" zero
	// Version 1.2: square() API, isProbablePrime fix
	// (public)
	function bnClone()
	{
		var r = nbi();
		this.copyTo(r);
		return r;
	}
	// (public) return value as integer
	function bnIntValue()
	{
		if (this.s < 0)
		{
			if (this.t == 1) return this[0] - this.DV;
			else if (this.t == 0) return -1;
		}
		else if (this.t == 1) return this[0];
		else if (this.t == 0) return 0;
		// assumes 16 < DB < 32
		return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
	}
	// (public) return value as byte
	function bnByteValue()
	{
		return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
	}
	// (public) return value as short (assumes DB>=16)
	function bnShortValue()
	{
		return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
	}
	// (protected) return x s.t. r^x < DV
	function bnpChunkSize(r)
	{
		return Math.floor(Math.LN2 * this.DB / Math.log(r));
	}
	// (public) 0 if this == 0, 1 if this > 0
	function bnSigNum()
	{
		if (this.s < 0) return -1;
		else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
		else return 1;
	}
	// (protected) convert to radix string
	function bnpToRadix(b)
	{
		if (b == null) b = 10;
		if (this.signum() == 0 || b < 2 || b > 36) return "0";
		var cs = this.chunkSize(b);
		var a = Math.pow(b, cs);
		var d = nbv(a),
			y = nbi(),
			z = nbi(),
			r = "";
		this.divRemTo(d, y, z);
		while (y.signum() > 0)
		{
			r = (a + z.intValue()).toString(b).substr(1) + r;
			y.divRemTo(d, y, z);
		}
		return z.intValue().toString(b) + r;
	}
	// (protected) convert from radix string
	function bnpFromRadix(s, b)
	{
		this.fromInt(0);
		if (b == null) b = 10;
		var cs = this.chunkSize(b);
		var d = Math.pow(b, cs),
			mi = false,
			j = 0,
			w = 0;
		for (var i = 0; i < s.length; ++i)
		{
			var x = intAt(s, i);
			if (x < 0)
			{
				if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
				continue;
			}
			w = b * w + x;
			if (++j >= cs)
			{
				this.dMultiply(d);
				this.dAddOffset(w, 0);
				j = 0;
				w = 0;
			}
		}
		if (j > 0)
		{
			this.dMultiply(Math.pow(b, j));
			this.dAddOffset(w, 0);
		}
		if (mi) BigInteger.ZERO.subTo(this, this);
	}
	// (protected) alternate constructor
	function bnpFromNumber(a, b, c)
	{
		if ("number" == typeof b)
		{
			// new BigInteger(int,int,RNG)
			if (a < 2) this.fromInt(1);
			else
			{
				this.fromNumber(a, c);
				if (!this.testBit(a - 1)) // force MSB set
					this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
				if (this.isEven()) this.dAddOffset(1, 0); // force odd
				while (!this.isProbablePrime(b))
				{
					this.dAddOffset(2, 0);
					if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
				}
			}
		}
		else
		{
			// new BigInteger(int,RNG)
			var x = new Array(),
				t = a & 7;
			x.length = (a >> 3) + 1;
			b.nextBytes(x);
			if (t > 0) x[0] &= ((1 << t) - 1);
			else x[0] = 0;
			this.fromString(x, 256);
		}
	}
	// (public) convert to bigendian byte array
	function bnToByteArray()
	{
		var i = this.t,
			r = new Array();
		r[0] = this.s;
		var p = this.DB - (i * this.DB) % 8,
			d, k = 0;
		if (i-- > 0)
		{
			if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
				r[k++] = d | (this.s << (this.DB - p));
			while (i >= 0)
			{
				if (p < 8)
				{
					d = (this[i] & ((1 << p) - 1)) << (8 - p);
					d |= this[--i] >> (p += this.DB - 8);
				}
				else
				{
					d = (this[i] >> (p -= 8)) & 0xff;
					if (p <= 0)
					{
						p += this.DB;
						--i;
					}
				}
				if ((d & 0x80) != 0) d |= -256;
				if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
				if (k > 0 || d != this.s) r[k++] = d;
			}
		}
		return r;
	}

	function bnEquals(a)
	{
		return (this.compareTo(a) == 0);
	}

	function bnMin(a)
	{
		return (this.compareTo(a) < 0) ? this : a;
	}

	function bnMax(a)
	{
		return (this.compareTo(a) > 0) ? this : a;
	}
	// (protected) r = this op a (bitwise)
	function bnpBitwiseTo(a, op, r)
	{
		var i, f, m = Math.min(a.t, this.t);
		for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
		if (a.t < this.t)
		{
			f = a.s & this.DM;
			for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
			r.t = this.t;
		}
		else
		{
			f = this.s & this.DM;
			for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
			r.t = a.t;
		}
		r.s = op(this.s, a.s);
		r.clamp();
	}
	// (public) this & a
	function op_and(x, y)
	{
		return x & y;
	}

	function bnAnd(a)
	{
		var r = nbi();
		this.bitwiseTo(a, op_and, r);
		return r;
	}
	// (public) this | a
	function op_or(x, y)
	{
		return x | y;
	}

	function bnOr(a)
	{
		var r = nbi();
		this.bitwiseTo(a, op_or, r);
		return r;
	}
	// (public) this ^ a
	function op_xor(x, y)
	{
		return x ^ y;
	}

	function bnXor(a)
	{
		var r = nbi();
		this.bitwiseTo(a, op_xor, r);
		return r;
	}
	// (public) this & ~a
	function op_andnot(x, y)
	{
		return x & ~y;
	}

	function bnAndNot(a)
	{
		var r = nbi();
		this.bitwiseTo(a, op_andnot, r);
		return r;
	}
	// (public) ~this
	function bnNot()
	{
		var r = nbi();
		for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
		r.t = this.t;
		r.s = ~this.s;
		return r;
	}
	// (public) this << n
	function bnShiftLeft(n)
	{
		var r = nbi();
		if (n < 0) this.rShiftTo(-n, r);
		else this.lShiftTo(n, r);
		return r;
	}
	// (public) this >> n
	function bnShiftRight(n)
	{
		var r = nbi();
		if (n < 0) this.lShiftTo(-n, r);
		else this.rShiftTo(n, r);
		return r;
	}
	// return index of lowest 1-bit in x, x < 2^31
	function lbit(x)
	{
		if (x == 0) return -1;
		var r = 0;
		if ((x & 0xffff) == 0)
		{
			x >>= 16;
			r += 16;
		}
		if ((x & 0xff) == 0)
		{
			x >>= 8;
			r += 8;
		}
		if ((x & 0xf) == 0)
		{
			x >>= 4;
			r += 4;
		}
		if ((x & 3) == 0)
		{
			x >>= 2;
			r += 2;
		}
		if ((x & 1) == 0) ++r;
		return r;
	}
	// (public) returns index of lowest 1-bit (or -1 if none)
	function bnGetLowestSetBit()
	{
		for (var i = 0; i < this.t; ++i)
			if (this[i] != 0) return i * this.DB + lbit(this[i]);
		if (this.s < 0) return this.t * this.DB;
		return -1;
	}
	// return number of 1 bits in x
	function cbit(x)
	{
		var r = 0;
		while (x != 0)
		{
			x &= x - 1;
			++r;
		}
		return r;
	}
	// (public) return number of set bits
	function bnBitCount()
	{
		var r = 0,
			x = this.s & this.DM;
		for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
		return r;
	}
	// (public) true iff nth bit is set
	function bnTestBit(n)
	{
		var j = Math.floor(n / this.DB);
		if (j >= this.t) return (this.s != 0);
		return ((this[j] & (1 << (n % this.DB))) != 0);
	}
	// (protected) this op (1<<n)
	function bnpChangeBit(n, op)
	{
		var r = BigInteger.ONE.shiftLeft(n);
		this.bitwiseTo(r, op, r);
		return r;
	}
	// (public) this | (1<<n)
	function bnSetBit(n)
	{
		return this.changeBit(n, op_or);
	}
	// (public) this & ~(1<<n)
	function bnClearBit(n)
	{
		return this.changeBit(n, op_andnot);
	}
	// (public) this ^ (1<<n)
	function bnFlipBit(n)
	{
		return this.changeBit(n, op_xor);
	}
	// (protected) r = this + a
	function bnpAddTo(a, r)
	{
		var i = 0,
			c = 0,
			m = Math.min(a.t, this.t);
		while (i < m)
		{
			c += this[i] + a[i];
			r[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t)
		{
			c += a.s;
			while (i < this.t)
			{
				c += this[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		}
		else
		{
			c += this.s;
			while (i < a.t)
			{
				c += a[i];
				r[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += a.s;
		}
		r.s = (c < 0) ? -1 : 0;
		if (c > 0) r[i++] = c;
		else if (c < -1) r[i++] = this.DV + c;
		r.t = i;
		r.clamp();
	}
	// (public) this + a
	function bnAdd(a)
	{
		var r = nbi();
		this.addTo(a, r);
		return r;
	}
	// (public) this - a
	function bnSubtract(a)
	{
		var r = nbi();
		this.subTo(a, r);
		return r;
	}
	// (public) this * a
	function bnMultiply(a)
	{
		var r = nbi();
		this.multiplyTo(a, r);
		return r;
	}
	// (public) this^2
	function bnSquare()
	{
		var r = nbi();
		this.squareTo(r);
		return r;
	}
	// (public) this / a
	function bnDivide(a)
	{
		var r = nbi();
		this.divRemTo(a, r, null);
		return r;
	}
	// (public) this % a
	function bnRemainder(a)
	{
		var r = nbi();
		this.divRemTo(a, null, r);
		return r;
	}
	// (public) [this/a,this%a]
	function bnDivideAndRemainder(a)
	{
		var q = nbi(),
			r = nbi();
		this.divRemTo(a, q, r);
		return new Array(q, r);
	}
	// (protected) this *= n, this >= 0, 1 < n < DV
	function bnpDMultiply(n)
	{
		this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
		++this.t;
		this.clamp();
	}
	// (protected) this += n << w words, this >= 0
	function bnpDAddOffset(n, w)
	{
		if (n == 0) return;
		while (this.t <= w) this[this.t++] = 0;
		this[w] += n;
		while (this[w] >= this.DV)
		{
			this[w] -= this.DV;
			if (++w >= this.t) this[this.t++] = 0;
			++this[w];
		}
	}
	// A "null" reducer
	/**
	* @constructor
	*/
	function NullExp()
	{}

	function nNop(x)
	{
		return x;
	}

	function nMulTo(x, y, r)
	{
		x.multiplyTo(y, r);
	}

	function nSqrTo(x, r)
	{
		x.squareTo(r);
	}
	NullExp.prototype.convert = nNop;
	NullExp.prototype.revert = nNop;
	NullExp.prototype.mulTo = nMulTo;
	NullExp.prototype.sqrTo = nSqrTo;
	// (public) this^e
	function bnPow(e)
	{
		return this.exp(e, new NullExp());
	}
	// (protected) r = lower n words of "this * a", a.t <= n
	// "this" should be the larger one if appropriate.
	function bnpMultiplyLowerTo(a, n, r)
	{
		var i = Math.min(this.t + a.t, n);
		r.s = 0; // assumes a,this >= 0
		r.t = i;
		while (i > 0) r[--i] = 0;
		var j;
		for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
		for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
		r.clamp();
	}
	// (protected) r = "this * a" without lower n words, n > 0
	// "this" should be the larger one if appropriate.
	function bnpMultiplyUpperTo(a, n, r)
	{
		--n;
		var i = r.t = this.t + a.t - n;
		r.s = 0; // assumes a,this >= 0
		while (--i >= 0) r[i] = 0;
		for (i = Math.max(n - this.t, 0); i < a.t; ++i)
			r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
		r.clamp();
		r.drShiftTo(1, r);
	}
	// Barrett modular reduction
	/**
	* @constructor
	*/
	function Barrett(m)
	{
		// setup Barrett
		this.r2 = nbi();
		this.q3 = nbi();
		BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
		this.mu = this.r2.divide(m);
		this.m = m;
	}

	function barrettConvert(x)
	{
		if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
		else if (x.compareTo(this.m) < 0) return x;
		else
		{
			var r = nbi();
			x.copyTo(r);
			this.reduce(r);
			return r;
		}
	}

	function barrettRevert(x)
	{
		return x;
	}
	// x = x mod m (HAC 14.42)
	function barrettReduce(x)
	{
		x.drShiftTo(this.m.t - 1, this.r2);
		if (x.t > this.m.t + 1)
		{
			x.t = this.m.t + 1;
			x.clamp();
		}
		this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
		this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
		while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
		x.subTo(this.r2, x);
		while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}
	// r = x^2 mod m; x != r
	function barrettSqrTo(x, r)
	{
		x.squareTo(r);
		this.reduce(r);
	}
	// r = x*y mod m; x,y != r
	function barrettMulTo(x, y, r)
	{
		x.multiplyTo(y, r);
		this.reduce(r);
	}
	Barrett.prototype.convert = barrettConvert;
	Barrett.prototype.revert = barrettRevert;
	Barrett.prototype.reduce = barrettReduce;
	Barrett.prototype.mulTo = barrettMulTo;
	Barrett.prototype.sqrTo = barrettSqrTo;
	// (public) this^e % m (HAC 14.85)
	function bnModPow(e, m)
	{
		var i = e.bitLength(),
			k, r = nbv(1),
			z;
		if (i <= 0) return r;
		else if (i < 18) k = 1;
		else if (i < 48) k = 3;
		else if (i < 144) k = 4;
		else if (i < 768) k = 5;
		else k = 6;
		if (i < 8)
			z = new Classic(m);
		else if (m.isEven())
			z = new Barrett(m);
		else
			z = new Montgomery(m);
		// precomputation
		var g = new Array(),
			n = 3,
			k1 = k - 1,
			km = (1 << k) - 1;
		g[1] = z.convert(this);
		if (k > 1)
		{
			var g2 = nbi();
			z.sqrTo(g[1], g2);
			while (n <= km)
			{
				g[n] = nbi();
				z.mulTo(g2, g[n - 2], g[n]);
				n += 2;
			}
		}
		var j = e.t - 1,
			w, is1 = true,
			r2 = nbi(),
			t;
		i = nbits(e[j]) - 1;
		while (j >= 0)
		{
			if (i >= k1) w = (e[j] >> (i - k1)) & km;
			else
			{
				w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
				if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
			}
			n = k;
			while ((w & 1) == 0)
			{
				w >>= 1;
				--n;
			}
			if ((i -= n) < 0)
			{
				i += this.DB;
				--j;
			}
			if (is1)
			{ // ret == 1, don't bother squaring or multiplying it
				g[w].copyTo(r);
				is1 = false;
			}
			else
			{
				while (n > 1)
				{
					z.sqrTo(r, r2);
					z.sqrTo(r2, r);
					n -= 2;
				}
				if (n > 0) z.sqrTo(r, r2);
				else
				{
					t = r;
					r = r2;
					r2 = t;
				}
				z.mulTo(r2, g[w], r);
			}
			while (j >= 0 && (e[j] & (1 << i)) == 0)
			{
				z.sqrTo(r, r2);
				t = r;
				r = r2;
				r2 = t;
				if (--i < 0)
				{
					i = this.DB - 1;
					--j;
				}
			}
		}
		return z.revert(r);
	}
	// (public) gcd(this,a) (HAC 14.54)
	function bnGCD(a)
	{
		var x = (this.s < 0) ? this.negate() : this.clone();
		var y = (a.s < 0) ? a.negate() : a.clone();
		if (x.compareTo(y) < 0)
		{
			var t = x;
			x = y;
			y = t;
		}
		var i = x.getLowestSetBit(),
			g = y.getLowestSetBit();
		if (g < 0) return x;
		if (i < g) g = i;
		if (g > 0)
		{
			x.rShiftTo(g, x);
			y.rShiftTo(g, y);
		}
		while (x.signum() > 0)
		{
			if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
			if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
			if (x.compareTo(y) >= 0)
			{
				x.subTo(y, x);
				x.rShiftTo(1, x);
			}
			else
			{
				y.subTo(x, y);
				y.rShiftTo(1, y);
			}
		}
		if (g > 0) y.lShiftTo(g, y);
		return y;
	}
	// (protected) this % n, n < 2^26
	function bnpModInt(n)
	{
		if (n <= 0) return 0;
		var d = this.DV % n,
			r = (this.s < 0) ? n - 1 : 0;
		if (this.t > 0)
			if (d == 0) r = this[0] % n;
			else
				for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
		return r;
	}
	// (public) 1/this % m (HAC 14.61)
	function bnModInverse(m)
	{
		var ac = m.isEven();
		if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
		var u = m.clone(),
			v = this.clone();
		var a = nbv(1),
			b = nbv(0),
			c = nbv(0),
			d = nbv(1);
		while (u.signum() != 0)
		{
			while (u.isEven())
			{
				u.rShiftTo(1, u);
				if (ac)
				{
					if (!a.isEven() || !b.isEven())
					{
						a.addTo(this, a);
						b.subTo(m, b);
					}
					a.rShiftTo(1, a);
				}
				else if (!b.isEven()) b.subTo(m, b);
				b.rShiftTo(1, b);
			}
			while (v.isEven())
			{
				v.rShiftTo(1, v);
				if (ac)
				{
					if (!c.isEven() || !d.isEven())
					{
						c.addTo(this, c);
						d.subTo(m, d);
					}
					c.rShiftTo(1, c);
				}
				else if (!d.isEven()) d.subTo(m, d);
				d.rShiftTo(1, d);
			}
			if (u.compareTo(v) >= 0)
			{
				u.subTo(v, u);
				if (ac) a.subTo(c, a);
				b.subTo(d, b);
			}
			else
			{
				v.subTo(u, v);
				if (ac) c.subTo(a, c);
				d.subTo(b, d);
			}
		}
		if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
		if (d.compareTo(m) >= 0) return d.subtract(m);
		if (d.signum() < 0) d.addTo(m, d);
		else return d;
		if (d.signum() < 0) return d.add(m);
		else return d;
	}
	var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
	var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
	// (public) test primality with certainty >= 1-.5^t
	function bnIsProbablePrime(t)
	{
		var i, x = this.abs();
		if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1])
		{
			for (i = 0; i < lowprimes.length; ++i)
				if (x[0] == lowprimes[i]) return true;
			return false;
		}
		if (x.isEven()) return false;
		i = 1;
		while (i < lowprimes.length)
		{
			var m = lowprimes[i],
				j = i + 1;
			while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
			m = x.modInt(m);
			while (i < j)
				if (m % lowprimes[i++] == 0) return false;
		}
		return x.millerRabin(t);
	}
	// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	function bnpMillerRabin(t)
	{
		var n1 = this.subtract(BigInteger.ONE);
		var k = n1.getLowestSetBit();
		if (k <= 0) return false;
		var r = n1.shiftRight(k);
		t = (t + 1) >> 1;
		if (t > lowprimes.length) t = lowprimes.length;
		var a = nbi();
		for (var i = 0; i < t; ++i)
		{
			//Pick bases at random, instead of starting at 2
			a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
			var y = a.modPow(r, this);
			if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0)
			{
				var j = 1;
				while (j++ < k && y.compareTo(n1) != 0)
				{
					y = y.modPowInt(2, this);
					if (y.compareTo(BigInteger.ONE) == 0) return false;
				}
				if (y.compareTo(n1) != 0) return false;
			}
		}
		return true;
	}
	// protected
	BigInteger.prototype.chunkSize = bnpChunkSize;
	BigInteger.prototype.toRadix = bnpToRadix;
	BigInteger.prototype.fromRadix = bnpFromRadix;
	BigInteger.prototype.fromNumber = bnpFromNumber;
	BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	BigInteger.prototype.changeBit = bnpChangeBit;
	BigInteger.prototype.addTo = bnpAddTo;
	BigInteger.prototype.dMultiply = bnpDMultiply;
	BigInteger.prototype.dAddOffset = bnpDAddOffset;
	BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	BigInteger.prototype.modInt = bnpModInt;
	BigInteger.prototype.millerRabin = bnpMillerRabin;
	// public
	BigInteger.prototype.clone = bnClone;
	BigInteger.prototype.intValue = bnIntValue;
	BigInteger.prototype.byteValue = bnByteValue;
	BigInteger.prototype.shortValue = bnShortValue;
	BigInteger.prototype.signum = bnSigNum;
	BigInteger.prototype.toByteArray = bnToByteArray;
	BigInteger.prototype.equals = bnEquals;
	BigInteger.prototype.min = bnMin;
	BigInteger.prototype.max = bnMax;
	BigInteger.prototype.and = bnAnd;
	BigInteger.prototype.or = bnOr;
	BigInteger.prototype.xor = bnXor;
	BigInteger.prototype.andNot = bnAndNot;
	BigInteger.prototype.not = bnNot;
	BigInteger.prototype.shiftLeft = bnShiftLeft;
	BigInteger.prototype.shiftRight = bnShiftRight;
	BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	BigInteger.prototype.bitCount = bnBitCount;
	BigInteger.prototype.testBit = bnTestBit;
	BigInteger.prototype.setBit = bnSetBit;
	BigInteger.prototype.clearBit = bnClearBit;
	BigInteger.prototype.flipBit = bnFlipBit;
	BigInteger.prototype.add = bnAdd;
	BigInteger.prototype.subtract = bnSubtract;
	BigInteger.prototype.multiply = bnMultiply;
	BigInteger.prototype.divide = bnDivide;
	BigInteger.prototype.remainder = bnRemainder;
	BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	BigInteger.prototype.modPow = bnModPow;
	BigInteger.prototype.modInverse = bnModInverse;
	BigInteger.prototype.pow = bnPow;
	BigInteger.prototype.gcd = bnGCD;
	BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
	// JSBN-specific extension
	BigInteger.prototype.square = bnSquare;
	var Int128 = BigInteger;
	// BigInteger interfaces not implemented in jsbn:
	// BigInteger(int signum, byte[] magnitude)
	// double doubleValue()
	// float floatValue()
	// int hashCode()
	// long longValue()
	// static BigInteger valueOf(long val)
	// Helper functions to make BigInteger functions callable with two parameters
	// as in original C# Clipper
	Int128.prototype.IsNegative = function ()
	{
		if (this.compareTo(Int128.ZERO) == -1) return true;
		else return false;
	};

	Int128.op_Equality = function (val1, val2)
	{
		if (val1.compareTo(val2) == 0) return true;
		else return false;
	};

	Int128.op_Inequality = function (val1, val2)
	{
		if (val1.compareTo(val2) != 0) return true;
		else return false;
	};

	Int128.op_GreaterThan = function (val1, val2)
	{
		if (val1.compareTo(val2) > 0) return true;
		else return false;
	};

	Int128.op_LessThan = function (val1, val2)
	{
		if (val1.compareTo(val2) < 0) return true;
		else return false;
	};

	Int128.op_Addition = function (lhs, rhs)
	{
		return new Int128(lhs, undefined, undefined).add(new Int128(rhs, undefined, undefined));
	};

	Int128.op_Subtraction = function (lhs, rhs)
	{
		return new Int128(lhs, undefined, undefined).subtract(new Int128(rhs, undefined, undefined));
	};

	Int128.Int128Mul = function (lhs, rhs)
	{
		return new Int128(lhs, undefined, undefined).multiply(new Int128(rhs, undefined, undefined));
	};

	Int128.op_Division = function (lhs, rhs)
	{
		return lhs.divide(rhs);
	};

	Int128.prototype.ToDouble = function ()
	{
		return parseFloat(this.toString()); // This could be something faster
	};

	// end of Int128 section
	/*
	// Uncomment the following two lines if you want to use Int128 outside ClipperLib
	if (typeof(document) !== "undefined") window.Int128 = Int128;
	else self.Int128 = Int128;
	*/

	// ---------------------------------------------

	// Here starts the actual Clipper library:
	// Helper function to support Inheritance in Javascript
	var Inherit = function (ce, ce2)
	{
		var p;
		if (typeof (Object.getOwnPropertyNames) === 'undefined')
		{
			for (p in ce2.prototype)
				if (typeof (ce.prototype[p]) === 'undefined' || ce.prototype[p] === Object.prototype[p]) ce.prototype[p] = ce2.prototype[p];
			for (p in ce2)
				if (typeof (ce[p]) === 'undefined') ce[p] = ce2[p];
			ce.$baseCtor = ce2;
		}
		else
		{
			var props = Object.getOwnPropertyNames(ce2.prototype);
			for (var i = 0; i < props.length; i++)
				if (typeof (Object.getOwnPropertyDescriptor(ce.prototype, props[i])) === 'undefined') Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));
			for (p in ce2)
				if (typeof (ce[p]) === 'undefined') ce[p] = ce2[p];
			ce.$baseCtor = ce2;
		}
	};

	/**
	* @constructor
	*/
	ClipperLib.Path = function ()
	{
		return [];
	};

	ClipperLib.Path.prototype.push = Array.prototype.push;

	/**
	* @constructor
	*/
	ClipperLib.Paths = function ()
	{
		return []; // Was previously [[]], but caused problems when pushed
	};

	ClipperLib.Paths.prototype.push = Array.prototype.push;

	// Preserves the calling way of original C# Clipper
	// Is essential due to compatibility, because DoublePoint is public class in original C# version
	/**
	* @constructor
	*/
	ClipperLib.DoublePoint = function ()
	{
		var a = arguments;
		this.X = 0;
		this.Y = 0;
		// public DoublePoint(DoublePoint dp)
		// public DoublePoint(IntPoint ip)
		if (a.length === 1)
		{
			this.X = a[0].X;
			this.Y = a[0].Y;
		}
		else if (a.length === 2)
		{
			this.X = a[0];
			this.Y = a[1];
		}
	}; // This is internal faster function when called without arguments
	/**
	* @constructor
	*/
	ClipperLib.DoublePoint0 = function ()
	{
		this.X = 0;
		this.Y = 0;
	};

	ClipperLib.DoublePoint0.prototype = ClipperLib.DoublePoint.prototype;

	// This is internal faster function when called with 1 argument (dp or ip)
	/**
	* @constructor
	*/
	ClipperLib.DoublePoint1 = function (dp)
	{
		this.X = dp.X;
		this.Y = dp.Y;
	};

	ClipperLib.DoublePoint1.prototype = ClipperLib.DoublePoint.prototype;

	// This is internal faster function when called with 2 arguments (x and y)
	/**
	* @constructor
	*/
	ClipperLib.DoublePoint2 = function (x, y)
	{
		this.X = x;
		this.Y = y;
	};

	ClipperLib.DoublePoint2.prototype = ClipperLib.DoublePoint.prototype;

	// PolyTree & PolyNode start
	/**
	* @suppress {missingProperties}
	*/
	ClipperLib.PolyNode = function ()
	{
		this.m_Parent = null;
		this.m_polygon = new ClipperLib.Path();
		this.m_Index = 0;
		this.m_jointype = 0;
		this.m_endtype = 0;
		this.m_Childs = [];
		this.IsOpen = false;
	};

	ClipperLib.PolyNode.prototype.IsHoleNode = function ()
	{
		var result = true;
		var node = this.m_Parent;
		while (node !== null)
		{
			result = !result;
			node = node.m_Parent;
		}
		return result;
	};

	ClipperLib.PolyNode.prototype.ChildCount = function ()
	{
		return this.m_Childs.length;
	};

	ClipperLib.PolyNode.prototype.Contour = function ()
	{
		return this.m_polygon;
	};

	ClipperLib.PolyNode.prototype.AddChild = function (Child)
	{
		var cnt = this.m_Childs.length;
		this.m_Childs.push(Child);
		Child.m_Parent = this;
		Child.m_Index = cnt;
	};

	ClipperLib.PolyNode.prototype.GetNext = function ()
	{
		if (this.m_Childs.length > 0)
			return this.m_Childs[0];
		else
			return this.GetNextSiblingUp();
	};

	ClipperLib.PolyNode.prototype.GetNextSiblingUp = function ()
	{
		if (this.m_Parent === null)
			return null;
		else if (this.m_Index === this.m_Parent.m_Childs.length - 1)
			return this.m_Parent.GetNextSiblingUp();
		else
			return this.m_Parent.m_Childs[this.m_Index + 1];
	};

	ClipperLib.PolyNode.prototype.Childs = function ()
	{
		return this.m_Childs;
	};

	ClipperLib.PolyNode.prototype.Parent = function ()
	{
		return this.m_Parent;
	};

	ClipperLib.PolyNode.prototype.IsHole = function ()
	{
		return this.IsHoleNode();
	};

	// PolyTree : PolyNode
	/**
	 * @suppress {missingProperties}
	 * @constructor
	 */
	ClipperLib.PolyTree = function ()
	{
		this.m_AllPolys = [];
		ClipperLib.PolyNode.call(this);
	};

	ClipperLib.PolyTree.prototype.Clear = function ()
	{
		for (var i = 0, ilen = this.m_AllPolys.length; i < ilen; i++)
			this.m_AllPolys[i] = null;
		this.m_AllPolys.length = 0;
		this.m_Childs.length = 0;
	};

	ClipperLib.PolyTree.prototype.GetFirst = function ()
	{
		if (this.m_Childs.length > 0)
			return this.m_Childs[0];
		else
			return null;
	};

	ClipperLib.PolyTree.prototype.Total = function ()
	{
		var result = this.m_AllPolys.length;
		//with negative offsets, ignore the hidden outer polygon ...
		if (result > 0 && this.m_Childs[0] !== this.m_AllPolys[0]) result--;
		return result;
	};

	Inherit(ClipperLib.PolyTree, ClipperLib.PolyNode);

	// PolyTree & PolyNode end

	ClipperLib.Math_Abs_Int64 = ClipperLib.Math_Abs_Int32 = ClipperLib.Math_Abs_Double = function (a)
	{
		return Math.abs(a);
	};

	ClipperLib.Math_Max_Int32_Int32 = function (a, b)
	{
		return Math.max(a, b);
	};

	/*
	-----------------------------------
	cast_32 speedtest: http://jsperf.com/truncate-float-to-integer/2
	-----------------------------------
	*/
	if (browser.msie || browser.opera || browser.safari) ClipperLib.Cast_Int32 = function (a)
	{
		return a | 0;
	};

	else ClipperLib.Cast_Int32 = function (a)
	{ // eg. browser.chrome || browser.chromium || browser.firefox
		return ~~a;
	};

	/*
	--------------------------
	cast_64 speedtests: http://jsperf.com/truncate-float-to-integer
	Chrome: bitwise_not_floor
	Firefox17: toInteger (typeof test)
	IE9: bitwise_or_floor
	IE7 and IE8: to_parseint
	Chromium: to_floor_or_ceil
	Firefox3: to_floor_or_ceil
	Firefox15: to_floor_or_ceil
	Opera: to_floor_or_ceil
	Safari: to_floor_or_ceil
	--------------------------
	*/
	if (typeof Number.toInteger === "undefined")
		Number.toInteger = null;

	if (browser.chrome) ClipperLib.Cast_Int64 = function (a)
	{
		if (a < -2147483648 || a > 2147483647)
			return a < 0 ? Math.ceil(a) : Math.floor(a);
		else return ~~a;
	};

	else if (browser.firefox && typeof (Number.toInteger) === "function") ClipperLib.Cast_Int64 = function (a)
	{
		return Number.toInteger(a);
	};

	else if (browser.msie7 || browser.msie8) ClipperLib.Cast_Int64 = function (a)
	{
		return parseInt(a, 10);
	};

	else if (browser.msie) ClipperLib.Cast_Int64 = function (a)
	{
		if (a < -2147483648 || a > 2147483647)
			return a < 0 ? Math.ceil(a) : Math.floor(a);
		return a | 0;
	};

	// eg. browser.chromium || browser.firefox || browser.opera || browser.safari
	else ClipperLib.Cast_Int64 = function (a)
	{
		return a < 0 ? Math.ceil(a) : Math.floor(a);
	};

	ClipperLib.Clear = function (a)
	{
		a.length = 0;
	};

	//ClipperLib.MaxSteps = 64; // How many steps at maximum in arc in BuildArc() function
	ClipperLib.PI = 3.141592653589793;
	ClipperLib.PI2 = 2 * 3.141592653589793;
	/**
	* @constructor
	*/
	ClipperLib.IntPoint = function ()
	{
		var a = arguments,
			alen = a.length;
		this.X = 0;
		this.Y = 0;
		if (ClipperLib.use_xyz)
		{
			this.Z = 0;
			if (alen === 3) // public IntPoint(cInt x, cInt y, cInt z = 0)
			{
				this.X = a[0];
				this.Y = a[1];
				this.Z = a[2];
			}
			else if (alen === 2) // public IntPoint(cInt x, cInt y)
			{
				this.X = a[0];
				this.Y = a[1];
				this.Z = 0;
			}
			else if (alen === 1)
			{
				if (a[0] instanceof ClipperLib.DoublePoint) // public IntPoint(DoublePoint dp)
				{
					var dp = a[0];
					this.X = ClipperLib.Clipper.Round(dp.X);
					this.Y = ClipperLib.Clipper.Round(dp.Y);
					this.Z = 0;
				}
				else // public IntPoint(IntPoint pt)
				{
					var pt = a[0];
					if (typeof (pt.Z) === "undefined") pt.Z = 0;
					this.X = pt.X;
					this.Y = pt.Y;
					this.Z = pt.Z;
				}
			}
			else // public IntPoint()
			{
				this.X = 0;
				this.Y = 0;
				this.Z = 0;
			}
		}
		else // if (!ClipperLib.use_xyz)
		{
			if (alen === 2) // public IntPoint(cInt X, cInt Y)
			{
				this.X = a[0];
				this.Y = a[1];
			}
			else if (alen === 1)
			{
				if (a[0] instanceof ClipperLib.DoublePoint) // public IntPoint(DoublePoint dp)
				{
					var dp = a[0];
					this.X = ClipperLib.Clipper.Round(dp.X);
					this.Y = ClipperLib.Clipper.Round(dp.Y);
				}
				else // public IntPoint(IntPoint pt)
				{
					var pt = a[0];
					this.X = pt.X;
					this.Y = pt.Y;
				}
			}
			else // public IntPoint(IntPoint pt)
			{
				this.X = 0;
				this.Y = 0;
			}
		}
	};

	ClipperLib.IntPoint.op_Equality = function (a, b)
	{
		//return a == b;
		return a.X === b.X && a.Y === b.Y;
	};

	ClipperLib.IntPoint.op_Inequality = function (a, b)
	{
		//return a !== b;
		return a.X !== b.X || a.Y !== b.Y;
	};

	/*
  ClipperLib.IntPoint.prototype.Equals = function (obj)
  {
	if (obj === null)
		return false;
	if (obj instanceof ClipperLib.IntPoint)
	{
		var a = Cast(obj, ClipperLib.IntPoint);
		return (this.X == a.X) && (this.Y == a.Y);
	}
	else
		return false;
  };

	*/

	/**
	* @constructor
	*/
	ClipperLib.IntPoint0 = function ()
	{
		this.X = 0;
		this.Y = 0;
		if (ClipperLib.use_xyz)
			this.Z = 0;
	};

	ClipperLib.IntPoint0.prototype = ClipperLib.IntPoint.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntPoint1 = function (pt)
	{
		this.X = pt.X;
		this.Y = pt.Y;
		if (ClipperLib.use_xyz)
		{
			if (typeof pt.Z === "undefined") this.Z = 0;
			else this.Z = pt.Z;
		}
	};

	ClipperLib.IntPoint1.prototype = ClipperLib.IntPoint.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntPoint1dp = function (dp)
	{
		this.X = ClipperLib.Clipper.Round(dp.X);
		this.Y = ClipperLib.Clipper.Round(dp.Y);
		if (ClipperLib.use_xyz)
			this.Z = 0;
	};

	ClipperLib.IntPoint1dp.prototype = ClipperLib.IntPoint.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntPoint2 = function (x, y, z)
	{
		this.X = x;
		this.Y = y;
		if (ClipperLib.use_xyz)
		{
			if (typeof z === "undefined") this.Z = 0;
			else this.Z = z;
		}
	};

	ClipperLib.IntPoint2.prototype = ClipperLib.IntPoint.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntRect = function ()
	{
		var a = arguments,
			alen = a.length;
		if (alen === 4) // function (l, t, r, b)
		{
			this.left = a[0];
			this.top = a[1];
			this.right = a[2];
			this.bottom = a[3];
		}
		else if (alen === 1) // function (ir)
		{
			var ir = a[0];
			this.left = ir.left;
			this.top = ir.top;
			this.right = ir.right;
			this.bottom = ir.bottom;
		}
		else // function ()
		{
			this.left = 0;
			this.top = 0;
			this.right = 0;
			this.bottom = 0;
		}
	};

	/**
	* @constructor
	*/
	ClipperLib.IntRect0 = function ()
	{
		this.left = 0;
		this.top = 0;
		this.right = 0;
		this.bottom = 0;
	};

	ClipperLib.IntRect0.prototype = ClipperLib.IntRect.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntRect1 = function (ir)
	{
		this.left = ir.left;
		this.top = ir.top;
		this.right = ir.right;
		this.bottom = ir.bottom;
	};

	ClipperLib.IntRect1.prototype = ClipperLib.IntRect.prototype;

	/**
	* @constructor
	*/
	ClipperLib.IntRect4 = function (l, t, r, b)
	{
		this.left = l;
		this.top = t;
		this.right = r;
		this.bottom = b;
	};

	ClipperLib.IntRect4.prototype = ClipperLib.IntRect.prototype;

	ClipperLib.ClipType = {
		ctIntersection: 0,
		ctUnion: 1,
		ctDifference: 2,
		ctXor: 3
	};

	ClipperLib.PolyType = {
		ptSubject: 0,
		ptClip: 1
	};

	ClipperLib.PolyFillType = {
		pftEvenOdd: 0,
		pftNonZero: 1,
		pftPositive: 2,
		pftNegative: 3
	};

	ClipperLib.JoinType = {
		jtSquare: 0,
		jtRound: 1,
		jtMiter: 2
	};

	ClipperLib.EndType = {
		etOpenSquare: 0,
		etOpenRound: 1,
		etOpenButt: 2,
		etClosedLine: 3,
		etClosedPolygon: 4
	};

	ClipperLib.EdgeSide = {
		esLeft: 0,
		esRight: 1
	};

	ClipperLib.Direction = {
		dRightToLeft: 0,
		dLeftToRight: 1
	};

	/**
	* @constructor
	*/
	ClipperLib.TEdge = function ()
	{
		this.Bot = new ClipperLib.IntPoint0();
		this.Curr = new ClipperLib.IntPoint0(); //current (updated for every new scanbeam)
		this.Top = new ClipperLib.IntPoint0();
		this.Delta = new ClipperLib.IntPoint0();
		this.Dx = 0;
		this.PolyTyp = ClipperLib.PolyType.ptSubject;
		this.Side = ClipperLib.EdgeSide.esLeft; //side only refers to current side of solution poly
		this.WindDelta = 0; //1 or -1 depending on winding direction
		this.WindCnt = 0;
		this.WindCnt2 = 0; //winding count of the opposite polytype
		this.OutIdx = 0;
		this.Next = null;
		this.Prev = null;
		this.NextInLML = null;
		this.NextInAEL = null;
		this.PrevInAEL = null;
		this.NextInSEL = null;
		this.PrevInSEL = null;
	};

	/**
	* @constructor
	*/
	ClipperLib.IntersectNode = function ()
	{
		this.Edge1 = null;
		this.Edge2 = null;
		this.Pt = new ClipperLib.IntPoint0();
	};

	ClipperLib.MyIntersectNodeSort = function () {};

	ClipperLib.MyIntersectNodeSort.Compare = function (node1, node2)
	{
		var i = node2.Pt.Y - node1.Pt.Y;
		if (i > 0) return 1;
		else if (i < 0) return -1;
		else return 0;
	};

	/**
	* @constructor
	*/
	ClipperLib.LocalMinima = function ()
	{
		this.Y = 0;
		this.LeftBound = null;
		this.RightBound = null;
		this.Next = null;
	};

	/**
	* @constructor
	*/
	ClipperLib.Scanbeam = function ()
	{
		this.Y = 0;
		this.Next = null;
	};

	/**
	* @constructor
	*/
	ClipperLib.Maxima = function ()
	{
		this.X = 0;
		this.Next = null;
		this.Prev = null;
	};

	//OutRec: contains a path in the clipping solution. Edges in the AEL will
	//carry a pointer to an OutRec when they are part of the clipping solution.
	/**
	* @constructor
	*/
	ClipperLib.OutRec = function ()
	{
		this.Idx = 0;
		this.IsHole = false;
		this.IsOpen = false;
		this.FirstLeft = null; //see comments in clipper.pas
		this.Pts = null;
		this.BottomPt = null;
		this.PolyNode = null;
	};

	/**
	* @constructor
	*/
	ClipperLib.OutPt = function ()
	{
		this.Idx = 0;
		this.Pt = new ClipperLib.IntPoint0();
		this.Next = null;
		this.Prev = null;
	};

	/**
	* @constructor
	*/
	ClipperLib.Join = function ()
	{
		this.OutPt1 = null;
		this.OutPt2 = null;
		this.OffPt = new ClipperLib.IntPoint0();
	};

	ClipperLib.ClipperBase = function ()
	{
		this.m_MinimaList = null;
		this.m_CurrentLM = null;
		this.m_edges = new Array();
		this.m_UseFullRange = false;
		this.m_HasOpenPaths = false;
		this.PreserveCollinear = false;
		this.m_Scanbeam = null;
		this.m_PolyOuts = null;
		this.m_ActiveEdges = null;
	};

	// Ranges are in original C# too high for Javascript (in current state 2013 september):
	// protected const double horizontal = -3.4E+38;
	// internal const cInt loRange = 0x3FFFFFFF; // = 1073741823 = sqrt(2^63 -1)/2
	// internal const cInt hiRange = 0x3FFFFFFFFFFFFFFFL; // = 4611686018427387903 = sqrt(2^127 -1)/2
	// So had to adjust them to more suitable for Javascript.
	// If JS some day supports truly 64-bit integers, then these ranges can be as in C#
	// and biginteger library can be more simpler (as then 128bit can be represented as two 64bit numbers)
	ClipperLib.ClipperBase.horizontal = -9007199254740992; //-2^53
	ClipperLib.ClipperBase.Skip = -2;
	ClipperLib.ClipperBase.Unassigned = -1;
	ClipperLib.ClipperBase.tolerance = 1E-20;
	ClipperLib.ClipperBase.loRange = 47453132; // sqrt(2^53 -1)/2
	ClipperLib.ClipperBase.hiRange = 4503599627370495; // sqrt(2^106 -1)/2

	ClipperLib.ClipperBase.near_zero = function (val)
	{
		return (val > -ClipperLib.ClipperBase.tolerance) && (val < ClipperLib.ClipperBase.tolerance);
	};

	ClipperLib.ClipperBase.IsHorizontal = function (e)
	{
		return e.Delta.Y === 0;
	};

	ClipperLib.ClipperBase.prototype.PointIsVertex = function (pt, pp)
	{
		var pp2 = pp;
		do {
			if (ClipperLib.IntPoint.op_Equality(pp2.Pt, pt))
				return true;
			pp2 = pp2.Next;
		}
		while (pp2 !== pp)
		return false;
	};

	ClipperLib.ClipperBase.prototype.PointOnLineSegment = function (pt, linePt1, linePt2, UseFullRange)
	{
		if (UseFullRange)
			return ((pt.X === linePt1.X) && (pt.Y === linePt1.Y)) ||
				((pt.X === linePt2.X) && (pt.Y === linePt2.Y)) ||
				(((pt.X > linePt1.X) === (pt.X < linePt2.X)) &&
					((pt.Y > linePt1.Y) === (pt.Y < linePt2.Y)) &&
					(Int128.op_Equality(Int128.Int128Mul((pt.X - linePt1.X), (linePt2.Y - linePt1.Y)),
						Int128.Int128Mul((linePt2.X - linePt1.X), (pt.Y - linePt1.Y)))));
		else
			return ((pt.X === linePt1.X) && (pt.Y === linePt1.Y)) || ((pt.X === linePt2.X) && (pt.Y === linePt2.Y)) || (((pt.X > linePt1.X) === (pt.X < linePt2.X)) && ((pt.Y > linePt1.Y) === (pt.Y < linePt2.Y)) && ((pt.X - linePt1.X) * (linePt2.Y - linePt1.Y) === (linePt2.X - linePt1.X) * (pt.Y - linePt1.Y)));
	};

	ClipperLib.ClipperBase.prototype.PointOnPolygon = function (pt, pp, UseFullRange)
	{
		var pp2 = pp;
		while (true)
		{
			if (this.PointOnLineSegment(pt, pp2.Pt, pp2.Next.Pt, UseFullRange))
				return true;
			pp2 = pp2.Next;
			if (pp2 === pp)
				break;
		}
		return false;
	};

	ClipperLib.ClipperBase.prototype.SlopesEqual = ClipperLib.ClipperBase.SlopesEqual = function ()
	{
		var a = arguments,
			alen = a.length;
		var e1, e2, pt1, pt2, pt3, pt4, UseFullRange;
		if (alen === 3) // function (e1, e2, UseFullRange)
		{
			e1 = a[0];
			e2 = a[1];
			UseFullRange = a[2];
			if (UseFullRange)
				return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
			else
				return ClipperLib.Cast_Int64((e1.Delta.Y) * (e2.Delta.X)) === ClipperLib.Cast_Int64((e1.Delta.X) * (e2.Delta.Y));
		}
		else if (alen === 4) // function (pt1, pt2, pt3, UseFullRange)
		{
			pt1 = a[0];
			pt2 = a[1];
			pt3 = a[2];
			UseFullRange = a[3];
			if (UseFullRange)
				return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
			else
				return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
		}
		else // function (pt1, pt2, pt3, pt4, UseFullRange)
		{
			pt1 = a[0];
			pt2 = a[1];
			pt3 = a[2];
			pt4 = a[3];
			UseFullRange = a[4];
			if (UseFullRange)
				return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
			else
				return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
		}
	};

	ClipperLib.ClipperBase.SlopesEqual3 = function (e1, e2, UseFullRange)
	{
		if (UseFullRange)
			return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
		else
			return ClipperLib.Cast_Int64((e1.Delta.Y) * (e2.Delta.X)) === ClipperLib.Cast_Int64((e1.Delta.X) * (e2.Delta.Y));
	};

	ClipperLib.ClipperBase.SlopesEqual4 = function (pt1, pt2, pt3, UseFullRange)
	{
		if (UseFullRange)
			return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
		else
			return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
	};

	ClipperLib.ClipperBase.SlopesEqual5 = function (pt1, pt2, pt3, pt4, UseFullRange)
	{
		if (UseFullRange)
			return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
		else
			return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
	};

	ClipperLib.ClipperBase.prototype.Clear = function ()
	{
		this.DisposeLocalMinimaList();
		for (var i = 0, ilen = this.m_edges.length; i < ilen; ++i)
		{
			for (var j = 0, jlen = this.m_edges[i].length; j < jlen; ++j)
				this.m_edges[i][j] = null;
			ClipperLib.Clear(this.m_edges[i]);
		}
		ClipperLib.Clear(this.m_edges);
		this.m_UseFullRange = false;
		this.m_HasOpenPaths = false;
	};

	ClipperLib.ClipperBase.prototype.DisposeLocalMinimaList = function ()
	{
		while (this.m_MinimaList !== null)
		{
			var tmpLm = this.m_MinimaList.Next;
			this.m_MinimaList = null;
			this.m_MinimaList = tmpLm;
		}
		this.m_CurrentLM = null;
	};

	ClipperLib.ClipperBase.prototype.RangeTest = function (Pt, useFullRange)
	{
		if (useFullRange.Value)
		{
			if (Pt.X > ClipperLib.ClipperBase.hiRange || Pt.Y > ClipperLib.ClipperBase.hiRange || -Pt.X > ClipperLib.ClipperBase.hiRange || -Pt.Y > ClipperLib.ClipperBase.hiRange)
				ClipperLib.Error("Coordinate outside allowed range in RangeTest().");
		}
		else if (Pt.X > ClipperLib.ClipperBase.loRange || Pt.Y > ClipperLib.ClipperBase.loRange || -Pt.X > ClipperLib.ClipperBase.loRange || -Pt.Y > ClipperLib.ClipperBase.loRange)
		{
			useFullRange.Value = true;
			this.RangeTest(Pt, useFullRange);
		}
	};

	ClipperLib.ClipperBase.prototype.InitEdge = function (e, eNext, ePrev, pt)
	{
		e.Next = eNext;
		e.Prev = ePrev;
		//e.Curr = pt;
		e.Curr.X = pt.X;
		e.Curr.Y = pt.Y;
		if (ClipperLib.use_xyz) e.Curr.Z = pt.Z;
		e.OutIdx = -1;
	};

	ClipperLib.ClipperBase.prototype.InitEdge2 = function (e, polyType)
	{
		if (e.Curr.Y >= e.Next.Curr.Y)
		{
			//e.Bot = e.Curr;
			e.Bot.X = e.Curr.X;
			e.Bot.Y = e.Curr.Y;
			if (ClipperLib.use_xyz) e.Bot.Z = e.Curr.Z;
			//e.Top = e.Next.Curr;
			e.Top.X = e.Next.Curr.X;
			e.Top.Y = e.Next.Curr.Y;
			if (ClipperLib.use_xyz) e.Top.Z = e.Next.Curr.Z;
		}
		else
		{
			//e.Top = e.Curr;
			e.Top.X = e.Curr.X;
			e.Top.Y = e.Curr.Y;
			if (ClipperLib.use_xyz) e.Top.Z = e.Curr.Z;
			//e.Bot = e.Next.Curr;
			e.Bot.X = e.Next.Curr.X;
			e.Bot.Y = e.Next.Curr.Y;
			if (ClipperLib.use_xyz) e.Bot.Z = e.Next.Curr.Z;
		}
		this.SetDx(e);
		e.PolyTyp = polyType;
	};

	ClipperLib.ClipperBase.prototype.FindNextLocMin = function (E)
	{
		var E2;
		for (;;)
		{
			while (ClipperLib.IntPoint.op_Inequality(E.Bot, E.Prev.Bot) || ClipperLib.IntPoint.op_Equality(E.Curr, E.Top))
				E = E.Next;
			if (E.Dx !== ClipperLib.ClipperBase.horizontal && E.Prev.Dx !== ClipperLib.ClipperBase.horizontal)
				break;
			while (E.Prev.Dx === ClipperLib.ClipperBase.horizontal)
				E = E.Prev;
			E2 = E;
			while (E.Dx === ClipperLib.ClipperBase.horizontal)
				E = E.Next;
			if (E.Top.Y === E.Prev.Bot.Y)
				continue;
			//ie just an intermediate horz.
			if (E2.Prev.Bot.X < E.Bot.X)
				E = E2;
			break;
		}
		return E;
	};

	ClipperLib.ClipperBase.prototype.ProcessBound = function (E, LeftBoundIsForward)
	{
		var EStart;
		var Result = E;
		var Horz;

		if (Result.OutIdx === ClipperLib.ClipperBase.Skip)
		{
			//check if there are edges beyond the skip edge in the bound and if so
			//create another LocMin and calling ProcessBound once more ...
			E = Result;
			if (LeftBoundIsForward)
			{
				while (E.Top.Y === E.Next.Bot.Y) E = E.Next;
				while (E !== Result && E.Dx === ClipperLib.ClipperBase.horizontal) E = E.Prev;
			}
			else
			{
				while (E.Top.Y === E.Prev.Bot.Y) E = E.Prev;
				while (E !== Result && E.Dx === ClipperLib.ClipperBase.horizontal) E = E.Next;
			}
			if (E === Result)
			{
				if (LeftBoundIsForward) Result = E.Next;
				else Result = E.Prev;
			}
			else
			{
				//there are more edges in the bound beyond result starting with E
				if (LeftBoundIsForward)
					E = Result.Next;
				else
					E = Result.Prev;
				var locMin = new ClipperLib.LocalMinima();
				locMin.Next = null;
				locMin.Y = E.Bot.Y;
				locMin.LeftBound = null;
				locMin.RightBound = E;
				E.WindDelta = 0;
				Result = this.ProcessBound(E, LeftBoundIsForward);
				this.InsertLocalMinima(locMin);
			}
			return Result;
		}

		if (E.Dx === ClipperLib.ClipperBase.horizontal)
		{
			//We need to be careful with open paths because this may not be a
			//true local minima (ie E may be following a skip edge).
			//Also, consecutive horz. edges may start heading left before going right.
			if (LeftBoundIsForward) EStart = E.Prev;
			else EStart = E.Next;

			if (EStart.Dx === ClipperLib.ClipperBase.horizontal) //ie an adjoining horizontal skip edge
			{
				if (EStart.Bot.X !== E.Bot.X && EStart.Top.X !== E.Bot.X)
					this.ReverseHorizontal(E);
			}
			else if (EStart.Bot.X !== E.Bot.X)
				this.ReverseHorizontal(E);
		}

		EStart = E;
		if (LeftBoundIsForward)
		{
			while (Result.Top.Y === Result.Next.Bot.Y && Result.Next.OutIdx !== ClipperLib.ClipperBase.Skip)
				Result = Result.Next;
			if (Result.Dx === ClipperLib.ClipperBase.horizontal && Result.Next.OutIdx !== ClipperLib.ClipperBase.Skip)
			{
				//nb: at the top of a bound, horizontals are added to the bound
				//only when the preceding edge attaches to the horizontal's left vertex
				//unless a Skip edge is encountered when that becomes the top divide
				Horz = Result;
				while (Horz.Prev.Dx === ClipperLib.ClipperBase.horizontal)
					Horz = Horz.Prev;
				if (Horz.Prev.Top.X > Result.Next.Top.X)
					Result = Horz.Prev;
			}
			while (E !== Result)
			{
				E.NextInLML = E.Next;
				if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X)
					this.ReverseHorizontal(E);
				E = E.Next;
			}
			if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Prev.Top.X)
				this.ReverseHorizontal(E);
			Result = Result.Next;
			//move to the edge just beyond current bound
		}
		else
		{
			while (Result.Top.Y === Result.Prev.Bot.Y && Result.Prev.OutIdx !== ClipperLib.ClipperBase.Skip)
				Result = Result.Prev;
			if (Result.Dx === ClipperLib.ClipperBase.horizontal && Result.Prev.OutIdx !== ClipperLib.ClipperBase.Skip)
			{
				Horz = Result;
				while (Horz.Next.Dx === ClipperLib.ClipperBase.horizontal)
					Horz = Horz.Next;
				if (Horz.Next.Top.X === Result.Prev.Top.X || Horz.Next.Top.X > Result.Prev.Top.X)
				{
					Result = Horz.Next;
				}
			}
			while (E !== Result)
			{
				E.NextInLML = E.Prev;
				if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X)
					this.ReverseHorizontal(E);
				E = E.Prev;
			}
			if (E.Dx === ClipperLib.ClipperBase.horizontal && E !== EStart && E.Bot.X !== E.Next.Top.X)
				this.ReverseHorizontal(E);
			Result = Result.Prev;
			//move to the edge just beyond current bound
		}

		return Result;
	};

	ClipperLib.ClipperBase.prototype.AddPath = function (pg, polyType, Closed)
	{
		if (ClipperLib.use_lines)
		{
			if (!Closed && polyType === ClipperLib.PolyType.ptClip)
				ClipperLib.Error("AddPath: Open paths must be subject.");
		}
		else
		{
			if (!Closed)
				ClipperLib.Error("AddPath: Open paths have been disabled.");
		}
		var highI = pg.length - 1;
		if (Closed)
			while (highI > 0 && (ClipperLib.IntPoint.op_Equality(pg[highI], pg[0])))
				--highI;
		while (highI > 0 && (ClipperLib.IntPoint.op_Equality(pg[highI], pg[highI - 1])))
			--highI;
		if ((Closed && highI < 2) || (!Closed && highI < 1))
			return false;
		//create a new edge array ...
		var edges = new Array();
		for (var i = 0; i <= highI; i++)
			edges.push(new ClipperLib.TEdge());
		var IsFlat = true;
		//1. Basic (first) edge initialization ...

		//edges[1].Curr = pg[1];
		edges[1].Curr.X = pg[1].X;
		edges[1].Curr.Y = pg[1].Y;
		if (ClipperLib.use_xyz) edges[1].Curr.Z = pg[1].Z;

		var $1 = {
			Value: this.m_UseFullRange
		};

		this.RangeTest(pg[0], $1);
		this.m_UseFullRange = $1.Value;

		$1.Value = this.m_UseFullRange;
		this.RangeTest(pg[highI], $1);
		this.m_UseFullRange = $1.Value;

		this.InitEdge(edges[0], edges[1], edges[highI], pg[0]);
		this.InitEdge(edges[highI], edges[0], edges[highI - 1], pg[highI]);
		for (var i = highI - 1; i >= 1; --i)
		{
			$1.Value = this.m_UseFullRange;
			this.RangeTest(pg[i], $1);
			this.m_UseFullRange = $1.Value;

			this.InitEdge(edges[i], edges[i + 1], edges[i - 1], pg[i]);
		}

		var eStart = edges[0];
		//2. Remove duplicate vertices, and (when closed) collinear edges ...
		var E = eStart,
			eLoopStop = eStart;
		for (;;)
		{
			//console.log(E.Next, eStart);
			//nb: allows matching start and end points when not Closed ...
			if (E.Curr === E.Next.Curr && (Closed || E.Next !== eStart))
			{
				if (E === E.Next)
					break;
				if (E === eStart)
					eStart = E.Next;
				E = this.RemoveEdge(E);
				eLoopStop = E;
				continue;
			}
			if (E.Prev === E.Next)
				break;
			else if (Closed && ClipperLib.ClipperBase.SlopesEqual4(E.Prev.Curr, E.Curr, E.Next.Curr, this.m_UseFullRange) && (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(E.Prev.Curr, E.Curr, E.Next.Curr)))
			{
				//Collinear edges are allowed for open paths but in closed paths
				//the default is to merge adjacent collinear edges into a single edge.
				//However, if the PreserveCollinear property is enabled, only overlapping
				//collinear edges (ie spikes) will be removed from closed paths.
				if (E === eStart)
					eStart = E.Next;
				E = this.RemoveEdge(E);
				E = E.Prev;
				eLoopStop = E;
				continue;
			}
			E = E.Next;
			if ((E === eLoopStop) || (!Closed && E.Next === eStart)) break;
		}
		if ((!Closed && (E === E.Next)) || (Closed && (E.Prev === E.Next)))
			return false;
		if (!Closed)
		{
			this.m_HasOpenPaths = true;
			eStart.Prev.OutIdx = ClipperLib.ClipperBase.Skip;
		}
		//3. Do second stage of edge initialization ...
		E = eStart;
		do {
			this.InitEdge2(E, polyType);
			E = E.Next;
			if (IsFlat && E.Curr.Y !== eStart.Curr.Y)
				IsFlat = false;
		}
		while (E !== eStart)
		//4. Finally, add edge bounds to LocalMinima list ...
		//Totally flat paths must be handled differently when adding them
		//to LocalMinima list to avoid endless loops etc ...
		if (IsFlat)
		{
			if (Closed)
				return false;

			E.Prev.OutIdx = ClipperLib.ClipperBase.Skip;

			var locMin = new ClipperLib.LocalMinima();
			locMin.Next = null;
			locMin.Y = E.Bot.Y;
			locMin.LeftBound = null;
			locMin.RightBound = E;
			locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
			locMin.RightBound.WindDelta = 0;

			for (;;)
			{
				if (E.Bot.X !== E.Prev.Top.X) this.ReverseHorizontal(E);
				if (E.Next.OutIdx === ClipperLib.ClipperBase.Skip) break;
				E.NextInLML = E.Next;
				E = E.Next;
			}
			this.InsertLocalMinima(locMin);
			this.m_edges.push(edges);
			return true;
		}
		this.m_edges.push(edges);
		var leftBoundIsForward;
		var EMin = null;

		//workaround to avoid an endless loop in the while loop below when
		//open paths have matching start and end points ...
		if (ClipperLib.IntPoint.op_Equality(E.Prev.Bot, E.Prev.Top))
			E = E.Next;

		for (;;)
		{
			E = this.FindNextLocMin(E);
			if (E === EMin)
				break;
			else if (EMin === null)
				EMin = E;
			//E and E.Prev now share a local minima (left aligned if horizontal).
			//Compare their slopes to find which starts which bound ...
			var locMin = new ClipperLib.LocalMinima();
			locMin.Next = null;
			locMin.Y = E.Bot.Y;
			if (E.Dx < E.Prev.Dx)
			{
				locMin.LeftBound = E.Prev;
				locMin.RightBound = E;
				leftBoundIsForward = false;
				//Q.nextInLML = Q.prev
			}
			else
			{
				locMin.LeftBound = E;
				locMin.RightBound = E.Prev;
				leftBoundIsForward = true;
				//Q.nextInLML = Q.next
			}
			locMin.LeftBound.Side = ClipperLib.EdgeSide.esLeft;
			locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
			if (!Closed)
				locMin.LeftBound.WindDelta = 0;
			else if (locMin.LeftBound.Next === locMin.RightBound)
				locMin.LeftBound.WindDelta = -1;
			else
				locMin.LeftBound.WindDelta = 1;
			locMin.RightBound.WindDelta = -locMin.LeftBound.WindDelta;
			E = this.ProcessBound(locMin.LeftBound, leftBoundIsForward);
			if (E.OutIdx === ClipperLib.ClipperBase.Skip)
				E = this.ProcessBound(E, leftBoundIsForward);
			var E2 = this.ProcessBound(locMin.RightBound, !leftBoundIsForward);
			if (E2.OutIdx === ClipperLib.ClipperBase.Skip) E2 = this.ProcessBound(E2, !leftBoundIsForward);
			if (locMin.LeftBound.OutIdx === ClipperLib.ClipperBase.Skip)
				locMin.LeftBound = null;
			else if (locMin.RightBound.OutIdx === ClipperLib.ClipperBase.Skip)
				locMin.RightBound = null;
			this.InsertLocalMinima(locMin);
			if (!leftBoundIsForward)
				E = E2;
		}
		return true;
	};

	ClipperLib.ClipperBase.prototype.AddPaths = function (ppg, polyType, closed)
	{
		//  console.log("-------------------------------------------");
		//  console.log(JSON.stringify(ppg));
		var result = false;
		for (var i = 0, ilen = ppg.length; i < ilen; ++i)
			if (this.AddPath(ppg[i], polyType, closed))
				result = true;
		return result;
	};

	ClipperLib.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function (pt1, pt2, pt3)
	{
		if ((ClipperLib.IntPoint.op_Equality(pt1, pt3)) || (ClipperLib.IntPoint.op_Equality(pt1, pt2)) || (ClipperLib.IntPoint.op_Equality(pt3, pt2)))

			//if ((pt1 == pt3) || (pt1 == pt2) || (pt3 == pt2))
			return false;

		else if (pt1.X !== pt3.X)
			return (pt2.X > pt1.X) === (pt2.X < pt3.X);
		else
			return (pt2.Y > pt1.Y) === (pt2.Y < pt3.Y);
	};

	ClipperLib.ClipperBase.prototype.RemoveEdge = function (e)
	{
		//removes e from double_linked_list (but without removing from memory)
		e.Prev.Next = e.Next;
		e.Next.Prev = e.Prev;
		var result = e.Next;
		e.Prev = null; //flag as removed (see ClipperBase.Clear)
		return result;
	};

	ClipperLib.ClipperBase.prototype.SetDx = function (e)
	{
		e.Delta.X = (e.Top.X - e.Bot.X);
		e.Delta.Y = (e.Top.Y - e.Bot.Y);
		if (e.Delta.Y === 0) e.Dx = ClipperLib.ClipperBase.horizontal;
		else e.Dx = (e.Delta.X) / (e.Delta.Y);
	};

	ClipperLib.ClipperBase.prototype.InsertLocalMinima = function (newLm)
	{
		if (this.m_MinimaList === null)
		{
			this.m_MinimaList = newLm;
		}
		else if (newLm.Y >= this.m_MinimaList.Y)
		{
			newLm.Next = this.m_MinimaList;
			this.m_MinimaList = newLm;
		}
		else
		{
			var tmpLm = this.m_MinimaList;
			while (tmpLm.Next !== null && (newLm.Y < tmpLm.Next.Y))
				tmpLm = tmpLm.Next;
			newLm.Next = tmpLm.Next;
			tmpLm.Next = newLm;
		}
	};

	ClipperLib.ClipperBase.prototype.PopLocalMinima = function (Y, current)
	{
		current.v = this.m_CurrentLM;
		if (this.m_CurrentLM !== null && this.m_CurrentLM.Y === Y)
		{
			this.m_CurrentLM = this.m_CurrentLM.Next;
			return true;
		}
		return false;
	};

	ClipperLib.ClipperBase.prototype.ReverseHorizontal = function (e)
	{
		//swap horizontal edges' top and bottom x's so they follow the natural
		//progression of the bounds - ie so their xbots will align with the
		//adjoining lower edge. [Helpful in the ProcessHorizontal() method.]
		var tmp = e.Top.X;
		e.Top.X = e.Bot.X;
		e.Bot.X = tmp;
		if (ClipperLib.use_xyz)
		{
			tmp = e.Top.Z;
			e.Top.Z = e.Bot.Z;
			e.Bot.Z = tmp;
		}
	};

	ClipperLib.ClipperBase.prototype.Reset = function ()
	{
		this.m_CurrentLM = this.m_MinimaList;
		if (this.m_CurrentLM === null) //ie nothing to process
			return;
		//reset all edges ...
		this.m_Scanbeam = null;
		var lm = this.m_MinimaList;
		while (lm !== null)
		{
			this.InsertScanbeam(lm.Y);
			var e = lm.LeftBound;
			if (e !== null)
			{
				//e.Curr = e.Bot;
				e.Curr.X = e.Bot.X;
				e.Curr.Y = e.Bot.Y;
				if (ClipperLib.use_xyz) e.Curr.Z = e.Bot.Z;
				e.OutIdx = ClipperLib.ClipperBase.Unassigned;
			}
			e = lm.RightBound;
			if (e !== null)
			{
				//e.Curr = e.Bot;
				e.Curr.X = e.Bot.X;
				e.Curr.Y = e.Bot.Y;
				if (ClipperLib.use_xyz) e.Curr.Z = e.Bot.Z;
				e.OutIdx = ClipperLib.ClipperBase.Unassigned;
			}
			lm = lm.Next;
		}
		this.m_ActiveEdges = null;
	};

	ClipperLib.ClipperBase.prototype.InsertScanbeam = function (Y)
	{
		//single-linked list: sorted descending, ignoring dups.
		if (this.m_Scanbeam === null)
		{
			this.m_Scanbeam = new ClipperLib.Scanbeam();
			this.m_Scanbeam.Next = null;
			this.m_Scanbeam.Y = Y;
		}
		else if (Y > this.m_Scanbeam.Y)
		{
			var newSb = new ClipperLib.Scanbeam();
			newSb.Y = Y;
			newSb.Next = this.m_Scanbeam;
			this.m_Scanbeam = newSb;
		}
		else
		{
			var sb2 = this.m_Scanbeam;
			while (sb2.Next !== null && Y <= sb2.Next.Y)
			{
				sb2 = sb2.Next;
			}
			if (Y === sb2.Y)
			{
				return;
			} //ie ignores duplicates
			var newSb1 = new ClipperLib.Scanbeam();
			newSb1.Y = Y;
			newSb1.Next = sb2.Next;
			sb2.Next = newSb1;
		}
	};

	ClipperLib.ClipperBase.prototype.PopScanbeam = function (Y)
	{
		if (this.m_Scanbeam === null)
		{
			Y.v = 0;
			return false;
		}
		Y.v = this.m_Scanbeam.Y;
		this.m_Scanbeam = this.m_Scanbeam.Next;
		return true;
	};

	ClipperLib.ClipperBase.prototype.LocalMinimaPending = function ()
	{
		return (this.m_CurrentLM !== null);
	};

	ClipperLib.ClipperBase.prototype.CreateOutRec = function ()
	{
		var result = new ClipperLib.OutRec();
		result.Idx = ClipperLib.ClipperBase.Unassigned;
		result.IsHole = false;
		result.IsOpen = false;
		result.FirstLeft = null;
		result.Pts = null;
		result.BottomPt = null;
		result.PolyNode = null;
		this.m_PolyOuts.push(result);
		result.Idx = this.m_PolyOuts.length - 1;
		return result;
	};

	ClipperLib.ClipperBase.prototype.DisposeOutRec = function (index)
	{
		var outRec = this.m_PolyOuts[index];
		outRec.Pts = null;
		outRec = null;
		this.m_PolyOuts[index] = null;
	};

	ClipperLib.ClipperBase.prototype.UpdateEdgeIntoAEL = function (e)
	{
		if (e.NextInLML === null)
		{
			ClipperLib.Error("UpdateEdgeIntoAEL: invalid call");
		}
		var AelPrev = e.PrevInAEL;
		var AelNext = e.NextInAEL;
		e.NextInLML.OutIdx = e.OutIdx;
		if (AelPrev !== null)
		{
			AelPrev.NextInAEL = e.NextInLML;
		}
		else
		{
			this.m_ActiveEdges = e.NextInLML;
		}
		if (AelNext !== null)
		{
			AelNext.PrevInAEL = e.NextInLML;
		}
		e.NextInLML.Side = e.Side;
		e.NextInLML.WindDelta = e.WindDelta;
		e.NextInLML.WindCnt = e.WindCnt;
		e.NextInLML.WindCnt2 = e.WindCnt2;
		e = e.NextInLML;
		e.Curr.X = e.Bot.X;
		e.Curr.Y = e.Bot.Y;
		e.PrevInAEL = AelPrev;
		e.NextInAEL = AelNext;
		if (!ClipperLib.ClipperBase.IsHorizontal(e))
		{
			this.InsertScanbeam(e.Top.Y);
		}
		return e;
	};

	ClipperLib.ClipperBase.prototype.SwapPositionsInAEL = function (edge1, edge2)
	{
		//check that one or other edge hasn't already been removed from AEL ...
		if (edge1.NextInAEL === edge1.PrevInAEL || edge2.NextInAEL === edge2.PrevInAEL)
		{
			return;
		}

		if (edge1.NextInAEL === edge2)
		{
			var next = edge2.NextInAEL;
			if (next !== null)
			{
				next.PrevInAEL = edge1;
			}
			var prev = edge1.PrevInAEL;
			if (prev !== null)
			{
				prev.NextInAEL = edge2;
			}
			edge2.PrevInAEL = prev;
			edge2.NextInAEL = edge1;
			edge1.PrevInAEL = edge2;
			edge1.NextInAEL = next;
		}
		else if (edge2.NextInAEL === edge1)
		{
			var next1 = edge1.NextInAEL;
			if (next1 !== null)
			{
				next1.PrevInAEL = edge2;
			}
			var prev1 = edge2.PrevInAEL;
			if (prev1 !== null)
			{
				prev1.NextInAEL = edge1;
			}
			edge1.PrevInAEL = prev1;
			edge1.NextInAEL = edge2;
			edge2.PrevInAEL = edge1;
			edge2.NextInAEL = next1;
		}
		else
		{
			var next2 = edge1.NextInAEL;
			var prev2 = edge1.PrevInAEL;
			edge1.NextInAEL = edge2.NextInAEL;
			if (edge1.NextInAEL !== null)
			{
				edge1.NextInAEL.PrevInAEL = edge1;
			}
			edge1.PrevInAEL = edge2.PrevInAEL;
			if (edge1.PrevInAEL !== null)
			{
				edge1.PrevInAEL.NextInAEL = edge1;
			}
			edge2.NextInAEL = next2;
			if (edge2.NextInAEL !== null)
			{
				edge2.NextInAEL.PrevInAEL = edge2;
			}
			edge2.PrevInAEL = prev2;
			if (edge2.PrevInAEL !== null)
			{
				edge2.PrevInAEL.NextInAEL = edge2;
			}
		}

		if (edge1.PrevInAEL === null)
		{
			this.m_ActiveEdges = edge1;
		}
		else
		{
			if (edge2.PrevInAEL === null)
			{
				this.m_ActiveEdges = edge2;
			}
		}
	};

	ClipperLib.ClipperBase.prototype.DeleteFromAEL = function (e)
	{
		var AelPrev = e.PrevInAEL;
		var AelNext = e.NextInAEL;
		if (AelPrev === null && AelNext === null && e !== this.m_ActiveEdges)
		{
			return;
		} //already deleted
		if (AelPrev !== null)
		{
			AelPrev.NextInAEL = AelNext;
		}
		else
		{
			this.m_ActiveEdges = AelNext;
		}
		if (AelNext !== null)
		{
			AelNext.PrevInAEL = AelPrev;
		}
		e.NextInAEL = null;
		e.PrevInAEL = null;
	}

	// public Clipper(int InitOptions = 0)
	/**
	 * @suppress {missingProperties}
	 */
	ClipperLib.Clipper = function (InitOptions)
	{
		if (typeof (InitOptions) === "undefined") InitOptions = 0;
		this.m_PolyOuts = null;
		this.m_ClipType = ClipperLib.ClipType.ctIntersection;
		this.m_Scanbeam = null;
		this.m_Maxima = null;
		this.m_ActiveEdges = null;
		this.m_SortedEdges = null;
		this.m_IntersectList = null;
		this.m_IntersectNodeComparer = null;
		this.m_ExecuteLocked = false;
		this.m_ClipFillType = ClipperLib.PolyFillType.pftEvenOdd;
		this.m_SubjFillType = ClipperLib.PolyFillType.pftEvenOdd;
		this.m_Joins = null;
		this.m_GhostJoins = null;
		this.m_UsingPolyTree = false;
		this.ReverseSolution = false;
		this.StrictlySimple = false;

		ClipperLib.ClipperBase.call(this);

		this.m_Scanbeam = null;
		this.m_Maxima = null;
		this.m_ActiveEdges = null;
		this.m_SortedEdges = null;
		this.m_IntersectList = new Array();
		this.m_IntersectNodeComparer = ClipperLib.MyIntersectNodeSort.Compare;
		this.m_ExecuteLocked = false;
		this.m_UsingPolyTree = false;
		this.m_PolyOuts = new Array();
		this.m_Joins = new Array();
		this.m_GhostJoins = new Array();
		this.ReverseSolution = (1 & InitOptions) !== 0;
		this.StrictlySimple = (2 & InitOptions) !== 0;
		this.PreserveCollinear = (4 & InitOptions) !== 0;
		if (ClipperLib.use_xyz)
		{
			this.ZFillFunction = null; // function (IntPoint vert1, IntPoint vert2, ref IntPoint intersectPt);
		}
	};

	ClipperLib.Clipper.ioReverseSolution = 1;
	ClipperLib.Clipper.ioStrictlySimple = 2;
	ClipperLib.Clipper.ioPreserveCollinear = 4;

	ClipperLib.Clipper.prototype.Clear = function ()
	{
		if (this.m_edges.length === 0)
			return;
		//avoids problems with ClipperBase destructor
		this.DisposeAllPolyPts();
		ClipperLib.ClipperBase.prototype.Clear.call(this);
	};

	ClipperLib.Clipper.prototype.InsertMaxima = function (X)
	{
		//double-linked list: sorted ascending, ignoring dups.
		var newMax = new ClipperLib.Maxima();
		newMax.X = X;
		if (this.m_Maxima === null)
		{
			this.m_Maxima = newMax;
			this.m_Maxima.Next = null;
			this.m_Maxima.Prev = null;
		}
		else if (X < this.m_Maxima.X)
		{
			newMax.Next = this.m_Maxima;
			newMax.Prev = null;
			this.m_Maxima = newMax;
		}
		else
		{
			var m = this.m_Maxima;
			while (m.Next !== null && X >= m.Next.X)
			{
				m = m.Next;
			}
			if (X === m.X)
			{
				return;
			} //ie ignores duplicates (& CG to clean up newMax)
			//insert newMax between m and m.Next ...
			newMax.Next = m.Next;
			newMax.Prev = m;
			if (m.Next !== null)
			{
				m.Next.Prev = newMax;
			}
			m.Next = newMax;
		}
	};

	// ************************************
	ClipperLib.Clipper.prototype.Execute = function ()
	{
		var a = arguments,
			alen = a.length,
			ispolytree = a[1] instanceof ClipperLib.PolyTree;
		if (alen === 4 && !ispolytree) // function (clipType, solution, subjFillType, clipFillType)
		{
			var clipType = a[0],
				solution = a[1],
				subjFillType = a[2],
				clipFillType = a[3];
			if (this.m_ExecuteLocked)
				return false;
			if (this.m_HasOpenPaths)
				ClipperLib.Error("Error: PolyTree struct is needed for open path clipping.");
			this.m_ExecuteLocked = true;
			ClipperLib.Clear(solution);
			this.m_SubjFillType = subjFillType;
			this.m_ClipFillType = clipFillType;
			this.m_ClipType = clipType;
			this.m_UsingPolyTree = false;
			try
			{
				var succeeded = this.ExecuteInternal();
				//build the return polygons ...
				if (succeeded) this.BuildResult(solution);
			}
			finally
			{
				this.DisposeAllPolyPts();
				this.m_ExecuteLocked = false;
			}
			return succeeded;
		}
		else if (alen === 4 && ispolytree) // function (clipType, polytree, subjFillType, clipFillType)
		{
			var clipType = a[0],
				polytree = a[1],
				subjFillType = a[2],
				clipFillType = a[3];
			if (this.m_ExecuteLocked)
				return false;
			this.m_ExecuteLocked = true;
			this.m_SubjFillType = subjFillType;
			this.m_ClipFillType = clipFillType;
			this.m_ClipType = clipType;
			this.m_UsingPolyTree = true;
			try
			{
				var succeeded = this.ExecuteInternal();
				//build the return polygons ...
				if (succeeded) this.BuildResult2(polytree);
			}
			finally
			{
				this.DisposeAllPolyPts();
				this.m_ExecuteLocked = false;
			}
			return succeeded;
		}
		else if (alen === 2 && !ispolytree) // function (clipType, solution)
		{
			var clipType = a[0],
				solution = a[1];
			return this.Execute(clipType, solution, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
		}
		else if (alen === 2 && ispolytree) // function (clipType, polytree)
		{
			var clipType = a[0],
				polytree = a[1];
			return this.Execute(clipType, polytree, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
		}
	};

	ClipperLib.Clipper.prototype.FixHoleLinkage = function (outRec)
	{
		//skip if an outermost polygon or
		//already already points to the correct FirstLeft ...
		if (outRec.FirstLeft === null || (outRec.IsHole !== outRec.FirstLeft.IsHole && outRec.FirstLeft.Pts !== null))
			return;
		var orfl = outRec.FirstLeft;
		while (orfl !== null && ((orfl.IsHole === outRec.IsHole) || orfl.Pts === null))
			orfl = orfl.FirstLeft;
		outRec.FirstLeft = orfl;
	};

	ClipperLib.Clipper.prototype.ExecuteInternal = function ()
	{
		try
		{
			this.Reset();
			this.m_SortedEdges = null;
			this.m_Maxima = null;

			var botY = {},
				topY = {};

			if (!this.PopScanbeam(botY))
			{
				return false;
			}
			this.InsertLocalMinimaIntoAEL(botY.v);
			while (this.PopScanbeam(topY) || this.LocalMinimaPending())
			{
				this.ProcessHorizontals();
				this.m_GhostJoins.length = 0;
				if (!this.ProcessIntersections(topY.v))
				{
					return false;
				}
				this.ProcessEdgesAtTopOfScanbeam(topY.v);
				botY.v = topY.v;
				this.InsertLocalMinimaIntoAEL(botY.v);
			}

			//fix orientations ...
			var outRec, i, ilen;
			//fix orientations ...
			for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
			{
				outRec = this.m_PolyOuts[i];
				if (outRec.Pts === null || outRec.IsOpen) continue;
				if ((outRec.IsHole ^ this.ReverseSolution) == (this.Area$1(outRec) > 0))
					this.ReversePolyPtLinks(outRec.Pts);
			}

			this.JoinCommonEdges();

			for (i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
			{
				outRec = this.m_PolyOuts[i];
				if (outRec.Pts === null)
					continue;
				else if (outRec.IsOpen)
					this.FixupOutPolyline(outRec);
				else
					this.FixupOutPolygon(outRec);
			}

			if (this.StrictlySimple) this.DoSimplePolygons();
			return true;
		}
		//catch { return false; }
		finally
		{
			this.m_Joins.length = 0;
			this.m_GhostJoins.length = 0;
		}
	};

	ClipperLib.Clipper.prototype.DisposeAllPolyPts = function ()
	{
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; ++i)
			this.DisposeOutRec(i);
		ClipperLib.Clear(this.m_PolyOuts);
	};

	ClipperLib.Clipper.prototype.AddJoin = function (Op1, Op2, OffPt)
	{
		var j = new ClipperLib.Join();
		j.OutPt1 = Op1;
		j.OutPt2 = Op2;
		//j.OffPt = OffPt;
		j.OffPt.X = OffPt.X;
		j.OffPt.Y = OffPt.Y;
		if (ClipperLib.use_xyz) j.OffPt.Z = OffPt.Z;
		this.m_Joins.push(j);
	};

	ClipperLib.Clipper.prototype.AddGhostJoin = function (Op, OffPt)
	{
		var j = new ClipperLib.Join();
		j.OutPt1 = Op;
		//j.OffPt = OffPt;
		j.OffPt.X = OffPt.X;
		j.OffPt.Y = OffPt.Y;
		if (ClipperLib.use_xyz) j.OffPt.Z = OffPt.Z;
		this.m_GhostJoins.push(j);
	};

	//if (ClipperLib.use_xyz)
	//{
	ClipperLib.Clipper.prototype.SetZ = function (pt, e1, e2)
	{
		if (this.ZFillFunction !== null)
		{
			if (pt.Z !== 0 || this.ZFillFunction === null) return;
			else if (ClipperLib.IntPoint.op_Equality(pt, e1.Bot)) pt.Z = e1.Bot.Z;
			else if (ClipperLib.IntPoint.op_Equality(pt, e1.Top)) pt.Z = e1.Top.Z;
			else if (ClipperLib.IntPoint.op_Equality(pt, e2.Bot)) pt.Z = e2.Bot.Z;
			else if (ClipperLib.IntPoint.op_Equality(pt, e2.Top)) pt.Z = e2.Top.Z;
			else this.ZFillFunction(e1.Bot, e1.Top, e2.Bot, e2.Top, pt);
		}
	};
	//}

	ClipperLib.Clipper.prototype.InsertLocalMinimaIntoAEL = function (botY)
	{
		var lm = {};

		var lb;
		var rb;
		while (this.PopLocalMinima(botY, lm))
		{
			lb = lm.v.LeftBound;
			rb = lm.v.RightBound;

			var Op1 = null;
			if (lb === null)
			{
				this.InsertEdgeIntoAEL(rb, null);
				this.SetWindingCount(rb);
				if (this.IsContributing(rb))
					Op1 = this.AddOutPt(rb, rb.Bot);
			}
			else if (rb === null)
			{
				this.InsertEdgeIntoAEL(lb, null);
				this.SetWindingCount(lb);
				if (this.IsContributing(lb))
					Op1 = this.AddOutPt(lb, lb.Bot);
				this.InsertScanbeam(lb.Top.Y);
			}
			else
			{
				this.InsertEdgeIntoAEL(lb, null);
				this.InsertEdgeIntoAEL(rb, lb);
				this.SetWindingCount(lb);
				rb.WindCnt = lb.WindCnt;
				rb.WindCnt2 = lb.WindCnt2;
				if (this.IsContributing(lb))
					Op1 = this.AddLocalMinPoly(lb, rb, lb.Bot);
				this.InsertScanbeam(lb.Top.Y);
			}
			if (rb !== null)
			{
				if (ClipperLib.ClipperBase.IsHorizontal(rb))
				{
					if (rb.NextInLML !== null)
					{
						this.InsertScanbeam(rb.NextInLML.Top.Y);
					}
					this.AddEdgeToSEL(rb);
				}
				else
				{
					this.InsertScanbeam(rb.Top.Y);
				}
			}
			if (lb === null || rb === null) continue;
			//if output polygons share an Edge with a horizontal rb, they'll need joining later ...
			if (Op1 !== null && ClipperLib.ClipperBase.IsHorizontal(rb) && this.m_GhostJoins.length > 0 && rb.WindDelta !== 0)
			{
				for (var i = 0, ilen = this.m_GhostJoins.length; i < ilen; i++)
				{
					//if the horizontal Rb and a 'ghost' horizontal overlap, then convert
					//the 'ghost' join to a real join ready for later ...
					var j = this.m_GhostJoins[i];

					if (this.HorzSegmentsOverlap(j.OutPt1.Pt.X, j.OffPt.X, rb.Bot.X, rb.Top.X))
						this.AddJoin(j.OutPt1, Op1, j.OffPt);
				}
			}

			if (lb.OutIdx >= 0 && lb.PrevInAEL !== null &&
				lb.PrevInAEL.Curr.X === lb.Bot.X &&
				lb.PrevInAEL.OutIdx >= 0 &&
				ClipperLib.ClipperBase.SlopesEqual5(lb.PrevInAEL.Curr, lb.PrevInAEL.Top, lb.Curr, lb.Top, this.m_UseFullRange) &&
				lb.WindDelta !== 0 && lb.PrevInAEL.WindDelta !== 0)
			{
				var Op2 = this.AddOutPt(lb.PrevInAEL, lb.Bot);
				this.AddJoin(Op1, Op2, lb.Top);
			}
			if (lb.NextInAEL !== rb)
			{
				if (rb.OutIdx >= 0 && rb.PrevInAEL.OutIdx >= 0 &&
					ClipperLib.ClipperBase.SlopesEqual5(rb.PrevInAEL.Curr, rb.PrevInAEL.Top, rb.Curr, rb.Top, this.m_UseFullRange) &&
					rb.WindDelta !== 0 && rb.PrevInAEL.WindDelta !== 0)
				{
					var Op2 = this.AddOutPt(rb.PrevInAEL, rb.Bot);
					this.AddJoin(Op1, Op2, rb.Top);
				}
				var e = lb.NextInAEL;
				if (e !== null)
					while (e !== rb)
					{
						//nb: For calculating winding counts etc, IntersectEdges() assumes
						//that param1 will be to the right of param2 ABOVE the intersection ...
						this.IntersectEdges(rb, e, lb.Curr);
						//order important here
						e = e.NextInAEL;
					}
			}
		}
	};

	ClipperLib.Clipper.prototype.InsertEdgeIntoAEL = function (edge, startEdge)
	{
		if (this.m_ActiveEdges === null)
		{
			edge.PrevInAEL = null;
			edge.NextInAEL = null;
			this.m_ActiveEdges = edge;
		}
		else if (startEdge === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, edge))
		{
			edge.PrevInAEL = null;
			edge.NextInAEL = this.m_ActiveEdges;
			this.m_ActiveEdges.PrevInAEL = edge;
			this.m_ActiveEdges = edge;
		}
		else
		{
			if (startEdge === null)
				startEdge = this.m_ActiveEdges;
			while (startEdge.NextInAEL !== null && !this.E2InsertsBeforeE1(startEdge.NextInAEL, edge))
				startEdge = startEdge.NextInAEL;
			edge.NextInAEL = startEdge.NextInAEL;
			if (startEdge.NextInAEL !== null)
				startEdge.NextInAEL.PrevInAEL = edge;
			edge.PrevInAEL = startEdge;
			startEdge.NextInAEL = edge;
		}
	};

	ClipperLib.Clipper.prototype.E2InsertsBeforeE1 = function (e1, e2)
	{
		if (e2.Curr.X === e1.Curr.X)
		{
			if (e2.Top.Y > e1.Top.Y)
				return e2.Top.X < ClipperLib.Clipper.TopX(e1, e2.Top.Y);
			else
				return e1.Top.X > ClipperLib.Clipper.TopX(e2, e1.Top.Y);
		}
		else
			return e2.Curr.X < e1.Curr.X;
	};

	ClipperLib.Clipper.prototype.IsEvenOddFillType = function (edge)
	{
		if (edge.PolyTyp === ClipperLib.PolyType.ptSubject)
			return this.m_SubjFillType === ClipperLib.PolyFillType.pftEvenOdd;
		else
			return this.m_ClipFillType === ClipperLib.PolyFillType.pftEvenOdd;
	};

	ClipperLib.Clipper.prototype.IsEvenOddAltFillType = function (edge)
	{
		if (edge.PolyTyp === ClipperLib.PolyType.ptSubject)
			return this.m_ClipFillType === ClipperLib.PolyFillType.pftEvenOdd;
		else
			return this.m_SubjFillType === ClipperLib.PolyFillType.pftEvenOdd;
	};

	ClipperLib.Clipper.prototype.IsContributing = function (edge)
	{
		var pft, pft2;
		if (edge.PolyTyp === ClipperLib.PolyType.ptSubject)
		{
			pft = this.m_SubjFillType;
			pft2 = this.m_ClipFillType;
		}
		else
		{
			pft = this.m_ClipFillType;
			pft2 = this.m_SubjFillType;
		}
		switch (pft)
		{
		case ClipperLib.PolyFillType.pftEvenOdd:
			if (edge.WindDelta === 0 && edge.WindCnt !== 1)
				return false;
			break;
		case ClipperLib.PolyFillType.pftNonZero:
			if (Math.abs(edge.WindCnt) !== 1)
				return false;
			break;
		case ClipperLib.PolyFillType.pftPositive:
			if (edge.WindCnt !== 1)
				return false;
			break;
		default:
			if (edge.WindCnt !== -1)
				return false;
			break;
		}
		switch (this.m_ClipType)
		{
		case ClipperLib.ClipType.ctIntersection:
			switch (pft2)
			{
			case ClipperLib.PolyFillType.pftEvenOdd:
			case ClipperLib.PolyFillType.pftNonZero:
				return (edge.WindCnt2 !== 0);
			case ClipperLib.PolyFillType.pftPositive:
				return (edge.WindCnt2 > 0);
			default:
				return (edge.WindCnt2 < 0);
			}
		case ClipperLib.ClipType.ctUnion:
			switch (pft2)
			{
			case ClipperLib.PolyFillType.pftEvenOdd:
			case ClipperLib.PolyFillType.pftNonZero:
				return (edge.WindCnt2 === 0);
			case ClipperLib.PolyFillType.pftPositive:
				return (edge.WindCnt2 <= 0);
			default:
				return (edge.WindCnt2 >= 0);
			}
		case ClipperLib.ClipType.ctDifference:
			if (edge.PolyTyp === ClipperLib.PolyType.ptSubject)
				switch (pft2)
				{
				case ClipperLib.PolyFillType.pftEvenOdd:
				case ClipperLib.PolyFillType.pftNonZero:
					return (edge.WindCnt2 === 0);
				case ClipperLib.PolyFillType.pftPositive:
					return (edge.WindCnt2 <= 0);
				default:
					return (edge.WindCnt2 >= 0);
				}
			else
				switch (pft2)
				{
				case ClipperLib.PolyFillType.pftEvenOdd:
				case ClipperLib.PolyFillType.pftNonZero:
					return (edge.WindCnt2 !== 0);
				case ClipperLib.PolyFillType.pftPositive:
					return (edge.WindCnt2 > 0);
				default:
					return (edge.WindCnt2 < 0);
				}
		case ClipperLib.ClipType.ctXor:
			if (edge.WindDelta === 0)
				switch (pft2)
				{
				case ClipperLib.PolyFillType.pftEvenOdd:
				case ClipperLib.PolyFillType.pftNonZero:
					return (edge.WindCnt2 === 0);
				case ClipperLib.PolyFillType.pftPositive:
					return (edge.WindCnt2 <= 0);
				default:
					return (edge.WindCnt2 >= 0);
				}
			else
				return true;
		}
		return true;
	};

	ClipperLib.Clipper.prototype.SetWindingCount = function (edge)
	{
		var e = edge.PrevInAEL;
		//find the edge of the same polytype that immediately preceeds 'edge' in AEL
		while (e !== null && ((e.PolyTyp !== edge.PolyTyp) || (e.WindDelta === 0)))
			e = e.PrevInAEL;
		if (e === null)
		{
			var pft = (edge.PolyTyp === ClipperLib.PolyType.ptSubject ? this.m_SubjFillType : this.m_ClipFillType);
			if (edge.WindDelta === 0)
			{
				edge.WindCnt = (pft === ClipperLib.PolyFillType.pftNegative ? -1 : 1);
			}
			else
			{
				edge.WindCnt = edge.WindDelta;
			}
			edge.WindCnt2 = 0;
			e = this.m_ActiveEdges;
			//ie get ready to calc WindCnt2
		}
		else if (edge.WindDelta === 0 && this.m_ClipType !== ClipperLib.ClipType.ctUnion)
		{
			edge.WindCnt = 1;
			edge.WindCnt2 = e.WindCnt2;
			e = e.NextInAEL;
			//ie get ready to calc WindCnt2
		}
		else if (this.IsEvenOddFillType(edge))
		{
			//EvenOdd filling ...
			if (edge.WindDelta === 0)
			{
				//are we inside a subj polygon ...
				var Inside = true;
				var e2 = e.PrevInAEL;
				while (e2 !== null)
				{
					if (e2.PolyTyp === e.PolyTyp && e2.WindDelta !== 0)
						Inside = !Inside;
					e2 = e2.PrevInAEL;
				}
				edge.WindCnt = (Inside ? 0 : 1);
			}
			else
			{
				edge.WindCnt = edge.WindDelta;
			}
			edge.WindCnt2 = e.WindCnt2;
			e = e.NextInAEL;
			//ie get ready to calc WindCnt2
		}
		else
		{
			//nonZero, Positive or Negative filling ...
			if (e.WindCnt * e.WindDelta < 0)
			{
				//prev edge is 'decreasing' WindCount (WC) toward zero
				//so we're outside the previous polygon ...
				if (Math.abs(e.WindCnt) > 1)
				{
					//outside prev poly but still inside another.
					//when reversing direction of prev poly use the same WC
					if (e.WindDelta * edge.WindDelta < 0)
						edge.WindCnt = e.WindCnt;
					else
						edge.WindCnt = e.WindCnt + edge.WindDelta;
				}
				else
					edge.WindCnt = (edge.WindDelta === 0 ? 1 : edge.WindDelta);
			}
			else
			{
				//prev edge is 'increasing' WindCount (WC) away from zero
				//so we're inside the previous polygon ...
				if (edge.WindDelta === 0)
					edge.WindCnt = (e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1);
				else if (e.WindDelta * edge.WindDelta < 0)
					edge.WindCnt = e.WindCnt;
				else
					edge.WindCnt = e.WindCnt + edge.WindDelta;
			}
			edge.WindCnt2 = e.WindCnt2;
			e = e.NextInAEL;
			//ie get ready to calc WindCnt2
		}
		//update WindCnt2 ...
		if (this.IsEvenOddAltFillType(edge))
		{
			//EvenOdd filling ...
			while (e !== edge)
			{
				if (e.WindDelta !== 0)
					edge.WindCnt2 = (edge.WindCnt2 === 0 ? 1 : 0);
				e = e.NextInAEL;
			}
		}
		else
		{
			//nonZero, Positive or Negative filling ...
			while (e !== edge)
			{
				edge.WindCnt2 += e.WindDelta;
				e = e.NextInAEL;
			}
		}
	};

	ClipperLib.Clipper.prototype.AddEdgeToSEL = function (edge)
	{
		//SEL pointers in PEdge are use to build transient lists of horizontal edges.
		//However, since we don't need to worry about processing order, all additions
		//are made to the front of the list ...
		if (this.m_SortedEdges === null)
		{
			this.m_SortedEdges = edge;
			edge.PrevInSEL = null;
			edge.NextInSEL = null;
		}
		else
		{
			edge.NextInSEL = this.m_SortedEdges;
			edge.PrevInSEL = null;
			this.m_SortedEdges.PrevInSEL = edge;
			this.m_SortedEdges = edge;
		}
	};

	ClipperLib.Clipper.prototype.PopEdgeFromSEL = function (e)
	{
		//Pop edge from front of SEL (ie SEL is a FILO list)
		e.v = this.m_SortedEdges;
		if (e.v === null)
		{
			return false;
		}
		var oldE = e.v;
		this.m_SortedEdges = e.v.NextInSEL;
		if (this.m_SortedEdges !== null)
		{
			this.m_SortedEdges.PrevInSEL = null;
		}
		oldE.NextInSEL = null;
		oldE.PrevInSEL = null;
		return true;
	};

	ClipperLib.Clipper.prototype.CopyAELToSEL = function ()
	{
		var e = this.m_ActiveEdges;
		this.m_SortedEdges = e;
		while (e !== null)
		{
			e.PrevInSEL = e.PrevInAEL;
			e.NextInSEL = e.NextInAEL;
			e = e.NextInAEL;
		}
	};

	ClipperLib.Clipper.prototype.SwapPositionsInSEL = function (edge1, edge2)
	{
		if (edge1.NextInSEL === null && edge1.PrevInSEL === null)
			return;
		if (edge2.NextInSEL === null && edge2.PrevInSEL === null)
			return;
		if (edge1.NextInSEL === edge2)
		{
			var next = edge2.NextInSEL;
			if (next !== null)
				next.PrevInSEL = edge1;
			var prev = edge1.PrevInSEL;
			if (prev !== null)
				prev.NextInSEL = edge2;
			edge2.PrevInSEL = prev;
			edge2.NextInSEL = edge1;
			edge1.PrevInSEL = edge2;
			edge1.NextInSEL = next;
		}
		else if (edge2.NextInSEL === edge1)
		{
			var next = edge1.NextInSEL;
			if (next !== null)
				next.PrevInSEL = edge2;
			var prev = edge2.PrevInSEL;
			if (prev !== null)
				prev.NextInSEL = edge1;
			edge1.PrevInSEL = prev;
			edge1.NextInSEL = edge2;
			edge2.PrevInSEL = edge1;
			edge2.NextInSEL = next;
		}
		else
		{
			var next = edge1.NextInSEL;
			var prev = edge1.PrevInSEL;
			edge1.NextInSEL = edge2.NextInSEL;
			if (edge1.NextInSEL !== null)
				edge1.NextInSEL.PrevInSEL = edge1;
			edge1.PrevInSEL = edge2.PrevInSEL;
			if (edge1.PrevInSEL !== null)
				edge1.PrevInSEL.NextInSEL = edge1;
			edge2.NextInSEL = next;
			if (edge2.NextInSEL !== null)
				edge2.NextInSEL.PrevInSEL = edge2;
			edge2.PrevInSEL = prev;
			if (edge2.PrevInSEL !== null)
				edge2.PrevInSEL.NextInSEL = edge2;
		}
		if (edge1.PrevInSEL === null)
			this.m_SortedEdges = edge1;
		else if (edge2.PrevInSEL === null)
			this.m_SortedEdges = edge2;
	};

	ClipperLib.Clipper.prototype.AddLocalMaxPoly = function (e1, e2, pt)
	{
		this.AddOutPt(e1, pt);
		if (e2.WindDelta === 0) this.AddOutPt(e2, pt);
		if (e1.OutIdx === e2.OutIdx)
		{
			e1.OutIdx = -1;
			e2.OutIdx = -1;
		}
		else if (e1.OutIdx < e2.OutIdx)
			this.AppendPolygon(e1, e2);
		else
			this.AppendPolygon(e2, e1);
	};

	ClipperLib.Clipper.prototype.AddLocalMinPoly = function (e1, e2, pt)
	{
		var result;
		var e, prevE;
		if (ClipperLib.ClipperBase.IsHorizontal(e2) || (e1.Dx > e2.Dx))
		{
			result = this.AddOutPt(e1, pt);
			e2.OutIdx = e1.OutIdx;
			e1.Side = ClipperLib.EdgeSide.esLeft;
			e2.Side = ClipperLib.EdgeSide.esRight;
			e = e1;
			if (e.PrevInAEL === e2)
				prevE = e2.PrevInAEL;
			else
				prevE = e.PrevInAEL;
		}
		else
		{
			result = this.AddOutPt(e2, pt);
			e1.OutIdx = e2.OutIdx;
			e1.Side = ClipperLib.EdgeSide.esRight;
			e2.Side = ClipperLib.EdgeSide.esLeft;
			e = e2;
			if (e.PrevInAEL === e1)
				prevE = e1.PrevInAEL;
			else
				prevE = e.PrevInAEL;
		}

		if (prevE !== null && prevE.OutIdx >= 0 && prevE.Top.Y < pt.Y && e.Top.Y < pt.Y)
		{
			var xPrev = ClipperLib.Clipper.TopX(prevE, pt.Y);
			var xE = ClipperLib.Clipper.TopX(e, pt.Y);
			if ((xPrev === xE) && (e.WindDelta !== 0) && (prevE.WindDelta !== 0) && ClipperLib.ClipperBase.SlopesEqual5(new ClipperLib.IntPoint2(xPrev, pt.Y), prevE.Top, new ClipperLib.IntPoint2(xE, pt.Y), e.Top, this.m_UseFullRange))
			{
				var outPt = this.AddOutPt(prevE, pt);
				this.AddJoin(result, outPt, e.Top);
			}
		}
		return result;
	};

	ClipperLib.Clipper.prototype.AddOutPt = function (e, pt)
	{
		if (e.OutIdx < 0)
		{
			var outRec = this.CreateOutRec();
			outRec.IsOpen = (e.WindDelta === 0);
			var newOp = new ClipperLib.OutPt();
			outRec.Pts = newOp;
			newOp.Idx = outRec.Idx;
			//newOp.Pt = pt;
			newOp.Pt.X = pt.X;
			newOp.Pt.Y = pt.Y;
			if (ClipperLib.use_xyz) newOp.Pt.Z = pt.Z;
			newOp.Next = newOp;
			newOp.Prev = newOp;
			if (!outRec.IsOpen)
				this.SetHoleState(e, outRec);
			e.OutIdx = outRec.Idx;
			//nb: do this after SetZ !
			return newOp;
		}
		else
		{
			var outRec = this.m_PolyOuts[e.OutIdx];
			//OutRec.Pts is the 'Left-most' point & OutRec.Pts.Prev is the 'Right-most'
			var op = outRec.Pts;
			var ToFront = (e.Side === ClipperLib.EdgeSide.esLeft);
			if (ToFront && ClipperLib.IntPoint.op_Equality(pt, op.Pt))
				return op;
			else if (!ToFront && ClipperLib.IntPoint.op_Equality(pt, op.Prev.Pt))
				return op.Prev;
			var newOp = new ClipperLib.OutPt();
			newOp.Idx = outRec.Idx;
			//newOp.Pt = pt;
			newOp.Pt.X = pt.X;
			newOp.Pt.Y = pt.Y;
			if (ClipperLib.use_xyz) newOp.Pt.Z = pt.Z;
			newOp.Next = op;
			newOp.Prev = op.Prev;
			newOp.Prev.Next = newOp;
			op.Prev = newOp;
			if (ToFront)
				outRec.Pts = newOp;
			return newOp;
		}
	};

	ClipperLib.Clipper.prototype.GetLastOutPt = function (e)
	{
		var outRec = this.m_PolyOuts[e.OutIdx];
		if (e.Side === ClipperLib.EdgeSide.esLeft)
		{
			return outRec.Pts;
		}
		else
		{
			return outRec.Pts.Prev;
		}
	};

	ClipperLib.Clipper.prototype.SwapPoints = function (pt1, pt2)
	{
		var tmp = new ClipperLib.IntPoint1(pt1.Value);
		//pt1.Value = pt2.Value;
		pt1.Value.X = pt2.Value.X;
		pt1.Value.Y = pt2.Value.Y;
		if (ClipperLib.use_xyz) pt1.Value.Z = pt2.Value.Z;
		//pt2.Value = tmp;
		pt2.Value.X = tmp.X;
		pt2.Value.Y = tmp.Y;
		if (ClipperLib.use_xyz) pt2.Value.Z = tmp.Z;
	};

	ClipperLib.Clipper.prototype.HorzSegmentsOverlap = function (seg1a, seg1b, seg2a, seg2b)
	{
		var tmp;
		if (seg1a > seg1b)
		{
			tmp = seg1a;
			seg1a = seg1b;
			seg1b = tmp;
		}
		if (seg2a > seg2b)
		{
			tmp = seg2a;
			seg2a = seg2b;
			seg2b = tmp;
		}
		return (seg1a < seg2b) && (seg2a < seg1b);
	}

	ClipperLib.Clipper.prototype.SetHoleState = function (e, outRec)
	{
		var e2 = e.PrevInAEL;
		var eTmp = null;
		while (e2 !== null)
		{
			if (e2.OutIdx >= 0 && e2.WindDelta !== 0)
			{
				if (eTmp === null)
					eTmp = e2;
				else if (eTmp.OutIdx === e2.OutIdx)
					eTmp = null; //paired
			}
			e2 = e2.PrevInAEL;
		}

		if (eTmp === null)
		{
			outRec.FirstLeft = null;
			outRec.IsHole = false;
		}
		else
		{
			outRec.FirstLeft = this.m_PolyOuts[eTmp.OutIdx];
			outRec.IsHole = !outRec.FirstLeft.IsHole;
		}
	};

	ClipperLib.Clipper.prototype.GetDx = function (pt1, pt2)
	{
		if (pt1.Y === pt2.Y)
			return ClipperLib.ClipperBase.horizontal;
		else
			return (pt2.X - pt1.X) / (pt2.Y - pt1.Y);
	};

	ClipperLib.Clipper.prototype.FirstIsBottomPt = function (btmPt1, btmPt2)
	{
		var p = btmPt1.Prev;
		while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt1.Pt)) && (p !== btmPt1))
			p = p.Prev;
		var dx1p = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
		p = btmPt1.Next;
		while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt1.Pt)) && (p !== btmPt1))
			p = p.Next;
		var dx1n = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
		p = btmPt2.Prev;
		while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt2.Pt)) && (p !== btmPt2))
			p = p.Prev;
		var dx2p = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
		p = btmPt2.Next;
		while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt2.Pt)) && (p !== btmPt2))
			p = p.Next;
		var dx2n = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));

		if (Math.max(dx1p, dx1n) === Math.max(dx2p, dx2n) && Math.min(dx1p, dx1n) === Math.min(dx2p, dx2n))
		{
			return this.Area(btmPt1) > 0; //if otherwise identical use orientation
		}
		else
		{
			return (dx1p >= dx2p && dx1p >= dx2n) || (dx1n >= dx2p && dx1n >= dx2n);
		}
	};

	ClipperLib.Clipper.prototype.GetBottomPt = function (pp)
	{
		var dups = null;
		var p = pp.Next;
		while (p !== pp)
		{
			if (p.Pt.Y > pp.Pt.Y)
			{
				pp = p;
				dups = null;
			}
			else if (p.Pt.Y === pp.Pt.Y && p.Pt.X <= pp.Pt.X)
			{
				if (p.Pt.X < pp.Pt.X)
				{
					dups = null;
					pp = p;
				}
				else
				{
					if (p.Next !== pp && p.Prev !== pp)
						dups = p;
				}
			}
			p = p.Next;
		}
		if (dups !== null)
		{
			//there appears to be at least 2 vertices at bottomPt so ...
			while (dups !== p)
			{
				if (!this.FirstIsBottomPt(p, dups))
					pp = dups;
				dups = dups.Next;
				while (ClipperLib.IntPoint.op_Inequality(dups.Pt, pp.Pt))
					dups = dups.Next;
			}
		}
		return pp;
	};

	ClipperLib.Clipper.prototype.GetLowermostRec = function (outRec1, outRec2)
	{
		//work out which polygon fragment has the correct hole state ...
		if (outRec1.BottomPt === null)
			outRec1.BottomPt = this.GetBottomPt(outRec1.Pts);
		if (outRec2.BottomPt === null)
			outRec2.BottomPt = this.GetBottomPt(outRec2.Pts);
		var bPt1 = outRec1.BottomPt;
		var bPt2 = outRec2.BottomPt;
		if (bPt1.Pt.Y > bPt2.Pt.Y)
			return outRec1;
		else if (bPt1.Pt.Y < bPt2.Pt.Y)
			return outRec2;
		else if (bPt1.Pt.X < bPt2.Pt.X)
			return outRec1;
		else if (bPt1.Pt.X > bPt2.Pt.X)
			return outRec2;
		else if (bPt1.Next === bPt1)
			return outRec2;
		else if (bPt2.Next === bPt2)
			return outRec1;
		else if (this.FirstIsBottomPt(bPt1, bPt2))
			return outRec1;
		else
			return outRec2;
	};

	ClipperLib.Clipper.prototype.OutRec1RightOfOutRec2 = function (outRec1, outRec2)
	{
		do {
			outRec1 = outRec1.FirstLeft;
			if (outRec1 === outRec2)
				return true;
		}
		while (outRec1 !== null)
		return false;
	};

	ClipperLib.Clipper.prototype.GetOutRec = function (idx)
	{
		var outrec = this.m_PolyOuts[idx];
		while (outrec !== this.m_PolyOuts[outrec.Idx])
			outrec = this.m_PolyOuts[outrec.Idx];
		return outrec;
	};

	ClipperLib.Clipper.prototype.AppendPolygon = function (e1, e2)
	{
		//get the start and ends of both output polygons ...
		var outRec1 = this.m_PolyOuts[e1.OutIdx];
		var outRec2 = this.m_PolyOuts[e2.OutIdx];
		var holeStateRec;
		if (this.OutRec1RightOfOutRec2(outRec1, outRec2))
			holeStateRec = outRec2;
		else if (this.OutRec1RightOfOutRec2(outRec2, outRec1))
			holeStateRec = outRec1;
		else
			holeStateRec = this.GetLowermostRec(outRec1, outRec2);

		//get the start and ends of both output polygons and
		//join E2 poly onto E1 poly and delete pointers to E2 ...

		var p1_lft = outRec1.Pts;
		var p1_rt = p1_lft.Prev;
		var p2_lft = outRec2.Pts;
		var p2_rt = p2_lft.Prev;
		//join e2 poly onto e1 poly and delete pointers to e2 ...
		if (e1.Side === ClipperLib.EdgeSide.esLeft)
		{
			if (e2.Side === ClipperLib.EdgeSide.esLeft)
			{
				//z y x a b c
				this.ReversePolyPtLinks(p2_lft);
				p2_lft.Next = p1_lft;
				p1_lft.Prev = p2_lft;
				p1_rt.Next = p2_rt;
				p2_rt.Prev = p1_rt;
				outRec1.Pts = p2_rt;
			}
			else
			{
				//x y z a b c
				p2_rt.Next = p1_lft;
				p1_lft.Prev = p2_rt;
				p2_lft.Prev = p1_rt;
				p1_rt.Next = p2_lft;
				outRec1.Pts = p2_lft;
			}
		}
		else
		{
			if (e2.Side === ClipperLib.EdgeSide.esRight)
			{
				//a b c z y x
				this.ReversePolyPtLinks(p2_lft);
				p1_rt.Next = p2_rt;
				p2_rt.Prev = p1_rt;
				p2_lft.Next = p1_lft;
				p1_lft.Prev = p2_lft;
			}
			else
			{
				//a b c x y z
				p1_rt.Next = p2_lft;
				p2_lft.Prev = p1_rt;
				p1_lft.Prev = p2_rt;
				p2_rt.Next = p1_lft;
			}
		}
		outRec1.BottomPt = null;
		if (holeStateRec === outRec2)
		{
			if (outRec2.FirstLeft !== outRec1)
				outRec1.FirstLeft = outRec2.FirstLeft;
			outRec1.IsHole = outRec2.IsHole;
		}
		outRec2.Pts = null;
		outRec2.BottomPt = null;
		outRec2.FirstLeft = outRec1;
		var OKIdx = e1.OutIdx;
		var ObsoleteIdx = e2.OutIdx;
		e1.OutIdx = -1;
		//nb: safe because we only get here via AddLocalMaxPoly
		e2.OutIdx = -1;
		var e = this.m_ActiveEdges;
		while (e !== null)
		{
			if (e.OutIdx === ObsoleteIdx)
			{
				e.OutIdx = OKIdx;
				e.Side = e1.Side;
				break;
			}
			e = e.NextInAEL;
		}
		outRec2.Idx = outRec1.Idx;
	};

	ClipperLib.Clipper.prototype.ReversePolyPtLinks = function (pp)
	{
		if (pp === null)
			return;
		var pp1;
		var pp2;
		pp1 = pp;
		do {
			pp2 = pp1.Next;
			pp1.Next = pp1.Prev;
			pp1.Prev = pp2;
			pp1 = pp2;
		}
		while (pp1 !== pp)
	};

	ClipperLib.Clipper.SwapSides = function (edge1, edge2)
	{
		var side = edge1.Side;
		edge1.Side = edge2.Side;
		edge2.Side = side;
	};

	ClipperLib.Clipper.SwapPolyIndexes = function (edge1, edge2)
	{
		var outIdx = edge1.OutIdx;
		edge1.OutIdx = edge2.OutIdx;
		edge2.OutIdx = outIdx;
	};

	ClipperLib.Clipper.prototype.IntersectEdges = function (e1, e2, pt)
	{
		//e1 will be to the left of e2 BELOW the intersection. Therefore e1 is before
		//e2 in AEL except when e1 is being inserted at the intersection point ...
		var e1Contributing = (e1.OutIdx >= 0);
		var e2Contributing = (e2.OutIdx >= 0);

		if (ClipperLib.use_xyz)
			this.SetZ(pt, e1, e2);

		if (ClipperLib.use_lines)
		{
			//if either edge is on an OPEN path ...
			if (e1.WindDelta === 0 || e2.WindDelta === 0)
			{
				//ignore subject-subject open path intersections UNLESS they
				//are both open paths, AND they are both 'contributing maximas' ...
				if (e1.WindDelta === 0 && e2.WindDelta === 0) return;
				//if intersecting a subj line with a subj poly ...
				else if (e1.PolyTyp === e2.PolyTyp &&
					e1.WindDelta !== e2.WindDelta && this.m_ClipType === ClipperLib.ClipType.ctUnion)
				{
					if (e1.WindDelta === 0)
					{
						if (e2Contributing)
						{
							this.AddOutPt(e1, pt);
							if (e1Contributing)
								e1.OutIdx = -1;
						}
					}
					else
					{
						if (e1Contributing)
						{
							this.AddOutPt(e2, pt);
							if (e2Contributing)
								e2.OutIdx = -1;
						}
					}
				}
				else if (e1.PolyTyp !== e2.PolyTyp)
				{
					if ((e1.WindDelta === 0) && Math.abs(e2.WindCnt) === 1 &&
						(this.m_ClipType !== ClipperLib.ClipType.ctUnion || e2.WindCnt2 === 0))
					{
						this.AddOutPt(e1, pt);
						if (e1Contributing)
							e1.OutIdx = -1;
					}
					else if ((e2.WindDelta === 0) && (Math.abs(e1.WindCnt) === 1) &&
						(this.m_ClipType !== ClipperLib.ClipType.ctUnion || e1.WindCnt2 === 0))
					{
						this.AddOutPt(e2, pt);
						if (e2Contributing)
							e2.OutIdx = -1;
					}
				}
				return;
			}
		}
		//update winding counts...
		//assumes that e1 will be to the Right of e2 ABOVE the intersection
		if (e1.PolyTyp === e2.PolyTyp)
		{
			if (this.IsEvenOddFillType(e1))
			{
				var oldE1WindCnt = e1.WindCnt;
				e1.WindCnt = e2.WindCnt;
				e2.WindCnt = oldE1WindCnt;
			}
			else
			{
				if (e1.WindCnt + e2.WindDelta === 0)
					e1.WindCnt = -e1.WindCnt;
				else
					e1.WindCnt += e2.WindDelta;
				if (e2.WindCnt - e1.WindDelta === 0)
					e2.WindCnt = -e2.WindCnt;
				else
					e2.WindCnt -= e1.WindDelta;
			}
		}
		else
		{
			if (!this.IsEvenOddFillType(e2))
				e1.WindCnt2 += e2.WindDelta;
			else
				e1.WindCnt2 = (e1.WindCnt2 === 0) ? 1 : 0;
			if (!this.IsEvenOddFillType(e1))
				e2.WindCnt2 -= e1.WindDelta;
			else
				e2.WindCnt2 = (e2.WindCnt2 === 0) ? 1 : 0;
		}
		var e1FillType, e2FillType, e1FillType2, e2FillType2;
		if (e1.PolyTyp === ClipperLib.PolyType.ptSubject)
		{
			e1FillType = this.m_SubjFillType;
			e1FillType2 = this.m_ClipFillType;
		}
		else
		{
			e1FillType = this.m_ClipFillType;
			e1FillType2 = this.m_SubjFillType;
		}
		if (e2.PolyTyp === ClipperLib.PolyType.ptSubject)
		{
			e2FillType = this.m_SubjFillType;
			e2FillType2 = this.m_ClipFillType;
		}
		else
		{
			e2FillType = this.m_ClipFillType;
			e2FillType2 = this.m_SubjFillType;
		}
		var e1Wc, e2Wc;
		switch (e1FillType)
		{
		case ClipperLib.PolyFillType.pftPositive:
			e1Wc = e1.WindCnt;
			break;
		case ClipperLib.PolyFillType.pftNegative:
			e1Wc = -e1.WindCnt;
			break;
		default:
			e1Wc = Math.abs(e1.WindCnt);
			break;
		}
		switch (e2FillType)
		{
		case ClipperLib.PolyFillType.pftPositive:
			e2Wc = e2.WindCnt;
			break;
		case ClipperLib.PolyFillType.pftNegative:
			e2Wc = -e2.WindCnt;
			break;
		default:
			e2Wc = Math.abs(e2.WindCnt);
			break;
		}
		if (e1Contributing && e2Contributing)
		{
			if ((e1Wc !== 0 && e1Wc !== 1) || (e2Wc !== 0 && e2Wc !== 1) ||
				(e1.PolyTyp !== e2.PolyTyp && this.m_ClipType !== ClipperLib.ClipType.ctXor))
			{
				this.AddLocalMaxPoly(e1, e2, pt);
			}
			else
			{
				this.AddOutPt(e1, pt);
				this.AddOutPt(e2, pt);
				ClipperLib.Clipper.SwapSides(e1, e2);
				ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
			}
		}
		else if (e1Contributing)
		{
			if (e2Wc === 0 || e2Wc === 1)
			{
				this.AddOutPt(e1, pt);
				ClipperLib.Clipper.SwapSides(e1, e2);
				ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
			}
		}
		else if (e2Contributing)
		{
			if (e1Wc === 0 || e1Wc === 1)
			{
				this.AddOutPt(e2, pt);
				ClipperLib.Clipper.SwapSides(e1, e2);
				ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
			}
		}
		else if ((e1Wc === 0 || e1Wc === 1) && (e2Wc === 0 || e2Wc === 1))
		{
			//neither edge is currently contributing ...
			var e1Wc2, e2Wc2;
			switch (e1FillType2)
			{
			case ClipperLib.PolyFillType.pftPositive:
				e1Wc2 = e1.WindCnt2;
				break;
			case ClipperLib.PolyFillType.pftNegative:
				e1Wc2 = -e1.WindCnt2;
				break;
			default:
				e1Wc2 = Math.abs(e1.WindCnt2);
				break;
			}
			switch (e2FillType2)
			{
			case ClipperLib.PolyFillType.pftPositive:
				e2Wc2 = e2.WindCnt2;
				break;
			case ClipperLib.PolyFillType.pftNegative:
				e2Wc2 = -e2.WindCnt2;
				break;
			default:
				e2Wc2 = Math.abs(e2.WindCnt2);
				break;
			}
			if (e1.PolyTyp !== e2.PolyTyp)
			{
				this.AddLocalMinPoly(e1, e2, pt);
			}
			else if (e1Wc === 1 && e2Wc === 1)
				switch (this.m_ClipType)
				{
				case ClipperLib.ClipType.ctIntersection:
					if (e1Wc2 > 0 && e2Wc2 > 0)
						this.AddLocalMinPoly(e1, e2, pt);
					break;
				case ClipperLib.ClipType.ctUnion:
					if (e1Wc2 <= 0 && e2Wc2 <= 0)
						this.AddLocalMinPoly(e1, e2, pt);
					break;
				case ClipperLib.ClipType.ctDifference:
					if (((e1.PolyTyp === ClipperLib.PolyType.ptClip) && (e1Wc2 > 0) && (e2Wc2 > 0)) ||
						((e1.PolyTyp === ClipperLib.PolyType.ptSubject) && (e1Wc2 <= 0) && (e2Wc2 <= 0)))
						this.AddLocalMinPoly(e1, e2, pt);
					break;
				case ClipperLib.ClipType.ctXor:
					this.AddLocalMinPoly(e1, e2, pt);
					break;
				}
			else
				ClipperLib.Clipper.SwapSides(e1, e2);
		}
	};

	ClipperLib.Clipper.prototype.DeleteFromSEL = function (e)
	{
		var SelPrev = e.PrevInSEL;
		var SelNext = e.NextInSEL;
		if (SelPrev === null && SelNext === null && (e !== this.m_SortedEdges))
			return;
		//already deleted
		if (SelPrev !== null)
			SelPrev.NextInSEL = SelNext;
		else
			this.m_SortedEdges = SelNext;
		if (SelNext !== null)
			SelNext.PrevInSEL = SelPrev;
		e.NextInSEL = null;
		e.PrevInSEL = null;
	};

	ClipperLib.Clipper.prototype.ProcessHorizontals = function ()
	{
		var horzEdge = {}; //m_SortedEdges;
		while (this.PopEdgeFromSEL(horzEdge))
		{
			this.ProcessHorizontal(horzEdge.v);
		}
	};

	ClipperLib.Clipper.prototype.GetHorzDirection = function (HorzEdge, $var)
	{
		if (HorzEdge.Bot.X < HorzEdge.Top.X)
		{
			$var.Left = HorzEdge.Bot.X;
			$var.Right = HorzEdge.Top.X;
			$var.Dir = ClipperLib.Direction.dLeftToRight;
		}
		else
		{
			$var.Left = HorzEdge.Top.X;
			$var.Right = HorzEdge.Bot.X;
			$var.Dir = ClipperLib.Direction.dRightToLeft;
		}
	};

	ClipperLib.Clipper.prototype.ProcessHorizontal = function (horzEdge)
	{
		var $var = {
			Dir: null,
			Left: null,
			Right: null
		};

		this.GetHorzDirection(horzEdge, $var);
		var dir = $var.Dir;
		var horzLeft = $var.Left;
		var horzRight = $var.Right;

		var IsOpen = horzEdge.WindDelta === 0;

		var eLastHorz = horzEdge,
			eMaxPair = null;
		while (eLastHorz.NextInLML !== null && ClipperLib.ClipperBase.IsHorizontal(eLastHorz.NextInLML))
			eLastHorz = eLastHorz.NextInLML;
		if (eLastHorz.NextInLML === null)
			eMaxPair = this.GetMaximaPair(eLastHorz);

		var currMax = this.m_Maxima;
		if (currMax !== null)
		{
			//get the first maxima in range (X) ...
			if (dir === ClipperLib.Direction.dLeftToRight)
			{
				while (currMax !== null && currMax.X <= horzEdge.Bot.X)
				{
					currMax = currMax.Next;
				}
				if (currMax !== null && currMax.X >= eLastHorz.Top.X)
				{
					currMax = null;
				}
			}
			else
			{
				while (currMax.Next !== null && currMax.Next.X < horzEdge.Bot.X)
				{
					currMax = currMax.Next;
				}
				if (currMax.X <= eLastHorz.Top.X)
				{
					currMax = null;
				}
			}
		}
		var op1 = null;
		for (;;) //loop through consec. horizontal edges
		{
			var IsLastHorz = (horzEdge === eLastHorz);
			var e = this.GetNextInAEL(horzEdge, dir);
			while (e !== null)
			{
				//this code block inserts extra coords into horizontal edges (in output
				//polygons) whereever maxima touch these horizontal edges. This helps
				//'simplifying' polygons (ie if the Simplify property is set).
				if (currMax !== null)
				{
					if (dir === ClipperLib.Direction.dLeftToRight)
					{
						while (currMax !== null && currMax.X < e.Curr.X)
						{
							if (horzEdge.OutIdx >= 0 && !IsOpen)
							{
								this.AddOutPt(horzEdge, new ClipperLib.IntPoint2(currMax.X, horzEdge.Bot.Y));
							}
							currMax = currMax.Next;
						}
					}
					else
					{
						while (currMax !== null && currMax.X > e.Curr.X)
						{
							if (horzEdge.OutIdx >= 0 && !IsOpen)
							{
								this.AddOutPt(horzEdge, new ClipperLib.IntPoint2(currMax.X, horzEdge.Bot.Y));
							}
							currMax = currMax.Prev;
						}
					}
				}

				if ((dir === ClipperLib.Direction.dLeftToRight && e.Curr.X > horzRight) || (dir === ClipperLib.Direction.dRightToLeft && e.Curr.X < horzLeft))
				{
					break;
				}

				//Also break if we've got to the end of an intermediate horizontal edge ...
				//nb: Smaller Dx's are to the right of larger Dx's ABOVE the horizontal.
				if (e.Curr.X === horzEdge.Top.X && horzEdge.NextInLML !== null && e.Dx < horzEdge.NextInLML.Dx)
					break;

				if (horzEdge.OutIdx >= 0 && !IsOpen) //note: may be done multiple times
				{
					if (ClipperLib.use_xyz)
					{
						if (dir === ClipperLib.Direction.dLeftToRight)
							this.SetZ(e.Curr, horzEdge, e);
						else this.SetZ(e.Curr, e, horzEdge);
					}

					op1 = this.AddOutPt(horzEdge, e.Curr);
					var eNextHorz = this.m_SortedEdges;
					while (eNextHorz !== null)
					{
						if (eNextHorz.OutIdx >= 0 && this.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X))
						{
							var op2 = this.GetLastOutPt(eNextHorz);
							this.AddJoin(op2, op1, eNextHorz.Top);
						}
						eNextHorz = eNextHorz.NextInSEL;
					}
					this.AddGhostJoin(op1, horzEdge.Bot);
				}

				//OK, so far we're still in range of the horizontal Edge  but make sure
				//we're at the last of consec. horizontals when matching with eMaxPair
				if (e === eMaxPair && IsLastHorz)
				{
					if (horzEdge.OutIdx >= 0)
					{
						this.AddLocalMaxPoly(horzEdge, eMaxPair, horzEdge.Top);
					}
					this.DeleteFromAEL(horzEdge);
					this.DeleteFromAEL(eMaxPair);
					return;
				}

				if (dir === ClipperLib.Direction.dLeftToRight)
				{
					var Pt = new ClipperLib.IntPoint2(e.Curr.X, horzEdge.Curr.Y);
					this.IntersectEdges(horzEdge, e, Pt);
				}
				else
				{
					var Pt = new ClipperLib.IntPoint2(e.Curr.X, horzEdge.Curr.Y);
					this.IntersectEdges(e, horzEdge, Pt);
				}
				var eNext = this.GetNextInAEL(e, dir);
				this.SwapPositionsInAEL(horzEdge, e);
				e = eNext;
			} //end while(e !== null)

			//Break out of loop if HorzEdge.NextInLML is not also horizontal ...
			if (horzEdge.NextInLML === null || !ClipperLib.ClipperBase.IsHorizontal(horzEdge.NextInLML))
			{
				break;
			}

			horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
			if (horzEdge.OutIdx >= 0)
			{
				this.AddOutPt(horzEdge, horzEdge.Bot);
			}

			$var = {
				Dir: dir,
				Left: horzLeft,
				Right: horzRight
			};

			this.GetHorzDirection(horzEdge, $var);
			dir = $var.Dir;
			horzLeft = $var.Left;
			horzRight = $var.Right;

		} //end for (;;)

		if (horzEdge.OutIdx >= 0 && op1 === null)
		{
			op1 = this.GetLastOutPt(horzEdge);
			var eNextHorz = this.m_SortedEdges;
			while (eNextHorz !== null)
			{
				if (eNextHorz.OutIdx >= 0 && this.HorzSegmentsOverlap(horzEdge.Bot.X, horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X))
				{
					var op2 = this.GetLastOutPt(eNextHorz);
					this.AddJoin(op2, op1, eNextHorz.Top);
				}
				eNextHorz = eNextHorz.NextInSEL;
			}
			this.AddGhostJoin(op1, horzEdge.Top);
		}

		if (horzEdge.NextInLML !== null)
		{
			if (horzEdge.OutIdx >= 0)
			{
				op1 = this.AddOutPt(horzEdge, horzEdge.Top);

				horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
				if (horzEdge.WindDelta === 0)
				{
					return;
				}
				//nb: HorzEdge is no longer horizontal here
				var ePrev = horzEdge.PrevInAEL;
				var eNext = horzEdge.NextInAEL;
				if (ePrev !== null && ePrev.Curr.X === horzEdge.Bot.X && ePrev.Curr.Y === horzEdge.Bot.Y && ePrev.WindDelta === 0 && (ePrev.OutIdx >= 0 && ePrev.Curr.Y > ePrev.Top.Y && ClipperLib.ClipperBase.SlopesEqual3(horzEdge, ePrev, this.m_UseFullRange)))
				{
					var op2 = this.AddOutPt(ePrev, horzEdge.Bot);
					this.AddJoin(op1, op2, horzEdge.Top);
				}
				else if (eNext !== null && eNext.Curr.X === horzEdge.Bot.X && eNext.Curr.Y === horzEdge.Bot.Y && eNext.WindDelta !== 0 && eNext.OutIdx >= 0 && eNext.Curr.Y > eNext.Top.Y && ClipperLib.ClipperBase.SlopesEqual3(horzEdge, eNext, this.m_UseFullRange))
				{
					var op2 = this.AddOutPt(eNext, horzEdge.Bot);
					this.AddJoin(op1, op2, horzEdge.Top);
				}
			}
			else
			{
				horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
			}
		}
		else
		{
			if (horzEdge.OutIdx >= 0)
			{
				this.AddOutPt(horzEdge, horzEdge.Top);
			}
			this.DeleteFromAEL(horzEdge);
		}
	};

	ClipperLib.Clipper.prototype.GetNextInAEL = function (e, Direction)
	{
		return Direction === ClipperLib.Direction.dLeftToRight ? e.NextInAEL : e.PrevInAEL;
	};

	ClipperLib.Clipper.prototype.IsMinima = function (e)
	{
		return e !== null && (e.Prev.NextInLML !== e) && (e.Next.NextInLML !== e);
	};

	ClipperLib.Clipper.prototype.IsMaxima = function (e, Y)
	{
		return (e !== null && e.Top.Y === Y && e.NextInLML === null);
	};

	ClipperLib.Clipper.prototype.IsIntermediate = function (e, Y)
	{
		return (e.Top.Y === Y && e.NextInLML !== null);
	};

	ClipperLib.Clipper.prototype.GetMaximaPair = function (e)
	{
		if ((ClipperLib.IntPoint.op_Equality(e.Next.Top, e.Top)) && e.Next.NextInLML === null)
		{
			return e.Next;
		}
		else
		{
			if ((ClipperLib.IntPoint.op_Equality(e.Prev.Top, e.Top)) && e.Prev.NextInLML === null)
			{
				return e.Prev;
			}
			else
			{
				return null;
			}
		}
	};

	ClipperLib.Clipper.prototype.GetMaximaPairEx = function (e)
	{
		//as above but returns null if MaxPair isn't in AEL (unless it's horizontal)
		var result = this.GetMaximaPair(e);
		if (result === null || result.OutIdx === ClipperLib.ClipperBase.Skip ||
			((result.NextInAEL === result.PrevInAEL) && !ClipperLib.ClipperBase.IsHorizontal(result)))
		{
			return null;
		}
		return result;
	};

	ClipperLib.Clipper.prototype.ProcessIntersections = function (topY)
	{
		if (this.m_ActiveEdges === null)
			return true;
		try
		{
			this.BuildIntersectList(topY);
			if (this.m_IntersectList.length === 0)
				return true;
			if (this.m_IntersectList.length === 1 || this.FixupIntersectionOrder())
				this.ProcessIntersectList();
			else
				return false;
		}
		catch ($$e2)
		{
			this.m_SortedEdges = null;
			this.m_IntersectList.length = 0;
			ClipperLib.Error("ProcessIntersections error");
		}
		this.m_SortedEdges = null;
		return true;
	};

	ClipperLib.Clipper.prototype.BuildIntersectList = function (topY)
	{
		if (this.m_ActiveEdges === null)
			return;
		//prepare for sorting ...
		var e = this.m_ActiveEdges;
		//console.log(JSON.stringify(JSON.decycle( e )));
		this.m_SortedEdges = e;
		while (e !== null)
		{
			e.PrevInSEL = e.PrevInAEL;
			e.NextInSEL = e.NextInAEL;
			e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
			e = e.NextInAEL;
		}
		//bubblesort ...
		var isModified = true;
		while (isModified && this.m_SortedEdges !== null)
		{
			isModified = false;
			e = this.m_SortedEdges;
			while (e.NextInSEL !== null)
			{
				var eNext = e.NextInSEL;
				var pt = new ClipperLib.IntPoint0();
				//console.log("e.Curr.X: " + e.Curr.X + " eNext.Curr.X" + eNext.Curr.X);
				if (e.Curr.X > eNext.Curr.X)
				{
					this.IntersectPoint(e, eNext, pt);
					if (pt.Y < topY)
					{
						pt = new ClipperLib.IntPoint2(ClipperLib.Clipper.TopX(e, topY), topY);
					}
					var newNode = new ClipperLib.IntersectNode();
					newNode.Edge1 = e;
					newNode.Edge2 = eNext;
					//newNode.Pt = pt;
					newNode.Pt.X = pt.X;
					newNode.Pt.Y = pt.Y;
					if (ClipperLib.use_xyz) newNode.Pt.Z = pt.Z;
					this.m_IntersectList.push(newNode);
					this.SwapPositionsInSEL(e, eNext);
					isModified = true;
				}
				else
					e = eNext;
			}
			if (e.PrevInSEL !== null)
				e.PrevInSEL.NextInSEL = null;
			else
				break;
		}
		this.m_SortedEdges = null;
	};

	ClipperLib.Clipper.prototype.EdgesAdjacent = function (inode)
	{
		return (inode.Edge1.NextInSEL === inode.Edge2) || (inode.Edge1.PrevInSEL === inode.Edge2);
	};

	ClipperLib.Clipper.IntersectNodeSort = function (node1, node2)
	{
		//the following typecast is safe because the differences in Pt.Y will
		//be limited to the height of the scanbeam.
		return (node2.Pt.Y - node1.Pt.Y);
	};

	ClipperLib.Clipper.prototype.FixupIntersectionOrder = function ()
	{
		//pre-condition: intersections are sorted bottom-most first.
		//Now it's crucial that intersections are made only between adjacent edges,
		//so to ensure this the order of intersections may need adjusting ...
		this.m_IntersectList.sort(this.m_IntersectNodeComparer);
		this.CopyAELToSEL();
		var cnt = this.m_IntersectList.length;
		for (var i = 0; i < cnt; i++)
		{
			if (!this.EdgesAdjacent(this.m_IntersectList[i]))
			{
				var j = i + 1;
				while (j < cnt && !this.EdgesAdjacent(this.m_IntersectList[j]))
					j++;
				if (j === cnt)
					return false;
				var tmp = this.m_IntersectList[i];
				this.m_IntersectList[i] = this.m_IntersectList[j];
				this.m_IntersectList[j] = tmp;
			}
			this.SwapPositionsInSEL(this.m_IntersectList[i].Edge1, this.m_IntersectList[i].Edge2);
		}
		return true;
	};

	ClipperLib.Clipper.prototype.ProcessIntersectList = function ()
	{
		for (var i = 0, ilen = this.m_IntersectList.length; i < ilen; i++)
		{
			var iNode = this.m_IntersectList[i];
			this.IntersectEdges(iNode.Edge1, iNode.Edge2, iNode.Pt);
			this.SwapPositionsInAEL(iNode.Edge1, iNode.Edge2);
		}
		this.m_IntersectList.length = 0;
	};

	/*
	--------------------------------
	Round speedtest: http://jsperf.com/fastest-round
	--------------------------------
	*/
	var R1 = function (a)
	{
		return a < 0 ? Math.ceil(a - 0.5) : Math.round(a)
	};

	var R2 = function (a)
	{
		return a < 0 ? Math.ceil(a - 0.5) : Math.floor(a + 0.5)
	};

	var R3 = function (a)
	{
		return a < 0 ? -Math.round(Math.abs(a)) : Math.round(a)
	};

	var R4 = function (a)
	{
		if (a < 0)
		{
			a -= 0.5;
			return a < -2147483648 ? Math.ceil(a) : a | 0;
		}
		else
		{
			a += 0.5;
			return a > 2147483647 ? Math.floor(a) : a | 0;
		}
	};

	if (browser.msie) ClipperLib.Clipper.Round = R1;
	else if (browser.chromium) ClipperLib.Clipper.Round = R3;
	else if (browser.safari) ClipperLib.Clipper.Round = R4;
	else ClipperLib.Clipper.Round = R2; // eg. browser.chrome || browser.firefox || browser.opera
	ClipperLib.Clipper.TopX = function (edge, currentY)
	{
		//if (edge.Bot == edge.Curr) alert ("edge.Bot = edge.Curr");
		//if (edge.Bot == edge.Top) alert ("edge.Bot = edge.Top");
		if (currentY === edge.Top.Y)
			return edge.Top.X;
		return edge.Bot.X + ClipperLib.Clipper.Round(edge.Dx * (currentY - edge.Bot.Y));
	};

	ClipperLib.Clipper.prototype.IntersectPoint = function (edge1, edge2, ip)
	{
		ip.X = 0;
		ip.Y = 0;
		var b1, b2;
		//nb: with very large coordinate values, it's possible for SlopesEqual() to
		//return false but for the edge.Dx value be equal due to double precision rounding.
		if (edge1.Dx === edge2.Dx)
		{
			ip.Y = edge1.Curr.Y;
			ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
			return;
		}
		if (edge1.Delta.X === 0)
		{
			ip.X = edge1.Bot.X;
			if (ClipperLib.ClipperBase.IsHorizontal(edge2))
			{
				ip.Y = edge2.Bot.Y;
			}
			else
			{
				b2 = edge2.Bot.Y - (edge2.Bot.X / edge2.Dx);
				ip.Y = ClipperLib.Clipper.Round(ip.X / edge2.Dx + b2);
			}
		}
		else if (edge2.Delta.X === 0)
		{
			ip.X = edge2.Bot.X;
			if (ClipperLib.ClipperBase.IsHorizontal(edge1))
			{
				ip.Y = edge1.Bot.Y;
			}
			else
			{
				b1 = edge1.Bot.Y - (edge1.Bot.X / edge1.Dx);
				ip.Y = ClipperLib.Clipper.Round(ip.X / edge1.Dx + b1);
			}
		}
		else
		{
			b1 = edge1.Bot.X - edge1.Bot.Y * edge1.Dx;
			b2 = edge2.Bot.X - edge2.Bot.Y * edge2.Dx;
			var q = (b2 - b1) / (edge1.Dx - edge2.Dx);
			ip.Y = ClipperLib.Clipper.Round(q);
			if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
				ip.X = ClipperLib.Clipper.Round(edge1.Dx * q + b1);
			else
				ip.X = ClipperLib.Clipper.Round(edge2.Dx * q + b2);
		}
		if (ip.Y < edge1.Top.Y || ip.Y < edge2.Top.Y)
		{
			if (edge1.Top.Y > edge2.Top.Y)
			{
				ip.Y = edge1.Top.Y;
				ip.X = ClipperLib.Clipper.TopX(edge2, edge1.Top.Y);
				return ip.X < edge1.Top.X;
			}
			else
				ip.Y = edge2.Top.Y;
			if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
				ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
			else
				ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y);
		}
		//finally, don't allow 'ip' to be BELOW curr.Y (ie bottom of scanbeam) ...
		if (ip.Y > edge1.Curr.Y)
		{
			ip.Y = edge1.Curr.Y;
			//better to use the more vertical edge to derive X ...
			if (Math.abs(edge1.Dx) > Math.abs(edge2.Dx))
				ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y);
			else
				ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
		}
	};

	ClipperLib.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function (topY)
	{
		var e = this.m_ActiveEdges;

		while (e !== null)
		{
			//1. process maxima, treating them as if they're 'bent' horizontal edges,
			//   but exclude maxima with horizontal edges. nb: e can't be a horizontal.
			var IsMaximaEdge = this.IsMaxima(e, topY);
			if (IsMaximaEdge)
			{
				var eMaxPair = this.GetMaximaPairEx(e);
				IsMaximaEdge = (eMaxPair === null || !ClipperLib.ClipperBase.IsHorizontal(eMaxPair));
			}
			if (IsMaximaEdge)
			{
				if (this.StrictlySimple)
				{
					this.InsertMaxima(e.Top.X);
				}
				var ePrev = e.PrevInAEL;
				this.DoMaxima(e);
				if (ePrev === null)
					e = this.m_ActiveEdges;
				else
					e = ePrev.NextInAEL;
			}
			else
			{
				//2. promote horizontal edges, otherwise update Curr.X and Curr.Y ...
				if (this.IsIntermediate(e, topY) && ClipperLib.ClipperBase.IsHorizontal(e.NextInLML))
				{
					e = this.UpdateEdgeIntoAEL(e);
					if (e.OutIdx >= 0)
						this.AddOutPt(e, e.Bot);
					this.AddEdgeToSEL(e);
				}
				else
				{
					e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
					e.Curr.Y = topY;
				}

				if (ClipperLib.use_xyz)
				{
					if (e.Top.Y === topY) e.Curr.Z = e.Top.Z;
					else if (e.Bot.Y === topY) e.Curr.Z = e.Bot.Z;
					else e.Curr.Z = 0;
				}

				//When StrictlySimple and 'e' is being touched by another edge, then
				//make sure both edges have a vertex here ...
				if (this.StrictlySimple)
				{
					var ePrev = e.PrevInAEL;
					if ((e.OutIdx >= 0) && (e.WindDelta !== 0) && ePrev !== null &&
						(ePrev.OutIdx >= 0) && (ePrev.Curr.X === e.Curr.X) &&
						(ePrev.WindDelta !== 0))
					{
						var ip = new ClipperLib.IntPoint1(e.Curr);

						if (ClipperLib.use_xyz)
						{
							this.SetZ(ip, ePrev, e);
						}

						var op = this.AddOutPt(ePrev, ip);
						var op2 = this.AddOutPt(e, ip);
						this.AddJoin(op, op2, ip); //StrictlySimple (type-3) join
					}
				}
				e = e.NextInAEL;
			}
		}
		//3. Process horizontals at the Top of the scanbeam ...
		this.ProcessHorizontals();
		this.m_Maxima = null;
		//4. Promote intermediate vertices ...
		e = this.m_ActiveEdges;
		while (e !== null)
		{
			if (this.IsIntermediate(e, topY))
			{
				var op = null;
				if (e.OutIdx >= 0)
					op = this.AddOutPt(e, e.Top);
				e = this.UpdateEdgeIntoAEL(e);
				//if output polygons share an edge, they'll need joining later ...
				var ePrev = e.PrevInAEL;
				var eNext = e.NextInAEL;

				if (ePrev !== null && ePrev.Curr.X === e.Bot.X && ePrev.Curr.Y === e.Bot.Y && op !== null && ePrev.OutIdx >= 0 && ePrev.Curr.Y === ePrev.Top.Y && ClipperLib.ClipperBase.SlopesEqual5(e.Curr, e.Top, ePrev.Curr, ePrev.Top, this.m_UseFullRange) && (e.WindDelta !== 0) && (ePrev.WindDelta !== 0))
				{
					var op2 = this.AddOutPt(ePrev2, e.Bot);
					this.AddJoin(op, op2, e.Top);
				}
				else if (eNext !== null && eNext.Curr.X === e.Bot.X && eNext.Curr.Y === e.Bot.Y && op !== null && eNext.OutIdx >= 0 && eNext.Curr.Y === eNext.Top.Y && ClipperLib.ClipperBase.SlopesEqual5(e.Curr, e.Top, eNext.Curr, eNext.Top, this.m_UseFullRange) && (e.WindDelta !== 0) && (eNext.WindDelta !== 0))
				{
					var op2 = this.AddOutPt(eNext, e.Bot);
					this.AddJoin(op, op2, e.Top);
				}
			}
			e = e.NextInAEL;
		}
	};

	ClipperLib.Clipper.prototype.DoMaxima = function (e)
	{
		var eMaxPair = this.GetMaximaPairEx(e);
		if (eMaxPair === null)
		{
			if (e.OutIdx >= 0)
				this.AddOutPt(e, e.Top);
			this.DeleteFromAEL(e);
			return;
		}
		var eNext = e.NextInAEL;
		while (eNext !== null && eNext !== eMaxPair)
		{
			this.IntersectEdges(e, eNext, e.Top);
			this.SwapPositionsInAEL(e, eNext);
			eNext = e.NextInAEL;
		}
		if (e.OutIdx === -1 && eMaxPair.OutIdx === -1)
		{
			this.DeleteFromAEL(e);
			this.DeleteFromAEL(eMaxPair);
		}
		else if (e.OutIdx >= 0 && eMaxPair.OutIdx >= 0)
		{
			if (e.OutIdx >= 0) this.AddLocalMaxPoly(e, eMaxPair, e.Top);
			this.DeleteFromAEL(e);
			this.DeleteFromAEL(eMaxPair);
		}
		else if (ClipperLib.use_lines && e.WindDelta === 0)
		{
			if (e.OutIdx >= 0)
			{
				this.AddOutPt(e, e.Top);
				e.OutIdx = ClipperLib.ClipperBase.Unassigned;
			}
			this.DeleteFromAEL(e);
			if (eMaxPair.OutIdx >= 0)
			{
				this.AddOutPt(eMaxPair, e.Top);
				eMaxPair.OutIdx = ClipperLib.ClipperBase.Unassigned;
			}
			this.DeleteFromAEL(eMaxPair);
		}
		else
			ClipperLib.Error("DoMaxima error");
	};

	ClipperLib.Clipper.ReversePaths = function (polys)
	{
		for (var i = 0, len = polys.length; i < len; i++)
			polys[i].reverse();
	};

	ClipperLib.Clipper.Orientation = function (poly)
	{
		return ClipperLib.Clipper.Area(poly) >= 0;
	};

	ClipperLib.Clipper.prototype.PointCount = function (pts)
	{
		if (pts === null)
			return 0;
		var result = 0;
		var p = pts;
		do {
			result++;
			p = p.Next;
		}
		while (p !== pts)
		return result;
	};

	ClipperLib.Clipper.prototype.BuildResult = function (polyg)
	{
		ClipperLib.Clear(polyg);
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			var outRec = this.m_PolyOuts[i];
			if (outRec.Pts === null)
				continue;
			var p = outRec.Pts.Prev;
			var cnt = this.PointCount(p);
			if (cnt < 2)
				continue;
			var pg = new Array(cnt);
			for (var j = 0; j < cnt; j++)
			{
				pg[j] = p.Pt;
				p = p.Prev;
			}
			polyg.push(pg);
		}
	};

	ClipperLib.Clipper.prototype.BuildResult2 = function (polytree)
	{
		polytree.Clear();
		//add each output polygon/contour to polytree ...
		//polytree.m_AllPolys.set_Capacity(this.m_PolyOuts.length);
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			var outRec = this.m_PolyOuts[i];
			var cnt = this.PointCount(outRec.Pts);
			if ((outRec.IsOpen && cnt < 2) || (!outRec.IsOpen && cnt < 3))
				continue;
			this.FixHoleLinkage(outRec);
			var pn = new ClipperLib.PolyNode();
			polytree.m_AllPolys.push(pn);
			outRec.PolyNode = pn;
			pn.m_polygon.length = cnt;
			var op = outRec.Pts.Prev;
			for (var j = 0; j < cnt; j++)
			{
				pn.m_polygon[j] = op.Pt;
				op = op.Prev;
			}
		}
		//fixup PolyNode links etc ...
		//polytree.m_Childs.set_Capacity(this.m_PolyOuts.length);
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			var outRec = this.m_PolyOuts[i];
			if (outRec.PolyNode === null)
				continue;
			else if (outRec.IsOpen)
			{
				outRec.PolyNode.IsOpen = true;
				polytree.AddChild(outRec.PolyNode);
			}
			else if (outRec.FirstLeft !== null && outRec.FirstLeft.PolyNode !== null)
				outRec.FirstLeft.PolyNode.AddChild(outRec.PolyNode);
			else
				polytree.AddChild(outRec.PolyNode);
		}
	};

	ClipperLib.Clipper.prototype.FixupOutPolyline = function (outRec)
	{
		var pp = outRec.Pts;
		var lastPP = pp.Prev;
		while (pp !== lastPP)
		{
			pp = pp.Next;
			if (ClipperLib.IntPoint.op_Equality(pp.Pt, pp.Prev.Pt))
			{
				if (pp === lastPP)
				{
					lastPP = pp.Prev;
				}
				var tmpPP = pp.Prev;
				tmpPP.Next = pp.Next;
				pp.Next.Prev = tmpPP;
				pp = tmpPP;
			}
		}
		if (pp === pp.Prev)
		{
			outRec.Pts = null;
		}
	};

	ClipperLib.Clipper.prototype.FixupOutPolygon = function (outRec)
	{
		//FixupOutPolygon() - removes duplicate points and simplifies consecutive
		//parallel edges by removing the middle vertex.
		var lastOK = null;
		outRec.BottomPt = null;
		var pp = outRec.Pts;
		var preserveCol = this.PreserveCollinear || this.StrictlySimple;
		for (;;)
		{
			if (pp.Prev === pp || pp.Prev === pp.Next)
			{
				outRec.Pts = null;
				return;
			}

			//test for duplicate points and collinear edges ...
			if ((ClipperLib.IntPoint.op_Equality(pp.Pt, pp.Next.Pt)) || (ClipperLib.IntPoint.op_Equality(pp.Pt, pp.Prev.Pt)) || (ClipperLib.ClipperBase.SlopesEqual4(pp.Prev.Pt, pp.Pt, pp.Next.Pt, this.m_UseFullRange) && (!preserveCol || !this.Pt2IsBetweenPt1AndPt3(pp.Prev.Pt, pp.Pt, pp.Next.Pt))))
			{
				lastOK = null;
				pp.Prev.Next = pp.Next;
				pp.Next.Prev = pp.Prev;
				pp = pp.Prev;
			}
			else if (pp === lastOK)
				break;
			else
			{
				if (lastOK === null)
					lastOK = pp;
				pp = pp.Next;
			}
		}
		outRec.Pts = pp;
	};

	ClipperLib.Clipper.prototype.DupOutPt = function (outPt, InsertAfter)
	{
		var result = new ClipperLib.OutPt();
		//result.Pt = outPt.Pt;
		result.Pt.X = outPt.Pt.X;
		result.Pt.Y = outPt.Pt.Y;
		if (ClipperLib.use_xyz) result.Pt.Z = outPt.Pt.Z;
		result.Idx = outPt.Idx;
		if (InsertAfter)
		{
			result.Next = outPt.Next;
			result.Prev = outPt;
			outPt.Next.Prev = result;
			outPt.Next = result;
		}
		else
		{
			result.Prev = outPt.Prev;
			result.Next = outPt;
			outPt.Prev.Next = result;
			outPt.Prev = result;
		}
		return result;
	};

	ClipperLib.Clipper.prototype.GetOverlap = function (a1, a2, b1, b2, $val)
	{
		if (a1 < a2)
		{
			if (b1 < b2)
			{
				$val.Left = Math.max(a1, b1);
				$val.Right = Math.min(a2, b2);
			}
			else
			{
				$val.Left = Math.max(a1, b2);
				$val.Right = Math.min(a2, b1);
			}
		}
		else
		{
			if (b1 < b2)
			{
				$val.Left = Math.max(a2, b1);
				$val.Right = Math.min(a1, b2);
			}
			else
			{
				$val.Left = Math.max(a2, b2);
				$val.Right = Math.min(a1, b1);
			}
		}
		return $val.Left < $val.Right;
	};

	ClipperLib.Clipper.prototype.JoinHorz = function (op1, op1b, op2, op2b, Pt, DiscardLeft)
	{
		var Dir1 = (op1.Pt.X > op1b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight);
		var Dir2 = (op2.Pt.X > op2b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight);
		if (Dir1 === Dir2)
			return false;
		//When DiscardLeft, we want Op1b to be on the Left of Op1, otherwise we
		//want Op1b to be on the Right. (And likewise with Op2 and Op2b.)
		//So, to facilitate this while inserting Op1b and Op2b ...
		//when DiscardLeft, make sure we're AT or RIGHT of Pt before adding Op1b,
		//otherwise make sure we're AT or LEFT of Pt. (Likewise with Op2b.)
		if (Dir1 === ClipperLib.Direction.dLeftToRight)
		{
			while (op1.Next.Pt.X <= Pt.X &&
				op1.Next.Pt.X >= op1.Pt.X && op1.Next.Pt.Y === Pt.Y)
				op1 = op1.Next;
			if (DiscardLeft && (op1.Pt.X !== Pt.X))
				op1 = op1.Next;
			op1b = this.DupOutPt(op1, !DiscardLeft);
			if (ClipperLib.IntPoint.op_Inequality(op1b.Pt, Pt))
			{
				op1 = op1b;
				//op1.Pt = Pt;
				op1.Pt.X = Pt.X;
				op1.Pt.Y = Pt.Y;
				if (ClipperLib.use_xyz) op1.Pt.Z = Pt.Z;
				op1b = this.DupOutPt(op1, !DiscardLeft);
			}
		}
		else
		{
			while (op1.Next.Pt.X >= Pt.X &&
				op1.Next.Pt.X <= op1.Pt.X && op1.Next.Pt.Y === Pt.Y)
				op1 = op1.Next;
			if (!DiscardLeft && (op1.Pt.X !== Pt.X))
				op1 = op1.Next;
			op1b = this.DupOutPt(op1, DiscardLeft);
			if (ClipperLib.IntPoint.op_Inequality(op1b.Pt, Pt))
			{
				op1 = op1b;
				//op1.Pt = Pt;
				op1.Pt.X = Pt.X;
				op1.Pt.Y = Pt.Y;
				if (ClipperLib.use_xyz) op1.Pt.Z = Pt.Z;
				op1b = this.DupOutPt(op1, DiscardLeft);
			}
		}
		if (Dir2 === ClipperLib.Direction.dLeftToRight)
		{
			while (op2.Next.Pt.X <= Pt.X &&
				op2.Next.Pt.X >= op2.Pt.X && op2.Next.Pt.Y === Pt.Y)
				op2 = op2.Next;
			if (DiscardLeft && (op2.Pt.X !== Pt.X))
				op2 = op2.Next;
			op2b = this.DupOutPt(op2, !DiscardLeft);
			if (ClipperLib.IntPoint.op_Inequality(op2b.Pt, Pt))
			{
				op2 = op2b;
				//op2.Pt = Pt;
				op2.Pt.X = Pt.X;
				op2.Pt.Y = Pt.Y;
				if (ClipperLib.use_xyz) op2.Pt.Z = Pt.Z;
				op2b = this.DupOutPt(op2, !DiscardLeft);
			}
		}
		else
		{
			while (op2.Next.Pt.X >= Pt.X &&
				op2.Next.Pt.X <= op2.Pt.X && op2.Next.Pt.Y === Pt.Y)
				op2 = op2.Next;
			if (!DiscardLeft && (op2.Pt.X !== Pt.X))
				op2 = op2.Next;
			op2b = this.DupOutPt(op2, DiscardLeft);
			if (ClipperLib.IntPoint.op_Inequality(op2b.Pt, Pt))
			{
				op2 = op2b;
				//op2.Pt = Pt;
				op2.Pt.X = Pt.X;
				op2.Pt.Y = Pt.Y;
				if (ClipperLib.use_xyz) op2.Pt.Z = Pt.Z;
				op2b = this.DupOutPt(op2, DiscardLeft);
			}
		}
		if ((Dir1 === ClipperLib.Direction.dLeftToRight) === DiscardLeft)
		{
			op1.Prev = op2;
			op2.Next = op1;
			op1b.Next = op2b;
			op2b.Prev = op1b;
		}
		else
		{
			op1.Next = op2;
			op2.Prev = op1;
			op1b.Prev = op2b;
			op2b.Next = op1b;
		}
		return true;
	};

	ClipperLib.Clipper.prototype.JoinPoints = function (j, outRec1, outRec2)
	{
		var op1 = j.OutPt1,
			op1b = new ClipperLib.OutPt();
		var op2 = j.OutPt2,
			op2b = new ClipperLib.OutPt();
		//There are 3 kinds of joins for output polygons ...
		//1. Horizontal joins where Join.OutPt1 & Join.OutPt2 are vertices anywhere
		//along (horizontal) collinear edges (& Join.OffPt is on the same horizontal).
		//2. Non-horizontal joins where Join.OutPt1 & Join.OutPt2 are at the same
		//location at the Bottom of the overlapping segment (& Join.OffPt is above).
		//3. StrictlySimple joins where edges touch but are not collinear and where
		//Join.OutPt1, Join.OutPt2 & Join.OffPt all share the same point.
		var isHorizontal = (j.OutPt1.Pt.Y === j.OffPt.Y);
		if (isHorizontal && (ClipperLib.IntPoint.op_Equality(j.OffPt, j.OutPt1.Pt)) && (ClipperLib.IntPoint.op_Equality(j.OffPt, j.OutPt2.Pt)))
		{
			//Strictly Simple join ...
			if (outRec1 !== outRec2) return false;

			op1b = j.OutPt1.Next;
			while (op1b !== op1 && (ClipperLib.IntPoint.op_Equality(op1b.Pt, j.OffPt)))
				op1b = op1b.Next;
			var reverse1 = (op1b.Pt.Y > j.OffPt.Y);
			op2b = j.OutPt2.Next;
			while (op2b !== op2 && (ClipperLib.IntPoint.op_Equality(op2b.Pt, j.OffPt)))
				op2b = op2b.Next;
			var reverse2 = (op2b.Pt.Y > j.OffPt.Y);
			if (reverse1 === reverse2)
				return false;
			if (reverse1)
			{
				op1b = this.DupOutPt(op1, false);
				op2b = this.DupOutPt(op2, true);
				op1.Prev = op2;
				op2.Next = op1;
				op1b.Next = op2b;
				op2b.Prev = op1b;
				j.OutPt1 = op1;
				j.OutPt2 = op1b;
				return true;
			}
			else
			{
				op1b = this.DupOutPt(op1, true);
				op2b = this.DupOutPt(op2, false);
				op1.Next = op2;
				op2.Prev = op1;
				op1b.Prev = op2b;
				op2b.Next = op1b;
				j.OutPt1 = op1;
				j.OutPt2 = op1b;
				return true;
			}
		}
		else if (isHorizontal)
		{
			//treat horizontal joins differently to non-horizontal joins since with
			//them we're not yet sure where the overlapping is. OutPt1.Pt & OutPt2.Pt
			//may be anywhere along the horizontal edge.
			op1b = op1;
			while (op1.Prev.Pt.Y === op1.Pt.Y && op1.Prev !== op1b && op1.Prev !== op2)
				op1 = op1.Prev;
			while (op1b.Next.Pt.Y === op1b.Pt.Y && op1b.Next !== op1 && op1b.Next !== op2)
				op1b = op1b.Next;
			if (op1b.Next === op1 || op1b.Next === op2)
				return false;
			//a flat 'polygon'
			op2b = op2;
			while (op2.Prev.Pt.Y === op2.Pt.Y && op2.Prev !== op2b && op2.Prev !== op1b)
				op2 = op2.Prev;
			while (op2b.Next.Pt.Y === op2b.Pt.Y && op2b.Next !== op2 && op2b.Next !== op1)
				op2b = op2b.Next;
			if (op2b.Next === op2 || op2b.Next === op1)
				return false;
			//a flat 'polygon'
			//Op1 -. Op1b & Op2 -. Op2b are the extremites of the horizontal edges

			var $val = {
				Left: null,
				Right: null
			};

			if (!this.GetOverlap(op1.Pt.X, op1b.Pt.X, op2.Pt.X, op2b.Pt.X, $val))
				return false;
			var Left = $val.Left;
			var Right = $val.Right;

			//DiscardLeftSide: when overlapping edges are joined, a spike will created
			//which needs to be cleaned up. However, we don't want Op1 or Op2 caught up
			//on the discard Side as either may still be needed for other joins ...
			var Pt = new ClipperLib.IntPoint0();
			var DiscardLeftSide;
			if (op1.Pt.X >= Left && op1.Pt.X <= Right)
			{
				//Pt = op1.Pt;
				Pt.X = op1.Pt.X;
				Pt.Y = op1.Pt.Y;
				if (ClipperLib.use_xyz) Pt.Z = op1.Pt.Z;
				DiscardLeftSide = (op1.Pt.X > op1b.Pt.X);
			}
			else if (op2.Pt.X >= Left && op2.Pt.X <= Right)
			{
				//Pt = op2.Pt;
				Pt.X = op2.Pt.X;
				Pt.Y = op2.Pt.Y;
				if (ClipperLib.use_xyz) Pt.Z = op2.Pt.Z;
				DiscardLeftSide = (op2.Pt.X > op2b.Pt.X);
			}
			else if (op1b.Pt.X >= Left && op1b.Pt.X <= Right)
			{
				//Pt = op1b.Pt;
				Pt.X = op1b.Pt.X;
				Pt.Y = op1b.Pt.Y;
				if (ClipperLib.use_xyz) Pt.Z = op1b.Pt.Z;
				DiscardLeftSide = op1b.Pt.X > op1.Pt.X;
			}
			else
			{
				//Pt = op2b.Pt;
				Pt.X = op2b.Pt.X;
				Pt.Y = op2b.Pt.Y;
				if (ClipperLib.use_xyz) Pt.Z = op2b.Pt.Z;
				DiscardLeftSide = (op2b.Pt.X > op2.Pt.X);
			}
			j.OutPt1 = op1;
			j.OutPt2 = op2;
			return this.JoinHorz(op1, op1b, op2, op2b, Pt, DiscardLeftSide);
		}
		else
		{
			//nb: For non-horizontal joins ...
			//    1. Jr.OutPt1.Pt.Y == Jr.OutPt2.Pt.Y
			//    2. Jr.OutPt1.Pt > Jr.OffPt.Y
			//make sure the polygons are correctly oriented ...
			op1b = op1.Next;
			while ((ClipperLib.IntPoint.op_Equality(op1b.Pt, op1.Pt)) && (op1b !== op1))
				op1b = op1b.Next;
			var Reverse1 = ((op1b.Pt.Y > op1.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange));
			if (Reverse1)
			{
				op1b = op1.Prev;
				while ((ClipperLib.IntPoint.op_Equality(op1b.Pt, op1.Pt)) && (op1b !== op1))
					op1b = op1b.Prev;

				if ((op1b.Pt.Y > op1.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual4(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange))
					return false;
			}
			op2b = op2.Next;
			while ((ClipperLib.IntPoint.op_Equality(op2b.Pt, op2.Pt)) && (op2b !== op2))
				op2b = op2b.Next;

			var Reverse2 = ((op2b.Pt.Y > op2.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange));
			if (Reverse2)
			{
				op2b = op2.Prev;
				while ((ClipperLib.IntPoint.op_Equality(op2b.Pt, op2.Pt)) && (op2b !== op2))
					op2b = op2b.Prev;

				if ((op2b.Pt.Y > op2.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual4(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange))
					return false;
			}
			if ((op1b === op1) || (op2b === op2) || (op1b === op2b) ||
				((outRec1 === outRec2) && (Reverse1 === Reverse2)))
				return false;
			if (Reverse1)
			{
				op1b = this.DupOutPt(op1, false);
				op2b = this.DupOutPt(op2, true);
				op1.Prev = op2;
				op2.Next = op1;
				op1b.Next = op2b;
				op2b.Prev = op1b;
				j.OutPt1 = op1;
				j.OutPt2 = op1b;
				return true;
			}
			else
			{
				op1b = this.DupOutPt(op1, true);
				op2b = this.DupOutPt(op2, false);
				op1.Next = op2;
				op2.Prev = op1;
				op1b.Prev = op2b;
				op2b.Next = op1b;
				j.OutPt1 = op1;
				j.OutPt2 = op1b;
				return true;
			}
		}
	};

	ClipperLib.Clipper.GetBounds = function (paths)
	{
		var i = 0,
			cnt = paths.length;
		while (i < cnt && paths[i].length === 0) i++;
		if (i === cnt) return new ClipperLib.IntRect(0, 0, 0, 0);
		var result = new ClipperLib.IntRect();
		result.left = paths[i][0].X;
		result.right = result.left;
		result.top = paths[i][0].Y;
		result.bottom = result.top;
		for (; i < cnt; i++)
			for (var j = 0, jlen = paths[i].length; j < jlen; j++)
			{
				if (paths[i][j].X < result.left) result.left = paths[i][j].X;
				else if (paths[i][j].X > result.right) result.right = paths[i][j].X;
				if (paths[i][j].Y < result.top) result.top = paths[i][j].Y;
				else if (paths[i][j].Y > result.bottom) result.bottom = paths[i][j].Y;
			}
		return result;
	}
	ClipperLib.Clipper.prototype.GetBounds2 = function (ops)
	{
		var opStart = ops;
		var result = new ClipperLib.IntRect();
		result.left = ops.Pt.X;
		result.right = ops.Pt.X;
		result.top = ops.Pt.Y;
		result.bottom = ops.Pt.Y;
		ops = ops.Next;
		while (ops !== opStart)
		{
			if (ops.Pt.X < result.left)
				result.left = ops.Pt.X;
			if (ops.Pt.X > result.right)
				result.right = ops.Pt.X;
			if (ops.Pt.Y < result.top)
				result.top = ops.Pt.Y;
			if (ops.Pt.Y > result.bottom)
				result.bottom = ops.Pt.Y;
			ops = ops.Next;
		}
		return result;
	};

	ClipperLib.Clipper.PointInPolygon = function (pt, path)
	{
		//returns 0 if false, +1 if true, -1 if pt ON polygon boundary
		//See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
		//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
		var result = 0,
			cnt = path.length;
		if (cnt < 3)
			return 0;
		var ip = path[0];
		for (var i = 1; i <= cnt; ++i)
		{
			var ipNext = (i === cnt ? path[0] : path[i]);
			if (ipNext.Y === pt.Y)
			{
				if ((ipNext.X === pt.X) || (ip.Y === pt.Y && ((ipNext.X > pt.X) === (ip.X < pt.X))))
					return -1;
			}
			if ((ip.Y < pt.Y) !== (ipNext.Y < pt.Y))
			{
				if (ip.X >= pt.X)
				{
					if (ipNext.X > pt.X)
						result = 1 - result;
					else
					{
						var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
						if (d === 0)
							return -1;
						else if ((d > 0) === (ipNext.Y > ip.Y))
							result = 1 - result;
					}
				}
				else
				{
					if (ipNext.X > pt.X)
					{
						var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
						if (d === 0)
							return -1;
						else if ((d > 0) === (ipNext.Y > ip.Y))
							result = 1 - result;
					}
				}
			}
			ip = ipNext;
		}
		return result;
	};

	ClipperLib.Clipper.prototype.PointInPolygon = function (pt, op)
	{
		//returns 0 if false, +1 if true, -1 if pt ON polygon boundary
		var result = 0;
		var startOp = op;
		var ptx = pt.X,
			pty = pt.Y;
		var poly0x = op.Pt.X,
			poly0y = op.Pt.Y;
		do {
			op = op.Next;
			var poly1x = op.Pt.X,
				poly1y = op.Pt.Y;
			if (poly1y === pty)
			{
				if ((poly1x === ptx) || (poly0y === pty && ((poly1x > ptx) === (poly0x < ptx))))
					return -1;
			}
			if ((poly0y < pty) !== (poly1y < pty))
			{
				if (poly0x >= ptx)
				{
					if (poly1x > ptx)
						result = 1 - result;
					else
					{
						var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
						if (d === 0)
							return -1;
						if ((d > 0) === (poly1y > poly0y))
							result = 1 - result;
					}
				}
				else
				{
					if (poly1x > ptx)
					{
						var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
						if (d === 0)
							return -1;
						if ((d > 0) === (poly1y > poly0y))
							result = 1 - result;
					}
				}
			}
			poly0x = poly1x;
			poly0y = poly1y;
		} while (startOp !== op);

		return result;
	};

	ClipperLib.Clipper.prototype.Poly2ContainsPoly1 = function (outPt1, outPt2)
	{
		var op = outPt1;
		do {
			//nb: PointInPolygon returns 0 if false, +1 if true, -1 if pt on polygon
			var res = this.PointInPolygon(op.Pt, outPt2);
			if (res >= 0)
				return res > 0;
			op = op.Next;
		}
		while (op !== outPt1)
		return true;
	};

	ClipperLib.Clipper.prototype.FixupFirstLefts1 = function (OldOutRec, NewOutRec)
	{
		var outRec, firstLeft;
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			outRec = this.m_PolyOuts[i];
			firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
			if (outRec.Pts !== null && firstLeft === OldOutRec)
			{
				if (this.Poly2ContainsPoly1(outRec.Pts, NewOutRec.Pts))
					outRec.FirstLeft = NewOutRec;
			}
		}
	}

	ClipperLib.Clipper.prototype.FixupFirstLefts2 = function (innerOutRec, outerOutRec)
	{
		//A polygon has split into two such that one is now the inner of the other.
		//It's possible that these polygons now wrap around other polygons, so check
		//every polygon that's also contained by OuterOutRec's FirstLeft container
		//(including nil) to see if they've become inner to the new inner polygon ...
		var orfl = outerOutRec.FirstLeft;
		var outRec, firstLeft;
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			outRec = this.m_PolyOuts[i];
			if (outRec.Pts === null || outRec === outerOutRec || outRec === innerOutRec)
				continue;
			firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
			if (firstLeft !== orfl && firstLeft !== innerOutRec && firstLeft !== outerOutRec)
				continue;
			if (this.Poly2ContainsPoly1(outRec.Pts, innerOutRec.Pts))
				outRec.FirstLeft = innerOutRec;
			else if (this.Poly2ContainsPoly1(outRec.Pts, outerOutRec.Pts))
				outRec.FirstLeft = outerOutRec;
			else if (outRec.FirstLeft === innerOutRec || outRec.FirstLeft === outerOutRec)
				outRec.FirstLeft = orfl;
		}
	}

	ClipperLib.Clipper.prototype.FixupFirstLefts3 = function (OldOutRec, NewOutRec)
	{
		//same as FixupFirstLefts1 but doesn't call Poly2ContainsPoly1()
		var outRec;
		var firstLeft;
		for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
		{
			outRec = this.m_PolyOuts[i];
			firstLeft = ClipperLib.Clipper.ParseFirstLeft(outRec.FirstLeft);
			if (outRec.Pts !== null && firstLeft === OldOutRec)
				outRec.FirstLeft = NewOutRec;
		}
	}

	ClipperLib.Clipper.ParseFirstLeft = function (FirstLeft)
	{
		while (FirstLeft !== null && FirstLeft.Pts === null)
			FirstLeft = FirstLeft.FirstLeft;
		return FirstLeft;
	};

	ClipperLib.Clipper.prototype.JoinCommonEdges = function ()
	{
		for (var i = 0, ilen = this.m_Joins.length; i < ilen; i++)
		{
			var join = this.m_Joins[i];
			var outRec1 = this.GetOutRec(join.OutPt1.Idx);
			var outRec2 = this.GetOutRec(join.OutPt2.Idx);
			if (outRec1.Pts === null || outRec2.Pts === null)
				continue;

			if (outRec1.IsOpen || outRec2.IsOpen)
			{
				continue;
			}

			//get the polygon fragment with the correct hole state (FirstLeft)
			//before calling JoinPoints() ...
			var holeStateRec;
			if (outRec1 === outRec2)
				holeStateRec = outRec1;
			else if (this.OutRec1RightOfOutRec2(outRec1, outRec2))
				holeStateRec = outRec2;
			else if (this.OutRec1RightOfOutRec2(outRec2, outRec1))
				holeStateRec = outRec1;
			else
				holeStateRec = this.GetLowermostRec(outRec1, outRec2);

			if (!this.JoinPoints(join, outRec1, outRec2)) continue;

			if (outRec1 === outRec2)
			{
				//instead of joining two polygons, we've just created a new one by
				//splitting one polygon into two.
				outRec1.Pts = join.OutPt1;
				outRec1.BottomPt = null;
				outRec2 = this.CreateOutRec();
				outRec2.Pts = join.OutPt2;
				//update all OutRec2.Pts Idx's ...
				this.UpdateOutPtIdxs(outRec2);

				if (this.Poly2ContainsPoly1(outRec2.Pts, outRec1.Pts))
				{
					//outRec1 contains outRec2 ...
					outRec2.IsHole = !outRec1.IsHole;
					outRec2.FirstLeft = outRec1;
					if (this.m_UsingPolyTree)
						this.FixupFirstLefts2(outRec2, outRec1);
					if ((outRec2.IsHole ^ this.ReverseSolution) == (this.Area$1(outRec2) > 0))
						this.ReversePolyPtLinks(outRec2.Pts);
				}
				else if (this.Poly2ContainsPoly1(outRec1.Pts, outRec2.Pts))
				{
					//outRec2 contains outRec1 ...
					outRec2.IsHole = outRec1.IsHole;
					outRec1.IsHole = !outRec2.IsHole;
					outRec2.FirstLeft = outRec1.FirstLeft;
					outRec1.FirstLeft = outRec2;
					if (this.m_UsingPolyTree)
						this.FixupFirstLefts2(outRec1, outRec2);

					if ((outRec1.IsHole ^ this.ReverseSolution) == (this.Area$1(outRec1) > 0))
						this.ReversePolyPtLinks(outRec1.Pts);
				}
				else
				{
					//the 2 polygons are completely separate ...
					outRec2.IsHole = outRec1.IsHole;
					outRec2.FirstLeft = outRec1.FirstLeft;
					//fixup FirstLeft pointers that may need reassigning to OutRec2
					if (this.m_UsingPolyTree)
						this.FixupFirstLefts1(outRec1, outRec2);
				}
			}
			else
			{
				//joined 2 polygons together ...
				outRec2.Pts = null;
				outRec2.BottomPt = null;
				outRec2.Idx = outRec1.Idx;
				outRec1.IsHole = holeStateRec.IsHole;
				if (holeStateRec === outRec2)
					outRec1.FirstLeft = outRec2.FirstLeft;
				outRec2.FirstLeft = outRec1;
				//fixup FirstLeft pointers that may need reassigning to OutRec1
				if (this.m_UsingPolyTree)
					this.FixupFirstLefts3(outRec2, outRec1);
			}
		}
	};

	ClipperLib.Clipper.prototype.UpdateOutPtIdxs = function (outrec)
	{
		var op = outrec.Pts;
		do {
			op.Idx = outrec.Idx;
			op = op.Prev;
		}
		while (op !== outrec.Pts)
	};

	ClipperLib.Clipper.prototype.DoSimplePolygons = function ()
	{
		var i = 0;
		while (i < this.m_PolyOuts.length)
		{
			var outrec = this.m_PolyOuts[i++];
			var op = outrec.Pts;
			if (op === null || outrec.IsOpen)
				continue;
			do //for each Pt in Polygon until duplicate found do ...
			{
				var op2 = op.Next;
				while (op2 !== outrec.Pts)
				{
					if ((ClipperLib.IntPoint.op_Equality(op.Pt, op2.Pt)) && op2.Next !== op && op2.Prev !== op)
					{
						//split the polygon into two ...
						var op3 = op.Prev;
						var op4 = op2.Prev;
						op.Prev = op4;
						op4.Next = op;
						op2.Prev = op3;
						op3.Next = op2;
						outrec.Pts = op;
						var outrec2 = this.CreateOutRec();
						outrec2.Pts = op2;
						this.UpdateOutPtIdxs(outrec2);
						if (this.Poly2ContainsPoly1(outrec2.Pts, outrec.Pts))
						{
							//OutRec2 is contained by OutRec1 ...
							outrec2.IsHole = !outrec.IsHole;
							outrec2.FirstLeft = outrec;
							if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec2, outrec);

						}
						else if (this.Poly2ContainsPoly1(outrec.Pts, outrec2.Pts))
						{
							//OutRec1 is contained by OutRec2 ...
							outrec2.IsHole = outrec.IsHole;
							outrec.IsHole = !outrec2.IsHole;
							outrec2.FirstLeft = outrec.FirstLeft;
							outrec.FirstLeft = outrec2;
							if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec, outrec2);
						}
						else
						{
							//the 2 polygons are separate ...
							outrec2.IsHole = outrec.IsHole;
							outrec2.FirstLeft = outrec.FirstLeft;
							if (this.m_UsingPolyTree) this.FixupFirstLefts1(outrec, outrec2);
						}
						op2 = op;
						//ie get ready for the next iteration
					}
					op2 = op2.Next;
				}
				op = op.Next;
			}
			while (op !== outrec.Pts)
		}
	};

	ClipperLib.Clipper.Area = function (poly)
	{
		if (!Array.isArray(poly))
			return 0;
		var cnt = poly.length;
		if (cnt < 3)
			return 0;
		var a = 0;
		for (var i = 0, j = cnt - 1; i < cnt; ++i)
		{
			a += (poly[j].X + poly[i].X) * (poly[j].Y - poly[i].Y);
			j = i;
		}
		return -a * 0.5;
	};

	ClipperLib.Clipper.prototype.Area = function (op)
	{
		var opFirst = op;
		if (op === null) return 0;
		var a = 0;
		do {
			a = a + (op.Prev.Pt.X + op.Pt.X) * (op.Prev.Pt.Y - op.Pt.Y);
			op = op.Next;
		} while (op !== opFirst); // && typeof op !== 'undefined');
		return a * 0.5;
	}

	ClipperLib.Clipper.prototype.Area$1 = function (outRec)
	{
		return this.Area(outRec.Pts);
	};

	ClipperLib.Clipper.SimplifyPolygon = function (poly, fillType)
	{
		var result = new Array();
		var c = new ClipperLib.Clipper(0);
		c.StrictlySimple = true;
		c.AddPath(poly, ClipperLib.PolyType.ptSubject, true);
		c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
		return result;
	};

	ClipperLib.Clipper.SimplifyPolygons = function (polys, fillType)
	{
		if (typeof (fillType) === "undefined") fillType = ClipperLib.PolyFillType.pftEvenOdd;
		var result = new Array();
		var c = new ClipperLib.Clipper(0);
		c.StrictlySimple = true;
		c.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
		c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
		return result;
	};

	ClipperLib.Clipper.DistanceSqrd = function (pt1, pt2)
	{
		var dx = (pt1.X - pt2.X);
		var dy = (pt1.Y - pt2.Y);
		return (dx * dx + dy * dy);
	};

	ClipperLib.Clipper.DistanceFromLineSqrd = function (pt, ln1, ln2)
	{
		//The equation of a line in general form (Ax + By + C = 0)
		//given 2 points (x¹,y¹) & (x²,y²) is ...
		//(y¹ - y²)x + (x² - x¹)y + (y² - y¹)x¹ - (x² - x¹)y¹ = 0
		//A = (y¹ - y²); B = (x² - x¹); C = (y² - y¹)x¹ - (x² - x¹)y¹
		//perpendicular distance of point (x³,y³) = (Ax³ + By³ + C)/Sqrt(A² + B²)
		//see http://en.wikipedia.org/wiki/Perpendicular_distance
		var A = ln1.Y - ln2.Y;
		var B = ln2.X - ln1.X;
		var C = A * ln1.X + B * ln1.Y;
		C = A * pt.X + B * pt.Y - C;
		return (C * C) / (A * A + B * B);
	};

	ClipperLib.Clipper.SlopesNearCollinear = function (pt1, pt2, pt3, distSqrd)
	{
		//this function is more accurate when the point that's GEOMETRICALLY
		//between the other 2 points is the one that's tested for distance.
		//nb: with 'spikes', either pt1 or pt3 is geometrically between the other pts
		if (Math.abs(pt1.X - pt2.X) > Math.abs(pt1.Y - pt2.Y))
		{
			if ((pt1.X > pt2.X) === (pt1.X < pt3.X))
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
			else if ((pt2.X > pt1.X) === (pt2.X < pt3.X))
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
			else
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
		}
		else
		{
			if ((pt1.Y > pt2.Y) === (pt1.Y < pt3.Y))
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
			else if ((pt2.Y > pt1.Y) === (pt2.Y < pt3.Y))
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
			else
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
		}
	}

	ClipperLib.Clipper.PointsAreClose = function (pt1, pt2, distSqrd)
	{
		var dx = pt1.X - pt2.X;
		var dy = pt1.Y - pt2.Y;
		return ((dx * dx) + (dy * dy) <= distSqrd);
	};

	ClipperLib.Clipper.ExcludeOp = function (op)
	{
		var result = op.Prev;
		result.Next = op.Next;
		op.Next.Prev = result;
		result.Idx = 0;
		return result;
	};

	ClipperLib.Clipper.CleanPolygon = function (path, distance)
	{
		if (typeof (distance) === "undefined") distance = 1.415;
		//distance = proximity in units/pixels below which vertices will be stripped.
		//Default ~= sqrt(2) so when adjacent vertices or semi-adjacent vertices have
		//both x & y coords within 1 unit, then the second vertex will be stripped.
		var cnt = path.length;
		if (cnt === 0)
			return new Array();
		var outPts = new Array(cnt);
		for (var i = 0; i < cnt; ++i)
			outPts[i] = new ClipperLib.OutPt();
		for (var i = 0; i < cnt; ++i)
		{
			outPts[i].Pt = path[i];
			outPts[i].Next = outPts[(i + 1) % cnt];
			outPts[i].Next.Prev = outPts[i];
			outPts[i].Idx = 0;
		}
		var distSqrd = distance * distance;
		var op = outPts[0];
		while (op.Idx === 0 && op.Next !== op.Prev)
		{
			if (ClipperLib.Clipper.PointsAreClose(op.Pt, op.Prev.Pt, distSqrd))
			{
				op = ClipperLib.Clipper.ExcludeOp(op);
				cnt--;
			}
			else if (ClipperLib.Clipper.PointsAreClose(op.Prev.Pt, op.Next.Pt, distSqrd))
			{
				ClipperLib.Clipper.ExcludeOp(op.Next);
				op = ClipperLib.Clipper.ExcludeOp(op);
				cnt -= 2;
			}
			else if (ClipperLib.Clipper.SlopesNearCollinear(op.Prev.Pt, op.Pt, op.Next.Pt, distSqrd))
			{
				op = ClipperLib.Clipper.ExcludeOp(op);
				cnt--;
			}
			else
			{
				op.Idx = 1;
				op = op.Next;
			}
		}
		if (cnt < 3)
			cnt = 0;
		var result = new Array(cnt);
		for (var i = 0; i < cnt; ++i)
		{
			result[i] = new ClipperLib.IntPoint1(op.Pt);
			op = op.Next;
		}
		outPts = null;
		return result;
	};

	ClipperLib.Clipper.CleanPolygons = function (polys, distance)
	{
		var result = new Array(polys.length);
		for (var i = 0, ilen = polys.length; i < ilen; i++)
			result[i] = ClipperLib.Clipper.CleanPolygon(polys[i], distance);
		return result;
	};

	ClipperLib.Clipper.Minkowski = function (pattern, path, IsSum, IsClosed)
	{
		var delta = (IsClosed ? 1 : 0);
		var polyCnt = pattern.length;
		var pathCnt = path.length;
		var result = new Array();
		if (IsSum)
			for (var i = 0; i < pathCnt; i++)
			{
				var p = new Array(polyCnt);
				for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
					p[j] = new ClipperLib.IntPoint2(path[i].X + ip.X, path[i].Y + ip.Y);
				result.push(p);
			}
		else
			for (var i = 0; i < pathCnt; i++)
			{
				var p = new Array(polyCnt);
				for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
					p[j] = new ClipperLib.IntPoint2(path[i].X - ip.X, path[i].Y - ip.Y);
				result.push(p);
			}
		var quads = new Array();
		for (var i = 0; i < pathCnt - 1 + delta; i++)
			for (var j = 0; j < polyCnt; j++)
			{
				var quad = new Array();
				quad.push(result[i % pathCnt][j % polyCnt]);
				quad.push(result[(i + 1) % pathCnt][j % polyCnt]);
				quad.push(result[(i + 1) % pathCnt][(j + 1) % polyCnt]);
				quad.push(result[i % pathCnt][(j + 1) % polyCnt]);
				if (!ClipperLib.Clipper.Orientation(quad))
					quad.reverse();
				quads.push(quad);
			}
		return quads;
	};

	ClipperLib.Clipper.MinkowskiSum = function (pattern, path_or_paths, pathIsClosed)
	{
		if (!(path_or_paths[0] instanceof Array))
		{
			var path = path_or_paths;
			var paths = ClipperLib.Clipper.Minkowski(pattern, path, true, pathIsClosed);
			var c = new ClipperLib.Clipper();
			c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
			c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
			return paths;
		}
		else
		{
			var paths = path_or_paths;
			var solution = new ClipperLib.Paths();
			var c = new ClipperLib.Clipper();
			for (var i = 0; i < paths.length; ++i)
			{
				var tmp = ClipperLib.Clipper.Minkowski(pattern, paths[i], true, pathIsClosed);
				c.AddPaths(tmp, ClipperLib.PolyType.ptSubject, true);
				if (pathIsClosed)
				{
					var path = ClipperLib.Clipper.TranslatePath(paths[i], pattern[0]);
					c.AddPath(path, ClipperLib.PolyType.ptClip, true);
				}
			}
			c.Execute(ClipperLib.ClipType.ctUnion, solution,
				ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
			return solution;
		}
	}

	ClipperLib.Clipper.TranslatePath = function (path, delta)
	{
		var outPath = new ClipperLib.Path();
		for (var i = 0; i < path.length; i++)
			outPath.push(new ClipperLib.IntPoint2(path[i].X + delta.X, path[i].Y + delta.Y));
		return outPath;
	}

	ClipperLib.Clipper.MinkowskiDiff = function (poly1, poly2)
	{
		var paths = ClipperLib.Clipper.Minkowski(poly1, poly2, false, true);
		var c = new ClipperLib.Clipper();
		c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
		c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
		return paths;
	}

	ClipperLib.Clipper.PolyTreeToPaths = function (polytree)
	{
		var result = new Array();
		//result.set_Capacity(polytree.get_Total());
		ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntAny, result);
		return result;
	};

	ClipperLib.Clipper.AddPolyNodeToPaths = function (polynode, nt, paths)
	{
		var match = true;
		switch (nt)
		{
		case ClipperLib.Clipper.NodeType.ntOpen:
			return;
		case ClipperLib.Clipper.NodeType.ntClosed:
			match = !polynode.IsOpen;
			break;
		default:
			break;
		}
		if (polynode.m_polygon.length > 0 && match)
			paths.push(polynode.m_polygon);
		for (var $i3 = 0, $t3 = polynode.Childs(), $l3 = $t3.length, pn = $t3[$i3]; $i3 < $l3; $i3++, pn = $t3[$i3])
			ClipperLib.Clipper.AddPolyNodeToPaths(pn, nt, paths);
	};

	ClipperLib.Clipper.OpenPathsFromPolyTree = function (polytree)
	{
		var result = new ClipperLib.Paths();
		//result.set_Capacity(polytree.ChildCount());
		for (var i = 0, ilen = polytree.ChildCount(); i < ilen; i++)
			if (polytree.Childs()[i].IsOpen)
				result.push(polytree.Childs()[i].m_polygon);
		return result;
	};

	ClipperLib.Clipper.ClosedPathsFromPolyTree = function (polytree)
	{
		var result = new ClipperLib.Paths();
		//result.set_Capacity(polytree.Total());
		ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntClosed, result);
		return result;
	};

	Inherit(ClipperLib.Clipper, ClipperLib.ClipperBase);
	ClipperLib.Clipper.NodeType = {
		ntAny: 0,
		ntOpen: 1,
		ntClosed: 2
	};

	/**
	* @constructor
	*/
	ClipperLib.ClipperOffset = function (miterLimit, arcTolerance)
	{
		if (typeof (miterLimit) === "undefined") miterLimit = 2;
		if (typeof (arcTolerance) === "undefined") arcTolerance = ClipperLib.ClipperOffset.def_arc_tolerance;
		this.m_destPolys = new ClipperLib.Paths();
		this.m_srcPoly = new ClipperLib.Path();
		this.m_destPoly = new ClipperLib.Path();
		this.m_normals = new Array();
		this.m_delta = 0;
		this.m_sinA = 0;
		this.m_sin = 0;
		this.m_cos = 0;
		this.m_miterLim = 0;
		this.m_StepsPerRad = 0;
		this.m_lowest = new ClipperLib.IntPoint0();
		this.m_polyNodes = new ClipperLib.PolyNode();
		this.MiterLimit = miterLimit;
		this.ArcTolerance = arcTolerance;
		this.m_lowest.X = -1;
	};

	ClipperLib.ClipperOffset.two_pi = 6.28318530717959;
	ClipperLib.ClipperOffset.def_arc_tolerance = 0.25;
	ClipperLib.ClipperOffset.prototype.Clear = function ()
	{
		ClipperLib.Clear(this.m_polyNodes.Childs());
		this.m_lowest.X = -1;
	};

	ClipperLib.ClipperOffset.Round = ClipperLib.Clipper.Round;
	ClipperLib.ClipperOffset.prototype.AddPath = function (path, joinType, endType)
	{
		var highI = path.length - 1;
		if (highI < 0)
			return;
		var newNode = new ClipperLib.PolyNode();
		newNode.m_jointype = joinType;
		newNode.m_endtype = endType;
		//strip duplicate points from path and also get index to the lowest point ...
		if (endType === ClipperLib.EndType.etClosedLine || endType === ClipperLib.EndType.etClosedPolygon)
			while (highI > 0 && ClipperLib.IntPoint.op_Equality(path[0], path[highI]))
				highI--;
		//newNode.m_polygon.set_Capacity(highI + 1);
		newNode.m_polygon.push(path[0]);
		var j = 0,
			k = 0;
		for (var i = 1; i <= highI; i++)
			if (ClipperLib.IntPoint.op_Inequality(newNode.m_polygon[j], path[i]))
			{
				j++;
				newNode.m_polygon.push(path[i]);
				if (path[i].Y > newNode.m_polygon[k].Y || (path[i].Y === newNode.m_polygon[k].Y && path[i].X < newNode.m_polygon[k].X))
					k = j;
			}
		if (endType === ClipperLib.EndType.etClosedPolygon && j < 2) return;

		this.m_polyNodes.AddChild(newNode);
		//if this path's lowest pt is lower than all the others then update m_lowest
		if (endType !== ClipperLib.EndType.etClosedPolygon)
			return;
		if (this.m_lowest.X < 0)
			this.m_lowest = new ClipperLib.IntPoint2(this.m_polyNodes.ChildCount() - 1, k);
		else
		{
			var ip = this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y];
			if (newNode.m_polygon[k].Y > ip.Y || (newNode.m_polygon[k].Y === ip.Y && newNode.m_polygon[k].X < ip.X))
				this.m_lowest = new ClipperLib.IntPoint2(this.m_polyNodes.ChildCount() - 1, k);
		}
	};

	ClipperLib.ClipperOffset.prototype.AddPaths = function (paths, joinType, endType)
	{
		for (var i = 0, ilen = paths.length; i < ilen; i++)
			this.AddPath(paths[i], joinType, endType);
	};

	ClipperLib.ClipperOffset.prototype.FixOrientations = function ()
	{
		//fixup orientations of all closed paths if the orientation of the
		//closed path with the lowermost vertex is wrong ...
		if (this.m_lowest.X >= 0 && !ClipperLib.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))
		{
			for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
			{
				var node = this.m_polyNodes.Childs()[i];
				if (node.m_endtype === ClipperLib.EndType.etClosedPolygon || (node.m_endtype === ClipperLib.EndType.etClosedLine && ClipperLib.Clipper.Orientation(node.m_polygon)))
					node.m_polygon.reverse();
			}
		}
		else
		{
			for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
			{
				var node = this.m_polyNodes.Childs()[i];
				if (node.m_endtype === ClipperLib.EndType.etClosedLine && !ClipperLib.Clipper.Orientation(node.m_polygon))
					node.m_polygon.reverse();
			}
		}
	};

	ClipperLib.ClipperOffset.GetUnitNormal = function (pt1, pt2)
	{
		var dx = (pt2.X - pt1.X);
		var dy = (pt2.Y - pt1.Y);
		if ((dx === 0) && (dy === 0))
			return new ClipperLib.DoublePoint2(0, 0);
		var f = 1 / Math.sqrt(dx * dx + dy * dy);
		dx *= f;
		dy *= f;
		return new ClipperLib.DoublePoint2(dy, -dx);
	};

	ClipperLib.ClipperOffset.prototype.DoOffset = function (delta)
	{
		this.m_destPolys = new Array();
		this.m_delta = delta;
		//if Zero offset, just copy any CLOSED polygons to m_p and return ...
		if (ClipperLib.ClipperBase.near_zero(delta))
		{
			//this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount);
			for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
			{
				var node = this.m_polyNodes.Childs()[i];
				if (node.m_endtype === ClipperLib.EndType.etClosedPolygon)
					this.m_destPolys.push(node.m_polygon);
			}
			return;
		}
		//see offset_triginometry3.svg in the documentation folder ...
		if (this.MiterLimit > 2)
			this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit);
		else
			this.m_miterLim = 0.5;
		var y;
		if (this.ArcTolerance <= 0)
			y = ClipperLib.ClipperOffset.def_arc_tolerance;
		else if (this.ArcTolerance > Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance)
			y = Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance;
		else
			y = this.ArcTolerance;
		//see offset_triginometry2.svg in the documentation folder ...
		var steps = 3.14159265358979 / Math.acos(1 - y / Math.abs(delta));
		this.m_sin = Math.sin(ClipperLib.ClipperOffset.two_pi / steps);
		this.m_cos = Math.cos(ClipperLib.ClipperOffset.two_pi / steps);
		this.m_StepsPerRad = steps / ClipperLib.ClipperOffset.two_pi;
		if (delta < 0)
			this.m_sin = -this.m_sin;
		//this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount * 2);
		for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
		{
			var node = this.m_polyNodes.Childs()[i];
			this.m_srcPoly = node.m_polygon;
			var len = this.m_srcPoly.length;
			if (len === 0 || (delta <= 0 && (len < 3 || node.m_endtype !== ClipperLib.EndType.etClosedPolygon)))
				continue;
			this.m_destPoly = new Array();
			if (len === 1)
			{
				if (node.m_jointype === ClipperLib.JoinType.jtRound)
				{
					var X = 1,
						Y = 0;
					for (var j = 1; j <= steps; j++)
					{
						this.m_destPoly.push(new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
						var X2 = X;
						X = X * this.m_cos - this.m_sin * Y;
						Y = X2 * this.m_sin + Y * this.m_cos;
					}
				}
				else
				{
					var X = -1,
						Y = -1;
					for (var j = 0; j < 4; ++j)
					{
						this.m_destPoly.push(new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
						if (X < 0)
							X = 1;
						else if (Y < 0)
							Y = 1;
						else
							X = -1;
					}
				}
				this.m_destPolys.push(this.m_destPoly);
				continue;
			}
			//build m_normals ...
			this.m_normals.length = 0;
			//this.m_normals.set_Capacity(len);
			for (var j = 0; j < len - 1; j++)
				this.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this.m_srcPoly[j], this.m_srcPoly[j + 1]));
			if (node.m_endtype === ClipperLib.EndType.etClosedLine || node.m_endtype === ClipperLib.EndType.etClosedPolygon)
				this.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this.m_srcPoly[len - 1], this.m_srcPoly[0]));
			else
				this.m_normals.push(new ClipperLib.DoublePoint1(this.m_normals[len - 2]));
			if (node.m_endtype === ClipperLib.EndType.etClosedPolygon)
			{
				var k = len - 1;
				for (var j = 0; j < len; j++)
					k = this.OffsetPoint(j, k, node.m_jointype);
				this.m_destPolys.push(this.m_destPoly);
			}
			else if (node.m_endtype === ClipperLib.EndType.etClosedLine)
			{
				var k = len - 1;
				for (var j = 0; j < len; j++)
					k = this.OffsetPoint(j, k, node.m_jointype);
				this.m_destPolys.push(this.m_destPoly);
				this.m_destPoly = new Array();
				//re-build m_normals ...
				var n = this.m_normals[len - 1];
				for (var j = len - 1; j > 0; j--)
					this.m_normals[j] = new ClipperLib.DoublePoint2(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
				this.m_normals[0] = new ClipperLib.DoublePoint2(-n.X, -n.Y);
				k = 0;
				for (var j = len - 1; j >= 0; j--)
					k = this.OffsetPoint(j, k, node.m_jointype);
				this.m_destPolys.push(this.m_destPoly);
			}
			else
			{
				var k = 0;
				for (var j = 1; j < len - 1; ++j)
					k = this.OffsetPoint(j, k, node.m_jointype);
				var pt1;
				if (node.m_endtype === ClipperLib.EndType.etOpenButt)
				{
					var j = len - 1;
					pt1 = new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * delta));
					this.m_destPoly.push(pt1);
					pt1 = new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X - this.m_normals[j].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y - this.m_normals[j].Y * delta));
					this.m_destPoly.push(pt1);
				}
				else
				{
					var j = len - 1;
					k = len - 2;
					this.m_sinA = 0;
					this.m_normals[j] = new ClipperLib.DoublePoint2(-this.m_normals[j].X, -this.m_normals[j].Y);
					if (node.m_endtype === ClipperLib.EndType.etOpenSquare)
						this.DoSquare(j, k);
					else
						this.DoRound(j, k);
				}
				//re-build m_normals ...
				for (var j = len - 1; j > 0; j--)
					this.m_normals[j] = new ClipperLib.DoublePoint2(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
				this.m_normals[0] = new ClipperLib.DoublePoint2(-this.m_normals[1].X, -this.m_normals[1].Y);
				k = len - 1;
				for (var j = k - 1; j > 0; --j)
					k = this.OffsetPoint(j, k, node.m_jointype);
				if (node.m_endtype === ClipperLib.EndType.etOpenButt)
				{
					pt1 = new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X - this.m_normals[0].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y - this.m_normals[0].Y * delta));
					this.m_destPoly.push(pt1);
					pt1 = new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + this.m_normals[0].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + this.m_normals[0].Y * delta));
					this.m_destPoly.push(pt1);
				}
				else
				{
					k = 1;
					this.m_sinA = 0;
					if (node.m_endtype === ClipperLib.EndType.etOpenSquare)
						this.DoSquare(0, 1);
					else
						this.DoRound(0, 1);
				}
				this.m_destPolys.push(this.m_destPoly);
			}
		}
	};

	ClipperLib.ClipperOffset.prototype.Execute = function ()
	{
		var a = arguments,
			ispolytree = a[0] instanceof ClipperLib.PolyTree;
		if (!ispolytree) // function (solution, delta)
		{
			var solution = a[0],
				delta = a[1];
			ClipperLib.Clear(solution);
			this.FixOrientations();
			this.DoOffset(delta);
			//now clean up 'corners' ...
			var clpr = new ClipperLib.Clipper(0);
			clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
			if (delta > 0)
			{
				clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
			}
			else
			{
				var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
				var outer = new ClipperLib.Path();
				outer.push(new ClipperLib.IntPoint2(r.left - 10, r.bottom + 10));
				outer.push(new ClipperLib.IntPoint2(r.right + 10, r.bottom + 10));
				outer.push(new ClipperLib.IntPoint2(r.right + 10, r.top - 10));
				outer.push(new ClipperLib.IntPoint2(r.left - 10, r.top - 10));
				clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
				clpr.ReverseSolution = true;
				clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
				if (solution.length > 0)
					solution.splice(0, 1);
			}
			//console.log(JSON.stringify(solution));
		}
		else // function (polytree, delta)
		{
			var solution = a[0],
				delta = a[1];
			solution.Clear();
			this.FixOrientations();
			this.DoOffset(delta);
			//now clean up 'corners' ...
			var clpr = new ClipperLib.Clipper(0);
			clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
			if (delta > 0)
			{
				clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
			}
			else
			{
				var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
				var outer = new ClipperLib.Path();
				outer.push(new ClipperLib.IntPoint2(r.left - 10, r.bottom + 10));
				outer.push(new ClipperLib.IntPoint2(r.right + 10, r.bottom + 10));
				outer.push(new ClipperLib.IntPoint2(r.right + 10, r.top - 10));
				outer.push(new ClipperLib.IntPoint2(r.left - 10, r.top - 10));
				clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
				clpr.ReverseSolution = true;
				clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
				//remove the outer PolyNode rectangle ...
				if (solution.ChildCount() === 1 && solution.Childs()[0].ChildCount() > 0)
				{
					var outerNode = solution.Childs()[0];
					//solution.Childs.set_Capacity(outerNode.ChildCount);
					solution.Childs()[0] = outerNode.Childs()[0];
					solution.Childs()[0].m_Parent = solution;
					for (var i = 1; i < outerNode.ChildCount(); i++)
						solution.AddChild(outerNode.Childs()[i]);
				}
				else
					solution.Clear();
			}
		}
	};

	ClipperLib.ClipperOffset.prototype.OffsetPoint = function (j, k, jointype)
	{
		//cross product ...
		this.m_sinA = (this.m_normals[k].X * this.m_normals[j].Y - this.m_normals[j].X * this.m_normals[k].Y);

		if (Math.abs(this.m_sinA * this.m_delta) < 1.0)
		{
			//dot product ...
			var cosA = (this.m_normals[k].X * this.m_normals[j].X + this.m_normals[j].Y * this.m_normals[k].Y);
			if (cosA > 0) // angle ==> 0 degrees
			{
				this.m_destPoly.push(new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
					ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)));
				return k;
			}
			//else angle ==> 180 degrees
		}
		else if (this.m_sinA > 1)
			this.m_sinA = 1.0;
		else if (this.m_sinA < -1)
			this.m_sinA = -1.0;
		if (this.m_sinA * this.m_delta < 0)
		{
			this.m_destPoly.push(new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
				ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)));
			this.m_destPoly.push(new ClipperLib.IntPoint1(this.m_srcPoly[j]));
			this.m_destPoly.push(new ClipperLib.IntPoint2(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
				ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)));
		}
		else
			switch (jointype)
			{
			case ClipperLib.JoinType.jtMiter:
				{
					var r = 1 + (this.m_normals[j].X * this.m_normals[k].X + this.m_normals[j].Y * this.m_normals[k].Y);
					if (r >= this.m_miterLim)
						this.DoMiter(j, k, r);
					else
						this.DoSquare(j, k);
					break;
				}
			case ClipperLib.JoinType.jtSquare:
				this.DoSquare(j, k);
				break;
			case ClipperLib.JoinType.jtRound:
				this.DoRound(j, k);
				break;
			}
		k = j;
		return k;
	};

	ClipperLib.ClipperOffset.prototype.DoSquare = function (j, k)
	{
		var dx = Math.tan(Math.atan2(this.m_sinA,
			this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y) / 4);
		this.m_destPoly.push(new ClipperLib.IntPoint2(
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[k].X - this.m_normals[k].Y * dx)),
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[k].Y + this.m_normals[k].X * dx))));
		this.m_destPoly.push(new ClipperLib.IntPoint2(
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[j].X + this.m_normals[j].Y * dx)),
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[j].Y - this.m_normals[j].X * dx))));
	};

	ClipperLib.ClipperOffset.prototype.DoMiter = function (j, k, r)
	{
		var q = this.m_delta / r;
		this.m_destPoly.push(new ClipperLib.IntPoint2(
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + (this.m_normals[k].X + this.m_normals[j].X) * q),
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + (this.m_normals[k].Y + this.m_normals[j].Y) * q)));
	};

	ClipperLib.ClipperOffset.prototype.DoRound = function (j, k)
	{
		var a = Math.atan2(this.m_sinA,
			this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y);

		var steps = Math.max(ClipperLib.Cast_Int32(ClipperLib.ClipperOffset.Round(this.m_StepsPerRad * Math.abs(a))), 1);

		var X = this.m_normals[k].X,
			Y = this.m_normals[k].Y,
			X2;
		for (var i = 0; i < steps; ++i)
		{
			this.m_destPoly.push(new ClipperLib.IntPoint2(
				ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + X * this.m_delta),
				ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + Y * this.m_delta)));
			X2 = X;
			X = X * this.m_cos - this.m_sin * Y;
			Y = X2 * this.m_sin + Y * this.m_cos;
		}
		this.m_destPoly.push(new ClipperLib.IntPoint2(
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
			ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)));
	};

	ClipperLib.Error = function (message)
	{
		try
		{
			throw new Error(message);
		}
		catch (err)
		{
			alert(err.message);
		}
	};

	// ---------------------------------------------

	// JS extension by Timo 2013
	ClipperLib.JS = {};

	ClipperLib.JS.AreaOfPolygon = function (poly, scale)
	{
		if (!scale) scale = 1;
		return ClipperLib.Clipper.Area(poly) / (scale * scale);
	};

	ClipperLib.JS.AreaOfPolygons = function (poly, scale)
	{
		if (!scale) scale = 1;
		var area = 0;
		for (var i = 0; i < poly.length; i++)
		{
			area += ClipperLib.Clipper.Area(poly[i]);
		}
		return area / (scale * scale);
	};

	ClipperLib.JS.BoundsOfPath = function (path, scale)
	{
		return ClipperLib.JS.BoundsOfPaths([path], scale);
	};

	ClipperLib.JS.BoundsOfPaths = function (paths, scale)
	{
		if (!scale) scale = 1;
		var bounds = ClipperLib.Clipper.GetBounds(paths);
		bounds.left /= scale;
		bounds.bottom /= scale;
		bounds.right /= scale;
		bounds.top /= scale;
		return bounds;
	};

	// Clean() joins vertices that are too near each other
	// and causes distortion to offsetted polygons without cleaning
	ClipperLib.JS.Clean = function (polygon, delta)
	{
		if (!(polygon instanceof Array)) return [];
		var isPolygons = polygon[0] instanceof Array;
		var polygon = ClipperLib.JS.Clone(polygon);
		if (typeof delta !== "number" || delta === null)
		{
			ClipperLib.Error("Delta is not a number in Clean().");
			return polygon;
		}
		if (polygon.length === 0 || (polygon.length === 1 && polygon[0].length === 0) || delta < 0) return polygon;
		if (!isPolygons) polygon = [polygon];
		var k_length = polygon.length;
		var len, poly, result, d, p, j, i;
		var results = [];
		for (var k = 0; k < k_length; k++)
		{
			poly = polygon[k];
			len = poly.length;
			if (len === 0) continue;
			else if (len < 3)
			{
				result = poly;
				results.push(result);
				continue;
			}
			result = poly;
			d = delta * delta;
			//d = Math.floor(c_delta * c_delta);
			p = poly[0];
			j = 1;
			for (i = 1; i < len; i++)
			{
				if ((poly[i].X - p.X) * (poly[i].X - p.X) +
					(poly[i].Y - p.Y) * (poly[i].Y - p.Y) <= d)
					continue;
				result[j] = poly[i];
				p = poly[i];
				j++;
			}
			p = poly[j - 1];
			if ((poly[0].X - p.X) * (poly[0].X - p.X) +
				(poly[0].Y - p.Y) * (poly[0].Y - p.Y) <= d)
				j--;
			if (j < len)
				result.splice(j, len - j);
			if (result.length) results.push(result);
		}
		if (!isPolygons && results.length) results = results[0];
		else if (!isPolygons && results.length === 0) results = [];
		else if (isPolygons && results.length === 0) results = [
			[]
		];
		return results;
	}
	// Make deep copy of Polygons or Polygon
	// so that also IntPoint objects are cloned and not only referenced
	// This should be the fastest way
	ClipperLib.JS.Clone = function (polygon)
	{
		if (!(polygon instanceof Array)) return [];
		if (polygon.length === 0) return [];
		else if (polygon.length === 1 && polygon[0].length === 0) return [
			[]
		];
		var isPolygons = polygon[0] instanceof Array;
		if (!isPolygons) polygon = [polygon];
		var len = polygon.length,
			plen, i, j, result;
		var results = new Array(len);
		for (i = 0; i < len; i++)
		{
			plen = polygon[i].length;
			result = new Array(plen);
			for (j = 0; j < plen; j++)
			{
				result[j] = {
					X: polygon[i][j].X,
					Y: polygon[i][j].Y
				};

			}
			results[i] = result;
		}
		if (!isPolygons) results = results[0];
		return results;
	};

	// Removes points that doesn't affect much to the visual appearance.
	// If middle point is at or under certain distance (tolerance) of the line segment between
	// start and end point, the middle point is removed.
	ClipperLib.JS.Lighten = function (polygon, tolerance)
	{
		if (!(polygon instanceof Array)) return [];
		if (typeof tolerance !== "number" || tolerance === null)
		{
			ClipperLib.Error("Tolerance is not a number in Lighten().")
			return ClipperLib.JS.Clone(polygon);
		}
		if (polygon.length === 0 || (polygon.length === 1 && polygon[0].length === 0) || tolerance < 0)
		{
			return ClipperLib.JS.Clone(polygon);
		}
		var isPolygons = polygon[0] instanceof Array;
		if (!isPolygons) polygon = [polygon];
		var i, j, poly, k, poly2, plen, A, B, P, d, rem, addlast;
		var bxax, byay, l, ax, ay;
		var len = polygon.length;
		var toleranceSq = tolerance * tolerance;
		var results = [];
		for (i = 0; i < len; i++)
		{
			poly = polygon[i];
			plen = poly.length;
			if (plen === 0) continue;
			for (k = 0; k < 1000000; k++) // could be forever loop, but wiser to restrict max repeat count
			{
				poly2 = [];
				plen = poly.length;
				// the first have to added to the end, if first and last are not the same
				// this way we ensure that also the actual last point can be removed if needed
				if (poly[plen - 1].X !== poly[0].X || poly[plen - 1].Y !== poly[0].Y)
				{
					addlast = 1;
					poly.push(
					{
						X: poly[0].X,
						Y: poly[0].Y
					});
					plen = poly.length;
				}
				else addlast = 0;
				rem = []; // Indexes of removed points
				for (j = 0; j < plen - 2; j++)
				{
					A = poly[j]; // Start point of line segment
					P = poly[j + 1]; // Middle point. This is the one to be removed.
					B = poly[j + 2]; // End point of line segment
					ax = A.X;
					ay = A.Y;
					bxax = B.X - ax;
					byay = B.Y - ay;
					if (bxax !== 0 || byay !== 0) // To avoid Nan, when A==P && P==B. And to avoid peaks (A==B && A!=P), which have lenght, but not area.
					{
						l = ((P.X - ax) * bxax + (P.Y - ay) * byay) / (bxax * bxax + byay * byay);
						if (l > 1)
						{
							ax = B.X;
							ay = B.Y;
						}
						else if (l > 0)
						{
							ax += bxax * l;
							ay += byay * l;
						}
					}
					bxax = P.X - ax;
					byay = P.Y - ay;
					d = bxax * bxax + byay * byay;
					if (d <= toleranceSq)
					{
						rem[j + 1] = 1;
						j++; // when removed, transfer the pointer to the next one
					}
				}
				// add all unremoved points to poly2
				poly2.push(
				{
					X: poly[0].X,
					Y: poly[0].Y
				});
				for (j = 1; j < plen - 1; j++)
					if (!rem[j]) poly2.push(
					{
						X: poly[j].X,
						Y: poly[j].Y
					});
				poly2.push(
				{
					X: poly[plen - 1].X,
					Y: poly[plen - 1].Y
				});
				// if the first point was added to the end, remove it
				if (addlast) poly.pop();
				// break, if there was not anymore removed points
				if (!rem.length) break;
				// else continue looping using poly2, to check if there are points to remove
				else poly = poly2;
			}
			plen = poly2.length;
			// remove duplicate from end, if needed
			if (poly2[plen - 1].X === poly2[0].X && poly2[plen - 1].Y === poly2[0].Y)
			{
				poly2.pop();
			}
			if (poly2.length > 2) // to avoid two-point-polygons
				results.push(poly2);
		}
		if (!isPolygons)
		{
			results = results[0];
		}
		if (typeof (results) === "undefined")
		{
			results = [];
		}
		return results;
	}

	ClipperLib.JS.PerimeterOfPath = function (path, closed, scale)
	{
		if (typeof (path) === "undefined") return 0;
		var sqrt = Math.sqrt;
		var perimeter = 0.0;
		var p1, p2, p1x = 0.0,
			p1y = 0.0,
			p2x = 0.0,
			p2y = 0.0;
		var j = path.length;
		if (j < 2) return 0;
		if (closed)
		{
			path[j] = path[0];
			j++;
		}
		while (--j)
		{
			p1 = path[j];
			p1x = p1.X;
			p1y = p1.Y;
			p2 = path[j - 1];
			p2x = p2.X;
			p2y = p2.Y;
			perimeter += sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
		}
		if (closed) path.pop();
		return perimeter / scale;
	};

	ClipperLib.JS.PerimeterOfPaths = function (paths, closed, scale)
	{
		if (!scale) scale = 1;
		var perimeter = 0;
		for (var i = 0; i < paths.length; i++)
		{
			perimeter += ClipperLib.JS.PerimeterOfPath(paths[i], closed, scale);
		}
		return perimeter;
	};

	ClipperLib.JS.ScaleDownPath = function (path, scale)
	{
		var i, p;
		if (!scale) scale = 1;
		i = path.length;
		while (i--)
		{
			p = path[i];
			p.X = p.X / scale;
			p.Y = p.Y / scale;
		}
	};

	ClipperLib.JS.ScaleDownPaths = function (paths, scale)
	{
		var i, j, p;
		if (!scale) scale = 1;
		i = paths.length;
		while (i--)
		{
			j = paths[i].length;
			while (j--)
			{
				p = paths[i][j];
				p.X = p.X / scale;
				p.Y = p.Y / scale;
			}
		}
	};

	ClipperLib.JS.ScaleUpPath = function (path, scale)
	{
		var i, p, round = Math.round;
		if (!scale) scale = 1;
		i = path.length;
		while (i--)
		{
			p = path[i];
			p.X = round(p.X * scale);
			p.Y = round(p.Y * scale);
		}
	};

	ClipperLib.JS.ScaleUpPaths = function (paths, scale)
	{
		var i, j, p, round = Math.round;
		if (!scale) scale = 1;
		i = paths.length;
		while (i--)
		{
			j = paths[i].length;
			while (j--)
			{
				p = paths[i][j];
				p.X = round(p.X * scale);
				p.Y = round(p.Y * scale);
			}
		}
	};

	/**
	* @constructor
	*/
	ClipperLib.ExPolygons = function ()
	{
		return [];
	}
	/**
	* @constructor
	*/
	ClipperLib.ExPolygon = function ()
	{
		this.outer = null;
		this.holes = null;
	};

	ClipperLib.JS.AddOuterPolyNodeToExPolygons = function (polynode, expolygons)
	{
		var ep = new ClipperLib.ExPolygon();
		ep.outer = polynode.Contour();
		var childs = polynode.Childs();
		var ilen = childs.length;
		ep.holes = new Array(ilen);
		var node, n, i, j, childs2, jlen;
		for (i = 0; i < ilen; i++)
		{
			node = childs[i];
			ep.holes[i] = node.Contour();
			//Add outer polygons contained by (nested within) holes ...
			for (j = 0, childs2 = node.Childs(), jlen = childs2.length; j < jlen; j++)
			{
				n = childs2[j];
				ClipperLib.JS.AddOuterPolyNodeToExPolygons(n, expolygons);
			}
		}
		expolygons.push(ep);
	};

	ClipperLib.JS.ExPolygonsToPaths = function (expolygons)
	{
		var a, i, alen, ilen;
		var paths = new ClipperLib.Paths();
		for (a = 0, alen = expolygons.length; a < alen; a++)
		{
			paths.push(expolygons[a].outer);
			for (i = 0, ilen = expolygons[a].holes.length; i < ilen; i++)
			{
				paths.push(expolygons[a].holes[i]);
			}
		}
		return paths;
	}
	ClipperLib.JS.PolyTreeToExPolygons = function (polytree)
	{
		var expolygons = new ClipperLib.ExPolygons();
		var node, i, childs, ilen;
		for (i = 0, childs = polytree.Childs(), ilen = childs.length; i < ilen; i++)
		{
			node = childs[i];
			ClipperLib.JS.AddOuterPolyNodeToExPolygons(node, expolygons);
		}
		return expolygons;
	};

})();

module.exports.Error = message => { throw new Error(message); };
return module.exports;
})();
/* Shared serial queue. A rate limit pauses the endpoint instead of replaying work. */
function createAITransport(send, fetcher) {
  let tail=Promise.resolve(),lastStart=0;
  const cancelled=new Set(),controllers=new Map(),cooldowns=new Map();
  const limited=(until)=>Object.assign(new Error(`AI 请求受限，已暂停。请在 ${Math.max(1,Math.ceil((until-Date.now())/1000))} 秒后点击继续解析；已完成结果会保留。`),{status:429,retryAt:until});
  const pause=(ms,id)=>new Promise((resolve,reject)=>{
    const end=Date.now()+ms;const tick=()=>{if(cancelled.has(id))return reject(new Error('已取消'));if(Date.now()>=end)return resolve();setTimeout(tick,Math.min(250,end-Date.now()));};tick();
  });
  async function execute({reqId,url,options}) {
    if(!/^https:\/\//i.test(url||''))throw new Error('AI 请求仅允许 HTTPS 地址');
    if(cancelled.has(reqId))throw new Error('已取消');
    const endpoint=url.replace(/\/+$/,'');
    if((cooldowns.get(endpoint)||0)>Date.now())throw limited(cooldowns.get(endpoint));
    await pause(Math.max(0,1000-(Date.now()-lastStart)),reqId);
    if(cancelled.has(reqId))throw new Error('已取消');
    lastStart=Date.now();
    const controller=typeof AbortController==='function'?new AbortController():null;
    if(controller)controllers.set(reqId,controller);
    let timer,response,data;
    try {
      const result=await Promise.race([(async()=>{const response=await fetcher(url,{...options,...(controller?{signal:controller.signal}:{})});return {response,raw:await response.text()};})(),new Promise((_,reject)=>{timer=setTimeout(()=>{controller?.abort();reject(new Error('AI 响应超时，已完成结果会保留，可继续解析'))},120000)})]);
      response=result.response;try{data=JSON.parse(result.raw)}catch(_){data=result.raw;}
    } finally {clearTimeout(timer);controllers.delete(reqId);}
    if(cancelled.has(reqId))throw new Error('已取消');
    const reportedStatus=Number(data?.error?.status||data?.error?.code||data?.statusCode);
    if(response.status===429||reportedStatus===429){
      const header=typeof response.headers?.get==='function'?response.headers.get('retry-after'):Object.entries(response.headersObject||response.headers||{}).find(([key])=>key.toLowerCase()==='retry-after')?.[1];
      const wait=header?(Number.isFinite(Number(header))?Number(header)*1000:Date.parse(header)-Date.now()):30000;
      const until=Date.now()+Math.max(1000,Number.isFinite(wait)?wait:30000);cooldowns.set(endpoint,until);throw limited(until);
    }
    if(response.ok)return data;
    const detail=typeof data==='string'?data:data?.error?.message||data?.message||'';
    throw Object.assign(new Error(`HTTP ${response.status}${detail?' · '+String(detail).slice(0,240):''}`),{status:response.status});
  }
  return {
    request(message){
      send({type:'api-progress',reqId:message.reqId,message:'AI 请求已排队，请保持插件打开。'});
      tail=tail.then(()=>execute(message)).then(data=>send({type:'api-response',reqId:message.reqId,data}),error=>send({type:'api-response',reqId:message.reqId,error:String(error.message||error),status:error.status,retryAt:error.retryAt})).finally(()=>cancelled.delete(message.reqId));
      return tail;
    },
    cancel(id){cancelled.add(id);controllers.get(id)?.abort();if(cancelled.size>1000)cancelled.delete(cancelled.values().next().value);}
  };
}

/* Pure layer rules shared by both hosts and behavioral regression tests. */
const LayerRules = (() => {
  function walk(roots, includeRoots = true) {
    const result = [], seen = new Set(), stack = [...roots].reverse();
    const rootIds = new Set(roots.map(n => n.id));
    while (stack.length) {
      const node = stack.pop();
      if (!node || node.removed || seen.has(node.id)) continue;
      seen.add(node.id);
      if (includeRoots || !rootIds.has(node.id)) result.push(node);
      if ('children' in node) for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
    }
    return result;
  }
  function pool(page, selection, scope) {
    let nodes;
    if (scope === 'page') nodes = walk(page.children);
    else if (!selection.length) nodes = [];
    else if (scope === 'inside') nodes = walk(selection, false);
    else if (scope === 'descendants') nodes = walk(selection, true);
    else if (scope === 'children') nodes = selection.flatMap(n => n.children || []);
    else if (scope === 'sibling') {
      const ids = new Set(selection.map(n => n.id));
      nodes = selection.flatMap(n => n.parent?.children || []).filter(n => !ids.has(n.id));
    } else nodes = [];
    return [...new Map(nodes.filter(n => n && !n.removed).map(n => [n.id, n])).values()];
  }
  function inherited(node, key, value) {
    for (let n = node; n && n.type !== 'PAGE' && n.type !== 'DOCUMENT'; n = n.parent) if ((n[key] ?? n[{visible:'isVisible',locked:'isLocked'}[key]]) === value) return true;
    return false;
  }
  function matches(node, types, states) {
    const visiblePaint = paints => Array.isArray(paints) && paints.some(p => p.visible !== false && p.isVisible !== false && p.opacity !== 0);
    const typeHit = value => value === node.type
      || (value === 'SLOT' && Boolean(node.componentPropertyReferences?.slotContentId))
      || (value === 'AUTOLAYOUT' && typeof (node.layoutMode ?? node.flexMode) === 'string' && (node.layoutMode ?? node.flexMode) !== 'NONE')
      || (value === 'IMAGE' && Array.isArray(node.fills) && node.fills.some(p => p.type === 'IMAGE' && p.visible !== false));
    const stateHit = value => ({
      hidden: () => inherited(node, 'visible', false), locked: () => inherited(node, 'locked', true),
      mask: () => node.isMask === true, export: () => Boolean(node.exportSettings?.length),
      'no-fill': () => Array.isArray(node.fills) && !visiblePaint(node.fills),
      'no-stroke': () => Array.isArray(node.strokes) && !visiblePaint(node.strokes),
      clip: () => node.clipsContent === true, 'no-children': () => Array.isArray(node.children) && node.children.length === 0
    }[value]?.() || false);
    const group = (filter, test) => !filter?.vals?.length || (filter.logic === 'exclude' ? !filter.vals.some(test) : filter.vals.some(test));
    return group(types, typeHit) && group(states, stateHit);
  }
  const props = name => Object.fromEntries(String(name).split(',').flatMap(part => {
    const eq = part.indexOf('='); return eq > 0 ? [[part.slice(0, eq).trim(), part.slice(eq + 1).trim()]] : [];
  }));
  function matrix(nodes, config = {}) {
    if (!nodes.length) throw new Error('组件集为空');
    const dimensions = [...new Set(nodes.flatMap(n => Object.keys(props(n.name))))];
    const x = Array.isArray(config.axesX) && config.axesX.length ? config.axesX : [config.propX || dimensions[0]].filter(Boolean);
    const y = Array.isArray(config.axesY) ? config.axesY : [config.propY || ''].filter(Boolean);
    if (!x.length || [...x,...y].some(p => !dimensions.includes(p)) || new Set([...x,...y]).size !== x.length + y.length) throw new Error('行列属性无效或重复，请重新读取组件集');
    const group = dimensions.filter(p => !x.includes(p) && !y.includes(p));
    const key = (p, keys) => JSON.stringify(keys.map(k => p[k] ?? '—'));
    const values = nodes.map(n => props(n.name));
    const xs = [...new Set(values.map(p => key(p,x)))], ys = [...new Set(values.map(p => key(p,y)))], groups = [...new Set(values.map(p => key(p,group)))];
    const num = (key, fallback) => Number.isFinite(Number(config[key])) ? Math.max(0, Math.min(4096, Number(config[key]))) : fallback;
    const gapX = num('gapX',16), gapY = num('gapY',16), padding = num('padding',20), groupGap = num('groupGap',32);
    const maxW = Math.max(...nodes.map(n => n.width)), maxH = Math.max(...nodes.map(n => n.height));
    const occupancy = new Map();
    values.forEach(p => { const k = key(p,[...x,...y,...group]); occupancy.set(k,(occupancy.get(k)||0)+1); });
    const lanes = Math.max(...occupancy.values()); // Duplicate variant tuples get separate lanes, never overlap.
    const columnWidths = xs.map(k => Math.max(...nodes.filter((n,i)=>key(values[i],x)===k).map(n=>n.width)));
    const rowHeights = ys.map(k => Math.max(...nodes.filter((n,i)=>key(values[i],y)===k).map(n=>n.height)));
    const columnOffsets = columnWidths.map((w,i)=>columnWidths.slice(0,i).reduce((a,b)=>a+b,0)+i*gapX);
    const rowOffsets = rowHeights.map((h,i)=>rowHeights.slice(0,i).reduce((a,b)=>a+lanes*b+(lanes-1)*gapY,0)+i*gapY);
    const groupH = rowHeights.reduce((a,h)=>a+lanes*h,0)+(ys.length*lanes-1)*gapY;
    const used = new Map();
    const placements = nodes.map((node,i) => {
      const p=values[i], k=key(p,[...x,...y,...group]), lane=used.get(k)||0; used.set(k,lane+1);
      const col=xs.indexOf(key(p,x)),row=ys.indexOf(key(p,y));
      return { node, x:padding+columnOffsets[col], y:padding+groups.indexOf(key(p,group))*(groupH+groupGap)+rowOffsets[row]+lane*(rowHeights[row]+gapY) };
    });
    return { placements, width:padding*2+columnWidths.reduce((a,b)=>a+b,0)+(xs.length-1)*gapX, height:padding*2+groups.length*groupH+(groups.length-1)*groupGap, xs, ys, groups, group, x, y, maxW,maxH,gapX,gapY,padding,groupGap,groupH,lanes,columnWidths,columnOffsets,rowHeights,rowOffsets };
  }
  return { walk, pool, matches, props, matrix };
})();

/* Host adapter: snapshot reads and transactional component construction. */
const layerHost = mg;
const layerPlatform = "mastergo";
const layerPage = () => layerPlatform === 'figma' ? layerHost.currentPage : layerHost.document.currentPage;
const layerSend = message => layerHost.ui.postMessage(layerPlatform === 'figma' ? message : { pluginMessage: message });
const layerGet = id => layerPlatform === 'figma' ? layerHost.getNodeByIdAsync(id) : Promise.resolve(layerHost.getNodeById(id));
let layerSeed = [], layerResultIds = '', layerSeedPage = '', layerBusy = false, layerSearchWriting = false;
const layerSnapshots = new Map();
const layerCancelled = new Set();
const layerIds = nodes => nodes.map(n => n.id).sort().join('|');
function layerSearchRoots() {
  const page = layerPage(), selected = [...page.selection];
  if (page.id !== layerSeedPage || layerIds(selected) !== layerResultIds) { layerSeed = selected; layerSeedPage = page.id; }
  return layerSeed.filter(n => !n.removed);
}
function layerRememberSearch(nodes) { layerResultIds = layerIds(nodes); }
function layerSelectSearch(nodes) {
  layerSearchWriting=true;
  try { layerPage().selection=nodes; layerResultIds=layerIds([...layerPage().selection]); }
  finally { layerSearchWriting=false; }
}
function installLayerTools() {
  if (layerPlatform === 'figma') layerHost.skipInvisibleInstanceChildren = false;
  layerHost.on('selectionchange', () => {
    try {
    const nodes = [...layerPage().selection], valid = nodes.filter(n => ['FRAME','RECTANGLE'].includes(n.type));
    if (!layerSearchWriting && layerIds(nodes) !== layerResultIds) { layerSeed=nodes; layerSeedPage=layerPage().id; }
    layerSend({ type:'size-assistant-selection', validCount:valid.length, invalidCount:nodes.length-valid.length, width:valid.length===1?valid[0].width:0, height:valid.length===1?valid[0].height:0 });
    }catch(error){console.warn('Layer selection refresh deferred:',String(error));}
  });
}
function layerRead(root) {
  const layers=[], stack=[{node:root,path:[]}];
  while (stack.length) {
    const {node,path}=stack.pop();
    if (layers.length >= 5000) throw new Error('图层树超过 5,000 层，请拆分后分析；本次未截断读取');
    const record={id:node.id,path,name:node.name,type:node.type,width:node.width,height:node.height,visible:node.visible ?? node.isVisible,locked:node.locked ?? node.isLocked};
    for (const key of ['x','y','opacity','characters','layoutMode','itemSpacing','cornerRadius','fills','strokes','effects','componentPropertyReferences','componentProperties','componentPropertyDefinitions','vectorPaths','fontName','fontSize','flexMode','rotation','relativeTransform','strokeWeight','strokeAlign','strokeCap','strokeJoin','dashPattern','cornerSmoothing','topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','clipsContent','blendMode','isMask','vectorNetwork','textCase','textDecoration','textAlignHorizontal','textAlignVertical','lineHeight','letterSpacing','textAutoResize','paddingLeft','paddingRight','paddingTop','paddingBottom','primaryAxisSizingMode','counterAxisSizingMode','primaryAxisAlignItems','counterAxisAlignItems','layoutSizingHorizontal','layoutSizingVertical']) {
      try { const value=node[key]; if (value!==undefined && typeof value!=='symbol') record[key]=value; } catch (_) {}
    }
    try { if (node.type==='INSTANCE') record.mainComponentId=node.mainComponent?.id || node.componentId; } catch (_) {}
    if(node.type==='TEXT'&&typeof node.getStyledTextSegments==='function')try{record.textSegments=node.getStyledTextSegments(['fontName','fontSize','fills','textCase','textDecoration','letterSpacing','lineHeight']);}catch(_){}
    layers.push(record);
    if ('children' in node) for (let i=node.children.length-1;i>=0;i--) stack.push({node:node.children[i],path:[...path,i]});
  }
  return {id:root.id,name:root.name,type:root.type,layers};
}
function layerHash(value) {
  const text=JSON.stringify(value);let a=2166136261,b=5381;
  for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}
  return `${text.length}:${a>>>0}:${b>>>0}`;
}
function layerStamp(roots) { return roots.map(n=>layerHash(layerRead(n))).join('|'); }
function layerAppearance(root) {
  return layerRead(root).layers.map((record,index)=>{
    const {id,name,path,componentPropertyReferences,componentPropertyDefinitions,componentProperties,...visual}=record;
    if(!index){delete visual.x;delete visual.y;delete visual.relativeTransform;visual.type='ROOT';}
    return visual;
  });
}
function layerAssertAppearance(expected,actual,name) {
  if(expected!==layerHash(layerAppearance(actual)))throw new Error(`“${name}”的外观或尺寸在构建中发生变化，已撤销生成内容并保留原 Frame`);
}
function layerAt(root,path) {
  if (!Array.isArray(path) || path.length>100 || path.some(i=>!Number.isInteger(i)||i<0)) throw new Error('AI 返回无效图层路径');
  let node=root;
  for (const index of path) { node=node?.children?.[index]; if (!node) throw new Error('图层结构已变化，请重新分析'); }
  return node;
}
function layerBase64(bytes) {
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', parts=[];
  for(let i=0;i<bytes.length;i+=3){const a=bytes[i],b=bytes[i+1],c=bytes[i+2];parts.push(alphabet[a>>2]+alphabet[((a&3)<<4)|((b||0)>>4)]+(i+1<bytes.length?alphabet[((b&15)<<2)|((c||0)>>6)]:'=')+(i+2<bytes.length?alphabet[c&63]:'='));}
  return parts.join('');
}
function layerClean(value) { return String(value||'').replace(/[,=\n\r]/g,' ').trim().slice(0,100); }
// Analysis reads selected roots only. Descendant appearance checks are local to construction.
function layerSummary(root) {
  const result={id:root.id,name:root.name,type:root.type,width:root.width,height:root.height,parentId:root.parent?.id};
  for(const key of ['cornerRadius','opacity','rotation','visible','isVisible','fills','strokes'])try{const value=root[key];if(value!==undefined&&typeof value!=='symbol')result[key]=value;}catch(_){}
  if(root.type==='COMPONENT')result.values=layerVariantValues(root);
  return result;
}
function layerVariantValues(node) {
  try{const properties=node.variantProperties;if(Array.isArray(properties))return Object.fromEntries(properties.map(p=>[p.property,String(p.value)]));if(properties&&typeof properties==='object')return Object.fromEntries(Object.entries(properties).map(([k,v])=>[k,String(v)]));}catch(_){}
  return Object.fromEntries(String(node.name).split(',').map(p=>p.split('=').map(s=>s.trim())).filter(p=>p.length===2));
}
function layerApplyVariantValues(owner,components,variants) {
  if(layerPlatform!=='mastergo'||owner.type!=='COMPONENT_SET')return;
  components.forEach((node,i)=>{if(typeof node.setVariantPropertyValues==='function')node.setVariantPropertyValues(variants[i].values||{});});
  const expected=new Set(Object.keys(variants[0]?.values||{}));
  if(expected.size&&Array.isArray(owner.componentPropertyValues)&&typeof owner.deleteVariantProperty==='function')for(const p of owner.componentPropertyValues.filter(p=>p.type==='VARIANT'&&!expected.has(p.name)))owner.deleteVariantProperty(p.name);
}
async function layerSnapshot(msg) {
  const selected=[...layerPage().selection];
  let roots=selected, limit=800,consolidate=false; const sides=new Map(),destinations=[],sourceSets=[];
  if (msg.purpose==='build') {
    if(selected.some(n=>!['FRAME','COMPONENT','COMPONENT_SET'].includes(n.type)))throw new Error('请选择 Frame、独立组件，或组件集与待补入对象');
    const sets=selected.filter(n=>n.type==='COMPONENT_SET');
    consolidate=msg.consolidate===true&&sets.length>0;
    roots=selected.filter(n=>n.type!=='COMPONENT_SET'&&!sets.includes(n.parent));
    if(roots.some(n=>n.parent?.type==='COMPONENT_SET'))throw new Error('请选中整个组件集和待补入的独立对象');
    for(const set of sets)(consolidate?sourceSets:destinations).push({id:set.id,name:set.name,parentId:set.parent?.id,appendSupported:typeof set.appendChild==='function'&&typeof set.insertChild==='function',variants:set.children.filter(n=>n.type==='COMPONENT').map(n=>({...layerSummary(n),values:layerVariantValues(n)}))});
    if(consolidate){
      if(new Set([...sets,...roots].map(n=>n.parent?.id)).size!==1)throw new Error('整合的组件集与 Frame 需要位于同一父级，请先移至同一容器');
      roots=[...sets.flatMap(n=>n.children.filter(c=>c.type==='COMPONENT')),...roots];
    }else{limit-=destinations.reduce((n,d)=>n+d.variants.length,0);if(!roots.length)throw new Error('请同时选中组件集及待补入的 Frame 或独立组件，或开启整合模式');}
  }
  if (msg.purpose==='translate') {
    roots=LayerRules.walk(selected).filter(n=>n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent?.type!=='COMPONENT_SET'));
  }
  if (msg.purpose==='duplicate') {
    if (selected.length!==2 || selected.some(n=>!('children' in n))) throw new Error('请选择两个画板或容器');
    for(let p=selected[0].parent;p;p=p.parent)if(p.id===selected[1].id)throw new Error('请选择两个互不嵌套的容器');
    for(let p=selected[1].parent;p;p=p.parent)if(p.id===selected[0].id)throw new Error('请选择两个互不嵌套的容器');
    const excluded=new Set((msg.exclude||[]).map(s=>String(s).toLowerCase()));
    // Generic words are removed from names; unnamed/generic layers still have useful visuals.
    roots=[];
    for (const parent of selected) for (const node of parent.children) {
      if ((node.visible ?? node.isVisible)===false || node.width<=0 || node.height<=0 || !node.exportAsync) continue;
      const tokens=String(node.name).toLowerCase().split(/[\s/_\-]+/).filter(t=>!excluded.has(t)&&!(excluded.has('number')&&/^\d+$/.test(t)));
      if (tokens.length) { roots.push(node); sides.set(node.id,selected.indexOf(parent)); if(roots.length>800)throw new Error('可比较图层超过 800 个，请调整范围后重试'); }
    }
    limit=800;
  }
  if(msg.purpose==='matrix') {
    const sets=roots.flatMap(n=>n.type==='COMPONENT_SET'?[n]:n.type==='FRAME'&&n.getPluginData?.('isShowcaseBoard')==='true'?LayerRules.walk(n.children).filter(c=>c.type==='COMPONENT_SET'):[]);
    if(!sets.length)throw new Error('请选择组件集或组件说明书');
    roots=[...new Map(sets.flatMap(n=>n.children.filter(c=>c.type==='COMPONENT')).map(n=>[n.id,n])).values()];
  }
  if (!roots.length) throw new Error('请先选择需要处理的图层');
  if (roots.length>limit) throw new Error(`本次有 ${roots.length} 个对象，单次上限 ${limit} 个，请缩小选区后重试。普通功能仍可使用`);
  const context=[], stamps=[];let total=0;
  const paged=msg.paged===true||roots.length>20;
  for(let i=0;i<roots.length;i++) {
    if(layerCancelled.has(msg.requestId))throw new Error('已取消');
    const root=roots[i],target=layerSummary(root);total++;stamps.push(layerHash(target));
    if(consolidate){const set=sourceSets.find(s=>s.id===root.parent?.id);target.sourceSetId=set?.id;target.buildParentId=sourceSets[0].parentId;}
    if(msg.purpose==='duplicate')target.side=sides.get(root.id);
    context.push(target);
    if(i%8===0||i===roots.length-1){layerSend({type:'layer-ai-progress',requestId:msg.requestId,done:i+1,total:roots.length,layers:total});await new Promise(r=>setTimeout(r,0));}
  }
  const token=msg.requestId;
  layerSnapshots.set(token,{roots:roots.map(n=>n.id),page:layerPage().id,stamps,purpose:msg.purpose,sides,destinations,sourceSets,consolidate,buildParentId:sourceSets[0]?.parentId});
  while(layerSnapshots.size>8)layerSnapshots.delete(layerSnapshots.keys().next().value);
  if(!paged&&msg.images){const records=await layerChunk({token,offset:0,limit:20,images:true,requestId:msg.requestId});return {token,targets:records.targets,totalLayers:total,destinations,sourceSets,consolidate,paged:false};}
  return {token,targets:context,totalLayers:total,destinations,sourceSets,consolidate,paged};
}
async function layerChunk(msg) {
  const snapshot=layerSnapshots.get(msg.token);
  if(!snapshot||snapshot.page!==layerPage().id)throw new Error('读取记录已失效，请重新分析');
  const offset=Math.max(0,Number(msg.offset)||0),limit=Math.min(20,Math.max(1,Number(msg.limit)||8));
  const targets=[];let bytesUsed=0,imageBytes=0;
  for(let i=offset;i<Math.min(offset+limit,snapshot.roots.length);i++) {
    if(layerCancelled.has(msg.requestId))throw new Error('已取消');
    const root=await layerGet(snapshot.roots[i]);
    if(!root||root.removed)throw new Error('图层已删除，请重新分析');
    const record=layerSummary(root);
    if(layerHash(record)!==snapshot.stamps[i])throw new Error('图层在分析后发生变化，请重新读取');
    const length=JSON.stringify(record).length;
    if(length>1500000)throw new Error(`“${root.name}”单个图层树数据过大，请拆分此 Frame 后重试`);
    if(targets.length&&bytesUsed+length>1500000)break;
    bytesUsed+=length;record.parentId=root.parent?.id;
    if(snapshot.consolidate){record.sourceSetId=snapshot.sourceSets.find(s=>s.id===root.parent?.id)?.id;record.buildParentId=snapshot.buildParentId;}
    if(snapshot.purpose==='duplicate')record.side=snapshot.sides.get(root.id);
    if(msg.images){try{const bytes=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:Math.min(1,384/Math.max(root.width,root.height,1))}});if(bytes.length>600000)throw new Error('预览图片过大');if(targets.length&&imageBytes+bytes.length>6*1024*1024)break;imageBytes+=bytes.length;record.image='data:image/png;base64,'+layerBase64(bytes);}catch(error){record.imageError=String(error.message||error);}}
    targets.push(record);await new Promise(r=>setTimeout(r,0));
    layerSend({type:'layer-ai-progress',requestId:msg.requestId,done:i+1,total:snapshot.roots.length,layers:0});
  }
  return {targets,nextOffset:offset+targets.length};
}

async function layerResolveSnapshot(token,purpose) {
  const snapshot=layerSnapshots.get(token);
  if (!snapshot || snapshot.purpose!==purpose || snapshot.page!==layerPage().id) throw new Error('读取记录已失效，请重新分析');
  const roots=await Promise.all(snapshot.roots.map(layerGet));
  for(let i=0;i<roots.length;i++){if(!roots[i]||roots[i].removed||layerHash(layerSummary(roots[i]))!==snapshot.stamps[i])throw new Error('图层在分析后发生变化，请重新读取，避免套用旧方案');if(i%8===0)await new Promise(r=>setTimeout(r,0));}
  if(snapshot.page!==layerPage().id)throw new Error('当前页面已变化，请重新分析');
  return roots;
}
function layerValidatePlan(plan,frames) {
  if (!Array.isArray(plan?.groups)||!plan.groups.length||plan.groups.length>frames.length) throw new Error('AI 未返回有效构建分组');
  const byId=new Map(frames.map(n=>[n.id,n])), used=new Set();
  for (const frame of frames) for (let parent=frame.parent;parent&&parent.type!=='PAGE';parent=parent.parent) if(byId.has(parent.id)) throw new Error('所选 Frame 存在父子嵌套，请只选择需要构建的独立 Frame');
  for (const group of plan.groups) {
    if (!layerClean(group.name) || !Array.isArray(group.variants)||!group.variants.length) throw new Error('构建分组缺少名称或 Frame');
    let keys=null; const tuples=new Set();
    for (const variant of group.variants) {
      if (!byId.has(variant.id)||used.has(variant.id)) throw new Error('AI 返回了未知或重复的 Frame');
      used.add(variant.id);
      if ((group.variants.length>1 || group.kind==='set') && group.kind!=='single') {
        const entries=Object.entries(variant.values||{});
        if (!entries.length || entries.length>12 || entries.some(([k,v])=>!layerClean(k)||!layerClean(v))) throw new Error('变体属性和值不能为空');
        const current=entries.map(([k])=>layerClean(k)).sort().join('|');
        if (keys!==null && keys!==current) throw new Error('同组变体的属性不一致，请重新分析'); keys=current;
        const tuple=entries.map(([k,v])=>[layerClean(k),layerClean(v)]).sort().map(p=>p.join('=')).join(',');
        if (tuples.has(tuple)) throw new Error('AI 给出了重复的变体组合，请重新分析'); tuples.add(tuple);
      }
    }
    const groupFrames=group.variants.map(v=>byId.get(v.id));
    if (!group.destinationId && groupFrames.length>1 && groupFrames.some(n=>n.parent!==groupFrames[0].parent)) throw new Error('同组 Frame 必须位于同一父级');
    const propertyNames=new Set(),propertyBindings=new Set();
    if(!Array.isArray(group.properties||[]))throw new Error('属性列表无效');
    for (const property of group.properties||[]) {
      if (!['TEXT','BOOLEAN','INSTANCE_SWAP','SLOT'].includes(property.type)||!layerClean(property.name)) throw new Error('AI 属性类型或名称无效');
      const propertyKey=layerClean(property.name).toLowerCase();if(propertyNames.has(propertyKey))throw new Error('AI 返回了重复的属性名');propertyNames.add(propertyKey);
      if (!Array.isArray(property.bindings)||!property.bindings.length) throw new Error('AI 属性缺少图层绑定');
      for (const binding of property.bindings) {
        if (!group.variants.some(v=>v.id===binding.frameId)) throw new Error('属性绑定不属于当前分组');
        const bindingKey=binding.frameId+'|'+JSON.stringify(binding.path)+'|'+property.type; if(propertyBindings.has(bindingKey))throw new Error('同一图层字段被重复绑定');propertyBindings.add(bindingKey);
        const n=layerAt(byId.get(binding.frameId),binding.path);
        if (!binding.path.length) throw new Error('属性必须绑定内部图层');
        if (property.type==='TEXT'&&n.type!=='TEXT'||property.type==='INSTANCE_SWAP'&&n.type!=='INSTANCE'||property.type==='SLOT'&&!['FRAME','SLOT'].includes(n.type)) throw new Error('AI 属性与目标图层类型不匹配');
      }
    }
  }
  if (used.size!==frames.length) throw new Error('AI 方案未覆盖全部 Frame，请重新分析');
}
async function layerConsolidate(plan,roots,snapshot) {
  if(plan.groups?.some(g=>g.destinationId))throw new Error('整合副本不能写入原有组件集');
  const parent=await layerGet(snapshot.buildParentId),sourcePage=layerPage();
  if(!parent||parent.removed||typeof parent.appendChild!=='function')throw new Error('整合目标容器已失效，请重新分析');
  for(const saved of snapshot.sourceSets){const set=await layerGet(saved.id);
    if(!set||set.removed||set.type!=='COMPONENT_SET'||set.parent?.id!==saved.parentId||set.name!==saved.name||JSON.stringify(set.children.filter(n=>n.type==='COMPONENT').map(n=>({...layerSummary(n),values:layerVariantValues(n)})))!==JSON.stringify(saved.variants))throw new Error('原组件集在分析后发生变化，请重新分析');
  }
  const copies=[],sourceIds=new Map(),appearance=new Map(),originalSelection=[...sourcePage.selection];let result;
  try {
    if(sourcePage.id!==snapshot.page||layerPage().id!==snapshot.page)throw new Error('当前页面已变化，请重新分析');
    for(const root of roots){appearance.set(root.id,layerHash(layerAppearance(root)));const copy=root.clone();copies.push(copy);parent.appendChild(copy);layerAssertAppearance(appearance.get(root.id),copy,root.name);sourceIds.set(root.id,copy.id);}
    const mapped={...plan,groups:plan.groups.map(g=>({...g,variants:g.variants.map(v=>({...v,id:sourceIds.get(v.id)||v.id}))}))};
    result=await layerConstruct(mapped,copies,undefined,[],false);
    for(const root of roots)layerAssertAppearance(appearance.get(root.id),root,root.name);
    // Keep output away from the source sets without altering their layout or names.
    const sets=await Promise.all(snapshot.sourceSets.map(s=>layerGet(s.id))),edge=Math.max(...sets.map(n=>n.x+n.width))+64;
    let y=Math.min(...sets.map(n=>n.y));
    const owners=await Promise.all([...new Set(result.mapping.map(m=>m.ownerId))].map(layerGet));
    for(const owner of owners){owner.x=edge;owner.y=y;y+=owner.height+48;}
    const reverse=new Map([...sourceIds].map(([id,copyId])=>[copyId,id]));
    for(const mapping of result.mapping)layerAssertAppearance(appearance.get(reverse.get(mapping.id)),await layerGet(mapping.newId),reverse.get(mapping.id));
    try{layerHost.viewport.scrollAndZoomIntoView(owners)}catch(_){}
    try{layerHost.commitUndo()}catch(_){}
    return {...result,mapping:result.mapping.map(m=>({...m,id:reverse.get(m.id)})),message:`已创建 ${result.created} 组整合副本，包含 ${roots.length} 个原有变体；原组件集与已有实例关联保留${result.warnings.length?'；'+result.warnings.join('；'):''}`};
  }catch(error){
    if(result)for(const id of new Set(result.mapping.map(m=>m.ownerId)))try{const owner=await layerGet(id);if(owner&&!owner.removed)owner.remove()}catch(_){}
    for(const copy of copies)try{if(!copy.removed)copy.remove()}catch(_){}
    try{sourcePage.selection=originalSelection.filter(n=>!n.removed)}catch(_){}
    throw error;
  }
}
async function layerConstruct(plan,frames,manual,destinations=[],finish=true) {
  const unavailable=destinations.filter(d=>d.appendSupported===false),warnings=[];
  if(unavailable.length)plan={...plan,groups:plan.groups.flatMap(g=>{
    if(!unavailable.some(d=>d.id===g.destinationId))return [g];
    warnings.push(`${g.name}：当前宿主未开放直接补入接口，${g.variants.length} 个对象已保留为独立组件；已有组件集未改动`);
    return g.variants.map(v=>({name:frames.find(n=>n.id===v.id)?.name||g.name,variants:[{id:v.id,values:{}}],properties:[]}));
  })};
  layerValidatePlan(plan,frames);
  if(!manual&&plan.groups.some(g=>g.kind))throw new Error('AI 只能按原对象创建变体，不能重组内部内容');
  if (frames.some(n=>{try{return n.attachedConnectors?.length>0}catch(_){return false}})) throw new Error('选中 Frame 连接了连线，请先移除连接后构建');
  const sourcePage=layerPage();
  const byId=new Map(frames.map(n=>[n.id,n])), trash=[], targets=[],mapping=[],moved=[];
  const owners=new Map();
  for(const group of plan.groups.filter(g=>g.destinationId)) {
    const known=destinations.find(d=>d.id===group.destinationId),owner=known&&await layerGet(known.id);
    if(!owner||owner.removed||owner.type!=='COMPONENT_SET'||owner.parent?.id!==known.parentId)throw new Error('目标组件集已变化，请重新分析');
    const actual=owner.children.filter(n=>n.type==='COMPONENT');
    if(JSON.stringify(actual.map(n=>({...layerSummary(n),values:layerVariantValues(n)})))!==JSON.stringify(known.variants))throw new Error('目标组件集的变体已变化，请重新分析');
    if(group.variants.some(v=>byId.get(v.id).parent!==owner.parent))throw new Error('待补入对象须与目标组件集位于同一父级');
    if(!owners.has(owner.id))owners.set(owner.id,{owner,children:[...owner.children],width:owner.width,height:owner.height,appearance:new Map(actual.map(n=>[n.id,layerHash(layerAppearance(n))])),tuples:new Set(actual.map(n=>JSON.stringify(Object.entries(layerVariantValues(n)).sort()))),keys:Object.keys(layerVariantValues(actual[0]||{})).sort().join('|')});
    const state=owners.get(owner.id);
    for(const v of group.variants){const values=Object.fromEntries(Object.entries(v.values||{}).map(([k,x])=>[layerClean(k),layerClean(x)]));if(Object.keys(values).sort().join('|')!==state.keys)throw new Error('补入变体的属性必须与已有组件集一致');const tuple=JSON.stringify(Object.entries(values).sort());if(state.tuples.has(tuple))throw new Error('补入变体与已有属性组合重复，请核对方案');state.tuples.add(tuple);}
    if(group.properties?.length)throw new Error('补入组件集时不能改动已有内容属性');
  }
  const sourceAppearance=new Map();
  for(let i=0;i<frames.length;i++){sourceAppearance.set(frames[i].id,layerHash(layerAppearance(frames[i])));if(i%8===0)await new Promise(r=>setTimeout(r,0));}
  try {
    for (const group of plan.groups) {
      const originals=group.variants.map(v=>byId.get(v.id));
      const parent=originals[0].parent; // Capture before conversion invalidates the Frame handle.
      const index=parent.children.indexOf(originals[0]);
      const appearances=originals.map(n=>sourceAppearance.get(n.id));
      const clones=originals.map(frame=>{const clone=frame.clone();trash.push(clone);return clone;});
      const convert=frame=>frame.type==='COMPONENT'?frame:layerPlatform==='figma'?layerHost.createComponentFromNode(frame):transferFrameToComponent(frame,frame.name,warnings);
      let components, owner;
      if (group.kind==='single'&&clones.length>1) { owner=wrapFramesAsOneComponent(clones,group.name);trash.push(owner);components=[owner]; }
      else {
        components=clones.map((clone,i)=>{const c=convert(clone);trash.push(c);const v=group.variants[i];c.name=(originals.length>1||group.kind==='set'||group.destinationId)?Object.entries(v.values).map(([k,val])=>`${layerClean(k)}=${layerClean(val)}`).join(', '):group.name;return c;});
        owner=group.destinationId?owners.get(group.destinationId).owner:(components.length>1||group.kind==='set')?(layerPlatform==='figma'?layerHost.combineAsVariants(components,parent):layerHost.combineAsVariants(components)):components[0];
        if(!group.destinationId)trash.push(owner);
      }
      if(group.destinationId) {
        const state=owners.get(group.destinationId),bottom=Math.max(0,...owner.children.map(n=>n.y+n.height));
        components.forEach((n,i)=>{owner.appendChild(n);n.x=24+i*(Math.max(...components.map(c=>c.width))+24);n.y=bottom+24;});
        // Preserve existing constraints and layout. Figma can grow the set without scaling children.
        if(typeof owner.resizeWithoutConstraints==='function')owner.resizeWithoutConstraints(Math.max(owner.width,...components.map(n=>n.x+n.width+24)),Math.max(owner.height,...components.map(n=>n.y+n.height+24)));
        for(const n of state.children)if(state.appearance.has(n.id))layerAssertAppearance(state.appearance.get(n.id),n,n.name);
      } else {
      owner.name=String(group.name).trim().slice(0,120); parent.insertChild(index,owner);
      if (owner.type==='COMPONENT_SET') {
        const columns=Math.ceil(Math.sqrt(components.length)), w=Math.max(...components.map(n=>n.width)),h=Math.max(...components.map(n=>n.height));
        owner[layerPlatform==='figma'?'layoutMode':'flexMode']='NONE';components.forEach((n,i)=>{n.x=24+(i%columns)*(w+24);n.y=24+Math.floor(i/columns)*(h+24);});owner.resize(48+columns*w+(columns-1)*24,48+Math.ceil(components.length/columns)*h+(Math.ceil(components.length/columns)-1)*24);
      }
      }
      if(!group.destinationId)layerApplyVariantValues(owner,components,group.variants);
      const contentRoots=group.kind==='single'&&originals.length>1?[...owner.children]:components;
      const mapped=new Map(group.variants.map((v,i)=>[v.id,contentRoots[i]]));
      let properties=group.properties||[];
      if(manual) {
        const candidates=new Map();
        for(const variant of group.variants)for(const record of layerRead(mapped.get(variant.id)).layers){
          const type=record.type==='TEXT'&&manual.exposeText?'TEXT':record.type==='INSTANCE'&&manual.exposeInstances?'INSTANCE_SWAP':null;
          if(!type||!record.path.length)continue;
          // Keep each source path independent; don't unify unlike text/instance defaults.
          const key=type+':'+record.path.join('.')+':'+record.name;
          const property=candidates.get(key)||{name:record.name||type,type,bindings:[]};property.bindings.push({frameId:variant.id,path:record.path});candidates.set(key,property);
        }
        properties=[...candidates.values()];
      }
      for (const property of properties) {
        const nodes=property.bindings.map(b=>layerAt(mapped.get(b.frameId),b.path));
        const first=nodes[0];
        // A shared default can overwrite instance overrides, text or visibility.
        // Native swap/slot exposure is advisory until a host can preserve all overrides.
        if(['INSTANCE_SWAP','SLOT'].includes(property.type)){warnings.push(`${property.name}：保留为属性建议，未替换原实例或内容`);continue;}
        const values=nodes.map(n=>property.type==='TEXT'?n.characters:(n.visible??n.isVisible));
        if(values.some(value=>value!==values[0])){warnings.push(`${property.name}：各变体默认值不同，保留原内容，未合并绑定`);continue;}
        if (typeof owner.addComponentProperty!=='function') { warnings.push(`${property.name}：宿主未提供原生属性 API`);continue; }
        const value=property.type==='TEXT'?first.characters:(first.visible??first.isVisible);
        const key=property.type==='TEXT'?'characters':layerPlatform==='figma'?'visible':'isVisible';
        let id;
        try {
          id=owner.addComponentProperty(layerClean(property.name),property.type,value);
          nodes.forEach(n=>{n.componentPropertyReferences={...(n.componentPropertyReferences||{}),[key]:id};});
        } catch(error) {
          // An unsupported property must not leave a half-bound definition.
          for (const n of nodes) {try {const refs={...n.componentPropertyReferences};delete refs[key];n.componentPropertyReferences=refs;}catch(_){}}
          if(id)try{owner.deleteComponentProperty(id)}catch(_){}
          warnings.push(`${property.name} (${property.type})：未创建，${String(error.message||error)}`);
        }
      }
      contentRoots.forEach((component,i)=>layerAssertAppearance(appearances[i],component,originals[i].name));
      if(!targets.includes(owner))targets.push(owner);
      group.variants.forEach((v,i)=>mapping.push({id:v.id,newId:contentRoots[i].id,ownerId:owner.id}));
      await new Promise(r=>setTimeout(r,0));
    }
    // Commit only after every group exists. Failures above leave original Frames intact.
    if(layerPage().id!==sourcePage.id)throw new Error('构建期间页面已切换，已保留原 Frame，请返回原页重试');
    frames.forEach(frame=>layerAssertAppearance(sourceAppearance.get(frame.id),frame,frame.name));
    // Reuse existing component IDs so instances continue to reference their masters.
    // MasterGo exposes combineAsVariants but not insertChild on component sets.
    // Recombine a newly created draft with the real standalone masters at commit.
    const committedComponents=new Set();
    for(let ti=0;ti<targets.length;ti++) {
      const draftOwner=targets[ti];if(draftOwner.type!=='COMPONENT_SET'||typeof draftOwner.insertChild==='function')continue;
      const members=mapping.filter(m=>m.ownerId===draftOwner.id),originalComponents=members.filter(m=>byId.get(m.id).type==='COMPONENT');
      if(!originalComponents.length)continue;
      const ownerName=draftOwner.name,ownerParent=draftOwner.parent,ownerIndex=ownerParent.children.indexOf(draftOwner),ownerX=draftOwner.x,ownerY=draftOwner.y;
      const entries=[];
      for(const map of members){const draft=await layerGet(map.newId),source=byId.get(map.id);let node=draft;
        if(source.type==='COMPONENT'){moved.push({node:source,parent:source.parent,index:source.parent.children.indexOf(source),name:source.name,x:source.x,y:source.y,width:source.width,height:source.height});source.name=draft.name;node=source;}
        entries.push({map,draft,node,x:draft.x,y:draft.y});
      }
      const owner=layerHost.combineAsVariants(entries.map(e=>e.node));trash.push(owner);ownerParent.insertChild(ownerIndex,owner);owner.name=ownerName;owner.flexMode='NONE';owner.x=ownerX;owner.y=ownerY;
      for(const entry of entries){entry.node.x=entry.x;entry.node.y=entry.y;layerAssertAppearance(sourceAppearance.get(entry.map.id),entry.node,entry.node.name);if(entry.node!==entry.draft){committedComponents.add(entry.node.id);entry.map.newId=entry.node.id;}entry.map.ownerId=owner.id;}
      layerApplyVariantValues(owner,entries.map(e=>e.node),entries.map(e=>plan.groups.flatMap(g=>g.variants).find(v=>v.id===e.map.id)));
      if(typeof owner.resizeToFit==='function')owner.resizeToFit();
      for(const entry of entries)layerAssertAppearance(sourceAppearance.get(entry.map.id),entry.node,entry.node.name);
      targets[ti]=owner;if(!draftOwner.removed)draftOwner.remove();
    }
    for(const original of frames.filter(n=>n.type==='COMPONENT'&&!committedComponents.has(n.id))) {
      const map=mapping.find(m=>m.id===original.id),draft=await layerGet(map.newId);
      const previous={node:original,parent:original.parent,index:original.parent.children.indexOf(original),name:original.name,x:original.x,y:original.y,width:original.width,height:original.height};moved.push(previous);
      const targetParent=draft.parent,at=targetParent.children.indexOf(draft),draftId=draft.id;
      targetParent.insertChild(at,original);original.name=draft.name;original.x=draft.x;original.y=draft.y;
      layerAssertAppearance(sourceAppearance.get(original.id),original,previous.name);
      const ownerIndex=targets.indexOf(draft);if(ownerIndex>=0)targets[ownerIndex]=original;
      map.newId=original.id;if(map.ownerId===draftId)map.ownerId=original.id;
      draft.remove();
    }
    frames.filter(frame=>frame.type!=='COMPONENT').forEach(frame=>frame.remove());
  } catch(error) {
    for(const previous of moved.reverse())try{previous.parent.insertChild(previous.index,previous.node);previous.node.name=previous.name;previous.node.x=previous.x;previous.node.y=previous.y;if(previous.node.width!==previous.width||previous.node.height!==previous.height)previous.node.resize(previous.width,previous.height);}catch(_){}
    for(const node of trash.reverse())try{if(!node.removed)node.remove()}catch(_){}
    for(const {owner,width,height} of owners.values())try{if(typeof owner.resizeWithoutConstraints==='function')owner.resizeWithoutConstraints(width,height)}catch(_){}
    throw error;
  }
  sourcePage.selection=targets;
  if(finish){try{layerHost.viewport.scrollAndZoomIntoView(targets)}catch(_){}try{layerHost.commitUndo()}catch(_){}}
  return {created:targets.length,mapping,warnings,message:`已构建 ${targets.length} 组组件${warnings.length?'；'+warnings.slice(0,12).join('；')+(warnings.length>12?`；另有 ${warnings.length-12} 项属性建议未自动应用`:''):''}`};
}
async function layerBuildManual(msg) {
  if(layerBusy){layerSend({type:'component-builder-result',ok:false,message:'正在构建，请稍候'});return;}
  layerBusy=true;
  try {
    const frames=[...layerPage().selection];
    if(!frames.length||frames.some(n=>n.type!=='FRAME'))throw new Error('请选择一个或多个 Frame');
    const mode=['single','set'].includes(msg.mode)?msg.mode:'multiple', name=String(msg.componentName||'').trim();
    const groups=mode==='multiple'?frames.map(n=>({name:name?(frames.length===1?name:`${name}/${n.name}`):n.name,variants:[{id:n.id}]})):
      [{name:name||commonNamePrefix(frames.map(n=>n.name)),kind:mode,variants:frames.map((n,i)=>({id:n.id,values:{[layerClean(msg.variantProperty)||'Variant']:`${layerClean(n.name)} ${i+1}`}}))}];
    layerSend({type:'component-builder-result',ok:true,...await layerConstruct({groups},frames,msg)});
  }catch(error){layerSend({type:'component-builder-result',ok:false,message:`创建失败，原 Frame 已保留：${String(error.message||error)}`});}
  finally{layerBusy=false;}
}
async function handleLayerToolsMessage(msg) {
  if(msg.type==='layer-job-state'){if(layerPlatform==='mastergo')try{layerHost.ui.setCloseConfirm({enabled:!!msg.busy,message:'AI 分析尚未完成，关闭插件将中断当前任务。'})}catch(_){}return true;}
  if(msg.type==='layer-ai-cancel'){layerCancelled.add(msg.requestId);if(layerCancelled.size>100)layerCancelled.delete(layerCancelled.values().next().value);return true;}
  if(!['layer-ai-read','layer-ai-chunk','layer-ai-rename','layer-ai-build','layer-ai-references','layer-focus','layer-matrix'].includes(msg.type))return false;
  const reply={type:'layer-ai-response',requestId:msg.requestId};
  try {
    if(msg.type==='layer-focus') {
      const node=await layerGet(msg.id);if(!node||node.removed)throw new Error('图层已删除');
      let page=node;while(page&&page.type!=='PAGE')page=page.parent;
      if(page?.id!==layerPage().id)throw new Error('请返回该图层所在页面后定位');
      layerPage().selection=[node];layerHost.viewport.scrollAndZoomIntoView([node]);layerSend({...reply,ok:true});
    }else if(msg.type==='layer-ai-references') {
      const snapshot=layerSnapshots.get(msg.token);if(!snapshot||snapshot.page!==layerPage().id)throw new Error('读取记录已失效');
      const targets=[];
      // Representative screenshots anchor existing sets; exact property values for every variant remain in metadata.
      for(const set of snapshot.destinations)for(const item of set.variants.filter((_,i)=>i%Math.max(1,Math.ceil(set.variants.length/4))===0).slice(0,4)) {
        if(targets.length>=20)break;
        const root=await layerGet(item.id);if(!root||root.removed)throw new Error('参考组件已删除');
        const bytes=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:Math.min(1,384/Math.max(root.width,root.height,1))}});
        if(bytes.length<=600000)targets.push({...item,referenceOnly:true,destinationId:set.id,image:'data:image/png;base64,'+layerBase64(bytes)});
      }
      layerSend({...reply,ok:true,targets});
    }else if(msg.type==='layer-ai-read') layerSend({...reply,ok:true,context:await layerSnapshot(msg)});
    else if(msg.type==='layer-ai-chunk')layerSend({...reply,ok:true,...await layerChunk(msg)});
    else if(msg.type==='layer-ai-rename') {
      const roots=await layerResolveSnapshot(msg.token,msg.purpose), allowed=new Map(roots.map(n=>[n.id,n]));
      const names=msg.names;
      if(!Array.isArray(names)||names.length>800||new Set(names.map(n=>n.id)).size!==names.length||names.some(n=>!allowed.has(n.id)||!String(n.name||'').trim())) throw new Error('命名结果无效，请重新分析');
      const previous=names.map(n=>({node:allowed.get(n.id),name:allowed.get(n.id).name}));
      try{names.forEach(n=>{allowed.get(n.id).name=String(n.name).trim().slice(0,180);});}catch(error){previous.forEach(n=>{try{n.node.name=n.name}catch(_){}});throw error;}
      const snapshot=layerSnapshots.get(msg.token);snapshot.stamps=roots.map(n=>layerHash(layerSummary(n)));
      try{layerHost.commitUndo()}catch(_){}
      try{layerHost.notify(`已命名 ${names.length} 个图层`)}catch(_){}
      layerSend({...reply,ok:true,message:`已命名 ${names.length} 个图层`});
    }else if(msg.type==='layer-ai-build') {
      if(layerBusy)throw new Error('正在构建，请稍候');layerBusy=true;
      try{const frames=await layerResolveSnapshot(msg.token,'build'),snapshot=layerSnapshots.get(msg.token);const result=snapshot.consolidate?await layerConsolidate(msg.plan,frames,snapshot):await layerConstruct(msg.plan,frames,undefined,snapshot.destinations);layerSnapshots.delete(msg.token);layerSend({...reply,ok:true,...result});}finally{layerBusy=false;}
    }else if(msg.type==='layer-matrix') {
      const selection=[...layerPage().selection];
      const sets=selection.flatMap(n=>n.type==='COMPONENT_SET'?[n]:n.type==='FRAME'&&n.getPluginData('isShowcaseBoard')==='true'?LayerRules.walk(n.children).filter(c=>c.type==='COMPONENT_SET'):[]);
      if(!sets.length)throw new Error('请选择组件集');
      const plans=sets.map(set=>({set,layout:LayerRules.matrix(set.children.filter(n=>n.type==='COMPONENT'),msg)}));
      plans.forEach(({set,layout})=>{set[layerPlatform==='figma'?'layoutMode':'flexMode']='NONE';layout.placements.forEach(p=>{p.node.x=p.x;p.node.y=p.y;});set.resize(layout.width,layout.height);});
      try{layerHost.commitUndo()}catch(_){}layerSend({...reply,ok:true,message:`已排列 ${plans.length} 个组件集；剩余属性自动分组`});
    }
  }catch(error){layerSend({...reply,ok:false,message:String(error.message||error)});}
  return true;
}

// Used only when contours intersect, touch or double back. Clipper evaluates
// the source fill rule and emits disjoint filled regions with opposing holes.
const IconfontBoolean = (() => {
  function resolve(polygons, rule) {
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity, count = 0;
    for (const polygon of polygons) {
      count += polygon.length;
      for (const {x, y} of polygon) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
    const span = Math.max(right - left, bottom - top);
    if (!count || span === 0) return '';
    if (!Number.isFinite(span) || count > 16000) {
      const error = new Error('轮廓过于复杂，请简化后重试。');
      error.code = 'geometry-complex';
      throw error;
    }

    // At least seven significant digits across the icon while keeping the
    // integer coordinates within Clipper's fast, exact-product range.
    const scale = Math.pow(10, Math.floor(Math.log10(40000000 / span)));
    const originX = Math.floor(left * scale);
    const originY = Math.floor(top * scale);
    if (![originX, originY, Math.ceil(right * scale), Math.ceil(bottom * scale)].every(Number.isSafeInteger)) {
      const error = new Error('路径坐标超过布尔运算的精度范围。');
      error.code = 'geometry-complex';
      throw error;
    }
    const integers = polygons.map(poly => poly.map(p => ({
      X: Math.round(p.x * scale) - originX,
      Y: Math.round(p.y * scale) - originY
    })));
    const clipper = new iconfontClipper.Clipper(iconfontClipper.Clipper.ioStrictlySimple);
    const fill = rule === 'EVENODD' ? iconfontClipper.PolyFillType.pftEvenOdd : iconfontClipper.PolyFillType.pftNonZero;
    if (!clipper.AddPaths(integers, iconfontClipper.PolyType.ptSubject, true)) return '';
    const result = [];
    if (!clipper.Execute(iconfontClipper.ClipType.ctUnion, result, fill, fill)) {
      const error = new Error('布尔运算未能解析自交轮廓。');
      error.code = 'geometry-ambiguous';
      throw error;
    }
    return result.map(contour => contour.map((p, i) => {
      const x = (p.X + originX) / scale, y = (p.Y + originY) / scale;
      return (i === 0 ? 'M ' : 'L ') + x + ' ' + y;
    }).join(' ') + ' Z').join(' ');
  }

  return {resolve};
})();

// The host supplies filled vector geometry after outlining strokes. Keep the original
// Béziers for output. The polylines below are used only to establish containment.
const IconfontGeometry = (() => {
  const messages = {
    'geometry-invalid': '路径数据或填充规则不受支持。',
    'geometry-ambiguous': '轮廓相交、相切或间距过小，请先检查布尔运算和路径。',
    'geometry-complex': '路径过于复杂，请简化后重试。',
    'geometry-empty': '没有可生成字体图形的填充轮廓。'
  };

  function fail(code) {
    const error = new Error(messages[code]);
    error.code = code;
    throw error;
  }

  const same = (a, b) => a.x === b.x && a.y === b.y;
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const dot = (a, b, c) => (b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y);

  function parse(data) {
    if (typeof data !== 'string') fail('geometry-invalid');
    // Preserve all original digits. In particular, nearby anchors can bound a thin hole.
    const token = /[a-zA-Z]|[+-]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/g;
    const tokens = [];
    let match, offset = 0;
    while ((match = token.exec(data))) {
      if (!/^[\s,]*$/.test(data.slice(offset, match.index))) fail('geometry-invalid');
      tokens.push(match[0]);
      offset = token.lastIndex;
    }
    if (!/^[\s,]*$/.test(data.slice(offset))) fail('geometry-invalid');

    let i = 0, command, current = {x: 0, y: 0}, start, segments, previous;
    const contours = [];
    function number() {
      if (i >= tokens.length || /^[a-z]$/i.test(tokens[i])) fail('geometry-invalid');
      const value = Number(tokens[i++]);
      if (!Number.isFinite(value) || Math.abs(value) > 1e12) fail('geometry-invalid');
      return value;
    }
    function append(points) {
      const prior = segments[segments.length - 1];
      if (points.length === 2 && prior && prior.length === 2 &&
          cross(prior[0], prior[1], points[1]) === 0 && dot(prior[1], prior[0], points[1]) < 0) {
        // A straight continuation has identical geometry without its middle anchor.
        segments[segments.length - 1] = [prior[0], points[1]];
      } else {
        segments.push(points);
      }
    }
    function finish() {
      if (segments && segments.length) {
        // SVG implicitly draws this line when filling an open subpath.
        if (!same(start, current)) append([current, start]);
        contours.push(segments);
      }
      segments = null;
      previous = null;
    }
    while (i < tokens.length) {
      if (/^[a-z]$/i.test(tokens[i])) command = tokens[i++];
      if (!command) fail('geometry-invalid');
      const type = command.toUpperCase(), relative = command !== type;
      const point = () => ({x: number() + (relative ? current.x : 0), y: number() + (relative ? current.y : 0)});
      if (type === 'M') {
        const next = point();
        finish();
        start = current = next;
        segments = [];
        command = relative ? 'l' : 'L';
        continue;
      }
      if (!segments) fail('geometry-invalid');
      if (type === 'Z') {
        finish();
        current = start;
        command = null;
        continue;
      }
      const reflect = degree => {
        if (!previous || previous.length !== degree + 1) return current;
        const control = previous[previous.length - 2];
        return {x: 2 * current.x - control.x, y: 2 * current.y - control.y};
      };
      let points;
      switch (type) {
        case 'L': points = [current, point()]; break;
        case 'H': points = [current, {x: number() + (relative ? current.x : 0), y: current.y}]; break;
        case 'V': points = [current, {x: current.x, y: number() + (relative ? current.y : 0)}]; break;
        case 'Q': points = [current, point(), point()]; break;
        case 'T': points = [current, reflect(2), point()]; break;
        case 'C': points = [current, point(), point(), point()]; break;
        case 'S': points = [current, reflect(3), point(), point()]; break;
        default: fail('geometry-invalid');
      }
      if (!points.every(p => same(p, current))) append(points);
      previous = points;
      current = points[points.length - 1];
    }
    finish();
    return contours;
  }

  function distanceToSegment(p, a, b) {
    const length = dot(a, b, b);
    const t = length ? Math.max(0, Math.min(1, dot(a, b, p) / length)) : 0;
    return Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y));
  }

  function bisect(points) {
    let level = points;
    const left = [points[0]], right = [points[points.length - 1]];
    while (level.length > 1) {
      level = level.slice(1).map((p, i) => ({x: (p.x + level[i].x) / 2, y: (p.y + level[i].y) / 2}));
      left.push(level[0]);
      right.push(level[level.length - 1]);
    }
    return [left, right.reverse()];
  }

  function flatten(points, tolerance, edges, budget, depth = 0) {
    const a = points[0], b = points[points.length - 1];
    // The convex hull bounds the curve's deviation from the chord. Require
    // monotone control projections as well so a fold along the chord is not lost.
    let projection = 0, error = 0, monotone = true;
    for (let i = 1; i < points.length - 1; i++) {
      const next = dot(a, b, points[i]);
      if (next < projection || next > dot(a, b, b)) monotone = false;
      projection = next;
      error = Math.max(error, distanceToSegment(points[i], a, b));
    }
    if (!same(a, b) && monotone && error <= tolerance) {
      if (++budget.edges > 24000) fail('geometry-complex');
      edges.push({a, b, error, left: Math.min(a.x, b.x) - error, right: Math.max(a.x, b.x) + error,
        top: Math.min(a.y, b.y) - error, bottom: Math.max(a.y, b.y) + error});
      return;
    }
    if (depth >= 22) fail('geometry-ambiguous');
    for (const half of bisect(points)) flatten(half, tolerance, edges, budget, depth + 1);
  }

  function contourInfo(segments, budget) {
    // An entirely collinear subpath, including a single unexpanded line, has no area.
    const a = segments[0][0];
    let b = a, left = a.x, right = a.x, top = a.y, bottom = a.y, collinear = true;
    for (const segment of segments) for (const p of segment) {
      if (same(a, b)) b = p;
      if (cross(a, b, p) !== 0) collinear = false;
      left = Math.min(left, p.x); right = Math.max(right, p.x);
      top = Math.min(top, p.y); bottom = Math.max(bottom, p.y);
    }
    if (collinear) return null;
    const edges = [];
    const tolerance = Math.max(right - left, bottom - top) * 0.00005;
    for (const segment of segments) flatten(segment, tolerance, edges, budget);
    const area = edges.reduce((sum, edge) => sum + cross(a, edge.a, edge.b), 0);
    if (!area) fail('geometry-ambiguous');
    const info = {segments, edges, sign: Math.sign(area), left, right, top, bottom};
    edges.forEach((edge, index) => { edge.contour = info; edge.index = index; });
    return info;
  }

  function checkBoundaries(contours, budget) {
    const edges = [];
    for (const contour of contours) for (const edge of contour.edges) edges.push(edge);
    edges.sort((one, two) => one.left - two.left);
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      for (let j = i + 1; j < edges.length && edges[j].left <= e.right; j++) {
        if (++budget.pairs > 1500000) fail('geometry-complex');
        const f = edges[j];
        if (e.bottom < f.top || f.bottom < e.top) continue;
        if (e.contour === f.contour) {
          const diff = Math.abs(e.index - f.index);
          if (diff === 1 || diff === e.contour.edges.length - 1) {
            // A doubled-back edge shares more than its common endpoint.
            const first = same(e.b, f.a) ? e : f;
            const second = first === e ? f : e;
            if (cross(first.a, first.b, second.b) === 0 && dot(first.b, first.a, second.b) > 0) {
              fail('geometry-ambiguous');
            }
            continue;
          }
        }
        const crosses = cross(e.a, e.b, f.a) * cross(e.a, e.b, f.b) < 0 &&
          cross(f.a, f.b, e.a) * cross(f.a, f.b, e.b) < 0;
        const gap = e.error + f.error;
        if (crosses || distanceToSegment(e.a, f.a, f.b) <= gap || distanceToSegment(e.b, f.a, f.b) <= gap ||
            distanceToSegment(f.a, e.a, e.b) <= gap || distanceToSegment(f.b, e.a, e.b) <= gap) fail('geometry-ambiguous');
      }
    }
  }

  function contains(contour, p) {
    if (p.x < contour.left || p.x > contour.right || p.y < contour.top || p.y > contour.bottom) return false;
    let inside = false;
    for (const {a, b} of contour.edges) {
      if ((a.y > p.y) !== (b.y > p.y) && p.x < a.x + (p.y - a.y) * (b.x - a.x) / (b.y - a.y)) inside = !inside;
    }
    return inside;
  }

  function serialize(segments, reverse, matrix) {
    const ordered = reverse ? segments.slice().reverse().map(points => points.slice().reverse()) : segments;
    const xy = p => {
      if (!matrix) return p.x + ' ' + p.y;
      const [[a,c,tx],[b,d,ty]] = matrix;
      const x = a * p.x + c * p.y + tx, y = b * p.x + d * p.y + ty;
      if (!Number.isFinite(x) || !Number.isFinite(y)) fail('geometry-invalid');
      return x + ' ' + y;
    };
    const parts = ['M ' + xy(ordered[0][0])];
    ordered.forEach((points, i) => {
      if (points.length === 2 && i === ordered.length - 1) return; // represented by Z
      parts.push(['', '', 'L', 'Q', 'C'][points.length] + ' ' + points.slice(1).map(xy).join(' '));
    });
    return parts.join(' ') + ' Z';
  }

  function polygonForBoolean(segments, budget) {
    const start = segments[0][0];
    let left = start.x, right = start.x, top = start.y, bottom = start.y;
    for (const segment of segments) for (const p of segment) {
      left = Math.min(left, p.x); right = Math.max(right, p.x);
      top = Math.min(top, p.y); bottom = Math.max(bottom, p.y);
    }
    // At 48 px this permits less than 0.005 px deviation from a source curve,
    // about a tenth of a unit in a typical 1024-unit glyph.
    const tolerance = Math.max(right - left, bottom - top) * 0.0001;
    const polygon = [];
    function sample(points, depth) {
      const a = points[0], n = points.length - 1, b = points[n];
      // Compare the Bézier's control polygon with the same-degree representation
      // of its chord. Bernstein weights sum to one, so this bounds pointwise
      // deviation even on a loop or a collinear segment that doubles back.
      const flat = points.slice(1, -1).every((p, i) => {
        const t = (i + 1) / n;
        return Math.hypot(p.x - a.x - t * (b.x - a.x), p.y - a.y - t * (b.y - a.y)) <= tolerance;
      });
      if (flat) {
        if (++budget.samples > 48000) fail('geometry-complex');
        if (!same(a, b)) polygon.push(a);
        return;
      }
      if (depth >= 22) fail('geometry-complex');
      for (const half of bisect(points)) sample(half, depth + 1);
    }
    for (const segment of segments) sample(segment, 0);
    return polygon;
  }

  function normalizeBoundaries(parsed, rule, budget) {
    const contours = parsed.map(segments => contourInfo(segments, budget)).filter(Boolean);
    checkBoundaries(contours, budget);
    const result = [];
    for (const contour of contours) {
      let outside = 0;
      for (const other of contours) {
        if (other !== contour && contains(other, contour.segments[0][0])) outside += other.sign;
      }
      const filled = winding => rule === 'EVENODD' ? winding % 2 !== 0 : winding !== 0;
      const wasFilled = filled(outside), nowFilled = filled(outside + contour.sign);
      if (wasFilled === nowFilled) continue; // e.g. two nested, same-direction NONZERO solids
      // In SVG's y-down coordinates a positive signed area runs clockwise.
      result.push(serialize(contour.segments, contour.sign !== (nowFilled ? 1 : -1)));
    }
    return result.join(' ');
  }

  function normalize(paths) {
    if (!Array.isArray(paths)) fail('geometry-invalid');
    const result = [], budget = {edges: 0, pairs: 0, samples: 0};
    let dataLength = 0;
    for (const path of paths) {
      const rule = String(path && path.windingRule).toUpperCase();
      if (rule === 'NONE') continue; // A centerline has no filled silhouette.
      if (!['NONZERO', 'EVENODD'].includes(rule) || typeof path.data !== 'string') fail('geometry-invalid');
      dataLength += path.data.length;
      if (dataLength > 600000) fail('geometry-complex');
      const parsed = parse(path.data);
      if (parsed.length > 512) fail('geometry-complex');
      let data;
      try {
        data = normalizeBoundaries(parsed, rule, budget);
      } catch (error) {
        if (error.code !== 'geometry-ambiguous' || typeof IconfontBoolean === 'undefined') throw error;
        const polygons = parsed.map(segments => polygonForBoolean(segments, budget)).filter(points => points.length >= 3);
        data = IconfontBoolean.resolve(polygons, rule);
      }
      if (data) result.push(data);
    }
    if (!result.length) fail('geometry-empty');
    return [{windingRule: 'NONZERO', data: result.join(' ')}];
  }

  function canonicalize(data, matrix) {
    if (typeof data === 'string' && data.length > 600000) fail('geometry-complex');
    return parse(data).map(segments => serialize(segments, false, matrix)).join(' ');
  }

  return {normalize, canonicalize};
})();

// Figma supplies absolute M/L/Q/C/Z commands. Bake the matrix into the points
// so the downloaded glyph also works with importers that discard transforms.
function iconfontError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function iconfontTransformPaths(paths, matrix) {
  return paths.map(path => ({
    windingRule: path.windingRule,
    data: IconfontGeometry.canonicalize(path.data, matrix)
  }));
}

function iconfontSvg(paths, width, height) {
  if (!(width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height))) {
    throw iconfontError('iconfont-empty', '图标没有可导出的尺寸');
  }
  const data = paths.map(path => path.data).join(' ');
  if (!data || /[^MLCQZ0-9eE\s,\.\-+]/.test(data)) throw iconfontError('iconfont-geometry', '导出的轮廓无效');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path fill="#000" fill-rule="nonzero" d="${data}"/></svg>`;
}

function iconfontPrepare(source, host, mastergo) {
  const frameTypes = ['FRAME', 'COMPONENT', 'INSTANCE'];
  const shapeTypes = ['VECTOR', 'PEN', 'RECTANGLE', 'LINE', 'ELLIPSE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION'];
  const black = [{ type: 'SOLID', color: mastergo ? { r: 0, g: 0, b: 0, a: 1 } : { r: 0, g: 0, b: 0 } }];
  const shown = item => mastergo ? item.isVisible !== false : item.visible !== false;
  const cleanup = [];
  let scratch, color, originalPaint;

  function track(node) {
    if (!node) throw iconfontError('iconfont-geometry', '编辑器未能创建矢量轮廓');
    cleanup.push(node);
    return node;
  }

  function workFrame() {
    if (!scratch) {
      scratch = track(host.createFrame());
      scratch.fills = [];
      scratch.clipsContent = false;
      scratch.x = 0;
      scratch.y = 0;
    }
    return scratch;
  }

  function paints(list) {
    if (list === undefined) return false;
    if (!Array.isArray(list)) throw iconfontError('iconfont-paint', '图层包含混合填色，请先整理为单色图形');
    const alpha = p => mastergo ? (p.color?.a ?? p.alpha ?? 1) : (p.opacity ?? 1);
    const visible = list.filter(p => shown(p) && alpha(p) !== 0);
    for (const paint of visible) {
      if (paint.type !== 'SOLID' || alpha(paint) !== 1 ||
          (paint.blendMode && paint.blendMode !== 'NORMAL')) {
        throw iconfontError('iconfont-paint', '图标包含渐变、图像、混合模式或半透明填色，请先整理为不透明纯色');
      }
      const rgb = [paint.color.r, paint.color.g, paint.color.b].join(',');
      if (color && color !== rgb) throw iconfontError('iconfont-color', '图标包含多种颜色，请检查背景或将留白改成镂空');
      color = rgb;
      if (!originalPaint) originalPaint = paint;
    }
    return visible.length > 0;
  }

  // absoluteBoundingBox retains transparent artboard padding. A bare stroke
  // can extend outside its layout box, or have a zero-height centerline.
  const layout = source.absoluteBoundingBox;
  const ink = source.absoluteRenderBounds;
  if (!layout) throw iconfontError('iconfont-empty', '图标没有可用边界');
  const left = ink ? Math.min(layout.x, ink.x) : layout.x;
  const top = ink ? Math.min(layout.y, ink.y) : layout.y;
  const width = Math.max(layout.x + layout.width, ink ? ink.x + ink.width : left) - left;
  const height = Math.max(layout.y + layout.height, ink ? ink.y + ink.height : top) - top;

  function localMatrix(node) {
    const m = node.absoluteTransform;
    return [[m[0][0], m[0][1], m[0][2] - left], [m[1][0], m[1][1], m[1][2] - top]];
  }

  function makeVector(paths) {
    const frame = workFrame();
    const node = track(mastergo ? host.createPen() : host.createVector());
    frame.appendChild(node);
    node.x = 0;
    node.y = 0;
    if (mastergo) node.penPaths = paths.map(p => ({ data: p.data, windingRule: p.windingRule === 'EVENODD' ? 'Evenodd' : 'Nonzero' }));
    else node.vectorPaths = paths;
    node.fills = black;
    node.strokes = [];
    return node;
  }

  // Inputs have already been transformed to viewport coordinates. Figma
  // automatically moves a vector's origin to its curve bounds on assignment.
  function booleanPaths(shapes, operation) {
    const nodes = shapes.map(makeVector);
    const frame = workFrame();
    const combined = track(mastergo ? host[operation](nodes) : host[operation](nodes, frame));
    const result = mastergo ? track(host.flatten([combined])) : combined;
    const paths = mastergo ? penPaths(result) : result.fillGeometry;
    if (!paths || !paths.length) return [];
    return iconfontTransformPaths(paths, result.relativeTransform);
  }

  function project(paths, matrix) {
    const filled = (paths || []).filter(p => p.windingRule !== 'NONE' && p.data);
    return filled.length ? [iconfontTransformPaths(filled, matrix)] : [];
  }

  function penPaths(node) {
    const raw = node.penPaths;
    return (Array.isArray(raw) ? raw : raw ? [raw] : []).map(p => ({
      data: p.data, windingRule: String(p.windingRule).toUpperCase()
    }));
  }

  function rectangleFor(node) {
    const rect = track(host.createRectangle());
    workFrame().appendChild(rect);
    rect.resize(node.width, node.height);
    rect.fills = black;
    rect.strokes = [];
    for (const key of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', mastergo ? 'cornerSmooth' : 'cornerSmoothing']) {
      if (typeof node[key] === 'number') rect[key] = node[key];
    }
    return rect;
  }

  function filledShapes(node, matrix) {
    if (!mastergo) return project(node.fillGeometry, matrix);
    if (node.type === 'PEN') return project(penPaths(node), matrix);
    // MasterGo exposes penPaths on flattened shapes. Work on isolated copies.
    // A frame's own fill is a rectangle independent of its child content.
    const primitive = frameTypes.includes(node.type) ? rectangleFor(node) : track(node.clone());
    workFrame().appendChild(primitive);
    primitive.relativeTransform = matrix;
    primitive.strokes = [];
    const pen = track(host.flatten([primitive]));
    return project(penPaths(pen), pen.relativeTransform);
  }

  function outline(node, matrix) {
    if (!mastergo && node.strokeAlign === 'CENTER') {
      const center = project(node.strokeGeometry, matrix);
      if (center.length) return center;
    }
    // strokeGeometry is always centered in Figma. Outline on a disposable
    // clone to retain the actual inside/outside alignment.
    const frame = workFrame();
    const clone = track(node.clone());
    frame.appendChild(clone);
    clone.relativeTransform = matrix;
    clone.fills = [];
    const expanded = track(clone.outlineStroke());
    const result = filledShapes(expanded, expanded.relativeTransform);
    if (!result.length) throw iconfontError('iconfont-geometry', '描边未能转换为封闭轮廓');
    return result;
  }

  function clipChildren(node, children) {
    if (!children.length || !node.clipsContent) return children;
    const matrix = node.absoluteTransform;
    const bounds = node.absoluteBoundingBox;
    const rounded = node.cornerRadius !== undefined && node.cornerRadius !== 0;
    const axisAligned = matrix[0][1] === 0 && matrix[1][0] === 0;
    // For a rectangular clip that encloses all ink, keep the original paths.
    // This also preserves precise curves on padded single-vector icon frames.
    if (!rounded && axisAligned && bounds && node.children.every(child => {
      if (!shown(child) || child.opacity === 0) return true;
      const b = child.absoluteRenderBounds;
      return b && b.x >= bounds.x && b.y >= bounds.y &&
        b.x + b.width <= bounds.x + bounds.width && b.y + b.height <= bounds.y + bounds.height;
    })) return children;

    const rect = rectangleFor(node);
    const boundary = filledShapes(rect, localMatrix(node))[0];
    if (!boundary) throw iconfontError('iconfont-mask', '无法读取裁剪边界');
    const contents = children.length === 1 ? children[0] : booleanPaths(children, 'union');
    if (!contents.length) return [];
    const clipped = booleanPaths([contents, boundary], 'intersect');
    return clipped.length ? [clipped] : [];
  }

  function read(node) {
    if (!shown(node) || node.opacity === 0) return [];
    if (node.isMask) throw iconfontError('iconfont-mask', '图标使用了蒙版，请先将蒙版转换为布尔图形');
    if ((node.effects || []).some(e => shown(e)) ||
        (node.opacity !== undefined && node.opacity !== 1) ||
        (node.blendMode && node.blendMode !== 'NORMAL' && node.blendMode !== 'PASS_THROUGH')) {
      throw iconfontError('iconfont-effect', '图标包含效果、混合模式或半透明图层，请先整理外观');
    }
    const isFrame = frameTypes.includes(node.type);
    const isGroup = node.type === 'GROUP' || node.type === 'TRANSFORM_GROUP';
    if (!isFrame && !isGroup && !shapeTypes.includes(node.type)) {
      throw iconfontError('iconfont-type', `图层类型 ${node.type} 需要先转换为矢量`);
    }
    const matrix = localMatrix(node);
    const shapes = [];
    if (!isGroup) {
      let filled = paints(node.fills);
      if (node.type === 'VECTOR') {
        // Vector regions may override the layer paint independently.
        const regions = node.vectorNetwork?.regions;
        const regionVisibility = (regions || []).map(region =>
          region.fills === undefined ? filled : paints(region.fills));
        if (regionVisibility.length) {
          filled = regionVisibility.some(Boolean);
          if (filled && regionVisibility.some(visible => !visible)) {
            throw iconfontError('iconfont-paint', '图标内存在透明填充区域，请先整理为单色轮廓');
          }
        }
      }
      if (filled) shapes.push(...filledShapes(node, matrix));
      if (paints(node.strokes)) shapes.push(...outline(node, matrix));
    }
    if (isFrame || isGroup) {
      const descendants = [];
      for (const child of node.children) for (const shape of read(child)) descendants.push(shape);
      for (const shape of clipChildren(node, descendants)) shapes.push(shape);
    }
    return shapes;
  }

  try {
    const shapes = read(source);
    if (!shapes.length) throw iconfontError('iconfont-empty', '没有可见的填充或描边轮廓');
    const paths = shapes.length === 1 ? shapes[0] : booleanPaths(shapes, 'union');
    let normalized;
    try {
      normalized = IconfontGeometry.normalize(paths);
    } catch (error) {
      if (error.code !== 'geometry-ambiguous') throw error;
      // Resolve self-intersections and touching subpaths using the editor's
      // native filled-region boolean engine before attempting winding again.
      normalized = IconfontGeometry.normalize(booleanPaths([paths, paths], 'union'));
    }
    return { paths: normalized, left, top, width, height, paint: originalPaint };
  } finally {
    for (let i = cleanup.length - 1; i >= 0; i--) {
      if (!cleanup[i].removed) cleanup[i].remove();
    }
  }
}

async function iconfontRepair(source, position, host, mastergo, action) {
  const apply = mastergo ? iconfontApplyMasterGo : iconfontApplyFigma;
  if (action === 'inplace') {
    const prepared = iconfontPrepare(source, host, mastergo);
    return apply(source, prepared, host);
  }

  // Clone before running any editing operation. Moving the clone to the page
  // also keeps it outside the source's auto layout, group or component.
  const page = mastergo ? host.document.currentPage : host.currentPage;
  const transform = source.absoluteTransform;
  const name = source.name;
  let draft, result;
  try {
    draft = source.clone();
    if (draft.parent !== page) page.appendChild(draft);
    draft.relativeTransform = transform;
    const prepared = iconfontPrepare(draft, host, mastergo);
    const svg = iconfontSvg(prepared.paths, prepared.width, prepared.height);
    // A native export-sized frame retains its padding, name and export presets.
    // For other roots use an export-sized wrapper around the repaired silhouette.
    if (draft.type === 'FRAME') {
      try {
        result = (await apply(draft, prepared, host)).node;
      } catch (error) {
        // Copies can safely be materialized as a single flat graphic even when
        // the original kind of container cannot accept an in-place write.
        if (!String(error?.code || '').startsWith('iconfont-inplace')) throw error;
      }
    }
    if (result) {
      const m = result.relativeTransform;
      result.relativeTransform = [[m[0][0], m[0][1], m[0][2] + position.x - prepared.left],
        [m[1][0], m[1][1], m[1][2] + position.y - prepared.top]];
    } else {
      result = mastergo ? await host.createNodeFromSvgAsync(svg) : host.createNodeFromSvg(svg);
      if (result.parent !== page) page.appendChild(result);
      result.x = position.x;
      result.y = position.y;
      if (draft.exportSettings?.length) result.exportSettings = draft.exportSettings;
    }
    result.name = name + ' · Iconfont';
    return { node: result, svg };
  } catch (error) {
    if (result && !result.removed) result.remove();
    throw error;
  } finally {
    if (draft && draft !== result && !draft.removed) draft.remove();
  }
}

// Geometry is prepared in an axis-aligned viewport. Rebase every point before
// writing editor paths so rotation, reflection and the artboard inset survive.
function iconfontMatrixProduct(a, b) {
  return a.map(row => [
    row[0] * b[0][0] + row[1] * b[1][0],
    row[0] * b[0][1] + row[1] * b[1][1],
    row[0] * b[0][2] + row[1] * b[1][2] + row[2]
  ]);
}

function iconfontInverseTransform(m) {
  const [[a, c, x], [b, d, y]] = m;
  const det = a * d - b * c;
  if (!Number.isFinite(det) || Math.abs(det) < 1e-12) {
    throw iconfontError('iconfont-inplace-layout', '图层变换不可逆，已保留原图标');
  }
  return [[d / det, -c / det, (c * y - d * x) / det], [-b / det, a / det, (b * x - a * y) / det]];
}

function iconfontLocalPaths(node, prepared) {
  const viewport = [[1, 0, prepared.left], [0, 1, prepared.top]];
  return iconfontTransformPaths(prepared.paths, iconfontMatrixProduct(iconfontInverseTransform(node.absoluteTransform), viewport));
}

function iconfontCloseBox(a, b) {
  return !!a && !!b && ['x', 'y', 'width', 'height'].every(k => Math.abs(a[k] - b[k]) <= 0.01);
}

async function iconfontApplyFigma(source, prepared, host) {
  const container = n => ['FRAME', 'GROUP', 'COMPONENT'].includes(n.type);
  const visiblePaint = p => p.visible !== false && p.opacity !== 0;
  const hasPaint = n => [n.fills, n.strokes].some(p => Array.isArray(p) && p.some(visiblePaint));
  const visible = n => n.visible !== false && n.opacity !== 0;
  const reject = message => { throw iconfontError('iconfont-inplace', message); };
  const layoutError = () => iconfontError('iconfont-inplace-layout', '轮廓化会改变原布局尺寸或位置，已保留原图标');
  const identity = [[1, 0, 0], [0, 1, 0]];
  const stacking = n => n && n.layoutMode && n.layoutMode !== 'NONE';
  const abs = n => n.type === 'PAGE' ? identity : n.absoluteTransform;
  const transformTo = (n, dest) => {
    n.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(abs(n.parent)), dest);
  };
  const ancestors = [];
  for (let n = source; n && n.type !== 'PAGE'; n = n.parent) {
    ancestors.push(n);
    if (n.locked || n.type === 'INSTANCE') reject('锁定图层或组件实例无法安全改写原始路径');
  }
  // Preserve a single-vector icon's layer ID even under several nested frames.
  let target = source;
  while (container(target) && !hasPaint(target)) {
    const visibleChildren = target.children.filter(visible);
    if (visibleChildren.length !== 1) break;
    const child = visibleChildren[0];
    if (!(container(child) || child.type === 'VECTOR')) break;
    if (child.locked || child.type === 'COMPONENT') reject('图标内含受保护的组件或锁定图层');
    target = child;
  }
  const direct = target.type === 'VECTOR';
  const wrapper = container(source);
  if (!direct) target = source;
  if (!direct && wrapper && hasPaint(source)) reject('画板自身带有填充或描边，请先将其外观转换为普通矢量图层');
  if (!direct && (ancestors.some(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') ||
      (wrapper ? stacking(source) : stacking(source.parent)))) {
    reject('替换子层会改变组件关系或自动布局，已保留图层结构');
  }

  const parent = wrapper && !direct ? source : target.parent;
  const affected = direct ? [target] : wrapper ? source.children.filter(visible) : [source];
  if (!parent || !affected.length) reject('没有可以就地修改的矢量图层');
  const color = prepared.paint;
  if (!color || color.type !== 'SOLID') reject('无法保留原图标的纯色填充');
  const styles = new Set();
  const paintBindings = new Set();
  function inspect(node, contributes = true) {
    if (!direct && (node.locked || !visible(node) || ['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(node.type) ||
        node.reactions?.length || node.annotations?.length || node.getPluginDataKeys?.().length || node.componentPropertyReferences ||
        Object.keys(node.boundVariables || {}).some(k => k !== 'fills' && k !== 'strokes') ||
        (node !== source && node.exportSettings?.length) || Object.keys(node.explicitVariableModes || {}).length)) {
      reject('子图层带有锁定、隐藏、导出设置或组件关系，无法在保留结构的同时拼合');
    }
    const entries = [[node.fills, node.fillStyleId], [node.strokes, node.strokeStyleId]];
    if (node.type === 'VECTOR') {
      for (const region of node.vectorNetwork?.regions || []) entries.push([region.fills, region.fillStyleId || node.fillStyleId]);
    }
    for (const [paints, styleId] of contributes ? entries : []) {
      if (!Array.isArray(paints)) continue;
      for (const paint of paints.filter(visiblePaint)) {
        styles.add(styleId || '');
        paintBindings.add(JSON.stringify(paint.boundVariables || {}));
      }
    }
    if (!direct) {
      for (const child of node.children || []) inspect(child, contributes && node.type !== 'BOOLEAN_OPERATION');
    }
  }
  for (const n of affected) inspect(n);
  const style = styles.size === 1 ? Array.from(styles)[0] : '';
  if (styles.size > 1 || paintBindings.size > 1 || typeof style !== 'string') reject('图标含有不同的颜色样式或变量绑定，已保留原连接');
  if (affected.length > 1 && new Set(affected.map(n => JSON.stringify(n.constraints))).size > 1) {
    reject('子图层的缩放约束不同，无法合并为一个矢量');
  }

  // Keep group geometry stable, including any ancestor group that tightly fits
  // its children. Frames retain layout settings on their original wrapper.
  const fixed = new Map();
  for (let n = direct ? target : source; n && n.type !== 'PAGE'; n = n.parent) {
    if (container(n) || stacking(n.parent)) fixed.set(n, n.absoluteBoundingBox);
  }
  const assertLayout = () => {
    for (const [n, box] of fixed) if (!iconfontCloseBox(box, n.absoluteBoundingBox)) throw layoutError();
  };

  const basis = target.absoluteTransform;
  const paths = iconfontLocalPaths(target, prepared);
  const stage = host.createVector();
  let keepStage = false;
  try {
    stage.x = 0;
    stage.y = 0;
    stage.vectorPaths = paths;
    stage.fills = [color];
    stage.strokes = [];
    if (style && !direct) await stage.setFillStyleIdAsync(style);
    // Figma rebases vectorPaths onto their curve bounds and updates the origin.
    const placed = iconfontMatrixProduct(basis, stage.relativeTransform);
    if (direct) {
      const previous = {
        paths: target.vectorPaths, network: target.vectorNetwork, transform: target.absoluteTransform,
        fills: target.fills, strokes: target.strokes, fillStyle: target.fillStyleId, strokeStyle: target.strokeStyleId,
        radius: target.cornerRadius
      };
      if (!Array.isArray(previous.fills) || !Array.isArray(previous.strokes)) reject('矢量含有无法还原的混合区域样式');
      try {
        // Rebase the canonical winding into the staged bounds without asking
        // the editor to serialize and interpret the full path a second time.
        target.vectorPaths = iconfontTransformPaths(paths, iconfontInverseTransform(stage.relativeTransform));
        if (target.cornerRadius) target.cornerRadius = 0;
        if (previous.strokes.length) target.strokes = [];
        // Keep a linked fill style attached unless the original was stroke-only.
        if (style && style !== target.fillStyleId) await target.setFillStyleIdAsync(style);
        else if (!style) target.fills = previous.fills.some(visiblePaint) ? previous.fills : [color];
        transformTo(target, placed);
        assertLayout();
      } catch (error) {
        if (previous.network && target.setVectorNetworkAsync) await target.setVectorNetworkAsync(previous.network);
        else target.vectorPaths = previous.paths;
        if (typeof previous.radius === 'number') target.cornerRadius = previous.radius;
        target.fills = previous.fills;
        target.strokes = previous.strokes;
        if (previous.fillStyle) await target.setFillStyleIdAsync(previous.fillStyle);
        if (previous.strokeStyle) await target.setStrokeStyleIdAsync(previous.strokeStyle);
        transformTo(target, previous.transform);
        throw error;
      }
      return {node: source};
    }

    // Move the originals to a temporary container until layout validation
    // succeeds. Rollback restores the actual objects, IDs and stacking order.
    const order = Array.from(parent.children);
    const originals = affected.map(n => ({n, index: order.indexOf(n), transform: n.absoluteTransform}));
    stage.name = affected.length === 1 ? affected[0].name : source.name;
    if (!wrapper) stage.exportSettings = source.exportSettings;
    const backup = host.createFrame();
    try {
      backup.clipsContent = false;
      backup.fills = [];
      parent.insertChild(originals[0].index, stage);
      transformTo(stage, placed);
      if (affected[0].constraints && 'constraints' in stage) stage.constraints = affected[0].constraints;
      for (const {n} of originals) backup.appendChild(n);
      assertLayout();
      keepStage = true;
    } catch (error) {
      // Restore before removing the temporary vector: Figma deletes empty groups.
      for (const {n, index, transform} of originals.slice().reverse()) {
        if (n.parent !== backup) continue;
        const next = order.slice(index + 1).find(node => node.parent === parent);
        parent.insertChild(next ? parent.children.indexOf(next) : parent.children.length, n);
        transformTo(n, transform);
      }
      throw error;
    } finally {
      if (!backup.children.length || keepStage) backup.remove();
    }
    return {node: wrapper ? source : stage};
  } finally {
    if (!keepStage && !stage.removed) stage.remove();
  }
}

// MasterGo has a native PEN node. Keep the selected wrapper/pen whenever
// possible and stage any layer replacement until layout and ink checks pass.
function iconfontApplyMasterGo(source, prepared, host) {
  const refuse = reason => { throw iconfontError('iconfont-inplace', reason); };
  const identity = [[1, 0, 0], [0, 1, 0]];
  const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  const matrixOf = node => node?.type === 'PAGE' ? identity : node?.absoluteTransform;
  const near = (one, two) => Number.isFinite(one) && Number.isFinite(two) &&
    Math.abs(one - two) <= Math.max(0.01, Math.abs(one) * 1e-7);
  const sameMatrix = (a, b) => a && b && a.every((row, i) => row.every((n, j) => near(n, b[i][j])));
  const protectedNode = node => node.isLocked || node.isMask || node.type === 'INSTANCE' ||
    node.type === 'COMPONENT_SET' || node.slotInfo || Object.keys(node.componentPropertyReferences || {}).length;
  const isComponent = node => node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
  const flex = node => node?.flexMode && node.flexMode !== 'NONE';
  const shown = node => node.isVisible !== false && node.opacity !== 0;

  for (let n = source; n && n.type !== 'PAGE'; n = n.parent) {
    if (protectedNode(n) || n.isVisible === false) refuse('图层被锁定、隐藏或属于实例，无法原位修改。');
  }

  function paintVisible(list) {
    return (list || []).some(p => p.isVisible !== false && (p.color?.a ?? p.alpha ?? 1) > 0);
  }

  function savedLayout(node) {
    return {world: copy(matrixOf(node)), width: node.width, height: node.height};
  }
  function checkLayout(node, before) {
    if (!sameMatrix(matrixOf(node), before.world) || !near(node.width, before.width) || !near(node.height, before.height)) {
      refuse('写入会改变原图标的位置或布局尺寸。');
    }
  }

  function pathsOf(node) {
    const value = node.penPaths;
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function controlBounds(paths) {
    let x = Infinity, y = Infinity, right = -Infinity, bottom = -Infinity;
    for (const path of paths) {
      const data = IconfontGeometry.canonicalize(path.data);
      const numbers = data.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g) || [];
      for (let i = 0; i < numbers.length; i += 2) {
        const u = Number(numbers[i]), v = Number(numbers[i + 1]);
        x = Math.min(x, u); y = Math.min(y, v);
        right = Math.max(right, u); bottom = Math.max(bottom, v);
      }
    }
    return {x, y, width: right - x, height: bottom - y};
  }

  function setWorld(node, world) {
    const parentWorld = matrixOf(node.parent);
    if (!parentWorld) refuse('无法定位原图层父级。');
    if (!sameMatrix(matrixOf(node), world)) node.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(parentWorld), world);
    if (!sameMatrix(matrixOf(node), world)) refuse('父级布局限制了图形的位置。');
  }

  let fillStyle;
  function write(pen, paths, originalWorld) {
    const originalFills = pen.fills;
    const keepFill = originalFills?.some(p => p.type === 'SOLID' && p.isVisible !== false &&
      (p.color?.a ?? p.alpha ?? 1) === 1 && ['r', 'g', 'b'].every(k => p.color[k] === prepared.paint.color[k]));
    pen.penPaths = paths.map(p => ({windingRule: 'Nonzero', data: p.data}));
    if (!keepFill) pen.fills = [prepared.paint];
    if (fillStyle && pen.fillStyleId !== fillStyle) pen.fillStyleId = fillStyle;
    pen.strokes = [];

    // Some hosts rebase pen coordinates to their visual origin on assignment.
    // Recover that translation from the readback before applying the original
    // transformation, so padding, rotated parents and mirrored icons survive.
    const actual = pathsOf(pen);
    if (!actual.length || actual.some(p => String(p.windingRule).toUpperCase() !== 'NONZERO')) refuse('宿主未保留修复后的路径填充规则。');
    const before = controlBounds(paths), after = controlBounds(actual);
    if (!near(before.width, after.width) || !near(before.height, after.height)) refuse('宿主改变了写入轮廓的尺寸。');
    const offset = [[1, 0, before.x - after.x], [0, 1, before.y - after.y]];
    setWorld(pen, iconfontMatrixProduct(originalWorld, offset));
  }

  const parent = source.parent;
  if (!parent) refuse('图层已不在画布中。');
  const sourceLayout = savedLayout(source);
  const priorInk = copy(source.absoluteRenderBounds);
  const wrappers = ['FRAME', 'COMPONENT', 'GROUP'];
  const wrapper = wrappers.includes(source.type);
  const children = wrapper ? Array.from(source.children) : [];
  const visible = children.filter(shown);
  let target = source;
  while (wrappers.includes(target.type) && !paintVisible(target.fills) && !paintVisible(target.strokes)) {
    const ink = target.children.filter(shown);
    if (ink.length !== 1 || (!wrappers.includes(ink[0].type) && ink[0].type !== 'PEN')) break;
    if (protectedNode(ink[0]) || isComponent(ink[0])) refuse('内部图层受保护，无法原位修复。');
    target = ink[0];
  }
  const existing = target.type === 'PEN' ? target : null;
  const guarded = new Map();
  for (let n = existing || source; n && n.type !== 'PAGE'; n = n.parent) {
    if (wrappers.includes(n.type) || flex(n.parent)) guarded.set(n, savedLayout(n));
  }
  function guardLayout() {
    for (const [node, before] of guarded) checkLayout(node, before);
  }
  const affected = existing ? [existing] : wrapper ? visible : [source];
  const styles = new Set();
  function collectStyles(node) {
    if (paintVisible(node.fills)) styles.add(node.fillStyleId || '');
    if (paintVisible(node.strokes)) styles.add(node.strokeFillStyleId || '');
    if (!existing && node.type !== 'BOOLEAN_OPERATION') for (const child of node.children || []) if (shown(child)) collectStyles(child);
  }
  affected.forEach(collectStyles);
  if (styles.size > 1) refuse('图标包含不同的颜色样式，合并会丢失样式连接。');
  [fillStyle] = styles;
  if (!prepared.paint || prepared.paint.type !== 'SOLID') refuse('无法还原图标的纯色填充。');

  if (existing) {
    if (protectedNode(existing)) refuse('目标路径包含锁定或组件属性绑定。');
    if (existing.cornerRadiusStyleId || (typeof existing.cornerRadius === 'number' && existing.cornerRadius > 0)) {
      refuse('圆角路径需要先转换为实际轮廓。');
    }
    const paths = iconfontLocalPaths(existing, prepared);
    const old = {paths: copy(pathsOf(existing)), network: copy(existing.penNetwork), relative: copy(existing.relativeTransform),
      fills: copy(existing.fills), strokes: copy(existing.strokes), fillStyleId: existing.fillStyleId, strokeFillStyleId: existing.strokeFillStyleId};
    const world = copy(matrixOf(existing));
    try {
      write(existing, paths, world);
      guardLayout();
      if (priorInk && !iconfontCloseBox(priorInk, source.absoluteRenderBounds)) refuse('写入会改变原图标的可见边界。');
      return {node: source};
    } catch (error) {
      if (old.network) existing.penNetwork = old.network;
      else existing.penPaths = old.paths;
      existing.fills = old.fills;
      existing.strokes = old.strokes;
      if (old.fillStyleId) existing.fillStyleId = old.fillStyleId;
      if (old.strokeFillStyleId) existing.strokeFillStyleId = old.strokeFillStyleId;
      if (old.relative) existing.relativeTransform = old.relative;
      throw error;
    }
  }

  if (wrapper && (paintVisible(source.fills) || paintVisible(source.strokes))) refuse('请先将容器自身的填充或描边转换为矢量。');
  if (wrapper && (source.type === 'COMPONENT' || flex(source))) refuse('组件或自动布局容器需要保留其内部图层。');
  const owner = wrapper ? source : parent;
  if (!wrapper && flex(parent)) refuse('自动布局中的图层需要保留原有身份和尺寸。');
  if (typeof owner.insertChild !== 'function') refuse('父级不允许替换图层。');
  const replaced = wrapper ? visible : [source];
  function checkRemoval(node) {
    if (!shown(node) || protectedNode(node) || isComponent(node) || node.attachedConnectors?.length ||
        node.reactions?.length || node.getPluginDataKeys?.().length || (wrapper && node.exportSettings?.length)) {
      refuse('替换会影响隐藏图层、组件绑定、导出设置或交互关系。');
    }
    for (const child of node.children || []) checkRemoval(child);
  }
  replaced.forEach(checkRemoval);
  for (let n = parent; n && n.type !== 'PAGE'; n = n.parent) {
    if (isComponent(n)) refuse('组件内部需要保留此图层的身份。');
  }
  if (affected.length > 1 && new Set(affected.map(n => JSON.stringify(n.constraints))).size > 1) {
    refuse('子图层的缩放约束不同，无法合并为一个路径。');
  }
  const order = Array.from(owner.children);
  const entries = replaced.map(node => ({node, index: order.indexOf(node), world: copy(matrixOf(node))}));
  const index = entries.length ? entries[0].index : 0;
  const paths = iconfontLocalPaths(source, prepared);
  let backup, pen;
  try {
    backup = host.createFrame();
    backup.fills = [];
    pen = host.createPen();
    owner.insertChild(index, pen);
    pen.name = wrapper ? (visible.length === 1 ? visible[0].name : source.name) : source.name;
    if (wrapper && affected[0]?.constraints) pen.constraints = copy(affected[0].constraints);
    if (!wrapper) {
      pen.exportSettings = copy(source.exportSettings || []);
      for (const key of ['constraints', 'constrainProportions', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight']) {
        if (source[key] !== undefined) pen[key] = copy(source[key]);
      }
    }
    for (const entry of entries) backup.appendChild(entry.node);
    write(pen, paths, sourceLayout.world);
    const output = wrapper ? source : pen;
    guardLayout();
    checkLayout(output, sourceLayout);
    if (priorInk && !iconfontCloseBox(priorInk, output.absoluteRenderBounds)) refuse('替换会改变原图标的可见边界。');
    backup.remove();
    return {node: output};
  } catch (error) {
    // Keep a populated group alive while moving its original children back.
    for (const entry of entries.slice().reverse()) {
      if (backup && entry.node.parent === backup) {
        const next = order.slice(entry.index + 1).find(node => node.parent === owner);
        owner.insertChild(next ? owner.children.indexOf(next) : owner.children.length, entry.node);
      }
    }
    if (pen && !pen.removed) pen.remove();
    for (const entry of entries) {
      if (entry.node.parent === owner && !sameMatrix(matrixOf(entry.node), entry.world)) {
        entry.node.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(matrixOf(owner)), entry.world);
      }
    }
    if (backup && !backup.removed && !backup.children.length) backup.remove();
    throw error;
  }
}

// Each batch snapshots its page and icon roots before the first canvas write.
let iconfontRunning = false;
let iconfontWatchingSelection = false;
function iconfontRoots(selection) {
  const selected = new Set(selection.map(node => node.id));
  return selection.filter(node => {
    for (let parent = node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
      if (selected.has(parent.id)) return false;
    }
    return true;
  });
}

function iconfontChildren(roots) {
  const children = [];
  for (const root of roots) {
    if (!('children' in root)) continue;
    for (const child of root.children) {
      if ((layerPlatform === 'figma' ? child.visible : child.isVisible) !== false) children.push(child);
    }
  }
  return children;
}

function sendIconfontSelection() {
  if (!iconfontWatchingSelection) return;
  const roots = iconfontRoots(Array.from(layerPage().selection));
  const children = iconfontChildren(roots);
  const describe = node => ({ id: node.id, name: node.name });
  layerSend({ type: 'iconfont-selection', count: roots.length, childCount: children.length,
    targets: { selection: roots.map(describe), children: children.map(describe) } });
}

// Reserve a grid beside the selection and move it past any top-level artwork in its way.
function iconfontGrid(page, roots, icons) {
  const bounds = node => node.absoluteBoundingBox || node.absoluteRenderBounds;
  const boxes = roots.map(bounds).filter(Boolean);
  const cols = Math.ceil(Math.sqrt(icons.length));
  let stepX = 1, stepY = 1;
  for (const node of icons) {
    const box = bounds(node);
    const ink = node.absoluteRenderBounds;
    stepX = Math.max(stepX, node.width || 0, box?.width || 0, ink?.width || 0);
    stepY = Math.max(stepY, node.height || 0, box?.height || 0, ink?.height || 0);
  }
  stepX += 16;
  stepY += 16;
  const y = boxes.reduce((min, box) => Math.min(min, box.y), boxes[0]?.y || 0);
  let x = boxes.reduce((right, box) => Math.max(right, box.x + box.width), boxes[0]?.x || 0) + 32;
  const width = cols * stepX, height = Math.ceil(icons.length / cols) * stepY;
  const obstacles = page.children.map(bounds).filter(box => box && box.y < y + height && box.y + box.height > y)
    .sort((a, b) => a.x - b.x);
  for (const box of obstacles) {
    if (box.x < x + width && box.x + box.width > x) x = box.x + box.width + 32;
  }
  return index => ({ x: x + (index % cols) * stepX, y: y + Math.floor(index / cols) * stepY });
}

function iconfontReason(error, en) {
  if (!en) return String(error?.message || error);
  const reasons = {
    'iconfont-inplace': 'This structure cannot be repaired in place. Use a repaired copy.',
    'iconfont-inplace-layout': 'Repairing in place would change the layout. Use a repaired copy.',
    'iconfont-paint': 'Use opaque solid fills and strokes.',
    'iconfont-color': 'The icon contains multiple colors.',
    'iconfont-effect': 'Remove transparency, effects or blending before converting.',
    'iconfont-mask': 'Resolve the mask or clipping before converting.',
    'iconfont-type': 'This layer type cannot be converted to an icon.',
    'iconfont-empty': 'The layer contains no visible filled outline.',
    'iconfont-geometry': 'The outline could not be safely converted.'
  };
  return reasons[error?.code] || (String(error?.code || '').startsWith('geometry-')
    ? 'The path could not be safely converted. Check for intersecting or degenerate contours.'
    : 'The editor could not create this icon.');
}

async function handleIconfontMessage(msg) {
  if (msg.type === 'get-iconfont-selection') {
    iconfontWatchingSelection = true;
    sendIconfontSelection();
    return;
  }
  const en = msg.uiLanguage === 'en';
  const action = msg.action === undefined ? 'copy' : msg.action;
  const items = [];
  const reply = error => layerSend({ type: 'iconfont-repair-result', requestId: msg.requestId, action, items, error });
  if (iconfontRunning) { reply(en ? 'A batch is already running.' : '上一批图标正在处理。'); return; }
  if (!['copy','inplace'].includes(action)) { reply(en ? 'Unknown repair operation.' : '修复操作无效。'); return; }
  const requested = Array.isArray(msg.targetIds) ? new Set(msg.targetIds) : null;
  if ((action === 'inplace' && !requested) || requested?.size === 0) {
    reply(en ? 'Check the icons to repair.' : '请勾选要修复的图标。'); return;
  }
  iconfontRunning = true;
  try {
    const page = layerPage();
    const originalSelection = Array.from(page.selection);
    const roots = iconfontRoots(originalSelection);
    const candidates = msg.mode === 'children' ? iconfontChildren(roots) : roots;
    const icons = requested ? candidates.filter(node => requested.has(node.id)) : candidates;
    if (requested && icons.length !== requested.size) {
      reply(en ? 'The selection changed. Check the current targets and try again.' : '选区已变化，请核对勾选目标后重试。');
      sendIconfontSelection();
      return;
    }
    if (!icons.length) { reply(en ? 'Select icons or a board with visible children.' : '请选择图标，或选择含有可见子图层的画板。'); return; }
    const position = action === 'copy' ? iconfontGrid(page, roots, icons) : null;
    const previousIds = layerIds(originalSelection);
    const outputs = [];
    const names = icons.map(icon => icon.name);
    for (let index = 0; index < icons.length; index++) {
      if (layerPage().id !== page.id) { reply(en ? 'Page changed. The batch stopped.' : '当前页面已切换，批量处理已停止。'); return; }
      const icon = icons[index], name = names[index];
      try {
        const dest = position ? position(outputs.length) : null;
        const output = await iconfontRepair(icon, dest, layerHost, layerPlatform === 'mastergo', action);
        outputs.push(output.node);
        const item = { name, status: 'fixed' };
        if (action === 'copy') item.svg = output.svg;
        items.push(item);
      } catch (error) {
        items.push({ name, status: error?.code ? 'skipped' : 'failed', reason: iconfontReason(error, en) });
      }
      layerSend({ type: 'iconfont-repair-progress', requestId: msg.requestId, done: index + 1, total: icons.length });
      if ((index + 1) % 8 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (outputs.length && layerPage().id === page.id) {
      const selectedIds = layerIds(page.selection);
      if (selectedIds === previousIds || selectedIds === layerIds(originalSelection.filter(node => !node.removed))) {
        page.selection = outputs.filter(node => !node.removed);
      }
      if (typeof layerHost.commitUndo === 'function') layerHost.commitUndo();
    }
    reply();
  } catch (error) {
    reply(en ? 'The editor stopped the batch.' : '宿主中断了本批处理：' + String(error?.message || error));
  } finally {
    iconfontRunning = false;
  }
}

// shared-host-locale:end
// -------------------------------------------------------------
// 【更新】高级命名转换函数 (支持清除隐藏标记)
// -------------------------------------------------------------
const convertNameAdvanced = (str, format, sepMode, casing, keepEmoji, removeId, unmarkHidden) => {
    let s = str;
    // 1. 移除 ID
    if (removeId)
        s = s.replace(/#\d+:\d+$/, '').trim();
    // 2. 处理隐藏标记 (. 或 _)
    // 逻辑：先提取出来，如果不清除，最后再加回去
    let hiddenPrefix = "";
    const hiddenMatch = s.match(/^[\._]/);
    if (hiddenMatch) {
        hiddenPrefix = hiddenMatch[0];
        // 暂时去掉以便后续分词处理
        s = s.substring(1);
    }
    // 3. 处理 Emoji
    let emojiPrefix = "";
    if (keepEmoji) {
        const match = s.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|[\u2000-\u3300]|[\uF000-\uF0FF])+\s*/u);
        if (match) {
            emojiPrefix = match[0].trim();
            s = s.replace(match[0], '');
        }
    }
    s = s.trim();
    // 4. 分词与重组
    const words = s.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+|[\u4e00-\u9fa5]+/g);
    let newVal = s;
    if (words && words.length > 0) {
        let processedWords = Array.from(words);
        if (format === 'camelCase') {
            processedWords = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            newVal = processedWords.join('');
        }
        else if (format === 'PascalCase') {
            processedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            newVal = processedWords.join('');
        }
        else {
            if (casing === 'upper')
                processedWords = words.map(w => w.toUpperCase());
            else if (casing === 'lower')
                processedWords = words.map(w => w.toLowerCase());
            let separatorChar = ' ';
            if (sepMode === 'snake')
                separatorChar = '_';
            if (sepMode === 'kebab')
                separatorChar = '-';
            newVal = processedWords.join(separatorChar);
        }
    }
    // 5. 加回 Emoji
    if (keepEmoji && emojiPrefix) {
        const joiner = (format === 'separator' && sepMode !== 'space') ? (sepMode === 'snake' ? '_' : '-') : ' ';
        newVal = emojiPrefix + joiner + newVal;
    }
    // 6. 加回隐藏标记 (如果未勾选清除)
    if (!unmarkHidden && hiddenPrefix) {
        newVal = hiddenPrefix + newVal;
    }
    return { changed: newVal !== str, val: newVal };
};
mg.showUI(__html__, { width: 440, height: 600 });
installLayerTools();
// Smart Fill: one deduplicated, visible selection for both count and write.
const collectSmartFillTextNodes = (roots) => {
    const nodes = [];
    const seen = new Set();
    const stack = [...roots].reverse().filter(root => {
        for (let parent = root === null || root === void 0 ? void 0 : root.parent; parent && parent.type !== 'PAGE'; parent = parent.parent)
            if (parent.isVisible === false)
                return false;
        return true;
    });
    while (stack.length) {
        const node = stack.pop();
        if (!node || node.removed || node.isVisible === false || seen.has(node.id))
            continue;
        seen.add(node.id);
        if (node.type === 'TEXT')
            nodes.push(node);
        else if ('children' in node)
            for (let i = node.children.length - 1; i >= 0; i--)
                stack.push(node.children[i]);
    }
    // Fixed row anchors make ordering independent of the selection's input order.
    const positioned = nodes.map(node => ({ node, box: node.absoluteBoundingBox || { x: node.x || 0, y: node.y || 0 } }))
        .sort((a, b) => a.box.y - b.box.y || a.box.x - b.box.x || a.node.id.localeCompare(b.node.id));
    const ordered = [];
    for (let start = 0; start < positioned.length;) {
        let end = start + 1;
        while (end < positioned.length && positioned[end].box.y - positioned[start].box.y <= 10)
            end++;
        const row = positioned.slice(start, end).sort((a, b) => a.box.x - b.box.x || a.box.y - b.box.y || a.node.id.localeCompare(b.node.id));
        row.forEach(item => ordered.push(item.node));
        start = end;
    }
    return ordered;
};
const loadSmartFillFonts = async (node, loaded) => {
    const fonts = (node.textStyles || []).map(segment => { var _a; return (_a = segment.textStyle) === null || _a === void 0 ? void 0 : _a.fontName; }).filter(Boolean);
    if (!fonts.length && node.fontName && typeof node.fontName === 'object')
        fonts.push(node.fontName);
    if (!fonts.length)
        throw new Error('无法读取字体，请先为文本设置可用字体');
    for (const font of fonts) {
        if (!font || typeof font.family !== 'string' || typeof font.style !== 'string') {
            throw new Error('字体信息不完整，请先为文本设置可用字体');
        }
        const key = JSON.stringify(font);
        if (!loaded.has(key))
            loaded.set(key, mg.loadFontAsync(font).then(result => {
                if (result === false)
                    throw new Error(`字体不可用：${font.family} ${font.style}`);
            }));
        try {
            await loaded.get(key);
        }
        catch (_) {
            throw new Error(`字体不可用：${font.family} ${font.style}，请安装或替换该字体`);
        }
    }
};
// MasterGo 与原插件的 UI 消息封装不同。保持既有 pluginMessage 协议，
// 这样前端功能和事件监听可以逐项等价复用。
const sendToUI = (message) => mg.ui.postMessage({ pluginMessage: message });
const toMGColor = (color, alpha) => {
    var _a, _b, _c, _d, _e;
    return ({
        r: Number((_a = color === null || color === void 0 ? void 0 : color.r) !== null && _a !== void 0 ? _a : 0),
        g: Number((_b = color === null || color === void 0 ? void 0 : color.g) !== null && _b !== void 0 ? _b : 0),
        b: Number((_c = color === null || color === void 0 ? void 0 : color.b) !== null && _c !== void 0 ? _c : 0),
        a: Number((_e = (_d = alpha !== null && alpha !== void 0 ? alpha : color === null || color === void 0 ? void 0 : color.a) !== null && _d !== void 0 ? _d : color === null || color === void 0 ? void 0 : color.opacity) !== null && _e !== void 0 ? _e : 1)
    });
};
const solidPaint = (color, alpha = 1) => ({
    type: 'SOLID',
    color: toMGColor(color, alpha)
});
const paintAlpha = (paint) => { var _a, _b, _c; return (paint === null || paint === void 0 ? void 0 : paint.type) === 'SOLID' ? Number((_b = (_a = paint === null || paint === void 0 ? void 0 : paint.color) === null || _a === void 0 ? void 0 : _a.a) !== null && _b !== void 0 ? _b : 1) : Number((_c = paint === null || paint === void 0 ? void 0 : paint.alpha) !== null && _c !== void 0 ? _c : 1); };
const isNodeVisible = (node) => (node === null || node === void 0 ? void 0 : node.isVisible) !== false;
const isNodeLocked = (node) => (node === null || node === void 0 ? void 0 : node.isLocked) === true;
const setNodeVisible = (node, value) => trySet(node, 'isVisible', value);
const setNodeLocked = (node, value) => trySet(node, 'isLocked', value);
const textSegmentAt = (node, index = 0) => { var _a, _b; return ((_a = node === null || node === void 0 ? void 0 : node.textStyles) === null || _a === void 0 ? void 0 : _a.find((segment) => index >= segment.start && index < segment.end)) || ((_b = node === null || node === void 0 ? void 0 : node.textStyles) === null || _b === void 0 ? void 0 : _b[0]) || null; };
const firstTextSegment = (node, index = 0) => { var _a; return ((_a = textSegmentAt(node, index)) === null || _a === void 0 ? void 0 : _a.textStyle) || null; };
const getTextFontName = (node, index = 0) => { var _a; return ((_a = firstTextSegment(node, index)) === null || _a === void 0 ? void 0 : _a.fontName) || null; };
const getTextFontSize = (node, index = 0) => { var _a, _b; return Number((_b = (_a = firstTextSegment(node, index)) === null || _a === void 0 ? void 0 : _a.fontSize) !== null && _b !== void 0 ? _b : 12); };
const getTextLineHeight = (node, index = 0) => { var _a; return ((_a = firstTextSegment(node, index)) === null || _a === void 0 ? void 0 : _a.lineHeight) || { unit: 'AUTO' }; };
const getTextLetterSpacing = (node, index = 0) => { var _a; return ((_a = firstTextSegment(node, index)) === null || _a === void 0 ? void 0 : _a.letterSpacing) || { unit: 'PIXELS', value: 0 }; };
const getTextDecoration = (node, index = 0) => { var _a; return ((_a = firstTextSegment(node, index)) === null || _a === void 0 ? void 0 : _a.textDecoration) || 'NONE'; };
const getTextStyleId = (node, index = 0) => { var _a; return ((_a = textSegmentAt(node, index)) === null || _a === void 0 ? void 0 : _a.textStyleId) || ''; };
const getTextFills = (node, index = 0) => { var _a; return ((_a = textSegmentAt(node, index)) === null || _a === void 0 ? void 0 : _a.fills) || []; };
const loadTextFonts = async (node) => {
    var _a;
    const fonts = new Map();
    for (const segment of (node === null || node === void 0 ? void 0 : node.textStyles) || []) {
        const font = (_a = segment === null || segment === void 0 ? void 0 : segment.textStyle) === null || _a === void 0 ? void 0 : _a.fontName;
        if (font)
            fonts.set(`${font.family}\u0000${font.style}`, font);
    }
    if (fonts.size === 0) {
        const font = getTextFontName(node);
        if (font)
            fonts.set(`${font.family}\u0000${font.style}`, font);
    }
    for (const font of fonts.values())
        await mg.loadFontAsync(font);
};
const fullTextEnd = (node) => Math.max(0, String((node === null || node === void 0 ? void 0 : node.characters) || '').length);
const setTextFontName = (node, value) => node.setRangeFontName(0, fullTextEnd(node), value);
const setTextFontSize = (node, value) => node.setRangeFontSize(0, fullTextEnd(node), value);
const setTextLineHeight = (node, value) => node.setRangeLineHeight(0, fullTextEnd(node), value);
const setTextLetterSpacing = (node, value) => node.setRangeLetterSpacing(0, fullTextEnd(node), value);
const setTextDecoration = (node, value) => node.setRangeTextDecoration(0, fullTextEnd(node), value);
const setTextStyleId = (node, value) => node.setRangeTextStyleId(0, fullTextEnd(node), value);
const alignToMasterGo = (value) => ({
    MIN: 'FLEX_START',
    MAX: 'FLEX_END',
    SPACE_BETWEEN: 'SPACING_BETWEEN'
}[value] || value);
const setHorizontalSizing = (node, value) => {
    var _a;
    if ((node === null || node === void 0 ? void 0 : node.flexMode) === 'HORIZONTAL' && value !== 'FILL')
        node.mainAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
    if ((node === null || node === void 0 ? void 0 : node.flexMode) === 'VERTICAL' && value !== 'FILL')
        node.crossAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
    const parentMode = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.flexMode;
    if (parentMode === 'HORIZONTAL')
        node.flexGrow = value === 'FILL' ? 1 : 0;
    else if (parentMode === 'VERTICAL')
        node.alignSelf = value === 'FILL' ? 'STRETCH' : 'INHERIT';
};
const setVerticalSizing = (node, value) => {
    var _a;
    if ((node === null || node === void 0 ? void 0 : node.flexMode) === 'VERTICAL' && value !== 'FILL')
        node.mainAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
    if ((node === null || node === void 0 ? void 0 : node.flexMode) === 'HORIZONTAL' && value !== 'FILL')
        node.crossAxisSizingMode = value === 'HUG' ? 'AUTO' : 'FIXED';
    const parentMode = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.flexMode;
    if (parentMode === 'VERTICAL')
        node.flexGrow = value === 'FILL' ? 1 : 0;
    else if (parentMode === 'HORIZONTAL')
        node.alignSelf = value === 'FILL' ? 'STRETCH' : 'INHERIT';
};
const setStrokeDashes = (node, value) => trySet(node, 'strokeDashes', value);
const ungroupNode = (group) => {
    if (!group || group.type !== 'GROUP' || !group.parent || !Array.isArray(group.children))
        return [];
    const parent = group.parent;
    const startIndex = Array.from(parent.children || []).indexOf(group);
    const children = [...group.children];
    children.forEach((child, index) => parent.insertChild(Math.max(0, startIndex) + index, child));
    group.remove();
    return children;
};
const groupInParent = (nodes, parent) => {
    const group = mg.group(nodes);
    if (parent && group.parent !== parent)
        parent.appendChild(group);
    return group;
};
const jumpbackStorageKey = () => `JUMPBACK_SPOTS_${mg.documentId}`;
const loadJumpbackSpots = async () => (await mg.clientStorage.getAsync(jumpbackStorageKey())) || [];
const saveJumpbackSpots = async (spots) => mg.clientStorage.setAsync(jumpbackStorageKey(), spots);
let imageSizeRequestIndex = 0;
const imageSizeWaiters = new Map();
const requestImageSize = (bytes) => new Promise((resolve) => {
    const reqId = `mg-image-size-${Date.now()}-${++imageSizeRequestIndex}`;
    imageSizeWaiters.set(reqId, resolve);
    sendToUI({ type: 'mg-image-size-request', reqId, bytes });
    setTimeout(() => {
        if (!imageSizeWaiters.has(reqId))
            return;
        imageSizeWaiters.delete(reqId);
        resolve(null);
    }, 10000);
});
// MasterGo 的 STRING 变量已支持 textContent 作用域，但当前公开文档中的
// 图层绑定参数尚未列出文本内容。这里优先尝试原生 characters 绑定，并在
// API 版本不支持时写入节点插件数据，由下面的轻量同步器保持 Mode 切换能力。
const I18N_BINDING_DATA_KEY = 'allinone-i18n-binding';
const normalizeI18nModeName = (value) => {
    const key = String(value || '').toLowerCase().replace(/[\s_()\-]/g, '');
    const aliases = { english: 'en', en: 'en', '英语': 'en', '英文': 'en', '简体中文': 'zhcn', '中文': 'zhcn', chinese: 'zhcn', zhcn: 'zhcn', '繁体中文': 'zhtw', '繁體中文': 'zhtw', zhtw: 'zhtw', '日本語': 'ja', japanese: 'ja', ja: 'ja', '한국어': 'ko', korean: 'ko', ko: 'ko', français: 'fr', french: 'fr', fr: 'fr', deutsch: 'de', german: 'de', de: 'de', español: 'es', spanish: 'es', es: 'es', italiano: 'it', português: 'pt', 'русский': 'ru', 'العربية': 'ar' };
    return aliases[key] || key;
};
const isI18nSourceMode = (value) => /^(original|source|原文|源语言)$/i.test(String(value || '').trim());
const stableI18nVariableName = (text) => {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    const slug = text.slice(0, 24).replace(/[.*{}\/\\\r\n\t,=]/g, '_').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'text';
    return `i18n/${slug}_${(hash >>> 0).toString(36)}`;
};
const i18nFallbackNodeIds = new Set();
const getSimpleVariableValue = (variable, modeId) => {
    var _a;
    const values = (_a = variable === null || variable === void 0 ? void 0 : variable.modes) === null || _a === void 0 ? void 0 : _a[modeId];
    if (!Array.isArray(values) || values.length === 0)
        return undefined;
    const first = values[0];
    return first && typeof first === 'object' && 'value' in first ? first.value : first;
};
const getNodeI18nBinding = (node) => {
    var _a;
    try {
        const raw = (_a = node === null || node === void 0 ? void 0 : node.getPluginData) === null || _a === void 0 ? void 0 : _a.call(node, I18N_BINDING_DATA_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch (_) {
        return null;
    }
};
const bindI18nVariableToText = async (node, variable) => {
    await loadTextFonts(node);
    try {
        await mg.variables.setVariableScopes(variable.id, ['textContent']);
    }
    catch (_) { }
    let native = false;
    try {
        await mg.variables.setVariableReferenceInLayer({
            id: variable.id,
            layerId: node.id,
            textProperty: 'characters'
        });
        native = true;
    }
    catch (_) {
        // 部分 MasterGo API 版本仅开放字体类 textProperty，交给兼容同步器处理。
    }
    node.setPluginData(I18N_BINDING_DATA_KEY, JSON.stringify({
        variableId: variable.id,
        collectionId: variable.collectionId,
        fallback: !native
    }));
    if (native)
        i18nFallbackNodeIds.delete(node.id);
    else
        i18nFallbackNodeIds.add(node.id);
};
const unlinkI18nVariableFromText = async (node) => {
    try {
        await mg.variables.unlinkVariableReferenceInLayer({
            layerId: node.id,
            textProperty: 'characters'
        });
    }
    catch (_) { }
    try {
        node.removePluginData(I18N_BINDING_DATA_KEY);
    }
    catch (_) { }
    i18nFallbackNodeIds.delete(node.id);
};
const discoverMasterGoI18nFallbackBindings = () => {
    var _a;
    for (const node of mg.document.currentPage.findAll((candidate) => candidate.type === 'TEXT')) {
        if ((_a = getNodeI18nBinding(node)) === null || _a === void 0 ? void 0 : _a.fallback)
            i18nFallbackNodeIds.add(node.id);
    }
};
let syncingI18nFallback = false;
const syncMasterGoI18nFallbackBindings = async () => {
    var _a, _b;
    if (syncingI18nFallback)
        return;
    syncingI18nFallback = true;
    try {
        for (const nodeId of [...i18nFallbackNodeIds]) {
            const node = mg.getNodeById(nodeId);
            if (!node || node.removed || node.type !== 'TEXT') {
                i18nFallbackNodeIds.delete(nodeId);
                continue;
            }
            const binding = getNodeI18nBinding(node);
            if (!(binding === null || binding === void 0 ? void 0 : binding.fallback)) {
                i18nFallbackNodeIds.delete(nodeId);
                continue;
            }
            const variable = mg.variables.getVariableById(binding.variableId);
            if (!variable)
                continue;
            const collectionModes = mg.variables.getModes(binding.collectionId);
            const layerModes = mg.variables.getLayerVariableModes(node.id);
            const modeId = ((_a = layerModes.find(item => item.collectionId === binding.collectionId)) === null || _a === void 0 ? void 0 : _a.modeId)
                || ((_b = collectionModes[0]) === null || _b === void 0 ? void 0 : _b.id);
            if (!modeId)
                continue;
            const value = getSimpleVariableValue(variable, modeId);
            if (typeof value !== 'string' || value === node.characters)
                continue;
            await loadTextFonts(node);
            node.characters = value;
        }
    }
    catch (error) {
        console.warn('MasterGo i18n fallback sync failed', error);
    }
    finally {
        syncingI18nFallback = false;
    }
};
setTimeout(() => {
    discoverMasterGoI18nFallbackBindings();
    syncMasterGoI18nFallbackBindings();
}, 0);
setInterval(syncMasterGoI18nFallbackBindings, 1000);
mg.on('currentpagechange', () => {
    i18nFallbackNodeIds.clear();
    discoverMasterGoI18nFallbackBindings();
    syncMasterGoI18nFallbackBindings();
});
// 用于存储高亮前的原始样式： Key = "NodeID_Index", Value = OriginalFills
let highlightCache = {};
let layerSortDirection = 'asc'; // 用于图层排序切换，默认从上到下
let layerNameSortDirection = 'asc'; // 用于按名称排序切换，默认 A→Z
const trySet = (dst, propName, value) => {
    try {
        dst[propName] = value;
    }
    catch (e) { }
};
const trySetDefined = (dst, propName, value) => {
    if (value !== undefined)
        trySet(dst, propName, value);
};
const safeRead = (reader, fallback) => {
    try {
        return reader();
    }
    catch (_) {
        return fallback;
    }
};
const safeNodeValue = (node, propName) => safeRead(() => node[propName], undefined);
const isActiveAutoLayoutNode = (node) => {
    const flexMode = safeNodeValue(node, 'flexMode');
    return flexMode === 'HORIZONTAL' || flexMode === 'VERTICAL';
};
const isInsideActiveAutoLayout = (node) => {
    const parent = safeRead(() => node === null || node === void 0 ? void 0 : node.parent, null);
    return isActiveAutoLayoutNode(parent);
};
const canSetAutoLayoutBounds = (node) => isActiveAutoLayoutNode(node) || isInsideActiveAutoLayout(node);
const tryCopyNodeValue = (src, dst, propName) => {
    const value = safeNodeValue(src, propName);
    if (value !== undefined)
        trySet(dst, propName, value);
};
const tryCopyNodeJson = (src, dst, propName) => {
    const value = safeNodeValue(src, propName);
    if (value === undefined || value === mg.mixed)
        return;
    trySet(dst, propName, safeRead(() => JSON.parse(JSON.stringify(value)), value));
};
// FrameNode 上 cornerRadius 是只读的，需要通过四个独立角设置
const safeCornerRadius = (node, radius) => {
    try {
        node.cornerRadius = radius;
    }
    catch (e) {
        try {
            node.topLeftRadius = radius;
        }
        catch (_) { }
        try {
            node.topRightRadius = radius;
        }
        catch (_) { }
        try {
            node.bottomLeftRadius = radius;
        }
        catch (_) { }
        try {
            node.bottomRightRadius = radius;
        }
        catch (_) { }
    }
};
function copyNodeStyles(src, dst) {
    [
        'opacity', 'blendMode', 'isMask', 'isMaskOutline', 'isMaskVisible',
        'isVisible', 'isLocked', 'rotation', 'constraints',
        'expanded', 'scaleFactor', 'fillStyleId', 'strokeStyleId', 'strokeFillStyleId',
        'strokeWidthStyleId', 'paddingStyleId', 'spacingStyleId', 'cornerRadiusStyleId',
        'strokeWeight', 'strokeAlign', 'strokeJoin', 'strokeCap', 'strokeStyle', 'dashCap',
        'strokeMiterLimit', 'effectStyleId', 'clipsContent', 'constrainProportions',
        'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight',
        'gridStyleId'
    ].forEach(propName => tryCopyNodeValue(src, dst, propName));
    ['exportSettings', 'fills', 'strokes', 'strokeDashes', 'effects', 'layoutGrids']
        .forEach(propName => tryCopyNodeJson(src, dst, propName));
    const cornerRadius = safeNodeValue(src, 'cornerRadius');
    if (cornerRadius !== undefined && cornerRadius !== mg.mixed) {
        trySet(dst, 'cornerRadius', cornerRadius);
    }
    else if (cornerRadius === mg.mixed) {
        ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
            .forEach(propName => tryCopyNodeValue(src, dst, propName));
    }
    const cornerSmooth = safeNodeValue(src, 'cornerSmooth');
    if (cornerSmooth !== undefined && cornerSmooth !== mg.mixed) {
        trySet(dst, 'cornerSmooth', cornerSmooth);
    }
    const flexMode = safeNodeValue(src, 'flexMode');
    if (flexMode !== undefined && dst.type !== 'RECTANGLE') {
        // 先启用 Auto Layout，再写入仅在 Auto Layout 上合法的尺寸和排列属性。
        tryCopyNodeValue(src, dst, 'flexMode');
        tryCopyNodeValue(src, dst, 'overflowDirection');
        if (flexMode !== 'NONE') {
            [
                'mainAxisSizingMode', 'crossAxisSizingMode',
                'mainAxisAlignItems', 'crossAxisAlignItems', 'crossAxisAlignContent',
                'crossAxisSpacing', 'strokesIncludedInLayout', 'itemReverseZIndex',
                'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing',
                'flexWrap'
            ].forEach(propName => tryCopyNodeValue(src, dst, propName));
        }
    }
    if (canSetAutoLayoutBounds(dst)) {
        ['minWidth', 'maxWidth', 'minHeight', 'maxHeight']
            .forEach(propName => tryCopyNodeValue(src, dst, propName));
    }
    if (isInsideActiveAutoLayout(dst)) {
        ['layoutPositioning', 'alignSelf', 'flexGrow']
            .forEach(propName => tryCopyNodeValue(src, dst, propName));
    }
    // reactions 中可能含已删除节点的 destinationId，必须在节点 ID 映射完成后单独恢复。
}
const copyPluginData = (src, dst) => {
    const keys = safeRead(() => src.getPluginDataKeys() || [], []);
    for (const key of keys) {
        try {
            dst.setPluginData(key, src.getPluginData(key));
        }
        catch (_) { }
    }
};
const getChildren = (node) => {
    try {
        return (node === null || node === void 0 ? void 0 : node.children) ? Array.from(node.children) : [];
    }
    catch (_) {
        return [];
    }
};
const safeMainComponent = (instance) => {
    try {
        return instance.mainComponent;
    }
    catch (_) {
        return null;
    }
};
const safeMainComponentId = (instance) => safeRead(() => { var _a; return (_a = safeMainComponent(instance)) === null || _a === void 0 ? void 0 : _a.id; }, undefined);
const safeNodeById = (id) => {
    if (typeof id !== 'string' || !id)
        return null;
    try {
        const node = mg.getNodeById(id);
        return node && !node.removed && 'type' in node ? node : null;
    }
    catch (_) {
        return null;
    }
};
const safeRemoveNode = (node) => {
    if (!node)
        return;
    try {
        if (!node.removed)
            node.remove();
    }
    catch (_) { }
};
const describeReverseFailure = (error) => {
    const detail = String((error === null || error === void 0 ? void 0 : error.message) || error);
    const missingNode = detail.match(/The node with id ["']?([^"'\s]+)["']? does not exist/i);
    if (missingNode) {
        return `组件仍包含已删除的节点引用（${missingNode[1]}），且结构复制与视觉快照均无法读取`;
    }
    return detail;
};
const getNodeBounds = (node) => {
    const bounds = safeRead(() => node.absoluteBoundingBox, null);
    if (!bounds)
        return null;
    if (![bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite))
        return null;
    return bounds;
};
const boundsOverlap = (a, b) => a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
const getReversePlacement = (source, targetWidth, targetHeight, excludedTargets = []) => {
    const fallbackBounds = {
        x: safeRead(() => source.x, 0),
        y: safeRead(() => source.y, 0),
        width: safeRead(() => source.width, 0),
        height: safeRead(() => source.height, 0)
    };
    const bounds = safeRead(() => source.absoluteBoundingBox, fallbackBounds);
    const placement = {
        x: bounds.x + bounds.width + 48,
        y: bounds.y
    };
    // 连续逆向同一实例时，沿右侧继续排布，避免新母版彼此覆盖。
    // 包含 source 的顶层祖先必须排除，否则候选区域会永远与原画板相交。
    const excludedIds = new Set();
    let ancestor = source;
    while (ancestor) {
        excludedIds.add(ancestor.id);
        ancestor = safeRead(() => (ancestor === null || ancestor === void 0 ? void 0 : ancestor.parent) || null, null);
    }
    excludedTargets.forEach(node => excludedIds.add(node.id));
    const blockers = getChildren(mg.document.currentPage)
        .filter(node => !excludedIds.has(node.id))
        .map(getNodeBounds)
        .filter((item) => Boolean(item));
    const candidate = Object.assign(Object.assign({}, placement), { width: Math.max(0.01, targetWidth !== null && targetWidth !== void 0 ? targetWidth : bounds.width), height: Math.max(0.01, targetHeight !== null && targetHeight !== void 0 ? targetHeight : bounds.height) });
    for (let attempt = 0; attempt < 100; attempt++) {
        const collisions = blockers.filter(item => boundsOverlap(candidate, item));
        if (collisions.length === 0)
            break;
        candidate.x = Math.max(...collisions.map(item => item.x + item.width + 48));
    }
    return { x: candidate.x, y: candidate.y };
};
const placeReverseTarget = (target, placement) => {
    trySet(target, 'x', placement.x);
    trySet(target, 'y', placement.y);
};
const captureReactionSnapshots = (root, warnings) => {
    const snapshots = [];
    const visit = (node, path) => {
        let reactions = [];
        let clearInvalid = false;
        try {
            const value = node.reactions;
            if (Array.isArray(value) && value.length > 0) {
                reactions = JSON.parse(JSON.stringify(value));
            }
        }
        catch (error) {
            clearInvalid = true;
            warnings.push(`图层“${safeRead(() => node.name, '未命名')}”包含失效的原型目标，已跳过其交互`);
        }
        snapshots.push({
            path,
            nodeId: node.id,
            nodeName: safeRead(() => node.name, '未命名'),
            nodeType: node.type,
            reactions,
            clearInvalid
        });
        getChildren(node).forEach((child, index) => visit(child, [...path, index]));
    };
    visit(root, []);
    return snapshots;
};
const restoreReactionSnapshots = (root, snapshots, warnings) => {
    const targets = new Map();
    const idMap = new Map();
    snapshots.forEach(snapshot => {
        const candidate = snapshot.path.length === 0 ? root : resolveNodePath(root, snapshot.path);
        const target = candidate && safeRead(() => candidate.name, '') === snapshot.nodeName
            ? candidate
            : null;
        if (!target)
            return;
        targets.set(snapshot, target);
        idMap.set(snapshot.nodeId, target.id);
    });
    snapshots.forEach(snapshot => {
        const target = targets.get(snapshot);
        if (!target)
            return;
        if (snapshot.reactions.length === 0 && !snapshot.clearInvalid)
            return;
        const reactions = snapshot.reactions.flatMap(reaction => {
            var _a;
            const cloned = safeRead(() => JSON.parse(JSON.stringify(reaction)), null);
            if (!cloned)
                return [];
            const destinationId = (_a = cloned.action) === null || _a === void 0 ? void 0 : _a.destinationId;
            if (typeof destinationId === 'string' && destinationId) {
                const mappedId = idMap.get(destinationId) || destinationId;
                cloned.action.destinationId = mappedId;
                if (cloned.action.type === 'NODE' && !safeNodeById(mappedId)) {
                    warnings.push(`图层“${snapshot.nodeName}”的原型目标已不存在，已跳过该交互`);
                    return [];
                }
            }
            return [cloned];
        });
        try {
            target.reactions = reactions;
        }
        catch (error) {
            warnings.push(`图层“${snapshot.nodeName}”的原型交互未能恢复`);
        }
    });
};
const captureComponentReferences = (root) => {
    const snapshots = [];
    const visit = (node, path) => {
        let refs = null;
        try {
            refs = node.componentPropertyReferences;
        }
        catch (_) { }
        if (refs && Object.keys(refs).length > 0) {
            snapshots.push({
                path,
                nodeName: node.name,
                nodeType: node.type,
                references: Object.assign({}, refs),
                instanceMainComponentId: node.type === 'INSTANCE'
                    ? safeMainComponentId(node)
                    : undefined
            });
        }
        // MasterGo 不允许把外层组件属性绑定到实例内部的更深子层。
        if (node.type === 'INSTANCE')
            return;
        getChildren(node).forEach((child, index) => visit(child, [...path, index]));
    };
    getChildren(root).forEach((child, index) => visit(child, [index]));
    return snapshots;
};
const captureNodeStates = (root) => {
    const snapshots = [];
    const visit = (node, path) => {
        snapshots.push({
            path,
            nodeName: safeRead(() => node.name, '未命名'),
            nodeType: node.type,
            isVisible: safeRead(() => node.isVisible, true),
            isLocked: safeRead(() => node.isLocked, false),
            x: safeRead(() => node.x, 0),
            y: safeRead(() => node.y, 0),
            width: safeRead(() => node.width, 0.01),
            height: safeRead(() => node.height, 0.01),
            layoutPositioning: safeNodeValue(node, 'layoutPositioning'),
            alignSelf: safeNodeValue(node, 'alignSelf'),
            flexGrow: safeNodeValue(node, 'flexGrow'),
            minWidth: safeNodeValue(node, 'minWidth'),
            maxWidth: safeNodeValue(node, 'maxWidth'),
            minHeight: safeNodeValue(node, 'minHeight'),
            maxHeight: safeNodeValue(node, 'maxHeight')
        });
        getChildren(node).forEach((child, index) => visit(child, [...path, index]));
    };
    getChildren(root).forEach((child, index) => visit(child, [index]));
    return snapshots;
};
const resolveNodePath = (root, path) => {
    let current = root;
    for (const index of path) {
        const children = getChildren(current);
        if (!children[index])
            return null;
        current = children[index];
    }
    return current;
};
const resolveSnapshotNode = (root, snapshot) => {
    const target = resolveNodePath(root, snapshot.path);
    if (!target || target.type !== snapshot.nodeType || target.name !== snapshot.nodeName)
        return null;
    return target;
};
const restoreNodeStates = (root, snapshots, restoreLayout) => {
    // 先恢复深层节点，再恢复父层；父层最终尺寸变化会让 FILL 子层按正确规则重新计算。
    const layoutOrder = [...snapshots].sort((a, b) => b.path.length - a.path.length);
    layoutOrder.forEach(snapshot => {
        const node = resolveSnapshotNode(root, snapshot);
        if (!node)
            return;
        // resize/x/y 必须早于 FILL 对应的 alignSelf/flexGrow，否则会把“充满”重新切成固定。
        if (restoreLayout) {
            try {
                node.resize(Math.max(0.01, snapshot.width), Math.max(0.01, snapshot.height));
            }
            catch (_) { }
            trySet(node, 'x', snapshot.x);
            trySet(node, 'y', snapshot.y);
            if (canSetAutoLayoutBounds(node)) {
                trySetDefined(node, 'minWidth', snapshot.minWidth);
                trySetDefined(node, 'maxWidth', snapshot.maxWidth);
                trySetDefined(node, 'minHeight', snapshot.minHeight);
                trySetDefined(node, 'maxHeight', snapshot.maxHeight);
            }
            if (isInsideActiveAutoLayout(node)) {
                trySetDefined(node, 'layoutPositioning', snapshot.layoutPositioning);
                trySetDefined(node, 'alignSelf', snapshot.alignSelf);
                trySetDefined(node, 'flexGrow', snapshot.flexGrow);
                if (snapshot.layoutPositioning === 'ABSOLUTE') {
                    trySet(node, 'x', snapshot.x);
                    trySet(node, 'y', snapshot.y);
                }
            }
        }
    });
    snapshots.forEach(snapshot => {
        const node = resolveSnapshotNode(root, snapshot);
        if (!node)
            return;
        // 属性引用回绑可能立即应用默认值；最后再恢复实例当下真实的显隐状态。
        trySet(node, 'isVisible', snapshot.isVisible);
        trySet(node, 'isLocked', snapshot.isLocked);
    });
};
const restoreTopLevelOrder = (root, snapshots) => {
    const groups = new Map();
    snapshots.forEach(snapshot => {
        const parentPath = snapshot.path.slice(0, -1);
        const key = parentPath.join('/');
        const group = groups.get(key) || [];
        group.push(snapshot);
        groups.set(key, group);
    });
    // 父层先重排，后续才可以按修复后的路径定位更深的容器。
    [...groups.entries()]
        .sort(([a], [b]) => {
        const depthA = a ? a.split('/').length : 0;
        const depthB = b ? b.split('/').length : 0;
        return depthA - depthB;
    })
        .forEach(([key, desired]) => {
        const parentPath = key ? key.split('/').map(Number) : [];
        const parent = parentPath.length === 0 ? root : resolveNodePath(root, parentPath);
        if (!parent || typeof parent.insertChild !== 'function')
            return;
        const available = [...getChildren(parent)];
        const used = new Set();
        desired
            .sort((a, b) => a.path[a.path.length - 1] - b.path[b.path.length - 1])
            .forEach((snapshot, index) => {
            const candidates = available.filter(candidate => !used.has(candidate)
                && candidate.type === snapshot.nodeType
                && safeRead(() => candidate.name, '') === snapshot.nodeName);
            const node = candidates.sort((a, b) => {
                const score = (candidate) => Math.abs(safeRead(() => candidate.width, snapshot.width) - snapshot.width)
                    + Math.abs(safeRead(() => candidate.height, snapshot.height) - snapshot.height)
                    + Math.abs(safeRead(() => candidate.x, snapshot.x) - snapshot.x)
                    + Math.abs(safeRead(() => candidate.y, snapshot.y) - snapshot.y);
                return score(a) - score(b);
            })[0];
            if (!node)
                return;
            used.add(node);
            try {
                parent.insertChild(index, node);
            }
            catch (_) { }
        });
    });
};
const instanceHasBrokenReferences = (instance) => {
    const mainId = safeMainComponentId(instance);
    if (!mainId || !safeNodeById(mainId))
        return true;
    let properties = [];
    try {
        properties = instance.componentProperties || [];
    }
    catch (_) {
        return true;
    }
    return properties.some(property => property.type === 'INSTANCE_SWAP'
        && typeof property.value === 'string'
        && property.value.length > 0
        && !safeNodeById(property.value));
};
const createReverseLeafPlaceholder = (source, warnings) => {
    const frame = mg.createFrame();
    try {
        frame.name = safeRead(() => source.name, '不可读图层');
        frame.resize(Math.max(0.01, safeRead(() => source.width, 0.01)), Math.max(0.01, safeRead(() => source.height, 0.01)));
        trySet(frame, 'flexMode', 'NONE');
        copyNodeStyles(source, frame);
        copyPluginData(source, frame);
        warnings.push(`图层“${frame.name}”无法由 MasterGo 读取内部结构，已保留尺寸和根层样式并降级为 Frame 占位`);
        return frame;
    }
    catch (error) {
        safeRemoveNode(frame);
        throw error;
    }
};
const cloneSceneNodeForReverse = (source, warnings, depth = 0) => {
    if (depth > 64)
        throw new Error('图层嵌套超过安全复制上限');
    const cloneMethod = source.clone;
    // 安全复制阶段遇到断链实例时，禁止把坏绑定带进新母版；改为按当前子层重建 Frame。
    const mustMaterialize = source.type === 'INSTANCE'
        && instanceHasBrokenReferences(source);
    if (!mustMaterialize && typeof cloneMethod === 'function') {
        try {
            return source.clone();
        }
        catch (_) { }
    }
    const children = [...getChildren(source)];
    if (children.length === 0) {
        return createReverseLeafPlaceholder(source, warnings);
    }
    const frame = mg.createFrame();
    const states = captureNodeStates(source);
    const reactions = captureReactionSnapshots(source, warnings);
    try {
        frame.name = safeRead(() => source.name, 'Recovered Layer');
        frame.resize(Math.max(0.01, safeRead(() => source.width, 0.01)), Math.max(0.01, safeRead(() => source.height, 0.01)));
        trySet(frame, 'flexMode', 'NONE');
        children.forEach((child, index) => {
            const recoveredChild = cloneSceneNodeForReverse(child, warnings, depth + 1);
            try {
                frame.insertChild(index, recoveredChild);
            }
            catch (error) {
                safeRemoveNode(recoveredChild);
                throw error;
            }
        });
        copyNodeStyles(source, frame);
        restoreTopLevelOrder(frame, states);
        restoreNodeStates(frame, states, true);
        restoreReactionSnapshots(frame, reactions, warnings);
        copyPluginData(source, frame);
        warnings.push(`图层“${frame.name}”包含失效组件引用，已降级为 Frame 保留当前结构与外观`);
        return frame;
    }
    catch (error) {
        safeRemoveNode(frame);
        throw error;
    }
};
const clearComponentPropertyReferences = (root, warnings) => {
    const visit = (node) => {
        const refs = safeRead(() => node.componentPropertyReferences, null);
        if (refs && Object.keys(refs).length > 0) {
            try {
                node.componentPropertyReferences = {};
            }
            catch (_) {
                warnings.push(`图层“${node.name}”的旧属性引用无法清理`);
            }
        }
        if (node.type === 'INSTANCE')
            return;
        getChildren(node).forEach(visit);
    };
    getChildren(root).forEach(visit);
};
const materializeSceneNodeAsComponent = (source, name, placement, sourceNodeStates, warnings) => {
    const reactionSnapshots = captureReactionSnapshots(source, warnings);
    const sourceChildren = [...getChildren(source)];
    if (source.type === 'INSTANCE' && sourceChildren.length === 0 && !safeMainComponent(source)) {
        warnings.push('实例母版和可见子层均不可读取，已创建保留根层尺寸与样式的空组件占位');
    }
    const createdChildren = [];
    const component = mg.createComponent();
    try {
        component.name = name || safeRead(() => source.name, 'Reversed Component');
        component.resize(Math.max(0.01, safeRead(() => source.width, 0.01)), Math.max(0.01, safeRead(() => source.height, 0.01)));
        placeReverseTarget(component, placement);
        trySet(component, 'flexMode', 'NONE');
        sourceChildren.forEach((child, index) => {
            const childClone = cloneSceneNodeForReverse(child, warnings);
            createdChildren.push(childClone);
            component.insertChild(index, childClone);
        });
        copyNodeStyles(source, component);
        restoreTopLevelOrder(component, sourceNodeStates);
        restoreNodeStates(component, sourceNodeStates, true);
        restoreReactionSnapshots(component, reactionSnapshots, warnings);
        copyPluginData(source, component);
        warnings.push(source.type === 'INSTANCE'
            ? '实例原生解绑遇到失效节点，已改用安全复制模式完成逆向'
            : `变体“${name}”无法安全实例化，已直接从原组件结构完成逆向`);
        return component;
    }
    catch (error) {
        createdChildren.forEach(safeRemoveNode);
        safeRemoveNode(component);
        throw error;
    }
};
const materializeSceneNodeAsRasterComponent = async (source, name, placement, warnings) => {
    let exported = null;
    try {
        exported = await source.exportAsync({ format: 'PNG' });
    }
    catch (asyncExportError) {
        warnings.push(`异步视觉快照失败，已尝试同步导出：${String((asyncExportError === null || asyncExportError === void 0 ? void 0 : asyncExportError.message) || asyncExportError)}`);
        exported = safeRead(() => source.export({ format: 'PNG' }), null);
    }
    if (!(exported instanceof Uint8Array) || exported.byteLength === 0) {
        throw new Error('实例 PNG 快照为空');
    }
    const image = await mg.createImage(exported);
    const component = mg.createComponent();
    const rectangle = mg.createRectangle();
    try {
        const width = Math.max(0.01, safeRead(() => source.width, 0.01));
        const height = Math.max(0.01, safeRead(() => source.height, 0.01));
        component.name = name || safeRead(() => source.name, 'Reversed Component');
        component.resize(width, height);
        component.fills = [];
        component.strokes = [];
        trySet(component, 'flexMode', 'NONE');
        placeReverseTarget(component, placement);
        rectangle.name = '视觉快照（原结构含失效引用）';
        rectangle.resize(width, height);
        rectangle.x = 0;
        rectangle.y = 0;
        rectangle.fills = [{
                type: 'IMAGE',
                imageRef: image.href,
                scaleMode: 'FILL'
            }];
        component.appendChild(rectangle);
        rectangle.x = 0;
        rectangle.y = 0;
        warnings.push('原结构包含宿主无法解析的失效节点，已用可编辑组件容器承载视觉快照；内部图层与属性无法完整恢复');
        return component;
    }
    catch (error) {
        safeRemoveNode(rectangle);
        safeRemoveNode(component);
        throw error;
    }
};
const copyPublishableMetadata = (src, dst) => {
    if (!src)
        return;
    trySet(dst, 'description', safeRead(() => src.description || '', ''));
    trySet(dst, 'alias', safeRead(() => src.alias || '', ''));
    const links = safeRead(() => src.documentationLinks, []);
    if (Array.isArray(links)) {
        trySet(dst, 'documentationLinks', links.map((item) => ({ uri: item.uri })));
    }
};
const transferFrameToComponent = (frame, name = frame.name, warnings = []) => {
    const parent = frame.parent;
    if (!parent || !parent.children || typeof parent.insertChild !== 'function') {
        throw new Error('所选 Frame 没有可写入的父级容器');
    }
    const index = Math.max(0, Array.from(parent.children).indexOf(frame));
    const geometry = { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
    const children = [...getChildren(frame)];
    const nodeStates = captureNodeStates(frame);
    const reactionSnapshots = captureReactionSnapshots(frame, warnings);
    const component = mg.createComponent();
    try {
        parent.insertChild(index, component);
        component.name = name || 'Component';
        component.x = geometry.x;
        component.y = geometry.y;
        component.resize(Math.max(0.01, geometry.width), Math.max(0.01, geometry.height));
        // 先按绝对位置搬运子层，再恢复 Auto Layout，避免搬运过程中发生二次回流。
        trySet(component, 'flexMode', 'NONE');
        children.forEach((child, childIndex) => {
            component.insertChild(childIndex, child);
        });
        copyNodeStyles(frame, component);
        restoreNodeStates(component, nodeStates, true);
        restoreReactionSnapshots(component, reactionSnapshots, warnings);
        copyPluginData(frame, component);
        frame.remove();
        return component;
    }
    catch (error) {
        if (!frame.removed) {
            children.forEach((child, childIndex) => {
                if (!child.removed && child.parent !== frame)
                    frame.insertChild(childIndex, child);
            });
            restoreNodeStates(frame, nodeStates, true);
        }
        if (!component.removed)
            component.remove();
        throw error;
    }
};
const uniquePropertyName = (raw, fallback, used) => {
    const cleaned = String(raw || '')
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 64) || fallback;
    let name = cleaned;
    let suffix = 2;
    while (used.has(name.toLocaleLowerCase()))
        name = `${cleaned} ${suffix++}`;
    used.add(name.toLocaleLowerCase());
    return name;
};
const exposeBuilderProperties = (component, exposeText, exposeInstances) => {
    const used = new Set(component.componentPropertyValues.map(property => property.name.toLocaleLowerCase()));
    let textCount = 0;
    let instanceCount = 0;
    const warnings = [];
    const visit = (node) => {
        var _a;
        if (node.type === 'INSTANCE') {
            if (exposeInstances) {
                const instance = node;
                const main = safeMainComponent(instance);
                if (!main) {
                    warnings.push(`实例“${node.name}”缺少可访问的主组件，已跳过实例属性`);
                }
                else {
                    try {
                        const propertyName = uniquePropertyName(node.name, `Instance ${instanceCount + 1}`, used);
                        const preferredValues = [
                            { type: 'COMPONENT', key: main.ukey }
                        ];
                        if (((_a = main.parent) === null || _a === void 0 ? void 0 : _a.type) === 'COMPONENT_SET') {
                            preferredValues.push({ type: 'COMPONENT_SET', key: main.parent.ukey });
                        }
                        const propertyId = component.addComponentProperty(propertyName, 'INSTANCE_SWAP', main.id, { preferredValues });
                        node.componentPropertyReferences = Object.assign(Object.assign({}, (node.componentPropertyReferences || {})), { mainComponent: propertyId });
                        instanceCount++;
                    }
                    catch (error) {
                        warnings.push(`实例“${node.name}”属性创建失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
                    }
                }
            }
            return;
        }
        if (node.type === 'TEXT' && exposeText) {
            const text = node;
            try {
                const fallback = `Text ${textCount + 1}`;
                const propertyName = uniquePropertyName(node.name || text.characters, fallback, used);
                const propertyId = component.addComponentProperty(propertyName, 'TEXT', text.characters);
                node.componentPropertyReferences = Object.assign(Object.assign({}, (node.componentPropertyReferences || {})), { characters: propertyId });
                textCount++;
            }
            catch (error) {
                warnings.push(`文本“${node.name}”属性创建失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
        }
        getChildren(node).forEach(visit);
    };
    getChildren(component).forEach(visit);
    return { textCount, instanceCount, warnings };
};
const normalizeBuilderLayerName = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
const collectBuilderSetCandidates = (component, exposeText, exposeInstances) => {
    const candidates = [];
    const visit = (parent, parentKey) => {
        const siblingOccurrences = new Map();
        getChildren(parent).forEach(child => {
            const baseKey = `${child.type}:${normalizeBuilderLayerName(child.name)}`;
            const occurrence = (siblingOccurrences.get(baseKey) || 0) + 1;
            siblingOccurrences.set(baseKey, occurrence);
            const key = `${parentKey}/${baseKey}#${occurrence}`;
            if (child.type === 'INSTANCE') {
                if (exposeInstances)
                    candidates.push({ key, node: child });
                return;
            }
            if (child.type === 'TEXT' && exposeText) {
                candidates.push({ key, node: child });
            }
            visit(child, key);
        });
    };
    visit(component, 'root');
    return candidates;
};
const exposeBuilderPropertiesForSet = (set, exposeText, exposeInstances) => {
    const used = new Set(set.componentPropertyValues.map(property => property.name.toLocaleLowerCase()));
    const groups = new Map();
    const variants = getChildren(set).filter(node => node.type === 'COMPONENT');
    variants.forEach(component => {
        collectBuilderSetCandidates(component, exposeText, exposeInstances).forEach(candidate => {
            const group = groups.get(candidate.key) || [];
            group.push(candidate.node);
            groups.set(candidate.key, group);
        });
    });
    let textCount = 0;
    let instanceCount = 0;
    const warnings = [];
    groups.forEach(nodes => {
        const first = nodes[0];
        if (first.type === 'TEXT') {
            try {
                const propertyName = uniquePropertyName(first.name || first.characters, `Text ${textCount + 1}`, used);
                const propertyId = set.addComponentProperty(propertyName, 'TEXT', first.characters);
                nodes.forEach(node => {
                    if (node.type !== 'TEXT')
                        return;
                    try {
                        node.componentPropertyReferences = Object.assign(Object.assign({}, (node.componentPropertyReferences || {})), { characters: propertyId });
                    }
                    catch (error) {
                        warnings.push(`文本“${node.name}”属性绑定失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
                    }
                });
                textCount++;
            }
            catch (error) {
                warnings.push(`文本“${first.name}”属性创建失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
            return;
        }
        const validInstances = nodes
            .filter(node => node.type === 'INSTANCE')
            .map(node => ({ node: node, main: safeMainComponent(node) }))
            .filter(item => Boolean(item.main));
        if (validInstances.length === 0) {
            warnings.push(`实例“${first.name}”缺少可访问的主组件，已跳过实例属性`);
            return;
        }
        try {
            const preferredValueMap = new Map();
            validInstances.forEach(({ main }) => {
                var _a;
                if (main.ukey) {
                    preferredValueMap.set(`COMPONENT:${main.ukey}`, { type: 'COMPONENT', key: main.ukey });
                }
                if (((_a = main.parent) === null || _a === void 0 ? void 0 : _a.type) === 'COMPONENT_SET') {
                    const parentSet = main.parent;
                    if (parentSet.ukey) {
                        preferredValueMap.set(`COMPONENT_SET:${parentSet.ukey}`, { type: 'COMPONENT_SET', key: parentSet.ukey });
                    }
                }
            });
            const propertyName = uniquePropertyName(first.name, `Instance ${instanceCount + 1}`, used);
            const propertyId = set.addComponentProperty(propertyName, 'INSTANCE_SWAP', validInstances[0].main.id, { preferredValues: [...preferredValueMap.values()] });
            validInstances.forEach(({ node }) => {
                try {
                    node.componentPropertyReferences = Object.assign(Object.assign({}, (node.componentPropertyReferences || {})), { mainComponent: propertyId });
                }
                catch (error) {
                    warnings.push(`实例“${node.name}”属性绑定失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
                }
            });
            instanceCount++;
        }
        catch (error) {
            warnings.push(`实例“${first.name}”属性创建失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
        }
    });
    return { textCount, instanceCount, warnings };
};
const restoreReversedProperties = (owner, component, properties, references) => {
    const propertyIdMap = new Map();
    const warnings = [];
    let restoredCount = 0;
    for (const property of properties) {
        if (property.type === 'VARIANT')
            continue;
        try {
            let defaultValue = property.value;
            if (property.type === 'INSTANCE_SWAP' && !safeNodeById(defaultValue)) {
                const reference = references.find(snapshot => snapshot.references.mainComponent === property.id);
                const target = reference ? resolveSnapshotNode(component, reference) : null;
                const targetMainId = (target === null || target === void 0 ? void 0 : target.type) === 'INSTANCE'
                    ? safeMainComponentId(target)
                    : undefined;
                const fallbackMainId = targetMainId && safeNodeById(targetMainId)
                    ? targetMainId
                    : ((reference === null || reference === void 0 ? void 0 : reference.instanceMainComponentId) && safeNodeById(reference.instanceMainComponentId)
                        ? reference.instanceMainComponentId
                        : undefined);
                if (fallbackMainId) {
                    defaultValue = fallbackMainId;
                    warnings.push(`属性“${property.name}”的原默认组件已失效，已改用当前子实例母版`);
                }
                else {
                    warnings.push(`属性“${property.name}”引用的组件不存在，已跳过该实例属性`);
                    continue;
                }
            }
            const newId = owner.addComponentProperty(property.name, property.type, defaultValue, property.type === 'INSTANCE_SWAP'
                ? { preferredValues: property.preferredValues || [] }
                : undefined);
            restoredCount++;
            if (property.id)
                propertyIdMap.set(property.id, newId);
            if (property.alias) {
                try {
                    owner.editComponentProperty(newId, { alias: property.alias });
                }
                catch (_) { }
            }
            if (property.variableId && (property.type === 'TEXT' || property.type === 'BOOLEAN')) {
                try {
                    mg.variables.setVariableInComponent({
                        id: property.variableId,
                        propertyId: newId,
                        type: property.type === 'TEXT' ? 'CONTENT' : 'BOOLEAN'
                    });
                }
                catch (error) {
                    warnings.push(`属性“${property.name}”的变量绑定恢复失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
                }
            }
            else if (property.skippedVariableId) {
                warnings.push(`属性“${property.name}”存在实例覆盖，已保留当前值并跳过母版变量绑定`);
            }
        }
        catch (error) {
            warnings.push(`属性“${property.name}”恢复失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
        }
    }
    for (const snapshot of references) {
        const target = resolveSnapshotNode(component, snapshot);
        if (!target) {
            warnings.push(`图层“${snapshot.nodeName}”的属性引用路径已变化，为避免误绑已跳过`);
            continue;
        }
        const mapped = {};
        for (const key of ['isVisible', 'characters', 'mainComponent']) {
            const oldId = snapshot.references[key];
            const newId = oldId ? propertyIdMap.get(oldId) : undefined;
            if (newId)
                mapped[key] = newId;
        }
        if (Object.keys(mapped).length > 0) {
            try {
                target.componentPropertyReferences = Object.assign(Object.assign({}, (target.componentPropertyReferences || {})), mapped);
            }
            catch (error) {
                warnings.push(`图层“${target.name}”的属性引用恢复失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
        }
    }
    return { warnings, restoredCount };
};
const createBuilderPropertySnapshots = (definitions, currentProperties) => {
    const snapshots = [];
    const consumed = new Set();
    definitions.forEach(definition => {
        var _a;
        const current = currentProperties.find(property => (definition.id && property.id === definition.id)
            || (property.name === definition.name && property.type === definition.type));
        if (current)
            consumed.add(current);
        const value = (_a = current === null || current === void 0 ? void 0 : current.value) !== null && _a !== void 0 ? _a : definition.defaultValue;
        const canKeepVariableBinding = Boolean(definition.variableId
            && (definition.type === 'TEXT' || definition.type === 'BOOLEAN')
            && definition.defaultValue === value);
        snapshots.push({
            name: definition.name,
            id: (current === null || current === void 0 ? void 0 : current.id) || definition.id,
            type: definition.type,
            value,
            preferredValues: (current === null || current === void 0 ? void 0 : current.preferredValues) || definition.preferredValues,
            alias: (current === null || current === void 0 ? void 0 : current.alias) || definition.alias,
            valueAlias: current === null || current === void 0 ? void 0 : current.valueAlias,
            variantOptions: definition.variantOptions,
            variantOptionsAlias: definition.variantOptionsAlias,
            variableId: canKeepVariableBinding ? definition.variableId : undefined,
            skippedVariableId: definition.variableId && !canKeepVariableBinding
                ? definition.variableId
                : undefined
        });
    });
    currentProperties
        .filter(property => !consumed.has(property))
        .forEach(property => snapshots.push({
        name: property.name,
        id: property.id,
        type: property.type,
        value: property.value,
        preferredValues: property.preferredValues,
        alias: property.alias,
        valueAlias: property.valueAlias
    }));
    return snapshots;
};
const buildReversedComponentFromInstance = async (source, name, placement, warnings) => {
    const nodeStates = captureNodeStates(source);
    let clone = null;
    let detached = null;
    let component = null;
    let detachFailureMessage = '';
    let safeCopyFailureMessage = '';
    let recoveryMode = 'native';
    try {
        try {
            clone = source.clone();
            placeReverseTarget(clone, placement);
            detached = clone.detachInstance();
            clone = null;
        }
        catch (detachError) {
            safeRemoveNode(clone);
            clone = null;
            detachFailureMessage = String((detachError === null || detachError === void 0 ? void 0 : detachError.message) || detachError);
            warnings.push(`变体“${name}”原生解绑失败：${detachFailureMessage}`);
        }
        if (detached) {
            try {
                component = transferFrameToComponent(detached, name, warnings);
                detached = null;
            }
            catch (transferError) {
                safeRemoveNode(detached);
                detached = null;
                detachFailureMessage = String((transferError === null || transferError === void 0 ? void 0 : transferError.message) || transferError);
                warnings.push(`变体“${name}”原生转换失败：${detachFailureMessage}`);
            }
        }
        if (!component) {
            try {
                component = materializeSceneNodeAsComponent(source, name, placement, nodeStates, warnings);
                recoveryMode = 'structure';
            }
            catch (fallbackError) {
                safeCopyFailureMessage = String((fallbackError === null || fallbackError === void 0 ? void 0 : fallbackError.message) || fallbackError);
                warnings.push(`变体“${name}”安全结构复制失败：${safeCopyFailureMessage}`);
                component = await materializeSceneNodeAsRasterComponent(source, name, placement, warnings);
                recoveryMode = 'raster';
            }
        }
        component.name = name;
        placeReverseTarget(component, placement);
        if (recoveryMode !== 'raster') {
            restoreTopLevelOrder(component, nodeStates);
            clearComponentPropertyReferences(component, warnings);
        }
        return { component, nodeStates, recoveryMode };
    }
    catch (error) {
        safeRemoveNode(component);
        safeRemoveNode(detached);
        safeRemoveNode(clone);
        throw new Error(`变体“${name}”还原失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`
            + (detachFailureMessage ? `；原生解绑：${detachFailureMessage}` : '')
            + (safeCopyFailureMessage ? `；结构复制：${safeCopyFailureMessage}` : ''));
    }
};
const buildReversedComponentFromSourceComponent = async (source, name, placement, warnings) => {
    const nodeStates = captureNodeStates(source);
    let component = null;
    let structureFailureMessage = '';
    let recoveryMode = 'structure';
    try {
        try {
            component = materializeSceneNodeAsComponent(source, name, placement, nodeStates, warnings);
        }
        catch (structureError) {
            structureFailureMessage = String((structureError === null || structureError === void 0 ? void 0 : structureError.message) || structureError);
            warnings.push(`变体“${name}”直接结构复制失败：${structureFailureMessage}`);
            component = await materializeSceneNodeAsRasterComponent(source, name, placement, warnings);
            recoveryMode = 'raster';
        }
        component.name = name;
        placeReverseTarget(component, placement);
        if (recoveryMode !== 'raster') {
            restoreTopLevelOrder(component, nodeStates);
            clearComponentPropertyReferences(component, warnings);
        }
        return { component, nodeStates, recoveryMode };
    }
    catch (error) {
        safeRemoveNode(component);
        throw new Error(`变体“${name}”无法从原组件恢复：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`
            + (structureFailureMessage ? `；结构复制：${structureFailureMessage}` : ''));
    }
};
const buildReversedComponentWithMainFallback = async (source, main, name, placement, warnings) => {
    try {
        return await buildReversedComponentFromInstance(source, name, placement, warnings);
    }
    catch (instanceError) {
        if (!main || safeRead(() => main.removed, true))
            throw instanceError;
        warnings.push(`当前实例无法直接还原：${String((instanceError === null || instanceError === void 0 ? void 0 : instanceError.message) || instanceError)}；已改从原组件结构恢复，未映射到组件属性的手工覆盖可能无法保留`);
        return buildReversedComponentFromSourceComponent(main, name, placement, warnings);
    }
};
const componentIdentity = (component) => {
    if (!component)
        return '';
    return safeRead(() => component.ukey, '')
        || safeRead(() => component.id, '')
        || safeRead(() => component.name, '');
};
const sameComponentIdentity = (left, right) => Boolean(left
    && right
    && (componentIdentity(left) === componentIdentity(right)
        || safeRead(() => left.name, '') === safeRead(() => right.name, '')));
const MAX_REVERSED_VARIANTS = 100;
const discoverSourceVariantComponents = async (source, main, sourceSet, properties, warnings) => {
    const direct = getChildren(sourceSet)
        .filter(node => node.type === 'COMPONENT' && !safeRead(() => node.removed, true));
    if (direct.length > 1) {
        if (direct.length > MAX_REVERSED_VARIANTS) {
            return { variants: [main], overflowCount: direct.length };
        }
        return { variants: direct, overflowCount: 0 };
    }
    // 团队库代理可能不开放 set.children，但组件目录会保留 parentId。
    // 只读取 parentId 精确属于当前组件集的条目，不按名称猜测兄弟组件。
    const sourceSetKeys = new Set([
        safeRead(() => sourceSet.id, ''),
        safeRead(() => sourceSet.ukey, '')
    ].filter(Boolean));
    const catalogItems = safeRead(() => mg.getComponentListVal() || [], [])
        .filter(item => Boolean(item.parentId && sourceSetKeys.has(item.parentId)));
    if (catalogItems.length > 1) {
        if (catalogItems.length > MAX_REVERSED_VARIANTS) {
            return { variants: [main], overflowCount: catalogItems.length };
        }
        const catalogVariants = [];
        for (const item of catalogItems) {
            const existing = safeNodeById(item.id);
            try {
                const component = (existing === null || existing === void 0 ? void 0 : existing.type) === 'COMPONENT'
                    ? existing
                    : await mg.importComponentByKeyAsync(item.ukey);
                if (!component)
                    throw new Error('组件导入结果为空');
                catalogVariants.push(component);
            }
            catch (error) {
                throw new Error(`无法读取同组件集变体“${item.name}”：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
        }
        const uniqueCatalog = new Map(catalogVariants.map(component => [componentIdentity(component), component]));
        if (uniqueCatalog.size !== catalogItems.length) {
            throw new Error(`组件目录声明 ${catalogItems.length} 个变体，但只能解析 ${uniqueCatalog.size} 个，已停止以避免不完整还原`);
        }
        return { variants: [...uniqueCatalog.values()], overflowCount: 0 };
    }
    const variantProperties = properties.filter(property => { var _a; return property.type === 'VARIANT' && (((_a = property.variantOptions) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0; });
    const hasMultipleOptions = variantProperties.some(property => { var _a; return (((_a = property.variantOptions) === null || _a === void 0 ? void 0 : _a.length) || 0) > 1; });
    if (!hasMultipleOptions) {
        if (direct.length > 0)
            return { variants: direct, overflowCount: 0 };
        if (properties.some(property => property.type === 'VARIANT')) {
            throw new Error('宿主未开放原组件集 children、组件目录或变体选项，无法证明其他变体完整性，已停止生成伪组件集');
        }
        return { variants: [main], overflowCount: 0 };
    }
    // 远端团队库代理可能不暴露完整 children。此时从已知真实组件出发，
    // 每次只切换一个已声明值并读取实际 mainComponent，按图搜索真实变体；不做笛卡尔积造型。
    const maxProbes = 8192;
    const found = new Map();
    const queue = [];
    const add = (component) => {
        if (!component || safeRead(() => component.removed, true))
            return;
        const key = componentIdentity(component);
        if (!key || found.has(key))
            return;
        found.set(key, component);
        queue.push(component);
    };
    direct.forEach(add);
    add(main);
    let probes = 0;
    let probeFailures = 0;
    while (queue.length > 0) {
        if (found.size > MAX_REVERSED_VARIANTS) {
            return {
                variants: [main],
                overflowCount: found.size,
                overflowCountIsMinimum: true
            };
        }
        if (probes >= maxProbes) {
            throw new Error(`原组件集变体探测达到安全上限 ${maxProbes} 次，已停止以避免不完整还原`);
        }
        const base = queue.shift();
        for (const property of variantProperties) {
            for (const option of property.variantOptions || []) {
                if (probes >= maxProbes) {
                    throw new Error(`原组件集变体探测达到安全上限 ${maxProbes} 次，已停止以避免不完整还原`);
                }
                probes++;
                let probe = null;
                try {
                    probe = base.createInstance();
                    probe.setVariantPropertyValues({ [property.name]: option });
                    add(safeMainComponent(probe));
                }
                catch (_) {
                    probeFailures++;
                }
                finally {
                    safeRemoveNode(probe);
                }
            }
        }
    }
    if (probeFailures > 0)
        warnings.push(`${probeFailures} 次远端变体探测不可用，已按实际可访问组件去重`);
    if (found.size > MAX_REVERSED_VARIANTS) {
        return {
            variants: [main],
            overflowCount: found.size,
            overflowCountIsMinimum: true
        };
    }
    if (found.size <= 1) {
        throw new Error('原组件集声明了多个变体值，但宿主未开放其他真实变体，已停止以避免生成只有属性没有组件的伪组件集');
    }
    return { variants: [...found.values()], overflowCount: 0 };
};
const bindingMatchesNode = (binding) => {
    if (binding.key === 'characters')
        return binding.target.type === 'TEXT';
    if (binding.key === 'mainComponent')
        return binding.target.type === 'INSTANCE';
    return true;
};
const restoreReversedSetProperties = (set, variants, properties, fallbackReferences) => {
    const warnings = [];
    let restoredCount = 0;
    const usedNames = new Set(safeRead(() => set.componentPropertyValues || [], [])
        .map(property => property.name.toLocaleLowerCase()));
    properties.filter(property => property.type !== 'VARIANT').forEach(property => {
        if (!property.id) {
            warnings.push(`属性“${property.name}”没有可验证的属性 ID，已跳过`);
            return;
        }
        if (usedNames.has(property.name.toLocaleLowerCase())) {
            warnings.push(`属性“${property.name}”与现有变体属性重名，已跳过以避免冲突`);
            return;
        }
        const bindings = [];
        const seen = new Set();
        variants.forEach(variant => {
            const references = variant.references.length > 0 ? variant.references : fallbackReferences;
            references.forEach(snapshot => {
                const target = resolveSnapshotNode(variant.component, snapshot);
                if (!target)
                    return;
                ['isVisible', 'characters', 'mainComponent'].forEach(key => {
                    if (snapshot.references[key] !== property.id)
                        return;
                    const binding = { target, key, snapshot };
                    if (!bindingMatchesNode(binding))
                        return;
                    const bindingKey = `${target.id}:${key}`;
                    if (seen.has(bindingKey))
                        return;
                    seen.add(bindingKey);
                    bindings.push(binding);
                });
            });
        });
        if (bindings.length === 0) {
            warnings.push(`属性“${property.name}”在所有还原变体中都没有对应图层，已跳过以避免多余属性`);
            return;
        }
        let defaultValue = property.value;
        if (property.type === 'INSTANCE_SWAP' && !safeNodeById(defaultValue)) {
            const instanceBinding = bindings.find(binding => binding.key === 'mainComponent');
            const fallbackId = (instanceBinding === null || instanceBinding === void 0 ? void 0 : instanceBinding.target.type) === 'INSTANCE'
                ? safeMainComponentId(instanceBinding.target)
                : undefined;
            if (!fallbackId || !safeNodeById(fallbackId)) {
                warnings.push(`属性“${property.name}”没有有效的实例母版，已跳过`);
                return;
            }
            defaultValue = fallbackId;
        }
        let newId = '';
        try {
            newId = set.addComponentProperty(property.name, property.type, defaultValue, property.type === 'INSTANCE_SWAP'
                ? { preferredValues: property.preferredValues || [] }
                : undefined);
        }
        catch (error) {
            warnings.push(`属性“${property.name}”创建失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            return;
        }
        const grouped = new Map();
        bindings.forEach(binding => {
            const refs = grouped.get(binding.target) || {};
            refs[binding.key] = newId;
            grouped.set(binding.target, refs);
        });
        let boundLayerCount = 0;
        grouped.forEach((refs, target) => {
            try {
                target.componentPropertyReferences = Object.assign(Object.assign({}, (safeRead(() => target.componentPropertyReferences, {}) || {})), refs);
                boundLayerCount++;
            }
            catch (error) {
                warnings.push(`属性“${property.name}”绑定图层“${safeRead(() => target.name, '未命名')}”失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
        });
        if (boundLayerCount === 0) {
            try {
                set.deleteComponentProperty(newId);
            }
            catch (_) { }
            warnings.push(`属性“${property.name}”没有成功绑定任何图层，已删除以避免空属性`);
            return;
        }
        usedNames.add(property.name.toLocaleLowerCase());
        restoredCount++;
        if (property.alias) {
            try {
                set.editComponentProperty(newId, { alias: property.alias });
            }
            catch (_) { }
        }
        if (property.variableId && (property.type === 'TEXT' || property.type === 'BOOLEAN')) {
            try {
                mg.variables.setVariableInComponent({
                    id: property.variableId,
                    propertyId: newId,
                    type: property.type === 'TEXT' ? 'CONTENT' : 'BOOLEAN'
                });
            }
            catch (error) {
                warnings.push(`属性“${property.name}”的变量绑定恢复失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
        }
        else if (property.skippedVariableId) {
            warnings.push(`属性“${property.name}”存在实例覆盖，已保留当前值并跳过母版变量绑定`);
        }
    });
    return { warnings, restoredCount };
};
const restoreVariantAliases = (set, properties, warnings) => {
    const actualVariantProperties = safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT'), []);
    const propertyAliases = {};
    properties.filter(property => property.type === 'VARIANT').forEach(property => {
        const actual = actualVariantProperties.find(candidate => candidate.name === property.name);
        if (!actual)
            return;
        if (property.alias)
            propertyAliases[property.name] = property.alias;
        const actualOptions = new Set(actual.variantOptions || []);
        const aliases = property.variantOptionsAlias || [];
        (property.variantOptions || []).forEach((option, index) => {
            const alias = aliases[index]
                || (String(property.value) === option ? property.valueAlias : undefined);
            if (!alias || !actualOptions.has(option))
                return;
            try {
                set.editVariantPropertyValuesAlias({
                    [property.name]: { name: option, alias }
                });
            }
            catch (_) {
                warnings.push(`变体“${property.name}=${option}”的别名未能恢复`);
            }
        });
    });
    if (Object.keys(propertyAliases).length > 0) {
        try {
            set.editVariantPropertiesAlias(propertyAliases);
        }
        catch (_) {
            warnings.push('部分变体属性别名未能恢复');
        }
    }
};
const restoreLimitedVariantSchema = (set, component, properties, warnings) => {
    const expected = properties.filter(property => property.type === 'VARIANT');
    if (expected.length === 0) {
        return safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT').length, 0);
    }
    const values = Object.fromEntries(expected.map(property => [property.name, String(property.value)]));
    try {
        // MasterGo 会为不存在的属性维度自动创建变体属性；只有当前真实组件承载当前值，
        // 其他属性组合允许保持为空，不为它们批量制造占位组件。
        component.setVariantPropertyValues(values);
    }
    catch (error) {
        const actualNames = new Set(safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT'), []).map(property => property.name));
        const missing = expected.map(property => property.name).filter(name => !actualNames.has(name));
        try {
            if (missing.length > 0)
                set.createVariantProperties(missing);
            component.setVariantPropertyValues(values);
        }
        catch (retryError) {
            throw new Error(`组件集变体属性恢复失败：${String((retryError === null || retryError === void 0 ? void 0 : retryError.message) || retryError || error)}`);
        }
    }
    const expectedNames = new Set(expected.map(property => property.name));
    let actual = safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT'), []);
    actual
        .filter(property => !expectedNames.has(property.name))
        .forEach(property => {
        if (actual.length <= expected.length)
            return;
        try {
            set.deleteVariantProperty(property.name);
            actual = actual.filter(candidate => candidate.name !== property.name);
        }
        catch (_) {
            warnings.push(`自动生成的多余变体属性“${property.name}”未能移除`);
        }
    });
    const finalProperties = safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT'), []);
    const finalNames = new Set(finalProperties.map(property => property.name));
    const missingNames = expected.map(property => property.name).filter(name => !finalNames.has(name));
    const currentValues = new Map(safeRead(() => component.variantProperties || [], [])
        .map(property => [property.property, property.value]));
    const mismatchedValues = expected.filter(property => currentValues.get(property.name) !== String(property.value));
    if (missingNames.length > 0 || mismatchedValues.length > 0) {
        throw new Error(`组件集变体属性完整性校验失败`
            + (missingNames.length > 0 ? `：缺少 ${missingNames.join('、')}` : '')
            + (mismatchedValues.length > 0 ? `：取值不一致 ${mismatchedValues.map(property => property.name).join('、')}` : ''));
    }
    return finalProperties.length;
};
const captureBehaviorNodeSnapshots = (root) => {
    const snapshots = [];
    const visit = (node, path) => {
        snapshots.push({
            path,
            nodeName: safeRead(() => node.name, '未命名'),
            nodeType: node.type,
            isVisible: safeRead(() => node.isVisible, true),
            characters: node.type === 'TEXT'
                ? safeRead(() => node.characters, '')
                : undefined,
            instanceMainComponentId: node.type === 'INSTANCE'
                ? safeMainComponentId(node)
                : undefined
        });
        if (node.type === 'INSTANCE')
            return;
        getChildren(node).forEach((child, index) => visit(child, [...path, index]));
    };
    getChildren(root).forEach((child, index) => visit(child, [index]));
    return snapshots;
};
const behaviorSnapshotKey = (snapshot) => snapshot.path.join('/');
const mergeReferenceSnapshots = (base, additions) => {
    const merged = new Map();
    [...base, ...additions].forEach(snapshot => {
        const key = `${snapshot.path.join('/')}:${snapshot.nodeType}:${snapshot.nodeName}`;
        const existing = merged.get(key);
        if (existing) {
            existing.references = Object.assign(Object.assign({}, existing.references), snapshot.references);
            existing.instanceMainComponentId = existing.instanceMainComponentId
                || snapshot.instanceMainComponentId;
        }
        else {
            merged.set(key, Object.assign(Object.assign({}, snapshot), { path: [...snapshot.path], references: Object.assign({}, snapshot.references) }));
        }
    });
    return [...merged.values()];
};
const discoverComponentReferencesByBehavior = (sourceComponent, properties, knownReferences, warnings) => {
    const discovered = [];
    let failedProbes = 0;
    const hasKnownReference = (propertyId) => knownReferences.some(snapshot => Object.values(snapshot.references).includes(propertyId));
    properties
        .filter(property => property.type !== 'VARIANT' && property.id && !hasKnownReference(property.id))
        .forEach(property => {
        let probe = null;
        try {
            probe = sourceComponent.createInstance();
            const before = captureBehaviorNodeSnapshots(probe);
            const currentProperty = safeRead(() => probe.componentProperties.find(candidate => candidate.id === property.id), undefined);
            const changedPaths = new Set();
            let referenceKey;
            if (property.type === 'TEXT') {
                referenceKey = 'characters';
                const marker = `__AIO_PROP_${String(property.id).replace(/[^a-zA-Z0-9]/g, '_')}__`;
                probe.setProperties({ [property.id]: marker });
                const after = captureBehaviorNodeSnapshots(probe);
                after.forEach(snapshot => {
                    if (snapshot.nodeType === 'TEXT' && snapshot.characters === marker) {
                        changedPaths.add(behaviorSnapshotKey(snapshot));
                    }
                });
            }
            else if (property.type === 'BOOLEAN') {
                referenceKey = 'isVisible';
                const currentValue = typeof (currentProperty === null || currentProperty === void 0 ? void 0 : currentProperty.value) === 'boolean'
                    ? currentProperty.value
                    : Boolean(property.value);
                probe.setProperties({ [property.id]: !currentValue });
                const afterMap = new Map(captureBehaviorNodeSnapshots(probe).map(snapshot => [behaviorSnapshotKey(snapshot), snapshot]));
                before.forEach(snapshot => {
                    const after = afterMap.get(behaviorSnapshotKey(snapshot));
                    if (after && after.isVisible !== snapshot.isVisible) {
                        changedPaths.add(behaviorSnapshotKey(snapshot));
                    }
                });
            }
            else {
                referenceKey = 'mainComponent';
                const currentMainId = typeof (currentProperty === null || currentProperty === void 0 ? void 0 : currentProperty.value) === 'string'
                    ? currentProperty.value
                    : String(property.value || '');
                const candidates = before.filter(snapshot => snapshot.nodeType === 'INSTANCE'
                    && snapshot.instanceMainComponentId === currentMainId);
                if (candidates.length === 1)
                    changedPaths.add(behaviorSnapshotKey(candidates[0]));
            }
            before.forEach(snapshot => {
                if (!changedPaths.has(behaviorSnapshotKey(snapshot)))
                    return;
                discovered.push({
                    path: [...snapshot.path],
                    nodeName: snapshot.nodeName,
                    nodeType: snapshot.nodeType,
                    references: { [referenceKey]: property.id },
                    instanceMainComponentId: snapshot.instanceMainComponentId
                });
            });
        }
        catch (_) {
            failedProbes++;
        }
        finally {
            safeRemoveNode(probe);
        }
    });
    if (failedProbes > 0) {
        warnings.push(`变体“${safeRead(() => sourceComponent.name, '未命名')}”有 ${failedProbes} 个属性无法通过行为探测定位图层`);
    }
    return mergeReferenceSnapshots(knownReferences, discovered);
};
const validateRestoredVariantSet = (set, records, warnings) => {
    const actualComponents = getChildren(set).filter(node => node.type === 'COMPONENT');
    if (actualComponents.length !== records.length) {
        throw new Error(`组件集合并不完整：已生成 ${records.length} 个真实变体，合并后保留 ${actualComponents.length} 个`);
    }
    // combineAsVariants 会按组件集规则规范化子组件名称；名称不是稳定身份，不能据此误判丢失。
    // 校验真正参与合并的节点 ID，确保结果仍由刚刚生成的全部组件组成。
    const actualIds = new Set(actualComponents.map(component => component.id));
    const missingRecords = records.filter(record => !actualIds.has(record.component.id));
    if (missingRecords.length > 0) {
        throw new Error(`组件集合并结果异常：${missingRecords.length} 个已生成变体没有进入结果组件集`);
    }
    const normalizedNameCount = records.filter(record => safeRead(() => record.sourceComponent.name, '').trim()
        !== safeRead(() => record.component.name, '').trim()).length;
    if (normalizedNameCount > 0) {
        warnings.push(`MasterGo 合并时规范化了 ${normalizedNameCount} 个变体名称，已按组件节点身份确认全部变体完整`);
    }
};
const reverseFullComponentSet = async (source, main, sourceSet, sourceVariants, properties, fallbackReferences, masterName, placement, warnings) => {
    const records = [];
    const temporaryInstances = [];
    let set = null;
    let cursorX = placement.x;
    const variantNames = new Set();
    try {
        for (const sourceVariant of sourceVariants) {
            const variantName = safeRead(() => sourceVariant.name, '').trim();
            if (!variantName)
                throw new Error('原组件集存在无名称变体，无法安全还原属性对应关系');
            if (variantNames.has(variantName))
                throw new Error(`原组件集存在重名变体“${variantName}”，已停止以避免错误合并`);
            variantNames.add(variantName);
            const isSelectedVariant = sameComponentIdentity(sourceVariant, main);
            const variantPlacement = { x: cursorX, y: placement.y };
            let built;
            if (isSelectedVariant) {
                built = await buildReversedComponentWithMainFallback(source, sourceVariant, variantName, variantPlacement, warnings);
            }
            else {
                let variantInstance = null;
                try {
                    variantInstance = sourceVariant.createInstance();
                    temporaryInstances.push(variantInstance);
                    built = await buildReversedComponentFromInstance(variantInstance, variantName, variantPlacement, warnings);
                }
                catch (instanceError) {
                    safeRemoveNode(variantInstance);
                    warnings.push(`变体“${variantName}”无法创建临时实例：${String((instanceError === null || instanceError === void 0 ? void 0 : instanceError.message) || instanceError)}；已改从原组件结构恢复`);
                    built = await buildReversedComponentFromSourceComponent(sourceVariant, variantName, variantPlacement, warnings);
                }
                finally {
                    safeRemoveNode(variantInstance);
                }
            }
            built.component.name = variantName;
            copyPublishableMetadata(sourceVariant, built.component);
            const knownReferences = captureComponentReferences(sourceVariant)
                .filter(snapshot => Boolean(resolveSnapshotNode(built.component, snapshot)));
            const references = discoverComponentReferencesByBehavior(sourceVariant, properties, knownReferences, warnings);
            records.push(Object.assign(Object.assign({}, built), { sourceComponent: sourceVariant, references }));
            cursorX += Math.max(1, safeRead(() => built.component.width, 1)) + 48;
        }
        temporaryInstances.forEach(safeRemoveNode);
        if (records.length !== sourceVariants.length || records.length < 2) {
            throw new Error(`完整性校验失败：发现 ${sourceVariants.length} 个真实变体，但只还原 ${records.length} 个`);
        }
        // 合并前先将临时组件收进二维网格；此前单行递增会让结果组件集宽到 4500px 以上。
        const stagingComponents = records.map(record => record.component);
        const stagingColumns = Math.max(1, Math.ceil(Math.sqrt(stagingComponents.length)));
        const stagingMaxWidth = Math.max(...stagingComponents.map(component => Math.max(1, safeRead(() => component.width, 1))));
        const stagingMaxHeight = Math.max(...stagingComponents.map(component => Math.max(1, safeRead(() => component.height, 1))));
        stagingComponents.forEach((component, index) => {
            placeReverseTarget(component, {
                x: placement.x + (index % stagingColumns) * (stagingMaxWidth + 24),
                y: placement.y + Math.floor(index / stagingColumns) * (stagingMaxHeight + 24)
            });
        });
        set = mg.combineAsVariants(stagingComponents);
        set.name = masterName;
        validateRestoredVariantSet(set, records, warnings);
        copyPublishableMetadata(sourceSet, set);
        set.flexMode = 'NONE';
        const compactComponents = getChildren(set).filter(node => node.type === 'COMPONENT');
        const columns = Math.max(1, Math.ceil(Math.sqrt(compactComponents.length)));
        const maxWidth = Math.max(...compactComponents.map(component => Math.max(1, safeRead(() => component.width, 1))));
        const maxHeight = Math.max(...compactComponents.map(component => Math.max(1, safeRead(() => component.height, 1))));
        compactComponents.forEach((component, index) => {
            component.x = 24 + (index % columns) * (maxWidth + 24) + (maxWidth - component.width) / 2;
            component.y = 24 + Math.floor(index / columns) * (maxHeight + 24) + (maxHeight - component.height) / 2;
        });
        const rows = Math.ceil(compactComponents.length / columns);
        set.resize(48 + columns * maxWidth + Math.max(0, columns - 1) * 24, 48 + rows * maxHeight + Math.max(0, rows - 1) * 24);
        placeReverseTarget(set, getReversePlacement(source, safeRead(() => set.width, safeRead(() => source.width, 0.01)), safeRead(() => set.height, safeRead(() => source.height, 0.01)), [set]));
        const restored = restoreReversedSetProperties(set, records, properties, fallbackReferences);
        warnings.push(...restored.warnings);
        restoreVariantAliases(set, properties, warnings);
        const actualVariantProperties = safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT').length, 0);
        const recoveryMode = records.some(record => record.recoveryMode === 'raster')
            ? 'raster'
            : records.some(record => record.recoveryMode === 'structure') ? 'structure' : 'native';
        return {
            target: set,
            component: records[0].component,
            propertyCount: actualVariantProperties + restored.restoredCount,
            variantCount: records.length,
            overflowVariantCount: 0,
            overflowVariantCountIsMinimum: false,
            warnings,
            recoveryMode
        };
    }
    catch (error) {
        temporaryInstances.forEach(safeRemoveNode);
        if (set) {
            safeRemoveNode(set);
        }
        else {
            const partialSets = new Set();
            records.forEach(record => {
                const parent = safeRead(() => record.component.parent, null);
                if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'COMPONENT_SET')
                    partialSets.add(parent);
            });
            partialSets.forEach(safeRemoveNode);
            records.forEach(record => safeRemoveNode(record.component));
        }
        throw error;
    }
};
const reverseInstanceToMaster = async (source) => {
    if (safeRead(() => source.removed, true)) {
        throw new Error('所选实例已失效，请重新选择后再试');
    }
    const main = safeMainComponent(source);
    const mainParent = main ? safeRead(() => main.parent, null) : null;
    const sourceSet = (mainParent === null || mainParent === void 0 ? void 0 : mainParent.type) === 'COMPONENT_SET'
        ? mainParent
        : null;
    const definitions = safeRead(() => (sourceSet === null || sourceSet === void 0 ? void 0 : sourceSet.componentPropertyValues) || (main === null || main === void 0 ? void 0 : main.componentPropertyValues) || [], []);
    const sourceProperties = safeRead(() => source.componentProperties || [], []);
    const properties = createBuilderPropertySnapshots(definitions, sourceProperties);
    const referenceRoot = main && !safeRead(() => main.removed, true) ? main : source;
    const referenceSnapshots = captureComponentReferences(referenceRoot);
    const masterName = safeRead(() => (sourceSet === null || sourceSet === void 0 ? void 0 : sourceSet.name) || (main === null || main === void 0 ? void 0 : main.name) || source.name || 'Reversed Component', 'Reversed Component');
    const placement = getReversePlacement(source);
    const warnings = [];
    let limitVariantExpansion = false;
    let overflowVariantCount = 0;
    let overflowVariantCountIsMinimum = false;
    if (sourceSet && main) {
        const discovery = await discoverSourceVariantComponents(source, main, sourceSet, properties, warnings);
        if (discovery.overflowCount > 0) {
            limitVariantExpansion = true;
            overflowVariantCount = discovery.overflowCount;
            overflowVariantCountIsMinimum = Boolean(discovery.overflowCountIsMinimum);
            const countText = overflowVariantCountIsMinimum
                ? `至少 ${overflowVariantCount}`
                : String(overflowVariantCount);
            warnings.push(`原组件集包含 ${countText} 个变体，超过完整还原上限 ${MAX_REVERSED_VARIANTS}；已保留组件集结构和原属性，仅生成当前实例对应的一个真实变体`);
        }
        else if (discovery.variants.length > 1) {
            return reverseFullComponentSet(source, main, sourceSet, discovery.variants, properties, referenceSnapshots, masterName, placement, warnings);
        }
    }
    const variantProperties = properties.filter(property => property.type === 'VARIANT');
    let component = null;
    let target = null;
    try {
        const componentName = variantProperties.length > 0
            ? safeRead(() => (main === null || main === void 0 ? void 0 : main.name) || '', '')
                || variantProperties.map(property => `${property.name}=${String(property.value)}`).join(', ')
            : masterName;
        const built = await buildReversedComponentWithMainFallback(source, main, componentName, placement, warnings);
        component = built.component;
        copyPublishableMetadata(main, component);
        if (built.recoveryMode === 'raster' && !limitVariantExpansion) {
            return {
                target: component,
                component,
                propertyCount: 0,
                variantCount: 1,
                overflowVariantCount,
                overflowVariantCountIsMinimum,
                warnings,
                recoveryMode: built.recoveryMode
            };
        }
        if (variantProperties.length > 0 || limitVariantExpansion) {
            let set = null;
            let setCreationError = null;
            try {
                set = mg.combineAsVariants([component]);
            }
            catch (setError) {
                setCreationError = setError;
                if (limitVariantExpansion) {
                    const values = Object.fromEntries(variantProperties.map(property => [property.name, String(property.value)]));
                    try {
                        component.setVariantPropertyValues(Object.keys(values).length > 0 ? values : { Variant: component.name || 'Default' });
                        const generatedParent = safeRead(() => component.parent, null);
                        if ((generatedParent === null || generatedParent === void 0 ? void 0 : generatedParent.type) !== 'COMPONENT_SET')
                            throw setError;
                        set = generatedParent;
                    }
                    catch (_) {
                        throw new Error(`组件集创建失败：${String((setError === null || setError === void 0 ? void 0 : setError.message) || setError)}`);
                    }
                }
            }
            if (!set) {
                warnings.push(`组件集创建失败，已保留为单个组件母版：${String((setCreationError === null || setCreationError === void 0 ? void 0 : setCreationError.message) || setCreationError)}`);
                component.name = masterName;
                placeReverseTarget(component, placement);
                const restored = restoreReversedProperties(component, component, properties, referenceSnapshots);
                warnings.push(...restored.warnings);
                return {
                    target: component,
                    component,
                    propertyCount: restored.restoredCount,
                    variantCount: 1,
                    overflowVariantCount,
                    overflowVariantCountIsMinimum,
                    warnings,
                    recoveryMode: built.recoveryMode
                };
            }
            set.name = masterName;
            copyPublishableMetadata(sourceSet, set);
            placeReverseTarget(set, getReversePlacement(source, set.width, set.height, [set]));
            target = set;
            const restored = restoreReversedProperties(set, component, properties, referenceSnapshots);
            warnings.push(...restored.warnings);
            const restoredVariantCount = limitVariantExpansion
                ? restoreLimitedVariantSchema(set, component, properties, warnings)
                : safeRead(() => set.componentPropertyValues.filter(property => property.type === 'VARIANT').length, variantProperties.length);
            restoreVariantAliases(set, properties, warnings);
            return {
                target,
                component,
                propertyCount: restoredVariantCount + restored.restoredCount,
                variantCount: 1,
                overflowVariantCount,
                overflowVariantCountIsMinimum,
                warnings,
                recoveryMode: built.recoveryMode
            };
        }
        const restored = restoreReversedProperties(component, component, properties, referenceSnapshots);
        warnings.push(...restored.warnings);
        placeReverseTarget(component, placement);
        target = component;
        return {
            target,
            component,
            propertyCount: restored.restoredCount,
            variantCount: 1,
            overflowVariantCount,
            overflowVariantCountIsMinimum,
            warnings,
            recoveryMode: built.recoveryMode
        };
    }
    catch (error) {
        safeRemoveNode(target || component);
        throw error;
    }
};
const commonNamePrefix = (names) => {
    if (names.length === 0)
        return 'Component';
    const tokenLists = names.map(name => name.split(/[\/_-]/).map(token => token.trim()).filter(Boolean));
    const first = tokenLists[0];
    const common = [];
    for (let index = 0; index < first.length; index++) {
        if (tokenLists.every(tokens => { var _a; return ((_a = tokens[index]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === first[index].toLocaleLowerCase(); })) {
            common.push(first[index]);
        }
        else
            break;
    }
    return common.join('/') || names[0] || 'Component';
};
const safeVariantValue = (value, index) => String(value || `Variant ${index + 1}`).replace(/[,=]/g, ' ').replace(/\s+/g, ' ').trim();
const languageVariantValue = (value, index) => {
    const source = String(value || '').trim();
    const normalized = source.toLowerCase().replace(/_/g, '-');
    const aliases = [
        [/(^|[\/\s.-])(zh-cn|zh-hans|简体中文|简体|中文)(?=$|[\/\s.-])/i, 'zh-CN'],
        [/(^|[\/\s.-])(zh-tw|zh-hant|繁体中文|繁體中文|繁体)(?=$|[\/\s.-])/i, 'zh-TW'],
        [/(^|[\/\s.-])(en-us|en|english|英文|英语)(?=$|[\/\s.-])/i, 'en-US'],
        [/(^|[\/\s.-])(ja-jp|ja|japanese|日本語|日语)(?=$|[\/\s.-])/i, 'ja-JP'],
        [/(^|[\/\s.-])(ko-kr|ko|korean|한국어|韩语)(?=$|[\/\s.-])/i, 'ko-KR'],
        [/(^|[\/\s.-])(fr-fr|fr|french|français)(?=$|[\/\s.-])/i, 'fr-FR'],
        [/(^|[\/\s.-])(de-de|de|german|deutsch)(?=$|[\/\s.-])/i, 'de-DE'],
        [/(^|[\/\s.-])(es-es|es|spanish|español)(?=$|[\/\s.-])/i, 'es-ES'],
        [/(^|[\/\s.-])(pt-br|pt|português)(?=$|[\/\s.-])/i, 'pt-BR'],
        [/(^|[\/\s.-])(it-it|it|italiano)(?=$|[\/\s.-])/i, 'it-IT'],
        [/(^|[\/\s.-])(ru-ru|ru|русский)(?=$|[\/\s.-])/i, 'ru-RU'],
        [/(^|[\/\s.-])(ar-sa|ar|العربية)(?=$|[\/\s.-])/i, 'ar-SA']
    ];
    const matched = aliases.find(([pattern]) => pattern.test(normalized));
    if (matched)
        return matched[1];
    const fallback = source.split(/[\/@|]/).map(part => part.trim()).filter(Boolean).pop();
    return safeVariantValue(fallback || `Language ${index + 1}`, index);
};
const wrapFramesAsOneComponent = (frames, name) => {
    var _a;
    const parent = (_a = frames[0]) === null || _a === void 0 ? void 0 : _a.parent;
    if (!parent || frames.some(frame => frame.parent !== parent)) {
        throw new Error('创建单个组件时，所选 Frame 必须位于同一父级');
    }
    const ordered = [...frames].sort((a, b) => Array.from(parent.children).indexOf(a) - Array.from(parent.children).indexOf(b));
    const minX = Math.min(...frames.map(frame => frame.x));
    const minY = Math.min(...frames.map(frame => frame.y));
    const maxX = Math.max(...frames.map(frame => frame.x + frame.width));
    const maxY = Math.max(...frames.map(frame => frame.y + frame.height));
    const firstIndex = Array.from(parent.children).indexOf(ordered[0]);
    const positions = ordered.map(frame => ({
        frame,
        x: frame.x - minX,
        y: frame.y - minY,
        originalX: frame.x,
        originalY: frame.y,
        originalIndex: Array.from(parent.children).indexOf(frame)
    }));
    const component = mg.createComponent();
    try {
        parent.insertChild(Math.max(0, firstIndex), component);
        component.name = name || commonNamePrefix(frames.map(frame => frame.name));
        component.x = minX;
        component.y = minY;
        component.resize(Math.max(0.01, maxX - minX), Math.max(0.01, maxY - minY));
        component.fills = [];
        component.strokes = [];
        positions.forEach(({ frame, x, y }) => {
            component.appendChild(frame);
            frame.x = x;
            frame.y = y;
        });
        return component;
    }
    catch (error) {
        positions
            .sort((a, b) => a.originalIndex - b.originalIndex)
            .forEach(({ frame, originalX, originalY, originalIndex }) => {
            if (!frame.removed && frame.parent !== parent) {
                parent.insertChild(Math.max(0, originalIndex), frame);
            }
            trySet(frame, 'x', originalX);
            trySet(frame, 'y', originalY);
        });
        if (!component.removed)
            component.remove();
        throw error;
    }
};
const buildComponentAiContext = (language = 'zh') => {
    const selection = mg.document.currentPage.selection;
    const selectedComponents = selection.filter(node => node.type === 'COMPONENT');
    const selectedSets = selection.filter(node => node.type === 'COMPONENT_SET');
    const valid = (selection.length === 1 && selectedSets.length === 1)
        || (selection.length >= 1 && selection.length <= 800 && selectedComponents.length === selection.length);
    if (!valid)
        throw new Error(language === 'en'
            ? 'Select one component set or 1–800 standalone components.'
            : '请选择 1 个组件集，或 1–800 个独立组件。');
    const owners = selectedSets.length ? selectedSets : selectedComponents;
    const issues = [];
    const selectedNameCounts = new Map();
    owners.forEach(owner => {
        const key = owner.name.trim().toLocaleLowerCase();
        selectedNameCounts.set(key, (selectedNameCounts.get(key) || 0) + 1);
    });
    if (owners.reduce((count, owner) => count + (owner.type === 'COMPONENT_SET' ? owner.children.filter(n => n.type === 'COMPONENT').length : 1), 0) > 800)
        throw new Error('单次最多分析 800 个组件或变体');
    const targets = owners.map(owner => {
        const variants = owner.type === 'COMPONENT_SET'
            ? getChildren(owner).filter(node => node.type === 'COMPONENT')
            : [];
        const values = {};
        const signatures = new Map();
        const propertyPresence = new Map();
        variants.forEach(variant => {
            const props = parseVariantName(variant.name);
            const keys = Object.keys(props);
            keys.forEach(key => {
                if (!values[key])
                    values[key] = new Set();
                values[key].add(props[key]);
                propertyPresence.set(key, (propertyPresence.get(key) || 0) + 1);
            });
            const signature = keys.sort().map(key => `${key.toLocaleLowerCase()}=${props[key].toLocaleLowerCase()}`).join('|');
            const names = signatures.get(signature) || [];
            names.push(variant.name);
            signatures.set(signature, names);
        });
        signatures.forEach(names => {
            if (names.length < 2)
                return;
            issues.push({
                code: 'duplicate-variant', severity: 'warning', targetId: owner.id,
                message: language === 'en'
                    ? `${owner.name}: ${names.length} variants use the same property combination.`
                    : `${owner.name}：发现 ${names.length} 个属性组合重复的变体。`
            });
        });
        propertyPresence.forEach((count, property) => {
            if (variants.length > 0 && count < variants.length) {
                issues.push({
                    code: 'missing-property', severity: 'warning', targetId: owner.id,
                    message: language === 'en'
                        ? `${owner.name}: “${property}” is missing from ${variants.length - count} variants.`
                        : `${owner.name}：属性“${property}”在 ${variants.length - count} 个变体中缺失。`
                });
            }
        });
        if (/^(component|组件|variant|变体)(\s*\d+)?$/i.test(owner.name.trim())) {
            issues.push({
                code: 'generic-name', severity: 'info', targetId: owner.id,
                message: language === 'en' ? `${owner.name}: the name is too generic.` : `${owner.name}：名称过于宽泛。`
            });
        }
        if ((selectedNameCounts.get(owner.name.trim().toLocaleLowerCase()) || 0) > 1) {
            issues.push({
                code: 'duplicate-name', severity: 'warning', targetId: owner.id,
                message: language === 'en' ? `${owner.name}: duplicate selected component name.` : `${owner.name}：所选组件中存在重名。`
            });
        }
        const definitions = safeRead(() => owner.componentPropertyValues || [], []);
        const propertyDefinitions = definitions.map(definition => {
            var _a;
            return ({
                key: definition.id || definition.name,
                name: definition.name,
                type: definition.type,
                defaultValue: String((_a = definition.defaultValue) !== null && _a !== void 0 ? _a : '')
            });
        });
        const propertyValues = Object.fromEntries(Object.entries(values).map(([key, set]) => [key, Array.from(set)]));
        return {
            id: owner.id,
            type: owner.type,
            name: owner.name,
            description: safeRead(() => owner.description || '', ''),
            propertyDefinitions,
            propertyValues,
            variantCount: variants.length,
            variantNames: variants.map(variant => variant.name),
            variantsTruncated: 0
        };
    });
    return { platform: 'mastergo', language, selectionIds: owners.map(owner => owner.id), targets, issues };
};
const applyComponentAiPlan = (plan) => {
    const selection = mg.document.currentPage.selection;
    const allowedIds = new Set(selection.map(node => node.id));
    const selectedComponents = selection.filter(node => node.type === 'COMPONENT');
    const selectedSets = selection.filter(node => node.type === 'COMPONENT_SET');
    const valid = (selection.length === 1 && selectedSets.length === 1)
        || (selection.length >= 1 && selection.length <= 800 && selectedComponents.length === selection.length);
    if (!valid)
        throw new Error('当前选择已变化，请重新分析后再应用');
    let changed = 0;
    const warnings = [];
    const targetPlans = Array.isArray(plan === null || plan === void 0 ? void 0 : plan.targets) ? plan.targets.slice(0, 800) : [];
    const desiredNameCounts = new Map();
    targetPlans.forEach((targetPlan) => {
        const key = String((targetPlan === null || targetPlan === void 0 ? void 0 : targetPlan.name) || '').trim().toLocaleLowerCase();
        if (key)
            desiredNameCounts.set(key, (desiredNameCounts.get(key) || 0) + 1);
    });
    targetPlans.forEach((targetPlan) => {
        const id = String((targetPlan === null || targetPlan === void 0 ? void 0 : targetPlan.id) || '');
        if (!allowedIds.has(id))
            return;
        const owner = mg.getNodeById(id);
        if (!owner || (owner.type !== 'COMPONENT' && owner.type !== 'COMPONENT_SET'))
            return;
        const nextName = String(targetPlan.name || '').trim().slice(0, 120);
        const description = String(targetPlan.description || '').trim().slice(0, 1000);
        if (nextName && nextName !== owner.name) {
            if ((desiredNameCounts.get(nextName.toLocaleLowerCase()) || 0) > 1)
                warnings.push(`方案中的组件名“${nextName}”重复，已跳过`);
            else {
                owner.name = nextName;
                changed++;
            }
        }
        if (description) {
            try {
                owner.description = description;
                changed++;
            }
            catch (_) {
                warnings.push(`${owner.name} 的描述无法写入`);
            }
        }
        if (owner.type === 'COMPONENT_SET') {
            const valueRenames = Array.isArray(targetPlan.valueRenames) ? targetPlan.valueRenames.slice(0, 800) : [];
            for (const rename of valueRenames) {
                const property = String((rename === null || rename === void 0 ? void 0 : rename.property) || '').trim();
                const from = String((rename === null || rename === void 0 ? void 0 : rename.from) || '').trim();
                const to = String((rename === null || rename === void 0 ? void 0 : rename.to) || '').trim().replace(/[,=]/g, ' ').slice(0, 80);
                if (!property || !from || !to || from === to)
                    continue;
                const existingValues = new Set(getChildren(owner).filter(node => node.type === 'COMPONENT')
                    .map(node => parseVariantName(node.name)[property])
                    .filter(Boolean));
                if (existingValues.has(to)) {
                    warnings.push(`${owner.name} 的属性“${property}”已存在值“${to}”，为避免重复变体已跳过`);
                    continue;
                }
                try {
                    owner.editVariantPropertyValues({ [property]: { oldValue: from, newValue: to } });
                    changed++;
                }
                catch (_) {
                    warnings.push(`${owner.name} 的属性值“${property}=${from}”无法重命名`);
                }
            }
        }
        const propertyRenames = Array.isArray(targetPlan.propertyRenames) ? targetPlan.propertyRenames.slice(0, 800) : [];
        for (const rename of propertyRenames) {
            const from = String((rename === null || rename === void 0 ? void 0 : rename.from) || '').trim();
            const to = String((rename === null || rename === void 0 ? void 0 : rename.to) || '').trim().replace(/[,=]/g, ' ').slice(0, 80);
            if (!from || !to || from === to)
                continue;
            const definition = safeRead(() => owner.componentPropertyValues.find(property => property.name === from), undefined);
            if (!definition) {
                warnings.push(`${owner.name} 中未找到属性“${from}”`);
                continue;
            }
            const hasNameCollision = safeRead(() => owner.componentPropertyValues.some(property => property.name !== from && property.name.toLocaleLowerCase() === to.toLocaleLowerCase()), false);
            if (hasNameCollision) {
                warnings.push(`${owner.name} 中已存在属性“${to}”，已跳过`);
                continue;
            }
            try {
                if (owner.type === 'COMPONENT_SET' && definition.type === 'VARIANT') {
                    owner.editVariantProperties({ [from]: to });
                }
                else {
                    owner.editComponentProperty(definition.id || definition.name, { name: to });
                }
                changed++;
            }
            catch (_) {
                warnings.push(`${owner.name} 的属性“${from}”无法重命名`);
            }
        }
    });
    return { changed, warnings };
};
const sendComponentBuilderSelection = () => {
    const selection = mg.document.currentPage.selection;
    const frames = selection.filter(node => node.type === 'FRAME');
    const instances = selection.filter(node => node.type === 'INSTANCE');
    const components = selection.filter(node => node.type === 'COMPONENT');
    const componentSets = selection.filter(node => node.type === 'COMPONENT_SET');
    const canOptimize = (selection.length === 1 && componentSets.length === 1)
        || (selection.length >= 1 && selection.length <= 800 && components.length === selection.length);
    sendToUI({
        type: 'component-builder-selection',
        total: selection.length,
        frames: frames.length,
        instances: instances.length,
        components: components.length,
        componentSets: componentSets.length,
        canOptimize,
        canReverse: selection.length === 1 && instances.length === 1,
        canAnalyzeBuild: selection.length > 0 && frames.length + components.length + componentSets.length === selection.length,
        canBuild: selection.length > 0 && frames.length === selection.length,
        sameParent: selection.length > 0 && selection.every(node => node.parent === selection[0].parent),
        selectionIds: selection.map(node => node.id),
        names: selection.slice(0, 4).map(node => node.name)
    });
};
mg.on('selectionchange', () => { try {
    sendComponentBuilderSelection();
    sendIconfontSelection();
}
catch (error) {
    console.warn('Selection refresh deferred:', String(error));
} });
let componentReverseRunning = false;
// 监听选择变化，主动推送 CompKit 属性更新
let lastCompKitTargetId = null;
mg.on('selectionchange', () => {
    try {
        const selection = mg.document.currentPage.selection;
        let targetId = null;
        let properties = [];
        let componentName = '';
        let propertyValues = {};
        let variantsCount = 0;
        if (selection.length === 1) {
            if (selection[0].type === 'COMPONENT_SET') {
                targetId = selection[0].id;
                const componentSet = selection[0];
                componentName = componentSet.name;
                variantsCount = componentSet.children.length;
                if (componentSet.children.length > 0) {
                    const sampleName = componentSet.children[0].name;
                    properties = sampleName.split(',').map(p => p.split('=')[0].trim());
                    // 收集每个属性的所有值
                    const variants = componentSet.children;
                    properties.forEach(prop => {
                        const values = new Set();
                        variants.forEach(v => {
                            const props = v.name.split(',').reduce((acc, pair) => {
                                const [key, val] = pair.split('=').map(s => s.trim());
                                acc[key] = val;
                                return acc;
                            }, {});
                            if (props[prop])
                                values.add(props[prop]);
                        });
                        propertyValues[prop] = Array.from(values);
                    });
                }
            }
            else if (selection[0].type === 'FRAME' && selection[0].getPluginData('isShowcaseBoard') === 'true') {
                const compSet = selection[0].findOne(n => n.type === 'COMPONENT_SET');
                if (compSet) {
                    targetId = compSet.id;
                    componentName = compSet.name;
                    variantsCount = compSet.children.length;
                    if (compSet.children.length > 0) {
                        const sampleName = compSet.children[0].name;
                        properties = sampleName.split(',').map(p => p.split('=')[0].trim());
                        // 收集每个属性的所有值
                        const variants = compSet.children;
                        properties.forEach(prop => {
                            const values = new Set();
                            variants.forEach(v => {
                                const props = v.name.split(',').reduce((acc, pair) => {
                                    const [key, val] = pair.split('=').map(s => s.trim());
                                    acc[key] = val;
                                    return acc;
                                }, {});
                                if (props[prop])
                                    values.add(props[prop]);
                            });
                            propertyValues[prop] = Array.from(values);
                        });
                    }
                }
            }
        }
        // 只有当目标变化时才推送
        if (targetId !== lastCompKitTargetId) {
            lastCompKitTargetId = targetId;
            sendToUI({
                type: 'compkit-props',
                properties,
                targetId,
                componentName,
                propertyValues,
                variantsCount
            });
        }
    }
    catch (error) {
        console.warn('Component property refresh deferred:', String(error));
    }
});
mg.ui.onmessage = async (rawMessage) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const msg = (rawMessage === null || rawMessage === void 0 ? void 0 : rawMessage.pluginMessage) || rawMessage;
    if (!msg || !msg.type)
        return;
    if (msg.uiLanguage === 'en' || msg.uiLanguage === 'zh')
        pluginUiLanguage = msg.uiLanguage;
    if (msg.type === 'ui-language-changed') {
        pluginUiLanguage = msg.language === 'en' ? 'en' : 'zh';
        return;
    }
    if (handlePluginWindowMessage(msg))
        return;
    if (msg.type === 'get-iconfont-selection' || msg.type === 'iconfont-repair-run') {
        await handleIconfontMessage(msg);
        return;
    }
    if (await handleLayerToolsMessage(msg))
        return;
    if (msg.type === 'mg-image-size-result') {
        const resolve = imageSizeWaiters.get(msg.reqId);
        if (resolve) {
            imageSizeWaiters.delete(msg.reqId);
            resolve(msg.error ? null : { width: msg.width, height: msg.height });
        }
        return;
    }
    console.log("【2】后端：收到了消息 ->", msg.type);
    const selection = mg.document.currentPage.selection;
    // 核心路由
    switch (msg.type) {
        // ===========================
        // H. 智能填充 (Smart Fill)
        // ===========================
        // 1. 获取选中图层数量 (用于前端生成对应数量的数据)
        case 'get-selection-count': {
            const nodes = collectSmartFillTextNodes(mg.document.currentPage.selection);
            sendToUI({ type: 'selection-count-res', count: nodes.length, nodeIds: nodes.map(node => node.id) });
            break;
        }
        case 'smart-fill-exec': {
            const { dataList, mode, distribution } = msg;
            const report = (count, errors = [], message = '') => {
                const summary = message || `已填充 ${count} 个文本${errors.length ? `，${errors.length} 项失败：${errors[0]}` : ''}`;
                notifyInUiLanguage(summary);
                sendToUI({ type: 'smart-fill-result', count, errors, message: summary });
            };
            if (!Array.isArray(dataList) || dataList.length === 0) {
                report(0, [], '填充列表为空');
                break;
            }
            // Use the same selection snapshot for counting and writing.
            const errors = [];
            const snapshot = Array.isArray(msg.nodeIds) ? Array.from(new Set(msg.nodeIds)) : null;
            const snapshotOrder = new Map((snapshot === null || snapshot === void 0 ? void 0 : snapshot.map((id, index) => [id, index])) || []);
            const roots = snapshot
                ? (await Promise.all(snapshot.map(async (id) => {
                    try {
                        const node = await mg.getNodeById(id);
                        if (!node || node.removed) {
                            errors.push(`图层 ${id} 已删除或不可用`);
                            return null;
                        }
                        return node;
                    }
                    catch (_) {
                        errors.push(`无法读取图层 ${id}，已跳过`);
                        return null;
                    }
                }))).filter(Boolean)
                : mg.document.currentPage.selection;
            const textNodes = collectSmartFillTextNodes(roots);
            if (snapshot)
                textNodes.sort((a, b) => snapshotOrder.get(a.id) - snapshotOrder.get(b.id));
            if (!textNodes.length) {
                report(0, errors, errors.length ? `未能填充：${errors[0]}` : '请先选择可见的文本图层或包含文本的画板');
                break;
            }
            if (textNodes.length > 10000) {
                report(0, [], '单次最多填充 10,000 个文本，请分批处理');
                break;
            }
            let changeCount = 0;
            const fontLoads = new Map();
            for (let i = 0; i < textNodes.length; i++) {
                const node = textNodes[i];
                try {
                    await loadSmartFillFonts(node, fontLoads);
                    const value = String((_b = dataList[distribution === 'random'
                        ? Math.floor(Math.random() * dataList.length) : ((_a = snapshotOrder.get(node.id)) !== null && _a !== void 0 ? _a : i) % dataList.length]) !== null && _b !== void 0 ? _b : '');
                    // Inserting at the edges retains mixed text styles in prefix/suffix mode.
                    if (mode === 'both') {
                        if (value) {
                            node.insertCharacters(node.characters.length, value);
                            node.insertCharacters(0, value);
                        }
                    }
                    else if (mode === 'prefix') {
                        if (value)
                            node.insertCharacters(0, value);
                    }
                    else if (mode === 'suffix') {
                        if (value)
                            node.insertCharacters(node.characters.length, value);
                    }
                    else {
                        node.characters = value;
                    }
                    changeCount++;
                }
                catch (error) {
                    const detail = `${node.name}: ${String((error === null || error === void 0 ? void 0 : error.message) || error)}`;
                    errors.push(detail);
                    console.error('Smart fill failed:', detail);
                }
            }
            report(changeCount, errors);
            break;
        }
        // 3. 存储/读取配置 (ClientStorage)
        case 'save-storage': {
            await mg.clientStorage.setAsync(msg.key, msg.value);
            if (msg.notify)
                notifyInUiLanguage("配置已保存");
            sendToUI({ type: 'storage-saved', key: msg.key, value: msg.value });
            break;
        }
        case 'load-storage': {
            const value = await mg.clientStorage.getAsync(msg.key);
            sendToUI({ type: 'storage-loaded', key: msg.key, value: value });
            break;
        }
        case 'req-ai-config': {
            const aiConfig = await mg.clientStorage.getAsync('smart_ai_config');
            sendToUI({ type: 'init-ai-config', data: aiConfig || {} });
            break;
        }
        // ===========================
        // A. 简易工具 (Simple Tools)
        // ===========================
        case 'to-frame': {
            if (selection.length === 0) {
                notifyInUiLanguage("请选择形状");
                return;
            }
            const newSelection = [];
            const selCopy = [...selection];
            for (const node of selCopy) {
                if (node.removed)
                    continue;
                const parent = node.parent;
                if (!parent)
                    continue;
                const idx = parent.children.indexOf(node);
                const frame = mg.createFrame();
                frame.resize(node.width, node.height);
                frame.name = node.name;
                frame.x = node.x;
                frame.y = node.y;
                parent.insertChild(idx, frame);
                copyNodeStyles(node, frame);
                if ('children' in node) {
                    for (const child of [...node.children]) {
                        if (!child.removed)
                            frame.appendChild(child);
                    }
                }
                try {
                    node.remove();
                }
                catch (e) { }
                newSelection.push(frame);
            }
            if (newSelection.length > 0)
                mg.document.currentPage.selection = newSelection;
            notifyInUiLanguage("已转换为 Frame");
            break;
        }
        case 'to-rect': {
            if (selection.length === 0) {
                notifyInUiLanguage("请选择图层");
                return;
            }
            const newSelection = [];
            const selCopy = [...selection];
            for (const node of selCopy) {
                if (node.removed)
                    continue;
                if (node.type !== 'FRAME' && node.type !== 'GROUP' && node.type !== 'SECTION')
                    continue;
                const parent = node.parent;
                if (!parent)
                    continue;
                if ('children' in node) {
                    for (const child of [...node.children]) {
                        if (!child.removed) {
                            parent.insertChild(parent.children.indexOf(node), child);
                        }
                    }
                }
                const idx = parent.children.indexOf(node);
                const rect = mg.createRectangle();
                rect.resize(node.width, node.height);
                rect.name = node.name;
                rect.x = node.x;
                rect.y = node.y;
                parent.insertChild(idx, rect);
                copyNodeStyles(node, rect);
                try {
                    node.remove();
                }
                catch (e) { }
                newSelection.push(rect);
            }
            if (newSelection.length > 0)
                mg.document.currentPage.selection = newSelection;
            break;
        }
        case 'swap-fs': {
            let count = 0;
            for (const node of selection) {
                if ('fills' in node && 'strokes' in node) {
                    const temp = node.fills;
                    node.fills = node.strokes;
                    node.strokes = temp;
                    if (node.strokes.length > 0 && node.strokeWeight === 0)
                        node.strokeWeight = 1;
                    count++;
                }
            }
            if (count > 0)
                notifyInUiLanguage("已交换填充/描边");
            break;
        }
        case 'reset-image': {
            for (const node of selection) {
                if ('fills' in node && Array.isArray(node.fills)) {
                    const img = node.fills.find(f => f.type === 'IMAGE');
                    if (img && img.imageRef) {
                        const asyncImg = mg.getImageByHref(img.imageRef);
                        const size = await requestImageSize(await asyncImg.getBytesAsync());
                        if (size && size.width)
                            node.resize(node.width, node.width * (size.height / size.width));
                    }
                }
            }
            break;
        }
        case 'remove-al': {
            let count = 0;
            function rm(n) {
                if (n.flexMode && n.flexMode !== 'NONE') {
                    n.flexMode = 'NONE';
                    count++;
                }
                if (n.children)
                    n.children.forEach(rm);
            }
            selection.forEach(rm);
            notifyInUiLanguage(`移除 ${count} 个自动布局`);
            break;
        }
        case 'add-al-wrapper': {
            const newSelection = [];
            if (selection.length === 0) {
                notifyInUiLanguage("请选择图层");
                return;
            }
            for (const node of selection) {
                if (node.removed || !node.parent)
                    continue;
                const frame = mg.createFrame();
                frame.name = "Auto Layout Wrapper";
                frame.flexMode = "VERTICAL";
                frame.itemSpacing = 10;
                frame.paddingLeft = 0;
                frame.paddingRight = 0;
                frame.paddingTop = 0;
                frame.paddingBottom = 0;
                frame.mainAxisSizingMode = "AUTO";
                frame.crossAxisSizingMode = "AUTO";
                frame.fills = [solidPaint({ r: 1, g: 0, b: 0 })];
                frame.strokes = [];
                frame.x = node.x;
                frame.y = node.y;
                const parent = node.parent;
                const index = parent.children.indexOf(node);
                parent.insertChild(index, frame);
                frame.appendChild(node);
                newSelection.push(frame);
            }
            if (newSelection.length > 0) {
                mg.document.currentPage.selection = newSelection;
                notifyInUiLanguage("已添加自动布局外套");
            }
            break;
        }
        case 'split-text': {
            const newSel = [];
            for (const node of selection) {
                if (node.type !== "TEXT")
                    continue;
                const lines = node.characters.split(/\r\n|\r|\n/);
                if (lines.length <= 1)
                    continue;
                try {
                    await loadTextFonts(node);
                }
                catch (e) {
                    notifyInUiLanguage("字体加载失败");
                    continue;
                }
                let cy = node.y;
                for (const l of lines) {
                    if (!l.trim())
                        continue;
                    const t = node.clone();
                    t.characters = l;
                    t.textAutoResize = "WIDTH_AND_HEIGHT";
                    t.y = cy;
                    node.parent.appendChild(t);
                    newSel.push(t);
                    cy += t.height + 10;
                }
                node.remove();
            }
            if (newSel.length > 0)
                mg.document.currentPage.selection = newSel;
            break;
        }
        case 'join-text': {
            const tNodes = selection.filter(n => n.type === 'TEXT').sort((a, b) => Math.abs(a.y - b.y) > 5 ? a.y - b.y : a.x - b.x);
            if (tNodes.length < 2) {
                notifyInUiLanguage("请选2个以上文本");
                return;
            }
            try {
                await loadTextFonts(tNodes[0]);
            }
            catch (e) {
                notifyInUiLanguage("字体加载失败");
                return;
            }
            const txt = tNodes.map(n => n.characters).join('\n');
            const nt = tNodes[0].clone();
            nt.characters = txt;
            nt.textAutoResize = 'HEIGHT';
            tNodes.forEach(n => n.remove());
            mg.document.currentPage.selection = [nt];
            break;
        }
        // up-one
        case 'up-one': {
            const newSel = [];
            for (const node of selection) {
                const parent = node.parent;
                if (parent && parent.type !== 'PAGE' && parent.parent) {
                    const grandParent = parent.parent;
                    const absX = node.absoluteTransform[0][2];
                    const absY = node.absoluteTransform[1][2];
                    const gpAbsX = grandParent.type === 'PAGE' ? 0 : grandParent.absoluteTransform[0][2];
                    const gpAbsY = grandParent.type === 'PAGE' ? 0 : grandParent.absoluteTransform[1][2];
                    const relX = absX - gpAbsX;
                    const relY = absY - gpAbsY;
                    grandParent.appendChild(node);
                    if ('flexMode' in grandParent && grandParent.flexMode !== 'NONE') {
                        try {
                            node.layoutPositioning = 'ABSOLUTE';
                        }
                        catch (e) { }
                    }
                    node.x = relX;
                    node.y = relY;
                    newSel.push(node);
                }
            }
            if (newSel.length)
                mg.document.currentPage.selection = newSel;
            break;
        }
        // up-all 同理
        case 'up-all': {
            const page = mg.document.currentPage;
            const newSel = [];
            for (const node of selection) {
                const absX = node.absoluteTransform[0][2];
                const absY = node.absoluteTransform[1][2];
                page.appendChild(node);
                node.x = absX;
                node.y = absY;
                newSel.push(node);
            }
            mg.document.currentPage.selection = newSel;
            break;
        }
        case 'rename-content': {
            selection.forEach(n => {
                let name = "";
                if (n.type === 'TEXT')
                    name = n.characters;
                else if ('findOne' in n) {
                    const t = n.findOne((x) => x.type === 'TEXT');
                    if (t)
                        name = t.characters;
                }
                if (name)
                    n.name = name.substring(0, 20);
            });
            notifyInUiLanguage("已重命名");
            break;
        }
        case 'detach-all': {
            const sel = mg.document.currentPage.selection;
            if (sel.length === 0) {
                notifyInUiLanguage("请先选中图层");
                return;
            }
            const targets = [];
            const scan = (n) => {
                if ('children' in n) {
                    for (const child of n.children)
                        scan(child);
                }
                if (n.type === 'INSTANCE')
                    targets.push(n);
            };
            sel.forEach(scan);
            if (targets.length === 0) {
                notifyInUiLanguage("未找到可解绑的实例");
                return;
            }
            for (const node of targets) {
                if (!node.removed) {
                    try {
                        node.detachInstance();
                    }
                    catch (e) { }
                }
            }
            notifyInUiLanguage(`已解绑 ${targets.length} 个组件`);
            break;
        }
        case 'remove-hidden': {
            let h = [];
            const pool = selection.length > 0 ? selection : [mg.document.currentPage];
            for (const n of pool) {
                if (n.type !== 'PAGE' && n.isVisible === false)
                    h.push(n);
                if ('findAll' in n)
                    h = h.concat(n.findAll((x) => !x.isVisible));
            }
            let count = 0;
            h.reverse().forEach(n => { if (!n.removed) {
                n.remove();
                count++;
            } });
            notifyInUiLanguage(`已删除 ${count} 个隐藏图层`);
            break;
        }
        case 'sort-layers': {
            if (selection.length > 1) {
                const p = selection[0].parent;
                if (selection.every(n => n.parent === p)) {
                    const isReverse = (layerSortDirection === 'desc');
                    [...selection].sort((a, b) => {
                        const diffY = a.y - b.y;
                        const diffX = a.x - b.x;
                        const result = Math.abs(diffY) > 2 ? diffY : diffX;
                        return isReverse ? -result : result;
                    }).forEach(n => p.appendChild(n));
                    notifyInUiLanguage(isReverse ? "已反转排列（从下到上）" : "已排列（从上到下）");
                    layerSortDirection = isReverse ? 'asc' : 'desc';
                }
            }
            else {
                notifyInUiLanguage("请至少选择两个同级图层");
            }
            break;
        }
        case 'sort-by-name': {
            // 按图层名称字典序排序：首字母→第二个字母→以此类推
            // 支持两种模式：选中多个同级图层排序；或选中单个容器对其直接子图层排序
            let p = null;
            let targets = [];
            if (selection.length > 1 && selection.every(n => n.parent === selection[0].parent)) {
                p = selection[0].parent;
                targets = [...selection];
            }
            else if (selection.length === 1 && 'children' in selection[0]) {
                p = selection[0];
                targets = [...selection[0].children];
            }
            if (!p || targets.length < 2) {
                notifyInUiLanguage("请选择至少两个同级图层，或选择一个包含多个子图层的容器");
                return;
            }
            const isReverse = (layerNameSortDirection === 'desc');
            targets.sort((a, b) => {
                const cmp = a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
                return isReverse ? -cmp : cmp;
            }).forEach(n => p.appendChild(n));
            notifyInUiLanguage(isReverse ? "已按名称倒序排列（Z→A）" : "已按名称排序（A→Z）");
            layerNameSortDirection = isReverse ? 'asc' : 'desc';
            break;
        }
        case 'ungroup-all': {
            let count = 0;
            // 收集所有 Group: 包含选中的 Group 以及其内部的 Group
            const groups = [];
            function collect(n) {
                if (n.type === 'GROUP')
                    groups.push(n);
                if ('children' in n)
                    for (const child of n.children)
                        collect(child);
            }
            for (const node of selection)
                collect(node);
            // 解组（从内向外解组可能更安全，但 ungroup 后子节点会保留）
            for (const g of groups) {
                if (!g.removed) {
                    ungroupNode(g);
                    count++;
                }
            }
            notifyInUiLanguage(`已解散 ${count} 个组`);
            break;
        }
        case 'unlock-all': {
            let count = 0;
            function ul(n) {
                if ('isLocked' in n && n.isLocked) {
                    n.isLocked = false;
                    count++;
                }
                if ('children' in n)
                    n.children.forEach(ul);
            }
            selection.forEach(ul);
            notifyInUiLanguage(`已解锁 ${count} 个图层`);
            break;
        }
        case 'pixel-perfect': {
            if (selection.length === 0) {
                notifyInUiLanguage("请选择图层");
                return;
            }
            let count = 0;
            for (const node of selection) {
                if (!node.removed) {
                    const newX = Math.round(node.x);
                    const newY = Math.round(node.y);
                    const newW = Math.round(node.width);
                    const newH = Math.round(node.height);
                    if (node.x !== newX || node.y !== newY) {
                        node.x = newX;
                        node.y = newY;
                    }
                    if ((node.width !== newW || node.height !== newH) && 'resize' in node)
                        node.resize(newW, newH);
                    count++;
                }
            }
            notifyInUiLanguage(`已对齐 ${count} 个图层`);
            break;
        }
        case 'swap-positions': {
            if (selection.length !== 2) {
                notifyInUiLanguage("请严格选择 2 个图层进行交换");
                return;
            }
            const n1 = selection[0];
            const n2 = selection[1];
            const x1 = n1.x, y1 = n1.y;
            n1.x = n2.x;
            n1.y = n2.y;
            n2.x = x1;
            n2.y = y1;
            notifyInUiLanguage("位置已互换");
            break;
        }
        case 'create-styles': {
            console.log("=== 开始执行创建样式 ===");
            if (selection.length === 0) {
                notifyInUiLanguage("请选择图层");
                return;
            }
            let createdCount = 0;
            const conflicts = [];
            const errors = [];
            try {
                const localPaints = await mg.getLocalPaintStyles();
                const localTexts = await mg.getLocalTextStyles();
                const localEffects = await mg.getLocalEffectStyles();
                for (const node of selection) {
                    if (node.removed)
                        continue;
                    const name = node.name;
                    if ('fills' in node && node.type !== 'GROUP' && Array.isArray(node.fills) && node.fills.length > 0) {
                        if (node.fills[0].type !== 'IMAGE') {
                            const exist = localPaints.find(s => s.name === name);
                            if (exist) {
                                if (!conflicts.includes(name))
                                    conflicts.push(name + " (颜色)");
                            }
                            else {
                                try {
                                    const style = mg.createFillStyle({ id: node.id, name });
                                    createdCount++;
                                    try {
                                        node.fillStyleId = style.id;
                                    }
                                    catch (e) { }
                                }
                                catch (err) {
                                    errors.push(name);
                                }
                            }
                        }
                    }
                    if (node.type === 'TEXT') {
                        const exist = localTexts.find(s => s.name === name);
                        if (exist) {
                            if (!conflicts.includes(name))
                                conflicts.push(name + " (文本)");
                        }
                        else {
                            try {
                                await loadTextFonts(node);
                                const style = mg.createTextStyle({ id: node.id, name });
                                createdCount++;
                                try {
                                    setTextStyleId(node, style.id);
                                }
                                catch (e) { }
                            }
                            catch (err) {
                                errors.push(name);
                            }
                        }
                    }
                    if ('effects' in node && Array.isArray(node.effects) && node.effects.length > 0) {
                        const exist = localEffects.find(s => s.name === name);
                        if (exist) {
                            if (!conflicts.includes(name))
                                conflicts.push(name + " (效果)");
                        }
                        else {
                            try {
                                const style = mg.createEffectStyle({ id: node.id, name });
                                createdCount++;
                                try {
                                    node.effectStyleId = style.id;
                                }
                                catch (e) { }
                            }
                            catch (err) {
                                errors.push(name);
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.error("全局错误:", e);
                notifyInUiLanguage("样式创建失败: " + String(e).slice(0, 50));
                return;
            }
            const parts = [];
            if (createdCount > 0)
                parts.push(`新建 ${createdCount} 个`);
            if (conflicts.length > 0)
                parts.push(`跳过重复 ${conflicts.length} 个`);
            if (errors.length > 0)
                parts.push(`失败 ${errors.length} 个`);
            if (parts.length > 0)
                notifyInUiLanguage(parts.join('，'));
            else
                notifyInUiLanguage("未发现可创建的样式（选中的图层可能没有填充/文本/效果属性）");
            break;
        }
        case 'match-styles': {
            console.log("=== 开始匹配样式 ===");
            const sel = mg.document.currentPage.selection;
            if (sel.length === 0) {
                notifyInUiLanguage("请先选择范围");
                return;
            }
            let countFill = 0, countStroke = 0, countText = 0, countEffect = 0;
            try {
                const paints = await mg.getLocalPaintStyles();
                const texts = await mg.getLocalTextStyles();
                const effects = await mg.getLocalEffectStyles();
                const paintMap = new Map();
                paints.forEach(s => paintMap.set(JSON.stringify(s.paints), s.id));
                const effectMap = new Map();
                effects.forEach(s => effectMap.set(JSON.stringify(s.effects), s.id));
                const textMap = new Map();
                texts.forEach(s => {
                    const fingerprint = JSON.stringify({
                        family: s.fontName.family,
                        style: s.fontName.style,
                        size: s.fontSize,
                        lh: s.lineHeight,
                        ls: s.letterSpacing,
                        td: s.decoration
                    });
                    textMap.set(fingerprint, s.id);
                });
                const traverse = async (node) => {
                    if (node.removed)
                        return;
                    if ('fills' in node && node.fills !== mg.mixed && node.fills.length > 0 && node.fillStyleId === '') {
                        const key = JSON.stringify(node.fills);
                        if (paintMap.has(key)) {
                            try {
                                node.fillStyleId = paintMap.get(key);
                                countFill++;
                            }
                            catch (e) { }
                        }
                    }
                    if ('strokes' in node && node.strokes !== mg.mixed && node.strokes.length > 0 && node.strokeFillStyleId === '') {
                        const key = JSON.stringify(node.strokes);
                        if (paintMap.has(key)) {
                            try {
                                node.strokeFillStyleId = paintMap.get(key);
                                countStroke++;
                            }
                            catch (e) { }
                        }
                    }
                    if ('effects' in node && node.effects !== mg.mixed && node.effects.length > 0 && node.effectStyleId === '') {
                        const key = JSON.stringify(node.effects);
                        if (effectMap.has(key)) {
                            try {
                                node.effectStyleId = effectMap.get(key);
                                countEffect++;
                            }
                            catch (e) { }
                        }
                    }
                    if (node.type === 'TEXT' && getTextStyleId(node) === '') {
                        const font = getTextFontName(node);
                        const key = JSON.stringify({
                            family: (font === null || font === void 0 ? void 0 : font.family) || '',
                            style: (font === null || font === void 0 ? void 0 : font.style) || '',
                            size: getTextFontSize(node),
                            lh: getTextLineHeight(node),
                            ls: getTextLetterSpacing(node),
                            td: getTextDecoration(node)
                        });
                        if (textMap.has(key)) {
                            try {
                                setTextStyleId(node, textMap.get(key));
                                countText++;
                            }
                            catch (e) { }
                        }
                    }
                    if ('children' in node) {
                        for (const child of node.children)
                            await traverse(child);
                    }
                };
                for (const node of sel)
                    await traverse(node);
            }
            catch (e) {
                console.error(e);
                notifyInUiLanguage("匹配出错");
                return;
            }
            const total = countFill + countStroke + countText + countEffect;
            if (total > 0)
                notifyInUiLanguage(`匹配成功: 填充${countFill} / 描边${countStroke} / 文本${countText} / 效果${countEffect}`);
            else
                notifyInUiLanguage("未发现可匹配的样式");
            break;
        }
        // ===========================
        // B. 高级查找 (Find & Select) - 【已修复】
        // ===========================
        case 'fetch-selection-name': {
            const sel = mg.document.currentPage.selection;
            if (sel.length > 0) {
                sendToUI({ type: 'update-name-input', name: sel[0].name });
            }
            else {
                notifyInUiLanguage("请先选择一个图层以获取名称");
            }
            break;
        }
        case 'find-and-select': {
            const f = msg.filters;
            // Keep the user's seed selection while switching filters after selecting results.
            const sel = layerSearchRoots();
            if (f.scope !== 'page' && !sel.length) {
                notifyInUiLanguage('请先选择查找范围的起点图层');
            }
            const finalPool = LayerRules.pool(mg.document.currentPage, sel, f.scope);
            const colorToHex = (color) => {
                if (!color)
                    return undefined;
                const part = (value) => Math.round(Math.max(0, Math.min(1, value || 0)) * 255).toString(16).padStart(2, '0');
                return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
            };
            const firstVisiblePaint = (paints) => Array.isArray(paints)
                ? paints.find((paint) => { var _a; return paint && ((_a = paint.isVisible) !== null && _a !== void 0 ? _a : paint.visible) !== false; })
                : undefined;
            const getAdvancedPropertyValue = async (node, key) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if (key === 'mainComponentId')
                    return node.type === 'INSTANCE' ? safeMainComponentId(node) : undefined;
                const fill = firstVisiblePaint(node.fills);
                const stroke = firstVisiblePaint(node.strokes);
                const effect = Array.isArray(node.effects) ? node.effects.find((item) => { var _a; return item && ((_a = item.isVisible) !== null && _a !== void 0 ? _a : item.visible) !== false; }) : undefined;
                const bounds = node.absoluteBoundingBox || node.absoluteRenderBounds;
                const parentChildren = node.parent && 'children' in node.parent ? node.parent.children : undefined;
                const siblingIndex = parentChildren ? parentChildren.indexOf(node) : -1;
                const textFont = node.type === 'TEXT' && node.characters.length > 0 && node.fontName === mg.mixed
                    ? node.getRangeFontName(0, 1)
                    : node.fontName;
                const spacing = node.letterSpacing;
                const lineHeight = node.lineHeight;
                const direct = {
                    name: node.name,
                    visible: (_a = node.isVisible) !== null && _a !== void 0 ? _a : node.visible,
                    locked: (_b = node.isLocked) !== null && _b !== void 0 ? _b : node.locked,
                    opacity: node.opacity,
                    rotation: node.rotation,
                    blendMode: node.blendMode,
                    siblingIndex: siblingIndex >= 0 ? siblingIndex + 1 : undefined,
                    reverseSiblingIndex: siblingIndex >= 0 && parentChildren ? parentChildren.length - siblingIndex : undefined,
                    childCount: 'children' in node ? node.children.length : undefined,
                    expanded: node.expanded,
                    width: node.width,
                    height: node.height,
                    x: node.x,
                    y: node.y,
                    absoluteWidth: bounds === null || bounds === void 0 ? void 0 : bounds.width,
                    absoluteHeight: bounds === null || bounds === void 0 ? void 0 : bounds.height,
                    absoluteX: bounds === null || bounds === void 0 ? void 0 : bounds.x,
                    absoluteY: bounds === null || bounds === void 0 ? void 0 : bounds.y,
                    fillCount: Array.isArray(node.fills) ? node.fills.length : undefined,
                    fillColor: (fill === null || fill === void 0 ? void 0 : fill.type) === 'SOLID' ? colorToHex(fill.color) : undefined,
                    fillOpacity: (_c = fill === null || fill === void 0 ? void 0 : fill.opacity) !== null && _c !== void 0 ? _c : (fill ? 1 : undefined),
                    fillBlendMode: fill === null || fill === void 0 ? void 0 : fill.blendMode,
                    fillType: fill === null || fill === void 0 ? void 0 : fill.type,
                    fillVisible: fill ? ((_e = (_d = fill.isVisible) !== null && _d !== void 0 ? _d : fill.visible) !== null && _e !== void 0 ? _e : true) : undefined,
                    fillStyleId: node.fillStyleId,
                    cornerRadius: node.cornerRadius,
                    topLeftRadius: node.topLeftRadius,
                    topRightRadius: node.topRightRadius,
                    bottomLeftRadius: node.bottomLeftRadius,
                    bottomRightRadius: node.bottomRightRadius,
                    ['corner' + 'Smoothing']: undefined,
                    strokeCount: Array.isArray(node.strokes) ? node.strokes.length : undefined,
                    strokeColor: (stroke === null || stroke === void 0 ? void 0 : stroke.type) === 'SOLID' ? colorToHex(stroke.color) : undefined,
                    strokeWeight: node.strokeWeight,
                    strokeOpacity: (_f = stroke === null || stroke === void 0 ? void 0 : stroke.opacity) !== null && _f !== void 0 ? _f : (stroke ? 1 : undefined),
                    strokeBlendMode: stroke === null || stroke === void 0 ? void 0 : stroke.blendMode,
                    strokeType: stroke === null || stroke === void 0 ? void 0 : stroke.type,
                    strokeVisible: stroke ? ((_h = (_g = stroke.isVisible) !== null && _g !== void 0 ? _g : stroke.visible) !== null && _h !== void 0 ? _h : true) : undefined,
                    strokeAlign: node.strokeAlign,
                    strokeCap: node.strokeCap,
                    strokeJoin: node.strokeJoin,
                    strokeMiterLimit: node.strokeMiterLimit,
                    strokeStyleId: node.strokeStyleId,
                    effectCount: Array.isArray(node.effects) ? node.effects.length : undefined,
                    effectType: effect === null || effect === void 0 ? void 0 : effect.type,
                    effectVisible: effect ? ((_k = (_j = effect.isVisible) !== null && _j !== void 0 ? _j : effect.visible) !== null && _k !== void 0 ? _k : true) : undefined,
                    effectStyleId: node.effectStyleId,
                    layoutPositioning: node.layoutPositioning,
                    ['layout' + 'Mode']: node.flexMode,
                    ['primaryAxis' + 'AlignItems']: node.mainAxisAlignItems,
                    ['counterAxis' + 'AlignItems']: node.crossAxisAlignItems,
                    itemSpacing: node.itemSpacing,
                    paddingTop: node.paddingTop,
                    paddingBottom: node.paddingBottom,
                    paddingLeft: node.paddingLeft,
                    paddingRight: node.paddingRight,
                    gridCount: Array.isArray(node.layoutGrids) ? node.layoutGrids.length : undefined,
                    gridStyleId: node.gridStyleId,
                    characters: node.characters,
                    fontFamily: textFont === null || textFont === void 0 ? void 0 : textFont.family,
                    fontStyle: textFont === null || textFont === void 0 ? void 0 : textFont.style,
                    fontSize: node.fontSize,
                    hyperlink: node.type === 'TEXT' && node.characters.length > 0 && typeof node.getRangeHyperlink === 'function' ? Boolean(node.getRangeHyperlink(0, node.characters.length)) : undefined,
                    textAlignHorizontal: node.textAlignHorizontal,
                    textAlignVertical: node.textAlignVertical,
                    textDecoration: node.textDecoration,
                    letterSpacing: spacing && spacing !== mg.mixed ? spacing.value : undefined,
                    letterSpacingUnit: spacing && spacing !== mg.mixed ? spacing.unit : undefined,
                    lineHeight: lineHeight && lineHeight !== mg.mixed && lineHeight.unit !== 'AUTO' ? lineHeight.value : ((lineHeight === null || lineHeight === void 0 ? void 0 : lineHeight.unit) === 'AUTO' ? 'AUTO' : undefined),
                    lineHeightUnit: lineHeight && lineHeight !== mg.mixed ? lineHeight.unit : undefined,
                    hasMissingFont: node.hasMissingFont,
                    paragraphIndent: node.paragraphIndent,
                    paragraphSpacing: node.paragraphSpacing,
                    textStyleId: node.textStyleId,
                    description: node.description,
                    componentPropertyCount: node.componentProperties ? Object.keys(node.componentProperties).length : undefined,
                    variantPropertyCount: node.componentPropertyDefinitions ? Object.keys(node.componentPropertyDefinitions).length : undefined,
                    reactionCount: Array.isArray(node.reactions) ? node.reactions.length : undefined,
                    overflowDirection: node.overflowDirection,
                    fixedChildCount: 'children' in node ? node.children.filter((child) => child.layoutPositioning === 'FIXED').length : undefined,
                    pointCount: node.pointCount
                };
                const value = direct[key];
                return value === mg.mixed ? undefined : value;
            };
            const results = [];
            // =========================================================
            // C. 遍历筛选 (Filtering)
            // =========================================================
            for (const node of finalPool) {
                let match = true;
                // 1. 名称匹配
                if (f.name && f.name.val) {
                    let n = node.name;
                    let q = f.name.val;
                    if (!f.name.caseSensitive) {
                        n = n.toLowerCase();
                        q = q.toLowerCase();
                    }
                    if (!n.includes(q))
                        match = false;
                }
                // Within each group: OR. Between type/state/name/property groups: AND.
                if (match && !LayerRules.matches(node, f.types, f.states))
                    match = false;
                // 4. 属性匹配 (Props) - 加强容错
                if (match && f.props && f.props.length > 0) {
                    for (const p of f.props) {
                        let val = undefined;
                        try {
                            val = await getAdvancedPropertyValue(node, p.key);
                        }
                        catch (e) { }
                        if (val === undefined) {
                            match = false;
                            break;
                        }
                        const tgt = p.val;
                        if (['>', '<', '>=', '<='].includes(p.op) && (!Number.isFinite(Number(val)) || !Number.isFinite(Number(tgt)))) {
                            match = false;
                            break;
                        }
                        // 数字比较 vs 字符串比较
                        if (p.op === '=') {
                            if (val != tgt)
                                match = false;
                        }
                        else if (p.op === '!=') {
                            if (val == tgt)
                                match = false;
                        }
                        else if (p.op === '>') {
                            if (Number(val) <= Number(tgt))
                                match = false;
                        }
                        else if (p.op === '<') {
                            if (Number(val) >= Number(tgt))
                                match = false;
                        }
                        else if (p.op === '>=') {
                            if (Number(val) < Number(tgt))
                                match = false;
                        }
                        else if (p.op === '<=') {
                            if (Number(val) > Number(tgt))
                                match = false;
                        }
                        else if (p.op === 'has') {
                            if (!String(val).toLowerCase().includes(String(tgt).toLowerCase()))
                                match = false;
                        }
                        else if (p.op === 'starts') {
                            if (!String(val).toLowerCase().startsWith(String(tgt).toLowerCase()))
                                match = false;
                        }
                        else if (p.op === 'ends') {
                            if (!String(val).toLowerCase().endsWith(String(tgt).toLowerCase()))
                                match = false;
                        }
                    }
                }
                if (match) {
                    results.push(node);
                }
            }
            console.log(`✅ 最终匹配: ${results.length}`);
            if (results.length > 0) {
                layerSelectSearch(results);
                try {
                    mg.viewport.scrollAndZoomIntoView(results);
                }
                catch (_) { /* Hidden results can have no viewport bounds. */ }
                notifyInUiLanguage(`✅ 已选中 ${results.length} 个图层`);
                // 🔥 新增：将结果回传给 UI
                sendToUI({
                    type: 'found-layers-result',
                    count: results.length,
                    layers: results.map(n => ({ id: n.id, name: n.name, type: n.type }))
                });
            }
            else {
                layerSelectSearch([]);
                notifyInUiLanguage("未找到符合条件的图层，请调整范围或筛选条件");
                sendToUI({ type: 'found-layers-result', count: 0, layers: [] });
            }
            break;
        }
        // ==========================================
        // 后端逻辑：响应 focus-layers
        // ==========================================
        case 'focus-layers': {
            const runFocus = async () => {
                try {
                    const ids = msg.ids;
                    if (!ids || ids.length === 0)
                        return;
                    // 1. 批量获取目标图层
                    const nodes = await Promise.all(ids.map(id => mg.getNodeById(id)));
                    const targets = [];
                    const selection = [];
                    const currentPageId = mg.document.currentPage.id;
                    // 2. 快速筛选
                    for (const node of nodes) {
                        if (!node || node.removed)
                            continue;
                        if (node.type === 'DOCUMENT' || node.type === 'PAGE')
                            continue;
                        // 确保在当前页
                        // 简单的向上查找，确保安全
                        let p = node.parent;
                        let isCurrent = false;
                        // 大多数情况父级就是 Page，优化判断速度
                        if (p && p.type === 'PAGE') {
                            isCurrent = (p.id === currentPageId);
                        }
                        else {
                            // 深度查找
                            while (p) {
                                if (p.type === 'PAGE') {
                                    isCurrent = (p.id === currentPageId);
                                    break;
                                }
                                p = p.parent;
                            }
                        }
                        if (isCurrent) {
                            // 只要在当前页，就加入“视图定位目标”
                            targets.push(node);
                            // 如果没锁且可见，也加入“选中目标”
                            if (!node.isLocked && node.isVisible) {
                                selection.push(node);
                            }
                        }
                    }
                    if (targets.length > 0) {
                        // A. 尝试选中 (如果全是锁定的，这里就是空数组，会清空选择，是正确的表现)
                        mg.document.currentPage.selection = selection;
                        // B. 视图定位 (这是你要的核心功能)
                        mg.viewport.scrollAndZoomIntoView(targets);
                        // C. 只有多选时才提示，单选静默，体验最好
                        if (targets.length > 1) {
                            notifyInUiLanguage(`已定位 ${targets.length} 项`);
                        }
                    }
                }
                catch (e) {
                    console.log("定位错误 (已忽略):", e);
                }
            };
            runFocus();
            break;
        }
        // ===========================
        // D. 跨画板查重 (Duplicate Finder)
        // ===========================
        case 'dup-check': {
            const sel = mg.document.currentPage.selection;
            // 必须恰好选中两个容器 (Frame/Group/Section/Component 等)
            const containers = sel.filter(n => 'children' in n);
            if (sel.length !== 2 || containers.length !== 2) {
                notifyInUiLanguage("请在画布上选中恰好两个画板/容器");
                return;
            }
            const [cA, cB] = containers;
            // 递归收集两容器内所有图层 (包含自身)
            const collectAll = (root) => {
                const arr = [root];
                if ('findAll' in root)
                    arr.push(...root.findAll(() => true));
                return arr;
            };
            const nodesA = collectAll(cA);
            const nodesB = collectAll(cB);
            // 名称分词：按 - _ 空格 . / 切词，统一小写
            const tokenize = (name) => {
                return name.toLowerCase().split(/[-_\s./]+/).filter(t => t.length > 0);
            };
            const mode = msg.mode === 'substring' ? 'substring' : 'segment';
            const excludeNumeric = msg.excludeNumeric !== false;
            const excludeSet = new Set((msg.excludeWords || []).map((w) => w.toLowerCase()));
            // 词段过滤：剔除排除词与纯数字编号
            const filterTokens = (tokens) => {
                return tokens.filter(t => {
                    if (excludeSet.has(t))
                        return false;
                    if (excludeNumeric && /^\d+$/.test(t))
                        return false;
                    return true;
                });
            };
            // 两两匹配，公共词段 ≥ 2 字符才计入
            const pairs = [];
            for (const a of nodesA) {
                const ta = filterTokens(tokenize(a.name));
                if (ta.length === 0)
                    continue;
                for (const b of nodesB) {
                    if (b.id === a.id)
                        continue;
                    const tb = filterTokens(tokenize(b.name));
                    if (tb.length === 0)
                        continue;
                    let common = [];
                    if (mode === 'segment') {
                        // 分段匹配：词段完全相同才算命中
                        common = ta.filter(t => t.length >= 2 && tb.includes(t));
                    }
                    else {
                        // 子串匹配：词段被对方完整名称包含即命中
                        const bFull = b.name.toLowerCase();
                        const aFull = a.name.toLowerCase();
                        const hitA = ta.filter(t => t.length >= 2 && bFull.includes(t));
                        const hitB = tb.filter(t => t.length >= 2 && aFull.includes(t));
                        common = Array.from(new Set([...hitA, ...hitB]));
                    }
                    if (common.length > 0) {
                        pairs.push({ aId: a.id, aName: a.name, bId: b.id, bName: b.name, common });
                    }
                }
            }
            // 按公共词数量降序
            pairs.sort((x, y) => y.common.length - x.common.length);
            // 防止结果过多导致 UI 卡死，最多返回 500 对
            const MAX_PAIRS = 500;
            const truncated = pairs.length > MAX_PAIRS;
            sendToUI({
                type: 'dup-check-result',
                data: {
                    pairs: pairs.slice(0, MAX_PAIRS),
                    totalPairs: pairs.length,
                    truncated,
                    aName: cA.name,
                    bName: cB.name,
                    aCount: nodesA.length,
                    bCount: nodesB.length
                }
            });
            break;
        }
        case 'dup-select-layers': {
            // 勾选模式: add 加入选中 / remove 移出选中 / set 替换选中
            const ids = msg.ids || [];
            // dynamic-page 模式下必须用异步 API 获取节点
            const found = await Promise.all(ids.map(id => mg.getNodeById(id)));
            const nodes = found
                .filter(n => n && n.type !== 'DOCUMENT' && n.type !== 'PAGE');
            const cur = mg.document.currentPage.selection;
            let next;
            if (msg.mode === 'add') {
                next = Array.from(new Set([...cur, ...nodes]));
            }
            else if (msg.mode === 'remove') {
                next = cur.filter(n => !ids.includes(n.id));
            }
            else {
                next = nodes;
            }
            mg.document.currentPage.selection = next;
            notifyInUiLanguage(`已选中 ${next.length} 个图层`);
            break;
        }
        case 'dup-fill-red': {
            // 自动标记：左(A)侧勾选填红，右(B)侧勾选填绿
            // 可直接改 fills 的节点直接填充；Instance/Component/Group 等无法改 fills 的节点，
            // 在其下方插入同尺寸半透明标记矩形兑底，不改动目标节点本身
            try {
                const aIds = msg.aIds || [];
                const bIds = msg.bIds || [];
                console.log('[dup-fill-red] A侧', aIds.length, '个, B侧', bIds.length, '个');
                const runGroup = async (ids, COLOR, tagName) => {
                    const stat = { filled: 0, marked: 0, skipped: 0 };
                    if (ids.length === 0)
                        return stat;
                    // dynamic-page 模式下必须用异步 API 获取节点
                    const found = await Promise.all(ids.map(id => mg.getNodeById(id)));
                    const nodes = [];
                    found.forEach((n, i) => {
                        if (n && n.type !== 'DOCUMENT' && n.type !== 'PAGE') {
                            nodes.push(n);
                        }
                        else {
                            console.log('[dup-fill-red] 未找到节点:', ids[i], '->', n ? n.type : null);
                        }
                    });
                    // 直接改 fills（Instance/Component 的 fills 只读，赋值会抛错返回 false）
                    const trySetFill = (node) => {
                        if (typeof node.fills === 'undefined')
                            return false;
                        try {
                            node.fills = [solidPaint(COLOR, 0.35)];
                            return true;
                        }
                        catch (e) {
                            console.log('[dup-fill-red] 直接填充失败:', node.id, node.type, e && e.message);
                            return false;
                        }
                    };
                    // 在节点下方插入同尺寸半透明标记矩形
                    const addMarkRect = (node) => {
                        try {
                            const abs = node.absoluteBoundingBox;
                            const parent = node.parent;
                            if (!abs || !parent) {
                                console.log('[dup-fill-red] 无包围盒或父容器:', node.id, node.type);
                                return false;
                            }
                            const pabs = parent.absoluteBoundingBox;
                            const rect = mg.createRectangle();
                            rect.name = tagName + ' 查重标记';
                            rect.resize(abs.width, abs.height);
                            rect.x = abs.x - (pabs ? pabs.x : 0);
                            rect.y = abs.y - (pabs ? pabs.y : 0);
                            rect.fills = [solidPaint(COLOR, 0.35)];
                            rect.opacity = 0.35;
                            const idx = parent.children.indexOf(node);
                            parent.insertChild(idx < 0 ? parent.children.length : idx, rect);
                            return true;
                        }
                        catch (e) {
                            console.log('[dup-fill-red] 矩形标记失败:', node.id, node.type, e && e.message);
                            return false;
                        }
                    };
                    for (const n of nodes) {
                        if ('isLocked' in n && n.isLocked) {
                            stat.skipped++;
                            continue;
                        }
                        if (trySetFill(n)) {
                            stat.filled++;
                            continue;
                        }
                        if (addMarkRect(n)) {
                            stat.marked++;
                        }
                        else {
                            stat.skipped++;
                        }
                    }
                    return stat;
                };
                const red = await runGroup(aIds, { r: 1, g: 0, b: 0 }, '🔴');
                const green = await runGroup(bIds, { r: 0.18, g: 0.75, b: 0.33 }, '🟢');
                const redCount = red.filled + red.marked;
                const greenCount = green.filled + green.marked;
                const skipped = red.skipped + green.skipped;
                console.log('[dup-fill-red] 结果: 左红=' + redCount + ' 右绿=' + greenCount + ' 跳过=' + skipped);
                let msgTxt = `已标记 左红 ${redCount} 个 · 右绿 ${greenCount} 个`;
                if (skipped > 0)
                    msgTxt += `（跳过 ${skipped} 个）`;
                notifyInUiLanguage(msgTxt);
            }
            catch (e) {
                console.error('[dup-fill-red] 异常:', e);
                notifyInUiLanguage('填充失败：' + (e && e.message ? e.message : String(e)));
            }
            break;
        }
        // ===========================
        // E. 文本查找与替换
        // ===========================
        case 'find-replace': {
            const { findText, replaceText } = msg;
            if (!findText) {
                notifyInUiLanguage("请输入查找内容，注意区分大小写");
                return;
            }
            // 确定范围：如果有选区则在选区内查，否则在全页查
            const scope = selection.length > 0 ? selection : [mg.document.currentPage];
            let count = 0;
            // 递归查找文本节点
            const textNodes = [];
            const collect = (n) => {
                if (n.type === 'TEXT')
                    textNodes.push(n);
                if ('children' in n)
                    n.children.forEach(collect);
            };
            scope.forEach(collect);
            if (textNodes.length === 0) {
                notifyInUiLanguage("范围内没有文本");
                return;
            }
            // 批量处理
            for (const node of textNodes) {
                if (node.characters.includes(findText)) {
                    try {
                        await loadTextFonts(node);
                        // 执行替换
                        node.characters = node.characters.split(findText).join(replaceText);
                        count++;
                    }
                    catch (e) {
                        console.error("字体加载失败或替换出错", e);
                    }
                }
            }
            if (count > 0)
                notifyInUiLanguage(`已替换 ${count} 处文本`);
            else
                notifyInUiLanguage("未找到匹配内容");
            break;
        }
        // ===========================
        // F. PPT 工具
        // ===========================
        case 'ppt-step-1': { // 初始化
            const pageName = mg.document.currentPage.name.toLowerCase();
            // --- 修复点 1：安全检查不通过时，要告诉 UI 重置按钮 ---
            if (!pageName.includes('copy') && !pageName.includes('副本')) {
                notifyInUiLanguage("⚠️ 请先将 Page 重命名为 'xxx 副本' 以确保安全！", { type: 'error' });
                // 发送一个 'step-error' 消息给 UI，让它停止转圈
                sendToUI({ type: 'step-error', step: 1 });
                return;
            }
            const slides = getSlides();
            // --- 修复点 2：没选图层时，也要告诉 UI 重置按钮 ---
            if (slides.length === 0) {
                notifyInUiLanguage("请至少选择一个 Frame 画板");
                sendToUI({ type: 'step-error', step: 1 });
                return;
            }
            // 执行 Step 1 函数
            await pptStep1_Init(slides);
            break;
        }
        case 'ppt-step-2': { // 栅格化图标
            const slides = getSlides();
            await pptStep2_Rasterize(slides);
            break;
        }
        case 'ppt-step-3': { // 扁平化
            const slides = getSlides();
            await pptStep3_Flatten(slides);
            break;
        }
        case 'ppt-step-4': { // 提取数据
            let slides = getSlides();
            // === 修复：使用绝对坐标排序 ===
            slides = sortNodesByVisualPosition(slides);
            // 函数内部会发送 step-done，这里不需要再发了
            await pptStep4_Extract(slides);
            break;
        }
        case 'ppt-step-5': { // 导出资源
            let slides = getSlides();
            // === 修复：使用绝对坐标排序 (保持顺序一致) ===
            slides = sortNodesByVisualPosition(slides);
            // 同上，内部已发消息
            await pptStep5_ExportImages(slides);
            break;
        }
        // ===========================
        // G. 组件清洗 Refiner (Smart Grouping V2 - Updated)
        // ===========================
        case 'lint-variants': {
            console.log("【3】后端：进入严格分类逻辑...");
            const cfg = msg.config || msg;
            const targets = [];
            const targetTypes = cfg.targetTypes || { compName: true, propName: true, propValue: true };
            let scopeNodes = [];
            if (cfg.scope === 'page') {
                scopeNodes = mg.document.currentPage.children;
            }
            else {
                scopeNodes = mg.document.currentPage.selection;
            }
            const collectTargets = (nodes) => {
                for (const node of nodes) {
                    if (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT') {
                        targets.push(node);
                    }
                    if ('children' in node)
                        collectTargets(node.children);
                }
            };
            collectTargets(scopeNodes);
            let findRegex = null;
            if (cfg.mode === 'find' && cfg.findText) {
                try {
                    const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    let pat = escape(cfg.findText);
                    if (cfg.wholeWord)
                        pat = `\\b${pat}\\b`;
                    findRegex = new RegExp(pat, cfg.caseSensitive ? 'g' : 'gi');
                }
                catch (e) { }
            }
            const results = [];
            const checkString = (text) => {
                let res = { changed: false, val: text };
                if (cfg.mode === 'lint') {
                    res = convertNameAdvanced(text, cfg.format, cfg.separator, cfg.casing, cfg.emoji, cfg.removeId, cfg.unmarkHidden);
                }
                else if (findRegex) {
                    if (findRegex.test(text)) {
                        res.val = text.replace(findRegex, cfg.replaceText || '');
                        res.changed = true;
                    }
                    if (res.changed && cfg.markHidden) {
                        if (!res.val.startsWith('.') && !res.val.startsWith('_'))
                            res.val = '.' + res.val;
                    }
                    if (cfg.unmarkHidden) {
                        if (res.val.startsWith('.') || res.val.startsWith('_')) {
                            res.val = res.val.substring(1);
                            res.changed = true;
                        }
                    }
                }
                return res;
            };
            for (const node of targets) {
                try {
                    if (node.type === 'COMPONENT_SET') {
                        if (targetTypes.compName) {
                            const res = checkString(node.name);
                            if (res.changed) {
                                results.push({
                                    id: node.id, compId: node.id, compName: node.name,
                                    type: 'COMPONENT_SET',
                                    targetType: 'CompName',
                                    propName: 'Name', oldVal: node.name, newVal: res.val
                                });
                            }
                        }
                    }
                    else if (node.type === 'COMPONENT') {
                        const isVariant = node.parent && node.parent.type === 'COMPONENT_SET';
                        const compId = isVariant ? node.parent.id : node.id;
                        const CompName = isVariant ? node.parent.name : node.name;
                        const groupType = isVariant ? 'COMPONENT_SET' : 'COMPONENT';
                        if (!isVariant) {
                            if (targetTypes.compName) {
                                const res = checkString(node.name);
                                if (res.changed) {
                                    results.push({
                                        id: node.id, compId: compId, compName: CompName,
                                        type: groupType,
                                        targetType: 'CompName',
                                        propName: 'Name', oldVal: node.name, newVal: res.val
                                    });
                                }
                            }
                        }
                        else {
                            const rawProps = node.name.split(',').map(p => p.trim());
                            const newProps = [];
                            let hasAnyChange = false;
                            rawProps.forEach(pair => {
                                const parts = pair.split('=');
                                if (parts.length < 2) {
                                    newProps.push(pair);
                                    return;
                                }
                                const key = parts[0].trim();
                                const val = parts[1].trim();
                                if (targetTypes.propName) {
                                    const resKey = checkString(key);
                                    if (resKey.changed) {
                                        results.push({
                                            id: node.id, compId: compId, compName: CompName,
                                            type: groupType,
                                            targetType: 'PropName',
                                            propName: 'Property',
                                            oldVal: key, newVal: resKey.val
                                        });
                                        hasAnyChange = true;
                                    }
                                }
                                if (targetTypes.propValue) {
                                    const resVal = checkString(val);
                                    if (resVal.changed) {
                                        results.push({
                                            id: node.id, compId: compId, compName: CompName,
                                            type: groupType,
                                            targetType: 'PropValue',
                                            propName: key,
                                            oldVal: val, newVal: resVal.val
                                        });
                                        hasAnyChange = true;
                                    }
                                }
                                const finalKey = (targetTypes.propName && checkString(key).changed) ? checkString(key).val : key;
                                const finalVal = (targetTypes.propValue && checkString(val).changed) ? checkString(val).val : val;
                                newProps.push(`${finalKey}=${finalVal}`);
                            });
                            if (hasAnyChange) {
                                const fullNewName = newProps.join(', ');
                                for (let k = results.length - 1; k >= 0; k--) {
                                    if (results[k].id === node.id) {
                                        if (!results[k].fullResult)
                                            results[k].fullResult = fullNewName;
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            sendToUI({ type: 'lint-results', data: results });
            break;
        }
        case 'fix-variants': {
            const items = msg.items;
            let count = 0;
            for (const item of items) {
                try {
                    const node = await mg.getNodeById(item.id);
                    if (node) {
                        node.name = item.fullResult || item.newVal;
                        count++;
                    }
                }
                catch (err) { }
            }
            notifyInUiLanguage(`✨ 已成功修复 ${count} 项命名`);
            break;
        }
        // -------------------------------------------------------------
        // 1. 查找功能：改为返回具体的匹配项列表 (后端修复版)
        // -------------------------------------------------------------
        case 'text-find-matches': {
            const { scope, findText } = msg;
            console.log("【后端】收到文本查找请求:", scope, findText); // 调试日志
            const results = [];
            let searchPool = [];
            // 1. 确定搜索范围
            if (scope === 'selection') {
                searchPool = [...mg.document.currentPage.selection];
            }
            else {
                // 搜索整个页面 (包含页面本身)
                searchPool = [mg.document.currentPage];
            }
            if (searchPool.length === 0 && scope === 'selection') {
                notifyInUiLanguage("请先选择图层");
                // 即使失败，也要发回空结果，以此重置前端按钮状态
                sendToUI({ type: 'text-find-results', data: [] });
                return;
            }
            // 2. 递归查找函数
            const traverse = (node) => {
                // 只有可见的文本层才参与查找
                if (node.type === 'TEXT' && node.isVisible) {
                    const fullText = node.characters;
                    // 转义正则特殊字符
                    const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    // 全局、不区分大小写匹配
                    const regex = new RegExp(escapedFindText, 'gi');
                    let match;
                    while ((match = regex.exec(fullText)) !== null) {
                        results.push({
                            id: node.id,
                            fullText: fullText,
                            index: match.index,
                            length: match[0].length,
                            matchText: match[0]
                        });
                    }
                }
                // 递归子级
                if ('children' in node) {
                    node.children.forEach(traverse);
                }
            };
            // 3. 执行查找
            searchPool.forEach(traverse);
            console.log(`【后端】查找完成，找到 ${results.length} 项`);
            // 4. 发送结果给前端
            sendToUI({ type: 'text-find-results', data: results });
            if (results.length === 0) {
                notifyInUiLanguage("未找到匹配文本");
            }
            break;
        }
        // -------------------------------------------------------------
        // 2. 定位功能 (修复版：兼容组件清洗和文字工具)
        // -------------------------------------------------------------
        case 'locate-node': {
            try {
                const node = await mg.getNodeById(msg.id);
                if (node) {
                    // === 第一步：通用操作 (先选中并聚焦) ===
                    // 这一步对组件、矩形、文本都有效，修复了组件清洗无法定位的问题
                    // 检查节点是否在当前页面，如果在不同页面可能需要切换（但插件API限制通常只能操作当前页）
                    mg.document.currentPage.selection = [node];
                    mg.viewport.scrollAndZoomIntoView([node]);
                    // === 第二步：文字工具特有逻辑 (仅当是文本且包含索引参数时执行) ===
                    if (node.type === 'TEXT' && typeof msg.index === 'number' && typeof msg.length === 'number') {
                        const cacheKey = `${msg.id}_${msg.index}`;
                        // 加载字体
                        await loadTextFonts(node);
                        // A. 还原颜色
                        if (highlightCache[cacheKey]) {
                            const cachedData = highlightCache[cacheKey]; // { fills, length }
                            node.setRangeFills(msg.index, msg.index + cachedData.length, cachedData.fills);
                            delete highlightCache[cacheKey];
                            notifyInUiLanguage("已还原颜色");
                            sendToUI({ type: 'highlight-status', key: cacheKey, status: false });
                        }
                        else {
                            // B. 执行高亮
                            const currentFills = getTextFills(node, msg.index);
                            highlightCache[cacheKey] = { fills: currentFills, length: msg.length };
                            const highlightPaint = [solidPaint({ r: 1, g: 0, b: 0 })];
                            node.setRangeFills(msg.index, msg.index + msg.length, highlightPaint);
                            notifyInUiLanguage("已标记 (再次点击可还原)");
                            sendToUI({ type: 'highlight-status', key: cacheKey, status: true });
                        }
                    }
                }
                else {
                    notifyInUiLanguage("图层不存在 (可能已被删除)");
                }
            }
            catch (e) {
                console.error("定位失败:", e);
                // 即使报错，通常是因为字体加载或跨页问题，不应该影响基础选中
                // 如果已经在上面被选中了，这里就不报干扰信息了
            }
            break;
        }
        // -------------------------------------------------------------
        // 3. 替换功能：支持点对点替换 (修复Bug 1 & 4)
        // -------------------------------------------------------------
        case 'text-replace-batch': {
            const { tasks, replaceText } = msg;
            // tasks 是一个数组: [{id, index, length}, ...]
            let successCount = 0;
            const processedIds = new Set(); // 用于记录成功的 uniqueId，发回给前端禁用
            // 🌟 关键策略：按 Node ID 分组，组内按 Index 倒序排列
            // 为什么倒序？因为替换前面的文字会改变后面文字的索引。
            // 从后往前替换，坐标永远是准的。
            const groups = {};
            tasks.forEach(task => {
                if (!groups[task.id])
                    groups[task.id] = [];
                groups[task.id].push(task);
            });
            for (const nodeId in groups) {
                const node = await mg.getNodeById(nodeId);
                if (!node || node.type !== 'TEXT')
                    continue;
                const groupTasks = groups[nodeId];
                // 🌟 倒序排序
                groupTasks.sort((a, b) => b.index - a.index);
                try {
                    // 加载字体
                    await loadTextFonts(node);
                    // 执行替换
                    for (const task of groupTasks) {
                        // 再次检查字符是否匹配（防止并发修改导致的错位）
                        const currentStr = node.characters.substring(task.index, task.index + task.length);
                        // 简单的校验，略过严格校验以允许大小写差异
                        node.deleteCharacters(task.index, task.index + task.length);
                        node.insertCharacters(task.index, replaceText);
                        successCount++;
                        delete highlightCache[`${task.id}_${task.index}`];
                        // 记录前端传来的唯一标识 (uid)，以便前端禁用
                        if (task.uid)
                            processedIds.add(task.uid);
                    }
                }
                catch (err) {
                    console.error(`替换失败 ${nodeId}:`, err);
                }
            }
            // 通知前端哪些任务完成了
            sendToUI({
                type: 'text-replace-success',
                count: successCount,
                processedUids: Array.from(processedIds)
            });
            notifyInUiLanguage(`已替换 ${successCount} 处文本`);
            break;
        }
        // -------------------------------------------------------------
        // [新] 一键清除所有高亮
        // -------------------------------------------------------------
        case 'clear-all-highlights': {
            let count = 0;
            for (const key in highlightCache) {
                const [nodeId, indexStr] = key.split('_');
                const index = parseInt(indexStr);
                const data = highlightCache[key]; // { fills, length }
                try {
                    const node = await mg.getNodeById(nodeId);
                    if (node && node.type === 'TEXT') {
                        await loadTextFonts(node);
                        node.setRangeFills(index, index + data.length, data.fills);
                        count++;
                    }
                }
                catch (e) {
                    console.log("还原失败", e);
                }
            }
            highlightCache = {}; // 清空池子
            notifyInUiLanguage(`已还原 ${count} 处高亮`);
            // 通知前端清除所有高亮样式
            sendToUI({ type: 'clear-all-highlights-ui' });
            break;
        }
        // ===========================
        // === 锚点工具 (Jumpback) ===
        // ===========================
        case 'jb-init': {
            // 初始化读取
            const spots = await loadJumpbackSpots();
            sendToUI({ type: 'jb-render-spots', data: spots });
            break;
        }
        case 'jb-reorder': {
            const spots = await loadJumpbackSpots();
            const ordered = reorderPluginBookmarks(spots, msg.ids);
            let error = !ordered;
            try {
                if (ordered)
                    await saveJumpbackSpots(ordered);
            }
            catch (_) {
                error = true;
            }
            sendToUI({ type: 'jb-render-spots', data: error ? spots : ordered, requestId: msg.requestId, error });
            break;
        }
        case 'jb-save': {
            const spots = await loadJumpbackSpots();
            if (spots.length >= 5) {
                notifyInUiLanguage("最多只能保存 5 个锚点！");
                return;
            }
            // 获取案发现场数据
            const currentSelection = mg.document.currentPage.selection;
            // 默认名字：如果选中了图层就用图层名，否则叫 Spot
            const defaultName = currentSelection.length > 0 ? currentSelection[0].name.substring(0, 15) : `Spot ${spots.length + 1}`;
            const newSpot = {
                id: 'spot_' + Date.now(),
                name: defaultName,
                pageId: mg.document.currentPage.id,
                pageName: mg.document.currentPage.name,
                zoom: mg.viewport.zoom,
                centerX: mg.viewport.center.x,
                centerY: mg.viewport.center.y,
                // 保存选中的图层 ID 数组
                selectionIds: currentSelection.map(n => n.id)
            };
            spots.push(newSpot);
            await saveJumpbackSpots(spots);
            notifyInUiLanguage("📍 位置已保存");
            sendToUI({ type: 'jb-render-spots', data: spots });
            break;
        }
        case 'jb-jump': {
            const spots = await loadJumpbackSpots();
            if (spots.length === 0)
                return;
            const spot = spots.find((s) => s.id === msg.id);
            if (!spot)
                return;
            try {
                // 1. 跨页面跳转 (如果所在的 Page 不一样)
                if (mg.document.currentPage.id !== spot.pageId) {
                    // === 修复点 1：使用 getNodeById 异步获取节点 ===
                    const targetPage = mg.document.children.find(page => page.id === spot.pageId);
                    if (targetPage) {
                        mg.document.currentPage = targetPage;
                    }
                    else {
                        notifyInUiLanguage("⚠️ 该位置所在的页面已被删除！");
                        return;
                    }
                }
                // 2. 恢复视角坐标和缩放
                mg.viewport.center = { x: spot.centerX, y: spot.centerY };
                mg.viewport.zoom = spot.zoom;
                // 3. 尝试恢复离开前选中的图层
                const nodesToSelect = [];
                if (spot.selectionIds && Array.isArray(spot.selectionIds)) {
                    // 使用 for...of 配合 await 依次获取节点
                    for (const id of spot.selectionIds) {
                        // === 修复点 3：同样使用 getNodeById 获取历史图层 ===
                        const node = mg.getNodeById(id);
                        // 确保节点还存在，且不是页面本身 (防止意外)
                        if (node && !node.removed) {
                            nodesToSelect.push(node);
                        }
                    }
                }
                // 4. 执行选中
                if (nodesToSelect.length > 0) {
                    mg.document.currentPage.selection = nodesToSelect;
                }
                else {
                    // 如果图层被删了，清空当前选中项，视角依然过去 (补全了这里)
                    mg.document.currentPage.selection = [];
                }
                notifyInUiLanguage("🚀 已传送！");
            }
            catch (e) {
                console.warn("Jumpback failed:", e);
                notifyInUiLanguage("传送失败，可能是图层结构已发生巨大改变");
            }
            break;
        }
        case 'jb-delete': {
            let spots = await loadJumpbackSpots();
            if (spots.length === 0)
                return;
            // 过滤掉要删除的 ID
            spots = spots.filter((s) => s.id !== msg.id);
            // 更新保存
            await saveJumpbackSpots(spots);
            // 重新渲染 UI
            sendToUI({ type: 'jb-render-spots', data: spots });
            notifyInUiLanguage("🗑️ 锚点已删除");
            break;
        }
        case 'jb-rename': {
            const spots = await loadJumpbackSpots();
            if (spots.length === 0)
                return;
            const index = spots.findIndex((s) => s.id === msg.id);
            if (index > -1 && msg.newName.trim() !== '') {
                spots[index].name = msg.newName.substring(0, 20); // 限制长度
                await saveJumpbackSpots(spots);
                notifyInUiLanguage("已重命名");
            }
            else {
                // 如果名字为空，发回原数据恢复 UI
                sendToUI({ type: 'jb-render-spots', data: spots });
            }
            break;
        }
        // ==========================================
        // === 引擎：等轴形变 (Transform & Skew) ===
        // ==========================================
        case 'skew-apply': {
            const selection = mg.document.currentPage.selection;
            if (selection.length === 0)
                return; // 拖动滑块时高频触发，没选中就静默退出
            // 1. 将角度转换为弧度
            const r = (msg.rot * Math.PI) / 180;
            const sx = (msg.angleX * Math.PI) / 180;
            const sy = (msg.angleY * Math.PI) / 180;
            // 2. 提前计算三角函数
            const cosR = Math.cos(r);
            const sinR = Math.sin(r);
            const tanX = Math.tan(sx);
            const tanY = Math.tan(sy);
            // 3. 矩阵乘法合并 (Rotate Matrix * Skew Matrix)
            // 这是一道图形学经典公式推导，确保了变形的无损和连贯性
            const m00 = cosR - sinR * tanY;
            const m01 = cosR * tanX - sinR;
            const m10 = sinR + cosR * tanY;
            const m11 = sinR * tanX + cosR;
            try {
                for (const node of selection) {
                    if ('relativeTransform' in node) {
                        // 获取图层当前在父级中的原点坐标 (X, Y 轴偏移量)
                        // 如果不保留这个，每次变形图层都会飞到画布左上角 (0,0)
                        const tx = node.relativeTransform[0][2];
                        const ty = node.relativeTransform[1][2];
                        // 4. 应用最终的 2x3 仿射变换矩阵
                        const newTransform = [
                            [m00, m01, tx],
                            [m10, m11, ty]
                        ];
                        node.relativeTransform = newTransform;
                    }
                }
            }
            catch (error) {
                console.error("Transform Engine failed:", error);
            }
            break;
        }
        // ==========================================
        // === Skew 预设数据存储 (ClientStorage) ===
        // ==========================================
        // 1. UI 请求加载历史预设
        case 'req-skew-presets': {
            try {
                // 读取缓存在用户 MasterGo 客户端下的数据
                const data = await mg.clientStorage.getAsync('MY_SKEW_PRESETS');
                // 发送回前端渲染
                sendToUI({ type: 'init-skew-presets', data: data || [] });
            }
            catch (e) {
                console.warn("读取 Skew 预设失败", e);
            }
            break;
        }
        // 2. UI 请求保存新的预设
        case 'save-skew-presets': {
            try {
                // 覆盖保存到用户 MasterGo 客户端下
                await mg.clientStorage.setAsync('MY_SKEW_PRESETS', msg.data);
            }
            catch (e) {
                console.warn("保存 Skew 预设失败", e);
            }
            break;
        }
        // ==================== 语言切换 (i18n) 逻辑 ====================
        case 'size-assistant-inspect': {
            const selected = mg.document.currentPage.selection;
            const valid = selected.filter(node => node.type === 'FRAME' || node.type === 'RECTANGLE');
            sendToUI({
                type: 'size-assistant-selection',
                validCount: valid.length,
                invalidCount: selected.length - valid.length,
                width: valid.length === 1 ? valid[0].width : 0,
                height: valid.length === 1 ? valid[0].height : 0
            });
            break;
        }
        case 'size-assistant-apply': {
            const width = Math.min(32768, Math.max(1, Number(msg.width)));
            const height = Math.min(32768, Math.max(1, Number(msg.height)));
            const selected = mg.document.currentPage.selection;
            const valid = selected.filter(node => node.type === 'FRAME' || node.type === 'RECTANGLE');
            if (!valid.length || !Number.isFinite(width) || !Number.isFinite(height)) {
                const message = '请先选择一个或多个 Frame / 矩形';
                notifyInUiLanguage(message);
                sendToUI({ type: 'size-assistant-result', ok: false, message });
                break;
            }
            let resized = 0;
            const warnings = [];
            for (const node of valid) {
                try {
                    const centerX = node.x + node.width / 2;
                    const centerY = node.y + node.height / 2;
                    node.resize(width, height);
                    if (msg.keepCenter === true) {
                        node.x = centerX - width / 2;
                        node.y = centerY - height / 2;
                    }
                    resized++;
                }
                catch (error) {
                    warnings.push(`${node.name}: ${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
                }
            }
            const message = `已将 ${resized} 个图层设为 ${width} × ${height}${warnings.length ? `，${warnings.length} 个图层调整失败` : ''}`;
            notifyInUiLanguage(message);
            sendToUI({ type: 'size-assistant-result', ok: resized > 0, message, warnings });
            break;
        }
        case 'i18n-check-selection': {
            const hasSelection = mg.document.currentPage.selection.length > 0;
            sendToUI({ type: 'i18n-check-selection-result', hasSelection: hasSelection });
            break;
        }
        case 'i18n-load-config': {
            const collections = mg.variables.getCollections();
            sendToUI({
                type: 'i18n-config-result',
                data: {
                    collections: collections
                        .map(collection => ({ name: collection.name, modes: mg.variables.getModes(collection.id).map(mode => mode.name) }))
                        .sort((a, b) => Number(!/i18n|dictionary|多语言/i.test(a.name)) - Number(!/i18n|dictionary|多语言/i.test(b.name)))
                }
            });
            break;
        }
        case 'i18n-detect': {
            const { scope, extractTarget, collectionName } = msg;
            let nodesToScan = scope === 'selection' ? [...mg.document.currentPage.selection] : [...mg.document.currentPage.children];
            const textNodes = [];
            async function findText(nodes) {
                for (const node of nodes) {
                    if (node.type === 'TEXT')
                        textNodes.push(node);
                    else if ('children' in node)
                        await findText(node.children);
                }
            }
            await findText(nodesToScan);
            const allCollections = mg.variables.getCollections();
            // 获取所有合集的名字，并把最像 i18n 的排在前面
            const collectionNames = allCollections
                .map(c => c.name)
                .sort((a, b) => {
                const aMatch = a.toLowerCase().includes('i18n') ? -1 : 1;
                const bMatch = b.toLowerCase().includes('i18n') ? -1 : 1;
                return aMatch - bMatch;
            });
            const targetColName = collectionName || "i18n Dictionary";
            const i18nCollection = allCollections.find(c => c.name === targetColName)
                || allCollections.find(c => c.name.includes("i18n") || c.name.includes("Dictionary"));
            let modes = [];
            const existingVarMap = new Map();
            if (i18nCollection) {
                const collectionModes = mg.variables.getModes(i18nCollection.id);
                const sourceMode = collectionModes.find(mode => isI18nSourceMode(mode.name)) || collectionModes[0];
                const origModeId = sourceMode === null || sourceMode === void 0 ? void 0 : sourceMode.id;
                collectionModes.forEach(m => {
                    if (m.id !== origModeId)
                        modes.push(m.name);
                });
                const localVars = mg.variables.getVariables({ collectionId: i18nCollection.id, type: 'STRING' });
                for (const v of localVars) {
                    if (v.collectionId === i18nCollection.id && origModeId) {
                        const origVal = getSimpleVariableValue(v, origModeId);
                        if (origVal)
                            existingVarMap.set(origVal, v);
                    }
                }
            }
            let boundCount = 0;
            let mixedFonts = 0;
            const autoBindMap = new Map();
            const newTextMap = new Map();
            for (const node of textNodes) {
                if (node.hasMissingFont)
                    continue;
                const hasContentBinding = Boolean(getNodeI18nBinding(node) || ((_c = node.componentPropertyReferences) === null || _c === void 0 ? void 0 : _c.characters));
                if (extractTarget === 'unbound' && hasContentBinding) {
                    boundCount++;
                    continue;
                }
                const text = node.characters.trim();
                if (!text)
                    continue;
                if (existingVarMap.has(text)) {
                    if (!autoBindMap.has(text))
                        autoBindMap.set(text, { variableId: existingVarMap.get(text).id, nodeIds: [] });
                    autoBindMap.get(text).nodeIds.push(node.id);
                }
                else {
                    if (!newTextMap.has(text))
                        newTextMap.set(text, { nodeIds: [] });
                    newTextMap.get(text).nodeIds.push(node.id);
                }
            }
            sendToUI({
                type: 'i18n-detect-result',
                data: {
                    totalNodes: textNodes.length,
                    boundCount: boundCount,
                    collections: collectionNames,
                    collectionName: (i18nCollection === null || i18nCollection === void 0 ? void 0 : i18nCollection.name) || targetColName,
                    allModes: i18nCollection ? mg.variables.getModes(i18nCollection.id).map(mode => mode.name) : [],
                    autoBindList: Array.from(autoBindMap.entries()).map(([orig, d]) => (Object.assign({ original: orig }, d))),
                    newTextList: Array.from(newTextMap.entries()).map(([orig, d]) => (Object.assign({ original: orig }, d))),
                    modes: modes
                }
            });
            break;
        }
        case 'i18n-bind-variables': {
            const { newPayload, autoBindPayload, isCreate, collectionName } = msg;
            try {
                let collections = mg.variables.getCollections();
                let collection = collections.find(c => c.name === collectionName);
                // 1. 确保 Collection 存在
                if (!collection) {
                    collection = await mg.variables.createCollection(collectionName);
                    if (!collection)
                        throw new Error(`无法创建变量合集“${collectionName}”`);
                    const initialMode = mg.variables.getModes(collection.id)[0];
                    if (initialMode)
                        mg.variables.renameMode(collection.id, initialMode.id, 'Original');
                }
                const collectionModes = mg.variables.getModes(collection.id);
                const sourceMode = collectionModes.find(mode => isI18nSourceMode(mode.name)) || collectionModes[0];
                const origModeId = sourceMode === null || sourceMode === void 0 ? void 0 : sourceMode.id;
                if (!origModeId)
                    throw new Error('变量合集中没有可用的 Mode');
                // 2. 收集所有需要处理的语种
                const allTargetLangs = new Set();
                newPayload.forEach(item => Object.keys(item.translations).forEach(l => allTargetLangs.add(l)));
                // 3. 核心修复：创建/获取 Mode ID 映射
                const modeIdMap = {};
                collectionModes.forEach(m => {
                    modeIdMap[m.name] = m.id;
                    modeIdMap[normalizeI18nModeName(m.name)] = m.id;
                });
                for (const lang of Array.from(allTargetLangs)) {
                    const canonicalKey = normalizeI18nModeName(lang);
                    if (!modeIdMap[canonicalKey]) {
                        try {
                            const newMode = await mg.variables.addMode(collection.id, lang);
                            if (!newMode)
                                throw new Error('创建 Mode 失败');
                            modeIdMap[lang] = newMode.id;
                            modeIdMap[canonicalKey] = newMode.id;
                        }
                        catch (e) {
                            sendToUI({
                                type: 'i18n-bind-error',
                                error: `无法创建“${lang}”Mode。请检查当前 MasterGo 文件权限或团队套餐限制；也可以使用“⚡ 直接替换”模式。`
                            });
                            return;
                        }
                    }
                }
                // 4. 建立变量索引 (Original Text -> Variable)
                const localVars = mg.variables.getVariables({ collectionId: collection.id, type: 'STRING' });
                const varMap = new Map();
                for (const v of localVars) {
                    if (v.collectionId === collection.id) {
                        const baseVal = getSimpleVariableValue(v, origModeId);
                        if (baseVal)
                            varMap.set(baseVal, v);
                    }
                }
                // 扫描阶段已匹配到的变量无需重建，但仍需把画布节点补绑定。
                for (const item of autoBindPayload || []) {
                    const variable = mg.variables.getVariableById(item.variableId);
                    if (!variable)
                        continue;
                    for (const nodeId of item.nodeIds || []) {
                        const node = mg.getNodeById(nodeId);
                        if ((node === null || node === void 0 ? void 0 : node.type) === 'TEXT' && !node.hasMissingFont) {
                            await bindI18nVariableToText(node, variable);
                        }
                    }
                }
                // 5. 遍历翻译数据，写入变量并执行绑定
                for (const item of newPayload) {
                    let variable = varMap.get(item.original);
                    // 如果不存在则创建
                    if (!variable) {
                        const varName = stableI18nVariableName(item.original);
                        variable = await mg.variables.createVariable({
                            name: varName,
                            type: 'STRING',
                            value: item.original,
                            collectionId: collection.id
                        });
                        if (!variable)
                            throw new Error(`无法为“${item.original}”创建变量`);
                        mg.variables.setVariableValue({ id: variable.id, modeId: origModeId, value: item.original });
                        varMap.set(item.original, variable);
                    }
                    // 【核心修复】：为该变量在所有目标 Mode 中设置翻译值
                    for (const [langName, translatedText] of Object.entries(item.translations)) {
                        const targetModeId = modeIdMap[langName] || modeIdMap[normalizeI18nModeName(langName)];
                        if (targetModeId) {
                            mg.variables.setVariableValue({
                                id: variable.id,
                                modeId: targetModeId,
                                value: translatedText
                            });
                        }
                    }
                    // 执行画布节点的变量绑定
                    for (const nodeId of item.nodeIds) {
                        const node = mg.getNodeById(nodeId);
                        if (node && node.type === 'TEXT' && !node.hasMissingFont) {
                            await bindI18nVariableToText(node, variable);
                        }
                    }
                }
                await syncMasterGoI18nFallbackBindings();
                sendToUI({ type: 'i18n-bind-success', message: '🎉 MasterGo 多语言 Mode 已同步更新！' });
            }
            catch (e) {
                sendToUI({ type: 'i18n-bind-error', error: e instanceof Error ? e.message : String(e) });
            }
            break;
        }
        case 'i18n-replace-text': {
            const { payload } = msg;
            let successCount = 0;
            try {
                for (const item of payload) {
                    const targetText = Object.values(item.translations)[0];
                    for (const nodeId of item.nodeIds) {
                        try {
                            const node = mg.getNodeById(nodeId);
                            if (node && node.type === 'TEXT' && !node.hasMissingFont) {
                                await loadTextFonts(node);
                                await unlinkI18nVariableFromText(node);
                                node.characters = String(targetText !== null && targetText !== void 0 ? targetText : '');
                                successCount++;
                            }
                        }
                        catch (e) {
                            console.warn(`节点替换失败`, e);
                        }
                    }
                }
                sendToUI({ type: 'i18n-bind-success', message: `🎉 成功替换了 ${successCount} 个文本节点！` });
            }
            catch (e) {
                sendToUI({ type: 'i18n-bind-error', error: e instanceof Error ? e.message : String(e) });
            }
            break;
        }
        // --- 窗口大小调整 ---
        case 'resize-start':
            // 记录开始拖拽时的状态
            break;
        case 'resize-move': {
            // 计算新尺寸并调整窗口
            const dx = msg.clientX - msg.startX;
            const dy = msg.clientY - msg.startY;
            const newW = Math.max(170, msg.startW + dx);
            const newH = Math.max(200, msg.startH + dy);
            mg.ui.resize(newW, newH);
            break;
        }
        case 'resize-end':
            // 结束拖拽
            break;
        case 'resize-drag':
        case 'resize-window':
            mg.ui.resize(msg.width, msg.height);
            break;
        // ===========================
        // I. Component Builder - 组件构建器
        // ===========================
        case 'component-builder-inspect': {
            sendComponentBuilderSelection();
            break;
        }
        case 'component-ai-inspect': {
            try {
                sendToUI({ type: 'component-ai-context', context: buildComponentAiContext(msg.language || 'zh') });
            }
            catch (error) {
                sendToUI({ type: 'component-ai-error', message: String((error === null || error === void 0 ? void 0 : error.message) || error) });
            }
            break;
        }
        case 'component-ai-apply': {
            try {
                const result = applyComponentAiPlan(msg.plan);
                mg.commitUndo();
                const message = `已应用 ${result.changed} 项组件规范优化${result.warnings.length ? `；${result.warnings.length} 项未能修改` : ''}`;
                notifyInUiLanguage(message, { type: result.warnings.length ? 'warning' : 'success' });
                sendToUI({ type: 'component-ai-applied', ok: true, message, warnings: result.warnings });
                sendComponentBuilderSelection();
            }
            catch (error) {
                const message = `应用失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`;
                notifyInUiLanguage(message, { type: 'error' });
                sendToUI({ type: 'component-ai-applied', ok: false, message });
            }
            break;
        }
        case 'component-builder-reverse': {
            if (selection.length !== 1 || selection[0].type !== 'INSTANCE') {
                const message = '请只选择一个实例（Instance）后再逆向母版';
                notifyInUiLanguage(message, { type: 'warning' });
                sendToUI({ type: 'component-builder-result', ok: false, message });
                break;
            }
            if (componentReverseRunning) {
                const message = '实例逆向正在处理中，请等待当前操作完成';
                notifyInUiLanguage(message, { type: 'warning' });
                sendToUI({ type: 'component-builder-result', ok: false, message });
                break;
            }
            componentReverseRunning = true;
            let result = null;
            try {
                result = await reverseInstanceToMaster(selection[0]);
            }
            catch (error) {
                const message = `逆向失败：${describeReverseFailure(error)}`;
                notifyInUiLanguage(message, { type: 'error' });
                sendToUI({ type: 'component-builder-result', ok: false, message });
            }
            finally {
                componentReverseRunning = false;
            }
            if (!result)
                break;
            // 生成已完成后，选中、视口定位或撤销栈提交即使被宿主坏引用打断，也不能误报为逆向失败。
            try {
                mg.commitUndo();
            }
            catch (error) {
                result.warnings.push(`撤销记录提交失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
            try {
                mg.document.currentPage.selection = [result.target];
            }
            catch (error) {
                result.warnings.push(`新母版已创建，但自动选中失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
            try {
                mg.viewport.scrollAndZoomIntoView([result.target]);
            }
            catch (error) {
                result.warnings.push(`新母版已创建，但自动定位失败：${String((error === null || error === void 0 ? void 0 : error.message) || error)}`);
            }
            result.warnings = [...new Set(result.warnings)];
            const warningText = result.warnings.length > 0
                ? `；${result.warnings.length} 项内容已安全降级或跳过`
                : '';
            const modeText = result.recoveryMode === 'raster' ? '（视觉快照兜底）' : '';
            const variantText = result.variantCount > 1
                ? `，完整还原 ${result.variantCount} 个真实变体`
                : '';
            const overflowText = result.overflowVariantCount > 0
                ? `，原组件集${result.overflowVariantCountIsMinimum ? '至少 ' : ' '}${result.overflowVariantCount} 个变体超过上限 ${MAX_REVERSED_VARIANTS}，已保留为单变体组件集及原属性`
                : variantText;
            const message = `已逆向组件母版${modeText}${overflowText}，并保留 ${result.propertyCount} 个有效属性${warningText}`;
            notifyInUiLanguage(message, { type: result.warnings.length > 0 ? 'warning' : 'success' });
            sendToUI({
                type: 'component-builder-result',
                ok: true,
                message,
                warnings: result.warnings,
                recoveryMode: result.recoveryMode,
                variantCount: result.variantCount,
                overflowVariantCount: result.overflowVariantCount,
                created: 1
            });
            break;
        }
        case 'component-builder-create': {
            await layerBuildManual(msg);
            break;
        }
        // ===========================
        // J. CompKit - 变体矩阵工具
        // ===========================
        // 初始化：获取组件集属性列表
        case 'init-compkit': {
            const selection = mg.document.currentPage.selection;
            let properties = [];
            let targetId = null;
            let componentName = '';
            let propertyValues = {};
            let variantsCount = 0;
            let totalSets = 0;
            // 过滤出所有选中的组件集（支持直接从画板中提取）
            const selectedSets = [];
            for (const node of selection) {
                if (node.type === 'COMPONENT_SET') {
                    selectedSets.push(node);
                }
                else if (node.type === 'FRAME' && node.getPluginData('isShowcaseBoard') === 'true') {
                    const innerSet = node.findOne(n => n.type === 'COMPONENT_SET');
                    if (innerSet)
                        selectedSets.push(innerSet);
                }
            }
            if (selectedSets.length > 0) {
                totalSets = selectedSets.length;
                if (selectedSets.length === 1) {
                    // 单选：完整解析，收集所有属性及其值（供"生成说明书"使用）
                    const targetNode = selectedSets[0];
                    if (targetNode.children.length > 0) {
                        componentName = targetNode.name;
                        variantsCount = targetNode.children.length;
                        targetId = targetNode.id;
                        const sampleName = targetNode.children[0].name;
                        properties = sampleName.split(',').map(p => p.split('=')[0].trim());
                        const variants = targetNode.children;
                        properties.forEach(prop => {
                            const values = new Set();
                            variants.forEach(v => {
                                const props = v.name.split(',').reduce((acc, pair) => {
                                    const [key, val] = pair.split('=').map(s => s.trim());
                                    acc[key] = val;
                                    return acc;
                                }, {});
                                if (props[prop])
                                    values.add(props[prop]);
                            });
                            propertyValues[prop] = Array.from(values);
                        });
                    }
                }
                else {
                    // 多选：取所有组件集的公共（交集）属性（供"批量排布"使用）
                    const firstSample = ((_d = selectedSets[0].children[0]) === null || _d === void 0 ? void 0 : _d.name) || '';
                    let common = firstSample.split(',').map(p => p.split('=')[0].trim());
                    for (let i = 1; i < selectedSets.length; i++) {
                        const sample = ((_e = selectedSets[i].children[0]) === null || _e === void 0 ? void 0 : _e.name) || '';
                        const props = sample.split(',').map(p => p.split('=')[0].trim());
                        common = common.filter(p => props.includes(p));
                    }
                    properties = common;
                }
            }
            sendToUI({
                type: 'compkit-props',
                properties,
                targetId,
                componentName,
                propertyValues,
                variantsCount,
                totalSets
            });
            break;
        }
        // 矩阵排列（简化版）- 支持单属性（1D）和多属性（2D）
        case 'run-compkit': {
            await handleLayerToolsMessage(Object.assign(Object.assign({}, msg), { type: 'layer-matrix' }));
            break;
        }
        case 'generate-batch-showcase': {
            const gapX = msg.gapX !== undefined ? msg.gapX : 16;
            const gapY = msg.gapY !== undefined ? msg.gapY : 16;
            const padding = msg.padding !== undefined ? msg.padding : 20;
            const setSpacing = msg.setSpacing !== undefined ? msg.setSpacing : 32;
            const drawLabels = msg.drawLabels !== false;
            const drawGrid = msg.drawGrid !== false;
            const orientation = msg.orientation === 'portrait' ? 'portrait' : 'landscape';
            const theme = msg.theme === 'dark' ? 'dark' : 'light';
            const darkTheme = theme === 'dark';
            const boardFill = darkTheme ? { r: 17 / 255, g: 24 / 255, b: 39 / 255 } : { r: 249 / 255, g: 250 / 255, b: 251 / 255 };
            const titleFill = darkTheme ? { r: 243 / 255, g: 244 / 255, b: 246 / 255 } : { r: 17 / 255, g: 24 / 255, b: 39 / 255 };
            const selection = mg.document.currentPage.selection;
            // 从选中项中提取组件集（支持直接选中 ComponentSet 或已生成的说明书画板）
            const compSets = [];
            for (const n of selection) {
                if (n.type === 'COMPONENT_SET') {
                    compSets.push(n);
                }
                else if (n.type === 'FRAME' && n.getPluginData('isShowcaseBoard') === 'true') {
                    const innerSet = n.findOne(child => child.type === 'COMPONENT_SET');
                    if (innerSet)
                        compSets.push(innerSet);
                }
            }
            if (compSets.length === 0) {
                notifyInUiLanguage("请选中至少一个 Component Set！", { type: 'error' });
                break;
            }
            await mg.loadFontAsync({ family: "Inter", style: "Regular" });
            await mg.loadFontAsync({ family: "Inter", style: "Semi Bold" });
            await mg.loadFontAsync({ family: "Inter", style: "Bold" });
            const layouts = new Map(compSets.map(componentSet => {
                var _a;
                const variants = componentSet.children;
                const properties = [...new Set(variants.flatMap(v => Object.keys(parseVariantName(v.name))))];
                const axesX = Array.isArray(msg.axesX) ? msg.axesX.filter(p => properties.includes(p)) : [];
                const axesY = Array.isArray(msg.axesY) ? msg.axesY.filter(p => properties.includes(p) && !axesX.includes(p)) : [properties[1]].filter(Boolean);
                return [componentSet.id, LayerRules.matrix(variants, Object.assign(Object.assign({}, msg), { axesX: axesX.length ? axesX : [properties[0]], axesY, groupGap: (_a = msg.groupGap) !== null && _a !== void 0 ? _a : setSpacing }))];
            }));
            const oldBoards = new Set();
            // 收集所有组件集的中心位置
            let centerX = 0, centerY = 0;
            compSets.forEach(cs => { centerX += cs.x + cs.width / 2; centerY += cs.y + cs.height / 2; });
            centerX /= compSets.length;
            centerY /= compSets.length;
            // 外层容器 Frame
            const container = mg.createFrame();
            container.name = "🧩 Component Specs Catalog";
            container.setPluginData('isShowcaseBoard', 'true');
            container.flexMode = orientation === 'portrait' ? "VERTICAL" : "HORIZONTAL";
            container.mainAxisSizingMode = "AUTO";
            container.crossAxisSizingMode = "AUTO";
            container.itemSpacing = setSpacing;
            container.paddingLeft = (_f = msg.boardPaddingX) !== null && _f !== void 0 ? _f : 48;
            container.paddingRight = (_g = msg.boardPaddingX) !== null && _g !== void 0 ? _g : 48;
            container.paddingTop = (_h = msg.boardPaddingY) !== null && _h !== void 0 ? _h : 56;
            container.paddingBottom = (_j = msg.boardPaddingY) !== null && _j !== void 0 ? _j : 56;
            container.fills = [solidPaint(boardFill)];
            let maxSetWidth = 0;
            const directPlacements = [];
            // 处理每个组件集
            for (const componentSet of compSets) {
                const variants = componentSet.children;
                if (variants.length === 0)
                    continue;
                // 解耦组件集并自动销毁旧大画板，防止画布残留垃圾图层
                const origX = componentSet.x;
                const origY = componentSet.y;
                let ancestor = componentSet.parent;
                let oldBoard = null;
                while (ancestor && ancestor.type !== 'DOCUMENT' && ancestor.type !== 'PAGE') {
                    if (ancestor.type === 'FRAME' && ancestor.getPluginData('isShowcaseBoard') === 'true') {
                        oldBoard = ancestor;
                        break;
                    }
                    ancestor = ancestor.parent;
                }
                mg.document.currentPage.appendChild(componentSet);
                if (oldBoard)
                    oldBoards.add(oldBoard);
                const layout = layouts.get(componentSet.id);
                const localPropX = layout.x.join(' / '), localPropY = layout.y.join(' / '), localHasY = layout.y.length > 0;
                const groupProps = layout.group;
                const xArray = layout.xs.map(key => JSON.parse(key).join(' / '));
                const yArray = layout.ys.map(key => JSON.parse(key).join(' / '));
                const groups = layout.groups.map(key => JSON.parse(key).map((v, i) => `${groupProps[i]}=${v}`).join(', ') || 'Default');
                const maxW = layout.maxW, maxH = layout.maxH, cellW = maxW + gapX, cellH = maxH + gapY, groupH = layout.groupH;
                componentSet.flexMode = 'NONE';
                layout.placements.forEach(p => { p.node.x = p.x; p.node.y = p.y; });
                const csWidth = layout.width, csHeight = layout.height;
                componentSet.resize(csWidth, csHeight);
                if (csWidth > maxSetWidth)
                    maxSetWidth = csWidth;
                // 每组创建一个包装容器：标题 + 组件集
                const setGroup = mg.createFrame();
                setGroup.name = componentSet.name;
                setGroup.flexMode = "VERTICAL";
                setGroup.mainAxisSizingMode = "AUTO";
                setGroup.crossAxisSizingMode = "AUTO";
                setGroup.itemSpacing = 12;
                setGroup.fills = [];
                // 组件集标题
                const titleText = mg.createText();
                titleText.characters = componentSet.name;
                setTextFontSize(titleText, 20);
                setTextFontName(titleText, { family: "Inter", style: "Bold" });
                titleText.fills = [solidPaint(titleFill)];
                setGroup.appendChild(titleText);
                // 内部包装块（组件集 + 标签/网格）
                const innerBlock = mg.createFrame();
                innerBlock.name = `${componentSet.name} Block`;
                innerBlock.flexMode = "NONE";
                innerBlock.fills = [];
                setGroup.appendChild(innerBlock);
                innerBlock.appendChild(componentSet);
                const labelOffset = (localHasY && drawLabels) ? 100 : 0;
                componentSet.x = labelOffset;
                componentSet.y = drawLabels ? 40 : 0;
                // 计算内部区域大小
                const areaW = csWidth + labelOffset;
                const areaH = csHeight + (drawLabels ? 60 : 0);
                innerBlock.resize(areaW, areaH);
                // 轴标签和网格线
                const decorationNodes = [];
                if (drawLabels) {
                    // X 轴标签
                    xArray.forEach((xVal, index) => {
                        const label = mg.createText();
                        label.characters = `${localPropX}: ${xVal}`.toUpperCase();
                        setTextFontSize(label, 12);
                        setTextFontName(label, { family: "Inter", style: "Semi Bold" });
                        label.fills = [solidPaint({ r: 107 / 255, g: 114 / 255, b: 128 / 255 })];
                        label.x = componentSet.x + padding + layout.columnOffsets[index] + layout.columnWidths[index] / 2 - label.width / 2;
                        label.y = componentSet.y - 32;
                        innerBlock.appendChild(label);
                        decorationNodes.push(label);
                    });
                }
                groups.forEach((gSign, gIndex) => {
                    const gAbsY = componentSet.y + padding + gIndex * (groupH + layout.groupGap);
                    // Y 轴标签（仅二维）
                    if (localHasY && drawLabels) {
                        yArray.forEach((yVal, rowIndex) => {
                            const label = mg.createText();
                            label.characters = `${localPropY}: ${yVal}`.toUpperCase();
                            setTextFontSize(label, 12);
                            setTextFontName(label, { family: "Inter", style: "Semi Bold" });
                            label.fills = [solidPaint({ r: 156 / 255, g: 163 / 255, b: 175 / 255 })];
                            label.x = componentSet.x - label.width - 16;
                            label.y = gAbsY + layout.rowOffsets[rowIndex] + layout.rowHeights[rowIndex] / 2 - label.height / 2;
                            innerBlock.appendChild(label);
                            decorationNodes.push(label);
                        });
                    }
                    // 网格线
                    if (drawGrid) {
                        if (localHasY) {
                            for (let r = 1; r < yArray.length; r++) {
                                const line = mg.createLine();
                                line.resize(csWidth - padding * 2, 0);
                                line.x = componentSet.x + padding;
                                line.y = gAbsY + layout.rowOffsets[r] - gapY / 2;
                                line.strokeDashes = [4, 4];
                                line.strokeWeight = 1;
                                line.strokes = [solidPaint({ r: 0.9, g: 0.92, b: 0.94 })];
                                innerBlock.appendChild(line);
                                decorationNodes.push(line);
                            }
                        }
                        for (let c = 1; c < xArray.length; c++) {
                            const lineH = groupH;
                            const line = mg.createLine();
                            line.resize(lineH, 0);
                            line.rotation = -90;
                            line.x = componentSet.x + padding + layout.columnOffsets[c] - gapX / 2;
                            line.y = gAbsY;
                            line.strokeDashes = [4, 4];
                            line.strokeWeight = 1;
                            line.strokes = [solidPaint({ r: 0.9, g: 0.92, b: 0.94 })];
                            innerBlock.appendChild(line);
                            decorationNodes.push(line);
                        }
                    }
                });
                if (decorationNodes.length > 0) {
                    groupInParent(decorationNodes, innerBlock).name = `${componentSet.name} Decorations`;
                }
                // 恢复原始位置（放在容器中）
                componentSet.x = labelOffset;
                componentSet.y = drawLabels ? 40 : 0;
                container.appendChild(setGroup);
                directPlacements.push(componentSet);
            }
            // 容器定位
            container.x = centerX - 200;
            container.y = centerY - 200;
            // 组件集保持为最外层说明书画板的直接子项，避免库引用路径层层嵌套。
            const containerBounds = container.absoluteBoundingBox;
            if (containerBounds) {
                directPlacements.map(componentSet => ({ componentSet, bounds: componentSet.absoluteBoundingBox })).forEach(({ componentSet, bounds }) => {
                    if (!bounds || componentSet.removed)
                        return;
                    container.appendChild(componentSet);
                    trySet(componentSet, 'layoutPositioning', 'ABSOLUTE');
                    componentSet.x = bounds.x - containerBounds.x;
                    componentSet.y = bounds.y - containerBounds.y;
                });
            }
            mg.document.currentPage.selection = [container];
            oldBoards.forEach(board => { if (!board.removed && !LayerRules.walk(board.children).some(n => n.type === 'COMPONENT_SET'))
                board.remove(); });
            mg.viewport.scrollAndZoomIntoView([container]);
            notifyInUiLanguage(`✅ 批量排布完成！共 ${compSets.length} 个组件集`);
            break;
        }
        // 生成说明书（完整版）
        case 'generate-showcase': {
            const propX = msg.propX;
            const propY = msg.propY || ''; // propY 可以为空（单属性组件集）
            const padding = msg.padding !== undefined ? msg.padding : 20;
            const gapX = msg.gapX !== undefined ? msg.gapX : 16;
            const gapY = msg.gapY !== undefined ? msg.gapY : 16;
            const groupGap = msg.groupGap !== undefined ? msg.groupGap : 32;
            const compRadius = msg.compRadius !== undefined ? msg.compRadius : 0;
            const compStroke = msg.compStroke !== undefined ? msg.compStroke : 1;
            const compStrokeColor = msg.compStrokeColor || { r: 140 / 255, g: 91 / 255, b: 212 / 255 };
            const gridLineWidth = msg.gridLineWidth !== undefined ? msg.gridLineWidth : 1;
            const gridLineColor = msg.gridLineColor || { r: 0.9, g: 0.92, b: 0.94 };
            const boardRadius = msg.boardRadius !== undefined ? msg.boardRadius : 12;
            const boardPaddingX = msg.boardPaddingX !== undefined ? msg.boardPaddingX : 48;
            const boardPaddingY = msg.boardPaddingY !== undefined ? msg.boardPaddingY : 56;
            const boardBg = msg.boardBg || { r: 249 / 255, g: 250 / 255, b: 251 / 255 };
            const drawGrid = msg.drawGrid !== false;
            const drawLabels = msg.drawLabels !== false;
            const drawProps = msg.drawProps !== false;
            const drawUsage = msg.drawUsage !== false;
            const language = msg.language || 'zh';
            const status = msg.status || 'approved';
            const designer = msg.designer || '';
            const usagePage = msg.usagePage || '';
            const aiGeneratedDescription = msg.aiGeneratedDescription || '';
            const itemSpacing = msg.itemSpacing !== undefined ? msg.itemSpacing : 24;
            const orientation = msg.orientation === 'portrait' ? 'portrait' : 'landscape';
            const isDark = msg.theme === 'dark';
            const themeText = isDark ? { r: 243 / 255, g: 244 / 255, b: 246 / 255 } : { r: 17 / 255, g: 24 / 255, b: 39 / 255 };
            const themeMuted = isDark ? { r: 156 / 255, g: 163 / 255, b: 175 / 255 } : { r: 75 / 255, g: 85 / 255, b: 99 / 255 };
            const themeSurface = isDark ? { r: 31 / 255, g: 41 / 255, b: 55 / 255 } : { r: 1, g: 1, b: 1 };
            const themeBorder = isDark ? { r: 55 / 255, g: 65 / 255, b: 81 / 255 } : { r: 229 / 255, g: 231 / 255, b: 235 / 255 };
            const selection = mg.document.currentPage.selection;
            let targetNode = null;
            if (selection.length === 1) {
                if (selection[0].type === 'COMPONENT_SET')
                    targetNode = selection[0];
                else if (selection[0].type === 'FRAME' && selection[0].getPluginData('isShowcaseBoard') === 'true') {
                    targetNode = selection[0].findOne(n => n.type === 'COMPONENT_SET');
                }
            }
            if (!targetNode) {
                notifyInUiLanguage("请选中一个 Component Set 或已生成的说明书画板！", { type: 'error' });
                break;
            }
            const componentSet = targetNode;
            const variants = componentSet.children;
            if (variants.length === 0)
                break;
            const layout = LayerRules.matrix(variants, msg);
            const properties = [...new Set(variants.flatMap(v => Object.keys(parseVariantName(v.name))))];
            const hasY = layout.y.length > 0;
            const groupProps = layout.group;
            const xArray = layout.xs.map(key => JSON.parse(key).join(' / '));
            const yArray = layout.ys.map(key => JSON.parse(key).join(' / '));
            const groups = layout.groups.map(key => JSON.parse(key).map((value, index) => `${groupProps[index]}=${value}`).join(', ') || 'Default');
            const maxWidth = layout.maxW, maxHeight = layout.maxH;
            const cellWidth = maxWidth + gapX, cellHeight = maxHeight + gapY;
            const singleGroupHeight = layout.groupH;
            await mg.loadFontAsync({ family: "Inter", style: "Regular" });
            await mg.loadFontAsync({ family: "Inter", style: "Medium" });
            await mg.loadFontAsync({ family: "Inter", style: "Semi Bold" });
            await mg.loadFontAsync({ family: "Inter", style: "Bold" });
            // ====== 【核心修复】二次编辑重写与销毁旧画板的递归追溯算法 ======
            let baseX = componentSet.x;
            let baseY = componentSet.y;
            let isReedit = false;
            let ancestor = componentSet.parent;
            let oldBoard = null;
            while (ancestor && ancestor.type !== 'DOCUMENT' && ancestor.type !== 'PAGE') {
                if (ancestor.type === 'FRAME' && ancestor.getPluginData('isShowcaseBoard') === 'true') {
                    oldBoard = ancestor;
                    break;
                }
                ancestor = ancestor.parent;
            }
            if (oldBoard) {
                baseX = oldBoard.x;
                baseY = oldBoard.y;
                isReedit = true;
                mg.document.currentPage.appendChild(componentSet); // 提取组件集到当前页面根目录
                // Old board is cleaned only after new documentation succeeds.
            }
            componentSet.flexMode = "NONE";
            safeCornerRadius(componentSet, compRadius);
            try {
                componentSet.strokes = compStroke > 0 ? [solidPaint(compStrokeColor)] : [];
                if (compStroke > 0) {
                    componentSet.strokeWeight = compStroke;
                    componentSet.strokeDashes = [6, 4];
                }
            }
            catch (_) { }
            layout.placements.forEach(p => { p.node.x = p.x; p.node.y = p.y; });
            const compSetWidth = layout.width, compSetHeight = layout.height;
            componentSet.resize(compSetWidth, compSetHeight);
            // ================= 视觉绘制层 =================
            // 计算自适应宽度，为两旁留出呼吸空间
            const minimumBoardWidth = orientation === 'portrait' ? 720 : 1120;
            const boardWidth = Math.max(compSetWidth + boardPaddingX * 2 + (drawLabels && hasY ? 120 : 0), minimumBoardWidth);
            const boardFrame = mg.createFrame();
            boardFrame.name = `📚 ${componentSet.name} Specs`;
            boardFrame.setPluginData('isShowcaseBoard', 'true');
            boardFrame.fills = [solidPaint(boardBg)];
            safeCornerRadius(boardFrame, boardRadius);
            // 定位修正：如果是新生成，向左向上抵消偏移，让组件集永远留在用户点击的原位上
            boardFrame.x = isReedit ? baseX : (baseX - boardPaddingX - (drawLabels && hasY ? 120 : 0));
            boardFrame.y = isReedit ? baseY : (baseY - boardPaddingY - 96);
            // 顶级画板：开启自动布局
            boardFrame.flexMode = "VERTICAL";
            setHorizontalSizing(boardFrame, 'FIXED');
            boardFrame.resize(boardWidth, 200); // 仅在横向上固定，高度后续完全交由 HUG 托管自适应
            boardFrame.itemSpacing = itemSpacing; // 画板内部区块间距（可配置）
            boardFrame.paddingLeft = boardPaddingX;
            boardFrame.paddingRight = boardPaddingX;
            boardFrame.paddingTop = boardPaddingY;
            boardFrame.paddingBottom = boardPaddingY;
            const contentWidth = boardWidth - boardPaddingX * 2;
            // 视觉微勋章：顶部极致的高阶色条
            const accentBar = mg.createFrame();
            accentBar.name = "🎨 Accent Bar";
            accentBar.resize(boardWidth, 6);
            accentBar.fills = [solidPaint(compStrokeColor)];
            boardFrame.appendChild(accentBar);
            setHorizontalSizing(accentBar, 'FILL');
            setVerticalSizing(accentBar, 'FIXED');
            // --- Header 区域 ---
            const headerFrame = mg.createFrame();
            headerFrame.name = "Header Row";
            headerFrame.flexMode = "HORIZONTAL";
            headerFrame.fills = [];
            headerFrame.itemSpacing = 16;
            headerFrame.mainAxisAlignItems = "FLEX_START";
            headerFrame.crossAxisAlignItems = "CENTER";
            boardFrame.appendChild(headerFrame);
            setHorizontalSizing(headerFrame, 'FILL');
            setVerticalSizing(headerFrame, 'HUG');
            const formatTitle = (name, lang) => {
                let title = name.replace(/^(ic_|icon_|btn_|img_|img-)/i, '');
                title = title.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                title = title.charAt(0).toUpperCase() + title.slice(1);
                title = title.replace(/\s+/g, ' ');
                if (lang === 'en')
                    return title;
                const translations = {
                    'button': '按钮', 'input': '输入框', 'card': '卡片', 'modal': '弹窗', 'dialog': '对话框',
                    'checkbox': '复选框', 'radio': '单选框', 'switch': '开关', 'select': '选择器', 'table': '表格',
                    'tag': '标签', 'label': '标签', 'badge': '徽章', 'list': '列表', 'avatar': '头像',
                };
                const lowerTitle = title.toLowerCase();
                return translations[lowerTitle] || title;
            };
            const titleText = formatTitle(componentSet.name, language);
            const title = mg.createText();
            title.name = "Component Title";
            title.characters = titleText;
            setTextFontSize(title, 36);
            setTextFontName(title, { family: "Inter", style: "Bold" });
            title.fills = [solidPaint(themeText)];
            headerFrame.appendChild(title);
            setHorizontalSizing(title, 'FILL');
            setVerticalSizing(title, 'HUG');
            title.textAutoResize = "HEIGHT";
            // 精美自适应状态徽章
            const statusConfig = {
                'approved': { bg: { r: 220 / 255, g: 252 / 255, b: 231 / 255 }, text: { r: 22 / 255, g: 101 / 255, b: 52 / 255 }, label: '已审核', labelEn: 'APPROVED' },
                'draft': { bg: { r: 254 / 255, g: 243 / 255, b: 199 / 255 }, text: { r: 146 / 255, g: 113 / 255, b: 24 / 255 }, label: '草稿', labelEn: 'DRAFT' },
                'deprecated': { bg: { r: 254 / 255, g: 226 / 255, b: 226 / 255 }, text: { r: 153 / 255, g: 27 / 255, b: 27 / 255 }, label: '已废弃', labelEn: 'DEPRECATED' },
                'review': { bg: { r: 223 / 255, g: 232 / 255, b: 255 / 255 }, text: { r: 67 / 255, g: 56 / 255, b: 202 / 255 }, label: '待审核', labelEn: 'REVIEW' },
            };
            const badge = mg.createFrame();
            badge.name = `Status: ${status.toUpperCase()}`;
            badge.flexMode = "HORIZONTAL";
            badge.paddingLeft = 12;
            badge.paddingRight = 12;
            badge.paddingTop = 7;
            badge.paddingBottom = 7;
            safeCornerRadius(badge, 8);
            const statusInfo = statusConfig[status] || statusConfig['approved'];
            badge.fills = [solidPaint(statusInfo.bg)];
            const badgeText = mg.createText();
            badgeText.name = "Status Text";
            badgeText.characters = language === 'zh' ? statusInfo.label : statusInfo.labelEn;
            setTextFontSize(badgeText, 12);
            setTextFontName(badgeText, { family: "Inter", style: "Bold" });
            badgeText.fills = [solidPaint(statusInfo.text)];
            badge.appendChild(badgeText);
            headerFrame.appendChild(badge);
            setHorizontalSizing(badge, 'HUG');
            setVerticalSizing(badge, 'HUG');
            // --- Metadata Spec Card (高颜值结构化描述卡片) ---
            const metaCard = mg.createFrame();
            metaCard.name = "Metadata Spec Card";
            metaCard.flexMode = "VERTICAL";
            metaCard.itemSpacing = 8;
            metaCard.paddingLeft = 16;
            metaCard.paddingRight = 16;
            metaCard.paddingTop = 14;
            metaCard.paddingBottom = 14;
            safeCornerRadius(metaCard, 12);
            metaCard.fills = [solidPaint(themeSurface)];
            metaCard.strokes = [solidPaint(themeBorder)];
            boardFrame.appendChild(metaCard);
            setHorizontalSizing(metaCard, 'FILL');
            setVerticalSizing(metaCard, 'HUG');
            let aiDesc = null;
            if (aiGeneratedDescription) {
                try {
                    aiDesc = JSON.parse(aiGeneratedDescription);
                }
                catch (e) {
                    console.error('Failed to parse AI description:', e);
                }
            }
            const createDescriptionText = (content, isHeader = false) => {
                const textNode = mg.createText();
                textNode.name = isHeader ? "Component Name Line" : "Info Text Paragraph";
                textNode.characters = content;
                setTextFontSize(textNode, isHeader ? 14 : 13);
                setTextFontName(textNode, { family: "Inter", style: isHeader ? "Semi Bold" : "Regular" });
                textNode.fills = [solidPaint(isHeader ? themeText : themeMuted)];
                metaCard.appendChild(textNode);
                setHorizontalSizing(textNode, 'FILL');
                setVerticalSizing(textNode, 'HUG');
                textNode.textAutoResize = "HEIGHT";
            };
            const englishTitle = formatTitle(componentSet.name, 'en');
            const nameVal = (aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.componentName) ? aiDesc.componentName : (language === 'zh' ? `${titleText} / ${englishTitle}` : `${englishTitle} / ${titleText}`);
            createDescriptionText(language === 'zh' ? `组件名称：${nameVal}` : `Component: ${nameVal}`, true);
            const usageVal = (aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.usage) ? aiDesc.usage : (language === 'zh' ? `请根据组件的实际用途补充使用场景；未使用 AI 生成说明。` : `Add usage guidance for this component. No AI description was generated.`);
            createDescriptionText(language === 'zh' ? `适用场景：${usageVal}` : `Usage: ${usageVal}`);
            const propsVal = (aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.properties) ? aiDesc.properties : (language === 'zh' ? `包含 ${properties.length} 个可配置属性（${properties.join('、')}），每个属性控制组件的不同视觉状态或功能变体。` : `Contains ${properties.length} configurable properties (${properties.join(', ')}).`);
            createDescriptionText(language === 'zh' ? `属性说明：${propsVal}` : `Properties: ${propsVal}`);
            // --- Tags 标签行 ---
            const tagsContainer = mg.createFrame();
            tagsContainer.name = "Meta Tags Row";
            tagsContainer.flexMode = "HORIZONTAL";
            tagsContainer.itemSpacing = 8;
            metaCard.appendChild(tagsContainer);
            setHorizontalSizing(tagsContainer, 'FILL');
            setVerticalSizing(tagsContainer, 'HUG');
            const createTag = (label, value, bgColor, textColor) => {
                const tag = mg.createFrame();
                tag.name = `Tag: ${label}`;
                tag.flexMode = "HORIZONTAL";
                tag.paddingLeft = 8;
                tag.paddingRight = 8;
                tag.paddingTop = 4;
                tag.paddingBottom = 4;
                safeCornerRadius(tag, 4);
                tag.fills = [solidPaint(bgColor)];
                const tagText = mg.createText();
                tagText.name = "Tag Label";
                tagText.characters = `${label}: ${value}`;
                setTextFontSize(tagText, 11);
                setTextFontName(tagText, { family: "Inter", style: "Medium" });
                tagText.fills = [solidPaint(textColor)];
                tag.appendChild(tagText);
                tagsContainer.appendChild(tag);
                setHorizontalSizing(tag, 'HUG');
                setVerticalSizing(tag, 'HUG');
            };
            createTag(language === 'zh' ? '变体数量' : 'Variants', `${variants.length}`, { r: 243 / 255, g: 244 / 255, b: 246 / 255 }, { r: 55 / 255, g: 65 / 255, b: 81 / 255 });
            const now = new Date();
            const dateStr = language === 'zh'
                ? `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`
                : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            createTag(language === 'zh' ? '更新日期' : 'Updated', dateStr, { r: 243 / 255, g: 244 / 255, b: 246 / 255 }, { r: 55 / 255, g: 65 / 255, b: 81 / 255 });
            if (designer)
                createTag(language === 'zh' ? '设计者' : 'Designer', designer, { r: 239 / 255, g: 246 / 255, b: 255 / 255 }, { r: 37 / 255, g: 99 / 255, b: 235 / 255 });
            if (usagePage)
                createTag(language === 'zh' ? '使用页面' : 'Usage', usagePage, { r: 254 / 255, g: 243 / 255, b: 199 / 255 }, { r: 146 / 255, g: 113 / 255, b: 24 / 255 });
            // --- 分割线 (修复：确保高度在自动布局中固定为 1px，避免被拉高) ---
            const divider = mg.createLine();
            divider.name = "Section Divider Line";
            boardFrame.appendChild(divider);
            setHorizontalSizing(divider, 'FILL');
            setVerticalSizing(divider, 'FIXED');
            divider.strokeWeight = 1;
            divider.strokes = [solidPaint({ r: 27 / 255, g: 43 / 255, b: 75 / 255 }, 0.2)];
            // --- 【视觉重构】变体舞台区 (Matrix Stage) ---
            const matrixStage = mg.createFrame();
            matrixStage.name = "Matrix Stage";
            matrixStage.flexMode = "VERTICAL";
            matrixStage.paddingLeft = 0;
            matrixStage.paddingRight = 0;
            matrixStage.paddingTop = 0;
            matrixStage.paddingBottom = 0;
            safeCornerRadius(matrixStage, 12);
            matrixStage.fills = [solidPaint(themeSurface)];
            matrixStage.strokes = [solidPaint(themeBorder)];
            matrixStage.crossAxisAlignItems = "FLEX_START";
            boardFrame.appendChild(matrixStage);
            setHorizontalSizing(matrixStage, 'FILL');
            setVerticalSizing(matrixStage, 'HUG');
            // 矩阵绘制区域（绝对定位容器置于舞台中央）
            const componentArea = mg.createFrame();
            componentArea.name = "Component Draw Area";
            componentArea.flexMode = "NONE";
            componentArea.fills = [];
            matrixStage.appendChild(componentArea);
            const areaWidth = compSetWidth + (drawLabels && hasY ? 120 : 0);
            const areaHeight = compSetHeight + (drawLabels ? 60 : 0);
            setHorizontalSizing(componentArea, 'FIXED');
            setVerticalSizing(componentArea, 'FIXED');
            componentArea.resize(areaWidth, areaHeight);
            // 将组件集安置于有偏移的精确定位上，防止裁剪行/列标签
            componentArea.appendChild(componentSet);
            componentSet.x = (drawLabels && hasY) ? 120 : 0;
            componentSet.y = drawLabels ? 40 : 0;
            // 绘制虚线网格和行列标签
            const matrixNodes = [];
            if (drawLabels) {
                xArray.forEach((xVal, index) => {
                    const label = mg.createText();
                    label.name = "X Axis Label";
                    label.characters = `${layout.x.join(" / ")}: ${xVal}`.toUpperCase();
                    setTextFontSize(label, 12);
                    setTextFontName(label, { family: "Inter", style: "Semi Bold" });
                    label.fills = [solidPaint({ r: 107 / 255, g: 114 / 255, b: 128 / 255 })];
                    label.x = componentSet.x + padding + layout.columnOffsets[index] + layout.columnWidths[index] / 2 - label.width / 2;
                    label.y = componentSet.y - 32;
                    componentArea.appendChild(label);
                    matrixNodes.push(label);
                });
            }
            groups.forEach((gSign, gIndex) => {
                const groupAbsoluteY = componentSet.y + padding + gIndex * (singleGroupHeight + groupGap);
                // 组标题（仅在多属性分组时显示）
                if (hasY && groupProps.length > 0 && drawLabels) {
                    const gTitle = mg.createText();
                    gTitle.name = "Group Title";
                    gTitle.characters = gSign.toUpperCase();
                    setTextFontSize(gTitle, 16);
                    setTextFontName(gTitle, { family: "Inter", style: "Bold" });
                    gTitle.fills = [solidPaint({ r: 75 / 255, g: 85 / 255, b: 99 / 255 })];
                    gTitle.x = componentSet.x - 90;
                    gTitle.y = groupAbsoluteY;
                    componentArea.appendChild(gTitle);
                    matrixNodes.push(gTitle);
                }
                // Y 轴标签（仅在二维布局时绘制）
                if (hasY && drawLabels) {
                    yArray.forEach((yVal, rowIndex) => {
                        const label = mg.createText();
                        label.name = "Y Axis Label";
                        label.characters = `${layout.y.join(" / ")}: ${yVal}`.toUpperCase();
                        setTextFontSize(label, 12);
                        setTextFontName(label, { family: "Inter", style: "Semi Bold" });
                        label.fills = [solidPaint({ r: 156 / 255, g: 163 / 255, b: 175 / 255 })];
                        label.x = componentSet.x - label.width - 24;
                        label.y = groupAbsoluteY + layout.rowOffsets[rowIndex] + layout.rowHeights[rowIndex] / 2 - label.height / 2;
                        componentArea.appendChild(label);
                        matrixNodes.push(label);
                    });
                }
                if (drawGrid) {
                    // 水平网格线（仅在二维布局时绘制）
                    if (hasY) {
                        for (let r = 1; r < yArray.length; r++) {
                            const line = mg.createLine();
                            line.resize(compSetWidth - padding * 2, 0);
                            line.x = componentSet.x + padding;
                            line.y = groupAbsoluteY + layout.rowOffsets[r] - gapY / 2;
                            line.strokeDashes = [4, 4];
                            line.strokeWeight = gridLineWidth;
                            line.strokes = [solidPaint(gridLineColor)];
                            componentArea.appendChild(line);
                            matrixNodes.push(line);
                        }
                    }
                    // 垂直网格线
                    for (let c = 1; c < xArray.length; c++) {
                        const lineHeight = singleGroupHeight;
                        const line = mg.createLine();
                        line.resize(lineHeight, 0);
                        line.rotation = -90;
                        line.x = componentSet.x + padding + layout.columnOffsets[c] - gapX / 2;
                        line.y = groupAbsoluteY;
                        line.strokeDashes = [4, 4];
                        line.strokeWeight = gridLineWidth;
                        line.strokes = [solidPaint(gridLineColor)];
                        componentArea.appendChild(line);
                        matrixNodes.push(line);
                    }
                }
            });
            if (matrixNodes.length > 0) {
                const matrixGroup = groupInParent(matrixNodes, componentArea);
                matrixGroup.name = "Matrix Decorations";
            }
            const describeVariantProperty = (prop, values) => {
                const key = prop.toLocaleLowerCase();
                const joined = values.slice(0, 6).join(language === 'zh' ? '、' : ', ');
                const semantic = /size|尺寸|scale/.test(key)
                    ? (language === 'zh' ? '控制组件的尺寸层级与使用密度。' : 'Controls component scale and interface density.')
                    : /state|status|状态|interaction/.test(key)
                        ? (language === 'zh' ? '描述组件在交互流程中的状态。' : 'Describes the component state in an interaction flow.')
                        : /theme|mode|主题|模式|appearance/.test(key)
                            ? (language === 'zh' ? '切换视觉主题或外观模式。' : 'Switches the visual theme or appearance mode.')
                            : /type|kind|variant|style|类型|样式/.test(key)
                                ? (language === 'zh' ? '区分组件的语义类型与视觉层级。' : 'Distinguishes semantic variants and visual hierarchy.')
                                : /icon|图标/.test(key)
                                    ? (language === 'zh' ? '控制图标内容、位置或显隐。' : 'Controls icon content, placement, or visibility.')
                                    : /direction|position|placement|align|方向|位置|对齐/.test(key)
                                        ? (language === 'zh' ? '控制内容方向、位置或对齐关系。' : 'Controls direction, placement, or alignment.')
                                        : (language === 'zh' ? '控制该组件的一组可复用表现。' : 'Controls a reusable aspect of the component.');
                return `${semantic}${joined ? (language === 'zh' ? ` 可选：${joined}。` : ` Options: ${joined}.`) : ''}`;
            };
            // --- Properties 属性汇总面板（自动布局，完美自适应高度）---
            if (drawProps) {
                // 包装容器：标题 + 卡片作为一组
                const propsGroup = mg.createFrame();
                propsGroup.name = "Properties & Tokens Group";
                propsGroup.fills = [];
                propsGroup.flexMode = "VERTICAL";
                propsGroup.itemSpacing = 10;
                boardFrame.appendChild(propsGroup);
                setHorizontalSizing(propsGroup, 'FILL');
                setVerticalSizing(propsGroup, 'HUG');
                // 标题放在卡片外面
                const specTitle = mg.createText();
                specTitle.name = "Properties & Tokens Title";
                specTitle.characters = "Properties & Tokens";
                setTextFontSize(specTitle, 18);
                setTextFontName(specTitle, { family: "Inter", style: "Bold" });
                specTitle.fills = [solidPaint(themeText)];
                propsGroup.appendChild(specTitle);
                setHorizontalSizing(specTitle, 'FILL');
                setVerticalSizing(specTitle, 'HUG');
                const propsPanel = mg.createFrame();
                propsPanel.name = "Properties & Tokens Panel";
                propsPanel.flexMode = "VERTICAL";
                propsPanel.itemSpacing = 14;
                propsPanel.paddingLeft = 16;
                propsPanel.paddingRight = 16;
                propsPanel.paddingTop = 16;
                propsPanel.paddingBottom = 16;
                safeCornerRadius(propsPanel, 12);
                propsPanel.fills = [solidPaint(themeSurface)];
                propsPanel.strokes = [solidPaint(themeBorder)];
                propsGroup.appendChild(propsPanel);
                setHorizontalSizing(propsPanel, 'FILL');
                setVerticalSizing(propsPanel, 'HUG');
                properties.forEach(prop => {
                    var _a;
                    const vals = new Set();
                    variants.forEach(v => { const p = parseVariantName(v.name); if (p[prop])
                        vals.add(p[prop]); });
                    const propRow = mg.createFrame();
                    propRow.name = "Property Row";
                    propRow.flexMode = "VERTICAL";
                    propRow.itemSpacing = 5;
                    propsPanel.appendChild(propRow);
                    setHorizontalSizing(propRow, 'FILL');
                    setVerticalSizing(propRow, 'HUG');
                    const pName = mg.createText();
                    pName.name = "Property Name";
                    pName.characters = prop;
                    setTextFontSize(pName, 13);
                    setTextFontName(pName, { family: "Inter", style: "Semi Bold" });
                    pName.fills = [solidPaint(themeText)];
                    propRow.appendChild(pName);
                    setHorizontalSizing(pName, 'HUG');
                    setVerticalSizing(pName, 'HUG');
                    const semanticText = mg.createText();
                    semanticText.name = "Property Description";
                    semanticText.characters = ((_a = aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.propertyDescriptions) === null || _a === void 0 ? void 0 : _a[prop])
                        || describeVariantProperty(prop, Array.from(vals));
                    setTextFontSize(semanticText, 11);
                    setTextFontName(semanticText, { family: "Inter", style: "Regular" });
                    semanticText.fills = [solidPaint(themeMuted)];
                    propRow.appendChild(semanticText);
                    setHorizontalSizing(semanticText, 'FILL');
                    setVerticalSizing(semanticText, 'HUG');
                    semanticText.textAutoResize = "HEIGHT";
                    const valuesRow = mg.createFrame();
                    valuesRow.name = "Property Values";
                    valuesRow.flexMode = "HORIZONTAL";
                    valuesRow.itemSpacing = 6;
                    valuesRow.fills = [];
                    trySet(valuesRow, 'flexWrap', 'WRAP');
                    trySet(valuesRow, 'crossAxisSpacing', 6);
                    propRow.appendChild(valuesRow);
                    setHorizontalSizing(valuesRow, 'FILL');
                    setVerticalSizing(valuesRow, 'HUG');
                    Array.from(vals).forEach(val => {
                        const pill = mg.createFrame();
                        pill.flexMode = "HORIZONTAL";
                        safeCornerRadius(pill, 6);
                        pill.fills = [solidPaint(isDark ? { r: 55 / 255, g: 65 / 255, b: 81 / 255 } : { r: 243 / 255, g: 244 / 255, b: 246 / 255 })];
                        pill.strokes = [solidPaint(themeBorder)];
                        pill.paddingLeft = 8;
                        pill.paddingRight = 8;
                        pill.paddingTop = 4;
                        pill.paddingBottom = 4;
                        const pVal = mg.createText();
                        pVal.characters = val;
                        setTextFontSize(pVal, 11);
                        setTextFontName(pVal, { family: "Inter", style: "Regular" });
                        pVal.fills = [solidPaint(themeText)];
                        pill.appendChild(pVal);
                        valuesRow.appendChild(pill);
                        setHorizontalSizing(pill, 'HUG');
                        setVerticalSizing(pill, 'HUG');
                        setHorizontalSizing(pVal, 'HUG');
                        setVerticalSizing(pVal, 'HUG');
                    });
                });
            }
            // --- Best Practices 使用指南卡片（自动布局，完美自适应）---
            if (drawUsage) {
                const usagePanel = mg.createFrame();
                usagePanel.name = "Best Practices Panel";
                usagePanel.fills = [];
                usagePanel.flexMode = "VERTICAL";
                usagePanel.itemSpacing = 10;
                boardFrame.appendChild(usagePanel);
                setHorizontalSizing(usagePanel, 'FILL');
                setVerticalSizing(usagePanel, 'HUG');
                const usageTitle = mg.createText();
                usageTitle.name = "Best Practices Title";
                usageTitle.characters = "Best Practices";
                setTextFontSize(usageTitle, 18);
                setTextFontName(usageTitle, { family: "Inter", style: "Bold" });
                usageTitle.fills = [solidPaint(themeText)];
                usagePanel.appendChild(usageTitle);
                setHorizontalSizing(usageTitle, 'FILL');
                setVerticalSizing(usageTitle, 'HUG');
                const doDontContainer = mg.createFrame();
                doDontContainer.name = "Do-Dont Container";
                doDontContainer.fills = [];
                doDontContainer.flexMode = "HORIZONTAL";
                doDontContainer.itemSpacing = 12;
                usagePanel.appendChild(doDontContainer);
                setHorizontalSizing(doDontContainer, 'FILL');
                setVerticalSizing(doDontContainer, 'HUG');
                // Do Card - 完美自适应高度
                const doCard = mg.createFrame();
                doCard.name = "Do Card";
                doCard.flexMode = "VERTICAL";
                doCard.itemSpacing = 0;
                safeCornerRadius(doCard, 12);
                doCard.fills = [solidPaint(themeSurface)];
                doCard.strokes = [solidPaint(themeBorder)];
                doCard.strokeWeight = 1;
                doDontContainer.appendChild(doCard);
                setHorizontalSizing(doCard, 'FILL');
                setVerticalSizing(doCard, 'HUG');
                const doTopBar = mg.createFrame();
                doTopBar.resize(100, 6);
                doTopBar.fills = [solidPaint({ r: 34 / 255, g: 197 / 255, b: 94 / 255 })];
                doCard.appendChild(doTopBar);
                setHorizontalSizing(doTopBar, 'FILL');
                setVerticalSizing(doTopBar, 'FIXED');
                const doContent = mg.createFrame();
                doContent.flexMode = "HORIZONTAL";
                doContent.itemSpacing = 12;
                doContent.paddingLeft = 16;
                doContent.paddingRight = 16;
                doContent.paddingTop = 14;
                doContent.paddingBottom = 16;
                doContent.fills = [];
                doCard.appendChild(doContent);
                setHorizontalSizing(doContent, 'FILL');
                setVerticalSizing(doContent, 'HUG');
                const doIcon = mg.createText();
                doIcon.characters = "✅";
                setTextFontSize(doIcon, 18);
                doContent.appendChild(doIcon);
                setHorizontalSizing(doIcon, 'HUG');
                setVerticalSizing(doIcon, 'HUG');
                const doText = mg.createText();
                doText.characters = (aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.do) || (language === 'zh'
                    ? `建议：在设计稿中通过 ${properties.slice(0, 2).join('、') || '组件属性'} 切换状态，保持实例与母版同步。`
                    : `Do: switch states with ${properties.slice(0, 2).join(', ') || 'component properties'} and keep instances linked to the master.`);
                setTextFontSize(doText, 12);
                setTextFontName(doText, { family: "Inter", style: "Medium" });
                doText.fills = [solidPaint(themeText)];
                doContent.appendChild(doText);
                setHorizontalSizing(doText, 'FILL');
                setVerticalSizing(doText, 'HUG');
                doText.textAutoResize = "HEIGHT";
                // Don't Card - 完美自适应高度
                const dontCard = mg.createFrame();
                dontCard.name = "Don't Card";
                dontCard.flexMode = "VERTICAL";
                dontCard.itemSpacing = 0;
                safeCornerRadius(dontCard, 12);
                dontCard.fills = [solidPaint(themeSurface)];
                dontCard.strokes = [solidPaint(themeBorder)];
                dontCard.strokeWeight = 1;
                doDontContainer.appendChild(dontCard);
                setHorizontalSizing(dontCard, 'FILL');
                setVerticalSizing(dontCard, 'HUG');
                const dontTopBar = mg.createFrame();
                dontTopBar.resize(100, 6);
                dontTopBar.fills = [solidPaint({ r: 239 / 255, g: 68 / 255, b: 68 / 255 })];
                dontCard.appendChild(dontTopBar);
                setHorizontalSizing(dontTopBar, 'FILL');
                setVerticalSizing(dontTopBar, 'FIXED');
                const dontContent = mg.createFrame();
                dontContent.flexMode = "HORIZONTAL";
                dontContent.itemSpacing = 12;
                dontContent.paddingLeft = 16;
                dontContent.paddingRight = 16;
                dontContent.paddingTop = 14;
                dontContent.paddingBottom = 16;
                dontContent.fills = [];
                dontCard.appendChild(dontContent);
                setHorizontalSizing(dontContent, 'FILL');
                setVerticalSizing(dontContent, 'HUG');
                const dontIcon = mg.createText();
                dontIcon.characters = "🚫";
                setTextFontSize(dontIcon, 18);
                dontContent.appendChild(dontIcon);
                setHorizontalSizing(dontIcon, 'HUG');
                setVerticalSizing(dontIcon, 'HUG');
                const dontText = mg.createText();
                dontText.characters = (aiDesc === null || aiDesc === void 0 ? void 0 : aiDesc.dont) || (language === 'zh'
                    ? '避免解绑实例后手工复制状态，也不要用重复的属性值表达同一种语义。'
                    : 'Avoid detaching instances to copy states, and do not use duplicate property values for the same meaning.');
                setTextFontSize(dontText, 12);
                setTextFontName(dontText, { family: "Inter", style: "Medium" });
                dontText.fills = [solidPaint(themeText)];
                dontContent.appendChild(dontText);
                setHorizontalSizing(dontText, 'FILL');
                setVerticalSizing(dontText, 'HUG');
                dontText.textAutoResize = "HEIGHT";
            }
            // ====== 【核心修复】启用高度自适应 HUG (在此之后严禁再调用 resize(..., height)) ======
            setVerticalSizing(boardFrame, 'HUG');
            // 组件集直接挂在最外层说明书画板下，装饰区保留原尺寸作为布局占位。
            const componentBounds = componentSet.absoluteBoundingBox;
            const boardBounds = boardFrame.absoluteBoundingBox;
            if (componentBounds && boardBounds) {
                boardFrame.appendChild(componentSet);
                trySet(componentSet, 'layoutPositioning', 'ABSOLUTE');
                componentSet.x = componentBounds.x - boardBounds.x;
                componentSet.y = componentBounds.y - boardBounds.y;
            }
            mg.document.currentPage.selection = [boardFrame];
            if (oldBoard && !oldBoard.removed && !LayerRules.walk(oldBoard.children).some(n => n.type === 'COMPONENT_SET'))
                oldBoard.remove();
            mg.viewport.scrollAndZoomIntoView([boardFrame]);
            notifyInUiLanguage("✅ 说明书生成完毕！");
            mg.commitUndo();
            break;
        }
    }
};
// -------------------------------------------------------------
// 【新增】高级命名转换函数 (支持 格式+分隔符+大小写 组合)
// -------------------------------------------------------------
// --- PPT 工具辅助函数 ---
// 获取用户选中的 Frame (ID去重版)
function getSlides() {
    const selection = mg.document.currentPage.selection;
    const uniqueMap = new Map();
    // 1. 只找选中的 Frame
    for (const node of selection) {
        if (node.type === 'FRAME') {
            uniqueMap.set(node.id, node);
        }
    }
    const frames = Array.from(uniqueMap.values());
    // 2. 简单的嵌套过滤 (防止选了画板又选了里面的按钮)
    // 如果一个 Frame 的父级也在选中列表里，那它就是子元素，删掉
    const finalSlides = frames.filter(node => {
        let parent = node.parent;
        while (parent && parent.type !== 'PAGE' && parent.type !== 'DOCUMENT') {
            if (uniqueMap.has(parent.id))
                return false;
            parent = parent.parent;
        }
        return true;
    });
    return finalSlides;
}
// Step 1: 初始化 (解锁、解组实例、移除隐藏)
// Step 1: 初始化 (防崩溃稳健版)
// 将 "解绑" 和 "清理" 分离，彻底解决 WASM 内存越界问题
async function pptStep1_Init(slides) {
    // === 阶段一：暴力解绑 (Iterative Detach) ===
    // 只要还有 Instance，就一直循环处理，直到解绑干净
    for (const slide of slides) {
        let loopCount = 0;
        // 初次扫描
        let instances = slide.findAll(n => n.type === 'INSTANCE');
        while (instances.length > 0) {
            // 安全熔断机制：防止极个别情况下的死循环
            loopCount++;
            if (loopCount > 5000) {
                console.warn("解绑层级过深，强制跳出");
                break;
            }
            // 取出列表里的第一个实例
            const target = instances[0];
            try {
                // 执行解绑
                // 注意：解绑后，target 这个变量就“死”了，不能再访问它的属性
                target.detachInstance();
            }
            catch (e) {
                console.warn("解绑单个节点失败:", e);
            }
            // === 关键点 ===
            // 解绑一个后，整个图层树结构变了，之前的 instances 数组里的引用全都失效了
            // 必须立刻重新扫描，获取最新的列表
            instances = slide.findAll(n => n.type === 'INSTANCE');
        }
    }
    // === 阶段二：常规清洗 (Cleanup) ===
    // 此时图层树里已经没有 Instance 了，结构非常稳定，可以安全递归
    const traverse = (node) => {
        // 防御性检查
        if (node.removed)
            return;
        // === 新增：黑盒保护 ===
        // 如果名字以 p_img 开头，视为用户指定的整体图标，不清洗内部，直接跳过子级遍历
        if (node.name.toLowerCase().startsWith('p_img')) {
            return;
        }
        // 1. 解锁
        if (node.isLocked) {
            node.isLocked = false;
        }
        // 2. 移除隐藏图层
        if (!node.isVisible) {
            node.remove();
            return; // 删了就不用看子级了
        }
        // 3. 移除 AutoLayout
        if (node.type === 'FRAME' && node.flexMode !== 'NONE') {
            node.flexMode = 'NONE';
        }
        // 4. 递归子级
        if ('children' in node) {
            // 浅拷贝 children，避免遍历时的索引干扰
            [...node.children].forEach(child => traverse(child));
        }
    };
    // 对所有 Slide 执行清洗
    slides.forEach(slide => traverse(slide));
    // 通知 UI 完成
    sendToUI({ type: 'step-done', step: 1 });
}
// Step 2: 智能栅格化 (性能优化 + Hex ID)
async function pptStep2_Rasterize(slides) {
    let count = 0;
    // 生成短 ID
    const generateHexId = () => 'p_' + Math.random().toString(16).substring(2, 8);
    const isLineLike = (node) => {
        if (node.type === 'LINE')
            return true;
        if (node.type === 'PEN') {
            if (node.width < 2 || node.height < 2)
                return true;
            const ratio = node.width / node.height;
            if (ratio > 50 || ratio < 0.02)
                return true;
        }
        return false;
    };
    const traverse = async (node) => {
        var _a;
        if (node.removed || !node.isVisible)
            return;
        const name = node.name.toLowerCase();
        const isUserTarget = name.startsWith('p_img');
        let isTechTarget = false;
        if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.isVisible))
            isTechTarget = true;
        else if (node.type === 'BOOLEAN_OPERATION')
            isTechTarget = true;
        else if (node.type === 'PEN' && !isLineLike(node))
            isTechTarget = true;
        else if (node.type === 'ELLIPSE' && 'fills' in node && node.fills.some(p => p.type === 'IMAGE'))
            isTechTarget = true;
        if (isUserTarget || isTechTarget) {
            try {
                const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 3 } });
                const image = await mg.createImage(bytes);
                const rect = mg.createRectangle();
                rect.x = node.x;
                rect.y = node.y;
                rect.resize(node.width, node.height);
                // === 使用 Hex ID 重命名 ===
                rect.name = generateHexId();
                rect.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageRef: image.href }];
                rect.rotation = Number(node.rotation || 0);
                (_a = node.parent) === null || _a === void 0 ? void 0 : _a.insertChild(node.parent.children.indexOf(node), rect);
                node.remove();
                count++;
                return;
            }
            catch (e) { }
        }
        if ('children' in node) {
            const children = [...node.children];
            for (const child of children)
                await traverse(child);
        }
    };
    for (const slide of slides)
        await traverse(slide);
    sendToUI({ type: 'step-done', step: 2 });
}
// Step 3: 深度扁平化 (修复混合属性导致的崩溃)
async function pptStep3_Flatten(slides) {
    for (const slide of slides) {
        let hasNested = true;
        let loopCount = 0; // 防止死循环保险丝
        while (hasNested) {
            hasNested = false;
            loopCount++;
            // 如果层级太深(超过2000次循环)，强制休息一下，防止浏览器卡死
            if (loopCount % 100 === 0) {
                await new Promise(r => setTimeout(r, 20));
            }
            const children = slide.children;
            // 倒序遍历
            // 倒序遍历
            for (let i = children.length - 1; i >= 0; i--) {
                const node = children[i];
                // 1. === 新增：垃圾清理 (针对普通形状) ===
                // 如果不是容器(Group/Frame)，且视觉不可见，直接删除
                if (node.type !== 'GROUP' && node.type !== 'FRAME' && isNodeInvisible(node)) {
                    node.remove();
                    continue;
                }
                // 情况 A: Group -> 直接解散
                if (node.type === 'GROUP') {
                    ungroupNode(node);
                    hasNested = true;
                }
                // 情况 B: Frame -> 转换为背景矩形(如需要) + 解散
                else if (node.type === 'FRAME') {
                    try {
                        // 2. === 修改：判断是否生成背景 ===
                        // 使用 isNodeInvisible 判断：如果不透明且有填充/描边，才生成背景矩形
                        // 如果是透明容器，则跳过此步，直接进入下面的 ungroup
                        if (!isNodeInvisible(node)) {
                            const rect = mg.createRectangle();
                            rect.x = node.x;
                            rect.y = node.y;
                            rect.resize(node.width, node.height);
                            // 复制样式
                            rect.fills = node.fills;
                            rect.strokes = node.strokes;
                            // 安全复制粗细
                            rect.strokeWeight = node.strokeWeight;
                            // 安全复制圆角
                            if (typeof node.cornerRadius === 'number')
                                safeCornerRadius(rect, node.cornerRadius);
                            else
                                safeCornerRadius(rect, 0);
                            // 复制特效
                            rect.effects = node.effects;
                            // 复制透明度
                            rect.opacity = node.opacity;
                            // === 关键修复：复制旋转角度 ===
                            rect.rotation = node.rotation;
                            // 将矩形插入到 Frame 所在位置
                            node.parent.insertChild(i, rect);
                        }
                        // 3. 处理子元素 (核心扁平化逻辑)
                        if (node.children.length > 0) {
                            ungroupNode(node);
                            hasNested = true; // 结构变了，标记需要继续循环
                        }
                        else {
                            node.remove(); // 空 Frame 删掉
                        }
                    }
                    catch (err) {
                        console.error("Layer flatten error:", err);
                        // 容错：出错了也尝试解开，防止死循环
                        if (node.children.length > 0) {
                            ungroupNode(node);
                            hasNested = true;
                        }
                        else {
                            node.remove();
                        }
                    }
                }
            }
        }
        // 文本宽度修正 (保持原有逻辑)
        for (const node of slide.children) {
            if (node.type === 'TEXT' && node.isVisible) {
                try {
                    await loadTextFonts(node);
                    node.textAutoResize = "HEIGHT";
                    node.resize(node.width + 10, node.height);
                }
                catch (e) { }
            }
        }
    }
    sendToUI({ type: 'step-done', step: 3 });
}
// Step 4: 提取结构 (高性能优化版：大批次 + 零丢弃)
async function pptStep4_Extract(slides) {
    var _a, _b;
    // 辅助函数定义
    const rgbToHex = (color) => {
        const toHex = (v) => {
            const hex = Math.round(v * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return toHex(color.r) + toHex(color.g) + toHex(color.b);
    };
    // 通知前端总数
    sendToUI({ type: 'ppt-init-total', count: slides.length });
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        // 强制休息，释放上一页内存
        await new Promise(r => setTimeout(r, 50));
        const slideAbs = slide.absoluteBoundingBox;
        const slideX = slideAbs ? slideAbs.x : slide.x;
        const slideY = slideAbs ? slideAbs.y : slide.y;
        sendToUI({
            type: 'ppt-start-slide', index: i, width: slide.width, height: slide.height
        });
        let chunkBuffer = [];
        const children = slide.children;
        // 已移除 imgCounter，不再需要
        for (let j = 0; j < children.length; j++) {
            const node = children[j];
            // 1. 基础过滤：只过滤不可见图层，保留所有尺寸的元素
            if (!node.isVisible)
                continue;
            // 2. 获取位置：如果获取失败则跳过
            const nodeAbs = node.absoluteBoundingBox;
            if (!nodeAbs)
                continue;
            // 3. 计算相对中心点
            const centerX = (nodeAbs.x + nodeAbs.width / 2) - slideX;
            const centerY = (nodeAbs.y + nodeAbs.height / 2) - slideY;
            const el = {
                cx: centerX, cy: centerY, w: node.width, h: node.height, rotation: Number(node.rotation || 0)
            };
            if ('opacity' in node)
                el.opacity = node.opacity;
            if ('cornerRadius' in node && node.cornerRadius !== mg.mixed)
                el.cornerRadius = node.cornerRadius;
            try {
                // --- 样式提取 ---
                if ('strokes' in node && node.strokes.length > 0) {
                    const stroke = node.strokes.find((s) => s.type === 'SOLID' && s.isVisible !== false && s.color.a > 0);
                    if (stroke) {
                        el.strokeColor = rgbToHex(stroke.color);
                        el.strokeWeight = node.strokeWeight;
                        el.strokeAlpha = ((_a = el.opacity) !== null && _a !== void 0 ? _a : 1) * stroke.color.a;
                    }
                }
                if ('effects' in node && node.effects.length > 0) {
                    const shadow = node.effects.find(e => e.type === 'DROP_SHADOW' && e.isVisible);
                    if (shadow) {
                        el.shadow = {
                            color: rgbToHex(shadow.color),
                            opacity: shadow.color.a,
                            blur: shadow.radius,
                            x: shadow.offset.x,
                            y: shadow.offset.y
                        };
                    }
                }
                let visibleFill = null;
                if ('fills' in node && node.fills.length > 0) {
                    visibleFill = node.fills.find((f) => f.type === 'SOLID' && f.isVisible !== false && f.color.a > 0);
                }
                if (visibleFill) {
                    el.color = rgbToHex(visibleFill.color);
                    el.fillAlpha = ((_b = el.opacity) !== null && _b !== void 0 ? _b : 1) * visibleFill.color.a;
                }
                else {
                    el.color = null;
                    el.fillAlpha = 0;
                }
                // --- 类型分类 ---
                // A. 直线 & 连接线 (以及看起来像线的 Vector)
                const isLineLike = (node.type === 'LINE' || node.type === 'CONNECTOR');
                if (isLineLike) {
                    el.type = 'line';
                    if ('strokeDashes' in node && node.strokeDashes.length > 0)
                        el.strokeDashes = node.strokeDashes;
                    const arrowCaps = ['LINE_ARROW', 'TRIANGLE_ARROW', 'ROUND_ARROW', 'RING', 'DIAMOND'];
                    const startCap = node.type === 'CONNECTOR' ? node.connectorStartStrokeCap : node.leftStrokeCap;
                    const endCap = node.type === 'CONNECTOR' ? node.connectorEndStrokeCap : node.rightStrokeCap;
                    if (arrowCaps.includes(startCap))
                        el.headArrow = 'triangle';
                    if (arrowCaps.includes(endCap))
                        el.tailArrow = 'triangle';
                    // 必须要有一条可见的描边，否则跳过
                    if (!el.strokeColor)
                        continue;
                    chunkBuffer.push(el);
                }
                // B. 文本
                else if (node.type === 'TEXT') {
                    el.type = 'text';
                    el.text = node.characters.substring(0, 2000);
                    // --- 1. 强制获取基准字号 ---
                    const baseSize = getTextFontSize(node);
                    el.fontSize = baseSize;
                    // --- 2. 强制获取基准行高 (核心修复) ---
                    // 无论是否混合，都尝试获取具体的行高对象
                    const lh = getTextLineHeight(node);
                    // --- 3. 计算绝对像素值 ---
                    // 默认 Auto = 1.3 倍
                    let finalPx = baseSize * 1.3;
                    if (lh.unit === 'PIXELS') {
                        finalPx = lh.value;
                    }
                    else if (lh.unit === 'PERCENT') {
                        finalPx = baseSize * (lh.value / 100);
                    }
                    // 存入变量
                    el.lineHeightPx = finalPx;
                    // 4. 其他属性
                    const fontName = getTextFontName(node);
                    if (fontName) {
                        el.fontFace = fontName.family;
                        const style = fontName.style.toLowerCase();
                        if (/bold|heavy|black|strong/.test(style))
                            el.isBold = true;
                    }
                    // 4. 判定多行 (逻辑保持不变，但要存入 el)
                    let isMultiLine = node.characters.includes('\n');
                    // 如果没有换行符，但高度超过 1.5 倍字号，也视为多行（折行）
                    if (!isMultiLine && node.height > baseSize * 1.5)
                        isMultiLine = true;
                    el.isMultiLine = isMultiLine;
                    // 5. 获取水平对齐 (Horizontal Align)
                    if (node.textAlignHorizontal === 'CENTER')
                        el.align = 'center';
                    else if (node.textAlignHorizontal === 'RIGHT')
                        el.align = 'right';
                    else if (node.textAlignHorizontal === 'JUSTIFIED')
                        el.align = 'justify';
                    else
                        el.align = 'left'; // 默认左对齐
                    // 6. (可选) 获取垂直对齐，虽然你的需求是强制覆盖，但获取一下也没坏处
                    if (node.textAlignVertical === 'CENTER')
                        el.vAlignFigma = 'middle';
                    else if (node.textAlignVertical === 'BOTTOM')
                        el.vAlignFigma = 'bottom';
                    else
                        el.vAlignFigma = 'top';
                    if (!visibleFill)
                        el.fillAlpha = el.opacity || 1;
                    chunkBuffer.push(el);
                }
                // C. 占位符 (图片)
                else if (node.type === 'RECTANGLE' && node.fills.length > 0 && node.fills.some(p => p.type === 'IMAGE' && p.isVisible !== false)) {
                    el.type = 'placeholder';
                    // 直接使用图层名 (p_xxxxxx)
                    el.imageName = node.name;
                    el.fillAlpha = el.opacity || 1;
                    chunkBuffer.push(el);
                }
                // D. 形状 (矩形、圆、星形、多边形) - 排除 LINE/CONNECTOR
                else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' ||
                    node.type === 'PEN' || node.type === 'STAR' ||
                    node.type === 'POLYGON' || node.type === 'BOOLEAN_OPERATION') {
                    el.type = 'shape';
                    el.pptShape = 'rect'; // 默认
                    if (node.type === 'ELLIPSE')
                        el.pptShape = 'ellipse';
                    else if (node.type === 'STAR') {
                        const c = node.pointCount;
                        if (c >= 4 && c <= 32)
                            el.pptShape = 'star' + c;
                        else
                            el.pptShape = 'star5';
                    }
                    else if (node.type === 'POLYGON') {
                        const c = node.pointCount;
                        if (c === 3)
                            el.pptShape = 'triangle';
                        else if (c === 5)
                            el.pptShape = 'pentagon';
                        else if (c === 6)
                            el.pptShape = 'hexagon';
                        else if (c === 8)
                            el.pptShape = 'octagon';
                    }
                    if (!el.color && !el.strokeColor)
                        continue;
                    chunkBuffer.push(el);
                }
                // === 性能优化：加大批次到 200 ===
                if (chunkBuffer.length >= 200) {
                    sendToUI({ type: 'ppt-element-batch', data: chunkBuffer });
                    chunkBuffer = [];
                    // 强制休息 15ms，让 UI 线程有机会渲染 Loading 动画
                    await new Promise(r => setTimeout(r, 15));
                }
            }
            catch (err) {
                // 静默失败，不打印 log
            }
        }
        if (chunkBuffer.length > 0) {
            sendToUI({ type: 'ppt-element-batch', data: chunkBuffer });
        }
        sendToUI({ type: 'ppt-end-slide' });
    }
    sendToUI({ type: 'step-done', step: 4, data: { done: true } });
}
// Step 5: 导出资源 (Hex ID 版)
async function pptStep5_ExportImages(slides) {
    sendToUI({ type: 'ppt-asset-start', totalSlides: slides.length });
    let imgCount = 0;
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const children = slide.children;
        for (let j = 0; j < children.length; j++) {
            const node = children[j];
            if (!node.isVisible)
                continue;
            let isTarget = false;
            if ('effects' in node && node.effects.some(e => e.type === 'LAYER_BLUR' && e.isVisible))
                isTarget = true;
            if (!isTarget && node.type === 'RECTANGLE' && node.fills.some(p => p.type === 'IMAGE'))
                isTarget = true;
            if (isTarget) {
                await new Promise(r => setTimeout(r, 50));
                try {
                    const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 1.5 } });
                    // 使用 ID 命名
                    const fileName = `${node.name}.png`;
                    sendToUI({ type: 'ppt-asset-chunk', fileName: fileName, data: bytes });
                    imgCount++;
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    }
    sendToUI({ type: 'step-done', step: 5, data: { count: imgCount } });
}
// 辅助：RGB 转 Hex
function rgbToHex(color) {
    const toHex = (v) => {
        const hex = Math.round(v * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return toHex(color.r) + toHex(color.g) + toHex(color.b);
}
// 判断节点是否“视觉不可见” (无有效填充且无有效描边，或全局隐藏/全透)
function isNodeInvisible(node) {
    // 1. 全局检查：被隐藏 或 透明度为0
    if (!node.isVisible)
        return true;
    if ('opacity' in node && node.opacity === 0)
        return true;
    // 2. 文本特殊处理：无内容即不可见
    if (node.type === 'TEXT' && node.characters.trim().length === 0)
        return true;
    // 3. 样式检查：针对有 fills/strokes 的节点
    if ('fills' in node && 'strokes' in node) {
        // 有效填充：存在 + 可见 + 不透明
        const hasFill = node.fills.length > 0 &&
            node.fills.some(p => p.isVisible !== false && paintAlpha(p) > 0);
        // 有效描边：存在 + 粗细>0 + 可见 + 不透明
        const hasStroke = node.strokes.length > 0 &&
            node.strokeWeight > 0 &&
            node.strokes.some(p => p.isVisible !== false && paintAlpha(p) > 0);
        // 如果既无有效填充，也无有效描边 -> 视为不可见 (忽略特效)
        if (!hasFill && !hasStroke)
            return true;
    }
    // 其他情况（如 Group/Frame/Slice）暂时视为可见，交给后续逻辑处理
    return false;
}
// 辅助：按视觉位置排序 (Z字形：先上后下，同行先左后右)
function sortNodesByVisualPosition(nodes) {
    return nodes.sort((a, b) => {
        // 获取绝对坐标 (降级处理：如果没有绝对坐标，用相对坐标兜底)
        const aAbs = a.absoluteBoundingBox || { x: a.x, y: a.y };
        const bAbs = b.absoluteBoundingBox || { x: b.x, y: b.y };
        // 1. 先判断 Y 轴 (行)
        // 容差设为 50px，只要高度差在 50px 以内，视为同一行
        if (Math.abs(aAbs.y - bAbs.y) > 50) {
            return aAbs.y - bAbs.y; // 谁 y 小谁在上面
        }
        // 2. 同一行，判断 X 轴 (列)
        return aAbs.x - bAbs.x; // 谁 x 小谁在左边
    });
}
// 辅助函数：将 "Size=Small, State=Hover" 解析为 { Size: 'Small', State: 'Hover' }
function parseVariantName(name) {
    const result = {};
    const parts = name.split(',');
    parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    });
    return result;
}
installPluginBookmarkQueue(mg.ui);
