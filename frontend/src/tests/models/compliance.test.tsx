import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  mapAPIAlertToMockAlert,
  getBadgeStyleBySeverity,
  getBadgeStyleByStatus,
  getAlertsColumns,
  type DisplayAlert,
} from '@/models/complience';
import type { Alert, Severidade, Status } from '@/types/compliance';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/components/ui/copyButton', () => ({
  CopyButton: ({ textToCopy }: any) => (
    <button data-testid="copy-button" data-text={textToCopy}>
      Copy
    </button>
  ),
}));

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
      critical: { light: '#fee2e2', foreground: '#991b1b' },
      high: { light: '#fef3c7', foreground: '#92400e' },
      medium: { light: '#dbeafe', foreground: '#1e40af' },
      low: { light: '#d1fae5', foreground: '#065f46' },
      resolved: { light: '#d1fae5', foreground: '#065f46' },
      'in-review': { light: '#fef3c7', foreground: '#92400e' },
      new: { light: '#dbeafe', foreground: '#1e40af' },
    };
    return colorMap[status] || { light: '#f3f4f6', foreground: '#1f2937' };
  }),
  formatDateTime: jest.fn((date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  }),
}));

describe('compliance models', () => {
  describe('mapAPIAlertToMockAlert', () => {
    it('should map API alert to display alert correctly', () => {
      const apiAlert: Alert = {
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

      const result = mapAPIAlertToMockAlert(apiAlert);

      expect(result).toEqual({
        id: 'A-3001',
        clientId: 'C-1023',
        transactionId: 'T-9001',
        rule: 'Depósito em espécie acima do limite',
        severity: 'Alta',
        status: 'Novo',
        dataCriacao: '2025-01-15T10:30:00-03:00',
        dataResolucao: null,
        resolvidoPor: null,
      });
    });

    it('should map resolved alert correctly', () => {
      const apiAlert: Alert = {
        id: 'A-3002',
        clienteId: 'C-1023',
        transacaoId: 'T-9002',
        nomeRegra: 'Múltiplas transferências em curto período',
        descricao: 'Test description',
        severidade: 'Critica',
        status: 'Resolvido',
        dataCriacao: '2025-01-16T14:20:00-03:00',
        dataResolucao: '2025-01-18T10:00:00-03:00',
        resolvidoPor: 'user@example.com',
        resolucao: 'Alert resolved after investigation',
      };

      const result = mapAPIAlertToMockAlert(apiAlert);

      expect(result).toEqual({
        id: 'A-3002',
        clientId: 'C-1023',
        transactionId: 'T-9002',
        rule: 'Múltiplas transferências em curto período',
        severity: 'Critica',
        status: 'Resolvido',
        dataCriacao: '2025-01-16T14:20:00-03:00',
        dataResolucao: '2025-01-18T10:00:00-03:00',
        resolvidoPor: 'user@example.com',
      });
    });

    it('should map all severity types correctly', () => {
      const severities: Severidade[] = ['Baixa', 'Media', 'Alta', 'Critica'];
      
      severities.forEach((severity) => {
        const apiAlert: Alert = {
          id: 'A-3001',
          clienteId: 'C-1023',
          transacaoId: 'T-9001',
          nomeRegra: 'Test Rule',
          descricao: 'Test description',
          severidade: severity,
          status: 'Novo',
          dataCriacao: '2025-01-15T10:30:00-03:00',
          dataResolucao: null,
          resolvidoPor: null,
          resolucao: null,
        };

        const result = mapAPIAlertToMockAlert(apiAlert);
        expect(result.severity).toBe(severity);
      });
    });

    it('should map all status types correctly', () => {
      const statuses: Status[] = ['Novo', 'EmAnalise', 'Resolvido'];
      
      statuses.forEach((status) => {
        const apiAlert: Alert = {
          id: 'A-3001',
          clienteId: 'C-1023',
          transacaoId: 'T-9001',
          nomeRegra: 'Test Rule',
          descricao: 'Test description',
          severidade: 'Alta',
          status: status,
          dataCriacao: '2025-01-15T10:30:00-03:00',
          dataResolucao: null,
          resolvidoPor: null,
          resolucao: null,
        };

        const result = mapAPIAlertToMockAlert(apiAlert);
        expect(result.status).toBe(status);
      });
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

    it('should return correct style for "Media" severity', () => {
      const style = getBadgeStyleBySeverity('Media');
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

    it('should return correct style for "Critica" severity', () => {
      const style = getBadgeStyleBySeverity('Critica');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different severities', () => {
      const baixaStyle = getBadgeStyleBySeverity('Baixa');
      const mediaStyle = getBadgeStyleBySeverity('Media');
      const altaStyle = getBadgeStyleBySeverity('Alta');
      const criticaStyle = getBadgeStyleBySeverity('Critica');

      expect(baixaStyle).not.toEqual(mediaStyle);
      expect(mediaStyle).not.toEqual(altaStyle);
      expect(altaStyle).not.toEqual(criticaStyle);
      expect(baixaStyle).not.toEqual(criticaStyle);
    });
  });

  describe('getBadgeStyleByStatus', () => {
    it('should return correct style for "Novo" status', () => {
      const style = getBadgeStyleByStatus('Novo');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "EmAnalise" status', () => {
      const style = getBadgeStyleByStatus('EmAnalise');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return correct style for "Resolvido" status', () => {
      const style = getBadgeStyleByStatus('Resolvido');
      expect(style).toHaveProperty('backgroundColor');
      expect(style).toHaveProperty('color');
      expect(style.backgroundColor).toBeDefined();
      expect(style.color).toBeDefined();
    });

    it('should return different styles for different statuses', () => {
      const novoStyle = getBadgeStyleByStatus('Novo');
      const emAnaliseStyle = getBadgeStyleByStatus('EmAnalise');
      const resolvidoStyle = getBadgeStyleByStatus('Resolvido');

      expect(novoStyle).not.toEqual(emAnaliseStyle);
      expect(emAnaliseStyle).not.toEqual(resolvidoStyle);
      expect(novoStyle).not.toEqual(resolvidoStyle);
    });
  });

  describe('getAlertsColumns', () => {
    const mockAlert: DisplayAlert = {
      id: 'A-3001',
      clientId: 'C-1023',
      transactionId: 'T-9001',
      rule: 'Depósito em espécie acima do limite',
      severity: 'Alta',
      status: 'Novo',
      dataCriacao: '2025-01-15T10:30:00-03:00',
      dataResolucao: null,
      resolvidoPor: null,
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
      expect(keys).toContain('dataCriacao');
      expect(keys).toContain('severity');
      expect(keys).toContain('status');
      expect(keys).toContain('details');
    });

    it('should render ID column correctly', () => {
      const columns = getAlertsColumns();
      const idColumn = columns.find((col) => col.key === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');
      if (!idColumn?.render) return;

      const rendered = render(<>{idColumn.render(mockAlert, 0)}</>);
      expect(rendered.container.textContent).toContain('A-30...3001');
      expect(rendered.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('should render transaction ID column correctly', () => {
      const columns = getAlertsColumns();
      const transactionIdColumn = columns.find((col) => col.key === 'transactionId');
      expect(transactionIdColumn).toBeDefined();
      expect(transactionIdColumn?.label).toBe('ID da Transação');
      if (!transactionIdColumn?.render) return;

      const rendered = render(<>{transactionIdColumn.render(mockAlert, 0)}</>);
      expect(rendered.container.textContent).toContain('T-90...9001');
      expect(rendered.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('should render rule column correctly', () => {
      const columns = getAlertsColumns();
      const ruleColumn = columns.find((col) => col.key === 'rule');
      expect(ruleColumn).toBeDefined();
      expect(ruleColumn?.label).toBe('Regra');
      if (!ruleColumn?.render) return;

      const rendered = render(<>{ruleColumn.render(mockAlert, 0)}</>);
      expect(rendered.container.textContent).toContain('Depósito em espécie acima do limite');
    });

    it('should render dataCriacao column correctly', () => {
      const columns = getAlertsColumns();
      const dataCriacaoColumn = columns.find((col) => col.key === 'dataCriacao');
      expect(dataCriacaoColumn).toBeDefined();
      expect(dataCriacaoColumn?.label).toBe('Data de Criação');
      if (!dataCriacaoColumn?.render) return;

      render(<>{dataCriacaoColumn.render(mockAlert, 0)}</>);
    });

    it('should render severity column correctly', () => {
      const columns = getAlertsColumns();
      const severityColumn = columns.find((col) => col.key === 'severity');
      expect(severityColumn).toBeDefined();
      expect(severityColumn?.label).toBe('Severidade');
      if (!severityColumn?.render) return;

      const rendered = render(<>{severityColumn.render(mockAlert, 0)}</>);
      expect(rendered.getByTestId('badge')).toBeInTheDocument();
      expect(rendered.getByText('Alta')).toBeInTheDocument();
    });

    it('should render severity labels correctly for all severities', () => {
      const columns = getAlertsColumns();
      const severityColumn = columns.find((col) => col.key === 'severity');
      if (!severityColumn?.render) return;
      
      const renderFn = severityColumn.render;
      const severities: Severidade[] = ['Baixa', 'Media', 'Alta', 'Critica'];
      const expectedLabels = ['Baixa', 'Média', 'Alta', 'Crítica'];

      severities.forEach((severity, index) => {
        const alert = { ...mockAlert, severity };
        const rendered = render(<>{renderFn(alert, 0)}</>);
        expect(rendered.getByText(expectedLabels[index])).toBeInTheDocument();
        rendered.unmount();
      });
    });

    it('should render status column correctly', () => {
      const columns = getAlertsColumns();
      const statusColumn = columns.find((col) => col.key === 'status');
      expect(statusColumn).toBeDefined();
      expect(statusColumn?.label).toBe('Status');
      if (!statusColumn?.render) return;

      const rendered = render(<>{statusColumn.render(mockAlert, 0)}</>);
      expect(rendered.getByTestId('badge')).toBeInTheDocument();
      expect(rendered.getByText('Novo')).toBeInTheDocument();
    });

    it('should render status labels correctly for all statuses', () => {
      const columns = getAlertsColumns();
      const statusColumn = columns.find((col) => col.key === 'status');
      if (!statusColumn?.render) return;
      
      const renderFn = statusColumn.render;
      const statuses: Status[] = ['Novo', 'EmAnalise', 'Resolvido'];
      const expectedLabels = ['Novo', 'Em Análise', 'Resolvido'];

      statuses.forEach((status, index) => {
        const alert = { ...mockAlert, status };
        const rendered = render(<>{renderFn(alert, 0)}</>);
        expect(rendered.getByText(expectedLabels[index])).toBeInTheDocument();
        rendered.unmount();
      });
    });

    it('should render info icon for resolved status', () => {
      const columns = getAlertsColumns();
      const statusColumn = columns.find((col) => col.key === 'status');
      if (!statusColumn?.render) return;
      const resolvedAlert = { ...mockAlert, status: 'Resolvido' as Status };

      const rendered = render(<>{statusColumn.render(resolvedAlert, 0)}</>);
      expect(rendered.getByTestId('info-icon')).toBeInTheDocument();
    });

    it('should not render info icon for non-resolved status', () => {
      const columns = getAlertsColumns();
      const statusColumn = columns.find((col) => col.key === 'status');
      if (!statusColumn?.render) return;

      const rendered = render(<>{statusColumn.render(mockAlert, 0)}</>);
      expect(rendered.queryByTestId('info-icon')).not.toBeInTheDocument();
    });

    it('should render details column correctly', () => {
      const columns = getAlertsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      expect(detailsColumn).toBeDefined();
      expect(detailsColumn?.label).toBe('Detalhes');
      if (!detailsColumn?.render) return;

      const rendered = render(<>{detailsColumn.render(mockAlert, 0)}</>);
      expect(rendered.getByTestId('arrow-up-right')).toBeInTheDocument();
    });

    it('should render correct link in details column', () => {
      const columns = getAlertsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      if (!detailsColumn?.render) return;

      const rendered = render(<>{detailsColumn.render(mockAlert, 0)}</>);
      const link = rendered.getByRole('link');
      expect(link).toHaveAttribute('href', '/compliance/A-3001');
    });

    it('should have correct className for columns', () => {
      const columns = getAlertsColumns();
      columns.forEach((column) => {
        expect(column.className).toBeDefined();
        expect(column.headerClassName).toBeDefined();
      });
    });
  });
});
