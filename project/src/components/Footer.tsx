import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 text-center space-y-4 pb-8">
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <Shield size={16} />
        <p className="text-sm">
          Your privacy is important to us. We collect and store only the information necessary to provide our services.
        </p>
      </div>
      <p className="text-gray-400 font-medium">
        Powered by{' '}
        <span className="gold-gradient font-semibold">
          Ai4this
        </span>
      </p>
    </footer>
  );
}