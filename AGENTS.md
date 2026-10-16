# AGENTS.md

Single-page Nuxt 3 portfolio/marketing site (Eduardo Martinez). One page built from section
components — no `pages/`, no router, no server/backend.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (hot reload).
- `npm run build` — `nuxt build` (Nitro server output in `.output/`).
- `npm run generate` — static build. `npm run preview` — preview a build.
- `npm install` triggers `postinstall` → `nuxt prepare` (regenerates `.nuxt/` types).
- **No test / lint / typecheck / format tooling exists.** Do not invent `npm test` or `npm run lint`.
  Verify changes by running the dev server and loading the page. There is no browser tool — a headless
  Chrome screenshot works for visual checks: `chrome --headless=new --screenshot=out.png --window-size=1600,1000 --virtual-time-budget=9000 http://localhost:3000/`
  (Chrome on this Windows box is at `C:\Program Files\Google\Chrome\Application\chrome.exe`).

## Architecture

- `app.vue` is the entire page: `<AppNavbar/> <HeroMarketing/> <GallerySection/> <HeroDeveloper/> <ProjectsSection/> <AppFooter/>`.
- Files in `components/` are auto-imported by Nuxt — do not write imports for them.
- Anchor navigation depends on these section ids and breaks if they change:
  `#hero-marketing`, `#galeria`, `#desarrollador`, `#proyectos`, `#contacto` (footer). Navbar + footer link to them.
- Global CSS is `assets/css/main.css`, wired through `css` in `nuxt.config.ts`. It defines the CSS-var
  palette (`--blue-*`, `--ink`, `--paper`), font tokens (`--font-display/serif/script/sans/mono`), and `--nav-h`.
- The global rule `main > section[id], section[id]` makes every section fill the viewport
  (`min-height:100svh`, flex column, `scroll-snap-align`). New sections inherit this. The navbar is
  `position: fixed`, so offset content by `--nav-h`. Note this selector outranks single-class selectors —
  override section padding with higher specificity than one class.
- Fonts load from Google Fonts via the `app.head.link` in `nuxt.config.ts`.

## Scroll-reveal (easy to miss)

`.reveal` starts at `opacity:0`; a single IntersectionObserver in `app.vue` (`onMounted`) adds `.visible`.
Any new element meant to animate in **must** carry `class="reveal"` or it stays invisible.

## Images (`@nuxt/image`)

- Keep images in `public/img/` and reference them as `/img/<file>` (`image.dir` defaults to `public`).
  `assets/img/` is only for images `import`ed into code, not for `<NuxtImg>`.
- Use `<NuxtImg>` (auto-imported). Optimized variants are served from `/_ipx/<mods>/img/<file>`.
- **Gotcha:** `sizes` must be screen-prefixed, e.g. `sizes="sm:100vw md:100vw lg:100vw xl:100vw"`.
  A bare `sizes="100vw"` is misparsed as a screen named by its pixel value and yields 1px-wide images.
  Screen keys (`xs sm md lg xl`) are set in `nuxt.config.ts`; `format` is forced to `webp`.
- `image.densities` cannot be narrowed via config — defu concatenates it onto the defaults `[1,2]`.
- **Hero exception:** `HeroMarketing.vue` uses plain `<img>` (not `<NuxtImg>`) with a srcset built by
  `useImage()` and `sizes` in `vh`. Nuxt Image generates the srcset from `screens × densities` and only
  accepts `vw` in `sizes` (any value not ending in `vw` is dropped, leaving the `<img>` with no `src` at
  all). The hero needs `vh` because `object-fit: cover` on a full-viewport box renders the (wider) photo
  at ~2× the viewport **height**; `100vw` under-requests badly on portrait screens (390×844 loaded a
  640px variant for a box needing ~1700px → 2.7× upscale). The preload is re-created via `useHead` with
  `imagesrcset`/`imagesizes`.

## HeroMarketing.vue

The complex component: an animated full-bleed hero. One photo is reused across **four** absolutely
positioned `<img class="bg-layer">` layers inside a `.bg-parallax` framing box (`inset: -3%`, overscan
margin only — there is **no** Ken Burns/scale, so the Jeep and the person stay pixel-fixed):

- `.layer-sky` — the opaque base. Deliberately has **no mask**: it covers the whole background so the
  section's blue gradient can never bleed through the sky/trees crossfade (that bleed was the diffuse
  blue line at mid-image).
- `.layer-trees` — the middle band. `mask-image: linear-gradient(180deg, transparent 32%, #000 45% 100%)`
  blends it over the sky; a `treesway` `skewX` with `transform-origin: 50% 100%` pushes the crowns
  right→left (a fast gust left, slow return) while the roots stay put. No `will-change` — promoting the
  layer makes Chrome rasterize it at a lower resolution and the trees look blurry.
