import { create } from 'zustand';
import OpenAI from 'openai';
import { AIConfig } from '../types';

interface AIStore {
  config: AIConfig;
  updateConfig: (config: AIConfig) => void;
}

const useAIStore = create<AIStore>((set) => ({
  config: {
    provider: 'openai',
    apiKey: '',
    isActive: false,
  },
  updateConfig: (config) => set({ config }),
}));

export function useAI() {
  const { config, updateConfig } = useAIStore();

  const generateContent = async (prompt: string, systemPrompt?: string) => {
    if (!config.isActive || !config.apiKey) {
      throw new Error('AI is not configured. Please add your API key in settings.');
    }

    try {
      switch (config.provider) {
        case 'openai':
          const openai = new OpenAI({
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true,
          });

          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: systemPrompt || 'You are a helpful assistant. Provide clear and concise responses.',
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          });

          const content = completion.choices[0]?.message?.content;
          if (!content) {
            throw new Error('No response received from AI');
          }

          return content;

        case 'anthropic':
        case 'claude':
          // Claude API endpoint
          const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': config.apiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-2',
              max_tokens: 1000,
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ],
              system: systemPrompt || 'You are a helpful assistant. Provide clear and concise responses.'
            })
          });

          if (!claudeResponse.ok) {
            throw new Error('Failed to get response from Claude');
          }

          const claudeData = await claudeResponse.json();
          return claudeData.content;

        case 'deepseek':
          // Deepseek API endpoint
          const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                {
                  role: 'system',
                  content: systemPrompt || 'You are a helpful assistant. Provide clear and concise responses.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 1000,
              temperature: 0.7
            })
          });

          if (!deepseekResponse.ok) {
            throw new Error('Failed to get response from Deepseek');
          }

          const deepseekData = await deepseekResponse.json();
          return deepseekData.choices[0]?.message?.content;

        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);

      if (error?.response?.status === 401) {
        throw new Error('Invalid API key. Please check your settings and try again.');
      }
      
      if (error?.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // If it's our custom error, throw it directly
      if (error instanceof Error) {
        throw error;
      }

      // For any other errors, throw a generic message
      throw new Error('Failed to generate content. Please try again.');
    }
  };

  return {
    isAIEnabled: config.isActive && !!config.apiKey,
    config,
    updateConfig,
    generateContent,
  };
}