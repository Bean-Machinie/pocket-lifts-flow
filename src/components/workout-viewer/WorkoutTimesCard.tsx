
import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { Workout } from '../WorkoutApp';

interface WorkoutTimesCardProps {
  workout: Workout;
  onUpdateWorkout: (workout: Workout) => void;
}

export const WorkoutTimesCard: React.FC<WorkoutTimesCardProps> = ({ workout, onUpdateWorkout }) => {
  const [isEditingStartTime, setIsEditingStartTime] = useState(false);
  const [isEditingEndTime, setIsEditingEndTime] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getEndTime = () => {
    const endTime = new Date(workout.startTime.getTime() + (workout.duration * 1000));
    return endTime;
  };

  const updateStartTime = () => {
    if (!customStartTime) return;

    const [hours, minutes] = customStartTime.split(':');
    const newStartTime = new Date(workout.startTime);
    newStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Calculate new duration based on fixed end time
    const currentEndTime = getEndTime();
    const newDuration = Math.floor((currentEndTime.getTime() - newStartTime.getTime()) / 1000);

    const updatedWorkout = {
      ...workout,
      startTime: newStartTime,
      duration: Math.max(0, newDuration)
    };

    onUpdateWorkout(updatedWorkout);
    setIsEditingStartTime(false);
    setCustomStartTime('');
  };

  const updateEndTime = () => {
    if (!customEndTime) return;

    const [hours, minutes] = customEndTime.split(':');
    const newEndTime = new Date(workout.startTime);
    newEndTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If the new end time is before start time, set it to the next day
    if (newEndTime.getTime() <= workout.startTime.getTime()) {
      newEndTime.setDate(newEndTime.getDate() + 1);
    }
    
    const newDuration = Math.floor((newEndTime.getTime() - workout.startTime.getTime()) / 1000);
    
    const updatedWorkout = {
      ...workout,
      duration: Math.max(0, newDuration)
    };

    onUpdateWorkout(updatedWorkout);
    setIsEditingEndTime(false);
    setCustomEndTime('');
  };

  return (
    <div className="px-6 pb-4">
      <div className="bg-card backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm space-y-3">
        {/* Start Time */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Start Time</span>
          {isEditingStartTime ? (
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={customStartTime}
                onChange={(e) => setCustomStartTime(e.target.value)}
                className="bg-accent rounded px-2 py-1 text-sm text-accent-foreground border border-border"
              />
              <button onClick={updateStartTime} className="text-primary text-sm hover:text-primary/80">
                Save
              </button>
              <button onClick={() => setIsEditingStartTime(false)} className="text-destructive text-sm hover:text-destructive/80">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-card-foreground font-medium">{formatTime(workout.startTime)}</span>
              <button onClick={() => {
                setIsEditingStartTime(true);
                setCustomStartTime(formatTime(workout.startTime));
              }}>
                <Edit3 className="w-3 h-3 text-primary hover:text-primary/80" />
              </button>
            </div>
          )}
        </div>

        {/* End Time */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">End Time</span>
          {isEditingEndTime ? (
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={customEndTime}
                onChange={(e) => setCustomEndTime(e.target.value)}
                className="bg-accent rounded px-2 py-1 text-sm text-accent-foreground border border-border"
              />
              <button onClick={updateEndTime} className="text-primary text-sm hover:text-primary/80">
                Save
              </button>
              <button onClick={() => setIsEditingEndTime(false)} className="text-destructive text-sm hover:text-destructive/80">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-card-foreground font-medium">{formatTime(getEndTime())}</span>
              <button onClick={() => {
                setIsEditingEndTime(true);
                setCustomEndTime(formatTime(getEndTime()));
              }}>
                <Edit3 className="w-3 h-3 text-primary hover:text-primary/80" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
