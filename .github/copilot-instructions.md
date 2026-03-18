# B-zierCurveLab: Copilot Instructions

## Project Overview

**Interactive Tech Lab** — A personal portfolio site showcasing deep-dive, interactive explorations of complex math and graphics concepts (Bézier curves, procedural terrain generation). Each topic is a progressive, slide-based lesson with embedded canvas visualizations and interactive controls.

- **Tech Stack**: Vanilla JS, HTML5, Tailwind CSS, Chart.js
- **Architecture**: Single-page apps with sidebar navigation and step-by-step lesson progression
- **Key Metric**: Pedagogical clarity via interactive demos, not feature richness

---

## Core Architecture Patterns

### 1. **Slide-Based Navigation System** ([script.js](../script.js), [terrain-generation.html](../pages/terrain-generation.html))

Each lesson page uses a custom **step progression** model instead of traditional routing:

- **`stepConfig`** object defines total steps per section + next section link  
- **`currentSteps`** tracks user position within each section  
- **`switchSection(id)`**: Hides all sections, shows one, resets its steps, triggers canvas re-renders  
- **`handleNextStep(sectionId)`**: Increments step, reveals nested step elements via `id = '${sectionId}-step-${n}'`, updates button text

**Pattern**: HTML sections contain nested hidden step divs. Navigation never reloads—just DOM visibility toggling + `animate-fade-in` CSS class.

```js
// Rendering triggered on section switch
if (id === 'pure-random') requestAnimationFrame(() => drawStatic('canvas-pure-random'));
if (id === 'smoothing') requestAnimationFrame(() => drawSmooth('canvas-smoothing'));
```

---

### 2. **Canvas Rendering & Algorithms** ([script.js](../script.js))

All visualizations use **2D Canvas API** with performance-focused patterns:

- **Pixel Buffering**: `Uint32Array` views of ImageData for fast bulk pixel writes  
  ```js
  const buffer = new Uint32Array(imgData.data.buffer);
  buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;  // ARGB packed
  ```

- **Perlin Noise**: Full implementation included (permutation table `perm`, `fade()`, `grad()`, multi-octave FBM)  

- **Interactive Canvases**: 
  - Use `cDg()` helper for drag-to-move control points  
  - Use `requestAnimationFrame` for smooth animations  
  - Store control point arrays in `pt0`, `pt1`, `pt2`, `pt3` variables  

**When adding visualizations**: Always re-render on data change and use requestAnimationFrame to avoid blocking.

---

### 3. **Step Visibility Pattern**

Each page section has sub-steps revealed progressively. Steps are hidden initially via inline `display: none` or `.step-hidden` class:

```html
<div id="section-step-1" class="...">Always visible</div>
<div id="section-step-2" class="step-hidden">Revealed by handleNextStep</div>
```

**Naming convention**: Must match `${sectionId}-step-${n}` exactly for auto-discovery in `handleNextStep()`.

---

## File Structure & Responsibilities

| File | Purpose | Key Notes |
|------|---------|-----------|
| [index.html](../index.html) | Landing page, project grid | Tailwind + hardcoded "coming soon" 3rd card |
| [pages/bezier-curves.html](../pages/bezier-curves.html) | 7-section Bézier deep-dive | 500+ lines; embedded `<script>` with canvas init fns |
| [pages/terrain-generation.html](../pages/terrain-generation.html) | 10-section Perlin/FBM walkthrough | 469 lines; references [script.js](../script.js) for shared algos |
| [script.js](../script.js) | Global canvas algorithms, step logic | 300+ lines; Perlin noise, FBM, De Casteljau, chart updates |
| [css/styles.css](../css/styles.css) | Global reusable styles | Scrollbars, animations, canvas containers |

---

## Developer Workflows

### Running Locally
- **Server**: Uses **Live Server** (port 5501, configured in `.vscode/settings.json`)  
  ```sh
  # In VS Code, click "Go Live" or
  python -m http.server 5500
  ```
- Open `http://localhost:5501`

### Adding a New Lesson Page
1. Create `pages/new-topic.html` using existing page as template  
2. Define `stepConfig` entry in [script.js](../script.js) for section progression  
3. Implement canvas functions (e.g., `drawNewViz()`, `renderNewAlgo()`)  
4. Link from [index.html](../index.html) project grid  

### Updating Navigation Flow
- Modify `stepConfig` in [script.js](../script.js) (total steps, next section, button texts)  
- Update corresponding HTML step IDs: `${sectionId}-step-1`, `${sectionId}-step-2`, etc.

---

## Common Patterns & Conventions

### Canvas Drawing Helpers
```js
dPt(ctx, point, color, size)          // Draw circle at (x,y)
dLn(ctx, p0, p1, color, width, dash)  // Draw line
lrp(a, b, t)                          // Linear interpolation
eBz(pts, t)                           // Evaluate Bézier at parameter t
```

### Section Rendering Triggers
Only render canvas on section visibility change to avoid unnecessary redraws:
```js
if (id === 'fbm-mixer') renderFBMCompareRefs();  // In switchSection()
```

### Chart.js Integration
- FBM mixer uses Chart.js for waveform visualization  
- Charts are destroyed/recreated on section switch (not updated live)  
- No legends on interactive charts for cleaner UI

### Color Schemes
- **Bézier pages**: Blue (#2563eb) accents, slate grays  
- **Terrain pages**: Orange (#ea580c) accents, stone/warm grays  
- Tailwind color classes used throughout (no custom color codes except in canvas)

---

## Algorithm Implementations to Preserve

Do **NOT** simplify or refactor these—they are pedagogically intentional:

1. **De Casteljau (Bezier-curves.html embedded)**: Shows nested Lerp visually as layers of interpolation  
2. **Perlin Noise (script.js)**: Full 3D gradient implementation with permutation table; used for terrain  
3. **FBM (Fractal Brownian Motion)**: Multi-octave summation in `fbm()` function  

These are teaching tools. Clarity of the algorithm structure > micro-optimizations.

---

## Known Limitations & Design Notes

- **Static Content**: Lesson flow is hardcoded (no data-driven lessons yet)  
- **No Cross-Page State**: Each page is fully independent (no global lesson progress)  
- **Canvas Size**: Responsive widths but fixed aspect ratios; resize detection via parent `getBoundingClientRect()`  
- **Bezier Bounding Box**: Uses quadratic formula solving to find extrema—works but assumes cubic curves only  

---

## Testing & Validation

- **Manual**: Open each lesson page, click through steps, drag control points  
- **Visual Regression**: No automated tests; visually compare canvas outputs across browsers  
- **Performance**: Monitor frame rate on FBM visualization (should sustain 60 FPS on modern devices)

---

## Common Extension Points

### Adding Interactivity to a Lesson
Use the `cDg()` drag helper:
```js
const pts = [{x: w*0.2, y: h*0.5}, ...];
cDg(canvas, pts, () => redrawCanvas());  // Redraw on drag
```

### Adding a New Noise Type
Implement in [script.js](../script.js), export as `window.newNoise()`, call from section's canvas handler.

### Customizing Button Flow
Extend `stepConfig` with more button texts or conditional next-section logic in `handleNextStep()`.

