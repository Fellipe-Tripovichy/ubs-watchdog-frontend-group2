import { render } from '@testing-library/react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('should render', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });

  it('should apply default classes', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveClass('bg-muted', 'animate-pulse', 'rounded-md');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveClass('custom-class', 'bg-muted', 'animate-pulse', 'rounded-md');
  });

  it('should forward other props', () => {
    const { container } = render(<Skeleton id="test-id" data-testid="test-skeleton" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute('id', 'test-id');
    expect(skeleton).toHaveAttribute('data-testid', 'test-skeleton');
  });

  it('should handle children', () => {
    const { container } = render(<Skeleton>Test content</Skeleton>);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveTextContent('Test content');
  });

  it('should handle style prop', () => {
    const { container } = render(<Skeleton style={{ width: '100px', height: '50px' }} />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('should handle aria attributes', () => {
    const { container } = render(<Skeleton aria-label="Loading skeleton" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading skeleton');
  });
});
