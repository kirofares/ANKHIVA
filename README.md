# ANKHIVA — International Medical Care in Egypt

ANKHIVA is an international medical-tourism platform for patients seeking coordinated treatment in Egypt.

**Positioning:** Egyptian Heritage. Modern Medical Care.

## MVP v0.2

### Public experience
- Premium responsive landing page
- Treatment categories
- Provider directory
- Indicative treatment packages
- Structured 3-step medical intake flow
- Patient journey and Egypt value proposition

### Patient portal
- Case overview
- Current care stage
- Milestones
- Documents status
- Coordinator messaging entry point
- Travel/recovery pathway

### Operations / admin
- International patient case dashboard
- Case status and priority view
- Provider and package management entry points
- Quote workflow architecture

### Backend architecture
A dedicated Supabase schema is prepared in:
`supabase/migrations/001_ankhiva_core.sql`

It includes:
- profiles and roles
- specialties
- providers
- treatment packages
- medical cases
- medical document metadata
- quotes
- case messages
- Row Level Security policies

**Important:** The schema must be deployed to a dedicated ANKHIVA Supabase project. Do not deploy medical-tourism patient data into another product database.

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and provide:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Never put service-role keys in browser environment variables.

## Production security requirements
- Private medical-document bucket
- RLS on every patient-data table
- Patient/case-scoped storage paths
- Staff roles with least privilege
- Provider verification before public listing
- Audit trail for sensitive administrative actions
- Consent and privacy notices reviewed for target markets
- Separate operational emergency guidance; ANKHIVA is not an emergency service
- No real medical data should be entered until the dedicated backend and policies are active

## Current status
The frontend flows and database design are committed. The public intake currently **does not store medical data** until the dedicated ANKHIVA Supabase project is connected.
