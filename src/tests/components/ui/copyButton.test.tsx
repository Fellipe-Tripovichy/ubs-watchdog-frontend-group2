import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CopyButton } from '@/components/ui/copyButton';

const mockToast = jest.fn();
const mockWriteText = jest.fn();

jest.mock('@/lib/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('CopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  it('should render', () => {
    const { container } = render(<CopyButton textToCopy="test text" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it('should render with copy icon', () => {
    const { container } = render(<CopyButton textToCopy="test text" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should copy text to clipboard on click', async () => {
    const textToCopy = 'test text to copy';
    const { container } = render(<CopyButton textToCopy={textToCopy} />);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
    });
  });

  it('should show toast with default success message on successful copy', async () => {
    const { container } = render(<CopyButton textToCopy="test text" />);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Copiado com sucesso!',
        variant: 'success',
      });
    });
  });

  it('should show toast with custom success message', async () => {
    const customMessage = 'Custom success message';
    const { container } = render(
      <CopyButton textToCopy="test text" successMessage={customMessage} />
    );
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: customMessage,
        variant: 'success',
      });
    });
  });

  it('should call onCopySuccess callback on successful copy', async () => {
    const onCopySuccess = jest.fn();
    const { container } = render(
      <CopyButton textToCopy="test text" onCopySuccess={onCopySuccess} />
    );
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalled();
    });
  });

  it('should call onCopyError callback on copy failure', async () => {
    const error = new Error('Copy failed');
    mockWriteText.mockRejectedValue(error);
    const onCopyError = jest.fn();
    const { container } = render(
      <CopyButton textToCopy="test text" onCopyError={onCopyError} />
    );
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onCopyError).toHaveBeenCalledWith(error);
    });
  });

  it('should handle non-Error copy failures', async () => {
    mockWriteText.mockRejectedValue('String error');
    const onCopyError = jest.fn();
    const { container } = render(
      <CopyButton textToCopy="test text" onCopyError={onCopyError} />
    );
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(onCopyError).toHaveBeenCalled();
      const calledError = onCopyError.mock.calls[0][0];
      expect(calledError).toBeInstanceOf(Error);
      expect(calledError.message).toBe('Failed to copy');
    });
  });

  it('should not show toast on copy failure', async () => {
    mockWriteText.mockRejectedValue(new Error('Copy failed'));
    const { container } = render(<CopyButton textToCopy="test text" />);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
    
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should pass variant prop to IconButton', () => {
    const { container } = render(
      <CopyButton textToCopy="test text" variant="secondary" />
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'secondary');
  });

  it('should pass size prop to IconButton', () => {
    const { container } = render(
      <CopyButton textToCopy="test text" size="small" />
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'small');
  });

  it('should pass disabled prop to IconButton', () => {
    const { container } = render(
      <CopyButton textToCopy="test text" disabled />
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeDisabled();
  });

  it('should pass className prop to IconButton', () => {
    const { container } = render(
      <CopyButton textToCopy="test text" className="custom-class" />
    );
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('custom-class');
  });

  it('should not copy when disabled', async () => {
    const { container } = render(
      <CopyButton textToCopy="test text" disabled />
    );
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  it('should handle empty textToCopy', async () => {
    const { container } = render(<CopyButton textToCopy="" />);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('');
    });
  });
});
