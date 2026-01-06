import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Input } from '@/components/ui/input';
import React from 'react';

describe('Input', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should render', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toBeInTheDocument();
  });

  it('should render as an input element', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.tagName).toBe('INPUT');
  });

  it('should apply default classes', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toHaveClass('bg-background', 'border-border', 'rounded-md');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle uncontrolled mode with defaultValue', () => {
    render(<Input defaultValue="initial value" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial value');
  });

  it('should handle controlled mode with value', () => {
    render(<Input value="controlled value" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('controlled value');
  });

  it('should handle uncontrolled mode without value or defaultValue', () => {
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should call onChange handler', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur handler', () => {
    const handleBlur = jest.fn();
    render(<Input onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should validate with validationRule returning true', async () => {
    const validationRule = jest.fn(() => true);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(validationRule).toHaveBeenCalled();
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  it('should validate with validationRule returning false', async () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });
  });

  it('should validate with validationRule returning error string', async () => {
    const validationRule = jest.fn(() => 'Custom error message');
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  it('should use errorMessage prop when validationRule returns false', async () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} errorMessage="Custom error" />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Custom error')).toBeInTheDocument();
    });
  });

  it('should set aria-invalid when there is an error', async () => {
    const validationRule = jest.fn(() => false);
    const { container } = render(<Input validationRule={validationRule} />);
    const input = container.querySelector('[data-slot="input"]') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should not set aria-invalid when there is no error', () => {
    const { container } = render(<Input />);
    const input = container.querySelector('[data-slot="input"]') as HTMLInputElement;
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should display error message when invalid', async () => {
    const validationRule = jest.fn(() => 'Error occurred');
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      const errorMessage = screen.getByText('Error occurred');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-sm', 'text-destructive');
    });
  });

  it('should not display error message when valid', () => {
    const validationRule = jest.fn(() => true);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });

  it('should debounce validation on change', async () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Should not have validated yet (debounced)
    expect(validationRule).not.toHaveBeenCalled();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    await waitFor(() => {
      expect(validationRule).toHaveBeenCalled();
    });
  });

  it('should validate immediately on blur', async () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(validationRule).toHaveBeenCalled();
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });
  });

  it('should handle type prop', () => {
    const { container } = render(<Input type="email" />);
    const input = container.querySelector('[data-slot="input"]') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should handle placeholder prop', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector('[data-slot="input"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('should handle required prop', () => {
    const { container } = render(<Input required />);
    const input = container.querySelector('[data-slot="input"]') as HTMLInputElement;
    expect(input).toBeRequired();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should pass through additional props', () => {
    const { container } = render(<Input data-testid="custom-input" id="input-id" />);
    const input = container.querySelector('[data-slot="input"]');
    expect(input).toHaveAttribute('data-testid', 'custom-input');
    expect(input).toHaveAttribute('id', 'input-id');
  });

  it('should handle number defaultValue', () => {
    render(<Input defaultValue={123} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('123');
  });

  it('should handle number value in controlled mode', () => {
    render(<Input value={456} onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('456');
  });

  it('should not validate on change if field is not touched and empty', () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(validationRule).not.toHaveBeenCalled();
  });

  it('should validate on change if field has content even if not touched', () => {
    const validationRule = jest.fn(() => false);
    render(<Input validationRule={validationRule} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(validationRule).toHaveBeenCalledWith('test');
  });
});
