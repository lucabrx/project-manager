export type TUser = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
};

export type TToken = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
};

export type LoginResponse = {
  user: TUser;
  token: TToken;
};
