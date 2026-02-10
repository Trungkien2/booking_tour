import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserFavorites(userId: number) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: { userId },
      include: {
        tour: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
            priceAdult: true,
            location: true,
            ratingAverage: true,
            durationDays: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.id,
      tourId: f.tourId,
      createdAt: f.createdAt,
      tour: {
        ...f.tour,
        priceAdult: Number(f.tour.priceAdult),
        ratingAverage: Number(f.tour.ratingAverage),
      },
    }));
  }

  async addFavorite(userId: number, tourId: number) {
    const tour = await this.prisma.tour.findUnique({
      where: { id: tourId, deletedAt: null },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const existing = await this.prisma.userFavorite.findUnique({
      where: { userId_tourId: { userId, tourId } },
    });

    if (existing) {
      throw new ConflictException('Tour already in favorites');
    }

    return this.prisma.userFavorite.create({
      data: { userId, tourId },
    });
  }

  async removeFavorite(userId: number, tourId: number) {
    const favorite = await this.prisma.userFavorite.findUnique({
      where: { userId_tourId: { userId, tourId } },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.userFavorite.delete({
      where: { id: favorite.id },
    });
  }

  async isFavorited(userId: number, tourId: number): Promise<boolean> {
    const favorite = await this.prisma.userFavorite.findUnique({
      where: { userId_tourId: { userId, tourId } },
    });
    return !!favorite;
  }
}
