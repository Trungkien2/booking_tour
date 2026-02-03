import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetToursPublicDto, SortOption } from './dto/get-tours-public.dto';
import {
  ToursPublicResponseDto,
  TourItemDto,
} from './dto/tour-public-response.dto';
import {
  GetSuggestionsDto,
  SuggestionsResponseDto,
} from './dto/tour-suggestion.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToursPublicService {
  private readonly logger = new Logger(ToursPublicService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get paginated public tours list with filters and sorting.
   */
  async getTours(dto: GetToursPublicDto): Promise<ToursPublicResponseDto> {
    const {
      page = 1,
      limit = 8,
      search,
      sort,
      priceMin,
      priceMax,
      difficulty,
      location,
      duration,
    } = dto;
    const skip = (page - 1) * limit;

    this.logger.log(
      `Fetching tours: page=${page}, limit=${limit}, filters=${JSON.stringify({
        search,
        sort,
        priceMin,
        priceMax,
        difficulty,
        location,
        duration,
      })}`,
    );

    // Build where clause - only show published tours
    const where: Prisma.TourWhereInput = this.buildWhereClause({
      search,
      priceMin,
      priceMax,
      difficulty,
      location,
      duration,
    });

    // Build order by
    const orderBy = this.buildOrderBy(sort);

    // Execute parallel queries for data and count
    const [tours, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          summary: true,
          coverImage: true,
          durationDays: true,
          priceAdult: true,
          priceChild: true,
          location: true,
          ratingAverage: true,
          reviewCount: true,
          difficulty: true,
          featured: true,
          schedules: {
            where: {
              status: 'OPEN',
              startDate: { gte: new Date() },
            },
            orderBy: { startDate: 'asc' },
            take: 1,
            select: { startDate: true },
          },
        },
      }),
      this.prisma.tour.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    this.logger.log(
      `Found ${total} tours, returning page ${page}/${totalPages}`,
    );

    return {
      tours: tours.map((tour) => this.mapTourToDto(tour)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get featured tours for homepage highlight.
   */
  async getFeaturedTours(limit: number = 4): Promise<TourItemDto[]> {
    this.logger.log(`Fetching ${limit} featured tours`);

    const tours = await this.prisma.tour.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      orderBy: [{ ratingAverage: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        summary: true,
        coverImage: true,
        durationDays: true,
        priceAdult: true,
        priceChild: true,
        location: true,
        ratingAverage: true,
        reviewCount: true,
        difficulty: true,
        featured: true,
        schedules: {
          where: {
            status: 'OPEN',
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
          take: 1,
          select: { startDate: true },
        },
      },
    });

    return tours.map((tour) => this.mapTourToDto(tour));
  }

  /**
   * Get search suggestions based on query.
   */
  async getSuggestions(
    dto: GetSuggestionsDto,
  ): Promise<SuggestionsResponseDto> {
    const { q, limit = 5 } = dto;

    this.logger.log(`Fetching suggestions for query: "${q}"`);

    // Get matching tours
    const tours = await this.prisma.tour.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
      },
    });

    // Get unique locations as destinations
    const locations = await this.prisma.tour.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        location: { contains: q, mode: 'insensitive' },
      },
      distinct: ['location'],
      take: 3,
      select: { location: true },
    });

    const suggestions = [
      ...tours.map((tour) => ({
        type: 'tour' as const,
        id: tour.id,
        name: tour.name,
        slug: tour.slug,
      })),
      ...locations
        .filter((l) => l.location)
        .map((l) => ({
          type: 'destination' as const,
          name: l.location!,
        })),
    ];

    return { suggestions: suggestions.slice(0, limit) };
  }

  /**
   * Build Prisma where clause from filters.
   */
  private buildWhereClause(filters: {
    search?: string;
    priceMin?: number;
    priceMax?: number;
    difficulty?: string;
    location?: string;
    duration?: string;
  }): Prisma.TourWhereInput {
    const where: Prisma.TourWhereInput = {
      status: 'PUBLISHED',
      deletedAt: null,
    };

    // Full-text search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { summary: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Price range filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.priceAdult = {};
      if (filters.priceMin !== undefined) {
        where.priceAdult.gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        where.priceAdult.lte = filters.priceMax;
      }
    }

    // Difficulty filter
    if (filters.difficulty) {
      where.difficulty = filters.difficulty.toUpperCase() as
        | 'EASY'
        | 'MODERATE'
        | 'CHALLENGING';
    }

    // Location filter
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    // Duration filter (e.g., "1-3", "4-7", "8+")
    if (filters.duration) {
      const durationRange = this.parseDurationRange(filters.duration);
      if (durationRange) {
        where.durationDays = durationRange;
      }
    }

    return where;
  }

  /**
   * Build Prisma orderBy based on sort option.
   */
  private buildOrderBy(
    sort?: SortOption,
  ):
    | Prisma.TourOrderByWithRelationInput
    | Prisma.TourOrderByWithRelationInput[] {
    switch (sort) {
      case SortOption.NEWEST:
        return { createdAt: 'desc' };
      case SortOption.PRICE_ASC:
        return { priceAdult: 'asc' };
      case SortOption.PRICE_DESC:
        return { priceAdult: 'desc' };
      case SortOption.RATING:
        return { ratingAverage: 'desc' };
      case SortOption.POPULAR:
      default:
        // Popular = high review count + high rating
        return [{ reviewCount: 'desc' }, { ratingAverage: 'desc' }];
    }
  }

  /**
   * Parse duration range string (e.g., "1-3", "8+") into Prisma filter.
   */
  private parseDurationRange(duration: string): Prisma.IntFilter | undefined {
    if (duration.endsWith('+')) {
      const min = parseInt(duration.replace('+', ''), 10);
      if (!isNaN(min)) {
        return { gte: min };
      }
    }

    if (duration.includes('-')) {
      const [minStr, maxStr] = duration.split('-');
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);
      if (!isNaN(min) && !isNaN(max)) {
        return { gte: min, lte: max };
      }
    }

    return undefined;
  }

  /**
   * Map Prisma Tour to TourItemDto.
   */
  private mapTourToDto(tour: {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    coverImage: string | null;
    durationDays: number;
    priceAdult: Prisma.Decimal;
    priceChild: Prisma.Decimal;
    location: string | null;
    ratingAverage: Prisma.Decimal;
    reviewCount: number;
    difficulty: string | null;
    featured: boolean;
    schedules?: Array<{ startDate: Date }>;
  }): TourItemDto {
    return {
      id: tour.id,
      name: tour.name,
      slug: tour.slug,
      summary: tour.summary ?? undefined,
      coverImage: tour.coverImage ?? undefined,
      durationDays: tour.durationDays,
      priceAdult: Number(tour.priceAdult),
      priceChild: Number(tour.priceChild),
      location: tour.location ?? undefined,
      ratingAverage: Number(tour.ratingAverage),
      reviewCount: tour.reviewCount ?? 0,
      difficulty: tour.difficulty?.toLowerCase(),
      featured: tour.featured ?? false,
      nextAvailableDate: tour.schedules?.[0]?.startDate?.toISOString(),
    };
  }
}
