/**
 * DTO for user registration response.
 */
export class RegisterResponseDto {
  user: {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
    createdAt: Date;
  };
  message: string;
  // Optional: for auto-login
  accessToken?: string;
  refreshToken?: string;
}
