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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigationBar } from '@/components/ui/navigationBar';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated, selectLoading, selectUser } from '@/features/auth/authSlice';

// Mock dependencies
jest.mock('@/lib/hooks');
jest.mock('next/navigation');
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('NavigationBar', () => {
  const mockDispatch = jest.fn();
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAppDispatch as any).mockReturnValue(mockDispatch);
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  const setupMocks = (isAuthenticated: boolean, loading: boolean, user: any) => {
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectIsAuthenticated) {
        return isAuthenticated;
      }
      if (selector === selectLoading) {
        return loading;
      }
      if (selector === selectUser) {
        return user;
      }
      return null;
    });
  };

  it('should render NavigationBar component', () => {
    setupMocks(false, false, null);

    render(<NavigationBar />);
    const logo = screen.getByAltText('UBS Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should display logo and Brasil text', () => {
    setupMocks(false, false, null);

    render(<NavigationBar />);
    expect(screen.getByAltText('UBS Logo')).toBeInTheDocument();
    expect(screen.getByText('Brasil')).toBeInTheDocument();
  });

  it('should render navigation items when not authenticated', () => {
    setupMocks(false, false, null);

    render(<NavigationBar />);
    expect(screen.getByText('Transações')).toBeInTheDocument();
    expect(screen.getByText('Conformidade')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('should show login button when not authenticated', () => {
    setupMocks(false, false, null);

    render(<NavigationBar />);
    expect(screen.getByText('Faça seu login')).toBeInTheDocument();
  });

  it('should show loading state in login button when loading', () => {
    setupMocks(false, true, null);

    render(<NavigationBar />);
    expect(screen.getByText('Buscando usuário...')).toBeInTheDocument();
  });

  it('should render user info when authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };

    setupMocks(true, false, mockUser);

    render(<NavigationBar />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument(); 
  });

  it('should show logout button when authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };

    setupMocks(true, false, mockUser);

    render(<NavigationBar />);
    expect(screen.getByText('Faça seu logout')).toBeInTheDocument();
  });

  it('should toggle drawer when menu icon is clicked', () => {
    setupMocks(false, false, null);

    const { container } = render(<NavigationBar />);
    const menuButton = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Transações')).toBeInTheDocument();
  });

  it('should close drawer when close button is clicked', async () => {
    setupMocks(false, false, null);

    const { container } = render(<NavigationBar />);
    const menuButton = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    
    const closeButton = screen.getByLabelText('Fechar menu');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(closeButton).not.toBeVisible();
    });
  });

  it('should call handleLogout when logout button is clicked', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };

    setupMocks(true, false, mockUser);
    (mockDispatch as any).mockResolvedValue({ type: 'auth/logout/fulfilled' });

    render(<NavigationBar />);
    const logoutButton = screen.getByText('Faça seu logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should navigate to login page when navigation items are clicked and not authenticated', () => {
    setupMocks(false, false, null);

    render(<NavigationBar />);
    const transactionsLink = screen.getByText('Transações').closest('a');
    expect(transactionsLink).toHaveAttribute('href', '/authentication/login');
  });

  it('should navigate to correct pages when authenticated', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };

    setupMocks(true, false, mockUser);

    render(<NavigationBar />);
    const transactionsLink = screen.getByText('Transações').closest('a');
    expect(transactionsLink).toHaveAttribute('href', '/transactions');
  });

  it('should display user avatar with first letter of displayName', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'John Doe',
      emailVerified: true,
    };

    setupMocks(true, false, mockUser);

    render(<NavigationBar />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should handle drawer keyboard events', () => {
    setupMocks(false, false, null);

    const { container } = render(<NavigationBar />);
    const menuButton = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    
    const closeButton = screen.getByLabelText('Fechar menu');
    fireEvent.keyDown(closeButton, { key: 'Enter' });
    fireEvent.keyDown(closeButton, { key: ' ' });
  });
});
