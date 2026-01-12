import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should render as a span element by default', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge?.tagName).toBe('SPAN');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
  });

  it('should wrap children in a div with text-caption class', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    const childDiv = badge?.querySelector('div.text-caption');
    expect(childDiv).toBeInTheDocument();
    expect(childDiv).toHaveTextContent('Test Badge');
  });

  it('should apply default variant classes', () => {
    const { container } = render(<Badge variant="default">Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground');
  });

  it('should apply secondary variant classes', () => {
    const { container } = render(<Badge variant="secondary">Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground');
  });

  it('should apply destructive variant classes', () => {
    const { container } = render(<Badge variant="destructive">Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-white');
  });

  it('should apply outline variant classes', () => {
    const { container } = render(<Badge variant="outline">Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('text-foreground');
  });

  it('should use default variant when variant is not provided', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground');
  });

  it('should apply base classes', () => {
    const { container } = render(<Badge>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-sm',
      'border',
      'px-2',
      'py-0.5',
      'font-medium'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Badge className="custom-class">Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('bg-primary'); // Still has default variant classes
  });

  it('should render children correctly', () => {
    render(<Badge>Custom Content</Badge>);
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('should render complex children', () => {
    const { container } = render(
      <Badge>
        <span>Complex</span> Content
      </Badge>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    // Text is split across elements, so check that the badge contains the full text
    const badge = container.querySelector('[data-slot="badge"]');
    const childDiv = badge?.querySelector('div.text-caption');
    expect(childDiv?.textContent).toBe('Complex Content');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Badge data-testid="custom-badge" id="badge-id" title="Badge title">
        Test Badge
      </Badge>
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveAttribute('data-testid', 'custom-badge');
    expect(badge).toHaveAttribute('id', 'badge-id');
    expect(badge).toHaveAttribute('title', 'Badge title');
  });

  it('should render with asChild prop using Slot', () => {
    const { container } = render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>
    );
    // When asChild is true, Slot merges props with the first child element
    // However, Badge wraps children in a div, so Slot merges with the div, not the link
    // The link should still be rendered inside
    const link = container.querySelector('a[href="/test"]');
    expect(link).toBeInTheDocument();
    expect(link?.tagName).toBe('A');
    expect(screen.getByText('Link Badge')).toBeInTheDocument();
    // Verify the link is within the badge structure
    // The div wrapper should exist with text-caption class
    const wrapperDiv = link?.parentElement;
    expect(wrapperDiv).toHaveClass('text-caption');
  });

  it('should render as span when asChild is false', () => {
    const { container } = render(<Badge asChild={false}>Test Badge</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge?.tagName).toBe('SPAN');
  });

  it('should combine variant with custom className', () => {
    const { container } = render(
      <Badge variant="secondary" className="extra-class">
        Test Badge
      </Badge>
    );
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toHaveClass('bg-secondary');
    expect(badge).toHaveClass('extra-class');
  });

  it('should handle empty children', () => {
    const { container } = render(<Badge>{''}</Badge>);
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    const childDiv = badge?.querySelector('div.text-caption');
    expect(childDiv).toBeInTheDocument();
  });

  it('should handle numeric children', () => {
    render(<Badge>{42}</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  describe('badgeVariants', () => {
    it('should export badgeVariants function', () => {
      expect(typeof badgeVariants).toBe('function');
    });

    it('should generate classes for default variant', () => {
      const classes = badgeVariants({ variant: 'default' });
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate classes for secondary variant', () => {
      const classes = badgeVariants({ variant: 'secondary' });
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('text-secondary-foreground');
    });

    it('should generate classes for destructive variant', () => {
      const classes = badgeVariants({ variant: 'destructive' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-white');
    });

    it('should generate classes for outline variant', () => {
      const classes = badgeVariants({ variant: 'outline' });
      expect(classes).toContain('text-foreground');
    });
  });

  describe('edge cases', () => {
    it('should handle undefined className', () => {
      const { container } = render(<Badge className={undefined}>Test Badge</Badge>);
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it('should handle multiple className strings', () => {
      const { container } = render(
        <Badge className="class1 class2 class3">Test Badge</Badge>
      );
      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toHaveClass('class1', 'class2', 'class3');
    });

    it('should render with all variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
      variants.forEach((variant) => {
        const { container } = render(<Badge variant={variant}>Test</Badge>);
        const badge = container.querySelector('[data-slot="badge"]');
        expect(badge).toBeInTheDocument();
      });
    });
  });
});
