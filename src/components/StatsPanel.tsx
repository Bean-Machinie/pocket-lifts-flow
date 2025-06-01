
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Workout } from '@/types/Workout';
import { useExerciseStats } from '@/hooks/useExerciseStats';
import { useSettings } from '@/contexts/SettingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  workouts: Workout[];
  onBack: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  workouts = [], // Default to empty array to prevent undefined errors
  onBack
}) => {
  const { settings } = useSettings();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [dateRange, setDateRange] = useState<'1d' | '7d' | '30d' | 'custom'>('1d');
  const [customFromDate, setCustomFromDate] = useState<Date | undefined>();
  const [customToDate, setCustomToDate] = useState<Date | undefined>();
  const [dataType, setDataType] = useState<'both' | 'average' | 'max'>('both');

  // Get unique exercise names
  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        names.add(exercise.name);
      });
    });
    return Array.from(names).sort();
  }, [workouts]);

  // Calculate date range
  const { fromDate, toDate } = useMemo(() => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    if (dateRange === '1d') {
      from = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '7d') {
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30d') {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      from = customFromDate || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      to = customToDate || now;
    }

    return { fromDate: from, toDate: to };
  }, [dateRange, customFromDate, customToDate]);

  const exerciseData = useExerciseStats(workouts, selectedExercise, fromDate, toDate);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen text-white flex flex-col animate-slide-in-right">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-800/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center p-6 bg-purple-600 dark:bg-slate-800">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors mr-1">
              <ArrowLeft className="w-8 h-8 text-slate-200" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-200">Your Stats</h1>
              <p className="text-blue-300 text-lg">Track your progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="mt-4 mb-6 space-y-6">
          {/* Exercise Picker */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <label className="block text-slate-200 text-sm font-medium mb-3">Select Exercise</label>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose an exercise..." />
              </SelectTrigger>
              <SelectContent>
                {exerciseNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Type Picker */}
          {selectedExercise && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <label className="block text-slate-200 text-sm font-medium mb-3">Data Display</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDataType('both')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dataType === 'both' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setDataType('average')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dataType === 'average' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  Average
                </button>
                <button
                  onClick={() => setDataType('max')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    dataType === 'max' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  PR (Max)
                </button>
              </div>
            </div>
          )}

          {/* Date Range Picker */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <label className="block text-slate-200 text-sm font-medium mb-3">Time Period</label>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setDateRange('1d')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === '1d' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                1 day
              </button>
              <button
                onClick={() => setDateRange('7d')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === '7d' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === '30d' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                30 days
              </button>
              <button
                onClick={() => setDateRange('custom')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === 'custom' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Custom
              </button>
            </div>

            {dateRange === 'custom' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 text-xs mb-2">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                            !customFromDate && "text-slate-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {customFromDate ? format(customFromDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={customFromDate}
                          onSelect={setCustomFromDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-xs mb-2">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                            !customToDate && "text-slate-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {customToDate ? format(customToDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={customToDate}
                          onSelect={setCustomToDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          {selectedExercise && exerciseData.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                {selectedExercise} - Weight Progress
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#9CA3AF"
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      label={{ 
                        value: `Weight (${settings.weightUnit})`, 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fill: '#9CA3AF' }
                      }}
                    />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value as string)}
                      formatter={(value: number, name: string) => [
                        `${value} ${settings.weightUnit}`, 
                        name === 'avgWeight' ? 'Average Weight' : 'Max Weight (PR)'
                      ]}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    {(dataType === 'both' || dataType === 'average') && (
                      <Line 
                        type="monotone" 
                        dataKey="avgWeight" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        name="avgWeight"
                      />
                    )}
                    {(dataType === 'both' || dataType === 'max') && (
                      <Line 
                        type="monotone" 
                        dataKey="maxWeight" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                        name="maxWeight"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Stats Summary */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">Total Workouts</div>
                  <div className="text-lg font-bold text-white">{exerciseData.length}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400">All-Time PR</div>
                  <div className="text-lg font-bold text-red-400">
                    {Math.max(...exerciseData.map(d => d.maxWeight))} {settings.weightUnit}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedExercise ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
              <p className="text-slate-200 mb-2">No data found</p>
              <p className="text-blue-300 text-sm">No workouts with {selectedExercise} in the selected time period.</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
              <p className="text-slate-200 mb-2">Stats coming soon!</p>
              <p className="text-blue-300 text-sm">Select an exercise above to see your weight progress over time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
