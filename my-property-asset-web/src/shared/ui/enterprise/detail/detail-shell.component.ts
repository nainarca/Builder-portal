import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseDetailLoadingComponent } from './detail-loading.component';
import { EnterpriseDetailTabsComponent } from './detail-tabs.component';
import { EnterpriseStageTrackerComponent } from './stage-tracker.component';
import type {
  EnterpriseDetailChromePattern,
  EnterpriseDetailLifecycleState,
  EnterpriseDetailStageStep,
  EnterpriseDetailTab,
} from './models/enterprise-detail.models';

/**
 * Detail page shell — hero → tabs|stage → main/aside.
 * Presentation layout only (UI-REBIRTH §5 / P0.1 §2.7).
 */
@Component({
  selector: 'app-enterprise-detail-shell',
  imports: [
    EnterpriseDetailLoadingComponent,
    EnterpriseDetailTabsComponent,
    EnterpriseStageTrackerComponent,
  ],
  template: `
    <div
      class="enterprise-detail-shell"
      [class.enterprise-detail-shell--stage]="pattern() === 'stage'"
      [attr.aria-busy]="state() === 'loading' ? 'true' : null"
    >
      @if (state() === 'loading') {
        <app-enterprise-detail-loading
          [showHero]="true"
          [showCards]="true"
          [showTimeline]="showTimelineSkeleton()"
          [showRelated]="showRelatedSkeleton()"
        />
      } @else {
        <div class="enterprise-detail-shell__hero">
          <ng-content select="[detailHero]" />
        </div>

        @if (pattern() === 'tabs' && tabs().length) {
          <app-enterprise-detail-tabs
            [tabs]="tabs()"
            [activeTabId]="activeTabId()"
            [ariaLabel]="tabsAriaLabel()"
            [idPrefix]="idPrefix()"
            (tabChange)="tabChange.emit($event)"
          />
        }

        @if (pattern() === 'stage' && stageSteps().length) {
          <div class="enterprise-detail-shell__stage">
            <app-enterprise-stage-tracker
              [steps]="stageSteps()"
              [activeStepId]="activeStageId()"
              [ariaLabel]="stageAriaLabel()"
              (stepSelect)="stageSelect.emit($event)"
            >
              <ng-content select="[detailStageExtra]" />
            </app-enterprise-stage-tracker>
          </div>
        }

        <div class="enterprise-detail-shell__chrome">
          <ng-content select="[detailChrome]" />
        </div>

        <div
          class="enterprise-detail-shell__body"
          [class.enterprise-detail-shell__body--with-aside]="showAside()"
        >
          <div class="enterprise-detail-shell__main" role="region" [attr.aria-label]="mainAriaLabel()">
            <ng-content select="[detailMain]" />
            <ng-content />
          </div>
          @if (showAside()) {
            <aside
              class="enterprise-detail-shell__aside"
              role="complementary"
              [attr.aria-label]="asideAriaLabel()"
            >
              <ng-content select="[detailAside]" />
            </aside>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-detail-shell {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-lg);
      width: 100%;
    }
    .enterprise-detail-shell__hero:empty,
    .enterprise-detail-shell__chrome:empty {
      display: none;
    }
    .enterprise-detail-shell__stage {
      margin-top: calc(var(--mpa-spacing-md) * -0.25);
    }
    .enterprise-detail-shell__body {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--mpa-spacing-xl);
      align-items: start;
      animation: enterprise-detail-body-fade var(--mpa-animation-duration-normal)
        var(--mpa-animation-easing-standard);
    }
    .enterprise-detail-shell__body--with-aside {
      grid-template-columns: minmax(0, 1fr) var(--mpa-layout-aside-width);
    }
    .enterprise-detail-shell__main {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xl);
      min-width: 0;
    }
    .enterprise-detail-shell__aside {
      position: sticky;
      top: var(--mpa-spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-lg);
      min-width: 0;
    }
    @keyframes enterprise-detail-body-fade {
      from {
        opacity: 0.7;
      }
      to {
        opacity: 1;
      }
    }
    @media (max-width: 1024px) {
      .enterprise-detail-shell__body--with-aside {
        grid-template-columns: minmax(0, 1fr);
      }
      .enterprise-detail-shell__aside {
        position: static;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailShellComponent {
  readonly state = input<EnterpriseDetailLifecycleState>('idle');
  readonly pattern = input<EnterpriseDetailChromePattern>('simple');
  readonly showAside = input(true);
  readonly tabs = input<readonly EnterpriseDetailTab[]>([]);
  readonly activeTabId = input('');
  readonly tabsAriaLabel = input('Detail sections');
  readonly idPrefix = input('detail');
  readonly stageSteps = input<readonly EnterpriseDetailStageStep[]>([]);
  readonly activeStageId = input<string | undefined>(undefined);
  readonly stageAriaLabel = input('Process stages');
  readonly mainAriaLabel = input('Record details');
  readonly asideAriaLabel = input('Record context');
  readonly showTimelineSkeleton = input(false);
  readonly showRelatedSkeleton = input(false);

  readonly tabChange = output<string>();
  readonly stageSelect = output<string>();
}
