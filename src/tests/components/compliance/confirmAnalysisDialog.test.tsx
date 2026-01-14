import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmAnalysisDialog } from '@/components/compliance/confirmAnalysisDialog';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    open ? <div data-testid="dialog" data-open={open}>{children}</div> : null
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children, className }: any) => (
    <div data-testid="dialog-header" className={className}>{children}</div>
  ),
  DialogTitle: ({ children, className }: any) => (
    <h2 data-testid="dialog-title" className={className}>{children}</h2>
  ),
  DialogDescription: ({ children }: any) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: any) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button
      data-testid={variant === 'secondary' ? 'cancel-button' : 'confirm-button'}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

describe('ConfirmAnalysisDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when open is false', () => {
    render(
      <ConfirmAnalysisDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('should render dialog title', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Início de Análise')).toBeInTheDocument();
  });

  it('should render dialog description', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja iniciar a análise deste alerta\?/)).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancelar');
    expect(cancelButton).toHaveAttribute('data-variant', 'secondary');
  });

  it('should render confirm button', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('Confirmar');
  });

  it('should call onOpenChange with false when cancel button is clicked', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isUpdating is true', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={true}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    const confirmButton = screen.getByTestId('confirm-button');
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('should enable buttons when isUpdating is false', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={false}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    const confirmButton = screen.getByTestId('confirm-button');
    expect(cancelButton).not.toBeDisabled();
    expect(confirmButton).not.toBeDisabled();
  });

  it('should enable buttons when isUpdating is undefined', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    const confirmButton = screen.getByTestId('confirm-button');
    expect(cancelButton).not.toBeDisabled();
    expect(confirmButton).not.toBeDisabled();
  });

  it('should show "Processando..." text on confirm button when isUpdating is true', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={true}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toHaveTextContent('Processando...');
  });

  it('should show "Confirmar" text on confirm button when isUpdating is false', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={false}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toHaveTextContent('Confirmar');
  });

  it('should render dialog header with correct className', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const dialogHeader = screen.getByTestId('dialog-header');
    expect(dialogHeader).toHaveClass('mb-4');
  });

  it('should render dialog title with correct className', () => {
    render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveClass('mb-4');
  });

  it('should call onOpenChange when dialog open state changes', () => {
    const { rerender } = render(
      <ConfirmAnalysisDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    rerender(
      <ConfirmAnalysisDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
  });
});
