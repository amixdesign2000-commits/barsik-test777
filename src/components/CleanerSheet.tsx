import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Leaf, ShieldCheck, Star, X } from 'lucide-react';
import { CleanerProfile } from '../types/marketplace';
import { ResilientImage } from './ResilientImage';

interface CleanerSheetProps {
  cleaner: CleanerProfile | null;
  onClose: () => void;
  onBookWithCleaner: (cleanerId: string, selectedSlot?: string) => void;
}

export function CleanerSheet({
  cleaner,
  onClose,
  onBookWithCleaner,
}: CleanerSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (cleaner) {
      setSelectedSlot(cleaner.availableSlots[0]);
    }
  }, [cleaner]);

  useEffect(() => {
    if (!cleaner) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cleaner, onClose]);

  if (!cleaner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cleaner-sheet-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#131b2e]/45 backdrop-blur-xs md:items-center md:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_12px_32px_-4px_rgba(19,27,46,0.16)] md:rounded-2xl">
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="h-1.5 w-10 rounded-full bg-[#bcc9c6]" aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#eaedff] px-5 py-4 md:px-6">
          <div className="flex items-center gap-4">
            {cleaner.photo ? (
              <ResilientImage
                src={cleaner.photo}
                alt={`${cleaner.name}, ${cleaner.role}`}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                fallbackLabel={cleaner.initials}
              />
            ) : (
              <div
                style={{ backgroundColor: cleaner.avatarBg }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-[#131b2e]"
              >
                {cleaner.initials}
              </div>
            )}

            <div>
              <h2
                id="cleaner-sheet-title"
                className="text-xl font-bold tracking-tight text-[#131b2e]"
              >
                {cleaner.name}
              </h2>
              <p className="text-sm font-medium text-[#3d4947]">{cleaner.role}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#3d4947]">
                <span className="inline-flex items-center gap-1 tabular-nums text-[#131b2e]">
                  <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                  {cleaner.rating.toFixed(2)} ({cleaner.reviewCount} reviews)
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{cleaner.completedHomes} cleans completed</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">${cleaner.hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close specialist profile"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#3d4947] transition-colors hover:bg-[#f2f3ff] hover:text-[#131b2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 md:px-6">
          {/* Verification & Neighborhoods */}
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-[#f2f3ff]/70 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#006398]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-[#131b2e]">
                  Background Checked & Insured
                </p>
                <p className="mt-0.5 text-xs text-[#3d4947]">
                  Verified specialist since {cleaner.vettedSince} · {cleaner.responseTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-[#00685f]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-[#131b2e]">
                  {cleaner.isEcoCertified ? 'Eco-Certified Supply Kit' : 'Standard & Green Options'}
                </p>
                <p className="mt-0.5 text-xs text-[#3d4947]">
                  Serves {cleaner.neighborhoods.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">About {cleaner.name.split(' ')[0]}</h3>
            <p className="mt-1.5 text-sm leading-6 text-[#3d4947]">{cleaner.bio}</p>
          </div>

          {/* Equipment & Supplies */}
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">Included Equipment & Supplies</h3>
            <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {cleaner.supplies.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#3d4947]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00685f]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Selectable Arrival Windows */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#131b2e]">Next Available Arrival Windows</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#006398]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {cleaner.nextAvailable}
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {cleaner.availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] ${
                      isSelected
                        ? 'border-[#00685f] bg-[#00685f]/8 text-[#00685f] shadow-[0_0_0_1px_#00685f]'
                        : 'border-[#bcc9c6]/70 bg-white text-[#131b2e] hover:border-[#00685f]/60'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Client Reviews */}
          <div>
            <h3 className="text-sm font-bold text-[#131b2e]">Recent Homeowner Reviews</h3>
            <div className="mt-3 divide-y divide-[#eaedff]">
              {cleaner.reviews.map((review) => (
                <article key={review.id} className="py-3.5 first:pt-1 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[#131b2e]">
                      {review.author}
                      <span className="ml-2 text-xs font-normal text-[#6d7a77]">
                        {review.neighborhood} · {review.serviceType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold tabular-nums text-[#131b2e]">
                      <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                      <span>{review.rating.toFixed(1)}</span>
                      <span className="font-normal text-[#6d7a77]">· {review.date}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#3d4947]">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[#eaedff] bg-white/95 px-5 py-4 backdrop-blur-md md:px-6">
          <div>
            <p className="text-xs font-medium text-[#6d7a77]">Flat-rate cleanings from</p>
            <p className="text-lg font-extrabold tabular-nums text-[#131b2e]">
              ${cleaner.flatStartPrice}
              <span className="ml-1 text-xs font-medium text-[#6d7a77]">
                (${cleaner.hourlyRate}/hr)
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBookWithCleaner(cleaner.id, selectedSlot)}
            className="min-h-[48px] rounded-xl bg-[#00685f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#008378] active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] focus-visible:ring-offset-2"
          >
            Book with {cleaner.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}
