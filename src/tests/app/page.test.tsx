import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { cookies } from 'next/headers';

// Mock dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/heroTitle', () => ({
  HeroTitle: ({ children, subtitle, ...props }: any) => (
    <div data-testid="hero-title" {...props}>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

jest.mock('@/components/ui/cardButton', () => ({
  CardButton: ({ title, icon, description, ...props }: any) => (
    <div data-testid="card-button" data-title={title} data-icon={icon} {...props}>
      {title}
    </div>
  ),
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('UBS Watchdog')).toBeInTheDocument();
  });

  it('should render hero image', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    const { container } = render(component);
    
    const heroImage = container.querySelector('img[alt="UBS Watchdog"]');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/hero-image-1.jpg');
  });

  it('should render HeroTitle with correct content', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('UBS Watchdog')).toBeInTheDocument();
    expect(screen.getByText('Sistema integrado de monitoração de transações financeiras')).toBeInTheDocument();
  });

  it('should render login button when not authenticated', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('Faça seu login')).toBeInTheDocument();
    const loginLink = screen.getByText('Faça seu login').closest('a');
    expect(loginLink).toHaveAttribute('href', '/authentication/login');
  });

  it('should render transaction button when authenticated', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: 'test-token' });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('Faça uma nova transação')).toBeInTheDocument();
    const transactionLink = screen.getByText('Faça uma nova transação').closest('a');
    expect(transactionLink).toHaveAttribute('href', '/transactions');
  });

  it('should not render login button when authenticated', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: 'test-token' });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.queryByText('Faça seu login')).not.toBeInTheDocument();
  });

  it('should not render transaction button when not authenticated', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.queryByText('Faça uma nova transação')).not.toBeInTheDocument();
  });

  it('should render "O que é o UBS Watchdog?" section', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('O que é o UBS Watchdog?')).toBeInTheDocument();
    expect(screen.getByText(/O UBS Watchdog é uma plataforma inteligente de compliance/)).toBeInTheDocument();
  });

  it('should render "Serviços disponíveis" section', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('Serviços disponíveis')).toBeInTheDocument();
  });

  it('should render all service cards', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    const { container } = render(component);
    
    const cardButtons = container.querySelectorAll('[data-testid="card-button"]');
    expect(cardButtons.length).toBe(3);
    
    expect(screen.getByText('Realização de transações')).toBeInTheDocument();
    expect(screen.getByText('Monitoramento de conformidade')).toBeInTheDocument();
    expect(screen.getByText('Análise de relatórios')).toBeInTheDocument();
  });

  it('should render service cards with correct icons', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    const { container } = render(component);
    
    const transactionCard = container.querySelector('[data-title="Realização de transações"]');
    const complianceCard = container.querySelector('[data-title="Monitoramento de conformidade"]');
    const reportsCard = container.querySelector('[data-title="Análise de relatórios"]');
    
    expect(transactionCard).toHaveAttribute('data-icon', '/services-transaction.jpg');
    expect(complianceCard).toHaveAttribute('data-icon', '/services-compliance.jpg');
    expect(reportsCard).toHaveAttribute('data-icon', '/services-report.jpg');
  });

  it('should render service cards with correct links', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    const transactionLink = screen.getByText('Realização de transações').closest('a');
    const complianceLink = screen.getByText('Monitoramento de conformidade').closest('a');
    const reportsLink = screen.getByText('Análise de relatórios').closest('a');
    
    expect(transactionLink).toHaveAttribute('href', '/transactions');
    expect(complianceLink).toHaveAttribute('href', '/compliance');
    expect(reportsLink).toHaveAttribute('href', '/reports');
  });

  it('should handle cookies().get returning undefined', async () => {
    const mockCookieGet = jest.fn().mockReturnValue(undefined);
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    render(component);
    
    expect(screen.getByText('Faça seu login')).toBeInTheDocument();
  });

  it('should apply correct classes to main container', async () => {
    const mockCookieGet = jest.fn().mockReturnValue({ value: null });
    mockCookies.mockResolvedValue({
      get: mockCookieGet,
    } as any);

    const component = await Home();
    const { container } = render(component);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-start', 'justify-center');
  });
});
