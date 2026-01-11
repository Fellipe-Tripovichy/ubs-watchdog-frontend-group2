import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import ReportsPage from '@/app/reports/page';

describe('ReportsPage', () => {
  it('should render', () => {
    render(<ReportsPage />);
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<ReportsPage />);
    const title = screen.getByText('Relatórios');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('should apply correct classes to title', () => {
    render(<ReportsPage />);
    const title = screen.getByText('Relatórios');
    expect(title).toHaveClass('text-[28px]', 'md:text-[40px]', 'font-regular', 'text-foreground');
  });

  it('should render description paragraph', () => {
    render(<ReportsPage />);
    expect(screen.getByText(/Análise de relatórios estratégicos para tomada de decisão ágil/)).toBeInTheDocument();
  });

  it('should apply correct classes to description', () => {
    render(<ReportsPage />);
    const description = screen.getByText(/Análise de relatórios estratégicos para tomada de decisão ágil/);
    expect(description).toHaveClass('text-[16px]', 'text-muted-foreground', 'mt-6');
  });

  it('should render "Funcionalidades" heading', () => {
    render(<ReportsPage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('should apply correct classes to "Funcionalidades" heading', () => {
    render(<ReportsPage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toHaveClass('text-[24px]', 'font-regular', 'text-secondary-foreground', 'mb-4');
  });

  it('should render all feature list items', () => {
    render(<ReportsPage />);
    expect(screen.getByText('Geração de relatórios personalizados')).toBeInTheDocument();
    expect(screen.getByText('Visualização de métricas e KPIs')).toBeInTheDocument();
    expect(screen.getByText('Exportação em múltiplos formatos')).toBeInTheDocument();
    expect(screen.getByText('Análise histórica de dados')).toBeInTheDocument();
  });

  it('should render features as list items', () => {
    render(<ReportsPage />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(4);
  });

  it('should apply correct classes to features list', () => {
    const { container } = render(<ReportsPage />);
    const list = container.querySelector('ul');
    expect(list).toHaveClass('list-disc', 'list-inside', 'space-y-2', 'text-muted-foreground');
  });

  it('should apply correct classes to features section', () => {
    const { container } = render(<ReportsPage />);
    const featuresSection = container.querySelector('.bg-secondary');
    expect(featuresSection).toBeInTheDocument();
    expect(featuresSection).toHaveClass('p-8', 'rounded-md');
  });

  it('should apply correct classes to main container', () => {
    const { container } = render(<ReportsPage />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-start', 'w-full');
  });

  it('should apply correct classes to content wrapper', () => {
    const { container } = render(<ReportsPage />);
    const contentWrapper = container.querySelector('.max-w-\\[1554px\\]');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass('w-full', 'mx-auto', 'px-4', 'md:px-8', 'py-10');
  });

  it('should render decorative line under title', () => {
    const { container } = render(<ReportsPage />);
    const decorativeLine = container.querySelector('.h-1.w-20.bg-primary');
    expect(decorativeLine).toBeInTheDocument();
  });

  it('should have correct structure with title, description, and features', () => {
    render(<ReportsPage />);
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText(/Análise de relatórios estratégicos/)).toBeInTheDocument();
    expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
    expect(screen.getByText('Geração de relatórios personalizados')).toBeInTheDocument();
  });
});
