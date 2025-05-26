import { BitcoinData, HistoricalData, PriceRecommendation, TrendType } from '../types';

// Calculate Relative Strength Index (RSI)
export const calculateRSI = (prices: number[], periods: number = 14): number => {
  if (prices.length < periods + 1) {
    return 50; // Not enough data
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= periods; i++) {
    const difference = prices[prices.length - i] - prices[prices.length - i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses += Math.abs(difference);
    }
  }

  const avgGain = gains / periods;
  const avgLoss = losses / periods;

  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Calculate Moving Average Convergence Divergence (MACD)
export const calculateMACD = (
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { value: number; signal: number } => {
  if (prices.length < slowPeriod + signalPeriod) {
    return { value: 0, signal: 0 }; // Not enough data
  }

  // Calculate EMAs
  const calculateEMA = (period: number, priceData: number[]): number => {
    const k = 2 / (period + 1);
    let ema = priceData[0];
    
    for (let i = 1; i < priceData.length; i++) {
      ema = priceData[i] * k + ema * (1 - k);
    }
    
    return ema;
  };

  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(fastPeriod, prices);
  const slowEMA = calculateEMA(slowPeriod, prices);
  
  // MACD Line
  const macdLine = fastEMA - slowEMA;
  
  // Signal Line (9-day EMA of MACD Line)
  // For simplicity, we're using a simple approximation here
  const signalLine = calculateEMA(signalPeriod, Array(signalPeriod).fill(macdLine));
  
  return { value: macdLine, signal: signalLine };
};

// Calculate Moving Averages
export const calculateMovingAverages = (
  prices: number[],
  shortPeriod: number = 50,
  longPeriod: number = 200
): { short: number; long: number } => {
  const calculateMA = (period: number): number => {
    if (prices.length < period) {
      return prices.reduce((sum, price) => sum + price, 0) / prices.length;
    }
    
    const relevantPrices = prices.slice(prices.length - period);
    return relevantPrices.reduce((sum, price) => sum + price, 0) / period;
  };

  return {
    short: calculateMA(shortPeriod),
    long: calculateMA(longPeriod)
  };
};

// Analyze overall trend
export const analyzeTrend = (historicalData: HistoricalData[]): TrendType => {
  if (historicalData.length < 2) {
    return 'neutral';
  }

  const prices = historicalData.map(data => data.price);
  
  // Calculate percentage change over different periods
  const getPercentChange = (days: number): number => {
    const dataPoints = Math.min(days, prices.length - 1);
    const oldPrice = prices[prices.length - 1 - dataPoints];
    const currentPrice = prices[prices.length - 1];
    return ((currentPrice - oldPrice) / oldPrice) * 100;
  };

  const dayChange = getPercentChange(1);
  const weekChange = getPercentChange(7);
  const monthChange = getPercentChange(30);

  // Determine trend based on multiple timeframes
  const shortTerm = dayChange > 3 ? 'uptrend' : dayChange < -3 ? 'downtrend' : 'neutral';
  const mediumTerm = weekChange > 10 ? 'uptrend' : weekChange < -10 ? 'downtrend' : 'neutral';
  const longTerm = monthChange > 20 ? 'uptrend' : monthChange < -20 ? 'downtrend' : 'neutral';

  // Count trends
  let upCount = 0;
  let downCount = 0;

  [shortTerm, mediumTerm, longTerm].forEach(trend => {
    if (trend === 'uptrend') upCount++;
    if (trend === 'downtrend') downCount++;
  });

  // Determine overall trend
  if (upCount === 3) return 'strong_uptrend';
  if (downCount === 3) return 'strong_downtrend';
  if (upCount > downCount) return 'uptrend';
  if (downCount > upCount) return 'downtrend';
  return 'neutral';
};

// Generate trading recommendation
export const generateRecommendation = (
  currentPrice: BitcoinData,
  historicalData: HistoricalData[],
  trend: TrendType
): PriceRecommendation => {
  const prices = historicalData.map(data => data.price);
  
  // Calculate indicators
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const movingAverages = calculateMovingAverages(prices);

  // Determine buy/sell signals
  let buySignals = 0;
  let sellSignals = 0;
  let totalSignals = 0;
  let reasons: string[] = [];

  // RSI signals
  if (rsi < 30) {
    buySignals++;
    reasons.push('RSI indicates oversold conditions');
  } else if (rsi > 70) {
    sellSignals++;
    reasons.push('RSI indicates overbought conditions');
  }
  totalSignals++;

  // MACD signals
  if (macd.value > macd.signal) {
    buySignals++;
    reasons.push('MACD is above signal line');
  } else if (macd.value < macd.signal) {
    sellSignals++;
    reasons.push('MACD is below signal line');
  }
  totalSignals++;

  // Moving average signals
  if (movingAverages.short > movingAverages.long) {
    buySignals++;
    reasons.push('Short-term MA is above long-term MA');
  } else if (movingAverages.short < movingAverages.long) {
    sellSignals++;
    reasons.push('Short-term MA is below long-term MA');
  }
  totalSignals++;

  // Trend signals
  if (trend === 'strong_uptrend' || trend === 'uptrend') {
    buySignals++;
    reasons.push(`Market is in an ${trend.replace('_', ' ')}`);
  } else if (trend === 'strong_downtrend' || trend === 'downtrend') {
    sellSignals++;
    reasons.push(`Market is in a ${trend.replace('_', ' ')}`);
  }
  totalSignals++;

  // Volatility check - high volatility might suggest caution
  const recentPrices = prices.slice(-5);
  const volatility = Math.max(...recentPrices) / Math.min(...recentPrices) - 1;
  if (volatility > 0.1) { // 10% volatility threshold
    reasons.push('Market is showing high volatility');
  }

  // Determine action and confidence
  let action: 'buy' | 'sell' | 'hold';
  let confidence: number;

  if (buySignals > sellSignals && buySignals >= totalSignals * 0.6) {
    action = 'buy';
    confidence = Math.min(100, Math.round((buySignals / totalSignals) * 100));
  } else if (sellSignals > buySignals && sellSignals >= totalSignals * 0.6) {
    action = 'sell';
    confidence = Math.min(100, Math.round((sellSignals / totalSignals) * 100));
  } else {
    action = 'hold';
    confidence = Math.min(100, Math.round(((totalSignals - Math.abs(buySignals - sellSignals)) / totalSignals) * 100));
    reasons.push('Mixed signals suggest caution');
  }

  return {
    action,
    confidence,
    reason: reasons.join('. '),
    indicators: {
      rsi,
      macd,
      movingAverages
    },
    trend,
    timestamp: new Date().toISOString()
  };
};