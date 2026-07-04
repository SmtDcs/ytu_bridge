// Her döngü aşaması için tutarlı iskelet sayfası.
// phase: döngü numarası ("01".."06"), faz: hangi build fazında dolacak.
export function PhaseStage({
  phase,
  title,
  desc,
  faz,
  children,
}: {
  phase: string;
  title: string;
  desc: string;
  faz: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow mb-2">Döngü · aşama {phase}</div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fog">
            {title}
          </h1>
          <p className="text-mist mt-2 max-w-2xl leading-relaxed">{desc}</p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 text-[0.7rem] font-mono text-faint shrink-0">
          {faz} · iskelet
        </span>
      </div>

      <div className="glass rounded-2xl p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="font-mono text-5xl text-emerald-bright/30 font-semibold mb-3">
          {phase}
        </div>
        <div className="font-display text-lg text-mist">{title}</div>
        <div className="text-sm text-faint mt-2 max-w-md leading-relaxed">
          {desc}
        </div>
        <div className="mt-6 text-xs font-mono text-faint border border-line rounded-md px-3 py-1.5">
          {faz} aşamasında geliştirilecek
        </div>
      </div>

      {children}
    </div>
  );
}
