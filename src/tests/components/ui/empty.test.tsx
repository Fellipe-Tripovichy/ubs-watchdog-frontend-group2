import { render, screen } from '@testing-library/react';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';

describe('Empty', () => {
  it('should render', () => {
    render(<Empty>Empty content</Empty>);
    expect(screen.getByText('Empty content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(<Empty>Empty content</Empty>);
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Empty>Empty content</Empty>);
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<Empty>Empty content</Empty>);
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty).toHaveClass(
      'flex',
      'min-w-0',
      'flex-1',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-6',
      'rounded-lg',
      'border-dashed',
      'p-6',
      'text-center',
      'text-balance',
      'md:p-12',
      'border',
      'border-muted'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Empty className="custom-class">Empty content</Empty>);
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty).toHaveClass('custom-class');
    expect(empty).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty data-testid="custom-empty" id="empty-id">
        Empty content
      </Empty>
    );
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty).toHaveAttribute('data-testid', 'custom-empty');
    expect(empty).toHaveAttribute('id', 'empty-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <div>Child 1</div>
        <div>Child 2</div>
      </Empty>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should handle aria-label prop', () => {
    const { container } = render(<Empty aria-label="Empty state">Empty content</Empty>);
    const empty = container.querySelector('[data-slot="empty"]');
    expect(empty).toHaveAttribute('aria-label', 'Empty state');
  });
});

describe('EmptyHeader', () => {
  it('should render', () => {
    render(
      <Empty>
        <EmptyHeader>Header content</EmptyHeader>
      </Empty>
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>Header content</EmptyHeader>
      </Empty>
    );
    const header = container.querySelector('[data-slot="empty-header"]');
    expect(header?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>Header content</EmptyHeader>
      </Empty>
    );
    const header = container.querySelector('[data-slot="empty-header"]');
    expect(header).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>Header content</EmptyHeader>
      </Empty>
    );
    const header = container.querySelector('[data-slot="empty-header"]');
    expect(header).toHaveClass(
      'flex',
      'max-w-sm',
      'flex-col',
      'items-center',
      'gap-2',
      'text-center'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader className="custom-header-class">Header content</EmptyHeader>
      </Empty>
    );
    const header = container.querySelector('[data-slot="empty-header"]');
    expect(header).toHaveClass('custom-header-class');
    expect(header).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader data-testid="custom-header" id="header-id">
          Header content
        </EmptyHeader>
      </Empty>
    );
    const header = container.querySelector('[data-slot="empty-header"]');
    expect(header).toHaveAttribute('data-testid', 'custom-header');
    expect(header).toHaveAttribute('id', 'header-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <EmptyHeader>
          <div>Title</div>
          <div>Description</div>
        </EmptyHeader>
      </Empty>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});

describe('EmptyMedia', () => {
  it('should render', () => {
    render(
      <Empty>
        <EmptyMedia>Media content</EmptyMedia>
      </Empty>
    );
    expect(screen.getByText('Media content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia>Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia>Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toBeInTheDocument();
  });

  it('should have data-variant attribute with default value', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia>Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveAttribute('data-variant', 'default');
  });

  it('should apply default variant classes', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia variant="default">Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveClass('bg-transparent');
    expect(media).toHaveClass('flex', 'shrink-0', 'items-center', 'justify-center', 'mb-2');
  });

  it('should apply icon variant classes', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia variant="icon">Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveClass(
      'bg-muted',
      'text-foreground',
      'flex',
      'size-10',
      'shrink-0',
      'items-center',
      'justify-center',
      'rounded-lg'
    );
  });

  it('should have data-variant attribute when icon variant is set', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia variant="icon">Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveAttribute('data-variant', 'icon');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia className="custom-media-class">Media content</EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveClass('custom-media-class');
    expect(media).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty>
        <EmptyMedia data-testid="custom-media" id="media-id">
          Media content
        </EmptyMedia>
      </Empty>
    );
    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveAttribute('data-testid', 'custom-media');
    expect(media).toHaveAttribute('id', 'media-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <EmptyMedia>
          <div>Icon</div>
          <div>Media</div>
        </EmptyMedia>
      </Empty>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });
});

describe('EmptyTitle', () => {
  it('should render', () => {
    render(
      <Empty>
        <EmptyTitle>Title content</EmptyTitle>
      </Empty>
    );
    expect(screen.getByText('Title content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>Title content</EmptyTitle>
      </Empty>
    );
    const title = container.querySelector('[data-slot="empty-title"]');
    expect(title?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>Title content</EmptyTitle>
      </Empty>
    );
    const title = container.querySelector('[data-slot="empty-title"]');
    expect(title).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle>Title content</EmptyTitle>
      </Empty>
    );
    const title = container.querySelector('[data-slot="empty-title"]');
    expect(title).toHaveClass('text-h3', 'font-medium', 'tracking-tight');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle className="custom-title-class">Title content</EmptyTitle>
      </Empty>
    );
    const title = container.querySelector('[data-slot="empty-title"]');
    expect(title).toHaveClass('custom-title-class');
    expect(title).toHaveClass('text-h3');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty>
        <EmptyTitle data-testid="custom-title" id="title-id">
          Title content
        </EmptyTitle>
      </Empty>
    );
    const title = container.querySelector('[data-slot="empty-title"]');
    expect(title).toHaveAttribute('data-testid', 'custom-title');
    expect(title).toHaveAttribute('id', 'title-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <EmptyTitle>
          <span>Part 1</span>
          <span>Part 2</span>
        </EmptyTitle>
      </Empty>
    );
    expect(screen.getByText('Part 1')).toBeInTheDocument();
    expect(screen.getByText('Part 2')).toBeInTheDocument();
  });
});

