import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { useLanguage, useTheme, useCompact } from '../hooks';
import { t } from '../utils/i18n';
import { Button, IconButton, Toggle } from '../components';
import { PPTPanel } from './PPT';

export interface SidebarProps {
  currentPanel: string;
  onPanelChange: (panel: string) => void;
}

const navItems = [
  { id: 'toolPanel', icon: '🏠', label: 'nav_smart' },
  { id: 'textPanel', icon: '📝', label: 'nav_text' },
  { id: 'pptPanel', icon: '📊', label: 'nav_ppt' },
  { id: 'refinerPanel', icon: '🔍', label: 'nav_check' },
  { id: 'theoryPanel', icon: '📚', label: 'nav_theory' },
];

export function Sidebar({ currentPanel, onPanelChange }: SidebarProps) {
  return (
    <nav class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">⚡</span>
      </div>
      
      <div class="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            class={`nav-item ${currentPanel === item.id ? 'active' : ''}`}
            onClick={() => onPanelChange(item.id)}
            title={t(item.label)}
          >
            <span class="nav-icon">{item.icon}</span>
            <span class="nav-label">{t(item.label)}</span>
          </button>
        ))}
      </div>
      
      <div class="sidebar-footer">
        <button
          class="nav-item"
          onClick={() => onPanelChange('settingsPanel')}
          title={t('nav_settings')}
        >
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">{t('nav_settings')}</span>
        </button>
      </div>
    </nav>
  );
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: any;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header class="panel-header">
      <div class="header-left">
        <h2 class="header-title">{title}</h2>
        {subtitle && <span class="header-subtitle">{subtitle}</span>}
      </div>
      {actions && <div class="header-actions">{actions}</div>}
    </header>
  );
}

export interface SettingsPanelProps {}

export function SettingsPanel({}: SettingsPanelProps) {
  const [lang, setLang] = useLanguage();
  const [theme, setTheme] = useTheme();
  const [compact, setCompact] = useCompact();
  
  return (
    <div class="panel settings-panel">
      <Header title={t('nav_settings')} />
      
      <div class="settings-content">
        <div class="settings-group">
          <label class="settings-label">{t('lang_zh')} / {t('lang_en')}</label>
          <div class="settings-control">
            <Button
              variant={lang === 'zh' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setLang('zh')}
            >
              中文
            </Button>
            <Button
              variant={lang === 'en' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setLang('en')}
            >
              EN
            </Button>
          </div>
        </div>
        
        <div class="settings-group">
          <label class="settings-label">{t('theme_light')} / {t('theme_dark')}</label>
          <div class="settings-control">
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              ☀️
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              🌙
            </Button>
          </div>
        </div>
        
        <div class="settings-group">
          <Toggle
            checked={compact}
            onChange={setCompact}
            label="Compact Mode"
          />
        </div>
      </div>
    </div>
  );
}
