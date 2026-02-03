import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ToursPublicService } from './tours-public.service';
import { GetToursPublicDto } from './dto/get-tours-public.dto';
import { GetSuggestionsDto } from './dto/tour-suggestion.dto';
import {
  ToursPublicResponseDto,
  TourItemDto,
} from './dto/tour-public-response.dto';
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
}
