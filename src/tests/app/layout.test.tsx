import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';
import { metadata } from '@/app/layout';

// Mock dependencies
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    variable: 'mock-font-variable',
    className: 'mock-font-class',
  })),
}));

jest.mock('@/lib/redux-provider', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="redux-provider">{children}</div>
  ),
}));

jest.mock('@/components/ui/layoutWrapper', () => ({
  LayoutWrapper: ({ children }: any) => (
    <div data-testid="layout-wrapper">{children}</div>
  ),
}));

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render html element with correct attributes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const html = container.querySelector('html');
    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveAttribute('suppressHydrationWarning');
  });

  it('should render body element with correct attributes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const body = container.querySelector('body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveAttribute('suppressHydrationWarning');
  });

  it('should apply font variable class to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const body = container.querySelector('body');
    expect(body).toHaveClass('mock-font-variable');
  });

  it('should apply default classes to body', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const body = container.querySelector('body');
    expect(body).toHaveClass('antialiased', 'bg-background');
  });

  it('should render ReduxProvider', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
  });

  it('should render LayoutWrapper', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    expect(screen.getByTestId('layout-wrapper')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child Content</div>
      </RootLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <RootLayout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </RootLayout>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should have correct component hierarchy', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const reduxProvider = screen.getByTestId('redux-provider');
    const layoutWrapper = screen.getByTestId('layout-wrapper');
    
    expect(reduxProvider).toContainElement(layoutWrapper);
    expect(layoutWrapper).toContainElement(screen.getByText('Test'));
  });

  it('should have correct metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('UBS Watchdog');
    expect(metadata.description).toBe('UBS Watchdog Frontend Application');
    if (metadata.icons && typeof metadata.icons === 'object' && 'icon' in metadata.icons) {
      expect(metadata.icons.icon).toBe('/favicon.jpg');
    }
  });

  it('should render with empty children', () => {
    render(<RootLayout>{null}</RootLayout>);
    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('layout-wrapper')).toBeInTheDocument();
  });

  it('should render with React fragment as children', () => {
    render(
      <RootLayout>
        <>
          <div>Fragment Child 1</div>
          <div>Fragment Child 2</div>
        </>
      </RootLayout>
    );
    expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
  });
});
