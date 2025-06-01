
import { useState } from 'react';
import { Workout, Exercise, Set } from '../types/WorkoutTypes';
import { Workout as StandardWorkout } from '../types/Workout';

export const useWorkoutManager = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [activeWorkouts, setActiveWorkouts] = useState<Workout[]>([]);

  const convertToStandardWorkout = (workout: Workout): StandardWorkout => {
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
    return newWorkout;
  };

  const resumeWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
  };

  const pauseWorkout = () => {
    setCurrentWorkout(null);
  };

  const endWorkout = () => {
    if (currentWorkout) {
      const completedWorkout = { ...currentWorkout, isActive: false };
      setWorkoutHistory(prev => [completedWorkout, ...prev]);
      setActiveWorkouts(prev => prev.filter(w => w.id !== currentWorkout.id));
      setCurrentWorkout(null);
    }
  };

  const viewWorkout = (workout: Workout) => {
    setViewingWorkout(workout);
  };

  const updateViewingWorkout = (updatedWorkout: Workout) => {
    setViewingWorkout(updatedWorkout);
    setWorkoutHistory(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
  };

  const addExercise = (exerciseName: string, muscleGroup: string) => {
    if (!currentWorkout) return;
    
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
    setActiveWorkouts(prev => 
      prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w)
    );
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setCurrentWorkout(updatedWorkout);
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

  const standardizedWorkoutHistory: StandardWorkout[] = workoutHistory.map(convertToStandardWorkout);

  return {
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
  };
};
