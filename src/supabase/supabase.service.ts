/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { AccountReqDto } from '../account/account.dto';
import { IAccountBase } from '../account/account.interface';
import {
  GetAssistantListReqDto,
  GetAssistantResDto,
} from '../assistant/assistant.dto';
import { ICreateAssistant, IAssistant } from '../assistant/assistant.interface';
import { SupabaseError } from '../common/response';

@Injectable()
export class SupabaseService {
  private supabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabaseClient = createClient(
      this.configService.get<string>('PUBLIC_SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
  }

  async getUserId(token: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('api_keys')
        .select('user_id')
        .eq('api_key', token)
        .maybeSingle();
      if (error) throw error;
      return data?.user_id;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getAccountApiKey(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('api_keys')
        .select('api_key')
        .eq('user_id', userId);
      if (error) return [];
      return data?.map((item) => item.api_key);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getAccountBase(userId: string): Promise<IAccountBase> {
    const defaultBase = {
      nickName: '',
      avatar: '',
      followId: [],
    };
    try {
      const { data, error } = await this.supabaseClient
        .from('accounts')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        const { error: insertError } = await this.supabaseClient
          .from('accounts')
          .insert({
            nickName: defaultBase.nickName,
            avatar: defaultBase.avatar,
            userId: userId,
            followId: defaultBase.followId,
          });
        if (insertError) throw insertError;
        return defaultBase;
      }
      return {
        nickName: data?.['nickName'],
        avatar: data?.['avatar'],
        followId: data?.['followId'],
      };
    } catch (err) {
      console.error(err);
      return defaultBase;
    }
  }

  async updateAccountBase(userId: string, base: AccountReqDto): Promise<void> {
    try {
      const { error } = await this.supabaseClient
        .from('accounts')
        .update({ nick_name: base.nickName, avatar: base.avatar })
        .match({ userId: userId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAccountTotalPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabaseClient
        .from('wallets')
        .select('points')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data?.points ?? 0;
    } catch (error) {
      return 0;
    }
  }

  async getUserIdByJWT(jwt: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabaseClient.auth.getUser(jwt);
      if (error) throw error;
      return data?.user?.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createAccount(userId: string, payload?: IAccountBase): Promise<null> {
    try {
      const insert = await this.supabaseClient.from('accounts').insert({
        userId: userId,
        followId: payload?.followId,
        nickName: payload?.nickName,
        avatar: payload?.avatar,
      });
      if (insert?.error) throw insert.error;
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAccountById(userId: string): Promise<IAccountBase | null> {
    try {
      const account = await this.supabaseClient
        .from('accounts')
        .select('*')
        .eq('userId', userId)
        .maybeSingle();
      if (account?.error) throw account.error;
      if (!account?.data) return null;
      return {
        nickName: account.data?.['nick_name'],
        avatar: account.data?.['avatar'],
        followId: account.data?.['follow_id'],
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateAccount(
    userId: string,
    params?: {
      followId: number[];
    },
  ): Promise<null> {
    try {
      const update = await this.supabaseClient
        .from('accounts')
        .update({ followId: params?.followId })
        .eq('userId', userId);
      if (update?.error) throw update.error;
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async upload(file: Express.Multer.File, folder?: string): Promise<string> {
    try {
      const bucketName = 'static';
      const dirPath = `${folder ? './' + folder + '/' : './'}`;
      const ext = file.originalname.split('.').pop();
      const fileName = `${dirPath}${crypto
        .randomBytes(6)
        .toString('base64')}.${ext}`;
      const { data, error } = await this.supabaseClient.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          upsert: true,
          contentType: `image/${ext}`,
        });
      if (error) {
        throw error;
      }
      const domain =
        this.configService.get<string>('PUBLIC_SUPABASE_URL') ?? '';
      const staticPath = '/storage/v1/object/public/static/';
      return `${domain}${staticPath}${data.path.replace('./', '')}`;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async createAssistant(
    payload: ICreateAssistant[],
  ): Promise<null | SupabaseError> {
    try {
      const rows =
        payload?.map((item) => {
          return {
            name: item.name,
            avatar: item.avatar,
            model: item.model,
            source: item.source,
            prompt: item.prompt,
            isPublic: item.isPublic,
            userId: item.userId,
            heats: item.heats,
            followers: item.followers,
            configuration: item.configuration,
            alias: item.alias,
            author: item.author,
            background: item.background,
            isTopRated: item.isTopRated,
            title: item.title,
          };
        }) ?? [];
      const { error: insertError } = await this.supabaseClient
        .from('ai_assistants')
        .insert(rows);
      if (insertError) throw insertError;
      return null;
    } catch (err) {
      console.error(err);
      return err as SupabaseError;
    }
  }

  async getAssistantList(
    payload?: GetAssistantListReqDto,
  ): Promise<IAssistant[]> {
    try {
      let query = this.supabaseClient.from('ai_assistants').select('*');
      if (payload?.isPublic !== undefined) {
        query = query.eq('isPublic', payload.isPublic);
      }
      if (payload?.status !== undefined) {
        query = query.eq('status', payload.status);
      }
      if (payload?.source !== undefined) {
        query = query.in('source', payload.source);
      }
      if (payload?.userId !== undefined) {
        query = query.eq('userId', payload.userId);
      }
      if (payload?.id !== undefined && Array.isArray(payload.id)) {
        query = query.in('id', payload.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (
        data?.map((item) => {
          const lang =
            payload?.lang?.toUpperCase() &&
            payload?.lang?.toUpperCase() !== 'GB'
              ? payload?.lang?.toUpperCase()
              : '';
          const titleKey = lang ? `title${lang}` : 'title';
          const contextExamplesKey = lang
            ? `contextExamples${lang}`
            : 'contextExamples';
          return {
            id: item.id,
            name: item.name,
            prompt: item.prompt,
            avatar: item.avatar,
            heats: item.heats,
            followers: item.followers,
            model: item.model,
            source: item.source,
            userId: item.userId,
            isPublic: item.isPublic,
            alias: item.alias,
            configuration: item.configuration,
            author: item.author,
            background: item.background,
            isTopRated: item.isTopRated,
            title: item[titleKey],
            contextExamples: item[contextExamplesKey],
          };
        }) ?? []
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getAssistant(
    assistantId: number,
    payload?: GetAssistantListReqDto,
  ): Promise<IAssistant | null> {
    try {
      let query = this.supabaseClient
        .from('ai_assistants')
        .select('*')
        .eq('id', assistantId);
      if (payload?.isPublic !== undefined) {
        query = query.eq('isPublic', payload.isPublic);
      }
      if (payload?.status !== undefined) {
        query = query.eq('status', payload.status);
      }
      if (payload?.source !== undefined) {
        query = query.in('source', payload.source);
      }
      if (payload?.userId !== undefined) {
        query = query.eq('userId', payload.userId);
      }
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (data) {
        const lang =
          payload?.lang?.toUpperCase() && payload?.lang?.toUpperCase() !== 'GB'
            ? payload?.lang?.toUpperCase()
            : '';
        const titleKey = lang ? `title${lang}` : 'title';
        const contextExamplesKey = lang
          ? `contextExamples${lang}`
          : 'contextExamples';
        return {
          id: data.id,
          name: data.name,
          prompt: data.prompt,
          avatar: data.avatar,
          heats: data.heats,
          followers: data.followers,
          model: data.model,
          source: data.source,
          userId: data.userId,
          isPublic: data.isPublic,
          alias: data.alias,
          configuration: data.configuration,
          author: data.author,
          background: data.background,
          isTopRated: data.isTopRated,
          title: data[titleKey],
          contextExamples: data[contextExamplesKey],
        };
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getAssistantById(
    assistantId: number,
    payload?: GetAssistantListReqDto,
  ): Promise<any | null> {
    try {
      const query = this.supabaseClient
        .from('ai_assistants')
        .select('*')
        .eq('id', assistantId);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      if (data) {
        const lang =
          payload?.lang?.toUpperCase() && payload?.lang?.toUpperCase() !== 'GB'
            ? payload?.lang?.toUpperCase()
            : '';
        const titleKey = lang ? `title${lang}` : 'title';
        const contextExamplesKey = lang
          ? `contextExamples${lang}`
          : 'contextExamples';
        const omitData = omit(data, ['contextExamplesCN', 'titleCN']) as any;
        return {
          ...omitData,
          title: data[titleKey],
          contextExamples: data[contextExamplesKey],
        };
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteAssistant(userId: string, assistantId: string): Promise<null> {
    try {
      const { error } = await this.supabaseClient
        .from('ai_assistants')
        .update({
          status: 0,
        })
        .eq('userId', userId)
        .eq('id', +assistantId);
      if (error) throw error;
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateAssistantById(
    assistantId: number,
    payload: GetAssistantResDto,
    userId: string,
  ): Promise<any> {
    try {
      const updateData = pick(payload || {}, [
        'name',
        'model',
        'alias',
        'configuration',
        'isPublic',
        'avatar',
        'prompt',
        'title',
      ]);
      // TODO 校验 configuration 和 prompt
      // 用户只能够修改自己可用的assistant，修改其他assistant虽然说不会成功，但也不会报错
      const { error } = await this.supabaseClient
        .from('ai_assistants')
        .update({ ...updateData })
        .eq('id', assistantId)
        .eq('userId', userId)
        .eq('status', 1);

      if (error) throw error;
      else return { ...updateData };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateAssistantFollowersById(
    assistantId: number,
    payload?: {
      followers: number;
    },
  ): Promise<null> {
    try {
      const update = await this.supabaseClient
        .from('ai_assistants')
        .update({ followers: payload?.followers })
        .eq('id', assistantId);
      if (update?.error) throw update.error;
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
