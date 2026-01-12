import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ReportsPage from "@/app/reports/[id]/page"; 
import { useParams } from "next/navigation";

// Import the actual named exports so we can cast them to jest.Mock
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import { fetchClientReport, selectCurrentReport, selectReportsLoading } from "@/features/reports/reportsSlice";

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
  useAppSelector: jest.fn().mockImplementation((selector) => selector()),
}));

// 4. Mock Redux Slices
jest.mock("@/features/auth/authSlice", () => ({
  selectToken: jest.fn(),
}));

jest.mock("@/features/reports/reportsSlice", () => ({
  fetchClientReport: jest.fn(),
  selectCurrentReport: jest.fn(),
  selectReportsLoading: jest.fn(),
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
  DatePickerInput: ({ label, onChange, value }: any) => (
    <label>
      {label}
      <input
        type="date"
        data-testid={`datepicker-${label}`}
        // FIX: Add T12:00:00 to prevent timezone rollovers (e.g. UTC midnight -> Previous Day Local)
        onChange={(e) => onChange(new Date(e.target.value + "T12:00:00"))}
        value={value ? new Date(value).toISOString().split('T')[0] : ""}
      />
    </label>
  ),
}));

jest.mock("@/components/ui/flagImage", () => ({
  FlagImage: () => <div data-testid="flag-image" />,
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
  client: {
    id: "C-1023",
    name: "John Doe",
    country: "BR",
    riskLevel: "Médio",
    kycStatus: "Aprovado",
  },
  transactions: [
    mockTransaction,
    { ...mockTransaction, id: "tx-2", type: "Saque", amount: 500 }, // BRL
    { ...mockTransaction, id: "tx-3", currency: "USD", amount: 200 }, // USD
  ],
  alerts: [mockAlert],
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
    (selectReportsLoading as jest.Mock).mockReturnValue(true);
  });

  it("renders the loading state correctly", () => {
    (selectReportsLoading as jest.Mock).mockReturnValue(true);
    (selectCurrentReport as jest.Mock).mockReturnValue(null);

    render(<ReportsPage />);

    expect(screen.getByText(/Atualizando relatório.../i)).toBeInTheDocument();
  });

  it("renders the empty state when no report is found", () => {
    (selectReportsLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentReport as jest.Mock).mockReturnValue(null);

    render(<ReportsPage />);

    expect(
      screen.getByText(/Nenhum relatório encontrado para o cliente/i)
    ).toBeInTheDocument();
  });

  it("fetches the report on mount with correct parameters", () => {
    (selectReportsLoading as jest.Mock).mockReturnValue(true);
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
      (selectReportsLoading as jest.Mock).mockReturnValue(false);
      (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);
    });

    it("renders client information correctly", () => {
      render(<ReportsPage />);

      expect(screen.getByText("Relatório do cliente")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("C-1023")).toBeInTheDocument();
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
      
      expect(screen.getByText(/Resumo de transações/i)).toBeInTheDocument();
      
      // FIX: "Alertas ativos no período" appears in the Title AND the Warning message.
      // usage of getAllByText ensures we find at least one occurrence without crashing.
      const alertsHeadings = screen.getAllByText(/Alertas ativos no período/i);
      expect(alertsHeadings.length).toBeGreaterThan(0);

      expect(screen.getByText(/Detalhes de Transações/i)).toBeInTheDocument();
    });

    it("handles currency filtering logic (visual check)", () => {
      render(<ReportsPage />);
      expect(screen.getByText(/Resumo de transações \(BRL\)/i)).toBeInTheDocument();
    });

    it("renders empty states for empty lists within the report", () => {
      const emptyListsReport = {
        ...mockReportData,
        transactions: [],
        alerts: [],
      };
      (selectCurrentReport as jest.Mock).mockReturnValue(emptyListsReport);

      render(<ReportsPage />);

      expect(screen.getByText(/Nenhum alerta no período/i)).toBeInTheDocument();
      expect(screen.getByText(/Nenhuma transação no período/i)).toBeInTheDocument();
    });
  });

  it("updates date range filters and triggers new fetch", async () => {
    (selectReportsLoading as jest.Mock).mockReturnValue(false);
    (selectCurrentReport as jest.Mock).mockReturnValue(mockReportData);

    render(<ReportsPage />);

    const startDateInput = screen.getByTestId("datepicker-Data inicial");
    
    mockDispatch.mockClear();

    // The mock now appends T12:00:00, ensuring the component receives a date
    // that won't shift to the previous day when converted to local ISO string.
    fireEvent.change(startDateInput, { target: { value: "2023-12-01" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchClientReport).toHaveBeenCalledWith(
        expect.objectContaining({
            // Check that the string contains the expected date
            startDate: expect.stringContaining("2023-12-01")
        })
      );
    });
  });
});