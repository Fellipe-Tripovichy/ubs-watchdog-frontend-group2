import {
  getClientReportAPI,
  getAllReportsAPI,
  type GetClientReportParams,
  type GetAllReportsParams,
} from '@/features/reports/reportsAPI';
import type { ClientReport } from '@/mocks/reportsMock';

// Mock the reportsMock module
jest.mock('@/mocks/reportsMock', () => ({
  getMockClientReport: jest.fn(),
  getMockAllReports: jest.fn(),
}));

import { getMockClientReport, getMockAllReports } from '@/mocks/reportsMock';

const mockGetMockClientReport = getMockClientReport as jest.MockedFunction<typeof getMockClientReport>;
const mockGetMockAllReports = getMockAllReports as jest.MockedFunction<typeof getMockAllReports>;

describe('Reports API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClientReportAPI', () => {
    it('should call getMockClientReport with clientId and return the result', async () => {
      const mockReport: ClientReport = {
        client: {
          id: 'C-1023',
          name: 'Test Client',
          country: 'Brasil',
          riskLevel: 'Médio',
          kycStatus: 'Aprovado',
        },
        transactions: [],
        alerts: [],
      };

      mockGetMockClientReport.mockReturnValue(mockReport);

      const params: GetClientReportParams = {
        clientId: 'C-1023',
        token: 'test-token',
      };

      const result = await getClientReportAPI(params);

      expect(mockGetMockClientReport).toHaveBeenCalledWith('C-1023', undefined, undefined);
      expect(result).toEqual(mockReport);
    });

    it('should call getMockClientReport with clientId and date filters', async () => {
      const mockReport: ClientReport = {
        client: {
          id: 'C-1023',
          name: 'Test Client',
          country: 'Brasil',
          riskLevel: 'Médio',
          kycStatus: 'Aprovado',
        },
        transactions: [],
        alerts: [],
      };

      mockGetMockClientReport.mockReturnValue(mockReport);

      const params: GetClientReportParams = {
        clientId: 'C-2041',
        token: 'test-token',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      const result = await getClientReportAPI(params);

      expect(mockGetMockClientReport).toHaveBeenCalledWith('C-2041', '2026-01-01', '2026-01-31');
      expect(result).toEqual(mockReport);
    });

    it('should call getMockClientReport with only startDate', async () => {
      const mockReport: ClientReport = {
        client: {
          id: 'C-1023',
          name: 'Test Client',
          country: 'Brasil',
          riskLevel: 'Médio',
          kycStatus: 'Aprovado',
        },
        transactions: [],
        alerts: [],
      };

      mockGetMockClientReport.mockReturnValue(mockReport);

      const params: GetClientReportParams = {
        clientId: 'C-1023',
        token: 'test-token',
        startDate: '2026-01-01',
      };

      const result = await getClientReportAPI(params);

      expect(mockGetMockClientReport).toHaveBeenCalledWith('C-1023', '2026-01-01', undefined);
      expect(result).toEqual(mockReport);
    });

    it('should call getMockClientReport with only endDate', async () => {
      const mockReport: ClientReport = {
        client: {
          id: 'C-1023',
          name: 'Test Client',
          country: 'Brasil',
          riskLevel: 'Médio',
          kycStatus: 'Aprovado',
        },
        transactions: [],
        alerts: [],
      };

      mockGetMockClientReport.mockReturnValue(mockReport);

      const params: GetClientReportParams = {
        clientId: 'C-1023',
        token: 'test-token',
        endDate: '2026-01-31',
      };

      const result = await getClientReportAPI(params);

      expect(mockGetMockClientReport).toHaveBeenCalledWith('C-1023', undefined, '2026-01-31');
      expect(result).toEqual(mockReport);
    });

    it('should not use token parameter (token is for future API implementation)', async () => {
      const mockReport: ClientReport = {
        client: {
          id: 'C-1023',
          name: 'Test Client',
          country: 'Brasil',
          riskLevel: 'Médio',
          kycStatus: 'Aprovado',
        },
        transactions: [],
        alerts: [],
      };

      mockGetMockClientReport.mockReturnValue(mockReport);

      const params: GetClientReportParams = {
        clientId: 'C-1023',
        token: 'different-token',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      await getClientReportAPI(params);

      // Token should not be passed to getMockClientReport
      expect(mockGetMockClientReport).toHaveBeenCalledWith('C-1023', '2026-01-01', '2026-01-31');
      expect(mockGetMockClientReport).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        'different-token'
      );
    });
  });

  describe('getAllReportsAPI', () => {
    it('should call getMockAllReports without dates and return the result', async () => {
      const mockReports: ClientReport[] = [
        {
          client: {
            id: 'C-1023',
            name: 'Test Client 1',
            country: 'Brasil',
            riskLevel: 'Médio',
            kycStatus: 'Aprovado',
          },
          transactions: [],
          alerts: [],
        },
        {
          client: {
            id: 'C-2041',
            name: 'Test Client 2',
            country: 'Estados Unidos',
            riskLevel: 'Alto',
            kycStatus: 'Pendente',
          },
          transactions: [],
          alerts: [],
        },
      ];

      mockGetMockAllReports.mockReturnValue(mockReports);

      const params: GetAllReportsParams = {
        token: 'test-token',
      };

      const result = await getAllReportsAPI(params);

      expect(mockGetMockAllReports).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockReports);
    });

    it('should call getMockAllReports with date filters and return the result', async () => {
      const mockReports: ClientReport[] = [
        {
          client: {
            id: 'C-1023',
            name: 'Test Client 1',
            country: 'Brasil',
            riskLevel: 'Médio',
            kycStatus: 'Aprovado',
          },
          transactions: [],
          alerts: [],
        },
      ];

      mockGetMockAllReports.mockReturnValue(mockReports);

      const params: GetAllReportsParams = {
        token: 'test-token',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      const result = await getAllReportsAPI(params);

      expect(mockGetMockAllReports).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
      expect(result).toEqual(mockReports);
    });

    it('should call getMockAllReports with only startDate', async () => {
      const mockReports: ClientReport[] = [];

      mockGetMockAllReports.mockReturnValue(mockReports);

      const params: GetAllReportsParams = {
        token: 'test-token',
        startDate: '2026-01-01',
      };

      const result = await getAllReportsAPI(params);

      expect(mockGetMockAllReports).toHaveBeenCalledWith('2026-01-01', undefined);
      expect(result).toEqual(mockReports);
    });

    it('should call getMockAllReports with only endDate', async () => {
      const mockReports: ClientReport[] = [];

      mockGetMockAllReports.mockReturnValue(mockReports);

      const params: GetAllReportsParams = {
        token: 'test-token',
        endDate: '2026-01-31',
      };

      const result = await getAllReportsAPI(params);

      expect(mockGetMockAllReports).toHaveBeenCalledWith(undefined, '2026-01-31');
      expect(result).toEqual(mockReports);
    });

    it('should not use token parameter (token is for future API implementation)', async () => {
      const mockReports: ClientReport[] = [];

      mockGetMockAllReports.mockReturnValue(mockReports);

      const params: GetAllReportsParams = {
        token: 'different-token',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      await getAllReportsAPI(params);

      // Token should not be passed to getMockAllReports
      expect(mockGetMockAllReports).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
      expect(mockGetMockAllReports).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'different-token'
      );
    });

    it('should handle empty array result', async () => {
      mockGetMockAllReports.mockReturnValue([]);

      const params: GetAllReportsParams = {
        token: 'test-token',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      };

      const result = await getAllReportsAPI(params);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
