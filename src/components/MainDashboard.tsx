import React, { useState } from 'react';
import { Plus, Clock, TrendingUp, X, Settings, Play } from 'lucide-react';
import { Workout } from './WorkoutApp';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { SettingsPanel } from './SettingsPanel';
import { useSettings } from '@/contexts/SettingsContext';
interface MainDashboardProps {
  workoutHistory: Workout[];
  activeWorkouts: Workout[];
  onStartWorkout: () => void;
  onResumeWorkout: (workout: Workout) => void;
  onViewWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onDeleteActiveWorkout: (workoutId: string) => void;
}
export const MainDashboard: React.FC<MainDashboardProps> = ({
  workoutHistory,
  activeWorkouts,
  onStartWorkout,
  onResumeWorkout,
  onViewWorkout,
  onDeleteWorkout,
  onDeleteActiveWorkout
}) => {
  const {
    settings
  } = useSettings();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    workoutId?: string;
    isActive?: boolean;
  }>({
    isOpen: false
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
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
  const formatWeight = (weight: number) => {
    return `${weight} ${settings.weightUnit}`;
  };
  const openDeleteDialog = (workoutId: string, isActive: boolean = false) => {
    setDeleteDialog({
      isOpen: true,
      workoutId,
      isActive
    });
  };
  const handleDeleteWorkout = () => {
    if (deleteDialog.workoutId) {
      if (deleteDialog.isActive) {
        onDeleteActiveWorkout(deleteDialog.workoutId);
      } else {
        onDeleteWorkout(deleteDialog.workoutId);
      }
      setDeleteDialog({
        isOpen: false
      });
    }
  };
  const getActiveDuration = (workout: Workout) => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - workout.startTime.getTime()) / 1000);
    return elapsed;
  };
  return <div className="min-h-screen text-white p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 relative">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-slate-200 to-blue-300 bg-clip-text text-transparent ">
          Pocket Lifts
        </h1>
        <p className="text-blue-300 text-lg">Track your fitness journey</p>
        
        {/* Settings Icon */}
        <button onClick={() => setIsSettingsOpen(true)} className="absolute top-0 right-0 p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Settings className="w-6 h-6 text-purple-200 hover:text-white" />
        </button>
      </div>

      {/* Start Workout Button */}
      <button onClick={onStartWorkout} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-6 mb-8 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
        <div className="flex items-center justify-center space-x-3">
          <Plus className="w-8 h-8" />
          <span className="text-2xl font-semibold">Start New Workout</span>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-green-300 text-sm">Total Workouts</span>
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

      {/* Active Workouts */}
      {activeWorkouts.length > 0 && <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-300">Active Workouts</h2>
          <div className="space-y-3">
            {activeWorkouts.map(workout => <div key={workout.id} className="w-full bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 transform transition-all duration-200 hover:bg-green-500/25 hover:scale-[1.02] relative">
                {/* Delete button */}
                <button onClick={e => {
            e.stopPropagation();
            openDeleteDialog(workout.id, true);
          }} className="absolute top-3 right-3 text-red-400 hover:text-red-300 p-1">
                  <X className="w-4 h-4" />
                </button>

                <button onClick={() => onResumeWorkout(workout)} className="w-full text-left pr-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-green-400" />
                        <p className="text-white font-medium">
                          {formatDate(workout.startTime)}
                        </p>
                      </div>
                      <p className="text-green-200 text-sm ml-6">
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">
                        {formatDuration(getActiveDuration(workout))}
                      </p>
                      <p className="text-green-200 text-sm">
                        {workout.totalSets} sets
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-6">
                    {workout.exercises.slice(0, 3).map((exercise, index) => <span key={index} className="bg-green-600/30 text-green-200 px-2 py-1 rounded-lg text-xs">
                        {exercise.name}
                      </span>)}
                    {workout.exercises.length > 3 && <span className="text-green-300 text-xs py-1">
                        +{workout.exercises.length - 3} more
                      </span>}
                  </div>
                </button>
              </div>)}
          </div>
        </div>}

      {/* Workout History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Recent Workouts</h2>
        {workoutHistory.length === 0 ? <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <p className="text-slate-200 mb-2">No workouts yet</p>
            <p className="text-blue-300 text-sm">Start your first workout to see it here!</p>
          </div> : <div className="space-y-3">
            {workoutHistory.slice(0, 5).map(workout => <div key={workout.id} className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform transition-all duration-200 hover:bg-white/15 hover:scale-[1.02] relative">
                {/* Delete button */}
                <button onClick={e => {
            e.stopPropagation();
            openDeleteDialog(workout.id);
          }} className="absolute top-3 right-3 text-red-400 hover:text-red-300 p-1">
                  <X className="w-4 h-4" />
                </button>

                <button onClick={() => onViewWorkout(workout)} className="w-full text-left pr-8">
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
                    {workout.exercises.slice(0, 3).map((exercise, index) => <span key={index} className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded-lg text-xs">
                        {exercise.name}
                      </span>)}
                    {workout.exercises.length > 3 && <span className="text-purple-300 text-xs py-1">
                        +{workout.exercises.length - 3} more
                      </span>}
                  </div>
                </button>
              </div>)}
          </div>}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog isOpen={deleteDialog.isOpen} onClose={() => setDeleteDialog({
      isOpen: false
    })} onConfirm={handleDeleteWorkout} title={deleteDialog.isActive ? "Delete Active Workout" : "Delete Workout"} message={deleteDialog.isActive ? "Are you sure you want to delete this active workout? This action cannot be undone." : "Are you sure you want to delete this workout? This action cannot be undone."} confirmText={deleteDialog.isActive ? "Delete Active Workout" : "Delete Workout"} />

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>;
};