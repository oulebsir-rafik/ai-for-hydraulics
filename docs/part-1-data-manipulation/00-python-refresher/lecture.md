---
sidebar_position: 1
title: Lecture
---

# Python Refresher — Lecture

*Pre-course reading*

:::info[Read this before Week 1]
This chapter is a **refresher**, not a full introduction to programming. It assumes you have already written some Python (variables, loops, functions) and reviews everything the rest of the course relies on. Read it and complete the lab **before the first session**. If a section feels new, take the time to practise it: Week 1 (NumPy) builds directly on it.
:::

## Learning objectives

By the end of this chapter you will be able to:

- run Python code in a Jupyter notebook (Google Colab or local) and understand how cells and the kernel work;
- use the basic types (`int`, `float`, `str`, `bool`, `None`) and format results with units using f-strings;
- store data in lists, tuples and dictionaries, and choose the right one;
- control the flow of a program with `if`, `for` and `while`, including iterative solutions of implicit equations;
- write reusable functions with default and keyword arguments;
- read error messages, handle invalid data with `try` / `except`, and raise your own errors;
- import modules, install packages, and read/write simple text files.

## Key concepts

### 1. Working in a notebook

The course uses **Jupyter notebooks** (`.ipynb`): documents that mix text (Markdown cells) and executable code (code cells). Each lab page has an **Open in Colab** button that opens the notebook in Google Colab, a free notebook environment that runs in your browser. Nothing needs to be installed, and you only need a Google account.

| Action | Shortcut |
|---|---|
| Run the current cell and move to the next | `Shift + Enter` |
| Run the current cell and stay | `Ctrl + Enter` |
| Insert a cell below (command mode) | `B` (Colab: `Ctrl + M`, then `B`) |
| Show the documentation of a function | `help(print)` or `print?` |

Behind the notebook runs a **kernel**: a Python process that keeps every variable in memory. Two consequences matter:

- **Order matters, not position.** A cell uses whatever was run *before* it, in time. If you run cells out of order, or delete a cell that defined a variable, the notebook may work now and fail tomorrow.
- **Restart and run all** (`Runtime → Restart and run all` in Colab) is the only way to be sure a notebook works from top to bottom. Do it before submitting any work.

:::warning[Saving in Colab]
A notebook opened from the course's GitHub is a **temporary copy**. Use `File → Save a copy in Drive` to keep your work.
:::

The last expression of a cell is displayed automatically. Use `print()` to display anything else.

### 2. Variables, types and arithmetic

A variable is a name bound to a value. Python infers the type from the value:

```python
n_stations = 12            # int
Q = 0.05                   # float   (m³/s)
river = "Isser"            # str
is_flooding = False        # bool
gauge_offset = None        # NoneType: "no value yet"

type(Q)                    # <class 'float'>
```

Arithmetic operators:

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+ - *` | add, subtract, multiply | `2 * 3.5` | `7.0` |
| `/` | division (always a float) | `7 / 2` | `3.5` |
| `//` | integer division | `7 // 2` | `3` |
| `%` | remainder | `7 % 2` | `1` |
| `**` | power | `2 ** 10` | `1024` |

The `math` module provides the usual functions and constants: `math.sqrt`, `math.log` (natural log), `math.log10`, `math.exp`, `math.sin`, `math.pi`…

**Conversions** are explicit: `int("12")` → `12`, `float("3.5")` → `3.5`, `str(4.2)` → `"4.2"`. Data read from files or typed by a user is **text** until you convert it.

**Floats are approximations.** `(1.2 + 1.5 + 2.1 + 1.9 + 1.4) / 5` gives `1.6199999999999999`, not `1.62`. This is normal behaviour (binary floating point) and not a bug. Round only when displaying.

#### Formatting results: f-strings

An engineer never prints a bare number. Put the value **and its unit** in the output with an f-string: prefix the string with `f` and write expressions in braces.

```python
import math

Q = 0.05          # discharge (m³/s)
D = 0.3           # pipe diameter (m)
A = math.pi * D**2 / 4
V = Q / A

print(f"A = {A:.4f} m², V = {V:.2f} m/s")
# A = 0.0707 m², V = 0.71 m/s
```

The part after the colon is the **format spec**:

| Spec | Meaning | `f"{x:spec}"` with `x = 1234567.891` |
|---|---|---|
| `.2f` | 2 decimals | `1234567.89` |
| `,.1f` | thousands separator, 1 decimal | `1,234,567.9` |
| `.2e` | scientific notation | `1.23e+06` |
| `>10.2f` | right-aligned in 10 characters | useful for tables |

:::tip[Name your variables with their meaning (and unit)]
`Q_design_m3s`, `D_mm`, `t_hours` read better than `x`, `a2` or `val`. Unit mistakes, such as mm instead of m or hours instead of seconds, are the most common source of wrong results in engineering code.
:::

### 3. Collections: lists, tuples, dictionaries

#### Lists: ordered, modifiable sequences

