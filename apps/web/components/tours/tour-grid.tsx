import { Tour } from '@/lib/types/tour';
import { TourCard } from './tour-card';

interface TourGridProps {
  tours: Tour[];
}

export function TourGrid({ tours }: TourGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tours.map((tour, index) => (
        <TourCard
          key={tour.id}
          tour={tour}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
