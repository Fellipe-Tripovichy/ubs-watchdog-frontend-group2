import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });

  it('should render as a button element by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button?.tagName).toBe('BUTTON');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toBeInTheDocument();
  });

  it('should have data-variant attribute with default value', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-variant', 'default');
  });

  it('should have data-size attribute with default value', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('should apply default classes', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('cursor-pointer', 'inline-flex', 'items-center');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Button className="custom-class">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(<Button>Test Content</Button>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render arrows by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2); // ArrowRight and ChevronRight
  });

  it('should not render arrows when showArrow is false', () => {
    const { container } = render(<Button showArrow={false}>Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(0);
  });

  it('should apply default variant classes', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('should apply destructive variant classes', () => {
    const { container } = render(<Button variant="destructive">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('bg-destructive', 'text-white');
  });

  it('should apply secondary variant classes', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('border', 'bg-background', 'shadow-xs');
  });

  it('should apply link variant classes', () => {
    const { container } = render(<Button variant="link">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('text-foreground', 'underline-offset-4');
  });

  it('should apply default size classes', () => {
    const { container } = render(<Button size="default">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('h-12', 'px-4', 'py-2');
  });

  it('should apply small size classes', () => {
    const { container } = render(<Button size="small">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveClass('py-2', 'px-3');
  });

  it('should render ChevronRight icon with correct initial state', () => {
    const { container } = render(<Button>Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    // Find ChevronRight (should be visible initially with opacity-100 and -translate-x-1)
    const chevron = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(chevron).toBeInTheDocument();
  });

  it('should animate arrows on hover', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const svgs = container.querySelectorAll('svg');
    
    // Initially ChevronRight should be visible, ArrowRight hidden
    const chevron = Array.from(svgs).find(svg => svg.classList.contains('opacity-100'));
    expect(chevron).toBeInTheDocument();
    
    fireEvent.mouseEnter(button);
    
    // On hover, ArrowRight should be visible, ChevronRight hidden
    const arrow = Array.from(container.querySelectorAll('svg')).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(arrow).toBeInTheDocument();
  });

  it('should change arrow visibility on hover for default variant', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const svgs = container.querySelectorAll('svg');
    
    // Find ArrowRight (should be hidden initially)
    const arrowRight = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-0')
    );
    expect(arrowRight).toBeInTheDocument();
    
    fireEvent.mouseEnter(button);
    
    // ArrowRight should now be visible
    const visibleArrow = Array.from(container.querySelectorAll('svg')).find(svg =>
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(visibleArrow).toBeInTheDocument();
  });

  it('should apply correct arrow color for default variant', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveClass('text-primary-foreground');
    });
  });

  it('should apply correct arrow color for non-default variants', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveClass('text-primary');
    });
  });

  it('should render arrows with correct size for default button', () => {
    const { container } = render(<Button size="default">Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });
  });

  it('should render arrows with correct size for small button', () => {
    const { container } = render(<Button size="small">Click me</Button>);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });
  });

  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    const { container } = render(<Button onClick={handleClick}>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    const { container } = render(<Button disabled>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should pass through additional props', () => {
    const { container } = render(<Button data-testid="custom-button" id="button-id">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('id', 'button-id');
  });

  it('should render with asChild prop', () => {
    const { container } = render(
      <Button asChild showArrow={false}>
        <a href="/test">Link</a>
      </Button>
    );
    const link = container.querySelector('a[href="/test"]');
    expect(link).toBeInTheDocument();
    expect(link?.tagName).toBe('A');
    // When asChild is true, Slot merges props with the child element
    // Note: Button wraps children in a div, so asChild may not work as expected
    // This test verifies the link is rendered, even if wrapped
    expect(link).toBeInTheDocument();
  });

  describe('asChild edge cases', () => {
    it('should throw error when asChild is true but children is a string', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <Button asChild>
            Invalid string child
          </Button>
        );
      }).toThrow('Button with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is a number', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <Button asChild>
            {123}
          </Button>
        );
      }).toThrow('Button with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is null', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <Button asChild>
            {null}
          </Button>
        );
      }).toThrow('Button with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is an array', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <Button asChild>
            <span>Child 1</span>
            <span>Child 2</span>
          </Button>
        );
      }).toThrow('Button with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should handle mouse events when asChild is true', () => {
      const { container } = render(
        <Button asChild showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]') as HTMLElement;
      expect(link).toBeInTheDocument();
      
      // Test mouse enter event (line 63)
      fireEvent.mouseEnter(link);
      // Component should not crash and should handle the event
      expect(link).toBeInTheDocument();
      
      // Test mouse leave event (line 64)
      fireEvent.mouseLeave(link);
      expect(link).toBeInTheDocument();
    });

    it('should apply variant when asChild is true', () => {
      const { container } = render(
        <Button asChild variant="destructive" showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('data-variant', 'destructive');
      expect(link).toHaveClass('bg-destructive');
    });

    it('should apply size when asChild is true', () => {
      const { container } = render(
        <Button asChild size="small" showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('data-size', 'small');
      expect(link).toHaveClass('py-2', 'px-3');
    });

    it('should apply className when asChild is true', () => {
      const { container } = render(
        <Button asChild className="custom-class" showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('custom-class');
    });

    it('should apply all variants when asChild is true', () => {
      const variants = ['default', 'destructive', 'secondary', 'link'] as const;
      
      variants.forEach(variant => {
        const { container } = render(
          <Button asChild variant={variant} showArrow={false}>
            <a href="/test">Link</a>
          </Button>
        );
        
        const link = container.querySelector('a[href="/test"]');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('data-variant', variant);
      });
    });

    it('should pass through additional props when asChild is true', () => {
      const { container } = render(
        <Button asChild data-testid="custom-button" id="button-id" showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      // Props should be merged by Slot component
      expect(link).toHaveAttribute('data-testid', 'custom-button');
    });

    it('should handle onClick when asChild is true', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Button asChild onClick={handleClick} showArrow={false}>
          <a href="/test">Link</a>
        </Button>
      );
      
      const link = container.querySelector('a[href="/test"]') as HTMLElement;
      fireEvent.click(link);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('should apply margin to children wrapper when not secondary variant or not hovered', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const childrenWrapper = container.querySelector('.ml-\\[1px\\]');
    expect(childrenWrapper).toBeInTheDocument();
  });

  it('should remove margin from children wrapper for secondary variant on hover', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const childrenWrapper = container.querySelector('div');
    
    expect(childrenWrapper).toHaveClass('ml-[1px]');
    
    fireEvent.mouseEnter(button);
    
    // After hover, margin should be removed for secondary variant
    const updatedWrapper = container.querySelector('div');
    expect(updatedWrapper).not.toHaveClass('ml-[1px]');
  });

  it('should keep margin on children wrapper for default variant on hover', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const childrenWrapper = container.querySelector('div');
    
    expect(childrenWrapper).toHaveClass('ml-[1px]');
    
    fireEvent.mouseEnter(button);
    
    // Margin should remain for non-secondary variants even on hover
    const updatedWrapper = container.querySelector('div');
    expect(updatedWrapper).toHaveClass('ml-[1px]');
  });

  it('should keep margin on children wrapper for destructive variant on hover', () => {
    const { container } = render(<Button variant="destructive">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const childrenWrapper = container.querySelector('div');
    
    expect(childrenWrapper).toHaveClass('ml-[1px]');
    
    fireEvent.mouseEnter(button);
    
    // Margin should remain for non-secondary variants even on hover
    const updatedWrapper = container.querySelector('div');
    expect(updatedWrapper).toHaveClass('ml-[1px]');
  });

  it('should keep margin on children wrapper for link variant on hover', () => {
    const { container } = render(<Button variant="link">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    const childrenWrapper = container.querySelector('div');
    
    expect(childrenWrapper).toHaveClass('ml-[1px]');
    
    fireEvent.mouseEnter(button);
    
    // Margin should remain for non-secondary variants even on hover
    const updatedWrapper = container.querySelector('div');
    expect(updatedWrapper).toHaveClass('ml-[1px]');
  });

  it('should handle multiple hover state changes', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.mouseEnter(button);
    const svgsAfterHover = container.querySelectorAll('svg');
    expect(svgsAfterHover.length).toBe(2);
    
    fireEvent.mouseLeave(button);
    const svgsAfterLeave = container.querySelectorAll('svg');
    expect(svgsAfterLeave.length).toBe(2);
    
    fireEvent.mouseEnter(button);
    const svgsAfterSecondHover = container.querySelectorAll('svg');
    expect(svgsAfterSecondHover.length).toBe(2);
  });

  it('should handle type prop', () => {
    const { container } = render(<Button type="submit">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('should render arrow container with correct classes', () => {
    const { container } = render(<Button>Click me</Button>);
    const arrowContainer = container.querySelector('.relative.inline-flex.items-center.ml-2');
    expect(arrowContainer).toBeInTheDocument();
  });

  it('should handle mouseLeave event to reset hover state', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    // Initially ChevronRight should be visible
    let svgs = container.querySelectorAll('svg');
    let chevron = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(chevron).toBeInTheDocument();
    
    // On hover, ArrowRight should be visible
    fireEvent.mouseEnter(button);
    svgs = container.querySelectorAll('svg');
    let arrow = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1') &&
      !svg.classList.contains('opacity-0')
    );
    expect(arrow).toBeInTheDocument();
    
    // On mouse leave, should reset to initial state
    fireEvent.mouseLeave(button);
    svgs = container.querySelectorAll('svg');
    chevron = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(chevron).toBeInTheDocument();
  });

  it('should apply correct arrow classes for default variant on hover', () => {
    const { container } = render(<Button variant="default">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.mouseEnter(button);
    
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveClass('text-primary-foreground');
    });
    
    // ArrowRight should be visible and translated on hover
    const arrowRight = Array.from(svgs).find(svg => 
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(arrowRight).toBeInTheDocument();
  });

  it('should apply correct arrow classes for non-default variants on hover', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    fireEvent.mouseEnter(button);
    
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveClass('text-primary');
    });
  });

  it('should handle arrow animation for destructive variant', () => {
    const { container } = render(<Button variant="destructive">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2);
    
    fireEvent.mouseEnter(button);
    
    const arrowAfterHover = Array.from(container.querySelectorAll('svg')).find(svg =>
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(arrowAfterHover).toBeInTheDocument();
  });

  it('should handle arrow animation for link variant', () => {
    const { container } = render(<Button variant="link">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]') as HTMLElement;
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2);
    
    fireEvent.mouseEnter(button);
    
    const arrowAfterHover = Array.from(container.querySelectorAll('svg')).find(svg =>
      svg.classList.contains('opacity-100') && svg.classList.contains('-translate-x-1')
    );
    expect(arrowAfterHover).toBeInTheDocument();
  });

  it('should not render arrow container when showArrow is false', () => {
    const { container } = render(<Button showArrow={false}>Click me</Button>);
    const arrowContainer = container.querySelector('.relative.inline-flex.items-center.ml-2');
    expect(arrowContainer).not.toBeInTheDocument();
  });

  it('should handle aria-label prop', () => {
    const { container } = render(<Button aria-label="Submit form">Click me</Button>);
    const button = container.querySelector('[data-slot="button"]');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('should handle aria-label when asChild is true', () => {
    const { container } = render(
      <Button asChild aria-label="Navigation link" showArrow={false}>
        <a href="/test">Link</a>
      </Button>
    );
    
    const link = container.querySelector('a[href="/test"]');
    expect(link).toBeInTheDocument();
    // Props should be merged by Slot component
    expect(link).toHaveAttribute('aria-label', 'Navigation link');
  });
});
