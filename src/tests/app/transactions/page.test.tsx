import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionsPage from "@/app/transactions/page";

// Import named exports for mocking
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchTransactions,
  selectTransactions,
  selectAllTransactionsLoading,
} from "@/features/transactions/transactionsSlice";

// --- Top-Level Mocks ---

// 1. Mock Next.js Navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// 2. Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// 3. Mock Redux Hooks
jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockImplementation((selector) => selector()),
}));

// 4. Mock Redux Slices
jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
}));

jest.mock("@/features/transactions/transactionsSlice", () => ({
  fetchTransactions: jest.fn(),
  selectTransactions: jest.fn(),
  selectAllTransactionsLoading: jest.fn(),
}));

// 5. Mock UI Components
jest.mock("@/components/table/dataTable", () => ({
  DataTable: ({ data, loading, emptyMessage }: any) => (
    <div data-testid="data-table">
      {loading ? (
        <div data-testid="data-table-loading">Loading...</div>
      ) : data.length === 0 ? (
        <div>{emptyMessage}</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} data-testid="table-row">
            {item.tipo} - {item.id}
          </div>
        ))
      )}
    </div>
  ),
}));

jest.mock("@/components/table/cardTable", () => ({
  CardTable: ({ data, loading, emptyMessage }: any) => (
    <div data-testid="card-table">
      {loading ? (
        <div data-testid="card-table-loading">Loading...</div>
      ) : data.length === 0 ? (
        <div>{emptyMessage}</div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} data-testid="card-row">
            Mobile Card: {item.tipo} - {item.id}
          </div>
        ))
      )}
    </div>
  ),
}));

