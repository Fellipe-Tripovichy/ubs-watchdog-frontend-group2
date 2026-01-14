import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComplianceDetailPage from "@/app/compliance/[id]/page";
import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken, selectUser } from "@/features/auth/authSlice";
import {
  fetchAlertById,
  startAnalysis,
  resolveAlert,
  selectCurrentAlert,
  selectCurrentAlertLoading,
  selectComplianceError,
  selectComplianceUpdating,
} from "@/features/compliance/complianceSlice";
import {
  fetchClientById,
  selectCurrentClient,
  selectCurrentClientLoading,
} from "@/features/client/clientSlice";
import {
  fetchTransactionById,
  selectCurrentTransaction,
  selectCurrentTransactionLoading,
} from "@/features/transactions/transactionsSlice";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockImplementation((selector) => {
    return selector({} as any);
  }),
}));

jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
  selectUser: jest.fn(),
}));

jest.mock("@/features/compliance/complianceSlice", () => {
  const mockStartAnalysisFn = jest.fn();
  const mockResolveAlertFn = jest.fn();

  (mockStartAnalysisFn as any).fulfilled = {
    match: (action: any) => action?.type === "compliance/startAnalysis/fulfilled",
  };

  (mockResolveAlertFn as any).fulfilled = {
    match: (action: any) => action?.type === "compliance/resolveAlert/fulfilled",
  };

  return {
    fetchAlertById: jest.fn(),
    startAnalysis: mockStartAnalysisFn,
    resolveAlert: mockResolveAlertFn,
    selectCurrentAlert: jest.fn(),
    selectCurrentAlertLoading: jest.fn(),
    selectComplianceError: jest.fn(),
    selectComplianceUpdating: jest.fn(),
  };
});

jest.mock("@/features/client/clientSlice", () => ({
  fetchClientById: jest.fn(),
  selectCurrentClient: jest.fn(),
  selectCurrentClientLoading: jest.fn(),
}));

jest.mock("@/features/transactions/transactionsSlice", () => ({
  fetchTransactionById: jest.fn(),
  selectCurrentTransaction: jest.fn(),
  selectCurrentTransactionLoading: jest.fn(),
}));

jest.mock("@/components/ui/linkButton", () => ({
  LinkButton: ({ children, onClick, disabled, asChild, className }: any) => {
    if (asChild) {
      return (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      );
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

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, size, variant }: any) => (
    <button
      data-slot="button"
      onClick={onClick}
      disabled={disabled}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, style }: any) => (
    <span data-testid="badge" style={style}>
      {children}
    </span>
  ),
}));

jest.mock("@/components/ui/heroTitle", () => ({
  HeroTitle: ({ children, subtitle, loading, as }: any) => (
    <div>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
      {loading && <div data-testid="hero-loading">Loading</div>}
    </div>
  ),
}));

jest.mock("@/components/ui/sectionTitle", () => ({
  SectionTitle: ({ children }: any) => <h2>{children}</h2>,
}));

