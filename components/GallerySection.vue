<template>
  <section id="galeria" class="gallery-blue">
    <div class="container">
      <div class="gal-head reveal">
        <p class="section-label">02 — Galería</p>
        <h2> Cinco mundos, <em>cinco temas.</em></h2>
        <p class="gal-desc">Elige un tema para ver las fotos. Cada tarjeta abre su colección (lightbox incluido).</p>
      </div>

      <div class="gal-grid">
        <button
          v-for="(t, i) in themes"
          :key="t.slug"
          class="gal-card reveal"
          :style="{ transitionDelay: (i * 60) + 'ms' }"
          @click="openTheme(t)"
        >
          <img :src="t.cover" :alt="t.title" loading="lazy" />
          <span class="gal-num">0{{ i + 1 }}</span>
          <span class="gal-overlay" />
          <span class="gal-info">
            <span class="gal-kicker">{{ t.count }} fotos</span>
            <span class="gal-title">{{ t.title }}</span>
            <span class="gal-sub">{{ t.subtitle }}</span>
            <span class="gal-link">Ver fotos →</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="active" class="lightbox" @click.self="active = null">
      <div class="lb-box">
        <div class="lb-head">
          <div>
            <p class="section-label">{{ active.subtitle }}</p>
            <h3>{{ active.title }}</h3>
          </div>
          <button class="lb-close" @click="active = null">✕</button>
        </div>
        <div class="lb-grid">
          <img v-for="(p, idx) in active.photos" :key="idx" :src="p" :alt="`${active.title} ${idx + 1}`" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const mk = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const themes = ref([
  {
    slug: 'branding', title: 'Branding', subtitle: 'Identidad & Dirección de arte',
    cover: mk('edu-branding', 700, 900), count: 6,
    photos: ['edu-brand-1','edu-brand-2','edu-brand-3','edu-brand-4','edu-brand-5','edu-brand-6'].map(s => mk(s))
  },
  {
    slug: 'lifestyle', title: 'Lifestyle', subtitle: 'Retrato editorial',
    cover: mk('edu-life', 700, 900), count: 6,
    photos: ['edu-life-1','edu-life-2','edu-life-3','edu-life-4','edu-life-5','edu-life-6'].map(s => mk(s))
  },
  {
    slug: 'producto', title: 'Producto', subtitle: 'Still life & Comercial',
    cover: mk('edu-prod', 700, 900), count: 6,
    photos: ['edu-prod-1','edu-prod-2','edu-prod-3','edu-prod-4','edu-prod-5','edu-prod-6'].map(s => mk(s))
  },
  {
    slug: 'eventos', title: 'Eventos', subtitle: 'Backstage & Escenario',
    cover: mk('edu-event', 700, 900), count: 6,
    photos: ['edu-ev-1','edu-ev-2','edu-ev-3','edu-ev-4','edu-ev-5','edu-ev-6'].map(s => mk(s))
  },
  {
    slug: 'viajes', title: 'Viajes', subtitle: 'Paisaje & Urbano',
    cover: mk('edu-travel', 700, 900), count: 6,
    photos: ['edu-tr-1','edu-tr-2','edu-tr-3','edu-tr-4','edu-tr-5','edu-tr-6'].map(s => mk(s))
  }
])

const active = ref(null)
const openTheme = (t) => { active.value = t }
</script>

