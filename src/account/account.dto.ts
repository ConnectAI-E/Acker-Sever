import { IsOptional, IsString } from 'class-validator';

import { IAccountBase, IWallets } from './account.interface';

export class AccountReqDto {
  @IsOptional()
  @IsString()
  nickName: string;

  @IsOptional()
  @IsString()
  avatar: string;
}

export class AccountResDto {
  readonly nickName: string;
  readonly avatar: string;
  readonly akList: string[];
  readonly wallets: IWallets | null;

  constructor(base: IAccountBase, akList: string[], wallets: IWallets | null) {
    this.nickName = base.nickName;
    this.avatar = base.avatar;
    this.akList = akList;
    this.wallets = wallets;
  }
}
