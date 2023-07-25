/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClickHouse } from 'clickhouse';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAssistant } from '../assistant/assistant.interface';
import { UTCDate } from '../common/utils';

@Injectable()
export class ClickhouseService {
  private clickhouseClient: ClickHouse;
  constructor(private readonly configService: ConfigService) {
    const password = atob(
      this.configService.get<string>('CLICKHOUSE_REST_TOKEN') ?? '',
    )?.split(':')[1];
    this.clickhouseClient = new ClickHouse({
      url: this.configService.get<string>('CLICKHOUSE_REST_URL') ?? '',
      port: 8443,
      basicAuth: {
        username: 'default',
        password: password,
      },
    });
  }

  async getUsagePoints(userId: string): Promise<number> {
    const nowDate = UTCDate(new Date());
    const sql = `SELECT SUM(usage_points) AS total FROM events WHERE user_id = '${userId}' AND event_date = '${nowDate}'`;
    const usageRes = (
      await this.clickhouseClient.query(sql).toPromise()
    )?.[0] as { total: number };
    return usageRes.total;
  }

  async getAssistant(): Promise<IAssistant[]> {
    try {
      const query = `SELECT * FROM ai_assistants WHERE is_public = 1 FORMAT JSON`;
      const publicAssistant = await this.clickhouseClient
        .query(query)
        .toPromise();
      return publicAssistant?.map((i: any) => {
        return {
          ...i,
          data: i.data?.map((j: string) => JSON.parse(j)),
        };
      }) as IAssistant[];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
