import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import {
  CLEANERS,
  HERO_IMAGE,
  HOME_PRESETS,
  SERVICE_PACKAGES,
} from '../data/marketplaceData';
import {
  CleanerFilterId,
  CleanerProfile,
  ServiceTierId,
} from '../types/marketplace';
import { formatDuration } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface DiscoverViewProps {
  onSelectService: (serviceId: ServiceTierId) => void;
  onQuickStart: (params: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    date: string;
  }) => void;
  onOpenCleaner: (cleaner: CleanerProfile) => void;
  onBookCleaner: (cleanerId: string) => void;
  onViewAllSpecialists: () => void;
}

const FILTER_OPTIONS: { id: CleanerFilterId; label: string }[] = [
  { id: 'all', label: 'All Specialists' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'eco', label: 'Eco-Certified' },
  { id: 'same-day', label: 'Same Day' },
];

export function DiscoverView({
  onSelectService,
  onQuickStart,
  onOpenCleaner,
  onBookCleaner,
  onViewAllSpecialists,
}: DiscoverViewProps) {
  const [quickAddress, setQuickAddress] = useState('742 Sanchez St, San Francisco');
  const [quickPresetId, setQuickPresetId] = useState('two-bed');
  const [quickDate, setQuickDate] = useState('2026-11-26');
  const [cleanerFilter, setCleanerFilter] = useState<CleanerFilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCleaners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return CLEANERS.filter((cleaner) => {
      if (cleanerFilter === 'top-rated' && !cleaner.isTopRated) return false;
      if (cleanerFilter === 'eco' && !cleaner.isEcoCertified) return false;
      if (cleanerFilter === 'same-day' && !cleaner.hasSameDay) return false;

      if (!query) return true;
      return (
        cleaner.name.toLowerCase().includes(query) ||
        cleaner.role.toLowerCase().includes(query) ||
        cleaner.neighborhoods.some((n) => n.toLowerCase().includes(query))
      );
    });
  }, [cleanerFilter, searchQuery]);

  const handleHeroSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const preset = HOME_PRESETS.find((p) => p.id === quickPresetId) ?? HOME_PRESETS[1];
    onQuickStart({
      address: quickAddress.trim() || '742 Sanchez St, San Francisco',
      bedrooms: preset.bedrooms,
      bathrooms: preset.bathrooms,
      date: quickDate,
    });
  };

  return (
    <div className="space-y-12 pb-20 md:space-y-16 md:pb-16">
      {/* Split Hero Section */}
      <section className="pt-4 md:pt-8">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left editorial booking column */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#bcc9c6]/50 bg-white p-6 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] md:p-8 lg:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#00685f]">
                San Francisco Bay Area · Background-Vetted Specialists
              </p>
              <h1
                className="mt-3 text-[32px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#131b2e] md:text-[40px]"
                style={{ textWrap: 'balance' }}
              >
                Spotless homes, booked with total clarity.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-6 text-[#3d4947]">
                Compare verified local cleaning professionals, customize your room-by-room
                checklist, and lock in upfront flat-rate pricing in under a minute.
              </p>
            </div>

            {/* Instant Quick-Launch Form */}
            <form onSubmit={handleHeroSubmit} className="mt-6 space-y-3">
              <div>
                <label
                  htmlFor="hero-address"
                  className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                >
                  Street address or neighborhood
                </label>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
                    aria-hidden="true"
                  />
                  <input
                    id="hero-address"
                    type="text"
                    value={quickAddress}
                    onChange={(e) => setQuickAddress(e.target.value)}
                    placeholder="Enter street address or neighborhood"
                    className="h-12 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] pl-10 pr-4 text-sm font-medium text-[#131b2e] transition-colors placeholder:text-[#6d7a77] focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="hero-home-size"
                    className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                  >
                    Home size
                  </label>
                  <select
                    id="hero-home-size"
                    value={quickPresetId}
                    onChange={(e) => setQuickPresetId(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] px-3.5 text-sm font-medium text-[#131b2e] transition-colors focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
                  >
                    {HOME_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hero-date"
                    className="mb-1.5 block text-xs font-semibold text-[#3d4947]"
                  >
                    Preferred date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
                      aria-hidden="true"
                    />
                    <input
                      id="hero-date"
                      type="date"
                      value={quickDate}
                      onChange={(e) => setQuickDate(e.target.value)}
                      className="h-12 w-full rounded-xl border border-[#bcc9c6]/80 bg-[#faf8ff] pl-10 pr-3 text-sm font-medium tabular-nums text-[#131b2e] transition-colors focus:border-[#00685f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#00685f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#008378] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] focus-visible:ring-offset-2"
              >
                <span>See Instant Pricing</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Right full-bleed architectural interior photo */}
          <div className="overflow-hidden rounded-2xl border border-[#bcc9c6]/40 bg-white shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] lg:col-span-6">
            <div className="relative h-64 w-full sm:h-80 lg:h-full">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Sunlit modern living room with spotless oak floors and fresh linen sofa"
                className="h-full w-full object-cover"
                fallbackLabel="Pristine Living"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#131b2e]/75 via-[#131b2e]/15 to-transparent"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-6">
                <p className="text-xs font-semibold text-[#89f5e7]">
                  4.96 average rating · 1,835+ verified home cleans
                </p>
                <p className="mt-1 text-base font-bold leading-snug md:text-lg">
                  Every visit follows a 48-point room inspection checklist with HEPA filtration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Trust & Guarantee Strip below hero split */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3 rounded-2xl border border-[#bcc9c6]/50 bg-white p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#006398]" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Background-Vetted Pros</h2>
              <p className="mt-0.5 text-xs leading-5 text-[#3d4947]">
                Multi-step identity, reference, and $2M liability coverage on every visit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#bcc9c6]/50 bg-white p-4">
            <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-[#00685f]" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Plant-Derived Supplies</h2>
              <p className="mt-0.5 text-xs leading-5 text-[#3d4947]">
                Unscented, EWG-verified cleaners safe for toddlers, pets, and stone surfaces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#bcc9c6]/50 bg-white p-4">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#00685f]" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">Transparent Flat Rates</h2>
              <p className="mt-0.5 text-xs leading-5 text-[#3d4947]">
                Exact total upfront by room count and add-ons—zero surprise hourly overruns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#bcc9c6]/50 bg-white p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#825100]" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-[#131b2e]">24-Hour Re-Clean Pledge</h2>
              <p className="mt-0.5 text-xs leading-5 text-[#3d4947]">
                Notice a missed detail? We return within 24 hours to make it right at no cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cleaning Packages */}
      <section aria-labelledby="services-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2
              id="services-heading"
              className="text-2xl font-bold tracking-[-0.015em] text-[#131b2e] md:text-[28px]"
            >
              Cleaning Tiers & Flat-Rate Packages
            </h2>
            <p className="mt-1 text-sm text-[#3d4947]">
              Select a baseline package to customize rooms, add-ons, and arrival timing.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_PACKAGES.map((pkg) => (
            <article
              key={pkg.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#bcc9c6]/60 bg-white shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#f2f3ff]">
                  <ResilientImage
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    fallbackLabel={pkg.title}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-[#00685f]">
                    {pkg.recommendedFor}
                  </p>
                  <h3 className="mt-1 text-lg font-bold tracking-tight text-[#131b2e]">
                    {pkg.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#3d4947]">{pkg.subtitle}</p>

                  <ul className="mt-4 space-y-2 border-t border-[#eaedff] pt-3.5">
                    {pkg.inclusions.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs leading-5 text-[#3d4947]"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00685f]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#eaedff] px-5 py-4">
                <div>
                  <span className="block text-[11px] font-medium text-[#6d7a77]">
                    From · {formatDuration(pkg.baseDurationMin)}
                  </span>
                  <span className="text-lg font-extrabold tabular-nums text-[#131b2e]">
                    ${pkg.basePrice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectService(pkg.id)}
                  className="min-h-[44px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#131b2e] transition-colors hover:border-[#00685f] hover:bg-[#00685f]/5 hover:text-[#00685f] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f]"
                >
                  Configure
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Verified Specialists Directory Preview */}
      <section aria-labelledby="cleaners-heading">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2
              id="cleaners-heading"
              className="text-2xl font-bold tracking-[-0.015em] text-[#131b2e] md:text-[28px]"
            >
              Verified Specialists Near You
            </h2>
            <p className="mt-1 text-sm text-[#3d4947]">
              Inspect credentials, real homeowner reviews, and live availability before booking.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllSpecialists}
            className="inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-semibold text-[#00685f] hover:text-[#008378] whitespace-nowrap md:self-auto"
          >
            <span>Compare all specialists</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter specialists"
            className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#eaedff]/70 p-1"
          >
            {FILTER_OPTIONS.map((option) => {
              const isSelected = cleanerFilter === option.id;
              return (
                <button
                  key={option.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => setCleanerFilter(option.id)}
                  className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] ${
                    isSelected
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#3d4947] hover:text-[#131b2e]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d7a77]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or area"
              aria-label="Filter specialists by name or neighborhood"
              className="h-11 w-full rounded-xl border border-[#bcc9c6]/80 bg-white pl-9 pr-3 text-sm text-[#131b2e] placeholder:text-[#6d7a77] focus:border-[#00685f] focus:outline-none focus:ring-2 focus:ring-[#00685f]/15"
            />
          </div>
        </div>

        {/* Specialist Cards Grid */}
        {filteredCleaners.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#bcc9c6]/60 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#131b2e]">
              No specialists match that filter right now.
            </p>
            <button
              type="button"
              onClick={() => {
                setCleanerFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 min-h-[44px] rounded-xl border border-[#bcc9c6] px-4 py-2 text-xs font-semibold text-[#00685f] hover:bg-[#f2f3ff]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCleaners.map((cleaner) => (
              <article
                key={cleaner.id}
                className="flex flex-col justify-between rounded-2xl border border-[#bcc9c6]/60 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(19,27,46,0.05)] transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
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
                        <h3 className="text-lg font-bold tracking-tight text-[#131b2e]">
                          {cleaner.name}
                        </h3>
                        <p className="text-xs font-medium text-[#3d4947]">{cleaner.role}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-[#3d4947]">
                          <span className="inline-flex items-center gap-1 tabular-nums text-[#131b2e]">
                            <Star
                              className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]"
                              aria-hidden="true"
                            />
                            {cleaner.rating.toFixed(2)} ({cleaner.reviewCount})
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{cleaner.completedHomes} cleans</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[11px] font-medium text-[#6d7a77]">From</span>
                      <span className="text-lg font-extrabold tabular-nums text-[#131b2e]">
                        ${cleaner.flatStartPrice}
                      </span>
                    </div>
                  </div>

                  {/* Unboxed clean attribute metadata */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#3d4947]">
                    {cleaner.isTopRated ? (
                      <span className="inline-flex items-center gap-1 text-[#825100]">
                        <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                        Top Rated
                      </span>
                    ) : null}
                    {cleaner.isEcoCertified ? (
                      <span className="inline-flex items-center gap-1 text-[#00685f]">
                        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                        Eco-Certified
                      </span>
                    ) : null}
                    {cleaner.hasSameDay ? (
                      <span className="inline-flex items-center gap-1 text-[#006398]">
                        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                        Same-Day Available
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2.5 line-clamp-2 text-sm leading-5 text-[#3d4947]">
                    {cleaner.bio}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eaedff] pt-4">
                  <div className="text-xs text-[#3d4947]">
                    <span className="font-semibold text-[#131b2e]">Next slot:</span>{' '}
                    <span className="tabular-nums">{cleaner.nextAvailable}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{cleaner.neighborhoods.slice(0, 2).join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenCleaner(cleaner)}
                      className="min-h-[44px] rounded-xl border border-[#bcc9c6] bg-white px-4 py-2 text-xs font-semibold text-[#131b2e] transition-colors hover:bg-[#f2f3ff] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f]"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookCleaner(cleaner.id)}
                      className="min-h-[44px] rounded-xl bg-[#00685f] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008378] active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
