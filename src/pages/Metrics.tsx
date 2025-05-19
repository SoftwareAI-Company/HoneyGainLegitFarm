// src/pages/Metrics.tsx
import React, { useEffect, useState } from 'react';
import { fetchBalances } from '@/services/api';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const Metrics: React.FC = () => {
  const [balances, setBalances] = useState<null | {
    realtime: { credits: number; usd_cents: number };
    payout: { credits: number; usd_cents: number };
    min_payout: { credits: number; usd_cents: number };
  }>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBalances();
        setBalances(data);
      } catch (err) {
        console.error("Failed to load balances", err);
      }
    })();
  }, []);

  if (!balances) return <p>Loading metrics…</p>;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Honeygain Balances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Realtime Credits: {balances.realtime.credits}</p>
        <p>Realtime USD: ${(balances.realtime.usd_cents / 100).toFixed(2)}</p>
        <p>Payout Credits: {balances.payout.credits}</p>
        <p>Payout USD: ${(balances.payout.usd_cents / 100).toFixed(2)}</p>
        <p>Min Payout Credits: {balances.min_payout.credits}</p>
        <p>Min Payout USD: ${(balances.min_payout.usd_cents / 100).toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default Metrics;
