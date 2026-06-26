import { motion } from "framer-motion";
import { INDUSTRIES, INDUSTRY_ICONS } from "../lib/constants";
import { Sparkles, TrendingUp, Activity, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Gauge } from "lucide-react";

// Assign a chart type to each industry so dashboards vary
const CHART_BY_INDUSTRY = {
  "Manufacturing": "line",
  "Education":     "pie",
  "Real Estate":   "bar",
  "Call Center":   "donut",
  "FMCG":          "bar2",
  "Logistics":     "line2",
  "Insurance":     "donut2",
  "Retail":        "heat",
};

const PALETTE = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#6D28D9", "#DDD6FE"];

// ---------------- Chart components (lightweight, no deps) ----------------
function BarChart({ values, color = "#8B5CF6" }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }} whileInView={{ height: `${(v / max) * 100}%` }} viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.6 }}
          className="flex-1 rounded-t-md"
          style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}55 100%)` }}
        />
      ))}
    </div>
  );
}

function LineChart({ values, color = "#8B5CF6" }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / (max - min || 1)) * 90 - 5;
    return [x, y];
  });
  const path = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${path} L100,100 L0,100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-20">
      <defs>
        <linearGradient id="lg-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg-fill)" />
      <motion.path d={path} fill="none" stroke={color} strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.2 }} />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill={color} />
      ))}
    </svg>
  );
}

function Donut({ value, label, color = "#8B5CF6" }) {
  const r = 32, c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <div className="relative size-24 mx-auto">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="#EDE9FE" strokeWidth="8" fill="none" />
        <motion.circle cx="40" cy="40" r={r} stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: offset }} viewport={{ once: true }}
          transition={{ duration: 1.2 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-xl font-semibold text-pdblack">{value}%</div>
        <div className="text-[9px] uppercase tracking-wider text-pdpurple/70">{label}</div>
      </div>
    </div>
  );
}

function PieSlices({ slices }) {
  // slices: [{label, value, color}]
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const r = 28, cx = 40, cy = 40;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 80 80" className="size-24">
        {slices.map((s, i) => {
          const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += s.value;
          const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
          const large = end - start > Math.PI ? 1 : 0;
          return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`} fill={s.color} />;
        })}
        <circle cx={cx} cy={cy} r={12} fill="#FFFFFF" />
      </svg>
      <div className="space-y-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-pdblack/70">
            <span className="size-2 rounded-full" style={{ background: s.color }} />
            <span className="font-medium text-pdblack/80">{s.label}</span>
            <span className="text-pdblack/50">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 21 });
  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((_, i) => {
        const intensity = ((i * 37) % 100) / 100;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.02 }}
            className="aspect-square rounded-sm"
            style={{ background: `rgba(139,92,246,${0.15 + intensity * 0.7})` }}
          />
        );
      })}
    </div>
  );
}

