
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StatsPanelProps {
  onBack: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  onBack
}) => {
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
        {/* Empty content area - ready for future additions */}
        <div className="mt-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
            <p className="text-slate-200 mb-2">Stats coming soon!</p>
            <p className="text-blue-300 text-sm">This panel will show your workout statistics and progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
