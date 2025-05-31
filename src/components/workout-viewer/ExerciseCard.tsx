
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
  return (
    <div className="bg-card backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm animate-scale-in relative">
      {/* Exercise delete button */}
      <button
        onClick={() => onDeleteExercise(exercise.id)}
        className="absolute top-2 right-2 text-destructive hover:text-destructive/80 p-1"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="mb-3 pr-8">
        <h3 className="text-lg font-semibold text-card-foreground">{exercise.name}</h3>
        <p className="text-muted-foreground text-sm">{exercise.muscleGroup}</p>
      </div>

      {/* Sets */}
      <div className="space-y-2 mb-3">
        {exercise.sets.map((set, index) => (
          <SetCard
            key={set.id}
            set={set}
            index={index}
            exerciseId={exercise.id}
            onUpdateSet={onUpdateSet}
            onDeleteSet={onDeleteSet}
          />
        ))}
        
        {exercise.sets.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-3">
            No sets recorded for this exercise.
          </p>
        )}
      </div>

      {/* Add Set Button */}
      <button
        onClick={() => onAddSet(exercise.id)}
        className="w-full bg-accent text-accent-foreground border border-border rounded-lg p-2.5 flex items-center justify-center space-x-2 hover:bg-accent/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium text-sm">Add Set</span>
      </button>
    </div>
  );
};
