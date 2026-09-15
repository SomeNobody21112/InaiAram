# Design Baseline — InaiAram Visual System

## Source

Visual tokens extracted from the existing InaiAram public website screenshots and the specification in the build prompt. The live site at https://inai-aram.ai.studio/ was used as the primary visual reference.

## Colour Palette — Light Theme

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAF8F4` | Warm ivory page background |
| `--bg-alt` | `#F5F1EA` | Alternating bands, sunken sections |
| `--surface` | `#FFFFFF` | Cards, trust profile panel |
| `--surface-raised` | `#FBF9F5` | Inset panels inside cards |
| `--line` | `#E8E2D8` | Hairline borders |
| `--line-strong` | `#D8CFC0` | Dividers, table rules |
| `--ink` | `#1C1917` | Display type — warm near-black |
| `--ink-2` | `#4A443F` | Body copy |
| `--ink-3` | `#7D756D` | Metadata, captions, mono labels |
| `--terracotta` | `#B5522B` | Primary CTA, italic accent, logo emblem |
| `--terracotta-deep` | `#93401F` | Terracotta on ivory (contrast-safe) |
| `--gold` | `#C79A3E` | Ornament rules, node rings, badge borders |
| `--gold-soft` | `#E4D3A8` | Low-emphasis ornament fill |
| `--sage` | `#5F7A55` | Verified/result state |
| `--taupe` | `#9A9186` | Muted chips, disabled |

**Key observation:** The palette is warm-neutral, never blue. There is no navy anywhere. If a cool grey is needed, `--ink-2` is used instead.

## Colour Palette — Dark Theme

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#171412` | Warm near-black brown background |
| `--bg-alt` | `#1C1815` | Slightly lighter band |
| `--surface` | `#201C19` | Card surface |
| `--surface-raised` | `#262119` | Elevated panels |
| `--line` | `#2E2925` | Borders |
| `--line-strong` | `#3A342E` | Dividers |
| `--ink` | `#F5EFE7` | Warm ivory type |
| `--ink-2` | `#B4ABA2` | Body text |
| `--ink-3` | `#8A8078` | Metadata |
| `--terracotta` | `#E08A5F` | Lightened toward coral for dark bg legibility |
| `--terracotta-deep` | `#EDA684` | Accent on dark |
| `--gold` | `#D9AE63` | Ornament |
| `--gold-soft` | `#6E5C3A` | Muted ornament |
| `--sage` | `#7E9B72` | Verified state |
| `--taupe` | `#837A6F` | Muted |

**Dark mode rules:** Card elevation from 1px border + surface lift, never heavy shadow. Ornament drops to ~0.5 opacity. Primary CTA may carry subtle terracotta→coral gradient (the only permitted gradient).

## Typography

Three-font system (the site's best design decision):

### Display Serif — Playfair Display
- Weights: 400, 500, italic 400
- Used for: Headlines only, never UI
- Sizes: `clamp(2.6rem, 5.5vw, 4.25rem)` down to `clamp(1.6rem, 3vw, 2.25rem)`
- The italic 400 carries the brand's accent-word device ("…before you say *yes.*")

### UI Sans — Inter
- Weights: 400, 500, 600
- Used for: Body, navigation, buttons, form labels
- Body size: `0.9375rem` / `1.7` line-height

### Mono — JetBrains Mono
- Weights: 400, 500
- Used for: Eyebrows, section labels, metadata, timestamps, case IDs, receipt hashes
- Letter-spacing: `0.14em`, uppercase
- Size: `0.6875rem` for labels, `0.75rem` for meta

**The accent-word device:** Final word or phrase in display headline set in serif italic in `--terracotta`. Maximum three uses on the entire site.

## Spacing

8px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

Section vertical padding: 72px mobile / 104px tablet / 136px desktop.

## Shape & Elevation

- Radii: 4px (chips, inputs, small buttons), 6px (primary buttons), 12px (cards), 999px (status pills, avatars)
- Borders do the work of shadows: 1px solid `--line` on `--surface`
- One elevation level: `0 1px 2px rgba(28,25,23,.04), 0 8px 24px rgba(28,25,23,.06)` for nav and dialogs only

## Ornament Language

Minimal and geometric, not floral:
1. Section rule: hairline in `--line-strong` with centred mono label flanked by terracotta diamonds
2. Lone diamond: single 6px terracotta diamond centred under serif interstitial
3. Emblem: circular radial garland in the wordmark (used sparingly)
4. Node rings: 1px circles around Evidence Thread icons in `--gold`

## Certainty States

Nine states with colour + glyph + text label (colour is never the only signal):

| State | Colour | Glyph |
|---|---|---|
| Verified | `--sage` | ✓ |
| Supported | `--gold` | ◑ |
| Requires consent | `--terracotta` | 🔑 |
| Candidate-controlled | `--terracotta` | 🔒 |
| No matching record found | `--taupe` | ○ |
| Conflicting | `--terracotta-deep` | ⇄ |
| Requires clarification | `--gold` | ⊕ |
| Unavailable | `--ink-3` | — |
| Under review | `--gold-soft` | ◷ |

"Search completed" was retired — it fails the core brand promise.

## Motion Philosophy

Things settle into place; nothing bounces, nothing loops. Key timings:
- Section reveal: 420ms, ease-out, once on scroll
- Hero headline: 500ms mask reveal
- Ornament draw-on: 1200ms
- Buttons: 140ms
- Theme switch: 200ms on bg/text only
- `prefers-reduced-motion` collapses everything to instant
