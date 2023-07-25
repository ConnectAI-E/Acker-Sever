import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  IAssistant,
  IAssistantPrompt,
  IConfiguration,
  ISource,
} from './assistant.interface';

export class CreateAssistantReqDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  prompt: IAssistantPrompt[];

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  source: ISource;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsObject()
  configuration: IConfiguration;

  @IsOptional()
  @IsString()
  alias: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  background: string;

  // @IsOptional()
  // @IsBoolean()
  // isTopRated: boolean;

  @IsOptional()
  @IsString()
  title: string;

  // @IsOptional()
  // @IsString()
  // titleCN: string;

  // @IsOptional()
  // @IsNumber()
  // heats: number;

  // @IsOptional()
  // @IsNumber()
  // followers: number;

  @IsOptional()
  @IsArray()
  contextExamples: string[];

  // @IsOptional()
  // @IsArray()
  // contextExamplesCN: string[];
}

export class GetAssistantListReqDto {
  @IsOptional()
  @IsArray()
  id?: number[];

  @IsOptional()
  @IsArray()
  source?: ISource[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
}

export class GetAssistantResDto implements IAssistant {
  readonly id: number;
  readonly name: string;
  readonly avatar: string;
  readonly prompt: IAssistantPrompt[];
  readonly heats: number;
  readonly followers: number;
  readonly source: ISource;
  readonly userId: string;
  readonly model: string;
  readonly isPublic: boolean;
  readonly alias: string;
  readonly author: string;
  readonly background: string;
  readonly isTopRated: boolean;
  readonly title: string;
  readonly configuration: IConfiguration;
  readonly contextExamples: string[];

  constructor(payload: IAssistant) {
    this.id = payload.id;
    this.name = payload.name;
    this.avatar = payload.avatar;
    this.prompt = payload.prompt;
    this.heats = payload.heats;
    this.followers = payload.followers;
    this.source = payload.source;
    this.userId = payload.userId;
    this.model = payload.model;
    this.isPublic = payload.isPublic;
    this.alias = payload.alias;
    this.author = payload.author;
    this.background = payload.background;
    this.isTopRated = payload.isTopRated;
    this.title = payload.title;
    this.configuration = payload.configuration;
    this.contextExamples = payload.contextExamples;
  }
}

export class FollowAssistantReqDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
