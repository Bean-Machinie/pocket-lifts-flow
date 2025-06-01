
import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Workout } from '@/types/Workout';
import { useExerciseStats } from '@/hooks/useExerciseStats';
import { useSettings } from '@/contexts/SettingsContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatsPanelProps {
  workouts: Workout[];
  onBack: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  workouts = [],
  onBack
}) => {
  const { settings } = useSettings();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
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

  // Calculate date range to include ALL workout data
  const { fromDate, toDate } = useMemo(() => {
    if (workouts.length === 0) {
      const now = new Date();
      return { 
        fromDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), 
        toDate: now 
      };
    }

    // Find the earliest and latest workout dates
    const dates = workouts.map(w => new Date(w.startTime));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));

    // Add some padding
    const from = new Date(earliest.getTime() - 24 * 60 * 60 * 1000); // 1 day before
    const to = new Date(latest.getTime() + 24 * 60 * 60 * 1000); // 1 day after

    return { fromDate: from, toDate: to };
  }, [workouts]);

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
              <p className="text-blue-300 text-sm">No workouts with {selectedExercise} found.</p>
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
