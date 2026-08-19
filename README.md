# Valuation Reality Lab, CAPE-only date-fixed version

This GitHub Pages package reads Robert Shiller's `ie_data.xlsx` locally in the browser and visualizes CAPE, drawdowns, and forward returns.

## Important fix

The Shiller workbook's `Date` column uses a `year.month` convention. For example, `2026.08` means August 2026. Earlier versions treated this as a decimal year, which caused August 2026 to display around February 2026. This version fixes that parser.

## Deploy

Upload these files to the root of a GitHub repository and enable GitHub Pages from `main` branch `/root`.
