# Penny Design System & Interface Guidelines

## 1. Aesthetic Direction (High Taste / Anti-Slop)
- Target vibe: High-end, minimalist developer-grade fintech (inspired by Linear and Raycast).
- Strict BANS (Do not generate):
  - NO floating blurry gradient spheres/blobs behind text.
  - NO generic 3-column cards with identical checkmark lists.
  - NO cheesy stock-feeling mockups or generic centered layouts.
- Requirements:
  - Strong visual hierarchy with high-contrast typography.
  - Asymmetric, Bento-box style feature showcases showing real app previews/UI state.
  - Ultra-clean borders (`rgba(255, 255, 255, 0.08)`) and deep dark background layers.
  - Deliberate whitespace that feels premium and breathing.

## 2. Color Palette & Tokens
- Background Base: `#090A0F` (deep obsidian)
- Background Elevated / Surface: `#11131A` (card surface)
- Background Interactive / Hover: `#181B26`
- Border Subtlety: `rgba(255, 255, 255, 0.08)`
- Border Accent: `rgba(139, 92, 246, 0.3)` (subtle Penny purple glow)
- Primary Text: `#F3F4F6` (crisp white)
- Secondary Text: `#9CA3AF` (muted slate)
- Accent Purple: `#8B5CF6` (Penny Brand)
- Accent Green (Money/Positive): `#10B981`

## 3. Vercel Web Interface Guidelines (UX & Mobile Polish)
- Mobile inputs must be ≥ 16px font size to prevent iOS Safari auto-zooming on focus.
- Touch targets must be at least 44px on mobile devices.
- Buttons must have visible, crisp `:focus-visible` states.
- Animations must only animate `transform` and `opacity` (no animating width/height or layout-triggering properties).
- Respect `prefers-reduced-motion`.
- All interactive links must be valid `<a>` or Next.js `<Link>` elements.