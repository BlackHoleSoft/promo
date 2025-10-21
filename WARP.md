# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Russian-language web application called "Генератор координат" (Coordinate Generator) that generates random geographical coordinates within specified parameters. The app can generate either random points or find points near attractions using OpenStreetMap data.

## Architecture

- **Single-page application**: All functionality contained in `index.html`
- **Frontend-only**: Pure HTML, CSS, and vanilla JavaScript - no build system or dependencies
- **Mapping**: Uses Leaflet.js library for interactive maps
- **External APIs**: 
  - OpenStreetMap tiles for map display
  - Overpass API (via Mail.ru proxy) for attraction data queries
  - Yandex Maps for external links

## Key Components

### Core Functions
- `getRandomGeoPoints()`: Generates random coordinates in a ring around a center point
- `getOsmAttractions()`: Queries Overpass API for nearby attractions (ruins, museums, parks, etc.)
- `getRandomOsmPoints()`: Combines random point generation with attraction finding
- `drawResults()`: Renders results and updates map markers

### User Interface
- Configuration inputs for center coordinates, distance ranges, point count
- Toggle for attraction-based vs. purely random generation
- Interactive map with markers for generated points
- Results display with Yandex Maps links

## Files Structure

```
promo/
├── index.html          # Main application file (HTML/CSS/JS)
├── leaflet.js          # Leaflet mapping library
├── leaflet.css         # Leaflet styles
├── images/             # Leaflet marker icons
│   ├── marker-icon.png
│   └── marker-shadow.png
└── README.md           # Basic project description
```

## Development

Since this is a static HTML application with no build process:

- **Run locally**: Open `index.html` directly in a web browser or serve via any web server
- **Testing**: Manual testing in browser (no automated test framework)
- **Debugging**: Use browser developer tools console for JavaScript debugging

## Language and Localization

- **Interface language**: Russian
- **Default coordinates**: Set to Nizhny Novgorod, Russia (56.326813, 44.006200)
- **External services**: Uses Russian-localized services (Mail.ru Overpass proxy, Yandex Maps)