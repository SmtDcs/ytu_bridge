# YTU Bridge — Build Roadmap

**Proje:** YTU Blockchain Topluluğu için Hackathon Katılım Yönetim Platformu
**Repo:** `ytu_bridge` (lokal başlangıç; GitHub: `smtdcs/ytu_bridge` — sonra bağlanacak)
**Başlangıç:** 4 Temmuz 2026

## Döngü (Core Loop)

```
Yetenek Havuzu → Keşif (hangi hackathon & neden) → Dizin (DoraHacks tarzı)
   → Takım Kurma & Atama → Katılım → Sonuçlanma → Havuza Geri Dönüş ↻
```

Her tur döngü tamamlanınca havuz güçlenir (puan, güçlü/zayıf yön, öğrenilen skill'ler geri döner).

## İki Paralel Kanal

- **Kanal 1 — Kulüp Girişimi:** Lider hackathon seçer → takımı kurar ve atar → resmi kulüp katılımı.
- **Kanal 2 — Bireysel/Joker:** Üye dizinden istediği hackathona başvurur → kendi joker takımını kurabilir (diğer üyeleri görür + davet eder) veya tek başına katılır.

## Netleşen 9 Karar

| # | Karar | Final |
|---|---|---|
| 1 | Email doğrulama | Lider manuel onay |
| 2 | Cüzdan | Sadece adres kaydı, SIWE yok |
| 3 | Sürükle-bırak atama | **Production-grade, gerçek** (MVP'de bırakılmayacak) |
| 4 | Skill listesi | Sabit liste + "Diğer" öneri akışı |
| 5 | Geçmiş veriler | Elle/seed ile başla, sonra toplu import |
| 6 | Havuz görünürlüğü | Üyeler tam profilini görür + joker takıma direkt davet |
| 7 | Veritabanı | Supabase |
| 8 | Bülten bağlantısı | İleride |
| 9 | Hackathon seçim akışı | İki paralel kanal |

## Fazlar

### Faz 0 — Spec & Veri Modeli (bu tur)
- [x] Repo + klasör yapısı
- [x] `docs/spec.md` (v2: iki kanal + döngü + dizin + keşif + eşleştirme)
- [x] `docs/data-model.ts` (genişletilmiş tipler)
- [x] `docs/projects-seed.json` (mevcut proje envanteri)
- [x] `docs/skills-list.md` (sabit liste + "Diğer" akışı)
- [x] `docs/roadmap.md` (bu dosya)

### Faz 1 — İskelet & Veri Katmanı
- Next.js 14+ (App Router) + TypeScript + Tailwind projesi başlat
- Supabase proje + şema (Prisma uyumlu tiplerle)
- `data-model.ts`'i Prisma/Supabase şemasına çevir
- Seed yükle: 6 üye (`havza-seed-6.json`'dan) + 6 proje (`projects-seed.json`'dan)
- Dark/emerald/glass tasarım sistemi (eski mock'tan uyarla)

### Faz 2 — Yetenek Havuzu (Talent Pool)
- Üye profil sayfası (skill + seviye slider + müsaitlik)
- Admin: havuz görünümü + filtreler ("Solidity 4+, müsait")
- Üye: diğer üyelerin tam profilini gör + joker takıma davet (Kanal 2)
- Wallet adresi + std.yildiz.edu.tr email (lider onaylı)

### Faz 3 — Hackathon Keşif Akışı
- Admin: hackathon ekleme formu (tracks/chains/prize/deadline/source)
- Aylık batch import (ETHGlobal/DoraHacks/Devpost listesini toplu yapıştır)
- Kanban görünümü: Yaklaşan → Devam Eden → Tamamlandı
- Takvim görünümü
- "Takip ediliyor" bayrağı

### Faz 4 — Proje Eşleştirme Motoru ⭐
- Mevcut proje envanteri (CRUD + zincir/track/durum)
- Eşleştirme algoritması: score 0–100
  - Track örtüşmesi %40, zincir %25, tech stack/skills %20, reuse potential %15
- Her hackathon için "en uygun 3 mevcut proje + eksikler + pivot önerisi"
- `ProjectHackathonFit` önbellek + canlı yeniden hesaplama

### Faz 5 — Dizin (DoraHacks Tarzı) + Takım Kurma & Atama
- Dizin: üyeler hackathonları gezer, detay görür, ilgi/başvuru bildirir
- Kanal 1: lider drag&drop takım kurar (production sürükle-bırak, gerçek)
- Kanal 2: üye joker takım kurar + diğer üyelere davet gönderir (Application: pending/approved/rejected)
- "Onayla & Bildir" akışı (email)

### Faz 6 — Katılım, Sonuçlanma & Geri Dönüş
- Etkinlik sonrası değerlendirme (puan + güçlü/zayıf yön + öğrenilen skill)
- Sonuç havuza geri döner → bir sonraki tur daha akıllı seçim
- Ödül/sonuç kayıtları (prize-distribution-policy ile uyumlu)

## Sürükle-Bırak Notu (Production)
Sürükle-bırak atama MVP'de bırakılmayacak; gerçek, erişilebilir (klavye + touch + mouse), performanslı bir implementation olacak. Tercihen `@dnd-kit/core` (React, erişilebilir, modüler) veya `react-beautiful-dnd` (legacy) yerine modern alternatif. Drop-zone görsel geri bildirimi eski mock'tan korunur.

## Tek Tercihler
- **Framework:** Next.js 14+ (App Router)
- **Stil:** Tailwind + dark/emerald/glass (eski mock referans)
- **Cüzdan:** wagmi + viem (sadece adres kaydı)
- **DB:** Supabase (Postgres + Auth + Storage)
- **Email:** Resend
- **DnD:** @dnd-kit (production)
- **Deploy:** Vercel