// ---------------- Dashboard panel (light theme, varies by chart type) -----
function MiniDashboard({ ind, icon: Icon }) {
  const type = CHART_BY_INDUSTRY[ind.name] || "bar";

  let chart, chartLabel, chartIcon;
  if (type === "line") {
    chart = <LineChart values={[40, 55, 48, 62, 70, 78, 82]} />;
    chartLabel = "Production · 7d"; chartIcon = LineIcon;
  } else if (type === "line2") {
    chart = <LineChart values={[20, 35, 30, 50, 45, 65, 70]} color="#6D28D9" />;
    chartLabel = "Deliveries · 7d"; chartIcon = LineIcon;
  } else if (type === "bar") {
    chart = <BarChart values={[55, 68, 72, 80, 88, 92, 95]} />;
    chartLabel = "Qualified leads"; chartIcon = BarChart3;
  } else if (type === "bar2") {
    chart = <BarChart values={[60, 45, 75, 50, 90, 65, 80]} color="#A78BFA" />;
    chartLabel = "Coverage by region"; chartIcon = BarChart3;
  } else if (type === "donut") {
    chart = <Donut value={70} label="Deflection" />;
    chartLabel = "L1 deflection"; chartIcon = Gauge;
  } else if (type === "donut2") {
    chart = <Donut value={88} label="Renewals" color="#6D28D9" />;
    chartLabel = "Renewal rate"; chartIcon = Gauge;
  } else if (type === "pie") {
    chart = <PieSlices slices={[
      { label: "UG",       value: 42, color: PALETTE[0] },
      { label: "PG",       value: 28, color: PALETTE[1] },
      { label: "Diploma",  value: 18, color: PALETTE[2] },
      { label: "Exec Ed",  value: 12, color: PALETTE[3] },
    ]} />;
    chartLabel = "Programme mix"; chartIcon = PieIcon;
  } else if (type === "heat") {
    chart = <Heatmap />;
    chartLabel = "Returns heatmap · 3w"; chartIcon = Activity;
  }

  const ChartIcon = chartIcon || BarChart3;

  return (
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pdpurple-bg via-white to-pdpurple-bg overflow-hidden border border-pdpurple/30 p-5 flex flex-col">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)",
                  backgroundSize: "20px 20px" }} />
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-pdpurple/15 blur-3xl pointer-events-none" />

      <div className="relative flex items-center gap-2 mb-3">
        <div className="size-7 rounded-lg bg-pdpurple/15 flex items-center justify-center">
          <Icon className="size-3.5 text-pdpurple" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-pdpurple font-semibold">{ind.name}</div>
          <div className="text-[10px] text-pdblack/55">Live operational KPIs</div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="relative grid grid-cols-2 gap-2 mb-3">
        {ind.stats.map((s) => (
          <div key={s.k} className="rounded-xl bg-white border border-pdpurple/15 px-2.5 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-pdpurple/70">{s.k}</div>
            <div className="font-display text-base text-pdblack font-semibold">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Chart panel */}
      <div className="relative rounded-xl bg-white border border-pdpurple/15 p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[10px] text-pdblack/60 mb-2">
          <span className="flex items-center gap-1 font-semibold text-pdblack/70"><ChartIcon className="size-3 text-pdpurple" /> {chartLabel}</span>
          <span className="text-emerald-600 flex items-center gap-0.5 font-semibold"><TrendingUp className="size-3" /> {ind.roi}</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full">{chart}</div>
        </div>
      </div>

      {/* Use cases */}
      <div className="relative mt-2.5 flex flex-wrap gap-1.5">
        {ind.useCases.slice(0, 3).map((u) => (
          <span key={u} className="text-[10px] px-2 py-0.5 rounded-full bg-pdpurple/10 border border-pdpurple/20 text-pdpurple">{u}</span>
        ))}
      </div>
    </div>
  );
}

// ---------------- Section ----------------
export default function Industries() {
  return (
    <section id="industries" data-testid="industries-section" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 size-[500px] rounded-full bg-pdpurple/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[500px] rounded-full bg-pdpurple-soft/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Industry Solutions</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Vertical-tuned agents,<br/>proven where it counts.
            </h2>
          </div>
          <p className="text-base lg:text-lg text-pdblack/60 max-w-md">
            Hover any card to flip and see the live operational KPIs the agent moves — each industry has its own dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INDUSTRIES.map((ind, i) => {
            const Icon = INDUSTRY_ICONS[ind.name] || Sparkles;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                data-testid={`industry-card-${ind.name.toLowerCase().replace(/\s/g,"-")}`}
                className="group [perspective:1400px] h-[440px]"
              >
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* FRONT */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl border border-pdpurple/15 bg-white p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pdpurple-bg/30 to-transparent" />
                    <div className="relative flex items-start justify-between mb-5">
                      <div className="size-14 rounded-2xl bg-pdpurple/10 border border-pdpurple/20 flex items-center justify-center">
                        <Icon className="size-7 text-pdpurple" />
                      </div>
                      <span className="text-xs font-mono text-pdpurple/70">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-semibold text-pdblack mb-3 leading-tight">{ind.name}</h3>
                    <p className="text-sm lg:text-base text-pdblack/70 leading-relaxed mb-4 line-clamp-3">{ind.challenge}</p>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-pdpurple rounded-full px-4 py-2 mb-4">
                      <Sparkles className="size-3.5" />
                      {ind.roi}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ind.useCases.slice(0, 3).map((u) => (
                        <span key={u} className="text-sm px-3 py-1 rounded-full bg-pdpurple/8 border border-pdpurple/20 text-pdblack/80">
                          {u}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-5 left-6 right-6 text-xs text-pdblack/40 flex items-center gap-1.5">
                      <Activity className="size-3.5" /> Hover for live KPIs →
                    </div>
                  </div>

                  {/* BACK — light dashboard */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <MiniDashboard ind={ind} icon={Icon} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
