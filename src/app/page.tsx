import { LoopDiagram } from "@/components/loop-diagram";
import { BridgeMark } from "@/components/layout/bridge-mark";

const STATS = [
  { label: "Havuzdaki üye", value: "6", sub: "4 müsait · 2 sınırlı", tone: "emerald" },
  { label: "Yaklaşan hackathon", value: "1", sub: "ETHGlobal İstanbul", tone: "amber" },
  { label: "Envanter proje", value: "6", sub: "2 working-demo", tone: "emerald" },
  { label: "Aktif atama", value: "0", sub: "Bu tur takım yok", tone: "mist" },
] as const;

const PHASES = [
  { n: "01", title: "Yetenek Havuzu", body: "Skill, seviye, müsaitlik ve geçmiş katılımlarla üye profilleri. Her tur güçlenir." },
  { n: "02", title: "Keşif", body: "Admin aylık hackathon listesini yükler. Eşleştirme motoru 'hangi hackathon ve neden uygun' cevabını verir." },
  { n: "03", title: "Dizin", body: "Üyeler hackathonları DoraHacks tarzı kart galerisinde gezer, detayları görür, ilgi bildirir." },
  { n: "04", title: "Takım & Atama", body: "Kanal 1: lider sürükle-bırak kurar. Kanal 2: üye joker takım kurup davet eder." },
  { n: "05", title: "Katılım", body: "Takım yarışır. Resmi kulüp girişimi veya bireysel/joker — ayrım channel alanıyla." },
  { n: "06", title: "Sonuç → Dönüş", body: "Değerlendirme (puan + güçlü/zayıf + öğrenilen skill) havuza döner. Bir sonraki tur daha akıllı. ↻" },
];

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-2 eyebrow">
            <BridgeMark className="h-4 w-4" />
            <span>YTÜ Blockchain · İç panel</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-fog leading-[1.05]">
            Hackathon katılım döngüsü,
            <span className="text-emerald-bright"> tek köprüde</span>.
          </h1>
          <p className="text-mist text-[15px] max-w-xl leading-relaxed">
            Yetenek havuzundan keşfe, dizinden takım kurmaya ve sonuçlandırmaya —
            her tur havuz güçlenerek döngüye döner. İki paralel kanal: kulüp
            girişimi ve bireysel/joker takımlar.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/discovery"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald text-ink font-semibold text-sm px-4 py-2.5 hover:bg-emerald-bright transition-colors"
            >
              Keşfe başla
              <span aria-hidden>→</span>
            </a>
            <a
              href="/pool"
              className="inline-flex items-center gap-2 rounded-lg border border-line text-fog font-medium text-sm px-4 py-2.5 hover:border-line-bright transition-colors"
            >
              Havuzu gör
            </a>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 flex items-center justify-center">
          <LoopDiagram className="w-full max-w-[340px]" />
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="eyebrow mb-3">Bu tur</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 card-lift">
              <div className="font-mono text-3xl font-semibold text-fog">
                {s.value}
              </div>
              <div className="text-sm text-mist mt-1">{s.label}</div>
              <div
                className={
                  "text-[0.7rem] font-mono mt-2 " +
                  (s.tone === "amber"
                    ? "text-amber-bright"
                    : s.tone === "emerald"
                    ? "text-emerald-bright"
                    : "text-faint")
                }
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Döngü aşamaları (numbered — gerçek sequence) */}
      <section>
        <div className="eyebrow mb-3">Döngü aşamaları</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHASES.map((p) => (
            <div key={p.n} className="glass rounded-xl p-4 card-lift">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono text-emerald-bright text-sm font-semibold">
                  {p.n}
                </span>
                <span className="font-display font-semibold text-fog text-[15px]">
                  {p.title}
                </span>
              </div>
              <p className="text-[13px] text-mist leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* İki kanal */}
      <section className="grid md:grid-cols-2 gap-3">
        <div className="glass rounded-xl p-5">
          <div className="eyebrow mb-2">Kanal 1 · Kulüp Girişimi</div>
          <p className="text-sm text-mist leading-relaxed">
            Lider bir hackathon seçer, sürükle-bırak ile takımı kurar ve atar.
            Resmi kulüp katılımı; "Onayla &amp; Bildir" ile email tetiklenir.
          </p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="eyebrow mb-2 text-amber-bright">Kanal 2 · Bireysel / Joker</div>
          <p className="text-sm text-mist leading-relaxed">
            Üye dizinden istediği hackathona başvurur, kendi joker takımını
            kurar ve diğer üyeleri davet eder. Lider nihai onayı verebilir.
          </p>
        </div>
      </section>
    </div>
  );
}

