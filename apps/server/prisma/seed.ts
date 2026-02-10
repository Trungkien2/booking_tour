import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  // Xóa dữ liệu mẫu cũ (giữ users) để seed chạy lại được nhiều lần
  await prisma.userFavorite.deleteMany();
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
      emailVerified: true,
      bio: 'Platform administrator',
      preferences: { vegetarianMeals: false, windowSeat: true },
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
      emailVerified: true,
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      bio: 'Love traveling and exploring new cultures.',
      preferences: { vegetarianMeals: true, windowSeat: true },
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
      emailVerified: false,
      address: '456 Lê Lợi, Quận 3, TP.HCM',
      bio: 'Adventure seeker and food enthusiast.',
      preferences: { vegetarianMeals: false, windowSeat: false },
    },
  });

  console.log('Created users:', {
    admin: admin.email,
    user1: user1.email,
    user2: user2.email,
  });

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
          'Explore the UNESCO World Heritage Site of Hạ Long Bay. Overnight on a traditional junk boat, kayak through limestone karsts, and enjoy fresh seafood. This 2-day, 1-night cruise takes you through one of the most spectacular seascapes in the world, featuring thousands of limestone islands and islets rising from the emerald waters of the Gulf of Tonkin.',
        coverImage:
          'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
        images: [
          'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
          'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
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
        coordinates: { lat: 20.9101, lng: 107.1839 },
        maxGroupSize: 20,
        highlights: [
          { icon: 'sailing', label: 'Overnight Cruise' },
          { icon: 'kayaking', label: 'Kayaking Adventure' },
          { icon: 'restaurant', label: 'Fresh Seafood' },
          { icon: 'photo_camera', label: 'Scenic Views' },
          { icon: 'explore', label: 'Cave Exploration' },
          { icon: 'groups', label: 'Small Group' },
        ],
        itinerary: [
          {
            day: 1,
            title: 'Board Cruise & Explore',
            description:
              'Welcome aboard, lunch on the boat, visit Sung Sot cave, kayaking at Luon cave, enjoy sunset party on sundeck.',
          },
          {
            day: 2,
            title: 'Sunrise & Return',
            description:
              'Tai Chi on sundeck at sunrise, brunch, visit Titop Island for swimming and hiking, return to Hanoi by noon.',
          },
        ],
        included: [
          'Round-trip transport from Hanoi',
          'Overnight cabin on cruise',
          'All meals (2 lunches, 1 dinner, 1 breakfast)',
          'Kayaking equipment',
          'Cave entrance fees',
          'English-speaking guide',
        ],
        notIncluded: [
          'Travel insurance',
          'Personal expenses',
          'Tips for guide and crew',
          'Drinks on board',
        ],
        meetingPoint: {
          name: 'Hanoi Old Quarter Pickup',
          address: '25 Hàng Bông, Hoàn Kiếm, Hanoi',
          coordinates: { lat: 21.0285, lng: 105.8542 },
          instructions:
            'We will pick you up from your hotel in the Old Quarter between 7:30-8:00 AM.',
        },
        cancellationPolicy:
          'Free cancellation up to 48 hours before departure. 50% refund for cancellations within 24-48 hours. No refund within 24 hours of departure.',
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
        coverImage:
          'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
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
        coverImage:
          'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
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
        description:
          'Discover coral reefs and marine life. Equipment and instruction included.',
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
          'Discover the Swiss Alps with guided hikes, cable car rides, and stunning panoramic views. Perfect for nature lovers and adventure seekers. This 5-day adventure takes you through some of the most iconic Alpine landscapes, from the Jungfrau region to the Matterhorn.',
        coverImage:
          'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        images: [
          'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        ],
        durationDays: 5,
        priceAdult: 1299.0,
        priceChild: 899.0,
        location: 'Switzerland',
        status: 'PUBLISHED',
        difficulty: 'CHALLENGING',
        featured: true,
        reviewCount: 15,
        ratingAverage: 4.8,
        coordinates: { lat: 46.5197, lng: 7.9674 },
        maxGroupSize: 10,
        highlights: [
          { icon: 'landscape', label: 'Alpine Views' },
          { icon: 'hiking', label: 'Guided Hikes' },
          { icon: 'train', label: 'Cable Car Rides' },
          { icon: 'hotel', label: '4-Star Hotels' },
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Zurich',
            description:
              'Airport transfer, welcome dinner, briefing for the days ahead.',
          },
          {
            day: 2,
            title: 'Jungfrau Region',
            description:
              'Train to Grindelwald, hike to First cliff walk, cable car to Jungfraujoch (Top of Europe).',
          },
          {
            day: 3,
            title: 'Interlaken Adventure',
            description:
              'Paragliding (optional), lake cruise on Lake Thun, Swiss cheese fondue dinner.',
          },
          {
            day: 4,
            title: 'Zermatt & Matterhorn',
            description:
              'Scenic train to Zermatt, Gornergrat railway for Matterhorn views, village exploration.',
          },
          {
            day: 5,
            title: 'Departure',
            description:
              'Breakfast, transfer to Zurich airport. Optional shopping in Zurich old town.',
          },
        ],
        included: [
          '4 nights in 4-star hotels',
          'Daily breakfast and 3 dinners',
          'All transport within Switzerland',
          'Cable car and train tickets',
          'Professional mountain guide',
          'Airport transfers',
        ],
        notIncluded: [
          'International flights',
          'Travel insurance',
          'Lunches',
          'Optional activities (paragliding)',
          'Personal expenses',
        ],
        meetingPoint: {
          name: 'Zurich Airport',
          address: 'Zurich Airport (ZRH), Arrival Hall',
          coordinates: { lat: 47.4502, lng: 8.5616 },
          instructions:
            'Meet our guide at the arrival hall, holding a Swiss Alps Adventure sign. Transfer at 2:00 PM.',
        },
        cancellationPolicy:
          'Free cancellation up to 14 days before departure. 50% refund 7-14 days. No refund within 7 days.',
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
        coverImage:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
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
        coverImage:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
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

  // Schedules for Swiss Alps
  const schedule5 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[5].id, // swiss-alps-adventure
      startDate: nextMonth,
      maxCapacity: 10,
      currentCapacity: 4,
      status: 'OPEN',
    },
  });

  const schedule6 = await prisma.tourSchedule.create({
    data: {
      tourId: tours[5].id,
      startDate: new Date(nextMonth.getTime() + 14 * 24 * 60 * 60 * 1000),
      maxCapacity: 10,
      currentCapacity: 0,
      status: 'OPEN',
    },
  });

  console.log('Created tour schedules:', 6);

  // --- 4. BOOKINGS ---
  const fifteenMinFromNow = new Date(now.getTime() + 15 * 60 * 1000);

  // Booking 1: PAID - Jane booked Ha Long Bay
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      scheduleId: schedule1.id,
      totalPrice: 399.98,
      status: 'PAID',
      note: '2 adults',
      expiresAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // expired (already paid)
    },
  });

  // Booking 2: PENDING - John pending on Hoi An
  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      scheduleId: schedule4.id,
      totalPrice: 74.98,
      status: 'PENDING',
      note: '1 adult, 1 child',
      expiresAt: fifteenMinFromNow,
    },
  });

  // Booking 3: CANCELLED - Jane cancelled a booking
  const booking3 = await prisma.booking.create({
    data: {
      userId: user1.id,
      scheduleId: schedule3.id,
      totalPrice: 149.5,
      status: 'CANCELLED',
      note: '1 adult',
      cancelledAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      cancelReason: 'Change of plans',
      expiresAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Booking 4: PAID - John booked Swiss Alps
  const booking4 = await prisma.booking.create({
    data: {
      userId: user2.id,
      scheduleId: schedule5.id,
      totalPrice: 2598.0,
      status: 'PAID',
      note: '2 adults for Swiss Alps',
      expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Booking 5: REFUNDED - Jane got refund on Swiss Alps
  const booking5 = await prisma.booking.create({
    data: {
      userId: user1.id,
      scheduleId: schedule6.id,
      totalPrice: 1299.0,
      status: 'REFUNDED',
      note: '1 adult',
      cancelledAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      cancelReason: 'Medical reasons',
      expiresAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created bookings:', 5);

  // --- 5. BOOKING TRAVELERS ---
  await prisma.bookingTraveler.createMany({
    data: [
      // Booking 1: 2 adults
      {
        bookingId: booking1.id,
        fullName: 'Jane Doe',
        ageGroup: 'ADULT',
        price: 199.99,
      },
      {
        bookingId: booking1.id,
        fullName: 'Guest Two',
        ageGroup: 'ADULT',
        price: 199.99,
      },
      // Booking 2: 1 adult + 1 child
      {
        bookingId: booking2.id,
        fullName: 'John Smith',
        ageGroup: 'ADULT',
        price: 49.99,
      },
      {
        bookingId: booking2.id,
        fullName: 'Child Smith',
        ageGroup: 'CHILD',
        price: 24.99,
      },
      // Booking 3: 1 adult
      {
        bookingId: booking3.id,
        fullName: 'Jane Doe',
        ageGroup: 'ADULT',
        price: 149.5,
      },
      // Booking 4: 2 adults
      {
        bookingId: booking4.id,
        fullName: 'John Smith',
        ageGroup: 'ADULT',
        price: 1299.0,
      },
      {
        bookingId: booking4.id,
        fullName: 'Jane Smith',
        ageGroup: 'ADULT',
        price: 1299.0,
      },
      // Booking 5: 1 adult
      {
        bookingId: booking5.id,
        fullName: 'Jane Doe',
        ageGroup: 'ADULT',
        price: 1299.0,
      },
    ],
  });

  console.log('Created booking travelers');

  // --- 6. PAYMENTS ---
  const payment1 = await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      userId: user1.id,
      amount: 399.98,
      provider: 'stripe',
      transactionId: 'txn_seed_001',
      status: 'SUCCESS',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking3.id,
      userId: user1.id,
      amount: 149.5,
      provider: 'stripe',
      transactionId: 'txn_seed_002',
      status: 'SUCCESS',
    },
  });

  const payment3 = await prisma.payment.create({
    data: {
      bookingId: booking4.id,
      userId: user2.id,
      amount: 2598.0,
      provider: 'stripe',
      transactionId: 'txn_seed_003',
      status: 'SUCCESS',
    },
  });

  const payment4 = await prisma.payment.create({
    data: {
      bookingId: booking5.id,
      userId: user1.id,
      amount: 1299.0,
      provider: 'stripe',
      transactionId: 'txn_seed_004',
      status: 'SUCCESS',
    },
  });

  console.log('Created payments:', 4);

  // --- 6b. REFUNDS ---
  await prisma.refund.create({
    data: {
      bookingId: booking5.id,
      paymentId: payment4.id,
      amount: 909.3, // 70% refund (early cancellation)
      reason: 'Medical reasons - early cancellation',
      status: 'COMPLETED',
      gatewayRefundId: 'refund_seed_001',
      processedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Created refunds:', 1);

  // --- 7. REVIEWS ---
  await prisma.review.createMany({
    data: [
      {
        tourId: tours[0].id,
        userId: user1.id,
        rating: 5,
        comment: 'Amazing experience! Highly recommend.',
        helpful: 12,
      },
      {
        tourId: tours[0].id,
        userId: user2.id,
        rating: 4,
        comment: 'Great cruise, food was good.',
        helpful: 3,
      },
      {
        tourId: tours[2].id,
        userId: user1.id,
        rating: 5,
        comment: 'Beautiful ancient town.',
        helpful: 5,
      },
      {
        tourId: tours[5].id,
        userId: user1.id,
        rating: 5,
        comment: 'Breathtaking views! The Jungfrau region was incredible.',
        helpful: 8,
      },
      {
        tourId: tours[5].id,
        userId: user2.id,
        rating: 4,
        comment: 'Great adventure but very challenging hikes. Pack good shoes!',
        helpful: 6,
      },
    ],
  });

  console.log('Created reviews');

  // --- 8. FAVORITES ---
  await prisma.userFavorite.createMany({
    data: [
      { userId: user1.id, tourId: tours[0].id },
      { userId: user1.id, tourId: tours[5].id },
      { userId: user2.id, tourId: tours[6].id },
    ],
  });

  console.log('Created favorites');

  console.log('\n✅ Seed completed successfully.');
  console.log(
    '  - Users: admin@bookingtour.com (ADMIN), jane@example.com, john@example.com',
  );
  console.log('  - Password for all: Password123!');
  console.log('  - Tours:', tours.length, '(7 published, 1 draft)');
  console.log('  - Schedules: 6, Bookings: 5 (PAID/PENDING/CANCELLED/REFUNDED)');
  console.log('  - Payments: 4, Refunds: 1, Reviews: 5, Favorites: 3');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
