# Tours Overview - Resource Mapper

## 1. URL Params → API Request

| URL Param | API Param | Transform |
|-----------|-----------|-----------|
| `search` | `search` | Direct |
| `page` | `page` | `parseInt()` |
| `sort` | `sort` | Direct |
| `price` | `priceMin`, `priceMax` | Split range (e.g., "500-1000") |
| `difficulty` | `difficulty` | Direct |
| `duration` | `duration` | Direct |

### Example Transform
```typescript
// URL: /tours?search=bali&price=500-1000&page=2

// API Request
const params = {
  search: "bali",
  priceMin: 500,
  priceMax: 1000,
  page: 2,
  limit: 8
};
```

---

## 2. API Response → Tour Cards

### Tour Mapping

| API Field | UI Field | Transform |
|-----------|----------|-----------|
| `id` | `id` | Direct |
| `name` | `title` | Direct |
| `slug` | `href` | `/tours/${slug}` |
| `coverImage` | `image` | Direct (with fallback) |
| `durationDays` | `duration` | `${value} Days` |
| `priceAdult` | `price` | `formatCurrency()` |
| `location` | `location` | Direct |
| `ratingAverage` | `rating` | `toFixed(1)` |
| `reviewCount` | `reviewCount` | `(${value} reviews)` |
| `featured` | `badge` | If true → "Featured" |
| `difficulty` | `difficulty` | Capitalize |

### Example Transform
```typescript
// API Response
const apiTour = {
  id: 1,
  name: "Bali Island Escape",
  slug: "bali-island-escape",
  coverImage: "https://...",
  durationDays: 5,
  priceAdult: 899,
  location: "Bali, Indonesia",
  ratingAverage: 4.8,
  reviewCount: 124,
  featured: true,
  difficulty: "easy"
};

// UI Card Props
const cardProps = {
  id: 1,
  title: "Bali Island Escape",
  href: "/tours/bali-island-escape",
  image: "https://...",
  duration: "5 Days",
  price: "$899",
  priceLabel: "From $899/person",
  location: "Bali, Indonesia",
  rating: "4.8",
  reviewCount: "(124 reviews)",
  badge: "Featured",
  difficulty: "Easy"
};
```

---

## 3. Pagination Mapping

| API Field | UI Component | Transform |
|-----------|--------------|-----------|
| `pagination.page` | Current page | Direct |
| `pagination.totalPages` | Total pages | Direct |
| `pagination.total` | Results count | `${total} tours found` |
| `pagination.hasNext` | Next button | Enable/disable |
| `pagination.hasPrev` | Prev button | Enable/disable |

---

## 4. Filter Options Config

```typescript
export const priceFilterOptions = [
  { label: "All Prices", value: "" },
  { label: "Under $500", value: "0-500" },
  { label: "$500 - $1,000", value: "500-1000" },
  { label: "$1,000 - $2,000", value: "1000-2000" },
  { label: "Over $2,000", value: "2000-" }
];

export const difficultyOptions = [
  { label: "All Levels", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" }
];

export const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" }
];
```

---

## 5. Type Definitions

```typescript
// types/tour.ts

export interface Tour {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  coverImage: string;
  images?: string[];
  durationDays: number;
  priceAdult: number;
  priceChild: number;
  location: string;
  ratingAverage: number;
  reviewCount?: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  featured?: boolean;
  nextAvailableDate?: string;
}

export interface TourFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  difficulty?: string;
  duration?: string;
  location?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TourCardProps {
  id: number;
  title: string;
  href: string;
  image: string;
  duration: string;
  price: string;
  location: string;
  rating: string;
  reviewCount?: string;
  badge?: string;
}
```

---

## 6. Custom Hooks

```typescript
// hooks/use-tours.ts

export function useTours(filters: TourFilters) {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: () => tourService.getList(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

// hooks/use-tour-filters.ts

export function useTourFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: TourFilters = {
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    sort: searchParams.get('sort') || 'popular',
    priceMin: searchParams.get('priceMin')
      ? parseInt(searchParams.get('priceMin')!)
      : undefined,
    priceMax: searchParams.get('priceMax')
      ? parseInt(searchParams.get('priceMax')!)
      : undefined,
    difficulty: searchParams.get('difficulty') || undefined,
  };

  const setFilters = (newFilters: Partial<TourFilters>) => {
    const params = new URLSearchParams();
    const merged = { ...filters, ...newFilters, page: 1 };

    Object.entries(merged).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    router.push(`/tours?${params.toString()}`);
  };

  return { filters, setFilters };
}
```

---

## 7. Mock Data

```typescript
export const mockTours: Tour[] = [
  {
    id: 1,
    name: "Bali Island Escape",
    slug: "bali-island-escape",
    summary: "Experience the magic of Bali",
    coverImage: "/images/tours/bali.jpg",
    durationDays: 5,
    priceAdult: 899,
    priceChild: 599,
    location: "Bali, Indonesia",
    ratingAverage: 4.8,
    reviewCount: 124,
    difficulty: "easy",
    featured: true
  },
  {
    id: 2,
    name: "Paris City of Lights",
    slug: "paris-city-of-lights",
    coverImage: "/images/tours/paris.jpg",
    durationDays: 4,
    priceAdult: 1200,
    priceChild: 800,
    location: "Paris, France",
    ratingAverage: 4.5,
    reviewCount: 89,
    difficulty: "easy"
  },
  {
    id: 3,
    name: "Swiss Alps Hiking",
    slug: "swiss-alps-hiking",
    coverImage: "/images/tours/swiss.jpg",
    durationDays: 7,
    priceAdult: 2500,
    priceChild: 1800,
    location: "Zermatt, Switzerland",
    ratingAverage: 4.9,
    reviewCount: 67,
    difficulty: "challenging"
  }
];

export const mockPagination = {
  page: 1,
  limit: 8,
  total: 42,
  totalPages: 6,
  hasNext: true,
  hasPrev: false
};
```

---

## 8. Empty & Error States

```typescript
// Empty state content
export const emptyStateContent = {
  title: "No tours found",
  description: "We couldn't find any tours matching your criteria.",
  suggestions: [
    "Try adjusting your filters",
    "Search for a different destination",
    "Clear all filters to see all tours"
  ],
  action: {
    label: "Clear Filters",
    onClick: () => clearFilters()
  }
};

// Error state content
export const errorStateContent = {
  title: "Something went wrong",
  description: "We couldn't load the tours. Please try again.",
  action: {
    label: "Retry",
    onClick: () => refetch()
  }
};
```
