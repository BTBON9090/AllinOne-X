/* Build practice material from native, editable nodes. Every selected target
   is inside a new board, including the two independent sides of a comparison. */
async function createComponentDemo(host, platform, msg) {
  const figmaHost = platform === 'figma';
  const currentPage = () => figmaHost ? host.currentPage : host.document.currentPage;
  const page = currentPage();
  const local = (zh, en) => msg.uiLanguage === 'en' ? en : zh;
  const titles = {
    lint: local('组件命名检查', 'Component name cleanup'),
    find: local('组件名称替换', 'Find and replace component names'),
    translate: local('组件名称翻译', 'Translate component names'),
    compkit: local('组件变体矩阵', 'Component variant matrix'),
    build: local('构建按钮组件', 'Build a button family'),
    naming: local('图标图层命名', 'Name icon layers'),
    duplicate: local('比较两个画板', 'Compare two frames')
  };
  if (!Object.prototype.hasOwnProperty.call(titles, msg.kind)) {
    throw new Error(local('未知的示例类型。', 'Unknown example type.'));
  }
  let font = { family: 'Inter', style: 'Regular' };
  try {
    if (await host.loadFontAsync(font) === false) throw new Error();
  } catch (_) {
    const fonts = (await host.listAvailableFontsAsync()).map(entry => entry.fontName);
    font = fonts.find(f => f.style === 'Regular' && ['Roboto', 'Arial', 'Noto Sans', 'Noto Sans SC'].includes(f.family))
      || fonts.find(f => f.style === 'Regular' && f.family !== 'Inter');
    if (!font || await host.loadFontAsync(font) === false) {
      throw new Error(local('无法加载示例所需的文字字体。', 'Could not load a font for the example labels.'));
    }
  }
  if (page.id !== currentPage().id) {
    throw new Error(local('页面已切换，请在当前页重新生成。', 'The page changed. Create the example on the current page.'));
  }

  const created = [];
  const oldSelection = [...page.selection];
  const oldCenter = host.viewport.center;
  const oldZoom = host.viewport.zoom;
  const ink = 0x28233d, purple = 0x5632a0, soft = 0xede8f9;
  const paper = 0xffffff, muted = 0x5d566e;

  function remember(node) {
    created.push(node);
    return node;
  }
  function fill(node, hex) {
    const rgb = { r: ((hex >> 16) & 255) / 255, g: ((hex >> 8) & 255) / 255, b: (hex & 255) / 255 };
    node.fills = [{ type: 'SOLID', color: figmaHost ? rgb : { ...rgb, a: 1 } }];
  }
  function place(parent, node, name, x, y) {
    parent.appendChild(node);
    node.name = name;
    node.x = x;
    node.y = y;
    return node;
  }
  function surface(parent, type, name, x, y, width, height, color, radius = 0) {
    const node = remember(host[type]());
    node.resize(width, height);
    fill(node, color);
    if (radius) node.cornerRadius = radius;
    return place(parent, node, name, x, y);
  }
  function label(parent, name, content, x, y, size, color) {
    const text = remember(host.createText());
    if (figmaHost) {
      text.fontName = font;
      text.fontSize = size;
      text.characters = content;
    } else {
      text.characters = content;
      text.setRangeFontName(0, content.length, font);
      text.setRangeFontSize(0, content.length, size);
    }
    fill(text, color);
    return place(parent, text, name, x, y);
  }
  function button(parent, type, name, x, y, small, state, tone, caption, textName = 'Label') {
    const height = small ? 32 : 40;
    const bg = state === 'Disabled' ? 0xe6e3eb : tone === 'Secondary' ? soft : purple;
    const fg = state === 'Disabled' ? muted : tone === 'Secondary' ? purple : paper;
    const node = surface(parent, type, name, x, y, small ? 104 : 122, height, bg, 8);
    const text = label(node, textName, caption, 12, 0, small ? 12 : 14, fg);
    text.x = Math.round((node.width - text.width) / 2);
    text.y = Math.round((height - text.height) / 2);
    return node;
  }
  function buildButtons(board, variantSet) {
    const entries = [];
    for (const tone of (variantSet ? ['Primary', 'Secondary'] : ['Primary'])) {
      for (const size of ['Small', 'Large']) {
        for (const state of ['Default', 'Disabled']) {
          const i = entries.length;
          const values = { Size: size, State: state, Tone: tone };
          const name = variantSet ? `Size=${size}, State=${state}, Tone=${tone}` : `Button / ${size} / ${state}`;
          const node = button(board, variantSet ? 'createComponent' : 'createFrame', name,
            24 + (i % 2) * 144, 64 + Math.floor(i / 2) * 54,
            size === 'Small', state, tone, local('继续', 'Continue'));
          entries.push({ node, values });
        }
      }
    }
    const nodes = entries.map(entry => entry.node);
    if (!variantSet) return nodes;
    const set = remember(figmaHost ? host.combineAsVariants(nodes, board) : host.combineAsVariants(nodes));
    if (set.parent?.id !== board.id) board.appendChild(set);
    if (figmaHost) set.layoutMode = 'NONE';
    else {
      set.flexMode = 'NONE';
      const keys = Object.keys(entries[0].values);
      const existing = set.componentPropertyValues.filter(p => p.type === 'VARIANT').map(p => p.name);
      const missing = keys.filter(key => !existing.includes(key));
      if (missing.length) set.createVariantProperties(missing);
      for (const { node, values } of entries) node.setVariantPropertyValues(values);
      for (const name of existing.filter(name => !keys.includes(name))) set.deleteVariantProperty(name);
    }
    set.name = 'Button';
    set.resize(296, 230);
    entries.forEach(({node}, i) => {
      node.x = 12 + (i % 2) * 144;
      node.y = 12 + Math.floor(i / 2) * 54;
    });
    set.x = 20;
    set.y = 50;
    return [set];
  }
  function refiner(board, kind) {
    const samples = {
      lint: ['primary__button', 'BUTTON--secondary', 'button  Disabled'],
      find: ['Legacy / Save', 'Legacy / Cancel', 'Legacy / Archive'],
      translate: ['状态标签 / 可用', '状态标签 / 草稿', '状态标签 / 停用']
    };
    const captions = kind === 'translate' ? ['可用', '草稿', '停用'] : kind === 'find'
      ? [local('保存', 'Save'), local('取消', 'Cancel'), local('归档', 'Archive')]
      : [local('提交', 'Submit'), local('取消', 'Cancel'), local('停用', 'Disabled')];
    return samples[kind].map((name, i) => button(board, 'createComponent', name,
      24 + 124 * i, 58, true, i === 2 ? 'Disabled' : 'Default', i === 1 ? 'Secondary' : 'Primary', captions[i]));
  }
  function iconLayers(board) {
    return ['01', '02', '03'].map((number, i) => {
      const tile = surface(board, 'createFrame', 'Frame ' + number, 24 + i * 76, 58, 56, 56, soft, 12);
      function bar(x, y, w, h) {
        surface(tile, 'createRectangle', 'Rectangle', x, y, w, h, purple, 2);
      }
      if (i === 0) { bar(16, 26, 24, 4); bar(26, 16, 4, 24); }
      else if (i === 1) { for (const y of [18, 26, 34]) bar(16, y, 24, 4); }
      else { for (const x of [16, 25, 34]) surface(tile, 'createEllipse', 'Ellipse', x, 25, 6, 6, purple); }
      return tile;
    });
  }
  function compareFrames(board) {
    return ['Cart', 'Receipt'].map((name, i) => {
      const frame = surface(board, 'createFrame', name, 20 + 204 * i, 54, 186, 134, 0xf3f1f7, 12);
      label(frame, name, i ? local('收据', 'Receipt') : local('购物车', 'Cart'), 14, 12, 16, ink);
      // Identical label and geometry on both sides; the second action differs.
      button(frame, 'createFrame', 'Status / Verified', 14, 42, true, 'Default', 'Secondary', local('已验证', 'Verified'), 'Verification');
      const action = i ? 'Download' : 'Checkout';
      button(frame, 'createFrame', action, 14, 84, true, 'Default', i ? 'Secondary' : 'Primary',
        i ? local('下载', 'Download') : local('结算', 'Checkout'), action);
      return frame;
    });
  }
  const sizes = { compkit: [336, 300], build: [320, 180], naming: [256, 138], duplicate: [430, 210] };
  const [width, height] = sizes[msg.kind] || [400, 116];
  const y = Math.round(oldCenter.y - height / 2);
  let x = Math.round(oldCenter.x - width / 2);
  // Only inspect top-level bounds. Place the demo in the closest clear gap to
  // the right, including when a user generates another demo in the same view.
  const blockers = page.children.map(node => node.absoluteBoundingBox || node)
    .filter(box => Number.isFinite(box.x) && box.y < y + height + 32 && box.y + box.height + 32 > y)
    .sort((a, b) => a.x - b.x);
  for (const box of blockers) {
    if (x + width + 32 <= box.x) break;
    if (x < box.x + box.width + 32) x = Math.ceil(box.x + box.width + 32);
  }
  let focusing = false;
  try {
    host.commitUndo();
    const board = surface(page, 'createFrame', local('AllinOne 示例 · ', 'AllinOne example · ') + titles[msg.kind],
      x, y, width, height, paper, 14);
    // Subsequent build and matrix commands can put their results beside the
    // originals inside this board. Let those editable results remain visible.
    board.clipsContent = false;
    label(board, titles[msg.kind], titles[msg.kind], 20, 16, 17, ink);
    let selection;
    if (msg.kind === 'build' || msg.kind === 'compkit') selection = buildButtons(board, msg.kind === 'compkit');
    else if (msg.kind === 'duplicate') selection = compareFrames(board);
    else if (msg.kind === 'naming') selection = iconLayers(board);
    else selection = refiner(board, msg.kind);
    page.selection = selection;
    focusing = true;
    host.viewport.scrollAndZoomIntoView([board]);
    host.commitUndo();
    return { count: selection.length };
  } catch (error) {
    for (const node of created.reverse()) {
      try { if (!node.removed) node.remove(); } catch (_) {}
    }
    try { page.selection = oldSelection.filter(node => !node.removed); } catch (_) {}
    if (focusing) {
      try { host.viewport.zoom = oldZoom; host.viewport.center = oldCenter; } catch (_) {}
    }
    throw error;
  }
}
