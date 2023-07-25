export interface IAccount extends IAccountBase {
  /**
   * 钱包
   */
  wallets?: IWallets;
  /**
   * apiKey list
   */
  akList?: string[];
}

export interface IAccountBase {
  /**
   * 昵称
   */
  nickName: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 关注列表
   */
  followId: number[];
}

export interface IWallets {
  // totalPoints: number;
  // usagePoints: number;
  points: number;
}
