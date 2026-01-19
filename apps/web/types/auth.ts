export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SocialLoginRequest {
  idToken: string;
  provider: 'google' | 'apple';
}
