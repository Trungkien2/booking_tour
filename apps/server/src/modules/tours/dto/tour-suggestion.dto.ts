import { IsString, MinLength, IsOptional, IsInt, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetSuggestionsDto {
  @ApiProperty({ minLength: 2, description: 'Search query (minimum 2 chars)' })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiProperty({ required: false, maximum: 10, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(10)
  limit?: number = 5;
}

export class SuggestionItemDto {
  @ApiProperty({ enum: ['tour', 'destination'] })
  type: 'tour' | 'destination';

  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  slug?: string;
}

export class SuggestionsResponseDto {
  @ApiProperty({ type: [SuggestionItemDto] })
  suggestions: SuggestionItemDto[];
}
