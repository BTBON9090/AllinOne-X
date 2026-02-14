import { useState, useEffect, useCallback } from 'preact/hooks';
import { Language, Theme, AppState } from '../types';
import { PersistentCache } from '../utils/cache';

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLangState] = useState<Language>(
    PersistentCache.get('user_lang') || 'zh'
  );
  
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    PersistentCache.set('user_lang', newLang);
  }, []);
  
  return [lang, setLang];
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(
    PersistentCache.get('user_theme') || 'light'
  );
  
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    PersistentCache.set('user_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return [theme, setTheme];
}

export function useCompact(): [boolean, (compact: boolean) => void] {
  const [compact, setCompactState] = useState<boolean>(
    PersistentCache.get('compact_mode') || false
  );
  
  const setCompact = useCallback((newCompact: boolean) => {
    setCompactState(newCompact);
    PersistentCache.set('compact_mode', newCompact);
    document.documentElement.classList.toggle('compact-mode', newCompact);
  }, []);
  
  return [compact, setCompact];
}

export function useAppState(): AppState {
  const [lang] = useLanguage();
  const [theme] = useTheme();
  const [compact] = useCompact();
  const [currentPanel, setCurrentPanel] = useState('toolPanel');
  
  return { lang, theme, compact, currentPanel };
}
