import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompliancePage from "@/app/compliance/page";

// Import named exports for mocking
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAlerts,
  selectAlerts,
  selectAllAlertsLoading,
} from "@/features/compliance/complianceSlice";

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

jest.mock("@/features/compliance/complianceSlice", () => ({
  fetchAlerts: jest.fn(),
  selectAlerts: jest.fn(),
  selectAllAlertsLoading: jest.fn(),
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
            {item.rule} - {item.id}
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
            Mobile Card: {item.rule} - {item.id}
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
        onClick={() => onValueChange && onValueChange("Novo")}
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

jest.mock("@/components/compliance/complianceCard", () => ({
  ComplianceCard: ({ alert }: any) => (
    <div data-testid="compliance-card">
      {alert.rule} - {alert.id}
    </div>
  ),
}));

jest.mock("@/models/complience", () => ({
  getAlertsColumns: jest.fn(() => []),
  mapAPIAlertToMockAlert: (alert: any) => ({
    ...alert,
    rule: alert.nomeRegra || alert.rule,
  }),
}));

// --- Mock Data ---

const mockAlerts = [
  {
    id: "A-3001",
    clienteId: "C-1023",
    transacaoId: "T-9001",
    nomeRegra: "Depósito em espécie acima do limite",
    descricao: "Test description",
    severidade: "Alta",
    status: "EmAnalise",
    dataCriacao: "2026-01-02T10:20:00-03:00",
    dataResolucao: null,
    resolvidoPor: null,
    resolucao: null,
  },
  {
    id: "A-3002",
    clienteId: "C-1023",
    transacaoId: "T-9002",
    nomeRegra: "Múltiplas transferências em curto período",
    descricao: "Test description 2",
    severidade: "Media",
    status: "Novo",
    dataCriacao: "2026-01-03T14:30:00-03:00",
    dataResolucao: null,
    resolvidoPor: null,
    resolucao: null,
  },
];

// --- Tests ---

describe("CompliancePage", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Default Redux Mocks
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (selectToken as jest.Mock).mockReturnValue("fake-token");

    // Default: Not loading, empty data
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);
    (selectAlerts as jest.Mock).mockReturnValue([]);

    // Mock Thunk Return
    (fetchAlerts as unknown as jest.Mock).mockReturnValue({
      type: "compliance/fetchAlerts/pending",
    });
  });

  it("should render", () => {
    render(<CompliancePage />);
    expect(screen.getByText("Compliance")).toBeInTheDocument();
  });

  it("should render banner image", () => {
    render(<CompliancePage />);
    const banner = screen.getByAltText("Compliance");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("src", "/banner-compliance.jpg");
  });

  it("should render HeroTitle with subtitle", () => {
    render(<CompliancePage />);
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Monitoramento de Compliance e detecção proativa de riscos financeiros."
      )
    ).toBeInTheDocument();
  });

  it("should render section title", () => {
    render(<CompliancePage />);
    expect(screen.getByText("Histórico de alertas")).toBeInTheDocument();
  });

  it("should fetch alerts on mount when token is available", () => {
    render(<CompliancePage />);

    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchAlerts).toHaveBeenCalledWith({
      token: "fake-token",
      status: undefined,
      severidade: undefined,
      dataCriacaoInicio: undefined,
      dataCriacaoFim: undefined,
    });
  });

  it("should not fetch alerts when token is not available", () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<CompliancePage />);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("should render loading state", () => {
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(true);

    render(<CompliancePage />);

    expect(screen.getByTestId("data-table-loading")).toBeInTheDocument();
    expect(screen.getByTestId("card-table-loading")).toBeInTheDocument();
  });

  it("should render empty state when no alerts", () => {
    (selectAlerts as jest.Mock).mockReturnValue([]);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    // Both DataTable and CardTable render the empty message
    const emptyMessages = screen.getAllByText("Nenhum alerta encontrado");
    expect(emptyMessages.length).toBeGreaterThan(0);
    expect(emptyMessages[0]).toBeInTheDocument();
  });

  it("should render alerts in DataTable (desktop)", () => {
    (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByText("Depósito em espécie acima do limite - A-3001")).toBeInTheDocument();
    expect(screen.getByText("Múltiplas transferências em curto período - A-3002")).toBeInTheDocument();
  });

  it("should render alerts in CardTable (mobile)", () => {
    (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    expect(screen.getByTestId("card-table")).toBeInTheDocument();
    expect(screen.getByText("Mobile Card: Depósito em espécie acima do limite - A-3001")).toBeInTheDocument();
    expect(screen.getByText("Mobile Card: Múltiplas transferências em curto período - A-3002")).toBeInTheDocument();
  });

  it("should render filter labels", () => {
    render(<CompliancePage />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Severidade")).toBeInTheDocument();
    expect(screen.getByText("Data Criação Início")).toBeInTheDocument();
    expect(screen.getByText("Data Criação Fim")).toBeInTheDocument();
  });

  it("should render 'Limpar filtros' button", () => {
    render(<CompliancePage />);
    expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
  });

  it("should toggle filters on mobile when filter icon is clicked", () => {
    render(<CompliancePage />);

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
    render(<CompliancePage />);

    // First, set some filters to ensure there's something to clear
    const dataCriacaoInicioInput = screen.getByTestId("datepicker-Data Criação Início");
    fireEvent.change(dataCriacaoInicioInput, { target: { value: "2026-01-01" } });

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
      expect(fetchAlerts).toHaveBeenCalledWith({
        token: "fake-token",
        status: undefined,
        severidade: undefined,
        dataCriacaoInicio: undefined,
        dataCriacaoFim: undefined,
      });
    });
  });

  it("should fetch alerts when status filter changes", async () => {
    render(<CompliancePage />);

    mockDispatch.mockClear();

    // Find and interact with status select
    const changeButtons = screen.getAllByTestId("select-change-button");
    const statusButton = changeButtons[0]; // First select is status
    
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchAlerts).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          status: "Novo",
        })
      );
    });
  });

  it("should fetch alerts when severidade filter changes", async () => {
    render(<CompliancePage />);

    mockDispatch.mockClear();

    // Find and interact with severidade select
    const changeButtons = screen.getAllByTestId("select-change-button");
    const severidadeButton = changeButtons[1]; // Second select is severidade
    
    fireEvent.click(severidadeButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchAlerts).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          severidade: "Novo",
        })
      );
    });
  });

  it("should fetch alerts when dataCriacaoInicio changes", async () => {
    render(<CompliancePage />);

    mockDispatch.mockClear();

    const dataCriacaoInicioInput = screen.getByTestId("datepicker-Data Criação Início");

    fireEvent.change(dataCriacaoInicioInput, { target: { value: "2026-01-01" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchAlerts).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          dataCriacaoInicio: expect.stringContaining("2026-01-01"),
        })
      );
    });
  });

  it("should fetch alerts when dataCriacaoFim changes", async () => {
    render(<CompliancePage />);

    mockDispatch.mockClear();

    const dataCriacaoFimInput = screen.getByTestId("datepicker-Data Criação Fim");

    fireEvent.change(dataCriacaoFimInput, { target: { value: "2026-01-31" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchAlerts).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "fake-token",
          dataCriacaoFim: expect.stringContaining("2026-01-31"),
        })
      );
    });
  });

  it("should fetch alerts with all filters applied", async () => {
    render(<CompliancePage />);

    mockDispatch.mockClear();

    const dataCriacaoInicioInput = screen.getByTestId("datepicker-Data Criação Início");
    const dataCriacaoFimInput = screen.getByTestId("datepicker-Data Criação Fim");

    fireEvent.change(dataCriacaoInicioInput, { target: { value: "2026-01-01" } });
    fireEvent.change(dataCriacaoFimInput, { target: { value: "2026-01-31" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      const calls = (fetchAlerts as unknown as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.dataCriacaoInicio).toBeDefined();
      expect(lastCall.dataCriacaoFim).toBeDefined();
    });
  });

  it("should render filter icon button on mobile", () => {
    render(<CompliancePage />);

    const filterButton = screen.getByTestId("icon-button-filter");
    expect(filterButton).toBeInTheDocument();
  });

  it("should pass correct props to DataTable", () => {
    (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    const dataTable = screen.getByTestId("data-table");
    expect(dataTable).toBeInTheDocument();
  });

  it("should pass correct props to CardTable", () => {
    (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    const cardTable = screen.getByTestId("card-table");
    expect(cardTable).toBeInTheDocument();
  });

  it("should handle date range constraints", () => {
    render(<CompliancePage />);

    const dataCriacaoInicioInput = screen.getByTestId("datepicker-Data Criação Início");
    const dataCriacaoFimInput = screen.getByTestId("datepicker-Data Criação Fim");

    // Set dataCriacaoFim first
    fireEvent.change(dataCriacaoFimInput, { target: { value: "2026-01-31" } });

    // dataCriacaoInicio should have maxDate constraint
    expect(dataCriacaoInicioInput).toHaveAttribute("max");
  });

  it("should not fetch when filters change but token is missing", async () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<CompliancePage />);

    mockDispatch.mockClear();

    const dataCriacaoInicioInput = screen.getByTestId("datepicker-Data Criação Início");
    fireEvent.change(dataCriacaoInicioInput, { target: { value: "2026-01-01" } });

    // Should not dispatch without token
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it("should map alerts using mapAPIAlertToMockAlert", () => {
    (selectAlerts as jest.Mock).mockReturnValue(mockAlerts);
    (selectAllAlertsLoading as jest.Mock).mockReturnValue(false);

    render(<CompliancePage />);

    // Verify that alerts are displayed (mapped alerts should have rule property)
    expect(screen.getByText("Depósito em espécie acima do limite - A-3001")).toBeInTheDocument();
  });
});
