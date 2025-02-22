import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (title: string, description: string, dueDate: Date | undefined) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(
        title.trim(),
        description.trim(),
        dueDate ? new Date(dueDate) : undefined
      );
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium transition-all"
          required
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          className="w-full px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium transition-all resize-none"
          rows={3}
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Calendar size={20} className="text-gray-400" />
        </div>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium transition-all"
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg font-medium"
      >
        <Plus size={20} /> Create New Task
      </button>
    </form>
  );
}