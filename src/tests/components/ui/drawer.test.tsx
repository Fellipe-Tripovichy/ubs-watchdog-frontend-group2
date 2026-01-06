import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from '@/components/ui/drawer';

describe('Drawer', () => {
  it('should render Drawer component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const drawer = screen.getByText('Open');
    expect(drawer).toBeInTheDocument();
  });

  it('should have data-slot attribute on Drawer root', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const drawer = baseElement.querySelector('[data-slot="drawer"]');
    expect(drawer).toBeInTheDocument();
  });

  it('should render DrawerTrigger component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Trigger Button</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const trigger = screen.getByText('Trigger Button');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerTrigger', () => {
    const { container } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const trigger = container.querySelector('[data-slot="drawer-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should render DrawerContent component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Drawer Content</DrawerContent>
      </Drawer>
    );
    const content = screen.getByText('Drawer Content');
    expect(content).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerContent', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const content = baseElement.querySelector('[data-slot="drawer-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes to DrawerContent', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const content = baseElement.querySelector('[data-slot="drawer-content"]');
    expect(content).toHaveClass('bg-background');
    expect(content).toHaveClass('fixed');
    expect(content).toHaveClass('flex');
    expect(content).toHaveClass('h-auto');
    expect(content).toHaveClass('flex-col');
  });

  it('should merge custom className with default classes in DrawerContent', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent className="custom-class">Content</DrawerContent>
      </Drawer>
    );
    const content = baseElement.querySelector('[data-slot="drawer-content"]');
    expect(content).toHaveClass('custom-class');
    expect(content).toHaveClass('bg-background');
  });

  it('should render DrawerOverlay inside DrawerContent', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const overlay = baseElement.querySelector('[data-slot="drawer-overlay"]');
    expect(overlay).toBeInTheDocument();
  });

  it('should apply default classes to DrawerOverlay', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const overlay = baseElement.querySelector('[data-slot="drawer-overlay"]');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('z-40');
    expect(overlay).toHaveClass('bg-black/50');
  });

  it('should merge custom className with default classes in DrawerOverlay', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerOverlay className="custom-overlay-class" />
        </DrawerContent>
      </Drawer>
    );
    const overlay = baseElement.querySelector('[data-slot="drawer-overlay"]');
    expect(overlay).toHaveClass('custom-overlay-class');
  });

  it('should render DrawerHeader component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Header Content</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerHeader', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Header</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const header = baseElement.querySelector('[data-slot="drawer-header"]');
    expect(header).toBeInTheDocument();
  });

  it('should apply default classes to DrawerHeader', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Header</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const header = baseElement.querySelector('[data-slot="drawer-header"]');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('p-4');
  });

  it('should merge custom className with default classes in DrawerHeader', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="custom-header-class">Header</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const header = baseElement.querySelector('[data-slot="drawer-header"]');
    expect(header).toHaveClass('custom-header-class');
  });

  it('should render DrawerFooter component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter>Footer Content</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerFooter', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    const footer = baseElement.querySelector('[data-slot="drawer-footer"]');
    expect(footer).toBeInTheDocument();
  });

  it('should apply default classes to DrawerFooter', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    const footer = baseElement.querySelector('[data-slot="drawer-footer"]');
    expect(footer).toHaveClass('mt-auto');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('flex-col');
    expect(footer).toHaveClass('gap-2');
    expect(footer).toHaveClass('p-4');
  });

  it('should merge custom className with default classes in DrawerFooter', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerFooter className="custom-footer-class">Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
    const footer = baseElement.querySelector('[data-slot="drawer-footer"]');
    expect(footer).toHaveClass('custom-footer-class');
  });

  it('should render DrawerTitle component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title Text</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerTitle', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const title = baseElement.querySelector('[data-slot="drawer-title"]');
    expect(title).toBeInTheDocument();
  });

  it('should apply default classes to DrawerTitle', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const title = baseElement.querySelector('[data-slot="drawer-title"]');
    expect(title).toHaveClass('text-foreground');
    expect(title).toHaveClass('font-semibold');
  });

  it('should merge custom className with default classes in DrawerTitle', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="custom-title-class">Title</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const title = baseElement.querySelector('[data-slot="drawer-title"]');
    expect(title).toHaveClass('custom-title-class');
  });

  it('should render DrawerDescription component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription>Description Text</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Description Text')).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerDescription', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const description = baseElement.querySelector('[data-slot="drawer-description"]');
    expect(description).toBeInTheDocument();
  });

  it('should apply default classes to DrawerDescription', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription>Description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const description = baseElement.querySelector('[data-slot="drawer-description"]');
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveClass('text-sm');
  });

  it('should merge custom className with default classes in DrawerDescription', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerDescription className="custom-description-class">Description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    const description = baseElement.querySelector('[data-slot="drawer-description"]');
    expect(description).toHaveClass('custom-description-class');
  });

  it('should render DrawerClose component', () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should have data-slot attribute on DrawerClose', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    );
    const close = baseElement.querySelector('[data-slot="drawer-close"]');
    expect(close).toBeInTheDocument();
  });

  it('should render DrawerPortal component', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const portal = baseElement.querySelector('[data-slot="drawer-portal"]');
    expect(portal).toBeInTheDocument();
  });

  it('should pass through additional props to Drawer', () => {
    const { baseElement } = render(
      <Drawer open data-testid="custom-drawer">
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const drawer = baseElement.querySelector('[data-slot="drawer"]');
    expect(drawer).toHaveAttribute('data-testid', 'custom-drawer');
  });

  it('should pass through additional props to DrawerTrigger', () => {
    render(
      <Drawer open>
        <DrawerTrigger data-testid="custom-trigger">Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    );
    const trigger = screen.getByTestId('custom-trigger');
    expect(trigger).toBeInTheDocument();
  });

  it('should pass through additional props to DrawerContent', () => {
    const { baseElement } = render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent data-testid="custom-content">Content</DrawerContent>
      </Drawer>
    );
    const content = baseElement.querySelector('[data-testid="custom-content"]');
    expect(content).toBeInTheDocument();
  });
});
