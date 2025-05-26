import axios from 'axios';
import { BitcoinData, HistoricalData } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const fetchBitcoinPrice = async (): Promise<BitcoinData> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: 'bitcoin',
          order: 'market_cap_desc',
          per_page: 1,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d,30d'
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    throw new Error('No Bitcoin data returned from API');
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (days: number = 30): Promise<HistoricalData[]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/bitcoin/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days <= 1 ? 'minute' : days <= 7 ? 'hourly' : 'daily'
        }
      }
    );
    
    if (response.data && response.data.prices) {
      return response.data.prices.map((item: [number, number]) => ({
        timestamp: item[0],
        price: item[1]
      }));
    }
    
    throw new Error('No historical data returned from API');
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};