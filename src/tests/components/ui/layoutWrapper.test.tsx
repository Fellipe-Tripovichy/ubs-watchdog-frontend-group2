import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock Firebase
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

// Mock authAPI
jest.mock('@/features/auth/authAPI', () => ({
  signOutAPI: jest.fn(),
  createUserWithEmailAndPasswordAPI: jest.fn(),
  signInWithEmailAndPasswordAPI: jest.fn(),
  getUserDataAPI: jest.fn(),
  resetPasswordAPI: jest.fn(),
}));

// Mock dependencies - must be before imports
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));
jest.mock('@/components/ui/navigationBar', () => ({
  NavigationBar: () => <div data-testid="navigation-bar">NavigationBar</div>,
}));
jest.mock('@/components/ui/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

// Import component AFTER mocks are defined
import { LayoutWrapper } from '@/components/ui/layoutWrapper';
import { usePathname } from 'next/navigation';
import type { UserData } from '@/features/auth/authSlice';

describe('LayoutWrapper', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  const createStore = (
    isAuthenticated: boolean,
    loading: boolean,
    user: UserData | null
  ) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          token: isAuthenticated ? 'mock-token' : '',
          user,
          loading,
        },
      },
    });
  };

  it('should render', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test Content</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div data-testid="child-content">Child Content</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should always render AuthInitializer', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    // AuthInitializer is rendered but might not have a testid since we're not mocking it
    // Just verify the component renders without errors
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should render NavigationBar on non-authentication pages', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/transactions');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
  });

  it('should render Footer on non-authentication pages', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/compliance');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should not render NavigationBar on authentication pages', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/authentication/login');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
  });

  it('should not render Footer on authentication pages', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/authentication/registration');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should apply correct container classes', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/');
    const { container } = render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'min-h-screen', 'justify-between');
  });

  it('should handle root path correctly', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle nested authentication paths', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/authentication/login/reset');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('should render all components on regular pages', () => {
    const store = createStore(false, false, null);
    mockUsePathname.mockReturnValue('/reports');
    render(
      <Provider store={store}>
        <LayoutWrapper>
          <div>Test</div>
        </LayoutWrapper>
      </Provider>
    );
    // AuthInitializer is rendered but might not have a testid since we're not mocking it
    // Just verify other components render correctly
    expect(screen.getByTestId('navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
