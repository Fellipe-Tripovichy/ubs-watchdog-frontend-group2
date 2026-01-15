import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from '@/lib/use-breakpoint';

describe('useBreakpoint', () => {
  const originalInnerWidth = window.innerWidth;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  let resizeListeners: Array<() => void> = [];

  beforeEach(() => {
    resizeListeners = [];
    window.addEventListener = jest.fn((event: string, handler: EventListener) => {
      if (event === 'resize') {
        resizeListeners.push(handler as () => void);
      }
    });
    window.removeEventListener = jest.fn((event: string, handler: EventListener) => {
      if (event === 'resize') {
        const index = resizeListeners.indexOf(handler as () => void);
        if (index > -1) {
          resizeListeners.splice(index, 1);
        }
      }
    });
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  const triggerResize = () => {
    resizeListeners.forEach(listener => listener());
  };

  it('should return "default" for width less than sm breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('default');
  });

  it('should return "sm" for width at sm breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('sm');
  });

  it('should return "sm" for width between sm and md breakpoints', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('sm');
  });

  it('should return "md" for width at md breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('md');
  });

  it('should return "md" for width between md and lg breakpoints', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('md');
  });

  it('should return "lg" for width at lg breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('lg');
  });

  it('should return "lg" for width greater than lg breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('lg');
  });

  it('should update breakpoint on window resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('default');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('md');
  });

  it('should update from default to sm on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('default');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 650,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('sm');
  });

  it('should update from sm to md on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('sm');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('md');
  });

  it('should update from md to lg on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('md');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1100,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('lg');
  });

  it('should update from lg to md on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('lg');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('md');
  });

  it('should update from md to sm on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('md');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 650,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('sm');
  });

  it('should update from sm to default on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 650,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('sm');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('default');
  });

  it('should add resize event listener on mount', () => {
    renderHook(() => useBreakpoint());
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useBreakpoint());
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should handle multiple resize events', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('default');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 700,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('sm');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('md');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1100,
    });

    act(() => {
      triggerResize();
    });

    rerender();
    expect(result.current).toBe('lg');
  });

  it('should handle edge case at exact breakpoint boundaries', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 639,
    });

    const { result: result1 } = renderHook(() => useBreakpoint());
    expect(result1.current).toBe('default');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    const { result: result2 } = renderHook(() => useBreakpoint());
    expect(result2.current).toBe('sm');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result: result3 } = renderHook(() => useBreakpoint());
    expect(result3.current).toBe('sm');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result: result4 } = renderHook(() => useBreakpoint());
    expect(result4.current).toBe('md');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1023,
    });

    const { result: result5 } = renderHook(() => useBreakpoint());
    expect(result5.current).toBe('md');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result: result6 } = renderHook(() => useBreakpoint());
    expect(result6.current).toBe('lg');
  });
});
