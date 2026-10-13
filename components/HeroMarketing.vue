<template>
  <section id="hero-marketing" class="hero-blue">
    <div class="container hero-grid">
      <p class="top-kicker reveal">Maximalism. &nbsp;Luxury typography. &nbsp;Conceptual sketch.</p>

      <!-- Tipografía lujo como Imagen 1. Para cambiar la foto: sustituye el src de .hero-photo -->
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

      <div class="photo-card reveal">
        <!-- ⚠️ Reemplaza este placeholder con la imagen que me pasarás después -->
        <img
          class="hero-photo"
          src="https://images.unsplash.com/photo-1493421419110-74f4e85ba126?q=80&w=1600&auto=format&fit=crop"
          alt="Eduardo Martinez — Marketing Professional"
        />
        <div class="photo-veil" />
        <div class="photo-caption">
          <span>Portfolio — Vol.01</span>
          <span class="cap-right">Azul profundo / Editorial</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero exacto a 1 pantalla: altura fija 100svh, contenido compacto y centrado */
section.hero-blue {
  background:
    radial-gradient(1100px 500px at 50% -80px, #2b5bd7 0%, transparent 60%),
    radial-gradient(800px 420px at 90% 20%, rgba(62,146,204,.45) 0%, transparent 60%),
    linear-gradient(180deg, var(--blue-950) 0%, var(--blue-900) 55%, #12307f 100%);
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
.hero-blue::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.14) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(700px 400px at 50% 0%, black, transparent 75%);
  pointer-events: none;
}
.hero-grid { position: relative; text-align: center; width: 100%; flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding-top: clamp(0px, 3vh, 28px); }
.top-kicker {
  font-family: var(--font-sans);
  color: rgba(238,243,255,.55);
  font-size: clamp(11px, 1.6vw, 13px);
  margin: 0 0 6px;
  text-wrap: balance;
}
.lux-type { margin: 0; line-height: .9; }
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
.photo-card {
  position: relative;
  margin: 14px auto 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-width: 960px;
  width: 100%;
  aspect-ratio: 21 / 9;
  max-height: 34vh;
  max-height: 34svh;
  box-shadow: 0 30px 80px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.18) inset;
  background: #0c2a6b;
  flex-shrink: 1;
  min-height: 0;
}
.hero-photo { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.02); }
.photo-veil {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,36,99,.05) 40%, rgba(7,26,61,.42) 100%),
              linear-gradient(90deg, rgba(62,146,204,.18), transparent 40%, transparent 60%, rgba(62,146,204,.18));
}
.photo-caption {
  position: absolute; left: 18px; right: 18px; bottom: 14px;
  display: flex; justify-content: space-between; gap: 12px;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,255,255,.85);
}

/* ——— Pantallas bajas: compactar para que siga cabiendo en 100svh ——— */
@media (max-height: 780px) {
  .top-kicker { display: none; }
  .photo-card { margin-top: 10px; max-height: 30vh; max-height: 30svh; }
}
@media (max-height: 640px) {
  .line-1 .serif-cond { font-size: clamp(28px, 6vh, 56px); }
  .line-1 .script { font-size: clamp(32px, 6.6vh, 62px); }
  .line-2 .serif-cond.small { font-size: clamp(18px, 3.6vh, 36px); }
  .line-2 .script { font-size: clamp(24px, 4.4vh, 46px); }
  .photo-card { max-height: 26vh; max-height: 26svh; }
}

/* ——— PC chico / tablet landscape ——— */
@media (max-width: 1024px) {
  .photo-card { aspect-ratio: 16 / 8; max-width: 860px; max-height: 32vh; max-height: 32svh; }
}
/* ——— Tablet portrait ——— */
@media (max-width: 768px) {
  .lux-type .line { gap: 0 .25em; }
  .photo-card { aspect-ratio: 16 / 9; border-radius: 18px; max-height: 30vh; max-height: 30svh; }
}
/* ——— Celular grande: mantener filas (no apilar) para no crecer en alto ——— */
@media (max-width: 600px) {
  .photo-card { aspect-ratio: 16 / 10; max-height: 26vh; max-height: 26svh; }
  .photo-caption { font-size: 11px; left: 12px; right: 12px; }
  .cap-right { display: none; }
  .photo-caption { justify-content: center; }
}
/* ——— Celular mediano ——— */
@media (max-width: 480px) {
  .line-1 .serif-cond { font-size: clamp(30px, 9vw, 42px); }
  .line-1 .script { font-size: clamp(34px, 10vw, 48px); }
  .photo-card { margin-top: 10px; border-radius: 16px; }
}
/* ——— Celular chico ——— */
@media (max-width: 380px) {
  .line-1 .serif-cond { font-size: clamp(28px, 10vw, 38px); }
  .line-1 .script { font-size: clamp(32px, 11vw, 44px); }
  .photo-card { aspect-ratio: 16 / 11; max-height: 24vh; max-height: 24svh; }
}
/* ——— Ultra / monitores grandes: crece a lo ancho, no a lo alto ——— */
@media (min-width: 1920px) {
  .photo-card { max-width: 1200px; aspect-ratio: 21 / 8; max-height: 36vh; max-height: 36svh; }
}
@media (min-width: 2560px) {
  .photo-card { max-width: 1700px; }
}
</style>
