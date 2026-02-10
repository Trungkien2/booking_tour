## Task Checklist: User Profile Screen (`/profile`)

### Phase 1 – Database (Prisma)

- [x] **DB-1**: Mở rộng model `User` trong `apps/server/prisma/schema.prisma` ✅ (Completed)
  - [x] Thêm các field mới: `avatarUrl`, `address`, `bio`, `preferences` (Json), `emailVerified`, `lastPasswordChangeAt` với đúng `@map` và kiểu dữ liệu.
  - [x] Chạy `pnpm prisma migrate dev --name user_profile_fields` để tạo migration.
  - [x] Cập nhật `prisma generate` nếu cần.

- [x] **DB-2**: Kiểm tra & cập nhật seed (nếu có) ✅ (Completed)
  - [x] Cập nhật script seed để tạo user mẫu có các field mới (avatarUrl, preferences...).

---

### Phase 2 – Backend (NestJS)

#### 2.1 Users module & DTOs

- [x] **BE-1**: Tạo/ mở rộng `UsersModule` ✅ (Completed)
  - [x] Đảm bảo module import `PrismaModule` và export `UsersService` nếu cần dùng nơi khác.

- [x] **BE-2**: Tạo DTO cho profile ✅ (Completed)
  - [x] Tạo `UpdateMeDto` với các field optional: `fullName`, `phone`, `address`, `bio`, `preferences`.
  - [x] Tạo `PreferencesDto` với các boolean (e.g. `vegetarianMeals`, `windowSeat`).
  - [x] Thêm validation `@IsString`, `@MaxLength(500)` cho `bio`, `@IsBoolean` cho các toggle.

- [x] **BE-3**: Tạo DTO cho đổi mật khẩu ✅ (Completed)
  - [x] `ChangePasswordDto` với `currentPassword` và `newPassword`.
  - [x] Validation độ mạnh mật khẩu (min length, ký tự số/chữ, v.v.).

#### 2.2 Users service

- [x] **BE-4**: Implement `UsersService.getMe(userId)` ✅ (Completed)
  - [x] Dùng Prisma `user.findUnique` với `where: { id }`.
  - [x] Select đúng field (không trả về `password`).
  - [x] Map sang DTO trả ra cho frontend.

- [x] **BE-5**: Implement `UsersService.updateMe(userId, dto)` ✅ (Completed)
  - [x] Map DTO sang `Prisma.UserUpdateInput`.
  - [x] Gọi `user.update` cập nhật các field tương ứng.
  - [x] Trả về user đã cập nhật.

- [x] **BE-6**: Implement `UsersService.updateAvatar(userId, file)` ✅ (Completed)
  - [x] Validate file type (jpeg/png/webp) và size.
  - [x] Upload file to local storage (uploads/avatars/).
  - [x] Lưu URL vào `avatarUrl` bằng Prisma.
  - [x] Trả về `{ avatarUrl }`.

- [x] **BE-7**: Implement `UsersService.changePassword(userId, dto)` ✅ (Completed)
  - [x] Lấy user hiện tại, so sánh `currentPassword` (bcrypt.compare).
  - [x] Validate `newPassword` theo rule.
  - [x] Hash mật khẩu mới, update `password` + `lastPasswordChangeAt`.
  - [x] Check new password != current password.

#### 2.3 Controllers & Guards

- [x] **BE-8**: Tạo `UsersMeController` với prefix `users/me` ✅ (Completed)
  - [x] Route `GET /users/me` gọi `getMe`.
  - [x] Route `PATCH /users/me` gọi `updateMe` với `UpdateMeDto`.
  - [x] Route `POST /users/me/avatar` dùng `FileInterceptor('file')` gọi `updateAvatar`.
  - [x] Route `PATCH /users/me/password` gọi `changePassword`.
  - [x] Áp dụng `@UseGuards(JwtAuthGuard)` cho controller.
  - [x] Dùng `@Req() req.user.userId` lấy userId từ JWT payload.

- [x] **BE-9**: Tạo endpoint `POST /auth/send-verification` ✅ (Completed)
  - [x] Handler created in `AuthController` (stub – logs request, returns success).
  - [x] Thêm rate-limiting qua `@Throttle` (3 request / 15 phút).
  - [x] TODO: integrate real email service in future.

---

### Phase 3 – Frontend (Next.js)

#### 3.1 Route & data fetching

- [x] **FE-1**: Tạo trang `apps/web/app/(site)/profile/page.tsx` ✅ (Completed)
  - [x] Client component with auth guard redirect.
  - [x] Fetch `getMyProfile()` from `/users/me` with JWT.
  - [x] Truyền `profile` xuống client components.

- [x] **FE-2**: Tạo layout profile ✅ (Completed)
  - [x] Component `ProfileLayout` chia 2 phần: sidebar (hẹp) & main content (rộng).
  - [x] Responsive (stacked on mobile, side-by-side on lg+).

#### 3.2 Sidebar & header

- [x] **FE-3**: Tạo `ProfileSidebar` component ✅ (Completed)
  - [x] Render avatar nhỏ, tên, "Member since {year}".
  - [x] Render navigation items (Personal Info, My Bookings, Payment Methods, Security, Notifications).
  - [x] `My Bookings` link sang `/bookings`.
  - [x] `Logout` gọi action logout (clearAuth + redirect).

- [x] **FE-4**: Tạo `ProfileHeader` trong main content ✅ (Completed)
  - [x] Avatar lớn (editable via AvatarUploader), tên, member type, badge "Verified" (nếu emailVerified).
  - [x] Text "Joined {date}".

