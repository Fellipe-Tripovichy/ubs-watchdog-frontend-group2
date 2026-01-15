import {
  createUserWithEmailAndPasswordAPI,
  signInWithEmailAndPasswordAPI,
  signOutAPI,
  getUserDataAPI,
  resetPasswordAPI
} from '@/features/auth/authAPI';

jest.mock('firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: { email: 'test@example.com', uid: '123' }
  }
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

describe('Auth API Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserWithEmailAndPasswordAPI', () => {
    it('should return user on success', async () => {
      const mockUser = { uid: '123', email: 'test@test.com' };
      const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;
      const mockUpdateProfile = updateProfile as jest.MockedFunction<typeof updateProfile>;
      mockCreateUser.mockResolvedValue({ user: mockUser } as any);
      mockUpdateProfile.mockResolvedValue(undefined);

      const result = await createUserWithEmailAndPasswordAPI('test@test.com', '123456', 'Test Name');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
      expect(updateProfile).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null on failure', async () => {
      const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;
      mockCreateUser.mockRejectedValue(new Error('Error'));

      const result = await createUserWithEmailAndPasswordAPI('test@test.com', '123456', 'Test Name');

      expect(result).toBeNull();
    });
  });

  describe('signInWithEmailAndPasswordAPI', () => {
    it('should return user on success', async () => {
      const mockUser = { uid: '123', email: 'test@test.com' };
      const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
      mockSignIn.mockResolvedValue({ user: mockUser } as any);

      const result = await signInWithEmailAndPasswordAPI('test@test.com', '123456');

      expect(result).toEqual(mockUser);
    });

    it('should return null on failure', async () => {
      const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>;
      mockSignIn.mockRejectedValue(new Error('Auth failed'));

      const result = await signInWithEmailAndPasswordAPI('test@test.com', '123456');

      expect(result).toBeNull();
    });
  });

  describe('signOutAPI', () => {
    it('should return true on success', async () => {
      const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
      mockSignOut.mockResolvedValue(undefined);

      const result = await signOutAPI();

      expect(result).toBe(true);
    });

    it('should return false on failure', async () => {
      const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
      mockSignOut.mockRejectedValue(new Error('Network error'));

      const result = await signOutAPI();

      expect(result).toBe(false);
    });
  });

  describe('getUserDataAPI', () => {
    it('should resolve with user when auth state exists', async () => {
      const mockUser = { uid: '123', email: 'found@test.com' };

      const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

      mockOnAuthStateChanged.mockImplementation((auth: any, callback: any) => {
        const unsubscribe = jest.fn();

        Promise.resolve().then(() => {
          callback(mockUser);
        });

        return unsubscribe;
      });

      const result = await getUserDataAPI();

      expect(result).toEqual(mockUser);
    });

    it('should resolve with null when no user is found', async () => {
      const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

      mockOnAuthStateChanged.mockImplementation((auth: any, callback: any) => {
        const unsubscribe = jest.fn();

        Promise.resolve().then(() => {
          callback(null);
        });

        return unsubscribe;
      });

      const result = await getUserDataAPI();

      expect(result).toBeNull();
    });

    it('should reject with error when onAuthStateChanged triggers error callback', async () => {
      const mockError = new Error('Authentication error');
      const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
      let unsubscribeFunction: jest.Mock | null = null;

      mockOnAuthStateChanged.mockImplementation((auth: any, successCallback: any, errorCallback: any) => {
        // Create unsubscribe function that can be verified
        const mockUnsubscribe = jest.fn();
        unsubscribeFunction = mockUnsubscribe;

        // Simulate error callback being triggered asynchronously (lines 46-47)
        // The error callback will call unsubscribe() which is the function we return
        Promise.resolve().then(() => {
          if (errorCallback) {
            errorCallback(mockError);
          }
        });

        return mockUnsubscribe;
      });

      // Wait for the error callback to be triggered and promise to reject
      await expect(getUserDataAPI()).rejects.toEqual(mockError);
      
      // Verify unsubscribe is called in the error callback (line 46)
      expect(unsubscribeFunction).toHaveBeenCalled();
    });
  });

  describe('resetPasswordAPI', () => {
    it('should return true on success', async () => {
      const mockSendPasswordReset = sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>;
      mockSendPasswordReset.mockResolvedValue(undefined);

      const result = await resetPasswordAPI('test@test.com');

      expect(result).toBe(true);
    });

    it('should return false on failure', async () => {
      const mockSendPasswordReset = sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>;
      mockSendPasswordReset.mockRejectedValue(new Error('Invalid email'));

      const result = await resetPasswordAPI('test@test.com');

      expect(result).toBe(false);
    });
  });
});