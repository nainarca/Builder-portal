import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cfg-settings-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav class="cfg-breadcrumb" aria-label="Breadcrumb">
      <ol class="cfg-breadcrumb__list">
        <li class="cfg-breadcrumb__item">
          <a routerLink="/super-admin/settings" class="cfg-breadcrumb__link">Settings</a>
        </li>
        @if (category()) {
          <li class="cfg-breadcrumb__item" aria-hidden="true">
            <i class="pi pi-angle-right cfg-breadcrumb__separator"></i>
          </li>
          <li class="cfg-breadcrumb__item">
            <span
              class="cfg-breadcrumb__current"
              [class.cfg-breadcrumb__current--muted]="!!section()"
              [attr.aria-current]="section() ? null : 'page'"
            >
              {{ category() }}
            </span>
          </li>
        }
        @if (section()) {
          <li class="cfg-breadcrumb__item" aria-hidden="true">
            <i class="pi pi-angle-right cfg-breadcrumb__separator"></i>
          </li>
          <li class="cfg-breadcrumb__item">
            <span class="cfg-breadcrumb__current" aria-current="page">{{ section() }}</span>
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .cfg-breadcrumb {
      display: block;
    }
    .cfg-breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .cfg-breadcrumb__item {
      display: inline-flex;
      align-items: center;
    }
    .cfg-breadcrumb__link {
      color: var(--mpa-color-text-muted);
      text-decoration: none;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      transition: color 0.15s ease;
    }
    .cfg-breadcrumb__link:hover {
      color: var(--mpa-color-primary);
    }
    .cfg-breadcrumb__separator {
      color: var(--mpa-color-text-muted);
      font-size: 0.7rem;
    }
    .cfg-breadcrumb__current {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-breadcrumb__current--muted {
      font-weight: 500;
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsBreadcrumbComponent {
  readonly category = input<string>('');
  readonly section = input<string>('');
}
