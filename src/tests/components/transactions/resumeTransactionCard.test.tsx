import { render, screen } from '@testing-library/react';
import { ResumeTransactionCard } from '@/components/transactions/resumeTransactionCard';
import type { TransactionSummaryRow } from '@/models/reports';

// Mock formatMoney, but keep cn and other utilities
jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatMoney: (amount: number, currency: string) => {
      const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€' };
      const symbol = symbols[currency] || currency;
      return `${symbol} ${amount.toFixed(2)}`;
    },
  };
});

describe('ResumeTransactionCard', () => {
  const mockTransaction: TransactionSummaryRow = {
    type: 'Transferência',
    count: 10,
    total: 15000.50,
    average: 1500.05,
  };

  it('should render', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
    expect(screen.getByText('Transferência')).toBeInTheDocument();
  });

  it('should render transaction type as CardTitle', () => {
    const { container } = render(
      <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Transferência');
  });

  it('should render quantity', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render total with BRL currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('R$ 15000.50')).toBeInTheDocument();
  });

  it('should render total with USD currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="USD" />);
    expect(screen.getByText('$ 15000.50')).toBeInTheDocument();
  });

  it('should render total with EUR currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="EUR" />);
    expect(screen.getByText('€ 15000.50')).toBeInTheDocument();
  });

  it('should render average with BRL currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('R$ 1500.05')).toBeInTheDocument();
  });

  it('should render average with USD currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="USD" />);
    expect(screen.getByText('$ 1500.05')).toBeInTheDocument();
  });

  it('should render average with EUR currency', () => {
    render(<ResumeTransactionCard transaction={mockTransaction} currency="EUR" />);
    expect(screen.getByText('€ 1500.05')).toBeInTheDocument();
  });

  it('should render Card component', () => {
    const { container } = render(
      <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
    );
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    const { container } = render(
      <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
    );
    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    const { container } = render(
      <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
    );
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('should render with different transaction data', () => {
    const differentTransaction: TransactionSummaryRow = {
      type: 'Depósito',
      count: 5,
      total: 5000.25,
      average: 1000.05,
    };
    render(<ResumeTransactionCard transaction={differentTransaction} currency="BRL" />);
    expect(screen.getByText('Depósito')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('R$ 5000.25')).toBeInTheDocument();
    expect(screen.getByText('R$ 1000.05')).toBeInTheDocument();
  });

  it('should render with zero count', () => {
    const zeroTransaction: TransactionSummaryRow = {
      type: 'Saque',
      count: 0,
      total: 0,
      average: 0,
    };
    const { container } = render(<ResumeTransactionCard transaction={zeroTransaction} currency="BRL" />);
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // Find Total value by finding the "Total" label and then the count
    const totalLabel = screen.getByText('Total');
    const totalContainer = totalLabel.closest('.flex.flex-col.gap-1');
    const totalValue = totalContainer?.querySelector('.text-sm.font-medium');
    expect(totalValue?.textContent).toBe('R$ 0.00');
    
    // Find Média value by finding the "Média" label and then the count
    const mediaLabel = screen.getByText('Média');
    const mediaContainer = mediaLabel.closest('.flex.flex-col.gap-1');
    const mediaValue = mediaContainer?.querySelector('.text-sm.font-medium');
    expect(mediaValue?.textContent).toBe('R$ 0.00');
  });

  it('should render with decimal values', () => {
    const decimalTransaction: TransactionSummaryRow = {
      type: 'Transferência',
      count: 3,
      total: 123.456,
      average: 41.152,
    };
    render(<ResumeTransactionCard transaction={decimalTransaction} currency="USD" />);
    expect(screen.getByText('$ 123.46')).toBeInTheDocument();
    expect(screen.getByText('$ 41.15')).toBeInTheDocument();
  });
});
