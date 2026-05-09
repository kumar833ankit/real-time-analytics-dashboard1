import { useCryptoStore } from '../store/useCryptoStore';

export const useLivePrice = (assetId: string): number => {
  return useCryptoStore((state) => {
    const priceStr = state.livePrices[assetId];
    return priceStr ? parseFloat(priceStr) : 0;
  });
};