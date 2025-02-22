import React, { useState } from 'react';
import { Settings, Key, Lock, Unlock, AlertCircle } from 'lucide-react';
import { useAI } from '../hooks/useAI';

interface AISettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AISettings({ isVisible, onClose }: AISettingsProps) {
  const { config, updateConfig } = useAI();
  const [provider, setProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    updateConfig({ provider, apiKey, isActive: true });
    onClose();
  };

  const handleLock = () => {
    if (window.confirm('Are you sure you want to delete your API key? This action cannot be undone.')) {
      updateConfig({ provider: 'openai', apiKey: '', isActive: false });
      setApiKey('');
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-gray-700" />
            <h2 className="text-2xl font-playfair font-semibold">AI Settings</h2>
          </div>
          {config.isActive && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Unlock size={16} />
                Key Active
              </span>
              <button
                onClick={handleLock}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove API key and lock AI features"
              >
                <Lock size={16} />
                Delete Key
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'openai' | 'anthropic' | 'claude' | 'deepseek')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={config.isActive}
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="claude">Claude</option>
              <option value="deepseek">Deepseek</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <Key size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder={config.isActive ? '••••••••••••••••' : 'Enter your API key'}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                disabled={config.isActive}
              />
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {!config.isActive && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Unlock size={18} />
                Save & Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}