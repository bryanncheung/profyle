# Profyle — DESIGN.md

## Product
A sleek professional personality quiz that reveals how you work, who you work best with, and where you belong. The result is a shareable graphic card people post on LinkedIn, Instagram, and group chats.

**Design principle:** Confidence through restraint. The product does serious work — it should look like it.

---

## Typography

**Primary font:** Manrope (Google Fonts)
- Headlines: 800–900 weight, tight letter-spacing (-0.03em to -0.04em)
- Body: 400–500 weight, comfortable line-height (1.5–1.6)
- Labels/eyebrows: 700 weight, wide letter-spacing (0.12–0.18em), uppercase
- UI elements: 600–700 weight

**Type scale:**
- Hero type (result name): 64–80px, 900 weight
- Section headers: 28–36px, 800 weight
- Body: 15–17px, 400–500 weight
- Labels: 11px, 700 weight, uppercase, tracked

**Rules:**
- Never use system fonts or Inter
- Headlines always have negative letter-spacing
- Labels always uppercase with wide tracking
- No decorative or serif fonts anywhere

---

## Colour System

### Base
- Background: `#F5F3EE` (warm off-white)
- Surface: `#FFFFFF`
- Border: `#E8E4DC`
- Text primary: `#0E0E0E`
- Text secondary: `#666660`
- Text muted: `#A0A098`

### Archetype Accent Palettes

| Archetype | Accent | Background tint | Pill bg | Pill border |
|---|---|---|---|---|
| Builder | `#E8650A` | `#FDF6EE` | `#F5EAD8` | `#EAD4B0` |
| Disruptor | `#E82B2B` | `#FEF4F4` | `#FCDEDE` | `#F5BABA` |
| Anchor | `#0F8A8A` | `#F0FAF9` | `#D8F2F0` | `#B0E4E0` |
| Catalyst | `#C4A800` | `#FDFBEE` | `#F5F0C8` | `#EAE090` |
| Sovereign | `#7B4FE0` | `#F5F2FF` | `#EAE0FF` | `#D0BBFF` |

### Adjective pill accents (fixed)
- Pill 1: mint — bg `#E8F7EF`, text `#2A7A4E`
- Pill 2: violet — bg `#EDE9FF`, text `#5B3FD6`
- Pill 3: gold — bg `#FFF4E8`, text `#B86A1A`

---

## Motion

- Quiz transitions: smooth crossfade (opacity + slight translateY), 280ms ease
- Result reveal: staggered entrance — type first, then bars fill, then sections fade up
- Attribute bars: fill animation on mount, 600ms ease-out, staggered by 80ms each
- CTA hover: translateY(-2px), 180ms ease
- No bounce, elastic, or spring easing
- Reduced motion: respect `prefers-reduced-motion`
