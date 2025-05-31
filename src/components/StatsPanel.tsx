
import React from 'react';
import { X, TrendingUp, Clock, Dumbbell, Target } from 'lucide-react';
import { Workout } from './WorkoutApp';
import { useSettings } from '@/contexts/SettingsContext';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workoutHistory: Workout[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  isOpen,
  onClose,
  workoutHistory
}) => {
  const { settings } = useSettings();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatWeight = (weight: number) => {
    if (settings.weightUnit === 'lbs') {
      return `${(weight * 2.20462).toFixed(0)} ${settings.weightUnit}`;
    }
    return `${weight.toFixed(0)} ${settings.weightUnit}`;
  };

  // Calculate stats
  const totalWorkouts = workoutHistory.length;
  const totalDuration = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  const totalSets = workoutHistory.reduce((sum, workout) => sum + workout.totalSets, 0);
  const totalWeight = workoutHistory.reduce((sum, workout) => sum + workout.totalWeight, 0);
  const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

  // Get this week's workouts (last 7 workouts for simplicity)
  const thisWeekWorkouts = workoutHistory.slice(0, 7).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative ml-auto h-full w-80 bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">Your Stats</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-full pb-24">
          {/* Overview Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Overview</h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-green-300 font-medium">Total Workouts</span>
              </div>
              <span className="text-2xl font-bold text-white">{totalWorkouts}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">This Week</span>
              </div>
              <span className="text-2xl font-bold text-white">{thisWeekWorkouts}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Dumbbell className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Total Sets</span>
              </div>
              <span className="text-2xl font-bold text-white">{totalSets}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-medium">Total Weight</span>
              </div>
              <span className="text-2xl font-bold text-white">{formatWeight(totalWeight)}</span>
            </div>
          </div>

          {/* Duration Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-200 mb-4">Duration</h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-slate-300 text-sm mb-1">Total Time</div>
              <span className="text-xl font-bold text-white">{formatDuration(totalDuration)}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-slate-300 text-sm mb-1">Average Workout</div>
              <span className="text-xl font-bold text-white">{formatDuration(averageDuration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
