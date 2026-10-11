---
sidebar_position: 2
title: Lab
---

import NotebookLinks from '@site/src/components/NotebookLinks';

# Python Refresher — Lab

*Pre-course reading*

<NotebookLinks notebook="part-1-data-manipulation/00-python-refresher" />

Open the **Exercises** notebook in Colab (or download it and run it locally), replace every `...` with your code, and compare your results with the ✅ **Check** values given at the end of each exercise. Use **plain Python only**: NumPy comes in Week 1.

:::tip[Before you finish]
Run `Runtime → Restart and run all`. If the notebook runs from top to bottom without errors and your values match the checks, you're ready for Week 1.
:::

## Exercises

| # | Exercise | Python skills | Lecture sections |
|---|---|---|---|
| 1 | Flow in a pipe | variables, arithmetic, f-strings, `if` / `elif` | §2, §4 |
| 2 | A month of rainfall | lists, comprehensions, `for` loops with counters | §3, §4 |
| 3 | Gauging stations | dictionaries, list of dicts, `max` with `key` | §3, §5 |
| 4 | Flow regimes along a spillway | functions, default arguments, tuple unpacking | §5 |
| 5 | Friction losses in a pipe | iterative solution, returning several values | §4, §5 |
| 6 | Cleaning sensor readings | `try` / `except`, raising `ValueError` | §6 |
| 7 | Saving the clean data | reading and writing files with `with` | §8 |

### 1. Flow in a pipe

Compute the flow area, velocity and Reynolds number of a pipe flow, print them with their units, and classify the flow as laminar, transitional or turbulent.

### 2. A month of rainfall

From a month of daily rainfall, compute the total and the wettest day, count the rainy days, and find the longest dry spell.

### 3. Gauging stations

Add the specific discharge (L/s/km²) to a list of station records, find the station with the largest value, sum the catchment areas, and build a lookup table by station code.

### 4. Flow regimes along a spillway

Write `froude()` and `regime()` functions, then classify measured sections from the upstream channel to the stilling basin.

### 5. Friction losses in a pipe

Solve the implicit Colebrook–White equation by fixed-point iteration, compare it with the explicit Swamee–Jain formula, and compute the Darcy–Weisbach head loss.

### 6. Cleaning sensor readings

Turn a messy text export from a water-level logger into clean numbers, rejecting missing, erroneous and physically impossible values.

### 7. Saving the clean data

Write the cleaned readings to a text file and read them back.
