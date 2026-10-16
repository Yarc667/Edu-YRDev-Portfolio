<script setup>
const $img = useImage()

/* Las tres capas comparten la misma foto y el mismo srcset: solo cambian la
   máscara y la animación. Se usan <img> planos (y no <NuxtImg>) porque el
   `sizes` tiene que ir en `vh` y Nuxt Image solo entiende valores en `vw`:
   genera el srcset a partir de `screens × densities` y descarta cualquier
   valor que no acabe en `vw` (dejando el <img> sin src ni srcset). */
const heroImage = '/img/hero_edu.webp'
const heroWidths = [640, 1024, 1536, 2048, 2560]
const heroSrcset = heroWidths
  .map((w) => `${$img(heroImage, { width: w })} ${w}w`)
  .join(', ')
const heroSrc = $img(heroImage, { width: 2048 })

/* `sizes` describe el ancho REAL al que se pinta la foto, no el del viewport.
   La caja del fondo tiene 1.06 × alto de viewport (overscan) y la foto es más
   ancha que el hero, así que `object-fit: cover` la escala por ALTURA y el
   ancho renderizado es ~1.06 × 1.909 × alto ≈ 2.02 × la altura del viewport.
   Con `100vw` el navegador pedía una variante demasiado pequeña: en un móvil
   vertical (390×844) cargaba 640px para una caja que necesita ~1700px, y la
   imagen salía ampliada 2.7× (árboles borrosos). En `vh` acierta siempre. */
const heroSizes = '210vh'

/* "Martinez" se escribe con bolígrafo de verdad. La tipografía Pinyon Script
   queda intacta: sobre ella se superpone una MÁSCARA SVG con el recorrido real
   de la pluma, y la tinta se revela conforme el trazo avanza, así que el
   dibujo sigue la línea de cada letra en vez de barrer una franja recta.
   El recorrido está trazado a mano sobre la propia letra y ajustado después al
   eje central de la tinta (ascenso de gradiente sobre la transformada de
   distancia), de modo que pasa por el centro de cada trazo. */
import pen from '~/assets/pen-martinez.json'

const PEN_START = 300 // ms de espera: primero aparece el titular
const PEN_DURATION = 2000 // ms de escritura completa
const penTotal = pen.subs.reduce((a, s) => a + s.len, 0)

let penCursor = 0
const penSubs = pen.subs.map((s) => {
  const at = penCursor / penTotal
  penCursor += s.len
  return {
    d: s.d,
    // El guion es un pelín más largo que el trazo para que el final quede
    // cubierto aunque la curva Bézier mida algo más que la polilínea.
    dash: +(s.len * 1.08).toFixed(1),
    delay: PEN_START + at * PEN_DURATION,
    dur: Math.max(1, (s.len / penTotal) * PEN_DURATION)
  }
})
const penSettleDelay = PEN_START + PEN_DURATION - 200
// La copia sin máscara entra justo después del cierre.
const penFinalDelay = penSettleDelay + 200

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: heroSrc,
      imagesrcset: heroSrcset,
      imagesizes: heroSizes,
      fetchpriority: 'high'
    }
  ]
})

/* ————— Profundidad 3D: parallax multicapa con el puntero —————
   Cada plano se desplaza a una velocidad distinta (montañas poco, árboles
   más, primer plano fijo). El CSS solo lee las variables `--px`/`--py`
   (-1…1); aquí se calculan suavizadas con un bucle rAF que se detiene solo
   al llegar al objetivo, así no hay trabajo de fondo. */
const heroSection = ref(null)

const EASE = 0.09

let raf = 0
let tx = 0
let ty = 0
let cx = 0
let cy = 0

function paint() {
  const el = heroSection.value
  if (!el) return
  el.style.setProperty('--px', cx.toFixed(4))
  el.style.setProperty('--py', cy.toFixed(4))
}

function tick() {
  cx += (tx - cx) * EASE
  cy += (ty - cy) * EASE
  if (Math.abs(tx - cx) < 0.0008 && Math.abs(ty - cy) < 0.0008) {
    cx = tx
    cy = ty
    paint()
    raf = 0
    return
  }
  paint()
  raf = requestAnimationFrame(tick)
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function onPointerMove(event) {
  const el = heroSection.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
  ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))
  kick()
}

