import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  ARRIVAL_WINDOWS,
  BOOKING_ADDONS,
  CLEANERS,
  FREQUENCY_OPTIONS,
  HOME_PRESETS,
  SERVICE_PACKAGES,
} from '../data/marketplaceData';
import { BookingDraft, BookingRecord } from '../types/marketplace';
import {
  calculateBookingPrice,
  formatDisplayDate,
  formatDuration,
} from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface ConfigureViewProps {
  draft: BookingDraft;
  onUpdateDraft: (updater: (prev: BookingDraft) => BookingDraft) => void;
  onConfirmBooking: (draft: BookingDraft) => BookingRecord;
  onViewBookings: () => void;
  onBackToDiscover: () => void;
}

export function ConfigureView({
  draft,
  onUpdateDraft,
  onConfirmBooking,
  onViewBookings,
  onBackToDiscover,
}: ConfigureViewProps) {
  const [confirmedReceipt, setConfirmedReceipt] = useState<BookingRecord | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const breakdown = calculateBookingPrice(draft);
  const selectedService =
    SERVICE_PACKAGES.find((item) => item.id === draft.serviceId) ?? SERVICE_PACKAGES[0];
  const selectedCleaner = draft.cleanerId
    ? CLEANERS.find((c) => c.id === draft.cleanerId) ?? null
    : null;

  const toggleAddon = (addonId: string) => {
    onUpdateDraft((prev) => {
      const exists = prev.addonIds.includes(addonId);
      return {
        ...prev,
        addonIds: exists
          ? prev.addonIds.filter((id) => id !== addonId)
          : [...prev.addonIds, addonId],
      };
    });
  };

  const handleConfirm = () => {
    if (!draft.address.trim()) {
      setAddressError('Please enter a street address for arrival.');
      const addressEl = document.getElementById('booking-address');
      addressEl?.focus();
      return;
    }
    setAddressError(null);
    const created = onConfirmBooking(draft);
    setConfirmedReceipt(created);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (confirmedReceipt) {
    return (
      <div className="mx-auto max-w-2xl pt-8 pb-24">
        <div className="rounded-2xl border border-[#00685f]/25 bg-white p-6 shadow-[0_12px_32px_-4px_rgba(19,27,46,0.08)] md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00685f]/10 text-[#00685f]">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#00685f]">
                Confirmation #{confirmedReceipt.confirmationCode}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#131b2e]">
                Your home clean is confirmed
              </h1>
              <p className="mt-1 text-sm text-[#3d4947]">
                {confirmedReceipt.cleanerName} is scheduled for{' '}
                <span className="font-semibold text-[#131b2e]">
                  {formatDisplayDate(confirmedReceipt.date)}
                </span>{' '}
                during the{' '}
                <span className="font-semibold text-[#131b2e]">
                  {confirmedReceipt.timeSlot}
                </span>{' '}
                arrival window.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-xl bg-[#faf8ff] p-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#3d4947]">Service tier</span>
              <span className="font-semibold text-[#131b2e]">
                {confirmedReceipt.serviceTitle} ({confirmedReceipt.frequencyLabel})
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#3d4947]">Home layout</span>
              <span className="font-semibold tabular-nums text-[#131b2e]">
                {confirmedReceipt.bedrooms} Bed · {confirmedReceipt.bathrooms} Bath
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#3d4947]">Estimated duration</span>
              <span className="font-semibold tabular-nums text-[#131b2e]">
                {formatDuration(confirmedReceipt.estimatedMinutes)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#3d4947]">Location</span>
              <span className="text-right font-semibold text-[#131b2e]">
                {confirmedReceipt.address}
                {confirmedReceipt.unit ? `, ${confirmedReceipt.unit}` : ''}
              </span>
            </div>
            {confirmedReceipt.addonTitles.length > 0 ? (
              <div className="flex justify-between gap-4">
                <span className="text-[#3d4947]">Add-ons</span>
                <span className="text-right font-semibold text-[#131b2e]">
                  {confirmedReceipt.addonTitles.join(', ')}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-[#bcc9c6]/50 pt-3 text-base font-extrabold text-[#131b2e]">
              <span>Total locked rate</span>
              <span className="tabular-nums text-[#00685f]">
                ${confirmedReceipt.totalPrice}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onViewBookings}
              className="min-h-[48px] flex-1 rounded-xl bg-[#00685f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008378]"
            >
              Manage in Bookings
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmedReceipt(null);
                onBackToDiscover();
              }}
              className="min-h-[48px] flex-1 rounded-xl border border-[#bcc9c6] bg-white px-5 py-3 text-sm font-semibold text-[#131b2e] transition-colors hover:bg-[#f2f3ff]"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5 pb-28 md:pt-8 md:pb-16">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToDiscover}
            className="mb-2 inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-[#00685f] hover:text-[#008378]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Discover</span>
          </button>
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#131b2e] md:text-[34px]">
            Configure Your Cleaning
          </h1>
          <p className="mt-1 text-sm text-[#3d4947]">
            Customize room count, detailed add-ons, and arrival window with live flat-rate pricing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Configuration Flow */}
        <div className="space-y-8 lg:col-span-8">
          {/* 1. Service Tier */}
          <section
            aria-labelledby="step-service"
            className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
          >
            <h2 id="step-service" className="text-lg font-bold text-[#131b2e]">
              01. Service Depth
            </h2>
            <p className="mt-1 text-xs text-[#3d4947]">
              Choose the inspection standard that matches your home today.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SERVICE_PACKAGES.map((pkg) => {
                const isSelected = draft.serviceId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() =>
                      onUpdateDraft((prev) => ({ ...prev, serviceId: pkg.id }))
                    }
                    className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] ${
                      isSelected
                        ? 'border-[#00685f] bg-[#00685f]/[0.03] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                        : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                    }`}
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#131b2e]">{pkg.title}</p>
                        <p className="mt-0.5 text-xs text-[#3d4947]">{pkg.subtitle}</p>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isSelected
                            ? 'border-[#00685f] bg-[#00685f] text-white'
                            : 'border-[#bcc9c6] bg-white'
                        }`}
                      >
                        {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#eaedff] pt-2.5 text-xs">
                      <span className="font-medium text-[#6d7a77]">
                        Base {formatDuration(pkg.baseDurationMin)}
                      </span>
                      <span className="font-bold tabular-nums text-[#131b2e]">
                        ${pkg.basePrice} base
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Home Size & Room Steppers */}
          <section
            aria-labelledby="step-rooms"
            className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
          >
            <h2 id="step-rooms" className="text-lg font-bold text-[#131b2e]">
              02. Home Size & Rooms
            </h2>
            <p className="mt-1 text-xs text-[#3d4947]">
              Pick a quick preset or dial in your exact bedroom and bathroom count.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {HOME_PRESETS.map((preset) => {
                const isSelected =
                  draft.bedrooms === preset.bedrooms &&
                  draft.bathrooms === preset.bathrooms;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        bedrooms: preset.bedrooms,
                        bathrooms: preset.bathrooms,
                      }))
                    }
                    className={`min-h-[54px] rounded-xl border px-3 py-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-[#00685f] bg-[#00685f]/[0.04] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                        : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#131b2e]">{preset.label}</p>
                    <p className="mt-0.5 text-[11px] text-[#6d7a77]">{preset.sqftRange}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-[#bcc9c6]/70 bg-[#faf8ff] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#131b2e]">Bedrooms</p>
                  <p className="text-xs text-[#6d7a77]">Includes living & study areas</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease bedrooms"
                    disabled={draft.bedrooms <= 1}
                    onClick={() =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        bedrooms: Math.max(1, prev.bedrooms - 1),
                      }))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bcc9c6] bg-white text-[#131b2e] transition-colors hover:border-[#00685f] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="w-7 text-center text-base font-extrabold tabular-nums text-[#131b2e]">
                    {draft.bedrooms}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase bedrooms"
                    disabled={draft.bedrooms >= 6}
                    onClick={() =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        bedrooms: Math.min(6, prev.bedrooms + 1),
                      }))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bcc9c6] bg-white text-[#131b2e] transition-colors hover:border-[#00685f] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#bcc9c6]/70 bg-[#faf8ff] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#131b2e]">Bathrooms</p>
                  <p className="text-xs text-[#6d7a77]">Full scrub & chrome polish</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease bathrooms"
                    disabled={draft.bathrooms <= 1}
                    onClick={() =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        bathrooms: Math.max(1, prev.bathrooms - 1),
                      }))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bcc9c6] bg-white text-[#131b2e] transition-colors hover:border-[#00685f] disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="w-7 text-center text-base font-extrabold tabular-nums text-[#131b2e]">
                    {draft.bathrooms}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase bathrooms"
                    disabled={draft.bathrooms >= 5}
                    onClick={() =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        bathrooms: Math.min(5, prev.bathrooms + 1),
                      }))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#bcc9c6] bg-white text-[#131b2e] transition-colors hover:border-[#00685f] disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Add-on Checklist */}
          <section
            aria-labelledby="step-addons"
            className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
          >
            <h2 id="step-addons" className="text-lg font-bold text-[#131b2e]">
              03. Extra Detail Add-Ons
            </h2>
            <p className="mt-1 text-xs text-[#3d4947]">
              Optional targeted extras added directly to your specialist&apos;s checklist.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BOOKING_ADDONS.map((addon) => {
                const isChecked = draft.addonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] ${
                      isChecked
                        ? 'border-[#00685f] bg-[#00685f]/[0.03] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                        : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#131b2e]">{addon.title}</p>
                      <p className="mt-0.5 text-xs leading-4 text-[#3d4947]">
                        {addon.description}
                      </p>
                      <p className="mt-2 text-xs font-bold tabular-nums text-[#00685f]">
                        +${addon.price} · +{addon.durationMin} min
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                        isChecked
                          ? 'border-[#00685f] bg-[#00685f] text-white'
                          : 'border-[#bcc9c6] bg-white'
                      }`}
                    >
                      {isChecked ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Schedule, Frequency & Specialist */}
          <section
            aria-labelledby="step-schedule"
            className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
          >
            <h2 id="step-schedule" className="text-lg font-bold text-[#131b2e]">
              04. Cadence, Arrival & Specialist
            </h2>

            {/* Frequency */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-[#3d4947]">
                Cleaning frequency
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {FREQUENCY_OPTIONS.map((freq) => {
                  const isSelected = draft.frequencyId === freq.id;
                  return (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() =>
                        onUpdateDraft((prev) => ({ ...prev, frequencyId: freq.id }))
                      }
                      className={`min-h-[54px] rounded-xl border px-3 py-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#00685f] bg-[#00685f]/[0.04] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                          : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#131b2e]">{freq.label}</p>
                      <p
                        className={`mt-0.5 text-[11px] font-semibold ${
                          freq.discountPct > 0 ? 'text-[#00685f]' : 'text-[#6d7a77]'
                        }`}
                      >
                        {freq.caption}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Arrival Window */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <label
                  htmlFor="booking-date"
                  className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                >
                  Service date
                </label>
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
                    aria-hidden="true"
                  />
                  <input
                    id="booking-date"
                    type="date"
                    value={draft.date}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="h-12 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] pl-10 pr-3 text-sm font-medium tabular-nums text-[#131b2e] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
                  />
                </div>
              </div>

              <div className="sm:col-span-7">
                <p className="mb-1.5 text-xs font-semibold text-[#3d4947]">
                  Arrival window
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ARRIVAL_WINDOWS.map((slot) => {
                    const isSelected = draft.timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          onUpdateDraft((prev) => ({ ...prev, timeSlot: slot }))
                        }
                        className={`min-h-[48px] rounded-xl border px-2 text-xs font-semibold tabular-nums whitespace-nowrap transition-all ${
                          isSelected
                            ? 'border-[#00685f] bg-[#00685f] text-white'
                            : 'border-[#bcc9c6]/80 bg-[#faf8ff] text-[#131b2e] hover:border-[#00685f]/50'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Specialist Selection */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-[#3d4947]">
                Preferred specialist
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDraft((prev) => ({ ...prev, cleanerId: null }))
                  }
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                    draft.cleanerId === null
                      ? 'border-[#00685f] bg-[#00685f]/[0.04] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                      : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00685f]/10 text-[#00685f]">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#131b2e]">
                        Auto-Match Top Available Pro
                      </p>
                      <p className="text-[11px] text-[#6d7a77]">
                        Fastest arrival · 4.9+ rated
                      </p>
                    </div>
                  </div>
                </button>

                {CLEANERS.map((cleaner) => {
                  const isSelected = draft.cleanerId === cleaner.id;
                  return (
                    <button
                      key={cleaner.id}
                      type="button"
                      onClick={() =>
                        onUpdateDraft((prev) => ({ ...prev, cleanerId: cleaner.id }))
                      }
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#00685f] bg-[#00685f]/[0.04] shadow-[0_0_0_2px_rgba(0,104,95,0.14)]'
                          : 'border-[#bcc9c6]/70 bg-white hover:border-[#00685f]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cleaner.photo ? (
                          <ResilientImage
                            src={cleaner.photo}
                            alt={cleaner.name}
                            className="h-10 w-10 shrink-0 rounded-xl object-cover"
                            fallbackLabel={cleaner.initials}
                          />
                        ) : (
                          <div
                            style={{ backgroundColor: cleaner.avatarBg }}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-[#131b2e]"
                          >
                            {cleaner.initials}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#131b2e]">
                            {cleaner.name}
                          </p>
                          <p className="inline-flex items-center gap-1 text-[11px] tabular-nums text-[#6d7a77]">
                            <Star
                              className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]"
                              aria-hidden="true"
                            />
                            {cleaner.rating.toFixed(2)} · {cleaner.nextAvailable}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. Address & Entry Notes */}
          <section
            aria-labelledby="step-address"
            className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
          >
            <h2 id="step-address" className="text-lg font-bold text-[#131b2e]">
              05. Address & Entry Instructions
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-8">
                <label
                  htmlFor="booking-address"
                  className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                >
                  Street address
                </label>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
                    aria-hidden="true"
                  />
                  <input
                    id="booking-address"
                    type="text"
                    value={draft.address}
                    onChange={(e) => {
                      setAddressError(null);
                      onUpdateDraft((prev) => ({ ...prev, address: e.target.value }));
                    }}
                    placeholder="742 Sanchez St, San Francisco"
                    className={`h-12 w-full rounded-xl border bg-[#faf8ff] pl-10 pr-4 text-sm font-medium text-[#131b2e] transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
                      addressError
                        ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/15'
                        : 'border-[#bcc9c6]/80 focus:border-[#00685f] focus:ring-[#00685f]/15'
                    }`}
                  />
                </div>
                {addressError ? (
                  <p className="mt-1.5 text-xs font-semibold text-[#ba1a1a]">
                    {addressError}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="booking-unit"
                  className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                >
                  Apt / Suite (optional)
                </label>
                <input
                  id="booking-unit"
                  type="text"
                  value={draft.unit}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="Apt 3B"
                  className="h-12 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] px-3.5 text-sm font-medium text-[#131b2e] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="booking-notes"
                className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
              >
                Entry & surface care notes
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                value={draft.entryNotes}
                onChange={(e) =>
                  onUpdateDraft((prev) => ({ ...prev, entryNotes: e.target.value }))
                }
                placeholder="Door code, pet details, or priority surfaces..."
                className="w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] p-3.5 text-sm text-[#131b2e] placeholder:text-[#6d7a77] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
              />
            </div>
          </section>
        </div>

        {/* Right Sticky Desktop Order Summary */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 rounded-2xl border border-[#bcc9c6]/60 bg-white p-6 shadow-[0_12px_32px_-4px_rgba(19,27,46,0.08)]">
            <h2 className="text-lg font-bold text-[#131b2e]">Booking Summary</h2>
            <p className="mt-0.5 text-xs text-[#3d4947]">
              {selectedService.title} · {draft.bedrooms} Bed, {draft.bathrooms} Bath
            </p>

            <div className="mt-4 space-y-2.5 border-t border-[#eaedff] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#3d4947]">Base package</span>
                <span className="font-semibold tabular-nums text-[#131b2e]">
                  ${breakdown.serviceBase}
                </span>
              </div>

              {breakdown.roomAdjustment > 0 ? (
                <div className="flex justify-between">
                  <span className="text-[#3d4947]">
                    Extra rooms ({draft.bedrooms - 1} bed, {draft.bathrooms - 1} bath)
                  </span>
                  <span className="font-semibold tabular-nums text-[#131b2e]">
                    +${breakdown.roomAdjustment}
                  </span>
                </div>
              ) : null}

              {breakdown.addonsTotal > 0 ? (
                <div className="flex justify-between">
                  <span className="text-[#3d4947]">
                    Add-ons ({draft.addonIds.length})
                  </span>
                  <span className="font-semibold tabular-nums text-[#131b2e]">
                    +${breakdown.addonsTotal}
                  </span>
                </div>
              ) : null}

              {breakdown.discountAmount > 0 ? (
                <div className="flex justify-between text-[#00685f]">
                  <span>Recurring savings ({breakdown.discountPct}%)</span>
                  <span className="font-semibold tabular-nums">
                    -${breakdown.discountAmount}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-2 border-t border-[#eaedff] pt-4 text-xs text-[#3d4947]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#00685f]" aria-hidden="true" />
                  {formatDisplayDate(draft.date)}
                </span>
                <span className="font-semibold tabular-nums text-[#131b2e]">
                  {draft.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#00685f]" aria-hidden="true" />
                  Estimated duration
                </span>
                <span className="font-semibold tabular-nums text-[#131b2e]">
                  {formatDuration(breakdown.estimatedMinutes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Specialist</span>
                <span className="font-semibold text-[#131b2e]">
                  {selectedCleaner ? selectedCleaner.name : 'Auto-Match Top Pro'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-[#bcc9c6]/50 pt-4">
              <span className="text-sm font-bold text-[#131b2e]">Total flat rate</span>
              <span className="text-2xl font-extrabold tabular-nums text-[#131b2e]">
                ${breakdown.total}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-5 min-h-[50px] w-full rounded-xl bg-[#00685f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#008378] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] focus-visible:ring-offset-2"
            >
              Confirm Booking
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#6d7a77]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#006398]" aria-hidden="true" />
              Free reschedule or cancel up to 12 hours before arrival
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile Floating Booking Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#bcc9c6]/70 bg-white/92 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-[#3d4947] tabular-nums">
              {formatDuration(breakdown.estimatedMinutes)} · {formatDisplayDate(draft.date)}
            </p>
            <p className="text-xl font-extrabold tabular-nums text-[#131b2e]">
              ${breakdown.total}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="min-h-[48px] rounded-xl bg-[#00685f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] whitespace-nowrap"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
