
import { useState } from 'react';
import { AppScreen } from '../types/WorkoutTypes';

export const useAppNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');

  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const navigateToDashboard = () => setCurrentScreen('dashboard');
  const navigateToWorkout = () => setCurrentScreen('workout');
  const navigateToExerciseSelector = () => setCurrentScreen('exercise-selector');
  const navigateToStats = () => setCurrentScreen('stats');

  return {
    currentScreen,
    navigateTo,
    navigateToDashboard,
    navigateToWorkout,
    navigateToExerciseSelector,
    navigateToStats
  };
};
