# ANKHIVA Security & Health Data Baseline

ANKHIVA is designed to handle sensitive medical and identity information. This document is the minimum engineering baseline before accepting real patient data.

## Data separation
ANKHIVA must use its own production Supabase project and storage. Do not combine patient medical data with unrelated products.

## Browser secrets
Only publishable/anon client keys may be exposed to the frontend. Never expose Supabase service-role keys or privileged backend credentials in Vite environment variables.

## Database access
Every patient-data table must have Row Level Security enabled. Patients should only access their own cases and documents. Coordinators and clinicians should receive only the access required for assigned work.

## Medical documents
Use a private storage bucket. Store object metadata separately from the document itself. Signed URLs should be short-lived. Avoid public bucket URLs for reports, scans, photos or identity documents.

## Provider trust
A provider should not be published as verified until the operational team has documented credential and facility checks.

## Logging
Do not place medical histories, diagnoses, document contents or identity documents in client logs, analytics payloads or error-reporting metadata.

## Consent
The intake process must record an appropriate consent event before health information is submitted. Legal/privacy language should be reviewed for the countries ANKHIVA actively targets.

## Emergency use
The service must clearly state that it is not an emergency channel and direct emergencies to local emergency services.

## Before production launch
1. Dedicated backend project.
2. RLS reviewed and tested for patient/staff roles.
3. Private storage policies tested.
4. Authentication and password recovery implemented.
5. Audit logging implemented for staff access.
6. Data retention/deletion procedure defined.
7. Provider verification workflow operational.
8. Privacy policy, terms and consent language legally reviewed.
