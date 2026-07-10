import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton',
  imports: [Skeleton],
  template: `
    <p-skeleton
      [width]="width()"
      [height]="height()"
      [shape]="shape()"
      [borderRadius]="borderRadius()"
    />
  `,
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly shape = input<'rectangle' | 'circle'>('rectangle');
  readonly borderRadius = input<string | undefined>(undefined);
}
