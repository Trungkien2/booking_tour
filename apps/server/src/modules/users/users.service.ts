import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminUserQueryDto } from './dto/admin-user-query.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SALT_ROUNDS = 10;

const PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  address: true,
  bio: true,
  preferences: true,
  emailVerified: true,
  role: true,
  createdAt: true,
  lastPasswordChangeAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PROFILE_SELECT,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMe(userId: number, dto: UpdateMeDto) {
    const data: Record<string, unknown> = {};

    if (dto.fullName !== undefined) data.fullName = dto.fullName.trim();
    if (dto.phone !== undefined) data.phone = dto.phone.trim();
    if (dto.address !== undefined) data.address = dto.address.trim();
    if (dto.bio !== undefined) data.bio = dto.bio.trim();
    if (dto.preferences !== undefined) data.preferences = dto.preferences;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: PROFILE_SELECT,
    });

    return user;
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: jpeg, png, webp',
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Generate safe filename
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `avatar-${userId}-${Date.now()}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, file.buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return { avatarUrl };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        lastPasswordChangeAt: new Date(),
      },
    });

    return { message: 'Password changed successfully' };
  }

  // --- Admin user management ---

  async findAllForAdmin(query: AdminUserQueryDto) {
    const {
      search,
      role,
      status,
      page = 1,
      limit = 10,
      sort = 'created_desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (role) where.role = role;
    if (status === 'active') where.active = true;
    if (status === 'inactive') where.active = false;
    if (status === 'pending') {
      where.active = true;
      where.emailVerified = false;
    }
    if (search?.trim()) {
      where.OR = [
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { fullName: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const orderBy =
      sort === 'name_asc'
        ? { fullName: 'asc' as const }
        : sort === 'created_asc'
          ? { createdAt: 'asc' as const }
          : { createdAt: 'desc' as const };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          active: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        ...u,
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
        status: !u.active ? 'inactive' : u.emailVerified ? 'active' : 'pending',
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneForAdmin(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        active: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      ...user,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      status: !user.active ? 'inactive' : user.emailVerified ? 'active' : 'pending',
    };
  }

  async createUserForAdmin(dto: AdminCreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) throw new ConflictException('User with this email already exists');
    const tempPassword = await bcrypt.hash(
      `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      SALT_ROUNDS,
    );
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        password: tempPassword,
        fullName: dto.fullName.trim(),
        role: dto.role ?? 'USER',
        active: true,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
    return { ...user, createdAt: user.createdAt.toISOString() };
  }

  async updateUserForAdmin(id: number, dto: AdminUpdateUserDto) {
    await this.findOneForAdmin(id);
    const data: Record<string, unknown> = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName.trim();
    if (dto.phone !== undefined) data.phone = dto.phone.trim();
    await this.prisma.user.update({ where: { id }, data });
    return this.findOneForAdmin(id);
  }

  async updateRoleForAdmin(id: number, role: 'USER' | 'ADMIN' | 'GUIDE') {
    await this.findOneForAdmin(id);
    await this.prisma.user.update({ where: { id }, data: { role } });
    return this.findOneForAdmin(id);
  }

  async updateStatusForAdmin(id: number, active: boolean) {
    await this.findOneForAdmin(id);
    await this.prisma.user.update({ where: { id }, data: { active } });
    return this.findOneForAdmin(id);
  }

  async softDeleteForAdmin(id: number) {
    await this.findOneForAdmin(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }
}
