import { IsOptional, IsString } from 'class-validator';

export class WelcomeReqDto {
  @IsOptional()
  @IsString()
  locale: string;
}
