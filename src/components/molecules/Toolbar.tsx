import React from 'react';
import { Square, Circle, Diamond, Link, Download, Share2, Trash2, Save } from 'lucide-react';
import Button from '../atoms/Button';

interface ToolbarProps {
  onAddNode: (type: 'rectangle' | 'circle' | 'diamond') => void;
  onAddConnector: () => void;
  onDelete: () => void;
  onExport: (format: 'png' | 'svg') => void;
  onShare: () => void;
  onSave: () => void;
  isConnecting: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onAddConnector,
  onDelete,
  onExport,
  onShare,
  onSave,
  isConnecting,
}) => {
  return (
    <div className="bg-[#2A2A2A] p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => onAddNode('rectangle')}
          className="text-white hover:bg-gray-700"
        >
          <Square size={20} className="mr-1" />
          <span className="hidden sm:inline">Rectangle</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onAddNode('circle')}
          className="text-white hover:bg-gray-700"
        >
          <Circle size={20} className="mr-1" />
          <span className="hidden sm:inline">Circle</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onAddNode('diamond')}
          className="text-white hover:bg-gray-700"
        >
          <Diamond size={20} className="mr-1" />
          <span className="hidden sm:inline">Diamond</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={onAddConnector}
          className={`text-white hover:bg-gray-700 ${isConnecting ? 'bg-gray-700' : ''}`}
        >
          <Link size={20} className="mr-1" />
          <span className="hidden sm:inline">Connect</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={onDelete}
          className="text-white hover:bg-gray-700"
        >
          <Trash2 size={20} className="mr-1" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => onExport('png')}
          className="text-white hover:bg-gray-700"
        >
          <Download size={20} className="mr-1" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={onShare}
          className="text-white hover:bg-gray-700"
        >
          <Share2 size={20} className="mr-1" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        
        <Button
          variant="primary"
          onClick={onSave}
        >
          <Save size={20} className="mr-1" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;