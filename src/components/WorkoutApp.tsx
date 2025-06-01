
import React from 'react';
import { AppRouter } from './AppRouter';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { useWorkoutManager } from '../hooks/useWorkoutManager';
import { useAppNavigation } from '../hooks/useAppNavigation';

export const WorkoutApp: React.FC = () => {
  const {
    currentWorkout,
    viewingWorkout,
    workoutHistory,
    activeWorkouts,
    standardizedWorkoutHistory,
    startNewWorkout,
    resumeWorkout,
    pauseWorkout,
    endWorkout,
    viewWorkout,
    updateViewingWorkout,
    addExercise,
    updateWorkout,
    deleteWorkout,
    deleteActiveWorkout
  } = useWorkoutManager();

  const {
    currentScreen,
    navigateToDashboard,
    navigateToWorkout,
    navigateToExerciseSelector,
    navigateToStats
  } = useAppNavigation();

  const handleStartNewWorkout = () => {
    startNewWorkout();
    navigateToWorkout();
  };

  const handleResumeWorkout = (workout: any) => {
    resumeWorkout(workout);
    navigateToWorkout();
  };

  const handleEndWorkout = () => {
    endWorkout();
    navigateToDashboard();
  };

  const handleAddExercise = (exerciseName: string, muscleGroup: string) => {
    addExercise(exerciseName, muscleGroup);
    navigateToWorkout();
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
        <AppRouter
          currentScreen={currentScreen}
          currentWorkout={currentWorkout}
          viewingWorkout={viewingWorkout}
          workoutHistory={workoutHistory}
          activeWorkouts={activeWorkouts}
          standardizedWorkoutHistory={standardizedWorkoutHistory}
          onStartWorkout={handleStartNewWorkout}
          onResumeWorkout={handleResumeWorkout}
          onPauseWorkout={pauseWorkout}
          onEndWorkout={handleEndWorkout}
          onViewWorkout={viewWorkout}
          onUpdateViewingWorkout={updateViewingWorkout}
          onAddExercise={handleAddExercise}
          onUpdateWorkout={updateWorkout}
          onDeleteWorkout={deleteWorkout}
          onDeleteActiveWorkout={deleteActiveWorkout}
          onOpenStats={navigateToStats}
          onNavigateToExerciseSelector={navigateToExerciseSelector}
          onNavigateToWorkout={navigateToWorkout}
          onNavigateToDashboard={navigateToDashboard}
        />
      </div>
    </SettingsProvider>
  );
};
