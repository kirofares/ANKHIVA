insert into public.specialties (slug, name, description, published)
values
  ('cosmetic-surgery','Cosmetic Surgery','Face, breast and body procedures with coordinated pre-op and recovery planning.',true),
  ('dental-care','Dental Care','Implants, veneers, full-mouth rehabilitation and smile design.',true),
  ('hair-restoration','Hair Restoration','FUE / DHI pathways with structured aftercare.',true),
  ('ophthalmology','Ophthalmology','Vision correction and selected ophthalmic procedures.',true),
  ('bariatric-surgery','Bariatric Surgery','Surgical weight-loss programs with multidisciplinary assessment.',true),
  ('orthopedics','Orthopedics','Joint, spine and selected orthopedic procedures with rehabilitation coordination.',true)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    published = excluded.published;
