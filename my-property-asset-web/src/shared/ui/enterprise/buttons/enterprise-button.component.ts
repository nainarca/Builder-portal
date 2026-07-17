import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';
import { EnterpriseButtonVariant } from '../models/enterprise.models';

/**
 * DS-03 Enterprise Button — maps approved variants onto PrimeNG-compatible app-button.
 */
@Component({
  selector: 'app-enterprise-button',
  imports: [ButtonComponent],
  template: `
    <app-button
      [label]="variant() === 'icon' ? undefined : label()"
      [icon]="icon()"
      [iconPos]="iconPos()"
      [severity]="mappedSeverity()"
      [outlined]="isOutlined()"
      [text]="isText()"
      [rounded]="rounded() || variant() === 'icon'"
      [loading]="loading()"
      [disabled]="disabled()"
      [size]="size()"
      [type]="type()"
      [ariaLabel]="ariaLabel() || (variant() === 'icon' ? label() : undefined)"
      (clicked)="clicked.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'enterprise-button' },
})
export class EnterpriseButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly iconPos = input<'left' | 'right' | 'top' | 'bottom'>('left');
  readonly variant = input<EnterpriseButtonVariant>('primary');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly rounded = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<MouseEvent>();

  readonly mappedSeverity = computed(() => {
    switch (this.variant()) {
      case 'secondary':
      case 'ghost':
      case 'text':
        return 'secondary' as const;
      case 'danger':
        return 'danger' as const;
      case 'success':
        return 'success' as const;
      case 'outline':
      case 'icon':
      case 'primary':
      default:
        return 'primary' as const;
    }
  });

  readonly isOutlined = computed(() => this.variant() === 'outline');
  readonly isText = computed(
    () => this.variant() === 'ghost' || this.variant() === 'text' || this.variant() === 'icon',
  );
}

/** Semantic aliases — same component, fixed variant defaults via thin shells. */
@Component({
  selector: 'app-primary-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="primary" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-secondary-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="secondary" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-outline-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="outline" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutlineButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-danger-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="danger" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-success-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="success" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-ghost-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="ghost" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-text-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="text" [label]="label()" [icon]="icon()" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-icon-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button variant="icon" [label]="label()" [icon]="icon() || 'pi pi-ellipsis-h'" [loading]="loading()" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel() || label() || 'Action'" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}

@Component({
  selector: 'app-loading-button',
  imports: [EnterpriseButtonComponent],
  template: `<app-enterprise-button [variant]="variant()" [label]="label()" [icon]="icon()" [loading]="true" [disabled]="disabled()" [size]="size()" [type]="type()" [ariaLabel]="ariaLabel()" (clicked)="clicked.emit($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly variant = input<EnterpriseButtonVariant>('primary');
  readonly disabled = input(false);
  readonly size = input<'small' | 'large' | undefined>(undefined);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly clicked = output<MouseEvent>();
}
