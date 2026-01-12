import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

// Mock cmdk
jest.mock('cmdk', () => {
  const React = require('react');
  
  // Create Command component with nested sub-components
  const CommandComponent = ({ className, children, ...props }: any) => (
    <div data-testid="command-root" className={className} {...props}>
      {children}
    </div>
  );
  
  // Attach sub-components as properties of Command
  CommandComponent.Input = ({ className, ...props }: any) => (
    <input
      data-testid="command-input"
      type="text"
      role="combobox"
      className={className}
      {...props}
    />
  );
  
  CommandComponent.List = ({ className, children, ...props }: any) => (
    <div data-testid="command-list" className={className} {...props}>
      {children}
    </div>
  );
  
  CommandComponent.Empty = ({ className, children, ...props }: any) => (
    <div data-testid="command-empty" className={className} {...props}>
      {children}
    </div>
  );
  
  CommandComponent.Group = ({ className, children, ...props }: any) => (
    <div data-testid="command-group" className={className} {...props}>
      {children}
    </div>
  );
  
  CommandComponent.Item = ({ className, children, ...props }: any) => (
    <div
      data-testid="command-item"
      role="option"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
  
  return {
    Command: CommandComponent,
  };
});

describe('Command', () => {
  it('should render', () => {
    render(<Command>Command content</Command>);
    const command = screen.getByTestId('command-root');
    expect(command).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<Command>Content</Command>);
    const command = container.querySelector('[data-testid="command-root"]');
    expect(command).toHaveClass(
      'flex',
      'h-full',
      'w-full',
      'flex-col',
      'overflow-hidden',
      'rounded-md',
      'bg-popover',
      'text-popover-foreground'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Command className="custom-class">Content</Command>);
    const command = container.querySelector('[data-testid="command-root"]');
    expect(command).toHaveClass('custom-class');
    expect(command).toHaveClass('flex', 'h-full', 'w-full');
  });

  it('should render children', () => {
    render(<Command>Test Content</Command>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    const { container } = render(<Command data-testid="custom-command">Content</Command>);
    const command = container.querySelector('[data-testid="custom-command"]');
    expect(command).toBeInTheDocument();
  });
});

describe('CommandInput', () => {
  it('should render', () => {
    render(
      <Command>
        <CommandInput />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input).toBeInTheDocument();
  });

  it('should render as an input element', () => {
    render(
      <Command>
        <CommandInput />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input.tagName).toBe('INPUT');
  });

  it('should have role="combobox"', () => {
    render(
      <Command>
        <CommandInput />
      </Command>
    );
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(
      <Command>
        <CommandInput />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input).toHaveClass(
      'flex',
      'h-11',
      'w-full',
      'rounded-md',
      'bg-transparent',
      'py-3',
      'text-sm',
      'outline-none',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    );
  });

  it('should merge custom className with default classes', () => {
    render(
      <Command>
        <CommandInput className="custom-input-class" />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input).toHaveClass('custom-input-class');
    expect(input).toHaveClass('flex', 'h-11', 'w-full');
  });

  it('should render inside a wrapper div with correct classes', () => {
    const { container } = render(
      <Command>
        <CommandInput />
      </Command>
    );
    const wrapper = container.querySelector('.flex.items-center.border-b.border-border.px-3');
    expect(wrapper).toBeInTheDocument();
    const input = wrapper?.querySelector('[data-testid="command-input"]');
    expect(input).toBeInTheDocument();
  });

  it('should handle placeholder', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>
    );
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('should handle value prop', () => {
    render(
      <Command>
        <CommandInput value="test value" onChange={() => {}} />
      </Command>
    );
    const input = screen.getByTestId('command-input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should handle onChange event', () => {
    const handleChange = jest.fn();
    render(
      <Command>
        <CommandInput onChange={handleChange} />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should pass through additional props', () => {
    render(
      <Command>
        <CommandInput data-custom="test" />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input).toHaveAttribute('data-custom', 'test');
  });
});

describe('CommandList', () => {
  it('should render', () => {
    render(
      <Command>
        <CommandList>List content</CommandList>
      </Command>
    );
    const list = screen.getByTestId('command-list');
    expect(list).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(
      <Command>
        <CommandList />
      </Command>
    );
    const list = screen.getByTestId('command-list');
    expect(list).toHaveClass('max-h-[240px]', 'overflow-y-auto', 'overflow-x-hidden');
  });

  it('should merge custom className with default classes', () => {
    render(
      <Command>
        <CommandList className="custom-list-class" />
      </Command>
    );
    const list = screen.getByTestId('command-list');
    expect(list).toHaveClass('custom-list-class');
    expect(list).toHaveClass('max-h-[240px]', 'overflow-y-auto');
  });

  it('should render children', () => {
    render(
      <Command>
        <CommandList>List Items</CommandList>
      </Command>
    );
    expect(screen.getByText('List Items')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    render(
      <Command>
        <CommandList data-testid="custom-list" />
      </Command>
    );
    const list = screen.getByTestId('custom-list');
    expect(list).toBeInTheDocument();
  });
});

describe('CommandEmpty', () => {
  it('should render', () => {
    render(
      <Command>
        <CommandEmpty>No results found</CommandEmpty>
      </Command>
    );
    const empty = screen.getByTestId('command-empty');
    expect(empty).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(
      <Command>
        <CommandEmpty />
      </Command>
    );
    const empty = screen.getByTestId('command-empty');
    expect(empty).toHaveClass(
      'py-6',
      'text-center',
      'text-sm',
      'text-muted-foreground'
    );
  });

  it('should render children', () => {
    render(
      <Command>
        <CommandEmpty>Empty state message</CommandEmpty>
      </Command>
    );
    expect(screen.getByText('Empty state message')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    render(
      <Command>
        <CommandEmpty className="custom-empty-class" />
      </Command>
    );
    const empty = screen.getByTestId('command-empty');
    expect(empty).toHaveClass('custom-empty-class');
  });
});

describe('CommandGroup', () => {
  it('should render', () => {
    render(
      <Command>
        <CommandGroup>Group content</CommandGroup>
      </Command>
    );
    const group = screen.getByTestId('command-group');
    expect(group).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(
      <Command>
        <CommandGroup />
      </Command>
    );
    const group = screen.getByTestId('command-group');
    expect(group).toHaveClass('overflow-hidden', 'p-1', 'text-foreground');
  });

  it('should merge custom className with default classes', () => {
    render(
      <Command>
        <CommandGroup className="custom-group-class" />
      </Command>
    );
    const group = screen.getByTestId('command-group');
    expect(group).toHaveClass('custom-group-class');
    expect(group).toHaveClass('overflow-hidden', 'p-1');
  });

  it('should render children', () => {
    render(
      <Command>
        <CommandGroup>Group Items</CommandGroup>
      </Command>
    );
    expect(screen.getByText('Group Items')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    render(
      <Command>
        <CommandGroup data-label="test-group" />
      </Command>
    );
    const group = screen.getByTestId('command-group');
    expect(group).toHaveAttribute('data-label', 'test-group');
  });
});

describe('CommandItem', () => {
  it('should render', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item content</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toBeInTheDocument();
  });

  it('should have role="option"', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByRole('option');
    expect(item).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem />
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toHaveClass(
      'relative',
      'flex',
      'cursor-pointer',
      'select-none',
      'items-center',
      'rounded-sm',
      'px-2',
      'py-2',
      'text-sm',
      'outline-none',
      'aria-selected:bg-accent',
      'aria-selected:text-accent-foreground',
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-50'
    );
  });

  it('should merge custom className with default classes', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem className="custom-item-class" />
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toHaveClass('custom-item-class');
    expect(item).toHaveClass('relative', 'flex', 'cursor-pointer');
  });

  it('should render children', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item Text</CommandItem>
        </CommandList>
      </Command>
    );
    expect(screen.getByText('Item Text')).toBeInTheDocument();
  });

  it('should handle onClick event', () => {
    const handleClick = jest.fn();
    render(
      <Command>
        <CommandList>
          <CommandItem onClick={handleClick}>Clickable Item</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle aria-selected attribute', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem aria-selected="true">Selected Item</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('should handle data-disabled attribute', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem data-disabled="true">Disabled Item</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toHaveAttribute('data-disabled', 'true');
  });

  it('should pass through additional props', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem data-value="test-value">Item</CommandItem>
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toHaveAttribute('data-value', 'test-value');
  });
});

describe('Command Integration', () => {
  it('should render complete command structure', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByTestId('command-list')).toBeInTheDocument();
    expect(screen.getByTestId('command-empty')).toBeInTheDocument();
    expect(screen.getByTestId('command-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('command-item')).toHaveLength(2);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should handle multiple groups', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Group 1 Item</CommandItem>
          </CommandGroup>
          <CommandGroup>
            <CommandItem>Group 2 Item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const groups = screen.getAllByTestId('command-group');
    expect(groups).toHaveLength(2);
    expect(screen.getByText('Group 1 Item')).toBeInTheDocument();
    expect(screen.getByText('Group 2 Item')).toBeInTheDocument();
  });

  it('should handle multiple items', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
            <CommandItem>Item 3</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const items = screen.getAllByTestId('command-item');
    expect(items).toHaveLength(3);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});

describe('Edge Cases', () => {
  it('should handle undefined className', () => {
    const { container } = render(<Command className={undefined}>Content</Command>);
    const command = container.querySelector('[data-testid="command-root"]');
    expect(command).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    render(<Command />);
    const command = screen.getByTestId('command-root');
    expect(command).toBeInTheDocument();
  });

  it('should handle CommandInput without placeholder', () => {
    render(
      <Command>
        <CommandInput />
      </Command>
    );
    const input = screen.getByTestId('command-input');
    expect(input).toBeInTheDocument();
  });

  it('should handle CommandEmpty without children', () => {
    render(
      <Command>
        <CommandEmpty />
      </Command>
    );
    const empty = screen.getByTestId('command-empty');
    expect(empty).toBeInTheDocument();
  });

  it('should handle CommandGroup without children', () => {
    render(
      <Command>
        <CommandGroup />
      </Command>
    );
    const group = screen.getByTestId('command-group');
    expect(group).toBeInTheDocument();
  });

  it('should handle CommandItem without children', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem />
        </CommandList>
      </Command>
    );
    const item = screen.getByTestId('command-item');
    expect(item).toBeInTheDocument();
  });
});
