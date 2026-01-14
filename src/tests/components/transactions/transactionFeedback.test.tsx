import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionFeedback } from '@/components/transactions/transactionFeedback';

jest.mock('lucide-react', () => ({
  CheckCircle2Icon: ({ className }: { className?: string }) => (
    <svg data-testid="check-circle-icon" className={className} />
  ),
  XCircleIcon: ({ className }: { className?: string }) => (
    <svg data-testid="x-circle-icon" className={className} />
  ),
  ChevronRight: () => <svg data-testid="chevron-right" />,
  ArrowRight: () => <svg data-testid="arrow-right" />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('TransactionFeedback', () => {
  const mockOnReset = jest.fn();

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  describe('Deposito transaction type', () => {
    it('should render success message for Deposito', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Depósito Realizado com Sucesso!')).toBeInTheDocument();
      expect(screen.getByText('O depósito foi processado com sucesso. A transação foi registrada e o valor foi creditado na conta do cliente.')).toBeInTheDocument();
    });

    it('should render error message for Deposito', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Falha ao Realizar Depósito')).toBeInTheDocument();
      expect(screen.getByText('Não foi possível processar o depósito. Por favor, verifique os dados e tente novamente.')).toBeInTheDocument();
    });

    it('should render custom error message for Deposito', () => {
      const customError = 'Erro personalizado de depósito';
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={false}
          onReset={mockOnReset}
          errorMessage={customError}
        />
      );
      expect(screen.getByText('Falha ao Realizar Depósito')).toBeInTheDocument();
      expect(screen.getByText(customError)).toBeInTheDocument();
      expect(screen.queryByText('Não foi possível processar o depósito. Por favor, verifique os dados e tente novamente.')).not.toBeInTheDocument();
    });

    it('should render success icon for Deposito', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('x-circle-icon')).not.toBeInTheDocument();
    });

    it('should render error icon for Deposito', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('check-circle-icon')).not.toBeInTheDocument();
    });

    it('should render correct button text for Deposito', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    });
  });

  describe('Saque transaction type', () => {
    it('should render success message for Saque', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Saque Realizado com Sucesso!')).toBeInTheDocument();
      expect(screen.getByText('O saque foi processado com sucesso. A transação foi registrada e o valor foi debitado da conta do cliente.')).toBeInTheDocument();
    });

    it('should render error message for Saque', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Falha ao Realizar Saque')).toBeInTheDocument();
      expect(screen.getByText('Não foi possível processar o saque. Por favor, verifique os dados e tente novamente.')).toBeInTheDocument();
    });

    it('should render custom error message for Saque', () => {
      const customError = 'Erro personalizado de saque';
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={false}
          onReset={mockOnReset}
          errorMessage={customError}
        />
      );
      expect(screen.getByText('Falha ao Realizar Saque')).toBeInTheDocument();
      expect(screen.getByText(customError)).toBeInTheDocument();
    });

    it('should render success icon for Saque', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('should render error icon for Saque', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('should render correct button text for Saque', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Nova Transação')).toBeInTheDocument();
    });
  });

  describe('Transferencia transaction type', () => {
    it('should render success message for Transferencia', () => {
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Transferência Realizada com Sucesso!')).toBeInTheDocument();
      expect(screen.getByText('A transferência foi processada com sucesso. A transação foi registrada e o valor foi transferido entre as contas.')).toBeInTheDocument();
    });

    it('should render error message for Transferencia', () => {
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Falha ao Realizar Transferência')).toBeInTheDocument();
      expect(screen.getByText('Não foi possível processar a transferência. Por favor, verifique os dados e tente novamente.')).toBeInTheDocument();
    });

    it('should render custom error message for Transferencia', () => {
      const customError = 'Erro personalizado de transferência';
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={false}
          onReset={mockOnReset}
          errorMessage={customError}
        />
      );
      expect(screen.getByText('Falha ao Realizar Transferência')).toBeInTheDocument();
      expect(screen.getByText(customError)).toBeInTheDocument();
    });

    it('should render success icon for Transferencia', () => {
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('should render error icon for Transferencia', () => {
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('should render correct button text for Transferencia', () => {
      render(
        <TransactionFeedback
          type="Transferencia"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      expect(screen.getByText('Nova Transferência')).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('should call onReset when button is clicked', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const button = screen.getByText('Nova Transação');
      fireEvent.click(button);
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when button is clicked for error state', () => {
      render(
        <TransactionFeedback
          type="Saque"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      const button = screen.getByText('Nova Transação');
      fireEvent.click(button);
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Component structure', () => {
    it('should render Card component', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });

    it('should render CardHeader component', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const cardHeader = container.querySelector('[data-slot="card-header"]');
      expect(cardHeader).toBeInTheDocument();
    });

    it('should render CardTitle component', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const cardTitle = container.querySelector('[data-slot="card-title"]');
      expect(cardTitle).toBeInTheDocument();
    });

    it('should render CardDescription component', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const cardDescription = container.querySelector('[data-slot="card-description"]');
      expect(cardDescription).toBeInTheDocument();
    });

    it('should render CardContent component', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const cardContent = container.querySelector('[data-slot="card-content"]');
      expect(cardContent).toBeInTheDocument();
    });

    it('should apply correct classes to icon container', () => {
      const { container } = render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const iconContainer = container.querySelector('.flex.justify-center.mb-4');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply correct classes to button', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const button = screen.getByText('Nova Transação');
      expect(button).toHaveClass('w-full', 'md:w-auto');
    });
  });

  describe('Icon styling', () => {
    it('should apply success icon classes', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={true}
          onReset={mockOnReset}
        />
      );
      const icon = screen.getByTestId('check-circle-icon');
      expect(icon).toHaveClass('size-16', 'text-success-foreground');
    });

    it('should apply error icon classes', () => {
      render(
        <TransactionFeedback
          type="Deposito"
          isSuccess={false}
          onReset={mockOnReset}
        />
      );
      const icon = screen.getByTestId('x-circle-icon');
      expect(icon).toHaveClass('size-16', 'text-destructive');
    });
  });
});
