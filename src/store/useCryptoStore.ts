import { create } from 'zustand';

interface CryptoState {
  livePrices: Record<string, string>;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  updatePrices: (prices: Record<string, string>) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  livePrices: {},
  connectionStatus: 'disconnected',
  updatePrices: (newPrices) => 
    set((state) => ({ livePrices: { ...state.livePrices, ...newPrices } })),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));