```python
levels = [1.2, 1.5, 2.1, 1.9, 1.4]    # water levels (m)

levels[0]          # 1.2      first item (indices start at 0)
levels[-1]         # 1.4      last item
levels[1:3]        # [1.5, 2.1]   slice: start included, end excluded
len(levels)        # 5
max(levels), min(levels), sum(levels)

levels.append(1.1)                 # add at the end
sorted(levels, reverse=True)       # new sorted list; levels unchanged
```

Lists can hold anything, including other lists, but for numerical computations on many values you will use **NumPy arrays** (Week 1), which are faster and support math on whole arrays.

#### Tuples: fixed groups of values

A tuple is like a list that cannot be modified. It is used for values that belong together, such as coordinates or the results of a function:

```python
outlet = (36.55, 3.59)         # (latitude, longitude)
lat, lon = outlet              # unpacking
```

#### Dictionaries: values accessed by name

A dictionary maps **keys** to **values**. It is the natural structure for a record with named fields:

```python
station = {                  # illustrative values
    "code": "S01",
    "river": "Isser",
    "area_km2": 3600,
    "mean_Q": 7.2,           # m³/s
}

station["river"]                        # 'Isser'
station["mean_Q"] = 7.5                 # modify
station["elevation_m"] = 85             # add a new key
station.get("slope", "unknown")         # 'unknown': no error if the key is missing
for key, value in station.items():
    print(key, "→", value)
```

A **list of dictionaries** is a simple table, one dictionary per row. Pandas DataFrames (Week 2) generalize exactly this idea.

| Use a… | When |
|---|---|
| list | an ordered sequence of similar items you may modify |
| tuple | a small fixed group, e.g. a function returning several values |
| dict | named fields, or a lookup by key (station code → data) |
| set | unique items, fast membership test (`"S01" in codes`) |

### 4. Control flow

#### Conditions

Indentation (4 spaces) defines blocks. There are no braces or `end`.

```python
Fr = 0.9
if Fr < 1:
    regime = "subcritical"
elif Fr > 1:
    regime = "supercritical"
else:
    regime = "critical"
```

Comparisons: `==`, `!=`, `<`, `<=`, `>`, `>=`. Logical operators: `and`, `or`, `not`. Membership: `in`.

#### `for` loops

`for` iterates over any sequence. Three helpers cover most needs:

```python
for h in levels:                      # the values
    ...
for i in range(5):                    # 0, 1, 2, 3, 4
    ...
for day, h in enumerate(levels, start=1):   # counter + value
    print(f"day {day}: {h} m")
for h, Q in zip(stages, discharges):        # two sequences in parallel
    ...
```

Use `break` to leave a loop early and `continue` to skip to the next iteration.

#### List comprehensions

A compact way to build a list from another one, optionally with a filter:

```python
[round(h * 1.1, 2) for h in [1.2, 1.5, 2.1]]   # [1.32, 1.65, 2.31]
[h for h in levels if h > 1.5]                 # values above 1.5 m
```

#### `while` loops and iterative solutions

Many hydraulic equations are **implicit**: the unknown appears on both sides and has no closed-form solution. A `while` loop repeats a computation until it converges. The classic example is the **Colebrook–White** equation for the Darcy friction factor $f$ in a pipe:

$$
\frac{1}{\sqrt{f}} = -2 \log_{10}\!\left( \frac{\varepsilon / D}{3.7} + \frac{2.51}{Re\,\sqrt{f}} \right)
$$

Starting from a guess, recompute $f$ from the right-hand side until two successive values agree (*fixed-point iteration*):

```python
def colebrook(Re, rel_rough, f0=0.02, tol=1e-8, max_iter=100):
    """Darcy friction factor from Colebrook-White, by fixed-point iteration."""
    f = f0
    for iteration in range(1, max_iter + 1):
        f_new = (-2 * math.log10(rel_rough / 3.7 + 2.51 / (Re * math.sqrt(f)))) ** -2
        if abs(f_new - f) < tol:
            return f_new, iteration
        f = f_new
    raise RuntimeError("Colebrook did not converge")

colebrook(1e5, 0.0005)     # (0.020327..., 5)  → converged in 5 iterations
```

:::warning[Always cap the number of iterations]
An iteration that never converges, because of a typo or an unphysical input, freezes the notebook. Use a `for` loop with a maximum number of iterations (as above), or a `while` loop with a counter.
:::

### 5. Functions

A function packages a computation so you can reuse it, test it, and give it a name:

```python
def froude(V, h, g=9.81):
    """Froude number of a flow with mean velocity V (m/s) and depth h (m)."""
    return V / math.sqrt(g * h)

froude(2.0, 0.5)            # 0.903   positional arguments
froude(h=0.5, V=2.0)        # 0.903   keyword arguments, any order
froude(2.0, 0.5, g=9.8)     # override the default value
```

- **Default arguments** (`g=9.81`) make common cases short.
- **Keyword arguments** make calls self-explanatory, especially with many parameters.
- The **docstring** (the string under `def`) documents the function, including units. `help(froude)` displays it.
- A function can **return several values** as a tuple: `return f, iteration`, and the caller unpacks them with `f, n = colebrook(...)`.
- Variables created inside a function are **local**: they disappear when it returns. Pass inputs as arguments and get results with `return` rather than relying on global variables.

