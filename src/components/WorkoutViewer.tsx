
import React, { useState } from 'react';
import { Workout } from './WorkoutApp';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { WorkoutHeader } from './workout-viewer/WorkoutHeader';
import { WorkoutTimesCard } from './workout-viewer/WorkoutTimesCard';
import { WorkoutStatsCard } from './workout-viewer/WorkoutStatsCard';
import { ExerciseCard } from './workout-viewer/ExerciseCard';

interface WorkoutViewerProps {
  workout: Workout;
  onBack: () => void;
  onUpdateWorkout: (workout: Workout) => void;
}

export const WorkoutViewer: React.FC<WorkoutViewerProps> = ({
  workout,
  onBack,
  onUpdateWorkout
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'set' | 'exercise';
    exerciseId?: string;
    setId?: string;
  }>({
    isOpen: false,
    type: 'set'
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const addSet = (exerciseId: string) => {
    const newSet = {
      id: Date.now().toString(),
      weight: 0,
      reps: 0,
      notes: '',
      completed: false
    };
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => ex.id === exerciseId ? {
        ...ex,
        sets: [...ex.sets, newSet]
      } : ex)
    };
    updateWorkoutStats(updatedWorkout);
  };

  const updateSet = (exerciseId: string, setId: string, field: string, value: any) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => ex.id === exerciseId ? {
        ...ex,
        sets: ex.sets.map(set => set.id === setId ? {
          ...set,
          [field]: value
        } : set)
      } : ex)
    };
    updateWorkoutStats(updatedWorkout);
  };

  const updateWorkoutStats = (updatedWorkout: Workout) => {
    const totalSets = updatedWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalWeight = updatedWorkout.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0), 0);
    
    const finalWorkout = {
      ...updatedWorkout,
      totalSets,
      totalWeight
    };
    
    // Always call onUpdateWorkout to ensure changes propagate to the parent
    onUpdateWorkout(finalWorkout);
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => ex.id === exerciseId ? {
        ...ex,
        sets: ex.sets.filter(set => set.id !== setId)
      } : ex)
    };
    updateWorkoutStats(updatedWorkout);
    setDeleteDialog({
      isOpen: false,
      type: 'set'
    });
  };

  const deleteExercise = (exerciseId: string) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
    };
    updateWorkoutStats(updatedWorkout);
    setDeleteDialog({
      isOpen: false,
      type: 'exercise'
    });
  };

  const openDeleteDialog = (type: 'set' | 'exercise', exerciseId: string, setId?: string) => {
    setDeleteDialog({
      isOpen: true,
      type,
      exerciseId,
      setId
    });
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    openDeleteDialog('set', exerciseId, setId);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    openDeleteDialog('exercise', exerciseId);
  };

  // Enhanced update handler that ensures proper propagation
  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    updateWorkoutStats(updatedWorkout);
  };

  return (
    <div className="min-h-screen text-white flex flex-col animate-slide-in-right">
      <WorkoutHeader onBack={onBack} workoutDate={formatDate(workout.startTime)} />

      <WorkoutTimesCard workout={workout} onUpdateWorkout={handleWorkoutUpdate} />

      <WorkoutStatsCard workout={workout} />

      {/* Scrollable Exercises */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-3">
          {workout.exercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onUpdateSet={updateSet} 
              onAddSet={addSet} 
              onDeleteExercise={handleDeleteExercise} 
              onDeleteSet={handleDeleteSet} 
            />
          ))}
        </div>

        {workout.exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-200 mb-2">No exercises recorded</p>
            <p className="text-blue-300 text-sm">This workout has no exercises.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        isOpen={deleteDialog.isOpen} 
        onClose={() => setDeleteDialog({ isOpen: false, type: 'set' })} 
        onConfirm={() => {
          if (deleteDialog.type === 'set' && deleteDialog.exerciseId && deleteDialog.setId) {
            deleteSet(deleteDialog.exerciseId, deleteDialog.setId);
          } else if (deleteDialog.type === 'exercise' && deleteDialog.exerciseId) {
            deleteExercise(deleteDialog.exerciseId);
          }
        }} 
        title={deleteDialog.type === 'set' ? 'Delete Set' : 'Delete Exercise'} 
        message={deleteDialog.type === 'set' ? 'Are you sure you want to delete this set? This action cannot be undone.' : 'Are you sure you want to delete this exercise? This will remove all sets and cannot be undone.'} 
        confirmText={deleteDialog.type === 'set' ? 'Delete Set' : 'Delete Exercise'} 
      />
    </div>
  );
};
