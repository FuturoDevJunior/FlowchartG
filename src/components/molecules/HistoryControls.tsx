import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * Component for undo/redo controls
 */
const HistoryControls: React.FC<HistoryControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-1.5 rounded ${
          canUndo
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title="Desfazer (Ctrl+Z)"
        aria-label="Desfazer última ação"
        data-cy="undo-button"
      >
        <Undo2 size={16} />
      </button>
      
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-1.5 rounded ${
          canRedo
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title="Refazer (Ctrl+Y)"
        aria-label="Refazer ação"
        data-cy="redo-button"
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
};

export default HistoryControls; 