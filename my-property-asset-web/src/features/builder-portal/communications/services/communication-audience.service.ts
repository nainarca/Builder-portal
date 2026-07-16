import { Injectable, inject } from '@angular/core';

import { InMemoryBuilderBuildingRepository } from '../../projects/buildings/repositories/in-memory-builder-building.repository';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import {
  CommunicationAudienceConfig,
  CommunicationAudienceType,
} from '../models/communication.model';

export interface CommunicationRecipient {
  readonly ownerId: string;
  readonly ownerName: string;
  readonly assignmentId: string;
  readonly unitId: string;
  readonly projectId: string;
}

@Injectable({ providedIn: 'root' })
export class CommunicationAudienceService {
  private readonly owners = inject(OwnerStoreService);
  private readonly units = inject(UnitStoreService);
  private readonly buildings = inject(InMemoryBuilderBuildingRepository);

  resolveRecipients(
    audienceType: CommunicationAudienceType,
    config: CommunicationAudienceConfig,
  ): readonly CommunicationRecipient[] {
    const assignments = this.owners
      .assignments()
      .filter((assignment) => assignment.status === 'active');

    const recipients = assignments
      .map((assignment) => {
        const unit = this.units.getById(assignment.unitId);
        return {
          ownerId: assignment.ownerId,
          ownerName: assignment.ownerName,
          assignmentId: assignment.id,
          unitId: assignment.unitId,
          projectId: assignment.projectId,
          unitType: unit?.unitType,
          towerName: unit?.towerName,
        };
      })
      .filter((item) => this.matchesAudience(item, audienceType, config));

    const unique = new Map<string, CommunicationRecipient>();
    for (const recipient of recipients) {
      unique.set(recipient.ownerId, {
        ownerId: recipient.ownerId,
        ownerName: recipient.ownerName,
        assignmentId: recipient.assignmentId,
        unitId: recipient.unitId,
        projectId: recipient.projectId,
      });
    }
    return [...unique.values()];
  }

  private matchesAudience(
    item: {
      ownerId: string;
      ownerName: string;
      assignmentId: string;
      unitId: string;
      projectId: string;
      unitType?: string;
      towerName?: string;
    },
    audienceType: CommunicationAudienceType,
    config: CommunicationAudienceConfig,
  ): boolean {
    switch (audienceType) {
      case 'all_owners':
        return true;
      case 'by_project':
        return !!config.projectId && item.projectId === config.projectId;
      case 'by_building': {
        if (!config.buildingId) {
          return false;
        }
        const building = this.buildings.getById(config.buildingId);
        if (!building) {
          return false;
        }
        return (
          item.projectId === building.projectId &&
          (!building.towerName || item.towerName === building.towerName)
        );
      }
      case 'by_unit':
        return !!config.unitIds?.includes(item.unitId);
      case 'selected_owners':
        return !!config.ownerIds?.includes(item.ownerId);
      case 'by_property_type':
        return !!config.propertyType && item.unitType === config.propertyType;
      default:
        return false;
    }
  }
}
