<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav-inner">
      <a href="#hero-marketing" class="brand">
        <span class="brand-mark">✦</span>
        <span class="brand-text">Portfolio</span>
      </a>
      <a href="#proyectos" class="btn btn-nav">Contacto →</a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const scrolled = ref(false)
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
.btn-nav {
  background: #fff; color: var(--blue-900);
  padding: 10px 20px; font-size: 13px;
  width: auto;
}
.btn-nav:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,.25); }

/* ——— Pantallas chicas: compactar ——— */
@media (max-width: 960px) {
  .btn-nav { padding: 9px 16px; font-size: 12px; }
}
/* ——— Celular chico ——— */
@media (max-width: 380px) {
  .brand-text { font-size: 16px; }
  .brand-mark { width: 30px; height: 30px; }
  .btn-nav { padding: 8px 13px; font-size: 11.5px; }
}
</style>
