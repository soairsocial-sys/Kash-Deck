// Typed Client API for CashDeck v1 endpoints

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  activeWorkspaceId?: string | null;
}

export interface WorkspaceDTO {
  id: string;
  type: 'personal' | 'business';
  name: string;
  currency: string;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  onboardingStep: string;
  isDemo?: number;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: UserDTO;
  activeWorkspace?: WorkspaceDTO | null;
  accessToken: string;
}

let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
  if (token) {
    sessionStorage.setItem('cashdeck_access_token', token);
  } else {
    sessionStorage.removeItem('cashdeck_access_token');
  }
}

export function getAccessToken(): string | null {
  if (!currentAccessToken) {
    currentAccessToken = sessionStorage.getItem('cashdeck_access_token');
  }
  return currentAccessToken;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, credentials: 'include', headers });

  if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    // Try to refresh token
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setAccessToken(data.accessToken);
      headers.set('Authorization', `Bearer ${data.accessToken}`);
      return fetch(url, { ...options, credentials: 'include', headers });
    } else {
      setAccessToken(null);
    }
  }

  return response;
}

export const apiV1 = {
  // Auth
  async register(data: { name: string; email: string; phone?: string; password: string; termsAccepted: boolean }): Promise<AuthResponse> {
    const res = await fetchWithAuth('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    setAccessToken(json.accessToken);
    return json;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetchWithAuth('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    setAccessToken(json.accessToken);
    return json;
  },

  async logout(): Promise<void> {
    await fetchWithAuth('/api/v1/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  async verifyEmail(code: string): Promise<{ success: boolean; message: string }> {
    const res = await fetchWithAuth('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Verification failed');
    return json;
  },

  async verifyPhone(code: string): Promise<{ success: boolean; message: string }> {
    const res = await fetchWithAuth('/api/v1/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Phone verification failed');
    return json;
  },

  async resendVerification(type: 'email' | 'phone'): Promise<{ success: boolean; message: string }> {
    const res = await fetchWithAuth('/api/v1/auth/resend', {
      method: 'POST',
      body: JSON.stringify({ type })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Resend failed');
    return json;
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string; devCode?: string }> {
    const res = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to process request');
    return json;
  },

  async verifyResetCode(identifier: string, code: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/v1/auth/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Code verification failed');
    return json;
  },

  async resetPassword(data: { identifier: string; code: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Password reset failed');
    return json;
  },

  async getMe(): Promise<{ user: UserDTO; activeWorkspace: WorkspaceDTO | null; workspaces: WorkspaceDTO[]; profile: any }> {
    const res = await fetchWithAuth('/api/v1/me');
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch user');
    return json;
  },

  // Workspaces
  async createWorkspace(data: { type: 'personal' | 'business'; name?: string }): Promise<{ workspace: WorkspaceDTO }> {
    const res = await fetchWithAuth('/api/v1/workspaces', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create workspace');
    return json;
  },

  async switchActiveWorkspace(workspaceId: string): Promise<{ activeWorkspace: WorkspaceDTO }> {
    const res = await fetchWithAuth('/api/v1/me/active-workspace', {
      method: 'POST',
      body: JSON.stringify({ workspaceId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to switch workspace');
    return json;
  },

  async saveOnboardingStep(workspaceId: string, data: { stepKey: string; nextStepKey?: string; payload?: any; skipped?: boolean }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/onboarding`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to save onboarding');
    return json;
  },

  async completeOnboarding(workspaceId: string): Promise<{ success: boolean; redirectUrl: string; workspace: WorkspaceDTO }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/onboarding/complete`, {
      method: 'POST'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to complete onboarding');
    return json;
  },

  async getDashboard(workspaceId: string): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/dashboard`);
    const json = await res.json();
    if (res.status === 409) {
      return { requiresOnboarding: true, ...json };
    }
    if (!res.ok) throw new Error(json.error || 'Failed to load dashboard');
    return json;
  },

  async recordDailySales(workspaceId: string, data: {
    date: string;
    totalSalesMinor: number;
    cashMinor?: number;
    transferMinor?: number;
    posMinor?: number;
    otherMinor?: number;
    transactionCount?: number;
    notes?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/daily-sales`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record sales');
    return json;
  },

  async createAccount(workspaceId: string, data: {
    name: string;
    type?: string;
    accountNumber?: string;
    bankName?: string;
    openingBalanceMinor?: number;
  }): Promise<{ success: boolean; accountId: string }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/accounts`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create account');
    return json;
  },

  async getAccounts(workspaceId: string): Promise<{ accounts: any[] }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/accounts`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch accounts');
    return json;
  },

  async getTransactions(workspaceId: string): Promise<{ transactions: any[] }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/transactions`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch transactions');
    return json;
  },

  async recordTransaction(workspaceId: string, data: {
    accountId: string;
    type: 'income' | 'expense' | 'transfer';
    amountMinor: number;
    description: string;
    classification?: string;
    category?: string;
    occurredAt?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record transaction');
    return json;
  },

  async getCustomers(workspaceId: string): Promise<{ customers: any[] }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/customers`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch customers');
    return json;
  },

  async createCustomer(workspaceId: string, data: {
    name: string;
    phone?: string;
    email?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/customers`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create customer');
    return json;
  },

  async getSales(workspaceId: string): Promise<{ sales: any[] }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/sales`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch sales');
    return json;
  },

  async recordSale(workspaceId: string, data: {
    amountMinor: number;
    incomeType?: string;
    paymentStatus: 'paid' | 'credit';
    accountId?: string;
    customerId?: string;
    customerName?: string;
    date?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/sales`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record sale');
    return json;
  },

  async getReceivables(workspaceId: string): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/receivables`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch receivables');
    return json;
  },

  async recordReceivablePayment(workspaceId: string, saleId: string, data: {
    amountMinor: number;
    accountId?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/receivables/${saleId}/payment`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record payment');
    return json;
  },

  async getGoals(workspaceId: string): Promise<{ goals: any[] }> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/goals`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch goals');
    return json;
  },

  async createGoal(workspaceId: string, data: {
    name: string;
    targetAmountMinor: number;
    currentAmountMinor?: number;
    category?: string;
    targetDate?: string;
    color?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/goals`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create goal');
    return json;
  },

  async updateGoal(workspaceId: string, goalId: string, data: {
    currentAmountMinor?: number;
    targetAmountMinor?: number;
    contributionAmountMinor?: number;
    name?: string;
    targetDate?: string;
  }): Promise<any> {
    const res = await fetchWithAuth(`/api/v1/workspaces/${workspaceId}/goals/${goalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update goal');
    return json;
  }
};
