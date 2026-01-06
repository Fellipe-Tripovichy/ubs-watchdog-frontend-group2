import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  createUserWithEmailAndPasswordAPI,
  signInWithEmailAndPasswordAPI,
  signOutAPI,
  getUserDataAPI,
  resetPasswordAPI,
} from '@/features/auth/authAPI';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;
const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockUpdateProfile = updateProfile as jest.MockedFunction<typeof updateProfile>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFunction<typeof sendEmailVerification>;
const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>;

describe('authAPI', () => {
  const mockUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: false,
  };

  const mockUserCredential = {
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserWithEmailAndPasswordAPI', () => {
    it('should create user and update profile successfully', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential as any);
      mockUpdateProfile.mockResolvedValue(undefined);
      mockSendEmailVerification.mockResolvedValue(undefined);

      const result = await createUserWithEmailAndPasswordAPI('test@example.com', 'password123', 'Test User');

      expect(result).toEqual(mockUser);
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
      expect(mockSendEmailVerification).toHaveBeenCalledWith(mockUser);
    });

    it('should return null on error', async () => {
      mockCreateUserWithEmailAndPassword.mockRejectedValue(new Error('Failed to create user'));

      const result = await createUserWithEmailAndPasswordAPI('test@example.com', 'password123', 'Test User');

      expect(result).toBeNull();
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });

    it('should handle updateProfile error', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential as any);
      mockUpdateProfile.mockRejectedValue(new Error('Failed to update profile'));

      const result = await createUserWithEmailAndPasswordAPI('test@example.com', 'password123', 'Test User');

      expect(result).toBeNull();
    });

    it('should handle sendEmailVerification error', async () => {
      mockCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential as any);
      mockUpdateProfile.mockResolvedValue(undefined);
      mockSendEmailVerification.mockRejectedValue(new Error('Failed to send email'));

      const result = await createUserWithEmailAndPasswordAPI('test@example.com', 'password123', 'Test User');

      expect(result).toBeNull();
    });
  });

  describe('signInWithEmailAndPasswordAPI', () => {
    it('should sign in user successfully', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValue(mockUserCredential as any);

      const result = await signInWithEmailAndPasswordAPI('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });

    it('should return null on error', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

      const result = await signInWithEmailAndPasswordAPI('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'wrongpassword');
    });
  });

  describe('signOutAPI', () => {
    it('should sign out successfully', async () => {
      mockSignOut.mockResolvedValue(undefined);

      const result = await signOutAPI();

      expect(result).toBe(true);
      expect(mockSignOut).toHaveBeenCalledWith({});
    });

    it('should return false on error', async () => {
      mockSignOut.mockRejectedValue(new Error('Failed to sign out'));

      const result = await signOutAPI();

      expect(result).toBe(false);
      expect(mockSignOut).toHaveBeenCalledWith({});
    });
  });

  describe('getUserDataAPI', () => {
    it('should return user when authenticated', async () => {
      const mockUnsubscribe = jest.fn();
      mockOnAuthStateChanged.mockImplementation((auth, onNext: any, onError?: any) => {
        if (typeof onNext === 'function') {
          onNext(mockUser as any);
        }
        return mockUnsubscribe;
      });

      const result = await getUserDataAPI();

      expect(result).toEqual(mockUser);
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith({}, expect.any(Function), expect.any(Function));
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      const mockUnsubscribe = jest.fn();
      mockOnAuthStateChanged.mockImplementation((auth, onNext: any, onError?: any) => {
        if (typeof onNext === 'function') {
          onNext(null);
        }
        return mockUnsubscribe;
      });

      const result = await getUserDataAPI();

      expect(result).toBeNull();
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith({}, expect.any(Function), expect.any(Function));
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should reject on error', async () => {
      const mockError = new Error('Auth error');
      const mockUnsubscribe = jest.fn();
      mockOnAuthStateChanged.mockImplementation((auth, onNext: any, onError?: any) => {
        if (onError && typeof onError === 'function') {
          onError(mockError);
        }
        return mockUnsubscribe;
      });

      await expect(getUserDataAPI()).rejects.toEqual(mockError);
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith({}, expect.any(Function), expect.any(Function));
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('resetPasswordAPI', () => {
    it('should send password reset email successfully', async () => {
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await resetPasswordAPI('test@example.com');

      expect(result).toBe(true);
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
    });

    it('should return false on error', async () => {
      mockSendPasswordResetEmail.mockRejectedValue(new Error('Failed to send email'));

      const result = await resetPasswordAPI('test@example.com');

      expect(result).toBe(false);
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
    });
  });
});