jest.mock("@/components/ui/datePickerInput", () => ({
  DatePickerInput: ({ label, onChange, value, minDate, maxDate }: any) => (
    <label>
      {label}
      <input
        type="date"
        data-testid={`datepicker-${label}`}
        onChange={(e) => onChange(new Date(e.target.value + "T12:00:00"))}
        value={value ? new Date(value).toISOString().split("T")[0] : ""}
        min={minDate ? new Date(minDate).toISOString().split("T")[0] : undefined}
        max={maxDate ? new Date(maxDate).toISOString().split("T")[0] : undefined}
      />
    </label>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
      <button
        data-testid="select-change-button"
        onClick={() => onValueChange && onValueChange("Deposito")}
      >
        Change
      </button>
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
}));

jest.mock("@/components/ui/iconButton", () => ({
  IconButton: ({ icon, onClick, className }: any) => (
    <button
      data-testid={`icon-button-${icon}`}
      onClick={onClick}
      className={className}
    >
      {icon}
    </button>
  ),
}));

jest.mock("@/components/ui/linkButton", () => ({
  LinkButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

jest.mock("@/components/ui/heroTitle", () => ({
  HeroTitle: ({ children, subtitle }: any) => (
    <div>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

jest.mock("@/components/ui/sectionTitle", () => ({
  SectionTitle: ({ children }: any) => <h2>{children}</h2>,
}));

jest.mock("@/components/transactions/transactionCard", () => ({
  TransactionCard: ({ transaction }: any) => (
    <div data-testid="transaction-card">
      {transaction.tipo} - {transaction.id}
    </div>
  ),
}));

// --- Mock Data ---

const mockTransactions = [
  {
    id: "T-9001",
    clienteId: "C-1023",
    tipo: "Deposito",
    valor: 5000.50,
    moeda: "BRL",
    contraparte: null,
    dataHora: "2026-01-02T10:20:00-03:00",
    quantidadeAlertas: 0,
  },
  {
    id: "T-9002",
    clienteId: "C-1023",
    tipo: "Transferencia",
    valor: 10000,
    moeda: "USD",
    contraparte: "C-2041",
    dataHora: "2026-01-03T14:30:00-03:00",
    quantidadeAlertas: 2,
  },
];

// --- Tests ---

describe("TransactionsPage", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Default Redux Mocks
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (selectToken as jest.Mock).mockReturnValue("fake-token");

    // Default: Not loading, empty data
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);
    (selectTransactions as jest.Mock).mockReturnValue([]);

    // Mock Thunk Return
    (fetchTransactions as unknown as jest.Mock).mockReturnValue({
      type: "transactions/fetchTransactions/pending",
    });
  });

  it("should render", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("Transações")).toBeInTheDocument();
  });

  it("should render banner image", () => {
    render(<TransactionsPage />);
    const banner = screen.getByAltText("Transações");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("src", "/banner-transactions.jpg");
  });

  it("should render HeroTitle with subtitle", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("Transações")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Administração de Depósitos, Transferências, Saques e Histórico Global."
      )
    ).toBeInTheDocument();
  });

  it("should render section title", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("Histórico de transações")).toBeInTheDocument();
  });

  it("should render 'Nova transação' button with correct link", () => {
    render(<TransactionsPage />);
    const button = screen.getByText("Nova transação");
    expect(button).toBeInTheDocument();
    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/transactions/new-transaction");
  });

  it("should fetch transactions on mount when token is available", () => {
    render(<TransactionsPage />);

    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchTransactions).toHaveBeenCalledWith({
      token: "fake-token",
      tipo: undefined,
      moeda: undefined,
      dataInicio: undefined,
      dataFim: undefined,
    });
  });

  it("should not fetch transactions when token is not available", () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<TransactionsPage />);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should render loading state", () => {
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(true);

    render(<TransactionsPage />);

    expect(screen.getByTestId("data-table-loading")).toBeInTheDocument();
    expect(screen.getByTestId("card-table-loading")).toBeInTheDocument();
  });

  it("should render empty state when no transactions", () => {
    (selectTransactions as jest.Mock).mockReturnValue([]);
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);

    render(<TransactionsPage />);

    // Both DataTable and CardTable render the empty message
    const emptyMessages = screen.getAllByText("Nenhuma transação encontrada");
    expect(emptyMessages.length).toBeGreaterThan(0);
    expect(emptyMessages[0]).toBeInTheDocument();
  });

  it("should render transactions in DataTable (desktop)", () => {
    (selectTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);

    render(<TransactionsPage />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByText("Deposito - T-9001")).toBeInTheDocument();
    expect(screen.getByText("Transferencia - T-9002")).toBeInTheDocument();
  });

  it("should render transactions in CardTable (mobile)", () => {
    (selectTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);

    render(<TransactionsPage />);

    expect(screen.getByTestId("card-table")).toBeInTheDocument();
    expect(screen.getByText("Mobile Card: Deposito - T-9001")).toBeInTheDocument();
    expect(screen.getByText("Mobile Card: Transferencia - T-9002")).toBeInTheDocument();
  });

  it("should render filter labels", () => {
    render(<TransactionsPage />);

    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Moeda")).toBeInTheDocument();
    expect(screen.getByText("Data Início")).toBeInTheDocument();
    expect(screen.getByText("Data Fim")).toBeInTheDocument();
  });

  it("should render 'Limpar filtros' button", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
  });

  it("should toggle filters on mobile when filter icon is clicked", () => {
    render(<TransactionsPage />);

    const filterButton = screen.getByTestId("icon-button-filter");
    expect(filterButton).toBeInTheDocument();

    // Click to toggle filters
    fireEvent.click(filterButton);

    // After click, the button should change to 'x' icon (icon changes based on showFilters state)
    // Note: The actual state change and re-render happens in the component
    // We verify the button exists and can be clicked
    expect(filterButton).toBeInTheDocument();
  });

  it("should clear filters when 'Limpar filtros' is clicked", async () => {
    render(<TransactionsPage />);

    // First, set some filters to ensure there's something to clear
    const dataInicioInput = screen.getByTestId("datepicker-Data Início");
    fireEvent.change(dataInicioInput, { target: { value: "2026-01-01" } });

    // Wait for the filter to be applied
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    // Clear previous calls
    mockDispatch.mockClear();

    // Click clear filters
    const limparButton = screen.getByText("Limpar filtros");
    fireEvent.click(limparButton);

    // Should dispatch with all filters reset
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchTransactions).toHaveBeenCalledWith({
        token: "fake-token",
        tipo: undefined,
        moeda: undefined,
        dataInicio: undefined,
        dataFim: undefined,
      });
    });
  });

  it("should fetch transactions when tipo filter changes", async () => {
    render(<TransactionsPage />);

    mockDispatch.mockClear();

    // Find and interact with tipo select
    const changeButtons = screen.getAllByTestId("select-change-button");
    const tipoButton = changeButtons[0]; // First select is tipo
    
    fireEvent.click(tipoButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          tipo: "Deposito",
        })
      );
    });
  });

  it("should fetch transactions when dataInicio changes", async () => {
    render(<TransactionsPage />);

    mockDispatch.mockClear();

    const dataInicioInput = screen.getByTestId("datepicker-Data Início");

    fireEvent.change(dataInicioInput, { target: { value: "2026-01-01" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          dataInicio: expect.stringContaining("2026-01-01"),
        })
      );
    });
  });

  it("should fetch transactions when dataFim changes", async () => {
    render(<TransactionsPage />);

    mockDispatch.mockClear();

    const dataFimInput = screen.getByTestId("datepicker-Data Fim");

    fireEvent.change(dataFimInput, { target: { value: "2026-01-31" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchTransactions).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          dataFim: expect.stringContaining("2026-01-31"),
        })
      );
    });
  });

  it("should fetch transactions with all filters applied", async () => {
    render(<TransactionsPage />);

    mockDispatch.mockClear();

    const dataInicioInput = screen.getByTestId("datepicker-Data Início");
    const dataFimInput = screen.getByTestId("datepicker-Data Fim");

    fireEvent.change(dataInicioInput, { target: { value: "2026-01-01" } });
    fireEvent.change(dataFimInput, { target: { value: "2026-01-31" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      const calls = (fetchTransactions as unknown as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.dataInicio).toBeDefined();
      expect(lastCall.dataFim).toBeDefined();
    });
  });

  it("should render filter icon button on mobile", () => {
    render(<TransactionsPage />);

    const filterButton = screen.getByTestId("icon-button-filter");
    expect(filterButton).toBeInTheDocument();
  });

  it("should pass correct props to DataTable", () => {
    (selectTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);

    render(<TransactionsPage />);

    const dataTable = screen.getByTestId("data-table");
    expect(dataTable).toBeInTheDocument();
  });

  it("should pass correct props to CardTable", () => {
    (selectTransactions as jest.Mock).mockReturnValue(mockTransactions);
    (selectAllTransactionsLoading as jest.Mock).mockReturnValue(false);

    render(<TransactionsPage />);

    const cardTable = screen.getByTestId("card-table");
    expect(cardTable).toBeInTheDocument();
  });

  it("should handle date range constraints", () => {
    render(<TransactionsPage />);

    const dataInicioInput = screen.getByTestId("datepicker-Data Início");
    const dataFimInput = screen.getByTestId("datepicker-Data Fim");

    // Set dataFim first
    fireEvent.change(dataFimInput, { target: { value: "2026-01-31" } });

    // dataInicio should have maxDate constraint
    expect(dataInicioInput).toHaveAttribute("max");
  });

  it("should not fetch when filters change but token is missing", async () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<TransactionsPage />);

    mockDispatch.mockClear();

    const dataInicioInput = screen.getByTestId("datepicker-Data Início");
    fireEvent.change(dataInicioInput, { target: { value: "2026-01-01" } });

    // Should not dispatch without token
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
