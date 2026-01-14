import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastWithIcon,
} from '@/components/ui/toast';

jest.mock('lucide-react', () => ({
  X: () => <svg data-testid="x-icon" />,
  CheckCircle2: () => <svg data-testid="check-circle-icon" />,
  AlertCircle: () => <svg data-testid="alert-circle-icon" />,
  Info: () => <svg data-testid="info-icon" />,
}));

jest.mock('@radix-ui/react-toast', () => {
  const actual = jest.requireActual('@radix-ui/react-toast');
  return {
    ...actual,
    Provider: ({ children }: any) => <div data-testid="toast-provider">{children}</div>,
    Viewport: React.forwardRef(({ className, ...props }: any, ref: any) => (
      <div ref={ref} data-testid="toast-viewport" className={className} {...props} />
    )),
    Root: React.forwardRef(({ className, duration, ...props }: any, ref: any) => (
      <div ref={ref} data-testid="toast-root" className={className} data-duration={duration} {...props} />
    )),
    Title: React.forwardRef(({ className, ...props }: any, ref: any) => (
      <div ref={ref} data-testid="toast-title" className={className} {...props} />
    )),
    Description: React.forwardRef(({ className, ...props }: any, ref: any) => (
      <div ref={ref} data-testid="toast-description" className={className} {...props} />
    )),
    Close: React.forwardRef(({ className, ...props }: any, ref: any) => (
      <button ref={ref} data-testid="toast-close" className={className} {...props} />
    )),
    Action: React.forwardRef(({ className, ...props }: any, ref: any) => (
      <button ref={ref} data-testid="toast-action" className={className} {...props} />
    )),
  };
});

