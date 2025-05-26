import axios from 'axios';
import { BitcoinData, HistoricalData } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 5; // Increased from 3 to 5
const INITIAL_RETRY_DELAY = 2000; // Increased from 1000ms to 2000ms

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    if (!isOnline()) {
      throw new Error('No internet connection available');
    }
    return await fetchFn();
  } catch (error: any) {
    if (retries === 0) {
      console.error('Max retries reached:', error);
      throw new Error(`Failed after ${MAX_RETRIES} retries: ${error.message}`);
    }

    // Handle rate limiting specifically
    if (error.response?.status === 429) {
      const waitTime = error.response.headers['retry-after'] 
        ? parseInt(error.response.headers['retry-after']) * 1000 
        : delay;
      console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
      await sleep(waitTime);
      return fetchWithRetry(fetchFn, retries - 1, delay * 2);
    }

    // Don't retry on specific error codes
    if (error.response && ![408, 500, 502, 503, 504].includes(error.response.status)) {
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
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      throw new Error('No Bitcoin data returned from API');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        if (error.response) {
          throw new Error(`API Error (${error.response.status}): ${error.response.data.message || error.message}`);
        }
        if (error.request) {
          throw new Error('No response received from the API. Please check your connection.');
        }
      }
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
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      if (response.data && response.data.prices) {
        return response.data.prices.map((item: [number, number]) => ({
          timestamp: item[0],
          price: item[1]
        }));
      }
      
      throw new Error('No historical data returned from API');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        if (error.response) {
          throw new Error(`API Error (${error.response.status}): ${error.response.data.message || error.message}`);
        }
        if (error.request) {
          throw new Error('No response received from the API. Please check your connection.');
        }
      }
      console.error('Error fetching historical data:', error);
      throw error;
    }
  });
};