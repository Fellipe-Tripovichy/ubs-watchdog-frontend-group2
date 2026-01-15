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
    expect(input).toHaveClass('bg-transparent', 'h-9', 'w-full', 'outline-none');
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
    
    expect(validationRule).not.toHaveBeenCalled();
    
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

  it('should clear pending timeout when validationRule changes', async () => {
    const validationRule1 = jest.fn(() => false);
    const { rerender } = render(<Input validationRule={validationRule1} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(validationRule1).toHaveBeenCalled();
    });
    
    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    fireEvent.change(input, { target: { value: 'test2' } });
    
    expect(validationRule1).not.toHaveBeenCalledWith('test2');
    
    const validationRule2 = jest.fn(() => true);
    rerender(<Input validationRule={validationRule2} />);
    
    await waitFor(() => {
      expect(validationRule2).toHaveBeenCalledWith('test2');
    });
  });

  it('should clear pending timeout when errorMessage changes', async () => {
    const validationRule = jest.fn(() => false);
    const { rerender } = render(<Input validationRule={validationRule} errorMessage="Error 1" />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Error 1')).toBeInTheDocument();
    });
    
    act(() => {
      jest.runOnlyPendingTimers();
    });
    
    fireEvent.change(input, { target: { value: 'test2' } });
    
    rerender(<Input validationRule={validationRule} errorMessage="Error 2" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
  });

  it('should validate when touched and has value on validationRule change', async () => {
    const validationRule1 = jest.fn(() => true);
    const { rerender } = render(<Input validationRule={validationRule1} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    const validationRule2 = jest.fn(() => false);
    rerender(<Input validationRule={validationRule2} />);
    
    await waitFor(() => {
      expect(validationRule2).toHaveBeenCalledWith('test');
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });
  });

  it('should validate when touched and has value on errorMessage change', async () => {
    const validationRule = jest.fn(() => false);
    const { rerender } = render(<Input validationRule={validationRule} errorMessage="Error 1" />);
    const input = screen.getByRole('textbox');
    
    // Make the field touched and give it a value
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText('Error 1')).toBeInTheDocument();
    });
    
    rerender(<Input validationRule={validationRule} errorMessage="Error 2" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
  });

  it('should not validate when not touched on validationRule change', () => {
    const validationRule1 = jest.fn(() => true);
    const { rerender } = render(<Input validationRule={validationRule1} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    const validationRule2 = jest.fn(() => false);
    rerender(<Input validationRule={validationRule2} />);
    
    expect(screen.queryByText('Invalid input')).not.toBeInTheDocument();
  });

  it('should not validate when empty on validationRule change', () => {
    const validationRule1 = jest.fn(() => true);
    const { rerender } = render(<Input validationRule={validationRule1} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.blur(input);
    
    const validationRule2 = jest.fn(() => false);
    rerender(<Input validationRule={validationRule2} />);
    
    expect(screen.queryByText('Invalid input')).not.toBeInTheDocument();
  });

  it('should validate when touched and has value after validationRule and errorMessage both change', async () => {
    const validationRule1 = jest.fn(() => true);
    const { rerender } = render(<Input validationRule={validationRule1} errorMessage="Error 1" />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);
    
    const validationRule2 = jest.fn(() => false);
    rerender(<Input validationRule={validationRule2} errorMessage="Error 2" />);
    
    await waitFor(() => {
      expect(validationRule2).toHaveBeenCalledWith('test');
      expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
  });
});
