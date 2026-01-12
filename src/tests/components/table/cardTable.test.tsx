import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CardTable } from "@/components/table/cardTable"; // Adjust path if necessary

// --- Mocks ---

// Mock Next.js Link (used internally by Pagination components)
jest.mock("next/link", () => {
  return ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
});

// --- Test Data ---

interface TestItem {
  id: number;
  title: string;
  description: string;
}

const generateData = (count: number): TestItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Card Title ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));

// Helper to render a simple card
const renderTestCard = (item: TestItem) => (
  <div data-testid="test-card" className="border p-4">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
);

describe("CardTable", () => {
  it("renders cards correctly", () => {
    const data = generateData(3);
    render(<CardTable data={data} renderCard={renderTestCard} />);

    // Check if all cards are rendered
    expect(screen.getAllByTestId("test-card")).toHaveLength(3);
    expect(screen.getByText("Card Title 1")).toBeInTheDocument();
    expect(screen.getByText("Card Title 3")).toBeInTheDocument();
  });

  it("applies default and custom grid class names", () => {
    const data = generateData(1);
    
    // Test Default
    const { container: containerDefault } = render(
      <CardTable data={data} renderCard={renderTestCard} />
    );
    // The first div inside the fragment is the grid container
    expect(containerDefault.firstChild).toHaveClass("grid grid-cols-1 sm:grid-cols-2 gap-4");

    // Test Custom
    const { container: containerCustom } = render(
      <CardTable 
        data={data} 
        renderCard={renderTestCard} 
        gridClassName="grid-cols-4 gap-8 custom-class" 
      />
    );
    expect(containerCustom.firstChild).toHaveClass("grid-cols-4 gap-8 custom-class");
  });

  it("handles empty data gracefully", () => {
    render(<CardTable data={[]} renderCard={renderTestCard} />);

    // No cards should be rendered
    expect(screen.queryByTestId("test-card")).not.toBeInTheDocument();
    // No pagination should be rendered
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  describe("Pagination Logic", () => {
    const data15 = generateData(15); // 15 items, 10 per page = 2 pages

    it("renders pagination only when pages > 1", () => {
      // 5 items, 10 per page = 1 page. No pagination.
      const { rerender } = render(
        <CardTable data={data15.slice(0, 5)} itemsPerPage={10} renderCard={renderTestCard} />
      );
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

      // 15 items, 10 per page = 2 pages. Show pagination.
      rerender(
        <CardTable data={data15} itemsPerPage={10} renderCard={renderTestCard} />
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("displays the correct number of items per page", () => {
      render(<CardTable data={data15} itemsPerPage={10} renderCard={renderTestCard} />);

      // Should show Item 1 to Item 10
      expect(screen.getByText("Card Title 1")).toBeInTheDocument();
      expect(screen.getByText("Card Title 10")).toBeInTheDocument();
      
      // Should NOT show Item 11
      expect(screen.queryByText("Card Title 11")).not.toBeInTheDocument();
    });

    it("navigates to the next and previous pages", () => {
      render(<CardTable data={data15} itemsPerPage={10} renderCard={renderTestCard} />);

      const nextButton = screen.getByLabelText("Go to next page");
      const prevButton = screen.getByLabelText("Go to previous page");

      // Verify Page 1
      expect(prevButton).toHaveClass("pointer-events-none"); // Disabled
      expect(screen.getByText("Card Title 1")).toBeInTheDocument();

      // Click Next
      fireEvent.click(nextButton);

      // Verify Page 2
      expect(screen.queryByText("Card Title 1")).not.toBeInTheDocument();
      expect(screen.getByText("Card Title 11")).toBeInTheDocument();
      expect(nextButton).toHaveClass("pointer-events-none"); // Disabled at end

      // Click Prev
      fireEvent.click(prevButton);

      // Verify Page 1 again
      expect(screen.getByText("Card Title 1")).toBeInTheDocument();
    });

    it("navigates by clicking page numbers", () => {
      render(<CardTable data={data15} itemsPerPage={10} renderCard={renderTestCard} />);

      const page2Link = screen.getByText("2");
      fireEvent.click(page2Link);

      expect(screen.getByText("Card Title 11")).toBeInTheDocument();
    });
  });

  describe("Complex Pagination (Ellipsis)", () => {
    // Generate 100 items, 10 per page = 10 pages.
    const data100 = generateData(100);

    it("renders ellipsis correctly for many pages", () => {
      render(<CardTable data={data100} itemsPerPage={10} renderCard={renderTestCard} />);

      // Logic: 1, 2, ... 10 (Ellipsis at end) - actual behavior shows 1, 2, ellipsis, 10
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      
      // Check for ellipsis (aria-hidden=true spans, or text "More pages" in SR)
      // Usually Shadcn/Radix pagination renders "More pages" for screen readers
      const ellipsis = screen.getAllByText("More pages");
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("adjusts visible pages when navigating to the middle", () => {
      render(<CardTable data={data100} itemsPerPage={10} renderCard={renderTestCard} />);

      // Advance to page 5
      const nextButton = screen.getByLabelText("Go to next page");
      fireEvent.click(nextButton); // 2
      fireEvent.click(nextButton); // 3
      fireEvent.click(nextButton); // 4
      fireEvent.click(nextButton); // 5

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  it("resets to page 1 when data length changes", () => {
    const { rerender } = render(
      <CardTable data={generateData(20)} itemsPerPage={10} renderCard={renderTestCard} />
    );

    // Go to page 2
    fireEvent.click(screen.getByLabelText("Go to next page"));
    expect(screen.getByText("Card Title 11")).toBeInTheDocument();

    // Rerender with smaller data set
    rerender(
      <CardTable data={generateData(5)} itemsPerPage={10} renderCard={renderTestCard} />
    );

    // Should be back on page 1 (Item 1 visible)
    expect(screen.getByText("Card Title 1")).toBeInTheDocument();
    // Pagination should disappear
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("uses custom getRowKey if provided", () => {
    const data = [{ id: 99, title: "Special", description: "Desc" }];
    const customKeySpy = jest.fn((item) => `custom-${item.id}`);

    render(
      <CardTable 
        data={data} 
        renderCard={renderTestCard} 
        getRowKey={customKeySpy} 
      />
    );

    // Ensure the function was called
    expect(customKeySpy).toHaveBeenCalledWith(data[0], 0);
  });
});