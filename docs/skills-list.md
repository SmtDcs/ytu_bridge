# YTU Bridge — Sabit Skill Listesi (v1)

Yönetim ekibi (3 kişilik çekirdek) tarafından yönetilir.
Üyeler kendi profillerinde bu listeden seçim yapar; ayrıca "Diğer" seçeneğiyle yeni skill önerisi yapabilirler. Öneriler yönetim ekibi tarafından incelenip onaylanırsa listeye eklenir.

## Temel Blockchain & Geliştirme
- Solidity
- Smart Contract Development
- EVM / Blockchain Fundamentals
- zk-Proofs & Cryptography
- Security & Smart Contract Auditing
- DeFi & Tokenomics
- Layer 2 / Scaling Solutions

## Frontend & Tasarım
- Next.js / React
- Frontend Development
- UI/UX Design
- Tailwind CSS
- Web3 Frontend (wagmi, viem, ethers)

## Diğer Teknik
- Backend / API Development
- DevOps & Infrastructure
- Data Analysis & Scripting (Python vb.)

## Soft & Sunum
- Pitching & Presentation
- Project Management
- Research & Analysis
- Technical Writing & Documentation
- Community Management / DevRel

## Opsiyonel / İleri
- Game Development (on-chain)
- AI × Blockchain
- Regulatory & Legal (Web3)
- Token Launch & Growth

## Kurallar
- Her üye en fazla 6–8 skill seçebilir.
- Her skill için seviye belirtilir: 1 (başlangıç) — 5 (ileri).
- Yönetim ekibi gerektiğinde skill'leri düzenleyebilir veya yeni ekleyebilir.

## "Diğer" Öneri Akışı
1. Üye profilde skill bulamazsa "Diğer..." seçeneğine tıklar, serbest metin girer.
2. Öneri `pending` durumda yönetim ekibinin onay kuyruğuna düşer.
3. Yönetim ekibi öneriyi onaylarsa liste sabit kataloga eklenir; reddederse üyeye geri bildirim gönderilir.
4. Aynı öneri 2+ üye tarafından tekrarlanırsa "popüler" olarak işaretlenir ve onay önceliği artar.

## Bridge'de Nasıl Kullanılacak
- **Profil sayfası:** multi-select + seviye slider (1–5).
- **Yetenek Havuzu filtreleri:** "Solidity seviye 4+" gibi.
- **Takım kurarken denge kontrolü:** "Bu hackathon'da Solidity ve Pitching eksik" uyarısı.
- **Eşleştirme motoru:** bir hackathonun `requiredSkills`'i ile üyelerin/hazır projelerin skill'leri örtüştürülür (bkz. `data-model.ts` -> `ProjectHackathonFit`).
