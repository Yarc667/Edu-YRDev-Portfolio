<template>
  <section id="hero-marketing" class="hero-blue">
    <!-- ————— Fondo animado: imagen full-bleed + árboles meciéndose + niebla ————— -->
    <div class="hero-bg" aria-hidden="true">
      <!-- Parallax lento (Ken Burns) que envuelve cielo y árboles para que se muevan juntos -->
      <div class="bg-parallax">
        <!-- Capa cielo/montañas (recorta la franja de árboles) -->
        <NuxtImg
          class="bg-layer layer-sky"
          src="/img/hero_edu.webp"
          alt=""
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
          loading="eager"
          fetchpriority="high"
          preload
        />
        <!-- Capa de árboles: misma imagen recortada a la franja inferior, con vaivén anclado a la base -->
        <NuxtImg
          class="bg-layer layer-trees"
          src="/img/hero_edu.webp"
          alt=""
          sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
          loading="eager"
        />
      </div>

      <!-- Niebla en capas que se desplaza entre los árboles -->
      <div class="fog-layer">
        <span class="fog fog-1" />
        <span class="fog fog-2" />
        <span class="fog fog-3" />
      </div>

      <!-- Scrim neutro (sin tiñe la imagen) solo para dar contraste al texto -->
      <div class="hero-tint" />
      <div class="hero-vignette" />
    </div>

    <div class="container hero-grid">
      <p class="top-kicker reveal">Maximalism. &nbsp;Luxury typography. &nbsp;Conceptual sketch.</p>

      <h1 class="lux-type reveal">
        <span class="line line-1">
          <span class="serif-cond">EDUARDO</span><br />
          <span class="script">Martinez</span>
        </span>
        <span class="line line-2">
          <span class="serif-cond small">MARKETING</span>
          <span class="script">professional</span>
        </span>
      </h1>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   HERO ANIMADO — fondo full-bleed, árboles con vaivén y niebla
   ============================================================ */
