import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  getBadgeStyleByRisk,
  getBadgeStyleByKyc,
  getBadgeStyleBySeverity,
  getBadgeStyleByStatus,
  getReportsColumns,
  getTransactionSummaryColumns,
  getAlertsColumns,
  getTransactionsColumns,
} from '@/models/reports';
import type {
  ClientReport,
  Transaction,
  Alert,
  AlertSeverity,
  AlertStatus,
  TransactionType,
} from '@/mocks/reportsMock';
import type { TransactionSummaryRow } from '@/models/reports';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('reports models', () => {
  describe('getBadgeStyleByRisk', () => {
    it('should return correct style for "Baixo" risk', () => {
      const style = getBadgeStyleByRisk('Baixo');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Médio" risk', () => {
      const style = getBadgeStyleByRisk('Médio');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Alto" risk', () => {
      const style = getBadgeStyleByRisk('Alto');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different risk levels', () => {
      const baixoStyle = getBadgeStyleByRisk('Baixo');
      const medioStyle = getBadgeStyleByRisk('Médio');
      const altoStyle = getBadgeStyleByRisk('Alto');

      expect(baixoStyle).not.toEqual(medioStyle);
      expect(medioStyle).not.toEqual(altoStyle);
      expect(baixoStyle).not.toEqual(altoStyle);
    });
  });

  describe('getBadgeStyleByKyc', () => {
    it('should return correct style for "Aprovado" kyc', () => {
      const style = getBadgeStyleByKyc('Aprovado');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Pendente" kyc', () => {
      const style = getBadgeStyleByKyc('Pendente');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Reprovado" kyc', () => {
      const style = getBadgeStyleByKyc('Reprovado');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different kyc statuses', () => {
      const aprovadoStyle = getBadgeStyleByKyc('Aprovado');
      const pendenteStyle = getBadgeStyleByKyc('Pendente');
      const reprovadoStyle = getBadgeStyleByKyc('Reprovado');

      expect(aprovadoStyle).not.toEqual(pendenteStyle);
      expect(pendenteStyle).not.toEqual(reprovadoStyle);
      expect(aprovadoStyle).not.toEqual(reprovadoStyle);
    });
  });

  describe('getBadgeStyleBySeverity', () => {
    it('should return correct style for "Baixa" severity', () => {
      const style = getBadgeStyleBySeverity('Baixa');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Média" severity', () => {
      const style = getBadgeStyleBySeverity('Média');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Alta" severity', () => {
      const style = getBadgeStyleBySeverity('Alta');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Crítica" severity', () => {
      const style = getBadgeStyleBySeverity('Crítica');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different severities', () => {
      const baixaStyle = getBadgeStyleBySeverity('Baixa');
      const mediaStyle = getBadgeStyleBySeverity('Média');
      const altaStyle = getBadgeStyleBySeverity('Alta');
      const criticaStyle = getBadgeStyleBySeverity('Crítica');

      expect(baixaStyle).not.toEqual(mediaStyle);
      expect(mediaStyle).not.toEqual(altaStyle);
      expect(altaStyle).not.toEqual(criticaStyle);
    });
  });

  describe('getBadgeStyleByStatus', () => {
    it('should return correct style for "Resolvido" status', () => {
      const style = getBadgeStyleByStatus('Resolvido');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Em Análise" status', () => {
      const style = getBadgeStyleByStatus('Em Análise');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Novo" status', () => {
      const style = getBadgeStyleByStatus('Novo');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different statuses', () => {
      const resolvidoStyle = getBadgeStyleByStatus('Resolvido');
      const emAnaliseStyle = getBadgeStyleByStatus('Em Análise');
      const novoStyle = getBadgeStyleByStatus('Novo');

      expect(resolvidoStyle).not.toEqual(emAnaliseStyle);
      expect(emAnaliseStyle).not.toEqual(novoStyle);
      expect(resolvidoStyle).not.toEqual(novoStyle);
    });
  });

  describe('getReportsColumns', () => {
    const mockReport: ClientReport = {
      client: {
        id: 'C-1023',
        name: 'Maria Eduarda Ribeiro Facio',
        country: 'Brasil',
        riskLevel: 'Médio',
        kycStatus: 'Aprovado',
      },
      transactions: [
        {
          id: 'T-9001',
          clientId: 'C-1023',
          type: 'Depósito',
          amount: 15000,
          currency: 'BRL',
          counterparty: 'Cash',
          dateTime: '2026-01-02T10:15:00-03:00',
        },
      ],
      alerts: [
        {
          id: 'A-3001',
          clientId: 'C-1023',
          transactionId: 'T-9001',
          rule: 'Depósito em espécie acima do limite',
          severity: 'Alta',
          status: 'Em Análise',
          dataCriacao: '2026-01-02T10:20:00-03:00',
          dataResolucao: null,
        },
        {
          id: 'A-3002',
          clientId: 'C-1023',
          transactionId: 'T-9002',
          rule: 'Múltiplas transferências em curto período',
          severity: 'Crítica',
          status: 'Novo',
          dataCriacao: '2026-01-08T09:25:00-03:00',
          dataResolucao: null,
        },
      ],
    };

    it('should return an array of columns', () => {
      const columns = getReportsColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have correct column keys', () => {
      const columns = getReportsColumns();
      const keys = columns.map((col) => col.key);
      expect(keys).toContain('client');
      expect(keys).toContain('country');
      expect(keys).toContain('riskLevel');
      expect(keys).toContain('kycStatus');
      expect(keys).toContain('transactions');
      expect(keys).toContain('alerts');
      expect(keys).toContain('actions');
    });

    it('should render client name correctly', () => {
      const columns = getReportsColumns();
      const clientColumn = columns.find((col) => col.key === 'client');
      expect(clientColumn).toBeDefined();
      expect(clientColumn?.label).toBe('Cliente');

      const rendered = render(
        <>{clientColumn?.render(mockReport)}</>
      );
      expect(rendered.getByText('Maria Eduarda Ribeiro Facio')).toBeInTheDocument();
    });

    it('should render country correctly', () => {
      const columns = getReportsColumns();
      const countryColumn = columns.find((col) => col.key === 'country');
      expect(countryColumn).toBeDefined();
      expect(countryColumn?.label).toBe('País');

      const rendered = render(
        <>{countryColumn?.render(mockReport)}</>
      );
      expect(rendered.getByText('Brasil')).toBeInTheDocument();
    });

    it('should render risk level with badge', () => {
      const columns = getReportsColumns();
      const riskColumn = columns.find((col) => col.key === 'riskLevel');
      expect(riskColumn).toBeDefined();
      expect(riskColumn?.label).toBe('Nível de Risco');

      const rendered = render(
        <>{riskColumn?.render(mockReport)}</>
      );
      expect(rendered.getByText('Médio')).toBeInTheDocument();
    });

    it('should render kyc status with badge', () => {
      const columns = getReportsColumns();
      const kycColumn = columns.find((col) => col.key === 'kycStatus');
      expect(kycColumn).toBeDefined();
      expect(kycColumn?.label).toBe('Status KYC');

      const rendered = render(
        <>{kycColumn?.render(mockReport)}</>
      );
      expect(rendered.getByText('Aprovado')).toBeInTheDocument();
    });

    it('should render transactions count', () => {
      const columns = getReportsColumns();
      const transactionsColumn = columns.find((col) => col.key === 'transactions');
      expect(transactionsColumn).toBeDefined();
      expect(transactionsColumn?.label).toBe('Transações');

      const result = transactionsColumn?.render(mockReport);
      expect(result).toBe(1);
    });

    it('should render alerts with tooltip', () => {
      const columns = getReportsColumns();
      const alertsColumn = columns.find((col) => col.key === 'alerts');
      expect(alertsColumn).toBeDefined();
      expect(alertsColumn?.label).toBe('Alertas');

      const rendered = render(
        <>{alertsColumn?.render(mockReport)}</>
      );
      expect(rendered.getByText('2')).toBeInTheDocument();
    });

    it('should render actions with link', () => {
      const columns = getReportsColumns();
      const actionsColumn = columns.find((col) => col.key === 'actions');
      expect(actionsColumn).toBeDefined();
      expect(actionsColumn?.label).toBe('Ações');
      expect(actionsColumn?.headerClassName).toBe('text-right');
      expect(actionsColumn?.className).toBe('text-right');

      const rendered = render(
        <>{actionsColumn?.render(mockReport)}</>
      );
      const link = rendered.container.querySelector('a[href="/reports/C-1023"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe('getTransactionSummaryColumns', () => {
    const mockSummaryRow: TransactionSummaryRow = {
      type: 'Depósito',
      count: 5,
      total: 50000,
      average: 10000,
    };

    it('should return an array of columns', () => {
      const columns = getTransactionSummaryColumns('BRL');
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have correct column keys', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const keys = columns.map((col) => col.key);
      expect(keys).toContain('type');
      expect(keys).toContain('count');
      expect(keys).toContain('total');
      expect(keys).toContain('average');
    });

    it('should render type correctly', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const typeColumn = columns.find((col) => col.key === 'type');
      expect(typeColumn).toBeDefined();
      expect(typeColumn?.label).toBe('Tipo');

      const result = typeColumn?.render(mockSummaryRow);
      expect(result).toBe('Depósito');
    });

    it('should render count correctly', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const countColumn = columns.find((col) => col.key === 'count');
      expect(countColumn).toBeDefined();
      expect(countColumn?.label).toBe('Quantidade');

      const result = countColumn?.render(mockSummaryRow);
      expect(result).toBe(5);
    });

    it('should format total with BRL currency', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const totalColumn = columns.find((col) => col.key === 'total');
      expect(totalColumn).toBeDefined();
      expect(totalColumn?.label).toBe('Total');

      const result = totalColumn?.render(mockSummaryRow);
      expect(result).toContain('R$');
      expect(result).toContain('50.000');
    });

    it('should format average with BRL currency', () => {
      const columns = getTransactionSummaryColumns('BRL');
      const averageColumn = columns.find((col) => col.key === 'average');
      expect(averageColumn).toBeDefined();
      expect(averageColumn?.label).toBe('Média');

      const result = averageColumn?.render(mockSummaryRow);
      expect(result).toContain('R$');
      expect(result).toContain('10.000');
    });

    it('should format total with USD currency', () => {
      const columns = getTransactionSummaryColumns('USD');
      const totalColumn = columns.find((col) => col.key === 'total');
      const result = totalColumn?.render(mockSummaryRow);
      expect(result).toContain('US$');
    });

    it('should format total with EUR currency', () => {
      const columns = getTransactionSummaryColumns('EUR');
      const totalColumn = columns.find((col) => col.key === 'total');
      const result = totalColumn?.render(mockSummaryRow);
      expect(result).toContain('€');
    });

    it('should have correct className and headerClassName', () => {
      const columns = getTransactionSummaryColumns('BRL');
      columns.forEach((col) => {
        expect(col.className).toBe('py-3 pr-4');
        expect(col.headerClassName).toBe('py-3 pr-4');
      });
    });
  });

  describe('getAlertsColumns', () => {
    const mockAlert: Alert = {
      id: 'A-3001',
      clientId: 'C-1023',
      transactionId: 'T-9001',
      rule: 'Depósito em espécie acima do limite',
      severity: 'Alta',
      status: 'Em Análise',
      dataCriacao: '2026-01-02T10:20:00-03:00',
      dataResolucao: '2026-01-07T12:00:00-03:00',
    };

    const mockAlertWithoutResolution: Alert = {
      id: 'A-3002',
      clientId: 'C-1023',
      transactionId: 'T-9002',
      rule: 'Múltiplas transferências em curto período',
      severity: 'Crítica',
      status: 'Novo',
      dataCriacao: '2026-01-08T09:25:00-03:00',
      dataResolucao: null,
    };

    it('should return an array of columns', () => {
      const columns = getAlertsColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have correct column keys', () => {
      const columns = getAlertsColumns();
      const keys = columns.map((col) => col.key);
      expect(keys).toContain('id');
      expect(keys).toContain('transactionId');
      expect(keys).toContain('rule');
      expect(keys).toContain('severity');
      expect(keys).toContain('status');
      expect(keys).toContain('dataCriacao');
      expect(keys).toContain('dataResolucao');
    });

    it('should render id correctly', () => {
      const columns = getAlertsColumns();
      const idColumn = columns.find((col) => col.key === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');

      const result = idColumn?.render(mockAlert);
      expect(result).toBe('A-3001');
    });

    it('should render transactionId correctly', () => {
      const columns = getAlertsColumns();
      const transactionIdColumn = columns.find((col) => col.key === 'transactionId');
      expect(transactionIdColumn).toBeDefined();
      expect(transactionIdColumn?.label).toBe('ID da Transação');

      const result = transactionIdColumn?.render(mockAlert);
      expect(result).toBe('T-9001');
    });

    it('should render rule correctly', () => {
      const columns = getAlertsColumns();
      const ruleColumn = columns.find((col) => col.key === 'rule');
      expect(ruleColumn).toBeDefined();
      expect(ruleColumn?.label).toBe('Regra');

      const result = ruleColumn?.render(mockAlert);
      expect(result).toBe('Depósito em espécie acima do limite');
    });

    it('should render severity with badge style', () => {
      const columns = getAlertsColumns();
      const severityColumn = columns.find((col) => col.key === 'severity');
      expect(severityColumn).toBeDefined();
      expect(severityColumn?.label).toBe('Severidade');

      const rendered = render(
        <>{severityColumn?.render(mockAlert)}</>
      );
      expect(rendered.getByText('Alta')).toBeInTheDocument();
    });

    it('should render status with badge style', () => {
      const columns = getAlertsColumns();
      const statusColumn = columns.find((col) => col.key === 'status');
      expect(statusColumn).toBeDefined();
      expect(statusColumn?.label).toBe('Status');

      const rendered = render(
        <>{statusColumn?.render(mockAlert)}</>
      );
      expect(rendered.getByText('Em Análise')).toBeInTheDocument();
    });

    it('should format dataCriacao correctly', () => {
      const columns = getAlertsColumns();
      const dataCriacaoColumn = columns.find((col) => col.key === 'dataCriacao');
      expect(dataCriacaoColumn).toBeDefined();
      expect(dataCriacaoColumn?.label).toBe('Data de Criação');

      const result = dataCriacaoColumn?.render(mockAlert);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format dataResolucao correctly when present', () => {
      const columns = getAlertsColumns();
      const dataResolucaoColumn = columns.find((col) => col.key === 'dataResolucao');
      expect(dataResolucaoColumn).toBeDefined();
      expect(dataResolucaoColumn?.label).toBe('Data de Resolução');

      const result = dataResolucaoColumn?.render(mockAlert);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should render "-" when dataResolucao is null', () => {
      const columns = getAlertsColumns();
      const dataResolucaoColumn = columns.find((col) => col.key === 'dataResolucao');

      const result = dataResolucaoColumn?.render(mockAlertWithoutResolution);
      expect(result).toBe('-');
    });

    it('should have correct className and headerClassName', () => {
      const columns = getAlertsColumns();
      columns.forEach((col) => {
        expect(col.className).toContain('py-3 pr-4');
        expect(col.headerClassName).toBe('py-3 pr-4');
      });
    });
  });

  describe('getTransactionsColumns', () => {
    const mockTransaction: Transaction = {
      id: 'T-9001',
      clientId: 'C-1023',
      type: 'Depósito',
      amount: 15000,
      currency: 'BRL',
      counterparty: 'Cash',
      dateTime: '2026-01-02T10:15:00-03:00',
    };

    it('should return an array of columns', () => {
      const columns = getTransactionsColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have correct column keys', () => {
      const columns = getTransactionsColumns();
      const keys = columns.map((col) => col.key);
      expect(keys).toContain('id');
      expect(keys).toContain('type');
      expect(keys).toContain('amount');
      expect(keys).toContain('counterparty');
      expect(keys).toContain('dateTime');
    });

    it('should render id correctly', () => {
      const columns = getTransactionsColumns();
      const idColumn = columns.find((col) => col.key === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');

      const result = idColumn?.render(mockTransaction);
      expect(result).toBe('T-9001');
    });

    it('should render type correctly', () => {
      const columns = getTransactionsColumns();
      const typeColumn = columns.find((col) => col.key === 'type');
      expect(typeColumn).toBeDefined();
      expect(typeColumn?.label).toBe('Tipo');

      const result = typeColumn?.render(mockTransaction);
      expect(result).toBe('Depósito');
    });

    it('should format amount with currency', () => {
      const columns = getTransactionsColumns();
      const amountColumn = columns.find((col) => col.key === 'amount');
      expect(amountColumn).toBeDefined();
      expect(amountColumn?.label).toBe('Valor');

      const result = amountColumn?.render(mockTransaction);
      expect(result).toContain('R$');
      expect(result).toContain('15.000');
    });

    it('should render counterparty correctly', () => {
      const columns = getTransactionsColumns();
      const counterpartyColumn = columns.find((col) => col.key === 'counterparty');
      expect(counterpartyColumn).toBeDefined();
      expect(counterpartyColumn?.label).toBe('Contraparte');

      const result = counterpartyColumn?.render(mockTransaction);
      expect(result).toBe('Cash');
    });

    it('should format dateTime correctly', () => {
      const columns = getTransactionsColumns();
      const dateTimeColumn = columns.find((col) => col.key === 'dateTime');
      expect(dateTimeColumn).toBeDefined();
      expect(dateTimeColumn?.label).toBe('DataHora');

      const result = dateTimeColumn?.render(mockTransaction);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should have correct className and headerClassName', () => {
      const columns = getTransactionsColumns();
      columns.forEach((col) => {
        expect(col.className).toContain('py-3 pr-4');
        expect(col.headerClassName).toBe('py-3 pr-4');
      });
    });

    it('should format amount with USD currency', () => {
      const usdTransaction: Transaction = {
        ...mockTransaction,
        currency: 'USD',
        amount: 2500,
      };
      const columns = getTransactionsColumns();
      const amountColumn = columns.find((col) => col.key === 'amount');
      const result = amountColumn?.render(usdTransaction);
      expect(result).toContain('US$');
    });

    it('should format amount with EUR currency', () => {
      const eurTransaction: Transaction = {
        ...mockTransaction,
        currency: 'EUR',
        amount: 1800,
      };
      const columns = getTransactionsColumns();
      const amountColumn = columns.find((col) => col.key === 'amount');
      const result = amountColumn?.render(eurTransaction);
      expect(result).toContain('€');
    });
  });
});
