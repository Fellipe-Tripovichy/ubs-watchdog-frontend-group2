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

import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setToken,
  clearToken,
  setUser,
  clearUser,
  createUser,
  login,
  logout,
  getUserData,
  toggleLoading,
  resetPassword,
  selectIsAuthenticated,
  selectToken,
  selectLoading,
  selectUser,
  type AuthState,
  type UserData,
} from '@/features/auth/authSlice';
import {
  createUserWithEmailAndPasswordAPI,
  signInWithEmailAndPasswordAPI,
  signOutAPI,
  getUserDataAPI,
  resetPasswordAPI,
} from '@/features/auth/authAPI';

// Mock authAPI
jest.mock('@/features/auth/authAPI', () => ({
  createUserWithEmailAndPasswordAPI: jest.fn(),
  signInWithEmailAndPasswordAPI: jest.fn(),
  signOutAPI: jest.fn(),
  getUserDataAPI: jest.fn(),
  resetPasswordAPI: jest.fn(),
}));

const mockCreateUserWithEmailAndPasswordAPI = createUserWithEmailAndPasswordAPI as jest.MockedFunction<typeof createUserWithEmailAndPasswordAPI>;
const mockSignInWithEmailAndPasswordAPI = signInWithEmailAndPasswordAPI as jest.MockedFunction<typeof signInWithEmailAndPasswordAPI>;
const mockSignOutAPI = signOutAPI as jest.MockedFunction<typeof signOutAPI>;
const mockGetUserDataAPI = getUserDataAPI as jest.MockedFunction<typeof getUserDataAPI>;
const mockResetPasswordAPI = resetPasswordAPI as jest.MockedFunction<typeof resetPasswordAPI>;

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore<{ auth: AuthState }>>;

  const mockUser: UserData = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
  };

  const mockFirebaseUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
    getIdToken: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth as AuthState;
      expect(state).toEqual({
        token: '',
        user: null,
        loading: true,
      });
    });
  });

  describe('reducers', () => {
    it('should set token', () => {
      (store.dispatch as any)(setToken('test-token'));
      const state = store.getState().auth as AuthState;
      expect(state.token).toBe('test-token');
    });

    it('should clear token and user', () => {
      (store.dispatch as any)(setToken('test-token'));
      store.dispatch(setUser(mockUser));
      store.dispatch(clearToken());
      const state = store.getState().auth as AuthState;
      expect(state.token).toBe('');
      expect(state.user).toBeNull();
    });

    it('should set user', () => {
      store.dispatch(setUser(mockUser));
      const state = store.getState().auth as AuthState;
      expect(state.user).toEqual(mockUser);
    });

    it('should clear user', () => {
      store.dispatch(setUser(mockUser));
      store.dispatch(clearUser());
      const state = store.getState().auth as AuthState;
      expect(state.user).toBeNull();
    });
  });

  describe('createUser async thunk', () => {
    it('should handle pending state', () => {
      mockCreateUserWithEmailAndPasswordAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state', async () => {
      mockCreateUserWithEmailAndPasswordAPI.mockResolvedValue(mockFirebaseUser as any);
      await store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });

    it('should handle rejected state', async () => {
      mockCreateUserWithEmailAndPasswordAPI.mockResolvedValue(null);
      await store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('login async thunk', () => {
    it('should handle pending state', () => {
      mockSignInWithEmailAndPasswordAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state with user and token', async () => {
      mockSignInWithEmailAndPasswordAPI.mockResolvedValue(mockFirebaseUser as any);
      (mockFirebaseUser.getIdToken as any).mockResolvedValue('test-token');
      await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('test-token');
      expect(document.cookie).toContain('accessToken=test-token');
    });

    it('should handle rejected state', async () => {
      mockSignInWithEmailAndPasswordAPI.mockResolvedValue(null);
      await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('logout async thunk', () => {
    it('should handle pending state', () => {
      mockSignOutAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state and clear user and token', async () => {
      (store.dispatch as any)(setToken('test-token'));
      store.dispatch(setUser(mockUser));
      mockSignOutAPI.mockResolvedValue(true);
      await store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.token).toBe('');
      expect(state.user).toBeNull();
      expect(document.cookie).toContain('accessToken=;');
    });

    it('should handle rejected state', async () => {
      mockSignOutAPI.mockResolvedValue(false);
      await store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('getUserData async thunk', () => {
    it('should handle pending state', () => {
      mockGetUserDataAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state with user', async () => {
      mockGetUserDataAPI.mockResolvedValue(mockFirebaseUser as any);
      (mockFirebaseUser.getIdToken as any).mockResolvedValue('test-token');
      await (store.dispatch as any)(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('test-token');
      expect(document.cookie).toContain('accessToken=test-token');
    });

    it('should handle fulfilled state without user', async () => {
      mockGetUserDataAPI.mockResolvedValue(null);
      store.dispatch(setToken('existing-token'));
      store.dispatch(setUser(mockUser));
      await store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBe('');
      expect(document.cookie).toContain('accessToken=;');
    });

    it('should handle rejected state', async () => {
      mockGetUserDataAPI.mockRejectedValue(new Error('Auth error'));
      store.dispatch(setToken('existing-token'));
      store.dispatch(setUser(mockUser));
      await store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBe('');
      expect(document.cookie).toContain('accessToken=;');
    });
  });

  describe('toggleLoading async thunk', () => {
    it('should handle pending state', () => {
      store.dispatch(toggleLoading(true));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });

    it('should handle fulfilled state', async () => {
      await store.dispatch(toggleLoading(true));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle rejected state', async () => {
      store.dispatch({ type: 'auth/toggleLoading/rejected' });
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('resetPassword async thunk', () => {
    it('should handle pending state', () => {
      mockResetPasswordAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state', async () => {
      mockResetPasswordAPI.mockResolvedValue(true);
      await store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });

    it('should handle rejected state', async () => {
      mockResetPasswordAPI.mockResolvedValue(false);
      await store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should select isAuthenticated correctly when token exists', () => {
      (store.dispatch as any)(setToken('test-token'));
      const state = store.getState() as { auth: AuthState };
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    it('should select isAuthenticated correctly when token is empty', () => {
      store.dispatch(clearToken());
      const state = store.getState() as { auth: AuthState };
      expect(selectIsAuthenticated(state)).toBe(false);
    });

    it('should select token correctly', () => {
      (store.dispatch as any)(setToken('test-token'));
      const state = store.getState() as { auth: AuthState };
      expect(selectToken(state)).toBe('test-token');
    });

    it('should select loading correctly', () => {
      const state = store.getState() as { auth: AuthState };
      expect(selectLoading(state)).toBe(true);
    });

    it('should select user correctly', () => {
      store.dispatch(setUser(mockUser));
      const state = store.getState() as { auth: AuthState };
      expect(selectUser(state)).toEqual(mockUser);
    });

    it('should select user as null when not set', () => {
      const state = store.getState() as { auth: AuthState };
      expect(selectUser(state)).toBeNull();
    });
  });
});
