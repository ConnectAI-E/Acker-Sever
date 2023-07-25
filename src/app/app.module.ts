import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountController } from '../account/account.controller';
import { AccountService } from '../account/account.service';
import { AssistantController } from '../assistant/assistant.controller';
import { AssistantService } from '../assistant/assistant.service';
import { ClickhouseService } from '../clickhouse/clickhouse.service';
import { HotController } from '../hot/hot.controller';
import { HotService } from '../hot/hot.service';
import { SupabaseService } from '../supabase/supabase.service';
import { WelcomeController } from '../welcome/welcome.controller';
import { WelcomeService } from '../welcome/welcome.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [
    AppController,
    AccountController,
    AssistantController,
    WelcomeController,
    HotController,
  ],
  providers: [
    AppService,
    AccountService,
    SupabaseService,
    ClickhouseService,
    AssistantService,
    WelcomeService,
    HotService,
  ],
})
export class AppModule {}
