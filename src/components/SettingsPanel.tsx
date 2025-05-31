
import React from 'react';
import { X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Dark Mode Setting */}
            <div className="space-y-2">
              <Label htmlFor="dark-mode" className="text-base font-medium text-gray-900 dark:text-white">
                Dark Mode
              </Label>
              <div className="flex items-center space-x-3">
                <Switch
                  id="dark-mode"
                  checked={settings.isDarkMode}
                  onCheckedChange={(checked) => updateSettings({ isDarkMode: checked })}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {settings.isDarkMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Weight Unit Setting */}
            <div className="space-y-2">
              <Label className="text-base font-medium text-gray-900 dark:text-white">
                Weight Unit
              </Label>
              <div className="flex space-x-2">
                <Button
                  variant={settings.weightUnit === 'kg' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ weightUnit: 'kg' })}
                  className="flex-1"
                >
                  Kilograms (kg)
                </Button>
                <Button
                  variant={settings.weightUnit === 'lbs' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ weightUnit: 'lbs' })}
                  className="flex-1"
                >
                  Pounds (lbs)
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Settings are saved automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