- `.layer-trees-soft` — a **blurred copy of the same photo** (`filter: blur(1.5px)`), masked to
  `#000 0%, #000 41%, transparent 53%`: everything from the very top down to the upper crowns is out of
  focus and fades back to sharp by 53 % (depth of field — sky, mountains and crowns soft, trunks crisp).
  It shares the *exact* motion of `.layer-trees` (same `treesway` animation + same parallax `translate`)
  — if they ever drift apart the blur visibly detaches from the trunks.
- `.layer-fg` — static. `mask-image: linear-gradient(180deg, transparent 70%, #000 78% 100%)` fades the
  moving trees into this frozen copy so the wind never drags the Jeep, the person, the road or the snow.

`.fog-layer` holds three blurred (`filter: blur(26px)`, `mix-blend-mode: screen`) blobs that drift in
**one** direction (`fogdrift`, left→right — opposite the trees) and sit at the level just **above the
Jeep**: `top` 50/54/60 % with heights 30/26/20 %, so all three end at ~80 % of the hero while the Jeep
occupies 82–95 % (that mapping holds at every viewport because the photo is height-limited). Their
`--fog-o` is the drift peak, so `prefers-reduced-motion` leaves static haze instead of full opacity.
All motion is scoped keyframes and honors `prefers-reduced-motion`. Don't reorder the layers without
re-checking the mask seam and fog coverage.

Framing is pure CSS: `.bg-layer` `object-position` (`Y=100%` anchors the bottom of the shot, with
slightly larger X percentages per breakpoint to keep the Jeep in frame on narrow screens). Change those
to reframe. Background images are plain `<img>` with `sizes="210vh"` — see the Images section.

**3D depth (pointer parallax).** A rAF loop in `<script setup>` writes `--px`/`--py` (both −1…1) onto
the `<section>` from `pointermove`; the CSS turns those into a per-plane `translate` (the standalone
`translate` property, *not* `transform`, so it composes with the `treesway` animation): sky 5px, trees
12px, fog 7px, and `.layer-fg` deliberately has **none** — the Jeep/person/road stay anchored. The
speed difference between planes is what reads as depth. Keep the amplitudes small: the planes share the
crossfade masks, and past ~16px the tree/foreground seam starts to show as a double image. The listeners
only attach for `(hover: hover) and (pointer: fine)` and never under `prefers-reduced-motion`, so touch
devices and reduced-motion users get the perfectly aligned static frame (vars stay `0`).

**"Martinez" pen effect.** The cursive word is rendered as eight `<span class="letter">` (from
`const martinez = 'Martinez'.split('')`) so the ink can sweep across it. Pinyon Script loses **nothing**
when split: the rendered width is byte-identical to the whole word (620.421875 px at 1600×1000), so the
cursive joins stay continuous — verified, don't "optimise" it back into one string without re-checking.
The spans must also stay whitespace-free: a stray space would push the word apart.

Each letter reveals its ink with a `clip-path: inset(-70% 100% -70% 0)` → `inset(-70% 0 -70% 0)`
wipe (the −70 % vertical slack keeps the clip from shaving the strokes, which overflow the box at
`line-height: 1`). The wipes are chained — each letter's `animation-delay` is
`300ms + var(--from) * var(--write)` — and its duration is proportional to its advance width
(`--from`/`--dur` come from the `MARTINEZ_ADVANCE` table), so the pen moves at constant speed instead of
racing through the narrow letters. `--write` (1500ms on `.script`) is the total. Everything starts only
once the `h1` gets `.visible` (from the `.reveal` observer), so the title fades in first and the
signature is written after.

**Keep the shadow off the letters.** A `text-shadow` on the letters is clipped by their `clip-path` and
leaves a hard vertical edge across the background (verified). The shadow is therefore a
`filter: drop-shadow(...)` on `.script`: computed from the already-painted pixels, it follows the ink
with no ghost and no seams, and the letters set `text-shadow: none`. Watch the units —
`drop-shadow()`'s third value is the standard deviation while `text-shadow`'s is the blur radius (≈2×σ),
hence 3px/22px here where the old text-shadow had 6px/44px. The reduced-motion block just disables the
animation.

## Placeholder assets (not real content)

Everything except the hero image is a placeholder: the gallery uses `picsum.photos` seeds, and
`HeroDeveloper.vue` / `ProjectsSection.vue` use Unsplash URLs.

## Git

`.gitignore` covers `node_modules`, `.nuxt`, `.output`. Only source files are tracked — never commit those dirs.
