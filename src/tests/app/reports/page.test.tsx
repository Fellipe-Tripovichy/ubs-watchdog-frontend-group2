import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportsPage from "@/app/reports/page"; // Adjust path if needed

// Import named exports for mocking
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchAllReports,
  selectAllReports,
  selectAllReportsLoading,
  selectReportsError,
} from "@/features/reports/reportsSlice";

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

jest.mock("@/features/reports/reportsSlice", () => ({
  fetchAllReports: jest.fn(),
  selectAllReports: jest.fn(),
  selectAllReportsLoading: jest.fn(),
  selectReportsError: jest.fn(),
}));

// 5. Mock UI Components
// We mock DataTable and CardTable to verify data is passed to them correctly
// without testing the table logic itself.
jest.mock("@/components/table/dataTable", () => ({
  DataTable: ({ data }: any) => (
    <div data-testid="data-table">
      {data.map((item: any) => (
        <div key={item.client.id} data-testid="table-row">
          {item.client.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/table/cardTable", () => ({
  CardTable: ({ data }: any) => (
    <div data-testid="card-table">
      {data.map((item: any) => (
        <div key={item.client.id} data-testid="card-row">
          Mobile Card: {item.client.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/ui/datePickerInput", () => ({
  DatePickerInput: ({ label, onChange, value }: any) => (
    <label>
      {label}
      <input
        type="date"
        data-testid={`datepicker-${label}`}
        // Append time to prevent timezone shifting (UTC midnight -> Previous Day Local)
        onChange={(e) => onChange(new Date(e.target.value + "T12:00:00"))}
        value={value ? new Date(value).toISOString().split("T")[0] : ""}
      />
    </label>
  ),
}));

// Mock Icons/Spinner
jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// --- Mock Data ---

const mockReportsList = [
  {
    client: { id: "c1", name: "Client Alpha", country: "US" },
    totalMoved: 50000,
    alertCount: 2,
    riskLevel: "High",
  },
  {
    client: { id: "c2", name: "Client Beta", country: "BR" },
    totalMoved: 12000,
    alertCount: 0,
    riskLevel: "Low",
  },
];

// --- Tests ---

describe("ReportsPage (All Reports)", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Default Redux Mocks
    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (selectToken as jest.Mock).mockReturnValue("fake-token");

    // Default: Not loading, no error, empty data (to start specific tests clean)
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);
    (selectReportsError as jest.Mock).mockReturnValue(null);
    (selectAllReports as jest.Mock).mockReturnValue([]);
    
    // Mock Thunk Return
    (fetchAllReports as unknown as jest.Mock).mockReturnValue({ type: "reports/fetchAll/pending" });
  });

  it("fetches reports on mount with default date range", () => {
    // Default range logic in component is StartOfMonth -> Today
    render(<ReportsPage />);

    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchAllReports).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "fake-token",
        // We check existence of dates, exact string match depends on current date
        startDate: expect.any(String), 
        endDate: expect.any(String),
      })
    );
  });

  it("renders the loading spinner when loading", () => {
    (selectAllReportsLoading as jest.Mock).mockReturnValue(true);

    render(<ReportsPage />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    // Should not show empty state or table
    expect(screen.queryByText(/Nenhum relatório encontrado/i)).not.toBeInTheDocument();
  });

  it("renders an error message if the fetch fails", () => {
    (selectReportsError as jest.Mock).mockReturnValue("Falha ao carregar dados");

    render(<ReportsPage />);

    expect(screen.getByText("Falha ao carregar dados")).toBeInTheDocument();
  });

  it("renders the empty state when data is empty and not loading", () => {
    (selectAllReportsLoading as jest.Mock).mockReturnValue(false);
    (selectAllReports as jest.Mock).mockReturnValue([]);

    render(<ReportsPage />);

    expect(screen.getByText(/Nenhum relatório encontrado/i)).toBeInTheDocument();
    expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
  });

  describe("When data is available", () => {
    beforeEach(() => {
      (selectAllReportsLoading as jest.Mock).mockReturnValue(false);
      (selectAllReports as jest.Mock).mockReturnValue(mockReportsList);
    });

    it("renders the table (desktop) and card list (mobile)", () => {
      render(<ReportsPage />);

      // Check Desktop Table mock
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
      expect(screen.getByText("Client Alpha")).toBeInTheDocument();
      expect(screen.getByText("Client Beta")).toBeInTheDocument();

      // Check Mobile Card mock (Note: hidden via CSS class 'md:hidden' but rendered in DOM)
      expect(screen.getByTestId("card-table")).toBeInTheDocument();
      expect(screen.getByText("Mobile Card: Client Alpha")).toBeInTheDocument();
    });

    it("renders the page title and banner image", () => {
      render(<ReportsPage />);
      
      expect(screen.getByRole("heading", { name: /Relatórios/i })).toBeInTheDocument();
      expect(screen.getByAltText("UBS Watchdog")).toBeInTheDocument();
    });
  });

  it("updates filters and refetches data", async () => {
    render(<ReportsPage />);
    
    // Reset previous calls from mount
    mockDispatch.mockClear();

    const startDateInput = screen.getByTestId("datepicker-Data inicial");

    // Change Date
    fireEvent.change(startDateInput, { target: { value: "2023-11-01" } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(fetchAllReports).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.stringContaining("2023-11-01"),
        })
      );
    });
  });

  it("resets filters when 'Redefinir período' is clicked", async () => {
    render(<ReportsPage />);
    
    const resetButton = screen.getByText(/Redefinir período/i);
    const startDateInput = screen.getByTestId("datepicker-Data inicial");

    // 1. Change date manually first to something specific
    fireEvent.change(startDateInput, { target: { value: "2020-01-01" } });
    
    mockDispatch.mockClear();

    // 2. Click Reset
    fireEvent.click(resetButton);

    // 3. Expect dispatch called with current month (default logic)
    // We verify it was called with a date different from 2020-01-01
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      const calls = (fetchAllReports as unknown as jest.Mock).mock.calls;
      const lastCallArgs = calls[calls.length - 1][0];
      
      expect(lastCallArgs.startDate).not.toContain("2020-01-01");
    });
  });
});