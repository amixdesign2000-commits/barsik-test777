export type AppScreen = 'discover' | 'specialists' | 'configure' | 'bookings';

export type ServiceTierId = 'standard' | 'deep' | 'move' | 'eco';

export type CleanerFilterId = 'all' | 'top-rated' | 'eco' | 'same-day';

export type FrequencyId = 'once' | 'weekly' | 'biweekly' | 'monthly';

export interface ServicePackage {
  id: ServiceTierId;
  title: string;
  subtitle: string;
  basePrice: number;
  baseDurationMin: number;
  image: string;
  imageAlt: string;
  inclusions: string[];
  recommendedFor: string;
}

export interface CleanerReview {
  id: string;
  author: string;
  neighborhood: string;
  date: string;
  rating: number;
  serviceType: string;
  comment: string;
}

export interface CleanerProfile {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  photo?: string;
  role: string;
  neighborhoods: string[];
  rating: number;
  reviewCount: number;
  completedHomes: number;
  hourlyRate: number;
  flatStartPrice: number;
  responseTime: string;
  nextAvailable: string;
  availableSlots: string[];
  isTopRated: boolean;
  isEcoCertified: boolean;
  hasSameDay: boolean;
  vettedSince: string;
  bio: string;
  supplies: string[];
  reviews: CleanerReview[];
}

export interface BookingAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMin: number;
}

export interface HomePreset {
  id: string;
  label: string;
  bedrooms: number;
  bathrooms: number;
  sqftRange: string;
  priceDelta: number;
  durationDeltaMin: number;
}

export interface FrequencyOption {
  id: FrequencyId;
  label: string;
  discountPct: number;
  caption: string;
}

export interface BookingDraft {
  serviceId: ServiceTierId;
  bedrooms: number;
  bathrooms: number;
  addonIds: string[];
  frequencyId: FrequencyId;
  date: string;
  timeSlot: string;
  cleanerId: string | null;
  address: string;
  unit: string;
  entryNotes: string;
}

export interface BookingRecord {
  id: string;
  confirmationCode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  serviceId: ServiceTierId;
  serviceTitle: string;
  bedrooms: number;
  bathrooms: number;
  addonTitles: string[];
  frequencyLabel: string;
  date: string;
  timeSlot: string;
  cleanerId: string;
  cleanerName: string;
  cleanerPhoto?: string;
  cleanerInitials: string;
  address: string;
  unit: string;
  entryNotes: string;
  totalPrice: number;
  estimatedMinutes: number;
  createdAt: string;
}
