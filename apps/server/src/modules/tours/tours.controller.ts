import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourQueryDto } from './dto/tour-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/auth.decorators';
import {
  ApiGetStatistics,
  ApiFindAllTours,
  ApiFindOneTour,
  ApiCreateTour,
  ApiUpdateTour,
  ApiDeleteTour,
} from './tours.decorators';

@ApiTags('admin/tours')
@ApiBearerAuth('access-token')
@Controller('api/admin/tours')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiGetStatistics()
  async getStatistics() {
    return this.toursService.getStatistics();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiFindAllTours()
  async findAll(@Query() query: TourQueryDto) {
    return this.toursService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiFindOneTour()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toursService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateTour()
  async create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateTour()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTourDto: UpdateTourDto,
  ) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteTour()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.toursService.remove(id);
  }
}
