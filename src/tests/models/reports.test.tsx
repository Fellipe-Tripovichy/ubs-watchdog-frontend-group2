import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  getBadgeStyleByRisk,
  getBadgeStyleByKyc,
  getReportsColumns,
  getTransactionSummaryColumns,
  getTransactionsColumns,
  type TransactionSummaryRow,
} from '@/models/reports';
import type { Report } from '@/features/reports/reportsSlice';
import type { Transaction } from '@/features/transactions/transactionsAPI';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, style }: any) => (
    <span data-testid="badge" style={style}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/flagImage', () => ({
  FlagImage: ({ country, className }: any) => (
    <img data-testid="flag-image" data-country={country} className={className} alt={country} />
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowUpRight: ({ className }: any) => (
    <svg data-testid="arrow-up-right" className={className} />
  ),
  InfoIcon: ({ className }: any) => (
    <svg data-testid="info-icon" className={className} />
  ),
}));

jest.mock('@/lib/utils', () => ({
  getColorByStatus: jest.fn((status: string) => {
    const colorMap: Record<string, { light: string; foreground: string }> = {
      low: { light: '#d1fae5', foreground: '#065f46' },
      medium: { light: '#fef3c7', foreground: '#92400e' },
      high: { light: '#fee2e2', foreground: '#991b1b' },
      neutral: { light: '#f3f4f6', foreground: '#374151' },
      approved: { light: '#d1fae5', foreground: '#065f46' },
      pending: { light: '#fef3c7', foreground: '#92400e' },
      rejected: { light: '#fee2e2', foreground: '#991b1b' },
    };
    return colorMap[status] || { light: '#f3f4f6', foreground: '#374151' };
  }),
  formatMoney: jest.fn((value: number, currency: string) => {
    return `${currency} ${value.toFixed(2)}`;
  }),
  formatDateTime: jest.fn((date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  }),
}));

jest.mock('@/models/complience', () => ({
  getBadgeStyleBySeverity: jest.fn((severity: string) => {
    const severityMap: Record<string, { backgroundColor: string; color: string }> = {
      Critica: { backgroundColor: '#fee2e2', color: '#991b1b' },
      Alta: { backgroundColor: '#fef3c7', color: '#92400e' },
      Media: { backgroundColor: '#dbeafe', color: '#1e40af' },
      Baixa: { backgroundColor: '#d1fae5', color: '#065f46' },
    };
    return severityMap[severity] || { backgroundColor: '#f3f4f6', color: '#374151' };
  }),
}));

