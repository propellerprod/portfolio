# Black & White Redesign with Feathered Soft-Edge Video Previews — «Пропеллер Union»

Transition the «Пропеллер Union» portfolio from the previous VHS styling into a stark, refined monochrome (Black & White) aesthetic with soft feathered blur around video preview edges, clean direct looping previews, and YouTube interface suppression.

---

### User Review & Decisions

- **Color Scheme**: Strict Black & White (monochrome) — pitch black `#000000` canvas, deep charcoal card base `#0d0d0d`, pure white `#ffffff` headings, and muted neutral grays (`#777777` – `#aaaaaa`). All blue/cyan tones and VHS effects are completely removed.
- **Card Edges**: Soft blurred / feathered perimeter fade. Instead of hard rectangular borders, card video viewports have a gentle edge vignette and feathered gradient mask that softly dissolves the video borders into the black background.
- **YouTube Interface Concealment**:
  - Embedded URLs configured with `controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&showinfo=0`.
  - CSS scaled crop (`transform: scale(1.12)` with `overflow: hidden`) to crop out the top YouTube title bar, channel avatar, and share button overlay, ensuring an immersive, clean video viewing experience.
- **Category Tabs & Default Order**:
  1. **КОНЦЕРТЫ** (Default active screen)
  2. **КЛИПЫ**
  3. **БЛОГЕРЫ**
  4. **REELS**
  5. **ВСЕ** (At the end)
  - Alongside brand text: **ПРОПЕЛЛЕР UNION**
- **Direct Video Autoplay**: Muted looping video embeds directly on cards for instant motion preview.
- **Admin Access**: Strictly hidden from all public UI, accessible only at direct `/admin` or `#admin`.

---

### Proposed Implementation Plan

#### 1. Strip VHS Elements & Implement Pure Black & White Palette (`src/index.css`, `src/App.tsx`)
- Remove `.vhs-crt-scanlines`, `#vhs-grain`, `.vhs-tracking-shimmer`, `.vhs-osd-badge`, and chromatic glitch keyframes.
- Define monochrome CSS tokens: `--canvas: #000000`, `--card: #0c0c0c`, `--text: #ffffff`, `--text-muted: #888888`, `--border: #1a1a1a`.
- Implement soft feathered perimeter blur for video containers (`.soft-edge-preview` with `mask-image: radial-gradient(...)` / feathered border shadow).

#### 2. YouTube Embed Clean Launch & Scaled Edge-Crop (`src/utils/video.ts`, `src/components/Works.tsx`, `src/components/CaseModal.tsx`)
- Enhance `toMutedLoopEmbed` and `toEmbed` to append `controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1`.
- Add slight scaled crop (`scale(1.1)` / container offsets) inside both grid preview cards and the modal player so YouTube title headers, watermarks, and UI elements are cropped outside the visible window.

#### 3. Update Gallery Grid & Modal Styling (`src/components/Works.tsx`, `src/components/CaseModal.tsx`)
- Apply the feathered soft-edge vignette on all preview cards.
- Refine modal lightbox with sleek monochrome styling, smooth backdrop blur, and invisible YouTube top header.

#### 4. Header & Navigation Refinement (`src/components/Header.tsx`)
- Clean black-and-white header styling without tape badges or cyan glows.
- Ensure active tab indicators are clean white underlines / monochrome high-contrast indicators.

#### 5. Verification & Linting
- Run `lint_applet` and `compile_applet` to ensure zero compilation or typing errors.
- Verify appearance across tabs and modals on port 3000.
