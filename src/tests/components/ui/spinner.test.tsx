import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/spinner';

describe('Spinner', () => {
  it('should render', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('should apply default classes', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('size-4', 'animate-spin', 'text-primary');
  });

  it('should merge custom className with default classes', () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('size-4', 'animate-spin', 'text-primary', 'custom-class');
  });

  it('should pass through additional svg props', () => {
    render(<Spinner data-testid="custom-spinner" id="spinner-id" />);
    const spinner = screen.getByTestId('custom-spinner');
    expect(spinner).toHaveAttribute('id', 'spinner-id');
  });

  it('should render as an svg element', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner.tagName).toBe('svg');
  });
});
