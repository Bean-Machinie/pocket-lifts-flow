
import { renderHook } from '@testing-library/react';
import { useExerciseStats } from '@/hooks/useExerciseStats';
import { Workout } from '@/types/Workout';

const mockWorkouts: Workout[] = [
  {
    id: '1',
    startTime: new Date('2024-01-01'),
    duration: 3600,
    totalSets: 3,
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { weight: 100, reps: 10 },
          { weight: 105, reps: 8 },
          { weight: 110, reps: 6 }
        ]
      }
    ]
  },
  {
    id: '2',
    startTime: new Date('2024-01-02'),
    duration: 3600,
    totalSets: 2,
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { weight: 115, reps: 5 },
          { weight: 120, reps: 3 }
        ]
      }
    ]
  }
];

describe('useExerciseStats', () => {
  it('should return correct daily averages for an exercise', () => {
    const { result } = renderHook(() => 
      useExerciseStats(
        mockWorkouts,
        'Bench Press',
        new Date('2024-01-01'),
        new Date('2024-01-03')
      )
    );

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toEqual({
      date: '2024-01-01',
      avgWeight: 105 // (100 + 105 + 110) / 3
    });
    expect(result.current[1]).toEqual({
      date: '2024-01-02',
      avgWeight: 117.5 // (115 + 120) / 2
    });
  });

  it('should return empty array for non-existent exercise', () => {
    const { result } = renderHook(() => 
      useExerciseStats(
        mockWorkouts,
        'Squats',
        new Date('2024-01-01'),
        new Date('2024-01-03')
      )
    );

    expect(result.current).toHaveLength(0);
  });

  it('should filter workouts by date range', () => {
    const { result } = renderHook(() => 
      useExerciseStats(
        mockWorkouts,
        'Bench Press',
        new Date('2024-01-02'),
        new Date('2024-01-03')
      )
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].date).toBe('2024-01-02');
  });
});
