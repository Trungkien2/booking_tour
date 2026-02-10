import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@ApiBearerAuth('access-token')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  async getUserFavorites(@Req() req: { user: { userId: number } }) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add tour to favorites' })
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @Req() req: { user: { userId: number } },
    @Body() dto: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(req.user.userId, dto.tourId);
  }

  @Delete(':tourId')
  @ApiOperation({ summary: 'Remove from favorites' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Req() req: { user: { userId: number } },
    @Param('tourId', ParseIntPipe) tourId: number,
  ) {
    await this.favoritesService.removeFavorite(req.user.userId, tourId);
  }

  @Get(':tourId/status')
  @ApiOperation({ summary: 'Check if tour is favorited' })
  async isFavorited(
    @Req() req: { user: { userId: number } },
    @Param('tourId', ParseIntPipe) tourId: number,
  ) {
    const isFavorited = await this.favoritesService.isFavorited(
      req.user.userId,
      tourId,
    );
    return { isFavorited };
  }
}
