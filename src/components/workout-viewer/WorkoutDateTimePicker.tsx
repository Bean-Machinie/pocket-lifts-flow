
import React, { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WorkoutDateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: Date) => void;
  initialDate: Date;
  title: string;
  description?: string;
}

export const WorkoutDateTimePicker: React.FC<WorkoutDateTimePickerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  title,
  description
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Generate arrays for the time pickers
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const updateTime = (field: 'hour' | 'minute', value: number) => {
    const newDate = new Date(selectedDate);
    if (field === 'hour') {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }
    setSelectedDate(newDate);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-gray-900 border-gray-700 text-white">
        <DrawerHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-white text-lg font-semibold">{title}</DrawerTitle>
              {description && (
                <p className="text-gray-400 text-sm mt-1">{description}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </DrawerHeader>
        
        <div className="px-6 pb-6 pt-4">
          {/* Current Selection Display */}
          <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Selected Date & Time</span>
            </div>
            <div className="text-white font-medium">
              {formatDateTime(selectedDate)}
            </div>
          </div>

          {/* Date Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Date</span>
            </h3>
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                      "max-w-sm"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Time</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Hour</label>
                <select
                  value={selectedDate.getHours()}
                  onChange={(e) => updateTime('hour', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none w-full"
                >
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minute */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Minute</label>
                <select
                  value={selectedDate.getMinutes()}
                  onChange={(e) => updateTime('minute', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none w-full"
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

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
