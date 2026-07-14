# Cephalosophie Design System

## Company & Product Context

**Company:** Cephalosophie (cephalosophie.com)
**Project:** KantoAplo (kantoaplo.com)
**Language:** French (primary), targeting francophone card game players

### What is Cephalosophie?

Cephalosophie is a multiplayer belote card game platform with a unique twist: **AI robot training**. The name is a portmanteau of "cephalo" (head/brain, from Greek κεφαλή) and "sophie" (wisdom, from σοφία) — "the wisdom of the mind."

Players train autonomous AI robots to play belote — like Pokémon trainers raising fighters, but for card strategy. Robots can:
- Be trained via a visual **node-based brain editor** (code + visual programming)
- Compete autonomously against other players' robots
- Earn wins, losses, and rewards
- Form team strategies — deciding who plays with whom
- Attack and defend in team-based strategic campaigns (city attack/defense, but resolved through belote games)

### Inspirations

The product draws from three game genres:
1. **Pokémon** — training, evolving, and battling autonomous creatures
2. **Chess** — deep strategy and positional thinking
3. **Team strategy games** — cooperative attack/defense mechanics

### Core Surfaces

1. **Game Table** — The belote card game itself: 4-player table, bidding (enchère), trick-taking, score tracking, with playback controls for training matches
2. **Brain Editor** (Éditeur de cerveau) — IDE-like interface for programming robot AI with functions (decideBid, decideCard, shouldContre, shouldSurcontre), a testing panel with context variables, and a card hand simulator
3. **Node Editor** — Visual pipeline editor connecting AI modules (data sources, forecasting, scheduling, model inference) with colored node connections
4. **Landing/Marketing Site** — Showcase site for the game (to be built)

### Sources

- Screenshots from the live application (8 screens): game table, bidding dialogs, brain editor, node editor
- Mounted codebase: `beloteDesi/` (was empty at time of creation — needs re-attachment for deeper extraction)
- Websites: cephalosophie.com, kantoaplo.com

---

## CONTENT FUNDAMENTALS

### Tone & Voice
- **Technical but approachable** — the product blends card game casualness with AI/programming depth
- **French language** throughout — all UI labels, button text, descriptions are in French
- **Second person** — "Vous" (formal you): "À vous d'annoncer", "Jouer avec mes robots (vous = siège A)"
- **First person possessive** — "Mes robots", "Ma main", "Mon cerveau"
- **Compact labels** — UI text is terse and action-oriented: "Passe", "Capot", "Coincher", "Tester"
- **Technical jargon** mixed with game slang: "Enchère", "Atout", "Manche", "Antihoraire", "Coincher"

### Casing
- **Sentence case** for headings: "Entraînement local", "À vous d'annoncer"
- **ALL CAPS** for log levels: ERR, WRN, INF, DBG, TRC
- **ALL CAPS** for section labels: "CONTEXTE", "FONCTIONS", "RÉGLAGES"

### Emoji & Icons
- No emoji in the UI
- Pixel-art robot avatars serve as player icons
- Card suit symbols (♠♥♦♣) used as functional icons
- Custom icon set for robot types (gear icons, brain icons)

### Vibe
Cosmic, cerebral, strategic. The interface feels like a command center — dark, focused, information-dense. The gold accents evoke intelligence and prestige. The green felt table is the one warm, traditional element grounding the space-age aesthetic.

---

## VISUAL FOUNDATIONS

