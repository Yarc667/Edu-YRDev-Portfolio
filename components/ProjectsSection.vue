<template>
  <section id="proyectos" class="projects-bw">
    <div class="container">
      <!-- Bloque Full-Stack -->
      <div class="proj-head reveal">
        <span class="proj-icon">▤</span>
        <h2>Full-Stack Web</h2>
        <span class="proj-rule" />
      </div>
      <div class="cards-3">
        <article v-for="p in webProjects" :key="p.title" class="card reveal">
          <div class="card-media"><img :src="p.img" :alt="p.title" loading="lazy" /></div>
          <div class="card-body">
            <div class="tags"><span v-for="t in p.tags" :key="t">{{ t }}</span></div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
            <div class="card-actions">
              <a href="#" class="btn-mini grow">⚡ Live Demo</a>
              <a href="#" class="btn-mini sq" aria-label="Código">&lt;&gt;</a>
            </div>
          </div>
        </article>
      </div>

      <!-- Bloque Unity -->
      <div class="proj-head reveal proj-head-2">
        <span class="proj-icon">♘</span>
        <h2>Unity Game Development</h2>
        <span class="proj-rule" />
      </div>
      <div class="cards-2">
        <article v-for="g in gameProjects" :key="g.title" class="card wide reveal">
          <div class="card-media side"><img :src="g.img" :alt="g.title" loading="lazy" /></div>
          <div class="card-body">
            <div class="tags"><span>{{ g.tags }}</span></div>
            <h3>{{ g.title }}</h3>
            <p>{{ g.desc }}</p>
            <div class="card-actions">
              <a href="#" class="btn-mini dark">▶ Play Game</a>
              <a href="#" class="btn-mini">📖 Devlog</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const webProjects = [
  {
    title: 'Nexus ERP Dashboard',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    desc: 'A high-performance enterprise resource planning tool featuring real-time data synchronization and complex state management.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Chronos Portfolio',
    tags: ['Next.js', 'Tailwind', 'Prisma'],
    desc: 'An ultra-fast, SEO-optimized portfolio engine designed for creative developers and digital artists.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'SyncStream Core',
    tags: ['Go', 'Redis', 'Docker'],
    desc: 'A backend infrastructure project focused on low-latency data streaming and microservices orchestration.',
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop'
  }
]
const gameProjects = [
  {
    title: 'Ink & Iron',
    tags: 'C# • Unity 3D • ShaderLab',
    desc: 'A tactical RPG with a unique hand-drawn aesthetic where every frame looks like a digital painting. Built with custom SRP shaders.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Void Runner',
    tags: 'C# • Unity 2D • ProBuilder',
    desc: 'A minimalist precision platformer exploring abstract architectural spaces. Features custom gravity mechanics and procedural levels.',
    img: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?q=80&w=800&auto=format&fit=crop'
  }
]
</script>

