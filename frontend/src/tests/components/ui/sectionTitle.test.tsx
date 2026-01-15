import { render, screen } from '@testing-library/react';
import { SectionTitle } from '@/components/ui/sectionTitle';

describe('SectionTitle', () => {
  it('should render', () => {
    render(<SectionTitle>Test Title</SectionTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(<SectionTitle>My Section Title</SectionTitle>);
    expect(screen.getByText('My Section Title')).toBeInTheDocument();
  });

  it('should render as h2 by default', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
  });

  it('should render with as prop set to h2', () => {
    const { container } = render(<SectionTitle as="h2">Test Title</SectionTitle>);
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
  });

  it('should apply default classes to wrapper div', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'mb-6');
  });

  it('should render paragraph element with children', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Test Title');
  });

  it('should apply default classes to paragraph element', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveClass('text-h2', 'font-regular', 'text-foreground');
  });

  it('should render underline div', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const underline = container.querySelector('div.h-1');
    expect(underline).toBeInTheDocument();
  });

  it('should apply default classes to underline div', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const underline = container.querySelector('div.h-1');
    expect(underline).toHaveClass('h-1', 'w-20', 'bg-primary', 'mt-3');
  });

  it('should merge custom className with default classes on heading', () => {
    const { container } = render(<SectionTitle className="custom-class">Test Title</SectionTitle>);
    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('custom-class');
  });

  it('should pass through additional props to heading', () => {
    const { container } = render(
      <SectionTitle data-testid="custom-heading" id="heading-id">
        Test Title
      </SectionTitle>
    );
    const heading = container.querySelector('h2');
    expect(heading).toHaveAttribute('data-testid', 'custom-heading');
    expect(heading).toHaveAttribute('id', 'heading-id');
  });

  it('should handle aria-label prop', () => {
    const { container } = render(
      <SectionTitle aria-label="Section heading">Test Title</SectionTitle>
    );
    const heading = container.querySelector('h2');
    expect(heading).toHaveAttribute('aria-label', 'Section heading');
  });

  it('should handle multiple children', () => {
    render(
      <SectionTitle>
        <span>Part 1</span>
        <span>Part 2</span>
      </SectionTitle>
    );
    expect(screen.getByText('Part 1')).toBeInTheDocument();
    expect(screen.getByText('Part 2')).toBeInTheDocument();
  });

  it('should render with React node children', () => {
    render(
      <SectionTitle>
        <span data-testid="title-node">Title Node</span>
      </SectionTitle>
    );
    expect(screen.getByTestId('title-node')).toBeInTheDocument();
    expect(screen.getByText('Title Node')).toBeInTheDocument();
  });

  it('should render with number children', () => {
    render(<SectionTitle>{123}</SectionTitle>);
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render with empty string children', () => {
    const { container } = render(<SectionTitle>{''}</SectionTitle>);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });

  it('should have correct structure: wrapper > heading > paragraph and underline', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const wrapper = container.firstChild as HTMLElement;
    const heading = wrapper.querySelector('h2');
    const paragraph = heading?.querySelector('p');
    const underline = heading?.querySelector('div.h-1');

    expect(wrapper).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(underline).toBeInTheDocument();
  });

  it('should render underline div inside heading element', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const heading = container.querySelector('h2');
    const underline = heading?.querySelector('div.h-1');
    expect(underline).toBeInTheDocument();
  });

  it('should render paragraph before underline in heading', () => {
    const { container } = render(<SectionTitle>Test Title</SectionTitle>);
    const heading = container.querySelector('h2');
    const children = Array.from(heading?.children || []);
    const paragraph = children.find((child) => child.tagName === 'P');
    const underline = children.find((child) => child.classList.contains('h-1'));

    expect(paragraph).toBeInTheDocument();
    expect(underline).toBeInTheDocument();
    expect(children.indexOf(paragraph!)).toBeLessThan(children.indexOf(underline!));
  });
});
