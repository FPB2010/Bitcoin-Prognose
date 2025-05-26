import React from 'react';
import { AlertTriangle, Check, Gauge, Loader, XCircle } from 'lucide-react';
import { PriceRecommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: PriceRecommendation | null;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  if (!recommendation) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-semibold">Trading Recommendation</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-6">
          <Loader className="h-8 w-8 text-primary-500 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Analyzing market data...</p>
        </div>
      </div>
    );
  }

  const getActionStyles = () => {
    switch (recommendation.action) {
      case 'buy':
        return {
          bgColor: 'bg-success-50 dark:bg-success-900/20',
          borderColor: 'border-success-200 dark:border-success-800',
          textColor: 'text-success-700 dark:text-success-400',
          icon: <Check className="h-6 w-6 text-success-500" />,
        };
      case 'sell':
        return {
          bgColor: 'bg-danger-50 dark:bg-danger-900/20',
          borderColor: 'border-danger-200 dark:border-danger-800',
          textColor: 'text-danger-700 dark:text-danger-400',
          icon: <XCircle className="h-6 w-6 text-danger-500" />,
        };
      default:
        return {
          bgColor: 'bg-warning-50 dark:bg-warning-900/20',
          borderColor: 'border-warning-200 dark:border-warning-800',
          textColor: 'text-warning-700 dark:text-warning-400',
          icon: <AlertTriangle className="h-6 w-6 text-warning-500" />,
        };
    }
  };

  const styles = getActionStyles();

  const getConfidenceLevel = () => {
    if (recommendation.confidence >= 80) return 'Very High';
    if (recommendation.confidence >= 60) return 'High';
    if (recommendation.confidence >= 40) return 'Moderate';
    if (recommendation.confidence >= 20) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-primary-500" />
        <h2 className="text-lg font-semibold">Trading Recommendation</h2>
      </div>
      
      <div className={`flex items-center gap-3 ${styles.bgColor} ${styles.borderColor} border rounded-lg p-4 mb-4`}>
        {styles.icon}
        <div>
          <h3 className={`text-lg font-bold uppercase ${styles.textColor}`}>
            {recommendation.action === 'buy' 
              ? 'Buy Now' 
              : recommendation.action === 'sell' 
                ? 'Sell Now' 
                : 'Hold Position'}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Confidence: {getConfidenceLevel()} ({recommendation.confidence}%)
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-neutral-700 dark:text-neutral-300">
          <p>{recommendation.reason}</p>
        </div>
        
        <div className="pt-2">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                recommendation.action === 'buy' 
                  ? 'bg-success-500' 
                  : recommendation.action === 'sell' 
                    ? 'bg-danger-500' 
                    : 'bg-warning-500'
              }`} 
              style={{ width: `${recommendation.confidence}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-xs text-neutral-500 dark:text-neutral-500 pt-2">
          Last updated: {new Date(recommendation.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;