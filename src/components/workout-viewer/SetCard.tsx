import React from 'react';
import { Hash, X } from 'lucide-react';
import { Set } from '../WorkoutApp';
import { useSettings } from '@/contexts/SettingsContext';
interface SetCardProps {
  set: Set;
  index: number;
  exerciseId: string;
  onUpdateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
}
export const SetCard: React.FC<SetCardProps> = ({
  set,
  index,
  exerciseId,
  onUpdateSet,
  onDeleteSet
}) => {
  const {
    settings
  } = useSettings();
  return <div className="bg-white/10 rounded-lg p-3 relative">
      {/* Set delete button */}
      <button onClick={() => onDeleteSet(exerciseId, set.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-center space-x-2 mb-3">
        <Hash className="w-3 h-3 text-slate-200" />
        <span className="text-xs font-bold text-slate-200">Set {index + 1}</span>
      </div>
      
      {/* Weight, Reps, and Notes on same row */}
      <div className="flex items-center space-x-3 pr-8">
        <div className="flex items-center space-x-1">
          <input type="number" placeholder="0" value={set.weight || ''} onChange={e => onUpdateSet(exerciseId, set.id, 'weight', parseFloat(e.target.value) || 0)} className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-blue-400 focus:outline-none pb-1" />
          <span className="text-xs text-gray-300">{settings.weightUnit}</span>
        </div>
        
        <span className="text-gray-400">×</span>
        
        <div className="flex items-center space-x-1">
          <input type="number" placeholder="0" value={set.reps || ''} onChange={e => onUpdateSet(exerciseId, set.id, 'reps', parseInt(e.target.value) || 0)} className="w-12 bg-transparent text-white text-center text-lg font-bold border-0 border-b border-white/30 focus:border-blue-400 focus:outline-none pb-1" />
          <span className="text-xs text-gray-300">reps</span>
        </div>
        
        <div className="flex-1">
          <input type="text" placeholder="notes..." value={set.notes || ''} onChange={e => onUpdateSet(exerciseId, set.id, 'notes', e.target.value)} className="w-full bg-transparent text-white text-sm border-0 border-b border-white/30 focus:border-blue-400 focus:outline-none pb-1 placeholder:text-gray-400" />
        </div>
      </div>
    </div>;
};