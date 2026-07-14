import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bill-upgrade-insights',
  template: `
    <section class="bill-upgrade-insights" aria-label="Upgrade insights">
      <header class="bill-upgrade-insights__header">
        <h2 class="bill-upgrade-insights__title">Upgrade insights</h2>
        <p class="bill-upgrade-insights__subtitle">Guidance for moving orgs between tiers.</p>
      </header>

      <div class="bill-upgrade-insights__grid">
        <article class="bill-insight bill-insight--recommend">
          <div class="bill-insight__icon" aria-hidden="true">
            <i class="pi pi-arrow-up"></i>
          </div>
          <h3 class="bill-insight__heading">Upgrade recommendation</h3>
          <p class="bill-insight__copy">
            Organizations approaching seat, storage, or organization limits on Growth typically see
            better outcomes on Business — especially when white-label, SSO, and higher API ceilings
            are already in active use. Prioritize orgs with sustained 80%+ utilization for the next
            renewal conversation.
          </p>
          <ul class="bill-insight__list">
            <li>Seat utilization above 80% for two consecutive months</li>
            <li>Requesting SSO / SAML or dedicated success coverage</li>
            <li>Expanding beyond five child organizations</li>
          </ul>
        </article>

        <article class="bill-insight bill-insight--warn">
          <div class="bill-insight__icon" aria-hidden="true">
            <i class="pi pi-arrow-down"></i>
          </div>
          <h3 class="bill-insight__heading">Downgrade warning</h3>
          <p class="bill-insight__copy">
            Downgrading removes access to features included only on the higher tier. Confirm that
            excess seats, extra organizations, and enterprise identity integrations are no longer
            required before approving a downgrade. Past-due accounts should settle invoices before
            any plan change.
          </p>
          <ul class="bill-insight__list">
            <li>White-label branding and SSO may be disabled on lower tiers</li>
            <li>Seat counts above the target plan must be reduced first</li>
            <li>Annual contracts may include early-change fees</li>
          </ul>
        </article>
      </div>
    </section>
  `,
  styles: `
    .bill-upgrade-insights {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
    }

    .bill-upgrade-insights__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-upgrade-insights__subtitle {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-upgrade-insights__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
      gap: var(--mpa-spacing-md, 1rem);
    }

    .bill-insight {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-insight--recommend {
      border-color: color-mix(in srgb, var(--mpa-color-success) 35%, var(--mpa-color-border));
      background: linear-gradient(
        160deg,
        color-mix(in srgb, var(--mpa-color-success) 8%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-insight--warn {
      border-color: color-mix(in srgb, var(--mpa-color-warning) 40%, var(--mpa-color-border));
      background: linear-gradient(
        160deg,
        color-mix(in srgb, var(--mpa-color-warning) 10%, var(--mpa-color-surface)),
        var(--mpa-color-surface)
      );
    }

    .bill-insight__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      font-size: 1rem;
    }

    .bill-insight--recommend .bill-insight__icon {
      background: color-mix(in srgb, var(--mpa-color-success) 16%, transparent);
      color: var(--mpa-color-success);
    }

    .bill-insight--warn .bill-insight__icon {
      background: color-mix(in srgb, var(--mpa-color-warning) 18%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-insight__heading {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-insight__copy {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      line-height: 1.55;
      color: var(--mpa-color-text-muted);
    }

    .bill-insight__list {
      margin: 0.25rem 0 0;
      padding-left: 1.1rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillUpgradeInsightsComponent {}
