// 共享常量
// 应用信息
export const APP_NAME = 'AllinOne-CC';
export const APP_VERSION = '2.0.0';
// 窗口尺寸
export const WINDOW_MIN_WIDTH = 400;
export const WINDOW_MIN_HEIGHT = 500;
export const WINDOW_DEFAULT_WIDTH = 460;
export const WINDOW_DEFAULT_HEIGHT = 640;
// 侧边栏
export const SIDEBAR_WIDTH = 140;
export const SIDEBAR_WIDTH_COLLAPSED = 56;
// 存储键前缀
export const STORAGE_PREFIX = 'allinone_';
// 默认配置
export const DEFAULT_THEME = 'system';
export const DEFAULT_LANGUAGE = 'zh';
// 动画持续时间
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
};
// 防抖延迟
export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    RESIZE: 150,
    INPUT: 200,
};
// 节流延迟
export const THROTTLE_DELAY = {
    SCROLL: 100,
    RESIZE: 150,
};
// 通知持续时间
export const NOTIFICATION_DURATION = {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
};
// 缓存过期时间（毫秒）
export const CACHE_EXPIRY = {
    SHORT: 5 * 60 * 1000, // 5分钟
    MEDIUM: 30 * 60 * 1000, // 30分钟
    LONG: 24 * 60 * 60 * 1000, // 24小时
};
// 批量操作大小
export const BATCH_SIZE = {
    SMALL: 50,
    MEDIUM: 100,
    LARGE: 200,
};
// AI 默认配置
export const AI_DEFAULTS = {
    PROVIDER: 'openai',
    MODEL: 'gpt-4',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 2000,
};
// 功能模块 ID
export const FEATURE_IDS = {
    SIMPLE_TOOLS: 'simple',
    SUPER_SELECT: 'select',
    SMART_FILL: 'smartFill',
    TEXT_REPLACE: 'text',
    PPT_EXPORT: 'ppt',
    REFINER: 'refiner',
    JUMPBACK: 'jumpback',
    SKEW: 'skew',
    I18N: 'i18n',
    THEORY: 'theory',
};