<style scoped>
.gallery-blue {
  background: linear-gradient(180deg, #12307f 0%, var(--blue-50) 18%, var(--blue-cream) 100%);
  color: var(--blue-950);
}
.gal-head { text-align: left; max-width: 720px; }
.gal-head .section-label { color: var(--blue-700); }
.gal-head h2 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(30px, 5vw, 58px);
  line-height: 1.02;
  margin: 10px 0;
  color: var(--blue-950);
  text-wrap: balance;
}
.gal-head h2 em { font-family: var(--font-script); font-style: normal; font-size: 1.25em; color: var(--blue-700); }
.gal-desc { color: #3b4d7a; font-size: clamp(14px, 1.8vw, 16px); margin: 0; line-height: 1.6; }
.gal-grid {
  margin-top: clamp(20px, 3vw, 32px);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(12px, 1.6vw, 16px);
}
.gal-card {
  position: relative;
  border: none;
  padding: 0;
  border-radius: 18px;
  overflow: hidden;
  min-height: 420px;
  cursor: pointer;
  text-align: left;
  background: var(--blue-900);
  box-shadow: 0 18px 40px rgba(10,36,99,.22);
  transition: transform .25s ease, box-shadow .25s ease;
  font: inherit;
}
.gal-card:hover { transform: translateY(-6px); box-shadow: 0 26px 60px rgba(10,36,99,.32); }
.gal-card:focus-visible { outline: 3px solid var(--blue-500); outline-offset: 3px; }
.gal-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.gal-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(7,26,61,0) 30%, rgba(7,26,61,.78) 78%);
}
.gal-num {
  position: absolute; top: 14px; right: 14px;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em;
  background: rgba(255,255,255,.9); color: var(--blue-900);
  padding: 6px 10px; border-radius: 999px;
}
.gal-info { position: absolute; left: 16px; right: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 4px; color: #fff; }
.gal-kicker { font-family: var(--font-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; opacity: .85; }
.gal-title { font-family: var(--font-serif); font-size: clamp(22px, 2.4vw, 30px); line-height: 1; }
.gal-sub { font-size: 13px; opacity: .85; }
.gal-link {
  margin-top: 10px; align-self: flex-start;
  background: #fff; color: var(--blue-900);
  font-size: 13px; font-weight: 600;
  padding: 8px 14px; border-radius: 999px;
}

/* Lightbox */
.lightbox {
  position: fixed; inset: 0; z-index: 80;
  background: rgba(7,26,61,.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.lb-box {
  background: #fff; border-radius: 20px;
  width: min(1000px, 100%); max-height: 88vh; max-height: 88svh; overflow: auto;
  padding: clamp(16px, 3vw, 22px);
}
.lb-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.lb-head h3 { font-family: var(--font-serif); font-size: clamp(26px, 4vw, 34px); margin: 4px 0 0; }
.lb-head .section-label { color: var(--blue-700); }
.lb-close { border: 1px solid #ddd; background: #fff; border-radius: 999px; width: 38px; height: 38px; cursor: pointer; flex-shrink: 0; }
.lb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
.lb-grid img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; }

/* ——— PC chico: 5 → 3 columnas ——— */
@media (max-width: 1200px) {
  .gal-grid { grid-template-columns: repeat(3, 1fr); }
  .gal-card { min-height: 360px; }
}
/* ——— Tablet: 3 → 2 columnas ——— */
@media (max-width: 900px) {
  .gal-grid { grid-template-columns: repeat(2, 1fr); }
  .gal-card { min-height: 340px; }
  .gal-card:last-child { grid-column: span 2; min-height: 240px; }
}
/* ——— Celular grande / mediano ——— */
@media (max-width: 600px) {
  .gal-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .gal-card { min-height: 300px; border-radius: 14px; }
  .gal-info { left: 12px; right: 12px; bottom: 12px; }
  .gal-sub { display: none; }
  .lb-grid { grid-template-columns: repeat(2, 1fr); }
  .lb-grid img { height: 160px; }
}
/* ——— Celular chico: 1 columna apilada ——— */
@media (max-width: 400px) {
  .gal-grid { grid-template-columns: 1fr; }
  .gal-card { min-height: 300px; }
  .gal-card:last-child { grid-column: span 1; min-height: 300px; }
  .gal-sub { display: block; }
  .lb-box { border-radius: 14px; }
  .lb-grid { grid-template-columns: 1fr; }
  .lb-grid img { height: 220px; }
}
/* ——— Ultra: tarjetas más altas ——— */
@media (min-width: 1920px) {
  .gal-card { min-height: 520px; }
}
</style>
