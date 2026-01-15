import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

describe('Textarea', () => {
  it('should render', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('should render as a textarea element', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.tagName).toBe('TEXTAREA');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('border-input', 'rounded-xs', 'border', 'bg-transparent');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Textarea className="custom-class" />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('custom-class');
    expect(textarea).toHaveClass('border-input');
  });

  it('should handle uncontrolled mode with defaultValue', () => {
    render(<Textarea defaultValue="initial value" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('initial value');
  });

  it('should handle controlled mode with value', () => {
    render(<Textarea value="controlled value" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('controlled value');
  });

  it('should handle uncontrolled mode without value or defaultValue', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('should call onChange handler', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur handler', () => {
    const handleBlur = jest.fn();
    render(<Textarea onBlur={handleBlur} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should call onFocus handler', () => {
    const handleFocus = jest.fn();
    render(<Textarea onFocus={handleFocus} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('should handle placeholder', () => {
    render(<Textarea placeholder="Enter text here" />);
    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should handle readOnly state', () => {
    render(<Textarea readOnly />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('should handle required attribute', () => {
    render(<Textarea required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('should handle rows attribute', () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(5);
  });

  it('should handle cols attribute', () => {
    render(<Textarea cols={50} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.cols).toBe(50);
  });

  it('should handle maxLength attribute', () => {
    render(<Textarea maxLength={100} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(100);
  });

  it('should handle minLength attribute', () => {
    render(<Textarea minLength={10} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.minLength).toBe(10);
  });

  it('should handle name attribute', () => {
    render(<Textarea name="description" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('name', 'description');
  });

  it('should handle id attribute', () => {
    render(<Textarea id="textarea-id" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'textarea-id');
  });

  it('should handle aria-label attribute', () => {
    render(<Textarea aria-label="Description" />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toBeInTheDocument();
  });

  it('should handle aria-describedby attribute', () => {
    render(
      <>
        <Textarea aria-describedby="help-text" />
        <div id="help-text">Help text</div>
      </>
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('should handle aria-invalid attribute', () => {
    const { container } = render(<Textarea aria-invalid="true" />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should apply aria-invalid styles when aria-invalid is true', () => {
    const { container } = render(<Textarea aria-invalid="true" />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('aria-invalid:ring-destructive/20', 'aria-invalid:border-destructive');
  });

  it('should forward additional props', () => {
    render(<Textarea data-testid="custom-textarea" autoComplete="off" />);
    const textarea = screen.getByTestId('custom-textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('autoComplete', 'off');
  });

  it('should render children as value in controlled mode', () => {
    render(<Textarea value="Some text" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Some text');
  });

  it('should handle multiline text input', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    const multilineText = 'Line 1\nLine 2\nLine 3';
    fireEvent.change(textarea, { target: { value: multilineText } });
    expect(handleChange).toHaveBeenCalled();
    expect((textarea as HTMLTextAreaElement).value).toBe(multilineText);
  });

  it('should apply min-h-16 class for minimum height', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('min-h-16');
  });

  it('should apply w-full class for full width', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('w-full');
  });

  it('should apply field-sizing-content class', () => {
    const { container } = render(<Textarea />);
    const textarea = container.querySelector('[data-slot="textarea"]');
    expect(textarea).toHaveClass('field-sizing-content');
  });
});
