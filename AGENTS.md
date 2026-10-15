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

## HeroMarketing.vue

The complex component: an animated full-bleed hero. It reuses one image in two `mask-image`-split
`<NuxtImg>` layers (sky + trees), a Ken-Burns wrapper, a `treesway` skew on the tree layer, and three
drifting CSS fog layers over a neutral scrim. All motion is scoped keyframes and honors
`prefers-reduced-motion`. Don't reorder the layers without re-checking the mask seam and fog coverage.

Framing/zoom is all CSS tuning: `.bg-layer` `object-position` (`Y=100%` anchors the bottom of the shot)
plus the `kenburns` `scale` on `.bg-parallax` with `transform-origin: 50% 85%` (a zoom pivoted near the
base, so enlarging pushes the foreground/Jeep bigger rather than losing it). Change those to reframe.

## Placeholder assets (not real content)

Everything except the hero image is a placeholder: the gallery uses `picsum.photos` seeds, and
`HeroDeveloper.vue` / `ProjectsSection.vue` use Unsplash URLs.

## Git

`.gitignore` covers `node_modules`, `.nuxt`, `.output`. Only source files are tracked — never commit those dirs.
