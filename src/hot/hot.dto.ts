import {IsOptional, IsString} from 'class-validator';

function isOneOfType(value: string | number): boolean {
  return typeof value === 'string' || typeof value === 'number';
}

export class HotReqDto {
  @IsOptional()
  @IsString()
  locale: string;

  @IsOptional()
  count: string | number;
}
