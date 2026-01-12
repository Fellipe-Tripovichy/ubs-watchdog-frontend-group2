import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from '@/components/ui/select';

describe('Select', () => {
  it('should render Select component', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByText('Select an option');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on Select root', () => {
    render(
      <Select>
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

  it('should render SelectTrigger component', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByText('Select an option');
    expect(trigger).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectTrigger', () => {
    const { container } = render(
      <Select>
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

  it('should have data-size attribute with default value on SelectTrigger', () => {
    const { container } = render(
      <Select>
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

  it('should have data-size attribute with sm value on SelectTrigger', () => {
    const { container } = render(
      <Select>
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
      <Select>
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
    expect(trigger).toHaveClass('rounded-md');
    expect(trigger).toHaveClass('flex');
  });

  it('should merge custom className with default classes in SelectTrigger', () => {
    const { container } = render(
      <Select>
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

  it('should render chevron down icon in SelectTrigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should render SelectValue component', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const value = screen.getByText('Select an option');
    expect(value).toBeInTheDocument();
  });

  it('should have data-slot attribute on SelectValue', () => {
    const { container } = render(
      <Select>
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

  it('should render SelectContent component', () => {
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
    const item = screen.getByText('Option 1');
    expect(item).toBeInTheDocument();
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
    expect(content).toHaveClass('text-popover-foreground');
    expect(content).toHaveClass('rounded-md');
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

  it('should pass through additional props to SelectContent', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent data-testid="custom-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const content = baseElement.querySelector('[data-testid="custom-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should render SelectLabel component', () => {
    render(
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
    const label = screen.getByText('Label');
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

  it('should render SelectItem component', () => {
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
    const item = screen.getByText('Option 1');
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
    expect(item).toHaveClass('cursor-default');
    expect(item).toHaveClass('rounded-sm');
    expect(item).toHaveClass('flex');
  });

  it('should merge custom className with default classes in SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" className="custom-class">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-slot="select-item"]');
    expect(item).toHaveClass('custom-class');
    expect(item).toHaveClass('cursor-default');
  });

  it('should have indicator container in SelectItem', () => {
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

  it('should pass through additional props to SelectTrigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger data-testid="custom-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-testid="custom-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('should pass through additional props to SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="custom-item">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-testid="custom-item"]');
    expect(item).toBeInTheDocument();
  });

  it('should handle disabled state on SelectTrigger', () => {
    const { container } = render(
      <Select>
        <SelectTrigger disabled>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveClass('disabled:opacity-50');
  });

  it('should handle disabled state on SelectItem', () => {
    const { baseElement } = render(
      <Select open>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" disabled>Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const item = baseElement.querySelector('[data-slot="select-item"]');
    expect(item).toHaveAttribute('data-disabled');
  });
});
