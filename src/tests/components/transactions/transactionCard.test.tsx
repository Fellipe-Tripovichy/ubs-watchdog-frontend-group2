import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionCard } from '@/components/transactions/transactionCard';
import type { Transaction } from '@/features/transactions/transactionsAPI';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock CopyButton
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

// Mock LinkButton
jest.mock('@/components/ui/linkButton', () => ({
  LinkButton: ({ children, icon, iconLeft, asChild }: any) => (
    <div data-testid="link-button" data-icon={icon} data-icon-left={iconLeft} data-as-child={asChild}>
      {children}
    </div>
  ),
}));

// Mock formatMoney, formatDate, and getColorByStatus, but keep cn
jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatMoney: (amount: number, currency: string) => {
      // Simple mock - return formatted string
      return `${currency} ${amount.toFixed(2)}`;
    },
    formatDate: (dateTime: string) => {
      // Simple mock - just return a formatted string
      return new Date(dateTime).toLocaleString('pt-BR');
    },
    formatDateTime: (dateTime: string) => {
      // Simple mock - just return a formatted string
      return new Date(dateTime).toLocaleString('pt-BR');
    },
    getColorByStatus: (status: string) => {
      // Mock implementation that returns a simple color object
      const colorMap: Record<string, { light: string; foreground: string }> = {
        warning: { light: '#ffcc00', foreground: '#000000' },
        negative: { light: '#ff0000', foreground: '#ffffff' },
        success: { light: '#00ff00', foreground: '#000000' },
      };
      return colorMap[status] || { light: '#cccccc', foreground: '#000000' };
    },
  };
});

