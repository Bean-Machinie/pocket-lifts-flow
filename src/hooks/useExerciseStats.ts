
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

    console.log('=== useExerciseStats DEBUG ===');
    console.log('Exercise name:', exerciseName);
    console.log('Total workouts received:', workouts.length);
    console.log('Date range:', { 
      from: from.toISOString(), 
      to: to.toISOString() 
    });
    
    // Log all workouts with their dates
    workouts.forEach((workout, index) => {
      console.log(`Workout ${index + 1}:`, {
        id: workout.id,
        startTime: workout.startTime.toISOString(),
        exercises: workout.exercises.map(ex => ex.name)
      });
    });

    // Filter workouts within date range
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.startTime);
      // Set times to start of day for proper comparison
      const workoutDateOnly = new Date(workoutDate.getFullYear(), workoutDate.getMonth(), workoutDate.getDate());
      const fromDateOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const toDateOnly = new Date(to.getFullYear(), to.getMonth(), to.getDate());
      
      const isInRange = workoutDateOnly >= fromDateOnly && workoutDateOnly <= toDateOnly;
      console.log(`Workout ${workout.id} date check:`, {
        workoutDate: workoutDate.toISOString(),
        workoutDateOnly: workoutDateOnly.toISOString(),
        fromDateOnly: fromDateOnly.toISOString(),
        toDateOnly: toDateOnly.toISOString(),
        isInRange
      });
      return isInRange;
    });

    console.log('Filtered workouts count:', filteredWorkouts.length);

    // Group sets by date
    const dailyData: Record<string, {
      weights: number[];
      reps: number[];
      setCount: number;
    }> = {};

    filteredWorkouts.forEach(workout => {
      const dateKey = new Date(workout.startTime).toISOString().split('T')[0];
      console.log(`Processing workout ${workout.id} for date ${dateKey}`);
      
      workout.exercises.forEach(exercise => {
        console.log(`Checking exercise: "${exercise.name}" vs "${exerciseName}"`);
        if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
          console.log(`✓ Found matching exercise: ${exercise.name} with ${exercise.sets.length} sets`);
          
          exercise.sets.forEach((set, setIndex) => {
            console.log(`Set ${setIndex + 1}:`, { weight: set.weight, reps: set.reps });
            if (set.weight > 0) { // Only include sets with actual weight
              if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                  weights: [],
                  reps: [],
                  setCount: 0
                };
                console.log(`Created new daily data entry for ${dateKey}`);
              }
              dailyData[dateKey].weights.push(set.weight);
              dailyData[dateKey].reps.push(set.reps);
              dailyData[dateKey].setCount++;
              console.log(`Added set data to ${dateKey}:`, dailyData[dateKey]);
            }
          });
        }
      });
    });

    console.log('Final daily data:', dailyData);

    // Calculate daily stats and sort by date
    const points: ExercisePoint[] = Object.entries(dailyData)
      .map(([date, data]) => {
        const avgWeight = Math.round((data.weights.reduce((sum, weight) => sum + weight, 0) / data.weights.length) * 10) / 10;
        const maxWeight = Math.max(...data.weights);
        const totalReps = data.reps.reduce((sum, reps) => sum + reps, 0);
        
        const point = {
          date,
          avgWeight,
          maxWeight,
          totalSets: data.setCount,
          totalReps
        };
        
        console.log(`Created data point for ${date}:`, point);
        return point;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Final sorted points:', points);
    console.log('=== END DEBUG ===');
    
    return points;
  }, [workouts, exerciseName, from, to]);
}
