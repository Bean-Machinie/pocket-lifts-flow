
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddExercisePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exerciseName: string) => void;
  muscleGroupName: string;
}

export const AddExercisePanel: React.FC<AddExercisePanelProps> = ({
  isOpen,
  onClose,
  onSave,
  muscleGroupName
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [exerciseName, setExerciseName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        setExerciseName('');
      }, 300);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (exerciseName.trim()) {
      onSave(exerciseName.trim());
      onClose();
    }
  };

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
      
      {/* Panel */}
      <div className={`relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-t-3xl p-6 w-full max-w-md mx-4 mb-0 transform transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Add Exercise</h3>
            <p className="text-purple-300 text-sm mb-4">to {muscleGroupName}</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-purple-200 text-sm mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="Enter exercise name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 text-white border border-white/20 rounded-xl py-3 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-500/80 text-white rounded-xl py-3 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
