import React from 'react';
import { CheckCircle, Trash2, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onToggle?: (id: number) => void;
  onComplete?: (id: number) => void;
  onDelete: (id: number, status: 'active' | 'ongoing' | 'completed') => void;
  type: 'active' | 'ongoing' | 'completed';
  actionLabel?: string;
}

export function TaskList({ 
  title, 
  tasks, 
  onToggle, 
  onComplete,
  onDelete, 
  type,
  actionLabel 
}: TaskListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'active':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'ongoing':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'completed':
        return 'bg-green-50 hover:bg-green-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-2xl">
      <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8 italic">No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-xl shadow-md transition-all ${getBackgroundColor()}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-lg">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  )}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span className="font-medium">Created: {formatDate(task.createdAt)}</span>
                    </div>
                    {task.dueDate && (type === 'active' || type === 'ongoing') && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        <span className="font-medium">Due: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                    {task.completedAt && type === 'completed' && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle size={16} className="mr-2" />
                        <span className="font-medium">Completed: {formatDate(task.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {type !== 'completed' && (onToggle || onComplete) && (
                    <button
                      onClick={() => {
                        if (type === 'active' && onToggle) {
                          onToggle(task.id);
                        } else if (onComplete) {
                          onComplete(task.id);
                        }
                      }}
                      className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                      title={actionLabel}
                    >
                      {type === 'active' ? (
                        <ArrowRight size={22} className="text-blue-600" />
                      ) : (
                        <CheckCircle size={22} className="text-green-600" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(task.id, type)}
                    className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={22} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}