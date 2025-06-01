import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
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
  const [showTimeEdit, setShowTimeEdit] = useState(false);

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
    return new Date(workout.startTime.getTime() + workout.duration * 1000);
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

  // Generate arrays for the time pickers
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 5-minute intervals

  const endTime = getEndTime();

  return (
    <div className="px-6 pb-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Schedule</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTimeEdit(!showTimeEdit)}
            className="text-blue-400 hover:text-blue-300 p-2"
          >
            <Clock className="w-4 h-4 mr-1" />
            Edit Times
            <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", showTimeEdit && "rotate-180")} />
          </Button>
        </div>

        {/* Date Display */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex-1">
            <span className="text-sm text-gray-400">Date</span>
            <div className="text-white font-medium text-lg">{formatDate(workout.startTime)}</div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 text-sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Change
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

        {/* Time Range Display */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Time Range</span>
            <span className="text-xs text-gray-500">
              {Math.floor(workout.duration / 60)} min
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">{formatTime(workout.startTime)}</div>
              <div className="text-xs text-gray-400">Start</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">{formatTime(endTime)}</div>
              <div className="text-xs text-gray-400">End</div>
            </div>
          </div>
        </div>

        {/* Time Edit Panel */}
        {showTimeEdit && (
          <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
            {/* Start Time */}
            <div>
              <label className="text-sm text-gray-400 block mb-3">Start Time</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Hour</span>
                  <select
                    value={workout.startTime.getHours()}
                    onChange={(e) => updateStartTime(parseInt(e.target.value), workout.startTime.getMinutes())}
                    className="w-full bg-gray-800/80 text-white rounded-lg px-3 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-lg font-medium"
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Minutes</span>
                  <select
                    value={workout.startTime.getMinutes()}
                    onChange={(e) => updateStartTime(workout.startTime.getHours(), parseInt(e.target.value))}
                    className="w-full bg-gray-800/80 text-white rounded-lg px-3 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-lg font-medium"
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

            {/* End Time */}
            <div>
              <label className="text-sm text-gray-400 block mb-3">End Time</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Hour</span>
                  <select
                    value={endTime.getHours()}
                    onChange={(e) => updateEndTime(parseInt(e.target.value), endTime.getMinutes())}
                    className="w-full bg-gray-800/80 text-white rounded-lg px-3 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-lg font-medium"
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Minutes</span>
                  <select
                    value={endTime.getMinutes()}
                    onChange={(e) => updateEndTime(endTime.getHours(), parseInt(e.target.value))}
                    className="w-full bg-gray-800/80 text-white rounded-lg px-3 py-3 text-center border border-gray-600 focus:border-blue-500 focus:outline-none text-lg font-medium"
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
        )}
      </div>
    </div>
  );
};
