---
sidebar_position: 1
title: Lecture
---

# NumPy — Lecture

*Week 1*

## Learning objectives

By the end of this chapter you will be able to:

- explain why NumPy arrays are preferred over Python lists for numerical work;
- create arrays and inspect their `shape`, `ndim` and `dtype`;
- select data with slicing, boolean masks and index arrays, and know when you get a **view** or a **copy**;
- write **vectorized** computations, such as evaluating Manning's equation for hundreds of flow depths without a loop;
- use **broadcasting** to build 2D tables (e.g. discharge as a function of depth *and* roughness);
- aggregate data along an axis (annual totals, monthly means, peaks);
- use the everyday tools of a hydraulic engineer: `np.where`, `np.interp`, `np.cumsum`, `np.diff`, `np.trapezoid`, and NaN-aware statistics.

## Key concepts

### 1. Why NumPy?

Engineering data is mostly **numbers in bulk**: water levels every 15 minutes, discharges for 30 years, cross-section coordinates, pressures at every node of a network. Plain Python lists can store them, but they are slow and awkward to compute with:

```python
depths = [0.5, 1.0, 1.5, 2.0]
widths = [4.0, 4.0, 4.0, 4.0]

areas = [d * w for d, w in zip(depths, widths)]   # loop needed
print(areas)    # [2.0, 4.0, 6.0, 8.0]
```

With NumPy, the operation is written exactly like the formula:

```python
import numpy as np

d = np.array(depths)
w = np.array(widths)
print(d * w)    # [2. 4. 6. 8.]
```

A NumPy array (`ndarray`) is a block of memory holding values of **one single type** (e.g. 64-bit floats). Because of that, operations run in compiled C code instead of the Python interpreter. On one million depths, `5 * y` is typically **tens of times faster** than the equivalent list comprehension. Speed is nice, but the main gain is **readability**: the code looks like the equation in your hydraulics textbook.

NumPy is also the foundation of everything that follows in this course: pandas (Part 1), scikit-learn (Part 2) and most scientific Python libraries are built on top of NumPy arrays.

:::tip[Convention]
NumPy is always imported as `np`: `import numpy as np`. You will see this in every tutorial, documentation page and Stack Overflow answer.
:::

### 2. Creating arrays

| Function | Example | Result |
|---|---|---|
| `np.array(list)` | `np.array([12.5, 14.1, 13.8])` | `[12.5 14.1 13.8]` |
| `np.arange(start, stop, step)` | `np.arange(0, 10, 2)` | `[0 2 4 6 8]` (stop excluded) |
| `np.linspace(start, stop, num)` | `np.linspace(0, 3, 7)` | `[0. 0.5 1. 1.5 2. 2.5 3.]` (stop included) |
| `np.zeros(n)`, `np.ones(shape)` | `np.ones((2, 3))` | 2×3 array of ones |
| `np.full(n, value)` | `np.full(4, 0.025)` | `[0.025 0.025 0.025 0.025]` |

:::tip[`arange` or `linspace`?]
Use `np.linspace` when you know **how many points** you want between two values (e.g. 50 depths between 0 and 3 m). Use `np.arange` for integer steps (e.g. years). With decimal steps, `arange` can surprise you because of floating-point rounding.
:::

**Random numbers** are useful to generate synthetic data and, later, to split datasets for machine learning. The modern API uses a *generator* with a fixed seed so that results are reproducible:

```python
rng = np.random.default_rng(0)            # seed = 0 → same numbers every run
print(rng.normal(50, 10, size=5).round(2))  # mean 50, std 10
# [51.26 48.68 56.4  51.05 44.64]
print(rng.integers(0, 100, size=5))
# [64 91 50 60 97]
```

### 3. Array attributes

Every array knows its own structure:

```python
Q = np.array([[12.1, 15.3,  9.8],
              [11.4, 14.9, 10.2]])   # 2 days × 3 gauging stations

Q.shape   # (2, 3)  → 2 rows, 3 columns
Q.ndim    # 2       → number of dimensions (axes)
Q.size    # 6       → total number of values
Q.dtype   # float64 → type of the values
```

