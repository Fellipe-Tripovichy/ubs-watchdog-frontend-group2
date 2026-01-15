import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmTransactionDialog } from '@/components/transactions/confirmTransactionDialog';
import type { Client } from '@/features/client/clientAPI';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    open ? <div data-testid="dialog" data-open={open}>{children}</div> : null
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children, className }: any) => (
    <div data-testid="dialog-header" className={className}>{children}</div>
  ),
  DialogTitle: ({ children, className }: any) => (
    <h2 data-testid="dialog-title" className={className}>{children}</h2>
  ),
  DialogDescription: ({ children }: any) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: any) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button
      data-testid={variant === 'secondary' ? 'cancel-button' : 'confirm-button'}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ className }: any) => (
    <div data-testid="spinner" className={className} />
  ),
}));

jest.mock('@/components/ui/copyButton', () => ({
  CopyButton: ({ textToCopy, variant, size, disabled }: any) => (
    <button
      data-testid="copy-button"
      data-text={textToCopy}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
    >
      Copy
    </button>
  ),
}));

jest.mock('@/models/transactions', () => ({
  CURRENCIES: [
    { code: 'USD', fullName: 'Dólar', countryCode: 'us', symbol: '$' },
    { code: 'EUR', fullName: 'Euro', countryCode: 'eu', symbol: '€' },
    { code: 'BRL', fullName: 'Real', countryCode: 'br', symbol: 'R$' },
  ],
}));

