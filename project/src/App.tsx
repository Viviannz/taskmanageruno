import React, { useState, useEffect } from 'react';
import { Download, Clipboard, Crown, FileText, Settings, LogIn, LogOut, HelpCircle, BookOpen } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { AddTaskForm } from './components/AddTaskForm';
import { FileUploader } from './components/FileUploader';
import { Toast } from './components/Toast';
import { Notepad } from './components/Notepad';
import { AISettings } from './components/AISettings';
import { Auth } from './components/Auth';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Task } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [ongoingTasks, setOngoingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showNotepad, setShowNotepad] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [user, setUser] = useState(supabase.auth.getUser());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showNotification('Error signing out', 'error');
    } else {
      showNotification('Successfully signed out');
    }
  };

  const addTask = (title: string, description: string, dueDate: Date | undefined) => {
    if (!title.trim()) {
      showNotification('Task title is required', 'error');
      return;
    }
    
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
      status: 'active',
    };
    setActiveTasks((prev) => [...prev, newTask]);
    showNotification('Task added successfully!');
  };

  const moveToOngoing = (taskId: number) => {
    const task = activeTasks.find((t) => t.id === taskId);
    if (task) {
      setActiveTasks((prev) => prev.filter((t) => t.id !== taskId));
      setOngoingTasks((prev) => [...prev, { ...task, status: 'ongoing' }]);
      showNotification('Task marked as ongoing!');
    }
  };

  const moveToCompleted = (taskId: number, fromOngoing: boolean = false) => {
    const task = fromOngoing 
      ? ongoingTasks.find((t) => t.id === taskId)
      : activeTasks.find((t) => t.id === taskId);
    
    if (task) {
      if (fromOngoing) {
        setOngoingTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        setActiveTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
      setCompletedTasks((prev) => [...prev, { 
        ...task, 
        completed: true, 
        completedAt: new Date(),
        status: 'completed'
      }]);
      showNotification('Task completed!');
    }
  };

  const deleteTask = (taskId: number, status: 'active' | 'ongoing' | 'completed') => {
    switch (status) {
      case 'active':
        setActiveTasks((prev) => prev.filter((t) => t.id !== taskId));
        break;
      case 'ongoing':
        setOngoingTasks((prev) => prev.filter((t) => t.id !== taskId));
        break;
      case 'completed':
        setCompletedTasks((prev) => prev.filter((t) => t.id !== taskId));
        break;
    }
    showNotification('Task deleted');
  };

  const copyToClipboard = () => {
    const allTasks = [
      '=== New Engagements ===',
      ...activeTasks.map((t) => {
        const dueDate = t.dueDate ? ` (Due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `- ${t.title}${dueDate}${t.description ? `: ${t.description}` : ''}`;
      }),
      '\n=== Ongoing Engagements ===',
      ...ongoingTasks.map((t) => {
        const dueDate = t.dueDate ? ` (Due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `○ ${t.title}${dueDate}${t.description ? `: ${t.description}` : ''}`;
      }),
      '\n=== Completed Endeavors ===',
      ...completedTasks.map((t) => {
        const completedDate = t.completedAt ? ` (Completed: ${new Date(t.completedAt).toLocaleString()})` : '';
        return `✓ ${t.title}${completedDate}${t.description ? `: ${t.description}` : ''}`;
      }),
    ].join('\n');

    navigator.clipboard.writeText(allTasks).then(
      () => showNotification('Tasks copied to clipboard!'),
      () => showNotification('Failed to copy tasks', 'error')
    );
  };

  const downloadAsTxt = () => {
    const allTasks = [
      '=== New Engagements ===',
      ...activeTasks.map((t) => {
        const dueDate = t.dueDate ? ` (Due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `- ${t.title}${dueDate}${t.description ? `: ${t.description}` : ''}`;
      }),
      '\n=== Ongoing Engagements ===',
      ...ongoingTasks.map((t) => {
        const dueDate = t.dueDate ? ` (Due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `○ ${t.title}${dueDate}${t.description ? `: ${t.description}` : ''}`;
      }),
      '\n=== Completed Endeavors ===',
      ...completedTasks.map((t) => {
        const completedDate = t.completedAt ? ` (Completed: ${new Date(t.completedAt).toLocaleString()})` : '';
        return `✓ ${t.title}${completedDate}${t.description ? `: ${t.description}` : ''}`;
      }),
    ].join('\n');

    const blob = new Blob([allTasks], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'executive-tasks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Tasks downloaded successfully!');
  };

  const handleFileUpload = async (content: string) => {
    try {
      const lines = content.split('\n').filter((line) => line.trim());
      const newTasks = lines.map((line) => ({
        id: Date.now() + Math.random(),
        title: line.trim(),
        description: '',
        completed: false,
        createdAt: new Date(),
        status: 'active' as const,
      }));
      setActiveTasks((prev) => [...prev, ...newTasks]);
      showNotification(`${newTasks.length} tasks imported successfully!`);
    } catch (error) {
      showNotification('Failed to import tasks', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-luxury font-inter p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotepad(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                <FileText size={20} />
                Notepad
              </button>
              <button
                onClick={() => setShowAISettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                <Settings size={20} />
                AI Settings
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                <BookOpen size={20} />
                How it Works
              </button>
              <button
                onClick={() => setShowFAQ(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                <HelpCircle size={20} />
                FAQ
              </button>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white/80">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-100 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-100 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <LogIn size={20} />
                  Sign In
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-3">
            <Crown size={32} className="text-yellow-300 mr-2" />
          </div>
          <h1 className="font-playfair text-5xl font-bold gold-gradient mb-3">Executive Task Suite</h1>
          <p className="text-gray-300 text-lg">Elevate your productivity with sophistication</p>
        </header>

        <div className="bg-card rounded-2xl p-8 mb-10 shadow-2xl">
          <AddTaskForm onAddTask={addTask} />
          <FileUploader onFileUpload={handleFileUpload} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TaskList
            title="New Engagements"
            tasks={activeTasks}
            onToggle={moveToOngoing}
            onComplete={moveToCompleted}
            onDelete={deleteTask}
            type="active"
            actionLabel="Start Progress"
          />
          <TaskList
            title="Ongoing Engagements"
            tasks={ongoingTasks}
            onComplete={(id) => moveToCompleted(id, true)}
            onDelete={deleteTask}
            type="ongoing"
            actionLabel="Complete"
          />
          <TaskList
            title="Completed Endeavors"
            tasks={completedTasks}
            onDelete={deleteTask}
            type="completed"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-6 justify-center">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-3 px-8 py-4 bg-white/95 text-gray-800 rounded-xl hover:bg-white transition-all shadow-lg font-medium"
          >
            <Clipboard size={20} /> Export to Clipboard
          </button>
          <button
            onClick={downloadAsTxt}
            className="flex items-center gap-3 px-8 py-4 bg-white/95 text-gray-800 rounded-xl hover:bg-white transition-all shadow-lg font-medium"
          >
            <Download size={20} /> Download Report
          </button>
        </div>

        <Footer />
      </div>

      <Notepad isVisible={showNotepad} onClose={() => setShowNotepad(false)} />
      <AISettings isVisible={showAISettings} onClose={() => setShowAISettings(false)} />
      <HowItWorks isVisible={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <FAQ isVisible={showFAQ} onClose={() => setShowFAQ(false)} />
      {showAuth && (
        <Auth onSuccess={() => {
          setShowAuth(false);
          showNotification('Successfully signed in!');
        }} />
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}