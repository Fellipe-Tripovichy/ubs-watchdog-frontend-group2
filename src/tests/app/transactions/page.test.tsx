import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import TransactionsPage from '@/app/transactions/page';

describe('TransactionsPage', () => {
  it('should render', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Transações')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<TransactionsPage />);
    const title = screen.getByText('Transações');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('should apply correct classes to title', () => {
    render(<TransactionsPage />);
    const title = screen.getByText('Transações');
    expect(title).toHaveClass('text-[28px]', 'md:text-[40px]', 'font-regular', 'text-foreground');
  });

  it('should render description paragraph', () => {
    render(<TransactionsPage />);
    expect(screen.getByText(/Monitoração de transações financeiras em tempo real/)).toBeInTheDocument();
  });

  it('should apply correct classes to description', () => {
    render(<TransactionsPage />);
    const description = screen.getByText(/Monitoração de transações financeiras em tempo real/);
    expect(description).toHaveClass('text-[16px]', 'text-muted-foreground', 'mt-6');
  });

  it('should render "Funcionalidades" heading', () => {
    render(<TransactionsPage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('should apply correct classes to "Funcionalidades" heading', () => {
    render(<TransactionsPage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toHaveClass('text-[24px]', 'font-regular', 'text-secondary-foreground', 'mb-4');
  });

  it('should render all feature list items', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Visualização de transações em tempo real')).toBeInTheDocument();
    expect(screen.getByText('Filtros avançados de busca')).toBeInTheDocument();
    expect(screen.getByText('Exportação de dados')).toBeInTheDocument();
    expect(screen.getByText('Detecção automática de anomalias')).toBeInTheDocument();
  });

  it('should render features as list items', () => {
    render(<TransactionsPage />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(4);
  });

  it('should apply correct classes to features list', () => {
    const { container } = render(<TransactionsPage />);
    const list = container.querySelector('ul');
    expect(list).toHaveClass('list-disc', 'list-inside', 'space-y-2', 'text-muted-foreground');
  });

  it('should apply correct classes to features section', () => {
    const { container } = render(<TransactionsPage />);
    const featuresSection = container.querySelector('.bg-secondary');
    expect(featuresSection).toBeInTheDocument();
    expect(featuresSection).toHaveClass('p-8', 'rounded-md');
  });

  it('should apply correct classes to main container', () => {
    const { container } = render(<TransactionsPage />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-start');
  });

  it('should apply correct classes to content wrapper', () => {
    const { container } = render(<TransactionsPage />);
    const contentWrapper = container.querySelector('.max-w-\\[1554px\\]');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass('w-full', 'mx-auto', 'px-4', 'md:px-8', 'py-10');
  });

  it('should render decorative line under title', () => {
    const { container } = render(<TransactionsPage />);
    const decorativeLine = container.querySelector('.h-1.w-20.bg-primary');
    expect(decorativeLine).toBeInTheDocument();
  });

  it('should have correct structure with title, description, and features', () => {
    render(<TransactionsPage />);
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText(/Monitoração de transações financeiras/)).toBeInTheDocument();
    expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
    expect(screen.getByText('Visualização de transações em tempo real')).toBeInTheDocument();
  });
});
