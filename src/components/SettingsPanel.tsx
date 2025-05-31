
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    updateSettings
  } = useSettings();
  return <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="bg-slate-800 border-white/20">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-white">Settings Center</SheetTitle>
        </SheetHeader>

        {/* Weight Unit Setting */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Weight Unit
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => updateSettings({
              weightUnit: 'kg'
            })} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${settings.weightUnit === 'kg' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 border border-gray-600/50'}`}>
                Kilograms (kg)
              </button>
              <button onClick={() => updateSettings({
              weightUnit: 'lbs'
            })} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${settings.weightUnit === 'lbs' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/70 border border-gray-600/50'}`}>
                Pounds (lbs)
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};
