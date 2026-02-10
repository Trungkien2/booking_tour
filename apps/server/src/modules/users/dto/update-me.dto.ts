import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PreferencesDto {
  @IsOptional()
  @IsBoolean()
  vegetarianMeals?: boolean;

  @IsOptional()
  @IsBoolean()
  windowSeat?: boolean;
}

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}
