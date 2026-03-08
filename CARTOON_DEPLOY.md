# Cartoon Illustrations Deployment (v2)

## What changed
Seven cartoon illustrations from the book have been added to the website in two ways:

### 1. Gallery strip (always visible)
A horizontal scrollable "Illustrations from the book" gallery sits between the About section and the filters. Shows all 7 cartoons as cards with:
- Cartoon thumbnail (130px tall, cover-fit)
- Chapter label (e.g., "Prologue", "Chapter 1")
- Chapter title (e.g., "Welcome to Second Place", "The Meaning Recession")
- Click to filter references by that chapter
- Hover lift + zoom animation
- Mobile responsive (cards shrink to 160px)

### 2. Chapter banner (on chapter selection)
When filtering by a chapter that has an illustration, a larger banner version of the cartoon appears above the question filters. "From the book" label in corner.

### 3. Injected CSS
A useEffect injects a `<style>` tag with:
- fadeIn, fadeInUp, pulse keyframes (used throughout the app)
- Hover effects for cartoon cards
- Custom scrollbar styling for the gallery
- Mobile breakpoint at 640px

## New files to commit
- `public/cover.jpg` — Book cover (77KB)
- `public/cartoons/prologue.jpg` (44KB)
- `public/cartoons/ch1.jpg` (119KB)
- `public/cartoons/ch2.jpg` (103KB)
- `public/cartoons/ch3.jpg` (105KB)
- `public/cartoons/ch4.jpg` (120KB)
- `public/cartoons/ch5.jpg` (100KB)
- `public/cartoons/ch6.jpg` (114KB)

Total new assets: ~782KB

## Deployment
```bash
cd ~/Desktop/dusk-library
git add public/cover.jpg public/cartoons/ src/DuskLibrary.jsx
git commit -m "Add book illustrations gallery, chapter banners, cover image"
git push origin main
```

## Cleanup (after deploy)
```bash
rm FAVICON_FIX.md SOURCE_DOMAIN_EXPANDED.js V6_DEPLOY.md CARTOON_DEPLOY.md DuskLibrary.jsx.new
git add -u && git commit -m "Remove instruction files" && git push origin main
```
