
import React, { useState, useEffect } from 'react';
import { Plus, Clock, X, Hash, Edit3 } from 'lucide-react';
import { Workout, Exercise } from './WorkoutApp';

interface ActiveWorkoutProps {
  workout: Workout | null;
  onUpdateWorkout: (workout: Workout) => void;
  onEndWorkout: () => void;
  onAddExercise: () => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workout,
  onUpdateWorkout,
  onEndWorkout,
  onAddExercise
}) => {
  const [duration, setDuration] = useState(0);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('');

  useEffect(() => {
    if (!workout) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - workout.startTime.getTime()) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [workout]);

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

  const addSet = (exerciseId: string) => {
    if (!workout) return;

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
    if (!workout) return;

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
      totalWeight,
      duration
    };

    onUpdateWorkout(finalWorkout);
  };

  const updateStartTime = () => {
    if (!workout || !customStartTime) return;

    const [hours, minutes] = customStartTime.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const updatedWorkout = {
      ...workout,
      startTime: newStartTime
    };

    onUpdateWorkout(updatedWorkout);
    setIsEditingTime(false);
    setCustomStartTime('');
  };

  if (!workout) return null;

  return (
    <div className="min-h-screen text-white flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-200">Active Workout</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-4 h-4 text-blue-400" />
            {isEditingTime ? (
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
                <button onClick={() => setIsEditingTime(false)} className="text-red-400 text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-blue-300 text-sm">Started at {formatTime(workout.startTime)}</span>
                <button onClick={() => {
                  setIsEditingTime(true);
                  setCustomStartTime(formatTime(workout.startTime));
                }}>
                  <Edit3 className="w-3 h-3 text-blue-400" />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onEndWorkout}
          className="bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-400/30"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Card */}
      <div className="px-6 pb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {/* Duration - Centered at top */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-purple-400">{formatDuration(duration)}</div>
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
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-scale-in">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                <p className="text-purple-200 text-sm">{exercise.muscleGroup}</p>
              </div>

              {/* Sets */}
              <div className="space-y-3 mb-4">
                {exercise.sets.map((set, index) => (
                  <div key={set.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Hash className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-200">Set {index + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs text-gray-300 mb-2 font-medium">Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/20 rounded-lg px-4 py-3 text-white text-center text-xl font-bold border border-white/20 focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-300 mb-2 font-medium">Reps</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full bg-white/20 rounded-lg px-4 py-3 text-white text-center text-xl font-bold border border-white/20 focus:border-purple-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-300 mb-2 font-medium">Notes (optional)</label>
                      <input
                        type="text"
                        placeholder="Add notes..."
                        value={set.notes || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'notes', e.target.value)}
                        className="w-full bg-white/20 rounded-lg px-4 py-2 text-white text-sm border border-white/20 focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                
                {exercise.sets.length === 0 && (
                  <p className="text-purple-300 text-sm text-center py-4">
                    No sets yet. Add your first set!
                  </p>
                )}
              </div>

              {/* Add Set Button */}
              <button
                onClick={() => addSet(exercise.id)}
                className="w-full bg-purple-600/30 text-purple-200 border border-purple-400/30 rounded-xl p-3 flex items-center justify-center space-x-2 hover:bg-purple-600/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Set</span>
              </button>
            </div>
          ))}
        </div>

        {workout.exercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-200 mb-2">No exercises added yet</p>
            <p className="text-purple-300 text-sm">Tap "Add Exercise" to get started!</p>
          </div>
        )}
      </div>

      {/* Fixed Add Exercise Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-purple-900 via-purple-900/95 to-transparent">
        <button
          onClick={onAddExercise}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Exercise</span>
          </div>
        </button>
      </div>
    </div>
  );
};
