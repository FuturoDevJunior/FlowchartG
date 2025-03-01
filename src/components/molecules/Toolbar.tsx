import React, { useState } from 'react';
import { Square, Circle, Diamond, Link, Download, Share2, Trash2, Save, Info } from 'lucide-react';
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
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const Tooltip = ({ id, children }: { id: string, children: React.ReactNode }) => {
    if (showTooltip !== id) return null;
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
        {children}
      </div>
    );
  };

  return (
    <div className="bg-[#1A1A1A] p-2 flex flex-wrap items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('rectangle')}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('rect')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Square size={20} className="mr-1" />
            <span className="hidden sm:inline">Retângulo</span>
          </Button>
          <Tooltip id="rect">Adicionar retângulo</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('circle')}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('circle')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Circle size={20} className="mr-1" />
            <span className="hidden sm:inline">Círculo</span>
          </Button>
          <Tooltip id="circle">Adicionar círculo</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('diamond')}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('diamond')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Diamond size={20} className="mr-1" />
            <span className="hidden sm:inline">Losango</span>
          </Button>
          <Tooltip id="diamond">Adicionar losango</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onAddConnector}
            className={`text-white hover:bg-gray-700 ${isConnecting ? 'bg-green-800' : ''}`}
            onMouseEnter={() => setShowTooltip('connect')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Link size={20} className="mr-1" />
            <span className="hidden sm:inline">Conectar</span>
          </Button>
          <Tooltip id="connect">{isConnecting ? 'Clique em dois nós para conectar' : 'Conectar dois nós'}</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onDelete}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('delete')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Trash2 size={20} className="mr-1" />
            <span className="hidden sm:inline">Apagar</span>
          </Button>
          <Tooltip id="delete">Apagar selecionados</Tooltip>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onExport('png')}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('export')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Download size={20} className="mr-1" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Tooltip id="export">Exportar como PNG</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onShare}
            className="text-white hover:bg-gray-700"
            onMouseEnter={() => setShowTooltip('share')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Share2 size={20} className="mr-1" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <Tooltip id="share">Compartilhar via URL</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="primary"
            onClick={() => {
              onSave();
              setShowTooltip('saved');
              setTimeout(() => setShowTooltip(null), 2000);
            }}
            onMouseEnter={() => setShowTooltip('save')}
            onMouseLeave={() => showTooltip !== 'saved' && setShowTooltip(null)}
          >
            <Save size={20} className="mr-1" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
          <Tooltip id="save">Salvar localmente</Tooltip>
          <Tooltip id="saved">✓ Salvo com sucesso!</Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;