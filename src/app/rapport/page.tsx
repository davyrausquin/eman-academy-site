"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const speler = {
  naam: "Jayden",
  leeftijd: 11,
  club: "SV Loosduinen",
  categorie: "JO-13",
  positie: "Aanvaller",
  maand: "Maart",
  jaar: 2026,
  sessiesAanwezig: 4,
  sessiesTotaal: 4,
};

const categorieLabels = ["Techniek", "Snelheid", "Mentaliteit", "Passing", "Afwerking"];

const scoresHuidig = [7, 6, 8, 5, 7];
const scoresVorig = [6, 6, 7, 5, 6];

const watGoedGing = [
  "Mentaal de sterkste van de groep deze maand. Gaf niet op bij de zware conditieoefening terwijl anderen stopten.",
  "Dribbel naar binnen is flink verbeterd — durft nu sneller de actie te zoeken.",
  "Eerste aanname met rechts is betrouwbaar geworden onder druk.",
];

const waarWeAanWerken = [
  "Passing onder druk: Jayden kaatst te gehaast als er een tegenstander dichtbij komt. We oefenen: ontvangen, hoofd omhoog, dan pas spelen.",
  "Afwerking met links: 80% van zijn schoten gaat met rechts. We trainen elke sessie 3 afwerkvormen met links.",
  "Speelherkenning bij combinaties: Jayden zoekt te vaak zelf de oplossing. We werken aan het vinden van de vrije man.",
];

const doelen = [
  "7 van de 10 passes succesvol afspelen onder druk (gemeten in oefenvorm)",
  "Minimaal 3 afwerkpogingen met links per sessie",
  "1x per sessie bewust de vrije man vinden in een combinatie-oefening",
];

/* ═══════════════════════════════════════════════════════════
   RADAR CHART (SVG)
   ═══════════════════════════════════════════════════════════ */

