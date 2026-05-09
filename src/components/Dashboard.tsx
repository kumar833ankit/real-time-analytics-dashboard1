import React from 'react';
import { useAssets } from '../hooks/useAssets';
import { useCryptoStore } from '../store/useCryptoStore';
import { AssetCard } from './AssetCard';
import { CryptoChart } from './CryptoChart';
import { AssetTable } from './AssetTable';
import { Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: assets = [], isLoading, isError } = useAssets();
  const connectionStatus = useCryptoStore(state => state.connectionStatus);

  const topAssets = assets.slice(0, 4);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white text-xl">Loading live market data...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load data. Please refresh.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real-Time Crypto Analytics
            </h1>
            <p className="text-slate-400 mt-1">Live WebSocket Updates • Market Intelligence</p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs text-slate-500 mb-1">DEVELOPED BY</p>
            <p className="font-semibold text-lg text-white">ANKIT KUMAR</p>
            
            <div className="flex gap-6 text-sm mt-2">
              <a href="https://www.linkedin.com/in/ankit-kumar-b68906192/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">LinkedIn</a>
              <a href="https://drive.google.com/file/d/1pO5_M_0BEWChRGHSt56rE0o-DzoRHDBz/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Resume</a>
              <a href="tel:6290938383" className="text-slate-400 hover:text-slate-300">6290938383</a>
            </div>
          </div>

          <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 border text-sm font-medium
            ${connectionStatus === 'connected' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-amber-500 bg-amber-500/10 text-amber-400'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {connectionStatus.toUpperCase()}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topAssets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {topAssets.slice(0, 2).map(asset => {
            const basePrice = parseFloat(asset.priceUsd || '0');
            return (
              <div key={asset.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 h-[440px] flex flex-col">
                <h3 className="text-xl font-semibold mb-5 flex items-center gap-3 text-slate-100">
                  <Activity className="text-cyan-400" size={24} />
                  {asset.name} Live Trend
                </h3>
                <div className="flex-1">
                  <CryptoChart assetId={asset.id} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <AssetTable assets={assets} />
      </div>
    </div>
  );
};