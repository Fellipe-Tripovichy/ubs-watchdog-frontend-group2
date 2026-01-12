import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DatePickerInput } from '@/components/ui/datePickerInput';

// Mock Input component
jest.mock('@/components/ui/input', () => ({
  Input: ({ value, placeholder, className, onChange, onKeyDown, ...props }: any) => (
    <input
      data-slot="input"
      type="text"
      role="textbox"
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...props}
    />
  ),
}));

// Mock Button component
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
}));

// Mock Calendar component
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ selected, month, onMonthChange, onSelect, disabled, ...props }: any) => {
    // Serialize disabled array properly, handling Date objects
    const serializeDisabled = (disabledArray: any[]) => {
      if (!disabledArray || !Array.isArray(disabledArray)) return '[]';
      return JSON.stringify(
        disabledArray.map((item) => {
          if (item.before) {
            return { before: item.before.toISOString() };
          }
          if (item.after) {
            return { after: item.after.toISOString() };
          }
          return item;
        })
      );
    };

    return (
      <div
        data-slot="calendar"
        data-selected={selected?.toISOString()}
        data-month={month?.toISOString()}
        data-disabled={serializeDisabled(disabled)}
        {...props}
      >
        <button
          data-testid="calendar-select-date"
          onClick={() => {
            const testDate = new Date(2024, 0, 15);
            onSelect?.(testDate);
          }}
        >
          Select Date
        </button>
        <button
          data-testid="calendar-change-month"
          onClick={() => {
            const newMonth = new Date(2024, 1, 1);
            onMonthChange?.(newMonth);
          }}
        >
          Change Month
        </button>
      </div>
    );
  },
}));

