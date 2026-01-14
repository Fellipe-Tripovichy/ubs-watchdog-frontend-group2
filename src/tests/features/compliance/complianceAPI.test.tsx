import {
  getAlertsAPI,
  getAlertByIdAPI,
  getClientAlertsAPI,
  getAlertsByStatusAPI,
  startAnalysisAPI,
  resolveAlertAPI,
  type GetAlertsParams,
  type GetAlertByIdParams,
  type GetClientAlertsParams,
  type GetAlertsByStatusParams,
  type StartAnalysisParams,
  type ResolveAlertParams,
} from '@/features/compliance/complianceAPI';
import type { Alert } from '@/types/compliance';

global.fetch = jest.fn();

const originalEnv = process.env;

describe('complianceAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockAlert: Alert = {
    id: 'A-3001',
    clienteId: 'C-1023',
    transacaoId: 'T-9001',
    nomeRegra: 'Depósito em espécie acima do limite',
    descricao: 'Test description',
    severidade: 'Alta',
    status: 'Novo',
    dataCriacao: '2025-01-15T10:30:00-03:00',
    dataResolucao: null,
    resolvidoPor: null,
    resolucao: null,
  };

  const mockAlerts: Alert[] = [
    mockAlert,
    {
      ...mockAlert,
      id: 'A-3002',
      transacaoId: 'T-9002',
      nomeRegra: 'Múltiplas transferências em curto período',
      severidade: 'Media',
      status: 'EmAnalise',
      dataCriacao: '2025-01-16T14:20:00-03:00',
    },
    {
      ...mockAlert,
      id: 'A-3003',
      transacaoId: 'T-9003',
      nomeRegra: 'Transação suspeita',
      severidade: 'Critica',
      status: 'Resolvido',
      dataCriacao: '2025-01-17T08:15:00-03:00',
      dataResolucao: '2025-01-18T10:00:00-03:00',
      resolvidoPor: 'user@example.com',
      resolucao: 'Alert resolved after investigation',
    },
  ];

  describe('getAlertsAPI', () => {
    const baseParams: GetAlertsParams = {
      token: 'test-token',
    };

    it('should return alerts on successful fetch without filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await getAlertsAPI(baseParams);

      expect(result).toEqual(mockAlerts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/filtrar',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with clienteId filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        clienteId: 'C-1023',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual(mockAlerts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/filtrar?clienteId=C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with severidade filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        severidade: 'Alta',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlert],
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual([mockAlert]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/filtrar?severidade=Alta',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with status filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        status: 'Novo',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlert],
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual([mockAlert]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/filtrar?status=Novo',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with dataCriacaoInicio filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        dataCriacaoInicio: '2025-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual(mockAlerts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/filtrar?dataCriacaoInicio=2025-01-01',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with dataCriacaoFim filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        dataCriacaoFim: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual(mockAlerts);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/alertas/filtrar?dataCriacaoFim='),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataCriacaoFim=');
      expect(callUrl).toMatch(/2025-02-\d{2}/);
    });

    it('should return alerts on successful fetch with dataResolucao filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        dataResolucao: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlerts[2]],
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual([mockAlerts[2]]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/alertas/filtrar?dataResolucao='),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataResolucao=');
      expect(callUrl).toMatch(/2025-02-\d{2}/);
    });

    it('should return alerts on successful fetch with all filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsParams = {
        ...baseParams,
        clienteId: 'C-1023',
        severidade: 'Alta',
        status: 'Novo',
        dataCriacaoInicio: '2025-01-01',
        dataCriacaoFim: '2025-01-31',
        dataResolucao: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlert],
      });

      const result = await getAlertsAPI(params);

      expect(result).toEqual([mockAlert]);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('clienteId=C-1023');
      expect(callUrl).toContain('severidade=Alta');
      expect(callUrl).toContain('status=Novo');
      expect(callUrl).toContain('dataCriacaoInicio=2025-01-01');
      expect(callUrl).toContain('dataCriacaoFim=');
      expect(callUrl).toContain('dataResolucao=');
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getAlertsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getAlertsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getAlertsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getAlertsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getAlertsAPI(baseParams);

      expect(result).toEqual([]);
    });
  });

  describe('getAlertByIdAPI', () => {
    const baseParams: GetAlertByIdParams = {
      alertId: 'A-3001',
      token: 'test-token',
    };

    it('should return alert on successful fetch', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlert,
      });

      const result = await getAlertByIdAPI(baseParams);

      expect(result).toEqual(mockAlert);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/A-3001',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getAlertByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getAlertByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getAlertByIdAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getAlertByIdAPI(baseParams);

      expect(result).toBeNull();
    });
  });

  describe('getClientAlertsAPI', () => {
    const baseParams: GetClientAlertsParams = {
      clientId: 'C-1023',
      token: 'test-token',
    };

    it('should return alerts on successful fetch', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlerts,
      });

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toEqual(mockAlerts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/clientes/C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getClientAlertsAPI(baseParams);

      expect(result).toEqual([]);
    });
  });

  describe('getAlertsByStatusAPI', () => {
    const baseParams: GetAlertsByStatusParams = {
      status: 'Novo',
      token: 'test-token',
    };

    it('should return alerts on successful fetch with Novo status', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlert],
      });

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toEqual([mockAlert]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/status/Novo',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with EmAnalise status', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsByStatusParams = {
        ...baseParams,
        status: 'EmAnalise',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlerts[1]],
      });

      const result = await getAlertsByStatusAPI(params);

      expect(result).toEqual([mockAlerts[1]]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/status/EmAnalise',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return alerts on successful fetch with Resolvido status', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAlertsByStatusParams = {
        ...baseParams,
        status: 'Resolvido',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockAlerts[2]],
      });

      const result = await getAlertsByStatusAPI(params);

      expect(result).toEqual([mockAlerts[2]]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/status/Resolvido',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getAlertsByStatusAPI(baseParams);

      expect(result).toEqual([]);
    });
  });

  describe('startAnalysisAPI', () => {
    const baseParams: StartAnalysisParams = {
      alertId: 'A-3001',
      token: 'test-token',
    };

    it('should return updated alert on successful analysis start', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const updatedAlert: Alert = {
        ...mockAlert,
        status: 'EmAnalise',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedAlert,
      });

      const result = await startAnalysisAPI(baseParams);

      expect(result).toEqual(updatedAlert);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/A-3001/iniciar-analise',
        {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await startAnalysisAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await startAnalysisAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await startAnalysisAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await startAnalysisAPI(baseParams);

      expect(result).toBeNull();
    });
  });

  describe('resolveAlertAPI', () => {
    const baseParams: ResolveAlertParams = {
      alertId: 'A-3001',
      resolvidoPor: 'user@example.com',
      resolucao: 'Alert resolved after investigation',
      token: 'test-token',
    };

    it('should return resolved alert on successful resolution', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const resolvedAlert: Alert = {
        ...mockAlert,
        status: 'Resolvido',
        dataResolucao: '2025-01-18T10:00:00-03:00',
        resolvidoPor: 'user@example.com',
        resolucao: 'Alert resolved after investigation',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => resolvedAlert,
      });

      const result = await resolveAlertAPI(baseParams);

      expect(result).toEqual(resolvedAlert);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/alertas/A-3001/resolver',
        {
          method: 'PATCH',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resolvidoPor: 'user@example.com',
            resolucao: 'Alert resolved after investigation',
          }),
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await resolveAlertAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await resolveAlertAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await resolveAlertAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await resolveAlertAPI(baseParams);

      expect(result).toBeNull();
    });
  });
});