The **shape** is the first thing to check when something goes wrong. Most NumPy errors are shape errors.

The **dtype** is set when the array is created. `np.array([1, 2, 3])` gives `int64`, and assigning `2.7` into it silently stores `2`:

```python
x = np.array([1, 2, 3])
x[0] = 2.7
print(x)    # [2 2 3]   ← truncated!
```

For measurements, create float arrays (`np.array([1.0, 2.0, 3.0])` or `dtype=float`).

### 4. Indexing and slicing

Take a flood hydrograph sampled every 3 hours (m³/s):

```python
q = np.array([3.2, 4.1, 8.7, 15.2, 22.4, 18.1, 11.0, 6.3])
```

**Positions and slices** work like Python lists (indices start at 0, the end of a slice is excluded):

```python
q[0]      # 3.2   first value
q[-1]     # 6.3   last value
q[2:5]    # [ 8.7 15.2 22.4]
q[::2]    # [ 3.2  8.7 22.4 11. ]  every second value
```

**Boolean masks** are the most useful selection tool for data analysis. A comparison gives an array of `True`/`False`, which can then be used as an index:

```python
q > 10            # [False False False  True  True  True  True False]
q[q > 10]         # [15.2 22.4 18.1 11. ]   values above 10 m³/s
np.flatnonzero(q > 10)   # [3 4 5 6]       their positions
```

Combine conditions with `&` (and), `|` (or) and `~` (not), **with parentheses**: `q[(q > 5) & (q < 20)]`.

**Index arrays** ("fancy indexing") pick arbitrary positions: `q[[0, 3, 7]]` returns `[ 3.2 15.2  6.3]`.

In **2D**, give one index per axis, separated by a comma (`row, column`):

```python
Q[0, 1]    # 15.3                 day 0, station 1
Q[:, 1]    # [15.3 14.9]          all days, station 1
Q[1]       # [11.4 14.9 10.2]     day 1, all stations
```

#### Views and copies

A **slice is a view**: it shares memory with the original array. Modifying it modifies the original.

```python
s = q[2:5]
s[0] = -1
print(q)   # [ 3.2  4.1 -1.  15.2 22.4 18.1 11.   6.3]   ← q changed!
```

If you want an independent array, ask for a copy: `s = q[2:5].copy()`. Boolean and fancy indexing always return copies.

### 5. Vectorized operations

Arithmetic operators (`+ - * / **`) and mathematical functions (`np.sqrt`, `np.exp`, `np.log`, `np.sin`, …) apply **element by element**. These functions are called *universal functions* (ufuncs). Writing computations this way, without explicit loops, is called **vectorization**.

**Example: uniform flow in a trapezoidal channel.** Manning's equation gives the discharge:

$$
Q = \frac{1}{n} \, A \, R_h^{2/3} \, S^{1/2}, \qquad R_h = \frac{A}{P}
$$

For a trapezoidal section of bottom width $b$, side slope $m$ (horizontal : vertical) and flow depth $y$:

$$
A = (b + m\,y)\,y, \qquad P = b + 2\,y\sqrt{1 + m^2}
$$

The NumPy version is a direct translation, and it works for **one depth or a thousand depths** without changing a line:

```python
def manning_Q(A, P, n, S):
    """Uniform-flow discharge (m³/s) from Manning's equation."""
    R = A / P
    return (1 / n) * A * R ** (2 / 3) * np.sqrt(S)

b, m, n, S = 5.0, 2.0, 0.025, 0.001     # m, -, s/m^(1/3), m/m
y = np.array([0.5, 1.0, 1.5, 2.0, 2.5])  # flow depths (m)

A = (b + m * y) * y                 # [ 3.  7. 12. 18. 25.]
P = b + 2 * y * np.sqrt(1 + m**2)   # [ 7.236  9.472 11.708 13.944 16.18 ]
manning_Q(A, P, n, S).round(2)      # [ 2.11  7.24 15.43 26.99 42.26]
```

:::info[Rule of thumb]
If you are writing a `for` loop over the values of an array, there is almost always a vectorized way to do it.
:::

### 6. Broadcasting

