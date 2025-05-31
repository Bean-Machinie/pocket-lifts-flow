
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-slate-800 border-white/20">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-white">Settings</SheetTitle>
        </SheetHeader>

        {/* Weight Unit Setting */}
        <div className="space-y-4 mt-6">
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
      </SheetContent>
    </Sheet>
  );
};