Functions can call other functions:

```python
def regime(Fr, tol=0.02):
    """Flow regime from the Froude number, with a tolerance around Fr = 1."""
    if Fr < 1 - tol:
        return "subcritical"
    elif Fr > 1 + tol:
        return "supercritical"
    return "critical"

regime(froude(2.0, 0.5))    # 'subcritical'
```

A **lambda** is a one-line anonymous function, mostly used as an argument, e.g. to sort a list of stations by area: `sorted(stations, key=lambda s: s["area_km2"])`.

### 6. Errors and exceptions

#### Reading a traceback

When something fails, Python prints a **traceback**. Read it **from the bottom up**: the last line gives the error type and message, and the lines above show where it happened.

```
Traceback (most recent call last):
  Cell In[12], line 3
    V = Q / A
ZeroDivisionError: float division by zero
```

| Error | Typical cause |
|---|---|
| `NameError` | variable not defined: typo, or the defining cell was not run |
| `TypeError` | wrong type, e.g. `"3.5" * 2.0` (text times number) |
| `ValueError` | right type, wrong value, e.g. `float("n/a")`, `math.sqrt(-1)` |
| `IndexError` | list index beyond the end |
| `KeyError` | dictionary key that does not exist |
| `ZeroDivisionError` | division by zero |
| `IndentationError` | inconsistent spaces |

#### Handling errors: `try` / `except`

Real data is messy. A field-sensor export may contain `"n/a"`, empty strings or `"ERR"`. Instead of crashing on the first bad value, catch the error and decide what to do:

```python
readings = ["12.3", "n/a", "14.1"]
values = []
for r in readings:
    try:
        values.append(float(r))
    except ValueError:
        print(f"skipping invalid reading: {r!r}")
```

Catch **specific** errors (`except ValueError`), never everything (`except:`), which would also hide your own bugs.

#### Raising errors

Your functions should refuse physically meaningless inputs rather than silently return nonsense:

```python
def flow_area_circular(D):
    if D <= 0:
        raise ValueError(f"diameter must be positive, got {D}")
    return math.pi * D**2 / 4
```

### 7. Modules and packages

Python's power comes from its libraries. `import` makes them available:

```python
import math                       # whole module: math.sqrt(...)
import numpy as np                # with an alias (standard convention)
from statistics import mean, median   # specific names
from datetime import datetime, timedelta
```

- The **standard library** comes with Python: `math`, `statistics`, `datetime`, `csv`, `pathlib`, `random`, `json`…
- **Third-party packages** (NumPy, pandas, matplotlib, scikit-learn…) are installed with `pip`. Colab already includes almost everything used in this course. To install one in a notebook, run `%pip install dataretrieval` in a cell. To work locally, use the course's `requirements.txt`: `pip install -r requirements.txt`.

### 8. Reading and writing files

Open files with a `with` block: the file is closed automatically, even if an error occurs.

```python
# write
with open("levels.txt", "w") as f:
    for h in [1.2, 1.5, 2.1]:
        f.write(f"{h}\n")

# read
with open("levels.txt") as f:
    levels = [float(line) for line in f if line.strip()]
```

Mode `"w"` overwrites the file, `"a"` appends to it, and `"r"` (the default) reads it. For CSV files the `csv` module handles separators and quotes, but from Week 2 on you will read tabular data with **pandas** in a single line (`pd.read_csv`).

:::note[Files in Colab]
Files written in Colab live on a temporary virtual machine and are **deleted** when the session ends. Download them, or mount your Google Drive, to keep them.
:::

### 9. Good practices

- **One idea per cell, one task per function.** Short functions with clear names are easier to test and reuse.
- **Units everywhere**: in variable names, docstrings and printed results. Convert once, at the boundary (e.g. read mm, convert to m immediately).
- **No magic numbers**: `g = 9.81` and `nu = 1.0e-6` defined once, with a comment, instead of literal values repeated in formulas.
- **Check results against physics**: a velocity of 300 m/s in a sewer pipe, or a negative depth, means a bug.
- Follow the [PEP 8](https://peps.python.org/pep-0008/) style: `snake_case` for variables and functions, 4-space indentation, spaces around operators.
- **Restart and run all** before you consider a notebook finished.

## Further reading

- [The official Python tutorial](https://docs.python.org/3/tutorial/), chapters 3 to 8, covers everything in this refresher in more depth.
- [Welcome to Colab](https://colab.research.google.com/notebooks/intro.ipynb): getting started with Google Colab.
- [Formatted string literals (f-strings)](https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals).
- [Errors and exceptions](https://docs.python.org/3/tutorial/errors.html).
- C. F. Colebrook (1939), "Turbulent flow in pipes, with particular reference to the transition region between the smooth and rough pipe laws", *Journal of the Institution of Civil Engineers*, 11(4), 133–156: the origin of the friction-factor equation used above.
