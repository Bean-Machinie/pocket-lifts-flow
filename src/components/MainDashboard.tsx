
import React, { useState } from 'react';
import { Plus, Clock, TrendingUp, X, Settings } from 'lucide-react';
import { Workout } from './WorkoutApp';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { SettingsPanel } from './SettingsPanel';
import { useSettings } from '@/contexts/SettingsContext';

interface MainDashboardProps {
  workoutHistory: Workout[];
  onStartWorkout: () => void;
  onViewWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ 
  workoutHistory, 
  onStartWorkout,
  onViewWorkout,
  onDeleteWorkout
}) => {
  const { settings } = useSettings();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    workoutId?: string;
  }>({ isOpen: false });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const formatWeight = (weight: number) => {
    return `${weight} ${settings.weightUnit}`;
  };

  const openDeleteDialog = (workoutId: string) => {
    setDeleteDialog({ isOpen: true, workoutId });
  };

  const handleDeleteWorkout = () => {
    if (deleteDialog.workoutId) {
      onDeleteWorkout(deleteDialog.workoutId);
      setDeleteDialog({ isOpen: false });
    }
  };

  return (
    <div className="min-h-screen text-foreground p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 relative">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          Pocket Lifts
        </h1>
        <p className="text-muted-foreground text-lg">Track your fitness journey</p>
        
        {/* Settings Icon */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-0 right-0 p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Settings className="w-6 h-6 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Start Workout Button */}
      <button
        onClick={onStartWorkout}
        className="w-full bg-primary text-primary-foreground rounded-3xl p-6 mb-8 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-primary/20"
      >
        <div className="flex items-center justify-center space-x-3">
          <Plus className="w-8 h-8" />
          <span className="text-2xl font-semibold">Start New Workout</span>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground text-sm">Total Workouts</span>
          </div>
          <span className="text-2xl font-bold text-card-foreground">{workoutHistory.length}</span>
        </div>
        <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-5 h-5 text-accent-foreground" />
            <span className="text-muted-foreground text-sm">This Week</span>
          </div>
          <span className="text-2xl font-bold text-card-foreground">{workoutHistory.slice(0, 7).length}</span>
        </div>
      </div>

      {/* Workout History */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Workouts</h2>
        {workoutHistory.length === 0 ? (
          <div className="bg-card border-2 border-border rounded-2xl p-8 text-center shadow-sm">
            <p className="text-card-foreground mb-2">No workouts yet</p>
            <p className="text-muted-foreground text-sm">Start your first workout to see it here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 5).map((workout) => (
              <div
                key={workout.id}
                className="w-full bg-card border-2 border-border rounded-2xl p-4 shadow-sm transform transition-all duration-200 hover:bg-accent hover:scale-[1.02] relative"
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(workout.id);
                  }}
                  className="absolute top-3 right-3 text-destructive hover:text-destructive/80 p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onViewWorkout(workout)}
                  className="w-full text-left pr-8"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-card-foreground font-medium">
                        {formatDate(workout.startTime)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent-foreground font-semibold">
                        {formatDuration(workout.duration)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {workout.totalSets} sets
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {workout.exercises.slice(0, 3).map((exercise, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-lg text-xs border border-border"
                      >
                        {exercise.name}
                      </span>
                    ))}
                    {workout.exercises.length > 3 && (
                      <span className="text-muted-foreground text-xs py-1">
                        +{workout.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={handleDeleteWorkout}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmText="Delete Workout"
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
