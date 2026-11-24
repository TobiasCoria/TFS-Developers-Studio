const canvas = document.querySelector('.ambient-particles');
const ctx = canvas?.getContext('2d', { alpha: true });

if (canvas && ctx) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData === true;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let visible = !document.hidden;
  let pointer = { x: -1000, y: -1000 };
  let particles = [];
  const palette = ['196, 160, 255', '221, 216, 233', '164, 104, 226', '123, 193, 158'];

  const seed = () => {
    const base = innerWidth < 760 ? 18 : 38;
    const count = saveData ? Math.ceil(base * 0.48) : base;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.3,
      vx: (Math.random() - 0.5) * (reducedMotion.matches ? 0 : 0.24),
      vy: (Math.random() - 0.5) * (reducedMotion.matches ? 0 : 0.19),
      tint: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.46 + 0.18,
    }));
  };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
    draw();
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      if (!reducedMotion.matches) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 110) {
          const force = ((110 - distance) / 110) * 0.018;
          p.x += (dx / distance) * force;
          p.y += (dy / distance) * force;
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.tint},${p.alpha})`;
      ctx.fill();
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5.5);
      halo.addColorStop(0, `rgba(${p.tint},${p.alpha * 0.34})`);
      halo.addColorStop(1, `rgba(${p.tint},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(p.x - p.radius * 5.5, p.y - p.radius * 5.5, p.radius * 11, p.radius * 11);

      if (innerWidth > 760 && !saveData && i % 2 === 0) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(190,166,235,${(1 - distance / 115) * 0.105})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    }
  };

  const animate = () => {
    if (!visible || reducedMotion.matches) return;
    draw();
    raf = requestAnimationFrame(animate);
  };
  const start = () => {
    cancelAnimationFrame(raf);
    if (visible && !reducedMotion.matches) raf = requestAnimationFrame(animate);
    else draw();
  };
  const onPointer = (event) => { pointer = { x: event.clientX, y: event.clientY }; };
  const onVisibility = () => { visible = !document.hidden; start(); };
  const onMotion = () => { seed(); start(); };

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotion);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
  }, { once: true });
  resize();
  start();
}
