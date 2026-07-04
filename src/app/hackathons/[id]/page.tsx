import Link from "next/link";
import { notFound } from "next/navigation";
import { DISCOVERED_HACKATHONS, STATUS_LABELS } from "@/lib/discovered-hackathons";
import { SEED_MEMBERS } from "@/lib/seed-members";

export function generateStaticParams() {
  return DISCOVERED_HACKATHONS.map((h) => ({ id: h.id }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Basit uygunluk önerisi: skill/track örtüşmesi olan müsait üyeler
function suggestMembers(hackathonTracks: string[]) {
  const trackToSkills: Record<string, string[]> = {
    "DeFi": ["DeFi & Tokenomics", "Solidity", "Smart Contract Development"],
    "NFT/Gaming": ["Solidity", "Next.js / React", "Game Development (on-chain)"],
    "Infra/Tooling": ["Smart Contract Development", "Backend / API Development", "DevOps & Infrastructure"],
    "ZK/Privacy": ["zk-Proofs & Cryptography", "Security & Smart Contract Auditing"],
    "AI×Web3": ["AI × Blockchain", "Data Analysis & Scripting", "Next.js / React"],
    "Public Goods": ["Solidity", "Research & Analysis", "Technical Writing & Documentation"],
    "Social/Consumer": ["UI/UX Design", "Frontend Development", "Community Management / DevRel"],
    "Other": [],
  };
  const wanted = new Set<string>();
  hackathonTracks.forEach((t) => (trackToSkills[t] ?? []).forEach((s) => wanted.add(s)));

  return SEED_MEMBERS.filter(
    (m) => m.availability.status !== "unavailable" && m.skills.some((s) => wanted.has(s.name))
  ).slice(0, 4);
}

export default function HackathonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <DetailContent params={params} />;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-sm text-fog">{value}</div>
    </div>
  );
}

async function DetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = DISCOVERED_HACKATHONS.find((x) => x.id === id);
  if (!h) notFound();

  const st = STATUS_LABELS[h.status];
  const suggested = suggestMembers(h.tracks);

  return (
    <div className="space-y-6">
      <Link
        href="/discovery"
        className="inline-flex items-center gap-1.5 text-sm text-faint hover:text-mist transition-colors"
      >
        <span aria-hidden>←</span> Keşfe dön
      </Link>

      {/* Başlık */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-mono ${
                st.tone === "emerald" ? "text-emerald-bright bg-emerald/10 border-emerald/25" :
                st.tone === "amber" ? "text-amber-bright bg-amber/10 border-amber/25" :
                "text-faint bg-white/5 border-white/10"
              }`}>
                {st.label}
              </span>
              <span className="font-mono text-[0.65rem] text-faint">{h.source}</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-fog leading-tight">
              {h.name}
            </h1>
            <div className="text-mist mt-1">{h.organizer}</div>
          </div>
          {h.prizePool && (
            <div className="text-right shrink-0">
              <div className="font-mono text-2xl font-bold text-amber-bright">{h.prizePool}</div>
              <div className="eyebrow mt-1">ödül havuzu</div>
            </div>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t border-line">
          <Meta label="Başlangıç" value={formatDate(h.dateStart)} />
          <Meta label="Bitiş" value={h.dateEnd ? formatDate(h.dateEnd) : "—"} />
          <Meta label="Konum" value={h.location} />
          <Meta label="Başvuru deadline" value={h.applicationDeadline ? formatDate(h.applicationDeadline) : "—"} />
        </div>

        {h.externalLink && (
          <a
            href={h.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 rounded-lg bg-emerald text-ink font-semibold text-sm px-4 py-2.5 hover:bg-emerald-bright transition-colors"
          >
            Resmi siteye git
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>

      {/* Tracks + Chains */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="eyebrow mb-3">Track'ler</div>
          {h.tracks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {h.tracks.map((t) => (
                <span key={t} className="skill-pill">{t}</span>
              ))}
            </div>
          ) : (
            <div className="text-faint text-sm">Track belirtilmemiş</div>
          )}
        </div>
        <div className="glass rounded-xl p-5">
          <div className="eyebrow mb-3">Zincirler</div>
          {h.chains.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {h.chains.map((c) => (
                <span key={c} className="skill-pill amber">{c}</span>
              ))}
            </div>
          ) : (
            <div className="text-faint text-sm">Zincir belirtilmemiş</div>
          )}
        </div>
      </div>


      {/* Neden uygun — AI notları */}
      {h.notes && (
        <div className="glass rounded-xl p-5 border-l-2 border-l-emerald/40">
          <div className="eyebrow mb-2 text-emerald-bright">Neden uygun · AI notu</div>
          <p className="text-[14px] text-mist leading-relaxed">{h.notes}</p>
        </div>
      )}

      {/* Önerilen müsait üyeler (basit eşleştirme) */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div className="eyebrow">Önerilen müsait üyeler · Kanal 1 adayı</div>
          <span className="text-[0.7rem] font-mono text-faint">{suggested.length} uygun</span>
        </div>
        <div className="glass rounded-xl divide-y divide-line">
          {suggested.map((m) => (
            <Link
              key={m.id}
              href={`/pool/${m.id}`}
              className="flex items-center justify-between gap-3 p-3.5 hover:bg-white/[0.03] transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-white/8 border border-line grid place-items-center text-xs font-semibold text-fog shrink-0">
                  {m.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-fog truncate">{m.fullName}</div>
                  <div className="font-mono text-[0.62rem] text-faint truncate">
                    {m.skills.slice(0, 2).map((s) => s.name).join(" · ")}
                  </div>
                </div>
              </div>
              <span className="font-mono text-sm text-emerald-bright shrink-0">{m.internalRating}</span>
            </Link>
          ))}
          {suggested.length === 0 && (
            <div className="p-6 text-center text-faint text-sm">Müsait ve uygun üye bulunamadı.</div>
          )}
        </div>
      </div>

      {/* Kanal 2 başvuru placeholder */}
      <div className="glass rounded-xl p-5">
        <div className="eyebrow mb-2 text-amber-bright">Kanal 2 · Bireysel / Joker</div>
        <p className="text-[13px] text-mist leading-relaxed mb-3">
          Bu hackathona bireysel başvurmak veya kendi joker takımını kurmak istiyorsan —
          başvuru akışı Faz 5'te geliyor.
        </p>
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-lg border border-line text-faint font-medium text-sm px-4 py-2.5 cursor-not-allowed"
        >
          Başvur (yakında)
        </button>
      </div>
    </div>
  );
}

