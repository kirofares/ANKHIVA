-- ANKHIVA security hardening, auth bootstrap, private storage and audit metadata

-- Keep patient profiles synchronized with Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    country,
    phone,
    preferred_language,
    role
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'country', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_language', ''), 'English'),
    'patient'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at maintenance.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists medical_cases_set_updated_at on public.medical_cases;
create trigger medical_cases_set_updated_at
  before update on public.medical_cases
  for each row execute procedure public.set_updated_at();

-- Patients must never be able to promote their own role.
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;

create policy "profiles_self_or_staff_read"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.current_app_role() in ('coordinator','clinician','admin')
);

create policy "profiles_self_update"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = public.current_app_role()
);

revoke update on public.profiles from authenticated;
grant update (full_name, country, phone, preferred_language) on public.profiles to authenticated;

-- Public catalog policies should not leak unpublished relationships.
drop policy if exists "provider_specialties_public" on public.provider_specialties;
create policy "provider_specialties_published_or_staff"
on public.provider_specialties
for select
using (
  public.current_app_role() in ('coordinator','clinician','admin')
  or (
    exists (
      select 1 from public.providers p
      where p.id = provider_id and p.published
    )
    and exists (
      select 1 from public.specialties s
      where s.id = specialty_id and s.published
    )
  )
);

-- Admin catalog management.
create policy "admin_manage_specialties"
on public.specialties
for all
to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin_manage_providers"
on public.providers
for all
to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin_manage_provider_specialties"
on public.provider_specialties
for all
to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "admin_manage_treatment_packages"
on public.treatment_packages
for all
to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

-- Tighten case document access.
drop policy if exists "document_owner_or_staff_read" on public.case_documents;
drop policy if exists "patient_upload_document_row" on public.case_documents;

create policy "document_case_members_read"
on public.case_documents
for select
to authenticated
using (
  exists (
    select 1
    from public.medical_cases c
    where c.id = case_id
      and c.patient_id = patient_id
      and (
        c.patient_id = auth.uid()
        or c.assigned_coordinator = auth.uid()
        or public.current_app_role() in ('clinician','admin')
      )
  )
);

create policy "patient_upload_document_row"
on public.case_documents
for insert
to authenticated
with check (
  patient_id = auth.uid()
  and split_part(storage_path, '/', 1) = auth.uid()::text
  and exists (
    select 1
    from public.medical_cases c
    where c.id = case_id
      and c.patient_id = auth.uid()
      and split_part(storage_path, '/', 2) = c.id::text
  )
);

create policy "document_case_members_delete"
on public.case_documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.medical_cases c
    where c.id = case_id
      and c.patient_id = patient_id
      and (
        c.patient_id = auth.uid()
        or c.assigned_coordinator = auth.uid()
        or public.current_app_role() = 'admin'
      )
  )
);

create unique index if not exists case_documents_storage_path_key
  on public.case_documents(storage_path);

-- Only the assigned coordinator or an admin can manage a quote.
drop policy if exists "staff_manage_quotes" on public.quotes;

create policy "assigned_coordinator_or_admin_manage_quotes"
on public.quotes
for all
to authenticated
using (
  public.current_app_role() = 'admin'
  or exists (
    select 1
    from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = auth.uid()
      and public.current_app_role() = 'coordinator'
  )
)
with check (
  public.current_app_role() = 'admin'
  or exists (
    select 1
    from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = auth.uid()
      and public.current_app_role() = 'coordinator'
  )
);

-- Consent versioning.
create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.medical_cases(id) on delete cascade,
  consent_type text not null check (consent_type in ('medical_coordination','privacy','terms')),
  policy_version text not null,
  accepted_at timestamptz not null default now()
);

alter table public.consent_events enable row level security;

create policy "consent_owner_read"
on public.consent_events
for select
to authenticated
using (user_id = auth.uid() or public.current_app_role() = 'admin');

create policy "consent_owner_insert"
on public.consent_events
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    case_id is null
    or exists (
      select 1 from public.medical_cases c
      where c.id = case_id and c.patient_id = auth.uid()
    )
  )
);

-- Private medical document bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medical-documents',
  'medical-documents',
  false,
  26214400,
  array['application/pdf','image/jpeg','image/png']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "medical_documents_select" on storage.objects;
drop policy if exists "medical_documents_insert" on storage.objects;
drop policy if exists "medical_documents_delete" on storage.objects;

create policy "medical_documents_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'medical-documents'
  and exists (
    select 1
    from public.medical_cases c
    where c.patient_id::text = split_part(name, '/', 1)
      and c.id::text = split_part(name, '/', 2)
      and (
        c.patient_id = auth.uid()
        or c.assigned_coordinator = auth.uid()
        or public.current_app_role() in ('clinician','admin')
      )
  )
);

create policy "medical_documents_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'medical-documents'
  and split_part(name, '/', 1) = auth.uid()::text
  and exists (
    select 1
    from public.medical_cases c
    where c.patient_id = auth.uid()
      and c.id::text = split_part(name, '/', 2)
  )
);

create policy "medical_documents_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'medical-documents'
  and exists (
    select 1
    from public.medical_cases c
    where c.patient_id::text = split_part(name, '/', 1)
      and c.id::text = split_part(name, '/', 2)
      and (
        c.patient_id = auth.uid()
        or c.assigned_coordinator = auth.uid()
        or public.current_app_role() = 'admin'
      )
  )
);

-- Metadata-only audit trail. Do not duplicate clinical text into the audit log.
create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid,
  table_name text not null,
  row_id text,
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  occurred_at timestamptz not null default now()
);

alter table public.audit_events enable row level security;

create policy "admin_read_audit"
on public.audit_events
for select
to authenticated
using (public.current_app_role() = 'admin');

create or replace function public.audit_row_metadata()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id text;
begin
  if tg_op = 'DELETE' then
    target_id := old.id::text;
  else
    target_id := new.id::text;
  end if;

  insert into public.audit_events(actor_id, table_name, row_id, action)
  values (auth.uid(), tg_table_name, target_id, tg_op);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists audit_medical_cases on public.medical_cases;
create trigger audit_medical_cases
after insert or update or delete on public.medical_cases
for each row execute procedure public.audit_row_metadata();

drop trigger if exists audit_case_documents on public.case_documents;
create trigger audit_case_documents
after insert or update or delete on public.case_documents
for each row execute procedure public.audit_row_metadata();

drop trigger if exists audit_quotes on public.quotes;
create trigger audit_quotes
after insert or update or delete on public.quotes
for each row execute procedure public.audit_row_metadata();

drop trigger if exists audit_case_messages on public.case_messages;
create trigger audit_case_messages
after insert or update or delete on public.case_messages
for each row execute procedure public.audit_row_metadata();

-- Common query indexes.
create index if not exists medical_cases_patient_id_idx on public.medical_cases(patient_id);
create index if not exists medical_cases_assigned_coordinator_idx on public.medical_cases(assigned_coordinator);
create index if not exists medical_cases_status_idx on public.medical_cases(status);
create index if not exists case_documents_case_id_idx on public.case_documents(case_id);
create index if not exists quotes_case_id_idx on public.quotes(case_id);
create index if not exists case_messages_case_id_created_at_idx on public.case_messages(case_id, created_at);
create index if not exists consent_events_user_id_idx on public.consent_events(user_id);
