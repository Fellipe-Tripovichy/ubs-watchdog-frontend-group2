import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportCard } from '@/components/reports/reportCard';
import type { Report } from '@/features/reports/reportsSlice';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock FlagImage
jest.mock('@/components/ui/flagImage', () => ({
  FlagImage: ({ country, className }: { country: string; className?: string }) => (
    <img src={`/flags/${country}.svg`} alt={`Flag of ${country}`} className={className} data-testid="flag-image" />
  ),
}));

// Mock LinkButton
jest.mock('@/components/ui/linkButton', () => ({
  LinkButton: ({ children, icon, iconLeft, asChild }: any) => (
    <div data-testid="link-button" data-icon={icon} data-icon-left={iconLeft} data-as-child={asChild}>
      {children}
    </div>
  ),
}));

// Mock getBadgeStyleByRisk and getBadgeStyleByKyc, but keep other exports
jest.mock('@/models/reports', () => {
  const actual = jest.requireActual('@/models/reports');
  return {
    ...actual,
    getBadgeStyleByRisk: (risk: string) => {
      // Mock implementation that returns a simple color object
      return {
        backgroundColor: '#cccccc',
        color: '#000000',
      };
    },
    getBadgeStyleByKyc: (kyc: string) => {
      // Mock implementation that returns a simple color object
      return {
        backgroundColor: '#cccccc',
        color: '#000000',
      };
    },
  };
});

// Mock getColorByStatus from utils
jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    getColorByStatus: (status: string) => {
      // Mock implementation that returns a simple color object
      return {
        light: '#cccccc',
        foreground: '#000000',
      };
    },
  };
});

