/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IAssistant {
  id: number;
  name: string;
  prompt: IAssistantPrompt[];
  avatar: string;
  heats: number;
  followers: number;
  model: string;
  source: ISource;
  userId: string;
  isPublic: boolean;
  configuration: IConfiguration;
  alias: string;
  author: string;
  background: string;
  isTopRated: boolean;
  title: string;
  contextExamples: string[];
}

export interface IConfiguration {
  host: string;
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
  stream: boolean;
  apiKey: string;
}

export interface IAssistantPrompt {
  role: string;
  content: string;
}

export type ICreateAssistant = Omit<IAssistant, 'id'>;

/**
 * user: 用户创建
 * AI：ai创建
 * system：系统预置
 */
export type ISource = 'user' | 'AI' | 'system';
