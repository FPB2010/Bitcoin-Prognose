import { create } from 'zustand';
import { fetchBitcoinPrice, fetchHistoricalData } from '../services/api';
import { analyzeTrend, generateRecommendation } from '../services/analysis';
import { BitcoinData, HistoricalData, PriceRecommendation } from '../types';

interface BitcoinState {
  currentPrice: BitcoinData | null;
  historicalData: HistoricalData[];
  recommendation: PriceRecommendation | null;
  loading: boolean;
  error: string | null;
  fetchCurrentPrice: () => Promise<void>;
  fetchHistoricalPrices: (days: number) => Promise<void>;
  analyzeAndRecommend: () => void;
}

export const useBitcoinStore = create<BitcoinState>((set, get) => ({
  currentPrice: null,
  historicalData: [],
  recommendation: null,
  loading: false,
  error: null,

  fetchCurrentPrice: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchBitcoinPrice();
      set({ currentPrice: data, loading: false });
      get().analyzeAndRecommend();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch Bitcoin price', 
        loading: false 
      });
    }
  },

  fetchHistoricalPrices: async (days: number) => {
    try {
      set({ loading: true, error: null });
      const data = await fetchHistoricalData(days);
      set({ historicalData: data, loading: false });
      get().analyzeAndRecommend();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch historical data', 
        loading: false 
      });
    }
  },

  analyzeAndRecommend: () => {
    const { currentPrice, historicalData } = get();
    if (!currentPrice || historicalData.length === 0) return;

    const trend = analyzeTrend(historicalData);
    const recommendation = generateRecommendation(currentPrice, historicalData, trend);
    
    set({ recommendation });
  }
}));