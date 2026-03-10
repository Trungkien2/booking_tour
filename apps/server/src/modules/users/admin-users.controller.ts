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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/auth.decorators';
import { UsersService } from './users.service';
import { AdminUserQueryDto } from './dto/admin-user-query.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AdminUpdateRoleDto } from './dto/admin-update-role.dto';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';

@ApiTags('admin/users')
@ApiBearerAuth('access-token')
@Controller('api/admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List users (admin)' })
  async findAll(@Query() query: AdminUserQueryDto) {
    return this.usersService.findAllForAdmin(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneForAdmin(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user / invite (admin)' })
  async create(@Body() dto: AdminCreateUserDto) {
    return this.usersService.createUserForAdmin(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user (admin)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.updateUserForAdmin(id, dto);
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user role (admin)' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateRoleDto,
  ) {
    return this.usersService.updateRoleForAdmin(id, dto.role);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate/deactivate user (admin)' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateStatusDto,
  ) {
    return this.usersService.updateStatusForAdmin(id, dto.active);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user (admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.softDeleteForAdmin(id);
  }
}
