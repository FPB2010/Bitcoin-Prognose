import axios from 'axios';
import { BitcoinData, HistoricalData } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await fetchFn();
  } catch (error: any) {
    if (retries === 0 || (error.response && error.response.status !== 401)) {
      throw error;
    }
    
    console.log(`Retrying after ${delay}ms... (${retries} attempts remaining)`);
    await sleep(delay);
    return fetchWithRetry(fetchFn, retries - 1, delay * 2);
  }
};

export const fetchBitcoinPrice = async (): Promise<BitcoinData> => {
  return fetchWithRetry(async () => {
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
  });
};

export const fetchHistoricalData = async (days: number = 30): Promise<HistoricalData[]> => {
  return fetchWithRetry(async () => {
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
  });
};