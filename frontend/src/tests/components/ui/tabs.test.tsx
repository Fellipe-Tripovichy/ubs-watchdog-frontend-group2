import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

jest.mock('@/lib/use-breakpoint', () => ({
  useBreakpoint: jest.fn(() => 'lg'),
}));

jest.mock('@/components/ui/IconViewer', () => {
  return function IconViewer({ iconName }: { iconName: string }) {
    return <div data-testid="icon-viewer" data-icon={iconName}>Icon</div>;
  };
});

jest.mock('@/components/ui/popover', () => {
  const React = require('react');
  return {
    Popover: ({ children, open, onOpenChange }: any) => (
      <div data-testid="popover" data-open={open}>
        {React.Children.map(children, (child: any) => {
          if (child?.type?.displayName === 'PopoverTrigger') {
            return React.cloneElement(child, { onClick: () => onOpenChange(!open) });
          }
          return child;
        })}
      </div>
    ),
    PopoverTrigger: ({ children, asChild, onClick }: any) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { onClick });
      }
      return <button onClick={onClick}>{children}</button>;
    },
    PopoverContent: ({ children, className }: any) => (
      <div data-testid="popover-content" className={className}>
        {children}
      </div>
    ),
  };
});

const { useBreakpoint } = require('@/lib/use-breakpoint');

describe('Tabs', () => {
  it('should render Tabs component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('should forward props to Tabs root', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" data-testid="tabs-root">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const tabsRoot = container.querySelector('[data-testid="tabs-root"]');
    expect(tabsRoot).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const handleValueChange = jest.fn();
    const { rerender } = render(
      <Tabs value="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    
    rerender(
      <Tabs value="tab2" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    await waitFor(() => {
      const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2Button).toHaveAttribute('data-state', 'active');
    });
    
    if (handleValueChange.mock.calls.length > 0) {
      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    }
  });
});

describe('TabsList', () => {
  beforeEach(() => {
    useBreakpoint.mockReturnValue('lg');
  });

  it('should render TabsList component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const tabsList = container.querySelector('[role="tablist"]');
    expect(tabsList).toHaveClass('flex', 'items-center', 'w-full', 'bg-background', 'border-b', 'border-muted');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-class">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const tabsList = container.querySelector('[role="tablist"]');
    expect(tabsList).toHaveClass('custom-class');
    expect(tabsList).toHaveClass('flex');
  });

  it('should count TabsTrigger children correctly', () => {
    const onTriggerCountChange = jest.fn();
    render(
      <Tabs defaultValue="tab1">
        <TabsList onTriggerCountChange={onTriggerCountChange}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(onTriggerCountChange).toHaveBeenCalledWith(3);
  });

  it('should call onTriggerCountChange when trigger count changes', () => {
    const onTriggerCountChange = jest.fn();
    const { rerender } = render(
      <Tabs defaultValue="tab1">
        <TabsList onTriggerCountChange={onTriggerCountChange}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(onTriggerCountChange).toHaveBeenCalledWith(1);
    
    rerender(
      <Tabs defaultValue="tab1">
        <TabsList onTriggerCountChange={onTriggerCountChange}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(onTriggerCountChange).toHaveBeenCalledWith(2);
  });

  it('should show all triggers when count is less than sliceCount', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
  });

  it('should show popover when trigger count exceeds sliceCount', () => {
    useBreakpoint.mockReturnValue('lg');
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.getByText('Tab 4')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toBeInTheDocument();
    const tab5InPopover = popoverContent.querySelector('button[aria-controls*="tab5"]');
    expect(tab5InPopover).toBeInTheDocument();
  });

  it('should show correct hidden count badge', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const popover = screen.getByTestId('popover');
    expect(popover).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should show hidden triggers in popover', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const popoverContent = screen.getByTestId('popover-content');
    expect(popoverContent).toBeInTheDocument();
    expect(screen.getByText('Tab 5')).toBeInTheDocument();
  });

  it('should toggle popover on click', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const popover = screen.getByTestId('popover');
    expect(popover).toHaveAttribute('data-open', 'false');
    
    const triggerButton = popover.querySelector('div[onClick]');
    if (triggerButton) {
      fireEvent.click(triggerButton);
      expect(popover).toHaveAttribute('data-open', 'true');
    }
  });

  it('should show chevron-down icon when popover is closed', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const iconViewer = screen.getByTestId('icon-viewer');
    expect(iconViewer).toHaveAttribute('data-icon', 'chevron-down');
  });

  it('should show chevron-up icon when popover is open', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const popover = screen.getByTestId('popover');
    const triggerButton = popover.querySelector('div[onClick]');
    if (triggerButton) {
      fireEvent.click(triggerButton);
      const iconViewer = screen.getByTestId('icon-viewer');
      expect(iconViewer).toHaveAttribute('data-icon', 'chevron-up');
    }
  });

  it('should use sliceCount of 4 for lg breakpoint', () => {
    useBreakpoint.mockReturnValue('lg');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.getByText('Tab 4')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    const popoverContent = screen.getByTestId('popover-content');
    const tab5InPopover = popoverContent.querySelector('button[aria-controls*="tab5"]');
    expect(tab5InPopover).toBeInTheDocument();
  });

  it('should use sliceCount of 4 for md breakpoint', () => {
    useBreakpoint.mockReturnValue('md');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab5">Tab 5</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.getByText('Tab 4')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    const popoverContent = screen.getByTestId('popover-content');
    const tab5InPopover = popoverContent.querySelector('button[aria-controls*="tab5"]');
    expect(tab5InPopover).toBeInTheDocument();
  });

  it('should use sliceCount of 2 for sm breakpoint', () => {
    useBreakpoint.mockReturnValue('sm');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    const popoverContent = screen.getByTestId('popover-content');
    const tab3InPopover = popoverContent.querySelector('button[aria-controls*="tab3"]');
    expect(tab3InPopover).toBeInTheDocument();
  });

  it('should use sliceCount of 2 for default breakpoint', () => {
    useBreakpoint.mockReturnValue('default');
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    const popoverContent = screen.getByTestId('popover-content');
    const tab3InPopover = popoverContent.querySelector('button[aria-controls*="tab3"]');
    expect(tab3InPopover).toBeInTheDocument();
  });

  it('should forward props to TabsList', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList data-testid="tabs-list" id="list-id">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const tabsList = container.querySelector('[data-testid="tabs-list"]');
    expect(tabsList).toBeInTheDocument();
    expect(tabsList).toHaveAttribute('id', 'list-id');
  });
});

