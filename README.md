# Valuation Reality Lab

A GitHub Pages-ready finance lab for comparing CAPE, CAPE-H / TR CAPE, S&P drawdowns, and future real returns.

## What this package includes

- `index.html` - single-page lab interface
- `css/styles.css` - responsive Saint Leo-style design
- `js/app.js` - workbook parser, calculations, and Plotly charts
- `data/` - reserved for optional course data files
- `assets/` - reserved for logos or course images

## How to deploy on GitHub Pages

1. Create a new GitHub repository, for example `valuation-reality-lab`.
2. Upload all files from this folder into the repository root.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from branch**.
5. Select the `main` branch and `/root` folder.
6. Open the GitHub Pages URL.
7. In the page, upload `ie_data.xlsx` using the workbook loader.

## Data workflow

The page reads Robert Shiller's workbook locally in the browser using SheetJS. No server or backend is required. This avoids API keys, hosting costs, and data privacy issues.

Expected Shiller columns include:

- Date
- S&P Price
- Dividend
- Earnings
- CPI
- Date fraction
- Long interest rate GS10
- Real Price
- Real Dividend
- Real Total Return Price
- Real Earnings
- Real Total Return Scaled Earnings
- CAPE
- TR CAPE, used in the lab as CAPE-H / TR CAPE
- Excess CAPE Yield
- 10-year forward return fields, where available

## Instructor framing

The key lesson is that valuation may be more useful for forming long-run expected return expectations than for predicting the timing of downturns. Students should compare elevated CAPE regimes with subsequent drawdowns and forward returns.

## Notes

This tool is for educational use only and is not investment advice.
