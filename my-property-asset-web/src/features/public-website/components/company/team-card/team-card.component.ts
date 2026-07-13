import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LeadershipMember } from '../../../models/company.model';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  readonly member = input.required<LeadershipMember>();
}