describe('ToastProvider', () => {
  it('should render ToastProvider', () => {
    render(
      <ToastProvider>
        <div>Content</div>
      </ToastProvider>
    );
    expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('ToastViewport', () => {
  it('should render ToastViewport', () => {
    render(<ToastViewport />);
    expect(screen.getByTestId('toast-viewport')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<ToastViewport />);
    const viewport = screen.getByTestId('toast-viewport');
    expect(viewport).toHaveClass('fixed', 'top-0', 'z-[100]');
  });

  it('should merge custom className with default classes', () => {
    render(<ToastViewport className="custom-class" />);
    const viewport = screen.getByTestId('toast-viewport');
    expect(viewport).toHaveClass('custom-class');
  });

  it('should forward props', () => {
    render(<ToastViewport data-testid="custom-viewport" />);
    expect(screen.getByTestId('custom-viewport')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ToastViewport ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Toast', () => {
  it('should render Toast', () => {
    render(<Toast open>Content</Toast>);
    expect(screen.getByTestId('toast-root')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply default variant classes (information)', () => {
    render(<Toast open />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('border-info/50', 'bg-info-light', 'text-info-foreground');
  });

  it('should apply success variant classes', () => {
    render(<Toast open variant="success" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('border-success/50', 'bg-success-light', 'text-success-foreground');
  });

  it('should apply negative variant classes', () => {
    render(<Toast open variant="negative" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('border-negative/50', 'bg-negative-light', 'text-negative-foreground');
  });

  it('should apply information variant classes', () => {
    render(<Toast open variant="information" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('border-info/50', 'bg-info-light', 'text-info-foreground');
  });

  it('should use default duration of 1500', () => {
    render(<Toast open />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveAttribute('data-duration', '1500');
  });

  it('should use custom duration', () => {
    render(<Toast open duration={3000} />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveAttribute('data-duration', '3000');
  });

  it('should merge custom className with variant classes', () => {
    render(<Toast open variant="success" className="custom-class" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('custom-class');
    expect(toast).toHaveClass('border-success/50');
  });

  it('should forward props', () => {
    render(<Toast open data-testid="custom-toast" />);
    expect(screen.getByTestId('custom-toast')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Toast open ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ToastTitle', () => {
  it('should render ToastTitle', () => {
    render(<ToastTitle>Title Text</ToastTitle>);
    expect(screen.getByTestId('toast-title')).toBeInTheDocument();
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<ToastTitle>Title</ToastTitle>);
    const title = screen.getByTestId('toast-title');
    expect(title).toHaveClass('text-sm', 'font-semibold');
  });

  it('should merge custom className with default classes', () => {
    render(<ToastTitle className="custom-class">Title</ToastTitle>);
    const title = screen.getByTestId('toast-title');
    expect(title).toHaveClass('custom-class');
  });

  it('should forward props', () => {
    render(<ToastTitle data-testid="custom-title">Title</ToastTitle>);
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ToastTitle ref={ref}>Title</ToastTitle>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ToastDescription', () => {
  it('should render ToastDescription', () => {
    render(<ToastDescription>Description Text</ToastDescription>);
    expect(screen.getByTestId('toast-description')).toBeInTheDocument();
    expect(screen.getByText('Description Text')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<ToastDescription>Description</ToastDescription>);
    const description = screen.getByTestId('toast-description');
    expect(description).toHaveClass('text-sm', 'opacity-90');
  });

  it('should merge custom className with default classes', () => {
    render(<ToastDescription className="custom-class">Description</ToastDescription>);
    const description = screen.getByTestId('toast-description');
    expect(description).toHaveClass('custom-class');
  });

  it('should forward props', () => {
    render(<ToastDescription data-testid="custom-description">Description</ToastDescription>);
    expect(screen.getByTestId('custom-description')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ToastDescription ref={ref}>Description</ToastDescription>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ToastClose', () => {
  it('should render ToastClose', () => {
    render(<ToastClose />);
    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<ToastClose />);
    const close = screen.getByTestId('toast-close');
    expect(close).toHaveClass('absolute', 'right-2', 'top-2');
  });

  it('should merge custom className with default classes', () => {
    render(<ToastClose className="custom-class" />);
    const close = screen.getByTestId('toast-close');
    expect(close).toHaveClass('custom-class');
  });

  it('should have toast-close attribute', () => {
    render(<ToastClose />);
    const close = screen.getByTestId('toast-close');
    expect(close).toHaveAttribute('toast-close', '');
  });

  it('should forward props', () => {
    render(<ToastClose data-testid="custom-close" />);
    expect(screen.getByTestId('custom-close')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ToastClose ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('ToastAction', () => {
  it('should render ToastAction', () => {
    render(<ToastAction>Action</ToastAction>);
    expect(screen.getByTestId('toast-action')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<ToastAction>Action</ToastAction>);
    const action = screen.getByTestId('toast-action');
    expect(action).toHaveClass('inline-flex', 'h-8', 'shrink-0');
  });

  it('should merge custom className with default classes', () => {
    render(<ToastAction className="custom-class">Action</ToastAction>);
    const action = screen.getByTestId('toast-action');
    expect(action).toHaveClass('custom-class');
  });

  it('should forward props', () => {
    render(<ToastAction data-testid="custom-action">Action</ToastAction>);
    expect(screen.getByTestId('custom-action')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ToastAction ref={ref}>Action</ToastAction>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<ToastAction onClick={handleClick}>Action</ToastAction>);
    const action = screen.getByTestId('toast-action');
    fireEvent.click(action);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ToastWithIcon', () => {
  it('should render ToastWithIcon with default variant (information)', () => {
    render(<ToastWithIcon open title="Title" description="Description" />);
    expect(screen.getByTestId('toast-root')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should render success variant with CheckCircle2 icon', () => {
    render(<ToastWithIcon open variant="success" title="Success" />);
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('toast-root')).toHaveClass('border-success/50');
  });

  it('should render negative variant with AlertCircle icon', () => {
    render(<ToastWithIcon open variant="negative" title="Error" />);
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('toast-root')).toHaveClass('border-negative/50');
  });

  it('should render information variant with Info icon', () => {
    render(<ToastWithIcon open variant="information" title="Info" />);
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    expect(screen.getByTestId('toast-root')).toHaveClass('border-info/50');
  });

  it('should render title when provided', () => {
    render(<ToastWithIcon open title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should not render title when not provided', () => {
    render(<ToastWithIcon open description="Description" />);
    expect(screen.queryByTestId('toast-title')).not.toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<ToastWithIcon open description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<ToastWithIcon open title="Title" />);
    expect(screen.queryByTestId('toast-description')).not.toBeInTheDocument();
  });

  it('should render both title and description', () => {
    render(<ToastWithIcon open title="Title" description="Description" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should render ToastClose', () => {
    render(<ToastWithIcon open title="Title" />);
    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
  });

  it('should apply gap-4 class', () => {
    render(<ToastWithIcon open title="Title" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('gap-4');
  });

  it('should merge custom className', () => {
    render(<ToastWithIcon open title="Title" className="custom-class" />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveClass('custom-class');
  });

  it('should forward props to Toast', () => {
    render(<ToastWithIcon open title="Title" duration={2000} />);
    const toast = screen.getByTestId('toast-root');
    expect(toast).toHaveAttribute('data-duration', '2000');
  });

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ToastWithIcon open title="Title" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should render icon in flex-shrink-0 container', () => {
    const { container } = render(<ToastWithIcon open title="Title" variant="success" />);
    const iconContainer = container.querySelector('.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer?.querySelector('[data-testid="check-circle-icon"]')).toBeInTheDocument();
  });

  it('should render content in flex-1 container', () => {
    const { container } = render(<ToastWithIcon open title="Title" description="Description" />);
    const contentContainer = container.querySelector('.flex-1');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer?.querySelector('[data-testid="toast-title"]')).toBeInTheDocument();
    expect(contentContainer?.querySelector('[data-testid="toast-description"]')).toBeInTheDocument();
  });
});
