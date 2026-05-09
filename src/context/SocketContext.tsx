import React, { createContext, useEffect, useRef, useCallback } from 'react';
import { useCryptoStore } from '../store/useCryptoStore';

export const SocketContext = createContext<WebSocket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef(0);
  const { updatePrices, setConnectionStatus } = useCryptoStore();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('reconnecting');
    ws.current = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

    ws.current.onopen = () => setConnectionStatus('connected');

    ws.current.onmessage = (event) => {
      if (Date.now() - lastUpdate.current < 800) return;
      lastUpdate.current = Date.now();

      try {
        const parsed = JSON.parse(event.data);
        updatePrices(parsed);
      } catch (e) {}
    };

    ws.current.onclose = () => {
      setConnectionStatus('disconnected');
      reconnectTimeout.current = setTimeout(connect, 2500);
    };

    ws.current.onerror = () => ws.current?.close();
  }, [updatePrices, setConnectionStatus]);

  useEffect(() => {
    connect();
    return () => {
      reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);

  return <SocketContext.Provider value={ws.current}>{children}</SocketContext.Provider>;
};