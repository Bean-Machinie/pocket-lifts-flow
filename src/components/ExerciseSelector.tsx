import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Plus, X } from 'lucide-react';
import { AddMuscleGroupPanel } from './AddMuscleGroupPanel';
import { AddExercisePanel } from './AddExercisePanel';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseName: string, muscleGroup: string) => void;
  onBack: () => void;
}

interface MuscleGroup {
  name: string;
  exercises: string[];
  isCustom: boolean;
}

type MuscleGroups = Record<string, MuscleGroup>;

const MUSCLE_GROUPS: MuscleGroups = {
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

// Load saved muscle groups from localStorage
const loadMuscleGroups = (): MuscleGroups => {
  try {
    const saved = localStorage.getItem('customMuscleGroups');
    const savedExercises = localStorage.getItem('customExercises');
    
    let groups = { ...MUSCLE_GROUPS };
    
    if (saved) {
      const customGroups = JSON.parse(saved);
      groups = { ...groups, ...customGroups };
    }
    
    if (savedExercises) {
      const customExercises = JSON.parse(savedExercises);
      Object.keys(customExercises).forEach(groupKey => {
        if (groups[groupKey]) {
          groups[groupKey].exercises = [...new Set([...groups[groupKey].exercises, ...customExercises[groupKey]])];
        }
      });
    }
    
    return groups;
  } catch (error) {
    console.error('Error loading muscle groups:', error);
  }
  return MUSCLE_GROUPS;
};

// Save custom muscle groups to localStorage
const saveCustomMuscleGroups = (muscleGroups: MuscleGroups) => {
  try {
    const customGroups: MuscleGroups = {};
    const customExercises: Record<string, string[]> = {};
    
    Object.entries(muscleGroups).forEach(([key, group]) => {
      if (group.isCustom) {
        customGroups[key] = group;
      } else {
        // For built-in groups, save only the custom exercises
        const originalExercises = MUSCLE_GROUPS[key]?.exercises || [];
        const addedExercises = group.exercises.filter(exercise => !originalExercises.includes(exercise));
        if (addedExercises.length > 0) {
          customExercises[key] = addedExercises;
        }
      }
    });
    
    localStorage.setItem('customMuscleGroups', JSON.stringify(customGroups));
    localStorage.setItem('customExercises', JSON.stringify(customExercises));
  } catch (error) {
    console.error('Error saving muscle groups:', error);
  }
};

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onSelectExercise,
  onBack
}) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroups>(loadMuscleGroups);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    groupKey: string;
    groupName: string;
    exerciseName?: string;
    type: 'group' | 'exercise';
  }>({
    isOpen: false,
    groupKey: '',
    groupName: '',
    type: 'group'
  });

  const handleMuscleGroupSelect = (groupKey: string) => {
    if (groupKey === 'add-muscle-group') {
      setIsAddPanelOpen(true);
      return;
    }
    setSelectedMuscleGroup(groupKey);
  };

  const handleExerciseSelect = (exerciseName: string) => {
    if (selectedMuscleGroup && muscleGroups[selectedMuscleGroup]) {
      onSelectExercise(exerciseName, muscleGroups[selectedMuscleGroup].name);
    }
  };

  const handleBack = () => {
    if (selectedMuscleGroup) {
      setSelectedMuscleGroup(null);
    } else {
      onBack();
    }
  };

  const handleAddMuscleGroup = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    const updatedGroups = {
      ...muscleGroups,
      [key]: {
        name,
        exercises: [],
        isCustom: true
      }
    };
    setMuscleGroups(updatedGroups);
    saveCustomMuscleGroups(updatedGroups);
  };

  const handleAddExercise = (exerciseName: string) => {
    if (selectedMuscleGroup && muscleGroups[selectedMuscleGroup]) {
      const updatedGroups = {
        ...muscleGroups,
        [selectedMuscleGroup]: {
          ...muscleGroups[selectedMuscleGroup],
          exercises: [...muscleGroups[selectedMuscleGroup].exercises, exerciseName]
        }
      };
      setMuscleGroups(updatedGroups);
      saveCustomMuscleGroups(updatedGroups);
    }
  };

  const handleDeleteMuscleGroup = (groupKey: string) => {
    const { [groupKey]: deleted, ...remaining } = muscleGroups;
    setMuscleGroups(remaining);
    saveCustomMuscleGroups(remaining);
    setDeleteDialog({ isOpen: false, groupKey: '', groupName: '', type: 'group' });
  };

  const handleDeleteExercise = (groupKey: string, exerciseName: string) => {
    const updatedGroups = {
      ...muscleGroups,
      [groupKey]: {
        ...muscleGroups[groupKey],
        exercises: muscleGroups[groupKey].exercises.filter(exercise => exercise !== exerciseName)
      }
    };
    setMuscleGroups(updatedGroups);
    saveCustomMuscleGroups(updatedGroups);
    setDeleteDialog({ isOpen: false, groupKey: '', groupName: '', type: 'exercise' });
  };

  const openDeleteDialog = (groupKey: string, groupName: string, exerciseName?: string) => {
    setDeleteDialog({ 
      isOpen: true, 
      groupKey, 
      groupName, 
      exerciseName,
      type: exerciseName ? 'exercise' : 'group'
    });
  };

  const isCustomExercise = (groupKey: string, exerciseName: string) => {
    const originalExercises = MUSCLE_GROUPS[groupKey]?.exercises || [];
    return !originalExercises.includes(exerciseName);
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
            {selectedMuscleGroup ? muscleGroups[selectedMuscleGroup]?.name : 'Select Exercise'}
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
              className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left border border-white/10 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">{group.name}</h3>
                  <p className="text-white/60 text-xs">{group.exercises.length} exercises</p>
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
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </div>
            </button>
          ))}
          
          {/* Add Muscle Group Button */}
          <button
            onClick={() => handleMuscleGroupSelect('add-muscle-group')}
            className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left border-2 border-dashed border-white/20 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">+ Add Muscle Group</h3>
                <p className="text-white/50 text-xs">Create a custom muscle group</p>
              </div>
              <Plus className="w-5 h-5 text-white/40" />
            </div>
          </button>
        </div>
      )}

      {/* Exercises */}
      {selectedMuscleGroup && muscleGroups[selectedMuscleGroup] && (
        <div className="space-y-3 animate-[fade-in_0.4s_ease-out]">
          {muscleGroups[selectedMuscleGroup].exercises.map((exercise) => (
            <button
              key={exercise}
              onClick={() => handleExerciseSelect(exercise)}
              className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/10 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-white">{exercise}</span>
                <div className="flex items-center space-x-2">
                  {isCustomExercise(selectedMuscleGroup, exercise) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(selectedMuscleGroup, muscleGroups[selectedMuscleGroup].name, exercise);
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </button>
          ))}
          
          {/* Add Exercise Button */}
          <button
            onClick={() => setIsAddExerciseOpen(true)}
            className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-left border-2 border-dashed border-white/20 transform transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-white">+ Add Exercise</span>
              <Plus className="w-5 h-5 text-white/40" />
            </div>
          </button>
        </div>
      )}

      {/* Add Muscle Group Panel */}
      <AddMuscleGroupPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        onSave={handleAddMuscleGroup}
      />

      {/* Add Exercise Panel */}
      <AddExercisePanel
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        onSave={handleAddExercise}
        muscleGroupName={selectedMuscleGroup ? muscleGroups[selectedMuscleGroup]?.name : ''}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, groupKey: '', groupName: '', type: 'group' })}
        onConfirm={() => {
          if (deleteDialog.type === 'exercise' && deleteDialog.exerciseName) {
            handleDeleteExercise(deleteDialog.groupKey, deleteDialog.exerciseName);
          } else {
            handleDeleteMuscleGroup(deleteDialog.groupKey);
          }
        }}
        title={deleteDialog.type === 'exercise' ? 'Delete Exercise' : 'Delete Muscle Group'}
        message={
          deleteDialog.type === 'exercise' 
            ? `Are you sure you want to delete "${deleteDialog.exerciseName}"? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteDialog.groupName}"? This action cannot be undone.`
        }
        confirmText={deleteDialog.type === 'exercise' ? 'Delete Exercise' : 'Delete Muscle Group'}
      />
    </div>
  );
};
