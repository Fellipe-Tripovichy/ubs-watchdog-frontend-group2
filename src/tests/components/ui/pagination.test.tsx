import { render, screen } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

describe('Pagination', () => {
  it('should render', () => {
    render(<Pagination>Pagination content</Pagination>);
    expect(screen.getByText('Pagination content')).toBeInTheDocument();
  });

  it('should render as a nav element', () => {
    const { container } = render(<Pagination>Pagination content</Pagination>);
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination?.tagName).toBe('NAV');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Pagination>Pagination content</Pagination>);
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toBeInTheDocument();
  });

  it('should have role="navigation" attribute', () => {
    const { container } = render(<Pagination>Pagination content</Pagination>);
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toHaveAttribute('role', 'navigation');
  });

  it('should have aria-label="pagination" attribute', () => {
    const { container } = render(<Pagination>Pagination content</Pagination>);
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toHaveAttribute('aria-label', 'pagination');
  });

  it('should apply default classes', () => {
    const { container } = render(<Pagination>Pagination content</Pagination>);
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toHaveClass('mx-auto', 'flex', 'w-full', 'justify-center');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination className="custom-class">Pagination content</Pagination>
    );
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toHaveClass('custom-class');
    expect(pagination).toHaveClass('mx-auto');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination data-testid="custom-pagination" id="pagination-id">
        Pagination content
      </Pagination>
    );
    const pagination = container.querySelector('[data-slot="pagination"]');
    expect(pagination).toHaveAttribute('data-testid', 'custom-pagination');
    expect(pagination).toHaveAttribute('id', 'pagination-id');
  });

  it('should render children correctly', () => {
    render(
      <Pagination>
        <div>Child 1</div>
        <div>Child 2</div>
      </Pagination>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

describe('PaginationContent', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>Content</PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render as a ul element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>Content</PaginationContent>
      </Pagination>
    );
    const content = container.querySelector('[data-slot="pagination-content"]');
    expect(content?.tagName).toBe('UL');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>Content</PaginationContent>
      </Pagination>
    );
    const content = container.querySelector('[data-slot="pagination-content"]');
    expect(content).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>Content</PaginationContent>
      </Pagination>
    );
    const content = container.querySelector('[data-slot="pagination-content"]');
    expect(content).toHaveClass('flex', 'flex-row', 'items-center', 'gap-1');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent className="custom-content-class">Content</PaginationContent>
      </Pagination>
    );
    const content = container.querySelector('[data-slot="pagination-content"]');
    expect(content).toHaveClass('custom-content-class');
    expect(content).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent data-testid="custom-content" id="content-id">
          Content
        </PaginationContent>
      </Pagination>
    );
    const content = container.querySelector('[data-slot="pagination-content"]');
    expect(content).toHaveAttribute('data-testid', 'custom-content');
    expect(content).toHaveAttribute('id', 'content-id');
  });

  it('should render children correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <li>Item 1</li>
          <li>Item 2</li>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});

describe('PaginationItem', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>Item</PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
  });

  it('should render as a li element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>Item</PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const item = container.querySelector('[data-slot="pagination-item"]');
    expect(item?.tagName).toBe('LI');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>Item</PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const item = container.querySelector('[data-slot="pagination-item"]');
    expect(item).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem data-testid="custom-item" id="item-id">
            Item
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const item = container.querySelector('[data-slot="pagination-item"]');
    expect(item).toHaveAttribute('data-testid', 'custom-item');
    expect(item).toHaveAttribute('id', 'item-id');
  });

  it('should render children correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <div>Child 1</div>
            <div>Child 2</div>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

describe('PaginationLink', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('should render as an a element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link?.tagName).toBe('A');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toBeInTheDocument();
  });

  it('should have data-active="false" when isActive is false', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive={false}>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveAttribute('data-active', 'false');
  });

  it('should have data-active="true" when isActive is true', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveAttribute('data-active', 'true');
  });

  it('should not have aria-current when isActive is false', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive={false}>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('should have aria-current="page" when isActive is true', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('should use default size when size is not provided', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toBeInTheDocument();
    // Link variant should be applied (not secondary)
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink className="custom-link-class">Link</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveClass('custom-link-class');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink data-testid="custom-link" id="link-id" href="/page">
              Link
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveAttribute('data-testid', 'custom-link');
    expect(link).toHaveAttribute('id', 'link-id');
    expect(link).toHaveAttribute('href', '/page');
  });

  it('should render children correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>
              <span>Child 1</span>
              <span>Child 2</span>
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});

