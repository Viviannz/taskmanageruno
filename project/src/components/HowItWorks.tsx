import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface HowItWorksProps {
  isVisible: boolean;
  onClose: () => void;
}

export function HowItWorks({ isVisible, onClose }: HowItWorksProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col p-8 shadow-2xl overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-playfair font-bold">How It Works</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4">Task Management</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Active Engagements</h3>
                  <p className="text-gray-600">Create and manage new tasks that need to be started. Add titles, descriptions, and due dates to keep organized.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Ongoing Engagements</h3>
                  <p className="text-gray-600">Track tasks currently in progress. Move tasks here when work has begun but isn't yet complete.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Completed Endeavors</h3>
                  <p className="text-gray-600">Archive finished tasks with completion timestamps for tracking your accomplishments.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4">Smart Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">AI-Powered Notes</h3>
                  <p className="text-gray-600">Use our AI assistant to help generate content, brainstorm ideas, or get suggestions for your tasks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Data Export</h3>
                  <p className="text-gray-600">Export your tasks to clipboard or download as a text file for easy sharing and backup.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">File Import</h3>
                  <p className="text-gray-600">Import tasks from text files to quickly set up your task list from existing documents.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-playfair font-semibold mb-4">Account Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Secure Authentication</h3>
                  <p className="text-gray-600">Create an account to save your tasks and notes securely in the cloud, accessible from anywhere.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div>
                  <h3 className="font-medium text-lg">Data Synchronization</h3>
                  <p className="text-gray-600">All your tasks and notes are automatically synced across devices when you're signed in.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}