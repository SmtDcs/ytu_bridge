-- YTU Bridge — Seed v1
-- Kaynak: docs/projects-seed.json (projeler) + havza-seed-6.json referansı (üyeler)
-- Çalıştırma: supabase db push  veya  supabase seed.sql
-- UUID'ler sabit — referans kolaylığı için.
-- ---------------------------------------------------------------------------

-- 6 üye (çekirdek kadro; 3'ü admin)
insert into members (id, full_name, student_email, wallet_address, email_verified, wallet_verified, internal_rating, availability_status, availability_until, role, tags) values
 ('a0000001-0000-0000-0000-000000000001', 'Ahmet Yılmaz',   'ahmet.yilmaz@std.yildiz.edu.tr',   '0x71C7aA3f2c4B9eD8fE1a9c3D2b7E5f9A8bC1dE2F', true, true, 92, 'available',   null, 'admin',  '{"güvenilir","SC uzmanı"}'),
 ('a0000002-0000-0000-0000-000000000002', 'Zeynep Kaya',    'zeynep.kaya@std.yildiz.edu.tr',    '0xA4B2c9D1eF8a3B7cD2E6f9A1b8C4dE3f2A7B9C0', true, true, 88, 'available',   null, 'admin',  '{"hızlı prototipçi","pitch"}'),
 ('a0000003-0000-0000-0000-000000000003', 'Can Demir',      'can.demir@std.yildiz.edu.tr',      '0xE8F312B7aD4c9E6fA2B8C1D3e7F5a9B2c4D8E0F1', true, true, 79, 'limited',     '2026-02-28', 'member', '{"PM"}'),
 ('a0000004-0000-0000-0000-000000000004', 'Ece Şahin',      'ece.sahin@std.yildiz.edu.tr',      '0xB9D44E8A3cF1d2E6bA8f7C9D0E3A1B2C4F5D6E7A', true, true, 85, 'available',   null, 'member',  '{"DeFi"}'),
 ('a0000005-0000-0000-0000-000000000005', 'Burak Özdemir',  'burak.ozdemir@std.yildiz.edu.tr',  '0x3F9177C2bE8aD4f1C9E2B3A5d7F8C6E0A9B1D2F3', true, true, 94, 'available',   null, 'admin',  '{"zk","security"}'),
 ('a0000006-0000-0000-0000-000000000006', 'Selin Aksoy',    'selin.aksoy@std.yildiz.edu.tr',    '0xC2E899F47aD1b3C6E8F9A2B4d5C7E0F1A8B9D2C3', true, true, 81, 'unavailable', null, 'member',  '{"devrel","içerik"}')
on conflict (student_email) do nothing;

-- üye skill'leri (seviye 1-5)
insert into member_skills (member_id, skill_name, level) values
 ('a0000001-0000-0000-0000-000000000001', 'Solidity', 5),
 ('a0000001-0000-0000-0000-000000000001', 'Smart Contract Development', 5),
 ('a0000001-0000-0000-0000-000000000001', 'Security & Smart Contract Auditing', 4),
 ('a0000002-0000-0000-0000-000000000002', 'Next.js / React', 5),
 ('a0000002-0000-0000-0000-000000000002', 'UI/UX Design', 4),
 ('a0000002-0000-0000-0000-000000000002', 'Pitching & Presentation', 5),
 ('a0000003-0000-0000-0000-000000000003', 'Project Management', 5),
 ('a0000003-0000-0000-0000-000000000003', 'Research & Analysis', 4),
 ('a0000003-0000-0000-0000-000000000003', 'Solidity', 3),
 ('a0000004-0000-0000-0000-000000000004', 'Next.js / React', 4),
 ('a0000004-0000-0000-0000-000000000004', 'DeFi & Tokenomics', 4),
 ('a0000004-0000-0000-0000-000000000004', 'Smart Contract Development', 3),
 ('a0000005-0000-0000-0000-000000000005', 'zk-Proofs & Cryptography', 5),
 ('a0000005-0000-0000-0000-000000000005', 'Solidity', 4),
 ('a0000005-0000-0000-0000-000000000005', 'Security & Smart Contract Auditing', 4),
 ('a0000006-0000-0000-0000-000000000006', 'Pitching & Presentation', 4),
 ('a0000006-0000-0000-0000-000000000006', 'Community Management / DevRel', 5),
 ('a0000006-0000-0000-0000-000000000006', 'Technical Writing & Documentation', 4)
on conflict (member_id, skill_name) do nothing;

-- 6 envanter projesi (kaynak: /home/samet/Projeler/* gerçek repo'lar)
insert into projects (id, title, description, tech_stack, chains, tracks, status, reuse_potential, tags, outcome) values
 ('b0000001-0000-0000-0000-000000000001', 'CatchCat',
  'Canlı kamera ile kedi/köpek tespiti (TensorFlow.js, COCO-SSD, client-side) + minigame + yakalanan hayvan için ERC-721 NFT kartı. Hedef zincir: Monad.',
  '{"Next.js","TypeScript","Tailwind","TensorFlow.js","Solidity","ERC-721"}', '{Mon}', '{"NFT/Gaming","AI×Web3"}',
  'prototype', 'medium', '{"client-side-ai","camera","collectible","fun"}',
  'Prototip aşaması; EVM port gerekirse Monad dışı hackathonlar için uyumlu hale getirilmeli.'),
 ('b0000002-0000-0000-0000-000000000002', 'ROLET',
  'Solana üzerinde FOGC turnuva oyunu. $ROLET token, session key ile gasless turns, 12 kart mekanizması, ghost AI, ELO, durability. Devnet uçtan uca doğrulanmış.',
  '{"Solana","Anchor","Rust","Session Keys","SNS"}', '{Solana}', '{"NFT/Gaming"}',
  'working-demo', 'high', '{"on-chain-game","tournament","session-key","token"}',
  'v0.1 working demo, devnet doğrulanmış.'),
 ('b0000003-0000-0000-0000-000000000003', 'StellarCarry',
  'Stellar zinciri üzerinde proje (Vercel deploy edilmiş, environment yapılandırılmış).',
  '{"Stellar","Soroban"}', '{Stellar}', '{"Infra/Tooling","DeFi"}',
  'working-demo', 'high', '{"stellar","soroban","deployed"}',
  'Çalışan demo, Vercel ortamında.'),
 ('b0000004-0000-0000-0000-000000000004', 'TroyLayer',
  'App + smart contract + tarayıcı eklentisi bileşenli proje. Çok katmanlı (layer) mimari.',
  '{"Next.js","Solidity","Browser Extension"}', '{Ethereum}', '{"Infra/Tooling"}',
  'prototype', 'medium', '{"extension","layer","tooling"}',
  'Prototip; eklenti + app + kontrat iskeleti mevcut.'),
 ('b0000005-0000-0000-0000-000000000005', 'Refaktor',
  'Smart contract (refaktor-sc) + app (refaktor-main) bileşenleri. Infra/tooling odaklı, çalışan demo.',
  '{"Next.js","Solidity","TypeScript"}', '{Ethereum}', '{"Infra/Tooling"}',
  'working-demo', 'medium', '{"tooling","refactoring","devex"}',
  'Çalışan demo (main + sc modülleri).'),
 ('b0000006-0000-0000-0000-000000000006', 'Monad Stealth',
  'Monad zinciri üzerinde gizlilik/stealth odaklı kontratlar. Demo script + deployment + örnekler mevcut.',
  '{"Monad","Solidity"}', '{Mon}', '{"Infra/Tooling","ZK/Privacy"}',
  'prototype', 'medium', '{"monad","stealth","privacy"}',
  'Prototip; demo çalıştırılabilir.')
on conflict (id) do nothing;

-- örnek hackathon (ETHGlobal İstanbul) + dizin kaydı
insert into hackathons (id, name, organizer, date_start, location, status, tracks, chains, required_skills, ideal_team_size, prize_pool, source_name, external_link, watched)
values ('c0000001-0000-0000-0000-000000000001', 'ETHGlobal İstanbul 2026', 'ETHGlobal', '2026-03-12', 'İstanbul', 'upcoming',
  '{"NFT/Gaming","Infra/Tooling","DeFi"}', '{Ethereum,Base}',
  '{"Solidity","Next.js / React","Pitching & Presentation"}', 4, '$1M+', 'ETHGlobal', 'https://ethglobal.com', true)
on conflict (id) do nothing;

insert into directory_listings (hackathon_id, best_fit_project_ids, interested_member_count, applicant_count)
values ('c0000001-0000-0000-0000-000000000001',
  array['b0000005-0000-0000-0000-000000000005','b0000004-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000001'],
  3, 0)
on conflict (hackathon_id) do nothing;

