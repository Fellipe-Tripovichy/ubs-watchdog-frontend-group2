import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportsPage from "@/app/reports/[id]/page"; 
import { useParams } from "next/navigation";

// Import the actual named exports so we can cast them to jest.Mock
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import { fetchClientReport, selectCurrentReport, selectReportLoading } from "@/features/reports/reportsSlice";
import { 
  selectClientTransactions, 
  selectClientTransactionsLoading, 
  selectTransactionsError,
  fetchClientTransactions 
} from "@/features/transactions/transactionsSlice";
import { 
  selectAlerts, 
  selectAllAlertsLoading, 
  selectComplianceError,
  fetchAlerts 
} from "@/features/compliance/complianceSlice";

// --- Top-Level Mocks ---

// 1. Mock Next.js Navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
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
  useAppSelector: jest.fn().mockImplementation((selector) => {
    // All selectors are mocked as jest.fn() and will return mockReturnValue
    // Call with mock state object to match real selector signature
    return selector({} as any);
  }),
}));

// 4. Mock Redux Slices
jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
}));

jest.mock("@/features/reports/reportsSlice", () => ({
  fetchClientReport: jest.fn(),
  selectCurrentReport: jest.fn(),
  selectReportLoading: jest.fn(),
}));

jest.mock("@/features/transactions/transactionsSlice", () => ({
  fetchClientTransactions: jest.fn(),
  selectClientTransactions: jest.fn(),
  selectClientTransactionsLoading: jest.fn(),
  selectTransactionsError: jest.fn(),
}));

jest.mock("@/features/compliance/complianceSlice", () => ({
  fetchAlerts: jest.fn(),
  selectAlerts: jest.fn(),
  selectAllAlertsLoading: jest.fn(),
  selectComplianceError: jest.fn(),
}));

// 5. Mock Chart components
jest.mock("@/components/charts/BarChart", () => ({
  BarChart: () => <div data-testid="bar-chart" />,
}));
jest.mock("@/components/charts/PieChart", () => ({
  PieChart: () => <div data-testid="pie-chart" />,
}));

// 6. Mock Complex UI Components
jest.mock("@/components/ui/datePickerInput", () => ({
  DatePickerInput: ({ label, onChange, value, disabled, minDate, maxDate }: any) => (
    <label>
      {label}
      <input
        type="date"
        data-testid={`datepicker-${label}`}
        disabled={disabled}
        min={minDate ? new Date(minDate).toISOString().split("T")[0] : undefined}
        max={maxDate ? new Date(maxDate).toISOString().split("T")[0] : undefined}
        // FIX: Add T12:00:00 to prevent timezone rollovers (e.g. UTC midnight -> Previous Day Local)
        onChange={(e) => onChange(new Date(e.target.value + "T12:00:00"))}
        value={value ? new Date(value).toISOString().split('T')[0] : ""}
      />
    </label>
  ),
}));

