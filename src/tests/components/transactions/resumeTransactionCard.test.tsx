import { render, screen } from '@testing-library/react';
import { ResumeTransactionCard } from '@/components/transactions/resumeTransactionCard';
import type { TransactionSummaryRow } from '@/models/reports';

jest.mock('@/lib/utils', () => {
  const actual = jest.requireActual('@/lib/utils');
  return {
    ...actual,
    formatMoney: (amount: number, currency: string) => {
      const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€' };
      const symbol = symbols[currency] || currency;
      return `${symbol} ${amount.toFixed(2).replace('.', ',')}`;
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

  describe('Rendering', () => {
    it('should render transaction type as title', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('Transferência')).toBeInTheDocument();
    });

    it('should render Card component with correct structure', () => {
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

    it('should render CardTitle with transaction type', () => {
      const { container } = render(
        <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
      );
      const title = container.querySelector('[data-slot="card-title"]');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Transferência');
    });

    it('should render CardContent component', () => {
      const { container } = render(
        <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
      );
      const cardContent = container.querySelector('[data-slot="card-content"]');
      expect(cardContent).toBeInTheDocument();
    });
  });

  describe('Transaction data display', () => {
    it('should render quantity label and value', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('Quantidade')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should render total label and value', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('R$ 15000,50')).toBeInTheDocument();
    });

    it('should render average label and value', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('Média')).toBeInTheDocument();
      expect(screen.getByText('R$ 1500,05')).toBeInTheDocument();
    });
  });

  describe('Currency formatting', () => {
    it('should format total with BRL currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('R$ 15000,50')).toBeInTheDocument();
    });

    it('should format total with USD currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="USD" />);
      expect(screen.getByText('$ 15000,50')).toBeInTheDocument();
    });

    it('should format total with EUR currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="EUR" />);
      expect(screen.getByText('€ 15000,50')).toBeInTheDocument();
    });

    it('should format average with BRL currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('R$ 1500,05')).toBeInTheDocument();
    });

    it('should format average with USD currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="USD" />);
      expect(screen.getByText('$ 1500,05')).toBeInTheDocument();
    });

    it('should format average with EUR currency', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="EUR" />);
      expect(screen.getByText('€ 1500,05')).toBeInTheDocument();
    });
  });

  describe('Different transaction types', () => {
    it('should render Depósito transaction type', () => {
      const depositoTransaction: TransactionSummaryRow = {
        type: 'Depósito',
        count: 5,
        total: 5000.25,
        average: 1000.05,
      };
      render(<ResumeTransactionCard transaction={depositoTransaction} currency="BRL" />);
      expect(screen.getByText('Depósito')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('R$ 5000,25')).toBeInTheDocument();
      expect(screen.getByText('R$ 1000,05')).toBeInTheDocument();
    });

    it('should render Saque transaction type', () => {
      const saqueTransaction: TransactionSummaryRow = {
        type: 'Saque',
        count: 3,
        total: 3000.75,
        average: 1000.25,
      };
      render(<ResumeTransactionCard transaction={saqueTransaction} currency="BRL" />);
      expect(screen.getByText('Saque')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('R$ 3000,75')).toBeInTheDocument();
      expect(screen.getByText('R$ 1000,25')).toBeInTheDocument();
    });

    it('should render Transferência transaction type', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      expect(screen.getByText('Transferência')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render with zero count', () => {
      const zeroTransaction: TransactionSummaryRow = {
        type: 'Saque',
        count: 0,
        total: 0,
        average: 0,
      };
      render(<ResumeTransactionCard transaction={zeroTransaction} currency="BRL" />);
      expect(screen.getByText('0')).toBeInTheDocument();
      
      const totalLabel = screen.getByText('Total');
      const totalContainer = totalLabel.closest('.flex.flex-col.gap-1');
      const totalValue = totalContainer?.querySelector('.text-sm.font-medium');
      expect(totalValue?.textContent).toBe('R$ 0,00');
      
      const mediaLabel = screen.getByText('Média');
      const mediaContainer = mediaLabel.closest('.flex.flex-col.gap-1');
      const mediaValue = mediaContainer?.querySelector('.text-sm.font-medium');
      expect(mediaValue?.textContent).toBe('R$ 0,00');
    });

    it('should render with zero total and average', () => {
      const zeroTransaction: TransactionSummaryRow = {
        type: 'Depósito',
        count: 5,
        total: 0,
        average: 0,
      };
      render(<ResumeTransactionCard transaction={zeroTransaction} currency="USD" />);
      expect(screen.getByText('5')).toBeInTheDocument();
      
      const totalLabel = screen.getByText('Total');
      const totalContainer = totalLabel.closest('.flex.flex-col.gap-1');
      const totalValue = totalContainer?.querySelector('.text-sm.font-medium');
      expect(totalValue?.textContent).toBe('$ 0,00');
      
      const mediaLabel = screen.getByText('Média');
      const mediaContainer = mediaLabel.closest('.flex.flex-col.gap-1');
      const mediaValue = mediaContainer?.querySelector('.text-sm.font-medium');
      expect(mediaValue?.textContent).toBe('$ 0,00');
    });

    it('should render with decimal values', () => {
      const decimalTransaction: TransactionSummaryRow = {
        type: 'Transferência',
        count: 3,
        total: 123.456,
        average: 41.152,
      };
      render(<ResumeTransactionCard transaction={decimalTransaction} currency="USD" />);
      expect(screen.getByText('$ 123,46')).toBeInTheDocument();
      expect(screen.getByText('$ 41,15')).toBeInTheDocument();
    });

    it('should render with large numbers', () => {
      const largeTransaction: TransactionSummaryRow = {
        type: 'Depósito',
        count: 1000,
        total: 1000000.99,
        average: 1000.00,
      };
      render(<ResumeTransactionCard transaction={largeTransaction} currency="EUR" />);
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('€ 1000000,99')).toBeInTheDocument();
      expect(screen.getByText('€ 1000,00')).toBeInTheDocument();
    });

    it('should render with negative values', () => {
      const negativeTransaction: TransactionSummaryRow = {
        type: 'Saque',
        count: 2,
        total: -500.50,
        average: -250.25,
      };
      render(<ResumeTransactionCard transaction={negativeTransaction} currency="BRL" />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('R$ -500,50')).toBeInTheDocument();
      expect(screen.getByText('R$ -250,25')).toBeInTheDocument();
    });
  });

  describe('Layout and structure', () => {
    it('should have correct grid layout for data fields', () => {
      const { container } = render(
        <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
      );
      const grid = container.querySelector('.grid.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should render all labels in correct order', () => {
      render(<ResumeTransactionCard transaction={mockTransaction} currency="BRL" />);
      const labels = ['Quantidade', 'Total', 'Média'];
      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('should apply correct text styling classes', () => {
      const { container } = render(
        <ResumeTransactionCard transaction={mockTransaction} currency="BRL" />
      );
      const mutedLabels = container.querySelectorAll('.text-xs.text-muted-foreground');
      expect(mutedLabels.length).toBe(3);
      
      const valueTexts = container.querySelectorAll('.text-sm.font-medium');
      expect(valueTexts.length).toBe(3);
    });
  });
});
