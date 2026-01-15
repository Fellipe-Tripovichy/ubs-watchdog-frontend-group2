import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  getTransactionsColumns,
  CURRENCIES,
  type CurrencyInfo,
} from '@/models/transactions';
import type { Transaction } from '@/features/transactions/transactionsAPI';

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

jest.mock('lucide-react', () => ({
  ArrowUpRight: ({ className }: any) => (
    <svg data-testid="arrow-up-right" className={className} />
  ),
}));

jest.mock('@/lib/utils', () => ({
  formatMoney: jest.fn((value: number, currency: string) => {
    return `${currency} ${value.toFixed(2)}`;
  }),
  formatDateTime: jest.fn((date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  }),
}));

describe('transactions models', () => {
  describe('CURRENCIES', () => {
    it('should be an array', () => {
      expect(Array.isArray(CURRENCIES)).toBe(true);
    });

    it('should contain currency objects', () => {
      expect(CURRENCIES.length).toBeGreaterThan(0);
      CURRENCIES.forEach((currency) => {
        expect(currency).toHaveProperty('code');
        expect(currency).toHaveProperty('fullName');
        expect(currency).toHaveProperty('countryCode');
        expect(currency).toHaveProperty('symbol');
      });
    });

    it('should contain USD currency', () => {
      const usd = CURRENCIES.find((c) => c.code === 'USD');
      expect(usd).toBeDefined();
      expect(usd?.fullName).toBe('Dólar');
      expect(usd?.countryCode).toBe('us');
      expect(usd?.symbol).toBe('$');
    });

    it('should contain BRL currency', () => {
      const brl = CURRENCIES.find((c) => c.code === 'BRL');
      expect(brl).toBeDefined();
      expect(brl?.fullName).toBe('Real');
      expect(brl?.countryCode).toBe('br');
      expect(brl?.symbol).toBe('R$');
    });

    it('should contain EUR currency', () => {
      const eur = CURRENCIES.find((c) => c.code === 'EUR');
      expect(eur).toBeDefined();
      expect(eur?.fullName).toBe('Euro');
      expect(eur?.countryCode).toBe('eu');
      expect(eur?.symbol).toBe('€');
    });

    it('should have unique currency codes', () => {
      const codes = CURRENCIES.map((c) => c.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
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

    it('should have correct column keys', () => {
      const columns = getTransactionsColumns();
      const keys = columns.map((col) => col.key);
      expect(keys).toContain('id');
      expect(keys).toContain('tipo');
      expect(keys).toContain('valor');
      expect(keys).toContain('moeda');
      expect(keys).toContain('dataHora');
      expect(keys).toContain('quantidadeAlertas');
      expect(keys).toContain('details');
    });

    it('should render ID column correctly', () => {
      const columns = getTransactionsColumns();
      const idColumn = columns.find((col) => col.key === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');
      if (!idColumn?.render) return;

      const rendered = render(<>{idColumn.render(mockTransaction, 0)}</>);
      expect(rendered.container.textContent).toContain('T-90...9001');
      expect(rendered.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('should render tipo column correctly', () => {
      const columns = getTransactionsColumns();
      const tipoColumn = columns.find((col) => col.key === 'tipo');
      expect(tipoColumn).toBeDefined();
      expect(tipoColumn?.label).toBe('Tipo');
      if (!tipoColumn?.render) return;

      const rendered = render(<>{tipoColumn.render(mockTransaction, 0)}</>);
      expect(rendered.container.textContent).toContain('Depósito');
    });

    it('should render tipo labels correctly for all types', () => {
      const columns = getTransactionsColumns();
      const tipoColumn = columns.find((col) => col.key === 'tipo');
      if (!tipoColumn?.render) return;

      const renderFn = tipoColumn.render;
      const types = ['Deposito', 'Saque', 'Transferencia'];
      const expectedLabels = ['Depósito', 'Saque', 'Transferência'];

      types.forEach((type, index) => {
        const transaction = { ...mockTransaction, tipo: type };
        const rendered = render(<>{renderFn(transaction, 0)}</>);
        expect(rendered.container.textContent).toContain(expectedLabels[index]);
        rendered.unmount();
      });
    });

    it('should render valor column correctly', () => {
      const columns = getTransactionsColumns();
      const valorColumn = columns.find((col) => col.key === 'valor');
      expect(valorColumn).toBeDefined();
      expect(valorColumn?.label).toBe('Valor');
      if (!valorColumn?.render) return;

      render(<>{valorColumn.render(mockTransaction, 0)}</>);
    });

    it('should render moeda column correctly', () => {
      const columns = getTransactionsColumns();
      const moedaColumn = columns.find((col) => col.key === 'moeda');
      expect(moedaColumn).toBeDefined();
      expect(moedaColumn?.label).toBe('Moeda');
      if (!moedaColumn?.render) return;

      const rendered = render(<>{moedaColumn.render(mockTransaction, 0)}</>);
      expect(rendered.container.textContent).toContain('Real');
    });

    it('should render moeda column with correct currency names', () => {
      const columns = getTransactionsColumns();
      const moedaColumn = columns.find((col) => col.key === 'moeda');
      if (!moedaColumn?.render) return;

      const renderFn = moedaColumn.render;
      const currencies = ['USD', 'EUR', 'BRL'];
      const expectedNames = ['Dólar', 'Euro', 'Real'];

      currencies.forEach((currency, index) => {
        const transaction = { ...mockTransaction, moeda: currency };
        const rendered = render(<>{renderFn(transaction, 0)}</>);
        expect(rendered.container.textContent).toContain(expectedNames[index]);
        rendered.unmount();
      });
    });

    it('should render "-" for unknown currency', () => {
      const columns = getTransactionsColumns();
      const moedaColumn = columns.find((col) => col.key === 'moeda');
      if (!moedaColumn?.render) return;

      const transaction = { ...mockTransaction, moeda: 'UNKNOWN' };
      const rendered = render(<>{moedaColumn.render(transaction, 0)}</>);
      expect(rendered.container.textContent).toContain('-');
    });

    it('should render dataHora column correctly', () => {
      const columns = getTransactionsColumns();
      const dataHoraColumn = columns.find((col) => col.key === 'dataHora');
      expect(dataHoraColumn).toBeDefined();
      expect(dataHoraColumn?.label).toBe('DataHora');
      if (!dataHoraColumn?.render) return;

      render(<>{dataHoraColumn.render(mockTransaction, 0)}</>);
    });

    it('should render quantidadeAlertas column correctly', () => {
      const columns = getTransactionsColumns();
      const alertasColumn = columns.find((col) => col.key === 'quantidadeAlertas');
      expect(alertasColumn).toBeDefined();
      expect(alertasColumn?.label).toBe('Alertas');
      if (!alertasColumn?.render) return;

      const rendered = render(<>{alertasColumn.render(mockTransaction, 0)}</>);
      expect(rendered.container.textContent).toContain('2');
    });

    it('should render quantidadeAlertas as zero when no alerts', () => {
      const columns = getTransactionsColumns();
      const alertasColumn = columns.find((col) => col.key === 'quantidadeAlertas');
      if (!alertasColumn?.render) return;

      const transaction = { ...mockTransaction, quantidadeAlertas: 0 };
      const rendered = render(<>{alertasColumn.render(transaction, 0)}</>);
      expect(rendered.container.textContent).toContain('0');
    });

    it('should render details column correctly', () => {
      const columns = getTransactionsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      expect(detailsColumn).toBeDefined();
      expect(detailsColumn?.label).toBe('Detalhes');
      if (!detailsColumn?.render) return;

      const rendered = render(<>{detailsColumn.render(mockTransaction, 0)}</>);
      expect(rendered.getByTestId('arrow-up-right')).toBeInTheDocument();
    });

    it('should render correct link in details column', () => {
      const columns = getTransactionsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      if (!detailsColumn?.render) return;

      const rendered = render(<>{detailsColumn.render(mockTransaction, 0)}</>);
      const link = rendered.getByRole('link');
      expect(link).toHaveAttribute('href', '/transactions/T-9001');
    });

    it('should have correct className for columns', () => {
      const columns = getTransactionsColumns();
      columns.forEach((column) => {
        expect(column.className).toBeDefined();
        expect(column.headerClassName).toBeDefined();
      });
    });

    it('should have correct headerClassName for details column', () => {
      const columns = getTransactionsColumns();
      const detailsColumn = columns.find((col) => col.key === 'details');
      expect(detailsColumn?.headerClassName).toBe('text-right');
      expect(detailsColumn?.className).toBe('text-right');
    });
  });
});
