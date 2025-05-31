
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
          className="bg-white/10 text-white p-2 rounded-xl border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-purple-200">Workout Details</h1>
          <p className="text-purple-200 text-sm">{workoutDate}</p>
        </div>
      </div>
    </div>
  );
};
