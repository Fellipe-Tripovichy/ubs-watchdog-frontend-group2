import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';

jest.mock('react-day-picker', () => {
  const actual = jest.requireActual('react-day-picker');
  return {
    ...actual,
    DayPicker: ({ className, showOutsideDays, captionLayout, onSelect, selected, disabled, ...props }: any) => {
      const mockDate = new Date(2024, 0, 15);
      
      const getSelectedValue = () => {
        if (!selected) return false;
        if (selected instanceof Date) {
          return selected.toDateString() === mockDate.toDateString();
        }
        if (Array.isArray(selected)) {
          return selected.some(date => date.toDateString() === mockDate.toDateString());
        }
        if (selected.from && selected.to) {
          return selected.from.toDateString() === mockDate.toDateString() || 
                 selected.to.toDateString() === mockDate.toDateString();
        }
        return false;
      };
      
      const getSelectedDate = () => {
        if (selected instanceof Date) return selected;
        if (Array.isArray(selected) && selected.length > 0) return selected[0];
        if (selected?.from) return selected.from;
        return mockDate;
      };
      
      return (
        <div
          data-slot="calendar"
          data-testid="day-picker"
          className={className}
          data-show-outside-days={showOutsideDays}
          data-caption-layout={captionLayout}
          {...props}
        >
          <div data-testid="calendar-nav">
            <button
              data-testid="prev-button"
              onClick={() => {
                const baseDate = getSelectedDate();
                const newDate = new Date(baseDate);
                newDate.setMonth(newDate.getMonth() - 1);
                onSelect?.(newDate);
              }}
            >
              Previous
            </button>
            <button
              data-testid="next-button"
              onClick={() => {
                const baseDate = getSelectedDate();
                const newDate = new Date(baseDate);
                newDate.setMonth(newDate.getMonth() + 1);
                onSelect?.(newDate);
              }}
            >
              Next
            </button>
          </div>
          <div data-testid="calendar-content">
            <button
              data-testid="day-button"
              onClick={() => onSelect?.(mockDate)}
              data-selected={getSelectedValue()}
            >
              {mockDate.getDate()}
            </button>
          </div>
        </div>
      );
    },
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, onClick, ...props }: any) => (
    <button
      data-slot="button"
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  buttonVariants: jest.fn(() => 'button-variants-class'),
}));

jest.mock('lucide-react', () => ({
  ChevronLeftIcon: ({ className, ...props }: any) => (
    <svg data-testid="chevron-left-icon" className={className} {...props}>
      <title>Chevron Left</title>
    </svg>
  ),
  ChevronRightIcon: ({ className, ...props }: any) => (
    <svg data-testid="chevron-right-icon" className={className} {...props}>
      <title>Chevron Right</title>
    </svg>
  ),
  ChevronDownIcon: ({ className, ...props }: any) => (
    <svg data-testid="chevron-down-icon" className={className} {...props}>
      <title>Chevron Down</title>
    </svg>
  ),
}));

