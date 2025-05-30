import React, { useState } from 'react';
import { ArrowLeft, Clock, Edit3, Hash, Plus, X } from 'lucide-react';
import { Workout, Exercise } from './WorkoutApp';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

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
  const [isEditingStartTime, setIsEditingStartTime] = useState(false);
  const [isEditingEndTime, setIsEditingEndTime] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'set' | 'exercise';
    exerciseId?: string;
    setId?: string;
  }>({ isOpen: false, type: 'set' });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const updateStartTime = () => {
    if (!customStartTime) return;

    const [hours, minutes] = customStartTime.split(':');
    const newStartTime = new Date(workout.startTime);
    newStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const updatedWorkout = {
      ...workout,
      startTime: newStartTime
    };

    onUpdateWorkout(updatedWorkout);
    setIsEditingStartTime(false);
    setCustomStartTime('');
  };

  const updateEndTime = () => {
    if (!customEndTime) return;

    const [hours, minutes] = customEndTime.split(':');
    const endTime = new Date(workout.startTime);
    endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Calculate new duration
    const newDuration = Math.floor((endTime.getTime() - workout.startTime.getTime()) / 1000);
    
    const updatedWorkout = {
      ...workout,
      duration: Math.max(0, newDuration) // Ensure duration is not negative
    };

    onUpdateWorkout(updatedWorkout);
    setIsEditingEndTime(false);
    setCustomEndTime('');
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
      exercises: workout.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    };

    updateWorkoutStats(updatedWorkout);
  };

  const updateSet = (exerciseId: string, setId: string, field: string, value: any) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId 
                  ? { ...set, [field]: value }
                  : set
              )
            }
          : ex
      )
    };

    updateWorkoutStats(updatedWorkout);
  };

  const updateWorkoutStats = (updatedWorkout: Workout) => {
    const totalSets = updatedWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalWeight = updatedWorkout.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0
    );

    const finalWorkout = {
      ...updatedWorkout,
      totalSets,
      totalWeight
    };

    onUpdateWorkout(finalWorkout);
  };

  const getEndTime = () => {
    const endTime = new Date(workout.startTime.getTime() + (workout.duration * 1000));
    return endTime;
  };

  const deleteSet = (exerciseId: string, setId: string) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    };

    updateWorkoutStats(updatedWorkout);
    setDeleteDialog({ isOpen: false, type: 'set' });
  };

  const deleteExercise = (exerciseId: string) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
    };

    updateWorkoutStats(updatedWorkout);
    setDeleteDialog({ isOpen: false, type: 'exercise' });
  };

  const openDeleteDialog = (type: 'set' | 'exercise', exerciseId: string, setId?: string) => {
    setDeleteDialog({ isOpen: true, type, exerciseId, setId });
  };

  return (
    <div className="min-h-screen text-white flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="bg-white/10 text-white p-2 rounded-xl border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-purple-200">Workout Details</h1>
            <p className="text-purple-200 text-sm">{formatDate(workout.startTime)}</p>
          </div>
        </div>
      </div>

      {/* Workout Times */}
      <div className="px-6 pb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-3">
          {/* Start Time */}
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Start Time</span>
            {isEditingStartTime ? (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={customStartTime}
                  onChange={(e) => setCustomStartTime(e.target.value)}
                  className="bg-white/20 rounded px-2 py-1 text-sm"
                />
                <button onClick={updateStartTime} className="text-green-400 text-sm">
                  Save
                </button>
                <button onClick={() => setIsEditingStartTime(false)} className="text-red-400 text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{formatTime(workout.startTime)}</span>
                <button onClick={() => {
                  setIsEditingStartTime(true);
                  setCustomStartTime(formatTime(workout.startTime));
                }}>
                  <Edit3 className="w-3 h-3 text-blue-400" />
                </button>
              </div>
            )}
          </div>

          {/* End Time */}
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">End Time</span>
            {isEditingEndTime ? (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                  className="bg-white/20 rounded px-2 py-1 text-sm"
                />
                <button onClick={updateEndTime} className="text-green-400 text-sm">
                  Save
                </button>
                <button onClick={() => setIsEditingEndTime(false)} className="text-red-400 text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{formatTime(getEndTime())}</span>
                <button onClick={() => {
                  setIsEditingEndTime(true);
                  setCustomEndTime(formatTime(getEndTime()));
                }}>
                  <Edit3 className="w-3 h-3 text-blue-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-6 pb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Duration - Centered at top */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-purple-400">{formatDuration(workout.duration)}</div>
            <div className="text-sm text-purple-200">Duration</div>
          </div>
          
          {/* Sets and Weight - Same row underneath */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{workout.totalSets}</div>
              <div className="text-xs text-blue-200">Total Sets</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{workout.totalWeight.toFixed(0)}kg</div>
              <div className="text-xs text-green-200">Total Weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Exercises */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-3">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 animate-scale-in relative">
              {/* Exercise delete button */}
              <button
                onClick={() => openDeleteDialog('exercise', exercise.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-3 pr-8">
                <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                <p className="text-purple-200 text-sm">{exercise.muscleGroup}</p>
              </div>

              {/* Sets */}
              <div className="space-y-2 mb-3">
                {exercise.sets.map((set, index) => (
                  <div key={set.id} className="bg-white/10 rounded-lg p-3 relative">
                    {/* Set delete button */}
                    <button
                      onClick={() => openDeleteDialog('set', exercise.id, set.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="flex items-center space-x-2 mb-3">
                      <Hash className="w-3 h-3 text-purple-400" />
                      <span className="text-xs font-medium text-purple-200">Set {index + 1}</span>
                    </div>
                    
                    {/* Weight, Reps, and Notes on same row */}
                    <div className="flex items-center space-x-3 pr-8">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          placeholder="0"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1"
                        />
                        <span className="text-xs text-gray-300">kg</span>
                      </div>
                      
                      <span className="text-gray-400">×</span>
                      
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          placeholder="0"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1"
                        />
                        <span className="text-xs text-gray-300">reps</span>
                      </div>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="notes..."
                          value={set.notes || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'notes', e.target.value)}
                          className="w-full bg-transparent text-white text-sm border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1 placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {exercise.sets.length === 0 && (
                  <p className="text-purple-300 text-sm text-center py-3">
                    No sets recorded for this exercise.
                  </p>
                )}
              </div>

              {/* Add Set Button */}
              <button
                onClick={() => addSet(exercise.id)}
                className="w-full bg-purple-600/30 text-purple-200 border border-purple-400/30 rounded-lg p-2.5 flex items-center justify-center space-x-2 hover:bg-purple-600/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium text-sm">Add Set</span>
              </button>
            </div>
          ))}
        </div>

        {workout.exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-200 mb-2">No exercises recorded</p>
            <p className="text-purple-300 text-sm">This workout has no exercises.</p>
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
        message={deleteDialog.type === 'set' 
          ? 'Are you sure you want to delete this set? This action cannot be undone.' 
          : 'Are you sure you want to delete this exercise? This will remove all sets and cannot be undone.'
        }
        confirmText={deleteDialog.type === 'set' ? 'Delete Set' : 'Delete Exercise'}
      />
    </div>
  );
};
