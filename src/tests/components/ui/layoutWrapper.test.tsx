import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Firebase before any imports that use it
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
}));

import { render, screen } from '@testing-library/react';
import { LayoutWrapper } from '@/components/ui/layoutWrapper';
import { usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@/components/ui/navigationBar', () => ({
  NavigationBar: () => <div data-testid="navigation-bar">NavigationBar</div>,
}));
jest.mock('@/components/ui/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));
jest.mock('@/components/authentication/authInitializer', () => ({
  AuthInitializer: () => <div data-testid="auth-initializer">AuthInitializer</div>,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('LayoutWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    mockUsePathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div>Test Content</div>
      </LayoutWrapper>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children', () => {
    mockUsePathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div data-testid="child-content">Child Content</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should always render AuthInitializer', () => {
    mockUsePathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
  });

  it('should render NavigationBar on non-authentication pages', () => {
    mockUsePathname.mockReturnValue('/transactions');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('should render Footer on non-authentication pages', () => {
    mockUsePathname.mockReturnValue('/compliance');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should not render NavigationBar on authentication pages', () => {
    mockUsePathname.mockReturnValue('/authentication/login');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
  });

  it('should not render Footer on authentication pages', () => {
    mockUsePathname.mockReturnValue('/authentication/registration');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should apply correct container classes', () => {
    mockUsePathname.mockReturnValue('/');
    const { container } = render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'min-h-screen', 'justify-between');
  });

  it('should handle root path correctly', () => {
    mockUsePathname.mockReturnValue('/');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle nested authentication paths', () => {
    mockUsePathname.mockReturnValue('/authentication/login/reset');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should render all components on regular pages', () => {
    mockUsePathname.mockReturnValue('/reports');
    render(
      <LayoutWrapper>
        <div>Test</div>
      </LayoutWrapper>
    );
    expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
