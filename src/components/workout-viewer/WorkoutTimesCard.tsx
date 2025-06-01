import React, { useState } from 'react';
import { Edit3, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Workout } from '../WorkoutApp';
import { WorkoutDateTimePicker } from './WorkoutDateTimePicker';
import { DeleteConfirmDialog } from '../DeleteConfirmDialog';

interface WorkoutTimesCardProps {
  workout: Workout;
  onUpdateWorkout: (workout: Workout) => void;
}

export const WorkoutTimesCard: React.FC<WorkoutTimesCardProps> = ({
  workout,
  onUpdateWorkout
}) => {
  const [dateTimePickerState, setDateTimePickerState] = useState<{
    isOpen: boolean;
    type: 'start' | 'end' | null;
  }>({
    isOpen: false,
    type: null
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'duration-reset' | null;
    pendingDate?: Date;
    pendingType?: 'start' | 'end';
  }>({
    isOpen: false,
    type: null
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEndTime = () => {
    const endTime = new Date(workout.startTime.getTime() + workout.duration * 1000);
    return endTime;
  };

  const openDateTimePicker = (type: 'start' | 'end') => {
    setDateTimePickerState({
      isOpen: true,
      type
    });
  };

  const closeDateTimePicker = () => {
    setDateTimePickerState({
      isOpen: false,
      type: null
    });
  };

  const checkForDurationReset = (newDate: Date, type: 'start' | 'end') => {
    const timeDifference = Math.abs(
      type === 'start' 
        ? newDate.getTime() - workout.startTime.getTime()
        : newDate.getTime() - getEndTime().getTime()
    );
    
    // If the time change is more than 5 minutes, show confirmation
    if (timeDifference > 5 * 60 * 1000) {
      setConfirmDialog({
        isOpen: true,
        type: 'duration-reset',
        pendingDate: newDate,
        pendingType: type
      });
      return true;
    }
    return false;
  };

  const handleDateTimeUpdate = (newDate: Date, type: 'start' | 'end') => {
    if (checkForDurationReset(newDate, type)) {
      return; // Will be handled by confirmation dialog
    }
    
    applyDateTimeUpdate(newDate, type);
    closeDateTimePicker();
  };

  const applyDateTimeUpdate = (newDate: Date, type: 'start' | 'end') => {
    let updatedWorkout: Workout;

    if (type === 'start') {
      // Calculate new duration based on fixed end time
      const currentEndTime = getEndTime();
      const newDuration = Math.floor((currentEndTime.getTime() - newDate.getTime()) / 1000);
      updatedWorkout = {
        ...workout,
        startTime: newDate,
        duration: Math.max(0, newDuration)
      };
    } else {
      // Calculate new duration based on fixed start time
      const newDuration = Math.floor((newDate.getTime() - workout.startTime.getTime()) / 1000);
      updatedWorkout = {
        ...workout,
        duration: Math.max(0, newDuration)
      };
    }

    onUpdateWorkout(updatedWorkout);
  };

  const handleConfirmDurationReset = () => {
    if (confirmDialog.pendingDate && confirmDialog.pendingType) {
      applyDateTimeUpdate(confirmDialog.pendingDate, confirmDialog.pendingType);
    }
    setConfirmDialog({ isOpen: false, type: null });
    closeDateTimePicker();
  };

  return (
    <>
      <div className="px-6 pb-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Workout Schedule</h3>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-sm text-gray-400">Date</span>
              <div className="text-white font-medium">{formatDate(workout.startTime)}</div>
            </div>
            <button 
              onClick={() => openDateTimePicker('start')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* Start Time */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-sm text-gray-400">Start Time</span>
              <div className="text-white font-medium">{formatTime(workout.startTime)}</div>
            </div>
            <button 
              onClick={() => openDateTimePicker('start')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* End Time */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <span className="text-sm text-gray-400">End Time</span>
              <div className="text-white font-medium">{formatTime(getEndTime())}</div>
            </div>
            <button 
              onClick={() => openDateTimePicker('end')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* Duration */}
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Total Duration</span>
            </div>
            <div className="text-white font-bold text-lg">{formatDuration(workout.duration)}</div>
          </div>
        </div>
      </div>

      {/* Date Time Picker */}
      <WorkoutDateTimePicker
        isOpen={dateTimePickerState.isOpen}
        onClose={closeDateTimePicker}
        onSave={(date) => handleDateTimeUpdate(date, dateTimePickerState.type!)}
        initialDate={
          dateTimePickerState.type === 'start' 
            ? workout.startTime 
            : getEndTime()
        }
        title={
          dateTimePickerState.type === 'start' 
            ? 'Edit Start Date & Time' 
            : 'Edit End Date & Time'
        }
        description={
          dateTimePickerState.type === 'start'
            ? 'Changing the start time will adjust the workout duration'
            : 'Changing the end time will adjust the workout duration'
        }
      />

      {/* Duration Reset Confirmation */}
      <DeleteConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null })}
        onConfirm={handleConfirmDurationReset}
        title="Duration Will Be Recalculated"
        message="You're making a significant time change. This will recalculate the workout duration based on the new start/end times. Do you want to continue?"
        confirmText="Update Time"
      />
    </>
  );
};
