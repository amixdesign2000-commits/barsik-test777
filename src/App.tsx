import { useEffect, useState } from 'react';
import { BookingsView } from './components/BookingsView';
import { CleanerSheet } from './components/CleanerSheet';
import { ConfigureView } from './components/ConfigureView';
import { DiscoverView } from './components/DiscoverView';
import { SpecialistsView } from './components/SpecialistsView';
import { TopNav } from './components/TopNav';
import {
  ARRIVAL_WINDOWS,
  BOOKING_ADDONS,
  CLEANERS,
  FREQUENCY_OPTIONS,
  INITIAL_BOOKINGS,
  SERVICE_PACKAGES,
} from './data/marketplaceData';
import {
  AppScreen,
  BookingDraft,
  BookingRecord,
  CleanerProfile,
  ServiceTierId,
} from './types/marketplace';
import { calculateBookingPrice } from './utils/pricing';

const STORAGE_KEY = 'pristine_living_bookings_v1';

const DEFAULT_DRAFT: BookingDraft = {
  serviceId: 'standard',
  bedrooms: 2,
  bathrooms: 1,
  addonIds: [],
  frequencyId: 'biweekly',
  date: '2026-11-26',
  timeSlot: '10:30 AM',
  cleanerId: null,
  address: '742 Sanchez St, San Francisco',
  unit: 'Apt 3B',
  entryNotes: '',
};

