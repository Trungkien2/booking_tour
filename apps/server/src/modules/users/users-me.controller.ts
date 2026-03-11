import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@ApiTags('UsersMe')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersMeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Upload avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Avatar uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(req.user.userId, file);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Weak password or same as current' })
  @ApiResponse({ status: 401, description: 'Current password incorrect' })
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getNotificationPreferences(@Req() req: any) {
    return this.usersService.getNotificationPreferences(req.user.userId);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateNotificationPreferences(
    @Req() req: any,
    @Body() dto: NotificationPreferencesDto,
  ) {
    return this.usersService.updateNotificationPreferences(
      req.user.userId,
      dto,
    );
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get login history' })
  @ApiResponse({ status: 200, description: 'Login history returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getLoginHistory(@Req() req: any) {
    return this.usersService.getLoginHistory(req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete own account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  @ApiResponse({ status: 401, description: 'Incorrect password' })
  deleteAccount(@Req() req: any, @Body() dto: DeleteAccountDto) {
    return this.usersService.deleteMyAccount(req.user.userId, dto);
  }
}
