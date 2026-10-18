/* Bind only UI-owned text and attributes. Drafts, layer names, generated results,
   component properties and message history retain their original content. */
(() => {
  const reviewedEnglish = {
    nav_simple:'Quick Tools', nav_text:'Find & Replace', nav_ppt:'PPT Export',
    nav_refiner:'Component Cleanup', nav_jumpback:'Viewport Bookmarks',
    nav_skew:'Isometric Transform', nav_i18n:'Language Switch', nav_component_builder:'Component Builder',
    skew_left_wall:'Right vertical', skew_right_wall:'Left vertical',
    skew_left_lie:'Right horizontal', skew_right_lie:'Left horizontal',
    sf_tab_ai:'AI Generation', sf_btn_seq:'Fill in Order', sf_btn_rnd:'Fill Randomly',
    sf_btn_save_list:'Save as Custom List', sf_sub_cfg_title:'AI Settings',
    sf_tag_zip:'Include postal code', sf_tag_comma:'Thousands separator',
    sf_tag_noproto:'No protocol', sf_tag_long:'Long path', sf_tag_port:'With port',
    sf_btn_save_cfg:'Save Settings', sf_btn_save_fill:'Save & Fill',
    sf_lbl_baseurl:'API Base URL', sf_lbl_model:'Model', sf_cfg_range:'Range (minimum–maximum)',
    sf_cfg_time_help:'Enter hours and minutes; seconds are generated randomly.',
    sf_cfg_decimal:'Decimal places (0 for integers)', sf_cfg_thous:'Use thousands separators (1,000)',
    sf_cfg_sort:'Sort order', sf_sort_date_asc:'Oldest first', sf_sort_date_desc:'Newest first',
    sf_sort_time_asc:'Earliest first', sf_sort_time_desc:'Latest first',
    sf_time_fmt_cn:'Chinese long format', sf_lbl_province:'Province / city / district',
    sf_lbl_community:'Residential community', sf_lbl_bank:'Bank card number',
    sf_lbl_news_title:'News headline', sf_lbl_lorem:'Quotations',
    sf_btn_new_list:'Save as New List', sf_btn_append_list:'Append to List',
    settings_lang_zh:'Chinese', settings_theme_system:'Follow system', btn_lang:'ZH / EN',
    settings_ai:'AI Settings', target_comp_name:'Component name', target_prop_name:'Property name',
    target_prop_value:'Property value', ref_chip_pname:'Property name', ref_chip_pval:'Property value',
    ref_chip_pname_title:'Component name', ref_chip_prop_key_title:'Property name',
    ref_chip_prop_val_title:'Property value', lbl_case:'Naming style', opt_keep_orig:'Keep original',
    opt_unmark:'Remove hidden-name prefix (. / _)', opt_mark_hidden:'Add hidden-name prefix (.)',
    opt_id:'Clean ID suffixes from names', lbl_opt:'Cleanup options',
    empty_perfect_title:'All clear', btn_reset:'Reset Settings', ref_btn_find_preview:'Preview Matches',
    ref_success_title:'Changes applied', ref_success_btn:'Continue with Remaining Items',
    cb_subtitle:'Create reusable components from one or more frames.',
    cb_reverse_title:'Rebuild Main Component', cb_reverse_btn:'Rebuild Selected Instance',
    cb_create_title:'Create Components from Frames', cb_mode_single:'Single Component',
    cb_mode_multiple:'Separate Components', cb_expose_text:'Expose text as properties',
    cb_expose_instance:'Expose nested instance swaps', cb_create_btn:'Create Components',
    ck_tab_showcase:'Documentation', ck_scope_single:'Single Documentation Frame',
    ck_scope_batch:'Batch Catalog', ck_builtin_preset:'Built-in Preset',
    ck_preset_landscape_minimal:'Minimal Landscape', ck_preset_portrait_full:'Detailed Portrait',
    ck_matrix_desc:'Arrange a component set’s variants in a matrix.',
    ck_showcase_title:'Component Documentation', ck_showcase_desc:'Create a component documentation frame.',
    ck_config:'Layout Settings', ck_compset_settings:'Component Set Settings',
    ck_board_settings:'Frame Settings', ck_draw_options:'Display Options',
    ck_draw_grid:'Show dashed grid', ck_draw_labels:'Show axis labels',
    ck_draw_props:'Show property summary', ck_draw_usage:'Show usage guide',
    ck_lang_zh:'Chinese', ck_ai_description:'Generate descriptions with AI',
    ck_ai_generating:'AI is analyzing the component…', ck_btn_showcase:'Generate Documentation',
    ck_tag_updated:'Last updated', ck_status_review:'Awaiting review',
    sel_scope_in:'Within', sel_scope_page:'Whole page', sel_ph_name:'Enter a layer name…', sel_title_prop:'Advanced Properties',
    sel_t_compset:'Component Set', sel_t_section:'Section', sel_t_auto:'Auto Layout',
    sel_s_hidden:'Hidden', sel_s_export:'Exportable', sel_s_clip:'Clips content',
    sel_s_nochild:'No children', sel_state_all:'All states', sel_title_state:'State',
    txt_btn_exec:'Replace', txt_btn_find:'Find', txt_btn_finding:'Finding…',
    txt_title_config:'Find settings', txt_restore:'Restore settings', find_replace_complete:'Replacement complete',
    find_continue_btn:'Find Again', refiner_fix_success:'Changes applied',
    i18n_detect_title:'Scan Text', i18n_unbound_only:'Unbound Text', i18n_scan_total:'Text layers scanned',
    i18n_bound_count:'Bound text layers', i18n_unbound_count:'Unbound text layers',
    i18n_action_title:'Translation Settings', i18n_target_lang_collection:'Target Language & Variable Collection',
    i18n_target_lang:'Target language', i18n_collection_prefix:'Variable collection',
    i18n_action_replace:'Direct Replace', i18n_bind_btn:'Confirm & Bind Variables',
    ppt_tip_1:'Duplicate the current page before exporting. Include “copy” in the duplicate’s name.',
    ppt_btn_auto:'Export PPT Automatically', ppt_btn_manual:'Download Assets Manually',
    ppt_step1_t:'1. Clean Up Layers', ppt_step3_t:'3. Flatten Layers', ppt_stat_wait:'Ready',
    ppt_tip_4:'A 1920 × 1080 frame has a 16:9 aspect ratio. Enable 0.5× scaling to export at half size.',
    ppt_tip_5:'Reset restarts the plugin workflow. Use the editor’s Undo command to restore canvas changes.',
    dup_btn_fill:'Apply Color Markers', dup_btn_fill_title:'Mark selected left-side layers red and right-side layers green',
    dup_ai_fail:'AI filtering failed. All initial matches were kept.', dup_btn_last:'Previous Results'
  };
  Object.assign(i18n.en, reviewedEnglish);
  i18n.zh.sf_prefix = '前缀'; i18n.zh.sf_suffix = '后缀';
  i18n.zh.sel_scope_page = '全页';
  i18n.zh.sf_cfg_time_help = '支持时、分、秒；随机模式会在指定范围内生成。';
  i18n.en.sf_cfg_time_help = 'Supports hours, minutes and seconds. Random mode uses the selected time range.';
  i18n.zh.refiner_fix_count_suffix = '项。点击继续，返回列表处理剩余项。';
  i18n.en.refiner_fix_count_suffix = 'items. Click Continue to review the remaining items.';
  i18n.zh.sf_privacy_note = 'API 配置保存在本地；使用 AI 时，请求会发送至所选的服务商或代理。';
  i18n.en.sf_privacy_note = 'API settings are stored locally. AI requests are sent to the selected provider or proxy.';
  // Correct array descriptions as well as short labels.
  i18n.en.sort_layers = ['Sort by Position','Visual layer order','Reorder layers by their canvas position, top to bottom and left to right. Click again to reverse the order.','Layers sorted.'];
  i18n.en.up_all = ['Move to Page Root','Move out of nested containers','Move selected layers to the page’s root level.','Moved to page root.'];
  i18n.en.create_styles = ['Create Local Styles','Create reusable styles','Create local fill, text and effect styles from the selection, checking for existing names.','Style check complete.'];
  const stripIcon = text => text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim();
  const pairs = [];
  for (const [key, zh] of Object.entries(i18n.zh)) {
    const en = i18n.en[key];
    if (Array.isArray(zh) && Array.isArray(en)) zh.forEach((value, index) => pairs.push([value, en[index]]));
    else if (typeof zh === 'string' && typeof en === 'string') pairs.push([zh, en]);
  }
  PluginLocale.addPairs(pairs);
  PluginLocale.addPairs(pairs.filter(([zh,en]) => typeof zh === 'string' && typeof en === 'string').map(([zh,en]) => [stripIcon(zh), stripIcon(en)]));
  const language = () => curLang === 'en' ? 'en' : 'zh';
  const t = text => PluginLocale.translate(text, language());
  const protectedContent = 'script,style,svg,textarea,[contenteditable],[data-user-content],#dashGreeting,#aiResultArea,#i18nTransList,.text-preview-main,.smart-label,.tc-tooltip,.sel-result-name,.comp-info,.dup-pair-name,.res-old,.res-new,.res-name,.res-text,.txt-old,.txt-new,.d-col-name,.dup-layer-name,#builderSelectionNames,.theory-chat-message,#theoryDetailDynamicContent,#detailMainDesc,#saveTargetSelect,#dialogListSelect,#dialogTargetSelect,#compkitXSelect option:not([value=""]),#compkitYSelect option:not([value=""]),#i18nCollectionControl option:not([value=""])';
  const textBindings = new Map(), attributeBindings = new Map();
  const attributes = ['placeholder','title','aria-label','data-tooltip','label'];
  function bindText(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest(protectedContent)) return;
    const ownerKey = parent.closest('[data-key]')?.getAttribute('data-key');
    if (ownerKey && i18n[curLang]?.[ownerKey] !== undefined) return;
    const current = node.nodeValue, bound = textBindings.get(node);
    const source = bound && current === bound.output ? bound.source : current;
    const translated = t(source);
    if (PluginLocale.translate(source, 'en') === source) { textBindings.delete(node); return; }
    textBindings.set(node, { source, output:translated });
    if (current !== translated) node.nodeValue = translated;
  }
  function bindAttributes(element) {
    if (element.closest(protectedContent) && !element.matches('textarea,#aiResultArea')) return;
    const bound = attributeBindings.get(element) || new Map();
    for (const name of attributes) {
      if (!element.hasAttribute(name) || name === 'label' && element.tagName !== 'OPTGROUP') continue;
      if (name === 'title' && element.hasAttribute('data-key-title')) continue;
      if (name === 'placeholder' && element.hasAttribute('data-key')) continue;
      const current = element.getAttribute(name), previous = bound.get(name);
      const source = previous && current === previous.output ? previous.source : current;
      const translated = t(source);
      if (PluginLocale.translate(source, 'en') === source) { bound.delete(name); continue; }
      bound.set(name, { source, output:translated });
      if (current !== translated) element.setAttribute(name, translated);
    }
    if (bound.size) attributeBindings.set(element, bound); else attributeBindings.delete(element);
  }
  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) { bindText(root); return; }
    if (!(root instanceof Element)) return;
    if (root.closest(protectedContent)) {
      if (root.matches('textarea,#aiResultArea')) bindAttributes(root);
      return;
    }
    bindAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) bindText(walker.currentNode);
    root.querySelectorAll('[placeholder],[title],[aria-label],[data-tooltip],optgroup').forEach(bindAttributes);
  }
  let sentLanguage;
  function refresh() {
    if (sentLanguage !== language()) {
      sentLanguage = language();
      postMsg('ui-language-changed', { language:sentLanguage });
    }
    for (const [node, bound] of textBindings) {
      if (!node.isConnected) { textBindings.delete(node); continue; }
      bindText(node);
    }
    for (const [element] of attributeBindings) {
      if (!element.isConnected) { attributeBindings.delete(element); continue; }
      bindAttributes(element);
    }
    scan(document.body);
  }
  const pending = new Set(); let scheduled = false;
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') pending.add(record.target);
      else if (record.type === 'characterData') pending.add(record.target);
      else record.addedNodes.forEach(node => pending.add(node));
    }
    if (!scheduled && pending.size) {
      scheduled = true;
      queueMicrotask(() => { scheduled = false; const roots = [...pending]; pending.clear(); roots.forEach(scan); });
    }
  }).observe(document.body, { subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:attributes });
  for (const method of ['alert','confirm','prompt']) {
    const original = window[method].bind(window);
    window[method] = (message, ...rest) => original(t(message), ...rest);
  }
  window.PluginLocalization = Object.freeze({ refresh, t, reviewedEnglish });
  updateLanguage();
})();
