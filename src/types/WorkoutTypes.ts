
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
