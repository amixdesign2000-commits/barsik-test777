import { CalendarCheck, Compass, SlidersHorizontal, Users } from 'lucide-react';
import { AppScreen } from '../types/marketplace';

interface TopNavProps {
  activeScreen: AppScreen;
  upcomingCount: number;
  onNavigate: (screen: AppScreen) => void;
  onStartBooking: () => void;
}

const NAV_ITEMS: { id: AppScreen; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'specialists', label: 'Specialists' },
  { id: 'configure', label: 'Configure' },
  { id: 'bookings', label: 'Bookings' },
];

export function TopNav({
  activeScreen,
  upcomingCount,
  onNavigate,
  onStartBooking,
}: TopNavProps) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#bcc9c6]/50 bg-[#faf8ff]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-[1120px] items-center justify-between gap-8 px-4 md:h-16 md:px-5">
          {/* Zone 1: Single-element brand wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className="min-h-[44px] whitespace-nowrap shrink-0 text-left text-lg font-extrabold tracking-tight text-[#131b2e] transition-colors hover:text-[#00685f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] focus-visible:ring-offset-2 rounded-lg"
          >
            Pristine Living
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative min-h-[44px] px-1 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] rounded-md ${
                    isActive
                      ? 'text-[#00685f]'
                      : 'text-[#3d4947] hover:text-[#131b2e]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'bookings' && upcomingCount > 0 ? (
                    <span className="ml-1.5 tabular-nums text-xs text-[#6d7a77]">
                      ({upcomingCount})
                    </span>
                  ) : null}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-1 bottom-2 h-0.5 rounded-full bg-[#00685f]"
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onStartBooking}
              className="min-h-[40px] md:min-h-[44px] rounded-xl bg-[#00685f] px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#008378] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00685f] focus-visible:ring-offset-2"
            >
              Book Clean
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar — hidden during Configure where the floating checkout bar owns the bottom zone */}
      {activeScreen !== 'configure' ? (
        <nav
          aria-label="Mobile navigation"
          className="fixed bottom-0 left-0 right-0 z-30 grid h-14 grid-cols-4 border-t border-[#bcc9c6]/60 bg-white/95 backdrop-blur-md md:hidden"
        >
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
              activeScreen === 'discover' ? 'text-[#00685f]' : 'text-[#6d7a77]'
            }`}
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
            <span>Discover</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('specialists')}
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
              activeScreen === 'specialists' ? 'text-[#00685f]' : 'text-[#6d7a77]'
            }`}
          >
            <Users className="h-5 w-5" aria-hidden="true" />
            <span>Specialists</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('configure')}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold whitespace-nowrap text-[#6d7a77] transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>Configure</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
              activeScreen === 'bookings' ? 'text-[#00685f]' : 'text-[#6d7a77]'
            }`}
          >
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            <span>
              Bookings{upcomingCount > 0 ? ` (${upcomingCount})` : ''}
            </span>
          </button>
        </nav>
      ) : null}
    </>
  );
}