jest.mock("@/components/ui/copyButton", () => ({
  CopyButton: ({ textToCopy }: any) => (
    <button data-testid="copy-button" data-text={textToCopy}>
      Copy
    </button>
  ),
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: any) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

jest.mock("@/components/ui/flagImage", () => ({
  FlagImage: ({ country, className }: any) => (
    <div data-testid="flag-image" data-country={country} className={className} />
  ),
}));

jest.mock("@/components/compliance/confirmAnalysisDialog", () => ({
  ConfirmAnalysisDialog: ({ open, onOpenChange, onConfirm, isUpdating }: any) => (
    <div data-testid="confirm-analysis-dialog" data-open={open}>
      <button
        data-testid="confirm-analysis-button"
        onClick={() => onConfirm()}
        disabled={isUpdating}
      >
        Confirm
      </button>
      <button
        data-testid="cancel-analysis-button"
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </button>
    </div>
  ),
}));

jest.mock("@/components/compliance/confirmResolutionDialog", () => ({
  ConfirmResolutionDialog: ({ open, onOpenChange, onConfirm, isUpdating }: any) => (
    <div data-testid="confirm-resolution-dialog" data-open={open}>
      <input
        data-testid="resolution-input"
        onChange={(e: any) => {
          const input = e.target;
          input.dataset.value = e.target.value;
        }}
      />
      <button
        data-testid="confirm-resolution-button"
        onClick={() => {
          const input = document.querySelector('[data-testid="resolution-input"]') as HTMLInputElement;
          onConfirm(input?.dataset.value || "");
        }}
        disabled={isUpdating}
      >
        Confirm
      </button>
      <button
        data-testid="cancel-resolution-button"
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </button>
    </div>
  ),
}));

jest.mock("@/models/complience", () => ({
  getBadgeStyleBySeverity: jest.fn((severity: string) => ({
    backgroundColor: "#fef3c7",
    color: "#92400e",
  })),
  getBadgeStyleByStatus: jest.fn((status: string) => ({
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  })),
}));

jest.mock("@/models/reports", () => ({
  getBadgeStyleByRisk: jest.fn((risk: string) => ({
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  })),
  getBadgeStyleByKyc: jest.fn((kyc: string) => ({
    backgroundColor: "#d1fae5",
    color: "#065f46",
  })),
}));

jest.mock("@/models/transactions", () => ({
  CURRENCIES: [
    { code: "BRL", fullName: "Real", countryCode: "br", symbol: "R$" },
    { code: "USD", fullName: "Dólar", countryCode: "us", symbol: "$" },
  ],
}));

jest.mock("@/lib/utils", () => ({
  formatDateTime: jest.fn((date: string) => {
    return new Date(date).toLocaleString("pt-BR");
  }),
  formatDate: jest.fn((date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  }),
  formatMoney: jest.fn((value: number, currency: string) => {
    return `${currency} ${value.toFixed(2)}`;
  }),
  getColorByStatus: jest.fn(() => ({
    light: "#f3f4f6",
    foreground: "#1f2937",
  })),
}));

const mockAlert = {
  id: "A-3001",
  clienteId: "C-1023",
  transacaoId: "T-9001",
  nomeRegra: "Depósito em espécie acima do limite",
  descricao: "Test description",
  severidade: "Alta" as const,
  status: "Novo" as const,
  dataCriacao: "2025-01-15T10:30:00-03:00",
  dataResolucao: null,
  resolvidoPor: null,
  resolucao: null,
};

const mockClient = {
  id: "C-1023",
  nome: "Maria Eduarda Ribeiro Facio",
  pais: "Brasil",
  nivelRisco: "Alto",
  statusKyc: "Aprovado",
  dataCriacao: "2025-01-01T00:00:00-03:00",
};

const mockTransaction = {
  id: "T-9001",
  clienteId: "C-1023",
  tipo: "Deposito",
  valor: 5000.50,
  moeda: "BRL",
  contraparteId: null,
  dataHora: "2025-01-15T10:30:00-03:00",
  quantidadeAlertas: 2,
};

const mockUser = {
  uid: "user-123",
  email: "user@example.com",
  displayName: "Test User",
  emailVerified: true,
};

describe("ComplianceDetailPage", () => {
  const mockDispatch = jest.fn();
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ id: "A-3001" });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (selectToken as jest.Mock).mockReturnValue("fake-token");
    (selectUser as jest.Mock).mockReturnValue(mockUser);
    (selectCurrentAlert as jest.Mock).mockReturnValue(null);
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(true);
    (selectComplianceError as jest.Mock).mockReturnValue(null);
    (selectComplianceUpdating as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(null);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(null);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);

    (fetchAlertById as unknown as jest.Mock).mockReturnValue({
      type: "compliance/fetchAlertById/pending",
    });
    (fetchClientById as unknown as jest.Mock).mockReturnValue({
      type: "client/fetchClientById/pending",
    });
    (fetchTransactionById as unknown as jest.Mock).mockReturnValue({
      type: "transactions/fetchTransactionById/pending",
    });
  });

  it("renders loading state correctly", () => {
    render(<ComplianceDetailPage />);

    expect(screen.getByText("Detalhes do Alerta")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("fetches alert on mount when alertId and token are available", () => {
    render(<ComplianceDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "compliance/fetchAlertById/pending",
      })
    );
  });

  it("does not fetch alert when alertId is missing", () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    render(<ComplianceDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "compliance/fetchAlertById/pending",
      })
    );
  });

  it("does not fetch alert when token is missing", () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<ComplianceDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "compliance/fetchAlertById/pending",
      })
    );
  });

  it("renders alert details when loaded", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Depósito em espécie acima do limite")).toBeInTheDocument();
    expect(screen.getByText(/A-30...3001/)).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders severity badge correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Severidade")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it("renders status badge correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("renders Iniciar Análise button when status is Novo", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Iniciar Análise")).toBeInTheDocument();
  });

  it("does not render Iniciar Análise button when status is not Novo", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "EmAnalise" as const,
    });

    render(<ComplianceDetailPage />);

    expect(screen.queryByText("Iniciar Análise")).not.toBeInTheDocument();
  });

  it("renders Resolver Alerta button when status is EmAnalise", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "EmAnalise" as const,
    });

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Resolver Alerta")).toBeInTheDocument();
  });

  it("does not render Resolver Alerta button when status is not EmAnalise", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.queryByText("Resolver Alerta")).not.toBeInTheDocument();
  });

  it("opens confirm analysis dialog when Iniciar Análise is clicked", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Iniciar Análise");
    fireEvent.click(button);

    expect(screen.getByTestId("confirm-analysis-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  it("opens confirm resolution dialog when Resolver Alerta is clicked", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "EmAnalise" as const,
    });

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Resolver Alerta");
    fireEvent.click(button);

    expect(screen.getByTestId("confirm-resolution-dialog")).toHaveAttribute(
      "data-open",
      "true"
    );
  });

  it("calls router.back when Voltar button is clicked", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    const backButton = screen.getByText("Voltar").closest("div");
    if (backButton) {
      fireEvent.click(backButton);
    }

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("renders resolution details when alert is resolved", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "Resolvido" as const,
      dataResolucao: "2025-01-18T10:00:00-03:00",
      resolvidoPor: "user@example.com",
      resolucao: "Alert resolved after investigation",
    });

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Detalhes da Resolução")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("Alert resolved after investigation")).toBeInTheDocument();
  });

  it("does not render resolution details when alert is not resolved", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(screen.queryByText("Detalhes da Resolução")).not.toBeInTheDocument();
  });

  it("renders default resolution text when resolucao is null", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "Resolvido" as const,
      dataResolucao: "2025-01-18T10:00:00-03:00",
      resolvidoPor: "user@example.com",
      resolucao: null,
    });

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Resolução não informada")).toBeInTheDocument();
  });

  it("fetches client when alert is loaded", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/fetchClientById/pending",
      })
    );
  });

  it("fetches transaction when alert is loaded", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    render(<ComplianceDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "transactions/fetchTransactionById/pending",
      })
    );
  });

  it("renders transaction details when loaded", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Transação Relacionada")).toBeInTheDocument();
    expect(screen.getByText(/T-90...9001/)).toBeInTheDocument();
    expect(screen.getByText("Depósito")).toBeInTheDocument();
  });

  it("renders transaction loading state", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(true);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Transação Relacionada")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders transaction link correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<ComplianceDetailPage />);

    const link = screen.getByText("Ver transação");
    expect(link.closest("a")).toHaveAttribute("href", "/transactions/T-9001");
  });

  it("does not render contraparte section since Transaction type uses contraparteId", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue({
      ...mockTransaction,
      contraparteId: null,
    });

    render(<ComplianceDetailPage />);

    expect(screen.queryByText("Contraparte")).not.toBeInTheDocument();
  });

  it("renders client details when loaded", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Cliente Relacionado")).toBeInTheDocument();
    expect(screen.getByText("Maria Eduarda Ribeiro Facio")).toBeInTheDocument();
    expect(screen.getByText(/C-10...1023/)).toBeInTheDocument();
  });

  it("renders client loading state", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(true);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Cliente Relacionado")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders client link correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    const link = screen.getByText("Ver relatório do cliente");
    expect(link.closest("a")).toHaveAttribute("href", "/reports/C-1023");
  });

  it("handles start analysis successfully", async () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);

    const mockStartAnalysisResult = {
      type: "compliance/startAnalysis/fulfilled",
      payload: { ...mockAlert, status: "EmAnalise" as const },
    };

    (startAnalysis as unknown as jest.Mock).mockReturnValue({
      type: "compliance/startAnalysis/pending",
    });

    mockDispatch.mockImplementation((action) => {
      if (action.type === "compliance/startAnalysis/pending") {
        return Promise.resolve(mockStartAnalysisResult);
      }
      return Promise.resolve({ type: "other" });
    });

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Iniciar Análise");
    fireEvent.click(button);

    const confirmButton = screen.getByTestId("confirm-analysis-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "compliance/startAnalysis/pending",
        })
      );
    });
  });

  it("handles resolve alert successfully", async () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "EmAnalise" as const,
    });

    const mockResolveResult = {
      type: "compliance/resolveAlert/fulfilled",
      payload: {
        ...mockAlert,
        status: "Resolvido" as const,
        dataResolucao: "2025-01-18T10:00:00-03:00",
        resolvidoPor: "Test User",
        resolucao: "Resolved",
      },
    };

    (resolveAlert as unknown as jest.Mock).mockReturnValue({
      type: "compliance/resolveAlert/pending",
    });

    mockDispatch.mockImplementation((action) => {
      if (action.type === "compliance/resolveAlert/pending") {
        return Promise.resolve(mockResolveResult);
      }
      return Promise.resolve({ type: "other" });
    });

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Resolver Alerta");
    fireEvent.click(button);

    const input = screen.getByTestId("resolution-input");
    fireEvent.change(input, { target: { value: "Resolved" } });

    const confirmButton = screen.getByTestId("confirm-resolution-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "compliance/resolveAlert/pending",
        })
      );
    });
  });

  it("disables buttons when updating", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectComplianceUpdating as jest.Mock).mockReturnValue(true);

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Iniciar Análise").closest("button");
    expect(button).toBeDisabled();
  });

  it("renders all severity types correctly", () => {
    const severities = ["Baixa", "Media", "Alta", "Critica"] as const;
    const severityLabels = ["Baixa", "Média", "Alta", "Crítica"];

    severities.forEach((severity, index) => {
      (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentAlert as jest.Mock).mockReturnValue({
        ...mockAlert,
        severidade: severity,
      });
      (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentClient as jest.Mock).mockReturnValue(null);
      (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentTransaction as jest.Mock).mockReturnValue(null);

      const { unmount } = render(<ComplianceDetailPage />);
      expect(screen.getByText(severityLabels[index])).toBeInTheDocument();
      unmount();
    });
  });

  it("renders all status types correctly", () => {
    const statuses = ["Novo", "EmAnalise", "Resolvido"] as const;
    const statusLabels = ["Novo", "Em Análise", "Resolvido"];

    statuses.forEach((status, index) => {
      (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentAlert as jest.Mock).mockReturnValue({
        ...mockAlert,
        status: status,
      });
      (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentClient as jest.Mock).mockReturnValue(null);
      (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentTransaction as jest.Mock).mockReturnValue(null);

      const { unmount } = render(<ComplianceDetailPage />);
      expect(screen.getByText(statusLabels[index])).toBeInTheDocument();
      unmount();
    });
  });

  it("renders currency flag and name correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(null);

    render(<ComplianceDetailPage />);

    const flags = screen.getAllByTestId("flag-image");
    const currencyFlag = flags.find(
      (flag) => flag.getAttribute("data-country") === "br"
    );
    expect(currencyFlag).toBeInTheDocument();
    expect(screen.getByText("Real")).toBeInTheDocument();
  });

  it("renders client flag correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    const flags = screen.getAllByTestId("flag-image");
    const clientFlag = flags.find(
      (flag) => flag.getAttribute("data-country") === "Brasil"
    );
    expect(clientFlag).toBeInTheDocument();
  });

  it("renders client initial correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders risk level badge correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("Nível de Risco")).toBeInTheDocument();
    expect(screen.getByText("Alto")).toBeInTheDocument();
  });

  it("renders KYC status badge correctly", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue(mockAlert);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<ComplianceDetailPage />);

    expect(screen.getByText("KYC Status")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
  });

  it("does not fetch client when alert clienteId is missing", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      clienteId: "",
    });

    render(<ComplianceDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/fetchClientById/pending",
      })
    );
  });

  it("does not fetch transaction when alert transacaoId is missing", () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      transacaoId: "",
    });

    render(<ComplianceDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "transactions/fetchTransactionById/pending",
      })
    );
  });

  it("does not call handleResolveAlert when user displayName is missing", async () => {
    (selectCurrentAlertLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentAlert as jest.Mock).mockReturnValue({
      ...mockAlert,
      status: "EmAnalise" as const,
    });
    (selectUser as jest.Mock).mockReturnValue({
      ...mockUser,
      displayName: null,
    });

    render(<ComplianceDetailPage />);

    const button = screen.getByText("Resolver Alerta");
    fireEvent.click(button);

    const confirmButton = screen.getByTestId("confirm-resolution-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: "compliance/resolveAlert/pending",
        })
      );
    });
  });
});
