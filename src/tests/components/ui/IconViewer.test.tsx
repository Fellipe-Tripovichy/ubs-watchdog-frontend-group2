import { render, screen } from '@testing-library/react';
import IconViewer from '@/components/ui/IconViewer';
import React from 'react';

jest.mock('lucide-react', () => ({
  Check: ({ size, color, className, ...props }: any) => (
    <svg data-testid="check-icon" data-size={size} data-color={color} className={className} {...props} />
  ),
  ChevronDown: ({ size, color, className, ...props }: any) => (
    <svg data-testid="chevron-down-icon" data-size={size} data-color={color} className={className} {...props} />
  ),
  ChevronUp: ({ size, color, className, ...props }: any) => (
    <svg data-testid="chevron-up-icon" data-size={size} data-color={color} className={className} {...props} />
  ),
  HelpCircle: ({ size, color, className, style, 'aria-label': ariaLabel, ...props }: any) => (
    <svg data-testid="help-circle-icon" data-size={size} data-color={color} className={className} style={style} aria-label={ariaLabel} {...props} />
  ),
  ArrowRight: ({ size, color, className, ...props }: any) => (
    <svg data-testid="arrow-right-icon" data-size={size} data-color={color} className={className} {...props} />
  ),
  ArrowLeft: ({ size, color, className, ...props }: any) => (
    <svg data-testid="arrow-left-icon" data-size={size} data-color={color} className={className} {...props} />
  ),
}));

describe('IconViewer', () => {
  it('should render', () => {
    render(<IconViewer iconName="Check" />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should find icon by exact name match', () => {
    render(<IconViewer iconName="Check" />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should find icon by hyphenated name converted to PascalCase', () => {
    render(<IconViewer iconName="chevron-down" />);
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  it('should find icon by PascalCase conversion', () => {
    render(<IconViewer iconName="arrowRight" />);
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });

  it('should find icon by case-insensitive match', () => {
    render(<IconViewer iconName="CHECK" />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should use default size of 24 when size is not provided', () => {
    render(<IconViewer iconName="Check" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-size', '24');
  });

  it('should use provided numeric size', () => {
    render(<IconViewer iconName="Check" size={32} />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-size', '32');
  });

  it('should convert string size to number', () => {
    render(<IconViewer iconName="Check" size="48" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-size', '48');
  });

  it('should use default size when string size is invalid', () => {
    render(<IconViewer iconName="Check" size="invalid" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-size', '24');
  });

  it('should use default size when string size is empty', () => {
    render(<IconViewer iconName="Check" size="" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-size', '24');
  });

  it('should use default color of currentColor when color is not provided', () => {
    render(<IconViewer iconName="Check" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-color', 'currentColor');
  });

  it('should use provided color', () => {
    render(<IconViewer iconName="Check" color="#ff0000" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveAttribute('data-color', '#ff0000');
  });

  it('should apply custom className', () => {
    render(<IconViewer iconName="Check" className="custom-class" />);
    const icon = screen.getByTestId('check-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('should render HelpCircle fallback when icon is not found and HelpCircle exists', () => {
    render(<IconViewer iconName="NonExistentIcon" />);
    const fallback = screen.getByTestId('help-circle-icon');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('aria-label', 'Icon "NonExistentIcon" not found');
    expect(fallback).toHaveStyle({ opacity: 0.2 });
  });


  it('should apply size to fallback HelpCircle', () => {
    render(<IconViewer iconName="NonExistentIcon" size={48} />);
    const fallback = screen.getByTestId('help-circle-icon');
    expect(fallback).toHaveAttribute('data-size', '48');
  });

  it('should apply color to fallback HelpCircle', () => {
    render(<IconViewer iconName="NonExistentIcon" color="#ff0000" />);
    const fallback = screen.getByTestId('help-circle-icon');
    expect(fallback).toHaveAttribute('data-color', '#ff0000');
  });

  it('should apply className to fallback HelpCircle', () => {
    render(<IconViewer iconName="NonExistentIcon" className="custom-class" />);
    const fallback = screen.getByTestId('help-circle-icon');
    expect(fallback).toHaveClass('custom-class');
  });


  it('should handle icon names with mixed case', () => {
    render(<IconViewer iconName="check" />);
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should handle icon names starting with lowercase', () => {
    render(<IconViewer iconName="arrowRight" />);
    expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
  });
});
