-- Address Supabase security/performance advisor findings.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.current_app_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

grant execute on function private.current_app_role() to anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id, full_name, country, phone, preferred_language, role
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

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();

create or replace function private.audit_row_metadata()
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
  values ((select auth.uid()), tg_table_name, target_id, tg_op);

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function private.audit_row_metadata() from public, anon, authenticated;

drop trigger if exists audit_medical_cases on public.medical_cases;
create trigger audit_medical_cases after insert or update or delete on public.medical_cases
for each row execute procedure private.audit_row_metadata();

drop trigger if exists audit_case_documents on public.case_documents;
create trigger audit_case_documents after insert or update or delete on public.case_documents
for each row execute procedure private.audit_row_metadata();

drop trigger if exists audit_quotes on public.quotes;
create trigger audit_quotes after insert or update or delete on public.quotes
for each row execute procedure private.audit_row_metadata();

drop trigger if exists audit_case_messages on public.case_messages;
create trigger audit_case_messages after insert or update or delete on public.case_messages
for each row execute procedure private.audit_row_metadata();

-- Rebuild policies using init-plan-friendly auth calls and non-overlapping write policies.
drop policy if exists "profiles_self_or_staff_read" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_or_staff_read" on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or (select private.current_app_role()) in ('coordinator','clinician','admin')
);
create policy "profiles_self_update" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (
  id = (select auth.uid())
  and role = (select private.current_app_role())
);

drop policy if exists "published_specialties_public" on public.specialties;
drop policy if exists "admin_manage_specialties" on public.specialties;
create policy "published_specialties_public" on public.specialties
for select using (
  published or (select private.current_app_role()) in ('coordinator','clinician','admin')
);
create policy "admin_insert_specialties" on public.specialties
for insert to authenticated with check ((select private.current_app_role()) = 'admin');
create policy "admin_update_specialties" on public.specialties
for update to authenticated using ((select private.current_app_role()) = 'admin')
with check ((select private.current_app_role()) = 'admin');
create policy "admin_delete_specialties" on public.specialties
for delete to authenticated using ((select private.current_app_role()) = 'admin');

drop policy if exists "published_providers_public" on public.providers;
drop policy if exists "admin_manage_providers" on public.providers;
create policy "published_providers_public" on public.providers
for select using (
  published or (select private.current_app_role()) in ('coordinator','clinician','admin')
);
create policy "admin_insert_providers" on public.providers
for insert to authenticated with check ((select private.current_app_role()) = 'admin');
create policy "admin_update_providers" on public.providers
for update to authenticated using ((select private.current_app_role()) = 'admin')
with check ((select private.current_app_role()) = 'admin');
create policy "admin_delete_providers" on public.providers
for delete to authenticated using ((select private.current_app_role()) = 'admin');

drop policy if exists "provider_specialties_published_or_staff" on public.provider_specialties;
drop policy if exists "admin_manage_provider_specialties" on public.provider_specialties;
create policy "provider_specialties_published_or_staff" on public.provider_specialties
for select using (
  (select private.current_app_role()) in ('coordinator','clinician','admin')
  or (
    exists (select 1 from public.providers p where p.id = provider_id and p.published)
    and exists (select 1 from public.specialties s where s.id = specialty_id and s.published)
  )
);
create policy "admin_insert_provider_specialties" on public.provider_specialties
for insert to authenticated with check ((select private.current_app_role()) = 'admin');
create policy "admin_update_provider_specialties" on public.provider_specialties
for update to authenticated using ((select private.current_app_role()) = 'admin')
with check ((select private.current_app_role()) = 'admin');
create policy "admin_delete_provider_specialties" on public.provider_specialties
for delete to authenticated using ((select private.current_app_role()) = 'admin');

drop policy if exists "published_packages_public" on public.treatment_packages;
drop policy if exists "admin_manage_treatment_packages" on public.treatment_packages;
create policy "published_packages_public" on public.treatment_packages
for select using (
  published or (select private.current_app_role()) in ('coordinator','clinician','admin')
);
create policy "admin_insert_treatment_packages" on public.treatment_packages
for insert to authenticated with check ((select private.current_app_role()) = 'admin');
create policy "admin_update_treatment_packages" on public.treatment_packages
for update to authenticated using ((select private.current_app_role()) = 'admin')
with check ((select private.current_app_role()) = 'admin');
create policy "admin_delete_treatment_packages" on public.treatment_packages
for delete to authenticated using ((select private.current_app_role()) = 'admin');

drop policy if exists "patient_create_case" on public.medical_cases;
drop policy if exists "case_owner_or_staff_read" on public.medical_cases;
drop policy if exists "staff_update_cases" on public.medical_cases;
create policy "patient_create_case" on public.medical_cases
for insert to authenticated
with check (patient_id = (select auth.uid()));
create policy "case_owner_or_staff_read" on public.medical_cases
for select to authenticated
using (
  patient_id = (select auth.uid())
  or assigned_coordinator = (select auth.uid())
  or (select private.current_app_role()) in ('clinician','admin')
);
create policy "staff_update_cases" on public.medical_cases
for update to authenticated
using (
  assigned_coordinator = (select auth.uid())
  or (select private.current_app_role()) in ('clinician','admin')
)
with check (
  assigned_coordinator = (select auth.uid())
  or (select private.current_app_role()) in ('clinician','admin')
);

