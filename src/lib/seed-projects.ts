// ============================================================================
// Proje Envanteri — VERİ KAYNAĞI
// Kulübün mevcut projeleri. Kaynak: /home/samet/Projeler/* gerçek repo'lar.
// Eşleştirme motoru (scoreProjectFit) bu veriyi hackathonlarla eşleştirir.
// ============================================================================

import type { HackathonTrack, Chain } from "./discovered-hackathons";

export type ProjectStatus = "idea" | "prototype" | "working-demo" | "production" | "abandoned";
export type ReusePotential = "high" | "medium" | "low";

export interface SeedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  chains: Chain[];
  tracks: HackathonTrack[];
  status: ProjectStatus;
  reusePotential: ReusePotential;
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
  outcome: string;
}

export const SEED_PROJECTS: SeedProject[] = [
  {
    id: "p-catchcat",
    title: "CatchCat",
    description:
      "Canlı kamera ile kedi/köpek tespiti (TensorFlow.js, client-side) + minigame + yakalanan hayvan için ERC-721 NFT kartı. Hedef zincir: Monad.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "TensorFlow.js", "Solidity", "ERC-721"],
    chains: ["Monad"],
    tracks: ["NFT/Gaming", "AI×Web3"],
    status: "prototype",
    reusePotential: "medium",
    tags: ["client-side-ai", "camera", "collectible", "fun"],
    outcome: "Prototip aşaması; EVM'ye port gerekirse Monad dışı hackathonlar için uyumlu hale getirilmeli.",
  },
  {
    id: "p-rolet",
    title: "ROLET",
    description:
      "Solana üzerinde FOGC turnuva oyunu. $ROLET token, session key ile gasless turns, 12 kart mekanizması, ghost AI, ELO, durability. Devnet uçtan uca doğrulanmış.",
    techStack: ["Solana", "Anchor", "Rust", "Session Keys", "SNS"],
    chains: ["Solana"],
    tracks: ["NFT/Gaming"],
    status: "working-demo",
    reusePotential: "high",
    tags: ["on-chain-game", "tournament", "session-key", "token"],
    outcome: "v0.1 working demo, devnet doğrulanmış.",
  },
  {
    id: "p-stellarcarry",
    title: "StellarCarry",
    description: "Stellar zinciri üzerinde proje (Vercel deploy edilmiş, environment yapılandırılmış).",
    techStack: ["Stellar", "Soroban"],
    chains: ["Stellar"],
    tracks: ["Infra/Tooling", "DeFi"],
    status: "working-demo",
    reusePotential: "high",
    tags: ["stellar", "soroban", "deployed"],
    outcome: "Çalışan demo, Vercel ortamında.",
  },
  {
    id: "p-troylayer",
    title: "TroyLayer",
    description: "App + smart contract + tarayıcı eklentisi bileşenli proje. Çok katmanlı mimari.",
    techStack: ["Next.js", "Solidity", "Browser Extension"],
    chains: ["Ethereum"],
    tracks: ["Infra/Tooling"],
    status: "prototype",
    reusePotential: "medium",
    tags: ["extension", "layer", "tooling"],
    outcome: "Prototip; eklenti + app + kontrat iskeleti mevcut.",
  },
  {
    id: "p-refaktor",
    title: "Refaktor",
    description: "Smart contract + app bileşenleri. Infra/tooling odaklı, çalışan demo.",
    techStack: ["Next.js", "Solidity", "TypeScript"],
    chains: ["Ethereum"],
    tracks: ["Infra/Tooling"],
    status: "working-demo",
    reusePotential: "medium",
    tags: ["tooling", "refactoring", "devex"],
    outcome: "Çalışan demo (main + sc modülleri).",
  },
  {
    id: "p-monad-stealth",
    title: "Monad Stealth",
    description: "Monad zinciri üzerinde gizlilik/stealth odaklı kontratlar. Demo + deployment + örnekler.",
    techStack: ["Monad", "Solidity"],
    chains: ["Monad"],
    tracks: ["Infra/Tooling", "ZK/Privacy"],
    status: "prototype",
    reusePotential: "medium",
    tags: ["monad", "stealth", "privacy"],
    outcome: "Prototip; demo çalıştırılabilir.",
  },
];

// --- Eşleştirme motoru: proje × hackathon uygunluk skoru (0-100) ---
// Track örtüşmesi %40, zincir %25, tech stack/skills %20, reuse %15
const REUSE_SCORE: Record<ReusePotential, number> = { high: 100, medium: 60, low: 20 };
const WEIGHTS = { track: 0.4, chain: 0.25, tech: 0.2, reuse: 0.15 };

function jaccard<T>(a: T[], b: T[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a.map((x) => String(x).toLowerCase()));
  const setB = new Set(b.map((x) => String(x).toLowerCase()));
  let inter = 0;
  setA.forEach((x) => setB.has(x) && inter++);
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

export interface ProjectFit {
  projectId: string;
  score: number; // 0-100
  matchedTracks: HackathonTrack[];
  matchedChains: Chain[];
  gaps: string[];
}

export function scoreProjectFit(
  project: SeedProject,
  hackathon: { tracks: HackathonTrack[]; chains: Chain[]; requiredSkills?: string[] }
): ProjectFit {
  const trackScore = jaccard(project.tracks, hackathon.tracks);
  const chainScore = jaccard(project.chains, hackathon.chains);
  const techScore = hackathon.requiredSkills
    ? jaccard(project.techStack, hackathon.requiredSkills)
    : 0.5; // skill belirtilmemişse nötr
  const reuseScore = REUSE_SCORE[project.reusePotential] / 100;

  const score = Math.round(
    (trackScore * WEIGHTS.track +
      chainScore * WEIGHTS.chain +
      techScore * WEIGHTS.tech +
      reuseScore * WEIGHTS.reuse) * 100
  );

  const matchedTracks = project.tracks.filter((t) =>
    hackathon.tracks.some((ht) => ht.toLowerCase() === t.toLowerCase())
  );
  const matchedChains = project.chains.filter((c) =>
    hackathon.chains.some((hc) => hc.toLowerCase() === c.toLowerCase())
  );

  const gaps: string[] = [];
  if (chainScore === 0 && hackathon.chains.length > 0)
    gaps.push(`${hackathon.chains.join(", ")} zincirine port gerek`);
  if (trackScore === 0) gaps.push("Track örtüşmesi yok — tema uyumsuzluğu");

  return { projectId: project.id, score, matchedTracks, matchedChains, gaps };
}

