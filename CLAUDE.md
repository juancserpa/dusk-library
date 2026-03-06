# Dusk Library — Project Guide for Claude Code
## What This Is
A curated reading list website for the book **"AI and the Dusk of Humans"** by Juan Camilo Serpa (McGill University). React + Vite SPA deployed on Vercel via GitHub auto-deploy.
- **Repo:** https://github.com/juancserpa/dusk-library
- **Live site:** https://dusk-library.vercel.app
- **Owner:** juancserpa
## Architecture
- Single React component: `src/DuskLibrary.jsx` (current: v6 — book promo hero, about section, enhanced footer)
- Static JSON data files in `public/data/` (one per chapter)
- Book cover image at `public/cover.jpg`
- No router, no backend — everything loads client-side
- Vite for bundling, deployed automatically to Vercel on push to `main`
- Playfair Display serif font loaded via CSS `@import` in the component's `<style>` tag
## Data Structure
19 chapters: `prologue`, `ch1` through `ch18`. Each has a JSON file like `public/data/ch3_references.json`.
Each JSON file has:
```json
{
  "chapter": "ch3",
  "title": "Chapter 3 Title",
  "entries": [...]
}
```
Each entry has these fields:
- `id` (string, e.g. "ch3-015")
- `title`, `author`, `source`, `url`
- `type`: article | paper | podcast | video | book | report | legal | series
- `difficulty`: quick | moderate | deep
- `chapter`: matches the file's chapter
- `hook`: 1-2 sentence teaser shown on the card
- `why_it_matters`: shown when card is expanded
- `summary`: optional, shown when expanded
- `keywords`: array of strings
- `questions`: array matching the 11 browsing questions defined in QUESTIONS constant in DuskLibrary.jsx
- `year`, `time` (reading time estimate like "8 min" or "45 min")
- `startHere`: boolean, optional — flags "essential reads" shown in sidebar
## UI Components (in DuskLibrary.jsx)
- **Cinematic Hero:** Split layout — book cover (left) + title, subtitle, "intellectual backbone" tagline, pull quote, author badge (right). Playfair Display serif for the title. Cover has breathing glow animation and 3D hover tilt. Responsive: stacks on mobile.
- **About Section:** Expandable panel in hero with 3 cards (Traceable Claims, Guided Exploration, Living Archive) + dynamic stats row. Closed by default.
- **Question pills:** 11 browsing questions with counts, in the hero
- **Sticky search bar:** search + sort + results count + clear filters
- **Left sidebar (210px):** Chapters list, Type filter, Depth filter, Start Here section
- **Card list:** expandable cards with type icon, metadata, hook, and "Read the source" link
- **Enhanced Footer:** Split layout — smaller cover (left) + book promo text + "Get Notified" CTA + author attribution
## The 11 Browsing Questions
1. Will AI take my job?
2. How fast is this happening?
3. What happens to meaning and purpose?
4. Is AI actually dangerous?
5. Can AI think or feel?
6. How do I actually use AI well?
7. What happens to love and connection?
8. Who controls AI?
9. What happens to education?
10. What does AI cost the planet?
11. Am I still the real me?
## Common Tasks
### Deploy references ("deploy references" or "update references")
The reference JSON files are maintained in Dropbox and updated daily by a Cowork scheduled task. When asked to deploy:
1. Copy all `*_references.json` from `~/Library/CloudStorage/Dropbox/Book/Book Deal/Database/` into `public/data/` in this repo
2. Create a new branch `claude/ref-update-YYYY-MM-DD` (today's date)
3. Commit with a message describing what changed (entry counts, new chapters, etc.)
4. Push and create a PR via `gh pr create`
5. Return the PR link so it can be merged

**Note:** This only works in local sessions where Dropbox is mounted. The repo lives at `~/Desktop/dusk-library`. GitHub CLI (`gh`) is authenticated.

### Adding a new reference
1. Edit the relevant `public/data/{chapter}_references.json`
2. Add an entry to the `entries` array with all required fields
3. Ensure the URL works (test with curl)
4. Push to main — Vercel auto-deploys
### URL audit
Run a URL audit by fetching every entry's URL across all JSON files and checking for 404s, redirects, or timeouts. Fix broken URLs or flag them.
### UI changes
All UI is in `src/DuskLibrary.jsx`. It uses inline styles (no CSS files). Color palette is in the `C` constant. Font stack is in the `font` constant.
## Quality Checks
- All URLs should return 200 (we audited 340 URLs previously)
- All entries should have: id, title, author, url, type, difficulty, chapter, hook
- No duplicate IDs within a chapter
- `type` must be one of the 8 valid types
- `difficulty` must be one of: quick, moderate, deep
- `questions` values must match the 11 defined questions exactly
## Local Development
```bash
npm install
npm run dev    # starts on localhost:5173
npm run build  # production build
```
## Book Cover Illustrations
The book contains pencil-style cartoons. The LaTeX source folder (in Dropbox, not yet in the repo) has the illustration assets. These could be used as chapter decorations or in the About section in future versions.
