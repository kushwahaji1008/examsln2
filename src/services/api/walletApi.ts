import apiClient from './client';

export const getWalletBalance = async (): Promise<number> => {
  try {
    const res = await apiClient.get('/v1/Wallet/balance');
    if (typeof res.data === 'number') {
      return res.data;
    }
    if (res.data && typeof res.data.balance === 'number') {
      return res.data.balance;
    }
    if (res.data && res.data.data && typeof res.data.data.balance === 'number') {
      return res.data.data.balance;
    }
    return 0;
  } catch (error) {
    // Suppress 404/401 errors from console to avoid noise if endpoint is not deployed yet
    return 0;
  }
};
