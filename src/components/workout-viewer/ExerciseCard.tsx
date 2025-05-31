import React from 'react';
import { Plus, X } from 'lucide-react';
import { Exercise } from '../WorkoutApp';
import { SetCard } from './SetCard';
interface ExerciseCardProps {
  exercise: Exercise;
  onUpdateSet: (exerciseId: string, setId: string, field: string, value: any) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
}
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onUpdateSet,
  onAddSet,
  onDeleteExercise,
  onDeleteSet
}) => {
  return <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 animate-scale-in relative">
      {/* Exercise delete button */}
      <button onClick={() => onDeleteExercise(exercise.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
        <X className="w-4 h-4" />
      </button>

      <div className="mb-3 pr-8">
        <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
        <p className="font-bold text-blue-300 text-sm">{exercise.muscleGroup}</p>
      </div>

      {/* Sets */}
      <div className="space-y-2 mb-3">
        {exercise.sets.map((set, index) => <SetCard key={set.id} set={set} index={index} exerciseId={exercise.id} onUpdateSet={onUpdateSet} onDeleteSet={onDeleteSet} />)}
        
        {exercise.sets.length === 0 && <p className="text-purple-300 text-sm text-center py-3">
            No sets recorded for this exercise.
          </p>}
      </div>

      {/* Add Set Button */}
      <button onClick={() => onAddSet(exercise.id)} className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95">
        <Plus className="w-4 h-4" />
        <span className="font-medium text-sm">Add Set</span>
      </button>
    </div>;
};