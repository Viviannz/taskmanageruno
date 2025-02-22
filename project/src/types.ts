export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  status: 'active' | 'ongoing' | 'completed';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'claude' | 'deepseek';
  apiKey: string;
  isActive: boolean;
}