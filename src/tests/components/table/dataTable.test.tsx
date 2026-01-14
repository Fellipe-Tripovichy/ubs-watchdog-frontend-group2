import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DataTable, ColumnDef } from "@/components/table/dataTable"; // Adjust path if necessary

// --- Mocks ---

// Mock Next.js Link (used internally by Pagination components potentially)
jest.mock("next/link", () => {
  return ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
});

// We can rely on the real UI components for Table/Pagination since they are presentational.
// However, if your Pagination components use complex icons that fail in JSDOM, 
// you might need to mock lucide-react. Assuming standard setup implies they work.

// --- Test Data ---

interface TestData {
  id: number;
  name: string;
  role: string;
}

const columns: ColumnDef<TestData>[] = [
  { key: "id", label: "ID", accessor: "id" },
  { key: "name", label: "Name", accessor: "name" },
  { 
    key: "role", 
    label: "Role", 
    // Test function accessor
    accessor: (item) => item.role.toUpperCase() 
  },
  {
    key: "actions",
    label: "Actions",
    // Test custom render
    render: (item) => <button>Edit {item.name}</button>,
  },
];

const generateData = (count: number): TestData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    role: "member",
  }));

describe("DataTable", () => {
  it("renders headers and data correctly", () => {
    const data = generateData(2);
    render(<DataTable columns={columns} data={data} />);

    // Check Headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    // Check Rows (String Accessor)
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();

    // Check Rows (Function Accessor - should be uppercase)
    // MEMBER appears in multiple rows, so we check that at least one exists
    expect(screen.getAllByText("MEMBER").length).toBeGreaterThan(0);

    // Check Custom Render
    expect(screen.getByText("Edit User 1")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(<DataTable columns={columns} data={[]} />);
    
    // When data is empty, component shows Empty state instead of table
    expect(screen.getByText("Nenhum dado disponível")).toBeInTheDocument();
    expect(screen.getByText("Não há dados para exibir no momento. Refaça sua busca ou entre em contato com o suporte.")).toBeInTheDocument();
    
    // Table headers should not be present when showing empty state
    expect(screen.queryByText("ID")).not.toBeInTheDocument();
    
    // Pagination should not render
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  describe("Pagination Logic", () => {
    const data15 = generateData(15); // 15 items, 10 per page = 2 pages

    it("renders pagination only when pages > 1", () => {
      // 5 items, 10 per page = 1 page. No pagination.
      const { rerender } = render(<DataTable columns={columns} data={data15.slice(0, 5)} itemsPerPage={10} />);
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

      // 15 items, 10 per page = 2 pages. Show pagination.
      rerender(<DataTable columns={columns} data={data15} itemsPerPage={10} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("displays the correct number of items per page", () => {
      render(<DataTable columns={columns} data={data15} itemsPerPage={10} />);

      // Should show User 1 to User 10
      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 10")).toBeInTheDocument();
      
      // Should NOT show User 11
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });

    it("navigates to the next page", () => {
      render(<DataTable columns={columns} data={data15} itemsPerPage={10} />);

      const nextButton = screen.getByLabelText("Go to next page"); // Standard Aria label for PaginationNext
      
      fireEvent.click(nextButton);

      // Now User 11 should be visible
      expect(screen.getByText("User 11")).toBeInTheDocument();
      // User 1 should be gone
      expect(screen.queryByText("User 1")).not.toBeInTheDocument();
    });

    it("navigates to the previous page", () => {
      render(<DataTable columns={columns} data={data15} itemsPerPage={10} />);

      // Go to page 2 first
      const nextButton = screen.getByLabelText("Go to next page");
      fireEvent.click(nextButton);
      expect(screen.getByText("User 11")).toBeInTheDocument();

      // Go back
      const prevButton = screen.getByLabelText("Go to previous page");
      fireEvent.click(prevButton);

      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });

    it("navigates by clicking page numbers", () => {
      render(<DataTable columns={columns} data={data15} itemsPerPage={10} />);

      // Find page 2 link (use getAllByText and filter for pagination links)
      const page2Links = screen.getAllByText("2");
      const page2Link = page2Links.find((el) => el.closest('[data-slot="pagination-link"]'));
      expect(page2Link).toBeDefined();
      if (page2Link) {
        fireEvent.click(page2Link);
      }

      expect(screen.getByText("User 11")).toBeInTheDocument();
    });

    it("disables Previous button on first page and Next button on last page", () => {
      render(<DataTable columns={columns} data={data15} itemsPerPage={10} />);

      const prevButton = screen.getByLabelText("Go to previous page");
      const nextButton = screen.getByLabelText("Go to next page");

      // On Page 1: Prev disabled
      // Note: The component uses classes "pointer-events-none opacity-50"
      expect(prevButton).toHaveClass("pointer-events-none");
      
      // Go to Page 2 (Last page)
      fireEvent.click(nextButton);
      
      // On Page 2: Next disabled
      expect(nextButton).toHaveClass("pointer-events-none");
    });
  });

  describe("Complex Pagination (Ellipsis)", () => {
    // Generate 100 items, 10 per page = 10 pages.
    // The logic in renderPaginationItems splits behavior at > 7 pages.
    const data100 = generateData(100);

    it("renders ellipsis correctly for many pages", () => {
      render(<DataTable columns={columns} data={data100} itemsPerPage={10} />);

      // Logic: 1, 2, ... 10 (Ellipsis at end) - actual behavior shows 1, 2, ellipsis, 10
      // Numbers appear in both table cells and pagination, so we check pagination links specifically
      const navigation = screen.getByRole("navigation");
      expect(within(navigation).getByText("1")).toBeInTheDocument();
      expect(within(navigation).getByText("2")).toBeInTheDocument();
      expect(within(navigation).getByText("10")).toBeInTheDocument();
      
      // Find ellipsis (usually rendered as text "More pages" or similar, or an icon)
      // The `PaginationEllipsis` component usually contains "More pages" in screen-reader text
      // or simply render specific visual indicators. 
      // We can check existence of the ellipsis list item if we can't match text easily.
      // Based on Shadcn/Radix default, it often has aria-label="More pages" or text "..."
      const ellipsis = screen.getAllByText("More pages"); // Common SR text
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("adjusts visible pages when in the middle of the list", () => {
      render(<DataTable columns={columns} data={data100} itemsPerPage={10} />);

      // Go to page 5
      // Since 5 is likely hidden initially (1,2,3 ... 10), we might need to click Next multiple times 
      // or if we can't click it directly.
      // Let's click "Next" 4 times.
      const nextButton = screen.getByLabelText("Go to next page");
      fireEvent.click(nextButton); // p2
      fireEvent.click(nextButton); // p3
      fireEvent.click(nextButton); // p4
      fireEvent.click(nextButton); // p5

      // Logic for middle pages: 1 ... 4 5 6 ... 10
      // Numbers appear in both table cells and pagination, so we check pagination links specifically
      const navigation = screen.getByRole("navigation");
      expect(within(navigation).getByText("1")).toBeInTheDocument();
      expect(within(navigation).getByText("4")).toBeInTheDocument();
      expect(within(navigation).getByText("5")).toBeInTheDocument(); // Current
      expect(within(navigation).getByText("6")).toBeInTheDocument();
      expect(within(navigation).getByText("10")).toBeInTheDocument();
    });
  });

  it("resets to page 1 when data length changes", () => {
    const { rerender } = render(<DataTable columns={columns} data={generateData(20)} itemsPerPage={10} />);

    // Go to page 2
    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(screen.getByText("User 11")).toBeInTheDocument();

    // Rerender with new data (different length)
    rerender(<DataTable columns={columns} data={generateData(5)} itemsPerPage={10} />);

    // Should be back on page 1 (User 1 visible) and no pagination (since 5 < 10)
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});