import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// 1. MOCK LOCAL FIREBASE CONFIG (CRITICAL FIX)
// This stops src/lib/firebase.js from running getAuth() with an invalid key
jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
}));

// 2. Mock Firebase SDKs
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

import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';
import { metadata } from '@/app/layout';

// Mock dependencies
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    variable: 'mock-font-variable',
    className: 'mock-font-class',
  })),
}));

// Mock ReduxProvider to include test ID
jest.mock('@/lib/redux-provider', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="redux-provider">{children}</div>
  ),
}));

// Mock next/navigation - must be before LayoutWrapper mock
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

jest.mock('@/components/ui/layoutWrapper', () => ({
  __esModule: true,
  LayoutWrapper: ({ children }: any) => (
    <div data-testid="layout-wrapper">{children}</div>
  ),
}));

describe('RootLayout', () => {
  let originalError: typeof console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress the expected console error about html/body nesting in test environment
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


  it('should render children', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Child Content</div>
      </RootLayout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <RootLayout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </RootLayout>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });


  it('should have correct metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('UBS Watchdog');
    expect(metadata.description).toBe('UBS Watchdog Frontend Application');
    if (metadata.icons && typeof metadata.icons === 'object' && 'icon' in metadata.icons) {
      expect(metadata.icons.icon).toBe('/favicon.jpg');
    }
  });


  it('should render with React fragment as children', () => {
    render(
      <RootLayout>
        <>
          <div>Fragment Child 1</div>
          <div>Fragment Child 2</div>
        </>
      </RootLayout>
    );
    expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
  });
});