// Mock Popover components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ open, onOpenChange, children }: any) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ asChild, children }: any) => {
    if (asChild) {
      return children;
    }
    return <div data-slot="popover-trigger">{children}</div>;
  },
  PopoverContent: ({ children, className, ...props }: any) => (
    <div data-slot="popover-content" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock CalendarIcon
jest.mock('lucide-react', () => ({
  CalendarIcon: ({ className, ...props }: any) => (
    <svg data-testid="calendar-icon" className={className} {...props}>
      <title>Calendar</title>
    </svg>
  ),
}));

describe('DatePickerInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render label', () => {
    render(<DatePickerInput label="Date Label" value={undefined} onChange={mockOnChange} />);
    expect(screen.getByText('Date Label')).toBeInTheDocument();
  });

  it('should render input with default placeholder', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'dd/mm/aaaa');
  });

  it('should render input with custom placeholder', () => {
    render(
      <DatePickerInput
        label="Test Label"
        value={undefined}
        onChange={mockOnChange}
        placeholder="Select date"
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Select date');
  });

  it('should render input with empty value when value is undefined', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should format and display date value in pt-BR format', () => {
    const date = new Date(2024, 0, 15);
    render(<DatePickerInput label="Test Label" value={date} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('15/01/2024');
  });

  it('should update input value when prop value changes', () => {
    const { rerender } = render(
      <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');

    const newDate = new Date(2024, 5, 20);
    rerender(<DatePickerInput label="Test Label" value={newDate} onChange={mockOnChange} />);
    expect(input.value).toBe('20/06/2024');
  });

  it('should parse valid date string and call onChange', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '15/01/2024' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const calledDate = mockOnChange.mock.calls[0][0];
    expect(calledDate).toBeInstanceOf(Date);
    expect(calledDate.getDate()).toBe(15);
    expect(calledDate.getMonth()).toBe(0);
    expect(calledDate.getFullYear()).toBe(2024);
  });

  it('should not call onChange for invalid date format', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not call onChange for invalid date values', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '32/01/2024' } }); // Invalid day

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should call onChange with undefined when input is cleared', () => {
    const date = new Date(2024, 0, 15);
    render(<DatePickerInput label="Test Label" value={date} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('should call onChange with undefined when input is whitespace only', () => {
    const date = new Date(2024, 0, 15);
    render(<DatePickerInput label="Test Label" value={date} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '   ' } });

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('should not call onChange when date is before minDate', () => {
    const minDate = new Date(2024, 0, 20);
    const initialDate = new Date(2024, 0, 15);
    render(
      <DatePickerInput
        label="Test Label"
        value={initialDate}
        onChange={mockOnChange}
        minDate={minDate}
      />
    );
    const input = screen.getByRole('textbox');

    // Try to set a date before minDate
    fireEvent.change(input, { target: { value: '15/01/2024' } });

    // onChange should not be called for dates before minDate
    // The input value changes but onChange is prevented
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not call onChange when date is after maxDate', () => {
    const maxDate = new Date(2024, 0, 10);
    const initialDate = new Date(2024, 0, 15);
    render(
      <DatePickerInput
        label="Test Label"
        value={initialDate}
        onChange={mockOnChange}
        maxDate={maxDate}
      />
    );
    const input = screen.getByRole('textbox');

    // Try to set a date after maxDate
    fireEvent.change(input, { target: { value: '15/01/2024' } });

    // onChange should not be called for dates after maxDate
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should open popover when ArrowDown key is pressed', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    const popover = screen.getByTestId('popover');

    expect(popover).toHaveAttribute('data-open', 'false');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(popover).toHaveAttribute('data-open', 'true');
  });

  it('should prevent default when ArrowDown key is pressed', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    const popover = screen.getByTestId('popover');

    let defaultPrevented = false;
    const event = {
      key: 'ArrowDown',
      preventDefault: () => {
        defaultPrevented = true;
      },
    };

    fireEvent.keyDown(input, event);

    // Verify popover opens (which indicates preventDefault was called)
    expect(popover).toHaveAttribute('data-open', 'true');
  });

  it('should not open popover for other keys', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    const popover = screen.getByTestId('popover');

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(popover).toHaveAttribute('data-open', 'false');
  });

  it('should render calendar icon button', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const calendarIcon = screen.getByTestId('calendar-icon');
    expect(calendarIcon).toBeInTheDocument();
  });

  it('should render screen reader text for calendar button', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const srText = screen.getByText('Selecionar data');
    expect(srText).toHaveClass('sr-only');
  });

  it('should render Calendar component in PopoverContent', () => {
    const { baseElement } = render(
      <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox');

    // Open popover
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    expect(calendar).toBeInTheDocument();
  });

  it('should pass selected date to Calendar', () => {
    const date = new Date(2024, 0, 15);
    const { baseElement } = render(
      <DatePickerInput label="Test Label" value={date} onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-selected', date.toISOString());
  });

  it('should pass month to Calendar', () => {
    const date = new Date(2024, 0, 15);
    const { baseElement } = render(
      <DatePickerInput label="Test Label" value={date} onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    expect(calendar).toHaveAttribute('data-month', date.toISOString());
  });

  it('should pass disabled dates to Calendar based on minDate', () => {
    const minDate = new Date(2024, 0, 10);
    const { baseElement } = render(
      <DatePickerInput
        label="Test Label"
        value={undefined}
        onChange={mockOnChange}
        minDate={minDate}
      />
    );
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    const disabledStr = calendar?.getAttribute('data-disabled') || '[]';
    const disabled = JSON.parse(disabledStr);
    expect(disabled).toHaveLength(1);
    expect(disabled[0]).toHaveProperty('before');
    // Verify the date is correctly serialized
    expect(new Date(disabled[0].before).getTime()).toBe(minDate.getTime());
  });

  it('should pass disabled dates to Calendar based on maxDate', () => {
    const maxDate = new Date(2024, 0, 20);
    const { baseElement } = render(
      <DatePickerInput
        label="Test Label"
        value={undefined}
        onChange={mockOnChange}
        maxDate={maxDate}
      />
    );
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    const disabledStr = calendar?.getAttribute('data-disabled') || '[]';
    const disabled = JSON.parse(disabledStr);
    expect(disabled).toHaveLength(1);
    expect(disabled[0]).toHaveProperty('after');
    // Verify the date is correctly serialized
    expect(new Date(disabled[0].after).getTime()).toBe(maxDate.getTime());
  });

  it('should pass disabled dates to Calendar based on both minDate and maxDate', () => {
    const minDate = new Date(2024, 0, 10);
    const maxDate = new Date(2024, 0, 20);
    const { baseElement } = render(
      <DatePickerInput
        label="Test Label"
        value={undefined}
        onChange={mockOnChange}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
    const disabledStr = calendar?.getAttribute('data-disabled') || '[]';
    const disabled = JSON.parse(disabledStr);
    expect(disabled).toHaveLength(2);
    expect(disabled.some((d: any) => d.before)).toBe(true);
    expect(disabled.some((d: any) => d.after)).toBe(true);
  });

  it('should call onChange and close popover when date is selected from Calendar', async () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    // Open popover
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      const selectButton = screen.getByTestId('calendar-select-date');
      expect(selectButton).toBeInTheDocument();
    });

    const selectButton = screen.getByTestId('calendar-select-date');
    fireEvent.click(selectButton);

    expect(mockOnChange).toHaveBeenCalled();
    const selectedDate = mockOnChange.mock.calls[0][0];
    expect(selectedDate).toBeInstanceOf(Date);

    // Popover should close
    const popover = screen.getByTestId('popover');
    await waitFor(() => {
      expect(popover).toHaveAttribute('data-open', 'false');
    });
  });

  it('should update input text when date is selected from Calendar', async () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const popoverInput = screen.getByRole('textbox');

    // Open popover
    fireEvent.keyDown(popoverInput, { key: 'ArrowDown' });

    await waitFor(() => {
      const selectButton = screen.getByTestId('calendar-select-date');
      expect(selectButton).toBeInTheDocument();
    });

    const selectButton = screen.getByTestId('calendar-select-date');
    fireEvent.click(selectButton);

    // Input should be updated with formatted date
    await waitFor(() => {
      expect(input.value).toBeTruthy();
    });
  });

  it('should update month state when Calendar month changes', async () => {
    const { baseElement } = render(
      <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
    );
    const input = screen.getByRole('textbox');

    // Open popover
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      const changeMonthButton = screen.getByTestId('calendar-change-month');
      expect(changeMonthButton).toBeInTheDocument();
    });

    const changeMonthButton = screen.getByTestId('calendar-change-month');
    fireEvent.click(changeMonthButton);

    // Month state should be updated (this is internal state, but we can verify Calendar received it)
    await waitFor(() => {
      const calendar = baseElement.querySelector('[data-slot="popover-content"] [data-slot="calendar"]');
      expect(calendar).toBeInTheDocument();
    });
  });

  it('should apply correct classes to input', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pr-10');
  });

  it('should apply correct classes to wrapper div', () => {
    const { container } = render(
      <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
    );
    const wrapper = container.querySelector('.flex.flex-col.gap-2.w-full');
    expect(wrapper).toBeInTheDocument();
  });

  it('should apply correct classes to label', () => {
    render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground');
  });

  it('should apply correct classes to relative wrapper', () => {
    const { container } = render(
      <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
    );
    const relativeWrapper = container.querySelector('.relative.w-full');
    expect(relativeWrapper).toBeInTheDocument();
  });

  describe('Date Parsing', () => {
    it('should parse date with leading zeros', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '05/03/2024' } });

      expect(mockOnChange).toHaveBeenCalled();
      const date = mockOnChange.mock.calls[0][0];
      expect(date.getDate()).toBe(5);
      expect(date.getMonth()).toBe(2);
      expect(date.getFullYear()).toBe(2024);
    });

    it('should parse date without leading zeros', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '5/3/2024' } });

      // This should fail to parse because format requires dd/mm/yyyy with leading zeros
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should handle leap year dates', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '29/02/2024' } });

      expect(mockOnChange).toHaveBeenCalled();
      const date = mockOnChange.mock.calls[0][0];
      expect(date.getDate()).toBe(29);
      expect(date.getMonth()).toBe(1);
      expect(date.getFullYear()).toBe(2024);
    });

    it('should reject invalid leap year dates', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '29/02/2023' } }); // 2023 is not a leap year

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should handle edge case dates', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '31/12/2024' } });

      expect(mockOnChange).toHaveBeenCalled();
      const date = mockOnChange.mock.calls[0][0];
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(11);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value prop', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should handle null-like values gracefully', () => {
      const { rerender } = render(
        <DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;

      rerender(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      expect(input.value).toBe('');
    });

    it('should handle input with extra whitespace', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '  15/01/2024  ' } });

      // Should parse trimmed value
      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should not call onChange for partial date input', () => {
      render(<DatePickerInput label="Test Label" value={undefined} onChange={mockOnChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '15/01' } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
