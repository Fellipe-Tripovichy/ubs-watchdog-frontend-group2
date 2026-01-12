import {
  getMockClientReport,
  getMockAllReports,
  type ClientReport,
} from '@/mocks/reportsMock';

describe('reportsMock', () => {
  describe('getMockClientReport', () => {
    it('should return report for existing clientId', () => {
      const report = getMockClientReport('C-1023');
      expect(report).toBeDefined();
      expect(report.client.id).toBe('C-1023');
      expect(report.client.name).toBe('Maria Eduarda Ribeiro Facio');
    });

    it('should return report for another existing clientId', () => {
      const report = getMockClientReport('C-2041');
      expect(report).toBeDefined();
      expect(report.client.id).toBe('C-2041');
      expect(report.client.name).toBe('João Henrique Souza');
    });

    it('should return first report when clientId does not exist', () => {
      const report = getMockClientReport('C-NONEXISTENT');
      expect(report).toBeDefined();
      expect(report.client.id).toBe('C-1023');
    });

    it('should return full report when no dates are provided', () => {
      const report = getMockClientReport('C-1023');
      expect(report.transactions.length).toBe(6);
      expect(report.alerts.length).toBe(3);
    });

    it('should filter transactions by date range correctly', () => {
      const report = getMockClientReport('C-1023', '2026-01-04', '2026-01-06');
      expect(report.transactions.length).toBe(2);
      expect(report.transactions[0].id).toBe('T-9002');
      expect(report.transactions[1].id).toBe('T-9003');
    });

    it('should include transactions on start date', () => {
      const report = getMockClientReport('C-1023', '2026-01-02', '2026-01-02');
      expect(report.transactions.length).toBe(1);
      expect(report.transactions[0].id).toBe('T-9001');
    });

    it('should include transactions on end date', () => {
      const report = getMockClientReport('C-1023', '2026-01-10', '2026-01-10');
      expect(report.transactions.length).toBe(1);
      expect(report.transactions[0].id).toBe('T-9006');
    });

    it('should return empty transactions array when date range has no transactions', () => {
      const report = getMockClientReport('C-1023', '2025-01-01', '2025-01-31');
      expect(report.transactions.length).toBe(0);
    });

    it('should filter alerts by date range correctly', () => {
      const report = getMockClientReport('C-1023', '2026-01-04', '2026-01-07');
      expect(report.alerts.length).toBe(2);
      expect(report.alerts.some((alert) => alert.id === 'A-3001')).toBe(true);
      expect(report.alerts.some((alert) => alert.id === 'A-3003')).toBe(true);
    });

    it('should include alerts created before end date', () => {
      const report = getMockClientReport('C-1023', '2026-01-08', '2026-01-10');
      expect(report.alerts.length).toBe(2);
      expect(report.alerts.some((alert) => alert.id === 'A-3001')).toBe(true);
      expect(report.alerts.some((alert) => alert.id === 'A-3002')).toBe(true);
    });

    it('should include resolved alerts when resolution date is within range', () => {
      const report = getMockClientReport('C-1023', '2026-01-07', '2026-01-07');
      expect(report.alerts.length).toBe(2);
      const a3003 = report.alerts.find((alert) => alert.id === 'A-3003');
      expect(a3003).toBeDefined();
      expect(a3003?.dataResolucao).toBe('2026-01-07T12:00:00-03:00');
      expect(report.alerts.some((alert) => alert.id === 'A-3001')).toBe(true);
    });

    it('should include unresolved alerts when created before end date', () => {
      const report = getMockClientReport('C-1023', '2026-01-02', '2026-01-03');
      expect(report.alerts.length).toBe(1);
      expect(report.alerts[0].id).toBe('A-3001');
      expect(report.alerts[0].dataResolucao).toBeNull();
    });

    it('should filter alerts correctly for second client', () => {
      const report = getMockClientReport('C-2041', '2026-01-05', '2026-01-06');
      expect(report.alerts.length).toBe(2);
      expect(report.alerts.some((alert) => alert.id === 'A-3101')).toBe(true);
      expect(report.alerts.some((alert) => alert.id === 'A-3102')).toBe(true);
    });

    it('should return empty alerts array when date range has no alerts', () => {
      const report = getMockClientReport('C-1023', '2025-01-01', '2025-01-31');
      expect(report.alerts.length).toBe(0);
    });

    it('should preserve client data when filtering', () => {
      const report = getMockClientReport('C-2041', '2026-01-05', '2026-01-06');
      expect(report.client.id).toBe('C-2041');
      expect(report.client.name).toBe('João Henrique Souza');
      expect(report.client.country).toBe('Suíça');
      expect(report.client.riskLevel).toBe('Alto');
      expect(report.client.kycStatus).toBe('Pendente');
    });

    it('should handle timezone differences correctly', () => {
      // Client C-1023 has transactions with -03:00 timezone
      // Client C-2041 has transactions with Z timezone (UTC)
      const report1 = getMockClientReport('C-1023', '2026-01-02', '2026-01-02');
      expect(report1.transactions.length).toBe(1);

      const report2 = getMockClientReport('C-2041', '2026-01-03', '2026-01-03');
      expect(report2.transactions.length).toBe(1);
    });
  });

  describe('getMockAllReports', () => {
    it('should return all reports when no dates are provided', () => {
      const reports = getMockAllReports();
      expect(reports.length).toBe(2);
      expect(reports[0].client.id).toBe('C-1023');
      expect(reports[1].client.id).toBe('C-2041');
    });

    it('should return all reports with full data when no dates are provided', () => {
      const reports = getMockAllReports();
      expect(reports[0].transactions.length).toBe(6);
      expect(reports[0].alerts.length).toBe(3);
      expect(reports[1].transactions.length).toBe(3);
      expect(reports[1].alerts.length).toBe(3);
    });

    it('should filter transactions for all reports by date range', () => {
      const reports = getMockAllReports('2026-01-04', '2026-01-06');
      expect(reports[0].transactions.length).toBe(2);
      expect(reports[1].transactions.length).toBe(1);
      expect(reports[1].transactions[0].id).toBe('T-9102');
    });

    it('should filter alerts for all reports by date range', () => {
      const reports = getMockAllReports('2026-01-07', '2026-01-08');
      expect(reports[0].alerts.length).toBe(3);
      expect(reports[0].alerts.some((alert) => alert.id === 'A-3003')).toBe(true);
      expect(reports[1].alerts.length).toBe(2);
      expect(reports[1].alerts.some((alert) => alert.id === 'A-3101')).toBe(true);
      expect(reports[1].alerts.some((alert) => alert.id === 'A-3102')).toBe(true);
    });

    it('should preserve client data for all reports when filtering', () => {
      const reports = getMockAllReports('2026-01-04', '2026-01-06');
      expect(reports[0].client.id).toBe('C-1023');
      expect(reports[1].client.id).toBe('C-2041');
      expect(reports[0].client.name).toBe('Maria Eduarda Ribeiro Facio');
      expect(reports[1].client.name).toBe('João Henrique Souza');
    });

    it('should return empty arrays when date range has no data', () => {
      const reports = getMockAllReports('2025-01-01', '2025-01-31');
      expect(reports.length).toBe(2);
      expect(reports[0].transactions.length).toBe(0);
      expect(reports[0].alerts.length).toBe(0);
      expect(reports[1].transactions.length).toBe(0);
      expect(reports[1].alerts.length).toBe(0);
    });

    it('should filter transactions correctly for date range spanning multiple days', () => {
      const reports = getMockAllReports('2026-01-02', '2026-01-10');
      expect(reports[0].transactions.length).toBe(6);
      expect(reports[1].transactions.length).toBe(3);
    });

    it('should filter alerts correctly including resolved ones', () => {
      const reports = getMockAllReports('2026-01-07', '2026-01-08');
      const report1 = reports[0];
      const alert1 = report1.alerts.find((alert) => alert.id === 'A-3003');
      expect(alert1).toBeDefined();
      expect(alert1?.dataResolucao).toBe('2026-01-07T12:00:00-03:00');

      const report2 = reports[1];
      const alert2 = report2.alerts.find((alert) => alert.id === 'A-3102');
      expect(alert2).toBeDefined();
      expect(alert2?.dataResolucao).toBe('2026-01-08T10:00:00Z');
    });

    it('should include unresolved alerts when created before end date', () => {
      const reports = getMockAllReports('2026-01-02', '2026-01-03');
      expect(reports[0].alerts.length).toBe(1);
      expect(reports[0].alerts[0].id).toBe('A-3001');
      expect(reports[0].alerts[0].dataResolucao).toBeNull();
    });

    it('should handle single day date range', () => {
      const reports = getMockAllReports('2026-01-02', '2026-01-02');
      expect(reports[0].transactions.length).toBe(1);
      expect(reports[0].alerts.length).toBe(1);
      expect(reports[1].transactions.length).toBe(0);
      expect(reports[1].alerts.length).toBe(0);
    });

    it('should return same structure for both clients', () => {
      const reports = getMockAllReports('2026-01-05', '2026-01-06');
      reports.forEach((report) => {
        expect(report).toHaveProperty('client');
        expect(report).toHaveProperty('transactions');
        expect(report).toHaveProperty('alerts');
        expect(Array.isArray(report.transactions)).toBe(true);
        expect(Array.isArray(report.alerts)).toBe(true);
      });
    });
  });
});
