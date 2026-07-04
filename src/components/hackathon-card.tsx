import Link from "next/link";
import type { DiscoveredHackathon, HackathonTrack, Chain } from "@/lib/discovered-hackathons";
import { STATUS_LABELS } from "@/lib/discovered-hackathons";

const TRACK_STYLES: Partial<Record<HackathonTrack, string>> = {
  "DeFi": "text-emerald-bright border-emerald/25 bg-emerald/8",
  "NFT/Gaming": "text-amber-bright border-amber/25 bg-amber/8",
  "Infra/Tooling": "text-sky-300 border-sky-400/25 bg-sky-400/8",
  "ZK/Privacy": "text-violet-300 border-violet-400/25 bg-violet-400/8",
  "AI×Web3": "text-pink-300 border-pink-400/25 bg-pink-400/8",
  "Public Goods": "text-emerald-bright border-emerald/25 bg-emerald/8",
  "Social/Consumer": "text-orange-300 border-orange-400/25 bg-orange-400/8",
  "Other": "text-faint border-white/15 bg-white/5",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function dateRange(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("tr-TR", { day: "numeric" })}–${e.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function HackathonCard({ h }: { h: DiscoveredHackathon }) {
  const st = STATUS_LABELS[h.status];
  const toneClass =
    st.tone === "emerald"
      ? "text-emerald-bright bg-emerald/10 border-emerald/25"
      : st.tone === "amber"
      ? "text-amber-bright bg-amber/10 border-amber/25"
      : "text-faint bg-white/5 border-white/10";

  return (
    <Link
      href={`/hackathons/${h.id}`}
      className="glass rounded-xl p-5 card-lift block group flex flex-col h-full"
    >
      {/* Üst: status + kaynak */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-mono ${toneClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${st.tone === "emerald" ? "bg-emerald" : st.tone === "amber" ? "bg-amber" : "bg-zinc-500"} ${h.status === "upcoming" ? "animate-pulse" : ""}`} />
          {st.label}
        </span>
        <span className="font-mono text-[0.6rem] text-faint truncate">{h.source}</span>
      </div>

      {/* İsim + organizer */}
      <h3 className="font-display font-semibold text-fog text-[15px] leading-tight group-hover:text-emerald-bright transition-colors">
        {h.name}
      </h3>
      <div className="text-xs text-mist mt-0.5">{h.organizer}</div>

      {/* Tarih + konum */}
      <div className="flex items-center gap-3 mt-3 text-[0.72rem] text-faint font-mono">
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
          </svg>
          {dateRange(h.dateStart, h.dateEnd)}
        </span>
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {h.location}
        </span>
      </div>

      {/* Tracks */}
      {h.tracks.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {h.tracks.map((t) => (
            <span key={t} className={`text-[0.6rem] font-mono px-1.5 py-0.5 rounded border ${TRACK_STYLES[t] ?? TRACK_STYLES.Other}`}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Alt: zincir + ödül */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-line">
        <div className="flex items-center gap-1 flex-wrap">
          {h.chains.slice(0, 3).map((c) => (
            <span key={c} className="text-[0.62rem] font-mono text-faint">
              {c}
            </span>
          ))}
          {h.chains.length > 3 && <span className="text-[0.62rem] font-mono text-faint">+{h.chains.length - 3}</span>}
        </div>
        {h.prizePool && (
          <span className="font-mono text-xs text-amber-bright">{h.prizePool}</span>
        )}
      </div>
    </Link>
  );
}