drop policy if exists "document_case_members_read" on public.case_documents;
drop policy if exists "patient_upload_document_row" on public.case_documents;
drop policy if exists "document_case_members_delete" on public.case_documents;
create policy "document_case_members_read" on public.case_documents
for select to authenticated
using (
  exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.patient_id = patient_id
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) in ('clinician','admin')
      )
  )
);
create policy "patient_upload_document_row" on public.case_documents
for insert to authenticated
with check (
  patient_id = (select auth.uid())
  and split_part(storage_path, '/', 1) = (select auth.uid())::text
  and exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.patient_id = (select auth.uid())
      and split_part(storage_path, '/', 2) = c.id::text
  )
);
create policy "document_case_members_delete" on public.case_documents
for delete to authenticated
using (
  exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.patient_id = patient_id
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) = 'admin'
      )
  )
);

drop policy if exists "quote_owner_or_staff_read" on public.quotes;
drop policy if exists "assigned_coordinator_or_admin_manage_quotes" on public.quotes;
create policy "quote_owner_or_staff_read" on public.quotes
for select to authenticated
using (
  exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) in ('clinician','admin')
      )
  )
);
create policy "assigned_coordinator_or_admin_insert_quotes" on public.quotes
for insert to authenticated
with check (
  (select private.current_app_role()) = 'admin'
  or exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = (select auth.uid())
      and (select private.current_app_role()) = 'coordinator'
  )
);
create policy "assigned_coordinator_or_admin_update_quotes" on public.quotes
for update to authenticated
using (
  (select private.current_app_role()) = 'admin'
  or exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = (select auth.uid())
      and (select private.current_app_role()) = 'coordinator'
  )
)
with check (
  (select private.current_app_role()) = 'admin'
  or exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = (select auth.uid())
      and (select private.current_app_role()) = 'coordinator'
  )
);
create policy "assigned_coordinator_or_admin_delete_quotes" on public.quotes
for delete to authenticated
using (
  (select private.current_app_role()) = 'admin'
  or exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and c.assigned_coordinator = (select auth.uid())
      and (select private.current_app_role()) = 'coordinator'
  )
);

drop policy if exists "case_message_members_read" on public.case_messages;
drop policy if exists "case_message_members_insert" on public.case_messages;
create policy "case_message_members_read" on public.case_messages
for select to authenticated
using (
  exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) in ('clinician','admin')
      )
  )
);
create policy "case_message_members_insert" on public.case_messages
for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.medical_cases c
    where c.id = case_id
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) in ('clinician','admin')
      )
  )
);

drop policy if exists "consent_owner_read" on public.consent_events;
drop policy if exists "consent_owner_insert" on public.consent_events;
create policy "consent_owner_read" on public.consent_events
for select to authenticated
using (
  user_id = (select auth.uid())
  or (select private.current_app_role()) = 'admin'
);
create policy "consent_owner_insert" on public.consent_events
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (
    case_id is null
    or exists (
      select 1 from public.medical_cases c
      where c.id = case_id and c.patient_id = (select auth.uid())
    )
  )
);

drop policy if exists "admin_read_audit" on public.audit_events;
create policy "admin_read_audit" on public.audit_events
for select to authenticated
using ((select private.current_app_role()) = 'admin');

drop policy if exists "medical_documents_select" on storage.objects;
drop policy if exists "medical_documents_insert" on storage.objects;
drop policy if exists "medical_documents_delete" on storage.objects;
create policy "medical_documents_select" on storage.objects
for select to authenticated
using (
  bucket_id = 'medical-documents'
  and exists (
    select 1 from public.medical_cases c
    where c.patient_id::text = split_part(name, '/', 1)
      and c.id::text = split_part(name, '/', 2)
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) in ('clinician','admin')
      )
  )
);
create policy "medical_documents_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'medical-documents'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and exists (
    select 1 from public.medical_cases c
    where c.patient_id = (select auth.uid())
      and c.id::text = split_part(name, '/', 2)
  )
);
create policy "medical_documents_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'medical-documents'
  and exists (
    select 1 from public.medical_cases c
    where c.patient_id::text = split_part(name, '/', 1)
      and c.id::text = split_part(name, '/', 2)
      and (
        c.patient_id = (select auth.uid())
        or c.assigned_coordinator = (select auth.uid())
        or (select private.current_app_role()) = 'admin'
      )
  )
);

-- Cover all foreign keys used for joins/deletes.
create index if not exists case_documents_patient_id_idx on public.case_documents(patient_id);
create index if not exists case_messages_sender_id_idx on public.case_messages(sender_id);
create index if not exists consent_events_case_id_idx on public.consent_events(case_id);
create index if not exists medical_cases_specialty_id_idx on public.medical_cases(specialty_id);
create index if not exists provider_specialties_specialty_id_idx on public.provider_specialties(specialty_id);
create index if not exists quotes_provider_id_idx on public.quotes(provider_id);
create index if not exists treatment_packages_provider_id_idx on public.treatment_packages(provider_id);
create index if not exists treatment_packages_specialty_id_idx on public.treatment_packages(specialty_id);

-- Remove obsolete public SECURITY DEFINER functions after dependencies have moved.
drop function if exists public.handle_new_user();
drop function if exists public.audit_row_metadata();
drop function if exists public.current_app_role();
