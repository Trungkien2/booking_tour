import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  // Xóa dữ liệu mẫu cũ (giữ users) để seed chạy lại được nhiều lần
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingTraveler.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tourSchedule.deleteMany();
  await prisma.tour.deleteMany();
  console.log('Cleaned existing seed data (tours, schedules, bookings, etc.).');

  // --- 1. USERS ---
  const hashedPassword = await bcrypt.hash('Password123!', SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookingtour.com' },
    update: {},
    create: {
      email: 'admin@bookingtour.com',
      password: hashedPassword,
      fullName: 'Admin User',
      phone: '+84123456789',
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      fullName: 'Jane Doe',
      phone: '+84987654321',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      fullName: 'John Smith',
      phone: '+84111222333',
      role: 'USER',
    },
  });

  console.log('Created users:', { admin: admin.email, user1: user1.email, user2: user2.email });

  // --- 2. TOURS ---
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { slug: 'ha-long-bay-2d1n' },
      update: {},
      create: {
        name: 'Hạ Long Bay 2D1N',
        slug: 'ha-long-bay-2d1n',
        summary: 'Cruise on emerald waters, visit caves and floating villages.',
        description:
          'Explore the UNESCO World Heritage Site of Hạ Long Bay. Overnight on a traditional junk boat, kayak through limestone karsts, and enjoy fresh seafood.',
        coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
        images: [
          'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        ],
        durationDays: 2,
        priceAdult: 199.99,
        priceChild: 99.99,
        location: 'Quảng Ninh, Vietnam',
        status: 'PUBLISHED',
        difficulty: 'EASY',
        featured: true,
        reviewCount: 2,
        ratingAverage: 4.5,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'sapa-trekking-3d2n' },
      update: {},
      create: {
        name: 'Sapa Trekking 3D2N',
        slug: 'sapa-trekking-3d2n',
        summary: 'Trek through rice terraces and meet local ethnic minorities.',
        description:
          'Experience the stunning rice terraces of Sapa. Stay in a homestay, trek to villages of Hmong and Dao people, and enjoy cool mountain air.',
        coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        durationDays: 3,
        priceAdult: 149.5,
        priceChild: 75.0,
        location: 'Lào Cai, Vietnam',
        status: 'PUBLISHED',
        difficulty: 'MODERATE',
        featured: true,
        reviewCount: 0,
        ratingAverage: 0,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'hoi-an-cultural-tour' },
      update: {},
      create: {
        name: 'Hội An Cultural Tour',
        slug: 'hoi-an-cultural-tour',
        summary: 'Ancient town, lanterns, and local crafts.',
        description:
          'Walk through the UNESCO ancient town of Hội An. Visit Japanese Bridge, tailor shops, and join a lantern-making workshop. Optional cooking class.',
        coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
        durationDays: 1,
        priceAdult: 49.99,
        priceChild: 24.99,
        location: 'Quảng Nam, Vietnam',
        status: 'PUBLISHED',
        difficulty: 'EASY',
        featured: false,
        reviewCount: 1,
        ratingAverage: 5.0,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'mekong-delta-day-trip' },
      update: {},
      create: {
        name: 'Mekong Delta Day Trip',
        slug: 'mekong-delta-day-trip',
        summary: 'Boat trip, coconut candy, and tropical fruits.',
        description:
          'Full-day trip from Ho Chi Minh City. Boat ride along canals, visit local workshops (coconut candy, honey), taste tropical fruits, and enjoy traditional music.',
        durationDays: 1,
        priceAdult: 39.99,
        priceChild: 19.99,
        location: 'Tiền Giang, Vietnam',
        status: 'PUBLISHED',
        difficulty: 'EASY',
        featured: false,
        reviewCount: 0,
        ratingAverage: 0,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'nha-trang-diving-draft' },
      update: {},
      create: {
        name: 'Nha Trang Diving Experience',
        slug: 'nha-trang-diving-draft',
        summary: 'Scuba diving for beginners and certified divers. (Draft)',
        description: 'Discover coral reefs and marine life. Equipment and instruction included.',
        durationDays: 1,
        priceAdult: 89.0,
        priceChild: 0,
        location: 'Khánh Hòa, Vietnam',
        status: 'DRAFT',
        difficulty: 'CHALLENGING',
        featured: false,
        reviewCount: 0,
        ratingAverage: 0,
      },
    }),
    // Additional tours for better testing
    prisma.tour.upsert({
      where: { slug: 'swiss-alps-adventure' },
      update: {},
      create: {
        name: 'Swiss Alps Adventure',
        slug: 'swiss-alps-adventure',
        summary: 'Explore breathtaking mountain views and hiking trails.',
        description:
          'Discover the Swiss Alps with guided hikes, cable car rides, and stunning panoramic views. Perfect for nature lovers and adventure seekers.',
        coverImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        durationDays: 5,
        priceAdult: 1299.0,
        priceChild: 899.0,
        location: 'Switzerland',
        status: 'PUBLISHED',
        difficulty: 'CHALLENGING',
        featured: true,
        reviewCount: 15,
        ratingAverage: 4.8,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'bali-island-escape' },
      update: {},
      create: {
        name: 'Bali Island Escape',
        slug: 'bali-island-escape',
        summary: 'Tropical paradise with temples, beaches, and rice terraces.',
        description:
          'Experience the magic of Bali. Visit ancient temples, relax on pristine beaches, explore rice terraces, and immerse yourself in Balinese culture.',
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        durationDays: 7,
        priceAdult: 899.0,
        priceChild: 599.0,
        location: 'Bali, Indonesia',
        status: 'PUBLISHED',
        difficulty: 'EASY',
        featured: true,
        reviewCount: 42,
        ratingAverage: 4.9,
      },
    }),
    prisma.tour.upsert({
      where: { slug: 'tokyo-cultural-immersion' },
      update: {},
      create: {
        name: 'Tokyo Cultural Immersion',
        slug: 'tokyo-cultural-immersion',
        summary: 'Blend of ancient traditions and modern wonders.',
        description:
          'Explore Tokyo from ancient temples to neon-lit districts. Experience tea ceremonies, visit shrines, and discover cutting-edge technology.',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        durationDays: 4,
        priceAdult: 799.0,
        priceChild: 549.0,
        location: 'Tokyo, Japan',
        status: 'PUBLISHED',
        difficulty: 'EASY',
        featured: false,
        reviewCount: 28,
        ratingAverage: 4.7,
      },
    }),
  ]);

  console.log('Created tours:', tours.length);

  // --- 3. TOUR SCHEDULES ---
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const schedule1 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[0].id,
      startDate: nextMonth,
      maxCapacity: 20,
      currentCapacity: 3,
      status: 'OPEN',
    },
  });

  const schedule2 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[0].id,
      startDate: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
      maxCapacity: 15,
      currentCapacity: 15,
      status: 'SOLD_OUT',
    },
  });

  const schedule3 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[1].id,
      startDate: nextMonth,
      maxCapacity: 12,
      currentCapacity: 0,
      status: 'OPEN',
    },
  });

  const schedule4 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[2].id,
      startDate: nextMonth,
      maxCapacity: 30,
      currentCapacity: 5,
      status: 'OPEN',
    },
  });

  console.log('Created tour schedules:', 4);

  // --- 4. BOOKINGS ---
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      scheduleId: schedule1.id,
      totalPrice: 399.98,
      status: 'PAID',
      note: '2 adults',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      scheduleId: schedule4.id,
      totalPrice: 74.98,
      status: 'PENDING',
      note: '1 adult, 1 child',
    },
  });

  console.log('Created bookings:', 2);

  // --- 5. BOOKING TRAVELERS ---
  await prisma.bookingTraveler.createMany({
    data: [
      { bookingId: booking1.id, fullName: 'Jane Doe', ageGroup: 'ADULT', price: 199.99 },
      { bookingId: booking1.id, fullName: 'Guest Two', ageGroup: 'ADULT', price: 199.99 },
      { bookingId: booking2.id, fullName: 'John Smith', ageGroup: 'ADULT', price: 49.99 },
      { bookingId: booking2.id, fullName: 'Child Smith', ageGroup: 'CHILD', price: 24.99 },
    ],
  });

  console.log('Created booking travelers');

  // --- 6. PAYMENTS ---
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      userId: user1.id,
      amount: 399.98,
      provider: 'stripe',
      transactionId: 'txn_seed_001',
      status: 'SUCCESS',
    },
  });

  console.log('Created payment');

  // --- 7. REVIEWS ---
  await prisma.review.createMany({
    data: [
      { tourId: tours[0].id, userId: user1.id, rating: 5, comment: 'Amazing experience! Highly recommend.' },
      { tourId: tours[0].id, userId: user2.id, rating: 4, comment: 'Great cruise, food was good.' },
      { tourId: tours[2].id, userId: user1.id, rating: 5, comment: 'Beautiful ancient town.' },
    ],
  });

  console.log('Created reviews');

  console.log('\n✅ Seed completed successfully.');
  console.log('  - Users: admin@bookingtour.com (ADMIN), jane@example.com, john@example.com');
  console.log('  - Password for all: Password123!');
  console.log('  - Tours:', tours.length, '(7 published, 1 draft)');
  console.log('  - Schedules, bookings, travelers, payment, reviews created.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
