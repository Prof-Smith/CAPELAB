# Valuation Reality Lab, CAPE-only downside-fix version

This version fixes the latest-observation downside card.

## Key fix

For the latest observation, a realized 10-year max drawdown cannot be calculated because the future is not observable. The app now returns unavailable for incomplete forward horizons and then estimates the downside card from historical months with similar CAPE levels. The card is titled **10Y Forward Downside Estimate** to avoid implying that the value is realized.

## Deploy

Upload all files to the root of your GitHub repository and commit. GitHub Pages will update from the same Pages settings.
