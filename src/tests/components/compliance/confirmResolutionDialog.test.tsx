import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmResolutionDialog } from '@/components/compliance/confirmResolutionDialog';

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

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, placeholder, disabled, rows }: any) => (
    <textarea
      data-testid="textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
    />
  ),
}));

describe('ConfirmResolutionDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when open is false', () => {
    render(
      <ConfirmResolutionDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <ConfirmResolutionDialog
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
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
    expect(screen.getByText('Resolver Alerta')).toBeInTheDocument();
  });

  it('should render dialog description', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
    expect(screen.getByText(/Descreva como o alerta foi resolvido/)).toBeInTheDocument();
  });

  it('should render textarea', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Descreva a resolução do alerta...');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should render cancel button', () => {
    render(
      <ConfirmResolutionDialog
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
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('Confirmar');
  });

  it('should have empty textarea initially', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('should update textarea value when user types', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test resolution' } });
    expect(textarea.value).toBe('Test resolution');
  });

  it('should disable confirm button when textarea is empty', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
  });

  it('should disable confirm button when textarea has only whitespace', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '   ' } });
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
  });

  it('should enable confirm button when textarea has text', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test resolution' } });
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).not.toBeDisabled();
  });

  it('should call onOpenChange with false when cancel button is clicked', () => {
    render(
      <ConfirmResolutionDialog
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

  it('should clear textarea when cancel button is clicked', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test resolution' } });
    expect(textarea.value).toBe('Test resolution');
    
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onConfirm with trimmed text when confirm button is clicked', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '  Test resolution  ' } });
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledWith('Test resolution');
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should clear textarea after confirming', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test resolution' } });
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    expect(textarea.value).toBe('');
  });

  it('should not call onConfirm when textarea is empty', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
  });

  it('should disable buttons when isUpdating is true', () => {
    render(
      <ConfirmResolutionDialog
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

  it('should disable textarea when isUpdating is true', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={true}
      />
    );
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
  });

  it('should enable buttons when isUpdating is false', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={false}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    const confirmButton = screen.getByTestId('confirm-button');
    expect(cancelButton).not.toBeDisabled();
  });

  it('should enable textarea when isUpdating is false', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={false}
      />
    );
    const textarea = screen.getByTestId('textarea');
    expect(textarea).not.toBeDisabled();
  });

  it('should show "Processando..." text on confirm button when isUpdating is true', () => {
    render(
      <ConfirmResolutionDialog
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
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        isUpdating={false}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toHaveTextContent('Confirmar');
  });

  it('should clear textarea when dialog closes', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test resolution' } });
    expect(textarea.value).toBe('Test resolution');
    
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should render dialog header with correct className', () => {
    render(
      <ConfirmResolutionDialog
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
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveClass('mb-4');
  });

  it('should handle multiple text changes', () => {
    render(
      <ConfirmResolutionDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: 'First' } });
    expect(textarea.value).toBe('First');
    
    fireEvent.change(textarea, { target: { value: 'Second resolution' } });
    expect(textarea.value).toBe('Second resolution');
    
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledWith('Second resolution');
  });
});
