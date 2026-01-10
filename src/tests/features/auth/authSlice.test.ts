import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// 1. MOCK THE API MODULE
jest.mock('@/features/auth/authAPI', () => ({
  __esModule: true,
  createUserWithEmailAndPasswordAPI: jest.fn(),
  signInWithEmailAndPasswordAPI: jest.fn(),
  signOutAPI: jest.fn(),
  getUserDataAPI: jest.fn(),
  resetPasswordAPI: jest.fn(),
}));

// 2. MOCK YOUR LOCAL FIREBASE CONFIG (CRITICAL FIX)
// This prevents src/lib/firebase.js from running and crashing with "invalid-api-key"
jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// 3. MOCK FIREBASE SERVICES
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
}));

// 4. IMPORT REDUCER AND TYPES
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

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore<{ auth: AuthState }>>;

  const mockUser: UserData = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
  };

  let mockFirebaseUser: any;

  // Retrieve the mocks dynamically using requireMock.
  // We use 'as any' to avoid TypeScript errors on the mock properties.
  const {
      createUserWithEmailAndPasswordAPI,
      signInWithEmailAndPasswordAPI,
      signOutAPI,
      getUserDataAPI,
      resetPasswordAPI
  } = jest.requireMock('@/features/auth/authAPI') as any;

  // Map them to your variable names and cast to jest.MockedFunction
  const mockCreateUserAPI = createUserWithEmailAndPasswordAPI as jest.MockedFunction<any>;
  const mockLoginAPI = signInWithEmailAndPasswordAPI as jest.MockedFunction<any>;
  const mockSignOut = signOutAPI as jest.MockedFunction<any>;
  const mockGetUserData = getUserDataAPI as jest.MockedFunction<any>;
  const mockResetPassword = resetPasswordAPI as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFirebaseUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      emailVerified: true,
      getIdToken: jest.fn<any>().mockResolvedValue('test-token'),
    };

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

  // --- TESTS ---

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
      store.dispatch(setToken('test-token'));
      const state = store.getState().auth as AuthState;
      expect(state.token).toBe('test-token');
    });

    it('should clear token and user', () => {
      store.dispatch(setToken('test-token'));
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
      mockCreateUserAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state', async () => {
      mockCreateUserAPI.mockResolvedValue(mockFirebaseUser);
      await store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });

    it('should handle rejected state', async () => {
      mockCreateUserAPI.mockResolvedValue(null);
      await store.dispatch(createUser({ email: 'test@example.com', password: 'password123', name: 'Test User' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('login async thunk', () => {
    it('should handle pending state', () => {
      mockLoginAPI.mockImplementation(() => new Promise(() => {}));
      store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle rejected state', async () => {
      mockLoginAPI.mockResolvedValue(null);
      await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('logout async thunk', () => {
    it('should handle pending state', () => {
      mockSignOut.mockImplementation(() => new Promise(() => {}));
      store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state and clear user and token', async () => {
      store.dispatch(setToken('test-token'));
      store.dispatch(setUser(mockUser));
      mockSignOut.mockResolvedValue(true);
      await store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.token).toBe('');
      expect(state.user).toBeNull();
    });

    it('should handle rejected state', async () => {
      mockSignOut.mockResolvedValue(false);
      await store.dispatch(logout());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('getUserData async thunk', () => {
    it('should handle pending state', () => {
      mockGetUserData.mockImplementation(() => new Promise(() => {}));
      store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state without user', async () => {
      mockGetUserData.mockResolvedValue(null);
      store.dispatch(setToken('existing-token'));
      store.dispatch(setUser(mockUser));
      await store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBe('');
    });

    it('should handle rejected state', async () => {
      mockGetUserData.mockRejectedValue(new Error('Auth error'));
      store.dispatch(setToken('existing-token'));
      store.dispatch(setUser(mockUser));
      await store.dispatch(getUserData());
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBe('');
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
      mockResetPassword.mockImplementation(() => new Promise(() => {}));
      store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state', async () => {
      mockResetPassword.mockResolvedValue(true);
      await store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });

    it('should handle rejected state', async () => {
      mockResetPassword.mockResolvedValue(false);
      await store.dispatch(resetPassword('test@example.com'));
      const state = store.getState().auth as AuthState;
      expect(state.loading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should select isAuthenticated correctly when token exists', () => {
      store.dispatch(setToken('test-token'));
      const state = store.getState() as { auth: AuthState };
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    it('should select isAuthenticated correctly when token is empty', () => {
      store.dispatch(clearToken());
      const state = store.getState() as { auth: AuthState };
      expect(selectIsAuthenticated(state)).toBe(false);
    });

    it('should select token correctly', () => {
      store.dispatch(setToken('test-token'));
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