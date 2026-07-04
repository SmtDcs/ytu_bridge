import Link from "next/link";
import { BridgeMark } from "@/components/layout/bridge-mark";

const NAV = [
  { href: "/", label: "Komuta Merkezi", icon: "grid", desc: "Döngü + özet" },
  { href: "/pool", label: "Yetenek Havuzu", icon: "users", desc: "Üye, skill, müsaitlik" },
  { href: "/discovery", label: "Keşif", icon: "compass", desc: "Hangi hackathon & neden" },
  { href: "/directory", label: "Dizin", icon: "list", desc: "DoraHacks tarzı galeri" },
  { href: "/projects", label: "Projeler", icon: "cube", desc: "Envanter + eşleştirme" },
  { href: "/assignments", label: "Takım & Atama", icon: "shuffle", desc: "Sürükle-bırak kurma" },
  { href: "/evaluations", label: "Değerlendirme", icon: "flag", desc: "Sonuç → havuza dönüş" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  ),
  users: (
    <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 11a3.5 3.5 0 1 0 0-7M22 21a6.5 6.5 0 0 0-5-6.3" />
  ),
  compass: (
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-14-5 2-2 5 5-2 2-5Z" />
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  cube: (
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v20M3 7l9 5 9-5" />
  ),
  shuffle: (
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  ),
  flag: <path d="M4 22V4s2-2 6-2 6 2 10 2v12s-4 0-8-2-8 0-8 0Z" />,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-line bg-panel/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-line">
          <BridgeMark className="h-8 w-8" />
          <div className="leading-tight">
            <div className="font-display font-semibold text-fog text-[15px] tracking-tight">
              Bridge
            </div>
            <div className="eyebrow text-[0.6rem]">YTÜ Blockchain</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="eyebrow px-2 mb-2">Döngü</div>
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-start gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/[0.04] text-mist hover:text-fog"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-[18px] w-[18px] text-faint group-hover:text-emerald-bright shrink-0"
                  >
                    {ICONS[item.icon]}
                  </svg>
                  <span className="leading-tight">
                    <span className="block">{item.label}</span>
                    <span className="block text-[0.66rem] text-faint font-mono">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-3 border-t border-line">
          <div className="flex items-center gap-2 text-[0.7rem] text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            <span className="font-mono">MINT · 2026 dönemi</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 border-b border-line bg-ink/70 backdrop-blur-md">
          <div className="flex items-center gap-2 md:hidden">
            <BridgeMark className="h-6 w-6" />
            <span className="font-display font-semibold text-fog">Bridge</span>
          </div>
          <div className="hidden md:block eyebrow">Komuta Merkezi · Hackathon Döngüsü</div>
          <div className="flex items-center gap-3">
            <button
              className="text-xs font-mono text-mist hover:text-fog border border-line rounded-md px-3 py-1.5 transition-colors hover:border-line-bright"
            >
              Cüzdan bağla
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald to-emerald-dim grid place-items-center text-ink text-xs font-semibold">
              S
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
