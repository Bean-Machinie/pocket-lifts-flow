
import React from 'react';
import { Workout } from '../WorkoutApp';
import { useSettings } from '@/contexts/SettingsContext';

interface WorkoutStatsCardProps {
  workout: Workout;
}

export const WorkoutStatsCard: React.FC<WorkoutStatsCardProps> = ({ workout }) => {
  const { settings } = useSettings();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalWeight = (weight: number) => {
    if (settings.weightUnit === 'lbs') {
      return `${(weight * 2.20462).toFixed(0)}${settings.weightUnit}`;
    }
    return `${weight.toFixed(0)}${settings.weightUnit}`;
  };

  return (
    <div className="px-6 pb-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        {/* Duration - Centered at top */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-purple-400">{formatDuration(workout.duration)}</div>
          <div className="text-sm text-purple-200">Duration</div>
        </div>
        
        {/* Sets and Weight - Same row underneath */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{workout.totalSets}</div>
            <div className="text-xs text-blue-200">Total Sets</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{formatTotalWeight(workout.totalWeight)}</div>
            <div className="text-xs text-green-200">Total Weight</div>
          </div>
        </div>
      </div>
    </div>
  );
};
