<template>
  <footer id="contacto" class="footer">
    <div class="container foot-grid">
      <div>
        <p class="foot-brand">Portfolio</p>
        <p class="foot-sub">Marketing Professional · Full-Stack & Unity Developer</p>
      </div>
      <div class="foot-links">
        <a href="#hero-marketing">Marketing</a>
        <a href="#galeria">Galería</a>
        <a href="#desarrollador">Desarrollador</a>
        <a href="#proyectos">Proyectos</a>
      </div>
      <div class="foot-cta">
        <a href="mailto:hola@portfolio.com" class="btn btn-light">hola@portfolio.com</a>
        <p class="copy">© 2026 Portfolio. Built with logic & ink.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--ink); color: #fff; padding: clamp(36px, 5vw, 48px) 0; }
.foot-grid { display: grid; grid-template-columns: 1.2fr .8fr 1fr; gap: clamp(20px, 3vw, 28px); align-items: start; }
.foot-brand { font-family: var(--font-serif); font-size: clamp(24px, 3vw, 30px); margin: 0; }
.foot-sub { color: rgba(255,255,255,.6); font-size: clamp(12px, 1.5vw, 13px); font-family: var(--font-mono); line-height: 1.6; }
.foot-links { display: flex; flex-direction: column; gap: 8px; }
.foot-links a { color: rgba(255,255,255,.8); text-decoration: none; font-size: 14px; padding: 2px 0; }
.foot-links a:hover { color: #fff; }
.foot-cta { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; min-width: 0; }
.btn-light { background: #fff; color: #000; text-decoration: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.copy { color: rgba(255,255,255,.5); font-size: 12px; font-family: var(--font-mono); margin: 0; }
@media (max-width: 900px) {
  .foot-grid { grid-template-columns: 1fr 1fr; }
  .foot-cta { align-items: flex-start; grid-column: span 2; }
}
@media (max-width: 600px) {
  .foot-grid { grid-template-columns: 1fr; }
  .foot-cta { grid-column: span 1; }
  .foot-links { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
  .btn-light { width: 100%; }
}
</style>
