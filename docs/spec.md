# YTU Bridge — Platform Spec (v2)

**Proje:** YTÜ Blockchain Topluluğu için Hackathon Katılım Yönetim Platformu
**Kapsam:** Topluluk üyeleri ve liderler için iç araç — üyeler için dizin + profil dashboard'u, adminler için yönetim paneli.
**Felsefe:** Veri katmanı güçlü, aktif döngü şeffaf, geri besleme havuza otomatik döner. Her tur havuz güçlenir.

---

## 1. Genel Bakış

Bridge, kulübün **Hackathon Katılım Döngüsü**nü dijitalleştirir ve yönetir:

```
Yetenek Havuzu → Keşif (hangi hackathon & neden) → Dizin (DoraHacks tarzı)
   → Takım Kurma & Atama → Katılım → Sonuçlanma → Havuza Geri Dönüş ↻
```

Mevcut topluluk varlıkları korunur (MINT altında, sosyal hesaplar, GitHub org, "Rise or Slice" bülteni). Yalnızca operasyonlar profesyonelleştirilir.

### Teknoloji (planlanan)
- **Framework:** Next.js 14+ (App Router) · TypeScript · Tailwind
- **Cüzdan:** wagmi + viem (sadece adres kaydı)
- **Veritabanı:** Supabase (Postgres + Auth + Storage)
- **Email:** Resend
- **Sürükle-bırak:** @dnd-kit (production-grade)
- **Deploy:** Vercel

---

## 2. Kullanıcı Tipleri / Roller

1. **Üye (Member)**
   - Kendi profilini görür/günceller (skill, seviye, müsaitlik).
   - Geçmiş hackathon/projelerini görür.
   - **Dizinde** hackathonları gezer, detayları görür, ilgi/başvuru bildirir (Kanal 2).
   - **Joker takım** kurabilir; diğer üyelerin tam profilini görüp davet gönderir.
   - Atandığında/kabul edildiğinde bildirim alır.

2. **Lider / Admin (Yönetim ekibi — 3 kişi çekirdek)**
   - Tüm üyeleri havuzda görür + filtreler.
   - Hackathonları sisteme yükler (tekil + aylık batch).
   - **Kanal 1:** takım kurar, sürükle-bırak ile rol dağıtır, "Onayla & Bildir".
   - Değerlendirme yapar (sonuçları girer) → havuza geri döner.
   - Email/bildirim tetikler; skill katalogunu yönetir; üyeleri onaylar.

3. **(İleride)** Mentör / Harici danışman — salt görüntüleme.

---

## 3. Çekirdek Döngü ve İki Paralel Kanal

Döngü **iki paralel kanalla** çalışır — aynı döngüyü farklı sahiplik modelleriyle işletirler.

### Kanal 1 — Kulüp Girişimi (admin-driven)
1. Lider keşif akışından bir hackathon seçer.
2. Eşleştirme motoru "en uygun mevcut projeler + uygun üyeler" önerir.
3. Lider sürükle-bırak ile takımı kurar, rolleri dağıtır.
4. "Onayla & Bildir" → email + dashboard bildirimi.
5. Takım yarışır; etkinlik sonrası değerlendirme havuza döner.

### Kanal 2 — Bireysel / Joker (member-driven)
1. Üye dizinde gezinir, hackathon detaylarını görür.
2. İlgi bildirir veya resmi başvuru gönderir (`Application`: pending → approved/rejected).
3. Joker takım kurabilir: diğer üyelerin tam profilini görür, davet gönderir (`TeamInvite`: pending → accepted/declined).
4. Tek başına da katılabilir.
5. Sonuçlanma yine havuza döner.

Her iki kanal da aynı `Member`, `Project`, `Hackathon` havuzunu kullanır; ayrım `Participation.channel` alanıyla yapılır.

---

## 4. Modüller

### Modül 1 — Yetenek Havuzu (Talent Pool)
- **Üye profili:** fullName, std.yildiz.edu.tr email (lider onaylı), wallet adresi, skills (seviye 1–5), müsaitlik (available/limited/unavailable + tarih), geçmiş katılımlar, projeler, iç puan (0–100), tag'ler.
- **Admin görünümü:** tüm üyeler + filtreler ("Solidity 4+, müsait, son 6 ayda başarılı").
- **Üye görünümü:** diğer üyelerin tam profilini görür (isim + skill + seviye + müsaitlik) → joker takıma direkt davet.
- **Skill katalogu:** sabit liste + "Diğer" öneri akışı (yönetim onaylı, popülerlik takibi).

### Modül 2 — Keşif Akışı (Hackathon Discovery)
- Admin hackathon ekler: name, organizer, tarihler, konum, **tracks**, **chains**, prizePool, applicationDeadline, externalLink, **source** (ETHGlobal/DoraHacks/Devpost/Superteam/Monadboost...).
- **Aylık batch import:** ay başında admin kaynak listesini toplu yapıştırır → sistem `MonthlyHackathonBatch` oluşturur, hackathon kartları otomatik türetilir.
- **Kanban:** Yaklaşan → Devam Eden → Tamamlandı.
- **Takvim görünümü.**
- **"Takip ediliyor"** bayrağı + her hackathona otomatik **en uygun mevcut proje skoru** (`bestFitScore`).

