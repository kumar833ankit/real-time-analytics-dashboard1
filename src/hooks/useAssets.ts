// import { useQuery } from '@tanstack/react-query';

// export interface Asset {
//   id: string;
//   symbol: string;
//   name: string;
//   priceUsd: string;
//   changePercent24Hr: string;
// }

// const mockAssets: Asset[] = [
//   { id: "bitcoin", symbol: "BTC", name: "Bitcoin", priceUsd: "67890.45", changePercent24Hr: "2.34" },
//   { id: "ethereum", symbol: "ETH", name: "Ethereum", priceUsd: "2650.75", changePercent24Hr: "-1.45" },
//   { id: "tether", symbol: "USDT", name: "Tether", priceUsd: "1.000", changePercent24Hr: "0.01" },
//   { id: "binancecoin", symbol: "BNB", name: "BNB", priceUsd: "595.20", changePercent24Hr: "1.87" },
//   { id: "solana", symbol: "SOL", name: "Solana", priceUsd: "152.85", changePercent24Hr: "4.23" },
//   { id: "ripple", symbol: "XRP", name: "XRP", priceUsd: "0.532", changePercent24Hr: "-0.89" },
//   { id: "cardano", symbol: "ADA", name: "Cardano", priceUsd: "0.385", changePercent24Hr: "1.12" },
// ];

// export const useAssets = () => {
//   return useQuery({
//     queryKey: ['assets'],
//     queryFn: async () => {
//       try {
//         const res = await fetch('https://api.coincap.io/v2/assets?limit=100');
//         if (!res.ok) throw new Error('API failed');
//         const data = await res.json();
//         console.log("✅ Real API loaded", data.data.length, "assets");
//         return data.data;
//       } catch (error) {
//         console.log("⚠️ Using Mock Data (API not accessible)");
//         return mockAssets;
//       }
//     },
//     refetchInterval: 30000,
//     retry: 1,
//     staleTime: 10000,
//   });
// };



import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
}

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false'
      );

      // Map CoinGecko response to your existing interface
      return data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        priceUsd: coin.current_price?.toString() || '0',
        changePercent24Hr: coin.price_change_percentage_24h?.toString() || '0',
      }));
    },
    refetchInterval: 30000,
    retry: 2,
  });
};