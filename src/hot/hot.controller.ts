import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';

import { QueryRequiredGuard } from '../guard/query.required.guard';
import { HotReqDto } from './hot.dto';
import { HotService } from './hot.service';

@Controller('hot')
export class HotController {
  constructor(private readonly hotService: HotService) {}

  @Get()
  @UseGuards(new QueryRequiredGuard(HotReqDto))
  getExplore(@Body() body: HotReqDto, @Query() query: HotReqDto) {
    const params = { ...body, ...query };
    return this.hotService.getHot(params);
  }
}
