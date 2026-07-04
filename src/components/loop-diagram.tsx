// Döngü signature — Bridge'in akılda kalan görseli.
// 6 phase bir daire üzerinde, gerçek bir sequence (01→06) ve ↻ merkezde.
// Phases: Havuz → Keşif → Dizin → Takım → Katılım → Sonuç → (havuza dönüş)
const PHASES = [
  { n: "01", label: "Havuz", short: "Yetenek" },
  { n: "02", label: "Keşif", short: "Hangi & neden" },
  { n: "03", label: "Dizin", short: "DoraHacks" },
  { n: "04", label: "Takım", short: "Atama" },
  { n: "05", label: "Katılım", short: "Yarış" },
  { n: "06", label: "Sonuç", short: "Dönüş ↻" },
] as const;

const R = 112;
const CX = 168;
const CY = 168;

function nodePos(i: number) {
  const angle = (-90 + i * 60) * (Math.PI / 180);
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
}

export function LoopDiagram({ className = "" }: { className?: string }) {
  const points = PHASES.map((_, i) => nodePos(i));

  return (
    <svg
      viewBox="0 0 336 336"
      className={className}
      role="img"
      aria-label="Hackathon katılım döngüsü: havuz, keşif, dizin, takım, katılım, sonuç ve havuza dönüş"
    >
      <defs>
        <linearGradient id="ld-emerald" x1="0" y1="0" x2="336" y2="336">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <radialGradient id="ld-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(16,185,129,0.18)" />
          <stop offset="1" stopColor="rgba(16,185,129,0)" />
        </radialGradient>
      </defs>

      {/* core glow */}
      <circle cx={CX} cy={CY} r="64" fill="url(#ld-core)" />

      {/* connecting loop track (animated dash) */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(16,185,129,0.28)"
        strokeWidth="1.5"
        className="loop-track"
      />

      {/* phase nodes */}
      {PHASES.map((p, i) => {
        const { x, y } = points[i];
        const isAmber = i === 4 || i === 5; // katılım + sonuç amber (ödül)
        const fill = isAmber ? "#f59e0b" : "#10b981";
        return (
          <g key={p.n}>
            <circle
              cx={x}
              cy={y}
              r="20"
              fill="#0a0a0b"
              stroke={fill}
              strokeWidth="1.8"
            />
            <text
              x={x}
              y={y - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono), monospace"
              fontSize="11"
              fontWeight="600"
              fill={fill}
            >
              {p.n}
            </text>
            <text
              x={x}
              y={y + 34}
              textAnchor="middle"
              fontFamily="var(--font-display), sans-serif"
              fontSize="12"
              fontWeight="600"
              fill="#e4e4e7"
            >
              {p.label}
            </text>
            <text
              x={x}
              y={y + 48}
              textAnchor="middle"
              fontFamily="var(--font-mono), monospace"
              fontSize="8.5"
              fill="#71717a"
            >
              {p.short}
            </text>
          </g>
        );
      })}

      {/* center mark */}
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="#e4e4e7"
        letterSpacing="0.1em"
      >
        DÖNGÜ
      </text>
      <text
        x={CX}
        y={CY + 16}
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="22"
        fill="#34d399"
      >
        ↻
      </text>
    </svg>
  );
}
