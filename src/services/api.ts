import {
  User,
  Material,
  License,
  Purchase,
  AuditLog,
  PaymentProvider,
  PortalSettings
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('bilim_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка входа');
    }
    const data = await res.json();
    localStorage.setItem('bilim_auth_token', data.token);
    return data;
  },

  async register(data: { email: string; name: string; password?: string; phone?: string; school?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка регистрации');
    }
    const resData = await res.json();
    localStorage.setItem('bilim_auth_token', resData.token);
    return resData;
  },

  async loginWithGoogle(email?: string, name?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/google-mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка Google авторизации');
    }
    const data = await res.json();
    localStorage.setItem('bilim_auth_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User } | null> {
    const token = localStorage.getItem('bilim_auth_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader()
      });
      if (!res.ok) {
        localStorage.removeItem('bilim_auth_token');
        return null;
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('bilim_auth_token');
  },

  // Materials
  async getMaterials(): Promise<Material[]> {
    const res = await fetch(`${API_BASE}/materials`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Не удалось загрузить материалы');
    const data = await res.json();
    return data.materials;
  },

  async getMaterialSample(id: string) {
    const res = await fetch(`${API_BASE}/materials/${id}/sample`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Не удалось загрузить фрагмент');
    return await res.json();
  },

  // Protected Content (Server checks license)
  async getProtectedMaterial(id: string): Promise<{ material: Material; license: License | null }> {
    const res = await fetch(`${API_BASE}/materials/${id}/content`, {
      headers: getAuthHeader()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Доступ к материалу ограничен');
    }
    return await res.json();
  },

  // Print Request (Server validates printUsed < printLimit, increments on server)
  async requestPrint(id: string): Promise<{
    success: boolean;
    printUsed: number;
    printLimit: number;
    printsRemaining: number;
    watermark: string;
    pages: any[];
  }> {
    const res = await fetch(`${API_BASE}/materials/${id}/request-print`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Лимит печати использован');
    }
    return await res.json();
  },

  // User Licenses
  async getUserLicenses(): Promise<License[]> {
    const res = await fetch(`${API_BASE}/user/licenses`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Не удалось получить список лицензий');
    const data = await res.json();
    return data.licenses;
  },

  // Payment
  async createPaymentIntent(params: {
    materialId: string;
    provider: PaymentProvider;
    acceptedTerms: boolean;
  }): Promise<{ purchase: Purchase; paymentGatewayUrl: string }> {
    const res = await fetch(`${API_BASE}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка создания платежа');
    }
    return await res.json();
  },

  async confirmTestPayment(purchaseId: string): Promise<{ success: boolean; license: License }> {
    const res = await fetch(`${API_BASE}/payments/test-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ purchaseId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка подтверждения оплаты');
    }
    return await res.json();
  },

  async submitPaymentProof(params: {
    purchaseId: string;
    receiptNumber: string;
    senderName: string;
    senderPhone: string;
    senderCardOrAccount?: string;
    screenshotUrl?: string;
    notes?: string;
  }): Promise<{ success: boolean; license: License; purchase: Purchase }> {
    const res = await fetch(`${API_BASE}/payments/submit-proof`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ошибка отправки чека');
    }
    return await res.json();
  },

  // Admin APIs
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки статистики');
    return await res.json();
  },

  async getAdminMaterials(): Promise<Material[]> {
    const res = await fetch(`${API_BASE}/admin/materials`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки материалов');
    const data = await res.json();
    return data.materials;
  },

  async createAdminMaterial(data: Partial<Material>): Promise<Material> {
    const res = await fetch(`${API_BASE}/admin/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Ошибка создания материала');
    const resData = await res.json();
    return resData.material;
  },

  async updateAdminMaterial(id: string, data: Partial<Material>): Promise<Material> {
    const res = await fetch(`${API_BASE}/admin/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Ошибка обновления материала');
    const resData = await res.json();
    return resData.material;
  },

  async deleteAdminMaterial(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/materials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка удаления материала');
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки пользователей');
    const data = await res.json();
    return data.users;
  },

  async toggleBlockUser(id: string): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${id}/toggle-block`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка изменения статуса пользователя');
    const data = await res.json();
    return data.user;
  },

  async getAdminLicenses(): Promise<License[]> {
    const res = await fetch(`${API_BASE}/admin/licenses`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки лицензий');
    const data = await res.json();
    return data.licenses;
  },

  async restorePrintAttempt(licenseId: string): Promise<License> {
    const res = await fetch(`${API_BASE}/admin/licenses/${licenseId}/restore-print`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Не удалось восстановить попытку печати');
    const data = await res.json();
    return data.license;
  },

  async extendLicense(licenseId: string, additionalDays: number): Promise<License> {
    const res = await fetch(`${API_BASE}/admin/licenses/${licenseId}/extend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ additionalDays })
    });
    if (!res.ok) throw new Error('Не удалось продлить лицензию');
    const data = await res.json();
    return data.license;
  },

  async revokeLicense(licenseId: string): Promise<License> {
    const res = await fetch(`${API_BASE}/admin/licenses/${licenseId}/revoke`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Не удалось отозвать лицензию');
    const data = await res.json();
    return data.license;
  },

  async getAdminPurchases(): Promise<Purchase[]> {
    const res = await fetch(`${API_BASE}/admin/purchases`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки покупок');
    const data = await res.json();
    return data.purchases;
  },

  async getAdminAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки журнала аудита');
    const data = await res.json();
    return data.logs;
  },

  // Portal Settings
  async getSettings(): Promise<PortalSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Ошибка загрузки настроек портала');
    const data = await res.json();
    return data.settings;
  },

  async getAdminSettings(): Promise<PortalSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Ошибка загрузки настроек портала');
    const data = await res.json();
    return data.settings;
  },

  async updateAdminSettings(settings: Partial<PortalSettings>): Promise<{ success: boolean; settings: PortalSettings; message: string }> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Не удалось сохранить настройки');
    }
    return await res.json();
  }
};
