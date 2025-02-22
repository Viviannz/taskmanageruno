import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      alert('Please upload a .txt file');
      e.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      onFileUpload(text);
      e.target.value = '';
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file');
    }
  }, [onFileUpload]);

  return (
    <div className="mt-8">
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center gap-3 px-6 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <Upload size={22} className="text-gray-600" />
        <span className="text-gray-600 font-medium">Import tasks from file (.txt)</span>
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}