import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ToursPublicService } from './tours-public.service';
import { GetToursPublicDto } from './dto/get-tours-public.dto';
import { GetSuggestionsDto } from './dto/tour-suggestion.dto';
import {
  ToursPublicResponseDto,
  TourItemDto,
} from './dto/tour-public-response.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { Public } from '../auth/auth.decorators';

@ApiTags('tours')
@Controller('tours')
@Public()
export class ToursPublicController {
  constructor(private readonly toursPublicService: ToursPublicService) {}

  /**
   * Get paginated tours list with filters.
   *
   * @example
   * GET /tours?page=1&limit=8&search=bali&sort=popular&priceMin=500&priceMax=1000
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get paginated tours list with filters and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated tours',
    type: ToursPublicResponseDto,
  })
  async getTours(@Query() dto: GetToursPublicDto) {
    return {
      success: true,
      data: await this.toursPublicService.getTours(dto),
    };
  }

  /**
   * Get featured tours for homepage.
   *
   * @example
   * GET /tours/featured?limit=4
   */
  @Get('featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get featured tours for homepage highlight' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns featured tours',
    type: [TourItemDto],
  })
  async getFeaturedTours(@Query('limit') limit?: number) {
    const parsedLimit = limit ? parseInt(String(limit), 10) : 4;
    return {
      success: true,
      data: {
        tours: await this.toursPublicService.getFeaturedTours(parsedLimit),
      },
    };
  }

  /**
   * Get search suggestions.
   *
   * @example
   * GET /tours/suggestions?q=ba&limit=5
   */
  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get search suggestions for tours and destinations',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search suggestions',
  })
  async getSuggestions(@Query() dto: GetSuggestionsDto) {
    return {
      success: true,
      data: await this.toursPublicService.getSuggestions(dto),
    };
  }

  /**
   * Check schedule availability.
   *
   * @example
   * POST /tours/schedules/1/check-availability { adults: 2, children: 1 }
   */
  @Post('schedules/:scheduleId/check-availability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check schedule availability and get price breakdown',
  })
  async checkAvailability(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() dto: CheckAvailabilityDto,
  ) {
    return this.toursPublicService.checkAvailability(scheduleId, dto);
  }

  /**
   * Get tour reviews with pagination.
   *
   * @example
   * GET /tours/123/reviews?page=1&limit=5&sort=recent
   */
  @Get(':tourId/reviews')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get paginated tour reviews' })
  async getReviews(
    @Param('tourId', ParseIntPipe) tourId: number,
    @Query() query: ReviewQueryDto,
  ) {
    return this.toursPublicService.getReviews(tourId, query);
  }

  /**
   * Get tour schedules.
   *
   * @example
   * GET /tours/123/schedules?from=2026-03-01&to=2026-06-01
   */
  @Get(':tourId/schedules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available tour schedules' })
  async getSchedules(
    @Param('tourId', ParseIntPipe) tourId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.toursPublicService.getSchedules(tourId, from, to);
  }

  /**
   * Get tour detail by slug.
   *
   * @example
   * GET /tours/ha-long-bay-2d1n
   */
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tour detail by slug' })
  @ApiResponse({ status: 200, description: 'Returns tour detail' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.toursPublicService.findBySlug(slug);
  }
}
