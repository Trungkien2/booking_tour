import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO for email availability check request.
 */
export class CheckEmailDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}

/**
 * DTO for email availability check response.
 */
export class CheckEmailResponseDto {
  available: boolean;
  message?: string;
}
