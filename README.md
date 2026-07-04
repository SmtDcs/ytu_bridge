# YTU Bridge

**YTÜ Blockchain Topluluğu için Hackathon Katılım Yönetim Platformu.**

Bridge, kulüp üyelerinin hackathon katılım döngüsünü tek bir çatı altında yönetir: yetenek havuzundan keşfe, takım kurmaktan sonuçlandırmaya — ve her turda havuz güçlenerek döngüye geri döner.

> Durum: **Spec & veri modeli fazı (Faz 0).** Kod henüz yok; tasarım ve veri katmanı tamamlanıyor. Sonraki fazda Next.js + Supabase ile uygulama başlatılacak.

## Döngü (Core Loop)

```
Yetenek Havuzu → Keşif (hangi hackathon & neden) → Dizin (DoraHacks tarzı)
   → Takım Kurma & Atama → Katılım → Sonuçlanma → Havuza Geri Dönüş ↻
```

Her tur döngü tamamlandığında havuz güçlenir: puan, güçlü/zayıf yönler ve öğrenilen skill'ler geri döner, bir sonraki tur daha akıllı seçim yapılır.

## İki Paralel Kanal

- **Kanal 1 — Kulüp Girişimi:** Lider hackathon seçer → takımı kurar ve atar → resmi kulüp katılımı.
- **Kanal 2 — Bireysel/Joker:** Üye dizinden istediği hackathona başvurur → kendi joker takımını kurabilir (diğer üyeleri görür + davet eder) veya tek başına katılır.

## Modüller

1. **Yetenek Havuzu** — üye profilleri: skills (seviye 1–5), müsaitlik durumu, geçmiş hackathonlar, projeler, iç puan.
2. **Keşif Akışı** — admin hackathonları sisteme yükler (aylık batch) → "hangi hackathon ve **neden** uygun" (track/zincir/ödül/tarih).
3. **Proje Eşleştirme Motoru** — mevcut kulüp projelerini bir hackathonla eşleştirir, 0–100 uygunluk skoru + eksikler + pivot önerisi verir.
4. **Dizin (DoraHacks tarzı)** — üyeler hackathonları gezer, detayları görür, ilgi/başvuru bildirir.
5. **Takım Kurma & Atama** — Kanal 1: lider sürükle-bırak (production) ile takım kurar; Kanal 2: üye joker takım kurar + davet gönderir.
6. **Sonuçlanma & Geri Dönüş** — etkinlik sonrası değerlendirme → havuza geri döner.

## Teknoloji (planlanan)

- **Framework:** Next.js 14+ (App Router) · TypeScript · Tailwind
- **Cüzdan:** wagmi + viem (sadece adres kaydı, SIWE yok)
- **Veritabanı:** Supabase (Postgres + Auth + Storage)
- **Email:** Resend
- **Sürükle-bırak:** @dnd-kit (production-grade, erişilebilir)
- **Deploy:** Vercel

## Dokümanlar

- [`docs/spec.md`](./docs/spec.md) — tam platform spec'i (döngü, iki kanal, modüller, 9 karar)
- [`docs/data-model.ts`](./docs/data-model.ts) — TypeScript veri modeli
- [`docs/projects-seed.json`](./docs/projects-seed.json) — mevcut kulüp proje envanteri (seed)
- [`docs/skills-list.md`](./docs/skills-list.md) — sabit skill katalogu + "Diğer" öneri akışı
- [`docs/roadmap.md`](./docs/roadmap.md) — build fazları (Faz 0 → 6)

## Bağlam

Bu platform, YTÜ MINT altındaki Blockchain Topluluğu'nun yenileme sürecinin bir parçasıdır. Mevcut varlıklar (sosyal medya, GitHub org, "Rise or Slice" bülteni) korunur; yalnızca operasyonlar profesyonelleştirilir. Ayrıntılı mevcut durum analizi için `ytubc-toplulugu` reposuna bakınız.

## Lisans

Henüz belirlenmedi (ileride MIT önerilir).