#### 3.3 Personal info form

- [x] **FE-5**: Tạo `PersonalInfoForm` client component ✅ (Completed)
  - [x] Fields: fullName, phone, address, bio (textarea), preferences toggles.
  - [x] Email readonly + indicator verified/unverified, nút "Verify" nếu chưa verified.
  - [x] Nút "Save changes" (disabled when form not dirty).

- [x] **FE-6**: Kết nối API cập nhật profile ✅ (Completed)
  - [x] `updateMyProfile()` calls `PATCH /users/me`.
  - [x] Map dữ liệu form → `UpdateMeDto` (bao gồm preferences).
  - [x] Xử lý loading + disabled state cho nút Save.
  - [x] Hiển thị toast success/error.

- [x] **FE-7**: Hiển thị & trigger email verification ✅ (Completed)
  - [x] Nếu `emailVerified === false`, hiển thị badge + nút "Verify Email".
  - [x] Gọi `POST /auth/send-verification` khi bấm.
  - [x] Hiển thị thông báo "Verification email sent".

#### 3.4 Avatar upload

- [x] **FE-8**: Tạo `AvatarUploader` component ✅ (Completed)
  - [x] Hiển thị avatar hiện tại (hoặc placeholder initials).
  - [x] Cho phép click để mở file picker.
  - [x] Sau khi chọn file, hiển thị preview tạm.

- [x] **FE-9**: Tích hợp API upload avatar ✅ (Completed)
  - [x] Gửi `POST /users/me/avatar` (multipart/form-data).
  - [x] Xử lý loading + disabled state.
  - [x] Cập nhật avatarUrl trong state/profile khi upload thành công.

#### 3.5 Change password

- [x] **FE-10**: Tạo `ChangePasswordModal` component ✅ (Completed)
  - [x] Fields: currentPassword, newPassword, confirmPassword.
  - [x] Validation client: match confirm, độ dài tối thiểu.
  - [x] Show/hide password toggles.

- [x] **FE-11**: Kết nối API đổi mật khẩu ✅ (Completed)
  - [x] Gọi `PATCH /users/me/password`.
  - [x] Xử lý lỗi current password sai, password yếu.
  - [x] Đóng modal + hiển thị toast thành công.

---

### Phase 4 – Testing

#### 4.1 Backend Unit Tests (Jest)

- [x] **TEST-BE-1**: Unit test cho `UsersService.getMe` ✅ (Completed)
  - [x] Trả về đúng field, không chứa `password`.

- [x] **TEST-BE-2**: Unit test cho `UsersService.updateMe` ✅ (Completed)
  - [x] Chỉ gọi Prisma update với field có mặt trong DTO.
  - [x] Trim string values.

- [x] **TEST-BE-3**: Unit test cho `UsersService.updateAvatar` ✅ (Completed)
  - [x] File MIME không hợp lệ → throw.
  - [x] File size > 5MB → throw.
  - [x] Cập nhật đúng `avatarUrl`.

- [x] **TEST-BE-4**: Unit test cho `UsersService.changePassword` ✅ (Completed)
  - [x] currentPassword sai → throw error.
  - [x] newPassword == currentPassword → throw error.
  - [x] Thành công: gọi bcrypt.hash và update `lastPasswordChangeAt`.

#### 4.2 Backend E2E Tests

- [x] **TEST-E2E-1**: `/users/me` ✅ (Completed)
  - [x] Không gửi JWT → 401.
  - [x] JWT hợp lệ → 200 + payload khớp schema.

- [x] **TEST-E2E-2**: `PATCH /users/me` ✅ (Completed)
  - [x] Update fields → response has updated data.
  - [x] Reject non-whitelisted fields → 400.

- [x] **TEST-E2E-3**: `PATCH /users/me/password` ✅ (Completed)
  - [x] Đổi mật khẩu thành công → 200.
  - [x] Wrong current password → 401.
  - [x] Weak new password → 400.

- [x] **TEST-E2E-4**: `POST /users/me/avatar` ✅ (Completed)
  - [x] Upload file hợp lệ → 201, avatarUrl returned.
  - [x] No JWT → 401.

#### 4.3 Frontend Tests (tuỳ mức đầu tư)

- [ ] **TEST-FE-1**: Component test cho `PersonalInfoForm` 🚧 (Skipped – no test framework in web app)
- [ ] **TEST-FE-2**: Smoke test cho trang `/profile` 🚧 (Skipped – no test framework in web app)
- [ ] **TEST-FE-3**: E2E UI (Playwright/Cypress – nếu có) 🚧 (Skipped – no E2E framework installed)

---

### Phase 5 – Integration & QA

- [x] **INT-1**: Kiểm tra integration giữa profile và các màn khác ✅ (Completed)
  - [x] Profile data comes from User table, same source as bookings/reviews.
  - [x] Avatar URL served via ServeStaticModule at `/uploads`.

- [x] **INT-2**: Kiểm tra migration trên database hiện tại ✅ (Completed)
  - [x] Migration `user_profile_fields` applied successfully.
  - [x] New fields have sensible defaults (null for optional, false for emailVerified).
  - [x] Existing data unaffected.

- [x] **INT-3**: QA scenario ✅ (Verified via tests)
  - [x] All roles (USER, ADMIN, GUIDE) can access `/users/me` endpoints.
  - [x] JWT guard protects all endpoints.
  - [x] Seed includes verified (jane) and unverified (john) users.