function RadarChart({
  current,
  previous,
  labels,
}: {
  current: number[];
  previous: number[];
  labels: string[];
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cx = 200;
  const cy = 200;
  const maxR = 140;
  const levels = 5;
  const count = labels.length;

  function pointOnAxis(index: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 10) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function polygonPoints(values: number[]): string {
    return values.map((v, i) => pointOnAxis(i, v).join(",")).join(" ");
  }

  // Grid rings
  const rings = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * maxR;
    const pts = Array.from({ length: count }, (_, j) => {
      const angle = (Math.PI * 2 * j) / count - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
    return pts;
  });

  // Axis lines
  const axes = Array.from({ length: count }, (_, i) => {
    const [x, y] = pointOnAxis(i, 10);
    return { x1: cx, y1: cy, x2: x, y2: y };
  });

  // Label positions (pushed outward)
  const labelPositions = labels.map((label, i) => {
    const [x, y] = pointOnAxis(i, 12.2);
    return { label, x, y, score: current[i] };
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 400"
      className="mx-auto w-full max-w-[400px]"
    >
      {/* Grid */}
      {rings.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {axes.map((a, i) => (
        <line
          key={i}
          {...a}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Previous month (ghost) */}
      <polygon
        points={animated ? polygonPoints(previous) : polygonPoints(Array(count).fill(0))}
        fill="rgba(212,168,67,0.08)"
        stroke="rgba(212,168,67,0.3)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className="transition-all duration-1000 ease-out"
      />

      {/* Current month */}
      <polygon
        points={animated ? polygonPoints(current) : polygonPoints(Array(count).fill(0))}
        fill="rgba(26,58,107,0.25)"
        stroke="#3b7dd8"
        strokeWidth="2"
        className="transition-all duration-1000 ease-out"
        style={{ transitionDelay: "200ms" }}
      />

      {/* Current month dots */}
      {current.map((v, i) => {
        const [x, y] = pointOnAxis(i, animated ? v : 0);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#3b7dd8"
            stroke="#0a0a0a"
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
            style={{ transitionDelay: "200ms" }}
          />
        );
      })}

      {/* Labels + scores */}
      {labelPositions.map((l, i) => (
        <g key={i}>
          <text
            x={l.x}
            y={l.y - 8}
            textAnchor="middle"
            className="fill-white/50 text-[11px] font-semibold uppercase"
            style={{ letterSpacing: "0.05em" }}
          >
            {l.label}
          </text>
          <text
            x={l.x}
            y={l.y + 8}
            textAnchor="middle"
            className="fill-accent text-[13px] font-bold"
          >
            {l.score}/10
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   BAR CHART
   ═══════════════════════════════════════════════════════════ */

function BarChart({
  current,
  previous,
  labels,
}: {
  current: number[];
  previous: number[];
  labels: string[];
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      {labels.map((label, i) => {
        const diff = current[i] - previous[i];
        const diffLabel =
          diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "=";
        const diffColor =
          diff > 0
            ? "text-emerald-400"
            : diff < 0
            ? "text-red-400"
            : "text-white/30";

        return (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-white">
                  {current[i]}/10
                </span>
                <span className={`text-[12px] font-bold ${diffColor}`}>
                  {diffLabel}
                </span>
              </div>
            </div>
            <div className="relative h-3 overflow-hidden bg-white/[0.04]">
              {/* Previous month bar (behind) */}
              <div
                className="absolute inset-y-0 left-0 bg-white/[0.06] transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${previous[i] * 10}%` : "0%",
                }}
              />
              {/* Current month bar */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-navy to-accent transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${current[i] * 10}%` : "0%",
                  transitionDelay: "150ms",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-6 bg-gradient-to-r from-navy to-accent" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
            {speler.maand} {speler.jaar}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-6 bg-white/[0.06]" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
            Vorige maand
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATTENDANCE DOTS
   ═══════════════════════════════════════════════════════════ */

function Aanwezigheid({
  aanwezig,
  totaal,
}: {
  aanwezig: number;
  totaal: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: totaal }, (_, i) => (
          <div
            key={i}
            className={`h-3.5 w-3.5 rounded-full transition-all duration-500 ${
              i < aanwezig
                ? "bg-accent shadow-[0_0_8px_rgba(59,125,216,0.4)]"
                : "bg-white/[0.08]"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <span className="text-[13px] font-medium text-white/50">
        {aanwezig} van {totaal} sessies aanwezig
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */

export default function RapportVoorbeeld() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-gradient-to-r from-navy/20 via-[#0a0a0a] to-navy/20">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="flex items-start justify-between">
            <div>
              <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <span className="font-display text-3xl tracking-[0.2em] text-accent/30 sm:text-4xl">
                  EA
                </span>
                <div>
                  <p className="font-display text-lg tracking-[0.25em] text-white sm:text-xl">
                    EMAN ACADEMY
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/20">
                    Echte training voelt zo.
                  </p>
                </div>
              </a>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent/60">
                Maandrapport
              </p>
              <p className="mt-1 font-display text-2xl tracking-wide sm:text-3xl">
                {speler.maand}
              </p>
              <p className="text-[13px] text-white/30">{speler.jaar}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Spelerprofiel */}
        <section className="mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent/60">
            Spelerprofiel
          </p>
          <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
                  {speler.naam}
                </h2>
                <p className="mt-1 text-[14px] text-white/40">
                  {speler.leeftijd} jaar · {speler.club}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:gap-2">
                <span className="border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70">
                  {speler.categorie}
                </span>
                <span className="border border-white/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  {speler.positie}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">
                Aanwezigheid
              </p>
              <Aanwezigheid
                aanwezig={speler.sessiesAanwezig}
                totaal={speler.sessiesTotaal}
              />
            </div>
          </div>
        </section>

        {/* Scores — Radar */}
        <section className="mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent/60">
            Scores — Overzicht
          </p>
          <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
            <RadarChart
              current={scoresHuidig}
              previous={scoresVorig}
              labels={categorieLabels}
            />
            {/* Radar legend */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-6 bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                  {speler.maand} {speler.jaar}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-6 border-t-[1.5px] border-dashed border-[rgba(212,168,67,0.5)]" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                  Vorige maand
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Scores — Bars */}
        <section className="mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent/60">
            Scores — Detail
          </p>
          <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
            <BarChart
              current={scoresHuidig}
              previous={scoresVorig}
              labels={categorieLabels}
            />
          </div>
        </section>

        {/* Coach Feedback */}
        <section className="mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent/60">
            Feedback van Coach Sam
          </p>

          <div className="space-y-4">
            {/* Wat goed ging */}
            <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center bg-emerald-500/10 text-[14px]">
                  💪
                </span>
                <h3 className="font-display text-xl tracking-wide sm:text-2xl">
                  Wat goed ging
                </h3>
              </div>
              <ul className="space-y-3">
                {watGoedGing.map((punt, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
                    <p className="text-[14px] leading-[1.7] text-white/50">
                      {punt}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Waar we aan werken */}
            <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center bg-amber-500/10 text-[14px]">
                  🎯
                </span>
                <h3 className="font-display text-xl tracking-wide sm:text-2xl">
                  Waar we aan werken
                </h3>
              </div>
              <ul className="space-y-3">
                {waarWeAanWerken.map((punt, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/60" />
                    <p className="text-[14px] leading-[1.7] text-white/50">
                      {punt}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Doelen */}
        <section className="mb-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent/60">
            Doelen — April 2026
          </p>
          <div className="border border-white/[0.06] bg-card p-6 sm:p-8">
            <ul className="space-y-3">
              {doelen.map((doel, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-accent/25 bg-accent/5 text-[10px] text-accent/50">
                    {i + 1}
                  </span>
                  <p className="text-[14px] leading-[1.7] text-white/50">
                    {doel}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-lg tracking-[0.25em] text-white/20">
            EMAN ACADEMY
          </p>
          <p className="mt-1 text-[12px] italic text-white/15">
            Echte training voelt zo.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-white/15">
            <span>emanacademy.nl</span>
            <span>·</span>
            <span>info@emanacademy.nl</span>
            <span>·</span>
            <span>+31 6 00 00 00 00</span>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/10">
            Een Catalina Group onderneming
          </p>
        </div>
      </footer>
    </div>
  );
}
