
import { useMemo } from 'react';
import { Workout } from '@/types/Workout';

export interface ExercisePoint {
  date: string;        // ISO date (YYYY-MM-DD)
  avgWeight: number;   // average weight across sets that day
}

export function useExerciseStats(
  workouts: Workout[],
  exerciseName: string,
  from: Date,
  to: Date
): ExercisePoint[] {
  return useMemo(() => {
    if (!exerciseName || !workouts) return [];

    // Filter workouts within date range
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      return workoutDate >= from && workoutDate <= to;
    });

    // Group sets by date
    const dailyWeights: Record<string, number[]> = {};

    filteredWorkouts.forEach(workout => {
      const dateKey = new Date(workout.startTime).toISOString().split('T')[0];
      
      workout.exercises.forEach(exercise => {
        if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
          exercise.sets.forEach(set => {
            if (set.weight > 0) { // Only include sets with actual weight
              if (!dailyWeights[dateKey]) {
                dailyWeights[dateKey] = [];
              }
              dailyWeights[dateKey].push(set.weight);
            }
          });
        }
      });
    });

    // Calculate daily averages and sort by date
    const points: ExercisePoint[] = Object.entries(dailyWeights)
      .map(([date, weights]) => ({
        date,
        avgWeight: Math.round((weights.reduce((sum, weight) => sum + weight, 0) / weights.length) * 10) / 10
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return points;
  }, [workouts, exerciseName, from, to]);
}
