import React from 'react';
import { Activity, AlertTriangle, Check, Loader, XCircle } from 'lucide-react';
import { PriceRecommendation } from '../../types';

interface TechnicalIndicatorsProps {
  recommendation: PriceRecommendation | null;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6">
        <Loader className="h-8 w-8 text-primary-500 animate-spin mb-2" />
        <p className="text-neutral-500 dark:text-neutral-400">Calculating indicators...</p>
      </div>
    );
  }

  const { rsi, macd, movingAverages } = recommendation.indicators;

  const getRsiStatus = () => {
    if (rsi > 70) {
      return {
        status: 'Overbought',
        icon: <XCircle className="h-5 w-5 text-danger-500" />,
        color: 'text-danger-600 dark:text-danger-400',
      };
    } else if (rsi < 30) {
      return {
        status: 'Oversold',
        icon: <Check className="h-5 w-5 text-success-500" />,
        color: 'text-success-600 dark:text-success-400',
      };
    } else {
      return {
        status: 'Neutral',
        icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
        color: 'text-warning-600 dark:text-warning-400',
      };
    }
  };

  const getMacdStatus = () => {
    if (macd.value > macd.signal) {
      return {
        status: 'Bullish',
        icon: <Check className="h-5 w-5 text-success-500" />,
        color: 'text-success-600 dark:text-success-400',
      };
    } else if (macd.value < macd.signal) {
      return {
        status: 'Bearish',
        icon: <XCircle className="h-5 w-5 text-danger-500" />,
        color: 'text-danger-600 dark:text-danger-400',
      };
    } else {
      return {
        status: 'Neutral',
        icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
        color: 'text-warning-600 dark:text-warning-400',
      };
    }
  };

  const getMovingAverageStatus = () => {
    if (movingAverages.short > movingAverages.long) {
      return {
        status: 'Bullish',
        icon: <Check className="h-5 w-5 text-success-500" />,
        color: 'text-success-600 dark:text-success-400',
      };
    } else if (movingAverages.short < movingAverages.long) {
      return {
        status: 'Bearish',
        icon: <XCircle className="h-5 w-5 text-danger-500" />,
        color: 'text-danger-600 dark:text-danger-400',
      };
    } else {
      return {
        status: 'Neutral',
        icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
        color: 'text-warning-600 dark:text-warning-400',
      };
    }
  };

  const getTrendStatus = () => {
    switch (recommendation.trend) {
      case 'strong_uptrend':
        return {
          status: 'Strong Uptrend',
          icon: <Check className="h-5 w-5 text-success-500" />,
          color: 'text-success-600 dark:text-success-400',
        };
      case 'uptrend':
        return {
          status: 'Uptrend',
          icon: <Check className="h-5 w-5 text-success-500" />,
          color: 'text-success-600 dark:text-success-400',
        };
      case 'strong_downtrend':
        return {
          status: 'Strong Downtrend',
          icon: <XCircle className="h-5 w-5 text-danger-500" />,
          color: 'text-danger-600 dark:text-danger-400',
        };
      case 'downtrend':
        return {
          status: 'Downtrend',
          icon: <XCircle className="h-5 w-5 text-danger-500" />,
          color: 'text-danger-600 dark:text-danger-400',
        };
      default:
        return {
          status: 'Neutral',
          icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
          color: 'text-warning-600 dark:text-warning-400',
        };
    }
  };

  const rsiStatus = getRsiStatus();
  const macdStatus = getMacdStatus();
  const maStatus = getMovingAverageStatus();
  const trendStatus = getTrendStatus();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary-500" />
            <h3 className="text-sm font-medium">RSI</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${rsiStatus.color}`}>
              {rsiStatus.status}
            </span>
            {rsiStatus.icon}
          </div>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              rsi > 70 ? 'bg-danger-500' : rsi < 30 ? 'bg-success-500' : 'bg-warning-500'
            }`} 
            style={{ width: `${rsi}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-neutral-500">
          <span>Oversold</span>
          <span>Neutral</span>
          <span>Overbought</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary-500" />
            <h3 className="text-sm font-medium">MACD</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${macdStatus.color}`}>
              {macdStatus.status}
            </span>
            {macdStatus.icon}
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          MACD: {macd.value.toFixed(2)} | Signal: {macd.signal.toFixed(2)}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary-500" />
            <h3 className="text-sm font-medium">Moving Averages</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${maStatus.color}`}>
              {maStatus.status}
            </span>
            {maStatus.icon}
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Short: ${movingAverages.short.toFixed(2)} | Long: ${movingAverages.long.toFixed(2)}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary-500" />
            <h3 className="text-sm font-medium">Market Trend</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-medium ${trendStatus.color}`}>
              {trendStatus.status}
            </span>
            {trendStatus.icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;