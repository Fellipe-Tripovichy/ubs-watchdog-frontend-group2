import { render, screen } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Import after mocks are set up
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

// Get reference to the mocked function
const usePathnameMock = usePathname as jest.Mock;

describe('Breadcrumb', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/');
  });

  it('should render', () => {
    usePathnameMock.mockReturnValue('/');
    render(<Breadcrumb />);
    expect(screen.getByText('Você está aqui:')).toBeInTheDocument();
  });

  it('should render "Você está aqui:" text', () => {
    usePathnameMock.mockReturnValue('/');
    render(<Breadcrumb />);
    const text = screen.getByText('Você está aqui:');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('text-muted-foreground', 'font-semibold', 'text-sm');
  });

  it('should have data-slot attribute on breadcrumb nav', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const nav = container.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
  });

  it('should render Home for root path', () => {
    usePathnameMock.mockReturnValue('/');
    render(<Breadcrumb />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render mapped labels for known paths', () => {
    usePathnameMock.mockReturnValue('/transactions');
    render(<Breadcrumb />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Transações')).toBeInTheDocument();
  });

  it('should render mapped label for compliance path', () => {
    usePathnameMock.mockReturnValue('/compliance');
    render(<Breadcrumb />);
    expect(screen.getByText('Conformidade')).toBeInTheDocument();
  });

  it('should render mapped label for reports path', () => {
    usePathnameMock.mockReturnValue('/reports');
    render(<Breadcrumb />);
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('should render mapped label for authentication path', () => {
    usePathnameMock.mockReturnValue('/authentication');
    render(<Breadcrumb />);
    expect(screen.getByText('Autenticação')).toBeInTheDocument();
  });

  it('should capitalize unknown path segments', () => {
    usePathnameMock.mockReturnValue('/unknown-path');
    render(<Breadcrumb />);
    expect(screen.getByText('Unknown-path')).toBeInTheDocument();
  });

  it('should render multiple breadcrumb items for nested paths', () => {
    usePathnameMock.mockReturnValue('/transactions/123');
    render(<Breadcrumb />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render separators between breadcrumb items', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container} = render(<Breadcrumb />);
    const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    // Should have 1 separator between Home and Transações
    expect(separators.length).toBe(1);
  });

  it('should not render separator after last item', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    // Should have 1 separator (between Home and Transações), not after Transações
    expect(separators.length).toBe(1);
  });

  it('should render last item as BreadcrumbPage', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const breadcrumbPage = container.querySelector('[data-slot="breadcrumb-page"]');
    expect(breadcrumbPage).toBeInTheDocument();
    expect(breadcrumbPage).toHaveAttribute('aria-current', 'page');
  });

  it('should render non-last items as BreadcrumbLink', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const breadcrumbLink = container.querySelector('[data-slot="breadcrumb-link"]');
    expect(breadcrumbLink).toBeInTheDocument();
  });

  it('should have correct hrefs for breadcrumb links', () => {
    usePathnameMock.mockReturnValue('/transactions/123');
    render(<Breadcrumb />);
    const homeLink = screen.getByText('Home').closest('a');
    const transactionsLink = screen.getByText('Transações').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
  });

  it('should have data-slot attribute on BreadcrumbList', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const list = container.querySelector('[data-slot="breadcrumb-list"]');
    expect(list).toBeInTheDocument();
    expect(list?.tagName).toBe('OL');
  });

  it('should apply default classes to BreadcrumbList', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const list = container.querySelector('[data-slot="breadcrumb-list"]');
    expect(list).toHaveClass('text-muted-foreground', 'flex', 'flex-wrap', 'items-center');
  });

  it('should have data-slot attribute on BreadcrumbItem', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const items = container.querySelectorAll('[data-slot="breadcrumb-item"]');
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      expect(item?.tagName).toBe('LI');
    });
  });

  it('should apply default classes to BreadcrumbItem', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const item = container.querySelector('[data-slot="breadcrumb-item"]');
    expect(item).toHaveClass('inline-flex', 'items-center', 'gap-1.5');
  });

  it('should apply default classes to BreadcrumbLink', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const link = container.querySelector('[data-slot="breadcrumb-link"]');
    expect(link).toHaveClass('hover:text-foreground', 'transition-colors');
  });

  it('should apply default classes to BreadcrumbPage', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const page = container.querySelector('[data-slot="breadcrumb-page"]');
    expect(page).toHaveClass('text-foreground', 'font-normal');
  });

  it('should render ChevronRight separator icon', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
    const svg = separator?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply default classes to BreadcrumbSeparator', () => {
    usePathnameMock.mockReturnValue('/transactions');
    const { container } = render(<Breadcrumb />);
    const separator = container.querySelector('[data-slot="breadcrumb-separator"]');
    expect(separator).toHaveClass('[&>svg]:size-3.5');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply default classes to wrapper div', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2');
  });

  it('should handle deep nested paths', () => {
    usePathnameMock.mockReturnValue('/transactions/123/details');
    render(<Breadcrumb />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should pass through additional props to nav', () => {
    usePathnameMock.mockReturnValue('/');
    const { container } = render(<Breadcrumb data-testid="custom-breadcrumb" id="breadcrumb-id" />);
    const nav = container.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toHaveAttribute('data-testid', 'custom-breadcrumb');
    expect(nav).toHaveAttribute('id', 'breadcrumb-id');
  });

  it('should render correct number of separators for multiple segments', () => {
    usePathnameMock.mockReturnValue('/transactions/123/details');
    const { container } = render(<Breadcrumb />);
    const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    // Should have 3 separators: Home|Transações|123|Details
    expect(separators.length).toBe(3);
  });

  it('should handle empty pathname segments correctly', () => {
    usePathnameMock.mockReturnValue('//');
    render(<Breadcrumb />);
    // Should still render Home
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
