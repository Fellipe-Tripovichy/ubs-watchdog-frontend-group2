import { render, screen, fireEvent } from '@testing-library/react';
import { createPaginationItem, renderPaginationItems } from '@/components/table/paginationUtils';

jest.mock('@/components/ui/pagination', () => ({
  PaginationItem: ({ children, key }: any) => (
    <li key={key} data-testid="pagination-item">{children}</li>
  ),
  PaginationLink: ({ children, href, onClick, isActive, className }: any) => (
    <a
      href={href}
      onClick={onClick}
      data-testid="pagination-link"
      data-active={isActive}
      className={className}
    >
      {children}
    </a>
  ),
  PaginationEllipsis: () => (
    <span data-testid="pagination-ellipsis">More pages</span>
  ),
}));

describe('paginationUtils', () => {
  describe('createPaginationItem', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a pagination item with correct page number', () => {
      const { container } = render(
        <>{createPaginationItem(1, 1, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveTextContent('1');
    });

    it('should set isActive to true when page number matches current page', () => {
      const { container } = render(
        <>{createPaginationItem(5, 5, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveAttribute('data-active', 'true');
    });

    it('should set isActive to false when page number does not match current page', () => {
      const { container } = render(
        <>{createPaginationItem(3, 5, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveAttribute('data-active', 'false');
    });

    it('should call onPageChange with correct page number when clicked', () => {
      const { container } = render(
        <>{createPaginationItem(3, 1, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      fireEvent.click(link);
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should prevent default link behavior', () => {
      const { container } = render(
        <>{createPaginationItem(2, 1, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      fireEvent(link, clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should have correct href attribute', () => {
      const { container } = render(
        <>{createPaginationItem(4, 1, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveAttribute('href', '#');
    });

    it('should have cursor-pointer className', () => {
      const { container } = render(
        <>{createPaginationItem(2, 1, mockOnPageChange)}</>
      );
      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveClass('cursor-pointer');
    });
  });

  describe('renderPaginationItems', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render all pages when totalPages <= 7', () => {
      const items = renderPaginationItems(1, 5, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links).toHaveLength(5);
      expect(links[0]).toHaveTextContent('1');
      expect(links[4]).toHaveTextContent('5');
    });

    it('should render all pages when totalPages equals 7', () => {
      const items = renderPaginationItems(4, 7, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links).toHaveLength(7);
      expect(screen.queryByTestId('pagination-ellipsis')).not.toBeInTheDocument();
    });

    it('should render ellipsis at start when currentPage > 3', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const ellipsis = screen.getAllByTestId('pagination-ellipsis');
      expect(ellipsis.length).toBeGreaterThan(0);
      const links = screen.getAllByTestId('pagination-link');
      expect(links[0]).toHaveTextContent('1');
    });

    it('should render ellipsis at end when currentPage < totalPages - 2', () => {
      const items = renderPaginationItems(3, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const ellipsis = screen.getAllByTestId('pagination-ellipsis');
      expect(ellipsis.length).toBeGreaterThan(0);
      const links = screen.getAllByTestId('pagination-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveTextContent('10');
    });

    it('should render correct pages around current page when totalPages > 7', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const pageNumbers = links.map(link => link.textContent);
      expect(pageNumbers).toContain('1');
      expect(pageNumbers).toContain('4');
      expect(pageNumbers).toContain('5');
      expect(pageNumbers).toContain('6');
      expect(pageNumbers).toContain('10');
    });

    it('should mark current page as active', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const currentPageLink = links.find(link => link.textContent === '5');
      expect(currentPageLink).toHaveAttribute('data-active', 'true');
    });

    it('should handle currentPage at the beginning (page 1)', () => {
      const items = renderPaginationItems(1, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links[0]).toHaveTextContent('1');
      expect(links[0]).toHaveAttribute('data-active', 'true');
    });

    it('should handle currentPage at the end', () => {
      const items = renderPaginationItems(10, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveTextContent('10');
      expect(lastLink).toHaveAttribute('data-active', 'true');
    });

    it('should handle currentPage near the beginning (page 2)', () => {
      const items = renderPaginationItems(2, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links[0]).toHaveTextContent('1');
      expect(links[1]).toHaveTextContent('2');
      expect(links[1]).toHaveAttribute('data-active', 'true');
    });

    it('should handle currentPage near the end', () => {
      const items = renderPaginationItems(9, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveTextContent('10');
    });

    it('should not render ellipsis at start when currentPage <= 3', () => {
      const items = renderPaginationItems(3, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links[0]).toHaveTextContent('1');
    });

    it('should not render ellipsis at end when currentPage >= totalPages - 2', () => {
      const items = renderPaginationItems(9, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const lastLink = links[links.length - 1];
      expect(lastLink).toHaveTextContent('10');
    });

    it('should render both ellipsis when currentPage is in the middle', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const ellipsis = screen.getAllByTestId('pagination-ellipsis');
      expect(ellipsis.length).toBe(2);
    });

    it('should exclude page 1 and totalPages from middle range', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const pageNumbers = links.map(link => link.textContent);
      const middlePages = pageNumbers.filter((num, index) => 
        index > 0 && index < pageNumbers.length - 1 && num !== 'More pages'
      );
      expect(middlePages).not.toContain('1');
      expect(middlePages).not.toContain('10');
    });

    it('should handle single page', () => {
      const items = renderPaginationItems(1, 1, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('1');
      expect(links[0]).toHaveAttribute('data-active', 'true');
    });

    it('should call onPageChange with correct page when link is clicked', () => {
      const items = renderPaginationItems(3, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const page2Link = links.find(link => link.textContent === '2');
      if (page2Link) {
        fireEvent.click(page2Link);
        expect(mockOnPageChange).toHaveBeenCalledWith(2);
      }
    });

    it('should calculate startPage correctly', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const pageNumbers = links
        .map(link => link.textContent)
        .filter(num => num && !isNaN(Number(num)))
        .map(Number);
      expect(pageNumbers).toContain(4);
      expect(pageNumbers).toContain(5);
      expect(pageNumbers).toContain(6);
    });

    it('should calculate endPage correctly', () => {
      const items = renderPaginationItems(5, 10, mockOnPageChange);
      const { container } = render(<>{items}</>);
      const links = screen.getAllByTestId('pagination-link');
      const pageNumbers = links
        .map(link => link.textContent)
        .filter(num => num && !isNaN(Number(num)))
        .map(Number);
      expect(Math.max(...pageNumbers)).toBeLessThanOrEqual(10);
    });
  });
});
