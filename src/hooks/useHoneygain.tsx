
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authenticateHoneygain, fetchHoneygainBalances } from '../services/honeygainApi';
import { useToast } from './use-toast';

export function useHoneygain() {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('honeygain_token');
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const authToken = await authenticateHoneygain(email, password);
      setToken(authToken);
      localStorage.setItem('honeygain_token', authToken);
      toast({
        title: "Login Successful",
        description: "Your Honeygain account has been connected successfully.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to authenticate with Honeygain. Please check your credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('honeygain_token');
    setToken(null);
    toast({
      title: "Logged out",
      description: "Your Honeygain account has been disconnected.",
    });
  };

  const balanceQuery = useQuery({
    queryKey: ['honeygain', 'balances', token],
    queryFn: async () => {
      if (!token) return null;
      return fetchHoneygainBalances(token);
    },
    enabled: !!token,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return {
    token,
    isAuthenticated: !!token,
    isAuthenticating,
    login,
    logout,
    balanceData: balanceQuery.data,
    isLoadingBalance: balanceQuery.isLoading,
    isBalanceError: balanceQuery.isError,
    refetchBalance: balanceQuery.refetch,
  };
}