function onPointerLeave() {
  tx = 0
  ty = 0
  kick()
}

onMounted(() => {
  // Solo con puntero fino (ratón/trackpad) y sin "reducir movimiento".
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const el = heroSection.value
  el?.addEventListener('pointermove', onPointerMove, { passive: true })
  el?.addEventListener('pointerleave', onPointerLeave)
})

onBeforeUnmount(() => {
  const el = heroSection.value
  el?.removeEventListener('pointermove', onPointerMove)
  el?.removeEventListener('pointerleave', onPointerLeave)
  if (raf) cancelAnimationFrame(raf)
  raf = 0
})
</script>

<template>
  <section id="hero-marketing" ref="heroSection" class="hero-blue">
    <!-- ————— Fondo animado: imagen full-bleed + árboles con viento + niebla ————— -->
    <div class="hero-bg" aria-hidden="true">
      <!-- Caja de encuadre con overscan: las tres capas comparten el mismo recorte,
           así el primer plano queda alineado con el fondo. -->
      <div class="bg-parallax">
        <!-- Capa cielo/montañas (recorta la franja de árboles) -->
        <img
          class="bg-layer layer-sky"
          :src="heroSrc"
          :srcset="heroSrcset"
          :sizes="heroSizes"
          alt=""
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <!-- Capa de árboles: franja media, empujada por el viento de derecha a izquierda -->
        <img
          class="bg-layer layer-trees"
          :src="heroSrc"
          :srcset="heroSrcset"
          :sizes="heroSizes"
          alt=""
          loading="eager"
          decoding="async"
        />
        <!-- Copia desenfocada de las copas (parte alta): se funde con la bruma de
             las montañas y se desvanece hacia los troncos, que quedan nítidos. -->
        <img
          class="bg-layer layer-trees-soft"
          :src="heroSrc"
          :srcset="heroSrcset"
          :sizes="heroSizes"
          alt=""
          loading="eager"
          decoding="async"
        />
        <!-- Primer plano FIJO: jeep, persona, carretera y nieve. Tapa la parte baja de la
             capa de árboles para que el viento no arrastre al jeep ni a la persona. -->
        <img
          class="bg-layer layer-fg"
          :src="heroSrc"
          :srcset="heroSrcset"
          :sizes="heroSizes"
          alt=""
          loading="eager"
          decoding="async"
        />
      </div>

      <!-- Niebla en capas a la altura del bosque bajo, justo encima del jeep,
           arrastrada en sentido OPUESTO a los árboles (izquierda → derecha) -->
      <div class="fog-layer">
        <span class="fog fog-1" />
        <span class="fog fog-2" />
        <span class="fog fog-3" />
      </div>
    </div>

    <div class="container hero-grid">
      <p class="top-kicker reveal">Maximalism. &nbsp;Luxury typography. &nbsp;Conceptual sketch.</p>

      <h1 class="lux-type reveal">
        <span class="line line-1">
          <span class="serif-cond">EDUARDO</span><br />
          <!-- "Martinez" se escribe con bolígrafo: la palabra se pinta como
               texto SVG y una máscara con el recorrido de la pluma la va
               descubriendo trazo a trazo. El `viewBox` está en unidades de la
               fuente (font-size 124, línea base y=150) para que el trazo
               escale con el texto. -->
          <span class="script">
            <svg class="pen-word" viewBox="0 57 418 142" role="img" aria-label="Martinez">
              <defs>
                <!-- Máscara por ALFA (no por luminancia): así lo revelado es
                     exactamente el trazo, sin restar luminancia y sin cambiar
                     el borde de la tinta. -->
                <mask id="pen-mask" maskUnits="userSpaceOnUse" x="-30" y="30" width="490" height="190" style="mask-type: alpha">
                  <!-- Un trazo por subtrazo: cada uno se dibuja con un guion que
                       se acorta, y arrancan encadenados (el retardo es la
                       longitud acumulada), así la pluma avanza continua. -->
                  <path
                    v-for="(s, i) in penSubs"
                    :key="i"
                    class="pen-stroke"
                    :d="s.d"
                    :style="{ '--dash': s.dash, '--delay': s.delay + 'ms', '--dur': s.dur + 'ms' }"
                  />
                  <!-- Cierre: cuando la pluma acaba, se completa la palabra para
                       que no quede ni un borde suavizado sin cubrir. Lleva un
                       trazo fino para que la máscara sea opaca también en el
                       borde de la tinta y no adelgace las letras al
                       multiplicar por su propio antialias. -->
                  <text
                    class="pen-settle"
                    x="0"
                    y="150"
                    fill="#fff"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linejoin="round"
                    :style="{ '--delay': penSettleDelay + 'ms' }"
                  >Martinez</text>
                </mask>
              </defs>
              <text class="pen-text" x="0" y="150" mask="url(#pen-mask)" :style="{ '--delay': penFinalDelay + 'ms' }">Martinez</text>
              <!-- Copia sin máscara que entra al final: así el estado en reposo
                   es la tinta exacta, sin el suavizado de bordes que deja
                   cualquier máscara (el relevo es imperceptible porque el
                   cuadro es el mismo). -->
              <text class="pen-final" x="0" y="150" :style="{ '--delay': penFinalDelay + 'ms' }">Martinez</text>
            </svg>
          </span>
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
/* Caja de encuadre con overscan (3% extra por lado). Sin Ken Burns: el jeep y la
   persona deben permanecer fijos, así que el fondo nunca se escala.
   El overscan da margen para el vaivén de los árboles (~11 px) y para el
   parallax del puntero (hasta 12 px), de modo que nunca asoma un borde. */
