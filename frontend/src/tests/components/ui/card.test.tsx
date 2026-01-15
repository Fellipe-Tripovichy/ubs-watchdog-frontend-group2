import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card', () => {
  it('should render', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'flex',
      'flex-col',
      'gap-6',
      'rounded-xl',
      'border',
      'border-muted',
      'py-6',
      'shadow-sm'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Card className="custom-class">Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-card');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card data-testid="custom-card" id="card-id">
        Card content
      </Card>
    );
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveAttribute('data-testid', 'custom-card');
    expect(card).toHaveAttribute('id', 'card-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should handle aria-label prop', () => {
    const { container } = render(<Card aria-label="Card container">Card content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toHaveAttribute('aria-label', 'Card container');
  });
});

describe('CardHeader', () => {
  it('should render', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveClass(
      '@container/card-header',
      'grid',
      'auto-rows-min',
      'grid-rows-[auto_auto]',
      'items-start',
      'gap-2',
      'px-6',
      'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
      '[.border-b]:pb-6'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardHeader className="custom-header-class">Header content</CardHeader>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveClass('custom-header-class');
    expect(header).toHaveClass('@container/card-header');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardHeader data-testid="custom-header" id="header-id">
          Header content
        </CardHeader>
      </Card>
    );
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveAttribute('data-testid', 'custom-header');
    expect(header).toHaveAttribute('id', 'header-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardHeader>
          <div>Title</div>
          <div>Description</div>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('should render', () => {
    render(
      <Card>
        <CardTitle>Title content</CardTitle>
      </Card>
    );
    expect(screen.getByText('Title content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardTitle>Title content</CardTitle>
      </Card>
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardTitle>Title content</CardTitle>
      </Card>
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardTitle>Title content</CardTitle>
      </Card>
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toHaveClass('leading-none', 'font-semibold');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardTitle className="custom-title-class">Title content</CardTitle>
      </Card>
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toHaveClass('custom-title-class');
    expect(title).toHaveClass('font-semibold');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardTitle data-testid="custom-title" id="title-id">
          Title content
        </CardTitle>
      </Card>
    );
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toHaveAttribute('data-testid', 'custom-title');
    expect(title).toHaveAttribute('id', 'title-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardTitle>
          <span>Part 1</span>
          <span>Part 2</span>
        </CardTitle>
      </Card>
    );
    expect(screen.getByText('Part 1')).toBeInTheDocument();
    expect(screen.getByText('Part 2')).toBeInTheDocument();
  });
});

describe('CardDescription', () => {
  it('should render', () => {
    render(
      <Card>
        <CardDescription>Description content</CardDescription>
      </Card>
    );
    expect(screen.getByText('Description content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardDescription>Description content</CardDescription>
      </Card>
    );
    const description = container.querySelector('[data-slot="card-description"]');
    expect(description?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardDescription>Description content</CardDescription>
      </Card>
    );
    const description = container.querySelector('[data-slot="card-description"]');
    expect(description).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardDescription>Description content</CardDescription>
      </Card>
    );
    const description = container.querySelector('[data-slot="card-description"]');
    expect(description).toHaveClass('text-muted-foreground', 'text-sm');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardDescription className="custom-description-class">
          Description content
        </CardDescription>
      </Card>
    );
    const description = container.querySelector('[data-slot="card-description"]');
    expect(description).toHaveClass('custom-description-class');
    expect(description).toHaveClass('text-sm');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardDescription data-testid="custom-description" id="description-id">
          Description content
        </CardDescription>
      </Card>
    );
    const description = container.querySelector('[data-slot="card-description"]');
    expect(description).toHaveAttribute('data-testid', 'custom-description');
    expect(description).toHaveAttribute('id', 'description-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardDescription>
          <span>Description part 1</span>
          <span>Description part 2</span>
        </CardDescription>
      </Card>
    );
    expect(screen.getByText('Description part 1')).toBeInTheDocument();
    expect(screen.getByText('Description part 2')).toBeInTheDocument();
  });
});

describe('CardAction', () => {
  it('should render', () => {
    render(
      <Card>
        <CardAction>Action content</CardAction>
      </Card>
    );
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardAction>Action content</CardAction>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardAction>Action content</CardAction>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardAction>Action content</CardAction>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toHaveClass(
      'col-start-2',
      'row-span-2',
      'row-start-1',
      'self-start',
      'justify-self-end'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardAction className="custom-action-class">Action content</CardAction>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toHaveClass('custom-action-class');
    expect(action).toHaveClass('col-start-2');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardAction data-testid="custom-action" id="action-id">
          Action content
        </CardAction>
      </Card>
    );
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toHaveAttribute('data-testid', 'custom-action');
    expect(action).toHaveAttribute('id', 'action-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardAction>
          <button>Button 1</button>
          <button>Button 2</button>
        </CardAction>
      </Card>
    );
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('should render', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toHaveClass('px-6');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardContent className="custom-content-class">Content</CardContent>
      </Card>
    );
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toHaveClass('custom-content-class');
    expect(content).toHaveClass('px-6');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardContent data-testid="custom-content" id="content-id">
          Content
        </CardContent>
      </Card>
    );
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toHaveAttribute('data-testid', 'custom-content');
    expect(content).toHaveAttribute('id', 'content-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardContent>
          <div>Content 1</div>
          <div>Content 2</div>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('should render', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toHaveClass('flex', 'items-center', 'px-6', '[.border-t]:pt-6');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Card>
        <CardFooter className="custom-footer-class">Footer content</CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toHaveClass('custom-footer-class');
    expect(footer).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Card>
        <CardFooter data-testid="custom-footer" id="footer-id">
          Footer content
        </CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toHaveAttribute('data-testid', 'custom-footer');
    expect(footer).toHaveAttribute('id', 'footer-id');
  });

  it('should render children correctly', () => {
    render(
      <Card>
        <CardFooter>
          <div>Footer 1</div>
          <div>Footer 2</div>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer 1')).toBeInTheDocument();
    expect(screen.getByText('Footer 2')).toBeInTheDocument();
  });
});

describe('Card integration', () => {
  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('should render card with all data-slot attributes', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument();
  });
});
