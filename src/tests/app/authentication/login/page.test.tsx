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
import LoginPage from '@/app/authentication/login/page';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { login, resetPassword, selectLoading } from '@/features/auth/authSlice';

// Mock dependencies
jest.mock('@/lib/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
  useAppStore: jest.fn(),
}));
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, onClick, ...props }: any) => (
    <button disabled={disabled} onClick={onClick} {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/linkButton', () => ({
  LinkButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/heroTitle', () => ({
  HeroTitle: ({ children, subtitle, ...props }: any) => (
    <div data-testid="hero-title" {...props}>
      <h1>{children}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, validationRule, errorMessage, ...props }: any) => (
    <div>
      <input
        value={value}
        onChange={onChange}
        data-validation-rule={validationRule ? 'true' : 'false'}
        data-error-message={errorMessage}
        {...props}
      />
    </div>
  ),
}));

jest.mock('@/components/ui/spinner', () => ({
  Spinner: ({ className, ...props }: any) => (
    <div data-testid="spinner" className={className} {...props}>Loading</div>
  ),
}));

const mockUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;
const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;

describe('LoginPage', () => {
  const mockDispatch = jest.fn();
  const mockReload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAppDispatch as any).mockReturnValue(mockDispatch);
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectLoading) {
        return false;
      }
      return null;
    });
    
    // Mock globalThis.location.reload
    Object.defineProperty(globalThis, 'location', {
      value: {
        reload: mockReload,
      },
      writable: true,
    });
  });

  it('should render', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render HeroTitle with correct content', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText(/Faça login para acessar o UBS Watchdog/)).toBeInTheDocument();
  });

  it('should render "Voltar para o início" link', () => {
    render(<LoginPage />);
    const link = screen.getByText('Voltar para o início');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render email input', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should render password input when not in reset password mode', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('should not render password input when in reset password mode', () => {
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    expect(screen.queryByLabelText('Senha')).not.toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    render(<LoginPage />);
    const submitButton = screen.getByText('Entrar');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should keep submit button disabled when email is invalid', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should keep submit button disabled when password is too short', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should toggle to reset password mode', () => {
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    expect(screen.queryByLabelText('Senha')).not.toBeInTheDocument();
    expect(screen.getByText('Recuperar senha')).toBeInTheDocument();
  });

  it('should enable submit button in reset password mode with valid email', async () => {
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Recuperar senha');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call dispatch with login on form submission', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/login/fulfilled' });
    
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Entrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        login({ email: 'test@example.com', password: 'password123' })
      );
    });
  });

  it('should call location.reload when login succeeds', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/login/fulfilled' });
    
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Entrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockReload).toHaveBeenCalled();
    });
  });

  it('should show error message when login fails', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/login/rejected' });
    
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Entrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login!')).toBeInTheDocument();
      expect(screen.getByText(/Por favor, tente novamente ou contate o suporte/)).toBeInTheDocument();
    });
  });

  it('should call dispatch with resetPassword on reset password submission', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/resetPassword/fulfilled' });
    
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    const emailInput = screen.getByLabelText('Email');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Recuperar senha');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        resetPassword('test@example.com')
      );
    });
  });

  it('should show success message when reset password succeeds', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/resetPassword/fulfilled' });
    
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    const emailInput = screen.getByLabelText('Email');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Recuperar senha');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Senha resetada com sucesso!')).toBeInTheDocument();
      expect(screen.getByText(/Verifique seu email para mais informações/)).toBeInTheDocument();
    });
  });

  it('should show error message when reset password fails', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/resetPassword/rejected' });
    
    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    const emailInput = screen.getByLabelText('Email');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Recuperar senha');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Erro ao resetar senha!')).toBeInTheDocument();
      expect(screen.getByText(/Por favor, tente novamente ou contate o suporte/)).toBeInTheDocument();
    });
  });

  it('should show loading state when loading', () => {
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectLoading) {
        return true;
      }
      return null;
    });

    render(<LoginPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
  });

  it('should show loading state for reset password when loading', () => {
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectLoading) {
        return true;
      }
      return null;
    });

    render(<LoginPage />);
    const resetButton = screen.getByText('Recuperar senha');
    fireEvent.click(resetButton);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Resetando senha...')).toBeInTheDocument();
  });

  it('should render "Cadastre-se" link', () => {
    render(<LoginPage />);
    const link = screen.getByText('Cadastre-se');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/authentication/registration');
  });

  it('should render background image', () => {
    const { container } = render(<LoginPage />);
    const bgImage = container.querySelector('img[alt="background"]');
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute('src', '/bg-authentication.jpg');
  });

  it('should call location.reload when error button is clicked', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/login/rejected' });
    
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const form = screen.getByLabelText('Email').closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Entrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Erro ao fazer login!')).toBeInTheDocument();
    });

    const reloadButton = screen.getByText('Voltar para o login');
    fireEvent.click(reloadButton);
    expect(mockReload).toHaveBeenCalled();
  });

  it('should update input values on change', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
