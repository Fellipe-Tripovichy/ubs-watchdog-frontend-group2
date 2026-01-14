import { render, screen } from '@testing-library/react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Tooltip', () => {
  it('should render Tooltip component', () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeInTheDocument();
  });

  it('should render TooltipProvider component', () => {
    render(
      <TooltipProvider>
        <div>Test content</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should have data-slot attribute on TooltipProvider', () => {
    render(
      <TooltipProvider>
        <div>Test</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should use default delayDuration of 0', () => {
    render(
      <TooltipProvider>
        <div>Test</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should allow custom delayDuration', () => {
    render(
      <TooltipProvider delayDuration={500}>
        <div>Test</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should pass through additional props to TooltipProvider', () => {
    render(
      <TooltipProvider data-testid="custom-provider" skipDelayDuration={1000}>
        <div>Test</div>
      </TooltipProvider>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should render Tooltip with TooltipProvider included', () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('should have data-slot attribute on Tooltip root', () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
  });

  it('should pass through additional props to Tooltip', () => {
    render(
      <Tooltip open disableHoverableContent>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('should render TooltipTrigger component', () => {
    render(
      <Tooltip open>
        <TooltipTrigger>Click me</TooltipTrigger>
        <TooltipContent>Tooltip</TooltipContent>
      </Tooltip>
    );
    const trigger = screen.getByText('Click me');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on TooltipTrigger', () => {
    const { container } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should pass through additional props to TooltipTrigger', () => {
    const { container } = render(
      <Tooltip open>
        <TooltipTrigger asChild>
          <button>Button Trigger</button>
        </TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const button = screen.getByText('Button Trigger');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render TooltipContent component', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Tooltip Content Text</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toContain('Tooltip Content Text');
  });

  it('should have data-slot attribute on TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should render TooltipContent in a Portal', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Portal Content</TooltipContent>
      </Tooltip>
    );
      const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toContain('Portal Content');
  });

  it('should use default sideOffset of 0', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should allow custom sideOffset', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent sideOffset={10}>Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes to TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toHaveClass(
      'bg-secondary',
      'shadow-lg',
      'text-foreground',
      'rounded-md',
      'px-3',
      'py-1.5',
      'text-xs'
    );
  });

  it('should merge custom className with default classes in TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent className="custom-class">Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toHaveClass('custom-class');
    expect(content).toHaveClass('bg-secondary');
  });

  it('should render Arrow component in TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>Content</TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    const arrow = content?.querySelector('[class*="rotate-45"]');
    expect(arrow).toBeInTheDocument();
  });

  it('should render children in TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent>
          <div>Child content</div>
        </TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content?.textContent).toContain('Child content');
  });

  it('should pass through additional props to TooltipContent', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent side="top" align="center">
          Content
        </TooltipContent>
      </Tooltip>
    );
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toContain('Content');
    expect(content).toHaveAttribute('data-side', 'top');
    expect(content).toHaveAttribute('data-align', 'center');
  });

  it('should render complete tooltip structure', () => {
    const { baseElement } = render(
      <Tooltip open>
        <TooltipTrigger>Hover here</TooltipTrigger>
        <TooltipContent>This is a tooltip</TooltipContent>
      </Tooltip>
    );
    expect(screen.getByText('Hover here')).toBeInTheDocument();
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content?.textContent).toContain('This is a tooltip');
  });

  it('should handle TooltipProvider separately from Tooltip', () => {
    const { baseElement } = render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    const content = baseElement.querySelector('[data-slot="tooltip-content"]');
    expect(content?.textContent).toContain('Content');
  });

  describe('edge cases', () => {
    it('should handle empty TooltipContent', () => {
      const { baseElement } = render(
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>{''}</TooltipContent>
        </Tooltip>
      );
      const content = baseElement.querySelector('[data-slot="tooltip-content"]');
      expect(content).toBeInTheDocument();
    });

    it('should handle undefined className in TooltipContent', () => {
      const { baseElement } = render(
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className={undefined}>Content</TooltipContent>
        </Tooltip>
      );
      const content = baseElement.querySelector('[data-slot="tooltip-content"]');
      expect(content).toBeInTheDocument();
    });

    it('should handle multiple TooltipContent instances', () => {
      const { baseElement } = render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Trigger 1</TooltipTrigger>
            <TooltipContent>Content 1</TooltipContent>
          </Tooltip>
          <Tooltip open>
            <TooltipTrigger>Trigger 2</TooltipTrigger>
            <TooltipContent>Content 2</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByText('Trigger 1')).toBeInTheDocument();
      expect(screen.getByText('Trigger 2')).toBeInTheDocument();
      const contents = baseElement.querySelectorAll('[data-slot="tooltip-content"]');
      expect(contents.length).toBeGreaterThanOrEqual(2);
      expect(contents[0]?.textContent).toContain('Content 1');
      expect(contents[1]?.textContent).toContain('Content 2');
    });
  });
});
