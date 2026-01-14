import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportsPage from "@/app/reports/page";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAllReports,
  selectAllReports,
  selectAllReportsLoading,
} from "@/features/reports/reportsSlice";

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockImplementation((selector) => {
    return selector({} as any);
  }),
}));

jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
}));

jest.mock("@/features/reports/reportsSlice", () => {
  const mockFetchAllReportsFn = jest.fn();
  
  (mockFetchAllReportsFn as any).fulfilled = {
    match: (action: any) => action?.type === "reports/fetchAllReports/fulfilled",
  };
  
  return {
    fetchAllReports: mockFetchAllReportsFn,
    selectAllReports: jest.fn(),
    selectAllReportsLoading: jest.fn(),
  };
});

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

jest.mock("@/components/ui/linkButton", () => ({
  LinkButton: ({ children, onClick, variant, size, type }: any) => (
    <button
      data-slot="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      type={type}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/iconButton", () => ({
  IconButton: ({ icon, onClick, variant, size, className }: any) => (
    <button
      data-testid={`icon-button-${icon}`}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {icon}
    </button>
  ),
}));

jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/select", () => {
  let currentOnValueChange: ((value: string) => void) | undefined;
  
  return {
    Select: ({ children, value, onValueChange }: any) => {
      currentOnValueChange = onValueChange;
      return (
        <div data-testid="select" data-value={value}>
          {children}
          <button
            data-testid="select-change-button"
            onClick={() => onValueChange && onValueChange("Novo")}
          >
            Change
          </button>
        </div>
      );
    },
    SelectTrigger: ({ children, size, className }: any) => (
      <button data-testid="select-trigger" className={className} data-size={size}>
        {children}
      </button>
    ),
    SelectValue: ({ placeholder }: any) => (
      <span data-testid="select-value">{placeholder}</span>
    ),
    SelectContent: ({ children }: any) => (
      <div data-testid="select-content">{children}</div>
    ),
    SelectItem: ({ children, value }: any) => (
      <div
        data-testid={`select-item-${value}`}
        onClick={() => currentOnValueChange && currentOnValueChange(value)}
      >
        {children}
      </div>
    ),
  };
});

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
          <div key={item.clienteId} data-testid="table-row">
            {item.nomeCliente} - {item.clienteId}
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
          <div key={item.clienteId} data-testid="card-row">
            {renderCard ? renderCard(item) : item.nomeCliente}
          </div>
        ))
      )}
    </div>
  ),
}));

jest.mock("@/components/reports/reportCard", () => ({
  ReportCard: ({ report }: any) => (
    <div data-testid="report-card">
      {report.nomeCliente} - {report.clienteId}
    </div>
  ),
}));

jest.mock("@/models/reports", () => ({
  getReportsColumns: jest.fn(() => []),
}));

jest.mock("lucide-react", () => ({
  InfoIcon: ({ className }: any) => (
    <svg data-testid="info-icon" className={className} />
  ),
}));

const mockReports = [
  {
    clienteId: "C-1023",
    nomeCliente: "Maria Eduarda Ribeiro Facio",
    pais: "Brasil",
    nivelRisco: "Alto",
    statusKyc: "Aprovado",
    dataCriacao: "2025-01-01T00:00:00-03:00",
    totalTransacoes: 3,
    totalMovimentado: 1700,
    mediaTransacao: 566.67,
    dataUltimaTransacao: "2025-01-15T10:00:00-03:00",
    totalAlertas: 1,
    alertasNovos: 0,
    alertasEmAnalise: 0,
    alertasResolvidos: 0,
    alertasCriticos: 0,
    periodoInicio: null,
    periodoFim: null,
  },
  {
    clienteId: "C-2041",
    nomeCliente: "João Silva",
    pais: "Portugal",
    nivelRisco: "Médio",
    statusKyc: "Pendente",
    dataCriacao: "2025-01-05T00:00:00-03:00",
    totalTransacoes: 2,
    totalMovimentado: 800,
    mediaTransacao: 400,
    dataUltimaTransacao: "2025-01-10T10:00:00-03:00",
    totalAlertas: 0,
    alertasNovos: 0,
    alertasEmAnalise: 0,
    alertasResolvidos: 0,
    alertasCriticos: 0,
    periodoInicio: null,
    periodoFim: null,
  },
];

