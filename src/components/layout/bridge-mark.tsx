// Bridge mark — köprü + döngü imzası. İki kavisli köprü kemerinin
// bir döngü (↻) oluşturduğu küçük logo. Emerald ana + amber düğüm.
export function BridgeMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bm-g" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* bridge arches forming a loop */}
      <path
        d="M6 30 C 10 14, 30 14, 34 30"
        stroke="url(#bm-g)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 30 C 13 20, 27 20, 30 30"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* loop node (amber) — the pivot where the cycle returns */}
      <circle cx="20" cy="20" r="3" fill="#f59e0b" />
      {/* base line */}
      <path
        d="M5 31 H 35"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
