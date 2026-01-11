import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CompliancePage from '@/app/compliance/page';

describe('CompliancePage', () => {
  it('should render', () => {
    render(<CompliancePage />);
    expect(screen.getByText('Conformidade')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<CompliancePage />);
    const title = screen.getByText('Conformidade');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('should apply correct classes to title', () => {
    render(<CompliancePage />);
    const title = screen.getByText('Conformidade');
    expect(title).toHaveClass('text-[28px]', 'md:text-[40px]', 'font-regular', 'text-foreground');
  });

  it('should render description paragraph', () => {
    render(<CompliancePage />);
    expect(screen.getByText(/Monitoramento de conformidade e detecção proativa de riscos financeiros/)).toBeInTheDocument();
  });

  it('should apply correct classes to description', () => {
    render(<CompliancePage />);
    const description = screen.getByText(/Monitoramento de conformidade e detecção proativa de riscos financeiros/);
    expect(description).toHaveClass('text-[16px]', 'text-muted-foreground', 'mt-6');
  });

  it('should render "Funcionalidades" heading', () => {
    render(<CompliancePage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('should apply correct classes to "Funcionalidades" heading', () => {
    render(<CompliancePage />);
    const heading = screen.getByText('Funcionalidades');
    expect(heading).toHaveClass('text-[24px]', 'font-regular', 'text-secondary-foreground', 'mb-4');
  });

  it('should render all feature list items', () => {
    render(<CompliancePage />);
    expect(screen.getByText('Monitoramento contínuo de conformidade')).toBeInTheDocument();
    expect(screen.getByText('Detecção de padrões suspeitos')).toBeInTheDocument();
    expect(screen.getByText('Alertas em tempo real')).toBeInTheDocument();
    expect(screen.getByText('Análise de risco automatizada')).toBeInTheDocument();
  });

  it('should render features as list items', () => {
    render(<CompliancePage />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(4);
  });

  it('should apply correct classes to features list', () => {
    const { container } = render(<CompliancePage />);
    const list = container.querySelector('ul');
    expect(list).toHaveClass('list-disc', 'list-inside', 'space-y-2', 'text-muted-foreground');
  });

  it('should apply correct classes to features section', () => {
    const { container } = render(<CompliancePage />);
    const featuresSection = container.querySelector('.bg-secondary');
    expect(featuresSection).toBeInTheDocument();
    expect(featuresSection).toHaveClass('p-8', 'rounded-md');
  });

  it('should apply correct classes to main container', () => {
    const { container } = render(<CompliancePage />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-start', 'w-full');
  });

  it('should apply correct classes to content wrapper', () => {
    const { container } = render(<CompliancePage />);
    const contentWrapper = container.querySelector('.max-w-\\[1554px\\]');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass('w-full', 'mx-auto', 'px-4', 'md:px-8', 'py-10');
  });

  it('should render decorative line under title', () => {
    const { container } = render(<CompliancePage />);
    const decorativeLine = container.querySelector('.h-1.w-20.bg-primary');
    expect(decorativeLine).toBeInTheDocument();
  });

  it('should have correct structure with title, description, and features', () => {
    render(<CompliancePage />);
    expect(screen.getByText('Conformidade')).toBeInTheDocument();
    expect(screen.getByText(/Monitoramento de conformidade e detecção proativa/)).toBeInTheDocument();
    expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
    expect(screen.getByText('Monitoramento contínuo de conformidade')).toBeInTheDocument();
  });
});
