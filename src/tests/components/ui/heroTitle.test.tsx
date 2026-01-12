import { render, screen } from '@testing-library/react';
import { HeroTitle } from '@/components/ui/heroTitle';

describe('HeroTitle', () => {
  it('should render', () => {
    render(<HeroTitle>Test Title</HeroTitle>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render children as title', () => {
    render(<HeroTitle>My Hero Title</HeroTitle>);
    expect(screen.getByText('My Hero Title')).toBeInTheDocument();
  });

  it('should render as h1 by default', () => {
    render(<HeroTitle>Test Title</HeroTitle>);
    const heading = screen.getByText('Test Title');
    expect(heading.tagName).toBe('H1');
  });

  it('should render subtitle when provided', () => {
    render(<HeroTitle subtitle="Subtitle text">Test Title</HeroTitle>);
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(<HeroTitle>Test Title</HeroTitle>);
    const subtitle = screen.queryByText(/subtitle/i);
    expect(subtitle).not.toBeInTheDocument();
  });

  it('should render subtitle as paragraph element', () => {
    render(<HeroTitle subtitle="Subtitle text">Test Title</HeroTitle>);
    const subtitle = screen.getByText('Subtitle text');
    expect(subtitle.tagName).toBe('P');
  });

  it('should apply default classes to wrapper', () => {
    const { container } = render(<HeroTitle>Test Title</HeroTitle>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2', 'pl-5', 'border-l-4', 'border-primary');
  });

  it('should apply default classes to heading', () => {
    render(<HeroTitle>Test Title</HeroTitle>);
    const heading = screen.getByText('Test Title');
    expect(heading).toHaveClass('text-[32px]', 'md:text-[40px]', 'font-regular', 'text-foreground');
  });

  it('should merge custom className with default classes on heading', () => {
    render(<HeroTitle className="custom-class">Test Title</HeroTitle>);
    const heading = screen.getByText('Test Title');
    expect(heading).toHaveClass('custom-class');
    expect(heading).toHaveClass('text-[32px]');
  });

  it('should apply default classes to subtitle', () => {
    render(<HeroTitle subtitle="Subtitle text">Test Title</HeroTitle>);
    const subtitle = screen.getByText('Subtitle text');
    expect(subtitle).toHaveClass('text-[20px]', 'text-foreground');
  });

  it('should render subtitle with React node', () => {
    render(
      <HeroTitle subtitle={<span data-testid="subtitle-node">Subtitle Node</span>}>
        Test Title
      </HeroTitle>
    );
    expect(screen.getByTestId('subtitle-node')).toBeInTheDocument();
    expect(screen.getByText('Subtitle Node')).toBeInTheDocument();
  });

  it('should pass through additional props to heading', () => {
    render(<HeroTitle data-testid="custom-heading" id="heading-id">Test Title</HeroTitle>);
    const heading = screen.getByText('Test Title');
    expect(heading).toHaveAttribute('data-testid', 'custom-heading');
    expect(heading).toHaveAttribute('id', 'heading-id');
  });

  it('should handle aria-label prop', () => {
    render(<HeroTitle aria-label="Main heading">Test Title</HeroTitle>);
    const heading = screen.getByText('Test Title');
    expect(heading).toHaveAttribute('aria-label', 'Main heading');
  });

  it('should handle multiple children in title', () => {
    render(
      <HeroTitle>
        <span>Part 1</span>
        <span>Part 2</span>
      </HeroTitle>
    );
    expect(screen.getByText('Part 1')).toBeInTheDocument();
    expect(screen.getByText('Part 2')).toBeInTheDocument();
  });

  it('should render with empty subtitle string', () => {
    const { container } = render(<HeroTitle subtitle="">Test Title</HeroTitle>);
    // Empty string is falsy, so subtitle should not render
    // Check that there's no subtitle paragraph element
    const subtitle = container.querySelector('p');
    expect(subtitle).not.toBeInTheDocument();
    // Title should still render
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render with number subtitle', () => {
    render(<HeroTitle subtitle={123}>Test Title</HeroTitle>);
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
