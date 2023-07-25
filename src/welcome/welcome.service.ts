import { Injectable } from '@nestjs/common';

import { CreateAssistantReqDto } from '../assistant/assistant.dto';
import { IAssistant } from '../assistant/assistant.interface';
import { AssistantService } from '../assistant/assistant.service';
import { SupabaseService } from '../supabase/supabase.service';
import en_GB from './static/en_GB.json';
import zh_CN from './static/zh_CN.json';
import { WelcomeReqDto } from './welcome.dto';

@Injectable()
export class WelcomeService {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly supabaseService: SupabaseService,
  ) {}

  getExplore(body: WelcomeReqDto) {
    const maps = {
      en_GB: en_GB,
      zh_CN: zh_CN,
    };

    return maps?.[(body.locale ?? 'en_GB') as keyof typeof maps];
  }

  async getExploreBySQL(body: WelcomeReqDto): Promise<IAssistant[]> {
    const lang = body.locale?.split('_')?.[1].toUpperCase();
    const assistants = await this.supabaseService.getAssistantList({
      source: ['AI'],
      isPublic: true,
      lang,
      status: 1,
    });

    return assistants;
  }

  async createAIAssistant(headers: Record<string, string>) {
    const data = await this.getExplore({
      locale: 'en_GB',
    });
    const temp: CreateAssistantReqDto[] = data?.map((item) => {
      return {
        name: item.nickname,
        prompt: [],
        alias: item.alias,
        avatar: item.avatar,
        model: 'gpt-3.5-turbo',
        source: 'AI',
        isPublic: true,
        configuration: {
          host: 'https://api.aios.chat/v1/chat/completions',
          stream: true,
          temperature: 0.8,
          presence_penalty: -1,
          frequency_penalty: 1,
          apiKey: '',
        },
        author: item.author,
        background: item.background,
        isTopRated: item.isTopRated,
        title: item.title,
        titleCN: item.title,
        heats: item.usedCount,
        followers: item.followerCount,
        contextExamples: item.contextExamples,
        contextExamplesCN: item.contextExamples,
      };
    });
    this.assistantService.createAssistant(headers, temp);
  }
}
