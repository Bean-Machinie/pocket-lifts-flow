
import React, { useState, useEffect } from 'react';
import { MainDashboard } from './MainDashboard';
import { ActiveWorkout } from './ActiveWorkout';
import { ExerciseSelector } from './ExerciseSelector';

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
}

export type AppScreen = 'dashboard' | 'workout' | 'exercise-selector';

export const WorkoutApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

  const startNewWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      exercises: [],
      totalSets: 0,
      totalWeight: 0
    };
    setCurrentWorkout(newWorkout);
    setCurrentScreen('workout');
  };

  const endWorkout = () => {
    if (currentWorkout) {
      setWorkoutHistory(prev => [currentWorkout, ...prev]);
      setCurrentWorkout(null);
    }
    setCurrentScreen('dashboard');
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
    
    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: [...prev.exercises, newExercise]
    } : null);
    setCurrentScreen('workout');
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setCurrentWorkout(updatedWorkout);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <MainDashboard
            workoutHistory={workoutHistory}
            onStartWorkout={startNewWorkout}
          />
        );
      case 'workout':
        return (
          <ActiveWorkout
            workout={currentWorkout}
            onUpdateWorkout={updateWorkout}
            onEndWorkout={endWorkout}
            onAddExercise={() => setCurrentScreen('exercise-selector')}
          />
        );
      case 'exercise-selector':
        return (
          <ExerciseSelector
            onSelectExercise={addExercise}
            onBack={() => setCurrentScreen('workout')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {renderScreen()}
    </div>
  );
};
