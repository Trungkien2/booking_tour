import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO for user registration request.
 */
export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A', minLength: 2, description: 'Họ tên đầy đủ' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email đăng ký' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 8,
    description: 'Mật khẩu (tối thiểu 8 ký tự, có chữ hoa, chữ thường và số)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  @ApiPropertyOptional({ example: '+84123456789', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Vietnam', description: 'Quốc gia' })
  @IsOptional()
  @IsString()
  country?: string;
}
