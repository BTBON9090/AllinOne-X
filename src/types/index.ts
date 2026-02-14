export interface PluginMessage {
  type: string;
  [key: string]: any;
}

export interface SelectionInfo {
  count: number;
  nodes: TextNodeInfo[];
}

export interface TextNodeInfo {
  id: string;
  name: string;
  characters: string;
}

export interface SmartFillItem {
  key: string;
  label: string;
  labelEn?: string;
  hasSetting?: boolean;
  allowAI?: boolean;
  gen?: () => string;
  tags?: string[];
}

export interface SmartFillSettings {
  number: {
    min: number;
    max: number;
    decimal: number;
    thousand: boolean;
    sort: 'random' | 'asc' | 'desc';
  };
  date: {
    format: string;
    sort: 'random' | 'asc' | 'desc';
    start: string;
    end: string;
  };
  time: {
    format: string;
    start: string;
    end: string;
  };
}

export interface DesignTheory {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  category: string;
  tags?: string[];
}

export interface AIAPIConfig {
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface FindReplaceResult {
  id: string;
  index: number;
  text: string;
  nodeId: string;
  selected?: boolean;
  done?: boolean;
}

export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface CacheData {
  [key: string]: any;
}

export interface ErrorHandlerError {
  type: 'sync' | 'promise' | 'resource';
  message: string;
  source?: string;
  line?: number;
  col?: number;
  stack?: string;
  time: number;
}

export type Language = 'zh' | 'en';
export type Theme = 'light' | 'dark';

export interface AppState {
  lang: Language;
  theme: Theme;
  compact: boolean;
  currentPanel: string;
}

export interface I18nDict {
  [key: string]: string;
}

export interface I18n {
  zh: I18nDict;
  en: I18nDict;
}
