
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Plus, X } from 'lucide-react';
import { AddMuscleGroupPanel } from './AddMuscleGroupPanel';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseName: string, muscleGroup: string) => void;
  onBack: () => void;
}

const MUSCLE_GROUPS = {
  chest: {
    name: 'Chest',
    exercises: ['Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Flyes', 'Push-ups', 'Chest Dips', 'Cable Crossover'],
    isCustom: false
  },
  back: {
    name: 'Back',
    exercises: ['Pull-ups', 'Lat Pulldown', 'Barbell Rows', 'Dumbbell Rows', 'Deadlifts', 'T-Bar Rows', 'Cable Rows'],
    isCustom: false
  },
  shoulders: {
    name: 'Shoulders',
    exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Arnold Press', 'Upright Rows', 'Shrugs'],
    isCustom: false
  },
  arms: {
    name: 'Arms',
    exercises: ['Bicep Curls', 'Hammer Curls', 'Tricep Dips', 'Close-Grip Bench Press', 'Preacher Curls', 'Tricep Extensions', 'Cable Curls'],
    isCustom: false
  },
  legs: {
    name: 'Legs',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Curls', 'Leg Extensions', 'Calf Raises', 'Romanian Deadlifts'],
    isCustom: false
  },
  core: {
    name: 'Core',
    exercises: ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Leg Raises', 'Dead Bugs', 'Bicycle Crunches'],
    isCustom: false
  }
};

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onSelectExercise,
  onBack
}) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [muscleGroups, setMuscleGroups] = useState(MUSCLE_GROUPS);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    groupKey: string;
    groupName: string;
  }>({
    isOpen: false,
    groupKey: '',
    groupName: ''
  });

  const handleMuscleGroupSelect = (groupKey: string) => {
    if (groupKey === 'add-muscle-group') {
      setIsAddPanelOpen(true);
      return;
    }
    setSelectedMuscleGroup(groupKey);
  };

  const handleExerciseSelect = (exerciseName: string) => {
    if (selectedMuscleGroup) {
      onSelectExercise(exerciseName, muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].name);
    }
  };

  const handleBack = () => {
    if (selectedMuscleGroup) {
      setSelectedMuscleGroup(null);
    } else {
      onBack();
    }
  };

  const handleAddMuscleGroup = (name: string, exercises: string[]) => {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    setMuscleGroups({
      ...muscleGroups,
      [key]: {
        name,
        exercises,
        isCustom: true
      }
    });
  };

  const handleDeleteMuscleGroup = (groupKey: string) => {
    const { [groupKey]: deleted, ...remaining } = muscleGroups;
    setMuscleGroups(remaining);
    setDeleteDialog({ isOpen: false, groupKey: '', groupName: '' });
  };

  const openDeleteDialog = (groupKey: string, groupName: string) => {
    setDeleteDialog({ isOpen: true, groupKey, groupName });
  };

  return (
    <div className="min-h-screen text-white p-6 animate-[slide-in-right_0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={handleBack} className="p-2 rounded-xl bg-white/10 border border-white/20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-purple-200">
            {selectedMuscleGroup ? muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].name : 'Select Exercise'}
          </h1>
          <p className="text-purple-300 text-sm">
            {selectedMuscleGroup ? 'Choose an exercise' : 'Choose a muscle group first'}
          </p>
        </div>
      </div>

      {/* Muscle Groups */}
      {!selectedMuscleGroup && (
        <div className="space-y-3">
          {Object.entries(muscleGroups).map(([key, group]) => (
            <button
              key={key}
              onClick={() => handleMuscleGroupSelect(key)}
              className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-left border border-white/10 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">{group.name}</h3>
                  <p className="text-white/60 text-sm">{group.exercises.length} exercises</p>
                </div>
                <div className="flex items-center space-x-2">
                  {group.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(key, group.name);
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <ChevronRight className="w-6 h-6 text-white/40" />
                </div>
              </div>
            </button>
          ))}
          
          {/* Add Muscle Group Button */}
          <button
            onClick={() => handleMuscleGroupSelect('add-muscle-group')}
            className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-left border-2 border-dashed border-white/20 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-white">+ Add Muscle Group</h3>
                <p className="text-white/50 text-sm">Create a custom muscle group</p>
              </div>
              <Plus className="w-6 h-6 text-white/40" />
            </div>
          </button>
        </div>
      )}

      {/* Exercises */}
      {selectedMuscleGroup && (
        <div className="space-y-3 animate-[fade-in_0.4s_ease-out]">
          {muscleGroups[selectedMuscleGroup as keyof typeof muscleGroups].exercises.map((exercise) => (
            <button
              key={exercise}
              onClick={() => handleExerciseSelect(exercise)}
              className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/10 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-white">{exercise}</span>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add Muscle Group Panel */}
      <AddMuscleGroupPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        onSave={handleAddMuscleGroup}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, groupKey: '', groupName: '' })}
        onConfirm={() => handleDeleteMuscleGroup(deleteDialog.groupKey)}
        title="Delete Muscle Group"
        message={`Are you sure you want to delete "${deleteDialog.groupName}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};
