import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTourBySlug,
  getTourSchedules,
  getTourReviews,
} from "@/lib/api/tours";

import { TourHeader } from "@/components/tours/tour-detail/tour-header";
import { TourGallery } from "@/components/tours/tour-detail/tour-gallery";
import { TourHighlights } from "@/components/tours/tour-detail/tour-highlights";
import { TourDescription } from "@/components/tours/tour-detail/tour-description";
import { TourItinerary } from "@/components/tours/tour-detail/tour-itinerary";
import { TourIncluded } from "@/components/tours/tour-detail/tour-included";
import { TourMeetingPoint } from "@/components/tours/tour-detail/tour-meeting-point";
import { TourReviews } from "@/components/tours/tour-detail/tour-reviews";
import { BookingCard } from "@/components/tours/tour-detail/booking-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const tour = await getTourBySlug(slug);
    return {
      title: `${tour.name} | TourBooking`,
      description: tour.summary || tour.description?.substring(0, 160),
      openGraph: {
        title: tour.name,
        description: tour.summary || undefined,
        images: tour.coverImage ? [tour.coverImage] : [],
        type: "website",
      },
    };
  } catch {
    return {
      title: "Tour Not Found | TourBooking",
    };
  }
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;

  let tour;
  try {
    tour = await getTourBySlug(slug);
  } catch (error) {
    if (error instanceof Error && error.message === "TOUR_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  // Prefetch schedules and reviews in parallel
  const [schedulesData, reviewsData] = await Promise.all([
    getTourSchedules(tour.id).catch(() => ({ schedules: [] })),
    getTourReviews(tour.id).catch(() => ({
      summary: { averageRating: 0, totalReviews: 0, distribution: {} },
      reviews: [],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
        hasNext: false,
      },
    })),
  ]);
  console.log("🚀 ~ TourDetailPage ~ schedulesData:", schedulesData)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <TourHeader tour={tour} />

        {/* Gallery */}
        <div className="mt-6">
          <TourGallery coverImage={tour.coverImage} images={tour.images} />
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-6">
            <TourHighlights highlights={tour.highlights} />
            <TourDescription description={tour.description} />
            <TourItinerary itinerary={tour.itinerary} />
            <TourIncluded
              included={tour.included}
              notIncluded={tour.notIncluded}
            />
            <TourMeetingPoint meetingPoint={tour.meetingPoint} />
            <TourReviews tourId={tour.id} initialData={reviewsData} />
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard
              tour={tour}
              initialSchedules={schedulesData.schedules}
            />
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
