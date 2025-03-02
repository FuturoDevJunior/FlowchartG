import { FlowchartData } from '../types';

interface HistoryState {
  data: FlowchartData;
  timestamp: number;
}

export class HistoryManager {
  private states: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxStates: number = 50; // Limit history to prevent memory issues
  
  /**
   * Add a new state to the history
   */
  public pushState(data: FlowchartData): void {
    // If we're not at the end of the history, truncate it
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }
    
    // Add new state
    this.states.push({
      data: this.deepClone(data),
      timestamp: Date.now()
    });
    
    // Update current index
    this.currentIndex = this.states.length - 1;
    
    // Enforce maximum history size
    if (this.states.length > this.maxStates) {
      this.states.shift();
      this.currentIndex--;
    }
  }
  
  /**
   * Go back to the previous state
   */
  public undo(): FlowchartData | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.deepClone(this.states[this.currentIndex].data);
    }
    return null;
  }
  
  /**
   * Go forward to the next state
   */
  public redo(): FlowchartData | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.deepClone(this.states[this.currentIndex].data);
    }
    return null;
  }
  
  /**
   * Check if undo is available
   */
  public canUndo(): boolean {
    return this.currentIndex > 0;
  }
  
  /**
   * Check if redo is available
   */
  public canRedo(): boolean {
    return this.currentIndex < this.states.length - 1;
  }
  
  /**
   * Get current state
   */
  public getCurrentState(): FlowchartData | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.states.length) {
      return this.deepClone(this.states[this.currentIndex].data);
    }
    return null;
  }
  
  /**
   * Reset history
   */
  public clear(): void {
    this.states = [];
    this.currentIndex = -1;
  }
  
  /**
   * Deep clone an object to avoid reference issues
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
} 