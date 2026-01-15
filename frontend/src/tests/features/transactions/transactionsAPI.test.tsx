import {
  createTransactionAPI,
  getTransactionsAPI,
  getTransactionByIdAPI,
  getClientTransactionsAPI,
  type CreateTransactionParams,
  type GetTransactionsParams,
  type GetTransactionByIdParams,
  type GetClientTransactionsParams,
} from '@/features/transactions/transactionsAPI';
import type { Transaction } from '@/features/transactions/transactionsAPI';

// Mock global fetch
global.fetch = jest.fn();

// Store original env
const originalEnv = process.env;

describe('transactionsAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockTransaction: Transaction = {
    id: 'T-9001',
    clienteId: 'C-1023',
    tipo: 'Deposito',
    valor: 5000.50,
    moeda: 'BRL',
    contraparteId: null,
    dataHora: '2025-01-15T10:30:00-03:00',
    quantidadeAlertas: 0,
  };

  const mockTransactions: Transaction[] = [
    mockTransaction,
    {
      ...mockTransaction,
      id: 'T-9002',
      tipo: 'Transferencia',
      valor: 10000,
      moeda: 'USD',
      contraparteId: 'C-2041',
      quantidadeAlertas: 2,
    },
  ];

  describe('createTransactionAPI', () => {
    const baseParams: CreateTransactionParams = {
      transaction: {
        clienteId: 'C-1023',
        tipo: 'Deposito',
        valor: 5000.50,
        moeda: 'BRL',
        contraparteId: null,
      },
      token: 'test-token',
    };

    it('should return transaction on successful creation', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await createTransactionAPI(baseParams);

      expect(result).toEqual(mockTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(baseParams.transaction),
        }
      );
    });

    it('should return transaction with contraparteId on successful creation', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: CreateTransactionParams = {
        ...baseParams,
        transaction: {
          ...baseParams.transaction,
          tipo: 'Transferencia',
          contraparteId: 'C-2041',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTransaction,
          tipo: 'Transferencia',
          contraparteId: 'C-2041',
        }),
      });

      const result = await createTransactionAPI(params);

      expect(result).toEqual({
        ...mockTransaction,
        tipo: 'Transferencia',
        contraparteId: 'C-2041',
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params.transaction),
        }
      );
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await createTransactionAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await createTransactionAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await createTransactionAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await createTransactionAPI(baseParams);

      expect(result).toBeNull();
    });
  });

  describe('getTransactionsAPI', () => {
    const baseParams: GetTransactionsParams = {
      token: 'test-token',
    };

    it('should return transactions on successful fetch without filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getTransactionsAPI(baseParams);

      expect(result).toEqual(mockTransactions);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/filtrar',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return transactions on successful fetch with clienteId filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        clienteId: 'C-1023',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/filtrar?clienteId=C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return transactions on successful fetch with tipo filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        tipo: 'Deposito',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTransaction],
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual([mockTransaction]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/filtrar?tipo=Deposito',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return transactions on successful fetch with moeda filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        moeda: 'BRL',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTransaction],
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual([mockTransaction]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/filtrar?moeda=BRL',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return transactions on successful fetch with dataInicio filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        dataInicio: '2025-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      // API adjusts dataInicio by subtracting 1 day: 2025-01-01 becomes 2024-12-31
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/transacoes/filtrar?dataInicio='),
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
      // Should contain adjusted date (2024-12-31, one day before)
      expect(callUrl).toContain('2024-12-31');
    });

    it('should return transactions on successful fetch with dataFim filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        dataFim: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      // API adjusts dataFim by adding 1 day: 2025-01-31 becomes 2025-02-01
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/transacoes/filtrar?dataFim='),
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
      // Should contain adjusted date (one day after 2025-01-31)
      expect(callUrl).toMatch(/2025-02-\d{2}/);
    });

    it('should return transactions on successful fetch with all filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetTransactionsParams = {
        ...baseParams,
        clienteId: 'C-1023',
        tipo: 'Deposito',
        moeda: 'BRL',
        dataInicio: '2025-01-01',
        dataFim: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTransaction],
      });

      const result = await getTransactionsAPI(params);

      expect(result).toEqual([mockTransaction]);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('clienteId=C-1023');
      expect(callUrl).toContain('tipo=Deposito');
      expect(callUrl).toContain('moeda=BRL');
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).toContain('dataFim=');
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getTransactionsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getTransactionsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getTransactionsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getTransactionsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getTransactionsAPI(baseParams);

      expect(result).toEqual([]);
    });
  });

  describe('getTransactionByIdAPI', () => {
    const baseParams: GetTransactionByIdParams = {
      transacaoId: 'T-9001',
      token: 'test-token',
    };

    it('should return transaction on successful fetch', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      });

      const result = await getTransactionByIdAPI(baseParams);

      expect(result).toEqual(mockTransaction);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/T-9001',
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

      const result = await getTransactionByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getTransactionByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getTransactionByIdAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getTransactionByIdAPI(baseParams);

      expect(result).toBeNull();
    });
  });

  describe('getClientTransactionsAPI', () => {
    const baseParams: GetClientTransactionsParams = {
      clientId: 'C-1023',
      token: 'test-token',
    };

    it('should return transactions on successful fetch without date filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toEqual(mockTransactions);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/transacoes/clientes/C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return transactions on successful fetch with dataInicio filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetClientTransactionsParams = {
        ...baseParams,
        dataInicio: '2025-01-01',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getClientTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      // API adjusts dataInicio by subtracting 1 day: 2025-01-01 becomes 2024-12-31
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/transacoes/clientes/C-1023?dataInicio='),
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
      // Should contain adjusted date (2024-12-31, one day before)
      expect(callUrl).toContain('2024-12-31');
    });

    it('should return transactions on successful fetch with dataFim filter', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetClientTransactionsParams = {
        ...baseParams,
        dataFim: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getClientTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      // API adjusts dataFim by adding 1 day: 2025-01-31 becomes 2025-02-01
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com/api/transacoes/clientes/C-1023?dataFim='),
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
      // Should contain adjusted date (one day after 2025-01-31)
      expect(callUrl).toMatch(/2025-02-\d{2}/);
    });

    it('should return transactions on successful fetch with both date filters', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetClientTransactionsParams = {
        ...baseParams,
        dataInicio: '2025-01-01',
        dataFim: '2025-01-31',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      });

      const result = await getClientTransactionsAPI(params);

      expect(result).toEqual(mockTransactions);
      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('dataInicio=');
      expect(callUrl).toContain('dataFim=');
    });

    it('should return null when API URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getClientTransactionsAPI(baseParams);

      expect(result).toEqual([]);
    });
  });
});
