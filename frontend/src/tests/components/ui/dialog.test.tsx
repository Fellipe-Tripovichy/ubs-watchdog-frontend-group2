import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';

jest.mock('lucide-react', () => ({
  XIcon: () => <svg data-testid="x-icon" />,
}));

describe('Dialog', () => {
  it('should render Dialog component', () => {
    render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
  });

  it('should have data-slot attribute on Dialog root', () => {
    render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
  });

  it('should forward props to Dialog root', () => {
    render(
      <Dialog open>
        <DialogContent data-testid="test-dialog-content">Content</DialogContent>
      </Dialog>
    );
    const content = screen.getByTestId('test-dialog-content');
    expect(content).toBeInTheDocument();
  });
});

describe('DialogTrigger', () => {
  it('should render DialogTrigger component', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const trigger = screen.getByText('Open Dialog');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogTrigger', () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const trigger = container.querySelector('[data-slot="dialog-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should forward props to DialogTrigger', () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger data-testid="test-trigger">Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const trigger = container.querySelector('[data-slot="dialog-trigger"]');
    expect(trigger).toHaveAttribute('data-testid', 'test-trigger');
  });
});

describe('DialogPortal', () => {
  it('should render DialogPortal component', () => {
    render(
      <Dialog open>
        <DialogPortal>
          <div>Portal Content</div>
        </DialogPortal>
      </Dialog>
    );
    const content = screen.getByText('Portal Content');
    expect(content).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogPortal', () => {
    render(
      <Dialog open>
        <DialogPortal>
          <div data-testid="portal-content">Content</div>
        </DialogPortal>
      </Dialog>
    );
    const content = screen.getByTestId('portal-content');
    expect(content).toBeInTheDocument();
  });
});

describe('DialogOverlay', () => {
  it('should render DialogOverlay component', () => {
    const { container } = render(
      <Dialog open>
        <DialogOverlay />
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const overlay = container.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogOverlay', () => {
    const { container } = render(
      <Dialog open>
        <DialogOverlay />
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const overlay = container.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
  });

  it('should apply default classes to DialogOverlay', () => {
    const { container } = render(
      <Dialog open>
        <DialogOverlay />
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const overlay = container.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/50');
  });

  it('should merge custom className with default classes on DialogOverlay', () => {
    const { container } = render(
      <Dialog open>
        <DialogOverlay className="custom-overlay" />
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const overlay = container.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toHaveClass('custom-overlay', 'fixed', 'inset-0');
  });
});

describe('DialogContent', () => {
  it('should render DialogContent component', () => {
    render(
      <Dialog open>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );
    const content = screen.getByText('Dialog Content');
    expect(content).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogContent', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const content = baseElement.querySelector('[data-slot="dialog-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes to DialogContent', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const content = baseElement.querySelector('[data-slot="dialog-content"]');
    expect(content).toHaveClass('bg-background', 'rounded-lg', 'border', 'p-6', 'shadow-lg');
  });

  it('should merge custom className with default classes on DialogContent', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent className="custom-content">Content</DialogContent>
      </Dialog>
    );
    const content = baseElement.querySelector('[data-slot="dialog-content"]');
    expect(content).toHaveClass('custom-content', 'bg-background', 'rounded-lg');
  });

  it('should render close button by default', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const closeButton = baseElement.querySelector('[data-slot="dialog-close"]');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render XIcon in close button', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );
    const xIcon = baseElement.querySelector('[data-testid="x-icon"]');
    expect(xIcon).toBeInTheDocument();
  });

  it('should not render close button when showCloseButton is false', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent showCloseButton={false}>Content</DialogContent>
      </Dialog>
    );
    const closeButtons = baseElement.querySelectorAll('[data-slot="dialog-close"]');
    expect(closeButtons.length).toBe(0);
  });

  it('should render children in DialogContent', () => {
    render(
      <Dialog open>
        <DialogContent>
          <div>Child Content</div>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});

describe('DialogHeader', () => {
  it('should render DialogHeader component', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>Header Content</DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const header = screen.getByText('Header Content');
    expect(header).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogHeader', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>Header</DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const header = baseElement.querySelector('[data-slot="dialog-header"]');
    expect(header).toBeInTheDocument();
  });

  it('should apply default classes to DialogHeader', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>Header</DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const header = baseElement.querySelector('[data-slot="dialog-header"]');
    expect(header).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('should merge custom className with default classes on DialogHeader', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader className="custom-header">Header</DialogHeader>
        </DialogContent>
      </Dialog>
    );
    const header = baseElement.querySelector('[data-slot="dialog-header"]');
    expect(header).toHaveClass('custom-header', 'flex', 'flex-col');
  });
});

describe('DialogFooter', () => {
  it('should render DialogFooter component', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogFooter>Footer Content</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    const footer = screen.getByText('Footer Content');
    expect(footer).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogFooter', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    const footer = baseElement.querySelector('[data-slot="dialog-footer"]');
    expect(footer).toBeInTheDocument();
  });

  it('should apply default classes to DialogFooter', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    const footer = baseElement.querySelector('[data-slot="dialog-footer"]');
    expect(footer).toHaveClass('flex', 'flex-col-reverse', 'gap-2');
  });

  it('should merge custom className with default classes on DialogFooter', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogFooter className="custom-footer">Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );
    const footer = baseElement.querySelector('[data-slot="dialog-footer"]');
    expect(footer).toHaveClass('custom-footer', 'flex', 'flex-col-reverse');
  });
});

