/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';

import { GetAssistantResDto } from '../assistant/assistant.dto';
import { QueryRequiredGuard } from '../guard/query.required.guard';
import { WelcomeReqDto } from './welcome.dto';
import { WelcomeService } from './welcome.service';

@Controller('welcome')
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  @UseGuards(new QueryRequiredGuard(WelcomeReqDto))
  getExplore(
    @Body() body: WelcomeReqDto,
    @Query() query: WelcomeReqDto,
  ): Promise<GetAssistantResDto[]> {
    const params = { ...body, ...query };
    return this.welcomeService.getExploreBySQL(params);
  }
}
