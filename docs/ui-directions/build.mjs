import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'shared/tabler-icons.json'), 'utf8'));

const body = name => (catalog.icons[name]?.body || catalog.icons.circle.body).replace(/stroke-width="2"/g, 'stroke-width="1.6"');
const ic = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body(name)}</svg>`;

const NAV = [
  { label: '', items: [
    ['simple', '简易工具', 'bolt'],
    ['select', '超级选择', 'search'],
    ['text', '文字替换', 'replace'],
    ['smartFill', '智能填充', 'forms'],
    ['jumpback', '时空信标', 'map-pin'],
    ['size', '尺寸助手', 'ruler-measure-2']
  ] },
  { label: '组件与图层', items: [
    ['refiner', '组件清洗', 'diamond'],
    ['componentBuilder', '组件构建', 'components'],
    ['layerNaming', '图层命名', 'tag'],
    ['duplicate', '图层查重', 'copy'],
    ['compkit', 'CompKit', 'palette']
  ] },
  { label: '设计拓展', items: [
    ['i18n', '语言切换', 'language'],
    ['skew', '等轴形变', 'transform'],
    ['ppt', '导出 PPT', 'presentation'],
    ['theory', '设计理论', 'book']
  ] }
];

const TOOLS = [
  ['实例逆向', 'components'], ['矩形转画板', 'frame'], ['画板转矩形', 'square'], ['拆分文本', 'scissors'],
  ['合并文本', 'link'], ['移除自动布局', 'layout-off'], ['包裹自动布局', 'layout-grid'], ['上移一层', 'arrow-up'],
  ['移至顶层', 'arrows-up'], ['解散所有编组', 'box'], ['解锁所有图层', 'lock-open'], ['互换填充描边', 'arrows-exchange'],
  ['还原图片比例', 'aspect-ratio'], ['按位置排序', 'eye'], ['名称排序', 'sort-ascending-letters'], ['按文本命名', 'tag'],
  ['分离组件实例', 'unlink'], ['删除隐藏图层', 'eye-off'], ['像素对齐', 'focus-2'], ['交换图层位置', 'arrows-shuffle'],
  ['创建本地样式', 'sparkles'], ['重新关联样式', 'color-swatch']
];


const TOOL_GROUPS = [
  { label: '结构', tools: ['矩形转画板', '画板转矩形', '移除自动布局', '包裹自动布局', '上移一层', '移至顶层'] },
  { label: '图层', tools: ['实例逆向', '解散所有编组', '解锁所有图层', '分离组件实例', '删除隐藏图层', '交换图层位置'] },
  { label: '样式', tools: ['互换填充描边', '还原图片比例', '像素对齐', '创建本地样式', '重新关联样式'] },
  { label: '文本', tools: ['拆分文本', '合并文本', '按位置排序', '名称排序', '按文本命名'] }
];
const TOOL_ICON = new Map(TOOLS);
const groupItems = group => group.tools.map(name => [name, TOOL_ICON.get(name) || 'circle']);

const FIELDS = [
  ['姓名', ['中文', '英文']], ['地址', []], ['省市区', ['省', '市', '区']], ['街道', []],
  ['小区', []], ['数字', [], true], ['日期', [], true], ['时间', [], true],
  ['Email', []], ['身份证', []], ['公司名称', []], ['银行卡号', []],
  ['网站地址', ['去协议头', '长路径']], ['IP 地址', ['含端口']], ['手机型号', []], ['性别', ['男', '女']],
  ['网名', []], ['新闻标题', []]
];

const DEVICES = [
  ['iPhone 17 Pro', '6.3 英寸。460 ppi，三倍像素密度设计视口。', '402 × 874'],
  ['Samsung Galaxy S26 Ultra', '6.9 英寸 QHD+，适合大屏 Android 界面检查。', '480 × 1040'],
  ['Google Pixel 10 Pro', '6.3 英寸，20:9，使用 Material 布局时可同时验证 360dp。', '427 × 952'],
  ['Xiaomi 17 Ultra', '6.9 英寸。', '400 × 869']
];

function rail(active = 'simple') {
  const groups = NAV.map((group, gi) => {
    const label = group.label ? `<div class="rail-label">${group.label}</div>` : '';
    const links = group.items.map(([key, name, icon]) => `
      <div class="nav${key === active ? ' active' : ''}">
        <span class="nav-ic">${ic(icon)}</span><span class="nav-name">${name}</span>
      </div>`).join('');
    return label + links;
  }).join('');

  return `<aside class="rail">
    <div class="rail-scroll">${groups}</div>
    <div class="rail-foot">
      <div class="nav nav-foot"><span class="nav-ic">${ic('settings')}</span><span class="nav-name">设置</span></div>
      <div class="nav nav-foot"><span class="nav-ic">${ic('layout-sidebar-left-collapse')}</span><span class="nav-name">收起</span></div>
    </div>
  </aside>`;
}

function homeHead() {
  return `<div class="home-head">
    <div class="home-date">10月21日 · 周三</div>
    <div class="home-greet"><span class="greet-ic">${ic('moon')}</span><span>晚上好，今天也辛苦啦</span><span class="greet-mark">～</span></div>
  </div>`;
}

function home(dir) {
  if (dir === 'd') return homeD();
  if (dir === 'e') return homeE();
  if (dir === 'f') return homeF();

  if (dir === 'c') {
    const rows = TOOLS.map(([name, icon], i) => `
      <div class="idx">
        <span class="idx-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="idx-ic">${ic(icon)}</span>
        <span class="idx-name">${name}</span>
      </div>`).join('');
    return `<main class="content home home-c">
      ${homeHead()}
      <div class="index">${rows}</div>
    </main>`;
  }

  const tiles = TOOLS.map(([name, icon]) => `
    <div class="tool">
      <span class="plate">${ic(icon)}</span>
      <span class="tname">${name}</span>
    </div>`).join('');
  return `<main class="content home home-${dir}">
    ${homeHead()}
    <div class="tools">${tiles}</div>
  </main>`;
}

function homeD() {
  const cards = TOOL_GROUPS.map(group => {
    const rows = groupItems(group).map(([name, icon]) => `
      <div class="d-row"><span class="d-row-ic">${ic(icon)}</span><span class="d-row-name">${name}</span></div>`).join('');
    return `<section class="d-card">
      <div class="d-card-head"><span class="d-card-label">${group.label}</span><span class="d-card-count">${String(group.tools.length).padStart(2, '0')}</span></div>
      <div class="d-card-list">${rows}</div>
    </section>`;
  }).join('');
  return `<main class="content home home-d">${homeHead()}<div class="d-cards">${cards}</div></main>`;
}

function homeE() {
  const blocks = TOOL_GROUPS.map((group, i) => {
    const rows = groupItems(group).map(([name, icon]) => `
      <div class="e-row"><span class="e-row-ic">${ic(icon)}</span><span class="e-row-name">${name}</span></div>`).join('');
    return `<section class="e-block e-block-${i}">
      <div class="e-block-head"><span class="e-block-no">0${i + 1}</span><span class="e-block-label">${group.label}</span><span class="e-block-count">${String(group.tools.length).padStart(2, '0')}</span></div>
      <div class="e-block-list">${rows}</div>
    </section>`;
  }).join('');
  return `<main class="content home home-e">${homeHead()}<div class="e-blocks">${blocks}</div></main>`;
}

function homeF() {
  const keys = TOOLS.map(([name, icon]) => `
    <div class="f-key"><span class="f-key-well">${ic(icon)}</span><span class="f-key-name">${name}</span></div>`).join('');
  return `<main class="content home home-f">${homeHead()}<div class="f-keys">${keys}</div></main>`;
}

function fill(dir) {
  const fields = FIELDS.map(([name, opts, gear]) => `
    <div class="fld">
      <span class="fld-main"><span class="fld-name">${name}</span>${gear ? `<span class="fld-gear">${ic('settings')}</span>` : ''}</span>
      ${opts.length ? `<span class="fld-opts">${opts.map(opt => `<span>${opt}</span>`).join('')}</span>` : ''}
    </div>`).join('');

  return `<main class="content fill">
    <div class="fill-head">
      <p class="hint">选择文本或画板，点击字段填充</p>
      <div class="tabs"><span class="tab active">基础填充</span><span class="tab">AI 生成</span><span class="tab">自定义字段</span></div>
    </div>
    <div class="fill-list">${fields}</div>
    <div class="fill-foot">
      <span class="check"><i></i>前缀</span>
      <span class="check"><i></i>后缀</span>
      <span class="suffix">自定义字符</span>
      <span class="plus">${ic('plus')}</span>
    </div>
  </main>`;
}

function size(dir) {
  const rows = DEVICES.map(([name, meta, dim]) => `
    <div class="device">
      <span class="device-copy"><span class="device-name">${name}</span><span class="device-meta">${meta}</span></span>
      <span class="device-dim">${dim}</span>
    </div>`).join('');

  return `<main class="content size">
    <p class="hint">请先选择 Frame 或矩形</p>
    <div class="sec-label">目标尺寸</div>
    <div class="field-row">
      <label class="field"><span class="field-label">宽度 W</span><span class="input">402</span></label>
      <label class="field"><span class="field-label">高度 H</span><span class="input">874</span></label>
    </div>
    <div class="field-row">
      <label class="field"><span class="field-label">比例计算基准</span><span class="select">保持宽度${ic('chevron-down', 'chev')}</span></label>
      <label class="field"><span class="field-label">取整方式</span><span class="select">四舍五入${ic('chevron-down', 'chev')}</span></label>
    </div>
    <div class="checks">
      <span class="check checked"><i></i>锁定宽高比</span>
      <span class="check checked"><i></i>保持中心位置</span>
    </div>
    <div class="info">6.3 英寸。460 ppi，三倍像素密度设计视口。</div>
    <div class="tabs size-tabs"><span class="tab active">手机</span><span class="tab">平板 / 折叠</span><span class="tab">桌面屏幕</span><span class="tab">穿戴设备</span><span class="tab">经典比例</span></div>
    <div class="search-row"><span class="search">${ic('search')}搜索品牌、设备或比例</span><span class="select small">设计视口${ic('chevron-down', 'chev')}</span></div>
    <div class="devices">${rows}</div>
    <div class="size-foot"><span class="swap">${ic('arrows-exchange')}</span><span class="primary">批量设置所选尺寸</span></div>
  </main>`;
}

function screen(dir, kind, dark = false) {
  const active = kind === 'home' ? 'simple' : kind === 'fill' ? 'smartFill' : 'size';
  const content = kind === 'home' ? home(dir) : kind === 'fill' ? fill(dir) : size(dir);
  return `<div class="phone"><div class="app dir-${dir}${dark ? ' dark' : ''}">${rail(active)}${content}</div></div>`;
}

const DIRECTIONS = [
  {
    id: 'a', no: '01', name: '暗轨', en: 'DARK RAIL', accent: '#5B3DF0',
    thesis: '让深色轨道承担品牌与定位，工作区保持纸面般的安静。',
    keywords: ['双色框架', '精准信号', '仪器感'],
    tokens: [
      ['轨道', '#131217', '#131217'], ['工作区', '#FBFBFD', '#FBFBFD'], ['主信号', '#5B3DF0', '#5B3DF0'],
      ['文字', '#17151C', '#17151C'], ['分隔', '#ECEBF0', '#ECEBF0'], ['承台', '#F2F0F9', '#F2F0F9']
    ],
    changes: [
      '侧栏改为常暗轨道。当前项用 2px 紫条与深底定位，扫一眼就能确认位置。',
      '首页工具增加 26px 图标承台。静态全部保持单色，只有悬停才亮紫，减少常驻色彩噪音。',
      '面板统一为软底输入、细线分区。实心紫只留给主操作，状态不再靠浅紫块堆叠。'
    ],
    tradeoff: '深色轨道在浅色 Figma 中更抢眼。如果你希望插件完全融入画布、几乎不感到侧栏存在，选 B。',
    best: '想要强识别、常开深色 Figma、接受侧栏成为视觉锚点。',
    principle: '让深色只做框架，不进入内容；视线始终落在明亮的工作区。',
    spec: [
      ['字体', '18/26 问候 · 11/16 导航 · 10/15 提示 · 9 mono 数字'],
      ['圆角', '7 承台 · 5 控件 · 2 标签'],
      ['图标', 'Tabler 1.6px · 15–16px'],
      ['动效', '120ms 颜色 · 160ms 侧栏 · reduced-motion 关闭']
    ],
    dark: true
  },
  {
    id: 'b', no: '02', name: '白瓷', en: 'PORCELAIN', accent: '#5F35E8',
    thesis: '保留全白工作区，用一枚实心墨色当前项和一排浅紫承台建立秩序。',
    keywords: ['克制', '柔润', '高完成度'],
    tokens: [
      ['纸面', '#FFFFFF', '#FFFFFF'], ['当前项', '#1B1A20', '#1B1A20'], ['主信号', '#5F35E8', '#5F35E8'],
      ['正文', '#1B1A20', '#1B1A20'], ['柔面', '#F7F6F9', '#F7F6F9'], ['承台', '#F4F1FD', '#F4F1FD']
    ],
    changes: [
      '当前项改为实心墨块白字，其余入口完全安静。导航的“当前位置”不靠颜色，而靠明度。',
      '工具承台用很浅的紫，网格有节奏但不加边框。悬停时整块承台转为实心紫。',
      '标签页改为浮起的白色胶囊，输入使用无边框软底，面板比现在更柔、更有材质感。'
    ],
    tradeoff: '最接近现有紫色品牌与浅色习惯，迁移风险最低。个性弱于 A 和 C，惊喜感也更少。',
    best: '想稳妥升级、以浅色 Figma 为主、不希望侧栏变重。',
    principle: '当前位置只需要一个信号：明度。其余入口全部退后。',
    spec: [
      ['字体', '19/27 问候 · 11/16 导航 · 10/15 提示'],
      ['圆角', '9 承台 · 7 控件 · 2 标签'],
      ['图标', 'Tabler 1.6px · 15–16px'],
      ['材质', '浅紫承台 + 浮起白色胶囊 + 实心墨块当前项']
    ],
    dark: true
  },
  {
    id: 'c', no: '03', name: '索引', en: 'INDEX', accent: '#4A22D6',
    thesis: '把工具当目录排：编号、细线、两栏，界面几乎只剩字与线。',
    keywords: ['编辑感', '精确', '强排版'],
    tokens: [
      ['纸面', '#FCFCF9', '#FCFCF9'], ['墨色', '#131312', '#131312'], ['主信号', '#4A22D6', '#4A22D6'],
      ['正文', '#131312', '#131312'], ['细线', '#E8E7DF', '#E8E7DF'], ['软面', '#F3F2EB', '#F3F2EB']
    ],
    changes: [
      '首页改为两栏编号目录，22 个工具一屏排完。编号承担扫描定位，不承担装饰。',
      '侧栏当前项用 12px 紫色方块标记，不使用底色。分组标题退到 9px，信息层级更硬。',
      '面板去掉软底块，改用全宽细线与方形控件。层级靠字号和线，而不是容器。'
    ],
    tradeoff: '最有辨识度，但方形控件与编号会改变插件“手感”。需要确认你能接受更硬朗的工具气质。',
    best: '想要强烈设计主张、不介意更硬朗的界面、愿意把“目录感”作为产品性格。',
    principle: '编号与线负责定位，颜色只负责状态。',
    spec: [
      ['字体', '21/29 问候 · 11/16 导航 · 8 mono 编号'],
      ['圆角', '0–2，仅状态点保留圆形'],
      ['图标', 'Tabler 1.6px · 15px'],
      ['线', '1px 全宽分隔线替代容器底色']
    ],
    dark: true
  }
];

const DIRECTIONS2 = [
  {
    id: 'd', no: 'D', name: '卡片', en: 'CARDS', accent: '#5F35E8',
    thesis: '把 22 个工具收进四张任务卡，卡与卡之间留出清楚的呼吸；当前项是一枚实心墨色胶囊。',
    keywords: ['任务分组', '单层卡片', '呼吸感'],
    tokens: [
      ['画布', '#F4F3F0', '#F4F3F0'], ['卡面', '#FFFFFF', '#FFFFFF'], ['胶囊', '#1B1A1F', '#1B1A1F'],
      ['主信号', '#5F35E8', '#5F35E8'], ['分隔', '#E9E6E0', '#E9E6E0'], ['文字', '#1B1A1F', '#1B1A1F']
    ],
    changes: [
      '首页按任务收成四张卡：结构、图层、样式、文本。22 个工具仍然全部直接可见，不增加一级点击。',
      '当前项改成实心墨色胶囊，侧栏不再用浅紫底块；卡与卡之间只留 9px 呼吸。',
      '智能填充与尺寸助手收进一张单层面板卡；字段用软底行，不再在卡片里再套卡片。'
    ],
    tradeoff: '分组改变了原来的平铺顺序；卡片阴影必须很轻，否则会从“工作台”变成“卡片堆”。',
    best: '希望入口按任务分组、喜欢 macOS 设置式卡片与清楚边界的人。',
    principle: '卡片负责分组，不负责装饰。一层卡，够用。',
    spec: [
      ['字体', '19/27 问候 · 11/15 卡标题 · 11/34 卡片行'],
      ['圆角', '12 卡 · 8 字段 · 999 胶囊'],
      ['阴影', '0 1px 2px + 0 12px 24px -20px'],
      ['图标', 'Tabler 1.6px · 14–15px']
    ],
    dark: true
  },
  {
    id: 'e', no: 'E', name: '区块', en: 'BLOCKS', accent: '#5B3DF0',
    thesis: '用四块整色区块把工作台分区，不用阴影；当前项是一枚紫色胶囊。',
    keywords: ['整色分区', '无阴影', '模块感'],
    tokens: [
      ['画布', '#F7F5EF', '#F7F5EF'], ['区块', '#FFFFFF', '#FFFFFF'], ['胶囊', '#5B3DF0', '#5B3DF0'],
      ['主信号', '#5B3DF0', '#5B3DF0'], ['淡紫', '#EFEBFA', '#EFEBFA'], ['暖沙', '#F4EEE3', '#F4EEE3']
    ],
    changes: [
      '首页用四块整色区块分区，编号 01–04，22 个工具按任务落位，不加卡片阴影。',
      '侧栏是一整块淡紫底，当前项是紫色胶囊；底部设置保留同一块底色。',
      '智能填充和尺寸助手各是一整块白色区块；字段用平铺色块，主按钮方形，层级靠块面与留白。'
    ],
    tradeoff: '四块浅色底会带来一点色彩噪音；去掉阴影后，层级完全靠块面和间距，窄窗下要更小心。',
    best: '喜欢强模块感、希望界面像工作台分区而不是设置页的人。',
    principle: '先分区块，再谈装饰。色块就是层级。',
    spec: [
      ['字体', '20/28 问候 · 11/15 区块标题 · 11/28 工具行'],
      ['圆角', '6 区块 · 4 字段 · 999 胶囊'],
      ['阴影', '无 · 用色块和留白分层'],
      ['图标', 'Tabler 1.6px · 14–15px']
    ],
    dark: true
  },
  {
    id: 'f', no: 'F', name: '柔光', en: 'SOFT TACTILE', accent: '#6A45E8',
    thesis: '让表面有真实的厚度：胶囊是凸起的，输入是凹进去的，卡片只有一层柔光。',
    keywords: ['轻拟物', '触感', '单向光'],
    tokens: [
      ['瓷面', '#F6F1E9', '#F6F1E9'], ['卡面', '#FBF8F2', '#FBF8F2'], ['胶囊', '渐变 180°', 'linear-gradient(180deg,#7A5AF0,#5F35E8)'],
      ['主信号', '#6A45E8', '#6A45E8'], ['高光', '#FFFFFF', '#FFFFFF'], ['阴影', '#E6DED2', '#E6DED2']
    ],
    changes: [
      '当前项是凸起的紫色胶囊，顶部一道 1px 内高光；输入是凹进去的软槽。',
      '首页工具变成 22 个轻凸键帽，图标嵌在内凹的圆角槽里；悬停只抬 1px。',
      '面板是一张柔光卡，标签页是凹槽里的浮起滑块；只保留两层阴影，不做高光堆叠。'
    ],
    tradeoff: '轻拟物最容易过度。一旦给每个元素都加高光和投影，界面就会变脏。规则是只让可点击元素凸起，内容保持平。',
    best: '想要温度、触感和高完成度，能接受比白瓷更“实物”的表面。',
    principle: '凸起代表可点，凹下代表可输入；光只从上方来。',
    spec: [
      ['字体', '20/28 问候 · 11/15 键帽标签 · 11/26 工具行'],
      ['圆角', '14 面板 · 10 键帽 · 8 输入 · 999 胶囊'],
      ['高光', '1px inset 顶光 · 阴影两层'],
      ['图标', 'Tabler 1.6px · 14px']
    ],
    dark: true
  }
];


const baseCSS = String.raw`
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#F1F0EB;color:#17161B;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
button{font:inherit;border:0;background:none;padding:0;color:inherit;text-align:left;cursor:default}
.wrap{width:1360px;margin:0 auto;padding:52px 48px 104px}
.kicker{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:10px;letter-spacing:.14em;color:#77736A;text-transform:uppercase}
.mast{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:26px;border-bottom:1px solid #D8D5CC}
.mast h1{font-size:52px;line-height:1.05;letter-spacing:-.035em;font-weight:650;margin:18px 0 14px}
.mast p{width:560px;margin:0;color:#5F5C53;font-size:13px;line-height:1.85}
.mast-meta{text-align:right;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:10px;line-height:1.9;color:#77736A;padding-top:4px}
.audit{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid #D8D5CC}
.audit-item{padding:22px 24px 24px 0;border-right:1px solid #D8D5CC}
.audit-item+ .audit-item{padding-left:24px}
.audit-item:last-child{border-right:0}
.audit-no{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:9px;color:#8C887E;letter-spacing:.1em}
.audit-item h3{font-size:12px;line-height:1.6;margin:8px 0 6px;font-weight:600}
.audit-item p{font-size:11px;line-height:1.75;color:#6B675D;margin:0}
.scope{display:flex;justify-content:space-between;gap:40px;padding:16px 0 0;font-size:10.5px;line-height:1.8;color:#77736A}
.scope b{font-weight:600;color:#3B3933}
.dsec{display:grid;grid-template-columns:300px 908px;gap:54px;padding:64px 0 74px;border-bottom:1px solid #D8D5CC}
.dnotes{position:relative}
.dno{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:10px;letter-spacing:.12em;color:#8C887E}
.dname{display:flex;align-items:baseline;gap:12px;margin:10px 0 4px}
.dname h2{font-size:34px;line-height:1.1;letter-spacing:-.03em;font-weight:650;margin:0}
.dname span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:9px;letter-spacing:.16em;color:#8C887E}
.dthesis{font-size:14px;line-height:1.75;color:#302E29;margin:14px 0 0;font-weight:500;letter-spacing:-.005em}
.dkeys{display:flex;gap:6px;flex-wrap:wrap;margin:16px 0 0}
.dkeys span{font-size:9.5px;line-height:1;padding:6px 8px;border:1px solid #D5D1C7;border-radius:2px;color:#5F5C53;background:#F8F7F3}
.swatches{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:26px 0 0}
.swatch{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;color:#77736A;letter-spacing:.02em}
.swatch i{display:block;height:30px;border:1px solid rgba(0,0,0,.08);margin-bottom:6px;border-radius:2px}
.swatch b{display:block;font-weight:500;font-size:8.5px;color:#4B4840;margin-bottom:2px}
.facts{list-style:none;padding:0;margin:26px 0 0;border-top:1px solid #D8D5CC}
.facts li{position:relative;padding:11px 0 11px 15px;border-bottom:1px solid #E2DFD6;font-size:10.5px;line-height:1.75;color:#55524A}
.facts li::before{content:"";position:absolute;left:0;top:16px;width:4px;height:4px;background:var(--daccent);border-radius:1px}
.trade{margin:22px 0 0;padding:14px 14px 15px;background:#F8F7F3;border-left:2px solid var(--daccent)}
.trade h4{font-size:9px;letter-spacing:.1em;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:#8C887E;margin:0 0 6px;font-weight:500;text-transform:uppercase}
.trade p{font-size:10.5px;line-height:1.75;color:#5A574E;margin:0}
.best{font-size:10.5px;line-height:1.75;color:#55524A;margin:16px 0 0;padding-top:14px;border-top:1px solid #D8D5CC}
.best b{color:#17161B}
.spec{margin:14px 0 0;border-top:1px solid #D8D5CC}
.spec-row{display:grid;grid-template-columns:52px 1fr;gap:10px;padding:7px 0;border-bottom:1px solid #E2DFD6}
.spec-row dt{margin:0;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.08em;color:#8C887E;line-height:1.6}
.spec-row dd{margin:0;font-size:9.5px;line-height:1.65;color:#55524A}
.color-note{font-size:10px;line-height:1.75;color:#77736A;margin:10px 0 0;padding-top:10px;border-top:1px solid #D8D5CC}
.color-note b{color:#3B3933;font-weight:600}
.principle{margin:28px 0 0;padding-top:16px;border-top:1px solid #D8D5CC}
.principle span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.12em;color:#8C887E}
.principle p{font-size:13px;line-height:1.75;letter-spacing:-.01em;color:#302E29;margin:8px 0 0;max-width:270px}
.rec{display:inline-flex;align-items:center;gap:6px;margin-top:16px;font-size:9px;letter-spacing:.08em;font-family:ui-monospace,"SF Mono",Menlo,monospace;color:#fff;background:var(--daccent);padding:6px 8px;border-radius:2px}
.frames{display:grid;grid-template-columns:440px 440px;gap:26px 28px}
.fcell{width:440px}
.fcap{display:flex;justify-content:space-between;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8.5px;letter-spacing:.08em;color:#8C887E;margin-bottom:8px;text-transform:uppercase}
.phone{width:440px;height:600px;border-radius:9px;overflow:hidden;box-shadow:0 26px 60px -34px rgba(24,21,35,.42),0 0 0 1px rgba(24,21,35,.1);background:#fff}
.app{--rail-w:120px;width:100%;height:100%;display:flex;background:var(--app);color:var(--text);font-size:12px;line-height:18px;font-feature-settings:"tnum" 1;position:relative}
.app .i{display:block;width:16px;height:16px;flex:0 0 16px}
.app button{width:100%}

/* shared app parts */
.rail{flex:0 0 var(--rail-w);width:var(--rail-w);display:flex;flex-direction:column;background:var(--rail-bg);color:var(--rail-text);border-right:1px solid var(--rail-line)}
.rail-scroll{flex:1;min-height:0;padding:8px 7px 4px;display:flex;flex-direction:column;gap:1px}
.rail-label{font-size:8.5px;line-height:18px;letter-spacing:.04em;color:var(--rail-label);padding:7px 8px 1px;font-weight:500}
.nav{height:28px;display:flex;align-items:center;gap:7px;padding:0 8px;border-radius:5px;position:relative;font-size:11.5px;line-height:16px;color:var(--rail-text);flex:0 0 28px}
.nav-ic{width:20px;height:20px;display:grid;place-items:center;flex:0 0 20px;color:currentColor}
.nav-ic .i{width:15px;height:15px;flex-basis:15px}
.nav-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rail-foot{flex:0 0 auto;padding:5px 7px 7px;border-top:1px solid var(--rail-line);display:flex;flex-direction:column;gap:1px}
.nav-foot{height:26px;flex-basis:26px;font-size:10.5px;color:var(--rail-label)}
.nav-foot .nav-ic .i{width:14px;height:14px;flex-basis:14px}
.content{flex:1;min-width:0;height:100%;overflow:hidden;background:var(--app)}

/* home */
.home{padding:17px 14px 10px;display:flex;flex-direction:column}
.home-head{flex:0 0 auto;margin-bottom:13px}
.home-date{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8.5px;line-height:14px;letter-spacing:.04em;color:var(--faint);margin-bottom:3px}
.home-greet{display:flex;align-items:center;gap:6px;font-size:18px;line-height:26px;font-weight:600;letter-spacing:-.02em;color:var(--text)}
.greet-ic{width:17px;height:17px;display:grid;place-items:center;color:var(--accent-text);flex:0 0 17px}
.greet-ic .i{width:15px;height:15px;flex-basis:15px}
.greet-mark{color:var(--accent-text);margin-left:-3px}
.tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px 3px;align-content:start}
.home-a .tools{gap:8px 3px}
.home-b .tools{gap:7px 3px}
.tool{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:5px 6px;border-radius:6px}
.plate{width:26px;height:26px;display:grid;place-items:center;border-radius:7px;background:var(--plate);color:var(--icon);flex:0 0 26px}
.plate .i{width:15px;height:15px;flex-basis:15px}
.tname{font-size:11.5px;line-height:16px;color:var(--text);font-weight:500;white-space:nowrap;letter-spacing:-.01em;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.index{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:12px;align-content:start}
.idx{height:43px;display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--line);min-width:0}
.idx-num{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8.5px;line-height:12px;color:var(--muted);opacity:.72;width:13px;flex:0 0 13px;letter-spacing:.02em}
.idx-ic{width:16px;height:16px;display:grid;place-items:center;color:var(--icon);flex:0 0 16px}
.idx-ic .i{width:15px;height:15px;flex-basis:15px}
.idx-name{font-size:11.5px;line-height:16px;color:var(--text);font-weight:500;white-space:nowrap}

/* fill */
.fill{display:flex;flex-direction:column}
.fill-head{flex:0 0 auto;padding:14px 14px 0}
.hint{font-size:10px;line-height:15px;color:var(--muted);margin:0 0 9px}
.tabs{display:flex;flex:0 0 auto}
.tab{flex:1;text-align:center;font-size:10.5px;line-height:16px;color:var(--muted);position:relative;padding:7px 0 8px}
.tab.active{color:var(--text);font-weight:600}
.fill-list{flex:1;min-height:0;overflow:hidden;padding:9px 14px 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 6px;align-content:start}
.fld{min-height:44px;padding:7px 9px;display:flex;flex-direction:column;justify-content:center;gap:2px;border-radius:6px;background:var(--soft);min-width:0}
.fld-main{display:flex;align-items:center;gap:5px;min-width:0}
.fld-name{font-size:11px;line-height:15px;font-weight:600;color:var(--text);white-space:nowrap}
.fld-gear{width:12px;height:12px;display:grid;place-items:center;color:var(--faint);margin-left:auto;flex:0 0 12px}
.fld-gear .i{width:12px;height:12px;flex-basis:12px}
.fld-opts{display:flex;gap:7px;min-width:0;overflow:hidden}
.fld-opts span{font-size:8.5px;line-height:12px;color:var(--muted);white-space:nowrap}
.fill-foot{flex:0 0 auto;height:42px;display:flex;align-items:center;gap:7px;padding:0 14px;border-top:1px solid var(--line);background:var(--app)}
.check{display:flex;align-items:center;gap:4px;font-size:9.5px;line-height:12px;color:var(--muted);white-space:nowrap;flex:0 0 auto}
.check i{width:11px;height:11px;border:1px solid var(--check-line);border-radius:2px;display:block;background:var(--app)}
.check.checked i{background:var(--accent);border-color:var(--accent);position:relative}
.check.checked i::after{content:"";position:absolute;left:3px;top:1px;width:3px;height:6px;border:solid #fff;border-width:0 1.4px 1.4px 0;transform:rotate(45deg)}
.suffix{flex:1;min-width:0;height:26px;border-radius:5px;background:var(--input);color:var(--faint);font-size:9.5px;line-height:26px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.plus{width:26px;height:26px;flex:0 0 26px;display:grid;place-items:center;border-radius:5px;background:var(--accent);color:#fff}
.plus .i{width:14px;height:14px;flex-basis:14px}

/* size */
.size{display:flex;flex-direction:column;padding:14px 14px 0}
.size>.hint{margin-bottom:8px}
.sec-label{font-size:11px;line-height:16px;font-weight:600;color:var(--text);margin:0 0 6px}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.field{display:flex;flex-direction:column;gap:4px;min-width:0}
.field-label{font-size:9px;line-height:12px;color:var(--muted)}
.input,.select{height:30px;display:flex;align-items:center;border-radius:5px;background:var(--input);color:var(--text);font-size:11px;line-height:30px;padding:0 9px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden}
.select{justify-content:space-between;gap:6px;color:var(--text-2)}
.select .chev{width:12px;height:12px;flex:0 0 12px;color:var(--faint)}
.checks{display:flex;gap:16px;align-items:center;margin:1px 0 9px}
.info{font-size:9.5px;line-height:14px;color:var(--muted);background:var(--info-bg);border-left:2px solid var(--info-line);padding:7px 9px;margin-bottom:9px}
.size-tabs{border-bottom:1px solid var(--line);margin-bottom:8px}
.size-tabs .tab{padding:6px 0 7px;font-size:9.5px;white-space:nowrap}
.search-row{display:flex;gap:6px;margin-bottom:4px;flex:0 0 auto}
.search{flex:1;height:28px;display:flex;align-items:center;gap:5px;background:var(--input);color:var(--faint);font-size:9.5px;border-radius:5px;padding:0 8px;min-width:0;white-space:nowrap;overflow:hidden}
.search .i{width:12px;height:12px;flex-basis:12px}
.select.small{width:92px;height:28px;font-size:9.5px;flex:0 0 92px}
.devices{flex:1;min-height:0;overflow:hidden}
.device{display:flex;align-items:center;gap:8px;padding:7px 1px;border-bottom:1px solid var(--line);min-width:0}
.device-copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.device-name{font-size:10.5px;line-height:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.device-meta{font-size:8px;line-height:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.device-dim{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:9px;line-height:12px;color:var(--text-2);white-space:nowrap;flex:0 0 auto;font-variant-numeric:tabular-nums}
.size-foot{flex:0 0 auto;height:46px;display:flex;align-items:center;gap:6px;margin:0 -14px;padding:6px 14px;border-top:1px solid var(--line);background:var(--app)}
.swap{width:32px;height:32px;flex:0 0 32px;display:grid;place-items:center;border-radius:5px;background:var(--input);color:var(--text-2)}
.swap .i{width:14px;height:14px;flex-basis:14px}
.primary{flex:1;height:32px;display:grid;place-items:center;border-radius:6px;background:var(--primary);color:#fff;font-size:11px;line-height:16px;font-weight:600;letter-spacing:.01em}
`;

const dirCSS = String.raw`
/* ---------- A: dark rail ---------- */
.dir-a{--app:#FBFBFD;--rail-bg:#131217;--rail-line:#26232E;--rail-text:#A9A4B4;--rail-label:#837D8D;
  --text:#17151C;--text-2:#494451;--muted:#6E6A78;--faint:#9A96A4;--line:#ECEBF0;--soft:#F6F5F9;--input:#F2F1F6;
  --plate:#F2F0F9;--icon:#4E465E;--accent:#5B3DF0;--accent-text:#5B3DF0;--primary:#5B3DF0;--accent-soft:#EFEBFE;
  --check-line:#C9C5D2;--info-bg:#F2EFFE;--info-line:#5B3DF0}
.dir-a .nav.active{background:#1E1B28;color:#F7F4FF}
.dir-a .nav.active::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:2px;border-radius:2px;background:#A88BFF}
.dir-a .nav.active .nav-ic{color:#B7A2FF}
.dir-a .plate{background:var(--plate);color:var(--icon)}
.dir-a .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
.dir-a .fill-list .fld{background:#F6F5F9}
.dir-a .info{border-left-width:2px}

/* ---------- B: porcelain ---------- */
.dir-b{--app:#FFFFFF;--rail-bg:#FFFFFF;--rail-line:#F0EFF3;--rail-text:#77727F;--rail-label:#A19BA9;
  --text:#1B1A20;--text-2:#4C4854;--muted:#767180;--faint:#A29DAA;--line:#F0EFF3;--soft:#F7F6F9;--input:#F6F5F8;
  --plate:#F3F0FE;--icon:#5A4A83;--accent:#5F35E8;--accent-text:#5F35E8;--primary:#5F35E8;--accent-soft:#F1EDFE;
  --check-line:#CCC7D6;--info-bg:#F6F4FD;--info-line:#CFC4FA}
.dir-b .rail{border-right:1px solid #F0EFF3}
.dir-b .nav.active{background:#1B1A20;color:#FFFFFF}
.dir-b .nav.active .nav-ic{color:#FFFFFF}
.dir-b .rail-label{color:#A19BA9}
.dir-b .plate{background:var(--plate);color:var(--icon);box-shadow:inset 0 0 0 1px rgba(95,53,232,.06)}
.dir-b .home-greet{font-size:19px;line-height:27px}
.dir-b .greet-ic{color:var(--accent-text)}
.dir-b .tabs{background:var(--soft);border-radius:8px;padding:3px;gap:2px;height:32px;align-items:stretch}
.dir-b .fill-head .tabs{margin-bottom:0}
.dir-b .tab{border-radius:6px;padding:0;display:flex;align-items:center;justify-content:center;font-size:10px;line-height:26px}
.dir-b .tab.active{background:#FFFFFF;color:var(--accent-text);box-shadow:0 1px 2px rgba(28,25,40,.08)}
.dir-b .fill-head{padding-bottom:0}
.dir-b .fill-list{padding-top:10px;gap:6px}
.dir-b .fld{background:var(--soft);border-radius:9px;min-height:45px;padding:7px 10px}
.dir-b .fill-foot{background:var(--soft);border-top:1px solid #F0EFF3;height:44px}
.dir-b .suffix{background:#fff;box-shadow:inset 0 0 0 1px #E9E6F0;border-radius:7px}
.dir-b .plus{background:var(--accent);border-radius:7px}
.dir-b .size-tabs{border-bottom:0;background:var(--soft);border-radius:8px;padding:3px;height:32px;gap:1px;align-items:stretch;margin-bottom:9px}
.dir-b .size-tabs .tab{border-radius:6px;padding:0;display:flex;align-items:center;justify-content:center;font-size:9px}
.dir-b .size-tabs .tab.active{background:#fff;color:var(--accent-text);box-shadow:0 1px 2px rgba(28,25,40,.08)}
.dir-b .info{border-left:0;border-radius:7px;background:var(--info-bg);color:#5F5775}
.dir-b .device{border-bottom:0;background:var(--soft);border-radius:8px;padding:7px 9px;margin-bottom:5px}
.dir-b .devices{padding-top:1px}
.dir-b .primary{border-radius:8px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 10px -6px rgba(95,53,232,.65)}
.dir-b .swap{border-radius:7px}

/* ---------- C: index ---------- */
.dir-c{--app:#FCFCF9;--rail-bg:#FCFCF9;--rail-line:#E8E7DF;--rail-text:#6F6C63;--rail-label:#99968A;
  --text:#131312;--text-2:#4B4A43;--muted:#6D6B63;--faint:#9C998D;--line:#E8E7DF;--soft:#F3F2EB;--input:#F4F3EC;
  --plate:#F1F0E7;--icon:#3E3D37;--accent:#4A22D6;--accent-text:#4A22D6;--primary:#4A22D6;--accent-soft:#EFEAFE;
  --check-line:#BDBAAF;--info-bg:transparent;--info-line:#4A22D6}
.dir-c .nav{border-radius:0;padding:0 7px}
.dir-c .nav.active{background:transparent;color:var(--text);font-weight:600}
.dir-c .nav.active .nav-ic{background:var(--accent);color:#FFFFFF;border-radius:2px}
.dir-c .nav.active .nav-ic .i{width:13px;height:13px;flex-basis:13px}
.dir-c .rail-label{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.06em;color:var(--rail-label)}
.dir-c .rail-foot{border-top:1px solid var(--rail-line)}
.dir-c .home-greet{font-size:21px;line-height:29px;letter-spacing:-.035em}
.dir-c .home-date{font-size:8.5px;letter-spacing:.08em}
.dir-c .greet-ic{color:var(--text);opacity:.75}
.dir-c .greet-mark{color:var(--accent)}
.dir-c .home-head{border-bottom:1px solid var(--line);padding-bottom:12px;margin-bottom:2px}
.dir-c .idx{border-bottom:1px solid var(--line);height:42px}
.dir-c .idx .idx-num{color:var(--faint)}
.dir-c .fill-head{border-bottom:1px solid var(--line);padding-bottom:0}
.dir-c .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--accent)}
.dir-c .fill-list{padding-top:0;gap:0 14px}
.dir-c .fld{background:transparent;border-radius:0;border-bottom:1px solid var(--line);min-height:44px;padding:7px 2px}
.dir-c .fill-foot{background:var(--app)}
.dir-c .suffix{background:transparent;border:1px solid var(--line);border-radius:0;color:var(--faint)}
.dir-c .plus{border-radius:0;background:var(--accent)}
.dir-c .input,.dir-c .select,.dir-c .search{border-radius:0}
.dir-c .info{border-left:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:6px 0;background:transparent}
.dir-c .size-tabs{border-bottom:1px solid var(--line);margin-bottom:8px}
.dir-c .tab.active::after{bottom:-1px}
.dir-c .device{border-bottom:1px solid var(--line);padding:7px 0}
.dir-c .primary{border-radius:0;background:var(--accent)}
.dir-c .swap{border-radius:0;background:transparent;border:1px solid var(--line)}
.dir-c .check i{border-radius:0}
.dir-c .size-foot{background:var(--app)}

/* dark tokens */
.dir-a.dark{--app:#16151B;--rail-bg:#0B0A0E;--rail-line:#221F29;--rail-text:#A8A3B3;--rail-label:#7F7989;
  --text:#F3F0F8;--text-2:#C8C2D2;--muted:#A8A3B3;--faint:#736D7E;--line:#2C2935;--soft:#1F1D26;--input:#211F29;
  --plate:#262330;--icon:#C4B8E8;--accent:#B7A2FF;--accent-text:#B7A2FF;--primary:#6D4AFF;--accent-soft:#2A2340;
  --check-line:#514B5E;--info-bg:#211D30;--info-line:#8E74F5}
.dir-a.dark .nav.active{background:#201D2A;color:#F7F4FF}
.dir-a.dark .nav.active::before{background:#B7A2FF}
.dir-a.dark .nav.active .nav-ic{color:#B7A2FF}
.dir-a.dark .greet-ic{color:#B7A2FF}
.dir-a.dark .greet-mark{color:#B7A2FF}
.dir-a.dark .plate{background:#262330;color:#C4B8E8}
.dir-a.dark .fld{background:#1F1D26}
.dir-a.dark .suffix{background:#211F29}
.dir-a.dark .input,.dir-a.dark .select,.dir-a.dark .search{background:#211F29}
.dir-a.dark .swap{background:#211F29}
.dir-a.dark .info{background:#211D30;border-left-color:#8E74F5}

.dir-b.dark{--app:#17161A;--rail-bg:#17161A;--rail-line:#2B2930;--rail-text:#A7A1AF;--rail-label:#6F6A77;
  --text:#F3F0F8;--text-2:#C9C3D2;--muted:#A5A0AE;--faint:#736E7B;--line:#2C2A31;--soft:#211F26;--input:#211F26;
  --plate:#2B2736;--icon:#C9B8F2;--accent:#B7A2FF;--accent-text:#B7A2FF;--primary:#6D4AFF;--accent-soft:#2C2540;
  --check-line:#544E5D;--info-bg:#23202E;--info-line:#6F5BD6}
.dir-b.dark .nav.active{background:#F4F1FA;color:#17161A}
.dir-b.dark .nav.active .nav-ic{color:#17161A}
.dir-b.dark .tabs{background:#201E25}
.dir-b.dark .tab.active{background:#2C2933;color:#C9B8F2;box-shadow:none}
.dir-b.dark .fill-foot{background:#201E25;border-top-color:#2C2A31}
.dir-b.dark .suffix{background:#2A2731;box-shadow:inset 0 0 0 1px #35313D}
.dir-b.dark .size-tabs{background:#201E25}
.dir-b.dark .size-tabs .tab.active{background:#2C2933;color:#C9B8F2;box-shadow:none}
.dir-b.dark .device{background:#201E25}
.dir-b.dark .plate{background:#2B2736}
.dir-b.dark .info{background:#23202E;color:#B9B2C6}
.dir-b.dark .rail{border-right-color:#2B2930}

.dir-c.dark{--app:#141412;--rail-bg:#141412;--rail-line:#2B2B26;--rail-text:#A19F94;--rail-label:#77756B;
  --text:#F1F0E8;--text-2:#C9C7BC;--muted:#A19F94;--faint:#716F65;--line:#2E2D27;--soft:#1E1E1A;--input:#1E1E1A;
  --plate:#24231D;--icon:#C9C6B8;--accent:#B9A2FF;--accent-text:#B9A2FF;--primary:#5B3DF0;--accent-soft:#2C2445;
  --check-line:#4F4D45;--info-bg:transparent;--info-line:#B9A2FF}
.dir-c.dark .nav.active{color:#F1F0E8}
.dir-c.dark .nav.active .nav-ic{background:#B9A2FF;color:#141412}
.dir-c.dark .greet-mark{color:#B9A2FF}
.dir-c.dark .fld{background:transparent}
.dir-c.dark .suffix{background:transparent;border-color:#2E2D27}
.dir-c.dark .info{background:transparent;border-top-color:#2E2D27;border-bottom-color:#2E2D27}
.dir-c.dark .size-foot{background:#141412}
`;

const dirCSS2 = String.raw`
/* ---------- D: cards ---------- */
.dir-d{--app:#F4F3F0;--rail-bg:#F4F3F0;--rail-line:#E5E2DC;--rail-text:#6F6A75;--rail-label:#9A949E;
  --surface:#FFFFFF;--text:#1B1A1F;--text-2:#4B4653;--muted:#6E6A75;--faint:#9C96A2;--line:#E9E6E0;
  --soft:#F7F5F2;--input:#F2EFEA;--plate:#F5F1FE;--icon:#5B4A84;--accent:#5F35E8;--accent-text:#5F35E8;
  --primary:#5F35E8;--accent-soft:#F0ECFE;--check-line:#CFC9C2;--info-bg:#F5F1FE;--info-line:#C9BAF8;
  --capsule:#1B1A1F;--capsule-text:#FFFFFF;
  --card-shadow:0 1px 2px rgba(24,20,30,.04),0 12px 24px -20px rgba(24,20,30,.28)}
.dir-d .rail{border-right:1px solid var(--rail-line)}
.dir-d .nav.active{background:var(--capsule);color:var(--capsule-text);border-radius:999px}
.dir-d .nav.active .nav-ic{color:var(--capsule-text)}
.dir-d .home-d{padding:12px}
.dir-d .home-d .home-head{padding:4px 4px 0;margin-bottom:10px}
.dir-d .d-cards{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:9px}
.dir-d .d-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 10px 8px;box-shadow:var(--card-shadow);display:flex;flex-direction:column;min-height:0;overflow:hidden}
.dir-d .d-card-head{display:flex;align-items:center;justify-content:space-between;padding:0 2px 6px;border-bottom:1px solid var(--line);margin-bottom:3px}
.dir-d .d-card-label{font-size:11px;line-height:14px;font-weight:650;color:var(--text);letter-spacing:.02em}
.dir-d .d-card-count{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;line-height:12px;color:var(--faint)}
.dir-d .d-card-list{display:flex;flex-direction:column;gap:1px}
.dir-d .d-row{display:flex;align-items:center;gap:6px;height:34px;padding:0 4px;margin:0 -2px;border-radius:6px;min-width:0}
.dir-d .d-row-ic{width:14px;height:14px;display:grid;place-items:center;color:var(--icon);flex:0 0 14px}
.dir-d .d-row-ic .i{width:14px;height:14px;flex-basis:14px}
.dir-d .d-row-name{font-size:11px;line-height:15px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dir-d .fill,.dir-d .size{margin:10px;height:calc(100% - 20px);background:var(--surface);border:1px solid var(--line);border-radius:12px;box-shadow:var(--card-shadow)}
.dir-d .fill-head{padding:14px 14px 0}
.dir-d .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
.dir-d .fld{background:var(--soft);border-radius:7px}
.dir-d .fill-foot{background:var(--surface)}
.dir-d .suffix{background:var(--input)}
.dir-d .input,.dir-d .select,.dir-d .search{background:var(--input)}
.dir-d .info{background:var(--info-bg);border-left:2px solid var(--info-line);border-radius:0 5px 5px 0}
.dir-d .device{border-bottom:1px solid var(--line)}
.dir-d .size-foot{background:var(--surface)}
.dir-d .primary{border-radius:8px}
.dir-d .swap{background:var(--input)}
.dir-d .home-greet{font-size:19px}
.dir-d.dark{--app:#131216;--rail-bg:#131216;--rail-line:#2A2730;--rail-text:#A8A2B0;--rail-label:#746E7C;
  --surface:#1C1A20;--text:#F3F0F6;--text-2:#C9C3D0;--muted:#A8A2B0;--faint:#736D7B;--line:#2A2730;
  --soft:#211F26;--input:#221F27;--plate:#2B2638;--icon:#C9B8F0;--accent:#B7A2FF;--accent-text:#B7A2FF;
  --primary:#6D4AFF;--accent-soft:#2C2540;--check-line:#544D5C;--info-bg:#23202E;--info-line:#6F5BD6;
  --capsule:#F4F1FA;--capsule-text:#17161A;
  --card-shadow:0 1px 2px rgba(0,0,0,.2),0 12px 24px -20px rgba(0,0,0,.6)}
.dir-d.dark .nav.active{color:#17161A}
.dir-d.dark .nav.active .nav-ic{color:#17161A}
.dir-d.dark .fld{background:var(--soft)}
.dir-d.dark .suffix,.dir-d.dark .input,.dir-d.dark .select,.dir-d.dark .search,.dir-d.dark .swap{background:var(--input)}
.dir-d.dark .fill-foot,.dir-d.dark .size-foot{background:var(--surface)}

/* ---------- E: blocks ---------- */
.dir-e{--app:#F7F5EF;--rail-bg:#ECE8F8;--rail-line:#DFD9F0;--rail-text:#4E485F;--rail-label:#7E7790;
  --surface:#FFFFFF;--text:#17161A;--text-2:#494650;--muted:#6A6672;--faint:#9A958E;--line:#E5E1D9;
  --soft:#F3F1EA;--input:#F4F1E9;--plate:#F1EDE0;--icon:#4A4652;--accent:#5B3DF0;--accent-text:#5B3DF0;
  --primary:#5B3DF0;--accent-soft:#EFEBFA;--check-line:#C9C4BA;--info-bg:#F4F0FF;--info-line:#B9A8F8;
  --capsule:#5B3DF0;--capsule-text:#FFFFFF}
.dir-e .rail{border-right:1px solid var(--rail-line)}
.dir-e .nav{border-radius:999px}
.dir-e .nav.active{background:var(--capsule);color:#fff;border-radius:999px}
.dir-e .nav.active .nav-ic{color:#fff}
.dir-e .home-e{padding:12px}
.dir-e .home-e .home-head{background:#FFFFFF;border-radius:6px;padding:10px 12px;margin-bottom:7px}
.dir-e .e-blocks{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:7px}
.dir-e .e-block{border-radius:6px;padding:10px;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.dir-e .e-block-0{background:#FFFFFF}
.dir-e .e-block-1{background:#EFEBFA}
.dir-e .e-block-2{background:#F4EEE3}
.dir-e .e-block-3{background:#EAF0EA}
.dir-e .e-block-head{display:flex;align-items:baseline;gap:6px;padding:0 2px 7px;border-bottom:1px solid rgba(23,22,26,.1);margin-bottom:4px}
.dir-e .e-block-no{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:15px;line-height:16px;font-weight:500;color:var(--accent);letter-spacing:-.04em}
.dir-e .e-block-label{font-size:11px;line-height:14px;font-weight:700;color:var(--text)}
.dir-e .e-block-count{margin-left:auto;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;line-height:12px;color:var(--muted)}
.dir-e .e-row{display:flex;align-items:center;gap:6px;height:28px;padding:0 2px;min-width:0}
.dir-e .e-row-ic{width:14px;height:14px;display:grid;place-items:center;color:var(--icon);flex:0 0 14px}
.dir-e .e-row-ic .i{width:14px;height:14px;flex-basis:14px}
.dir-e .e-row-name{font-size:11px;line-height:15px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dir-e .fill,.dir-e .size{margin:8px;height:calc(100% - 16px);background:var(--surface);border-radius:6px}
.dir-e .fill-head{padding:14px 14px 0}
.dir-e .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
.dir-e .fld{background:var(--soft);border-radius:4px}
.dir-e .fill-foot{background:var(--surface)}
.dir-e .suffix{background:var(--input);border-radius:4px}
.dir-e .input,.dir-e .select,.dir-e .search{background:var(--input);border-radius:4px}
.dir-e .info{background:var(--info-bg);border-left:2px solid var(--info-line);border-radius:0}
.dir-e .size-foot{background:var(--surface)}
.dir-e .primary{border-radius:4px}
.dir-e .swap{background:var(--input);border-radius:4px}
.dir-e .home-greet{font-size:20px}
.dir-e.dark{--app:#141216;--rail-bg:#1C1826;--rail-line:#2C2738;--rail-text:#B0A9C0;--rail-label:#7C748C;
  --surface:#1E1B26;--text:#F3F0F7;--text-2:#C9C3D4;--muted:#A9A3B3;--faint:#746E7E;--line:#2E2A36;
  --soft:#241F2E;--input:#241F2E;--plate:#2B2538;--icon:#CFC4E8;--accent:#B7A2FF;--accent-text:#B7A2FF;
  --primary:#6D4AFF;--accent-soft:#2C2445;--check-line:#544C60;--info-bg:#24202E;--info-line:#8B71F2;
  --capsule:#7A5CF5;--capsule-text:#FFFFFF}
.dir-e.dark .e-block-0{background:#1E1B26}
.dir-e.dark .e-block-1{background:#242033}
.dir-e.dark .e-block-2{background:#24211D}
.dir-e.dark .e-block-3{background:#1E2422}
.dir-e.dark .home-e .home-head{background:#1E1B26}
.dir-e.dark .e-block-head{border-bottom-color:var(--line)}
.dir-e.dark .suffix,.dir-e.dark .input,.dir-e.dark .select,.dir-e.dark .search,.dir-e.dark .swap{background:var(--input)}

/* ---------- F: soft tactile ---------- */
.dir-f{--app:#F6F1E9;--rail-bg:#F1EBE1;--rail-line:#E4DCCF;--rail-text:#6F655B;--rail-label:#9A8F83;
  --surface:#FBF8F2;--text:#2C2621;--text-2:#554C43;--muted:#796F64;--faint:#A79C90;--line:#E6DED2;
  --soft:#F4EEE5;--input:#F1EBE2;--plate:#F1EBE2;--icon:#6B5A45;--accent:#6A45E8;--accent-text:#6A45E8;
  --primary:#6A45E8;--accent-soft:#EFE9FD;--check-line:#C9C0B3;--info-bg:#F2EBDD;--info-line:#DCCFBC;
  --capsule:linear-gradient(180deg,#7A5AF0,#5F35E8);--capsule-text:#FFFFFF}
.dir-f .rail{border-right:1px solid var(--rail-line)}
.dir-f .nav{border-radius:999px}
.dir-f .nav.active{background:var(--capsule);color:#fff;border-radius:999px;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 4px 10px -4px rgba(95,53,232,.5)}
.dir-f .nav.active .nav-ic{color:#fff}
.dir-f .home-f{padding:12px}
.dir-f .home-f .home-head{padding:4px 4px 0;margin-bottom:10px}
.dir-f .f-keys{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;align-content:start}
.dir-f .f-key{height:58px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:6px 6px 5px;border-radius:10px;background:linear-gradient(180deg,#FFFFFF,#F8F3EC);border:1px solid var(--line);box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 1px 2px rgba(60,45,35,.06),0 4px 8px -6px rgba(60,45,35,.2);min-width:0}
.dir-f .f-key-well{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;background:var(--plate);box-shadow:inset 0 1px 2px rgba(60,45,35,.08);color:var(--icon);flex:0 0 24px}
.dir-f .f-key-well .i{width:14px;height:14px;flex-basis:14px}
.dir-f .f-key-name{font-size:11px;line-height:14px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dir-f .fill,.dir-f .size{margin:10px;height:calc(100% - 20px);background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:0 1px 0 rgba(255,255,255,.9) inset,0 14px 28px -24px rgba(60,45,35,.4)}
.dir-f .fill-head{padding:14px 14px 0}
.dir-f .tabs{background:var(--soft);border-radius:9px;padding:3px;height:32px;gap:2px;align-items:stretch;box-shadow:inset 0 1px 2px rgba(60,45,35,.07)}
.dir-f .tab{border-radius:7px;padding:0;display:flex;align-items:center;justify-content:center;font-size:10px}
.dir-f .tab.active{background:#FFFDF9;color:var(--accent-text);box-shadow:0 1px 0 #fff inset,0 2px 5px rgba(60,45,35,.1)}
.dir-f .fld{background:var(--soft);border-radius:8px}
.dir-f .fill-foot{background:var(--surface)}
.dir-f .suffix{background:var(--input);border-radius:7px;box-shadow:inset 0 1px 2px rgba(60,45,35,.07)}
.dir-f .input,.dir-f .select,.dir-f .search{background:var(--input);border-radius:7px;box-shadow:inset 0 1px 2px rgba(60,45,35,.07)}
.dir-f .info{background:var(--info-bg);border-left:2px solid var(--info-line);border-radius:0 6px 6px 0}
.dir-f .size-tabs{border-bottom:0;background:var(--soft);border-radius:9px;padding:3px;height:32px;gap:1px;align-items:stretch;margin-bottom:9px;box-shadow:inset 0 1px 2px rgba(60,45,35,.07)}
.dir-f .size-tabs .tab{border-radius:7px;padding:0;display:flex;align-items:center;justify-content:center;font-size:9px}
.dir-f .size-tabs .tab.active{background:#FFFDF9;color:var(--accent-text);box-shadow:0 1px 0 #fff inset,0 2px 5px rgba(60,45,35,.1)}
.dir-f .device{border-bottom:1px solid var(--line)}
.dir-f .size-foot{background:var(--surface)}
.dir-f .primary{border-radius:10px;background:linear-gradient(180deg,#7A5AF0,#5F35E8);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 10px -5px rgba(95,53,232,.55)}
.dir-f .swap{background:var(--input);box-shadow:inset 0 1px 2px rgba(60,45,35,.07)}
.dir-f .plus{border-radius:7px;background:linear-gradient(180deg,#7A5AF0,#5F35E8);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 3px 6px -3px rgba(95,53,232,.5)}
.dir-f .home-greet{font-size:20px}
.dir-f.dark{--app:#191513;--rail-bg:#1E1915;--rail-line:#352E27;--rail-text:#B4A99B;--rail-label:#80766A;
  --surface:#241F1A;--text:#F5F0E9;--text-2:#D0C6B9;--muted:#A99D90;--faint:#7A7166;--line:#3A322A;
  --soft:#2A241E;--input:#1F1B17;--plate:#332B23;--icon:#D6C7B2;--accent:#B79CFF;--accent-text:#B79CFF;
  --primary:#6D4AFF;--accent-soft:#2E2544;--check-line:#5A5147;--info-bg:#2A241E;--info-line:#4A4033;
  --capsule:linear-gradient(180deg,#8160F5,#5F35E8);--capsule-text:#FFFFFF}
.dir-f.dark .nav.active{box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 4px 10px -4px rgba(0,0,0,.6)}
.dir-f.dark .f-key{background:linear-gradient(180deg,#2A241E,#241F1A);border-color:#3A322A;box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 1px 2px rgba(0,0,0,.2),0 4px 8px -6px rgba(0,0,0,.5)}
.dir-f.dark .f-key-well{background:#1F1B17;box-shadow:inset 0 1px 2px rgba(0,0,0,.4);color:#D6C7B2}
.dir-f.dark .tabs,.dir-f.dark .size-tabs{background:#211C17;box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}
.dir-f.dark .tab.active,.dir-f.dark .size-tabs .tab.active{background:#2F2822;color:#D8C9FF;box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 2px 5px rgba(0,0,0,.3)}
.dir-f.dark .suffix,.dir-f.dark .input,.dir-f.dark .select,.dir-f.dark .search,.dir-f.dark .swap{background:#1F1B17;box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}
`;

const presentationCSS = String.raw`
:root{--page:#F1F0EB}
body{background:var(--page)}
.wrap{width:1360px}
a{color:inherit;text-decoration:none}
.navmap{display:flex;gap:8px;margin-top:24px}
.navmap a{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:9px;letter-spacing:.08em;padding:7px 9px;border:1px solid #D5D1C7;border-radius:2px;background:#F8F7F3;color:#5F5C53}
.navmap a:hover{border-color:#1B1A20;color:#17161B}
.single .wrap{padding-top:36px}
.single .mast{border-bottom:0;padding-bottom:8px}
.single .mast h1{font-size:30px;margin:10px 0 6px}
.single .mast p{font-size:12px}
.single .audit,.single .scope,.single .navmap{display:none}
.single .dsec{border-bottom:0;padding:34px 0 0}

.pagefoot{display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:26px 0 0;margin-top:24px;border-top:1px solid #D8D5CC}
.pagefoot h4{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.12em;color:#8C887E;margin:0 0 8px;font-weight:500}
.pagefoot p{font-size:10px;line-height:1.8;color:#5F5C53;margin:0}
.pagefoot .steps{display:flex;gap:18px}
.pagefoot .step{flex:1}
.pagefoot .step b{display:block;font-size:10px;color:#17161B;margin-bottom:3px}
.pagefoot .step span{font-size:9.5px;line-height:1.65;color:#6B675D}

@media (max-width:1400px){.wrap{width:auto;max-width:1360px}}
`;

function sectionHTML(d) {
  const swatches = d.tokens.map(([name, hex, color]) => `
    <div class="swatch"><i style="background:${color}"></i><b>${name}</b>${hex}</div>`).join('');
  const changes = d.changes.map(item => `<li>${item}</li>`).join('');
  const keys = d.keywords.map(k => `<span>${k}</span>`).join('');
  const spec = d.spec.map(([label, value]) => `<div class="spec-row"><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  return `<section class="dsec" id="${d.id}" style="--daccent:${d.accent}">
    <div class="dnotes">
      <div class="dno">DIRECTION ${d.no}</div>
      <div class="dname"><h2>${d.name}</h2><span>${d.en}</span></div>
      <p class="dthesis">${d.thesis}</p>
      <div class="dkeys">${keys}</div>
      <div class="swatches">${swatches}</div>
      <ul class="facts">${changes}</ul>
      <div class="trade"><h4>代价与边界</h4><p>${d.tradeoff}</p></div>
      <p class="best"><b>适合：</b>${d.best}</p>
      <div class="spec">${spec}</div>
      ${d.id === 'a' ? '<div class="rec">RECOMMENDED</div>' : ''}
      <div class="principle"><span>VISUAL PRINCIPLE</span><p>${d.principle}</p></div>
    </div>
    <div class="frames">
      <div class="fcell"><div class="fcap"><span>HOME / LIGHT</span><span>440 × 600</span></div>${screen(d.id, 'home', false)}</div>
      <div class="fcell"><div class="fcap"><span>HOME / DARK</span><span>440 × 600</span></div>${screen(d.id, 'home', true)}</div>
      <div class="fcell"><div class="fcap"><span>SMART FILL</span><span>440 × 600</span></div>${screen(d.id, 'fill', false)}</div>
      <div class="fcell"><div class="fcap"><span>SIZE ASSISTANT</span><span>440 × 600</span></div>${screen(d.id, 'size', false)}</div>
    </div>
  </section>`;
}

function pageHeader(single = false) {
  return `<header class="mast">
    <div>
      <div class="kicker">ALL IN ONE / VISUAL DIRECTIONS</div>
      <h1>三个视觉方向</h1>
      <p>同一套信息架构与操作路径，三种不同的视觉语法。先选方向，再落到真实插件。所有画面按 440 × 600 实际窗口绘制，未改 15 个入口、22 个工具与现有流程。</p>
      ${single ? '' : `<nav class="navmap"><a href="#a">01 暗轨</a><a href="#b">02 白瓷</a><a href="#c">03 索引</a></nav>`}
    </div>
    <div class="mast-meta">2026.10.21<br>440 × 600<br>LIGHT / DARK<br>NO PUSH</div>
  </header>
  ${single ? '' : `<div class="audit">
    <div class="audit-item"><div class="audit-no">01 / ANCHOR</div><h3>当前导航缺少视觉锚点</h3><p>侧栏与内容同为浅色，当前项靠一层浅紫底块，位置不够“定”。</p></div>
    <div class="audit-item"><div class="audit-no">02 / RHYTHM</div><h3>22 个工具等权排列</h3><p>图标直接漂在白底上，缺少承台与节奏，首屏读起来像一组同重量的标签。</p></div>
    <div class="audit-item"><div class="audit-no">03 / STATE</div><h3>控件状态差异偏弱</h3><p>输入、标签、按钮共用 4px 圆角和浅灰底，密集面板容易糊成一片。</p></div>
  </div>
  <div class="scope"><span><b>本轮只改视觉层。</b> 不改导航顺序、工具数量、填写逻辑与宿主通信。深色模式与精简模式随方向一起定义。</span><span>建议先看 01 暗轨</span></div>
  <p class="color-note"><b>色彩说明：</b>主信号色是方向建议值。若保留现有品牌紫 #7135DB，三个方向的结构、层级与状态逻辑都不受影响。</p>`}`;
}

const pageFooter = () => `<footer class="pagefoot"><div><h4>SHARED CONSTRAINTS</h4><p>15 个入口与 22 个工具全部保留；不改填写逻辑、宿主通信与快捷键。默认 440 × 600，精简 360 × 520，回归 340 × 440。深浅双主题、键盘焦点、减少动态一并覆盖。</p></div><div><h4>NEXT</h4><div class="steps"><div class="step"><b>01 选方向</b><span>确定视觉语法，允许混搭单个机制。</span></div><div class="step"><b>02 落实现</b><span>改共享 token 与真实面板，不动 IA。</span></div><div class="step"><b>03 本地试</b><span>导入 Figma 开发版，不提交、不推送。</span></div></div></div></footer>`;
const doc = (body, single = false) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 三个视觉方向</title>
<style>${baseCSS}${dirCSS}${dirCSS2}${presentationCSS}</style>
</head>
<body class="${single ? 'single' : ''}">
<div class="wrap">
${pageHeader(single)}
${body}
${single ? '' : pageFooter()}
</div>
</body>
</html>`;

fs.writeFileSync(path.join(here, 'index.html'), doc(DIRECTIONS.map(sectionHTML).join('')));
const compareCSS = String.raw`
body{background:#F1F0EB}
.cmp-wrap{width:1440px;margin:0 auto;padding:46px 36px 54px}
.cmp-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #D8D5CC;padding-bottom:20px}
.cmp-head h1{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:8px 0 0;font-weight:650}
.cmp-head p{font-size:11px;line-height:1.7;color:#6B675D;margin:0;width:480px;text-align:right}
.cmp-grid{display:grid;grid-template-columns:repeat(3,440px);gap:24px;margin-top:24px}
.cmp-col{width:440px}
.cmp-top{display:flex;align-items:baseline;justify-content:space-between;padding:0 2px 8px}
.cmp-name{display:flex;align-items:baseline;gap:9px}
.cmp-name b{font-size:16px;letter-spacing:-.02em}
.cmp-name span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.14em;color:#8C887E}
.cmp-no{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.1em;color:#8C887E}
.cmp-line{font-size:10px;line-height:1.7;color:#5F5C53;margin:0 2px 12px;min-height:34px}
.cmp-foot{font-size:9.5px;line-height:1.7;color:#77736A;margin:10px 2px 0;display:flex;justify-content:space-between;gap:10px}
`;
const compareHTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 方向对比</title><style>${baseCSS}${dirCSS}${dirCSS2}${compareCSS}</style></head>
<body><div class="cmp-wrap">
<header class="cmp-head"><div><div class="kicker">ALL IN ONE / VISUAL DIRECTIONS</div><h1>同一屏，三种视觉语法</h1></div><p>三个方向都保留 15 个入口、22 个工具和现有操作路径。差别在导航锚点、图标承台、材质与信息密度。</p></header>
<div class="cmp-grid">
${DIRECTIONS.map(d => `<div class="cmp-col">
  <div class="cmp-top"><div class="cmp-name"><b>${d.name}</b><span>${d.en}</span></div><div class="cmp-no">${d.no}</div></div>
  <p class="cmp-line">${d.thesis}</p>
  ${screen(d.id, 'home', false)}
  <div class="cmp-foot"><span>${d.keywords.join(' / ')}</span><span>440 × 600</span></div>
</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'compare.html'), compareHTML());
const panelsCSS = String.raw`
body{background:#F1F0EB}
.pan-wrap{width:1440px;margin:0 auto;padding:46px 36px 56px}
.pan-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #D8D5CC;padding-bottom:20px}
.pan-head h1{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:8px 0 0;font-weight:650}
.pan-head p{font-size:11px;line-height:1.7;color:#6B675D;margin:0;width:520px;text-align:right}
.pan-grid{display:grid;grid-template-columns:repeat(3,440px);gap:26px 24px;margin-top:26px}
.pan-cell{width:440px}
.pan-cap{display:flex;justify-content:space-between;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.08em;color:#8C887E;margin-bottom:8px;text-transform:uppercase}
.pan-name{display:flex;align-items:baseline;gap:8px;font-size:14px;font-weight:600;letter-spacing:-.01em;margin:0 0 10px;color:#17161B}
.pan-name span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.14em;color:#8C887E;font-weight:400}
.pan-row2{grid-column:span 1}
`;
const panelsHTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 密集面板对比</title><style>${baseCSS}${dirCSS}${dirCSS2}${panelsCSS}</style></head>
<body><div class="pan-wrap">
<header class="pan-head"><div><div class="kicker">ALL IN ONE / DENSE SURFACES</div><h1>密集面板，同一套语法</h1></div><p>同一屏智能填充与尺寸助手。判断一个方向是否成立，不看首页，看它能不能在高密度任务里保持层级。</p></header>
<div class="pan-grid">
${DIRECTIONS.map(d => `<div class="pan-cell"><div class="pan-name">${d.name}<span>${d.en}</span></div><div class="pan-cap"><span>SMART FILL / LIGHT</span><span>440 × 600</span></div>${screen(d.id, 'fill', false)}</div>`).join('')}
${DIRECTIONS.map(d => `<div class="pan-cell"><div class="pan-name">${d.name}<span>${d.en}</span></div><div class="pan-cap"><span>SIZE ASSISTANT / LIGHT</span><span>440 × 600</span></div>${screen(d.id, 'size', false)}</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'panels.html'), panelsHTML());
const compareDarkHTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 深色对比</title><style>${baseCSS}${dirCSS}${dirCSS2}${String.raw`
body{background:#E9E8E2}
.cmp-wrap{width:1440px;margin:0 auto;padding:46px 36px 54px}
.cmp-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #D2CFC6;padding-bottom:20px}
.cmp-head h1{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:8px 0 0;font-weight:650}
.cmp-head p{font-size:11px;line-height:1.7;color:#625F57;margin:0;width:500px;text-align:right}
.cmp-grid{display:grid;grid-template-columns:repeat(3,440px);gap:24px;margin-top:24px}
.cmp-col{width:440px}
.cmp-top{display:flex;align-items:baseline;justify-content:space-between;padding:0 2px 8px}
.cmp-name{display:flex;align-items:baseline;gap:9px}
.cmp-name b{font-size:16px;letter-spacing:-.02em}
.cmp-name span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.14em;color:#7B786F}
.cmp-no{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.1em;color:#7B786F}
.cmp-line{font-size:10px;line-height:1.7;color:#5F5C53;margin:0 2px 12px;min-height:34px}
.cmp-foot{font-size:9.5px;line-height:1.7;color:#6B675D;margin:10px 2px 0;display:flex;justify-content:space-between;gap:10px}
`}</style></head>
<body><div class="cmp-wrap">
<header class="cmp-head"><div><div class="kicker">ALL IN ONE / DARK SURFACES</div><h1>深色模式，三种处理</h1></div><p>深色不是把浅色反相。轨道、当前项与面板的关系需要在两种主题里都成立。</p></header>
<div class="cmp-grid">
${DIRECTIONS.map(d => `<div class="cmp-col">
  <div class="cmp-top"><div class="cmp-name"><b>${d.name}</b><span>${d.en}</span></div><div class="cmp-no">${d.no}</div></div>
  <p class="cmp-line">${d.principle}</p>
  ${screen(d.id, 'home', true)}
  <div class="cmp-foot"><span>${d.keywords.join(' / ')}</span><span>440 × 600</span></div>
</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'compare-dark.html'), compareDarkHTML());



for (const d of DIRECTIONS) {
  fs.writeFileSync(path.join(here, `direction-${d.id}.html`), doc(sectionHTML(d), true));
}
console.log('Built index.html and 3 direction pages in', here);

function pageHeader2(single = false) {
  return `<header class="mast">
    <div>
      <div class="kicker">ALL IN ONE / ROUND 02</div>
      <h1>卡片、区块、轻拟物</h1>
      <p>按你的反馈，三版的侧栏当前项都改成胶囊。卡片组把 22 个工具收进四张任务卡；区块组用整色分区；轻拟物把凸起和凹陷限制在可操作元素上。仍是 440 × 600 实际窗口，仍不改 15 个入口与 22 个工具。</p>
      ${single ? '' : `<nav class="navmap"><a href="index.html">← 第一轮 A/B/C</a><a href="#d">D 卡片</a><a href="#e">E 区块</a><a href="#f">F 柔光</a></nav>`}
    </div>
    <div class="mast-meta">ROUND 02<br>440 × 600<br>LIGHT / DARK<br>NO PUSH</div>
  </header>
  ${single ? '' : `<div class="scope"><span><b>侧栏统一胶囊。</b> 当前项不再用方角色块或左竖线。三版都保留 15 个入口、22 个工具和现有操作路径。</span><span>建议先看 D 卡片</span></div>
  <p class="color-note"><b>说明：</b>D 与 E 按任务把首页分成四组，这是信息组织的变化，不只换皮；F 保持 22 个工具平铺，只改材质与触感。主信号色仍可保留现有品牌紫 #7135DB。</p>`}`;
}

const doc2 = (body, single = false) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 第二轮视觉方向</title>
<style>${baseCSS}${dirCSS}${dirCSS2}${presentationCSS}</style>
</head>
<body class="${single ? 'single' : ''}">
<div class="wrap">
${pageHeader2(single)}
${body}
${single ? '' : pageFooter()}
</div>
</body>
</html>`;

fs.writeFileSync(path.join(here, 'round2.html'), doc2(DIRECTIONS2.map(sectionHTML).join('')));
for (const d of DIRECTIONS2) {
  fs.writeFileSync(path.join(here, `direction-${d.id}.html`), doc2(sectionHTML(d), true));
}

const compare2HTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 第二轮方向对比</title><style>${baseCSS}${dirCSS}${dirCSS2}${compareCSS}</style></head>
<body><div class="cmp-wrap">
<header class="cmp-head"><div><div class="kicker">ALL IN ONE / ROUND 02</div><h1>同一屏，三种新语法</h1></div><p>卡片、区块、轻拟物。侧栏当前项统一为胶囊；差别在信息组织、容器层级与材质。</p></header>
<div class="cmp-grid">
${DIRECTIONS2.map(d => `<div class="cmp-col">
  <div class="cmp-top"><div class="cmp-name"><b>${d.name}</b><span>${d.en}</span></div><div class="cmp-no">${d.no}</div></div>
  <p class="cmp-line">${d.thesis}</p>
  ${screen(d.id, 'home', false)}
  <div class="cmp-foot"><span>${d.keywords.join(' / ')}</span><span>440 × 600</span></div>
</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'compare-round2.html'), compare2HTML());

const panels2HTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 第二轮密集面板</title><style>${baseCSS}${dirCSS}${dirCSS2}${panelsCSS}</style></head>
<body><div class="pan-wrap">
<header class="pan-head"><div><div class="kicker">ALL IN ONE / ROUND 02</div><h1>密集面板，三种新语法</h1></div><p>同一屏智能填充与尺寸助手。卡片、区块、轻拟物在真实密度下是否还能保持层级，是这一轮的关键判断。</p></header>
<div class="pan-grid">
${DIRECTIONS2.map(d => `<div class="pan-cell"><div class="pan-name">${d.name}<span>${d.en}</span></div><div class="pan-cap"><span>SMART FILL / LIGHT</span><span>440 × 600</span></div>${screen(d.id, 'fill', false)}</div>`).join('')}
${DIRECTIONS2.map(d => `<div class="pan-cell"><div class="pan-name">${d.name}<span>${d.en}</span></div><div class="pan-cap"><span>SIZE ASSISTANT / LIGHT</span><span>440 × 600</span></div>${screen(d.id, 'size', false)}</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'panels-round2.html'), panels2HTML());

const compareDark2HTML = () => `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All in One · 第二轮深色对比</title><style>${baseCSS}${dirCSS}${dirCSS2}${String.raw`
body{background:#E9E8E2}
.cmp-wrap{width:1440px;margin:0 auto;padding:46px 36px 54px}
.cmp-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #D2CFC6;padding-bottom:20px}
.cmp-head h1{font-size:30px;line-height:1.15;letter-spacing:-.03em;margin:8px 0 0;font-weight:650}
.cmp-head p{font-size:11px;line-height:1.7;color:#625F57;margin:0;width:500px;text-align:right}
.cmp-grid{display:grid;grid-template-columns:repeat(3,440px);gap:24px;margin-top:24px}
.cmp-col{width:440px}
.cmp-top{display:flex;align-items:baseline;justify-content:space-between;padding:0 2px 8px}
.cmp-name{display:flex;align-items:baseline;gap:9px}
.cmp-name b{font-size:16px;letter-spacing:-.02em}
.cmp-name span{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.14em;color:#7B786F}
.cmp-no{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:8px;letter-spacing:.1em;color:#7B786F}
.cmp-line{font-size:10px;line-height:1.7;color:#5F5C53;margin:0 2px 12px;min-height:34px}
.cmp-foot{font-size:9.5px;line-height:1.7;color:#6B675D;margin:10px 2px 0;display:flex;justify-content:space-between;gap:10px}
`}</style></head>
<body><div class="cmp-wrap">
<header class="cmp-head"><div><div class="kicker">ALL IN ONE / ROUND 02</div><h1>深色模式，三种新语法</h1></div><p>胶囊当前项、卡片边界、区块色与柔光层，在深色里需要重新配平，而不是简单反相。</p></header>
<div class="cmp-grid">
${DIRECTIONS2.map(d => `<div class="cmp-col">
  <div class="cmp-top"><div class="cmp-name"><b>${d.name}</b><span>${d.en}</span></div><div class="cmp-no">${d.no}</div></div>
  <p class="cmp-line">${d.principle}</p>
  ${screen(d.id, 'home', true)}
  <div class="cmp-foot"><span>${d.keywords.join(' / ')}</span><span>440 × 600</span></div>
</div>`).join('')}
</div>
</div></body></html>`;
fs.writeFileSync(path.join(here, 'compare-dark-round2.html'), compareDark2HTML());

console.log('Built round2.html, compare-round2.html, compare-dark-round2.html, panels-round2.html and 3 direction pages.');
