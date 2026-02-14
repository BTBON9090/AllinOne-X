import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache, PersistentCache } from '../utils/cache';

describe('MemoryCache', () => {
  beforeEach(() => {
    MemoryCache.clear();
  });
  
  it('should store and retrieve values', () => {
    MemoryCache.set('key1', 'value1');
    expect(MemoryCache.get('key1')).toBe('value1');
  });
  
  it('should return undefined for non-existent keys', () => {
    expect(MemoryCache.get('nonexistent')).toBeUndefined();
  });
  
  it('should check if key exists', () => {
    MemoryCache.set('key1', 'value1');
    expect(MemoryCache.has('key1')).toBe(true);
    expect(MemoryCache.has('nonexistent')).toBe(false);
  });
  
  it('should remove keys', () => {
    MemoryCache.set('key1', 'value1');
    MemoryCache.remove('key1');
    expect(MemoryCache.has('key1')).toBe(false);
  });
  
  it('should clear all keys', () => {
    MemoryCache.set('key1', 'value1');
    MemoryCache.set('key2', 'value2');
    MemoryCache.clear();
    expect(MemoryCache.has('key1')).toBe(false);
    expect(MemoryCache.has('key2')).toBe(false);
  });
});

describe('PersistentCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('should store and retrieve values from localStorage', () => {
    PersistentCache.set('key1', { data: 'value1' });
    expect(PersistentCache.get('key1')).toEqual({ data: 'value1' });
  });
  
  it('should return null for non-existent keys', () => {
    expect(PersistentCache.get('nonexistent')).toBeNull();
  });
  
  it('should prefix keys', () => {
    PersistentCache.set('key1', 'value1');
    expect(localStorage.getItem('allinone_key1')).not.toBeNull();
  });
  
  it('should remove keys from localStorage', () => {
    PersistentCache.set('key1', 'value1');
    PersistentCache.remove('key1');
    expect(PersistentCache.get('key1')).toBeNull();
  });
});