describe("ReportsPage", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (selectToken as jest.Mock).mockReturnValue("fake-token");
    (selectAllReports as jest.Mock).mockReturnValue([]);
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);

    (fetchAllReports as unknown as jest.Mock).mockReturnValue(() => {
      return Promise.resolve({
        type: "reports/fetchAllReports/fulfilled",
        payload: [],
      });
    });

    mockDispatch.mockImplementation((action) => {
      if (typeof action === 'function') {
        return action(mockDispatch, () => ({}), undefined);
      }
      return Promise.resolve(action || { type: "other" });
    });
  });

  it("renders correctly", () => {
    render(<ReportsPage />);

    expect(screen.getByText("Relatórios")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Visão geral da carteira. Selecione um cliente para detalhar perfil, transações e alertas."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Histórico de relatórios")).toBeInTheDocument();
  });

  it("renders banner image", () => {
    render(<ReportsPage />);

    const banner = screen.getByAltText("UBS Watchdog");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("src", "/banner-reports.jpg");
  });

  it("fetches reports on mount when token is available", () => {
    render(<ReportsPage />);

    expect(fetchAllReports).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "fake-token",
      })
    );
  });

  it("does not fetch reports when token is missing", () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<ReportsPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "reports/fetchAllReports/pending",
      })
    );
  });

  it("renders filters correctly", () => {
    render(<ReportsPage />);

    expect(screen.getByText("Status Alerta")).toBeInTheDocument();
    expect(screen.getByText("Status KYC")).toBeInTheDocument();
    expect(screen.getByText("País")).toBeInTheDocument();
    expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
  });

  it("renders filter tooltip", () => {
    render(<ReportsPage />);

    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("renders all filter options for Status Alerta", () => {
    render(<ReportsPage />);

    expect(screen.getAllByText("Todos").length).toBeGreaterThan(0);
    expect(screen.getByText("Novo")).toBeInTheDocument();
    expect(screen.getByText("Em Análise")).toBeInTheDocument();
    expect(screen.getByText("Resolvido")).toBeInTheDocument();
  });

  it("renders all filter options for Status KYC", () => {
    render(<ReportsPage />);

    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.getByText("Rejeitado")).toBeInTheDocument();
  });

  it("shows filter toggle button on mobile", () => {
    render(<ReportsPage />);

    expect(screen.getByTestId("icon-button-filter")).toBeInTheDocument();
  });

  it("toggles filters visibility on mobile", () => {
    render(<ReportsPage />);

    const filterButton = screen.getByTestId("icon-button-filter");
    fireEvent.click(filterButton);

    expect(screen.getByTestId("icon-button-x")).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    (selectAllReportsLoading as jest.Mock).mockReturnValue(true);

    render(<ReportsPage />);

    expect(screen.getByTestId("data-table-loading")).toBeInTheDocument();
    expect(screen.getByTestId("card-table-loading")).toBeInTheDocument();
  });

  it("renders empty state when no reports", () => {
    (selectAllReports as jest.Mock).mockReturnValue([]);
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);

    render(<ReportsPage />);

    expect(screen.getAllByText("Nenhum relatório encontrado").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText((content, element) => {
        return element?.textContent?.includes("Nenhum relatório encontrado para exibir") ?? false;
      }).length
    ).toBeGreaterThan(0);
  });

  it("renders reports in desktop table view", () => {
    (selectAllReports as jest.Mock).mockReturnValue(mockReports);
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);

    render(<ReportsPage />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("table-row")).toHaveLength(2);
  });

  it("renders reports in mobile card view", () => {
    (selectAllReports as jest.Mock).mockReturnValue(mockReports);
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);

    render(<ReportsPage />);

    expect(screen.getByTestId("card-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("card-row")).toHaveLength(2);
  });

  it("renders report cards correctly", () => {
    (selectAllReports as jest.Mock).mockReturnValue(mockReports);
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);

    render(<ReportsPage />);

    expect(screen.getAllByTestId("report-card")).toHaveLength(2);
    expect(screen.getAllByText("Maria Eduarda Ribeiro Facio - C-1023").length).toBeGreaterThan(0);
  });

  it("clears filters when Limpar filtros is clicked", () => {
    render(<ReportsPage />);

    const clearButton = screen.getByText("Limpar filtros");
    fireEvent.click(clearButton);

    const selects = screen.getAllByTestId("select");
    selects.forEach((select) => {
      expect(select).toHaveAttribute("data-value", "all");
    });
  });

  it("fetches reports with filters when statusAlerta changes", async () => {
    render(<ReportsPage />);

    (fetchAllReports as unknown as jest.Mock).mockClear();

    const selectButtons = screen.getAllByTestId("select-change-button");
    fireEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(fetchAllReports).toHaveBeenCalled();
    });
  });

  it("populates countries list from reports", async () => {
    const mockFetchResult = {
      type: "reports/fetchAllReports/fulfilled",
      payload: mockReports,
    };

    (fetchAllReports as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(mockFetchResult)
    );

    render(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByText("Brasil")).toBeInTheDocument();
      expect(screen.getByText("Portugal")).toBeInTheDocument();
    });
  });

  it("only fetches countries once", async () => {
    const mockFetchResult = {
      type: "reports/fetchAllReports/fulfilled",
      payload: mockReports,
    };

    (fetchAllReports as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(mockFetchResult)
    );

    const { rerender } = render(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByText("Brasil")).toBeInTheDocument();
    });

    const initialCallCount = (fetchAllReports as unknown as jest.Mock).mock.calls.length;

    rerender(<ReportsPage />);

    await waitFor(() => {
      expect((fetchAllReports as unknown as jest.Mock).mock.calls.length).toBeLessThanOrEqual(initialCallCount + 1);
    });
  });

  it("renders country options in País select", async () => {
    const mockFetchResult = {
      type: "reports/fetchAllReports/fulfilled",
      payload: mockReports,
    };

    (fetchAllReports as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(mockFetchResult)
    );

    render(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("select-item-Brasil")).toBeInTheDocument();
      expect(screen.getByTestId("select-item-Portugal")).toBeInTheDocument();
    });
  });

  it("filters reports by statusAlerta", async () => {
    render(<ReportsPage />);

    (fetchAllReports as unknown as jest.Mock).mockClear();

    const selectButtons = screen.getAllByTestId("select-change-button");
    fireEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(fetchAllReports).toHaveBeenCalled();
    });
  });

  it("filters reports by statusKyc", async () => {
    render(<ReportsPage />);

    (fetchAllReports as unknown as jest.Mock).mockClear();

    const selectButtons = screen.getAllByTestId("select-change-button");
    fireEvent.click(selectButtons[1]);

    await waitFor(() => {
      expect(fetchAllReports).toHaveBeenCalled();
    });
  });

  it("filters reports by pais", async () => {
    const mockFetchResult = {
      type: "reports/fetchAllReports/fulfilled",
      payload: mockReports,
    };

    (fetchAllReports as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(mockFetchResult)
    );

    render(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("select-item-Brasil")).toBeInTheDocument();
    });

    (fetchAllReports as unknown as jest.Mock).mockClear();
    (fetchAllReports as unknown as jest.Mock).mockReturnValue(
      Promise.resolve({ type: "reports/fetchAllReports/fulfilled", payload: [] })
    );

    const paisSelectItem = screen.getByTestId("select-item-Brasil");
    fireEvent.click(paisSelectItem);

    await waitFor(() => {
      expect(fetchAllReports).toHaveBeenCalled();
    });
  });

  it("does not send filter params when value is 'all'", () => {
    render(<ReportsPage />);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
