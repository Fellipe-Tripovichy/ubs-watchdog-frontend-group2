import { render, screen } from '@testing-library/react';
import { ComplianceCard } from '@/components/compliance/complianceCard';
import { getMockClientReport } from '@/mocks/reportsMock';
import type { Alert } from '@/mocks/reportsMock';

// Mock formatDateTime and getColorByStatus, but keep cn
jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatDateTime: (dateTime: string) => {
      // Simple mock - just return a formatted string
      return new Date(dateTime).toLocaleString('pt-BR');
    },
    getColorByStatus: (status: string) => {
      // Mock implementation that returns a simple color object
      return {
        light: '#cccccc',
        foreground: '#000000',
      };
    },
  };
});

describe('ComplianceCard', () => {
  const getMockAlert = (): Alert => {
    const report = getMockClientReport('C-1023');
    return report.alerts[0];
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
    expect(title).toHaveTextContent(alert.rule);
  });

  it('should render alert ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText(alert.id)).toBeInTheDocument();
  });

  it('should render transaction ID', () => {
    const alert = getMockAlert();
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText('ID da Transação')).toBeInTheDocument();
    expect(screen.getByText(alert.transactionId)).toBeInTheDocument();
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
    // Find the div containing "Data de Criação" and then find the formatted date span
    const creationDateLabel = screen.getByText('Data de Criação');
    const creationDateContainer = creationDateLabel.closest('.flex.flex-col.gap-1');
    expect(creationDateContainer).toBeInTheDocument();
    const formattedDate = creationDateContainer?.querySelector('.text-sm.font-medium');
    expect(formattedDate).toBeInTheDocument();
    expect(formattedDate?.textContent).toBeTruthy();
  });

  it('should render resolution date when present', () => {
    const alert = getMockAlert();
    if (alert.dataResolucao) {
      render(<ComplianceCard alert={alert} />);
      expect(screen.getByText('Data de Resolução')).toBeInTheDocument();
      // Should not render "-" when dataResolucao is present
      expect(screen.queryByText('-')).not.toBeInTheDocument();
    }
  });

  it('should render "-" when resolution date is null', () => {
    const report = getMockClientReport('C-1023');
    const alertWithoutResolution = report.alerts.find((a) => !a.dataResolucao);
    if (alertWithoutResolution) {
      render(<ComplianceCard alert={alertWithoutResolution} />);
      expect(screen.getByText('Data de Resolução')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    }
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
    const report = getMockClientReport('C-1023');
    const alert = report.alerts[1];
    render(<ComplianceCard alert={alert} />);
    expect(screen.getByText(alert.rule)).toBeInTheDocument();
    expect(screen.getByText(alert.id)).toBeInTheDocument();
    expect(screen.getByText(alert.transactionId)).toBeInTheDocument();
    expect(screen.getByText(alert.severity)).toBeInTheDocument();
    expect(screen.getByText(alert.status)).toBeInTheDocument();
  });

  it('should render with different severity levels', () => {
    const report = getMockClientReport('C-1023');
    const alert = report.alerts.find((a) => a.severity === 'Alta');
    if (alert) {
      render(<ComplianceCard alert={alert} />);
      expect(screen.getByText('Alta')).toBeInTheDocument();
    }
  });

  it('should render with different status values', () => {
    const report = getMockClientReport('C-1023');
    const alert = report.alerts.find((a) => a.status === 'Resolvido');
    if (alert) {
      render(<ComplianceCard alert={alert} />);
      expect(screen.getByText('Resolvido')).toBeInTheDocument();
    }
  });
});
