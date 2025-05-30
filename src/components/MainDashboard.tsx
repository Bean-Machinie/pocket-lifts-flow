
import React from 'react';
import { Plus, Clock, TrendingUp } from 'lucide-react';
import { Workout } from './WorkoutApp';

interface MainDashboardProps {
  workoutHistory: Workout[];
  onStartWorkout: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ 
  workoutHistory, 
  onStartWorkout 
}) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen text-white p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Pocket Lifts
        </h1>
        <p className="text-purple-200 text-lg">Track your fitness journey</p>
      </div>

      {/* Start Workout Button */}
      <button
        onClick={onStartWorkout}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-8 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center justify-center space-x-3">
          <Plus className="w-8 h-8" />
          <span className="text-2xl font-semibold">Start New Workout</span>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200 text-sm">Total Workouts</span>
          </div>
          <span className="text-2xl font-bold">{workoutHistory.length}</span>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-200 text-sm">This Week</span>
          </div>
          <span className="text-2xl font-bold">{workoutHistory.slice(0, 7).length}</span>
        </div>
      </div>

      {/* Workout History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">Recent Workouts</h2>
        {workoutHistory.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <p className="text-purple-200 mb-2">No workouts yet</p>
            <p className="text-purple-300 text-sm">Start your first workout to see it here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 5).map((workout) => (
              <div
                key={workout.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform transition-all duration-200 hover:bg-white/15"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-medium">
                      {formatDate(workout.startTime)}
                    </p>
                    <p className="text-purple-200 text-sm">
                      {workout.exercises.length} exercises
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">
                      {formatDuration(workout.duration)}
                    </p>
                    <p className="text-purple-200 text-sm">
                      {workout.totalSets} sets
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <span
                      key={index}
                      className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-lg text-xs"
                    >
                      {exercise.name}
                    </span>
                  ))}
                  {workout.exercises.length > 3 && (
                    <span className="text-purple-300 text-xs py-1">
                      +{workout.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
