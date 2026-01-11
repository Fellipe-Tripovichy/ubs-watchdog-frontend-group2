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

  describe('asChild edge cases', () => {
    it('should throw error when asChild is true but children is a string', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <CardButton {...defaultProps} asChild>
            Invalid string child
          </CardButton>
        );
      }).toThrow('CardButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is a number', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <CardButton {...defaultProps} asChild>
            {123}
          </CardButton>
        );
      }).toThrow('CardButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is null', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <CardButton {...defaultProps} asChild>
            {null}
          </CardButton>
        );
      }).toThrow('CardButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is an array', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <CardButton {...defaultProps} asChild>
            <span>Child 1</span>
            <span>Child 2</span>
          </CardButton>
        );
      }).toThrow('CardButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should handle mouse events when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild>
          <a href="/test">Link</a>
        </CardButton>
      );
      
      // Slot merges props with the child, so data-slot should be on the <a> element
      const elementWithHandlers = container.querySelector('[data-slot="card-button"]') as HTMLElement ||
                                   container.querySelector('a[href="/test"]') as HTMLElement;
      expect(elementWithHandlers).toBeInTheDocument();
      
      const description = screen.getByText('Test Description');
      
      // Initially description should be hidden
      expect(description).toHaveClass('opacity-0');
      
      // Test mouse enter event (line 80) - should show description
      fireEvent.mouseEnter(elementWithHandlers);
      expect(description).toHaveClass('opacity-100');
      
      // Test mouse leave event (line 81) - should hide description
      fireEvent.mouseLeave(elementWithHandlers);
      expect(description).toHaveClass('opacity-0');
    });

    it('should handle hover state changes when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild>
          <div>Card Content</div>
        </CardButton>
      );
      
      // Slot merges props with the child, so the div should have data-slot attribute
      const cardElement = container.querySelector('[data-slot="card-button"]') as HTMLElement;
      expect(cardElement).toBeInTheDocument();
      
      const title = screen.getByText('Test Title');
      const description = screen.getByText('Test Description');
      const overlay = container.querySelector('.absolute.bottom-0.left-0');
      const arrowContainer = container.querySelector('.absolute.bottom-5.right-5');
      
      // Initially not hovered
      expect(title).not.toHaveClass('underline');
      expect(description).toHaveClass('opacity-0');
      expect(overlay).not.toHaveClass('bg-background');
      expect(arrowContainer).toHaveClass('bg-background');
      
      // On hover (line 80) - trigger on the element that has the event handlers
      fireEvent.mouseEnter(cardElement);
      expect(title).toHaveClass('underline');
      expect(description).toHaveClass('opacity-100');
      expect(overlay).toHaveClass('bg-background');
      expect(arrowContainer).toHaveClass('bg-transparent');
      
      // On mouse leave (line 81)
      fireEvent.mouseLeave(cardElement);
      expect(title).not.toHaveClass('underline');
      expect(description).toHaveClass('opacity-0');
      expect(overlay).not.toHaveClass('bg-background');
      expect(arrowContainer).toHaveClass('bg-background');
    });

    it('should apply variant when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild variant="default">
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('data-variant', 'default');
      expect(link).toHaveClass('bg-background');
    });

    it('should apply size when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild size="default">
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('data-size', 'default');
      expect(link).toHaveClass('p-0');
    });

    it('should apply className when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild className="custom-class">
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('custom-class');
    });

    it('should pass through additional props when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild data-testid="custom-card-button" id="card-button-id">
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      // Props should be merged by Slot component
      expect(link).toHaveAttribute('data-testid', 'custom-card-button');
    });

    it('should handle onClick when asChild is true', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <CardButton {...defaultProps} asChild onClick={handleClick}>
          <a href="/test">Link</a>
        </CardButton>
      );
      
      // Slot merges props, so handlers should be on the child element
      const elementWithHandlers = container.querySelector('[data-slot="card-button"]') as HTMLElement ||
                                   container.querySelector('a[href="/test"]') as HTMLElement;
      expect(elementWithHandlers).toBeInTheDocument();
      fireEvent.click(elementWithHandlers);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle aria-label when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild aria-label="Card button link">
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const element = container.querySelector('[data-slot="card-button"]') as HTMLElement;
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('aria-label', 'Card button link');
    });

    it('should handle disabled state when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild disabled>
          <a href="/test">Link</a>
        </CardButton>
      );
      
      const link = container.querySelector('a[href="/test"]') as HTMLElement;
      expect(link).toBeInTheDocument();
      // Disabled state should be applied via Slot
      expect(link).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('should maintain hover state transitions when asChild is true', () => {
      const { container } = render(
        <CardButton {...defaultProps} asChild>
          <a href="/test">Card</a>
        </CardButton>
      );
      
      // Use data-slot selector as Slot merges props with child
      const elementWithHandlers = container.querySelector('[data-slot="card-button"]') as HTMLElement;
      expect(elementWithHandlers).toBeInTheDocument();
      
      const description = screen.getByText('Test Description');
      
      // Multiple hover cycles (testing lines 80-81)
      fireEvent.mouseEnter(elementWithHandlers);
      expect(description).toHaveClass('opacity-100');
      
      fireEvent.mouseLeave(elementWithHandlers);
      expect(description).toHaveClass('opacity-0');
      
      fireEvent.mouseEnter(elementWithHandlers);
      expect(description).toHaveClass('opacity-100');
      
      fireEvent.mouseLeave(elementWithHandlers);
      expect(description).toHaveClass('opacity-0');
    });
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
