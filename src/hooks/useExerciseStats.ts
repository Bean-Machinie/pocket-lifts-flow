
import { useMemo } from 'react';
import { Workout } from '@/types/Workout';

export interface ExercisePoint {
  date: string;        // ISO date (YYYY-MM-DD)
  avgWeight: number;   // average weight across sets that day
  maxWeight: number;   // highest weight lifted that day (PR for that day)
  totalSets: number;   // total number of sets that day
  totalReps: number;   // total number of reps that day
}

export function useExerciseStats(
  workouts: Workout[],
  exerciseName: string,
  from: Date,
  to: Date
): ExercisePoint[] {
  return useMemo(() => {
    if (!exerciseName || !workouts) return [];

    console.log('useExerciseStats - Processing:', {
      exerciseName,
      workoutCount: workouts.length,
      dateRange: { from: from.toISOString(), to: to.toISOString() },
      allWorkouts: workouts.map(w => ({ id: w.id, startTime: w.startTime.toISOString() }))
    });

    // Filter workouts within date range - fix the date comparison
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      // Set times to start of day for proper comparison
      const workoutDateOnly = new Date(workoutDate.getFullYear(), workoutDate.getMonth(), workoutDate.getDate());
      const fromDateOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const toDateOnly = new Date(to.getFullYear(), to.getMonth(), to.getDate());
      
      const isInRange = workoutDateOnly >= fromDateOnly && workoutDateOnly <= toDateOnly;
      console.log('Workout date check:', {
        workoutId: workout.id,
        workoutDate: workoutDate.toISOString(),
        workoutDateOnly: workoutDateOnly.toISOString(),
        fromDate: from.toISOString(),
        fromDateOnly: fromDateOnly.toISOString(),
        toDate: to.toISOString(),
        toDateOnly: toDateOnly.toISOString(),
        isInRange
      });
      return isInRange;
    });

    console.log('Filtered workouts:', filteredWorkouts.length);

    // Group sets by date
    const dailyData: Record<string, {
      weights: number[];
      reps: number[];
      setCount: number;
    }> = {};

    filteredWorkouts.forEach(workout => {
      const dateKey = new Date(workout.startTime).toISOString().split('T')[0];
      
      workout.exercises.forEach(exercise => {
        if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
          console.log('Found matching exercise:', {
            exerciseName: exercise.name,
            sets: exercise.sets.length,
            date: dateKey
          });
          
          exercise.sets.forEach(set => {
            if (set.weight > 0) { // Only include sets with actual weight
              if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                  weights: [],
                  reps: [],
                  setCount: 0
                };
              }
              dailyData[dateKey].weights.push(set.weight);
              dailyData[dateKey].reps.push(set.reps);
              dailyData[dateKey].setCount++;
            }
          });
        }
      });
    });

    console.log('Daily data:', dailyData);

    // Calculate daily stats and sort by date
    const points: ExercisePoint[] = Object.entries(dailyData)
      .map(([date, data]) => {
        const avgWeight = Math.round((data.weights.reduce((sum, weight) => sum + weight, 0) / data.weights.length) * 10) / 10;
        const maxWeight = Math.max(...data.weights);
        const totalReps = data.reps.reduce((sum, reps) => sum + reps, 0);
        
        return {
          date,
          avgWeight,
          maxWeight,
          totalSets: data.setCount,
          totalReps
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Final points:', points);
    return points;
  }, [workouts, exerciseName, from, to]);
}
