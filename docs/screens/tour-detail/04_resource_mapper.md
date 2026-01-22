# Tour Detail - Resource Mapper

## 1. Tour Data Mapping

### API → UI Components

| API Field | UI Component | Transform |
|-----------|--------------|-----------|
| `name` | Page title, Hero title | Direct |
| `slug` | URL | `/tours/${slug}` |
| `summary` | Meta description | Direct |
| `description` | About section | Render HTML/Markdown |
| `coverImage` | Hero image | Direct |
| `images` | Gallery thumbnails | Array of URLs |
| `durationDays` | Duration badge | `${value} Days` |
| `priceAdult` | Price display | `formatCurrency()` |
| `priceChild` | Child price | `formatCurrency()` |
| `location` | Location badge | Direct |
| `coordinates` | Map center | `[lat, lng]` |
| `ratingAverage` | Rating stars | `toFixed(1)` |
| `reviewCount` | Review count | `(${value} reviews)` |
| `highlights` | Highlight cards | Icon + label |
| `itinerary` | Accordion items | Day + title + description |
| `included` | Included list | Check icon + text |
| `notIncluded` | Not included list | X icon + text |
| `meetingPoint` | Map + address | Name, address, instructions |

---

## 2. Schedule Mapping

### API → Calendar/Picker

| API Field | UI Field | Transform |
|-----------|----------|-----------|
| `id` | Schedule ID | Direct |
| `startDate` | Calendar date | `formatDate()` |
| `availableSpots` | Availability indicator | Number or "Sold Out" |
| `status` | Date styling | Status → CSS class |
| `priceAdult` | Price (may vary) | `formatCurrency()` |

### Status Mapping
```typescript
const scheduleStatusConfig = {
  OPEN: {
    selectable: true,
    className: "bg-green-100 text-green-800",
    label: (spots: number) => `${spots} spots left`
  },
  SOLD_OUT: {
    selectable: false,
    className: "bg-red-100 text-red-800 cursor-not-allowed",
    label: () => "Sold Out"
  },
  CLOSED: {
    selectable: false,
    className: "bg-gray-100 text-gray-500",
    label: () => "Closed"
  },
  COMPLETED: {
    selectable: false,
    className: "bg-gray-100 text-gray-500",
    label: () => "Completed"
  }
};
```

---

## 3. Price Calculation

```typescript
interface BookingPriceCalculation {
  scheduleId: number;
  adults: number;
  children: number;
  priceAdult: number;
  priceChild: number;
  taxRate: number; // e.g., 0.10 for 10%
}

function calculateTotalPrice(input: BookingPriceCalculation) {
  const adultsTotal = input.adults * input.priceAdult;
  const childrenTotal = input.children * input.priceChild;
  const subtotal = adultsTotal + childrenTotal;
  const taxes = subtotal * input.taxRate;
  const total = subtotal + taxes;

  return {
    breakdown: {
      adults: { count: input.adults, unitPrice: input.priceAdult, total: adultsTotal },
      children: { count: input.children, unitPrice: input.priceChild, total: childrenTotal },
      subtotal,
      taxes,
      total
    },
    formatted: {
      adults: formatCurrency(adultsTotal),
      children: formatCurrency(childrenTotal),
      subtotal: formatCurrency(subtotal),
      taxes: formatCurrency(taxes),
      total: formatCurrency(total)
    }
  };
}
```

---

## 4. Review Mapping

| API Field | UI Component | Transform |
|-----------|--------------|-----------|
| `user.fullName` | Reviewer name | Direct |
| `user.avatar` | Avatar image | URL or initials fallback |
| `rating` | Star rating | Render stars |
| `comment` | Review text | Direct |
| `createdAt` | Review date | `formatRelativeDate()` |
| `helpful` | Helpful count | `${value} people found this helpful` |

### Rating Distribution Transform
```typescript
// API Response
const distribution = { "5": 35, "4": 8, "3": 3, "2": 1, "1": 0 };
const total = 47;

// UI Display (percentage bars)
const distributionUI = Object.entries(distribution).map(([stars, count]) => ({
  stars: parseInt(stars),
  count,
  percentage: Math.round((count / total) * 100),
  width: `${Math.round((count / total) * 100)}%`
})).reverse(); // 5 stars first
```

---

## 5. Type Definitions

