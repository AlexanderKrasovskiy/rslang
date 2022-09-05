export type AuthResponse = {
  token: string;
  refreshToken: string;
  userId?: string;
  name: string;
  message?: string;
  mail?: string;
  loginTime?: number;
};

export type LoginData = {
  token: string;
  refreshToken: string;
  id: string;
  name: string;
  mail: string;
  loginTime: number;
};

export type UserData = {
  name: string;
  mail: string;
  pass: string;
};

export type CreateResponse = {
  id: string;
  email: string;
  name: string;
};

export type RefreshResponse = {
  token: string;
  refreshToken: string;
};
