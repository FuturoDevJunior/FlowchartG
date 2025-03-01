import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import { Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareableLink: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareableLink,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Share Flowchart</h2>
        <p className="text-sm text-gray-600 mb-4">
          Anyone with this link can view your flowchart:
        </p>
        
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
          />
          <Button
            onClick={copyToClipboard}
            variant="primary"
            className="rounded-l-none"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </Button>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;