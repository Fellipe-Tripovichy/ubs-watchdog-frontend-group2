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

import { render, waitFor } from '@testing-library/react';
import { AuthInitializer } from '@/components/authentication/authInitializer';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { getUserData, selectIsAuthenticated, selectUser, toggleLoading } from '@/features/auth/authSlice';

// Mock dependencies
jest.mock('@/lib/hooks');
jest.mock('@/features/auth/authSlice', () => ({
  ...(jest.requireActual('@/features/auth/authSlice') as any),
  getUserData: jest.fn(() => ({ type: 'auth/getUserData/pending' })),
  toggleLoading: jest.fn(() => ({ type: 'auth/toggleLoading/pending' })),
}));

const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;
const mockGetUserData = getUserData as jest.MockedFunction<typeof getUserData>;
const mockToggleLoading = toggleLoading as jest.MockedFunction<typeof toggleLoading>;

describe('AuthInitializer', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAppDispatch as any).mockReturnValue(mockDispatch);
    mockGetUserData.mockReturnValue({ type: 'auth/getUserData/pending' } as any);
    mockToggleLoading.mockReturnValue({ type: 'auth/toggleLoading/pending' } as any);
    
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  const setupMocks = (isAuthenticated: boolean, user: any) => {
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectIsAuthenticated) {
        return isAuthenticated;
      }
      if (selector === selectUser) {
        return user;
      }
      return null;
    });
  };

  it('should render without errors', () => {
    setupMocks(false, null);
    document.cookie = '';
    
    render(<AuthInitializer />);
    // Component returns null, so nothing to assert on render
    expect(true).toBe(true);
  });

  it('should dispatch getUserData when accessToken exists and user is not authenticated and no user', async () => {
    setupMocks(false, null);
    document.cookie = 'accessToken=test-token';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockGetUserData());
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user is authenticated', async () => {
    setupMocks(true, null);
    document.cookie = 'accessToken=test-token';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user exists', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };
    setupMocks(false, mockUser);
    document.cookie = 'accessToken=test-token';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
  });

  it('should dispatch toggleLoading(false) when no accessToken exists', async () => {
    setupMocks(false, null);
    document.cookie = '';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user is authenticated and has user', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };
    setupMocks(true, mockUser);
    document.cookie = 'accessToken=test-token';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
  });

  it('should handle cookie with multiple values', async () => {
    setupMocks(false, null);
    document.cookie = 'otherCookie=value; accessToken=test-token; anotherCookie=value2';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockGetUserData());
  });

  it('should handle cookie with accessToken at the beginning', async () => {
    setupMocks(false, null);
    document.cookie = 'accessToken=test-token; otherCookie=value';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockGetUserData());
  });

  it('should handle cookie with accessToken at the end', async () => {
    setupMocks(false, null);
    document.cookie = 'otherCookie=value; accessToken=test-token';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockGetUserData());
  });

  it('should not dispatch getUserData when accessToken is empty string', async () => {
    setupMocks(false, null);
    document.cookie = 'accessToken=';
    
    render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
    expect(mockDispatch).not.toHaveBeenCalledWith(mockGetUserData());
  });

  it('should re-run effect when dependencies change', async () => {
    setupMocks(false, null);
    document.cookie = 'accessToken=test-token';
    
    const { rerender } = render(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    jest.clearAllMocks();
    
    // Change to authenticated
    setupMocks(true, null);
    rerender(<AuthInitializer />);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(mockToggleLoading(false));
  });
});
