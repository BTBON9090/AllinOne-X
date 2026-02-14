import { CacheData } from '../types';

export const MemoryCache = {
  _data: {} as CacheData,
  
  get<T = any>(key: string): T | undefined {
    return this._data[key];
  },
  
  set<T = any>(key: string, value: T): T {
    this._data[key] = value;
    return value;
  },
  
  has(key: string): boolean {
    return key in this._data;
  },
  
  remove(key: string): void {
    delete this._data[key];
  },
  
  clear(): void {
    this._data = {};
  }
};

export const PersistentCache = {
  prefix: 'allinone_',
  
  get<T = any>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('[Cache] Read error:', e);
      return null;
    }
  },
  
  set<T = any>(key: string, value: T): T | null {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return value;
    } catch (e) {
      console.warn('[Cache] Write error:', e);
      return null;
    }
  },
  
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.warn('[Cache] Remove error:', e);
    }
  },
  
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[Cache] Clear error:', e);
    }
  }
};