section.hero-blue {
  /* Gradiente azul de respaldo (se ve detrás si la imagen tarda/falta) */
  background: linear-gradient(180deg, var(--blue-950) 0%, var(--blue-900) 55%, #12307f 100%);
  color: #eef3ff;
  height: 100vh;
  height: 100svh;
  min-height: 100vh;
  min-height: 100svh;
  max-height: 100vh;
  max-height: 100svh;
  padding-top: calc(var(--nav-h) + 8px);
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* —————— Capa de fondo animada —————— */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
/* El parallax se escala y hace un travelling lentísimo.
   transform-origin cerca de la base: el zoom agranda la franja del Jeep/persona. */
.bg-parallax {
  position: absolute;
  inset: -3%;
  transform-origin: 50% 85%;
  animation: kenburns 46s ease-in-out infinite;
  will-change: transform;
}
.bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
}

/* Cielo + montañas: visible arriba, se desvanece hacia la franja de árboles */
.layer-sky {
  -webkit-mask-image: linear-gradient(180deg, #000 0 32%, transparent 45%);
  mask-image: linear-gradient(180deg, #000 0 32%, transparent 45%);
}

/* Árboles: franja inferior con vaivén anclado a la base (las copas se mueven, las raíces no).
   El cruce suave con la capa de cielo queda oculto por la niebla. */
.layer-trees {
  transform-origin: 50% 100%;
  -webkit-mask-image: linear-gradient(180deg, transparent 32%, #000 45% 100%);
  mask-image: linear-gradient(180deg, transparent 32%, #000 45% 100%);
  filter: saturate(1.05) contrast(1.04) brightness(1.01);
  animation: treesway 12s ease-in-out infinite;
  will-change: transform;
}

@keyframes kenburns {
  0%   { transform: scale(1.16) translate3d(0, 0, 0); }
  50%  { transform: scale(1.24) translate3d(-1%, -0.8%, 0); }
  100% { transform: scale(1.16) translate3d(0, 0, 0); }
}
@keyframes treesway {
  0%, 100% { transform: skewX(-0.9deg) translateX(-4px) scale(1.02); }
  50%      { transform: skewX(0.9deg) translateX(4px) scale(1.045); }
}

/* —————— Niebla —————— */
.fog-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.fog {
  position: absolute;
  border-radius: 50%;
  filter: blur(26px);
  mix-blend-mode: screen;
  opacity: 0.5;
  will-change: transform, opacity;
}
.fog-1 {
  width: 75%; height: 42%; left: -12%; top: 20%;
  background: radial-gradient(closest-side, rgba(255,255,255,.9), rgba(255,255,255,0) 72%);
  animation: fogmove 30s ease-in-out infinite;
}
.fog-2 {
  width: 62%; height: 34%; right: -14%; top: 30%;
  background: radial-gradient(closest-side, rgba(214,228,255,.85), rgba(214,228,255,0) 72%);
  animation: fogmove 44s ease-in-out infinite reverse;
}
.fog-3 {
  width: 88%; height: 30%; left: 4%; top: 44%;
  background: radial-gradient(closest-side, rgba(255,255,255,.6), rgba(255,255,255,0) 75%);
  animation: fogmove 58s ease-in-out infinite;
}
@keyframes fogmove {
  0%, 100% { transform: translate3d(-7%, 1.5%, 0) scale(1); opacity: .36; }
  50%      { transform: translate3d(7%, -1.5%, 0) scale(1.15); opacity: .6; }
}

/* —————— Scrim neutro para contraste del texto (no tiñe la imagen) —————— */
.hero-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 30%, rgba(0,0,0,.05) 55%, rgba(0,0,0,.5) 100%);
}
.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(130% 100% at 50% 45%, transparent 58%, rgba(0,0,0,.42) 100%);
}

/* —————— Contenido —————— */
.hero-grid {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: clamp(0px, 3vh, 28px);
}
.top-kicker {
  font-family: var(--font-sans);
  color: rgba(238,243,255,.75);
  font-size: clamp(11px, 1.6vw, 13px);
  margin: 0 0 6px;
  text-wrap: balance;
  text-shadow: 0 1px 14px rgba(4,12,33,.6);
}
.lux-type { margin: 0; line-height: .9; text-shadow: 0 4px 40px rgba(4,12,33,.6); }
.lux-type .line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0 .3em;
}
/* el <br> dentro del flex fuerza el salto EDUARDO / Martinez */
.lux-type .line-1 { flex-direction: column; align-items: center; gap: 0; }
.lux-type .line-1 br { display: block; }
/* EDUARDO a la izquierda, Martinez a la derecha — con un poco de aire */
.lux-type .line-1 { padding-inline: 0; margin-inline: clamp(-24px, -3vw, 0px); }
.line-1 .serif-cond { align-self: stretch; text-align: left; margin-left: 0; }
.line-1 .script { align-self: stretch; text-align: right; margin-right: 0; line-height: .9; }
.line-1 .serif-cond {
  font-family: var(--font-display);
  font-size: clamp(40px, 9vw, 116px);
  letter-spacing: .02em;
  color: #fff;
  line-height: 1;
}
.line-1 .script {
  font-family: var(--font-script);
  font-size: clamp(44px, 9.5vw, 124px);
  color: var(--blue-200);
  font-weight: 400;
  line-height: 1;
}
.line-2 { margin-top: 2px; }
.line-2 .serif-cond.small {
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 48px);
  letter-spacing: .14em;
  color: #fff;
  line-height: 1.1;
}
.line-2 .script {
  font-family: var(--font-script);
  font-size: clamp(26px, 4.8vw, 62px);
  color: #fff;
  line-height: 1;
}

/* —————— Respetar "reducir movimiento" —————— */
@media (prefers-reduced-motion: reduce) {
  .bg-parallax,
  .layer-trees,
  .fog { animation: none !important; }
}

/* —————— Pantallas bajas: compactar —————— */
@media (max-height: 780px) {
  .top-kicker { display: none; }
}
@media (max-height: 640px) {
  .line-1 .serif-cond { font-size: clamp(28px, 6vh, 56px); }
  .line-1 .script { font-size: clamp(32px, 6.6vh, 62px); }
  .line-2 .serif-cond.small { font-size: clamp(18px, 3.6vh, 36px); }
  .line-2 .script { font-size: clamp(24px, 4.4vh, 46px); }
}

/* —————— Tablet / móvil: ajustes tipográficos y de encuadre —————— */
@media (max-width: 1024px) {
  .bg-layer { object-position: 52% 100%; }
}
@media (max-width: 768px) {
  .lux-type .line { gap: 0 .25em; }
  .bg-layer { object-position: 55% 100%; }
}
@media (max-width: 600px) {
  .bg-layer { object-position: 58% 100%; }
}
@media (max-width: 480px) {
  .line-1 .serif-cond { font-size: clamp(30px, 9vw, 42px); }
  .line-1 .script { font-size: clamp(34px, 10vw, 48px); }
}
@media (max-width: 380px) {
  .line-1 .serif-cond { font-size: clamp(28px, 10vw, 38px); }
  .line-1 .script { font-size: clamp(32px, 11vw, 44px); }
}
</style>