Operations between arrays of the **same shape** are element-wise. **Broadcasting** is the set of rules that lets NumPy combine arrays of *different* shapes, by virtually stretching dimensions of size 1:

1. Compare shapes from the **right** (last axis first).
2. Two dimensions are compatible if they are **equal** or one of them is **1**.
3. A dimension of size 1 is stretched to match the other.

The simplest case is an array and a scalar (`2 * y`): the scalar is stretched to the shape of the array.

The powerful case is a **column** (shape `(5, 1)`) combined with a **row** (shape `(1, 3)`), which produces a full **table** (shape `(5, 3)`). Let's compute the discharge for 5 depths × 3 roughness coefficients (smooth concrete, earth channel, weedy channel) in one expression:

```python
n_values = np.array([0.015, 0.025, 0.035])

Q_table = manning_Q(A[:, np.newaxis],          # shape (5, 1)
                    P[:, np.newaxis],          # shape (5, 1)
                    n_values[np.newaxis, :],   # shape (1, 3)
                    S)
Q_table.shape     # (5, 3)
Q_table.round(1)
# [[ 3.5  2.1  1.5]
#  [12.1  7.2  5.2]
#  [25.7 15.4 11. ]
#  [45.  27.  19.3]
#  [70.4 42.3 30.2]]
```

Each row is a depth, each column a roughness. `np.newaxis` (or `None`) inserts a new axis of size 1. `A[:, np.newaxis]` turns a 1D array into a column.

:::warning[Shape errors]
`ValueError: operands could not be broadcast together with shapes (5,) (3,)` means the rules above failed. Print the shapes of your operands and add `np.newaxis` where needed.
:::

### 7. Aggregations along an axis

Reduction functions (`sum`, `mean`, `std`, `min`, `max`, `argmin`, `argmax`, …) summarize an array. Without an argument they reduce the **whole** array. With `axis=` they reduce along **one** axis:

- `axis=0` collapses the **rows** → one result per column;
- `axis=1` collapses the **columns** → one result per row.

Consider monthly rainfall (mm) for 5 years, stored as a 5×12 array (one row per year):

```python
rng = np.random.default_rng(1)
rain = rng.gamma(2.0, 25.0, size=(5, 12)).round(1)

rain.sum(axis=1)    # annual totals, shape (5,)   → [564.2 520.2 463.7 505.  632.5]
rain.mean(axis=0)   # mean of each month, shape (12,)
rain.max()          # 148.5   wettest month of the whole record
np.unravel_index(rain.argmax(), rain.shape)   # (1, 4) → year 1, May
```

`argmax` returns the position in the *flattened* array. `np.unravel_index` converts it back to (row, column).

Aggregations combine naturally with broadcasting. The **anomaly** of each month (deviation from its long-term mean) is one line:

```python
anomaly = rain - rain.mean(axis=0)   # (5, 12) - (12,) → (5, 12)
```

### 8. Reshaping and combining

| Operation | Example | Result shape |
|---|---|---|
| Reshape | `np.arange(12).reshape(3, 4)` | `(3, 4)` |
| Let NumPy infer one dimension | `a.reshape(-1, 6)` | `(2, 6)` |
| Transpose | `a.reshape(3, 4).T` | `(4, 3)` |
| Flatten | `M.ravel()` | 1D |
| Join along an existing axis | `np.concatenate([a, b])` | `(4,)` for two `(2,)` arrays |
| Stack along a new axis | `np.stack([a, b])` | `(2, 2)` |
| Arrays as columns | `np.column_stack([y, A])` | `(5, 2)` |

A typical use is `reshape(-1, 24)` to turn a year of **hourly** values into a (days × 24) table and compute daily statistics with `axis=1`.

### 9. Everyday functions for hydraulic data

**Conditional values: `np.where`**

```python
np.where(q > 10, "high", "low")
# ['low' 'low' 'low' 'high' 'high' 'high' 'high' 'low']
```

**Bounding values: `np.clip`**, e.g. physically impossible negative depths from a sensor:

```python
np.clip(np.array([-0.2, 1.5, 3.8]), 0, 3)   # [0.  1.5 3. ]
```

