// Reuse the original controls so canvas actions, tooltips and keyboard handling
// stay attached as the catalog is grouped and localized.
(() => {
  const grid = document.getElementById('toolGrid');
  if (!grid) return;

  const groups = [
    ['layout', '画板与布局', 'Frames & layout', [
      'to_frame', 'to_rect', 'add_al_wrapper', 'remove_al', 'pixel_perfect', 'swap_positions'
    ]],
    ['layers', '图层整理', 'Organize layers', [
      'up_one', 'up_all', 'sort_layers', 'sort_by_name', 'ungroup_all', 'unlock_all', 'rename_content', 'remove_hidden'
    ]],
    ['objects', '文本与组件', 'Text & components', [
      'split_text', 'join_text', 'reverse_component', 'detach_all'
    ]],
    ['styles', '图像与样式', 'Images & styles', [
      'reset_image', 'swap_fs', 'create_styles', 'match_styles'
    ]]
  ];
  const commands = new Map(Array.from(grid.querySelectorAll('.tool-card'), node => [node.dataset.key, node]));
  const headings = [];
  for (const [key, zh, en, keys] of groups) {
    const controls = keys.map(id => commands.get(id)).filter(Boolean);
    if (!controls.length) continue;
    const section = document.createElement('section');
    section.className = 'tool-home-section';
    section.dataset.group = key;
    const heading = document.createElement('h2');
    heading.id = 'tool-home-' + key;
    heading.className = 'tool-home-heading';
    section.setAttribute('aria-labelledby', heading.id);
    const list = document.createElement('div');
    list.className = 'tool-home-commands';
    for (const control of controls) {
      const title = control.querySelector('.tc-title');
      title.id = 'tool-name-' + control.dataset.key;
      control.setAttribute('aria-labelledby', title.id);
      list.append(control);
    }
    section.append(heading, list);
    grid.append(section);
    headings.push({heading, zh, en});
  }
  grid.classList.add('tool-home');
  grid.parentElement.classList.add('tool-home-scroll');
  function refresh() {
    const english = curLang === 'en';
    for (const {heading, zh, en} of headings) heading.textContent = english ? en : zh;
  }
  window.ToolHome = {refresh};
  refresh();
})();
