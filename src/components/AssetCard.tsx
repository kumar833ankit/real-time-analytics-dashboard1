import React from 'react';
import { useLivePrice } from '../hooks/useLivePrice';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Asset } from '../hooks/useAssets';

interface Props {
  asset: Asset;
}

export const AssetCard: React.FC<Props> = ({ asset }) => {
  const livePrice = useLivePrice(asset.id);
  const price = livePrice || parseFloat(asset.priceUsd || '0');
  const change = parseFloat(asset.changePercent24Hr || '0');
  const isPositive = change >= 0;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl text-white">{asset.name}</h3>
          <p className="text-slate-500 text-sm">{asset.symbol}</p>
        </div>
        {isPositive ? <TrendingUp className="text-emerald-400" size={28} /> : <TrendingDown className="text-rose-400" size={28} />}
      </div>

      <div className="mt-6 text-4xl font-mono font-bold tracking-tighter text-white">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
      </div>

      <p className={`mt-3 text-lg font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? '↑' : '↓'} {change.toFixed(2)}% <span className="text-sm">(24h)</span>
      </p>
    </div>
  );
};