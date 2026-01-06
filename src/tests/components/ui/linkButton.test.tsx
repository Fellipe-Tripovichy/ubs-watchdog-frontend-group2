import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { LinkButton } from '@/components/ui/linkButton';

describe('LinkButton', () => {
  it('should render', () => {
    render(<LinkButton>Click me</LinkButton>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('should render as a button element by default', () => {
    render(<LinkButton>Click me</LinkButton>);
    const button = screen.getByText('Click me').closest('button');
    expect(button).toBeInTheDocument();
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<LinkButton>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it('should have data-variant attribute with default value', () => {
    const { container } = render(<LinkButton>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should have data-size attribute with default value', () => {
    const { container } = render(<LinkButton>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should apply default classes', () => {
    const { container } = render(<LinkButton>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('cursor-pointer', 'inline-flex', 'items-center');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<LinkButton className="custom-class">Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(<LinkButton>Test Content</LinkButton>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render icon on the right by default', () => {
    const { container } = render(<LinkButton icon="chevron-right">Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
    // Icon should be rendered (check for SVG)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render icon on the left when iconLeft is true', () => {
    const { container } = render(<LinkButton icon="chevron-left" iconLeft>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
    // Icon should be rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply small size variant', () => {
    const { container } = render(<LinkButton size="small">Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'small');
  });

  it('should apply default size variant', () => {
    const { container } = render(<LinkButton size="default">Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should render icon with correct size for small button', () => {
    const { container } = render(<LinkButton icon="chevron-right" size="small">Click me</LinkButton>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-3');
  });

  it('should render icon with correct size for default button', () => {
    const { container } = render(<LinkButton icon="chevron-right" size="default">Click me</LinkButton>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('size-4');
  });

  it('should not render icon when icon prop is not provided', () => {
    const { container } = render(<LinkButton>Click me</LinkButton>);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    const { container } = render(<LinkButton data-testid="custom-button" id="button-id">Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('id', 'button-id');
  });

  it('should handle disabled state', () => {
    const { container } = render(<LinkButton disabled>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    const { container } = render(<LinkButton onClick={handleClick}>Click me</LinkButton>);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with asChild prop', () => {
    render(
      <LinkButton asChild>
        <a href="/test">Link Text</a>
      </LinkButton>
    );
    const link = screen.getByText('Link Text');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('should render icon with left margin when iconLeft is false', () => {
    const { container } = render(<LinkButton icon="chevron-right">Click me</LinkButton>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('ml-2');
  });

  it('should render icon with right margin when iconLeft is true', () => {
    const { container } = render(<LinkButton icon="chevron-left" iconLeft>Click me</LinkButton>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('mr-2');
  });
});
