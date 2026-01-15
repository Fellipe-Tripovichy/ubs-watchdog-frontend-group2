import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComplianceCard } from '@/components/compliance/complianceCard';
import type { Alert } from '@/types/compliance';
import type { DisplayAlert } from '@/models/complience';
import { mapAPIAlertToMockAlert } from '@/models/complience';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/components/ui/copyButton', () => ({
  CopyButton: ({ textToCopy, variant, size }: { textToCopy: string; variant?: string; size?: string }) => (
    <button 
      data-testid="copy-button" 
      data-text-to-copy={textToCopy}
      data-variant={variant}
      data-size={size}
    >
      Copy
    </button>
  ),
}));

jest.mock('@/components/ui/linkButton', () => ({
  LinkButton: ({ children, icon, iconLeft, asChild }: any) => (
    <div data-testid="link-button" data-icon={icon} data-icon-left={iconLeft} data-as-child={asChild}>
      {children}
    </div>
  ),
}));

jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatDate: (dateTime: string) => {
      return new Date(dateTime).toLocaleString('pt-BR');
    },
    formatDateTime: (dateTime: string) => {
      return new Date(dateTime).toLocaleString('pt-BR');
    },
    getColorByStatus: (status: string) => {
      return {
        light: '#cccccc',
        foreground: '#000000',
      };
    },
  };
});

