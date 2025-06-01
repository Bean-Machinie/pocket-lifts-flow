import React, { useState } from 'react';
import { Calendar, Clock, Edit3 } from 'lucide-react';
import { Workout } from '../WorkoutApp';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WorkoutTimesCardProps {
  workout: Workout;
  onUpdateWorkout: (workout: Workout) => void;
}

export const WorkoutTimesCard: React.FC<WorkoutTimesCardProps> = ({
  workout,
  onUpdateWorkout
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

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
      day: 'numeric'
    });
  };

  const getEndTime = () => {
    return new Date(workout.startTime.getTime() + workout.duration * 1000);
  };

  const updateStartDateTime = (newDate?: Date, hour?: number, minute?: number) => {
    const updatedStartTime = newDate ? new Date(newDate) : new Date(workout.startTime);
    
    if (hour !== undefined) updatedStartTime.setHours(hour);
    if (minute !== undefined) updatedStartTime.setMinutes(minute);
    if (newDate) {
      updatedStartTime.setHours(workout.startTime.getHours());
      updatedStartTime.setMinutes(workout.startTime.getMinutes());
    }
    
    // Keep duration the same, so end time adjusts automatically
    const updatedWorkout = {
      ...workout,
      startTime: updatedStartTime
    };
    
    onUpdateWorkout(updatedWorkout);
  };

  const updateEndDateTime = (newDate?: Date, hour?: number, minute?: number) => {
    const startTime = workout.startTime;
    let endTime = newDate ? new Date(newDate) : getEndTime();
    
    if (hour !== undefined) endTime.setHours(hour);
    if (minute !== undefined) endTime.setMinutes(minute);
    if (newDate) {
      endTime.setHours(getEndTime().getHours());
      endTime.setMinutes(getEndTime().getMinutes());
    }
    
    // If end is before start, move to next day
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const newDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    const updatedWorkout = {
      ...workout,
      duration: Math.max(300, newDuration) // Minimum 5 minutes
    };
    
    onUpdateWorkout(updatedWorkout);
  };

  // Generate time options
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45]; // 15-minute intervals for mobile

  const endTime = getEndTime();
  const durationMinutes = Math.floor(workout.duration / 60);

  return (
    <div className="px-6 pb-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-5">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Schedule</h3>
          <div className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {durationMinutes}min
          </div>
        </div>

        {/* Start Section */}
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Start</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <span className="text-xs text-gray-500 block mb-2">Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full p-3 bg-gray-800/80 rounded-lg border border-gray-600 text-white text-left hover:bg-gray-700/80 transition-colors">
                    <div className="text-sm font-medium">{formatDate(workout.startTime)}</div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={workout.startTime}
                    onSelect={(date) => date && updateStartDateTime(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Time */}
            <div>
              <span className="text-xs text-gray-500 block mb-2">Time</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={workout.startTime.getHours()}
                  onChange={(e) => updateStartDateTime(undefined, parseInt(e.target.value))}
                  className="w-full bg-gray-800/80 text-white rounded-lg px-2 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-sm font-medium"
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={workout.startTime.getMinutes()}
                  onChange={(e) => updateStartDateTime(undefined, undefined, parseInt(e.target.value))}
                  className="w-full bg-gray-800/80 text-white rounded-lg px-2 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-sm font-medium"
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Arrow */}
        <div className="flex justify-center mb-4">
          <div className="text-gray-400 text-sm">↓</div>
        </div>

        {/* End Section */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">End</span>
            <Edit3 className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* End Date */}
            <div>
              <span className="text-xs text-gray-500 block mb-2">Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full p-3 bg-gray-800/80 rounded-lg border border-gray-600 text-white text-left hover:bg-gray-700/80 transition-colors">
                    <div className="text-sm font-medium">{formatDate(endTime)}</div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endTime}
                    onSelect={(date) => date && updateEndDateTime(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Time */}
            <div>
              <span className="text-xs text-gray-500 block mb-2">Time</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={endTime.getHours()}
                  onChange={(e) => updateEndDateTime(undefined, parseInt(e.target.value))}
                  className="w-full bg-gray-800/80 text-white rounded-lg px-2 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-sm font-medium"
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={endTime.getMinutes()}
                  onChange={(e) => updateEndDateTime(undefined, undefined, parseInt(e.target.value))}
                  className="w-full bg-gray-800/80 text-white rounded-lg px-2 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-sm font-medium"
                >
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Summary */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">
              {formatTime(workout.startTime)} → {formatTime(endTime)} ({durationMinutes} minutes)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