describe('ConfirmTransactionDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockClient: Client = {
    id: 'C-1023',
    nome: 'Maria Eduarda Ribeiro Facio',
    pais: 'Brasil',
    nivelRisco: 'Alto',
    statusKyc: 'Aprovado',
    dataCriacao: '2025-01-01T00:00:00-03:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Deposito transaction type', () => {
    it('should not render when open is false', () => {
      render(
        <ConfirmTransactionDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('should render correct title for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveTextContent('Confirmar Depósito');
    });

    it('should render correct description for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByText(/Revise as informações do depósito antes de confirmar/)).toBeInTheDocument();
    });

    it('should render client information for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Maria Eduarda Ribeiro Facio')).toBeInTheDocument();
      expect(screen.getByText('C-10...1023')).toBeInTheDocument();
    });

    it('should render formatted value for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000,50"
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer?.textContent).toMatch(/R\$.*1\.000,50/);
    });

    it('should render currency name for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByText('Moeda da transação')).toBeInTheDocument();
      expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should render correct value label for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByText('Valor do depósito')).toBeInTheDocument();
    });

    it('should render correct confirm button text for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      const confirmButton = screen.getByTestId('confirm-button');
      expect(confirmButton).toHaveTextContent('Confirmar Depósito');
    });
  });

  describe('Saque transaction type', () => {
    it('should render correct title for Saque', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Saque"
          client={mockClient}
          valor="500"
          moeda="USD"
        />
      );
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveTextContent('Confirmar Saque');
    });

    it('should render correct description for Saque', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Saque"
          client={mockClient}
          valor="500"
          moeda="USD"
        />
      );
      expect(screen.getByText(/Revise as informações do saque antes de confirmar/)).toBeInTheDocument();
    });

    it('should render correct value label for Saque', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Saque"
          client={mockClient}
          valor="500"
          moeda="USD"
        />
      );
      expect(screen.getByText('Valor do saque')).toBeInTheDocument();
    });

    it('should render correct confirm button text for Saque', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Saque"
          client={mockClient}
          valor="500"
          moeda="USD"
        />
      );
      const confirmButton = screen.getByTestId('confirm-button');
      expect(confirmButton).toHaveTextContent('Confirmar Saque');
    });
  });

  describe('Transferencia transaction type', () => {
    const mockOriginClient: Client = {
      id: 'C-1023',
      nome: 'Maria Eduarda',
      pais: 'Brasil',
      nivelRisco: 'Alto',
      statusKyc: 'Aprovado',
      dataCriacao: '2025-01-01T00:00:00-03:00',
    };

    const mockDestinationClient: Client = {
      id: 'C-2041',
      nome: 'João Silva',
      pais: 'Portugal',
      nivelRisco: 'Médio',
      statusKyc: 'Pendente',
      dataCriacao: '2025-01-05T00:00:00-03:00',
    };

    it('should render correct title for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockOriginClient}
          destinationClient={mockDestinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveTextContent('Confirmar Transferência');
    });

    it('should render correct description for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockOriginClient}
          destinationClient={mockDestinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText(/Revise as informações da transferência antes de confirmar/)).toBeInTheDocument();
    });

    it('should render origin and destination clients for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockOriginClient}
          destinationClient={mockDestinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText('Cliente origem')).toBeInTheDocument();
      expect(screen.getByText('Cliente destino')).toBeInTheDocument();
      expect(screen.getByText('Maria Eduarda')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('should render correct value label for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockOriginClient}
          destinationClient={mockDestinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText('Valor da transferência')).toBeInTheDocument();
    });

    it('should render correct confirm button text for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockOriginClient}
          destinationClient={mockDestinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      const confirmButton = screen.getByTestId('confirm-button');
      expect(confirmButton).toHaveTextContent('Confirmar Transferência');
    });
  });

  describe('User interactions', () => {
    it('should call onOpenChange with false when cancel button is clicked', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call onConfirm when confirm button is clicked', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading state', () => {
    it('should disable buttons when isCreating is true', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
          isCreating={true}
        />
      );
      const cancelButton = screen.getByTestId('cancel-button');
      const confirmButton = screen.getByTestId('confirm-button');
      expect(cancelButton).toBeDisabled();
      expect(confirmButton).toBeDisabled();
    });

    it('should show spinner and processing text when isCreating is true for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
          isCreating={true}
        />
      );
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Realizando depósito...')).toBeInTheDocument();
    });

    it('should show spinner and processing text when isCreating is true for Saque', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Saque"
          client={mockClient}
          valor="500"
          moeda="USD"
          isCreating={true}
        />
      );
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Realizando saque...')).toBeInTheDocument();
    });

    it('should show spinner and processing text when isCreating is true for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockClient}
          destinationClient={mockClient}
          valor="2000"
          moeda="EUR"
          isCreating={true}
        />
      );
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Realizando transferência...')).toBeInTheDocument();
    });

    it('should enable buttons when isCreating is false', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
          isCreating={false}
        />
      );
      const cancelButton = screen.getByTestId('cancel-button');
      const confirmButton = screen.getByTestId('confirm-button');
      expect(cancelButton).not.toBeDisabled();
      expect(confirmButton).not.toBeDisabled();
    });
  });

  describe('Value formatting', () => {
    it('should format value with Brazilian format', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1234,56"
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer?.textContent).toMatch(/1\.234,56/);
    });

    it('should format value with thousands separator', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="10000,50"
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer?.textContent).toMatch(/10\.000,50/);
    });

    it('should show "-" when valor is empty', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor=""
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer).toBeInTheDocument();
      expect(valueContainer?.textContent).toContain('-');
    });
  });

  describe('Currency display', () => {
    it('should display USD currency symbol and name', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="USD"
        />
      );
      expect(screen.getByText(/Dólar/)).toBeInTheDocument();
    });

    it('should display EUR currency symbol and name', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="EUR"
        />
      );
      expect(screen.getByText(/Euro/)).toBeInTheDocument();
    });

    it('should show "-" when currency is not found', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="UNKNOWN"
        />
      );
      expect(screen.getByText('Moeda da transação')).toBeInTheDocument();
      const currencyText = screen.getByText('-');
      expect(currencyText).toBeInTheDocument();
    });

    it('should use default "$" symbol when moeda is empty', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda=""
        />
      );
      expect(screen.getByText(/\$.*/)).toBeInTheDocument();
    });
  });

  describe('Client information', () => {
    it('should show "-" when client is null for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={null}
          valor="1000"
          moeda="BRL"
        />
      );
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      const clientName = screen.getAllByText('-');
      expect(clientName.length).toBeGreaterThan(0);
    });

    it('should show "-" when client is undefined for Deposito', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={undefined}
          valor="1000"
          moeda="BRL"
        />
      );
      const clientName = screen.getAllByText('-');
      expect(clientName.length).toBeGreaterThan(0);
    });

    it('should show "-" when originClient is null for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={null}
          destinationClient={mockClient}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText('Cliente origem')).toBeInTheDocument();
      const clientName = screen.getAllByText('-');
      expect(clientName.length).toBeGreaterThan(0);
    });

    it('should show "-" when destinationClient is null for Transferencia', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          originClient={mockClient}
          destinationClient={null}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText('Cliente destino')).toBeInTheDocument();
      const clientName = screen.getAllByText('-');
      expect(clientName.length).toBeGreaterThan(0);
    });

    it('should render CopyButton with correct props for client ID', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="1000"
          moeda="BRL"
        />
      );
      const copyButtons = screen.getAllByTestId('copy-button');
      const clientCopyButton = copyButtons.find(btn => btn.getAttribute('data-text') === 'C-1023');
      expect(clientCopyButton).toBeInTheDocument();
      expect(clientCopyButton).toHaveAttribute('data-variant', 'secondary');
      expect(clientCopyButton).toHaveAttribute('data-size', 'small');
      expect(clientCopyButton).not.toBeDisabled();
    });

    it('should disable CopyButton when client ID is missing', () => {
      const clientWithoutId = { ...mockClient, id: '' };
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={clientWithoutId}
          valor="1000"
          moeda="BRL"
        />
      );
      const copyButtons = screen.getAllByTestId('copy-button');
      const clientCopyButton = copyButtons.find(btn => btn.getAttribute('data-text') === '');
      expect(clientCopyButton).toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty valor string', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor=""
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer).toBeInTheDocument();
      expect(valueContainer?.textContent).toContain('-');
    });

    it('should handle invalid valor format', () => {
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Deposito"
          client={mockClient}
          valor="invalid"
          moeda="BRL"
        />
      );
      const valueLabel = screen.getByText('Valor do depósito');
      const valueContainer = valueLabel.closest('.flex.items-start.justify-between');
      expect(valueContainer).toBeInTheDocument();
      expect(valueContainer?.textContent).toContain('R$');
      expect(valueContainer?.textContent?.trim()).not.toContain('-');
    });

    it('should use originClient and destinationClient for Transferencia instead of client prop', () => {
      const originClient: Client = {
        id: 'C-1001',
        nome: 'Origin Client',
        pais: 'Brasil',
        nivelRisco: 'Baixo',
        statusKyc: 'Aprovado',
        dataCriacao: '2025-01-01T00:00:00-03:00',
      };
      const destinationClient: Client = {
        id: 'C-2002',
        nome: 'Destination Client',
        pais: 'Portugal',
        nivelRisco: 'Médio',
        statusKyc: 'Pendente',
        dataCriacao: '2025-01-05T00:00:00-03:00',
      };
      render(
        <ConfirmTransactionDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
          type="Transferencia"
          client={mockClient}
          originClient={originClient}
          destinationClient={destinationClient}
          valor="2000"
          moeda="EUR"
        />
      );
      expect(screen.getByText('Origin Client')).toBeInTheDocument();
      expect(screen.getByText('Destination Client')).toBeInTheDocument();
      expect(screen.queryByText('Maria Eduarda Ribeiro Facio')).not.toBeInTheDocument();
    });
  });
});
