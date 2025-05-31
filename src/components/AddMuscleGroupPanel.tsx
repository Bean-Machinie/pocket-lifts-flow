
import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface AddMuscleGroupPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, exercises: string[]) => void;
}

export const AddMuscleGroupPanel: React.FC<AddMuscleGroupPanelProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        setGroupName('');
        setExercises(['']);
      }, 300);
    }
  }, [isOpen]);

  const addExerciseField = () => {
    setExercises([...exercises, '']);
  };

  const updateExercise = (index: number, value: string) => {
    const updated = [...exercises];
    updated[index] = value;
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (groupName.trim() && exercises.some(ex => ex.trim())) {
      const validExercises = exercises.filter(ex => ex.trim());
      onSave(groupName.trim(), validExercises);
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
            <h3 className="text-lg font-semibold text-white mb-4">Add Muscle Group</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-purple-200 text-sm mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter muscle group name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">Exercises</label>
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={exercise}
                        onChange={(e) => updateExercise(index, e.target.value)}
                        placeholder="Enter exercise name"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/50"
                      />
                      {exercises.length > 1 && (
                        <button
                          onClick={() => removeExercise(index)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addExerciseField}
                    className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Exercise</span>
                  </button>
                </div>
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
