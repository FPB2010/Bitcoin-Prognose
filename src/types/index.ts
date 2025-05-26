export interface BitcoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  last_updated: string;
}

export interface HistoricalData {
  timestamp: number;
  price: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    tension: number;
  }[];
}

export type TrendType = 'strong_uptrend' | 'uptrend' | 'neutral' | 'downtrend' | 'strong_downtrend';

export interface PriceRecommendation {
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  reason: string;
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
    };
    movingAverages: {
      short: number;
      long: number;
    };
  };
  trend: TrendType;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  type: 'price_above' | 'price_below' | 'percent_change';
  value: number;
  triggered: boolean;
  createdAt: string;
}