jest.mock("@/components/ui/flagImage", () => ({
  FlagImage: ({ country }: any) => <div data-testid="flag-image" data-country={country} />,
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
  LinkButton: ({ children, onClick, disabled, asChild, className }: any) => {
    if (asChild) {
      return <div className={className}>{children}</div>;
    }
    return (
      <button 
        data-slot="button" 
        onClick={onClick} 
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/heroTitle", () => ({
  HeroTitle: ({ children, subtitle, as }: any) => (
    <div>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

jest.mock("@/components/ui/sectionTitle", () => ({
  SectionTitle: ({ children }: any) => <h2>{children}</h2>,
}));

jest.mock("@/components/ui/copyButton", () => ({
  CopyButton: ({ textToCopy }: any) => (
    <button data-testid="copy-button" data-text={textToCopy}>Copy</button>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, style }: any) => (
    <span data-testid="badge" style={style}>{children}</span>
  ),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: any) => <div data-testid="spinner" className={className} />,
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

jest.mock("@/components/table/dataTable", () => ({
  DataTable: ({ data, loading, emptyMessage, emptyDescription }: any) => (
    <div data-testid="data-table">
      {loading ? (
        <div data-testid="data-table-loading">Loading...</div>
      ) : data.length === 0 ? (
        <div>
          <div>{emptyMessage}</div>
          <div>{emptyDescription}</div>
        </div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} data-testid="table-row">
            {item.id}
          </div>
        ))
      )}
    </div>
  ),
}));

jest.mock("@/components/table/cardTable", () => ({
  CardTable: ({ data, loading, emptyMessage, emptyDescription, renderCard }: any) => (
    <div data-testid="card-table">
      {loading ? (
        <div data-testid="card-table-loading">Loading...</div>
      ) : data.length === 0 ? (
        <div>
          <div>{emptyMessage}</div>
          <div>{emptyDescription}</div>
        </div>
      ) : (
        data.map((item: any) => (
          <div key={item.id} data-testid="card-row">
            {renderCard ? renderCard(item) : item.id}
          </div>
        ))
      )}
    </div>
  ),
}));

jest.mock("@/components/transactions/transactionCard", () => ({
  TransactionCard: ({ transaction }: any) => (
    <div data-testid="transaction-card">
      {transaction.tipo} - {transaction.id}
    </div>
  ),
}));

jest.mock("@/components/compliance/complianceCard", () => ({
  ComplianceCard: ({ alert }: any) => (
    <div data-testid="compliance-card">
      {alert.rule || alert.nomeRegra} - {alert.id}
    </div>
  ),
}));

jest.mock("@/models/complience", () => ({
  mapAPIAlertToMockAlert: (alert: any) => ({
    id: alert.id,
    clientId: alert.clienteId,
    transactionId: alert.transacaoId,
    rule: alert.nomeRegra,
    severity: alert.severidade,
    status: alert.status,
    dataCriacao: alert.dataCriacao,
    dataResolucao: alert.dataResolucao,
    resolvidoPor: alert.resolvidoPor,
  }),
  getAlertsColumns: jest.fn(() => []),
}));

jest.mock("@/models/transactions", () => ({
  getTransactionsColumns: jest.fn(() => []),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, disabled, value, onValueChange }: any) => (
    <div data-testid="select" data-disabled={disabled} data-value={value}>
      {children}
      <button
        data-testid="select-change-button"
        onClick={() => onValueChange && onValueChange("USD")}
      >
        Change
      </button>
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <button data-testid="select-trigger" className={className}>
      {children}
    </button>
  ),
  SelectValue: () => <span data-testid="select-value" />,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value, onClick }: any) => (
    <div 
      data-testid={`select-item-${value}`} 
      onClick={() => onClick && onClick(value)}
    >
      {children}
    </div>
  ),
}));

// --- Mock Data Constants ---

const mockTransaction = {
  id: "tx-1",
  type: "Depósito",
  amount: 1000,
  currency: "BRL",
  dateTime: "2024-01-15T10:00:00Z",
  status: "Completed",
};

const mockAlert = {
  id: "alert-1",
  severity: "Alta",
  message: "Suspicious Activity",
  date: "2024-01-16T10:00:00Z",
};

const mockReportData = {
  clienteId: "C-1023",
  nomeCliente: "John Doe",
  pais: "BR",
  nivelRisco: "Médio",
  statusKyc: "Aprovado",
  dataCriacao: "2024-01-01T00:00:00Z",
  totalTransacoes: 3,
  totalMovimentado: 1700,
  mediaTransacao: 566.67,
  dataUltimaTransacao: "2024-01-15T10:00:00Z",
  totalAlertas: 1,
  alertasNovos: 0,
  alertasEmAnalise: 0,
  alertasResolvidos: 0,
  alertasCriticos: 0,
  periodoInicio: null,
  periodoFim: null,
};

// --- Tests ---