describe('PaginationPrevious', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('should render as an a element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const previous = container.querySelector('[data-slot="pagination-link"]');
    expect(previous?.tagName).toBe('A');
  });

  it('should have aria-label="Go to previous page" attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const previous = container.querySelector('[data-slot="pagination-link"]');
    expect(previous).toHaveAttribute('aria-label', 'Go to previous page');
  });

  it('should render ChevronLeftIcon', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    // Check that there's at least one SVG (the ChevronLeftIcon)
    expect(svgs[0]).toBeInTheDocument();
  });

  it('should render "Previous" text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const previous = container.querySelector('[data-slot="pagination-link"]');
    expect(previous).toHaveClass('gap-1', 'px-2.5', 'sm:pl-2.5');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="custom-previous-class" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const previous = container.querySelector('[data-slot="pagination-link"]');
    expect(previous).toHaveClass('custom-previous-class');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious data-testid="custom-previous" id="previous-id" href="/prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const previous = container.querySelector('[data-slot="pagination-link"]');
    expect(previous).toHaveAttribute('data-testid', 'custom-previous');
    expect(previous).toHaveAttribute('id', 'previous-id');
    expect(previous).toHaveAttribute('href', '/prev');
  });
});

describe('PaginationNext', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should render as an a element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const next = container.querySelector('[data-slot="pagination-link"]');
    expect(next?.tagName).toBe('A');
  });

  it('should have aria-label="Go to next page" attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const next = container.querySelector('[data-slot="pagination-link"]');
    expect(next).toHaveAttribute('aria-label', 'Go to next page');
  });

  it('should render ChevronRightIcon', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    // Check that there's at least one SVG (the ChevronRightIcon)
    expect(svgs[0]).toBeInTheDocument();
  });

  it('should render "Next" text', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const next = container.querySelector('[data-slot="pagination-link"]');
    expect(next).toHaveClass('gap-1', 'px-2.5', 'sm:pr-2.5');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext className="custom-next-class" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const next = container.querySelector('[data-slot="pagination-link"]');
    expect(next).toHaveClass('custom-next-class');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext data-testid="custom-next" id="next-id" href="/next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const next = container.querySelector('[data-slot="pagination-link"]');
    expect(next).toHaveAttribute('data-testid', 'custom-next');
    expect(next).toHaveAttribute('id', 'next-id');
    expect(next).toHaveAttribute('href', '/next');
  });
});

describe('PaginationEllipsis', () => {
  it('should render', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    // Ellipsis should render (check for sr-only text)
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('should render as a span element', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis?.tagName).toBe('SPAN');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toBeInTheDocument();
  });

  it('should have aria-hidden="true" attribute', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render MoreHorizontalIcon', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render "More pages" text with sr-only class', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const srOnlyText = screen.getByText('More pages');
    expect(srOnlyText).toBeInTheDocument();
    expect(srOnlyText).toHaveClass('sr-only');
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toHaveClass('flex', 'size-9', 'items-center', 'justify-center');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis className="custom-ellipsis-class" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toHaveClass('custom-ellipsis-class');
    expect(ellipsis).toHaveClass('flex');
  });

  it('should pass through additional props', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis data-testid="custom-ellipsis" id="ellipsis-id" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toHaveAttribute('data-testid', 'custom-ellipsis');
    expect(ellipsis).toHaveAttribute('id', 'ellipsis-id');
  });
});

describe('Pagination integration', () => {
  it('should render complete pagination structure', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('More pages')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should render pagination with all data-slot attributes', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(container.querySelector('[data-slot="pagination"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="pagination-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="pagination-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="pagination-link"]')).toBeInTheDocument();
  });

  it('should render pagination with active link', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link = container.querySelector('[data-slot="pagination-link"]');
    expect(link).toHaveAttribute('data-active', 'true');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
