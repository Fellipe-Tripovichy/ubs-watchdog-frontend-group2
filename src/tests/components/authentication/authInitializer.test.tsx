import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { UserData } from '@/features/auth/authSlice';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 1. MOCK THE SLICE
jest.mock('@/features/auth/authSlice', () => {
  const actual = jest.requireActual('@/features/auth/authSlice') as any;
  return {
    __esModule: true,
    ...actual,
    // We replace the real action creator with a Jest spy
    getUserData: jest.fn(() => ({ type: 'auth/getUserData/pending' })),
  };
});

// 2. MOCK FIREBASE
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

// 3. IMPORTS
import { AuthInitializer } from '@/components/authentication/authInitializer';
import authReducer from '@/features/auth/authSlice';

describe('AuthInitializer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset document.cookie before each test
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

  it('should render without errors', () => {
    const store = createStore(false, false, null);
    document.cookie = '';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    expect(true).toBe(true);
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user is authenticated', async () => {
    const store = createStore(true, true, null);
    document.cookie = 'accessToken=test-token';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(false);
    });
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user exists', async () => {
    const mockUser: UserData = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };
    const store = createStore(false, true, mockUser);
    document.cookie = 'accessToken=test-token';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(false);
    });
  });

  it('should dispatch toggleLoading(false) when no accessToken exists', async () => {
    const store = createStore(false, true, null);
    document.cookie = '';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(false);
    });
  });

  it('should dispatch toggleLoading(false) when accessToken exists but user is authenticated and has user', async () => {
    const mockUser: UserData = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
    };
    const store = createStore(true, true, mockUser);
    document.cookie = 'accessToken=test-token';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(false);
    });
  });

  it('should not dispatch getUserData when accessToken is empty string', async () => {
    const store = createStore(false, true, null);
    document.cookie = 'accessToken=';
    
    render(
      <Provider store={store}>
        <AuthInitializer />
      </Provider>
    );
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.loading).toBe(false);
    });
    
    // FIX APPLIED HERE: Added 'as any'
    const { getUserData } = jest.requireMock('@/features/auth/authSlice') as any;

    expect(getUserData).not.toHaveBeenCalled();
  });
});