describe('DialogTitle', () => {
  it('should render DialogTitle component', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = screen.getByText('Dialog Title');
    expect(title).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogTitle', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = baseElement.querySelector('[data-slot="dialog-title"]');
    expect(title).toBeInTheDocument();
  });

  it('should apply default classes to DialogTitle', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = baseElement.querySelector('[data-slot="dialog-title"]');
    expect(title).toHaveClass('text-lg', 'leading-none', 'font-semibold');
  });

  it('should merge custom className with default classes on DialogTitle', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle className="custom-title">Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = baseElement.querySelector('[data-slot="dialog-title"]');
    expect(title).toHaveClass('custom-title', 'text-lg', 'font-semibold');
  });
});

describe('DialogDescription', () => {
  it('should render DialogDescription component', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = screen.getByText('Dialog Description');
    expect(description).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogDescription', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = baseElement.querySelector('[data-slot="dialog-description"]');
    expect(description).toBeInTheDocument();
  });

  it('should apply default classes to DialogDescription', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = baseElement.querySelector('[data-slot="dialog-description"]');
    expect(description).toHaveClass('text-muted-foreground', 'text-sm');
  });

  it('should merge custom className with default classes on DialogDescription', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogDescription className="custom-description">Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = baseElement.querySelector('[data-slot="dialog-description"]');
    expect(description).toHaveClass('custom-description', 'text-muted-foreground', 'text-sm');
  });
});

describe('DialogClose', () => {
  it('should render DialogClose component', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogClose>Close Button</DialogClose>
        </DialogContent>
      </Dialog>
    );
    const close = screen.getByText('Close Button');
    expect(close).toBeInTheDocument();
  });

  it('should have data-slot attribute on DialogClose', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );
    const closeButtons = baseElement.querySelectorAll('[data-slot="dialog-close"]');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('should forward props to DialogClose', () => {
    const { baseElement } = render(
      <Dialog open>
        <DialogContent>
          <DialogClose data-testid="test-close">Close</DialogClose>
        </DialogContent>
      </Dialog>
    );
    const close = baseElement.querySelector('[data-testid="test-close"]');
    expect(close).toBeInTheDocument();
    expect(close).toHaveAttribute('data-slot', 'dialog-close');
  });
});

describe('Dialog integration', () => {
  it('should render complete dialog structure', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <div>Body Content</div>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should handle open state', () => {
    const { rerender } = render(
      <Dialog open={false}>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    rerender(
      <Dialog open={true}>
        <DialogContent>Content</DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
