import { render, screen } from '@testing-library/react';
import { TransactionCard } from '@/components/transactions/transactionCard';
import { getMockClientReport } from '@/mocks/reportsMock';
import type { Transaction } from '@/mocks/reportsMock';

// Mock formatMoney and formatDateTime, but keep cn and other utilities
jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatMoney: (amount: number, currency: string) => {
      const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€' };
      const symbol = symbols[currency] || currency;
      return `${symbol} ${amount.toFixed(2)}`;
    },
    formatDateTime: (dateTime: string) => {
      // Simple mock - just return a formatted string
      return new Date(dateTime).toLocaleString('pt-BR');
    },
  };
});

describe('TransactionCard', () => {
  const getMockTransaction = (): Transaction => {
    const report = getMockClientReport('C-1023');
    return report.transactions[0];
  };

  it('should render', () => {
    const transaction = getMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText(transaction.type)).toBeInTheDocument();
  });

  it('should render transaction type as CardTitle', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(transaction.type);
  });

  it('should render transaction ID', () => {
    const transaction = getMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText(transaction.id)).toBeInTheDocument();
  });

  it('should render transaction amount with currency', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Valor')).toBeInTheDocument();
    // Find amount value by finding the "Valor" label and then the formatted amount
    const valorLabel = screen.getByText('Valor');
    const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
    const amountValue = valorContainer?.querySelector('.text-sm.font-medium');
    expect(amountValue).toBeInTheDocument();
    expect(amountValue?.textContent).toContain(transaction.amount.toString());
  });

  it('should render counterparty', () => {
    const transaction = getMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Contraparte')).toBeInTheDocument();
    expect(screen.getByText(transaction.counterparty)).toBeInTheDocument();
  });

  it('should render date time', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('DataHora')).toBeInTheDocument();
    // Find date time value by finding the "DataHora" label and then the formatted date
    const dataHoraLabel = screen.getByText('DataHora');
    const dataHoraContainer = dataHoraLabel.closest('.flex.flex-col.gap-1');
    const dateTimeValue = dataHoraContainer?.querySelector('.text-sm.font-medium');
    expect(dateTimeValue).toBeInTheDocument();
    expect(dateTimeValue?.textContent).toBeTruthy();
  });

  it('should render Card component', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    const transaction = getMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('should render with different transaction data', () => {
    const report = getMockClientReport('C-1023');
    const transaction = report.transactions[1];
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText(transaction.type)).toBeInTheDocument();
    expect(screen.getByText(transaction.id)).toBeInTheDocument();
    expect(screen.getByText(transaction.counterparty)).toBeInTheDocument();
  });

  it('should render with BRL currency', () => {
    const report = getMockClientReport('C-1023');
    const transaction = report.transactions.find((t) => t.currency === 'BRL');
    if (transaction) {
      const { container } = render(<TransactionCard transaction={transaction} />);
      // Find amount value by finding the "Valor" label and then check it contains BRL symbol
      const valorLabel = screen.getByText('Valor');
      const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
      const amountValue = valorContainer?.querySelector('.text-sm.font-medium');
      expect(amountValue?.textContent).toContain('R$');
    }
  });

  it('should render with USD currency', () => {
    const report = getMockClientReport('C-1023');
    const transaction = report.transactions.find((t) => t.currency === 'USD');
    if (transaction) {
      const { container } = render(<TransactionCard transaction={transaction} />);
      // Find amount value by finding the "Valor" label and then check it contains USD symbol
      const valorLabel = screen.getByText('Valor');
      const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
      const amountValue = valorContainer?.querySelector('.text-sm.font-medium');
      expect(amountValue?.textContent).toContain('$');
    }
  });

  it('should render with EUR currency', () => {
    const report = getMockClientReport('C-1023');
    const transaction = report.transactions.find((t) => t.currency === 'EUR');
    if (transaction) {
      const { container } = render(<TransactionCard transaction={transaction} />);
      // Find amount value by finding the "Valor" label and then check it contains EUR symbol
      const valorLabel = screen.getByText('Valor');
      const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
      const amountValue = valorContainer?.querySelector('.text-sm.font-medium');
      expect(amountValue?.textContent).toContain('€');
    }
  });
});
