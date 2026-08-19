# Valuation Reality Lab

**Created by:** Zachary A. Smith, Ph.D. | Associate Professor of Economics and Finance

## Overview

The **Valuation Reality Lab** is an interactive GitHub Pages-based finance learning activity that helps students explore the relationship between the CAPE ratio, market drawdowns, and forward real returns. The lab is designed to move students beyond the simple statement that “valuations are high” and toward a more careful understanding of what valuation measures can and cannot tell investors.

The central lesson of the lab is that **CAPE is not a crash predictor**. Instead, CAPE is a valuation tool that can help investors think about long-run expected returns, valuation risk, and the discipline required when markets appear expensive relative to smoothed earnings. The exercise encourages students to distinguish between three related but different concepts: high valuation, future return expectations, and the timing of market declines.

## Learning Purpose

This lab was built to support applied finance instruction by giving students a visual, evidence-based way to examine valuation history. Students can upload Robert Shiller’s historical market data workbook, analyze CAPE levels through time, compare elevated valuation regimes with subsequent market drawdowns, and review forward return patterns across different historical periods.

The lab is especially useful for discussions about:

- Market valuation
- CAPE and cyclically adjusted earnings
- Long-run expected returns
- Market timing limitations
- Drawdown risk
- Historical analog analysis
- Value investing discipline
- Decision-making under uncertainty

## Core Lesson

> **CAPE is not a crash predictor.** CAPE is a valuation tool that helps investors think about long-run expected returns, valuation risk, and the discipline required when prices are high relative to smoothed earnings.

A high CAPE may suggest that future long-run returns could be lower than usual, but it does not tell investors exactly when a downturn will occur. Markets can remain expensive for extended periods. The lab is designed to help students see this tension directly through the data.

## What CAPE Measures

CAPE stands for **cyclically adjusted price-to-earnings ratio**. It compares the current level of the market with inflation-adjusted earnings averaged over the previous ten years. The purpose of the ten-year earnings average is to smooth out unusually strong or unusually weak earnings years and provide a longer-term perspective on valuation.

In the lab, students use CAPE to evaluate whether the market is trading at levels that are historically inexpensive, normal, expensive, or extreme.

## What Students Can Do in the Lab

Students can use the dashboard to:

1. **Load Shiller market data**  
   Students upload the `ie_data.xlsx` workbook. The data are processed locally in the browser.

2. **View current CAPE statistics**  
   The dashboard displays the latest CAPE value, CAPE percentile, historical median CAPE, maximum CAPE, and latest available date.

3. **Explore CAPE through time**  
   Students can view the historical CAPE series and use a threshold slider to highlight periods when CAPE exceeded selected levels.

4. **Compare CAPE with market drawdowns**  
   The drawdown chart helps students visually compare valuation levels with later market declines.

5. **Analyze forward real returns**  
   Students can examine how starting CAPE levels relate to subsequent ten-year real returns.

6. **Use historical scenarios**  
   The scenario selector allows students to examine important valuation periods, such as 1929, 2000, 2007, 2020, 2021, and the latest observation.

7. **Compare realized outcomes with estimates**  
   For historical scenarios with enough subsequent data, the lab reports realized forward returns. For the latest observation, where future outcomes are not yet observable, the lab reports historical analog estimates based on similar CAPE regimes.

8. **Download cleaned data**  
   Students can export a cleaned CSV version of the processed dashboard data.

## Key Dashboard Sections

### 1. Instructor Note

The lab begins with a student-facing note explaining why valuation matters, why directional market forecasts are difficult, and why CAPE should be interpreted as a valuation-risk tool rather than a precise timing signal.

### 2. Core Lesson

A short highlighted section reinforces the main teaching point: CAPE is not a crash predictor.

### 3. How to Read This Dashboard

Students are guided through a step-by-step workflow:

1. Start with the current CAPE level and percentile.
2. Use the CAPE threshold slider to identify similar valuation periods.
3. Compare valuation with later drawdowns.
4. Review forward returns.
5. Make an investment decision based on evidence.

