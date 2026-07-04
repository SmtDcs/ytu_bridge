-- YTU Bridge — Schema v1 (Supabase / Postgres)
-- docs/data-model.ts ile birebir uyumlu.
-- Çalıştırma: supabase db push  veya  supabase migration up
-- ---------------------------------------------------------------------------

-- enums (text + check; Supabase'de tip güvenliği için)
do $$ begin
  create type availability_status as enum ('available','limited','unavailable');
exception when duplicate_object then null; end $$;
do $$ begin
  create type hackathon_status as enum ('upcoming','ongoing','completed');
exception when duplicate_object then null; end $$;
do $$ begin
  create type project_status as enum ('idea','prototype','working-demo','production','abandoned');
exception when duplicate_object then null; end $$;
do $$ begin
  create type reuse_potential as enum ('high','medium','low');
exception when duplicate_object then null; end $$;
do $$ begin
  create type application_status as enum ('pending','approved','rejected','withdrawn');
exception when duplicate_object then null; end $$;
do $$ begin
  create type invite_status as enum ('pending','accepted','declined','expired');
exception when duplicate_object then null; end $$;
do $$ begin
  create type participation_channel as enum ('club-initiative','individual-joker');
exception when duplicate_object then null; end $$;
do $$ begin
  create type role_kind as enum ('member','admin');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- members
-- ---------------------------------------------------------------------------
create table if not exists members (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  student_email   text not null unique,            -- std.yildiz.edu.tr
  email_verified  boolean not null default false,   -- lider manuel onay
  wallet_address  text not null unique,             -- 0x... (SIWE yok)
  wallet_verified boolean not null default false,
  joined_at       timestamptz not null default now(),
  internal_rating int not null default 0 check (internal_rating between 0 and 100),
  tags            text[] not null default '{}',
  notes           text,
  availability_status availability_status not null default 'available',
  availability_until date,
  role            role_kind not null default 'member',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- skills (her üye 6-8 skill, seviye 1-5)
-- ---------------------------------------------------------------------------
create table if not exists member_skills (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  skill_name  text not null,
  level       int not null check (level between 1 and 5),
  unique (member_id, skill_name)
);
create index if not exists idx_member_skills_name on member_skills(skill_name);
create index if not exists idx_member_skills_member on member_skills(member_id);

-- skill önerileri ("Diğer" akışı)
create table if not exists skill_proposals (
  id             uuid primary key default gen_random_uuid(),
  suggested_name text not null,
  proposed_by    uuid not null references members(id) on delete set null,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  popularity     int not null default 1,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- hackathons
-- ---------------------------------------------------------------------------
create table if not exists hackathons (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  organizer           text,
  date_start          date not null,
  date_end            date,
  location            text,
  status              hackathon_status not null default 'upcoming',
  tracks              text[] not null default '{}',
  chains              text[] not null default '{}',
  required_skills     text[] not null default '{}',
  ideal_team_size     int not null default 4,
  prize_pool          text,
  application_deadline date,
  description         text,
  external_link       text,
  source_name         text,
  source_url          text,
  watched             boolean not null default false,
  best_fit_score      int,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_hackathons_status on hackathons(status);
create index if not exists idx_hackathons_date on hackathons(date_start);

-- aylık keşif batch'i
create table if not exists monthly_batches (
  id            uuid primary key default gen_random_uuid(),
  month         text not null,                      -- '2026-07'
  raw_input     text not null,
  hackathon_ids uuid[] not null default '{}',
  reviewed_by   uuid references members(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (month)
);

-- ---------------------------------------------------------------------------
-- projects (envanter)
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  tech_stack      text[] not null default '{}',
  chains          text[] not null default '{}',
  tracks          text[] not null default '{}',
  status          project_status not null default 'idea',
  reuse_potential reuse_potential not null default 'medium',
  tags            text[] not null default '{}',
  repo_url        text,
  demo_url        text,
  pitch_url       text,
  hackathon_id    uuid references hackathons(id) on delete set null,
  outcome         text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- proje sahipleri (many-to-many)
create table if not exists project_owners (
  project_id uuid not null references projects(id) on delete cascade,
  member_id  uuid not null references members(id) on delete cascade,
  primary key (project_id, member_id)
);

-- dizin listesi (üyelerin gördüğü özet — DoraHacks tarzı)
create table if not exists directory_listings (
  hackathon_id            uuid primary key references hackathons(id) on delete cascade,
  cover_image             text,
  best_fit_project_ids    uuid[] not null default '{}',
  interested_member_count int not null default 0,
  applicant_count         int not null default 0
);


-- ---------------------------------------------------------------------------
-- katılım, atama, değerlendirme
-- ---------------------------------------------------------------------------
create table if not exists participations (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references members(id) on delete cascade,
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  role           text not null,
  team_name      text,
  result         text,                              -- '1st','top10','participated'...
  feedback       text,
  links          text[] not null default '{}',
  learned_skills text[] not null default '{}',
  channel        participation_channel not null default 'club-initiative',
  created_at     timestamptz not null default now()
);
create index if not exists idx_part_member on participations(member_id);
create index if not exists idx_part_hack on participations(hackathon_id);

create table if not exists assignments (
  id            uuid primary key default gen_random_uuid(),
  hackathon_id  uuid not null references hackathons(id) on delete cascade,
  member_id     uuid not null references members(id) on delete cascade,
  assigned_role text not null,
  assigned_by   uuid references members(id) on delete set null,
  notified_at   timestamptz,
  accepted_at   timestamptz,
  channel       participation_channel not null default 'club-initiative',
  created_at    timestamptz not null default now()
);

create table if not exists evaluations (
  id             uuid primary key default gen_random_uuid(),
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  member_id      uuid not null references members(id) on delete cascade,
  score          int not null check (score between 0 and 100),
  strengths      text[] not null default '{}',
  improvements   text[] not null default '{}',
  result         text,
  learned_skills text[] not null default '{}',
  submitted_by   uuid references members(id) on delete set null,
  submitted_at   timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- Kanal 2: başvuru + joker takım daveti
-- ---------------------------------------------------------------------------
create table if not exists applications (
  id             uuid primary key default gen_random_uuid(),
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  member_id      uuid not null references members(id) on delete cascade,
  channel        participation_channel not null default 'individual-joker',
  status         application_status not null default 'pending',
  preferred_role text,
  motivation     text,
  team_name      text,
  team_member_ids uuid[] not null default '{}',
  proposed_roles jsonb,                             -- {memberId: role}
  reviewed_by    uuid references members(id) on delete set null,
  review_note    text,
  submitted_at   timestamptz not null default now(),
  reviewed_at    timestamptz
);
create index if not exists idx_app_hack on applications(hackathon_id);
create index if not exists idx_app_member on applications(member_id);

create table if not exists team_invites (
  id            uuid primary key default gen_random_uuid(),
  hackathon_id  uuid not null references hackathons(id) on delete cascade,
  from_member_id uuid not null references members(id) on delete cascade,
  to_member_id  uuid not null references members(id) on delete cascade,
  proposed_role text,
  status        invite_status not null default 'pending',
  message       text,
  application_id uuid references applications(id) on delete set null,
  created_at    timestamptz not null default now(),
  responded_at  timestamptz
);

-- ---------------------------------------------------------------------------
-- eşleştirme motoru çıktısı (proje × hackathon uygunluk)
-- ---------------------------------------------------------------------------
create table if not exists project_hackathon_fits (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  hackathon_id    uuid not null references hackathons(id) on delete cascade,
  score           int not null check (score between 0 and 100),
  matched_tracks  text[] not null default '{}',
  matched_chains  text[] not null default '{}',
  gaps            text[] not null default '{}',
  pivot_notes     text,
  recommended     boolean not null default false,
  computed_at     timestamptz not null default now(),
  unique (project_id, hackathon_id)
);
create index if not exists idx_fit_hack on project_hackathon_fits(hackathon_id);
create index if not exists idx_fit_score on project_hackathon_fits(score desc);


-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text;
begin
  for t in select unnest(array['members','hackathons','projects']) loop
    execute format('drop trigger if exists trg_touch_%I on %I; create trigger trg_touch_%I before update on %I for each row execute function touch_updated_at();', t, t, t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- RLS — üyeler diğer üyelerin tam profilini görür (Kanal 2 joker davet için).
-- auth.uid() Supabase Auth ile eşleşir (wallet -> auth); şimdilik permissive,
-- gerçek auth gelince sıkılaştırılacak.
-- ---------------------------------------------------------------------------
alter table members enable row level security;
alter table member_skills enable row level security;
alter table hackathons enable row level security;
alter table projects enable row level security;
alter table project_owners enable row level security;
alter table directory_listings enable row level security;
alter table participations enable row level security;
alter table applications enable row level security;
alter table team_invites enable row level security;

create policy "members read" on members for select using (true);
create policy "skills read" on member_skills for select using (true);
create policy "hackathons read" on hackathons for select using (true);
create policy "projects read" on projects for select using (true);
create policy "owners read" on project_owners for select using (true);
create policy "directory read" on directory_listings for select using (true);
create policy "participations read" on participations for select using (true);
create policy "applications read" on applications for select using (true);
create policy "invites read" on team_invites for select using (true);

-- yazma: service_role + admin (gerçek auth sonrası sıkılaştırılacak)
create policy "members admin write" on members for all using (true) with check (true);
create policy "hackathons admin write" on hackathons for all using (true) with check (true);
create policy "projects admin write" on projects for all using (true) with check (true);

