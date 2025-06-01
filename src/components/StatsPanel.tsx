import React from 'react';
import { ArrowLeft } from 'lucide-react';
interface StatsPanelProps {
  onBack: () => void;
}
export const StatsPanel: React.FC<StatsPanelProps> = ({
  onBack
}) => {
  return <div className="min-h-screen text-white p-6 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-4">
          <ArrowLeft className="w-8 h-8 text-slate-200" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-purple-300 bg-clip-text text-transparent">
            Your Stats
          </h1>
          <p className="text-purple-300 text-lg">Track your progress</p>
        </div>
      </div>

      {/* Empty content area - ready for future additions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
        <p className="text-slate-200 mb-2">Stats coming soon!</p>
        <p className="text-purple-300 text-sm">This panel will show your workout statistics and progress.</p>
      </div>
    </div>;
};