# Hyatt's Restaurant — independent website concept

Static HTML/CSS/JS. No build step, no dependencies.

## Run locally
Open `index.html` in a browser, or from this folder run `python3 -m http.server 8000` and visit http://localhost:8000.
(Fonts and the map load from Google, so you need an internet connection to see them as designed.)

## Deploy on Netlify
1. Go to app.netlify.com → Add new site → Deploy manually.
2. Drag this whole folder onto the page. Done.

## Structure
```
index.html          page markup
css/style.css       design tokens + all styles
js/main.js          nav, reveals, parallax, gallery filter, lightbox
assets/img/*.webp   optimized photos (-sm = small variants)
assets/favicon.svg  text-based "H" favicon (not an official logo)
netlify.toml        publish + cache headers
robots.txt          blocks crawlers while this is a concept
```

## Before showing publicly
- The site is set to `noindex` (meta tag in index.html + robots.txt). Remove both only after the restaurant approves a public launch.
- Set an absolute `og:image` URL once you have a domain.

## To verify with the restaurant
- Phone numbers, opening hours, address and the Google Maps listing (directions and map use a text search for "Hyatts Restaurant Mandian Abbottabad").
- Permission to use their photographs.
- The rooftop signage in several photos reads "Roof Top Majlis". Confirm whether the rooftop is branded separately.
- Current menu, prices, celebration arrangements and any social media accounts (none are linked).