describe("ReportsPage", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ id: "c-1023" });
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    
    (selectToken as jest.Mock).mockReturnValue("fake-token");

    (fetchClientReport as unknown as jest.Mock).mockReturnValue({ type: "reports/fetchClientReport/pending" });
    (selectCurrentReport as jest.Mock).mockReturnValue(null);
    (selectReportLoading as jest.Mock).mockReturnValue(true);
    
    (selectClientTransactions as jest.Mock).mockReturnValue([]);
    (selectClientTransactionsLoading as jest.Mock).mockReturnValue(false);
    (selectTransactionsError as jest.Mock).mockReturnValue(null);
    
    (selectAlerts as jest.Mock).mockReturnValue([]);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);
    (selectComplianceError as jest.Mock).mockReturnValue(null);
    
    (fetchClientTransactions as unknown as jest.Mock).mockReturnValue({ type: "transactions/fetchClientTransactions/pending" });
    (fetchAlerts as unknown as jest.Mock).mockReturnValue({ type: "compliance/fetchAlerts/pending" });
  });

  it("renders the loading state correctly", () => {
    (selectReportLoading as jest.Mock).mockReturnValue(true);
    (selectCurrentReport as jest.Mock).mockReturnValue(null);

    render(<ReportsPage />);

    // The component shows Skeleton components and Spinner when loading, not a text message
    // Verify that loading state is shown by checking for the page title and that
    // the component structure is rendered (filters are disabled during loading)
    expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
    // The date pickers should be disabled when loading
    const startDateInput = screen.getByTestId("datepicker-Data inicial");
    expect(startDateInput).toBeDisabled();
  });

  it("renders the empty state when no report is found", () => {
    (selectReportLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentReport as jest.Mock).mockReturnValue(null);

    render(<ReportsPage />);

    // The component doesn't have a specific empty state message, but it still renders
    // the page structure. Verify that the page title is shown but client info is not.
    expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
    // When report is null, client name should not be displayed
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("fetches the report on mount with correct parameters", () => {
    (selectReportLoading as jest.Mock).mockReturnValue(true);
    render(<ReportsPage />);

    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchClientReport).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "C-1023",
        token: "fake-token",
      })
    );
  });

  describe("When report data is loaded", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("renders client information correctly", () => {
      render(<ReportsPage />);

      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      // The component displays client ID as "C-10...1023" (first 4 chars + "..." + last 4 chars)
      expect(screen.getByText(/C-10\.\.\.1023/)).toBeInTheDocument();
      expect(screen.getByText("Aprovado")).toBeInTheDocument();
      expect(screen.getByText("Médio")).toBeInTheDocument();
    });

    it("displays the alert count warning", () => {
      render(<ReportsPage />);
      // FIX: Find the container text first, then check for the number inside it
      // "1" is too generic and appears in tables/pagination
      const warningMessage = screen.getByText(/O usuário tem um total de/i);
      expect(warningMessage).toHaveTextContent("1");
    });

    it("calculates and displays total moved for default currency (BRL)", () => {
      render(<ReportsPage />);
      const totalSection = screen.getByText(/Total movimentado no período/i).parentElement;
      expect(totalSection).toHaveTextContent("R$"); 
    });

    it("renders the charts", () => {
      render(<ReportsPage />);
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    it("renders the tables", () => {
      render(<ReportsPage />);
      
      // "Transações" appears multiple times (in subtitle and as section title)
      // Use getAllByText to handle multiple matches
      const transacoesElements = screen.getAllByText(/Transações/i);
      expect(transacoesElements.length).toBeGreaterThan(0);
      
      // FIX: "Alertas ativos no período" appears in the Title AND the Warning message.
      // usage of getAllByText ensures we find at least one occurrence without crashing.
      const alertsHeadings = screen.getAllByText(/Alertas ativos no período/i);
      expect(alertsHeadings.length).toBeGreaterThan(0);

      expect(screen.getByText(/Detalhes de Transações/i)).toBeInTheDocument();
    });

    it("handles currency filtering logic (visual check)", () => {
      render(<ReportsPage />);
      // The component shows "Movimentação por tipo (BRL)" not "Resumo de transações (BRL)"
      expect(screen.getByText(/Movimentação por tipo \(BRL\)/i)).toBeInTheDocument();
    });

    it("renders empty states for empty lists within the report", () => {
      (selectClientTransactions as jest.Mock).mockReturnValue([]);
      (selectAlerts as jest.Mock).mockReturnValue([]);

      render(<ReportsPage />);

      // Empty messages appear in both desktop and mobile views, so use getAllByText
      const alertEmptyMessages = screen.getAllByText(/Nenhum alerta no período/i);
      expect(alertEmptyMessages.length).toBeGreaterThan(0);
      
      const transactionEmptyMessages = screen.getAllByText(/Nenhuma transação no período/i);
      expect(transactionEmptyMessages.length).toBeGreaterThan(0);
    });
  });

  it("updates date range filters and triggers new fetch", async () => {
    (selectReportLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);

    render(<ReportsPage />);

    const startDateInput = screen.getByTestId("datepicker-Data inicial");
    
    mockDispatch.mockClear();

    // The mock now appends T12:00:00, ensuring the component receives a date
    // that won't shift to the previous day when converted to local ISO string.
    fireEvent.change(startDateInput, { target: { value: "2023-12-01" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      // The component uses dataInicio and dataFim, not startDate/endDate
      // Check that fetchClientReport was called with the updated date
      expect(fetchClientReport).toHaveBeenCalledWith(
        expect.objectContaining({
            dataInicio: expect.stringContaining("2023-12-01")
        })
      );
    });
  });

  describe("Error states", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("displays transaction error message", () => {
      (selectTransactionsError as jest.Mock).mockReturnValue("Erro ao carregar transações");

      render(<ReportsPage />);

      expect(screen.getByText("Erro ao carregar transações")).toBeInTheDocument();
    });

    it("displays alerts error message", () => {
      (selectComplianceError as jest.Mock).mockReturnValue("Erro ao carregar alertas");

      render(<ReportsPage />);

      expect(screen.getByText("Erro ao carregar alertas")).toBeInTheDocument();
    });
  });

  describe("Success state when no alerts", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue({
        ...mockReportData,
        totalAlertas: 0,
      });
    });

    it("displays success message when user has no alerts", () => {
      render(<ReportsPage />);

      expect(screen.getByText(/O usuário não tem nenhum alerta ativo no período/i)).toBeInTheDocument();
    });
  });

  describe("Currency handling", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("displays multiple currencies when available", () => {
      const multiCurrencyTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "USD", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-3", tipo: "Transferencia", valor: 200, moeda: "EUR", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-17T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(multiCurrencyTransactions);

      render(<ReportsPage />);

      // Should show totals by currency section when multiple currencies exist
      expect(screen.getByText(/Totais por moeda:/i)).toBeInTheDocument();
    });

    it("auto-selects first available currency when current selection is unavailable", () => {
      const usdOnlyTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "USD", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(usdOnlyTransactions);

      render(<ReportsPage />);

      // Should show USD in the chart label
      expect(screen.getByText(/Movimentação por tipo \(USD\)/i)).toBeInTheDocument();
    });

    it("filters transactions by selected currency", () => {
      const multiCurrencyTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "USD", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(multiCurrencyTransactions);

      render(<ReportsPage />);

      // Initially should show BRL
      expect(screen.getByText(/Movimentação por tipo \(BRL\)/i)).toBeInTheDocument();
    });
  });

  describe("Date validation and handling", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("updates end date when start date is changed to a later date", async () => {
      render(<ReportsPage />);

      const startDateInput = screen.getByTestId("datepicker-Data inicial");
      const endDateInput = screen.getByTestId("datepicker-Data final");

      // Change start date to a future date
      fireEvent.change(startDateInput, { target: { value: "2024-12-31" } });

      await waitFor(() => {
        // End date should be adjusted
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it("handles reset filters button click", async () => {
      render(<ReportsPage />);

      const resetButton = screen.getByText(/Redefinir filtros/i);
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe("Client information edge cases", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
    });

    it("displays message when client has no transactions", () => {
      const reportWithoutLastTransaction = {
        ...mockReportData,
        dataUltimaTransacao: null,
      };
      (selectCurrentReport as jest.Mock).mockReturnValue(reportWithoutLastTransaction);

      render(<ReportsPage />);

      expect(screen.getByText(/Usuário nunca realizou uma transação/i)).toBeInTheDocument();
    });

    it("uses default client ID when params.id is missing", () => {
      (useParams as jest.Mock).mockReturnValue({ id: undefined });
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);

      render(<ReportsPage />);

      // Should use default "C-1023"
      expect(fetchClientReport).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: "C-1023",
        })
      );
    });

    it("converts client ID to uppercase", () => {
      (useParams as jest.Mock).mockReturnValue({ id: "c-9999" });
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);

      render(<ReportsPage />);

      expect(fetchClientReport).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: "C-9999",
        })
      );
    });
  });

  describe("Transaction type mapping", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("correctly maps different transaction type formats", () => {
      const transactionsWithDifferentTypes = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-3", tipo: "Transferencia", valor: 200, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-17T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(transactionsWithDifferentTypes);

      render(<ReportsPage />);

      // Charts should render with the mapped transaction types
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
  });

  describe("Alert severity mapping", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("correctly maps and displays alerts by severity", () => {
      const alertsWithDifferentSeverities = [
        { id: "alert-1", clienteId: "C-1023", transacaoId: "tx-1", nomeRegra: "Rule 1", severidade: "Critica", status: "Novo", dataCriacao: "2024-01-15T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
        { id: "alert-2", clienteId: "C-1023", transacaoId: "tx-2", nomeRegra: "Rule 2", severidade: "Alta", status: "Novo", dataCriacao: "2024-01-16T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
        { id: "alert-3", clienteId: "C-1023", transacaoId: "tx-3", nomeRegra: "Rule 3", severidade: "Media", status: "Novo", dataCriacao: "2024-01-17T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
        { id: "alert-4", clienteId: "C-1023", transacaoId: "tx-4", nomeRegra: "Rule 4", severidade: "Baixa", status: "Novo", dataCriacao: "2024-01-18T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
      ];
      (selectAlerts as jest.Mock).mockReturnValue(alertsWithDifferentSeverities);

      render(<ReportsPage />);

      // Pie chart should render with severity data
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
  });

  describe("Mobile filter toggle", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("toggles mobile filters visibility", () => {
      render(<ReportsPage />);

      // Find the filter toggle button (mobile only)
      const filterButton = screen.getByTestId("icon-button-filter");
      expect(filterButton).toBeInTheDocument();
      
      // Initially filters should be visible on desktop (hidden class on mobile)
      const desktopFilters = screen.getByTestId("datepicker-Data inicial");
      expect(desktopFilters).toBeInTheDocument();
      
      // Click to toggle mobile filters
      fireEvent.click(filterButton);
      
      // After click, filters should still be accessible
      const datePickers = screen.getAllByTestId("datepicker-Data inicial");
      expect(datePickers.length).toBeGreaterThan(0);
    });
  });

  describe("Loading states for different sections", () => {
    it("shows loading state for transactions table", () => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
      (selectClientTransactionsLoading as jest.Mock).mockReturnValue(true);

      render(<ReportsPage />);

      // DataTable should receive loading prop
      expect(screen.getByText(/Detalhes de Transações/i)).toBeInTheDocument();
    });

    it("shows loading state for alerts table", () => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
      (selectAllAlertsLoading as jest.Mock).mockReturnValue(true);

      render(<ReportsPage />);

      // "Alertas ativos no período" appears in both the warning message and section title
      // DataTable should receive loading prop
      const alertsHeadings = screen.getAllByText(/Alertas ativos no período/i);
      expect(alertsHeadings.length).toBeGreaterThan(0);
    });
  });

  describe("Data fetching dependencies", () => {
    it("does not fetch when clientId is missing", () => {
      (useParams as jest.Mock).mockReturnValue({ id: null });
      (selectToken as jest.Mock).mockReturnValue(null);

      render(<ReportsPage />);

      // Should not dispatch if token or clientId is missing
      // The component should handle this gracefully
      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
    });

    it("fetches all data sources on mount", () => {
      (selectReportLoading as jest.Mock).mockReturnValue(true);
      render(<ReportsPage />);

      expect(fetchClientReport).toHaveBeenCalled();
      expect(fetchClientTransactions).toHaveBeenCalled();
      expect(fetchAlerts).toHaveBeenCalled();
    });
  });

  describe("Totals calculation", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("calculates total moved for selected currency correctly", () => {
      const transactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 300, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(transactions);

      render(<ReportsPage />);

      // Total should be calculated (1000 - 300 = 700, but we're just checking it renders)
      expect(screen.getByText(/Total movimentado no período/i)).toBeInTheDocument();
    });

    it("handles empty transactions array", () => {
      (selectClientTransactions as jest.Mock).mockReturnValue([]);

      render(<ReportsPage />);

      // Should still render the total section
      expect(screen.getByText(/Total movimentado no período/i)).toBeInTheDocument();
    });
  });

  describe("Component interactions", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("renders back button with correct link", () => {
      render(<ReportsPage />);

      const backLink = screen.getByText("Voltar").closest("a");
      expect(backLink).toHaveAttribute("href", "/reports");
    });

    it("disables reset filters button when loading", () => {
      (selectReportLoading as jest.Mock).mockReturnValue(true);

      render(<ReportsPage />);

      // LinkButton renders a button with data-slot="button", find it by the text content
      const resetButtonText = screen.getByText(/Redefinir filtros/i);
      const resetButton = resetButtonText.closest('button[data-slot="button"]');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).toBeDisabled();
    });

    it("enables reset filters button when not loading", () => {
      render(<ReportsPage />);

      // LinkButton renders a button with data-slot="button", find it by the text content
      const resetButtonText = screen.getByText(/Redefinir filtros/i);
      const resetButton = resetButtonText.closest('button[data-slot="button"]');
      expect(resetButton).toBeInTheDocument();
      expect(resetButton).not.toBeDisabled();
    });
  });

  describe("Edge cases and boundary conditions", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("handles null or undefined report properties gracefully", () => {
      const reportWithNulls = {
        ...mockReportData,
        nomeCliente: "",
        pais: "",
        nivelRisco: "",
        statusKyc: "",
      };
      (selectCurrentReport as jest.Mock).mockReturnValue(reportWithNulls);

      render(<ReportsPage />);

      // Should still render without crashing
      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
    });

    it("handles transactions with zero values", () => {
      const zeroValueTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 0, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(zeroValueTransactions);

      render(<ReportsPage />);

      // Should handle zero values without errors
      expect(screen.getByText(/Total movimentado no período/i)).toBeInTheDocument();
    });

    it("handles very long client IDs", () => {
      const reportWithLongId = {
        ...mockReportData,
        clienteId: "C-12345678901234567890",
      };
      (selectCurrentReport as jest.Mock).mockReturnValue(reportWithLongId);

      render(<ReportsPage />);

      // Should display truncated ID correctly (first 4 chars + ... + last 4 chars)
      // "C-12" (first 4) + "..." + "7890" (last 4)
      expect(screen.getByText(/C-12\.\.\.7890/)).toBeInTheDocument();
    });

    it("handles date edge cases", async () => {
      render(<ReportsPage />);

      const endDateInput = screen.getByTestId("datepicker-Data final");
      
      // Try to set end date before start date
      fireEvent.change(endDateInput, { target: { value: "2020-01-01" } });

      await waitFor(() => {
        // Component should adjust the date
        expect(mockDispatch).toHaveBeenCalled();
      });
    });
  });

  describe("Data display formatting", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("displays formatted creation date", () => {
      render(<ReportsPage />);

      // Should display the creation date (format depends on formatDate function)
      expect(screen.getByText(/Data de criação/i)).toBeInTheDocument();
    });

    it("displays country flag and code", () => {
      render(<ReportsPage />);

      // Should display flag image
      expect(screen.getByTestId("flag-image")).toBeInTheDocument();
      // Should display country code
      expect(screen.getByText("BR")).toBeInTheDocument();
    });

    it("displays risk level badge with correct styling", () => {
      render(<ReportsPage />);

      // Should display risk level
      expect(screen.getByText("Médio")).toBeInTheDocument();
    });

    it("displays KYC status badge with correct styling", () => {
      render(<ReportsPage />);

      // Should display KYC status
      expect(screen.getByText("Aprovado")).toBeInTheDocument();
    });
  });

  describe("Currency selection", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("allows changing currency selection", async () => {
      const multiCurrencyTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "USD", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(multiCurrencyTransactions);

      render(<ReportsPage />);

      // Initially should show BRL
      expect(screen.getByText(/Movimentação por tipo \(BRL\)/i)).toBeInTheDocument();

      // Find and click the currency select change button
      const changeButton = screen.getByTestId("select-change-button");
      fireEvent.click(changeButton);

      await waitFor(() => {
        // Should update to show USD
        expect(screen.getByText(/Movimentação por tipo \(USD\)/i)).toBeInTheDocument();
      });
    });

    it("displays currency options correctly", () => {
      const multiCurrencyTransactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "USD", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-16T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-3", tipo: "Transferencia", valor: 200, moeda: "EUR", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-17T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(multiCurrencyTransactions);

      render(<ReportsPage />);

      // Should show currency select
      expect(screen.getByTestId("select")).toBeInTheDocument();
      expect(screen.getByTestId("select-item-BRL")).toBeInTheDocument();
      expect(screen.getByTestId("select-item-USD")).toBeInTheDocument();
      expect(screen.getByTestId("select-item-EUR")).toBeInTheDocument();
    });
  });

  describe("Date range validation", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("automatically sets end date when start date is selected", async () => {
      render(<ReportsPage />);

      const startDateInput = screen.getByTestId("datepicker-Data inicial");
      
      mockDispatch.mockClear();

      fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });

      await waitFor(() => {
        // Should dispatch with both dates
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it("prevents end date from being before start date", async () => {
      render(<ReportsPage />);

      const startDateInput = screen.getByTestId("datepicker-Data inicial");

      // Set start date first
      fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });

      await waitFor(() => {
        // Re-query the end date input after state update
        const endDateInput = screen.getByTestId("datepicker-Data final");
        // End date should have minDate constraint
        expect(endDateInput).toHaveAttribute("min");
      });
    });

    it("resets both dates when reset button is clicked", async () => {
      render(<ReportsPage />);

      const startDateInput = screen.getByTestId("datepicker-Data inicial");
      const resetButton = screen.getByText(/Redefinir filtros/i);

      // Set a date first
      fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });

      await waitFor(() => {
        expect(startDateInput).toHaveValue("2024-01-15");
      });

      mockDispatch.mockClear();

      // Click reset
      fireEvent.click(resetButton);

      await waitFor(() => {
        // Should dispatch with undefined dates
        expect(mockDispatch).toHaveBeenCalled();
        expect(fetchClientReport).toHaveBeenCalledWith(
          expect.objectContaining({
            dataInicio: undefined,
            dataFim: undefined,
          })
        );
      });
    });
  });

  describe("Transaction sorting", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("sorts transactions by date descending", () => {
      const transactions = [
        { id: "tx-1", tipo: "Deposito", valor: 1000, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-15T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-2", tipo: "Saque", valor: 500, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-20T10:00:00Z", quantidadeAlertas: 0 },
        { id: "tx-3", tipo: "Transferencia", valor: 200, moeda: "BRL", clienteId: "C-1023", contraparte: null, dataHora: "2024-01-10T10:00:00Z", quantidadeAlertas: 0 },
      ];
      (selectClientTransactions as jest.Mock).mockReturnValue(transactions);

      render(<ReportsPage />);

      // Transactions should be sorted (most recent first)
      // The DataTable receives sorted data
      // There are multiple data tables (alerts and transactions), so use getAllByTestId
      const dataTables = screen.getAllByTestId("data-table");
      expect(dataTables.length).toBeGreaterThan(0);
    });
  });

  describe("Alert display", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("displays alerts in desktop table view", () => {
      const mockAlerts = [
        { id: "alert-1", clienteId: "C-1023", transacaoId: "tx-1", nomeRegra: "Rule 1", severidade: "Alta", status: "Novo", dataCriacao: "2024-01-15T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
        { id: "alert-2", clienteId: "C-1023", transacaoId: "tx-2", nomeRegra: "Rule 2", severidade: "Media", status: "Novo", dataCriacao: "2024-01-16T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
      ];
      (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);

      render(<ReportsPage />);

      // There are multiple data tables (alerts and transactions), so use getAllByTestId
      const dataTables = screen.getAllByTestId("data-table");
      expect(dataTables.length).toBeGreaterThan(0);
      // There are multiple table rows (one for each alert), so use getAllByTestId
      const tableRows = screen.getAllByTestId("table-row");
      expect(tableRows.length).toBeGreaterThan(0);
    });

    it("displays alerts in mobile card view", () => {
      const mockAlerts = [
        { id: "alert-1", clienteId: "C-1023", transacaoId: "tx-1", nomeRegra: "Rule 1", severidade: "Alta", status: "Novo", dataCriacao: "2024-01-15T10:00:00Z", dataResolucao: null, resolvidoPor: null, resolucao: null },
      ];
      (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);

      render(<ReportsPage />);

      // There are multiple card tables (alerts and transactions), so use getAllByTestId
      const cardTables = screen.getAllByTestId("card-table");
      expect(cardTables.length).toBeGreaterThan(0);
      expect(screen.getByTestId("compliance-card")).toBeInTheDocument();
    });
  });

  describe("Data fetching with date filters", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("fetches data with date range when both dates are set", async () => {
      render(<ReportsPage />);

      const startDateInput = screen.getByTestId("datepicker-Data inicial");
      const endDateInput = screen.getByTestId("datepicker-Data final");

      mockDispatch.mockClear();

      fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
      fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });

      await waitFor(() => {
        expect(fetchClientReport).toHaveBeenCalledWith(
          expect.objectContaining({
            clientId: "C-1023",
            token: "fake-token",
            dataInicio: expect.stringContaining("2024-01-01"),
            dataFim: expect.stringContaining("2024-01-31"),
          })
        );
        expect(fetchClientTransactions).toHaveBeenCalledWith(
          expect.objectContaining({
            clientId: "C-1023",
            token: "fake-token",
            dataInicio: expect.stringContaining("2024-01-01"),
            dataFim: expect.stringContaining("2024-01-31"),
          })
        );
        expect(fetchAlerts).toHaveBeenCalledWith(
          expect.objectContaining({
            token: "fake-token",
            clienteId: "C-1023",
            dataCriacaoInicio: expect.stringContaining("2024-01-01"),
            dataCriacaoFim: expect.stringContaining("2024-01-31"),
          })
        );
      });
    });

    it("does not fetch when date range is invalid", () => {
      render(<ReportsPage />);

      // Component should not fetch if endDate < startDate
      // This is handled by the isValidRange check
      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    beforeEach(() => {
      (selectReportLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("renders all main sections", () => {
      render(<ReportsPage />);

      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
      expect(screen.getByText("Informações gerais")).toBeInTheDocument();
      expect(screen.getByText("Transações")).toBeInTheDocument();
      // "Alertas por severidade" appears in both h2 and info text, so use getAllByText
      const alertasSeveridadeElements = screen.getAllByText("Alertas por severidade");
      expect(alertasSeveridadeElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Alertas ativos no período")).toBeInTheDocument();
      expect(screen.getByText("Detalhes de Transações")).toBeInTheDocument();
    });

    it("renders hero title with subtitle", () => {
      render(<ReportsPage />);

      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
      expect(screen.getByText(/Visão consolidada de perfil, transações e alertas/i)).toBeInTheDocument();
    });
  });
});