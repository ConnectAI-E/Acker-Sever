import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

import {
  ApiResponse,
  HttpStatus,
  errorResponse,
  successResponse,
} from '../common/response';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateAssistantReqDto,
  FollowAssistantReqDto,
  GetAssistantListReqDto,
  GetAssistantResDto,
} from './assistant.dto';
import { ICreateAssistant, IAssistant, ISource } from './assistant.interface';

@Injectable()
export class AssistantService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAssistantList(
    body: GetAssistantListReqDto,
    query: GetAssistantListReqDto,
  ): Promise<IAssistant[]> {
    const params = { ...body, ...query };
    const lang = params.locale?.split('_')?.[1].toUpperCase();
    const source = params.source as unknown;
    const curSource = typeof source === 'string' ? source.split(',') : source;
    return await this.supabaseService.getAssistantList({
      ...params,
      source: curSource as ISource[],
      lang,
      isPublic: true,
      status: 1,
    });
  }

  async getAssistant(
    assistantId: string,
    body: GetAssistantListReqDto,
    query: GetAssistantListReqDto,
    headers: Record<string, string>,
  ): Promise<ApiResponse<IAssistant | null> | null> {
    const params = { ...body, ...query };
    const lang = params.locale?.split('_')?.[1].toUpperCase();
    const errorMsg = 'The assistant does not exist';

    const userId = headers['x-aios-user-id'];

    if (isNaN(+assistantId)) {
      return errorResponse<null>(HttpStatus.Error, errorMsg);
    }

    const assistant = await this.supabaseService.getAssistantById(
      +assistantId,
      { lang },
    );

    if (assistant?.status === 1 && assistant?.isPublic === true) {
      // 如果查询到的assistants公开且可用，就直接返回
      return successResponse<IAssistant | null>(assistant);
    } else if (assistant?.userId === userId && assistant?.status === 1) {
      // 否则如果查询到的userId为当前token的userId且可用，也返回
      return successResponse<IAssistant | null>(assistant);
    } else {
      // 其他情况就一律展示查不到
      return errorResponse<null>(HttpStatus.Error, errorMsg);
    }
  }

  async createAssistant(
    headers: Record<string, string>,
    body: CreateAssistantReqDto | CreateAssistantReqDto[],
  ): Promise<ApiResponse<null> | null> {
    const userId = headers['x-aios-user-id'];
    const newBody = Array.isArray(body) ? body : [body];
    const rows: ICreateAssistant[] = newBody?.map((item) => {
      const alias = item.alias ?? crypto.randomBytes(6).toString('hex');
      return {
        name: item.name,
        avatar: item.avatar,
        prompt: item.prompt ?? [],
        isPublic: item.isPublic,
        source: item.source,
        model: item.model,
        userId,
        heats: 0,
        followers: 0,
        alias,
        configuration: item.configuration,
        author: item.author,
        background: item.background,
        isTopRated: true,
        title: item.title,
        contextExamples: item.contextExamples,
        status: 1,
      };
    });
    const result = await this.supabaseService.createAssistant(rows);
    if (result?.code === '23505') {
      return errorResponse(HttpStatus.Error, result.details);
    }
    return null;
  }

  async updateAssistant(
    assistantId: string,
    body: GetAssistantResDto,
    headers: Record<string, string>,
  ): Promise<ApiResponse<IAssistant | null> | null> {
    const userId = headers['x-aios-user-id'];
    if (isNaN(+assistantId)) {
      return errorResponse<null>(HttpStatus.Error, 'Invalid AssistantId');
    }

    const updateAssistant = await this.supabaseService.updateAssistantById(
      +assistantId,
      body,
      userId,
    );

    if (!updateAssistant) {
      return errorResponse<null>(HttpStatus.Error, 'Update failed.');
    }

    return successResponse<IAssistant | null>(updateAssistant);
  }

  async deleteAssistant(
    assistantId: string,
    headers: Record<string, string>,
  ): Promise<ApiResponse<null> | null> {
    const userId = headers['x-aios-user-id'];
    const errorMsg = 'The assistant does not exist';
    if (isNaN(+assistantId)) {
      return errorResponse<null>(HttpStatus.Error, errorMsg);
    }
    const checkResult = await this.supabaseService.getAssistant(+assistantId, {
      userId,
    });
    if (!checkResult) {
      return errorResponse<null>(HttpStatus.Error, errorMsg);
    }
    return await this.supabaseService.deleteAssistant(userId, assistantId);
  }

  async followAssistant(
    headers: Record<string, string>,
    body: FollowAssistantReqDto,
  ): Promise<ApiResponse<null> | null> {
    const userId = headers['x-aios-user-id'];
    const assistantId = body.id;
    const targetAssistant = await this.supabaseService.getAssistant(
      assistantId,
      {
        isPublic: true,
        source: ['user', 'AI'],
        status: 1,
      },
    );
    if (!targetAssistant) {
      return errorResponse<null>(
        HttpStatus.Error,
        'The assistant does not exist or is not public',
      );
    }
    const account = await this.supabaseService.getAccountById(userId);
    if (!account) {
      await this.supabaseService.createAccount(userId, {
        nickName: '',
        avatar: '',
        followId: [assistantId],
      });
      return null;
    }

    const followId = account?.followId || [];
    if (followId.includes(assistantId)) {
      return errorResponse(HttpStatus.Error, 'The assistant has been followed');
    }
    followId?.unshift(assistantId);

    await this.supabaseService.updateAssistantFollowersById(
      targetAssistant?.id,
      {
        followers: (targetAssistant?.followers || 0) + 1,
      },
    );

    return await this.supabaseService.updateAccount(userId, { followId });
  }
}
