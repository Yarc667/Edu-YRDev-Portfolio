<template>
  <section id="desarrollador" class="dev-hero">
    <div class="container dev-grid">
      <div class="dev-left reveal">
        <p class="dev-kicker"><span class="dot" /> FULL-STACK & UNITY DEVELOPER</p>
        <h2>Building Web<br />Experiences &<br />Interactive Worlds</h2>
        <p class="dev-desc">
          Independent developer focused on creating robust full-stack architectures
          and immersive virtual environments. I merge the precision of logical
          engineering with the creativity of game design.
        </p>
        <div class="dev-cta">
          <a href="#proyectos" class="btn btn-dark">View My Work →</a>
          <a href="#contacto" class="btn btn-outline">Let's Talk</a>
        </div>
        <pre class="code">System.out.println("Hello World");</pre>
      </div>
      <div class="dev-right reveal">
        <!-- Sustituir por sketch/foto real del desarrollador -->
        <div class="sketch-card">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" alt="Eduardo Martinez — Developer" />
        </div>
        <div class="stack-chips">
          <span>TypeScript</span><span>Next.js</span><span>Prisma</span><span>Docker</span><span>Redis</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dev-hero { background: var(--paper); color: var(--ink); border-top: 1px solid var(--grey-line); }
.dev-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(28px, 4vw, 48px); align-items: center; width: 100%; }
.dev-kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: clamp(10px, 1.5vw, 12px); letter-spacing: .18em;
  border: 1px solid var(--ink); border-radius: 999px; padding: 8px 14px;
  max-width: 100%;
}
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink); display: inline-block; flex-shrink: 0; }
.dev-left { min-width: 0; }
.dev-left h2 {
  font-family: var(--font-sans); font-weight: 700;
  font-size: clamp(32px, 6vw, 72px);
  line-height: .98; letter-spacing: -0.03em;
  margin: 22px 0 18px;
  text-wrap: balance;
}
.dev-desc { color: var(--grey-text); font-size: clamp(15px, 1.8vw, 17px); line-height: 1.6; max-width: 520px; margin: 0; }
.dev-cta { display: flex; gap: 12px; margin-top: 26px; flex-wrap: wrap; }
.btn-dark { background: var(--ink); color: #fff; border-color: var(--ink); }
.btn-dark:hover { transform: translateY(-2px); box-shadow: 4px 4px 0 var(--ink); }
.btn-outline { border-color: var(--ink); color: var(--ink); background: #fff; box-shadow: 3px 3px 0 var(--ink); }
.btn-outline:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0 var(--ink); }
.code {
  margin-top: 26px; display: inline-block; max-width: 100%;
  overflow-x: auto;
  font-family: var(--font-mono); font-size: clamp(11px, 1.5vw, 13px);
  background: var(--paper-dim); border: 1px solid var(--grey-line);
  padding: 10px 16px; border-radius: 10px; color: #333;
  white-space: pre;
}
.dev-right { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.sketch-card {
  border: 1.5px solid var(--ink); border-radius: 18px; overflow: hidden;
  box-shadow: 8px 8px 0 var(--ink);
  background: var(--paper-dim);
  aspect-ratio: 1 / 1.05;
  width: 100%;
}
.sketch-card img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); }
.stack-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.stack-chips span {
  font-family: var(--font-mono); font-size: clamp(11px, 1.4vw, 12px);
  border: 1px solid var(--ink); border-radius: 999px; padding: 7px 12px; background: #fff;
}

/* ——— PC chico / tablet landscape ——— */
@media (max-width: 1024px) {
  .dev-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .sketch-card { box-shadow: 6px 6px 0 var(--ink); }
}
/* ——— Tablet portrait: apilar ——— */
@media (max-width: 900px) {
  .dev-grid { grid-template-columns: 1fr; }
  .dev-desc { max-width: 100%; }
  .sketch-card { aspect-ratio: 16 / 10; max-width: 640px; }
  .dev-right { align-items: stretch; }
}
/* ——— Celular grande ——— */
@media (max-width: 600px) {
  .dev-kicker { letter-spacing: .1em; }
  .dev-left h2 br { display: none; }
  .sketch-card { aspect-ratio: 4 / 3.4; border-radius: 14px; box-shadow: 5px 5px 0 var(--ink); }
  .dev-cta .btn { flex: 1 1 100%; }
  .code { width: 100%; }
}
/* ——— Celular chico ——— */
@media (max-width: 380px) {
  .dev-kicker { font-size: 10px; padding: 7px 10px; }
  .stack-chips { gap: 6px; }
}
/* ——— Ultra ——— */
@media (min-width: 1920px) {
  .dev-left h2 { font-size: clamp(64px, 4.5vw, 96px); }
  .sketch-card { aspect-ratio: 1 / 1; }
}
</style>
