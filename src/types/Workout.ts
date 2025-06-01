
export interface Set {
  weight: number;
  reps: number;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  startTime: Date;
  duration: number;    // seconds
  totalSets: number;
  exercises: Exercise[];
}
