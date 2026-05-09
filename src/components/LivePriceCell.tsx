import React from 'react';
import { useLivePrice } from '../hooks/useLivePrice';

interface Props {
  assetId: string;
  basePrice: string;
}

export const LivePriceCell: React.FC<Props> = ({ assetId, basePrice }) => {
  const livePrice = useLivePrice(assetId);
  const price = livePrice || parseFloat(basePrice);
  return (
    <span className="font-mono font-medium">
      ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  );
};