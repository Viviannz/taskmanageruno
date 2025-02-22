import React from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface FAQProps {
  isVisible: boolean;
  onClose: () => void;
}

export function FAQ({ isVisible, onClose }: FAQProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (!isVisible) return null;

  const faqs = [
    {
      question: "How do I get started with task management?",
      answer: "Begin by creating a new task using the form at the top of the page. Add a title, description, and optional due date. Your task will appear in the 'Active Engagements' section. As you progress, move tasks to 'Ongoing' and finally to 'Completed'."
    },
    {
      question: "Can I use the application without creating an account?",
      answer: "While you can view the application, creating an account is required to save and manage tasks. This ensures your data is securely stored and accessible across devices."
    },
    {
      question: "How does the AI assistant work?",
      answer: "The AI assistant is available in the Notepad feature. You'll need to configure your AI settings with an API key. Once set up, you can use it to generate content, get suggestions, or help with task descriptions."
    },
    {
      question: "How can I export my tasks?",
      answer: "There are two ways to export your tasks: 1) Click the 'Export to Clipboard' button to copy all tasks to your clipboard, or 2) Click 'Download Report' to save your tasks as a text file."
    },
    {
      question: "Can I import tasks from other applications?",
      answer: "Yes, you can import tasks from text files. Each line in the file will be converted into a separate task. Use the file upload area below the task creation form to import your tasks."
    },
    {
      question: "How secure is my data?",
      answer: "We use industry-standard security measures including encrypted connections and secure authentication. Your data is stored in a secure database with row-level security ensuring only you can access your information."
    }
  ];

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
          <h1 className="text-3xl font-playfair font-bold">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus size={20} className="text-gray-600" />
                ) : (
                  <Plus size={20} className="text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}