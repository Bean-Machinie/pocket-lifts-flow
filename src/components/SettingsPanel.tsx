
import React from 'react';
import { X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weight Unit Setting */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Weight Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ weightUnit: 'kg' })}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  settings.weightUnit === 'kg'
                    ? 'w-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                onClick={() => updateSettings({ weightUnit: 'lbs' })}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  settings.weightUnit === 'lbs'
                    ? 'w-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Pounds (lbs)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
