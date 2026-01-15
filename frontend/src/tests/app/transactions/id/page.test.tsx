import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionDetailPage from "@/app/transactions/[id]/page";
import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchTransactionById,
  selectCurrentTransaction,
  selectCurrentTransactionLoading,
} from "@/features/transactions/transactionsSlice";
import {
  fetchClientById,
  selectCurrentClient,
  selectCurrentClientLoading,
  selectContraparteClient,
  selectContraparteClientLoading,
} from "@/features/client/clientSlice";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn().mockImplementation((selector) => {
    return selector({} as any);
  }),
}));

jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
}));

jest.mock("@/features/transactions/transactionsSlice", () => ({
  fetchTransactionById: jest.fn(),
  selectCurrentTransaction: jest.fn(),
  selectCurrentTransactionLoading: jest.fn(),
}));

jest.mock("@/features/client/clientSlice", () => ({
  fetchClientById: jest.fn(),
  selectCurrentClient: jest.fn(),
  selectCurrentClientLoading: jest.fn(),
  selectContraparteClient: jest.fn(),
  selectContraparteClientLoading: jest.fn(),
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

jest.mock("@/components/ui/spinner", () => ({
  Spinner: ({ className }: any) => (
    <div data-testid="spinner" className={className} />
  ),
}));

jest.mock("@/components/ui/flagImage", () => ({
  FlagImage: ({ country, className }: any) => (
    <div data-testid="flag-image" data-country={country} className={className} />
  ),
}));

jest.mock("@/components/ui/empty", () => ({
  Empty: ({ children, className }: any) => (
    <div data-testid="empty" className={className}>
      {children}
    </div>
  ),
  EmptyHeader: ({ children }: any) => (
    <div data-testid="empty-header">{children}</div>
  ),
  EmptyTitle: ({ children }: any) => (
    <div data-testid="empty-title">{children}</div>
  ),
  EmptyDescription: ({ children }: any) => (
    <div data-testid="empty-description">{children}</div>
  ),
  EmptyMedia: ({ children, variant }: any) => (
    <div data-testid="empty-media" data-variant={variant}>
      {children}
    </div>
  ),
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
  getColorByStatus: jest.fn((status: string) => {
    if (status === "warning") {
      return { light: "#fef3c7", foreground: "#92400e" };
    }
    if (status === "success") {
      return { light: "#d1fae5", foreground: "#065f46" };
    }
    return { light: "#f3f4f6", foreground: "#1f2937" };
  }),
}));

jest.mock("lucide-react", () => ({
  TriangleAlert: ({ className }: any) => (
    <svg data-testid="triangle-alert" className={className} />
  ),
  CheckCircle2Icon: ({ className }: any) => (
    <svg data-testid="check-circle" className={className} />
  ),
  UserRoundXIcon: ({ className }: any) => (
    <svg data-testid="user-round-x" className={className} />
  ),
}));

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

const mockTransferTransaction = {
  ...mockTransaction,
  id: "T-9002",
  tipo: "Transferencia",
  contraparteId: "C-2041",
};

const mockClient = {
  id: "C-1023",
  nome: "Maria Eduarda Ribeiro Facio",
  pais: "Brasil",
  nivelRisco: "Alto",
  statusKyc: "Aprovado",
  dataCriacao: "2025-01-01T00:00:00-03:00",
};

const mockContraparteClient = {
  id: "C-2041",
  nome: "João Silva",
  pais: "Portugal",
  nivelRisco: "Médio",
  statusKyc: "Pendente",
  dataCriacao: "2025-01-05T00:00:00-03:00",
};

describe("TransactionDetailPage", () => {
  const mockDispatch = jest.fn();
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ id: "T-9001" });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    (selectToken as jest.Mock).mockReturnValue("fake-token");
    (selectCurrentTransaction as jest.Mock).mockReturnValue(null);
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(true);
    (selectCurrentClient as jest.Mock).mockReturnValue(null);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectContraparteClient as jest.Mock).mockReturnValue(null);
    (selectContraparteClientLoading as jest.Mock).mockReturnValue(false);

    (fetchTransactionById as unknown as jest.Mock).mockReturnValue({
      type: "transactions/fetchTransactionById/pending",
    });
    (fetchClientById as unknown as jest.Mock).mockReturnValue({
      type: "client/fetchClientById/pending",
    });
  });

  it("renders loading state correctly", () => {
    render(<TransactionDetailPage />);

    expect(screen.getByText("Detalhes da Transação")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("fetches transaction on mount when transactionId and token are available", () => {
    render(<TransactionDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "transactions/fetchTransactionById/pending",
      })
    );
  });

  it("does not fetch transaction when transactionId is missing", () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    render(<TransactionDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "transactions/fetchTransactionById/pending",
      })
    );
  });

  it("does not fetch transaction when token is missing", () => {
    (selectToken as jest.Mock).mockReturnValue(null);

    render(<TransactionDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "transactions/fetchTransactionById/pending",
      })
    );
  });

  it("renders transaction details when loaded", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Detalhes da Depósito")).toBeInTheDocument();
    expect(screen.getByText("Valor da transação")).toBeInTheDocument();
  });

  it("renders transaction value correctly", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    expect(screen.getByText("BRL 5000.50")).toBeInTheDocument();
  });

  it("renders currency flag and name correctly", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    const flags = screen.getAllByTestId("flag-image");
    const currencyFlag = flags.find(
      (flag) => flag.getAttribute("data-country") === "br"
    );
    expect(currencyFlag).toBeInTheDocument();
    expect(screen.getByText("Real")).toBeInTheDocument();
  });

  it("renders alert badge with alerts", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    expect(screen.getByText("2 alerta(s) associados")).toBeInTheDocument();
    expect(screen.getByTestId("triangle-alert")).toBeInTheDocument();
  });

  it("renders alert badge without alerts", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue({
      ...mockTransaction,
      quantidadeAlertas: 0,
    });

    render(<TransactionDetailPage />);

    expect(screen.getByText("Sem alertas associados")).toBeInTheDocument();
    expect(screen.getByTestId("check-circle")).toBeInTheDocument();
  });

  it("fetches client when transaction is loaded", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/fetchClientById/pending",
      })
    );
  });

  it("does not fetch client when transaction clienteId is missing", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue({
      ...mockTransaction,
      clienteId: "",
    });

    render(<TransactionDetailPage />);

    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/fetchClientById/pending",
      })
    );
  });

  it("renders client details when loaded", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Informações do cliente")).toBeInTheDocument();
    expect(screen.getByText("Maria Eduarda Ribeiro Facio")).toBeInTheDocument();
    expect(screen.getByText(/C-10...1023/)).toBeInTheDocument();
  });

  it("renders client loading state", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(true);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Informações do cliente")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders client initial correctly", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders client nationality with flag", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    const flags = screen.getAllByTestId("flag-image");
    const clientFlag = flags.find(
      (flag) => flag.getAttribute("data-country") === "Brasil"
    );
    expect(clientFlag).toBeInTheDocument();
    expect(screen.getByText("Brasil")).toBeInTheDocument();
  });

  it("renders client risk level badge", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Nível de Risco")).toBeInTheDocument();
    expect(screen.getByText("Alto")).toBeInTheDocument();
  });

  it("renders client KYC status badge", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("KYC Status")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
  });

  it("renders contraparte section for Transferencia type", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransferTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);
    (selectContraparteClientLoading as jest.Mock).mockReturnValue(false);
    (selectContraparteClient as jest.Mock).mockReturnValue(mockContraparteClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Cliente destino")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("does not render contraparte section for non-Transferencia types", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);

    render(<TransactionDetailPage />);

    expect(screen.queryByText("Cliente destino")).not.toBeInTheDocument();
  });

  it("fetches contraparte client when transaction has contraparteId", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransferTransaction);

    render(<TransactionDetailPage />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "client/fetchClientById/pending",
      })
    );
  });

  it("renders contraparte loading state", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransferTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);
    (selectContraparteClientLoading as jest.Mock).mockReturnValue(true);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Cliente destino")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders empty state when contraparte client is not found", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransferTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);
    (selectContraparteClientLoading as jest.Mock).mockReturnValue(false);
    (selectContraparteClient as jest.Mock).mockReturnValue(null);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Cliente destino")).toBeInTheDocument();
    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(screen.getByText("Nenhum cliente destino encontrado")).toBeInTheDocument();
    expect(screen.getByTestId("user-round-x")).toBeInTheDocument();
  });

  it("renders contraparte client details correctly", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransferTransaction);
    (selectCurrentClientLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentClient as jest.Mock).mockReturnValue(mockClient);
    (selectContraparteClientLoading as jest.Mock).mockReturnValue(false);
    (selectContraparteClient as jest.Mock).mockReturnValue(mockContraparteClient);

    render(<TransactionDetailPage />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Portugal")).toBeInTheDocument();
    expect(screen.getByText("Médio")).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
  });

  it("renders all transaction types correctly", () => {
    const types = ["Deposito", "Saque", "Transferencia"] as const;
    const typeLabels = ["Depósito", "Saque", "Transferência"];

    types.forEach((type, index) => {
      (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentTransaction as jest.Mock).mockReturnValue({
        ...mockTransaction,
        tipo: type,
      });

      const { unmount } = render(<TransactionDetailPage />);
      expect(screen.getByText(`Detalhes da ${typeLabels[index]}`)).toBeInTheDocument();
      unmount();
    });
  });

  it("calls router.back when Voltar button is clicked", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(mockTransaction);

    render(<TransactionDetailPage />);

    const backButton = screen.getByText("Voltar").closest("div");
    if (backButton) {
      fireEvent.click(backButton);
    }

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("renders transaction type label correctly", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue({
      ...mockTransaction,
      tipo: "Transferencia",
    });

    render(<TransactionDetailPage />);

    expect(screen.getByText("Detalhes da Transferência")).toBeInTheDocument();
  });

  it("renders default transaction type when tipo is missing", () => {
    (selectCurrentTransactionLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentTransaction as jest.Mock).mockReturnValue(null);

    render(<TransactionDetailPage />);

    expect(screen.getByText("Detalhes da Transação")).toBeInTheDocument();
  });
});
