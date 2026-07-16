-- =============================================================================
-- P15 / Batch 10 — Subscription & Billing Platform
-- =============================================================================
-- Reference: P5 Batch 10, P15 Subscription & Billing V1
-- Depends on: P6A, P7
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  plan_tier text NOT NULL
    CHECK (plan_tier IN ('free_trial', 'starter', 'professional', 'enterprise', 'custom')),
  billing_interval text NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'annual', 'custom')),
  currency text NOT NULL DEFAULT 'INR',
  monthly_price_minor integer NOT NULL DEFAULT 0,
  annual_price_minor integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_public boolean NOT NULL DEFAULT true,
  trial_days integer NOT NULL DEFAULT 0,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  updated_by uuid REFERENCES auth.users (id)
);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_active
  ON public.subscription_plans (is_active, sort_order);

COMMENT ON TABLE public.subscription_plans IS
  'P15 Batch 10 — Commercial plan catalog for builder organizations.';

CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans (id),
  status text NOT NULL DEFAULT 'trial'
    CHECK (
      status IN (
        'trial',
        'active',
        'expired',
        'suspended',
        'cancelled',
        'pending_payment'
      )
    ),
  billing_interval text NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'annual', 'custom')),
  currency text NOT NULL DEFAULT 'INR',
  amount_minor integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  trial_ends_at timestamptz,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  renews_at timestamptz,
  cancelled_at timestamptz,
  suspended_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users (id),
  updated_by uuid REFERENCES auth.users (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_organization_subscriptions_active
  ON public.organization_subscriptions (organization_id)
  WHERE status IN ('trial', 'active', 'pending_payment');

CREATE INDEX IF NOT EXISTS idx_organization_subscriptions_org_status
  ON public.organization_subscriptions (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_organization_subscriptions_renews
  ON public.organization_subscriptions (renews_at)
  WHERE status IN ('trial', 'active');

COMMENT ON TABLE public.organization_subscriptions IS
  'P15 Batch 10 — Builder organization subscription entitlement (one active at a time).';

CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES public.organization_subscriptions (id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'open', 'paid', 'void', 'past_due')),
  currency text NOT NULL DEFAULT 'INR',
  subtotal_minor integer NOT NULL DEFAULT 0,
  tax_minor integer NOT NULL DEFAULT 0,
  total_minor integer NOT NULL DEFAULT 0,
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  pdf_url text,
  notes text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_org
  ON public.subscription_invoices (organization_id, issued_at DESC);

COMMENT ON TABLE public.subscription_invoices IS
  'P15 Batch 10 — Invoices for builder subscriptions.';

CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES public.organization_subscriptions (id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES public.subscription_invoices (id) ON DELETE SET NULL,
  amount_minor integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method text,
  transaction_reference text,
  provider_code text,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_payments_org
  ON public.subscription_payments (organization_id, created_at DESC);

COMMENT ON TABLE public.subscription_payments IS
  'P15 Batch 10 — Payment history; provider integration is abstracted in application layer.';

CREATE OR REPLACE FUNCTION public.enforce_builder_subscription_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.is_builder_org(NEW.organization_id) THEN
    RAISE EXCEPTION 'organization_subscriptions.organization_id must reference a builder organization';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_organization_subscriptions_scope ON public.organization_subscriptions;
CREATE TRIGGER trg_organization_subscriptions_scope
  BEFORE INSERT OR UPDATE
  ON public.organization_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_builder_subscription_scope();

-- Seed default plans (idempotent by code)
INSERT INTO public.subscription_plans (
  code, name, description, plan_tier, billing_interval, currency,
  monthly_price_minor, annual_price_minor, trial_days, limits, features, sort_order
)
VALUES
  (
    'free_trial',
    'Free Trial',
    'Time-boxed trial for new builder organizations.',
    'free_trial',
    'monthly',
    'INR',
    0,
    0,
    14,
    jsonb_build_object(
      'projects', 2,
      'buildings', 4,
      'units', 50,
      'owners', 50,
      'staff', 3,
      'storageGb', 5,
      'monthlyNotifications', 50,
      'whiteLabel', false,
      'advancedReports', false,
      'prioritySupport', false,
      'apiAccess', false,
      'customDomain', false
    ),
    '["Trial access","Limited projects","Email support"]'::jsonb,
    10
  ),
  (
    'starter',
    'Starter',
    'For emerging builder organizations.',
    'starter',
    'monthly',
    'INR',
    14900,
    149000,
    0,
    jsonb_build_object(
      'projects', 5,
      'buildings', 15,
      'units', 200,
      'owners', 200,
      'staff', 10,
      'storageGb', 50,
      'monthlyNotifications', 500,
      'whiteLabel', false,
      'advancedReports', false,
      'prioritySupport', false,
      'apiAccess', false,
      'customDomain', false
    ),
    '["Project management","Owner assignment","Document upload"]'::jsonb,
    20
  ),
  (
    'professional',
    'Professional',
    'Scale operations with branding and higher limits.',
    'professional',
    'monthly',
    'INR',
    39900,
    399000,
    0,
    jsonb_build_object(
      'projects', 25,
      'buildings', 100,
      'units', 2000,
      'owners', 2000,
      'staff', 50,
      'storageGb', 250,
      'monthlyNotifications', 5000,
      'whiteLabel', true,
      'advancedReports', true,
      'prioritySupport', true,
      'apiAccess', false,
      'customDomain', false
    ),
    '["White-label branding","Priority support","Advanced reports"]'::jsonb,
    30
  ),
  (
    'enterprise',
    'Enterprise',
    'Custom limits, dedicated success, and enterprise agreements.',
    'enterprise',
    'annual',
    'INR',
    0,
    0,
    0,
    jsonb_build_object(
      'projects', 9999,
      'buildings', 9999,
      'units', 9999,
      'owners', 9999,
      'staff', 9999,
      'storageGb', 9999,
      'monthlyNotifications', 999999,
      'whiteLabel', true,
      'advancedReports', true,
      'prioritySupport', true,
      'apiAccess', true,
      'customDomain', true
    ),
    '["Custom limits","Dedicated success","API access","Custom domain"]'::jsonb,
    40
  )
ON CONFLICT (code) DO NOTHING;

COMMIT;
