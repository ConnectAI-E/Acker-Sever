import { Injectable } from '@nestjs/common';

import { IAssistant } from '../assistant/assistant.interface';
import { ClickhouseService } from '../clickhouse/clickhouse.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AccountReqDto, AccountResDto } from './account.dto';
import { IWallets } from './account.interface';

@Injectable()
export class AccountService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly clickhouseService: ClickhouseService,
  ) {}

  async getAccount(headers: Record<string, string>): Promise<AccountResDto> {
    const userId = headers['x-aios-user-id'];
    const [akList, base, totalPoints] = await Promise.all([
      this.supabaseService.getAccountApiKey(userId),
      this.supabaseService.getAccountBase(userId),
      this.supabaseService.getAccountTotalPoints(userId),
    ]);
    let wallets: IWallets | null = null;
    if (totalPoints > 0) {
      const usagePoints = await this.clickhouseService.getUsagePoints(userId);
      wallets = {
        points: totalPoints - usagePoints,
      };
    }
    return new AccountResDto(base, akList, wallets);
  }

  async updateAccount(
    headers: Record<string, string>,
    body: AccountReqDto,
  ): Promise<null> {
    const userId = headers['x-aios-user-id'];
    await Promise.all([this.supabaseService.updateAccountBase(userId, body)]);
    return null;
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    const url = await this.supabaseService.upload(file, 'avatar');
    return url;
  }

  async getMyFollowList(
    headers: Record<string, string>,
  ): Promise<IAssistant[]> {
    const userId = headers['x-aios-user-id'];
    const base = await this.supabaseService.getAccountBase(userId);
    if (base?.followId) {
      const list = await this.supabaseService.getAssistantList({
        id: base.followId,
      });
      return list;
    }
    return [];
  }

  async getMyCreatedList(
    headers: Record<string, string>,
  ): Promise<IAssistant[]> {
    const userId = headers['x-aios-user-id'];
    const list = await this.supabaseService.getAssistantList({
      userId,
      status: 1,
    });
    return list;
  }
}
