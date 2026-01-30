import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourQueryDto } from './dto/tour-query.dto';
import {
  TourResponseDto,
  TourListResponseDto,
  TourStatisticsDto,
} from './dto/tour-response.dto';

/** Tour status values from Prisma schema (use string to avoid @prisma/client type resolution issues) */
type TourStatusValue = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get paginated list of tours with filters.
   */
  async findAll(query: TourQueryDto): Promise<TourListResponseDto> {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sort = 'createdAt:desc',
    } = query;

    // Build where clause
    const where: {
      deletedAt: null;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        location?: { contains: string; mode: 'insensitive' };
      }>;
      status?: TourStatusValue;
    } = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as TourStatusValue;
    }

    // Parse sort
    const [sortField, sortOrder] = sort.split(':');
    const orderBy = { [sortField]: sortOrder || 'desc' };

    // Pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [tours, total] = await Promise.all([
      this.prisma.tour.findMany({
        where,
        include: {
          schedules: {
            select: {
              maxCapacity: true,
              currentCapacity: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.tour.count({ where }),
    ]);

    // Calculate slots for each tour
    const data: TourResponseDto[] = tours.map((tour) => {
      const totalSlots = tour.schedules.reduce(
        (sum, s) => sum + s.maxCapacity,
        0,
      );
      const bookedSlots = tour.schedules.reduce(
        (sum, s) => sum + s.currentCapacity,
        0,
      );

      return {
        id: tour.id,
        name: tour.name,
        slug: tour.slug,
        summary: tour.summary,
        description: tour.description,
        coverImage: tour.coverImage,
        images: Array.isArray(tour.images) ? (tour.images as string[]) : [],
        durationDays: tour.durationDays,
        priceAdult: Number(tour.priceAdult),
        priceChild: Number(tour.priceChild),
        location: tour.location,
        status: tour.status,
        ratingAverage: Number(tour.ratingAverage),
        totalSlots,
        bookedSlots,
        availableSlots: totalSlots - bookedSlots,
        createdAt: tour.createdAt,
        updatedAt: tour.updatedAt,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get tour statistics for dashboard.
   */
  async getStatistics(): Promise<TourStatisticsDto> {
    const [total, active, drafts, toursWithSchedules] = await Promise.all([
      this.prisma.tour.count({ where: { deletedAt: null } }),
      this.prisma.tour.count({
        where: { status: 'PUBLISHED', deletedAt: null },
      }),
      this.prisma.tour.count({ where: { status: 'DRAFT', deletedAt: null } }),
      this.prisma.tour.findMany({
        where: { deletedAt: null },
        include: {
          schedules: {
            select: {
              maxCapacity: true,
              currentCapacity: true,
            },
          },
        },
      }),
    ]);

    // Calculate fully booked tours
    const fullyBooked = toursWithSchedules.filter((tour) => {
      const totalSlots = tour.schedules.reduce(
        (sum, s) => sum + s.maxCapacity,
        0,
      );
      const bookedSlots = tour.schedules.reduce(
        (sum, s) => sum + s.currentCapacity,
        0,
      );
      return totalSlots > 0 && bookedSlots >= totalSlots;
    }).length;

    return { total, active, drafts, fullyBooked };
  }

  /**
   * Find tour by ID.
   */
  async findOne(id: number): Promise<TourResponseDto> {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: {
        schedules: {
          select: {
            maxCapacity: true,
            currentCapacity: true,
          },
        },
      },
    });

    if (!tour || tour.deletedAt) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }

    const totalSlots = tour.schedules.reduce(
      (sum, s) => sum + s.maxCapacity,
      0,
    );
    const bookedSlots = tour.schedules.reduce(
      (sum, s) => sum + s.currentCapacity,
      0,
    );

    return {
      id: tour.id,
      name: tour.name,
      slug: tour.slug,
      summary: tour.summary,
      description: tour.description,
      coverImage: tour.coverImage,
      images: Array.isArray(tour.images) ? (tour.images as string[]) : [],
      durationDays: tour.durationDays,
      priceAdult: Number(tour.priceAdult),
      priceChild: Number(tour.priceChild),
      location: tour.location,
      status: tour.status,
      ratingAverage: Number(tour.ratingAverage),
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    };
  }

  /**
   * Create new tour.
   */
  async create(createTourDto: CreateTourDto): Promise<TourResponseDto> {
    // Generate slug from name
    const slug = this.generateSlug(createTourDto.name);

    // Check if slug exists
    const existingTour = await this.prisma.tour.findUnique({
      where: { slug },
    });

    if (existingTour) {
      throw new ConflictException(`Tour with slug "${slug}" already exists`);
    }

    const tour = await this.prisma.tour.create({
      data: {
        name: createTourDto.name,
        slug,
        summary: createTourDto.summary,
        description: createTourDto.description,
        coverImage: createTourDto.coverImage,
        images: createTourDto.images || [],
        durationDays: createTourDto.durationDays,
        priceAdult: createTourDto.priceAdult,
        priceChild: createTourDto.priceChild,
        location: createTourDto.location,
        status: (createTourDto.status as TourStatusValue) || 'DRAFT',
      },
    });

    return this.findOne(tour.id);
  }

  /**
   * Update tour.
   */
  async update(
    id: number,
    updateTourDto: UpdateTourDto,
  ): Promise<TourResponseDto> {
    // Check if tour exists
    await this.findOne(id);

    // If name is updated, regenerate slug
    let slug: string | undefined;
    if (updateTourDto.name) {
      slug = this.generateSlug(updateTourDto.name);

      // Check if new slug conflicts with another tour
      const existingTour = await this.prisma.tour.findUnique({
        where: { slug },
      });

      if (existingTour && existingTour.id !== id) {
        throw new ConflictException(`Tour with slug "${slug}" already exists`);
      }
    }

    // Only include slug in update when name was changed; omit when undefined to avoid setting unique field to null
    await this.prisma.tour.update({
      where: { id },
      data: {
        ...updateTourDto,
        ...(updateTourDto.status !== undefined && {
          status: updateTourDto.status as TourStatusValue,
        }),
        ...(slug !== undefined && { slug }),
      },
    });

    return this.findOne(id);
  }

  /**
   * Delete tour (soft delete).
   */
  async remove(id: number): Promise<void> {
    // Check if tour exists
    await this.findOne(id);

    // Check for active bookings
    const activeBookingsCount = await this.prisma.booking.count({
      where: {
        schedule: {
          tourId: id,
        },
        status: {
          in: ['PENDING', 'PAID'],
        },
      },
    });

    if (activeBookingsCount > 0) {
      throw new BadRequestException(
        `Cannot delete tour with ${activeBookingsCount} active booking(s). Please cancel bookings first or archive the tour.`,
      );
    }

    // Soft delete
    await this.prisma.tour.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Generate URL-friendly slug from tour name.
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 100); // Limit length
  }
}
