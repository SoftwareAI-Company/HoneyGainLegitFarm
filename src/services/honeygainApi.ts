
// New:
interface AuthResponse {
  access_token: string;
  // you can add expires_in and token_type here if the API ever returns them:
  // expires_in?: number;
  // token_type?: string;
}

interface BalanceData {
  realtime: { credits: number; usd_cents: number };
  payout: { credits: number; usd_cents: number };
  min_payout: { credits: number; usd_cents: number };
}

interface BalanceResponse {
  data: BalanceData;
}
export async function authenticateHoneygain(email: string, password: string): Promise<string> {
  try {
    const response = await fetch("https://api-honeygain.rshare.io/auth/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const raw = await response.text();
    console.log("🔥 raw auth response:", raw);
    const data = JSON.parse(raw) as AuthResponse;
    const token = data.access_token;
    console.log('Received token:', data.access_token);
    localStorage.setItem('honeygain_email', email);
    localStorage.setItem('honeygain_pass', password);
    return token;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}


export async function fetchHoneygainBalances(authToken: string): Promise<BalanceData> {
  try {
    const response = await fetch("https://api-honeygain.rshare.io/users/balances", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balances: ${response.status}`);
    }
    
    const data = await response.json() as BalanceResponse;
    return data.data;
  } catch (error) {
    console.error("Balance fetch error:", error);
    throw error;
  }
}
