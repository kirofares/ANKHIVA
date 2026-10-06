-- ANKHIVA core schema
-- Apply to a DEDICATED ANKHIVA Supabase project, not another product database.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  country text,
  phone text,
  preferred_language text default 'English',
  role text not null default 'patient' check (role in ('patient','coordinator','clinician','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('doctor','hospital','clinic')),
  name text not null,
  city text,
  country text not null default 'Egypt',
  bio text,
  verified boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_specialties (
  provider_id uuid references public.providers(id) on delete cascade,
  specialty_id uuid references public.specialties(id) on delete cascade,
  primary key (provider_id, specialty_id)
);

create table if not exists public.treatment_packages (
  id uuid primary key default gen_random_uuid(),
  specialty_id uuid references public.specialties(id),
  provider_id uuid references public.providers(id),
  title text not null,
  summary text,
  currency text not null default 'USD',
  starting_price numeric(12,2),
  suggested_nights int,
  includes jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.medical_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text unique not null default ('AK-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  patient_id uuid not null references auth.users(id) on delete cascade,
  specialty_id uuid references public.specialties(id),
  assigned_coordinator uuid references auth.users(id),
  status text not null default 'submitted' check (status in ('submitted','awaiting_documents','medical_review','plan_ready','quote_sent','travel_confirmed','in_treatment','follow_up','closed')),
  medical_summary text,
  patient_request text,
  urgency text not null default 'normal' check (urgency in ('normal','high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.medical_cases(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  original_filename text,
  mime_type text,
  document_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.medical_cases(id) on delete cascade,
  provider_id uuid references public.providers(id),
  currency text not null default 'USD',
  medical_cost numeric(12,2) not null default 0,
  accommodation_cost numeric(12,2) not null default 0,
  transport_cost numeric(12,2) not null default 0,
  coordination_fee numeric(12,2) not null default 0,
  total numeric(12,2) generated always as (medical_cost + accommodation_cost + transport_cost + coordination_fee) stored,
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined','expired')),
  valid_until date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.medical_cases(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns text language sql stable security definer set search_path=public
as $$ select role from public.profiles where id = auth.uid() $$;

alter table public.profiles enable row level security;
alter table public.specialties enable row level security;
alter table public.providers enable row level security;
alter table public.provider_specialties enable row level security;
alter table public.treatment_packages enable row level security;
alter table public.medical_cases enable row level security;
alter table public.case_documents enable row level security;
alter table public.quotes enable row level security;
alter table public.case_messages enable row level security;

create policy "profiles_self_read" on public.profiles for select using (id = auth.uid() or public.current_app_role() in ('coordinator','admin'));
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "published_specialties_public" on public.specialties for select using (published or public.current_app_role() in ('coordinator','clinician','admin'));
create policy "published_providers_public" on public.providers for select using (published or public.current_app_role() in ('coordinator','clinician','admin'));
create policy "provider_specialties_public" on public.provider_specialties for select using (true);
create policy "published_packages_public" on public.treatment_packages for select using (published or public.current_app_role() in ('coordinator','clinician','admin'));

create policy "patient_create_case" on public.medical_cases for insert to authenticated with check (patient_id = auth.uid());
create policy "case_owner_or_staff_read" on public.medical_cases for select to authenticated using (patient_id = auth.uid() or assigned_coordinator = auth.uid() or public.current_app_role() in ('clinician','admin'));
create policy "staff_update_cases" on public.medical_cases for update to authenticated using (assigned_coordinator = auth.uid() or public.current_app_role() in ('clinician','admin'));

create policy "document_owner_or_staff_read" on public.case_documents for select to authenticated using (patient_id = auth.uid() or public.current_app_role() in ('coordinator','clinician','admin'));
create policy "patient_upload_document_row" on public.case_documents for insert to authenticated with check (patient_id = auth.uid());

create policy "quote_owner_or_staff_read" on public.quotes for select to authenticated using (
  exists(select 1 from public.medical_cases c where c.id=case_id and (c.patient_id=auth.uid() or c.assigned_coordinator=auth.uid() or public.current_app_role() in ('clinician','admin')))
);
create policy "staff_manage_quotes" on public.quotes for all to authenticated using (public.current_app_role() in ('coordinator','admin')) with check (public.current_app_role() in ('coordinator','admin'));

create policy "case_message_members_read" on public.case_messages for select to authenticated using (
  exists(select 1 from public.medical_cases c where c.id=case_id and (c.patient_id=auth.uid() or c.assigned_coordinator=auth.uid() or public.current_app_role() in ('clinician','admin')))
);
create policy "case_message_members_insert" on public.case_messages for insert to authenticated with check (
  sender_id=auth.uid() and exists(select 1 from public.medical_cases c where c.id=case_id and (c.patient_id=auth.uid() or c.assigned_coordinator=auth.uid() or public.current_app_role() in ('clinician','admin')))
);

-- Storage should use a PRIVATE bucket named 'medical-documents'.
-- Object paths should be namespaced by patient/case and protected with storage.objects RLS
-- after the dedicated ANKHIVA project is created.
