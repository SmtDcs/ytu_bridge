// YTU Bridge — Veri Modeli (v2)
// Prisma şeması / Supabase tipleri / Zod şemaları için temel alınacak.

// ---------------------------------------------------------------------------
// Enum / Literal Tipler
// ---------------------------------------------------------------------------

export type SkillName =
  | 'Solidity'
  | 'Smart Contract Development'
  | 'EVM / Blockchain Fundamentals'
  | 'zk-Proofs & Cryptography'
  | 'Security & Smart Contract Auditing'
  | 'DeFi & Tokenomics'
  | 'Layer 2 / Scaling Solutions'
  | 'Next.js / React'
  | 'Frontend Development'
  | 'UI/UX Design'
  | 'Tailwind CSS'
  | 'Web3 Frontend (wagmi, viem, ethers)'
  | 'Backend / API Development'
  | 'DevOps & Infrastructure'
  | 'Data Analysis & Scripting'
  | 'Pitching & Presentation'
  | 'Project Management'
  | 'Research & Analysis'
  | 'Technical Writing & Documentation'
  | 'Community Management / DevRel'
  | 'Game Development (on-chain)'
  | 'AI × Blockchain'
  | 'Regulatory & Legal (Web3)'
  | 'Token Launch & Growth'
  | 'Other';

// YENI: Hackathon track kategorileri (eşleştirme motoru için)
export type HackathonTrack =
  | 'DeFi'
  | 'NFT/Gaming'
  | 'Infra/Tooling'
  | 'ZK/Privacy'
  | 'AI×Web3'
  | 'Public Goods'
  | 'Social/Consumer'
  | 'Other';

// YENI: Proje/hackathon hedef zincirleri
export type Chain =
  | 'Ethereum'
  | 'Base'
  | 'Monad'
  | 'Solana'
  | 'Stellar'
  | 'Polygon'
  | 'Arbitrum'
  | 'Optimism'
  | 'Other';

// YENI: Proje olgunluk durumu
export type ProjectStatus =
  | 'idea'
  | 'prototype'
  | 'working-demo'
  | 'production'
  | 'abandoned';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';
export type HackathonStatus = 'upcoming' | 'ongoing' | 'completed';
export type HackathonResult =
  | '1st' | '2nd' | '3rd' | 'top10' | 'finalist'
  | 'participated' | 'no-show' | 'disqualified' | string;

// YENI: Kanal 2 başvuru durumu
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
// YENI: Joker takım davet durumu
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';
// YENI: Kanal belirleyici
export type ParticipationChannel = 'club-initiative' | 'individual-joker';

// ---------------------------------------------------------------------------
// Çekirdek Tipler
// ---------------------------------------------------------------------------

export interface Skill {
  name: SkillName | string;
  level: 1 | 2 | 3 | 4 | 5; // 1=başlangıç, 5=ileri
}

export interface Availability {
  status: AvailabilityStatus;
  until?: string; // ISO date
  notes?: string;
}

export interface SkillProposal {
  id: string;
  suggestedName: string;
  proposedBy: string; // member id
  status: 'pending' | 'approved' | 'rejected';
  popularity: number; // kaç üye önerdi
  createdAt: string;
}

export interface Member {
  id: string;
  fullName: string;
  studentEmail: string; // std.yildiz.edu.tr — lider manuel onay
  emailVerified: boolean;
  walletAddress: `0x${string}`;
  walletVerified: boolean;
  joinedAt: string;

  skills: Skill[];
  availability: Availability;

  hackathonHistory: Participation[];
  projects: Project[];

  internalRating: number; // 0-100 (algoritmik + manuel)
  tags: string[]; // "güvenilir", "hızlı prototipçi" vs.

  // YENI: Kanal 2 için
  applications: Application[];
  teamInvites: TeamInvite[];
}
// ---------------------------------------------------------------------------
// Hackathon & Keşif
// ---------------------------------------------------------------------------

export interface HackathonSource {
  name: string; // 'ETHGlobal', 'DoraHacks', 'Devpost', 'Solana Superteam'...
  url?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  dateStart: string;
  dateEnd?: string;
  location: string; // online / istanbul / lisbon...
  status: HackathonStatus;

  // YENI: eşleştirme için
  tracks: HackathonTrack[];
  chains: Chain[];
  requiredSkills: string[];
  idealTeamSize: number;

  prizePool?: string;
  applicationDeadline?: string;
  description?: string;
  externalLink?: string;

  source?: HackathonSource;
  watched: boolean; // lider takip ediyor
  bestFitScore?: number; // en uygun mevcut projeye göre önbellek skor
}

