
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseName: string, muscleGroup: string) => void;
  onBack: () => void;
}

const MUSCLE_GROUPS = {
  chest: {
    name: 'Chest',
    color: 'from-red-500 to-pink-500',
    exercises: ['Bench Press', 'Incline Bench Press', 'Decline Bench Press', 'Dumbbell Flyes', 'Push-ups', 'Chest Dips', 'Cable Crossover']
  },
  back: {
    name: 'Back',
    color: 'from-green-500 to-emerald-500',
    exercises: ['Pull-ups', 'Lat Pulldown', 'Barbell Rows', 'Dumbbell Rows', 'Deadlifts', 'T-Bar Rows', 'Cable Rows']
  },
  shoulders: {
    name: 'Shoulders',
    color: 'from-yellow-500 to-orange-500',
    exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Arnold Press', 'Upright Rows', 'Shrugs']
  },
  arms: {
    name: 'Arms',
    color: 'from-blue-500 to-cyan-500',
    exercises: ['Bicep Curls', 'Hammer Curls', 'Tricep Dips', 'Close-Grip Bench Press', 'Preacher Curls', 'Tricep Extensions', 'Cable Curls']
  },
  legs: {
    name: 'Legs',
    color: 'from-purple-500 to-violet-500',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Curls', 'Leg Extensions', 'Calf Raises', 'Romanian Deadlifts']
  },
  core: {
    name: 'Core',
    color: 'from-indigo-500 to-purple-500',
    exercises: ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Leg Raises', 'Dead Bugs', 'Bicycle Crunches']
  }
};

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onSelectExercise,
  onBack
}) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  const handleMuscleGroupSelect = (groupKey: string) => {
    setSelectedMuscleGroup(groupKey);
  };

  const handleExerciseSelect = (exerciseName: string) => {
    if (selectedMuscleGroup) {
      onSelectExercise(exerciseName, MUSCLE_GROUPS[selectedMuscleGroup as keyof typeof MUSCLE_GROUPS].name);
    }
  };

  const handleBack = () => {
    if (selectedMuscleGroup) {
      setSelectedMuscleGroup(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen text-white p-6 animate-[slide-in-right_0.4s_cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={handleBack} className="p-2 rounded-xl bg-white/10 border border-white/20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-purple-200">
            {selectedMuscleGroup ? MUSCLE_GROUPS[selectedMuscleGroup as keyof typeof MUSCLE_GROUPS].name : 'Select Exercise'}
          </h1>
          <p className="text-purple-300 text-sm">
            {selectedMuscleGroup ? 'Choose an exercise' : 'Choose a muscle group first'}
          </p>
        </div>
      </div>

      {/* Muscle Groups */}
      {!selectedMuscleGroup && (
        <div className="space-y-3 animate-[fade-in_0.5s_ease-out_0.1s_both]">
          {Object.entries(MUSCLE_GROUPS).map(([key, group]) => (
            <button
              key={key}
              onClick={() => handleMuscleGroupSelect(key)}
              className={`w-full bg-gradient-to-r ${group.color} rounded-2xl p-6 text-left transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{group.name}</h3>
                  <p className="text-white/80 text-sm">{group.exercises.length} exercises</p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/80" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Exercises */}
      {selectedMuscleGroup && (
        <div className="space-y-3 animate-[fade-in_0.4s_ease-out]">
          {MUSCLE_GROUPS[selectedMuscleGroup as keyof typeof MUSCLE_GROUPS].exercises.map((exercise) => (
            <button
              key={exercise}
              onClick={() => handleExerciseSelect(exercise)}
              className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left border border-white/20 transform transition-all duration-200 hover:bg-white/15 hover:scale-105 active:scale-95"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-white">{exercise}</span>
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
