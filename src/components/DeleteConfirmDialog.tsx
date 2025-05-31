import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);
  if (!isVisible) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      {/* Dialog */}
      <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-t-3xl p-6 w-full max-w-md mx-4 mb-0 transform transition-all duration-300 ease-out ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {/* Close button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white-200 text-sm mb-6">{message}</p>
          
          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 bg-white/10 text-white border border-white/20 rounded-xl py-3 font-medium hover:bg-white/15 hover:scale-[1.02] relative">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 bg-red-500/80 text-white rounded-xl py-3 font-medium hover:bg-white/15 hover:scale-[1.02] relative">
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>;
};