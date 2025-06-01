import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Workout } from '../WorkoutApp';
import { Button } from '../ui/button';
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
  const [startTimeHour, setStartTimeHour] = useState(workout.startTime.getHours());
  const [startTimeMinute, setStartTimeMinute] = useState(workout.startTime.getMinutes());
  const [endTimeHour, setEndTimeHour] = useState(() => {
    const endTime = new Date(workout.startTime.getTime() + workout.duration * 1000);
    return endTime.getHours();
  });
  const [endTimeMinute, setEndTimeMinute] = useState(() => {
    const endTime = new Date(workout.startTime.getTime() + workout.duration * 1000);
    return endTime.getMinutes();
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

  const getEndTime = () => {
    const endTime = new Date(workout.startTime.getTime() + workout.duration * 1000);
    return endTime;
  };

  const updateStartTime = (hour: number, minute: number) => {
    const newStartTime = new Date(workout.startTime);
    newStartTime.setHours(hour);
    newStartTime.setMinutes(minute);
    
    // Keep end time fixed, adjust duration
    const currentEndTime = getEndTime();
    const newDuration = Math.floor((currentEndTime.getTime() - newStartTime.getTime()) / 1000);
    
    const updatedWorkout = {
      ...workout,
      startTime: newStartTime,
      duration: Math.max(0, newDuration)
    };
    
    onUpdateWorkout(updatedWorkout);
  };

  const updateEndTime = (hour: number, minute: number) => {
    const newEndTime = new Date(workout.startTime);
    newEndTime.setHours(hour);
    newEndTime.setMinutes(minute);
    
    // If end time is before start time, assume it's the next day
    if (newEndTime <= workout.startTime) {
      newEndTime.setDate(newEndTime.getDate() + 1);
    }
    
    const newDuration = Math.floor((newEndTime.getTime() - workout.startTime.getTime()) / 1000);
    
    const updatedWorkout = {
      ...workout,
      duration: Math.max(0, newDuration)
    };
    
    onUpdateWorkout(updatedWorkout);
  };

  const updateDate = (newDate: Date) => {
    const updatedStartTime = new Date(newDate);
    updatedStartTime.setHours(workout.startTime.getHours());
    updatedStartTime.setMinutes(workout.startTime.getMinutes());
    
    const updatedWorkout = {
      ...workout,
      startTime: updatedStartTime
    };
    
    onUpdateWorkout(updatedWorkout);
  };

  const handleStartTimeHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hour = parseInt(e.target.value);
    setStartTimeHour(hour);
    updateStartTime(hour, startTimeMinute);
  };

  const handleStartTimeMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minute = parseInt(e.target.value);
    setStartTimeMinute(minute);
    updateStartTime(startTimeHour, minute);
  };

  const handleEndTimeHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hour = parseInt(e.target.value);
    setEndTimeHour(hour);
    updateEndTime(hour, endTimeMinute);
  };

  const handleEndTimeMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minute = parseInt(e.target.value);
    setEndTimeMinute(minute);
    updateEndTime(endTimeHour, minute);
  };

  // Generate arrays for the time pickers
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="px-6 pb-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Workout Schedule</h3>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex-1">
            <span className="text-sm text-gray-400">Date</span>
            <div className="text-white font-medium">{formatDate(workout.startTime)}</div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-sm px-3 py-1"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={workout.startTime}
                onSelect={(date) => date && updateDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Start Time */}
        <div className="p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-400 block mb-2">Start Time</span>
          <div className="flex items-center space-x-2">
            <select
              value={startTimeHour}
              onChange={handleStartTimeHourChange}
              className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className="text-white">:</span>
            <select
              value={startTimeMinute}
              onChange={handleStartTimeMinuteChange}
              className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* End Time */}
        <div className="p-3 bg-white/5 rounded-lg">
          <span className="text-sm text-gray-400 block mb-2">End Time</span>
          <div className="flex items-center space-x-2">
            <select
              value={endTimeHour}
              onChange={handleEndTimeHourChange}
              className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className="text-white">:</span>
            <select
              value={endTimeMinute}
              onChange={handleEndTimeMinuteChange}
              className="bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
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
  );
};
