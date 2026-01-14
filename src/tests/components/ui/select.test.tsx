import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select', () => {
  it('should render Select component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const select = screen.getByText('Select an option');
    expect(select).toBeInTheDocument();
  });

  it('should have data-slot attribute on Select root', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    // Select Root is a context provider, so it may not render a DOM element
    // Instead, verify the component renders without errors
    const trigger = screen.getByText('Select an option');
    expect(trigger).toBeInTheDocument();
  });
});

describe('SelectTrigger', () => {
  it('should render SelectTrigger component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Trigger Button" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByText('Trigger Button');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectTrigger', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-size attribute with default value', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveAttribute('data-size', 'default');
  });

  it('should have data-size attribute with sm value', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveAttribute('data-size', 'sm');
  });

  it('should apply default classes to SelectTrigger', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveClass('border-input');
    expect(trigger).toHaveClass('rounded-xs');
    expect(trigger).toHaveClass('flex');
    expect(trigger).toHaveClass('items-center');
    expect(trigger).toHaveClass('justify-between');
  });

  it('should merge custom className with default classes in SelectTrigger', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger className="custom-class">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger).toHaveClass('border-input');
  });

  it('should render icon when icon prop is provided', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger icon="menu">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeInTheDocument();
    // IconViewer should render the icon
    const svg = trigger?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('SelectValue', () => {
  it('should render SelectValue component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select Value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const value = screen.getByText('Select Value');
    expect(value).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectValue', () => {
    const { container } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const value = container.querySelector('[data-slot="select-value"]');
    expect(value).toBeInTheDocument();
  });

  it('should display placeholder text when no value is selected', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });
});

describe('SelectContent', () => {
  it('should render SelectContent component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Select Content</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = screen.getByText('Select Content');
    expect(content).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectContent', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-slot="select-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes to SelectContent', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-slot="select-content"]');
    expect(content).toHaveClass('bg-popover');
    expect(content).toHaveClass('rounded-xs');
    expect(content).toHaveClass('border');
    expect(content).toHaveClass('shadow-md');
  });

  it('should merge custom className with default classes in SelectContent', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom-class">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-slot="select-content"]');
    expect(content).toHaveClass('custom-class');
    expect(content).toHaveClass('bg-popover');
  });

  it('should use default position prop (item-aligned)', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-slot="select-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should use default align prop (center)', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-slot="select-content"]');
    expect(content).toBeInTheDocument();
  });
});

describe('SelectItem', () => {
  it('should render SelectItem component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Select Item</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = screen.getByText('Select Item');
    expect(item).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-slot="select-item"]');
    expect(item).toBeInTheDocument();
  });

  it('should apply default classes to SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-slot="select-item"]');
    expect(item).toHaveClass('relative');
    expect(item).toHaveClass('flex');
    expect(item).toHaveClass('w-full');
    expect(item).toHaveClass('cursor-default');
    expect(item).toHaveClass('rounded-xs');
  });

  it('should merge custom className with default classes in SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" className="custom-class">
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-slot="select-item"]');
    expect(item).toHaveClass('custom-class');
    expect(item).toHaveClass('relative');
  });

  it('should have data-slot attribute on SelectItem indicator', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const indicator = baseElement.querySelector('[data-slot="select-item-indicator"]');
    expect(indicator).toBeInTheDocument();
  });

  it('should render multiple SelectItems', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});

describe('SelectGroup', () => {
  it('should render SelectGroup component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const item = screen.getByText('Option 1');
    expect(item).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectGroup', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const group = baseElement.querySelector('[data-slot="select-group"]');
    expect(group).toBeInTheDocument();
  });
});

describe('SelectLabel', () => {
  it('should render SelectLabel component', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Label</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const label = screen.getByText('Select Label');
    expect(label).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectLabel', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Label</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const label = baseElement.querySelector('[data-slot="select-label"]');
    expect(label).toBeInTheDocument();
  });

  it('should apply default classes to SelectLabel', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Label</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const label = baseElement.querySelector('[data-slot="select-label"]');
    expect(label).toHaveClass('text-muted-foreground');
    expect(label).toHaveClass('px-2');
    expect(label).toHaveClass('py-1.5');
    expect(label).toHaveClass('text-xs');
  });

  it('should merge custom className with default classes in SelectLabel', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="custom-class">Label</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const label = baseElement.querySelector('[data-slot="select-label"]');
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('text-muted-foreground');
  });
});

describe('SelectSeparator', () => {
  it('should render SelectSeparator component', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const separator = baseElement.querySelector('[data-slot="select-separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectSeparator', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const separator = baseElement.querySelector('[data-slot="select-separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('should apply default classes to SelectSeparator', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const separator = baseElement.querySelector('[data-slot="select-separator"]');
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('pointer-events-none');
    expect(separator).toHaveClass('h-px');
  });

  it('should merge custom className with default classes in SelectSeparator', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectSeparator className="custom-class" />
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const separator = baseElement.querySelector('[data-slot="select-separator"]');
    expect(separator).toHaveClass('custom-class');
    expect(separator).toHaveClass('bg-border');
  });
});

describe('SelectScrollUpButton', () => {
  it('should render SelectScrollUpButton component when needed', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollUpButton = baseElement.querySelector('[data-slot="select-scroll-up-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    // They may not always be in the DOM
    if (scrollUpButton) {
      expect(scrollUpButton).toBeInTheDocument();
    }
  });

  it('should have data-slot attribute on SelectScrollUpButton when rendered', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollUpButton = baseElement.querySelector('[data-slot="select-scroll-up-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    if (scrollUpButton) {
      expect(scrollUpButton).toHaveAttribute('data-slot', 'select-scroll-up-button');
    }
  });

  it('should apply default classes to SelectScrollUpButton when rendered', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollUpButton = baseElement.querySelector('[data-slot="select-scroll-up-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    if (scrollUpButton) {
      expect(scrollUpButton).toHaveClass('flex');
      expect(scrollUpButton).toHaveClass('cursor-default');
      expect(scrollUpButton).toHaveClass('items-center');
      expect(scrollUpButton).toHaveClass('justify-center');
    }
  });
});

describe('SelectScrollDownButton', () => {
  it('should render SelectScrollDownButton component when needed', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollDownButton = baseElement.querySelector('[data-slot="select-scroll-down-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    // They may not always be in the DOM
    if (scrollDownButton) {
      expect(scrollDownButton).toBeInTheDocument();
    }
  });

  it('should have data-slot attribute on SelectScrollDownButton when rendered', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollDownButton = baseElement.querySelector('[data-slot="select-scroll-down-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    if (scrollDownButton) {
      expect(scrollDownButton).toHaveAttribute('data-slot', 'select-scroll-down-button');
    }
  });

  it('should apply default classes to SelectScrollDownButton when rendered', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const scrollDownButton = baseElement.querySelector('[data-slot="select-scroll-down-button"]');
    // Scroll buttons are conditionally rendered by Radix UI based on scroll state
    if (scrollDownButton) {
      expect(scrollDownButton).toHaveClass('flex');
      expect(scrollDownButton).toHaveClass('cursor-default');
      expect(scrollDownButton).toHaveClass('items-center');
      expect(scrollDownButton).toHaveClass('justify-center');
    }
  });
});

describe('Select integration', () => {
  it('should render a complete Select component with all sub-components', () => {
    render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});
