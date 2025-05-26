import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, DollarSign, Loader } from 'lucide-react';
import { BitcoinData } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PriceDisplayProps {
  currentPrice: BitcoinData | null;
  loading: boolean;
  error: string | null;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ currentPrice, loading, error }) => {
  const [priceChanged, setPriceChanged] = useState(false);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (currentPrice && previousPrice && currentPrice.current_price !== previousPrice) {
      setPriceChanged(true);
      const timer = setTimeout(() => setPriceChanged(false), 2000);
      return () => clearTimeout(timer);
    }
    
    if (currentPrice) {
      setPreviousPrice(currentPrice.current_price);
    }
  }, [currentPrice, previousPrice]);

  if (error) {
    return (
      <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl p-6">
        <h2 className="text-danger-700 dark:text-danger-400 font-medium mb-2">Error Loading Price</h2>
        <p className="text-danger-600 dark:text-danger-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg ${priceChanged ? 'animate-pulse-slow' : ''}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold">Current Price</h2>
        </div>
        
        {loading && !currentPrice ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader className="h-8 w-8 text-primary-500 animate-spin mb-2" />
            <p className="text-neutral-500 dark:text-neutral-400">Loading price data...</p>
          </div>
        ) : currentPrice ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">
                {formatCurrency(currentPrice.current_price)}
              </span>
              <div className="flex items-center mt-1">
                {currentPrice.price_change_percentage_24h > 0 ? (
                  <ArrowUp className="h-4 w-4 text-success-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-danger-500 mr-1" />
                )}
                <span 
                  className={`text-sm font-medium ${
                    currentPrice.price_change_percentage_24h > 0 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  {formatPercentage(currentPrice.price_change_percentage_24h)} (24h)
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">24h High</p>
                <p className="font-medium">{formatCurrency(currentPrice.high_24h)}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">24h Low</p>
                <p className="font-medium">{formatCurrency(currentPrice.low_24h)}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Market Cap</p>
                <p className="font-medium">{formatCurrency(currentPrice.market_cap, true)}</p>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">Volume (24h)</p>
                <p className="font-medium">{formatCurrency(currentPrice.total_volume, true)}</p>
              </div>
            </div>
            
            <div className="text-xs text-neutral-500 dark:text-neutral-500 pt-2">
              Last updated: {new Date(currentPrice.last_updated).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-neutral-500 dark:text-neutral-400">No price data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;