describe('EmptyDescription', () => {
  it('should render', () => {
    render(
      <Empty>
        <EmptyDescription>Description content</EmptyDescription>
      </Empty>
    );
    expect(screen.getByText('Description content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>Description content</EmptyDescription>
      </Empty>
    );
    const description = container.querySelector('[data-slot="empty-description"]');
    expect(description?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>Description content</EmptyDescription>
      </Empty>
    );
    const description = container.querySelector('[data-slot="empty-description"]');
    expect(description).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription>Description content</EmptyDescription>
      </Empty>
    );
    const description = container.querySelector('[data-slot="empty-description"]');
    expect(description).toHaveClass(
      'text-caption',
      '[&>a:hover]:text-primary',
      '[&>a]:underline',
      '[&>a]:underline-offset-4'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription className="custom-description-class">
          Description content
        </EmptyDescription>
      </Empty>
    );
    const description = container.querySelector('[data-slot="empty-description"]');
    expect(description).toHaveClass('custom-description-class');
    expect(description).toHaveClass('text-caption');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty>
        <EmptyDescription data-testid="custom-description" id="description-id">
          Description content
        </EmptyDescription>
      </Empty>
    );
    const description = container.querySelector('[data-slot="empty-description"]');
    expect(description).toHaveAttribute('data-testid', 'custom-description');
    expect(description).toHaveAttribute('id', 'description-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <EmptyDescription>
          <span>Description part 1</span>
          <span>Description part 2</span>
        </EmptyDescription>
      </Empty>
    );
    expect(screen.getByText('Description part 1')).toBeInTheDocument();
    expect(screen.getByText('Description part 2')).toBeInTheDocument();
  });
});

describe('EmptyContent', () => {
  it('should render', () => {
    render(
      <Empty>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    const { container } = render(
      <Empty>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    );
    const content = container.querySelector('[data-slot="empty-content"]');
    expect(content?.tagName).toBe('DIV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Empty>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    );
    const content = container.querySelector('[data-slot="empty-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    );
    const content = container.querySelector('[data-slot="empty-content"]');
    expect(content).toHaveClass(
      'flex',
      'w-full',
      'max-w-sm',
      'min-w-0',
      'flex-col',
      'items-center',
      'gap-4',
      'text-caption',
      'text-balance'
    );
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Empty>
        <EmptyContent className="custom-content-class">Content</EmptyContent>
      </Empty>
    );
    const content = container.querySelector('[data-slot="empty-content"]');
    expect(content).toHaveClass('custom-content-class');
    expect(content).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Empty>
        <EmptyContent data-testid="custom-content" id="content-id">
          Content
        </EmptyContent>
      </Empty>
    );
    const content = container.querySelector('[data-slot="empty-content"]');
    expect(content).toHaveAttribute('data-testid', 'custom-content');
    expect(content).toHaveAttribute('id', 'content-id');
  });

  it('should render children correctly', () => {
    render(
      <Empty>
        <EmptyContent>
          <div>Content 1</div>
          <div>Content 2</div>
        </EmptyContent>
      </Empty>
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

describe('Empty integration', () => {
  it('should render complete empty structure', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div>Icon</div>
          </EmptyMedia>
          <EmptyTitle>Empty Title</EmptyTitle>
          <EmptyDescription>Empty Description</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Empty Content</EmptyContent>
      </Empty>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Empty Description')).toBeInTheDocument();
    expect(screen.getByText('Empty Content')).toBeInTheDocument();
  });

  it('should render empty with all data-slot attributes', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div>Icon</div>
          </EmptyMedia>
          <EmptyTitle>Title</EmptyTitle>
          <EmptyDescription>Description</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    );

    expect(container.querySelector('[data-slot="empty"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="empty-content"]')).toBeInTheDocument();
  });

  it('should render empty with default media variant', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <div>Icon</div>
          </EmptyMedia>
          <EmptyTitle>Title</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );

    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveAttribute('data-variant', 'default');
  });

  it('should render empty with icon media variant', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <div>Icon</div>
          </EmptyMedia>
          <EmptyTitle>Title</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );

    const media = container.querySelector('[data-slot="empty-icon"]');
    expect(media).toHaveAttribute('data-variant', 'icon');
    expect(media).toHaveClass('bg-muted', 'size-10', 'rounded-lg');
  });
});
