import {
  BOOKING_ADDONS,
  FREQUENCY_OPTIONS,
  SERVICE_PACKAGES,
} from '../data/marketplaceData';
import { BookingDraft } from '../types/marketplace';

export interface PriceBreakdown {
  serviceBase: number;
  roomAdjustment: number;
  addonsTotal: number;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  total: number;
  estimatedMinutes: number;
}

export function calculateBookingPrice(draft: BookingDraft): PriceBreakdown {
  const service =
    SERVICE_PACKAGES.find((item) => item.id === draft.serviceId) ?? SERVICE_PACKAGES[0];
  const frequency =
    FREQUENCY_OPTIONS.find((item) => item.id === draft.frequencyId) ?? FREQUENCY_OPTIONS[0];

  const extraBedrooms = Math.max(0, draft.bedrooms - 1);
  const extraBathrooms = Math.max(0, draft.bathrooms - 1);
  const roomAdjustment = extraBedrooms * 28 + extraBathrooms * 24;
  const roomDurationMin = extraBedrooms * 25 + extraBathrooms * 25;

  const selectedAddons = BOOKING_ADDONS.filter((addon) =>
    draft.addonIds.includes(addon.id),
  );
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const addonsDurationMin = selectedAddons.reduce(
    (sum, item) => sum + item.durationMin,
    0,
  );

  const subtotal = service.basePrice + roomAdjustment + addonsTotal;
  const discountAmount = Math.round((subtotal * frequency.discountPct) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  const estimatedMinutes = service.baseDurationMin + roomDurationMin + addonsDurationMin;

  return {
    serviceBase: service.basePrice,
    roomAdjustment,
    addonsTotal,
    subtotal,
    discountPct: frequency.discountPct,
    discountAmount,
    total,
    estimatedMinutes,
  };
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