describe('ReportCard', () => {
  const createMockReport = (overrides?: Partial<Report>): Report => {
    return {
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
      ...overrides,
    };
  };

  it('should render', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText(report.nomeCliente)).toBeInTheDocument();
  });

  it('should render client name as CardTitle', () => {
    const report = createMockReport();
    const { container } = render(<ReportCard report={report} />);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(report.nomeCliente);
  });

  it('should render nationality section', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Nacionalidade')).toBeInTheDocument();
    expect(screen.getByText(report.pais)).toBeInTheDocument();
  });

  it('should render FlagImage with correct country', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    const flagImage = screen.getByTestId('flag-image');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', `/flags/${report.pais}.svg`);
    expect(flagImage).toHaveAttribute('alt', `Flag of ${report.pais}`);
  });

  it('should render risk level badge', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Nível de Risco')).toBeInTheDocument();
    expect(screen.getByText(report.nivelRisco)).toBeInTheDocument();
  });

  it('should render KYC status badge', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Status KYC')).toBeInTheDocument();
    expect(screen.getByText(report.statusKyc)).toBeInTheDocument();
  });

  it('should render transactions count', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Transações')).toBeInTheDocument();
    // Find transactions count by finding the "Transações" label and then the count
    const transactionsLabel = screen.getByText('Transações');
    const transactionsContainer = transactionsLabel.closest('.flex.flex-col.gap-1');
    const transactionsCount = transactionsContainer?.querySelector('.text-sm.font-medium');
    expect(transactionsCount?.textContent).toBe(report.totalTransacoes.toString());
  });

  it('should render alerts count', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Alertas')).toBeInTheDocument();
    // Find alerts count by finding the "Alertas" label and then the count
    const alertsLabel = screen.getByText('Alertas');
    const alertsContainer = alertsLabel.closest('.flex.flex-col.gap-1');
    const alertsCount = alertsContainer?.querySelector('.text-sm.font-medium');
    expect(alertsCount?.textContent).toBe(report.totalAlertas.toString());
  });

  it('should render "Ver mais" link', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    expect(screen.getByText('Ver mais')).toBeInTheDocument();
  });

  it('should render link with correct href', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    const link = screen.getByText('Ver mais').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/reports/${report.clienteId}`);
  });

  it('should render LinkButton with correct props', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    const linkButton = screen.getByTestId('link-button');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('data-icon', 'chevron-right');
    expect(linkButton).toHaveAttribute('data-icon-left', 'false');
    expect(linkButton).toHaveAttribute('data-as-child', 'true');
  });

  it('should render Card component', () => {
    const report = createMockReport();
    const { container } = render(<ReportCard report={report} />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    const report = createMockReport();
    const { container } = render(<ReportCard report={report} />);
    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    const report = createMockReport();
    const { container } = render(<ReportCard report={report} />);
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('should render CardAction component', () => {
    const report = createMockReport();
    const { container } = render(<ReportCard report={report} />);
    const cardAction = container.querySelector('[data-slot="card-action"]');
    expect(cardAction).toBeInTheDocument();
  });

  it('should render with different report data', () => {
    const report = createMockReport({
      clienteId: 'C-2041',
      nomeCliente: 'João Henrique Souza',
      pais: 'Estados Unidos',
      nivelRisco: 'Médio',
      statusKyc: 'Pendente',
      totalTransacoes: 8,
      totalAlertas: 2,
    });
    render(<ReportCard report={report} />);
    expect(screen.getByText('João Henrique Souza')).toBeInTheDocument();
    expect(screen.getByText(report.pais)).toBeInTheDocument();
    
    // Find transactions count
    const transactionsLabel = screen.getByText('Transações');
    const transactionsContainer = transactionsLabel.closest('.flex.flex-col.gap-1');
    const transactionsCount = transactionsContainer?.querySelector('.text-sm.font-medium');
    expect(transactionsCount?.textContent).toBe(report.totalTransacoes.toString());
    
    // Find alerts count
    const alertsLabel = screen.getByText('Alertas');
    const alertsContainer = alertsLabel.closest('.flex.flex-col.gap-1');
    const alertsCount = alertsContainer?.querySelector('.text-sm.font-medium');
    expect(alertsCount?.textContent).toBe(report.totalAlertas.toString());
  });

  it('should render with zero transactions', () => {
    const report = createMockReport({
      totalTransacoes: 0,
    });
    render(<ReportCard report={report} />);
    const transactionsLabel = screen.getByText('Transações');
    const transactionsContainer = transactionsLabel.closest('.flex.flex-col.gap-1');
    const transactionsCount = transactionsContainer?.querySelector('.text-sm.font-medium');
    expect(transactionsCount?.textContent).toBe('0');
  });

  it('should render with zero alerts', () => {
    const report = createMockReport({
      totalAlertas: 0,
      alertasNovos: 0,
      alertasEmAnalise: 0,
      alertasResolvidos: 0,
      alertasCriticos: 0,
    });
    render(<ReportCard report={report} />);
    const alertsLabel = screen.getByText('Alertas');
    const alertsContainer = alertsLabel.closest('.flex.flex-col.gap-1');
    const alertsCount = alertsContainer?.querySelector('.text-sm.font-medium');
    expect(alertsCount?.textContent).toBe('0');
  });

  it('should render all risk levels correctly', () => {
    const riskLevels: Array<'Baixo' | 'Médio' | 'Alto' | 'Nenhum'> = ['Baixo', 'Médio', 'Alto', 'Nenhum'];
    riskLevels.forEach((risk) => {
      const report = createMockReport({ nivelRisco: risk });
      const { unmount } = render(<ReportCard report={report} />);
      expect(screen.getByText(risk)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render all KYC statuses correctly', () => {
    const kycStatuses: Array<'Aprovado' | 'Pendente' | 'Rejeitado' | 'Nenhum'> = ['Aprovado', 'Pendente', 'Rejeitado', 'Nenhum'];
    kycStatuses.forEach((kyc) => {
      const report = createMockReport({ statusKyc: kyc });
      const { unmount } = render(<ReportCard report={report} />);
      expect(screen.getByText(kyc)).toBeInTheDocument();
      unmount();
    });
  });

  it('should apply badge styles from getBadgeStyleByRisk', () => {
    const report = createMockReport({ nivelRisco: 'Alto' });
    const { container } = render(<ReportCard report={report} />);
    const badges = container.querySelectorAll('[data-slot="badge"]');
    // Should have two badges: risk level and KYC status
    expect(badges.length).toBeGreaterThanOrEqual(2);
    // Both badges should have styles applied
    badges.forEach((badge) => {
      expect(badge).toHaveStyle({
        backgroundColor: '#cccccc',
        color: '#000000',
      });
    });
  });

  it('should apply badge styles from getBadgeStyleByKyc', () => {
    const report = createMockReport({ statusKyc: 'Aprovado' });
    const { container } = render(<ReportCard report={report} />);
    const badges = container.querySelectorAll('[data-slot="badge"]');
    // Should have two badges: risk level and KYC status
    expect(badges.length).toBeGreaterThanOrEqual(2);
    // Both badges should have styles applied
    badges.forEach((badge) => {
      expect(badge).toHaveStyle({
        backgroundColor: '#cccccc',
        color: '#000000',
      });
    });
  });

  it('should render FlagImage with correct className', () => {
    const report = createMockReport();
    render(<ReportCard report={report} />);
    const flagImage = screen.getByTestId('flag-image');
    expect(flagImage).toHaveClass('size-4');
  });

  it('should render with different countries', () => {
    const countries = ['Brasil', 'Estados Unidos', 'Reino Unido', 'Suíça'];
    countries.forEach((country) => {
      const report = createMockReport({ pais: country });
      const { unmount } = render(<ReportCard report={report} />);
      expect(screen.getByText(country)).toBeInTheDocument();
      const flagImage = screen.getByTestId('flag-image');
      expect(flagImage).toHaveAttribute('src', `/flags/${country}.svg`);
      unmount();
    });
  });

  it('should render with large transaction counts', () => {
    const report = createMockReport({
      totalTransacoes: 999,
    });
    render(<ReportCard report={report} />);
    const transactionsLabel = screen.getByText('Transações');
    const transactionsContainer = transactionsLabel.closest('.flex.flex-col.gap-1');
    const transactionsCount = transactionsContainer?.querySelector('.text-sm.font-medium');
    expect(transactionsCount?.textContent).toBe('999');
  });

  it('should render with large alert counts', () => {
    const report = createMockReport({
      totalAlertas: 50,
      alertasNovos: 10,
      alertasEmAnalise: 20,
      alertasResolvidos: 20,
      alertasCriticos: 5,
    });
    render(<ReportCard report={report} />);
    const alertsLabel = screen.getByText('Alertas');
    const alertsContainer = alertsLabel.closest('.flex.flex-col.gap-1');
    const alertsCount = alertsContainer?.querySelector('.text-sm.font-medium');
    expect(alertsCount?.textContent).toBe('50');
  });
});
