
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
      <div className="bg-card backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
        {/* Duration - Centered at top */}
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-primary">{formatDuration(workout.duration)}</div>
          <div className="text-sm text-muted-foreground">Duration</div>
        </div>
        
        {/* Sets and Weight - Same row underneath */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-accent-foreground">{workout.totalSets}</div>
            <div className="text-xs text-muted-foreground">Total Sets</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-accent-foreground">{formatTotalWeight(workout.totalWeight)}</div>
            <div className="text-xs text-muted-foreground">Total Weight</div>
          </div>
        </div>
      </div>
    </div>
  );
};
