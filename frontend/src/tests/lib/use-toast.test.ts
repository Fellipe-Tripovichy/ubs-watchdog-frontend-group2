import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { useToast, toast, reducer } from '@/lib/use-toast';
import type { ToasterToast } from '@/lib/use-toast';

jest.useFakeTimers();

describe('use-toast', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    const toastModule = require('@/lib/use-toast');
    const { useToast } = toastModule;
    
    const { result, unmount } = renderHook(() => useToast());
    
    act(() => {
      if (result.current.toasts.length > 0) {
        result.current.dismiss();
      }
      jest.advanceTimersByTime(200);
    });
    
    unmount();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllMocks();
  });

  describe('reducer', () => {
    it('should handle ADD_TOAST action', () => {
      const initialState = { toasts: [] };
      const toast: ToasterToast = {
        id: '1',
        title: 'Test Toast',
        open: true,
        onOpenChange: () => {},
      };

      const newState = reducer(initialState, {
        type: 'ADD_TOAST',
        toast,
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    it('should limit toasts to TOAST_LIMIT', () => {
      const initialState = { toasts: [] };
      const toast1: ToasterToast = {
        id: '1',
        title: 'Toast 1',
        open: true,
        onOpenChange: () => {},
      };
      const toast2: ToasterToast = {
        id: '2',
        title: 'Toast 2',
        open: true,
        onOpenChange: () => {},
      };

      let state = reducer(initialState, {
        type: 'ADD_TOAST',
        toast: toast1,
      });

      state = reducer(state, {
        type: 'ADD_TOAST',
        toast: toast2,
      });

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe('2');
    });

    it('should handle UPDATE_TOAST action', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Original Title',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'UPDATE_TOAST',
        toast: {
          id: '1',
          title: 'Updated Title',
        },
      });

      expect(newState.toasts[0].title).toBe('Updated Title');
    });

    it('should not update toast if id does not match', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Original Title',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'UPDATE_TOAST',
        toast: {
          id: '2',
          title: 'Updated Title',
        },
      });

      expect(newState.toasts[0].title).toBe('Original Title');
    });

    it('should handle DISMISS_TOAST action with specific toastId', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
            onOpenChange: () => {},
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'DISMISS_TOAST',
        toastId: '1',
      });

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(true);
    });

    it('should handle DISMISS_TOAST action without toastId', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
            onOpenChange: () => {},
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'DISMISS_TOAST',
      });

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

    it('should handle REMOVE_TOAST action with specific toastId', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
            onOpenChange: () => {},
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'REMOVE_TOAST',
        toastId: '1',
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });

    it('should handle REMOVE_TOAST action without toastId', () => {
      const initialState = {
        toasts: [
          {
            id: '1',
            title: 'Toast 1',
            open: true,
            onOpenChange: () => {},
          },
          {
            id: '2',
            title: 'Toast 2',
            open: true,
            onOpenChange: () => {},
          },
        ],
      };

      const newState = reducer(initialState, {
        type: 'REMOVE_TOAST',
      });

      expect(newState.toasts).toHaveLength(0);
    });
  });

  describe('toast function', () => {
    it('should create a toast with id, dismiss, and update functions', () => {
      const result = toast({
        title: 'Test Toast',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('dismiss');
      expect(result).toHaveProperty('update');
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should add toast to state', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        toast({
          title: 'Test Toast',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
      expect(result.current.toasts[0].open).toBe(true);
    });

    it('should generate unique ids', () => {
      const toast1 = toast({ title: 'Toast 1' });
      const toast2 = toast({ title: 'Toast 2' });

      expect(toast1.id).not.toBe(toast2.id);
    });

    it('should call dismiss function to dismiss toast', () => {
      const { result } = renderHook(() => useToast());
      
      let toastResult: ReturnType<typeof toast>;
      act(() => {
        toastResult = toast({
          title: 'Test Toast',
        });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        toastResult.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should call update function to update toast', () => {
      const { result } = renderHook(() => useToast());
      
      let toastResult: ReturnType<typeof toast>;
      act(() => {
        toastResult = toast({
          title: 'Original Title',
        });
      });

      expect(result.current.toasts[0].title).toBe('Original Title');

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: 'Updated Title',
          open: true,
          onOpenChange: () => {},
        });
      });

      expect(result.current.toasts[0].title).toBe('Updated Title');
    });

    it('should set onOpenChange handler that dismisses on close', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        toast({
          title: 'Test Toast',
        });
      });

      const toastItem = result.current.toasts[0];
      expect(toastItem.onOpenChange).toBeDefined();

      act(() => {
        toastItem.onOpenChange?.(false);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should not dismiss when onOpenChange is called with true', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        toast({
          title: 'Test Toast',
        });
      });

      const toastItem = result.current.toasts[0];
      
      act(() => {
        toastItem.onOpenChange?.(true);
      });

      expect(result.current.toasts[0].open).toBe(true);
    });
  });

  describe('useToast hook', () => {
    it('should return initial state with empty toasts', () => {
      const { result } = renderHook(() => useToast());
      act(() => {
        if (result.current.toasts.length > 0) {
          result.current.dismiss();
        }
        jest.advanceTimersByTime(200);
      });
      expect(result.current.toasts.length).toBe(0);
    });

    it('should return toast function', () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.toast).toBe('function');
    });

    it('should return dismiss function', () => {
      const { result } = renderHook(() => useToast());
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should update state when toast is added', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');
    });

    it('should update state when dismiss is called', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
        });
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(result.current.toasts[0].id);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should dismiss all toasts when dismiss is called without id', () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Toast 1',
        });
      });

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should remove toast after dismiss delay', async () => {
      const { result } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
        });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(0);
      });
    });

    it('should handle multiple toast instances', () => {
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());
      
      act(() => {
        result1.current.toast({
          title: 'Toast from hook 1',
        });
      });

      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
    });

    it('should clean up listener on unmount', () => {
      const { result, unmount } = renderHook(() => useToast());
      
      act(() => {
        result.current.toast({
          title: 'Test Toast',
        });
      });

      unmount();

      const { result: result2 } = renderHook(() => useToast());
      
      act(() => {
        result2.current.toast({
          title: 'New Toast',
        });
      });

      expect(result2.current.toasts).toHaveLength(1);
    });

    it('should handle toast with all properties', () => {
      const { result } = renderHook(() => useToast());
      
      const action = React.createElement('button', null, 'Action');
      
      act(() => {
        result.current.toast({
          title: 'Test Title',
          description: 'Test Description',
          action,
          variant: 'success',
        });
      });

      expect(result.current.toasts[0].title).toBe('Test Title');
      expect(result.current.toasts[0].description).toBe('Test Description');
      expect(result.current.toasts[0].action).toBe(action);
    });
  });
});
