import { useState, useCallback } from 'react';

/**
 * Custom hook for managing state history (undo/redo functionality)
 * @param initialState Initial state
 * @param maxHistory Maximum number of states to keep in history
 */
function useHistory<T>(initialState: T, maxHistory = 20) {
  // Current state
  const [state, setState] = useState<T>(initialState);
  
  // History stack - past states
  const [past, setPast] = useState<T[]>([]);
  
  // Future stack - undone states that can be redone
  const [future, setFuture] = useState<T[]>([]);

  // Update state and add to history
  const update = useCallback((newState: T | ((prevState: T) => T)) => {
    setState((currentState) => {
      // Calculate the new state
      const updatedState = typeof newState === 'function' 
        ? (newState as ((prevState: T) => T))(currentState)
        : newState;

      // Only update history if the state actually changed
      if (JSON.stringify(currentState) !== JSON.stringify(updatedState)) {
        // Add current state to past
        setPast(prev => {
          const newPast = [...prev, currentState];
          // Limit history size
          if (newPast.length > maxHistory) {
            return newPast.slice(1);
          }
          return newPast;
        });
        
        // Clear future when a new action is taken
        setFuture([]);
      }

      return updatedState;
    });
  }, [maxHistory]);

  // Undo - go back to previous state
  const undo = useCallback(() => {
    if (past.length === 0) return;

    // Get the last state from past
    const previous = past[past.length - 1];
    
    // Remove the last state from past
    setPast(prev => prev.slice(0, prev.length - 1));
    
    // Save current state to future
    setFuture(prev => [...prev, state]);
    
    // Set the state to the previous one
    setState(previous);
  }, [past, state]);

  // Redo - go forward to a previously undone state
  const redo = useCallback(() => {
    if (future.length === 0) return;

    // Get the last state from future
    const next = future[future.length - 1];
    
    // Remove the last state from future
    setFuture(prev => prev.slice(0, prev.length - 1));
    
    // Save current state to past
    setPast(prev => [...prev, state]);
    
    // Set the state to the next one
    setState(next);
  }, [future, state]);

  // Check if undo/redo are available
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Clear all history
  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);
  
  // Reset state and history
  const reset = useCallback((newState: T) => {
    setState(newState);
    setPast([]);
    setFuture([]);
  }, []);

  return {
    state,
    update,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    reset,
    history: {
      past,
      future,
    },
  };
}

export default useHistory; 