### Modül 3 — Proje Eşleştirme Motoru (Project Matching Engine) ⭐
- Mevcut kulüp projelerinin envanteri: title, **chains**, **tracks**, techStack, **status**, owners, **reusePotential**, tags, repo/demo/pitch url, outcome.
- Seed: gerçek `Projeler/` envanteri (catchcat-monad, rolet-web, stellarcarry, TroyLayer, refaktor, monad-stealth) — bkz. `projects-seed.json`.
- **Eşleştirme algoritması** (her hackathon × her proje için `ProjectHackathonFit`, score 0–100):

| Kriter | Ağırlık | Mantık |
|---|---|---|
| Track örtüşmesi | %40 | `project.tracks ∩ hackathon.tracks` (jaccard) |
| Zincir örtüşmesi | %25 | chain-specific hackathon'da zorunlu; çoklu zincirde bonus |
| Tech stack / required skills | %20 | proje tech stack'i vs hackathon `requiredSkills` |
| Yeniden kullanım potansiyeli | %15 | `reusePotential` (high=100, medium=60, low=20) |

- Çıktı: her hackathon için **"en uygun 3 mevcut proje + eksikler (gaps) + pivot önerisi"**.
  - Örnek: "catchcat-monad → ETHGlobal NFT track'ine %82 uygun; eksik: EVM'ye port + pitch deck; pivot: Monad'dan Base'e taşı."
- Skor önbelleğe alınır, hackathon/proje değişince canlı yeniden hesaplanır.


### Modül 4 — Dizin (DoraHacks Tarzı)
- Üyeler yüklenen hackathonları **kart galerisi** olarak gezer (kapak, tracks, zincir, ödül, tarih, deadline).
- Detay sayfası: tam açıklama, required skills, track'ler, mevcut proje eşleşmeleri, başvuru butonu.
- İlgi (watch) + resmi başvuru (Kanal 2) + joker takım kurma girişi.
- Filtreler: zincir, track, konum, tarih, takım boyutu.

### Modül 5 — Takım Kurma & Atama
- **Kanal 1 (lider):** production sürükle-bırak (@dnd-kit, erişilebilir: klavye + touch + mouse). Üye kartları → takım slot'ları (rol etiketli). Drop-zone görsel geri bildirimi. "Onayla & Bildir" → email.
- **Kanal 2 (üye):** joker takım kurma — davet gönderme (`TeamInvite`), takım adı, roller. Davet edilen üye kabul/red eder.
- **Akıllı takım önerisi:** `TeamSuggestion` (balanceScore, missingSkills) — hem Kanal 1'de lidere, hem Kanal 2'de üyeye öneri.

### Modül 6 — Sonuçlanma & Geri Dönüş
- Etkinlik sonrası **değerlendirme** (1 hafta içinde zorunlu): score, strengths, improvements, result, öğrenilen skill'ler.
- Sonuç `Member.internalRating`'i ve `Member.hackathonHistory`'yi günceller.
- Proje arşivi: tüm projeler aranabilir + tag'li.
- Ödül/sonuç kayıtları (`prize-distribution-policy` ile uyumlu).
- **Havuza geri dönüş:** bir sonraki tur eşleştirme + takım önerisi bu veriyi kullanır.

---

## 5. Auth & Güvenlik

- **Email:** std.yildiz.edu.tr alan adı zorunlu; **lider manuel onay** (OTP yok).
- **Cüzdan:** wagmi ile adres kaydı; **SIWE imza yok** (sadece adres).
- **Görünürlük:** Üyeler diğer üyelerin tam profilini görür (Kanal 2 joker davet için). Wallet tam adresi adminlere; üyelere kısmi/takma ad opsiyonu (ileride).
- **Roller:** admin yetkisi 3 kişilik çekirdekle sınırlı; sonradan eklenebilir.

---

## 6. Standart İş Akışı

1. Ay başında admin kaynak listesini toplu yapıştırır → batch → hackathon kartları.
2. Eşleştirme motoru her hackathona "en uygun mevcut proje + uygun üyeler" önerir.
3. **Kanal 1:** lider takımı sürükle-bırak kurar, "Onayla & Bildir".
4. **Kanal 2:** üye dizinden başvurur/joker takım kurar.
5. Katılım.
6. Etkinlik sonrası 1 hafta içinde değerlendirme zorunlu → havuza döner.
7. Bir sonraki tur daha akıllı seçim. ↻

---

## 7. Netleşen 9 Karar (Final)

| # | Karar | Final |
|---|---|---|
| 1 | Email doğrulama | Lider manuel onay |
| 2 | Cüzdan | Sadece adres kaydı, SIWE yok |
| 3 | Sürükle-bırak atama | **Production-grade, gerçek** (@dnd-kit) |
| 4 | Skill listesi | Sabit liste + "Diğer" öneri akışı |
| 5 | Geçmiş veriler | Elle/seed ile başla, sonra toplu import |
| 6 | Havuz görünürlüğü | Üyeler tam profilini görür + joker takıma direkt davet |
| 7 | Veritabanı | Supabase |
| 8 | Bülten bağlantısı | İleride |
| 9 | Hackathon seçim akışı | İki paralel kanal (kulüp girişimi + bireysel/joker) |

---

## 8. Sonraki Adımlar (kodlama)

1. Next.js 14+ projesini `ytu_bridge/` kökünde başlat (App Router + Tailwind).
2. Supabase proje + şema; `data-model.ts`'i Prisma/Supabase tiplerine çevir.
3. Seed yükle: 6 üye + 6 proje (`projects-seed.json`).
4. Faz 2 → Faz 6 sırasıyla (bkz. `roadmap.md`).

