import { render, fireEvent } from '@testing-library/react';
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

  describe('asChild edge cases', () => {
    it('should throw error when asChild is true but children is a string', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <IconButton icon="menu" asChild>
            Invalid string child
          </IconButton>
        );
      }).toThrow('IconButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is a number', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <IconButton icon="menu" asChild>
            {123}
          </IconButton>
        );
      }).toThrow('IconButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should throw error when asChild is true but children is null', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(
          <IconButton icon="menu" asChild>
            {null}
          </IconButton>
        );
      }).toThrow('IconButton with asChild requires a single React element as a child');
      
      consoleSpy.mockRestore();
    });

    it('should handle asChild when icon is invalid (iconElement is null)', () => {
      const { container } = render(
        <IconButton icon="nonexistent-icon-name-xyz" asChild>
          <a href="/test">Link</a>
        </IconButton>
      );
      
      const link = container.querySelector('a[href="/test"]') || container.querySelector('a');
      expect(link).toBeInTheDocument();
      // Icon should not be rendered when icon name is invalid (line 103: newChildren = existingChildren)
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('should handle asChild when icon is empty string (iconElement is null)', () => {
      const { container } = render(
        <IconButton icon="" asChild>
          <a href="/test">Link</a>
        </IconButton>
      );
      
      const link = container.querySelector('a[href="/test"]') || container.querySelector('a');
      expect(link).toBeInTheDocument();
      // Icon should not be rendered when icon name is empty (line 103: newChildren = existingChildren)
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('should handle asChild with children elements and assign keys when needed', () => {
      // Test the code path where children elements are processed
      // This exercises the map function (line 92-97), including the key assignment check (line 93-94)
      // Note: React.Children.toArray normalizes keys, so the null key check may not be hit in practice
      // but this test ensures the code path is exercised
      const { container } = render(
        <IconButton icon="menu" asChild>
          <div>
            <span>Child 1</span>
            <span>Child 2</span>
          </div>
        </IconButton>
      );
      
      // The component should render without errors
      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      
      // Icon should be rendered
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Children should be present
      const spans = container.querySelectorAll('span');
      expect(spans.length).toBeGreaterThanOrEqual(2);
      
      // Verify that the icon was added to the children
      const allSvgElements = container.querySelectorAll('svg');
      expect(allSvgElements.length).toBeGreaterThan(0);
    });

    it('should handle asChild with children that might have null keys after processing', () => {
      // Attempt to test the key assignment path (line 94) by creating elements
      // React.Children.toArray may normalize keys, but we test the code path anyway
      const TestComponent = () => {
        // Create children elements that might have null/undefined keys
        const child1 = React.createElement('span', null, 'Test 1');
        const child2 = React.createElement('span', null, 'Test 2');
        
        return (
          <IconButton icon="menu" asChild>
            <div>
              {child1}
              {child2}
            </div>
          </IconButton>
        );
      };
      
      const { container } = render(<TestComponent />);
      
      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      const spans = container.querySelectorAll('span');
      expect(spans.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle asChild with existing children and icon', () => {
      const { container } = render(
        <IconButton icon="menu" asChild>
          <a href="/test">
            <span>Existing child</span>
          </a>
        </IconButton>
      );
      
      const link = container.querySelector('a[href="/test"]');
      expect(link).toBeInTheDocument();
      
      // Both existing child and icon should be present
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('Existing child');
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle asChild with child element that has existing children and invalid icon', () => {
      const { container } = render(
        <IconButton icon="invalid-icon-xyz" asChild>
          <div>
            <span>Child content</span>
          </div>
        </IconButton>
      );
      
      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      
      // Existing children should be preserved when icon is invalid
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('Child content');
      
      // No icon should be rendered
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('should handle asChild with empty child element', () => {
      const { container } = render(
        <IconButton icon="menu" asChild>
          <div />
        </IconButton>
      );
      
      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
      
      // Icon should still be rendered
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('getIconSize edge cases', () => {
    it('should handle null size prop', () => {
      const { container } = render(<IconButton icon="menu" size={null as any} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // When size is null, it should default to "size-6"
      expect(svg).toHaveClass('size-6');
    });

    it('should handle undefined size prop', () => {
      const { container } = render(<IconButton icon="menu" size={undefined} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // When size is undefined, it should default to "size-6"
      expect(svg).toHaveClass('size-6');
    });
  });
});
