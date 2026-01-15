import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '@/components/ui/footer';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

describe('Footer', () => {
  const mockScrollTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.scrollTo = mockScrollTo;
  });

  it('should render', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render as footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
  });

  it('should apply default classes to footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('w-full', 'mt-auto');
  });

  it('should render Breadcrumb component', () => {
    render(<Footer />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should render "Voltar ao topo" button', () => {
    render(<Footer />);
    expect(screen.getByText('Voltar ao topo')).toBeInTheDocument();
  });

  it('should render "Voltar ao topo" button with chevron-up icon', () => {
    const { container } = render(<Footer />);
    const button = screen.getByText('Voltar ao topo');
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should call scrollTo when "Voltar ao topo" button is clicked', () => {
    render(<Footer />);
    const button = screen.getByText('Voltar ao topo');
    fireEvent.click(button);
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should render UBS logo', () => {
    render(<Footer />);
    const logo = screen.getByAltText('UBS Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/UBS_Logo.png');
  });

  it('should render "Brasil" text', () => {
    render(<Footer />);
    expect(screen.getByText('Brasil')).toBeInTheDocument();
  });

  it('should render copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    expect(screen.getByText(`© ${currentYear} UBS. Todos os direitos reservados.`)).toBeInTheDocument();
  });

  it('should render footer links', () => {
    render(<Footer />);
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('should render footer links with correct hrefs', () => {
    render(<Footer />);
    const transactionsLink = screen.getByText('Transações').closest('a');
    const complianceLink = screen.getByText('Compliance').closest('a');
    const reportsLink = screen.getByText('Relatórios').closest('a');
    
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
    expect(complianceLink).toHaveAttribute('href', '/compliance');
    expect(reportsLink).toHaveAttribute('href', '/reports');
  });

  it('should render separators between footer links', () => {
    render(<Footer />);
    const separators = screen.getAllByText('|');
    expect(separators.length).toBe(2);
  });

  it('should render logo link to home', () => {
    render(<Footer />);
    const logoLink = screen.getByAltText('UBS Logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should apply correct classes to main container', () => {
    const { container } = render(<Footer />);
    const mainContainer = container.querySelector('.flex.md\\:flex-row.flex-col');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should apply correct classes to secondary section', () => {
    const { container } = render(<Footer />);
    const secondarySection = container.querySelector('.bg-secondary');
    expect(secondarySection).toBeInTheDocument();
  });

  it('should render all footer links as LinkButton components', () => {
    render(<Footer />); 
    const transactionsLink = screen.getByText('Transações').closest('a');
    const complianceLink = screen.getByText('Compliance').closest('a');
    const reportsLink = screen.getByText('Relatórios').closest('a');
    const topButton = screen.getByText('Voltar ao topo');
    expect(transactionsLink).toBeInTheDocument();
    expect(complianceLink).toBeInTheDocument();
    expect(reportsLink).toBeInTheDocument();
    expect(topButton).toBeInTheDocument();
  });

  it('should render footer links with small size', () => {
    render(<Footer />);
    const transactionsButton = screen.getByText('Transações').closest('button');
    expect(transactionsButton).toBeInTheDocument();
  });
});
