import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Create a mock auth object that will be used consistently
const mockAuth = {};

// Create mock functions that will be returned from the factory
const mockCreateUserWithEmailAndPassword = jest.fn() as any;
const mockSignInWithEmailAndPassword = jest.fn() as any;
const mockSignOut = jest.fn() as any;
const mockUpdateProfile = jest.fn() as any;
const mockSendEmailVerification = jest.fn() as any;
const mockOnAuthStateChanged = jest.fn() as any;
const mockSendPasswordResetEmail = jest.fn() as any;
const mockGetAuth = jest.fn(() => mockAuth);

// Mock Firebase before any imports that use it
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  updateProfile: mockUpdateProfile,
  sendEmailVerification: mockSendEmailVerification,
  onAuthStateChanged: mockOnAuthStateChanged,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
}));

// Mock the firebase module that exports auth
jest.mock('@/lib/firebase', () => ({
  auth: mockAuth,
  app: {},
  db: {},
  storage: {},
}));

import {
  createUserWithEmailAndPasswordAPI,
} from '@/features/auth/authAPI';

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

});
