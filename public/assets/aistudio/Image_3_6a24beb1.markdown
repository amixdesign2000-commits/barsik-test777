---
name: Pristine Living Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies reliability, cleanliness, and effortless clarity. Built specifically for an on-demand residential cleaning marketplace, the interface evokes the immediate sensory relief of stepping into a spotless, refreshed home. 

The aesthetic is Modern Minimalist infused with tactile, approachable warmth:
- **Atmosphere:** Airy, clinical-yet-welcoming, and meticulously structured. It replaces administrative friction with transparent pricing, instant booking confirmation, and verified provider credibility.
- **Audience:** Busy urban homeowners, working parents, and renters who demand rapid booking, transparent security vetting, and spotless service delivery.
- **Design Philosophy:** Clutter-free layouts, high breathing room, and soft physical affordances. Micro-interactions reward completion, while clear visual anchoring highlights reliability signals (background checks, reviews, organic cleaning products).

## Colors

The color palette centers around clinical cleanliness, dependable performance, and cheerful satisfaction:
- **Primary (`#0D9488` - Deep Fresh Teal):** Represents hygiene, vitality, and trust. Used for primary booking triggers, selected active tabs, and primary action affordances.
- **Secondary (`#0284C7` - Vibrant Sky Blue):** Suggests clear air and flowing water. Used for interactive utilities, secondary actions, and verified technician credentials.
- **Tertiary (`#F59E0B` - Sunny Amber Gold):** Used selectively for high-urgency badges, rating stars, reward incentives, and time-sensitive guarantees.
- **Neutral Palette (`#0F172A` Slate Dark down to `#F8FAFC` Crisp Clean Slate White):** Ensures ultra-crisp typographic contrast without the harshness of pure black. Backgrounds leverage warm neutral tints to ensure white card surfaces float effortlessly.

## Typography

The typography leverages Plus Jakarta Sans to combine modern geometry with human warmth. 

- **Titles & Display:** Rendered with confident, tight-tracking weights (700/800) to project security and modern efficiency.
- **Body & Service Specs:** High legibility with ample line heights to allow easy scanning of cleaning inclusions, add-on checklists, and pricing breakdowns.
- **Labels & Tags:** Tightly bounded weights (600/700) ensure status badges like "Eco Friendly" or "Same Day" remain legible at glance-scale on compact screens.

## Layout & Spacing

Designed primarily for mobile screen viewports (375px–430px wide) with a responsive fluid layout that adapts cleanly to tablet and desktop sheet presentations.

- **Grid Architecture:** 4-column fluid layout on mobile, transitioning to an 8-column layout on tablet, and a centered 12-column layout (max-width 1120px) on desktop.
- **Margins & Edge Padding:** Mobile uses a fixed 16px (`1rem`) outer margin to preserve maximum horizontal screen real estate for service cards and horizontal scroll lists.
- **Touch Rhythms:** Interactive tap zones strictly maintain a 44px minimum vertical and horizontal touch footprint, regardless of visual icon size.

## Elevation & Depth

This design system avoids dark or heavy shadows, relying instead on clean, multi-layered depth and subtle translucent borders to communicate elevation:

- **Level 0 (Base Canvas):** Light slate background (`#F8FAFC`) providing contrast against elevated pure white containers.
- **Level 1 (Card & Content Blocks):** Pure white fill (`#FFFFFF`) framed by a faint low-contrast border (`1px solid #E2E8F0`) and an ambient, low-opacity shadow (`box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05)`).
- **Level 2 (Modals, Sticky Bottom Sheets & Floating Booking Bars):** Pure white fill with elevated soft blur (`box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.10)`) paired with a semi-transparent border (`rgba(226, 232, 240, 0.8)`).
- **Interactive Surface States:** Active or pressed cards feature a soft teal ring tint (`0 0 0 2px rgba(13, 148, 136, 0.15)`).

## Shapes

The design system employs an inviting, ultra-soft shape geometry:
- **Base Components (Inputs, Buttons, Service Tiles):** Styled with `rounded-xl` (12px to 16px radius) to evoke comfort and modern product craftsmanship.
- **Feature Cards & Detail Modals:** Styled with generous `rounded-2xl` (20px to 24px) corners, framing cleaner profiles and booking summaries smoothly.
- **Filter Tags, Badges & Chips:** Strict full-pill geometry (`rounded-full` / 9999px) to indicate quick tapability and clear tag classification.

## Components

### Buttons
- **Primary Action (Book Now / Confirm):** Bold solid Teal (`#0D9488`), crisp white text, 48px to 52px height, `rounded-xl`, subtle inner glow. On press, scale slightly (`0.98`) with active state tinting.
- **Secondary Action:** Ghost style with a 1px border (`#E2E8F0`), `#0F172A` text, and white background, transitioning to a soft teal wash on hover/tap.
- **Touch Boundary:** All button click targets are minimum 44px × 44px.

### Badges & Pill Chips
- **Category & Filter Pills:** 36px height, `rounded-full`. Inactive: `#F1F5F9` background, `#475569` text. Selected: `#0D9488` background, `#FFFFFF` text.
- **Status Badges:** Small, high-contrast, compact pills:
  - *Top Rated:* Sunny Yellow tint (`#FEF3C7`) background, `#B45309` text, accompanied by an amber star icon.
  - *Eco Friendly:* Fresh Sage/Teal tint (`#CCFBF1`) background, `#0F766E` text, accompanied by a leaf glyph.
  - *Same Day:* Sky Blue tint (`#E0F2FE`) background, `#0369A1` text, accompanied by a lightning/clock glyph.

### Cards
- **Cleaner & Service Cards:** Elevated Level 1 white cards featuring full-bleed top imagery or rounded avatar thumbnails, subtle 1px border (`#E2E8F0`), distinct rating cluster, and instant pricing baseline (`$XX/hr` or `$XXX flat`).
- **Interactive Selection Cards (Room Selectors, Add-ons):** Feature a top-right custom checkbox and highlight with a 1.5px `#0D9488` stroke when toggled.

### Inputs & Form Elements
- **Input Fields:** 48px height, `rounded-xl`, `#F8FAFC` background with a 1px `#E2E8F0` resting border. When focused: pristine white background with a `#0D9488` crisp border and faint focus ring.
- **Checkboxes & Radios:** 22px × 22px custom controls with smooth rounded corners (4px for checkboxes, full circle for radios). Active fill uses primary `#0D9488` with a crisp white mark.

### Floating Booking Action Bar
- Pinned to the mobile screen bottom above safe-area insets. Features pricing tally on the left, primary checkout CTA button on the right, housed in a frosted translucent white container (`backdrop-blur-md` with `rgba(255, 255, 255, 0.9)`).