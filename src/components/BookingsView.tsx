import { useState } from 'react';
import { Calendar, Clock, MapPin, RotateCcw } from 'lucide-react';
import { ARRIVAL_WINDOWS } from '../data/marketplaceData';
import { BookingRecord } from '../types/marketplace';
import { formatDisplayDate, formatDuration } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface BookingsViewProps {
  bookings: BookingRecord[];
  onReschedule: (bookingId: string, date: string, timeSlot: string) => void;
  onUpdateNotes: (bookingId: string, entryNotes: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onBookAgain: (booking: BookingRecord) => void;
  onNewBooking: () => void;
}

export function BookingsView({
  bookings,
  onReschedule,
  onUpdateNotes,
  onCancelBooking,
  onBookAgain,
  onNewBooking,
}: BookingsViewProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState(ARRIVAL_WINDOWS[0]);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const visibleBookings = bookings.filter((b) =>
    activeTab === 'upcoming' ? b.status === 'upcoming' : b.status !== 'upcoming',
  );

  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = bookings.filter((b) => b.status !== 'upcoming').length;

  return (
    <div className="space-y-6 pt-6 pb-24 md:pt-8 md:pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-[#eaedff] pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#131b2e] md:text-[34px]">
            Your Cleaning Schedule
          </h1>
          <p className="mt-1 text-sm text-[#3d4947]">
            Adjust arrival windows, update entry instructions, or re-book past visits in one tap.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewBooking}
          className="min-h-[44px] self-start rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008378] whitespace-nowrap sm:self-auto"
        >
          Schedule New Clean
        </button>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Booking status tabs"
        className="inline-flex rounded-xl bg-[#eaedff]/70 p-1"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-[#3d4947] hover:text-[#131b2e]'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'completed'}
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-[#3d4947] hover:text-[#131b2e]'
          }`}
        >
          History ({completedCount})
        </button>
      </div>

      {/* Booking Cards */}
      {visibleBookings.length === 0 ? (
        <div className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-10 text-center">
          <p className="text-base font-bold text-[#131b2e]">
            {activeTab === 'upcoming'
              ? 'No upcoming cleanings scheduled'
              : 'No past cleanings yet'}
          </p>
          <p className="mt-1 text-sm text-[#3d4947]">
            Configure a custom cleaning package with upfront flat-rate pricing.
          </p>
          <button
            type="button"
            onClick={onNewBooking}
            className="mt-4 min-h-[44px] rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008378]"
          >
            Book a Clean
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleBookings.map((booking) => {
            const isRescheduling = rescheduleId === booking.id;
            const isEditingNotes = editingNotesId === booking.id;
            const isConfirmingCancel = confirmCancelId === booking.id;

            return (
              <article
                key={booking.id}
                className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    {booking.cleanerPhoto ? (
                      <ResilientImage
                        src={booking.cleanerPhoto}
                        alt={booking.cleanerName}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                        fallbackLabel={booking.cleanerInitials}
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaedff] text-base font-bold text-[#131b2e]">
                        {booking.cleanerInitials}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-[#3d4947]">
                        <span className="tabular-nums text-[#00685f]">
                          #{booking.confirmationCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            booking.status === 'cancelled'
                              ? 'text-[#ba1a1a]'
                              : booking.status === 'completed'
                              ? 'text-[#3d4947]'
                              : 'text-[#006398]'
                          }
                        >
                          {booking.status === 'upcoming'
                            ? 'Confirmed Upcoming'
                            : booking.status === 'completed'
                            ? 'Completed'
                            : 'Cancelled'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{booking.frequencyLabel}</span>
                      </div>

                      <h2 className="mt-1 text-lg font-bold text-[#131b2e]">
                        {booking.serviceTitle} with {booking.cleanerName}
                      </h2>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#3d4947]">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#131b2e]">
                          <Calendar className="h-3.5 w-3.5 text-[#00685f]" aria-hidden="true" />
                          {formatDisplayDate(booking.date)} · {booking.timeSlot}
                        </span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="h-3.5 w-3.5 text-[#6d7a77]" aria-hidden="true" />
                          {formatDuration(booking.estimatedMinutes)} · {booking.bedrooms} Bed,{' '}
                          {booking.bathrooms} Bath
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#6d7a77]" aria-hidden="true" />
                          {booking.address}
                          {booking.unit ? `, ${booking.unit}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="block text-[11px] font-medium text-[#6d7a77]">
                      Locked rate
                    </span>
                    <span className="text-xl font-extrabold tabular-nums text-[#131b2e]">
                      ${booking.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Add-ons & Notes */}
                <div className="mt-4 space-y-2 border-t border-[#eaedff] pt-4 text-xs text-[#3d4947]">
                  {booking.addonTitles.length > 0 ? (
                    <p>
                      <span className="font-semibold text-[#131b2e]">Add-ons:</span>{' '}
                      {booking.addonTitles.join(' · ')}
                    </p>
                  ) : null}
                  <p>
                    <span className="font-semibold text-[#131b2e]">Entry notes:</span>{' '}
                    {booking.entryNotes || 'No special entry notes added.'}
                  </p>
                </div>

                {/* Inline Reschedule Panel */}
                {isRescheduling ? (
                  <div className="mt-4 rounded-xl border border-[#00685f]/30 bg-[#faf8ff] p-4">
                    <p className="text-xs font-bold text-[#131b2e]">
                      Select new date and arrival window
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        aria-label="New service date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="h-11 rounded-xl border border-[#bcc9c6] bg-white px-3 text-sm tabular-nums text-[#131b2e]"
                      />
                      <select
                        aria-label="New arrival window"
                        value={rescheduleSlot}
                        onChange={(e) => setRescheduleSlot(e.target.value)}
                        className="h-11 rounded-xl border border-[#bcc9c6] bg-white px-3 text-sm text-[#131b2e]"
                      >
                        {ARRIVAL_WINDOWS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (rescheduleDate) {
                            onReschedule(booking.id, rescheduleDate, rescheduleSlot);
                            setRescheduleId(null);
                          }
                        }}
                        className="min-h-[40px] rounded-xl bg-[#00685f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008378]"
                      >
                        Save New Time
                      </button>
                      <button
                        type="button"
                        onClick={() => setRescheduleId(null)}
                        className="min-h-[40px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#3d4947]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Inline Entry Notes Editor */}
                {isEditingNotes ? (
                  <div className="mt-4 rounded-xl border border-[#00685f]/30 bg-[#faf8ff] p-4">
                    <label
                      htmlFor={`notes-${booking.id}`}
                      className="block text-xs font-bold text-[#131b2e]"
                    >
                      Update entry instructions
                    </label>
                    <textarea
                      id={`notes-${booking.id}`}
                      rows={2}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#bcc9c6] bg-white p-3 text-sm text-[#131b2e] focus:border-[#00685f] focus:outline-none"
                    />
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateNotes(booking.id, notesDraft.trim());
                          setEditingNotesId(null);
                        }}
                        className="min-h-[40px] rounded-xl bg-[#00685f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008378]"
                      >
                        Save Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="min-h-[40px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#3d4947]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Action Row */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eaedff] pt-4">
                  {booking.status === 'upcoming' ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleId(booking.id);
                            setRescheduleDate(booking.date);
                            setRescheduleSlot(booking.timeSlot);
                            setEditingNotesId(null);
                            setConfirmCancelId(null);
                          }}
                          className="min-h-[44px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff]"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotesId(booking.id);
                            setNotesDraft(booking.entryNotes);
                            setRescheduleId(null);
                            setConfirmCancelId(null);
                          }}
                          className="min-h-[44px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff]"
                        >
                          Edit Entry Notes
                        </button>
                      </div>

                      {isConfirmingCancel ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#ba1a1a]">
                            Cancel this clean?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onCancelBooking(booking.id);
                              setConfirmCancelId(null);
                            }}
                            className="min-h-[40px] rounded-xl bg-[#ba1a1a] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#93000a]"
                          >
                            Yes, Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(null)}
                            className="min-h-[40px] rounded-xl border border-[#bcc9c6] bg-white px-3.5 py-2 text-xs font-semibold text-[#3d4947]"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(booking.id)}
                          className="min-h-[44px] rounded-xl px-3 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                        >
                          Cancel Visit
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBookAgain(booking)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#00685f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008378]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Book Same Clean Again</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
