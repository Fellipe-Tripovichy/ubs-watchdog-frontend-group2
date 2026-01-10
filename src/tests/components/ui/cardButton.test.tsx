import { render, screen, fireEvent } from '@testing-library/react';
import { CardButton } from '@/components/ui/cardButton';

describe('CardButton', () => {
  const defaultProps = {
    icon: '/test-image.jpg',
    title: 'Test Title',
    description: 'Test Description',
  };

  it('should render', () => {
    render(<CardButton {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render as a button element by default', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button?.tagName).toBe('BUTTON');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toBeInTheDocument();
  });

  it('should have data-variant attribute with default value', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should have data-size attribute with default value', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should apply default classes', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveClass('cursor-pointer', 'inline-flex', 'items-center');
    expect(button).toHaveClass('w-full', 'min-w-[281px]');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<CardButton {...defaultProps} className="custom-class" />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveClass('custom-class');
  });

  it('should render image with correct src and alt', () => {
    render(<CardButton {...defaultProps} />);
    const image = screen.getByAltText('Test Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should render title', () => {
    render(<CardButton {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render title as h3 element', () => {
    render(<CardButton {...defaultProps} />);
    const title = screen.getByText('Test Title');
    expect(title.tagName).toBe('H3');
  });

  it('should render description', () => {
    render(<CardButton {...defaultProps} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render ArrowRight icon', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should apply default classes to title', () => {
    render(<CardButton {...defaultProps} />);
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('p-2', 'border-l-2', 'border-primary');
    expect(title).toHaveClass('bg-background/95');
  });

  it('should apply default classes to description', () => {
    render(<CardButton {...defaultProps} />);
    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('opacity-0');
    expect(description).toHaveClass('transition-opacity');
  });

  it('should show description on hover', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const description = screen.getByText('Test Description');
    
    expect(description).toHaveClass('opacity-0');
    
    fireEvent.mouseEnter(button);
    expect(description).toHaveClass('opacity-100');
  });

  it('should hide description when not hovered', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const description = screen.getByText('Test Description');
    
    fireEvent.mouseEnter(button);
    expect(description).toHaveClass('opacity-100');
    
    fireEvent.mouseLeave(button);
    expect(description).toHaveClass('opacity-0');
  });

  it('should underline title on hover', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const title = screen.getByText('Test Title');
    
    expect(title).not.toHaveClass('underline');
    expect(title).toHaveClass('bg-background/95');
    
    fireEvent.mouseEnter(button);
    expect(title).toHaveClass('underline');
    expect(title).not.toHaveClass('bg-background/95');
  });

  it('should change arrow background on hover', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const arrowContainer = container.querySelector('.absolute.bottom-5.right-5');
    
    expect(arrowContainer).toHaveClass('bg-background', 'rounded-full', 'shadow-lg');
    expect(arrowContainer).not.toHaveClass('bg-transparent');
    
    fireEvent.mouseEnter(button);
    expect(arrowContainer).toHaveClass('bg-transparent');
    expect(arrowContainer).not.toHaveClass('bg-background');
  });

  it('should add background to overlay on hover', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const overlay = container.querySelector('.absolute.bottom-0.left-0');
    
    expect(overlay).not.toHaveClass('bg-background');
    
    fireEvent.mouseEnter(button);
    expect(overlay).toHaveClass('bg-background');
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    const { container } = render(<CardButton {...defaultProps} onClick={handleClick} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLButtonElement;
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const { container } = render(<CardButton {...defaultProps} disabled />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should pass through additional props', () => {
    const { container } = render(<CardButton {...defaultProps} data-testid="custom-button" id="button-id" />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('id', 'button-id');
  });

  it('should render with asChild prop', () => {
    const { container } = render(
      <CardButton {...defaultProps} asChild>
        <a href="/test">Link</a>
      </CardButton>
    );
    // When asChild is true, Slot should merge props with the child
    // The link should be rendered (may be wrapped or have props merged)
    const link = container.querySelector('a[href="/test"]') || container.querySelector('a');
    expect(link).toBeInTheDocument();
    // CardButton content should be rendered
    const title = screen.getByText('Test Title');
    expect(title).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    const { container } = render(<CardButton {...defaultProps} variant="default" />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveClass('bg-background');
  });

  it('should apply size classes', () => {
    const { container } = render(<CardButton {...defaultProps} size="default" />);
    const button = container.querySelector('[data-slot="card-button"]');
    expect(button).toHaveClass('p-0');
  });

  it('should render image container with correct classes', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const imageContainer = container.querySelector('.flex.items-center.justify-center');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('min-h-64', 'max-h-64', 'overflow-hidden');
  });

  it('should render overlay with correct classes', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const overlay = container.querySelector('.absolute.bottom-0.left-0');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('w-full', 'h-full', 'p-5', 'shadow-lg');
  });

  it('should handle multiple hover state changes', () => {
    const { container } = render(<CardButton {...defaultProps} />);
    const button = container.querySelector('[data-slot="card-button"]') as HTMLElement;
    const description = screen.getByText('Test Description');
    
    fireEvent.mouseEnter(button);
    expect(description).toHaveClass('opacity-100');
    
    fireEvent.mouseLeave(button);
    expect(description).toHaveClass('opacity-0');
    
    fireEvent.mouseEnter(button);
    expect(description).toHaveClass('opacity-100');
  });
});
