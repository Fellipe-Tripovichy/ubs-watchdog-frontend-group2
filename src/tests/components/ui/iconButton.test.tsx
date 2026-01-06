import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { IconButton } from '@/components/ui/iconButton';

describe('IconButton', () => {
  it('should render', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it('should render as a button element by default', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button?.tagName).toBe('BUTTON');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it('should have data-variant attribute with default value', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should have data-size attribute with default value', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should apply default classes', () => {
    const { container } = render(<IconButton icon="menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('cursor-pointer', 'inline-flex', 'items-center');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<IconButton icon="menu" className="custom-class" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('custom-class');
  });

  it('should render icon', () => {
    const { container } = render(<IconButton icon="menu" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render icon with correct size for default button', () => {
    const { container } = render(<IconButton icon="menu" size="default" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-6');
  });

  it('should render icon with correct size for small button', () => {
    const { container } = render(<IconButton icon="menu" size="small" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-4');
  });

  it('should render icon with correct size for large button', () => {
    const { container } = render(<IconButton icon="menu" size="large" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-8');
  });

  it('should apply default variant', () => {
    const { container } = render(<IconButton icon="menu" variant="default" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should apply destructive variant', () => {
    const { container } = render(<IconButton icon="menu" variant="destructive" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'destructive');
  });

  it('should apply secondary variant', () => {
    const { container } = render(<IconButton icon="menu" variant="secondary" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'secondary');
  });

  it('should apply small size', () => {
    const { container } = render(<IconButton icon="menu" size="small" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveClass('h-8', 'w-8');
  });

  it('should apply default size', () => {
    const { container } = render(<IconButton icon="menu" size="default" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveClass('h-12', 'w-12');
  });

  it('should apply large size', () => {
    const { container } = render(<IconButton icon="menu" size="large" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveClass('h-16', 'w-16');
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    const { container } = render(<IconButton icon="menu" onClick={handleClick} />);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const { container } = render(<IconButton icon="menu" disabled />);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should pass through additional props', () => {
    const { container } = render(<IconButton icon="menu" data-testid="custom-button" id="button-id" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('id', 'button-id');
  });

  it('should render with asChild prop', () => {
    const { container } = render(
      <IconButton icon="menu" asChild>
        <a href="/test">Link</a>
      </IconButton>
    );
    // When asChild is true, Slot should merge props with the child
    // The link should be rendered (may be wrapped or have props merged)
    const link = container.querySelector('a[href="/test"]') || container.querySelector('a');
    expect(link).toBeInTheDocument();
    // Icon should be rendered inside
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle different icon names', () => {
    const { container: container1 } = render(<IconButton icon="menu" />);
    const { container: container2 } = render(<IconButton icon="x" />);
    const { container: container3 } = render(<IconButton icon="chevron-down" />);
    
    expect(container1.querySelector('svg')).toBeInTheDocument();
    expect(container2.querySelector('svg')).toBeInTheDocument();
    expect(container3.querySelector('svg')).toBeInTheDocument();
  });

  it('should handle icon name with hyphens', () => {
    const { container } = render(<IconButton icon="chevron-up" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle icon name with single word', () => {
    const { container } = render(<IconButton icon="menu" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    const { container: defaultContainer } = render(<IconButton icon="menu" variant="default" />);
    const { container: destructiveContainer } = render(<IconButton icon="menu" variant="destructive" />);
    const { container: secondaryContainer } = render(<IconButton icon="menu" variant="secondary" />);
    
    const defaultButton = defaultContainer.querySelector('[data-slot="button"]');
    const destructiveButton = destructiveContainer.querySelector('[data-slot="button"]');
    const secondaryButton = secondaryContainer.querySelector('[data-slot="button"]');
    
    expect(defaultButton).toHaveClass('text-primary');
    expect(destructiveButton).toHaveClass('text-destructive');
    expect(secondaryButton).toHaveClass('text-secondary-foreground');
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton icon="menu" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should handle aria-label for accessibility', () => {
    const { container } = render(<IconButton icon="menu" aria-label="Open menu" />);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('aria-label', 'Open menu');
  });

  it('should handle type prop', () => {
    const { container } = render(<IconButton icon="menu" type="submit" />);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });
});
