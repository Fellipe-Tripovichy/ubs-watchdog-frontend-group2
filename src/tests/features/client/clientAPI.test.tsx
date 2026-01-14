import {
  getClientsAPI,
  getClientByIdAPI,
  type GetClientsParams,
  type GetClientByIdParams,
} from '@/features/client/clientAPI';
import type { Client } from '@/features/client/clientAPI';

global.fetch = jest.fn();

const originalEnv = process.env;

describe('clientAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockClient: Client = {
    id: 'C-1023',
    nome: 'Maria Eduarda Ribeiro Facio',
    pais: 'Brasil',
    nivelRisco: 'Alto',
    statusKyc: 'Aprovado',
    dataCriacao: '2025-01-01T00:00:00-03:00',
  };

  const mockClients: Client[] = [
    mockClient,
    {
      ...mockClient,
      id: 'C-2041',
      nome: 'João Henrique Souza',
      pais: 'Estados Unidos',
      nivelRisco: 'Médio',
      statusKyc: 'Pendente',
    },
  ];

  describe('getClientsAPI', () => {
    const baseParams: GetClientsParams = {
      token: 'test-token',
    };

    it('should return clients on successful fetch', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      });

      const result = await getClientsAPI(baseParams);

      expect(result).toEqual(mockClients);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/clientes',
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

      const result = await getClientsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await getClientsAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getClientsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getClientsAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return empty array when API returns empty array', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getClientsAPI(baseParams);

      expect(result).toEqual([]);
    });
  });

  describe('getClientByIdAPI', () => {
    const baseParams: GetClientByIdParams = {
      clientId: 'C-1023',
      token: 'test-token',
    };

    it('should return client on successful fetch', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      });

      const result = await getClientByIdAPI(baseParams);

      expect(result).toEqual(mockClient);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/clientes/C-1023',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should return client with different clientId', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      const params: GetClientByIdParams = {
        ...baseParams,
        clientId: 'C-2041',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients[1],
      });

      const result = await getClientByIdAPI(params);

      expect(result).toEqual(mockClients[1]);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/clientes/C-2041',
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

      const result = await getClientByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return null when response is not ok', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getClientByIdAPI(baseParams);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null on network error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getClientByIdAPI(baseParams);

      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      process.env.NEXT_PUBLIC_UBS_WATCHDOG_API = 'https://api.example.com';

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await getClientByIdAPI(baseParams);

      expect(result).toBeNull();
    });
  });
});
