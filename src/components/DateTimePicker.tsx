
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: Date) => void;
  initialDate: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Generate arrays for the pickers
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const updateDate = (field: string, value: number) => {
    const newDate = new Date(selectedDate);
    switch (field) {
      case 'year':
        newDate.setFullYear(value);
        break;
      case 'month':
        newDate.setMonth(value);
        break;
      case 'day':
        newDate.setDate(value);
        break;
      case 'hour':
        newDate.setHours(value);
        break;
      case 'minute':
        newDate.setMinutes(value);
        break;
    }
    setSelectedDate(newDate);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-gray-900 border-gray-700 text-white">
        <DrawerHeader>
          <DrawerTitle className="text-center text-white">Edit Date & Time</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-6 pb-6">
          {/* Date Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Date</h3>
            <div className="flex justify-center space-x-4">
              {/* Month */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Month</label>
                <select
                  value={selectedDate.getMonth()}
                  onChange={(e) => updateDate('month', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month.substring(0, 3)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Day</label>
                <select
                  value={selectedDate.getDate()}
                  onChange={(e) => updateDate('day', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Year</label>
                <select
                  value={selectedDate.getFullYear()}
                  onChange={(e) => updateDate('year', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Time</h3>
            <div className="flex justify-center space-x-4">
              {/* Hour */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Hour</label>
                <select
                  value={selectedDate.getHours()}
                  onChange={(e) => updateDate('hour', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
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
                  onChange={(e) => updateDate('minute', parseInt(e.target.value))}
                  className="bg-gray-800 text-white rounded-lg px-3 py-2 text-center border border-gray-600 focus:border-blue-500 focus:outline-none"
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
              Save
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
