
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface WorkoutHeaderProps {
  onBack: () => void;
  workoutDate: string;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ onBack, workoutDate }) => {
  return (
    <div className="flex justify-between items-center p-6 pb-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="bg-card hover:bg-accent text-card-foreground p-2 rounded-xl border border-border transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workout Details</h1>
          <p className="text-muted-foreground text-sm">{workoutDate}</p>
        </div>
      </div>
    </div>
  );
};
