import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { DashboardStats, DashboardStatCards } from '../../../types/admin';

export const useDashboardApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboardStats = useCallback(async (): Promise<DashboardStats> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response as DashboardStats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatCards = useCallback(async (): Promise<DashboardStatCards> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/dashboard/stat-cards');
      return response as DashboardStatCards;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getDashboardStats,
    getStatCards,
  };
};
