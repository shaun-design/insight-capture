"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ─── Design tokens ────────────────────────────────────────────────────────────

// Single brand palette — all chart elements derive from these
const C = {
  brand:    "#2651A6",           // active bar, primary donut segment
  b80:      "rgba(38,81,166,0.80)", // bar near-current
  b55:      "rgba(38,81,166,0.55)",
  b35:      "rgba(38,81,166,0.35)",
  b20:      "rgba(38,81,166,0.20)",
  b10:      "rgba(38,81,166,0.10)",
  grid:     "#eef0f5",
  tick:     "#aab4c0",
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const activityData = [
  { month: "Nov", hours: 168 },
  { month: "Dec", hours: 142 },
  { month: "Jan", hours: 198 },
  { month: "Feb", hours: 221 },
  { month: "Mar", hours: 207 },
  { month: "Apr", hours: 248 },
];

// Monochromatic blue ramp — same hue, descending saturation/lightness
const distributionData = [
  { name: "Instructional Coaching", value: 38, color: C.brand },
  { name: "Curriculum Support",     value: 24, color: C.b80  },
  { name: "Leadership Dev.",        value: 18, color: C.b55  },
  { name: "Data Review",            value: 13, color: C.b35  },
  { name: "Other",                  value:  7, color: C.b20  },
];

// ─── Metric card data ─────────────────────────────────────────────────────────

type MetricCardData = {
  label: string;
  value: string;
  unit?: string;
  trend?: { arrow: "up" | "neutral"; text: string };
  sub: string;
  icon: React.ReactNode;
};

const metricCards: MetricCardData[] = [
  {
    label: "Total Coaching Hours",
    value: "1,284",
    unit: "hrs",
    trend: { arrow: "up", text: "+12%" },
    sub: "from last month",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="10" cy="10" r="7.5" />
        <polyline points="10 6 10 10 13 12.5" />
      </svg>
    ),
  },
  {
    label: "Coaching Investment",
    value: "$24,500",
    sub: "this quarter · Q2 2026",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2.5" y="5.5" width="15" height="11" rx="1.5" />
        <path d="M5.5 5.5V4a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14.5 4v1.5" />
        <path d="M7 10.5h6M7 13h3" />
      </svg>
    ),
  },
  {
    label: "Coverage Rate",
    value: "78%",
    trend: { arrow: "up", text: "+6 pts" },
    sub: "214 teachers coached",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="7.5" cy="6.5" r="2.5" />
        <circle cx="13.5" cy="6.5" r="2.5" />
        <path d="M2.5 17c0-3 2.24-5 5-5h5c2.76 0 5 2 5 5" />
      </svg>
    ),
  },
  {
    label: "Avg. Teacher Growth",
    value: "+1.4",
    unit: "pts",
    trend: { arrow: "up", text: "↑ above cycle avg" },
    sub: "rubric-based scoring",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="3 14 7.5 9 11 12.5 17 6" />
        <polyline points="14 6 17 6 17 9" />
      </svg>
    ),
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function MetricCard({ card, delay }: { card: MetricCardData; delay: number }) {
  return (
    <div
      className="rmd-card rmd-metric-card"
      style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="rmd-card-top">
        <p className="rmd-label">{card.label}</p>
        <span className="rmd-icon-badge">{card.icon}</span>
      </div>

      <p className="rmd-value">
        {card.value}
        {card.unit && <span className="rmd-unit"> {card.unit}</span>}
      </p>

      <div className="rmd-meta">
        {card.trend && (
          <span className="rmd-trend">{card.trend.text}</span>
        )}
        <span className="rmd-sub">{card.sub}</span>
      </div>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: readonly {value: unknown}[]; label?: string | number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rmd-tooltip">
      <p className="rmd-tt-label">{label}</p>
      <p className="rmd-tt-value">{String(payload[0].value)} hrs</p>
    </div>
  );
}

function ActivityChart() {
  const last = activityData.length - 1;
  return (
    <div className="rmd-card rmd-chart-card" style={{ animationDelay: "280ms" } as React.CSSProperties}>
      <div className="rmd-chart-header">
        <div>
          <p className="rmd-chart-title">Coaching Activity</p>
          <p className="rmd-chart-sub">Monthly hours · Nov 2025 – Apr 2026</p>
        </div>
        <span className="rmd-trend rmd-chart-trend">+47.6% YTD</span>
      </div>
      <div className="rmd-chart-body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={activityData}
            barCategoryGap="42%"
            margin={{ top: 4, right: 2, left: -24, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke={C.grid} strokeDasharray="0" />
            <XAxis
              dataKey="month"
              tick={{ fill: C.tick, fontSize: 10.5, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.tick, fontSize: 10.5 }}
              axisLine={false}
              tickLine={false}
              tickCount={4}
            />
            <Tooltip
              cursor={{ fill: C.b10, radius: 4 }}
              content={(props) => <BarTooltip active={props.active} payload={props.payload as readonly {value: unknown}[] | undefined} label={props.label} />}
            />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {activityData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === last ? C.brand : C.b35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DistributionChart() {
  const total = distributionData.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rmd-card rmd-chart-card" style={{ animationDelay: "350ms" } as React.CSSProperties}>
      <div className="rmd-chart-header">
        <div>
          <p className="rmd-chart-title">Coaching by Area</p>
          <p className="rmd-chart-sub">Distribution of hours · Apr 2026</p>
        </div>
      </div>
      <div className="rmd-dist-body">
        <div className="rmd-donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="92%"
                paddingAngle={1.5}
                strokeWidth={0}
              >
                {distributionData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="rmd-legend">
          {distributionData.map((d) => (
            <li key={d.name} className="rmd-legend-row">
              <span className="rmd-legend-dot" style={{ background: d.color }} />
              <span className="rmd-legend-name">{d.name}</span>
              <span className="rmd-legend-pct">
                {Math.round((d.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ResultsMetricsDashboard() {
  return (
    <div className="rmd-dashboard">
      <div className="rmd-metric-row">
        {metricCards.map((c, i) => (
          <MetricCard key={c.label} card={c} delay={i * 65} />
        ))}
      </div>
      <div className="rmd-chart-row">
        <ActivityChart />
        <DistributionChart />
      </div>
    </div>
  );
}
