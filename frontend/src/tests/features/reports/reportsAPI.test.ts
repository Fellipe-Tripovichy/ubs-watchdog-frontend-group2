import {
  getClientReportAPI,
  getAllReportsAPI,
  type GetClientReportParams,
  type GetAllReportsParams,
} from '@/features/reports/reportsAPI';
import type { Report } from '@/features/reports/reportsSlice';

global.fetch = jest.fn();

const originalEnv = process.env;

describe('reportsAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockReport: Report = {
    clienteId: 'C-1023',
    nomeCliente: 'Maria Eduarda Ribeiro Facio',
    pais: 'Brasil',
    nivelRisco: 'Alto',
    statusKyc: 'Aprovado',
    dataCriacao: '2025-01-01T00:00:00-03:00',
    totalTransacoes: 15,
    totalMovimentado: 50000,
    mediaTransacao: 3333.33,
    dataUltimaTransacao: '2025-01-15T10:30:00-03:00',
    totalAlertas: 3,
    alertasNovos: 1,
    alertasEmAnalise: 1,
    alertasResolvidos: 1,
    alertasCriticos: 0,
    periodoInicio: '2025-01-01T00:00:00-03:00',
    periodoFim: '2025-01-31T23:59:59-03:00',
  };

  describe('getClientReportAPI', () => {
    const baseParams: GetClientReportParams = {
      clientId: 'C-1023',
      token: 'test-token',
    };

    it('should return report on successful fetch without date filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI(baseParams);

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/cliente/C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return report on successful fetch with dataInicio filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      const params: GetClientReportParams = {
        ...baseParams,
        dataInicio: '2025-01-01T00:00:00-03:00',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI(params);

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/relatorios/cliente/C-1023?dataInicio='),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).toContain('2024-12-31');
    });

    it('should return report on successful fetch with dataFim filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      const params: GetClientReportParams = {
        ...baseParams,
        dataFim: '2025-01-31T23:59:59-03:00',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI(params);

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/relatorios/cliente/C-1023?dataFim='),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataFim=');
      expect(callUrl).toMatch(/2025-02-\d{2}/);
    });

    it('should return report on successful fetch with both date filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      const params: GetClientReportParams = {
        ...baseParams,
        dataInicio: '2025-01-01T00:00:00-03:00',
        dataFim: '2025-01-31T23:59:59-03:00',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI(params);

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/relatorios/cliente/C-1023'),
        expect.any(Object)
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).toContain('dataFim=');
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getClientReportAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getClientReportAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getClientReportAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getClientReportAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should call getMockClientReport with clientId and return the result', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI({
        clientId: 'C-2041',
        token: 'test-token',
      });

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/cliente/C-2041',
        expect.any(Object)
      );
    });

    it('should call getMockClientReport with clientId and date filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI({
        clientId: 'C-2041',
        token: 'test-token',
        dataInicio: '2025-01-01T00:00:00-03:00',
        dataFim: '2025-01-31T23:59:59-03:00',
      });

      expect(result).toEqual(mockReport);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('C-2041');
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).toContain('dataFim=');
    });

    it('should call getMockClientReport with only startDate', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI({
        clientId: 'C-2041',
        token: 'test-token',
        dataInicio: '2025-01-01T00:00:00-03:00',
      });

      expect(result).toEqual(mockReport);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).not.toContain('dataFim=');
    });

    it('should call getMockClientReport with only endDate', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      });

      const result = await getClientReportAPI({
        clientId: 'C-2041',
        token: 'test-token',
        dataFim: '2025-01-31T23:59:59-03:00',
      });

      expect(result).toEqual(mockReport);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataFim=');
      expect(callUrl).not.toContain('dataInicio=');
    });
  });

  describe('getAllReportsAPI', () => {
    const baseParams: GetAllReportsParams = {
      token: 'test-token',
    };

    const mockReports: Report[] = [
      mockReport,
      {
        ...mockReport,
        clienteId: 'C-2041',
        nomeCliente: 'João Henrique Souza',
        pais: 'Estados Unidos',
      },
    ];

    it('should return reports on successful fetch without filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(baseParams);

      expect(result).toEqual(mockReports);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/filtrar',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return reports on successful fetch with statusAlerta filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        statusAlerta: 'Novo',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(params);

      expect(result).toEqual(mockReports);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/filtrar?statusAlerta=Novo',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return reports on successful fetch with statusKyc filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        statusKyc: 'Aprovado',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(params);

      expect(result).toEqual(mockReports);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/filtrar?statusKyc=Aprovado',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return reports on successful fetch with pais filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        pais: 'Brasil',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(params);

      expect(result).toEqual(mockReports);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/relatorios/filtrar?pais=Brasil',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return reports on successful fetch with all filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        statusAlerta: 'Novo',
        statusKyc: 'Aprovado',
        pais: 'Brasil',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(params);

      expect(result).toEqual(mockReports);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/relatorios/filtrar'),
        expect.any(Object)
      );
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('statusAlerta=');
      expect(callUrl).toContain('statusKyc=');
      expect(callUrl).toContain('pais=');
    });

    it('should return reports on successful fetch with partial filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        statusAlerta: 'Novo',
        pais: 'Brasil',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      const result = await getAllReportsAPI(params);

      expect(result).toEqual(mockReports);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('statusAlerta=');
      expect(callUrl).toContain('pais=');
      expect(callUrl).not.toContain('statusKyc=');
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getAllReportsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getAllReportsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getAllReportsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getAllReportsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getAllReportsAPI(baseParams);

      expect(result).toEqual([]);
    });

    it('should handle URL encoding correctly for filter values', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetAllReportsParams = {
        ...baseParams,
        pais: 'Estados Unidos',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReports,
      });

      await getAllReportsAPI(params);

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('pais=');
      // URL should be properly encoded (URLSearchParams uses + for spaces)
      expect(callUrl).toContain('Estados+Unidos');
    });
  });
});
