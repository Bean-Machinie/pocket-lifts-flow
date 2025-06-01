
import React from 'react';
import { MainDashboard } from './MainDashboard';
import { ActiveWorkout } from './ActiveWorkout';
import { ExerciseSelector } from './ExerciseSelector';
import { WorkoutViewer } from './WorkoutViewer';
import { StatsPanel } from './StatsPanel';
import { Workout, AppScreen } from '../types/WorkoutTypes';
import { Workout as StandardWorkout } from '../types/Workout';

interface AppRouterProps {
  currentScreen: AppScreen;
  currentWorkout: Workout | null;
  viewingWorkout: Workout | null;
  workoutHistory: Workout[];
  activeWorkouts: Workout[];
  standardizedWorkoutHistory: StandardWorkout[];
  onStartWorkout: () => void;
  onResumeWorkout: (workout: Workout) => void;
  onPauseWorkout: () => void;
  onEndWorkout: () => void;
  onViewWorkout: (workout: Workout) => void;
  onUpdateViewingWorkout: (workout: Workout) => void;
  onAddExercise: (exerciseName: string, muscleGroup: string) => void;
  onUpdateWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onDeleteActiveWorkout: (workoutId: string) => void;
  onOpenStats: () => void;
  onNavigateToExerciseSelector: () => void;
  onNavigateToWorkout: () => void;
  onNavigateToDashboard: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  currentScreen,
  currentWorkout,
  viewingWorkout,
  workoutHistory,
  activeWorkouts,
  standardizedWorkoutHistory,
  onStartWorkout,
  onResumeWorkout,
  onPauseWorkout,
  onEndWorkout,
  onViewWorkout,
  onUpdateViewingWorkout,
  onAddExercise,
  onUpdateWorkout,
  onDeleteWorkout,
  onDeleteActiveWorkout,
  onOpenStats,
  onNavigateToExerciseSelector,
  onNavigateToWorkout,
  onNavigateToDashboard
}) => {
  switch (currentScreen) {
    case 'dashboard':
      return (
        <MainDashboard
          workoutHistory={workoutHistory}
          activeWorkouts={activeWorkouts}
          onStartWorkout={onStartWorkout}
          onResumeWorkout={onResumeWorkout}
          onViewWorkout={onViewWorkout}
          onDeleteWorkout={onDeleteWorkout}
          onDeleteActiveWorkout={onDeleteActiveWorkout}
          onOpenStats={onOpenStats}
        />
      );
    case 'stats':
      return (
        <StatsPanel
          workouts={standardizedWorkoutHistory}
          onBack={onNavigateToDashboard}
        />
      );
    case 'workout':
      return (
        <ActiveWorkout
          workout={currentWorkout}
          onUpdateWorkout={onUpdateWorkout}
          onEndWorkout={onEndWorkout}
          onAddExercise={onNavigateToExerciseSelector}
          onBack={onPauseWorkout}
        />
      );
    case 'exercise-selector':
      return (
        <ExerciseSelector
          onSelectExercise={onAddExercise}
          onBack={onNavigateToWorkout}
        />
      );
    case 'workout-viewer':
      return (
        <WorkoutViewer
          workout={viewingWorkout!}
          onBack={onNavigateToDashboard}
          onUpdateWorkout={onUpdateViewingWorkout}
        />
      );
    default:
      return null;
  }
};
