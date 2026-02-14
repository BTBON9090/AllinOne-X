import { I18n, Language } from '../types';
import { PersistentCache } from './cache';

export const i18n: I18n = {
  zh: {
    nav_smart: "智能填充",
    nav_text: "文本处理",
    nav_ppt: "PPT导出",
    nav_check: "智能检查",
    nav_theory: "设计理论",
    nav_settings: "设置",
    
    sf_tab_basic: "基础填充",
    sf_tab_ai: "AI生成",
    sf_tab_custom: "自定义",
    
    btn_fill: "填充",
    btn_cancel: "取消",
    btn_save: "保存",
    btn_confirm: "确定",
    btn_reset: "重置",
    
    theme_light: "浅色",
    theme_dark: "深色",
    lang_zh: "中文",
    lang_en: "English",
    
    err_no_selection: "请先选择文本图层",
    err_no_input: "请输入内容",
    err_api_key: "请先配置API Key",
    
    success_fill: "填充完成",
    success_save: "保存成功",
    
    loading: "加载中...",
    searching: "搜索中...",
    
    txt_ph_find: "请输入查找关键词",
    txt_ph_replace: "替换为",
    txt_btn_find: "开始查找",
    txt_btn_replace: "替换选中项",
    txt_btn_replace_all: "全部替换",
    txt_no_results: "未找到匹配项",
    txt_results: "找到 {count} 个结果"
  },
  en: {
    nav_smart: "Smart Fill",
    nav_text: "Text Tools",
    nav_ppt: "PPT Export",
    nav_check: "Smart Check",
    nav_theory: "Design Theory",
    nav_settings: "Settings",
    
    sf_tab_basic: "Basic",
    sf_tab_ai: "AI Generate",
    sf_tab_custom: "Custom",
    
    btn_fill: "Fill",
    btn_cancel: "Cancel",
    btn_save: "Save",
    btn_confirm: "Confirm",
    btn_reset: "Reset",
    
    theme_light: "Light",
    theme_dark: "Dark",
    lang_zh: "中文",
    lang_en: "English",
    
    err_no_selection: "Please select text layers first",
    err_no_input: "Please enter content",
    err_api_key: "Please configure API Key first",
    
    success_fill: "Fill completed",
    success_save: "Saved successfully",
    
    loading: "Loading...",
    searching: "Searching...",
    
    txt_ph_find: "Enter search keyword",
    txt_ph_replace: "Replace with",
    txt_btn_find: "Find",
    txt_btn_replace: "Replace Selected",
    txt_btn_replace_all: "Replace All",
    txt_no_results: "No matches found",
    txt_results: "Found {count} results"
  }
};

let currentLang: Language = PersistentCache.get('user_lang') || 'zh';

export function getLang(): Language {
  return currentLang;
}

export function setLang(lang: Language): void {
  currentLang = lang;
  PersistentCache.set('user_lang', lang);
}

export function toggleLang(): Language {
  const newLang = currentLang === 'zh' ? 'en' : 'zh';
  setLang(newLang);
  return newLang;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = i18n[currentLang] || i18n.zh;
  let text = dict[key] || key;
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  
  return text;
}
