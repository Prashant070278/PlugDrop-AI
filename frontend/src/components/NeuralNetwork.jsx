import { useEffect, useRef } from "react";

/**
 * Animated AI neural-network background with floating particles,
 * dynamic connections, and a subtle 3D-feel via radial purple gradients.
 * Pure canvas — high performance, no extra deps.
 */
export default function NeuralNetwork({ density = 0.00009, opacity = 0.45 }) {
  const ref = useRef(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let nodes = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(70, Math.round(w * h * density)));
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 1.8,
        hue: 260 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.parentElement?.addEventListener("mousemove", onMove);
    canvas.parentElement?.addEventListener("mouseleave", onLeave);

    let t0 = performance.now();
    const draw = (t) => {
      const dt = Math.min(33, t - t0); t0 = t;
      ctx.clearRect(0, 0, w, h);

      // Subtle background glow blobs (3D-feel)
      const glowA = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, w * 0.5);
      glowA.addColorStop(0, "rgba(167,139,250,0.20)");
      glowA.addColorStop(1, "rgba(167,139,250,0)");
      ctx.fillStyle = glowA; ctx.fillRect(0, 0, w, h);

      const glowB = ctx.createRadialGradient(w * 0.85, h * 0.7, 0, w * 0.85, h * 0.7, w * 0.5);
      glowB.addColorStop(0, "rgba(139,92,246,0.15)");
      glowB.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = glowB; ctx.fillRect(0, 0, w, h);

      // Update + draw nodes
      for (const n of nodes) {
        n.x += n.vx * (dt / 16);
        n.y += n.vy * (dt / 16);
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.phase += 0.04;

        // Mouse attraction
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 22500) {
          const f = (1 - md2 / 22500) * 0.04;
          n.vx -= (mdx / Math.sqrt(md2 + 1)) * f * 0.5;
          n.vy -= (mdy / Math.sqrt(md2 + 1)) * f * 0.5;
        }

        // Pulse
        const pulse = (Math.sin(n.phase) + 1) * 0.5;
        const r = n.r + pulse * 1.4;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grad.addColorStop(0, `hsla(${n.hue}, 90%, 65%, ${opacity})`);
        grad.addColorStop(1, "hsla(265, 90%, 65%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = `hsla(${n.hue}, 90%, 70%, ${0.55 + pulse * 0.35})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const MAX = 140 * 140;
          if (d2 < MAX) {
            const al = (1 - d2 / MAX) * 0.35;
            ctx.strokeStyle = `hsla(265, 80%, 65%, ${al * opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

            // Travelling data packet
            const phase = ((t * 0.0005) + (i * 0.13 + j * 0.07)) % 1;
            const px = a.x + (b.x - a.x) * phase;
            const py = a.y + (b.y - a.y) * phase;
            ctx.fillStyle = `hsla(280, 95%, 75%, ${al * 1.5})`;
            ctx.beginPath(); ctx.arc(px, py, 1.4, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, [density, opacity]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
