# Storage Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-007_API_Data_Access_Architecture.md`](NG-007_API_Data_Access_Architecture.md)
**Covers:** Storage Strategy, Document Upload Strategy, File Download Strategy.

## 15. Storage Strategy

**This platform reuses the backend's existing Storage conventions — it does not design a new one.** The backend already established: private buckets (never `public = true`), signed-URL access generated at read time, never `getPublicUrl()`. Every Storage interaction from this Web Platform follows that same convention, consistent with this whole series' "reference, don't duplicate" discipline applied to infrastructure, not just data.

Two concrete reuse points relevant to this platform specifically:
- **Handover Documents** (`builder-portal-documents`, A-007 ID-09) use the same `property-documents`-style bucket pattern the backend already established for the existing Owner-side document vault — not a new bucket.
- **White-label branding assets** (Organization logos, A-007 ID-04) reuse the same private-bucket-plus-signed-URL pattern — an Organization's logo is not made `public = true` just because it's "branding," it follows this platform's own storage conventions like anything else.

## 16. Document Upload Strategy

A Repository method wraps the Storage upload call and returns a **storage path**, never a raw public URL — matching the backend's own existing convention exactly (already confirmed as the pattern the current Flutter app's document/expense-receipt features use). Upload validation (file type, size limits) happens both client-side (UX convenience, immediate feedback) and server-side (the actual boundary, per `REPOSITORY_ARCHITECTURE.md` §1's RLS-is-real-enforcement principle, extended to Storage policies specifically).

## 17. File Download Strategy

A signed URL is generated at read time, with a bounded expiry — never a long-lived or public URL cached client-side beyond the immediate viewing session. This is the same pattern this whole series has referenced from the backend since NG-003's `PACKAGE_ARCHITECTURE.md`, applied here to the specific act of downloading rather than just storing.
