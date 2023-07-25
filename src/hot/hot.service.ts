import {Injectable} from '@nestjs/common';
import {shuffleArray} from '../common/utils';
import {SupabaseService} from '../supabase/supabase.service';
import {HotReqDto} from './hot.dto';
import en_GB from './static/en_GB.json';
import zh_CN from './static/zh_CN.json';

@Injectable()
export class HotService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getHot(params: HotReqDto) {
    const system_assistants = await this.supabaseService.getAssistantList({
      source: ['system'],
      isPublic: true,
      status: 1,
    });

    const gpt3 =
      system_assistants.find((item) => item.model === 'gpt-3.5-turbo') ?? {};

    const maps = {
      en_GB: en_GB.map((item) => {
        return {
          ...item,
          assistant: gpt3,
        };
      }),
      zh_CN: zh_CN.map((item) => {
        return {
          ...item,
          assistant: gpt3,
        };
      }),
    };

    const count = isNaN(+params.count) ? 10 : +params.count;

    return shuffleArray(
      maps?.[(params.locale ?? 'en_GB') as keyof typeof maps],
    )?.slice(0, count);
  }
}
