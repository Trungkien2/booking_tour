import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import {
  TourResponseDto,
  TourListResponseDto,
  TourStatisticsDto,
} from './dto/tour-response.dto';

/** Swagger decorators cho GET /api/admin/tours/statistics */
export function ApiGetStatistics() {
  return applyDecorators(
    ApiOperation({
      summary: 'Lấy thống kê tour',
      description: 'Trả về tổng số tour, active, draft, fully booked (chỉ ADMIN).',
    }),
    ApiResponse({
      status: 200,
      description: 'Thống kê tour',
      type: TourStatisticsDto,
    }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
  );
}

/** Swagger decorators cho GET /api/admin/tours */
export function ApiFindAllTours() {
  return applyDecorators(
    ApiOperation({
      summary: 'Danh sách tour (phân trang, lọc, tìm kiếm)',
      description:
        'Lấy danh sách tour với pagination. Có thể filter theo status, search theo tên/địa điểm, sắp xếp (chỉ ADMIN).',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Tìm theo tên tour hoặc địa điểm',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      description: 'Lọc theo trạng thái',
    }),
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiQuery({
      name: 'sort',
      required: false,
      example: 'createdAt:desc',
      description: 'Sắp xếp: field:asc hoặc field:desc',
    }),
    ApiResponse({
      status: 200,
      description: 'Danh sách tour và meta pagination',
      type: TourListResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
  );
}

/** Swagger decorators cho GET /api/admin/tours/:id */
export function ApiFindOneTour() {
  return applyDecorators(
    ApiOperation({
      summary: 'Chi tiết một tour',
      description: 'Lấy thông tin tour theo ID, kèm tổng slots / đã đặt / còn trống (chỉ ADMIN).',
    }),
    ApiParam({ name: 'id', type: Number, example: 1, description: 'ID tour' }),
    ApiResponse({
      status: 200,
      description: 'Chi tiết tour',
      type: TourResponseDto,
    }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
    ApiResponse({ status: 404, description: 'Tour không tồn tại' }),
  );
}

/** Swagger decorators cho POST /api/admin/tours */
export function ApiCreateTour() {
  return applyDecorators(
    ApiOperation({
      summary: 'Tạo tour mới',
      description: 'Tạo tour mới. Slug tự sinh từ tên. Mặc định status = DRAFT (chỉ ADMIN).',
    }),
    ApiBody({
      type: CreateTourDto,
      examples: {
        minimal: {
          summary: 'Tối thiểu (name, durationDays, priceAdult, priceChild)',
          value: {
            name: 'Hạ Long Bay 2D1N',
            durationDays: 2,
            priceAdult: 199.99,
            priceChild: 99.99,
          },
        },
        full: {
          summary: 'Đầy đủ (có summary, description, location, status)',
          value: {
            name: 'Hạ Long Bay 2D1N',
            summary: 'Cruise on emerald waters.',
            description: 'Explore UNESCO World Heritage Site.',
            coverImage: 'https://example.com/cover.jpg',
            durationDays: 2,
            priceAdult: 199.99,
            priceChild: 99.99,
            location: 'Quảng Ninh, Vietnam',
            status: 'PUBLISHED',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Tour đã tạo',
      type: TourResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
    ApiResponse({
      status: 409,
      description: 'Slug trùng (tour cùng tên đã tồn tại)',
    }),
  );
}

/** Swagger decorators cho PATCH /api/admin/tours/:id */
export function ApiUpdateTour() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cập nhật tour',
      description:
        'Cập nhật một phần hoặc toàn bộ thông tin tour. Đổi tên thì slug tự sinh lại (chỉ ADMIN).',
    }),
    ApiParam({ name: 'id', type: Number, example: 1, description: 'ID tour' }),
    ApiBody({
      type: UpdateTourDto,
      description: 'Chỉ gửi các field cần cập nhật (partial)',
      examples: {
        status: {
          summary: 'Chỉ đổi trạng thái',
          value: { status: 'PUBLISHED' },
        },
        price: {
          summary: 'Chỉ đổi giá',
          value: { priceAdult: 219.99, priceChild: 109.99 },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Tour đã cập nhật',
      type: TourResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
    ApiResponse({ status: 404, description: 'Tour không tồn tại' }),
    ApiResponse({
      status: 409,
      description: 'Slug trùng sau khi đổi tên',
    }),
  );
}

/** Swagger decorators cho DELETE /api/admin/tours/:id */
export function ApiDeleteTour() {
  return applyDecorators(
    ApiOperation({
      summary: 'Xóa tour (soft delete)',
      description:
        'Đánh dấu xóa tour (deletedAt). Không xóa được nếu còn booking PENDING/PAID (chỉ ADMIN).',
    }),
    ApiParam({ name: 'id', type: Number, example: 1, description: 'ID tour' }),
    ApiResponse({ status: 204, description: 'Đã xóa (soft delete)' }),
    ApiResponse({ status: 401, description: 'Chưa đăng nhập' }),
    ApiResponse({ status: 403, description: 'Không có quyền ADMIN' }),
    ApiResponse({ status: 404, description: 'Tour không tồn tại' }),
    ApiResponse({
      status: 400,
      description: 'Tour còn booking đang hoạt động, không thể xóa',
    }),
  );
}
