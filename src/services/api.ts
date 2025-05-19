interface BalanceData {
  realtime: { credits: number; usd_cents: number };
  payout: { credits: number; usd_cents: number };
  min_payout: { credits: number; usd_cents: number };
}

interface TrafficStatsEntry {
  date: string;
  traffic: number;
  streaming_seconds: number;
}

interface TrafficStatsData {
  traffic_stats: TrafficStatsEntry[];
  total_traffic: number;
  total_streaming_seconds: number;
}

const BASE_URL = 'https://api-honeygain.rshare.io';

const getToken = (): string => {
  return localStorage.getItem('honeygain_token') || '';
};

export const fetchBalances = async (): Promise<BalanceData> => {
  const res = await fetch(`${BASE_URL}/users/balances`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Erro ao buscar saldos');
  return res.json();
};


export const fetchTrafficStats = async (): Promise<TrafficStatsData> => {
  const res = await fetch(`${BASE_URL}/stats/traffic`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error();
  return res.json();
};

export const toggleHoneygainStatus = async (active: boolean): Promise<boolean> => {
  // Backend não tem esse endpoint ainda. Aqui está um exemplo fictício:
  const res = await fetch(`${BASE_URL}/users/honeygain-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ active })
  });
  return res.ok;
};

export const requestPayout = async (): Promise<boolean> => {
  // Também fictício, ajuste conforme seu backend:
  const res = await fetch(`${BASE_URL}/users/request-payout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return res.ok;
};
