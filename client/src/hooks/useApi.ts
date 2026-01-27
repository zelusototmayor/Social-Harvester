const API_BASE = '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}

// Organizations API
export const organizationsApi = {
  list: async () => {
    const res = await apiFetch('/organizations');
    return res.json();
  },

  get: async (id: number) => {
    const res = await apiFetch(`/organizations/${id}`);
    return res.json();
  },

  create: async (data: { name: string }) => {
    const res = await apiFetch('/organizations', {
      method: 'POST',
      body: JSON.stringify({ organization: data }),
    });
    return res.json();
  },

  update: async (id: number, data: { name: string }) => {
    const res = await apiFetch(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ organization: data }),
    });
    return res.json();
  },

  switch: async (id: number) => {
    const res = await apiFetch(`/organizations/${id}/switch`, {
      method: 'POST',
    });
    return res.json();
  },
};

// User API
export const userApi = {
  me: async () => {
    const res = await apiFetch('/me');
    return res.json();
  },
};

// Products API
export const productsApi = {
  list: async () => {
    const res = await apiFetch('/products');
    const data = await res.json();
    return data.products;
  },

  get: async (id: number) => {
    const res = await apiFetch(`/products/${id}`);
    return res.json();
  },

  dashboard: async (id: number) => {
    const res = await apiFetch(`/products/${id}/dashboard`);
    return res.json();
  },

  leads: async (id: number, params?: {
    page?: number;
    per_page?: number;
    status?: string;
    source_type?: string;
    relevant_only?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const res = await apiFetch(`/products/${id}/leads?${searchParams}`);
    return res.json();
  },

  triggerScan: async (id: number) => {
    const res = await apiFetch(`/products/${id}/trigger_scan`, {
      method: 'POST',
    });
    return res.json();
  },

  scanStatus: async (id: number) => {
    const res = await apiFetch(`/products/${id}/scan_status`);
    return res.json();
  },

  create: async (data: {
    name: string;
    website_url?: string;
    description?: string;
    target_audience?: string;
    pain_points?: string;
    key_features?: string;
  }) => {
    const res = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify({ product: data }),
    });
    return res.json();
  },

  update: async (id: number, data: Partial<{
    name: string;
    website_url: string;
    description: string;
    target_audience: string;
    pain_points: string;
    key_features: string;
    status: string;
  }>) => {
    const res = await apiFetch(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ product: data }),
    });
    return res.json();
  },

  delete: async (id: number) => {
    const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });
    return res;
  },

  analyzeUrl: async (url: string) => {
    const res = await apiFetch('/products/analyze_url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    return res.json();
  },
};

// Influencers API
export const influencersApi = {
  list: async (productId: number) => {
    const res = await apiFetch(`/products/${productId}/influencers`);
    return res.json();
  },

  create: async (productId: number, data: { handle: string; platform?: string }) => {
    const res = await apiFetch(`/products/${productId}/influencers`, {
      method: 'POST',
      body: JSON.stringify({ influencer: data }),
    });
    return res.json();
  },

  update: async (productId: number, id: number, data: { status?: string }) => {
    const res = await apiFetch(`/products/${productId}/influencers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ influencer: data }),
    });
    return res.json();
  },

  delete: async (productId: number, id: number) => {
    const res = await apiFetch(`/products/${productId}/influencers/${id}`, {
      method: 'DELETE',
    });
    return res;
  },
};

// Hashtags API
export const hashtagsApi = {
  list: async (productId: number) => {
    const res = await apiFetch(`/products/${productId}/hashtags`);
    return res.json();
  },

  create: async (productId: number, data: { tag: string; platform?: string }) => {
    const res = await apiFetch(`/products/${productId}/hashtags`, {
      method: 'POST',
      body: JSON.stringify({ hashtag: data }),
    });
    return res.json();
  },

  update: async (productId: number, id: number, data: { status?: string }) => {
    const res = await apiFetch(`/products/${productId}/hashtags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ hashtag: data }),
    });
    return res.json();
  },

  delete: async (productId: number, id: number) => {
    const res = await apiFetch(`/products/${productId}/hashtags/${id}`, {
      method: 'DELETE',
    });
    return res;
  },
};

// Leads API (for global operations - most lead access is through products)
export const leadsApi = {
  list: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    product_id?: number;
    high_intent?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const res = await apiFetch(`/leads?${searchParams}`);
    return res.json();
  },

  get: async (id: number) => {
    const res = await apiFetch(`/leads/${id}`);
    return res.json();
  },

  updateStatus: async (id: number, status: string) => {
    const res = await apiFetch(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ lead: { status } }),
    });
    return res.json();
  },

  engage: async (id: number, engagementType: string, notes?: string) => {
    const res = await apiFetch(`/leads/${id}/engage`, {
      method: 'POST',
      body: JSON.stringify({ engagement_type: engagementType, notes }),
    });
    return res.json();
  },
};
