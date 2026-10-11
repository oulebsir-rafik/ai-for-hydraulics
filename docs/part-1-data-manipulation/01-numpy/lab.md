---
sidebar_position: 2
title: Lab
---

import NotebookLinks from '@site/src/components/NotebookLinks';

# NumPy — Lab

*Week 1*

<NotebookLinks notebook="part-1-data-manipulation/01-numpy" />

Open the **Exercises** notebook in Colab (or download it and run it locally), replace every `...` with your code, and compare your results with the ✅ **Check** values given at the end of each exercise. No data file is needed: everything is defined or generated in the notebook.

## Exercises

| # | Exercise | NumPy skills | Lecture sections |
|---|---|---|---|
| 1 | Creating arrays | `linspace`, `full`, random generator | §2, §3 |
| 2 | Selecting data from a month of discharges | slicing, boolean masks, `flatnonzero` | §4 |
| 3 | Uniform flow in a trapezoidal channel | vectorization, Manning, Froude, `interp` | §5, §9 |
| 4 | A design table for several bed slopes | broadcasting, `argmax` along an axis, `any` | §6, §7 |
| 5 | Twenty years of monthly rainfall | aggregations by axis, anomalies, fancy indexing | §4, §7 |
| 6 | A flood hydrograph with missing data | NaN handling, `interp`, `trapezoid`, `diff` | §9, §10 |
| Bonus | How much faster is vectorization? | timing loops vs arrays | §1 |

### 1. Creating arrays

Build a grid of flow depths, a matching array of Manning coefficients, and a reproducible sample of random water temperatures.

### 2. Selecting data

From one month of daily discharges, extract periods, find the flood days with a boolean mask, count low-flow days and average a sub-period.

### 3. Uniform flow in a trapezoidal channel

For an irrigation canal, compute the area, wetted perimeter, hydraulic radius and Manning discharge for 40 depths **without any loop**. Then compute the velocity and the Froude number, and estimate the **normal depth** for a design discharge of 50 m³/s.

### 4. Broadcasting: a design table

Extend Exercise 3 to four bed slopes at once and build a depth × slope table of discharges. For each slope, find the smallest depth that carries the design discharge. One column hides a trap: `argmax` on an all-`False` column returns 0, not "not found".

### 5. Monthly rainfall statistics

On 20 years of synthetic Mediterranean rainfall, compute annual totals, find the wettest and driest years, the wettest month, the anomaly matrix, and the share of rain falling between October and March.

### 6. A flood hydrograph with missing data

A 72-hour hydrograph has sensor gaps. Count and fill them by interpolation. Then compute the peak, the time to peak, the total and direct-runoff volumes, the fastest rise and the duration above a threshold.

### Bonus: vectorization speed

Time a Python loop against the vectorized version on one million depths.
