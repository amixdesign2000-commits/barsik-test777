import { useMemo, useState } from 'react';
import { Clock, Leaf, MapPin, Search, ShieldCheck, Star, Zap } from 'lucide-react';
import { CLEANERS } from '../data/marketplaceData';
import { CleanerProfile } from '../types/marketplace';
import { ResilientImage } from './ResilientImage';

interface SpecialistsViewProps {
  onOpenCleaner: (cleaner: CleanerProfile) => void;
  onBookCleaner: (cleanerId: string) => void;
}

type SortKey = 'rating' | 'price' | 'earliest';

export function SpecialistsView({
  onOpenCleaner,
  onBookCleaner,
}: SpecialistsViewProps) {
  const [neighborhood, setNeighborhood] = useState<string>('all');
  const [ecoOnly, setEcoOnly] = useState(false);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [query, setQuery] = useState('');

  const allNeighborhoods = useMemo(() => {
    const set = new Set<string>();
    CLEANERS.forEach((c) => c.neighborhoods.forEach((n) => set.add(n)));
    return Array.from(set).sort();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = CLEANERS.filter((cleaner) => {
      if (neighborhood !== 'all' && !cleaner.neighborhoods.includes(neighborhood)) {
        return false;
      }
      if (ecoOnly && !cleaner.isEcoCertified) return false;
      if (sameDayOnly && !cleaner.hasSameDay) return false;
      if (q) {
        const hit =
          cleaner.name.toLowerCase().includes(q) ||
          cleaner.role.toLowerCase().includes(q) ||
          cleaner.supplies.some((s) => s.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.flatStartPrice - b.flatStartPrice;
      if (sortBy === 'earliest') {
        return (a.hasSameDay ? 0 : 1) - (b.hasSameDay ? 0 : 1) || b.rating - a.rating;
      }
      return b.rating - a.rating;
    });
  }, [neighborhood, ecoOnly, sameDayOnly, sortBy, query]);

  return (
    <div className="space-y-8 pt-6 pb-24 md:pt-8 md:pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-[#eaedff] pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#131b2e] md:text-[34px]">
            Vetted Cleaning Specialists
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#3d4947]">
            Every specialist completes background verification, in-person surface care
            training, and carries full residential liability coverage.
          </p>
        </div>
        <div className="text-xs font-semibold tabular-nums text-[#3d4947]">
          Showing {results.length} of {CLEANERS.length} active specialists
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#bcc9c6]/60 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:grid-cols-12 md:items-center">
        <div className="relative md:col-span-4">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, role, or equipment..."
            aria-label="Search specialists"
            className="h-11 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] pl-9 pr-3 text-sm text-[#131b2e] placeholder:text-[#6d7a77] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
          />
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
              aria-hidden="true"
            />
            <select
              aria-label="Filter by neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] pl-9 pr-3 text-sm font-medium text-[#131b2e] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
            >
              <option value="all">All neighborhoods</option>
              {allNeighborhoods.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:col-span-3">
          <button
            type="button"
            aria-pressed={ecoOnly}
            onClick={() => setEcoOnly((prev) => !prev)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              ecoOnly
                ? 'border-[#00685f] bg-[#00685f] text-white'
                : 'border-[#bcc9c6]/80 bg-[#faf8ff] text-[#3d4947] hover:border-[#00685f]/60'
            }`}
          >
            <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
            Eco-Certified
          </button>

          <button
            type="button"
            aria-pressed={sameDayOnly}
            onClick={() => setSameDayOnly((prev) => !prev)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              sameDayOnly
                ? 'border-[#006398] bg-[#006398] text-white'
                : 'border-[#bcc9c6]/80 bg-[#faf8ff] text-[#3d4947] hover:border-[#006398]/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Same Day
          </button>
        </div>

        <div className="md:col-span-2">
          <select
            aria-label="Sort specialists"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-11 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] px-3 text-xs font-semibold text-[#131b2e] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
          >
            <option value="rating">Highest Rated</option>
            <option value="price">Lowest Rate</option>
            <option value="earliest">Earliest Slot</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-[#bcc9c6]/60 bg-white p-10 text-center">
          <p className="text-base font-bold text-[#131b2e]">
            No specialists match your current filters
          </p>
          <p className="mt-1 text-sm text-[#3d4947]">
            Try widening your neighborhood or clearing one of the availability toggles.
          </p>
          <button
            type="button"
            onClick={() => {
              setNeighborhood('all');
              setEcoOnly(false);
              setSameDayOnly(false);
              setQuery('');
            }}
            className="mt-4 min-h-[44px] rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008378]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {results.map((cleaner) => (
            <article
              key={cleaner.id}
              className="flex flex-col justify-between rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {cleaner.photo ? (
                      <ResilientImage
                        src={cleaner.photo}
                        alt={`${cleaner.name}, ${cleaner.role}`}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                        fallbackLabel={cleaner.initials}
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: cleaner.avatarBg }}
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-[#131b2e]"
                      >
                        {cleaner.initials}
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-[#131b2e]">
                        {cleaner.name}
                      </h2>
                      <p className="text-sm font-medium text-[#3d4947]">{cleaner.role}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#3d4947]">
                        <span className="inline-flex items-center gap-1 tabular-nums text-[#131b2e]">
                          <Star
                            className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                            aria-hidden="true"
                          />
                          {cleaner.rating.toFixed(2)} ({cleaner.reviewCount})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{cleaner.completedHomes} homes</span>
                        <span aria-hidden="true">·</span>
                        <span>Vetted {cleaner.vettedSince}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[11px] font-medium text-[#6d7a77]">Flat from</span>
                    <span className="text-xl font-extrabold tabular-nums text-[#131b2e]">
                      ${cleaner.flatStartPrice}
                    </span>
                    <span className="block text-[11px] tabular-nums text-[#6d7a77]">
                      ${cleaner.hourlyRate}/hr est.
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#3d4947]">{cleaner.bio}</p>

                {/* Inline capabilities & service areas */}
                <div className="mt-4 space-y-2 border-t border-[#eaedff] pt-4 text-xs text-[#3d4947]">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
                    <span className="inline-flex items-center gap-1 text-[#006398]">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Insured & Verified
                    </span>
                    {cleaner.isEcoCertified ? (
                      <span className="inline-flex items-center gap-1 text-[#00685f]">
                        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                        Plant-Based Kit
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 text-[#3d4947]">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {cleaner.responseTime}
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold text-[#131b2e]">Neighborhoods:</span>{' '}
                    {cleaner.neighborhoods.join(' · ')}
                  </p>
                  <p>
                    <span className="font-semibold text-[#131b2e]">Equipment:</span>{' '}
                    {cleaner.supplies.slice(0, 3).join(' · ')}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eaedff] pt-4">
                <span className="text-xs font-semibold text-[#00685f] tabular-nums">
                  Next available: {cleaner.nextAvailable}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOpenCleaner(cleaner)}
                    className="min-h-[44px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#131b2e] transition-colors hover:bg-[#f2f3ff] whitespace-nowrap"
                  >
                    Reviews & Slots
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookCleaner(cleaner.id)}
                    className="min-h-[44px] rounded-xl bg-[#00685f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008378] active:scale-[0.98] whitespace-nowrap"
                  >
                    Book {cleaner.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
