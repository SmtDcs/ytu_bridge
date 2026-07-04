import { DISCOVERED_HACKATHONS } from "@/lib/discovered-hackathons";
import { HackathonCard } from "@/components/hackathon-card";

export default function DirectoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow mb-2">Döngü · aşama 03</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-fog">
          Dizin
        </h1>
        <p className="text-mist mt-2 max-w-2xl leading-relaxed text-[15px]">
          Yüklenen hackathonlar — DoraHacks tarzı kart galerisi. Üyeler gezer,
          detayları görür, ilgi bildirir. Kanal 2 (bireysel/joker) buradan başlar.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DISCOVERED_HACKATHONS.map((h) => (
          <HackathonCard key={h.id} h={h} />
        ))}
        {DISCOVERED_HACKATHONS.length === 0 && (
          <div className="col-span-full glass rounded-xl p-10 text-center text-mist text-sm">
            Henüz dizinde hackathon yok. Keşif akışından ekle.
          </div>
        )}
      </div>
    </div>
  );
}