### 4. Historical Analog Caution

The lab explains that historical analog estimates are not forecasts. They summarize what happened after past periods with similar CAPE levels and should be treated as base-rate evidence, not predictions.

### 5. CAPE Through Time

This chart shows the history of CAPE and highlights months above the selected CAPE threshold.

### 6. S&P Drawdown Explorer

This chart shows market drawdowns calculated from the real total return price series when available, otherwise from real price.

### 7. CAPE and Future Real Returns

This scatterplot explores the relationship between starting CAPE and subsequent ten-year real annualized returns.

### 8. Forward Return Profile

For historical scenarios, this section displays realized forward real returns. For the latest observation, it is labeled as a historical analog estimate because future returns cannot yet be observed.

### 9. Valuation Regime Summary

The lab summarizes forward return and downside patterns across CAPE ranges.

### 10. Student Decision Prompt

Students are asked to consider what they would do if CAPE is near the top of its historical range:

- Sell all equities
- Reduce equity exposure
- Continue dollar-cost averaging
- Ignore valuation

Students are expected to defend their answer using evidence from the dashboard.

## Plain-English Valuation Guide

The lab includes a valuation interpretation table:

| CAPE Range | Interpretation | Decision Question |
|---|---|---|
| Below 15 | Historically inexpensive | Is the market cheap because future fundamentals are impaired, or because investors are too pessimistic? |
| 15 to 25 | Normal to moderately elevated | Are expected returns reasonable for the risk being taken? |
| 25 to 35 | Expensive | What margin of safety remains if earnings disappoint? |
| Above 35 | Historically extreme | Should a disciplined investor reduce risk, rebalance, or simply lower future return expectations? |

## Technical Design

The lab is built as a static website that can be deployed through GitHub Pages. It uses:

- HTML for page structure
- CSS for styling and layout
- JavaScript for interactivity and calculations
- Plotly.js for charts
- SheetJS for reading Excel files in the browser

No backend server is required. The workbook is processed locally in the user’s browser.

## Data Source

The lab is designed to work with Robert Shiller’s `ie_data.xlsx` workbook. Students upload the workbook through the page interface. The app reads the worksheet, extracts the relevant market and valuation fields, and calculates dashboard metrics.

The date parser is designed for Shiller’s `year.month` date convention. For example:

```text
2026.08 = August 2026
```

This prevents the date from being incorrectly interpreted as a fractional year.

## Important Interpretation Notes

- CAPE is a valuation measure, not a precise timing tool.
- High CAPE may indicate lower expected long-run returns, but not necessarily an imminent crash.
- Historical analog estimates are not forecasts.
- Current-period forward returns cannot be realized because the future data do not exist yet.
- Scenario outputs should be interpreted as evidence for discussion, not investment advice.

## Suggested Classroom Use

This lab can be used as:

- A valuation lecture supplement
- A student self-guided activity
- A Canvas assignment
- A discussion prompt for market timing and expected returns
- A bridge between value investing, behavioral finance, and risk management

A suggested student prompt:

> It is the latest observation in the dataset. CAPE is near the top of its historical range. If you were managing a long-term portfolio, would you sell all equities, reduce equity exposure, continue dollar-cost averaging, or ignore valuation? Defend your answer using evidence from the dashboard.

## Deployment Instructions

1. Download the project ZIP file.
2. Unzip the folder.
3. Upload the contents to the root of a GitHub repository.
4. Enable GitHub Pages from the repository settings.
5. Open the published GitHub Pages link.
6. Upload `ie_data.xlsx` through the dashboard interface.

## Big Question

> If valuation is poor at timing crashes but useful for estimating long-run return pressure, how should a disciplined investor respond to historically expensive markets?

## Educational Disclaimer

This lab is for educational use only. It is not investment advice. The purpose of the exercise is to help students evaluate valuation evidence, historical market behavior, and decision-making under uncertainty.


