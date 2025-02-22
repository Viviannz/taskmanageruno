import React, { useState, useEffect } from 'react';
import { Save, Copy, Download, Lock, Unlock, Settings, Sparkles, Send, RefreshCw, X, AlertCircle, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { saveAs } from 'file-saver';
import { useAI } from '../hooks/useAI';
import { Note } from '../types';
import { Auth } from './Auth';

interface NotepadProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Notepad({ isVisible, onClose }: NotepadProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [aiError, setAIError] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState(() => {
    const saved = localStorage.getItem('systemPrompt');
    return saved || 'You are a helpful assistant. Provide clear and concise responses.';
  });
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const { isAIEnabled, generateContent } = useAI();

  useEffect(() => {
    localStorage.setItem('systemPrompt', systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    if (isVisible) {
      checkUser();
    }
  }, [isVisible]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
      fetchNotes();
    }
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes(data || []);
  };

  const handleDelete = async (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      if (noteId === currentNoteId) {
        setCurrentNoteId(null);
        setTitle('');
        setContent('');
      }

      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuth(true);
      return;
    }

    setLoading(true);
    try {
      if (currentNoteId) {
        await supabase
          .from('notes')
          .update({
            title,
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentNoteId);
      } else {
        await supabase
          .from('notes')
          .insert([
            {
              title,
              content,
              ai_generated: false,
              user_id: user.id,
            },
          ]);
      }
      await fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
    setLoading(false);
  };

  const handleNewNote = () => {
    setCurrentNoteId(null);
    setTitle('');
    setContent('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, `${title || 'note'}.txt`);
  };

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAIError(null);
    try {
      const response = await generateContent(prompt, systemPrompt);
      // Format the response to fit within a single screen view
      const formattedResponse = response.split('\n').map(line => 
        line.length > 100 ? line.match(/.{1,100}(?:\s|$)/g)?.join('\n') : line
      ).join('\n');
      setAIResponse(formattedResponse);
    } catch (error: any) {
      setAIError(error.message);
      setAIResponse('');
    }
    setLoading(false);
  };

  const handleInsertAIResponse = () => {
    setContent((prev) => prev + (prev ? '\n\n' : '') + aiResponse);
    setAIResponse('');
    setPrompt('');
  };

  const refreshAIChat = () => {
    setAIResponse('');
    setPrompt('');
    setAIError(null);
  };

  if (!isVisible) return null;

  if (showAuth) {
    return <Auth onSuccess={() => {
      setShowAuth(false);
      fetchNotes();
    }} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Return to Tasks"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Tasks</span>
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="text-2xl font-playfair font-semibold bg-transparent border-none focus:outline-none"
            />
            {isAIEnabled ? (
              <Unlock size={20} className="text-green-600" />
            ) : (
              <Lock size={20} className="text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewNote}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New note"
            >
              <Plus size={20} className="text-blue-600" />
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Save note"
            >
              <Save size={20} className="text-blue-600" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download as .txt"
            >
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 min-h-0">
          <div className="w-64 overflow-y-auto border-r pr-4">
            <h3 className="font-medium text-gray-600 mb-3">Notes</h3>
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`group relative p-3 rounded-lg transition-colors cursor-pointer ${
                    currentNoteId === note.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setCurrentNoteId(note.id);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                >
                  <h4 className="font-medium truncate pr-8">{note.title || 'Untitled'}</h4>
                  <p className="text-sm text-gray-500 truncate">{note.content}</p>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your note..."
                className="w-full h-full resize-none bg-transparent p-4 focus:outline-none"
              />
            </div>

            {isAIEnabled && (
              <div className="mt-4 border-t pt-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" />
                    <span className="font-medium text-gray-700">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Settings size={16} />
                      {showSystemPrompt ? 'Hide System Prompt' : 'Show System Prompt'}
                    </button>
                    <button
                      onClick={refreshAIChat}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      title="Reset AI chat"
                    >
                      <RefreshCw size={16} />
                      Reset Chat
                    </button>
                  </div>
                </div>

                {showSystemPrompt && (
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Instructions
                    </label>
                    <textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Set a system prompt for this session..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      rows={2}
                    />
                  </div>
                )}

                {aiError && (
                  <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{aiError}</span>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setAIError(null);
                    }}
                    placeholder="Ask the AI assistant..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAIGenerate}
                    disabled={loading || !prompt.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send
                      </>
                    )}
                  </button>
                </div>

                {aiResponse && (
                  <div className="bg-purple-50 rounded-lg border border-purple-100 flex flex-col max-h-[200px]">
                    <div className="p-4 overflow-y-auto flex-1">
                      <div className="flex items-center gap-2 mb-2 text-purple-700">
                        <Sparkles size={16} />
                        <span className="text-sm font-medium">AI Response</span>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                        {aiResponse}
                      </pre>
                    </div>
                    <div className="p-2 bg-purple-50 border-t border-purple-100">
                      <button
                        onClick={handleInsertAIResponse}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Insert into note"
                      >
                        <Send size={16} />
                        Insert Response
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}