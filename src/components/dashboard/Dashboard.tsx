import React, { useEffect, useState } from 'react';
import { useBitcoinStore } from '../../store/bitcoinStore';
import PriceDisplay from './PriceDisplay';
import PriceChart from './PriceChart';
import RecommendationCard from './RecommendationCard';
import TechnicalIndicators from './TechnicalIndicators';
import { ArrowLeftRight, Clock, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    currentPrice, 
    historicalData, 
    recommendation,
    loading, 
    error,
    fetchCurrentPrice, 
    fetchHistoricalPrices 
  } = useBitcoinStore();

  const [timeframe, setTimeframe] = useState<number>(30);
  
  useEffect(() => {
    // Initial data fetch
    fetchCurrentPrice();
    fetchHistoricalPrices(timeframe);
    
    // Set up interval for price updates
    const priceInterval = setInterval(() => {
      fetchCurrentPrice();
    }, 60000); // Update price every minute
    
    return () => {
      clearInterval(priceInterval);
    };
  }, [fetchCurrentPrice]);
  
  useEffect(() => {
    fetchHistoricalPrices(timeframe);
  }, [timeframe, fetchHistoricalPrices]);

  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PriceDisplay 
          currentPrice={currentPrice} 
          loading={loading} 
          error={error} 
        />
        
        <RecommendationCard recommendation={recommendation} />
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Time Frame</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 7, 30, 90, 365].map((days) => (
              <button
                key={days}
                onClick={() => handleTimeframeChange(days)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 
                  ${timeframe === days 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                  }`}
              >
                {days === 1 ? '24H' : 
                  days === 7 ? '7D' : 
                  days === 30 ? '1M' : 
                  days === 90 ? '3M' : '1Y'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Price Chart</h2>
          </div>
          <PriceChart historicalData={historicalData} timeframe={timeframe} />
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold">Technical Indicators</h2>
          </div>
          <TechnicalIndicators recommendation={recommendation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;