function loadInitialBookings(): BookingRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_BOOKINGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('discover');
  const [bookings, setBookings] = useState<BookingRecord[]>(loadInitialBookings);
  const [draft, setDraft] = useState<BookingDraft>(DEFAULT_DRAFT);
  const [inspectingCleaner, setInspectingCleaner] = useState<CleanerProfile | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  }, [bookings]);

  const navigateTo = (screen: AppScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceId: ServiceTierId) => {
    setDraft((prev) => ({ ...prev, serviceId }));
    navigateTo('configure');
  };

  const handleQuickStart = (params: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    date: string;
  }) => {
    setDraft((prev) => ({
      ...prev,
      address: params.address,
      bedrooms: params.bedrooms,
      bathrooms: params.bathrooms,
      date: params.date,
    }));
    navigateTo('configure');
  };

  const handleBookCleaner = (cleanerId: string, selectedSlot?: string) => {
    const matchedSlot = ARRIVAL_WINDOWS.find((w) => selectedSlot?.includes(w));
    setDraft((prev) => ({
      ...prev,
      cleanerId,
      timeSlot: matchedSlot ?? prev.timeSlot,
    }));
    setInspectingCleaner(null);
    navigateTo('configure');
  };

  const handleConfirmBooking = (submittedDraft: BookingDraft): BookingRecord => {
    const breakdown = calculateBookingPrice(submittedDraft);
    const service =
      SERVICE_PACKAGES.find((item) => item.id === submittedDraft.serviceId) ??
      SERVICE_PACKAGES[0];
    const frequency =
      FREQUENCY_OPTIONS.find((item) => item.id === submittedDraft.frequencyId) ??
      FREQUENCY_OPTIONS[0];
    const assignedCleaner =
      (submittedDraft.cleanerId
        ? CLEANERS.find((c) => c.id === submittedDraft.cleanerId)
        : CLEANERS[0]) ?? CLEANERS[0];

    const addonTitles = BOOKING_ADDONS.filter((addon) =>
      submittedDraft.addonIds.includes(addon.id),
    ).map((a) => a.title);

    const codeNum = Math.floor(4900 + Math.random() * 4900);
    const newRecord: BookingRecord = {
      id: `bk-${Date.now()}`,
      confirmationCode: `PL-${codeNum}`,
      status: 'upcoming',
      serviceId: service.id,
      serviceTitle: service.title,
      bedrooms: submittedDraft.bedrooms,
      bathrooms: submittedDraft.bathrooms,
      addonTitles,
      frequencyLabel: frequency.label,
      date: submittedDraft.date,
      timeSlot: submittedDraft.timeSlot,
      cleanerId: assignedCleaner.id,
      cleanerName: assignedCleaner.name,
      cleanerPhoto: assignedCleaner.photo,
      cleanerInitials: assignedCleaner.initials,
      address: submittedDraft.address.trim(),
      unit: submittedDraft.unit.trim(),
      entryNotes: submittedDraft.entryNotes.trim(),
      totalPrice: breakdown.total,
      estimatedMinutes: breakdown.estimatedMinutes,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const handleReschedule = (bookingId: string, date: string, timeSlot: string) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId ? { ...item, date, timeSlot } : item,
      ),
    );
  };

  const handleUpdateNotes = (bookingId: string, entryNotes: string) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId ? { ...item, entryNotes } : item,
      ),
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId ? { ...item, status: 'cancelled' } : item,
      ),
    );
  };

  const handleBookAgain = (booking: BookingRecord) => {
    const matchedAddonIds = BOOKING_ADDONS.filter((addon) =>
      booking.addonTitles.includes(addon.title),
    ).map((a) => a.id);

    setDraft((prev) => ({
      ...prev,
      serviceId: booking.serviceId,
      bedrooms: booking.bedrooms,
      bathrooms: booking.bathrooms,
      addonIds: matchedAddonIds,
      cleanerId: booking.cleanerId,
      address: booking.address,
      unit: booking.unit,
      entryNotes: booking.entryNotes,
    }));
    navigateTo('configure');
  };

  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <TopNav
        activeScreen={activeScreen}
        upcomingCount={upcomingCount}
        onNavigate={navigateTo}
        onStartBooking={() => navigateTo('configure')}
      />

      <main className="mx-auto max-w-[1120px] px-4 md:px-5">
        {activeScreen === 'discover' ? (
          <DiscoverView
            onSelectService={handleSelectService}
            onQuickStart={handleQuickStart}
            onOpenCleaner={setInspectingCleaner}
            onBookCleaner={(id) => handleBookCleaner(id)}
            onViewAllSpecialists={() => navigateTo('specialists')}
          />
        ) : null}

        {activeScreen === 'specialists' ? (
          <SpecialistsView
            onOpenCleaner={setInspectingCleaner}
            onBookCleaner={(id) => handleBookCleaner(id)}
          />
        ) : null}

        {activeScreen === 'configure' ? (
          <ConfigureView
            draft={draft}
            onUpdateDraft={setDraft}
            onConfirmBooking={handleConfirmBooking}
            onViewBookings={() => navigateTo('bookings')}
            onBackToDiscover={() => navigateTo('discover')}
          />
        ) : null}

        {activeScreen === 'bookings' ? (
          <BookingsView
            bookings={bookings}
            onReschedule={handleReschedule}
            onUpdateNotes={handleUpdateNotes}
            onCancelBooking={handleCancelBooking}
            onBookAgain={handleBookAgain}
            onNewBooking={() => navigateTo('configure')}
          />
        ) : null}
      </main>

      <footer className="hidden border-t border-[#bcc9c6]/40 bg-white/70 md:block">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-6 text-xs text-[#6d7a77]">
          <p className="font-semibold text-[#3d4947]">
            Pristine Living · Residential Cleaning Marketplace
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('discover')}
              className="hover:text-[#131b2e]"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => navigateTo('specialists')}
              className="hover:text-[#131b2e]"
            >
              Specialists
            </button>
            <button
              type="button"
              onClick={() => navigateTo('configure')}
              className="hover:text-[#131b2e]"
            >
              Configure Clean
            </button>
            <button
              type="button"
              onClick={() => navigateTo('bookings')}
              className="hover:text-[#131b2e]"
            >
              Bookings
            </button>
          </div>
        </div>
      </footer>

      <CleanerSheet
        cleaner={inspectingCleaner}
        onClose={() => setInspectingCleaner(null)}
        onBookWithCleaner={handleBookCleaner}
      />
    </div>
  );
}