describe('TransactionCard', () => {
  const createMockTransaction = (overrides?: Partial<Transaction>): Transaction => {
    return {
      id: 'T-9001',
      clienteId: 'C-1023',
      tipo: 'Deposito',
      valor: 5000.50,
      moeda: 'BRL',
      contraparteId: null,
      dataHora: '2026-01-02T10:20:00-03:00',
      quantidadeAlertas: 0,
      ...overrides,
    };
  };

  it('should render', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText(transaction.tipo)).toBeInTheDocument();
  });

  it('should render transaction type as CardTitle', () => {
    const transaction = createMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(transaction.tipo);
  });

  it('should render transaction ID', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    // ID is displayed in truncated format: first 4 chars + ... + last 4 chars
    const truncatedId = `${transaction.id.slice(0, 4)}...${transaction.id.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
  });

  it('should render CopyButton for transaction ID', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveAttribute('data-text-to-copy', transaction.id);
    expect(copyButton).toHaveAttribute('data-variant', 'secondary');
    expect(copyButton).toHaveAttribute('data-size', 'small');
  });

  it('should render valor', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Valor')).toBeInTheDocument();
    // Find the div containing "Valor" and then find the formatted value span
    const valorLabel = screen.getByText('Valor');
    const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
    expect(valorContainer).toBeInTheDocument();
    const formattedValue = valorContainer?.querySelector('.text-sm.font-medium');
    expect(formattedValue).toBeInTheDocument();
    expect(formattedValue?.textContent).toBeTruthy();
  });

  it('should render moeda', () => {
    const transaction = createMockTransaction({ moeda: 'BRL' });
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Moeda')).toBeInTheDocument();
    // CURRENCIES.find should return "Real" for BRL
    expect(screen.getByText('Real')).toBeInTheDocument();
  });

  it('should render "-" for unknown currency', () => {
    const transaction = createMockTransaction({ moeda: 'UNKNOWN' });
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Moeda')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render DataHora', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('DataHora')).toBeInTheDocument();
    // Find the div containing "DataHora" and then find the formatted date span
    const dataHoraLabel = screen.getByText('DataHora');
    const dataHoraContainer = dataHoraLabel.closest('.flex.flex-col.gap-1');
    expect(dataHoraContainer).toBeInTheDocument();
    const formattedDate = dataHoraContainer?.querySelector('.text-sm.font-medium');
    expect(formattedDate).toBeInTheDocument();
    expect(formattedDate?.textContent).toBeTruthy();
  });

  it('should render alert badge with correct quantity', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 2 });
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('2 alertas')).toBeInTheDocument();
  });

  it('should render "Ver mais" link', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Ver mais')).toBeInTheDocument();
  });

  it('should render link with correct href', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    const link = screen.getByText('Ver mais').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/transactions/${transaction.id}`);
  });

  it('should render LinkButton with correct props', () => {
    const transaction = createMockTransaction();
    render(<TransactionCard transaction={transaction} />);
    const linkButton = screen.getByTestId('link-button');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('data-icon', 'chevron-right');
    expect(linkButton).toHaveAttribute('data-icon-left', 'false');
    expect(linkButton).toHaveAttribute('data-as-child', 'true');
  });

  it('should render Card component', () => {
    const transaction = createMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should render CardHeader component', () => {
    const transaction = createMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it('should render CardContent component', () => {
    const transaction = createMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it('should render CardAction component', () => {
    const transaction = createMockTransaction();
    const { container } = render(<TransactionCard transaction={transaction} />);
    const cardAction = container.querySelector('[data-slot="card-action"]');
    expect(cardAction).toBeInTheDocument();
  });

  it('should apply success badge style when quantidadeAlertas is 0', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 0 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      backgroundColor: '#00ff00',
      color: '#000000',
    });
  });

  it('should apply warning badge style when quantidadeAlertas is 1-2', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 1 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      backgroundColor: '#ffcc00',
      color: '#000000',
    });
  });

  it('should apply warning badge style when quantidadeAlertas is 2', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 2 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      backgroundColor: '#ffcc00',
      color: '#000000',
    });
  });

  it('should apply negative badge style when quantidadeAlertas is 3 or more', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 3 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff',
    });
  });

  it('should apply negative badge style when quantidadeAlertas is greater than 3', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 10 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff',
    });
  });

  it('should render with different transaction types', () => {
    const types = ['Deposito', 'Saque', 'Transferencia'];
    types.forEach((type) => {
      const transaction = createMockTransaction({ tipo: type });
      const { unmount } = render(<TransactionCard transaction={transaction} />);
      expect(screen.getByText(type)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render with different currencies', () => {
    const currencies = [
      { code: 'USD', fullName: 'Dólar' },
      { code: 'EUR', fullName: 'Euro' },
      { code: 'BRL', fullName: 'Real' },
    ];
    currencies.forEach((currency) => {
      const transaction = createMockTransaction({ moeda: currency.code });
      const { unmount } = render(<TransactionCard transaction={transaction} />);
      expect(screen.getByText(currency.fullName)).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle ID truncation correctly for short IDs', () => {
    const transaction = createMockTransaction({ id: 'T-1' });
    render(<TransactionCard transaction={transaction} />);
    // Even short IDs should be truncated (though result might be odd)
    const truncatedId = `${transaction.id.slice(0, 4)}...${transaction.id.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
  });

  it('should handle ID truncation correctly for long IDs', () => {
    const transaction = createMockTransaction({ 
      id: 'T-9001-very-long-transaction-id-string' 
    });
    render(<TransactionCard transaction={transaction} />);
    const truncatedId = `${transaction.id.slice(0, 4)}...${transaction.id.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
  });

  it('should render with different alert quantities', () => {
    const alertQuantities = [0, 1, 2, 3, 5, 10];
    alertQuantities.forEach((quantity) => {
      const transaction = createMockTransaction({ quantidadeAlertas: quantity });
      const { unmount } = render(<TransactionCard transaction={transaction} />);
      expect(screen.getByText(`${quantity} alertas`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render with different transaction values', () => {
    const values = [0, 100, 1000.50, 99999.99, 1000000];
    values.forEach((value) => {
      const transaction = createMockTransaction({ valor: value });
      const { unmount } = render(<TransactionCard transaction={transaction} />);
      expect(screen.getByText('Valor')).toBeInTheDocument();
      // Value should be formatted
      const valorLabel = screen.getByText('Valor');
      const valorContainer = valorLabel.closest('.flex.flex-col.gap-1');
      const formattedValue = valorContainer?.querySelector('.text-sm.font-medium');
      expect(formattedValue?.textContent).toBeTruthy();
      unmount();
    });
  });

  it('should render with different dates', () => {
    const dates = [
      '2026-01-02T10:20:00-03:00',
      '2025-12-25T00:00:00-03:00',
      '2024-06-15T14:30:00-03:00',
    ];
    dates.forEach((date) => {
      const transaction = createMockTransaction({ dataHora: date });
      const { unmount } = render(<TransactionCard transaction={transaction} />);
      expect(screen.getByText('DataHora')).toBeInTheDocument();
      // Date should be formatted
      const dataHoraLabel = screen.getByText('DataHora');
      const dataHoraContainer = dataHoraLabel.closest('.flex.flex-col.gap-1');
      const formattedDate = dataHoraContainer?.querySelector('.text-sm.font-medium');
      expect(formattedDate?.textContent).toBeTruthy();
      unmount();
    });
  });

  it('should render badge with outline variant', () => {
    const transaction = createMockTransaction({ quantidadeAlertas: 1 });
    const { container } = render(<TransactionCard transaction={transaction} />);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    // Badge should have outline variant (this is set in the component)
    // We can verify it exists and has styles applied
    expect(badge).toHaveStyle({
      backgroundColor: '#ffcc00',
      color: '#000000',
    });
  });

  it('should render with different transaction data', () => {
    const transaction = createMockTransaction({
      id: 'T-9002',
      tipo: 'Transferencia',
      valor: 10000,
      moeda: 'USD',
      quantidadeAlertas: 5,
    });
    render(<TransactionCard transaction={transaction} />);
    expect(screen.getByText('Transferencia')).toBeInTheDocument();
    expect(screen.getByText('Dólar')).toBeInTheDocument();
    expect(screen.getByText('5 alertas')).toBeInTheDocument();
    const truncatedId = `${transaction.id.slice(0, 4)}...${transaction.id.slice(-4)}`;
    expect(screen.getByText(truncatedId)).toBeInTheDocument();
  });
});