describe('reports models', () => {
  describe('getBadgeStyleByRisk', () => {
    it('should return correct style for Baixo risk', () => {
      const style = getBadgeStyleByRisk('Baixo');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Médio risk', () => {
      const style = getBadgeStyleByRisk('Médio');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Alto risk', () => {
      const style = getBadgeStyleByRisk('Alto');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Nenhum risk', () => {
      const style = getBadgeStyleByRisk('Nenhum');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });
  });

  describe('getBadgeStyleByKyc', () => {
    it('should return correct style for Aprovado status', () => {
      const style = getBadgeStyleByKyc('Aprovado');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Pendente status', () => {
      const style = getBadgeStyleByKyc('Pendente');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Rejeitado status', () => {
      const style = getBadgeStyleByKyc('Rejeitado');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });

    it('should return correct style for Nenhum status', () => {
      const style = getBadgeStyleByKyc('Nenhum');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
    });
  });

  describe('getReportsColumns', () => {
    const mockReport: Report = {
      clienteId: 'C-1023',
      nomeCliente: 'Maria Eduarda Ribeiro Facio',
      pais: 'Brasil',
      nivelRisco: 'Alto',
      statusKyc: 'Aprovado',
      dataCriacao: '2025-01-01T00:00:00-03:00',
      totalTransacoes: 3,
      totalMovimentado: 1700,
      mediaTransacao: 566.67,
      dataUltimaTransacao: '2025-01-15T10:00:00-03:00',
      totalAlertas: 2,
      alertasNovos: 1,
      alertasEmAnalise: 1,
      alertasResolvidos: 0,
      alertasCriticos: 1,
      periodoInicio: null,
      periodoFim: null,
    };

    it('should return an array of columns', () => {
      const columns = getReportsColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have client column', () => {
      const columns = getReportsColumns();
      const clientColumn = columns.find((col) => col.key === 'client');
      expect(clientColumn).toBeDefined();
      expect(clientColumn?.label).toBe('Cliente');
      if (clientColumn?.render) {
        const { container } = render(<>{clientColumn.render(mockReport, 0)}</>);
        expect(container.textContent).toContain('Maria Eduarda Ribeiro Facio');
      }
    });

    it('should have country column with flag', () => {
      const columns = getReportsColumns();
      const countryColumn = columns.find((col) => col.key === 'country');
      expect(countryColumn).toBeDefined();
      expect(countryColumn?.label).toBe('País');
      if (countryColumn?.render) {
        const { container } = render(<>{countryColumn.render(mockReport, 0)}</>);
        expect(screen.getByTestId('flag-image')).toBeInTheDocument();
        expect(screen.getByText('Brasil')).toBeInTheDocument();
      }
    });

    it('should have risk level column with badge', () => {
      const columns = getReportsColumns();
      const riskColumn = columns.find((col) => col.key === 'riskLevel');
      expect(riskColumn).toBeDefined();
      expect(riskColumn?.label).toBe('Nível de Risco');
      if (riskColumn?.render) {
        render(<>{riskColumn.render(mockReport, 0)}</>);
        const badge = screen.getByTestId('badge');
        expect(badge).toBeInTheDocument();
        expect(badge.textContent).toBe('Alto');
      }
    });

    it('should have KYC status column with badge', () => {
      const columns = getReportsColumns();
      const kycColumn = columns.find((col) => col.key === 'kycStatus');
      expect(kycColumn).toBeDefined();
      expect(kycColumn?.label).toBe('Status KYC');
      if (kycColumn?.render) {
        render(<>{kycColumn.render(mockReport, 0)}</>);
        const badge = screen.getByTestId('badge');
        expect(badge).toBeInTheDocument();
        expect(badge.textContent).toBe('Aprovado');
      }
    });

    it('should have transactions column', () => {
      const columns = getReportsColumns();
      const transactionsColumn = columns.find((col) => col.key === 'transactions');
      expect(transactionsColumn).toBeDefined();
      expect(transactionsColumn?.label).toBe('Transações');
      if (transactionsColumn?.render) {
        const result = transactionsColumn.render(mockReport, 0);
        expect(result).toBe(3);
      }
    });

    it('should have alerts status column with tooltip when alerts exist', () => {
      const columns = getReportsColumns();
      const alertsColumn = columns.find((col) => col.key === 'alertsStatus');
      expect(alertsColumn).toBeDefined();
      expect(alertsColumn?.label).toBe('Status Alertas');
      if (alertsColumn?.render) {
        render(<>{alertsColumn.render(mockReport, 0)}</>);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByTestId('info-icon')).toBeInTheDocument();
      }
    });

    it('should not show tooltip when no alerts exist', () => {
      const reportWithoutAlerts: Report = {
        ...mockReport,
        totalAlertas: 0,
      };
      const columns = getReportsColumns();
      const alertsColumn = columns.find((col) => col.key === 'alertsStatus');
      if (alertsColumn?.render) {
        render(<>{alertsColumn.render(reportWithoutAlerts, 0)}</>);
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.queryByTestId('info-icon')).not.toBeInTheDocument();
      }
    });

    it('should have critical alerts column', () => {
      const columns = getReportsColumns();
      const criticalColumn = columns.find((col) => col.key === 'criticalAlerts');
      expect(criticalColumn).toBeDefined();
      expect(criticalColumn?.label).toBe('Alertas Críticos');
      if (criticalColumn?.render) {
        render(<>{criticalColumn.render(mockReport, 0)}</>);
        const badge = screen.getByTestId('badge');
        expect(badge).toBeInTheDocument();
        expect(badge.textContent).toBe('1');
      }
    });

    it('should show dash when no critical alerts', () => {
      const reportWithoutCritical: Report = {
        ...mockReport,
        alertasCriticos: 0,
      };
      const columns = getReportsColumns();
      const criticalColumn = columns.find((col) => col.key === 'criticalAlerts');
      if (criticalColumn?.render) {
        const { container } = render(<>{criticalColumn.render(reportWithoutCritical, 0)}</>);
        expect(container.textContent).toContain('-');
      }
    });

    it('should have details column with link', () => {
      const columns = getReportsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      expect(detailsColumn).toBeDefined();
      expect(detailsColumn?.label).toBe('Detalhes');
      expect(detailsColumn?.headerClassName).toBe('text-right');
      expect(detailsColumn?.className).toBe('text-right');
      if (detailsColumn?.render) {
        render(<>{detailsColumn.render(mockReport, 0)}</>);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/reports/C-1023');
        expect(screen.getByTestId('arrow-up-right')).toBeInTheDocument();
      }
    });
  });

  describe('getTransactionSummaryColumns', () => {
    const mockSummaryRow: TransactionSummaryRow = {
      type: 'Depósito',
      count: 5,
      total: 10000,
      average: 2000,
    };

    it('should return an array of columns', () => {
      const columns = getTransactionSummaryColumns('BRL');
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have type column', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const typeColumn = columns.find((col) => col.key === 'type');
      expect(typeColumn).toBeDefined();
      expect(typeColumn?.label).toBe('Tipo');
      if (typeColumn?.render) {
        const result = typeColumn.render(mockSummaryRow, 0);
        expect(result).toBe('Depósito');
      }
    });

    it('should have count column', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const countColumn = columns.find((col) => col.key === 'count');
      expect(countColumn).toBeDefined();
      expect(countColumn?.label).toBe('Quantidade');
      if (countColumn?.render) {
        const result = countColumn.render(mockSummaryRow, 0);
        expect(result).toBe(5);
      }
    });

    it('should have total column with formatted money', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const totalColumn = columns.find((col) => col.key === 'total');
      expect(totalColumn).toBeDefined();
      expect(totalColumn?.label).toBe('Total');
      if (totalColumn?.render) {
        const result = totalColumn.render(mockSummaryRow, 0);
        expect(result).toContain('BRL');
        expect(result).toContain('10000.00');
      }
    });

    it('should have average column with formatted money', () => {
      const columns = getTransactionSummaryColumns('USD');
      const averageColumn = columns.find((col) => col.key === 'average');
      expect(averageColumn).toBeDefined();
      expect(averageColumn?.label).toBe('Média');
      if (averageColumn?.render) {
        const result = averageColumn.render(mockSummaryRow, 0);
        expect(result).toContain('USD');
        expect(result).toContain('2000.00');
      }
    });

    it('should apply correct className and headerClassName', () => {
      const columns = getTransactionSummaryColumns('EUR');
      columns.forEach((column) => {
        expect(column.className).toBe('py-3 pr-4');
        expect(column.headerClassName).toBe('py-3 pr-4');
      });
    });
  });

  describe('getTransactionsColumns', () => {
    const mockTransaction: Transaction = {
      id: 'T-9001',
      clienteId: 'C-1023',
      tipo: 'Deposito',
      valor: 5000.50,
      moeda: 'BRL',
      contraparteId: null,
      dataHora: '2025-01-15T10:30:00-03:00',
      quantidadeAlertas: 2,
    };

    it('should return an array of columns', () => {
      const columns = getTransactionsColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have id column', () => {
      const columns = getTransactionsColumns();
      const idColumn = columns.find((col) => col.key === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');
      if (idColumn?.render) {
        const result = idColumn.render(mockTransaction, 0);
        expect(result).toBe('T-9001');
      }
    });

    it('should have type column', () => {
      const columns = getTransactionsColumns();
      const typeColumn = columns.find((col) => col.key === 'type');
      expect(typeColumn).toBeDefined();
      expect(typeColumn?.label).toBe('Tipo');
      if (typeColumn?.render) {
        const result = typeColumn.render(mockTransaction, 0);
        expect(result).toBe('Deposito');
      }
    });

    it('should have amount column with formatted money', () => {
      const columns = getTransactionsColumns();
      const amountColumn = columns.find((col) => col.key === 'amount');
      expect(amountColumn).toBeDefined();
      expect(amountColumn?.label).toBe('Valor');
      if (amountColumn?.render) {
        const result = amountColumn.render(mockTransaction, 0);
        expect(result).toContain('BRL');
        expect(result).toContain('5000.50');
      }
    });

    it('should have counterparty column', () => {
      const columns = getTransactionsColumns();
      const counterpartyColumn = columns.find((col) => col.key === 'counterparty');
      expect(counterpartyColumn).toBeDefined();
      expect(counterpartyColumn?.label).toBe('Contraparte');
      if (counterpartyColumn?.render) {
        const result = counterpartyColumn.render(mockTransaction, 0);
        expect(result).toBe('-');
      }
    });

    it('should show dash when counterpartyId is null', () => {
      const transactionWithoutCounterparty: Transaction = {
        ...mockTransaction,
        contraparteId: null,
      };
      const columns = getTransactionsColumns();
      const counterpartyColumn = columns.find((col) => col.key === 'counterparty');
      if (counterpartyColumn?.render) {
        const result = counterpartyColumn.render(transactionWithoutCounterparty, 0);
        expect(result).toBe('-');
      }
    });

    it('should have dateTime column with formatted date', () => {
      const columns = getTransactionsColumns();
      const dateTimeColumn = columns.find((col) => col.key === 'dateTime');
      expect(dateTimeColumn).toBeDefined();
      expect(dateTimeColumn?.label).toBe('DataHora');
      if (dateTimeColumn?.render) {
        const result = dateTimeColumn.render(mockTransaction, 0);
        expect(typeof result).toBe('string');
      }
    });

    it('should apply correct className and headerClassName', () => {
      const columns = getTransactionsColumns();
      columns.forEach((column) => {
        if (column.key === 'id' || column.key === 'type' || column.key === 'amount' || column.key === 'dateTime') {
          expect(column.className).toBe('py-3 pr-4 whitespace-nowrap');
          expect(column.headerClassName).toBe('py-3 pr-4');
        } else if (column.key === 'counterparty') {
          expect(column.className).toBe('py-3 pr-4 min-w-[220px]');
          expect(column.headerClassName).toBe('py-3 pr-4');
        }
      });
    });
  });
});
