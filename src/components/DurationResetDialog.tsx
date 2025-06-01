
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface DurationResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentDuration: string;
}

export const DurationResetDialog: React.FC<DurationResetDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentDuration
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose} 
      />
      
      {/* Dialog */}
      <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-t-3xl p-6 w-full max-w-md mx-4 mb-0 transform transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500/20 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-2 text-orange-400">Reset Duration Timer?</h3>
          <p className="text-slate-200 text-sm mb-2">
            Changing the start time will reset your duration timer.
          </p>
          
          <div className="bg-white/5 rounded-lg p-3 mb-6 border border-white/10">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white font-mono text-lg">{currentDuration}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Current duration will be lost</p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-white/10 text-white border border-white/20 rounded-xl py-3 font-medium hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 bg-orange-500/80 text-white rounded-xl py-3 font-medium hover:bg-orange-500 transition-colors"
            >
              Reset Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