// YENI: Ay başında toplu yapıştırılan keşif batch'i
export interface MonthlyHackathonBatch {
  id: string;
  month: string; // '2026-07'
  rawInput: string; // admin'in yapıştırdığı ham liste
  hackathonIds: string[];
  reviewedBy: string; // admin id
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Katılım, Proje, Atama, Değerlendirme
// ---------------------------------------------------------------------------

export interface Participation {
  hackathonId: string;
  role: string; // "Smart Contract Developer", "Frontend Lead", "PM"...
  teamName?: string;
  result: HackathonResult;
  feedback?: string; // lider + kendi değerlendirmesi
  links: string[]; // github, demo, notion, pitch
  learnedSkills?: string[];

  // YENI: hangi kanaldan katıldı
  channel: ParticipationChannel;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];

  // YENI: eşleştirme için
  chains: Chain[];
  tracks: HackathonTrack[];
  status: ProjectStatus;
  owners: string[]; // member id'leri
  reusePotential: 'high' | 'medium' | 'low';
  tags: string[];

  repoUrl?: string;
  demoUrl?: string;
  pitchUrl?: string;
  hackathonId?: string;
  outcome: string;
}

export interface Assignment {
  id: string;
  hackathonId: string;
  memberId: string;
  assignedRole: string;
  assignedBy: string; // admin id
  notifiedAt?: string;
  acceptedAt?: string;
  channel: ParticipationChannel;
}

export interface Evaluation {
  id: string;
  hackathonId: string;
  memberId: string;
  score: number; // 1-10 veya 0-100
  strengths: string[];
  improvements: string[];
  result: HackathonResult;
  learnedSkills?: string[];
  submittedBy: string; // admin
  submittedAt: string;
}


// ---------------------------------------------------------------------------
// YENI: Kanal 2 — Başvuru & Joker Takım Daveti
// ---------------------------------------------------------------------------

// Üyenin dizinden bir hackathona yaptığı başvuru (bireysel veya joker takım)
export interface Application {
  id: string;
  hackathonId: string;
  memberId: string;
  channel: ParticipationChannel;
  status: ApplicationStatus;

  // Bireysel başvuru
  preferredRole?: string;
  motivation?: string;

  // Joker takım başvurusu
  teamName?: string;
  teamMemberIds?: string[]; // davet edilen/kabul eden üyeler
  proposedRoles?: Record<string, string>; // memberId -> role

  reviewedBy?: string; // admin (Kanal 1 ile birleştirme için)
  reviewNote?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// Joker takıma gönderilen davet
export interface TeamInvite {
  id: string;
  hackathonId: string;
  fromMemberId: string; // davet eden
  toMemberId: string; // davet edilen
  proposedRole?: string;
  status: InviteStatus;
  message?: string;
  createdAt: string;
  respondedAt?: string;
  applicationId?: string; // hangi başvuruya bağlı
}

// ---------------------------------------------------------------------------
// YENI: Dizin (DoraHacks Tarzı) & Eşleştirme
// ---------------------------------------------------------------------------

// Dizin kartı — üyelerin gördüğü hackathon özeti
export interface HackathonDirectoryListing {
  hackathonId: string;
  coverImage?: string;
  tracks: HackathonTrack[];
  chains: Chain[];
  prizePool?: string;
  dateStart: string;
  dateEnd?: string;
  applicationDeadline?: string;
  bestFitProjectIds: string[]; // en uygun 3 proje
  interestedMemberCount: number;
  applicantCount: number;
}

// Proje × Hackathon uygunluk skoru (eşleştirme motoru çıktısı)
export interface ProjectHackathonFit {
  id: string;
  projectId: string;
  hackathonId: string;
  score: number; // 0-100
  matchedTracks: HackathonTrack[];
  matchedChains: Chain[];
  gaps: string[]; // "EVM'ye port gerek", "pitch deck yok"
  pivotNotes?: string;
  recommended: boolean;
  computedAt: string;
}

// ---------------------------------------------------------------------------
// Yardımcı Tipler (Filtre, Öneri, Eşleştirme Parametreleri)
// ---------------------------------------------------------------------------

export interface TalentPoolFilters {
  skills?: string[];
  minLevel?: number;
  availability?: AvailabilityStatus;
  minRating?: number;
  hasRecentSuccess?: boolean;
  chain?: Chain;
  track?: HackathonTrack;
}

export interface TeamSuggestion {
  members: Member[];
  roles: Record<string, string>; // memberId -> role
  balanceScore: number; // 0-100
  missingSkills: string[];
  missingTracks?: HackathonTrack[];
}

// Eşleştirme algoritması ağırlıkları (spec'teki tabloyla uyumlu)
export interface MatchWeights {
  trackOverlap: number; // 0.40
  chainOverlap: number; // 0.25
  techStackSkills: number; // 0.20
  reusePotential: number; // 0.15
}

export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  trackOverlap: 0.4,
  chainOverlap: 0.25,
  techStackSkills: 0.2,
  reusePotential: 0.15,
};

// reusePotential -> puan haritası
export const REUSE_POTENTIAL_SCORE: Record<Project['reusePotential'], number> = {
  high: 100,
  medium: 60,
  low: 20,
};