.bg-parallax {
  position: absolute;
  inset: -3%;
}
.bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 100%;
}

/* Cielo + montañas: capa BASE siempre opaca. A propósito NO lleva máscara: al
   cubrir todo el fondo, impide que el degradado azul de la sección se
   transparente en el cruce con los árboles — que era justo lo que producía la
   línea azul difusa a media imagen. Los árboles se funden por encima con su
   propia máscara, así que el cruce nunca deja ver el fondo. */

/* Árboles: franja media. El viento los empuja de derecha a izquierda.
   transform-origin en la base: las copas se mueven, las raíces no.
   Sin `will-change`: al promover la capa, Chrome la rasteriza con menos detalle
   y los árboles se ven borrosos. Con la animación de transform basta.
   Son DOS planos con el movimiento EXACTAMENTE igual (nítido + copas
   desenfocadas): si no fuese así, el desenfoque se despegaría de los troncos. */
.layer-trees,
.layer-trees-soft {
  transform-origin: 50% 100%;
  animation: treesway 16s infinite;
  translate: calc(var(--px, 0) * 12px) calc(var(--py, 0) * 7px);
}
.layer-trees {
  -webkit-mask-image: linear-gradient(180deg, transparent 32%, #000 45% 100%);
  mask-image: linear-gradient(180deg, transparent 32%, #000 45% 100%);
  filter: saturate(1.05) contrast(1.04) brightness(1.01);
}
/* Copia desenfocada de las copas: se desenfoca desde el borde superior (top)
   hasta las copas altas y se desvanece hacia abajo, dejando los troncos nítidos. */
.layer-trees-soft {
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 41%, transparent 53%);
  mask-image: linear-gradient(180deg, #000 0%, #000 41%, transparent 53%);
  filter: blur(1.5px) saturate(1.05) contrast(1.04) brightness(1.01);
}

/* Primer plano FIJO: jeep, persona, carretera y nieve.
   La máscara funde la base de los árboles en esta capa estática, así el
   movimiento del viento nunca toca al jeep ni a la persona. */
.layer-fg {
  -webkit-mask-image: linear-gradient(180deg, transparent 70%, #000 78% 100%);
  mask-image: linear-gradient(180deg, transparent 70%, #000 78% 100%);
  filter: saturate(1.05) contrast(1.04) brightness(1.01);
}

/* —————— Profundidad 3D: parallax multicapa ——————
   El puntero desplaza cada plano a una velocidad distinta: las montañas (plano
   lejano) apenas se mueven, los árboles (plano medio) el doble, y el primer
   plano —jeep, persona, carretera— queda FIJO como ancla. Esa diferencia de
   velocidades es lo que el ojo interpreta como profundidad. Se usa la
   propiedad `translate` (no `transform`) para no pisar la animación
   `treesway` de los árboles, que vive en `transform`.
   `--px`/`--py` van de -1 a 1 y las fija el bucle rAF; sin puntero fino o con
   "reducir movimiento" se quedan en 0 y las capas siguen perfectamente
   alineadas. Las amplitudes son pequeñas a propósito: son los planos
   compartidos por las máscaras, y un desplazamiento grande delataría el fundido. */
.layer-sky {
  translate: calc(var(--px, 0) * 5px) calc(var(--py, 0) * 3px);
}
.fog-layer {
  translate: calc(var(--px, 0) * 7px) calc(var(--py, 0) * 4px);
}

/* Empuje del viento de derecha a izquierda: la ráfaga va rápida hacia la
   izquierda y el retorno es lento, así el movimiento dominante es ← */
@keyframes treesway {
  0% {
    transform: skewX(-0.8deg);
    animation-timing-function: cubic-bezier(.22,.61,.36,1);
  }
  62% {
    transform: skewX(1.15deg);
    animation-timing-function: cubic-bezier(.5,0,.68,.42);
  }
  100% { transform: skewX(-0.8deg); }
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
  /* Opacidad base = pico de la deriva. Así, si la animación se desactiva
     (prefers-reduced-motion), la niebla queda como una bruma fija y no a opacidad 1. */
  --fog-o: .5;
  opacity: var(--fog-o);
  will-change: transform, opacity;
}
/* Las tres manchas terminan a la misma altura (~80%): justo por encima del
   jeep, que vive en el 82–95% del hero. Así la bruma se apoya en el bosque
   bajo y el jeep queda por debajo de ella. */
.fog-1 {
  width: 74%; height: 30%; left: -10%; top: 50%;
  --fog-o: .6;
  background: radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0) 74%);
  animation: fogdrift 36s linear infinite;
}
.fog-2 {
  width: 60%; height: 26%; right: -12%; top: 54%;
  --fog-o: .52;
  background: radial-gradient(closest-side, rgba(214,228,255,.92), rgba(214,228,255,0) 74%);
  animation: fogdrift 50s linear infinite;
  animation-delay: -17s;
}
.fog-3 {
  width: 84%; height: 20%; left: 2%; top: 60%;
  --fog-o: .45;
  background: radial-gradient(closest-side, rgba(255,255,255,.75), rgba(255,255,255,0) 76%);
  animation: fogdrift 64s linear infinite;
  animation-delay: -33s;
}
/* Deriva en UNA sola dirección, OPUESTA al viento de los árboles:
   los árboles se empujan hacia la izquierda, así que la neblina entra por la
   izquierda y sale por la derecha. El fundido de opacidad en los extremos
   oculta el reinicio del bucle. */
@keyframes fogdrift {
  0%   { transform: translate3d(-170%, 0, 0) scale(1.08); opacity: 0; }
  16%  { opacity: var(--fog-o); }
  80%  { opacity: var(--fog-o); }
  100% { transform: translate3d(120%, 0, 0) scale(1);      opacity: 0; }
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
  color: rgba(255,255,255,.9);
  font-size: clamp(11px, 1.6vw, 13px);
  margin: 0 0 6px;
  text-wrap: balance;
  text-shadow: 0 1px 3px rgba(4,12,33,.85), 0 2px 16px rgba(4,12,33,.7);
}
.lux-type { margin: 0; line-height: .9; text-shadow: 0 2px 6px rgba(4,12,33,.75), 0 6px 44px rgba(4,12,33,.7); }
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
.line-1 .script { align-self: stretch; text-align: right; margin-right: 0; }
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
  /* Conserva EXACTAMENTE la caja del texto original (1em de alto): el SVG
     sobresale por arriba y por abajo, igual que hacía la tinta de la letra. */
  height: 1em;
  /* La sombra es un drop-shadow sobre la palabra entera, no un text-shadow:
     se calcula del píxel ya pintado, así que sigue a la tinta que va
     apareciendo — sin recortes duros y sin fantasma. Ojo: en drop-shadow el
     tercer valor es la desviación típica, y en text-shadow es el radio de
     desenfoque (≈2×σ), por eso aquí van 3px/22px donde el text-shadow llevaba
     6px/44px. */
  filter: drop-shadow(0 2px 3px rgba(4, 12, 33, .75)) drop-shadow(0 6px 22px rgba(4, 12, 33, .7));
}
/* "Martinez" se escribe con bolígrafo: la palabra es texto SVG y una máscara
   con el recorrido de la pluma la va descubriendo trazo a trazo — se dibuja la
   LÍNEA de cada letra, no se barre una franja recta.
   El `viewBox` está en unidades de la fuente (font-size 124, línea base y=150).
   La caja del SVG replica la tinta de Pinyon Script medida en el navegador
   (ancho 418/124 em, alto 142/124 em, línea base a 93/124 em del borde
   superior): con esos márgenes la tinta cae justo donde caía el texto, así que
   la maquetación del héroe no se mueve. */
.line-1 .script .pen-word {
  display: block;
  width: 3.37097em;  /* 418 / 124 */
  height: 1.14516em; /* 142 / 124 */
  margin: -0.01613em -0.08337em 0 auto;
  overflow: visible;
}
.pen-word .pen-text,
.pen-word .pen-final,
.pen-word .pen-settle {
  font-family: var(--font-script);
  font-size: 124px;
}
.pen-word .pen-text {
  fill: var(--blue-200);
  animation: penTextOut 260ms linear var(--delay) both;
  animation-play-state: paused;
}
.lux-type.visible .pen-word .pen-text { animation-play-state: running; }
@keyframes penTextOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.pen-word .pen-final {
  fill: var(--blue-200);
  opacity: 0;
  animation: penFinal 260ms linear var(--delay) both;
  animation-play-state: paused;
}
.lux-type.visible .pen-word .pen-final { animation-play-state: running; }
@keyframes penFinal {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Cada subtrazo se revela con un guion que se acorta: la tinta aparece por
   donde va pasando la pluma. Los subtrazos van encadenados por su retardo
   acumulado (la longitud ya escrita), así la pluma lleva velocidad constante y
   los saltos de pluma —la barra de la t y el punto de la i— caen en su sitio. */
.pen-word .pen-stroke {
  fill: none;
  stroke: #fff;
  stroke-width: 30; /* ancho de la banda que revela la tinta */
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--dash);
  stroke-dashoffset: var(--dash);
  animation: penWrite var(--dur) linear var(--delay) both;
  animation-play-state: paused;
}
.lux-type.visible .pen-word .pen-stroke { animation-play-state: running; }
@keyframes penWrite {
  from { stroke-dashoffset: var(--dash); }
  to   { stroke-dashoffset: 0; }
}
/* Cierre: al acabar la pluma se completa la palabra. Solo tapa los últimos
   píxeles (bordes suavizados y algún hueco mínimo del ajuste), así que no se
   ve como un salto. */
.pen-word .pen-settle {
  opacity: 0;
  animation: penSettle 320ms linear var(--delay) both;
  animation-play-state: paused;
}
.lux-type.visible .pen-word .pen-settle { animation-play-state: running; }
@keyframes penSettle {
  from { opacity: 0; }
  to   { opacity: 1; }
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
  .layer-trees,
  .layer-trees-soft,
  .fog { animation: none !important; }
  /* "Martinez" se muestra ya escrito, sin efecto de escritura. */
  .line-1 .script .pen-stroke { animation: none; stroke-dashoffset: 0; }
  .line-1 .script .pen-settle { animation: none; opacity: 1; }
  .line-1 .script .pen-text { animation: none; opacity: 0; }
  .line-1 .script .pen-final { animation: none; opacity: 1; }
  /* El parallax tampoco se activa (el JS ni siquiera escucha), pero por si el
     usuario cambia la preferencia con la página abierta: */
  .layer-sky,
  .layer-trees,
  .layer-trees-soft,
  .fog-layer { translate: none; }
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
