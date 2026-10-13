<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav-inner">
      <a href="#hero-marketing" class="brand">
        <span class="brand-mark">✦</span>
        <span class="brand-text">Portfolio</span>
      </a>
      <nav class="links">
        <a href="#hero-marketing">Marketing</a>
        <a href="#galeria">Galería</a>
        <a href="#desarrollador">Desarrollador</a>
        <a href="#proyectos">Proyectos</a>
      </nav>
      <a href="#proyectos" class="btn btn-nav">Contacto →</a>
      <button class="burger" @click="open = !open" aria-label="Abrir menú" :aria-expanded="open">☰</button>
    </div>
    <div v-if="open" class="mobile">
      <a href="#hero-marketing" @click="open = false">Marketing</a>
      <a href="#galeria" @click="open = false">Galería</a>
      <a href="#desarrollador" @click="open = false">Desarrollador</a>
      <a href="#proyectos" @click="open = false">Proyectos</a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const scrolled = ref(false)
const open = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  transition: background .3s ease, box-shadow .3s ease, backdrop-filter .3s ease;
  background: transparent;
}
.nav.scrolled {
  background: rgba(7, 26, 61, 0.82);
  backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(7, 26, 61, .25);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-h);
  gap: 16px;
}
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; min-width: 0; }
.brand-mark {
  width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center; flex-shrink: 0;
  background: #fff; color: var(--blue-900);
  font-weight: 700; font-size: 13px; letter-spacing: .05em;
}
.brand-text { font-family: var(--font-serif); font-size: clamp(16px, 2vw, 19px); letter-spacing: .02em; white-space: nowrap; }
.links { display: flex; gap: clamp(16px, 2.4vw, 26px); }
.links a {
  color: rgba(255,255,255,.82); text-decoration: none;
  font-size: 13.5px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  font-family: var(--font-mono);
  white-space: nowrap;
}
.links a:hover { color: #fff; }
.btn-nav {
  background: #fff; color: var(--blue-900);
  padding: 10px 20px; font-size: 13px;
  width: auto;
}
.btn-nav:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,.25); }
.burger { display: none; background: #fff; border: none; border-radius: 10px; padding: 8px 12px; font-size: 18px; cursor: pointer; }
.mobile {
  display: flex; flex-direction: column; gap: 4px;
  background: var(--blue-950); padding: 12px 4%;
  border-top: 1px solid rgba(255,255,255,.12);
}
.mobile a { color: #fff; text-decoration: none; padding: 12px 0; border-top: 1px solid rgba(255,255,255,.12); font-size: 15px; }
.mobile a:first-child { border-top: none; }

/* ——— PC chico / tablet landscape: ocultar CTA, compactar links ——— */
@media (max-width: 1100px) {
  .links { gap: 16px; }
  .links a { font-size: 12px; }
}
/* ——— Tablet portrait y menor: menú hamburguesa ——— */
@media (max-width: 960px) {
  .links, .btn-nav { display: none; }
  .burger { display: block; }
}
/* ——— Celular chico ——— */
@media (max-width: 380px) {
  .brand-text { font-size: 16px; }
  .brand-mark { width: 30px; height: 30px; }
  .burger { padding: 7px 10px; font-size: 16px; }
}
</style>