### Color System
- **Dark-first palette** — the entire product lives on deep navy/charcoal backgrounds (#0d1117, #151b26)
- **Gold/amber as signature accent** — #c5a44e is the dominant brand color, used for CTA buttons (Capot), highlights, selected borders, and prestige elements
- **Green felt** — the card table uses a classic casino green (#2d7a42) with darker edges and a gold/brown border
- **Blue** — card backs feature blue (#2a5090) with diagonal stripe pattern; also used for info badges and links
- **Red** — hearts/diamonds suit color, error states, adversaire (opponent) tags
- **Pink/magenta** — selected node highlighting in the node editor
- **Orange** — warning badges in console, some node connectors
- **Purple** — decorative accents in the cosmic background, some node connectors

### Typography
- **Sans-serif** for all UI text — clean, geometric sans (Space Grotesk)
- **Bold** for page titles: "Entraînement local" in heavy weight
- **Monospace** for console output, code editor, and technical data (JetBrains Mono)
- **No decorative or serif fonts** — everything is functional
- ⚠️ Substitution: Space Grotesk + JetBrains Mono from Google Fonts (original font files not available from codebase)

### Spacing & Layout
- **Dense information layout** — panels are tightly packed with minimal padding
- **8px base grid** — consistent spacing visible across all panels
- **Sidebar + main + panel** three-column layout for editors
- **Center-stage** layout for the game table — table centered with players at cardinal positions

### Backgrounds
- **Solid dark backgrounds** — no images, no textures on app chrome
- **Cosmic gradient** on some backgrounds — subtle radial purple/blue glow suggesting deep space
- **Green felt gradient** — radial gradient on the card table surface
- **No full-bleed images**, no hand-drawn illustrations, no repeating patterns outside of card backs

### Borders & Outlines
- **Subtle borders** — rgba(255,255,255,0.08-0.12) for panel dividers
- **Gold borders** — for selected items, player's active hand, CTA highlights
- **Pink/magenta borders** — for selected nodes in the node editor (3px solid, with glow)
- **Blue borders** — for robot avatars and player badges
- **Rounded corners** — 8-12px for panels and cards, 16-24px for the felt table, full-round for badges

### Shadows
- **Minimal outer shadows** — mostly dark drop shadows for elevation
- **Glow effects** — colored glow (box-shadow with spread) for selected/active elements: gold glow on active buttons, pink glow on selected nodes, green glow on success states
- **No inner shadows**

### Animation & Motion
- **Speed controls** for game replay (0.25x to 12x) — key feature
- **No decorative animations** visible in screenshots
- **Transitions** — subtle hover state changes, card dealing animations
- **Easing** — smooth ease-out for UI transitions

### Hover States
- **Lighter background** — elements get slightly lighter on hover
- **Gold highlight** — buttons and interactive elements gain gold tint

### Press / Active States
- **Filled gold** — active buttons become solid gold (Capot button)
- **No shrink effects** visible

### Card Design (Playing Cards)
- **Blue diagonal striped backs** — repeating -45deg stripes on medium blue
- **White/cream faces** with standard French card graphics
- **Orange/gold border** around the player's own hand
- **Fan layout** — cards spread horizontally with slight overlap at bottom of screen

### UI Panels
- **Dark raised panels** — #1c2333 with subtle border
- **Rounded corners** — 8-12px
- **No prominent shadows** — rely on background contrast
- **Glass-like dialogs** — bidding dialog uses semi-transparent dark background with blur

### Corner Radii
- Buttons: 6-8px
- Panels: 8-12px
- Game table felt: 20-24px
- Badges/pills: 9999px (full round)
- Cards (playing cards): 8px

### Transparency & Blur
- **Dialog overlays** — semi-transparent dark backgrounds (rgba(21,27,38,0.85))
- **Backdrop blur** on modal dialogs
- **No frosted-glass in main UI** — used sparingly for overlays only

### Imagery Style
- **Dark, high-contrast** — all screenshots on dark backgrounds
- **Pixel-art robot avatars** — small, colorful, grid-based character icons
- **No photography, no illustrations** (outside robot avatars)

---

## ICONOGRAPHY

### Approach
- **Custom pixel-art robot avatars** — each robot/player has a unique pixel-art icon (colored, ~32x32px feeling)
- **Card suit symbols** — ♠♥♦♣ used as functional icons in suit selectors, rendered as standard text/unicode
- **Functional icon set** — small icons for actions: play/pause (▶ ‖), step forward (▶|), gear (⚙), brain, clone, save
- **No icon font identified** — icons appear to be inline SVGs or unicode characters
- **No emoji** in the product UI

### Robot Avatars
Robot players have distinct pixel-art avatars in team colors:
- Team colors include teal/cyan, red/coral, gold/amber, purple
- Avatars are small (badge-size), placed next to player names
- Style: chunky pixel art, 2-3 colors per avatar, simple silhouettes

### Icon Substitution
⚠️ Original icon assets were not available from the codebase. Card suit icons use unicode characters. For general UI icons, Lucide Icons (stroke-based, 24px) is recommended as the closest match to the clean, minimal icon style visible in screenshots.

---

## File Index

### Tokens (127 custom properties)
- `tokens/colors.css` — Background scale, gold/amber, accent colors, suit colors, semantic aliases
- `tokens/typography.css` — Font families, sizes, weights, line-heights, letter-spacing
- `tokens/spacing.css` — Spacing scale, border radii, shadows, glow effects, z-index, transitions
- `tokens/effects.css` — Gradients (cosmos, felt, gold), glass effects, card-back pattern

### Root
- `styles.css` — Global CSS entry point (`@import` list only — consumers link this one file)
- `readme.md` — This file
- `SKILL.md` — Agent skill definition for Claude Code integration

### Assets
- `assets/screenshots/` — 8 product screenshots (game table, bidding, brain editor, node editor)

### Components (9 primitives)

**Core** (`components/core/`)
- `Button` — Gold CTA, dark secondary, outline toggle, ghost tertiary. 3 sizes.
- `Badge` — Colored status indicators for log levels, scores, tags. Filled or outline.
- `Panel` — Elevated container (raised, surface, overlay, glass). Optional glow border.
- `Tabs` — Horizontal tab bar with gold active underline and optional count badges.

**Forms** (`components/forms/`)
- `Select` — Dark dropdown with chevron. Two sizes.

**Game** (`components/game/`)
- `PlayerBadge` — Player/robot identity with colored avatar circle, name pill, optional score.
- `SuitSelector` — Four-suit icon buttons (♠♥♦♣) for trump selection.
- `SpeedControl` — Playback bar with play/pause, step, and speed multiplier buttons.

**Feedback** (`components/feedback/`)
- `LogEntry` — Console log line with timestamp, colored level badge (ERR/WRN/INF/DBG), message.

Each component has `.jsx`, `.d.ts` (props contract), and `.prompt.md` (usage guide).

### UI Kits
- `ui_kits/game_table/` — Full belote game table with bidding dialog, console panel, speed controls
- `ui_kits/brain_editor/` — Robot AI programming IDE with function list, code editor, context panel, output

### Guidelines (14 specimen cards)
Foundation cards for the Design System tab, organized by group:
- **Colors** (4): Background scale, Gold & amber, Accent colors, Suit colors
- **Type** (3): Display & headings, Body & UI text, Monospace
- **Spacing** (3): Spacing scale, Border radii, Shadows
- **Brand** (4): Glow effects, Felt table, Card back pattern, Cosmic background
