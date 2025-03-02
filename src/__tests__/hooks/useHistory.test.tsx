import { renderHook, act } from '@testing-library/react';
import useHistory from '../../hooks/useHistory';

describe('useHistory hook', () => {
  it('should initialize with the given initial state', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useHistory(initialState));
    
    expect(result.current.state).toEqual(initialState);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should update state and add to history', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useHistory(initialState));
    
    act(() => {
      result.current.update({ count: 1 });
    });
    
    expect(result.current.state).toEqual({ count: 1 });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should undo and redo changes', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useHistory(initialState));
    
    // Update state
    act(() => {
      result.current.update({ count: 1 });
    });
    
    expect(result.current.state).toEqual({ count: 1 });
    
    // Undo
    act(() => {
      result.current.undo();
    });
    
    expect(result.current.state).toEqual({ count: 0 });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
    
    // Redo
    act(() => {
      result.current.redo();
    });
    
    expect(result.current.state).toEqual({ count: 1 });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should support update with function', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useHistory(initialState));
    
    act(() => {
      result.current.update((state) => ({ count: state.count + 1 }));
    });
    
    expect(result.current.state).toEqual({ count: 1 });
  });

  it('should limit history size', () => {
    const initialState = { count: 0 };
    const maxHistory = 2;
    const { result } = renderHook(() => useHistory(initialState, maxHistory));
    
    // Add 3 updates
    act(() => {
      result.current.update({ count: 1 });
      result.current.update({ count: 2 });
      result.current.update({ count: 3 });
    });
    
    // Undo 3 times (but we should only be able to undo twice)
    act(() => {
      result.current.undo(); // to 2
      result.current.undo(); // to 1
      result.current.undo(); // should do nothing
    });
    
    // We should be at count: 1 as the first update is lost due to maxHistory
    expect(result.current.state).toEqual({ count: 1 });
    expect(result.current.canUndo).toBe(false);
  });

  it('should reset history', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useHistory(initialState));
    
    // Add updates
    act(() => {
      result.current.update({ count: 1 });
      result.current.update({ count: 2 });
    });
    
    // Reset
    act(() => {
      result.current.reset({ count: 10 });
    });
    
    expect(result.current.state).toEqual({ count: 10 });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
}); 