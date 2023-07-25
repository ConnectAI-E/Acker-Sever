import {
  Controller,
  Post,
  UseGuards,
  Headers,
  Get,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';

import { ApiResponse } from '../common/response';
import { AuthGuard } from '../guard/auth.guard';
import { BodyRequiredGuard } from '../guard/body.required.guard';
import { SourceGuard } from '../guard/source.guard';
import {
  CreateAssistantReqDto,
  FollowAssistantReqDto,
  GetAssistantListReqDto,
  GetAssistantResDto,
} from './assistant.dto';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAssistantList(
    @Body() body: GetAssistantListReqDto,
    @Query() query: GetAssistantListReqDto,
  ): Promise<GetAssistantResDto[]> {
    return await this.assistantService.getAssistantList(body, query);
  }

  @Get(':assistantId')
  @UseGuards(AuthGuard)
  async getAssistant(
    @Param('assistantId') assistantId: string,
    @Body() body: GetAssistantListReqDto,
    @Query() query: GetAssistantListReqDto,
    @Headers() headers: Record<string, string>,
  ): Promise<ApiResponse<GetAssistantResDto | null> | null> {
    return await this.assistantService.getAssistant(
      assistantId,
      body,
      query,
      headers,
    );
  }

  @Post('/update/:assistantId')
  @UseGuards(new BodyRequiredGuard(CreateAssistantReqDto), AuthGuard)
  async updateAssistant(
    @Param('assistantId') assistantId: string,
    @Body() body: GetAssistantResDto,
    @Headers() headers: Record<string, string>,
  ): Promise<ApiResponse<GetAssistantResDto | null> | null> {
    return await this.assistantService.updateAssistant(
      assistantId,
      body,
      headers,
    );
  }

  // @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  @UseGuards(
    new BodyRequiredGuard(CreateAssistantReqDto),
    new SourceGuard(),
    AuthGuard,
  )
  async createAssistant(
    @Headers() headers: Record<string, string>,
    @Body() body: CreateAssistantReqDto,
  ) {
    return await this.assistantService.createAssistant(headers, body);
  }

  @Delete(':assistantId')
  @UseGuards(AuthGuard)
  async deleteAssistant(
    @Param('assistantId') assistantId: string,
    @Headers() headers: Record<string, string>,
  ): Promise<ApiResponse<null> | null> {
    return await this.assistantService.deleteAssistant(assistantId, headers);
  }

  @Post('follow')
  @UseGuards(new BodyRequiredGuard(FollowAssistantReqDto), AuthGuard)
  async followAssistant(
    @Headers() headers: Record<string, string>,
    @Body() body: FollowAssistantReqDto,
  ): Promise<ApiResponse<null> | null> {
    return await this.assistantService.followAssistant(headers, body);
  }
}