```typescript
// types/tour.ts

export interface TourDetail {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  images: string[];
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  ratingAverage: number;
  reviewCount: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  maxGroupSize: number;
  highlights: Highlight[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  meetingPoint: MeetingPoint;
  cancellationPolicy: string;
}

export interface Highlight {
  icon: string;
  label: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface MeetingPoint {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  instructions: string;
}

export interface TourSchedule {
  id: number;
  tourId: number;
  startDate: string;
  maxCapacity: number;
  currentCapacity: number;
  availableSpots: number;
  status: 'OPEN' | 'SOLD_OUT' | 'CLOSED' | 'COMPLETED';
  priceAdult: number;
  priceChild: number;
}

export interface BookingSelection {
  scheduleId: number | null;
  schedule: TourSchedule | null;
  adults: number;
  children: number;
  totalPrice: number;
}
```

---

## 6. Booking Intent Storage

```typescript
// Store booking intent for anonymous users
interface BookingIntent {
  tourSlug: string;
  scheduleId: number;
  adults: number;
  children: number;
  timestamp: number;
}

// Save to sessionStorage before redirecting to login
function saveBookingIntent(intent: BookingIntent) {
  sessionStorage.setItem('bookingIntent', JSON.stringify(intent));
}

// Restore after login
function restoreBookingIntent(): BookingIntent | null {
  const stored = sessionStorage.getItem('bookingIntent');
  if (stored) {
    sessionStorage.removeItem('bookingIntent');
    return JSON.parse(stored);
  }
  return null;
}
```

---

## 7. Custom Hooks

```typescript
// hooks/use-tour.ts
export function useTour(slug: string) {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn: () => tourService.getBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// hooks/use-tour-schedules.ts
export function useTourSchedules(tourId: number) {
  return useQuery({
    queryKey: ['tour-schedules', tourId],
    queryFn: () => tourService.getSchedules(tourId),
    staleTime: 2 * 60 * 1000, // 2 minutes (availability changes)
    enabled: !!tourId,
  });
}

// hooks/use-booking-selection.ts
export function useBookingSelection(tour: TourDetail | undefined) {
  const [selection, setSelection] = useState<BookingSelection>({
    scheduleId: null,
    schedule: null,
    adults: 2,
    children: 0,
    totalPrice: 0
  });

  // Calculate total price whenever selection changes
  useEffect(() => {
    if (selection.schedule && tour) {
      const total = calculateTotalPrice({
        scheduleId: selection.schedule.id,
        adults: selection.adults,
        children: selection.children,
        priceAdult: selection.schedule.priceAdult,
        priceChild: selection.schedule.priceChild,
        taxRate: 0.10
      });
      setSelection(prev => ({ ...prev, totalPrice: total.breakdown.total }));
    }
  }, [selection.schedule, selection.adults, selection.children, tour]);

  return { selection, setSelection };
}
```

---

## 8. Mock Data

```typescript
export const mockTourDetail: TourDetail = {
  id: 1,
  name: "3-Day Kayaking Adventure in Norway",
  slug: "3-day-kayaking-adventure-norway",
  summary: "Experience the breathtaking fjords of Norway",
  description: "<p>Full description here...</p>",
  coverImage: "/images/tours/norway-hero.jpg",
  images: [
    "/images/tours/norway-1.jpg",
    "/images/tours/norway-2.jpg",
    "/images/tours/norway-3.jpg"
  ],
  durationDays: 3,
  priceAdult: 1200,
  priceChild: 800,
  location: "Bergen, Norway",
  coordinates: { lat: 60.3913, lng: 5.3221 },
  ratingAverage: 4.8,
  reviewCount: 47,
  difficulty: "moderate",
  maxGroupSize: 12,
  highlights: [
    { icon: "compass", label: "Paddle through fjords" },
    { icon: "sun", label: "Scenic hiking" },
    { icon: "users", label: "Expert local guide" }
  ],
  itinerary: [
    { day: 1, title: "Arrival & First Paddle", description: "..." },
    { day: 2, title: "Deep Fjord Exploration", description: "..." },
    { day: 3, title: "Return & Farewell", description: "..." }
  ],
  included: ["Professional guide", "All equipment", "Meals"],
  notIncluded: ["Flights", "Travel insurance"],
  meetingPoint: {
    name: "Bergen Harbor Pier 7",
    address: "Bradbenken 5, 5003 Bergen",
    coordinates: { lat: 60.3943, lng: 5.3259 },
    instructions: "Look for our guide with the orange flag"
  },
  cancellationPolicy: "Free cancellation up to 7 days before"
};
```
