import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationPage from '@/app/authentication/registration/page';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { createUser, selectLoading } from '@/features/auth/authSlice';

// Mock dependencies
jest.mock('@/lib/hooks');
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, ...props }: any) => (
    <button disabled={disabled} {...props}>{children}</button>
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

describe('RegistrationPage', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAppDispatch as any).mockReturnValue(mockDispatch);
    (mockUseAppSelector as any).mockImplementation((selector: any) => {
      if (selector === selectLoading) {
        return false;
      }
      return null;
    });
  });

  it('should render', () => {
    render(<RegistrationPage />);
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('should render HeroTitle with correct content', () => {
    render(<RegistrationPage />);
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText(/Crie sua conta para começar a usar o UBS Watchdog/)).toBeInTheDocument();
  });

  it('should render "Voltar para o início" link', () => {
    render(<RegistrationPage />);
    const link = screen.getByText('Voltar para o início');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render all form inputs', () => {
    render(<RegistrationPage />);
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<RegistrationPage />);
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    render(<RegistrationPage />);
    const submitButton = screen.getByText('Cadastrar');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should keep submit button disabled when email is invalid', async () => {
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should keep submit button disabled when password is too short', async () => {
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should keep submit button disabled when passwords do not match', async () => {
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should call dispatch with createUser on form submission', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/createUser/fulfilled' });
    
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const form = screen.getByLabelText('Nome completo').closest('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Cadastrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        createUser({ email: 'test@example.com', password: 'password123', name: 'John Doe' })
      );
    });
  });

  it('should show success message when registration succeeds', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/createUser/fulfilled' });
    
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const form = screen.getByLabelText('Nome completo').closest('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Cadastrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
      expect(screen.getByText(/Agora, antes de continuar, por favor, verifique seu email/)).toBeInTheDocument();
    });
  });

  it('should show error message when registration fails', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/createUser/rejected' });
    
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const form = screen.getByLabelText('Nome completo').closest('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Cadastrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText('Erro ao cadastrar!')).toBeInTheDocument();
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

    render(<RegistrationPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Aguarde enquanto criamos sua conta...')).toBeInTheDocument();
  });

  it('should render "Faça login" link', () => {
    render(<RegistrationPage />);
    const link = screen.getByText('Faça login');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/authentication/login');
  });

  it('should render background image', () => {
    const { container } = render(<RegistrationPage />);
    const bgImage = container.querySelector('img[alt="background"]');
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute('src', '/bg-authentication.jpg');
  });

  it('should render success page with link to login', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/createUser/fulfilled' });
    
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const form = screen.getByLabelText('Nome completo').closest('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Cadastrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      const loginLink = screen.getByText('Voltar para o login');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/authentication/login');
    });
  });

  it('should render error page with link to registration', async () => {
    (mockDispatch as any).mockResolvedValue({ type: 'auth/createUser/rejected' });
    
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const form = screen.getByLabelText('Nome completo').closest('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Cadastrar');
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.submit(form!);

    await waitFor(() => {
      const registrationLink = screen.getByText('Voltar para o cadastro');
      expect(registrationLink).toBeInTheDocument();
      expect(registrationLink.closest('a')).toHaveAttribute('href', '/authentication/registration');
    });
  });

  it('should update input values on change', () => {
    render(<RegistrationPage />);
    const nameInput = screen.getByLabelText('Nome completo') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('test@example.com');
  });
});
