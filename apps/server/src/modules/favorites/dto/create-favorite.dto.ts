import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ description: 'Tour ID to add to favorites' })
  @IsInt()
  @Min(1)
  tourId: number;
}