<style scoped>
.projects-bw { background: var(--paper); color: var(--ink); }
.proj-head { display: flex; align-items: center; gap: 12px; min-width: 0; }
.proj-head-2 { margin-top: clamp(40px, 6vw, 64px); }
.proj-icon { font-size: 20px; flex-shrink: 0; }
.proj-head h2 {
  font-family: var(--font-mono);
  font-size: clamp(18px, 3vw, 30px);
  font-weight: 700; margin: 0; white-space: nowrap;
}
.proj-rule { flex: 1; height: 2px; background: var(--ink); min-width: 24px; }
.cards-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 2.4vw, 28px); margin-top: clamp(18px, 3vw, 28px); }
.cards-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(16px, 2.4vw, 28px); margin-top: clamp(18px, 3vw, 28px); }
.card {
  border: 1.5px solid var(--ink); border-radius: 4px;
  background: #fff; overflow: hidden;
  box-shadow: 5px 5px 0 var(--ink);
  display: flex; flex-direction: column;
  transition: transform .2s ease, box-shadow .2s ease;
  min-width: 0;
}
.card:hover { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 var(--ink); }
.card.wide { flex-direction: row; }
.card-media { background: #111; aspect-ratio: 16/9.5; overflow: hidden; border-bottom: 1.5px solid var(--ink); }
.card-media.side { border-bottom: none; border-right: 1.5px solid var(--ink); width: 44%; aspect-ratio: auto; min-height: 100%; flex-shrink: 0; }
.card-media img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.08); }
.card.wide .card-body { width: 56%; }
.card-body { padding: clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px) clamp(16px, 2vw, 20px); display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tags span { font-family: var(--font-mono); font-size: clamp(10px, 1.4vw, 11.5px); background: var(--grey-tag); padding: 5px 9px; border-radius: 4px; color: #444; }
.card-body h3 { font-family: var(--font-mono); font-size: clamp(16px, 2vw, 19px); margin: 0; text-wrap: balance; }
.card-body p { font-size: clamp(13px, 1.6vw, 14px); line-height: 1.55; color: var(--grey-text); margin: 0; min-height: 66px; }
.card-actions { display: flex; gap: 10px; margin-top: 8px; }
.btn-mini {
  border: 1.5px solid var(--ink); background: #fff; color: var(--ink);
  font-family: var(--font-mono); font-size: 12px; font-weight: 500;
  padding: 11px 14px; border-radius: 4px; text-decoration: none;
  box-shadow: 3px 3px 0 var(--ink);
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  white-space: nowrap;
}
.btn-mini.grow { flex: 1; }
.btn-mini.dark { background: var(--ink); color: #fff; }
.btn-mini.sq { padding: 11px 13px; }

/* ——— PC chico: 3 → 2 (la tercera ocupa 2) ——— */
@media (max-width: 1100px) {
  .cards-3 { grid-template-columns: repeat(2, 1fr); }
  .cards-3 .card:last-child { grid-column: span 2; flex-direction: row; }
  .cards-3 .card:last-child .card-media { width: 44%; border-bottom: none; border-right: 1.5px solid var(--ink); aspect-ratio: auto; min-height: 220px; }
  .cards-3 .card:last-child .card-body { width: 56%; }
  .cards-2 { grid-template-columns: 1fr; max-width: 760px; }
}
/* ——— Tablet: todo a 1 columna ——— */
@media (max-width: 960px) {
  .cards-3 { grid-template-columns: 1fr; max-width: 640px; margin-inline: auto; }
  .cards-3 .card:last-child { grid-column: span 1; flex-direction: column; }
  .cards-3 .card:last-child .card-media { width: 100%; border-right: none; border-bottom: 1.5px solid var(--ink); aspect-ratio: 16/9.5; }
  .cards-3 .card:last-child .card-body { width: 100%; }
  .cards-2 { max-width: 640px; margin-inline: auto; }
  .card.wide { flex-direction: column; }
  .card-media.side { width: 100%; border-right: none; border-bottom: 1.5px solid var(--ink); aspect-ratio: 16/9.5; min-height: 0; }
  .card.wide .card-body { width: 100%; }
  .card-body p { min-height: 0; }
}
/* ——— Celular: títulos con wrap, botones apilados ——— */
@media (max-width: 640px) {
  .proj-head h2 { white-space: normal; line-height: 1.15; }
  .proj-head { gap: 10px; }
  .cards-3, .cards-2 { max-width: 100%; gap: 18px; }
  .card { box-shadow: 4px 4px 0 var(--ink); }
  .card-actions { flex-wrap: wrap; }
  .card-actions .btn-mini { flex: 1 1 140px; }
}
@media (max-width: 380px) {
  .proj-icon { display: none; }
  .btn-mini { font-size: 11px; padding: 10px 12px; }
}
/* ——— Ultra ——— */
@media (min-width: 1920px) {
  .cards-3, .cards-2 { gap: 36px; }
}
</style>
