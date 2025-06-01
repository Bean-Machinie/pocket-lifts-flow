import React, { useState, useEffect, useMemo } from 'react';
import { MainDashboard } from './MainDashboard';
import { ActiveWorkout } from './ActiveWorkout';
import { ExerciseSelector } from './ExerciseSelector';
import { WorkoutViewer } from './WorkoutViewer';
import { StatsPanel } from './StatsPanel';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Workout as WorkoutType, Exercise as ExerciseType, Set as SetType } from '@/types/Workout';

// Keep the local types for compatibility with existing components
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
  notes?: string;
  completed: boolean;
}

export interface Workout {
  id: string;
  startTime: Date;
  duration: number;
  exercises: Exercise[];
  totalSets: number;
  totalWeight: number;
  isActive?: boolean;
}

export type AppScreen = 'dashboard' | 'workout' | 'exercise-selector' | 'workout-viewer' | 'stats';

export const WorkoutApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [activeWorkouts, setActiveWorkouts] = useState<Workout[]>([]);

  // Convert local Workout format to standardized format for StatsPanel
  const convertToStandardWorkout = (workout: Workout): WorkoutType => {
    return {
      id: workout.id,
      startTime: workout.startTime,
      duration: workout.duration,
      totalSets: workout.totalSets,
      exercises: workout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          weight: set.weight,
          reps: set.reps
        }))
      }))
    };
  };

  // Create a memoized version to ensure it updates when workoutHistory changes
  const standardizedWorkoutHistory: WorkoutType[] = React.useMemo(() => {
    console.log('Converting workout history to standard format:', workoutHistory.length);
    return workoutHistory.map(convertToStandardWorkout);
  }, [workoutHistory]);

  const startNewWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      exercises: [],
      totalSets: 0,
      totalWeight: 0,
      isActive: true
    };
    setCurrentWorkout(newWorkout);
    setActiveWorkouts(prev => [newWorkout, ...prev]);
    setCurrentScreen('workout');
  };

  const resumeWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setCurrentScreen('workout');
  };

  const pauseWorkout = () => {
    setCurrentWorkout(null);
    setCurrentScreen('dashboard');
  };

  const endWorkout = () => {
    if (currentWorkout) {
      const completedWorkout = { ...currentWorkout, isActive: false };
      setWorkoutHistory(prev => [completedWorkout, ...prev]);
      setActiveWorkouts(prev => prev.filter(w => w.id !== currentWorkout.id));
      setCurrentWorkout(null);
    }
    setCurrentScreen('dashboard');
  };

  const viewWorkout = (workout: Workout) => {
    setViewingWorkout(workout);
    setCurrentScreen('workout-viewer');
  };

  const updateViewingWorkout = (updatedWorkout: Workout) => {
    console.log('updateViewingWorkout called with:', updatedWorkout);
    setViewingWorkout(updatedWorkout);
    
    // Update the workout in history - this was missing!
    setWorkoutHistory(prev => {
      const updated = prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w);
      console.log('Updated workout history:', updated);
      return updated;
    });
    
    // Also update in active workouts if it exists there
    setActiveWorkouts(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
  };

  const addExercise = (exerciseName: string, muscleGroup: string) => {
    if (!currentWorkout) return;
    
    // Create the first set automatically with default values
    const firstSet = {
      id: Date.now().toString(),
      weight: 0,
      reps: 0,
      notes: '',
      completed: false
    };
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      muscleGroup,
      sets: [firstSet]
    };
    
    const updatedWorkout = {
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newExercise]
    };
    
    setCurrentWorkout(updatedWorkout);
    // Update the workout in active workouts list
    setActiveWorkouts(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
    setCurrentScreen('workout');
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setCurrentWorkout(updatedWorkout);
    // Update the workout in active workouts list
    setActiveWorkouts(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkoutHistory(prev => prev.filter(w => w.id !== workoutId));
  };

  const deleteActiveWorkout = (workoutId: string) => {
    setActiveWorkouts(prev => prev.filter(w => w.id !== workoutId));
    if (currentWorkout?.id === workoutId) {
      setCurrentWorkout(null);
    }
  };

  const openStats = () => {
    setCurrentScreen('stats');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <MainDashboard
            workoutHistory={workoutHistory}
            activeWorkouts={activeWorkouts}
            onStartWorkout={startNewWorkout}
            onResumeWorkout={resumeWorkout}
            onViewWorkout={viewWorkout}
            onDeleteWorkout={deleteWorkout}
            onDeleteActiveWorkout={deleteActiveWorkout}
            onOpenStats={openStats}
          />
        );
      case 'stats':
        return (
          <StatsPanel
            workouts={standardizedWorkoutHistory}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'workout':
        return (
          <ActiveWorkout
            workout={currentWorkout}
            onUpdateWorkout={updateWorkout}
            onEndWorkout={endWorkout}
            onAddExercise={() => setCurrentScreen('exercise-selector')}
            onBack={pauseWorkout}
          />
        );
      case 'exercise-selector':
        return (
          <ExerciseSelector
            onSelectExercise={addExercise}
            onBack={() => setCurrentScreen('workout')}
          />
        );
      case 'workout-viewer':
        return (
          <WorkoutViewer
            workout={viewingWorkout!}
            onBack={() => setCurrentScreen('dashboard')}
            onUpdateWorkout={updateViewingWorkout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
        {renderScreen()}
      </div>
    </SettingsProvider>
  );
};
