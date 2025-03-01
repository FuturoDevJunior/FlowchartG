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
  disabled?: boolean;
  isMobile?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  onAddConnector,
  onDelete,
  onExport,
  onShare,
  onSave,
  isConnecting,
  disabled = false,
  isMobile = false
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Only show tooltips on desktop
  const handleMouseEnter = (id: string) => {
    if (!isMobile) {
      setShowTooltip(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowTooltip(null);
    }
  };

  const Tooltip = ({ id, children }: { id: string, children: React.ReactNode }) => {
    if (showTooltip !== id || isMobile) return null;
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
        {children}
      </div>
    );
  };

  // Use smaller icons and more compact UI on mobile
  const iconSize = isMobile ? 18 : 20;
  const buttonClass = `text-white hover:bg-gray-700 ${isMobile ? 'px-1.5 py-1' : ''}`;

  return (
    <div className={`bg-[#1A1A1A] ${isMobile ? 'p-1' : 'p-2'} flex flex-wrap items-center justify-between border-b border-gray-700`}>
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('rectangle')}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('rect')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Square size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Retângulo</span>
          </Button>
          <Tooltip id="rect">Adicionar retângulo</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('circle')}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('circle')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Circle size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Círculo</span>
          </Button>
          <Tooltip id="circle">Adicionar círculo</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onAddNode('diamond')}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('diamond')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Diamond size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Losango</span>
          </Button>
          <Tooltip id="diamond">Adicionar losango</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onAddConnector}
            className={`${buttonClass} ${isConnecting ? 'bg-green-800' : ''}`}
            onMouseEnter={() => handleMouseEnter('connect')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Link size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Conectar</span>
          </Button>
          <Tooltip id="connect">{isConnecting ? 'Clique em dois nós para conectar' : 'Conectar dois nós'}</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onDelete}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('delete')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Trash2 size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Apagar</span>
          </Button>
          <Tooltip id="delete">Apagar selecionados</Tooltip>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => onExport('png')}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('export')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Download size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Exportar</span>
          </Button>
          <Tooltip id="export">Exportar como PNG</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            onClick={onShare}
            className={buttonClass}
            onMouseEnter={() => handleMouseEnter('share')}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            <Share2 size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Compartilhar</span>
          </Button>
          <Tooltip id="share">Compartilhar via URL</Tooltip>
        </div>
        
        <div className="relative">
          <Button
            variant="primary"
            onClick={() => {
              onSave();
              if (!isMobile) {
                setShowTooltip('saved');
                setTimeout(() => setShowTooltip(null), 2000);
              }
            }}
            onMouseEnter={() => handleMouseEnter('save')}
            onMouseLeave={() => showTooltip !== 'saved' && handleMouseLeave()}
            disabled={disabled}
          >
            <Save size={iconSize} className={isMobile ? '' : 'mr-1'} />
            <span className={`${isMobile ? 'hidden' : 'hidden sm:inline'}`}>Salvar</span>
          </Button>
          <Tooltip id="save">Salvar localmente</Tooltip>
          <Tooltip id="saved">✓ Salvo com sucesso!</Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;