**Cumulative sums and differences: `np.cumsum`, `np.diff`**

```python
rain_daily = np.array([0, 5, 12, 3, 0])
np.cumsum(rain_daily)                        # [ 0  5 17 20 20]  cumulative rainfall
np.diff(np.array([1.2, 1.5, 2.1, 1.9]))      # [ 0.3  0.6 -0.2]  water level changes
```

`np.diff` returns one value fewer than its input.

**Linear interpolation: `np.interp`**: reading a **rating curve** (stage → discharge) between measured points:

```python
h_rating = np.array([0.0, 0.5, 1.0, 1.5, 2.0])     # stage (m), must be increasing
Q_rating = np.array([0.0, 2.1, 6.8, 13.5, 22.0])   # discharge (m³/s)

np.interp(1.2, h_rating, Q_rating)            # 9.48
np.interp([0.25, 1.75], h_rating, Q_rating)   # [ 1.05 17.75]
```

**Numerical integration: `np.trapezoid`**: the **volume** of a flood is the area under the hydrograph:

$$
V = \int Q(t)\,dt \approx \sum_i \frac{Q_i + Q_{i+1}}{2}\,\Delta t
$$

```python
t = np.arange(0, 25, 3) * 3600.0     # time in seconds (every 3 h, over 24 h)
Qh = np.array([5, 9, 24, 41, 33, 21, 13, 8, 6], dtype=float)  # m³/s

V = np.trapezoid(Qh, t)               # 1 668 600 m³ ≈ 1.67 hm³
V_direct = np.trapezoid(Qh - 5.0, t)  # ≈ 1.24 hm³ above a 5 m³/s baseflow
```

:::note
In NumPy versions before 2.0 this function was called `np.trapz`. You will still find the old name in older code.
:::

### 10. Missing values (NaN)

Gauging records always have gaps: a sensor failure, a station destroyed by a flood. NumPy represents a missing float with `np.nan` (*Not a Number*). NaN **propagates**: any computation involving it returns NaN.

```python
g = np.array([4.2, 4.5, np.nan, 5.1, np.nan, 4.8])

g.mean()              # nan        ← one missing value spoils the result
np.nanmean(g)         # 4.65       ← ignore NaN
np.isnan(g).sum()     # 2          number of missing values
```

`np.nanmean`, `np.nansum`, `np.nanmax`, `np.nanstd`… ignore NaN. To **fill** short gaps, interpolate from the valid neighbours:

```python
idx = np.arange(g.size)
ok = ~np.isnan(g)
filled = g.copy()
filled[~ok] = np.interp(idx[~ok], idx[ok], g[ok])
# [4.2  4.5  4.8  5.1  4.95 4.8 ]
```

:::warning
Never test for missing values with `g == np.nan`: NaN is not equal to anything, **not even itself**. Always use `np.isnan`.
:::

### 11. Common pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Integer array receives floats | values silently truncated | create arrays with `dtype=float` |
| Modifying a slice | original data changed | `.copy()` |
| `and` / `or` on arrays | `ValueError: The truth value of an array … is ambiguous` | use `&`, `\|`, `~` with parentheses |
| Comparing floats with `==` | `0.1 + 0.2 == 0.3` is `False` | `np.isclose(a, b)` |
| Shapes don't match | `operands could not be broadcast together` | print `.shape`, add `np.newaxis` |
| NaN in data | statistics return `nan` | `np.nan*` functions, `np.isnan` |

## Further reading

- [NumPy: the absolute basics for beginners](https://numpy.org/doc/stable/user/absolute_beginners.html) — official tutorial.
- [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — the rules, with diagrams.
- [Indexing on ndarrays](https://numpy.org/doc/stable/user/basics.indexing.html) — views, copies, boolean and fancy indexing.
- J. VanderPlas, *Python Data Science Handbook*, chapter 2 "Introduction to NumPy" — [free online](https://jakevdp.github.io/PythonDataScienceHandbook/).
- V. T. Chow, *Open-Channel Hydraulics* (1959) — the reference for Manning's equation and roughness coefficients used in the examples.