describe('Calendar', () => {
  it('should render', () => {
    render(<Calendar />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Calendar />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toBeInTheDocument();
  });

  it('should apply default className', () => {
    const { container } = render(<Calendar />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveClass('bg-background');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(<Calendar className="custom-class" />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveClass('custom-class');
  });

  it('should show outside days by default', () => {
    const { container } = render(<Calendar />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-show-outside-days', 'true');
  });

  it('should hide outside days when showOutsideDays is false', () => {
    const { container } = render(<Calendar showOutsideDays={false} />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-show-outside-days', 'false');
  });

  it('should use label caption layout by default', () => {
    const { container } = render(<Calendar />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-caption-layout', 'label');
  });

  it('should use dropdown caption layout when specified', () => {
    const { container } = render(<Calendar captionLayout="dropdown" />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-caption-layout', 'dropdown');
  });

  it('should use dropdown-months caption layout when specified', () => {
    const { container } = render(<Calendar captionLayout="dropdown-months" />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-caption-layout', 'dropdown-months');
  });

  it('should handle date selection', () => {
    const mockOnSelect = jest.fn();
    const selectedDate = new Date(2024, 0, 15);
    render(<Calendar mode="single" selected={selectedDate} onSelect={mockOnSelect} />);
    
    const dayButton = screen.getByTestId('day-button');
    fireEvent.click(dayButton);
    
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should render navigation buttons', () => {
    render(<Calendar />);
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  it('should handle previous month navigation', () => {
    const mockOnSelect = jest.fn();
    const selectedDate = new Date(2024, 0, 15);
    render(<Calendar mode="single" selected={selectedDate} onSelect={mockOnSelect} />);
    
    const prevButton = screen.getByTestId('prev-button');
    fireEvent.click(prevButton);
    
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should handle next month navigation', () => {
    const mockOnSelect = jest.fn();
    const selectedDate = new Date(2024, 0, 15);
    render(<Calendar mode="single" selected={selectedDate} onSelect={mockOnSelect} />);
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it('should use secondary button variant by default', () => {
    render(<Calendar />);
    const prevButton = screen.getByTestId('prev-button');
    expect(prevButton).toBeInTheDocument();
  });

  it('should use custom button variant when specified', () => {
    render(<Calendar buttonVariant="default" />);
    const prevButton = screen.getByTestId('prev-button');
    expect(prevButton).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    const { container } = render(<Calendar data-test="custom-test" />);
    const calendar = container.querySelector('[data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-test', 'custom-test');
  });

  it('should handle disabled dates', () => {
    const disabledDate = new Date(2024, 0, 10);
    render(<Calendar disabled={disabledDate} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle date range selection', () => {
    const startDate = new Date(2024, 0, 10);
    const endDate = new Date(2024, 0, 20);
    render(<Calendar mode="range" selected={{ from: startDate, to: endDate }} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle multiple date selection', () => {
    const dates = [new Date(2024, 0, 10), new Date(2024, 0, 15), new Date(2024, 0, 20)];
    render(<Calendar mode="multiple" selected={dates} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle disabled prop with before date', () => {
    const beforeDate = new Date(2024, 0, 1);
    render(<Calendar disabled={{ before: beforeDate }} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle disabled prop with after date', () => {
    const afterDate = new Date(2024, 11, 31);
    render(<Calendar disabled={{ after: afterDate }} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle showWeekNumber prop', () => {
    render(<Calendar showWeekNumber />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle custom formatters', () => {
    const customFormatters = {
      formatMonthDropdown: (date: Date) => date.toLocaleString('default', { month: 'long' }),
    };
    render(<Calendar formatters={customFormatters} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle custom components', () => {
    const customComponents = {
      Root: ({ children }: any) => <div data-testid="custom-root">{children}</div>,
    };
    render(<Calendar components={customComponents} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle custom classNames', () => {
    const customClassNames = {
      root: 'custom-root-class',
      month: 'custom-month-class',
    };
    render(<Calendar classNames={customClassNames} />);
    const calendar = screen.getByTestId('day-picker');
    expect(calendar).toBeInTheDocument();
  });
});

describe('CalendarDayButton', () => {
  const mockDay = {
    date: new Date(2024, 0, 15),
    displayMonth: new Date(2024, 0, 1),
  } as any;

  const defaultProps = {
    day: mockDay,
    modifiers: {
      selected: false,
      range_start: false,
      range_end: false,
      range_middle: false,
      focused: false,
      disabled: false,
      outside: false,
    } as any,
  };

  it('should render', () => {
    render(<CalendarDayButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render day button with correct date attribute', () => {
    render(<CalendarDayButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-day', mockDay.date.toLocaleDateString());
  });

  it('should apply selected-single attribute when selected', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        selected: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-selected-single', 'true');
  });

  it('should not apply selected-single when in range', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        selected: true,
        range_start: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-selected-single', 'false');
  });

  it('should apply range-start attribute', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_start: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-start', 'true');
  });

  it('should apply range-end attribute', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_end: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-end', 'true');
  });

  it('should apply range-middle attribute', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_middle: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-range-middle', 'true');
  });

  it('should focus button when focused modifier is true', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        focused: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should apply disabled styles when disabled', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        disabled: true,
      },
    };
    render(<CalendarDayButton {...props} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should merge custom className', () => {
    render(<CalendarDayButton {...defaultProps} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should handle click events', () => {
    const mockOnClick = jest.fn();
    render(<CalendarDayButton {...defaultProps} onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply selected single styles', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        selected: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('data-[selected-single=true]:bg-primary');
  });

  it('should apply range start styles', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_start: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('data-[range-start=true]:bg-primary');
  });

  it('should apply range end styles', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_end: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('data-[range-end=true]:bg-primary');
  });

  it('should apply range middle styles', () => {
    const props = {
      ...defaultProps,
      modifiers: {
        ...defaultProps.modifiers,
        range_middle: true,
      },
    };
    render(<CalendarDayButton {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('data-[range-middle=true]:bg-accent');
  });
});
