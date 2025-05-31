
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

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    settings,
    updateSettings
  } = useSettings();

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-card/95 backdrop-blur-sm border-l border-border shadow-xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Dark Mode Setting */}
            <div className="space-y-2">
              <Label htmlFor="dark-mode" className="text-base font-medium text-foreground">
                Dark Mode
              </Label>
              <div className="flex items-center space-x-3">
                <Switch 
                  id="dark-mode" 
                  checked={settings.isDarkMode} 
                  onCheckedChange={checked => updateSettings({ isDarkMode: checked })} 
                />
                <span className="text-sm text-muted-foreground">
                  {settings.isDarkMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Weight Unit Setting */}
            <div className="space-y-2">
              <Label className="text-base font-medium text-foreground">
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
          <div className="p-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Settings are saved automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
