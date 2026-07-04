import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { HackathonCard } from "@/components/hackathon-card";

export default function DiscoveryPage() {
  const upcoming = DISCOVERED_HACKATHONS.filter((h) => h.status === "upcoming");
  const ongoing = DISCOVERED_HACKATHONS.filter((h) => h.status === "ongoing");
  const completed = DISCOVERED_HACKATHONS.filter((h) => h.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow mb-2">Döngü · aşama 02</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fog">
          Keşif
        </h1>
        <p className="text-mist mt-2 max-w-2xl leading-relaxed text-[15px]">
          Ay başında Twitter'dan bulduğun hackathonları burada toplarız. Her
          kartta <span className="text-fog">hangi hackathon ve neden</span> uygun
          olduğu (track, zincir, ödül) yazar. Detay için karta tıkla.
        </p>
      </div>

      {/* Nasıl eklenir — akış anlatımı */}
      <div className="glass rounded-xl p-4 border-l-2 border-l-emerald/40">
        <div className="eyebrow mb-2 text-emerald-bright">Nasıl hackathon eklenir</div>
        <ol className="text-[13px] text-mist leading-relaxed space-y-1 list-decimal list-inside marker:text-faint marker:font-mono">
          <li>Twitter'da hackathon duyurusu gör → metni kopyala (site adı, tarih, ödül, link)</li>
          <li>Sohebette bana yapıştır → AI (ben) yapısal veriye çevirir</li>
          <li><span className="font-mono text-fog">discovered-hackathons.ts</span> dosyasına kaydedilir</li>
          <li>Commit + push → Vercel otomatik deploy → burada görünür</li>
        </ol>
      </div>

      {/* Kanban: Yaklaşan / Devam eden / Tamamlandı */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Column title="Yaklaşan" tone="emerald" items={upcoming} />
        <Column title="Devam eden" tone="amber" items={ongoing} />
        <Column title="Tamamlandı" tone="faint" items={completed} />
      </div>
    </div>
  );
}

function Column({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "emerald" | "amber" | "faint";
  items: typeof DISCOVERED_HACKATHONS;
}) {
  const dot =
    tone === "emerald" ? "bg-emerald" : tone === "amber" ? "bg-amber" : "bg-zinc-500";
  const text =
    tone === "emerald" ? "text-emerald-bright" : tone === "amber" ? "text-amber-bright" : "text-faint";
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2 w-2 rounded-full ${dot} ${tone !== "faint" ? "animate-pulse" : ""}`} />
        <span className={`font-display font-semibold text-sm ${text}`}>{title}</span>
        <span className="font-mono text-[0.7rem] text-faint">({items.length})</span>
      </div>
      <div className="space-y-3">
        {items.map((h) => (
          <HackathonCard key={h.id} h={h} />
        ))}
        {items.length === 0 && (
          <div className="glass rounded-xl p-6 text-center text-faint text-xs">
            Bu sütunda hackathon yok.
          </div>
        )}
      </div>
    </div>
  );
}

