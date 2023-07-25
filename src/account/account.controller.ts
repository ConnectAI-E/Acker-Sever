import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';

import {IAssistant} from '../assistant/assistant.interface';
import {AuthGuard} from '../guard/auth.guard';
import {BodyRequiredGuard} from '../guard/body.required.guard';
import {AccountReqDto, AccountResDto} from './account.dto';
import {AccountService} from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAccount(
    @Headers() headers: Record<string, string>,
  ): Promise<AccountResDto> {
    return await this.accountService.getAccount(headers);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(new BodyRequiredGuard(AccountReqDto), AuthGuard)
  @Patch()
  async updateAccount(
    @Headers() headers: Record<string, string>,
    @Body() body: AccountReqDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<null> {
    if (file) {
      const avatarUrl = await this.accountService.uploadAvatar(file);
      body.avatar = avatarUrl;
    }
    return await this.accountService.updateAccount(headers, body);
  }

  @UseGuards(AuthGuard)
  @Get('followList')
  async getMyFollowList(
    @Headers() headers: Record<string, string>,
  ): Promise<IAssistant[]> {
    return await this.accountService.getMyFollowList(headers);
  }

  @UseGuards(AuthGuard)
  @Get('createdList')
  async getMyCreatedList(
    @Headers() headers: Record<string, string>,
  ): Promise<IAssistant[]> {
    return await this.accountService.getMyCreatedList(headers);
  }
}
