import React, { useState, useEffect, useRef } from 'react';
import { Plus, Clock, ArrowLeft, Hash, X } from 'lucide-react';
import { Workout, Exercise } from './WorkoutApp';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { useSettings } from '@/contexts/SettingsContext';
interface ActiveWorkoutProps {
  workout: Workout | null;
  onUpdateWorkout: (workout: Workout) => void;
  onEndWorkout: () => void;
  onAddExercise: () => void;
  onBack: () => void;
}
export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workout,
  onUpdateWorkout,
  onEndWorkout,
  onAddExercise,
  onBack
}) => {
  const {
    settings
  } = useSettings();
  const [duration, setDuration] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'set' | 'exercise';
    exerciseId?: string;
    setId?: string;
  }>({
    isOpen: false,
    type: 'set'
  });
  const [lastAddedSetId, setLastAddedSetId] = useState<string | null>(null);
  const [lastAddedExerciseId, setLastAddedExerciseId] = useState<string | null>(null);
  const weightInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const exerciseRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});
  const setRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  // Calculate duration based on start time, not from workout.duration
  useEffect(() => {
    if (!workout) return;
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - workout.startTime.getTime()) / 1000);
      setDuration(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [workout?.startTime]); // Only depend on startTime, not the entire workout

  useEffect(() => {
    if (lastAddedSetId && weightInputRefs.current[lastAddedSetId]) {
      const inputElement = weightInputRefs.current[lastAddedSetId];
      const setElement = setRefs.current[lastAddedSetId];
      setTimeout(() => {
        // Smooth scroll to the set
        if (setElement) {
          setElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }

        // Focus and select the weight input after scrolling
        setTimeout(() => {
          inputElement?.focus();
          inputElement?.select();
        }, 300);
      }, 100);
      setLastAddedSetId(null);
    }
  }, [lastAddedSetId, workout?.exercises]);
  useEffect(() => {
    if (lastAddedExerciseId && exerciseRefs.current[lastAddedExerciseId]) {
      const exerciseElement = exerciseRefs.current[lastAddedExerciseId];
      setTimeout(() => {
        exerciseElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 200);
      setLastAddedExerciseId(null);
    }
  }, [lastAddedExerciseId, workout?.exercises]);
  useEffect(() => {
    if (workout?.exercises && workout.exercises.length > 0) {
      const lastExercise = workout.exercises[workout.exercises.length - 1];
      if (lastExercise && !lastAddedExerciseId) {
        setLastAddedExerciseId(lastExercise.id);
      }
    }
  }, [workout?.exercises?.length]);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  const formatWeight = (weight: number) => {
    if (settings.weightUnit === 'lbs') {
      return (weight * 2.20462).toFixed(1);
    }
    return weight.toFixed(1);
  };
  const formatTotalWeight = (weight: number) => {
    if (settings.weightUnit === 'lbs') {
      return `${(weight * 2.20462).toFixed(0)}${settings.weightUnit}`;
    }
    return `${weight.toFixed(0)}${settings.weightUnit}`;
  };
  const updateStartTime = (newTime: string) => {
    if (!workout || !newTime) return;
    const [hours, minutes] = newTime.split(':');
    const newStartTime = new Date(workout.startTime);
    newStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const updatedWorkout = {
      ...workout,
      startTime: newStartTime
    };
    onUpdateWorkout(updatedWorkout);
  };
  const handleEndWorkout = () => {
    if (!workout) return;

    // Save the current live duration to the workout before ending
    const finalWorkout = {
      ...workout,
      duration: duration // Use the live duration from state
    };
    onUpdateWorkout(finalWorkout);
    onEndWorkout();
  };
  const addSet = (exerciseId: string) => {
    if (!workout) return;
    const newSetId = Date.now().toString();
    const newSet = {
      id: newSetId,
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
    setLastAddedSetId(newSetId);
  };
  const updateSet = (exerciseId: string, setId: string, field: string, value: any) => {
    if (!workout) return;
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
    const totalWeight = updatedWorkout.exercises.reduce((sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0), 0);
    const finalWorkout = {
      ...updatedWorkout,
      totalSets,
      totalWeight,
      duration // Use the live duration, not recalculated
    };
    onUpdateWorkout(finalWorkout);
  };
  const deleteSet = (exerciseId: string, setId: string) => {
    if (!workout) return;
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
    if (!workout) return;
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
  if (!workout) return null;
  return <div className="min-h-screen text-white flex flex-col animate-slide-in-right">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-800/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center p-6 bg-purple-600 dark:bg-slate-800">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="bg-white/10 text-white p-2 rounded-xl border border-white/20">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-200">Active Workout</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm">{formatDate(workout.startTime)}</span>
                <span className="text-blue-300 text-sm">•</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-blue-300 text-sm hover:text-blue-200 transition-colors">
                      {formatTime(workout.startTime)}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 bg-gray-800 border-gray-600">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Start time</label>
                      <Input type="time" value={formatTime(workout.startTime)} onChange={e => updateStartTime(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <button onClick={handleEndWorkout} className="bg-green-500/20 text-green-400 p-2 rounded-xl border border-green-400/30 flex items-center space-x-2">
            <span className="text-sm font-medium">Finish</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {/* Stats Card - Now scrollable */}
        <div className="mt-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {/* Duration - Centered at top with white color */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-slate-200">{formatDuration(duration)}</div>
              <div className="text-sm text-slate-200">Duration</div>
            </div>
            
            {/* Nr. Exercises, Total Sets, Total Weight - Three columns in this order */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{workout.exercises.length}</div>
                <div className="text-xs text-orange-200">Nr. Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{workout.totalSets}</div>
                <div className="text-xs text-blue-200">Total Sets</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{formatTotalWeight(workout.totalWeight)}</div>
                <div className="text-xs text-green-200">Total Weight</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {workout.exercises.map(exercise => <div key={exercise.id} ref={el => exerciseRefs.current[exercise.id] = el} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 animate-scale-in relative">
              {/* Exercise delete button */}
              <button onClick={() => openDeleteDialog('exercise', exercise.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
                <X className="w-4 h-4" />
              </button>

              <div className="mb-3 pr-8">
                <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                <p className="text-purple-200 text-sm">{exercise.muscleGroup}</p>
              </div>

              {/* Sets */}
              <div className="space-y-2 mb-3">
                {exercise.sets.map((set, index) => <div key={set.id} ref={el => setRefs.current[set.id] = el} className="bg-white/10 rounded-lg p-3 relative">
                    {/* Set delete button */}
                    <button onClick={() => openDeleteDialog('set', exercise.id, set.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
                      <X className="w-3 h-3" />
                    </button>

                    <div className="flex items-center space-x-2 mb-3">
                      <Hash className="w-3 h-3 text-purple-400" />
                      <span className="text-xs font-medium text-purple-200">Set {index + 1}</span>
                    </div>
                    
                    {/* Weight, Reps, and Notes on same row */}
                    <div className="flex items-center space-x-3 pr-8">
                      <div className="flex items-center space-x-1">
                        <input ref={el => weightInputRefs.current[set.id] = el} type="number" placeholder="0" value={set.weight || ''} onChange={e => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)} className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1" />
                        <span className="text-xs text-gray-300">{settings.weightUnit}</span>
                      </div>
                      
                      <span className="text-gray-400">×</span>
                      
                      <div className="flex items-center space-x-1">
                        <input type="number" placeholder="0" value={set.reps || ''} onChange={e => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)} className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1" />
                        <span className="text-xs text-gray-300">reps</span>
                      </div>
                      
                      <div className="flex-1">
                        <input type="text" placeholder="notes..." value={set.notes || ''} onChange={e => updateSet(exercise.id, set.id, 'notes', e.target.value)} className="w-full bg-transparent text-white text-sm border-0 border-b border-white/30 focus:border-purple-400 focus:outline-none pb-1 placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>)}
                
                {exercise.sets.length === 0 && <p className="text-purple-300 text-sm text-center py-3">
                    No sets yet. Add your first set!
                  </p>}
              </div>

              {/* Add Set Button */}
              <button onClick={() => addSet(exercise.id)} className="w-full bg-purple-600/30 text-purple-200 border border-purple-400/30 rounded-lg p-2.5 flex items-center justify-center space-x-2 hover:bg-purple-600/40 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="font-medium text-sm">Add Set</span>
              </button>
            </div>)}
        </div>

        {workout.exercises.length === 0 && <div className="text-center py-12">
            <p className="text-slate-200 mb-2">No exercises added yet</p>
            <p className="text-blue-300 text-sm">Tap "Add Exercise" to get started!</p>
          </div>}
      </div>

      {/* Fixed Add Exercise Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-purple-600 dark:bg-slate-800 border-t border-white/10">
        <button onClick={onAddExercise} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-3 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Exercise</span>
          </div>
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog isOpen={deleteDialog.isOpen} onClose={() => setDeleteDialog({
      isOpen: false,
      type: 'set'
    })} onConfirm={() => {
      if (deleteDialog.type === 'set' && deleteDialog.exerciseId && deleteDialog.setId) {
        deleteSet(deleteDialog.exerciseId, deleteDialog.setId);
      } else if (deleteDialog.type === 'exercise' && deleteDialog.exerciseId) {
        deleteExercise(deleteDialog.exerciseId);
      }
    }} title={deleteDialog.type === 'set' ? 'Delete Set' : 'Delete Exercise'} message={deleteDialog.type === 'set' ? 'Are you sure you want to delete this set? This action cannot be undone.' : 'Are you sure you want to delete this exercise? This will remove all sets and cannot be undone.'} confirmText={deleteDialog.type === 'set' ? 'Delete Set' : 'Delete Exercise'} />
    </div>;
};