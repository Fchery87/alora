# Care Journal Design System (Alora)

**Date:** February 5, 2026  
**Status:** Draft (approved direction: Care Journal)

## Goal

Create a distinctive, cohesive visual system for Alora that feels like a trusted logbook at 3am: calm, adult, warm, and highly legible. Premium through typography, spacing, and structure — not effects.

## Research notes (marketing + product fit)

- Many baby-tracking products win on **speed + simplicity** rather than feature density. Case studies for baby tracking apps emphasize a “quick add + recent history” loop and reducing UI heaviness. The Care Journal metaphor supports this: “one stamp, one log row, done.”
- Parenting tracking behavior still resembles **paper worksheets** (especially in the newborn phase). Leaning into paper/ink/timestamps makes the UI feel familiar and trustworthy, while differentiating from generic “health dashboard” visuals.
- 2025–2026 design/branding trend coverage points toward renewed interest in **texture, warmth, and tactile visual language** (without glass/gradient identity). Care Journal uses restraint (rules, margins, stamps) to feel modern without looking like a template.

## Core metaphors

- **Paper + Ink:** warm paper surfaces, ink hierarchy, thin rules
- **Stamps:** activity categories behave like stampable actions
- **Margins:** optional details live in “margin note” blocks
- **Timeline:** the day reads like a journal timeline, not a feed of cards

## Anti-patterns (do not ship)

- Gradient-as-identity, glass blur, neon glow, “SaaS template” layout tropes
- Over-rounded “toy” UI, cute baby iconography as primary brand language
- Icon-only primary actions without labels
- Multiple competing CTAs per screen

## Typeface direction

- Headings: **Literata** (editorial, humane authority)
- Body/UI: **IBM Plex Sans** (fast scanning, dense log legibility)
- Numbers: prefer **tabular numerals** for times/amounts

## Color direction (pigment, not glow)

Use pigments sparingly for meaning and actions; everything else stays in paper/ink.

- Paper base: `#FBF7F0`
- Paper wash: `#F4EEE4`
- Paper edge/border: `#E8DED0`
- Ink strong: `#1F2328`
- Ink muted: `#4A4F55`
- Ink faint: `#70767D`
- Primary action (Clay): `#C46A4A` (pressed: `#A8563A`)
- Success/steady (Sage): `#2F6B5B`
- Highlight (Marigold): `#D1A545`
- Info (Sky): `#2F5E8C`
- Error (Rust): `#B24A3C`

## Layout rules

- Mobile-first; minimum 44×44 touch targets
- One primary action per screen
- Logs are typographic objects: time / label / value alignment
- Tablet+: use a context rail (filters, “since last checked”, quick stamps), but keep the primary flow single-column and fast

## Component language

### Foundations

- `JournalScaffold`: paper background, consistent margins, page title area
- `JournalCard`: warm surface with thin border + restrained shadow
- `Rule`: thin divider lines; used to group timeline sections

### Logging primitives

- `StampButton`: labeled category action; active ring indicates selection
- `QuickAddSheet`: bottom sheet with minimal required inputs + optional “Add note/details”
- `LogRow`: time (tabular) + title + value; optional meta and visibility badge

### Motion

- Opacity/translate micro-reveals (“ink settling”)
- “Stamp press” confirmation on save (subtle scale + haptic)
- Respect reduced motion: disable transforms, keep opacity-only

## Recommended first adoption targets

1. Implement tokens + `JournalScaffold`, `StampButton`, `LogRow`
2. Use them in one “Today”/dashboard screen section to validate feel
3. Migrate history timeline to journal rules + rows
