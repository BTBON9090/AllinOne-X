import { useState, useEffect, useCallback } from 'preact/hooks';
import { PluginMessage } from '../types';

export function usePluginMessage() {
  const [lastMessage, setLastMessage] = useState<PluginMessage | null>(null);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.pluginMessage) {
        setLastMessage(event.data.pluginMessage);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return lastMessage;
}

export function useSendToPlugin() {
  return useCallback((message: PluginMessage) => {
    parent.postMessage({ pluginMessage: message }, '*');
  }, []);
}

export function useSelectionCount() {
  const [count, setCount] = useState(0);
  const sendMessage = useSendToPlugin();
  
  const refresh = useCallback(() => {
    sendMessage({ type: 'get-selection-count' });
  }, [sendMessage]);
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'selection-count-res') {
        setCount(event.data.count);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return { count, refresh };
}