describe('ComplianceCard', () => {
  const createMockAlert = (overrides?: Partial<Alert>): Alert => {
    return {
      id: 'A-3001',
      clienteId: 'C-1023',
      transacaoId: 'T-9001',
      nomeRegra: 'Depósito em espécie acima do limite',
      descricao: 'Test description',
      severidade: 'Alta',
      status: 'EmAnalise',
      dataCriacao: '2026-01-02T10:20:00-03:00',
      dataResolucao: null,
      resolvidoPor: null,
      resolucao: null,
      ...overrides,
    };
  };

  const getMockAlert = (overrides?: Partial<Alert>): DisplayAlert => {
    const alert = createMockAlert(overrides);
    return mapAPIAlertToMockAlert(alert);
  };

  it('should render', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText(alert.rule)).toBeInTheDocument();
  });

  it('should render alert rule as CardTitle', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title!).toHaveTextContent(alert.rule);
  });

  it('should render alert ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    const truncatedId = `${alert.id.slice(0, 4)}...${alert.id.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
  });

  it('should render transaction ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('ID da Transação')).toBeInTheDocument();
    const truncatedTransactionId = `${alert.transactionId.slice(0, 4)}...${alert.transactionId.slice(-4)}`;
    expect(screen.getByText(truncatedTransactionId)).toBeInTheDocument();
  });

  it('should render severity badge', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Severidade')).toBeInTheDocument();
    expect(screen.getByText(alert.severity)).toBeInTheDocument();
  });

  it('should render status badge', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText(alert.status)).toBeInTheDocument();
  });

  it('should render creation date', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Data de Criação')).toBeInTheDocument();
    const creationDateLabel = screen.getByText('Data de Criação');
    const creationDateContainer = creationDateLabel.closest('.flex.flex-col.gap-1');
    expect(creationDateContainer).toBeInTheDocument();
    const formattedDate = creationDateContainer?.querySelector('.text-sm.font-medium');
    expect(formattedDate).toBeInTheDocument();
    expect(formattedDate?.textContent).toBeTruthy();
  });

  it('should render resolution date when present', () => {
    const alert = getMockAlert({
      dataResolucao: '2026-01-07T12:00:00-03:00',
      resolvidoPor: 'Analista Silva',
    });
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Data de Resolução')).toBeInTheDocument();
    expect(screen.queryByText('-')).not.toBeInTheDocument();
  });

  it('should render "-" when resolution date is null', () => {
    const alert = getMockAlert({
      dataResolucao: null,
      resolvidoPor: null,
    });
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Data de Resolução')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render Card component', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('should render with different alert data', () => {
    const alert = getMockAlert({
      id: 'A-3002',
      nomeRegra: 'Múltiplas transferências em curto período',
      transacaoId: 'T-9004',
      severidade: 'Media',
      status: 'Novo',
    });
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText(alert.rule)).toBeInTheDocument();
    const truncatedId = `${alert.id.slice(0, 4)}...${alert.id.slice(-4)}`;
    const truncatedTransactionId = `${alert.transactionId.slice(0, 4)}...${alert.transactionId.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
    expect(screen.getByText(truncatedTransactionId)).toBeInTheDocument(); 
    expect(screen.getByText(alert.severity)).toBeInTheDocument();
    expect(screen.getByText(alert.status)).toBeInTheDocument();
  });

  it('should render with different severity levels', () => {
    const alert = getMockAlert({
      severidade: 'Alta',
    });
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('should render with different status values', () => {
    const alert = getMockAlert({
      status: 'Resolvido',
      dataResolucao: '2026-01-07T12:00:00-03:00',
      resolvidoPor: 'Analista Silva',
    });
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Resolvido')).toBeInTheDocument();
  });

  it('should render CopyButton for alert ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    const copyButtons = screen.getAllByTestId('copy-button');
    const idCopyButton = copyButtons.find(
      (button) => button.getAttribute('data-text-to-copy') === alert.id
    );
    expect(idCopyButton).toBeInTheDocument();
    expect(idCopyButton).toHaveAttribute('data-variant', 'secondary');
    expect(idCopyButton).toHaveAttribute('data-size', 'small');
  });

  it('should render CopyButton for transaction ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    const copyButtons = screen.getAllByTestId('copy-button');
    const transactionCopyButton = copyButtons.find(
      (button) => button.getAttribute('data-text-to-copy') === alert.transactionId
    );
    expect(transactionCopyButton).toBeInTheDocument();
    expect(transactionCopyButton).toHaveAttribute('data-variant', 'secondary');
    expect(transactionCopyButton).toHaveAttribute('data-size', 'small');
  });

  it('should render "Ver mais" link', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('Ver mais')).toBeInTheDocument();
  });

  it('should render link with correct href', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    const link = screen.getByText('Ver mais').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/compliance/${alert.id}`);
  });

  it('should render LinkButton with correct props', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    const linkButton = screen.getByTestId('link-button');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('data-icon', 'chevron-right');
    expect(linkButton).toHaveAttribute('data-icon-left', 'false');
    expect(linkButton).toHaveAttribute('data-as-child', 'true');
  });

  it('should render CardAction component', () => {
    const alert = getMockAlert();
    const { container } = render(<ComplianceCard alert={alert} />);
    const cardAction = container.querySelector('[data-slot="card-action"]');
    expect(cardAction).toBeInTheDocument();
  });

  it('should apply badge styles from getBadgeStyleBySeverity', () => {
    const alert = getMockAlert({ severidade: 'Alta' });
    const { container } = render(<ComplianceCard alert={alert} />);
    const severityBadge = container.querySelector('[data-slot="badge"]');
    expect(severityBadge).toBeInTheDocument();
    expect(severityBadge).toHaveStyle({
      backgroundColor: '#cccccc',
      color: '#000000',
    });
  });

  it('should apply badge styles from getBadgeStyleByStatus', () => {
    const alert = getMockAlert({ status: 'EmAnalise' });
    const { container } = render(<ComplianceCard alert={alert} />);
    const badges = container.querySelectorAll('[data-slot="badge"]');
    expect(badges.length).toBeGreaterThanOrEqual(2);
    badges.forEach((badge) => {
      expect(badge).toHaveStyle({
        backgroundColor: '#cccccc',
        color: '#000000',
      });
    });
  });

  it('should handle ID truncation correctly for short IDs', () => {
    const alert = getMockAlert({ id: 'A-1', transacaoId: 'T-2' });
    render(<ComplianceCard alert={alert} />);
    const truncatedId = `${alert.id.slice(0, 4)}...${alert.id.slice(-4)}`;
    const truncatedTransactionId = `${alert.transactionId.slice(0, 4)}...${alert.transactionId.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
    expect(screen.getByText(truncatedTransactionId)).toBeInTheDocument();
  });

  it('should handle ID truncation correctly for long IDs', () => {
    const alert = getMockAlert({ 
      id: 'A-3001-very-long-id-string', 
      transacaoId: 'T-9001-very-long-transaction-id-string' 
    });
    render(<ComplianceCard alert={alert} />);
    const truncatedId = `${alert.id.slice(0, 4)}...${alert.id.slice(-4)}`;
    const truncatedTransactionId = `${alert.transactionId.slice(0, 4)}...${alert.transactionId.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
    expect(screen.getByText(truncatedTransactionId)).toBeInTheDocument();
  });

  it('should render all severity levels correctly', () => {
    const severities: Array<'Critica' | 'Alta' | 'Media' | 'Baixa'> = ['Critica', 'Alta', 'Media', 'Baixa'];
    severities.forEach((severity) => {
      const alert = getMockAlert({ severidade: severity });
      const { unmount } = render(<ComplianceCard alert={alert} />);
      expect(screen.getByText(severity)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render all status values correctly', () => {
    const statuses: Array<'Novo' | 'EmAnalise' | 'Resolvido'> = ['Novo', 'EmAnalise', 'Resolvido'];
    statuses.forEach((status) => {
      const alert = getMockAlert({ 
        status,
        dataResolucao: status === 'Resolvido' ? '2026-01-07T12:00:00-03:00' : null,
        resolvidoPor: status === 'Resolvido' ? 'Analista Silva' : null,
      });
      const { unmount } = render(<ComplianceCard alert={alert} />);
      expect(screen.getByText(status)).toBeInTheDocument();
      unmount();
    });
  });

  it('should format creation date correctly', () => {
    const alert = getMockAlert({
      dataCriacao: '2026-01-02T10:20:00-03:00',
    });
    render(<ComplianceCard alert={alert} />);
    const creationDateLabel = screen.getByText('Data de Criação');
    const creationDateContainer = creationDateLabel.closest('.flex.flex-col.gap-1');
    const formattedDate = creationDateContainer?.querySelector('.text-sm.font-medium');
    expect(formattedDate?.textContent).toBeTruthy();
    expect(formattedDate?.textContent).toContain('2026');
  });

  it('should format resolution date correctly when present', () => {
    const alert = getMockAlert({
      dataResolucao: '2026-01-07T12:00:00-03:00',
      resolvidoPor: 'Analista Silva',
    });
    render(<ComplianceCard alert={alert} />);
    const resolutionDateLabel = screen.getByText('Data de Resolução');
    const resolutionDateContainer = resolutionDateLabel.closest('.flex.flex-col.gap-1');
    const formattedDate = resolutionDateContainer?.querySelector('.text-sm.font-medium');
    expect(formattedDate?.textContent).toBeTruthy();
    expect(formattedDate?.textContent).toContain('2026');
  });
});
