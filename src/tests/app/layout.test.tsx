import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// 1. MOCK LOCAL FIREBASE CONFIG
jest.mock('@/lib/firebase', () => ({
  __esModule: true,
  auth: {},
  db: {},
  storage: {},
}));

// 2. MOCK FIREBASE SDKs
jest.mock('firebase/app', () => ({
  __esModule: true,
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  __esModule: true,
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('firebase/storage', () => ({
  __esModule: true,
  getStorage: jest.fn(() => ({})),
}));

// 3. MOCK AUTH API
jest.mock('@/features/auth/authAPI', () => ({
  __esModule: true,
  signOutAPI: jest.fn(),
  createUserWithEmailAndPasswordAPI: jest.fn(),
  signInWithEmailAndPasswordAPI: jest.fn(),
  getUserDataAPI: jest.fn(),
  resetPasswordAPI: jest.fn(),
}));

// 4. MOCK NEXT/REDUX LIBS
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    variable: 'mock-font-variable',
    className: 'mock-font-class',
  })),
}));

jest.mock('@/lib/redux-provider', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="redux-provider">{children}</div>
  ),
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(() => '/'),
}));

jest.mock('@/components/ui/layoutWrapper', () => ({
  __esModule: true,
  LayoutWrapper: ({ children }: any) => (
    <div data-testid="layout-wrapper">{children}</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';

describe('RootLayout', () => {
  let originalError: typeof console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    originalError = console.error;
    console.error = jest.fn((...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('cannot be a child of') || 
          (errorMessage.includes('<html>') && errorMessage.includes('<div>')) ||
          errorMessage.includes('hydration error')) {
        return;
      }
      originalError(...args);
    });
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have correct metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('UBS Watchdog');
  });
});