import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '@/components/transactions/transactionForm';
import type { Client } from '@/features/client/clientAPI';

const mockDispatch = jest.fn();
const mockUseAppSelector = jest.fn();

jest.mock('@/lib/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

jest.mock('@/features/client/clientAPI', () => ({
  getClientsAPI: jest.fn(),
}));

jest.mock('@/features/transactions/transactionsSlice', () => {
  const mockCreateTransactionThunk = jest.fn((payload) => ({
    type: 'transactions/createTransaction',
    payload,
  }));

  mockCreateTransactionThunk.fulfilled = {
    match: (action: any) => action?.type === 'transactions/createTransaction/fulfilled',
    type: 'transactions/createTransaction/fulfilled',
  };

  mockCreateTransactionThunk.rejected = {
    match: (action: any) => action?.type === 'transactions/createTransaction/rejected',
    type: 'transactions/createTransaction/rejected',
  };

  mockCreateTransactionThunk.pending = {
    match: (action: any) => action?.type === 'transactions/createTransaction/pending',
    type: 'transactions/createTransaction/pending',
  };

  return {
    createTransaction: mockCreateTransactionThunk,
    selectTransactionCreating: (state: any) => state?.transactions?.isCreating || false,
  };
});

jest.mock('@/features/auth/authSlice', () => ({
  selectToken: (state: any) => state?.auth?.token || null,
}));

jest.mock('@/features/client/clientSlice', () => ({
  fetchClientById: jest.fn((payload) => ({
    type: 'client/fetchClientById',
    payload,
  })),
  clearClient: jest.fn(() => ({
    type: 'client/clearClient',
  })),
  selectCurrentClient: (state: any) => state?.client?.currentClient || null,
  selectCurrentClientLoading: (state: any) => state?.client?.isLoadingClient || false,
  selectContraparteClient: (state: any) => state?.client?.contraparteClient || null,
  selectContraparteClientLoading: (state: any) => state?.client?.isLoadingContraparte || false,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <div data-testid="select" data-value={value} data-disabled={disabled}>
      {React.Children.map(children, (child: any) => {
        if (child?.type?.displayName === 'SelectTrigger') {
          return React.cloneElement(child, { onValueChange, disabled });
        }
        if (child?.type?.displayName === 'SelectContent') {
          return React.cloneElement(child, { onValueChange });
        }
        return child;
      })}
    </div>
  ),
  SelectTrigger: ({ children, onValueChange, disabled, id }: any) => (
    <button
      id={id}
      data-testid={`select-trigger-${id}`}
      onClick={() => !disabled && onValueChange?.('test-value')}
      disabled={disabled}
    >
      {children}
    </button>
  ),
  SelectContent: ({ children, onValueChange }: any) => (
    <div data-testid="select-content">
      {React.Children.map(children, (child: any) => {
        return React.cloneElement(child, { onValueChange });
      })}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => <span data-testid="select-value">{placeholder}</span>,
  SelectItem: ({ children, value, onValueChange }: any) => (
    <button
      data-testid={`select-item-${value}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  ),
}));

const Select = require('@/components/ui/select').Select;
Select.displayName = 'Select';
const SelectTrigger = require('@/components/ui/select').SelectTrigger;
SelectTrigger.displayName = 'SelectTrigger';
const SelectContent = require('@/components/ui/select').SelectContent;
SelectContent.displayName = 'SelectContent';

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onBlur, prefix, placeholder, id }: any) => (
    <div>
      {prefix && <span>{prefix}</span>}
      <input
        id={id}
        data-testid={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, className }: any) => (
    <button
      data-testid="submit-button"
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/flagImage', () => ({
  FlagImage: ({ country, className }: any) => (
    <img data-testid={`flag-${country}`} className={className} alt={country} />
  ),
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

jest.mock('@/components/ui/copyButton', () => ({
  CopyButton: ({ textToCopy, disabled }: any) => (
    <button data-testid="copy-button" data-text={textToCopy} disabled={disabled}>
      Copy
    </button>
  ),
}));

jest.mock('@/components/ui/sectionTitle', () => ({
  SectionTitle: ({ children }: any) => <h2 data-testid="section-title">{children}</h2>,
}));

jest.mock('@/components/transactions/confirmTransactionDialog', () => ({
  ConfirmTransactionDialog: ({ open, onConfirm, type, client, originClient, destinationClient, valor, moeda }: any) => (
    open ? (
      <div data-testid="confirm-dialog">
        <button data-testid="confirm-dialog-button" onClick={onConfirm}>
          Confirm
        </button>
        <div data-type={type} data-valor={valor} data-moeda={moeda} />
      </div>
    ) : null
  ),
}));

describe('TransactionForm', () => {
  const mockClients: Client[] = [
    {
      id: 'C-1001',
      nome: 'Maria Silva',
      pais: 'Brasil',
      nivelRisco: 'Baixo',
      statusKyc: 'Aprovado',
      dataCriacao: '2025-01-01T00:00:00-03:00',
    },
    {
      id: 'C-1002',
      nome: 'João Santos',
      pais: 'Portugal',
      nivelRisco: 'Médio',
      statusKyc: 'Pendente',
      dataCriacao: '2025-01-02T00:00:00-03:00',
    },
  ];

  const mockClient: Client = {
    id: 'C-1001',
    nome: 'Maria Silva',
    pais: 'Brasil',
    nivelRisco: 'Baixo',
    statusKyc: 'Aprovado',
    dataCriacao: '2025-01-01T00:00:00-03:00',
  };

  const mockGetClientsAPI = require('@/features/client/clientAPI').getClientsAPI;
  const mockCreateTransaction = require('@/features/transactions/transactionsSlice').createTransaction;

  const mockState = {
    auth: { token: 'mock-token' },
    transactions: { isCreating: false },
    client: {
      currentClient: null,
      isLoadingClient: false,
      contraparteClient: null,
      isLoadingContraparte: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockReturnValue(Promise.resolve({ type: 'fulfilled' }));
    mockUseAppSelector.mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        try {
          return selector(mockState);
        } catch {
          return null;
        }
      }
      return null;
    });
    mockGetClientsAPI.mockResolvedValue(mockClients);
  });

  describe('Rendering', () => {
    it('should render form for Deposito', () => {
      render(<TransactionForm type="Deposito" />);
      expect(screen.getAllByText('Cliente').length).toBeGreaterThan(0);
      expect(screen.getByText('Informações do depósito')).toBeInTheDocument();
      expect(screen.getByText('Realizar Depósito')).toBeInTheDocument();
    });

    it('should render form for Saque', () => {
      render(<TransactionForm type="Saque" />);
      expect(screen.getAllByText('Cliente').length).toBeGreaterThan(0);
      expect(screen.getByText('Informações do saque')).toBeInTheDocument();
      expect(screen.getByText('Realizar Saque')).toBeInTheDocument();
    });

    it('should render form for Transferencia', () => {
      render(<TransactionForm type="Transferencia" />);
      expect(screen.getAllByText('Cliente origem').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Cliente destino').length).toBeGreaterThan(0);
      expect(screen.getByText('Informações da transferência')).toBeInTheDocument();
      expect(screen.getByText('Realizar Transferência')).toBeInTheDocument();
    });

    it('should fetch clients on mount when token is available', async () => {
      render(<TransactionForm type="Deposito" />);
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalledWith({ token: 'mock-token' });
      });
    });

    it('should not fetch clients when token is not available', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        if (selector.toString().includes('selectToken')) return null;
        return null;
      });
      render(<TransactionForm type="Deposito" />);
      expect(mockGetClientsAPI).not.toHaveBeenCalled();
    });
  });

  describe('Form fields', () => {
    it('should render all form fields for Deposito', () => {
      render(<TransactionForm type="Deposito" />);
      expect(screen.getByLabelText('Cliente')).toBeInTheDocument();
      expect(screen.getByLabelText('Moeda')).toBeInTheDocument();
      expect(screen.getByLabelText('Valor')).toBeInTheDocument();
    });

    it('should render contraparte field for Transferencia', () => {
      render(<TransactionForm type="Transferencia" />);
      expect(screen.getByLabelText('Cliente origem')).toBeInTheDocument();
      expect(screen.getByLabelText('Cliente destino')).toBeInTheDocument();
    });

    it('should render currency options', async () => {
      render(<TransactionForm type="Deposito" />);
      await waitFor(() => {
        expect(screen.getByText('BRL - Real')).toBeInTheDocument();
        expect(screen.getByText('USD - Dólar')).toBeInTheDocument();
        expect(screen.getByText('EUR - Euro')).toBeInTheDocument();
      });
    });
  });

  describe('Client selection', () => {
    it('should fetch client details when clienteId is selected', async () => {
      render(<TransactionForm type="Deposito" />);
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });
      
      const selectTrigger = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(selectTrigger);
      
      await waitFor(() => {
        const selectItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(selectItem);
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'client/fetchClientById',
            payload: { clientId: 'C-1001', token: 'mock-token' },
          })
        );
      });
    });

    it('should clear client when clienteId is cleared for Deposito', async () => {
      const mockState = {
        client: {
          currentClient: mockClient,
          isLoadingClient: false,
          contraparteClient: null,
          isLoadingContraparte: false,
        },
        auth: {
          token: 'mock-token',
        },
        transactions: {
          isCreating: false,
        },
      };

      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector(mockState);
      });

      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      }, { timeout: 3000 });

      const selectTrigger = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(selectTrigger);
      
      await waitFor(() => {
        const selectItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(selectItem);
      });

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('Form validation', () => {
    it('should disable submit button when form is invalid', () => {
      render(<TransactionForm type="Deposito" />);
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', async () => {
      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      await waitFor(() => {
        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should show error when submitting empty form', async () => {
      render(<TransactionForm type="Deposito" />);
      
      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText('Por favor, preencha todos os campos')).toBeInTheDocument();
      });
    });

    it('should show error when valor is invalid', async () => {
      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '0' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText('Por favor, insira um valor válido maior que zero')).toBeInTheDocument();
      });
    });

    it('should show error when contraparte is missing for Transferencia', async () => {
      render(<TransactionForm type="Transferencia" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItems = screen.getAllByTestId('select-item-C-1001');
        const clienteItem = clienteItems[0];
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText('Por favor, selecione uma contraparte')).toBeInTheDocument();
      });
    });
  });

  describe('Form submission', () => {
    it('should call onFormSubmit when provided', async () => {
      const mockOnFormSubmit = jest.fn();
      const mockOnDialogOpenChange = jest.fn();
      
      render(
        <TransactionForm
          type="Deposito"
          onFormSubmit={mockOnFormSubmit}
          onDialogOpenChange={mockOnDialogOpenChange}
        />
      );
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockOnFormSubmit).toHaveBeenCalledWith({
          clienteId: 'C-1001',
          moeda: 'BRL',
          valor: '100,50',
          contraparteId: null,
        });
        expect(mockOnDialogOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it('should open dialog when onFormSubmit is not provided', async () => {
      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Value formatting', () => {
    it('should format value on blur', async () => {
      render(<TransactionForm type="Deposito" />);
      
      const valorInput = screen.getByTestId('valor') as HTMLInputElement;
      fireEvent.change(valorInput, { target: { value: '1000,50' } });
      fireEvent.blur(valorInput);

      await waitFor(() => {
        expect(valorInput.value).toBe('1.000,50');
      });
    });

    it('should restrict decimal places to 2', async () => {
      render(<TransactionForm type="Deposito" />);
      
      const valorInput = screen.getByTestId('valor') as HTMLInputElement;
      fireEvent.change(valorInput, { target: { value: '100,123' } });

      await waitFor(() => {
        expect(valorInput.value).toBe('100,12');
      });
    });

    it('should remove non-numeric characters except comma', async () => {
      render(<TransactionForm type="Deposito" />);
      
      const valorInput = screen.getByTestId('valor') as HTMLInputElement;
      fireEvent.change(valorInput, { target: { value: 'abc100,50xyz' } });

      await waitFor(() => {
        expect(valorInput.value).toBe('100,50');
      });
    });
  });

  describe('Client information display', () => {
    it('should display client information when client is loaded', () => {
      const mockState = {
        client: {
          currentClient: mockClient,
          isLoadingClient: false,
          contraparteClient: null,
          isLoadingContraparte: false,
        },
        auth: {
          token: 'mock-token',
        },
        transactions: {
          isCreating: false,
        },
      };

      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector(mockState);
      });

      render(<TransactionForm type="Deposito" />);
      
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('C-10...1001')).toBeInTheDocument();
    });

    it('should show skeleton when loading client', () => {
      const mockState = {
        client: {
          currentClient: null,
          isLoadingClient: true,
          contraparteClient: null,
          isLoadingContraparte: false,
        },
        auth: {
          token: 'mock-token',
        },
        transactions: {
          isCreating: false,
        },
      };

      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector(mockState);
      });

      render(<TransactionForm type="Deposito" />);
      
      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
    });

    it('should display contraparte client for Transferencia', () => {
      const mockContraparteClient: Client = {
        id: 'C-1002',
        nome: 'João Santos',
        pais: 'Portugal',
        nivelRisco: 'Médio',
        statusKyc: 'Pendente',
        dataCriacao: '2025-01-02T00:00:00-03:00',
      };

      const mockState = {
        client: {
          currentClient: mockClient,
          isLoadingClient: false,
          contraparteClient: mockContraparteClient,
          isLoadingContraparte: false,
        },
        auth: {
          token: 'mock-token',
        },
        transactions: {
          isCreating: false,
        },
      };

      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector(mockState);
      });

      render(<TransactionForm type="Transferencia" />);
      
      expect(screen.getByText('João Santos')).toBeInTheDocument();
      expect(screen.getByText('C-10...1002')).toBeInTheDocument();
    });
  });

  describe('Transaction confirmation', () => {
    it('should create transaction when confirmed', async () => {
      const fulfilledAction = {
        type: 'transactions/createTransaction/fulfilled',
        payload: { id: 'T-123' },
      };
      mockDispatch.mockResolvedValue(fulfilledAction);

      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      }, { timeout: 3000 });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId('confirm-dialog-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('should call onTransactionResult on success', async () => {
      const mockOnTransactionResult = jest.fn();
      const fulfilledAction = {
        type: 'transactions/createTransaction/fulfilled',
        payload: { id: 'T-123' },
      };
      mockDispatch.mockResolvedValue(fulfilledAction);

      render(
        <TransactionForm
          type="Deposito"
          onTransactionResult={mockOnTransactionResult}
        />
      );
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      }, { timeout: 3000 });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId('confirm-dialog-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnTransactionResult).toHaveBeenCalledWith(true);
      }, { timeout: 3000 });
    });

    it('should call onTransactionResult on error', async () => {
      const mockOnTransactionResult = jest.fn();
      const rejectedAction = {
        type: 'transactions/createTransaction/rejected',
        error: { message: 'Error' },
      };
      mockDispatch.mockResolvedValue(rejectedAction);

      render(
        <TransactionForm
          type="Deposito"
          onTransactionResult={mockOnTransactionResult}
        />
      );
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      }, { timeout: 3000 });

      const clienteSelect = screen.getByTestId('select-trigger-cliente');
      fireEvent.click(clienteSelect);
      
      await waitFor(() => {
        const clienteItem = screen.getByTestId('select-item-C-1001');
        fireEvent.click(clienteItem);
      });

      const moedaSelect = screen.getByTestId('select-trigger-moeda');
      fireEvent.click(moedaSelect);
      
      await waitFor(() => {
        const moedaItem = screen.getByTestId('select-item-BRL');
        fireEvent.click(moedaItem);
      });

      const valorInput = screen.getByTestId('valor');
      fireEvent.change(valorInput, { target: { value: '100,50' } });

      const form = screen.getByTestId('submit-button').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId('confirm-dialog-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnTransactionResult).toHaveBeenCalledWith(
          false,
          'Falha ao criar a transação. Por favor, tente novamente.'
        );
      }, { timeout: 3000 });
    });
  });

  describe('Loading states', () => {
    it('should disable submit button when creating transaction', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        if (selector.toString().includes('selectToken')) return 'mock-token';
        if (selector.toString().includes('selectTransactionCreating')) return true;
        return null;
      });

      render(<TransactionForm type="Deposito" />);
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state for clients', async () => {
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockGetClientsAPI.mockImplementation(() => pendingPromise);

      render(<TransactionForm type="Deposito" />);
      
      await waitFor(() => {
        expect(mockGetClientsAPI).toHaveBeenCalled();
      });

      await waitFor(() => {
        const selectValues = screen.getAllByTestId('select-value');
        const clienteSelectValue = selectValues.find(
          (el) => el.textContent === 'Carregando clientes...'
        );
        expect(clienteSelectValue).toBeInTheDocument();
      }, { timeout: 2000 });

      if (resolvePromise!) {
        resolvePromise!(mockClients);
      }
    });
  });
});
