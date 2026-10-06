-- Limit direct case updates to operational fields only.
revoke update on public.medical_cases from authenticated;
grant update (status, assigned_coordinator, urgency) on public.medical_cases to authenticated;