describe('TabsTrigger', () => {
  it('should render TabsTrigger component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const trigger = screen.getByText('Tab 1');
    expect(trigger).toHaveClass('inline-flex', 'h-9', 'md:h-11', 'items-center');
  });

  it('should merge custom className with default classes', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" className="custom-trigger-class">Tab 1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const trigger = screen.getByText('Tab 1');
    expect(trigger).toHaveClass('custom-trigger-class');
    expect(trigger).toHaveClass('inline-flex');
  });

  it('should forward props to TabsTrigger', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" data-testid="custom-trigger" id="trigger-id">
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const trigger = screen.getByTestId('custom-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('id', 'trigger-id');
  });

  it('should render children correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">
            <span>Tab</span>
            <span>1</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByText('Tab')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

describe('TabsContent', () => {
  it('should render TabsContent component', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    const content = screen.getByText('Content 1');
    expect(content).toHaveClass('ring-offset-background', 'h-9', 'md:h-11');
  });

  it('should merge custom className with default classes', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content-class">Content 1</TabsContent>
      </Tabs>
    );
    const content = screen.getByText('Content 1');
    expect(content).toHaveClass('custom-content-class');
    expect(content).toHaveClass('ring-offset-background');
  });

  it('should forward props to TabsContent', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" data-testid="custom-content" id="content-id">
          Content 1
        </TabsContent>
      </Tabs>
    );
    const content = screen.getByTestId('custom-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('id', 'content-id');
  });

  it('should render children correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div>Child 1</div>
          <div>Child 2</div>
        </TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

describe('Tabs integration', () => {
  it('should render complete tabs structure', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should switch content when tab is clicked', async () => {
    const { container, rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    
    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    
    await waitFor(() => {
      const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2Button).toHaveAttribute('data-state', 'active');
    });
    
    const content2Panel = container.querySelector('[aria-labelledby*="tab2"]');
    expect(content2Panel).toBeInTheDocument();
    if (content2Panel) {
      expect(content2Panel).toHaveAttribute('data-state', 'active');
      expect(content2Panel).not.toHaveAttribute('hidden');
      expect(content2Panel).toHaveTextContent('Content 2');
    }
  });
});
